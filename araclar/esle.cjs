/* TERCEME LISTESI -> KENAR ESLESTIRICI
   Girdi: bir tercemenin «روى عنه» (talebe) ya da «روى عن» (hoca)
   listesinin ham metni.
   Cikti: metindeki isimlerden AGDA ZATEN DUGUMU OLANLAR + rumuzlari.

   Iki suzgec var:

   1. KAYIT SINIRI. Eslestirme alt dizge aramasiyla degil kayit
      basiyla yapiliyor. «حميد بن عبد الرحمن بن عوف» ifadesi
      Abdurrahman b. Avf dugumuyle eslesmemeli -- oradaki isim dedenin
      adi. Bir kayit ancak dugumun adiyla BASLIYORSA sayiliyor; basta
      yalnizca «و» ya da iki kelimelik bir kunye bulunabiliyor.

   2. KRONOLOJI. Ad esitligi tek basina yetmiyor. «علي بن الحسين» hem
      Zeynelabidin'in (o. 94) hem Ali b. el-Huseyin b. Eskab'in
      (3. yuzyil) adinin basi; ilki Ibn Uleyye'nin (o. 193) talebesi
      olamaz. Talebe hocadan once olebilir -- Hammad b. Zeyd icin
      Mizzi «ومات قبله» der -- ama altmis yildan fazla once olemez.

   Ayrica ayni kayda birden cok dugum uyarsa EN UZUN ad kazaniyor,
   yoksa «قتيبة» gibi kisa bir ad «قتيبة بن سعيد» kaydini kapiyor. */
const fs = require("fs");

const sad = (s) => s
  .replace(/[ً-ْٰـ]/g, "")   // hareke ve tatvil
  .replace(/[أإآٱ]/g, "ا")
  .replace(/[ىي]/g, "ي")
  .replace(/ة/g, "ه")
  .replace(/ؤ/g, "و")
  .replace(/ئ/g, "ي")
  .replace(/\(.*?\)/g, " ")                       // (م د س) rumuzlari
  .replace(/[٠-٩\d]+/g, " ")
  .replace(/\s+/g, " ").trim();

// «ابن» ile «بن» ayni sey; nesep zincirinde ikisi de geciyor
const nesep = (s) => sad(s).replace(/ابن/g, "بن");

function kayitlar(metin) {
  // Mizzi kayitlari «، و» ile ayirir ve her kaydin ardindan rumuz gelir.
  return metin.split(/،\s*(?=و?[؀-ۿ])/)
    .map((p) => p.trim()).filter(Boolean)
    .map((p) => {
      const rm = p.match(/\(([^)]*)\)/);
      return { ham: p, ad: nesep(p).replace(/^و/, "").trim(),
               rumuz: rm ? rm[1].replace(/\s+/g, " ").trim() : "—" };
    });
}

/* Kronoloji penceresi IKI TARAFLI.

   Tek tarafli birakildiginda «عبد الله بن عمر العمري» (o. 172) kaydi
   sahabi Abdullah b. Omer (o. 73) dugumuyle eslesiyor ve Abdurrezzak'a
   (o. 211) 138 yil once olmus bir hoca yaziliyordu.

   TERS_PAY: talebe hocadan once olebilir (Mizzi «ومات قبله» der) ama
   altmis yildan fazla once olemez.
   DUZ_PAY: hoca talebeden once oldur, aradaki en genis mesafe uzun
   omurlu bir hocayla genc bir talebe arasinda yuz yil kadar. Olculen
   en genis mesru fark Abdurrezzak-Haccac b. Ertat arasinda 66 yil. */
const TERS_PAY = 60;
const DUZ_PAY = 100;
function kronolojiUyar(ozne, aday, yon) {
  if (ozne.olum == null || aday.olum == null) return true;
  const fark = aday.olum - ozne.olum;          // talebe icin pozitif olmali
  return yon === "talebe" ? fark >= -TERS_PAY && fark <= DUZ_PAY
                          : fark <= TERS_PAY && fark >= -DUZ_PAY;
}

// kunye onekini at: "ابو فلان" / "ابي فلان" / "ام فلان"
const KUNYE = /^(ابو|ابي|ام)\s+\S+\s+/;

/* Nesep baglayicilari ve nispet onekleri: eslestirmede ayirt edici
   degiller, atiliyor. Geriye kalan "ayirt edici belirtecler". */
const BAGLAYICI = new Set(["بن", "بنت", "ال", "و", "هو", "مولي", "مولاهم"]);
const belirtec = (ad) => nesep(ad).split(" ")
  .map((w) => w.replace(/^ال/, ""))
  .filter((w) => w && !BAGLAYICI.has(w));

