import { MonitorScene } from "./MonitorScene.jsx";

export function ClassroomView({ monitor, limit, sensitivity, onLimit, onSensitivity, onStart, onStop, onMessage }) {
  return <section className="view classroom-view" aria-labelledby="classroom-title">
    <div className="view-heading"><div><p className="eyebrow">Modo principal</p><h1 id="classroom-title">El aula, <span>en claro.</span></h1></div><p className="heading-aside">El monitor funciona mientras esta página permanece abierta y visible.</p></div>
    <div className="classroom-grid">
      <MonitorScene {...monitor} limit={limit} sensitivity={sensitivity} onStart={onStart} onStop={onStop} onMessage={onMessage} />
      <aside className="classroom-aside">
        <div className="limit-card"><div className="section-kicker"><span>01</span><span>Límite del aula</span></div><label htmlFor="noise-limit">El nivel de alerta empieza aquí</label><div className="limit-input-row"><input id="noise-limit" type="number" min="40" max="100" step="1" value={limit} inputMode="numeric" onChange={(event) => onLimit(event.target.value)} /><span>dB</span></div><input className="range-input" type="range" min="40" max="100" step="1" value={limit} onChange={(event) => onLimit(event.target.value)} aria-label="Límite de ruido en dB" /><p id="limit-help" className="small-note">Puedes cambiarlo antes o durante el monitoreo. Se conserva en este dispositivo.</p><label className="sensitivity-label" htmlFor="noise-sensitivity">Sensibilidad visual <output>{sensitivity}</output></label><input id="noise-sensitivity" className="range-input" type="range" min="0" max="100" step="1" value={sensitivity} onChange={(event) => onSensitivity(event.target.value)} aria-describedby="sensitivity-help" /><p id="sensitivity-help" className="small-note">Ajusta el movimiento de las caritas, no modifica los dB ni los registros.</p></div>
        <div className="precision-note"><span className="note-symbol" aria-hidden="true">i</span><p>Estos valores dependen del micrófono y del dispositivo. Sirven para comparar condiciones similares, pero no son una medición acústica profesional o calibrada.</p></div>
      </aside>
    </div>
  </section>;
}
