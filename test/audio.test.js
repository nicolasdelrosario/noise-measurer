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
});