/* Duz onek karsilastirmasi yetmiyordu, cunku nesep zinciri IKI YONDE
   de uzayabiliyor:
     dugum «احمد بن حنبل»            metin «احمد بن محمد بن حنبل»
     dugum «عبد الرحمن بن مهدي بن حسان»  metin «عبد الرحمن بن مهدي»
   Ikisi de ayni kisi. Bu yuzden olcut ALT DIZI: dugumun ayirt edici
   belirtecleri kayitta AYNI SIRAYLA gecmeli.

   Yanlis eslesmeyi iki sey tutuyor. Birincisi ism'in basta olmasi --
   «حميد بن عبد الرحمن بن عوف» kaydi Abdurrahman b. Avf ile
   eslesmiyor, cunku kayit «حميد» ile basliyor. Ikincisi kronoloji.

   Istisna: dugum adi «ابن جريج», «ابن علية» gibi bir SOHRET adiysa
   ism basta degildir; o zaman yalnizca alt dizi sarti araniyor. */
const altDizi = (kucuk, buyuk) => {
  let i = 0;
  for (const w of buyuk) if (w === kucuk[i]) i++;
  return i === kucuk.length;
};

function eslestir(metin, dugumler, ozne, yon) {
  const kyt = kayitlar(metin);
  const bulunan = [];
  for (const k of kyt) {
    const kayitBel = belirtec(k.ad.replace(/^و/, ""));
    const kayitBelKunyesiz = belirtec(k.ad.replace(/^و/, "").replace(KUNYE, ""));
    let enIyi = null, enIyiBel = 0;
    for (const n of dugumler) {
      if (ozne && n.id === ozne.id) continue;      // kendine bag olmaz
      const bel = belirtec(n.ar);
      if (!bel.length) continue;
      const sohret = /^(ابن|بن)\s/.test(nesep(n.ar));
      const ismBasta = kayitBel[0] === bel[0] || kayitBelKunyesiz[0] === bel[0];
      if (!sohret && !ismBasta) continue;
      /* Alt dizi IKI YONDE de aranıyor. Dugum adi metinden uzun
         olabiliyor: dugum «عبد الرحمن بن مهدي بن حسان», metin
         «عبد الرحمن بن مهدي». Ters yonde en az iki belirtec sarti var,
         yoksa yalin bir «علي» kaydi butun uzun adlarla eslesirdi. */
      const ileri = altDizi(bel, kayitBel) || altDizi(bel, kayitBelKunyesiz);
      const geri = kayitBel.length >= 2 &&
                   (altDizi(kayitBel, bel) || altDizi(kayitBelKunyesiz, bel));
      if (!ileri && !geri) continue;
      // Tek belirtecli ad ancak sohret adiysa kabul ediliyor.
      if (bel.length < 2 && !sohret) continue;
      if (ozne && !kronolojiUyar(ozne, n, yon)) continue;
      if (bel.length > enIyiBel) { enIyi = n; enIyiBel = bel.length; }
    }
    if (enIyi && !bulunan.some((x) => x.id === enIyi.id)) {
      bulunan.push({ id: enIyi.id, tr: enIyi.tr, ar: enIyi.ar, olum: enIyi.olum,
                     rumuz: k.rumuz, kayit: k.ham.slice(0, 55) });
    }
  }
  return { kayitSayisi: kyt.length, eslesen: bulunan };
}

module.exports = { eslestir, kayitlar, nesep };

if (require.main === module) {
  const [, , metinDosya, dugumDosya, ozneId, yon] = process.argv;
  const metin = fs.readFileSync(metinDosya, "utf8");
  const dugumler = JSON.parse(fs.readFileSync(dugumDosya, "utf8"));
  const ozne = dugumler.find((d) => d.id === ozneId);
  if (ozneId && !ozne) throw new Error("ozne dugumu yok: " + ozneId);
  const r = eslestir(metin, dugumler, ozne, yon || "talebe");
  console.log("tercemede kayit:", r.kayitSayisi,
              " agda dugumu olan:", r.eslesen.length,
              ozne ? "(" + ozne.tr + ", o." + ozne.olum + ")" : "");
  r.eslesen.forEach((x) => console.log("  " + x.id.padEnd(20) +
    (x.rumuz || "—").padEnd(12) + ("o." + (x.olum ?? "?")).padEnd(8) + x.tr.padEnd(34) + "« " + x.kayit));
}
