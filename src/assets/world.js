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
var FS="precision highp float;\nuniform vec2 R;uniform float T;uniform float U;uniform vec2 M;uniform float Q;\nvec3 topCol,horCol,sunDir,sunCol;float sunI,night;\nvec3 B=vec3(3.2,0.,14.5);\nfloat hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\nfloat vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}\nfloat fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}\nfloat fb3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*vn(p);p=p*2.02+vec2(3.1,1.7);a*=.5;}return v;}\nvec3 mix4(vec3 a,vec3 b,vec3 c,vec3 d,float u){vec3 r=mix(a,b,smoothstep(0.,.38,u));r=mix(r,c,smoothstep(.38,.72,u));return mix(r,d,smoothstep(.72,1.,u));}\nfloat H(vec2 p){\n float n=fbm(p*.11);\n float r=1.-abs(2.*fbm(p*.055+7.3)-1.);\n float side=smoothstep(3.,17.,abs(p.x-2.5*sin(p.y*.09)));\n float far=smoothstep(26.,62.,p.y);\n float A=1.2+9.5*side+11.*far;\n float xc=p.x-2.5*sin(p.y*.09);\n float lake=exp(-xc*xc*.022)*smoothstep(-3.,5.,p.y)*(1.-smoothstep(32.,50.,p.y));\n float h=n*2.4-1.1+pow(r,2.2)*A*(1.-.8*lake)-3.6*lake;\n h+=4.4*exp(-dot(p-B.xz,p-B.xz)*.1);\n vec2 mq=(p-vec2(14.,27.))*vec2(.075,.055);float mm=exp(-dot(mq,mq));\n float rid=1.-abs(2.*fbm(p*.16+3.7)-1.);\n h+=mm*(15.+3.*rid+1.5*fbm(p*.5));\n return h;}\nvec3 nrm(vec3 p,float t){float e=.015*t+.02;return normalize(vec3(H(p.xz-vec2(e,0.))-H(p.xz+vec2(e,0.)),2.*e,H(p.xz-vec2(0.,e))-H(p.xz+vec2(0.,e))));}\nvec3 sky(vec3 rd){\n float y=max(rd.y,0.);\n vec3 col=mix(horCol,topCol,pow(y,.45));\n float sd=max(dot(rd,sunDir),0.);\n col+=sunCol*(pow(sd,6.)*.22+pow(sd,40.)*.45+pow(sd,420.)*2.6)*sunI;\n if(rd.y>.015){\n  vec2 uv=rd.xz/(rd.y+.18)*1.15+vec2(T*.007,0.);\n  float c=smoothstep(.48,.86,fb3(uv*1.2));\n  vec3 cl=mix(horCol*.8+topCol*.2,vec3(1.,.97,.92)*(.55+.6*sunI)+sunCol*.25*sd,.55+.45*sd);\n  cl=mix(cl,topCol*1.4+.04,night*.8);\n  col=mix(col,cl,c*.62*smoothstep(.015,.22,rd.y));}\n vec2 sp=rd.xz/(rd.y+.22)*58.;vec2 id=floor(sp);vec2 f=fract(sp)-.5;\n float st=step(.986,hash(id))*smoothstep(.34,0.,length(f))*(.55+.45*sin(T*2.2+hash(id+3.1)*40.));\n col+=vec3(.8,.9,1.)*st*night*smoothstep(.04,.3,rd.y);\n return col;}\nfloat march(vec3 ro,vec3 rd,float iq,out float hit){\n float t=.3,tp=.3;hit=0.;\n for(int i=0;i<90;i++){\n  if(float(i)>=iq)break;\n  vec3 p=ro+rd*t;float d=p.y-H(p.xz);\n  if(d<.004*t){hit=1.;break;}\n  tp=t;t+=max(.025*t,d*.5);\n  if(t>95.)break;}\n if(hit>.5){for(int k=0;k<5;k++){float tm=.5*(tp+t);vec3 pm=ro+rd*tm;if(pm.y<H(pm.xz))t=tm;else tp=tm;}}\n return t;}\nvec3 terrCol(vec3 p,vec3 n){\n float nz=fb3(p.xz*1.3);float gr=fb3(p.xz*.35);\n vec3 grass=mix(vec3(.10,.31,.04),vec3(.50,.58,.12),gr);\n float bl=vn(p.xz*vec2(26.,9.))*.6+vn(p.xz*vec2(70.,24.))*.4;grass*=.72+.55*bl;\n grass=mix(grass,vec3(.5,.42,.2),smoothstep(.55,.75,fb3(p.xz*.2+9.))*.6);\n vec3 rock=mix(vec3(.42,.38,.33),vec3(.68,.62,.54),nz);\n vec3 c=mix(grass,rock,smoothstep(.80,.50,n.y+.08*(2.-p.y*.12)));\n c=mix(c,vec3(.93,.95,1.),smoothstep(9.,12.5,p.y+nz*1.6)*smoothstep(.5,.85,n.y+.25));\n c=mix(vec3(.55,.5,.38),c,smoothstep(.0,.35,p.y));\n return c;}\nvec3 lit(vec3 p,vec3 n,vec3 alb){\n float dif=clamp(dot(n,sunDir)*.8+.2,0.,1.);float sh=1.;\n for(int k=1;k<7;k++){vec3 q=p+sunDir*(float(k)*.9);float dd=q.y-H(q.xz);sh=min(sh,clamp(dd*1.3+.35,0.,1.));}\n vec3 amb=mix(horCol,topCol,.5)*(.75+.30*n.y);\n amb+=vec3(.05,.10,.12)*night;\n return alb*(sunCol*sunI*dif*sh*1.5+amb);}\nvoid main(){\n vec2 q=(2.*gl_FragCoord.xy-R)/R.y;\n float u=U;\n topCol=mix4(vec3(.30,.64,.95),vec3(.18,.46,.85),vec3(.20,.28,.52),vec3(.015,.04,.10),u);\n horCol=mix4(vec3(1.,.95,.76),vec3(.72,.86,.94),vec3(1.,.58,.30),vec3(.06,.13,.22),u);\n sunDir=normalize(mix4(vec3(-.58,.40,.34),vec3(-.35,.64,.32),vec3(-.82,.15,.55),vec3(.25,.30,.92),u));\n sunCol=mix4(vec3(1.,.75,.45),vec3(1.,.96,.88),vec3(1.,.5,.22),vec3(.55,.7,1.)*.5,u);\n sunI=mix4(vec3(1.),vec3(1.1),vec3(.9),vec3(.28),u).x;\n night=smoothstep(.62,1.,u);\n float Bh=H(B.xz);\n float e=u*u*(3.-2.*u);\n vec3 ro=mix4(vec3(1.2,2.0,-9.),vec3(1.,2.2,-1.),vec3(-.8,2.0,5.),vec3(-1.5,2.2,8.),u)+vec3(sin(T*.15)*.15,sin(T*.11)*.08,0.);\n ro.y=max(ro.y,H(ro.xz)+.6);\n vec3 ta=mix4(vec3(6.,5.2,13.),vec3(4.,3.8,16.),vec3(1.,2.4,14.),vec3(0.,Bh+1.4,14.5),u)+vec3(M.x*2.2,M.y*1.1,0.);\n vec3 ww=normalize(ta-ro),uu=normalize(cross(ww,vec3(0.,1.,0.))),vv=cross(uu,ww);\n vec3 rd=normalize(q.x*uu+q.y*vv+1.6*ww);\n float hit;float t=march(ro,rd,Q,hit);\n float tw=rd.y<-.0005?-ro.y/rd.y:1e9;\n vec3 col;float tEnd=1e4;vec3 pp=ro;bool ground=false;\n if(tw<t||(hit<.5&&tw<1e8)){\n  tEnd=tw;ground=true;vec3 p=ro+rd*tw;pp=p;\n  float amp=.12/(1.+tw*.22);\n  vec2 w=vec2(vn(p.xz*1.6+vec2(T*.35,T*.2))-.5,vn(p.xz*1.9+vec2(-T*.25,T*.3))-.5);\n  vec3 n=normalize(vec3(w.x*amp*4.,1.,w.y*amp*4.));\n  vec3 r=reflect(rd,n);r.y=abs(r.y)+.01;r=normalize(r);\n  vec3 refl;float rh;vec3 po=p+vec3(0.,.02,0.);\n  float tr=march(po,r,40.,rh);\n  if(rh>.5){vec3 pc=po+r*tr;vec3 nn=nrm(pc,tr);refl=lit(pc,nn,terrCol(pc,nn));refl=mix(refl,horCol,1.-exp(-tr*.02));}\n  else refl=sky(r);\n  float F=.03+.97*pow(1.-clamp(dot(n,-rd),0.,1.),5.);\n  float depth=clamp(-H(p.xz),0.,3.);\n  vec3 body=mix(vec3(.10,.38,.36),vec3(.02,.10,.16),smoothstep(0.,2.5,depth))*(.45+.4*sunI);\n  col=mix(body,refl,clamp(F+.2,0.,1.));\n  col+=vec3(1.)*smoothstep(.18,0.,depth)*(.5+.5*sin(p.x*3.+p.z*2.-T*1.4))*.12;\n } else if(hit>.5){\n  tEnd=t;ground=true;vec3 p=ro+rd*t;pp=p;vec3 n=nrm(p,t);\n  col=lit(p,n,terrCol(p,n));\n } else col=sky(rd);\n if(tEnd<1e3){\n  float f=1.-exp(-tEnd*(.009+.007*night));\n  col=mix(col,horCol*.95+sunCol*pow(max(dot(rd,sunDir),0.),4.)*.2*sunI,f);}\n if(ground){\n  float dd=length(pp.xz-B.xz);\n  float ring=pow(1.-abs(fract(dd*.16-T*.18)*2.-1.),16.)*exp(-dd*.09);\n  col+=vec3(.4,1.,.9)*ring*(.10+.95*night);}\n vec2 d2=ro.xz-B.xz;float a=dot(rd.xz,rd.xz)+1e-5;float tc=-dot(d2,rd.xz)/a;\n if(tc>0.&&tc<tEnd){\n  vec2 cp=d2+rd.xz*tc;float dist2=dot(cp,cp);float py=ro.y+rd.y*tc;\n  float hh=smoothstep(Bh-.3,Bh+.2,py)*smoothstep(Bh+9.,Bh+2.,py);\n  float fall=1./(1.+tc*.015);\n  col+=vec3(.5,1.,.92)*exp(-dist2*2.2)*hh*(.3+1.0*night)*fall;\n  col+=vec3(1.,.82,.5)*exp(-dist2*20.)*hh*(.5+.8*night)*fall;}\n col*=1.-.35*dot(q*.5,q*.5);\n col=col/(1.+col*.3);col=pow(col,vec3(.92));\n col+=(hash(gl_FragCoord.xy+fract(T)*100.)-.5)*.022;\n gl_FragColor=vec4(col,1.);}";
function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
var vs=sh(gl.VERTEX_SHADER,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'),fs=sh(gl.FRAGMENT_SHADER,FS);
var pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.linkProgram(pr);
var pext=gl.getExtension('KHR_parallel_shader_compile');
(function waitLink(){
 if(pext&&!gl.getProgramParameter(pr,pext.COMPLETION_STATUS_KHR)){setTimeout(waitLink,30);return}
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){console.error('shader: '+gl.getShaderInfoLog(fs)+' '+gl.getProgramInfoLog(pr));de.classList.add('nogl');return}
 start();
})();
function start(){
gl.useProgram(pr);
var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
var loc=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uU=gl.getUniformLocation(pr,'U'),uM=gl.getUniformLocation(pr,'M'),uQ=gl.getUniformLocation(pr,'Q');
var small=innerWidth<760;
var HQ=/[?&]hq/.test(location.search);var scale=HQ?1:(small?.6:.8)*Math.min(devicePixelRatio||1,1.25),minScale=small?.4:.5,Q=HQ?100:(small?56:80);
function size(){cv.width=Math.max(2,Math.round(cv.clientWidth*scale));cv.height=Math.max(2,Math.round(cv.clientHeight*scale));gl.viewport(0,0,cv.width,cv.height);
 if(mo){mo.width=innerWidth;mo.height=innerHeight}}
var baseScale=scale,warm=!HQ;scale=HQ?scale:baseScale*.75;size();addEventListener('resize',function(){small=innerWidth<760;size();wake()});
var mx=0,my=0,tx=0,ty=0;
addEventListener('mousemove',function(e){tx=e.clientX/innerWidth*2-1;ty=1-e.clientY/innerHeight*2},{passive:true});
var us=0,target=0,vel=0,lastY=scrollY,active=true,raf=0,t0=performance.now(),ft=[],lastNow=0;
function worldEnd(){return home&&stages?stages.offsetTop+stages.offsetHeight:innerHeight*1.15}
function calcTarget(){var y=scrollY;if(home&&stages){var m=stages.offsetTop+stages.offsetHeight-innerHeight;target=m>0?Math.max(0,Math.min(1,y/m)):0}else target=.1+.5*Math.min(1,y/innerHeight);
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
  var gr=mctx.createRadialGradient(m.x*w,m.y*h,0,m.x*w,m.y*h,rad*2.4);
  gr.addColorStop(0,'rgba('+r+','+g+','+b+','+a.toFixed(3)+')');gr.addColorStop(1,'rgba('+r+','+g+','+b+',0)');
  mctx.fillStyle=gr;mctx.beginPath();mctx.arc(m.x*w,m.y*h,rad*2.4,0,6.283);mctx.fill()}
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
