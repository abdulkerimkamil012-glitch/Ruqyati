import json, re, html, sys
sys.path.insert(0, '/home/claude/review')
from content import STEP_NOTES, EXTENDED_Q, GENERAL_QS

D = json.load(open('/home/claude/review/data.json'))
R, DU, Q, ART, EN, AM, AR = D['ROUTINES'], D['DUAS'], D['QURAN']['passages'], D['ARTICLES'], D['en'], D['am'], D['ar']
F = '/home/claude/ruqyati/node_modules/@fontsource-variable'
e = html.escape
strip = lambda s: re.sub(r'[ \s]*[٠-٩]+\s*$', '', s)
LABEL = {'sunnah': ('✅ ከሱና · من السنة', 'l-s'), 'experience': ('🟡 የመምህራን ልምድ · من تجربة الرقاة', 'l-e'), 'support': ('⚪ ጠቃሚ ልማድ · عادة نافعة', 'l-p')}

CSS = f"""
@font-face {{ font-family: Hafs; src: url('file:///home/claude/ruqyati/public/fonts/hafs18.woff2'); }}
@font-face {{ font-family: Eth; src: url('file://{F}/noto-sans-ethiopic/files/noto-sans-ethiopic-ethiopic-wght-normal.woff2'); font-weight: 100 900; }}
@font-face {{ font-family: Naskh; src: url('file://{F}/noto-naskh-arabic/files/noto-naskh-arabic-arabic-wght-normal.woff2'); font-weight: 400 700; }}
@font-face {{ font-family: Lat; src: url('file://{F}/nunito/files/nunito-latin-wght-normal.woff2'); font-weight: 200 1000; }}
@font-face {{ font-family: Lat; src: url('file://{F}/noto-naskh-arabic/files/noto-naskh-arabic-latin-ext-wght-normal.woff2'); unicode-range: U+0100-024F, U+1E00-1EFF, U+02B0-02FF; }}
@page {{ size: A4; margin: 14mm 13mm 16mm; @bottom-center {{ content: "Ruqyati · ሩቅያቲ · رقيتي — Scholar review pack · " counter(page) " / " counter(pages); font: 8pt Lat, Eth; color: #6b8494; }} }}
* {{ box-sizing: border-box; }}
body {{ font-family: Lat, Eth, Naskh, sans-serif; color: #15364a; font-size: 10pt; line-height: 1.45; margin: 0; }}
h1 {{ font-size: 22pt; margin: 0 0 4mm; }} h2 {{ font-size: 15pt; margin: 0 0 3mm; color: #2f84b8; border-bottom: 2px solid #cfe6f3; padding-bottom: 1.5mm; }}
.part {{ break-before: page; }}
.ar {{ font-family: Naskh; direction: rtl; text-align: right; }}
.quran {{ font-family: Hafs; direction: rtl; text-align: center; font-size: 19pt; line-height: 2.05; }}
.duaar {{ font-family: Naskh; direction: rtl; text-align: center; font-size: 17pt; font-weight: 600; line-height: 1.9; }}
.card {{ border: 1.2px solid #cfe1ec; border-radius: 4mm; padding: 4mm 5mm; margin: 0 0 5mm; break-inside: avoid-page; }}
.card.long {{ break-inside: auto; }}
.top {{ display: flex; align-items: center; gap: 2mm; flex-wrap: wrap; margin-bottom: 2mm; }}
.num {{ background: #2f84b8; color: #fff; border-radius: 50%; width: 8mm; height: 8mm; display: grid; place-items: center; font-weight: 800; }}
.title {{ font-size: 13pt; font-weight: 800; flex: 1; }}
.chip {{ border-radius: 10mm; padding: .6mm 3mm; font-size: 8.5pt; font-weight: 700; }}
.l-s {{ background: #dcebe1; color: #3d6b4d; }} .l-e {{ background: #ecdfc4; color: #6d5428; }} .l-p {{ background: #e6edf1; color: #4d6878; }}
.count {{ background: #e4eff5; color: #2f84b8; }}
.tr {{ font-style: italic; color: #4d6878; font-size: 9pt; text-align: center; margin: 1mm 0; }}
.mean {{ margin: 1.5mm 0; }} .mean b {{ color: #2f84b8; font-size: 8pt; }}
.ayah {{ display: flex; gap: 2mm; margin: 1mm 0; font-size: 9pt; }} .ayah .n {{ min-width: 6mm; color: #6b8494; font-weight: 700; }}
.en {{ color: #4d6878; font-size: 8.5pt; }}
.note {{ background: #f3f8fb; border-radius: 2mm; padding: 2mm 3mm; font-size: 9pt; margin: 2mm 0; }}
.ev {{ border-inline-start: 3px solid #6f9f80; padding: 1mm 3mm; font-size: 9pt; margin: 2mm 0; }}
.q {{ background: #fff8e8; border-radius: 2mm; padding: 2mm 3mm; margin: 2mm 0; font-size: 9.5pt; }}
.q .ar {{ font-size: 10.5pt; }}
.check {{ display: flex; flex-wrap: wrap; gap: 4mm; font-size: 8.5pt; margin-top: 2mm; color: #4d6878; }}
.lines {{ border-bottom: 1px dotted #9fb6c4; height: 7mm; }}
.box {{ display: inline-block; width: 3.5mm; height: 3.5mm; border: 1px solid #4d6878; border-radius: .6mm; vertical-align: -0.5mm; margin-inline-end: 1mm; }}
table {{ width: 100%; border-collapse: collapse; font-size: 9pt; }} td, th {{ border: 1px solid #cfe1ec; padding: 1.5mm 2mm; vertical-align: top; text-align: start; }}
.cover {{ height: 255mm; display: flex; flex-direction: column; justify-content: center; text-align: center; background: linear-gradient(#cfe6f3, #fff 60%); border-radius: 6mm; padding: 12mm; }}
.qrow {{ display: grid; grid-template-columns: 9mm 1fr; gap: 2mm; padding: 2.5mm 0; border-bottom: 1px solid #e4eff5; break-inside: avoid; }}
.qn {{ font-weight: 900; color: #2f84b8; font-size: 12pt; }}
"""

