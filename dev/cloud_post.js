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
cloudStatus(USER?(DB?`☁️ ${USER}`:`📱 ${USER} (이 기기 저장)`):'');
