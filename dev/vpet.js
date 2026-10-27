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
  if(o.gender==='boy'&&s>=2&&!W.neck){const bx=hx,by=body?body.cy-body.ry+.8:Math.min(hy+hry*.86,-1.6),z=.8+s*.16;[-1,1].forEach(d=>{path(()=>{g.moveTo(bx,by);g.lineTo(bx+d*2*z,by-1.2*z);g.lineTo(bx+d*2*z,by+1.2*z);g.closePath()});fillS('#4f9dff')});ell(bx,by,.7*z,.7*z,'#2f7fe0')}
  // stage extras
  if(s===1){path(()=>{g.ellipse(hx,top+2.2,hrx*.78,3,0,Math.PI,0);g.lineTo(hx+hrx*.78,top+2.2);for(let i=6;i>=0;i--)g.lineTo(hx-hrx*.78+i*(hrx*1.56/6),top+2.2+(i%2?1.2:0))});fillS('#ffffff')}
  const NOLIMB=['fish','octopus','jellyfish','dropling'].includes(k);
  if(s===2&&!o.asleep){const by=body?body.cy-body.ry*.2:hy+hry*.66;
    if(!NOLIMB){ g.save();path(()=>g.roundRect(hx+side-1.2,midY-2.4,3.4,4.6,1.2));g.fillStyle='#ff8fa3';g.fill();g.strokeStyle=VL;g.stroke();path(()=>g.roundRect(hx+side-1.2,midY-2.4,3.4,1.8,1));g.fillStyle='#ff6b81';g.fill();g.restore();
      g.strokeStyle='#ff6b81';g.lineWidth=.8;[-1,1].forEach(d=>{path(()=>{g.moveTo(hx+d*hrx*.48,by-1.8);g.lineTo(hx+d*hrx*.45,by+1.4)});g.stroke()});g.lineWidth=.75}
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
