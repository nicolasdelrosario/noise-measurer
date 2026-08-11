import { describe, expect, it, vi } from "vitest";
import { elasticityFor, force, stepPhysics, targetCount } from "../src/hooks/useEmojiPhysics.js";

describe("Bouncy Balls emoji physics", () => {
  it("uses the public density and sensitivity formulas", () => {
    expect(targetCount(400, 300)).toBe(36);
    expect(targetCount(1200, 800)).toBe(62);
    expect(elasticityFor(0)).toBe(0.1);
    expect(elasticityFor(50)).toBe(1);
    expect(elasticityFor(100)).toBe(2);
  });

  it("uses Verlet force extrapolation and audio impulse before gravity substeps", () => {
    const body = { x: 10, y: 100, px: 8, py: 100, radius: 22, angle: 0 };
    force(body, 0, -2);
    expect(body).toMatchObject({ x: 12, y: 96, px: 10, py: 98 });

    vi.spyOn(Math, "random").mockReturnValue(0);
    const scene = { width: 200, height: 200, elasticity: 1, bodies: [{ x: 100, y: 170, px: 100, py: 170, radius: 22, angle: 0 }] };
    stepPhysics(scene, 1, 30);
    expect(scene.bodies[0].y).toBeCloseTo(154.833333, 5);
    Math.random.mockRestore();
  });
});
