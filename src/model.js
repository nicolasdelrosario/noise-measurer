export const DEFAULT_LIMIT = 70;
export const LIMIT_MIN = 40;
export const LIMIT_MAX = 100;
export const DEFAULT_SENSITIVITY = 50;

export const ZONES = [
  "Entrada principal",
  "Patio principal",
  "Losa deportiva",
  "Aulas - Pabellón A",
  "Aulas - Pabellón B",
  "Pasillos",
  "Biblioteca",
  "Laboratorios",
  "Tópico",
  "Jardín / áreas verdes",
];

export const LEVELS = [
  { max: 50, name: "Muy bajo", color: "Azul", token: "blue" },
  { max: 60, name: "Bajo", color: "Verde", token: "green" },
  { max: 70, name: "Moderado", color: "Amarillo", token: "yellow" },
  { max: 80, name: "Alto", color: "Naranja", token: "orange" },
  { max: Infinity, name: "Muy alto", color: "Rojo", token: "red" },
];

export function validateLimit(value) {
  const limit = Number(value);
  return Number.isFinite(limit) && limit >= LIMIT_MIN && limit <= LIMIT_MAX ? Math.round(limit) : DEFAULT_LIMIT;
}

export function validateSensitivity(value) {
  const sensitivity = Number(value);
  return Number.isFinite(sensitivity) && sensitivity >= 0 && sensitivity <= 100 ? Math.round(sensitivity) : DEFAULT_SENSITIVITY;
}

export function classifyLevel(value) {
  const level = Number(value);
  if (!Number.isFinite(level)) return LEVELS[0];
  return LEVELS.find((item) => level < item.max) ?? LEVELS.at(-1);
}

export function average(values) {
  const numbers = values.map(Number).filter(Number.isFinite);
  return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : null;
}

export function averageByZone(records) {
  return ZONES.map((zone) => {
    const values = records.filter((record) => record.zone === zone).map((record) => record.noiseLevel);
    const value = average(values);
    return value === null ? null : { zone, value, level: classifyLevel(value) };
  });
}

export function createRecord({ zone, noiseLevel, activity, observation, measuredAt = new Date().toISOString(), id = crypto.randomUUID() }) {
  if (!ZONES.includes(zone) || !activity?.trim() || !observation?.trim() || !Number.isFinite(Number(noiseLevel))) return null;
  const level = classifyLevel(noiseLevel);
  return { id, zone, noiseLevel: Number(noiseLevel), activity: activity.trim(), observation: observation.trim(), level: level.name, color: level.color, measuredAt };
}

export function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return { value: raw === null ? fallback : JSON.parse(raw), error: null };
  } catch (error) {
    return { value: fallback, error };
  }
}

export function saveLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return null;
  } catch (error) {
    return error;
  }
}
