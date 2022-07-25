# IMPORTANTE: Corrección de errores

## `navigator.getUserMedia`

`navigator.getUserMedia` está ahora obsoleto y es reemplazado por `navigator.mediaDevices.getUserMedia`. Para corregir este error, sustituya todas las versiones de `navigator.getUserMedia` por `navigator.mediaDevices.getUserMedia`.

## Error en los dispositivos de gama baja

El eventListener de vídeo para `play` se dispara demasiado pronto en los equipos de gama baja, antes de que el vídeo esté completamente cargado, lo que provoca que aparezcan errores de la API de Cara y que se termine el script (probado en Debian [Firefox] y Windows [Chrome, Firefox]). Sustituido por el evento `playing`, que se dispara cuando el medio tiene suficientes datos para empezar a reproducirse.

