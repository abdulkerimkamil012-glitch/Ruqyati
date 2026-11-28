import json, html, sys, re, io, contextlib
sys.path.insert(0, '/home/claude/review')
with contextlib.redirect_stdout(io.StringIO()):
    from build import CSS
e = html.escape
D = json.load(open('/home/claude/review/data.json'))
DU = D['DUAS']
C = '/home/claude/ruqyati/.cache-quran'
AR = {(v['sora'], v['aya_no']): v for v in json.load(open(f'{C}/ar.json'))}
strip = lambda s: re.sub(r'[ \s]*[٠-٩]+\s*$', '', s)

S, X = '✅ ከሱና', '🟡 የመምህራን ልምድ'
# (kind, ref, amharic title, count, source, label)
GROUPS = [
 ('ዋናው የሱና ሩቅያ (በመተግበሪያው ቅደም ተከተል)', [
  ('d', 'istiadha', 'ኢስቲዓዛ', '1', 'Quran 16:98', S),
  ('q', (1, 1, 7), 'አል-ፋቲሓ', '1 / 3 / 7', 'al-Bukhārī 5749 · Muslim 2201', S),
  ('q', (2, 255, 255), 'አየተል ኩርሲይ', '1', 'al-Bukhārī 2311', S),
  ('q', (2, 285, 286), 'የአል-በቀራ መጨረሻ', '1', 'al-Bukhārī 5009 · Muslim 807', S),
  ('q', (112, 1, 4), 'አል-ኢኽላስ', '3', 'al-Bukhārī 5017, 5751', S),
  ('q', (113, 1, 5), 'አል-ፈለቅ', '3', 'al-Bukhārī 5017, 5751', S),
  ('q', (114, 1, 6), 'አን-ናስ', '3', 'al-Bukhārī 5017, 5751', S),
  ('t', 'በመዳፎች ላይ በቀስታ እፍ ብሎ (በትንሽ ምራቅ) ራስን፣ ፊትንና የሰውነትን ፊት ለፊት ማበስ።', 'እፍ ብሎ ማበስ (ነፍስ)', '—', 'al-Bukhārī 5017', S),
  ('d', 'bismillah3', 'እጅ በሚያመው ቦታ ላይ', '3', 'Muslim 2202', S),
  ('d', 'painRefuge', 'የህመም ዱዓ', '7', 'Muslim 2202', S),
  ('d', 'kalimat', 'የአላህ ፍጹም ቃላት', '3', 'Muslim 2708', S),
  ('d', 'adhhib', 'አዝሂቢል በእስ', '3', 'al-Bukhārī 5743 · Muslim 2191', S),
  ('d', 'jibrilSelf', 'የጅብሪል ሩቅያ (ለራስ በሚሆን ቃል)', '3', 'Muslim 2186', S),
 ]),
 ('ለልጅ ወይም ለትዳር አጋር', [
  ('t', 'ቀኝ እጅን በልጁ ወይም በትዳር አጋሩ ራስ ላይ አድርጎ ማንበብ። መሕረም ካልሆነ እሱ/እሷ የራሱን/የራሷን እጅ ያደርጋል።', 'እጅ በራስ ላይ', '—', 'Muslim 2198', S),
  ('d', 'jibrilOther', 'የጅብሪል ሩቅያ', '3', 'Muslim 2186', S),
  ('d', 'asalu', 'አስአሉላሀል ዐዚም', '7', 'Abū Dāwūd 3106 · at-Tirmidhī 2083', S),
 ]),
 ('የተራዘመ የዕለት ሩቅያ (ከመምህራን ልምድ — የተለየ ሐዲስ የለውም)', [
  ('q', (1, 1, 7), 'አል-ፋቲሓ', '7', '—', X),
  ('q', (2, 284, 286), 'አል-በቀራ', '1', 'al-Bukhārī 5009 (285–286)', X),
  ('q', (3, 1, 5), 'አሊ ዒምራን (መጀመሪያ)', '1', '—', X),
  ('q', (3, 190, 200), 'አሊ ዒምራን (መጨረሻ)', '1', '—', X),
  ('q', (37, 1, 10), 'አስ-ሷፍፋት', '1', '—', X),
  ('q', (72, 1, 28), 'ሱረቱል ጂን', '1', '—', X),
  ('q', (59, 21, 24), 'አል-ሐሽር (መጨረሻ)', '1', '—', X),
  ('q', (68, 51, 52), 'አል-ቀለም (መጨረሻ)', '1', '—', X),
  ('q', (18, 39, 39), 'አል-ከህፍ', '7', '—', X),
 ]),
 ('ሌሎች', [
  ('d', 'mashaAllah', 'ከዓይን ጥበቃ', '—', 'Ibn Mājah 3509 · Quran 18:39', S),
  ('t', 'ንጹህ ውሃ (ዘምዘም ቢሆን) ወደ አፍ አቅርቦ የሱና ሩቅያውን ማንበብና በቀስታ እፍ ማለት፤ ከዚያ ከውሃው መጠጣትና በቀሪው መታጠብ። በወይራ ዘይትም ላይ አንብቦ ሰውነትን መቀባት።', 'የሩቅያ ውሃና የወይራ ዘይት', '—', 'የሰለፎች ተግባር፤ የተለየ ሶሒሕ ሐዲስ የለም', X),
 ]),
]

