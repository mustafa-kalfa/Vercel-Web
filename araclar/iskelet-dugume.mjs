/* ISKELETTEN DUGUME. `takrib-iskelet.py`nin ciktisini alip N()
   satirinin alanlarini uretir: ad, ceviri-yazi, kimlik.

   CEVIREMEDIGINI ISARETLIYOR, UYDURMUYOR. Bilinmeyen bir belirtec
   «...» icinde birakiliyor ve o kayit "kirli" dosyasina dusuyor; elle
   yazilmadan haritaya girmiyor. Yanlis bir Turkce ad ekranda oyle
   durur ve kimse fark etmez -- eksik ad ise gorunur.

   Ceviri-yazi sozlugu `ceviri-sozluk.mjs` ile haritanin KENDI
   dugumlerinden cikariliyor; sitenin yazim gelenegi zaten orada.

   Kullanim (my-app icinden):
     node araclar/ceviri-sozluk.mjs <sozluk.json>
     node araclar/iskelet-dugume.mjs <iskelet.json> <sozluk.json> <cikti-onek> [belde]
*/
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const [, , iskeletYol, sozlukYol, onek, beldeSuz] = process.argv;
if (!iskeletYol || !sozlukYol || !onek) {
  console.error("kullanim: iskelet-dugume.mjs <iskelet.json> <sozluk.json> <cikti-onek> [belde]");
  process.exit(1);
}
const V = await import(pathToFileURL("app/silsileVeri.js").href);
const isk = JSON.parse(readFileSync(iskeletYol, "utf8"));
const SOZ = JSON.parse(readFileSync(sozlukYol, "utf8"));

/* --- 0. SOZVARLIGI ---------------------------------------------------
   Haritadaki adlarda gecen her belirtec. Ad bolgesini KARA LISTEYLE
   degil BUNUNLA kesiyoruz -- bkz. asagisi. */
const BILINEN = new Set();
for (const n of V.NODES) {
  for (const w of n.ar.replace(/[ً-ْٰـ]/g, "").split(/\s+/)) BILINEN.add(w);
}
for (const w of Object.keys(SOZ)) for (const p of w.split(/\s+/)) BILINEN.add(p);

/* --- 1. AD BOLGESI ---------------------------------------------------
   ONCE KARA LISTEYLE KESILIYORDU VE TUTMADI. Takrib adin ortasina
   zapt aciklamasi sokuyor («رقبة بقاف وموحدة مفتوحتين ابن مصقلة») ve
   bu aciklamalarin sozvarligi acik uclu: بقاف، بموحدة، بمثناة، بنون،
   بغير إضافة، باسم الطائر، اسم أبيه، قيل اسمه... Hepsini saymak
   mumkun degil, birini kacirmak ise adin icine cop sokuyor.

   YENI OLCUT BEYAZ LISTE: bir belirtec ancak su uc seyden biriyse
   adin parcasi sayiliyor --
     1. nesep/kunye baglaci (بن، ابن، أبو، أبي، أم، بنت),
     2. nisbe kalibi (ال...ي),
     3. haritanin sozvarliginda gecen bir ad.
   Ilk uymayan belirtecte ad bitiyor. Kisa kesmek guvenli yon: kenar
   tarayicisi kaydi dugum adinin KISALTILMISI sayiyor, yani kisa ad
   daha AZ eslesir. Uzun ve copluk bir ad ise MIKNATIS oluyor. */
const BAGLAC = new Set(["بن", "ابن", "أبو", "أبي", "أبا", "أم", "بنت"]);
const NISBE_KALIBI = /^ال.+ي$/;
const PARANTEZ = /\[[^\]]*\]/g;

/* `(\s|$)` sondaki boslugu YUTUYOR ve ardisik «ابن X ابن Y» dizisinde
   ikinci, dorduncu... gecisler eslesmiyordu. Nesep kirpmasi bu yuzden
   hic devreye girmedi ve 39 dereceli bir miknatis dugum uretti.
   Ileriye bakis (`(?=...)`) boslugu tuketmiyor. */
const IBN = /(^|\s)ابن(?=\s|$)/g;

