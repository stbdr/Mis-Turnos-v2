# Mis Turnos — PWA

App instalable para llevar el registro de turnos, ingresos y retenciones. Funciona sin conexión después de la primera visita.

## Páginas
- index.html: portada con el resumen del mes (turnos, media por turno y salario) y los botones de cada sección.
- registro.html: calendario y ficha de cada día (turno, especialidad, empresa, buque, salario, compañeros).
- estadisticas.html: turnos, horas y medias por mes y año.
- ingresos.html: salario bruto, retenciones, neto y totales del año.
- buscar.html: Buscar/Filtrar por buque, compañero, empresa, turno, especialidad y fechas.
- copia.html: exportar e importar copia de seguridad, y exportar un mes a PDF o Excel.
- ajustes.html: horas por turno, retenciones por defecto, tarifas y compañeros.

## Archivos compartidos
- estilo.css: aspecto de todas las páginas.
- datos.js: guardado de datos y cálculos comunes.
- nav.js: barra de navegación inferior, común a todas las páginas (los botones se editan en la lista ITEMS).
- manifest.json y service-worker.js: instalación y funcionamiento sin conexión.
- icons/: iconos de la aplicación (icon-192.png e icon-512.png).

## Añadir una página nueva
Crea la página, enlázala desde index.html, carga datos.js y nav.js al final de la página, y añádela a la lista APP_SHELL de service-worker.js.

## Datos
Los turnos se guardan en el almacenamiento del navegador de cada dispositivo. No hay servidor ni sincronización: usa Copia de seguridad para pasar los datos de un dispositivo a otro.

La exportación a Excel carga su librería desde jsDelivr, así que necesita conexión a internet.
