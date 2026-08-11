import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MonitorScene } from "../src/components/MonitorScene.jsx";

vi.mock("../src/hooks/useEmojiPhysics.js", () => ({ useEmojiPhysics: vi.fn() }));

describe("MonitorScene", () => {
  afterEach(cleanup);

  it("renders the centered fullscreen warning only during an alert", () => {
    const props = { level: 80, volume: 20, alert: true, active: true, status: "Demasiado ruido", stateCode: "alerta", limit: 70, sensitivity: 50, onStart() {}, onStop() {}, onMessage() {} };
    const { rerender } = render(<MonitorScene {...props} />);
    expect(screen.getByRole("alert")).toHaveTextContent("Demasiado ruido");
    rerender(<MonitorScene {...props} alert={false} status="Nivel adecuado" />);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
