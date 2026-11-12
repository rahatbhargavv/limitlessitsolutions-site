(function(){var go=function(){
'use strict';
if(document.body.classList.contains('home'))return;
var hero=document.querySelector('main .hero');if(!hero)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var p=location.pathname,theme='flow';
if(/wifi|network/.test(p))theme='wifi';else if(/camera|security/.test(p))theme='cam';else if(/computer|checkup|support/.test(p))theme='code';else if(/contact/.test(p))theme='ping';
hero.classList.add('tech','t-'+theme);
var cv=document.createElement('canvas');cv.className='tfx';cv.setAttribute('aria-hidden','true');hero.insertBefore(cv,hero.firstChild);
var hud=document.createElement('div');hud.className='hud';hud.setAttribute('aria-hidden','true');
var labels={flow:'DATA FLOW',net:'NODE MAP',wifi:'SIGNAL SCAN',cam:'CAM FEED',code:'DIAGNOSTIC',ping:'LINK TEST'};
hud.innerHTML='<i class="c a"></i><i class="c b"></i><i class="c c"></i><i class="c d"></i><span class="st"><b></b> '+labels[theme]+' &middot; <em id="hudA">--</em></span><span class="rd" id="hudB"></span>';
hero.appendChild(hud);
var hA=hud.querySelector('#hudA'),hB=hud.querySelector('#hudB');
var ctx=cv.getContext('2d'),W=0,H=0,dpr=Math.min(devicePixelRatio||1,1.5),small=innerWidth<760;
function size(){var r=hero.getBoundingClientRect();W=Math.max(2,r.width);H=Math.max(2,r.height);cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);init()}
var AQ='125,240,214',AM='255,210,122';
var nodes=[],pk=[],drops=[],cols=0,mx=-1,my=-1,lanes=[],drip=[];
function rnd(a,b){return a+Math.random()*(b-a)}
function init(){
 small=innerWidth<760;
 if(theme==='flow'){var L=small?26:62;lanes=[];for(var a=0;a<L;a++)lanes.push({o:a/(L-1),sp:rnd(.00006,.00016),ph:Math.random(),ln:rnd(.12,.3),w:rnd(.6,1.5),hot:Math.random()<.18});var V=small?10:22;drip=[];for(var b=0;b<V;b++)drip.push({x:rnd(.05,.98),sp:rnd(.0002,.0005),ph:Math.random(),ln:rnd(.15,.4)})}
 if(theme==='net'||theme==='ping'){var n=small?22:46;nodes=[];for(var i=0;i<n;i++)nodes.push({x:rnd(0,W),y:rnd(0,H),vx:rnd(-.18,.18),vy:rnd(-.18,.18),r:rnd(1.2,2.8)});pk=[]}
 if(theme==='wifi'){nodes=[];var m=small?5:9;for(var j=0;j<m;j++)nodes.push({x:rnd(W*.1,W*.95),y:rnd(H*.12,H*.88),ph:Math.random()*6,hit:0})}
 if(theme==='code'){cols=Math.ceil(W/(small?22:16));drops=[];for(var k=0;k<cols;k++)drops.push({y:rnd(-10,H/16),s:rnd(.15,.55),l:Math.floor(rnd(8,22))})}
}
function flowY(s,o){var k=s<.5?0:(s-.5)/.5;k=k*k*(3-2*k);var spread=(1-.78*s)*.34;return H*(.7+(o-.5)*spread*1.6)-k*H*.5*(1-Math.abs(o-.5)*.6)}
function flow(t){
 var N=small?26:44,i,j,l,s,x,y;ctx.lineCap='round';
 for(i=0;i<lanes.length;i++){l=lanes[i];
  ctx.strokeStyle='rgba('+AQ+',.14)';ctx.lineWidth=.8;ctx.beginPath();
  for(j=0;j<=N;j++){s=j/N;x=s*W;y=flowY(s,l.o);if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y)}ctx.stroke();
  var h=((t*l.sp+l.ph)%1.5)-.25;
  ctx.strokeStyle='rgba('+(l.hot?AM:'190,245,255')+','+(l.hot?.85:.7)+')';ctx.lineWidth=l.w;ctx.beginPath();var first=true;
  for(j=0;j<=14;j++){s=h+l.ln*j/14;if(s<0||s>1)continue;x=s*W;y=flowY(s,l.o);if(first){ctx.moveTo(x,y);first=false}else ctx.lineTo(x,y)}ctx.stroke()}
 ctx.lineWidth=.8;
 for(i=0;i<drip.length;i++){var d=drip[i],yy=(((t*d.sp+d.ph)%1.4)-.2)*H,x2=d.x*W,g=ctx.createLinearGradient(0,yy-d.ln*H,0,yy);g.addColorStop(0,'rgba('+AQ+',0)');g.addColorStop(1,'rgba(190,245,255,.75)');ctx.strokeStyle=g;ctx.beginPath();ctx.moveTo(x2,yy-d.ln*H);ctx.lineTo(x2,yy);ctx.stroke()}
}
var HEX='0123456789ABCDEF<>/{}=+*';
function net(t){
 var D=small?110:150,i,j,a,b;
 for(i=0;i<nodes.length;i++){a=nodes[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
  if(mx>=0){var dx=a.x-mx,dy=a.y-my,d=Math.sqrt(dx*dx+dy*dy);if(d<120&&d>1){a.x+=dx/d*.6;a.y+=dy/d*.6}}}
 ctx.lineWidth=1;
 for(i=0;i<nodes.length;i++){a=nodes[i];for(j=i+1;j<nodes.length;j++){b=nodes[j];var dx2=a.x-b.x,dy2=a.y-b.y,dd=Math.sqrt(dx2*dx2+dy2*dy2);
   if(dd<D){ctx.strokeStyle='rgba('+AQ+','+((1-dd/D)*.45).toFixed(3)+')';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
    if(pk.length<(small?10:22)&&Math.random()<.004)pk.push({a:a,b:b,t:0,s:rnd(.01,.025)})}}}
 for(i=0;i<nodes.length;i++){a=nodes[i];ctx.fillStyle='rgba('+AQ+',.85)';ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,6.283);ctx.fill()}
 for(i=pk.length-1;i>=0;i--){var q=pk[i];q.t+=q.s;if(q.t>=1){pk.splice(i,1);continue}
  var x=q.a.x+(q.b.x-q.a.x)*q.t,y=q.a.y+(q.b.y-q.a.y)*q.t;
  var g=ctx.createRadialGradient(x,y,0,x,y,9);g.addColorStop(0,'rgba('+AM+',.95)');g.addColorStop(1,'rgba('+AM+',0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,9,0,6.283);ctx.fill()}
 if(theme==='ping'){var cx=W*.82,cy=H*.5;for(var r=0;r<3;r++){var f=((t*.0004+r/3)%1);ctx.strokeStyle='rgba('+AM+','+((1-f)*.5).toFixed(3)+')';ctx.beginPath();ctx.arc(cx,cy,f*Math.min(W,H)*.6,0,6.283);ctx.stroke()}}
}
function wifi(t){
 var rx=W*.78,ry=H*.55,i,maxR=Math.max(W,H)*.9;
 for(var r=0;r<5;r++){var f=((t*.00018+r/5)%1),rad=f*maxR;ctx.strokeStyle='rgba('+AQ+','+((1-f)*.55).toFixed(3)+')';ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(rx,ry,rad,0,6.283);ctx.stroke()}
 for(i=0;i<nodes.length;i++){var n=nodes[i],d=Math.sqrt((n.x-rx)*(n.x-rx)+(n.y-ry)*(n.y-ry)),ph=((t*.00018)%1)*maxR;
  var near=Math.abs((d%(maxR/5))-(ph%(maxR/5)));if(near<14)n.hit=1;n.hit*=.96;
  ctx.strokeStyle='rgba('+AQ+','+(.12+n.hit*.5).toFixed(3)+')';ctx.setLineDash([3,5]);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(n.x,n.y);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba('+AM+','+(.45+n.hit*.55).toFixed(3)+')';ctx.beginPath();ctx.arc(n.x,n.y,3+n.hit*3,0,6.283);ctx.fill();
  var bars=1+Math.round((1-Math.min(1,d/maxR))*3);ctx.fillStyle='rgba(255,255,255,.7)';for(var k=0;k<4;k++){ctx.globalAlpha=k<bars?.8:.2;ctx.fillRect(n.x+8+k*4,n.y-2-k*2.5,2.5,4+k*2.5)}ctx.globalAlpha=1}
 ctx.fillStyle='rgba('+AM+',1)';ctx.beginPath();ctx.arc(rx,ry,5,0,6.283);ctx.fill();ctx.strokeStyle='rgba('+AM+',.7)';ctx.beginPath();ctx.arc(rx,ry,11+Math.sin(t*.004)*2,0,6.283);ctx.stroke();
}
function cam(t){
 var cx=W*.78,cy=H*.62,R=Math.min(W*.5,H*1.1),ang=(t*.0007)%6.283,i;
 ctx.lineWidth=1;for(i=1;i<=4;i++){ctx.strokeStyle='rgba('+AQ+','+(.16+.02*i)+')';ctx.beginPath();ctx.arc(cx,cy,R*i/4,0,6.283);ctx.stroke()}
 ctx.strokeStyle='rgba('+AQ+',.16)';ctx.beginPath();ctx.moveTo(cx-R,cy);ctx.lineTo(cx+R,cy);ctx.moveTo(cx,cy-R);ctx.lineTo(cx,cy+R);ctx.stroke();
 var g=ctx.createRadialGradient(cx,cy,0,cx,cy,R);g.addColorStop(0,'rgba('+AQ+',.0)');g.addColorStop(1,'rgba('+AQ+',.35)');
 ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,ang-.55,ang);ctx.closePath();ctx.fill();
 ctx.strokeStyle='rgba('+AQ+',.9)';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*R,cy+Math.sin(ang)*R);ctx.stroke();
 var tg=[[.55,.9],[.35,3.9],[.75,5.2],[.6,2.4]];
 for(i=0;i<tg.length;i++){var a=tg[i][1],d=tg[i][0]*R,x=cx+Math.cos(a)*d,y=cy+Math.sin(a)*d,df=((ang-a)%6.283+6.283)%6.283,al=df<2.6?1-df/2.6:0;
  if(al>0){ctx.strokeStyle='rgba('+AM+','+al.toFixed(2)+')';ctx.strokeRect(x-14,y-14,28,28);ctx.fillStyle='rgba('+AM+','+al.toFixed(2)+')';ctx.font='10px monospace';ctx.fillText('ID 0'+(i+1),x+18,y-6)}}
 if(Math.floor(t/600)%2===0){ctx.fillStyle='rgba(255,90,70,.95)';ctx.beginPath();ctx.arc(26,26,5,0,6.283);ctx.fill()}
 ctx.fillStyle='rgba(255,255,255,.85)';ctx.font='11px monospace';ctx.fillText('REC',38,30);
}
function code(t){
 ctx.font='13px monospace';var i,d;
 for(i=0;i<cols;i++){d=drops[i];d.y+=d.s;if(d.y*16>H+d.l*16){d.y=-rnd(0,8);d.s=rnd(.12,.5);d.l=Math.floor(rnd(6,18))}
  for(var k=0;k<d.l;k++){var yy=(d.y-k)*16;if(yy<0||yy>H)continue;var a=(1-k/d.l)*.8;ctx.fillStyle=k===0?'rgba(255,255,255,.9)':'rgba('+(k%7===0?AM:AQ)+','+a.toFixed(3)+')';
   ctx.fillText(HEX.charAt((i*7+k*3+Math.floor(t/140))%HEX.length),i*(small?22:16),yy)}}
}
var t0=performance.now(),vis=true,raf=0;
function frame(now){raf=0;if(!vis)return;var t=Math.max(0,now-t0);ctx.clearRect(0,0,W,H);
 if(theme==='flow')flow(t);else if(theme==='wifi')wifi(t);else if(theme==='cam')cam(t);else if(theme==='code')code(t);else net(t);
 hA.textContent=(8+Math.round(4+Math.sin(t*.001)*3))+' ms';
 hB.textContent=new Date().toTimeString().slice(0,8);
 if(!reduce)raf=requestAnimationFrame(frame)}
function go(){if(!raf)raf=requestAnimationFrame(frame)}
hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
hero.addEventListener('mouseleave',function(){mx=-1;my=-1});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis)go()}).observe(hero);
addEventListener('resize',function(){size();go()});
size();go();
// count-up numbers & glow follow on cards
document.querySelectorAll('.card,.tile,details:not(nav details),.price').forEach(function(c){c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();c.style.setProperty('--gx',(e.clientX-r.left)+'px');c.style.setProperty('--gy',(e.clientY-r.top)+'px')},{passive:true})});
};if(document.readyState==='complete')setTimeout(go,700);else addEventListener('load',function(){setTimeout(go,700)});})();
