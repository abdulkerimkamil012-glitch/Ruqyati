import json, html, sys
sys.path.insert(0, '/home/claude/review')
from build import CSS  # same fonts & look
e = html.escape
D = json.load(open('/home/claude/review/data.json')); DU = D['DUAS']

# (question am, question ar, our proposal am, our proposal ar)
DECISIONS = [
 ('ሦስቱ ቁልዎች (ኢኽላስ፣ ፈለቅ፣ ናስ)', 'المعوذات الثلاث',
  'ሦስቱንም አንብቦ → በመዳፍ እፍ ብሎ → ማበስ፤ ይህን ሙሉ 3 ጊዜ መድገም (ቡኻሪ 5017)', 'يقرأ الثلاث ثم ينفث ويمسح، ويكرر ذلك ثلاثًا (البخاري ٥٠١٧)'),
 ('በሚያም ቦታ ላይ እጅ', 'وضع اليد على موضع الألم',
  'ሐዲሱ እንደሚለው “እጅዎን” ብቻ (“ቀኝ” ሳይል) (ሙስሊም 2202)', '«ضع يدك» كما في الحديث، دون تقييد باليمنى (مسلم ٢٢٠٢)'),
 ('ሐዲስ ቁጥር ያልገለጸባቸው (ፋቲሓ፣ አዝሂብ፣ ጅብሪል፣ ከሊማት)', 'ما لم يحدَّد عدده في الحديث (الفاتحة، أذهب البأس، رقية جبريل، الكلمات التامات)',
  '“የተወሰነ ቁጥር የለም፤ 1፣ 3 ወይም 7 መምረጥ ይቻላል” ብለን እንጽፋለን', 'نكتب: «لا عدد محدد، ويمكن اختيار ١ أو ٣ أو ٧»'),
 ('የጅብሪልን ሩቅያ ለራስ ማድረግ', 'رقية جبريل للنفس',
  '“በስሚላሂ አርቂ ነፍሲ … አላሁ የሽፊኒ” ማለት ይፈቀዳል (ሙስሊም 2186)', 'يجوز: «بسم الله أرقي نفسي… الله يشفيني» (مسلم ٢١٨٦)'),
 ('“አስአሉላህ አል-ዐዚም … አን የሽፊየክ” ×7', '«أسأل الله العظيم… أن يشفيك» ×٧',
  'ለሌላ ሰው ሩቅያ ብቻ (ታማሚ ሲጎበኙ) እናስቀምጠዋለን', 'نجعله في رقية الغير فقط (عند عيادة المريض)'),
 ('አየተል ኩርሲይና የበቀራ መጨረሻ (የመኝታ ጊዜ ፋዲላ ያላቸው)', 'آية الكرسي وخواتيم البقرة (فضلهما عند النوم)',
  'በቀን ሩቅያም ውስጥ እናነባቸዋለን፤ ፋዲላቸውን “በመኝታ ጊዜ” ብለን በትክክል እንጽፋለን', 'نقرؤهما في الرقية في أي وقت، ونذكر فضلهما مقيدًا بعند النوم'),
 ('ረዘም ያለው ዝርዝር (አል-ዒምራን፣ ሷፍፋት፣ ጂን፣ ሐሽር፣ ቀለም፣ ከህፍ 18:39)', 'القائمة الموسعة (آل عمران، الصافات، الجن، الحشر، القلم، الكهف ١٨:٣٩)',
  'ይፈቀዳል፤ ግን 🟡 “የመምህራን ልምድ እንጂ ሐዲስ አይደለም” በሚል ምልክት ብቻ', 'جائزة، مع علامة 🟡 «من تجربة الرقاة وليس فيها حديث خاص»'),
 ('የሩቅያ ውሃ', 'ماء الرقية',
  'ውሃውን ወደ አፍ አቅርቦ ማንበብ፣ በቀስታ እፍ ማለት፣ ከፊሉን መጠጣትና በቀሪው መታጠብ', 'يقرأ قريبًا من الماء وينفث نفثًا خفيفًا، ثم يشرب منه ويغتسل بالباقي'),
 ('የወይራ ዘይት', 'زيت الزيتون',
  'በላዩ አንብቦ በሚያም ቦታና በሰውነት መቀባት', 'يقرأ عليه ويدهن به موضع الألم والبدن'),
 ('የወር አበባ ላይ ያለች ሴት', 'الحائض',
  'ዱዓዎቹን ማድረግ ትችላለች፤ ቁርኣኑን በተመለከተ የእርስዎን ፈትዋ እንጽፋለን፦ ሀ) ትችላለች  ለ) ዱዓ ብቻ', 'لها الأدعية؛ وفي قراءة القرآن نكتب فتواكم: أ) يجوز  ب) الأدعية فقط'),
 ('ድምጽ ማዳመጥ', 'الاستماع للتسجيل',
  '“ማዳመጥ በራሱ ሩቅያ አይደለም፤ ለመማር ብቻ፤ ራስዎ ያንብቡ” ብለን እንጽፋለን', 'نكتب: «الاستماع ليس رقية بذاته، هو للتعلم، فاقرأ بنفسك»'),
 ('ስምዎን በመተግበሪያው ውስጥ', 'ذكر اسمكم في التطبيق',
  'እንደ ገምጋሚ ስምዎ እንዲጠቀስ', 'يُذكر اسمكم مراجعًا'),
]

