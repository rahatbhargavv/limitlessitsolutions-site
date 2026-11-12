import runpy
g=runpy.run_path('gen_stipple.py')
inside,edist,text=g['inside'],g['edist'],g['text']
def dots(S,rmax,floor):
    d=[];row=0;y=8.0
    while y<196:
        x=2.0+(S/2 if row%2 else 0)
        while x<198:
            if inside(x,y):
                e=edist(x,y); d.append((x,y,rmax*min(1,max(floor,e/7))))
            x+=S
        y+=S*.866;row+=1
    return d
d=dots(7.6,3.3,.4)
k=.62; mw=200*k
c="".join(f'<circle cx="{x*k:.1f}" cy="{(y-4)*k:.1f}" r="{r*k:.2f}"/>' for x,y,r in d)
t1,w1=text("LIMITLESS",46,.38,mw+34,72,'#fff'); t2,w2=text("IT SOLUTIONS",14.5,.6,mw+36,100,'#fff')
W=int(mw+34+max(w1,w2)+4)
open('../../src/assets/logo-header.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 120" width="{W}" height="120"><g fill="#fff">{c}</g><rect x="{mw+16:.0f}" y="22" width="1" height="76" fill="#fff" opacity=".6"/>{t1}{t2}</svg>')
print(W,len(d))
