// Nitidez localizada; las fotos originales permanecen sin modificar.
const sharpenedRings=["AN-231535-1", "AN-231535-2", "AN-231535-3", "AN-231535-4", "AN-231535-5", "AN-231535-6", "AN-231535-7", "AN-231644-1", "AN-231644-2", "AN-231644-3", "AN-231644-4", "AN-231644-5", "AN-231644-6", "AN-231644-7"];
for(const p of window.PRODUCTS){
 if(!sharpenedRings.includes(p.id))continue;
 if(p.id==='AN-231535-3'){
  const detail='assets/web/rings-sharp/198-modelo-detail.webp';
  p.images=[{src:detail,original:detail,detail,thumbnail:'assets/web/rings-sharp/198-modelo-thumb.webp',label:'Vista modelada con IA'}];
  continue;
 }
 const cover=p.images[0];
 p.images[0]={...cover,thumbnail:`assets/web/rings-sharp/${p.id}.webp`,detail:`assets/web/rings-sharp/${p.id}.webp`,label:'Detalle del anillo'};
}
