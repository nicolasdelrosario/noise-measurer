# Proceso funcional: monitor y cartografía del sonido escolar

## 1. Objetivo

Crear una aplicación web cuyo uso principal sea un monitor visual para ayudar al profesor a controlar el ruido dentro del aula. Como función secundaria, permitirá medir el nivel de sonido en diez zonas de la institución educativa y representar los resultados mediante una tabla, un gráfico y una cartografía.

La aplicación utiliza el micrófono del dispositivo desde el navegador y puede mostrarse en un teléfono o proyector. Está orientada a comparar mediciones realizadas con el mismo dispositivo y en condiciones similares. Los valores se muestran en dB para el proyecto escolar, pero no reemplazan una medición acústica profesional ni deben interpretarse como valores calibrados de dB SPL.

## 2. Alcance funcional

La aplicación debe permitir:

- Iniciar directamente en el `Modo aula` y acceder al `Modo cartografía` como opción secundaria.
- Solicitar permiso para utilizar el micrófono.
- Iniciar y detener una medición.
- Mostrar en tiempo real el nivel de ruido en dB.
- Registrar una medición asociada a una zona de la institución.
- Utilizar las diez zonas predefinidas del proyecto.
- Guardar el nivel, la zona, la actividad, la observación y la fecha y hora.
- Realizar varias mediciones en distintas zonas.
- Conservar mediciones en el navegador mediante `localStorage`.
- Mostrar una tabla con los registros guardados.
- Comparar los niveles registrados mediante un gráfico.
- Mostrar las zonas sobre la cartografía de la institución.
- Clasificar cada medición según la escala de colores del proyecto.
- Eliminar mediciones incorrectas.
- Mostrar un estado vacío cuando no existan mediciones.
- Informar los problemas relacionados con el permiso o la disponibilidad del micrófono.
- Mostrar caritas animadas que reaccionen al nivel de sonido en el `Modo aula`.
- Permitir que el profesor ajuste el límite de ruido del aula.
- Conservar el límite configurado en el navegador.
- Ofrecer pantalla completa en el `Modo aula` y mantener la pantalla encendida cuando el navegador lo permita.

## 3. Decisiones funcionales

### 3.1 Unidad y precisión

El resultado se mostrará como un nivel de ruido aproximado. La captura del navegador representa una amplitud digital y no un nivel acústico profesional calibrado.

La interfaz debe mostrar una advertencia similar a:

> Estos valores dependen del micrófono y del dispositivo utilizado. Sirven para comparar mediciones realizadas bajo condiciones similares, pero no representan una medición acústica profesional o calibrada.

Las mediciones realizadas con dispositivos o micrófonos diferentes no deben considerarse directamente comparables.

### 3.2 Valor registrado

El valor actual se actualiza continuamente, pero la medición guardada corresponde al promedio de los últimos 5 segundos. Esto reduce el efecto de picos aislados, como golpes o palmadas.

Durante los primeros segundos, la aplicación debe mostrar un estado de estabilización y no permitir guardar una medición hasta contar con suficientes muestras.

### 3.3 Mediciones repetidas

Cada medición se conserva como un registro independiente. Si existen varias mediciones para la misma zona, el gráfico y la cartografía muestran el promedio de esa zona y la lista conserva el detalle de cada registro.

El promedio debe calcularse a partir de las mediciones registradas y no de datos ficticios o generados automáticamente.

### 3.4 Persistencia

Los registros se guardan en `localStorage`, por lo que permanecen disponibles después de recargar la página en el mismo navegador y dispositivo.

No forman parte del alcance inicial la sincronización entre dispositivos, usuarios, aulas, colegios o sesiones remotas, ni el uso de un instrumento externo: la medición se realiza con el micrófono del dispositivo que ejecuta la aplicación.

### 3.5 Modos de uso

El `Modo aula` es la función principal y la aplicación siempre abre en este modo. Funciona como un monitor visual continuo mientras la página permanece abierta, pero no crea registros de medición ni modifica los datos del `Modo cartografía`.

El `Modo cartografía` es una función secundaria. Permite realizar y guardar mediciones en las diez zonas, consultar la tabla y comparar los resultados mediante el gráfico y la cartografía. La aplicación no recuerda este modo al recargarse: siempre vuelve al `Modo aula`.

Solo puede existir una captura de micrófono activa. Al cambiar de modo, la aplicación debe detener y liberar la captura anterior antes de iniciar otra.

### 3.6 Límite de ruido del aula

El profesor puede ajustar el límite permitido mediante un control sencillo. El valor inicial será 70 dB y la configuración se guardará en `localStorage` para conservarla en el mismo navegador y dispositivo.

El límite del `Modo aula` es independiente de la escala de cinco colores utilizada por la cartografía:

