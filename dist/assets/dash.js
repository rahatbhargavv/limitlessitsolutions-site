(function(){var go=function(){
'use strict';
if(document.body.classList.contains('home'))return;
var p=location.pathname,theme=/wifi|network/.test(p)?'wifi':/camera|security/.test(p)?'cam':/computer-help|checkup/.test(p)?'code':null;
if(!theme)return;
var hero=document.querySelector('main .hero');if(!hero)return;
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var sec=document.querySelector('.dashsec');var fresh=!sec;if(!sec){sec=document.createElement('section');sec.className='dashsec'}
var T={wifi:['Network dashboard','See what we see','A live look at the kind of health view we set up for you.'],cam:['Camera wall','All angles, one screen','The kind of live view you get on your phone after install.'],code:['Health check','Before and after a checkup','Toggle to see what a tune-up changes.']}[theme];
var inner='';
if(theme==='wifi')inner='<div class="d-grid"><div class="d-main"><div class="d-stats"><div><small>Download</small><b id="dD">0</b><u>Mbps</u></div><div><small>Latency</small><b id="dL">0</b><u>ms</u></div><div><small>Devices</small><b id="dN">0</b><u>online</u></div></div><canvas id="dC" height="190"></canvas></div><ul class="d-list" id="dList"></ul></div>';
if(theme==='cam')inner='<div class="d-cams" id="dCams"></div><ul class="d-log" id="dLog"></ul>';
if(theme==='code')inner='<div class="d-tog" role="group" aria-label="State"><button type="button" aria-pressed="true" data-s="0">Before</button><button type="button" aria-pressed="false" data-s="1">After checkup</button></div><div class="d-bars" id="dBars"></div>';
sec.innerHTML='<div class="wrap"><div class="dash" role="group" aria-label="Illustration: '+T[0]+'"><div class="d-top"><i></i><i></i><i></i><span>'+T[0].toUpperCase()+' &middot; LIVE DEMO</span><em><b></b> ONLINE</em></div><div class="d-head"><span class="eyebrow">'+T[0]+'</span><h2>'+T[1]+'</h2><p>'+T[2]+'</p></div>'+inner+'<p class="d-note">Illustration only. Numbers are simulated and are not real customer data.</p></div></div>';
sec.removeAttribute('aria-hidden');if(fresh)hero.parentNode.insertBefore(sec,hero.nextSibling);
function $(i){return document.getElementById(i)}
function rnd(a,b){return a+Math.random()*(b-a)}
var vis=true;if('IntersectionObserver' in window)new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(sec);
if(theme==='wifi'){
 var devs=[['Living room TV',3],['Laptop \u2013 Office',4],['iPhone',3],['Security camera',2],['Printer',2],['Smart thermostat',1]];
 var ul=$('dList');devs.forEach(function(d){var li=document.createElement('li');li.innerHTML='<span>'+d[0]+'</span><span class="sg" aria-hidden="true"><i></i><i></i><i></i><i></i></span><em>-'+(40+(4-d[1])*9)+' dBm</em>';li.dataset.s=d[1];ul.appendChild(li)});
 var cv=$('dC'),c=cv.getContext('2d'),pts=[],dpr=Math.min(devicePixelRatio||1,1.5),w=0,h=190,v=420;
 function sz(){w=cv.clientWidth||600;cv.width=w*dpr;cv.height=h*dpr;c.setTransform(dpr,0,0,dpr,0,0)}sz();addEventListener('resize',sz);
 for(var i=0;i<80;i++)pts.push(v+=rnd(-30,30));
 function tick(){v=Math.max(240,Math.min(560,v+rnd(-34,34)));pts.push(v);if(pts.length>80)pts.shift();
  c.clearRect(0,0,w,h);c.strokeStyle='rgba(125,240,214,.12)';c.lineWidth=1;for(var g=1;g<5;g++){c.beginPath();c.moveTo(0,g*h/5);c.lineTo(w,g*h/5);c.stroke()}
  var gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(125,240,214,.35)');gr.addColorStop(1,'rgba(125,240,214,0)');
  c.beginPath();pts.forEach(function(y,i){var x=i/79*w,yy=h-(y-200)/400*h*.9-8;i?c.lineTo(x,yy):c.moveTo(x,yy)});
  c.strokeStyle='#7df0d6';c.lineWidth=2;c.stroke();c.lineTo(w,h);c.lineTo(0,h);c.fillStyle=gr;c.fill();
  $('dD').textContent=Math.round(v);$('dL').textContent=Math.round(rnd(7,13));$('dN').textContent=devs.length+Math.round(rnd(14,18));
  [].forEach.call(ul.children,function(li){var s=Math.max(1,Math.min(4,+li.dataset.s+(Math.random()<.15?(Math.random()<.5?-1:1):0)));li.dataset.s=s;[].forEach.call(li.querySelectorAll('.sg i'),function(b,k){b.className=k<s?'on':''})})}
 tick();if(!reduce)setInterval(function(){if(vis)tick()},900);
}
if(theme==='cam'){
 var names=['Front door','Driveway','Back yard','Side gate'],wr=$('dCams'),lg=$('dLog'),cvs=[];
 names.forEach(function(n,i){var d=document.createElement('div');d.className='cm';d.innerHTML='<canvas width="320" height="180"></canvas><span class="nm">CAM '+(i+1)+' &middot; '+n+'</span><span class="rc"><b></b>REC</span><span class="tc"></span>';wr.appendChild(d);cvs.push({c:d.querySelector('canvas').getContext('2d'),tc:d.querySelector('.tc'),m:0,mx:rnd(60,240),my:rnd(60,120)})});
 function paint(o,t){var c=o.c;c.fillStyle='#07181b';c.fillRect(0,0,320,180);
  for(var k=0;k<70;k++){c.fillStyle='rgba(125,240,214,'+rnd(.02,.09).toFixed(2)+')';c.fillRect(rnd(0,320),rnd(0,180),rnd(1,3),1)}
  c.strokeStyle='rgba(125,240,214,.14)';c.lineWidth=1;for(var x=0;x<320;x+=40){c.beginPath();c.moveTo(x,0);c.lineTo(x,180);c.stroke()}for(var y=0;y<180;y+=36){c.beginPath();c.moveTo(0,y);c.lineTo(320,y);c.stroke()}
  c.fillStyle='rgba(125,240,214,.07)';c.beginPath();c.moveTo(0,180);c.lineTo(110,60);c.lineTo(210,60);c.lineTo(320,180);c.fill();
  if(o.m>0){o.mx+=rnd(-4,5);o.my+=rnd(-2,2);c.strokeStyle='#ffd27a';c.lineWidth=1.5;c.strokeRect(o.mx-20,o.my-28,40,56);c.fillStyle='#ffd27a';c.font='10px monospace';c.fillText('PERSON',o.mx-20,o.my-32);o.m--}
  c.strokeStyle='rgba(255,255,255,.35)';c.strokeRect(.5,.5,319,179);o.tc.textContent=new Date().toTimeString().slice(0,8)}
 function ev(i){var li=document.createElement('li');li.innerHTML='<b>'+new Date().toTimeString().slice(0,8)+'</b> Motion &ndash; CAM '+(i+1)+' ('+names[i]+')';lg.insertBefore(li,lg.firstChild);while(lg.children.length>4)lg.removeChild(lg.lastChild)}
 function loop(){if(vis)cvs.forEach(function(o){if(!o.m&&Math.random()<.02){o.m=34;ev(cvs.indexOf(o))}paint(o)})}
 loop();if(!reduce)setInterval(loop,180);
}
if(theme==='code'){
 var M=[['Startup programs',[34,9],'#'],['Disk space used',[93,61],'%'],['Backups',[0,100],'%'],['Updates installed',[41,100],'%'],['Boot time',[96,28],'s']];
 var bw=$('dBars');M.forEach(function(m){var r=document.createElement('div');r.className='br';r.innerHTML='<span>'+m[0]+'</span><div class="tr"><div class="fl"></div></div><em></em>';bw.appendChild(r)});
 function set(s){[].forEach.call(bw.children,function(r,i){var m=M[i],val=m[1][s],pct=i===0?val/40*100:i===4?val/100*100:val;
  var good=s===1;r.querySelector('.fl').style.width=Math.max(3,pct)+'%';r.querySelector('.fl').className='fl '+(good?'ok':(i===2?'bad':'warn'));r.querySelector('em').textContent=val+(m[2]==='#'?'':m[2])})}
 set(0);
 [].forEach.call(sec.querySelectorAll('.d-tog button'),function(bt){bt.addEventListener('click',function(){[].forEach.call(sec.querySelectorAll('.d-tog button'),function(x){x.setAttribute('aria-pressed',x===bt)});set(+bt.dataset.s)})});
}
};if(document.readyState==='complete')setTimeout(go,700);else addEventListener('load',function(){setTimeout(go,700)});})();
