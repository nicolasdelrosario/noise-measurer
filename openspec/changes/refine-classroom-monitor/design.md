## Context

La aplicación ya usa React, Vite y un Canvas para la escena del monitor. La aproximación anterior reducía el volumen a dB promediados y usaba una física distinta a Bouncy Balls, por lo que la caída y la reacción eran demasiado lentas.

## Goals / Non-Goals

**Goals:**

- Reproducir la densidad y respuesta física observables de Bouncy Balls con emojis nativos.
- Permitir que el profesor regule la respuesta visual sin alterar la medición.
- Mantener la escena útil en pantalla completa para un aula o proyector.
- Preservar el ciclo de vida React, la limpieza del Canvas y la accesibilidad.

**Non-Goals:**

- Cambiar el cálculo de dB, la histéresis o la clasificación oficial.
- Añadir pitidos, mensajes de voz, `shush` u otras alertas sonoras.
- Añadir temas seleccionables, cuentas, nube o sincronización.

## Decisions

### Emojis nativos en Canvas

El Canvas dibujará emojis nativos sin descargar sprites externos. La cantidad se calculará a partir de la raíz cuadrada del área, con radios de 22 o 28 píxeles y límites entre 25 y 250 cuerpos, siguiendo el comportamiento del tema Emoji de Bouncy Balls.

Alternativa descartada: copiar el sprite externo de Bouncy Balls. Añadiría un recurso de terceros innecesario; la apariencia nativa puede variar, pero no afecta la física solicitada.

### Física Verlet y volumen espectral

La captura conservará RMS y dB para medición, pero calculará por separado el promedio de frecuencias con FFT 1024 y suavizado 0.3. Ese volumen crudo alimentará directamente la escena. La física usará posiciones actuales y anteriores, gravedad 1.5, restitución 0.8 y tres ciclos de fuerza, colisiones y límites por frame. Los cuerpos cercanos al suelo recibirán un impulso en cada frame con volumen, sin promedio de un segundo ni cooldown.

Alternativa descartada: derivar el movimiento del promedio móvil en dB. Ese dato es útil para alertas, pero elimina la respuesta inmediata a palmadas y cambios breves.

### Sensibilidad visual independiente

La sensibilidad se guardará como un número entre 0 y 100, con valor medio inicial. Se mapeará a una elasticidad entre 0.1 y 2, donde 50 equivale a 1, y no modificará dB, clasificación ni registros.

Alternativa descartada: aplicar sensibilidad como ganancia del cálculo de dB. Eso cambiaría el significado de los registros y haría que el mismo sonido produjera datos distintos según una preferencia visual.

### Overlay de fullscreen

El elemento fullscreen mantendrá la escena como foco principal y añadirá un overlay compacto con nivel, estado, límite y sensibilidad. La salida explícita llamará a `exitFullscreen`; `Escape` seguirá siendo el comportamiento nativo del navegador. La información tendrá contraste y un estado `aria-live` sin cubrir la escena.

Alternativa descartada: mostrar toda la interfaz en fullscreen. Reduce la legibilidad a distancia y contradice el uso como monitor de proyector.

### Validación con Playwright

Playwright Test ejecutará la aplicación Vite mediante `webServer` y validará Chromium desktop y un dispositivo móvil. Las pruebas cubrirán carga inicial, cartografía, persistencia de sensibilidad, fullscreen y overflow en los cuatro anchos Hallmark. El MCP local de Playwright se declarará en `opencode.jsonc` para que OpenCode pueda inspeccionar e interactuar con el navegador durante revisiones manuales.

Alternativa descartada: depender únicamente de screenshots manuales. No detectan de forma repetible persistencia, accesibilidad básica ni overflow horizontal.

## Risks / Trade-offs

- [Los emojis nativos pueden variar entre sistemas] -> Aceptar esa diferencia visual para evitar copiar recursos externos; tamaño, cantidad y física permanecen controlados por Canvas.
- [Una sensibilidad alta puede producir demasiado movimiento] -> Limitar el multiplicador, mantener rebotes acotados y permitir reducir movimiento mediante la preferencia del sistema.
- [El overlay puede distraer durante la alerta] -> Mantenerlo pequeño, fijo y con jerarquía secundaria frente a la escena.
- [Fullscreen puede ser rechazado por el navegador] -> Informar la limitación y conservar todas las funciones en el modo normal.

## Migration Plan

No hay migración de datos: la nueva clave de sensibilidad usa un valor por defecto si no existe. Los registros y el límite actuales permanecen intactos. La reversión consiste en retirar la nueva clave y volver a la escena anterior.

## Open Questions

Ninguna.
