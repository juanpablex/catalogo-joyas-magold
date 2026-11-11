// Código de etiqueta y precio de venta en Bs según la hoja proporcionada.
const prices = {Aretes:{44:84,52:99,51:97,55:105,68:129,34:65,48:91,65:124,73:139,45:86,40:76,53:101,60:114,196:372,160:304,182:346,153:291,125:238,134:255,144:274},Argollas:{337:640,254:483,357:678,259:492,312:593,315:599,406:771}};
const groups = [
 ['193030','Aretes',[
 ['44','Flores de corazones',0,0],['52','Detalle rojo',100,0],
 ['52','Destellos claros',0,25],['51','Corazones texturados',100,25],
 ['55','Rombos con relieve',0,50],['44','Estrellas con detalle celeste',100,50],
 ['68','Cerezas',0,75],['34','Esferas',100,75],
 ['48','Corazones abiertos',0,100],['65','Estrellas texturadas',100,100]]],
 ['193006','Aretes',[
 ['73','Rama con detalle claro',0,0],['45','Estrellas lisas',100,0],
 ['40','Triángulos abiertos',0,33],['53','Mariposas verdes',100,33],
 ['53','Corazones con detalle rojo',0,66],['60','Flores con relieve',100,66],
 ['60','Ositos',0,100],['45','Flores verdes',100,100]]],
 ['193109','Argollas',[
 ['337','Argollas ovaladas',50,0],['254','Argollas redondas',50,33],
 ['357','Argollas de corazones',50,66],['259','Argollas con detalle azul',50,100]]],
 ['193147','Argollas',[
 ['312','Argollas con frente brillante',50,30],['315','Argollas geométricas',50,62],['406','Argollas alargadas',50,100]]],
 ['190043','Aretes',[
 ['196','Óvalos con detalle violeta',50,0],['160','Flores con centro claro',50,50],['182','Flores de destellos',50,100]]],
 ['190134','Aretes',[
 ['153','Círculos con triángulos',50,0],['125','Flores con centro brillante',50,33],['134','Círculos multicolor',50,66],['144','Flores caladas',50,100]]]
];
const existingProducts = groups.flatMap(([photo,category,items]) => items.map(([tag,name,x,y],i)=>({
 id: `${category === 'Aretes' ? 'AR' : 'AG'}-${photo}-${i+1}`,
 tag,name,category,x,y,price:prices[category][tag],image:`assets/20261031_${photo}.jpg`
})));

