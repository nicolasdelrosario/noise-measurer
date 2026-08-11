import { useEffect, useRef, useState } from "react";
import { useEmojiPhysics } from "../hooks/useEmojiPhysics.js";

export function MonitorScene({ level, volume, alert, active, status, stateCode, limit, sensitivity, onStart, onStop, onMessage }) {
  const cardRef = useRef(null);
  const canvasRef = useRef(null);
  const [fullscreen, setFullscreen] = useState(false);
  useEmojiPhysics(canvasRef, { volume, sensitivity });

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  async function toggleFullscreen() {
    if (!cardRef.current?.requestFullscreen) { onMessage("El navegador no permite pantalla completa. El monitor seguirá funcionando."); return; }
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await cardRef.current.requestFullscreen(); } catch { onMessage("El navegador no permite pantalla completa. El monitor seguirá funcionando."); }
  }

  return <article ref={cardRef} className="monitor-card" aria-labelledby="monitor-status">
    <div className="monitor-topline">
      <span className="capture-indicator" data-active={active}><span className="indicator-dot" aria-hidden="true" /> {active ? "micrófono activo" : "micrófono inactivo"}</span>
      <span className="monitor-label">lectura en vivo</span>
    </div>
    <div className="monitor-reading"><span className="db-number">{Number.isFinite(level) && active ? level.toFixed(1) : "--"}</span><span className="db-unit">dB</span></div>
    <div className="face-field">
      <canvas ref={canvasRef} className="monitor-canvas" aria-hidden="true" />
      {alert && <div className="fullscreen-alert" role="alert">Demasiado ruido</div>}
      <div className="fullscreen-status" role="status" aria-live="polite"><strong>{alert ? "Demasiado ruido" : status}</strong><div className="fullscreen-metrics"><span>{active && Number.isFinite(level) ? `${level.toFixed(1)} dB` : "-- dB"}</span><span>Límite {limit} dB</span><span>Sensibilidad {sensitivity}</span></div><button className="fullscreen-exit" type="button" onClick={toggleFullscreen}>Salir</button></div>
    </div>
    <div className="monitor-status-row">
      <div><p className="eyebrow">Estado del aula</p><h2 id="monitor-status" aria-live="polite">{status}</h2></div>
      <span className="state-code">{stateCode}</span>
    </div>
    <div className="monitor-actions">
      <button className="button button-primary" type="button" onClick={onStart} disabled={active}>Iniciar monitor <span aria-hidden="true">↗</span></button>
      <button className="button button-quiet" type="button" onClick={onStop} disabled={!active}>Detener</button>
      <button className="button button-quiet" type="button" onClick={toggleFullscreen}>{fullscreen ? "Salir de pantalla completa" : "Pantalla completa"}</button>
    </div>
  </article>;
}
