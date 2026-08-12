import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App.jsx";

const mocks = vi.hoisted(() => ({ physics: vi.fn(), playAlert: vi.fn(), emit: null }));
vi.mock("../src/hooks/useEmojiPhysics.js", () => ({ useEmojiPhysics: mocks.physics }));

vi.mock("../src/audio.js", () => ({
  MicrophoneCapture: class {
    constructor(onLevel) { this.onLevel = onLevel; mocks.emit = onLevel; }
    async start() { this.onLevel({ level: 70, rms: 0.1, peak: 0.2, volume: 42 }); return true; }
    playAlert() { mocks.playAlert(); }
    stop() {}
  },
}));

describe("App", () => {
  afterEach(() => { cleanup(); mocks.physics.mockClear(); mocks.playAlert.mockClear(); vi.restoreAllMocks(); });

  it("opens in classroom mode", () => {
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: vi.fn() });
    render(<App />);
    expect(screen.getByRole("heading", { name: /El aula, en claro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Iniciar monitor/i })).toBeInTheDocument();
  });

  it("routes raw microphone volume to visual physics", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: vi.fn() });
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Iniciar monitor/i }));
    await waitFor(() => expect(mocks.physics).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ volume: 42, sensitivity: 50 })));
  });

  it("sounds once per transition into alert", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null, setItem: vi.fn() });
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Iniciar monitor/i }));
    const emit = async (level, time) => {
      now = time;
      await act(async () => mocks.emit({ level, rms: 0.1, peak: 0.2, volume: 42 }));
    };
    await emit(80, 100);
    await emit(80, 1200);
    await screen.findByRole("heading", { name: "Demasiado ruido" });
    await waitFor(() => expect(mocks.playAlert).toHaveBeenCalledTimes(1));
    await emit(80, 1500);
    expect(mocks.playAlert).toHaveBeenCalledTimes(1);
    await emit(40, 2600);
    await emit(40, 4700);
    await emit(80, 4800);
    await emit(80, 5900);
    await emit(80, 7000);
    await waitFor(() => expect(mocks.playAlert).toHaveBeenCalledTimes(2));
  });
});
