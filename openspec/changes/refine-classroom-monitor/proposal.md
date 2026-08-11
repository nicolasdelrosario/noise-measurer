## Why

La vista principal ya mide el ruido, pero su respuesta visual no reproduce la densidad, caída ni reactividad de Bouncy Balls y el modo de pantalla completa oculta información útil. Esta mejora busca igualar ese comportamiento sin introducir alertas sonoras ni alterar los registros.

## What Changes

- Dibujar emojis nativos en Canvas con la densidad automática de Bouncy Balls.
- Replicar su integración Verlet, gravedad, colisiones, rebote y respuesta al volumen espectral crudo.
- Añadir una sensibilidad visual persistente que controle la intensidad del movimiento sin modificar dB, límites ni clasificación.
- Mostrar en pantalla completa el nivel actual, el estado de alerta, el límite y la sensibilidad.
- Mantener la salida mediante `Escape` y el funcionamiento alternativo cuando fullscreen no esté disponible.
- Mantener fuera de alcance pitidos, mensajes de voz, `shush`, grabación de audio, nube y sincronización.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `school-noise-monitor`: añade sensibilidad visual persistente, emojis físicos reactivos y estado ampliado durante pantalla completa.

## Impact

- Componentes React del monitor y vista del aula.
- Hook de física Canvas y tokens CSS Hallmark.
- Persistencia local del nuevo ajuste de sensibilidad.
- Pruebas E2E con Playwright para validar vista principal, fullscreen, persistencia y responsive design.
- MCP de Playwright configurado solo para este proyecto en OpenCode.
- Especificación principal `openspec/specs/school-noise-monitor/spec.md` mediante delta al archivar.
- No se añaden dependencias externas.