// Rectángulos de encuadre [izquierda, arriba, ancho, alto], entre 0 y 1.
// Se muestran las fotos originales: no se retoca la apariencia de las joyas.
const extraPrices = {
 'Aretes': {76:144,120:228,185:352,157:298,205:390,142:270,152:289},
 'Aretes grandes': {304:578,198:376,310:589,202:384,209:397,329:625,373:709,167:317},
 'Anillos': {136:258,270:513,271:515,254:483,198:376,230:437,215:409,340:646,166:315,265:504,134:255,203:386,259:492},
 'Cadenas': {484:920,803:1526,316:600,349:663,466:885},
 'Dijes': {164:312,60:114,180:342,79:150,226:429,106:201,129:245,115:219,154:293,66:125}
};
const additions = [
 ['190007','Aretes',[
  ['76','Corazones con destellos',[.32,0,.31,.20]],
  ['120','Corazones entrelazados',[.32,.22,.31,.20]],
  ['185','Abanicos geométricos',[.32,.43,.31,.22]],
  ['157','Gotas con borde brillante',[.33,.71,.29,.19]]]],
 ['185949','Aretes',[
  ['205','Óvalos con destellos',[.29,.02,.38,.25]],
  ['142','Abanicos calados',[.19,.28,.48,.31]],
  ['152','Diseño curvo con destellos',[.24,.66,.49,.24]]]],
 ['231535','Anillos',[
  ['215','Anillo ondulado',[.25,.08,.44,.13]],
  ['230','Anillo de tres destellos',[.27,.21,.38,.09]],
  ['198','Anillo con corazón',[.29,.35,.35,.10]],
  ['254','Anillo con flor brillante',[.28,.45,.36,.12]],
  ['271','Anillo circular brillante',[.29,.61,.36,.10]],
  ['270','Anillo con detalle central',[.30,.75,.35,.10]],
  ['136','Anillo de perlitas rojas',[.30,.87,.35,.12]]]],
 ['231644','Anillos',[
  ['340','Anillo abierto de gotas',[.30,.08,.26,.14]],
  ['166','Anillo de corazones calados',[.31,.30,.23,.08]],
  ['136','Anillo de tres detalles claros',[.31,.415,.23,.075]],
  ['265','Anillo de eslabones brillantes',[.30,.51,.25,.10]],
  ['134','Anillo de línea ondulada',[.31,.64,.23,.075]],
  ['203','Anillo de círculo abierto',[.31,.74,.23,.10]],
  ['259','Anillo con fila de destellos',[.29,.88,.26,.12]]]],
 ['231755','Cadenas', [['484','Cadena de eslabones finos',[.12,.22,.57,.56]]]],
 ['231811','Cadenas', [['803','Cadena de eslabones rectangulares',[.01,.29,.83,.49]]]],
 ['232125','Cadenas', [['316','Cadena con detalles esféricos',[.02,.22,.85,.65]]]],
 ['232111','Cadenas', [['349','Cadena de eslabones alargados',[0,.25,.78,.59]]]],
 ['232016','Cadenas', [['466','Cadena de eslabones compactos',[.04,.23,.81,.57]]]],
 ['203302','Dijes',[
  ['79','Dije de corazón con destellos',[.33,.18,.12,.085]],
  ['180','Dije de círculos entrelazados',[.28,.33,.20,.115]],
  ['106','Dije de dos corazones',[.60,.59,.12,.12]],
  ['226','Dije circular con mariposas',[.50,.82,.23,.16]]]],
 ['203355','Dijes',[
  ['164','Dije de crucifijo',[.33,.16,.28,.37]],
  ['60','Dije de figura infantil',[.18,.56,.14,.09]]]],
 ['203149','Dijes',[
  ['129','Dije de corazones con destellos',[.24,.18,.11,.13]],
  ['115','Dije geométrico con detalle claro',[.25,.39,.11,.11]],
  ['154','Dije circular de diseño curvo',[.47,.59,.12,.14]],
  ['66','Dije de corazones abiertos',[.33,.80,.13,.13]]]],
 ['202705','Aretes grandes',[
  ['310','Aretes de hojas con destellos',[.31,.06,.13,.19]],
  ['198','Aretes calados con destellos',[.29,.32,.16,.18]],
  ['304','Aretes de corazones y rombos',[.29,.78,.15,.18]]]],
 ['202728','Aretes grandes',[
  ['167','Aretes con detalle rojo',[.21,.25,.11,.16]],
  ['373','Aretes de gotas claras',[.10,.77,.24,.21]]]],
 ['202724','Aretes grandes',[
  ['329','Aretes de flores acanaladas',[.28,.02,.14,.19]],
  ['209','Aretes de gotas con brillo',[.31,.38,.15,.20]],
  ['202','Aretes de lazos brillantes',[.27,.69,.19,.22]]]]
];
const prefixes = {'Aretes':'AR','Aretes grandes':'GR','Anillos':'AN','Cadenas':'CA','Dijes':'DI'};
const newProducts = additions.flatMap(([photo,category,items]) => items.map(([tag,name,crop],i)=>({
 id:`${prefixes[category]}-${photo}-${i+1}`,tag,name,category,
 price:extraPrices[category][tag],image:`assets/20261031_${photo}.jpg`,crop,
 landscape:['231755','231811','232125','232111','232016'].includes(photo)
})));
const originalCrops = {
 '193030': [[.08,0,.28,.16],[.55,0,.26,.15],[.08,.20,.28,.17],[.53,.18,.29,.18],[.08,.39,.28,.17],[.54,.38,.28,.18],[.01,.58,.39,.17],[.55,.57,.28,.18],[.07,.78,.31,.17],[.54,.77,.29,.17]],
 '193006': [[.03,.02,.32,.21],[.57,.01,.33,.20],[.02,.27,.31,.19],[.58,.25,.33,.20],[.01,.50,.31,.20],[.59,.50,.33,.20],[.01,.75,.36,.20],[.60,.76,.33,.21]],
 '193109': [[.21,0,.65,.23],[.17,.18,.66,.28],[.35,.45,.24,.28],[.33,.71,.28,.28]],
 '193147': [[.31,.19,.25,.18],[.17,.28,.34,.28],[.28,.50,.24,.43]],
 '190043': [[.18,.01,.46,.29],[.19,.36,.47,.28],[.18,.71,.43,.28]],
 '190134': [[.39,.01,.34,.19],[.39,.24,.29,.20],[.40,.48,.26,.20],[.39,.72,.31,.20]]
};
existingProducts.forEach(p=>{const photo=p.image.match(/_(\d+)\.jpg$/)[1];const position=Number(p.id.split('-').at(-1))-1;p.crop=originalCrops[photo][position];});
// Tres posiciones por pieza; por ahora repiten la foto disponible.
window.PRODUCTS = [...existingProducts,...newProducts].map(p=>({...p,images:Array.from({length:3},()=>({src:p.image,crop:p.crop,landscape:p.landscape,thumbnail:`assets/web/${p.id}-thumb.webp`,detail:`assets/web/${p.id}-detail.webp`}))}));
// Solo estas dos piezas tienen una imagen mejorada como portada.
for(const product of window.PRODUCTS){
 if(!['AR-193030-1','AR-193030-3'].includes(product.id))continue;
 product.images.forEach(photo=>{photo.label='Foto original';});
 product.images.unshift({
  src:product.image,label:'Imagen mejorada con IA',
  thumbnail:`assets/web/${product.id}-enhanced-thumb.webp`,
  detail:`assets/web/${product.id}-enhanced-detail.webp`
 });
}


window.PRODUCTS.push({id:'AG-184',tag:'184',category:'Argollas',name:'Argollas ovaladas con destellos',price:350,images:[{src:'assets/web/mirror/AG-184-detail.webp',detail:'assets/web/mirror/AG-184-detail.webp',thumbnail:'assets/web/mirror/AG-184-thumb.webp',original:'assets/web/mirror/AG-184-detail.webp',label:'Foto de la pieza'}]});
