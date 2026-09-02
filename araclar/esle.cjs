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
/* KUNYE ANCAK ADIN YERINE GECIYORSA ATILIR.

   «أبي معمر عبد الله بن سخبرة» kaydinda kunye adin ONUNDE duruyor,
   atilinca gercek ad kaliyor. Ama «أبي عبيدة بن عبد الله بن مسعود»
   kaydinda kunyeden sonra BN geliyor: orada «عبد الله بن مسعود»
   ozne DEGIL, oznenin BABASI. Kunyeyi atmak Ebu Ubeyde'nin kaydini
   Ibn Mes'ud dugumune baglıyordu.

   Ayrim basit: kunyeden sonra بن / ابن geliyorsa atma. */
/* NOT: buraya bir kez  yazilmaya calisildi ve arac zinciri onu GERCEK
   backspace karakterine (0x08) cevirdi; lookahead hicbir zaman tutmadi,
   kunye her kayitta atildi ve «ابي عبيدة بن عبد الله بن مسعود» kaydi
   Ibn Mes'ud dugumune baglandi. Ayrica JS'te  sinirini \w tanimlar
   ve \w Arapca harf icermez, yani dogru yazilsa da ise yaramazdi. */
const KUNYE = /^(ابو|ابي|ام)\s+\S+\s+(?!(?:بن|ابن)(?:\s|$))/;

/* Nesep baglayicilari ve nispet onekleri: eslestirmede ayirt edici
   degiller, atiliyor. Geriye kalan "ayirt edici belirtecler". */
/* AKRABALIK ONEKLERI DE BAGLAYICI.

   Mizzi listelerde kisiyi cogu zaman ozneye gore konumlandiriyor:
   «وأخيه همام بن منبه», «وابنه شعيب بن الليث», «وابن أخيه عبد الصمد».
   Bu onekler ism sanildigi icin kayit ISM'i BASTA olmayan bir kayit
   gibi gorunuyor ve dugum hic aranmadan eleniyordu -- Vehb b.
   Munebbih'in oz kardesi Hemmam listede oldugu halde eslesmiyordu.
   Ayirt edici olmadiklari icin dogru yer BAGLAYICI. */
const BAGLAYICI = new Set(["بن", "بنت", "ال", "و", "هو", "مولي", "مولاهم",
  "اخيه", "اخوه", "اخته", "ابنه", "ابناه", "ابيه", "عمه", "جده",
  "ختنه", "والد", "والده", "نسيب", "سبط"]);
/* KUNYENIN UC HALI TEK BICIME INIYOR.

   Mizzi listeleri «روى عن:» ve «روى عنه:» ardindan geldigi icin adlar
   CER HALINDE yaziliyor: «وأبي هريرة». Dugum tablosunda ise ad yalin
   halde: «أبو هريرة». Harekeler sad()'da zaten dustugu icin geriye
   ابي / ابو / ابا ayrimi kaliyordu ve YALNIZ KUNYESIYLE bilinen her
   dugum (Ebu Hureyre, Ebu Vail, Ebu Kilabe, Ebu Nadra...) sessizce
   eslesmiyordu. Uc bicim burada tek belirtece indiriliyor. */
/* «عبد» BILESIK ISMIN YARISI, AYRI BIR BELIRTEC DEGIL.

   Ayri birakilinca «عبد الله» ve «عبد الرحمن» ILK belirteclerini
   paylasiyor ve "ism basta" denetimi bosa dusuyor:
   «عبد الرحمن بن عبد الله بن مسعود» kaydi (Ibn Mes'ud'un OGLU)
   «عبد الله بن مسعود» dugumuyle esleşiyordu.

   «عبد» ardindaki kelimeyle birlestiriliyor -- ama ardindan بن
   geliyorsa DEGIL, cunku o zaman «عبد» tek basina ism (Abd b. Humeyd). */
const birlestir = (par) => {
  const cikti = [];
  for (let i = 0; i < par.length; i++) {
    const w = par[i], s = par[i + 1];
    if (w === "عبد" && s && s !== "بن" && s !== "ابن") { cikti.push(w + s); i++; }
    else cikti.push(w);
  }
  return cikti;
};
const belirtec = (ad) => birlestir(nesep(ad).split(" ").filter(Boolean))
  .map((w) => w.replace(/^ال/, ""))
  .map((w) => (w === "ابي" || w === "ابا" ? "ابو" : w))
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

/* TERS YONDE ALT DIZI DEGIL ONEK.

   Dugum adi kayittan uzun olabiliyor ve bu mesru: dugum
   «عبد الرحمن بن مهدي بن حسان», kayit «عبد الرحمن بن مهدي». Ama serbest
   alt dizi birakildiginda kayit adin ORTASINDAN atlayarak da
   eslesiyordu ve yanlis kisiyi getiriyordu:

     kayit «ابو عثمان» (adi verilmemis biri)
       -> dugum «ابو حصين عثمان بن عاصم»   (حصين atlanarak)
     kayit «ابو طارق البصري»
       -> dugum «ابو عمرو احمد بن علي البصري» (yalniz nisbe uzerinden)

   Oysa kisaltilmis bir ad KUYRUGUNU atar (nisbe, dede), ortasini
   degil. Onek sarti mesru durumu koruyor, bu ikisini eliyor, ve
   kunyesiyle bilinen dugumleri de kurtariyor: kayit «ابو هريره»
   dugum «ابو هريره دوسي»nin onekidir. */
