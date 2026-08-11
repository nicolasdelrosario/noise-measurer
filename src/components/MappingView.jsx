import { useMemo, useState } from "react";
import { ZONES, averageByZone, classifyLevel, createRecord } from "../model.js";

const mapLayout = [
  ["Entrada principal", "45 48", 180, 110, ["Entrada principal"]], ["Patio principal", "260 48", 195, 110, ["Patio principal"]], ["Losa deportiva", "490 48", 195, 110, ["Losa deportiva"]], ["Aulas - Pabellón A", "720 48", 130, 110, ["Aulas -", "Pabellón A"]],
  ["Aulas - Pabellón B", "45 200", 180, 78, ["Aulas - Pabellón B"]], ["Pasillos", "260 200", 195, 78, ["Pasillos"]], ["Biblioteca", "490 200", 195, 78, ["Biblioteca"]], ["Laboratorios", "720 200", 130, 78, ["Laboratorios"]],
  ["Tópico", "45 310", 180, 70, ["Tópico"]], ["Jardín / áreas verdes", "260 310", 590, 70, ["Jardín / áreas verdes"]],
];

export function MappingView({ records, microphone, measurement, onStart, onStop, onRecord, onDelete }) {
  const [form, setForm] = useState({ zone: ZONES[0], activity: "", observation: "" });
  const values = useMemo(() => averageByZone(records).filter(Boolean), [records]);
  const byZone = useMemo(() => new Map(values.map((item) => [item.zone, item])), [values]);
  const ready = measurement.ready && measurement.samples > 0;

  function submit(event) {
    event.preventDefault();
    const record = createRecord({ ...form, noiseLevel: measurement.value });
    if (!record || !ready) return;
    onRecord(record);
    setForm((current) => ({ ...current, activity: "", observation: "" }));
  }

  return <section className="view mapping-view" aria-labelledby="mapping-title">
    <div className="view-heading"><div><p className="eyebrow">Modo secundario</p><h1 id="mapping-title">Leer el espacio.</h1></div><p className="heading-aside">Registra una zona, una actividad y una observación. La comparación aparece con datos reales.</p></div>
    <div className="mapping-toolbar"><div><span className="capture-indicator" data-active={microphone.active}><span className="indicator-dot" aria-hidden="true" /> {microphone.active ? "micrófono activo" : "micrófono inactivo"}</span><p className="toolbar-state" role="status" aria-live="polite">{measurement.status}</p></div><div className="toolbar-reading"><span>{microphone.active && Number.isFinite(measurement.value) ? measurement.value.toFixed(1) : "--"}</span> <small>dB</small></div><div className="toolbar-actions"><button className="button button-primary" type="button" onClick={onStart} disabled={microphone.active}>Iniciar medición <span aria-hidden="true">↗</span></button><button className="button button-quiet" type="button" onClick={onStop} disabled={!microphone.active}>Detener</button></div></div>
    {microphone.active && <form className="measurement-form" onSubmit={submit}><div className="form-heading"><span className="eyebrow">Registro listo</span><p>Completa el contexto para guardar el promedio de los últimos 5 segundos.</p></div><label>Zona<select required value={form.zone} onChange={(event) => setForm({ ...form, zone: event.target.value })}>{ZONES.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</select></label><label>Actividad<input required maxLength="120" value={form.activity} onChange={(event) => setForm({ ...form, activity: event.target.value })} placeholder="Ej. trabajo en grupo" /></label><label>Observación<input required maxLength="160" value={form.observation} onChange={(event) => setForm({ ...form, observation: event.target.value })} placeholder="Ej. conversaciones cercanas" /></label><button className="button button-primary" type="submit" disabled={!ready}>Registrar medición <span aria-hidden="true">↗</span></button></form>}
    <div className="analytics-grid"><RecordsPanel records={records} onDelete={onDelete} /><ChartPanel values={values} /></div>
    <MapPanel byZone={byZone} />
  </section>;
}

function RecordsPanel({ records, onDelete }) {
  return <section className="analytics-panel records-panel" aria-labelledby="records-title"><div className="panel-heading"><div><p className="eyebrow">Archivo local</p><h2 id="records-title">Registros</h2></div><span className="count-badge">{records.length}</span></div>{records.length === 0 ? <div className="empty-state"><span className="empty-index">00</span><p>Todavía no existen mediciones</p><small>Inicia una medición para construir la cartografía.</small></div> : <div className="table-wrap"><table><caption className="sr-only">Mediciones guardadas</caption><thead><tr><th>Zona</th><th>Nivel</th><th>Actividad / observación</th><th>Fecha</th><th><span className="sr-only">Acción</span></th></tr></thead><tbody>{records.slice().reverse().map((record) => <tr key={record.id}><td>{record.zone}</td><td><strong>{record.noiseLevel.toFixed(1)} dB</strong><span className={`level-tag level-${classifyLevel(record.noiseLevel).token}`}>{record.level}</span></td><td><strong>{record.activity}</strong><small>{record.observation}</small></td><td>{new Date(record.measuredAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</td><td><button className="delete-button" type="button" onClick={() => onDelete(record.id)} aria-label={`Eliminar medición de ${record.zone}`}>Eliminar</button></td></tr>)}</tbody></table></div>}</section>;
}

function ChartPanel({ values }) {
  const max = Math.max(100, ...values.map((item) => item.value));
  return <section className="analytics-panel chart-panel" aria-labelledby="chart-title"><div className="panel-heading"><div><p className="eyebrow">Promedio por zona</p><h2 id="chart-title">Comparación</h2></div><span className="panel-meta">dB</span></div>{values.length === 0 ? <div className="empty-state compact"><p>Todavía no existen mediciones</p></div> : <svg className="zone-chart" viewBox="0 0 680 280" role="img" aria-labelledby="chart-title chart-description"><desc id="chart-description">Promedio de nivel de ruido por zona</desc><line className="chart-grid" x1="16" y1="235" x2="664" y2="235" />{values.map((item, index) => { const x = 20 + index * ((680 - 32) / values.length); const height = (item.value / max) * 185; const y = 235 - height; return <g key={item.zone}><rect className={`chart-bar chart-${item.level.token}`} x={x} y={y} width={Math.min(42, (680 - 32) / values.length - 7)} height={height} /><text className="chart-value" x={x + 18} y={y - 7} textAnchor="middle">{item.value.toFixed(0)}</text><text className="chart-label" x={x + 18} y="255" textAnchor="middle" transform={`rotate(35 ${x + 18} 255)`}>{item.zone.replace("Aulas - ", "").replace(" / áreas verdes", "").slice(0, 11)}</text></g>; })}</svg>}</section>;
}

function MapPanel({ byZone }) {
  return <section className="map-panel" aria-labelledby="map-title"><div className="panel-heading"><div><p className="eyebrow">Plano institucional</p><h2 id="map-title">Cartografía de sonido</h2></div><span className="panel-meta">10 zonas</span></div><div className="map-layout"><div className="institution-map"><svg viewBox="0 0 900 430" role="img" aria-labelledby="map-title map-description"><desc id="map-description">Plano esquemático de las diez zonas de la institución. Las zonas con mediciones muestran su promedio.</desc><path className="map-boundary" d="M28 32h844v366H28z" /><path className="map-path" d="M40 180h820M40 290h820M245 40v350M475 40v350M700 40v350" />{mapLayout.map(([zone, position, width, height, labels], index) => { const value = byZone.get(zone); const labelY = height < 90 ? 34 : 44; return <g key={zone} className={`map-zone ${value ? `level-${value.level.token}` : ""}`} data-zone={zone} transform={`translate(${position})`}><rect width={width} height={height} rx="2" /><text x="12" y="18">{String(index + 1).padStart(2, "0")}</text>{labels.map((label, labelIndex) => <text key={label} x="12" y={labelY + labelIndex * 16}>{label}</text>)}<text className="map-value" x="12" y={height - 10}>{value ? `${value.value.toFixed(1)} dB / ${value.level.name}` : "sin datos"}</text></g>; })}</svg></div><div className="map-legend"><p className="eyebrow">Escala</p><div><i className="legend-dot blue" />Muy bajo &lt; 50</div><div><i className="legend-dot green" />Bajo 50–59</div><div><i className="legend-dot yellow" />Moderado 60–69</div><div><i className="legend-dot orange" />Alto 70–79</div><div><i className="legend-dot red" />Muy alto 80+</div></div></div></section>;
}
