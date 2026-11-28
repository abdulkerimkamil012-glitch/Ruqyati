import json, html, sys
sys.path.insert(0, '/home/claude/review')
from build import CSS
from easy_content import ITEMS, GROUPS, DECISIONS, LETTER, INTRO, NEW_DUAS, LETTER_DUAS
e = html.escape
D = json.load(open('/home/claude/review/data.json'))
DU, Q = D['DUAS'], D['QURAN']['passages']
AR = {f"{v['sora']}:{v['aya_no']}": v['aya_text'] for v in json.load(open('/home/claude/ruqyati/.cache-quran/ar.json'))}
AM = {f"{v['chapter']}:{v['verse']}": v['text'] for v in json.load(open('/home/claude/ruqyati/.cache-quran/am.json'))['quran']}

def verses(s, a, b):
    ar = ' '.join(AR[f'{s}:{i}'] for i in range(a, b + 1))
    am = ' '.join(f'({i}) {AM[f"{s}:{i}"]}' for i in range(a, b + 1))
    return ar, am

def arabic_block(kind, ref):
    if kind == 'q':
        s, a, b = ref
        ar, am = verses(s, a, b)
        return f'<div class="quran">{e(ar)}</div><div class="mean">{e(am)}</div>'
    if kind == 'd':
        d = DU[ref]
        return f'<div class="duaar">{e(d["ar"])}</div><div class="mean">{e(d["am"])}</div>'
    if kind == 'n':
        d = NEW_DUAS[ref]
        return f'<div class="duaar">{e(d["ar"])}</div><div class="mean">{e(d["am"])}</div>'
    return f'<div class="mean">{e(ref)}</div>'

def src_chip(src):
    icon = '📖' if src.startswith('ቁርኣን') else '📜'
    return f'<span class="chip src">{icon} {e(src)}</span>'

YN = ('<div class="check"><span><span class="box"></span>✓ ትክክል</span><span><span class="box"></span>✗ ይስተካከል</span></div>')
AGREE = ('<div class="check"><span><span class="box"></span>✓ እስማማለሁ</span><span><span class="box"></span>✗ አልስማማም</span></div>'
         '<div class="lines"></div><div class="lines"></div>')

out = []
dtab = '<table class="dtab"><tr><th>#</th><th>ዱዓ</th><th>ቁጥር</th><th>ምንጭ</th></tr>' + ''.join(f'<tr><td>{i}</td><td class="ar dar">{e(a)}</td><td style="text-align:center">×{e(c)}</td><td>{e(src)}</td></tr>' for i, (a, c, src) in enumerate(LETTER_DUAS, 1)) + '</table>'
lines = [l for l in LETTER.strip().split(chr(10)) if l.strip()]
out.append(f'<section><h2>ደብዳቤ</h2><div class="letter">{"".join(dtab if l == "[DUAS]" else (f"<p class=ar style=text-align:right>{e(l)}</p>" if l.startswith("بسم") else f"<p>{e(l)}</p>") for l in lines)}</div></section>')

# Section 1: everything in the app
cards, n = [], 0
for it in ITEMS:
    if it[0] == 'H':
        cards.append(f'<h3>{e(it[1])}</h3>'); continue
    n += 1
    _, title, kind, ref, count, src, lab = it
    cards.append(f'<div class="card easy"><div class="top"><span class="num">{n}</span><span class="title">{e(title)}</span>'
                 f'<span class="chip count">×{e(count)}</span>{src_chip(src)}<span class="chip {"l-s" if lab == "s" else "l-e"}">{"✅ ከሱና" if lab == "s" else "🟡 የመምህራን ልምድ"}</span></div>'
                 f'{arabic_block(kind, ref)}{YN}</div>')
out.append(f'<section class="part"><h2>ክፍል 1 · በመተግበሪያው ያለው ሁሉ (ሙሉ ጽሑፍ ከምንጩ ጋር)</h2>'
           f'<p class="hint">በእያንዳንዱ ቁጥር ✓ ወይም ✗ ብቻ ያድርጉ። የቁርኣን ጽሑፍ ከንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ) የተወሰደ ነው፤ የአማርኛ ትርጉሙ የሙሐመድ ሳዲቅና የሙሐመድ ሳኒ ሐቢብ ነው።</p>{"".join(cards)}</section>')

# Section 2: general daily protection questions
qn, qs = 0, []
for g in GROUPS:
    qs.append(f'<h3>{e(g["title"])}</h3>')
    for q in g['qs']:
        qn += 1
        props = ''
        for p in q.get('props', []):
            props += f'<div class="prop">{arabic_block(p[0], p[1]) if p[0] != "t" else ""}<div class="ptext">{e(p[2])} {src_chip(p[3]) if p[3] else ""}</div></div>'
        qs.append(f'<div class="card easy"><div class="top"><span class="num">{qn}</span><span class="title">{e(q["q"])}</span></div>'
                  f'{f"<div class=ours><b>የእኛ ሐሳብ፦</b> {e(q[chr(111)])}</div>" if q.get("o") else ""}{props}{AGREE}</div>')
out.append(f'<section class="part"><h2>ክፍል 2 · ግልጽ ችግር ለሌለበት ሰው የዕለት ጥበቃ</h2><p class="hint">{e(INTRO)}</p>{"".join(qs)}</section>')

# Section 3: earlier decisions
ds = ''.join(f'<div class="card easy"><div class="top"><span class="num">{chr(0x41 + i)}</span><span class="title">{e(d[0])}</span></div>'
             f'<div class="ours"><b>የእኛ ሐሳብ፦</b> {e(d[1])} {src_chip(d[2])}</div>{AGREE}</div>' for i, d in enumerate(DECISIONS))
out.append(f'<section class="part"><h2>ክፍል 3 · ውሳኔ የሚያስፈልጋቸው 8 ጉዳዮች</h2>{ds}'
           '<table style="margin-top:4mm"><tr><td style="height:10mm;width:45%">ስም</td><td></td></tr><tr><td style="height:10mm">ቀን</td><td></td></tr>'
           '<tr><td>ስሜ በመተግበሪያው ይጠቀስ</td><td><span class="box"></span> አዎ &nbsp; <span class="box"></span> አይ</td></tr></table></section>')

extra = """
.dtab td { font-size: 9pt; } .dtab .dar { font-family: Naskh; font-size: 12.5pt; font-weight: 600; direction: rtl; text-align: right; }
.letter p { margin: 0 0 2.2mm; font-size: 11pt; line-height: 1.6; }
h3 { font-size: 12pt; margin: 5mm 0 2.5mm; color: #15364a; background: #e4eff5; padding: 1.5mm 3mm; border-radius: 2mm; break-after: avoid; }
.hint { font-size: 9.5pt; color: #4d6878; }
.card.easy { break-inside: auto; } .card.easy .top { break-after: avoid; }
.card.easy .title { font-size: 12pt; }
.mean { font-size: 10pt; line-height: 1.55; }
.src { background: #fff3d6; color: #7a5a14; }
.ours { background: #eef6f0; border-radius: 2mm; padding: 2mm 3mm; margin: 2mm 0; font-size: 10pt; }
.prop { border-inline-start: 3px solid #cfe1ec; padding: 1mm 3mm; margin: 2mm 0; break-inside: avoid; }
.ptext { font-size: 9.5pt; color: #15364a; }
.quran { font-size: 18pt; }
.duaar { font-size: 16pt; }
"""
css = CSS.replace('Scholar review pack', 'Easy review') + extra
open('/home/claude/review/easy.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(out)}</body></html>')
print('ok', n, 'items', qn, 'questions')
