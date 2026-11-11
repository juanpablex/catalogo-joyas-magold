// Portadas modeladas, vinculadas al código de cada collar.
const collarModels={466:'WA0000',484:'WA0002',803:'WA0004'};
for(const p of window.PRODUCTS){
 if(p.category!=='Cadenas')continue;
 const existing=collarModels[p.tag];
 const base=existing?'assets/web/models/'+existing:'assets/web/collars/'+p.tag;
 const detail=base+'-detail.webp';
 p.images=[{src:detail,detail,original:detail,thumbnail:base+(existing?'-preview.webp':'-thumb.webp'),label:existing?'Foto modelada':'Vista modelada con IA'}];
}
