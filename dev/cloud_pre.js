/* ---------- account & cloud (runs before the game) ---------- */
const DB=String(window.TOKDAMA_DB||'').trim().replace(/\/+$/,'');
let USER=null;try{USER=localStorage.getItem('tokdama-user')}catch(e){}
const NS=USER?'u-'+USER:'guest';
const cleanId=s=>String(s||'').trim().toLowerCase().replace(/[.#$\[\]\/\s]/g,'').slice(0,12);
async function api(path,method,body){if(!DB)throw new Error('nodb');const r=await fetch(`${DB}/tokdama/${path}.json`,{method:method||'GET',headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);return r.json()}
