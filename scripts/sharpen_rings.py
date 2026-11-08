"""Nitidez localizada autorizada: conserva los píxeles ajenos a las máscaras.

No genera detalles, no modifica colores, no cambia el tamaño ni retoca la piel.
Los originales se conservan. Guarda derivados WebP sin pérdida y una auditoría.
"""
from pathlib import Path
import json
from PIL import Image, ImageDraw, ImageFilter, ImageChops

ROOT=Path(__file__).resolve().parent.parent
SOURCE=ROOT/'assets/web/gallery'
OUT=ROOT/'assets/web/rings-sharp'
AUDIT=ROOT/'output/ring-enhancement'
OUT.mkdir(parents=True,exist_ok=True)
AUDIT.mkdir(parents=True,exist_ok=True)

# Trazos conservadores sobre el centro del metal y las piedras; no rellenan
# los huecos de los aros ni las zonas de piel visibles entre los adornos.
MASKS={
 'AN-231535-1':dict(lines=[(3.2,[(16,20),(13,36),(15,42),(24,43),(36,36),(46,28),(55,28),(62,33),(65,42),(65,62),(68,74),(79,85)])]),
 'AN-231535-2':dict(lines=[(4,[(20,62),(29,53),(36,45),(46,38),(54,32),(63,25),(73,23)])]),
 'AN-231535-3':dict(lines=[(2.7,[(17,57),(25,57),(39,63),(55,63),(70,72),(87,88)]),(3,[(24,52),(21,44),(24,37),(31,32),(38,35),(41,27),(48,25),(54,30),(59,39),(60,50),(55,58),(41,60),(32,57),(24,52)]),(2.5,[(31,37),(28,45),(34,51),(39,44),(39,36)]),(2.5,[(43,32),(48,40),(47,50),(40,54)])]),
 'AN-231535-4':dict(lines=[(2,[(29,51),(36,48)]),(3.8,[(37,47),(43,35),(48,28),(53,28),(60,37),(66,47),(60,59),(53,69),(46,65),(39,56),(37,47)]),(2.8,[(45,48),(50,40),(56,48),(50,56),(45,48)]),(2,[(66,45),(81,43),(98,40)])]),
 'AN-231535-5':dict(lines=[(2,[(18,81),(20,73),(26,66),(35,60)]),(2,[(63,52),(75,54),(86,59),(93,65)]),(3,[(40,62),(49,66),(61,60),(64,54)])],ellipses=[(34,32,61,61)]),
 'AN-231535-6':dict(lines=[(3.4,[(18,66),(25,57),(35,46),(44,38),(54,29),(61,23)])]),
 'AN-231535-7':dict(lines=[(2.5,[(2,38),(15,38),(28,39),(38,44)]),(2.7,[(35,40),(47,35),(59,35),(70,42),(77,52),(81,65),(87,76),(74,77),(61,72),(51,61),(41,48),(35,40)]),(2.5,[(40,40),(42,50),(49,56),(58,54),(62,45),(56,39),(48,38)]),(2.5,[(65,48),(59,55),(57,62),(64,67),(73,66),(78,58)]),(2,[(86,76),(92,80),(93,86)])],ellipses=[(46,41,52,48),(56,55,62,62),(67,44,73,51)]),
 'AN-231644-1':dict(polygons=[[(24,19),(37,18),(49,21),(55,27),(55,33),(50,35),(39,31),(31,27),(23,24)],[(47,38),(56,40),(66,44),(76,50),(80,55),(78,59),(66,58),(55,53),(46,47)]]),
 'AN-231644-2':dict(lines=[(3,[(23,57),(25,47),(32,38),(43,31),(58,33),(75,41),(86,49),(86,60),(81,66),(62,62),(45,57),(30,56),(23,57)]),(3,[(33,46),(36,40),(41,43),(42,51),(47,47),(50,39),(55,44),(55,53),(62,51),(64,43),(69,49),(68,57),(74,55),(78,50)])]),
 'AN-231644-3':dict(lines=[(3,[(20,21),(29,25),(39,30),(48,34),(55,41),(61,47),(69,51),(74,60),(76,69),(81,80),(79,87),(75,90)])]),
 'AN-231644-4':dict(lines=[(3,[(13,60),(18,50),(24,45),(30,45),(37,50)]),(3,[(17,63),(23,67),(30,66),(36,61),(44,48),(52,41),(59,42),(63,48)]),(3,[(33,65),(40,64),(46,56),(50,48)]),(2.6,[(51,44),(57,47),(61,54),(69,50),(74,41),(77,31),(82,28),(86,34),(85,44),(81,54),(73,58),(66,57)])]),
 'AN-231644-5':dict(lines=[(2.7,[(24,47),(26,32),(31,27),(37,32),(35,41),(29,44),(25,47),(26,54),(31,57),(35,54),(36,47)]),(3,[(36,43),(46,41),(55,36),(62,31),(69,40),(77,45)]),(2,[(38,48),(48,46),(58,42),(62,37),(71,46),(77,50)])]),
 'AN-231644-6':dict(lines=[(2,[(5,49),(21,55),(27,56)]),(4,[(29,53),(31,40),(39,30),(51,27),(60,31),(65,40),(65,49),(61,59),(54,64),(44,63),(35,59),(29,53)]),(2,[(63,58),(74,65),(85,72)])]),
 'AN-231644-7':dict(lines=[(3.4,[(12,50),(20,45),(28,40),(38,38),(48,37),(57,35),(66,35),(77,36),(86,39)]),(2.5,[(12,54),(26,48),(42,44),(57,42),(73,42),(87,43)])]),
}

