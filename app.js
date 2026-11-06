const config=window.CATALOGO_CONFIG;
const categoryOrder=['Aretes','Aretes grandes','Argollas','Anillos','Manillas','Cadenas','Dijes'];
const products=[...window.PRODUCTS].sort((a,b)=>categoryOrder.indexOf(a.category)-categoryOrder.indexOf(b.category));
let selected=new Set();
try{const saved=JSON.parse(localStorage.getItem('joyas-selection')||'[]');if(Array.isArray(saved))selected=new Set(saved.filter(id=>products.some(p=>p.id===id)));}catch{}
let category='Todas';
const $=s=>document.querySelector(s);
// La cabecera cambia de altura al pasar a móvil o ampliar el texto.
const catalogHeader=document.querySelector('header');
function updateHeaderHeight(){document.documentElement.style.setProperty('--header-height',`${Math.ceil(catalogHeader.getBoundingClientRect().height)}px`);}
updateHeaderHeight();
if('ResizeObserver' in window)new ResizeObserver(updateHeaderHeight).observe(catalogHeader);
else window.addEventListener('resize',updateHeaderHeight);
const money=n=>n==null?'Consultar precio':`${n.toLocaleString('es-BO')} Bs`;
// Cargar cada foto cuando se acerca a la pantalla evita descargar todo el estuche al entrar.
const photoLoader='IntersectionObserver' in window?new IntersectionObserver(entries=>{entries.forEach(({isIntersecting,target})=>{if(!isIntersecting)return;if(target.dataset.href)target.setAttribute('href',target.dataset.href);if(target.dataset.background)target.style.backgroundImage=`url("${target.dataset.background}")`;photoLoader.unobserve(target);});},{rootMargin:'300px'}):null;
function loadPhoto(node){if(photoLoader)photoLoader.observe(node);else if(node.dataset.href)node.setAttribute('href',node.dataset.href);else node.style.backgroundImage=`url("${node.dataset.background}")`;}
function photoFrame(p,photo,lazy=true){
 const frame=document.createElement('div');frame.className='product-image';
 if(photo.thumbnail&&photo.detail){
  const image=document.createElement('img');image.src=lazy?photo.thumbnail:photo.detail;image.alt=p.name;image.loading=lazy?'lazy':'eager';image.decoding='async';image.width=480;image.height=480;
  frame.append(image);return frame;
 }
 if(photo.crop){
  const ns='http://www.w3.org/2000/svg';const svg=document.createElementNS(ns,'svg');
  const width=photo.landscape?4000:3000,height=photo.landscape?3000:4000;
  const [x,y,w,h]=photo.crop;
  svg.setAttribute('viewBox',`${x*width} ${y*height} ${w*width} ${h*height}`);svg.setAttribute('role','img');svg.setAttribute('aria-label',p.name);
  const image=document.createElementNS(ns,'image');image.setAttribute('width',width);image.setAttribute('height',height);image.dataset.href=photo.src;
  svg.append(image);frame.append(svg);if(lazy)loadPhoto(image);else image.setAttribute('href',photo.src);
 }else{
  frame.dataset.background=photo.src;frame.style.backgroundPosition=`${p.x}% ${p.y}%`;frame.style.backgroundSize=p.image.includes('193030')?'210% 500%':p.image.includes('193006')?'210% 400%':'110% 400%';
  if(lazy)loadPhoto(frame);else frame.style.backgroundImage=`url("${photo.src}")`;
 }
 return frame;
}
let activeProduct=null,photoIndex=0,modelReturn=null;
function showPhoto(){
 const p=activeProduct,photo=p.images[photoIndex];
 $('#photo').dataset.editorial=p.editorial?'true':'false';
 $('#photo-stage').replaceChildren(p.editorial?modelScene(photo,()=>{},false):photoFrame(p,photo,false));
 $('#product-info').hidden=!!p.editorial;
 $('#back-to-model').hidden=!!p.editorial||!modelReturn;
 if(!p.editorial){
  $('#product-name').textContent=p.name;
  $('#product-meta').textContent=`${categoryTitles[p.category]||p.category} · Código ${p.tag||'Por confirmar'} · Ref. ${p.id}`;
  $('#product-price').textContent=money(p.price);
  $('#product-add').textContent=selected.has(p.id)?'✓ En tu selección':'＋ Agregar a mi selección';
  $('#product-add').setAttribute('aria-pressed',selected.has(p.id));
  $('#product-add').onclick=()=>{selected.has(p.id)?selected.delete(p.id):selected.add(p.id);persist();render();showPhoto();};
 }
 $('#photo-caption').textContent=p.editorial?`${p.name} · ${photoIndex+1} de ${p.images.length}`:photo.label||'Foto de la pieza';
 $('#photo-number').textContent=`${photoIndex+1} / ${p.images.length}`;
 $('#photo-controls').hidden=p.images.length<2;
 $('#original-photo').href=photo.original||photo.src.replace('assets/','assets/web/').replace(/\.jpg$/,'.webp');
}
function movePhoto(step){if(!activeProduct)return;photoIndex=(photoIndex+step+activeProduct.images.length)%activeProduct.images.length;showPhoto();}
function openPhoto(p,origin=null){modelReturn=origin;activeProduct=p;photoIndex=0;showPhoto();if(!$('#photo').open)$('#photo').showModal();}
function returnToModel(){if(!modelReturn)return;const {kind,number}=modelReturn;activeProduct={editorial:true,name:`${categoryTitles[kind]} · Fotos modeladas`,images:modelSets[kind].map(modelPhoto)};photoIndex=modelSets[kind].indexOf(number);showPhoto();}
const modelSets={Cadenas:[0,2,4],Anillos:[1,3,5,6,7,8,9,10,17,23,31,41]};
// Coordenadas sobre la foto completa, en porcentajes. Solo piezas identificadas.
const modelHotspots={
 0:[{id:'CA-232016-1',x:53,y:64,w:50,h:18}],
 2:[{id:'CA-231755-1',x:53,y:64,w:50,h:18}],
 4:[{id:'CA-231811-1',x:53,y:64,w:50,h:18}],
 1:[{id:'AN-231644-2',x:35,y:26},{id:'AN-231535-3',x:43,y:25},{id:'AN-231535-1',x:52,y:31}],
 3:[{id:'AN-231644-2',x:53,y:22},{id:'AN-231644-6',x:61,y:22},{id:'AN-231644-1',x:68,y:26},{id:'AN-231535-1',x:18,y:66},{id:'AN-231535-2',x:32,y:57}],
 5:[{id:'AN-231644-2',x:39,y:4},{id:'AN-231644-6',x:49,y:1},{id:'AN-231644-1',x:60,y:1},{id:'AN-231535-1',x:40,y:52},{id:'AN-231535-2',x:50,y:36}],
 6:[{id:'AN-231535-6',x:25,y:33},{id:'AN-231535-5',x:37,y:32},{id:'AN-231535-7',x:49,y:54},{id:'AN-231535-5',x:57,y:50}],
 7:[{id:'AN-231535-6',x:19,y:44},{id:'AN-231535-5',x:29,y:45},{id:'AN-231535-7',x:58,y:29},{id:'AN-231644-3',x:77,y:35}],
 8:[{id:'AN-231644-2',x:47,y:26},{id:'AN-231535-3',x:53,y:26},{id:'AN-231535-1',x:61,y:31},{id:'AN-231644-1',x:15,y:53}],
 9:[{id:'AN-231644-7',x:50,y:39}],
 10:[{id:'AN-231644-4',x:35,y:49},{id:'AN-231644-5',x:60,y:50}],
 17:[{id:'AN-231535-6',x:51,y:13},{id:'AN-231535-5',x:64,y:21},{id:'AN-231535-7',x:48,y:48},{id:'AN-231535-5',x:58,y:50}],
 23:[{id:'AN-231535-6',x:30,y:44},{id:'AN-231535-4',x:46,y:41}],
 31:[{id:'AN-231535-6',x:29,y:50},{id:'AN-231535-4',x:44,y:45}],
 41:[{id:'AN-231644-4',x:43,y:39},{id:'AN-231644-5',x:62,y:35}]
};
const braceletSpots={
 1:[['MA-malla',16,70,48,12]],
 3:[['MA-malla',43,51,40,15],['MA-perlas-alargadas',47,88,40,15]],
 5:[['MA-malla',34,34,35,12],['MA-perlas-alargadas',91,79,18,32]],
 6:[['MA-medallones',22,62,35,15],['MA-rectangulos',74,91,40,12]],
 7:[['MA-medallones',8,83,22,22],['MA-rectangulos',55,70,35,12]],
 8:[['MA-malla',43,57,35,15],['MA-perlas-alargadas',36,86,40,15]],
 9:[['MA-ovalos',55,74,40,12]],
 17:[['MA-medallones',17,38,20,25],['MA-rectangulos',28,94,40,12]],
 23:[['MA-medallones',45,71,40,12],['MA-medallones',96,68,16,24]],
 31:[['MA-medallones',51,81,40,12]],
 41:[['MA-perlitas-barras',63,77,40,14]]
};
for(const [number,spots] of Object.entries(braceletSpots))for(const [id,x,y,w,h] of spots)modelHotspots[number].push({id,x,y,w,h});
const categoryTitles={Cadenas:'Collares',Anillos:'Anillos',Manillas:'Manillas',Aretes:'Aretes','Aretes grandes':'Aretes grandes',Argollas:'Argollas',Dijes:'Dijes'};
function modelPhoto(number){const base=`assets/web/models/WA${String(number).padStart(4,'0')}`;return {modelNumber:number,src:`${base}-detail.webp`,original:`${base}-detail.webp`,thumbnail:`${base}-preview.webp`,detail:`${base}-detail.webp`};}
function modelScene(photo,onExpand,lazy=true){
 const scene=document.createElement('div');scene.className='model-scene';
 const expand=document.createElement('button');expand.className='model-photo';expand.setAttribute('aria-label','Ampliar foto modelada');
 const img=document.createElement('img');img.src=lazy?photo.thumbnail:photo.detail;img.alt='Joyas mostradas en modelo';img.loading=lazy?'lazy':'eager';img.decoding='async';img.width=480;img.height=640;
 expand.append(img);expand.onclick=onExpand;scene.append(expand);
 for(const spot of modelHotspots[photo.modelNumber]||[]){
  const product=products.find(p=>p.id===spot.id);if(!product)continue;
  const button=document.createElement('button');button.className='jewel-hotspot';button.style.left=`${spot.x}%`;button.style.top=`${spot.y}%`;if(spot.w)button.style.width=`${spot.w}%`;if(spot.h)button.style.height=`${spot.h}%`;button.textContent='';button.title=`${product.name} · ${money(product.price)}`;button.setAttribute('aria-label',`Ver ${product.name}, código ${product.tag||'por confirmar'}, ${money(product.price)}`);
  button.onclick=event=>{
   let target=product;
   // En móvil las áreas táctiles pueden tocarse: el centro más cercano decide.
   if(event?.detail&&Number.isFinite(event.clientX)){
    const rect=scene.getBoundingClientRect();const x=(event.clientX-rect.left)/rect.width*100,y=(event.clientY-rect.top)/rect.height*100;
    const closest=[...modelHotspots[photo.modelNumber]].sort((a,b)=>Math.hypot((a.x-x)*rect.width,(a.y-y)*rect.height)-Math.hypot((b.x-x)*rect.width,(b.y-y)*rect.height))[0];target=products.find(p=>p.id===closest.id)||product;
   }
   const kind=Object.keys(modelSets).find(key=>modelSets[key].includes(photo.modelNumber));openPhoto(target,{kind,number:photo.modelNumber});
  };scene.append(button);
 }
 return scene;
}
function modelGallery(kind){
 const gallery=document.createElement('div');gallery.className='model-gallery';gallery.setAttribute('aria-label',`Fotos modeladas de ${categoryTitles[kind]}`);
 const photos=modelSets[kind].map(modelPhoto);
 photos.forEach((photo,index)=>{
  const scene=modelScene(photo,()=>{activeProduct={editorial:true,name:`${categoryTitles[kind]} · Fotos modeladas`,images:photos};photoIndex=index;showPhoto();$('#photo').showModal();});gallery.append(scene);
 });
 return gallery;
}
function persist(){try{localStorage.setItem('joyas-selection',JSON.stringify([...selected]));}catch{} $('#count').textContent=selected.size;}
function render(){
 photoLoader?.disconnect();
 const query=$('#search').value.trim().toLocaleLowerCase('es');
 const shown=products.filter(p=>(category==='Todas'||p.category===category)&&`${p.name} ${p.tag||'Por confirmar'} ${p.id}`.toLocaleLowerCase('es').includes(query));
 const cards=shown.map(p=>{
  const article=document.createElement('article');article.className='card';
  const image=document.createElement('button');image.className='image-button';image.setAttribute('aria-label',`Ver foto de ${p.name}`);
  const frame=photoFrame(p,p.images[0]);
  image.append(frame);image.onclick=()=>openPhoto(p);
  const heading=document.createElement('h3');heading.textContent=p.name;
  const meta=document.createElement('p');meta.className='meta';meta.textContent=`${p.category} · Código ${p.tag||'Por confirmar'}`;
  const price=document.createElement('p');price.className='price';price.textContent=p.price===null?'Consultar precio':money(p.price);
  const add=document.createElement('button');add.className=`add ${selected.has(p.id)?'selected':''}`;add.textContent=selected.has(p.id)?'✓ En tu selección':'＋ Agregar a mi selección';add.setAttribute('aria-pressed',selected.has(p.id));add.onclick=()=>{selected.has(p.id)?selected.delete(p.id):selected.add(p.id);persist();render();};
  article.append(image,heading,meta,price,add);return article;
 });
 const sections=[];
 for(const kind of ['Cadenas','Anillos','Manillas','Aretes','Aretes grandes','Argollas','Dijes']){
  const matches=shown.map((p,index)=>({p,card:cards[index]})).filter(item=>item.p.category===kind);
  if(!matches.length)continue;
  const section=document.createElement('section');section.className='category-section';section.id=`section-${kind.replaceAll(' ','-')}`;
  const heading=document.createElement('h2');heading.textContent=categoryTitles[kind];section.append(heading);
  if(modelSets[kind]&&!query){
   const intro=document.createElement('p');intro.className='category-intro';intro.textContent=kind==='Anillos'?'Toca un anillo o una manilla para ver su información. Desliza para explorar las 12 fotos.':'Toca el collar para ver su información, precio y fotos.';section.append(intro,modelGallery(kind));
   const subtitle=document.createElement('h3');subtitle.className='individual-title';subtitle.textContent=kind==='Anillos'?'Elige tu anillo':'Elige tu collar';section.append(subtitle);
  }
  const grid=document.createElement('div');grid.className='grid';grid.append(...matches.map(item=>item.card));section.append(grid);sections.push(section);
 }
 $('#products').replaceChildren(...sections);
 $('#results').textContent=shown.length?`${shown.length} diseños · Disponibilidad a confirmar por chat`:'No encontramos diseños con esa búsqueda.';persist();
}
function chosen(){return products.filter(p=>selected.has(p.id));}
function message(){return ['Hola, me interesan estas joyas Magold:',...chosen().map(p=>`• ${p.name} | Etiqueta ${p.tag||'Por confirmar'} | Ref. ${p.id}${p.price===null?'':` | ${money(p.price)}`}`),'¿Me confirmas precio, disponibilidad y entrega?'].join('\n');}
function renderCart(){
 const items=chosen();$('#cart-items').replaceChildren(...items.map(p=>{const row=document.createElement('div');row.className='cart-row';const text=document.createElement('p');text.textContent=`${p.name} · Código ${p.tag||'Por confirmar'} · ${money(p.price)}`;const remove=document.createElement('button');remove.textContent='Quitar';remove.setAttribute('aria-label',`Quitar ${p.name}`);remove.onclick=()=>{selected.delete(p.id);persist();render();renderCart();};row.append(text,remove);return row;}));
 if(!items.length)$('#cart-items').textContent='Tu selección está vacía. Explora el catálogo para agregar tus favoritos.';
 $('#total').textContent=items.length&&items.every(p=>p.price!==null)?`Total: ${money(items.reduce((s,p)=>s+p.price,0))}`:'';
 const valid=/^[1-9]\d{7,14}$/.test(config.whatsapp);
 $('#contact-status').textContent=valid?'El mensaje se prepara en WhatsApp. Pulsa Enviar allí para que lo reciba el distribuidor.':'El contacto de WhatsApp todavía no está configurado. Puedes copiar tu selección.';
 $('#send').disabled=!valid||!items.length;$('#copy').disabled=!items.length;
}
document.querySelectorAll('[data-category]').forEach(button=>button.onclick=()=>{category=button.dataset.category;document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('active',b===button));render();});
$('#search').oninput=render;
$('#open-cart').onclick=()=>{renderCart();$('#feedback').textContent='';$('#cart').showModal();};
$('#close-cart').onclick=()=>$('#cart').close();$('#close-photo').onclick=()=>$('#photo').close();
$('#previous-photo').onclick=()=>movePhoto(-1);$('#next-photo').onclick=()=>movePhoto(1);
$('#back-to-model').onclick=returnToModel;
$('#photo').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')movePhoto(-1);if(e.key==='ArrowRight')movePhoto(1);});
let touchStart=null;
$('#photo-stage').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('#photo-stage').addEventListener('touchend',e=>{if(!touchStart||!activeProduct)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))movePhoto(dx>0?-1:1);touchStart=null;},{passive:true});
$('#send').onclick=()=>{if(chosen().length&&/^[1-9]\d{7,14}$/.test(config.whatsapp))window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message())}`,'_blank','noopener,noreferrer');};
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(message());$('#feedback').textContent='Selección copiada.';}catch{$('#feedback').textContent=message();$('#feedback').style.whiteSpace='pre-wrap';}};
render();




