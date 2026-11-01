"""Genera imágenes de entrega web sin modificar las fotos originales.

Requisitos: Python, Pillow y Node. Ejecutar desde cualquier carpeta.
"""
from collections import defaultdict
from pathlib import Path
import json
import subprocess
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
catalog = subprocess.run(
    ['node', '-e', "global.window={};require('./products.js');process.stdout.write(JSON.stringify(window.PRODUCTS));"],
    cwd=ROOT, check=True, capture_output=True, text=True, encoding='utf-8'
)
products = json.loads(catalog.stdout)
output = ROOT / 'assets' / 'web'
output.mkdir(exist_ok=True)
by_source = defaultdict(list)
for product in products:
    by_source[product['image']].append(product)

def save_web(image, name, size, quality=80):
    result = image.copy()
    result.thumbnail((size, size), Image.Resampling.LANCZOS)
    result.save(output / name, 'WEBP', quality=quality, method=4)

for source, pieces in by_source.items():
    with Image.open(ROOT / source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        save_web(image, Path(source).stem + '.webp', 1800, 78)
        for product in pieces:
            x, y, w, h = product['crop']
            width, height = image.size
            piece = image.crop((round(x*width), round(y*height), round((x+w)*width), round((y+h)*height)))
            save_web(piece, product['id'] + '-thumb.webp', 480)
            save_web(piece, product['id'] + '-detail.webp', 1000, 84)
        if Path(source).stem == '20261031_193109':
            save_web(image, 'hero.webp', 960, 76)

original_bytes = sum((ROOT / path).stat().st_size for path in by_source)
thumb_bytes = sum((output / (p['id'] + '-thumb.webp')).stat().st_size for p in products)
detail_bytes = sum((output / (p['id'] + '-detail.webp')).stat().st_size for p in products)
print(json.dumps({'original_MB': round(original_bytes/1e6,2), 'miniaturas_MB': round(thumb_bytes/1e6,2),
                  'detalles_MB': round(detail_bytes/1e6,2), 'reduccion_miniaturas_porcentaje': round(100*(1-thumb_bytes/original_bytes),1),
                  'productos': len(products)}))