- Por debajo del límite, las caritas son amarillas y se muestra `Nivel adecuado`.
- Desde 10 dB por debajo del límite, aumenta progresivamente la cantidad y el movimiento de las caritas hasta alcanzar el límite.
- Al superar el límite, la pantalla se llena de caritas rojas y se muestra `Demasiado ruido`.
- Cuando el nivel vuelve a estar por debajo del límite, las caritas regresan progresivamente a amarillo.

Para evitar cambios de estado por golpes o picos aislados, el `Modo aula` utiliza un promedio móvil aproximado de 1 segundo. Este promedio es también el valor en dB mostrado por el monitor. El estado rojo se activa después de superar el límite durante 1 segundo y vuelve a amarillo después de permanecer 2 segundos por debajo del límite.

### 3.7 Privacidad y funcionamiento continuo

El sonido se analiza localmente en el navegador. La aplicación no graba, almacena ni transmite audio.

Mientras el `Modo aula` está activo, la aplicación debe solicitar mantener la pantalla encendida mediante la API disponible del navegador y ofrecer la opción de pantalla completa. Si estas funciones no están disponibles, el monitor seguirá funcionando mientras la página permanezca visible.

El navegador no puede mantener la medición si la página se cierra, el dispositivo se bloquea o el sistema suspende la pestaña. La aplicación debe explicar esta limitación al iniciar el `Modo aula`.

## 4. Zonas de la institución

La aplicación debe ofrecer las siguientes zonas predefinidas:

1. Entrada principal
2. Patio principal
3. Losa deportiva
4. Aulas - Pabellón A
5. Aulas - Pabellón B
6. Pasillos
7. Biblioteca
8. Laboratorios
9. Tópico
10. Jardín / áreas verdes

No se contempla crear zonas personalizadas en el alcance inicial. Las zonas oficiales permiten que la tabla, el gráfico y la cartografía mantengan una correspondencia estable.

## 5. Flujo de la aplicación

### 5.1 Estado inicial y modo principal

La aplicación abre directamente en el `Modo aula` y muestra:

- Una explicación breve del propósito.
- La advertencia sobre la precisión aproximada.
- El límite de ruido configurado.
- El botón principal `Iniciar monitor`.
- Las caritas del monitor visual.
- El acceso secundario `Ver cartografía`.

Al seleccionar `Ver cartografía`, la aplicación muestra el botón `Iniciar medición`, la lista, el gráfico y la cartografía. Cuando no existen registros, estas vistas muestran el mensaje `Todavía no existen mediciones`.

### 5.2 Solicitud de permiso

Cuando el usuario pulsa `Iniciar medición`:

1. La aplicación solicita acceso al micrófono.
2. Mientras espera, muestra el estado `Solicitando acceso al micrófono`.
3. Si el permiso es concedido, inicia la captura.
4. Si el permiso es rechazado, muestra el motivo y el botón `Intentar nuevamente`.

Si el navegador ya bloqueó el permiso permanentemente, la aplicación debe indicar que el usuario debe habilitarlo desde la configuración del navegador.

### 5.3 Medición activa

Con el micrófono activo:

- Se muestra el nivel actual en dB.
- El valor se actualiza en tiempo real.
- Durante los primeros 5 segundos se muestra `Estabilizando medición`.
- Después se habilita `Registrar medición`.
- Se muestra `Detener`.
- Solo puede existir una captura activa a la vez.

La aplicación debe mantener un indicador visible de que el micrófono está activo.

### 5.4 Registro de una medición

Al pulsar `Registrar medición`:

1. El usuario selecciona una zona predefinida.
2. Introduce la actividad y la observación correspondiente.
3. La aplicación toma el promedio de los últimos 5 segundos.
4. Guarda la zona, el nivel, la actividad, la observación y la fecha y hora.
5. Calcula el nivel y color correspondientes.
6. Actualiza la lista, el gráfico y la cartografía.
7. Mantiene activa la medición para permitir registrar otra zona.

El registro debe estar deshabilitado mientras no haya suficientes muestras o mientras se esté guardando otra medición.

### 5.5 Detención

Al pulsar `Detener`:

- Se detiene el análisis.
- Se libera el recurso del micrófono.
- Se elimina el indicador de captura activa.
- Se mantienen visibles las mediciones y el gráfico.
- Se mantiene visible la cartografía.
- El usuario puede iniciar una nueva medición posteriormente.

### 5.6 Eliminación

Cada registro debe incluir la acción `Eliminar`.

Antes de eliminar, se recomienda solicitar confirmación para evitar errores. Después de confirmar:

