import fs from "node:fs";import path from "node:path";
import C from "./site.config.mjs";import {services,blog} from "./content.mjs";
const OUT="dist";fs.rmSync(OUT,{recursive:true,force:true});
const area=`${C.city}, ${C.region}`;
const isPh=v=>typeof v==="string"&&v.trim().startsWith("[");
const ph=v=>isPh(v)?`<span class="ph">${v}</span>`:v;
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const md=s=>esc(s).replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\[([A-Z][A-Z0-9 \/\-–—]+)\]/g,'<span class="ph">[$1]</span>');
const tel=isPh(C.phone)?"+10000000000":"+1"+C.phone.replace(/\D/g,"");
const phoneHtml=isPh(C.phone)?"[PHONE]":esc(C.phone);
const visible=services.filter(s=>!s.hidden);
const write=(p,html)=>{const f=path.join(OUT,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,html)};
const pages=[];

function layout({url,title,desc,h1,body,noindex,schema,cur}){
  const full=C.url+url;
  const nav=[["/services/","Services"],...visible.map(s=>["/"+s.slug+"/",s.nav]),["/support-plans/","Tech Checkup"],["/about/","About"],["/faq/","FAQ"],["/contact/","Contact"]];
  if(!noindex)pages.push(url);
  return `<!doctype html><html lang="en-CA"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${full}">${noindex?'<meta name="robots" content="noindex,nofollow">':""}
<meta property="og:type" content="website"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${full}"><meta property="og:site_name" content="${C.name}"><meta property="og:locale" content="en_CA">
<meta name="theme-color" content="#0b2545"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/style.css">
${schema?'<script type="application/ld+json">'+JSON.stringify(schema)+'</script>':""}</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="site"><div class="wrap bar"><a class="brand" href="/">Limitless <span>IT Solutions</span></a>
<div class="actions"><a class="phone" href="tel:${tel}" aria-label="Call us">&#9742; ${phoneHtml}</a><a class="btn" href="/contact/#quote">Get a Quote</a></div>
<nav class="main" aria-label="Main"><details><summary>Menu</summary><ul>${nav.map(n=>`<li><a href="${n[0]}"${n[0]===cur?' aria-current="page"':""}>${n[1]}</a></li>`).join("")}</ul></details></nav></div></header>
<main id="main">${body}</main>
<footer class="site"><div class="wrap cols"><div><strong>${C.name}</strong><br>Serving ${area} and surrounding areas<br>Phone: <a href="tel:${tel}">${phoneHtml}</a><br>Email: <a href="mailto:${C.email}">${C.email}</a><br>Hours: ${ph(C.hours)}</div>
<div><strong>Services</strong><br>${visible.map(s=>`<a href="/${s.slug}/">${s.nav}</a>`).join("<br>")}<br><a href="/support-plans/">Tech Checkup</a></div>
<div><strong>Company</strong><br><a href="/about/">About</a><br><a href="/faq/">FAQ</a><br><a href="/blog/">Helpful guides</a><br><a href="/privacy/">Privacy Policy</a><br><a href="/terms/">Terms</a></div></div>
<div class="wrap"><p>&copy; ${new Date().getFullYear()} ${C.name}. Owner-operated.</p></div></footer>
${C.ga4Id?'<div id="cookie" class="cookie" role="dialog" aria-label="Cookie notice"><p>We use Google Analytics cookies to see which pages help visitors. Allow them? See our <a href="/privacy/">Privacy Policy</a>.</p><button class="btn" data-yes>Allow</button> <button class="btn alt" data-no>No thanks</button></div>':""}
<script>window.SITE=${JSON.stringify({ga4Id:C.ga4Id,web3formsKey:C.web3formsKey,responseTime:C.responseTime,phone:C.phone,phoneTel:tel,email:C.email})};</script><script src="/assets/site.js" defer></script></body></html>`;
}
const faqBlock=f=>f.map(([q,a])=>`<details class="faq"><summary>${md(q)}</summary><p>${md(a)}</p></details>`).join("");
const cta=`<div class="btns"><a class="btn" href="/contact/#quote">Get a Quote</a><a class="btn alt" href="tel:${tel}">Call ${phoneHtml}</a></div>`;
const svcSchema=visible.map(s=>({"@type":"Service","name":s.short,"areaServed":area}));
const localBiz={"@context":"https://schema.org","@type":"ProfessionalService","name":C.name,"url":C.url,"email":C.email,...(isPh(C.phone)?{}:{"telephone":"+1"+C.phone.replace(/\D/g,"")}),
 "areaServed":{"@type":"GeoCircle","geoMidpoint":{"@type":"GeoCoordinates","latitude":43.6532,"longitude":-79.3832},"geoRadius":C.radiusKm*1000},"description":"Wi-Fi and network setup, security camera installation, and computer help for homes and small businesses.",
 "hasOfferCatalog":{"@type":"OfferCatalog","name":"Services","itemListElement":visible.map(s=>({"@type":"Offer","itemOffered":{"@type":"Service","name":s.short}}))}};

