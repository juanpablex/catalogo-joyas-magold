const config=window.CATALOGO_CONFIG;
const categoryOrder=['Aretes','Aretes grandes','Argollas','Anillos','Cadenas','Dijes'];
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
const money=n=>`${n.toLocaleString('es-BO')} Bs`;
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
let activeProduct=null,photoIndex=0;
function showPhoto(){
 const p=activeProduct,photo=p.images[photoIndex];
 $('#photo-stage').replaceChildren(photoFrame(p,photo,false));
 $('#photo-caption').textContent=p.editorial?`${p.name} · ${photoIndex+1} de ${p.images.length}`:`${p.name} · Código ${p.tag} · ${money(p.price)}${photo.label?` · ${photo.label}`:''}`;
 $('#photo-number').textContent=`${photoIndex+1} / ${p.images.length}`;
 $('#photo-controls').hidden=p.images.length<2;
 $('#original-photo').href=photo.original||photo.src.replace('assets/','assets/web/').replace(/\.jpg$/,'.webp');
}
function movePhoto(step){if(!activeProduct)return;photoIndex=(photoIndex+step+activeProduct.images.length)%activeProduct.images.length;showPhoto();}
function openPhoto(p){activeProduct=p;photoIndex=0;showPhoto();$('#photo').showModal();}
const modelSets={Cadenas:[0,2,4],Anillos:[1,3,5,6,7,8,9,10,17,23,31,41]};
const categoryTitles={Cadenas:'Collares',Anillos:'Anillos',Aretes:'Aretes','Aretes grandes':'Aretes grandes',Argollas:'Argollas',Dijes:'Dijes'};
function modelPhoto(number){const base=`assets/web/models/WA${String(number).padStart(4,'0')}`;return {src:`${base}-detail.webp`,original:`${base}-detail.webp`,thumbnail:`${base}-preview.webp`,detail:`${base}-detail.webp`};}
function modelGallery(kind){
 const gallery=document.createElement('div');gallery.className='model-gallery';gallery.setAttribute('aria-label',`Fotos modeladas de ${categoryTitles[kind]}`);
 const photos=modelSets[kind].map(modelPhoto);
 photos.forEach((photo,index)=>{
  const button=document.createElement('button');button.className='model-photo';button.setAttribute('aria-label',`Ampliar foto ${index+1} de ${categoryTitles[kind]}`);
  const img=document.createElement('img');img.src=photo.thumbnail;img.alt=kind==='Anillos'?'Anillos mostrados en manos de modelo':'Collar mostrado en una modelo';img.loading='lazy';img.decoding='async';img.width=480;img.height=640;
  button.append(img);button.onclick=()=>{activeProduct={editorial:true,name:`${categoryTitles[kind]} · Fotos modeladas`,images:photos};photoIndex=index;showPhoto();$('#photo').showModal();};gallery.append(button);
 });
 return gallery;
}
function persist(){try{localStorage.setItem('joyas-selection',JSON.stringify([...selected]));}catch{} $('#count').textContent=selected.size;}
function render(){
 photoLoader?.disconnect();
 const query=$('#search').value.trim().toLocaleLowerCase('es');
 const shown=products.filter(p=>(category==='Todas'||p.category===category)&&`${p.name} ${p.tag} ${p.id}`.toLocaleLowerCase('es').includes(query));
 const cards=shown.map(p=>{
  const article=document.createElement('article');article.className='card';
  const image=document.createElement('button');image.className='image-button';image.setAttribute('aria-label',`Ver foto de ${p.name}`);
  const frame=photoFrame(p,p.images[0]);
  image.append(frame);image.onclick=()=>openPhoto(p);
  const heading=document.createElement('h3');heading.textContent=p.name;
  const meta=document.createElement('p');meta.className='meta';meta.textContent=`${p.category} · Código ${p.tag}`;
  const price=document.createElement('p');price.className='price';price.textContent=p.price===null?'Consultar precio':money(p.price);
  const add=document.createElement('button');add.className=`add ${selected.has(p.id)?'selected':''}`;add.textContent=selected.has(p.id)?'✓ En tu selección':'＋ Agregar a mi selección';add.setAttribute('aria-pressed',selected.has(p.id));add.onclick=()=>{selected.has(p.id)?selected.delete(p.id):selected.add(p.id);persist();render();};
  article.append(image,heading,meta,price,add);return article;
 });
 const sections=[];
 for(const kind of ['Cadenas','Anillos','Aretes','Aretes grandes','Argollas','Dijes']){
  const matches=shown.map((p,index)=>({p,card:cards[index]})).filter(item=>item.p.category===kind);
  if(!matches.length)continue;
  const section=document.createElement('section');section.className='category-section';section.id=`section-${kind.replaceAll(' ','-')}`;
  const heading=document.createElement('h2');heading.textContent=categoryTitles[kind];section.append(heading);
  if(modelSets[kind]&&!query){
   const intro=document.createElement('p');intro.className='category-intro';intro.textContent=kind==='Anillos'?'12 fotos de anillos en manos de modelo. Desliza para verlas o toca una para ampliarla.':'Descubre cómo lucen los collares puestos. Desliza las fotos o toca una para verla en grande.';section.append(intro,modelGallery(kind));
   const subtitle=document.createElement('h3');subtitle.className='individual-title';subtitle.textContent=kind==='Anillos'?'Elige tu anillo':'Elige tu collar';section.append(subtitle);
  }
  const grid=document.createElement('div');grid.className='grid';grid.append(...matches.map(item=>item.card));section.append(grid);sections.push(section);
 }
 $('#products').replaceChildren(...sections);
 $('#results').textContent=shown.length?`${shown.length} diseños · Disponibilidad a confirmar por chat`:'No encontramos diseños con esa búsqueda.';persist();
}
function chosen(){return products.filter(p=>selected.has(p.id));}
function message(){return ['Hola, me interesan estas joyas Magold:',...chosen().map(p=>`• ${p.name} | Etiqueta ${p.tag} | Ref. ${p.id}${p.price===null?'':` | ${money(p.price)}`}`),'¿Me confirmas precio, disponibilidad y entrega?'].join('\n');}
function renderCart(){
 const items=chosen();$('#cart-items').replaceChildren(...items.map(p=>{const row=document.createElement('div');row.className='cart-row';const text=document.createElement('p');text.textContent=`${p.name} · Código ${p.tag} · ${money(p.price)}`;const remove=document.createElement('button');remove.textContent='Quitar';remove.setAttribute('aria-label',`Quitar ${p.name}`);remove.onclick=()=>{selected.delete(p.id);persist();render();renderCart();};row.append(text,remove);return row;}));
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
$('#photo').addEventListener('keydown',e=>{if(e.key==='ArrowLeft')movePhoto(-1);if(e.key==='ArrowRight')movePhoto(1);});
let touchStart=null;
$('#photo-stage').addEventListener('touchstart',e=>{touchStart={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};},{passive:true});
$('#photo-stage').addEventListener('touchend',e=>{if(!touchStart||!activeProduct)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))movePhoto(dx>0?-1:1);touchStart=null;},{passive:true});
$('#send').onclick=()=>{if(chosen().length&&/^[1-9]\d{7,14}$/.test(config.whatsapp))window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message())}`,'_blank','noopener,noreferrer');};
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(message());$('#feedback').textContent='Selección copiada.';}catch{$('#feedback').textContent=message();$('#feedback').style.whiteSpace='pre-wrap';}};
render();