def yn(): return '<span class="box"></span>✓ ትክክል / صحيح &nbsp; <span class="box"></span>✗ ይስተካከል / يُصحَّح'

def check_row(items):
    return '<div class="check">' + ''.join(f'<span><b>{e(i)}:</b> <span class="box"></span>✓ <span class="box"></span>✗</span>' for i in items) + '</div><div class="lines"></div><div class="lines"></div>'

def questions(qs):
    return ''.join(f'<div class="q"><div>❓ {e(a)}</div><div class="ar">{e(b)}</div><div class="check">{yn()}</div><div class="lines"></div></div>' for a, b in qs)

def passage_block(pid, long=False):
    p = Q[pid]; out = []
    if p['from'] == 1 and p['surah'] not in (1, 9):
        out.append(f'<div class="quran" style="font-size:15pt;color:#6b8494">{e(strip(Q["basmala"]["ayahs"][0]["ar"]))}</div>')
    out.append('<div class="quran">' + ' '.join(e(a['ar']) for a in p['ayahs']) + '</div>')
    for a in p['ayahs']:
        out.append(f'<div class="ayah"><span class="n">{a["s"]}:{a["a"]}</span><span><i class="en">{e(a["tr"])}</i><br>{e(a["am"])}<br><span class="en">{e(a["en"])}</span></span></div>')
    return ''.join(out)

