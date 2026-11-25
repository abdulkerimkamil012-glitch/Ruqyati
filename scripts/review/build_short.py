import json, html, sys, re
sys.path.insert(0, '/home/claude/review')
from build import CSS  # same fonts and look
D = json.load(open('/home/claude/review/data.json'))
DU, Q = D['DUAS'], D['QURAN']['passages']
e = html.escape

def qref(pid):
    p = Q[pid]
    rng = f'{p["surah"]}:{p["from"]}' + (f'–{p["to"]}' if p['to'] != p['from'] else '')
    return f'<span class="ar" style="display:inline">سورة {e(p["nameAr"])}</span> <bdi dir="ltr">{rng}</bdi>'

def dua(did):
    return f'<div class="ar" style="font-size:11pt;font-weight:600">{e(DU[did]["ar"])}</div>'

# (what-html, amharic-label, count, source, label)
S, E, P = '✅', '🟡', '⚪'
ROWS = [
  ('ሀ · ዋናው የሱና ሩቅያ · الرقية من السنة (الافتراضية)', None),
  (dua('istiadha'), 'ኢስቲዓዛ', '1', 'Quran 16:98', S),
  (qref('fatiha'), 'አል-ፋቲሓ', '1 / 3 / 7', 'Bukhari 5749 · Muslim 2201', S),
  (qref('kursi'), 'አየተል ኩርሲይ', '1', 'Bukhari 2311', S),
  (qref('baqarahEnd2'), 'የበቀራ መጨረሻ', '1', 'Bukhari 5009 · Muslim 807', S),
  ('<span class="ar" style="display:inline">الإخلاص · الفلق · الناس</span>', 'ሦስቱ ቁልዎች', '3', 'Bukhari 5017, 5751', S),
  ('<span class="ar" style="display:inline">النفث في الكفين والمسح</span>', 'እፍ ብሎ ማበስ', '—', 'Bukhari 5017', S),
  (dua('bismillah3'), 'እጅ በሚያመው ቦታ', '3', 'Muslim 2202', S),
  (dua('painRefuge'), 'የህመም ዱዓ', '7', 'Muslim 2202', S),
  (dua('kalimat'), 'የአላህ ፍጹም ቃላት', '3', 'Muslim 2708', S),
  (dua('adhhib'), 'አዝሂቢል በእስ', '3', 'Bukhari 5743 · Muslim 2191', S),
  (dua('jibrilSelf'), 'የጅብሪል ሩቅያ (ለራስ የተቀየረ)', '3', 'Muslim 2186', S),
  ('ለ · ለልጅ / ለትዳር አጋር · للطفل والزوج', None),
  ('<span class="ar" style="display:inline">وضع اليد على رأس المرقي</span>', 'እጅ በራስ ላይ', '—', 'Muslim 2198', S),
  (dua('jibrilOther'), 'የጅብሪል ሩቅያ', '3', 'Muslim 2186', S),
  (dua('asalu'), 'አስአሉላሀል ዐዚም', '7', 'Abu Dawud 3106 · Tirmidhi 2083', S),
  ('ሐ · የተራዘመ ሩቅያ (የመምህራን ልምድ) · الرقية الموسّعة (تجربة الرقاة)', None),
  (qref('fatiha'), 'አል-ፋቲሓ', '7', '—', E),
  (qref('baqarahEnd3'), 'አል-በቀራ', '1', 'Bukhari 5009 (285–286)', E),
  (qref('imranStart'), 'አሊ ዒምራን', '1', '—', E),
  (qref('imranEnd'), 'አሊ ዒምራን (መጨረሻ)', '1', '—', E),
  (qref('saffat'), 'አስ-ሷፍፋት', '1', '—', E),
  (qref('jinn'), 'ሱረቱል ጂን', '1', '—', E),
  (qref('hashrEnd'), 'አል-ሐሽር', '1', '—', E),
  (qref('qalamEnd'), 'አል-ቀለም', '1', '—', E),
  (qref('kahf39'), 'አል-ከህፍ', '7', '—', E),
  ('መ · ሌሎች · أخرى', None),
  (dua('mashaAllah'), 'ከዓይን ጥበቃ', '—', 'Ibn Majah 3509 · Quran 18:39', S),
  ('<span class="ar" style="display:inline">القراءة على الماء والزيت: يشرب ويغتسل / يدّهن</span>', 'የሩቅያ ውሃና ዘይት', '—', '—', E),
]

