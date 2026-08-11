## 1. Sensibilidad

- [x] 1.1 Añadir estado persistente de sensibilidad visual entre 0 y 100 con valor medio por defecto.
- [x] 1.2 Aplicar sensibilidad solo a la física y respuesta visual del Canvas.
- [x] 1.3 Añadir control accesible de sensibilidad en el panel del aula.

## 2. Emojis Canvas

- [x] 2.1 Dibujar emojis nativos en Canvas sin copiar sprites externos.
- [x] 2.2 Mantener tamaños consistentes, rotación y movimiento físico reactivo.
- [x] 2.3 Mantener `prefers-reduced-motion` y limpieza del loop Canvas al desmontar.

## 3. Fullscreen

- [x] 3.1 Mostrar nivel, estado, límite y sensibilidad dentro del escenario fullscreen.
- [x] 3.2 Añadir salida visible y conservar salida nativa mediante `Escape`.
- [x] 3.3 Informar cuando fullscreen no esté disponible sin detener el monitor.

## 4. Verificación

- [x] 4.1 Probar sensibilidad mínima, media y máxima sin alterar dB, límite ni registros.
- [x] 4.2 Probar silencio, conversación, palmadas y alerta sostenida con las nuevas caritas.
- [x] 4.3 Verificar fullscreen en móvil y proyector, incluyendo salida y legibilidad.
- [x] 4.4 Ejecutar `npm test`, `npm run build` y validación estricta de OpenSpec.

## 5. Validación Playwright y OpenCode

- [x] 5.1 Configurar Playwright Test con servidor Vite, base URL y proyectos Chromium desktop/móvil.
- [x] 5.2 Añadir pruebas E2E de aula, cartografía, persistencia de sensibilidad y fullscreen.
- [x] 5.3 Añadir prueba responsive para 320, 375, 414 y 768 px sin overflow horizontal.
- [x] 5.4 Configurar el MCP Playwright en `opencode.jsonc` local del proyecto.
- [x] 5.5 Instalar Chromium y verificar `npm test`, `npm run test:e2e` y `npm run build`.

## 6. Física Bouncy Balls

- [x] 6.1 Implementar integración Verlet con gravedad 1.5, restitución 0.8 y tres subpasos.
- [x] 6.2 Resolver colisiones entre emojis y límites del escenario en cada subpaso.
- [x] 6.3 Aplicar impulsos inmediatos según volumen espectral crudo y elasticidad visual.
- [x] 6.4 Verificar el mismo Canvas en vista principal y fullscreen con Playwright.

## 7. Distribución Bouncy Balls

- [x] 7.1 Calcular entre 25 y 250 emojis según el área y ubicarlos aleatoriamente sin solapamientos.
- [x] 7.2 Corregir el tamaño CSS del Canvas y observar cambios de tamaño del escenario con `ResizeObserver`.
- [x] 7.3 Añadir prueba E2E que verifica que el Canvas ocupa la escena en vista normal y fullscreen.

## 8. Captura reactiva

- [x] 8.1 Calcular volumen visual con FFT 1024, suavizado 0.3 y promedio de frecuencias.
- [x] 8.2 Mantener RMS y dB separados para alertas, clasificación y registros.
- [x] 8.3 Probar la captura de volumen, su enrutamiento y la trayectoria física determinista.

## 9. Alerta fullscreen

- [x] 9.1 Mostrar `Demasiado ruido` en el centro del escenario fullscreen durante una alerta.
- [x] 9.2 Mantener la alerta exclusivamente visual, sin pitidos ni mensajes de voz.

## 10. Identidad y cartografía

- [x] 10.1 Añadir favicon embebido con una carita amarilla feliz.
- [x] 10.2 Separar verticalmente número, nombre y estado de las zonas compactas del mapa.
- [x] 10.3 Verificar con Playwright que `Tópico` y `Jardín / áreas verdes` no solapan `sin datos`.
