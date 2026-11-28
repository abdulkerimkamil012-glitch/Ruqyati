import json, html, re, sys
sys.path.insert(0, '/home/claude/review')
from build import CSS
from v2_items import DAILY, TROUBLE, HOWTO
from v2_questions import QUESTIONS

e = html.escape
AR = {(v['sora'], v['aya_no']): v for v in json.load(open('/home/claude/ruqyati/.cache-quran/ar.json'))}
AMQ = {(v['chapter'], v['verse']): v['text'] for v in json.load(open('/home/claude/ruqyati/.cache-quran/am.json'))['quran']}
strip = lambda s: re.sub(r'[ \s]*[٠-٩]+\s*$', '', s)
BASMALA = strip(AR[(1, 1)]['aya_text'])
LAB = {'s': ('✅ ከሱና · من السنة', 'l-s'), 'e': ('🟡 የመምህራን ልምድ / ውሳኔ ያስፈልጋል · يحتاج إلى حكم', 'l-e')}
BOX = '<span class="box"></span>'
n = 0

def quran_html(refs):
    out = []
    for s, a, b in refs:
        name = AR[(s, a)]['sora_name_ar']
        head = f'<div class="ref"><bdi dir="rtl">سورة {e(name)}</bdi> · <bdi dir="ltr">Quran {s}:{a}{"–" + str(b) if b != a else ""}</bdi></div>'
        bas = f'<div class="quran small">{e(BASMALA)}</div>' if a == 1 and s not in (1, 9) else ''
        text = ' '.join(e(AR[(s, i)]['aya_text']) for i in range(a, b + 1))
        mean = ' '.join(f'<b>({i})</b> {e(AMQ[(s, i)])}' for i in range(a, b + 1))
        out.append(f'{head}{bas}<div class="quran">{text}</div><div class="mean">{mean}</div>')
    return ''.join(out)

SEEN = {}
def item(it):
    global n
    n += 1
    lab, cls = LAB[it['l']]
    body = ''
    if it.get('q'):
        key = tuple(it['q'])
        if key in SEEN:
            body = f'<div class="mean">↑ ሙሉ ጽሑፉ በቁጥር {SEEN[key]} ላይ አለ · النص كاملًا في رقم {SEEN[key]}</div>'
        else:
            SEEN[key] = n
            body = quran_html(it['q'])
    if it.get('t'):
        body += f'<div class="duaar">{e(it["t"])}</div>'
    if it.get('m'):
        body += f'<div class="mean">{e(it["m"])}</div>'
    if not body:
        body = '<div class="mean">↑ ሙሉ ጽሑፉ በቁጥር 1 እና 7 ላይ አለ · النص في رقم ١ و٧</div>'
    when = f'<span class="chip count">⏰ {e(it["w"])}</span>' if it.get('w') else ''
    return (f'<div class="card"><div class="top"><span class="num">{n}</span><span class="title"><bdi>{e(it["n"])}</bdi> · <bdi dir="rtl">{e(it["a"])}</bdi></span>'
            f'<span class="chip count">× {e(it["c"])}</span>{when}</div>{body}'
            f'<div class="ev"><b>ምንጭ · المصدر:</b> {e(it["s"])} &nbsp; <b>ደረጃ · الدرجة:</b> {e(it["g"])} &nbsp; <span class="chip {cls}">{e(lab)}</span></div>'
            f'<div class="check"><span>{BOX}✓ ትክክል · صحيح</span><span>{BOX}✗ ይስተካከል · يُصحَّح</span><span>ቁጥር · العدد: ______</span></div><div class="lines"></div></div>')

def group(title, items):
    return f'<h3>{e(title)}</h3>' + ''.join(item(i) for i in items)

def para(t, cls=''):
    return ''.join(f'<p class="{cls}">{e(l)}</p>' for l in t.split('\n') if l.strip())

parts = [f'<section><h2>ደብዳቤ · رسالة</h2><div class="letter">{para(open("/home/claude/review/letter2_am.txt").read())}</div>'
         f'<hr><div class="letter ar">{para(open("/home/claude/review/letter2_ar.txt").read(), "ar")}</div></section>']

guide = ('<div class="note"><b>እንዴት እንደሚነበብ · طريقة القراءة:</b> እያንዳንዱ ካርድ፦ ቁጥር · ስም · <b>× ስንት ጊዜ</b> · ⏰ መቼ · ሙሉ ዐረብኛ · አማርኛ ትርጉም · <b>ምንጭና ደረጃ</b> · ✓/✗። '
         'የቁርኣን ጽሑፍ ከንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ v18)፤ ትርጉም ሙሐመድ ሳዲቅና ሙሐመድ ሳኒ ሐቢብ። “?” ያለበት ቁጥር ውሳኔዎን ይፈልጋል።'
         '<div class="ar">كل بطاقة: الرقم · الاسم · العدد · الوقت · النص كاملًا · المعنى بالأمهرية · المصدر والدرجة · ✓/✗. علامة «؟» تعني أن العدد يحتاج إلى حكمكم.</div></div>')
