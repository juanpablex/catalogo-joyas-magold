# Catálogo de joyas Magold

Catálogo estático de un distribuidor independiente, sin base de datos ni dependencias. Incluye 32 diseños fotografiados, filtros, búsqueda, selección guardada en el dispositivo y preparación de una consulta por WhatsApp.

## Configurar

1. En `config.js`, completar `whatsapp` con el número internacional solo con dígitos.
2. En `products.js`, los códigos coinciden con las etiquetas y los precios corresponden a la columna contigua en negrita de la hoja proporcionada, según la aclaración del distribuidor. Editar el mapa `prices` para cambiar los precios en Bs.
3. Los números de las etiquetas se repiten entre diseños. Cada producto tiene además una referencia única para identificarlo en el mensaje.

Las vistas de cada pieza usan el encuadre de las fotos originales mediante CSS. Al pulsarlas se puede consultar la foto completa. Revisar los encuadres y correspondencias antes de compartir con clientes; no se han inferido materiales, medidas ni garantías.

## Vista local

Desde esta carpeta ejecutar `python -m http.server 8080` y abrir http://localhost:8080.

## Publicación gratuita

El repositorio guarda el código; no es una web pública de venta por sí solo. Para alojarlo en Cloudflare Pages, conectar este repositorio, elegir sin framework, dejar vacío el comando de compilación y usar la raíz del proyecto como directorio de salida. No requiere servidor ni base de datos.

GitHub Pages no se ha activado debido a sus restricciones sobre sitios destinados principalmente a facilitar transacciones comerciales.

## Cómo funciona

La selección queda en el navegador del cliente. El distribuidor solo recibe los productos cuando el cliente envía el mensaje de WhatsApp. No hay reserva, pagos, inventario automático ni panel central. Para retirar una pieza vendida, eliminarla de `products.js` y volver a publicar.

La hoja interna con datos personales no se incluye en el repositorio.
