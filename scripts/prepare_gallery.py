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
 ('AR-193030-1',26,[.20,.09,.22,.15],'cover'),
 ('AR-193030-2',26,[.57,.025,.22,.15],'cover'),
 ('AR-193030-3',26,[.21,.41,.20,.13],'cover'),
 ('AR-193030-4',26,[.55,.39,.23,.15],'cover'),
 ('AR-193030-5',26,[.22,.72,.22,.15],'cover'),
 ('AR-193030-6',26,[.58,.70,.21,.14],'cover'),
 ('AR-193030-7',28,[.17,.005,.23,.10],'cover'),
 ('AR-193030-8',28,[.55,0,.20,.07],'cover'),
 ('AR-193030-9',28,[.21,.16,.24,.08],'cover'),
 ('AR-193030-10',28,[.54,.16,.22,.08],'cover'),
 ('AR-193006-1',28,[.23,.33,.18,.06],'cover'),
 ('AR-193006-2',28,[.55,.32,.20,.07],'cover'),
 ('AR-193006-3',28,[.23,.48,.19,.075],'cover'),
 ('AR-193006-4',28,[.54,.47,.21,.08],'cover'),
 ('AR-193006-5',28,[.19,.65,.21,.08],'cover'),
 ('AR-193006-6',28,[.55,.63,.20,.07],'cover'),
 ('AR-193006-7',28,[.22,.80,.20,.09],'cover'),
 ('AR-193006-8',28,[.55,.79,.20,.075],'cover'),
 ('AR-190134-1',30,[.37,.19,.23,.10],'cover'),
 ('AR-190134-2',30,[.34,.43,.25,.09],'cover'),
 ('AR-190134-3',30,[.35,.62,.21,.08],'cover'),
 ('AR-190134-4',30,[.33,.79,.25,.10],'cover'),
 ('AR-190043-1',32,[.33,.48,.23,.11],'cover'),
 ('AR-190043-2',32,[.35,.64,.21,.10],'cover'),
 ('AR-190043-3',32,[.35,.79,.19,.11],'cover'),
 ('AR-190007-1',21,[.41,.18,.19,.11],'cover'),
 ('AR-190007-2',21,[.40,.39,.20,.10],'cover'),
 ('AR-190007-3',21,[.37,.56,.21,.09],'cover'),
 ('AR-190007-4',21,[.38,.79,.19,.095],'cover'),
 ('AR-185949-1',24,[.38,.27,.21,.11],'cover'),
 ('AR-185949-2',24,[.33,.51,.24,.17],'cover'),
 ('AR-185949-3',24,[.38,.79,.19,.14],'cover'),
 ('AN-231535-1',1,[.45,.285,.14,.085],'cover'),
 ('AN-231535-2',3,[.27,.54,.11,.065],'cover'),
 ('AN-231535-3',1,[.38,.23,.11,.065],'cover'),
 ('AN-231535-4',31,[.37,.41,.14,.08],'cover'),
 ('AN-231535-5',6,[.51,.46,.12,.07],'cover'),
 ('AN-231535-6',31,[.23,.46,.13,.065],'cover'),
 ('AN-231535-7',7,[.52,.25,.12,.075],'cover'),
 ('AN-231644-1',3,[.62,.23,.13,.075],'cover'),
 ('AN-231644-2',1,[.29,.245,.11,.055],'cover'),
 ('AN-231644-3',7,[.72,.31,.10,.09],'cover'),
 ('AN-231644-4',41,[.36,.36,.15,.07],'cover'),
 ('AN-231644-5',41,[.55,.32,.14,.06],'cover'),
 ('AN-231644-6',3,[.56,.19,.105,.065],'cover'),
 ('AN-231644-7',9,[.43,.36,.14,.065],'cover'),
 ('CA-232016-1',0,[.28,.31,.60,.37],'cover'),
 ('CA-231755-1',2,[.28,.31,.60,.37],'cover'),
 ('CA-231811-1',4,[.28,.31,.60,.37],'cover'),
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
        if role=='cover' and pid.startswith(('AN-','CA-')):
            base=f'assets/web/models/WA{number:04}'
            gallery[pid].append(dict(src=base+'-detail.webp',original=base+'-detail.webp',thumbnail=base+'-preview.webp',detail=base+'-detail.webp',label='Foto modelada',role='model'))

with Image.open(SOURCE/'IMG-20261103-WA0004.jpg') as opened:
    save(ImageOps.exif_transpose(opened).convert('RGB'),'hero-model.webp',960)

script='// Generado por scripts/prepare_gallery.py.\nconst galleryPhotos='+json.dumps(gallery,ensure_ascii=False)+';\n'
script+='''for(const p of window.PRODUCTS){
 const seen=new Set();
 const previous=p.images.filter(photo=>{const key=photo.detail||photo.src;if(seen.has(key))return false;seen.add(key);return true;});
 const added=galleryPhotos[p.id]||[];
 const covers=added.filter(photo=>photo.role==='cover');
 const models=added.filter(photo=>photo.role==='model');
 // Donde hay una toma nueva, sustituye las antiguas en lugar de acumularlas.
 p.images=added.length?[...covers,...models]:previous;
}
'''
(ROOT/'gallery-photos.js').write_text(script,encoding='utf-8')
print(f'{len(gallery)} productos con nuevas fotos; {sum(p.stat().st_size for p in OUT.glob("*"))/1e6:.2f} MB')