// HOME
write("index.html",layout({url:"/",cur:"/",title:`IT Help for Homes & Small Businesses in ${area} | ${C.name}`,
 desc:`Wi-Fi setup, security cameras and computer help for homes and small businesses in ${area}. Honest quotes, tidy work. Get a quote today.`,schema:localBiz,
 body:`<section><div class="wrap"><span class="badge">New, owner-operated, local</span><h1>Reliable Wi-Fi, cameras and computer help in ${area}</h1>
 <p class="lead">Fast, tidy and friendly IT help for homes and very small businesses. Tell us what you need and get an honest quote.</p>${cta}</div></section>
 <section class="soft"><div class="wrap"><h2>What we do</h2><div class="grid">${visible.map(s=>`<div class="card"><h3>${s.nav}</h3><p>${s.short}.</p><a class="more" href="/${s.slug}/">Learn more &rarr;</a></div>`).join("")}</div>
 <p>Also coming soon: Microsoft 365 / Google Workspace setup, small websites, monthly support plans, POS installs and smart home. See <a href="/services/">all services</a>.</p></div></section>
 <section><div class="wrap"><h2>How it works</h2><ol class="steps"><li><strong>Tell us what you need.</strong><br>Fill in a short form or call.</li><li><strong>Get an honest quote.</strong><br>We explain it in plain language.</li><li><strong>We get it done.</strong><br>Tidy work and follow-up support.</li></ol></div></section>
 <section class="soft"><div class="wrap"><h2>Why choose us</h2><div class="grid"><div class="card"><h3>Local</h3><p>Based in ${area}, serving homes and small businesses nearby.</p></div><div class="card"><h3>One accountable person</h3><p>You deal with the same person from quote to finish.</p></div><div class="card"><h3>Tidy installs</h3><p>Clean cable runs, neat setup, and we clean up after ourselves.</p></div><div class="card"><h3>Honest quotes</h3><p>You know what is included before we start.</p></div></div></div></section>
 ${C.reviews.length?`<section><div class="wrap"><h2>What customers say</h2><div class="grid">${C.reviews.map(r=>`<blockquote class="card">&ldquo;${esc(r.quote)}&rdquo;<br><strong>${esc(r.name)}</strong></blockquote>`).join("")}</div></div></section>`:""}
 <section><div class="wrap"><h2>Where we work</h2><p>We serve ${area} and nearby areas, up to about ${C.radiusKm} km. Not sure if we cover you? <a href="/contact/">Ask us</a>.</p>${cta}</div></section>`}));

// SERVICES OVERVIEW
write("services/index.html",layout({url:"/services/",cur:"/services/",title:`IT Services for Homes & Small Businesses | ${area}`,desc:`Wi-Fi and networking, security cameras and computer help in ${area}. See what we offer and request a quote.`,
 body:`<section><div class="wrap"><h1>Our services in ${area}</h1><p class="lead">Four core services for homes and small businesses.</p><div class="grid">${visible.map(s=>`<div class="card"><h2 style="font-size:1.25rem">${s.nav}</h2><p>${s.promise}</p><a class="more" href="/${s.slug}/">Details &rarr;</a></div>`).join("")}</div>
 <h2 style="margin-top:2rem">Coming soon</h2><ul class="tick"><li>Microsoft 365 / Google Workspace setup</li><li>Small websites</li><li>Monthly support plans</li><li>POS installs</li><li>Smart home</li></ul>${cta}</div></section>`}));

