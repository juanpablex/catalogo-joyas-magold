# Catálogo de joyas Magold

Catálogo estático de un distribuidor independiente, sin base de datos ni dependencias. Incluye 76 diseños fotografiados: 32 aretes, 8 aretes grandes, 7 argollas, 14 anillos, 5 cadenas y 10 dijes. Tiene filtros, búsqueda, selección guardada en el dispositivo y preparación de una consulta por WhatsApp.

## Configurar

1. En `config.js`, completar `whatsapp` con el número internacional solo con dígitos.
2. En `products.js`, los códigos coinciden con las etiquetas y los precios corresponden a la columna contigua en negrita de la hoja proporcionada, según la aclaración del distribuidor. Editar los mapas `prices` y `extraPrices` para cambiar los precios en Bs. El código 209 de los aretes de gotas fue confirmado por el distribuidor.
3. Los números de las etiquetas se repiten entre diseños. Cada producto tiene además una referencia única para identificarlo en el mensaje.

Las vistas de cada pieza usan encuadres de las fotos originales mediante SVG, conservando su proporción. No se retocan las joyas. Cada producto se abre en un visor ampliado y ofrece un enlace a la foto original del estuche. Las fotos se cargan cerca de la pantalla para evitar descargarlas todas al entrar. No se han inferido materiales, medidas, tallas ni garantías.

## Más ángulos de una pieza

Cada producto expone un arreglo `images` con objetos `{src, crop, landscape}`. `crop` es opcional y usa `[izquierda, arriba, ancho, alto]` entre 0 y 1. `landscape` indica una foto horizontal. Al añadir más fotos al mismo producto, el visor muestra flechas, contador y permite deslizar con el dedo o navegar con las teclas izquierda/derecha. Mantener el `id` del producto para conservar las selecciones guardadas. Actualmente cada diseño tiene una vista; las próximas fotos podrán agregarse sin duplicar la joya.

Los diseños parcialmente fuera de las fotos y sin código legible no se registran como productos adicionales.

## Vista local

Desde esta carpeta ejecutar `python -m http.server 8080` y abrir http://localhost:8080.

## Publicación gratuita

El repositorio guarda el código; no es una web pública de venta por sí solo. Para alojarlo en Cloudflare Pages, conectar este repositorio, elegir sin framework, dejar vacío el comando de compilación y usar la raíz del proyecto como directorio de salida. No requiere servidor ni base de datos.

GitHub Pages no se ha activado debido a sus restricciones sobre sitios destinados principalmente a facilitar transacciones comerciales.

## Cómo funciona

La selección queda en el navegador del cliente. El distribuidor solo recibe los productos cuando el cliente envía el mensaje de WhatsApp. No hay reserva, pagos, inventario automático ni panel central. Para retirar una pieza vendida, eliminarla de `products.js` y volver a publicar.

La hoja interna con datos personales no se incluye en el repositorio.
