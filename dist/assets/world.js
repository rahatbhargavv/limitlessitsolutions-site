(function(){
'use strict';
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var D=document,de=D.documentElement,home=D.body.classList.contains('home');
var cv=D.getElementById('world');if(!cv)return;
var mo=D.getElementById('motes'),mctx=mo&&mo.getContext('2d');
var pre=D.querySelector('.pre'),preN=pre&&pre.querySelector('.pre-n');
var stages=D.getElementById('stages');
var seen=false;try{seen=sessionStorage.getItem('lis-pre')==='1'}catch(e){}
var preDone=false;
function hidePre(){if(preDone||!pre)return;preDone=true;pre.classList.add('done');setTimeout(function(){if(pre.parentNode)pre.parentNode.removeChild(pre)},1000)}
var preStart=performance.now(),firstFrame=false;
if(pre){if(seen||reduce)hidePre();else{try{sessionStorage.setItem('lis-pre','1')}catch(e){}
 (function tick(){if(preDone)return;var p=Math.min(1,(performance.now()-preStart)/1100);if(preN)preN.textContent=Math.round(p*100);
  if(p>=1&&(firstFrame||de.classList.contains('nogl')))return hidePre();requestAnimationFrame(tick)})();
 setTimeout(hidePre,4500)}}
var HQ=/[?&]hq/.test(location.search),FU=(location.search.match(/[?&]u=([0-9.]+)/)||[])[1];
var small=innerWidth<760;
var K=1,lastScr=-1e5,mx=0,my=0,tx=0,ty=0,us=0,target=0,vel=0,lastY=scrollY,active=true,raf=0,t0=performance.now(),ft=[],lastNow=0,R=null;
function worldEnd(){return home&&stages?stages.offsetTop+stages.offsetHeight:innerHeight*1.15}
function calcTarget(){var y=scrollY;if(FU!==undefined){target=+FU;active=true;return}if(home&&stages){var m=stages.offsetTop+stages.offsetHeight-innerHeight;target=m>0?Math.max(0,Math.min(1,y/m)):0}else target=.1+.5*Math.min(1,y/innerHeight);
 var vis=y<worldEnd()+60;if(vis&&!active){active=true;wake()}else if(!vis)active=false}
addEventListener('mousemove',function(e){tx=e.clientX/innerWidth*2-1;ty=1-e.clientY/innerHeight*2},{passive:true});
addEventListener('scroll',function(){lastScr=performance.now();var y=scrollY;vel=y-lastY;lastY=y;calcTarget();wake()},{passive:true});
// motes
var N=small?22:44,motes=[];for(var i=0;i<N;i++)motes.push({x:Math.random(),y:Math.random(),z:.25+Math.random()*.75,p:Math.random()*6.28,s:.4+Math.random()});
function drawMotes(now,k){if(!mctx||reduce)return;var w=mo.width,h=mo.height;mctx.clearRect(0,0,w,h);
 var r=Math.round(255+(125-255)*k),g=Math.round(226+(240-226)*k),b=Math.round(160+(214-160)*k);
 mctx.globalCompositeOperation='lighter';
 for(var i=0;i<motes.length;i++){var m=motes[i];
  m.y-=(.00006*m.s+vel*.00004)*m.z*(h/800+.4);m.x+=Math.sin(now*.0004*m.s+m.p)*.00012*m.z+mx*.00008*m.z;
  if(m.y<-.05){m.y=1.05;m.x=Math.random()}if(m.x<-.05)m.x=1.05;if(m.x>1.05)m.x=-.05;
  var a=(.35+.55*Math.abs(Math.sin(now*.0012*m.s+m.p)))*m.z,rad=(.5+m.z*.9)*(w/1280+.5);
  mctx.fillStyle='rgba('+r+','+g+','+b+','+(a*.16).toFixed(3)+')';mctx.beginPath();mctx.arc(m.x*w,m.y*h,rad*2.2,0,6.283);mctx.fill();
  mctx.fillStyle='rgba('+r+','+g+','+b+','+Math.min(1,a*1.1).toFixed(3)+')';mctx.beginPath();mctx.arc(m.x*w,m.y*h,rad*.62,0,6.283);mctx.fill()}
 vel*=.9}
var frameFn=null;function wake(){if(active&&!raf&&R&&frameFn)raf=requestAnimationFrame(frameFn)}
function fail(e){if(e)console.error('world: '+(e.message||e));de.classList.add('nogl')}

// ---------- terrain height (CPU port of the original field) ----------
function fr(v){return v-Math.floor(v)}
function hs(x,y){x=fr(x*123.34);y=fr(y*456.21);var d=x*(x+45.32)+y*(y+45.32);x+=d;y+=d;return fr(x*y)}
function vnz(x,y){var ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);
 var a=hs(ix,iy),b=hs(ix+1,iy),c=hs(ix,iy+1),d=hs(ix+1,iy+1);return (a+(b-a)*fx)+((c+(d-c)*fx)-(a+(b-a)*fx))*fy}
function fbmN(x,y,n){var v=0,a=.5;for(var i=0;i<n;i++){v+=a*vnz(x,y);var nx=x*2.02+3.1,ny=y*2.02+1.7;x=nx;y=ny;a*=.5}return v}
function sst(a,b,x){var t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)}
var BX=3.2,BZ=14.5;
function H(x,z){
 var n=fbmN(x*.11,z*.11,5);
 var r=1-Math.abs(2*fbmN(x*.055+7.3,z*.055+7.3,5)-1);
 var xc=x-2.5*Math.sin(z*.09);
 var side=sst(3,17,Math.abs(xc));
 var far=sst(26,62,z);
 var A=1.2+9.5*side+11*far;
 var lake=Math.exp(-xc*xc*.022)*sst(-3,5,z)*(1-sst(32,50,z));
 var h=n*2.4-1.1+Math.pow(r,2.2)*A*(1-.8*lake)-3.6*lake;
 h+=4.4*Math.exp(-((x-BX)*(x-BX)+(z-BZ)*(z-BZ))*.1);
 var mqx=(x-14)*.075,mqz=(z-27)*.055,mm=Math.exp(-(mqx*mqx+mqz*mqz));
 var rid=1-Math.abs(2*fbmN(x*.16+3.7,z*.16+3.7,5)-1);
 var gul=1-Math.abs(2*fbmN(x*.55+3,z*.22+9,3)-1),g3=gul*gul*gul;
 h+=mm*(15+2.4*rid*rid+.9*fbmN(x*.5,z*.5,5)-2.2*g3);
 h-=.55*Math.min(1,Math.max(0,side+far*.8))*g3*(1-lake);
 return h}
