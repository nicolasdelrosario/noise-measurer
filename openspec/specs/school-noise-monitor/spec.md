# school-noise-monitor Specification

## Purpose

Esta capacidad permite controlar visualmente el ruido del aula y realizar mediciones comparables en diez zonas de la institución, conservando los resultados únicamente en el navegador del dispositivo.

## Requirements

### Requirement: Modo aula como pantalla principal
La aplicación SHALL abrir siempre en `Modo aula`, mostrar `Iniciar monitor` como acción principal y ofrecer `Ver cartografía` como acceso secundario.

#### Scenario: Apertura inicial
- **WHEN** el usuario abre o recarga la aplicación
- **THEN** se muestra `Modo aula` con el propósito, la advertencia de precisión aproximada, el límite configurado y el monitor visual

#### Scenario: Regreso desde cartografía
- **WHEN** el usuario selecciona `Modo aula`
- **THEN** la aplicación muestra el monitor y no cambia ni crea mediciones de cartografía

### Requirement: Monitor visual del aula
El `Modo aula` SHALL solicitar el micrófono al iniciar el monitor, mostrar en tiempo real el promedio móvil aproximado de un segundo en dB, caritas animadas y uno de los estados `Nivel adecuado` o `Demasiado ruido`.

#### Scenario: Inicio autorizado
- **WHEN** el usuario pulsa `Iniciar monitor` y concede el permiso del micrófono
- **THEN** la aplicación muestra el nivel actual, indica que el micrófono está activo y comienza a reaccionar visualmente al ruido

#### Scenario: Nivel adecuado
- **WHEN** el promedio móvil permanece por debajo del límite
- **THEN** se muestran caritas amarillas y el mensaje `Nivel adecuado`

#### Scenario: Aproximación al límite
- **WHEN** el promedio móvil está dentro de los 10 dB inferiores al límite sin superarlo
- **THEN** aumenta progresivamente la cantidad y el movimiento de las caritas, manteniendo el estado `Nivel adecuado`

#### Scenario: Exceso sostenido
- **WHEN** el promedio móvil supera el límite durante al menos un segundo
- **THEN** las caritas pasan a rojo, ocupan visualmente la pantalla y se muestra `Demasiado ruido`

#### Scenario: Regreso a nivel adecuado
- **WHEN** el promedio móvil permanece por debajo del límite durante al menos dos segundos
- **THEN** las caritas regresan progresivamente a amarillo y se muestra `Nivel adecuado`

### Requirement: Límite configurable y persistente
La aplicación SHALL permitir al profesor seleccionar un límite entre 40 y 100 dB, usar 70 dB por defecto y conservar una configuración válida en `localStorage`.

#### Scenario: Configuración inicial
- **WHEN** no existe un límite válido guardado
- **THEN** el límite mostrado y utilizado es 70 dB

#### Scenario: Cambio durante el monitoreo
- **WHEN** el profesor cambia el límite dentro del rango permitido
- **THEN** el monitor aplica el nuevo límite sin detenerse y guarda la configuración localmente

#### Scenario: Configuración inválida
- **WHEN** el valor guardado está fuera de 40 a 100 dB o no puede interpretarse
- **THEN** la aplicación ignora ese valor y utiliza 70 dB

### Requirement: Funcionamiento en móvil y proyector
La aplicación SHALL adaptar el monitor a pantallas móviles y grandes, ofrecer pantalla completa y solicitar mantener la pantalla encendida cuando las APIs del navegador estén disponibles.

#### Scenario: Capacidades disponibles
- **WHEN** el monitor se inicia en un navegador compatible
- **THEN** la aplicación permite solicitar pantalla completa y mantener la pantalla encendida

#### Scenario: Capacidades no disponibles
- **WHEN** una API de pantalla completa o de pantalla encendida no existe o es rechazada
- **THEN** la aplicación informa la limitación y mantiene funcionando el monitor restante

#### Scenario: Página no visible
- **WHEN** la página se cierra, el dispositivo se bloquea o la pestaña es suspendida
- **THEN** la aplicación no promete continuar midiendo y explica esta limitación al usuario

### Requirement: Privacidad y ciclo de captura
La aplicación SHALL analizar el audio únicamente en memoria local, no SHALL grabar, almacenar ni transmitir fragmentos de audio, y SHALL liberar la captura al detener el monitor, detener una medición o cambiar de modo.

#### Scenario: Detención del monitor
- **WHEN** el usuario pulsa `Detener monitor`
- **THEN** cesa el análisis, se libera el micrófono, se cancela la solicitud de pantalla encendida y no se crea ningún registro

#### Scenario: Cambio de modo con captura activa
- **WHEN** el usuario cambia entre `Modo aula` y `Modo cartografía` mientras el micrófono está activo
- **THEN** la captura anterior se detiene y libera antes de iniciar otra

#### Scenario: Una sola captura
- **WHEN** existe una captura activa
- **THEN** la aplicación impide mantener una segunda captura simultánea