DECISIONS = [
  ('ሦስቱ ቁልዎች፦ ሦስቱንም አንብቦ፣ እፍ ብሎ፣ ማበስ — ይህን ሙሉ ዑደት 3 ጊዜ (ቡኻሪ 5017)። አሁን ግን እያንዳንዱን 3 ጊዜ አንብበን አንድ ጊዜ እናብሳለን። በሐዲሱ መሠረት እንቀይረው?',
   'المعوذات: يقرأ الثلاث ثم ينفث ويمسح، ويكرر ذلك ثلاثًا (البخاري ٥٠١٧). نحن الآن نكرر كل سورة ثلاثًا ثم نمسح مرة. هل نغيّره إلى صفة الحديث؟'),
  ('እጅ በሚያመው ቦታ፦ ሐዲሱ “እጅህን” ይላል (ሙስሊም 2202)። “ቀኝ እጅ” የሚለውን አውጥተን “እጅዎን” እንበል?',
   'موضع الألم: الحديث «ضع يدك» (مسلم ٢٢٠٢). هل نحذف «اليمنى» ونقول «يدك»؟'),
  ('ሐዲሱ ቁጥር ያላስቀመጠባቸው (ፋቲሓ 3፣ ቁ. 9–11 ×3)፦ “የሚመከር 3 — የተወሰነ ቁጥር የለም” ብለን እንጻፍ?',
   'ما لم يرد فيه عدد (الفاتحة ٣، والأرقام ٩–١١ ×٣): هل نكتب «المقترح ٣ — ولا عدد محدد»؟'),
  ('የጅብሪልን ሩቅያ ለራስ “አርቂ ነፍሲ … የሽፊኒ” ብሎ መቀየር ይፈቀዳል?',
   'هل يجوز تحويل رقية جبريل للنفس: «أرقي نفسي… يشفيني»؟'),
  ('ክፍል ሐ (ቁ. 15–23) በሩቅያ ማንበብ ይፈቀዳል? “የመምህራን ልምድ — የተለየ ሐዲስ የለም” ብሎ መለየቱ ትክክል ነው?',
   'هل تجوز الرقية بالقسم ج (١٥–٢٣)؟ وهل وصفه بـ«تجربة الرقاة، ولا حديث خاص» صحيح؟'),
  ('ነፍስ፦ በትንሽ ምራቅ በቀስታ እፍ ማለት፣ ከዚያ ራስን፣ ፊትንና የሰውነትን ፊት ለፊት ማበስ። ትክክል ነው?',
   'النفث: نفخ خفيف مع يسير من الريق، ثم مسح الرأس والوجه وما أقبل من الجسد. هل هذا صحيح؟'),
  ('ውሃና ዘይት (ቁ. 25)፦ አንብቦ እፍ ማለት፣ ከውሃው መጠጣትና በቀሪው መታጠብ ይፈቀዳል? ልዩ መስፈርት አለ?',
   'الماء والزيت (٢٥): القراءة والنفث، والشرب والاغتسال بالباقي — جائز؟ وهل من شروط؟'),
  ('የወር አበባ ላይ ያለች ሴት ቁርኣንን (ከቃል ወይም ከስልክ) አንብባ ራሷን ሩቅያ ማድረግ ትችላለች?',
   'هل للحائض أن ترقي نفسها بالقرآن (حفظًا أو من الهاتف)؟'),
]