QUESTIONS = [
 ('ስለ መተግበሪያው ይዘት', [
  'ከላይ ያሉት ምንጮች (የሐዲስ ቁጥሮችና ደረጃዎቻቸው) ትክክል ናቸው?',
  'ሦስቱ ቁልዎች፦ በሐዲሱ (ቡኻሪ 5017) ሦስቱም ተነበው እፍ ተብሎ ይታበሳል፤ ይህ ሙሉው 3 ጊዜ ይደገማል። እኛ ግን እያንዳንዱን ሱራ 3 ጊዜ አንብበን አንድ ጊዜ እናብሳለን። ትክክለኛው የትኛው ነው?',
  'እጅ በሚያመው ቦታ፦ ሐዲሱ (ሙስሊም 2202) “እጅህን” ይላል፤ እኛ “ቀኝ እጅ” ብለናል። ይስተካከል?',
  'ሐዲሱ ቁጥር ያላስቀመጠባቸው (ፋቲሓ 3/7፣ አንዳንድ ዱዓዎች ×3)፦ ቁጥር መጠቆም ይፈቀዳል ወይስ “የተወሰነ ቁጥር የለም” እንበል?',
  'የጅብሪልን ሩቅያ ለራስ “አርቂ ነፍሲ … የሽፊኒ” ብሎ መቀየር ይፈቀዳል? ለሴት “አርቂኪ … የሽፊኪ” ማለት ትክክል ነው?',
  'የተራዘመው ዝርዝር (አሊ ዒምራን፣ አስ-ሷፍፋት፣ አል-ጂን፣ አል-ሐሽር፣ አል-ቀለም፣ አል-ከህፍ 39) በሩቅያ ማንበብ ይፈቀዳል? “ከመምህራን ልምድ” ብሎ መለየቱ ትክክል ነው?',
  'ነፍስ (እፍ ማለት)፦ ከማንበብ በፊት፣ በመሃል ወይስ በኋላ? በምን ያህል ምራቅ? የማበሻው ቅደም ተከተል ምንድን ነው?',
 ]),
 ('ስለ ሩቅያ ውሃ', [
  'ትፍ ትፍ (ነፍስ) በውሃ ላይ መቼ ነው፦ ከእያንዳንዱ ሱራ በኋላ፣ ከእያንዳንዱ ድግግሞሽ በኋላ ወይስ መጨረሻ ላይ አንድ ጊዜ? ስንት ጊዜ?',
  'ከውሃው ምን ያህል ይጠጣል? መታጠብ ያስፈልጋል? ለስንት ቀን? ውሃውን ማስቀመጥና መደበኛ ውሃ መጨመር ይቻላል? የታጠበበት ውሃ ወደ መጸዳጃ ቤት ቢፈስ ችግር አለው?',
  'አንድ ሰው ለቤተሰቡ (ለሚስቱ፣ ለሴት ልጆቹ፣ ለእህቶቹ) ውሃ አንብቦ መስጠት ይችላል? የወይራ ዘይት እንዴት ይጠቀማል?',
 ]),
 ('ጎልቶ የወጣ ችግር ለሌለበት ሰው (ሲሕርም ዓይነ-ናስም ላልሆነ)', [
  'ከቁርኣን ዊርድና ከጠዋትና ማታ አዝካር በተጨማሪ በየቀኑ ራስን ለመጠበቅ ሩቅያ ማድረግ ይመከራል? ከሆነ የትኞቹን፣ ስንት ጊዜና መቼ?',
  'ለጥበቃ ብቻ በየቀኑ የሩቅያ ውሃ መጠጣት ይፈቀዳል? ዘወትር ልማድ ማድረጉ ቢድዓ ይሆናል?',
  'ለጭንቀትና ምክንያቱ ለማይታወቅ ነገር ምን ይመክራሉ? ጭንቀቱ ከበረታ ከሩቅያ ጋር ሐኪም ወይም አማካሪ ማየት ይመከራል?',
  'በተለይ በሴቶች የሚታይ ሁኔታ፦ “በቂ አይደለሁም” ማለት፤ “በአስተሳሰብ የሚመጥነኝ ሰው አላገኝም” ማለት፤ “የማይሆን ሰው አግብቼ ሕይወቴ ይበላሻል” ብሎ መፍራት፤ ትዳርን መሸሽ፣ አለመፈለግ ወይም በጣም ማዘግየት። ይህ ከሲሕር ወይም ከዓይን ነው ወይስ የተለመደ ፍርሃት? ወደ ወስዋስ ሳንገባ እንዴት እንለያለን? ሱና ምን ይመክራል?',
  'ካገቡ በኋላ ልጅ መውለድ አለመፈለግ፦ ምን ምክር ይሰጣሉ?',
 ]),
 ('የእርስዎ ምክር', [
  'ለዕለት ጥበቃ፣ ለጭንቀት፣ ለትዳር ፍርሃት፣ ጥሩ የትዳር አጋር ለማግኘት፣ በባልና ሚስት መካከል ፍቅር እንዲኖርና ልጅ ለመፈለግ የሚመክሩኝን ዱዓዎችና አንቀጾች (ስንት ጊዜና መቼ እንደሚባሉ) በድምጽ ቢነግሩኝ።',
  'የሚመክሩት የሩቅያ ድምጽ (ቃሪእ ወይም ቅጂ) አለ? በቤት ውስጥ የሩቅያ ድምጽ መክፈት ይፈቀዳል? የወር አበባ ላይ ያለች ሴት ከስልክ አንብባ ራሷን ሩቅያ ማድረግ ትችላለች?',
  'እነዚህን በመተግበሪያው ውስጥ ማስገባት ትክክል ነው? ስምዎ እንደ ገምጋሚ እንዲጠቀስ ይፈቅዳሉ?',
 ]),
]

