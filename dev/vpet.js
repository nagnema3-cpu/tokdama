/* ---------- soft anime-style pets (vector) ---------- */
const VPAL={cat:{b:'#ffdcbc',l:'#fff3e6',d:'#f0a878',e:'#ffb3c7'},rabbit:{b:'#fbf7ff',l:'#ffffff',d:'#d6c6f0',e:'#ffc2d6'},dog:{b:'#f2d9bb',l:'#fff6ea',d:'#c4946a',e:'#ffb8c6'},
 bear:{b:'#e3b88f',l:'#f8e6cf',d:'#a97a4f',e:'#ffb3c0'},chick:{b:'#fff0a6',l:'#fffbe0',d:'#f6c93c',e:'#ffc0c8'},owl:{b:'#dcc5aa',l:'#f6ece0',d:'#a4835f',e:'#ffbcc8'},
 penguin:{b:'#aec1ea',l:'#ffffff',d:'#7d95d0',e:'#ffbdd0'},fish:{b:'#acdff3',l:'#eafaff',d:'#6cbfe0',e:'#ffc0d2'},octopus:{b:'#ffc6d6',l:'#ffeaf0',d:'#ff92b0',e:'#ff9fbf'},turtle:{b:'#c3e8b8',l:'#f1fbea',d:'#86c975',e:'#ffc0c8'}};
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
  const SPK=['chick','owl','penguin','fish','octopus','turtle'].includes(k);
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
    fish:[[7.4,5.4],[9.6,6.8],[11,7.8],[12.4,8.8]],octopus:[[6.6,5.6],[8.4,7.2],[9.6,8.4],[10.8,9.4]],turtle:[[7.6,4.6],[9.6,5.8],[11,6.6],[12.4,7.4]]}[k][s-1];
  let rx=SZ[0],ry=SZ[1];if(eat){rx*=1.12;ry*=1.05}
  const cy=k==='fish'?-ry-4.5:k==='octopus'?-ry-3.2-s*.4:k==='turtle'?-ry-1.6:-ry-1;
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
  if(k!=='turtle'){hx=0;hy=cy;hrx=rx;hry=ry}
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
  eye(Lx,ek);eye(Rx,(ply&&ek==='open')?'happy':ek);
  if(o.mood==='sad'&&!o.asleep&&!o.sick)ell(Lx-ew*.6,ey+eh+1+(o.f%2)*.6,.5,.8,'#8fc8ff',false);
  const cy2=ey+eh+.6,ck=sec?['#ffb3b3','#bfe0ff']:[P.e,P.e];
  [[Lx-ew-1.1,0],[Rx+ew+1.1,1]].forEach(([x,i])=>{g.globalAlpha=.75;ell(x,cy2,1.5+s*.3,.9+s*.12,ck[i],false);g.globalAlpha=1});
  if(eat)[[Lx-ew-1.1],[Rx+ew+1.1]].forEach(([x])=>{g.globalAlpha=.6;ell(x,cy2,2.2,1.2,'#ff8fa8',false);g.globalAlpha=1});
  if(ply){g.save();g.translate(Lx-ew-1.6,cy2-.6);g.rotate(-.4);g.fillStyle='#f6d9ae';g.fillRect(-1.6,-.6,3.2,1.2);g.restore()}
  // muzzle & mouth
  const my=ey+eh+.4,mx=fxc+dir;
  if((k==='bear'||k==='dog')&&!sec&&s>=2){ell(mx,my+.6,2+s*.35,1.4+s*.2,P.l,false);ell(mx,my-.3,.7,.5,VL,false)}
  g.strokeStyle=VL;g.lineWidth=.7;
  if(bird){const bw=1+s*.2;path(()=>{g.moveTo(mx-bw,my-.5);g.lineTo(mx+bw,my-.5);g.lineTo(mx,my+(o.eating?1.8:.8+s*.25));g.closePath()});g.fillStyle='#ffa94d';g.fill();g.stroke();if(k==='chick'&&s===4)ell(mx,my+2.1,.7,.9,'#ff7a8a')}
  else if(s===1&&!o.eating&&!o.asleep){ell(mx,my+.6,1.2,.9,'#ffc2d6');ell(mx,my+.6,.45,.35,'#ffffff',false)}
  else if(o.eating){ell(mx,my+.8,1,.9,'#c0566f')}
  else if(o.asleep){path(()=>{g.moveTo(mx-.6,my+.5);g.lineTo(mx+.6,my+.5)});g.stroke()}
  else if(o.mood==='sad'||o.sick){path(()=>{g.moveTo(mx-1,my+1.2);g.quadraticCurveTo(mx,my,mx+1,my+1.2)});g.stroke()}
  else if(ply){path(()=>{g.moveTo(mx-1.2,my+.2);g.quadraticCurveTo(mx,my+1.2,mx+1.2,my+.2)});g.stroke();ell(mx+.4,my+1.1,.7,.8,'#ff8fae',false)}
  else{path(()=>{g.moveTo(mx-1.4,my+.1);g.quadraticCurveTo(mx-.7,my+1,mx,my+.2);g.quadraticCurveTo(mx+.7,my+1,mx+1.4,my+.1)});g.stroke()}
  if(eat){ell(mx+2,my+.6,.6,.5,'#ffffff',false)}
  if(W.makeup==='lips'&&!o.asleep&&!bird)ell(mx,my+.7,.9,.6,'#ff4f7a',false);
  if(W.makeup==='blush'&&!o.asleep)[Lx-ew-1.1,Rx+ew+1.1].forEach(x=>heart(x,cy2-.3,1.2,'#ff6fa0'));
  if(W.makeup==='sparkle'&&!o.asleep)[Lx-ew-1.6,Rx+ew+1.6].forEach((x,i)=>star(x,ey-eh-.6,(o.f+i)%2?1:.6,'#ffd84d'));
  // stage extras
  if(s===1){path(()=>{g.ellipse(hx,top+2.2,hrx*.78,3,0,Math.PI,0);g.lineTo(hx+hrx*.78,top+2.2);for(let i=6;i>=0;i--)g.lineTo(hx-hrx*.78+i*(hrx*1.56/6),top+2.2+(i%2?1.2:0))});fillS('#ffffff')}
  if(s===2&&!o.eating&&k!=='fish'&&k!=='octopus'){path(()=>{g.ellipse(hx,hy+hry*.62,hrx*.42,2,0,0,Math.PI)});fillS('#ffffff');ell(hx,hy+hry*.62+1,.5,.5,'#8fc8ff',false)}
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
