"""Crea fichas de manillas fotografiadas, con precio pendiente de confirmar."""
from pathlib import Path
import json
from PIL import Image, ImageOps
root=Path(__file__).resolve().parent.parent
source=Path(r'D:\ia\joyas-imagenes')
out=root/'assets/web/bracelets'
out.mkdir(parents=True,exist_ok=True)
entries=[
 ('MA-malla','Manilla de malla dorada',14,[.15,.335,.70,.065],1),
 ('MA-ovalos','Manilla de eslabones ovalados',14,[.20,.44,.60,.05],9),
 ('MA-rectangulos','Manilla de eslabones rectangulares',14,[.25,.48,.50,.045],7),
 ('MA-medallones','Manilla de medallones calados',14,[.24,.54,.52,.06],6),
 ('MA-perlas-alargadas','Manilla con detalles alargados tipo perla',13,[.30,.49,.35,.12],5),
 ('MA-perlitas-barras','Manilla de perlitas y barras',13,[.30,.30,.28,.09],41),
]
def save(image,name,size,quality=83):
 image=image.copy();image.thumbnail((size,size),Image.Resampling.LANCZOS);image.save(out/name,'WEBP',quality=quality,method=6)
products=[]
for pid,name,number,box,model in entries:
 with Image.open(source/f'IMG-20261103-WA{number:04}.jpg') as opened:
  im=ImageOps.exif_transpose(opened).convert('RGB');save(im,f'WA{number:04}.webp',1600)
  x,y,w,h=box;piece=im.crop((round(x*im.width),round(y*im.height),round((x+w)*im.width),round((y+h)*im.height)))
  save(piece,pid+'-thumb.webp',480);save(piece,pid+'-detail.webp',1000)
  full=f'assets/web/bracelets/WA{number:04}.webp'
  base=f'assets/web/models/WA{model:04}'
  products.append(dict(id=pid,tag=None,name=name,category='Manillas',price=None,image=full,images=[dict(src=full,original=full,thumbnail=f'assets/web/bracelets/{pid}-thumb.webp',detail=f'assets/web/bracelets/{pid}-detail.webp',label='Foto de la manilla'),dict(src=base+'-detail.webp',original=base+'-detail.webp',thumbnail=base+'-preview.webp',detail=base+'-detail.webp',label='Foto modelada')]))
(root/'bracelets.js').write_text('// Generado por scripts/prepare_bracelets.py.\nwindow.PRODUCTS.push(...'+json.dumps(products,ensure_ascii=False)+');\n',encoding='utf-8')
print('Seis fichas de manillas preparadas, sin inventar códigos ni precios.')