// SERVICE PAGES
for(const s of services){
 write(`${s.slug}/index.html`,layout({url:"/"+s.slug+"/",cur:"/"+s.slug+"/",title:s.title,desc:s.desc,noindex:s.hidden,
 schema:s.hidden?null:{"@context":"https://schema.org","@type":"Service","name":s.short,"provider":{"@type":"ProfessionalService","name":C.name,"url":C.url},"areaServed":area},
 body:`<section><div class="wrap">${s.hidden?'<div class="note"><strong>HIDDEN PAGE.</strong> Not linked, not in the sitemap, noindex. Do not publish until licensing is confirmed in writing. [LICENSING CONFIRMATION]</div>':""}
 <p class="crumbs"><a href="/">Home</a> / <a href="/services/">Services</a> / ${s.nav}</p><h1>${s.h1}</h1><p class="lead">${s.promise}</p>${cta}</div></section>
 <section class="soft"><div class="wrap"><h2>What's included</h2><ul class="tick">${s.included.map(i=>`<li>${i}</li>`).join("")}</ul></div></section>
 <section><div class="wrap"><h2>How it works</h2><ol class="steps">${s.steps.map(t=>`<li>${t}</li>`).join("")}</ol></div></section>
 <section class="soft"><div class="wrap"><h2>Typical timeline</h2><p>Many small jobs fit into one visit. Larger jobs take longer. We confirm timing in your quote. <span class="ph">[CONFIRM TYPICAL TIMELINE]</span></p>
 <h2>Warranty</h2><p>${ph(C.warranty)}</p></div></section>
 <section><div class="wrap"><h2>Questions</h2>${faqBlock(s.faqs)}${cta}</div></section>`}));
}

// SUPPORT PLANS
write("support-plans/index.html",layout({url:"/support-plans/",cur:"/support-plans/",title:`Annual Tech Checkup | ${area} | ${C.name}`,desc:`An annual flat-fee Tech Checkup visit for your home or small business in ${area}.`,
 body:`<section><div class="wrap"><h1>Annual Tech Checkup</h1><p class="lead">One yearly visit to keep your Wi-Fi, computers and cameras in good shape.</p>
 <div class="note">Scope and price: ${ph(C.checkup)} (to be decided after the owner's audit).</div>
 <h2>Monthly support plans</h2><p>Coming soon. Ask us if you are interested.</p>${cta}</div></section>`}));

// ABOUT
write("about/index.html",layout({url:"/about/",cur:"/about/",title:`About ${C.name} | ${area}`,desc:`${C.name} is a new, owner-operated IT services business in ${area}.`,
 body:`<section><div class="wrap"><h1>About ${C.name}</h1><p class="lead">A new, owner-operated IT services business serving homes and small businesses in ${area}.</p>
 <p>${md(C.aboutMe)}</p><p>Our promise: plain language, tidy work and honest quotes.</p><div class="note">TODO: add company story, and a real photo or logo. [ABOUT ME]</div>${cta}</div></section>`}));

// FAQ
const generalFaq=[["Who do you work for?","Homes and very small businesses such as shops, clinics and small offices."],["Where do you work?",`${area} and nearby areas, up to about ${C.radiusKm} km.`],["How do I get a quote?","Use the quote form or call. We reply ${C.responseTime}."],["Do you charge for quotes?","[CONFIRM QUOTE POLICY]"],["Do you offer 24/7 support?","No. Please see our hours. Hours: "+C.hours]];
write("faq/index.html",layout({url:"/faq/",cur:"/faq/",title:`FAQ | ${C.name} | ${area}`,desc:`Answers to common questions about ${C.name}.`,
 schema:{"@context":"https://schema.org","@type":"FAQPage","mainEntity":generalFaq.filter(f=>!/\[/.test(f[1])).map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a.replace("${C.responseTime}",C.responseTime)}}))},
 body:`<section><div class="wrap"><h1>Frequently asked questions</h1>${faqBlock(generalFaq).replace("\${C.responseTime}",C.responseTime)}${cta}</div></section>`}));

