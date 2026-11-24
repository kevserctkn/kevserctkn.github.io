/* Kevser — self-contained 3D keyboard globe. Original WebGL2 geometry + 2D fallback. */
(()=>{
'use strict';
const root=document.querySelector('[data-k3d]');if(!root)return;
const canvas=root.querySelector('#globeCanvas');
const sculpture=root.querySelector('#sculpture');
const caption=root.querySelector('#globeCaption');
const errorEl=root.querySelector('#globeError');
const lightBtn=root.querySelector('#unfoldBtn');
const reduced=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const isEn=document.documentElement.lang.toLowerCase().startsWith('en');
const say=(tr,en)=>isEn?en:tr;
const defaultCaption=say('FAREYİ HAREKET ETTİR · TUTUP 360° İNCELE','MOVE YOUR MOUSE · DRAG TO EXPLORE IN 360°');
let yaw=.31,pitch=-.22,targetYaw=.31,targetPitch=-.22,zoom=1,targetZoom=1,drag=false,hover=false,lastPX=0,lastPY=0,activePointer=null,lastInteraction=0,lit=true,pulse=0;
let explode=0,explodeTarget=0,visible=false;
const coarsePointer=window.matchMedia('(pointer:coarse)').matches;
const gl=canvas.getContext('webgl2',{alpha:true,antialias:!coarsePointer,depth:true,premultipliedAlpha:false,powerPreference:coarsePointer?'low-power':'high-performance'});
errorEl.hidden=true;
const setCaption=t=>{caption.textContent=t};
let frameHandle=0, lastDraw=0;
function ensureFrame(){
 if(!frameHandle&&visible&&!document.hidden){frameHandle=requestAnimationFrame(frame)}
}
function setZoom(v){targetZoom=clamp(v,.72,1.48);lastInteraction=performance.now();ensureFrame()}
function setRotation(dx,dy,factor=.0045){targetYaw+=dx*factor;targetPitch-=dy*factor;lastInteraction=performance.now();ensureFrame()}
const observer=new IntersectionObserver(entries=>{
 visible=entries.some(e=>e.isIntersecting);
 if(visible){lastDraw=0;ensureFrame()}
 else{cancelAnimationFrame(frameHandle);frameHandle=0}
},{threshold:.08});observer.observe(root);
document.addEventListener('visibilitychange',()=>{
 if(document.hidden){cancelAnimationFrame(frameHandle);frameHandle=0}
 else if(visible){lastDraw=0;ensureFrame()}
});
// Move the mouse in any direction while this section is visible; drag for precision.
window.addEventListener('pointermove',e=>{
 if(e.pointerType!=='mouse'||drag||!visible)return;
 if(lastPX!==0||lastPY!==0){
  const dx=e.clientX-lastPX,dy=e.clientY-lastPY;
  if(Math.abs(dx)<160&&Math.abs(dy)<160&&(dx||dy)){
   const overSphere=e.target===canvas||e.target===fallbackCanvas;
   setRotation(dx,dy,overSphere?.011:.007);
  }
 }
 lastPX=e.clientX;lastPY=e.clientY;
},{passive:true});
window.addEventListener('blur',()=>{lastPX=0;lastPY=0});
window.addEventListener('pointerout',e=>{if(!e.relatedTarget){lastPX=0;lastPY=0}});
canvas.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;setCaption(say('İNCELEME MODU · TUTUP HER YÖNE DÖNDÜR','INSPECTION MODE · DRAG TO ROTATE'))}});
canvas.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!drag){hover=false;setCaption(defaultCaption)}});
canvas.addEventListener('pointerdown',e=>{
 if(e.pointerType==='mouse'&&e.button!==0)return;
 drag=true;hover=true;activePointer=e.pointerId;lastPX=e.clientX;lastPY=e.clientY;
 canvas.setPointerCapture(e.pointerId);setCaption(say('SERBEST 360° İNCELEME · HER YÖNE DÖNDÜR','FREE 360° INSPECTION · ROTATE ANY WAY'));lastInteraction=performance.now();e.preventDefault();
});
canvas.addEventListener('pointermove',e=>{
 if(!drag||e.pointerId!==activePointer)return;
 setRotation(e.clientX-lastPX,e.clientY-lastPY,.0095);lastPX=e.clientX;lastPY=e.clientY;
});
function stopDrag(){drag=false;activePointer=null;lastPX=0;lastPY=0;setCaption(defaultCaption)}
canvas.addEventListener('pointerup',e=>{if(activePointer===e.pointerId){stopDrag();try{canvas.releasePointerCapture(e.pointerId)}catch{}}});
canvas.addEventListener('pointercancel',stopDrag);canvas.addEventListener('lostpointercapture',stopDrag);
canvas.addEventListener('keydown',e=>{
 const k=e.key;
 if(['ArrowRight','ArrowLeft','ArrowUp','ArrowDown','+','=','-','0'].includes(k))e.preventDefault();
 if(k==='ArrowRight')setRotation(30,0,.015);
 if(k==='ArrowLeft')setRotation(-30,0,.015);
 if(k==='ArrowUp')setRotation(0,-30,.015);
 if(k==='ArrowDown')setRotation(0,30,.015);
 if(k==='+'||k==='=')setZoom(targetZoom+.12);
 if(k==='-')setZoom(targetZoom-.12);
 if(k==='0')reset();
});
function reset(){targetYaw=.31;targetPitch=-.22;setZoom(1);setCaption(say('GÖRÜNÜM SIFIRLANDI · FAREYLE DÖNDÜR','VIEW RESET · ROTATE WITH MOUSE'))}
root.querySelector('#zoomIn').addEventListener('click',()=>setZoom(targetZoom+.13));
root.querySelector('#zoomOut').addEventListener('click',()=>setZoom(targetZoom-.13));
root.querySelector('#resetGlobe').addEventListener('click',reset);
lightBtn.addEventListener('click',()=>{
 lit=!lit;pulse=1.5;
 lightBtn.innerHTML=lit?say('Işıkları sakinleştir <span aria-hidden="true">✳</span>','Dim the lights <span aria-hidden="true">✳</span>'):say('Işıkları uyandır <span aria-hidden="true">✳</span>','Brighten the lights <span aria-hidden="true">✳</span>');
 lightBtn.setAttribute('aria-pressed',String(lit));lastInteraction=performance.now();ensureFrame();
});

