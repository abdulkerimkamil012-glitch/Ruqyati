# Pack 2 (v2): only items that already exist in the Ruqyati app. Answers & suggestions by voice message.
import sys, json
sys.path.insert(0, '/home/claude/review')
from protect_content import SECTIONS as OLD, WATER_STEPS, QUESTIONS as OLDQ
DU = json.load(open('/home/claude/review/data.json'))['DUAS']

keep_refs = {(112, 1, 4), (113, 1, 5), (114, 1, 6), (2, 255, 255), (2, 285, 286)}
old_daily = [it for it in OLD[0][1] if (it['k'] == 'q' and it['ref'] in keep_refs) or (it['k'] == 'd' and ('كَلِمَاتِ' in it['ar'] or 'يَنْفُثُ' in it['ar']))]

def app_dua(did, when, n, src):
    d = DU[did]
    return dict(k='d', ar=d['ar'], am=d['am'], when=when, n=n, src=src)

SECTIONS = [
 ('ሀ · ጠዋትና ማታ (በመተግበሪያው ያሉ) · أ · صباحًا ومساءً (مما في التطبيق)', old_daily[:3] + [old_daily[3]]),
 ('ለ · የመተግበሪያው የሱና ሩቅያ — ለዕለት ጥበቃ ይበቃል? · ب · رقية التطبيق — هل تصلح للتحصين اليومي؟', [
   dict(k='q', ref=(1, 1, 7), when='❓ ጠዋት/ማታ? · صباحًا/مساءً؟', n='1 / 3 / 7', src='al-Bukhārī 5749 · Muslim 2201 (Abū Saʿīd al-Khudrī)'),
   old_daily[4], old_daily[5],
   app_dua('adhhib', '❓ መቼ? · متى؟', '3 (?)', 'al-Bukhārī 5743 · Muslim 2191 (said over the sick)'),
   app_dua('jibrilSelf', '❓ መቼ? · متى؟', '3 (?)', 'Muslim 2186 (worded for yourself)'),
   old_daily[6],
 ]),
]

drop = {7, 8, 13}  # anxiety-dua list, Ahmad 3712, istikhara: not in the app
QUESTIONS = [q for i, q in enumerate(OLDQ, 1) if i not in drop]
QUESTIONS.insert(6, ('ለጭንቀት፣ ለሐዘንና ለፍርሃት የሚመክሩትን ዱዓዎችና አንቀጾች (ስንት ጊዜ፣ መቼ፣ ምንጭ) በድምጽ መልዕክት ቢነግሩኝ።',
                     'أرجو أن تذكروا لي برسالة صوتية الأدعية والآيات للهمّ والحزن والقلق (العدد، الوقت، المصدر).'))
QUESTIONS.append(('ከመተግበሪያው በተጨማሪ መግባት ያለባቸውን ዱዓዎችና አንቀጾች (ስንት ጊዜ፣ መቼ፣ ምንጭ) በድምጽ መልዕክት ቢጠቁሙኝ።',
                  'أرجو أن تقترحوا برسالة صوتية أدعية وآيات أخرى تُضاف إلى التطبيق (العدد، الوقت، المصدر).'))

WATER_STEPS = [(a.replace('ጥያቄ 18', 'ጥያቄ 16'), b.replace('السؤال ١٨', 'السؤال ١٦')) for a, b in WATER_STEPS]
