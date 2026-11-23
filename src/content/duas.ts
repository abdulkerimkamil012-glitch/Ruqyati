// 🔴 RED file: every change needs scholar review (CLAUDE.md).
// Arabic wording follows the hadith collections cited in `source`.
import type { Label } from './types';

export interface Dua {
  id: string;
  ar: string;
  tr: string; // Latin transliteration
  en: string;
  am: string;
  source: string;
  label: Label;
  adapted?: boolean; // wording turned to first person for self-ruqyah
}

export const DUAS: Record<string, Dua> = {
  istiadha: {
    id: 'istiadha',
    ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
    tr: 'Aʿūdhu billāhi mina sh-shayṭāni r-rajīm',
    en: 'I seek refuge with Allah from Satan, the accursed.',
    am: 'ከተረገመው ሰይጣን በአላህ እጠበቃለሁ።',
    source: 'Quran 16:98',
    label: 'sunnah',
  },
  bismillah3: {
    id: 'bismillah3',
    ar: 'بِسْمِ اللَّهِ',
    tr: 'Bismillāh',
    en: 'In the name of Allah. (Hand on the place of pain.)',
    am: 'በአላህ ስም። (እጅዎን በሚያምዎት ቦታ ላይ ያድርጉ።)',
    source: 'Muslim 2202',
    label: 'sunnah',
  },
  painRefuge: {
    id: 'painRefuge',
    ar: 'أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ',
    tr: 'Aʿūdhu billāhi wa qudratihi min sharri mā ajidu wa uḥādhir',
    en: 'I seek refuge with Allah and His power from the evil of what I feel and what I fear.',
    am: 'ከሚሰማኝና ከምፈራው ነገር ክፋት በአላህና በችሎታው እጠበቃለሁ።',
    source: 'Muslim 2202',
    label: 'sunnah',
  },
  kalimat: {
    id: 'kalimat',
    ar: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
    tr: 'Aʿūdhu bi-kalimāti llāhi t-tāmmāti min sharri mā khalaq',
    en: 'I seek refuge in the perfect words of Allah from the evil of what He has created.',
    am: 'ከፈጠረው ነገር ክፋት በአላህ ፍጹም ቃላት እጠበቃለሁ።',
    source: 'Muslim 2708, 2709',
    label: 'sunnah',
  },
  adhhib: {
    id: 'adhhib',
    ar: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا',
    tr: 'Allāhumma rabba n-nās, adhhibi l-baʾs, ishfi anta sh-shāfī, lā shifāʾa illā shifāʾuk, shifāʾan lā yughādiru saqamā',
    en: 'O Allah, Lord of mankind, remove the harm. Heal, You are the Healer. There is no healing but Yours, a healing that leaves no illness.',
    am: 'አላህ ሆይ! የሰዎች ጌታ ሆይ! ጉዳቱን አስወግድ። ፈውስ፤ አንተ ፈዋሽ ነህ። ካንተ ፈውስ በቀር ፈውስ የለም። በሽታን የማያስቀር ፈውስ።',
    source: 'Bukhari 5743 · Muslim 2191',
    label: 'sunnah',
  },
  jibrilSelf: {
    id: 'jibrilSelf',
    ar: 'بِسْمِ اللَّهِ أَرْقِي نَفْسِي، مِنْ كُلِّ شَيْءٍ يُؤْذِينِي، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِينِي',
    tr: 'Bismillāhi arqī nafsī, min kulli shayʾin yuʾdhīnī, min sharri kulli nafsin aw ʿayni ḥāsid, Allāhu yashfīnī',
    en: 'In the name of Allah I do ruqyah on myself, from everything that harms me, from the evil of every soul or envious eye. Allah heals me.',
    am: 'በአላህ ስም ራሴን ሩቅያ አደርጋለሁ፤ ከሚጎዳኝ ነገር ሁሉ፣ ከማንኛውም ነፍስ ወይም ከምቀኛ ዓይን ክፋት። አላህ ይፈውሰኛል።',
    source: 'Muslim 2186 (worded for yourself)',
    label: 'sunnah',
    adapted: true,
  },
  jibrilOther: {
    id: 'jibrilOther',
    ar: 'بِاسْمِ اللَّهِ أَرْقِيكَ، مِنْ كُلِّ شَيْءٍ يُؤْذِيكَ، مِنْ شَرِّ كُلِّ نَفْسٍ أَوْ عَيْنِ حَاسِدٍ، اللَّهُ يَشْفِيكَ، بِاسْمِ اللَّهِ أَرْقِيكَ',
    tr: 'Bismillāhi arqīk, min kulli shayʾin yuʾdhīk, min sharri kulli nafsin aw ʿayni ḥāsid, Allāhu yashfīk, bismillāhi arqīk',
    en: 'In the name of Allah I do ruqyah on you, from everything that harms you, from the evil of every soul or envious eye. May Allah heal you. In the name of Allah I do ruqyah on you.',
    am: 'በአላህ ስም ሩቅያ አደርግልሃለሁ፤ ከሚጎዳህ ነገር ሁሉ፣ ከማንኛውም ነፍስ ወይም ከምቀኛ ዓይን ክፋት። አላህ ይፈውስህ። በአላህ ስም ሩቅያ አደርግልሃለሁ።',
    source: 'Muslim 2186',
    label: 'sunnah',
  },
  asalu: {
    id: 'asalu',
    ar: 'أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ',
    tr: 'Asʾalu llāha l-ʿaẓīm, rabba l-ʿarshi l-ʿaẓīm, an yashfiyak',
    en: 'I ask Allah the Mighty, Lord of the Mighty Throne, to heal you.',
    am: 'ታላቁን አላህ፣ የታላቁን ዐርሽ ጌታ፣ እንዲፈውስህ እለምናለሁ።',
    source: 'Abu Dawud 3106 · Tirmidhi 2083',
    label: 'sunnah',
  },
  mashaAllah: {
    id: 'mashaAllah',
    ar: 'مَا شَاءَ اللَّهُ، بَارَكَ اللَّهُ',
    tr: 'Mā shāʾa llāh, bāraka llāh',
    en: 'What Allah wills. May Allah bless it. (Say it when you admire something, yours or someone else’s.)',
    am: 'አላህ የሻው ሆነ። አላህ ይባርከው። (የሚያስደንቅ ነገር ሲያዩ ይበሉ።)',
    source: 'Ibn Majah 3509 · Quran 18:39',
    label: 'sunnah',
  },
};