function adBolgesi(ham) {
  const tok = ham.replace(PARANTEZ, " ").replace(IBN, "$1بن")
    .replace(/\s+/g, " ").trim().split(" ");
  const out = [];
  for (const w0 of tok) {
    const w = w0.replace(/[ً-ْٰـ]/g, "");
    if (!w) continue;
    if (BAGLAC.has(w) || NISBE_KALIBI.test(w) || BILINEN.has(w)) out.push(w);
    else break;
  }
  /* Baglacla bitmis ad yarim kalmis demektir, kuyrugu atiyoruz. */
  while (out.length && BAGLAC.has(out[out.length - 1])) out.pop();

  /* NESEP ZINCIRI IKI «بن» ILE SINIRLI. Harita etiketi kisa olmali ve
     uzun zincir kenar tarayicisinda miknatis yapiyor. Kunya ve nisbe
     kirpmanin disinda, onlar ayirt ediciligi tasiyan parca. */
  const kunyaDan = out.findIndex((w) => w === "أبو" || w === "أبي" || w === "أبا");
  const govde = kunyaDan > 0 ? out.slice(0, kunyaDan) : out;
  const kuyruk = kunyaDan > 0 ? out.slice(kunyaDan) : [];
  let kirp = govde, n = 0;
  for (let i = 0; i < govde.length; i++) {
    if (govde[i] === "بن" && ++n > 2) { kirp = govde.slice(0, i); break; }
  }
  return [...kirp, ...kuyruk].join(" ").trim();
}

/* --- 2. CEVIRI-YAZI -------------------------------------------------- */
const OZEL = { "بن": "b.", "أبو": "Ebû", "أبي": "Ebî", "أبا": "Ebâ",
               "بنت": "bint", "أم": "Ümmü" };
function cevir(ar) {
  /* Sozluk bilesik adi («عبد X») tek birim ogrendi, cevirici de oyle
     okumali -- yoksa Abdurrahman "Abd (Rabîatü'r-re'y)" cikiyor. */
  const ham = ar.split(/\s+/);
  const tok = [];
  for (let i = 0; i < ham.length; i++) {
    if (ham[i] === "عبد" && i + 1 < ham.length) tok.push(ham[i] + " " + ham[++i]);
    else tok.push(ham[i]);
  }
  const out = [], eksik = [];
  for (const t of tok) {
    if (OZEL[t]) { out.push(OZEL[t]); continue; }
    if (SOZ[t]) { out.push(SOZ[t]); continue; }
    /* Bilinmeyen NISBE uydurulmuyor, ATILIYOR: "el-" + kaba harf
       cevrimi yanlis Turkce yazar ve ekranda oyle durur. Ad kisa
       kalsin, yanlis olmasin. */
    if (NISBE_KALIBI.test(t)) continue;
    out.push("«" + t + "»");
    eksik.push(t);
  }
  return { tr: out.join(" ").replace(/\s+/g, " ").trim(), eksik };
}

/* --- 3. KIMLIK ------------------------------------------------------- */
const kullanilan = new Set(V.NODES.map((n) => n.id));
function slug(tr) {
  const s = tr.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/ı/g, "i").replace(/İ/g, "i").replace(/ş/gi, "s")
    .replace(/ğ/gi, "g").replace(/ç/gi, "c").replace(/ö/gi, "o")
    .replace(/ü/gi, "u").toLowerCase().replace(/[^a-z0-9]/g, "");
  return s.slice(0, 22) || "ravi";
}

const secilen = beldeSuz ? isk.filter((x) => x.belde === beldeSuz) : isk;
const temiz = [], kirli = [];
for (const x of secilen) {
  const ar = adBolgesi(x.ham);
  if (!ar || ar.split(" ").length < 2) { kirli.push({ no: x.no, ar, sebep: "ad cok kisa" }); continue; }
  const { tr, eksik } = cevir(ar);
  let id = slug(tr), i = 2;
  while (kullanilan.has(id)) id = slug(tr) + i++;
  kullanilan.add(id);
  const kayit = { id, ar, tr, tab: x.tab, olum: x.olum, belde: x.belde, no: x.no, eksik };
  (eksik.length ? kirli : temiz).push(kayit);
}
writeFileSync(onek + "-temiz.json", JSON.stringify(temiz, null, 1), "utf8");
writeFileSync(onek + "-kirli.json", JSON.stringify(kirli, null, 1), "utf8");
console.log("kayit        :", secilen.length);
console.log("tam cevrilen :", temiz.length);
console.log("elde kalan   :", kirli.length);
const uz = [...temiz, ...kirli].filter((k) => k.ar).map((k) => k.ar.split(" ").length);
uz.sort((a, b) => b - a);
console.log("ad belirteci : en uzun", uz.slice(0, 5).join(","), "| ortalama",
            (uz.reduce((a, b) => a + b, 0) / uz.length).toFixed(1));
console.log("\n-- tam cevrilenlerden ornek --");
for (const k of temiz.slice(0, 10)) {
  console.log("  " + String(k.olum).padStart(3), k.tr, " | ", k.ar);
}
