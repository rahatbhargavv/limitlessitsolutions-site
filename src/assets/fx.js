(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s){return document.querySelector(s)}
function vis(el,cb){if(!('IntersectionObserver' in window)){cb(true);return}new IntersectionObserver(function(es){cb(es[0].isIntersecting)}).observe(el)}
function fit(cv,W,H){var d=Math.min(window.devicePixelRatio||1,2);cv.width=Math.max(2,Math.round(cv.clientWidth*d));cv.height=Math.round(cv.width*H/W);return cv.width/W}

/* ---------- progress bar, timeline, tabs ---------- */
var bar=$('.prog'),tlEl=$('.tl'),tlFill=$('.tl-fill');
function onScroll(){var h=document.documentElement,m=h.scrollHeight-h.clientHeight;if(bar)bar.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')';
 if(tlEl&&tlFill){var r=tlEl.getBoundingClientRect(),p=(innerHeight*.7-r.top)/r.height;p=Math.max(0,Math.min(1,p));tlFill.style.transform='scaleY('+(reduce?1:p)+')'}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
var tabs=document.querySelectorAll('.tab');
function pick(id){tabs.forEach(function(o){o.setAttribute('aria-pressed',o.getAttribute('data-f')===id)});document.querySelectorAll('.cat').forEach(function(c){c.hidden=!(id==='all'||c.id===id)})}
tabs.forEach(function(t){t.addEventListener('click',function(){pick(t.getAttribute('data-f'))})});
if(tabs.length&&location.hash){var hid=location.hash.slice(1);if(document.querySelector('.tab[data-f="'+hid+'"]'))pick(hid)}

/* ---------- Wi-Fi coverage demo ---------- */
(function(){
var cv=$('#planCv');if(!cv)return;var ctx=cv.getContext('2d');var W=100,H=64,S=2;
var walls=[[4,30,18,30],[26,30,70,30],[80,30,96,30],[40,4,40,14],[40,20,40,30],[58,4,58,8],[58,14,58,30],[38,30,38,40],[38,48,38,60]];
var rooms=[{n:'Bedroom',x:4,y:4,w:36,h:26,lx:22,ly:17},{n:'Bath',x:40,y:4,w:18,h:26,lx:49,ly:17},{n:'Office',x:58,y:4,w:38,h:26,lx:77,ly:17},{n:'Kitchen',x:4,y:30,w:34,h:30,lx:21,ly:46},{n:'Living',x:38,y:30,w:58,h:30,lx:67,ly:46}];
var cells=[],cols=46,rws=28;
for(var r=0;r<rws;r++)for(var c=0;c<cols;c++)cells.push({x:4+S*(c+.5),y:4+S*(r+.5),s:0});
var router={x:67,y:46},mesh=null,useMesh=false,scale=1,t0=performance.now(),run=false,dirty=true,info={pct:0,weak:''};
function ccw(ax,ay,bx,by,cx,cy){return (cy-ay)*(bx-ax)>(by-ay)*(cx-ax)}
function hit(a,b2,c,d){return ccw(a.x,a.y,c[0],c[1],c[2],c[3])!==ccw(b2.x,b2.y,c[0],c[1],c[2],c[3])&&ccw(a.x,a.y,b2.x,b2.y,c[0],c[1])!==ccw(a.x,a.y,b2.x,b2.y,c[2],c[3])}
function sig(p,q){var d=Math.hypot(p.x-q.x,p.y-q.y),n=0;for(var i=0;i<walls.length;i++)if(hit(p,q,walls[i]))n++;return Math.pow(.6,n)/(1+Math.pow(d/24,2))}
function roomAvg(arr){return rooms.map(function(rm){var s=0,n=0;cells.forEach(function(c,i){if(c.x>=rm.x&&c.x<rm.x+rm.w&&c.y>=rm.y&&c.y<rm.y+rm.h){s+=arr[i];n++}});return n?s/n:0})}
function compute(){
 var a=cells.map(function(c){return sig(router,c)});var avg=roomAvg(a),wi=0;avg.forEach(function(v,i){if(v<avg[wi])wi=i});
 var fin=a;
 if(useMesh){mesh={x:rooms[wi].lx,y:rooms[wi].ly+4};fin=a.map(function(v,i){return Math.max(v,sig(mesh,cells[i]))});avg=roomAvg(fin);wi=0;avg.forEach(function(v,i){if(v<avg[wi])wi=i})}else mesh=null;
 var ok=0;fin.forEach(function(v,i){cells[i].s=v;if(v>=.22)ok++});
 info.pct=Math.round(ok/cells.length*100);info.weak=rooms[wi].n;
 var el=$('#planRead');if(el)el.textContent='Decent signal in '+info.pct+'% of the home \u00b7 weakest: '+info.weak;
 dirty=true}
function say(){var s=$('#planSr');if(s)s.textContent='Router placed. Decent signal in '+info.pct+' percent of the home. Weakest room: '+info.weak+(useMesh?'. Mesh node on.':'.')}
function col(s){var t=Math.min(1,s/.85);return 'hsla('+Math.round(12+t*152)+',72%,'+Math.round(56-t*16)+'%,'+(.4+.45*t).toFixed(2)+')'}
function draw(now){
 scale=cv.width/W;ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,W,H);
 cells.forEach(function(c){ctx.fillStyle=col(c.s);ctx.fillRect(c.x-S/2+.12,c.y-S/2+.12,S-.24,S-.24)});
 ctx.strokeStyle='#10201f';ctx.lineCap='round';ctx.lineWidth=1;ctx.strokeRect(4,4,92,56);
 ctx.lineWidth=.7;ctx.beginPath();walls.forEach(function(w){ctx.moveTo(w[0],w[1]);ctx.lineTo(w[2],w[3])});ctx.stroke();
 ctx.fillStyle='#10201f';ctx.font='700 2.5px Hanken,system-ui,sans-serif';ctx.textAlign='center';rooms.forEach(function(rm){ctx.fillText(rm.n.toUpperCase(),rm.lx,rm.ly-5)});
 var ph=reduce?0:((now-t0)/1400)%1;
 function node(p,color){ctx.strokeStyle=color;ctx.lineWidth=.5;ctx.globalAlpha=1-ph;ctx.beginPath();ctx.arc(p.x,p.y,2.4+ph*7,0,6.283);ctx.stroke();ctx.globalAlpha=1;ctx.fillStyle=color;ctx.beginPath();ctx.arc(p.x,p.y,2.2,0,6.283);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,.9,0,6.283);ctx.fill()}
 node(router,'#10201f');if(mesh)node(mesh,'#0b5f58');
 dirty=false}
function loop(now){if(!run)return;if(!reduce||dirty)draw(now);if(!reduce)requestAnimationFrame(loop);else if(dirty)requestAnimationFrame(loop)}
function kick(){if(run)requestAnimationFrame(loop)}
function setR(x,y){router.x=Math.max(7,Math.min(93,x));router.y=Math.max(7,Math.min(57,y));compute();kick()}
function pos(e){var r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H}}
var drag=false;
cv.addEventListener('pointerdown',function(e){drag=true;cv.setPointerCapture(e.pointerId);var p=pos(e);setR(p.x,p.y)});
cv.addEventListener('pointermove',function(e){if(!drag)return;var p=pos(e);setR(p.x,p.y)});
function end(){if(drag){drag=false;say()}}
cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
cv.addEventListener('keydown',function(e){var k={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}[e.key];if(!k)return;e.preventDefault();setR(router.x+k[0],router.y+k[1]);say()});
document.querySelectorAll('#plan [data-x]').forEach(function(bn){bn.addEventListener('click',function(){setR(+bn.getAttribute('data-x'),+bn.getAttribute('data-y'));say()})});
var mb=$('#meshBtn');if(mb)mb.addEventListener('click',function(){useMesh=!useMesh;mb.setAttribute('aria-pressed',useMesh);compute();kick();say()});
function size(){fit(cv,W,H);dirty=true;kick()}
size();addEventListener('resize',size);compute();
vis(cv,function(v){run=v;if(v)requestAnimationFrame(loop)});
})();