// Gerçek 3D: küre, 156 bağımsız kalın klavye tuşu, yumuşatılmış kenarlar,
// ışık-gölge, parlama ve gerçek derinlik testi WebGL2 ile sıfırdan üretilir.
// Harici model, CDN, 3D motoru veya telifli varlık kullanılmaz.
let program=null,mesh=null,texture=null,uniforms=null;
if(gl){
 const vs=`#version 300 es
 precision highp float;
 in vec3 aPosition;in vec3 aNormal;in vec3 aColor;in vec2 aUV;in float aType;in vec3 aRadial;in float aId;
 uniform float uYaw,uPitch,uZoom,uExplode,uTime,uPulse,uAspect;
 out vec3 vN,vColor,vP;out vec2 vUV;out float vType,vId;
 void main(){
  float cy=cos(uYaw),sy=sin(uYaw),cx=cos(uPitch),sx=sin(uPitch);
  mat3 ry=mat3(cy,0.,-sy,0.,1.,0.,sy,0.,cy);
  mat3 rx=mat3(1.,0.,0.,0.,cx,sx,0.,-sx,cx);
  mat3 rot=ry*rx;
  float wave=.5+.5*sin(aId*.31-uTime*2.6);
  vec3 p=aPosition+aRadial*uExplode*(1.25+wave*.9);
  p=rot*p;
  vP=p;vN=normalize(rot*aNormal);vColor=aColor;vUV=aUV;vType=aType;vId=aId;
  float camera=8.7/uZoom;
  float f=2.55;
  vec3 view=vec3(p.x,p.y,p.z-camera);
  gl_Position=vec4(view.x*f/uAspect,view.y*f,(-view.z-0.1)/9.0*2.-1.,-view.z);
 }`;
 // Note: custom perspective clip formula gives a near-far mapping; divide by -view.z.
 const fs=`#version 300 es
 precision highp float;
 in vec3 vN,vColor,vP;in vec2 vUV;in float vType,vId;
 uniform sampler2D uAtlas;uniform float uLit,uTime,uPulse;
 out vec4 outColor;
 void main(){
  vec3 N=normalize(vN),V=normalize(vec3(0.,0.,8.7)-vP);
  vec3 L1=normalize(vec3(-.54,.72,.95)),L2=normalize(vec3(.9,-.4,.55)),L3=normalize(vec3(-.3,-.9,-.3));
  float d1=max(dot(N,L1),0.),d2=max(dot(N,L2),0.),d3=max(dot(N,L3),0.);
  float h1=pow(max(dot(N,normalize(L1+V)),0.),vType<.5?56.:90.);
  float h2=pow(max(dot(N,normalize(L2+V)),0.),42.);
  float rim=pow(1.-max(dot(N,V),0.),3.3);
  float ao=(vType<.5?.76:1.0);
  vec3 base=vColor;
  vec3 shaded=base*(.27+1.03*d1+.26*d2+.11*d3)*ao;
  shaded+=vec3(.93,.78,1.)*h1*(vType>1.5?.34:.55);
  shaded+=vec3(.55,.29,.93)*h2*.28;
  shaded+=vec3(.41,.18,.72)*rim*.20;
  if(vType>1.5){
    shaded=base*(.14+.55*d1+.21*d2)+vec3(.22,.12,.37)*rim*.26;
    shaded+=vec3(.58,.29,.81)*h1*.18;
  }else if(vType>.5){
    vec4 glyph=texture(uAtlas,vUV);
    vec3 glow=vec3(.82,.70,1.)*uLit+vec3(.65,.62,.78)*(1.-uLit);
    shaded=mix(shaded,glow*(.62+.55*d1),glyph.a*.88);
    shaded+=glow*glyph.a*(.22+.12*sin(uTime*2.+vId*.11))*uLit;
    float pulseGlow=max(0.,sin(vId*.21-uTime*5.))*uPulse;
    shaded+=base*pulseGlow*.14;
  }
  // Filmic tonemapping with gentle gamma to retain detail in dark graphite.
  shaded=max(shaded,vec3(0.));
  shaded=shaded/(vec3(1.)+shaded*.47);
  shaded=pow(shaded,vec3(.90));
  outColor=vec4(shaded,1.);
 }`;
 function shader(type,source){const sh=gl.createShader(type);gl.shaderSource(sh,source);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS)){throw Error(gl.getShaderInfoLog(sh))}return sh}
 try{
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vs));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const attribs=['aPosition','aNormal','aColor','aUV','aType','aRadial','aId'];
  const pos=[],nor=[],col=[],uv=[],typ=[],rad=[],ids=[];
  function vert(p,n,c,t,uvv,radial,id){pos.push(...p);nor.push(...n);col.push(...c);uv.push(...uvv);typ.push(t);rad.push(...radial);ids.push(id)}
  function tri(a,b,c){for(const v of [a,b,c])vert(...v)}
  const sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const norm=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l)};
  const add=(a,b)=>a.map((v,i)=>v+b[i]),mul=(a,s)=>a.map(x=>x*s);
  function face(points,color,type,uvs,radial,id){const n=norm(cross(sub(points[1],points[0]),sub(points[2],points[0])));for(let i=1;i<points.length-1;i++){tri([points[0],n,color,uvs[0],type,radial,id],[points[i],n,color,uvs[i],type,radial,id],[points[i+1],n,color,uvs[i+1],type,radial,id])}}
  // Dark internal sphere gives convincing depth through gaps between keys.
  const coreColor=[.043,.035,.075],coreRadius=2.19;
  for(let i=0;i<35;i++)for(let j=0;j<54;j++){
   const sphere=(lat,lon)=>[Math.cos(lat)*Math.sin(lon)*coreRadius,Math.sin(lat)*coreRadius,Math.cos(lat)*Math.cos(lon)*coreRadius];
   const p1=sphere(-Math.PI/2+i*Math.PI/35,j*2*Math.PI/54),p2=sphere(-Math.PI/2+(i+1)*Math.PI/35,j*2*Math.PI/54),p3=sphere(-Math.PI/2+(i+1)*Math.PI/35,(j+1)*2*Math.PI/54),p4=sphere(-Math.PI/2+i*Math.PI/35,(j+1)*2*Math.PI/54);
   for(const p of [p1,p2,p3,p1,p3,p4])vert(p,norm(p),coreColor,2,[0,0],[0,0,0],0);
  }
  const N=156, golden=Math.PI*(3-Math.sqrt(5));
  const icons=['K','JS','CSS','HTML','</>','{}','UX','UI','WEB','3D','DEV','01','✦','⌘','AI','ALT','TAB','ESC','CTRL','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','⇧','↵','*','+','/','?','<','>'];
  const cols=13,rows=12,cell=128;
  const atlas=document.createElement('canvas');atlas.width=cols*cell;atlas.height=rows*cell;
  const a=atlas.getContext('2d');a.clearRect(0,0,atlas.width,atlas.height);
  const palette=[[.092,.087,.135],[.12,.10,.175],[.20,.125,.31],[.35,.21,.48],[.51,.34,.65],[.31,.28,.45],[.42,.27,.43]];
  function rounded(r,w,h,rr){return [[-w/2+rr,-h/2],[w/2-rr,-h/2],[w/2,-h/2+rr],[w/2,h/2-rr],[w/2-rr,h/2],[-w/2+rr,h/2],[-w/2,h/2-rr],[-w/2,-h/2+rr]]}
  function roundedPoints(w,r,z){const pts=[];for(let k=0;k<4;k++){const ang=k*Math.PI/2;const cx=(k===0||k===3)?w/2-r:-w/2+r;const cy=k<2?w/2-r:-w/2+r;
    for(let q=0;q<=3;q++){const th=(k===0?-Math.PI/2:k===1?0:k===2?Math.PI/2:Math.PI)+q*(Math.PI/2)/3;pts.push([cx+Math.cos(th)*r,cy+Math.sin(th)*r,z]);}
   }return pts}
  // Proper rounded rectangle perimeter, ordered CCW (local x right, y up).
  function contour(w,r,z){const pts=[];const corners=[[w/2-r,w/2-r,0],[-w/2+r,w/2-r,90],[-w/2+r,-w/2+r,180],[w/2-r,-w/2+r,270]];
    // angles: top-right 0..90, top-left 90..180, bottom-left 180..270, bottom-right 270..360
    for(const [cx,cy,deg] of corners){for(let j=0;j<=4;j++){const an=(deg+j*90/4)*Math.PI/180;pts.push([cx+r*Math.cos(an),cy+r*Math.sin(an),z])}}return pts}
  function toWorld(v,c,ax,ay,az){return add(c,add(add(mul(ax,v[0]),mul(ay,v[1])),mul(az,v[2])))}
  const nRing=20;
  for(let k=0;k<N;k++){
   const y=1-2*(k+.5)/N,ring=Math.sqrt(1-y*y),ang=k*golden;
   const outward=norm([Math.cos(ang)*ring,y,Math.sin(ang)*ring]);
   const axisX=norm(cross([0,1,0],outward));
   const axisY=norm(cross(outward,axisX));
   const center=mul(outward,2.43);
   const isBright=k%13===0||k%23===1;
   const isPink=k%17===2;
   const isLav=k%9===4;
   const color=isBright?[.60,.43,.79]:isPink?[.46,.26,.39]:isLav?[.24,.17,.35]:palette[(k*7+Math.floor(k/11))%3];
   const c0=contour(.54,.091,-.13),c1=contour(.55,.092,-.065),c2=contour(.52,.093,.045),c3=contour(.475,.085,.128),c4=contour(.44,.074,.152);
   const rings=[c0,c1,c2,c3,c4];
   for(let layer=0;layer<4;layer++)for(let j=0;j<nRing;j++){
    const jj=(j+1)%nRing;
    const A=toWorld(rings[layer][j],center,axisX,axisY,outward),B=toWorld(rings[layer][jj],center,axisX,axisY,outward),C=toWorld(rings[layer+1][jj],center,axisX,axisY,outward),D=toWorld(rings[layer+1][j],center,axisX,axisY,outward);
    const sideCol=layer===0?color.map(x=>x*.40):layer===3?color.map(x=>x*1.25):color;
    const normal=norm(cross(sub(B,A),sub(C,A)));
    for(const p of [A,B,C,A,C,D])vert(p,normal,sideCol,0,[0,0],outward,k);
   }
   // Top face: texture atlas symbol and subtle etched top details.
   const tc=k%cols,tr=Math.floor(k/cols),ux=(tc+.5)/cols,uy=(tr+.5)/rows;
   const centerUV=[ux,uy];const centerTop=toWorld([0,0,.153],center,axisX,axisY,outward);
   for(let j=0;j<nRing;j++){
    const q1=c4[j],q2=c4[(j+1)%nRing],p1=toWorld(q1,center,axisX,axisY,outward),p2=toWorld(q2,center,axisX,axisY,outward);
    const getuv=q=>[(tc+.5+q[0]/.53)/cols,(tr+.5-q[1]/.53)/rows];
    // correct CCW winding: center -> p1 -> p2
    for(const [p,uvv] of [[centerTop,centerUV],[p1,getuv(q1)],[p2,getuv(q2)]])vert(p,outward,color.map(x=>x*1.10),1,uvv,outward,k);
   }
   // Printed, original keyboard legends; alpha-only glyph atlas.
   const cx=tc*cell+cell/2,cy=tr*cell+cell/2;
   const label=icons[(k*5+Math.floor(k/5))%icons.length];
   a.textAlign='center';a.textBaseline='middle';a.fillStyle=isBright?'rgba(24,15,37,.96)':'rgba(243,225,255,.93)';
   a.font=`700 ${label.length>3?37:label.length>2?43:label.length>1?52:64}px ui-monospace,Consolas,monospace`;
   a.fillText(label,cx,cy+1,cell*.81);
   a.fillStyle='rgba(235,214,255,.24)';a.fillRect(cx-29,cy+37,58,2);
  }
  // WebGL buffer with interleaved attributes.
  const data=new Float32Array((pos.length/3)*16);
  for(let i=0;i<pos.length/3;i++){
   let o=i*16;data[o]=pos[i*3];data[o+1]=pos[i*3+1];data[o+2]=pos[i*3+2];
   data[o+3]=nor[i*3];data[o+4]=nor[i*3+1];data[o+5]=nor[i*3+2];
   data[o+6]=col[i*3];data[o+7]=col[i*3+1];data[o+8]=col[i*3+2];
   data[o+9]=uv[i*2];data[o+10]=uv[i*2+1];data[o+11]=typ[i];
   data[o+12]=rad[i*3];data[o+13]=rad[i*3+1];data[o+14]=rad[i*3+2];data[o+15]=ids[i];
  }
  const vao=gl.createVertexArray();gl.bindVertexArray(vao);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
  let off=0;for(const [i,size] of attribs.map((a,i)=>[i,[3,3,3,2,1,3,1][i]])){
   const loc=gl.getAttribLocation(program,attribs[i]);if(loc>=0){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,64,off*4)}off+=size;
  }
  gl.bindVertexArray(null);
  texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program,'uAtlas'),0);
  mesh={vao,count:pos.length/3};
  uniforms=Object.fromEntries(['uYaw','uPitch','uZoom','uExplode','uTime','uPulse','uLit','uAspect'].map(x=>[x,gl.getUniformLocation(program,x)]));
  gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);
 }catch(err){console.error('WebGL küresi oluşturulamadı:',err);errorEl.hidden=false;program=null}
}

