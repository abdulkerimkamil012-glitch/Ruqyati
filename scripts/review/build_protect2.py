import json, html, sys, re
sys.path.insert(0, '/home/claude/review')
import io, contextlib
with contextlib.redirect_stdout(io.StringIO()):
    from build import CSS
from protect2_content import SECTIONS, WATER_STEPS, QUESTIONS
e = html.escape
C = '/home/claude/ruqyati/.cache-quran'
AR = {(v['sora'], v['aya_no']): v for v in json.load(open(f'{C}/ar.json'))}
AMQ = {(v['chapter'], v['verse']): v['text'] for v in json.load(open(f'{C}/am.json'))['quran']}
TR = {(v['chapter'], v['verse']): v['text'].replace('AA', 'ʿ') for v in json.load(open(f'{C}/tr.json'))['quran']}

def box(): return '<span class="box"></span>'
def lines(n=1): return '<div class="lines"></div>' * n

def item(i, it):
    if it['k'] == 'q':
        s, a, b = it['ref']
        name = AR[(s, a)]['sora_name_ar']
        rng = f'{s}:{a}' + (f'–{b}' if b != a else '')
        basm = ''
        if a == 1 and s not in (1, 9):
            basm = f'<div class="quran" style="font-size:13pt;color:#6b8494">{e(re.sub(r"[ \s]*[٠-٩]+\s*$", "", AR[(1, 1)]["aya_text"]))}</div>'
        arab = basm + '<div class="quran" style="font-size:16pt">' + ' '.join(e(AR[(s, x)]['aya_text']) for x in range(a, b + 1)) + '</div>'
        tr = ' '.join(e(TR[(s, x)]) for x in range(a, b + 1))
        am = ' '.join(e(AMQ[(s, x)]) for x in range(a, b + 1))
        title = f'<bdi dir="rtl">سورة {e(name)}</bdi> <bdi dir="ltr">{rng}</bdi>'
    else:
        arab = f'<div class="duaar" style="font-size:14.5pt">{e(it["ar"])}</div>'
        tr, am, title = '', e(it['am']), 'ዱዓ · دعاء'
    return (f'<div class="card"><div class="top"><span class="num">{i}</span><span class="title" style="font-size:11pt">{title}</span>'
            f'<span class="chip count">×{e(it["n"])}</span><span class="chip l-p">🕒 {e(it["when"])}</span></div>{arab}'
            + (f'<div class="tr">{tr}</div>' if tr else '') +
            f'<div class="mean"><b>AM</b> {am}</div><div class="ev"><b>ማስረጃ · المصدر:</b> {e(it["src"])}</div>'
            f'<div class="check"><span>{box()}✓ ትክክል · صحيح</span><span>{box()}✗ ይስተካከል · يُصحَّح</span><span>ቁጥር/ሰዓት ይቀየር · العدد/الوقت: ______</span></div>{lines()}</div>')

letter_am = open('/home/claude/review/letter3_am.txt').read().strip()
para = lambda t, c='': ''.join(f'<p class="{c}" style="margin:0 0 1.8mm">{e(l)}</p>' for l in t.split('\n') if l.strip())

out = [f'<section><h2>ደብዳቤ · رسالة</h2><div style="font-size:11pt">{para(letter_am)}</div></section>']
n = 0
out.append('<section class="part"><h2>ክፍል 1 · የምናቀርበው የዕለት ፕሮግራም · القسم ١ · البرنامج اليومي المقترح</h2>'
           '<p style="font-size:9.5pt;margin:0">እያንዳንዱ ቁጥር፦ ሙሉ ጽሑፍ፣ የአማርኛ ትርጉም፣ ስንት ጊዜ፣ መቼ፣ ምንጭ። ✓ ወይም ✗ ብቻ ያድርጉ።</p>'
           '<p class="ar" style="font-size:10.5pt;margin:0">كل رقم: النص كاملًا، المعنى، العدد، الوقت، المصدر. ضع ✓ أو ✗.</p>'
           '<p style="font-size:8.5pt;color:#4d6878;margin:1.5mm 0 0">የቁርኣን ጽሑፍ፦ የንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ)። የአማርኛ ትርጉም፦ ሙሐመድ ሳዲቅና ሙሐመድ ሳኒ ሐቢብ።</p>'
           '<p class="ar" style="font-size:9.5pt;color:#4d6878;margin:0">نص القرآن: مجمع الملك فهد (حفص). الترجمة الأمهرية: محمد صادق ومحمد ثاني حبيب.</p>')
for title, items in SECTIONS:
    out.append(f'<h2 style="font-size:12.5pt;margin-top:4mm">{e(title)}</h2>')
    for it in items:
        n += 1
        out.append(item(n, it))
water = ''.join(f'<tr><td style="width:7mm;font-weight:900;color:#2f84b8">{i}</td><td>{e(a)}<div class="ar">{e(b)}</div></td><td style="width:16mm">{box()}✓<br>{box()}✗</td></tr>' for i, (a, b) in enumerate(WATER_STEPS, 1))
out.append(f'<h2 style="font-size:12.5pt;margin-top:4mm">መ · የሩቅያ ውሃ አደራረግ (የእኛ ሐሳብ) · د · طريقة ماء الرقية (اقتراحنا)</h2><div class="card"><table>{water}</table>'
           '<div class="ev"><b>ማስረጃ · المصدر:</b> ነፍስ፦ al-Bukhārī 5017, 5751 (በእጅ ላይ · في الكفين) · በውሃ ላይ ማንበብ፦ የሰለፎችና የዑለማዎች ተግባር እንጂ የተለየ ሶሒሕ ሐዲስ የለም · القراءة على الماء: عمل السلف وأجازه العلماء، ولا حديث صحيح خاص فيه (🟡)</div></div>')
out.append('</section>')
qs = ''.join(f'<div class="qrow"><span class="qn">{i}</span><div>{e(a)}<div class="ar">{e(b)}</div>{lines(2)}</div></div>' for i, (a, b) in enumerate(QUESTIONS, 1))
out.append(f'<section class="part"><h2>ክፍል 2 · ጥያቄዎች · القسم ٢ · الأسئلة</h2><p style="font-size:9.5pt;margin:0">በድምጽ መልዕክት በቁጥር መመለስ ይቻላል (ለምሳሌ «ጥያቄ 4፦ …»)።</p><p class="ar" style="font-size:10.5pt;margin:0">يمكن الجواب برسالة صوتية بالأرقام.</p>{qs}</section>')
out.append('<div class="card" style="margin-top:4mm"><b>🎙️ መልስዎንና ተጨማሪ ዱዓዎችን በድምጽ መልዕክት ቢልኩልኝ በቂ ነው።</b><div class="ar">يكفيني الجواب والاقتراح برسالة صوتية.</div></div>'
           '<table style="margin-top:3mm"><tr><td style="height:10mm;width:35%">ስም · الاسم</td><td></td></tr><tr><td style="height:10mm">ቀን · التاريخ</td><td></td></tr></table>')
css = CSS.replace('Scholar review pack', 'Daily protection & calm — questions') + '.qrow{padding:1.2mm 0} .qrow .lines{height:5mm}'
open('/home/claude/review/protect2.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(out)}</body></html>')
print('ok', n, 'items', len(QUESTIONS), 'questions')