/* ---------- Camera planner demo ---------- */
(function(){
var cv=$('#camCv');if(!cv)return;var ctx=cv.getContext('2d');var W=100,H=64,S=2,FOV=110,RNG=48;
var house={x:32,y:17,w:36,h:25};
var cams=[{n:'Front door',x:50,y:42,a:90},{n:'Right side',x:68,y:30,a:0},{n:'Back door',x:50,y:17,a:-90},{n:'Left side',x:32,y:30,a:180}];
var on=[true,false,false,false],cells=[],run=false,dirty=true,pct=0;
for(var y=7;y<58;y+=S)for(var x=7;x<94;x+=S){if(x>house.x&&x<house.x+house.w&&y>house.y&&y<house.y+house.h)continue;cells.push({x:x,y:y,c:false})}
function inCone(c,p){var dx=p.x-c.x,dy=p.y-c.y,d=Math.hypot(dx,dy);if(d>RNG)return false;var a=Math.atan2(dy,dx)*180/Math.PI,df=Math.abs(((a-c.a+540)%360)-180);return df<=FOV/2}
function calc(){var n=0,t=0;cells.forEach(function(p){p.c=false;for(var i=0;i<cams.length;i++)if(on[i]&&inCone(cams[i],p)){p.c=true;break}if(p.c)n++;t++});pct=Math.round(n/t*100);
 var k=on.filter(Boolean).length,el=$('#camRead');if(el)el.textContent=k+' of 4 cameras on \u00b7 yard coverage about '+pct+'%';dirty=true}
function say(){var s=$('#camSr');if(s)s.textContent=on.filter(Boolean).length+' of 4 cameras on. Yard coverage about '+pct+' percent.'}
function draw(now){var sc=cv.width/W;ctx.setTransform(sc,0,0,sc,0,0);ctx.clearRect(0,0,W,H);
 ctx.fillStyle='#0e2a27';ctx.fillRect(6,6,88,52);
 ctx.fillStyle='#173a36';ctx.fillRect(60,42,20,16);
 cells.forEach(function(p){if(p.c){ctx.fillStyle='rgba(125,240,196,.16)';ctx.fillRect(p.x-S/2,p.y-S/2,S,S)}});
 ctx.save();ctx.beginPath();ctx.rect(6,6,88,52);ctx.clip();
 cams.forEach(function(c,i){if(!on[i])return;var g=ctx.createRadialGradient(c.x,c.y,1,c.x,c.y,RNG);g.addColorStop(0,'rgba(125,240,196,.55)');g.addColorStop(1,'rgba(125,240,196,.04)');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.arc(c.x,c.y,RNG,(c.a-FOV/2)*Math.PI/180,(c.a+FOV/2)*Math.PI/180);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(125,240,196,.7)';ctx.lineWidth=.3;ctx.stroke()});
 ctx.restore();
 ctx.fillStyle='#24534d';ctx.fillRect(house.x,house.y,house.w,house.h);ctx.strokeStyle='#7df0c4';ctx.lineWidth=.6;ctx.strokeRect(house.x,house.y,house.w,house.h);
 ctx.fillStyle='#e9f1ee';ctx.font='700 2.6px Hanken,system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('HOME',50,30.5);
 ctx.fillStyle='#a9c2bc';ctx.font='600 2.1px Hanken,system-ui,sans-serif';ctx.fillText('DRIVEWAY',70,55);
 ctx.setLineDash([1.2,1.2]);ctx.strokeStyle='#5f8a83';ctx.lineWidth=.4;ctx.strokeRect(6,6,88,52);ctx.setLineDash([]);
 var ph=reduce?0:((now-0)/1500)%1;
 cams.forEach(function(c,i){if(on[i]){ctx.strokeStyle='#7df0c4';ctx.lineWidth=.4;ctx.globalAlpha=1-ph;ctx.beginPath();ctx.arc(c.x,c.y,2+ph*5,0,6.283);ctx.stroke();ctx.globalAlpha=1}
  ctx.fillStyle=on[i]?'#7df0c4':'#0b1f1e';ctx.strokeStyle=on[i]?'#7df0c4':'#a9c2bc';ctx.lineWidth=.5;ctx.beginPath();ctx.arc(c.x,c.y,2,0,6.283);ctx.fill();ctx.stroke()});
 dirty=false}
function loop(now){if(!run)return;if(!reduce||dirty)draw(now);if(!reduce||dirty)requestAnimationFrame(loop)}
function kick(){if(run)requestAnimationFrame(loop)}
function sync(){document.querySelectorAll('#camBtns [data-i]').forEach(function(bn){bn.setAttribute('aria-pressed',on[+bn.getAttribute('data-i')])})}
function toggle(i){on[i]=!on[i];sync();calc();kick();say()}
document.querySelectorAll('#camBtns [data-i]').forEach(function(bn){bn.addEventListener('click',function(){toggle(+bn.getAttribute('data-i'))})});
cv.addEventListener('click',function(e){var r=cv.getBoundingClientRect(),px=(e.clientX-r.left)/r.width*W,py=(e.clientY-r.top)/r.height*H,bi=-1,bd=9;cams.forEach(function(c,i){var d=Math.hypot(c.x-px,c.y-py);if(d<bd){bd=d;bi=i}});if(bi>=0)toggle(bi)});
function size(){fit(cv,W,H);dirty=true;kick()}
size();addEventListener('resize',size);sync();calc();
vis(cv,function(v){run=v;if(v)requestAnimationFrame(loop)});
})();

/* ---------- Tech checkup terminal ---------- */
(function(){
var out=$('#termOut');if(!out)return;
var lines=['$ tech-checkup --demo','','> scanning startup programs ....... <b>41 found</b>','> turning off what you never use .. <b>32 off</b>','> free disk space ................ <b>4% \u2192 61%</b>','> backup ......................... <b>set up</b>','> updates ........................ <b>installed</b>','','<span class="ok">\u2714 Done. Starts faster. Runs quieter.</span>'];
var timer=null;
function plain(h){return h.replace(/<[^>]+>/g,'')}
function show(n){out.innerHTML=lines.slice(0,n).join('\n')}
function run(){clearTimeout(timer);if(reduce){show(lines.length);return}
 var li=0,ci=0;out.innerHTML='';
 (function tick(){if(li>=lines.length)return;var L=lines[li],pl=plain(L);
  if(ci>=pl.length){li++;ci=0;show(li);timer=setTimeout(tick,li===1?380:260);return}
  var done=lines.slice(0,li).join('\n')+(li?'\n':'');out.innerHTML=done+pl.slice(0,ci+1);ci++;timer=setTimeout(tick,pl.length>40?9:16)})()}
var started=false;vis(out,function(v){if(v&&!started){started=true;run()}});
var rb=$('#termRun');if(rb)rb.addEventListener('click',run);
})();
})();
