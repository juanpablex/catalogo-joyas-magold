# Fotos nuevas

## Fondos de espejo

Se sustituyeron las 46 tomas que aún tenían fondo rojo por ediciones de cada pieza sobre espejo dorado, retirando las tarjetas y etiquetas de las imágenes. No cambian las referencias ni los precios. Las fotos modeladas y los acercamientos de anillos conservan su aspecto anterior.

Los archivos para web están en `assets/web/mirror`; `mirror-photos.js` aplica los reemplazos después de cargar las galerías. Los originales editados de mayor resolución y sus registros de generación se conservan localmente en `output/mirror-originals` y `output/mirror`. El empaquetado se realiza con `scripts/prepare_mirror_photos.py`.

El resto de este documento describe la organización previa y las referencias que siguen pendientes.

Origen: `D:\ia\joyas-imagenes`.

Se incorporaron portadas de 13 piezas identificadas y fotos modeladas de los anillos 259, 265 y 134. Las fotos del estuche permanecen al final de sus galerías. Las portadas mejoradas de Flores de corazones y Destellos claros se conservan.

La imagen WA0004 se usa como inspiración en la bienvenida, sin asociarla a un código.

Queda por confirmar antes de asociar o publicar como productos:

- Pulseras: códigos, precios y correspondencia con las fotos modeladas y las del espejo (WA0011–WA0015, WA0018, WA0027, WA0035 y WA0039).
- PNG adicional: pendiente de incorporar.
- La pieza central de WA0034 dice REF. 98; confirmar si corresponde al código 198 del estuche.
- Argollas WA0029: confirmar código.

Las fotos nuevas del estuche y las tomas similares se conservan en la carpeta de origen; se mantiene la foto existente del estuche en cada producto para no acumular duplicados.

Para regenerar los archivos optimizados: `python scripts/prepare_gallery.py "D:\ia\joyas-imagenes"`.

## Fotos interactivas

Las tres cadenas modeladas se asociaron por comparación visual con las piezas del estuche: WA0000 → 282 (lisa), WA0002 → 292 (torcida), WA0004 → 803 (eslabones rectangulares).

Las zonas de anillos están definidas por foto y posición en `modelHotspots`, dentro de `app.js`. Se usa la referencia interna completa, porque hay dos anillos distintos con etiqueta 136. Los puntos se pueden ajustar sin cambiar precios ni inventario. Las piezas cortadas o desenfocadas de fondo no deben usarse para inferir productos nuevos.

Para comprobar fichas y selección desde PowerShell: `Get-Content scripts/check_catalog.cjs -Raw | node -`.
