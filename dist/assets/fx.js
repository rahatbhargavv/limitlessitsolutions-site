(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // scroll progress
  var bar=document.querySelector('.prog');
  function onScroll(){var h=document.documentElement;var m=h.scrollHeight-h.clientHeight;if(bar)bar.style.transform='scaleX('+(m>0?h.scrollTop/m:0)+')';lit()}
  // manifesto words lit by scroll
  var man=document.querySelector('.manifesto p');var words=[];
  if(man){var t=man.textContent.trim().split(/\s+/);man.textContent='';t.forEach(function(w){var s=document.createElement('span');s.className='w';s.textContent=w+' ';man.appendChild(s);words.push(s)})}
  function lit(){if(!man)return;var r=man.getBoundingClientRect(),vh=innerHeight;var p=(vh*0.85-r.top)/(r.height+vh*0.35);p=Math.max(0,Math.min(1,p));var n=Math.round(p*words.length);words.forEach(function(w,i){w.classList.toggle('lit',i<n)})}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();
  if(reduce)words.forEach(function(w){w.classList.add('lit')});
  // cursor
  var cur=document.querySelector('.cur');
  if(cur&&matchMedia('(hover:hover)').matches&&!reduce){
    var x=0,y=0,cx=0,cy=0;
    addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;cur.classList.add('on')},{passive:true});
    (function loop(){cx+=(x-cx)*.18;cy+=(y-cy)*.18;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
    document.addEventListener('mouseover',function(e){cur.classList.toggle('big',!!e.target.closest('a,button,summary'))});
    // magnetic buttons
    document.querySelectorAll('.btn').forEach(function(b){b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18)+'px,'+((e.clientY-r.top-r.height/2)*.28)+'px)'});b.addEventListener('mouseleave',function(){b.style.transform=''})});
  }
  // catalog filter
  var tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(tb){tb.addEventListener('click',function(){tabs.forEach(function(o){o.setAttribute('aria-pressed',o===tb)});var id=tb.getAttribute('data-f');document.querySelectorAll('.cat').forEach(function(c){c.hidden=!(id==='all'||c.id===id)})})});
  // liquid shader hero
  var cv=document.getElementById('liquid');if(!cv)return;
  function start(){
    var gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});if(!gl){cv.style.background='radial-gradient(circle at 70% 40%,#5b49ff,#0b1030 60%)';return}
    var vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    var fs='precision highp float;uniform vec2 R;uniform float T;uniform vec2 M;'+
    'vec2 h(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}'+
    'float n(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(dot(h(i),f),dot(h(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(h(i+vec2(0,1)),f-vec2(0,1)),dot(h(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}'+
    'float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}'+
    'float F(vec2 p,float t){vec2 q=vec2(fb(p+t*.12),fb(p+vec2(5.2,1.3)-t*.1));return fb(p+2.2*q+t*.06);}'+
    'void main(){vec2 uv=(gl_FragCoord.xy-.5*R)/min(R.x,R.y);uv+=(M-.5)*.18;vec2 p=uv*1.7;float t=T;float f=F(p,t);float e=.012;'+
    'float fx=(F(p+vec2(e,0.),t)-f)/e,fy=(F(p+vec2(0.,e),t)-f)/e;vec3 N=normalize(vec3(-fx*.55,-fy*.55,1.));vec3 L=normalize(vec3(-.4,.6,.7));'+
    'float d=clamp(dot(N,L),0.,1.);float s=pow(clamp(dot(reflect(-L,N),vec3(0.,0.,1.)),0.,1.),22.);float fr=pow(1.-N.z,1.6);'+
    'vec3 c1=vec3(.10,.12,.72),c2=vec3(.50,.38,1.),c3=vec3(.35,.82,1.),c4=vec3(1.,.78,.34);'+
    'vec3 c=mix(c1,c2,smoothstep(-.35,.25,f));c=mix(c,c3,smoothstep(.0,.35,f)*.85);c=mix(c,c4,smoothstep(.22,.45,f)*.9);'+
    'c=c*(.3+.95*d)+s*.9+fr*.55*c3;float m=smoothstep(1.0,.25,length((uv-vec2(.22,.1))*vec2(.8,1.)));gl_FragColor=vec4(c*m,1.);}';
    function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return o}
    var pr=gl.createProgram();gl.attachShader(pr,sh(gl.VERTEX_SHADER,vs));gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)){cv.style.background='radial-gradient(circle at 70% 40%,#5b49ff,#0b1030 60%)';return}
    gl.useProgram(pr);var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var a=gl.getAttribLocation(pr,'p');gl.enableVertexAttribArray(a);gl.vertexAttribPointer(a,2,gl.FLOAT,false,0,0);
    var uR=gl.getUniformLocation(pr,'R'),uT=gl.getUniformLocation(pr,'T'),uM=gl.getUniformLocation(pr,'M');
    var mx=.5,my=.5,tx=.5,ty=.5,vis=true,t0=performance.now();
    function size(){var s=Math.min(devicePixelRatio||1,1.5)*(innerWidth<700?.5:.6);cv.width=Math.max(2,Math.round(cv.clientWidth*s));cv.height=Math.max(2,Math.round(cv.clientHeight*s));gl.viewport(0,0,cv.width,cv.height)}
    size();addEventListener('resize',size);
    addEventListener('mousemove',function(e){tx=e.clientX/innerWidth;ty=1-e.clientY/innerHeight},{passive:true});
    new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!reduce)requestAnimationFrame(draw)}).observe(cv);
    function draw(now){if(!vis&&!reduce)return;mx+=(tx-mx)*.05;my+=(ty-my)*.05;gl.uniform2f(uR,cv.width,cv.height);gl.uniform1f(uT,reduce?8.:(now-t0)/1000*1.0+8.);gl.uniform2f(uM,mx,my);gl.drawArrays(gl.TRIANGLES,0,3);if(!reduce)requestAnimationFrame(draw)}
    requestAnimationFrame(draw);
  }
  (window.requestIdleCallback||function(f){setTimeout(f,200)})(start,{timeout:1200});
})();
