import type { Lang } from '../lib/dates';
import type { Label } from './types';
import { ARTICLES_MORE } from './articles-more';

export interface Article {
  id: string;
  label: Label;
  title: Record<Lang, string>;
  body: Record<Lang, string[]>;
  sources: string[];
  links?: { title: string; url: string }[];
}

export const ARTICLES: Article[] = [
  {
    id: 'selfBest',
    label: 'sunnah',
    title: { en: 'You are the best one to do your ruqyah', am: 'ሩቅያዎን ለማድረግ ምርጡ እርስዎ ነዎት', ar: 'أنت خير من يرقيك' },
    body: {
      en: [
        'Ruqyah on yourself is a Sunnah: the Prophet ﷺ recited ruqyah on himself, and so did his Companions.',
        'The Standing Committee: asking others for ruqyah is allowed, but doing it yourself and not asking people is better.',
        'Ibn ʿUthaymīn: reciting on yourself does not weaken your trust in Allah.',
        'You do not need a shaykh or a qārī to start. It takes about five minutes.',
      ],
      am: [
        'ራስን ሩቅያ ማድረግ ሱና ነው፤ ነቢዩ ﷺ ራሳቸውን ሩቅያ ያደርጉ ነበር፤ ሶሐቦቻቸውም እንዲሁ።',
        'የቋሚ ፈትዋ ኮሚቴ፦ ሌላ ሰው ሩቅያ እንዲያደርግልዎ መጠየቅ ይፈቀዳል፤ ነገር ግን ሰዎችን ሳይጠይቁ ራስዎ ማድረጉ የተሻለ ነው።',
        'ኢብኑ ዑሠይሚን፦ ራስን ማንበብ በአላህ ላይ ያለዎትን መመካት አያጎድልም።',
        'ለመጀመር ሸይኽ ወይም ቃሪእ አያስፈልግዎትም። አምስት ደቂቃ ያህል ይወስዳል።',
      ],
      ar: [
        'رقية المرء نفسه سنة؛ فقد رقى النبي ﷺ نفسه، ورقى بعض أصحابه أنفسهم.',
        'اللجنة الدائمة: طلب الرقية من الغير جائز، لكن تركه ورقية المرء نفسه أفضل.',
        'ابن عثيمين: قراءة الإنسان على نفسه لا تنافي التوكل.',
        'لا تحتاج إلى شيخ أو قارئ لتبدأ؛ الأمر نحو خمس دقائق.',
      ],
    },
    sources: ['IslamQA 3476', 'Fatāwā al-Lajnah ad-Dāʾimah 24/261', 'Bukhari 5017, 5751'],
  },
  {
    id: 'conditions',
    label: 'sunnah',
    title: { en: 'The 3 conditions of ruqyah', am: 'የሩቅያ 3 መስፈርቶች', ar: 'شروط الرقية الثلاثة' },
    body: {
      en: [
        'Ibn Ḥajar reported that the scholars agree ruqyah is allowed when three conditions are met:',
        'It is with the words of Allah, or His names and attributes.',
        'Its meaning is understood, in Arabic or another language.',
        'You believe the ruqyah has no power of its own: it works only by Allah’s will.',
        'Avoid amulets (taʿwīdh), unknown words and anyone who asks for your mother’s name or gives strange instructions.',
      ],
      am: [
        'ኢብኑ ሐጀር ዑለማዎች ሩቅያ በሦስት መስፈርቶች እንደሚፈቀድ መስማማታቸውን ዘግበዋል፦',
        'በአላህ ቃል፣ ወይም በስሞቹና በባሕርያቱ መሆን።',
        'ትርጉሙ የሚታወቅ መሆን፤ በዐረብኛም ሆነ በሌላ ቋንቋ።',
        'ሩቅያው በራሱ ኃይል እንደሌለው፣ በአላህ ፈቃድ ብቻ እንደሚሰራ ማመን።',
        'ክታብን (ተዕዊዝ)፣ የማይታወቁ ቃላትንና የእናትዎን ስም የሚጠይቅ ወይም እንግዳ ትእዛዝ የሚሰጥን ሰው ይራቁ።',
      ],
      ar: [
        'نقل ابن حجر إجماع العلماء على جواز الرقية عند اجتماع ثلاثة شروط:',
        'أن تكون بكلام الله أو بأسمائه وصفاته.',
        'أن يُفهم معناها، بالعربية أو بغيرها.',
        'أن يُعتقد أن الرقية لا تؤثر بذاتها، بل بتقدير الله.',
        'اجتنب التمائم والألفاظ المجهولة ومن يسأل عن اسم أمك أو يأمرك بأمور غريبة.',
      ],
    },
    sources: ['Ibn Ḥajar, Fatḥ al-Bārī', 'Muslim 2200'],
  },
  {
    id: 'listening',
    label: 'support',
    title: { en: 'Listening or reciting?', am: 'ማዳመጥ ወይስ ማንበብ?', ar: 'الاستماع أم القراءة؟' },
    body: {
      en: [
        'Listening to the Quran is rewarding and brings calm.',
        'But scholars explain that listening to a recording is not ruqyah by itself: ruqyah is reciting over yourself or the sick person.',
        'Use the audio in this app to learn the pronunciation, then recite with your own voice.',
      ],
      am: [
        'ቁርኣንን ማዳመጥ ምንዳ አለው፤ መረጋጋትንም ያመጣል።',
        'ነገር ግን ዑለማዎች የተቀዳ ድምጽ ማዳመጥ በራሱ ሩቅያ እንዳልሆነ ያብራራሉ፤ ሩቅያ በራስ ወይም በታማሚው ላይ ማንበብ ነው።',
        'በዚህ መተግበሪያ ያለውን ድምጽ አነባበቡን ለመማር ይጠቀሙ፤ ከዚያ በራስዎ ድምጽ ያንብቡ።',
      ],
      ar: [
        'الاستماع إلى القرآن فيه أجر وسكينة.',
        'لكن العلماء يبيّنون أن الاستماع إلى التسجيل ليس رقية بذاته؛ فالرقية قراءة على النفس أو على المريض.',
        'استعمل الصوت في التطبيق لتتعلّم النطق، ثم اقرأ بصوتك.',
      ],
    },
    sources: ['IslamWeb fatwa 346387'],
  },
  ...ARTICLES_MORE,
];