LETTER_AM = open('/home/claude/review/letter_am.txt').read().strip()
LETTER_AR = open('/home/claude/review/letter_ar.txt').read().strip()

def para(t, cls=''):
    return ''.join(f'<p class="{cls}" style="margin:0 0 2mm">{e(l)}</p>' if l.strip() else '' for l in t.split('\n'))

rows, n = [], 0
for r in ROWS:
    if r[1] is None:
        rows.append(f'<tr><th colspan="6" style="background:#e4eff5">{e(r[0])}</th></tr>'); continue
    n += 1
    what, am, cnt, src, lab = r
    rows.append(f'<tr style="break-inside:avoid"><td style="width:7mm;font-weight:900;color:#2f84b8">{n}</td><td>{what}<div style="font-size:8.5pt;color:#4d6878">{e(am)} {lab}</div></td>'
                f'<td style="width:14mm;text-align:center;font-weight:800">{e(cnt)}</td><td style="width:34mm;font-size:8pt">{e(src)}</td>'
                f'<td style="width:9mm;text-align:center"><span class="box"></span>✓</td><td style="width:9mm;text-align:center"><span class="box"></span>✗</td></tr>')

dec = ''.join(f'<div class="qrow"><span class="qn">{chr(0x0041 + i)}</span><div>{e(a)}<div class="ar">{e(b)}</div>'
              f'<div class="check"><span><span class="box"></span>እስማማለሁ · أوافق</span><span><span class="box"></span>አልስማማም · لا أوافق</span></div><div class="lines"></div></div></div>'
              for i, (a, b) in enumerate(DECISIONS))

body = f"""
<section><h2>ደብዳቤ · رسالة</h2><div style="font-size:10.5pt">{para(LETTER_AM)}</div><hr style="border:0;border-top:1px solid #cfe1ec;margin:4mm 0">
<div class="ar" style="font-size:11.5pt">{para(LETTER_AR, 'ar')}</div></section>
<section class="part"><h2>1 · በመተግበሪያው ያለው ሁሉ · كل ما في التطبيق</h2>
<p style="font-size:9pt">በእያንዳንዱ ቁጥር ✓ ወይም ✗ ብቻ ያድርጉ። · ضع ✓ أو ✗ عند كل رقم. &nbsp; ✅ ከሱና · من السنة &nbsp; 🟡 የመምህራን ልምድ · تجربة الرقاة</p>
<p style="font-size:8.5pt;color:#4d6878">የቁርኣን ጽሑፍ ከንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ) የተወሰደ ነው። · نص القرآن من مجمع الملك فهد (حفص).</p>
<table>{''.join(rows)}</table></section>
<section class="part"><h2>2 · ውሳኔ የሚያስፈልጋቸው 8 ጥያቄዎች · ثمانية أسئلة تحتاج إلى حكم</h2>
<p style="font-size:9pt">ሐሳባችንን ጽፈናል፤ “እስማማለሁ” ወይም ማስተካከያዎን ብቻ ይጻፉ። · كتبنا اقتراحنا؛ يكفي «أوافق» أو التصحيح.</p>{dec}
<table style="margin-top:3mm"><tr><td style="height:9mm;width:40%">ስም · الاسم</td><td></td></tr><tr><td style="height:9mm">ቀን · التاريخ</td><td></td></tr>
<tr><td>ስሜ በመተግበሪያው ይጠቀስ · يُذكر اسمي في التطبيق</td><td><span class="box"></span> አዎ · نعم &nbsp; <span class="box"></span> አይ · لا</td></tr></table></section>"""
css = CSS.replace('Scholar review pack', 'Quick check') + '.qrow{padding:1.6mm 0} .qrow .lines{height:5mm} .qrow .check{margin-top:1mm}'
open('/home/claude/review/short.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
print('ok', n, 'items')