### Requirement: Medición por zona
El `Modo cartografía` SHALL permitir medir las diez zonas predefinidas, estabilizar durante cinco segundos antes de guardar, registrar el promedio de los últimos cinco segundos y conservar zona, nivel, actividad, observación y fecha y hora.

#### Scenario: Acceso a cartografía
- **WHEN** el usuario selecciona `Ver cartografía`
- **THEN** se muestran `Iniciar medición`, la lista, el gráfico y la cartografía

#### Scenario: Solicitud de permiso
- **WHEN** el usuario inicia una medición sin permiso concedido
- **THEN** la aplicación muestra `Solicitando acceso al micrófono` y solicita permiso

#### Scenario: Permiso rechazado
- **WHEN** el usuario rechaza el permiso o el navegador lo bloqueó permanentemente
- **THEN** la aplicación explica el problema y ofrece `Intentar nuevamente` o habilitar el permiso desde la configuración del navegador

#### Scenario: Estabilización
- **WHEN** han transcurrido menos de cinco segundos desde el inicio de la captura
- **THEN** se muestra `Estabilizando medición` y `Registrar medición` permanece deshabilitado

#### Scenario: Registro válido
- **WHEN** existen al menos cinco segundos de muestras, el usuario elige una zona válida y completa actividad y observación
- **THEN** se guarda un registro independiente con el promedio de los últimos cinco segundos, clasificación, color y fecha y hora

#### Scenario: Registro incompleto
- **WHEN** falta una zona, actividad u observación, o aún no hay suficientes muestras
- **THEN** la aplicación no guarda el registro y mantiene visible la acción correctiva

#### Scenario: Zonas oficiales
- **WHEN** el usuario selecciona una zona
- **THEN** puede elegir únicamente Entrada principal, Patio principal, Losa deportiva, Aulas - Pabellón A, Aulas - Pabellón B, Pasillos, Biblioteca, Laboratorios, Tópico o Jardín / áreas verdes

### Requirement: Persistencia y gestión de registros
La aplicación SHALL guardar los registros y el límite en `localStorage`, conservarlos al recargar en el mismo navegador y dispositivo, permitir eliminar registros individuales y mostrar un estado vacío sin datos ficticios.

#### Scenario: Recarga con datos
- **WHEN** el usuario recarga la aplicación en el mismo navegador y dispositivo
- **THEN** las mediciones guardadas y el límite válido permanecen disponibles

#### Scenario: Eliminación confirmada
- **WHEN** el usuario confirma la eliminación de un registro
- **THEN** solo se elimina ese registro, se actualizan las vistas y se conservan los demás

#### Scenario: Último registro eliminado
- **WHEN** se elimina el último registro
- **THEN** tabla, gráfico y cartografía muestran `Todavía no existen mediciones`

#### Scenario: Persistencia no disponible
- **WHEN** `localStorage` no está disponible o falla al guardar
- **THEN** la aplicación informa el error sin perder los registros ya cargados en la sesión y ofrece una acción recuperable cuando sea posible

### Requirement: Clasificación, tabla, gráfico y cartografía
La aplicación SHALL clasificar cada registro con la escala oficial, mostrar el detalle en una tabla, comparar promedios por zona en un gráfico de barras y representar las diez zonas sobre el plano de la institución usando únicamente datos guardados.

#### Scenario: Clasificación oficial
- **WHEN** se guarda una medición
- **THEN** se clasifica como Muy alto/Rojo desde 80 dB, Alto/Naranja entre 70 y 79 dB, Moderado/Amarillo entre 60 y 69 dB, Bajo/Verde entre 50 y 59 dB o Muy bajo/Azul por debajo de 50 dB

#### Scenario: Múltiples mediciones de una zona
- **WHEN** una zona tiene varios registros
- **THEN** la tabla conserva cada registro y el gráfico y la cartografía muestran el promedio de esa zona

#### Scenario: Actualización de vistas
- **WHEN** se registra o elimina una medición
- **THEN** tabla, gráfico y cartografía se actualizan con la misma fuente de datos

#### Scenario: Sin datos ficticios
- **WHEN** no existen registros guardados para una zona o para toda la aplicación
- **THEN** no se muestran barras ni valores inventados y se muestra el estado vacío correspondiente

### Requirement: Estados y errores recuperables
La aplicación SHALL distinguir estados de permiso, captura, estabilización, medición, detención, monitor activo y monitor detenido, e informar errores de micrófono, HTTPS/localhost, señal inválida, suspensión de pestaña y capacidades no disponibles con una acción clara cuando sean recuperables.

#### Scenario: Micrófono no disponible
- **WHEN** el dispositivo no tiene micrófono o la captura falla
- **THEN** se muestra `Micrófono no disponible` o `Error de captura` y se conserva la posibilidad de volver a intentar

#### Scenario: Señal no utilizable
- **WHEN** la señal es cero, demasiado baja o está saturada
- **THEN** la aplicación informa que no puede calcular una medición confiable y no guarda un valor inválido

#### Scenario: Contexto no seguro
- **WHEN** la aplicación no se ejecuta en HTTPS o `localhost`
- **THEN** se informa que el navegador puede impedir el acceso al micrófono
