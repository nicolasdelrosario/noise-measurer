import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../src/App.jsx";

const physics = vi.hoisted(() => vi.fn());
vi.mock("../src/hooks/useEmojiPhysics.js", () => ({ useEmojiPhysics: physics }));

vi.mock("../src/audio.js", () => ({
  MicrophoneCapture: class {
    constructor(onLevel) { this.onLevel = onLevel; }
    async start() { this.onLevel({ level: 70, rms: 0.1, peak: 0.2, volume: 42 }); return true; }
    stop() {}
  },
}));

describe("App", () => {
  afterEach(() => { cleanup(); physics.mockClear(); });

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
    await waitFor(() => expect(physics).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ volume: 42, sensitivity: 50 })));
  });
});
