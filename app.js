const config=window.CATALOGO_CONFIG;
const products=window.PRODUCTS;
let selected=new Set();
try{const saved=JSON.parse(localStorage.getItem('joyas-selection')||'[]');if(Array.isArray(saved))selected=new Set(saved.filter(id=>products.some(p=>p.id===id)));}catch{}
let category='Todas';
const $=s=>document.querySelector(s);
const money=n=>`${n.toLocaleString('es-BO')} Bs`;
function persist(){try{localStorage.setItem('joyas-selection',JSON.stringify([...selected]));}catch{} $('#count').textContent=selected.size;}
function render(){
 const query=$('#search').value.trim().toLocaleLowerCase('es');
 const shown=products.filter(p=>(category==='Todas'||p.category===category)&&`${p.name} ${p.tag} ${p.id}`.toLocaleLowerCase('es').includes(query));
 $('#products').replaceChildren(...shown.map(p=>{
  const article=document.createElement('article');article.className='card';
  const image=document.createElement('button');image.className='image-button';image.setAttribute('aria-label',`Ver foto de ${p.name}`);
  const frame=document.createElement('div');frame.className='product-image';frame.style.backgroundImage=`url("${p.image}")`;frame.style.backgroundPosition=`${p.x}% ${p.y}%`;frame.style.backgroundSize=p.image.includes('193030')?'210% 500%':p.image.includes('193006')?'210% 400%':'110% 400%';
  image.append(frame);image.onclick=()=>{ $('#full-photo').src=p.image;$('#full-photo').alt=`Foto original del estuche: ${p.name}`;$('#photo-caption').textContent=`${p.name} · Etiqueta ${p.tag}. La foto original incluye otros diseños.`;$('#photo').showModal();};
  const heading=document.createElement('h3');heading.textContent=p.name;
  const meta=document.createElement('p');meta.className='meta';meta.textContent=`${p.category} · Etiqueta ${p.tag} · Ref. ${p.id}`;
  const price=document.createElement('p');price.className='price';price.textContent=p.price===null?'Consultar precio':money(p.price);
  const add=document.createElement('button');add.className=`add ${selected.has(p.id)?'selected':''}`;add.textContent=selected.has(p.id)?'✓ En tu selección':'＋ Agregar a mi selección';add.setAttribute('aria-pressed',selected.has(p.id));add.onclick=()=>{selected.has(p.id)?selected.delete(p.id):selected.add(p.id);persist();render();};
  article.append(image,heading,meta,price,add);return article;
 }));
 $('#results').textContent=shown.length?`${shown.length} diseños · Disponibilidad a confirmar por chat`:'No encontramos diseños con esa búsqueda.';persist();
}
function chosen(){return products.filter(p=>selected.has(p.id));}
function message(){return ['Hola, me interesan estas joyas Magold:',...chosen().map(p=>`• ${p.name} | Etiqueta ${p.tag} | Ref. ${p.id}${p.price===null?'':` | ${money(p.price)}`}`),'¿Me confirmas precio, disponibilidad y entrega?'].join('\n');}
function renderCart(){
 const items=chosen();$('#cart-items').replaceChildren(...items.map(p=>{const row=document.createElement('div');row.className='cart-row';const text=document.createElement('p');text.textContent=`${p.name} · Etiqueta ${p.tag}`;const remove=document.createElement('button');remove.textContent='Quitar';remove.setAttribute('aria-label',`Quitar ${p.name}`);remove.onclick=()=>{selected.delete(p.id);persist();render();renderCart();};row.append(text,remove);return row;}));
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
$('#send').onclick=()=>{if(chosen().length&&/^[1-9]\d{7,14}$/.test(config.whatsapp))window.open(`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message())}`,'_blank','noopener,noreferrer');};
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(message());$('#feedback').textContent='Selección copiada.';}catch{$('#feedback').textContent=message();$('#feedback').style.whiteSpace='pre-wrap';}};
render();
