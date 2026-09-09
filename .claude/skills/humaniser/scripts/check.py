#!/usr/bin/env python3
"""Flags machine-writing tells in text. Usage: check.py FILE  |  echo text | check.py
Exit 1 if anything is flagged. Date-range en dashes (2024–2025) are allowed."""
import re, sys
text = open(sys.argv[1], encoding='utf-8').read() if len(sys.argv) > 1 else sys.stdin.read()
flags = []
def flag(kind, m):
    line = text.count('\n', 0, m.start()) + 1
    flags.append(f"line {line:>3}  {kind:<22} {m.group(0)!r}")
for m in re.finditer(r'—', text): flag('em dash', m)
_dateish = re.compile(r"^(?:\d{1,4}|present|now|jan\w*|feb\w*|mar\w*|apr\w*|may|jun\w*|jul\w*|aug\w*|sep\w*|oct\w*|nov\w*|dec\w*)\b", re.I)
for m in re.finditer(r'\s*–\s*', text):
    prev = text[:m.start()].split()[-1:] or ['']
    nxt = text[m.end():].split()[:1] or ['']
    if _dateish.match(prev[0].split('(')[-1]) and _dateish.match(nxt[0]): continue  # date range, fine
    if re.search(r'\d', prev[0]) and re.search(r'\d', nxt[0]): continue  # numeric range like A$194–281 or U11–U15
    flag('en dash as pause', m)
for m in re.finditer(r'!', text): flag('exclamation', m)
for m in re.finditer(r'\.\.\.|…', text): flag('ellipsis', m)
for m in re.finditer(r"\b(?:it'?s|this is|that'?s|I'?m)\s+not\s+(?:just\s+|only\s+|about\s+)?[^.,;]{1,40},?\s+(?:it'?s|but|this is)\b", text, re.I): flag('not-X-but-Y', m)
for m in re.finditer(r'\bnot just\b|\bless about\b|\bmore than just\b', text, re.I): flag('contrast framing', m)
for m in re.finditer(r'\b\w+, \w+,? and \w+\b', text): flag('list of three', m)
openers = r"here'?s the thing|the reality is|worth noting|importantly|notably|that said|in short|ultimately|at the end of the day|in today'?s"
for m in re.finditer(r'(?:^|[.!?]\s+)(?:' + openers + r')', text, re.I | re.M): flag('AI opener', m)
closers = r"i'?d love to|excited to|looking forward to connecting|hope this (?:email )?finds you well|thanks in advance|feel free to|don'?t hesitate"
for m in re.finditer(closers, text, re.I): flag('AI closer', m)
words = ("genuinely actually truly really incredibly deeply seamless seamlessly robust leverage leverages leveraging delve "
         "navigate navigating landscape journey tapestry testament underscore underscores foster fostering harness elevate "
         "unlock empower empowering game-changer game-changing cutting-edge passionate driven excited thrilled resonate "
         "resonates align aligns synergy impactful utilise utilize showcase keen").split()
for m in re.finditer(r'\b(?:' + '|'.join(map(re.escape, words)) + r')\b', text, re.I): flag('banned word', m)
for m in re.finditer(r'\?\s+(?:Yes|No|Because|It)\b', text): flag('rhetorical Q+A', m)
for m in re.finditer(r'\*\*[^*\n]+\*\*', text): flag('bold in prose', m)
if flags:
    print(f"HUMANISER: {len(flags)} flag(s)"); print('\n'.join(flags)); sys.exit(1)
print("HUMANISER: clean"); sys.exit(0)
