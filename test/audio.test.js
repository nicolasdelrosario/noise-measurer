import { afterEach, describe, expect, it, vi } from "vitest";
import { MicrophoneCapture } from "../src/audio.js";

describe("MicrophoneCapture", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("reports Bouncy Balls frequency volume independently from dB", async () => {
    const analyser = {
      frequencyBinCount: 512,
      getFloatTimeDomainData(data) { data.fill(0.1); },
      getByteFrequencyData(data) { data.fill(24); },
      disconnect() {},
    };
    const context = {
      createAnalyser: () => analyser,
      createMediaStreamSource: () => ({ connect() {}, disconnect() {} }),
      resume: vi.fn(),
      close: vi.fn(),
    };
    const track = { addEventListener() {}, stop() {} };
    vi.stubGlobal("AudioContext", class { constructor() { return context; } });
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [track] })) } });
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    const onLevel = vi.fn();

    const capture = new MicrophoneCapture(onLevel);
    await capture.start();

    expect(context.resume).toHaveBeenCalled();
    expect(analyser.fftSize).toBe(1024);
    expect(analyser.smoothingTimeConstant).toBe(0.3);
    expect(onLevel.mock.calls[0][0].volume).toBe(24);
    expect(onLevel.mock.calls[0][0].rms).toBeCloseTo(0.1);
    capture.stop();
  });

  it("plays one filtered shush at a time and stops it with capture", async () => {
    const source = { connect: vi.fn(), disconnect: vi.fn(), start: vi.fn(), stop: vi.fn(), onended: null };
    const filter = { connect: vi.fn(), disconnect: vi.fn(), frequency: {}, Q: {} };
    const gain = { connect: vi.fn(), disconnect: vi.fn(), gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() } };
    const analyser = { frequencyBinCount: 512, getFloatTimeDomainData(data) { data.fill(0); }, getByteFrequencyData(data) { data.fill(0); }, disconnect() {} };
    const context = {
      currentTime: 2,
      sampleRate: 1000,
      destination: {},
      createAnalyser: () => analyser,
      createMediaStreamSource: () => ({ connect() {}, disconnect() {} }),
      createBuffer: vi.fn(() => ({ getChannelData: () => new Float32Array(550) })),
      createBufferSource: vi.fn(() => source),
      createBiquadFilter: vi.fn(() => filter),
      createGain: vi.fn(() => gain),
      resume: vi.fn(),
      close: vi.fn(),
    };
    const track = { addEventListener() {}, stop() {} };
    vi.stubGlobal("AudioContext", class { constructor() { return context; } });
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [track] })) } });
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });

    const capture = new MicrophoneCapture(() => {});
    await capture.start();
    capture.playAlert();
    capture.playAlert();

    expect(context.createBufferSource).toHaveBeenCalledTimes(1);
    expect(filter).toMatchObject({ type: "bandpass", frequency: { value: 1800 }, Q: { value: 0.7 } });
    expect(source.start).toHaveBeenCalledWith(2);
    expect(source.stop).toHaveBeenCalledWith(2.55);
    capture.stop();
    expect(source.stop).toHaveBeenCalledTimes(2);
  });

  it("captures with webkitAudioContext even when resume rejects", async () => {
    const analyser = { frequencyBinCount: 512, getFloatTimeDomainData(data) { data.fill(0.05); }, getByteFrequencyData(data) { data.fill(10); }, disconnect() {} };
    const context = {
      createAnalyser: () => analyser,
      createMediaStreamSource: () => ({ connect() {}, disconnect() {} }),
      resume: vi.fn().mockRejectedValue(new DOMException("blocked", "NotAllowedError")),
      close: vi.fn(),
    };
    const getUserMedia = vi.fn(async () => ({ getTracks: () => [{ addEventListener() {}, stop() {} }] }));
    vi.stubGlobal("AudioContext", undefined);
    Object.defineProperty(window, "webkitAudioContext", { configurable: true, value: class { constructor() { return context; } } });
    vi.stubGlobal("requestAnimationFrame", vi.fn(() => 1));
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia } });
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    const onLevel = vi.fn();

    const capture = new MicrophoneCapture(onLevel);
    await expect(capture.start()).resolves.toBe(true);

    expect(context.resume).toHaveBeenCalled();
    expect(getUserMedia).toHaveBeenCalledWith({ audio: true });
    expect(onLevel).toHaveBeenCalled();
    capture.stop();
  });
});