// Canvas 2D yedeği: WebGL engellenen tarayıcı ve ortamlarda bile
// küre, gerçek perspektif ve gölgelendirilmiş 3D tuşlar ile görünür.
let fallbackCanvas=canvas;
if(gl&&!program){
 fallbackCanvas=document.createElement('canvas');fallbackCanvas.id='softwareGlobeCanvas';
 fallbackCanvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:grab';
 canvas.style.opacity='0';canvas.after(fallbackCanvas);
 // 2D yedek yüzeyi görünür ve etkileşimli tut: sürükleme için
 // pointer capture görünür canvas üzerinde yapılır.
 fallbackCanvas.tabIndex=0;
 fallbackCanvas.setAttribute('aria-label',canvas.getAttribute('aria-label'));
 fallbackCanvas.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hover=true;setCaption('İNCELEME MODU · FAREYLE DÖNDÜR')}});
 fallbackCanvas.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!drag){hover=false;setCaption('FAREYİ HAREKET ETTİR · TUTUP 360° İNCELE')}});
 fallbackCanvas.addEventListener('pointerdown',e=>{
  if(e.pointerType==='mouse'&&e.button!==0)return;
  drag=true;hover=true;activePointer=e.pointerId;lastPX=e.clientX;lastPY=e.clientY;
  fallbackCanvas.setPointerCapture(e.pointerId);setCaption('SERBEST 360° İNCELEME · HER YÖNE DÖNDÜR');lastInteraction=performance.now();e.preventDefault();
 });
 fallbackCanvas.addEventListener('pointermove',e=>{
  if(!drag||e.pointerId!==activePointer)return;
  setRotation(e.clientX-lastPX,e.clientY-lastPY,.0095);lastPX=e.clientX;lastPY=e.clientY;
 });
 fallbackCanvas.addEventListener('pointerup',e=>{if(activePointer===e.pointerId){stopDrag();try{fallbackCanvas.releasePointerCapture(e.pointerId)}catch{}}});
 fallbackCanvas.addEventListener('pointercancel',stopDrag);
 fallbackCanvas.addEventListener('lostpointercapture',stopDrag);
 fallbackCanvas.addEventListener('keydown',e=>canvas.dispatchEvent(new KeyboardEvent('keydown',{key:e.key,bubbles:true,cancelable:true})));

}
const ctx2d=gl&&program?null:fallbackCanvas.getContext('2d',{alpha:true});
if(ctx2d)errorEl.hidden=true;
const softwareKeys=[];
{
 const n=156,golden=Math.PI*(3-Math.sqrt(5));
 const legends=['K','JS','CSS','HTML','</>','{}','UX','UI','WEB','3D','DEV','01','✦','⌘','AI','ALT','TAB','ESC','CTRL','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','⇧','↵','*','+','/','?','<','>'];
 for(let i=0;i<n;i++){
  const y=1-2*(i+.5)/n,r=Math.sqrt(1-y*y),a=i*golden;
  const radial=[Math.cos(a)*r,y,Math.sin(a)*r];
  const vlen=Math.hypot(radial[2],radial[0])||1;
  const ax=[radial[2]/vlen,0,-radial[0]/vlen];
  const ay=[radial[1]*radial[0]/vlen,-vlen,radial[1]*radial[2]/vlen];
  // flip y basis so front legends read upright
  const uy=ay.map(x=>-x);
  const bright=i%13===0||i%23===1,pink=i%17===2,lav=i%9===4;
  const color=bright?[151,106,204]:pink?[124,75,116]:lav?[90,66,128]:i%3===0?[42,36,58]:i%3===1?[31,29,46]:[56,42,74];
  softwareKeys.push({id:i,radial,ax,ay:uy,color,bright,legend:legends[(i*5+Math.floor(i/5))%legends.length]});
 }
}
function softwareFrame(t){
 if(!ctx2d)return;
 const c=ctx2d,w=fallbackCanvas.clientWidth,h=fallbackCanvas.clientHeight,d=Math.min(devicePixelRatio||1,coarsePointer?1.25:1.7);
 if(fallbackCanvas.width!==Math.round(w*d)||fallbackCanvas.height!==Math.round(h*d)){fallbackCanvas.width=Math.round(w*d);fallbackCanvas.height=Math.round(h*d)}
 c.setTransform(d,0,0,d,0,0);c.clearRect(0,0,w,h);
 const Cx=w*.5,Cy=h*.49,unit=Math.min(w,h)*.155*zoom;
 const cy=Math.cos(yaw),sy=Math.sin(yaw),cx=Math.cos(pitch),sx=Math.sin(pitch);
 function rot(v){const y1=v[1]*cx-v[2]*sx,z1=v[1]*sx+v[2]*cx;return [v[0]*cy+z1*sy,y1,-v[0]*sy+z1*cy]}
 function add(a,b){return [a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
 function mul(a,k){return a.map(x=>x*k)}
 function p3(key,x,y,z){return rot(add(add(add(mul(key.radial,2.43),mul(key.ax,x)),mul(key.ay,y)),mul(key.radial,z+explode*(1.25+.5*Math.sin(key.id*.31-t*.0026))))) }
 function pr(v){const f=8.7/(8.7-v[2]);return [Cx+v[0]*unit*f,Cy-v[1]*unit*f]}
 function shade(n){const l=[-.38,.69,.62],diff=Math.max(0,n[0]*l[0]+n[1]*l[1]+n[2]*l[2]);return .35+.85*diff+.12*Math.max(0,n[0]*.8-n[1]*.2+n[2]*.6)}
 function rgb(base,light){return 'rgb('+base.map(v=>Math.round(clamp(v*light,0,255))).join(',')+')'}
 function poly(pts){c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath()}
 // Light rings and atmospheric specular glow behind the sphere.
 c.save();c.translate(Cx,Cy);c.rotate(-.24);c.strokeStyle='rgba(221,174,255,.15)';c.lineWidth=1;c.setLineDash([4,9]);c.beginPath();c.ellipse(0,0,unit*3.16,unit*1.85,0,0,Math.PI*2);c.stroke();c.setLineDash([]);c.restore();
 const rr=unit*2.23;
 const bg=c.createRadialGradient(Cx-rr*.4,Cy-rr*.52,rr*.02,Cx,Cy,rr*1.15);
 bg.addColorStop(0,'#4d3768');bg.addColorStop(.34,'#241a36');bg.addColorStop(.72,'#100e1e');bg.addColorStop(1,'#06060e');
 c.beginPath();c.arc(Cx,Cy,rr,0,Math.PI*2);c.fillStyle=bg;c.fill();
 c.strokeStyle='rgba(202,152,245,.25)';c.lineWidth=1.4;c.stroke();
 const items=[];
 for(const key of softwareKeys){
  const rn=rot(key.radial);if(rn[2]<-.12)continue;
  const center=rot(mul(key.radial,2.43));
  items.push({key,z:center[2],rn});
 }
 items.sort((a,b)=>a.z-b.z);
 for(const {key,rn} of items){
  const side=.265,top=.222;
  const base=[p3(key,-side,-side,-.12),p3(key,side,-side,-.12),p3(key,side,side,-.12),p3(key,-side,side,-.12)];
  const rim=[p3(key,-side,-side,.08),p3(key,side,-side,.08),p3(key,side,side,.08),p3(key,-side,side,.08)];
  const upper=[p3(key,-top,-top,.16),p3(key,top,-top,.16),p3(key,top,top,.16),p3(key,-top,top,.16)];
  // Draw sidewalls in order, with proper dark side material and edge highlights.
  const sides=[];
  for(let j=0;j<4;j++){
   const jj=(j+1)%4;
   const a=pr(base[j]),b=pr(base[jj]),cc=pr(rim[jj]),dd=pr(rim[j]);
   const normal=rot(j===0?key.ay:j===1?key.ax:j===2?mul(key.ay,-1):mul(key.ax,-1));
   sides.push({pts:[a,b,cc,dd],z:(base[j][2]+base[jj][2]+rim[jj][2]+rim[j][2])/4,normal});
  }
  sides.sort((a,b)=>a.z-b.z);
  for(const sideFace of sides){poly(sideFace.pts);const k=shade(sideFace.normal)*.48;
   const g=c.createLinearGradient(sideFace.pts[0][0],sideFace.pts[0][1],sideFace.pts[2][0],sideFace.pts[2][1]);
   g.addColorStop(0,rgb(key.color,k*.7));g.addColorStop(1,rgb(key.color,k*1.5));c.fillStyle=g;c.fill();
   c.strokeStyle='rgba(0,0,0,.38)';c.lineWidth=.8;c.stroke();
  }
  // Beveled shoulder, each edge gets its own soft specular reflection.
  for(let j=0;j<4;j++){
   const jj=(j+1)%4;const q=[pr(rim[j]),pr(rim[jj]),pr(upper[jj]),pr(upper[j])];poly(q);
   const light=shade(rn)*(j===2?1.42:j===0?.80:1.1);
   const g=c.createLinearGradient(q[0][0],q[0][1],q[2][0],q[2][1]);
   g.addColorStop(0,rgb(key.color,light*.86));g.addColorStop(1,rgb(key.color,light*1.7));c.fillStyle=g;c.fill();
   c.strokeStyle='rgba(238,213,255,.12)';c.lineWidth=.65;c.stroke();
  }
  const quad=upper.map(pr);
  poly(quad);
  const glint=shade(rn);
  const grad=c.createLinearGradient(quad[0][0],quad[0][1],quad[2][0],quad[2][1]);
  grad.addColorStop(0,rgb(key.color,glint*1.85));grad.addColorStop(.36,rgb(key.color,glint*1.18));grad.addColorStop(1,rgb(key.color,glint*.66));
  c.fillStyle=grad;c.shadowColor='rgba(0,0,0,.55)';c.shadowBlur=6;c.fill();c.shadowBlur=0;
  c.lineWidth=.9;c.strokeStyle=key.bright?'rgba(244,215,255,.7)':'rgba(212,183,244,.37)';c.stroke();
  // Perspective-correct-looking printed legends via local top-face transform.
  const v0=quad[0],v1=quad[1],v3=quad[3],cen=[(quad[0][0]+quad[2][0])/2,(quad[0][1]+quad[2][1])/2];
  const vx=[(v1[0]-v0[0])/.444,(v1[1]-v0[1])/.444],vy=[-(v3[0]-v0[0])/.444,-(v3[1]-v0[1])/.444];
  c.save();c.transform(vx[0],vx[1],vy[0],vy[1],cen[0],cen[1]);
  c.textAlign='center';c.textBaseline='middle';c.font=`700 ${key.legend.length>3?.14:key.legend.length>2?.16:key.legend.length>1?.20:.245}px ui-monospace,Consolas,monospace`;
  c.fillStyle=key.bright?'rgba(25,13,35,.93)':lit?'rgba(234,212,255,.97)':'rgba(176,166,189,.85)';
  c.shadowColor=lit?'rgba(193,123,255,.9)':'transparent';c.shadowBlur=lit?(.025+pulse*.04):0;
  c.fillText(key.legend,0,.006,.39);c.shadowBlur=0;
  c.strokeStyle='rgba(238,210,255,.23)';c.lineWidth=.006;c.beginPath();c.moveTo(-.14,-.145);c.lineTo(.14,-.145);c.stroke();
  c.restore();
 }
 // Lens glint across the upper-left hemisphere.
 const sheen=c.createRadialGradient(Cx-rr*.35,Cy-rr*.43,1,Cx-rr*.18,Cy-rr*.28,rr*.78);
 sheen.addColorStop(0,'rgba(255,226,255,.11)');sheen.addColorStop(1,'rgba(255,226,255,0)');
 c.beginPath();c.arc(Cx,Cy,rr,0,Math.PI*2);c.fillStyle=sheen;c.fill();
}

let lastTime=0;
function frame(t){
 frameHandle=0;
 // Do not consume GPU or battery when the globe is out of view or the tab is hidden.
 if(!visible||document.hidden)return;
 const frameInterval=coarsePointer?1000/30:1000/60;
 if(lastDraw&&t-lastDraw<frameInterval){ensureFrame();return}
 const dt=Math.min(42,t-(lastTime||t));lastTime=t;lastDraw=t;
 if(!reduced&&!drag&&!hover&&t-lastInteraction>2600)targetYaw+=dt*.00015;
 const ease=reduced?1:1-Math.exp(-dt*.015);
 yaw+=(targetYaw-yaw)*ease;pitch+=(targetPitch-pitch)*ease;zoom+=(targetZoom-zoom)*ease;
 explode+=(explodeTarget-explode)*(reduced?1:.07);pulse*=reduced?0:.974;
 if(gl&&program){
  const d=Math.min(devicePixelRatio||1,coarsePointer?1.25:1.7),w=Math.max(1,Math.round(canvas.clientWidth*d)),h=Math.max(1,Math.round(canvas.clientHeight*d));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
  gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  gl.useProgram(program);gl.bindVertexArray(mesh.vao);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
  gl.uniform1f(uniforms.uYaw,yaw);gl.uniform1f(uniforms.uPitch,pitch);gl.uniform1f(uniforms.uZoom,zoom);
  gl.uniform1f(uniforms.uExplode,explode);gl.uniform1f(uniforms.uTime,t*.001);
  gl.uniform1f(uniforms.uPulse,pulse);gl.uniform1f(uniforms.uLit,lit?1:0);gl.uniform1f(uniforms.uAspect,w/h);
  gl.drawArrays(gl.TRIANGLES,0,mesh.count);
 }else if(ctx2d){softwareFrame(t)}
 // Reduced-motion users still get full control, without perpetual idle animation.
 if(!reduced||t-lastInteraction<900)ensureFrame();
}
})();
