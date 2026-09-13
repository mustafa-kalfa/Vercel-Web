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
/* ELLE YAZILMIS EK. Sozluk haritadan ogreniyor ama yalnizca Turkcesi
   KISALTILMAMIS kayitlardan hizalayabiliyor; haritada gecip de Turkcesi
   atilmis belirtecler ogrenilemiyor. Ek, ogrenilenin UZERINE yaziliyor --
   icinde iki hizalama duzeltmesi de var. */
{
  const ek = JSON.parse(readFileSync("araclar/ceviri-elle.json", "utf8"));
  for (const [k, v] of Object.entries(ek)) if (!k.startsWith("_")) SOZ[k] = v;
}

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
/* TEOFOR ADIN ILK YARISI. «عبد الرحيم»، «عبيد الله» tek bir addir. Ikinci
   oge haritanin sozvarliginda yoksa beyaz liste tam orada kesiyordu ve ad
   «محمد بن عبد» diye yarim kaliyordu -- yani adin ORTASINDAN. */
const TEOFOR = new Set(["عبد", "عبيد"]);
/* ...AMA IKINCI OGE HER SEY OLAMAZ. «عبيد» cogu yerde BASLI BASINA bir ad
   (Ubeyd b. Huneyn, Yûnus b. Ubeyd); yalnizca «عبيد الله» bilesiktir.
   Kosulsuz gecirmek denendi ve «عبيد الخزاعي»، «عبيد بن»، hatta Takrib'in
   zapt serhi «عبيد بالتصغير» ada yapisti -- on kayit bozuldu. Nisbe kalibini
   elemek de yetmiyor, cunku «عبد الغني»، «عبد الباقي»، «عبد الهادي» de o
   kaliba uyuyor. Olcut, ikinci ogenin ESMA-I HUSNA'dan olmasi. */
const ESMA = new Set(["الله", "الرحمن", "الرحيم", "الملك", "القدوس", "السلام",
  "المؤمن", "المهيمن", "العزيز", "الجبار", "المتكبر", "الخالق", "البارئ",
  "المصور", "الغفار", "القهار", "الوهاب", "الرزاق", "الفتاح", "العليم",
  "القابض", "الباسط", "الخافض", "الرافع", "المعز", "المذل", "السميع",
  "البصير", "الحكم", "العدل", "اللطيف", "الخبير", "الحليم", "العظيم",
  "الغفور", "الشكور", "العلي", "الكبير", "الحفيظ", "المقيت", "الحسيب",
  "الجليل", "الكريم", "الرقيب", "المجيب", "الواسع", "الحكيم", "الودود",
  "المجيد", "الباعث", "الشهيد", "الحق", "الوكيل", "القوي", "المتين",
  "الولي", "الحميد", "المحصي", "المبدئ", "المعيد", "المحيي", "المميت",
  "الحي", "القيوم", "الواجد", "الماجد", "الواحد", "الأحد", "الصمد",
  "القادر", "المقتدر", "المقدم", "المؤخر", "الأول", "الآخر", "الظاهر",
  "الباطن", "الوالي", "المتعالي", "البر", "التواب", "المنتقم", "العفو",
  "الرؤوف", "المقسط", "الجامع", "الغني", "المغني", "المانع", "الضار",
  "النافع", "النور", "الهادي", "البديع", "الباقي", "الوارث", "الرشيد",
  "الصبور", "الأعلى", "الحكيم", "ربه", "رب", "خير"]);
const teoforCift = (a, b) => TEOFOR.has(a) && b !== undefined && ESMA.has(b);
/* ADI BITIREN ISARETLER. Hepsi Takrib'in ILISKI kaydi, ad degil --
   «المعروف بـ» (diye bilinen), «مولى» (azatlisi), «صاحب» (yakini),
   «أخو» (kardesi), «نزيل» (yerlesigi). Beyaz listeden geciyorlar cunku
   haritanin sozvarliginda da varlar; burada adi kesiyoruz. Kesmezsek
   etiketin kuyruguna «mevlâ Rebîa b. el-Hâris» gibi ikinci bir ad
   takiliyor ve harita etiketi iki katina cikiyor. */