// CONTACT
write("contact/index.html",layout({url:"/contact/",cur:"/contact/",title:`Get a Quote or Book | ${C.name} | ${area}`,desc:`Request a quote or book IT help in ${area}. Takes about a minute.`,
 body:`<section><div class="wrap"><h1>Get a quote</h1><p class="lead">Two quick steps. Prefer to talk? Call <a href="tel:${tel}">${phoneHtml}</a> or email <a href="mailto:${C.email}">${C.email}</a>.</p>
 <div id="quote"><div id="result" hidden tabindex="-1"></div>
 <form id="quote-form" novalidate>
  <div id="step1"><p><strong>Step 1 of 2</strong></p>
   <fieldset><legend>Is this for home or business?</legend><div class="choices"><label><input type="radio" name="type" value="Home"> Home</label><label><input type="radio" name="type" value="Business"> Business</label></div><div class="err" id="e-type" role="alert"></div></fieldset>
   <fieldset><legend>What do you need?</legend><div class="choices"><label><input type="radio" name="need" value="Wi-Fi"> Wi-Fi</label><label><input type="radio" name="need" value="Cameras"> Cameras</label><label><input type="radio" name="need" value="Computer help"> Computer help</label><label><input type="radio" name="need" value="Cabling"> Cabling</label><label><input type="radio" name="need" value="Something else"> Something else</label></div><div class="err" id="e-need" role="alert"></div></fieldset>
   <fieldset><legend>How urgent is it?</legend><div class="choices"><label><input type="radio" name="urgency" value="Today"> Today</label><label><input type="radio" name="urgency" value="This week"> This week</label><label><input type="radio" name="urgency" value="Planning ahead"> Planning ahead</label></div><div class="err" id="e-urgency" role="alert"></div></fieldset>
   <button type="button" class="btn" id="next">Next</button></div>
  <div id="step2" hidden><p><strong>Step 2 of 2</strong></p>
   <label for="description">Tell us briefly what you need</label><textarea id="description" name="description" rows="4" maxlength="300" required></textarea><div><span id="count">0/300</span></div><div class="err" id="e-description" role="alert"></div>
   <label for="photo">Photo (optional)</label><input id="photo" type="file" name="attachment" accept="image/*">
   <label for="name">Name</label><input id="name" type="text" name="name" autocomplete="name" required><div class="err" id="e-name" role="alert"></div>
   <label for="phone">Phone</label><input id="phone" type="tel" name="phone" autocomplete="tel" required><div class="err" id="e-phone" role="alert"></div>
   <label for="email">Email</label><input id="email" type="email" name="email" autocomplete="email" required><div class="err" id="e-email" role="alert"></div>
   <label for="postal">Postal code</label><input id="postal" type="text" name="postal" autocomplete="postal-code" required><div class="err" id="e-postal" role="alert"></div>
   <label for="contactpref">Best way to contact you</label><select id="contactpref" name="contact_preference"><option>Phone call</option><option>Text message</option><option>Email</option></select>
   <input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
   <label style="display:flex;gap:.6rem;font-weight:500"><input type="checkbox" name="consent" value="Yes" required> <span>I agree that ${C.name} may contact me about this request. See the <a href="/privacy/">Privacy Policy</a>. I can withdraw consent at any time.</span></label><div class="err" id="e-consent" role="alert"></div>
   <div class="btns"><button type="button" class="btn alt" id="back">Back</button><button type="submit" class="btn" id="send">Send my request</button></div><div class="err" id="e-send" role="alert"></div></div>
 </form></div></div></section>
 ${C.bookingLink?`<section class="soft"><div class="wrap"><h2>Book a time</h2><p><a class="btn" data-booking href="${C.bookingLink}">Book online</a></p></div></section>`:`<section class="soft"><div class="wrap"><h2>Book a time</h2><p>Online booking is coming soon. <span class="ph">[BOOKING LINK]</span> For now, send a quote request or call.</p></div></section>`}`}));

