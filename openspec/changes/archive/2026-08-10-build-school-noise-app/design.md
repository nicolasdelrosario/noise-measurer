## Context

La aplicación parte del alcance aprobado en `docs/process.md` y se implementa como una aplicación web vanilla gestionada por Vite. El diseño debe cubrir dos modos que comparten una única captura de micrófono: un monitor continuo que no genera registros y un flujo de mediciones por zona que sí persiste datos.

## Goals / Non-Goals

**Goals:**

- Mantener `Modo aula` como entrada y experiencia principal.
- Separar el estado efímero de captura y monitor del estado persistido de configuración y registros.
- Hacer que tabla, gráfico y cartografía deriven de los mismos registros guardados.
- Usar APIs nativas del navegador y una arquitectura pequeña, responsive y comprobable.
- Liberar siempre el micrófono y las solicitudes de pantalla al detener o cambiar de modo.
- Aplicar Hallmark como autoridad visual y de refinamiento de UI, sin cambiar el contrato funcional de la spec.
- Verificar accesibilidad y responsive design en 320, 375, 414 y 768 px, además de una pantalla grande.
- Ofrecer servidor de desarrollo con HMR y un build reproducible para producción mediante Vite.

**Non-Goals:**

- Calibrar el dispositivo como sonómetro profesional.
- Crear backend, cuentas, sesiones remotas o sincronización.
- Grabar, reproducir o transmitir audio.
- Añadir zonas personalizadas, alertas sonoras o control remoto.

## Decisions

### Estado local con una fuente de verdad

Se mantendrá un estado de aplicación pequeño con `mode`, estado de captura, muestras recientes, límite del aula y registros. El límite y los registros se serializarán en `localStorage`; las muestras y el estado de permiso permanecerán únicamente en memoria. Esto evita que el modo aula cree datos y permite que las vistas analíticas se recalculen siempre desde registros reales.

Alternativa descartada: almacenar métricas temporales como registros. Mezclaría el monitor continuo con la cartografía y violaría el alcance aprobado.

### Captura mediante Web Audio API

La captura usará `navigator.mediaDevices.getUserMedia({ audio: true })` y el análisis local de la señal mediante Web Audio API. Se mantendrá un búfer temporal para calcular el promedio móvil de un segundo en aula y el promedio de cinco segundos al registrar una medición. El `MediaStream` y el contexto de audio se cerrarán al detener o cambiar de modo.

Alternativa descartada: enviar audio a un servidor o usar un servicio de reconocimiento. No es necesario para el nivel aproximado y contradice la privacidad del alcance.

### Máquina de estados explícita

Los flujos de permiso, estabilización, medición, detención y error usarán estados explícitos y acciones recuperables. El monitor aplicará temporizadores de un segundo para entrar en rojo y dos segundos bajo el límite para volver a amarillo, evitando parpadeos por picos aislados.

Alternativa descartada: cambiar el color directamente con cada muestra. Sería más corto, pero produciría una experiencia inestable y no cumple los tiempos aprobados.

### Derivaciones compartidas para datos analíticos

Una función pura de clasificación aplicará la escala oficial. Otra derivación agrupará registros por zona y calculará promedios; tabla, gráfico y cartografía consumirán esos mismos datos. El gráfico será de barras y la cartografía usará el plano institucional con las diez zonas fijas, dejando sin valor las zonas sin registros.

Alternativa descartada: mantener valores independientes por vista. Aumentaría el riesgo de inconsistencias después de registrar o eliminar mediciones.

### Sistema visual Hallmark

La interfaz seguirá Hallmark para elegir jerarquía, composición, tokens, microinteracciones y tono visual. Como no existe una aplicación ni un sistema visual raíz previo en el repositorio, Hallmark podrá establecer una base visual propia; cualquier sistema de diseño que aparezca durante la implementación tendrá prioridad y no se reemplazará. Las decisiones visuales no podrán cambiar textos funcionales, estados, límites, datos, flujos ni exclusiones definidos por la spec.

La base visual usará tokens CSS, contraste suficiente, foco visible, controles nativos accesibles y layouts sin desplazamiento horizontal. La verificación cubrirá 320, 375, 414, 768 px y una pantalla grande, con especial atención al uso del monitor desde móvil y proyector.