const DURAK = new Set(["المعروف", "المعروف،", "مولى", "مولاهم", "مولاه",
                       "صاحب", "أخو", "أخي", "نزيل", "والد", "ابن أخي"]);

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
    if (DURAK.has(w)) break;
    if (teoforCift(out[out.length - 1], w)) { out.push(w); continue; }
    if (BAGLAC.has(w) || NISBE_KALIBI.test(w) || BILINEN.has(w)) out.push(w);
    else break;
  }
  /* Baglacla -- ya da teofor adin yarisiyla -- bitmis ad yarim kalmis
     demektir, kuyrugu atiyoruz. */
  while (out.length && (BAGLAC.has(out[out.length - 1]) || out[out.length - 1] === "عبد")) out.pop();

  /* NESEP ZINCIRI IKI «بن» ILE SINIRLI. Harita etiketi kisa olmali ve
     uzun zincir kenar tarayicisinda miknatis yapiyor. Kunya ve nisbe
     kirpmanin disinda, onlar ayirt ediciligi tasiyan parca. */
  /* KUNYA, «بن»DEN SONRA GELEN «أبي» DEGILDIR. «أحمد بن أبي بكر بن الحارث...»
     adinda ikinci belirtec kunya sanildi, govde «أحمد بن»de bitti ve nesep
     kirpmasi hic calismadi -- uzunlugu asagidaki sinira birakilan adlar bu
     yuzden 111 harfe kadar cikiyordu. Kunya, onunde «بن» OLMAYAN olandir. */
  const kunyaDan = out.findIndex((w, i) =>
    (w === "أبو" || w === "أبي" || w === "أبا") && out[i - 1] !== "بن");
  const govde = kunyaDan > 0 ? out.slice(0, kunyaDan) : out;
  const kuyruk = kunyaDan > 0 ? out.slice(kunyaDan) : [];
  let kirp = govde, n = 0;
  for (let i = 0; i < govde.length; i++) {
    if (govde[i] === "بن" && ++n > 2) { kirp = govde.slice(0, i); break; }
  }
  /* NISBE YIGILMASI. Haritanin KENDI etiketlerinde en cok iki nisbe var
     («Ebû Hâmid Ahmed b. Ca‘fer el-Eş‘arî el-Isfahânî»); Takrib ise uc dort
     tanesini birden siraliyor. Ilk ikisi -- kabile nisbesi ve ardindan geleni
     -- ayirt ediciligi tasiyor, gerisi beldeyi tekrarliyor ve belde zaten
     dugumun kendi alani. */
  const son = [];
  let nisbe = 0;
  for (const w of [...kirp, ...kuyruk]) {
    if (NISBE_KALIBI.test(w) && ++nisbe > 2) continue;
    son.push(w);
  }
  while (son.length && (BAGLAC.has(son[son.length - 1]) || son[son.length - 1] === "عبد")) son.pop();
  return son.join(" ").trim();
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
    if (teoforCift(ham[i], ham[i + 1])) tok.push(ham[i] + " " + ham[++i]);
    else tok.push(ham[i]);
  }
  const out = [], eksik = [];
  for (const t of tok) {
    if (OZEL[t]) { out.push(OZEL[t]); continue; }
    if (SOZ[t]) { out.push(SOZ[t]); continue; }
    /* Bilinmeyen NISBE uydurulmuyor, ATILIYOR: "el-" + kaba harf
       cevrimi yanlis Turkce yazar ve ekranda oyle durur. Ad kisa
       kalsin, yanlis olmasin.

       AMA BASTAKI NISBE KALIBI NISBE DEGIL, ISIMDIR. «الماضي بن محمد بن
       مسعود» kaydinda el-Mâdî kisinin KENDI adi; kalibi tuttugu ve
       sozlukte bulunmadigi icin atiliyordu ve etiket «b. Muhammed b.
       Mes‘ûd» diye BABASININ adiyla basliyordu. Atmak yerine isaretliyoruz,
       kayit "kirli"ye dusup elle yazilmayi bekliyor. */
    if (NISBE_KALIBI.test(t) && out.length) continue;
    out.push("«" + t + "»");
    eksik.push(t);
  }
  /* Bilinmeyen nisbe ATILDIGI icin onundeki baglac bosta kaliyordu:
     «محمد بن إسماعيل بن البختري» -> "Muhammed b. İsmâîl b." Sondaki
     baglaci suruyoruz. */
  const BAGLAC_TR = /^(b\.|Ebû|Ebî|Ebâ|bint|Ümmü)$/;
  while (out.length && BAGLAC_TR.test(out[out.length - 1])) out.pop();
  /* BASTAKI baglac da bosta kalabiliyor: «الماضي بن محمد» adinda el-Mâdî
     nisbe kalibina (ال...ي) uydugu ve sozlukte bulunmadigi icin atiliyor,
     geriye «b. Muhammed b. Mes‘ûd» kaliyor -- kisinin KENDI adi dusmus,
     etiket babasinin adiyla basliyor. */
  /* ...ama BASTAN yalniz «b.» suprulur, kunya DEGIL: «أبو العباس القلوري»
     kaydinda bastaki «Ebû»yu da atmak «Ebû Abbâs»i «Abbâs»a indiriyordu. */
  while (out.length && out[0] === "b.") out.shift();
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
  /* EN AZ IKI AD OGESI. «عبد الرحمن» iki KELIME ama tek AD -- kelime
     sayarak elemek onu geciriyordu ve kirpma artigi olan ciplak
     «Abdurrahman» dugumleri haritaya sizip yirmi kenarlik bir miknatis
     oluyordu. Bilesik ad tek oge sayiliyor. */
  const oge = ar ? ar.split(" ").filter((w, i, a2) => w !== "عبد" && !(i > 0 && a2[i - 1] === "عبد")).length
                   + (ar.split(" ").filter((w) => w === "عبد").length) : 0;
  if (!ar || oge < 2) { kirli.push({ no: x.no, ar, sebep: "ad cok kisa" }); continue; }
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