parts.append(f'<section class="part"><h2>ክፍል 1 · የዕለት መርሐ ግብር · القسم ١ · البرنامج اليومي</h2>{guide}' + ''.join(group(t, i) for t, i in DAILY) + '</section>')
parts.append('<section class="part"><h2>ክፍል 2 · ለችግር ጊዜ · القسم ٢ · عند الحاجة</h2>' + ''.join(group(t, i) for t, i in TROUBLE) + '</section>')

how = ''
for h in HOWTO:
    global_n = None
    n += 1
    lab, cls = LAB[h['l']]
    how += (f'<div class="card"><div class="top"><span class="num">{n}</span><span class="title">{e(h["n"])}</span><span class="chip {cls}">{e(lab)}</span></div>'
            f'<div class="mean">{e(h["b"])}</div><div class="ev"><b>ምንጭ · المصدر:</b> {e(h["s"])}</div>'
            f'<div class="check"><span>{BOX}✓ ትክክል · صحيح</span><span>{BOX}✗ ይስተካከል · يُصحَّح</span></div><div class="lines"></div></div>')
parts.append(f'<section class="part"><h2>ክፍል 3 · ትፍ ትፍ፣ ውሃና ዘይት · القسم ٣ · النفث والماء والزيت</h2>{how}</section>')

qs, qn = '', 0
for title, items in QUESTIONS:
    qs += f'<h3>{e(title)}</h3>'
    for a, b in items:
        qn += 1
        qs += (f'<div class="qrow"><span class="qn">ጥ{qn}</span><div>{e(a)}<div class="ar">{e(b)}</div>'
               f'<div class="check"><span>{BOX}አዎ · نعم</span><span>{BOX}አይ · لا</span><span>መልስ · الجواب:</span></div><div class="lines"></div></div></div>')
parts.append(f'<section class="part"><h2>ክፍል 4 · ጥያቄዎች ለኡስታዙ · القسم ٤ · أسئلة للشيخ</h2>{qs}</section>')

EXT = [dict(n='አሊ ዒምራን (መጀመሪያ)', a='آل عمران', q=[(3, 1, 5)]), dict(n='አሊ ዒምራን (መጨረሻ)', a='آل عمران', q=[(3, 190, 200)]),
       dict(n='አስ-ሷፍፋት', a='الصافات', q=[(37, 1, 10)]), dict(n='ሱረቱል ጂን', a='الجن', q=[(72, 1, 28)]),
       dict(n='አል-ሐሽር (መጨረሻ)', a='الحشر', q=[(59, 21, 24)]), dict(n='አል-ቀለም (መጨረሻ)', a='القلم', q=[(68, 51, 52)]),
       dict(n='አል-ከህፍ 39 (ለዓይን)', a='الكهف', q=[(18, 39, 39)])]
for x in EXT:
    x.update(c='1' if x['q'][0] != (18, 39, 39) else '7 ?', w='', s='— (የተለየ ሐዲስ የለም · لا حديث خاص)', g='—', l='e')
parts.append('<section class="part"><h2>ተጨማሪ · የተራዘመ ዝርዝር · ملحق · القائمة الموسّعة</h2>'
             '<div class="note">ይህ ክፍል ከአንድ የሩቅያ መምህር ልምድ የመጣ ነው። በዕለት መርሐ ግብሩ ውስጥ ይግባ ወይስ አይግባ? · هذا من تجربة أحد الرقاة؛ هل يدخل في البرنامج اليومي؟ '
             f'{BOX} አዎ · نعم &nbsp; {BOX} አይ · لا</div>' + ''.join(item(x) for x in EXT) + '</section>')

parts.append(f"""<section class="part"><h2>ማጽደቂያ · الاعتماد</h2><p>ከላይ የተጻፉት ማስተካከያዎች ከተደረጉ መተግበሪያው ለሕዝብ እንዲቀርብ እፈቅዳለሁ። <span class="ar">أوافق على نشر التطبيق بعد إجراء التصحيحات المكتوبة.</span></p>
<table><tr><td style="height:12mm;width:40%">ስም · الاسم</td><td></td></tr><tr><td style="height:12mm">ቀን · التاريخ</td><td></td></tr><tr><td style="height:20mm">ፊርማ · التوقيع</td><td></td></tr>
<tr><td>ስሜ ይጠቀስ · يُذكر اسمي</td><td>{BOX} አዎ · نعم &nbsp; {BOX} አይ · لا</td></tr></table></section>""")

css = CSS.replace('Scholar review pack', 'General daily ruqyah — review') + """
h3 { font-size: 12pt; color: #3d6b4d; margin: 4mm 0 2mm; }
.ref { font-size: 9pt; color: #6b8494; text-align: center; margin-top: 1mm; }
.quran.small { font-size: 14pt; color: #6b8494; }
.mean { font-size: 9.5pt; line-height: 1.6; }
.letter p { margin: 0 0 2mm; font-size: 10.5pt; } .letter.ar p { font-size: 11.5pt; }
hr { border: 0; border-top: 1px solid #cfe1ec; margin: 4mm 0; }
.card { padding: 3mm 4mm; margin-bottom: 3.5mm; }
"""
open('/home/claude/review/v2.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(parts)}</body></html>')
print('ok items', n, 'questions', qn)