def item(n, it):
    kind, ref, title, cnt, src, lab = it
    if kind == 'q':
        s, a, b = ref
        rng = f'{s}:{a}' + (f'–{b}' if b != a else '')
        basm = f'<div class="quran" style="font-size:12.5pt;color:#6b8494">{e(strip(AR[(1, 1)]["aya_text"]))}</div>' if a == 1 and s not in (1, 9) else ''
        body = basm + '<div class="quran" style="font-size:15.5pt">' + ' '.join(e(AR[(s, x)]['aya_text']) for x in range(a, b + 1)) + '</div>'
        head = f'{e(title)} · <bdi dir="ltr">{rng}</bdi>'
    elif kind == 'd':
        d = DU[ref]
        body = f'<div class="duaar" style="font-size:14.5pt">{e(d["ar"])}</div><div class="mean"><b>ትርጉም፦</b> {e(d["am"])}</div>'
        head = e(title)
    else:
        body = f'<div class="mean">{e(ref)}</div>'
        head = e(title)
    cls = 'l-s' if lab == S else 'l-e'
    return (f'<div class="card" style="padding:3mm 4.5mm;margin-bottom:3.5mm"><div class="top"><span class="num">{n}</span><span class="title" style="font-size:11pt">{head}</span>'
            f'<span class="chip {cls}">{lab}</span><span class="chip count">×{e(cnt)}</span></div>{body}'
            f'<div class="ev" style="margin-bottom:0"><b>ምንጭ፦</b> {e(src)}</div></div>')

letter = open('/home/claude/review/letter3_am.txt').read().strip()
para = ''.join(f'<p style="margin:0 0 2.2mm">{e(l)}</p>' for l in letter.split('\n') if l.strip())
out = [f'<section><h2>ደብዳቤ</h2><div style="font-size:11pt;line-height:1.6">{para}</div></section>']
out.append('<section class="part"><h2>በመተግበሪያው ውስጥ ያለው ሁሉ</h2><p style="font-size:9pt;color:#4d6878">የቁርኣን ጽሑፍ ከንጉሥ ፋህድ የቅዱስ ቁርኣን ማተሚያ ማዕከል (ሐፍስ) በቀጥታ የተወሰደ ነው።</p>')
n = 0
for gt, items in GROUPS:
    out.append(f'<h2 style="font-size:12.5pt;margin-top:3mm">{e(gt)}</h2>')
    for it in items:
        n += 1
        out.append(item(n, it))
out.append('</section>')
qn = 0
qhtml = []
for gt, qs in QUESTIONS:
    qhtml.append(f'<h2 style="font-size:12.5pt;margin-top:3mm">{e(gt)}</h2>')
    for q in qs:
        qn += 1
        qhtml.append(f'<div class="qrow"><span class="qn">{qn}</span><div style="font-size:10.5pt">{e(q)}</div></div>')
out.append('<section class="part"><h2>ጥያቄዎች 🎙️</h2><p style="font-size:10pt">በድምጽ መልዕክት የጥያቄውን ቁጥር ብቻ ጠቅሰው ቢመልሱልኝ በቂ ነው (ለምሳሌ፦ “ጥያቄ 8፦ …”)። ጀዛኩሙላሁ ኸይረን።</p>' + ''.join(qhtml) + '</section>')
css = CSS.replace('Ruqyati · ሩቅያቲ · رقيتي — Scholar review pack', 'ሩቅያቲ — ለተከበሩ ኡስታዝ') + '.qrow{padding:2.2mm 0}'
open('/home/claude/review/voice.html', 'w').write(f'<!doctype html><html lang="am"><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(out)}</body></html>')
print('ok', n, 'items', qn, 'questions')
