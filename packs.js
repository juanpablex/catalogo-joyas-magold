(async()=>{
 const currentPack=1, fallback=[{id:1,nombre:"Pack 1",url:"https://juanpablex.github.io/catalogo-joyas-magold/?pack=1"}];
 let packs=fallback;
 try{const r=await fetch("https://juanpablex.github.io/catalogos/joyas-packs.json",{cache:"no-store"});if(r.ok){const data=await r.json();if(Array.isArray(data.packs)&&data.packs.length)packs=data.packs}}catch{}
 packs.sort((a,b)=>Number(b.id)-Number(a.id));
 const requested=new URL(location.href).searchParams.get("pack"),chosen=packs.find(p=>String(p.id)===requested)||packs[0];
 if(Number(chosen.id)!==currentPack){location.replace(chosen.url);return}
 const select=document.querySelector("#jewelry-pack-select");select.replaceChildren(...packs.map(p=>new Option(p.nombre,p.id)));select.value=String(currentPack);document.querySelector("#jewelry-pack-title").textContent=chosen.nombre+" · Joyas";
 select.onchange=()=>{const pack=packs.find(p=>String(p.id)===select.value);if(pack)location.href=pack.url};
})();
