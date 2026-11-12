# Design ops: how changes to this site are made and checked

Lean version for a one-owner site where more than one agent (Shelby, Claude) may edit the repo.

## 1. Handoff rules between agents
1. **One writer at a time.** Before editing, run `git status` and `git log -3`. If another agent committed in the last 15 minutes or the tree is dirty, stop and tell the owner.
2. **Small commits.** One concern per commit (readability, caching, a page). Message says what changed and why.
3. **Append, don't rewrite.** Style changes go in a dated block at the end of `src/assets/style.css` with a one-line comment. Fold them into the main rules only in a dedicated cleanup commit.
4. **Rebuild before commit.** `node build.mjs` must say `built 17 indexable pages`. `dist/` is committed.
5. **Leave a note.** Anything unfinished or unverified goes in "Open QA issues" below, not in chat only.
6. **Owner-only facts.** Never invent warranty terms, prices, reviews, licensing claims or legal text. Those stay as `[BRACKETS]` until listed in `NEEDS_FROM_OWNER.md` as resolved.

## 2. Design QA checklist (run before telling the owner "done")
| Area | Check | How |
|---|---|---|
| Readability | Heading and body text readable over the 3D scene at scroll 0, mid, night | Screenshot home at 1440x900 and 390x844 |
| Header | Logo, phone, quote, menu visible on hero AND on cream sections | Scroll an inner page |
| Responsive | No horizontal scroll at 320, 390, 768, 1024, 1440 | `scrollWidth > innerWidth` check |
| Forms | Quote form sends and the owner receives the email | Real test submit after the form key is set |
| States | Hover, focus (keyboard Tab), reduced motion, no-WebGL fallback | Tab through; `?`-less run with GL off (`scripts/check-gl.sh`) |
| Content | No `[BRACKET]` placeholder visible to the public unless intentionally flagged | `grep -o '\[[A-Z][A-Z /&-]*\]' dist -r` |
| Accessibility | Contrast 4.5:1 for text, 44px touch targets, alt text, focus order | Lighthouse a11y, keyboard test |
| Performance | Home first load, three.js and textures deferred, cache headers on `/assets/tex|vendor|fonts` | Lighthouse, network panel |
| SEO | Titles, schema, sitemap still build | `node build.mjs`, spot-check `dist/sitemap.xml` |

Severity: **Critical** (task impossible) / **Major** (confusing or wrong) / **Minor** (looks off) / **Cosmetic**.

Issue format: `What / Expected / Actual / Severity / Environment`.

## 3. Open QA issues (2026-11-11)
| # | Sev | What | Status |
|---|---|---|---|
| 1 | Critical | Quote form cannot send: `web3formsKey` is still `[FORM KEY]` (see `DEPLOY.md` step 3) | Needs owner key |
| 2 | Major | Warranty, tech-checkup scope/price, About text still placeholders | Needs owner content |
| 3 | Major | Home first load ~2.2 MB (three.js 675 KB, ~1.2 MB textures) | Cached after first visit; first-load slimming not done |
| 4 | Minor | Mobile two-row header now has a backing; not yet checked visually | Verify at 390px |
| 5 | Minor | Inner-page content cards after the elevation pass not yet screenshot-reviewed | Verify `/wifi-networking/` at scroll 1800 |
| 6 | Minor | 3D landscape look (trees, rocks, lake) flagged by owner as unsatisfactory, no specific complaint yet | Needs owner direction |
| 7 | Info | Immutable cache on `/assets/tex`, `/assets/vendor`, `/assets/fonts`: if a texture file changes, give it a new filename | Rule |

## 4. Fixed so far
- Home headings and glass tiles low contrast over bright sky/snow (commit "Readability").
- Inner-page header invisible over cream sections; abrupt dark-to-cream edge (commit "Design elevation").
- No long-term caching for heavy static assets (commit "Long-term caching").

## 5. Cadence for one person
- After each change batch: run the checklist, update section 3.
- Weekly, 10 minutes: owner skims the live site on phone and desktop and adds anything that feels off to section 3.
- Before launch: all Critical and Major closed, or explicitly accepted by the owner.