function forestDen(x,z,h,ny){
 var nz=fbmN(x*1.3,z*1.3,3);
 var f=sst(.2,.34,fbmN(x*.09+2,z*.09+2,3))*sst(.46,.68,ny)*sst(.25,1,h)*(1-sst(6.5,9.5,h+nz*1.2));
 return Math.min(1,f*1.6)}

// ---------- shader snippets ----------
var NOISE_GLSL=`float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 hash2(vec2 p){return vec2(hash(p),hash(p+vec2(37.1,11.7)));}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
float fb3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
`;
var SKY_GLSL=`vec3 sky(vec3 rd){
 float y=max(rd.y,0.);
 vec3 col=mix(horCol,topCol,pow(y,.45));
 float sd=max(dot(rd,sunDir),0.);
 col+=sunCol*(pow(sd,6.)*.22+pow(sd,40.)*.45+pow(sd,420.)*2.6)*sunI;
 if(night>.01&&rd.y>.02){
  vec2 sp=rd.xz/(rd.y+.22);
  float fade=night*smoothstep(.04,.3,rd.y);
  vec3 st=vec3(0.);
  for(int i=0;i<3;i++){
   float fi=float(i);
   float s=22.+fi*24.+fi*fi*10.;
   float th=.982-.016*fi-.012*fi*fi*.5;
   float rr=.16+.07*fi;
   vec2 g=sp*s;vec2 id=floor(g);float h=hash(id+fi*17.3);
   vec2 o=.25+.5*hash2(id+3.7);
   float d=length(fract(g)-o);
   float br=step(th,h)*smoothstep(rr,0.,d);
   float tw=.62+.38*sin(T*(1.4+4.*hash(id+9.1))+h*80.);
   vec3 tc=mix(vec3(.62,.76,1.),vec3(1.,.8,.58),hash(id+5.5));
   st+=tc*br*tw*(1.9-.45*fi);}
  vec3 bn=normalize(vec3(.5,.3,-.8));
  float bd=dot(rd,bn);
  float band=exp(-bd*bd*13.);
  float dust=fb3(sp*2.2+1.3);
  float lane=smoothstep(.5,.72,fb3(sp*4.2+7.))*.75;
  vec3 mw=mix(vec3(.26,.31,.50),vec3(.62,.52,.42),exp(-bd*bd*55.))*band*(.3+1.1*dust)*(1.-lane);
  vec2 fg2=sp*120.;vec2 fi2=floor(fg2);float fine=step(.86,hash(fi2+2.3))*smoothstep(.2,.0,length(fract(fg2)-.25-.5*hash2(fi2)))*band*(1.-lane);
  col+=(st+mw*.55+vec3(.7,.8,1.)*fine*.5)*fade;
  float md=dot(rd,moonDir);
  col+=vec3(.6,.72,1.)*(pow(max(md,0.),160.)*.5+pow(max(md,0.),14.)*.08)*night;
  float crat=.72+.28*fb3((rd.xy-moonDir.xy)*230.);
  col=mix(col,vec3(1.,.98,.92)*crat*1.6,smoothstep(.99935,.9996,md)*night);}
 if(rd.y>.015){
  vec2 uv=rd.xz/(rd.y+.18)*1.15+vec2(T*.007,0.);
  float c1=fb3(uv*1.2),c2=fb3(uv*1.2+sunDir.xz*.1);
  float dens=smoothstep(.42,.74,c1);
  float lite=clamp(.62+(c1-c2)*5.-.4*dens,0.,1.);
  vec3 csh=horCol*.42+topCol*.28+.02;
  vec3 clt=vec3(1.,.97,.92)*(.7+.5*sunI)+sunCol*(.25+.45*sd);
  vec3 cl=mix(csh,clt,lite);
  cl=mix(cl,topCol*1.6+.035+vec3(.04,.05,.09)*night,night*.85);
  float hz=smoothstep(.015,.22,rd.y);
  col=mix(col,cl,dens*.88*hz);
  vec2 u2=rd.xz/(rd.y+.34)*vec2(.55,2.3)+vec2(T*.004,0.);
  float ci=smoothstep(.55,.88,fb3(u2*2.1))*.3*smoothstep(.12,.5,rd.y);
  col=mix(col,clt*.95*(1.-.6*night),ci);}
 if(dayK>.02&&rd.y>.1){
  float an=atan(rd.x,rd.z);
  for(int k=0;k<4;k++){
   float fk=float(k);
   vec2 c=vec2(.55+fk*.32+T*.022*(1.+.2*fk),.34+.07*fk+.04*sin(T*.3+fk*2.));
   vec2 d=vec2(an-c.x,rd.y-c.y)*vec2(1.,1.);
   float fl=.55+.5*sin(T*(6.5+fk)+fk*1.7);
   float v=abs(d.y+abs(d.x)*(.5+.6*fl)-.0);
   float b=smoothstep(.0024,.0,v)*step(abs(d.x),.022);
   col=mix(col,vec3(.07,.08,.1),b*dayK*.85);}}
 return col;}
`;
var SKY_FS=`precision highp float;uniform float T;uniform vec3 uTop,uHor,uSunDir,uSunCol,uMoonDir;uniform float uSunI,uNight,uDayK;varying vec3 vDir;
vec3 topCol,horCol,sunDir,sunCol,moonDir;float sunI,night,dayK;
`+NOISE_GLSL+SKY_GLSL+`
void main(){topCol=uTop;horCol=uHor;sunDir=uSunDir;sunCol=uSunCol;moonDir=uMoonDir;sunI=uSunI;night=uNight;dayK=uDayK;
 vec3 c=sky(normalize(vDir));c=pow(max(c,0.),vec3(2.2));gl_FragColor=vec4(c,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
var WATER_FS=`precision highp float;uniform float T,uSunI,uNight,uFogD;uniform vec2 uRes;uniform vec3 uSunDir,uSunCol,uMoonDir,uFog,uCam;uniform vec4 uBox;uniform sampler2D uRefl,uDepth;uniform mat4 uRM;varying vec3 vW;
`+NOISE_GLSL+`
vec3 lin(vec3 c){return pow(c,vec3(2.2));}
void main(){
 vec3 p=vW;float dist=length(uCam-p);vec3 V=(uCam-p)/dist;
 float amp=.12/(1.+dist*.22);
 vec2 w=vec2(vn(p.xz*1.6+vec2(T*.35,T*.2))-.5,vn(p.xz*1.9+vec2(-T*.25,T*.3))-.5)+.5*vec2(vn(p.xz*4.2+vec2(T*.6,-T*.4))-.5,vn(p.xz*4.8+vec2(-T*.5,T*.55))-.5);
 vec3 n=normalize(vec3(w.x*amp*4.,1.,w.y*amp*4.));
 float F=.02+.98*pow(1.-clamp(dot(n,V),0.,1.),5.);
 vec4 rc=uRM*vec4(p,1.);vec2 rUV=rc.xy/rc.w*.5+.5;
 vec3 refl=texture2D(uRefl,rUV+n.xz*(.035/(1.+dist*.05))).rgb;
 float depth=texture2D(uDepth,(p.xz-uBox.xy)/uBox.zw).r*3.;
 vec3 body=mix(lin(vec3(.10,.30,.30)),lin(vec3(.02,.10,.17)),smoothstep(0.,2.4,depth))*(.35+.5*uSunI+.5*uNight*.25);
 vec3 col=mix(body,refl,clamp(F*.9+.34,0.,1.));
 vec3 r=reflect(-V,n);
 float spk=smoothstep(.6,.95,vn(p.xz*vec2(16.,24.)+vec2(T*1.1,-T*.8)))*(1.-smoothstep(20.,60.,dist)*.6);
 float sg=max(dot(r,uSunDir),0.);
 col+=uSunCol*uSunI*(pow(sg,50.)*.45+pow(sg,380.)*3.)*spk*(1.-uNight);
 col+=vec3(.7,.8,1.)*pow(max(dot(r,uMoonDir),0.),260.)*spk*2.*uNight;
 float fo=smoothstep(.26,.0,depth+.08*(vn(p.xz*5.+T*.4)-.5))*(.55+.45*sin(p.x*3.+p.z*2.-T*1.4));
 col+=vec3(.9,.95,1.)*fo*.18*(.25+uSunI*.8*(1.-uNight)+.25*uNight);
 float a=smoothstep(0.,.05,depth);
 float fg=1.-exp(-dist*dist*uFogD*uFogD);col=mix(col,uFog,fg);
 gl_FragColor=vec4(col,a);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
var TERR_HELP=``;
function mix4(a,b,c,d,u){var s1=sst(0,.38,u),s2=sst(.38,.72,u),s3=sst(.72,1,u),r=[0,0,0];
 for(var i=0;i<3;i++){var v=a[i]+(b[i]-a[i])*s1;v=v+(c[i]-v)*s2;r[i]=v+(d[i]-v)*s3}return r}
function nrmz(a){var l=Math.hypot(a[0],a[1],a[2]);return [a[0]/l,a[1]/l,a[2]/l]}

function start(THREE){
var renderer;
try{renderer=new THREE.WebGLRenderer({canvas:cv,antialias:!small&&!HQ?true:false,alpha:false,powerPreference:'high-performance'})}catch(e){return fail(e)}
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
var lite=false;try{var gx=renderer.getContext(),dbg=gx.getExtension('WEBGL_debug_renderer_info');lite=!!dbg&&/swiftshader|llvmpipe|software|softpipe/i.test(gx.getParameter(dbg.UNMASKED_RENDERER_WEBGL))&&!/[?&]full/.test(location.search)}catch(e){}
var lo=small||lite;if(lite)de.classList.add('lite');renderer.shadowMap.enabled=!lo;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
var scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(64,1,.1,700),rcam=new THREE.PerspectiveCamera(64,1,.1,700);
scene.fog=new THREE.FogExp2(0xbcd0d8,.014);
var baseDpr=HQ?2:lite?.5:(small?.85:1)*Math.min(devicePixelRatio||1,1.5),minDpr=lite?.4:small?.55:.8,dpr=HQ?baseDpr:baseDpr*(lite?1:.6),warm=!HQ&&!lite;
var rt=new THREE.WebGLRenderTarget(256,128,{type:THREE.HalfFloatType,depthBuffer:true});
function size(){var w=cv.clientWidth,h=cv.clientHeight;renderer.setPixelRatio(dpr*K);renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();rcam.aspect=cam.aspect;rcam.updateProjectionMatrix();
 var rw=Math.max(64,Math.round(w*dpr*K*.42)),rh=Math.max(32,Math.round(h*dpr*K*.42));if(rt.width!==rw||rt.height!==rh)rt.setSize(rw,rh);
 if(waterMat)waterMat.uniforms.uRes.value.set(rt.width,rt.height);
 if(mo){mo.width=innerWidth;mo.height=innerHeight}}
var waterMat=null;

// textures
var loader=new THREE.TextureLoader(),TX={};
function ltex(n,srgb){return new Promise(function(res,rej){loader.load('/assets/tex/'+n+'.webp',function(t){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(srgb)t.colorSpace=THREE.SRGBColorSpace;TX[n]=t;res()},undefined,function(){rej(new Error('texture '+n+' failed'))})})}
Promise.all([['rock_d',1],['rock_n',0],['grass_d',1],['grass_n',0],['snow_d',1],['forest_d',1],['shore_d',1]].map(function(a){return ltex(a[0],a[1])})).then(build).catch(fail);

async function build(){var tick=function(){return new Promise(function(r){setTimeout(r,0)})};
// ----- lights -----
var sun=new THREE.DirectionalLight(0xffffff,3);sun.castShadow=!lo;
sun.shadow.mapSize.set(2048,2048);var sc=sun.shadow.camera;sc.left=-46;sc.right=46;sc.top=46;sc.bottom=-46;sc.near=1;sc.far=260;sun.shadow.bias=-.0005;sun.shadow.normalBias=.06;
scene.add(sun);scene.add(sun.target);sun.target.position.set(2,2,22);
var hemi=new THREE.HemisphereLight(0xaad0ff,0x445522,.9);scene.add(hemi);var amb=new THREE.AmbientLight(0x6a86c8,0);scene.add(amb);

// ----- terrain mesh -----
var X0=-48,X1=48,Z0=-14,Z1=100,NX=lo?240:380,NZ=lo?280:430,nv=(NX+1)*(NZ+1);
var pos=new Float32Array(nv*3),forA=new Float32Array(nv),HT=new Float32Array(nv);
var tl=performance.now();
for(var j=0;j<=NZ;j++){if(performance.now()-tl>8){await tick();tl=performance.now()}for(var i=0;i<=NX;i++){var k=j*(NX+1)+i,x=X0+(X1-X0)*i/NX,z=Z0+(Z1-Z0)*j/NZ,h=H(x,z);HT[k]=h;pos[k*3]=x;pos[k*3+1]=h;pos[k*3+2]=z}}
var idx=new Uint32Array(NX*NZ*6),q=0;
for(var j=0;j<NZ;j++)for(var i=0;i<NX;i++){var a=j*(NX+1)+i,b=a+1,c=a+NX+1,d=c+1;idx[q++]=a;idx[q++]=c;idx[q++]=b;idx[q++]=b;idx[q++]=c;idx[q++]=d}
var tg=new THREE.BufferGeometry();tg.setAttribute('position',new THREE.BufferAttribute(pos,3));tg.setIndex(new THREE.BufferAttribute(idx,1));tg.computeVertexNormals();
var nor=tg.attributes.normal.array;
for(var k=0;k<nv;k++)forA[k]=forestDen(pos[k*3],pos[k*3+2],pos[k*3+1],nor[k*3+1]);
tg.setAttribute('aForest',new THREE.BufferAttribute(forA,1));
var tmat=new THREE.MeshStandardMaterial({roughness:.94,metalness:0});
tmat.onBeforeCompile=function(sh){
 sh.uniforms.tRockD={value:TX.rock_d};sh.uniforms.tRockN={value:TX.rock_n};sh.uniforms.tGrassD={value:TX.grass_d};sh.uniforms.tGrassN={value:TX.grass_n};sh.uniforms.tSnowD={value:TX.snow_d};sh.uniforms.tForestD={value:TX.forest_d};sh.uniforms.tShoreD={value:TX.shore_d};
 sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nattribute float aForest;varying vec3 vWP;varying vec3 vWN;varying float vFor;').replace('#include <begin_vertex>','#include <begin_vertex>\nvWP=position;vWN=normal;vFor=aForest;');
 sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform sampler2D tRockD,tRockN,tGrassD,tGrassN,tSnowD,tForestD,tShoreD;varying vec3 vWP;varying vec3 vWN;varying float vFor;')
 .replace('#include <map_fragment>',`
 vec3 wn=normalize(vWN);float sl=1.-wn.y;float hh=vWP.y;
 float n1=texture2D(tSnowD,vWP.xz*.011).g,n2=texture2D(tForestD,vWP.xz*.023).g;
 vec3 bw=pow(abs(wn),vec3(5.));bw/=bw.x+bw.y+bw.z;
 vec2 ux=vWP.zy,uy=vWP.xz,uz=vWP.xy;
 vec3 rk=texture2D(tRockD,ux*.16).rgb*bw.x+texture2D(tRockD,uy*.16).rgb*bw.y+texture2D(tRockD,uz*.16).rgb*bw.z;
 vec3 rk2=texture2D(tRockD,ux*.041+.3).rgb*bw.x+texture2D(tRockD,uy*.041+.3).rgb*bw.y+texture2D(tRockD,uz*.041+.3).rgb*bw.z;
 rk=mix(rk,rk2*1.3,.45);rk=mix(rk,vec3(dot(rk,vec3(.33))),.72)*vec3(.98,1.0,1.1)*1.25;
 vec3 gr=mix(texture2D(tGrassD,uy*.30).rgb,texture2D(tGrassD,uy*.071+.4).rgb*1.3,.5);
 gr=mix(gr,vec3(dot(gr,vec3(.33))),.25)*mix(vec3(.62,1.15,.42),vec3(.92,1.08,.42),n1)*1.2;
 vec3 fl=texture2D(tForestD,uy*.35).rgb*vec3(.55,.8,.5);
 vec3 sd=texture2D(tShoreD,uy*.5).rgb;
 vec3 sn=texture2D(tSnowD,uy*.3).rgb*1.12;
 float fW=smoothstep(.12,.7,vFor);
 vec3 col=mix(gr,fl,fW);
 float shW=smoothstep(.8,.05,hh+(n2-.5)*.35);col=mix(col,sd,shW);
 float rW=clamp(smoothstep(.30,.50,sl+(n1-.5)*.2)+smoothstep(9.,14.,hh)*.6,0.,1.);
 col=mix(col,rk,rW);
 float sW=smoothstep(10.2,13.4,hh+(n1-.5)*4.)*smoothstep(.62,.28,sl+(n2-.5)*.2);
 col=mix(col,sn,sW);
 col*=.88+.24*n2;
 diffuseColor.rgb=col;`)
 .replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 vec3 gN=texture2D(tGrassN,uy*.30).xyz*2.-1.;
 vec3 rNx=texture2D(tRockN,ux*.16).xyz*2.-1.,rNy=texture2D(tRockN,uy*.16).xyz*2.-1.,rNz=texture2D(tRockN,uz*.16).xyz*2.-1.;
 vec3 off=vec3(gN.x,0.,gN.y)*.6*(1.-rW)*(1.-sW);
 off+=(vec3(0.,rNx.y,rNx.x)*bw.x+vec3(rNy.x,0.,rNy.y)*bw.y+vec3(rNz.x,rNz.y,0.)*bw.z)*1.2*rW;
 normal=normalize((viewMatrix*vec4(normalize(wn+off),0.)).xyz);`)};
var terrain=new THREE.Mesh(tg,tmat);terrain.castShadow=!lo;terrain.receiveShadow=!lo;terrain.frustumCulled=false;scene.add(terrain);

await tick();
// ----- height-based depth texture for the lake -----
var DW=256,DH=256,dd=new Uint8Array(DW*DH),DX0=-48,DXW=96,DZ0=-14,DZW=114;
for(var j=0;j<DH;j++){if(performance.now()-tl>8){await tick();tl=performance.now()}for(var i=0;i<DW;i++){var x=DX0+DXW*i/(DW-1),z=DZ0+DZW*j/(DH-1);dd[j*DW+i]=Math.max(0,Math.min(255,Math.round(-H(x,z)/3*255)))}}
var dtex=new THREE.DataTexture(dd,DW,DH,THREE.RedFormat,THREE.UnsignedByteType);dtex.minFilter=dtex.magFilter=THREE.LinearFilter;dtex.needsUpdate=true;

await tick();
// ----- trees -----
function merge(parts){var P=[],Nn=[],C=[],I=[],o=0;parts.forEach(function(pt){var g=pt.g,p=g.attributes.position,n=g.attributes.normal,ix=g.index;
 for(var i=0;i<p.count;i++){P.push(p.getX(i),p.getY(i),p.getZ(i));Nn.push(n.getX(i),n.getY(i),n.getZ(i));
  var t=Math.max(0,Math.min(1,(p.getY(i)-pt.y0)/pt.h)),c=pt.c0.map(function(v,k){return v+(pt.c1[k]-v)*t});C.push(c[0],c[1],c[2])}
 if(ix){for(var i=0;i<ix.count;i++)I.push(ix.getX(i)+o)}else{for(var i=0;i<p.count;i++)I.push(i+o)}o+=p.count});
 var g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));g.setIndex(I);return g}
function cone(r,h,y,seg){var g=new THREE.ConeGeometry(r,h,seg,1,false);g.translate(0,y+h/2,0);return g}
var trunk=function(h,r){var g=new THREE.CylinderGeometry(r*.7,r,h,5);g.translate(0,h/2,0);return g};
var lc=function(a){return a.map(function(v){return Math.pow(v,2.2)})};
var conGeo=merge([{g:trunk(.35,.06),y0:0,h:.35,c0:lc([.16,.11,.07]),c1:lc([.22,.15,.09])},
 {g:cone(.46,.85,.22,8),y0:.22,h:.85,c0:lc([.07,.18,.09]),c1:lc([.12,.30,.14])},
 {g:cone(.36,.75,.7,8),y0:.7,h:.75,c0:lc([.08,.20,.10]),c1:lc([.15,.34,.16])},
 {g:cone(.24,.7,1.12,8),y0:1.12,h:.7,c0:lc([.10,.24,.12]),c1:lc([.20,.40,.18])}]);
var bg=new THREE.IcosahedronGeometry(.5,2);var bp=bg.attributes.position;for(var i=0;i<bp.count;i++){var x=bp.getX(i),y=bp.getY(i),z=bp.getZ(i),f=.82+.36*hs(x*9.1+y*3.3,z*7.7+y*5.1);bp.setXYZ(i,x*f*1.08,y*f*.88,z*f*1.08)}
var bn=bg.attributes.normal;for(var i=0;i<bp.count;i++){var nx=bp.getX(i),ny=bp.getY(i)*1.25,nz=bp.getZ(i),l=Math.hypot(nx,ny,nz)||1;bn.setXYZ(i,nx/l,ny/l,nz/l)}bg.translate(0,.88,0);
var broadGeo=merge([{g:trunk(.62,.07),y0:0,h:.62,c0:lc([.32,.28,.24]),c1:lc([.2,.16,.12])},{g:bg,y0:.4,h:1,c0:lc([.1,.2,.05]),c1:lc([.3,.44,.12])}]);
function treeMat(){var m=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.9,metalness:0});
 m.onBeforeCompile=function(sh){sh.uniforms.uT=treeU;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float uT;').replace('#include <begin_vertex>','#include <begin_vertex>\nfloat sw=sin(uT*1.3+instanceMatrix[3].x*1.7+instanceMatrix[3].z*1.3)*.03*max(position.y,0.);transformed.x+=sw;transformed.z+=sw*.6;')};return m}
var treeU={value:0};
var cons=[],brds=[],rnd=function(){return Math.random()};
async function place(x0,x1,z0,z1,step,sc){var tl2=performance.now();for(var z=z0;z<z1;z+=step){if(performance.now()-tl2>8){await tick();tl2=performance.now()}for(var x=x0;x<x1;x+=step){
  var jx=x+(rnd()-.5)*step*.95,jz=z+(rnd()-.5)*step*.95,h=H(jx,jz);if(h<.3||h>9.2)continue;
  var e=.4,ny=.4/Math.hypot(H(jx-e,jz)-H(jx+e,jz),.8,H(jx,jz-e)-H(jx,jz+e))*1;ny=Math.abs(.8)/Math.hypot(H(jx-e,jz)-H(jx+e,jz),.8,H(jx,jz-e)-H(jx,jz+e));
  var f=forestDen(jx,jz,h,ny);if(rnd()>f*.92)continue;if(Math.abs(jx)<5&&jz<11&&h<1.4)continue;
  var zone=Math.min(1,Math.max(0,fbmN(jx*.07+5,jz*.07+5,3)*1.3+h*.08-.22)),s=sc*(.75+.6*rnd());
  var t={x:jx,y:h-.05,z:jz,s:s,r:rnd()*6.28};(rnd()<(.12+.84*zone)?cons:brds).push(t)}}}
await place(-34,34,-6,26,lo?.5:.34,.5);await place(-40,40,26,52,lo?.75:.52,.78);await place(-46,46,52,86,lo?1.1:.8,1.25);
function inst(geo,arr,autumn){var m=new THREE.InstancedMesh(geo,treeMat(),arr.length),M=new THREE.Matrix4(),Q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),C=new THREE.Color(),Y=new THREE.Vector3(0,1,0);
 arr.forEach(function(t,i){Q.setFromAxisAngle(Y,t.r);S.set(t.s*(.85+.3*rnd()),t.s*(autumn?.95:1.05+.3*rnd()),t.s*(.85+.3*rnd()));P.set(t.x,t.y,t.z);M.compose(P,Q,S);m.setMatrixAt(i,M);
  var v=.8+.4*rnd();if(autumn){var r=rnd();if(r>.96)C.setRGB(1.5,.55,.18);else if(r>.9)C.setRGB(1.3,1.1,.3);else if(r>.55)C.setRGB(.9*v,1.1*v,.7*v);else C.setRGB(.8*v,1.02*v,.6*v)}else C.setRGB(v,v*(.95+.1*rnd()),v*(.9+.2*rnd()));m.setColorAt(i,C)});
 m.castShadow=!lo;m.receiveShadow=!lo;m.frustumCulled=false;scene.add(m);return m}
if(cons.length)inst(conGeo,cons,false);if(brds.length)inst(broadGeo,brds,true);

await tick();
// ----- boulders -----
var rg=new THREE.IcosahedronGeometry(1,2),rp=rg.attributes.position;for(var i=0;i<rp.count;i++){var x=rp.getX(i),y=rp.getY(i),z=rp.getZ(i),f=.75+.5*hs(x*5.3+z*2.1,y*4.7+x*3.3);rp.setXYZ(i,x*f*1.2,y*f*.75,z*f)}rg.computeVertexNormals();
var rocks=[];for(var tries=0;tries<9000&&rocks.length<420;tries++){var x=-44+88*rnd(),z=-8+70*rnd(),h=H(x,z);if(h<-.05||h>9)continue;var e=.4,ny=.8/Math.hypot(H(x-e,z)-H(x+e,z),.8,H(x,z-e)-H(x,z+e));
 var shore=h<.45,ok=shore||(ny<.8&&ny>.35&&rnd()<.5)||rnd()<.04;if(!ok)continue;if(Math.abs(x)<4&&z<10)continue;rocks.push({x:x,y:h,z:z,s:(shore?.08+.22*rnd():.1+.4*rnd())*(1+z*.01),r:rnd()*6.28})}
var rmat=new THREE.MeshStandardMaterial({map:TX.rock_d,roughness:.95,color:0x9c9ca2});
var rm=new THREE.InstancedMesh(rg,rmat,rocks.length),M2=new THREE.Matrix4(),Q2=new THREE.Quaternion(),S2=new THREE.Vector3(),P2=new THREE.Vector3(),Yv=new THREE.Vector3(0,1,0);
rocks.forEach(function(t,i){Q2.setFromAxisAngle(Yv,t.r);S2.set(t.s,t.s*(.7+.4*rnd()),t.s);P2.set(t.x,t.y-.05*t.s,t.z);M2.compose(P2,Q2,S2);rm.setMatrixAt(i,M2)});rm.castShadow=!lo;rm.receiveShadow=!lo;rm.frustumCulled=false;scene.add(rm);

await tick();
// ----- sky dome -----
var skyU={T:{value:0},uTop:{value:new THREE.Vector3()},uHor:{value:new THREE.Vector3()},uSunDir:{value:new THREE.Vector3()},uSunCol:{value:new THREE.Vector3()},uMoonDir:{value:new THREE.Vector3()},uSunI:{value:1},uNight:{value:0},uDayK:{value:1}};
var skyM=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),new THREE.ShaderMaterial({uniforms:skyU,vertexShader:'varying vec3 vDir;void main(){vDir=position;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;}',fragmentShader:SKY_FS,side:THREE.BackSide,depthWrite:false,fog:false}));
skyM.renderOrder=-10;skyM.frustumCulled=false;scene.add(skyM);

// ----- water -----
var wu={T:{value:0},uSunI:{value:1},uNight:{value:0},uFogD:{value:.014},uRes:{value:new THREE.Vector2(256,128)},uSunDir:{value:new THREE.Vector3()},uSunCol:{value:new THREE.Vector3()},uMoonDir:{value:new THREE.Vector3()},uFog:{value:new THREE.Vector3()},uCam:{value:new THREE.Vector3()},uBox:{value:new THREE.Vector4(DX0,DZ0,DXW,DZW)},uRefl:{value:rt.texture},uRM:{value:new THREE.Matrix4()},uDepth:{value:dtex}};
waterMat=new THREE.ShaderMaterial({uniforms:wu,vertexShader:'varying vec3 vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}',fragmentShader:WATER_FS,transparent:true,depthWrite:false,fog:false});
var water=new THREE.Mesh(new THREE.PlaneGeometry(110,130,1,1).rotateX(-Math.PI/2).translate(0,0,30),waterMat);water.renderOrder=5;water.frustumCulled=false;scene.add(water);

// ----- beacon -----
var Bh=H(BX,BZ),bu={T:{value:0},uN:{value:0}};
var bmat=new THREE.ShaderMaterial({uniforms:bu,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,
 vertexShader:'varying vec3 vN;varying vec3 vP;varying vec3 vV;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=-mv.xyz;vP=position;gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform float uN;varying vec3 vN;varying vec3 vP;varying vec3 vV;void main(){float f=pow(1.-abs(dot(normalize(vN),normalize(vV))),3.2);float v=smoothstep(-8.,-4.,vP.y)*smoothstep(8.,2.,vP.y);gl_FragColor=vec4(vec3(.5,1.,.92)*f*v*(.03+.22*uN),1.);}'});
var beacon=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,16,32,1,true),bmat);beacon.position.set(BX,Bh+6,BZ);scene.add(beacon);
var rmat2=new THREE.ShaderMaterial({uniforms:bu,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,
 vertexShader:'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform float T,uN;varying vec3 vP;void main(){float dd=length(vP.xy);float ring=pow(1.-abs(fract(dd*.16-T*.18)*2.-1.),16.)*exp(-dd*.09);gl_FragColor=vec4(vec3(.4,1.,.9)*ring*(.03+.38*uN),1.);}'});
var rings=new THREE.Mesh(new THREE.CircleGeometry(40,64),rmat2);rings.rotation.x=-Math.PI/2;rings.position.set(BX,Bh+.35,BZ);scene.add(rings);

R={renderer:renderer};
var plane=new THREE.Plane(new THREE.Vector3(0,1,0),0),rclip=[plane],noclip=[],shU=-9,shF=0,frameN=0,firstDone=false;
size();addEventListener('resize',function(){small=innerWidth<760;size();wake()});
function apply(u,T){
 var topCol=mix4([.30,.64,.95],[.18,.46,.85],[.20,.28,.52],[.015,.04,.10],u),horCol=mix4([1,.95,.76],[.72,.86,.94],[1,.58,.30],[.06,.13,.22],u);
 var sunDir=nrmz(mix4([-.58,.40,.34],[-.35,.64,.32],[-.82,.15,.55],[.25,.30,.92],u)),sunCol=mix4([1,.75,.45],[1,.96,.88],[1,.5,.22],[.275,.35,.5],u);
 var sunI=mix4([1,1,1],[1.1,1.1,1.1],[.9,.9,.9],[.28,.28,.28],u)[0],night=sst(.62,1,u),dayK=1-sst(.45,.8,u),moonDir=nrmz([.6,.7,.4]);
 skyU.T.value=T;skyU.uTop.value.set(topCol[0],topCol[1],topCol[2]);skyU.uHor.value.set(horCol[0],horCol[1],horCol[2]);skyU.uSunDir.value.set(sunDir[0],sunDir[1],sunDir[2]);skyU.uSunCol.value.set(sunCol[0],sunCol[1],sunCol[2]);skyU.uMoonDir.value.set(moonDir[0],moonDir[1],moonDir[2]);skyU.uSunI.value=sunI;skyU.uNight.value=night;skyU.uDayK.value=dayK;
 wu.T.value=T;wu.uSunI.value=sunI;wu.uNight.value=night;wu.uSunDir.value.set(sunDir[0],sunDir[1],sunDir[2]);wu.uMoonDir.value.set(moonDir[0],moonDir[1],moonDir[2]);
 var sl=[sunCol[0],sunCol[1],sunCol[2]].map(function(v){return Math.pow(v,2.2)});wu.uSunCol.value.set(sl[0],sl[1],sl[2]);
 var fogD=[0,1,2].map(function(i){return horCol[i]*.84+topCol[i]*.16});var fl=fogD.map(function(v){return Math.pow(v,2.2)*.95});wu.uFog.value.set(fl[0],fl[1],fl[2]);
 scene.fog.color.setRGB(fl[0],fl[1],fl[2]);scene.fog.density=.0125+.004*night;wu.uFogD.value=scene.fog.density;
 hemi.color.setRGB(Math.pow(topCol[0]*.5+horCol[0]*.5,2.2),Math.pow(topCol[1]*.5+horCol[1]*.5,2.2),Math.pow(topCol[2]*.5+horCol[2]*.5,2.2));hemi.groundColor.setRGB(.05+.03*dayK,.07+.03*dayK,.03+.05*night);hemi.intensity=.7+.9*dayK+1.5*night+.7*sst(.45,.75,u)*(1-night);
 var fillDir=[.3,.7,-.65],ldir=nrmz([sunDir[0]*(1-night)+fillDir[0]*night,sunDir[1]*(1-night)+fillDir[1]*night,sunDir[2]*(1-night)+fillDir[2]*night]);
 sun.color.setRGB(sl[0]*(1-night)+.55*night,sl[1]*(1-night)+.7*night,sl[2]*(1-night)+1.0*night);sun.intensity=sunI*3.1*(1-night)+1.9*night;
 sun.position.set(2+ldir[0]*90,2+ldir[1]*90,22+ldir[2]*90);
 bu.T.value=T;bu.uN.value=night;treeU.value=T;amb.intensity=.55*night;
 var ro=mix4([1.2,2.0,-9],[1,2.2,-1],[-.8,2.0,5],[-1.5,2.2,8],u);ro[0]+=Math.sin(T*.15)*.15;ro[1]+=Math.sin(T*.11)*.08;ro[1]=Math.max(ro[1],H(ro[0],ro[2])+.6);
 var ta=mix4([6,5.2,13],[4,3.8,16],[1,2.4,14],[0,Bh+1.4,14.5],u);ta[0]+=mx*2.2;ta[1]+=my*1.1;
 cam.position.set(ro[0],ro[1],ro[2]);cam.lookAt(ta[0],ta[1],ta[2]);cam.updateMatrixWorld();wu.uCam.value.copy(cam.position);
 rcam.position.set(ro[0],-ro[1],ro[2]);rcam.up.set(0,-1,0);rcam.lookAt(ta[0],-ta[1],ta[2]);rcam.updateMatrixWorld();wu.uRM.value.multiplyMatrices(rcam.projectionMatrix,rcam.matrixWorldInverse);
 return night}
function render(now){
 var T=reduce?10:(now-t0)/1000+10;apply(us,T);
 frameN++;
 if(Math.abs(us-shU)>.003&&(frameN%3===0||shU<-5)||!firstDone){renderer.shadowMap.needsUpdate=true;shU=us}
 if(!firstDone||frameN%(K<1?2:3)===0||Math.abs(target-us)>.0004){
  skyM.position.copy(rcam.position);water.visible=false;beacon.visible=false;rings.visible=false;renderer.clippingPlanes=rclip;
  renderer.setRenderTarget(rt);renderer.render(scene,rcam);renderer.setRenderTarget(null);renderer.clippingPlanes=noclip;water.visible=true;beacon.visible=true;rings.visible=true}
 skyM.position.copy(cam.position);renderer.render(scene,cam);
 if(!firstDone){firstDone=true;firstFrame=true;de.classList.add('glready')}}
function frame(now){raf=0;if(!active)return;
 var wantK=(now-lastScr<220&&!HQ)?.72:1;if(wantK!==K){K=wantK;size();ft=[]}
 var dt=now-lastNow;lastNow=now;if(dt>0&&dt<400){ft.push(dt);if(ft.length>40){var s=0;for(var i=0;i<ft.length;i++)s+=ft[i];s/=ft.length;ft=[];
   if(warm){warm=false;if(s<22){dpr=baseDpr;size()}}else if(!HQ&&s>34&&dpr>minDpr){dpr=Math.max(minDpr,dpr*.86);size()}}}
 mx+=(tx-mx)*.04;my+=(ty-my)*.04;us+=(target-us)*(reduce?1:.075);
 render(now);
 var k=Math.max(0,Math.min(1,(us-.55)/.4));drawMotes(now,k);
 de.style.setProperty('--u',us.toFixed(4));
 var moving=Math.abs(target-us)>.0004||Math.abs(tx-mx)>.003||Math.abs(ty-my)>.003;
 if(!reduce||moving)raf=requestAnimationFrame(frame)}
frameFn=frame;calcTarget();us=target;wake();
D.addEventListener('visibilitychange',function(){if(D.hidden){active=false}else{calcTarget();active=scrollY<worldEnd()+60;wake()}});
}
}
function softGL(){return !!navigator.webdriver||/HeadlessChrome|Chrome-Lighthouse|PTST|Googlebot/i.test(navigator.userAgent)}
function boot(){if(softGL()&&!/[?&]full/.test(location.search))return fail();import('/assets/vendor/three.module.min.js').then(start).catch(fail)}
if(D.readyState==='complete')setTimeout(boot,700);else addEventListener('load',function(){setTimeout(boot,700)});
// optional ambient sound (off by default)
var snd=D.getElementById('snd'),ac=null,g1=null,on=false;
function build(){var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;ac=new AC();
 var len=ac.sampleRate*2,bf=ac.createBuffer(1,len,ac.sampleRate),d=bf.getChannelData(0),l=0;
 for(var i=0;i<len;i++){var w=Math.random()*2-1;l=(l+.02*w)/1.02;d[i]=l*3.5}
 var src=ac.createBufferSource();src.buffer=bf;src.loop=true;
 var lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;
 g1=ac.createGain();g1.gain.value=0;
 var lfo=ac.createOscillator(),lg=ac.createGain();lfo.frequency.value=.08;lg.gain.value=180;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();
 src.connect(lp);lp.connect(g1);
 [110,164.81,220.5].forEach(function(f,i){var o=ac.createOscillator(),og=ac.createGain();o.type='sine';o.frequency.value=f*(1+i*.002);og.gain.value=.012/(i+1);o.connect(og);og.connect(g1);o.start()});
 g1.connect(ac.destination);src.start();return true}
if(snd)snd.addEventListener('click',function(){
 try{if(!ac&&!build())return;on=!on;snd.setAttribute('aria-pressed',on);
  if(on){ac.resume();g1.gain.cancelScheduledValues(ac.currentTime);g1.gain.linearRampToValueAtTime(.35,ac.currentTime+1.5)}
  else{g1.gain.cancelScheduledValues(ac.currentTime);g1.gain.linearRampToValueAtTime(0,ac.currentTime+.8)}}catch(e){console.error('audio: '+e.message)}});
})();