def step_card(n, s, routine, seen):
    kind, ref = s['kind'], s.get('ref')
    lab, cls = LABEL[s['label']]
    count = s['count'] if s['count'] != 'free' else 'free'
    if kind == 'passage':
        p = Q[ref]; t = f'<bdi>{e(p["nameEn"])}</bdi> · <bdi dir="rtl">سورة {e(p["nameAr"])}</bdi> · <bdi dir="ltr">{p["surah"]}:{p["from"]}{"–" + str(p["to"]) if p["to"] != p["from"] else ""}</bdi>'
    elif kind == 'dua':
        t = f'<bdi>{e(AM["dua_" + ref])}</bdi> · <bdi dir="rtl">{e(AR["dua_" + ref])}</bdi>'
    else:
        t = f'<bdi>{e(AM["step_" + kind])}</bdi> · <bdi dir="rtl">{e(AR["step_" + kind])}</bdi>'
    long = kind == 'passage' and len(Q[ref]['ayahs']) > 6
    body = [f'<div class="card{" long" if long else ""}"><div class="top"><span class="num">{n}</span><span class="title">{t}</span>'
            f'<span class="chip {cls}">{e(lab)}</span><span class="chip count">×{e(str(count))}</span></div>']
    if kind == 'passage':
        body.append(passage_block(ref))
    elif kind == 'dua':
        d = DU[ref]
        body.append(f'<div class="duaar">{e(d["ar"])}</div><div class="tr">{e(d["tr"])}</div>'
                    f'<div class="mean"><b>AM</b> {e(d["am"])}</div><div class="mean en"><b>EN</b> {e(d["en"])}</div>')
        if d.get('adapted'): body.append(f'<div class="note">⚠️ {e(AM["adaptedNote"])} · {e(AR["adaptedNote"])}</div>')
    if s.get('noteKey'):
        body.append(f'<div class="note"><b>የመተግበሪያው መመሪያ · تعليمات التطبيق:</b><br>{e(AM[s["noteKey"]])}<div class="ar">{e(AR[s["noteKey"]])}</div></div>')
    key = 'ikhlas' if s['id'] in ('falaq', 'nas') else ('baqarah' if s['id'] == 'baqarah3' else s['id'])
    ev = STEP_NOTES.get(key)
    if ev:
        body.append(f'<div class="ev"><b>ማስረጃ · الدليل:</b> {e(ev["src"])}<br><b>ቁጥር · العدد:</b> {e(ev["count"])}</div>')
        if key not in seen: body.append(questions(ev['q'])); seen.add(key)
    elif s.get('source'):
        body.append(f'<div class="ev"><b>ማስረጃ · الدليل:</b> {e(s["source"])}</div>')
    items = ['ጽሑፍ / النص', 'ቁጥር / العدد', 'ምንጭ / المصدر', 'አማርኛ / الأمهرية'] if kind in ('passage', 'dua') else ['ይዘት / المحتوى', 'ምንጭ / المصدر']
    body.append(check_row(items) + '</div>')
    return ''.join(body)

parts = []
parts.append(f"""<section class="cover"><div class="quran" style="font-size:40pt;color:#2f84b8">رُقْيَتِي</div><h1>Ruqyati · ሩቅያቲ</h1>
<p style="font-size:14pt;font-weight:800">የዓሊም ግምገማ ጥቅል · ملف المراجعة الشرعية · Scholar review pack</p>
<p>ይህ ሰነድ በመተግበሪያው ውስጥ ያለውን ሁሉ ይዟል፦ እያንዳንዱ አንቀጽ፣ ዱዓ፣ ቁጥር፣ ምንጭ፣ ትርጉምና መመሪያ።<br>
<span class="ar" style="text-align:center;display:block">يحتوي هذا الملف كل ما في التطبيق: كل آية ودعاء وعدد ومصدر وترجمة وتعليمات.</span></p>
<table style="margin-top:8mm"><tr><th>እንዴት እንደሚገመገም · طريقة المراجعة</th></tr>
<tr><td>1. በእያንዳንዱ ካርድ ላይ <span class="box"></span>✓ (ትክክል) ወይም <span class="box"></span>✗ (ይስተካከል) ምልክት ያድርጉ፤ ማስተካከያውን በነጥብ መስመሩ ላይ ይጻፉ።<div class="ar">ضع علامة ✓ أو ✗ في كل بطاقة، واكتب التصحيح على السطر المنقّط.</div></td></tr>
<tr><td>2. በክፍል “ሀ” ያሉትን ጥያቄዎች ይመልሱ።<div class="ar">أجب عن أسئلة القسم «أ».</div></td></tr>
<tr><td>3. የቁርኣን ዐረብኛ ጽሑፍ ከንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ v18) በቀጥታ የተወሰደ ነው፤ እባክዎ የክፍሎቹን ምርጫ፣ ቁጥሩንና ትርጉሙን ይመልከቱ።<div class="ar">نص القرآن مأخوذ مباشرة من مجمع الملك فهد (حفص، الإصدار ١٨)؛ يُرجى مراجعة اختيار المواضع والعدد والترجمة.</div></td></tr>
<tr><td>4. የሐዲስ ቁጥሮች፦ ቡኻሪና ሙስሊም በ sunnah.com ቁጥር (ሙስሊም፦ ፉኣድ ዐብዱል ባቂ)።<div class="ar">أرقام الأحاديث على ترقيم sunnah.com (مسلم: ترقيم محمد فؤاد عبد الباقي).</div></td></tr>
<tr><td><span class="chip l-s">✅ ከሱና · من السنة</span> <span class="chip l-e">🟡 የመምህራን ልምድ · من تجربة الرقاة</span> <span class="chip l-p">⚪ ጠቃሚ ልማድ · عادة نافعة</span></td></tr></table>
<p style="margin-top:8mm">ገምጋሚ · المراجع: ______________________ &nbsp; ቀን · التاريخ: ____________</p></section>""")

