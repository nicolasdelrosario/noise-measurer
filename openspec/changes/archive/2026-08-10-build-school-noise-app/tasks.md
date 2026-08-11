## 1. Base de la aplicación

- [x] 1.1 Crear la estructura mínima de la aplicación web y el punto de entrada que abra siempre en `Modo aula`.
- [x] 1.2 Definir las diez zonas oficiales, los estados de captura y el modelo de medición indicado en `docs/process.md`.
- [x] 1.3 Implementar la lectura y validación del límite del aula entre 40 y 100 dB, con valor predeterminado de 70 dB.

## 2. Persistencia y datos derivados

- [x] 2.1 Implementar almacenamiento local del límite y de los registros, incluyendo manejo recuperable de errores de `localStorage`.
- [x] 2.2 Implementar la clasificación oficial de niveles y colores sin modificar sus rangos.
- [x] 2.3 Implementar el cálculo de promedios por zona a partir únicamente de registros guardados.
- [x] 2.4 Implementar alta, eliminación confirmada y recarga de registros conservando estado vacío cuando no existan datos.

## 3. Captura y análisis del micrófono

- [x] 3.1 Implementar solicitud de permiso y estados para permiso pendiente, rechazado, bloqueado, micrófono no disponible y error de captura.
- [x] 3.2 Implementar análisis local de la señal mediante APIs del navegador, sin grabar, almacenar ni transmitir audio.
- [x] 3.3 Implementar búfer temporal para el promedio móvil aproximado de un segundo del monitor y el promedio de cinco segundos para guardar.
- [x] 3.4 Centralizar la detención y liberación de la captura para garantizar una sola captura activa y limpiar al cambiar de modo o salir.
- [x] 3.5 Informar contexto no seguro, señal cero, señal demasiado baja, saturación y suspensión de la pestaña sin guardar valores inválidos.

## 4. Modo aula

- [x] 4.1 Construir la pantalla inicial responsive con propósito, advertencia de precisión, límite, `Iniciar monitor` y acceso secundario a cartografía.
- [x] 4.2 Implementar el monitor continuo con nivel en dB, indicador visible de micrófono activo y estados `Nivel adecuado` y `Demasiado ruido`.
- [x] 4.3 Implementar caritas amarillas y rojas con cantidad y movimiento progresivos desde 10 dB por debajo del límite.
- [x] 4.4 Aplicar entrada en rojo tras un segundo sobre el límite y regreso progresivo a amarillo tras dos segundos bajo el límite.
- [x] 4.5 Permitir cambiar el límite durante el monitoreo sin crear registros ni detener la captura.
- [x] 4.6 Añadir pantalla completa y Wake Lock como capacidades opcionales, con mensajes cuando el navegador no las soporte.
- [x] 4.7 Implementar `Detener monitor` con liberación del micrófono y cancelación de Wake Lock.

## 5. Modo cartografía

- [x] 5.1 Construir el flujo de `Iniciar medición`, estabilización de cinco segundos, selección de zona, actividad, observación y registro repetible.
- [x] 5.2 Mantener visible `Detener` y el indicador de captura, habilitando `Registrar medición` solo cuando el formulario y las muestras sean válidos.
- [x] 5.3 Construir la tabla de registros con zona, nivel, clasificación, actividad, observación, fecha, hora y acción `Eliminar`.
- [x] 5.4 Construir el gráfico de barras con promedios por zona, valores numéricos y estado vacío sin barras ficticias.
- [x] 5.5 Construir la cartografía con el plano de la institución, las diez zonas, sus promedios y colores, sin completar zonas sin datos.
- [x] 5.6 Verificar que tabla, gráfico y cartografía se actualicen juntos al registrar y eliminar mediciones.

## 6. Verificación

- [x] 6.1 Añadir pruebas para límites, clasificación, promedios, persistencia, eliminación y estados vacíos.
- [x] 6.2 Añadir pruebas o comprobaciones manuales para estabilización, ventanas de promedio, temporizadores del monitor y limpieza del micrófono.
- [x] 6.3 Verificar los flujos de permiso rechazado, micrófono ausente, contexto no seguro, `localStorage` no disponible y APIs opcionales ausentes.
- [x] 6.4 Verificar la interfaz en móvil y en una pantalla grande o proyector, incluyendo controles táctiles, contraste y legibilidad.
- [x] 6.5 Confirmar que no se envía ni persiste audio y que el `Modo aula` no crea registros automáticos.

## 7. Refinamiento Hallmark

- [x] 7.1 Ejecutar el preflight visual de Hallmark y conservar el sistema de diseño existente si aparece durante la implementación.
- [x] 7.2 Aplicar tokens CSS, jerarquía, microinteracciones y composición Hallmark sin modificar requisitos funcionales ni textos de estado.
- [x] 7.3 Verificar foco visible, nombres accesibles, contraste, reducción de movimiento y navegación por teclado en ambos modos.
- [x] 7.4 Verificar responsive design en 320, 375, 414 y 768 px y en una pantalla grande, sin desplazamiento horizontal ni controles truncados.

## 8. Tooling de desarrollo

- [x] 8.1 Configurar Vite como servidor de desarrollo y build de producción manteniendo `index.html` como entrada.
- [x] 8.2 Verificar los scripts `dev`, `build`, `preview` y `test` sin añadir un framework visual innecesario.

## 9. Escena física del monitor

- [x] 9.1 Tratar el silencio ambiental como nivel bajo válido en `Modo aula` y conservar el rechazo de registros sin muestras utilizables en cartografía.
- [x] 9.2 Implementar la escena Canvas con emojis, posiciones, velocidad, gravedad, fricción y rebote contra sus límites.
- [x] 9.3 Vincular cantidad, energía, color y velocidad de los emojis al promedio móvil y a la histéresis del límite existente.
- [x] 9.4 Convertir `Pantalla completa` en fullscreen del escenario del monitor, ocultando el resto de la interfaz y restaurándolo al salir.
- [x] 9.5 Añadir estado accesible mínimo para fullscreen, salida con `Escape`, reducción de movimiento y ausencia de soporte fullscreen.
- [x] 9.6 Verificar silencio, conversación, palmadas, ruido sostenido, fullscreen, salida y funcionamiento en proyector.

## 10. Migración React

- [x] 10.1 Configurar React, React DOM y `@vitejs/plugin-react` sobre Vite.
- [x] 10.2 Migrar la entrada y las vistas de aula/cartografía a componentes React conservando la interfaz Hallmark.
- [x] 10.3 Encapsular persistencia, micrófono y física Canvas en hooks con cleanup al desmontar o cambiar de modo.
- [x] 10.4 Migrar las pruebas al runner Vitest y añadir una prueba de render inicial accesible.
- [x] 10.5 Verificar que no queden entrypoints vanilla activos y que `npm test`, `npm run build` y OpenSpec pasen.