// LEGAL
const draft='<div class="note"><strong>DRAFT. Have a lawyer review before publishing.</strong> [LAWYER REVIEW]</div>';
write("privacy/index.html",layout({url:"/privacy/",title:`Privacy Policy (Draft) | ${C.name}`,desc:`How ${C.name} handles your personal information.`,
 body:`<section><div class="wrap post"><h1>Privacy Policy</h1>${draft}<p>Last updated: [DATE]</p>
 <h2>Who we are</h2><p>${C.name}, ${area}. Contact: <a href="mailto:${C.email}">${C.email}</a>.</p>
 <h2>What we collect</h2><p>When you send a quote request we collect your name, phone, email, postal code, a description of your need, any photo you upload, and your contact preference. We do not store this in the website code.</p>
 <h2>Why we collect it</h2><p>To reply to your request, give you a quote and provide the service. We only contact you with your consent.</p>
 <h2>Who handles it</h2><p>Form submissions pass through Web3Forms, our form service, and reach us by email. [CONFIRM PROCESSOR LOCATION]</p>
 <h2>Cookies and analytics</h2><p>${C.ga4Id?"If you allow it, we use Google Analytics, which sets cookies. You can decline.":"This site does not currently use analytics or advertising cookies."}</p>
 <h2>Your rights</h2><p>You may ask to see, correct or delete your information, or withdraw consent, by emailing us. Under CASL you can unsubscribe from any marketing message at any time. We do not send marketing without consent.</p>
 <h2>Retention and security</h2><p>We keep request details only as long as needed for the job and for legal needs. [CONFIRM RETENTION PERIOD]</p></div></section>`}));
write("terms/index.html",layout({url:"/terms/",title:`Terms of Service (Draft) | ${C.name}`,desc:`Terms for using this site and ${C.name} services.`,
 body:`<section><div class="wrap post"><h1>Terms of Service</h1>${draft}<p>Last updated: [DATE]</p>
 <h2>Quotes</h2><p>Quotes are estimates based on information you give us. We confirm the price and scope with you before work begins.</p>
 <h2>Warranty</h2><p>${ph(C.warranty)}</p>
 <h2>Your data</h2><p>Please back up important files. We take care with your data but cannot guarantee against loss. [LAWYER REVIEW]</p>
 <h2>Payment</h2><p>[PAYMENT TERMS]</p><h2>Liability</h2><p>[LIABILITY WORDING]</p><h2>Governing law</h2><p>Ontario, Canada. [LAWYER REVIEW]</p></div></section>`}));

// BLOG
write("blog/index.html",layout({url:"/blog/",title:`Helpful IT Guides | ${C.name}`,desc:`Plain-language guides on Wi-Fi, cameras and computers from ${C.name} in ${area}.`,
 body:`<section><div class="wrap"><h1>Helpful guides</h1><div class="grid">${blog.map(b=>`<div class="card"><h2 style="font-size:1.15rem"><a href="/blog/${b.slug}/">${b.title}</a></h2><p>${b.desc}</p></div>`).join("")}</div></div></section>`}));
for(const b of blog){const s=services.find(x=>x.slug===b.svc);
 write(`blog/${b.slug}/index.html`,layout({url:"/blog/"+b.slug+"/",title:`${b.title} | ${C.name}`,desc:b.desc,
 schema:{"@context":"https://schema.org","@type":"Article","headline":b.title,"author":{"@type":"Organization","name":C.name},"publisher":{"@type":"Organization","name":C.name}},
 body:`<section><div class="wrap post"><p class="crumbs"><a href="/blog/">Guides</a></p><h1>${b.title}</h1>${b.body.map(p=>`<p>${md(p)}</p>`).join("")}
 <p>Related: <a href="/${s.slug}/">${s.nav}</a></p>${cta}</div></section>`}));}

// 404, assets, robots, sitemap, headers
write("404.html",layout({url:"/404.html",title:"Page not found",desc:"Page not found.",noindex:true,body:`<section><div class="wrap"><h1>Page not found</h1><p><a href="/">Go to the home page</a></p></div></section>`}));
pages.splice(pages.indexOf("/404.html"),1);
fs.cpSync("src/assets",OUT+"/assets",{recursive:true});
const today=new Date().toISOString().slice(0,10);
write("sitemap.xml",`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(u=>`<url><loc>${C.url}${u}</loc><lastmod>${today}</lastmod></url>`).join("")}</urlset>`);
write("robots.txt",`User-agent: *\nAllow: /\nSitemap: ${C.url}/sitemap.xml\n`);
write("_headers",`/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Strict-Transport-Security: max-age=31536000; includeSubDomains\n  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; connect-src 'self' https://api.web3forms.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; form-action 'self' https://api.web3forms.com; base-uri 'self'; frame-ancestors 'none'\n`);
console.log("built",pages.length,"indexable pages");
