// Comprobación funcional del catálogo con un DOM mínimo.
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
class Element{
 constructor(){this.children=[];this.dataset={};this.style={setProperty(){}};this.classList={toggle(){}};this.value='';}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(k,v){this[k]=v}
 addEventListener(){}
 getBoundingClientRect(){return {height:640,width:480,left:0,top:0}}
 showModal(){this.open=true}
 close(){this.open=false}
}
const nodes=new Map();
const context={console,Map,Set,Math,Number,document:{
 querySelector(s){if(!nodes.has(s))nodes.set(s,new Element());return nodes.get(s)},
 querySelectorAll(){return []},createElement(){return new Element()},createElementNS(){return new Element()},documentElement:new Element()
},window:{CATALOGO_CONFIG:{whatsapp:'59178367871'},addEventListener(){}},localStorage:{getItem(){return '[]'},setItem(){}}};
vm.createContext(context);
for(const path of ['products.js','gallery-photos.js','app.js'])vm.runInContext(fs.readFileSync(path,'utf8'),context);
vm.runInContext(`
 if(products.length!==76)throw Error('Cambió el inventario');
 if(document.querySelector('#products').children.length!==6)throw Error('Faltan secciones');
 for(const [number,spots] of Object.entries(modelHotspots)){
  const scene=modelScene(modelPhoto(Number(number)),()=>{});
  if(scene.children.length!==spots.length+1)throw Error('Faltan zonas');
  spots.forEach((spot,index)=>{
   scene.children[index+1].onclick();
   if(activeProduct.id!==spot.id)throw Error('Ficha incorrecta');
   if(document.querySelector('#product-meta').textContent.indexOf(activeProduct.id)<0)throw Error('Falta referencia');
   if(document.querySelector('#product-price').textContent!==money(activeProduct.price))throw Error('Precio incorrecto');
   if(document.querySelector('#product-info').hidden)throw Error('Ficha oculta');
   returnToModel();
   if(!activeProduct.editorial||activeProduct.images[photoIndex].modelNumber!==Number(number))throw Error('No vuelve a la foto');
  });
 }
 const scene=modelScene(modelPhoto(41),()=>{});
 scene.children[1].onclick();
 document.querySelector('#product-add').onclick();
 if(!selected.has('AN-231644-4'))throw Error('No agrega a selección');
 if(!message().includes('AN-231644-4'))throw Error('Falta en WhatsApp');
 document.querySelector('#product-add').onclick();
 if(selected.has('AN-231644-4'))throw Error('No quita de selección');
 category='Anillos';render();
 if(document.querySelector('#products').children.length!==1)throw Error('Filtro incorrecto');
`,context);
assert.equal(nodes.get('#photo').open,true);
console.log('OK: zonas en las 15 fotos, fichas, precios, volver a modelo, selección, WhatsApp y filtro.');
