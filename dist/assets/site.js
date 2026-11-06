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

  // ---- quote form
  var f=document.getElementById('quote-form');if(!f)return;
  var s1=document.getElementById('step1'),s2=document.getElementById('step2'),out=document.getElementById('result');
  var desc=f.querySelector('[name=description]'),cnt=document.getElementById('count');
  desc.addEventListener('input',function(){cnt.textContent=desc.value.length+'/300'});
  function err(id,m){var e=document.getElementById(id);if(e)e.textContent=m||''}
  function checked(n){var r=f.querySelector('input[name='+n+']:checked');return r?r.value:''}
  document.getElementById('next').onclick=function(){
    var ok=true;
    ['type','need','urgency'].forEach(function(n){if(!checked(n)){err('e-'+n,'Please choose one.');ok=false}else err('e-'+n)});
    if(ok){s1.hidden=true;s2.hidden=false;document.getElementById('name').focus()}
  };
  document.getElementById('back').onclick=function(){s2.hidden=true;s1.hidden=false};
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var v=function(n){return f.elements[n].value.trim()},ok=true;
    function chk(c,id,m){if(!c){err(id,m);ok=false}else err(id)}
    chk(v('description').length>=5&&v('description').length<=300,'e-description','Please describe what you need (5-300 characters).');
    chk(v('name').length>=2,'e-name','Please enter your name.');
    chk(/^[0-9+()\-\s.]{7,20}$/.test(v('phone')),'e-phone','Enter a valid phone number.');
    chk(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email')),'e-email','Enter a valid email address.');
    chk(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(v('postal')),'e-postal','Enter a Canadian postal code, like M5V 2T6.');
    chk(f.elements.consent.checked,'e-consent','Consent is required so we can reply to you.');
    if(f.elements.botcheck.checked){return}
    if(!ok){var first=f.querySelector('.err:not(:empty)');if(first)first.scrollIntoView({block:'center'});return}
    var btn=document.getElementById('send');btn.disabled=true;btn.textContent='Sending...';
    var fd=new FormData(f);
    fd.set('access_key',C.web3formsKey);
    fd.set('subject','New quote request: '+checked('need')+' ('+checked('urgency')+')');
    fd.set('from_name','Limitless IT Solutions website');
    fd.set('replyto',v('email'));
    fetch('https://api.web3forms.com/submit',{method:'POST',body:fd}).then(function(r){return r.json()}).then(function(j){
      if(!j.success)throw new Error(j.message||'failed');
      ev('form_submit',{need:checked('need'),urgency:checked('urgency')});
      f.hidden=true;out.hidden=false;
      var t=checked('urgency')==='Today';
      out.innerHTML='<div class="thanks" role="status"><p class="big">Thank you, '+esc(v('name').split(' ')[0])+'.</p><p>We got your request and will respond '+esc(C.responseTime)+'.</p>'+
        (t?'<p class="big">Need it today? Call <a href="tel:'+esc(C.phoneTel)+'">'+esc(C.phone)+'</a> now.</p>':'')+'</div>';
      out.focus();
    }).catch(function(){
      btn.disabled=false;btn.textContent='Send my request';
      err('e-send','Sorry, that did not send. Please call or email us directly: '+C.phone+' / '+C.email);
    });
  });
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
})();
