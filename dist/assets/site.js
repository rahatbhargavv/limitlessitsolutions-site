(function(){
  document.documentElement.classList.add('js');
  (function(){var els=document.querySelectorAll('.rv');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}})},{threshold:.12});els.forEach(function(e){io.observe(e)})})();
  var C = window.SITE || {};
  // ---- analytics (only with consent, only if an ID is configured)
  function loadGA(){
    if(!C.ga4Id||window.__ga)return;window.__ga=1;
    var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id='+C.ga4Id;document.head.appendChild(s);
    window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config',C.ga4Id,{anonymize_ip:true});
  }
  function ev(n,p){if(window.gtag)gtag('event',n,p||{})}
  var consent=localStorage.getItem('lis-consent');
  if(C.ga4Id){
    if(consent==='yes')loadGA();
    else if(!consent){
      var b=document.getElementById('cookie');
      if(b){b.style.display='block';
        b.querySelector('[data-yes]').onclick=function(){localStorage.setItem('lis-consent','yes');b.style.display='none';loadGA()};
        b.querySelector('[data-no]').onclick=function(){localStorage.setItem('lis-consent','no');b.style.display='none'};}
    }
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a');if(!a)return;
    if((a.getAttribute('href')||'').indexOf('tel:')===0)ev('phone_click');
    if(a.hasAttribute('data-booking'))ev('booking_click');
  });
  // ---- mobile nav: open by default on wide screens
  var nav=document.querySelector('nav.main details');
  var wasWide=null;function fit(){if(!nav)return;var w=window.innerWidth>=1480;if(w===wasWide)return;wasWide=w;if(w)nav.setAttribute('open','');else nav.removeAttribute('open')}
  fit();document.addEventListener('click',function(e){if(nav&&!nav.contains(e.target)&&window.innerWidth<1480)nav.removeAttribute('open')});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav&&window.innerWidth<1480)nav.removeAttribute('open')});window.addEventListener('resize',fit);


  // ---- section rail (home only): dots show where you are and jump between sections
  (function(){
    if(!document.body.classList.contains('home'))return;
    var st=[].slice.call(document.querySelectorAll('.stage[id]'));if(st.length<3)return;
    var labels={top:'Top',manifesto:'About',services:'Services',wifi:'Wi-Fi',cameras:'Cameras',computers:'Computers',process:'How it works',cta:'Contact'};
    var nv=document.createElement('nav');nv.className='rail';nv.setAttribute('aria-label','Page sections');
    nv.innerHTML=st.map(function(s){var l=labels[s.id]||s.id;return '<a href="#'+s.id+'" data-id="'+s.id+'"><span>'+l+'</span></a>'}).join('');
    document.body.appendChild(nv);
    var links=[].slice.call(nv.querySelectorAll('a'));
    function mark(id){links.forEach(function(a){if(a.dataset.id===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)mark(e.target.id)})},{rootMargin:'-45% 0px -45% 0px'});
      st.forEach(function(s){io.observe(s)});
    }
    mark(st[0].id);
  })();
  // ---- quote form
  var f=document.getElementById('quote-form');if(!f)return;
  var s1=document.getElementById('step1'),s2=document.getElementById('step2'),out=document.getElementById('result');
  var desc=f.querySelector('[name=description]'),cnt=document.getElementById('count');
  desc.addEventListener('input',function(){cnt.textContent=desc.value.length+'/300'});
  function err(id,m){var e=document.getElementById(id);if(e)e.textContent=m||''}
  function checked(n){var r=f.querySelector('input[name='+n+']:checked');return r?r.value:''}
  // field rules, shared by blur/input validation and submit
  var RULES={
    description:['e-description','Please describe what you need (5-300 characters).',function(x){return x.length>=5&&x.length<=300}],
    name:['e-name','Please enter your name.',function(x){return x.length>=2}],
    phone:['e-phone','Enter a valid phone number.',function(x){return /^[0-9+()\-\s.]{7,20}$/.test(x)}],
    email:['e-email','Enter a valid email address.',function(x){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x)}],
    postal:['e-postal','Enter a Canadian postal code, like M5V 2T6.',function(x){return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(x)}]
  };
  function checkField(n,show){
    var r=RULES[n],el=f.elements[n],good=r[2](el.value.trim());
    if(show){err(r[0],good?'':r[1]);el.setAttribute('aria-invalid',good?'false':'true')}
    return good;
  }
  Object.keys(RULES).forEach(function(n){
    var el=f.elements[n];
    // validate when the user leaves the field, then clear the error the moment it is fixed
    el.addEventListener('blur',function(){if(el.value.trim()||el.getAttribute('aria-invalid')==='true')checkField(n,true)});
    el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true'&&checkField(n,false))checkField(n,true)});
  });
  ['type','need','urgency'].forEach(function(n){
    f.querySelectorAll('input[name='+n+']').forEach(function(r){r.addEventListener('change',function(){err('e-'+n)})});
  });
  f.elements.consent.addEventListener('change',function(){if(f.elements.consent.checked)err('e-consent')});
  document.getElementById('next').onclick=function(){
    var ok=true;
    ['type','need','urgency'].forEach(function(n){if(!checked(n)){err('e-'+n,'Please choose one.');ok=false}else err('e-'+n)});
    if(ok){s1.hidden=true;s2.hidden=false;document.getElementById('name').focus()}
  };
  document.getElementById('back').onclick=function(){s2.hidden=true;s1.hidden=false};
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(n){return f.elements[n].value.trim()},ok=true;
    Object.keys(RULES).forEach(function(n){if(!checkField(n,true))ok=false});
    if(!f.elements.consent.checked){err('e-consent','Consent is required so we can reply to you.');ok=false}else err('e-consent');
    if(f.elements.botcheck.checked){return}
    if(!ok){var bad=f.querySelector('[aria-invalid=true]')||f.elements.consent;bad.focus();bad.scrollIntoView({block:'center'});return}
    var btn=document.getElementById('send');btn.disabled=true;btn.textContent='Sending...';
    var fd=new FormData(f);
    fd.set('access_key',C.web3formsKey);
    fd.set('subject','New quote request: '+checked('need')+' ('+checked('urgency')+')');
    fd.set('from_name','Limitless IT Solutions website');
    fd.set('replyto',v('email'));
    function fallback(){
      btn.disabled=false;btn.textContent='Send my request';
      var body='Name: '+v('name')+'\nPhone: '+v('phone')+'\nEmail: '+v('email')+'\nPostal: '+v('postal')+'\nFor: '+checked('type')+' / '+checked('need')+' / '+checked('urgency')+'\n\n'+v('description');
      var mail='mailto:'+C.email+'?subject='+encodeURIComponent('Quote request: '+checked('need'))+'&body='+encodeURIComponent(body);
      var e=document.getElementById('e-send');
      e.innerHTML='Sorry, that did not send. Your answers are still here. Call <a href="tel:'+esc(C.phoneTel)+'">'+esc(C.phone)+'</a> or <a href="'+esc(mail)+'">email us this request</a>.';
    }
    if(!C.web3formsKey||C.web3formsKey.charAt(0)==='['){fallback();return}
    var ctl=window.AbortController?new AbortController():null,timer=setTimeout(function(){if(ctl)ctl.abort()},15000);
    fetch('https://api.web3forms.com/submit',{method:'POST',body:fd,signal:ctl?ctl.signal:undefined}).then(function(r){clearTimeout(timer);return r.json()}).then(function(j){
      if(!j.success)throw new Error(j.message||'failed');
      ev('form_submit',{need:checked('need'),urgency:checked('urgency')});
      f.hidden=true;out.hidden=false;
      var t=checked('urgency')==='Today';
      out.innerHTML='<div class="thanks" role="status"><p class="big">Thank you, '+esc(v('name').split(' ')[0])+'.</p><p>We got your request and will respond '+esc(C.responseTime)+'.</p>'+
        (t?'<p class="big">Need it today? Call <a href="tel:'+esc(C.phoneTel)+'">'+esc(C.phone)+'</a> now.</p>':'')+'</div>';
      out.focus();
    }).catch(function(){clearTimeout(timer);fallback()});
  });
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
})();