- Se elimina el registro de `localStorage`.
- Se actualiza la lista.
- Se recalculan los promedios del gráfico.
- Se recalculan los promedios de la cartografía.
- Si no quedan registros, se muestra nuevamente el estado vacío.

### 5.7 Modo aula

Al abrir la aplicación o regresar al `Modo aula`:

1. La aplicación explica que el monitor funciona mientras la página permanece abierta y visible.
2. Muestra el límite guardado o utiliza 70 dB si todavía no existe una configuración.
3. El profesor puede ajustar el límite antes o durante el monitoreo.
4. Al pulsar `Iniciar monitor`, la aplicación solicita acceso al micrófono si todavía no lo tiene.
5. Con el permiso concedido, muestra el nivel actual en dB, las caritas animadas y el estado del aula.
6. Ofrece las acciones `Pantalla completa` y `Detener monitor`.
7. Solicita mantener la pantalla encendida mientras el monitor está activo.

Durante el monitoreo:

- Las caritas amarillas se mueven suavemente cuando el nivel es adecuado.
- La cantidad y el movimiento aumentan progresivamente desde 10 dB por debajo del límite.
- Las caritas pasan a rojo y ocupan la pantalla cuando se mantiene un nivel superior al límite.
- Las caritas regresan a amarillo cuando el sonido disminuye de forma sostenida.
- El profesor puede modificar el límite sin detener el monitor.
- No se guarda ningún fragmento de audio ni se crea un registro automático.

Al pulsar `Detener monitor`, cambiar de modo o salir de la página, la aplicación debe detener el análisis, liberar el micrófono y cancelar la solicitud de mantener la pantalla encendida.

## 6. Modelo de datos

Cada registro debe tener como mínimo:

```text
id: identificador único
zone: nombre de la zona
noiseLevel: nivel registrado en dB
activity: actividad observada
observation: observación o fuente de sonido
level: clasificación del nivel
color: color de la clasificación
measuredAt: fecha y hora de la medición
```

Ejemplo conceptual:

```json
{
  "id": "unique-id",
  "zone": "Patio principal",
  "noiseLevel": 54.2,
  "activity": "Circulación de estudiantes",
  "observation": "Conversaciones y movimiento",
  "level": "Bajo",
  "color": "Verde",
  "measuredAt": "2026-08-10T15:30:00.000Z"
}
```

La fecha debe almacenarse en un formato estándar y mostrarse en la zona horaria local del usuario.

La configuración del `Modo aula` debe conservar como mínimo:

```text
classroomNoiseLimit: límite de ruido seleccionado por el profesor
```

El límite debe aceptar valores entre 40 y 100 dB. Si no existe una configuración válida, la aplicación utiliza 70 dB.

## 7. Comparación, gráfico y cartografía

Se utilizará un gráfico de barras porque permite comparar fácilmente los niveles entre zonas.

El gráfico debe:

- Mostrar una categoría por zona.
- Usar el promedio de las mediciones de cada zona.
- Identificar claramente cada zona.
- Mostrar el valor numérico de cada barra.
- Actualizarse al registrar o eliminar una medición.
- Mostrar únicamente datos reales guardados.

Si no existen mediciones, no debe renderizar barras ficticias. Debe mostrar el mensaje `Todavía no existen mediciones`.

La lista de registros individuales debe permanecer disponible para consultar la zona, fecha, hora, actividad, observación y valor de cada medición usada en la comparación.

La cartografía debe:

- Utilizar el plano o imagen de la institución.
- Mostrar las diez zonas con su identificación correspondiente.
- Mostrar el valor de cada zona cuando exista una medición.
- Aplicar el color de acuerdo con la escala definida.
- Actualizarse al registrar o eliminar una medición.
- No mostrar datos ficticios ni completar zonas sin registros.

El gráfico y la cartografía deben utilizar los mismos valores que la tabla y la lista de mediciones. Si existen varias mediciones para una zona, ambos deben utilizar el promedio definido en la sección 3.3.

### 7.1 Escala de colores

La clasificación visual será la misma que la utilizada en el proyecto escolar:

| Rango | Nivel | Color |
|---|---|---|
| 80 dB o más | Muy alto | Rojo |
| 70-79 dB | Alto | Naranja |
| 60-69 dB | Moderado | Amarillo |
| 50-59 dB | Bajo | Verde |
| Menos de 50 dB | Muy bajo | Azul |

## 8. Estados de la medición

La aplicación debe distinguir estos estados:

```text
Sin iniciar
Solicitando permiso
Estabilizando
Midiendo
Detenida
Permiso denegado
Micrófono no disponible
Error de captura
Monitor sin iniciar
Monitor activo - nivel adecuado
Monitor activo - demasiado ruido
Monitor detenido
```

