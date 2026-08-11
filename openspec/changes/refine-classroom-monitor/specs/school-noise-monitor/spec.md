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
- **THEN** se muestra un aviso visual grande y centrado sin emitir sonido

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
