import math
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
INK="#14524F"; BG="#0B1F1E"
L=[(100,22),(92,25),(87,34),(88,45),(92,53),(86,60),(70,50),(46,34),(14,8),(22,30),(6,24),(18,46),(4,42),(18,60),(6,62),(24,76),(14,84),(38,84),(30,100),(54,92),(70,104),(84,112),(86,128),(74,148),(62,174),(76,168),(76,190),(90,178),(94,196),(100,186)]
poly=L+[(200-x,y) for x,y in reversed(L)]
def inside(px,py):
    c=False; n=len(poly)
    for i in range(n):
        x1,y1=poly[i]; x2,y2=poly[(i+1)%n]
        if (y1>py)!=(y2>py) and px<(x2-x1)*(py-y1)/(y2-y1)+x1: c=not c
    return c
def edist(px,py):
    best=1e9
    for i in range(len(poly)):
        x1,y1=poly[i]; x2,y2=poly[(i+1)%len(poly)]
        dx,dy=x2-x1,y2-y1; t=max(0,min(1,((px-x1)*dx+(py-y1)*dy)/(dx*dx+dy*dy+1e-9)))
        best=min(best,math.hypot(px-(x1+t*dx),py-(y1+t*dy)))
    return best
S=5.4; dots=[]
row=0; y=8.0
while y<196:
    x=2.0+(S/2 if row%2 else 0)
    while x<198:
        if inside(x,y):
            e=edist(x,y); d=math.hypot(x-100,(y-85)*0.9)
            r=2.35*min(1,max(0.3,e/6))*(1-0.5*min(1,d/105))
            if r>0.3: dots.append((x,y,r))
        x+=S
    y+=S*0.866; row+=1
print(len(dots),"dots")
def mark(color,tx=0,ty=0,k=1.0):
    c="".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}"/>' for x,y,r in dots)
    return f'<g fill="{color}" transform="translate({tx},{ty}) scale({k})">{c}</g>'
font=TTFont('/tmp/Josefin-250.ttf'); gs=font.getGlyphSet(); cmap=font.getBestCmap(); upm=1000
def text(s,size,track,x,y,color,anchor="start"):
    k=size/upm; adv=[gs[cmap[ord(ch)]].width for ch in s]
    total=sum(adv)*k+track*size*(len(s)-1)
    x0=x-(total/2 if anchor=="middle" else 0); out=[]; cx=x0
    for ch,a in zip(s,adv):
        if ch!=" ":
            pen=SVGPathPen(gs); tp=TransformPen(pen,(k,0,0,-k,cx,y)); gs[cmap[ord(ch)]].draw(tp)
            out.append(pen.getCommands())
        cx+=a*k+track*size
    return f'<path fill="{color}" d="{" ".join(out)}"/>',total
def svg(w,h,body,bg=None):
    r=f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">{r}{body}</svg>'
def horizontal(c,bg=None):
    t1,w1=text("LIMITLESS",44,.42,190,76,c); t2,w2=text("IT SOLUTIONS",15,.62,192,108,c)
    return svg(int(190+w1+30),150,mark(c,10,5,.72)+f'<rect x="162" y="30" width="1" height="90" fill="{c}" opacity=".7"/>'+t1+t2,bg)
def stacked(c,bg=None):
    t1,_=text("LIMITLESS",40,.42,230,262,c,"middle"); t2,_=text("IT SOLUTIONS",14,.62,230,292,c,"middle")
    return svg(460,330,mark(c,130,10,.95)+t1+t2,bg)
def mk(c,bg=None): return svg(200,200,mark(c,0,0,1),bg)
W="#FFFFFF"
files={'limitless-mark.svg':mk(INK),'limitless-mark-reversed.svg':mk(W,BG),'limitless-logo-horizontal.svg':horizontal(INK),'limitless-logo-horizontal-reversed.svg':horizontal(W,BG),'limitless-logo-stacked.svg':stacked(INK),'limitless-logo-stacked-reversed.svg':stacked(W,BG)}
for n,s in files.items(): open(n,'w').write(s)
# preview sheet
h,_=horizontal(INK),0
def inner(s): return s.split('>',1)[1].rsplit('</svg>',1)[0]
sheet=f'<rect width="1200" height="820" fill="#fff"/><rect y="400" width="1200" height="420" fill="{BG}"/>'
sheet+=f'<g transform="translate(30,70) scale(1.05)">{inner(horizontal(INK))}</g>'
sheet+=f'<g transform="translate(30,470) scale(1.05)">{inner(horizontal(W))}</g>'
sheet+=f'<g transform="translate(880,250)">{mark(INK,0,0,.3)}</g><g transform="translate(980,260)">{mark(INK,0,0,.16)}</g><g transform="translate(1040,266)">{mark(INK,0,0,.1)}</g>'
sheet+=f'<g transform="translate(880,650)">{mark(W,0,0,.3)}</g><g transform="translate(980,660)">{mark(W,0,0,.16)}</g><g transform="translate(1040,666)">{mark(W,0,0,.1)}</g>'
open('preview-sheet.svg','w').write(svg(1200,820,sheet))