Cada estado debe mostrar una acción clara cuando corresponda, como `Iniciar medición`, `Intentar nuevamente` o `Detener`.

La aproximación al límite no constituye un estado adicional: mantiene el mensaje `Nivel adecuado` y solo modifica progresivamente la cantidad y el movimiento de las caritas.

## 9. Casos límite y manejo de errores

- El usuario rechaza el permiso del micrófono.
- El permiso fue bloqueado permanentemente por el navegador.
- El dispositivo no tiene micrófono disponible.
- El micrófono se desconecta durante la medición.
- Otra aplicación o pestaña ocupa el micrófono.
- El sitio no se está ejecutando en HTTPS o `localhost`.
- El usuario intenta registrar antes de completar los 5 segundos de estabilización.
- El usuario intenta registrar sin completar la actividad o la observación.
- La señal capturada es cero o demasiado baja para calcular el valor.
- La señal está saturada o presenta clipping.
- La cancelación de eco, reducción de ruido o ganancia automática del dispositivo modifica la señal.
- La pestaña pasa a segundo plano y el navegador suspende la captura.
- El navegador no permite mantener la pantalla encendida o cancela la solicitud.
- El navegador rechaza o no permite la pantalla completa.
- El límite guardado no es válido o está fuera del rango permitido.
- El usuario cambia entre `Modo cartografía` y `Modo aula` con el micrófono activo.
- El usuario recarga la página durante una medición.
- `localStorage` no está disponible o falla al guardar.
- El usuario elimina el último registro.
- Existen varias mediciones para la misma zona.
- El usuario cambia de micrófono o dispositivo entre mediciones.

En todos los errores recuperables debe existir una acción para volver a intentar sin perder los registros ya guardados.

## 10. Criterios de aceptación

- La aplicación abre siempre en el `Modo aula`.
- `Iniciar monitor` es la acción principal de la pantalla inicial.
- El `Modo cartografía` está disponible mediante un acceso secundario.
- El `Modo aula` muestra el promedio móvil de 1 segundo como nivel actual en dB.
- El `Modo aula` muestra caritas animadas y el estado actual del salón.
- El profesor puede ajustar el límite entre 40 y 100 dB.
- El límite seleccionado permanece después de recargar la página.
- Por debajo del límite, el estado visual es amarillo y muestra `Nivel adecuado`.
- Desde 10 dB por debajo del límite, aumenta progresivamente la cantidad y el movimiento de las caritas.
- Al superar el límite durante 1 segundo, las caritas pasan a rojo y se muestra `Demasiado ruido`.
- Después de permanecer 2 segundos por debajo del límite, las caritas regresan a amarillo.
- El monitor puede utilizarse en un teléfono o mostrarse en un proyector.
- La aplicación ofrece pantalla completa y solicita mantener la pantalla encendida cuando el navegador lo permite.
- Si la pantalla completa o el bloqueo de suspensión no están disponibles, el resto del monitor continúa funcionando.
- El `Modo aula` no graba audio ni crea mediciones guardadas.
- Al detener el monitor o cambiar de modo, se libera el micrófono.
- El usuario puede iniciar una medición y recibir la solicitud de permiso.
- La aplicación informa claramente si el permiso es rechazado.
- El nivel aproximado se actualiza mientras el micrófono está activo.
- El usuario puede detener la medición y el micrófono deja de utilizarse.
- No se puede guardar una medición sin una zona válida.
- Una medición guardada contiene zona, nivel, actividad, observación y fecha y hora.
- El valor guardado corresponde al promedio de los últimos 5 segundos.
- Se pueden guardar múltiples mediciones.
- Las mediciones permanecen después de recargar la página.
- El gráfico muestra promedios por zona usando únicamente mediciones guardadas.
- El gráfico se actualiza al agregar o eliminar registros.
- La cartografía muestra las diez zonas y se actualiza al agregar o eliminar registros.
- La tabla, el gráfico y la cartografía utilizan los mismos registros guardados.
- La clasificación y el color corresponden al rango de dB definido.
- La eliminación de un registro funciona sin eliminar los demás.
- Cuando no hay registros, se muestra el estado vacío sin datos inventados.
- La interfaz informa que los valores son aproximados y no profesionales.

## 11. Fuera del alcance inicial

No forman parte de la primera versión:

- Cuentas de usuario o acceso para profesores.
- Almacenamiento en la nube o sincronización entre dispositivos.
- Administración de varios colegios o aulas.
- Grabación, reproducción o envío de audio.
- Funcionamiento con la página cerrada, el dispositivo bloqueado o la pestaña suspendida.
- Alertas sonoras como pitidos o mensajes de voz.
- Temas visuales o personajes seleccionables.
- Control remoto del monitor desde otro dispositivo.
