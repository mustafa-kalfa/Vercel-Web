/* ISKELETTEN DUGUME. `takrib-iskelet.py`nin ciktisini alip N()
   satirinin alanlarini uretir: ad, ceviri-yazi, kimlik.

   CEVIREMEDIGINI ISARETLIYOR, UYDURMUYOR. Bilinmeyen bir belirtec
   «...» icinde birakiliyor ve o kayit "kirli" dosyasina dusuyor; elle
   yazilmadan haritaya girmiyor. Yanlis bir Turkce ad ekranda oyle
   durur ve kimse fark etmez -- eksik ad ise gorunur.

   Ceviri-yazi sozlugu `ceviri-sozluk.mjs` ile haritanin KENDI 821
   dugumunden cikariliyor; sitenin yazim gelenegi zaten orada.

   Kullanim (my-app icinden):
     node araclar/ceviri-sozluk.mjs          # sozlugu tazele
     node araclar/iskelet-dugume.mjs         # iskeletten dugum uret */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const S = "C:/Users/MUSTAF~1/AppData/Local/Temp/claude/C--Users-Mustafa-Kalfa-Desktop-Vercel-Web/8eb4f327-3b9a-40af-b36e-888c4f9ac8e5/scratchpad";
const V = await import(pathToFileURL("app/silsileVeri.js").href);
const isk = JSON.parse(readFileSync(S + "/iskelet.json", "utf8"));
const SOZ = JSON.parse(readFileSync(S + "/ceviri-sozluk.json", "utf8"));

/* --- 1. AD BOLGESI --------------------------------------------------
   Takrib satirinin adi; hukum, tabaka, rumuz ve muhakkik ekleri disari.
   Zapt aciklamasi («بفتح المهملة...») da adin parcasi degil. */
const PARANTEZ = /\[[^\]]*\]/g;
const KES = new RegExp(
  "\\s(?:" + [
    "ثقة", "صدوق", "ضعيف", "مقبول", "لين", "متروك", "مجهول", "صحابي",
    "وثقه", "مخضرم", "لا بأس", "له صحبة", "مستور", "متهم", "كذاب", "واه",
    "منكر", "فيه ضعف", "فيه لين", "اختلف", "روى له", "من كبار", "من صغار",
    "من أوساط", "من الأولى", "من الثانية", "من الثالثة", "من الرابعة",
    "من الخامسة", "من السادسة", "من السابعة", "من الثامنة", "من التاسعة",
    "من العاشرة", "من الحادية", "نزيل", "مولاهم", "ويقال", "يقال", "وهو",
    "سبط", "يعرف", "لقبه", "بكنيته", "مشهور", "نزل", "وقيل", "أو ",
    "بفتح", "بضم", "بكسر", "بسكون", "مصغر", "مكبر", "بالتحتانية",
    "بالمهملة", "بالمعجمة", "بالموحدة", "بالنون", "بالجيم", "بالمثلثة",
    "بمعجمة", "بمهملة", "بمعجمتين", "بمهملتين", "بالضم", "بالفتح",
    "بالكسر", "بتشديد", "مفتوحة", "معجمة", "ومهملة", "بنون", "ثم",
  ].join("|") + ")"
);

function adBolgesi(ham) {
  let t = ham.replace(PARANTEZ, " ").replace(/\s+/g, " ");
  const m = t.match(KES);
  if (m) t = t.slice(0, m.index);
  t = t.replace(/(^|\s)ابن(\s|$)/g, "$1بن$2");
  let tok = t.trim().split(/\s+/).filter(Boolean);
  /* Cok uzun nesep zinciri kirpiliyor: harita etiketi kisa olmali,
     ayirt etmeye ilk uc ad ogesi yetiyor. Kunya ve nisbe korunuyor. */
  const kunyaDan = tok.findIndex((w) => w === "أبو" || w === "أبي");
  const gövde = kunyaDan > 0 ? tok.slice(0, kunyaDan) : tok;
  const kuyruk = kunyaDan > 0 ? tok.slice(kunyaDan) : [];
  let kirp = gövde;
  const binSayi = gövde.filter((w) => w === "بن").length;
  if (binSayi > 2) {
    let n = 0, i = 0;
    for (; i < gövde.length; i++) { if (gövde[i] === "بن" && ++n > 2) break; }
    kirp = gövde.slice(0, i);
  }
  return [...kirp, ...kuyruk].join(" ");
}

