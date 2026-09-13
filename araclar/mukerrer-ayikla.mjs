/* MUKERRER DENETIMI. Takrib'den cikan bir kayit haritada ZATEN varsa
   ikinci bir nokta acilmamali -- mukerrer dugum kenarlari da ikiye
   boler, yani yanlisi eksikten beter.

   UC SURUM DENENDI, ILK IKISI SIZDIRDI.

   1. ALTDIZI. Iki adin belirtecleri sirali altdizi mi diye bakiyordu
      ve ilk belirtecin tutmasini istiyordu. Iki sey kacti:
        - Haritadaki adlarin bir kismi KUNYA-ONCE yazili
          («أبو كريب محمد بن العلاء»), Takrib ise AD-ONCE veriyor
          («محمد بن العلاء بن كريب»). Ilk belirtec hic tutmadi.
        - Harf-i tarif farki: «الحجاج بن أرطاة» ile «حجاج بن أرطاة».
      Ebu Kureyb, Ebu Usame ve Haccac b. Ertat bu yuzden "yeni" sayildi.

   2. KUME. Belirtec kumesi biri otekini kapsiyor mu diye bakti; sira
      bilgisi kayboldu ve TERS adlar birlesti: «جعفر بن محمد», dedesi
      Ca'fer olan «محمد بن عباد بن جعفر»in altkumesi cikiyor. Buna
      karsi "iki belirteclik cekirdek ancak birebir esitse delil"
      kurali kondu, ama bu sefer de MESRU eslesmeleri kesti --
      «أبو أسامة حماد بن أسامة» ile «حماد بن أسامة القرشي» ayri sayildi.

   3. SIRALI (su anki). Once KUNYA BLOGU atiliyor (bastaki «أبو X»),
      harf-i tarif soyuluyor, baglaclar dusuruluyor; sonra kucuk dizi
      buyugun SIRALI altdizisi mi diye bakiliyor. Kunya atilinca
      «أبو أسامة حماد بن أسامة» → حماد، أسامة oluyor ve yeni kayitla
      ayni siraya giriyor; Ca'fer ornegi ise ters sirada kaldigi icin
      ayri kaliyor.

   Yanlis BIRLESTIRMENIN bedeli dusuk (o kaydi eklemeyiz), yanlis
   AYIRMANIN bedeli yuksek (haritada iki nokta, bolunmus kenarlar).

   Kullanim (my-app icinden):
     node araclar/mukerrer-ayikla.mjs <temiz.json> <kirli.json> <cikti.json> */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const [, , temizYol, kirliYol, ciktiYol] = process.argv;
if (!temizYol || !kirliYol || !ciktiYol) {
  console.error("kullanim: mukerrer-ayikla.mjs <temiz.json> <kirli.json> <cikti.json>");
  process.exit(1);
}
/* Dugum tablosu DUGUM_TABLO ile degistirilebiliyor -- catali (genisletilmis
   liste) olcerken araclarin ana haritaya degil ONA bakmasi gerekiyor;
   yoksa transa zaten girmis bir kisi ikinci kez "yeni" sayilir.
   Python tarafindaki kenar-tara/baslik-coz ayni degiskeni okuyor. */
const V = await import(pathToFileURL(process.env.DUGUM_TABLO || "app/silsileVeri.js").href);
const temiz = JSON.parse(readFileSync(temizYol, "utf8"));
const kirli = JSON.parse(readFileSync(kirliYol, "utf8"));
const aday = [...temiz, ...kirli].filter((k) => k.id && k.ar);

const BAGLAC = new Set(["بن", "ابن", "مولي", "مولاهم"]);
const KUNYA = new Set(["أبو", "أبي", "أبا", "ابو", "ابي", "أم", "ام", "بنت"]);

function dizi(s) {
  let t = s.replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .split(/\s+/).filter(Boolean);
  return t.map((w) => w.replace(/^ال/, ""))
    .filter((w) => w.length > 1 && !BAGLAC.has(w) && !KUNYA.has(w));
}

/* Bir adin IKI OKUNUSU. Haritadaki adlarin bir kismi kunya-once yazili
   («أبو أسامة حماد بن أسامة»), Takrib ad-once veriyor; kunya blogu
   atilinca ikisi ayni siraya geliyor.

   AMA HER ZAMAN ATILAMAZ: «أبو داود الطيالسي» kunyasiz yalnizca
   «الطيالسي» kaliyor, tek belirtec delil sayilmiyor ve Ebu Davud
   et-Tayalisi "yeni" sanildi. O yuzden iki bicim de uretiliyor ve
   eslesme HERHANGI BIRINDE tutarsa kabul ediliyor. */
