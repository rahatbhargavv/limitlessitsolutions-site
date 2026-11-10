#!/bin/sh
# Verifies the WebGL world reaches html.glready at several times of day.
# Usage: scripts/check-gl.sh [port]   (serves dist/ itself; exits non-zero on any miss)
PORT="${1:-8771}"
CH="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/dist" || { echo "dist/ missing: run npm run build"; exit 2; }
python3 -m http.server "$PORT" >/dev/null 2>&1 &
SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT INT TERM
sleep 1
FAIL=0
for u in 0 0.25 0.5 0.75 1; do
  # virtual time lets the 350 ms delayed start and async shader compile finish; 15 s was flaky on software GL, the shader got heavier, so use 120 s
  DOM=$("$CH" --headless=new --no-sandbox --use-gl=angle --use-angle=swiftshader \
    --enable-unsafe-swiftshader --ignore-gpu-blocklist --window-size=1440,900 \
    --virtual-time-budget=120000 --dump-dom "http://localhost:$PORT/?full&u=$u" 2>/dev/null)
  if echo "$DOM" | grep -q '<html[^>]*glready'; then
    echo "ok   u=$u"
  else
    echo "FAIL u=$u: html.glready missing"; FAIL=1
  fi
done
exit $FAIL