report=[]
for pid,spec in MASKS.items():
    source=SOURCE/(pid+'-cover-detail.webp')
    original=Image.open(source).convert('RGB')
    w,h=original.size
    mask=Image.new('L',original.size,0)
    draw=ImageDraw.Draw(mask)
    def point(p):return (round(p[0]*w/100),round(p[1]*h/100))
    for width,points in spec.get('lines',[]):
        draw.line([point(p) for p in points],fill=255,width=max(1,round(width*min(w,h)/100)),joint='curve')
    for box in spec.get('ellipses',[]):
        draw.ellipse((*point(box[:2]),*point(box[2:])),fill=255)
    for polygon in spec.get('polygons',[]):draw.polygon([point(p) for p in polygon],fill=255)
    # Solo los reflejos claros y los tonos del metal dentro de los trazos.
    # La selección de color reduce aún más cualquier contacto con la piel.
    color_mask=Image.new('L',original.size,0)
    values=[]
    for r,g,b in original.getdata():
        neutral=g>=r*.86 and b>=r*.72
        gold=g>=r*.77 and b<g*.64
        values.append(255 if neutral or gold else 0)
    color_mask.putdata(values)
    mask=ImageChops.multiply(mask,color_mask)
    softened=mask.filter(ImageFilter.GaussianBlur(.35))
    mask=ImageChops.darker(mask,softened)  # No extiende la máscara sobre la piel.
    sharp=original.filter(ImageFilter.UnsharpMask(radius=1.05,percent=170,threshold=3))
    result=Image.composite(sharp,original,mask)
    path=OUT/(pid+'.webp')
    result.save(path,'WEBP',lossless=True,method=6)
    reloaded=Image.open(path).convert('RGB')
    assert reloaded.size==original.size
    changes=0
    outside=0
    for before,after,alpha in zip(original.getdata(),reloaded.getdata(),mask.getdata()):
        if before!=after:
            changes+=1
            if not alpha:outside+=1
    assert outside==0,(pid,outside)
    mask.save(AUDIT/(pid+'-mask.png'))
    report.append(dict(id=pid,width=w,height=h,changed_pixels=changes,changed_pixels_outside_mask=outside,source=str(source.relative_to(ROOT)),result=str(path.relative_to(ROOT))))

(AUDIT/'verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
script='// Nitidez localizada; las fotos originales permanecen sin modificar.\n'
script+='const sharpenedRings='+json.dumps(list(MASKS))+';\n'
script+='''for(const p of window.PRODUCTS){
 if(!sharpenedRings.includes(p.id))continue;
 const cover=p.images[0];
 p.images[0]={...cover,thumbnail:`assets/web/rings-sharp/${p.id}.webp`,detail:`assets/web/rings-sharp/${p.id}.webp`,label:'Detalle del anillo'};
}
'''
(ROOT/'ring-enhancements.js').write_text(script,encoding='utf-8')
print(json.dumps({'rings':len(report),'changed_pixels':sum(p['changed_pixels'] for p in report),'changed_pixels_outside_masks':sum(p['changed_pixels_outside_mask'] for p in report)}))