function okunuslar(s) {
  const tam = dizi(s);
  const ham = s.replace(/[ً-ْٰـ]/g, "").split(/\s+/).filter(Boolean);
  let kes = ham;
  while (kes.length > 2 && KUNYA.has(kes[0])) kes = kes.slice(2);
  const kunyasiz = dizi(kes.join(" "));
  const out = [tam];
  if (kunyasiz.length >= 2 && kunyasiz.join(" ") !== tam.join(" ")) out.push(kunyasiz);
  return out;
}

/* Kucuk dizi buyugun SIRALI altdizisi mi. */
function altdizi(a, b) {
  let j = 0;
  for (const w of a) {
    while (j < b.length && b[j] !== w) j++;
    if (j === b.length) return false;
    j++;
  }
  return true;
}

/* Ad KUNYE ILE BASLIYOR MU. Asagidaki isim capasi icin gerekiyor. */
const kunyaBasli = (s) =>
  KUNYA.has(s.replace(/[ً-ْٰـ]/g, "").split(/\s+/)[0]);

const mevcut = V.NODES.map((n) => ({ n, dd: okunuslar(n.ar), kb: kunyaBasli(n.ar) }));
/* Ortak belirteclerden en az biri NADIR olmali: iki yaygin ad
   («جعفر محمد») tek basina kimlik degil. */
const sik = new Map();
for (const { dd } of mevcut) for (const w of new Set(dd[0])) sik.set(w, (sik.get(w) || 0) + 1);
const YAYGIN = 25;

const ayni = [], yeni = [];
for (const k of aday) {
  const kdd = okunuslar(k.ar);
  if (kdd[0].length < 2) { ayni.push({ k, esles: [], sebep: "ad tek belirtec" }); continue; }
  const esles = mevcut.filter(({ n, dd, kb }) => {
    if (typeof n.olum === "number" && typeof k.olum === "number"
        && Math.abs(n.olum - k.olum) > 15) return false;
    for (const kd of kdd) for (const d of dd) {
      const [kucuk, buyuk] = kd.length <= d.length ? [kd, d] : [d, kd];
      if (kucuk.length < 2 || !altdizi(kucuk, buyuk)) continue;
      if (!kucuk.some((w) => (sik.get(w) || 0) <= YAYGIN)) continue;
      /* ISIM CAPASI -- ATA TUZAGI. Sirali altdizi tek basina kisinin
         NESEBINDEKI atayi kisinin kendisi saniyordu: «داود بن رشيد»
         (gercek ve ayri bir ravi) «سليمان بن داود بن رشيد»in altdizisi
         cikiyor, «فليح بن سليمان بن أبي المغيرة» ise «سليمان بن المغيرة»yi
         yutuyordu. Olum yili kapisi bunlari GECIRIYOR, cunku baba ile ogul
         cogu zaman on bes yil icinde.
         Olcut: kisa adin ismi, uzun adin da ISMI olmali -- yani eslesme
         sifirinci ogeden baslamali. Ata, tanimi geregi sifirinci ogede
         DEGILDIR.
         ISTISNA, kunye ile baslayan ad. «أبو داود الطيالسي» ve «أبو سعيد
         المقبري»de capalanacak isim zaten yok; orada capa aransa kendi
         tam adlariyla («سليمان بن داود», «كيسان») ayri dusuyorlardi --
         yani YANLIS AYIRMA, ki bu arac icin pahali hata. */
      if (!kb && !kunyaBasli(k.ar) && buyuk[0] !== kucuk[0]) continue;
      return true;
    }
    return false;
  });
  if (esles.length) ayni.push({ k, esles: esles.map((e) => e.n) });
  else yeni.push(k);
}
writeFileSync(ciktiYol, JSON.stringify(yeni, null, 1), "utf8");
console.log("aday kayit        :", aday.length);
console.log("haritada ZATEN var:", ayni.filter((x) => x.esles.length).length);
console.log("adi tek belirtec  :", ayni.filter((x) => !x.esles.length).length);
console.log("gercekten yeni    :", yeni.length);
console.log("\n-- mukerrer olarak elenenlerden ornek --");
for (const x of ayni.filter((y) => y.esles.length).slice(0, 18)) {
  console.log("  " + (x.k.tr || x.k.ar).slice(0, 40).padEnd(42), "->",
              x.esles.map((n) => n.tr).slice(0, 2).join(" / "));
}
