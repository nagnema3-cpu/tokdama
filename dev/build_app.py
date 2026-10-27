import re,os
s=open(os.path.join(os.path.dirname(__file__),'tamago.html')).read()
def R(a,b,n=1):
    global s
    assert s.count(a)==n,(a[:80],s.count(a))
    s=s.replace(a,b)
R('<title>톡톡 다마고치</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n',"")
i=s.rindex("</script>");s=s[:i]+"</script>\n<script>if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{})</script>\n</body>\n</html>\n"
head='''<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>톡톡 다마고치</title>
<meta name="theme-color" content="#ff8f7e">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="톡톡">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icon-192.png">
<link rel="apple-touch-icon" href="icon-180.png">
<script src="config.js"></script>
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}img{max-width:100%}[hidden]{display:none!important}button{-webkit-appearance:none}</style>
</head>
<body>
'''
s=head+s
R("let SLOT=0;try{SLOT=Math.min(3,Math.max(0,+localStorage.getItem('tokdama-slot')||0))}catch(e){}\nconst slotKey=i=>i?'tokdama-v2-s'+i:'tokdama-v2';",
  open(os.path.join(os.path.dirname(__file__),'cloud_pre.js')).read()+"\nlet SLOT=0;try{SLOT=Math.min(3,Math.max(0,+localStorage.getItem('tokdama-slot-'+NS)||0))}catch(e){}\nconst slotKey=i=>'tokdama-'+NS+'-s'+i;")
R("try{saved=JSON.parse(localStorage.getItem(KEY)||(SLOT?null:localStorage.getItem('tokdama-v1')))}catch(e){}","try{saved=JSON.parse(localStorage.getItem(KEY))}catch(e){}")
R("localStorage.setItem('tokdama-slot',String(i))","localStorage.setItem('tokdama-slot-'+NS,String(i))")
R("function save(){st.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}}","function save(){st.last=Date.now();try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}if(typeof cloudSoon==='function')cloudSoon()}")
R('<button id="bShell"><span class="ic">🎨</span>기기 색깔</button></div>','<button id="bShell"><span class="ic">🎨</span>기기 색깔</button></div>\n<div class="cloudst" id="cloudst"></div>')
R("})}\n$('chars').onclick=charSheet;",";if(USER){const sr=el('div','row');sr.append(mk('💾','저장',()=>{closeSheet();doSave()}),mk('📥','불러오기',()=>{closeSheet();doLoad()}));b.append(el('h3',null,'저장·불러오기'),sr,mk('🚪',`로그아웃 (${USER})`,logout,'big'))}})}\n$('chars').onclick=charSheet;\nasync function doSave(){save();if(!USER){say('로그인하면 온라인에 저장돼요');return}if(!DB){say('이 기기에 저장했어요 💾');return}say('저장하는 중…');say(await cloudPush()?'온라인에 저장했어요 ☁️':'저장 실패! 인터넷을 확인해 주세요')}\nfunction doLoad(){if(!USER||!DB){say('로그인하고 온라인 저장을 켜면 불러올 수 있어요');return}say('불러오는 중…');cloudLoad(true).then(()=>say('불러왔어요 📥'))};")
R("    b.append(el('h3',null,'다른 기기 친구와 결혼하기'));","    onlineWedding(b);\n    b.append(el('h3',null,'번호로 결혼하기 (로그인 없이)'));")
R("render();draw();\nif(st.lock&&!unlockedHere(SLOT))lockScreen();\nelse if(st.hatched&&","render();draw();\n"+open(os.path.join(os.path.dirname(__file__),'cloud_post.js')).read()+"\nif(USER&&st.lock&&!unlockedHere(SLOT))lockScreen();\nelse if(USER&&st.hatched&&")
R(".reset{background:none","""@media (max-width:600px){.layout{flex:1}.toy{flex:1;justify-content:center}}
.login{position:fixed;inset:0;z-index:50;background:var(--page);background-image:radial-gradient(var(--dot) 1.5px,transparent 1.5px);background-size:18px 18px;display:flex;align-items:center;justify-content:center;padding:16px}
.lcard{background:#fff;border-radius:28px;padding:26px 22px;width:min(360px,100%);box-sizing:border-box;display:flex;flex-direction:column;gap:12px;text-align:center;box-shadow:0 6px 0 var(--dot)}
.lhead{font-size:1.8rem;color:var(--shell-lo)}.lsub{margin:0;color:var(--muted)}.lnote{margin:0;font-size:.8rem;color:var(--muted);line-height:1.5}
.lcard input{font-family:var(--display);font-size:1.2rem;text-align:center;padding:10px;border:3px solid var(--dot);border-radius:14px;outline:none;color:var(--text)}.lcard input:focus{border-color:var(--shell)}
.lrow{display:flex;gap:10px}.lrow button{flex:1;flex-direction:row;justify-content:center;font-size:1rem;padding:12px 4px}.lmsg{min-height:1.2em;color:#e8344e;font-size:.9rem}
.cloudst{font-size:.78rem;color:var(--muted);text-align:center;min-height:1em}
.olbox{display:flex;flex-direction:column;gap:6px}.olrow{display:grid;grid-template-columns:64px 1fr auto auto;gap:6px;align-items:center;background:var(--page);border-radius:12px;padding:6px;text-align:left;font-size:.9rem}.olrow .thumb{width:64px}.olrow .go{flex-direction:row;padding:6px 8px;font-size:.8rem}
.reset{background:none""")
R("const stt=!d||!d.name?'':d.ended?","const stt=(i!==SLOT&&window._locks&&typeof lockFresh==='function'&&lockFresh(window._locks[i])?'📵 다른 기기에서 사용 중 · ':'')+(!d||!d.name?'':d.ended?")
R("' · 쉬는 중':''}`;","' · 쉬는 중':''}`);")
R("function switchSlot(i){if(i===SLOT){closeSheet();return}","function switchSlot(i){if(i===SLOT&&!locked){closeSheet();return}\n  if(USER&&DB&&i!==SLOT&&window._locks&&lockFresh(window._locks[i])){say('그 캐릭터는 다른 기기에서 쓰는 중이에요 📵');return}")
R("function doSwitch(i){","function doSwitch(i){if(typeof lockRelease==='function')lockRelease();")
R("const mates=[0,1,2,3]","const mates=(USER&&DB)?[]:[0,1,2,3]")
os.makedirs(''+os.path.join(os.path.dirname(__file__),'..')+'',exist_ok=True)
open(''+os.path.join(os.path.dirname(__file__),'..')+'/index.html','w').write(s)
scripts=re.findall(r'<script>(.*?)</script>',s,re.S)
open('app_t.js','w').write(max(scripts,key=len))