DUA_ROWS = [('istiadha', '1'), ('bismillah3', '3'), ('painRefuge', '7'), ('kalimat', '3?'), ('adhhib', '?'),
            ('jibrilSelf', '?'), ('jibrilOther', '?'), ('asalu', '7'), ('mashaAllah', '—')]

rows = ''.join(f'''<tr><td class="qn" style="text-align:center">{i}</td>
<td><b>{e(qa)}</b><div class="ar" style="font-size:9.5pt">{e(qr)}</div></td>
<td style="background:#f3f8fb">{e(pa)}<div class="ar" style="font-size:9.5pt">{e(pr)}</div></td>
<td style="white-space:nowrap;font-size:8.5pt"><span class="box"></span>እስማማለሁ · موافق<br><span class="box"></span>ይቀየር · يُعدَّل</td></tr>''' for i, (qa, qr, pa, pr) in enumerate(DECISIONS, 1))

duas = ''.join(f'''<tr><td class="qn" style="text-align:center">{chr(0x0623) if False else i}</td>
<td><div class="duaar" style="font-size:12.5pt;text-align:right;line-height:1.7">{e(DU[k]["ar"])}</div><div style="font-size:8.5pt">{e(DU[k]["am"])}</div></td>
<td style="text-align:center;font-weight:800" dir="ltr">{"×" + c if c != "—" else "—"}</td><td style="font-size:8.5pt">{e(DU[k]["source"])}</td>
<td style="white-space:nowrap;font-size:9pt"><span class="box"></span>✓<br><span class="box"></span>✗</td></tr>''' for i, (k, c) in enumerate(DUA_ROWS, 1))

body = f'''
<section>
<div style="display:flex;justify-content:space-between;align-items:end">
<div><div class="quran" style="font-size:24pt;color:#2f84b8;text-align:start">رُقْيَتِي</div><h1 style="font-size:16pt;margin:0">ሩቅያቲ · የ12 ውሳኔዎች ማረጋገጫ · ورقة القرارات</h1></div>
<div style="font-size:9pt;text-align:end">⏱ ~10 ደቂቃ · دقائق</div></div>
<table style="margin:3mm 0"><tr><td style="background:#dcebe1;font-size:9pt">✅ <b>መፈተሽ የማያስፈልገው · لا يحتاج إلى مراجعة:</b> የቁርኣን ጽሑፍ ከንጉሥ ፋህድ ማተሚያ ማዕከል (ሐፍስ v18) በቀጥታ የተወሰደ ነው፤ የአማርኛ ትርጉሙ የሙሐመድ ሳዲቅና የሙሐመድ ሳኒ ሐቢብ ነው።
<div class="ar">نص القرآن مأخوذ مباشرة من مجمع الملك فهد، وترجمة المعاني الأمهرية لمحمد صادق ومحمد ثاني حبيب.</div></td></tr>
<tr><td style="background:#fff8e8;font-size:9pt">✍️ <b>መልስ ለመስጠት · طريقة الإجابة:</b> በእያንዳንዱ ረድፍ “እስማማለሁ” ወይም “ይቀየር” ምልክት ያድርጉ፤ ወይም በቴሌግራም በድምጽ “1 እስማማለሁ፣ 2 …” ብለው ይላኩ።
<div class="ar">ضعوا علامة «موافق» أو «يُعدَّل»، أو أرسلوا رسالة صوتية: «١ موافق، ٢ …».</div></td></tr></table>
<table><tr><th style="width:7mm">№</th><th>ጉዳዩ · المسألة</th><th>የእኛ ሀሳብ · اقتراحنا</th><th style="width:33mm">ውሳኔ · القرار</th></tr>{rows}</table>
</section>
<section style="margin-top:5mm">
<h2>ዱዓዎቹ · الأدعية — ጽሑፍ፣ ቁጥርና ምንጭ · النص والعدد والمصدر</h2>
<p style="font-size:9pt">“?” = ሐዲሱ ቁጥር አልገለጸም (ውሳኔ 3 ይመልከቱ) · «?» = لم يحدد الحديث عددًا (انظر القرار ٣)</p>
<table><tr><th style="width:7mm">№</th><th>ዱዓ · الدعاء</th><th style="width:12mm">ቁጥር<br>العدد</th><th style="width:30mm">ምንጭ · المصدر</th><th style="width:12mm">✓/✗</th></tr>{duas}</table>
<table style="margin-top:3mm"><tr><td style="height:16mm;vertical-align:top">ማስታወሻ · ملاحظات:</td></tr></table>
<table style="margin-top:3mm"><tr><td style="width:50%;height:12mm">ስም · الاسم:</td><td>ፊርማና ቀን · التوقيع والتاريخ:</td></tr></table>
<p style="font-size:8pt;color:#6b8494;margin-top:2mm">ዝርዝር ማስረጃ ቢያስፈልግዎ ሙሉው ሰነድ (50 ገጽ) አለ። · إن احتجتم التفاصيل فالملف الكامل (٥٠ صفحة) متاح.</p>
</section>'''

css = CSS.replace('Scholar review pack', 'Quick check') + 'td,th{padding:1.2mm 1.8mm} body{font-size:9.3pt;line-height:1.35}'
open('/home/claude/review/quick.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{body}</body></html>')
print('ok')
