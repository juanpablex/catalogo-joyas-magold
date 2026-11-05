"""Prepara las fotos identificadas; conserva los originales fuera del repositorio."""
from pathlib import Path
import json
import sys
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = Path(sys.argv[1]) if len(sys.argv)>1 else Path(r'D:\ia\joyas-imagenes')
OUT = ROOT/'assets/web/gallery'
OUT.mkdir(parents=True, exist_ok=True)
# producto, archivo WA, encuadre normalizado, tipo
entries = [
 ('GR-202705-1',36,[.06,.39,.26,.17],'cover'),
 ('GR-202705-3',34,[.05,.35,.28,.22],'cover'),
 ('GR-202724-3',36,[.39,.39,.24,.17],'cover'),
 ('GR-202724-2',36,[.68,.39,.28,.17],'cover'),
 ('GR-202724-1',38,[.05,.35,.28,.23],'cover'),
 ('GR-202728-2',38,[.38,.35,.26,.23],'cover'),
 ('GR-202728-1',38,[.67,.35,.29,.23],'cover'),
 ('AG-193109-2',20,[.32,.32,.45,.34],'cover'),
 ('AG-193109-4',25,[.32,.39,.44,.26],'cover'),
 ('AG-193109-3',37,[.33,.39,.40,.28],'cover'),
 ('AG-193147-1',33,[.33,.39,.40,.27],'cover'),
 ('AG-193147-2',16,[.32,.35,.43,.29],'cover'),
 ('AG-193147-3',40,[.32,.36,.43,.29],'cover'),
 ('AN-231644-7',9,[.13,.02,.73,.77],'model'),
 ('AN-231644-4',41,[.13,.01,.73,.78],'model'),
 ('AN-231644-5',41,[.13,.01,.73,.78],'model'),
]

def save(im, name, size, quality=82):
    im=im.copy()
    im.thumbnail((size,size),Image.Resampling.LANCZOS)
    im.save(OUT/name,'WEBP',quality=quality,method=6)

gallery={}
for pid,number,box,role in entries:
    filename=f'IMG-20261103-WA{number:04}.jpg'
    with Image.open(SOURCE/filename) as opened:
        im=ImageOps.exif_transpose(opened).convert('RGB')
        save(im,f'WA{number:04}-full.webp',1600)
        x,y,w,h=box
        crop=im.crop((round(x*im.width),round(y*im.height),round((x+w)*im.width),round((y+h)*im.height)))
        stem=f'{pid}-{role}'
        save(crop,stem+'-thumb.webp',480)
        save(crop,stem+'-detail.webp',1000,86)
        gallery.setdefault(pid,[]).append(dict(src=f'assets/web/gallery/WA{number:04}-full.webp',original=f'assets/web/gallery/WA{number:04}-full.webp',thumbnail=f'assets/web/gallery/{stem}-thumb.webp',detail=f'assets/web/gallery/{stem}-detail.webp',label='Foto modelada' if role=='model' else 'Foto de la pieza',role=role))

with Image.open(SOURCE/'IMG-20261103-WA0004.jpg') as opened:
    save(ImageOps.exif_transpose(opened).convert('RGB'),'hero-model.webp',960)

script='// Generado por scripts/prepare_gallery.py.\nconst galleryPhotos='+json.dumps(gallery,ensure_ascii=False)+';\n'
script+='''for(const p of window.PRODUCTS){
 if(!galleryPhotos[p.id])continue;
 const seen=new Set();
 const previous=p.images.filter(photo=>{const key=photo.detail||photo.src;if(seen.has(key))return false;seen.add(key);return true;});
 const added=galleryPhotos[p.id]||[];
 const covers=added.filter(photo=>photo.role==='cover');
 const models=added.filter(photo=>photo.role==='model');
 p.images=covers.length?[...covers,...models,...previous]:[previous[0],...models,...previous.slice(1)];
}
'''
(ROOT/'gallery-photos.js').write_text(script,encoding='utf-8')
print(f'{len(gallery)} productos con nuevas fotos; {sum(p.stat().st_size for p in OUT.glob("*"))/1e6:.2f} MB')
