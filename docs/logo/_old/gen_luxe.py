import math
import re
def blade(O,ang,L,w,bend):
    a=math.radians(ang); dx,dy=math.cos(a),math.sin(a); nx,ny=-dy,dx
    tip=(O[0]+dx*L+nx*bend,O[1]+dy*L+ny*bend)
    b1=(O[0]+nx*w,O[1]+ny*w); b2=(O[0]-nx*w,O[1]-ny*w)
    c1=(O[0]+dx*L*.6+nx*(w*1.4+bend*.5),O[1]+dy*L*.6+ny*(w*1.4+bend*.5))
    c2=(O[0]+dx*L*.6-nx*(w*1.0-bend*.5),O[1]+dy*L*.6-ny*(w*1.0-bend*.5))
    f=lambda p:f"{p[0]:.1f},{p[1]:.1f}"
    return f"M{f(b1)} Q{f(c1)} {f(tip)} Q{f(c2)} {f(b2)} Z"
def bez(t,p0,p1,p2):
    return ((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t*t*p2[0],(1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t*t*p2[1])
ARM=((90,90),(66,56),(42,50))
def wing_paths():
    out=[]
    for row,(n,lf,wf,ao) in enumerate([(13,1.0,3.0,0),(11,.62,2.4,-4),(9,.34,1.8,-9)]):
        for i in range(n):
            t=i/(n-1); O=bez(t*0.97,*ARM)
            ang=100+t*88+ao
            prof=44+34*math.sin(min(1,t*1.15)*math.pi*0.62)+ (14 if t>.85 else 0)
            out.append(blade(O,ang,prof*lf*0.68,wf*0.85,-3*(1-t)-1))
    return out
def mirror(p):
    return re.sub(r'(-?\d+\.?\d*),(-?\d+\.?\d*)',lambda m:f"{200-float(m.group(1)):.1f},{m.group(2)}",p)
def tail():
    out=[]
    for i in range(-3,4):
        out.append(blade((100+i*2,142),90+i*9,52-abs(i)*5,2.4,0))
    return out
def xf(p,k=1.35,c=(99,94),dx=-4,dy=-6):
    return re.sub(r'(-?\d+\.?\d*),(-?\d+\.?\d*)',lambda m:f"{c[0]+(float(m.group(1))-c[0])*k+dx:.1f},{c[1]+(float(m.group(2))-c[1])*k+dy:.1f}",p)
LH="M54,72 C54,48 52,30 42,18 C36,11 26,9 18,12 L8,18 C2,22 0,30 3,38 L6,50 C8,43 12,39 20,38 L28,40 C28,50 30,58 38,72 Z"
def sh(p,dx=40,dy=20):
    return re.sub(r'(-?\d+\.?\d*),(-?\d+\.?\d*)',lambda m:f"{float(m.group(1))+dx:.1f},{float(m.group(2))+dy:.1f}",p)
head=sh(LH)
head=head.replace('Z','Z')
def wing(side): return wing_paths()
feathers="".join(f'<path d="{d}"/><path d="{mirror(d)}"/>' for d in wing_paths())
tails="".join(f'<path d="{d}"/>' for d in tail())+f'<path d="M90,90 Q66,56 42,50" fill="none"/><path d="M110,90 Q134,56 158,50" fill="none"/>'
ticks="".join(f'<line x1="100" y1="6" x2="100" y2="{12 if k%3 else 16}" transform="rotate({k*15} 100 100)"/>' for k in range(24))
mark=f'''
<defs>
<linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbeec6"/><stop offset=".5" stop-color="#d9b46c"/><stop offset="1" stop-color="#8f6a35"/></linearGradient>
<linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cd8c" stop-opacity=".30"/><stop offset="1" stop-color="#8f6a35" stop-opacity=".04"/></linearGradient>
<linearGradient id="hf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cd8c" stop-opacity=".75"/><stop offset="1" stop-color="#8f6a35" stop-opacity=".25"/></linearGradient>
<radialGradient id="aura" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#d9b46c" stop-opacity=".34"/><stop offset=".55" stop-color="#d9b46c" stop-opacity=".08"/><stop offset="1" stop-color="#d9b46c" stop-opacity="0"/></radialGradient>
</defs>
<circle cx="100" cy="100" r="118" fill="url(#aura)"/>
<circle cx="100" cy="100" r="94" fill="none" stroke="url(#g)" stroke-width=".6" opacity=".7"/>
<circle cx="100" cy="100" r="90" fill="none" stroke="#7df0c4" stroke-width=".35" opacity=".45" stroke-dasharray="1 4"/>
<g stroke="url(#g)" stroke-width=".6" opacity=".6">{ticks}</g>
<g fill="url(#gf)" stroke="url(#g)" stroke-width=".55" stroke-linejoin="round">
{feathers}{tails}</g>
<g fill="url(#hf)" stroke="url(#g)" stroke-width="1" stroke-linejoin="round"><path d="{head}"/><path d="{mirror(head)}"/></g>
<g fill="#07100f" stroke="url(#g)" stroke-width="1.2" stroke-linejoin="round">
<path d="M100,84 L112,100 L110,128 Q108,144 100,152 Q92,144 90,128 L88,100 Z"/></g>
<path d="M96,102 v24 h10" fill="none" stroke="url(#g)" stroke-width="2.4" stroke-linecap="square"/>
<g fill="#7df0c4" stroke="none"><circle cx="65" cy="43" r="1.6"/><circle cx="135" cy="43" r="1.6"/><path d="M58,38 L74,43" stroke="#07100f" stroke-width="1.6" stroke-linecap="round"/><path d="M142,38 L126,43" stroke="#07100f" stroke-width="1.6" stroke-linecap="round"/></g>
<path d="M100,8 L104,16 L100,24 L96,16 Z" fill="url(#g)"/>
'''
open('luxe-mark.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-20 -20 240 240"><rect x="-20" y="-20" width="240" height="240" fill="#05090a"/>{mark}</svg>')
lock=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 700"><defs><linearGradient id="t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b98b4a"/><stop offset=".5" stop-color="#fbeec6"/><stop offset="1" stop-color="#b98b4a"/></linearGradient></defs>
<rect width="640" height="700" fill="#05090a"/>
<g transform="translate(120,30) scale(2.0)">{mark}</g>
<text x="320" y="528" text-anchor="middle" font-family="Didot,'Bodoni 72','Playfair Display',Georgia,serif" font-size="58" fill="url(#t)" letter-spacing="16">LIMITLESS</text>
<g stroke="url(#t)" stroke-width="1"><line x1="150" y1="566" x2="296" y2="566"/><line x1="344" y1="566" x2="490" y2="566"/></g>
<path d="M320,558 L326,566 L320,574 L314,566 Z" fill="url(#t)"/>
<text x="320" y="616" text-anchor="middle" font-family="'Helvetica Neue',Helvetica,Arial,sans-serif" font-weight="300" font-size="17" fill="#c9b58a" letter-spacing="13">IT SOLUTIONS</text></svg>'''
open('luxe-lockup.svg','w').write(lock)
