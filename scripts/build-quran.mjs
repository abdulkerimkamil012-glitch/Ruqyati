// Builds src/content/quran.json from verified sources. Never edit the output by hand.
// Arabic: King Fahd Glorious Quran Printing Complex, Hafs v18 Unicode data (matches font hafs18).
// Amharic: Muhammed Sadiq & Muhammed Sani Habib. English: Saheeh International. Translit: Tanzil.
import { createHash } from 'node:crypto';
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'node:fs';

const SRC = {
  ar: 'https://raw.githubusercontent.com/thetruetruth/quran-data-kfgqpc/main/hafs/data/hafsData_v18.json',
  am: 'https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/amh-muhammedsadiqan.json',
  en: 'https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/eng-ummmuhammad.json',
  tr: 'https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/ara-quran-la.json',
};

// id: [surah, from, to]
export const PASSAGES = {
  fatiha: [1, 1, 7], kursi: [2, 255, 255], baqarahEnd2: [2, 285, 286], baqarahEnd3: [2, 284, 286],
  ikhlas: [112, 1, 4], falaq: [113, 1, 5], nas: [114, 1, 6],
  imranStart: [3, 1, 5], imranEnd: [3, 190, 200], saffat: [37, 1, 10], jinn: [72, 1, 28],
  hashrEnd: [59, 21, 24], qalamEnd: [68, 51, 52], kahf39: [18, 39, 39], basmala: [1, 1, 1],
  // Added from the two sources the owner sent (أطباء الحرمين PDF, Al Bayan article), sifted. Never 2:20.
  baqarahStart: [2, 1, 5], baqarah163: [2, 163, 164], baqarah102: [2, 102, 102], araf54: [7, 54, 54],
  araf117: [7, 117, 122], yunus79: [10, 79, 82], taha65: [20, 65, 69], muminun115: [23, 115, 118],
  isra82: [17, 82, 82], mulk3: [67, 3, 4], jinn3: [72, 3, 3], imran190: [3, 190, 191], kafirun: [109, 1, 6],
};

const cacheDir = '.cache-quran';
async function load(key) {
  const file = `${cacheDir}/${key}.json`;
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const res = await fetch(SRC[key]);
  if (!res.ok) throw new Error(`${key}: HTTP ${res.status}`);
  const json = await res.json();
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(file, JSON.stringify(json));
  return json;
}

const [ar, am, en, tr] = await Promise.all(['ar', 'am', 'en', 'tr'].map(load));
const arMap = new Map(ar.map((v) => [`${v.sora}:${v.aya_no}`, v]));
const toMap = (ed) => new Map(ed.quran.map((v) => [`${v.chapter}:${v.verse}`, v.text]));
const amMap = toMap(am), enMap = toMap(en), trMap = toMap(tr);

const out = { meta: { sources: SRC, generated: new Date().toISOString().slice(0, 10) }, passages: {} };
const hash = createHash('sha256');
for (const [id, [s, from, to]] of Object.entries(PASSAGES)) {
  const ayahs = [];
  for (let a = from; a <= to; a++) {
    const k = `${s}:${a}`;
    const src = arMap.get(k);
    if (!src || !amMap.get(k) || !enMap.get(k) || !trMap.get(k)) throw new Error(`missing ${k}`);
    hash.update(`${k}|${src.aya_text}\n`);
    ayahs.push({ s, a, ar: src.aya_text, am: amMap.get(k), en: enMap.get(k), tr: trMap.get(k).replaceAll('AA', 'ʿ') });
  }
  out.passages[id] = { surah: s, nameAr: arMap.get(`${s}:${from}`).sora_name_ar, nameEn: arMap.get(`${s}:${from}`).sora_name_en, from, to, ayahs };
}
out.meta.arabicSha256 = hash.digest('hex');
writeFileSync('src/content/quran.json', JSON.stringify(out, null, 1));
console.log('quran.json written', Object.keys(out.passages).length, 'passages', out.meta.arabicSha256.slice(0, 12));
