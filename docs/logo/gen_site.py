import math,runpy
g=runpy.run_path('gen_stipple.py')
inside,edist,text,svg,mark,horizontal,INK,BG=[g[k] for k in('inside','edist','text','svg','mark','horizontal','INK','BG')]
A='../../src/assets/'
# header logo: transparent, white
open(A+'logo-header.svg','w').write(horizontal('#FFFFFF'))
open(A+'logo-mark.svg','w').write(g['mk']('#FFFFFF'))
# favicon: fewer, bigger dots
S=11.0; d=[]; row=0; y=10.0
while y<196:
    x=4.0+(S/2 if row%2 else 0)
    while x<198:
        if inside(x,y):
            e=edist(x,y); r=4.6*min(1,max(0.45,e/8))
            d.append((x,y,r))
        x+=S
    y+=S*0.866; row+=1
c="".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.2f}"/>' for x,y,r in d)
open(A+'favicon.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240"><rect width="240" height="240" rx="52" fill="#0B1F1E"/><g fill="#fff" transform="translate(28,24) scale(.92)">{c}</g></svg>')
print(len(d),'favicon dots')
# og page + square logo page
st,_=text("LIMITLESS",64,.42,600,470,'#fff',"middle"); st2,_=text("IT SOLUTIONS",22,.62,600,520,'#fff',"middle")
og=f'<!doctype html><meta charset=utf-8><body style="margin:0;background:{BG}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><rect width="1200" height="630" fill="{BG}"/>{mark("#fff",470,40,1.3)}{st}{st2}</svg>'
open('og.html','w').write(og)
sq=f'<!doctype html><meta charset=utf-8><body style="margin:0;background:{BG}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" fill="{BG}"/>{mark("#fff",70,70,1.85*0.62)}</svg>'
open('square.html','w').write(sq)
