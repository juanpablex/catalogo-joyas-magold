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
 ['357','Argollas con destellos claros',50,66],['259','Argollas con detalle azul',50,100]]],
 ['193147','Argollas',[
 ['312','Argollas con frente brillante',50,30],['315','Argollas geométricas',50,62],['406','Argollas alargadas',50,100]]],
 ['190043','Aretes',[
 ['196','Óvalos con detalle violeta',50,0],['160','Flores con centro claro',50,50],['182','Flores de destellos',50,100]]],
 ['190134','Aretes',[
 ['153','Círculos con triángulos',50,0],['125','Flores con centro brillante',50,33],['134','Círculos multicolor',50,66],['144','Flores caladas',50,100]]]
];
window.PRODUCTS = groups.flatMap(([photo,category,items]) => items.map(([tag,name,x,y],i)=>({
 id: `${category === 'Aretes' ? 'AR' : 'AG'}-${photo}-${i+1}`,
 tag,name,category,x,y,price:prices[category][tag],image:`assets/20261031_${photo}.jpg`
})));