qa = ''.join(f'<div class="qrow"><span class="qn">{i}</span><div>{e(a)}<div class="ar">{e(b)}</div><div class="check">{yn()}</div><div class="lines"></div></div></div>' for i, (a, b) in enumerate(GENERAL_QS, 1))
parts.append(f'<section class="part"><h2>ሀ · ለኡስታዙ ዋና ጥያቄዎች · أ · الأسئلة الرئيسة للشيخ</h2>{qa}</section>')

def routine_part(letter, rid, title):
    seen = set()
    cards = ''.join(step_card(i, s, rid, seen) for i, s in enumerate(R[rid]['steps'], 1))
    extra = questions(EXTENDED_Q) if rid == 'extended' else ''
    return f'<section class="part"><h2>{letter} · {title}</h2><p>{e(AM["routine_" + rid + "_desc"])} <span class="ar">{e(AR["routine_" + rid + "_desc"])}</span></p>{extra}{cards}</section>'

parts.append(routine_part('ለ · ب', 'sunnah', f'<bdi>{AM["routine_sunnah"]}</bdi> · <bdi dir="rtl">{AR["routine_sunnah"]}</bdi>'))
parts.append(routine_part('ሐ · ج', 'other', f'<bdi>{AM["routine_other"]}</bdi> · <bdi dir="rtl">{AR["routine_other"]}</bdi>'))
parts.append(routine_part('መ · د', 'pain', f'<bdi>{AM["routine_pain"]}</bdi> · <bdi dir="rtl">{AR["routine_pain"]}</bdi>'))
parts.append(routine_part('ሠ · هـ', 'extended', f'<bdi>{AM["routine_extended"]}</bdi> · <bdi dir="rtl">{AR["routine_extended"]}</bdi>'))

arts = []
for a in ART:
    lab, cls = LABEL[a['label']]
    rows = ''.join(f'<tr><td>{e(x)}</td><td class="ar">{e(y)}</td><td style="width:16mm"><span class="box"></span>✓<br><span class="box"></span>✗</td></tr>' for x, y in zip(a['body']['am'], a['body']['ar']))
    src = ' · '.join(a['sources'])
    arts.append(f'<div class="card"><div class="top"><span class="title">{e(a["title"]["am"])} · <span class="ar" style="display:inline">{e(a["title"]["ar"])}</span></span><span class="chip {cls}">{e(lab)}</span></div>'
                f'<table>{rows}</table>{f"<div class=ev><b>ምንጭ · المصدر:</b> {e(src)}</div>" if src else ""}<div class="lines"></div></div>')
parts.append(f'<section class="part"><h2>ረ · መመሪያዎች (ውሃ፣ ዘይት፣ ዓይን፣ ለሌሎች) · و · الإرشادات</h2>{"".join(arts)}</section>')

parts.append("""<section class="part"><h2>ሰ · ማጽደቂያ · ز · الاعتماد</h2>
<p>ይህን ሰነድ ገምግሜ ከላይ የተጻፉት ማስተካከያዎች ከተደረጉ መተግበሪያው ለሕዝብ እንዲቀርብ እፈቅዳለሁ።</p>
<p class="ar">راجعتُ هذا الملف، وأوافق على نشر التطبيق بعد إجراء التصحيحات المكتوبة أعلاه.</p>
<table style="margin-top:6mm"><tr><td style="height:14mm">ስም · الاسم</td><td></td></tr><tr><td style="height:14mm">መስጂድ / ተቋም · المسجد / الجهة</td><td></td></tr>
<tr><td style="height:14mm">ስልክ · الهاتف</td><td></td></tr><tr><td style="height:14mm">ቀን · التاريخ</td><td></td></tr><tr><td style="height:24mm">ፊርማ · التوقيع</td><td></td></tr>
<tr><td>ስሜ በመተግበሪያው ይጠቀስ · يُذكر اسمي في التطبيق</td><td><span class="box"></span> አዎ · نعم &nbsp; <span class="box"></span> አይ · لا</td></tr></table></section>""")

open('/home/claude/review/pack.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{"".join(parts)}</body></html>')
print('ok')
