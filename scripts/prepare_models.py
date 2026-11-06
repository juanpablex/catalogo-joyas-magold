"""Optimiza fotos de inspiración por categoría sin asignar códigos a las piezas."""
from pathlib import Path
from PIL import Image, ImageOps
root=Path(__file__).resolve().parent.parent
source=Path(r'D:\ia\joyas-imagenes')
out=root/'assets/web/models'
out.mkdir(parents=True,exist_ok=True)
for number in [0,2,4,1,3,5,6,7,8,9,10,17,23,31,41]:
    with Image.open(source/f'IMG-20261103-WA{number:04}.jpg') as opened:
        image=ImageOps.exif_transpose(opened).convert('RGB')
        for suffix,size,quality in [('preview',640,78),('detail',1200,84)]:
            resized=image.copy()
            resized.thumbnail((size,size),Image.Resampling.LANCZOS)
            resized.save(out/f'WA{number:04}-{suffix}.webp','WEBP',quality=quality,method=6)
print('Fotos de collares y manos preparadas.')
