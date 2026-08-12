## ADDED Requirements

### Requirement: Sensibilidad visual persistente
La aplicación SHALL permitir ajustar una sensibilidad visual entre 0 y 100, usar un valor medio por defecto y conservarla en `localStorage`. La sensibilidad SHALL modificar únicamente la intensidad visual del monitor y no SHALL modificar el nivel en dB, el límite, la clasificación ni los registros.

#### Scenario: Sensibilidad inicial
- **WHEN** no existe una sensibilidad guardada
- **THEN** el monitor utiliza una sensibilidad media y la muestra en el control correspondiente

#### Scenario: Cambio de sensibilidad
- **WHEN** el usuario cambia la sensibilidad durante o antes del monitoreo
- **THEN** la velocidad o energía visual de las caritas se ajusta sin detener el micrófono ni alterar los datos medidos

#### Scenario: Persistencia de sensibilidad
- **WHEN** el usuario recarga la aplicación en el mismo navegador y dispositivo
- **THEN** se conserva la sensibilidad válida seleccionada

### Requirement: Emojis físicos reactivos
La aplicación SHALL mostrar emojis nativos en Canvas con cantidad automática según el área disponible y SHALL reaccionar al volumen espectral crudo mediante gravedad, colisiones y rebotes físicos.

#### Scenario: Nivel adecuado
- **WHEN** el micrófono recibe poco o ningún volumen
- **THEN** los emojis caen por gravedad, colisionan y se acumulan en la parte inferior

#### Scenario: Demasiado ruido
- **WHEN** el micrófono recibe volumen espectral
- **THEN** los emojis cercanos al suelo reciben impulsos inmediatos proporcionales al volumen y a la sensibilidad

### Requirement: Información del monitor en pantalla completa
La aplicación SHALL mostrar en pantalla completa el nivel actual en dB, el estado `Nivel adecuado` o `Demasiado ruido`, el límite configurado y la sensibilidad visual, y SHALL permitir salir mediante `Escape` o una acción visible.

#### Scenario: Monitor fullscreen activo
- **WHEN** el usuario activa pantalla completa desde `Modo aula`
- **THEN** se oculta la navegación secundaria y se mantienen visibles la escena de caritas, el nivel, el estado, el límite y la sensibilidad

#### Scenario: Alerta centrada en fullscreen
- **WHEN** el estado cambia a `Demasiado ruido` mientras el monitor está en pantalla completa
- **THEN** se muestra un aviso visual grande y centrado

### Requirement: Alerta sonora por transición
La aplicación SHALL reproducir una alerta breve sintetizada cuando el estado cambie de adecuado a `Demasiado ruido`, SHALL evitar repetirla mientras continúe la misma alerta, SHALL permitir silenciarla mediante una preferencia persistente y SHALL mantener la alerta visual si el navegador bloquea el sonido.

#### Scenario: Entrada y permanencia en alerta
- **WHEN** el ruido sostenido activa `Demasiado ruido`
- **THEN** se reproduce una sola alerta sonora aunque el nivel permanezca alto

#### Scenario: Nueva alerta después de recuperación
- **WHEN** el aula vuelve a nivel adecuado y posteriormente activa otra alerta
- **THEN** la alerta sonora puede reproducirse nuevamente

#### Scenario: Sonido apagado o bloqueado
- **WHEN** el usuario apaga el sonido o el navegador impide reproducirlo
- **THEN** la captura y la alerta visual continúan funcionando y la interfaz informa el estado del sonido

#### Scenario: Captura compatible en navegadores WebKit
- **WHEN** el navegador expone `webkitAudioContext` o mantiene el contexto suspendido inicialmente
- **THEN** la aplicación continúa solicitando y analizando el micrófono sin bloquear el inicio

### Requirement: Alerta visible en vista normal
La aplicación SHALL mostrar una señal roja compacta en la tarjeta del monitor cuando el estado sea `Demasiado ruido` y SHALL reservar el mensaje central de gran formato para pantalla completa.

#### Scenario: Alerta fuera de fullscreen
- **WHEN** el monitor entra en alerta en la vista normal
- **THEN** se muestran una banda compacta, acento rojo y estado rojo sin cubrir la lectura ni los controles

### Requirement: Señal saturada explícita
La aplicación SHALL mostrar `Señal saturada` cuando el pico del micrófono alcance el máximo, en lugar de congelar la lectura anterior.

#### Scenario: Controles fullscreen en móvil
- **WHEN** el monitor está en pantalla completa en un viewport móvil
- **THEN** el estado y las métricas se organizan sin solaparse y la acción `Salir` permanece completamente visible dentro del área segura

#### Scenario: Salida de fullscreen
- **WHEN** el usuario pulsa `Escape` o la acción de salida
- **THEN** se restaura la interfaz completa sin detener el monitor ni liberar el micrófono

#### Scenario: Fullscreen no disponible
- **WHEN** el navegador no permite solicitar pantalla completa
- **THEN** la aplicación informa la limitación y mantiene disponible el monitor normal

### Requirement: Física equivalente en vista normal y fullscreen
La escena SHALL conservar el mismo integrador, gravedad, colisiones, límites e impulso por volumen tanto en la vista principal como en pantalla completa.

#### Scenario: Aula silenciosa
- **WHEN** el nivel permanece estable y bajo
- **THEN** los emojis caen y se agrupan por la gravedad y las colisiones

#### Scenario: Cambio de ruido
- **WHEN** existe volumen espectral mayor que cero
- **THEN** los emojis próximos al suelo reciben un impulso en el mismo frame y regresan por gravedad

#### Scenario: Mismo comportamiento en fullscreen
- **WHEN** el usuario activa pantalla completa
- **THEN** los emojis conservan la misma densidad proporcional, gravedad, colisiones e impulsos que en la vista principal