Alternativa descartada: añadir una biblioteca visual externa. No existe una necesidad concreta y Hallmark puede cubrir el refinamiento con CSS nativo.

### React como capa de presentación

La interfaz se organizará en componentes React para el shell, aula, monitor, cartografía, formulario, tabla, gráfico y plano. El estado se mantendrá en `App` y hooks pequeños; no se añadirá un gestor global porque no existe estado compartido remoto ni una necesidad de coordinación fuera de esta pantalla.

Los efectos React serán responsables de iniciar y limpiar el micrófono, Wake Lock, fullscreen y `requestAnimationFrame`. El Canvas se conectará mediante `useRef`; el motor físico permanecerá imperativo dentro de un hook para no convertir cada frame en un árbol React.

Alternativa descartada: conservar manipulación directa del DOM. Funciona, pero mezcla renderizado, estado y ciclo de vida en un único módulo y dificulta comprobar la limpieza de recursos.

### Tooling con Vite

Vite será la herramienta de desarrollo y build, manteniendo `index.html` como entrada y los módulos ES existentes como código de aplicación. Esta opción añade HMR y un build de producción sin introducir un framework de componentes ni cambiar la arquitectura funcional.

Alternativa descartada: migrar a React u otro framework. No aporta una necesidad concreta para esta aplicación pequeña y aumentaría la superficie de implementación.

### Señal silenciosa y escena física

El silencio ambiental se tratará como un nivel bajo válido para el monitor del aula, no como una captura rota. La medición de cartografía seguirá rechazando un registro cuando no existan muestras utilizables o cuando la captura falle. Esto evita bloquear el uso normal del monitor por el ruido de fondo, sin permitir guardar valores que no provienen de una captura activa.

El monitor usará una escena Canvas nativa con un pequeño sistema de partículas: cada emoji tendrá posición, velocidad, gravedad y rebote contra los límites. La energía del movimiento y la cantidad de emojis se derivarán del promedio móvil del nivel; la transición a rojo seguirá dependiendo de la histéresis funcional ya definida. Canvas evita una dependencia de física y permite llenar una pantalla de proyector con movimiento estable.

El botón de pantalla completa solicitará fullscreen sobre la escena del monitor, no sobre el documento completo. En ese estado se ocultarán los controles de configuración y navegación, manteniendo solo la escena, un estado mínimo accesible y la posibilidad de salir con `Escape`.

Alternativa descartada: una librería de animación o física. `requestAnimationFrame`, Canvas y las APIs nativas cubren el comportamiento sin añadir coste de bundle ni una abstracción que no se reutiliza.

### Interfaz responsive y capacidades opcionales

La pantalla aula priorizará tipografía grande, contraste y controles táctiles para móvil y proyector. Pantalla completa y Wake Lock se solicitarán desde acciones explícitas y se tratarán como mejoras opcionales: su ausencia no impedirá medir. La UI mostrará siempre la advertencia de que los dB son aproximados y dependientes del dispositivo.

## Risks / Trade-offs

- [La amplitud del micrófono no es dB SPL calibrado] -> Mostrar la advertencia aprobada y usar los valores solo para comparar mediciones en condiciones similares.
- [El navegador puede suspender una pestaña o negar Wake Lock] -> Informar la limitación y mantener el monitor funcionando mientras la página siga visible.
- [La API de micrófono requiere HTTPS o localhost] -> Detectar el contexto no seguro y mostrar instrucciones antes de intentar capturar.
- [localStorage puede estar lleno o bloqueado] -> Capturar errores de lectura/escritura, conservar el estado de sesión y mostrar una acción recuperable.
- [Cambiar de modo con una captura activa puede dejar recursos abiertos] -> Centralizar el ciclo de vida de la captura y ejecutar una limpieza antes de activar el modo siguiente.

## Migration Plan

No hay datos existentes ni backend que migrar. La implementación se puede desplegar como una aplicación web estática. La reversión consiste en retirar la versión desplegada; los datos locales permanecen aislados en el navegador del usuario.

## Open Questions

- Ninguna que cambie el alcance, los requisitos o la arquitectura aprobada.
