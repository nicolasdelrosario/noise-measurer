import { describe, expect, it } from "vitest";
import { DEFAULT_LIMIT, DEFAULT_SENSITIVITY, ZONES, average, averageByZone, classifyLevel, createRecord, validateLimit, validateSensitivity } from "../src/model.js";

describe("school noise model", () => {
  it("validates classroom limits and falls back to 70", () => {
    expect(validateLimit(40)).toBe(40);
    expect(validateLimit(100)).toBe(100);
    expect(validateLimit(101)).toBe(DEFAULT_LIMIT);
    expect(validateLimit("no number")).toBe(DEFAULT_LIMIT);
  });

  it("classifies the official dB scale", () => {
    expect(classifyLevel(49.9).name).toBe("Muy bajo");
    expect(classifyLevel(50).name).toBe("Bajo");
    expect(classifyLevel(60).name).toBe("Moderado");
    expect(classifyLevel(70).name).toBe("Alto");
    expect(classifyLevel(80).name).toBe("Muy alto");
  });

  it("keeps visual sensitivity inside its range", () => {
    expect(validateSensitivity(0)).toBe(0);
    expect(validateSensitivity(100)).toBe(100);
    expect(validateSensitivity(-1)).toBe(DEFAULT_SENSITIVITY);
    expect(validateSensitivity("unknown")).toBe(DEFAULT_SENSITIVITY);
  });

  it("averages only saved records by official zone", () => {
    const records = [
      createRecord({ id: "1", zone: ZONES[0], noiseLevel: 50, activity: "a", observation: "b" }),
      createRecord({ id: "2", zone: ZONES[0], noiseLevel: 70, activity: "c", observation: "d" }),
    ];
    expect(average([50, 70])).toBe(60);
    expect(averageByZone(records)[0].value).toBe(60);
    expect(averageByZone(records)[1]).toBeNull();
  });

  it("rejects incomplete measurements", () => {
    expect(createRecord({ zone: "unknown", noiseLevel: 50, activity: "a", observation: "b" })).toBeNull();
    expect(createRecord({ zone: ZONES[0], noiseLevel: 50, activity: "", observation: "b" })).toBeNull();
  });
});
