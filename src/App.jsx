import { useEffect, useMemo, useRef, useState } from "react";
import { ClassroomView } from "./components/ClassroomView.jsx";
import { MappingView } from "./components/MappingView.jsx";
import { DEFAULT_LIMIT, DEFAULT_SENSITIVITY, average, createRecord, validateLimit, validateSensitivity } from "./model.js";
import { useMicrophone } from "./hooks/useMicrophone.js";
import { usePersistentState } from "./hooks/usePersistentState.js";

const KEYS = { limit: "school-noise-limit", sensitivity: "school-noise-sensitivity", records: "school-noise-records" };

export default function App() {
  const [mode, setMode] = useState("classroom");
  const [limit, setLimit] = usePersistentState(KEYS.limit, DEFAULT_LIMIT);
  const [sensitivity, setSensitivity] = usePersistentState(KEYS.sensitivity, DEFAULT_SENSITIVITY);
  const [records, setRecords] = usePersistentState(KEYS.records, []);
  const microphone = useMicrophone();
  const samplesRef = useRef([]);
  const [message, setMessage] = useState("");
  const [monitor, setMonitor] = useState({ level: 30, alert: false, status: "Monitor sin iniciar", stateCode: "standby" });
  const [measurement, setMeasurement] = useState({ value: 30, status: "Sin iniciar", ready: false, samples: 0 });
  const redSince = useRef(0);
  const belowSince = useRef(0);
  const alertSounded = useRef(false);

  const validRecords = useMemo(() => Array.isArray(records) ? records.flatMap((record) => {
    if (!record || typeof record !== "object") return [];
    const normalized = createRecord(record);
    return normalized ? [{ ...normalized, id: record.id || normalized.id, measuredAt: record.measuredAt || normalized.measuredAt }] : [];
  }) : [], [records]);

  useEffect(() => {
    if (!microphone.sample) return;
    const sample = microphone.sample;
    if (sample.peak >= 0.999) return;
    if (microphone.mode === "mapping" && sample.rms < 0.0001) {
      setMeasurement((current) => ({ ...current, status: "Señal demasiado baja" }));
      return;
    }
    const now = performance.now();
    samplesRef.current = [...samplesRef.current, { level: sample.level, at: now }].filter((item) => now - item.at <= 5000);
    const recent = samplesRef.current.filter((item) => now - item.at <= 1000).map((item) => item.level);
    const current = average(recent) ?? sample.level;
    if (microphone.mode === "classroom") {
      if (current >= limit) { belowSince.current = 0; if (!redSince.current) redSince.current = now; }
      else { redSince.current = 0; if (!belowSince.current) belowSince.current = now; }
      const alert = monitor.alert ? !(belowSince.current && now - belowSince.current >= 2000) : Boolean(redSince.current && now - redSince.current >= 1000);
      setMonitor({ level: current, alert, status: alert ? "Demasiado ruido" : "Nivel adecuado", stateCode: alert ? "alerta" : "adecuado" });
    }
    if (microphone.mode === "mapping") {
      const ready = now - microphone.startedAt >= 5000;
      setMeasurement({ value: current, status: ready ? "Midiendo" : "Estabilizando medición", ready, samples: samplesRef.current.length });
    }
  }, [microphone.sample, microphone.mode, microphone.startedAt, limit, monitor.alert]);

  useEffect(() => {
    if (monitor.alert && !alertSounded.current) microphone.playAlert();
    alertSounded.current = monitor.alert;
  }, [microphone.playAlert, monitor.alert]);

  useEffect(() => {
    if (!microphone.mode) {
      samplesRef.current = [];
      redSince.current = 0;
      belowSince.current = 0;
      alertSounded.current = false;
      setMeasurement({ value: 30, status: "Detenida", ready: false, samples: 0 });
      if (mode === "classroom") setMonitor((current) => ({ ...current, alert: false, status: "Monitor detenido", stateCode: "detenido" }));
    }
  }, [microphone.mode, mode]);

  function changeMode(nextMode) {
    if (mode === nextMode) return;
    microphone.stop();
    setMode(nextMode);
    setMessage("");
  }

  function changeLimit(value) {
    setLimit(validateLimit(value));
  }

  function changeSensitivity(value) {
    setSensitivity(validateSensitivity(value));
  }

  function startClassroom() {
    setMonitor((current) => ({ ...current, status: "Solicitando acceso al micrófono", stateCode: "solicitando" }));
    microphone.start("classroom");
  }

  function startMapping() {
    setMeasurement({ value: 30, status: "Solicitando acceso al micrófono", ready: false, samples: 0 });
    microphone.start("mapping");
  }

  function addRecord(record) {
    setRecords((current) => [...(Array.isArray(current) ? current : []), record]);
  }

  function deleteRecord(id) {
    if (!window.confirm("¿Eliminar esta medición?")) return;
    setRecords((current) => current.filter((record) => record.id !== id));
  }

  const classroomError = microphone.error ? errorLabel(microphone.error) : "";
  const errorMessage = microphone.error ? errorMessageFor(microphone.error) : "";
  const mappingStatus = classroomError || measurement.status;

  return <>
    <header className="site-header"><a className="wordmark" href="#aula" aria-label="Ruido de aula, ir al modo aula" onClick={(event) => { event.preventDefault(); changeMode("classroom"); }}><span className="wordmark-mark" aria-hidden="true">◉</span><span>ruido<br /><em>de aula</em></span></a><p className="header-note">monitor escolar <span aria-hidden="true">/</span> v1</p></header>
    <main>
      <section className="intro-strip" aria-label="Propósito de la aplicación"><p className="eyebrow">Herramienta de observación</p><p className="intro-copy">Una lectura aproximada para que el aula pueda verse y volver a encontrar su ritmo.</p></section>
      <nav className="mode-nav" aria-label="Modos de uso"><button className={`mode-tab ${mode === "classroom" ? "is-active" : ""}`} type="button" aria-pressed={mode === "classroom"} onClick={() => changeMode("classroom")}>01 / Aula</button><button className={`mode-tab ${mode === "mapping" ? "is-active" : ""}`} type="button" aria-pressed={mode === "mapping"} onClick={() => changeMode("mapping")}>02 / Cartografía</button></nav>
      {(message || errorMessage) && <div className="global-message" role="status" aria-live="polite">{message || errorMessage}</div>}
      {mode === "classroom" ? <ClassroomView monitor={{ ...monitor, volume: microphone.mode === "classroom" ? Number(microphone.sample?.volume) || 0 : 0, active: microphone.active, status: classroomError || (microphone.status === "requesting" ? "Solicitando acceso al micrófono" : monitor.status) }} limit={validateLimit(limit)} sensitivity={validateSensitivity(sensitivity)} onLimit={changeLimit} onSensitivity={changeSensitivity} onStart={startClassroom} onStop={microphone.stop} onMessage={setMessage} /> : <MappingView records={validRecords} microphone={microphone} measurement={{ ...measurement, status: mappingStatus }} onStart={startMapping} onStop={microphone.stop} onRecord={addRecord} onDelete={deleteRecord} />}
    </main>
    <footer className="site-footer"><span>Ruido de aula</span><span>El sonido se analiza localmente en este dispositivo.</span></footer>
  </>;
}

function errorLabel(error) {
  if (error.message === "secure-context") return "Contexto no seguro";
  if (error.message === "audio-context") return "Audio no compatible";
  if (error.name === "NotAllowedError") return "Permiso denegado";
  if (error.name === "NotFoundError") return "Micrófono no disponible";
  if (error.name === "NotReadableError") return "Micrófono ocupado";
  return "Error de captura";
}

function errorMessageFor(error) {
  if (error.message === "secure-context") return "El micrófono requiere HTTPS o localhost.";
  if (error.message === "audio-context") return "Este navegador no permite analizar el audio del micrófono.";
  if (error.name === "NotAllowedError") return "Permiso denegado. Habilita el micrófono en la configuración del navegador e inténtalo nuevamente.";
  if (error.name === "NotFoundError") return "Micrófono no disponible en este dispositivo.";
  if (error.name === "NotReadableError") return "El micrófono está ocupado, se desconectó o dejó de estar disponible.";
  return "Error de captura. Verifica el micrófono e inténtalo nuevamente.";
}
