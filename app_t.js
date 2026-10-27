
/* ---------- account & cloud (runs before the game) ---------- */
const DB=String(window.TOKDAMA_DB||'').trim().replace(/\/+$/,'');
let USER=null;try{USER=localStorage.getItem('tokdama-user')}catch(e){}
const NS=USER?'u-'+USER:'guest';
const cleanId=s=>String(s||'').trim().toLowerCase().replace(/[.#$\[\]\/\s]/g,'').slice(0,12);
async function api(path,method,body){if(!DB)throw new Error('nodb');const r=await fetch(`${DB}/tokdama/${path}.json`,{method:method||'GET',headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw new Error('http '+r.status);return r.json()}

const APPVER='10.27-23시';
let SLOT=0;try{SLOT=Math.min(3,Math.max(0,+localStorage.getItem('tokdama-slot-'+NS)||0))}catch(e){}
const slotKey=i=>'tokdama-'+NS+'-s'+i;
const KEY=slotKey(SLOT);
const cv=document.getElementById('cv'),dctx=cv.getContext('2d'),buf=document.createElement('canvas');buf.width=72;buf.height=54;let ctx=buf.getContext('2d');
const $=id=>document.getElementById(id);
const KINDS={cat:['🐱','고양이'],rabbit:['🐰','토끼'],dog:['🐶','강아지'],bear:['🐻','곰돌이'],
  chick:['🐤','병아리'],owl:['🦉','부엉이'],penguin:['🐧','펭귄'],
  fish:['🐠','물고기'],octopus:['🐙','문어'],turtle:['🐢','거북이'],
  flamebean:['😈','뿔뿔이'],dropling:['💧','물방울링'],sprout:['🌱','새싹뭉치'],starfluff:['🌫️','먼지콩'],
  cloudsheep:['🐑','구름양'],candybear:['🍭','솜사탕곰'],macaroncat:['🍬','마카롱냥'],jellyfish:['🪼','젤리몽'],chestnut:['🌰','밤톨이'],unicorn:['🦄','무지개콩']};
const GROUPS=[['땅에 사는 친구',['rabbit','turtle']],['하늘을 나는 친구',['chick','owl']],['물속 친구',['fish','octopus']],['꼬마 몬스터',['flamebean','dropling','sprout','starfluff','chestnut']],['솜사탕 친구',['cloudsheep','candybear','macaroncat','jellyfish','unicorn']]];
const BIRD=['chick','owl','penguin'],NOFEET=['fish','octopus'];
const STATS=[['hunger','🍙','배부름'],['happy','😊','기분'],['clean','🫧','깨끗함'],['energy','⚡','힘'],['health','💚','건강'],['learn','🌟','배움']];
const HOW={
 hunger:{up:[['🍙','밥 (식단 짜기)','+3~5칸, 골고루 먹으면 건강도','feed'],['🍳','요리 교실','+4칸','cooking'],['🍭','간식','+1칸 (건강은 줄어요)','snack']],down:'시간이 지나면, 놀기·운동·산책을 하면 줄어요'},
 happy:{up:[['🎈','놀기 (6가지)','+1~3칸','playMenu'],['🍭','간식','+1~2칸','snack'],['👆','화면 속 펫 쓰다듬기','조금','']],down:'시간이 지나면, 아프면 더 빨리 줄어요'},
 clean:{up:[['🛁','목욕','가득','bath'],['🚿','샤워','+7칸','shower'],['🪥','양치','+½칸','brush']],down:'시간이 지나면, 응가가 있거나 놀고 운동하면 줄어요'},
 energy:{up:[['🌙','밤잠','자는 동안 가득','sleep'],['😴','낮잠','1분에 +4칸','sleep'],['🍙','밥','+½칸','feed']],down:'놀기·운동·산책·공부·요리를 하면 줄어요'},
 health:{up:[['🏥','병원 가기','가득 (30골드)','hospital'],['💊','약','+2~6칸','medicine'],['🏃','운동하기','+2칸','exercise'],['🧹','청소하기','+1칸','cleanRoom'],['🪥','양치','+½칸 (간식 뒤엔 꼭!)','brush'],['🍎','건강 간식','+½칸','snack'],['🌙','푹 자기','천천히','sleep']],down:'응가를 그냥 두거나, 굶거나, 더럽거나, 간식을 많이 먹거나, 양치를 안 하면 줄어요'},
 love:{up:[['👆','화면 속 펫 쓰다듬기','+½칸',''],['🚶','산책 가기','+1칸','walk'],['🎈','놀기','+½칸','playMenu']],down:'오래 안 놀아 주면 천천히 줄어요'},
 smart:{up:[['📚','공부하기 (4과목·3단계)','맞힌 문제마다 +½~1칸','study'],['🎈','맞히기 놀이','조금','playMenu']],down:'오래 공부 안 하면 아주 천천히 줄어요'},
 skill:{up:[['🍳','요리 교실','+2칸','cooking'],['🧹','청소하기','+1칸','cleanRoom']],down:'오래 안 하면 아주 천천히 줄어요'},
 water:{up:[['🥤','물 마시기','+4칸','drinkWater'],['🥛','우유·수박 간식','+2칸','snack'],['🍲','밥에 국 곁들이기','+1.5칸','feed']],down:'시간이 지나면, 운동하면 줄어요. 바닥나면 건강이 줄어요'},
 art:{up:[['🎨','그림 그리기','+2~5칸 (많이 칠할수록)','painting']],down:'오래 안 그리면 천천히 줄어요'},
 learn:{up:[['🎈','놀기 (6가지)','+1~2칸','playMenu'],['🏃','운동하기 (8가지)','+1.5칸','exercise'],['📚','공부하기 (4과목)','맞힌 만큼','study'],['🎨','취미 (요리·그림)','+2칸','hobby']],down:'놀거나 배우지 않으면 천천히 줄어요'},
 fit:{up:[['🏃','운동하기 (8가지)','+1~4칸 (많이 할수록)','exercise'],['🚶','산책 가기','+1칸','walk']],down:'오래 안 움직이면 천천히 줄어요'},
 friend:{up:[['🚶','산책 가기','+1.5칸 (친구를 만나요)','walk'],['🍳','요리 교실','+1칸 (친구들과 요리)','cooking'],['🎈','놀기','+½칸','playMenu']],down:'오래 밖에 안 나가면 천천히 줄어요'}};
const TIME={learn:'약 15분마다 1칸',water:'약 12분마다 1칸 (잘 때는 안 줄어요)',art:'약 40분마다 1칸',hunger:'약 6분마다 1칸 (잘 때는 12분)',happy:'약 9분마다 1칸 (아플 때는 더 빨리)',clean:'약 12분마다 1칸 (응가가 있으면 약 6분)',energy:'깨어 있으면 약 15분마다 1칸 (자면 1분에 2칸씩 차요)',
 health:'평소엔 안 줄고 오히려 20분에 1칸씩 차요 (자면 7분). 응가·굶기·더러움이 있으면 6~12분마다 1칸',love:'약 18분마다 1칸',smart:'약 40분마다 1칸',skill:'약 40분마다 1칸',fit:'약 30분마다 1칸',friend:'약 30분마다 1칸'};
function statInfo(k){const [,ic,n]=STATS.find(x=>x[0]===k),h=HOW[k];
  sheet(`${ic} ${n} 채우는 방법`,b=>{
    b.append(el('div','howcur',`지금 ${Math.ceil(st[k]/10)}칸 / 10칸`));
    h.up.forEach(([i2,an,amt,fn])=>{const r=el('div','howrow');r.append(el('span','howic',i2),Object.assign(el('span','howtx'),{innerHTML:`${an}<br><small>${amt}</small>`}));
      if(fn&&st.hatched&&!game){const go=mk('','하러 가기',()=>{closeSheet();window[fn]()},'go');if(st.asleep&&fn!=='sleep')go.disabled=true;r.append(go)}b.append(r)});
    b.append(el('div','howdn','줄어드는 때: '+h.down),el('div','howdn','⏰ '+TIME[k]));
    const r=el('div','row');r.append(mk('💖','골드로 +3칸 (🪙20)',()=>{if(heartBuy(k,false))statInfo(k)}),mk('💖',`골드로 가득 (🪙${Math.max(0,Math.ceil((100-st[k])/10))*7})`,()=>{if(heartBuy(k,true))statInfo(k)}));b.append(r)})}
function buildCare(){const c=$('careRows');c.innerHTML='';STATS.forEach(([k,ic,n])=>{const b=mk('',`${ic} ${n}`,()=>statInfo(k),'lb');b.title=`${n} 채우는 방법 보기`;c.append(b,Object.assign(el('span','hearts'),{id:'h-'+k}))})}
const ACTS=[['🏥','병원',()=>hospital()],['🚶','산책',()=>walk()],['🏃','운동',()=>exercise()],['📚','공부',()=>study()],['🧹','청소',()=>cleanRoom()],['🍳','요리',()=>cooking()]];
const ITEMS={
  ribbon:{n:'리본',ic:'🎀',p:30,slot:'head'},flower:{n:'꽃핀',ic:'🌼',p:30,slot:'head'},
  hat:{n:'모자',ic:'🎩',p:60,slot:'head'},crown:{n:'왕관',ic:'👑',p:120,slot:'head'},
  glasses:{n:'안경',ic:'👓',p:50,slot:'face'},
  grass:{n:'풀밭',ic:'🌱',p:40,slot:'bg'},sea:{n:'바다',ic:'🌊',p:60,slot:'bg'},
  sky:{n:'하늘',ic:'☁️',p:60,slot:'bg'},night:{n:'별밤',ic:'🌙',p:80,slot:'bg'},
  heartband:{n:'하트 머리띠',ic:'💗',p:80,slot:'head'},sunglasses:{n:'선글라스',ic:'🕶️',p:70,slot:'face'},
  bowtie:{n:'나비넥타이',ic:'🎗️',p:40,slot:'neck'},scarf:{n:'목도리',ic:'🧣',p:50,slot:'neck'},necklace:{n:'진주 목걸이',ic:'📿',p:90,slot:'neck'},
  blush:{n:'하트 볼터치',ic:'💗',p:40,slot:'makeup'},sparkle:{n:'반짝 눈화장',ic:'✨',p:50,slot:'makeup'},lips:{n:'앵두 립',ic:'💋',p:40,slot:'makeup'},
  wall_pink:{n:'분홍 벽지',ic:'🩷',p:40,slot:'wall'},wall_sky:{n:'하늘 벽지',ic:'🩵',p:40,slot:'wall'},wall_mint:{n:'민트 벽지',ic:'💚',p:40,slot:'wall'},wall_yellow:{n:'노랑 벽지',ic:'💛',p:40,slot:'wall'},
  floor_wood:{n:'나무 바닥',ic:'🪵',p:0,slot:'floor'},floor_carpet:{n:'보라 카펫',ic:'🟪',p:50,slot:'floor'},floor_tile:{n:'타일 바닥',ic:'⬜',p:40,slot:'floor'},
  g_rocker:{n:'흔들의자',ic:'🪑',p:60,slot:'deco',bg:'grass'},g_swing:{n:'그네',ic:'🎠',p:70,slot:'deco',bg:'grass'},g_flowers:{n:'꽃밭',ic:'🌷',p:40,slot:'deco',bg:'grass'},g_basket:{n:'소풍 바구니',ic:'🧺',p:40,slot:'deco',bg:'grass'},g_butterfly:{n:'나비',ic:'🦋',p:50,slot:'deco',bg:'grass'},
  s_coral:{n:'산호초',ic:'🪸',p:60,slot:'deco',bg:'sea'},s_parasol:{n:'파라솔',ic:'⛱️',p:60,slot:'deco',bg:'sea'},s_castle:{n:'모래성',ic:'🏰',p:50,slot:'deco',bg:'sea'},s_shell:{n:'진주 조개',ic:'🐚',p:40,slot:'deco',bg:'sea'},s_fish:{n:'물고기 떼',ic:'🐠',p:50,slot:'deco',bg:'sea'},
  k_rainbow:{n:'무지개',ic:'🌈',p:80,slot:'deco',bg:'sky'},k_balloon:{n:'열기구',ic:'🎈',p:70,slot:'deco',bg:'sky'},k_kite:{n:'연',ic:'🪁',p:40,slot:'deco',bg:'sky'},k_sofa:{n:'구름 소파',ic:'☁️',p:60,slot:'deco',bg:'sky'},k_birds:{n:'새 친구들',ic:'🐦',p:40,slot:'deco',bg:'sky'},
  n_tent:{n:'텐트',ic:'⛺',p:70,slot:'deco',bg:'night'},n_scope:{n:'망원경',ic:'🔭',p:70,slot:'deco',bg:'night'},n_fire:{n:'모닥불',ic:'🔥',p:50,slot:'deco',bg:'night'},n_fireflies:{n:'반딧불이',ic:'✨',p:50,slot:'deco',bg:'night'},n_lantern:{n:'등불',ic:'🏮',p:40,slot:'deco',bg:'night'},
  bed:{n:'침대',ic:'🛏️',p:80,slot:'furn'},plant:{n:'화분',ic:'🪴',p:40,slot:'furn'},lamp:{n:'스탠드',ic:'💡',p:50,slot:'furn'},teddy:{n:'곰 인형',ic:'🧸',p:60,slot:'furn'},shelf:{n:'책장',ic:'📚',p:70,slot:'furn'},rug:{n:'러그',ic:'🟣',p:40,slot:'furn'}};
const SLOTS={head:'머리',face:'얼굴',neck:'목',makeup:'화장',bg:'배경',wall:'벽지',floor:'바닥',furn:'가구',deco:'꾸미기 물건'};
const SHOPCAT=[['펫 꾸미기',['head','face','neck']],['배경',['bg']],['방 인테리어',['wall','floor','furn']]];
function fresh(){return{hatched:false,taps:0,name:'',kind:'',born:0,points:0,care:0,hunger:80,happy:80,clean:90,energy:90,poop:0,asleep:false,poopAt:0,
  gold:50,health:100,love:60,smart:30,skill:30,fit:50,friend:40,learn:50,water:70,art:30,cnt:{study:0,cook:0,ex:0,art:0,walk:0,wash:0},paused:false,own:[],wear:{head:null,face:null,neck:null,makeup:null,bg:null,wall:null,floor:null,furn:[]},snacks:0,snackT:0,sick:false,everSick:false,dirtyT:0,starveT:0,form:'',plays:0,pets:0,snacksTotal:0,gen:1,album:[],diary:[],found:[],shell:'coral',last:Date.now()}}
let saved=null;try{saved=JSON.parse(localStorage.getItem(KEY))}catch(e){}
let st=Object.assign(fresh(),saved&&typeof saved==='object'?saved:{});
if(st.autoPaused){st.paused=false;st.autoPaused=false;st.last=Date.now()}
if(saved&&saved.hatched&&saved.grow==null){const pt=saved.points||0;st.grow=(pt>=90?165:pt>=50?75:pt>=20?25:0)*60;st.points=0}
st.wear=Object.assign({head:null,face:null,neck:null,makeup:null,bg:null,wall:null,floor:null,furn:[]},st.wear);
if(saved&&saved.gold==null&&saved.stars!=null)st.gold=saved.stars*10;
if(saved&&saved.health==null&&saved.sick)st.health=25;
const FORMS={secret:['🌈','무지개 (시크릿)','안 아프고, 많이 놀고, 쓰다듬고, 하트를 골고루 채우면…?'],scholar:['🎓','박사','공부를 많이 하면'],chef:['👨‍🍳','요리사','요리 교실에 자주 가면'],athlete:['🏅','운동선수','운동을 많이 하면'],
 artist:['🎨','화가','그림을 많이 그리면'],social:['🌼','인기쟁이','친구랑 놀이를 많이 하면'],lovely:['💕','사랑둥이','많이 쓰다듬어 주면'],tidy:['🫧','깔끔쟁이','샤워·목욕을 자주 하면'],
 play:['⚡','장난꾸러기','놀이를 아주 많이 하면'],eat:['🍰','먹보','달콤한 간식을 많이 먹으면'],angel:['😇','천사','한 번도 안 아프고 골고루 잘 돌보면'],normal:['🙂','보통','특별히 한 게 없으면']};
function formThumb(form,dark){const c=document.createElement('canvas');c.width=216;c.height=162;c.className='thumb';const g=c.getContext('2d');
  g.fillStyle='#fff7ea';g.fillRect(0,0,216,162);try{vPet(g,{gender:st.gender,kind:st.kind,colorKind:st.colorKind,stage:4,form,wear:{},x:36,y:51,sc:3,mood:'happy',f:0})}catch(e){}
  if(dark){g.globalCompositeOperation='source-atop';g.fillStyle='#8f84a3';g.fillRect(0,0,216,162);g.globalCompositeOperation='source-over'}return c}
function chooseForm(){const c=Object.assign({study:0,cook:0,ex:0,art:0,walk:0,wash:0},st.cnt),all=STATS.reduce((a,[k])=>a+st[k],0)/STATS.length;
  if(!st.everSick&&st.plays>=8&&st.pets>=15&&all>=60)return 'secret';
  const cand=[['scholar',c.study/3],['chef',c.cook/3],['athlete',c.ex/3],['artist',c.art/3],['social',(c.play||0)/6],['lovely',st.pets/15],['tidy',c.wash/6],['play',st.plays/12],['eat',st.snacksTotal/8]].sort((a,b)=>b[1]-a[1]);
  if(cand[0][1]>=1)return cand[0][0];return(!st.everSick&&avg()>55)?'angel':'normal'}
const SHELLS={coral:['#ff8f7e','#ffc2b6','#e2604f','산호'],purple:['#b48cf0','#e2d0ff','#8a5fd4','보라'],blue:['#6fb4f2','#c9e5ff','#3f86cf','하늘'],mint:['#5fcfae','#c6f2e4','#2fa585','민트'],yellow:['#ffcc4d','#fff0b8','#e0a51c','노랑']};
function today(){const d=new Date();return `${d.getMonth()+1}/${d.getDate()}`}
function log(t){st.diary.push({d:today(),t});if(st.diary.length>80)st.diary.shift()}
function paintShell(){const c=SHELLS[st.shell]||SHELLS.coral,t=document.querySelector('.toy');t.style.setProperty('--shell',c[0]);t.style.setProperty('--shell-hi',c[1]);t.style.setProperty('--shell-lo',c[2])}
function save(){st.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}if(typeof cloudSoon==='function')cloudSoon()}
const clamp=v=>Math.max(0,Math.min(100,v));
const growMin=()=>(st.grow||0)/60+st.points*.3;
const GROW=[0,14,41,90];
const stage=()=>{if(!st.hatched)return 0;const g=growMin();return g<GROW[1]?1:g<GROW[2]?2:g<GROW[3]?3:4};
const STG=['알','아기','어린이','청소년','어른'];
let prev=Date.now(),fx=null,game=null,f=0,petX=36,petTo=36,lastPet=0,sayUntil=0,lastStage=stage();

function decay(dt){
  if(!st.hatched||!st.name||st.paused||st.ended)return;
  const now=Date.now();
  const D=dt*5/3;let hd2=0;
  if(st.asleep){st.energy+=dt/3.3;st.hunger-=D/120;st.clean-=D/240}
  else{st.hunger-=D/60;st.happy-=D/90*(st.sick?2:1);st.clean-=D/120+st.poop*D/90;st.energy-=D/150}
  if(st.poopAt&&now>=st.poopAt){st.poop=Math.min(3,st.poop+1);st.poopAt=0}
  let hd=0;
  if(st.poop>0)hd-=st.poop*D/120;
  if(st.clean<20)hd-=D/120;
  if(st.hunger<=0)hd-=D/60;
  if(st.energy<=0)hd-=D/90;
  if(st.sick)hd-=D/240;
  if(!hd&&st.hunger>50&&st.clean>50)hd=dt/(st.asleep?40:120);
  st.health+=hd;
  if(!st.asleep){st.learn-=D/150;st.water-=D/120;st.art-=D/400;st.love-=D/180;st.smart-=D/400;st.skill-=D/400;st.fit-=D/300;st.friend-=D/300}
  STATS.forEach(([k])=>st[k]=clamp(st[k]));
  st.snackT+=dt;while(st.snackT>=300){st.snackT-=300;st.snacks=Math.max(0,st.snacks-1)}
  if(!st.sick&&st.health<=30)getSick(st.poop?'응가를 오래 안 치워서':st.hunger<=0?'너무 배고파서':st.clean<20?'너무 더러워서':'몸이 약해져서');
  st.grow=(st.grow||0)+dt;if(stage()>lastStage)bump(0);
  st.care+=dt;while(st.care>=600){st.care-=600;if(avg()>50&&!st.sick){bump(1);st.gold+=5}}
  if(st.asleep&&st.napUntil){st.energy+=dt/1.7;if(now>=st.napUntil){st.asleep=false;st.napUntil=0;say('낮잠 잘 잤다! 개운해요',4000);render()}}
  if((st.teeth||0)>=4){hd2=D/240;st.health-=hd2}
  if(st.asleep&&st.energy>=100){st.asleep=false;say('푹 잤어요! 좋은 아침!',4000);render()}
}
function getSick(why){st.sick=true;st.everSick=true;st.health=Math.min(st.health,30);log(`${st.name}가 아팠어요 (${why})`);say(`${why} 아파요… 💊 약을 주세요`,6000);render()}
const avg=()=>(st.hunger+st.happy+st.clean+st.energy+st.health)/5;
const low=()=>Math.min(st.hunger,st.happy,st.clean,st.energy,st.health);

/* ---------- soft anime-style pets (vector) ---------- */
const VPAL={cat:{b:'#ffdcbc',l:'#fff3e6',d:'#f0a878',e:'#ffb3c7'},rabbit:{b:'#fbf7ff',l:'#ffffff',d:'#d6c6f0',e:'#ffc2d6'},dog:{b:'#f2d9bb',l:'#fff6ea',d:'#c4946a',e:'#ffb8c6'},
 bear:{b:'#e3b88f',l:'#f8e6cf',d:'#a97a4f',e:'#ffb3c0'},chick:{b:'#fff0a6',l:'#fffbe0',d:'#f6c93c',e:'#ffc0c8'},owl:{b:'#dcc5aa',l:'#f6ece0',d:'#a4835f',e:'#ffbcc8'},
 penguin:{b:'#aec1ea',l:'#ffffff',d:'#7d95d0',e:'#ffbdd0'},fish:{b:'#acdff3',l:'#eafaff',d:'#6cbfe0',e:'#ffc0d2'},octopus:{b:'#ffc6d6',l:'#ffeaf0',d:'#ff92b0',e:'#ff9fbf'},turtle:{b:'#c3e8b8',l:'#f1fbea',d:'#86c975',e:'#ffc0c8'},
 flamebean:{b:'#ff9fae',l:'#ffe2e7',d:'#e85a73',e:'#ff7f9a'},dropling:{b:'#a6dcff',l:'#e6f6ff',d:'#5bb4f0',e:'#ffb3c7'},sprout:{b:'#f2a77a',l:'#ffe1cc',d:'#c9693f',e:'#ffb3c0'},starfluff:{b:'#c4bdd4',l:'#e6e2ee',d:'#8a819f',e:'#ffb3d4'},
 cloudsheep:{b:'#f6f9ff',l:'#ffffff',d:'#c3d6f5',e:'#ffc2d6'},candybear:{b:'#ffc9df',l:'#fff0f6',d:'#9fd0ff',e:'#ff9ec0'},macaroncat:{b:'#bdeed6',l:'#fff8ec',d:'#7fd0ac',e:'#ffb3c0'},chestnut:{b:'#b9713f',l:'#f2ddb6',d:'#7a4322',e:'#ffb3a8'},unicorn:{b:'#fbf8ff',l:'#ffffff',d:'#d6c6f0',e:'#ffb8d2'},jellyfish:{b:'#e8d8ff',l:'#faf5ff',d:'#c4a8ff',e:'#ffb3d0'}};
const VL='#6e5866',VEYE='#3a2b45',VRAIN=['#ffb3b3','#ffd7a8','#fff1a8','#c4f0c4','#bfe0ff','#dccbff'];
function vPet(g,o){
  const k=VPAL[o.kind]?o.kind:'cat',P=Object.assign({},VPAL[VPAL[o.colorKind]?o.colorKind:k]),s=o.stage,form=s===4?(o.form||''):'',W=o.wear||{},t=o.t||0;
  const sec=form==='secret',ang=form==='angel',ply=form==='play',eat=form==='eat';
  if(sec){P.b='#f3ecff';P.l='#ffffff';P.d='#c4adf0'}
  const bird=k==='chick'||k==='owl'||k==='penguin',nofeet=k==='fish'||k==='octopus';
  g.save();g.translate(o.x*o.sc,o.y*o.sc);g.scale(o.sc,o.sc);g.lineJoin='round';g.lineCap='round';g.lineWidth=.75;
  const bob=o.bob?-.7:0;g.translate(0,bob);
  const path=(f)=>{g.beginPath();f();};
  const fillS=(c,stroke=true)=>{g.fillStyle=c;g.fill();if(stroke){g.strokeStyle=VL;g.stroke()}};
  const ell=(x,y,rx,ry,c,stroke=true,rot=0)=>{path(()=>g.ellipse(x,y,Math.max(.1,rx),Math.max(.1,ry),rot,0,Math.PI*2));fillS(c,stroke)};
  const soft=(x,y,rx,ry,c,band)=>{path(()=>g.ellipse(x,y,rx,ry,0,0,Math.PI*2));
    if(band){const gr=g.createLinearGradient(0,y-ry,0,y+ry);VRAIN.forEach((cc,i)=>gr.addColorStop(i/5,cc));g.fillStyle=gr}else g.fillStyle=c;g.fill();
    const h=g.createRadialGradient(x-rx*.35,y-ry*.45,0,x-rx*.2,y-ry*.2,Math.max(rx,ry)*1.05);h.addColorStop(0,'rgba(255,255,255,.75)');h.addColorStop(.45,'rgba(255,255,255,.12)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill();
    const sh=g.createLinearGradient(0,y+ry*.2,0,y+ry);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(120,80,110,.16)');g.fillStyle=sh;g.fill();g.strokeStyle=VL;g.stroke()};
  const heart=(x,y,r,c)=>{path(()=>{g.moveTo(x,y+r*.9);g.bezierCurveTo(x-r*1.6,y-r*.2,x-r*.7,y-r*1.4,x,y-r*.5);g.bezierCurveTo(x+r*.7,y-r*1.4,x+r*1.6,y-r*.2,x,y+r*.9)});g.fillStyle=c;g.fill()};
  const star=(x,y,r,c)=>{path(()=>{for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;g.lineTo(x+Math.cos(a)*rr,y+Math.sin(a)*rr)}g.closePath()});g.fillStyle=c;g.fill()};
  // geometry
  let hx=0,hy,hrx,hry,body=null,top,side,midY;
  const SPK=['chick','owl','penguin','fish','octopus','turtle','flamebean','dropling','sprout','starfluff','cloudsheep','candybear','macaroncat','jellyfish','chestnut','unicorn'].includes(k);
  if(!SPK){
  if(s===1){hrx=7;hry=6;hy=-6.3}else if(s===2){hrx=9;hry=8.2;hy=-8.9}
  else if(s===3){hrx=9.6;hry=8.6;hy=-14.2;body={rx:6.8,ry:5.6,cy:-5.4}}
  else{hrx=eat?12:11.4;hry=9.8;body={rx:eat?10.6:7.6,ry:eat?8.2:6.8,cy:eat?-7.8:-6.6};hy=body.cy-body.ry-hry+4.2}
  top=hy-hry;side=body?body.rx:hrx;midY=body?body.cy:hy+2;
  // wings
  if(ang){[-1,1].forEach(d=>{g.save();g.translate(d*(side+4.5),midY-4);g.scale(d,1);path(()=>{g.moveTo(-3,2);g.bezierCurveTo(-1,-6,6,-7,7,-2);g.bezierCurveTo(8,1,5,2,5,2);g.bezierCurveTo(6,4,3,6,0,4);g.closePath()});fillS('#ffffff');g.restore()})}
  // tails
  if(s>=3){const tx=hx+side,ty=midY+1;
    if(sec){VRAIN.forEach((c,i)=>{g.strokeStyle=c;g.lineWidth=1.4;path(()=>{g.moveTo(tx-1,ty+i*.8-2);g.quadraticCurveTo(tx+4,ty-4+i*.8,tx+6,ty-1+i*.8)});g.stroke()});g.lineWidth=.75}
    else if(k==='cat'){g.strokeStyle=VL;g.lineWidth=2.2;path(()=>{g.moveTo(tx-1,ty+2);g.quadraticCurveTo(tx+6,ty+1,tx+5,ty-5)});g.stroke();g.strokeStyle=P.b;g.lineWidth=1.3;g.stroke();g.lineWidth=.75}
    else if(k==='dog')ell(tx+1.2,ty-1+(o.f%2?-.6:0),2.4,1.5,P.b,true,-.6);
    else if(k==='rabbit'||k==='bear'||k==='turtle')ell(tx+.6,ty+1,2,2,k==='rabbit'?'#ffffff':P.b);
    else if(bird)ell(tx+1,ty,2.4,1.4,P.d,true,-.5);}
  if(k==='fish'){const tx=hx+side+.5,ty=midY;path(()=>{g.moveTo(tx-1,ty);g.quadraticCurveTo(tx+4,ty-6,tx+6,ty-3.5);g.quadraticCurveTo(tx+3,ty,tx+6,ty+3.5);g.quadraticCurveTo(tx+4,ty+6,tx-1,ty);g.closePath()});fillS(P.d)}
  // ears / top features
  const es=[0,.55,.8,1,1.1][s];
  if(k==='cat'&&s>=2)[-1,1].forEach(d=>{const bx=hx+d*hrx*.52,by=top+2.2;path(()=>{g.moveTo(bx-d*3.6*es,by+1);g.quadraticCurveTo(bx+d*.6,by-6.5*es,bx+d*3.4*es,by-.5)});fillS(P.b);path(()=>{g.moveTo(bx-d*1.9*es,by+.6);g.quadraticCurveTo(bx+d*.6,by-4*es,bx+d*1.9*es,by-.3)});g.fillStyle=P.e;g.fill()});
  if(k==='rabbit'&&s>=1)[-1,1].forEach(d=>{const ex=hx+d*hrx*.33,lh=[0,3.2,4.8,6.6,7.4][s];ell(ex+d*.4,top-lh+1.5,1.9+s*.25,lh,P.b,true,d*.12);ell(ex+d*.4,top-lh+2,1+s*.15,lh-1.8,P.e,false,d*.12)});
  if(k==='bear'&&s>=2)[-1,1].forEach(d=>{const r=1.6+s*.55;ell(hx+d*hrx*.66,top+r*.8,r,r,P.b);ell(hx+d*hrx*.66,top+r*.8,r*.55,r*.55,P.e,false)});
  if(k==='dog'&&s>=2)[-1,1].forEach(d=>{const bx=hx+d*hrx*.62,by=top+1.6;path(()=>{g.moveTo(bx-d*2.6*es,by+1);g.quadraticCurveTo(bx+d*1.5,by-4.8*es,bx+d*3.8*es,by+1.5*es)});fillS(P.d)});
  if(k==='owl'&&s>=2)[-1,1].forEach(d=>{const bx=hx+d*hrx*.6,by=top+1.8;path(()=>{g.moveTo(bx-d*2.4,by+1);g.lineTo(bx+d*1.2,by-4*es);g.lineTo(bx+d*2.6,by+.4)});fillS(P.d)});
  if(k==='fish'&&s>=2){path(()=>{g.moveTo(hx-4,top+1.5);g.quadraticCurveTo(hx,top-4.5,hx+4.5,top+1.5)});fillS(P.d)}
  // octopus tentacles / feet / body
  const tent=(y,n,r)=>{for(let i=0;i<n;i++){const q=i-(n-1)/2;ell(hx+q*r*2,y+(o.f%2&&i%2?.5:0),r,r*1.3,P.b)}};
  if(body){
    if(ply){ell(hx+side+1.6,midY-3.4,1.6,2.4,P.b,true,-.6);ell(hx+side+3.6,midY-7.4,2.6,2.6,'#ff8a9a');path(()=>{g.moveTo(hx+side+1.2,midY-7.4);g.lineTo(hx+side+6,midY-7.4)});g.strokeStyle='#fff';g.stroke()}
    if(k==='octopus')tent(-1.6,5,1.8);else if(!nofeet)[-1,1].forEach(d=>ell(hx+d*body.rx*.48,-1.2,2.6,1.6,bird?'#ffb36b':P.b));
    if(k==='turtle'&&!sec){soft(hx,body.cy,body.rx,body.ry,'#d9a46c');[[-3.4,-1],[0,-2.6],[3.4,-1],[-1.7,2],[1.7,2]].forEach(([a,b])=>ell(hx+a,body.cy+b,1.6,1.3,'#c0884f',false))}
    else{soft(hx,body.cy,body.rx,body.ry,P.b,sec);if(!sec)ell(hx,body.cy+1,body.rx*.6,body.ry*.6,P.l,false)}
    if(k==='penguin'&&!sec)ell(hx,body.cy+.6,body.rx*.68,body.ry*.78,'#ffffff',false);
    if(k!=='octopus'&&k!=='fish'){ell(hx-body.rx-.2,body.cy+.5,1.7,2.6,bird?P.d:P.b,true,.35);if(!ply)ell(hx+body.rx+.2,body.cy+.5,1.7,2.6,bird?P.d:P.b,true,-.35)}
    if(k==='fish')ell(hx-body.rx+.2,body.cy+1,2.2,1.3,P.d,true,.4);
    if(eat){ell(hx-2.8,body.cy+2.6,3.6,3,'#e8b07a');ell(hx-2.8,body.cy+2.2,3,2.2,'#ffaacb',false);ell(hx-2.8,body.cy+2.6,1.1,1,'#e8b07a',false);[[-4,1.2,'#7bd97b'],[-1.6,1.6,'#62b0ff'],[-3,3.6,'#ffe45c']].forEach(([a,b,c])=>ell(hx+a,body.cy+b,.35,.35,c,false))}
  }else{
    if(k==='octopus')tent(-1,s>=2?4:3,1.2+s*.25);else if(s>=2&&!nofeet)[-1,1].forEach(d=>ell(hx+d*hrx*.42,-1,1.8+s*.3,1.3,bird?'#ffb36b':P.b));
  }
  // head
  soft(hx,hy,hrx,hry,P.b,sec&&!body);
  if(k==='penguin'&&!sec)ell(hx,hy+1.4,hrx*.74,hry*.66,'#ffffff',false);
  if(k==='turtle'&&!sec&&!body){path(()=>g.ellipse(hx,top+hry*.42,hrx*.72,hry*.36,0,Math.PI,0));fillS('#d9a46c')}
  if(k==='octopus'&&!sec){ell(hx-hrx*.5,top+hry*.45,.9+s*.25,.9+s*.25,P.d,false);ell(hx+hrx*.42,top+hry*.3,.7+s*.2,.7+s*.2,P.d,false)}
  if(k==='fish'&&s>=3&&!sec){g.strokeStyle=P.d;g.lineWidth=1;[-.45,.1].forEach(q=>{path(()=>{g.moveTo(hx+hrx*q,top+1.5);g.quadraticCurveTo(hx+hrx*q+1,hy,hx+hrx*q,hy+hry-1.5)});g.stroke()});g.lineWidth=.75}
  if(k==='chick'){g.strokeStyle=VL;path(()=>{g.moveTo(hx-.5,top+.3);g.quadraticCurveTo(hx-2,top-3,hx+.4,top-3.4);g.moveTo(hx+.6,top+.3);g.quadraticCurveTo(hx+2.6,top-2,hx+2,top-3.2)});g.stroke()}
  if(s>=3&&!sec){g.strokeStyle=P.d;g.lineWidth=.9;
    if(k==='cat')[-1.6,0,1.6].forEach(q=>{path(()=>{g.moveTo(hx+q,top+.8);g.lineTo(hx+q,top+(q?2.3:3))});g.stroke()});
    if(k==='owl'&&body){path(()=>{g.moveTo(hx-2,body.cy-1.5);g.lineTo(hx,body.cy);g.lineTo(hx+2,body.cy-1.5)});g.stroke()}
    g.lineWidth=.75}
  }else{
  const SZ={chick:[[6.6,5.8],[8.4,7.6],[9.6,9],[10.8,10.6]],owl:[[6.8,6.2],[8.6,8],[10,9.8],[11.2,11.4]],penguin:[[6.2,6.4],[7.8,8.6],[8.8,10.4],[9.6,12.2]],
    fish:[[7.4,5.4],[9.6,6.8],[11,7.8],[12.4,8.8]],flamebean:[[6.6,6],[8.4,7.8],[9.6,9.2],[10.8,10.4]],dropling:[[6.2,6],[7.8,7.6],[9,8.8],[10,10]],sprout:[[6.8,5.8],[8.6,7.4],[9.8,8.8],[11,10]],starfluff:[[6.6,6],[8.4,7.8],[9.6,9],[10.8,10.2]],cloudsheep:[[7.4,5.8],[9.4,7.4],[10.8,8.6],[12,9.6]],candybear:[[6.8,6.2],[8.6,8],[9.8,9.2],[11,10.4]],macaroncat:[[7,6],[8.8,7.6],[10,8.8],[11.2,10]],jellyfish:[[6.6,5.6],[8.4,7],[9.6,8.2],[10.8,9.2]],chestnut:[[6.6,6],[8.4,7.8],[9.6,9],[10.8,10.4]],unicorn:[[6.8,6],[8.6,7.8],[9.8,9],[11,10.2]],octopus:[[6.6,5.6],[8.4,7.2],[9.6,8.4],[10.8,9.4]],turtle:[[7.6,4.6],[9.6,5.8],[11,6.6],[12.4,7.4]]}[k][s-1];
  let rx=SZ[0],ry=SZ[1];if(eat){rx*=1.12;ry*=1.05}
  const cy=k==='candybear'?-ry-2.4-s*.7:k==='fish'?-ry-4.5:(k==='octopus'||k==='jellyfish')?-ry-3.2-s*.4:k==='turtle'?-ry-1.6:-ry-1;
  side=rx;midY=cy;const FOOT='#ffb36b';
  if(ang){[-1,1].forEach(d=>{g.save();g.translate(d*(side+4.5),midY-4);g.scale(d,1);path(()=>{g.moveTo(-3,2);g.bezierCurveTo(-1,-6,6,-7,7,-2);g.bezierCurveTo(8,1,5,2,5,2);g.bezierCurveTo(6,4,3,6,0,4);g.closePath()});fillS('#ffffff');g.restore()})}
  if(sec&&s>=3){VRAIN.forEach((c,i)=>{g.strokeStyle=c;g.lineWidth=1.4;path(()=>{g.moveTo(rx-1,cy+i*.8-2);g.quadraticCurveTo(rx+4,cy-4+i*.8,rx+6,cy-1+i*.8)});g.stroke()});g.lineWidth=.75}
  if(k==='chick'){
    if(s>=3&&!sec)[[-.9,0],[-.3,-1.4],[.3,-2.6]].forEach(([r,d])=>ell(rx-.4,cy-ry*.1+d,1.2+s*.2,2.4+s*.3,P.d,true,r+1.2));
    if(s>=3)[[-1.7,0],[0,-.7],[1.7,0]].slice(0,s===4?3:2).forEach(([a,b])=>ell(a+(s===3?.85:0),cy-ry+b-.2,1.2+s*.1,1.5+s*.15,'#ff7a8a'));
    [-1,1].forEach(d=>ell(d*rx*.38,-.9,1.7+s*.2,1,FOOT));
    soft(0,cy,rx,ry,P.b,sec);if(!sec)ell(0,cy+ry*.38,rx*.6,ry*.42,P.l,false);
    [-1,1].forEach(d=>ell(d*(rx-.5),cy+ry*.18,1.4+s*.35,2.2+s*.5,sec?'#e6dcff':P.d,true,d*.5))}
  else if(k==='owl'){
    [-1,1].forEach(d=>{const bx=d*rx*.58,by=cy-ry+1.6;path(()=>{g.moveTo(bx-d*2.4,by+1);g.lineTo(bx+d*1.4,by-2.4-s*.6);g.lineTo(bx+d*2.8,by+.6)});fillS(P.d)});
    [-1,1].forEach(d=>{[-.8,0,.8].forEach(q=>ell(d*rx*.32+q,-.8,.6,.9,FOOT))});
    soft(0,cy,rx,ry,P.b,sec);if(!sec)ell(0,cy+ry*.4,rx*.6,ry*.45,P.l,false);
    [-1,1].forEach(d=>ell(d*(rx-.6),cy+ry*.2,1.6+s*.35,2.8+s*.6,sec?'#e6dcff':P.d,true,d*.25));
    if(s>=3&&!sec){g.strokeStyle=P.d;g.lineWidth=.7;[[-1.6,.25],[1.6,.25],[0,.42]].forEach(([a,b])=>{path(()=>{g.moveTo(a-.9,cy+ry*b);g.lineTo(a,cy+ry*b+.8);g.lineTo(a+.9,cy+ry*b)});g.stroke()});g.lineWidth=.75}}
  else if(k==='penguin'){
    [-1,1].forEach(d=>ell(d*(rx+.3),cy+ry*.12,1.3+s*.25,2.8+s*.7,P.d,true,d*.4));
    [-1,1].forEach(d=>ell(d*rx*.36,-.9,1.9+s*.2,1,FOOT));
    soft(0,cy,rx,ry,P.b,sec);
    if(!sec){ell(0,cy+ry*.3,rx*.66,ry*.6,'#ffffff',false);[-1,1].forEach(d=>ell(d*rx*.3,cy-ry*.16,rx*.42,ry*.33,'#ffffff',false))}
    if(s>=3)[-1,1].forEach(d=>ell(d*rx*.62,cy-ry*.28,.9,.6,'#ffe08a',false))}
  else if(k==='fish'){
    const tx=rx-.6;path(()=>{g.moveTo(tx-1,cy);g.quadraticCurveTo(tx+3+s*.6,cy-4-s*.7,tx+4.5+s*.8,cy-3-s*.4);g.quadraticCurveTo(tx+2+s*.4,cy,tx+4.5+s*.8,cy+3+s*.4);g.quadraticCurveTo(tx+3+s*.6,cy+4+s*.7,tx-1,cy);g.closePath()});fillS(sec?'#dccbff':P.d);
    if(s>=2){path(()=>{g.moveTo(-rx*.45,cy-ry+1);g.quadraticCurveTo(-rx*.1,cy-ry-2.6-s*.5,rx*.4,cy-ry+1.2)});fillS(sec?'#dccbff':P.d)}
    soft(0,cy,rx,ry,P.b,sec);if(!sec)ell(-rx*.1,cy+ry*.42,rx*.62,ry*.38,P.l,false);
    if(s>=3&&!sec){g.strokeStyle=P.d;g.lineWidth=1;[.15,.48].forEach(q=>{path(()=>{g.moveTo(rx*q,cy-ry*.86);g.quadraticCurveTo(rx*q+1.2,cy,rx*q,cy+ry*.86)});g.stroke()});g.lineWidth=.75}
    ell(rx*.18,cy+ry*.28,1.6+s*.25,1+s*.15,sec?'#dccbff':P.d,true,.5);
    if(s>=2){g.strokeStyle='#8fd0ff';g.lineWidth=.5;[[-rx-1.6,cy-ry-1,1],[-rx-.4,cy-ry-3.4,.7]].forEach(([a,b,r],i)=>{path(()=>g.arc(a,b-((o.f+i)%3)*.6,r,0,Math.PI*2));g.stroke()});g.lineWidth=.75}}
  else if(k==='octopus'){
    const n=[3,4,6,8][s-1],w=.9+s*.32;
    const T=[];for(let i=0;i<n;i++){const q=n===1?0:i/(n-1)-.5,x0=q*rx*1.25,x1=q*rx*2.05,cv=(i%2?1:-1)*(o.f%2?.5:-.5);T.push([x0,x1,q,cv])}
    const tc=sec?'#ead9ff':P.b,tp=([x0,x1,q,cv])=>{g.moveTo(x0,cy+ry*.55);g.quadraticCurveTo(x0+q*3+cv,-3,x1,-1.6)};
    g.strokeStyle=VL;g.lineWidth=w+1.2;T.forEach(t=>{path(()=>tp(t));g.stroke();path(()=>g.arc(t[1]+(t[2]>0?.5:-.5),-1.6,w*.62,0,Math.PI*2));g.fillStyle=VL;g.fill()});
    g.strokeStyle=tc;g.lineWidth=w;T.forEach(t=>{path(()=>tp(t));g.stroke();path(()=>g.arc(t[1]+(t[2]>0?.5:-.5),-1.6,w*.62-.55,0,Math.PI*2));g.fillStyle=tc;g.fill();if(s>=2){path(()=>g.arc(t[1]*.86,-2.8,.32,0,Math.PI*2));g.fillStyle=P.l;g.fill()}});
    g.lineWidth=.75;soft(0,cy,rx,ry,P.b,sec);
    if(!sec){ell(-rx*.55,cy-ry*.45,.8+s*.25,.8+s*.25,P.d,false);ell(rx*.45,cy-ry*.6,.6+s*.2,.6+s*.2,P.d,false);ell(rx*.62,cy-ry*.15,.5+s*.15,.5+s*.15,P.d,false)}}
  else if(k==='turtle'){
    const sx=rx*.2,base=-2.2,SH=sec?'#e6dcff':'#cf9658',SH2=sec?'#b99cf0':'#a26a36',RIM=sec?'#f6f0ff':'#f2dca6';
    ell(sx+rx*.62,-1.3,1.7+s*.28,1.3+s*.12,P.b);ell(sx-rx*.5,-1.3,1.8+s*.28,1.3+s*.12,P.b);
    if(s>=2){path(()=>{g.moveTo(sx+rx*.92,base-1.2);g.quadraticCurveTo(sx+rx*1.15+s*.3,base-.6,sx+rx*1.2+s*.4,base+.4);g.lineTo(sx+rx*.88,base+.4)});fillS(P.b)}
    path(()=>{g.moveTo(sx-rx,base);g.bezierCurveTo(sx-rx*.98,base-ry*2.15,sx+rx*.98,base-ry*2.15,sx+rx,base);g.closePath()});g.fillStyle=SH;g.fill();
    {const h=g.createRadialGradient(sx-rx*.35,base-ry*1.4,0,sx-rx*.2,base-ry,rx*1.1);h.addColorStop(0,'rgba(255,255,255,.55)');h.addColorStop(.5,'rgba(255,255,255,.08)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill()}
    g.strokeStyle=VL;g.stroke();
    const pc=(x,y,r)=>{path(()=>{for(let a=0;a<6;a++){const t=Math.PI/6+a*Math.PI/3;g.lineTo(x+Math.cos(t)*r,y+Math.sin(t)*r*.8)}g.closePath()});g.fillStyle=sec?'#f3ecff':'#e0aa6c';g.fill();g.strokeStyle=SH2;g.lineWidth=.6;g.stroke();g.lineWidth=.75};
    const pr=rx*(.2+s*.02);pc(sx,base-ry*1.05,pr);if(s>=2){pc(sx-pr*1.75,base-ry*.6,pr*.85);pc(sx+pr*1.75,base-ry*.6,pr*.85)}if(s>=3){pc(sx,base-ry*1.75,pr*.7)}
    path(()=>g.ellipse(sx,base,rx*1.02,1+s*.15,0,0,Math.PI*2));g.fillStyle=RIM;g.fill();g.strokeStyle=VL;g.stroke();
    hrx=3.6+s*1.05;hry=hrx*.92;hx=sx-rx-hrx*.2;hy=base-hry*.75-s*.25;
    ell(hx+hrx*.75,hy+hry*.55,hrx*.5,hry*.38,P.b);soft(hx,hy,hrx,hry,P.b);
    side=rx;midY=base-ry}
  else{
    const softP=(fn,c)=>{path(fn);g.fillStyle=c;g.fill();const h=g.createRadialGradient(-rx*.35,cy-ry*.45,0,-rx*.2,cy-ry*.2,Math.max(rx,ry)*1.05);h.addColorStop(0,'rgba(255,255,255,.7)');h.addColorStop(.45,'rgba(255,255,255,.1)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill();g.strokeStyle=VL;g.stroke()};
    const flame=(x,y,z)=>{const w=(o.f%2?.25:-.25)*z;path(()=>{g.moveTo(x-z,y);g.bezierCurveTo(x-z,y-z*1.2,x+w,y-z*1.4,x+w,y-z*2.2);g.bezierCurveTo(x+z*.5,y-z*1.3,x+z,y-z*.9,x+z,y);g.closePath()});g.fillStyle='#ff8a3d';g.fill();g.strokeStyle=VL;g.stroke();
      path(()=>{g.moveTo(x-z*.5,y);g.bezierCurveTo(x-z*.5,y-z*.8,x+w*.5,y-z,x+w*.5,y-z*1.4);g.bezierCurveTo(x+z*.3,y-z*.8,x+z*.5,y-z*.5,x+z*.5,y);g.closePath()});g.fillStyle='#ffd84d';g.fill()};
    const feet=c=>[-1,1].forEach(d=>ell(d*rx*.4,-.9,1.7+s*.22,1.05,c||P.d));
    if(k==='flamebean'){
      if(s>=2)[-1,1].forEach(d=>{g.save();g.translate(d*(rx-1),cy-ry*.25);g.scale(d,1);const w=2.4+s*.9;path(()=>{g.moveTo(0,0);g.lineTo(w*1.2,-w*.9);g.quadraticCurveTo(w*1.05,-w*.2,w*1.5,0);g.quadraticCurveTo(w*.95,.1,w*1.1,w*.55);g.quadraticCurveTo(w*.6,w*.3,0,w*.5);g.closePath()});fillS('#8f6ab8');g.restore()});
      g.strokeStyle=VL;g.lineWidth=.9;path(()=>{g.moveTo(rx*.6,cy+ry*.55);g.bezierCurveTo(rx+3,cy+ry*.9,rx+3.5,cy-ry*.1,rx+2+(o.f%2?.4:0),cy-ry*.45)});g.stroke();g.lineWidth=.75;
      heart(rx+2+(o.f%2?.4:0),cy-ry*.48,1.1+s*.15,P.d);
      feet(P.b);soft(0,cy,rx,ry,P.b,sec);if(!sec)ell(0,cy+ry*.42,rx*.56,ry*.4,P.l,false);
      if(s>=3)[-1,1].forEach(d=>ell(d*(rx-.3),cy+ry*.2,1.3,2,P.b,true,d*.4));
      [-1,1].forEach(d=>{const bx=d*rx*.42,by=cy-ry*.78,hh=1.4+s*.75;path(()=>{g.moveTo(bx-d*1.3,by+.6);g.quadraticCurveTo(bx-d*.2,by-hh*.6,bx+d*.9,by-hh);g.quadraticCurveTo(bx+d*.6,by-hh*.3,bx+d*1.2,by+.4);g.closePath()});fillS('#7a3b62')})}
    else if(k==='dropling'){
      [-1,1].forEach(d=>ell(d*(rx+.3),cy+ry*.3,1.2+s*.25,2+s*.4,P.d,true,d*.6));feet(P.d);
      softP(()=>{g.moveTo(0,cy-ry*1.45);g.bezierCurveTo(rx*.55,cy-ry*.9,rx*1.05,cy-ry*.1,rx,cy+ry*.35);g.bezierCurveTo(rx*.95,cy+ry*1.05,-rx*.95,cy+ry*1.05,-rx,cy+ry*.35);g.bezierCurveTo(-rx*1.05,cy-ry*.1,-rx*.55,cy-ry*.9,0,cy-ry*1.45);g.closePath()},P.b);
      if(!sec)ell(0,cy+ry*.48,rx*.55,ry*.36,P.l,false);
      if(s>=3){g.strokeStyle='#ffffff';g.lineWidth=.8;path(()=>{g.moveTo(-rx*.5,cy-ry*.35);g.quadraticCurveTo(-rx*.25,cy-ry*.6,0,cy-ry*.35);g.quadraticCurveTo(rx*.25,cy-ry*.1,rx*.5,cy-ry*.35)});g.stroke();g.lineWidth=.75}}
    else if(k==='sprout'){
      // little flower pot with a sprout that grows each stage
      feet(P.d);const rimY=cy-ry*.5,rimH=ry*.32,tw=rx*1.02,bw=rx*.72;
      softP(()=>{g.moveTo(-tw*.94,rimY+rimH);g.lineTo(tw*.94,rimY+rimH);g.quadraticCurveTo(bw*1.05,cy+ry*.6,bw,cy+ry*.95);g.quadraticCurveTo(0,cy+ry*1.08,-bw,cy+ry*.95);g.quadraticCurveTo(-bw*1.05,cy+ry*.6,-tw*.94,rimY+rimH);g.closePath()},P.b);
      path(()=>g.roundRect(-tw,rimY,tw*2,rimH,rimH*.45));fillS(P.d);
      ell(0,rimY+.5,tw*.8,rimH*.38,'#6b4a35',false);
      const st0=rimY,ht=[0,2,3.6,5.2,6.6][s];g.strokeStyle='#4f9a3a';g.lineWidth=.9;path(()=>{g.moveTo(0,st0);g.quadraticCurveTo(.8,st0-ht*.5,0,st0-ht)});g.stroke();g.lineWidth=.75;
      const lf=(x,y,d,z)=>ell(x+d*z*.9,y,z,z*.5,'#7fd16b',true,d*-.45);
      lf(0,st0-ht+.3,-1,1.1+s*.35);lf(0,st0-ht+.3,1,1.1+s*.35);
      if(s>=3){lf(0,st0-ht*.45,-1,1+s*.2);lf(0,st0-ht*.45,1,1+s*.2)}
      if(s===3)ell(0,st0-ht-.9,.9,1.3,'#ffb3c7');
      if(s===4){[0,1,2,3,4].forEach(i=>{const a=i*Math.PI*2/5-Math.PI/2;ell(Math.cos(a)*1.5,st0-ht-1.6+Math.sin(a)*1.5,1.15,1.15,'#ff9ec0')});ell(0,st0-ht-1.6,.8,.8,'#ffd84d',false)}
      if(s>=2&&!sec){g.fillStyle='#ffffff';[[-.45,.25],[.5,.45]].forEach(([a,b])=>{path(()=>g.arc(rx*a*.7,cy+ry*b,.45,0,Math.PI*2));g.fill()})}}
    else if(k==='starfluff'){
      [-1,1].forEach(d=>{g.strokeStyle=VL;g.lineWidth=.6;path(()=>{g.moveTo(d*rx*.3,cy+ry*.8);g.lineTo(d*rx*.38,-.4)});g.stroke();ell(d*rx*.4,-.5,.8,.45,VL,false)});g.lineWidth=.75;
      const fz=(r0,n,len,col,w)=>{g.strokeStyle=col;g.lineWidth=w;for(let i=0;i<n;i++){const a=i*Math.PI*2/n+((i*37)%7)*.03,jr=1+((i*53)%5)*.06,x0=Math.cos(a)*rx*r0,y0=cy+Math.sin(a)*ry*r0;path(()=>{g.moveTo(x0,y0);g.lineTo(Math.cos(a+((i%3)-1)*.08)*(rx*r0+len*jr),cy+Math.sin(a+((i%3)-1)*.08)*(ry*r0+len*jr))});g.stroke()}g.lineWidth=.75};
      fz(.8,46,2.2+s*.25,VL,1.1);fz(.8,46,1.8+s*.2,P.d,.8);
      path(()=>g.ellipse(0,cy,rx*.92,ry*.92,0,0,Math.PI*2));g.fillStyle=P.b;g.fill();{const h=g.createRadialGradient(-rx*.35,cy-ry*.45,0,-rx*.2,cy-ry*.2,rx);h.addColorStop(0,'rgba(255,255,255,.55)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill()}
      fz(.82,60,1.4+s*.15,P.b,.9);if(!sec)ell(0,cy+ry*.4,rx*.5,ry*.36,P.l,false);
      [[-rx-3,cy-ry*.6],[rx+3.2,cy-ry*.2],[-rx-1.6,cy+ry*.5],[rx+1.6,cy-ry-1],[0,cy-ry-2.4]].forEach(([x,y],i)=>{const q=(o.f+i)%3;ell(x+(q-1)*.4,y-q*.5,.45+(i%2)*.2,.45+(i%2)*.2,'#b5aec6',false)})}
    else if(k==='cloudsheep'){
      [-1,1].forEach(d=>{[.18,.42].forEach(q=>{path(()=>g.roundRect(d*rx*q-.8,cy+ry*.5,1.6,-cy-ry*.5-.4,.8));g.fillStyle='#7a6470';g.fill()});ell(d*rx*.42,-.6,1.1,.7,'#5c4a55',false);ell(d*rx*.18,-.6,1.1,.7,'#5c4a55',false)});
      const N=12;for(let i=0;i<N;i++){const a=i*Math.PI*2/N;ell(Math.cos(a)*rx*.78,cy+Math.sin(a)*ry*.74,rx*.3,ry*.3,P.b)}
      ell(0,cy,rx*.85,ry*.8,P.b,false);{path(()=>g.ellipse(0,cy,rx*.85,ry*.8,0,0,Math.PI*2));const h=g.createRadialGradient(-rx*.3,cy-ry*.4,0,-rx*.2,cy-ry*.2,rx);h.addColorStop(0,'rgba(255,255,255,.9)');h.addColorStop(1,'rgba(200,215,245,.25)');g.fillStyle=h;g.fill()}
      g.strokeStyle='#c9d6ee';g.lineWidth=.55;[[-.45,.35],[.5,.3],[-.2,.6],[.25,.62],[.6,-.1],[-.62,-.05]].forEach(([a,b])=>{path(()=>g.arc(rx*a,cy+ry*b,1.1+s*.2,Math.PI*.2,Math.PI*1.6));g.stroke()});g.lineWidth=.75;
      const fr=rx*.6,fy=cy+ry*.05;
      if(s>=3)[-1,1].forEach(d=>{g.strokeStyle='#d9b778';g.lineWidth=1.3;path(()=>g.arc(d*(fr*.78),fy-fr*.62,1.2+s*.22,0,Math.PI*1.7,d<0));g.stroke();g.lineWidth=.75});
      [-1,1].forEach(d=>{ell(d*(fr+1.2+s*.25),fy-fr*.05,1.6+s*.3,.85+s*.12,'#fff1e4',true,d*.3);ell(d*(fr+1.2+s*.25),fy-fr*.05,.9+s*.18,.42+s*.07,'#ffc2d6',false,d*.3)});
      soft(0,fy,fr,fr*.92,'#fff1e4');
      [-1.4,0,1.4].forEach((q,i)=>ell(q,fy-fr*.88-(i===1?.5:0),1.3+s*.15,1.1+s*.1,P.b));
      hx=0;hy=fy;hrx=fr;hry=fr*.92}
    else if(k==='candybear'){
      // cotton-candy bear on a stick: fluffy pink/blue puffs
      g.strokeStyle=VL;g.lineWidth=1.6;path(()=>{g.moveTo(0,cy+ry*.8);g.lineTo(0,-.4)});g.stroke();g.strokeStyle='#f6e2c2';g.lineWidth=.9;g.stroke();g.lineWidth=.75;
      if(s>=2)[-1,1].forEach(d=>{const ex=d*rx*.62,ey2=cy-ry*.8,r=1.6+s*.45;ell(ex,ey2,r,r,d<0?P.b:P.d);ell(ex,ey2,r*.5,r*.5,P.e,false)});
      const N=14;for(let i=0;i<N;i++){const a=i*Math.PI*2/N;ell(Math.cos(a)*rx*.8,cy+Math.sin(a)*ry*.78,rx*.3,ry*.3,i%2?P.d:P.b)}
      path(()=>g.ellipse(0,cy,rx*.86,ry*.84,0,0,Math.PI*2));{const gr=g.createLinearGradient(-rx,cy-ry,rx,cy+ry);gr.addColorStop(0,'#ffd6e7');gr.addColorStop(.55,'#fff0f6');gr.addColorStop(1,'#d7ecff');g.fillStyle=gr;g.fill()}
      g.strokeStyle='rgba(255,140,180,.45)';g.lineWidth=.6;[[-.5,-.5],[.45,-.55],[-.6,.45],[.55,.5]].forEach(([a,b])=>{path(()=>g.arc(rx*a,cy+ry*b,1+s*.2,0,Math.PI*1.4));g.stroke()});g.lineWidth=.75;
      if(s>=3)[[-rx-1.6,cy-ry*.7],[rx+1.4,cy-ry*.9],[rx+2,cy+ry*.2]].forEach(([x,y],i)=>star(x,y-((o.f+i)%2)*.4,.9+s*.15,i%2?'#9fd0ff':'#ff9ec0'));
      if(s===4){const bx=0,by=cy+ry*.82;[-1,1].forEach(d=>{path(()=>{g.moveTo(bx,by);g.lineTo(bx+d*2.4,by-1.3);g.lineTo(bx+d*2.4,by+1.3);g.closePath()});fillS('#ff9ec0')});ell(bx,by,.7,.7,'#ff7fae')}}
    else if(k==='macaroncat'){
      // macaron body: dome shell, ruffled feet, cream filling, bottom shell + cat ears
      const sh2=sec?'#e6dcff':P.b,ft=sec?'#d6c6f0':P.d;
      if(s>=3){g.strokeStyle=VL;g.lineWidth=2;path(()=>{g.moveTo(rx-.6,cy+ry*.6);g.quadraticCurveTo(rx+4,cy+ry*.7,rx+3,cy-ry*.1)});g.stroke();g.strokeStyle=sh2;g.lineWidth=1.2;g.stroke();g.lineWidth=.75}
      if(s>=2)[-1,1].forEach(d=>{const bx=d*rx*.5,by=cy-ry*.72;path(()=>{g.moveTo(bx-d*2.6,by+1.4);g.quadraticCurveTo(bx+d*.5,by-4-s*.6,bx+d*2.8,by+.2)});fillS(sh2);path(()=>{g.moveTo(bx-d*1.3,by+.8);g.quadraticCurveTo(bx+d*.5,by-2.3-s*.4,bx+d*1.4,by+.3)});g.fillStyle=P.e;g.fill()});
      feet(ft);
      const bt=cy+ry*.55,bb=cy+ry;path(()=>{g.moveTo(-rx*.96,bt);g.quadraticCurveTo(-rx*.98,bb,0,bb);g.quadraticCurveTo(rx*.98,bb,rx*.96,bt);g.closePath()});fillS(sh2);
      const ruf=(y,w)=>{path(()=>{const n=12;g.moveTo(-w,y);for(let i=0;i<=n;i++){const x=-w+i*2*w/n;g.lineTo(x,y+(i%2?.8:0))}g.lineTo(w,y-.7);g.lineTo(-w,y-.7);g.closePath()});g.fillStyle=ft;g.fill();g.strokeStyle=VL;g.lineWidth=.4;g.stroke();g.lineWidth=.75};
      ruf(bt+.2,rx*.97);
      path(()=>{g.moveTo(-rx*1.02,cy+ry*.25);for(let i=0;i<=8;i++){g.quadraticCurveTo(-rx*1.02+(i-.5)*rx*.255,cy+ry*(i%2?.62:.5),-rx*1.02+i*rx*.255,cy+ry*.55)}g.lineTo(rx*1.02,cy+ry*.25);g.closePath()});fillS(sec?'#ffffff':P.l);
      const tb=cy+ry*.28;softP(()=>{g.moveTo(-rx,tb);g.bezierCurveTo(-rx*1.02,cy-ry*1.05,rx*1.02,cy-ry*1.05,rx,tb);g.closePath()},sh2);
      ruf(tb+.6,rx*1.0);
      if(!sec&&s>=2)[[-.5,-.55,'#ff9ec0'],[.15,-.75,'#ffe27a'],[.55,-.4,'#9fd0ff'],[-.15,-.62,'#ffffff']].slice(0,s).forEach(([a,b,c])=>ell(rx*a,cy+ry*b,.55,.3,c,false,a*1.5));
      if(s===4)heart(rx*.62,cy-ry*.92,1.3,'#ff7f9a')}
    else if(k==='chestnut'){
      // glossy chestnut: pointed top + tuft, pale rough base; baby sits in a green burr
      const burr=(full)=>{const R=rx*1.12,col='#8fcf68',cy0=full?cy+ry*.15:cy+ry*.62,ry0=full?ry*1.05:ry*.55;g.strokeStyle='#5d9e45';g.lineWidth=.8;
        const n=full?34:18,a0=full?0:0,a1=full?Math.PI*2:Math.PI;for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n;path(()=>{g.moveTo(Math.cos(a)*R*.9,cy0+Math.sin(a)*ry0*.9);g.lineTo(Math.cos(a)*(R+1.6),cy0+Math.sin(a)*(ry0+1.6))});g.stroke()}g.lineWidth=.75;
        path(()=>full?g.ellipse(0,cy0,R,ry0,0,0,Math.PI*2):g.ellipse(0,cy0,R,ry0,0,0,Math.PI));fillS(col)};
      if(s===1)burr(true);else feet(P.d);
      const body=()=>{g.moveTo(0,cy-ry*1.3);g.bezierCurveTo(rx*.55,cy-ry*1.0,rx*1.08,cy-ry*.25,rx,cy+ry*.4);g.bezierCurveTo(rx*.9,cy+ry*1.02,-rx*.9,cy+ry*1.02,-rx,cy+ry*.4);g.bezierCurveTo(-rx*1.08,cy-ry*.25,-rx*.55,cy-ry*1.0,0,cy-ry*1.3);g.closePath()};
      path(body);g.fillStyle=sec?'#e6dcff':P.b;g.fill();
      if(!sec){g.save();path(body);g.clip();ell(0,cy+ry*1.0,rx*1.15,ry*.52,P.l,false);g.fillStyle='#d9bf92';for(let i=0;i<14;i++){path(()=>g.arc(((i*37)%17/17-.5)*rx*1.5,cy+ry*(.62+((i*13)%7)*.045),.28,0,Math.PI*2));g.fill()}g.restore()}
      {path(body);const h=g.createRadialGradient(-rx*.4,cy-ry*.5,0,-rx*.25,cy-ry*.3,rx*.9);h.addColorStop(0,'rgba(255,255,255,.85)');h.addColorStop(.25,'rgba(255,255,255,.25)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill();g.strokeStyle=VL;g.stroke()}
      g.strokeStyle='#f3e6cc';g.lineWidth=.5;[-1,0,1].forEach(q=>{path(()=>{g.moveTo(0,cy-ry*1.28);g.lineTo(q*.8,cy-ry*1.28-1.2-s*.15)});g.stroke()});g.lineWidth=.75;
      if(s===2)burr(false);
      if(s>=3){ell(-rx*.55,cy-ry*1.0,1.3,.65,'#7fd16b',true,.5)}
      if(s===4){ell(rx*.45,cy-ry*1.08,1.5,.7,'#7fd16b',true,-.5);[[-rx-1.5,cy],[rx+1.5,cy-ry*.4]].forEach(([x,y],i)=>star(x,y-((o.f+i)%2)*.3,.8,'#ffe27a'))}}
    else if(k==='unicorn'){
      if(s>=3)VRAIN.forEach((c,i)=>ell(rx+.6+(i%3)*.9,cy+ry*.1+i*.6,1+s*.12,.9,c,false));
      feet('#d6c6f0');
      [-1,1].forEach(d=>{const bx=d*rx*.52,by=cy-ry*.75;path(()=>{g.moveTo(bx-d*1.6,by+.8);g.quadraticCurveTo(bx+d*.3,by-2.6-s*.5,bx+d*1.6,by+.2)});fillS(P.b);path(()=>{g.moveTo(bx-d*.8,by+.4);g.quadraticCurveTo(bx+d*.3,by-1.6-s*.35,bx+d*.8,by+.1)});g.fillStyle='#ffc2d6';g.fill()});
      soft(0,cy,rx,ry,P.b,sec);if(!sec)ell(0,cy+ry*.42,rx*.55,ry*.38,'#fff6fb',false);
      const nm=1+s;for(let i=0;i<nm+1;i++){const a=-Math.PI*.95+i*(Math.PI*.55/nm);ell(Math.cos(a)*rx*.86,cy+Math.sin(a)*ry*.86,1.2+s*.28,1.1+s*.25,VRAIN[i%6])}
      const hh=1+s*1.3,hb=.6+s*.25,ty=cy-ry*.86;path(()=>{g.moveTo(-hb,ty);g.lineTo(.3,ty-hh);g.lineTo(hb,ty);g.closePath()});fillS('#ffe27a');
      g.strokeStyle='#e8b830';g.lineWidth=.4;for(let i=1;i<=Math.min(3,s);i++){const yy=ty-hh*i/(Math.min(3,s)+1);path(()=>{g.moveTo(-hb*(1-i/(s+1)),yy+.3);g.lineTo(hb*(1-i/(s+1)),yy-.3)});g.stroke()}g.lineWidth=.75}
    else if(k==='jellyfish'){
      const n=[3,4,5,6][s-1];for(let i=0;i<n;i++){const x=(i/(n-1)-.5)*rx*1.4;g.strokeStyle=i%2?P.d:'#ffc2e0';g.lineWidth=1+s*.15;path(()=>{g.moveTo(x,cy+ry*.4);for(let j=1;j<=4;j++)g.lineTo(x+((j+o.f+i)%2?.9:-.9),cy+ry*.4+j*(1.2+s*.4))});g.stroke()}g.lineWidth=.75;
      path(()=>{g.moveTo(-rx,cy+ry*.45);g.bezierCurveTo(-rx,cy-ry*1.3,rx,cy-ry*1.3,rx,cy+ry*.45);for(let i=6;i>=0;i--)g.lineTo(-rx+i*rx/3,cy+ry*.45+(i%2?.9:0));g.closePath()});
      g.globalAlpha=.92;g.fillStyle=P.b;g.fill();g.globalAlpha=1;{const h=g.createRadialGradient(-rx*.35,cy-ry*.45,0,-rx*.2,cy-ry*.2,rx);h.addColorStop(0,'rgba(255,255,255,.75)');h.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=h;g.fill()}g.strokeStyle=VL;g.stroke();
      [[-.5,-.5],[.45,-.7],[.1,-.85]].forEach(([a,b])=>ell(rx*a,cy+ry*b,.5,.5,'#ffffff',false));if(s>=3&&(o.f%2))star(rx+2,cy-ry,1,'#ffe45c')}
  }
  if(!['turtle','cloudsheep'].includes(k)){hx=0;hy=k==='dropling'?cy+ry*.12:k==='jellyfish'?cy-ry*.3:k==='macaroncat'?cy-ry*.38:k==='sprout'?cy+ry*.3:k==='chestnut'?cy+ry*.05:cy;hrx=k==='sprout'?rx*.8:rx;hry=k==='jellyfish'?ry*.8:k==='macaroncat'?ry*.62:k==='sprout'?ry*.7:ry}
  top=hy-hry;
  if(ply){ell(side+1.4,midY-1.6,1.4,2,P.b,true,-.6);ell(side+3.2,midY-5.2,2.4,2.4,'#ff8a9a');path(()=>{g.moveTo(side+1,midY-5.2);g.lineTo(side+5.4,midY-5.2)});g.strokeStyle='#fff';g.stroke()}
  if(eat){const dy=midY+ry*.3;ell(-2.6,dy,3.2,2.7,'#e8b07a');ell(-2.6,dy-.4,2.7,2,'#ffaacb',false);ell(-2.6,dy,1,.9,'#e8b07a',false)}
  }
  // face
  const fxc=hx+(k==='fish'?-hrx*.24:0),ex=hrx*(k==='fish'?.3:.38),ey=hy+(s===1?.8:hry*.15)+.2,dir=o.dir||0;
  const eh=[0,2.05,2.6,2.9,3.1][s],ew=eh*.75;
  const Lx=fxc-ex+dir,Rx=fxc+ex+dir;
  if(k==='owl'&&s>=2&&!sec)[Lx,Rx].forEach(x=>ell(x,ey,ew*1.9,eh*1.45,P.l,false));
  if(k==='dog'&&s>=3&&!sec)ell(Rx+.3,ey,ew*2,eh*1.5,'rgba(196,148,106,.55)',false);
  let ek='open';if(o.asleep)ek='closed';else if(o.sick)ek='sick';else if(ang||o.mood==='happy')ek='happy';else if(sec)ek='star';
  const blink=o.f%14===0&&ek==='open';
  const eye=(x,kind)=>{g.strokeStyle=VEYE;g.lineWidth=.85;
    if(kind==='closed'||blink){path(()=>{g.moveTo(x-ew,ey);g.quadraticCurveTo(x,ey+ew*.9,x+ew,ey)});g.stroke();return}
    if(kind==='happy'){path(()=>{g.moveTo(x-ew,ey+.4);g.quadraticCurveTo(x,ey-eh*.9,x+ew,ey+.4)});g.stroke();return}
    if(kind==='sick'){path(()=>{g.moveTo(x-ew*.8,ey-ew*.8);g.lineTo(x+ew*.8,ey+ew*.8);g.moveTo(x+ew*.8,ey-ew*.8);g.lineTo(x-ew*.8,ey+ew*.8)});g.stroke();return}
    ell(x,ey,ew,eh,VEYE,false);const gr=g.createLinearGradient(0,ey,0,ey+eh);gr.addColorStop(0,'rgba(140,110,200,0)');gr.addColorStop(1,'rgba(160,130,230,.55)');ell(x,ey+eh*.25,ew*.85,eh*.7,gr,false);
    if(kind==='star')star(x-ew*.25,ey-eh*.35,ew*.75,'#ffe45c');else ell(x-ew*.3,ey-eh*.38,ew*.42,ew*.42,'#ffffff',false);ell(x+ew*.35,ey+eh*.35,ew*.2,ew*.2,'#ffffff',false)};
  const awake=!o.asleep&&!o.sick,wor=awake&&o.mood==='worry',cry=awake&&o.mood==='cry';
  if(cry){g.strokeStyle=VEYE;g.lineWidth=.9;[[Lx,1],[Rx,-1]].forEach(([x,d])=>{path(()=>{g.moveTo(x-ew,ey-eh*.35);g.quadraticCurveTo(x,ey+eh*.25,x+ew,ey-eh*.35)});g.stroke()});
    [Lx,Rx].forEach((x,i)=>{const t=(o.f+i)%2;path(()=>{g.moveTo(x-ew*.6,ey+.2);g.quadraticCurveTo(x-ew*.9,ey+eh*1.2,x-ew*.5,ey+eh*1.7+t*.6);g.quadraticCurveTo(x-ew*.1,ey+eh*1.2,x-ew*.3,ey+.2);g.closePath()});g.fillStyle='rgba(120,190,255,.85)';g.fill()})}
  else{eye(Lx,wor&&ek==='happy'?'open':ek);eye(Rx,(ply&&ek==='open')?'happy':wor&&ek==='happy'?'open':ek)}
  if(wor||cry){g.strokeStyle=VL;g.lineWidth=.7;[[Lx,1],[Rx,-1]].forEach(([x,d])=>{path(()=>{g.moveTo(x-d*ew*1.1,ey-eh-.5);g.lineTo(x+d*ew*.6,ey-eh-1.6)});g.stroke()});g.lineWidth=.75}
  if(wor){const sx=Rx+ew+1.6,sy=ey-eh-1+(o.f%2)*.4;path(()=>{g.moveTo(sx,sy-1.4);g.quadraticCurveTo(sx+1,sy,sx,sy+.5);g.quadraticCurveTo(sx-1,sy,sx,sy-1.4)});g.fillStyle='#9fd6ff';g.fill();g.strokeStyle='#5aa9e6';g.lineWidth=.3;g.stroke();g.lineWidth=.75}
  if(o.mood==='sad'&&awake)ell(Lx-ew*.6,ey+eh+1+(o.f%2)*.6,.5,.8,'#8fc8ff',false);
  const cy2=ey+eh+.6,ck=sec?['#ffb3b3','#bfe0ff']:[P.e,P.e];
  [[Lx-ew-1.1,0],[Rx+ew+1.1,1]].forEach(([x,i])=>{g.globalAlpha=.75;ell(x,cy2,1.5+s*.3,.9+s*.12,ck[i],false);g.globalAlpha=1});
  if(eat)[[Lx-ew-1.1],[Rx+ew+1.1]].forEach(([x])=>{g.globalAlpha=.6;ell(x,cy2,2.2,1.2,'#ff8fa8',false);g.globalAlpha=1});
  if(ply){g.save();g.translate(Lx-ew-1.6,cy2-.6);g.rotate(-.4);g.fillStyle='#f6d9ae';g.fillRect(-1.6,-.6,3.2,1.2);g.restore()}
  // muzzle & mouth
  const my=ey+eh+.4,mx=fxc+dir;
  if((k==='bear'||k==='dog')&&!sec&&s>=2){ell(mx,my+.6,2+s*.35,1.4+s*.2,P.l,false);ell(mx,my-.3,.7,.5,VL,false)}
  g.strokeStyle=VL;g.lineWidth=.7;
  if(bird){const bw=1+s*.2;path(()=>{g.moveTo(mx-bw,my-.5);g.lineTo(mx+bw,my-.5);g.lineTo(mx,my+(o.eating?1.8:.8+s*.25));g.closePath()});g.fillStyle='#ffa94d';g.fill();g.stroke();if(k==='chick'&&s===4)ell(mx,my+2.1,.7,.9,'#ff7a8a')}
  else if(s===1&&!o.eating&&!o.asleep&&o.mood!=='cry'){ell(mx,my+.6,1.2,.9,o.gender==='boy'?'#a9d4ff':'#ffc2d6');ell(mx,my+.6,.45,.35,'#ffffff',false)}
  else if(o.eating){ell(mx,my+.8,1,.9,'#c0566f')}
  else if(o.asleep){path(()=>{g.moveTo(mx-.6,my+.5);g.lineTo(mx+.6,my+.5)});g.stroke()}
  else if(o.mood==='cry'){path(()=>g.ellipse(mx,my+1,1.3,1.1+(o.f%2)*.25,0,0,Math.PI*2));g.fillStyle='#c0566f';g.fill();g.stroke();ell(mx,my+1.6,.7,.35,'#ff9fb5',false)}
  else if(o.mood==='worry'){path(()=>{g.moveTo(mx-1.3,my+.9);g.quadraticCurveTo(mx-.65,my+.3,mx,my+.9);g.quadraticCurveTo(mx+.65,my+1.5,mx+1.3,my+.9)});g.stroke()}
  else if(o.mood==='sad'||o.sick){path(()=>{g.moveTo(mx-1,my+1.2);g.quadraticCurveTo(mx,my,mx+1,my+1.2)});g.stroke()}
  else if(ply){path(()=>{g.moveTo(mx-1.2,my+.2);g.quadraticCurveTo(mx,my+1.2,mx+1.2,my+.2)});g.stroke();ell(mx+.4,my+1.1,.7,.8,'#ff8fae',false)}
  else{path(()=>{g.moveTo(mx-1.4,my+.1);g.quadraticCurveTo(mx-.7,my+1,mx,my+.2);g.quadraticCurveTo(mx+.7,my+1,mx+1.4,my+.1)});g.stroke()}
  if(eat){ell(mx+2,my+.6,.6,.5,'#ffffff',false)}
  if(W.makeup==='lips'&&!o.asleep&&!bird)ell(mx,my+.7,.9,.6,'#ff4f7a',false);
  if(W.makeup==='blush'&&!o.asleep)[Lx-ew-1.1,Rx+ew+1.1].forEach(x=>heart(x,cy2-.3,1.2,'#ff6fa0'));
  if(W.makeup==='sparkle'&&!o.asleep)[Lx-ew-1.6,Rx+ew+1.6].forEach((x,i)=>star(x,ey-eh-.6,(o.f+i)%2?1:.6,'#ffd84d'));
  // gender marks
  if(o.gender==='girl'&&!o.asleep&&ek!=='happy'&&!cry){g.strokeStyle=VEYE;g.lineWidth=.55;[[Lx,-1],[Rx,1]].forEach(([x,d])=>{path(()=>{g.moveTo(x+d*ew*.8,ey-eh*.55);g.lineTo(x+d*(ew+.9),ey-eh*.85)});g.stroke()});g.lineWidth=.75}
  if(o.gender==='girl'&&s>=2&&!W.head){const rx0=hx+hrx*.62,ry0=top+1.4,z=.9+s*.2;[-1,1].forEach(d=>{path(()=>{g.moveTo(rx0,ry0);g.lineTo(rx0+d*2.2*z,ry0-1.3*z);g.lineTo(rx0+d*2.2*z,ry0+1.3*z);g.closePath()});fillS('#ff7fae')});ell(rx0,ry0,.75*z,.75*z,'#ff5a92')}
  if(o.gender==='boy'&&s>=3&&!W.neck){const bx=hx,z=.75+s*.14,by=body?body.cy-body.ry*.15:Math.min(Math.max(my+2.6+z,hy+hry*.62),-1.4);[-1,1].forEach(d=>{path(()=>{g.moveTo(bx,by);g.lineTo(bx+d*2*z,by-1.2*z);g.lineTo(bx+d*2*z,by+1.2*z);g.closePath()});fillS('#4f9dff')});ell(bx,by,.7*z,.7*z,'#2f7fe0')}
  // stage extras
  if(s===1){path(()=>{g.ellipse(hx,top+2.2,hrx*.78,3,0,Math.PI,0);g.lineTo(hx+hrx*.78,top+2.2);for(let i=6;i>=0;i--)g.lineTo(hx-hrx*.78+i*(hrx*1.56/6),top+2.2+(i%2?1.2:0))});fillS('#ffffff')}
  const NOLIMB=['fish','octopus','jellyfish','dropling'].includes(k);
  if(s===2&&!o.asleep){const by=body?body.cy-body.ry*.2:hy+hry*.66;
    if(!NOLIMB){ g.save();path(()=>g.roundRect(hx+side-1.2,midY-2.4,3.4,4.6,1.2));g.fillStyle=o.gender==='boy'?'#8cc4ff':'#ff8fa3';g.fill();g.strokeStyle=VL;g.stroke();path(()=>g.roundRect(hx+side-1.2,midY-2.4,3.4,1.8,1));g.fillStyle=o.gender==='boy'?'#4f9dff':'#ff6b81';g.fill();g.restore();
      g.strokeStyle=o.gender==='boy'?'#4f9dff':'#ff6b81';g.lineWidth=.8;[-1,1].forEach(d=>{path(()=>{g.moveTo(hx+d*hrx*.48,by-1.8);g.lineTo(hx+d*hrx*.45,by+1.4)});g.stroke()});g.lineWidth=.75}
    path(()=>g.roundRect(hx-hrx*.18-1.1,by-.6,2.4,1.6,.4));g.fillStyle='#fff1a8';g.fill();g.strokeStyle=VL;g.lineWidth=.35;g.stroke();path(()=>{g.moveTo(hx-hrx*.18-.6,by+.2);g.lineTo(hx-hrx*.18+.8,by+.2)});g.stroke();g.lineWidth=.75}
  if(s===3&&!o.asleep){g.strokeStyle=VL;g.lineWidth=.6;[[Lx,-1],[Rx,1]].forEach(([x,d])=>{path(()=>{g.moveTo(x-d*ew*.9,ey-eh-.9);g.lineTo(x+d*ew*.7,ey-eh-1.5)});g.stroke()});
    const ny2=body?body.cy-body.ry+.4:hy+hry*.82,hw=hrx*.62;g.strokeStyle='#8fa8ff';g.lineWidth=.9;path(()=>{g.moveTo(hx-hw,ny2-1);g.quadraticCurveTo(hx,ny2+2.2,hx+hw,ny2-1)});g.stroke();g.lineWidth=.75;
    [-1,1].forEach(d=>ell(hx+d*hw,ny2-1,1.1,1.5,'#6f86e8'))}
  // form decorations
  const yy=top-(k==='rabbit'?7.5:k==='cat'||k==='owl'?4:2.4);
  if(ang){g.strokeStyle='#ffd447';g.lineWidth=1.1;path(()=>g.ellipse(hx,yy,4.4,1.3,0,0,Math.PI*2));g.stroke();g.lineWidth=.75}
  if(sec){[[-3.6,'#ffb3b3'],[0,'#ffd84d'],[3.6,'#bfe0ff']].forEach(([d,c],i)=>star(hx+d,yy-(i===1?1.2:0),i===1?2.2:1.6,c));[[-24,-36],[24,-34],[-26,-14],[25,-16],[-18,-26]].forEach(([a,b],i)=>star(hx+a,b,(o.f+i)%2?1.6:.8,VRAIN[(i+o.f)%6]))}
  const hd=W.head,fc=W.face,nk=W.neck;
  if(ply&&!hd){g.strokeStyle=VL;[-2.4,0,2.4].forEach(q=>{path(()=>{g.moveTo(hx+q-1,top+.6);g.lineTo(hx+q,top-2);g.lineTo(hx+q+1,top+.6)});g.fillStyle=P.d;g.fill();g.stroke()})}
  if(form==='scholar'){if(!hd){path(()=>{g.moveTo(hx-7,top-1.2);g.lineTo(hx,top-3.6);g.lineTo(hx+7,top-1.2);g.lineTo(hx,top+1.2);g.closePath()});fillS('#3b3550');g.strokeStyle='#ffd447';path(()=>{g.moveTo(hx,top-1.2);g.lineTo(hx+6,top);g.lineTo(hx+6,top+3)});g.stroke();ell(hx+6,top+3.3,.6,.6,'#ffd447',false)}
    if(!fc&&!o.asleep){g.strokeStyle=VL;g.lineWidth=.6;[Lx,Rx].forEach(x=>{path(()=>g.arc(x,ey,eh*1.15,0,Math.PI*2));g.stroke()});path(()=>{g.moveTo(Lx+eh*1.15,ey);g.lineTo(Rx-eh*1.15,ey)});g.stroke();g.lineWidth=.75}}
  if(form==='chef'&&!hd){path(()=>{g.moveTo(hx-4.4,top+1);g.lineTo(hx-4.4,top-1.6);g.bezierCurveTo(hx-8,top-4,hx-4,top-9,hx-1,top-6.5);g.bezierCurveTo(hx,top-9.5,hx+5,top-8.5,hx+3.6,top-5.6);g.bezierCurveTo(hx+8,top-5,hx+6,top-1,hx+4.4,top-1.6);g.lineTo(hx+4.4,top+1);g.closePath()});fillS('#ffffff')}
  if(form==='athlete'){path(()=>g.ellipse(hx,top+3.4,hrx*.92,1.2,0,Math.PI*1.05,-Math.PI*.05));g.strokeStyle='#ff6b81';g.lineWidth=1.6;g.stroke();g.lineWidth=.75;
    if(!nk){const bTop=body?body.cy-body.ry:hy+hry*.45;g.strokeStyle='#6aa8ff';g.lineWidth=.8;path(()=>{g.moveTo(hx-2.6,bTop+.6);g.lineTo(hx,bTop+3.6);g.lineTo(hx+2.6,bTop+.6)});g.stroke();g.lineWidth=.75;ell(hx,bTop+4.6,1.6,1.6,'#ffd447');star(hx,bTop+4.6,.9,'#fff6c2')}}
  if(form==='artist'){if(!hd){ell(hx-1.6,top+.4,6.4,2,'#e05a7a',true,-.12);ell(hx-1.6,top-1.9,.6,.8,'#e05a7a')}
    {ell(hx-side-3.2,midY+1,3,2.2,'#f1d3a8');[['#ff6b81',-1,-.4],['#6aa8ff',.6,-.6],['#ffd447',-.2,.9],['#7bd97b',1.2,.6]].forEach(([c,a,b])=>ell(hx-side-3.2+a,midY+1+b,.5,.5,c,false))}}
  if(form==='social'&&!hd){g.strokeStyle='#7cc66b';g.lineWidth=.9;path(()=>g.ellipse(hx,top+1.6,hrx*.72,1.4,0,Math.PI,0));g.stroke();g.lineWidth=.75;[[-5,'#ffb3c7'],[-1.8,'#fff1a8'],[1.8,'#ffffff'],[5,'#dccbff']].forEach(([d,c])=>{const y=top+1.6-Math.sqrt(Math.max(0,1-(d/(hrx*.72))**2))*1.4;[0,1,2,3,4].forEach(i=>{const a=i*Math.PI*2/5;ell(hx+d+Math.cos(a)*.9,y+Math.sin(a)*.9,.7,.7,c,false)});ell(hx+d,y,.5,.5,'#ffc04d',false)})}
  if(form==='lovely'){[Lx-ew-1.1,Rx+ew+1.1].forEach(x=>heart(x,cy2-.3,1.3,'#ff6fa0'));const q=(o.f%4);heart(hx+side+3,top+4-q,1.4,'#ffb3c7');heart(hx-side-3.5,top+7-((q+2)%4),1.1,'#ff8fb5')}
  if(form==='tidy'){[[hx-side-3,top+3],[hx+side+3,top+6],[hx-side-1.6,-9]].forEach(([x,y],i)=>{const q=(o.f+i)%3*.8;g.strokeStyle='#8fd0ff';g.lineWidth=.6;path(()=>g.arc(x,y-q,1.6,0,Math.PI*2));g.fillStyle='rgba(220,244,255,.7)';g.fill();g.stroke();ell(x-.6,y-q-.6,.4,.4,'#ffffff',false)});g.lineWidth=.75;if(o.f%2)star(hx+side+1,top-1,1.2,'#ffd84d')}
  if(o.sick&&!o.asleep){g.strokeStyle='#8fb4ff';g.lineWidth=.6;[-1.6,0,1.6].forEach(q=>{path(()=>{g.moveTo(hx+q,top+1.6);g.lineTo(hx+q,top+3.4)});g.stroke()});g.lineWidth=.75}
  // accessories
  if(hd==='ribbon'){const x=hx+hrx*.5,y=top+1.4;[-1,1].forEach(d=>{path(()=>{g.moveTo(x,y);g.lineTo(x+d*3,y-1.8);g.lineTo(x+d*3,y+1.8);g.closePath()});fillS('#ff8fb5')});ell(x,y,.9,.9,'#ff6fa0')}
  if(hd==='flower'){const x=hx-hrx*.5,y=top+1.4;[0,1,2,3,4].forEach(i=>{const a=i*Math.PI*2/5;ell(x+Math.cos(a)*1.2,y+Math.sin(a)*1.2,1,1,'#ffffff')});ell(x,y,.8,.8,'#ffd447')}
  if(hd==='hat'){ell(hx,top+.6,6.8,1.4,'#7a8fe0');path(()=>g.rect(hx-3.8,top-4.4,7.6,5));fillS('#7a8fe0');g.fillStyle='#ff8a9a';g.fillRect(hx-3.8,top-.6,7.6,1)}
  if(hd==='crown'){path(()=>{g.moveTo(hx-3.6,top+.6);g.lineTo(hx-3.6,top-3);g.lineTo(hx-1.8,top-1.2);g.lineTo(hx,top-3.8);g.lineTo(hx+1.8,top-1.2);g.lineTo(hx+3.6,top-3);g.lineTo(hx+3.6,top+.6);g.closePath()});fillS('#ffd447');ell(hx,top-.6,.6,.6,'#ff6b81',false)}
  if(hd==='heartband'){g.strokeStyle='#ff9fc0';g.lineWidth=.9;path(()=>g.ellipse(hx,top+2,hrx*.78,1.4,0,Math.PI,0));g.stroke();g.lineWidth=.75;[-1,1].forEach(d=>heart(hx+d*hrx*.62,top,1.5,'#ff6fa0'))}
  if(!o.asleep&&fc==='glasses'){g.strokeStyle=VL;g.lineWidth=.6;[Lx,Rx].forEach(x=>{path(()=>g.arc(x,ey,eh*1.15,0,Math.PI*2));g.stroke()});path(()=>{g.moveTo(Lx+eh*1.15,ey);g.lineTo(Rx-eh*1.15,ey)});g.stroke();g.lineWidth=.75}
  if(!o.asleep&&fc==='sunglasses'){[Lx,Rx].forEach(x=>{path(()=>g.ellipse(x,ey,eh*1.2,eh*.95,0,0,Math.PI*2));g.fillStyle='#2f2a3a';g.fill();ell(x-.6,ey-.5,.4,.3,'#ffffff',false)});g.strokeStyle='#2f2a3a';path(()=>{g.moveTo(Lx+eh,ey-.4);g.lineTo(Rx-eh,ey-.4)});g.stroke()}
  const ny=body?body.cy-body.ry+.8:hy+hry*.66;
  if(nk==='bowtie'){[-1,1].forEach(d=>{path(()=>{g.moveTo(hx,ny);g.lineTo(hx+d*2.8,ny-1.4);g.lineTo(hx+d*2.8,ny+1.4);g.closePath()});fillS('#ff6b81')});ell(hx,ny,.7,.7,'#e04b66')}
  if(nk==='scarf'){path(()=>g.ellipse(hx,ny,side*.78,1.3,0,0,Math.PI*2));fillS('#ff8a9a');g.fillStyle='#ffffff';[-3,0,3].forEach(q=>g.fillRect(hx+q-.3,ny-1,.6,2));path(()=>g.rect(hx+2,ny,1.8,3.4));fillS('#ff8a9a')}
  if(nk==='necklace'){for(let q=-4;q<=4;q+=1.6)ell(hx+q,ny+.8+Math.cos(q/4.4)*.9,.6,.6,'#ffffff',true);heart(hx,ny+2.6,.9,'#ff8fb5')}
  g.restore();
}
/* ---------- pixel drawing ---------- */
const W=72,H=54;
const OUT='#2e1c1c',PINK='#ff8fb0',CHEEK='#ff8fb0',WH='#ffffff',GOLD='#ffcf33',BEAK='#ff9a3c',RED='#ff5a6e',SHELL='#b5793f';
const RAIN=['#ff7a7a','#ffb648','#ffe45c','#7bd97b','#62b0ff','#b085ff'],PAST=['#ffc4c4','#ffdcae','#fff2b0','#c9f2c9','#c2e0ff','#ddcbff'];
const PAL={cat:{b:'#ffa53d',l:'#ffe0b0',d:'#d8650f'},rabbit:{b:'#ffffff',l:'#ffe4ee',d:'#f4b8cc'},dog:{b:'#e6b07a',l:'#fbe6cf',d:'#8a5228'},bear:{b:'#b5793f',l:'#efcf9f',d:'#6f441d'},
 chick:{b:'#ffd43b',l:'#fff3b0',d:'#e8a400'},owl:{b:'#b08a62',l:'#efdcc0',d:'#755538'},penguin:{b:'#44506e',l:'#ffffff',d:'#2a3350'},
 fish:{b:'#3db6ff',l:'#cdeeff',d:'#1f7fd0'},octopus:{b:'#ff7a8f',l:'#ffd0d8',d:'#d93f58'},turtle:{b:'#7cc95f',l:'#e8f7c8',d:'#3f8a2c'}};
function px(a,b,c){ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),1,1)}
function rc(a,b,w,h,c){if(w<=0||h<=0)return;ctx.fillStyle=c;ctx.fillRect(Math.round(a),Math.round(b),w,h)}
function E(cx,cy,rx,ry,c,band){for(let y=Math.floor(cy-ry);y<=cy+ry;y++)for(let i=Math.floor(cx-rx);i<=cx+rx;i++){const dx=(i+.5-cx)/rx,dy=(y+.5-cy)/ry;if(dx*dx+dy*dy<=1){ctx.fillStyle=band?band(y):c;ctx.fillRect(i,y,1,1)}}}
function OE(cx,cy,rx,ry,c,band){E(cx,cy,rx+1,ry+1,OUT);E(cx,cy,rx,ry,c,band)}
function dk(h){if(!h||h[0]!=='#'||h.length!==7)return h;const n=parseInt(h.slice(1),16);const r=(n>>16)*.8|0,g=(n>>8&255)*.8|0,b=(n&255)*.86|0;return'#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function OS(cx,cy,rx,ry,c,band){E(cx,cy,rx+1,ry+1,OUT);E(cx,cy,rx,ry,band?(y=>dk(band(y))):dk(c));E(cx-.6,cy-.7,rx-.9,ry-.9,c,band);if(rx>4){px(cx-rx*.55,cy-ry*.55,'#ffffff');px(cx-rx*.55+1,cy-ry*.55,'#ffffff');px(cx-rx*.55,cy-ry*.55+1,'#ffffff')}}
function pat(x,y,rows,c){x=Math.round(x);y=Math.round(y);rows.forEach((r,j)=>[...r].forEach((ch,i)=>{if(ch==='#')px(x+i,y+j,c)}))}
function tri(ax,ay,h,col,inner){for(let j=0;j<=h;j++){const hw=j*.55;for(let i=Math.round(ax-hw);i<=Math.round(ax+hw);i++)px(i,ay+j,OUT)}for(let j=2;j<=h;j++){const hw=j*.55-1.1;for(let i=Math.round(ax-hw);i<=Math.round(ax+hw);i++)px(i,ay+j,j>h*.55?col:inner)}}
function star(a,b,c){px(a,b,c);px(a-1,b,c);px(a+1,b,c);px(a,b-1,c);px(a,b+1,c)}
const HEART=['.#.#.','#####','#####','.###.','..#..'];

function drawEgg(){
  const w=(st.taps>0&&f%2)?1:(f%8===0?1:0),cx=36+w,cy=33;
  OE(cx,cy,10,13,'#fffaf0');E(cx-3,cy-5,2.5,2,'#ffc4d6');E(cx+4,cy+2,3,2.5,'#c2e0ff');E(cx-2,cy+7,2,1.5,'#fff2b0');E(cx-5,cy-8,1.2,2,WH);
  if(st.taps>=1)pat(cx-9,cy-1,['#.#.#.','.#.#.#'],OUT);
  if(st.taps>=2)pat(cx+1,cy-3,['#.#.#.#.','.#.#.#.#'],OUT);
}
const STARS=[[5,5],[16,12],[28,4],[41,9],[63,15],[10,22],[54,4],[66,24]];
function drawBg(b){
  if(b==='grass'){rc(0,0,W,H,'#dff3ff');E(60,8,4,4,'#ffe27a');rc(0,42,W,12,'#a6dd8e');for(let x=2;x<W;x+=7){px(x,43,'#7cc565');px(x+1,42,'#7cc565');px(x+2,43,'#7cc565')}
    [[8,46,PINK],[24,49,GOLD],[50,47,WH],[66,50,PINK]].forEach(([x,y,c])=>{px(x,y-1,c);px(x-1,y,c);px(x+1,y,c);px(x,y+1,c);px(x,y,GOLD)})}
  else if(b==='sea'){rc(0,0,W,H,'#bfe6ff');rc(0,12,W,10,'#b3e0ff');rc(0,26,W,10,'#a8daff');rc(0,47,W,7,'#f6e3b4');
    [[6,47],[66,47],[14,47]].forEach(([x,y],i)=>{for(let j=0;j<8+i*2;j++)px(x+((j+f+i)%4<2?0:1),y-j,'#4fb36b')});
    for(let i=0;i<4;i++){const y=44-((f*2+i*11)%40);E(20+i*12,y,1.2,1.2,WH)}}
  else if(b==='sky'){rc(0,0,W,H,'#cfe9ff');const o=(f*.6)%90;[[o-14,9,6,2.5],[((o+45)%90)-14,18,4.5,2]].forEach(([x,y,a,c])=>{E(x,y,a,c,WH);E(x+3,y-1.5,a*.6,c,WH)});rc(0,48,W,6,'#eaf6ff')}
  else if(b==='hosp'){rc(0,0,W,H,'#eef6ff');rc(0,46,W,8,'#d6e8f5');rc(6,6,14,14,WH);rc(12,8,2,10,RED);rc(8,12,10,2,RED);rc(50,34,18,6,WH);rc(50,40,2,6,'#9fb3c8');rc(66,40,2,6,'#9fb3c8');rc(50,32,6,3,'#c2e0ff')}
  else if(b==='kitchen'){rc(0,0,W,H,'#fffaf2');for(let x=0;x<W;x+=6)for(let y=0;y<30;y+=6)rc(x,y,5,5,'#f3f0ff');rc(0,40,W,14,'#e9c79f');rc(0,40,W,2,'#d1a877');OE(10,36,5,3,'#9aa5b1');rc(5,33,11,2,'#7d8894');for(let i=0;i<3;i++)if((f+i)%2)px(8+i*2,29-i,'#c9d2dd')}
  else if(b==='night'){rc(0,0,W,H,'#2d335e');STARS.forEach(([x,y],i)=>{if((f+i)%3)px(x,y,GOLD);else star(x,y,'#fff3b0')});E(60,9,4,4,'#fff3b0');E(62,7.5,3.4,3.4,'#2d335e');rc(0,48,W,6,'#3d4478')}
  else drawRoom();
  if(b&&b!=='hosp'&&b!=='kitchen')drawDeco(b);
}
function drawDeco(b){const d=(st.wear&&st.wear.deco)||[],h=id=>d.includes(id);
  if(b==='grass'){
    if(h('g_swing')){rc(3,19,1,25,'#9a6a3c');rc(18,19,1,25,'#9a6a3c');rc(2,18,18,2,'#b5793f');const w=f%4<2?0:1;rc(6+w,20,1,16,'#7a5a3a');rc(15+w,20,1,16,'#7a5a3a');rc(5+w,36,12,2,'#ff7a7a');rc(5+w,38,12,1,'#d95a5a')}
    if(h('g_rocker')){rc(65,27,2,14,'#a8703c');rc(66,28,1,9,'#ffb3c6');rc(57,36,9,2,'#c98a4b');rc(58,35,7,1,'#ffb3c6');rc(58,38,1,5,'#a8703c');rc(64,38,1,5,'#a8703c');
      for(let x=55;x<=69;x++){const q=(x-62)/7;px(x,43-Math.round(q*q*2),'#7a4a2a')}}
    if(h('g_flowers'))[2,6,10,14,57,61,65,69].forEach((x,i)=>{const c=[PINK,GOLD,'#b48cff',RED][i%4],y=50+(i%2);px(x,y+1,'#4fb36b');px(x,y+2,'#4fb36b');px(x-1,y,c);px(x+1,y,c);px(x,y-1,c);px(x,y,GOLD)});
    if(h('g_basket')){OE(51,47,3.4,2.2,'#c98a4b');rc(48,44,7,1,RED);px(49,44,WH);px(51,44,WH);px(53,44,WH);for(let x=48;x<=54;x++){const q=(x-51)/3;px(x,42-Math.round((1-q*q)*3),'#8a5a2f')}}
    if(h('g_butterfly'))[[0,'#ff9ec0'],[1,'#9fd0ff']].forEach(([i,c])=>{const x=24+i*22+Math.round(Math.sin((f+i*5)/3)*4),y=12+i*6+((f+i)%3);const o=(f+i)%2;px(x,y,OUT);px(x,y+1,OUT);rc(x-2,y-1+o,2,2,c);rc(x+1,y-1+o,2,2,c)})}
  else if(b==='sea'){
    if(h('s_coral')){[[5,41,1.6,6,'#ff8fa3'],[10,38,1.8,9,'#ff7a8a'],[15,43,1.4,4,'#ffb36b']].forEach(([x,y,a,hh,c2])=>{E(x,y,a,hh,c2);E(x-1.5,y-hh*.4,1,2,c2);E(x+1.5,y-hh*.2,1,1.6,c2)});E(7,35,1.4,1.4,'#ff8fa3');E(13,33,1.4,1.4,'#ff7a8a');E(17,38,1.2,1.2,'#ffb36b')}
    if(h('s_parasol')){rc(63,26,1,22,'#8a5a2f');for(let y=0;y<5;y++){const w=3+y*2;for(let x=-w;x<=w;x++)px(63+x,22+y,((x+20)>>2)%2?RED:WH)}rc(61,48,6,1,'#e2c890')}
    if(h('s_castle')){rc(17,43,10,5,'#e8c98a');rc(17,39,3,5,'#e8c98a');rc(24,39,3,5,'#e8c98a');[17,19,24,26].forEach(x=>px(x,38,'#e8c98a'));rc(21,45,2,3,'#b8945a');px(18,36,'#8a5a2f');px(18,37,'#8a5a2f');px(19,36,RED)}
    if(h('s_shell')){for(let y=0;y<4;y++)rc(49-y,44+y,3+y*2,1,'#ffc2d6');px(50,48,'#ff9ec0');E(55,48,1,1,WH);px(55,47,'#e6eaff')}
    if(h('s_fish'))[0,1,2].forEach(i=>{const x=((f*1.2+i*24)%86)-7,y=12+i*5+((f+i)%2);E(x,y,2,1.2,['#ffb648','#ff8fa3','#62b0ff'][i]);px(x-3,y-1,'#ffb648');px(x-3,y+1,'#ffb648');px(x+1,y-1,OUT)})}
  else if(b==='sky'){
    if(h('k_rainbow')){const C=['#ff8a8a','#ffc06b','#ffe57a','#9fe0a0','#8cc4ff','#c3a3ff'];for(let y=4;y<=30;y++)for(let x=8;x<=64;x++){const r=Math.hypot(x-36,(y-30)*1.1),k=Math.floor(28-r);if(k>=0&&k<6)px(x,y,C[k])}}
    if(h('k_balloon')){const bb=(f%4<2)?0:1;E(10,12+bb,6,7,'#ff8a9a');E(10,12+bb,2,7,'#ffd36b');rc(8,24+bb,5,3,'#b5793f');px(6,19+bb,OUT);px(14,19+bb,OUT);rc(7,20+bb,1,4,OUT);rc(13,20+bb,1,4,OUT)}
    if(h('k_kite')){const k=(f%2);for(let y=0;y<9;y++){const w=y<4?y:8-y;rc(62-w,6+y+k,w*2+1,1,y<4?'#62b0ff':'#ffcf33')}for(let i=0;i<14;i++)px(62+Math.round(Math.sin((i+f)/2)),15+i+k,'#7a6470');[18,23,28].forEach(y=>{px(61,y+k,RED);px(63,y+k,RED)})}
    if(h('k_sofa')){E(19,45,7,3,WH);E(13,42,2.5,4,WH);E(25,42,2.5,4,WH);E(19,41,5,2.5,'#f3f8ff');rc(15,48,1,1,'#dbe8f7');rc(23,48,1,1,'#dbe8f7')}
    if(h('k_birds'))[0,1,2].forEach(i=>{const x=((f*.8+i*9)%90)-8,y=8+i*3+(i%2),u=(f+i)%2;px(x-1,y-u,OUT);px(x,y,OUT);px(x+1,y-u,OUT)})}
  else if(b==='night'){
    if(h('n_tent')){for(let y=0;y<17;y++){const w=Math.round(y*.6);rc(10-w,31+y,w*2+1,1,'#7c8be0')}for(let y=8;y<17;y++){const w=Math.round((y-8)*.35);rc(10-w,31+y,w*2+1,1,'#3d4478')}px(10,30,GOLD);[[2,46],[6,40],[14,40],[18,46]].forEach(([x,y],i)=>px(x,y,(f+i)%2?GOLD:'#ff9ec0'))}
    if(h('n_scope')){[[60,40,57,48],[60,40,63,48]].forEach(([x1,y1,x2,y2])=>{for(let t=0;t<=8;t++)px(Math.round(x1+(x2-x1)*t/8),Math.round(y1+(y2-y1)*t/8),'#8a7f9e')});for(let t=0;t<=10;t++){const x=56+t,y=Math.round(40-t*.7);rc(x,y-1,1,3,'#c9d2dd')}rc(66,32,2,3,'#ffcf33')}
    if(h('n_fire')){rc(15,47,10,2,'#8a5a2f');rc(17,46,6,1,'#6e4524');const fl=f%2;E(20,43-fl,2.6,3.6,'#ff8a3d');E(20,44,1.4,2.2,'#ffd84d');}
    if(h('n_fireflies'))[[24,22],[48,18],[30,34],[54,30],[14,26],[40,12]].forEach(([x,y],i)=>{if((f+i)%3){px(x,y,'#fffbd0');px(x-1,y,'#e8f27a');px(x+1,y,'#e8f27a');px(x,y-1,'#e8f27a');px(x,y+1,'#e8f27a')}});
    if(h('n_lantern')){rc(52,48,1,1,OUT);rc(50,38,5,8,'#ff7a5a');rc(50,37,5,1,'#8a5a2f');rc(50,46,5,1,'#8a5a2f');rc(51,40,3,4,'#ffd36b')}}
}
function drawPoop(x,y){const c='#9a6a3c';OE(x,y,3,1.4,c);OE(x,y-2.4,2.2,1.2,c);OE(x,y-4.4,1.2,1,c);px(x-1,y-2,'#c79565');if(f%2){px(x-3,y-8,'#9fb07a');px(x-2,y-9,'#9fb07a');px(x+2,y-8,'#9fb07a');px(x+3,y-9,'#9fb07a')}}
function drawApple(x,y){OE(x,y,2.4,2.2,RED);px(x-1,y-1,WH);rc(x,y-4,1,2,'#7a4a2a');px(x+1,y-4,'#5cc45c');px(x+2,y-5,'#5cc45c')}

let petQ=[];
function drawPet(s,cx,base,mood,dir){petQ.push({gender:st.gender,kind:st.kind,colorKind:st.colorKind,stage:s,form:st.form,wear:Object.assign({},st.wear),x:cx,y:base,mood,dir:dir||0,asleep:st.asleep,sick:st.sick,eating:!!(fx&&fx.t==='eat'&&f%2),bob:!st.asleep&&!st.sick&&f%2,f})}
function mood(){
  if(st.sick)return 'sad';
  if(fx&&(fx.t==='heart'||fx.t==='eat'||fx.t==='bubble'))return 'happy';
  if(game&&game.res)return game.res;
  if(game&&game.type==='catch')return 'happy';
  if(low()<30)return 'cry';
  if(low()<50)return 'worry';
  if(st.poop>1)return 'sad';
  return avg()>65?'happy':'normal';
}
function fitCanvas(){const r=cv.getBoundingClientRect();if(!r.width)return;const dpr=window.devicePixelRatio||1,sc=Math.max(2,Math.round(r.width*dpr/72));if(cv.width!==72*sc){cv.width=72*sc;cv.height=54*sc}}
window.addEventListener('resize',()=>{fitCanvas();draw()});
function drawOver(){if(!st.hatched)return;
  if(st.ended){const C=['#ff8fb0','#ffd447','#8fd0ff','#b085ff','#7bd97b'];for(let i=0;i<22;i++){const x=(i*37+f*(1+i%3))%72,y=(i*13+f*(2+i%2))%54;ctx.fillStyle=C[i%5];ctx.fillRect(x,y,1.2,1.2)}}
  if(st.paused){ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(0,0,W,H);rc(4,4,3,8,OUT);rc(9,4,3,8,OUT);OE(60,44,5,4,'#ff8fb0');rc(57,38,6,2,'#d9566f')}
  if(st.asleep){ctx.fillStyle='rgba(20,22,60,.45)';ctx.fillRect(0,0,W,H);const k=f%6;pat(52+Math.floor(k/2),6+((6-k)%3),['###','..#','.#.','#..','###'],WH);if(k>2)pat(60,3,['##','.#','##'],'#c9d2ff')}
}
function draw(){fitCanvas();petQ=[];drawFrame();dctx.imageSmoothingEnabled=false;dctx.clearRect(0,0,cv.width,cv.height);dctx.drawImage(buf,0,0,cv.width,cv.height);const sc=cv.width/72;
  petQ.forEach(q=>{try{vPet(dctx,Object.assign({sc},q))}catch(e){}});const old=ctx;ctx=dctx;dctx.save();dctx.scale(sc,sc);try{drawOver()}finally{dctx.restore();ctx=old}}
function drawFrame(){
  if(scene&&Date.now()-scene.s>=scene.d)scene=null;
  ctx.clearRect(0,0,W,H);drawBg(scene&&scene.bg?scene.bg:st.wear.bg);
  if(!st.hatched){drawEgg();return}
  const s=stage();
  if(game&&game.type==='pop'){drawPet(Math.min(s,3),36,51,'happy',0);game.items.forEach(it=>{OE(it.x,it.y,2.8,3.4,it.c);px(it.x-1,it.y-2,WH);for(let j=0;j<5;j++)px(it.x+(j%2),it.y+4+j,OUT)});return}
  if(game&&game.type==='catch'){drawPet(Math.min(s,2),game.x,51,'happy',0);game.items.forEach(it=>drawApple(it.x,it.y));return}
  for(let i=0;i<st.poop;i++)drawPoop(59+(i%2)*7,49-Math.floor(i/2)*7);
  let dir=0,cx=petX,base=51;if(game){cx=36;dir=game.dir||0}
  if(scene&&scene.t==='walk'){cx=10+((Date.now()-scene.s)/scene.d)*52;dir=1}
  if(scene&&(scene.t==='hosp'||scene.t==='cook'))cx=34;
  if(game&&game.type==='jump')[cx,base]=exDraw('pre',cx,base);
  if(st.spouse&&s===4&&!game&&!scene){const o={kind:st.kind,form:st.form,wear:st.wear,colorKind:st.colorKind,gender:st.gender};Object.assign(st,{kind:st.spouse.kind,form:st.spouse.form,wear:{furn:[]},colorKind:st.spouse.colorKind||null,gender:st.spouse.gender});cx=Math.min(cx,30);drawPet(4,cx+26,base,'happy',-1);Object.assign(st,o);pat(Math.round(cx)+11,18-(f%2),['.#.#.','#####','#####','.###.','..#..'],PINK)}
  drawPet(s,cx,base,scene&&scene.t==='hosp'?'normal':mood(),dir);
  if(game&&game.type==='jump')exDraw('post',cx,base);
  if(scene&&scene.t==='bath'){rc(cx-16,40,32,10,WH);rc(cx-16,40,32,1,'#9fb3c8');rc(cx-14,50,2,3,'#9fb3c8');rc(cx+12,50,2,3,'#9fb3c8');for(let i=0;i<8;i++)E(cx-13+i*4,40-((i+f)%2),2,1.6,'#e6f6ff')}
  if(scene&&scene.t==='clean'){for(let i=0;i<6;i++){const a=(i*11+f*5)%62+5,b2=10+((i*7+f*3)%34);if((f+i)%2)star(a,b2,GOLD);else px(a,b2,'#fff3b0')}rc(58,24,2,22,'#b5793f');rc(54,44,10,4,'#f2c14e');for(let x=54;x<64;x+=2)px(x,48,'#d9a32b')}
  if(scene&&scene.t==='study'){rc(4,40,14,8,WH);rc(10,40,1,8,'#c8c8d8');for(let y=42;y<47;y+=2){rc(5,y,4,1,'#9aa');rc(12,y,5,1,'#9aa')}rc(20,36,2,10,GOLD);px(20,46,OUT);px(21,46,OUT)}
  if(scene&&scene.t==='cook'){rc(cx-5,23,11,4,WH);rc(cx-4,20,9,3,WH);if(scene.dish){rc(50,38,14,2,WH);OE(57,36,4,2,'#ffd28a')}}
  if(scene&&scene.t==='hosp'){rc(cx+10,30,6,2,'#9fb3c8');rc(cx+15,29,2,4,'#62b0ff')}
  if(st.sick&&f%2){rc(3,5,6,2,RED);rc(5,3,2,6,RED)}
  if(fx){
    const age=(Date.now()-fx.s)/fx.d,left=Math.max(0,3-Math.floor(age*4));
    if(fx.t==='eat'&&left>0){if(fx.snack){rc(10,38,1,7,WH);OE(10,36,left+.6,left+.6,PINK);px(10,36,WH);px(9,35,'#ff5d8f')}else{OE(10,40,1.5+left,1+left,WH);rc(9,40+left-1,3,2,'#2b2b2b')}}
    if(fx.t==='heart'){const y=Math.round(22-age*14);pat(Math.round(cx)-16,y,HEART,PINK);pat(Math.round(cx)+12,y+4,HEART,'#ff6b9a')}
    if(fx.t==='bubble'){for(let i=0;i<7;i++){const bx=(i*13+f*3)%66+3,by=48-((i*9+f*3)%40);E(bx,by,2.2,2.2,'#7fc8ff');E(bx,by,1.2,1.2,'#e6f6ff');px(bx-1,by-1,WH)}}
    if(fx.t==='drink'){rc(8,36,6,9,'#cfeaff');rc(8,36,6,1,OUT);rc(8,44,6,1,OUT);rc(8,36,1,9,OUT);rc(13,36,1,9,OUT);rc(9,38+Math.floor(age*5),4,6-Math.floor(age*5),'#62b0ff')}
    if(fx.t==='brush'){rc(Math.round(cx)+6,28,10,2,'#62b0ff');rc(Math.round(cx)+4,27,3,4,WH);if(f%2){star(Math.round(cx)-8,30,GOLD);star(Math.round(cx)+16,24,GOLD)}}
    if(fx.t==='med'){OE(10,24+(f%2),3.6,1.8,WH);E(8.4,24+(f%2),1.9,1.7,RED)}
    if(age>=1)fx=null;
  }
  if(game&&game.arrow){const d=game.dir;pat(d<0?4:63,22,d<0?['..#','.##','###','.##','..#']:['#..','##.','###','##.','#..'],OUT)}
}

/* ---------- speech ---------- */
function say(t,ms){const e=$('say');e.textContent=t;e.style.opacity=1;sayUntil=Date.now()+(ms||3500);if(st.asleep)e.dataset.dark='';else delete e.dataset.dark}
function idleTalk(){
  if(!st.hatched||game||!st.name)return;
  const n=st.name;
  if(st.asleep)return say('쿨쿨… 쿨쿨…',5000);
  if(st.sick)return say('아파요… 💊 약을 주세요');
  if((st.teeth||0)>=4)return say('이가 끈적해요… 🪥 양치할래요');
  if(st.health<45)return say('몸이 좀 안 좋아요… 약 먹을래요');
  if(st.poop>0)return say('응가 했어요! 🧹 청소해 주세요');
  if(st.hunger<30)return say('배고파요… 밥 주세요');
  if(st.energy<25)return say('졸려요… 재워 주세요');
  if(st.happy<30)return say('심심해요, 놀아 주세요!');
  if(st.clean<30)return say('몸이 근질근질해요');
  const L=[`${n} 기분 최고!`,'사랑해요 ♥','오늘 학교 재밌었어요?','나를 쓰다듬어 줄래요?','룰루랄라~',`${n}는 쑥쑥 크는 중!`,'같이 놀아요!','가게 구경 가고 싶어요!','새 옷 입고 싶어요~'];
  say(L[Math.floor(Math.random()*L.length)]);
}

/* ---------- sheets ---------- */
function sheet(title,build,noClose){$('mT').textContent=title;const b=$('mB');b.innerHTML='';build(b);$('mX').hidden=!!noClose;$('mXX').hidden=false;xMode=noClose||'';xBack=null;if(!hPushed){try{history.pushState({tk:1},'');hPushed=true}catch(e){}}if(noClose==='game')b.append(mk('🚪','나가기 (그만할래요)',quitSheet,'quit'));$('m').hidden=false;$('m').querySelector('.sheet').scrollTop=0;fitSheet()}
function fitSheet(){const sh=$('m').querySelector('.sheet');if(!sh||$('m').hidden)return;sh.style.zoom='';sh.style.width='';sh.style.maxHeight='';if(innerWidth>600)return;const r=sh.clientHeight/sh.scrollHeight;if(r<1){const z=Math.max(.62,r-.01);sh.style.zoom=z;sh.style.width=Math.min(340,innerWidth-24)/z+'px';sh.style.maxHeight=(innerHeight-24)/z+'px'}}
function fitScreen(){const bz=document.querySelector('.bezel'),sd=document.querySelector('.side');if(!bz)return;bz.style.removeProperty('width');if(sd)sd.style.zoom='';if(innerWidth>600){if(typeof fitCanvas==='function'){fitCanvas();try{draw()}catch(e){}}return}
  const last=()=>{let b=0;document.querySelectorAll('header.top,main.layout>*').forEach(e=>{if(e.offsetParent){const r=e.getBoundingClientRect();if(r.height)b=Math.max(b,r.bottom+scrollY)}});return b+8};
  const maxW=Math.min(innerWidth-36,520);let w=bz.offsetWidth;
  for(let k=0;k<4;k++){const slack=innerHeight-last();if(Math.abs(slack)<=2)break;w=Math.max(170,Math.min(maxW,w+slack*1.3));bz.style.setProperty('width',w+'px','important')}
  const ov=last()-innerHeight;if(ov>2&&sd){const h=sd.offsetHeight;sd.style.zoom=Math.max(.8,(h-ov-2)/h)}
  if(typeof fitCanvas==='function'){fitCanvas();try{draw()}catch(e){}}}
window.addEventListener('resize',()=>{fitScreen();fitSheet()});
function closeSheet(){$('m').hidden=true}
let xMode='',xBack=null,hPushed=false,backAt=0;
function xClose(){const t=$('mT').textContent;if(xBack){const f=xBack;xBack=null;f();return}
  if(xMode==='game'){quitSheet();return}
  if(locked){if(t.startsWith('👥'))return (typeof owner!=='undefined'&&!owner&&typeof busySlot==='function')?busySlot():lockScreen();return charSheet()}
  closeSheet()}
$('mX').onclick=xClose;$('mXX').onclick=xClose;
window.addEventListener('popstate',()=>{hPushed=false;
  if(!$('m').hidden)xClose();else if(Date.now()-backAt>2500){backAt=Date.now();say('한 번 더 누르면 나가요',2500)}else{history.back();return}
  if(!hPushed){try{history.pushState({tk:1},'');hPushed=true}catch(e){}}});
try{history.pushState({tk:1},'');hPushed=true}catch(e){}
function mk(ic,lb,fn,cls){const b=document.createElement('button');b.innerHTML=`<span class="ic">${ic}</span>${lb}`;b.onclick=fn;if(cls)b.className=cls;return b}
function el(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e}

function growRow(k,g0,mood){const w=el('div','growrow');['아기','어린이','청소년','어른'].forEach((n,i)=>{const c=el('div','growc');c.append(petThumb({kind:k,stage:i+1,gender:g0||'girl',mood},34,46),el('small',null,n));w.append(c);if(i<3)w.append(el('span','growar','›'))});return w}
function askName(){
  sheet('알에서 나왔어요!',b=>{
    b.append(el('div',null,'어떤 동물로 키울까요?'),el('div','howdn','👆 친구를 누르면 크게 보고 고를 수 있어요'));
    GROUPS.forEach(([gn,ks])=>{b.append(el('h3',null,gn));const g=el('div','grid');
      ks.forEach(k=>{const [ic,n]=KINDS[k];g.append(mk(ic,n,()=>kindDetail(k,true)))});b.append(g)});
  },true);
}
function nameSheet(k,gd){const [ic,n]=KINDS[k];
  sheet(`${ic} ${gd==='girl'?'여자':'남자'} ${n}`,b=>{
    const r=el('div','growbox');r.append(growRow(k,gd));b.append(r,el('div',null,'이름을 지어 주세요'));
    const inp=document.createElement('input');inp.id='nameI';inp.maxLength=6;inp.placeholder='콩이';inp.autocomplete='off';inp.value=st.name||'';b.append(inp);
    const ok=mk('💖','이름 정하기',()=>{st.gender=gd;const first=!st.name;st.kind=k;st.name=inp.value.trim()||'콩이';if(first)log(`${st.gen>1?st.gen+'대째 ':''}${n} ${st.name}가 태어났어요`);closeSheet();save();render();say(`안녕! 나는 ${st.name}야!`,5000)},'big');
    inp.onkeydown=e=>{if(e.key==='Enter')ok.click()};b.append(ok,mk('↩️','다른 친구 보기',askName,'big'))},true);xBack=()=>kindDetail(k,true)}
function playMenu(){
  if(st.energy<15)return say('너무 피곤해요… 재워 주세요');
  if(st.sick)return say('아파서 못 놀아요… 약 먼저!');
  sheet('무슨 놀이 할까요?',b=>{
    b.append(mk('◀▶','어느 쪽 볼까? 맞히기',()=>{closeSheet();startLR()},'big'));
    b.append(mk('🍎','사과 받기 (20초)',()=>{closeSheet();startCatch()},'big'));
    b.append(mk('🌳','숨바꼭질',()=>{closeSheet();hideSeek()},'big'));
    b.append(mk('✌️','가위바위보',()=>{closeSheet();rps()},'big'));
    b.append(mk('🃏','짝 맞추기',()=>{closeSheet();memory()},'big'));
    b.append(mk('🎈','풍선 터뜨리기 (15초)',()=>{closeSheet();startPop()},'big'));
    b.append(el('div',null,'잘할수록 골드 🪙 를 많이 받아요'));
  });
}

/* ---------- buttons ---------- */
function quitGame(){if(game&&game.iv)clearInterval(game.iv);game=null;scene=null;say('그만할래요~ 다음에 또 해요!');save();render();draw()}
function quitSheet(){closeSheet();scene=null;game=null;say('그만할래요~ 다음에 또 해요!');save();render()}
function render(){
  $('btns').style.gridTemplateColumns='';
  {const sb=$('school');sb.hidden=!st.hatched||!st.name||!!st.ended;sb.textContent=st.paused?'🏠 다녀왔어요':'🏫 학교 가기';sb.onclick=()=>st.paused?comeBack():goSchool();sb.classList.toggle('on',!!st.paused)}
  const box=$('btns');box.innerHTML='';box.className='btns';
  $('acts').innerHTML='';
  if(locked){box.classList.add('one');box.append(mk('🔒','잠금 풀기',lockScreen))}
  else if(!st.hatched){box.classList.add('one');box.append(mk('🥚','알 톡톡',tapEgg))}
  else if(game&&game.type==='pop'){box.classList.add('two');const bt=mk('🎈','풍선을 눌러요',()=>{});bt.disabled=true;box.append(bt,mk('🚪','나가기',quitGame,'quit'))}
  else if(game&&game.type==='jump'){box.classList.add('two');box.append(mk(game.ic||'🏃','톡! 점프',jumpTap),mk('🚪','나가기',quitGame,'quit'))}
  else if(game){box.classList.add('two');
    const dis=game.type==='lr'&&(!!game.arrow||game.done);
    const l=mk('◀','왼쪽',()=>pick(-1)),r=mk('▶','오른쪽',()=>pick(1));l.disabled=r.disabled=dis;box.style.gridTemplateColumns='1fr 1fr 1fr';box.append(l,r,mk('🚪','나가기',quitGame,'quit'))}
  else if(st.ended){box.classList.add('two');box.append(mk('🎬','엔딩 다시 보기',showEnding),mk('🥚','아기 알로 새 이야기',babyEgg))}
  else if(st.paused){box.classList.add('one');box.append(mk('🏠','다녀왔어요! (다시 시작)',comeBack,'big'))}
  else if(st.asleep){box.classList.add('one');box.append(mk('☀️','깨우기',wake))}
  else{box.className='boxes';BOXES.forEach(([t,list])=>{const bx=el('div','bx'+(list.length>=4?' wide':''));bx.append(el('div','bxt',t));const g=el('div','bxg');g.style.gridTemplateColumns=`repeat(${list.length===5?5:list.length===4?4:list.length===2?2:3},1fr)`;
    list.forEach(([ic,n,fn])=>g.append(mk(ic,n,()=>window[fn](),((fn==='medicine'&&(st.sick||st.health<45))||(fn==='hospital'&&st.sick))?'alert':'')));bx.append(g);box.append(bx)})}
  hearts();
}
const WARN={learn:['뭔가 하고 싶어요~','심심해요! 놀거나 배우고 싶어요 🌟'],water:['목이 조금 말라요~','목말라요! 물 주세요 💧'],art:['그림 그리고 싶어요','심심해요! 그림 그려요 🎨'],hunger:['배가 조금 고파요~ 🍙','배고파요! 밥 주세요 😢'],happy:['조금 심심해요~','너무 심심해요… 놀아 주세요 😢'],clean:['몸이 조금 근질근질해요','냄새나요! 씻겨 주세요 🫧'],energy:['조금 졸려요~','너무 졸려요… 재워 주세요 😴'],
 health:['몸이 좀 안 좋아요','아플 것 같아요… 약이나 병원! 🏥'],love:['안아 주세요~','외로워요… 쓰다듬어 주세요 💕'],smart:['공부하고 싶어요 📚','머리가 근질근질! 공부해요 ✏️'],skill:['요리해 보고 싶어요','뭔가 만들고 싶어요! 요리 교실 가요 🍳'],
 fit:['몸이 찌뿌둥해요','운동하고 싶어요! 🏃'],friend:['친구가 보고 싶어요','친구 만나러 산책 가요! 🚶']};
let warnInit=false;
function checkWarn(){if(!st.hatched||!st.name)return;st.warn=st.warn||{};let top=null;
  STATS.forEach(([k])=>{const lv=st[k]<=30?2:st[k]<=50?1:0,prev=st.warn[k]||0;if(warnInit&&lv>prev&&(!top||lv>top[1]))top=[k,lv];st.warn[k]=lv});
  warnInit=true;if(top&&!game){const [k,lv]=top,n=STATS.find(x=>x[0]===k)[2];say(`${st.asleep?'(잠꼬대) ':''}${WARN[k][lv-1]} (${n} ${lv===2?'30%':'50%'})`,lv===2?6000:4500)}}
function hearts(){
  STATS.forEach(([k])=>{const n=st.hatched?Math.ceil(st[k]/10):0,e=$('h-'+k);e.innerHTML='<b>'+'♥'.repeat(n)+'</b>'+'♥'.repeat(10-n);e.classList.toggle('mid',st.hatched&&st[k]<=50&&st[k]>30);e.classList.toggle('low',st.hatched&&st[k]<=30)});
  checkWarn();
  $('ttl').textContent=st.name?`${st.name}${st.gender==='girl'?' ♀':st.gender==='boy'?' ♂':''}`:'톡톡';$('chars').textContent=`👥 ${SLOT+1}번`;
  $('gold').textContent=`🪙 ${st.gold} 골드`;
  if(st.hatched){const d=Math.floor((Date.now()-st.born)/864e5)+1;$('age').textContent=`태어난 지 ${d}일째`;
    $('stg').textContent=`${KINDS[st.kind]?KINDS[st.kind][1]+' ':''}${STG[stage()]}${stage()===4&&FORMS[st.form]?'('+FORMS[st.form][1].replace(' (시크릿)','')+')':''} ${stage()<4?` · 어른까지 약 ${Math.max(1,Math.round(GROW[3]-growMin()))}분`:''}`}
  else{$('age').textContent='태어나기 전';$('stg').textContent='알'}
}
function bump(n){st.points+=n;const s=stage();if(s>lastStage){lastStage=s;st.gold+=50;goldPop();fx={t:'heart',s:Date.now(),d:2500};
  if(s===4){st.form=chooseForm();
    if(!st.found.includes(st.form))st.found.push(st.form);
    const fn=FORMS[st.form][1];say(st.form==='secret'?`우와! 시크릿 ${st.name}가 나타났어요! 🌈`:`${st.name}가 ${fn} 어른이 됐어요!`,6000);log(`${st.name}가 ${fn} 어른이 됐어요`)}
  else{say(`와! ${st.name}가 ${STG[s]}로 쑥 자랐어요! 골드 🪙50 선물!`,5000);log(`${st.name}가 ${STG[s]}로 자랐어요`)}render()}}

function tapEgg(){if(st.hatched)return;st.taps++;f++;
  if(st.taps<3)say(['톡! 뭔가 움직여요','톡톡! 금이 갔어요!'][st.taps-1]);
  else{st.hatched=true;st.born=Date.now();st.last=Date.now();lastStage=1;askName()}
  save();render();draw()}

const ICON=Object.fromEntries(STATS.map(([k,i])=>[k,i]));
let chipT=0;
function goldPop(){const g=$('gold');g.classList.remove('pop');void g.offsetWidth;g.classList.add('pop')}
function eff(o,gold){const c=$('chips');c.innerHTML='';
  for(const k in o){if(!o[k]||!ICON[k])continue;const b=st[k];st[k]=clamp(st[k]+(o[k]>0?o[k]*1.5:o[k]));const d=(st[k]-b)/10;if(Math.abs(d)<.5)continue;
    const sp=el('span',d<0?'dn':'',`${ICON[k]}${d>0?'+':''}${Math.round(d)}칸`);c.append(sp)}
  if(gold){st.gold+=gold;c.append(el('span','',`🪙+${gold}`));goldPop()}
  c.style.opacity=1;clearTimeout(chipT);chipT=setTimeout(()=>c.style.opacity=0,2600);hearts()}
function wake(){const tired=st.energy<60;st.asleep=false;eff({happy:tired?-8:5});say(tired?'으음… 아직 졸려요':'잘 잤다!');save();render()}
function medicine(){
  if(!st.sick&&st.health>=90)return say('안 아파요! 튼튼해요 💪');
  const was=st.sick;st.sick=false;st.snacks=0;fx={t:'med',s:Date.now(),d:1600};
  eff({health:was?60:25,happy:-5});
  if(was)log('약 먹고 다 나았어요');say(was?'꿀꺽! 써도 꾹 참았어요. 다 나았어요!':'꿀꺽! 건강해졌어요',4000);save();render()}

/* ---------- games ---------- */
function startLR(){game={type:'lr',round:0,win:0,dir:0,arrow:false,res:null,done:false};say('내가 어느 쪽 볼까? 맞혀 봐요!',9e9);render()}
function startCatch(){
  game={type:'catch',x:36,items:[],score:0,end:Date.now()+20000,t:0};say('사과를 받아요! ◀ ▶',9e9);render();
  game.iv=setInterval(catchTick,120)}
function catchTick(){
  if(!game||game.type!=='catch')return;
  game.t++;const left=Math.ceil((game.end-Date.now())/1000);
  if(game.t%7===0)game.items.push({x:6+Math.random()*60,y:-4,v:1.3+Math.random()*.9});
  game.items.forEach(it=>it.y+=it.v);
  game.items=game.items.filter(it=>{if(it.y>=34&&it.y<=47&&Math.abs(it.x-game.x)<=8){game.score++;return false}return it.y<56});
  say(`🍎 ${game.score}개 · ${Math.max(0,left)}초`,9e9);draw();
  if(left<=0){clearInterval(game.iv);const sc=game.score;
    game=null;st.plays++;log(`사과 받기: 사과 ${sc}개, 골드 ${sc*5}`);
    st.cnt.play=(st.cnt.play||0)+1;eff({happy:6+sc*2,learn:12,love:5,friend:5,energy:-14,hunger:-8,clean:-8},sc*5);fx={t:'heart',s:Date.now(),d:1800};bump(2);
    say(`사과 ${sc}개! 골드 🪙${sc*5} 벌었어요!`,5000);save();render()}
}
function pick(g){
  if(!game)return;
  if(game.type==='catch'){game.x=Math.max(8,Math.min(64,game.x+g*7));draw();return}
  if(game.arrow)return;
  game.dir=Math.random()<.5?-1:1;game.arrow=true;const ok=game.dir===g;if(ok)game.win++;game.res=ok?'happy':'sad';
  say(ok?'딩동댕! 맞았어요!':'아쉬워요~',9e9);render();
  setTimeout(()=>{game.round++;game.arrow=false;game.res=null;game.dir=0;
    if(game.round>=5){const w=game.win;game.done=true;render();
      st.plays++;log(`맞히기 놀이: 5번 중 ${w}번, 골드 ${w*10}`);
      st.cnt.play=(st.cnt.play||0)+1;eff({happy:5+w*5,learn:12,love:5,friend:5,smart:w*2,energy:-12,hunger:-6,clean:-5},w*10);
      say(`5번 중에 ${w}번! 골드 🪙${w*10} 벌었어요!`,4000);
      setTimeout(()=>{game=null;fx={t:'heart',s:Date.now(),d:1800};bump(2);save();render()},1600)}
    else{say(`${game.round+1}번째! 어느 쪽?`,9e9);render()}},1100)}
document.addEventListener('keydown',e=>{if(!game||!$('m').hidden)return;if(game.type==='jump'&&(e.key===' '||e.key==='Enter')){e.preventDefault();jumpTap();return}if(e.key==='ArrowLeft')pick(-1);if(e.key==='ArrowRight')pick(1)});
cv.onclick=e=>{if(locked)return;
  if(!st.hatched)return tapEgg();
  if(game&&game.type==='pop'){popAt(e);return}
  if(game&&game.type==='jump'){jumpTap();return}
  if(game&&game.type==='catch'){const r=cv.getBoundingClientRect();pick(e.clientX-r.left<r.width/2?-1:1);return}
  if(game||st.asleep||st.paused)return;
  if(Date.now()-lastPet<2500)return;lastPet=Date.now();
  st.pets++;eff({happy:4,love:5,health:st.sick?2:0});fx={t:'heart',s:Date.now(),d:1500};say(st.sick?'조금 나아졌어요…':'헤헤, 간지러워요!');save();hearts()};

$('reset').onclick=()=>sheet('정말 다시 키울까요?',b=>{
  b.append(el('div',null,'지금 친구와 헤어지고 새 알이 와요.'));
  const r=el('div','row');
  r.append(mk('🙅','아니요',closeSheet),mk('🥚','네',()=>{if(game&&game.iv)clearInterval(game.iv);st=fresh();game=null;fx=null;lastStage=0;paintShell();closeSheet();save();render();say('새 알이 왔어요! 톡톡 눌러 보세요')}));
  b.append(r)});

function diary(){sheet(`${st.name||'우리'} 육아일기`,b=>{
  if(!st.diary.length){b.append(el('div',null,'아직 일기가 없어요. 알을 깨워 보세요!'));return}
  const d=el('div','diary');st.diary.slice().reverse().forEach(e=>{const r=el('div');r.append(el('b',null,e.d),el('span',null,e.t));d.append(r)});b.append(d)})}
let dexTab='kind';
function kindsFound(){const f=new Set();if(st.hatched&&st.kind)f.add(st.kind);(st.album||[]).forEach(x=>x.kind&&f.add(x.kind));
  [0,1,2,3].forEach(i=>{if(i===SLOT)return;try{const d=slotData(i);if(d&&d.hatched&&d.kind)f.add(d.kind);(d&&d.album||[]).forEach(x=>x.kind&&f.add(x.kind))}catch(e){}});return f}
let kdTab='grow';
function kindDetail(k,fromPick,has){const [ic,n]=KINDS[k];
  sheet(`${ic} ${n}`,b=>{
    const tb=el('div','ctabs three');[['grow','🌱','자라는 모습'],['face','😊','표정'],['dex','📖','도감']].forEach(([t,i2,l])=>tb.append(mk(i2,l,()=>{kdTab=t;kindDetail(k,fromPick,has)},kdTab===t?'on':'')));b.append(tb);
    if(kdTab==='grow'){[['girl','👧 여자'],['boy','👦 남자']].forEach(([gd,l])=>{const bx=el('div','growbox');bx.append(el('div','growt',l),growRow(k,gd));b.append(bx)})}
    else if(kdTab==='face'){b.append(el('div','howdn','하트가 줄어들면 표정이 바뀌어요'));const g=el('div','growrow');
      [['happy','기쁨'],['normal','보통'],['worry','50% 아래'],['cry','30% 아래']].forEach(([m,l])=>{const c=el('div','growc');c.append(petThumb({kind:k,stage:4,gender:'girl',mood:m},34,46),el('small',null,l));g.append(c)});b.append(g)}
    else{b.append(el('div','howdn','도감에는 어른 모습으로 담겨요. 키우면 색이 켜져요!'));const r=el('div','dexpair');
      [[false,'키우기 전'],[true,'키운 뒤']].forEach(([on,l])=>{const c=el('div','dexc big'+(on?'':' off'));c.append(petThumb({kind:k,stage:4,gender:'girl'},40,40),el('b',null,n),el('small',null,l));r.append(c)});b.append(r);
      if(has!=null)b.append(el('div','howdn',has?'⭐ 키워 본 친구예요!':'아직 키워 보지 않은 친구예요'))}
    if(fromPick){b.append(el('h3',null,'남자예요? 여자예요?'));const r=el('div','grid two-col');[['girl','👧','여자'],['boy','👦','남자']].forEach(([gd,i2,l])=>r.append(mk(i2,l,()=>nameSheet(k,gd),'big')));b.append(r,mk('↩️','다른 친구 보기',askName,'big'))}
    else b.append(mk('📖','도감으로 돌아가기',dex,'big'))},fromPick?true:undefined);xBack=fromPick?askName:dex}
function dexKind(k,has){kindDetail(k,false,has)}
function dex(){sheet('📖 도감',b=>{
  const tb=el('div','ctabs two');[['kind','🐾','친구 도감'],['form','👑','어른 모습']].forEach(([k,ic,n])=>tb.append(mk(ic,n,()=>{dexTab=k;dex()},dexTab===k?'on':'')));b.append(tb);
  if(dexTab==='kind'){const f=kindsFound(),all=GROUPS.flatMap(g=>g[1]);
    b.append(el('div','howdn',`키워 본 친구 ${all.filter(k=>f.has(k)).length} / ${all.length} · 키워 본 친구만 색이 켜져요`));
    const d=el('div','dexg four');all.forEach(k=>{const has=f.has(k),r=el('div','dexc'+(has?'':' off'));r.append(petThumb({kind:k,stage:4,gender:'girl'},60,48),el('b',null,KINDS[k][1]));r.onclick=()=>dexKind(k,has);d.append(r)});b.append(d);b.append(el('div','howdn','👆 친구를 누르면 자라는 모습을 볼 수 있어요'))}
  else{b.append(el('div','howdn',`찾은 모습 ${st.found.length} / ${Object.keys(FORMS).length} · 찾은 모습만 색이 켜져요`));
  const d=el('div','dexg');Object.entries(FORMS).forEach(([k,[ic,n,hint]])=>{const has=st.found.includes(k);const r=el('div','dexc'+(has?'':' off'));r.append(formThumb(k,false),el('b',null,`${ic} ${n}`),el('small',null,hint));d.append(r)});b.append(d)}
  if(st.album.length){b.append(el('h3',null,'추억 앨범'));const a=el('div','dex');st.album.forEach(x=>{const r=el('div');r.append(el('span',null,KINDS[x.kind]?KINDS[x.kind][0]:'🐣'),el('span',null,`${x.gen}대째 ${x.name} · ${FORMS[x.form]?FORMS[x.form][1]:''} · ${x.days}일`));a.append(r)});b.append(a)}
  if(stage()===4){
    if(growMin()>=GROW[3]+30)b.append(mk('🥚','동생 알 받기',nextGen,'big'),el('div',null,'지금 친구는 추억 앨범에 남고, 골드와 물건은 그대로예요'));
    else b.append(el('div',null,`어른이 되고 30분 뒤에 동생 알을 받을 수 있어요 (약 ${Math.max(1,Math.round(GROW[3]+30-growMin()))}분 남음)`))}
})}
function nextGen(){
  st.album.push({gen:st.gen,name:st.name,kind:st.kind,form:st.form,days:Math.floor((Date.now()-st.born)/864e5)+1});
  log(`${st.name}가 동생 알을 선물했어요`);
  const keep={gold:st.gold,own:st.own,wear:st.wear,diary:st.diary,album:st.album,found:st.found,shell:st.shell,studyBest:st.studyBest,gallery:st.gallery,gen:st.gen+1};
  st=Object.assign(fresh(),keep);lastStage=0;closeSheet();save();render();say(`${keep.gen}대째 알이에요! 톡톡 눌러 보세요`,5000)}
function shellPick(){sheet('기기 색깔 바꾸기',b=>{const g=el('div','grid three');
  Object.entries(SHELLS).forEach(([k,c])=>{const btn=mk(`<span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${c[0]}"></span>`,c[3],()=>{st.shell=k;paintShell();save();shellPick()});if(st.shell===k)btn.classList.add('on');g.append(btn)});b.append(g)})}
$('bDiary').onclick=diary;$('bDex').onclick=dex;$('bShell').onclick=shellPick;
paintShell();

/* ---------- activities ---------- */
let scene=null;
function setScene(t,d,bg){scene={t,s:Date.now(),d,bg}}
function busy(){return st.asleep?'자고 있어요. 깨운 다음에 해요':st.sick?'아파요! 병원 먼저 가요':st.energy<12?'너무 힘들어요… 재워 주세요':''}
function actMenu(){
  sheet('오늘의 활동',b=>{
    const g=el('div','grid two-col');
    [['🏥','병원 가기','30골드 · 건강 가득',hospital],['🚶','산책 가기','기분·건강 UP',walk],['🏃','운동하기','줄넘기 10초',exercise],
     ['📚','공부하기','문제 풀고 골드',study],['🧹','청소하기','응가·먼지 치우기',cleanRoom],['🍳','요리 교실','순서대로 요리',cooking]]
     .forEach(([ic,n,h,fn])=>g.append(mk(ic,`${n}<br><small>${h}</small>`,()=>{closeSheet();fn()})));
    b.append(g)});
}
function hospital(){
  if(st.asleep)return say('자고 있어요. 깨운 다음에 가요');
  if(st.gold<30)return say(`병원비 30골드가 필요해요 (지금 ${st.gold})`);
  st.gold-=30;goldPop();const was=st.sick;st.sick=false;st.snacks=0;
  setScene('hosp',3200,'hosp');say(was?'의사 선생님: 주사 한 대면 금방 나아요!':'의사 선생님: 건강 검진 해 볼까요?',3200);
  setTimeout(()=>{eff({health:100,happy:was?2:6});if(was)log('병원에서 치료받고 다 나았어요');else log('병원에서 건강 검진을 받았어요');
    say(was?'꾹 참았어요! 칭찬 스티커 받았어요 ⭐':'건강 검진 통과! 튼튼해요 💪',4000);save();render()},3200);render()}
function walk(){
  const w=busy();if(w)return say(w);
  setScene('walk',4200,'grass');say('산책 가요! 룰루랄라~',4200);
  setTimeout(()=>{const r=Math.random(),coin=r<.5?5+Math.floor(Math.random()*11):0;
    st.cnt.walk++;eff({happy:15,love:10,fit:10,water:-10,friend:15,health:6,energy:-10,hunger:-8,clean:-10},coin);bump(1);log(coin?`산책하다 동전 ${coin}골드를 주웠어요`:'산책을 다녀왔어요');
    say(coin?`반짝! 길에서 ${coin}골드를 주웠어요!`:r<.8?'예쁜 꽃을 봤어요 🌼':'친구 강아지랑 인사했어요!',4000);save();render()},4200)}
const WORDS=[['🍎','사과'],['🍌','바나나'],['🍇','포도'],['🐶','강아지'],['🐱','고양이'],['🌸','꽃'],['🚗','자동차'],['✏️','연필'],['🏠','집'],['☀️','해'],['🌙','달'],['⭐','별'],['🐟','물고기'],['🍞','빵'],['🥛','우유'],['🐰','토끼'],['🍓','딸기'],['🎈','풍선'],['📚','책'],['🌳','나무']];
const rnd=n=>Math.floor(Math.random()*n);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
function makeQ(){
  const t=rnd(4);
  if(t===0){const a=1+rnd(9),b=1+rnd(9),ans=a+b;return{q:`${a} + ${b} = ?`,ans:String(ans),opts:nums(ans)}}
  if(t===1){const a=5+rnd(14),b=1+rnd(Math.min(9,a)),ans=a-b;return{q:`${a} − ${b} = ?`,ans:String(ans),opts:nums(ans)}}
  if(t===2){const [ic,w]=WORDS[rnd(WORDS.length)];const others=shuffle(WORDS.filter(x=>x[1]!==w)).slice(0,2).map(x=>x[1]);return{q:`<span class="big">${ic}</span><br>이건 무엇일까요?`,ans:w,opts:shuffle([w,...others])}}
  const n=3+rnd(8),ic=WORDS[rnd(WORDS.length)][0];return{q:`<span class="cnt">${ic.repeat(n)}</span><br>몇 개일까요?`,ans:String(n),opts:nums(n)}
}
function nums(ans){const s=new Set([ans]);while(s.size<3){const v=ans+(rnd(2)?1:-1)*(1+rnd(3));if(v>=0)s.add(v)}return shuffle([...s].map(String))}
function cleanRoom(){
  if(st.asleep)return say('자고 있어요. 깨운 다음에 해요');
  if(st.energy<8)return say('너무 힘들어요… 재워 주세요');
  const had=st.poop;st.poop=0;setScene('clean',2600,null);say(had?'싹싹! 응가를 치워요':'싹싹! 먼지를 털어요',2600);
  setTimeout(()=>{eff({health:had?4+had*3:3,happy:had?8:4,skill:10,energy:-6},5+had*5);bump(1);log(had?`청소해서 응가 ${had}개를 치웠어요`:'방을 깨끗이 청소했어요');
    say('반짝반짝 깨끗한 방!',3500);save();render()},2600);render()}
const RECIPES=[['🥪','샌드위치',[['🍞','빵'],['🥬','양상추'],['🧀','치즈'],['🍅','토마토'],['🍞','빵']],['🥕','당근']],
  ['🍡','과일 꼬치',[['🍓','딸기'],['🍌','바나나'],['🍇','포도']],['🧅','양파']],
  ['🥞','팬케이크',[['🥚','달걀'],['🥛','우유'],['🌾','밀가루'],['🍳','굽기'],['🍯','꿀']],['🐟','생선']],
  ['🍙','주먹밥',[['🍚','밥'],['🧂','소금'],['👐','뭉치기']],['🍫','초콜릿']]];
function cooking(){
  const w=busy();if(w)return say(w);
  const [dish,dn,steps,decoy]=RECIPES[rnd(RECIPES.length)];let i=0;
  const pool=shuffle([...new Map([...steps,decoy].map(x=>[x[1],x])).values()]);
  setScene('cook',9e9,'kitchen');say(`요리 교실: ${dn} 만들기!`,9e9);
  const show=(msg)=>sheet(`요리 교실 ${dish} ${dn}`,b=>{
    const card=el('div','recipe');card.innerHTML=steps.map((s,j)=>`<span class="${j<i?'done':j===i?'now':''}">${s[0]} ${s[1]}</span>`).join('<b>→</b>');
    b.append(el('div',null,'순서대로 눌러요!'),card);
    const g=el('div','grid three');pool.forEach(([ic,n])=>g.append(mk(ic,n,()=>{
      if(n===steps[i][1]){i++;if(i>=steps.length){done();return}show('좋아요! 다음 재료는?')}
      else show(n===decoy[1]?`${ic} ${n}는 ${dn}에 안 들어가요!`:'앗, 순서가 달라요! 레시피를 봐요')})));
    b.append(g,el('div','qmsg',msg||''))},'game');
  const done=()=>{closeSheet();st.cnt.cook++;setScene('cook',2200,'kitchen');scene.dish=dish;fx={t:'eat',s:Date.now(),d:1800};
    eff({hunger:40,happy:10,learn:15,skill:20,friend:10,health:5,energy:-5},10);bump(1);log(`요리 교실에서 ${dn}를 만들었어요`);
    say(`${dish} ${dn} 완성! 냠냠 맛있어요`,4000);if(!st.poopAt&&st.poop<3)st.poopAt=Date.now()+(180+Math.random()*180)*1000;save();render()};
  show()}

/* ---------- meals ---------- */
const RICE=[['🍚','흰쌀밥'],['🌾','잡곡밥'],['🟤','현미밥'],['🍛','볶음밥']];
const SOUP=[['🌿','미역국'],['🫘','된장국'],['🥚','계란국'],['🌱','콩나물국'],['🌶️','김치찌개'],['🥔','감자국']];
const SIDE=[['🍳','계란말이','p'],['🥩','불고기','p'],['🐟','생선구이','p'],['⬜','두부부침','p'],['🌭','소시지','x'],['🍗','닭강정','x'],
 ['🥬','시금치나물','v'],['🌱','콩나물무침','v'],['🥒','오이무침','v'],['🥦','브로콜리','v'],['🌶️','김치','v'],['🟧','깍두기','v'],
 ['🐡','멸치볶음','c'],['🟩','구운 김','c'],['🥔','감자조림','c']];
const FAV={cat:'생선구이',dog:'불고기',rabbit:'시금치나물',bear:'계란말이',chick:'콩나물무침',owl:'멸치볶음',penguin:'생선구이',fish:'구운 김',octopus:'구운 김',turtle:'브로콜리',flamebean:'불고기',dropling:'오이무침',sprout:'시금치나물',starfluff:'계란말이',cloudsheep:'감자조림',candybear:'계란말이',macaroncat:'생선구이',jellyfish:'구운 김',chestnut:'감자조림',unicorn:'계란말이'};
const CUIS=[['🍚','한식'],['🥟','중식'],['🍝','양식'],['🍜','아시안']];
const DISH={한식:[['🌶️','떡볶이','x'],['🍲','김치찌개','b'],['🌭','부대찌개','x'],['🥓','삼겹살','x'],['🥗','비빔밥','v'],['🥩','불고기','b'],['🍙','김밥','b'],['🫘','된장찌개','v'],['🍜','잡채','b'],['🍗','치킨','x']],
 중식:[['🍜','짜장면','x'],['🌶️','짬뽕','b'],['🍖','탕수육','x'],['🍳','볶음밥','b'],['🥟','물만두','b'],['🥚','계란탕','v']],
 양식:[['🍝','토마토 스파게티','b'],['🍕','피자','x'],['🍔','햄버거','x'],['🥩','돈가스','x'],['🍛','오므라이스','b'],['🥗','샐러드','v'],['🥣','크림수프','b']],
 아시안:[['🍣','초밥','b'],['🍜','쌀국수','b'],['🍛','카레라이스','b'],['🥢','팟타이','b'],['🍙','주먹밥','b'],['🍤','튀김우동','x'],['🥟','딤섬','b']]};
let cuis='한식';
function cuisTabs(b,redraw){const r=el('div','ctabs');CUIS.forEach(([ic,n])=>r.append(mk(ic,n,()=>{cuis=n;redraw()},cuis===n?'on':'')));b.append(r)}
function dishSheet(){sheet('🍙 밥 먹기',b=>{cuisTabs(b,dishSheet);
  b.append(el('div','howdn','먹고 싶은 요리를 하나 골라요 · 🥗은 몸에 좋아요, 🍟 표시는 맛있지만 기름져요'));
  const g=el('div','grid meal');DISH[cuis].forEach(([ic,n,t])=>g.append(mk(ic,`${n}${t==='x'?'<br><small>🍟</small>':t==='v'?'<br><small>🥗</small>':''}`,()=>{closeSheet();eatDish(ic,n,t)})));b.append(g)})}
function eatDish(ic,n,t){
  eff({hunger:45,water:/국|탕|짬뽕|우동|쌀국수|수프/.test(n)?15:0,energy:5,health:t==='v'?10:t==='b'?6:-2,happy:t==='x'?14:6});
  fx={t:'eat',s:Date.now(),d:1800};st.teeth=(st.teeth||0)+1;bump(t==='x'?1:2);
  if(!st.poopAt&&st.poop<3)st.poopAt=Date.now()+(180+Math.random()*180)*1000;
  log(`${cuis}: ${n}`);say(t==='x'?`${ic} ${n} 너무 맛있어요! 다음엔 채소도 먹을래요`:t==='v'?`${ic} ${n}! 몸이 가벼워져요 🥗`:`${ic} ${n} 냠냠, 잘 먹었습니다!`,4500);save();render()}
function feed(){
  if(st.hunger>=95)return say('배불러요! 이제 그만~');
  return dishSheet();
  const pick={rice:null,soup:null,sides:[]};const fav=FAV[st.kind]||'계란말이';
  const draw2=()=>sheet('🍙 밥 먹기',b=>{cuisTabs(b,()=>cuis==='한식'?draw2():dishSheet());
    b.append(el('div','howdn',`${st.name}가 좋아하는 반찬: ${fav} · 반찬은 3개까지`));
    const sec=(title,list,key,multi)=>{b.append(el('h3',null,title));const g=el('div','grid meal');
      list.forEach(([ic,n])=>{const on=multi?pick.sides.includes(n):pick[key]===n;
        const bt=mk(ic,n,()=>{if(multi){if(on)pick.sides=pick.sides.filter(x=>x!==n);else if(pick.sides.length<3)pick.sides.push(n);else{say('반찬은 3개까지예요!');return}}else pick[key]=on?null:n;draw2()},on?'on':'');g.append(bt)});b.append(g)};
    sec('밥 (1개)',RICE,'rice');sec('국 (1개)',SOUP,'soup');sec(`반찬 (${pick.sides.length}/3)`,SIDE,'sides',true);
    const tray=el('div','tray');tray.textContent=[pick.rice,pick.soup,...pick.sides].filter(Boolean).join(' · ')||'아직 고른 게 없어요';b.append(tray);
    const r=el('div','row');
    r.append(mk('🎲','골고루 추천',()=>{pick.rice=RICE[rnd(4)][1];pick.soup=SOUP[rnd(6)][1];const P=SIDE.filter(x=>x[2]==='p'),V=SIDE.filter(x=>x[2]==='v'),C=SIDE.filter(x=>x[2]==='c');pick.sides=[P[rnd(P.length)][1],V[rnd(V.length)][1],C[rnd(C.length)][1]];draw2()}),
      mk('😋','먹기',()=>{if(!pick.rice){say('밥을 먼저 골라요!');return}closeSheet();eatMeal(pick,fav)},'big'));
    b.append(r)});
  draw2()}
function eatMeal(m,fav){
  const cats=m.sides.map(n=>SIDE.find(x=>x[1]===n)[2]);
  const hasP=cats.includes('p'),hasV=cats.includes('v'),junk=cats.filter(c=>c==='x').length;
  let score=1+(m.soup?1:0)+(hasP?1:0)+(hasV?1:0)+(new Set(cats).size>=2?1:0);
  const starving=st.hunger<30,isFav=m.sides.includes(fav);
  eff({hunger:30+m.sides.length*5+(m.soup?5:0),water:m.soup?15:0,energy:5,health:score*2-junk*3+(starving?2:0),happy:(isFav?12:3)+junk*3});
  fx={t:'eat',s:Date.now(),d:1800};st.teeth=(st.teeth||0)+1;bump(score>=4?2:1);
  if(!st.poopAt&&st.poop<3)st.poopAt=Date.now()+(180+Math.random()*180)*1000;
  log(`식단: ${[m.rice,m.soup,...m.sides].filter(Boolean).join(', ')}`);
  say(score>=5&&!junk?'골고루 먹었어요! 몸이 튼튼해져요 💪':!hasV?'맛있다! 다음엔 채소도 먹을래요 🥦':!hasP?'냠냠! 고기나 생선, 두부도 먹고 싶어요':junk>=2?'맛있지만 기름진 반찬이 많아요':isFav?`우와 ${fav}! 제일 좋아해요 😍`:'냠냠, 잘 먹었습니다!',4500);
  save();render()}

/* ---------- more games ---------- */
function playDone(name,detail,gold,extra){st.plays++;
  st.cnt.play=(st.cnt.play||0)+1;eff(Object.assign({happy:10,learn:15,love:5,friend:5,energy:-10,hunger:-5,clean:-4},extra||{}),gold);
  fx={t:'heart',s:Date.now(),d:1800};bump(2);log(`${name}: ${detail}, 골드 ${gold}`);say(`${detail}! 골드 🪙${gold} 벌었어요!`,4500);save();render()}
function hideSeek(){
  let round=0,found=0;const spots=[['🌳','나무 뒤'],['📦','상자 안'],['🛋️','소파 밑'],['🌷','꽃밭'],['🚪','문 뒤']];
  const ic=(KINDS[st.kind]||['🐣'])[0];
  const show=msg=>{const opts=shuffle(spots.slice()).slice(0,3),ans=rnd(3);
    sheet(`숨바꼭질 ${round+1} / 3`,b=>{b.append(el('div','quiz',`${ic} 어디 숨었을까?`));const g=el('div','grid three');let lock=false;
      opts.forEach(([e,n],i)=>{const bt=mk(e,n,()=>{if(lock)return;lock=true;const ok=i===ans;if(ok)found++;bt.classList.add(ok?'ok':'no');
        [...g.children][ans].innerHTML=`<span class="ic">${ic}</span>여기!`;msgEl.textContent=ok?'찾았다! 🎉':`아쉬워요, ${opts[ans][1]}에 있었어요`;
        setTimeout(()=>{round++;if(round<3)show();else{closeSheet();playDone('숨바꼭질',`3번 중 ${found}번 찾았어요`,found*10,{smart:found*2})}},ok?900:1500)},'qbtn');g.append(bt)});
      const msgEl=el('div','qmsg',msg||'');b.append(g,msgEl)},'game')};
  show()}
function rps(){
  let round=0,win=0,draw0=0;const H=[['✊','바위'],['✌️','가위'],['✋','보']];
  const show=msg=>sheet(`가위바위보 ${round+1} / 5`,b=>{b.append(el('div','quiz',`${(KINDS[st.kind]||['🐣'])[0]} 가위바위보!`));
    const g=el('div','grid three');let lock=false;const m=el('div','qmsg',msg||'');
    H.forEach(([e,n],i)=>g.append(mk(e,n,()=>{if(lock)return;lock=true;const p=rnd(3),r=(i-p+3)%3;
      if(r===0){draw0++;m.textContent=`${H[p][0]} 비겼어요!`}else if(r===2){win++;m.textContent=`${H[p][0]} 이겼어요! 🎉`}else m.textContent=`${H[p][0]} 졌어요~`;
      setTimeout(()=>{round++;if(round<5)show();else{closeSheet();playDone('가위바위보',`5번 중 ${win}번 이겼어요`,win*8+draw0*3)}},1100)},'qbtn')));
    b.append(g,m)},'game');
  show()}
function memory(){
  const pool=shuffle(['🍎','🐶','⭐','🎈','🍓','🐟','🌸','🚗']).slice(0,6);const cards=shuffle([...pool,...pool].map((e,i)=>({e,i,open:false,done:false})));
  let first=null,tries=0,lock=false,left=6;
  const show=msg=>sheet('짝 맞추기',b=>{b.append(el('div','howdn',`같은 그림 2장을 찾아요 · ${tries}번 뒤집었어요`));
    const g=el('div','grid');cards.forEach(c=>{const bt=mk(c.open||c.done?c.e:'❓','',()=>{if(lock||c.open||c.done)return;c.open=true;
      if(!first){first=c;show();return}tries++;
      if(first.e===c.e){first.done=c.done=true;first=null;left--;if(!left){show('다 찾았어요! 🎉');setTimeout(()=>{closeSheet();const gold=Math.max(10,60-tries*3);playDone('짝 맞추기',`${tries}번 만에 다 맞췄어요`,gold,{smart:15})},900);return}show('짝꿍 찾았다!')}
      else{lock=true;show('다시 찾아봐요');setTimeout(()=>{first.open=c.open=false;first=null;lock=false;show()},900)}},'mem'+(c.done?' ok':''));g.append(bt)});
    b.append(g,el('div','qmsg',msg||''))},'game');
  show()}
function startPop(){
  game={type:'pop',items:[],score:0,end:Date.now()+15000,t:0};say('풍선을 톡톡 터뜨려요!',9e9);render();
  const COL=['#ff6b6b','#ffb648','#7bd97b','#62b0ff','#b085ff','#ff8fb0'];
  game.iv=setInterval(()=>{if(!game||game.type!=='pop')return;game.t++;const left=Math.ceil((game.end-Date.now())/1000);
    if(game.t%5===0)game.items.push({x:8+Math.random()*56,y:58,v:.8+Math.random()*.8,c:COL[rnd(6)]});
    game.items.forEach(it=>it.y-=it.v);game.items=game.items.filter(it=>it.y>-8);
    say(`🎈 ${game.score}개 · ${Math.max(0,left)}초`,9e9);draw();
    if(left<=0){clearInterval(game.iv);const sc=game.score;game=null;playDone('풍선 터뜨리기',`풍선 ${sc}개를 터뜨렸어요`,sc*3)}},120)}
function popAt(e){const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
  const i=game.items.findIndex(it=>Math.abs(it.x-x)<6&&Math.abs(it.y-y)<7);if(i>=0){game.items.splice(i,1);game.score++;draw()}}

/* ---------- v11: snacks, wash, sleep, exercise, study, room ---------- */
const SNACKS=[['🍪','쿠키','s'],['🍫','초콜릿','s'],['🍬','사탕','s'],['🍭','막대사탕','s'],['🍩','도넛','s'],['🧁','컵케이크','s'],['🍰','케이크','s'],['🍦','아이스크림','s'],['🍮','푸딩','s'],['🍿','팝콘','s'],['🥨','프레첼','s'],['🧃','주스','s'],
 ['🍎','사과','f'],['🍓','딸기','f'],['🍌','바나나','f'],['🍇','포도','f'],['🍉','수박','f'],['🥛','우유','f'],['🥕','당근 스틱','f'],['🍠','군고구마','f']];
function snack(){
  sheet('🍭 간식 고르기',b=>{
    b.append(el('div','howdn','달콤한 간식은 기분이 확 좋아지지만 많이 먹으면 배탈 나고 이가 썩어요. 과일·우유는 건강에 좋아요!'));
    b.append(el('h3',null,'달콤한 간식'));let g=el('div','grid meal');SNACKS.filter(x=>x[2]==='s').forEach(x=>g.append(mk(x[0],x[1],()=>{closeSheet();eatSnack(x)})));b.append(g);
    b.append(el('h3',null,'건강 간식'));g=el('div','grid meal');SNACKS.filter(x=>x[2]==='f').forEach(x=>g.append(mk(x[0],x[1],()=>{closeSheet();eatSnack(x)})));b.append(g)})}
function eatSnack([ic,n,t]){
  fx={t:'eat',snack:true,s:Date.now(),d:1800};
  if(t==='f'){eff({happy:8,hunger:8,health:3,water:['우유','수박'].includes(n)?20:0});say(`${ic} ${n} 냠냠! 몸에 좋아요`);save();render();return}
  st.snacks++;st.snacksTotal++;st.teeth=(st.teeth||0)+1;const over=st.snacks>=3;
  eff({happy:over?5:15,hunger:5,water:n==='주스'?15:0,health:over?-15:-3});
  if(st.snacks>=4&&!st.sick){save();render();return getSick('간식을 너무 많이 먹어서')}
  say(over?'간식은 그만! 건강이 나빠져요':`${ic} ${n} 달콤해요! 양치도 잊지 마요`,over?5000:3500);save();render()}
function wash(){
  sheet('🫧 씻기',b=>{const g=el('div','grid three');
    g.append(mk('🚿','샤워<br><small>빠르게 깨끗</small>',()=>{closeSheet();shower()}),mk('🛁','목욕<br><small>깨끗·기분 최고</small>',()=>{closeSheet();bath()}),mk('🪥','양치<br><small>이 튼튼</small>',()=>{closeSheet();brush()}));
    b.append(g);if((st.teeth||0)>=3)b.append(el('div','howdn','이가 끈적해요! 양치할 시간이에요'))})}
function shower(){if(st.clean>=95)return say('벌써 반짝반짝해요!');st.cnt.wash++;eff({clean:70,happy:3,energy:-2});fx={t:'bubble',s:Date.now(),d:1500};bump(1);say('쏴아~ 샤워 개운해요!');save();render()}
function bath(){if(st.clean>=95)return say('벌써 반짝반짝해요!');setScene('bath',3000,null);say('첨벙첨벙 목욕 시간!',3000);
  setTimeout(()=>{st.cnt.wash++;eff({clean:100,happy:8,love:3,health:3,energy:-5});bump(1);log('목욕을 했어요');say('목욕하니까 기분 최고!',3500);save();render()},3000);render()}
function brush(){const was=st.teeth||0;st.teeth=0;fx={t:'brush',s:Date.now(),d:1600};eff({health:was>=3?6:3,clean:5});say(was>=3?'치카치카! 충치 세균 물러가라!':'치카치카 반짝반짝!');save();render()}
function sleep(){
  sheet('🌙 재우기',b=>{const g=el('div','grid two-col');
    g.append(mk('😴','낮잠<br><small>1분 · 힘 +4칸</small>',()=>{closeSheet();goSleep(true)}),mk('🌙','밤잠<br><small>힘이 가득 찰 때까지</small>',()=>{closeSheet();goSleep(false)}));b.append(g)})}
function goSleep(nap){if(st.energy>=90)return say('아직 안 졸려요!');st.asleep=true;st.napUntil=nap?Date.now()+60000:0;eff({happy:2});
  say(nap?'낮잠 잘게요… 쿨쿨 (1분)':'잘 자요… 쿨쿨 (자는 동안 힘·건강이 차요)',4000);save();render()}

const EXS=[['🪢','줄넘기','jump',null],['🏃','달리기','run','grass'],['🏊','수영','swim','sea'],['⚽','축구','ball','grass'],['🚲','자전거','bike','grass'],['⭕','훌라후프','hoop',null],['🥋','태권도','kick',null],['🧘','스트레칭','yoga',null]];
function exercise(){
  const w=busy();if(w)return say(w);
  sheet('🏃 무슨 운동 할까요?',b=>{const g=el('div','grid');EXS.forEach((x,i)=>g.append(mk(x[0],x[1],()=>{closeSheet();startEx(i)})));b.append(g,el('div','howdn','10초 동안 버튼을 톡톡 누를수록 운동을 많이 해요'))})}
function startEx(i){
  const [ic,n,ex,bg]=EXS[i];game={type:'jump',ex,ic,n,count:0,end:Date.now()+10000,last:0};if(bg)setScene('ex',10400,bg);
  say(`${ic} ${n}! 톡톡 많이 눌러요 (10초)`,9e9);render();
  game.iv=setInterval(()=>{if(!game||game.type!=='jump')return;const left=Math.ceil((game.end-Date.now())/1000);
    say(`${ic} ${game.count}번 · ${Math.max(0,left)}초`,9e9);draw();
    if(left<=0){clearInterval(game.iv);const c=game.count,gold=Math.min(30,Math.floor(c/2));game=null;scene=null;st.plays++;st.cnt.ex++;
      const ext=ex==='yoga'?{happy:10,health:6,energy:-5}:ex==='swim'?{clean:20}:{};
      eff(Object.assign({learn:10,health:Math.min(20,4+Math.floor(c/2)),fit:Math.min(40,10+c),happy:5,energy:-15,hunger:-10,clean:-6},ext),gold);bump(1);log(`${n} ${c}번 했어요`);
      say(`${n} ${c}번! 몸이 튼튼해졌어요`,4500);save();render()}},200)}
function exDraw(phase,cx,base){
  const ex=game.ex,up=Date.now()-game.last<220;
  if(phase==='pre'){
    if(ex==='jump'){base=up?44:51;for(let x=14;x<=58;x++){const t=(x-36)/22;px(x,up?52:Math.round(46-(1-t*t)*24),PINK)}}
    else if(ex==='run')cx=10+(game.count*2)%52;
    else if(ex==='bike'){cx=10+(game.count*2)%52;base=45}
    else if(ex==='kick'||ex==='ball')base=up?48:51;
    else if(ex==='yoga')rc(16,50,40,3,'#b085ff');
    return [cx,base]}
  if(ex==='bike'){[-6,6].forEach(d=>{E(cx+d,49,3.5,3.5,OUT);E(cx+d,49,2.5,2.5,'#cfe9ff');px(cx+d,49,OUT)});rc(cx-6,45,12,1,RED)}
  if(ex==='ball'){const bx=up?cx+18:cx+10,by=up?36:48;OE(bx,by,2.4,2.4,WH);px(bx,by,OUT);px(bx-1,by+1,OUT)}
  if(ex==='hoop'){for(let x=-15;x<=15;x++){const yy=Math.round(Math.sqrt(1-(x/15)**2)*2.5);px(cx+x,40+((f%2)?yy:-yy),PINK);px(cx+x,40+((f%2)?yy:-yy)+1,'#ff6b9a')}}
  if(ex==='swim'){for(let x=0;x<W;x++)px(x,44+((x+f)%4<2?0:1),'#3fa2e8');rc(0,46,W,8,'#7cc8ff')}
  if(ex==='kick'){rc(cx-8,44,16,1,OUT);if(up){star(cx+14,38,GOLD);star(cx+17,35,'#ffe45c')}}
  if(ex==='run'&&f%2){px(cx-12,48,'#c9d2dd');px(cx-14,47,'#c9d2dd')}
  return [cx,base]}
function jumpTap(){if(!game||game.type!=='jump')return;game.count++;game.last=Date.now();draw()}

/* ----- study: 4 subjects x 3 levels ----- */
const ENG=[['🍎','apple','사과'],['🍌','banana','바나나'],['🐶','dog','강아지'],['🐱','cat','고양이'],['🐟','fish','물고기'],['🚗','car','자동차'],['☀️','sun','해'],['🌙','moon','달'],['⭐','star','별'],['📚','book','책'],['🌳','tree','나무'],['🥛','milk','우유'],['🥚','egg','달걀'],['🐦','bird','새'],['⚽','ball','공'],['🏠','house','집']];
const COLORS=[['🟥','red'],['🟦','blue'],['🟨','yellow'],['🟩','green'],['🟧','orange'],['🟪','purple'],['⬛','black'],['⬜','white']];
const NUMS=['one','two','three','four','five','six','seven','eight','nine','ten'];
const OPP=[['크다','작다'],['길다','짧다'],['많다','적다'],['높다','낮다'],['빠르다','느리다'],['덥다','춥다'],['밝다','어둡다'],['무겁다','가볍다'],['넓다','좁다'],['기쁘다','슬프다'],['깨끗하다','더럽다'],['들어가다','나오다']];
const LIVE=[['🐟','물속'],['🐙','물속'],['🐬','물속'],['🦀','물속'],['🐳','물속'],['🐶','땅'],['🐰','땅'],['🐻','땅'],['🐘','땅'],['🦁','땅'],['🐦','하늘'],['🦅','하늘'],['🦋','하늘']];
const SEASON=[['⛄','겨울'],['🎄','겨울'],['🌸','봄'],['🌷','봄'],['🍉','여름'],['🏖️','여름'],['🍁','가을'],['🌰','가을']];
const LIFE=[['🔴 빨간불이 켜지면?','멈춰요',['건너요','뛰어요']],['🟢 초록불이 켜지면?','건너요',['멈춰요','누워요']],['🍚 밥 먹기 전에는?','손 씻기',['낮잠 자기','뛰기']],['🔥 불이 나면 몇 번?','119',['112','114']],
 ['🐶 강아지 소리는?','멍멍',['야옹','꿀꿀']],['🐱 고양이 소리는?','야옹',['멍멍','음메']],['🐔 닭 소리는?','꼬끼오',['개굴개굴','짹짹']],['🦷 이를 튼튼하게 하려면?','양치하기',['사탕 먹기','늦게 자기']],['🚸 길을 건널 때는?','횡단보도로',['아무 데서나','뛰어서']]];
const pickOpts=(ans,pool)=>shuffle([ans,...shuffle(pool.filter(x=>x!==ans)).slice(0,2)]);
const SUBJ={
 math:['🔢','수학',['10까지 더하기·빼기','20까지 더하기·빼기','두 자리 수 계산'],lv=>{
   if(lv===1){const t=rnd(3);if(t===0){const a=1+rnd(9),b=1+rnd(10-a);return{q:`${a} + ${b} = ?`,ans:String(a+b),opts:nums(a+b)}}
     if(t===1){const a=2+rnd(9),b=1+rnd(a);return{q:`${a} − ${b} = ?`,ans:String(a-b),opts:nums(a-b)}}
     const n=3+rnd(8),ic=WORDS[rnd(WORDS.length)][0];return{q:`<span class="cnt">${ic.repeat(n)}</span><br>몇 개일까요?`,ans:String(n),opts:nums(n)}}
   if(lv===2){if(rnd(2)){const a=2+rnd(8),b=10-a+rnd(a),s=a+b;return{q:`${a} + ${b} = ?`,ans:String(s),opts:nums(s)}}const a=11+rnd(8),b=a-9+rnd(9-(a-10)>0?9-(a-10)+1:1),r=a-b;return{q:`${a} − ${b} = ?`,ans:String(r),opts:nums(r)}}
   const t=rnd(3);if(t===0){const a=10+rnd(80),b=1+rnd(9-(a%10)||1);return{q:`${a} + ${b} = ?`,ans:String(a+b),opts:nums(a+b)}}
   if(t===1){const a=(2+rnd(8))*10,b=(1+rnd(a/10-1))*10;return{q:`${a} − ${b} = ?`,ans:String(a-b),opts:shuffle([a-b,a-b+10,Math.max(0,a-b-10)===a-b?a-b+20:a-b-10].map(String))}}
   let a=10+rnd(90),b=10+rnd(90);if(a===b)b++;return{q:`더 큰 수는?<br>${a} 와 ${b}`,ans:String(Math.max(a,b)),opts:shuffle([String(a),String(b)])}}],
 kor:['🇰🇷','국어',['그림 보고 낱말','빈칸 글자 채우기','반대말 찾기'],lv=>{
   if(lv===1){const [ic,w]=WORDS[rnd(WORDS.length)];return{q:`<span class="big">${ic}</span><br>이건 무엇일까요?`,ans:w,opts:pickOpts(w,WORDS.map(x=>x[1]))}}
   if(lv===2){const multi=WORDS.filter(x=>x[1].length>=2),[ic,w]=multi[rnd(multi.length)],i=rnd(w.length),ch=w[i];const all=[...new Set(WORDS.map(x=>x[1]).join('').split(''))];
     return{q:`<span class="big">${ic}</span><br>${w.slice(0,i)}<u>&nbsp;?&nbsp;</u>${w.slice(i+1)}`,ans:ch,opts:pickOpts(ch,all)}}
   const [a,b]=OPP[rnd(OPP.length)],flip=rnd(2),q=flip?b:a,ans=flip?a:b;return{q:`'${q}'의 반대말은?`,ans,opts:pickOpts(ans,OPP.flat())}}],
 eng:['🔤','영어',['그림 보고 영어 단어','색깔·숫자 영어','영어 뜻 맞히기'],lv=>{
   if(lv===1){const [ic,e]=ENG[rnd(ENG.length)];return{q:`<span class="big">${ic}</span><br>영어로 뭘까요?`,ans:e,opts:pickOpts(e,ENG.map(x=>x[1]))}}
   if(lv===2){if(rnd(2)){const [ic,c]=COLORS[rnd(COLORS.length)];return{q:`<span class="big">${ic}</span><br>무슨 색일까요?`,ans:c,opts:pickOpts(c,COLORS.map(x=>x[1]))}}const n=rnd(10);return{q:`<span class="big">${n+1}</span><br>영어로 뭘까요?`,ans:NUMS[n],opts:pickOpts(NUMS[n],NUMS)}}
   const [,e,k]=ENG[rnd(ENG.length)];return{q:`<span class="big" style="font-size:2.4rem">${e}</span><br>무슨 뜻일까요?`,ans:k,opts:pickOpts(k,ENG.map(x=>x[2]))}}],
 life:['🌱','슬기로운 생활',['어디에 살까요?','무슨 계절일까요?','생활 안전·상식'],lv=>{
   if(lv===1){const [ic,p]=LIVE[rnd(LIVE.length)];return{q:`<span class="big">${ic}</span><br>어디에 살까요?`,ans:p,opts:shuffle(['물속','땅','하늘'])}}
   if(lv===2){const [ic,s]=SEASON[rnd(SEASON.length)];return{q:`<span class="big">${ic}</span><br>어느 계절일까요?`,ans:s,opts:pickOpts(s,['봄','여름','가을','겨울'])}}
   const [q,a,o]=LIFE[rnd(LIFE.length)];return{q,ans:a,opts:shuffle([a,...o])}}]};
function study(){
  const w=busy();if(w)return say(w);st.studyBest=st.studyBest||{};
  sheet('📚 무슨 공부 할까요?',b=>{const g=el('div','grid two-col');
    Object.entries(SUBJ).forEach(([k,[ic,n]])=>g.append(mk(ic,n,()=>pickLevel(k))));b.append(g)})}
function pickLevel(k){const [ic,n,lvs]=SUBJ[k];
  sheet(`${ic} ${n} 단계 고르기`,b=>{lvs.forEach((d,i)=>{const best=st.studyBest[k+(i+1)];const stars=best==null?'':' '+'⭐'.repeat(best===5?3:best>=3?2:best>=1?1:0);
    b.append(mk('',`${i+1}단계 · ${d}<br><small>맞힐 때마다 🪙${(i+1)*10}${best!=null?` · 최고 ${best}/5${stars}`:''}</small>`,()=>runStudy(k,i+1),'big lvl'))})})}
function runStudy(k,lv){
  const [ic,n,,gen]=SUBJ[k];const qs=[];let guard=0;while(qs.length<5&&guard++<50){const q=gen(lv);if(q.opts.includes(q.ans)&&!qs.some(x=>x.q===q.q))qs.push(q)}
  let i=0,right=0,locked=false;setScene('study',9e9,null);say(`${n} ${lv}단계 열공 중! ✏️`,9e9);
  const show=()=>sheet(`${ic} ${n} ${lv}단계 · ${i+1} / 5`,b=>{
    const q=qs[i];b.append(Object.assign(el('div','quiz'),{innerHTML:q.q}));
    const g=el('div','grid '+(q.opts.length===2?'two-col':'three'));const msg=el('div','qmsg','');
    q.opts.forEach(o=>{const btn=mk('',o,()=>{if(locked)return;locked=true;const ok=o===q.ans;if(ok)right++;
      btn.classList.add(ok?'ok':'no');msg.textContent=ok?'딩동댕! 맞았어요 🎉':`아쉬워요! 정답은 "${q.ans}" 이에요`;
      setTimeout(()=>{locked=false;i++;if(i<qs.length)show();else finish()},ok?900:1700)},'qbtn');g.append(btn)});
    b.append(g,msg)},'game');
  const finish=()=>{closeSheet();scene=null;st.plays++;st.cnt.study++;const key=k+lv;st.studyBest[key]=Math.max(st.studyBest[key]||0,right);
    eff({happy:4+right*3,learn:right*6,smart:right*lv*4,energy:-6,hunger:-4},right*lv*10);bump(1);log(`${n} ${lv}단계: 5문제 중 ${right}개 맞혔어요`);
    say(right===5?`${n} ${lv}단계 만점! ⭐⭐⭐`:`5문제 중 ${right}개! 잘했어요`,5000);save();render()};
  show()}

/* ----- room interior ----- */
const WALLS={wall_pink:'#ffe4ec',wall_sky:'#e2f1ff',wall_mint:'#ddf7ec',wall_yellow:'#fff4c9'};
const FLOORS={floor_wood:['#f3dcc0','#e8c9a6'],floor_carpet:['#d9c8ff','#c7b3f5'],floor_tile:['#eef1f5','#d5dbe3']};
function drawRoom(){
  rc(0,0,W,H,WALLS[st.wear.wall]||'#fff6e6');
  rc(8,8,12,9,'#bfe3ff');rc(8,8,12,1,'#e8c9a6');rc(8,16,12,1,'#e8c9a6');rc(8,8,1,9,'#e8c9a6');rc(19,8,1,9,'#e8c9a6');rc(13,8,1,9,'#e8c9a6');
  const fl=FLOORS[st.wear.floor]||FLOORS.floor_wood;rc(0,46,W,8,fl[0]);for(let x=0;x<W;x+=9)rc(x,46,1,8,fl[1]);if(st.wear.floor==='floor_tile')rc(0,50,W,1,fl[1]);
  const gl=st.gallery&&st.gallery[st.gallery.length-1];if(gl){rc(27,6,12,12,'#b5793f');rc(28,7,10,10,WH);gl.forEach((c,i)=>{if(c)px(29+i%8,8+Math.floor(i/8),c)})}
  const fu=st.wear.furn||[];
  if(fu.includes('shelf')){rc(46,8,16,16,'#c98a4b');rc(47,9,14,6,'#e9c79f');rc(47,16,14,7,'#e9c79f');['#ff7a7a','#62b0ff','#7bd97b','#ffb648'].forEach((c,i)=>rc(48+i*3,10,2,5,c));OE(56,20,1.5,1.5,GOLD)}
  if(fu.includes('lamp')){rc(66,26,1,20,OUT);rc(63,22,7,4,GOLD);rc(64,46,5,1,OUT);if(st.asleep)E(66,30,5,4,'rgba(255,230,120,.35)')}
  if(fu.includes('rug'))E(36,51,18,2.5,'#ffb3c6');
  if(fu.includes('bed')){rc(1,38,18,8,'#b5793f');rc(2,36,16,6,'#ffd6e0');rc(2,35,5,3,WH);rc(1,34,2,12,'#8a5a2f')}
  if(fu.includes('plant')){rc(62,40,7,6,'#d9844a');E(65.5,35,4,4,'#5cc45c');E(63,32,2,3,'#7bd97b');E(68,33,2,2.5,'#4fb36b')}
  if(fu.includes('teddy')){OE(24,44,2.6,2.4,'#c98a4b');OE(24,40,2,1.8,'#c98a4b');px(23,40,OUT);px(25,40,OUT);E(22.5,38.5,.8,.8,'#c98a4b');E(25.5,38.5,.8,.8,'#c98a4b')}
}

function shop(){
  sheet('톡톡 가게',b=>{
    b.append(el('div','stars',`내 골드 🪙 ${st.gold}`),el('div',null,'놀이·공부·운동·청소로 골드를 모아요'));
    SHOPCAT.forEach(([cat,slots])=>{b.append(el('h3',null,cat));const g=el('div','grid three');
      Object.entries(ITEMS).filter(([,it])=>slots.includes(it.slot)&&it.p>0).forEach(([id,it])=>{const own=st.own.includes(id);
        const btn=mk(it.ic,`${it.n}<br><small>${own?'샀어요':'🪙 '+it.p}</small>`,()=>{
          if(st.own.includes(id))return;if(st.gold<it.p){say(`골드가 ${it.p-st.gold} 더 필요해요!`);return}
          st.gold-=it.p;goldPop();st.own.push(id);log(`가게에서 ${it.n}를 샀어요`);
          if(it.slot==='furn'){if(!st.wear.furn.includes(id))st.wear.furn.push(id)}else st.wear[it.slot]=id;
          fx={t:'heart',s:Date.now(),d:1500};save();hearts();shop();say(`${it.n} 샀어요! 바로 꾸몄어요`)});
        if(own)btn.classList.add('on');g.append(btn)});b.append(g)})})}
const DRESS={pet:['💄 꾸미기',['head','face','neck','makeup'],'머리·얼굴·목·화장을 꾸며요'],home:['🏠 집 꾸미기',['bg','wall','floor','furn'],'배경마다 놓을 수 있는 물건이 달라요']};
let pendingBuy=null,placeTab=null;
function dressPreview(){const cv=$('cv'),c=document.createElement('canvas');c.className='dprev';c.width=cv.width;c.height=cv.height;
  const sv=st.wear,t=pendingBuy&&ITEMS[pendingBuy];st.wear=Object.assign({},sv,{furn:[...(sv.furn||[])],deco:[...(sv.deco||[])]});
  if(t){if(t.slot==='furn'||t.slot==='deco'){if(!st.wear[t.slot].includes(pendingBuy))st.wear[t.slot].push(pendingBuy);if(t.bg)st.wear.bg=t.bg}else st.wear[t.slot]=pendingBuy}
  try{draw();c.getContext('2d').drawImage(cv,0,0)}catch(e){}st.wear=sv;try{draw()}catch(e){}
  const w=el('div','dprevw');w.append(c,el('div','dprevt',t?`👀 ${t.n} 입어 보는 중 · 한 번 더 누르면 사요 (🪙${t.p})`:'✨ 지금 내 모습'));return w}
function dressOf(cat){
  const [title,slots,tip]=DRESS[cat];const sh=$('m').querySelector('.sheet'),keep=$('m').hidden?0:sh.scrollTop;
  sheet(title,b=>{
    b.append(dressPreview(),el('div','stars',`내 골드 🪙 ${st.gold}`),el('div','howdn',`눌러 보면 위 그림에 바로 보여요 · 안 가진 건 한 번 더 누르면 사요 · ${tip}`));
    if(cat==='home'){const g=el('div','grid three');const on=!st.wear.bg;const bt=mk('🏠','우리 방',()=>{st.wear.bg=null;pendingBuy=null;placeTab='room';save();dressOf(cat)},on?'on':'');b.append(el('h3',null,'배경'));g.append(bt);
      Object.entries(ITEMS).filter(([,it])=>it.slot==='bg').forEach(([id,it])=>g.append(itemBtn(cat,id,it)));b.append(g);
      if(placeTab==null)placeTab=st.wear.bg||'room';
      b.append(el('h3',null,'🪄 배경마다 놓을 물건'));const tb=el('div','ctabs five');[['room','🏠','우리 방'],['grass','🌱','풀밭'],['sea','🌊','바다'],['sky','☁️','하늘'],['night','🌙','별밤']].forEach(([k,i2,l])=>tb.append(mk(i2,l,()=>{placeTab=k;pendingBuy=null;dressOf(cat)},placeTab===k?'on':'')));b.append(tb);
      if(placeTab!=='room'){const pb=ITEMS[placeTab],ownBg=st.own.includes(placeTab);
        b.append(el('div','howdn',ownBg?(st.wear.bg===placeTab?`지금 ${pb.n} 배경이에요. 여러 개를 함께 놓을 수 있어요`:`물건을 누르면 ${pb.n} 배경으로 바뀌어요`):`${pb.n} 배경을 사면 이 물건들이 보여요 (눌러서 미리보기는 돼요)`));
        const g2=el('div','grid three');Object.entries(ITEMS).filter(([,it])=>it.slot==='deco'&&it.bg===placeTab).forEach(([id,it])=>g2.append(itemBtn(cat,id,it)));b.append(g2);sh.scrollTop=keep;return}}
    slots.filter(sl=>sl!=='bg').forEach(sl=>{b.append(el('h3',null,SLOTS[sl]));const g=el('div','grid three');
      Object.entries(ITEMS).filter(([,it])=>it.slot===sl&&it.p>0).forEach(([id,it])=>g.append(itemBtn(cat,id,it)));b.append(g)})});sh.scrollTop=keep;fitSheet()}
function itemBtn(cat,id,it){
  const sl=it.slot,multi=sl==='furn'||sl==='deco';if(multi&&!st.wear[sl])st.wear[sl]=[];const own=st.own.includes(id),on=multi?st.wear[sl].includes(id):st.wear[sl]===id;
  const sub=own?(on?'쓰는 중':'가지고 있어요'):(pendingBuy===id?'한 번 더 누르면 사요!':'🪙 '+it.p);
  const bt=mk(it.ic,`${it.n}<br><small>${sub}</small>`,()=>{
    if(own){if(sl==='bg')placeTab=on?'room':id;if(multi)st.wear[sl]=on?st.wear[sl].filter(x=>x!==id):[...st.wear[sl],id];else st.wear[sl]=on?null:id;if(it.bg&&!on&&st.own.includes(it.bg))st.wear.bg=it.bg;pendingBuy=null;save();dressOf(cat);return}
    if(it.slot==='bg')placeTab=id;
    if(pendingBuy!==id){pendingBuy=id;dressOf(cat);return}
    if(st.gold<it.p){pendingBuy=null;say(`골드가 ${it.p-st.gold} 더 필요해요!`);dressOf(cat);return}
    st.gold-=it.p;goldPop();st.own.push(id);pendingBuy=null;log(`${it.n}를 샀어요`);
    if(multi)st.wear[sl].push(id);else st.wear[sl]=id;if(it.bg&&st.own.includes(it.bg))st.wear.bg=it.bg;fx={t:'heart',s:Date.now(),d:1500};save();hearts();say(`${it.n} 샀어요! 바로 꾸몄어요`);dressOf(cat)},
    (on?'on':'')+(!own?' lock':'')+(pendingBuy===id?' pend':''));
  return bt}
function heartBuy(k,full){const [,ic,n]=STATS.find(x=>x[0]===k);const miss=Math.ceil((100-st[k])/10);if(miss<=0){say(`${n}은 벌써 가득해요!`);return false}
  const cost=full?miss*7:20;if(st.gold<cost){say(`골드가 ${cost-st.gold} 더 필요해요!`);return false}
  st.gold-=cost;goldPop();const b=st[k];st[k]=clamp(full?100:st[k]+30);const c=$('chips');c.innerHTML='';c.append(el('span','',`${ic}+${Math.round((st[k]-b)/10)}칸`),el('span','dn',`🪙-${cost}`));c.style.opacity=1;clearTimeout(chipT);chipT=setTimeout(()=>c.style.opacity=0,2600);
  fx={t:'heart',s:Date.now(),d:1500};log(`골드 ${cost}로 ${n} 하트를 샀어요`);say(`${ic} ${n} 하트 충전! 고마워요 💕`);save();hearts();return true}
function heartShop(){
  sheet('💖 하트 상점',b=>{
    b.append(el('div','stars',`내 골드 🪙 ${st.gold}`),el('div','howdn','골드로 하트를 바로 채워요. 3칸은 🪙20, 가득은 빈 칸마다 🪙7'));
    const L=el('div','hshop');STATS.forEach(([k,ic,n])=>{const cur=Math.ceil(st[k]/10),miss=10-cur;const r=el('div','howrow');
      r.append(el('span','howic',ic),Object.assign(el('span','howtx'),{innerHTML:`${n}<br><small>${cur}칸 / 10칸</small>`}));
      const a=mk('',`+3칸<br><small>🪙20</small>`,()=>{if(heartBuy(k,false))heartShop()},'go'),f2=mk('',`가득<br><small>🪙${miss*7}</small>`,()=>{if(heartBuy(k,true))heartShop()},'go');
      if(miss<=0)a.disabled=f2.disabled=true;r.append(a,f2);L.append(r)});b.append(L)})}
function dress(){dressOf('pet')}
function dressHome(){placeTab=null;pendingBuy=null;dressOf('home')}

function goSchool(){st.paused=true;st.pausedAt=Date.now();game=null;scene=null;log('학교 가는 동안 멈춤');say('학교 잘 다녀와요! 여기서 기다릴게요 🎒',9e9);save();render();draw()}
function comeBack(){const m=Math.round((Date.now()-(st.pausedAt||Date.now()))/60000);st.paused=false;st.last=Date.now();prev=Date.now();log(`다시 시작 (${m}분 동안 멈춤)`);say('어서 와요! 보고 싶었어요 💕',5000);fx={t:'heart',s:Date.now(),d:1800};save();render()}
function drinkWater(){if(st.asleep)return say('자고 있어요');if(st.water>=95)return say('목 안 말라요!');eff({water:40,health:2});fx={t:'drink',s:Date.now(),d:1500};say('꿀꺽꿀꺽 시원해요! 💧');save();render()}
function painting(){const w=busy();if(w)return say(w);
  const C=['#ff5a6e','#ffb648','#ffe45c','#7bd97b','#62b0ff','#b085ff','#4a3333','#ffffff'];let col=0;const pix=Array(64).fill(null);
  sheet('🎨 그림 그리기',b=>{
    const pal=el('div','pal');C.forEach((c,i)=>{const sw=el('button','sw'+(i?'':' on'));sw.style.background=c;sw.onclick=()=>{col=i;[...pal.children].forEach((x,j)=>x.classList.toggle('on',j===i))};pal.append(sw)});
    const g=el('div','paint');pix.forEach((v,i)=>{const cell=el('button','pc');cell.onclick=()=>{pix[i]=pix[i]===col?null:col;cell.style.background=pix[i]==null?'':C[pix[i]]};g.append(cell)});
    b.append(el('div','howdn','색을 고르고 칸을 눌러 그려요. 다 그리면 방 벽에 걸려요!'),pal,g,mk('🖼️','완성!',()=>{const n=pix.filter(v=>v!=null).length;if(n<5){say('조금 더 그려 볼까요?');return}closeSheet();
      st.gallery=(st.gallery||[]).concat([pix.map(v=>v==null?'':C[v])]).slice(-6);st.cnt.art++;
      eff({art:Math.min(50,15+n),learn:15,happy:8,energy:-4},10+Math.floor(n/6));bump(1);log('그림을 그렸어요');say('멋진 그림! 방에 걸어 둘게요 🖼️',4500);save();render()},'big'))})}
const BOXES=[['🍽️ 먹기',[['🍙','밥','feed'],['🍭','간식','snack']]],
  ['🎀 꾸미기·상점',[['💄','꾸미기','dress'],['🏠','집 꾸미기','dressHome'],['💖','하트 상점','heartShop']]],
  ['🧼 돌보기',[['🫧','씻기','wash'],['🌙','재우기','sleep'],['🧹','청소','cleanRoom'],['💊','약','medicine'],['🏥','병원','hospital']]],
  ['🎈 놀고 배우기',[['🎈','놀기','playMenu'],['🏃','운동','exercise'],['📚','공부','study'],['🎨','취미','hobby']]]];
/* ----- marriage between devices (4-digit code) ----- */
const KIDX=Object.keys(KINDS),FIDX=Object.keys(FORMS);
function myCode(){const k=Math.max(0,KIDX.indexOf(st.kind)),fo=Math.max(0,FIDX.indexOf(st.form||'normal'))+(st.gender==='girl'?50:0);const a=`${String(k).padStart(2,'0')}${String(fo).padStart(2,'0')}`;return a+([...a].reduce((x,c)=>x+ +c*3,7)%10)}
function readCode(c){c=(c||'').replace(/\D/g,'');if(c.length!==5)return null;const a=c.slice(0,4);if(([...a].reduce((x,d)=>x+ +d*3,7)%10)!==+c[4])return null;
  const v=+a.slice(2),k=KIDX[+a.slice(0,2)],fo=FIDX[v%50];return k&&fo?{kind:k,form:fo,gender:v>=50?'girl':'boy'}:null}
function wedding(){
  if(stage()<4)return sheet('💍 결혼',b=>b.append(el('div','quiz',`어른이 되면 결혼할 수 있어요!`),el('div','howdn',`어른까지 약 ${Math.max(1,Math.round(GROW[3]-growMin()))}분 남았어요`)));
  sheet('💍 결혼',b=>{
    if(st.spouse){const sp=st.spouse;b.append(el('div','quiz',`${KINDS[sp.kind][0]} ${sp.name}와 결혼했어요 💕`));
      b.append(el('div','howdn','결혼하면 둘을 닮은 아기 알을 받을 수 있어요. 지금 친구와 짝꿍은 추억 앨범에 엄마·아빠로 남아요.'));
      b.append(mk('🥚','아기 알 받기',babyEgg,'big'));return}
    const mates=(USER&&DB)?[]:[0,1,2,3].filter(i=>i!==SLOT).map(i=>[i,slotData(i)]).filter(([,d])=>d&&d.hatched&&d.name&&!d.ended&&!d.spouse&&slotStage(d)===4);
    if(mates.length){b.append(el('h3',null,'이 기기의 친구와 결혼하기'));mates.forEach(([i,d])=>b.append(mk(KINDS[d.kind]?KINDS[d.kind][0]:'💍',`${d.name} ${d.gender==='girl'?'♀':'♂'}와 결혼하기`,()=>marrySlot(i),'big')))}
    onlineWedding(b);
    b.append(el('h3',null,'번호로 결혼하기 (로그인 없이)'));
    b.append(el('div','howdn','두 기기에서 서로의 결혼 번호(5자리)를 넣으면 결혼해요. (다른 휴대폰·태블릿에서 이 게임을 켜고 💍결혼을 눌러요)'));
    b.append(el('h3',null,'내 결혼 번호'),el('div','code',myCode().split('').join(' ')));
    b.append(el('h3',null,'짝꿍의 결혼 번호'));const inp=document.createElement('input');inp.inputMode='numeric';inp.maxLength=5;inp.placeholder='5자리 숫자';inp.id='wedCode';
    const nm=document.createElement('input');nm.maxLength=6;nm.placeholder='짝꿍 이름';nm.id='wedName';const msg=el('div','qmsg','');
    b.append(inp,nm,msg,mk('💍','결혼하기',()=>{const p=readCode(inp.value);if(!p){msg.textContent='번호가 맞지 않아요. 다시 확인해 봐요';return}
      if(inp.value.replace(/\D/g,'')===myCode()){msg.textContent='내 번호가 아니라 짝꿍 번호를 넣어요';return}
      st.spouse={kind:p.kind,form:p.form,gender:p.gender,name:nm.value.trim()||'짝꿍',at:Date.now()};log(`${KINDS[p.kind][1]} ${st.spouse.name}와 결혼했어요 💍`);
      closeSheet();endGame()},'big'))})}
function babyEgg(){const sp=st.spouse;
  st.album.push({gen:st.gen,name:st.name,kind:st.kind,form:st.form,days:Math.floor((Date.now()-st.born)/864e5)+1});
  st.album.push({gen:st.gen,name:sp.name+' (짝꿍)',kind:sp.kind,form:sp.form,days:0});
  const a=st.kind,b2=sp.kind,shape=Math.random()<.5?a:b2,color=shape===a?b2:a;
  log(`${st.name}와 ${sp.name}의 아기 알이 생겼어요 🥚`);
  const keep={gold:st.gold,own:st.own,wear:st.wear,diary:st.diary,album:st.album,found:st.found,shell:st.shell,studyBest:st.studyBest,gallery:st.gallery,gen:st.gen+1,babyKind:shape,colorKind:color,parents:`${st.name} ♥ ${sp.name}`};
  st=Object.assign(fresh(),keep);lastStage=0;closeSheet();save();render();say(`${keep.parents}의 아기 알이에요! 톡톡 눌러 보세요`,6000)}
$('bWed').onclick=wedding;
function slotData(i){try{return JSON.parse(localStorage.getItem(slotKey(i)))}catch(e){return null}}
function slotStage(d){if(!d||!d.hatched)return 0;const g=(d.grow||0)/60+(d.points||0)*.3;return g<GROW[1]?1:g<GROW[2]?2:g<GROW[3]?3:4}
function marrySlot(i){const d=slotData(i);if(!d)return;st.spouse={kind:d.kind,form:d.form,gender:d.gender,name:d.name,colorKind:d.colorKind,at:Date.now()};
  d.spouse={kind:st.kind,form:st.form,gender:st.gender,name:st.name,colorKind:st.colorKind,at:Date.now()};d.ended=true;d.endedAt=Date.now();d.paused=false;d.autoPaused=false;
  (d.diary=d.diary||[]).push({d:today(),t:`${st.name}와 결혼했어요 💍 해피 엔딩!`});try{localStorage.setItem(slotKey(i),JSON.stringify(d))}catch(e){}closeSheet();endGame()}
function endGame(){st.ended=true;st.endedAt=Date.now();game=null;scene=null;st.paused=false;log(`${st.spouse.name}와 결혼했어요 💍 해피 엔딩!`);fx={t:'heart',s:Date.now(),d:4000};save();render();showEnding()}
function petThumb(d,w,h){const c=document.createElement('canvas');c.width=w*3;c.height=h*3;c.className='thumb';const g=c.getContext('2d');g.fillStyle='#fff7ea';g.fillRect(0,0,c.width,c.height);
  if(d&&d.kind)try{vPet(g,{gender:d.gender,kind:d.kind,colorKind:d.colorKind,stage:d.stage||4,form:d.form,wear:d.wear||{},x:w/2,y:h-3,sc:3,mood:d.mood||'happy',f:0})}catch(e){}return c}
function showEnding(){const sp=st.spouse;if(!sp)return;const days=Math.floor((st.endedAt-st.born)/864e5)+1;
  sheet('🎉 해피 엔딩 🎉',b=>{const r=el('div','wedrow');r.append(petThumb(Object.assign({},st,{stage:4}),72,54),el('div','wedheart','💍'),petThumb(Object.assign({},sp,{stage:4}),72,54));b.append(r);
    b.append(el('div','quiz',`${st.name}와 ${sp.name}는 결혼해서 오래오래 행복하게 살았어요!`));
    const c=st.cnt||{};b.append(el('div','howdn',`키운 날 ${days}일 · 어른 모습 ${FORMS[st.form]?FORMS[st.form][1]:'보통'} · 골드 ${st.gold} · 공부 ${c.study||0}번 · 놀이 ${st.plays||0}번`));
    b.append(mk('🥚','아기 알로 새 이야기 시작',babyEgg,'big'),mk('👥','다른 캐릭터 키우기',charSheet,'big'))})}
let locked=false;
function unlockedHere(i){try{return sessionStorage.getItem('tokdama-unlock-'+i)==='1'}catch(e){return true}}
function pinAsk(title,cb,onOther){sheet(title,b=>{b.append(el('div','howdn','이 캐릭터는 잠겨 있어요. 숫자 4자리를 넣어 주세요.'));
  const inp=document.createElement('input');inp.inputMode='numeric';inp.maxLength=4;inp.placeholder='숫자 4자리';inp.id='pinIn';const msg=el('div','qmsg','');
  b.append(inp,msg,mk('🔓','열기',()=>{if(!cb(inp.value.replace(/\D/g,'')))msg.textContent='숫자가 틀려요'},'big'));if(onOther)b.append(mk('👥','다른 캐릭터 고르기',onOther,'big'));inp.onkeydown=e=>{if(e.key==='Enter')b.querySelector('.big').click()}},onOther?true:false)}
function lockScreen(){locked=true;render();pinAsk(`🔒 ${st.name||'이 캐릭터'} 잠금`,v=>{if(v!==String(st.lock))return false;try{sessionStorage.setItem('tokdama-unlock-'+SLOT,'1')}catch(e){}locked=false;closeSheet();render();return true},charSheet)}
function setLock(){sheet('🔒 비밀번호 걸기',b=>{b.append(el('div','howdn','다른 사람이 이 캐릭터를 열지 못하게 숫자 4자리를 정해요. 잊어버리면 열 수 없으니 꼭 기억해요!'));
  const a=document.createElement('input');a.inputMode='numeric';a.maxLength=4;a.placeholder='숫자 4자리';a.id='lockA';const msg=el('div','qmsg','');
  b.append(a,msg,mk('🔒','잠그기',()=>{const x=a.value.replace(/\D/g,'');if(x.length!==4){msg.textContent='숫자 4자리를 넣어 주세요';return}
    st.lock=x;try{sessionStorage.setItem('tokdama-unlock-'+SLOT,'1')}catch(e){}save();closeSheet();say('잠금을 걸었어요 🔒')},'big'))})}
function switchSlot(i){if(i===SLOT&&!locked){closeSheet();return}
  if(USER&&DB&&i!==SLOT&&window._locks&&lockFresh(window._locks[i])){say('그 캐릭터는 다른 기기에서 쓰는 중이에요 📵');return}
  const d=slotData(i);if(d&&d.lock&&!unlockedHere(i)){pinAsk(`🔒 ${d.name||(i+1)+'번'} 잠금`,v=>{if(v!==String(d.lock))return false;try{sessionStorage.setItem('tokdama-unlock-'+i,'1')}catch(e){}doSwitch(i);return true});return}
  doSwitch(i)}
function doSwitch(i){if(typeof lockRelease==='function')lockRelease();if(st.hatched&&st.name&&!st.ended&&!st.paused){st.paused=true;st.autoPaused=true;st.pausedAt=Date.now()}save();try{localStorage.setItem('tokdama-slot-'+NS,String(i))}catch(e){}location.reload()}
function charSheet(){sheet('👥 캐릭터 고르기 (4명까지)',b=>{b.append(el('div','howdn','가족이나 친구가 각자 캐릭터를 하나씩 키울 수 있어요. 고르지 않은 캐릭터는 쉬는 동안 하트가 줄지 않아요.'));
  const g=el('div','grid two-col');[0,1,2,3].forEach(i=>{const d=i===SLOT?st:slotData(i);const card=el('div','slotc'+(i===SLOT?' cur':''));const sg=slotStage(d);
    card.append(petThumb(d&&d.hatched&&d.kind?Object.assign({},d,{stage:sg}):null,72,54));
    const nm=d&&d.name?`${d.name} ${d.gender==='girl'?'♀':d.gender==='boy'?'♂':''}`:d&&d.hatched===false&&d.taps?'알':'비어 있어요';
    const stt=(i!==SLOT&&window._locks&&typeof lockFresh==='function'&&lockFresh(window._locks[i])?'📵 다른 기기에서 사용 중 · ':'')+(!d||!d.name?'':d.ended?'💍 해피 엔딩':`${KINDS[d.kind]?KINDS[d.kind][1]:''} ${STG[sg]}${i!==SLOT&&d.paused?' · 쉬는 중':''}`);
    card.append(el('b',null,`${i+1}번 · ${nm}${d&&d.lock?' 🔒':''}`),el('small',null,stt));card.append(mk('',i===SLOT?'지금 키우는 중':d&&d.name?'이 캐릭터로':'새로 만들기',()=>switchSlot(i),'go'));g.append(card)});b.append(g);b.append(mk('🔁','다시 키우기',()=>{closeSheet();$('reset').onclick()},'big'));if(st.hatched&&st.name&&!locked)b.append(st.lock?mk('🔓','지금 캐릭터 잠금 풀기',()=>{delete st.lock;save();charSheet();say('잠금을 풀었어요')},'big'):mk('🔒','지금 캐릭터에 비밀번호 걸기',setLock,'big'));if(USER){b.append(el('div','howdn',DB?'☁️ 자동 저장돼요. 앱을 닫으면 다른 휴대폰에서 이어서 키울 수 있어요.':'📱 이 기기에 자동 저장돼요.'),mk('🚪',`로그아웃 (${USER})`,logout,'big'),el('div','howdn','버전 '+APPVER))}})}
$('chars').onclick=charSheet;
async function doSave(){save();if(!USER){say('로그인하면 온라인에 저장돼요');return}if(!DB){say('이 기기에 저장했어요 💾');return}say('저장하는 중…');say(await cloudPush()?'온라인에 저장했어요 ☁️':'저장 실패! 인터넷을 확인해 주세요')}
function doLoad(){if(!USER||!DB){say('로그인하고 온라인 저장을 켜면 불러올 수 있어요');return}say('불러오는 중…');cloudLoad(true).then(()=>say('불러왔어요 📥'))};
function hobby(){const w=busy();if(w)return say(w);sheet('🎨 취미',b=>{const g=el('div','grid two-col');g.append(mk('🍳','요리 교실<br><small>순서대로 요리</small>',()=>{closeSheet();cooking()}),mk('🎨','그림 그리기<br><small>칠해서 액자에</small>',()=>{closeSheet();painting()}));b.append(g)})}
buildCare();
/* ---------- loop ---------- */
decay(Math.min(12*3600,(Date.now()-(st.last||Date.now()))/1000));
prev=Date.now();
setInterval(()=>{
  const now=Date.now();decay((now-prev)/1000);prev=now;f++;
  if(!game&&!st.asleep&&!st.sick&&f%6===0&&Math.random()<.5)petTo=24+Math.random()*24;
  petX+=Math.sign(petTo-petX)*Math.min(1,Math.abs(petTo-petX));
  if(!(game&&game.type==='catch'))draw();
  if(f%4===0)hearts();
  if(f%20===0)save();
  if(now>sayUntil&&f%3===0){if(st.hatched&&Math.random()<.25)idleTalk();else if(st.hatched)$('say').style.opacity=0}
},280);
{const _rd=render;render=function(){_rd.apply(this,arguments);fitScreen()}}
render();draw();setTimeout(fitScreen,300);
/* ---------- login screen, save/load, online marriage ---------- */
let cloudT=0,owner=!USER||!DB;
let DEV='';try{DEV=localStorage.getItem('tokdama-dev')||Math.random().toString(36).slice(2,10);localStorage.setItem('tokdama-dev',DEV)}catch(e){DEV=Math.random().toString(36).slice(2,10)}
async function lockGet(i){try{return await api(`users/${USER}/locks/${i}`)}catch(e){return null}}
const lockFresh=l=>!!(l&&l.dev&&l.dev!==DEV&&Date.now()-(l.t||0)<90000);
let away=false,lastPushed=0,reloading=false;
function lockBeat(){if(!owner||document.visibilityState!=='visible')return;api(`users/${USER}/locks/${SLOT}`,'PUT',{dev:DEV,t:Date.now()}).catch(()=>{})}
function lockRelease(){if(!USER||!DB||!owner)return;try{fetch(`${DB}/tokdama/users/${USER}/locks/${SLOT}.json`,{method:'DELETE',keepalive:true})}catch(e){}}
function busySlot(){owner=false;locked=true;render();sheet(`📵 ${SLOT+1}번 캐릭터는 사용 중이에요`,b=>{b.append(el('div','quiz','다른 기기에서 이 캐릭터를 키우고 있어요'),el('div','howdn','그 기기에서 게임을 닫거나 다른 캐릭터로 바꾸면 1~2분 뒤에 들어올 수 있어요.'),mk('👥','다른 캐릭터 고르기',charSheet,'big'),mk('🔄','다시 해 보기',()=>location.reload(),'big'))},true)}
async function claimSlot(){const l=await lockGet(SLOT);if(lockFresh(l)){busySlot();return false}owner=true;lockBeat();return true}
function pushNow(){if(!USER||!DB||!owner)return;st.last=Date.now();lastPushed=st.last;try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}
  try{fetch(`${DB}/tokdama/users/${USER}/slots/${SLOT}.json`,{method:'PUT',body:JSON.stringify(st),keepalive:true})}catch(e){}}
function goAway(){if(reloading||away||!owner)return;pushNow();lockRelease();owner=false;away=true}
async function comeBackOnline(){if(!away)return;away=false;if(!await claimSlot())return;
  try{const c=await api(`users/${USER}/slots/${SLOT}`);if(c&&(c.last||0)>lastPushed+1000){localStorage.setItem(KEY,JSON.stringify(c));sessionStorage.setItem('tokdama-synced','1');reloading=true;location.reload()}}catch(e){}}
function cloudStatus(t){const e=document.getElementById('cloudst');if(e)e.textContent=t}
function cloudSoon(){if(!USER||!DB||!owner)return;clearTimeout(cloudT);cloudT=setTimeout(cloudPush,3000)}
async function cloudPush(){if(!USER||!DB||!owner)return false;clearTimeout(cloudT);
  try{await api(`users/${USER}/slots/${SLOT}`,'PUT',st);
    const open=st.hatched&&st.name&&stage()===4&&!st.spouse&&!st.ended;
    await api(`market/${USER}_${SLOT}`,open?'PUT':'DELETE',open?{name:st.name,kind:st.kind,form:st.form,gender:st.gender,colorKind:st.colorKind||null,user:USER,slot:SLOT,t:Date.now()}:undefined);
    const d=new Date();cloudStatus(`☁️ 자동 저장됨 ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`);return true}
  catch(e){cloudStatus('☁️ 저장 실패 (인터넷 확인)');return false}}
async function cloudLoad(force){if(!USER||!DB)return;
  try{const u=await api(`users/${USER}`);if(!u||!u.slots)return;let changed=false;
    [0,1,2,3].forEach(i=>{const c=u.slots[i];if(!c)return;const k=slotKey(i);let l=null;try{l=JSON.parse(localStorage.getItem(k))}catch(e){}
      if(force||!l||(c.hatched&&!l.hatched)||(c.last||0)>(l.last||0)+5000){localStorage.setItem(k,JSON.stringify(c));if(i===SLOT)changed=true}});
    if(changed){sessionStorage.setItem('tokdama-synced','1');reloading=true;location.reload()}}catch(e){cloudStatus('☁️ 불러오기 실패 (인터넷 확인)')}}
function logout(){cloudPush().finally(()=>{lockRelease();try{localStorage.removeItem('tokdama-user')}catch(e){}location.reload()})}
function showLogin(){
  const m=document.createElement('div');m.className='login';m.innerHTML=`<div class="lcard"><div class="lhead">🥚 톡톡 다마고치</div>
    <p class="lsub">아이디와 숫자 4자리로 들어가요</p>
    <input id="lid" maxlength="12" placeholder="아이디 (예: gaeun)" autocomplete="username">
    <input id="lpin" maxlength="4" inputmode="numeric" placeholder="숫자 4자리" autocomplete="current-password">
    <div class="lmsg" id="lmsg"></div>
    <div class="lrow"><button id="lgo" class="big">🔑 들어가기</button><button id="lnew" class="big">✨ 새로 만들기</button></div>
    <p class="lnote">${DB?'가족이 같은 아이디로 들어가면 캐릭터 1~4번을 함께 써요. 한 캐릭터는 한 기기에서만 열려요.':'지금은 이 기기에만 저장돼요. (온라인 저장 준비 중)'} 아이디·번호는 어른이 함께 정해 주세요. 진짜 비밀번호는 쓰지 마세요.</p></div>`;
  document.body.append(m);const $$=id=>document.getElementById(id),msg=t=>$$('lmsg').textContent=t;
  const go=async isNew=>{const id=cleanId($$('lid').value),pin=$$('lpin').value.replace(/\D/g,'');
    if(id.length<2)return msg('아이디를 2글자 이상 적어 주세요');if(pin.length!==4)return msg('숫자 4자리를 적어 주세요');msg('잠깐만요…');
    try{let acc=null;
      if(DB)acc=await api(`users/${id}`);else{const a=JSON.parse(localStorage.getItem('tokdama-accounts')||'{}');acc=a[id]?{pin:a[id]}:null}
      if(isNew){if(acc)return msg('이미 있는 아이디예요. 다른 아이디를 써 주세요');
        if(DB)await api(`users/${id}`,'PUT',{pin,created:Date.now()});else{const a=JSON.parse(localStorage.getItem('tokdama-accounts')||'{}');a[id]=pin;localStorage.setItem('tokdama-accounts',JSON.stringify(a))}}
      else{if(!acc)return msg('없는 아이디예요. 처음이면 "새로 만들기"를 눌러요');if(String(acc.pin)!==pin)return msg('숫자 4자리가 틀려요');
        if(acc.slots)[0,1,2,3].forEach(i=>{if(acc.slots[i])localStorage.setItem(`tokdama-u-${id}-s${i}`,JSON.stringify(acc.slots[i]))})}
      localStorage.setItem('tokdama-user',id);location.reload()}
    catch(e){msg('인터넷 연결을 확인해 주세요')}};
  $$('lgo').onclick=()=>go(false);$$('lnew').onclick=()=>go(true);$$('lpin').onkeydown=e=>{if(e.key==='Enter')go(false)}}
async function onlineWedding(b){
  if(!USER||!DB){b.append(el('div','howdn','로그인하면 다른 사람 캐릭터와도 결혼할 수 있어요.'));return}
  const box=el('div','olbox');box.append(el('div','howdn','불러오는 중…'));b.append(el('h3',null,'💌 나에게 온 결혼 신청'),box);
  const box2=el('div','olbox');b.append(el('h3',null,'🌏 온라인 친구에게 결혼 신청하기'),box2);
  try{const pr=await api(`proposals/${USER}_${SLOT}`)||{};box.innerHTML='';const ks=Object.keys(pr);
    if(!ks.length)box.append(el('div','howdn','아직 없어요'));
    ks.forEach(k=>{const p=pr[k],sn=p.snap||{};const r=el('div','olrow');r.append(petThumb(Object.assign({},sn,{stage:4}),72,54),el('span',null,`${p.from}의 ${sn.name} ${sn.gender==='girl'?'♀':'♂'}`));
      r.append(mk('💍','수락',async()=>{try{st.spouse={kind:sn.kind,form:sn.form,gender:sn.gender,name:sn.name,colorKind:sn.colorKind||null,owner:p.from,at:Date.now()};
        await api(`accepted/${p.from}_${p.fromSlot}`,'PUT',{name:st.name,kind:st.kind,form:st.form,gender:st.gender,colorKind:st.colorKind||null,owner:USER,t:Date.now()});
        await api(`proposals/${USER}_${SLOT}`,'DELETE');await api(`market/${p.from}_${p.fromSlot}`,'DELETE');closeSheet();endGame();cloudPush()}catch(e){say('인터넷 연결을 확인해 주세요')}},'go'),
        mk('🙅','거절',async()=>{try{await api(`proposals/${USER}_${SLOT}/${k}`,'DELETE');r.remove()}catch(e){}},'go'));box.append(r)})}
  catch(e){box.innerHTML='';box.append(el('div','howdn','인터넷 연결을 확인해 주세요'))}
  try{const mk2=await api('market')||{};box2.innerHTML='';const list=Object.values(mk2).filter(x=>x&&!(x.user===USER&&+x.slot===SLOT)&&Date.now()-(x.t||0)<14*864e5);
    if(stage()<4||st.spouse||st.ended){box2.append(el('div','howdn','어른이 되면 신청할 수 있어요'));return}
    if(!list.length)box2.append(el('div','howdn','지금은 결혼할 수 있는 친구가 없어요'));
    list.slice(0,20).forEach(x=>{const r=el('div','olrow');r.append(petThumb(Object.assign({},x,{stage:4}),72,54),el('span',null,`${x.user===USER?(x.slot+1)+'번':x.user+'의'} ${x.name} ${x.gender==='girl'?'♀':'♂'}`));
      r.append(mk('💌','신청',async()=>{try{await api(`proposals/${x.user}_${x.slot}`,'POST',{from:USER,fromSlot:SLOT,snap:{name:st.name,kind:st.kind,form:st.form,gender:st.gender,colorKind:st.colorKind||null},t:Date.now()});say(`${x.name}에게 결혼 신청을 보냈어요! 💌`);r.lastChild.disabled=true;r.lastChild.textContent='보냈어요'}catch(e){say('인터넷 연결을 확인해 주세요')}},'go'));box2.append(r)})}
  catch(e){box2.innerHTML='';box2.append(el('div','howdn','인터넷 연결을 확인해 주세요'))}}
async function checkMail(){if(!USER||!DB||!st.hatched||st.ended)return;
  try{const a=await api(`accepted/${USER}_${SLOT}`);if(a&&!st.spouse){st.spouse={kind:a.kind,form:a.form,gender:a.gender,name:a.name,colorKind:a.colorKind||null,owner:a.owner,at:Date.now()};await api(`accepted/${USER}_${SLOT}`,'DELETE');endGame();cloudPush();return}
    const p=await api(`proposals/${USER}_${SLOT}`);if(p&&Object.keys(p).length&&!game)say(`💌 결혼 신청이 ${Object.keys(p).length}개 왔어요! 💍결혼을 눌러 봐요`,6000)}catch(e){}}
if(!USER)showLogin();
else if(DB){(async()=>{try{const pn=await api(`users/${USER}/pin`);if(pn==null){const la=JSON.parse(localStorage.getItem('tokdama-accounts')||'{}');if(la[USER])await api(`users/${USER}/pin`,'PUT',la[USER])}}catch(e){}if(!await claimSlot())return;if(!sessionStorage.getItem('tokdama-synced'))await cloudLoad(false);sessionStorage.removeItem('tokdama-synced')})();
  setInterval(lockBeat,30000);setTimeout(checkMail,4000);setInterval(checkMail,60000);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')goAway();else comeBackOnline()});
  window.addEventListener('pagehide',goAway);
  const _cs=charSheet;window._locks={};charSheet=async function(){try{const u=await api(`users/${USER}`)||{};const sl=u.slots||{};[0,1,2,3].forEach(i=>{if(i===SLOT||!sl[i])return;const l=slotData(i);if(!l||(sl[i].last||0)>(l.last||0))localStorage.setItem(slotKey(i),JSON.stringify(sl[i]))});window._locks=u.locks||{}}catch(e){}_cs()};$('chars').onclick=()=>charSheet()}
cloudStatus(USER?(DB?`☁️ ${USER}`:`📱 ${USER} (이 기기 저장)`):'')

if(USER&&st.lock&&!unlockedHere(SLOT))lockScreen();
else if(USER&&st.hatched&&(!st.name||!st.kind||!st.gender))askName();
else if(st.hatched)setTimeout(idleTalk,600);