const onek = (kucuk, buyuk) =>
  kucuk.length <= buyuk.length && kucuk.every((w, i) => w === buyuk[i]);

/* ISM + SOHRET KISALTMASI.

   Onek sarti tek basina bir seyi kaciriyor: kayit bazen adin ORTASINI
   atip ism ile sohreti birlestiriyor -- «سليمان الأعمش», oysa dugum
   «سليمان بن مهران الأعمش». Onek degil, ama ayni kisi.

   Bunu guvenle almanin yolu iki ucu birden capalamak: kaydin ILK ve
   SON belirteci dugumunkiyle ayni olmali, arasi da alt dizi olmali.
   Boylece «ابو عثمان» -> «ابو حصين عثمان بن عاصم» hala eleniyor
   (son belirtecler عثمان / عاصم tutmuyor). */
const ucCapa = (kucuk, buyuk) =>
  kucuk.length >= 2 && buyuk.length >= 2 &&
  kucuk[0] === buyuk[0] &&
  kucuk[kucuk.length - 1] === buyuk[buyuk.length - 1] &&
  altDizi(kucuk, buyuk);

function eslestir(metin, dugumler, ozne, yon) {
  const kyt = kayitlar(metin);
  const bulunan = [];
  for (const k of kyt) {
    /* BASTAKI BAGLAC WAW'INI BURADA BIR DAHA ATMA.

       kayitlar() ad'i uretirken zaten `^و`yi siliyor. Burada ikinci kez
       silinince ADI WAW ILE BASLAYAN herkes ilk harfini kaybediyordu:
       «ووكيع بن الجراح» -> kayitlar «وكيع بن الجراح» -> burada
       «كيع بن الجراح». Veki', Velid, Vehb, Vasile, Vakid... hepsi
       baskalarinin listelerinde sessizce eslesmiyordu. */
    const kayitBel = belirtec(k.ad);
    const kayitBelKunyesiz = belirtec(k.ad.replace(KUNYE, ""));
    let enIyi = null, enIyiBel = 0, enIyiTur = 0;
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
      /* Esik her varyanta AYRI uygulaniyor: eskiden guard yalniz
         kayitBel'e bakiyordu, oysa eslesmeyi kunyesi atilmis (ve tek
         belirtece dusmus) varyant saglayabiliyordu. */
      const geri =
        (kayitBel.length >= 2 && (onek(kayitBel, bel) || ucCapa(kayitBel, bel))) ||
        (kayitBelKunyesiz.length >= 2 &&
         (onek(kayitBelKunyesiz, bel) || ucCapa(kayitBelKunyesiz, bel)));
      if (!ileri && !geri) continue;
      // Tek belirtecli ad ancak sohret adiysa kabul ediliyor.
      if (bel.length < 2 && !sohret) continue;
      if (ozne && !kronolojiUyar(ozne, n, yon)) continue;
      /* DUZ YON TERS YONU YENER.

         Iki dugum ayni kayda uyabiliyor: biri kaydin TAMAMINI
         karsiliyor (duz: dugum adi kaydin alt dizisi), oteki kayittan
         DAHA UZUN bir ad tasiyor (ters: kayit dugumun alt dizisi).
         Salt "en uzun ad kazanir" dendiginde ikincisi kazaniyordu ve
         yanlisti: «نافع مولى ابن عمر» kaydi (Nafi' mevla Ibn Omer,
         o.117) «نافع بن عمر الجمحي» (o.169) dugumune gidiyordu --
         kayitta gecmeyen «الجمحي» nisbesi kaydi baska birine
         cevirdigi halde. Kayitta bulunmayan bir belirtec ADAYI
         GUCLENDIREMEZ; zayiflatir.

         Bu yuzden once eslesmenin turune, sonra ad uzunluguna
         bakiliyor. Ters yon hala gerekli (dugum «عبد الرحمن بن مهدي
         بن حسان», kayit «عبد الرحمن بن مهدي») ama yalnizca duz yonde
         hicbir aday yoksa. */
      /* AYNI YONDE ONEK OLAN ADAY ONCE GELIR.

         Iki dugum de duz yonde uyabiliyor; "en uzun ad kazanir" o zaman
         yanlis secim yapiyordu. «علي بن الحسين بن علي بن أبي طالب»
         (Zeynelabidin) kaydina hem «علي بن الحسين» hem «علي بن أبي طالب»
         uyuyor -- ikincisi daha uzun oldugu icin Hz. Ali kazaniyordu.
         Oysa Zeynelabidin kaydin ONEKI, Hz. Ali ise araya bosluk
         birakan bir alt dizi. Kaydin basiyla kesintisiz ortusen aday
         her zaman daha iyi. */
      const onekMi = ileri &&
        (onek(bel, kayitBel) || onek(bel, kayitBelKunyesiz));
      const tur = (ileri ? 2 : 1) * 2 + (onekMi ? 1 : 0);
      if (tur > enIyiTur || (tur === enIyiTur && bel.length > enIyiBel)) {
        enIyi = n; enIyiBel = bel.length; enIyiTur = tur;
      }
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
