#!/usr/bin/env bash
# Regenerates Adam_Kanevsky_CV.pdf (from cv.html) and Adam_Kanevsky_CV.docx (from build.js).
# Edit the text in cv.html and build.js, then run:  bash cv/build.sh
set -e; cd "$(dirname "$0")"
C=${CHROME:-/opt/pw-browsers/chromium-1194/chrome-linux/chrome}
"$C" --headless=new --no-sandbox --disable-gpu --allow-file-access-from-files --virtual-time-budget=3000 \
  --no-pdf-header-footer --print-to-pdf=Adam_Kanevsky_CV.pdf "file://$PWD/cv.html" >/dev/null 2>&1
python3 -c "import re;d=open('Adam_Kanevsky_CV.pdf','rb').read();n=len(re.findall(rb'/Type\s*/Page(?!s)',d));print('PDF pages:',n);exit(0 if n==1 else 1)"
[ -d node_modules/docx ] || npm install --silent docx@8 >/dev/null
node build.js
