## Why

La institución necesita una herramienta web sencilla para ayudar al profesor a controlar visualmente el ruido del aula y, como función secundaria, comparar mediciones tomadas en distintas zonas. El cambio convierte el alcance funcional aprobado en una aplicación utilizable desde un teléfono o un proyector, sin depender de cuentas, servicios externos ni almacenamiento de audio.

## What Changes

- Crear el `Modo aula` como pantalla inicial y función principal.
- Mostrar un monitor visual con caritas amarillas y rojas que reaccionen al nivel de ruido.
- Permitir ajustar y conservar localmente el límite de ruido del aula.
- Solicitar y analizar el micrófono localmente, sin grabar, almacenar ni transmitir audio.
- Ofrecer pantalla completa y solicitar mantener la pantalla encendida cuando el navegador lo permita.
- Crear el `Modo cartografía` como función secundaria para medir las diez zonas predefinidas.
- Persistir mediciones en `localStorage` y permitir consultar, eliminar y conservar registros al recargar.
- Mostrar tabla, gráfico de barras y cartografía usando los mismos registros y promedios por zona.
- Informar estados y errores relacionados con permisos, micrófono, estabilización, persistencia y capacidades del navegador.
- Aplicar Hallmark a las decisiones visuales y al refinamiento de la interfaz sin alterar los requisitos funcionales.
- Migrar la capa de interfaz a React sobre Vite, manteniendo el análisis de audio, Canvas y persistencia local.
- Mantener fuera de alcance usuarios, nube, sincronización, grabación o reproducción de audio y control remoto.

## Capabilities

### New Capabilities

- `school-noise-monitor`: monitor visual del aula, mediciones locales por zona, persistencia, clasificación, tabla, gráfico y cartografía.

### Modified Capabilities

- Ninguna. No existen especificaciones principales previas en `openspec/specs/`.

## Impact

- Nueva interfaz web responsive para móvil y proyector, con el `Modo aula` como entrada predeterminada.
- Acceso al micrófono mediante las APIs del navegador y análisis local de la señal.
- Persistencia local del límite y de las mediciones mediante `localStorage`.
- Nuevas vistas y lógica compartida para registros, promedios, clasificación de colores, gráfico y cartografía.
- Hallmark como guía visual, con accesibilidad, responsive design y preservación de cualquier sistema de diseño existente.
- React como capa de presentación y ciclo de vida, sin introducir backend ni estado global remoto.
- No se requieren cuentas, backend, APIs remotas, sincronización ni dependencias de audio en la nube.