/* --- 2. CEVIRI-YAZI ------------------------------------------------ */
const OZEL = { "بن": "b.", "أبو": "Ebû", "أبي": "Ebî", "بنت": "bint", "أم": "Ümmü" };
/* NISBE, sozlukte yoksa UYDURULMUYOR, ATILIYOR. Bilinmeyen bir
   nisbe icin "el-" + kaba harf cevrimi uretmek yanlis Turkce yazar
   ve ekranda oyle durur; adin kisa kalmasi yeglenir. Kufe nisbesi
   zaten sutunun kendisi -- 208 kaydin 95'inde geciyor ve hicbirine
   bilgi katmiyor. */
const NISBE_KALIBI = /^ال.+ي$/;
function cevir(ar) {
  /* Sozluk bilesik adi tek birim ogrendi, cevirici de oyle okumali
     -- yoksa Abdurrahman "Abd (Rabiatu'r-re'y)" cikiyor. */
  const ham = ar.split(/\s+/);
  const tok = [];
  for (let i = 0; i < ham.length; i++) {
    if (ham[i] === "عبد" && i + 1 < ham.length) tok.push(ham[i] + " " + ham[++i]);
    else tok.push(ham[i]);
  }
  const out = [], eksik = [], atilan = [];
  for (const t of tok) {
    const d = t.replace(/[\u064B-\u0652\u0670\u0640]/g, "");
    if (OZEL[d]) { out.push(OZEL[d]); continue; }
    if (SOZ[d]) { out.push(SOZ[d]); continue; }
    if (NISBE_KALIBI.test(d)) { atilan.push(d); continue; }
    out.push("«" + d + "»");
    eksik.push(d);
  }
  return { tr: out.join(" ").replace(/\s+/g, " ").trim(), eksik, atilan };
}

/* --- 3. KIMLIK ------------------------------------------------------ */
const mevcut = new Set(V.NODES.map((n) => n.id));
function slug(tr) {
  const s = tr.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i").replace(/İ/g, "i").replace(/ş/gi, "s")
    .replace(/ğ/gi, "g").replace(/ç/gi, "c").replace(/ö/gi, "o")
    .replace(/ü/gi, "u").toLowerCase().replace(/[^a-z0-9]/g, "");
  return s.slice(0, 24) || "ravi";
}

const kufe = isk.filter((x) => x.belde === "Kûfe");
const kullanilan = new Set(mevcut);
let eksikToplam = 0;
const temiz = [], kirli = [];
for (const x of kufe) {
  const ar = adBolgesi(x.ham);
  const { tr, eksik } = cevir(ar);
  let id = slug(tr), i = 2;
  while (kullanilan.has(id)) id = slug(tr) + i++;
  kullanilan.add(id);
  const kayit = { id, ar, tr, tab: x.tab, olum: x.olum, belde: x.belde,
                  no: x.no, eksik };
  if (eksik.length) { kirli.push(kayit); eksikToplam += eksik.length; }
  else temiz.push(kayit);
}
writeFileSync(S + "/kufe-temiz.json", JSON.stringify(temiz, null, 1), "utf8");
writeFileSync(S + "/kufe-kirli.json", JSON.stringify(kirli, null, 1), "utf8");
console.log("Kufe kaydi :", kufe.length);
console.log("tam cevrilen:", temiz.length);
console.log("eksik kalan :", kirli.length, "(" + eksikToplam + " belirtec)");
const sik = new Map();
for (const k of kirli) for (const e of k.eksik) sik.set(e, (sik.get(e) || 0) + 1);
console.log("benzersiz bilinmeyen:", sik.size);
console.log("\n-- en sik bilinmeyen --");
console.log([...sik.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30)
  .map(([t, n]) => n + "x " + t).join("   "));
console.log("\n-- tam cevrilenlerden ornek --");
for (const k of temiz.slice(0, 12)) console.log("  " + String(k.olum).padStart(3), k.id.padEnd(24), k.tr, " | ", k.ar);
