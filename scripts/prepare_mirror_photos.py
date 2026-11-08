"""Empaqueta las ediciones de espejo aprobadas sin retocar sus píxeles.

Los registros output/mirror/*.json apuntan a los resultados de ImageGen.
Solo copia los originales y genera tamaños de entrega para el catálogo.
"""
from pathlib import Path
import json
import shutil
import filecmp
from PIL import Image,ImageOps,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'assets/web/mirror'
ARCHIVE=ROOT/'output/mirror-originals'
OUT.mkdir(parents=True,exist_ok=True)
ARCHIVE.mkdir(parents=True,exist_ok=True)
records=[json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT/'output/mirror').glob('*.json'))]
photos={}
for item in records:
 pid=item['id'];source=Path(item['path'])
 archived=ARCHIVE/(pid+'.png')
 changed=not archived.exists() or not filecmp.cmp(source,archived,shallow=False)
 if changed or not all((OUT/f'{pid}-{name}.webp').exists() for name in ['thumb','detail','full']):
  shutil.copy2(source,archived)
  with Image.open(source) as opened:
   image=ImageOps.exif_transpose(opened).convert('RGB')
   for name,size,quality in [('thumb',480,80),('detail',1000,86),('full',1400,88)]:
    resized=image.copy();resized.thumbnail((size,size),Image.Resampling.LANCZOS)
    resized.save(OUT/f'{pid}-{name}.webp','WEBP',quality=quality,method=6)
 photos[pid]=dict(src=f'assets/web/mirror/{pid}-full.webp',original=f'assets/web/mirror/{pid}-full.webp',thumbnail=f'assets/web/mirror/{pid}-thumb.webp',detail=f'assets/web/mirror/{pid}-detail.webp',label='Foto de la pieza')
script='// Fondos de espejo editados con IA a partir de las fotos de cada pieza.\nconst mirrorPhotos='+json.dumps(photos,ensure_ascii=False)+';\n'
script+='''for(const p of window.PRODUCTS){
 if(!mirrorPhotos[p.id])continue;
 // Sustituye las tomas con fondo rojo; conserva las fotos modeladas.
 p.images=[mirrorPhotos[p.id],...p.images.filter(photo=>photo.role==='model')];
}
'''
(ROOT/'mirror-photos.js').write_text(script,encoding='utf-8')

# Hoja para revisar cada edición junto a su foto de entrada.
catalog={p['id']:p for p in json.loads((ROOT/'output/background-products.json').read_text(encoding='utf-8'))}
font=ImageFont.truetype('C:/Windows/Fonts/arial.ttf',16)
for start in range(0,len(records),12):
 batch=records[start:start+12]
 sheet=Image.new('RGB',(1440,((len(batch)+2)//3)*265),'#faf7f2');draw=ImageDraw.Draw(sheet)
 for i,item in enumerate(batch):
  x=i%3*480;y=i//3*265;pid=item['id']
  before=ImageOps.contain(Image.open(ROOT/catalog[pid]['images'][0]['detail']),(190,215))
  after=ImageOps.contain(Image.open(OUT/f'{pid}-thumb.webp'),(240,240))
  sheet.paste(before,(x+(200-before.width)//2,y+(240-before.height)//2));sheet.paste(after,(x+215,y))
  draw.text((x+8,y+242),pid,font=font,fill='#332b29')
 sheet.save(ROOT/f'output/mirror-review-{start//12+1}.jpg',quality=93)
print(json.dumps({'photos':len(photos),'web_MB':round(sum(p.stat().st_size for p in OUT.glob('*.webp'))/1e6,2)}))
