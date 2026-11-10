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
var gl=null;
try{gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'})}catch(e){}
if(!gl){de.classList.add('nogl');return}
var FS=`precision highp float;
uniform vec2 R;uniform float T;uniform float U;uniform vec2 M;uniform float Q;
vec3 topCol,horCol,sunDir,sunCol,moonDir;float sunI,night,dayK;
vec3 B=vec3(3.2,0.,14.5);
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
vec2 hash2(vec2 p){return vec2(hash(p),hash(p+vec2(37.1,11.7)));}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
float fb3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}
vec3 mix4(vec3 a,vec3 b,vec3 c,vec3 d,float u){vec3 r=mix(a,b,smoothstep(0.,.38,u));r=mix(r,c,smoothstep(.38,.72,u));return mix(r,d,smoothstep(.72,1.,u));}
float H(vec2 p){
 vec2 wp=p;
 float n=fbm(p*.11);
 float r=1.-abs(2.*fbm(wp*.055+7.3)-1.);
 float side=smoothstep(3.,17.,abs(p.x-2.5*sin(p.y*.09)));
 float far=smoothstep(26.,62.,p.y);
 float A=1.2+9.5*side+11.*far;
 float xc=p.x-2.5*sin(p.y*.09);
 float lake=exp(-xc*xc*.022)*smoothstep(-3.,5.,p.y)*(1.-smoothstep(32.,50.,p.y));
 float h=n*2.4-1.1+pow(r,2.2)*A*(1.-.8*lake)-3.6*lake;
 h+=4.4*exp(-dot(p-B.xz,p-B.xz)*.1);
 vec2 mq=(p-vec2(14.,27.))*vec2(.075,.055);float mm=exp(-dot(mq,mq));
 float rid=1.-abs(2.*fbm(wp*.16+3.7)-1.);
 float gul=1.-abs(2.*fb3(wp*vec2(.55,.22)+vec2(3.,9.))-1.);
 float g3=gul*gul*gul;
 h+=mm*(15.+2.4*rid*rid+.9*fbm(p*.5)-2.2*g3);
 h-=.55*clamp(side+far*.8,0.,1.)*g3*(1.-lake);
 return h;}
vec3 nrm(vec3 p,float t){float e=.015*t+.02;return normalize(vec3(H(p.xz-vec2(e,0.))-H(p.xz+vec2(e,0.)),2.*e,H(p.xz-vec2(0.,e))-H(p.xz+vec2(0.,e))));}
vec3 sky(vec3 rd){
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
float march(vec3 ro,vec3 rd,float iq,out float hit){
 float t=.3,tp=.3;hit=0.;
 for(int i=0;i<96;i++){
  if(float(i)>=iq)break;
  vec3 p=ro+rd*t;float d=p.y-H(p.xz);
  if(d<.003*t){hit=1.;break;}
  tp=t;t+=max(.02*t,d*.5);
  if(t>95.)break;}
 if(hit>.5){for(int k=0;k<6;k++){float tm=.5*(tp+t);vec3 pm=ro+rd*tm;if(pm.y<H(pm.xz))t=tm;else tp=tm;}}
 return t;}
vec3 terrCol(vec3 p,vec3 n,float t){
 float nz=fb3(p.xz*1.3);float gr=fb3(p.xz*.35);
 float lod=1.-smoothstep(14.,48.,t);
 float wind=sin(T*.9+p.x*.45+p.z*.3)*.35;
 vec3 grass=mix(vec3(.08,.26,.04),vec3(.48,.56,.12),gr);
 float bl=vn(p.xz*vec2(26.,9.)+vec2(wind,0.))*.6+vn(p.xz*vec2(70.,24.)+vec2(wind*2.,0.))*.4;
 grass*=.72+.55*mix(.5,bl,lod*.8+.2);
 grass=mix(grass,vec3(.5,.42,.2),smoothstep(.55,.75,fb3(p.xz*.2+9.))*.6);
 if(lod>0.){vec2 fg=p.xz*8.;vec2 fid=floor(fg);float fh=hash(fid+4.1);
 float fd=length(fract(fg)-.5-.3*(hash2(fid)-.5));
 float fl=step(.93,fh)*smoothstep(.17,.07,fd)*lod*smoothstep(.55,.9,n.y);
 vec3 fc=fh>.975?vec3(.95,.93,.85):(fh>.95?vec3(.98,.82,.2):vec3(.62,.42,.85));
 grass=mix(grass,fc,fl*.9);}
 float st=.5+.5*sin(p.y*6.5+nz*4.+fb3(p.xz*.4)*3.);
 vec3 rock=mix(vec3(.30,.26,.23),vec3(.56,.50,.42),nz);
 rock=mix(rock,vec3(.52,.40,.32),st*.35);
 rock*=.85+.3*fb3(p.xz*3.1+p.y);
 float slope=smoothstep(.80,.50,n.y+.08*(2.-p.y*.12));
 vec3 c=mix(grass,rock,slope);
 float forest=smoothstep(.36,.52,fb3(p.xz*.11+2.))*smoothstep(.62,.8,n.y)*smoothstep(.4,1.2,p.y)*(1.-smoothstep(5.,8.,p.y+nz*1.2));
 float tt=.5;if(forest>.02&&lod>0.){vec2 tg=p.xz*vec2(7.,5.4);vec2 tid=floor(tg);vec2 tl=fract(tg)-vec2(.5,.12)-vec2(.3,0.)*(hash2(tid+8.8)-.5);
 tt=step(.3,hash(tid))*smoothstep(.04,.0,abs(tl.x)-(.42-tl.y)*.38)*step(-.1,tl.y)*step(tl.y,.78);}
 float td=mix(.62,tt,lod*.8+.2);
 vec3 tcol=vec3(.02,.075,.035)*(.6+.8*nz)*(.8+.5*clamp(dot(n,sunDir),0.,1.));
 c=mix(c,tcol,forest*clamp(td*1.25,0.,1.)*.95);
 float sn=smoothstep(10.2,14.,p.y+nz*2.8)*smoothstep(.45,.82,n.y+.3*nz-.15);
 c=mix(c,vec3(.97,.98,1.)*(.92+.2*nz),sn);
 c=mix(vec3(.55,.5,.38),c,smoothstep(.0,.35,p.y));
 return c;}
vec3 lit(vec3 p,vec3 n,vec3 alb){
 float dif=clamp(dot(n,sunDir)*.8+.2,0.,1.);float sh=1.;
 for(int k=1;k<6;k++){vec3 q=p+sunDir*(float(k)*1.05);float dd=q.y-H(q.xz);sh=min(sh,clamp(dd*1.3+.35,0.,1.));}
 float cs=smoothstep(.5,.74,fb3(p.xz*.045+vec2(T*.02,T*.012)));
 sh*=1.-.5*cs*dayK;
 vec3 amb=mix(horCol,topCol,.5)*(.75+.30*n.y);
 amb+=vec3(.05,.10,.12)*night;
 vec3 moon=vec3(.30,.40,.70)*night*clamp(dot(n,moonDir),0.,1.)*.45;
 return alb*(sunCol*sunI*dif*sh*1.5+amb+moon);}
void main(){
 vec2 q=(2.*gl_FragCoord.xy-R)/R.y;
 float u=U;
 topCol=mix4(vec3(.30,.64,.95),vec3(.18,.46,.85),vec3(.20,.28,.52),vec3(.015,.04,.10),u);
 horCol=mix4(vec3(1.,.95,.76),vec3(.72,.86,.94),vec3(1.,.58,.30),vec3(.06,.13,.22),u);
 sunDir=normalize(mix4(vec3(-.58,.40,.34),vec3(-.35,.64,.32),vec3(-.82,.15,.55),vec3(.25,.30,.92),u));
 sunCol=mix4(vec3(1.,.75,.45),vec3(1.,.96,.88),vec3(1.,.5,.22),vec3(.55,.7,1.)*.5,u);
 sunI=mix4(vec3(1.),vec3(1.1),vec3(.9),vec3(.28),u).x;
 night=smoothstep(.62,1.,u);
 dayK=1.-smoothstep(.45,.8,u);
 moonDir=normalize(vec3(.6,.7,.4));
 float Bh=H(B.xz);
 vec3 ro=mix4(vec3(1.2,2.0,-9.),vec3(1.,2.2,-1.),vec3(-.8,2.0,5.),vec3(-1.5,2.2,8.),u)+vec3(sin(T*.15)*.15,sin(T*.11)*.08,0.);
 ro.y=max(ro.y,H(ro.xz)+.6);
 vec3 ta=mix4(vec3(6.,5.2,13.),vec3(4.,3.8,16.),vec3(1.,2.4,14.),vec3(0.,Bh+1.4,14.5),u)+vec3(M.x*2.2,M.y*1.1,0.);
 vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);
 vec3 rd=normalize(q.x*uu+q.y*vv+1.6*ww);
 float hit;float t=march(ro,rd,Q,hit);
 float tw=rd.y<-.0005?-ro.y/rd.y:1e9;
 vec3 col;float tEnd=1e4;vec3 pp=ro;bool ground=false;
 if(tw<t||(hit<.5&&tw<1e8)){
  tEnd=tw;ground=true;vec3 p=ro+rd*tw;pp=p;
  float amp=.12/(1.+tw*.22);
  vec2 w=vec2(vn(p.xz*1.6+vec2(T*.35,T*.2))-.5,vn(p.xz*1.9+vec2(-T*.25,T*.3))-.5);
  vec3 n=normalize(vec3(w.x*amp*4.,1.,w.y*amp*4.));
  vec3 r=reflect(rd,n);r.y=abs(r.y)+.01;r=normalize(r);
  vec3 refl;float rh;vec3 po=p+vec3(0.,.02,0.);
  float tr=march(po,r,30.,rh);
  if(rh>.5){vec3 pc=po+r*tr;vec3 nn=nrm(pc,tr);refl=lit(pc,nn,terrCol(pc,nn,tr+tw));refl=mix(refl,horCol,1.-exp(-tr*.02));}
  else refl=sky(r);
  float F=.03+.97*pow(1.-clamp(dot(n,-rd),0.,1.),5.);
  float depth=clamp(-H(p.xz),0.,3.);
  vec3 body=mix(vec3(.05,.21,.23),vec3(.012,.07,.13),smoothstep(0.,2.5,depth))*(.4+.4*sunI);
  col=mix(body,refl,clamp(F+.3,0.,1.));
  float spk=smoothstep(.6,.95,vn(p.xz*vec2(16.,24.)+vec2(T*1.1,-T*.8)))*(1.-smoothstep(20.,60.,tw)*.6);
  float sg=max(dot(r,sunDir),0.);
  col+=sunCol*sunI*(pow(sg,50.)*.45+pow(sg,380.)*3.)*spk;
  col+=vec3(.7,.8,1.)*pow(max(dot(r,moonDir),0.),260.)*spk*2.*night;
  float fo=smoothstep(.22,.0,depth+.08*(vn(p.xz*5.+T*.4)-.5))*(.55+.45*sin(p.x*3.+p.z*2.-T*1.4));
  col+=vec3(.9,.95,1.)*fo*.22*(.25+sunI*.8*dayK+.25*night);
 } else if(hit>.5){
  tEnd=t;ground=true;vec3 p=ro+rd*t;pp=p;vec3 n=nrm(p,t);
  col=lit(p,n,terrCol(p,n,t));
 } else col=sky(rd);
 if(tEnd<1e3){
  vec3 ext=exp(-tEnd*vec3(.0085,.0068,.0048)*(1.+.6*night));
  vec3 fogC=mix(horCol,topCol,.16)*.92+sunCol*pow(max(dot(rd,sunDir),0.),4.)*.22*sunI;
  col=col*ext+fogC*(1.-ext);
  float mist=exp(-max(pp.y,0.)*.8)*smoothstep(.35,.7,fb3(pp.xz*.14+vec2(T*.02,T*.01)))*(1.-smoothstep(.06,.45,u))*.45*(1.-exp(-tEnd*.1));
  col=mix(col,fogC*1.05,mist);}
 if(ground){
  float dd=length(pp.xz-B.xz);
  float ring=pow(1.-abs(fract(dd*.16-T*.18)*2.-1.),16.)*exp(-dd*.09);
  col+=vec3(.4,1.,.9)*ring*(.10+.95*night);}
 vec2 d2=ro.xz-B.xz;float a=dot(rd.xz,rd.xz)+1e-5;float tc=-dot(d2,rd.xz)/a;
 if(tc>0.&&tc<tEnd){
  vec2 cp=d2+rd.xz*tc;float dist2=dot(cp,cp);float py=ro.y+rd.y*tc;
  float hh=smoothstep(Bh-.3,Bh+.2,py)*smoothstep(Bh+9.,Bh+2.,py);
  float fall=1./(1.+tc*.015);
  col+=vec3(.5,1.,.92)*exp(-dist2*2.2)*hh*(.3+1.0*night)*fall;
  col+=vec3(1.,.82,.5)*exp(-dist2*20.)*hh*(.5+.8*night)*fall;}
 col*=1.-.35*dot(q*.5,q*.5);
 col*=1.0;col=(col*(2.51*col+.03))/(col*(2.43*col+.59)+.14);col=pow(clamp(col,0.,1.),vec3(.96));col=mix(vec3(dot(col,vec3(.299,.587,.114))),col,1.22);
 col+=(hash(gl_FragCoord.xy+fract(T)*100.)-.5)*.02;
 gl_FragColor=vec4(col,1.);}
`;
function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
var vs,fs,pr,pext;
function boot(){
vs=sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');fs=sh(gl.FRAGMENT_SHADER,FS);
pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
pext=gl.getExtension('KHR_parallel_shader_compile');
(function waitLink(){
 if(pext&&!gl.getProgramParameter(pr,pext.COMPLETION_STATUS_KHR)){setTimeout(waitLink,30);return}
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){console.error('shader: '+gl.getShaderInfoLog(fs)+' '+gl.getProgramInfoLog(pr));de.classList.add('nogl');return}
 start();
})();}
if(D.readyState==='complete')setTimeout(boot,350);else addEventListener('load',function(){setTimeout(boot,350)});
function start(){
gl.useProgram(pr);
var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uU=gl.getUniformLocation(pr,'U'),uM=gl.getUniformLocation(pr,'M'),uQ=gl.getUniformLocation(pr,'Q');
var small=innerWidth<760;
var HQ=/[?&]hq/.test(location.search);var scale=HQ?1:(small?.6:.8)*Math.min(devicePixelRatio||1,1.25),minScale=small?.4:.5,Q=HQ?100:(small?56:80);
function size(){cv.width=Math.max(2,Math.round(cv.clientWidth*scale));cv.height=Math.max(2,Math.round(cv.clientHeight*scale));gl.viewport(0,0,cv.width,cv.height);
 if(mo){mo.width=innerWidth;mo.height=innerHeight}}
var baseScale=scale,warm=!HQ;scale=HQ?scale:baseScale*.6;size();addEventListener('resize',function(){small=innerWidth<760;size();wake()});
var mx=0,my=0,tx=0,ty=0;
addEventListener('mousemove',function(e){tx=e.clientX/innerWidth*2-1;ty=1-e.clientY/innerHeight*2},{passive:true});
var us=0,target=0,vel=0,lastY=scrollY,active=true,raf=0,t0=performance.now(),ft=[],lastNow=0;
function worldEnd(){return home&&stages?stages.offsetTop+stages.offsetHeight:innerHeight*1.15}
var FU=(location.search.match(/[?&]u=([0-9.]+)/)||[])[1];
function calcTarget(){var y=scrollY;if(FU!==undefined){target=+FU;active=true;return}if(home&&stages){var m=stages.offsetTop+stages.offsetHeight-innerHeight;target=m>0?Math.max(0,Math.min(1,y/m)):0}else target=.1+.5*Math.min(1,y/innerHeight);
 var vis=y<worldEnd()+60;if(vis&&!active){active=true;wake()}else if(!vis)active=false}
addEventListener('scroll',function(){var y=scrollY;vel=y-lastY;lastY=y;calcTarget();wake()},{passive:true});
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
function frame(now){raf=0;if(!active)return;
 var dt=now-lastNow;lastNow=now;if(dt>0&&dt<400){ft.push(dt);if(ft.length>40){var s=0;for(var i=0;i<ft.length;i++)s+=ft[i];s/=ft.length;ft=[];
   if(warm){warm=false;if(s<22){scale=baseScale;size()}}else if(!HQ&&s>34&&scale>minScale){scale=Math.max(minScale,scale*.84);size()}}}
 mx+=(tx-mx)*.04;my+=(ty-my)*.04;us+=(target-us)*(reduce?1:.075);
 gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,reduce?10:(now-t0)/1000+10);gl.uniform1f(uU,us);gl.uniform2f(uM,mx,my);gl.uniform1f(uQ,Q);
 gl.drawArrays(gl.TRIANGLES,0,3);
 if(!firstFrame){firstFrame=true;de.classList.add('glready')}
 var k=Math.max(0,Math.min(1,(us-.55)/.4));drawMotes(now,k);
 de.style.setProperty('--u',us.toFixed(4));
 var moving=Math.abs(target-us)>.0004||Math.abs(tx-mx)>.003||Math.abs(ty-my)>.003;
 if(!reduce||moving)raf=requestAnimationFrame(frame)}
function wake(){if(active&&!raf)raf=requestAnimationFrame(frame)}
calcTarget();us=target;wake();
D.addEventListener('visibilitychange',function(){if(D.hidden){active=false}else{calcTarget();active=scrollY<worldEnd()+60;wake()}});
}
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
