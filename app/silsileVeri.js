/* SILSILE AGININ VERISI VE SAF YARDIMCILARI.

   2026-08-30'da bilesenden ayrildi. Sebep: /ag-sinamasi'nda cizim
   katmani <canvas> ile yeniden deneniyor ve o deneme icin bilesenin
   bir kopyasi gerekiyordu. Veri de kopyalansaydi 657 ravi ile 1647
   bag iki ayri dosyada yasardi; su an tercemeler islenirken her
   eklemenin iki yere birden yazilmasi gerekirdi ve ikisi kacinilmaz
   olarak birbirinden ayrilirdi.

   Burada React yok, JSX yok, durum yok. Yalnizca sabitler, ravi ve
   bag tablolari, ceviriler ve konum hesabi. Iki cizim bileseni de
   (SilsileAgi ve SilsileAgiTuval) buradan besleniyor. */

/* ==================================================================
   SİLSİLE AĞI — v3
   Dikey eksen: vefat yılı (hicrî), yukarıdan aşağı. Yatay: belde sütunları.
   Kaynak: Mizzî, Tehzîbü'l-Kemâl (Şâmile 3722), terceme 4089 ve 7681.
   Tabaka tasnifi: İbn Hacer, Takrîbü't-Tehzîb (8609).
================================================================== */

export const TAB = {
  0: { ad: "Kaynak" },
  1: { ad: "Sahâbe" },
  2: { ad: "Kibâr-ı tâbiîn" },
  3: { ad: "Vustâ" },
  4: { ad: "Sigār-ı tâbiîn" },
  5: { ad: "Etbâu't-tâbiîn" },
  /* Kutub-i Sitte muelliflerinin talebeleri. Ag'in son siniri:
     bunlarin talebeleri artik eklenmiyor. */
  6: { ad: "Müellif sonrası" },
};

// Râvi noktaları için canlı palet. Renk anlam taşımaz, ayırt etmeye yarar.
/* Renkler 2026-08-29'da acildi: her ton beyazla %30 karistirildi.
   Noktalar buyuyunce eski doygun tonlar sayfayi agirlastiriyordu.
   Renk ANLAM TASIMAZ, yalnizca ayirt etmeye yarar. */
export const PALET = [
  "#EA826A", "#6ABAB1", "#F7BE90", "#9782B3", "#57BFC8", "#E36777",
  "#778CA6", "#F3B94D", "#ADC8A4", "#D45D8C", "#5FB8AE", "#F6935E",
  "#8F5779", "#4DC1C1", "#D08185", "#7B90F3", "#A3BB79", "#FFA3BA",
  "#58ADC9", "#EC896D", "#6C9784", "#BA83E7", "#F966AA", "#51C1A4",
];
export const NEBI_RENK = "#80D7C1";   // turkuaza çalan açık yeşil

// salınım süresi/gecikmesi için sabit sözde-rastgele sayı
export const salSayi = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 37 + id.charCodeAt(i)) >>> 0;
  return h;
};

export const renkOf = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALET[h % PALET.length];
};

// Kaynakta vefat yılı verilmeyen râviler için yerleşim değeri.
// Kaynağa dayanmaz, yalnız râviyi tabakasının tipik aralığının ortasına koyar.
/* Tabaka 6 icin 308: bu isimlerin cogu 280-360 arasinda vefat etti ama
   YIL_MAX 315, yani 320 ekseni tasardi. Gercek tarihler islenene kadar
   dikey konumlari yalnizca "en altta" demek. */
/* Tabaka 6'nin merkezi 308 degil 300: 30 yillik bant (285-315) ekseni
   tasmadan sigsin. 308 iken bandin ust yarisi YIL_MAX'a kirpiliyor ve
   isimler yeniden yigiliyordu. */
export const TAHMIN = { 0: 11, 1: 55, 2: 90, 3: 105, 4: 135, 5: 175, 6: 300 };

/* Vefat yili bilinmeyen ravinin yerlesim yili.

   TEK BIR DEGERE YIGMIYOR, 30 YILLIK BIR BANDA DAGITIYOR. Onceden
   tarihsiz herkes tabakanin varsayilan yilina oturuyordu ve sonuc
   tabloda yatay bir boncuk dizisiydi: onlarca nokta tam ayni yukseklikte,
   isimleri de birbirine giriyordu (Mustafa'nin ekran goruntuleri,
   2026-08-29). Dagitim ravinin kendi kimliginden turetiliyor, yani
   rastgele degil -- her calistirmada ayni yere dusuyor.

   BU BIR TARIH IDDIASI DEGIL: nokta zaten "ö. ?/?" yaziyor. Bandin
   tek isi ayni tabakadaki tarihsizleri birbirinden ayirmak. Gercek
   tarih islenince `olum` dolar ve bant devreden cikar.

   Bant eksenin disina tasmasin diye kirpiliyor. */
export const BANT = 30;

/* Karmayi DAGITAN son islem. `salSayi` ardisik harflerde ardisik
   sonuclar veriyor; "ms01".."ms29" gibi birbirine cok benzeyen id'ler
   mod 1000 alininca birkac degere yigiliyordu -- olculdu: 21 dugum 2.5
   yillik bir arali ga dusuyordu, 30 yillik degil. Asagidaki adimlar
   (xor-kaydir + carp) biti tabana yayiyor. Sonuc yine SABIT: ayni id
   her zaman ayni yere dusuyor. */
export const dagit = (h) => {
  h ^= h >>> 16; h = Math.imul(h, 2246822507);
  h ^= h >>> 13; h = Math.imul(h, 3266489909);
  h ^= h >>> 16;
  return (h >>> 0) % 10000 / 10000;
};

export const tahminiYil = (n) => {
  if (n.olum != null) return n.olum;
  const merkez = TAHMIN[n.tab];
  const kay = (dagit(salSayi(n.id)) - 0.5) * BANT;
  return Math.min(YIL_MAX - 2, Math.max(YIL_MIN + 2, merkez + kay));
};

// DİA'dan alınan hicrî/milâdî vefat yılları (madde tanıtım cümlelerinden)
export const DIA = {"ali": [40, "661"], "ebuhureyre": [58, "678"], "ebubekir": [13, "634"], "omer": [23, "644"], "aise": [58, "678"], "enes": [93, "711"], "cabir": [78, "697"], "ibnabbas": [68, "687"], "ibnomer": [73, "693"], "ibnmesud": [32, "652"], "ibnzubeyr": [73, "692"], "bera": [71, "690"], "zeydarkam": [68, "688"], "suhayb": [38, "659"], "hasanbali": [49, "669"], "huseyn": [61, "680"], "ibncafer": [80, "699"], "mikdad": [33, "653"], "fatima": [11, "632"], "ubey": [33, "654"], "usame": [54, "674"], "kabahbar": [32, "652"], "ahnef": [67, "686"], "esvedyezid": [75, "694"], "alkame": [62, "682"], "suveydgafle": [80, "699"], "ebuvail": [82, "701"], "zirhubeys": [82, "701"], "saidmusayyeb": [94, "713"], "hasanbasri": [110, "728"], "rebihiras": [101, "719"], "zeydvehb": [83, "702"], "ebutufeyl": [100, "718"], "sabi": [104, "722"], "urve": [94, "713"], "ikrime": [105, "723"], "zeynelabidin": [94, "712"], "zeydeslem": [136, "754"], "salimibnomer": [106, "725"], "amrhurays": [85, "704"], "zeydsabit": [45, "665"], "kayshazim": [97, "715"], "abdrahmanebubekir": [53, "673"], "abdrahmanavf": [32, "652"], "osman": [35, "656"], "ukbeamir": [58, "678"], "ebumusa": [42, "662"], "ebusaid": [74, "693"], "huzeyfe": [36, "656"], "ebusalih": [101, "719"], "esaskays": [40, "661"], "cerirbecelî": [51, "671"], "sadvakkas": [55, "675"], "talha": [36, "656"], "asimomer": [70, "689"], "ebanosman": [105, "723"], "ibnhanefiyye": [81, "700"], "ataebirebah": [114, "732"], "ubeydullahadi": [58, "678"], "abdrahmanyezid": [198, "813"], "ebuabdrahmansulemi": [73, "692"], "selemeekva": [74, "693"], "imranhusayn": [52, "672"], "mugirasube": [50, "670"], "abdrahmanabza": [70, "689"], "amrdinar": [126, "744"], "ebuishaksebii": [127, "745"], "amess": [148, "765"], "malik": [179, "795"], "ibncureyc": [150, "767"], "ibnuyeyne": [198, "814"], "hammadseleme": [167, "784"], "mamer": [153, "770"], "sevri": [161, "778"], "evzai": [157, "774"], "huseym": [183, "799"], "yahyaadem": [203, "818"], "kattan": [198, "813"], "ibnmehdi": [198, "813"], "rafihadic": [73, "692"], "eyyubsahtiyani": [131, "749"], "haccacertat": [145, "762"], "ebulaliye": [90, "709"], "ibrahimteymi": [92, "710"], "hafsgiyas": [194, "810"], "leysbsad": [175, "791"], "ibnidris": [192, "807"], "alimushir": [189, "805"], "saidcubeyr": [94, "713"], "tavus": [106, "725"], "mucahid": [103, "721"], "suleymanyesar": [107, "725"], "vehbmunebbih": [114, "732"], "hammadzeyd": [179, "795"], "numanbesir": [64, "684"], "zuhayrmuaviye": [173, "789"], "temimdari": [40, "661"], "bilal": [20, "641"], "amirrebia": [35, "656"], "sabitbunani": [127, "744"], "dahhak": [105, "723"], "ebukilabe": [104, "722"], "yahyasaidensari": [143, "760"], "katade": [117, "735"], "yahyaebikesir": [129, "747"], "ibnishak": [151, "768"], "ibnebiaruba": [156, "773"], "ebuavane": [176, "792"], "sube": [160, "776"], "veki": [197, "812"], "ibnmubarek": [181, "797"], "cerirabdulhamid": [188, "804"], "ebucafermuhbakir": [114, "733"], "ebuselemeavf": [94, "712"], "mesruk": [63, "683"], "amrmeymun": [74, "693"], "hamzazeyyat": [156, "773"], "halidvelid": [21, "642"], "bureyde": [63, "682"], "hafsa": [45, "665"], "ibnebimuleyke": [117, "735"], "ebunadra": [108, "726"], "haricezeyd": [100, "718"], "ubeydullahutbe": [98, "716"], "arac": [117, "735"], "ibrahimsad": [183, "799"], "suaybebihamza": [162, "779"], "ibnsihab": [124, "742"], "hisamdestuvai": [153, "770"], "misersukdam": [155, "772"], "suleymanteymi": [143, "761"], "serikkadi": [177, "794"], "sureyh": [80, "699"], "ibnebizaide": [182, "798"], "nebi": [11, "632"], "buhari": [256, "870"], "muslim": [261, "875"], "ebudavud": [275, "889"], "tirmizi": [279, "892"], "nesai": [303, "915"], "ibnmace": [273, "887"]};

/* Veri denetimi. Sessiz veri hatalarini gelistirme sirasinda yuze
   cikarir: bir ravinin beldesi sutun listesinde yoksa o ravi ag'da hic
   gorunmez ve bunu fark etmek zordur. Uretimde calismaz. */
export function veriyiDenetle(nodes, edges) {
  const bilinen = new Set(BELDELER);
  const kayipBelde = nodes.filter((n) => !bilinen.has(n.belde));
  const idler = new Set(nodes.map((n) => n.id));
  const kayipUc = edges.filter((e) => !idler.has(e.a) || !idler.has(e.b));
  if (kayipBelde.length) console.warn("[silsile] BELDELER'de olmayan belde -- bu raviler cizilmeyecek:",
    kayipBelde.map((n) => n.tr + " (" + n.belde + ")"));
  if (kayipUc.length) console.warn("[silsile] ucu tanimsiz kenar:",
    kayipUc.map((e) => e.a + " -> " + e.b));
}


/* ---------- Ingilizce ad ----------

   570'ten fazla ravinin ayri bir Ingilizce adi YOK ve elle yazilmasi
   istenmedi. Burada iki katmanli, MEKANIK bir cozum var:

   1) SOZLUK. En cok karsilasilan isimler icin literaturde yerlesik
      Ingilizce bicim yaziliyor (Abu Hurayra, Umar b. al-Khattab,
      al-Bukhari...). Bunlar ag'in omurgasi -- kartin en cok acildigi
      isimler.
   2) KURAL. Sozlukte olmayanlar icin Turkce yazimdan mekanik cevrim:
      Turkce'ye ozgu harfler (s, g, c, o, u, i) ve uzatma isaretleri
      cozuluyor, tanimliklar Arapca'daki gibi yaziliyor (el- -> al-,
      es- -> as-...), Ebu/Ebi one aliniyor.

   BU BIR ILMI CEVIRI YAZI DEGIL, okunabilirlik icin bir yaklastirma.
   Kuralin goremedigi seyler var: Turkce `k` hem ك hem ق'i karsiliyor,
   uzun unluler kayboluyor, "Hüseyin" gibi yerlesik bicimler ancak
   sozlukten gelirse dogru cikiyor. Bir isim yanlis gorunuyorsa cozum
   onu SOZLUGE eklemek -- kural tablosunu zorlamak degil. */
export const ING_SOZLUK = {
  "Hz. Peygamber": "The Prophet", "Ebû Hüreyre": "Abu Hurayra",
  "Ebû Bekir es-Sıddîk": "Abu Bakr al-Siddiq", "Ömer b. el-Hattâb": "Umar b. al-Khattab",
  "Osman b. Affân": "Uthman b. Affan", "Ali b. Ebî Tâlib": "Ali b. Abi Talib",
  "Âişe bint Ebî Bekir": "Aisha bint Abi Bakr", "Abdullah b. Ömer": "Abd Allah b. Umar",
  "Abdullah b. Abbâs": "Abd Allah b. Abbas", "Abdullah b. Mes‘ûd": "Abd Allah b. Mas'ud",
  "Enes b. Mâlik": "Anas b. Malik", "Câbir b. Abdullah": "Jabir b. Abd Allah",
  "Ebû Saîd el-Hudrî": "Abu Sa'id al-Khudri", "Zeyd b. Sâbit": "Zayd b. Thabit",
  "Saîd b. el-Müseyyeb": "Sa'id b. al-Musayyab", "Hasan-ı Basrî": "al-Hasan al-Basri",
  "İbn Şihâb ez-Zührî": "Ibn Shihab al-Zuhri", "Urve b. ez-Zübeyr": "Urwa b. al-Zubayr",
  "Âmir b. Şerâhîl eş-Şa‘bî": "Amir b. Sharahil al-Sha'bi", "Mücâhid b. Cebr": "Mujahid b. Jabr",
  "İkrime mevlâ İbn Abbâs": "Ikrima, mawla of Ibn Abbas", "Tâvûs b. Keysân": "Tawus b. Kaysan",
  "Atâ b. Ebî Rebâh": "Ata b. Abi Rabah", "Katâde": "Qatada",
  "Amr b. Dînâr": "Amr b. Dinar", "Ebû İshak es-Sebîî": "Abu Ishaq al-Sabi'i",
  "Yahyâ b. Ebî Kesîr": "Yahya b. Abi Kathir", "A‘meş": "al-A'mash",
  "Mâlik b. Enes": "Malik b. Anas", "İbn Cüreyc": "Ibn Jurayj",
  "Süfyân b. Uyeyne": "Sufyan b. Uyayna", "Süfyân es-Sevrî": "Sufyan al-Thawri",
  "Şu‘be b. el-Haccâc": "Shu'ba b. al-Hajjaj", "Ma‘mer b. Râşid": "Ma'mar b. Rashid",
  "Evzâî": "al-Awza'i", "Hammâd b. Seleme": "Hammad b. Salama",
  "İbn Ebî Arûbe": "Ibn Abi Aruba", "Ebû Avâne": "Abu Awana",
  "Hüşeym b. Beşîr": "Hushaym b. Bashir", "İbn İshak": "Ibn Ishaq",
  "Abdullah b. el-Mübârek": "Abd Allah b. al-Mubarak", "Vekī‘ b. el-Cerrâh": "Waki' b. al-Jarrah",
  "Yahyâ b. Saîd el-Kattân": "Yahya b. Sa'id al-Qattan", "Abdurrahman b. Mehdî": "Abd al-Rahman b. Mahdi",
  "Yahyâ b. Âdem": "Yahya b. Adam", "İbn Ebî Zâide": "Ibn Abi Za'ida",
  "Buhârî": "al-Bukhari", "Müslim b. el-Haccâc": "Muslim b. al-Hajjaj",
  "Ebû Dâvûd es-Sicistânî": "Abu Dawud al-Sijistani", "Tirmizî": "al-Tirmidhi",
  "Nesâî": "al-Nasa'i", "İbn Mâce": "Ibn Maja",
  "Ahmed b. Hanbel": "Ahmad b. Hanbal", "Dârimî": "al-Darimi",
  "Ali b. el-Medînî": "Ali b. al-Madini", "Abdürrezzâk b. Hemmâm": "Abd al-Razzaq b. Hammam",
  "Hemmâm b. Münebbih": "Hammam b. Munabbih", "Ebû Seleme b. Abdirrahman": "Abu Salama b. Abd al-Rahman",
};

export const ING_HARF = [
  [/Ebü'l-/g, "Abu'l-"], [/Ebî'l-/g, "Abi'l-"], [/Ebû/g, "Abu"], [/Ebî/g, "Abi"],
  [/eş-/g, "al-"], [/es-/g, "al-"], [/ed-/g, "al-"], [/et-/g, "al-"], [/ez-/g, "al-"],
  [/en-/g, "al-"], [/er-/g, "al-"], [/el-/g, "al-"], [/ü'l-/g, "u'l-"],
  [/â/g, "a"], [/î/g, "i"], [/û/g, "u"], [/Â/g, "A"], [/Î/g, "I"], [/Û/g, "U"],
  /* `ç` once bir yer tutucuya cekiliyor: Turkce `c` = ج, yani `j`
     olmali; sirasiz yapilirsa `ç`nin urettigi "ch" ikinci adimda
     "jh" olur. */
  [/ç/g, ""], [/Ç/g, ""],
  [/c/g, "j"], [/C/g, "J"],
  [//g, "ch"], [//g, "Ch"],
  [/ş/g, "sh"], [/Ş/g, "Sh"], [/ğ/g, "gh"], [/Ğ/g, "Gh"],
  [/ı/g, "i"], [/İ/g, "I"], [/ö/g, "o"], [/Ö/g, "O"], [/ü/g, "u"], [/Ü/g, "U"],
  [/[‘’]/g, "'"],
];
export const ingAd = (tr) => {
  if (ING_SOZLUK[tr]) return ING_SOZLUK[tr];
  let s = tr;
  for (const [re, x] of ING_HARF) s = s.replace(re, x);
  return s;
};

export const N = (id, ar, tr, tab, olum, belde, not) => {
  const d = DIA[id];
  return { id, ar, tr, tab, olum: d ? d[0] : olum, mil: d ? d[1] : null, belde, not };
};
/* Hicri yildan milâdî yil kestirimi. Hicri yil kamerî oldugu icin
   milâdîye gore her 33 yilda bir yil kayiyor; formul bunu veriyor ve
   sonuc genellikle bir yil hata payinda. */
export const miladiKestirim = (h) => Math.round(622 + h - h / 33);

/* "ö. 40/661" (DIA'dan), "ö. 256/~870" (kestirim) veya "ö. ?/?".

   TILDE BILEREK: 541 ravinin 402'sinde milâdî yil DIA'dan gelmiyor --
   DIA'da mustakil maddesi olmayan tabiin ravileri. Once bu sayfalarda
   "?" yaziyordu, Buhârî gibi temel bir isimde bile (Mustafa fark etti,
   2026-08-29). Bos birakmak yerine kestirim yaziliyor ama tilde ile:
   okuyucu hangi tarihin KAYNAKLI hangisinin HESAPLANMIS oldugunu
   ayirt edebilsin. Bir isme DIA tarihi eklendiginde tilde
   kendiliginden kalkiyor. */
export const tarihYaz = (n, ek = "ö.") => {
  if (n.olum == null) return `${ek} ?/?`;
  return `${ek} ${n.olum}/${n.mil ?? "~" + miladiKestirim(n.olum)}`;
};

export const NODES = [
  N("nebi", "النبي صلى الله عليه وسلم", "Hz. Peygamber", 0, 11, "Medine", "Bütün rivayetin kaynağı. Tehzîb tercemelerinde sahâbenin hocası olarak «روى عن النبي ﷺ» kaydıyla geçer."),
  N("ali", "علي بن أبي طالب", "Ali b. Ebî Tâlib", 1, 40, "Kûfe", "Tehzîb terceme 4089, rumûz ع."),
  N("ebuhureyre", "أبو هريرة الدوسي", "Ebû Hüreyre", 1, 57, "Medine", "Tehzîb terceme 7681. Sahâbenin hâfızı. Mizzî talebeleri arasında 338 isim sayar, Buhârî'den naklen «روى عنه نحو من ثمان مئة رجل أو أكثر» der. Semâ kaydı düşülenler bağ olarak çizilmedi: Zührî «ولم يسمع منه»; Yezîd b. Rûmân ve Mekhûl «مرسل»; Zeyd b. Eslem «قيل لم يسمع منه»."),
  N("ebubekir", "أبو بكر الصديق", "Ebû Bekir es-Sıddîk", 1, 13, "Medine", "Tehzîb'de «عبد الله بن عثمان وهو أبو قحافة» adıyla, bâbü'l-ayn içinde."),
  N("omer", "عمر بن الخطاب", "Ömer b. el-Hattâb", 1, 23, "Medine",
    "Takrîb 4888: «أمير المؤمنين مشهور جم المناقب». Zilhicce 23'te şehid edildi; hilâfeti on buçuk yıl sürdü."),
  N("mikdad", "المقداد بن الأسود", "Mikdâd b. el-Esved", 1, 33, "Medine"),
  N("fatima", "فاطمة بنت رسول الله", "Fâtıma bint Resûlillâh", 1, 11, "Medine", "Mizzî, Hz. Ali’nin hocaları arasında zevcesi olarak zikreder. Kendi tercemesi Kitâbü’n-nisâ’dadır."),
  N("ubey", "أبي بن كعب", "Übey b. Kâ‘b", 1, 30, "Medine",
    "Takrîb 283: «سيد القراء ... من فضلاء الصحابة». Künyesi Ebü'l-Münzir, Ebü't-Tufeyl de denir. Vefat yılında ihtilâf büyük — İbn Hacer 19 ve 32'yi zikredip başka görüşler de olduğunu söyler."),
  N("usame", "أسامة بن زيد", "Üsâme b. Zeyd", 1, 54, "Medine",
    "Takrîb 316: «صحابي مشهور». Hz. Peygamber'in azatlısı Zeyd b. Hârise'nin oğlu; «el-Emîr» diye anılır. Medine'de, yetmiş beş yaşında vefat etti."),
  N("basra", "بصرة بن أبي بصرة الغفاري", "Basra b. Ebû Basra el-Gıfârî", 1, null, "Mısır"),
  N("fadl", "الفضل بن العباس", "Fazl b. Abbâs", 1, 18, "Medine"),
  N("kabahbar", "كعب الأحبار", "Kâ‘bü'l-ahbâr", 1, 32, "Humus"),
  N("aise", "عائشة أم المؤمنين", "Âişe bint Ebî Bekir", 1, 58, "Medine",
    "Takrîb 8633: «أفقه النساء مطلقا وأفضل أزواج النبي ﷺ إلا خديجة ففيهما خلاف شهير». Sahih olan görüşe göre 57'de vefat etti."),
  N("enes", "أنس بن مالك", "Enes b. Mâlik", 1, 93, "Basra",
    "Takrîb 565: «خادم رسول الله ﷺ خدمه عشر سنين». Vefatı 92, bir görüşe göre 93; yüzü aşkın yaşadı."),
  N("cabir", "جابر بن عبد الله", "Câbir b. Abdullah", 1, 78, "Medine",
    "Takrîb 871: «صحابي ابن صحابي غزا تسع عشرة غزوة». Medine'de yetmişten sonra, doksan dört yaşında vefat etti."),

  /* 150 LISTESINDEN EKSIK KALAN SAHABILER (2026-09-03).

     Bu dokuzu "hadis rivayet ilminde en onemli 150 isim" listesinde
     olduklari halde tabloda hic yoktu. Bir ismi haritaya nokta olarak
     koymak belde, vefat yili ve tabaka ister; ucu de kendi
     tercemesinden geliyor, o yuzden hepsi Tehzib'den acildi. */
  N("ebuzer", "أبو ذر الغفاري", "Ebû Zer el-Gıfârî", 1, 32, "Medine",
    "Tehzîb terceme 7351. Meşhur kavle göre adı Cündüb b. Cünâde; Mizzî isminde ve babasının adında büyük ihtilâf olduğunu söyleyip yedi görüş sayar."),
  N("selmanfarisi", "سلمان الفارسي", "Selmân-ı Fârisî", 1, 36, "Kûfe",
    "Tehzîb terceme 2438; Mizzî'de «سلمان الخير الفارسي». Aslen İsfahanlı, bir görüşe göre Râmhürmüzlü. Medine'ye hicretle müslüman oldu, ilk gazvesi Hendek. Medâin'de vefat etti — sütun olarak en yakın belde Kûfe alındı."),
  N("ubadesamit", "عبادة بن الصامت", "Ubâde b. es-Sâmit", 1, 34, "Şam",
    "Tehzîb terceme 3107. Akabe'nin on iki nakibinden; Bedir'de ve bütün gazvelerde bulundu. Medineli hazrecî iken Şam'a yerleşti."),
  N("ebueyyub", "أبو أيوب الأنصاري", "Ebû Eyyûb el-Ensârî", 1, 52, "Medine",
    "Tehzîb terceme 1612, adı Hâlid b. Zeyd b. Küleyb. Hicrette Hz. Peygamber'i evinde ağırladı. Muâviye devrinde Rum diyarında gazâ ederken vefat etti; kabri Kostantiniyye surunun dibinde."),
  N("ebukatade", "أبو قتادة الأنصاري", "Ebû Katâde el-Ensârî", 1, 54, "Medine",
    "Tehzîb terceme 7574. Meşhur kavle göre adı el-Hâris b. Rib‘î. Mizzî onu «صاحب رسول الله ﷺ وفارسه» diye tanıtır."),
  N("ebubekre", "أبو بكرة الثقفي", "Ebû Bekre es-Sekafî", 1, 52, "Basra",
    "Tehzîb terceme 6465, adı Nüfey‘ b. el-Hâris. Tâif kuşatmasında surdan bir makarayla (bekre) indiği için bu künyeyle anılır; Hz. Peygamber o gün onu âzat etti."),
  N("vasile", "واثلة بن الأسقع", "Vâsile b. el-Eska‘", 1, 85, "Şam",
    "Tehzîb terceme 6659. Ashâb-ı Suffe'den; Tebük hazırlığı sırasında müslüman oldu, sonra Şam'a yerleşti ve Beytülmakdis'te vefat etti."),
  N("ummuseleme", "أم سلمة", "Ümmü Seleme", 1, 59, "Medine",
    "Tehzîb terceme 7941, adı Hind bint Ebî Ümeyye. Mizzî Vâkıdî'den şevval 59'da vefat ettiğini nakleder; İbn Hacer bu tarihi Müslim'deki bir rivayete dayanarak reddeder."),
  N("esmaebubekir", "أسماء بنت أبي بكر", "Esmâ bint Ebî Bekir", 1, 73, "Mekke",
    "Tehzîb terceme 7780. «Zâtü'n-nitâkayn»; Zübeyr b. el-Avvâm'ın zevcesi, Abdullah b. ez-Zübeyr'in annesi."),

  /* 150 LISTESINDEN EKSIK KALAN ALTI TABIIN/ATBA RAVISI (2026-09-03).

     Ustteki dokuz sahabiyle ayni sebeple eklendiler. Ucu Zuhri'nin
     "en saglam ravileri" diye sayilan halkadan (Ukayl, Yunus b. Yezid,
     Ibn Ebi Zi'b), ikisi Buhari'nin hocasi, biri fukaha-i seb'adan. */
  N("ebubekirabdrahman", "أبو بكر بن عبد الرحمن بن الحارث", "Ebû Bekir b. Abdirrahman", 3, 94, "Medine",
    "Tehzîb terceme 7243. Medine'nin yedi fakihinden (fukahâ-i seb‘a). Mizzî'ye göre adı ile künyesi aynı; «râhibü Kureyş» diye anılırdı, gözleri görmezdi."),
  N("ukaylhalid", "عقيل بن خالد", "Ukayl b. Hâlid el-Eylî", 5, 144, "Mısır",
    "Tehzîb terceme 4001. Hz. Osman'ın mevlâsı. İbn Maîn'e göre Zührî'den rivayette en sağlamlar Mâlik, Ma‘mer, sonra Ukayl'dir."),
  N("yunusyezid", "يونس بن يزيد الأيلي", "Yûnus b. Yezîd el-Eylî", 5, 159, "Mısır",
    "Tehzîb terceme 7188. Zührî'ye on iki (bir görüşe göre on dört) yıl arkadaşlık etti; İbn Maîn onu Zührî'nin en sağlam râvileri arasında sayar."),
  N("ibnebizib", "محمد بن عبد الرحمن بن أبي ذئب", "İbn Ebî Zi’b", 5, 159, "Medine",
    "Tehzîb terceme 5408. Ahmed b. Hanbel onu Saîd b. el-Müseyyeb'e benzetir ve «Mâlik'ten üstün, ancak Mâlik ricâli daha iyi eler» der. Zührî'den semâı tartışmalı: İbn Maîn arz/münâvele olduğunu söyler, Ahmed işittiğini savunur."),
  N("humeydi", "عبد الله بن الزبير الحميدي", "Humeydî", 5, 219, "Mekke",
    "Tehzîb terceme 3270. Ahmed b. Hanbel «bize göre imamdır» der; Ebû Hâtim'e göre İbn Uyeyne'nin en sağlam râvisi ve ashabının reisi. Buhârî'nin hocası."),
  N("suleymanharb", "سليمان بن حرب", "Süleymân b. Harb", 5, 224, "Basra",
    "Tehzîb terceme 2502. Mekke'ye yerleşti ve orada kadılık yaptı. Ebû Hâtim onu «tedlîs yapmayan bir imam» sayar ve Affân'dan aşağı görmez."),
  N("ibnabbas", "عبد الله بن عباس", "Abdullah b. Abbâs", 1, 68, "Mekke",
    "Takrîb 3409: Hz. Peygamber ona Kur'an'ı anlama duası etti, ilminin genişliği sebebiyle «البحر» ve «الحبر» diye anılırdı. Hz. Ömer: «لو أدرك ابن عباس أسناننا ما عشره منا أحد». Müksirûndan ve abâdileden; 68'de Tâif'te vefat etti."),
  N("ibnomer", "عبد الله بن عمر", "Abdullah b. Ömer", 1, 73, "Medine",
    "Takrîb 3490: «أحد المكثرين من الصحابة والعبادلة وكان من أشد الناس اتباعا للأثر». 73'ün sonunda ya da 74'ün başında vefat etti."),
  N("ibnmesud", "عبد الله بن مسعود", "Abdullah b. Mes‘ûd", 1, 32, "Kûfe", "Mizzî onu Ali'nin talebeleri arasında sayarken «ومات قبله» kaydını düşer. Rivayet yönü tartışmalı."),
  N("ibnzubeyr", "عبد الله بن الزبير", "Abdullah b. ez-Zübeyr", 1, 73, "Mekke"),
  N("bera", "البراء بن عازب", "Berâ b. Âzib", 1, 72, "Kûfe",
    "Takrîb 648: «صحابي ابن صحابي نزل الكوفة». Bedir'de küçük görülüp geri çevrildi. İbn Hacer «وكان هو وابن عمر لدة» der — İbn Ömer'le yaşıttılar. Takrîb'de vefatı 72."),
  N("zeydarkam", "زيد بن أرقم", "Zeyd b. Erkam", 1, 68, "Kûfe"),
  N("cabirsemura", "جابر بن سمرة", "Câbir b. Semüre", 1, 74, "Kûfe",
    "Sahâbî ve sahâbî oğlu; Sa'd b. Ebî Vakkās'ın kız kardeşinin oğludur. Kûfe'ye yerleşti ve orada vefat etti. Kütüb-i Sitte'nin altısı da ondan rivayet eder. Hz. Peygamber'in namaz kılışını, hutbesini ve şemâilini anlatan rivayetleriyle tanınır. 70'ten sonra vefat etti."),
  N("suhayb", "صهيب بن سنان الرومي", "Suheyb b. Sinân er-Rûmî", 1, 38, "Medine"),
  N("sefine", "سفينة مولى رسول الله", "Sefîne mevlâ Resûlillâh", 1, null, "Medine"),
  N("hasanbali", "الحسن بن علي", "Hasan b. Ali", 1, 50, "Medine",
    "Hz. Peygamber'in torunu ve reyhânı; Hz. Ali ile Hz. Fâtıma'nın büyük oğlu. Dedesine yetişip ondan hadis belledi. Babasının şehâdetinden sonra hilâfet kendisine bey'at edildi, ancak Müslümanlar arasındaki kan dökülmesini durdurmak için altı ay sonra Muâviye lehine feragat etti; bu sebeple o yıl \"Cemâat yılı\" diye anıldı. Dört Sünen ondan rivayet eder. 49 (bir rivayete göre 50) yılında, kırk yedi yaşında vefat etti."),
  N("huseyn", "الحسين بن علي", "Hüseyin b. Ali", 1, 61, "Medine",
    "Hz. Peygamber'in torunu ve reyhânı; Hz. Ali ile Hz. Fâtıma'nın küçük oğlu. Dedesine yetişip ondan hadis belledi. Yezîd b. Muâviye'ye bey'atı reddedip Kûfelilerin davetiyle Irak'a yöneldi ve Kerbelâ'da, 61 yılı Muharrem'inin onunda (Âşûrâ günü) ailesinden pek çok kişiyle birlikte şehid edildi; elli altı yaşındaydı. Kütüb-i Sitte'nin altısı da ondan rivayet eder."),
  N("amrhurays", "عمرو بن حريث المخزومي", "Amr b. Hurays", 1, 85, "Kûfe"),
  N("tariksihab", "طارق بن شهاب الأحمسي", "Târık b. Şihâb el-Ahmesî", 1, 83, "Kûfe"),
  N("besrsuhaym", "بشر بن سحيم الغفاري", "Bişr b. Süheym el-Gıfârî", 1, null, "Medine"),
  N("ibncafer", "عبد الله بن جعفر", "Abdullah b. Ca‘fer", 1, 80, "Medine"),

  N("ahnef", "الأحنف بن قيس", "Ahnef b. Kays", 2, 72, "Basra",
    "Takrîb 288: «مخضرم ثقة». Asıl adı Dahhâk, bir görüşe göre Sahr; Ahnef lakabı. İbn Hacer vefatı için 67 ve 72'yi anar."),
  N("esvedyezid", "الأسود بن يزيد النخعي", "Esved b. Yezîd en-Nehaî", 2, 75, "Kûfe",
    "Kûfeli muhadram râvi ve fakih. İbn Hacer onu \"sika, çok rivayet eden, fakih\" diye niteler ve ikinci tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Hz. Âişe ve İbn Mes'ûd'dan gelen rivayetleriyle Kûfe fıkhının teşekkülünde etkili olmuştur. 75 (veya 74) yılında vefat etti."),
  N("alkame", "علقمة بن قيس النخعي", "Alkame b. Kays en-Nehaî", 2, 62, "Kûfe", "Kûfe fıkıh ekolünün temel halkası."),
  N("ubeydesel", "عبيدة السلماني", "Ubeyde es-Selmânî", 2, 72, "Kûfe"),
  N("suveydgafle", "سويد بن غفلة الجعفي", "Süveyd b. Gafele", 2, 80, "Kûfe"),
  N("ebuvail", "أبو وائل شقيق بن سلمة", "Ebû Vâil Şakīk b. Seleme", 2, 82, "Kûfe"),
  N("zirhubeys", "زر بن حبيش الأسدي", "Zir b. Hubeyş el-Esedî", 2, 82, "Kûfe"),
  N("sureyh", "شريح بن الحارث القاضي", "Şüreyh b. el-Hâris el-Kādî", 2, 78, "Kûfe"),
  N("saidmusayyeb", "سعيد بن المسيب", "Saîd b. el-Müseyyeb", 2, 94, "Medine", "Hem Ali'den hem Ebû Hüreyre'den rivayeti var."),
  N("hasanbasri", "الحسن البصري", "Hasan-ı Basrî", 2, 110, "Basra", "İki merkezden de rivayeti var. Ali'den ت س, Ebû Hüreyre'den خ ٤."),
  N("rebihiras", "ربعي بن حراش", "Rib‘î b. Hırâş", 2, 100, "Kûfe"),
  N("zeydvehb", "زيد بن وهب الجهني", "Zeyd b. Vehb el-Cühenî", 2, 96, "Kûfe"),
  N("zadan", "زاذان أبو عمر الكندي", "Zâzân Ebû Ömer el-Kindî", 2, 82, "Kûfe"),
  N("ebutufeyl", "أبو الطفيل عامر بن واثلة", "Ebü't-Tufeyl Âmir b. Vâsile", 2, 110, "Mekke", "Son vefat eden sahâbî sayılır, tabakası ihtilâflı."),
  N("harissuveyd", "الحارث بن سويد التيمي", "Hâris b. Süveyd et-Teymî", 2, 72, "Kûfe",
    "Kûfeli tâbiîn râvisi, künyesi Ebû Âişe. İbn Hacer onu \"sika, sebt\" diye niteler ve ikinci tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Abdullah b. Mes'ûd ve Hz. Ali'den aldığı rivayetlerle Kûfe'nin en erken tabaka râvilerindendir. 70'ten sonra vefat etti."),
  N("harisemudarrib", "حارثة بن مضرب", "Hârise b. Mudarrib", 2, null, "Kûfe",
    "Kûfeli tâbiîn râvisi. İbn Hacer onu \"sika\" sayar ve ikinci tabakadan gösterir; Buhârî el-Edebü'l-müfred'de, dört Sünen ise doğrudan ondan rivayet eder. Hz. Ali ve Abdullah b. Mes'ûd'dan aldığı rivayetlerle bilinir. İbn Hacer, İbnü'l-Medînî'nin onu terk ettiği yolundaki nakli açıkça hatalı bulur."),
  N("salimcad", "سالم بن أبي الجعد", "Sâlim b. Ebü'l-Ca‘d", 2, 100, "Kûfe", "Mizzî: Ali'ye yetişmedi («ولم يدركه»)."),
  N("hayseme", "خيثمة بن عبد الرحمن", "Hayseme b. Abdurrahman", 2, 80, "Kûfe"),
  N("ibrhunayn", "إبراهيم بن عبد الله بن حنين", "İbrâhim b. Abdillâh b. Huneyn", 2, null, "Medine", "Ali'den rivayeti mürseldir."),
  N("abdhayr", "عبد خير بن يزيد الهمداني", "Abd-i Hayr el-Hemdânî", 2, null, "Kûfe"),
  N("harisaver", "الحارث الأعور الهمداني", "Hâris el-A‘ver el-Hemdânî", 2, 65, "Kûfe", "Cerh açısından tartışmalı, Ali rivayetlerinin yoğun râvisi."),
  N("asimdamra", "عاصم بن ضمرة السلولي", "Âsım b. Damra es-Selûlî", 2, 74, "Kûfe"),
  N("salimibnomer", "سالم بن عبد الله بن عمر", "Sâlim b. Abdillâh b. Ömer", 2, 106, "Medine",
    "Takrîb 2176: «أحد الفقهاء السبعة وكان ثبتا عابدا فاضلا كان يشبه بأبيه في الهدي والسمت». Medine'nin yedi fakihinden; sahih olan görüşe göre 106'nın sonunda vefat etti."),
  N("humeydavf", "حميد بن عبد الرحمن بن عوف", "Humeyd b. Abdirrahman b. Avf", 2, 105, "Medine",
    "Medineli tâbiîn râvisi; sahâbî Abdurrahman b. Avf'ın oğludur. İbn Hacer onu \"sika\" sayar ve ikinci tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Ebû Hüreyre, Ebû Saîd el-Hudrî ve Muâviye'den aldığı rivayetlerle Medine'nin erken dönem râvilerindendir; İbn Hacer, Hz. Ömer'den yaptığı rivayetin mürsel olduğunun söylendiğini de kaydeder. Takrîb'e göre en sahih rivayette 105 yılında vefat etti."),
  N("hafsasim", "حفص بن عاصم بن عمر", "Hafs b. Âsım b. Ömer", 2, null, "Medine",
    "Medineli tâbiîn râvisi; Hz. Ömer'in torununun oğlu, yani Abdullah b. Ömer'in kardeşinin oğludur. İbn Hacer onu \"sika\" sayar ve üçüncü tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Amcası İbn Ömer ile Ebû Hüreyre'den aldığı rivayetlerle Ömer ailesinin hadis birikimini taşıyan isimlerdendir."),
  N("zurareevfa", "زرارة بن أوفى", "Zürâre b. Evfâ", 2, 93, "Basra"),
  N("busrsaid", "بسر بن سعيد", "Büsr b. Saîd", 2, 100, "Medine",
    "Medineli tâbiîn râvisi, zâhidliğiyle tanınır. İbn Hacer onu \"sika, celîl\" diye niteler ve ikinci tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Ebû Hüreyre, Zeyd b. Sâbit ve Sa'd b. Ebî Vakkās'tan aldığı rivayetlerle Medine'nin erken dönem hadis birikiminin taşıyıcılarındandır. 100 yılında vefat etti."),
  N("besirnehik", "بشير بن نهيك", "Beşîr b. Nehîk", 2, null, "Basra",
    "Basralı tâbiîn râvisi, künyesi Ebü'ş-Şa'sâ. İbn Hacer onu \"sika\" sayar ve üçüncü tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Ebû Hüreyre'den yaptığı rivayetlerle tanınır; onun Ebû Hüreyre'den yazdığı nüsha, erken dönemde hadisin kitâbetine dair bilinen örneklerdendir."),
  N("esvedhilal", "الأسود بن هلال المحاربي", "Esved b. Hilâl el-Muhâribî", 2, 84, "Kûfe",
    "Kûfeli muhadram râvi; Câhiliye devrine yetişmiş, fakat Hz. Peygamber'i görememiştir. İbn Hacer onu \"sika, celîl\" diye niteler ve ikinci tabakadan sayar. Buhârî, Müslim, Ebû Dâvûd ve Nesâî ondan rivayet eder. 84'te vefat etti."),
  N("hilas", "خلاس الهجري", "Hılâs el-Hecerî", 2, null, "Basra"),
  N("bece", "بعجة بن عبد الله الجهني", "Ba‘ce b. Abdillâh el-Cühenî", 2, 100, "Medine",
    "Medineli tâbiîn râvisi, Cühenî nisbesiyle bilinir. İbn Hacer onu \"sika\" sayar ve üçüncü tabakadan gösterir; Buhârî, Müslim, Ebû Dâvûd, Tirmizî, Nesâî ve İbn Mâce ondan rivayet eder. Ebû Hüreyre'den ve babası Abdullah b. Bedr yoluyla Ukbe b. Âmir'den gelen rivayetleriyle tanınır. 100 yılı dolaylarında vefat etti."),

  N("sabi", "عامر بن شراحيل الشعبي", "Âmir b. Şerâhîl eş-Şa‘bî", 3, 104, "Kûfe",
    "Takrîb 3092: «ثقة مشهور فقيه فاضل من الثالثة». Mekhûl onun için «ما رأيت أفقه منه» demiş. Yüzden sonra, seksen yaşlarında vefat etti."),
  N("ibnebileyla", "عبد الرحمن بن أبي ليلى", "Abdurrahman b. Ebî Leylâ", 3, 83, "Kûfe"),
  N("urve", "عروة بن الزبير", "Urve b. ez-Zübeyr", 3, 94, "Medine", "Zührî'nin başlıca hocası; Medine'nin yedi fakihinden."),
  N("ikrime", "عكرمة مولى ابن عباس", "İkrime mevlâ İbn Abbâs", 3, 105, "Medine"),
  N("zeynelabidin", "علي بن الحسين", "Ali b. el-Hüseyin (Zeynelâbidîn)", 3, 94, "Medine", "Ali'den rivayeti mürseldir."),
  N("ubeydullaherafi", "عبيد الله بن أبي رافع", "Ubeydullah b. Ebî Râfi‘", 3, null, "Medine", "Hz. Ali'nin kâtibi («وكان كاتبه»)."),
  N("umerbali", "عمر بن علي بن أبي طالب", "Ömer b. Ali b. Ebî Tâlib", 3, 77, "Medine"),
  N("abdrahmanharis", "عبد الرحمن بن الحارث بن هشام", "Abdurrahman b. el-Hâris", 3, null, "Medine"),
  N("ubeydumeyr", "عبيد بن عمير الليثي", "Ubeyd b. Umeyr el-Leysî", 3, 74, "Mekke",
    "Takrîb 4385: Müslim'e göre Hz. Peygamber döneminde doğdu; başkaları onu kibâr-ı tâbiînden sayar. «وكان قاص أهل مكة مجمع على ثقته» — Mekke'nin kıssacısı, sikalığında ittifak var. İbn Ömer'den önce vefat etti."),
  N("saidzuhadan", "سعيد بن ذي حدان", "Saîd b. Zî Hudân", 3, null, "Kûfe"),

  N("zeydsabit", "زيد بن ثابت", "Zeyd b. Sâbit", 1, 45, "Medine", "Ebû Bekir'den rivayeti رمز خ ت س."),
  N("kayshazim", "قيس بن أبي حازم", "Kays b. Ebû Hâzim", 2, 97, "Kûfe"),
  N("abdrahmanebubekir", "عبد الرحمن بن أبي بكر", "Abdurrahman b. Ebî Bekir", 1, 53, "Medine", "Hz. Ebû Bekir'in oğlu."),
  N("abdrahmanavf", "عبد الرحمن بن عوف", "Abdurrahman b. Avf", 1, 32, "Medine"),
  N("osman", "عثمان بن عفان", "Osman b. Affân", 1, 35, "Medine",
    "Takrîb 4503: «أمير المؤمنين ذو النورين أحد السابقين الأولين والخلفاء الأربعة والعشرة المبشرة». Zilhicce 35'te, kurban bayramının ardından şehid edildi; hilâfeti on iki yıl sürdü."),
  N("ukbeamir", "عقبة بن عامر الجهني", "Ukbe b. Âmir el-Cühenî", 1, 58, "Mısır"),
  N("ebumusa", "أبو موسى الأشعري", "Ebû Mûsâ el-Eş‘arî", 1, 42, "Kûfe",
    "Takrîb 3542: «صحابي مشهور». Hz. Ömer, ardından Hz. Osman onu vali tayin etti; Sıffîn'de iki hakemden biriydi. 50'de ya da sonrasında vefat etti."),
  N("ebusaid", "أبو سعيد الخدري", "Ebû Saîd el-Hudrî", 1, 74, "Medine",
    "Takrîb 2253: «له ولأبيه صحبة واستصغر بأحد ثم شهد ما بعدها وروى الكثير». Uhud'da küçük görülüp geri çevrildi, sonraki bütün gazvelerde bulundu. Vefatında ihtilâf var — 63, 64, 65 ya da 74."),
  N("huzeyfe", "حذيفة بن اليمان", "Huzeyfe b. el-Yemân", 1, 36, "Kûfe",
    "Takrîb 1156: «صحابي جليل من السابقين». İbn Hacer Müslim'deki sahih rivayete dayanarak Hz. Peygamber'in ona «ما كان وما يكون إلى أن تقوم الساعة» bilgisini verdiğini kaydeder — fiten rivayetlerinin ondan gelmesinin sebebi budur. Babası da sahâbî, Uhud'da şehid oldu. Hz. Ali'nin hilâfetinin başında, 36'da vefat etti."),
  N("ebusalih", "أبو صالح ذكوان السمان", "Ebû Sâlih Zekvân es-Semmân", 2, 101, "Medine", "Mizzî: Ebû Bekir'e yetişmedi («ولم يدركه»)."),
  N("rifaazuraki", "رفاعة بن رافع الزرقي", "Rifâa b. Râfi‘ ez-Zürakī", 1, null, "Medine"),
  N("aizamr", "عائذ بن عمرو المزني", "Âiz b. Amr el-Müzenî", 1, null, "Basra"),
  N("murreserahil", "مرة بن شراحيل", "Mürre b. Şerâhîl", 2, null, "Kûfe"),
  N("abdrahmanyerbu", "عبد الرحمن بن يربوع", "Abdurrahman b. Yerbû‘", 2, null, "Medine"),
  N("abdrahmanabza", "عبد الرحمن بن أبزى", "Abdurrahman b. Ebzâ", 1, null, "Kûfe"),
  N("eslem", "أسلم مولى عمر", "Eslem mevlâ Ömer", 2, null, "Medine", "Hz. Ömer'in mevlâsı. Rumûz ع."),
  N("esaskays", "الأشعث بن قيس", "Eş‘as b. Kays el-Kindî", 1, 40, "Kûfe",
    "Kinde kabilesinin reisi ve sahâbî. Heyetiyle birlikte Medine'ye gelip İslâm'a girdi; Hz. Peygamber'in vefatından sonraki karışıklıklarda irtidad edenler arasında yer aldıysa da Hz. Ebû Bekir'e teslim olarak İslâm'a döndü. Sonradan Kûfe'ye yerleşti ve fetihlere katıldı. Kütüb-i Sitte'nin altısı da ondan rivayet eder. 40 (veya 41) yılında, altmış üç yaşında vefat etti."),
  N("cerirbecelî", "جرير بن عبد الله البجلي", "Cerîr b. Abdillâh el-Becelî", 1, 51, "Kûfe",
    "Sahâbî; Becîle kabilesinin reisi. Hz. Peygamber'in vefatından kısa süre önce Müslüman oldu ve ona İslâm üzere bey'at etti; \"nasihat bey'ati\" diye bilinen rivayet ondan gelir. Sonradan Kûfe'ye yerleşti, İran fetihlerinde görev aldı. Kütüb-i Sitte'nin altısı da ondan rivayet eder. 51 yılında (bir rivayete göre daha sonra) vefat etti."),
  N("saibyezid", "السائب بن يزيد", "Sâib b. Yezîd", 1, null, "Medine"),
  N("sadvakkas", "سعد بن أبي وقاص", "Sa‘d b. Ebî Vakkās", 1, 55, "Medine", "Aşere-i mübeşşereden."),
  N("talha", "طلحة بن عبيد الله", "Talha b. Ubeydillâh", 1, 36, "Medine", "Aşere-i mübeşşereden."),
  N("abisrebia", "عابس بن ربيعة النخعي", "Âbis b. Rebîa en-Nehaî", 2, null, "Kûfe"),
  N("asimomer", "عاصم بن عمر بن الخطاب", "Âsım b. Ömer b. el-Hattâb", 1, 70, "Medine", "Hz. Ömer'in oğlu."),
  N("ebanosman", "أبان بن عثمان بن عفان", "Ebân b. Osman b. Affân", 3, 105, "Medine", "Hz. Osman'ın oğlu."),
  N("mervan", "مروان بن الحكم", "Mervân b. el-Hakem", 1, null, "Medine"),
  N("ibnhanefiyye", "محمد بن علي ابن الحنفية", "Muhammed b. Ali İbnü'l-Hanefiyye", 2, 81, "Medine"),
  N("malikevs", "مالك بن أوس بن الحدثان", "Mâlik b. Evs b. el-Hadesân", 2, null, "Medine"),
  N("ataebirebah", "عطاء بن أبي رباح", "Atâ b. Ebî Rebâh", 3, 114, "Mekke", "Mizzî: Hz. Osman'dan semâı yok («ولم يسمع منه»)."),
  N("hamranaban", "حمران بن أبان", "Humrân b. Ebân", 2, null, "Basra", "Hz. Osman'ın mevlâsı. Rumûz ع."),
  N("ebuabdrahmansulemi", "أبو عبد الرحمن السلمي", "Ebû Abdirrahman es-Sülemî", 2, 73, "Kûfe", "Rumûz خ ٤."),
  N("abdrahmanyezidnehai", "عبد الرحمن بن يزيد النخعي", "Abdurrahman b. Yezîd en-Nehaî", 2, null, "Kûfe"),
  N("mugirasube", "المغيرة بن شعبة", "Mugīre b. Şu‘be", 1, 50, "Kûfe",
    "Takrîb 6840: «صحابي مشهور أسلم قبل الحديبية وولي إمرة البصرة ثم الكوفة». Sahih olan görüşe göre 50'de vefat etti."),
  N("imranhusayn", "عمران بن حصين", "İmrân b. Husayn", 1, 52, "Basra",
    "Takrîb 5150: Hayber yılı müslüman oldu, sohbete erdi. «وكان فاضلا وقضى بالكوفة» — Kûfe'de kadılık yaptı, 52'de Basra'da vefat etti."),
  /* Dort sahabi 2026-08-30'da eklendi. Kaynak Ibn Hacer, Takribu't-Tehzib
     (Samile 8609): kisa ve formullu oldugu icin tabaka, vefat yili ve
     rumuzu bir arada veriyor. */
  N("abdullahamr", "عبد الله بن عمرو بن العاص", "Abdullah b. Amr b. el-Âs", 1, 63, "Mekke",
    "Takrîb 3499: «أحد السابقين المكثرين من الصحابة وأحد العبادلة الفقهاء». İbn Hacer vefatını Harre gecelerine, yerini de tercihen Tâif'e koyar; ağda Tâif sütunu olmadığı için Mekke'ye kondu."),
  N("muazcebel", "معاذ بن جبل", "Muâz b. Cebel", 1, 18, "Şam",
    "Takrîb 6725: «كان إليه المنتهى في العلم بالأحكام والقرآن». Şam'da vefat etti."),
  N("ebudderda", "عويمر بن زيد أبو الدرداء", "Ebü'd-Derdâ", 1, 32, "Şam",
    "Takrîb 5228: «صحابي جليل ... وكان عابدا». Vefatı Hz. Osman'ın hilâfetinin sonlarında; Dımaşk kadılığı sebebiyle Şam sütununda."),
  N("sehlsad", "سهل بن سعد الساعدي", "Sehl b. Sa‘d es-Sâidî", 1, 88, "Medine",
    "Takrîb 2658: «له ولأبيه صحبة». Medine'de en son vefat eden sahâbîlerden, yüzü aşkın yaşadı."),
  N("selemeekva", "سلمة بن الأكوع", "Seleme b. el-Ekva‘", 1, 74, "Medine"),
  N("zeydhalid", "زيد بن خالد الجهني", "Zeyd b. Hâlid el-Cühenî", 1, null, "Medine"),
  N("ebuumame", "أبو أمامة الباهلي", "Ebû Ümâme el-Bâhilî", 1, null, "Humus"),

  // ---- Ali b. el-Medini'nin I. tabakasi: mudevvinler ----
  N("ibnsihab", "محمد بن مسلم بن شهاب الزهري", "İbn Şihâb ez-Zührî", 4, 124, "Medine", "Tehzîb 5606. İbnü'l-Medînî'nin isnâd medârlarından, Medine'nin medârı. Mizzî başlıkta «Ebû Bekir el-Medenî, sekene'ş-Şâm» der, yani Medineli olup Şam'a yerleşmiştir; ağda talebe halkasının ağırlığı sebebiyle Medine sütunundadır. Mizzî, İbn Ömer'den semâı hakkında İbn Ma‘în, Ahmed ve Ebû Hâtim'in menfi kayıtlarını nakleder."),
  N("amrdinar", "عمرو بن دينار", "Amr b. Dînâr", 4, 126, "Mekke", "Mekke'nin medârı. Mizzî, İbnü'l-Medînî'den şunu nakleder: «Amr b. Dînâr Zührî'den yaşlıydı, Câbir'den işitti, Zührî ise işitmedi.»"),
  N("yahyaebikesir", "يحيى بن أبي كثير", "Yahyâ b. Ebî Kesîr", 4, 129, "Basra", "Basra'nın iki medârından biri."),
  N("katade", "قتادة بن دعامة السدوسي", "Katâde b. Diâme es-Sedûsî", 4, 117, "Basra", "İbnü'l-Medînî, el-İlel: «ve li-ehli'l-Basra Katâde b. Diâme es-Sedûsî, künyesi Ebû'l-Hattâb, 117'de vefat etti.»"),
  N("ebuishaksebii", "أبو إسحاق السبيعي", "Ebû İshak es-Sebîî", 4, 127, "Kûfe", "Kûfe'nin iki medârından biri."),
  N("amess", "سليمان بن مهران الأعمش", "A‘meş", 5, 148, "Kûfe", "Kûfe'nin iki medârından biri."),

  // ---- II. tabaka: musannifler ----
  N("malik", "مالك بن أنس", "Mâlik b. Enes", 5, 179, "Medine", "İbnü'l-Medînî: «Sonra bu altısının ilmi tasnif sahiplerine geçti, Medine'de Mâlik b. Enes...»"),
  N("ibnishak", "محمد بن إسحاق بن يسار", "Muhammed b. İshak", 5, 151, "Medine", "Megâzî imâmı. Mizzî, tercemesinde İbnü'l-Medînî'nin sözünü aynen nakleder: altının ilmi on iki kişiye geçti, biri Muhammed b. İshak'tır. Zührî onun için «Medine'de İbn İshak bulunduğu sürece büyük ilim eksilmez» der."),
  N("ibncureyc", "ابن جريج", "İbn Cüreyc", 5, 150, "Mekke",
    "Takrîb 4193: «ثقة فقيه فاضل وكان يدلس ويرسل». Tedlîs ve irsâl kaydı İbn Hacer'in kendi ifadesi. 150'de ya da sonrasında vefat etti."),
  N("ibnuyeyne", "سفيان بن عيينة", "Süfyân b. Uyeyne", 5, 198, "Mekke", "Tehzîb 5606'da Zührî'nin talebeleri arasında, rumûz ع."),
  N("ibnebiaruba", "سعيد بن أبي عروبة", "İbn Ebî Arûbe", 5, 156, "Basra", "Katâde'nin en sağlam talebelerinden. Mizzî, ihtilât kaydını nakleder: 145'ten sonra karıştırdı, İbn Ma‘în'e göre 142'den önce işitenin semâı sahih, sonrakiler değil."),
  N("hammadseleme", "حماد بن سلمة", "Hammâd b. Seleme", 5, 167, "Basra", "Basra'nın dört medârından. Mizzî, İbn Cüreyc ve İbn İshak için «ve hüve min şuyûhihî», Mâlik için «min akrânihî» kaydını düşer."),
  N("ebuavane", "الوضاح بن عبد الله اليشكري", "Ebû Avâne el-Vâsıtî", 5, 176, "Basra", "Vâsıt asıllı, Basra'ya yerleşti. Mizzî: Şu‘be ondan rivayet etti ve ondan önce vefat etti."),
  N("sube", "شعبة بن الحجاج", "Şu‘be b. el-Haccâc", 5, 160, "Basra",
    "Takrîb 2790: Sevrî onun için «أمير المؤمنين في الحديث» derdi. İbn Hacer «أول من فتش بالعراق عن الرجال وذب عن السنة» kaydını düşer — Irak'ta ricâli ilk tetkik eden odur."),
  N("mamer", "معمر بن راشد", "Ma‘mer b. Râşid", 5, 153, "Yemen", "İbnü'l-Medînî, el-İlel: «künyesi Ebû Urve, Haddânî'nin mevlâsı, Yemen'de 154'te vefat etti, İbn Şihâb'dan işitti.» Vefat yılında kaynaklar arasında ihtilâf var."),
  N("sevri", "سفيان الثوري", "Süfyân es-Sevrî", 5, 161, "Kûfe",
    "Takrîb 2445: «ثقة حافظ فقيه عابد إمام حجة من رؤوس الطبقة السابعة وكان ربما دلس». Altmış dört yaşında vefat etti."),
  N("evzai", "الأوزاعي", "Evzâî", 5, 157, "Şam", "Şam'ın imâmı. Mizzî, Dârekutnî ve İbn Ma‘în'den şu kayıtları nakleder: Atâ’dan rivayeti mürseldir, İbn Sîrîn'i hastalığında ziyaret etti fakat ondan işitmedi, Nâfi‘den de işitmedi."),
  N("huseym", "هشيم بن بشير", "Hüşeym b. Beşîr", 5, 183, "Vâsıt", "Tedlîsiyle bilinir. Mizzî'nin naklettikleri: Eyyûb'dan yalnız bir hadis işitti (İbn Ma‘în), Hâlid el-Hazzâ ve Mugīre'den hiç işitmedi (Ahmed b. Hanbel), Mücâlid'den hiçbir şey işitmedi, Zâzân'dan tedlîs yaptı."),

  // ---- III. tabaka: munekkit ve fakih muhaddisler ----
  N("yahyaadem", "يحيى بن آدم بن سليمان", "Yahyâ b. Âdem", 5, 203, "Kûfe", "Ali b. el-Medînî: «Allah Yahyâ b. Âdem'e rahmet etsin, ne ilim vardı onda.» Ebû Dâvûd: «Yahyâ insanların tekidir.»"),
  N("ibnebizaide", "يحيى بن زكريا بن أبي زائدة", "İbn Ebî Zâide", 5, 182, "Kûfe", "İbnü'l-Medînî'nin üçüncü tabakasından. Babası Zekeriyyâ b. Ebî Zâide de hocaları arasında. Mizzî: Süfyân b. Uyeyne'den rivayet etti ve ondan önce vefat etti."),
  N("veki", "وكيع بن الجراح", "Vekî‘ b. el-Cerrâh", 5, 197, "Kûfe", "Sevrî'nin başlıca râvisi. Ahmed b. Hanbel: «Vekī‘den daha çok ilim toplayanı görmedim, ondan daha hâfızını görmedim.» Yine Ahmed: «Vekī‘ beş yüz hadiste hata etti» ve «İbn Mehdî'den çok daha hâfızdı.»"),
  N("ibnmubarek", "عبد الله بن المبارك بن واضح", "Abdullah b. el-Mübârek", 5, 181, "Horasan", "İbn Mehdî: «imâmlar dörttür, Sevrî, Mâlik, Hammâd b. Zeyd ve İbnü'l-Mübârek»; Sevrî ile kıyaslandığında İbn Mehdî onu tercih eder. Merv asıllı (el-Mervezî), Horasan sütununda. Mizzî: «imâmlardan biri ve İslâm hâfızlarından.» İbn Ma‘în: İbrâhim b. Ukbe'den de Muhammed b. Ukbe'den de işitmedi."),
  N("kattan", "يحيى بن سعيد بن فروخ القطان", "Yahyâ b. Saîd el-Kattân", 5, 198, "Basra", "Cerh-ta‘dîl ve ilel imâmı. Ahmed b. Hanbel, Sevrî'nin talebeleri sorulduğunda dördünü sayar ve başa onu koyar: Yahyâ, Vekī‘, Abdurrahman, Ebû Nuaym."),
  N("ibnmehdi", "عبد الرحمن بن مهدي بن حسان", "Abdurrahman b. Mehdî", 5, 198, "Basra", "İlel imâmlarından. Şu‘be rivayetinde Affân ve Günder'in ondan daha sağlam sayıldığı kaydedilir (Ahmed b. Hanbel ve Ali b. el-Medînî)."),

  // ---- Zuhri'nin Tehzib'de gecen, agda henuz olmayan hocalari ----
  N("sabitkayszuraki", "ثابت بن قيس الزرقي", "Sâbit b. Kays ez-Zürakī", 2, null, "Medine"),
  N("ibrahimavf", "إبراهيم بن عبد الرحمن بن عوف", "İbrâhim b. Abdirrahman b. Avf", 3, 95, "Medine",
    "Takrîb 206: Rü'yeti olduğu söylenir; Hz. Ömer'den semâını Ya‘kūb b. Şeybe sabit görür. Vefatı 95, bir görüşe göre 96."),
  N("haricezeyd", "خارجة بن زيد بن ثابت", "Hârice b. Zeyd b. Sâbit", 3, 100, "Medine", "Medine'nin yedi fakihinden."),
  N("ubeydullahutbe", "عبيد الله بن عبد الله بن عتبة", "Ubeydullah b. Abdillâh b. Utbe", 3, 98, "Medine", "Medine'nin yedi fakihinden. Rumûz ع."),
  N("arac", "عبد الرحمن بن هرمز الأعرج", "Abdurrahman b. Hürmüz el-A‘rec", 3, 117, "Medine", "Rumûz ع."),
  N("hamzaibnomer", "حمزة بن عبد الله بن عمر", "Hamza b. Abdillâh b. Ömer", 3, null, "Medine", "Rumûz ع."),
  N("hasanhanefiyye", "الحسن بن محمد ابن الحنفية", "Hasan b. Muhammed İbnü'l-Hanefiyye", 3, 100, "Medine",
    "Medineli tâbiîn râvisi ve fakih; babası Muhammed b. el-Hanefiyye, dedesi Hz. Ali'dir. İbn Hacer onu \"sika, fakih\" diye niteler ve üçüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. İbn Hacer ayrıca, irca meselesinde ilk söz söyleyenin o olduğunun nakledildiğini kaydeder. 100 (bir rivayete göre 99) yılında vefat etti."),
  N("alkamevakkas", "علقمة بن وقاص الليثي", "Alkame b. Vakkâs el-Leysî", 2, null, "Medine"),
  N("abdullahkab", "عبد الله بن كعب بن مالك", "Abdullah b. Kâ‘b b. Mâlik", 3, null, "Medine"),
  N("rafihadic", "رافع بن خديج", "Râfi‘ b. Hadîc", 1, 74, "Medine", "Mizzî: Zührî'nin ondan rivayeti mürseldir."),

  // ---- Zuhri'nin Tehzib'de gecen talebeleri ----
  N("salihkeysan", "صالح بن كيسان", "Sâlih b. Keysân", 5, null, "Medine", "Rumûz ع."),
  N("suaybebihamza", "شعيب بن أبي حمزة", "Şuayb b. Ebî Hamza", 5, null, "Şam", "Rumûz ع."),
  N("ibrahimsad", "إبراهيم بن سعد الزهري", "İbrâhim b. Sa‘d ez-Zührî", 5, null, "Medine",
    "Takrîb 177: «ثقة حجة تُكُلِّم فيه بلا قادح». Abdurrahman b. Avf'ın torununun oğlu; Medineli, Bağdat'a yerleşti. Takrîb vefatını 185 verir."),
  N("eyyubsahtiyani", "أيوب السختياني", "Eyyûb es-Sahtiyânî", 5, 131, "Basra",
    "Basra'nın önde gelen muhaddis ve fakihlerinden. İbn Hacer onun için \"sika, sebt, hüccet; fakihlerin ve zâhidlerin büyüklerinden\" der ve beşinci tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Nâfi', İbn Sîrîn ve Hasan-ı Basrî'den aldığı rivayetler Basra hadisinin ana damarlarındandır; Hammâd b. Zeyd, Süfyân es-Sevrî ve Şu'be gibi isimler ondan rivayet etmiştir. 131'de, altmış beş yaşında vefat etti."),
  N("usamezeydleysi", "أسامة بن زيد الليثي", "Üsâme b. Zeyd el-Leysî", 5, 153, "Medine",
    "Takrîb 317: «صدوق يهم». Medineli, Leys kabilesinin mevlâsı. Yetmişi aşkın yaşında vefat etti."),
  N("haccacertat", "الحجاج بن أرطاة", "Haccâc b. Ertât", 5, null, "Kûfe", "Mizzî: Zührî'den semâı ihtilâflı («ve kîle lem yesma‘ minhu»)."),

  // ---- Katade ve A'mes cevresinde aga giren yeni raviler ----
  N("ebulaliye", "أبو العالية الرياحي", "Ebû'l-Âliye er-Riyâhî", 2, 90, "Basra", "Rumûz ع."),
  N("cabirzeyd", "أبو الشعثاء جابر بن زيد", "Câbir b. Zeyd Ebû’ş-Şa‘sâ", 3, 93, "Basra", "Rumûz ع."),
  N("bekirmuzeni", "بكر بن عبد الله المزني", "Bekir b. Abdillâh el-Müzenî", 3, 106, "Basra",
    "Basralı tâbiîn râvisi, zühd ve takvâsıyla anılır. İbn Hacer onu \"sika, sebt, celîl\" diye niteler ve üçüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Enes b. Mâlik, İbn Ömer ve Mugīre b. Şu'be'den aldığı rivayetlerle Basra'nın erken hadis birikiminin taşıyıcılarındandır. 106 yılında vefat etti."),
  N("nehai", "إبراهيم بن يزيد النخعي", "İbrâhim en-Nehaî", 4, 96, "Kûfe", "Rumûz ع. Kûfe re’y ekolünün temel halkası."),
  N("ibrahimteymi", "إبراهيم التيمي", "İbrâhim et-Teymî", 4, 92, "Kûfe", "Rumûz ع."),
  N("habibebisabit", "حبيب بن أبي ثابت", "Habîb b. Ebî Sâbit", 4, 119, "Kûfe",
    "Kûfeli râvi ve fakih. İbn Hacer onu \"sika, fakih, celîl\" diye niteler ve üçüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Bununla birlikte aynı yerde çok irsâl ve tedlîs yaptığını da belirtir — yani hocasını atlayarak rivayette bulunması sık görülür. Bu ikili değerlendirme, güvenilirliğin (adalet ve zabt) ayrı, isnaddaki kesintinin ayrı bir mesele olduğunun tipik örneğidir. 119 yılında vefat etti."),
  N("hakemuteybe", "الحكم بن عتيبة", "Hakem b. Uteybe", 4, 115, "Kûfe", "Mizzî, A‘meş’in tercemesinde «ve hüve min şuyûhihî» kaydını düşer, yani hem hocası hem talebesidir."),
  N("ebuduha", "أبو الضحى مسلم بن صبيح", "Ebû’d-Duhâ Müslim b. Subıh", 4, 100, "Kûfe", "Rumûz ع."),
  N("yahyavessab", "يحيى بن وثاب", "Yahyâ b. Vessâb", 4, 103, "Kûfe"),
  N("mearrursuveyd", "المعرور بن سويد", "Ma‘rûr b. Süveyd", 2, null, "Kûfe", "Rumûz ع."),
  N("hisamdestuvai", "هشام الدستوائي", "Hişâm ed-Destevâî", 5, 154, "Basra", "Rumûz ع."),
  N("hemmamyahya", "همام بن يحيى", "Hemmâm b. Yahyâ", 5, 164, "Basra", "Rumûz ع."),
  N("cerirhazim", "جرير بن حازم", "Cerîr b. Hâzim", 5, 170, "Basra", "Rumûz ع."),
  N("cerirabdulhamid", "جرير بن عبد الحميد", "Cerîr b. Abdilhamîd", 5, 188, "Kûfe", "Rumûz ع."),
  N("hafsgiyas", "حفص بن غياث", "Hafs b. Giyâs", 5, 194, "Kûfe", "Rumûz ع."),
  N("leysbsad", "الليث بن سعد", "Leys b. Sa‘d", 5, 175, "Mısır", "Mizzî: Katâde ile görüşmedi («ve lem yelkahu»)."),
  N("amrharis", "عمرو بن الحارث", "Amr b. el-Hâris", 5, null, "Mısır"),
  N("misersukdam", "مسعر بن كدام", "Mis‘ar b. Kedâm", 5, 155, "Kûfe"),
  N("suleymanteymi", "سليمان التيمي", "Süleymân et-Teymî", 5, 143, "Basra"),
  N("ibnnumeyr", "عبد الله بن نمير", "Abdullah b. Nümeyr", 5, 199, "Kûfe"),
  N("ibnidris", "عبد الله بن إدريس", "Abdullah b. İdrîs", 5, 192, "Kûfe"),
  N("alimushir", "علي بن مسهر", "Ali b. Müshir", 5, 189, "Kûfe"),

  // ---- Amr b. Dinar cevresinde aga giren raviler ----
  N("saidcubeyr", "سعيد بن جبير", "Saîd b. Cübeyr", 4, 95, "Kûfe", "Rumûz ع."),
  N("tavus", "طاووس بن كيسان", "Tâvûs b. Keysân", 4, 106, "Mekke", "Rumûz ع."),
  N("mucahid", "مجاهد بن جبر", "Mücâhid b. Cebr", 4, 104, "Mekke",
    "Takrîb 6481: «ثقة إمام في التفسير وفي العلم». Vefatında ihtilâf var — 101, 102, 103 ya da 104; seksen üç yaşındaydı."),
  N("kureyb", "كريب مولى ابن عباس", "Küreyb mevlâ İbn Abbâs", 3, 98, "Medine"),
  N("ebucafermuhbakir", "محمد بن علي الباقر", "Muhammed b. Ali el-Bâkır", 4, 114, "Medine"),
  N("suleymanyesar", "سليمان بن يسار", "Süleymân b. Yesâr", 3, 107, "Medine", "Medine'nin yedi fakihinden."),
  N("ebuselemeavf", "أبو سلمة بن عبد الرحمن", "Ebû Seleme b. Abdirrahman", 3, 94, "Medine", "Medine'nin yedi fakihinden."),
  N("vehbmunebbih", "وهب بن منبه", "Vehb b. Münebbih", 4, 114, "Yemen"),
  N("hammadzeyd", "حماد بن زيد", "Hammâd b. Zeyd", 5, 179, "Basra", "Rumûz خ م د ت س."),
  N("varkaomer", "ورقاء بن عمر", "Varkā b. Ömer", 5, null, "Kûfe"),
  N("davudattar", "داود بن عبد الرحمن العطار", "Dâvûd b. Abdirrahman el-Attâr", 5, null, "Mekke", "Rumûz ع."),
  N("zekeriyyaishak", "زكريا بن إسحاق المكي", "Zekeriyyâ b. İshak el-Mekkî", 5, null, "Mekke", "Rumûz ع."),

  // ---- Ebu Ishak es-Sebii cevresinde aga giren raviler ----
  N("egarebumuslim", "الأغر أبو مسلم", "Egar Ebû Müslim", 2, null, "Kûfe",
    "Medine asıllı tâbiîn râvisi, sonradan Kûfe'ye yerleşti. İbn Hacer onu \"sika\" sayar ve üçüncü tabakadan gösterir; Müslim ve dört Sünen ondan rivayet eder. Ebû Hüreyre ve Ebû Saîd el-Hudrî'den aldığı rivayetlerle bilinir. İbn Hacer, kendisiyle aynı lakabı taşıyan Ebû Abdullah künyeli Selmân el-Egar'dan ayrı bir kişi olduğunu özellikle belirtir."),
  N("amrmeymun", "عمرو بن ميمون الأودي", "Amr b. Meymûn el-Evdî", 2, 74, "Kûfe", "Rumûz ع."),
  N("mesruk", "مسروق بن الأجدع", "Mesrûk b. el-Ecda‘", 2, 63, "Kûfe",
    "Takrîb 6601: «ثقة فقيه عابد مخضرم». Muhadramûndan, yani Câhiliye ile İslâm'a yetişip Hz. Peygamber'i görmeyenlerden. Künyesi Ebû Âişe. 62 ya da 63'te vefat etti."),
  N("musatalha", "موسى بن طلحة", "Mûsâ b. Talha", 3, 103, "Kûfe", "Dârekutnî: Ebû İshak ondan bir hadisi işitmemiştir."),
  N("numanbesir", "النعمان بن بشير", "Nu‘mân b. Beşîr", 1, 64, "Şam"),
  N("nafiibnomer", "نافع مولى ابن عمر", "Nâfi‘ mevlâ İbn Ömer", 4, 117, "Medine",
    "Takrîb 7086: «ثقة ثبت فقيه مشهور». 117'de ya da sonrasında vefat etti. Mâlik'in İbn Ömer'e giden zincirinin orta halkası."),
  N("zuhayrmuaviye", "زهير بن معاوية", "Züheyr b. Muâviye", 5, 173, "Kûfe", "Rumûz ع."),
  N("zaidekudame", "زائدة بن قدامة", "Zâide b. Kedâme", 5, 161, "Kûfe"),
  N("ebulahvess", "أبو الأحوص سلام بن سليم", "Ebû’l-Ahves Süllâm b. Süleym", 5, 179, "Kûfe", "Rumûz ع."),
  N("serikkadi", "شريك بن عبد الله النخعي", "Şerîk b. Abdillâh en-Nehaî", 5, 177, "Kûfe"),
  N("hamzazeyyat", "حمزة بن حبيب الزيات", "Hamza b. Habîb ez-Zeyyât", 5, 156, "Kûfe",
    "Kûfeli kırâat imamı ve râvi; yedi kırâat imamından biridir. İbn Hacer onu \"sadûk, zâhid\" sayar, bazan vehmettiğini ekler ve yedinci tabakadan gösterir; Müslim ve dört Sünen ondan rivayet eder. Hadis rivayetindeki yeri kırâattaki imamlığının gerisinde kalır — kırâat imamlığı ile hadis râviliğinin ayrı ölçütlerle değerlendirildiğinin örneklerindendir. 80'de doğdu, 156 (bir rivayete göre 158) yılında vefat etti."),

  // ---- Yahya b. Ebi Kesir cevresinde aga giren raviler ----

  // ---- Ibn Abbas ve Ibn Omer cevresinde aga giren raviler ----
  N("halidvelid", "خالد بن الوليد", "Hâlid b. el-Velîd", 1, 21, "Humus"),
  N("bureyde", "بريدة بن الحصيب", "Büreyde b. el-Hasıyb", 1, 63, "Basra",
    "Sahâbî; Bedir'den önce Müslüman oldu. Sonradan Basra'ya, ardından Horasan'a yerleşti ve Merv'de vefat etti. Kütüb-i Sitte'nin altısı da ondan rivayet eder; iki oğlu Abdullah ve Süleymân onun rivayetlerinin başlıca nâkilleridir. 63 yılında vefat etti."),
  N("temimdari", "تميم الداري", "Temîm ed-Dârî", 1, 40, "Şam",
    "Sahâbî; aslen Filistin'in Beytülahm bölgesinden bir hıristiyan iken 9. yılda Medine'ye gelip Müslüman oldu. Kur'an'ı geceleri okumaya ve mescidde kandil yakmaya dair uygulamalarıyla anılır. Rivayet ettiği Cessâse hadisi, Müslim'in Sahîh'inde yer alan uzun haberlerdendir. Hz. Osman'ın şehâdetinden sonra Kudüs'e yerleşti; 40 yılı civarında vefat etti."),
  N("hafsa", "حفصة أم المؤمنين", "Hafsa bint Ömer", 1, 45, "Medine", "Hz. Ömer'in kızı, İbn Ömer'in kız kardeşi. Rumûz ع."),
  N("bilal", "بلال مؤذن رسول الله", "Bilâl-i Habeşî", 1, 20, "Şam", "Rumûz ع."),
  N("amirrebia", "عامر بن ربيعة", "Âmir b. Rebîa", 1, 32, "Medine", "Rumûz ع."),
  N("ebulubabe", "أبو لبابة الأنصاري", "Ebû Lübâbe el-Ensârî", 1, null, "Medine"),
  N("abdullahdinar", "عبد الله بن دينار", "Abdullah b. Dînâr", 4, 127, "Medine", "Rumûz ع."),
  N("hamzaibnomerogul", "حمزة بن عبد الله بن عمر (ابنه)", "Hamza b. Abdillâh b. Ömer (oğlu)", 3, null, "Medine"),
  N("cebeleshim", "جبلة بن سحيم", "Cebele b. Süheym", 4, 125, "Kûfe", "Rumûz ع."),
  N("saidyesar", "أبو الحباب سعيد بن يسار", "Saîd b. Yesâr", 3, 117, "Medine", "Rumûz ع."),
  N("sadubeyde", "سعد بن عبيدة", "Sa‘d b. Ubeyde", 3, null, "Kûfe"),
  N("safvanmuhriz", "صفوان بن محرز", "Safvân b. Muhriz", 2, 74, "Basra"),
  N("enessirin", "أنس بن سيرين", "Enes b. Sîrîn", 3, 118, "Basra",
    "Basralı tâbiîn râvisi, meşhur muhaddis ve muabbir Muhammed b. Sîrîn'in kardeşi. İbn Hacer onu \"sika\" sayar ve üçüncü tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Enes b. Mâlik'ten yaptığı rivayetlerle tanınır. 118 (bir rivayete göre 120) yılında vefat etti."),
  N("sabitbunani", "ثابت البناني", "Sâbit el-Bünânî", 4, 127, "Basra",
    "Basralı tâbiîn râvisi ve zâhid. İbn Hacer onu \"sika, âbid\" diye niteler ve dördüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Enes b. Mâlik'in en çok rivayet eden talebelerinden olup Enes yoluyla gelen haberlerin başlıca nâkilidir; kendisinden Hammâd b. Seleme, Şu'be ve Süleymân et-Teymî rivayet etmiştir. 127 yılı dolaylarında, seksen altı yaşında vefat etti."),
  N("dahhak", "الضحاك بن مزاحم", "Dahhâk b. Müzâhim", 4, 105, "Basra"),
  N("sehrhavseb", "شهر بن حوشب", "Şehr b. Havşeb", 3, 112, "Şam"),
  N("hakemarac", "الحكم بن الأعرج", "Hakem b. el-A‘rec", 3, null, "Basra"),
  N("ebuzabyan", "أبو ظبيان حصين بن جندب", "Ebû Zabyân Hüsayn b. Cündeb", 2, 90, "Kûfe"),
  N("abdullahmabed", "عبد الله بن معبد بن عباس", "Abdullah b. Ma‘bed b. Abbâs", 3, null, "Medine"),
  N("ebulminhal", "أبو المنهال عبد الرحمن بن مطعم", "Ebû'l-Minhâl Abdurrahman b. Mut‘im", 3, null, "Mekke"),
  N("ubeydullahebiyezid", "عبيد الله بن أبي يزيد", "Ubeydullah b. Ebî Yezîd", 4, 126, "Mekke", "Rumûz ع."),
  N("ibnebimuleyke", "عبد الله بن أبي مليكة", "İbn Ebî Müleyke", 4, 117, "Mekke", "Rumûz ع."),

  // ---- Enes ve Cabir cevresinde aga giren raviler ----
  N("sumameenes", "ثمامة بن عبد الله بن أنس", "Sümâme b. Abdillâh b. Enes", 4, null, "Basra", "Enes'in torunu. Rumûz ع."),
  N("humeydtavil", "حميد الطويل", "Humeyd et-Tavîl", 5, 142, "Basra", "Rumûz ع."),
  N("hafsubeydullahenes", "حفص بن عبيد الله بن أنس", "Hafs b. Ubeydillâh b. Enes", 4, null, "Basra",
    "Medineli râvi; sahâbî Enes b. Mâlik'in torunudur. İbn Hacer onu \"sadûk\" sayar ve üçüncü tabakadan gösterir; Buhârî, Müslim, Tirmizî, Nesâî ve İbn Mâce ondan rivayet eder. Dedesi Enes'ten yaptığı rivayetlerle tanınır — Enes'in geniş rivayet birikiminin aile içinden gelen kollarından biridir."),
  N("cadebuosman", "الجعد أبو عثمان", "Ca‘d Ebû Osmân", 4, null, "Basra",
    "Basralı râvi, künyesi Ebû Osmân, kuyumculuk yaptığı için Sayrafî diye anılır. İbn Hacer onu \"sika\" sayar ve dördüncü tabakadan gösterir; Buhârî, Müslim, Ebû Dâvûd, Tirmizî ve Nesâî ondan rivayet eder. Enes b. Mâlik'ten aldığı rivayetlerle tanınır."),
  N("rebiaebiabdrahman", "ربيعة بن أبي عبد الرحمن", "Rabîa b. Ebî Abdirrahman (Rabîatü'r-re'y)", 5, 136, "Medine"),
  N("bekirahnes", "بكير بن الأخنس", "Bekîr b. el-Ahnes", 4, null, "Kûfe",
    "Kûfeli râvi. İbn Hacer onu \"sika\" sayar ve dördüncü tabakadan gösterir; Müslim, Ebû Dâvûd, Nesâî ve İbn Mâce ondan rivayet eder, Buhârî ise Ref'u'l-yedeyn'de ona yer verir. Nisbesinde ihtilâf edilmiş, Sedûsî ve Leysî diye de anılmıştır."),
  N("zubeyradi", "الزبير بن عدي", "Zübeyr b. Adî", 4, 131, "Kûfe"),
  N("beyanbisr", "بيان بن بشر", "Beyân b. Bişr el-Ahmesî", 4, null, "Kûfe",
    "Kûfeli râvi, künyesi Ebû Bişr. İbn Hacer onu \"sika, sebt\" diye niteler ve beşinci tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Şa'bî, Kays b. Ebî Hâzim ve Enes b. Mâlik'ten aldığı rivayetlerle Kûfe'nin sağlam râvilerinden sayılır."),
  N("bisryesar", "بشير بن يسار", "Beşîr b. Yesâr", 3, null, "Medine",
    "Medineli tâbiîn râvisi ve fakih, Ensar'ın mevlâsı. İbn Hacer onu \"sika, fakih\" diye niteler ve üçüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Râfi' b. Hadîc ve Sehl b. Ebî Hasme'den gelen rivayetleriyle, özellikle kasâme ve muzâraa gibi hukukî konularda dayanak sayılan haberlerin nâkilidir."),
  N("ebuzubeyrmekki", "أبو الزبير محمد بن مسلم المكي", "Ebû'z-Zübeyr el-Mekkî", 4, 126, "Mekke", "Câbir'in başlıca râvisi. Rumûz ع."),
  N("ibnmunkedir", "محمد بن المنكدر", "Muhammed b. el-Münkedir", 4, 130, "Medine", "Rumûz ع."),
  N("vehbkeysan", "وهب بن كيسان", "Vehb b. Keysân", 4, 127, "Medine"),
  N("mahmudlebid", "محمود بن لبيد", "Mahmûd b. Lebîd", 2, 96, "Medine"),
  N("muhammedabbadcafer", "محمد بن عباد بن جعفر", "Muhammed b. Abbâd b. Ca‘fer", 4, null, "Mekke"),
  N("muhammedsevban", "محمد بن عبد الرحمن بن ثوبان", "Muhammed b. Abdirrahman b. Sevbân", 4, null, "Medine"),
  N("yezidsuheybfakir", "يزيد بن صهيب الفقير", "Yezîd b. Suheyb el-Fakır", 4, null, "Kûfe"),

  // ---- Ebu Said ve Aise cevresinde aga giren raviler ----
  N("sadhisam", "سعد بن هشام بن عامر", "Sa‘d b. Hişâm b. Âmir", 3, null, "Medine", "Rumûz ع."),
  N("kazaayahya", "قزعة بن يحيى", "Kaz‘a b. Yahyâ", 3, null, "Basra", "Rumûz ع."),
  N("ibnsirin", "محمد بن سيرين", "Muhammed b. Sîrîn", 4, 110, "Basra",
    "Takrîb 5947: «ثقة ثبت عابد كبير القدر كان لا يرى الرواية بالمعنى». Son kayıt rivayet usulü açısından belirleyici — mânen rivayete cevaz vermezdi. 110'da vefat etti."),
  N("mabedsirin", "معبد بن سيرين", "Ma‘bed b. Sîrîn", 3, null, "Basra"),
  N("kasimmuhaymire", "القاسم بن مخيمرة", "Kâsım b. Muhaymire", 4, 100, "Kûfe"),
  N("yahyaumare", "يحيى بن عمارة المازني", "Yahyâ b. Umâre el-Mâzinî", 3, null, "Medine", "Rumûz ع."),
  N("ebuumamesehl", "أبو أمامة بن سهل بن حنيف", "Ebû Ümâme b. Sehl b. Huneyf", 3, 100, "Medine"),
  N("ebusaidmakburi", "أبو سعيد المقبري", "Ebû Saîd el-Makburî", 3, null, "Medine"),
  N("numanebiayyas", "النعمان بن أبي عياش الزرقي", "Nu‘mân b. Ebî Ayyâş ez-Zürakī", 3, null, "Medine"),
  N("ebussiddiknaci", "أبو الصديق الناجي", "Ebû's-Sıddīk en-Nâcî", 3, 108, "Basra", "Rumûz ع."),
  N("ebuidrishavlani", "أبو إدريس الخولاني", "Ebû İdrîs el-Havlânî", 3, 80, "Şam"),
  N("zekvanmevlaaise", "ذكوان مولى عائشة", "Zekvân mevlâ Âişe", 3, null, "Medine"),
  N("abbadabdullahzubeyr", "عباد بن عبد الله بن الزبير", "Abbâd b. Abdillâh b. ez-Zübeyr", 3, null, "Medine", "Rumûz ع."),
  N("sureyhhani", "شريح بن هانئ الحارثي", "Şüreyh b. Hâni’ el-Hârisî", 2, 78, "Kûfe"),
  N("abdullahsakik", "عبد الله بن شقيق العقيلي", "Abdullah b. Şakīk el-Ukaylî", 3, 108, "Basra"),
  N("abdullahsedddad", "عبد الله بن شداد بن الهاد", "Abdullah b. Şeddâd b. el-Hâd", 2, 81, "Kûfe"),
  N("amrabdrahmanzurara", "عمرة بنت عبد الرحمن", "Amre bint Abdirrahman", 3, 98, "Medine", "Âişe'nin başlıca kadın râvisi."),
  N("kasimmuhammed", "القاسم بن محمد بن أبي بكر", "Kâsım b. Muhammed b. Ebî Bekir", 4, 106, "Medine", "Medine'nin yedi fakihinden, Âişe'nin kardeş oğlu."),

  // ---- Malik cevresinde aga giren raviler ----
  N("caferisadik", "جعفر بن محمد الصادق", "Ca‘fer b. Muhammed es-Sâdık", 5, 148, "Medine", "Rumûz م ت س ق."),
  N("humeyskaysarac", "حميد بن قيس المكي الأعرج", "Humeyd b. Kays el-Mekkî el-A‘rec", 5, 130, "Mekke",
    "Mekkeli kārî ve râvi, künyesi Ebû Safvân; a'rec (topal) lakabıyla anılır. İbn Hacer onun için \"beis yok\" der ve altıncı tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Mücâhid ve Atâ b. Ebî Rebâh'tan aldığı rivayetlerle Mekke'nin hadis birikimini taşıyan isimlerdendir. 130 yılında (veya biraz sonrasında) vefat etti."),
  N("davudhusayn", "داود بن الحصين", "Dâvûd b. el-Husayn", 5, 135, "Medine", "Rumûz ع."),
  N("salimebinadr", "سالم أبو النضر", "Sâlim Ebû'n-Nadr", 5, 129, "Medine", "Rumûz ع."),
  N("hubeybabdrahman", "خبيب بن عبد الرحمن", "Hubîb b. Abdirrahman", 5, 132, "Medine"),
  N("ziyadsad", "زياد بن سعد", "Ziyâd b. Sa‘d", 5, null, "Mekke"),
  N("yezidhad", "يزيد بن عبد الله بن الهاد", "Yezîd b. Abdillâh b. el-Hâd", 5, 139, "Medine"),
  N("yezidrouman", "يزيد بن رومان", "Yezîd b. Rûmân", 5, 130, "Medine"),
  N("yezidkusayt", "يزيد بن عبد الله بن قسيط", "Yezîd b. Abdillâh b. Kusıyt", 5, 122, "Medine"),
  N("ataihorasani", "عطاء الخراساني", "Atâ el-Horâsânî", 5, 135, "Şam"),
  N("abdulmecidsuheyl", "عبد المجيد بن سهيل", "Abdülmecîd b. Süheyl", 5, null, "Medine"),
  N("ibnvehb", "عبد الله بن وهب", "Abdullah b. Vehb", 5, 197, "Mısır", "Rumûz خ م س."),
  N("kanebi", "عبد الله بن مسلمة القعنبي", "Ka‘nevî, Abdullah b. Mesleme", 5, 221, "Basra", "Rumûz خ م د ت."),
  N("ibnkasimmisri", "عبد الرحمن بن القاسم المصري", "İbn Kâsım el-Mısrî", 5, 191, "Mısır"),
  N("safii", "محمد بن إدريس الشافعي", "Muhammed b. İdrîs eş-Şâfiî", 5, 204, "Mısır"),
  N("kuteybesaid", "قتيبة بن سعيد", "Kuteybe b. Saîd", 5, 240, "Basra", "Rumûz خ م د ت س."),
  N("ibnebiuveys", "إسماعيل بن أبي أويس", "İsmâîl b. Ebî Üveys", 5, 226, "Medine",
    "Medineli râvi, İmam Mâlik'in kız kardeşinin oğlu ve talebesi. İbn Hacer onu \"sadûk\" sayar, ancak ezberinden rivayet ettiği bazı hadislerde hata ettiğini kaydeder. Buhârî ve Müslim ondan rivayet etmiş, özellikle Buhârî onun Mâlik'ten gelen nüshasına dayanmıştır. 226'da vefat etti."),
  N("ibnuleyye", "إسماعيل ابن علية", "İsmâîl İbn Uleyye", 5, 193, "Basra",
    "Takrîb 416: «ثقة حافظ». Annesine nisbetle İbn Uleyye diye tanınır. 193'te, seksen üç yaşında vefat etti."),
  N("velidmuslim", "الوليد بن مسلم", "Velîd b. Müslim", 5, 195, "Şam"),
  N("ebunuaymfadl", "أبو نعيم الفضل بن دكين", "Ebû Nuaym el-Fazl b. Dükeyn", 5, 219, "Kûfe"),
  N("ebuasimnebil", "أبو عاصم الضحاك بن مخلد", "Ebû Âsım ed-Dahhâk b. Mahled", 5, 212, "Basra"),

  // ---- Su'be cevresinde aga giren raviler ----
  N("ismailebihalid", "إسماعيل بن أبي خالد", "İsmâîl b. Ebî Hâlid", 5, 146, "Kûfe",
    "Kûfeli tâbiîn râvisi, Becîle kabilesinin mevlâsı. İbn Hacer onu \"sika, sebt\" diye niteler ve dördüncü tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Kays b. Ebî Hâzim ve Şa'bî'den aldığı rivayetlerle Kûfe'nin hadis birikiminin ana kanallarından biridir. 146'da vefat etti."),
  N("halidhazza", "خالد الحذاء", "Hâlid el-Hazzâ", 5, 141, "Basra"),
  N("davudebihind", "داود بن أبي هند", "Dâvûd b. Ebî Hind", 5, 140, "Basra"),
  N("sadibrahim", "سعد بن إبراهيم", "Sa‘d b. İbrâhim", 5, 125, "Medine", "Rumûz ع."),
  N("husaynabdrahman", "حصين بن عبد الرحمن", "Husayn b. Abdirrahman", 5, 136, "Kûfe",
    "Kûfeli râvi, künyesi Ebü'l-Hüzeyl. İbn Hacer onu \"sika\" sayar ve beşinci tabakadan gösterir, ancak ömrünün sonunda hafızasının değiştiğini belirtir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Bu \"ihtilât\" kaydı, ondan gelen rivayetlerde semâın önce mi sonra mı olduğunun sorulmasını gerektirir. Ebû Vâil ve Şa'bî'den aldığı rivayetlerle tanınır. 136 yılında, doksan üç yaşında vefat etti."),
  N("hammadebisuleyman", "حماد بن أبي سليمان", "Hammâd b. Ebî Süleymân", 5, 120, "Kûfe",
    "Kûfeli fakih ve râvi; Ebû Hanîfe'nin hocasıdır. İbrâhim en-Nehaî'nin ders halkasını devralmış, Kûfe rey ekolünün Ebû Hanîfe'ye ulaşan halkasını oluşturmuştur. İbn Hacer onu \"fakih, sadûk\" sayar, vehimlerinin bulunduğunu ve ircâ ile itham edildiğini belirtir; Buhârî el-Edebü'l-müfred'de, Müslim ve dört Sünen ise doğrudan ondan rivayet eder. 120 yılında (veya biraz öncesinde) vefat etti."),
  N("zubeydyami", "زبيد اليامي", "Zübeyd el-Yâmî", 5, 122, "Kûfe"),
  N("zekeriyyaebizaide", "زكريا بن أبي زائدة", "Zekeriyyâ b. Ebî Zâide", 5, 148, "Kûfe"),
  N("cameseddad", "جامع بن شداد", "Câmi‘ b. Şeddâd", 5, 127, "Kûfe",
    "Kûfeli tâbiîn râvisi, künyesi Ebû Sahra. İbn Hacer onu \"sika\" sayar ve beşinci tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Safvân b. Muhriz ve Abdullah b. Ebû Evfâ'dan aldığı rivayetlerle tanınır. 127 (bir rivayete göre 128) yılında vefat etti."),
  N("gunder", "محمد بن جعفر غندر", "Muhammed b. Ca‘fer Günder", 5, 193, "Basra", "Şu‘be'nin en meşhur râvisi. Rumûz ع."),
  N("yezidharun", "يزيد بن هارون", "Yezîd b. Hârûn", 5, 206, "Vâsıt",
    "Takrîb 7789: «ثقة متقن عابد». Vâsıt'ın merkezî râvisi. 206'da, doksana yaklaşmış olarak vefat etti."),
  N("yezidzurey", "يزيد بن زريع", "Yezîd b. Zürey‘", 5, 182, "Basra"),
  N("nadrsumeyl", "النضر بن شميل", "Nadr b. Şümeyl", 5, 204, "Basra"),
  N("ebudavudtayalisi", "أبو داود الطيالسي", "Ebû Dâvûd et-Tayâlisî", 5, 204, "Basra",
    "Takrîb 2550: «ثقة حافظ غلط في أحاديث». İbn Hacer sikalığını teslim ederken bazı hadislerde yanıldığını da kaydediyor. 204'te vefat etti."),
  N("muazmuaz", "معاذ بن معاذ العنبري", "Muâz b. Muâz el-Anberî", 5, 196, "Basra"),
  N("affanmuslim", "عفان بن مسلم", "Affân b. Müslim", 5, 220, "Basra"),
  N("alicad", "علي بن الجعد", "Ali b. el-Ca‘d", 5, 230, "Basra"),
  N("abdussamed", "عبد الصمد بن عبد الوارث", "Abdüssamed b. Abdilvâris", 5, 207, "Basra"),
  N("isabyunus", "عيسى بن يونس السبيعي", "Ísâ b. Yûnus", 5, 191, "Şam"),

  // ---- Sevri cevresinde aga giren raviler ----
  N("esvedkays", "الأسود بن قيس", "Esved b. Kays", 5, null, "Kûfe", "Rumûz ع."),
  N("hasanubeydullah", "الحسن بن عبيد الله النخعي", "Hasan b. Ubeydillâh en-Nehaî", 5, 139, "Kûfe",
    "Kûfeli râvi, künyesi Ebû Urve. İbn Hacer onu \"sika, fâzıl\" diye niteler ve altıncı tabakadan sayar; Müslim ve dört Sünen ondan rivayet eder. İbrâhim en-Nehaî ve Ebû Vâil'den aldığı rivayetlerle Kûfe'nin sağlam râvilerindendir. 139 (bir rivayete göre 142) yılında vefat etti."),
  N("sevryezid", "ثور بن يزيد الرحبي", "Sevr b. Yezîd er-Rahbî", 5, 153, "Şam"),
  N("ismailumeyye", "إسماعيل بن أمية", "İsmâîl b. Ümeyye", 5, 144, "Mekke"),
  N("suddi", "إسماعيل السدي", "İsmâîl es-Süddî", 5, 127, "Kûfe",
    "Kûfeli müfessir ve râvi, es-Süddiyyü'l-kebîr diye bilinir. İbn Hacer onu \"sadûk\" sayar, vehmettiğini ve teşeyyu'la itham edildiğini belirtir; Müslim ve dört Sünen ondan rivayet eder. Tefsir alanındaki rivayetleri klasik tefsirlerin başlıca kaynaklarındandır. 127'de vefat etti."),
  N("ibrahimukbe", "إبراهيم بن عقبة", "İbrâhim b. Ukbe", 5, null, "Medine",
    "Takrîb 217: «أخو موسى ثقة من السادسة» — Megâzî müellifi Mûsâ b. Ukbe'nin kardeşi."),
  N("ebuhasin", "أبو حصين عثمان بن عاصم", "Ebû Hasīn Osmân b. Âsım", 5, 128, "Kûfe"),
  N("cabircufi", "جابر الجعفي", "Câbir el-Cu‘fî", 5, 128, "Kûfe", "Cerh açısından tartışmalı."),
  N("hasanamrfukaymi", "الحسن بن عمرو الفقيمي", "Hasan b. Amr el-Fukaymî", 5, 142, "Kûfe",
    "Kûfeli râvi. İbn Hacer onu \"sika, sebt\" diye niteler ve altıncı tabakadan sayar; Buhârî, Ebû Dâvûd, Nesâî ve İbn Mâce ondan rivayet eder. Mücâhid ve Fudayl b. Amr'dan aldığı rivayetlerle tanınır. 142 yılında vefat etti."),
  N("ishakyusufezrak", "إسحاق بن يوسف الأزرق", "İshak b. Yûsuf el-Ezrak", 5, 195, "Vâsıt", "Rumûz ع."),
  N("ebuusamehammad", "أبو أسامة حماد بن أسامة", "Ebû Üsâme Hammâd b. Üsâme", 5, 201, "Kûfe"),
  N("caferavn", "جعفر بن عون", "Ca‘fer b. Avn", 5, 207, "Kûfe",
    "Kûfeli râvi. İbn Hacer onu \"sadûk\" sayar ve dokuzuncu tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Uzun ömürlü olması sebebiyle Kûfe'nin hadis birikimini üçüncü asrın başındaki hâfızlara ulaştıran isimlerdendir; Hişâm b. Urve, A'meş ve Misar'dan rivayet etmiştir. 207 (bir rivayete göre 206) yılında vefat etti."),
  N("halidharis", "خالد بن الحارث الهجيمي", "Hâlid b. el-Hâris el-Hüceyî", 5, 186, "Basra"),
  N("ruhubade", "روح بن عبادة", "Ruh b. Ubâde", 5, 205, "Basra"),
  N("abdurrezzak", "عبد الرزاق بن همام", "Abdürrezzâk b. Hemmâm", 5, 211, "Yemen", "Ma‘mer'in başlıca râvisi, el-Musannef sahibi."),
  N("damrarebia", "ضمرة بن ربيعة", "Damra b. Rabîa", 5, 202, "Şam"),
  N("suleymanbilal", "سليمان بن بلال", "Süleymân b. Bilâl", 5, 172, "Medine"),
  N("bisrsari", "بشر بن السري", "Bişr b. es-Serî", 5, 195, "Basra",
    "Basra asıllı râvi ve vâiz, sonradan Mekke'ye yerleşti. İbn Hacer onu \"sika, mütkın\" diye niteler ve dokuzuncu tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Cehm'in görüşünü benimsediği gerekçesiyle tenkit edilmiş, ancak özür beyan edip bu görüşten dönmüştür — bu, akîde yönünden tenkit edilen bir râvinin rücûu sebebiyle rivayetinin kabul edilmesine örnektir. 195 (veya 196) yılında, altmış üç yaşında vefat etti."),

  // ---- Sufyan b. Uyeyne cevresinde aga giren raviler ----
  N("hisamurve", "هشام بن عروة", "Hişâm b. Urve", 5, 146, "Medine", "Urve'nin oğlu. Rumûz ع."),
  N("mansurmutemir", "منصور بن المعتمر", "Mansûr b. el-Mu‘temir", 5, 132, "Kûfe"),
  N("mansursafiyye", "منصور بن صفية", "Mansûr b. Safiyye", 5, null, "Mekke"),
  N("musaukbe", "موسى بن عقبة", "Mûsâ b. Ukbe", 5, 141, "Medine"),
  N("muhammedacilan", "محمد بن عجلان", "Muhammed b. Aclân", 5, 148, "Medine"),
  N("muhammedamralkame", "محمد بن عمرو بن علقمة", "Muhammed b. Amr b. Alkame", 5, 145, "Medine"),
  N("muhammedsuka", "محمد بن سوقة", "Muhammed b. Sûka", 5, null, "Kûfe"),
  N("mutarriftarif", "مطرف بن طريف", "Mutarrif b. Tarîf", 5, 141, "Kûfe"),
  N("ismailebiislamsibani", "أبو إسحاق الشيباني", "Ebû İshak eş-Şeybânî", 5, 141, "Kûfe"),
  N("velidkesir", "الوليد بن كثير", "Velîd b. Kesîr", 5, 151, "Medine"),
  N("yezidhusayfe", "يزيد بن خصيفة", "Yezîd b. Husıyfe", 5, null, "Medine"),
  N("ahmedhanbel", "أحمد بن حنبل", "Ahmed b. Hanbel", 5, 241, "Basra", "el-Müsned sahibi. Rumûz م د."),
  N("ibnrahuye", "إسحاق بن راهويه", "İshak b. Râhûye", 5, 238, "Horasan", "Rumûz خ م س."),
  N("ahmedsalihmisri", "أحمد بن صالح المصري", "Ahmed b. Sâlih el-Mısrî", 5, 248, "Mısır"),
  N("ahmedmeni", "أحمد بن منيع", "Ahmed b. Manî‘ el-Bağavî", 5, 244, "Basra"),
  N("ibrahimfezari", "إبراهيم بن محمد الفزاري", "İbrâhim b. Muhammed el-Fezârî", 5, 185, "Şam",
    "Takrîb 230: «الإمام أبو إسحاق ثقة حافظ له تصانيف». Vefatı 185, bir görüşe göre sonrası."),

  // ---- Ibn Cureyc cevresinde aga giren raviler ----
  N("abdullahtavus", "عبد الله بن طاووس", "Abdullah b. Tâvûs", 5, 132, "Mekke", "Mizzî: İbn Cüreyc ondan yalnız bir hadis işitti (Yahyâ el-Kattân ve İbn Ma‘în)."),
  N("abdulhamidcubeyr", "عبد الحميد بن جبير بن شيبة", "Abdülhamîd b. Cübeyr b. Şeybe", 5, null, "Mekke", "Rumûz ع."),
  N("abdulkerimcezeri", "عبد الكريم بن مالك الجزري", "Abdülkerîm b. Mâlik el-Cezerî", 5, 127, "Şam"),
  N("ikrimehalid", "عكرمة بن خالد المخزومي", "İkrime b. Hâlid el-Mahzûmî", 4, null, "Mekke"),
  N("kasimebibezze", "القاسم بن أبي بزة", "Kâsım b. Ebî Bezze", 5, 124, "Mekke"),
  N("alaabdrahman", "العلاء بن عبد الرحمن", "Alâ b. Abdirrahman", 5, 132, "Medine"),
  N("amrsuayb", "عمرو بن شعيب", "Amr b. Şuayb", 5, 118, "Mekke", "Mizzî, Buhârî'den nakleder: İbn Cüreyc ondan işitmedi."),
  N("ibnhuseymkhaysem", "عبد الله بن عثمان بن خثيم", "Abdullah b. Osmân b. Husıym", 5, 132, "Mekke"),
  N("ubeydullahomeri", "عبيد الله بن عمر العمري", "Ubeydullah b. Ömer el-Ömerî", 5, 147, "Medine", "Mizzî: İbn Cüreyc'in akranı."),
  N("haccacmuhammed", "حجاج بن محمد المصيصي", "Haccâc b. Muhammed el-Masīsī", 5, 206, "Şam", "İbn Cüreyc'in başlıca râvisi. Rumûz ع."),
  N("ismailayyas", "إسماعيل بن عياش", "İsmâîl b. Ayyâş", 5, 181, "Şam",
    "Humuslu râvi. İbn Hacer'in hakkındaki hükmü hadis tenkidinde meşhur bir örnektir: kendi beldesi olan Şamlılardan yaptığı rivayetlerde \"sadûk\", başka beldelerin râvilerinden yaptıklarında ise karıştırıcıdır. Bu ayrım, aynı râvinin rivayetlerinin kaynağına göre farklı değerlendirilebileceğini gösteren temel bir ölçüdür. 181 (veya 182) yılında vefat etti."),
  N("enesiyaz", "أنس بن عياض", "Enes b. İyâz", 5, 200, "Medine",
    "Medineli râvi, künyesi Ebû Damra. İbn Hacer onu \"sika\" sayar ve sekizinci tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Uzun ömrü sayesinde Medine'nin hadis birikimini sonraki nesle taşıyan râvilerdendir. 200 yılında, doksan altı yaşında vefat etti."),

  // ---- Ma'mer cevresinde aga giren raviler ----
  N("hemmammunebbih", "همام بن منبه", "Hemmâm b. Münebbih", 4, 132, "Yemen", "es-Sahîfetu's-sahîha sahibi. Rumûz ع."),
  N("matarverrak", "مطر الوراق", "Matar el-Verrâk", 5, 129, "Basra"),
  N("hisamyusufsanani", "هشام بن يوسف الصنعاني", "Hişâm b. Yûsuf es-San‘ânî", 5, 197, "Yemen"),
  N("mutemirsuleyman", "معتمر بن سليمان", "Mu‘temir b. Süleymân", 5, 187, "Basra"),
  N("abdulalaabdulala", "عبد الأعلى بن عبد الأعلى", "Abdül'alâ b. Abdil'alâ", 5, 189, "Basra"),
  N("vuheybhalid", "وهيب بن خالد", "Vüheyb b. Hâlid", 5, 165, "Basra"),
  N("ebansattar", "أبان بن يزيد العطار", "Ebân b. Yezîd el-Attâr", 5, 160, "Basra",
    "Takrîb 143: «ثقة له أفراد». Altmışlı yılların civarında vefat etti."),
  N("mervanfezari", "مروان بن معاوية الفزاري", "Mervân b. Muâviye el-Fezârî", 5, 193, "Kûfe"),
  N("vakidi", "محمد بن عمر الواقدي", "Vâkıdî, Muhammed b. Ömer", 5, 207, "Medine"),

  // ---- Evzai cevresinde aga giren raviler ----
  N("mekhul", "مكحول الشامي", "Mekhûl eş-Şâmî", 4, 112, "Şam", "Şam fakihlerinin önde geleni."),
  N("hassanatiyye", "حسان بن عطية", "Hassân b. Atiyye", 5, 130, "Şam", "Rumûz ع."),
  N("rebiayezid", "ربيعة بن يزيد", "Rabîa b. Yezîd", 5, 123, "Şam"),
  N("umeyrhani", "عمير بن هانئ", "Umeyr b. Hâni’", 4, null, "Şam", "Rumûz ع."),
  N("abdelubabe", "عبدة بن أبي لبابة", "Abde b. Ebî Lübâbe", 5, null, "Şam"),
  N("muhammedvelidzubeydi", "محمد بن الوليد الزبيدي", "Muhammed b. el-Velîd ez-Zübeydî", 5, 149, "Şam"),
  N("suleymanhabib", "سليمان بن حبيب المحاربي", "Süleymân b. Habîb el-Muhâribî", 4, null, "Şam"),
  N("suleymanmusadimaski", "سليمان بن موسى الدمشقي", "Süleymân b. Mûsâ ed-Dımaşkī", 5, 119, "Şam"),
  N("saddadebuammar", "شداد أبو عمار", "Şeddâd Ebû Ammâr", 3, null, "Şam"),
  N("mutallibhantab", "المطلب بن عبد الله بن حنطب", "Muttalib b. Abdillâh b. Hantab", 4, null, "Medine"),
  N("kurrahayvil", "قرة بن عبد الرحمن", "Kurre b. Abdirrahman", 5, 147, "Mısır"),
  N("meymunmihran", "ميمون بن مهران", "Meymûn b. Mihrân", 4, 117, "Şam"),

  // ---- Evzai'nin talebeleri ve Ibn Ebi Aruba cevresi ----
  N("hikalziyad", "الهقل بن زياد", "Hıkal b. Ziyâd", 5, 179, "Şam", "Mizzî: Evzâî hakkında insanların en sağlamı («ve hüve esbetu'n-nâsi fîhî»). Rumûz م ٤."),
  N("bakiyyevelid", "بقية بن الوليد", "Bakiyye b. el-Velîd", 5, 197, "Humus",
    "Humuslu râvi; Şam bölgesi hadisinin en çok rivayet eden isimlerinden. İbn Hacer onu \"sadûk\" sayar, fakat zayıf râvilerden yaptığı rivayetlerde çokça tedlîs yaptığını belirtir — yani hocasının adını atlayıp rivayeti daha güvenilir bir kaynaktan almış gibi gösterebilmektedir. Bu yüzden rivayeti ancak semâını açıkça belirttiğinde (\"haddesenâ\" gibi bir lafızla) kabul edilir; tedlîsin hadis tenkidinde neden başlı başına bir kusur sayıldığının en çok atıf yapılan örneğidir. 197 yılında, seksen yedi yaşında vefat etti."),
  N("firyabi", "محمد بن يوسف الفريابي", "Muhammed b. Yûsuf el-Firyâbî", 5, 212, "Şam", "Rumûz ع."),
  N("ebulmugirehavlani", "أبو المغيرة عبد القدوس", "Ebû'l-Mugīre Abdülkuddûs el-Havlânî", 5, 212, "Humus", "Rumûz ع."),
  N("suaybishakdimaski", "شعيب بن إسحاق الدمشقي", "Şuayb b. İshak ed-Dımaşkī", 5, 189, "Şam"),
  N("muhammedharbhavlani", "محمد بن حرب الخولاني", "Muhammed b. Harb el-Havlânî", 5, 194, "Humus"),
  N("muhammedsuaybsabur", "محمد بن شعيب بن شابور", "Muhammed b. Şuayb b. Şâbûr", 5, 200, "Şam"),
  N("ubeydullahmusa", "عبيد الله بن موسى العبسي", "Ubeydullah b. Mûsâ el-Absî", 5, 213, "Kûfe"),
  N("amrebiselemetennisi", "عمرو بن أبي سلمة التنيسي", "Amr b. Ebî Seleme et-Tinnîsî", 5, 214, "Mısır"),
  N("mafairan", "المعافى بن عمران", "Me‘âfâ b. İmrân", 5, 185, "Şam"),
  N("bisrbekirtennisi", "بشر بن بكر التنيسي", "Bişr b. Bekir et-Tinnîsî", 5, 205, "Mısır"),
  N("saidabdulaziz", "سعيد بن عبد العزيز التنوخي", "Saîd b. Abdil'azîz et-Tenûhî", 5, 167, "Şam"),
  N("asimbehdele", "عاصم بن بهدلة", "Âsım b. Behdele", 5, 128, "Kûfe", "Yedi kıraat imâmından."),
  N("alizeydcudan", "علي بن زيد بن جدعان", "Ali b. Zeyd b. Cüd‘ân", 5, 131, "Basra"),
  N("amiralhavl", "عامر الأحول", "Âmir el-Ahvel", 5, null, "Basra"),
  N("abdulvarissaid", "عبد الوارث بن سعيد", "Abdülvâris b. Saîd", 5, 180, "Basra"),
  N("abdulvehhabata", "عبد الوهاب بن عطاء", "Abdülvehhâb b. Atâ", 5, 204, "Basra"),
  N("abdesuleyman", "عبدة بن سليمان", "Abde b. Süleymân", 5, 187, "Kûfe"),
  N("muhammedbisrabdi", "محمد بن بشر العبدي", "Muhammed b. Bişr el-Abdî", 5, 203, "Kûfe"),
  N("muhammedebiadi", "محمد بن أبي عدي", "Muhammed b. Ebî Adî", 5, 194, "Basra"),

  // ---- Hammad b. Seleme cevresinde aga giren raviler ----
  N("simakharb", "سماك بن حرب", "Simâk b. Harb", 5, 123, "Kûfe"),
  N("suheylebisalih", "سهيل بن أبي صالح", "Süheyl b. Ebî Sâlih", 5, 138, "Medine", "Ebû Sâlih es-Semmân'ın oğlu."),
  N("selemekuheyl", "سلمة بن كهيل", "Seleme b. Küheyl", 5, 121, "Kûfe"),
  N("cureyri", "سعيد بن إياس الجريري", "Saîd b. İyâs el-Cüreyrî", 5, 144, "Basra", "Mizzî ihtilât kaydını nakleder."),
  N("abdullahavn", "عبد الله بن عون", "Abdullah b. Avn", 5, 151, "Basra"),
  N("ebuimrancevni", "أبو عمران الجوني", "Ebû İmrân el-Cevnî", 5, 128, "Basra"),
  N("abdulmelikumeyr", "عبد الملك بن عمير", "Abdülmelik b. Umeyr", 5, 136, "Kûfe"),
  N("ataisaib", "عطاء بن السائب", "Atâ b. es-Sâib", 5, 136, "Kûfe", "İhtilât ettiği kaydedilir."),
  N("ammarebiammar", "عمار بن أبي عمار", "Ammâr b. Ebî Ammâr", 4, null, "Mekke"),
  N("amryahyamazini", "عمرو بن يحيى المازني", "Amr b. Yahyâ el-Mâzinî", 5, null, "Medine"),
  N("ubeydullahomeri2", "عبد الرحمن بن القاسم", "Abdurrahman b. el-Kâsım", 5, 126, "Medine"),
  N("hebbanhilal", "هدبة بن خالد", "Hüdbe b. Hâlid", 5, 235, "Basra"),
  N("musaismailtebuzeki", "موسى بن إسماعيل التبوذكي", "Mûsâ b. İsmâîl et-Tebûzekî", 5, 223, "Basra"),
  N("hisamtayalisi", "أبو الوليد هشام الطيالسي", "Ebû'l-Velîd Hişâm et-Tayâlisî", 5, 227, "Basra"),
  N("muslimibrahim", "مسلم بن إبراهيم", "Müslim b. İbrâhim", 5, 222, "Basra"),
  N("amrmerzuk", "عمرو بن مرزوق", "Amr b. Merzûk", 5, 224, "Basra"),
  N("ebunasrtemmar", "أبو نصر التمار", "Ebû Nasr et-Temmâr", 5, 228, "Basra"),

  // ---- Ebu Avane cevresinde aga giren raviler ----
  N("caferebivahsiyye", "جعفر بن أبي وحشية", "Ca‘fer b. Ebî Vahşiyye (Ebû Bişr)", 5, 126, "Vâsıt",
    "Vâsıtlı râvi, Ebû Bişr künyesiyle meşhur. İbn Hacer onu \"sika\" sayar ve Saîd b. Cübeyr'den rivayette insanların en sağlamlarından biri olduğunu belirtir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Bununla birlikte Şu'be, onun Habîb b. Sâlim'den ve Mücâhid'den yaptığı rivayetleri zayıf bulmuştur — aynı râvinin bir hocada sağlam, başka bir hocada zayıf sayılabildiğini gösteren örneklerdendir. 125 (veya 126) yılında vefat etti."),
  N("asimahvel", "عاصم بن سليمان الأحول", "Âsım b. Süleymân el-Ahvel", 5, 142, "Basra"),
  N("mugirmiksem", "مغيرة بن مقسم الضبي", "Mugīre b. Miksem ed-Dabbî", 5, 136, "Kûfe"),
  N("firasyahya", "فراس بن يحيى الهمداني", "Firâs b. Yahyâ el-Hemdânî", 5, 129, "Kûfe"),
  N("mansurzazan", "منصور بن زاذان", "Mansûr b. Zâzân", 5, 131, "Vâsıt"),
  N("abdulmelikebisuleyman", "عبد الملك بن أبي سليمان", "Abdülmelik b. Ebî Süleymân", 5, 145, "Kûfe"),
  N("abdulazizsuheyb", "عبد العزيز بن صهيب", "Abdülazîz b. Suheyb", 5, 130, "Basra"),
  N("saidmesrukhsevri", "سعيد بن مسروق الثوري", "Saîd b. Mesrûk es-Sevrî", 5, 126, "Kûfe", "Süfyân es-Sevrî'nin babası."),
  N("yalaata", "يعلى بن عطاء العامري", "Ya‘lâ b. Atâ el-Âmirî", 5, 120, "Vâsıt"),
  N("hilalvezzan", "هلال الوزان", "Hilâl el-Vezzân", 5, null, "Kûfe"),
  N("said_mansur", "سعيد بن منصور", "Saîd b. Mansûr", 5, 227, "Mekke", "es-Sünen sahibi. Rumûz م."),
  N("kavariri", "عبيد الله بن عمر القواريري", "Kavârîrî, Ubeydullah b. Ömer", 5, 235, "Basra"),
  N("seybanferruh", "شيبان بن فروخ", "Şeybân b. Ferrûh", 5, 236, "Basra"),
  N("haccacminhal", "حجاج بن منهال", "Haccâc b. Minhâl", 5, 217, "Basra",
    "Basralı râvi. İbn Hacer onu \"sika, fâzıl\" diye niteler ve dokuzuncu tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Şu'be, Hammâd b. Seleme ve Abdullah b. Avn'dan aldığı rivayetlerle Basra hadisini üçüncü asrın hâfızlarına ulaştıran isimlerdendir. 217 (bir rivayete göre 216) yılında vefat etti."),
  N("halefhisam", "خلف بن هشام البزار", "Halef b. Hişâm el-Bezzâr", 5, 229, "Basra"),

  // ---- Huseym cevresinde aga giren raviler ----
  N("avvamhavseb", "العوام بن حوشب", "Avvâm b. Havşeb", 5, 148, "Vâsıt"),
  N("avfarabi", "عوف الأعرابي", "Avf el-A‘râbî", 5, 146, "Basra"),
  N("abdullahsubrume", "عبد الله بن شبرمة", "Abdullah b. Şübrume", 5, 144, "Kûfe"),
  N("abdulhamidcafer", "عبد الحميد بن جعفر", "Abdülhamîd b. Ca‘fer", 5, 153, "Medine"),
  N("sufyanhusayn", "سفيان بن حسين", "Süfyân b. Husayn", 5, null, "Vâsıt"),
  N("mucalidsaid", "مجالد بن سعيد", "Mücâlid b. Saîd", 5, 144, "Kûfe", "Mizzî, Ahmed b. Hanbel'den: Hüşeym ondan hiçbir şey işitmedi."),
  N("salihhayy", "صالح بن صالح بن حي", "Sâlih b. Sâlih b. Hayy", 5, null, "Kûfe"),
  N("siyarebilhakem", "سيار أبو الحكم", "Siyâr Ebû'l-Hakem", 5, 129, "Vâsıt"),
  N("kasimmihran", "القاسم بن مهران", "Kâsım b. Mihrân", 5, null, "Basra", "Hüşeym'in dayısı."),

  // ---- Huseym'in talebeleri ve Ibn Ishak cevresi ----
  N("saidsuleymansadeviye", "سعيد بن سليمان الواسطي", "Saîd b. Süleymân (Sa‘deveyh)", 5, 225, "Vâsıt", "Mizzî: Hüşeym'in hadisinin kıyyımı («ve hüve kayyimun bi-hadîsihî»)."),
  N("ibnebiseybe", "أبو بكر بن أبي شيبة", "Ebû Bekir b. Ebî Şeybe", 5, 235, "Kûfe", "el-Musannef sahibi. Rumûz م ق."),
  N("zuheyrharb", "زهير بن حرب أبو خيثمة", "Züheyr b. Harb Ebû Hayseme", 5, 234, "Basra"),
  N("alimedini", "علي بن المديني", "Ali b. el-Medînî", 5, 234, "Basra", "el-İlel sahibi. Bu ağın tabaka tasnifi ona aittir."),
  N("alihucr", "علي بن حجر المروزي", "Ali b. Hucr el-Mervezî", 5, 244, "Horasan"),
  N("amrnakid", "عمرو بن محمد الناقد", "Amr b. Muhammed en-Nâkıd", 5, 232, "Basra"),
  N("osmanebiseybe", "عثمان بن أبي شيبة", "Osmân b. Ebî Şeybe", 5, 239, "Kûfe"),
  N("ahmeddevraki", "أحمد بن إبراهيم الدورقي", "Ahmed b. İbrâhim ed-Devrakī", 5, 246, "Basra"),
  N("muhammedisataba", "محمد بن عيسى ابن الطباع", "Muhammed b. Ísâ İbnü't-Tabbâ‘", 5, 224, "Basra", "Mizzî: Hüşeym'i en iyi bilen («ve hüve a‘lemühum bihî»)."),
  N("yezidebihabib", "يزيد بن أبي حبيب", "Yezîd b. Ebî Habîb", 5, 128, "Mısır", "Mısır fakihlerinin önde geleni. Mizzî: İbn İshak'ın hocalarından."),
  N("yalaubeyd", "يعلى بن عبيد الطنافسي", "Ya‘lâ b. Ubeyd et-Tanâfisî", 5, 209, "Kûfe"),
  N("yunusbukeyr", "يونس بن بكير الشيباني", "Yûnus b. Bükeyr eş-Şeybânî", 5, 199, "Kûfe", "İbn İshak'ın Megâzî'sinin râvilerinden."),
  N("abdrahmanesved", "عبد الرحمن بن الأسود", "Abdurrahman b. el-Esved", 3, null, "Kûfe"),

  // ---- Veki' cevresinde aga giren raviler ----
  N("aliebisalihhayy", "علي بن صالح بن حي", "Ali b. Sâlih b. Hayy", 5, 151, "Kûfe"),
  N("alimubarekhinai", "علي بن المبارك الهنائي", "Ali b. el-Mübârek el-Hinâî", 5, null, "Basra"),
  N("omerzerr", "عمر بن ذر الهمداني", "Ömer b. Zerr el-Hemdânî", 5, 153, "Kûfe"),
  N("mesudi", "عبد الرحمن بن عبد الله المسعودي", "Mes‘ûdî, Abdurrahman b. Abdillâh", 5, 160, "Kûfe"),
  N("suleymanmugire", "سليمان بن المغيرة", "Süleymân b. el-Mugīre", 5, 165, "Basra"),
  N("saidubeydtai", "سعيد بن عبيد الطائي", "Saîd b. Ubeyd et-Tâî", 5, null, "Kûfe"),
  N("davudkaysferra", "داود بن قيس الفراء", "Dâvûd b. Kays el-Ferrâ", 5, null, "Medine"),
  N("hanzalasufyan", "حنظلة بن أبي سفيان", "Hanzala b. Ebî Süfyân", 5, 151, "Mekke",
    "Mekkeli râvi; Cumah kabilesinden, Ümeyye b. Halef'in soyundan gelir. İbn Hacer onu \"sika, hüccet\" diye niteler ve altıncı tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Tâvûs, Sâlim b. Abdillâh ve Kāsım b. Muhammed'den aldığı rivayetlerle tanınır. 151 yılında vefat etti."),
  N("abdulazizomer", "عبد العزيز بن عمر بن عبد العزيز", "Abdülazîz b. Ömer b. Abdil‘azîz", 5, null, "Şam"),
  N("misned", "مسدد بن مسرهد", "Müsedded b. Müserhed", 5, 228, "Basra"),
  N("hennadseri", "هناد بن السري", "Hennâd b. es-Serî", 5, 243, "Kûfe"),
  N("ibnmain", "يحيى بن معين", "Yahyâ b. Ma‘în", 5, 233, "Basra", "Cerh-ta‘dîl imâmı. Bu ağdaki semâ kayıtlarının çoğu ondan nakledilir."),
  N("yahyayahyanisaburi", "يحيى بن يحيى النيسابوري", "Yahyâ b. Yahyâ en-Nîsâbûrî", 5, 226, "Horasan"),
  N("mahmudgaylan", "محمود بن غيلان", "Mahmûd b. Gaylân", 5, 239, "Horasan"),
  N("ibnebiomeradeni", "محمد بن يحيى بن أبي عمر العدني", "İbn Ebî Ömer el-Adenî", 5, 243, "Mekke"),
  N("nasralicehdami", "نصر بن علي الجهضمي", "Nasr b. Ali el-Cehdamî", 5, 250, "Basra"),

  // ---- Ibnu'l-Mubarek cevresinde aga giren raviler ----
  N("ibrahimtahman", "إبراهيم بن طهمان", "İbrâhim b. Tahmân", 5, 168, "Horasan",
    "Takrîb 189: «ثقة يغرب وتكلم فيه للإرجاء ويقال رجع عنه». Horasanlı, Nîsâbûr'a sonra Mekke'ye yerleşti."),
  N("ibrahimebiable", "إبراهيم بن أبي عبلة", "İbrâhim b. Ebî Able", 5, 152, "Şam"),
  N("usamezeydeslem", "أسامة بن زيد بن أسلم", "Üsâme b. Zeyd b. Eslem", 5, null, "Medine"),
  N("caferburkan", "جعفر بن برقان", "Ca‘fer b. Burkān", 5, 154, "Şam",
    "Rakkalı râvi, künyesi Ebû Abdullah. İbn Hacer onu \"sadûk\" sayar, fakat Zührî'den yaptığı rivayetlerde vehmettiğini özellikle belirtir; Buhârî el-Edebü'l-müfred'de, Müslim ve dört Sünen ise doğrudan ondan rivayet eder. Meymûn b. Mihrân ve Yezîd b. el-Esam'dan gelen rivayetleriyle Cezîre bölgesi hadisinin taşıyıcılarındandır. 154 yılı dolaylarında vefat etti."),
  N("hayveseri", "حيوة بن شريح المصري", "Hayve b. Şureyh el-Mısrî", 5, 158, "Mısır"),
  N("saidebiyyubmisri", "سعيد بن أبي أيوب المصري", "Saîd b. Ebî Eyyûb el-Mısrî", 5, 161, "Mısır"),
  N("harmalaimran", "حرملة بن عمران التجيبي", "Harmala b. İmrân et-Tüceybî", 5, 160, "Mısır",
    "Mısırlı râvi, künyesi Ebû Hafs; \"el-Hâcib\" diye anılır. İbn Hacer onu \"sika\" sayar ve yedinci tabakadan gösterir; Buhârî el-Edebü'l-müfred'de, Müslim, Ebû Dâvûd, Nesâî ve İbn Mâce ise doğrudan ondan rivayet eder. Torunu Harmele b. Yahyâ, İmam Şâfiî'nin Mısır'daki talebesidir. 160 yılında, seksen yaşında vefat etti."),
  N("ebuburde", "بريد بن عبد الله بن أبي بردة", "Büreyd b. Abdillâh b. Ebî Bürde", 5, null, "Kûfe",
    "Kûfeli râvi; sahâbî Ebû Mûsâ el-Eş'arî'nin torununun oğlu, yani ailesinin üçüncü kuşak râvisidir. İbn Hacer onu \"sika, az hata eder\" diye niteler ve altıncı tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Dedesi Ebû Bürde yoluyla Ebû Mûsâ'ya ulaşan aile isnadı, hadis tarihinde bir ailenin rivayeti nasıl kuşaklar boyu taşıdığının tipik örneklerindendir."),
  N("serieyyahya", "السري بن يحيى", "Serî b. Yahyâ", 5, 167, "Basra"),
  N("sadsaidensari", "سعد بن سعيد الأنصاري", "Sa‘d b. Saîd el-Ensârî", 5, 141, "Medine"),
  N("rebiuenes", "الربيع بن أنس", "Rabî‘ b. Enes", 5, 139, "Şam"),

  // ---- Ibnu'l-Mubarek'in talebeleri ve Yahya el-Kattan cevresi ----
  N("alihasansakik", "علي بن الحسن بن شقيق المروزي", "Ali b. el-Hasan b. Şakīk el-Mervezî", 5, 215, "Horasan", "Rumûz ع."),
  N("abdan", "عبد الله بن عثمان عبدان", "Abdân, Abdullah b. Osmân el-Mervezî", 5, 221, "Horasan", "Rumûz خ م د ت س."),
  N("suveydnasr", "سويد بن نصر الطوساني", "Süveyd b. Nasr et-Tûsânî", 5, 240, "Horasan"),
  N("hasanisad", "الجعيد بن عبد الرحمن", "Cu‘ayd b. Abdirrahman", 5, null, "Medine"),
  N("behzhakim", "بهز بن حكيم", "Behz b. Hakîm", 5, null, "Basra",
    "Basralı râvi; babası Hakîm b. Muâviye, dedesi ise sahâbî Muâviye b. Hayde el-Kuşeyrî'dir. İbn Hacer onu \"sadûk\" sayar ve altıncı tabakadan gösterir. \"Behz, babasından, o da dedesinden\" şeklindeki bu üç kuşaklı aile isnadı, hadis usulünde sıhhati uzun uzadıya tartışılan meşhur bir örnektir: bir kısım âlim onu hasen sayarken bir kısmı delil olarak kullanmakta çekinmiştir. Buhârî ta'lîkan, dört Sünen ise doğrudan ondan rivayet eder. 160'tan önce vefat etti."),
  N("hatimebisagire", "حاتم بن أبي صغيرة", "Hâtim b. Ebî Sagīre", 5, 152, "Basra",
    "Basralı râvi, künyesi Ebû Yûnus. İbn Hacer onu \"sika\" sayar ve altıncı tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. \"Ebû Sagīre\" onun babası değil, anne tarafından dedesi (bir görüşe göre üvey babası) olup adı Müslim'dir. Amr b. Dînâr ve Simâk b. Harb'den aldığı rivayetlerle tanınır. 152 yılında vefat etti."),
  N("hasanzekvan", "الحسن بن ذكوان", "Hasan b. Zekvân", 5, null, "Basra",
    "Basralı râvi, künyesi Ebû Seleme. İbn Hacer onu \"sadûk\" sayar, fakat hata ettiğini, kaderiyye görüşüyle itham edildiğini ve tedlîs yaptığını belirtir; Buhârî, Tirmizî ve İbn Mâce ondan rivayet eder. Altıncı tabakadandır."),
  N("selimhayyan", "سليم بن حيان", "Süleym b. Hayyân", 5, null, "Basra"),
  N("seyfsuleymanmekki", "سيف بن سليمان المكي", "Seyf b. Süleymân el-Mekkî", 5, null, "Mekke"),
  N("husaymirak", "خثيم بن عراك", "Husıym b. İrâk b. Mâlik", 5, null, "Medine"),
  N("esaseabdulmelik", "أشعث بن عبد الملك", "Eş‘as b. Abdilmelik el-Humrânî", 5, 142, "Basra",
    "Basralı râvi ve fakih, künyesi Ebû Hânî. İbn Hacer onu \"sika, fakih\" diye niteler ve altıncı tabakadan sayar; Buhârî ta'lîkan, dört Sünen ise doğrudan ondan rivayet eder. Hasan-ı Basrî ve İbn Sîrîn'den gelen rivayetleriyle tanınır. 142 (bir rivayete göre 146) yılında vefat etti."),

  // ---- Kattan'in talebeleri ve Ibn Mehdi cevresi ----
  N("bundar", "محمد بن بشار بندار", "Muhammed b. Beşşâr (Bündâr)", 5, 252, "Basra", "Rumûz ع."),
  N("ibnmusenna", "محمد بن المثنى أبو موسى", "Muhammed b. el-Müsennâ (Ez-Zemin)", 5, 252, "Basra"),
  N("amrbnalisayrafi", "عمرو بن علي الصيرفي الفلاس", "Amr b. Ali es-Sayrafî (el-Fellâs)", 5, 249, "Basra"),
  N("abbasanberi", "عباس بن عبد العظيم العنبري", "Abbâs b. Abdil‘azīm el-Anberî", 5, 246, "Basra"),
  N("ubeydullahmuazanberi", "عبيد الله بن معاذ العنبري", "Ubeydullah b. Muâz el-Anberî", 5, 237, "Basra"),
  N("yakubdevraki", "يعقوب بن إبراهيم الدورقي", "Ya‘kûb b. İbrâhim ed-Devrakī", 5, 252, "Basra"),
  N("muaviyesalih", "معاوية بن صالح الحضرمي", "Muâviye b. Sâlih el-Hadramî", 5, 158, "Mısır", "Rumûz م ٤."),
  N("israilyunus", "إسرائيل بن يونس", "İsrâîl b. Yûnus", 5, 160, "Kûfe", "Ebû İshak es-Sebîî'nin torunu."),
  N("darevardi", "عبد العزيز بن محمد الدراوردي", "Abdülazîz b. Muhammed ed-Derâverdî", 5, 187, "Medine"),
  N("macisun", "عبد العزيز بن أبي سلمة الماجشون", "Abdülazîz b. Ebî Seleme el-Mâcişûn", 5, 164, "Medine"),
  N("harbseddad", "حرب بن شداد", "Harb b. Şeddâd", 5, 161, "Basra",
    "Basralı râvi, künyesi Ebü'l-Hattâb. İbn Hacer onu \"sika\" sayar ve yedinci tabakadan gösterir; Buhârî, Müslim, Ebû Dâvûd, Tirmizî ve Nesâî ondan rivayet eder. Yahyâ b. Ebî Kesîr ve Katâde'den aldığı rivayetlerle tanınır. 161 yılında vefat etti."),
  N("abdulvahidziyad", "عبد الواحد بن زياد", "Abdülvâhid b. Ziyâd", 5, 176, "Basra"),
  N("malikmigvel", "مالك بن مغول", "Mâlik b. Migvel", 5, 159, "Kûfe"),
  N("sallamebimuti", "سلام بن أبي مطيع", "Sellâm b. Ebî Mutī‘", 5, 164, "Basra"),

  // ---- Ibn Mehdi'nin talebeleri ve Yahya b. Adem cevresi ----
  N("abdhumeyd", "عبد بن حميد", "Abd b. Humeyd", 5, 249, "Horasan", "el-Müsned ve Tefsîr sahibi. Rumûz م."),
  N("ebukureyb", "أبو كريب محمد بن العلاء", "Ebû Küreyb Muhammed b. el-Alâ", 5, 248, "Kûfe"),
  N("muhammedrafi", "محمد بن رافع النيسابوري", "Muhammed b. Râfi‘ en-Nîsâbûrî", 5, 245, "Horasan"),
  N("zuhli", "محمد بن يحيى الذهلي", "Muhammed b. Yahyâ ez-Zühlî", 5, 258, "Horasan"),
  N("muhammedabdulalasanani", "محمد بن عبد الأعلى الصنعاني", "Muhammed b. Abdil'alâ es-San‘ânî", 5, 245, "Yemen"),
  N("mucahidmusa", "مجاهد بن موسى", "Mücâhid b. Mûsâ", 5, 244, "Basra"),
  N("ebubekirayyas", "أبو بكر بن عياش", "Ebû Bekir b. Ayyâş", 5, 193, "Kûfe"),
  N("ebumuaviyedarir", "أبو معاوية الضرير", "Ebû Muâviye ed-Darîr", 5, 195, "Kûfe"),
  N("muhammedfudayl", "محمد بن فضيل بن غزوان", "Muhammed b. Fudayl b. Gazvân", 5, 195, "Kûfe"),
  N("fudaylibnayaz", "فضيل بن عياض", "Fudayl b. İyâz", 5, 187, "Mekke"),
  N("kaysrebi", "قيس بن الربيع", "Kays b. er-Rabî‘", 5, 168, "Kûfe"),
  N("fitrhalife", "فطر بن خليفة", "Fıtr b. Halîfe", 5, 155, "Kûfe"),
  N("abdusselamharb", "عبد السلام بن حرب", "Abdüsselâm b. Harb", 5, 187, "Kûfe"),

  // ---- Ibn Ebi Zaide cevresinde aga giren raviler ----
  N("halidselememahzumi", "خالد بن سلمة المخزومي", "Hâlid b. Seleme el-Mahzûmî", 5, null, "Kûfe"),
  N("abdulmelikhumeyd", "عبد الملك بن حميد بن أبي عيينة", "Abdülmelik b. Humeyd b. Ebî Uyeyne", 5, null, "Basra"),
  N("amrmeymunmihran", "عمرو بن ميمون بن مهران", "Amr b. Meymûn b. Mihrân", 5, null, "Şam"),
  N("musacuheni", "موسى الجهني", "Mûsâ el-Cühenî", 5, null, "Kûfe"),
  N("nafiomercumahi", "نافع بن عمر الجمحي", "Nâfi‘ b. Ömer el-Cümahî", 5, 169, "Mekke"),
  N("hasimhasim", "هاشم بن هاشم بن عتبة", "Hâşim b. Hâşim b. Utbe", 5, null, "Medine"),
  N("ebumalikesceyi", "أبو مالك الأشجعي", "Ebû Mâlik el-Eşce‘î", 5, null, "Kûfe"),
  N("leysebisuleym", "ليث بن أبي سليم", "Leys b. Ebî Süleym", 5, 143, "Kûfe"),
  N("harunmaruf", "هارون بن معروف", "Hârûn b. Ma‘rûf", 5, 231, "Basra"),
  N("ibrahimmusaferra", "إبراهيم بن موسى الفراء", "İbrâhim b. Mûsâ el-Ferrâ", 5, 220, "Kûfe",
    "Takrîb 259: «ثقة حافظ». Rey'li, «es-Sagīr» lakabıyla anılır. 220'den sonra vefat etti."),
  N("sericyunus", "سريج بن يونس", "Serîc b. Yûnus", 5, 235, "Basra"),
  N("hasanarafe", "الحسن بن عرفة", "Hasan b. Arafe", 5, 257, "Basra"),
  N("muhammedubeydmuharibi", "محمد بن عبيد المحاربي", "Muhammed b. Ubeyd el-Muhâribî", 5, 245, "Kûfe"),

  // ---- Kütüb-i Sitte müellifleri ----
  N("buhari", "محمد بن إسماعيل البخاري", "Buhârî", 5, 256, "Mâverâünnehir", "el-Câmi‘u's-sahîh sahibi. Mizzî: «bu işin imâmı, kendisine uyulanı ve kitabı bütün İslâm ehli arasında dayanak olan.» Horasan, Cibâl, bütün Irak şehirleri, Hicaz, Şam ve Mısır'da hadis yazdı."),
  N("muslim", "مسلم بن الحجاج القشيري", "Müslim b. el-Haccâc", 5, 261, "Horasan", "es-Sahîh sahibi. Tehzîb 6245, Nîsâbûrî."),
  N("ebudavud", "أبو داود السجستاني", "Ebû Dâvûd es-Sicistânî", 5, 275, "Basra", "es-Sünen sahibi."),
  N("tirmizi", "محمد بن عيسى الترمذي", "Tirmizî", 5, 279, "Horasan", "el-Câmi‘ ve el-İlel sahibi."),
  N("nesai", "أحمد بن شعيب النسائي", "Nesâî", 5, 303, "Mısır", "es-Sünen sahibi. Nisbesi Horasan'daki Nesâ'ya ait; Zehebî, Siyer 14/127: «Horasan, Hicaz, Mısır, Irak, Cezîre, Şam ve serhat boylarında ilim için dolaştı, sonra Mısır'a yerleşti ve hâfızlar ona rihle etti» — «ثم استوطن مصر، ورحل الحفاظ إليه»."),

  /* ---- Muslim'in talebeleri — Tehzîb 5923 (Samile 3722, s. 27/504-505) ----

     TABAKA 6 = "muellif sonrasi". Bunlar ag'in SON SINIRI (Mustafa'nin
     karari, 2026-08-29): kendi talebeleri artik eklenmeyecek.

     CEVIRI YAZI YOK, adlar Arapca (Mustafa'nin karari). Bu isimlerin
     cogunun DIA'da maddesi yok; ceviri yazi her biri icin ayri bir
     karar demek olurdu.

     ADLAR TURKCE, ceviri yazi isaretleri titizlikle uygulanmadan
     (Mustafa'nin karari, 2026-08-29). Arapca asillari `ar` alaninda.

     VEFAT YILLARI KAYNAKTAN GELIYOR ama HENUZ EKSIK. Mizzi bu listede
     tarih vermiyor -- Tehzîb Kutub-i Sitte ravilerini kapsiyor, bu
     isimler bir tabaka sonrasi. Dogru kaynak ZEHEBI, SIYERU
     A'LAMI'N-NUBELA (Samile 10906): tabakalari olum onyillarina gore
     dizili ve fihristi makineyle okunabiliyor, yani terceme aramak
     yerine dogrudan bulunuyor. Ayni bilgi Tezkiretu'l-huffaz'da
     (Samile 1583) daha kisa haliyle var.
     29 isimden 11'inin tarihi Siyer'den alindi ve dugum notlarinda
     Arapca nakliyle duruyor. Kalan 18'i tabakanin varsayilan yilina
     (TAHMIN[6]) oturuyor, yani DIKEY KONUMLARI KESIN DEGIL --
     bakarken bu akilda tutulmali. Yontem kurulu: Siyer'in tabaka
     fihristinden isim bulunuyor, tercemenin son sayfasindaki vefat
     kaydi okunuyor. Isim basina 2-4 cagri.

     BELDE nisbeden turetildi (النيسابوري/البلخي/السرخسي -> Horasan,
     البخاري -> Maveraunnehir, الرازي -> Cibal...). Nisbesi olmayanlar
     Muslim'in beldesine kondu; bunlarin cogu zaten Nisabur halkasi.
     Kesin degil, tercemelerinden teyit edilmeli. */
  N("ms01", "إبراهيم بن إسحاق الصيرفي", "İbrâhim b. İshak es-Sayrafî", 6, null, "Horasan"),
  N("ms02", "إبراهيم بن أبي طالب", "İbrâhim b. Ebî Tâlib", 6, 295, "Horasan", "Siyer 13/551: «تُوُفِّيَ إبراهيم في ثاني رجب سنة خمس وتسعين ومئتين»."),
  N("ms03", "إبراهيم بن محمد بن حمزة", "İbrâhim b. Muhammed b. Hamza", 6, null, "Horasan"),
  N("ms04", "إبراهيم بن محمد بن سفيان الفقيه", "İbrâhim b. Muhammed b. Süfyân el-Fakīh", 6, 308, "Horasan", "Sahîh-i Müslim'in râvisi; Mizzî'nin listesinde «إبراهيم بن محمد بن سفيان الفقيه» diye geçer. Hâkim: «Müslim'e ayrılmayan âbid müctehidlerden.» Siyer 14/312: «توفي ابن سفيان عشية الاثنين ودفن يومئذ في رجب سنة ثمان وثلاث مئة»."),
  N("ms05", "أبو حامد أحمد بن حمدون بن رستم الأعمشي", "Ebû Hâmid Ahmed b. Hamdûn el-A‘meşî", 6, 321, "Horasan", "Hamdûn el-Kassâr'ın oğlu olduğu söylenir. İbn Huzeyme onu A'meş'in rivayetleri konusunda sınamış, ezberine hayran kalmıştır. Siyer 14/554: «مات أبو حامد في ربيع الأول سنة إحدى وعشرين وثلاث مئة وقد قارب التسعين»."),
  N("ms06", "أبو الفضل أحمد بن سلمة الحافظ", "Ebü'l-Fazl Ahmed b. Seleme", 6, 286, "Horasan", "Müslim'in rihlede yol arkadaşı. Zehebî, Siyer 13/373: «تُوُفِّيَ ابن سلمة في غرة جمادى الآخرة سنة ست وثمانين ومئتين»."),
  N("ms07", "أبو حامد أحمد بن علي بن الحسن بن حسنويه المقرئ", "Ebû Hâmid Ahmed b. Ali b. Hasneveyh el-Mukrî", 6, null, "Horasan"),
  N("ms08", "أبو عمرو أحمد بن المبارك المستملي", "Ebû Amr Ahmed b. el-Mübârek el-Müstemlî", 6, null, "Horasan"),
  N("ms09", "أبو حامد أحمد بن محمد بن الحسن بن الشرقي", "Ebû Hâmid Ahmed b. Muhammed b. eş-Şarkī", 6, null, "Horasan"),
  N("ms10", "أبو عمرو أحمد بن نصر الخفاف الحافظ", "Ebû Amr Ahmed b. Nasr el-Haffâf", 6, 299, "Horasan", "Nîsâbûr'un reisi, «zeynü'l-eşrâf» lakabıyla anılırdı. Siyer 13/562: «وكانت وفاته في شهر شعبان سنة تسع وتسعين ومئتين من أبناء الثمانين»."),
  N("ms11", "أبو سعيد حاتم بن أحمد بن محمود الكندي البخاري", "Ebû Saîd Hâtim b. Ahmed el-Kindî el-Buhârî", 6, null, "Mâverâünnehir"),
  N("ms12", "الحسين بن محمد بن زياد القباني", "Hüseyin b. Muhammed el-Kabbânî", 6, 289, "Horasan", "Siyer 13/502, torunu Abdullah b. Ali'den: «توفي جدي الحسين بن محمد سنة تسع وثمانين ومئتين»."),
  N("ms13", "أبو يحيى زكريا بن داود الخفاف", "Ebû Yahyâ Zekeriyyâ b. Dâvûd el-Haffâf", 6, null, "Horasan"),
  N("ms14", "سعيد بن عمرو البرذعي الحافظ", "Saîd b. Amr el-Berzaî", 6, 292, "Horasan", "Siyer 14/78, İbn Ukde'den: «توفي سنة اثنتين وتسعين ومئتين»."),
  N("ms15", "صالح بن محمد البغدادي الحافظ", "Sâlih b. Muhammed el-Bağdâdî", 6, null, "Horasan"),
  N("ms16", "أبو محمد عبد الله بن أحمد بن عبد السلام الخفاف النيسابوري", "Ebû Muhammed Abdullah b. Ahmed el-Haffâf", 6, null, "Horasan"),
  N("ms17", "أبو محمد عبد الله بن محمد بن الحسن بن الشرقي", "Ebû Muhammed Abdullah b. Muhammed b. eş-Şarkī", 6, null, "Horasan"),
  N("ms18", "أبو علي عبد الله بن محمد بن علي البلخي الحافظ", "Ebû Ali Abdullah b. Muhammed el-Belhî", 6, null, "Horasan"),
  N("ms19", "عبد الله بن يحيى السرخسي القاضي", "Abdullah b. Yahyâ es-Serahsî", 6, null, "Horasan"),
  N("ms20", "عبد الرحمن بن أبي حاتم الرازي", "Abdurrahman b. Ebî Hâtim er-Râzî", 6, null, "Cibâl"),
  N("ms21", "علي بن إسماعيل الصفار", "Ali b. İsmâîl es-Saffâr", 6, null, "Horasan"),
  N("ms22", "علي بن الحسن بن أبي عيسى الهلالي", "Ali b. el-Hasen el-Hilâlî", 6, null, "Horasan"),
  N("ms23", "علي بن الحسين بن الجنيد الرازي", "Ali b. el-Hüseyin b. el-Cüneyd er-Râzî", 6, 291, "Cibâl", "Rey'de Mâlik'in hadisini derlediği için «el-Mâlikî» diye bilinirdi. Vefatında ihtilâf var: Ebü'ş-Şeyh 291, Halîlî 288. Zehebî 291'i tercih eder — Siyer 14/17: «الأصح وفاته في آخر سنة إحدى وتسعين ومئتين»."),
  N("ms24", "الفضل بن محمد بن علي البلخي", "Fazl b. Muhammed el-Belhî", 6, null, "Horasan"),
  N("ms25", "أبو بكر محمد بن النضر بن سلمة بن الجارود الجارودي", "Ebû Bekir Muhammed b. en-Nadr el-Cârûdî", 6, 291, "Horasan", "Müslim'in rihlede yol arkadaşı; Hâkim onu «şeyhu vaktihî» sayar. Siyer 13/543: «فدفن عشية الخميس السابع عشر من شهر ربيع الأول سنة إحدى وتسعين ومئتين»."),
  N("ms26", "أبو حاتم مكي بن عبدان التميمي", "Ebû Hâtim Mekkî b. Abdân et-Temîmî", 6, null, "Horasan"),
  N("ms27", "أبو محمد نصر بن أحمد بن نصر الحافظ المعروف بنصرك", "Ebû Muhammed Nasr b. Ahmed (Nasrek)", 6, 293, "Horasan", "Buhârâ'ya yerleşti, el-Müsned'i tasnif etti. Siyer 13/538: «توفي سنة ثلاث وتسعين ومئتين»."),
  N("ms28", "يحيى بن محمد بن صاعد", "Yahyâ b. Muhammed b. Sâid", 6, 318, "Kûfe", "Bağdatlı; sünenleri ahkâma göre tasnif etti. Siyer 14/505, İbn Şâhîn'den: «توفي ابن صاعد بالكوفة في ذي القعدة سنة ثمان عشرة وثلاث مئة عن تسعين سنة وأشهر». Ağda Bağdat sütunu olmadığı için vefat ettiği yere, Kûfe'ye konuldu."),
  N("ms29", "أبو عوانة الإسفراييني", "Ebû Avâne el-İsferâyînî", 6, null, "Horasan"),

  /* ---- Ebû Dâvûd, Tirmizî, Nesâî ve İbn Mâce'nin talebeleri ----

     Kaynak MIZZI DEGIL, ZEHEBI: Tehzîb Kütüb-i Sitte râvilerini
     kapsıyor, bu isimler bir tabaka sonrası ve orada tercemeleri yok.
     Siyeru a'lâmi'n-nübelâ'nın müellif tercemelerindeki «حدث عنه»
     listeleri kullanıldı; her kenarın kaynak alanında cilt/sayfa var.

     Müslim'in talebeleriyle aynı kurallar: tabaka 6 (ağın son sınırı),
     Türkçe adlar çeviri yazı işaretleri titizlikle uygulanmadan,
     Arapça asılları `ar` alanında, vefat yılı YOK (Zehebî bu
     listelerde tarih vermiyor), belde nisbeden türetildi.

     Listede zaten düğümü olan isimler (Tirmizî, Nesâî, Ebû Avâne
     el-İsferâyînî) yeniden açılmadı, yalnızca kenarları eklendi. */
  N("ed01", "إبراهيم بن حمدان العاقولي", "İbrâhim b. Hamdân el-Âkūlî", 6, null, "Horasan"),
  N("ed02", "أبو الطيب أحمد بن إبراهيم الأشناني", "Ebü't-Tayyib Ahmed b. İbrâhim el-Üşnânî", 6, null, "Basra"),
  N("ed03", "أبو حامد أحمد بن جعفر الأشعري", "Ebû Hâmid Ahmed b. Ca‘fer el-Eş‘arî el-Isfahânî", 6, null, "Basra"),
  N("ed04", "أبو بكر النجاد", "Ebû Bekir en-Neccâd", 6, null, "Basra"),
  N("ed05", "أبو عمرو أحمد بن علي البصري", "Ebû Amr Ahmed b. Ali el-Basrî", 6, null, "Basra"),
  N("ed06", "أحمد بن داود بن سليم", "Ahmed b. Dâvûd b. Süleym", 6, null, "Basra"),
  N("ed07", "أبو سعيد بن الأعرابي", "Ebû Saîd İbnü'l-A‘râbî", 6, null, "Basra"),
  N("ed08", "أبو بكر أحمد بن محمد الخلال", "Ebû Bekir Ahmed b. Muhammed el-Hallâl", 6, null, "Basra"),
  N("ed09", "أحمد بن محمد بن ياسين الهروي", "Ahmed b. Muhammed b. Yâsîn el-Herevî", 6, null, "Horasan"),
  N("ed10", "أحمد بن المعلى الدمشقي", "Ahmed b. el-Muallâ ed-Dımaşkī", 6, null, "Şam"),
  N("ed11", "إسحاق بن موسى الرملي الوراق", "İshak b. Mûsâ er-Remlî el-Verrâk", 6, null, "Şam"),
  N("ed12", "إسماعيل بن محمد الصفار", "İsmâîl b. Muhammed es-Saffâr", 6, null, "Basra"),
  N("ed13", "حرب بن إسماعيل الكرماني", "Harb b. İsmâîl el-Kirmânî", 6, null, "Cibâl"),
  N("ed14", "الحسن بن صاحب الشاشي", "Hasan b. Sâhib eş-Şâşî", 6, null, "Mâverâünnehir"),
  N("ed15", "الحسن بن عبد الله الذارع", "Hasan b. Abdillâh ez-Zâri‘", 6, null, "Basra"),
  N("ed16", "الحسين بن إدريس الهروي", "Hüseyin b. İdrîs el-Herevî", 6, null, "Horasan"),
  N("ed17", "زكريا بن يحيى الساجي", "Zekeriyyâ b. Yahyâ es-Sâcî", 6, null, "Basra"),
  N("ed18", "عبدان عبد الله بن أحمد الأهوازي", "Abdân Abdullah b. Ahmed el-Ahvâzî", 6, null, "Cibâl"),
  N("ed19", "أبو بكر بن أبي داود", "Ebû Bekir b. Ebî Dâvûd", 6, null, "Basra"),
  N("ed20", "أبو بكر بن أبي الدنيا", "Ebû Bekir İbn Ebi'd-Dünyâ", 6, null, "Basra"),
  N("ed21", "عبد الرحمن بن خلاد الرامهرمزي", "Abdurrahman b. Hallâd er-Râmhürmüzî", 6, null, "Cibâl"),
  N("ed22", "علي بن الحسن بن العبد الأنصاري", "Ali b. el-Hasen b. el-Abd el-Ensârî", 6, null, "Basra"),
  N("ed23", "الفضل بن العباس بن أبي الشوارب", "Fazl b. el-Abbâs b. Ebi'ş-Şevârib", 6, null, "Basra"),
  N("ed24", "أبو بشر الدولابي", "Ebû Bişr ed-Dûlâbî", 6, null, "Mısır"),
  N("ed25", "أبو علي محمد بن أحمد اللؤلؤي", "Ebû Ali Muhammed b. Ahmed el-Lü'lüî", 6, null, "Basra"),
  N("ed26", "محمد بن بكر بن داسة التمار", "Muhammed b. Bekir b. Dâse et-Temmâr", 6, null, "Basra"),
  N("ed27", "محمد بن جعفر الفريابي", "Muhammed b. Ca‘fer el-Firyâbî", 6, null, "Basra"),
  N("ed28", "محمد بن مخلد العطار", "Muhammed b. Mahled el-Attâr", 6, null, "Basra"),
  N("ed29", "أبو عبيد محمد بن علي الآجري", "Ebû Ubeyd Muhammed b. Ali el-Âcurrî", 6, null, "Basra"),
  N("tr01", "أبو بكر أحمد بن إسماعيل السمرقندي", "Ebû Bekir Ahmed b. İsmâîl es-Semerkandî", 6, null, "Mâverâünnehir"),
  N("tr02", "أبو حامد أحمد بن عبد الله المروزي", "Ebû Hâmid Ahmed b. Abdillâh el-Mervezî", 6, null, "Horasan"),
  N("tr03", "أحمد بن علي بن حسنويه المقرئ", "Ahmed b. Ali b. Hasneveyh el-Mukrî", 6, null, "Mâverâünnehir"),
  N("tr04", "أحمد بن يوسف النسفي", "Ahmed b. Yûsuf en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr05", "أسد بن حمدويه النسفي", "Esed b. Hamdeveyh en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr06", "الحسين بن يوسف الفربري", "Hüseyin b. Yûsuf el-Firebrî", 6, null, "Mâverâünnehir"),
  N("tr07", "حماد بن شاكر الوراق", "Hammâd b. Şâkir el-Verrâk", 6, null, "Mâverâünnehir"),
  N("tr08", "داود بن نصر البزدوي", "Dâvûd b. Nasr el-Bezdevî", 6, null, "Mâverâünnehir"),
  N("tr09", "الربيع بن حيان الباهلي", "Rebî‘ b. Hayyân el-Bâhilî", 6, null, "Mâverâünnehir"),
  N("tr10", "عبد الله بن نصر أخو البزدوي", "Abdullah b. Nasr (Bezdevî'nin kardeşi)", 6, null, "Mâverâünnehir"),
  N("tr11", "عبد بن محمد بن محمود النسفي", "Abd b. Muhammed b. Mahmûd en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr12", "علي بن عمر بن كلثوم السمرقندي", "Ali b. Ömer b. Külsûm es-Semerkandî", 6, null, "Mâverâünnehir"),
  N("tr13", "الفضل بن عمار الصرام", "Fazl b. Ammâr es-Sarrâm", 6, null, "Mâverâünnehir"),
  N("tr14", "أبو العباس محمد بن أحمد بن محبوب", "Ebü'l-Abbâs Muhammed b. Ahmed b. Mahbûb", 6, null, "Mâverâünnehir"),
  N("tr15", "أبو جعفر محمد بن أحمد النسفي", "Ebû Ca‘fer Muhammed b. Ahmed en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr16", "أبو جعفر محمد بن سفيان النسفي", "Ebû Ca‘fer Muhammed b. Süfyân en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr17", "محمد بن محمد بن يحيى الهروي القراب", "Muhammed b. Muhammed el-Herevî el-Karrâb", 6, null, "Horasan"),
  N("tr18", "محمد بن محمود بن عنبر النسفي", "Muhammed b. Mahmûd b. Anber en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr19", "محمد بن مكي بن نوح النسفي", "Muhammed b. Mekkî b. Nûh en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr20", "مسبح بن أبي موسى الكاجري", "Müsebbih b. Ebî Mûsâ el-Kâcerî", 6, null, "Mâverâünnehir"),
  N("tr21", "مكحول بن الفضل النسفي", "Mekhûl b. el-Fazl en-Nesefî", 6, null, "Mâverâünnehir"),
  N("tr22", "نصر بن محمد بن سبرة", "Nasr b. Muhammed b. Sebre", 6, null, "Mâverâünnehir"),
  N("tr23", "الهيثم بن كليب الشاشي", "Heysem b. Küleyb eş-Şâşî", 6, null, "Mâverâünnehir"),
  N("ns02", "أبو جعفر الطحاوي", "Ebû Ca‘fer et-Tahâvî", 6, null, "Mısır"),
  N("ns03", "أبو علي النيسابوري", "Ebû Ali en-Nîsâbûrî", 6, null, "Horasan"),
  N("ns04", "حمزة بن محمد الكناني", "Hamza b. Muhammed el-Kinânî", 6, null, "Mısır"),
  N("ns05", "أبو جعفر أحمد بن محمد النحاس", "Ebû Ca‘fer Ahmed b. Muhammed en-Nehhâs", 6, null, "Mısır"),
  N("ns06", "أبو بكر محمد بن أحمد بن الحداد", "Ebû Bekir Muhammed b. Ahmed İbnü'l-Haddâd", 6, null, "Mısır"),
  N("ns07", "عبد الكريم بن أبي عبد الرحمن النسائي", "Abdülkerîm b. Ebî Abdirrahman en-Nesâî", 6, null, "Mısır"),
  N("ns08", "الحسن بن الخضر الأسيوطي", "Hasan b. el-Hıdr el-Üsyûtî", 6, null, "Mısır"),
  N("ns09", "أبو بكر أحمد بن محمد بن السني", "Ebû Bekir Ahmed b. Muhammed İbnü's-Sünnî", 6, null, "Mısır"),
  N("ns10", "أبو القاسم سليمان بن أحمد الطبراني", "Ebü'l-Kāsım Süleymân b. Ahmed et-Taberânî", 6, null, "Mısır"),
  N("ns11", "محمد بن معاوية بن الأحمر الأندلسي", "Muhammed b. Muâviye İbnü'l-Ahmer el-Endelüsî", 6, null, "Mısır"),
  N("ns12", "الحسن بن رشيق", "Hasan b. Rüşeyk", 6, null, "Mısır"),
  N("ns13", "محمد بن عبد الله بن حيويه النيسابوري", "Muhammed b. Abdillâh b. Hayyeveyh en-Nîsâbûrî", 6, null, "Horasan"),
  N("ns14", "محمد بن موسى المأموني", "Muhammed b. Mûsâ el-Me'mûnî", 6, null, "Mısır"),
  N("ns15", "أبيض بن محمد بن أبيض", "Ebyaz b. Muhammed b. Ebyaz", 6, null, "Mısır"),
  N("im01", "محمد بن عيسى الأبهري", "Muhammed b. Îsâ el-Ebherî", 6, null, "Cibâl"),
  N("im02", "أبو الطيب أحمد بن روح البغدادي", "Ebü't-Tayyib Ahmed b. Ravh el-Bağdâdî", 6, null, "Basra"),
  N("im03", "أبو عمرو أحمد بن محمد بن حكيم المديني", "Ebû Amr Ahmed b. Muhammed b. Hakîm el-Medînî", 6, null, "Cibâl"),
  N("im04", "أبو الحسن علي بن إبراهيم القطان", "Ebü'l-Hasen Ali b. İbrâhim el-Kattân", 6, null, "Basra"),
  N("im05", "سليمان بن يزيد الفامي", "Süleymân b. Yezîd el-Fâmî", 6, null, "Cibâl"),

  /* ---- Buhârî'nin talebeleri — Siyer 12/397 ----
     Zehebî'nin «روى عنه خلق كثير، منهم» listesi. Ağda zaten düğümü olan
     isimler (Tirmizî, Müslim, Ebû Hâtim, Cezere, İbn Sâid, İbn Ebî
     Dâvûd, İbn Ebi'd-Dünyâ) yeniden açılmadı. */
  N("bh03", "إبراهيم بن إسحاق الحربي", "İbrâhim b. İshak el-Harbî", 6, null, "Basra"),
  N("bh05", "أبو بكر أحمد بن عمرو بن أبي عاصم", "Ebû Bekir Ahmed b. Amr İbn Ebî Âsım", 6, null, "Basra"),
  N("bh06", "صالح بن محمد جزرة", "Sâlih b. Muhammed (Cezere)", 6, null, "Basra"),
  N("bh07", "محمد بن عبد الله الحضرمي مطين", "Muhammed b. Abdillâh el-Hadramî (Mutayyen)", 6, null, "Vâsıt"),
  N("bh08", "إبراهيم بن معقل النسفي", "İbrâhim b. Ma‘kıl en-Nesefî", 6, null, "Mâverâünnehir"),
  N("bh09", "عبد الله بن ناجية", "Abdullah b. Nâciye", 6, null, "Basra"),
  N("bh10", "أبو بكر محمد بن إسحاق بن خزيمة", "Ebû Bekir Muhammed b. İshak İbn Huzeyme", 6, null, "Basra"),
  N("bh11", "عمر بن محمد بن بجير", "Ömer b. Muhammed b. Büceyr", 6, null, "Basra"),
  N("bh12", "أبو قريش محمد بن جمعة", "Ebû Kureyş Muhammed b. Cum‘a", 6, null, "Basra"),
  N("bh14", "محمد بن يوسف الفربري", "Muhammed b. Yûsuf el-Firebrî", 6, null, "Mâverâünnehir"),
  N("bh15", "منصور بن محمد مزبزدة", "Mansûr b. Muhammed (Mizbezde)", 6, null, "Basra"),
  N("bh17", "الحسين بن إسماعيل المحاملي", "Hüseyin b. İsmâîl el-Mehâmilî", 6, null, "Basra"),
  N("bh18", "القاسم بن إسماعيل المحاملي", "Kāsım b. İsmâîl el-Mehâmilî", 6, null, "Basra"),
  N("bh19", "عبد الله بن محمد بن الأشقر", "Abdullah b. Muhammed İbnü'l-Eşkar", 6, null, "Basra"),
  N("bh20", "محمد بن سليمان بن فارس", "Muhammed b. Süleymân b. Fâris", 6, null, "Basra"),
  N("bh21", "محمود بن عنبر النسفي", "Mahmûd b. Anber en-Nesefî", 6, null, "Mâverâünnehir"),

  N("ibnmace", "محمد بن يزيد ابن ماجه", "İbn Mâce", 5, 273, "Cibâl", "es-Sünen sahibi."),
  N("darimi", "عبد الله بن عبد الرحمن الدارمي", "Dârimî", 5, 255, "Horasan"),
  N("ebuzuraraazi", "أبو زرعة الرازي", "Ebû Zür‘a er-Râzî", 5, 264, "Cibâl"),
  N("ebuhatimrazi", "أبو حاتم الرازي", "Ebû Hâtim er-Râzî", 5, 277, "Cibâl"),
  N("harmalayahya", "حرملة بن يحيى التجيبي", "Harmala b. Yahyâ et-Tüceybî", 5, 243, "Mısır",
    "Mısırlı râvi ve fakih; İmam Şâfiî'nin Mısır'daki en yakın talebelerinden. Şâfiî'nin el-Ümm dışında kalan bazı eserleri onun rivayetiyle bilinir. İbn Hacer onu \"sadûk\" sayar ve on birinci tabakadan gösterir; Müslim, Nesâî ve İbn Mâce ondan rivayet eder. Dedesi Harmele b. İmrân da bir râvidir. 243 (veya 244) yılında vefat etti."),
  N("ishakkevsec", "إسحاق بن منصور الكوسج", "İshak b. Mansûr el-Kevsec", 5, 251, "Şam",
    "Merv'e yerleşmiş râvi ve fakih. İbn Hacer onu \"sika, sebt\" diye niteler ve on birinci tabakadan sayar; Buhârî, Müslim, Tirmizî, Nesâî ve İbn Mâce ondan rivayet eder. Ahmed b. Hanbel ile İshak b. Râhûye'ye yönelttiği fıkhî soruları derlediği Mesâil'iyle tanınır. 251'de vefat etti."),
  N("ibrahimmunzirhizami", "إبراهيم بن المنذر الحزامي", "İbrâhim b. el-Münzir el-Hizâmî", 5, 236, "Medine"),
  N("ademebiiyas", "آدم بن أبي إياس", "Âdem b. Ebî İyâs el-Askalânî", 5, 220, "Şam"),
  N("hasanaliayyal", "الحسن بن علي الخلال", "Hasan b. Ali el-Hallâl", 5, 242, "Basra",
    "Aslen Hüzeyl mevlâsı, Hulvân'a nisbetle Hulvânî diye anılır; sonradan Mekke'ye yerleşti. İbn Hacer onu \"sika, hâfız\" diye niteler ve telif sahibi olduğunu belirtir; Buhârî, Müslim, Ebû Dâvûd, Tirmizî ve İbn Mâce ondan rivayet eder. Hicaz, Irak ve Horasan'ın hadis birikimini bir araya getiren on birinci tabaka râvilerindendir. 242 yılında vefat etti."),
  N("suveydsaidhadesani", "سويد بن سعيد الحدثاني", "Süveyd b. Saîd el-Hadesânî", 5, 240, "Şam"),
  N("ibrahimkariz", "إبراهيم بن عبد الله بن قارظ", "İbrâhim b. Abdillâh b. Kâriz", 2, null, "Medine"),
  N("hakemmina", "الحكم بن ميناء", "Hakem b. Mînâ", 2, null, "Medine"),
  N("ishaktalha", "إسحاق بن عبد الله بن أبي طلحة", "İshak b. Abdillâh b. Ebî Talha", 4, 132, "Medine", "Rumûz خ م س."),
  N("abdullahebikatade", "عبد الله بن أبي قتادة", "Abdullah b. Ebî Katâde", 3, 95, "Medine", "Rumûz ع."),
  N("ebukilabe", "أبو قلابة الجرمي", "Ebû Kılâbe el-Cermî", 4, 104, "Basra", "Rumûz ع."),
  N("ebunadra", "أبو نضرة العبدي", "Ebû Nadra el-Abdî", 4, 108, "Basra"),
  N("ubeydullahmiksem", "عبيد الله بن مقسم", "Ubeydullah b. Miksem", 4, null, "Medine"),
  N("hilalebimeymune", "هلال بن أبي ميمونة", "Hilâl b. Ebî Meymûne", 4, null, "Medine"),
  N("muhammedibrahimteymi", "محمد بن إبراهيم التيمي", "Muhammed b. İbrâhim et-Teymî", 4, 120, "Medine"),
  N("alimubarek", "علي بن المبارك", "Ali b. el-Mübârek", 5, null, "Basra", "Rumûz ع."),
  N("hisamhassan", "هشام بن حسان", "Hişâm b. Hassân", 5, 148, "Basra"),
  N("haccacsavvaf", "حجاج بن أبي عثمان الصواف", "Haccâc b. Ebî Osmân es-Savvâf", 5, 143, "Basra",
    "Basralı râvi, künyesi Ebü's-Salt. İbn Hacer onu \"sika, hâfız\" diye niteler ve altıncı tabakadan sayar; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Yahyâ b. Ebî Kesîr ve Katâde'den aldığı rivayetlerle Basra'nın sağlam râvilerinden sayılır. 143 yılında vefat etti."),
  N("huseynmuallim", "حسين المعلم", "Hüseyin el-Muallim", 5, 145, "Basra",
    "Basralı râvi; çocuklara yazı öğrettiği için \"el-Muallim\" ve \"el-Mükettib\" diye anılır. İbn Hacer onu \"sika\" sayar, bazan vehmettiğini ekler ve altıncı tabakadan gösterir; Kütüb-i Sitte'nin altısı da ondan rivayet eder. Amr b. Şuayb ve Katâde'den aldığı rivayetlerle tanınır. 145 yılında vefat etti."),
  N("seybannahvi", "شيبان بن عبد الرحمن النحوي", "Şeybân b. Abdirrahman en-Nahvî", 5, 164, "Basra"),
  N("muaviyesellam", "معاوية بن سلام", "Muâviye b. Sellâm", 5, null, "Şam", "Rumûz ع."),
  N("yahyasaidensari", "يحيى بن سعيد الأنصاري", "Yahyâ b. Saîd el-Ensârî", 5, 143, "Medine", "Mizzî: Yahyâ b. Ebî Kesîr'in akranlarından."),
  N("ikrimeammar", "عكرمة بن عمار", "İkrime b. Ammâr", 5, 159, "Basra"),
  N("zeydeslem", "زيد بن أسلم", "Zeyd b. Eslem", 4, 136, "Medine", "Mizzî: Ebû Hüreyre'den semâı ihtilâflı («قيل لم يسمع منه»)."),

  /* KUTUB-I SITTE MUELLIFLERININ KENDI HOCALARI (o. 210-260).

     Mustafa haritada bu evrenin bos gorundugunu soyledi; olculdu ve
     hakliydi: 200-249 bandinda elli yila 82 dugum dusuyordu, ondan
     onceki elli yilda ise 143. Oysa bu tabaka Buhari'nin, Muslim'in
     BIZZAT ders aldigi nesil -- en yogun olmasi gereken yerlerden biri.

     Eksikler tahminle degil OLCUMLE secildi: islenmis butun hoca ve
     talebe listeleri tarandi, agda dugumu olmayan adlar sayildi, en cok
     tekrar edenler alindi. Vefat yillari Mizzi'nin kendi metninden
     okundu, hafizadan yazilmadi -- Ibn Sellam icin yaygin olarak 227
     deniyor ama Mizzi Buhari'den 225 naklediyor, o alindi.

     BAGDATLILAR BASRA SUTUNUNDA: tabloda Bagdat sutunu yok ve mevcut
     Bagdatlilar (Ahmed b. Hanbel, Ibn Main, Zuheyr b. Harb, Ali b.
     el-Ca'd) zaten orada duruyor; ayni kural surduruldu. */
  N("sufyanveki", "سفيان بن وكيع بن الجراح", "Süfyân b. Vekî‘", 5, 247, "Kûfe"),
  N("harunhammal", "هارون بن عبد الله بن مروان الحمال", "Hârûn b. Abdillâh el-Hammâl", 5, 243, "Basra"),
  N("ibnsellam", "محمد بن سلام البيكندي", "Muhammed b. Sellâm el-Bîkendî", 5, 225, "Mâverâünnehir"),
  N("habbanhilal", "حبان بن هلال الباهلي", "Habbân b. Hilâl", 5, 216, "Basra"),
  N("nersi", "عبد الأعلى بن حماد النرسي", "Abdül'alâ b. Hammâd en-Nersî", 5, 237, "Basra"),
  N("duhaym", "عبد الرحمن بن إبراهيم بن عمرو بن ميمون دحيم", "Duhaym, Abdurrahman b. İbrâhim", 5, 245, "Şam"),

  /* AYNI OLCUMUN IKINCI PARTISI. Yukaridaki alti isim boslugu kapatmaya
     yetmedi; ayni sayimin ust siralarindan devam ediliyor. Bu partide
     agirlik muelliflerin TASRA hocalarinda: Vasit, Serahs, Belh, Buhara
     ve Misir. Boylece eksik olan yalnizca zaman bandi degil, o bandin
     Medine-Kufe-Basra disinda kalan sutunlari da doluyor.

     Vefat yillari yine Mizzi'den okundu. Ahmed b. Sinan icin Mizzi uc
     rivayet birden veriyor (256/258/259); Ibn Hacer Takrib'de 256'yi
     one aldigi icin o alindi. Yahya b. Musa'nin tercemesinin Samile
     fihristinde BASLIGI YOK -- sayfa, «من اسمه يحيى» agacindaki
     bosluktan (17120-17125) bulundu. */
  N("ahmedsinan", "أحمد بن سنان بن أسد بن حبان القطان الواسطي", "Ahmed b. Sinân el-Kattân", 5, 256, "Vâsıt"),
  N("ebukudame", "عبيد الله بن سعيد بن يحيى بن برد أبو قدامة السرخسي", "Ebû Kudâme es-Serahsî", 5, 241, "Horasan"),
  N("yahyamusa", "يحيى بن موسى بن عبد ربه بن سالم البلخي خت", "Yahyâ b. Mûsâ el-Belhî (Hat)", 5, 240, "Horasan"),
  N("esedmusa", "أسد بن موسى بن إبراهيم بن الوليد الأموي أسد السنة", "Esed b. Mûsâ (Esedü's-sünne)", 5, 212, "Mısır"),
  N("musnedi", "عبد الله بن محمد بن عبد الله الجعفي البخاري المسندي", "Abdullah b. Muhammed el-Müsnedî", 5, 229, "Mâverâünnehir"),
  N("rebimuradi", "الربيع بن سليمان بن عبد الجبار المرادي المصري المؤذن", "Rebî b. Süleymân el-Murâdî", 6, 270, "Mısır"),

  /* UCUNCU PARTI. Bu sefer sayimin en ust siralari: islenmis listelerde
     onlarca kez gecip de agda karsiligi olmayan adlar. Ikisi kenar
     tabakada degil, MERKEZDE -- Ebu Amir el-Akadi ile Ebu Ahmed
     ez-Zubeyri alti muellifin de ortak hocalarindan; onlarin yoklugu
     200-205 hattinda bir delik biraktiyordu.

     «MUHAMMED B. ES-SABBAH» IKI KISI: Cercerai (o. 240) ve Dulabi
     (o. 227). Listelerde cogu zaman nisbesiz geciyor. Ikisini birden
     eklemek eslestiriciyi kur'aya birakirdi -- ciplak kayit hangisine
     gitse dogru sayilacakti. Alti muellifin de rivayet ettigi (ع)
     Dulabi alindi, Cercerai birakildi.

     Zaferani, Abbas ed-Duri ve Abbas el-Anberi 6. tabakada: muelliflerin
     akranlari ve talebeleri, ustteki 250-280 boslugunu dolduruyorlar. */
  N("ebuamirakadi", "عبد الملك بن عمرو القيسي أبو عامر العقدي", "Ebû Âmir el-Akadî", 5, 205, "Basra"),
  N("ebuahmedzubeyri", "محمد بن عبد الله بن الزبير بن عمر بن درهم أبو أحمد الزبيري", "Ebû Ahmed ez-Zübeyrî", 5, 203, "Kûfe"),
  N("ibnsabbahdulabi", "محمد بن الصباح الدولابي البزاز", "Muhammed b. es-Sabbâh ed-Dûlâbî", 5, 227, "Basra"),
  N("ibnrecagudani", "عبد الله بن رجاء بن عمر الغداني البصري", "Abdullah b. Recâ el-Gudânî", 5, 219, "Basra"),
  N("zaferani", "الحسن بن محمد بن الصباح الزعفراني البغدادي", "Hasan b. Muhammed ez-Za‘ferânî", 6, 260, "Basra"),
  N("abbasduri", "عباس بن محمد بن حاتم بن واقد الدوري البغدادي", "Abbâs b. Muhammed ed-Dûrî", 6, 271, "Basra"),

  /* DORDUNCU PARTI. Muelliflerin akranlari ve onlarla ayni halkalarda
     oturan hafizlar: Haccac b. es-Sair, Cuzcani, Ramadi, Ahmed b. Abde
     ve Yusuf b. Musa el-Kattan.

     SAMILE FIHRISTININ BOSLUKLARI: bu partide bes isimden ucunun
     tercemesine baslik aramasiyla ulasilamadi. Sebep iki turlu --
     ya baslik fihristte hic yok (Cuzcani, Ramadi'nin bir kismi), ya da
     nisbe basliga «المعروف بالرمادي» gibi bir ON EKLE giriyor ve
     «الرمادي» belirteci tutmuyor. Cozum: «من اسمه X» agacini listeleyip
     dogrudan okumak. Bu yol yavas ama sasmiyor. */
  N("haccacsair", "حجاج بن يوسف بن حجاج الثقفي ابن الشاعر", "Haccâc b. eş-Şâir", 6, 259, "Basra"),
  N("cuzcani", "إبراهيم بن يعقوب بن إسحاق السعدي الجوزجاني", "İbrâhim b. Ya‘kūb el-Cûzcânî", 6, 259, "Şam"),
  N("ramadi", "أحمد بن منصور بن سيار الرمادي البغدادي", "Ahmed b. Mansûr er-Ramâdî", 6, 265, "Basra"),
  N("ahmedabde", "أحمد بن عبدة بن موسى الضبي البصري", "Ahmed b. Abde ed-Dabbî", 5, 245, "Basra"),
  N("yusufmusakattan", "يوسف بن موسى بن راشد القطان أبو يعقوب الكوفي الرازي", "Yûsuf b. Mûsâ el-Kattân", 6, 253, "Basra"),

  /* BESINCI PARTI -- BU SEFER ERKEN TABAKA. Sayimin ust siralari yalniz
     3. yuzyilin sahibi degildi; tabiin arasinda da onlarca kez gecip
     agda karsiligi olmayan adlar vardi. Bunlar muelliflerin hocalari
     degil, agin BASINDAKI yogunlugu tasiyan isimler: Ata b. Yesar,
     Ebu Osman en-Nehdi, Makburi, Cubeyr b. Nufeyr, Ibn Ganm, Said b.
     Ebi Hilal.

     Vefat yillari yine Mizzi'den; Mizzi birden cok rivayet verdiginde
     Takrib'in tercihi degil, Mizzi'nin coklukla naklettigi alindi
     (Ata b. Yesar icin 103, Makburi icin 123). Cubeyr b. Nufeyr
     «Humus» sutununda -- Sam'in kendisi degil, tabloda ayri duran
     serhat sehri. */
  N("atayesar", "عطاء بن يسار الهلالي أبو محمد المدني", "Atâ b. Yesâr", 3, 103, "Medine"),
  N("makburi", "سعيد بن أبي سعيد كيسان المقبري أبو سعد المدني", "Saîd b. Ebî Saîd el-Makburî", 3, 123, "Medine"),
  N("ebuosmannehdi", "عبد الرحمن بن مل أبو عثمان النهدي", "Ebû Osmân en-Nehdî", 2, 95, "Basra"),
  N("cubeyrnufeyr", "جبير بن نفير بن مالك بن عامر الحضرمي الحمصي", "Cübeyr b. Nüfeyr", 2, 80, "Humus"),
  N("ibnganm", "عبد الرحمن بن غنم الأشعري الشامي", "Abdurrahman b. Ganm", 2, 78, "Şam"),
  N("saidebihilal", "سعيد بن أبي هلال الليثي أبو العلاء المصري", "Saîd b. Ebî Hilâl", 4, 135, "Mısır"),

  /* ALTINCI PARTI, yine tabiin. Bunlar Medine halkasinin dugumleri;
     besi de Ebu Hureyre, Ibn Omer ve Ibn Abbas ile alti muellifin
     hocalari arasindaki kopruleri tasiyor.

     Irak b. Malik icin Mizzi acik bir vefat yili vermiyor -- «vefd
     etti Omer b. Abdilaziz'e» diyor ve Zehebi «Yezid b. Abdilmelik
     hilafetinde oldu» diye kaydediyor; 105 o araligin ortasi olarak
     alindi, kesin degil. */
  N("safvansuleym", "صفوان بن سليم المدني القرشي الزهري", "Safvân b. Süleym", 4, 132, "Medine"),
  N("bukeyresec", "بكير بن عبد الله بن الأشج القرشي المدني", "Bükeyr b. Abdillâh b. el-Eşec", 4, 122, "Mısır"),
  N("naficubeyr", "نافع بن جبير بن مطعم القرشي النوفلي المدني", "Nâfi b. Cübeyr b. Mut‘im", 3, 99, "Medine"),
  N("musabsad", "مصعب بن سعد بن أبي وقاص القرشي الزهري", "Mus‘ab b. Sa‘d", 3, 103, "Medine"),
  N("irakmalik", "عراك بن مالك الغفاري الكناني المدني", "İrâk b. Mâlik", 3, 105, "Medine"),
  /* ---- SIYER EKI ----
     Zehebi, Buhari'nin seyhlerini sehir sehir sayarken (Siyer 12/394-395)
     gecen ve agda HIC BULUNMAYAN isimler. Her biri Tehzib'de mustakil
     terceme sahibi, yani Kutub-i Sitte ravisi. */
  N("abdullahyusuftinnisi", "عبد الله بن يوسف التنيسي", "Abdullah b. Yûsuf et-Tinnîsî", 5, 218, "Mısır",
    "Tehzîb terceme 3673, rumûz خ د ت س. Zehebî, Buhârî'nin Mısır şeyhleri arasında sayar (Siyer 12/395). İbn Maîn: Muvatta' rivayetinde Ka‘nebî'den sonra en sağlam kişi; Buhârî Mâlik'ten rivayetlerinde ona dayanmıştır."),
  N("ebulyemanhakem", "الحكم بن نافع البهراني أبو اليمان", "Ebü'l-Yemân el-Hakem b. Nâfi‘", 5, 222, "Humus",
    "Tehzîb terceme 1448, rumûz ع (Kütüb-i Sitte'nin tamamı). Zehebî, Buhârî'nin Şam şeyhleri arasında sayar (Siyer 12/395). İsmâîl b. Ayyâş'ın kâtibi; Şuayb b. Ebî Hamza'nın Zührî nüshasının râvisi. Vefatı 221 ve 222 diye ihtilâflı; Buhârî ile İbn Sa‘d 222 der."),
  N("mekkiibrahim", "مكي بن إبراهيم بن بشير البلخي", "Mekkî b. İbrâhîm el-Belhî", 5, 215, "Horasan",
    "Tehzîb terceme 6170, rumûz ع. Zehebî, Buhârî'nin Belh şeyhi olarak sayar ve «هو من عوالي شيوخه» der (Siyer 12/394) — Buhârî'nin tâbiîn nesline en yakın hocalarından. Kendisi on bir tâbiîden rivayet ettiğini söyler. Vefatı 215 (İbn Sa‘d); Buhârî 214 der."),
  N("halidmahled", "خالد بن مخلد القطواني", "Hâlid b. Mahled el-Katavânî", 5, 213, "Kûfe",
    "Tehzîb terceme 1652, rumûz ع كد. Zehebî, Buhârî'nin Kûfe şeyhleri arasında sayar (Siyer 12/394). Buhârî'nin Rikāk'ta tek başına rivayet ettiği meşhur «من عادى لي وليا» hadisinin râvisi. Teşeyyu‘ ile itham edilmiş; Ebû Dâvûd «صدوق ولكنه يتشيع» der. Vefatı 213 (Mutayyen, İbn Sa‘d); İbn Kāni‘ 214 der."),
  N("asbagferec", "أصبغ بن الفرج بن سعيد الأموي", "Asbağ b. el-Ferec el-Ümevî", 5, 225, "Mısır",
    "Tehzîb terceme 536, rumûz خ د ت س. Zehebî, Buhârî'nin Mısır şeyhleri arasında sayar (Siyer 12/395). İbn Vehb'in verrâkı ve Ebû Hâtim'e göre onun en büyük talebesi; İbn Maîn «Mâlik'in görüşünü meseleye kadar bilen en âlim kişi» der. Şevval 225'te vefat etti."),
  N("surayjnuman", "سريج بن النعمان بن مروان الجوهري", "Süreyc b. en-Nu‘mân el-Cevherî", 5, 217, "Basra",
    "Tehzîb terceme 2190, rumûz خ ٤. Zehebî, Buhârî'nin Bağdat şeyhleri arasında sayar (Siyer 12/394). Aslı Horasanlı, Bağdat'ta yerleşti; kurban bayramı günü 217'de vefat etti. Belde olarak Basra yazılı — haritada Irak sütunu o; Ahmed b. Hanbel ve İbn Maîn gibi Bağdatlılar da orada duruyor."),

  /* SIYER EKI, IKINCI TUR (2026-09-05). Zehebi'nin Buhari listesinde
     (Siyer 12/394-395) gecip agda bulunmayan isimlerden Tehzib'de
     tercemesi bulunabilenler. Ilk turda tespit edilmis ama o zaman
     Tehzib'in baslik dizininde bulunamamislardi; govde metninde
     tam kunyeyle arayinca cikti. */
  N("muhammedsabik", "محمد بن سابق التميمي", "Muhammed b. Sâbık et-Temîmî", 5, 214, "Basra",
    "Tehzîb terceme 5230, rumûz خ م د ت س. Zehebî, Buhârî'nin şeyhleri arasında sayar (Siyer 12/394). Aslı Faris'ten, Kûfe'de yetişti, Bağdat'a yerleşip orada vefat etti. Ahmed b. Hanbel'e sorulunca «Ebû Nuaym'ı istiyorsan İbn Sâbık'a git» demiş. Buhârî ondan el-Edeb'de, Sahîh'in Vesâyâ bölümünde ise «Muhammed b. Sâbık ya da Fadl b. Ya‘kūb» diyerek rivayet eder. İbn Maîn zayıf saymış, Ya‘kūb b. Şeybe «sadûk sika ama zabtıyla anılmaz» demiş; İbn Hacer sadûk der. Vefatı 213 (Hadramî) yahut 214 (İbn Kâni‘, İbn Hibbân)."),
  N("muhammedararah", "محمد بن عرعرة بن البرند القرشي", "Muhammed b. Ar‘ara el-Kuraşî", 5, 213, "Basra",
    "Tehzîb terceme 5463, rumûz خ م د. Zehebî, Buhârî'nin Basra şeyhleri arasında sayar (Siyer 12/394). Şu‘be'nin talebesi; Buhârî ondan Şu‘be yoluyla rivayet eder. Ebû Hâtim «sika sadûk», Nesâî «leyse bihî be's» der. 213'te yetmiş beş yaşında vefat etti. Oğlu İbrâhim b. Muhammed b. Ar‘ara da Müslim ve Nesâî'nin şeyhidir."),
  N("bedelmuhabber", "بدل بن المحبر بن المنبه التميمي", "Bedel b. el-Muhabber et-Temîmî", 5, 215, "Basra",
    "Tehzîb terceme 647. Zehebî, Buhârî'nin Basra şeyhleri arasında sayar (Siyer 12/394). Aslı Vâsıtlı, Ebü'l-Münîr künyesiyle bilinir. Buhârî ondan Sahîh'te yalnızca iki yerde (Salât ve Fiten), ikisinde de Şu‘be'den rivayet eder. Ebû Zür‘a sika, Ebû Hâtim «Ümeyye b. Hâlid, Behz, Habbân ve Affân'dan üstün» der. Dârekutnî tek bir hadis sebebiyle zayıf saymış, İbn Hacer bunu teannüt saymıştır. Zehebî «kimse vefatını tarihlemedi, 215 dolayında öldü» der."),
  N("talkgannam", "طلق بن غنام بن طلق النخعي", "Talk b. Gannâm en-Nehaî", 5, 211, "Kûfe",
    "Tehzîb terceme 2991, rumûz خ ٤. Zehebî, Buhârî'nin Kûfe şeyhleri arasında sayar (Siyer 12/394). Hafs b. Gıyâs'ın amcaoğlu ve Şerîk b. Abdillâh'ın kâtibi. İclî, İbn Nümeyr ve Dârekutnî sika der; İbn Hacer de sika sayar. Receb 211'de vefat etti (İbn Sa‘d, Mutayyen, İbn Hibbân)."),
  N("halladyahya", "خلاد بن يحيى بن صفوان السلمي", "Hallâd b. Yahyâ es-Sülemî", 5, 213, "Mekke",
    "Tehzîb terceme 1741, rumûz خ د ت. Zehebî, Buhârî'nin Mekke şeyhleri arasında sayar (Siyer 12/394). Kûfeli olup Mekke'ye yerleşti. Ahmed b. Hanbel «sika yahut sadûk, ama ircâdan bir şey görüyordu» der; İbn Hacer «sadûk, ircâ ile itham edildi; Buhârî'nin büyük şeyhlerindendir» diyerek Fetih'in mukaddimesinde onu savunur. Buhârî'ye göre Mekke'de 213 dolayında, Hanbel b. İshak'a göre 217'de vefat etti."),
  N("aliayyas", "علي بن عياش بن مسلم الألهاني", "Ali b. Ayyâş el-Elhânî", 5, 219, "Humus",
    "Tehzîb terceme 4116, rumûz خ ٤. Zehebî, Buhârî'nin Humus şeyhleri arasında sayar (Siyer 12/395). Ebü'l-Hasen el-Hımsî el-Bekkâ. Şuayb b. Ebî Hamza'nın Zührî nüshasını nakleden başlıca râvilerden; Buhârî Sahîh'in ilk hadislerinden birini ondan alır. Ahmed b. Hanbel, Dühaym, Ebû Zür‘a ed-Dımaşkī ve Zühlî talebeleri arasındadır."),
  N("ebumushir", "عبد الأعلى بن مسهر الغساني", "Ebû Müshir ed-Dımaşkī", 5, 218, "Şam",
    "Tehzîb terceme 3691, rumûz ع. Zehebî, Buhârî'nin Şam şeyhleri arasında sayar (Siyer 10/228). Dımaşk'ın hadis imamı; Mâlik b. Enes, Saîd b. Abdilazîz ve Süfyân b. Uyeyne'den rivayet eder. Mihne'de halku'l-Kur'ân'ı söylemeyi reddedince Bağdat'a sevk edilip hapsedildi ve 218'de orada vefat etti. Buhârî ondan el-Edeb'de rivayet eder yahut rivayeti kendisine ulaşmıştır."),
  N("bisrsuayb", "بشر بن شعيب بن أبي حمزة", "Bişr b. Şuayb b. Ebî Hamza", 5, 213, "Humus",
    "Tehzîb terceme 691, rumûz خ ت س. Zehebî, Buhârî'nin Humus şeyhleri arasında sayar (Siyer 12/395). Yalnızca babası Şuayb b. Ebî Hamza'dan rivayet eder; babası vefatı sırasında «kitaplarımı sahih kıldım, oğlumdan dinlemek isteyen dinlesin» demiştir. Buhârî Sahîh'te ondan tek bir hadisi İshak (b. Mansûr el-Kevsec) vasıtasıyla alır, Sahîh dışındaki eserlerinde ise doğrudan rivayet eder. Buhârî 212'de hayatta olduğunu söyler; İbn Hibbân 213'te vefat ettiğini kaydeder."),
  N("ahmedhalidvehbi", "أحمد بن خالد الوهبي الكندي", "Ahmed b. Hâlid el-Vehbî el-Kindî", 5, 214, "Humus",
    "Tehzîb terceme 30. Zehebî, Buhârî'nin Humus şeyhleri arasında sayar (Siyer 12/395). Ebû Saîd b. Ebî Mahled el-Hımsî; Muhammed b. İshak'ın Sîre'sini nakleden başlıca râvilerden. Buhârî ondan Cüz'ü'l-kırâe halfe'l-imâm ve el-Edebü'l-müfred'de rivayet eder, Sahîh'te değil. Kardeşi Muhammed b. Hâlid el-Vehbî de râvidir."),
  N("eyyubsuleymanbilal", "أيوب بن سليمان بن بلال القرشي", "Eyyûb b. Süleymân b. Bilâl", 5, 224, "Medine",
    "Tehzîb terceme 614, rumûz خ د ت س. Zehebî, Buhârî'nin Medine şeyhleri arasında sayar (Siyer 12/394). Rivayetinin tamamı babası Süleymân b. Bilâl'in nüshasıdır; ama onu babasından doğrudan değil, Ebû Bekir Abdülhamîd b. Ebî Üveys vasıtasıyla alır — Zehebî «babasına yetiştiğini görmedim» der. Buhârî'nin Medineli şeyhlerinin sonuncularından."),

  /* SIYER EKI, UCUNCU TUR (2026-09-05). Ikinci turda bulunamayan dort
     isim. Sebep her seferinde ayni: Samile'nin arama dizini sorguyu
     bes belirtece kirpiyor ve Tehzib'in BASLIK dizini bu dort tercemeyi
     tasimiyor. Cozum, govde metninde tercemenin KENDI bas kalibiyla
     aramak -- Mizzi'nin yazdigi sekliyle, sonradan eklenen nisbe
     olmadan. Sadaka b. el-Fadl'in bas kaydinda mesela «المروزي» yok,
     «صدقة بن الفضل، أبو الفضل المروزي» diye geciyor; «صدقة بن الفضل
     المروزي» diye arayinca yalnizca baskalarinin tercemelerindeki
     anmalar cikiyordu. */
  N("sadakafadl", "صدقة بن الفضل المروزي", "Sadaka b. el-Fadl el-Mervezî", 5, 223, "Horasan",
    "Tehzîb terceme 2867, rumûz خ. Zehebî, Buhârî'nin Merv şeyhleri arasında sayar (Siyer 12/394). Abbâs b. el-Velîd en-Nersî'nin sözü onu tarif eder: «Horasan'da Sadaka b. el-Fadl derdik, Irak'ta Ahmed b. Hanbel.» Abbâs b. Abdilazîm el-Anberî de kendisiyle Allah arasında hüccet saydığı üç kişiden biri olarak anar. Merv'de «Sikketü Sadaka» ona nisbetle anılır. Nesâî sika, İbn Hibbân «hadis ve sünnet sahibi» der. Buhârî «iki yüz yirmi küsurda vefat etti» der; başkaları 223, kimi 226 verir."),
  N("hassanhassan", "حسان بن حسان البصري", "Hassân b. Hassân el-Basrî", 5, 213, "Mekke",
    "Tehzîb terceme 1189, rumûz خ. Zehebî, Buhârî'nin Mekke şeyhleri arasında sayar (Siyer 12/394). Ebû Alî b. Ebî Abbâd; Basralı olup Mekke'ye yerleşti. Buhârî ondan Hemmâm b. Yahyâ ve Muhammed b. Talha yoluyla rivayet eder ve «Mukri' onu överdi» der. Ebû Hâtim münkerü'l-hadîs saymış, İbn Hacer «sadûk yuhtî» demiştir. Buhârî'ye göre 213'te vefat etti."),
  N("abdulazizuveysi", "عبد العزيز بن عبد الله الأويسي", "Abdülazîz b. Abdillâh el-Üveysî", 5, 223, "Medine",
    "Tehzîb terceme 3457, rumûz خ. Zehebî, Buhârî'nin Medine şeyhleri arasında sayar (Siyer 12/394). Ebü'l-Kāsım el-Medenî. Mâlik'in Muvatta'ının bir kısmını ondan işitip kalanını arz yoluyla aldı; Ebû Hâtim onu Yahyâ b. Bükeyr'e tercih eder. Ya‘kūb b. Şeybe ve Ebû Dâvûd sika, Dârekutnî hüccet, Halîlî «üzerinde ittifak edilmiş sika» der. İbrâhim b. Sa‘d, Süleymân b. Bilâl ve Abdülazîz b. Ebî Hâzim'den gelen Buhârî isnadlarının Medine ayağıdır."),
  N("ahmedeskab", "أحمد بن إشكاب الحضرمي", "Ahmed b. İşkâb el-Hadramî", 5, 217, "Mısır",
    "Tehzîb terceme 11, rumûz خ. Zehebî, Buhârî'nin Mısır şeyhleri arasında sayar (Siyer 12/395). Ebû Abdillâh es-Saffâr; Kûfeli olup Mısır'a yerleşti. Zehretü'l-müteallimîn'e göre Buhârî'nin yaşıtıdır ve ondan sekiz hadis rivayet etmiştir. Ebû Hâtim «sika, me'mûn, sadûk — Mısır'da kendisinden yazdım», Ya‘kūb b. Şeybe «Kûfeli, sika» der; İbn Maîn ondan çok yazmıştır. Buhârî «Mısır'da onunla son görüşmem 217'dedir» der, İbn Yûnus 217 yahut 218'de vefat ettiğini kaydeder."),
];


/* AG DISI HOCA VE TALEBELER.

   Bir ravinin tercemesindeki hoca/talebe listesi, ag'daki dugumlerden
   cok daha uzun. Simdiye kadar yalnizca IKI UCU DA DUGUM olan baglar
   ciziliyor, digerleri toplanip atiliyordu: Ebû Hüreyre'nin 338
   talebesinden 46'si cizildi, geri kalani hicbir yerde gorunmuyordu.

   Burada duran isimler bilgi olarak KARTTA gosteriliyor; nokta
   acilmiyor, cizgi cizilmiyor, tiklanmiyorlar. Boylece ag okunur
   kalirken kartta tercemenin tam manzarasi duruyor.

   Bicim: id -> { hoca: [[ad, rumuz], ...], talebe: [...] }. Adlar
   ARAPCA -- ceviri yazi her isim icin ayri bir karar demek ve bu
   isimlerin cogunun DIA'da maddesi yok. Ravinin kendi adi zaten kartta
   Arapca da yaziyor, bicim tutarli kaliyor.

   BURASI HENUZ SADECE EBU HUREYRE ICIN DOLU. Digerleri her ravinin
   kendi tercemesi islenirken doldurulacak. */
export const DIS = {
  ebuhureyre: {
    hoca: [],
    talebe: [
    ["إبراهيم بن إسماعيل","د ق"], ["يقال: عبد الله بن إبراهيم بن قارظ الزهري","م س"],
    ["إسحاق بن عبد الله مولى زائدة","ر م د س"], ["الأغر ابن سليك","س"],
    ["أنس بن حكيم الضبي","د ق"], ["أوس بن خالد","ت ق"],
    ["بشير بن كعب العدوي","د ت ق"], ["بعجة بن عبد الله بن بدر الجهني","م س ق"],
    ["بكير بن فيروز الرهاوي","ت"], ["ثابت بن عياض الأحنف","خ م د س"],
    ["ثور بن عفير السدوسي","س"], ["جبر بن عبيدة الشاعر","س"],
    ["جعفر بن عياض","س ق"], ["جمهان مولى الأسلميين","ق"],
    ["الجلاس","سي"], ["الحارث بن مخلد الزرقي","د س ق"],
    ["حريث بن قبيصة","ت سي"], ["يقال: قبيصة بن حريث","—"],
    ["حريث العذري","ت ق"], ["حصين بن اللجلاج","س"],
    ["يقال: خالد بن اللجلاج","س"], ["يقال: القعقاع بن اللجلاج","بخ س"],
    ["يقال: أبو العلاء بن اللجلاج","س"], ["حصين بن مصعب","بخ"],
    ["أبو تحيا حكيم ابن سعد الكوفي","س"], ["حميد بن عبد الرحمن الحميري","م ٤"],
    ["حميد بن مالك بن خثيم","بخ"], ["حنظلة بن علي الأسلمي","بخ م كن ق"],
    ["حيان بن بسطام الهذلي","ق"], ["الد سليم بن حيان","—"],
    ["خالد بن عبد الله بن حسين الدمشقي","د س ق"], ["أبو حسان خالد بن غلاق","بخ م قد"],
    ["خباب المدني","م د"], ["ذهيل بن عوف بن شماخ الطهوي","ق"],
    ["ربيعة الجرشي","د"], ["رميح الجذامي","ت"],
    ["زفر بن صعصعة ابن مالك","س"], ["زياد بن ثويب","سي ق"],
    ["أبو قيس زياد بن رياح القيسي","م س ق"], ["زياد بن قيس المدني","س"],
    ["زياد الطائي","ت"], ["زيد بن أبي عتاب","بخ د ق"],
    ["سالم أبو الغيث مولى ابن مطيع","ع"], ["سالم مولى شداد بن الهاد","م د ق"],
    ["سحيم مولى زهرة","س"], ["سعيد بن الحارث الأنصاري","خت ت"],
    ["سعيد بن أبي الحسن البصري","ت س"], ["سعيد بن حيان والد أبي حيان التيمي","—"],
    ["سعيد بن أبي سعيد المقبري","—"], ["سعيد بن سمعان المدني","ر د ت س"],
    ["سعيد بن عمرو بن سعيد بن العاص القرشي الأموي","خ م ت س"], ["سعيد بن مرجانة","—"],
    ["سعيد بن أبي هند","بخ د"], ["سلمان الأغر","ع"],
    ["سلمة بن الأزرق","س ق"], ["سلمة الليثي","د ق"],
    ["سليمان بن سنان المدني","س"], ["سنان بن أبي سنان الدؤلي","م"],
    ["شتير","د"], ["يقال: سمير بن نهار العبدي","—"],
    ["شفي بن ماتع الأصبحي المصري","عخ ت س"], ["صالح بن درهم الباهلي","د"],
    ["صالح بن أبي صالح","ت"], ["صالح بن نبهان مولى التوأمة","د ت ق"],
    ["صعصعة بن مالك","د"], ["صهيب العتواري","س"],
    ["الضحاك بن شرحبيل","د"], ["الضحاك بن عبد الرحمن بن عرزب","ت"],
    ["ضمضم بن جوس الهفاني اليمامي","٤"], ["طارق بن مخاشن","د سي"],
    ["عامر بن سعد بن أبي وقاص","م"], ["عامر بن سعد البجلي","د س"],
    ["عباد بن أبي سعيد المقبري","د س ق"], ["عباس الجشمي","٤"],
    ["عبد الله بن ثعلبة بن صعير العذري","س"], ["أبو الوليد عبد الله بن الحارث البصري","م ت"],
    ["عبد الله بن رافع مولى أم سلمة","—"], ["أبو سلمة عبد الله بن رافع الحضرمي المصري","بخ"],
    ["عبد الله بن رباح الأنصاري","م د س"], ["عبد الله بن سعد","بخ"],
    ["عبد الله بن أبي سليمان","بخ"], ["عبد الله بن شقيق","بخ م ت س"],
    ["عبد الله بن ضمرة السلولي","ت ق"], ["عبد الله بن عبد الرحمن بن الحارث بن سعد بن أبي ذباب الدوسي","د ت س"],
    ["عبد الله بن عتبة بن مسعود","د"], ["عبد الله بن فروخ مولى عائشة","م د"],
    ["عبد الله بن يامين الطائفي","ق"], ["عبد الحميد بن سالم","ق"],
    ["عبد الرحمن بن آدم","د"], ["عبد الرحمن بن أذينة","ق"],
    ["عبد الرحمن بن حجيرة الخولاني المصري","د ت سي ق"], ["عبد الرحمن بن أبي حدرد الأسلمي","د"],
    ["عبد الرحمن بن خالد بن ميسرة","س"], ["عبد الرحمن بن سعد","د ق"],
    ["عبد الرحمن بن سعد المقعد","م"], ["عبد الرحمن بن الصامت","د س"],
    ["يقال: ابن أخيه","—"], ["عبد الرحمن بن عبد الله بن كعب بن مالك","خد س"],
    ["عبد الرحمن بن أبي عمرة الأنصاري","خ م س"], ["عبد الرحمن بن غنم الأشعري","س"],
    ["عبد الرحمن بن أبي كريمة","د ت"], ["عبد الرحمن بن مهران مولى أبي هريرة","م س"],
    ["عبد الرحمن بن أبي نعم البجلي","ع"], ["عبد الرحمن بن يعقوب مولى الحرقة","رم ٤"],
    ["عبد العزيز بن مروان بن الحكم","د"], ["عبد الملك بن أبي بكر بن عبد الرحمن بن الحارث بن هشام","سي"],
    ["عبد الملك بن يسار","س"], ["أبو يحيى عبيد الله بن عبد الله بن موهب التيمي","بخ د ت عس ق"],
    ["عبيد بن حنين","خ ت س"], ["عبيد بن سلمان الطابخي","ق"],
    ["عبيد بن أبي عبيد","د ق"], ["عبيد ابن عمير الليثي","م"],
    ["عبيدة بن سفيان الحضرمي","م س ق"], ["عثمان بن أبي سودة الشامي","بخ ت ق"],
    ["عثمان بن شماس","سي"], ["عثمان بن عبد الله بن موهب التيمي","تم"],
    ["عجلان","خت م ٤"], ["عجلان مولى المشمعل","س"],
    ["عراك بن مالك","ع"], ["عزرة بن تميم","س"],
    ["عطاء بن أبي علقمة بن الحارث ابن نوفل","سي"], ["عطاء بن أبي مسلم الخراساني","ق"],
    ["عطاء ابن ميناء","ع"], ["عطاء بن يزيد الليثي","خ م س ق"],
    ["عطاء بن يسار","ع"], ["عطاء مولى ابن أبي أحمد","ت س ق"],
    ["عطاء مولى أم صبية الجهنية","س"], ["عطاء الزيات","س"],
    ["علقمة بن بجالة بن الزبرقان","بخ"], ["علي بن رباح اللخمي","د س"],
    ["علي بن شماخ السلمي","د سي"], ["عمارة","ر ٤"],
    ["عمر بن الحاكم بن ثوبان","خت"], ["عمر بن الحكم بن رافع الأنصاري","خت م ت س"],
    ["عمر بن خلدة الزرقي","د ق"], ["عمرو بن أبي سفيان بن أسيد بن جارية الثقفي","خ م د س"],
    ["عمرو بن سليم الزرقي","سي"], ["عمرو بن عاصم ابن سفيان بن عبد الله الثقفي","بخ د ت س"],
    ["عمرو بن عمير","د"], ["عمرو بن قهيد بن مطرف","س"],
    ["عمير بن الأسود العنسي","ق"], ["عنبسة بن سعيد بن العاص","خ د"],
    ["عوف بن الحارث بن الطفيل","د س"], ["العلاء بن زياد العدوي","ق"],
    ["عيسى بن طلحة بن عبيد الله","ع"], ["القاسم ابن محمد بن أبي بكر الصديق","ت"],
    ["قبيصة بن ذؤيب الخزاعي","خ م د ت س"], ["قسامة بن زهير المازني","س"],
    ["القعقاع بن حكيم","س"], ["كثير ابن مرة الحضرمي","ق"],
    ["كعب المدني","ت"], ["كليب بن شهاب الجرمي","د ت س"],
    ["كميل بن زياد النخعي","سي"], ["كنانة مولى صفية","بخ"],
    ["مالك بن أبي عامر الأصبحي","خ م ت س ق"], ["ابنه المحرر بن أبي هريرة","س ق"],
    ["محمد بن إياس بن البكير الليثي","د"], ["محمد بن ثابت","ت ق"],
    ["محمد بن زياد الجمحي","ع"], ["محمد ابن سيرين","ع"],
    ["محمد بن شرحبيل العبدري","بخ"], ["محمد بن أبي عائشة المدني","م د س ق"],
    ["محمد بن عبد الرحمن","س"], ["محمد بن عمار بن سعد القرظ","ت"],
    ["محمد بن عمرو بن عطاء العامري","ق"], ["محمد بن عمير","س"],
    ["محمد ابن قيس بن مخرمة القرشي","م ت س"], ["محمد بن كعب القرظي","بخ د ق"],
    ["مضارب بن حزن التميمي","ق"], ["المطوس","د ق"],
    ["معبد بن عبد الله بن هشام القرشي","ق"], ["المغيرة بن أبي بردة العبدري","٤"],
    ["المنذر بن مالك العبدي مرسل","—"], ["موسى بن وردان القرشي","بخ د ت سي ق"],
    ["موسى بن يسار المطلبي مولى قيس بن مخرمة","خت م د س ق"], ["ميناء بن أبي ميناء مولى عبد الرحمن بن عوف","ت"],
    ["نافع بن جبير بن مطعم","خ م س ق"], ["نافع بن عباس مولى أبي قتادة","خ م د"],
    ["نافع بن أبي نافع البزاز مولى أبي أحمد","د ت س"], ["نافع مولى عبد الله بن عمر","خ م"],
    ["النضر بن سفيان الدؤلي","س"], ["نعيم بن عبد الله المجمر","خ م د س"],
    ["هلال بن أبي هلال","بخ د س ق"], ["الهيثم بن أبي سنان","خ"],
    ["اثلة بن الأسقع","ق"], ["الوليد بن رباح","بخ د ت ق"],
    ["يحيى بن جعدة بن هبيرة المخزومي","د"], ["أبو الحباب يحيى بن أبي صالح","ت"],
    ["يحيى بن النضر الأنصاري","بخ ق"], ["يحيى ابن يعمر البصري","د س"],
    ["يزيد بن الأصم","بخ م ٤"], ["أبو العلاء يزيد بن عبد الله بن الشخير","ق"],
    ["يزيد بن عبد الرحمن الأودي","بخ ت ق"], ["يزيد بن هرمز","م سي"],
    ["يزيد مولى المنبعث","ت"], ["يعلى بن عقبة","س"],
    ["أبو مرة يعلى بن مرة الكوفي","بخ"], ["يوسف بن ماهك","د ت ق"],
    ["أبو إسحاق مولى عبد الله بن الحارث بن نوفل","سي"], ["أبو أيوب المراغي","م"],
    ["أبو بكر بن سليمان بن أبي حثمة","س"], ["أبو بكر بن عبد الرحمن بن الحارث بن هشام","ع"],
    ["أبو تميمة الهجيمي","٤"], ["أبو ثور الأزدي","ت"],
    ["أبو جعفر المدني","بخ د ت سي ق"], ["أبو الجوزاء الربعي","س"],
    ["أبو حازم الأشجعي","ع"], ["أبو الحكم البجلي","ت"],
    ["أبو الحكم","س ق"], ["أبو حميد","ق"],
    ["أبو حي المؤذن","د"], ["أبو خالد البجلي","بخ ت ق"],
    ["أبو خالد الوالبي","د ت ق"], ["أبو خالد","د"],
    ["أبو رافع الصائغ","ع"], ["أبو الربيع المدني","بخ ت"],
    ["أبو رزين الأسدي","بخ م د س ق"], ["أبو زرعة ابن عمرو بن جرير","ع"],
    ["أبو زيد","س"], ["أبو السائب","رم ٤"],
    ["أبو سعد الخير الحمصي","د ق"], ["أبو سعيد بن أبي المعلى المدني","ت"],
    ["أبو سعيد الأزدي الشنائي","د"], ["أبو سعيد مولى عبد الله بن عامر بن كريز","م س ق"],
    ["أبو سفيان مولى ابن أبي أحمد","ع"], ["أبو السليل القيسي","ت"],
    ["أبو سهم","ق"], ["أبو الشعثاء المحاربي","م ٤"],
    ["أبو صالح الأشعري","ق"], ["أبو صالح الحنفي","سي"],
    ["أبو صالح الخوزي","بخ ت ق"], ["أبو صالح السمان","ع"],
    ["أبو صالح مولى ضباعة","ت"], ["أبو الصلت","ق"],
    ["أبو الضحاك","فق"], ["أبو عبد الله الدوسي","د ق"],
    ["أبو عبد الله القراظ","م س"], ["أبو عبد الله المدني","س"],
    ["أبو عبد العزيز","بخ"], ["أبو عبد الملك","بخ"],
    ["أبو عبيد مولى ابن أزهر","ع"], ["أبو عثمان التبان","خت م د س"],
    ["أبو عثمان الطنبذي","بخ مق د ت ق"], ["أبو عثمان النهدي","ع"],
    ["أبو عثمان آخر","ت"], ["أبو علقمة","رم د س"],
    ["أبو عمر الغداني","د س"], ["أبو غطفان بن طريف المري","م د"],
    ["أبو كباش العيشي","ت"], ["أبو كثير السحيمي","بخ م ٤"],
    ["أبو المتوكل الناجي","س"], ["أبو مدلة","ت ق"],
    ["أبو مرة","بخ"], ["أبو مريم الأنصاري","بخ د ت"],
    ["أبو مزاحم المدني","ت"], ["أبو مزرد","بخ"],
    ["أبو المهزم البصري","د ت ق"], ["أبو ميمونة المدني","٤"],
    ["أبو هاشم الدوسي","د"], ["أبو الوليد مولى عمرو بن حريث","—"],
    ["أبو يحيى","بخ م ق"], ["أبو يحيى","عخ د س ق"],
    ["أبو يونس","بخ م د ت"], ["ابن حسنة الجهني","بخ"],
    ["ابن سيلان","د"], ["ابن مكرز الشامي","د"],
    ["ابن وثيمة النصري","ت ق"], ["كريمة بنت الحسحاس المزنية","عخ"],
    ["أم الدرداء الصغرى","ق"],
    ],
  },
};

export const E = (a, b, r, k) => ({ a, b, r, k });
const EDGES_HAM = [
  E("omer", "ali", "—", "Tehzîb 4089"),
  E("mikdad", "ali", "م د س ق", "Tehzîb 4089"),
  E("fatima", "ali", "—", "Tehzîb 4089"),
  E("ubey", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("usame", "ebuhureyre", "س", "Tehzîb 7681"),
  E("basra", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("omer", "ebuhureyre", "ع", "Tehzîb 7681"),
  E("fadl", "ebuhureyre", "م س", "Tehzîb 7681"),
  E("kabahbar", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("aise", "ebuhureyre", "م د س ق", "Tehzîb 7681"),
  /* Muslim'in talebeleri — Tehzîb 5923. Tirmizi zaten dugum, "bir hadis"
     kaydiyla Mizzi'de ilk sirada; digerleri yeni acildi. */
  E("muslim", "tirmizi", "—", "Tehzîb 5923 — «حديثا واحدا»"),
  ...[
      ["ms01","—"],["ms02","—"],["ms03","—"],
      ["ms04","—"],["ms05","—"],["ms06","—"],
      ["ms07","—"],["ms08","—"],["ms09","—"],
      ["ms10","—"],["ms11","—"],["ms12","—"],
      ["ms13","—"],["ms14","—"],["ms15","—"],
      ["ms16","—"],["ms17","—"],["ms18","—"],
      ["ms19","—"],["ms20","—"],["ms21","—"],
      ["ms22","—"],["ms23","—"],["ms24","—"],
      ["ms25","—"],["ms26","—"],["ms27","—"],
      ["ms28","—"],["ms29","—"],
     ].map(([b, r]) => E("muslim", b, r, "Tehzîb 5923")),
  /* Ebû Dâvûd'in talebeleri — Siyer 13/205-206 */
  ...[
      ["ed01","—"],["ed02","—"],["ed03","—"],
      ["ed04","—"],["ed05","—"],["ed06","—"],
      ["ed07","—"],["ed08","—"],["ed09","—"],
      ["ed10","—"],["ed11","—"],["ed12","—"],
      ["ed13","—"],["ed14","—"],["ed15","—"],
      ["ed16","—"],["ed17","—"],["ed18","—"],
      ["ed19","—"],["ed20","—"],["ed21","—"],
      ["ed22","—"],["ed23","—"],["ed24","—"],
      ["ed25","—"],["ed26","—"],["ed27","—"],
      ["ed28","—"],["ed29","—"],
     ].map(([b, r]) => E("ebudavud", b, r, "Siyer 13/205-206")),

  /* Tirmizî'in talebeleri — Siyer 13/272 */
  ...[
      ["tr01","—"],["tr02","—"],["tr03","—"],
      ["tr04","—"],["tr05","—"],["tr06","—"],
      ["tr07","—"],["tr08","—"],["tr09","—"],
      ["tr10","—"],["tr11","—"],["tr12","—"],
      ["tr13","—"],["tr14","—"],["tr15","—"],
      ["tr16","—"],["tr17","—"],["tr18","—"],
      ["tr19","—"],["tr20","—"],["tr21","—"],
      ["tr22","—"],["tr23","—"],
     ].map(([b, r]) => E("tirmizi", b, r, "Siyer 13/272")),

  /* Nesâî'in talebeleri — Siyer 14/127 */
  ...[
      ["ed24","—"],["ns02","—"],["ns03","—"],
      ["ns04","—"],["ns05","—"],["ns06","—"],
      ["ns07","—"],["ns08","—"],["ns09","—"],
      ["ns10","—"],["ns11","—"],["ns12","—"],
      ["ns13","—"],["ns14","—"],["ns15","—"],
     ].map(([b, r]) => E("nesai", b, r, "Siyer 14/127")),

  /* İbn Mâce'in talebeleri — Siyer 13/278 */
  ...[
      ["im01","—"],["im02","—"],["im03","—"],
      ["im04","—"],["im05","—"],
     ].map(([b, r]) => E("ibnmace", b, r, "Siyer 13/278")),
  /* Buhârî'nin talebeleri — Siyer 12/397 */
  ...[
      ["tirmizi","—"],["ebuhatimrazi","—"],["bh03","—"],
      ["ed20","—"],["bh05","—"],["bh06","—"],
      ["bh07","—"],["bh08","—"],["bh09","—"],
      ["bh10","—"],["bh11","—"],["bh12","—"],
      ["ms28","—"],["bh14","—"],["bh15","—"],
      ["ed19","—"],["bh17","—"],["bh18","—"],
      ["bh19","—"],["bh20","—"],["bh21","—"],
      ["muslim","—"],
     ].map(([b, r]) => E("buhari", b, r, "Siyer 12/397")),
  /* Ebû Hüreyre'nin talebeleri — Tehzîb 7681 (Şâmile 3722, s. 34/367-377).
     Mizzî 338 isim sayıyor; Buhârî'den naklen «روى عنه نحو من ثمان مئة رجل
     أو أكثر» der. Buradaki 46 bağ, o listenin AĞDA ZATEN BULUNAN
     isimlerle kesişimi -- yeni düğüm açılmadı. Listede olup ağda bulunmayan
     isimler için önce o râvilerin kendi tercemeleri işlenmeli.

     Eşleştirme elle değil, tercemenin metni üzerinde KAYIT SINIRINA göre
     yapıldı: bir kaydın başı râvinin adıyla başlamalı. Alt dize araması
     denendi ve yanlış pozitif üretti -- «حميد بن عبد الرحمن بن عوف» kaydını
     Abdurrahman b. Avf düğümüyle eşleştiriyor, yani baba/dede adını talebe
     sayıyordu.

     SEMÂ KAYDI OLANLAR ALINMADI: Zührî («ولم يسمع منه»), Yezîd b. Rûmân ve
     Mekhûl (ikisi de «مرسل»). Mizzî bunları listede sayar ama semâının
     olmadığını aynı satırda belirtir; bağ olarak çizmek yanıltıcı olurdu. */
  ...[
      ["ibnabbas","ع"],["ibnomer","س"],["amrmeymun","سي"],["sureyhhani","—"],
      ["ebuidrishavlani","خ م س ق"],["ebuvail","د"],["ebulaliye","ت"],["urve","خ م د ت سي"],
      ["zeynelabidin","س"],["ebuselemeavf","ع"],["kayshazim","خ م ت"],["ubeydullahutbe","ع"],
      ["ebuumamesehl","م س ق"],["musatalha","م ت س"],["sabi","ع"],["mucahid","ع"],
      ["ebukilabe","س"],["ikrime","خ ٤"],["tavus","ع"],["suleymanyesar","ع"],
      ["sehrhavseb","٤"],["ataebirebah","ع"],["arac","ع"],["saidyesar","ع"],
      ["meymunmihran","ق"],["yezidkusayt","بخ د"],["ibnmunkedir","د"],["hemmammunebbih","ع"],
      ["ubeydullaherafi","م ٤"],["abdrahmanharis","س"],["mervan","د س"],["sabitkayszuraki","بخ د سي ق"],
      ["egarebumuslim","بخ م ٤"],["hafsubeydullahenes","ق"],["muhammedabbadcafer","عخ م ت س ق"],["muhammedsevban","م ت س ق"],
      ["sadhisam","ق"],["ebusaidmakburi","ع"],["ikrimehalid","ت"],["umeyrhani","د"],
      ["suleymanhabib","ق"],["saddadebuammar","ت ق"],["mutallibhantab","س ق"],["ammarebiammar","د ت س"],
      ["ibrahimkariz","م س"],["hakemmina","م"],
     ].map(([b, r]) => E("ebuhureyre", b, r, "Tehzîb 7681")),
  /* Şa‘bî'nin talebeleri — Tehzîb 3042 (Şâmile 3722, s. 14/32-33).
     Şa‘bî ağda dört hocasıyla duruyordu ama HİÇ TALEBESİ YOKTU: kendi
     tercemesi işlenmemişti, yalnızca başkalarının listelerinde talebe
     olarak geçiyordu (Mustafa fark etti, 2026-08-29). Kûfe'nin merkezî
     halkalarından biri için bu büyük bir boşluktu.
     Buradaki 27 bağ, Mizzî'nin «روى عنه» listesinin ağda zaten
     bulunan isimlerle kesişimi; eşleştirme Ebû Hüreyre'dekiyle aynı
     yöntemle, kayıt sınırına göre yapıldı. */
  ...[
      ["hakemuteybe","م"],["beyanbisr","خ م د س ق"],["ismailebihalid","خ م ت س"],["davudebihind","خت م ٤"],
      ["husaynabdrahman","خ م ت س ق"],["zubeydyami","خ م س"],["zekeriyyaebizaide","ع"],["ebuhasin","م ت س"],
      ["cabircufi","ق"],["mansurmutemir","ع"],["muhammedsuka","—"],["mutarriftarif","ع"],
      ["mekhul","—"],["rebiayezid","—"],["simakharb","م سي"],["selemekuheyl","خ م د س"],
      ["abdullahavn","خ م د س"],["ataisaib","س"],["asimahvel","ع"],["mugirmiksem","ع"],
      ["firasyahya","ع"],["saidmesrukhsevri","م د س"],["abdullahsubrume","د"],["mucalidsaid","م ٤"],
      ["salihhayy","ع"],["siyarebilhakem","خ م د س"],["halidselememahzumi","عس"],
     ].map(([b, r]) => E("sabi", b, r, "Tehzîb 3042")),
  ...[["ahnef","ص"],["esvedyezid","—"],["alkame","عس"],["ubeydesel","ع"],["suveydgafle","خ م ت س"],
      ["ebuvail","ت عس"],["zirhubeys","م ٤"],["sureyh","س"],["saidmusayyeb","ت س ق"],["hasanbasri","ت س"],
      ["rebihiras","خ مق ٤"],["zeydvehb","خ م د س"],["zadan","د ص ق"],["ebutufeyl","خ م د س"],
      ["harissuveyd","خ م س"],["harisemudarrib","د س"],["salimcad","د س فق"],["hayseme","بخ"],
      ["ibrhunayn","س ق"],["abdhayr","٤"],["harisaver","٤"],["asimdamra","٤"],["sabi","خ د س"],
      ["ibnebileyla","ع"],["urve","د س"],["ikrime","س"],["zeynelabidin","ت س"],["ubeydullaherafi","ع"],
      ["umerbali","٤"],["abdrahmanharis","٤"],["ubeydumeyr","عس"],["saidzuhadan","عس"],
      ["ibnabbas","خ م د س ق"],["ibnomer","—"],["ibnmesud","—"],["ibnzubeyr","—"],["bera","د س"],
      ["zeydarkam","—"],["cabirsemura","—"],["cabir","—"],["suhayb","—"],["sefine","—"],
      ["hasanbali","—"],["huseyn","ع"],["amrhurays","—"],["tariksihab","—"],["besrsuhaym","س"],
      ["ibncafer","خ م ت س ق"],["enes","—"]].map(([b, r]) => E("ali", b, r, "Tehzîb 4089")),
  ...[["enes","خ م"],["cabir","م"],["hasanbasri","خ ٤"],["salimibnomer","خ م س"],["hafsasim","ع"],
      ["humeydavf","ع"],["esvedhilal","س"],["zurareevfa","ع"],["busrsaid","خ ٤"],["hilas","خ ت س ق"],
      ["besirnehik","ع"],["ibrhunayn","بخ ق"],["hayseme","ت"],["zeydeslem","ت"],["salimcad","س ق"],
      ["bece","م س ق"],["saidmusayyeb","—"]].map(([b, r]) => E("ebuhureyre", b, r, "Tehzîb 7681")),

  // Hz. Ebû Bekir'den rivayet edenler — Tehzîb 3418
  ...[["enes","ع"],["bera","خ م د"],["cabir","ت"],["zeydarkam","—"],["zeydsabit","خ ت س"],
      ["suveydgafle","—"],["tariksihab","خ"],["ibnzubeyr","خ ت س"],["ibnabbas","خ د تم س ق"],
      ["ibnomer","خ ت"],["ibnmesud","—"],["ali","٤"],["omer","خ م د ت س"],
      ["amrhurays","ت ق"],["ebutufeyl","د"],["ebuhureyre","ع"],["aise","ع"],
      ["saidmusayyeb","د"],["ebusalih","سي"],["kayshazim","٤"],
      ["abdrahmanebubekir","م قد"],["abdrahmanavf","—"],["osman","—"],["ukbeamir","—"],
      ["ebumusa","—"],["ebusaid","ت"],["huzeyfe","—"],["rifaazuraki","ت"],
      ["aizamr","م"],["murreserahil","ت ق"],["abdrahmanyerbu","ت ق"],["abdrahmanabza","—"],
     ].map(([b, r]) => E("ebubekir", b, r, "Tehzîb 3418")),

  // Hz. Peygamber'den rivayet — yalnız okunan tercemelerde açıkça kayıtlı olanlar
  E("nebi", "ali", "ع", "Tehzîb 4089"),
  E("nebi", "ebuhureyre", "ع", "Tehzîb 7681"),
  E("nebi", "ebubekir", "ع", "Tehzîb 3418"),
  E("nebi", "fatima", "—", "Tehzîb, Kitâbü'n-nisâ — sayfa teyidi yapılmadı"),
  E("nebi", "abdullahamr", "ع", "Takrîb 3499"),
  E("nebi", "muazcebel", "ع", "Takrîb 6725"),
  E("nebi", "ebudderda", "ع", "Takrîb 5228"),
  E("nebi", "sehlsad", "ع", "Takrîb 2658"),

  // Hz. Ömer — Tehzîb 4225
  E("nebi", "omer", "بخ", "Tehzîb 4225"),
  E("ubey", "omer", "خ س", "Tehzîb 4225"),
  ...[["eslem","ع"],["esvedyezid","د"],["esaskays","د س ق"],["enes","خ م ت س ق"],["bera","—"],
      ["cabirsemura","س ق"],["cabir","ع"],["cerirbecelî","تم"],["huzeyfe","م"],["hasanbasri","د"],
      ["humeydavf","س"],["zeydsabit","خ ت س"],["salimcad","س"],["saibyezid","خ س"],
      ["sadvakkas","—"],["saidmusayyeb","٤"],["suveydgafle","م ت س"],["sureyh","س"],
      ["tariksihab","خ م ت س"],["talha","سي"],["abisrebia","خ م د ت س"],["asimomer","خ م د ت س"],
     ].map(([b, r]) => E("omer", b, r, "Tehzîb 4225")),

  // Hz. Osman — Tehzîb 3849
  E("nebi", "osman", "ع", "Tehzîb 3849"),
  E("omer", "osman", "—", "Tehzîb 3849"),
  ...[["ebanosman","بخ م ٤"],["ahnef","س"],["enes","خ ت س"],["busrsaid","س"],["hasanbasri","بخ ق"],
      ["hamranaban","ع"],["zeydsabit","—"],["zeydhalid","خ م"],["saibyezid","خ"],
      ["saidmusayyeb","خ م س ق"],["ebuvail","د ت ق"],["ebuumame","—"],["tariksihab","ت"],
      ["ibncafer","—"],["ibnzubeyr","خ ق"],["ibnabbas","د ت س"],["ibnomer","س"],
      ["abdrahmanharis","س"],["abdrahmanyezidnehai","م"],["alkame","م س"],["kayshazim","—"],
      ["malikevs","م د ت س"],["ibnhanefiyye","خ"],["mervan","خ س"],["mugirasube","—"],
      ["imranhusayn","—"],["selemeekva","تم"],["ataebirebah","ق"],["ebuabdrahmansulemi","خ ٤"],
     ].map(([b, r]) => E("osman", b, r, "Tehzîb 3849")),

  // ---- Zuhri, Tehzib 5606 ----
  ...[["ebanosman","سي"],["ibrhunayn","د ت س"],["ibrahimavf","ق"],["enes","ع"],
      ["sabitkayszuraki","بخ د سي ق"],["cabir","د"],["hasanhanefiyye","خ م كد س ق"],
      ["hafsasim","—"],["hamzaibnomer","ع"],["humeydavf","ع"],["haricezeyd","خ د ت س"],
      ["rafihadic","س"],["ibnomer","س"],["abdullahkab","خ م د س ق"],
      ["arac","ع"],["ubeydullahutbe","ع"],["ubeydullaherafi","د"],["urve","ع"],
      ["ataebirebah","خ م د س"],["zeynelabidin","ع"],["alkamevakkas","خ م د ت س"],
     ].map(([a, r]) => E(a, "ibnsihab", r, "Tehzîb 5606")),
  ...[["ibrahimsad","خ م د س ق"],["usamezeydleysi","د ت ق"],["eyyubsahtiyani","س"],
      ["haccacertat","د ق"],["ibnuyeyne","ع"],["zeydeslem","—"],["salihkeysan","ع"],
      ["suaybebihamza","ع"],
     ].map(([b, r]) => E("ibnsihab", b, r, "Tehzîb 5606")),

  // ---- Katade, Tehzib (bab el-kaf, s. 23/499-505) ----
  ...[["enes","ع"],["hasanbasri","ع"],["cabirzeyd","ع"],["ebulaliye","ع"],
      ["bekirmuzeni","س"],["zurareevfa","ع"],["salimcad","خ م ت س"],
      ["saidmusayyeb","خ م ت س ق"],["hayseme","ت"],["hilas","م ٤"],
      ["humeydavf","سي"],["sefine","س"],
     ].map(([a, r]) => E(a, "katade", r, "Tehzîb, Kâf bölümü")),
  ...[["eyyubsahtiyani","د س ق"],["haccacertat","د"],["hammadseleme","خت م ٤"],
      ["ibnebiaruba","ع"],["amess","—"],["sube","ع"],["evzai","م د ت ق"],
      ["mamer","خت م ٤"],["hisamdestuvai","ع"],["hemmamyahya","ع"],
      ["ebuavane","ع"],["cerirhazim","ع"],["misersukdam","خ م"],
      ["leysbsad","س"],["amrharis","خ م س"],["suleymanteymi","خ م د س ق"],
     ].map(([b, r]) => E("katade", b, r, "Tehzîb, Kâf bölümü")),

  // ---- A'mes, Tehzib 2570 ----
  ...[["nehai","ع"],["ibrahimteymi","ع"],["habibebisabit","م ٤"],["enes","د ت"],
      ["ebuduha","ع"],["yahyavessab","بخ ت ق"],["mearrursuveyd","ع"],
      ["hakemuteybe","—"],
     ].map(([a, r]) => E(a, "amess", r, "Tehzîb 2570")),
  ...[["sevri","ع"],["ibnuyeyne","خ م ت"],["sube","خ م د ت س"],
      ["ibnmubarek","س"],["hafsgiyas","ع"],["cerirabdulhamid","ع"],
      ["cerirhazim","م"],["ibnnumeyr","م ٤"],["ibnidris","م ق"],
      ["alimushir","خ م ت س ق"],["suleymanteymi","ت"],["hakemuteybe","—"],
     ].map(([b, r]) => E("amess", b, r, "Tehzîb 2570")),

  // ---- Amr b. Dinar el-Mekki, Tehzib 4360 ----
  ...[["cabirzeyd","ع"],["cabir","ع"],["hasanhanefiyye","خ م د ت س"],
      ["ebusalih","خ م س ق"],["salimibnomer","خ م د س"],["saibyezid","—"],
      ["saidcubeyr","ع"],["saidmusayyeb","—"],["suleymanyesar","م"],["tavus","ع"],
      ["ibnzubeyr","—"],["ibnabbas","ع"],["ibnomer","ع"],["ubeydumeyr","فق"],
      ["urve","م"],["ataebirebah","ع"],["ikrime","خ ٤"],["kureyb","خ م ت س ق"],
      ["mucahid","خ م س"],["ebucafermuhbakir","خ م د س"],["ibnsihab","خ م ت س ق"],
      ["vehbmunebbih","خ م ت س"],["ebutufeyl","ر م"],["ebuselemeavf","م س"],
      ["ebuhureyre","ق"],
     ].map(([a, r]) => E(a, "amrdinar", r, "Tehzîb 4360")),
  ...[["eyyubsahtiyani","خ م"],["hammadzeyd","خ م د ت س"],["hammadseleme","س"],
      ["davudattar","ع"],["zekeriyyaishak","ع"],["sevri","خ م"],
      ["ibnuyeyne","ع"],["sube","خ م س"],["ibncureyc","خ م د س"],
      ["katade","—"],["malik","—"],["misersukdam","—"],["huseym","م"],
      ["ebuavane","خ"],["varkaomer","خ م د ت س"],["amrharis","—"],
     ].map(([b, r]) => E("amrdinar", b, r, "Tehzîb 4360")),

  // ---- Ebu Ishak es-Sebii, Tehzib 4400 ----
  ...[["esaskays","—"],["esvedyezid","ع"],["enes","سي"],["bera","ع"],
      ["egarebumuslim","بخ م"],["usame","—"],["amrmeymun","ع"],
      ["mesruk","م د س"],["kayshazim","—"],["mucahid","س"],
      ["ebucafermuhbakir","خ"],["musatalha","م"],["nafiibnomer","س ق"],
      ["numanbesir","خ م ت"],["mugirasube","—"],
     ].map(([a, r]) => E(a, "ebuishaksebii", r, "Tehzîb 4400")),
  ...[["sevri","ع"],["ibnuyeyne","ت سي"],["amess","م ت س ق"],
      ["sube","ع"],["suleymanteymi","ت س"],["zuhayrmuaviye","ع"],
      ["zaidekudame","د"],["ibnebizaide","خ م د س"],["ebulahvess","ع"],
      ["serikkadi","٤"],["hamzazeyyat","٤"],["katade","س"],
     ].map(([b, r]) => E("ebuishaksebii", b, r, "Tehzîb 4400")),

  // ---- Yahya b. Ebi Kesir, Tehzib 6907 ----
  ...[["ibrahimkariz","م د ت"],["ishaktalha","خ م س"],["enes","س"],
      ["bece","خ م مد ت س"],["cabir","مد"],["hafsasim","—"],
      ["hakemmina","ق"],["saibyezid","—"],["suleymanyesar","—"],
      ["abdullahebikatade","ع"],["evzai","م"],["ubeydullahmiksem","خ م د س"],
      ["urve","ت ق"],["ataebirebah","س ق"],["ikrime","خ ٤"],
      ["muhammedibrahimteymi","خ م س"],["nafiibnomer","س"],
      ["hilalebimeymune","خ م د س"],["ebuselemeavf","ع"],["ebukilabe","ع"],
      ["ebunadra","م"],["ebuumame","م"],
     ].map(([a, r]) => E(a, "yahyaebikesir", r, "Tehzîb 6907")),
  ...[["eyyubsahtiyani","م"],["cerirhazim","—"],["haccacsavvaf","م ٤"],
      ["huseynmuallim","خ م د ت س"],["seybannahvi","خ م س"],
      ["evzai","ع"],["ikrimeammar","خت م د ق"],["alimubarek","ع"],
      ["muaviyesellam","ع"],["mamer","خ م د ت س"],["hisamhassan","ق"],
      ["hisamdestuvai","خ م س"],["hemmamyahya","خ م"],["yahyasaidensari","—"],
     ].map(([b, r]) => E("yahyaebikesir", b, r, "Tehzîb 6907")),

  // ---- Ibn Abbas, Tehzib 3358 ----
  ...[["ubey","ع"],["usame","خ م س ق"],["bureyde","س"],["temimdari","ت"],
      ["halidvelid","خ م د س ق"],
     ].map(([a, r]) => E(a, "ibnabbas", r, "Tehzîb 3358")),
  ...[["hasanbasri","د ت س"],["hakemmina","س ق"],["humeydavf","خ م ت س"],
      ["ebusalih","خ م س ق"],["ebulaliye","ع"],["zurareevfa","ت س"],
      ["salimcad","س ق"],["saidcubeyr","ع"],["saidmusayyeb","خ م د س ق"],
      ["saidyesar","م د س"],["suleymanyesar","ع"],["sehrhavseb","بخ ت س"],
      ["dahhak","ت س ق"],["tavus","ع"],["sabi","ع"],["ebutufeyl","م د ت ق"],
      ["ibnebimuleyke","ع"],["ubeydullahebiyezid","ع"],["ubeydullahutbe","ع"],
      ["abdullahmabed","م د س ق"],["ebulminhal","ع"],["hakemarac","م د ت س"],
      ["ebuzabyan","خ د ت س"],["ikrime","ع"],["mucahid","ع"],["ataebirebah","ع"],
      ["kureyb","ع"],["ibnsihab","—"],
     ].map(([b, r]) => E("ibnabbas", b, r, "Tehzîb 3358")),

  // ---- Ibn Omer, Tehzib 3441 ----
  ...[["bilal","ع"],["rafihadic","م د س ق"],["zeydsabit","ع"],
      ["sadvakkas","خ س"],["suhayb","٤"],["amirrebia","ع"],["ibnmesud","ت"],
      ["omer","ع"],
      ["ebusaid","خ"],["hafsa","ع"],["aise","م ت س"],["ebulubabe","م د"],
     ].map(([a, r]) => E(a, "ibnomer", r, "Tehzîb 3441")),
  ...[["eslem","خ م ق"],["enessirin","خ م ت ق"],["busrsaid","م"],
      ["sabitbunani","م س"],["cebeleshim","ع"],["habibebisabit","٤"],
      ["hasanbasri","س ق"],["hafsasim","خ م د س ق"],["hakemmina","م س ق"],
      ["hamzaibnomerogul","ع"],["humeydavf","خ م س"],["ebusalih","م د"],
      ["zadan","بخ م د ت س"],["zeydeslem","ع"],["salimcad","خ"],
      ["salimibnomer","ع"],["sadubeyde","خ م د ت ص"],["saidcubeyr","ع"],
      ["saidmusayyeb","خ م س ق"],["saidyesar","ع"],["suleymanyesar","د س"],
      ["safvanmuhriz","خ م س ق"],["tavus","ع"],["abdullahdinar","ع"],
      ["nafiibnomer","—"],["ataebirebah","—"],
     ].map(([b, r]) => E("ibnomer", b, r, "Tehzîb 3441")),

  // ---- Enes b. Malik, Tehzib (bab el-elif, s. 3/355-356) ----
  ...[["sumameenes","ع"],["sabitbunani","ع"],["hasanbasri","ع"],["bekirmuzeni","ع"],
      ["humeydtavil","ع"],["hafsubeydullahenes","خ م ت س ق"],["cadebuosman","خ م د ت س"],
      ["enessirin","—"],["rebiaebiabdrahman","خ م ت س"],["ebulaliye","ت"],
      ["habibebisabit","ت"],["bekirahnes","م"],["zubeyradi","خ م ت"],
      ["beyanbisr","خ ت س"],["bisryesar","خ"],["salimcad","خ م"],
      ["zeydeslem","س"],["ibnomer","—"],
     ].map(([b, r]) => E("enes", b, r, "Tehzîb, bâbü'l-elif")),

  // ---- Cabir b. Abdullah, Tehzib (bab el-cim) ----
  ...[["ebuzubeyrmekki","ع"],["ibnmunkedir","ع"],["vehbkeysan","٤"],
      ["ebucafermuhbakir","ع"],["muhammedabbadcafer","خ م س ق"],
      ["muhammedsevban","خ ٤"],["mahmudlebid","بخ د"],["ebunadra","خ م ٤"],
      ["ebuselemeavf","ع"],["yezidsuheybfakir","خ م د س ق"],
      ["vehbmunebbih","د"],["ataebirebah","—"],["saidcubeyr","—"],
     ].map(([b, r]) => E("cabir", b, r, "Tehzîb, bâbü'l-cîm")),

  // ---- Ebu Said el-Hudri, Tehzib (bab es-sin, s. 10/298) ----
  ...[["kasimmuhaymire","ق"],["katade","د"],["kazaayahya","ع"],["mucahid","س"],
      ["ibnsirin","س"],["muhammedsevban","د"],["ebucafermuhbakir","٤"],
      ["mahmudlebid","ق"],["mabedsirin","خ م د س"],["nafiibnomer","خ م ت س"],
      ["numanebiayyas","خ م ت س ق"],["yahyaumare","ع"],["ebuumamesehl","خ م د ت س"],
      ["ebusaidmakburi","خ س"],["ebuselemeavf","ع"],["ebusalih","ع"],
      ["ebussiddiknaci","ع"],["ebulaliye","س"],["ebuidrishavlani","م"],
      ["ebunadra","—"],["muhammedibrahimteymi","ت ق"],
     ].map(([b, r]) => E("ebusaid", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Aise, Tehzib 8862 (Kitabu'n-nisa) ----
  ...[["nehai","د س ق"],["ibrahimteymi","د س"],["esvedyezid","ع"],
      ["hasanbasri","د س"],["hamzaibnomerogul","م س"],["hilas","د س"],
      ["hayseme","د ت ق"],["ebusalih","د ت ق"],["zekvanmevlaaise","خ م د س"],
      ["zadan","سي"],["zurareevfa","د"],["zirhubeys","تم"],["zeydeslem","د"],
      ["zeydhalid","د سي"],["salimcad","د"],["salimibnomer","س"],
      ["saibyezid","ت"],["sadhisam","ع"],["saidcubeyr","—"],["ebusaidmakburi","س"],
      ["saidmusayyeb","ع"],["suleymanyesar","ع"],["sureyhhani","بخ م ٤"],
      ["ebuvail","ت س"],["sehrhavseb","بخ"],["tavus","م ت س"],
      ["abisrebia","خ م ت س ق"],["sabi","د ت س"],["abbadabdullahzubeyr","ع"],
      ["ibnzubeyr","ع"],["abdullahsedddad","خ م د ق"],["abdullahsakik","م ٤"],
      ["ibnabbas","خ ت س"],["ibnebimuleyke","ع"],["amrabdrahmanzurara","ع"],["kasimmuhammed","ع"],
     ].map(([b, r]) => E("aise", b, r, "Tehzîb 8862")),

  // ---- Malik b. Enes, Tehzib (bab el-mim, s. 27/93-109) ----
  ...[["ishaktalha","ع"],["eyyubsahtiyani","د ت س"],["caferisadik","م ت س ق"],
      ["humeyskaysarac","خ س"],["humeydtavil","خ م د ت س"],["hubeybabdrahman","م ت"],
      ["davudhusayn","ع"],["rebiaebiabdrahman","خ م د ت س"],["ziyadsad","عخ م س"],
      ["zeydeslem","خ م د ت س"],["salimebinadr","ع"],["nafiibnomer","ع"],
      ["yahyasaidensari","خ م د ت س"],["yezidrouman","خ م د س"],
      ["yezidkusayt","م د س ق"],["yezidhad","خ د ت س"],["ataihorasani","مد"],
      ["abdulmecidsuheyl","خ م س"],["ibnsihab","ع"],["ibnmunkedir","ع"],
      ["ebuzubeyrmekki","م"],["abdullahdinar","ع"],].map(([a, r]) => E(a, "malik", r, "Tehzîb, bâbü'l-mîm")),
  ...[["ibnuyeyne","س"],["sube","م ت س ق"],["sevri","—"],["ibnmubarek","خ م ت س"],
      ["ibnidris","ت"],["ibnvehb","خ م س"],["kanebi","خ م د ت"],
      ["ibnkasimmisri","مد س"],["ibnmehdi","ع"],["safii","—"],["kuteybesaid","خ م د ت س"],
      ["ibnebiuveys","خ م"],["ibnuleyye","—"],["velidmuslim","—"],
      ["ebunuaymfadl","خ س"],["ebuasimnebil","خ"],["veki","—"],
      ["kattan","خ"],["ibnebizaide","س"],["leysbsad","—"],["evzai","—"],
      ["ibncureyc","—"],
     ].map(([b, r]) => E("malik", b, r, "Tehzîb, bâbü'l-mîm")),

  // ---- Su'be b. el-Haccac, Tehzib (bab es-sin, s. 12/480-489) ----
  ...[["ismailebihalid","خ م"],["enessirin","خ م د س ق"],["eyyubsahtiyani","خ م س"],
      ["sabitbunani","خ م د ت س"],["cebeleshim","خ م س"],["cameseddad","خ م د س ق"],
      ["caferisadik","—"],["habibebisabit","خ م س"],["hakemuteybe","خ م د ت س"],
      ["hammadebisuleyman","م د ت س"],["huseynmuallim","خ"],["husaynabdrahman","خ م س"],
      ["humeydtavil","خ م س"],["halidhazza","خ م د س"],["hubeybabdrahman","ع"],
      ["davudebihind","س"],["rebiaebiabdrahman","—"],["zubeydyami","خ م د س ق"],
      ["zekeriyyaebizaide","—"],["sadibrahim","ع"],["ibnsihab","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "sube", r, "Tehzîb, bâbü'ş-şîn")),
  ...[["gunder","ع"],["kattan","ع"],["ibnmehdi","ع"],["veki","ع"],
      ["ibnmubarek","خ مق ت س"],["ibnidris","خ م د ت س"],["ibnebizaide","ت"],
      ["yezidharun","خ م ت س ق"],["yezidzurey","م د س ق"],["nadrsumeyl","خ م ت س ق"],
      ["ebudavudtayalisi","خت م د ت س"],["muazmuaz","خ م د س"],["affanmuslim","م س"],
      ["alicad","خ د"],["abdussamed","خ م ت س ق"],["isabyunus","م سي"],
      ["huseym","س"],["ebunuaymfadl","—"],["ebuasimnebil","خ"],["kanebi","د"],
      ["ibnuleyye","ت س"],["varkaomer","س"],
     ].map(([b, r]) => E("sube", b, r, "Tehzîb, bâbü'ş-şîn")),

  // ---- Sufyan es-Sevri, Tehzib (bab es-sin, s. 11/155-162) ----
  ...[["ibrahimukbe","م د س ق"],["ismailumeyye","م مد ت س ق"],["ismailebihalid","خ م"],
      ["suddi","م د ت س"],["esvedkays","ع"],["eyyubsahtiyani","خ م س"],
      ["sevryezid","خ د س"],["cabircufi","د ق"],["cameseddad","خ ت"],
      ["cebeleshim","خ م ت س ق"],["caferisadik","م ٤"],["habibebisabit","خ م ت س ق"],
      ["hasanubeydullah","م س"],["hasanamrfukaymi","خ د س"],["husaynabdrahman","خ م س"],
      ["hammadebisuleyman","م س ق"],["ebuhasin","ع"],["katade","—"],["ibnsihab","—"],
      ].map(([a, r]) => E(a, "sevri", r, "Tehzîb, bâbü's-sîn")),
  ...[["ishakyusufezrak","ع"],["ibnuleyye","م"],["cerirabdulhamid","—"],
      ["caferavn","خ م"],["hafsgiyas","—"],["ebuusamehammad","خ م ق"],
      ["halidharis","خ"],["ruhubade","م عس"],["zaidekudame","—"],
      ["zuhayrmuaviye","—"],["ibnuyeyne","—"],["suleymanbilal","—"],
      ["ebudavudtayalisi","س"],["ebulahvess","—"],["ebuasimnebil","خ م ت"],
      ["damrarebia","س ق"],["bisrsari","م ت س"],["abdurrezzak","—"],
      ["veki","—"],["ibnmubarek","—"],["ibnmehdi","—"],["kattan","—"],
      ["malik","—"],["yahyaadem","—"],
     ].map(([b, r]) => E("sevri", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Sufyan b. Uyeyne, Tehzib 2413 (s. 11/182-183) ----
  ...[["ibnmunkedir","ع"],["hisamurve","ع"],["yahyasaidensari","خ م س ق"],
      ["mansurmutemir","خ م ت"],["mansursafiyye","خ م د س"],["mamer","خ م ت س ق"],
      ["misersukdam","خ م ت ق"],["musaukbe","خ"],["muhammedacilan","بخ م د ت ق"],
      ["muhammedamralkame","خ م ت"],["muhammedsuka","خ ت ق"],["mutarriftarif","خ م ت س ق"],
      ["ismailebiislamsibani","خ م د ق"],["velidkesir","خ م س ق"],["yezidhusayfe","م د تم س ق"],
      ["yezidhad","س"],["hisamhassan","م س"],["ebuzubeyrmekki","م ت س ق"],
      ["ataebirebah","—"],
     ].map(([a, r]) => E(a, "ibnuyeyne", r, "Tehzîb 2413")),
  ...[["ahmedhanbel","م د"],["ibnrahuye","خ م س"],["ahmedsalihmisri","د"],
      ["ahmedmeni","ت ق"],["ibrahimfezari","—"],["safii","—"],
      ["kattan","—"],["ibnmehdi","—"],["kuteybesaid","—"],
     ].map(([b, r]) => E("ibnuyeyne", b, r, "Tehzîb 2413")),

  // ---- Ibn Cureyc, Tehzib (s. 18/341-344) ----
  ...[["abdullahtavus","م د س"],["ibnebimuleyke","ع"],["ibnhuseymkhaysem","س"],
      ["abdulhamidcubeyr","ع"],["abdulkerimcezeri","خ م ت س"],["ataebirebah","ع"],
      ["ataihorasani","خ م ق"],["ikrimehalid","خ د س"],["ikrime","ت"],
      ["amrsuayb","٤"],["kasimebibezze","خ م س"],
      ["alaabdrahman","ر م"],["mucahid","فق"],["muhammedabbadcafer","خ م د س ق"],
      ["yahyasaidensari","م"],["ubeydullahomeri","خ م س ق"],["ubeydullahebiyezid","م د ت س"],
      ["ibnsihab","—"],["hisamurve","—"],["nafiibnomer","—"],
     ].map(([a, r]) => E(a, "ibncureyc", r, "Tehzîb, bâbü'l-ayn")),
  ...[["haccacmuhammed","ع"],["ibnuleyye","خ م د س"],["ismailayyas","س"],
      ["enesiyaz","م"],["sevryezid","س ق"],["caferavn","س"],["hafsgiyas","م د س"],
      ["ebuusamehammad","م"],["hammadzeyd","خ"],["hammadseleme","—"],
      ["halidharis","م س"],["ruhubade","خ م ت ق"],["davudattar","د س"],
      ["sevri","—"],["ibnuyeyne","—"],["abdurrezzak","—"],
     ].map(([b, r]) => E("ibncureyc", b, r, "Tehzîb, bâbü'l-ayn")),

  // ---- Ma'mer b. Rasid, Tehzib (s. 28/305-306) ----
  //  Bu tercemede İbnü'l-Medînî'nin ikinci tabaka ifadesi aynen geçer:
  //  «fe-li-ehli'l-Basra Şu‘be ve Saîd b. Ebî Arûbe ve Hammâd b. Seleme ve Ma‘mer b. Râşid»
  ...[["ibnsihab","ع"],["ibnmunkedir","م ت"],["hisamurve","خ م د س"],
      ["hemmammunebbih","ع"],["matarverrak","س"],["mansurmutemir","—"],
      ["ebuishaksebii","—"],
      ["amrdinar","—"],["eyyubsahtiyani","—"],
     ].map(([a, r]) => E(a, "mamer", r, "Tehzîb, bâbü'l-mîm")),
  ...[["abdurrezzak","ع"],["hisamyusufsanani","خ د ت س"],["ibnmubarek","خ م ت س ق"],
      ["ibnuleyye","م س"],["sevri","خ ت س ق"],
      ["mutemirsuleyman","م س"],["abdulalaabdulala","خ م س ق"],["isabyunus","م س ق"],
      ["yezidzurey","خ م ت س"],["gunder","خ"],["hammadzeyd","—"],
      ["vuheybhalid","—"],["ebansattar","د"],["mervanfezari","—"],
      ["vakidi","—"],["ibncureyc","م س"],["ibnebiaruba","—"],
      ["sube","—"],["hisamdestuvai","س"],["davudattar","ت"],
     ].map(([b, r]) => E("mamer", b, r, "Tehzîb, bâbü'l-mîm")),

  // ---- Evzai, Tehzib 3918 (s. 17/308-309) ----
  ...[["ishaktalha","خ م س"],["hassanatiyye","ع"],["rebiaebiabdrahman","م"],
      ["rebiayezid","س ق"],["suleymanhabib","خ د ق"],["amess","—"],
      ["suleymanmusadimaski","مق"],["saddadebuammar","م ٤"],["hakemuteybe","—"],
      ["abdelubabe","خ م ت س"],["ataebirebah","خ م د س ق"],["ataihorasani","س"],
      ["ikrimehalid","—"],["amrsuayb","ر د سي"],["umeyrhani","ع"],
      ["kasimmuhaymire","—"],["kurrahayvil","٤"],
      ["muhammedibrahimteymi","م"],["ibnsirin","ق"],["muhammedabbadcafer","—"],
      ["ebucafermuhbakir","م"],["ibnsihab","ع"],["ibnmunkedir","—"],
      ["muhammedvelidzubeydi","د س"],["mutallibhantab","ر س ق"],["mekhul","ق"],
      ["nafiibnomer","خ ق"],["yahyasaidensari","م س"],["meymunmihran","—"],["ibncureyc","ق"],
     ].map(([a, r]) => E(a, "evzai", r, "Tehzîb 3918")),

  // ---- Evzai'nin talebeleri, Tehzib 3918 (s. 17/310-311) ----
  ...[["ibrahimfezari","س"],["ismailayyas","ر"],["enesiyaz","س"],["bakiyyevelid","خت ق"],
      ["ibnmubarek","خ م ت سي ق"],["ibnnumeyr","—"],["abdurrezzak","س"],
      ["ebulmugirehavlani","ع"],["ubeydullahmusa","خ ق"],["isabyunus","م"],
      ["suaybishakdimaski","خ م د س"],["muhammedharbhavlani","خ س"],
      ["muhammedsuaybsabur","د س ق"],["firyabi","ع"],["hikalziyad","م ٤"],
      ["veki","م"],["mafairan","خ د س"],["amrebiselemetennisi","خ م"],
      ["bisrbekirtennisi","خ د س"],["damrarebia","س"],["saidabdulaziz","—"],
      ["sevri","—"],["sube","—"],["malik","—"],["ebuasimnebil","—"],
     ].map(([b, r]) => E("evzai", b, r, "Tehzîb 3918")),

  // ---- Ibn Ebi Aruba, Tehzib (s. 11/6-9) ----
  ...[["eyyubsahtiyani","د ت س"],["hasanbasri","—"],["amess","—"],
      ["asimbehdele","—"],["alizeydcudan","—"],["amiralhavl","س ق"],
      ["ikrimeammar","—"],
     ].map(([a, r]) => E(a, "ibnebiaruba", r, "Tehzîb, bâbü's-sîn")),
  ...[["abdulvarissaid","خ ت س"],["abdulvehhabata","عخ م د س"],["abdesuleyman","م د س ق"],
      ["alimushir","م"],["isabyunus","م د س"],["muhammedbisrabdi","م ت ق"],
      ["gunder","م د"],["muhammedebiadi","خ م د ت ق"],["muazmuaz","د"],
      ["nadrsumeyl","ق"],["kattan","خ م د س"],["yezidzurey","ع"],
      ["yezidharun","—"],["ruhubade","—"],["halidharis","—"],
     ].map(([b, r]) => E("ibnebiaruba", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Hammad b. Seleme, Tehzib 1481 (s. 7/254-258) ----
  ...[["ishaktalha","م د س ق"],["enessirin","م د س"],["eyyubsahtiyani","خت م ٤"],
      ["sabitbunani","خت م ٤"],["sumameenes","د س"],["haccacertat","ت ق"],
      ["hammadebisuleyman","د س ق"],["humeydtavil","خت م ٤"],["halidhazza","—"],
      ["davudebihind","م د ق"],["rebiaebiabdrahman","م"],["zeydeslem","—"],
      ["sadibrahim","خت"],["cureyri","م د س"],["selemekuheyl","م د"],
      ["suleymanteymi","م س"],["simakharb","ر م ٤"],["suheylebisalih","م د سي"],
      ["asimbehdele","د س ق"],["amiralhavl","د"],["ibnebimuleyke","—"],
      ["ibnhuseymkhaysem","د ق"],["abdullahavn","—"],["ubeydullahomeri2","م د"],
      ["ebuimrancevni","خت م د ت س"],["abdulmelikumeyr","م"],
      ["ubeydullahomeri","خت م د ق"],["ataisaib","د س ق"],["ataihorasani","د ت"],
      ["ikrimehalid","—"],["alizeydcudan","بخ م د ت ق"],["ammarebiammar","م قد ت س ق"],["amryahyamazini","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "hammadseleme", r, "Tehzîb 1481")),
  ...[["ibnmehdi","م ت س ق"],["abdussamed","م ت ق"],["affanmuslim","م ٤"],
      ["ebunuaymfadl","—"],["hebbanhilal","م"],["musaismailtebuzeki","خت د س ق"],
      ["hisamtayalisi","—"],["muslimibrahim","د س"],["amrmerzuk","—"],
      ["ebunasrtemmar","م س"],["nadrsumeyl","م س ق"],["muazmuaz","ت"],
      ["malik","—"],["ibnuleyye","—"],
     ].map(([b, r]) => E("hammadseleme", b, r, "Tehzîb 1481")),

  // ---- Ebu Avane el-Vasiti, Tehzib (s. 30/443-444) ----
  ...[["caferebivahsiyye","خ م د ت س"],["husaynabdrahman","خ م س"],["hakemuteybe","م"],
      ["hammadebisuleyman","—"],["davudebihind","—"],["sadibrahim","م س"],
      ["saidmesrukhsevri","خ ت"],["amess","خ م ت س ق"],["simakharb","ي م د ت س"],
      ["suheylebisalih","م د ت"],["asimbehdele","د س"],["asimahvel","خ م"],
      ["abdullahavn","—"],["abdulazizsuheyb","م د ت س"],["abdulmelikebisuleyman","س"],
      ["abdulmelikumeyr","بخ م"],["ataisaib","ت"],
      ["firasyahya","خ م د س"],["ibnishak","ر"],
      ["ibnmunkedir","م س"],["mutarriftarif","س"],["mugirmiksem","خ م"],
      ["mansurzazan","م س"],["mansurmutemir","م"],["ismailebiislamsibani","خ م"],
      ["ebuzubeyrmekki","م س ق"],["ebuhasin","خ م ق"],["hilalvezzan","خ م د س"],
      ["yalaata","م د س"],
     ].map(([a, r]) => E(a, "ebuavane", r, "Tehzîb, bâbü'l-vâv")),
  ...[["ibnuleyye","—"],["ibnmehdi","—"],["said_mansur","م"],["kavariri","م"],
      ["seybanferruh","م س"],["haccacminhal","خ"],["halefhisam","د"],
      ["affanmuslim","—"],["musaismailtebuzeki","—"],["hisamtayalisi","—"],
     ].map(([b, r]) => E("ebuavane", b, r, "Tehzîb, bâbü'l-vâv")),

  // ---- Huseym b. Besir, Tehzib (s. 30/273-274) ----
  //  Mizzi bu tercemede cok sayida sema ve tedlis kaydi nakleder.
  ...[["eyyubsahtiyani","—"],["caferebivahsiyye","ع"],["haccacertat","د ت"],
      ["haccacsavvaf","س"],["husaynabdrahman","خ م ت سي"],["humeydtavil","خ م د ت س"],
      ["halidhazza","خ م د"],["davudebihind","م"],["sufyanhusayn","س"],
      ["amess","م"],["suleymanteymi","م"],["siyarebilhakem","خ م س"],["salihhayy","م"],["asimahvel","م"],["amiralhavl","ت ق"],
      ["abdullahsubrume","د س"],["ebusalih","—"],["abdullahavn","س"],
      ["abdulhamidcafer","م"],["abdulazizsuheyb","م د س"],["abdulmelikebisuleyman","م د س ق"],
      ["abdulmelikumeyr","م"],["ubeydullahomeri","—"],["ataisaib","خ"],
      ["alizeydcudan","ت ق"],["avvamhavseb","خ د س"],
      ["avfarabi","د ت"],["kasimmihran","م"],["leysbsad","س"],
      ["mucalidsaid","م د ت"],["ibnishak","ت"],["ibnsihab","ت س"],
      ["mutarriftarif","ت"],["mugirmiksem","خ م"],["mansurzazan","ع"],
      ["hisamhassan","م ت س"],["hisamyusufsanani","سي"],["yahyasaidensari","م د س"],
     ].map(([a, r]) => E(a, "huseym", r, "Tehzîb, bâbü'l-hâ")),

  // ---- Huseym'in talebeleri, Tehzib (s. 30/275-276) ----
  ...[["ahmedhanbel","م د"],["ahmedmeni","م ت س"],["ibnebiseybe","م ق"],
      ["osmanebiseybe","خ م د"],["zuheyrharb","م د ق"],["alimedini","خ"],
      ["alihucr","م"],["amrnakid","خ م"],["ahmeddevraki","د ق"],
      ["saidsuleymansadeviye","خ م ت س"],["muhammedisataba","خت د س"],
      ["said_mansur","م ق"],["kuteybesaid","خ"],["gunder","—"],
      ["ibnmubarek","—"],["ibnmehdi","—"],["sevri","—"],["sube","—"],
      ["malik","—"],["ibnuyeyne","—"],
     ].map(([b, r]) => E("huseym", b, r, "Tehzîb, bâbü'l-hâ")),

  // ---- Ibn Ishak, Tehzib 5057 (s. 24/411-412) ----
  //  Mizzi burada Ali b. el-Medini'nin sozunu nakleder: «medaru hadisi
  //  Resulillah ala sitte... summe sara ilmu's-sitteti inde isney aser,
  //  ehaduhum Muhammed b. Ishak»
  ...[["ebanosman","—"],["ataebirebah","—"],["ebuselemeavf","—"],
      ["kasimmuhammed","—"],["mekhul","—"],["abdrahmanesved","—"],
      ["ibnsihab","—"],["yezidebihabib","—"],["enes","—"],
     ].map(([a, r]) => E(a, "ibnishak", r, "Tehzîb 5057")),
  ...[["yezidharun","رم"],["yezidzurey","س"],["yalaubeyd","د س ق"],
      ["yunusbukeyr","ر د ت ق"],["ibnuleyye","—"],
     ].map(([b, r]) => E("ibnishak", b, r, "Tehzîb 5057")),

  // ---- Veki' b. el-Cerrah, Tehzib (s. 30/464-471) ----
  ...[["zekeriyyaishak","ع"],["zekeriyyaebizaide","م ٤"],["ibnuyeyne","—"],["amess","خ م د ت ق"],["serikkadi","ت"],["abdullahavn","م"],["abdulhamidcafer","م ق"],["mesudi","د ق"],["ibncureyc","م ق"],
      ["ubeydullahomeri","—"],["ikrimeammar","م د س ق"],["aliebisalihhayy","م ت س"],
      ["alimubarekhinai","خ م س ق"],["omerzerr","خ د ت"],["hanzalasufyan","م ت"],
      ["suleymanmugire","س ق"],["saidubeydtai","م"],["davudkaysferra","س ق"],
      ["saidabdulaziz","د ق"],["abdulazizomer","٤"],["hisamurve","—"],
      ["hammadzeyd","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "veki", r, "Tehzîb, bâbü'l-vâv")),
  ...[["ahmedhanbel","—"],["ibnmain","—"],["alimedini","—"],
      ["ibnebiseybe","—"],["osmanebiseybe","—"],["misned","د"],
      ["hennadseri","—"],["yahyayahyanisaburi","م"],["mahmudgaylan","ت س"],
      ["ibnebiomeradeni","م ت"],["nasralicehdami","م"],["yahyaadem","—"],
      ["yezidharun","—"],["kuteybesaid","—"],["ibnrahuye","—"],
     ].map(([b, r]) => E("veki", b, r, "Tehzîb, bâbü'l-vâv")),

  // ---- Ibnu'l-Mubarek, Tehzib 3520 (s. 16/6-7) ----
  ...[["ibrahimsad","—"],["ibrahimtahman","خ"],["ibrahimebiable","س"],
      ["ibrahimfezari","—"],["ibrahimukbe","م س"],["usamezeydeslem","ق"],
      ["usamezeydleysi","خت ع"],["ismailebihalid","م"],["ismailayyas","ق"],
      ["ebuburde","م"],["cerirhazim","—"],["caferburkan","س"],
      ["haccacertat","س ق"],["harmalaimran","د ق"],["huseynmuallim","خ م د ت س"],
      ["hammadzeyd","—"],["hammadseleme","ت س"],["hamzazeyyat","س"],
      ["humeydtavil","خ د ت س"],["hanzalasufyan","س"],["hayveseri","خ م د ت س"],
      ["halidhazza","س"],["davudattar","—"],["davudkaysferra","رمدس"],
      ["zaidekudame","س"],["zekeriyyaishak","خ س"],["zekeriyyaebizaide","خ ع"],
      ["zuhayrmuaviye","—"],["rebiaebiabdrahman","سي"],["rebiuenes","—"],
      ["serieyyahya","س"],["sadsaidensari","بخ م"],["cureyri","م د ت س"],
      ["saidebiyyubmisri","م ت س ق"],["saidabdulaziz","ت"],["ibnebiaruba","خ ت س"],["ibnuyeyne","س"],["hasanamrfukaymi","بخ"],
     ].map(([a, r]) => E(a, "ibnmubarek", r, "Tehzîb 3520")),

  // ---- Ibnu'l-Mubarek'in talebeleri, Tehzib 3520 (s. 16/12-14) ----
  ...[["abdan","خ م د ت س"],["ibnebiseybe","م د ق"],["osmanebiseybe","د ق"],
      ["ibnvehb","—"],["ibnmehdi","خ د"],["abdurrezzak","ت"],
      ["affanmuslim","—"],["alihasansakik","ع"],["alihucr","م"],
      ["kuteybesaid","—"],["suveydnasr","ت س"],["ibnmain","—"],
      ["yahyaadem","—"],["ebulahvess","—"],
     ].map(([b, r]) => E("ibnmubarek", b, r, "Tehzîb 3520")),

  // ---- Yahya b. Said el-Kattan, Tehzib 6834 (s. 31/329-330) ----
  ...[["ismailebihalid","خ م"],["usamezeydleysi","س"],["esaseabdulmelik","س"],
      ["behzhakim","د ت س"],["sevryezid","بخ ٤"],["caferisadik","د س"],
      ["hasanisad","س"],["hatimebisagire","خ م س"],["haccacsavvaf","م د س ق"],
      ["hasanzekvan","خ د ت ق"],["huseynmuallim","خ م د س"],["hammadseleme","م"],
      ["humeydtavil","خ م د س"],["hanzalasufyan","—"],["halidhazza","—"],
      ["husaymirak","خ س"],["davudkaysferra","س"],["zekeriyyaebizaide","د س"],
      ["sadibrahim","—"],["selimhayyan","خ د"],["amess","—"],
      ["suleymanteymi","خ م س"],["seyfsuleymanmekki","خ س"],
     ].map(([a, r]) => E(a, "kattan", r, "Tehzîb 6834")),

  // ---- Yahya el-Kattan'in talebeleri, Tehzib 6834 (s. 31/333-334) ----
  ...[["ibnmehdi","—"],["ahmedhanbel","—"],["alimedini","خ د"],
      ["ibnmain","د"],["ibnebiseybe","خ م ق"],["kavariri","م د"],
      ["ubeydullahmuazanberi","د"],["affanmuslim","—"],["misned","خ د"],
      ["bundar","ع"],["ibnmusenna","خ م س ق"],["amrbnalisayrafi","خ م ت س"],
      ["abbasanberi","تم ق"],["yakubdevraki","م س"],["nasralicehdami","د"],
      ["mutemirsuleyman","—"],["sube","—"],
     ].map(([b, r]) => E("kattan", b, r, "Tehzîb 6834")),

  // ---- Abdurrahman b. Mehdi, Tehzib (s. 17/431-432) ----
  ...[["ebansattar","س"],["ibrahimsad","—"],["israilyunus","تم س"],
      ["cerirhazim","م س ق"],["harbseddad","خ ت س"],["hammadzeyd","مق ت"],
      ["davudkaysferra","س ق"],["zaidekudame","—"],["zuhayrmuaviye","—"],
      ["selimhayyan","م ق"],["sallamebimuti","خ س"],["serikkadi","—"],["mesudi","—"],
      ["macisun","م س"],["darevardi","س"],["abdulvahidziyad","—"],
      ["ikrimeammar","م د س"],["omerzerr","—"],["malikmigvel","م"],["muaviyesalih","م ٤"],
     ].map(([a, r]) => E(a, "ibnmehdi", r, "Tehzîb, bâbü'l-ayn")),

  // ---- Ibn Mehdi'nin talebeleri, Tehzib (s. 17/434-435) ----
  ...[["ahmedhanbel","—"],["alimedini","خ فق"],["ibnmain","—"],
      ["kavariri","م د"],["osmanebiseybe","ق"],["ibnvehb","س"],
      ["amrbnalisayrafi","خ م س"],["bundar","ع"],["ibnmusenna","خ م ت س ق"],
      ["muhammedabdulalasanani","ت"],["zuhli","ق"],["mucahidmusa","د س ق"],
      ["nasralicehdami","—"],["yahyayahyanisaburi","م"],["yakubdevraki","د س"],
      ["ebuasimnebil","—"],
     ].map(([b, r]) => E("ibnmehdi", b, r, "Tehzîb, bâbü'l-ayn")),

  // ---- Yahya b. Adem, Tehzib (s. 31/190-191) ----
  ...[["ibnidris","مق س"],["abdusselamharb","—"],
      ["fudaylibnayaz","—"],["kaysrebi","—"],["fitrhalife","سي"],
      ["malikmigvel","—"],["misersukdam","م س"],["muhammedfudayl","—"],
      ["huseym","—"],["varkaomer","خ"],["ebuavane","—"],["ibnebizaide","خ م س"],["ebubekirayyas","خ"],["ebumuaviyedarir","—"],
     ].map(([a, r]) => E(a, "yahyaadem", r, "Tehzîb, bâbü'l-yâ")),
  ...[["ahmedhanbel","د"],["ibnrahuye","خ م د س"],["ibnebiseybe","م"],
      ["osmanebiseybe","د"],["alimedini","—"],["ibnmain","—"],
      ["abdhumeyd","م"],["ebukureyb","م د ت"],["muhammedrafi","م س"],
      ["mahmudgaylan","ت س"],
     ].map(([b, r]) => E("yahyaadem", b, r, "Tehzîb, bâbü'l-yâ")),

  // ---- Yahya b. Zekeriyya Ibn Ebi Zaide, Tehzib 6826 (s. 31/305-307) ----
  ...[["israilyunus","م"],["ismailebihalid","—"],["haccacertat","م س"],
      ["hasanamrfukaymi","فق"],["halidselememahzumi","٤"],["davudebihind","م س"],
      ["zekeriyyaebizaide","ع"],["ibnuyeyne","د س"],["amess","م س ق"],["salihhayy","د س ق"],["asimahvel","خ م ت س"],
      ["abdullahavn","م"],["abdulazizomer","د"],["abdulmelikhumeyd","م"],
      ["abdulmelikebisuleyman","م س"],["ibncureyc","م"],["ubeydullahomeri","م د ت س"],
      ["ikrimeammar","د س"],["amrmeymunmihran","م"],["leysebisuleym","—"],["mucalidsaid","د"],["ibnishak","د"],
      ["misersukdam","م د ق"],["musacuheni","م س"],["nafiomercumahi","س"],
      ["hasimhasim","خ ق"],["hisamurve","م ق"],["varkaomer","خد"],
      ["yahyasaidensari","م س ق"],["ebumalikesceyi","م ق"],
     ].map(([a, r]) => E(a, "ibnebizaide", r, "Tehzîb 6826")),
  ...[["ibrahimmusaferra","خ م د"],["ahmedhanbel","م"],["ahmedmeni","د ت س"],
      ["hasanarafe","—"],["sericyunus","م"],["ibnebiseybe","م"],
      ["osmanebiseybe","م د"],["kavariri","س"],["alimedini","خ"],
      ["kuteybesaid","—"],["ebukureyb","م د ت"],["muhammedubeydmuharibi","ت س"],
      ["muhammedisataba","—"],["harunmaruf","م د"],["hennadseri","م ت س"],["ibnmain","س"],["yahyayahyanisaburi","م"],
      ["yakubdevraki","م س"],
     ].map(([b, r]) => E("ibnebizaide", b, r, "Tehzîb 6826")),

  // ---- Buhari, Tehzib 5060 (s. 24/431) ----
  ...[["ahmedhanbel","—"],["ahmedsalihmisri","—"],["ibnrahuye","—"],
      ["ibnebiuveys","—"],["ibrahimmusaferra","—"],["ibrahimmunzirhizami","—"],
      ["ademebiiyas","—"],["alimedini","—"],["ibnmain","—"],
      ["kanebi","—"],["kuteybesaid","—"],["misned","—"],
      ["bundar","—"],["ibnmusenna","—"],["amrbnalisayrafi","—"],
      ["ebunuaymfadl","—"],["ebuasimnebil","—"],["affanmuslim","—"],
      ["muslimibrahim","—"],["musaismailtebuzeki","—"],["hisamtayalisi","—"],
      ["haccacminhal","—"],["alicad","—"],["saidsuleymansadeviye","—"],
      ["ibnebiseybe","—"],["muhammedisataba","—"],["zuhli","—"],
      ["mahmudgaylan","—"],["ibnebiomeradeni","—"],
     ].map(([a, r]) => E(a, "buhari", r, "Tehzîb 5060")),
  E("buhari", "tirmizi", "—", "Tehzîb 5060"),
  E("buhari", "ebuzuraraazi", "—", "Tehzîb 5060"),
  E("buhari", "ebuhatimrazi", "—", "Tehzîb 5060"),
  E("buhari", "muslim", "—", "Tehzîb 5060"),

  // ---- Muslim, Tehzib 6245 (s. 27/500-501) ----
  ...[["ahmedhanbel","—"],["ahmeddevraki","—"],["ahmedmeni","—"],
      ["ibrahimmusaferra","—"],["ibnrahuye","—"],["ishakkevsec","—"],
      ["ibnebiuveys","—"],["zuheyrharb","—"],["said_mansur","—"],
      ["sericyunus","—"],["seybanferruh","—"],["halefhisam","—"],
      ["kanebi","—"],["abbasanberi","—"],["abdhumeyd","—"],
      ["darimi","—"],["harmalayahya","—"],["hasanaliayyal","—"],
      ["suveydsaidhadesani","—"],["ibnebiseybe","—"],["osmanebiseybe","—"],
      ["kavariri","—"],["ebukureyb","—"],["muhammedrafi","—"],
      ["yahyayahyanisaburi","—"],["kuteybesaid","—"],["bundar","—"],
      ["ibnmusenna","—"],["hennadseri","—"],["harunmaruf","—"],
      ["nasralicehdami","—"],["yakubdevraki","—"],["ubeydullahmuazanberi","—"],
     ].map(([a, r]) => E(a, "muslim", r, "Tehzîb 6245")),

  // ---- Diger dort muellif: agdaki hocalarindan secme ----
  ...[["ahmedhanbel","—"],["ibnebiseybe","—"],["osmanebiseybe","—"],
      ["misned","—"],["zuheyrharb","—"],["kanebi","—"],
      ["said_mansur","—"],["ahmeddevraki","—"],["muslimibrahim","—"],
      ["musaismailtebuzeki","—"],["hisamtayalisi","—"],["kuteybesaid","—"],
      ["ahmedsalihmisri","—"],["halefhisam","—"],["yahyaadem","—"],
     ].map(([a, r]) => E(a, "ebudavud", r, "Tehzîb, şuyûh listesi")),
  ...[["bundar","—"],["ibnmusenna","—"],["kuteybesaid","—"],
      ["hennadseri","—"],["mahmudgaylan","—"],["ebukureyb","—"],
      ["ibnebiomeradeni","—"],["muhammedubeydmuharibi","—"],["ahmedmeni","—"],
      ["alihucr","—"],["muhammedabdulalasanani","—"],
     ].map(([a, r]) => E(a, "tirmizi", r, "Tehzîb, şuyûh listesi")),
  ...[["kuteybesaid","—"],["ishakkevsec","—"],["ibnrahuye","—"],
      ["amrbnalisayrafi","—"],["muhammedrafi","—"],["muhammedabdulalasanani","—"],
      ["abbasanberi","—"],["harmalayahya","—"],["ahmedsalihmisri","—"],
      ["yakubdevraki","—"],["nasralicehdami","—"],["hasanarafe","—"],
     ].map(([a, r]) => E(a, "nesai", r, "Tehzîb, şuyûh listesi")),
  ...[["ibnebiseybe","—"],["osmanebiseybe","—"],["hennadseri","—"],
      ["suveydsaidhadesani","—"],["ebukureyb","—"],["muhammedubeydmuharibi","—"],
      ["ibnebiomeradeni","—"],["amrnakid","—"],["ibrahimmusaferra","—"],
      ["hasanarafe","—"],["zuhli","—"],
     ].map(([a, r]) => E(a, "ibnmace", r, "Tehzîb, şuyûh listesi")),

  // ---- Darimi ve Razi'ler ----
  ...[["ibnrahuye","—"],["ahmedhanbel","—"],["yahyaadem","—"],
      ["ebunuaymfadl","—"],["ebuasimnebil","—"],["ibnmain","—"],
     ].map(([a, r]) => E(a, "darimi", r, "Tehzîb, şuyûh listesi")),

  /* İsmâîl İbn Uleyye (o. 193) -- talebeleri.
     Tehzîb terceme 478, 3/24-27. Tercemede 82 kayit var, agda dugumu olan 31'i cizildi. */
  E("ibnuleyye", "ibrahimtahman", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ahmeddevraki", "ت", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ahmedhanbel", "م د س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ahmedmeni", "م ت س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnrahuye", "م س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "bakiyyevelid", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "hasanarafe", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "hammadzeyd", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "zuheyrharb", "م", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "sericyunus", "س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "sube", "ت س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnebiseybe", "م د ق", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnvehb", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnmehdi", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibncureyc", "س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "osmanebiseybe", "د ق", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "affanmuslim", "مق", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "alihucr", "خ م ت س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "alimedini", "خ", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "amrnakid", "م", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "kuteybesaid", "خ", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "mucahidmusa", "س", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "bundar", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ebukureyb", "م", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "muhammedisataba", "د", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnmusenna", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "misned", "خ د", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "nasralicehdami", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "ibnmain", "—", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "yahyayahyanisaburi", "م", "Tehzîb terceme 478, 3/24-27"),
  E("ibnuleyye", "yakubdevraki", "ع", "Tehzîb terceme 478, 3/24-27"),


  /* Abdürrezzâk b. Hemmâm (o. 211) -- talebeleri.
     Tehzîb terceme 3899, 18/54-56. Tercemede 82 kayit var, agda dugumu olan 20'i cizildi. */
  E("abdurrezzak", "ahmedsalihmisri", "د", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ahmedhanbel", "م د", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ibnrahuye", "خ م س", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ishakkevsec", "خ م ت س ق", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "bisrsari", "س", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "hasanaliayyal", "م د ت ق", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ebuusamehammad", "—", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "zuheyrharb", "—", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ibnuyeyne", "—", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "abbasanberi", "٤", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "abdulmelikhumeyd", "م ت", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "alimedini", "خ", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "amrnakid", "م", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "muhammedrafi", "م د ت س", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "muhammedabdulalasanani", "ت س ق", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ibnebiomeradeni", "م", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "zuhli", "خ د ت سي ق", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "mahmudgaylan", "خ م ت", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "mutemirsuleyman", "—", "Tehzîb terceme 3899, 18/54-56"),
  E("abdurrezzak", "ibnmain", "د", "Tehzîb terceme 3899, 18/54-56"),


  /* Abdürrezzâk b. Hemmâm (o. 211) -- hocalari.
     Tehzîb terceme 3899, 18/52-53. Tercemede 62 kayit var, agda dugumu olan 18'i cizildi. */
  E("israilyunus", "abdurrezzak", "ت", "Tehzîb terceme 3899, 18/52-53"),
  E("ismailayyas", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("haccacertat", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("davudkaysferra", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("zekeriyyaishak", "abdurrezzak", "م د", "Tehzîb terceme 3899, 18/52-53"),
  E("saidabdulaziz", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("sevri", "abdurrezzak", "خ م ت ق", "Tehzîb terceme 3899, 18/52-53"),
  E("ibnmubarek", "abdurrezzak", "ت", "Tehzîb terceme 3899, 18/52-53"),
  E("abdulmelikebisuleyman", "abdurrezzak", "م د", "Tehzîb terceme 3899, 18/52-53"),
  E("ibncureyc", "abdurrezzak", "ع", "Tehzîb terceme 3899, 18/52-53"),
  E("ubeydullahomeri", "abdurrezzak", "خت م ٤", "Tehzîb terceme 3899, 18/52-53"),
  E("ikrimeammar", "abdurrezzak", "د", "Tehzîb terceme 3899, 18/52-53"),
  E("fudaylibnayaz", "abdurrezzak", "س", "Tehzîb terceme 3899, 18/52-53"),
  E("kaysrebi", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("malik", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("mamer", "abdurrezzak", "ع", "Tehzîb terceme 3899, 18/52-53"),
  E("hisamhassan", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),
  E("huseym", "abdurrezzak", "—", "Tehzîb terceme 3899, 18/52-53"),


  /* Leys b. Sa‘d (o. 175) -- hocalari.
     Tehzîb 5016. Tercemede 80 kayit var, agda dugumu olan 19'i cizildi. */
  E("ibrahimebiable", "leysbsad", "عخ س", "Tehzîb 5016"),
  E("rebiaebiabdrahman", "leysbsad", "س", "Tehzîb 5016"),
  E("suaybishakdimaski", "leysbsad", "س", "Tehzîb 5016"),
  E("ibnebimuleyke", "leysbsad", "ع", "Tehzîb 5016"),
  E("ubeydullahomeri2", "leysbsad", "م ت س ق", "Tehzîb 5016"),
  E("macisun", "leysbsad", "خ", "Tehzîb 5016"),
  E("ibncureyc", "leysbsad", "م", "Tehzîb 5016"),
  E("ubeydullahomeri", "leysbsad", "ت س ق", "Tehzîb 5016"),
  E("ataebirebah", "leysbsad", "م ٤", "Tehzîb 5016"),
  E("amrharis", "leysbsad", "—", "Tehzîb 5016"),
  E("muhammedacilan", "leysbsad", "بخ م د ت س", "Tehzîb 5016"),
  E("ibnsihab", "leysbsad", "ع", "Tehzîb 5016"),
  E("muaviyesalih", "leysbsad", "بخ م د ت س", "Tehzîb 5016"),
  E("nafiibnomer", "leysbsad", "ع", "Tehzîb 5016"),
  E("hisamurve", "leysbsad", "خ م س", "Tehzîb 5016"),
  E("yahyasaidensari", "leysbsad", "خ م ت س", "Tehzîb 5016"),
  E("yezidebihabib", "leysbsad", "ع", "Tehzîb 5016"),
  E("yezidhad", "leysbsad", "—", "Tehzîb 5016"),


  /* Leys b. Sa‘d (o. 175) -- talebeleri.
     Tehzîb 5016. Tercemede 70 kayit var, agda dugumu olan 13'i cizildi. */
  E("leysbsad", "ademebiiyas", "خ س", "Tehzîb 5016"),
  E("leysbsad", "bisrsari", "ص", "Tehzîb 5016"),
  E("leysbsad", "haccacmuhammed", "س", "Tehzîb 5016"),
  E("leysbsad", "saidsuleymansadeviye", "خ", "Tehzîb 5016"),
  E("leysbsad", "ibnmubarek", "خ", "Tehzîb 5016"),
  E("leysbsad", "kanebi", "د", "Tehzîb 5016"),
  E("leysbsad", "ibnvehb", "م د س ق", "Tehzîb 5016"),
  E("leysbsad", "kuteybesaid", "خ م د ت س", "Tehzîb 5016"),
  E("leysbsad", "kaysrebi", "—", "Tehzîb 5016"),
  E("leysbsad", "hisamtayalisi", "خ م ت", "Tehzîb 5016"),
  E("leysbsad", "velidmuslim", "—", "Tehzîb 5016"),
  E("leysbsad", "yahyayahyanisaburi", "م س", "Tehzîb 5016"),


  /* Hasan-ı Basrî (o. 110) -- hocalari.
     Tehzîb 1216. Tercemede 63 kayit var, agda dugumu olan 20'i cizildi. */
  E("ubey", "hasanbasri", "ع", "Tehzîb 1216"),
  E("ahnef", "hasanbasri", "خ م ق", "Tehzîb 1216"),
  E("usame", "hasanbasri", "س", "Tehzîb 1216"),
  E("cabir", "hasanbasri", "ع", "Tehzîb 1216"),
  E("hamranaban", "hasanbasri", "ت", "Tehzîb 1216"),
  E("sadhisam", "hasanbasri", "م د س", "Tehzîb 1216"),
  E("aizamr", "hasanbasri", "م", "Tehzîb 1216"),
  E("abdullahamr", "hasanbasri", "س", "Tehzîb 1216"),
  E("ebumusa", "hasanbasri", "س ق", "Tehzîb 1216"),
  E("ukbeamir", "hasanbasri", "د س ق", "Tehzîb 1216"),
  E("imranhusayn", "hasanbasri", "د ت س", "Tehzîb 1216"),
  E("mugirasube", "hasanbasri", "د", "Tehzîb 1216"),
  E("numanbesir", "hasanbasri", "س", "Tehzîb 1216"),


  /* Hasan-ı Basrî (o. 110) -- talebeleri.
     Tehzîb 1216. Tercemede 143 kayit var, agda dugumu olan 24'i cizildi. */
  E("hasanbasri", "ebansattar", "—", "Tehzîb 1216"),
  E("hasanbasri", "esaseabdulmelik", "خت ع", "Tehzîb 1216"),
  E("hasanbasri", "eyyubsahtiyani", "خ م س", "Tehzîb 1216"),
  E("hasanbasri", "bekirmuzeni", "م د ت س", "Tehzîb 1216"),
  E("hasanbasri", "cerirhazim", "خ م", "Tehzîb 1216"),
  E("hasanbasri", "hasanzekvan", "—", "Tehzîb 1216"),
  E("hasanbasri", "humeydtavil", "م د", "Tehzîb 1216"),
  E("hasanbasri", "halidhazza", "م", "Tehzîb 1216"),
  E("hasanbasri", "davudebihind", "م", "Tehzîb 1216"),
  E("hasanbasri", "serieyyahya", "بخ س", "Tehzîb 1216"),
  E("hasanbasri", "sadibrahim", "ق", "Tehzîb 1216"),
  E("hasanbasri", "cureyri", "ق", "Tehzîb 1216"),
  E("hasanbasri", "suleymanteymi", "م", "Tehzîb 1216"),
  E("hasanbasri", "simakharb", "خت", "Tehzîb 1216"),
  E("hasanbasri", "seybannahvi", "م", "Tehzîb 1216"),
  E("hasanbasri", "abdullahavn", "خ م ق", "Tehzîb 1216"),
  E("hasanbasri", "ataisaib", "س", "Tehzîb 1216"),
  E("hasanbasri", "alizeydcudan", "ت س", "Tehzîb 1216"),
  E("hasanbasri", "avfarabi", "خ ت س ق", "Tehzîb 1216"),
  E("hasanbasri", "matarverrak", "مس", "Tehzîb 1216"),
  E("hasanbasri", "mansurzazan", "بخ م ع", "Tehzîb 1216"),
  E("hasanbasri", "mansurmutemir", "س", "Tehzîb 1216"),
  E("hasanbasri", "hisamhassan", "ع", "Tehzîb 1216"),


  /* Dahhâk b. Müzâhim (o. 105) -- hocalari.
     Tehzîb 2928. Tercemede 13 kayit var, agda dugumu olan 9'i cizildi. */
  E("esvedyezid", "dahhak", "ق", "Tehzîb 2928"),
  E("enes", "dahhak", "ق", "Tehzîb 2928"),
  E("zeydarkam", "dahhak", "—", "Tehzîb 2928"),
  E("ebusaid", "dahhak", "—", "Tehzîb 2928"),
  E("saidcubeyr", "dahhak", "—", "Tehzîb 2928"),
  E("tavus", "dahhak", "—", "Tehzîb 2928"),
  E("ibnomer", "dahhak", "—", "Tehzîb 2928"),
  E("ataebirebah", "dahhak", "—", "Tehzîb 2928"),
  E("ebuhureyre", "dahhak", "—", "Tehzîb 2928"),


  /* Dahhâk b. Müzâhim (o. 105) -- talebeleri.
     Tehzîb 2928. Tercemede 43 kayit var, agda dugumu olan 2'i cizildi. */
  E("dahhak", "ismailebihalid", "—", "Tehzîb 2928"),
  E("dahhak", "ebuishaksebii", "—", "Tehzîb 2928"),


  /* Vehb b. Münebbih (o. 114) -- hocalari.
     Tehzîb 6767. Tercemede 14 kayit var, agda dugumu olan 10'i cizildi. */
  E("enes", "vehbmunebbih", "—", "Tehzîb 6767"),
  E("tavus", "vehbmunebbih", "—", "Tehzîb 6767"),
  E("ibnabbas", "vehbmunebbih", "د ت س", "Tehzîb 6767"),
  E("ibnomer", "vehbmunebbih", "—", "Tehzîb 6767"),
  E("abdullahamr", "vehbmunebbih", "د ت س", "Tehzîb 6767"),
  E("amrsuayb", "vehbmunebbih", "س", "Tehzîb 6767"),
  E("numanbesir", "vehbmunebbih", "—", "Tehzîb 6767"),
  E("hemmammunebbih", "vehbmunebbih", "خ م د ت س", "Tehzîb 6767"),
  E("ebusaid", "vehbmunebbih", "—", "Tehzîb 6767"),
  E("ebuhureyre", "vehbmunebbih", "—", "Tehzîb 6767"),


  /* Vehb b. Münebbih (o. 114) -- talebeleri.
     Tehzîb 6767. Tercemede 26 kayit var, agda dugumu olan 2'i cizildi. */
  E("vehbmunebbih", "ibnhuseymkhaysem", "—", "Tehzîb 6767"),
  E("vehbmunebbih", "avfarabi", "—", "Tehzîb 6767"),


  /* İbrâhim en-Nehaî (o. 96) -- hocalari.
     Tehzîb, İbrâhim en-Nehaî 2/233-238. Tercemede 27 kayit var, agda dugumu olan 10'i cizildi. */
  E("esvedyezid", "nehai", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("hayseme", "nehai", "ش", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("suveydgafle", "nehai", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("sureyh", "nehai", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("abisrebia", "nehai", "خ م د ت س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("abdrahmanyezidnehai", "nehai", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("ubeydesel", "nehai", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("alkame", "nehai", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("mesruk", "nehai", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("ebuabdrahmansulemi", "nehai", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),


  /* İbrâhim en-Nehaî (o. 96) -- talebeleri.
     Tehzîb, İbrâhim en-Nehaî 2/233-238. Tercemede 36 kayit var, agda dugumu olan 14'i cizildi. */
  E("nehai", "hasanubeydullah", "م د س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "hakemuteybe", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "hammadebisuleyman", "بخ م د س ق", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "zubeydyami", "خ ت س ق", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "zubeyradi", "د س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "simakharb", "م د ت س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "abdullahsubrume", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "abdullahavn", "خ م تم س ق", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "ebuhasin", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "ataisaib", "س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "ebuishaksebii", "—", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "muhammedsuka", "ت ق", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "mugirmiksem", "خ م س", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),
  E("nehai", "mansurmutemir", "ع", "Tehzîb, İbrâhim en-Nehaî 2/233-238"),


  /* İbrâhim b. Sa‘d ez-Zührî (o. 183) -- hocalari.
     Tehzîb 174. Tercemede 20 kayit var, agda dugumu olan 7'i cizildi. */
  E("sadibrahim", "ibrahimsad", "ع", "Tehzîb 174"),
  E("sube", "ibrahimsad", "—", "Tehzîb 174"),
  E("salihkeysan", "ibrahimsad", "خ م د ت س", "Tehzîb 174"),
  E("ibnishak", "ibrahimsad", "خت م د س", "Tehzîb 174"),
  E("hisamurve", "ibrahimsad", "—", "Tehzîb 174"),
  E("velidkesir", "ibrahimsad", "خ م د س", "Tehzîb 174"),
  E("yezidhad", "ibrahimsad", "م س", "Tehzîb 174"),


  /* İbrâhim b. Sa‘d ez-Zührî (o. 183) -- talebeleri.
     Tehzîb 174. Tercemede 64 kayit var, agda dugumu olan 15'i cizildi. */
  E("ibrahimsad", "ahmedhanbel", "—", "Tehzîb 174"),
  E("ibrahimsad", "ebudavudtayalisi", "م", "Tehzîb 174"),
  E("ibrahimsad", "abdullahavn", "—", "Tehzîb 174"),
  E("ibrahimsad", "kanebi", "خ م", "Tehzîb 174"),
  E("ibrahimsad", "ibnvehb", "م", "Tehzîb 174"),
  E("ibrahimsad", "abdussamed", "م", "Tehzîb 174"),
  E("ibrahimsad", "alicad", "—", "Tehzîb 174"),
  E("ibrahimsad", "kaysrebi", "—", "Tehzîb 174"),
  E("ibrahimsad", "leysbsad", "—", "Tehzîb 174"),
  E("ibrahimsad", "muhammedisataba", "د", "Tehzîb 174"),
  E("ibrahimsad", "musaismailtebuzeki", "خ د", "Tehzîb 174"),
  E("ibrahimsad", "hisamtayalisi", "خ", "Tehzîb 174"),
  E("ibrahimsad", "yahyaadem", "م", "Tehzîb 174"),
  E("ibrahimsad", "yahyayahyanisaburi", "م", "Tehzîb 174"),
  E("ibrahimsad", "yezidharun", "م", "Tehzîb 174"),


  /* İbrâhim b. Sa‘d ez-Zührî (o. 183) -- talebeleri.
     Tehzîb 174. Tercemede 64 kayit var, agda dugumu olan 1'i cizildi. */
  E("ibrahimsad", "veki", "—", "Tehzîb 174"),


  /* Leys b. Sa‘d (o. 175) -- hocalari.
     Tehzîb 5016. Tercemede 80 kayit var, agda dugumu olan 1'i cizildi. */
  E("ebuzubeyrmekki", "leysbsad", "م ٤", "Tehzîb 5016"),


  /* Alkame b. Kays en-Nehaî (o. 62) -- hocalari.
     Tehzîb, Alkame b. Kays 20/300-303. Tercemede 20 kayit var, agda dugumu olan 7'i cizildi. */
  E("huzeyfe", "alkame", "—", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("halidvelid", "alkame", "س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("sadvakkas", "alkame", "د س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("ibnmesud", "alkame", "ع", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("omer", "alkame", "ت س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("ebubekir", "alkame", "—", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("ebumusa", "alkame", "—", "Tehzîb, Alkame b. Kays 20/300-303"),


  /* Alkame b. Kays en-Nehaî (o. 62) -- talebeleri.
     Tehzîb, Alkame b. Kays 20/300-303. Tercemede 28 kayit var, agda dugumu olan 10'i cizildi. */
  E("alkame", "ebuzabyan", "—", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "selemekuheyl", "س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "ebuvail", "م", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "sabi", "م د ت س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "abdrahmanyezidnehai", "د ت س", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "ebuishaksebii", "س ق", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "kasimmuhaymire", "د", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "ibnsirin", "—", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "ebuduha", "—", "Tehzîb, Alkame b. Kays 20/300-303"),
  E("alkame", "yahyavessab", "—", "Tehzîb, Alkame b. Kays 20/300-303"),


  /* Mesrûk b. el-Ecda‘ (o. 63) -- hocalari.
     Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454. Tercemede 18 kayit var, agda dugumu olan 12'i cizildi. */
  E("ubey", "mesruk", "س", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("zeydsabit", "mesruk", "—", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("ibnomer", "mesruk", "س", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("abdullahamr", "mesruk", "ع", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("ibnmesud", "mesruk", "ع", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("ubeydumeyr", "mesruk", "—", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("osman", "mesruk", "—", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("ali", "mesruk", "س", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("omer", "mesruk", "د ق", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("muazcebel", "mesruk", "٤", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mugirasube", "mesruk", "خ م س ق", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("ebubekir", "mesruk", "—", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),


  /* Mesrûk b. el-Ecda‘ (o. 63) -- talebeleri.
     Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454. Tercemede 21 kayit var, agda dugumu olan 6'i cizildi. */
  E("mesruk", "enessirin", "—", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mesruk", "ebuvail", "ع", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mesruk", "sabi", "ع", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mesruk", "ebuduha", "ع", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mesruk", "mekhul", "س", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),
  E("mesruk", "yahyavessab", "خ م ت س ق", "Tehzîb, Mesrûk b. el-Ecda‘ 27/451-454"),


  /* Hemmâm b. Münebbih (o. 132) -- hocalari.
     Tehzîb 6600. Tercemede 5 kayit var, agda dugumu olan 3'i cizildi. */
  E("ibnzubeyr", "hemmammunebbih", "—", "Tehzîb 6600"),
  E("ibnabbas", "hemmammunebbih", "—", "Tehzîb 6600"),
  E("ibnomer", "hemmammunebbih", "—", "Tehzîb 6600"),


  /* Abdurrahman b. Hürmüz el-A‘rec (o. 117) -- hocalari.
     Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470. Tercemede 28 kayit var, agda dugumu olan 10'i cizildi. */
  E("humeydavf", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("saibyezid", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("suleymanyesar", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("ibnabbas", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("abdullahkab", "arac", "خ م س", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("ubeydullaherafi", "arac", "م ٤", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("zeynelabidin", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("mervan", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("ebusaid", "arac", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("ebuselemeavf", "arac", "خ م س", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),


  /* Abdurrahman b. Hürmüz el-A‘rec (o. 117) -- talebeleri.
     Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470. Tercemede 42 kayit var, agda dugumu olan 14'i cizildi. */
  E("arac", "eyyubsahtiyani", "م", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "davudhusayn", "س", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "rebiaebiabdrahman", "سي", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "zeydeslem", "خ م ت س ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "sadibrahim", "خ م س ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "amess", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "salihkeysan", "خ م ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "ibnishak", "ر", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "muhammedacilan", "سي ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "muhammedamralkame", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "ebuzubeyrmekki", "س", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "musaukbe", "ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "yahyasaidensari", "م ت ق", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),
  E("arac", "yahyaebikesir", "—", "Tehzîb, Abdurrahman b. Hürmüz el-A‘rec 17/467-470"),


  /* Muhammed b. Sîrîn (o. 110) -- hocalari.
     Tehzîb 5280. Tercemede 55 kayit var, agda dugumu olan 21'i cizildi. */
  E("enes", "ibnsirin", "ع", "Tehzîb 5280"),
  E("huzeyfe", "ibnsirin", "د ق", "Tehzîb 5280"),
  E("hasanbali", "ibnsirin", "س", "Tehzîb 5280"),
  E("halidhazza", "ibnsirin", "د ت س", "Tehzîb 5280"),
  E("rafihadic", "ibnsirin", "س", "Tehzîb 5280"),
  E("zeydsabit", "ibnsirin", "—", "Tehzîb 5280"),
  E("sureyh", "ibnsirin", "—", "Tehzîb 5280"),
  E("ibnzubeyr", "ibnsirin", "—", "Tehzîb 5280"),
  E("abdullahsakik", "ibnsirin", "م د ت س", "Tehzîb 5280"),
  E("ibnabbas", "ibnsirin", "خ ت س", "Tehzîb 5280"),
  E("ibnomer", "ibnsirin", "م س ق", "Tehzîb 5280"),
  E("ibnebileyla", "ibnsirin", "—", "Tehzîb 5280"),
  E("ubeydesel", "ibnsirin", "ع", "Tehzîb 5280"),
  E("ikrime", "ibnsirin", "—", "Tehzîb 5280"),
  E("imranhusayn", "ibnsirin", "م", "Tehzîb 5280"),
  E("mabedsirin", "ibnsirin", "خ م د س", "Tehzîb 5280"),
  E("nafiibnomer", "ibnsirin", "ت ق", "Tehzîb 5280"),
  E("ebudderda", "ibnsirin", "س", "Tehzîb 5280"),
  E("ebulaliye", "ibnsirin", "س", "Tehzîb 5280"),
  E("ebuhureyre", "ibnsirin", "ع", "Tehzîb 5280"),
  E("aise", "ibnsirin", "د", "Tehzîb 5280"),


  /* Muhammed b. Sîrîn (o. 110) -- talebeleri.
     Tehzîb 5280. Tercemede 51 kayit var, agda dugumu olan 17'i cizildi. */
  E("ibnsirin", "esaseabdulmelik", "د ت س", "Tehzîb 5280"),
  E("ibnsirin", "eyyubsahtiyani", "ع", "Tehzîb 5280"),
  E("ibnsirin", "sabitbunani", "—", "Tehzîb 5280"),
  E("ibnsirin", "cerirhazim", "خ م", "Tehzîb 5280"),
  E("ibnsirin", "hasanzekvan", "صد", "Tehzîb 5280"),
  E("ibnsirin", "davudebihind", "م", "Tehzîb 5280"),
  E("ibnsirin", "serieyyahya", "—", "Tehzîb 5280"),
  E("ibnsirin", "suleymanteymi", "—", "Tehzîb 5280"),
  E("ibnsirin", "asimahvel", "خ م", "Tehzîb 5280"),
  E("ibnsirin", "sabi", "—", "Tehzîb 5280"),
  E("ibnsirin", "abdullahsubrume", "—", "Tehzîb 5280"),
  E("ibnsirin", "abdullahavn", "خ م د س ق", "Tehzîb 5280"),
  E("ibnsirin", "alizeydcudan", "—", "Tehzîb 5280"),
  E("ibnsirin", "avfarabi", "خ ٤", "Tehzîb 5280"),
  E("ibnsirin", "katade", "م د ت س", "Tehzîb 5280"),
  E("ibnsirin", "mansurzazan", "د ت س", "Tehzîb 5280"),
  E("ibnsirin", "hisamhassan", "ع", "Tehzîb 5280"),


  /* Kâsım b. Muhammed b. Ebî Bekir (o. 106) -- hocalari.
     Tehzîb 4819. Tercemede 20 kayit var, agda dugumu olan 9'i cizildi. */
  E("eslem", "kasimmuhammed", "س", "Tehzîb 4819"),
  E("rafihadic", "kasimmuhammed", "س", "Tehzîb 4819"),
  E("ibncafer", "kasimmuhammed", "د", "Tehzîb 4819"),
  E("ibnzubeyr", "kasimmuhammed", "—", "Tehzîb 4819"),
  E("ibnabbas", "kasimmuhammed", "خ م س ق", "Tehzîb 4819"),
  E("ibnomer", "kasimmuhammed", "خ م د س", "Tehzîb 4819"),
  E("abdullahamr", "kasimmuhammed", "س", "Tehzîb 4819"),
  E("ibnmesud", "kasimmuhammed", "س", "Tehzîb 4819"),
  E("ebuhureyre", "kasimmuhammed", "ت", "Tehzîb 4819"),


  /* Kâsım b. Muhammed b. Ebî Bekir (o. 106) -- talebeleri.
     Tehzîb 4819. Tercemede 62 kayit var, agda dugumu olan 23'i cizildi. */
  E("kasimmuhammed", "usamezeydeslem", "سي ق", "Tehzîb 4819"),
  E("kasimmuhammed", "usamezeydleysi", "سي ق", "Tehzîb 4819"),
  E("kasimmuhammed", "enessirin", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "eyyubsahtiyani", "م س", "Tehzîb 4819"),
  E("kasimmuhammed", "caferisadik", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "humeydtavil", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "hanzalasufyan", "خ م د س", "Tehzîb 4819"),
  E("kasimmuhammed", "rebiaebiabdrahman", "خ م س", "Tehzîb 4819"),
  E("kasimmuhammed", "salimibnomer", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "sadibrahim", "م د ق", "Tehzîb 4819"),
  E("kasimmuhammed", "sadsaidensari", "م", "Tehzîb 4819"),
  E("kasimmuhammed", "suleymanmusadimaski", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "salihkeysan", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "sabi", "—", "Tehzîb 4819"),
  E("kasimmuhammed", "ibnebimuleyke", "ع", "Tehzîb 4819"),
  E("kasimmuhammed", "abdullahavn", "خ م د س", "Tehzîb 4819"),
  E("kasimmuhammed", "ubeydullahomeri", "ع", "Tehzîb 4819"),
  E("kasimmuhammed", "ubeydullahmiksem", "ر", "Tehzîb 4819"),
  E("kasimmuhammed", "ikrimeammar", "ي", "Tehzîb 4819"),
  E("kasimmuhammed", "ibnsihab", "خ م د س", "Tehzîb 4819"),
  E("kasimmuhammed", "ibnmunkedir", "د س", "Tehzîb 4819"),
  E("kasimmuhammed", "nafiibnomer", "خ م س ق", "Tehzîb 4819"),
  E("kasimmuhammed", "yahyasaidensari", "خ س", "Tehzîb 4819"),


  /* Ubeydullah b. Abdillâh b. Utbe (o. 98) -- hocalari.
     Tehzîb 3653. Tercemede 24 kayit var, agda dugumu olan 8'i cizildi. */
  E("zeydhalid", "ubeydullahutbe", "ع", "Tehzîb 3653"),
  E("ibnomer", "ubeydullahutbe", "—", "Tehzîb 3653"),
  E("ibnmesud", "ubeydullahutbe", "م ق", "Tehzîb 3653"),
  E("urve", "ubeydullahutbe", "س", "Tehzîb 3653"),
  E("omer", "ubeydullahutbe", "س", "Tehzîb 3653"),
  E("numanbesir", "ubeydullahutbe", "م د س ق", "Tehzîb 3653"),
  E("ebusaid", "ubeydullahutbe", "ع", "Tehzîb 3653"),
  E("aise", "ubeydullahutbe", "ع", "Tehzîb 3653"),


  /* Ubeydullah b. Abdillâh b. Utbe (o. 98) -- talebeleri.
     Tehzîb 3653. Tercemede 17 kayit var, agda dugumu olan 4'i cizildi. */
  E("ubeydullahutbe", "salimebinadr", "ت س", "Tehzîb 3653"),
  E("ubeydullahutbe", "sadibrahim", "س", "Tehzîb 3653"),
  E("ubeydullahutbe", "salihkeysan", "خ م د س", "Tehzîb 3653"),
  E("ubeydullahutbe", "abdulmecidsuheyl", "م س", "Tehzîb 3653"),


  /* Muhammed b. İdrîs eş-Şâfiî (o. 204) -- hocalari.
     Tehzîb 5049. Tercemede 35 kayit var, agda dugumu olan 9'i cizildi. */
  E("ibrahimsad", "safii", "—", "Tehzîb 5049"),
  E("ibnuleyye", "safii", "—", "Tehzîb 5049"),
  E("enesiyaz", "safii", "—", "Tehzîb 5049"),
  E("ebuusamehammad", "safii", "—", "Tehzîb 5049"),
  E("davudattar", "safii", "—", "Tehzîb 5049"),
  E("macisun", "safii", "—", "Tehzîb 5049"),
  E("darevardi", "safii", "د", "Tehzîb 5049"),
  E("amrebiselemetennisi", "safii", "—", "Tehzîb 5049"),
  E("hisamyusufsanani", "safii", "—", "Tehzîb 5049"),


  /* Muhammed b. İdrîs eş-Şâfiî (o. 204) -- talebeleri.
     Tehzîb 5049. Tercemede 30 kayit var, agda dugumu olan 3'i cizildi. */
  E("safii", "ibrahimmunzirhizami", "—", "Tehzîb 5049"),
  E("safii", "ahmedhanbel", "—", "Tehzîb 5049"),
  E("safii", "harmalayahya", "ق", "Tehzîb 5049"),


  /* Muâz b. Cebel (o. 18) -- talebeleri.
     Tehzîb 6020. Tercemede 50 kayit var, agda dugumu olan 16'i cizildi. */
  E("muazcebel", "eslem", "ق", "Tehzîb 6020"),
  E("muazcebel", "esvedhilal", "خ م", "Tehzîb 6020"),
  E("muazcebel", "esvedyezid", "خ د", "Tehzîb 6020"),
  E("muazcebel", "enes", "خ م سي", "Tehzîb 6020"),
  E("muazcebel", "cabir", "—", "Tehzîb 6020"),
  E("muazcebel", "ebuvail", "٤", "Tehzîb 6020"),
  E("muazcebel", "tavus", "مد ق", "Tehzîb 6020"),
  E("muazcebel", "abdullahsedddad", "ق", "Tehzîb 6020"),
  E("muazcebel", "ibnabbas", "—", "Tehzîb 6020"),
  E("muazcebel", "ibnomer", "—", "Tehzîb 6020"),
  E("muazcebel", "abdullahamr", "—", "Tehzîb 6020"),
  E("muazcebel", "ibnebileyla", "٤", "Tehzîb 6020"),
  E("muazcebel", "amrmeymun", "خ م د ت س", "Tehzîb 6020"),
  E("muazcebel", "kayshazim", "ت", "Tehzîb 6020"),
  E("muazcebel", "ebuidrishavlani", "ق", "Tehzîb 6020"),
  E("muazcebel", "ebumusa", "خ د س", "Tehzîb 6020"),


  /* Ebü'd-Derdâ (o. 32) -- hocalari.
     Tehzîb 4558. Tercemede 2 kayit var, agda dugumu olan 2'i cizildi. */
  E("zeydsabit", "ebudderda", "—", "Tehzîb 4558"),
  E("aise", "ebudderda", "—", "Tehzîb 4558"),


  /* Ebü'd-Derdâ (o. 32) -- talebeleri.
     Tehzîb 4558. Tercemede 67 kayit var, agda dugumu olan 17'i cizildi. */
  E("ebudderda", "enes", "—", "Tehzîb 4558"),
  E("ebudderda", "hayseme", "—", "Tehzîb 4558"),
  E("ebudderda", "zeydvehb", "سي", "Tehzîb 4558"),
  E("ebudderda", "saidmusayyeb", "ت س", "Tehzîb 4558"),
  E("ebudderda", "suveydgafle", "س ق", "Tehzîb 4558"),
  E("ebudderda", "tavus", "—", "Tehzîb 4558"),
  E("ebudderda", "ibnabbas", "—", "Tehzîb 4558"),
  E("ebudderda", "ibnomer", "—", "Tehzîb 4558"),
  E("ebudderda", "ibnebileyla", "—", "Tehzîb 4558"),
  E("ebudderda", "ubeydumeyr", "—", "Tehzîb 4558"),
  E("ebudderda", "ataebirebah", "س", "Tehzîb 4558"),
  E("ebudderda", "alkame", "خ م ت س", "Tehzîb 4558"),
  E("ebudderda", "kayshazim", "—", "Tehzîb 4558"),
  E("ebudderda", "ebuidrishavlani", "خ م ت س ق", "Tehzîb 4558"),
  E("ebudderda", "ebuumame", "—", "Tehzîb 4558"),
  E("ebudderda", "ebuselemeavf", "ق", "Tehzîb 4558"),
  E("ebudderda", "ebuabdrahmansulemi", "ت ق", "Tehzîb 4558"),


  /* Hişâm ed-Destevâî (o. 153) -- hocalari.
     Tehzîb 6582. Tercemede 21 kayit var, agda dugumu olan 7'i cizildi. */
  E("eyyubsahtiyani", "hisamdestuvai", "ت ق", "Tehzîb 6582"),
  E("hammadebisuleyman", "hisamdestuvai", "بخ دعس", "Tehzîb 6582"),
  E("asimbehdele", "hisamdestuvai", "—", "Tehzîb 6582"),
  E("amiralhavl", "hisamdestuvai", "م ت س ق", "Tehzîb 6582"),
  E("kasimebibezze", "hisamdestuvai", "فق", "Tehzîb 6582"),
  E("matarverrak", "hisamdestuvai", "م د", "Tehzîb 6582"),
  E("ebuzubeyrmekki", "hisamdestuvai", "خت م دت س", "Tehzîb 6582"),


  /* Hişâm ed-Destevâî (o. 153) -- talebeleri.
     Tehzîb 6582. Tercemede 44 kayit var, agda dugumu olan 24'i cizildi. */
  E("hisamdestuvai", "ishakyusufezrak", "ت", "Tehzîb 6582"),
  E("hisamdestuvai", "ibnuleyye", "م", "Tehzîb 6582"),
  E("hisamdestuvai", "halidharis", "م س", "Tehzîb 6582"),
  E("hisamdestuvai", "serieyyahya", "سي", "Tehzîb 6582"),
  E("hisamdestuvai", "sube", "س", "Tehzîb 6582"),
  E("hisamdestuvai", "ibnmubarek", "س", "Tehzîb 6582"),
  E("hisamdestuvai", "abdulalaabdulala", "م", "Tehzîb 6582"),
  E("hisamdestuvai", "ibnmehdi", "م ت", "Tehzîb 6582"),
  E("hisamdestuvai", "abdussamed", "م ت س", "Tehzîb 6582"),
  E("hisamdestuvai", "abdulvarissaid", "س", "Tehzîb 6582"),
  E("hisamdestuvai", "affanmuslim", "—", "Tehzîb 6582"),
  E("hisamdestuvai", "isabyunus", "—", "Tehzîb 6582"),
  E("hisamdestuvai", "ebunuaymfadl", "خ", "Tehzîb 6582"),
  E("hisamdestuvai", "gunder", "—", "Tehzîb 6582"),
  E("hisamdestuvai", "muhammedebiadi", "م دت", "Tehzîb 6582"),
  E("hisamdestuvai", "muslimibrahim", "خ د", "Tehzîb 6582"),
  E("hisamdestuvai", "musaismailtebuzeki", "—", "Tehzîb 6582"),
  E("hisamdestuvai", "nadrsumeyl", "م", "Tehzîb 6582"),
  E("hisamdestuvai", "hisamtayalisi", "—", "Tehzîb 6582"),
  E("hisamdestuvai", "veki", "م س ق", "Tehzîb 6582"),
  E("hisamdestuvai", "kattan", "خ م د", "Tehzîb 6582"),
  E("hisamdestuvai", "yezidzurey", "م س ق", "Tehzîb 6582"),
  E("hisamdestuvai", "yezidharun", "م", "Tehzîb 6582"),
  E("hisamdestuvai", "ebudavudtayalisi", "م ت س", "Tehzîb 6582"),


  /* Şuayb b. Ebî Hamza (o. 162) -- hocalari.
     Tehzîb 2747. Tercemede 14 kayit var, agda dugumu olan 6'i cizildi. */
  E("zeydeslem", "suaybebihamza", "—", "Tehzîb 2747"),
  E("ikrimehalid", "suaybebihamza", "—", "Tehzîb 2747"),
  E("ibnmunkedir", "suaybebihamza", "خ ٤", "Tehzîb 2747"),
  E("muhammedvelidzubeydi", "suaybebihamza", "—", "Tehzîb 2747"),
  E("nafiibnomer", "suaybebihamza", "خ د", "Tehzîb 2747"),
  E("hisamurve", "suaybebihamza", "س", "Tehzîb 2747"),


  /* Şuayb b. Ebî Hamza (o. 162) -- talebeleri.
     Tehzîb 2747. Tercemede 14 kayit var, agda dugumu olan 3'i cizildi. */
  E("suaybebihamza", "ibrahimfezari", "س", "Tehzîb 2747"),
  E("suaybebihamza", "bakiyyevelid", "د س", "Tehzîb 2747"),
  E("suaybebihamza", "velidmuslim", "د ت", "Tehzîb 2747"),


  /* Amr b. Şuayb (o. 118) -- hocalari.
     Tehzîb 4385. Tercemede 21 kayit var, agda dugumu olan 7'i cizildi. */
  E("saidmusayyeb", "amrsuayb", "—", "Tehzîb 4385"),
  E("suleymanyesar", "amrsuayb", "د س", "Tehzîb 4385"),
  E("tavus", "amrsuayb", "٤", "Tehzîb 4385"),
  E("urve", "amrsuayb", "—", "Tehzîb 4385"),
  E("ataebirebah", "amrsuayb", "س", "Tehzîb 4385"),
  E("mucahid", "amrsuayb", "—", "Tehzîb 4385"),
  E("ibnsihab", "amrsuayb", "س", "Tehzîb 4385"),


  /* Amr b. Şuayb (o. 118) -- talebeleri.
     Tehzîb 4385. Tercemede 81 kayit var, agda dugumu olan 35'i cizildi. */
  E("amrsuayb", "usamezeydleysi", "بخ ٤", "Tehzîb 4385"),
  E("amrsuayb", "eyyubsahtiyani", "٤", "Tehzîb 4385"),
  E("amrsuayb", "sabitbunani", "سي", "Tehzîb 4385"),
  E("amrsuayb", "haccacertat", "ت س ق", "Tehzîb 4385"),
  E("amrsuayb", "hassanatiyye", "د", "Tehzîb 4385"),
  E("amrsuayb", "huseynmuallim", "ر ٤", "Tehzîb 4385"),
  E("amrsuayb", "hakemuteybe", "س", "Tehzîb 4385"),
  E("amrsuayb", "humeyskaysarac", "س", "Tehzîb 4385"),
  E("amrsuayb", "humeydtavil", "—", "Tehzîb 4385"),
  E("amrsuayb", "davudkaysferra", "د س", "Tehzîb 4385"),
  E("amrsuayb", "davudebihind", "د س ق", "Tehzîb 4385"),
  E("amrsuayb", "zubeyradi", "—", "Tehzîb 4385"),
  E("amrsuayb", "suleymanmusadimaski", "٤", "Tehzîb 4385"),
  E("amrsuayb", "asimahvel", "س", "Tehzîb 4385"),
  E("amrsuayb", "amiralhavl", "ر ٤", "Tehzîb 4385"),
  E("amrsuayb", "abdullahtavus", "د س", "Tehzîb 4385"),
  E("amrsuayb", "abdullahavn", "—", "Tehzîb 4385"),
  E("amrsuayb", "abdulkerimcezeri", "ق", "Tehzîb 4385"),
  E("amrsuayb", "ubeydullahomeri", "د ت س", "Tehzîb 4385"),
  E("amrsuayb", "ataihorasani", "ق", "Tehzîb 4385"),
  E("amrsuayb", "amrharis", "د س", "Tehzîb 4385"),
  E("amrsuayb", "amrdinar", "—", "Tehzîb 4385"),
  E("amrsuayb", "katade", "ت س ق", "Tehzîb 4385"),
  E("amrsuayb", "ibnishak", "بخ ٤", "Tehzîb 4385"),
  E("amrsuayb", "muhammedacilan", "بخ ٤", "Tehzîb 4385"),
  E("amrsuayb", "matarverrak", "د س ق", "Tehzîb 4385"),
  E("amrsuayb", "mekhul", "—", "Tehzîb 4385"),
  E("amrsuayb", "hisamurve", "—", "Tehzîb 4385"),
  E("amrsuayb", "velidkesir", "د ق", "Tehzîb 4385"),
  E("amrsuayb", "yahyasaidensari", "د س", "Tehzîb 4385"),
  E("amrsuayb", "yahyaebikesir", "—", "Tehzîb 4385"),
  E("amrsuayb", "yezidebihabib", "—", "Tehzîb 4385"),
  E("amrsuayb", "yezidhad", "بخ س", "Tehzîb 4385"),
  E("amrsuayb", "ismailebiislamsibani", "—", "Tehzîb 4385"),
  E("amrsuayb", "ebuzubeyrmekki", "—", "Tehzîb 4385"),


  /* Sâlih b. Keysân (o. ?) -- hocalari.
     Tehzîb 2834. Tercemede 23 kayit var, agda dugumu olan 7'i cizildi. */
  E("ibnzubeyr", "salihkeysan", "—", "Tehzîb 2834"),
  E("ibnomer", "salihkeysan", "—", "Tehzîb 2834"),
  E("salimibnomer", "salihkeysan", "خ س", "Tehzîb 2834"),
  E("suleymanyesar", "salihkeysan", "م د", "Tehzîb 2834"),
  E("urve", "salihkeysan", "خ م د س", "Tehzîb 2834"),
  E("muhammedacilan", "salihkeysan", "س", "Tehzîb 2834"),
  E("nafiibnomer", "salihkeysan", "خ م د س", "Tehzîb 2834"),


  /* Sâlih b. Keysân (o. ?) -- talebeleri.
     Tehzîb 2834. Tercemede 21 kayit var, agda dugumu olan 15'i cizildi. */
  E("salihkeysan", "usamezeydleysi", "ت", "Tehzîb 2834"),
  E("salihkeysan", "ismailayyas", "ق", "Tehzîb 2834"),
  E("salihkeysan", "enesiyaz", "—", "Tehzîb 2834"),
  E("salihkeysan", "hammadzeyd", "س", "Tehzîb 2834"),
  E("salihkeysan", "ibnuyeyne", "خ م د س", "Tehzîb 2834"),
  E("salihkeysan", "suleymanbilal", "خ", "Tehzîb 2834"),
  E("salihkeysan", "macisun", "سي", "Tehzîb 2834"),
  E("salihkeysan", "abdulazizomer", "د س", "Tehzîb 2834"),
  E("salihkeysan", "darevardi", "د", "Tehzîb 2834"),
  E("salihkeysan", "ibncureyc", "خ م س", "Tehzîb 2834"),
  E("salihkeysan", "amrdinar", "—", "Tehzîb 2834"),
  E("salihkeysan", "malik", "خ م د س", "Tehzîb 2834"),
  E("salihkeysan", "ibnishak", "س", "Tehzîb 2834"),
  E("salihkeysan", "mamer", "د س", "Tehzîb 2834"),
  E("salihkeysan", "musaukbe", "—", "Tehzîb 2834"),


  /* Şeybân b. Abdirrahman en-Nahvî (o. 164) -- hocalari.
     Tehzîb 2784. Tercemede 22 kayit var, agda dugumu olan 12'i cizildi. */
  E("ismailebihalid", "seybannahvi", "—", "Tehzîb 2784"),
  E("cabircufi", "seybannahvi", "—", "Tehzîb 2784"),
  E("hakemuteybe", "seybannahvi", "—", "Tehzîb 2784"),
  E("amess", "seybannahvi", "م د ت ق", "Tehzîb 2784"),
  E("simakharb", "seybannahvi", "د", "Tehzîb 2784"),
  E("asimbehdele", "seybannahvi", "د ت س", "Tehzîb 2784"),
  E("abdulmelikumeyr", "seybannahvi", "م", "Tehzîb 2784"),
  E("firasyahya", "seybannahvi", "خ ٤", "Tehzîb 2784"),
  E("katade", "seybannahvi", "خ م ت س ق", "Tehzîb 2784"),
  E("leysebisuleym", "seybannahvi", "س", "Tehzîb 2784"),
  E("mansurmutemir", "seybannahvi", "خ م", "Tehzîb 2784"),
  E("hilalvezzan", "seybannahvi", "خ م", "Tehzîb 2784"),


  /* Şeybân b. Abdirrahman en-Nahvî (o. 164) -- talebeleri.
     Tehzîb 2784. Tercemede 35 kayit var, agda dugumu olan 11'i cizildi. */
  E("seybannahvi", "ademebiiyas", "خ ت س", "Tehzîb 2784"),
  E("seybannahvi", "zaidekudame", "م", "Tehzîb 2784"),
  E("seybannahvi", "ebudavudtayalisi", "د س", "Tehzîb 2784"),
  E("seybannahvi", "ibnmehdi", "—", "Tehzîb 2784"),
  E("seybannahvi", "ubeydullahmusa", "خ م د ت ق", "Tehzîb 2784"),
  E("seybannahvi", "alicad", "—", "Tehzîb 2784"),
  E("seybannahvi", "ebunuaymfadl", "خ س", "Tehzîb 2784"),
  E("seybannahvi", "muhammedsuaybsabur", "—", "Tehzîb 2784"),
  E("seybannahvi", "muazmuaz", "—", "Tehzîb 2784"),
  E("seybannahvi", "velidmuslim", "م د", "Tehzîb 2784"),
  E("seybannahvi", "yezidharun", "—", "Tehzîb 2784"),


  /* Hemmâm b. Yahyâ (o. 164) -- hocalari.
     Tehzîb 6602. Tercemede 33 kayit var, agda dugumu olan 16'i cizildi. */
  E("ishaktalha", "hemmamyahya", "خ م دس ق", "Tehzîb 6602"),
  E("enessirin", "hemmamyahya", "خ م دس ق", "Tehzîb 6602"),
  E("sabitbunani", "hemmamyahya", "خ م", "Tehzîb 6602"),
  E("hasanbasri", "hemmamyahya", "—", "Tehzîb 6602"),
  E("huseynmuallim", "hemmamyahya", "دس", "Tehzîb 6602"),
  E("ziyadsad", "hemmamyahya", "د س", "Tehzîb 6602"),
  E("zeydeslem", "hemmamyahya", "م س", "Tehzîb 6602"),
  E("ibnuyeyne", "hemmamyahya", "دس", "Tehzîb 6602"),
  E("amiralhavl", "hemmamyahya", "٤", "Tehzîb 6602"),
  E("ibncureyc", "hemmamyahya", "٤", "Tehzîb 6602"),
  E("ataebirebah", "hemmamyahya", "خ م دس", "Tehzîb 6602"),
  E("alizeydcudan", "hemmamyahya", "د", "Tehzîb 6602"),
  E("matarverrak", "hemmamyahya", "د", "Tehzîb 6602"),
  E("nafiibnomer", "hemmamyahya", "خ", "Tehzîb 6602"),
  E("hisamurve", "hemmamyahya", "—", "Tehzîb 6602"),
  E("ebuimrancevni", "hemmamyahya", "خ م", "Tehzîb 6602"),


  /* Hemmâm b. Yahyâ (o. 164) -- talebeleri.
     Tehzîb 6602. Tercemede 46 kayit var, agda dugumu olan 17'i cizildi. */
  E("hemmamyahya", "ibnuleyye", "—", "Tehzîb 6602"),
  E("hemmamyahya", "bisrsari", "م", "Tehzîb 6602"),
  E("hemmamyahya", "haccacminhal", "خ ٤", "Tehzîb 6602"),
  E("hemmamyahya", "sevri", "—", "Tehzîb 6602"),
  E("hemmamyahya", "ebudavudtayalisi", "م ت س", "Tehzîb 6602"),
  E("hemmamyahya", "seybanferruh", "م", "Tehzîb 6602"),
  E("hemmamyahya", "ibnmehdi", "م ق", "Tehzîb 6602"),
  E("hemmamyahya", "abdussamed", "ع", "Tehzîb 6602"),
  E("hemmamyahya", "affanmuslim", "خ م س", "Tehzîb 6602"),
  E("hemmamyahya", "alicad", "—", "Tehzîb 6602"),
  E("hemmamyahya", "ebunuaymfadl", "خ", "Tehzîb 6602"),
  E("hemmamyahya", "muslimibrahim", "خ د", "Tehzîb 6602"),
  E("hemmamyahya", "musaismailtebuzeki", "خ د", "Tehzîb 6602"),
  E("hemmamyahya", "hebbanhilal", "خ م د", "Tehzîb 6602"),
  E("hemmamyahya", "veki", "ق", "Tehzîb 6602"),
  E("hemmamyahya", "yezidharun", "م ت س ق", "Tehzîb 6602"),
  E("hemmamyahya", "hisamtayalisi", "خ م دس", "Tehzîb 6602"),


  /* Ebû Dâvûd et-Tayâlisî (o. 204) -- hocalari.
     Tehzîb 2507. Tercemede 70 kayit var, agda dugumu olan 20'i cizildi. */
  E("ebansattar", "ebudavudtayalisi", "م د ت", "Tehzîb 2507"),
  E("israilyunus", "ebudavudtayalisi", "د", "Tehzîb 2507"),
  E("cerirhazim", "ebudavudtayalisi", "ت ق", "Tehzîb 2507"),
  E("cerirabdulhamid", "ebudavudtayalisi", "—", "Tehzîb 2507"),
  E("harbseddad", "ebudavudtayalisi", "م د ت س", "Tehzîb 2507"),
  E("hammadzeyd", "ebudavudtayalisi", "—", "Tehzîb 2507"),
  E("hammadseleme", "ebudavudtayalisi", "ت س", "Tehzîb 2507"),
  E("zaidekudame", "ebudavudtayalisi", "م", "Tehzîb 2507"),
  E("zuhayrmuaviye", "ebudavudtayalisi", "س", "Tehzîb 2507"),
  E("suleymanmugire", "ebudavudtayalisi", "د س", "Tehzîb 2507"),
  E("serikkadi", "ebudavudtayalisi", "ق", "Tehzîb 2507"),
  E("abdullahavn", "ebudavudtayalisi", "—", "Tehzîb 2507"),
  E("ibnmubarek", "ebudavudtayalisi", "—", "Tehzîb 2507"),
  E("mesudi", "ebudavudtayalisi", "د ت", "Tehzîb 2507"),
  E("macisun", "ebudavudtayalisi", "م ت س", "Tehzîb 2507"),
  E("abdulvahidziyad", "ebudavudtayalisi", "—", "Tehzîb 2507"),
  E("kaysrebi", "ebudavudtayalisi", "ق", "Tehzîb 2507"),
  E("varkaomer", "ebudavudtayalisi", "تم عس ق", "Tehzîb 2507"),
  E("ebuavane", "ebudavudtayalisi", "م", "Tehzîb 2507"),
  E("vuheybhalid", "ebudavudtayalisi", "—", "Tehzîb 2507"),


  /* Ebû Dâvûd et-Tayâlisî (o. 204) -- talebeleri.
     Tehzîb 2507. Tercemede 53 kayit var, agda dugumu olan 13'i cizildi. */
  E("ebudavudtayalisi", "ahmeddevraki", "م دت", "Tehzîb 2507"),
  E("ebudavudtayalisi", "ahmedhanbel", "م", "Tehzîb 2507"),
  E("ebudavudtayalisi", "ishakkevsec", "م تم س ق", "Tehzîb 2507"),
  E("ebudavudtayalisi", "abbasanberi", "ت", "Tehzîb 2507"),
  E("ebudavudtayalisi", "ibnebiseybe", "م", "Tehzîb 2507"),
  E("ebudavudtayalisi", "osmanebiseybe", "—", "Tehzîb 2507"),
  E("ebudavudtayalisi", "alimedini", "—", "Tehzîb 2507"),
  E("ebudavudtayalisi", "bundar", "خت م ٤", "Tehzîb 2507"),
  E("ebudavudtayalisi", "muhammedrafi", "ت س", "Tehzîb 2507"),
  E("ebudavudtayalisi", "ibnmusenna", "م ت س ق", "Tehzîb 2507"),
  E("ebudavudtayalisi", "mahmudgaylan", "خت مق ت س", "Tehzîb 2507"),
  E("ebudavudtayalisi", "nasralicehdami", "—", "Tehzîb 2507"),
  E("ebudavudtayalisi", "yakubdevraki", "—", "Tehzîb 2507"),


  /* Velîd b. Müslim (o. 195) -- hocalari.
     Tehzîb 6737. Tercemede 103 kayit var, agda dugumu olan 11'i cizildi. */
  E("sevryezid", "velidmuslim", "خ د ت ق", "Tehzîb 6737"),
  E("hassanatiyye", "velidmuslim", "د", "Tehzîb 6737"),
  E("hanzalasufyan", "velidmuslim", "س ق", "Tehzîb 6737"),
  E("saidabdulaziz", "velidmuslim", "م د", "Tehzîb 6737"),
  E("sevri", "velidmuslim", "سي", "Tehzîb 6737"),
  E("evzai", "velidmuslim", "—", "Tehzîb 6737"),
  E("ibncureyc", "velidmuslim", "ع", "Tehzîb 6737"),
  E("isabyunus", "velidmuslim", "—", "Tehzîb 6737"),
  E("muhammedacilan", "velidmuslim", "ق", "Tehzîb 6737"),
  E("muaviyesellam", "velidmuslim", "د", "Tehzîb 6737"),
  E("hisamhassan", "velidmuslim", "ق", "Tehzîb 6737"),


  /* Velîd b. Müslim (o. 195) -- talebeleri.
     Tehzîb 6737. Tercemede 96 kayit var, agda dugumu olan 15'i cizildi. */
  E("velidmuslim", "ibrahimmunzirhizami", "خ", "Tehzîb 6737"),
  E("velidmuslim", "ahmedhanbel", "د", "Tehzîb 6737"),
  E("velidmuslim", "ibnrahuye", "خ م", "Tehzîb 6737"),
  E("velidmuslim", "bakiyyevelid", "—", "Tehzîb 6737"),
  E("velidmuslim", "zuheyrharb", "م", "Tehzîb 6737"),
  E("velidmuslim", "suveydsaidhadesani", "—", "Tehzîb 6737"),
  E("velidmuslim", "damrarebia", "—", "Tehzîb 6737"),
  E("velidmuslim", "ibnvehb", "—", "Tehzîb 6737"),
  E("velidmuslim", "alimedini", "خ", "Tehzîb 6737"),
  E("velidmuslim", "kuteybesaid", "ت", "Tehzîb 6737"),
  E("velidmuslim", "mucahidmusa", "ق", "Tehzîb 6737"),
  E("velidmuslim", "muhammedsuaybsabur", "—", "Tehzîb 6737"),
  E("velidmuslim", "ibnmusenna", "خ م د س", "Tehzîb 6737"),
  E("velidmuslim", "mahmudgaylan", "—", "Tehzîb 6737"),
  E("velidmuslim", "harunmaruf", "م", "Tehzîb 6737"),


  /* Cerîr b. Abdilhamîd (o. 188) -- hocalari.
     Tehzîb 918. Tercemede 54 kayit var, agda dugumu olan 23'i cizildi. */
  E("ismailebihalid", "cerirabdulhamid", "خ م", "Tehzîb 918"),
  E("beyanbisr", "cerirabdulhamid", "م س", "Tehzîb 918"),
  E("hasanubeydullah", "cerirabdulhamid", "م د ت", "Tehzîb 918"),
  E("husaynabdrahman", "cerirabdulhamid", "م", "Tehzîb 918"),
  E("hamzazeyyat", "cerirabdulhamid", "مق", "Tehzîb 918"),
  E("suleymanteymi", "cerirabdulhamid", "م س", "Tehzîb 918"),
  E("suheylebisalih", "cerirabdulhamid", "م ٤", "Tehzîb 918"),
  E("asimahvel", "cerirabdulhamid", "م د", "Tehzîb 918"),
  E("abdullahsubrume", "cerirabdulhamid", "س", "Tehzîb 918"),
  E("ibnhuseymkhaysem", "cerirabdulhamid", "ت", "Tehzîb 918"),
  E("abdulmelikumeyr", "cerirabdulhamid", "خ م", "Tehzîb 918"),
  E("ubeydullahomeri", "cerirabdulhamid", "ق", "Tehzîb 918"),
  E("ataisaib", "cerirabdulhamid", "د ت س", "Tehzîb 918"),
  E("leysebisuleym", "cerirabdulhamid", "بخ", "Tehzîb 918"),
  E("malik", "cerirabdulhamid", "—", "Tehzîb 918"),
  E("ibnishak", "cerirabdulhamid", "ت س", "Tehzîb 918"),
  E("mutarriftarif", "cerirabdulhamid", "خ م د س", "Tehzîb 918"),
  E("mugirmiksem", "cerirabdulhamid", "خ م د", "Tehzîb 918"),
  E("mansurmutemir", "cerirabdulhamid", "ع", "Tehzîb 918"),
  E("hisamhassan", "cerirabdulhamid", "م س", "Tehzîb 918"),
  E("hisamurve", "cerirabdulhamid", "م ت س", "Tehzîb 918"),
  E("yahyasaidensari", "cerirabdulhamid", "م", "Tehzîb 918"),
  E("ismailebiislamsibani", "cerirabdulhamid", "خ م د", "Tehzîb 918"),


  /* Cerîr b. Abdilhamîd (o. 188) -- talebeleri.
     Tehzîb 918. Tercemede 42 kayit var, agda dugumu olan 15'i cizildi. */
  E("cerirabdulhamid", "ibrahimmusaferra", "د", "Tehzîb 918"),
  E("cerirabdulhamid", "ahmedhanbel", "—", "Tehzîb 918"),
  E("cerirabdulhamid", "ibnrahuye", "خ م ت س", "Tehzîb 918"),
  E("cerirabdulhamid", "zuheyrharb", "خ م د", "Tehzîb 918"),
  E("cerirabdulhamid", "said_mansur", "د", "Tehzîb 918"),
  E("cerirabdulhamid", "abdan", "خ", "Tehzîb 918"),
  E("cerirabdulhamid", "ibnmubarek", "—", "Tehzîb 918"),
  E("cerirabdulhamid", "ibnebiseybe", "م ق", "Tehzîb 918"),
  E("cerirabdulhamid", "osmanebiseybe", "خ م د سي", "Tehzîb 918"),
  E("cerirabdulhamid", "alimedini", "خ", "Tehzîb 918"),
  E("cerirabdulhamid", "kuteybesaid", "خ م ت سي", "Tehzîb 918"),
  E("cerirabdulhamid", "muhammedisataba", "—", "Tehzîb 918"),
  E("cerirabdulhamid", "ibnmain", "—", "Tehzîb 918"),
  E("cerirabdulhamid", "yahyayahyanisaburi", "خ م", "Tehzîb 918"),
  E("cerirabdulhamid", "yakubdevraki", "—", "Tehzîb 918"),


  /* İsrâîl b. Yûnus (o. 160) -- hocalari.
     Tehzîb 402. Tercemede 69 kayit var, agda dugumu olan 15'i cizildi. */
  E("suddi", "israilyunus", "م ت", "Tehzîb 402"),
  E("cabircufi", "israilyunus", "ق", "Tehzîb 402"),
  E("saidmesrukhsevri", "israilyunus", "ق", "Tehzîb 402"),
  E("amess", "israilyunus", "خ", "Tehzîb 402"),
  E("simakharb", "israilyunus", "بخ م د ت س", "Tehzîb 402"),
  E("asimbehdele", "israilyunus", "سي", "Tehzîb 402"),
  E("asimahvel", "israilyunus", "خ", "Tehzîb 402"),
  E("abdulkerimcezeri", "israilyunus", "س", "Tehzîb 402"),
  E("abdulmelikumeyr", "israilyunus", "م", "Tehzîb 402"),
  E("ebuhasin", "israilyunus", "خ س", "Tehzîb 402"),
  E("ebuishaksebii", "israilyunus", "خ م د ت س", "Tehzîb 402"),
  E("mugirmiksem", "israilyunus", "خ م", "Tehzîb 402"),
  E("mansurmutemir", "israilyunus", "خ م ت س", "Tehzîb 402"),
  E("hisamurve", "israilyunus", "خ", "Tehzîb 402"),
  E("hilalvezzan", "israilyunus", "ت", "Tehzîb 402"),


  /* İsrâîl b. Yûnus (o. 160) -- talebeleri.
     Tehzîb 402. Tercemede 56 kayit var, agda dugumu olan 14'i cizildi. */
  E("israilyunus", "ademebiiyas", "خ س", "Tehzîb 402"),
  E("israilyunus", "abdulvehhabata", "ت", "Tehzîb 402"),
  E("israilyunus", "ubeydullahmusa", "خ م ت س", "Tehzîb 402"),
  E("israilyunus", "alicad", "—", "Tehzîb 402"),
  E("israilyunus", "isabyunus", "تم", "Tehzîb 402"),
  E("israilyunus", "ebunuaymfadl", "م س ق", "Tehzîb 402"),
  E("israilyunus", "firyabi", "خ م د ت", "Tehzîb 402"),
  E("israilyunus", "mafairan", "س", "Tehzîb 402"),
  E("israilyunus", "musaismailtebuzeki", "—", "Tehzîb 402"),
  E("israilyunus", "nadrsumeyl", "خ م", "Tehzîb 402"),
  E("israilyunus", "hisamtayalisi", "—", "Tehzîb 402"),
  E("israilyunus", "veki", "خ م د ت ق", "Tehzîb 402"),
  E("israilyunus", "yahyaadem", "خ م د ت س", "Tehzîb 402"),
  E("israilyunus", "yezidzurey", "س", "Tehzîb 402"),


  /* Behz b. Hakîm (o. ?) -- hocalari.
     Tehzîb 775. Tercemede 3 kayit var, agda dugumu olan 2'i cizildi. */
  E("zurareevfa", "behzhakim", "د ت", "Tehzîb 775"),
  E("hisamurve", "behzhakim", "—", "Tehzîb 775"),


  /* Behz b. Hakîm (o. ?) -- talebeleri.
     Tehzîb 775. Tercemede 50 kayit var, agda dugumu olan 22'i cizildi. */
  E("behzhakim", "ibnuleyye", "د س ق", "Tehzîb 775"),
  E("behzhakim", "cerirhazim", "—", "Tehzîb 775"),
  E("behzhakim", "ebuusamehammad", "د ق", "Tehzîb 775"),
  E("behzhakim", "hammadzeyd", "—", "Tehzîb 775"),
  E("behzhakim", "hammadseleme", "د", "Tehzîb 775"),
  E("behzhakim", "ruhubade", "—", "Tehzîb 775"),
  E("behzhakim", "sevri", "د", "Tehzîb 775"),
  E("behzhakim", "suleymanteymi", "—", "Tehzîb 775"),
  E("behzhakim", "ebuasimnebil", "بخ", "Tehzîb 775"),
  E("behzhakim", "abdullahavn", "—", "Tehzîb 775"),
  E("behzhakim", "abdulvarissaid", "—", "Tehzîb 775"),
  E("behzhakim", "abdulvehhabata", "—", "Tehzîb 775"),
  E("behzhakim", "isabyunus", "—", "Tehzîb 775"),
  E("behzhakim", "muhammedebiadi", "د", "Tehzîb 775"),
  E("behzhakim", "ibnsihab", "—", "Tehzîb 775"),
  E("behzhakim", "mervanfezari", "د", "Tehzîb 775"),
  E("behzhakim", "muazmuaz", "ت", "Tehzîb 775"),
  E("behzhakim", "mutemirsuleyman", "س", "Tehzîb 775"),
  E("behzhakim", "mamer", "د س ق", "Tehzîb 775"),
  E("behzhakim", "nadrsumeyl", "ق", "Tehzîb 775"),
  E("behzhakim", "hisamhassan", "—", "Tehzîb 775"),
  E("behzhakim", "yezidharun", "د ت ق", "Tehzîb 775"),


  /* Bakiyye b. el-Velîd (o. 197) -- hocalari.
     Tehzîb 738. Tercemede 73 kayit var, agda dugumu olan 11'i cizildi. */
  E("sevryezid", "bakiyyevelid", "د س ق", "Tehzîb 738"),
  E("saidabdulaziz", "bakiyyevelid", "د", "Tehzîb 738"),
  E("sube", "bakiyyevelid", "س", "Tehzîb 738"),
  E("ibnmubarek", "bakiyyevelid", "—", "Tehzîb 738"),
  E("ibncureyc", "bakiyyevelid", "—", "Tehzîb 738"),
  E("ubeydullahomeri", "bakiyyevelid", "س", "Tehzîb 738"),
  E("malik", "bakiyyevelid", "—", "Tehzîb 738"),
  E("muhammedvelidzubeydi", "bakiyyevelid", "م د س ق", "Tehzîb 738"),
  E("hikalziyad", "bakiyyevelid", "—", "Tehzîb 738"),
  E("varkaomer", "bakiyyevelid", "ق", "Tehzîb 738"),
  E("yezidharun", "bakiyyevelid", "د", "Tehzîb 738"),


  /* Bakiyye b. el-Velîd (o. 197) -- talebeleri.
     Tehzîb 738. Tercemede 59 kayit var, agda dugumu olan 10'i cizildi. */
  E("bakiyyevelid", "ibrahimmusaferra", "بخ د", "Tehzîb 738"),
  E("bakiyyevelid", "ibnrahuye", "بخ سي", "Tehzîb 738"),
  E("bakiyyevelid", "ismailayyas", "—", "Tehzîb 738"),
  E("bakiyyevelid", "hammadzeyd", "—", "Tehzîb 738"),
  E("bakiyyevelid", "hammadseleme", "—", "Tehzîb 738"),
  E("bakiyyevelid", "ibnuyeyne", "—", "Tehzîb 738"),
  E("bakiyyevelid", "suveydsaidhadesani", "ق", "Tehzîb 738"),
  E("bakiyyevelid", "alihucr", "ت س", "Tehzîb 738"),
  E("bakiyyevelid", "veki", "—", "Tehzîb 738"),
  E("bakiyyevelid", "yakubdevraki", "س", "Tehzîb 738"),


  /* Ali b. el-Ca‘d (o. 230) -- hocalari.
     Tehzîb 4034. Tercemede 62 kayit var, agda dugumu olan 15'i cizildi. */
  E("ismailayyas", "alicad", "—", "Tehzîb 4034"),
  E("cerirhazim", "alicad", "—", "Tehzîb 4034"),
  E("hammadzeyd", "alicad", "—", "Tehzîb 4034"),
  E("hammadseleme", "alicad", "—", "Tehzîb 4034"),
  E("zuhayrmuaviye", "alicad", "—", "Tehzîb 4034"),
  E("sevri", "alicad", "—", "Tehzîb 4034"),
  E("ibnuyeyne", "alicad", "—", "Tehzîb 4034"),
  E("suleymanmugire", "alicad", "—", "Tehzîb 4034"),
  E("serikkadi", "alicad", "—", "Tehzîb 4034"),
  E("mesudi", "alicad", "—", "Tehzîb 4034"),
  E("macisun", "alicad", "—", "Tehzîb 4034"),
  E("kaysrebi", "alicad", "—", "Tehzîb 4034"),
  E("malik", "alicad", "—", "Tehzîb 4034"),
  E("varkaomer", "alicad", "—", "Tehzîb 4034"),
  E("ebuavane", "alicad", "—", "Tehzîb 4034"),


  /* Ali b. el-Ca‘d (o. 230) -- talebeleri.
     Tehzîb 4034. Tercemede 36 kayit var, agda dugumu olan 8'i cizildi. */
  E("alicad", "ebudavud", "—", "Tehzîb 4034"),
  E("alicad", "bh03", "—", "Tehzîb 4034"),
  E("alicad", "ahmeddevraki", "—", "Tehzîb 4034"),
  E("alicad", "ahmedhanbel", "—", "Tehzîb 4034"),
  E("alicad", "ed20", "—", "Tehzîb 4034"),
  E("alicad", "ibnebiseybe", "—", "Tehzîb 4034"),
  E("alicad", "ebuzuraraazi", "—", "Tehzîb 4034"),
  E("alicad", "ebuhatimrazi", "—", "Tehzîb 4034"),


  /* Yezîd b. Ebî Habîb (o. 128) -- hocalari.
     Tehzîb 6975. Tercemede 70 kayit var, agda dugumu olan 7'i cizildi. */
  E("ibrhunayn", "yezidebihabib", "م س", "Tehzîb 6975"),
  E("salimibnomer", "yezidebihabib", "ق", "Tehzîb 6975"),
  E("ebutufeyl", "yezidebihabib", "د ت", "Tehzîb 6975"),
  E("ataebirebah", "yezidebihabib", "ع", "Tehzîb 6975"),
  E("ikrime", "yezidebihabib", "—", "Tehzîb 6975"),
  E("ibnsihab", "yezidebihabib", "م", "Tehzîb 6975"),
  E("nafiibnomer", "yezidebihabib", "ق", "Tehzîb 6975"),


  /* Yezîd b. Ebî Habîb (o. 128) -- talebeleri.
     Tehzîb 6975. Tercemede 16 kayit var, agda dugumu olan 6'i cizildi. */
  E("yezidebihabib", "harmalaimran", "—", "Tehzîb 6975"),
  E("yezidebihabib", "hayveseri", "ع", "Tehzîb 6975"),
  E("yezidebihabib", "saidebiyyubmisri", "خ م د س", "Tehzîb 6975"),
  E("yezidebihabib", "suleymanteymi", "—", "Tehzîb 6975"),
  E("yezidebihabib", "abdulhamidcafer", "خت م ٤", "Tehzîb 6975"),
  E("yezidebihabib", "amrharis", "خ م د س ق", "Tehzîb 6975"),


  /* Ukbe b. Âmir el-Cühenî (o. 58) -- hocalari.
     Tehzîb 3978. Tercemede 1 kayit var, agda dugumu olan 1'i cizildi. */
  E("omer", "ukbeamir", "م د س ق", "Tehzîb 3978"),


  /* Ukbe b. Âmir el-Cühenî (o. 58) -- talebeleri.
     Tehzîb 3978. Tercemede 43 kayit var, agda dugumu olan 10'i cizildi. */
  E("ukbeamir", "bece", "خ م ت س", "Tehzîb 3978"),
  E("ukbeamir", "cabir", "—", "Tehzîb 3978"),
  E("ukbeamir", "rebihiras", "م", "Tehzîb 3978"),
  E("ukbeamir", "ebuumame", "ت", "Tehzîb 3978"),
  E("ukbeamir", "ibnabbas", "—", "Tehzîb 3978"),
  E("ukbeamir", "ikrime", "د", "Tehzîb 3978"),
  E("ukbeamir", "kayshazim", "م ت س", "Tehzîb 3978"),
  E("ukbeamir", "mekhul", "س", "Tehzîb 3978"),
  E("ukbeamir", "ebuidrishavlani", "م د س", "Tehzîb 3978"),
  E("ukbeamir", "ebusaidmakburi", "د", "Tehzîb 3978"),


  /* Ebû Ümâme el-Bâhilî (o. ?) -- hocalari.
     Tehzîb 2872. Tercemede 9 kayit var, agda dugumu olan 3'i cizildi. */
  E("ali", "ebuumame", "—", "Tehzîb 2872"),
  E("omer", "ebuumame", "ت ق", "Tehzîb 2872"),
  E("muazcebel", "ebuumame", "—", "Tehzîb 2872"),


  /* Ebû Ümâme el-Bâhilî (o. ?) -- talebeleri.
     Tehzîb 2872. Tercemede 51 kayit var, agda dugumu olan 7'i cizildi. */
  E("ebuumame", "hassanatiyye", "ت", "Tehzîb 2872"),
  E("ebuumame", "salimcad", "ت ق", "Tehzîb 2872"),
  E("ebuumame", "suleymanhabib", "خ د ق", "Tehzîb 2872"),
  E("ebuumame", "saddadebuammar", "م د ت س", "Tehzîb 2872"),
  E("ebuumame", "sehrhavseb", "د ت سي ق", "Tehzîb 2872"),
  E("ebuumame", "mekhul", "ق", "Tehzîb 2872"),
  E("ebuumame", "ebuidrishavlani", "—", "Tehzîb 2872"),


  /* Seleme b. el-Ekva‘ (o. 74) -- hocalari.
     Tehzîb 2462. Tercemede 4 kayit var, agda dugumu olan 2'i cizildi. */
  E("talha", "selemeekva", "—", "Tehzîb 2462"),
  E("omer", "selemeekva", "—", "Tehzîb 2462"),


  /* Seleme b. el-Ekva‘ (o. 74) -- talebeleri.
     Tehzîb 2462. Tercemede 14 kayit var, agda dugumu olan 4'i cizildi. */
  E("selemeekva", "hasanhanefiyye", "خ م", "Tehzîb 2462"),
  E("selemeekva", "zeydeslem", "—", "Tehzîb 2462"),
  E("selemeekva", "yezidhusayfe", "—", "Tehzîb 2462"),
  E("selemeekva", "ebuselemeavf", "—", "Tehzîb 2462"),


  /* Sehl b. Sa‘d es-Sâidî (o. 88) -- hocalari.
     Tehzîb 2612. Tercemede 4 kayit var, agda dugumu olan 2'i cizildi. */
  E("ubey", "sehlsad", "د ت ق", "Tehzîb 2612"),
  E("mervan", "sehlsad", "خ ت س", "Tehzîb 2612"),


  /* Sehl b. Sa‘d es-Sâidî (o. 88) -- talebeleri.
     Tehzîb 2612. Tercemede 18 kayit var, agda dugumu olan 2'i cizildi. */
  E("sehlsad", "haricezeyd", "—", "Tehzîb 2612"),
  E("sehlsad", "ibnsihab", "ع", "Tehzîb 2612"),


  /* İmrân b. Husayn (o. 52) -- talebeleri.
     Tehzîb 4486. Tercemede 35 kayit var, agda dugumu olan 7'i cizildi. */
  E("imranhusayn", "hakemarac", "م", "Tehzîb 4486"),
  E("imranhusayn", "rebihiras", "س", "Tehzîb 4486"),
  E("imranhusayn", "zurareevfa", "ع", "Tehzîb 4486"),
  E("imranhusayn", "safvanmuhriz", "خ ت س", "Tehzîb 4486"),
  E("imranhusayn", "sabi", "د ت", "Tehzîb 4486"),
  E("imranhusayn", "kasimmihran", "ق", "Tehzîb 4486"),
  E("imranhusayn", "ebunadra", "د ت س", "Tehzîb 4486"),


  /* Abdullah b. Dînâr (o. 127) -- hocalari.
     Tehzîb 3251. Tercemede 8 kayit var, agda dugumu olan 3'i cizildi. */
  E("enes", "abdullahdinar", "—", "Tehzîb 3251"),
  E("suleymanyesar", "abdullahdinar", "ع", "Tehzîb 3251"),
  E("nafiibnomer", "abdullahdinar", "م", "Tehzîb 3251"),


  /* Abdullah b. Dînâr (o. 127) -- talebeleri.
     Tehzîb 3251. Tercemede 31 kayit var, agda dugumu olan 15'i cizildi. */
  E("abdullahdinar", "rebiaebiabdrahman", "د", "Tehzîb 3251"),
  E("abdullahdinar", "sevri", "خ م ت س ق", "Tehzîb 3251"),
  E("abdullahdinar", "ibnuyeyne", "م ت س ق", "Tehzîb 3251"),
  E("abdullahdinar", "suleymanbilal", "خ م س", "Tehzîb 3251"),
  E("abdullahdinar", "suheylebisalih", "ع", "Tehzîb 3251"),
  E("abdullahdinar", "sube", "ع", "Tehzîb 3251"),
  E("abdullahdinar", "macisun", "خ م د ت س", "Tehzîb 3251"),
  E("abdullahdinar", "ubeydullahomeri", "م س", "Tehzîb 3251"),
  E("abdullahdinar", "leysbsad", "—", "Tehzîb 3251"),
  E("abdullahdinar", "muhammedsuka", "ت س", "Tehzîb 3251"),
  E("abdullahdinar", "muhammedacilan", "س ق", "Tehzîb 3251"),
  E("abdullahdinar", "musaukbe", "م د س", "Tehzîb 3251"),
  E("abdullahdinar", "varkaomer", "خ", "Tehzîb 3251"),
  E("abdullahdinar", "yahyasaidensari", "—", "Tehzîb 3251"),
  E("abdullahdinar", "yezidhad", "م د س ق", "Tehzîb 3251"),


  /* Hârice b. Zeyd b. Sâbit (o. 100) -- hocalari.
     Tehzîb 1589. Tercemede 7 kayit var, agda dugumu olan 2'i cizildi. */
  E("usame", "haricezeyd", "—", "Tehzîb 1589"),
  E("zeydsabit", "haricezeyd", "ع", "Tehzîb 1589"),


  /* Hârice b. Zeyd b. Sâbit (o. 100) -- talebeleri.
     Tehzîb 1589. Tercemede 21 kayit var, agda dugumu olan 4'i cizildi. */
  E("haricezeyd", "salimibnomer", "—", "Tehzîb 1589"),
  E("haricezeyd", "salimebinadr", "—", "Tehzîb 1589"),
  E("haricezeyd", "mutallibhantab", "ر", "Tehzîb 1589"),
  E("haricezeyd", "yezidkusayt", "د", "Tehzîb 1589"),


  /* Cerîr b. Abdillâh el-Becelî (o. 51) -- talebeleri.
     Tehzîb 917. Tercemede 22 kayit var, agda dugumu olan 9'i cizildi. */
  E("cerirbecelî", "enes", "خ م", "Tehzîb 917"),
  E("cerirbecelî", "ebuzabyan", "خ م", "Tehzîb 917"),
  E("cerirbecelî", "zadan", "ق", "Tehzîb 917"),
  E("cerirbecelî", "zeydvehb", "خ م", "Tehzîb 917"),
  E("cerirbecelî", "ebuvail", "س", "Tehzîb 917"),
  E("cerirbecelî", "sehrhavseb", "ت", "Tehzîb 917"),
  E("cerirbecelî", "sabi", "ع", "Tehzîb 917"),
  E("cerirbecelî", "kayshazim", "ع", "Tehzîb 917"),
  E("cerirbecelî", "ebuishaksebii", "س", "Tehzîb 917"),


  /* Ebû Zür‘a er-Râzî (o. 264) -- hocalari.
     Tehzîb 3660. Tercemede 76 kayit var, agda dugumu olan 12'i cizildi. */
  E("ahmedhanbel", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("harmalayahya", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("halefhisam", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("ebuasimnebil", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("ibnebiseybe", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("kanebi", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("ebunuaymfadl", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("kuteybesaid", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("muslimibrahim", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("musaismailtebuzeki", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("nasralicehdami", "ebuzuraraazi", "—", "Tehzîb 3660"),
  E("hisamtayalisi", "ebuzuraraazi", "—", "Tehzîb 3660"),


  /* Ebû Zür‘a er-Râzî (o. 264) -- talebeleri.
     Tehzîb 3660. Tercemede 45 kayit var, agda dugumu olan 10'i cizildi. */
  E("ebuzuraraazi", "muslim", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "tirmizi", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "nesai", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ibnmace", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "bh03", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ed19", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ms20", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ms23", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ebuhatimrazi", "—", "Tehzîb 3660"),
  E("ebuzuraraazi", "ms29", "—", "Tehzîb 3660"),


  /* Ebû Hâtim er-Râzî (o. 277) -- hocalari.
     Tehzîb 5050. Tercemede 77 kayit var, agda dugumu olan 11'i cizildi. */
  E("ahmedhanbel", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("ahmedsalihmisri", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("ademebiiyas", "ebuhatimrazi", "سي", "Tehzîb 5050"),
  E("zuheyrharb", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("ubeydullahmusa", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("affanmuslim", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("ebunuaymfadl", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("kuteybesaid", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("bundar", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("hebbanhilal", "ebuhatimrazi", "—", "Tehzîb 5050"),
  E("ibnmain", "ebuhatimrazi", "—", "Tehzîb 5050"),


  /* Ebû Hâtim er-Râzî (o. 277) -- talebeleri.
     Tehzîb 5050. Tercemede 35 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebuhatimrazi", "ebudavud", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "nesai", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "ibnmace", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "bh03", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "im03", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "bh17", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "im04", "—", "Tehzîb 5050"),
  E("ebuhatimrazi", "ms29", "—", "Tehzîb 5050"),


  /* İbn Şihâb ez-Zührî (o. 124) -- hocalari.
     Tehzîb 5606. Tercemede 155 kayit var, agda dugumu olan 18'i cizildi. */
  E("salimibnomer", "ibnsihab", "ع", "Tehzîb 5606"),
  E("saibyezid", "ibnsihab", "ع", "Tehzîb 5606"),
  E("saidmusayyeb", "ibnsihab", "ع", "Tehzîb 5606"),
  E("suleymanyesar", "ibnsihab", "ع", "Tehzîb 5606"),
  E("tavus", "ibnsihab", "س", "Tehzîb 5606"),
  E("ebutufeyl", "ibnsihab", "م ق", "Tehzîb 5606"),
  E("malikevs", "ibnsihab", "ع", "Tehzîb 5606"),
  E("muhammedabbadcafer", "ibnsihab", "—", "Tehzîb 5606"),
  E("muhammedsevban", "ibnsihab", "د", "Tehzîb 5606"),
  E("ibnmunkedir", "ibnsihab", "م", "Tehzîb 5606"),
  E("mahmudlebid", "ibnsihab", "ق", "Tehzîb 5606"),
  E("mutallibhantab", "ibnsihab", "—", "Tehzîb 5606"),
  E("nafiibnomer", "ibnsihab", "—", "Tehzîb 5606"),
  E("ebuidrishavlani", "ibnsihab", "ع", "Tehzîb 5606"),
  E("ebuumamesehl", "ibnsihab", "خ م د س ق", "Tehzîb 5606"),
  E("ebuselemeavf", "ibnsihab", "ع", "Tehzîb 5606"),
  E("ebuhureyre", "ibnsihab", "ت", "Tehzîb 5606"),
  E("amrabdrahmanzurara", "ibnsihab", "ع", "Tehzîb 5606"),


  /* İbn Şihâb ez-Zührî (o. 124) -- talebeleri.
     Tehzîb 5606. Tercemede 156 kayit var, agda dugumu olan 27'i cizildi. */
  E("ibnsihab", "ibrahimebiable", "س", "Tehzîb 5606"),
  E("ibnsihab", "ismailumeyye", "د س", "Tehzîb 5606"),
  E("ibnsihab", "caferburkan", "٤", "Tehzîb 5606"),
  E("ibnsihab", "humeyskaysarac", "د ق", "Tehzîb 5606"),
  E("ibnsihab", "rebiaebiabdrahman", "—", "Tehzîb 5606"),
  E("ibnsihab", "ziyadsad", "خ م د ت س", "Tehzîb 5606"),
  E("ibnsihab", "sadsaidensari", "بخ", "Tehzîb 5606"),
  E("ibnsihab", "saidabdulaziz", "س", "Tehzîb 5606"),
  E("ibnsihab", "sufyanhusayn", "خت ٤", "Tehzîb 5606"),
  E("ibnsihab", "suleymanmusadimaski", "د ت س", "Tehzîb 5606"),
  E("ibnsihab", "suheylebisalih", "د", "Tehzîb 5606"),
  E("ibnsihab", "abdullahdinar", "—", "Tehzîb 5606"),
  E("ibnsihab", "macisun", "خ", "Tehzîb 5606"),
  E("ibnsihab", "ubeydullahomeri", "م س", "Tehzîb 5606"),
  E("ibnsihab", "ikrimehalid", "—", "Tehzîb 5606"),
  E("ibnsihab", "amrharis", "م د س", "Tehzîb 5606"),
  E("ibnsihab", "katade", "—", "Tehzîb 5606"),
  E("ibnsihab", "kurrahayvil", "٤", "Tehzîb 5606"),
  E("ibnsihab", "muhammedvelidzubeydi", "خ م د س ق", "Tehzîb 5606"),
  E("ibnsihab", "muaviyesellam", "س", "Tehzîb 5606"),
  E("ibnsihab", "mansurmutemir", "خ م", "Tehzîb 5606"),
  E("ibnsihab", "musaukbe", "خ س", "Tehzîb 5606"),
  E("ibnsihab", "hisamurve", "م", "Tehzîb 5606"),
  E("ibnsihab", "yahyasaidensari", "خ", "Tehzîb 5606"),
  E("ibnsihab", "yezidrouman", "س", "Tehzîb 5606"),
  E("ibnsihab", "yezidhad", "م س", "Tehzîb 5606"),
  E("ibnsihab", "ebuzubeyrmekki", "—", "Tehzîb 5606"),


  /* Yahyâ b. Ebî Kesîr (o. 129) -- hocalari.
     Tehzîb 6907. Tercemede 57 kayit var, agda dugumu olan 2'i cizildi. */
  E("hafsubeydullahenes", "yahyaebikesir", "خ", "Tehzîb 6907"),
  E("muhammedsevban", "yahyaebikesir", "خ ٤", "Tehzîb 6907"),


  /* Yahyâ b. Ebî Kesîr (o. 129) -- talebeleri.
     Tehzîb 6907. Tercemede 38 kayit var, agda dugumu olan 2'i cizildi. */
  E("yahyaebikesir", "ebansattar", "خت م د ت س", "Tehzîb 6907"),
  E("yahyaebikesir", "harbseddad", "خ م د ت س", "Tehzîb 6907"),


  /* Ebû Zer el-Gıfârî (o. 32) -- talebeleri.
     Tehzîb 7351. Tercemede 64 kayit var, agda dugumu olan 17'i cizildi. */
  E("ebuzer", "ahnef", "خ م", "Tehzîb 7351"),
  E("ebuzer", "enes", "خ م", "Tehzîb 7351"),
  E("ebuzer", "rebihiras", "س", "Tehzîb 7351"),
  E("ebuzer", "zirhubeys", "ق", "Tehzîb 7351"),
  E("ebuzer", "zeydvehb", "خ م د ت س", "Tehzîb 7351"),
  E("ebuzer", "saidmusayyeb", "ق", "Tehzîb 7351"),
  E("ebuzer", "selemeekva", "—", "Tehzîb 7351"),
  E("ebuzer", "suveydgafle", "—", "Tehzîb 7351"),
  E("ebuzer", "sehrhavseb", "ق", "Tehzîb 7351"),
  E("ebuzer", "abdullahsakik", "م ت", "Tehzîb 7351"),
  E("ebuzer", "ibnabbas", "خ م", "Tehzîb 7351"),
  E("ebuzer", "ibnebileyla", "س ق", "Tehzîb 7351"),
  E("ebuzer", "ubeydumeyr", "د", "Tehzîb 7351"),
  E("ebuzer", "amrmeymun", "سي", "Tehzîb 7351"),
  E("ebuzer", "mearrursuveyd", "ع", "Tehzîb 7351"),
  E("ebuzer", "musatalha", "ت س", "Tehzîb 7351"),
  E("ebuzer", "ebuidrishavlani", "م ت ق", "Tehzîb 7351"),


  /* Selmân-ı Fârisî (o. 36) -- talebeleri.
     Tehzîb 2438. Tercemede 27 kayit var, agda dugumu olan 10'i cizildi. */
  E("selmanfarisi", "enes", "ق", "Tehzîb 2438"),
  E("selmanfarisi", "harisemudarrib", "بخ", "Tehzîb 2438"),
  E("selmanfarisi", "ebuzabyan", "ت", "Tehzîb 2438"),
  E("selmanfarisi", "zadan", "—", "Tehzîb 2438"),
  E("selmanfarisi", "ebusaid", "—", "Tehzîb 2438"),
  E("selmanfarisi", "tariksihab", "—", "Tehzîb 2438"),
  E("selmanfarisi", "ebutufeyl", "—", "Tehzîb 2438"),
  E("selmanfarisi", "ibnabbas", "—", "Tehzîb 2438"),
  E("selmanfarisi", "abdrahmanyezidnehai", "م ٤", "Tehzîb 2438"),
  E("selmanfarisi", "alkame", "—", "Tehzîb 2438"),


  /* Ubâde b. es-Sâmit (o. 34) -- talebeleri.
     Tehzîb 3107. Tercemede 44 kayit var, agda dugumu olan 5'i cizildi. */
  E("ubadesamit", "enes", "خ م د ت س", "Tehzîb 3107"),
  E("ubadesamit", "cabir", "—", "Tehzîb 3107"),
  E("ubadesamit", "ebuumame", "ت س ق", "Tehzîb 3107"),
  E("ubadesamit", "sabi", "س", "Tehzîb 3107"),
  E("ubadesamit", "ebuidrishavlani", "خ م ت س", "Tehzîb 3107"),


  /* Ebû Eyyûb el-Ensârî (o. 52) -- hocalari.
     Tehzîb 1612. Tercemede 1 kayit var, agda dugumu olan 1'i cizildi. */
  E("ubey", "ebueyyub", "خ م", "Tehzîb 1612"),


  /* Ebû Eyyûb el-Ensârî (o. 52) -- talebeleri.
     Tehzîb 1612. Tercemede 51 kayit var, agda dugumu olan 15'i cizildi. */
  E("ebueyyub", "esvedyezid", "—", "Tehzîb 1612"),
  E("ebueyyub", "bera", "خ م س", "Tehzîb 1612"),
  E("ebueyyub", "cabirsemura", "م س", "Tehzîb 1612"),
  E("ebueyyub", "zeydhalid", "—", "Tehzîb 1612"),
  E("ebueyyub", "salimibnomer", "—", "Tehzîb 1612"),
  E("ebueyyub", "saidmusayyeb", "—", "Tehzîb 1612"),
  E("ebueyyub", "ibnabbas", "—", "Tehzîb 1612"),
  E("ebueyyub", "abdullahkab", "—", "Tehzîb 1612"),
  E("ebueyyub", "ibnebileyla", "خ م ت س", "Tehzîb 1612"),
  E("ebueyyub", "urve", "خ م", "Tehzîb 1612"),
  E("ebueyyub", "alkame", "—", "Tehzîb 1612"),
  E("ebueyyub", "amrmeymun", "س", "Tehzîb 1612"),
  E("ebueyyub", "ibnmunkedir", "س", "Tehzîb 1612"),
  E("ebueyyub", "musatalha", "خ م ت س", "Tehzîb 1612"),
  E("ebueyyub", "ebuselemeavf", "خ ت س", "Tehzîb 1612"),


  /* Ebû Katâde el-Ensârî (o. 54) -- hocalari.
     Tehzîb 7574. Tercemede 2 kayit var, agda dugumu olan 2'i cizildi. */
  E("omer", "ebukatade", "س", "Tehzîb 7574"),
  E("muazcebel", "ebukatade", "—", "Tehzîb 7574"),


  /* Ebû Katâde el-Ensârî (o. 54) -- talebeleri.
     Tehzîb 7574. Tercemede 26 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebukatade", "enes", "ق", "Tehzîb 7574"),
  E("ebukatade", "cabir", "ت", "Tehzîb 7574"),
  E("ebukatade", "saidmusayyeb", "ق", "Tehzîb 7574"),
  E("ebukatade", "ammarebiammar", "د س", "Tehzîb 7574"),
  E("ebukatade", "ibnsirin", "ت ق", "Tehzîb 7574"),
  E("ebukatade", "ibnmunkedir", "س", "Tehzîb 7574"),
  E("ebukatade", "ebusaid", "م", "Tehzîb 7574"),
  E("ebukatade", "ebuselemeavf", "ع", "Tehzîb 7574"),


  /* Ebû Bekre es-Sekafî (o. 52) -- talebeleri.
     Tehzîb 6465. Tercemede 17 kayit var, agda dugumu olan 5'i cizildi. */
  E("ebubekre", "ibrahimavf", "—", "Tehzîb 6465"),
  E("ebubekre", "ahnef", "خ م د س", "Tehzîb 6465"),
  E("ebubekre", "hasanbasri", "خ ٤", "Tehzîb 6465"),
  E("ebubekre", "rebihiras", "م س", "Tehzîb 6465"),
  E("ebubekre", "ibnsirin", "د س", "Tehzîb 6465"),


  /* Vâsile b. el-Eska‘ (o. 85) -- hocalari.
     Tehzîb 6659. Tercemede 3 kayit var, agda dugumu olan 2'i cizildi. */
  E("ebuhureyre", "vasile", "ق", "Tehzîb 6659"),
  E("ummuseleme", "vasile", "—", "Tehzîb 6659"),


  /* Vâsile b. el-Eska‘ (o. 85) -- talebeleri.
     Tehzîb 6659. Tercemede 18 kayit var, agda dugumu olan 4'i cizildi. */
  E("vasile", "ibrahimebiable", "—", "Tehzîb 6659"),
  E("vasile", "saddadebuammar", "م ت س", "Tehzîb 6659"),
  E("vasile", "mekhul", "بخ ت ق", "Tehzîb 6659"),
  E("vasile", "ebuidrishavlani", "م ت", "Tehzîb 6659"),


  /* Ümmü Seleme (o. 59) -- hocalari.
     Tehzîb 7941. Tercemede 2 kayit var, agda dugumu olan 1'i cizildi. */
  E("fatima", "ummuseleme", "ت", "Tehzîb 7941"),


  /* Ümmü Seleme (o. 59) -- talebeleri.
     Tehzîb 7941. Tercemede 70 kayit var, agda dugumu olan 23'i cizildi. */
  E("ummuseleme", "usame", "خ", "Tehzîb 7941"),
  E("ummuseleme", "esvedyezid", "س", "Tehzîb 7941"),
  E("ummuseleme", "habibebisabit", "ق", "Tehzîb 7941"),
  E("ummuseleme", "humeydavf", "م", "Tehzîb 7941"),
  E("ummuseleme", "saidmusayyeb", "م ٤", "Tehzîb 7941"),
  E("ummuseleme", "suleymanyesar", "م د س ق", "Tehzîb 7941"),
  E("ummuseleme", "ebuvail", "م ٤", "Tehzîb 7941"),
  E("ummuseleme", "sehrhavseb", "د ت", "Tehzîb 7941"),
  E("ummuseleme", "sabi", "٤", "Tehzîb 7941"),
  E("ummuseleme", "abdullahsedddad", "س", "Tehzîb 7941"),
  E("ummuseleme", "ibnabbas", "س", "Tehzîb 7941"),
  E("ummuseleme", "ibnebimuleyke", "د ت", "Tehzîb 7941"),
  E("ummuseleme", "abdrahmanharis", "خ س", "Tehzîb 7941"),
  E("ummuseleme", "ubeydullahutbe", "س", "Tehzîb 7941"),
  E("ummuseleme", "ubeydumeyr", "م", "Tehzîb 7941"),
  E("ummuseleme", "urve", "خ س", "Tehzîb 7941"),
  E("ummuseleme", "ataebirebah", "د", "Tehzîb 7941"),
  E("ummuseleme", "kureyb", "خ م د ت س", "Tehzîb 7941"),
  E("ummuseleme", "mucahid", "ت", "Tehzîb 7941"),
  E("ummuseleme", "mesruk", "ق", "Tehzîb 7941"),
  E("ummuseleme", "nafiibnomer", "س ق", "Tehzîb 7941"),
  E("ummuseleme", "ebuselemeavf", "٤", "Tehzîb 7941"),
  E("ummuseleme", "talha", "ت", "Tehzîb 7941"),


  /* Esmâ bint Ebî Bekir (o. 73) -- talebeleri.
     Tehzîb 7780. Tercemede 17 kayit var, agda dugumu olan 4'i cizildi. */
  E("esmaebubekir", "abbadabdullahzubeyr", "م س", "Tehzîb 7780"),
  E("esmaebubekir", "ibnabbas", "م", "Tehzîb 7780"),
  E("esmaebubekir", "ibnebimuleyke", "ع", "Tehzîb 7780"),
  E("esmaebubekir", "ibnzubeyr", "—", "Tehzîb 7780"),


  /* Ukayl b. Hâlid el-Eylî (o. 144) -- hocalari.
     Tehzîb 4001. Tercemede 20 kayit var, agda dugumu olan 12'i cizildi. */
  E("hasanbasri", "ukaylhalid", "—", "Tehzîb 4001"),
  E("zeydeslem", "ukaylhalid", "—", "Tehzîb 4001"),
  E("salimibnomer", "ukaylhalid", "—", "Tehzîb 4001"),
  E("selemekuheyl", "ukaylhalid", "م", "Tehzîb 4001"),
  E("ikrime", "ukaylhalid", "قد", "Tehzîb 4001"),
  E("amrsuayb", "ukaylhalid", "—", "Tehzîb 4001"),
  E("kasimmuhammed", "ukaylhalid", "—", "Tehzîb 4001"),
  E("ibnishak", "ukaylhalid", "—", "Tehzîb 4001"),
  E("ibnsihab", "ukaylhalid", "ع", "Tehzîb 4001"),
  E("nafiibnomer", "ukaylhalid", "ق", "Tehzîb 4001"),
  E("hisamurve", "ukaylhalid", "—", "Tehzîb 4001"),
  E("yahyaebikesir", "ukaylhalid", "—", "Tehzîb 4001"),


  /* Ukayl b. Hâlid el-Eylî (o. 144) -- talebeleri.
     Tehzîb 4001. Tercemede 18 kayit var, agda dugumu olan 3'i cizildi. */
  E("ukaylhalid", "saidebiyyubmisri", "خ", "Tehzîb 4001"),
  E("ukaylhalid", "leysbsad", "ع", "Tehzîb 4001"),
  E("ukaylhalid", "yunusyezid", "—", "Tehzîb 4001"),


  /* Yûnus b. Yezîd el-Eylî (o. 159) -- hocalari.
     Tehzîb 7188. Tercemede 11 kayit var, agda dugumu olan 6'i cizildi. */
  E("ibrahimebiable", "yunusyezid", "—", "Tehzîb 7188"),
  E("ikrime", "yunusyezid", "—", "Tehzîb 7188"),
  E("kasimmuhammed", "yunusyezid", "—", "Tehzîb 7188"),
  E("ibnsihab", "yunusyezid", "ع", "Tehzîb 7188"),
  E("nafiibnomer", "yunusyezid", "خ م د س ق", "Tehzîb 7188"),
  E("hisamurve", "yunusyezid", "د", "Tehzîb 7188"),


  /* Yûnus b. Yezîd el-Eylî (o. 159) -- talebeleri.
     Tehzîb 7188. Tercemede 37 kayit var, agda dugumu olan 10'i cizildi. */
  E("yunusyezid", "enesiyaz", "—", "Tehzîb 7188"),
  E("yunusyezid", "bakiyyevelid", "س ق", "Tehzîb 7188"),
  E("yunusyezid", "cerirhazim", "خ م", "Tehzîb 7188"),
  E("yunusyezid", "suleymanbilal", "خ م س", "Tehzîb 7188"),
  E("yunusyezid", "ibnmubarek", "ع", "Tehzîb 7188"),
  E("yunusyezid", "ibnvehb", "ع", "Tehzîb 7188"),
  E("yunusyezid", "evzai", "—", "Tehzîb 7188"),
  E("yunusyezid", "amrharis", "خ", "Tehzîb 7188"),
  E("yunusyezid", "leysbsad", "خ م", "Tehzîb 7188"),
  E("yunusyezid", "veki", "—", "Tehzîb 7188"),


  /* İbn Ebî Zi’b (o. 159) -- hocalari.
     Tehzîb 5408. Tercemede 50 kayit var, agda dugumu olan 6'i cizildi. */
  E("ikrime", "ibnebizib", "—", "Tehzîb 5408"),
  E("ibnsihab", "ibnebizib", "خ م د س ق", "Tehzîb 5408"),
  E("ibnmunkedir", "ibnebizib", "خ س", "Tehzîb 5408"),
  E("nafiibnomer", "ibnebizib", "خ م ق", "Tehzîb 5408"),
  E("yezidhusayfe", "ibnebizib", "—", "Tehzîb 5408"),
  E("yezidkusayt", "ibnebizib", "خ د ت س", "Tehzîb 5408"),


  /* İbn Ebî Zi’b (o. 159) -- talebeleri.
     Tehzîb 5408. Tercemede 50 kayit var, agda dugumu olan 19'i cizildi. */
  E("ibnebizib", "ademebiiyas", "خ", "Tehzîb 5408"),
  E("ibnebizib", "ruhubade", "—", "Tehzîb 5408"),
  E("ibnebizib", "sadibrahim", "س", "Tehzîb 5408"),
  E("ibnebizib", "sevri", "—", "Tehzîb 5408"),
  E("ibnebizib", "suaybishakdimaski", "د", "Tehzîb 5408"),
  E("ibnebizib", "ebuasimnebil", "س", "Tehzîb 5408"),
  E("ibnebizib", "ibnmubarek", "خ سي", "Tehzîb 5408"),
  E("ibnebizib", "kanebi", "س", "Tehzîb 5408"),
  E("ibnebizib", "ibnnumeyr", "م", "Tehzîb 5408"),
  E("ibnebizib", "ibnvehb", "م س", "Tehzîb 5408"),
  E("ibnebizib", "alicad", "—", "Tehzîb 5408"),
  E("ibnebizib", "ebunuaymfadl", "خ", "Tehzîb 5408"),
  E("ibnebizib", "vakidi", "—", "Tehzîb 5408"),
  E("ibnebizib", "mamer", "—", "Tehzîb 5408"),
  E("ibnebizib", "veki", "م", "Tehzîb 5408"),
  E("ibnebizib", "velidmuslim", "م ق", "Tehzîb 5408"),
  E("ibnebizib", "kattan", "م س", "Tehzîb 5408"),
  E("ibnebizib", "yezidharun", "—", "Tehzîb 5408"),
  E("ibnebizib", "ebubekirayyas", "—", "Tehzîb 5408"),


  /* Humeydî (o. 219) -- hocalari.
     Tehzîb 3270. Tercemede 23 kayit var, agda dugumu olan 12'i cizildi. */
  E("ibrahimsad", "humeydi", "—", "Tehzîb 3270"),
  E("enesiyaz", "humeydi", "—", "Tehzîb 3270"),
  E("bisrbekirtennisi", "humeydi", "خ", "Tehzîb 3270"),
  E("ebuusamehammad", "humeydi", "—", "Tehzîb 3270"),
  E("ibnuyeyne", "humeydi", "خ مق ت س فق", "Tehzîb 3270"),
  E("darevardi", "humeydi", "—", "Tehzîb 3270"),
  E("fudaylibnayaz", "humeydi", "—", "Tehzîb 3270"),
  E("safii", "humeydi", "د", "Tehzîb 3270"),
  E("mervanfezari", "humeydi", "خ ت", "Tehzîb 3270"),
  E("veki", "humeydi", "خ", "Tehzîb 3270"),
  E("velidmuslim", "humeydi", "خ", "Tehzîb 3270"),
  E("yalaubeyd", "humeydi", "—", "Tehzîb 3270"),


  /* Humeydî (o. 219) -- talebeleri.
     Tehzîb 3270. Tercemede 21 kayit var, agda dugumu olan 4'i cizildi. */
  E("humeydi", "buhari", "ت", "Tehzîb 3270"),
  E("humeydi", "ebuzuraraazi", "—", "Tehzîb 3270"),
  E("humeydi", "ebuhatimrazi", "—", "Tehzîb 3270"),
  E("humeydi", "zuhli", "ت س", "Tehzîb 3270"),


  /* Süleymân b. Harb (o. 224) -- hocalari.
     Tehzîb 2502. Tercemede 19 kayit var, agda dugumu olan 8'i cizildi. */
  E("cerirhazim", "suleymanharb", "—", "Tehzîb 2502"),
  E("hammadzeyd", "suleymanharb", "ع", "Tehzîb 2502"),
  E("hammadseleme", "suleymanharb", "ع", "Tehzîb 2502"),
  E("serieyyahya", "suleymanharb", "—", "Tehzîb 2502"),
  E("suleymanmugire", "suleymanharb", "—", "Tehzîb 2502"),
  E("sallamebimuti", "suleymanharb", "مق", "Tehzîb 2502"),
  E("sube", "suleymanharb", "خ د س", "Tehzîb 2502"),
  E("vuheybhalid", "suleymanharb", "خ", "Tehzîb 2502"),


  /* Süleymân b. Harb (o. 224) -- talebeleri.
     Tehzîb 2502. Tercemede 46 kayit var, agda dugumu olan 16'i cizildi. */
  E("suleymanharb", "buhari", "ت", "Tehzîb 2502"),
  E("suleymanharb", "ebudavud", "—", "Tehzîb 2502"),
  E("suleymanharb", "bh03", "—", "Tehzîb 2502"),
  E("suleymanharb", "ahmeddevraki", "مق", "Tehzîb 2502"),
  E("suleymanharb", "ahmedhanbel", "—", "Tehzîb 2502"),
  E("suleymanharb", "ibnrahuye", "م س", "Tehzîb 2502"),
  E("suleymanharb", "hasanaliayyal", "د ت", "Tehzîb 2502"),
  E("suleymanharb", "humeydi", "—", "Tehzîb 2502"),
  E("suleymanharb", "darimi", "ت", "Tehzîb 2502"),
  E("suleymanharb", "ibnebiseybe", "م", "Tehzîb 2502"),
  E("suleymanharb", "abdhumeyd", "ت", "Tehzîb 2502"),
  E("suleymanharb", "ebuzuraraazi", "—", "Tehzîb 2502"),
  E("suleymanharb", "osmanebiseybe", "—", "Tehzîb 2502"),
  E("suleymanharb", "ebuhatimrazi", "—", "Tehzîb 2502"),
  E("suleymanharb", "zuhli", "ق", "Tehzîb 2502"),
  E("suleymanharb", "kattan", "—", "Tehzîb 2502"),


  /* Ebû Bekir b. Abdirrahman (o. 94) -- hocalari.
     Tehzîb 7243. Tercemede 14 kayit var, agda dugumu olan 5'i cizildi. */
  E("abdrahmanharis", "ebubekirabdrahman", "خ س", "Tehzîb 7243"),
  E("abdrahmanesved", "ebubekirabdrahman", "خ م", "Tehzîb 7243"),
  E("mervan", "ebubekirabdrahman", "خ د ق", "Tehzîb 7243"),
  E("ebuhureyre", "ebubekirabdrahman", "ع", "Tehzîb 7243"),
  E("ummuseleme", "ebubekirabdrahman", "ع", "Tehzîb 7243"),


  /* Ebû Bekir b. Abdirrahman (o. 94) -- talebeleri.
     Tehzîb 7243. Tercemede 24 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebubekirabdrahman", "cameseddad", "س", "Tehzîb 7243"),
  E("ebubekirabdrahman", "hakemuteybe", "س", "Tehzîb 7243"),
  E("ebubekirabdrahman", "sabi", "س", "Tehzîb 7243"),
  E("ebubekirabdrahman", "ikrimehalid", "س", "Tehzîb 7243"),
  E("ebubekirabdrahman", "amrdinar", "—", "Tehzîb 7243"),
  E("ebubekirabdrahman", "mucahid", "س", "Tehzîb 7243"),
  E("ebubekirabdrahman", "ibnsihab", "ع", "Tehzîb 7243"),
  E("ebubekirabdrahman", "yezidkusayt", "—", "Tehzîb 7243"),


  /* Ebû Vâil Şakīk b. Seleme (o. 82) -- hocalari.
     Tehzîb 2767. Tercemede 43 kayit var, agda dugumu olan 14'i cizildi. */
  E("usame", "ebuvail", "م", "Tehzîb 2767"),
  E("esaskays", "ebuvail", "ع", "Tehzîb 2767"),
  E("bera", "ebuvail", "—", "Tehzîb 2767"),
  E("huzeyfe", "ebuvail", "ع", "Tehzîb 2767"),
  E("hamranaban", "ebuvail", "ق", "Tehzîb 2767"),
  E("sadvakkas", "ebuvail", "—", "Tehzîb 2767"),
  E("ibnzubeyr", "ebuvail", "—", "Tehzîb 2767"),
  E("ibnabbas", "ebuvail", "—", "Tehzîb 2767"),
  E("ibnomer", "ebuvail", "—", "Tehzîb 2767"),
  E("ibnmesud", "ebuvail", "ع", "Tehzîb 2767"),
  E("omer", "ebuvail", "—", "Tehzîb 2767"),
  E("mugirasube", "ebuvail", "ق", "Tehzîb 2767"),
  E("ebusaid", "ebuvail", "ت", "Tehzîb 2767"),
  E("ebumusa", "ebuvail", "ع", "Tehzîb 2767"),


  /* Ebû Vâil Şakīk b. Seleme (o. 82) -- talebeleri.
     Tehzîb 2767. Tercemede 37 kayit var, agda dugumu olan 19'i cizildi. */
  E("ebuvail", "habibebisabit", "خ م س", "Tehzîb 2767"),
  E("ebuvail", "husaynabdrahman", "خ م د س ق", "Tehzîb 2767"),
  E("ebuvail", "hakemuteybe", "س", "Tehzîb 2767"),
  E("ebuvail", "hammadebisuleyman", "ت س ق", "Tehzîb 2767"),
  E("ebuvail", "zubeydyami", "خ م ت س", "Tehzîb 2767"),
  E("ebuvail", "zubeyradi", "س", "Tehzîb 2767"),
  E("ebuvail", "saidmesrukhsevri", "—", "Tehzîb 2767"),
  E("ebuvail", "selemekuheyl", "—", "Tehzîb 2767"),
  E("ebuvail", "amess", "ع", "Tehzîb 2767"),
  E("ebuvail", "siyarebilhakem", "د ت", "Tehzîb 2767"),
  E("ebuvail", "asimbehdele", "بخ ٤", "Tehzîb 2767"),
  E("ebuvail", "sabi", "—", "Tehzîb 2767"),
  E("ebuvail", "abdelubabe", "م سي ق", "Tehzîb 2767"),
  E("ebuvail", "ebuhasin", "خ م س", "Tehzîb 2767"),
  E("ebuvail", "ataisaib", "ق", "Tehzîb 2767"),
  E("ebuvail", "ebuishaksebii", "—", "Tehzîb 2767"),
  E("ebuvail", "muhammedsuka", "—", "Tehzîb 2767"),
  E("ebuvail", "mugirmiksem", "خ م س", "Tehzîb 2767"),
  E("ebuvail", "mansurmutemir", "ع", "Tehzîb 2767"),


  /* Abdullah b. Vehb (o. 197) -- talebeleri.
     Tehzîb 3645. Tercemede 75 kayit var, agda dugumu olan 8'i cizildi. */
  E("ibnvehb", "ibrahimmunzirhizami", "كن ق", "Tehzîb 3645"),
  E("ibnvehb", "ahmedsalihmisri", "خ د تم", "Tehzîb 3645"),
  E("ibnvehb", "harmalayahya", "م س ق", "Tehzîb 3645"),
  E("ibnvehb", "said_mansur", "م د", "Tehzîb 3645"),
  E("ibnvehb", "alimedini", "—", "Tehzîb 3645"),
  E("ibnvehb", "kuteybesaid", "٤", "Tehzîb 3645"),
  E("ibnvehb", "harunmaruf", "خ د", "Tehzîb 3645"),
  E("ibnvehb", "yahyayahyanisaburi", "م", "Tehzîb 3645"),


  /* Muhammed b. Ca‘fer Günder (o. 193) -- talebeleri.
     Tehzîb 5120. Tercemede 34 kayit var, agda dugumu olan 15'i cizildi. */
  E("gunder", "ahmedhanbel", "م د س ق", "Tehzîb 5120"),
  E("gunder", "ibnrahuye", "خ", "Tehzîb 5120"),
  E("gunder", "zuheyrharb", "—", "Tehzîb 5120"),
  E("gunder", "ibnebiseybe", "م", "Tehzîb 5120"),
  E("gunder", "kavariri", "د", "Tehzîb 5120"),
  E("gunder", "osmanebiseybe", "—", "Tehzîb 5120"),
  E("gunder", "alimedini", "خ", "Tehzîb 5120"),
  E("gunder", "amrbnalisayrafi", "م س", "Tehzîb 5120"),
  E("gunder", "kuteybesaid", "ت س", "Tehzîb 5120"),
  E("gunder", "bundar", "خ", "Tehzîb 5120"),
  E("gunder", "ibnmusenna", "بخ", "Tehzîb 5120"),
  E("gunder", "misned", "—", "Tehzîb 5120"),
  E("gunder", "nasralicehdami", "—", "Tehzîb 5120"),
  E("gunder", "ibnmain", "خ م", "Tehzîb 5120"),
  E("gunder", "yakubdevraki", "س", "Tehzîb 5120"),


  /* Hafs b. Giyâs (o. 194) -- talebeleri.
     Tehzîb 1415. Tercemede 58 kayit var, agda dugumu olan 18'i cizildi. */
  E("hafsgiyas", "ahmeddevraki", "مد", "Tehzîb 1415"),
  E("hafsgiyas", "ahmedhanbel", "—", "Tehzîb 1415"),
  E("hafsgiyas", "ibnrahuye", "خ م", "Tehzîb 1415"),
  E("hafsgiyas", "hasanarafe", "—", "Tehzîb 1415"),
  E("hafsgiyas", "zuheyrharb", "م", "Tehzîb 1415"),
  E("hafsgiyas", "ibnebiseybe", "م ق", "Tehzîb 1415"),
  E("hafsgiyas", "affanmuslim", "—", "Tehzîb 1415"),
  E("hafsgiyas", "alimedini", "—", "Tehzîb 1415"),
  E("hafsgiyas", "amrnakid", "م", "Tehzîb 1415"),
  E("hafsgiyas", "ebunuaymfadl", "—", "Tehzîb 1415"),
  E("hafsgiyas", "kuteybesaid", "ت س", "Tehzîb 1415"),
  E("hafsgiyas", "muhammedubeydmuharibi", "س", "Tehzîb 1415"),
  E("hafsgiyas", "ebukureyb", "م د ت", "Tehzîb 1415"),
  E("hafsgiyas", "ibnmusenna", "م س", "Tehzîb 1415"),
  E("hafsgiyas", "hennadseri", "—", "Tehzîb 1415"),
  E("hafsgiyas", "ibnmain", "د س", "Tehzîb 1415"),
  E("hafsgiyas", "yahyayahyanisaburi", "م", "Tehzîb 1415"),
  E("hafsgiyas", "yakubdevraki", "س", "Tehzîb 1415"),


  /* Abdullah b. Nümeyr (o. 199) -- talebeleri.
     Tehzîb 3618. Tercemede 48 kayit var, agda dugumu olan 13'i cizildi. */
  E("ibnnumeyr", "ahmedhanbel", "م د س", "Tehzîb 3618"),
  E("ibnnumeyr", "ishakkevsec", "ت ق", "Tehzîb 3618"),
  E("ibnnumeyr", "hasanaliayyal", "د ت", "Tehzîb 3618"),
  E("ibnnumeyr", "zuheyrharb", "م", "Tehzîb 3618"),
  E("ibnnumeyr", "ibnebiseybe", "م د عس ق", "Tehzîb 3618"),
  E("ibnnumeyr", "osmanebiseybe", "د س", "Tehzîb 3618"),
  E("ibnnumeyr", "alimedini", "—", "Tehzîb 3618"),
  E("ibnnumeyr", "amrbnalisayrafi", "س", "Tehzîb 3618"),
  E("ibnnumeyr", "ebukureyb", "م ت", "Tehzîb 3618"),
  E("ibnnumeyr", "ibnmusenna", "م", "Tehzîb 3618"),
  E("ibnnumeyr", "hennadseri", "د", "Tehzîb 3618"),
  E("ibnnumeyr", "ibnmain", "—", "Tehzîb 3618"),
  E("ibnnumeyr", "yahyayahyanisaburi", "م", "Tehzîb 3618"),


  /* Yezîd b. Zürey‘ (o. 182) -- talebeleri.
     Tehzîb 6987. Tercemede 63 kayit var, agda dugumu olan 17'i cizildi. */
  E("yezidzurey", "haccacminhal", "—", "Tehzîb 6987"),
  E("yezidzurey", "suveydsaidhadesani", "ق", "Tehzîb 6987"),
  E("yezidzurey", "abdan", "خ", "Tehzîb 6987"),
  E("yezidzurey", "ibnmubarek", "—", "Tehzîb 6987"),
  E("yezidzurey", "ibnmehdi", "—", "Tehzîb 6987"),
  E("yezidzurey", "kavariri", "م", "Tehzîb 6987"),
  E("yezidzurey", "affanmuslim", "س", "Tehzîb 6987"),
  E("yezidzurey", "alimedini", "خ", "Tehzîb 6987"),
  E("yezidzurey", "amrbnalisayrafi", "ت س", "Tehzîb 6987"),
  E("yezidzurey", "kuteybesaid", "خ م س", "Tehzîb 6987"),
  E("yezidzurey", "bundar", "—", "Tehzîb 6987"),
  E("yezidzurey", "muhammedabdulalasanani", "ت س", "Tehzîb 6987"),
  E("yezidzurey", "muhammedisataba", "د", "Tehzîb 6987"),
  E("yezidzurey", "ibnmusenna", "—", "Tehzîb 6987"),
  E("yezidzurey", "misned", "خ د", "Tehzîb 6987"),
  E("yezidzurey", "nasralicehdami", "م د ت ق", "Tehzîb 6987"),
  E("yezidzurey", "yahyayahyanisaburi", "م", "Tehzîb 6987"),


  /* Nadr b. Şümeyl (o. 204) -- talebeleri.
     Tehzîb 6421. Tercemede 50 kayit var, agda dugumu olan 8'i cizildi. */
  E("nadrsumeyl", "ibnrahuye", "خ م س", "Tehzîb 6421"),
  E("nadrsumeyl", "ishakkevsec", "خ م س ق", "Tehzîb 6421"),
  E("nadrsumeyl", "darimi", "د", "Tehzîb 6421"),
  E("nadrsumeyl", "alimedini", "—", "Tehzîb 6421"),
  E("nadrsumeyl", "muhammedrafi", "—", "Tehzîb 6421"),
  E("nadrsumeyl", "mahmudgaylan", "خ م ت س", "Tehzîb 6421"),
  E("nadrsumeyl", "ibnmain", "—", "Tehzîb 6421"),
  E("nadrsumeyl", "yahyayahyanisaburi", "—", "Tehzîb 6421"),


  /* Âsım b. Behdele (o. 128) -- hocalari.
     Tehzîb 3002. Tercemede 20 kayit var, agda dugumu olan 8'i cizildi. */
  E("humeydtavil", "asimbehdele", "س", "Tehzîb 3002"),
  E("hayseme", "asimbehdele", "—", "Tehzîb 3002"),
  E("zirhubeys", "asimbehdele", "ع", "Tehzîb 3002"),
  E("sehrhavseb", "asimbehdele", "سي ق", "Tehzîb 3002"),
  E("ebuabdrahmansulemi", "asimbehdele", "مق", "Tehzîb 3002"),
  E("ikrime", "asimbehdele", "د", "Tehzîb 3002"),
  E("ebuduha", "asimbehdele", "—", "Tehzîb 3002"),
  E("mearrursuveyd", "asimbehdele", "—", "Tehzîb 3002"),


  /* Abdülmelik b. Umeyr (o. 136) -- hocalari.
     Tehzîb 3546. Tercemede 48 kayit var, agda dugumu olan 13'i cizildi. */
  E("esaskays", "abdulmelikumeyr", "—", "Tehzîb 3546"),
  E("cabirsemura", "abdulmelikumeyr", "خ م س", "Tehzîb 3546"),
  E("cerirbecelî", "abdulmelikumeyr", "—", "Tehzîb 3546"),
  E("rebihiras", "abdulmelikumeyr", "خ م د ت ق", "Tehzîb 3546"),
  E("ibnzubeyr", "abdulmelikumeyr", "س", "Tehzîb 3546"),
  E("ibnebileyla", "abdulmelikumeyr", "م سي", "Tehzîb 3546"),
  E("amrhurays", "abdulmelikumeyr", "خ م ت س ق", "Tehzîb 3546"),
  E("amrmeymun", "abdulmelikumeyr", "خ ت س", "Tehzîb 3546"),
  E("kazaayahya", "abdulmelikumeyr", "خ م ت ق", "Tehzîb 3546"),
  E("mugirasube", "abdulmelikumeyr", "—", "Tehzîb 3546"),
  E("musatalha", "abdulmelikumeyr", "م ت ص", "Tehzîb 3546"),
  E("numanbesir", "abdulmelikumeyr", "—", "Tehzîb 3546"),
  E("ebuselemeavf", "abdulmelikumeyr", "م ٤", "Tehzîb 3546"),


  /* Fudayl b. İyâz (o. 187) -- hocalari.
     Tehzîb 4763. Tercemede 37 kayit var, agda dugumu olan 22'i cizildi. */
  E("ismailebihalid", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("beyanbisr", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("caferisadik", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("hasanubeydullah", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("husaynabdrahman", "fudaylibnayaz", "د س", "Tehzîb 4763"),
  E("humeydtavil", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("ziyadsad", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("sevri", "fudaylibnayaz", "س", "Tehzîb 4763"),
  E("amess", "fudaylibnayaz", "بخ م س", "Tehzîb 4763"),
  E("suleymanteymi", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("ubeydullahomeri", "fudaylibnayaz", "س", "Tehzîb 4763"),
  E("ataisaib", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("avfarabi", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("fitrhalife", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("leysebisuleym", "fudaylibnayaz", "ت", "Tehzîb 4763"),
  E("mucalidsaid", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("ibnishak", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("muhammedacilan", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("mansurmutemir", "fudaylibnayaz", "خ م ت س", "Tehzîb 4763"),
  E("hisamhassan", "fudaylibnayaz", "ر م ت س", "Tehzîb 4763"),
  E("yahyasaidensari", "fudaylibnayaz", "—", "Tehzîb 4763"),
  E("ismailebiislamsibani", "fudaylibnayaz", "—", "Tehzîb 4763"),


  /* Ebû Muâviye ed-Darîr (o. 195) -- hocalari.
     Tehzîb 5173. Tercemede 48 kayit var, agda dugumu olan 22'i cizildi. */
  E("ibrahimtahman", "ebumuaviyedarir", "—", "Tehzîb 5173"),
  E("ismailebihalid", "ebumuaviyedarir", "م", "Tehzîb 5173"),
  E("ebuburde", "ebumuaviyedarir", "خ م ت ق", "Tehzîb 5173"),
  E("caferburkan", "ebumuaviyedarir", "د ق", "Tehzîb 5173"),
  E("haccacertat", "ebumuaviyedarir", "ت س ق", "Tehzîb 5173"),
  E("hasanamrfukaymi", "ebumuaviyedarir", "د ق", "Tehzîb 5173"),
  E("davudebihind", "ebumuaviyedarir", "خت م", "Tehzîb 5173"),
  E("sadsaidensari", "ebumuaviyedarir", "مدت", "Tehzîb 5173"),
  E("amess", "ebumuaviyedarir", "ع", "Tehzîb 5173"),
  E("suheylebisalih", "ebumuaviyedarir", "م", "Tehzîb 5173"),
  E("sube", "ebumuaviyedarir", "—", "Tehzîb 5173"),
  E("asimahvel", "ebumuaviyedarir", "م ت س ق", "Tehzîb 5173"),
  E("ubeydullahomeri", "ebumuaviyedarir", "د س ق", "Tehzîb 5173"),
  E("amrmeymunmihran", "ebumuaviyedarir", "ت", "Tehzîb 5173"),
  E("leysebisuleym", "ebumuaviyedarir", "—", "Tehzîb 5173"),
  E("malikmigvel", "ebumuaviyedarir", "س", "Tehzîb 5173"),
  E("muhammedsuka", "ebumuaviyedarir", "ت ق", "Tehzîb 5173"),
  E("hisamhassan", "ebumuaviyedarir", "م", "Tehzîb 5173"),
  E("hisamurve", "ebumuaviyedarir", "ع", "Tehzîb 5173"),
  E("yahyasaidensari", "ebumuaviyedarir", "م د ت", "Tehzîb 5173"),
  E("ismailebiislamsibani", "ebumuaviyedarir", "—", "Tehzîb 5173"),
  E("ebumalikesceyi", "ebumuaviyedarir", "م د ق", "Tehzîb 5173"),


  /* Leys b. Ebî Süleym (o. 143) -- hocalari.
     Tehzîb 5017. Tercemede 32 kayit var, agda dugumu olan 14'i cizildi. */
  E("rebiuenes", "leysebisuleym", "ت", "Tehzîb 5017"),
  E("sehrhavseb", "leysebisuleym", "ت ق", "Tehzîb 5017"),
  E("safvanmuhriz", "leysebisuleym", "—", "Tehzîb 5017"),
  E("tavus", "leysebisuleym", "بخ ت ق", "Tehzîb 5017"),
  E("sabi", "leysebisuleym", "—", "Tehzîb 5017"),
  E("ibnebimuleyke", "leysebisuleym", "—", "Tehzîb 5017"),
  E("abdrahmanesved", "leysebisuleym", "ي", "Tehzîb 5017"),
  E("ubeydullahomeri2", "leysebisuleym", "دت", "Tehzîb 5017"),
  E("ataebirebah", "leysebisuleym", "ي س ق", "Tehzîb 5017"),
  E("ikrime", "leysebisuleym", "ت ق", "Tehzîb 5017"),
  E("mucahid", "leysebisuleym", "خت", "Tehzîb 5017"),
  E("nafiibnomer", "leysebisuleym", "خت ت ق", "Tehzîb 5017"),
  E("ebuishaksebii", "leysebisuleym", "سي", "Tehzîb 5017"),
  E("ebuzubeyrmekki", "leysebisuleym", "ت سي ق", "Tehzîb 5017"),


  /* Câbir b. Zeyd Ebû’ş-Şa‘sâ (o. 93) -- hocalari.
     Tehzîb 866. Tercemede 6 kayit var, agda dugumu olan 4'i cizildi. */
  E("ibnzubeyr", "cabirzeyd", "خت", "Tehzîb 866"),
  E("ibnabbas", "cabirzeyd", "ع", "Tehzîb 866"),
  E("ibnomer", "cabirzeyd", "—", "Tehzîb 866"),
  E("ikrime", "cabirzeyd", "—", "Tehzîb 866"),


  /* Câbir b. Zeyd Ebû’ş-Şa‘sâ (o. 93) -- talebeleri.
     Tehzîb 866. Tercemede 20 kayit var, agda dugumu olan 1'i cizildi. */
  E("cabirzeyd", "eyyubsahtiyani", "—", "Tehzîb 866"),


  /* İsmâîl es-Süddî (o. 127) -- hocalari.
     Tehzîb 462. Tercemede 24 kayit var, agda dugumu olan 6'i cizildi. */
  E("enes", "suddi", "م ت عس", "Tehzîb 462"),
  E("sadubeyde", "suddi", "م ت س", "Tehzîb 462"),
  E("ibnabbas", "suddi", "د", "Tehzîb 462"),
  E("abdhayr", "suddi", "عس", "Tehzîb 462"),
  E("ataebirebah", "suddi", "—", "Tehzîb 462"),
  E("ikrime", "suddi", "—", "Tehzîb 462"),


  /* Hüseyin b. Ali (o. 61) -- talebeleri.
     Tehzîb 1323. Tercemede 18 kayit var, agda dugumu olan 4'i cizildi. */
  E("huseyn", "hasanbali", "تم", "Tehzîb 1323"),
  E("huseyn", "sabi", "—", "Tehzîb 1323"),
  E("huseyn", "ikrime", "—", "Tehzîb 1323"),
  E("huseyn", "zeynelabidin", "ع", "Tehzîb 1323"),


  /* Abdurrahman b. Avf (o. 32) -- talebeleri.
     Tehzîb 3923. Tercemede 22 kayit var, agda dugumu olan 8'i cizildi. */
  E("abdrahmanavf", "ibrahimavf", "خ م ق", "Tehzîb 3923"),
  E("abdrahmanavf", "enes", "م س", "Tehzîb 3923"),
  E("abdrahmanavf", "cabir", "—", "Tehzîb 3923"),
  E("abdrahmanavf", "humeydavf", "ت س", "Tehzîb 3923"),
  E("abdrahmanavf", "ibnabbas", "خ م د ت ق", "Tehzîb 3923"),
  E("abdrahmanavf", "ibnomer", "—", "Tehzîb 3923"),
  E("abdrahmanavf", "malikevs", "م", "Tehzîb 3923"),
  E("abdrahmanavf", "ebuselemeavf", "٤", "Tehzîb 3923"),


  /* Târık b. Şihâb el-Ahmesî (o. 83) -- talebeleri.
     Tehzîb 2950. Tercemede 14 kayit var, agda dugumu olan 3'i cizildi. */
  E("tariksihab", "ismailebihalid", "س", "Tehzîb 2950"),
  E("tariksihab", "simakharb", "—", "Tehzîb 2950"),
  E("tariksihab", "siyarebilhakem", "بخ د ت ق", "Tehzîb 2950"),


  /* Târık b. Şihâb el-Ahmesî (o. 83) -- hocalari.
     Tehzîb 2950. Tercemede 15 kayit var, agda dugumu olan 7'i cizildi. */
  E("huzeyfe", "tariksihab", "—", "Tehzîb 2950"),
  E("halidvelid", "tariksihab", "—", "Tehzîb 2950"),
  E("sadvakkas", "tariksihab", "—", "Tehzîb 2950"),
  E("ibnmesud", "tariksihab", "خ ٤", "Tehzîb 2950"),
  E("mikdad", "tariksihab", "—", "Tehzîb 2950"),
  E("ebusaid", "tariksihab", "م ٤", "Tehzîb 2950"),
  E("ebumusa", "tariksihab", "خ م س", "Tehzîb 2950"),


  /* Zeyd b. Vehb el-Cühenî (o. 83) -- talebeleri.
     Tehzîb 2131. Tercemede 26 kayit var, agda dugumu olan 11'i cizildi. */
  E("zeydvehb", "ismailebihalid", "خ", "Tehzîb 2131"),
  E("zeydvehb", "habibebisabit", "خ ت", "Tehzîb 2131"),
  E("zeydvehb", "hasanubeydullah", "سي", "Tehzîb 2131"),
  E("zeydvehb", "husaynabdrahman", "خ د س ق", "Tehzîb 2131"),
  E("zeydvehb", "hakemuteybe", "—", "Tehzîb 2131"),
  E("zeydvehb", "hammadebisuleyman", "بخ د سي", "Tehzîb 2131"),
  E("zeydvehb", "selemekuheyl", "م د س", "Tehzîb 2131"),
  E("zeydvehb", "amess", "ع", "Tehzîb 2131"),
  E("zeydvehb", "ebuishaksebii", "—", "Tehzîb 2131"),
  E("zeydvehb", "mansurmutemir", "—", "Tehzîb 2131"),
  E("zeydvehb", "musacuheni", "ق", "Tehzîb 2131"),


  /* Zeyd b. Vehb el-Cühenî (o. 83) -- hocalari.
     Tehzîb 2131. Tercemede 16 kayit var, agda dugumu olan 7'i cizildi. */
  E("bera", "zeydvehb", "س", "Tehzîb 2131"),
  E("huzeyfe", "zeydvehb", "خ م ت س ق", "Tehzîb 2131"),
  E("zeydarkam", "zeydvehb", "—", "Tehzîb 2131"),
  E("ibnmesud", "zeydvehb", "ع", "Tehzîb 2131"),
  E("osman", "zeydvehb", "—", "Tehzîb 2131"),
  E("omer", "zeydvehb", "—", "Tehzîb 2131"),
  E("ebumusa", "zeydvehb", "م", "Tehzîb 2131"),


  /* Süleymân b. Bilâl (o. 172) -- talebeleri.
     Tehzîb 2496. Tercemede 24 kayit var, agda dugumu olan 6'i cizildi. */
  E("suleymanbilal", "ibnebiuveys", "خ م د ت ق", "Tehzîb 2496"),
  E("suleymanbilal", "ibnmubarek", "—", "Tehzîb 2496"),
  E("suleymanbilal", "kanebi", "م د س", "Tehzîb 2496"),
  E("suleymanbilal", "ibnvehb", "م د س ق", "Tehzîb 2496"),
  E("suleymanbilal", "mafairan", "س", "Tehzîb 2496"),
  E("suleymanbilal", "yahyayahyanisaburi", "خ م", "Tehzîb 2496"),


  /* Mu‘temir b. Süleymân (o. 187) -- talebeleri.
     Tehzîb 6080. Tercemede 72 kayit var, agda dugumu olan 23'i cizildi. */
  E("mutemirsuleyman", "ahmedhanbel", "خ م د", "Tehzîb 6080"),
  E("mutemirsuleyman", "ibnrahuye", "خ م س", "Tehzîb 6080"),
  E("mutemirsuleyman", "haccacminhal", "س", "Tehzîb 6080"),
  E("mutemirsuleyman", "hasanarafe", "—", "Tehzîb 6080"),
  E("mutemirsuleyman", "said_mansur", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "suveydsaidhadesani", "م ق", "Tehzîb 6080"),
  E("mutemirsuleyman", "ibnebiseybe", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "kanebi", "م د", "Tehzîb 6080"),
  E("mutemirsuleyman", "ibnmehdi", "—", "Tehzîb 6080"),
  E("mutemirsuleyman", "kavariri", "س", "Tehzîb 6080"),
  E("mutemirsuleyman", "ubeydullahmuazanberi", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "affanmuslim", "—", "Tehzîb 6080"),
  E("mutemirsuleyman", "alimedini", "خ", "Tehzîb 6080"),
  E("mutemirsuleyman", "amrbnalisayrafi", "س", "Tehzîb 6080"),
  E("mutemirsuleyman", "amrnakid", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "muhammedabdulalasanani", "م قد ت س ق", "Tehzîb 6080"),
  E("mutemirsuleyman", "ebukureyb", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "muhammedisataba", "د", "Tehzîb 6080"),
  E("mutemirsuleyman", "misned", "خ د س", "Tehzîb 6080"),
  E("mutemirsuleyman", "musaismailtebuzeki", "خ", "Tehzîb 6080"),
  E("mutemirsuleyman", "nasralicehdami", "ت س", "Tehzîb 6080"),
  E("mutemirsuleyman", "yahyayahyanisaburi", "م", "Tehzîb 6080"),
  E("mutemirsuleyman", "yakubdevraki", "د", "Tehzîb 6080"),


  /* Muâz b. Muâz el-Anberî (o. 196) -- talebeleri.
     Tehzîb 6036. Tercemede 28 kayit var, agda dugumu olan 13'i cizildi. */
  E("muazmuaz", "ahmedhanbel", "—", "Tehzîb 6036"),
  E("muazmuaz", "ibnrahuye", "—", "Tehzîb 6036"),
  E("muazmuaz", "zuheyrharb", "م", "Tehzîb 6036"),
  E("muazmuaz", "ibnebiseybe", "م ق", "Tehzîb 6036"),
  E("muazmuaz", "kavariri", "د", "Tehzîb 6036"),
  E("muazmuaz", "ubeydullahmuazanberi", "خ م د س", "Tehzîb 6036"),
  E("muazmuaz", "osmanebiseybe", "—", "Tehzîb 6036"),
  E("muazmuaz", "alimedini", "خ", "Tehzîb 6036"),
  E("muazmuaz", "amrbnalisayrafi", "خ مق", "Tehzîb 6036"),
  E("muazmuaz", "kuteybesaid", "ت", "Tehzîb 6036"),
  E("muazmuaz", "bundar", "خ", "Tehzîb 6036"),
  E("muazmuaz", "ibnmusenna", "خ م د س", "Tehzîb 6036"),
  E("muazmuaz", "ibnmain", "—", "Tehzîb 6036"),


  /* Muâz b. Muâz el-Anberî (o. 196) -- hocalari.
     Tehzîb 6036. Tercemede 15 kayit var, agda dugumu olan 6'i cizildi. */
  E("abdullahavn", "muazmuaz", "خ م ق", "Tehzîb 6036"),
  E("mesudi", "muazmuaz", "د", "Tehzîb 6036"),
  E("macisun", "muazmuaz", "د", "Tehzîb 6036"),
  E("avfarabi", "muazmuaz", "مق د س", "Tehzîb 6036"),
  E("muhammedamralkame", "muazmuaz", "م", "Tehzîb 6036"),
  E("varkaomer", "muazmuaz", "قد", "Tehzîb 6036"),


  /* Ruh b. Ubâde (o. 205) -- talebeleri.
     Tehzîb 1930. Tercemede 68 kayit var, agda dugumu olan 11'i cizildi. */
  E("ruhubade", "ahmedhanbel", "د", "Tehzîb 1930"),
  E("ruhubade", "ahmedmeni", "ت", "Tehzîb 1930"),
  E("ruhubade", "ibnrahuye", "خ م", "Tehzîb 1930"),
  E("ruhubade", "ishakkevsec", "خ م", "Tehzîb 1930"),
  E("ruhubade", "hasanarafe", "—", "Tehzîb 1930"),
  E("ruhubade", "zuheyrharb", "م", "Tehzîb 1930"),
  E("ruhubade", "abdhumeyd", "م ت", "Tehzîb 1930"),
  E("ruhubade", "alimedini", "—", "Tehzîb 1930"),
  E("ruhubade", "bundar", "خ م تم ق", "Tehzîb 1930"),
  E("ruhubade", "ibnmusenna", "م ق", "Tehzîb 1930"),
  E("ruhubade", "yakubdevraki", "خ", "Tehzîb 1930"),


  /* Abdülvâris b. Saîd (o. 180) -- talebeleri.
     Tehzîb 3595. Tercemede 42 kayit var, agda dugumu olan 12'i cizildi. */
  E("abdulvarissaid", "seybanferruh", "م", "Tehzîb 3595"),
  E("abdulvarissaid", "ebuasimnebil", "د", "Tehzîb 3595"),
  E("abdulvarissaid", "abdussamed", "ع", "Tehzîb 3595"),
  E("abdulvarissaid", "kavariri", "م س", "Tehzîb 3595"),
  E("abdulvarissaid", "affanmuslim", "م", "Tehzîb 3595"),
  E("abdulvarissaid", "alimedini", "—", "Tehzîb 3595"),
  E("abdulvarissaid", "kuteybesaid", "ت س", "Tehzîb 3595"),
  E("abdulvarissaid", "muhammedisataba", "د", "Tehzîb 3595"),
  E("abdulvarissaid", "misned", "خ د س", "Tehzîb 3595"),
  E("abdulvarissaid", "musaismailtebuzeki", "خ", "Tehzîb 3595"),
  E("abdulvarissaid", "kattan", "—", "Tehzîb 3595"),
  E("abdulvarissaid", "yahyayahyanisaburi", "م", "Tehzîb 3595"),


  /* Abdüssamed b. Abdilvâris (o. 207) -- talebeleri.
     Tehzîb 3431. Tercemede 40 kayit var, agda dugumu olan 12'i cizildi. */
  E("abdussamed", "ahmeddevraki", "م د", "Tehzîb 3431"),
  E("abdussamed", "ahmedhanbel", "—", "Tehzîb 3431"),
  E("abdussamed", "ibnrahuye", "خ م", "Tehzîb 3431"),
  E("abdussamed", "ishakkevsec", "خ م ت ق", "Tehzîb 3431"),
  E("abdussamed", "zuheyrharb", "م د س", "Tehzîb 3431"),
  E("abdussamed", "abdhumeyd", "م ت", "Tehzîb 3431"),
  E("abdussamed", "alimedini", "—", "Tehzîb 3431"),
  E("abdussamed", "bundar", "خ ت", "Tehzîb 3431"),
  E("abdussamed", "ibnmusenna", "م ت س ق", "Tehzîb 3431"),
  E("abdussamed", "zuhli", "س", "Tehzîb 3431"),
  E("abdussamed", "mahmudgaylan", "ت س", "Tehzîb 3431"),
  E("abdussamed", "nasralicehdami", "ت ق", "Tehzîb 3431"),


  /* İshak b. Abdillâh b. Ebî Talha (o. 132) -- hocalari.
     Tehzîb 366. Tercemede 14 kayit var, agda dugumu olan 3'i cizildi. */
  E("enes", "ishaktalha", "ع", "Tehzîb 366"),
  E("saidyesar", "ishaktalha", "د س", "Tehzîb 366"),
  E("ubeydullahmiksem", "ishaktalha", "س", "Tehzîb 366"),


  /* Süleymân b. el-Mugīre (o. 165) -- hocalari.
     Tehzîb 2567. Tercemede 7 kayit var, agda dugumu olan 4'i cizildi. */
  E("sabitbunani", "suleymanmugire", "خت م د ت س", "Tehzîb 2567"),
  E("hasanbasri", "suleymanmugire", "—", "Tehzîb 2567"),
  E("cureyri", "suleymanmugire", "م", "Tehzîb 2567"),
  E("ibnsirin", "suleymanmugire", "—", "Tehzîb 2567"),


  /* Süleymân b. el-Mugīre (o. 165) -- talebeleri.
     Tehzîb 2567. Tercemede 37 kayit var, agda dugumu olan 17'i cizildi. */
  E("suleymanmugire", "ademebiiyas", "خ س", "Tehzîb 2567"),
  E("suleymanmugire", "ebuusamehammad", "م ق", "Tehzîb 2567"),
  E("suleymanmugire", "seybanferruh", "م د", "Tehzîb 2567"),
  E("suleymanmugire", "ibnmubarek", "ت س", "Tehzîb 2567"),
  E("suleymanmugire", "kanebi", "د", "Tehzîb 2567"),
  E("suleymanmugire", "ibnmehdi", "س", "Tehzîb 2567"),
  E("suleymanmugire", "abdussamed", "د", "Tehzîb 2567"),
  E("suleymanmugire", "affanmuslim", "—", "Tehzîb 2567"),
  E("suleymanmugire", "ebunuaymfadl", "س", "Tehzîb 2567"),
  E("suleymanmugire", "muslimibrahim", "—", "Tehzîb 2567"),
  E("suleymanmugire", "mutemirsuleyman", "سي", "Tehzîb 2567"),
  E("suleymanmugire", "musaismailtebuzeki", "خت د", "Tehzîb 2567"),
  E("suleymanmugire", "nadrsumeyl", "م س", "Tehzîb 2567"),
  E("suleymanmugire", "hebbanhilal", "م", "Tehzîb 2567"),
  E("suleymanmugire", "hisamtayalisi", "—", "Tehzîb 2567"),
  E("suleymanmugire", "yahyaadem", "سي", "Tehzîb 2567"),
  E("suleymanmugire", "yezidharun", "—", "Tehzîb 2567"),


  /* Ebû’l-Ahves Süllâm b. Süleym (o. 179) -- talebeleri.
     Tehzîb 2655. Tercemede 35 kayit var, agda dugumu olan 16'i cizildi. */
  E("ebulahvess", "halefhisam", "م", "Tehzîb 2655"),
  E("ebulahvess", "said_mansur", "م س", "Tehzîb 2655"),
  E("ebulahvess", "ebudavudtayalisi", "—", "Tehzîb 2655"),
  E("ebulahvess", "suveydsaidhadesani", "ق", "Tehzîb 2655"),
  E("ebulahvess", "ibnebiseybe", "م ق", "Tehzîb 2655"),
  E("ebulahvess", "ibnmehdi", "—", "Tehzîb 2655"),
  E("ebulahvess", "osmanebiseybe", "د", "Tehzîb 2655"),
  E("ebulahvess", "ebunuaymfadl", "—", "Tehzîb 2655"),
  E("ebulahvess", "kuteybesaid", "خ م ت س", "Tehzîb 2655"),
  E("ebulahvess", "muhammedubeydmuharibi", "س", "Tehzîb 2655"),
  E("ebulahvess", "misned", "خ د", "Tehzîb 2655"),
  E("ebulahvess", "hisamtayalisi", "—", "Tehzîb 2655"),
  E("ebulahvess", "hennadseri", "عخ م ٤", "Tehzîb 2655"),
  E("ebulahvess", "veki", "—", "Tehzîb 2655"),
  E("ebulahvess", "yahyaadem", "خ", "Tehzîb 2655"),
  E("ebulahvess", "yahyayahyanisaburi", "م", "Tehzîb 2655"),


  /* Muâviye b. Sâlih el-Hadramî (o. 158) -- hocalari.
     Tehzîb 6058. Tercemede 52 kayit var, agda dugumu olan 7'i cizildi. */
  E("ishaktalha", "muaviyesalih", "—", "Tehzîb 6058"),
  E("rebiayezid", "muaviyesalih", "ر م ٤", "Tehzîb 6058"),
  E("suleymanmusadimaski", "muaviyesalih", "—", "Tehzîb 6058"),
  E("saddadebuammar", "muaviyesalih", "—", "Tehzîb 6058"),
  E("umeyrhani", "muaviyesalih", "—", "Tehzîb 6058"),
  E("mekhul", "muaviyesalih", "—", "Tehzîb 6058"),
  E("yahyasaidensari", "muaviyesalih", "م تم س", "Tehzîb 6058"),


  /* Hâlid b. el-Hâris el-Hüceyî (o. 186) -- hocalari.
     Tehzîb 1598. Tercemede 38 kayit var, agda dugumu olan 17'i cizildi. */
  E("esaseabdulmelik", "halidharis", "د ت س", "Tehzîb 1598"),
  E("eyyubsahtiyani", "halidharis", "—", "Tehzîb 1598"),
  E("hatimebisagire", "halidharis", "خ د س", "Tehzîb 1598"),
  E("huseynmuallim", "halidharis", "د س", "Tehzîb 1598"),
  E("humeydtavil", "halidharis", "ع", "Tehzîb 1598"),
  E("saidcubeyr", "halidharis", "س", "Tehzîb 1598"),
  E("sube", "halidharis", "خ م س", "Tehzîb 1598"),
  E("abdullahavn", "halidharis", "خ م س", "Tehzîb 1598"),
  E("abdulhamidcafer", "halidharis", "بخ م س", "Tehzîb 1598"),
  E("mesudi", "halidharis", "بخ س", "Tehzîb 1598"),
  E("abdulmelikebisuleyman", "halidharis", "س", "Tehzîb 1598"),
  E("ubeydullahomeri", "halidharis", "خ م ت س", "Tehzîb 1598"),
  E("avfarabi", "halidharis", "سي", "Tehzîb 1598"),
  E("muhammedacilan", "halidharis", "م", "Tehzîb 1598"),
  E("muhammedamralkame", "halidharis", "س", "Tehzîb 1598"),
  E("hisamhassan", "halidharis", "س", "Tehzîb 1598"),
  E("hisamurve", "halidharis", "م", "Tehzîb 1598"),


  /* Hâlid b. el-Hâris el-Hüceyî (o. 186) -- talebeleri.
     Tehzîb 1598. Tercemede 34 kayit var, agda dugumu olan 10'i cizildi. */
  E("halidharis", "ahmedhanbel", "—", "Tehzîb 1598"),
  E("halidharis", "ibnrahuye", "خ م", "Tehzîb 1598"),
  E("halidharis", "hasanarafe", "—", "Tehzîb 1598"),
  E("halidharis", "kavariri", "خ م د", "Tehzîb 1598"),
  E("halidharis", "ubeydullahmuazanberi", "د", "Tehzîb 1598"),
  E("halidharis", "alimedini", "خت", "Tehzîb 1598"),
  E("halidharis", "amrbnalisayrafi", "خ س", "Tehzîb 1598"),
  E("halidharis", "muhammedabdulalasanani", "ت س", "Tehzîb 1598"),
  E("halidharis", "ibnmusenna", "ع", "Tehzîb 1598"),
  E("halidharis", "nasralicehdami", "م ٤", "Tehzîb 1598"),


  /* Bişr b. es-Serî (o. 195) -- hocalari.
     Tehzîb 689. Tercemede 22 kayit var, agda dugumu olan 8'i cizildi. */
  E("ibrahimtahman", "bisrsari", "—", "Tehzîb 689"),
  E("hammadseleme", "bisrsari", "م ت", "Tehzîb 689"),
  E("zaidekudame", "bisrsari", "ت", "Tehzîb 689"),
  E("zekeriyyaishak", "bisrsari", "م", "Tehzîb 689"),
  E("ibnmubarek", "bisrsari", "س", "Tehzîb 689"),
  E("misersukdam", "bisrsari", "—", "Tehzîb 689"),
  E("muaviyesalih", "bisrsari", "زد", "Tehzîb 689"),
  E("nafiomercumahi", "bisrsari", "خ", "Tehzîb 689"),


  /* Bişr b. es-Serî (o. 195) -- talebeleri.
     Tehzîb 689. Tercemede 27 kayit var, agda dugumu olan 8'i cizildi. */
  E("bisrsari", "ahmedhanbel", "—", "Tehzîb 689"),
  E("bisrsari", "zuheyrharb", "م", "Tehzîb 689"),
  E("bisrsari", "alimedini", "خ", "Tehzîb 689"),
  E("bisrsari", "amrbnalisayrafi", "—", "Tehzîb 689"),
  E("bisrsari", "ibnebiomeradeni", "م ت", "Tehzîb 689"),
  E("bisrsari", "mahmudgaylan", "م ت س ق", "Tehzîb 689"),
  E("bisrsari", "harunmaruf", "د", "Tehzîb 689"),
  E("bisrsari", "yahyaadem", "ص", "Tehzîb 689"),


  /* Damra b. Rabîa (o. 202) -- hocalari.
     Tehzîb 2938. Tercemede 42 kayit var, agda dugumu olan 4'i cizildi. */
  E("ibrahimebiable", "damrarebia", "د", "Tehzîb 2938"),
  E("ismailayyas", "damrarebia", "س", "Tehzîb 2938"),
  E("serieyyahya", "damrarebia", "س", "Tehzîb 2938"),
  E("saidabdulaziz", "damrarebia", "—", "Tehzîb 2938"),


  /* Damra b. Rabîa (o. 202) -- talebeleri.
     Tehzîb 2938. Tercemede 33 kayit var, agda dugumu olan 1'i cizildi. */
  E("damrarebia", "ademebiiyas", "—", "Tehzîb 2938"),


  /* Me‘âfâ b. İmrân (o. 185) -- hocalari.
     Tehzîb 6041. Tercemede 80 kayit var, agda dugumu olan 27'i cizildi. */
  E("ibrahimtahman", "mafairan", "س", "Tehzîb 6041"),
  E("usamezeydleysi", "mafairan", "—", "Tehzîb 6041"),
  E("caferburkan", "mafairan", "—", "Tehzîb 6041"),
  E("hammadseleme", "mafairan", "—", "Tehzîb 6041"),
  E("hanzalasufyan", "mafairan", "س", "Tehzîb 6041"),
  E("zekeriyyaishak", "mafairan", "س", "Tehzîb 6041"),
  E("zuhayrmuaviye", "mafairan", "—", "Tehzîb 6041"),
  E("ibnebiaruba", "mafairan", "—", "Tehzîb 6041"),
  E("sevri", "mafairan", "—", "Tehzîb 6041"),
  E("seyfsuleymanmekki", "mafairan", "س", "Tehzîb 6041"),
  E("serikkadi", "mafairan", "—", "Tehzîb 6041"),
  E("sube", "mafairan", "—", "Tehzîb 6041"),
  E("abdulhamidcafer", "mafairan", "س", "Tehzîb 6041"),
  E("mesudi", "mafairan", "—", "Tehzîb 6041"),
  E("ibncureyc", "mafairan", "—", "Tehzîb 6041"),
  E("aliebisalihhayy", "mafairan", "—", "Tehzîb 6041"),
  E("omerzerr", "mafairan", "—", "Tehzîb 6041"),
  E("isabyunus", "mafairan", "—", "Tehzîb 6041"),
  E("kaysrebi", "mafairan", "—", "Tehzîb 6041"),
  E("leysbsad", "mafairan", "—", "Tehzîb 6041"),
  E("malik", "mafairan", "—", "Tehzîb 6041"),
  E("malikmigvel", "mafairan", "—", "Tehzîb 6041"),
  E("ibnebizib", "mafairan", "—", "Tehzîb 6041"),
  E("misersukdam", "mafairan", "—", "Tehzîb 6041"),
  E("hisamhassan", "mafairan", "—", "Tehzîb 6041"),
  E("hisamdestuvai", "mafairan", "—", "Tehzîb 6041"),
  E("hemmamyahya", "mafairan", "—", "Tehzîb 6041"),


  /* Muhammed b. Şuayb b. Şâbûr (o. 200) -- hocalari.
     Tehzîb 5290. Tercemede 43 kayit var, agda dugumu olan 4'i cizildi. */
  E("saidabdulaziz", "muhammedsuaybsabur", "ق", "Tehzîb 5290"),
  E("amrharis", "muhammedsuaybsabur", "س", "Tehzîb 5290"),
  E("kurrahayvil", "muhammedsuaybsabur", "—", "Tehzîb 5290"),
  E("muaviyesellam", "muhammedsuaybsabur", "س ق", "Tehzîb 5290"),


  /* Abdülvehhâb b. Atâ (o. 204) -- hocalari.
     Tehzîb 3605. Tercemede 35 kayit var, agda dugumu olan 13'i cizildi. */
  E("humeydtavil", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("halidhazza", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("davudebihind", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("cureyri", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("suleymanteymi", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("sube", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("abdullahavn", "abdulvehhabata", "ق", "Tehzîb 3605"),
  E("ibncureyc", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("avfarabi", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("malik", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("muhammedamralkame", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("hisamhassan", "abdulvehhabata", "—", "Tehzîb 3605"),
  E("hisamdestuvai", "abdulvehhabata", "—", "Tehzîb 3605"),


  /* Abdülvehhâb b. Atâ (o. 204) -- talebeleri.
     Tehzîb 3605. Tercemede 38 kayit var, agda dugumu olan 6'i cizildi. */
  E("abdulvehhabata", "ahmedhanbel", "—", "Tehzîb 3605"),
  E("abdulvehhabata", "ibnrahuye", "—", "Tehzîb 3605"),
  E("abdulvehhabata", "ishakkevsec", "—", "Tehzîb 3605"),
  E("abdulvehhabata", "halefhisam", "—", "Tehzîb 3605"),
  E("abdulvehhabata", "amrnakid", "—", "Tehzîb 3605"),
  E("abdulvehhabata", "ibnmain", "—", "Tehzîb 3605"),


  /* Muhammed b. Ebî Adî (o. 194) -- hocalari.
     Tehzîb 5029. Tercemede 27 kayit var, agda dugumu olan 15'i cizildi. */
  E("esaseabdulmelik", "muhammedebiadi", "ي", "Tehzîb 5029"),
  E("haccacsavvaf", "muhammedebiadi", "م د س ق", "Tehzîb 5029"),
  E("huseynmuallim", "muhammedebiadi", "م ت ق", "Tehzîb 5029"),
  E("humeydtavil", "muhammedebiadi", "م ت س ق", "Tehzîb 5029"),
  E("hanzalasufyan", "muhammedebiadi", "د", "Tehzîb 5029"),
  E("halidhazza", "muhammedebiadi", "س ق", "Tehzîb 5029"),
  E("davudebihind", "muhammedebiadi", "م", "Tehzîb 5029"),
  E("suleymanteymi", "muhammedebiadi", "خ م س", "Tehzîb 5029"),
  E("sube", "muhammedebiadi", "خ م ت س ق", "Tehzîb 5029"),
  E("abdullahavn", "muhammedebiadi", "خ م ق", "Tehzîb 5029"),
  E("avfarabi", "muhammedebiadi", "ت س ق", "Tehzîb 5029"),
  E("ibnishak", "muhammedebiadi", "—", "Tehzîb 5029"),
  E("muhammedamralkame", "muhammedebiadi", "رد", "Tehzîb 5029"),
  E("hisamurve", "muhammedebiadi", "—", "Tehzîb 5029"),
  E("hisamhassan", "muhammedebiadi", "خ د ت ق", "Tehzîb 5029"),


  /* Muhammed b. Ebî Adî (o. 194) -- talebeleri.
     Tehzîb 5029. Tercemede 30 kayit var, agda dugumu olan 8'i cizildi. */
  E("muhammedebiadi", "ahmedhanbel", "—", "Tehzîb 5029"),
  E("muhammedebiadi", "ibnebiseybe", "—", "Tehzîb 5029"),
  E("muhammedebiadi", "osmanebiseybe", "—", "Tehzîb 5029"),
  E("muhammedebiadi", "amrbnalisayrafi", "خ م ق", "Tehzîb 5029"),
  E("muhammedebiadi", "kuteybesaid", "س", "Tehzîb 5029"),
  E("muhammedebiadi", "bundar", "ع", "Tehzîb 5029"),
  E("muhammedebiadi", "ibnmusenna", "ع", "Tehzîb 5029"),
  E("muhammedebiadi", "ibnmain", "د", "Tehzîb 5029"),


  /* Ali b. Müshir (o. 189) -- hocalari.
     Tehzîb 4137. Tercemede 37 kayit var, agda dugumu olan 17'i cizildi. */
  E("ismailebihalid", "alimushir", "م", "Tehzîb 4137"),
  E("ebuburde", "alimushir", "م", "Tehzîb 4137"),
  E("hamzazeyyat", "alimushir", "مق", "Tehzîb 4137"),
  E("davudebihind", "alimushir", "م", "Tehzîb 4137"),
  E("zekeriyyaebizaide", "alimushir", "م", "Tehzîb 4137"),
  E("asimahvel", "alimushir", "م ق", "Tehzîb 4137"),
  E("abdulazizomer", "alimushir", "د", "Tehzîb 4137"),
  E("abdulmelikebisuleyman", "alimushir", "م", "Tehzîb 4137"),
  E("ibncureyc", "alimushir", "م", "Tehzîb 4137"),
  E("ubeydullahomeri", "alimushir", "خ م ق", "Tehzîb 4137"),
  E("omerzerr", "alimushir", "—", "Tehzîb 4137"),
  E("mutarriftarif", "alimushir", "ق", "Tehzîb 4137"),
  E("musacuheni", "alimushir", "م", "Tehzîb 4137"),
  E("hisamurve", "alimushir", "ع", "Tehzîb 4137"),
  E("yahyasaidensari", "alimushir", "خ", "Tehzîb 4137"),
  E("ismailebiislamsibani", "alimushir", "خ م ت ق", "Tehzîb 4137"),
  E("ebumalikesceyi", "alimushir", "م", "Tehzîb 4137"),


  /* Ali b. Müshir (o. 189) -- talebeleri.
     Tehzîb 4137. Tercemede 28 kayit var, agda dugumu olan 5'i cizildi. */
  E("alimushir", "suveydsaidhadesani", "م ق", "Tehzîb 4137"),
  E("alimushir", "ibnebiseybe", "م ق", "Tehzîb 4137"),
  E("alimushir", "osmanebiseybe", "م", "Tehzîb 4137"),
  E("alimushir", "muhammedubeydmuharibi", "س", "Tehzîb 4137"),
  E("alimushir", "hennadseri", "م ت", "Tehzîb 4137"),


  /* İshak b. Yûsuf el-Ezrak (o. 195) -- hocalari.
     Tehzîb 395. Tercemede 15 kayit var, agda dugumu olan 11'i cizildi. */
  E("zekeriyyaebizaide", "ishakyusufezrak", "م س", "Tehzîb 395"),
  E("cureyri", "ishakyusufezrak", "—", "Tehzîb 395"),
  E("amess", "ishakyusufezrak", "ق", "Tehzîb 395"),
  E("serikkadi", "ishakyusufezrak", "د ق", "Tehzîb 395"),
  E("abdullahavn", "ishakyusufezrak", "م", "Tehzîb 395"),
  E("abdulazizomer", "ishakyusufezrak", "—", "Tehzîb 395"),
  E("abdulmelikebisuleyman", "ishakyusufezrak", "م ت س", "Tehzîb 395"),
  E("omerzerr", "ishakyusufezrak", "فق", "Tehzîb 395"),
  E("avfarabi", "ishakyusufezrak", "خ س", "Tehzîb 395"),
  E("misersukdam", "ishakyusufezrak", "خ", "Tehzîb 395"),
  E("varkaomer", "ishakyusufezrak", "خ د", "Tehzîb 395"),


  /* İshak b. Yûsuf el-Ezrak (o. 195) -- talebeleri.
     Tehzîb 395. Tercemede 35 kayit var, agda dugumu olan 6'i cizildi. */
  E("ishakyusufezrak", "ahmeddevraki", "د", "Tehzîb 395"),
  E("ishakyusufezrak", "ahmedhanbel", "د", "Tehzîb 395"),
  E("ishakyusufezrak", "ahmedmeni", "ت", "Tehzîb 395"),
  E("ishakyusufezrak", "zuheyrharb", "م", "Tehzîb 395"),
  E("ishakyusufezrak", "ibnebiseybe", "م ق", "Tehzîb 395"),
  E("ishakyusufezrak", "amrnakid", "م", "Tehzîb 395"),


  /* Ca‘fer b. Avn (o. 207) -- hocalari.
     Tehzîb 948. Tercemede 22 kayit var, agda dugumu olan 9'i cizildi. */
  E("ismailebihalid", "caferavn", "ق", "Tehzîb 948"),
  E("zekeriyyaebizaide", "caferavn", "—", "Tehzîb 948"),
  E("ibnebiaruba", "caferavn", "—", "Tehzîb 948"),
  E("ismailebiislamsibani", "caferavn", "—", "Tehzîb 948"),
  E("amess", "caferavn", "خ ت", "Tehzîb 948"),
  E("mesudi", "caferavn", "س", "Tehzîb 948"),
  E("misersukdam", "caferavn", "سي", "Tehzîb 948"),
  E("hisamurve", "caferavn", "م", "Tehzîb 948"),
  E("yahyasaidensari", "caferavn", "س", "Tehzîb 948"),


  /* Ca‘fer b. Avn (o. 207) -- talebeleri.
     Tehzîb 948. Tercemede 40 kayit var, agda dugumu olan 11'i cizildi. */
  E("caferavn", "ahmedhanbel", "—", "Tehzîb 948"),
  E("caferavn", "ibnrahuye", "خ", "Tehzîb 948"),
  E("caferavn", "ishakkevsec", "خ م", "Tehzîb 948"),
  E("caferavn", "hasanaliayyal", "م", "Tehzîb 948"),
  E("caferavn", "zuheyrharb", "—", "Tehzîb 948"),
  E("caferavn", "ibnebiseybe", "—", "Tehzîb 948"),
  E("caferavn", "abdhumeyd", "م ت", "Tehzîb 948"),
  E("caferavn", "osmanebiseybe", "—", "Tehzîb 948"),
  E("caferavn", "alimedini", "ق", "Tehzîb 948"),
  E("caferavn", "bundar", "خ ت", "Tehzîb 948"),
  E("caferavn", "ebukureyb", "ق", "Tehzîb 948"),


  /* Haccâc b. Muhammed el-Masīsī (o. 206) -- hocalari.
     Tehzîb 1127. Tercemede 18 kayit var, agda dugumu olan 8'i cizildi. */
  E("israilyunus", "haccacmuhammed", "سي", "Tehzîb 1127"),
  E("hamzazeyyat", "haccacmuhammed", "س", "Tehzîb 1127"),
  E("zuhayrmuaviye", "haccacmuhammed", "—", "Tehzîb 1127"),
  E("serikkadi", "haccacmuhammed", "س", "Tehzîb 1127"),
  E("sube", "haccacmuhammed", "خ س", "Tehzîb 1127"),
  E("mesudi", "haccacmuhammed", "—", "Tehzîb 1127"),
  E("omerzerr", "haccacmuhammed", "س", "Tehzîb 1127"),
  E("ibnebizib", "haccacmuhammed", "مق س", "Tehzîb 1127"),


  /* Haccâc b. Muhammed el-Masīsī (o. 206) -- talebeleri.
     Tehzîb 1127. Tercemede 60 kayit var, agda dugumu olan 10'i cizildi. */
  E("haccacmuhammed", "ahmeddevraki", "د", "Tehzîb 1127"),
  E("haccacmuhammed", "ahmedhanbel", "د", "Tehzîb 1127"),
  E("haccacmuhammed", "zuheyrharb", "م", "Tehzîb 1127"),
  E("haccacmuhammed", "sericyunus", "م", "Tehzîb 1127"),
  E("haccacmuhammed", "kuteybesaid", "خ س", "Tehzîb 1127"),
  E("haccacmuhammed", "mucahidmusa", "س", "Tehzîb 1127"),
  E("haccacmuhammed", "muhammedisataba", "د", "Tehzîb 1127"),
  E("haccacmuhammed", "zuhli", "—", "Tehzîb 1127"),
  E("haccacmuhammed", "ibnmain", "خ مق د س", "Tehzîb 1127"),
  E("haccacmuhammed", "yahyayahyanisaburi", "م", "Tehzîb 1127"),


  /* Abdül'alâ b. Abdil'alâ (o. 189) -- hocalari.
     Tehzîb 3687. Tercemede 19 kayit var, agda dugumu olan 9'i cizildi. */
  E("humeydtavil", "abdulalaabdulala", "خ د", "Tehzîb 3687"),
  E("halidhazza", "abdulalaabdulala", "خ", "Tehzîb 3687"),
  E("davudebihind", "abdulalaabdulala", "خت م", "Tehzîb 3687"),
  E("cureyri", "abdulalaabdulala", "خ م د ت", "Tehzîb 3687"),
  E("ibnebiaruba", "abdulalaabdulala", "ع", "Tehzîb 3687"),
  E("ubeydullahomeri", "abdulalaabdulala", "خ م د س ق", "Tehzîb 3687"),
  E("ibnishak", "abdulalaabdulala", "ر م د ق", "Tehzîb 3687"),
  E("muhammedamralkame", "abdulalaabdulala", "عخ", "Tehzîb 3687"),
  E("hisamhassan", "abdulalaabdulala", "ع", "Tehzîb 3687"),


  /* Abdül'alâ b. Abdil'alâ (o. 189) -- talebeleri.
     Tehzîb 3687. Tercemede 40 kayit var, agda dugumu olan 8'i cizildi. */
  E("abdulalaabdulala", "ibnrahuye", "م س", "Tehzîb 3687"),
  E("abdulalaabdulala", "ibnebiseybe", "م س ق", "Tehzîb 3687"),
  E("abdulalaabdulala", "kavariri", "م د", "Tehzîb 3687"),
  E("abdulalaabdulala", "alimedini", "خ", "Tehzîb 3687"),
  E("abdulalaabdulala", "amrbnalisayrafi", "خ م", "Tehzîb 3687"),
  E("abdulalaabdulala", "bundar", "خ م ت", "Tehzîb 3687"),
  E("abdulalaabdulala", "ibnmusenna", "ع", "Tehzîb 3687"),
  E("abdulalaabdulala", "nasralicehdami", "خ م س ق", "Tehzîb 3687"),


  /* Vâkıdî, Muhammed b. Ömer (o. 207) -- hocalari.
     Tehzîb 5501. Tercemede 27 kayit var, agda dugumu olan 11'i cizildi. */
  E("usamezeydeslem", "vakidi", "—", "Tehzîb 5501"),
  E("usamezeydleysi", "vakidi", "—", "Tehzîb 5501"),
  E("saidabdulaziz", "vakidi", "—", "Tehzîb 5501"),
  E("sevri", "vakidi", "—", "Tehzîb 5501"),
  E("abdulhamidcafer", "vakidi", "—", "Tehzîb 5501"),
  E("evzai", "vakidi", "—", "Tehzîb 5501"),
  E("ibncureyc", "vakidi", "—", "Tehzîb 5501"),
  E("malik", "vakidi", "—", "Tehzîb 5501"),
  E("muhammedacilan", "vakidi", "—", "Tehzîb 5501"),
  E("muaviyesalih", "vakidi", "—", "Tehzîb 5501"),
  E("velidkesir", "vakidi", "—", "Tehzîb 5501"),


  /* Vâkıdî, Muhammed b. Ömer (o. 207) -- talebeleri.
     Tehzîb 5501. Tercemede 17 kayit var, agda dugumu olan 1'i cizildi. */
  E("vakidi", "ibnebiseybe", "—", "Tehzîb 5501"),


  /* Mmuhammed b. Yûsuf el-Firyâbî (o. 212) -- hocalari.
     Tehzîb 5716. Tercemede 31 kayit var, agda dugumu olan 13'i cizildi. */
  E("ibrahimebiable", "firyabi", "—", "Tehzîb 5716"),
  E("cerirhazim", "firyabi", "س", "Tehzîb 5716"),
  E("zaidekudame", "firyabi", "—", "Tehzîb 5716"),
  E("serieyyahya", "firyabi", "—", "Tehzîb 5716"),
  E("sevri", "firyabi", "خ م س ق", "Tehzîb 5716"),
  E("ibnuyeyne", "firyabi", "—", "Tehzîb 5716"),
  E("omerzerr", "firyabi", "—", "Tehzîb 5716"),
  E("fitrhalife", "firyabi", "س", "Tehzîb 5716"),
  E("kaysrebi", "firyabi", "—", "Tehzîb 5716"),
  E("malikmigvel", "firyabi", "خ", "Tehzîb 5716"),
  E("nafiomercumahi", "firyabi", "ت", "Tehzîb 5716"),
  E("varkaomer", "firyabi", "خ فق", "Tehzîb 5716"),
  E("ebubekirayyas", "firyabi", "—", "Tehzîb 5716"),


  /* Mmuhammed b. Yûsuf el-Firyâbî (o. 212) -- talebeleri.
     Tehzîb 5716. Tercemede 30 kayit var, agda dugumu olan 4'i cizildi. */
  E("firyabi", "buhari", "—", "Tehzîb 5716"),
  E("firyabi", "ahmedhanbel", "د", "Tehzîb 5716"),
  E("firyabi", "ishakkevsec", "م ت س", "Tehzîb 5716"),
  E("firyabi", "darimi", "م", "Tehzîb 5716"),


  /* Zâzân Ebû Ömer el-Kindî (o. 82) -- hocalari.
     Tehzîb 1945. Tercemede 11 kayit var, agda dugumu olan 5'i cizildi. */
  E("bera", "zadan", "د س ق", "Tehzîb 1945"),
  E("huzeyfe", "zadan", "ت", "Tehzîb 1945"),
  E("ibnmesud", "zadan", "س", "Tehzîb 1945"),
  E("omer", "zadan", "—", "Tehzîb 1945"),
  E("ebuhureyre", "zadan", "—", "Tehzîb 1945"),


  /* Zâzân Ebû Ömer el-Kindî (o. 82) -- talebeleri.
     Tehzîb 1945. Tercemede 24 kayit var, agda dugumu olan 5'i cizildi. */
  E("zadan", "habibebisabit", "—", "Tehzîb 1945"),
  E("zadan", "zubeydyami", "—", "Tehzîb 1945"),
  E("zadan", "ataisaib", "د ق", "Tehzîb 1945"),
  E("zadan", "leysebisuleym", "—", "Tehzîb 1945"),
  E("zadan", "muhammedsuka", "—", "Tehzîb 1945"),


  /* Ebû Zabyân Hüsayn b. Cündeb (o. 90) -- hocalari.
     Tehzîb 1355. Tercemede 12 kayit var, agda dugumu olan 6'i cizildi. */
  E("ibnomer", "ebuzabyan", "—", "Tehzîb 1355"),
  E("ebumusa", "ebuzabyan", "—", "Tehzîb 1355"),
  E("ibnmesud", "ebuzabyan", "—", "Tehzîb 1355"),
  E("ali", "ebuzabyan", "د س", "Tehzîb 1355"),
  E("omer", "ebuzabyan", "بخ", "Tehzîb 1355"),
  E("aise", "ebuzabyan", "ق", "Tehzîb 1355"),


  /* Ebû Zabyân Hüsayn b. Cündeb (o. 90) -- talebeleri.
     Tehzîb 1355. Tercemede 15 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebuzabyan", "nehai", "—", "Tehzîb 1355"),
  E("ebuzabyan", "husaynabdrahman", "خ م س", "Tehzîb 1355"),
  E("ebuzabyan", "selemekuheyl", "—", "Tehzîb 1355"),
  E("ebuzabyan", "amess", "خ م د س فق", "Tehzîb 1355"),
  E("ebuzabyan", "simakharb", "ت", "Tehzîb 1355"),
  E("ebuzabyan", "ebuhasin", "س", "Tehzîb 1355"),
  E("ebuzabyan", "ataisaib", "د س", "Tehzîb 1355"),
  E("ebuzabyan", "ebuishaksebii", "—", "Tehzîb 1355"),


  /* Zübeyr b. Adî (o. 131) -- hocalari.
     Tehzîb 1969. Tercemede 17 kayit var, agda dugumu olan 5'i cizildi. */
  E("harisaver", "zubeyradi", "—", "Tehzîb 1969"),
  E("dahhak", "zubeyradi", "—", "Tehzîb 1969"),
  E("tariksihab", "zubeyradi", "—", "Tehzîb 1969"),
  E("ataebirebah", "zubeyradi", "—", "Tehzîb 1969"),
  E("mearrursuveyd", "zubeyradi", "—", "Tehzîb 1969"),


  /* Zübeyr b. Adî (o. 131) -- talebeleri.
     Tehzîb 1969. Tercemede 16 kayit var, agda dugumu olan 5'i cizildi. */
  E("zubeyradi", "ismailebihalid", "م س ق", "Tehzîb 1969"),
  E("zubeyradi", "haccacertat", "—", "Tehzîb 1969"),
  E("zubeyradi", "sevri", "خ د ت س", "Tehzîb 1969"),
  E("zubeyradi", "malikmigvel", "م س", "Tehzîb 1969"),
  E("zubeyradi", "misersukdam", "—", "Tehzîb 1969"),


  /* Ebû Saîd el-Makburî (o. ?) -- hocalari.
     Tehzîb 5008. Tercemede 11 kayit var, agda dugumu olan 3'i cizildi. */
  E("usame", "ebusaidmakburi", "س", "Tehzîb 5008"),
  E("ali", "ebusaidmakburi", "—", "Tehzîb 5008"),
  E("omer", "ebusaidmakburi", "—", "Tehzîb 5008"),


  /* Büsr b. Saîd (o. 100) -- hocalari.
     Tehzîb 654. Tercemede 22 kayit var, agda dugumu olan 5'i cizildi. */
  E("zeydsabit", "busrsaid", "خ م د ت س", "Tehzîb 654"),
  E("zeydhalid", "busrsaid", "ع", "Tehzîb 654"),
  E("ebusaid", "busrsaid", "خ م د", "Tehzîb 654"),
  E("sadvakkas", "busrsaid", "عخ م ت سي", "Tehzîb 654"),
  E("ubeydullaherafi", "busrsaid", "م", "Tehzîb 654"),


  /* Büsr b. Saîd (o. 100) -- talebeleri.
     Tehzîb 654. Tercemede 10 kayit var, agda dugumu olan 4'i cizildi. */
  E("busrsaid", "zeydeslem", "خ م ت س ق", "Tehzîb 654"),
  E("busrsaid", "salimebinadr", "ع", "Tehzîb 654"),
  E("busrsaid", "yezidhusayfe", "م د س", "Tehzîb 654"),
  E("busrsaid", "ebuselemeavf", "خ م دت س", "Tehzîb 654"),


  /* Şüreyh b. Hâni’ el-Hârisî (o. 78) -- hocalari.
     Tehzîb 2729. Tercemede 7 kayit var, agda dugumu olan 3'i cizildi. */
  E("sadvakkas", "sureyhhani", "م س ق", "Tehzîb 2729"),
  E("ali", "sureyhhani", "م س ق", "Tehzîb 2729"),
  E("omer", "sureyhhani", "—", "Tehzîb 2729"),


  /* Şüreyh b. Hâni’ el-Hârisî (o. 78) -- talebeleri.
     Tehzîb 2729. Tercemede 9 kayit var, agda dugumu olan 4'i cizildi. */
  E("sureyhhani", "habibebisabit", "—", "Tehzîb 2729"),
  E("sureyhhani", "hakemuteybe", "—", "Tehzîb 2729"),
  E("sureyhhani", "sabi", "م س", "Tehzîb 2729"),
  E("sureyhhani", "kasimmuhaymire", "م س ق", "Tehzîb 2729"),


  /* Rifâa b. Râfi‘ ez-Zürakī (o. ?) -- talebeleri.
     Tehzîb 1915. Tercemede 5 kayit var, agda dugumu olan 1'i cizildi. */
  E("rifaazuraki", "abdullahsedddad", "—", "Tehzîb 1915"),


  /* Hâris b. Süveyd et-Teymî (o. 72) -- hocalari.
     Tehzîb 1022. Tercemede 4 kayit var, agda dugumu olan 3'i cizildi. */
  E("ibnmesud", "harissuveyd", "خ م د ت س", "Tehzîb 1022"),
  E("omer", "harissuveyd", "—", "Tehzîb 1022"),
  E("amrmeymun", "harissuveyd", "ق", "Tehzîb 1022"),


  /* Hâris b. Süveyd et-Teymî (o. 72) -- talebeleri.
     Tehzîb 1022. Tercemede 6 kayit var, agda dugumu olan 1'i cizildi. */
  E("harissuveyd", "ibrahimteymi", "خ م د س", "Tehzîb 1022"),


  /* Esved b. Hilâl el-Muhâribî (o. 84) -- hocalari.
     Tehzîb 508. Tercemede 6 kayit var, agda dugumu olan 3'i cizildi. */
  E("ibnmesud", "esvedhilal", "—", "Tehzîb 508"),
  E("omer", "esvedhilal", "—", "Tehzîb 508"),
  E("mugirasube", "esvedhilal", "—", "Tehzîb 508"),


  /* Esved b. Hilâl el-Muhâribî (o. 84) -- talebeleri.
     Tehzîb 508. Tercemede 7 kayit var, agda dugumu olan 5'i cizildi. */
  E("esvedhilal", "nehai", "—", "Tehzîb 508"),
  E("esvedhilal", "cameseddad", "—", "Tehzîb 508"),
  E("esvedhilal", "asimbehdele", "س", "Tehzîb 508"),
  E("esvedhilal", "ebuhasin", "خ م", "Tehzîb 508"),
  E("esvedhilal", "ebuishaksebii", "—", "Tehzîb 508"),


  /* Hârise b. Mudarrib (o. ?) -- hocalari.
     Tehzîb 1058. Tercemede 8 kayit var, agda dugumu olan 3'i cizildi. */
  E("ebumusa", "harisemudarrib", "—", "Tehzîb 1058"),
  E("ibnmesud", "harisemudarrib", "د س", "Tehzîb 1058"),
  E("omer", "harisemudarrib", "—", "Tehzîb 1058"),


  /* Hârise b. Mudarrib (o. ?) -- talebeleri.
     Tehzîb 1058. Tercemede 1 kayit var, agda dugumu olan 1'i cizildi. */
  E("harisemudarrib", "ebuishaksebii", "بخ ٤", "Tehzîb 1058"),


  /* Abdurrahman b. Ebzâ (o. 70) -- hocalari.
     Tehzîb 3748. Tercemede 7 kayit var, agda dugumu olan 4'i cizildi. */
  E("ubey", "abdrahmanabza", "٤", "Tehzîb 3748"),
  E("ibnabbas", "abdrahmanabza", "—", "Tehzîb 3748"),
  E("ali", "abdrahmanabza", "—", "Tehzîb 3748"),
  E("omer", "abdrahmanabza", "خ", "Tehzîb 3748"),


  /* Abdurrahman b. Ebzâ (o. 70) -- talebeleri.
     Tehzîb 3748. Tercemede 11 kayit var, agda dugumu olan 3'i cizildi. */
  E("abdrahmanabza", "sabi", "د", "Tehzîb 3748"),
  E("abdrahmanabza", "ibnebileyla", "—", "Tehzîb 3748"),
  E("abdrahmanabza", "ebuishaksebii", "بخ", "Tehzîb 3748"),


  /* Ebû'l-Minhâl Abdurrahman b. Mut‘im (o. ?) -- hocalari.
     Tehzîb 3958. Tercemede 4 kayit var, agda dugumu olan 2'i cizildi. */
  E("bera", "ebulminhal", "خ م س", "Tehzîb 3958"),
  E("zeydarkam", "ebulminhal", "خ م س", "Tehzîb 3958"),


  /* Ebû'l-Minhâl Abdurrahman b. Mut‘im (o. ?) -- talebeleri.
     Tehzîb 3958. Tercemede 7 kayit var, agda dugumu olan 3'i cizildi. */
  E("ebulminhal", "ismailumeyye", "—", "Tehzîb 3958"),
  E("ebulminhal", "habibebisabit", "خ م س", "Tehzîb 3958"),
  E("ebulminhal", "amrdinar", "ع", "Tehzîb 3958"),


  /* Ömer b. Zerr el-Hemdânî (o. 153) -- hocalari.
     Tehzîb 4230. Tercemede 12 kayit var, agda dugumu olan 4'i cizildi. */
  E("saidcubeyr", "omerzerr", "—", "Tehzîb 4230"),
  E("ebuvail", "omerzerr", "—", "Tehzîb 4230"),
  E("ataebirebah", "omerzerr", "—", "Tehzîb 4230"),
  E("mucahid", "omerzerr", "خ د ت", "Tehzîb 4230"),


  /* Ömer b. Zerr el-Hemdânî (o. 153) -- talebeleri.
     Tehzîb 4230. Tercemede 32 kayit var, agda dugumu olan 9'i cizildi. */
  E("omerzerr", "ibnuyeyne", "—", "Tehzîb 4230"),
  E("omerzerr", "ebuasimnebil", "—", "Tehzîb 4230"),
  E("omerzerr", "ibnidris", "—", "Tehzîb 4230"),
  E("omerzerr", "ibnmubarek", "خ", "Tehzîb 4230"),
  E("omerzerr", "ebunuaymfadl", "خ", "Tehzîb 4230"),
  E("omerzerr", "mervanfezari", "—", "Tehzîb 4230"),
  E("omerzerr", "yalaubeyd", "ت", "Tehzîb 4230"),
  E("omerzerr", "yunusbukeyr", "ت", "Tehzîb 4230"),
  E("omerzerr", "ebumuaviyedarir", "—", "Tehzîb 4230"),


  /* Fıtr b. Halîfe (o. 155) -- hocalari.
     Tehzîb 4773. Tercemede 26 kayit var, agda dugumu olan 15'i cizildi. */
  E("habibebisabit", "fitrhalife", "—", "Tehzîb 4773"),
  E("sadubeyde", "fitrhalife", "دسي", "Tehzîb 4773"),
  E("ebuvail", "fitrhalife", "—", "Tehzîb 4773"),
  E("tavus", "fitrhalife", "—", "Tehzîb 4773"),
  E("asimbehdele", "fitrhalife", "د", "Tehzîb 4773"),
  E("ebutufeyl", "fitrhalife", "—", "Tehzîb 4773"),
  E("sabi", "fitrhalife", "—", "Tehzîb 4773"),
  E("ataebirebah", "fitrhalife", "س", "Tehzîb 4773"),
  E("ikrime", "fitrhalife", "—", "Tehzîb 4773"),
  E("amrhurays", "fitrhalife", "—", "Tehzîb 4773"),
  E("kasimebibezze", "fitrhalife", "دسي", "Tehzîb 4773"),
  E("mucahid", "fitrhalife", "خ د ت", "Tehzîb 4773"),
  E("ebuduha", "fitrhalife", "س", "Tehzîb 4773"),
  E("mansurmutemir", "fitrhalife", "—", "Tehzîb 4773"),
  E("ebuishaksebii", "fitrhalife", "س", "Tehzîb 4773"),


  /* Fıtr b. Halîfe (o. 155) -- talebeleri.
     Tehzîb 4773. Tercemede 23 kayit var, agda dugumu olan 7'i cizildi. */
  E("fitrhalife", "ebuusamehammad", "د", "Tehzîb 4773"),
  E("fitrhalife", "sevri", "خ د", "Tehzîb 4773"),
  E("fitrhalife", "ibnuyeyne", "ت", "Tehzîb 4773"),
  E("fitrhalife", "ibnmubarek", "س ق", "Tehzîb 4773"),
  E("fitrhalife", "ubeydullahmusa", "د", "Tehzîb 4773"),
  E("fitrhalife", "ebunuaymfadl", "بخ د", "Tehzîb 4773"),
  E("fitrhalife", "muhammedbisrabdi", "س", "Tehzîb 4773"),


  /* Abdülmelik b. Ebî Süleymân (o. 145) -- hocalari.
     Tehzîb 3532. Tercemede 11 kayit var, agda dugumu olan 6'i cizildi. */
  E("enessirin", "abdulmelikebisuleyman", "م", "Tehzîb 3532"),
  E("zubeydyami", "abdulmelikebisuleyman", "س", "Tehzîb 3532"),
  E("saidcubeyr", "abdulmelikebisuleyman", "ي م ت س", "Tehzîb 3532"),
  E("selemekuheyl", "abdulmelikebisuleyman", "م د", "Tehzîb 3532"),
  E("ataebirebah", "abdulmelikebisuleyman", "خت م ٤", "Tehzîb 3532"),
  E("ebuzubeyrmekki", "abdulmelikebisuleyman", "بخ م د س ق", "Tehzîb 3532"),


  /* Ebû İmrân el-Cevnî (o. 128) -- hocalari.
     Tehzîb 3521. Tercemede 15 kayit var, agda dugumu olan 2'i cizildi. */
  E("enes", "ebuimrancevni", "ع", "Tehzîb 3521"),
  E("aizamr", "ebuimrancevni", "—", "Tehzîb 3521"),


  /* Ebû İmrân el-Cevnî (o. 128) -- talebeleri.
     Tehzîb 3521. Tercemede 14 kayit var, agda dugumu olan 5'i cizildi. */
  E("ebuimrancevni", "ebansattar", "خت م", "Tehzîb 3521"),
  E("ebuimrancevni", "hammadzeyd", "خ م د س ق", "Tehzîb 3521"),
  E("ebuimrancevni", "suleymanteymi", "م", "Tehzîb 3521"),
  E("ebuimrancevni", "sallamebimuti", "خ س", "Tehzîb 3521"),
  E("ebuimrancevni", "sube", "خ م س ق", "Tehzîb 3521"),


  /* Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) (o. 126) -- hocalari.
     Tehzîb 932. Tercemede 30 kayit var, agda dugumu olan 11'i cizildi. */
  E("saidcubeyr", "caferebivahsiyye", "ع", "Tehzîb 932"),
  E("sehrhavseb", "caferebivahsiyye", "س ق", "Tehzîb 932"),
  E("tavus", "caferebivahsiyye", "—", "Tehzîb 932"),
  E("sabi", "caferebivahsiyye", "—", "Tehzîb 932"),
  E("abdullahsakik", "caferebivahsiyye", "بخ م", "Tehzîb 932"),
  E("ataebirebah", "caferebivahsiyye", "م د", "Tehzîb 932"),
  E("ikrime", "caferebivahsiyye", "خ د", "Tehzîb 932"),
  E("mucahid", "caferebivahsiyye", "د", "Tehzîb 932"),
  E("meymunmihran", "caferebivahsiyye", "م د", "Tehzîb 932"),
  E("nafiibnomer", "caferebivahsiyye", "تم س", "Tehzîb 932"),
  E("ebunadra", "caferebivahsiyye", "ت س ق", "Tehzîb 932"),


  /* Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) (o. 126) -- talebeleri.
     Tehzîb 932. Tercemede 10 kayit var, agda dugumu olan 3'i cizildi. */
  E("caferebivahsiyye", "davudebihind", "—", "Tehzîb 932"),
  E("caferebivahsiyye", "sufyanhusayn", "س", "Tehzîb 932"),
  E("caferebivahsiyye", "sube", "ع", "Tehzîb 932"),


  /* Nâfi‘ b. Ömer el-Cümahî (o. 169) -- hocalari.
     Tehzîb 6367. Tercemede 9 kayit var, agda dugumu olan 2'i cizildi. */
  E("ibnebimuleyke", "nafiomercumahi", "ع", "Tehzîb 6367"),
  E("amrdinar", "nafiomercumahi", "—", "Tehzîb 6367"),


  /* Nâfi‘ b. Ömer el-Cümahî (o. 169) -- talebeleri.
     Tehzîb 6367. Tercemede 37 kayit var, agda dugumu olan 11'i cizildi. */
  E("nafiomercumahi", "ebuusamehammad", "ت", "Tehzîb 6367"),
  E("nafiomercumahi", "ibnmubarek", "د", "Tehzîb 6367"),
  E("nafiomercumahi", "kanebi", "د", "Tehzîb 6367"),
  E("nafiomercumahi", "ibnmehdi", "—", "Tehzîb 6367"),
  E("nafiomercumahi", "ebunuaymfadl", "خ", "Tehzîb 6367"),
  E("nafiomercumahi", "muhammedbisrabdi", "م", "Tehzîb 6367"),
  E("nafiomercumahi", "musaismailtebuzeki", "—", "Tehzîb 6367"),
  E("nafiomercumahi", "hisamtayalisi", "—", "Tehzîb 6367"),
  E("nafiomercumahi", "veki", "خ د ق", "Tehzîb 6367"),
  E("nafiomercumahi", "kattan", "—", "Tehzîb 6367"),
  E("nafiomercumahi", "yezidharun", "س ق", "Tehzîb 6367"),


  /* Ebû Mâlik el-Eşce‘î (o. ?) -- hocalari.
     Tehzîb 2211. Tercemede 15 kayit var, agda dugumu olan 4'i cizildi. */
  E("enes", "ebumalikesceyi", "—", "Tehzîb 2211"),
  E("rebihiras", "ebumalikesceyi", "خت م س ق", "Tehzîb 2211"),
  E("sadubeyde", "ebumalikesceyi", "م", "Tehzîb 2211"),
  E("musatalha", "ebumalikesceyi", "م ت", "Tehzîb 2211"),


  /* Ebû Mâlik el-Eşce‘î (o. ?) -- talebeleri.
     Tehzîb 2211. Tercemede 20 kayit var, agda dugumu olan 10'i cizildi. */
  E("ebumalikesceyi", "hafsgiyas", "ق", "Tehzîb 2211"),
  E("ebumalikesceyi", "sevri", "بخ د", "Tehzîb 2211"),
  E("ebumalikesceyi", "sube", "—", "Tehzîb 2211"),
  E("ebumalikesceyi", "ibnidris", "ق", "Tehzîb 2211"),
  E("ebumalikesceyi", "abdulvahidziyad", "م", "Tehzîb 2211"),
  E("ebumalikesceyi", "ibnishak", "د", "Tehzîb 2211"),
  E("ebumalikesceyi", "muhammedfudayl", "م س ق", "Tehzîb 2211"),
  E("ebumalikesceyi", "mervanfezari", "بخ م س", "Tehzîb 2211"),
  E("ebumalikesceyi", "yezidharun", "م ت ق", "Tehzîb 2211"),
  E("ebumalikesceyi", "ms29", "م ت", "Tehzîb 2211"),


  /* Abdülvâhid b. Ziyâd (o. 176) -- hocalari.
     Tehzîb 3585. Tercemede 47 kayit var, agda dugumu olan 12'i cizildi. */
  E("ebuburde", "abdulvahidziyad", "خ", "Tehzîb 3585"),
  E("haccacertat", "abdulvahidziyad", "بخ د ت", "Tehzîb 3585"),
  E("hasanubeydullah", "abdulvahidziyad", "م س", "Tehzîb 3585"),
  E("hasanamrfukaymi", "abdulvahidziyad", "خ", "Tehzîb 3585"),
  E("cureyri", "abdulvahidziyad", "م", "Tehzîb 3585"),
  E("amess", "abdulvahidziyad", "خ م دت", "Tehzîb 3585"),
  E("salihhayy", "abdulvahidziyad", "خ مد", "Tehzîb 3585"),
  E("asimahvel", "abdulvahidziyad", "خ م ق", "Tehzîb 3585"),
  E("amrmeymunmihran", "abdulvahidziyad", "خ م", "Tehzîb 3585"),
  E("leysebisuleym", "abdulvahidziyad", "بخ س", "Tehzîb 3585"),
  E("mucalidsaid", "abdulvahidziyad", "دق", "Tehzîb 3585"),
  E("mamer", "abdulvahidziyad", "م", "Tehzîb 3585"),


  /* Hasan b. Amr el-Fukaymî (o. 142) -- hocalari.
     Tehzîb 1256. Tercemede 17 kayit var, agda dugumu olan 6'i cizildi. */
  E("nehai", "hasanamrfukaymi", "—", "Tehzîb 1256"),
  E("hakemuteybe", "hasanamrfukaymi", "د", "Tehzîb 1256"),
  E("saidcubeyr", "hasanamrfukaymi", "—", "Tehzîb 1256"),
  E("kazaayahya", "hasanamrfukaymi", "—", "Tehzîb 1256"),
  E("mucahid", "hasanamrfukaymi", "خ د س ق", "Tehzîb 1256"),
  E("ebuzubeyrmekki", "hasanamrfukaymi", "ق", "Tehzîb 1256"),


  /* Hasan b. Amr el-Fukaymî (o. 142) -- talebeleri.
     Tehzîb 1256. Tercemede 21 kayit var, agda dugumu olan 5'i cizildi. */
  E("hasanamrfukaymi", "hafsgiyas", "—", "Tehzîb 1256"),
  E("hasanamrfukaymi", "ibnnumeyr", "—", "Tehzîb 1256"),
  E("hasanamrfukaymi", "muhammedfudayl", "قد ق", "Tehzîb 1256"),
  E("hasanamrfukaymi", "mervanfezari", "قد س", "Tehzîb 1256"),
  E("hasanamrfukaymi", "ebubekirayyas", "بخ", "Tehzîb 1256"),


  /* Büreyd b. Abdillâh b. Ebî Bürde (o. ?) -- hocalari.
     Tehzîb 659. Tercemede 5 kayit var, agda dugumu olan 2'i cizildi. */
  E("hasanbasri", "ebuburde", "—", "Tehzîb 659"),
  E("ataebirebah", "ebuburde", "—", "Tehzîb 659"),


  /* Büreyd b. Abdillâh b. Ebî Bürde (o. ?) -- talebeleri.
     Tehzîb 659. Tercemede 19 kayit var, agda dugumu olan 7'i cizildi. */
  E("ebuburde", "hafsgiyas", "خ م ت", "Tehzîb 659"),
  E("ebuburde", "ebuusamehammad", "ع", "Tehzîb 659"),
  E("ebuburde", "sevri", "خ س", "Tehzîb 659"),
  E("ebuburde", "ibnuyeyne", "م د ت", "Tehzîb 659"),
  E("ebuburde", "ibnidris", "م", "Tehzîb 659"),
  E("ebuburde", "ebunuaymfadl", "—", "Tehzîb 659"),
  E("ebuburde", "mervanfezari", "—", "Tehzîb 659"),


  /* Abdýlazîz b. Suheyb (o. 130) -- hocalari.
     Tehzîb 3453. Tercemede 8 kayit var, agda dugumu olan 3'i cizildi. */
  E("enes", "abdulazizsuheyb", "ع", "Tehzîb 3453"),
  E("sehrhavseb", "abdulazizsuheyb", "—", "Tehzîb 3453"),
  E("ebunadra", "abdulazizsuheyb", "م ت س ق", "Tehzîb 3453"),


  /* Abdýlazîz b. Suheyb (o. 130) -- talebeleri.
     Tehzîb 3453. Tercemede 27 kayit var, agda dugumu olan 11'i cizildi. */
  E("abdulazizsuheyb", "ibrahimtahman", "خت", "Tehzîb 3453"),
  E("abdulazizsuheyb", "ibnuleyye", "ع", "Tehzîb 3453"),
  E("abdulazizsuheyb", "hakemuteybe", "—", "Tehzîb 3453"),
  E("abdulazizsuheyb", "hammadzeyd", "ع", "Tehzîb 3453"),
  E("abdulazizsuheyb", "hammadseleme", "خت", "Tehzîb 3453"),
  E("abdulazizsuheyb", "saidabdulaziz", "—", "Tehzîb 3453"),
  E("abdulazizsuheyb", "sube", "خ م د ت س", "Tehzîb 3453"),
  E("abdulazizsuheyb", "abdulvarissaid", "ع", "Tehzîb 3453"),
  E("abdulazizsuheyb", "alimubarekhinai", "س", "Tehzîb 3453"),
  E("abdulazizsuheyb", "hisamhassan", "س", "Tehzîb 3453"),
  E("abdulazizsuheyb", "vuheybhalid", "خ م", "Tehzîb 3453"),


  /* Kâsım b. Ebî Bezze (o. 124) -- hocalari.
     Tehzîb 4782. Tercemede 11 kayit var, agda dugumu olan 6'i cizildi. */
  E("saidcubeyr", "kasimebibezze", "خ م س", "Tehzîb 4782"),
  E("ebutufeyl", "kasimebibezze", "بخ م د س", "Tehzîb 4782"),
  E("ataihorasani", "kasimebibezze", "سي", "Tehzîb 4782"),
  E("ikrime", "kasimebibezze", "—", "Tehzîb 4782"),
  E("mucahid", "kasimebibezze", "—", "Tehzîb 4782"),
  E("nafiibnomer", "kasimebibezze", "—", "Tehzîb 4782"),


  /* Kâsım b. Ebî Bezze (o. 124) -- talebeleri.
     Tehzîb 4782. Tercemede 15 kayit var, agda dugumu olan 5'i cizildi. */
  E("kasimebibezze", "haccacertat", "ت ق", "Tehzîb 4782"),
  E("kasimebibezze", "davudattar", "—", "Tehzîb 4782"),
  E("kasimebibezze", "sube", "بخ م د س", "Tehzîb 4782"),
  E("kasimebibezze", "abdulmelikebisuleyman", "—", "Tehzîb 4782"),
  E("kasimebibezze", "misersukdam", "—", "Tehzîb 4782"),


  /* Rabî‘ b. Enes (o. 139) -- hocalari.
     Tehzîb 1853. Tercemede 5 kayit var, agda dugumu olan 3'i cizildi. */
  E("enes", "rebiuenes", "د ت ق", "Tehzîb 1853"),
  E("hasanbasri", "rebiuenes", "—", "Tehzîb 1853"),
  E("safvanmuhriz", "rebiuenes", "—", "Tehzîb 1853"),


  /* Rabî‘ b. Enes (o. 139) -- talebeleri.
     Tehzîb 1853. Tercemede 17 kayit var, agda dugumu olan 3'i cizildi. */
  E("rebiuenes", "sevri", "—", "Tehzîb 1853"),
  E("rebiuenes", "suleymanteymi", "قد", "Tehzîb 1853"),
  E("rebiuenes", "amess", "—", "Tehzîb 1853"),


  /* Süleym b. Hayyân (o. ?) -- hocalari.
     Tehzîb 2490. Tercemede 12 kayit var, agda dugumu olan 4'i cizildi. */
  E("eyyubsahtiyani", "selimhayyan", "—", "Tehzîb 2490"),
  E("ikrimehalid", "selimhayyan", "—", "Tehzîb 2490"),
  E("amrdinar", "selimhayyan", "خ", "Tehzîb 2490"),
  E("nafiibnomer", "selimhayyan", "—", "Tehzîb 2490"),


  /* Süleym b. Hayyân (o. ?) -- talebeleri.
     Tehzîb 2490. Tercemede 20 kayit var, agda dugumu olan 8'i cizildi. */
  E("selimhayyan", "bisrsari", "—", "Tehzîb 2490"),
  E("selimhayyan", "ebudavudtayalisi", "—", "Tehzîb 2490"),
  E("selimhayyan", "abdussamed", "خ م ت", "Tehzîb 2490"),
  E("selimhayyan", "affanmuslim", "م", "Tehzîb 2490"),
  E("selimhayyan", "amrmerzuk", "—", "Tehzîb 2490"),
  E("selimhayyan", "muslimibrahim", "—", "Tehzîb 2490"),
  E("selimhayyan", "muazmuaz", "—", "Tehzîb 2490"),
  E("selimhayyan", "yezidharun", "خ م", "Tehzîb 2490"),


  /* Hâtim b. Ebî Sagīre (o. 152) -- hocalari.
     Tehzîb 996. Tercemede 11 kayit var, agda dugumu olan 5'i cizildi. */
  E("habibebisabit", "hatimebisagire", "سي", "Tehzîb 996"),
  E("simakharb", "hatimebisagire", "م د ت س", "Tehzîb 996"),
  E("ibnebimuleyke", "hatimebisagire", "خ م س ق", "Tehzîb 996"),
  E("ataebirebah", "hatimebisagire", "س", "Tehzîb 996"),
  E("amrdinar", "hatimebisagire", "س", "Tehzîb 996"),


  /* Sellâm b. Ebî Mutī‘ (o. 164) -- hocalari.
     Tehzîb 2663. Tercemede 20 kayit var, agda dugumu olan 9'i cizildi. */
  E("eyyubsahtiyani", "sallamebimuti", "م س", "Tehzîb 2663"),
  E("cabircufi", "sallamebimuti", "—", "Tehzîb 2663"),
  E("davudebihind", "sallamebimuti", "—", "Tehzîb 2663"),
  E("salihhayy", "sallamebimuti", "—", "Tehzîb 2663"),
  E("ebuhasin", "sallamebimuti", "—", "Tehzîb 2663"),
  E("katade", "sallamebimuti", "ت س ق", "Tehzîb 2663"),
  E("mamer", "sallamebimuti", "س", "Tehzîb 2663"),
  E("mansurmutemir", "sallamebimuti", "—", "Tehzîb 2663"),
  E("hisamurve", "sallamebimuti", "خ", "Tehzîb 2663"),


  /* Sellâm b. Ebî Mutī‘ (o. 164) -- talebeleri.
     Tehzîb 2663. Tercemede 26 kayit var, agda dugumu olan 6'i cizildi. */
  E("sallamebimuti", "ibnmubarek", "م س", "Tehzîb 2663"),
  E("sallamebimuti", "alicad", "—", "Tehzîb 2663"),
  E("sallamebimuti", "misned", "—", "Tehzîb 2663"),
  E("sallamebimuti", "musaismailtebuzeki", "خ", "Tehzîb 2663"),
  E("sallamebimuti", "hebbanhilal", "—", "Tehzîb 2663"),
  E("sallamebimuti", "hisamtayalisi", "مق س", "Tehzîb 2663"),


  /* Ali b. Sâlih b. Hayy (o. 151) -- hocalari.
     Tehzîb 4084. Tercemede 22 kayit var, agda dugumu olan 10'i cizildi. */
  E("ismailebihalid", "aliebisalihhayy", "—", "Tehzîb 4084"),
  E("esvedkays", "aliebisalihhayy", "—", "Tehzîb 4084"),
  E("selemekuheyl", "aliebisalihhayy", "م د ت س", "Tehzîb 4084"),
  E("amess", "aliebisalihhayy", "—", "Tehzîb 4084"),
  E("simakharb", "aliebisalihhayy", "د س ق", "Tehzîb 4084"),
  E("salihhayy", "aliebisalihhayy", "—", "Tehzîb 4084"),
  E("asimbehdele", "aliebisalihhayy", "س", "Tehzîb 4084"),
  E("mugirmiksem", "aliebisalihhayy", "—", "Tehzîb 4084"),
  E("mansurmutemir", "aliebisalihhayy", "س", "Tehzîb 4084"),
  E("ebuishaksebii", "aliebisalihhayy", "س", "Tehzîb 4084"),


  /* Ali b. Sâlih b. Hayy (o. 151) -- talebeleri.
     Tehzîb 4084. Tercemede 17 kayit var, agda dugumu olan 4'i cizildi. */
  E("aliebisalihhayy", "ibnuyeyne", "—", "Tehzîb 4084"),
  E("aliebisalihhayy", "ibnnumeyr", "د", "Tehzîb 4084"),
  E("aliebisalihhayy", "ubeydullahmusa", "د س", "Tehzîb 4084"),
  E("aliebisalihhayy", "ebunuaymfadl", "—", "Tehzîb 4084"),


  /* Muhammed b. Fudayl b. Gazvân (o. 195) -- hocalari.
     Tehzîb 5548. Tercemede 52 kayit var, agda dugumu olan 16'i cizildi. */
  E("ismailebihalid", "muhammedfudayl", "خ م", "Tehzîb 5548"),
  E("beyanbisr", "muhammedfudayl", "م د ق", "Tehzîb 5548"),
  E("haccacertat", "muhammedfudayl", "ق", "Tehzîb 5548"),
  E("hasanubeydullah", "muhammedfudayl", "د س", "Tehzîb 5548"),
  E("husaynabdrahman", "muhammedfudayl", "خ م ق", "Tehzîb 5548"),
  E("hamzazeyyat", "muhammedfudayl", "ت", "Tehzîb 5548"),
  E("davudebihind", "muhammedfudayl", "—", "Tehzîb 5548"),
  E("zekeriyyaebizaide", "muhammedfudayl", "ق", "Tehzîb 5548"),
  E("amess", "muhammedfudayl", "ع", "Tehzîb 5548"),
  E("asimahvel", "muhammedfudayl", "خ م", "Tehzîb 5548"),
  E("abdulmelikebisuleyman", "muhammedfudayl", "س", "Tehzîb 5548"),
  E("ataisaib", "muhammedfudayl", "ت س ق", "Tehzîb 5548"),
  E("leysebisuleym", "muhammedfudayl", "بخ", "Tehzîb 5548"),
  E("malikmigvel", "muhammedfudayl", "—", "Tehzîb 5548"),
  E("mucalidsaid", "muhammedfudayl", "ق", "Tehzîb 5548"),
  E("ibnishak", "muhammedfudayl", "س", "Tehzîb 5548"),


  /* Abdüsselâm b. Harb (o. 187) -- hocalari.
     Tehzîb 3418. Tercemede 23 kayit var, agda dugumu olan 8'i cizildi. */
  E("eyyubsahtiyani", "abdusselamharb", "خ", "Tehzîb 3418"),
  E("halidhazza", "abdusselamharb", "د", "Tehzîb 3418"),
  E("saidubeydtai", "abdusselamharb", "—", "Tehzîb 3418"),
  E("amess", "abdusselamharb", "دت", "Tehzîb 3418"),
  E("ataisaib", "abdusselamharb", "د", "Tehzîb 3418"),
  E("leysebisuleym", "abdusselamharb", "بخ د ت", "Tehzîb 3418"),
  E("hisamhassan", "abdusselamharb", "خ س ق", "Tehzîb 3418"),
  E("yahyasaidensari", "abdusselamharb", "ت س", "Tehzîb 3418"),


  /* Abdüsselâm b. Harb (o. 187) -- talebeleri.
     Tehzîb 3418. Tercemede 35 kayit var, agda dugumu olan 10'i cizildi. */
  E("abdusselamharb", "ahmedhanbel", "—", "Tehzîb 3418"),
  E("abdusselamharb", "hasanarafe", "—", "Tehzîb 3418"),
  E("abdusselamharb", "ebuusamehammad", "ص", "Tehzîb 3418"),
  E("abdusselamharb", "ibnebiseybe", "ق", "Tehzîb 3418"),
  E("abdusselamharb", "osmanebiseybe", "د", "Tehzîb 3418"),
  E("abdusselamharb", "amrnakid", "—", "Tehzîb 3418"),
  E("abdusselamharb", "ebunuaymfadl", "خ ت", "Tehzîb 3418"),
  E("abdusselamharb", "kuteybesaid", "ت س", "Tehzîb 3418"),
  E("abdusselamharb", "muhammedubeydmuharibi", "ت", "Tehzîb 3418"),
  E("abdusselamharb", "muhammedisataba", "د", "Tehzîb 3418"),


  /* Avvâm b. Havşeb (o. 148) -- hocalari.
     Tehzîb 4541. Tercemede 25 kayit var, agda dugumu olan 10'i cizildi. */
  E("ibrahimteymi", "avvamhavseb", "—", "Tehzîb 4541"),
  E("nehai", "avvamhavseb", "—", "Tehzîb 4541"),
  E("cebeleshim", "avvamhavseb", "ق", "Tehzîb 4541"),
  E("habibebisabit", "avvamhavseb", "د", "Tehzîb 4541"),
  E("selemekuheyl", "avvamhavseb", "س", "Tehzîb 4541"),
  E("ataisaib", "avvamhavseb", "سي", "Tehzîb 4541"),
  E("mucahid", "avvamhavseb", "خ س ق", "Tehzîb 4541"),
  E("yezidsuheybfakir", "avvamhavseb", "—", "Tehzîb 4541"),
  E("ebuishaksebii", "avvamhavseb", "سي", "Tehzîb 4541"),
  E("ismailebiislamsibani", "avvamhavseb", "م", "Tehzîb 4541"),


  /* Alâ b. Abdirrahman (o. 132) -- hocalari.
     Tehzîb 4577. Tercemede 15 kayit var, agda dugumu olan 4'i cizildi. */
  E("enes", "alaabdrahman", "م د ت س", "Tehzîb 4577"),
  E("salimibnomer", "alaabdrahman", "ي", "Tehzîb 4577"),
  E("ibnomer", "alaabdrahman", "—", "Tehzîb 4577"),
  E("ikrime", "alaabdrahman", "—", "Tehzîb 4577"),


  /* Alâ b. Abdirrahman (o. 132) -- talebeleri.
     Tehzîb 4577. Tercemede 29 kayit var, agda dugumu olan 9'i cizildi. */
  E("alaabdrahman", "sadsaidensari", "—", "Tehzîb 4577"),
  E("alaabdrahman", "sevri", "—", "Tehzîb 4577"),
  E("alaabdrahman", "ibnuyeyne", "ر م د س ق", "Tehzîb 4577"),
  E("alaabdrahman", "suleymanbilal", "ي م د", "Tehzîb 4577"),
  E("alaabdrahman", "sube", "ر م ق", "Tehzîb 4577"),
  E("alaabdrahman", "ibncafer", "ت", "Tehzîb 4577"),
  E("alaabdrahman", "abdulhamidcafer", "ت س", "Tehzîb 4577"),
  E("alaabdrahman", "darevardi", "ر م ٤", "Tehzîb 4577"),
  E("alaabdrahman", "ubeydullahomeri", "—", "Tehzîb 4577"),


  /* Hubîb b. Abdirrahman (o. 132) -- hocalari.
     Tehzîb 1678. Tercemede 5 kayit var, agda dugumu olan 1'i cizildi. */
  E("hafsasim", "hubeybabdrahman", "ع", "Tehzîb 1678"),


  /* Esved b. Kays (o. ?) -- talebeleri.
     Tehzîb 506. Tercemede 11 kayit var, agda dugumu olan 7'i cizildi. */
  E("esvedkays", "ibrahimtahman", "—", "Tehzîb 506"),
  E("esvedkays", "israilyunus", "—", "Tehzîb 506"),
  E("esvedkays", "zuhayrmuaviye", "خ م د س", "Tehzîb 506"),
  E("esvedkays", "ibnuyeyne", "م ت س ق", "Tehzîb 506"),
  E("esvedkays", "ebulahvess", "م س", "Tehzîb 506"),
  E("esvedkays", "serikkadi", "—", "Tehzîb 506"),
  E("esvedkays", "sube", "خ م د ت", "Tehzîb 506"),


  /* Alkame b. Vakkâs el-Leysî (o. ?) -- hocalari.
     Tehzîb 4021. Tercemede 6 kayit var, agda dugumu olan 2'i cizildi. */
  E("ibnomer", "alkamevakkas", "خ", "Tehzîb 4021"),
  E("omer", "alkamevakkas", "ع", "Tehzîb 4021"),


  /* Alkame b. Vakkâs el-Leysî (o. ?) -- talebeleri.
     Tehzîb 4021. Tercemede 7 kayit var, agda dugumu olan 3'i cizildi. */
  E("alkamevakkas", "ibnebimuleyke", "خ", "Tehzîb 4021"),
  E("alkamevakkas", "amryahyamazini", "—", "Tehzîb 4021"),
  E("alkamevakkas", "muhammedibrahimteymi", "ع", "Tehzîb 4021"),


  /* Abdurrahman b. el-Esved (o. ?) -- hocalari.
     Tehzîb 3758. Tercemede 7 kayit var, agda dugumu olan 5'i cizildi. */
  E("esvedyezid", "abdrahmanesved", "ع", "Tehzîb 3758"),
  E("enes", "abdrahmanesved", "—", "Tehzîb 3758"),
  E("ibnzubeyr", "abdrahmanesved", "—", "Tehzîb 3758"),
  E("alkame", "abdrahmanesved", "—", "Tehzîb 3758"),
  E("aise", "abdrahmanesved", "س", "Tehzîb 3758"),


  /* Abdurrahman b. el-Esved (o. ?) -- talebeleri.
     Tehzîb 3758. Tercemede 31 kayit var, agda dugumu olan 12'i cizildi. */
  E("abdrahmanesved", "ismailebihalid", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "beyanbisr", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "cabircufi", "ت", "Tehzîb 3758"),
  E("abdrahmanesved", "haccacertat", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "hasanubeydullah", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "hakemuteybe", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "zubeydyami", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "amess", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "mesudi", "—", "Tehzîb 3758"),
  E("abdrahmanesved", "malikmigvel", "م", "Tehzîb 3758"),
  E("abdrahmanesved", "ebuishaksebii", "ع", "Tehzîb 3758"),
  E("abdrahmanesved", "ismailebiislamsibani", "خ م د س ق", "Tehzîb 3758"),


  /* Süfyân b. Vekî‘ (o. 247) -- hocalari.
     Tehzîb 2418. Tercemede 47 kayit var, agda dugumu olan 24'i cizildi. */
  E("ishakyusufezrak", "sufyanveki", "ت", "Tehzîb 2418"),
  E("ibnuleyye", "sufyanveki", "ق", "Tehzîb 2418"),
  E("cerirabdulhamid", "sufyanveki", "ت", "Tehzîb 2418"),
  E("hafsgiyas", "sufyanveki", "ت ق", "Tehzîb 2418"),
  E("ebuusamehammad", "sufyanveki", "ت", "Tehzîb 2418"),
  E("ruhubade", "sufyanveki", "ق", "Tehzîb 2418"),
  E("ibnuyeyne", "sufyanveki", "ت", "Tehzîb 2418"),
  E("ibnidris", "sufyanveki", "—", "Tehzîb 2418"),
  E("ibnnumeyr", "sufyanveki", "ت", "Tehzîb 2418"),
  E("ibnvehb", "sufyanveki", "ت", "Tehzîb 2418"),
  E("abdulalaabdulala", "sufyanveki", "ت", "Tehzîb 2418"),
  E("ibnmehdi", "sufyanveki", "ت", "Tehzîb 2418"),
  E("abdusselamharb", "sufyanveki", "—", "Tehzîb 2418"),
  E("ubeydullahmusa", "sufyanveki", "—", "Tehzîb 2418"),
  E("isabyunus", "sufyanveki", "ت ق", "Tehzîb 2418"),
  E("muhammedebiadi", "sufyanveki", "ت", "Tehzîb 2418"),
  E("muhammedfudayl", "sufyanveki", "ت", "Tehzîb 2418"),
  E("muazmuaz", "sufyanveki", "—", "Tehzîb 2418"),
  E("veki", "sufyanveki", "ت ق", "Tehzîb 2418"),
  E("yahyaadem", "sufyanveki", "ت", "Tehzîb 2418"),
  E("kattan", "sufyanveki", "ت", "Tehzîb 2418"),
  E("yezidharun", "sufyanveki", "ت", "Tehzîb 2418"),
  E("yunusbukeyr", "sufyanveki", "ق", "Tehzîb 2418"),
  E("ebubekirayyas", "sufyanveki", "—", "Tehzîb 2418"),


  /* Süfyân b. Vekî‘ (o. 247) -- talebeleri.
     Tehzîb 2418. Tercemede 23 kayit var, agda dugumu olan 5'i cizildi. */
  E("sufyanveki", "tirmizi", "—", "Tehzîb 2418"),
  E("sufyanveki", "ibnmace", "—", "Tehzîb 2418"),
  E("sufyanveki", "ed17", "—", "Tehzîb 2418"),
  E("sufyanveki", "ed20", "—", "Tehzîb 2418"),
  E("sufyanveki", "ms28", "—", "Tehzîb 2418"),


  /* Hârûn b. Abdillâh el-Hammâl (o. 243) -- hocalari.
     Tehzîb 6520. Tercemede 60 kayit var, agda dugumu olan 19'i cizildi. */
  E("caferavn", "harunhammal", "م", "Tehzîb 6520"),
  E("ebuusamehammad", "harunhammal", "م دس", "Tehzîb 6520"),
  E("ruhubade", "harunhammal", "م س", "Tehzîb 6520"),
  E("saidsuleymansadeviye", "harunhammal", "د", "Tehzîb 6520"),
  E("ibnuyeyne", "harunhammal", "س ق", "Tehzîb 6520"),
  E("suleymanharb", "harunhammal", "م", "Tehzîb 6520"),
  E("ebudavudtayalisi", "harunhammal", "م د ت س", "Tehzîb 6520"),
  E("ebuasimnebil", "harunhammal", "م ت", "Tehzîb 6520"),
  E("humeydi", "harunhammal", "د", "Tehzîb 6520"),
  E("ibnnumeyr", "harunhammal", "—", "Tehzîb 6520"),
  E("abdussamed", "harunhammal", "م د ت س", "Tehzîb 6520"),
  E("affanmuslim", "harunhammal", "م", "Tehzîb 6520"),
  E("ebunuaymfadl", "harunhammal", "دت", "Tehzîb 6520"),
  E("muhammedbisrabdi", "harunhammal", "د", "Tehzîb 6520"),
  E("muhammedharbhavlani", "harunhammal", "ت", "Tehzîb 6520"),
  E("yahyaadem", "harunhammal", "د", "Tehzîb 6520"),
  E("yezidharun", "harunhammal", "م س", "Tehzîb 6520"),
  E("yalaubeyd", "harunhammal", "د", "Tehzîb 6520"),
  E("hisamtayalisi", "harunhammal", "دس", "Tehzîb 6520"),


  /* Hârûn b. Abdillâh el-Hammâl (o. 243) -- talebeleri.
     Tehzîb 6520. Tercemede 18 kayit var, agda dugumu olan 10'i cizildi. */
  E("harunhammal", "muslim", "—", "Tehzîb 6520"),
  E("harunhammal", "ebudavud", "—", "Tehzîb 6520"),
  E("harunhammal", "tirmizi", "—", "Tehzîb 6520"),
  E("harunhammal", "nesai", "—", "Tehzîb 6520"),
  E("harunhammal", "ibnmace", "—", "Tehzîb 6520"),
  E("harunhammal", "bh03", "—", "Tehzîb 6520"),
  E("harunhammal", "ed20", "—", "Tehzîb 6520"),
  E("harunhammal", "ms28", "—", "Tehzîb 6520"),
  E("harunhammal", "ebuhatimrazi", "—", "Tehzîb 6520"),
  E("harunhammal", "ebuzuraraazi", "—", "Tehzîb 6520"),


  /* Muhammed b. Sellâm el-Bîkendî (o. 225) -- hocalari.
     Tehzîb 5278. Tercemede 52 kayit var, agda dugumu olan 20'i cizildi. */
  E("ibrahimfezari", "ibnsellam", "خ", "Tehzîb 5278"),
  E("ibnuleyye", "ibnsellam", "خ", "Tehzîb 5278"),
  E("ismailayyas", "ibnsellam", "بخ", "Tehzîb 5278"),
  E("enesiyaz", "ibnsellam", "خ", "Tehzîb 5278"),
  E("cerirabdulhamid", "ibnsellam", "خ", "Tehzîb 5278"),
  E("ibnuyeyne", "ibnsellam", "خ", "Tehzîb 5278"),
  E("ebulahvess", "ibnsellam", "خ", "Tehzîb 5278"),
  E("ibnidris", "ibnsellam", "بخ", "Tehzîb 5278"),
  E("ibnmubarek", "ibnsellam", "—", "Tehzîb 5278"),
  E("ibnnumeyr", "ibnsellam", "خ", "Tehzîb 5278"),
  E("abdulalaabdulala", "ibnsellam", "بخ", "Tehzîb 5278"),
  E("abdesuleyman", "ibnsellam", "خ", "Tehzîb 5278"),
  E("malik", "ibnsellam", "—", "Tehzîb 5278"),
  E("ebumuaviyedarir", "ibnsellam", "خ", "Tehzîb 5278"),
  E("muhammedfudayl", "ibnsellam", "خ", "Tehzîb 5278"),
  E("mervanfezari", "ibnsellam", "خ", "Tehzîb 5278"),
  E("mutemirsuleyman", "ibnsellam", "خ", "Tehzîb 5278"),
  E("huseym", "ibnsellam", "بخ", "Tehzîb 5278"),
  E("veki", "ibnsellam", "خ", "Tehzîb 5278"),
  E("yezidharun", "ibnsellam", "خ", "Tehzîb 5278"),


  /* Muhammed b. Sellâm el-Bîkendî (o. 225) -- talebeleri.
     Tehzîb 5278. Tercemede 27 kayit var, agda dugumu olan 1'i cizildi. */
  E("ibnsellam", "buhari", "—", "Tehzîb 5278"),


  /* Habbân b. Hilâl (o. 216) -- hocalari.
     Tehzîb 1064. Tercemede 27 kayit var, agda dugumu olan 10'i cizildi. */
  E("ebansattar", "habbanhilal", "م س", "Tehzîb 1064"),
  E("cerirhazim", "habbanhilal", "س", "Tehzîb 1064"),
  E("hammadseleme", "habbanhilal", "م ت س", "Tehzîb 1064"),
  E("suleymanmugire", "habbanhilal", "م", "Tehzîb 1064"),
  E("sube", "habbanhilal", "خ", "Tehzîb 1064"),
  E("abdulvarissaid", "habbanhilal", "س", "Tehzîb 1064"),
  E("mamer", "habbanhilal", "ت", "Tehzîb 1064"),
  E("hemmamyahya", "habbanhilal", "ع", "Tehzîb 1064"),
  E("ebuavane", "habbanhilal", "م س", "Tehzîb 1064"),
  E("vuheybhalid", "habbanhilal", "م س", "Tehzîb 1064"),


  /* Habbân b. Hilâl (o. 216) -- talebeleri.
     Tehzîb 1064. Tercemede 25 kayit var, agda dugumu olan 8'i cizildi. */
  E("habbanhilal", "ishakkevsec", "خ م ت ق", "Tehzîb 1064"),
  E("habbanhilal", "zuheyrharb", "م", "Tehzîb 1064"),
  E("habbanhilal", "darimi", "م", "Tehzîb 1064"),
  E("habbanhilal", "abdhumeyd", "م ت", "Tehzîb 1064"),
  E("habbanhilal", "alimedini", "—", "Tehzîb 1064"),
  E("habbanhilal", "amrbnalisayrafi", "—", "Tehzîb 1064"),
  E("habbanhilal", "bundar", "—", "Tehzîb 1064"),
  E("habbanhilal", "ibnmusenna", "—", "Tehzîb 1064"),


  /* Abdül'alâ b. Hammâd en-Nersî (o. 237) -- hocalari.
     Tehzîb 3683. Tercemede 36 kayit var, agda dugumu olan 18'i cizildi. */
  E("bisrsari", "nersi", "س", "Tehzîb 3683"),
  E("hammadzeyd", "nersi", "م دس", "Tehzîb 3683"),
  E("hammadseleme", "nersi", "م د س", "Tehzîb 3683"),
  E("davudattar", "nersi", "د س", "Tehzîb 3683"),
  E("ibnuyeyne", "nersi", "م د", "Tehzîb 3683"),
  E("ebulahvess", "nersi", "—", "Tehzîb 3683"),
  E("sallamebimuti", "nersi", "—", "Tehzîb 3683"),
  E("ibnvehb", "nersi", "—", "Tehzîb 3683"),
  E("ibnmehdi", "nersi", "—", "Tehzîb 3683"),
  E("darevardi", "nersi", "—", "Tehzîb 3683"),
  E("isabyunus", "nersi", "—", "Tehzîb 3683"),
  E("malik", "nersi", "م", "Tehzîb 3683"),
  E("mutemirsuleyman", "nersi", "م", "Tehzîb 3683"),
  E("veki", "nersi", "—", "Tehzîb 3683"),
  E("vuheybhalid", "nersi", "خ م سي", "Tehzîb 3683"),
  E("kattan", "nersi", "—", "Tehzîb 3683"),
  E("yezidzurey", "nersi", "خ س", "Tehzîb 3683"),
  E("yezidharun", "nersi", "—", "Tehzîb 3683"),


  /* Abdül'alâ b. Hammâd en-Nersî (o. 237) -- talebeleri.
     Tehzîb 3683. Tercemede 37 kayit var, agda dugumu olan 7'i cizildi. */
  E("nersi", "buhari", "—", "Tehzîb 3683"),
  E("nersi", "muslim", "—", "Tehzîb 3683"),
  E("nersi", "ebudavud", "—", "Tehzîb 3683"),
  E("nersi", "bh05", "س", "Tehzîb 3683"),
  E("nersi", "bh09", "—", "Tehzîb 3683"),
  E("nersi", "ebuzuraraazi", "—", "Tehzîb 3683"),
  E("nersi", "ebuhatimrazi", "—", "Tehzîb 3683"),


  /* Duhaym, Abdurrahman b. İbrâhim (o. 245) -- hocalari.
     Tehzîb 3747. Tercemede 43 kayit var, agda dugumu olan 17'i cizildi. */
  E("ademebiiyas", "duhaym", "—", "Tehzîb 3747"),
  E("ishakyusufezrak", "duhaym", "سي", "Tehzîb 3747"),
  E("enesiyaz", "duhaym", "ق", "Tehzîb 3747"),
  E("bisrbekirtennisi", "duhaym", "د ق", "Tehzîb 3747"),
  E("ebuusamehammad", "duhaym", "ق", "Tehzîb 3747"),
  E("said_mansur", "duhaym", "—", "Tehzîb 3747"),
  E("ibnuyeyne", "duhaym", "—", "Tehzîb 3747"),
  E("suaybishakdimaski", "duhaym", "ق", "Tehzîb 3747"),
  E("damrarebia", "duhaym", "—", "Tehzîb 3747"),
  E("ubeydullahmusa", "duhaym", "—", "Tehzîb 3747"),
  E("affanmuslim", "duhaym", "—", "Tehzîb 3747"),
  E("amrebiselemetennisi", "duhaym", "ق", "Tehzîb 3747"),
  E("muhammedsuaybsabur", "duhaym", "ق", "Tehzîb 3747"),
  E("firyabi", "duhaym", "سي ق", "Tehzîb 3747"),
  E("mervanfezari", "duhaym", "س ق", "Tehzîb 3747"),
  E("velidmuslim", "duhaym", "خ د س ق", "Tehzîb 3747"),
  E("yalaubeyd", "duhaym", "—", "Tehzîb 3747"),


  /* Duhaym, Abdurrahman b. İbrâhim (o. 245) -- talebeleri.
     Tehzîb 3747. Tercemede 44 kayit var, agda dugumu olan 8'i cizildi. */
  E("duhaym", "buhari", "—", "Tehzîb 3747"),
  E("duhaym", "ebudavud", "—", "Tehzîb 3747"),
  E("duhaym", "nesai", "—", "Tehzîb 3747"),
  E("duhaym", "ibnmace", "—", "Tehzîb 3747"),
  E("duhaym", "bh03", "—", "Tehzîb 3747"),
  E("duhaym", "darimi", "—", "Tehzîb 3747"),
  E("duhaym", "ebuzuraraazi", "—", "Tehzîb 3747"),
  E("duhaym", "ebuhatimrazi", "—", "Tehzîb 3747"),


  /* Ahmed b. Sinân el-Kattân (o. 256) -- hocalari.
     Tehzîb 45. Tercemede 19 kayit var, agda dugumu olan 10'i cizildi. */
  E("ishakyusufezrak", "ahmedsinan", "ق", "Tehzîb 45"),
  E("ebuusamehammad", "ahmedsinan", "ق", "Tehzîb 45"),
  E("ibnmehdi", "ahmedsinan", "م قد كن ق", "Tehzîb 45"),
  E("affanmuslim", "ahmedsinan", "—", "Tehzîb 45"),
  E("muhammedfudayl", "ahmedsinan", "—", "Tehzîb 45"),
  E("muazmuaz", "ahmedsinan", "—", "Tehzîb 45"),
  E("veki", "ahmedsinan", "—", "Tehzîb 45"),
  E("kattan", "ahmedsinan", "ق", "Tehzîb 45"),
  E("yezidharun", "ahmedsinan", "خ د ق", "Tehzîb 45"),
  E("yalaubeyd", "ahmedsinan", "د", "Tehzîb 45"),


  /* Ahmed b. Sinân el-Kattân (o. 256) -- talebeleri.
     Tehzîb 45. Tercemede 19 kayit var, agda dugumu olan 11'i cizildi. */
  E("ahmedsinan", "buhari", "—", "Tehzîb 45"),
  E("ahmedsinan", "muslim", "—", "Tehzîb 45"),
  E("ahmedsinan", "ebudavud", "—", "Tehzîb 45"),
  E("ahmedsinan", "nesai", "—", "Tehzîb 45"),
  E("ahmedsinan", "ibnmace", "—", "Tehzîb 45"),
  E("ahmedsinan", "ed17", "—", "Tehzîb 45"),
  E("ahmedsinan", "ed19", "—", "Tehzîb 45"),
  E("ahmedsinan", "ms20", "—", "Tehzîb 45"),
  E("ahmedsinan", "ebuhatimrazi", "—", "Tehzîb 45"),
  E("ahmedsinan", "bh10", "—", "Tehzîb 45"),
  E("ahmedsinan", "ms28", "—", "Tehzîb 45"),


  /* Ebû Kudâme es-Serahsî (o. 241) -- hocalari.
     Tehzîb 3639. Tercemede 47 kayit var, agda dugumu olan 20'i cizildi. */
  E("ishakyusufezrak", "ebukudame", "م", "Tehzîb 3639"),
  E("habbanhilal", "ebukudame", "س", "Tehzîb 3639"),
  E("hafsgiyas", "ebukudame", "—", "Tehzîb 3639"),
  E("ebuusamehammad", "ebukudame", "خ م", "Tehzîb 3639"),
  E("hammadzeyd", "ebukudame", "عخ", "Tehzîb 3639"),
  E("ruhubade", "ebukudame", "م", "Tehzîb 3639"),
  E("ibnuyeyne", "ebukudame", "م س", "Tehzîb 3639"),
  E("ibnnumeyr", "ebukudame", "خ س", "Tehzîb 3639"),
  E("ibnmehdi", "ebukudame", "م س", "Tehzîb 3639"),
  E("kavariri", "ebukudame", "—", "Tehzîb 3639"),
  E("affanmuslim", "ebukudame", "خ", "Tehzîb 3639"),
  E("mervanfezari", "ebukudame", "—", "Tehzîb 3639"),
  E("nadrsumeyl", "ebukudame", "مق", "Tehzîb 3639"),
  E("veki", "ebukudame", "—", "Tehzîb 3639"),
  E("velidmuslim", "ebukudame", "م س", "Tehzîb 3639"),
  E("yahyaadem", "ebukudame", "—", "Tehzîb 3639"),
  E("kattan", "ebukudame", "م س", "Tehzîb 3639"),
  E("yezidharun", "ebukudame", "م", "Tehzîb 3639"),
  E("yalaubeyd", "ebukudame", "—", "Tehzîb 3639"),
  E("ebumuaviyedarir", "ebukudame", "—", "Tehzîb 3639"),


  /* Ebû Kudâme es-Serahsî (o. 241) -- talebeleri.
     Tehzîb 3639. Tercemede 19 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebukudame", "buhari", "—", "Tehzîb 3639"),
  E("ebukudame", "muslim", "—", "Tehzîb 3639"),
  E("ebukudame", "nesai", "—", "Tehzîb 3639"),
  E("ebukudame", "ms02", "—", "Tehzîb 3639"),
  E("ebukudame", "ms12", "—", "Tehzîb 3639"),
  E("ebukudame", "ebuzuraraazi", "—", "Tehzîb 3639"),
  E("ebukudame", "ebuhatimrazi", "—", "Tehzîb 3639"),
  E("ebukudame", "zuhli", "—", "Tehzîb 3639"),


  /* Yahyâ b. Mûsâ el-Belhî (Hat) (o. 240) -- hocalari.
     Tehzîb 6930. Tercemede 44 kayit var, agda dugumu olan 16'i cizildi. */
  E("enesiyaz", "yahyamusa", "س", "Tehzîb 6930"),
  E("habbanhilal", "yahyamusa", "ت", "Tehzîb 6930"),
  E("ebuusamehammad", "yahyamusa", "د", "Tehzîb 6930"),
  E("ruhubade", "yahyamusa", "ت", "Tehzîb 6930"),
  E("saidsuleymansadeviye", "yahyamusa", "ت", "Tehzîb 6930"),
  E("said_mansur", "yahyamusa", "خ", "Tehzîb 6930"),
  E("ibnuyeyne", "yahyamusa", "ت س", "Tehzîb 6930"),
  E("suleymanharb", "yahyamusa", "ت", "Tehzîb 6930"),
  E("ibnnumeyr", "yahyamusa", "ت س", "Tehzîb 6930"),
  E("abdurrezzak", "yahyamusa", "خ د ت", "Tehzîb 6930"),
  E("muhammedfudayl", "yahyamusa", "س", "Tehzîb 6930"),
  E("veki", "yahyamusa", "خ د ت", "Tehzîb 6930"),
  E("velidmuslim", "yahyamusa", "خ ت", "Tehzîb 6930"),
  E("yezidharun", "yahyamusa", "خ ت", "Tehzîb 6930"),
  E("ebudavudtayalisi", "yahyamusa", "ت س", "Tehzîb 6930"),
  E("ebumuaviyedarir", "yahyamusa", "ت", "Tehzîb 6930"),


  /* Yahyâ b. Mûsâ el-Belhî (Hat) (o. 240) -- talebeleri.
     Tehzîb 6930. Tercemede 16 kayit var, agda dugumu olan 5'i cizildi. */
  E("yahyamusa", "buhari", "—", "Tehzîb 6930"),
  E("yahyamusa", "ebudavud", "—", "Tehzîb 6930"),
  E("yahyamusa", "tirmizi", "—", "Tehzîb 6930"),
  E("yahyamusa", "nesai", "—", "Tehzîb 6930"),
  E("yahyamusa", "darimi", "—", "Tehzîb 6930"),


  /* Esed b. Mûsâ (Esedü's-sünne) (o. 212) -- hocalari.
     Tehzîb 400. Tercemede 62 kayit var, agda dugumu olan 33'i cizildi. */
  E("ibrahimsad", "esedmusa", "—", "Tehzîb 400"),
  E("israilyunus", "esedmusa", "—", "Tehzîb 400"),
  E("ismailayyas", "esedmusa", "—", "Tehzîb 400"),
  E("bakiyyevelid", "esedmusa", "س", "Tehzîb 400"),
  E("cerirabdulhamid", "esedmusa", "—", "Tehzîb 400"),
  E("hammadzeyd", "esedmusa", "—", "Tehzîb 400"),
  E("hammadseleme", "esedmusa", "س", "Tehzîb 400"),
  E("ruhubade", "esedmusa", "—", "Tehzîb 400"),
  E("ibnuyeyne", "esedmusa", "—", "Tehzîb 400"),
  E("suleymanmugire", "esedmusa", "—", "Tehzîb 400"),
  E("ebulahvess", "esedmusa", "—", "Tehzîb 400"),
  E("serikkadi", "esedmusa", "—", "Tehzîb 400"),
  E("sube", "esedmusa", "سي", "Tehzîb 400"),
  E("seybannahvi", "esedmusa", "—", "Tehzîb 400"),
  E("ibnmubarek", "esedmusa", "—", "Tehzîb 400"),
  E("ibnvehb", "esedmusa", "—", "Tehzîb 400"),
  E("mesudi", "esedmusa", "—", "Tehzîb 400"),
  E("macisun", "esedmusa", "—", "Tehzîb 400"),
  E("darevardi", "esedmusa", "—", "Tehzîb 400"),
  E("abdesuleyman", "esedmusa", "—", "Tehzîb 400"),
  E("isabyunus", "esedmusa", "—", "Tehzîb 400"),
  E("fudaylibnayaz", "esedmusa", "—", "Tehzîb 400"),
  E("kaysrebi", "esedmusa", "—", "Tehzîb 400"),
  E("leysbsad", "esedmusa", "—", "Tehzîb 400"),
  E("ebumuaviyedarir", "esedmusa", "—", "Tehzîb 400"),
  E("ibnebizib", "esedmusa", "خت", "Tehzîb 400"),
  E("firyabi", "esedmusa", "—", "Tehzîb 400"),
  E("mervanfezari", "esedmusa", "—", "Tehzîb 400"),
  E("muaviyesalih", "esedmusa", "بخ د س", "Tehzîb 400"),
  E("ebuavane", "esedmusa", "—", "Tehzîb 400"),
  E("veki", "esedmusa", "—", "Tehzîb 400"),
  E("velidmuslim", "esedmusa", "—", "Tehzîb 400"),
  E("ibnebizaide", "esedmusa", "د", "Tehzîb 400"),


  /* Esed b. Mûsâ (Esedü's-sünne) (o. 212) -- talebeleri.
     Tehzîb 400. Tercemede 13 kayit var, agda dugumu olan 2'i cizildi. */
  E("esedmusa", "ahmedsalihmisri", "د", "Tehzîb 400"),
  E("esedmusa", "duhaym", "—", "Tehzîb 400"),


  /* Abdullah b. Muhammed el-Müsnedî (o. 229) -- hocalari.
     Tehzîb 3536. Tercemede 55 kayit var, agda dugumu olan 24'i cizildi. */
  E("ishakyusufezrak", "musnedi", "خ", "Tehzîb 3536"),
  E("bisrsari", "musnedi", "ر", "Tehzîb 3536"),
  E("hafsgiyas", "musnedi", "—", "Tehzîb 3536"),
  E("ebuusamehammad", "musnedi", "بخ", "Tehzîb 3536"),
  E("ruhubade", "musnedi", "خ", "Tehzîb 3536"),
  E("ibnuyeyne", "musnedi", "خ", "Tehzîb 3536"),
  E("suleymanharb", "musnedi", "—", "Tehzîb 3536"),
  E("ebudavudtayalisi", "musnedi", "بخ", "Tehzîb 3536"),
  E("ebuasimnebil", "musnedi", "خ", "Tehzîb 3536"),
  E("kanebi", "musnedi", "—", "Tehzîb 3536"),
  E("ibnmehdi", "musnedi", "خ", "Tehzîb 3536"),
  E("abdurrezzak", "musnedi", "خ", "Tehzîb 3536"),
  E("abdussamed", "musnedi", "خ", "Tehzîb 3536"),
  E("ubeydullahmusa", "musnedi", "ت", "Tehzîb 3536"),
  E("amrebiselemetennisi", "musnedi", "خ", "Tehzîb 3536"),
  E("fudaylibnayaz", "musnedi", "—", "Tehzîb 3536"),
  E("mervanfezari", "musnedi", "خ", "Tehzîb 3536"),
  E("mutemirsuleyman", "musnedi", "خ", "Tehzîb 3536"),
  E("hisamtayalisi", "musnedi", "—", "Tehzîb 3536"),
  E("hisamyusufsanani", "musnedi", "خ", "Tehzîb 3536"),
  E("veki", "musnedi", "—", "Tehzîb 3536"),
  E("velidmuslim", "musnedi", "—", "Tehzîb 3536"),
  E("yahyaadem", "musnedi", "خ", "Tehzîb 3536"),
  E("ibnmain", "musnedi", "خ", "Tehzîb 3536"),


  /* Abdullah b. Muhammed el-Müsnedî (o. 229) -- talebeleri.
     Tehzîb 3536. Tercemede 15 kayit var, agda dugumu olan 5'i cizildi. */
  E("musnedi", "buhari", "ت", "Tehzîb 3536"),
  E("musnedi", "darimi", "—", "Tehzîb 3536"),
  E("musnedi", "ebuzuraraazi", "—", "Tehzîb 3536"),
  E("musnedi", "ebuhatimrazi", "—", "Tehzîb 3536"),
  E("musnedi", "zuhli", "—", "Tehzîb 3536"),


  /* Rebî b. Süleymân el-Murâdî (o. 270) -- hocalari.
     Tehzîb 1864. Tercemede 15 kayit var, agda dugumu olan 4'i cizildi. */
  E("esedmusa", "rebimuradi", "د س", "Tehzîb 1864"),
  E("bisrbekirtennisi", "rebimuradi", "قد", "Tehzîb 1864"),
  E("ibnvehb", "rebimuradi", "د س", "Tehzîb 1864"),
  E("safii", "rebimuradi", "٤", "Tehzîb 1864"),


  /* Rebî b. Süleymân el-Murâdî (o. 270) -- talebeleri.
     Tehzîb 1864. Tercemede 22 kayit var, agda dugumu olan 10'i cizildi. */
  E("rebimuradi", "ebudavud", "—", "Tehzîb 1864"),
  E("rebimuradi", "nesai", "—", "Tehzîb 1864"),
  E("rebimuradi", "ibnmace", "—", "Tehzîb 1864"),
  E("rebimuradi", "tirmizi", "—", "Tehzîb 1864"),
  E("rebimuradi", "ns02", "—", "Tehzîb 1864"),
  E("rebimuradi", "ed17", "—", "Tehzîb 1864"),
  E("rebimuradi", "ms20", "—", "Tehzîb 1864"),
  E("rebimuradi", "ebuzuraraazi", "—", "Tehzîb 1864"),
  E("rebimuradi", "ebuhatimrazi", "—", "Tehzîb 1864"),
  E("rebimuradi", "ms28", "—", "Tehzîb 1864"),


  /* Ebû Âmir el-Akadî (o. 205) -- hocalari.
     Tehzîb 3545. Tercemede 67 kayit var, agda dugumu olan 17'i cizildi. */
  E("ibrahimtahman", "ebuamirakadi", "خ م د ت س", "Tehzîb 3545"),
  E("israilyunus", "ebuamirakadi", "خ", "Tehzîb 3545"),
  E("hammadseleme", "ebuamirakadi", "ت", "Tehzîb 3545"),
  E("davudkaysferra", "ebuamirakadi", "م د", "Tehzîb 3545"),
  E("zekeriyyaishak", "ebuamirakadi", "س", "Tehzîb 3545"),
  E("sevri", "ebuamirakadi", "م س ق", "Tehzîb 3545"),
  E("suleymanbilal", "ebuamirakadi", "خ م د ت س", "Tehzîb 3545"),
  E("suleymanmugire", "ebuamirakadi", "س", "Tehzîb 3545"),
  E("sube", "ebuamirakadi", "خ م س", "Tehzîb 3545"),
  E("macisun", "ebuamirakadi", "م", "Tehzîb 3545"),
  E("ikrimeammar", "ebuamirakadi", "م د", "Tehzîb 3545"),
  E("alimubarekhinai", "ebuamirakadi", "—", "Tehzîb 3545"),
  E("omerzerr", "ebuamirakadi", "—", "Tehzîb 3545"),
  E("malik", "ebuamirakadi", "—", "Tehzîb 3545"),
  E("ibnebizib", "ebuamirakadi", "—", "Tehzîb 3545"),
  E("hisamdestuvai", "ebuamirakadi", "م س", "Tehzîb 3545"),
  E("hemmamyahya", "ebuamirakadi", "—", "Tehzîb 3545"),


  /* Ebû Âmir el-Akadî (o. 205) -- talebeleri.
     Tehzîb 3545. Tercemede 52 kayit var, agda dugumu olan 18'i cizildi. */
  E("ebuamirakadi", "ahmedhanbel", "د", "Tehzîb 3545"),
  E("ebuamirakadi", "ibnrahuye", "خ م س", "Tehzîb 3545"),
  E("ebuamirakadi", "ishakkevsec", "م تم", "Tehzîb 3545"),
  E("ebuamirakadi", "hasanaliayyal", "م", "Tehzîb 3545"),
  E("ebuamirakadi", "zuheyrharb", "م د", "Tehzîb 3545"),
  E("ebuamirakadi", "abbasanberi", "س", "Tehzîb 3545"),
  E("ebuamirakadi", "musnedi", "خ", "Tehzîb 3545"),
  E("ebuamirakadi", "abdhumeyd", "م", "Tehzîb 3545"),
  E("ebuamirakadi", "ebukudame", "خ م", "Tehzîb 3545"),
  E("ebuamirakadi", "kavariri", "د", "Tehzîb 3545"),
  E("ebuamirakadi", "alimedini", "—", "Tehzîb 3545"),
  E("ebuamirakadi", "bundar", "خ ت سي ق", "Tehzîb 3545"),
  E("ebuamirakadi", "muhammedrafi", "ت", "Tehzîb 3545"),
  E("ebuamirakadi", "ibnmusenna", "خ م د س", "Tehzîb 3545"),
  E("ebuamirakadi", "zuhli", "—", "Tehzîb 3545"),
  E("ebuamirakadi", "nasralicehdami", "—", "Tehzîb 3545"),
  E("ebuamirakadi", "harunhammal", "د", "Tehzîb 3545"),
  E("ebuamirakadi", "ibnmain", "—", "Tehzîb 3545"),


  /* Ebû Ahmed ez-Zübeyrî (o. 203) -- hocalari.
     Tehzîb 5343. Tercemede 48 kayit var, agda dugumu olan 11'i cizildi. */
  E("ibrahimtahman", "ebuahmedzubeyri", "د", "Tehzîb 5343"),
  E("israilyunus", "ebuahmedzubeyri", "خ م د", "Tehzîb 5343"),
  E("hamzazeyyat", "ebuahmedzubeyri", "م", "Tehzîb 5343"),
  E("zuhayrmuaviye", "ebuahmedzubeyri", "—", "Tehzîb 5343"),
  E("sevri", "ebuahmedzubeyri", "خ م ت ق", "Tehzîb 5343"),
  E("serikkadi", "ebuahmedzubeyri", "س", "Tehzîb 5343"),
  E("seybannahvi", "ebuahmedzubeyri", "م د تم", "Tehzîb 5343"),
  E("fitrhalife", "ebuahmedzubeyri", "—", "Tehzîb 5343"),
  E("malik", "ebuahmedzubeyri", "—", "Tehzîb 5343"),
  E("malikmigvel", "ebuahmedzubeyri", "م سي", "Tehzîb 5343"),
  E("misersukdam", "ebuahmedzubeyri", "خ د س", "Tehzîb 5343"),


  /* Ebû Ahmed ez-Zübeyrî (o. 203) -- talebeleri.
     Tehzîb 5343. Tercemede 37 kayit var, agda dugumu olan 13'i cizildi. */
  E("ebuahmedzubeyri", "ahmedhanbel", "د", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "ahmedmeni", "ت", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "zuheyrharb", "م د", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "ibnebiseybe", "خ م ق", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "musnedi", "خ", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "kavariri", "م د س", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "amrnakid", "م", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "bundar", "ت ق", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "muhammedrafi", "م د تم س", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "ibnmusenna", "س ق", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "mahmudgaylan", "خ ت سي", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "nasralicehdami", "خ م د", "Tehzîb 5343"),
  E("ebuahmedzubeyri", "harunhammal", "س", "Tehzîb 5343"),


  /* Muhammed b. es-Sabbâh ed-Dûlâbî (o. 227) -- hocalari.
     Tehzîb 5298. Tercemede 36 kayit var, agda dugumu olan 15'i cizildi. */
  E("ibrahimsad", "ibnsabbahdulabi", "م د", "Tehzîb 5298"),
  E("ishakyusufezrak", "ibnsabbahdulabi", "—", "Tehzîb 5298"),
  E("ibnuleyye", "ibnsabbahdulabi", "م", "Tehzîb 5298"),
  E("cerirabdulhamid", "ibnsabbahdulabi", "—", "Tehzîb 5298"),
  E("hafsgiyas", "ibnsabbahdulabi", "م", "Tehzîb 5298"),
  E("ibnuyeyne", "ibnsabbahdulabi", "د", "Tehzîb 5298"),
  E("ebulahvess", "ibnsabbahdulabi", "—", "Tehzîb 5298"),
  E("serikkadi", "ibnsabbahdulabi", "بخ م د", "Tehzîb 5298"),
  E("ibnmubarek", "ibnsabbahdulabi", "د", "Tehzîb 5298"),
  E("muazmuaz", "ibnsabbahdulabi", "—", "Tehzîb 5298"),
  E("huseym", "ibnsabbahdulabi", "خ م د عس", "Tehzîb 5298"),
  E("veki", "ibnsabbahdulabi", "م", "Tehzîb 5298"),
  E("velidmuslim", "ibnsabbahdulabi", "د", "Tehzîb 5298"),
  E("yezidharun", "ibnsabbahdulabi", "د", "Tehzîb 5298"),
  E("ebumuaviyedarir", "ibnsabbahdulabi", "—", "Tehzîb 5298"),


  /* Muhammed b. es-Sabbâh ed-Dûlâbî (o. 227) -- talebeleri.
     Tehzîb 5298. Tercemede 41 kayit var, agda dugumu olan 14'i cizildi. */
  E("ibnsabbahdulabi", "buhari", "ت", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "muslim", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ebudavud", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "bh03", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ahmedhanbel", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "hasanaliayyal", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "zaferani", "س", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "zuheyrharb", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ed20", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ebukudame", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ebuzuraraazi", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ebuhatimrazi", "—", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "zuhli", "ق", "Tehzîb 5298"),
  E("ibnsabbahdulabi", "ibnmain", "—", "Tehzîb 5298"),


  /* Abdullah b. Recâ el-Gudânî (o. 219) -- hocalari.
     Tehzîb 3262. Tercemede 53 kayit var, agda dugumu olan 16'i cizildi. */
  E("israilyunus", "ibnrecagudani", "خ س ق", "Tehzîb 3262"),
  E("harbseddad", "ibnrecagudani", "س", "Tehzîb 3262"),
  E("hammadseleme", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("zaidekudame", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("serikkadi", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("sube", "ibnrecagudani", "خ", "Tehzîb 3262"),
  E("seybannahvi", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("mesudi", "ibnrecagudani", "ق", "Tehzîb 3262"),
  E("macisun", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("ikrimeammar", "ibnrecagudani", "بخ ق", "Tehzîb 3262"),
  E("kaysrebi", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("hisamdestuvai", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("hemmamyahya", "ibnrecagudani", "خ خد", "Tehzîb 3262"),
  E("ebuavane", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("ibnebizaide", "ibnrecagudani", "—", "Tehzîb 3262"),
  E("ebubekirayyas", "ibnrecagudani", "—", "Tehzîb 3262"),


  /* Abdullah b. Recâ el-Gudânî (o. 219) -- talebeleri.
     Tehzîb 3262. Tercemede 82 kayit var, agda dugumu olan 7'i cizildi. */
  E("ibnrecagudani", "buhari", "—", "Tehzîb 3262"),
  E("ibnrecagudani", "bh03", "—", "Tehzîb 3262"),
  E("ibnrecagudani", "abbasanberi", "—", "Tehzîb 3262"),
  E("ibnrecagudani", "ebuhatimrazi", "—", "Tehzîb 3262"),
  E("ibnrecagudani", "ibnsellam", "—", "Tehzîb 3262"),
  E("ibnrecagudani", "ibnmusenna", "سي", "Tehzîb 3262"),
  E("ibnrecagudani", "zuhli", "ت", "Tehzîb 3262"),


  /* Abbâs b. Abdil‘azīm el-Anberî (o. 246) -- hocalari.
     Tehzîb 3128. Tercemede 43 kayit var, agda dugumu olan 6'i cizildi. */
  E("ahmedhanbel", "abbasanberi", "ق", "Tehzîb 3128"),
  E("ebuasimnebil", "abbasanberi", "ق", "Tehzîb 3128"),
  E("ibnmehdi", "abbasanberi", "د ت ق", "Tehzîb 3128"),
  E("ubeydullahmusa", "abbasanberi", "د", "Tehzîb 3128"),
  E("alimedini", "abbasanberi", "فق", "Tehzîb 3128"),
  E("yezidharun", "abbasanberi", "د ت", "Tehzîb 3128"),


  /* Abbâs b. Abdil‘azīm el-Anberî (o. 246) -- talebeleri.
     Tehzîb 3128. Tercemede 23 kayit var, agda dugumu olan 9'i cizildi. */
  E("abbasanberi", "ebudavud", "—", "Tehzîb 3128"),
  E("abbasanberi", "tirmizi", "—", "Tehzîb 3128"),
  E("abbasanberi", "ibnmace", "—", "Tehzîb 3128"),
  E("abbasanberi", "bh05", "—", "Tehzîb 3128"),
  E("abbasanberi", "ed17", "—", "Tehzîb 3128"),
  E("abbasanberi", "ed18", "—", "Tehzîb 3128"),
  E("abbasanberi", "bh11", "—", "Tehzîb 3128"),
  E("abbasanberi", "ebuhatimrazi", "—", "Tehzîb 3128"),
  E("abbasanberi", "bh07", "—", "Tehzîb 3128"),


  /* Hasan b. Muhammed ez-Za‘ferânî (o. 260) -- hocalari.
     Tehzîb 1270. Tercemede 39 kayit var, agda dugumu olan 17'i cizildi. */
  E("ibnuleyye", "zaferani", "—", "Tehzîb 1270"),
  E("haccacmuhammed", "zaferani", "خ ت س", "Tehzîb 1270"),
  E("ruhubade", "zaferani", "—", "Tehzîb 1270"),
  E("saidsuleymansadeviye", "zaferani", "عخ س", "Tehzîb 1270"),
  E("said_mansur", "zaferani", "—", "Tehzîb 1270"),
  E("ibnuyeyne", "zaferani", "—", "Tehzîb 1270"),
  E("abdulvehhabata", "zaferani", "س ق", "Tehzîb 1270"),
  E("affanmuslim", "zaferani", "د ت ق", "Tehzîb 1270"),
  E("alimedini", "zaferani", "—", "Tehzîb 1270"),
  E("ebunuaymfadl", "zaferani", "د", "Tehzîb 1270"),
  E("safii", "zaferani", "ت", "Tehzîb 1270"),
  E("ebumuaviyedarir", "zaferani", "ق", "Tehzîb 1270"),
  E("muhammedebiadi", "zaferani", "س", "Tehzîb 1270"),
  E("mervanfezari", "zaferani", "—", "Tehzîb 1270"),
  E("muazmuaz", "zaferani", "—", "Tehzîb 1270"),
  E("veki", "zaferani", "—", "Tehzîb 1270"),
  E("yezidharun", "zaferani", "د ق", "Tehzîb 1270"),


  /* Hasan b. Muhammed ez-Za‘ferânî (o. 260) -- talebeleri.
     Tehzîb 1270. Tercemede 22 kayit var, agda dugumu olan 10'i cizildi. */
  E("zaferani", "buhari", "—", "Tehzîb 1270"),
  E("zaferani", "ebudavud", "—", "Tehzîb 1270"),
  E("zaferani", "tirmizi", "—", "Tehzîb 1270"),
  E("zaferani", "nesai", "—", "Tehzîb 1270"),
  E("zaferani", "ibnmace", "—", "Tehzîb 1270"),
  E("zaferani", "ed07", "—", "Tehzîb 1270"),
  E("zaferani", "bh17", "—", "Tehzîb 1270"),
  E("zaferani", "ed17", "—", "Tehzîb 1270"),
  E("zaferani", "ms28", "—", "Tehzîb 1270"),
  E("zaferani", "ms29", "—", "Tehzîb 1270"),


  /* Abbâs b. Muhammed ed-Dûrî (o. 271) -- hocalari.
     Tehzîb 3141. Tercemede 45 kayit var, agda dugumu olan 11'i cizildi. */
  E("ahmedhanbel", "abbasduri", "—", "Tehzîb 3141"),
  E("ebuasimnebil", "abbasduri", "—", "Tehzîb 3141"),
  E("ebuamirakadi", "abbasduri", "س", "Tehzîb 3141"),
  E("abdulvehhabata", "abbasduri", "ت", "Tehzîb 3141"),
  E("ubeydullahmusa", "abbasduri", "قد س", "Tehzîb 3141"),
  E("affanmuslim", "abbasduri", "—", "Tehzîb 3141"),
  E("alihasansakik", "abbasduri", "ت س", "Tehzîb 3141"),
  E("ebunuaymfadl", "abbasduri", "س", "Tehzîb 3141"),
  E("musaismailtebuzeki", "abbasduri", "—", "Tehzîb 3141"),
  E("hisamtayalisi", "abbasduri", "—", "Tehzîb 3141"),
  E("ibnmain", "abbasduri", "—", "Tehzîb 3141"),


  /* Abbâs b. Muhammed ed-Dûrî (o. 271) -- talebeleri.
     Tehzîb 3141. Tercemede 26 kayit var, agda dugumu olan 10'i cizildi. */
  E("abbasduri", "ebudavud", "—", "Tehzîb 3141"),
  E("abbasduri", "tirmizi", "—", "Tehzîb 3141"),
  E("abbasduri", "nesai", "—", "Tehzîb 3141"),
  E("abbasduri", "ibnmace", "—", "Tehzîb 3141"),
  E("abbasduri", "ed12", "—", "Tehzîb 3141"),
  E("abbasduri", "bh17", "—", "Tehzîb 3141"),
  E("abbasduri", "ms20", "—", "Tehzîb 3141"),
  E("abbasduri", "ed27", "—", "Tehzîb 3141"),
  E("abbasduri", "ed29", "—", "Tehzîb 3141"),
  E("abbasduri", "ms28", "—", "Tehzîb 3141"),


  /* Haccâc b. eş-Şâir (o. 259) -- hocalari.
     Tehzîb 1131. Tercemede 48 kayit var, agda dugumu olan 15'i cizildi. */
  E("haccacmuhammed", "haccacsair", "م", "Tehzîb 1131"),
  E("ruhubade", "haccacsair", "م", "Tehzîb 1131"),
  E("suleymanharb", "haccacsair", "م", "Tehzîb 1131"),
  E("ebuasimnebil", "haccacsair", "م", "Tehzîb 1131"),
  E("abdurrezzak", "haccacsair", "م", "Tehzîb 1131"),
  E("abdussamed", "haccacsair", "م د", "Tehzîb 1131"),
  E("ubeydullahmusa", "haccacsair", "م", "Tehzîb 1131"),
  E("affanmuslim", "haccacsair", "م", "Tehzîb 1131"),
  E("ebunuaymfadl", "haccacsair", "م", "Tehzîb 1131"),
  E("muslimibrahim", "haccacsair", "م", "Tehzîb 1131"),
  E("yezidharun", "haccacsair", "—", "Tehzîb 1131"),
  E("ebuahmedzubeyri", "haccacsair", "م", "Tehzîb 1131"),
  E("ebudavudtayalisi", "haccacsair", "م", "Tehzîb 1131"),
  E("ebuamirakadi", "haccacsair", "م", "Tehzîb 1131"),
  E("hisamtayalisi", "haccacsair", "م", "Tehzîb 1131"),


  /* Haccâc b. eş-Şâir (o. 259) -- talebeleri.
     Tehzîb 1131. Tercemede 15 kayit var, agda dugumu olan 8'i cizildi. */
  E("haccacsair", "muslim", "—", "Tehzîb 1131"),
  E("haccacsair", "ebudavud", "—", "Tehzîb 1131"),
  E("haccacsair", "bh05", "—", "Tehzîb 1131"),
  E("haccacsair", "bh17", "—", "Tehzîb 1131"),
  E("haccacsair", "bh06", "—", "Tehzîb 1131"),
  E("haccacsair", "ed20", "—", "Tehzîb 1131"),
  E("haccacsair", "ms20", "—", "Tehzîb 1131"),
  E("haccacsair", "ebuhatimrazi", "—", "Tehzîb 1131"),


  /* İbrâhim b. Ya‘kūb el-Cûzcânî (o. 259) -- hocalari.
     Tehzîb 268. Tercemede 83 kayit var, agda dugumu olan 22'i cizildi. */
  E("ahmedhanbel", "cuzcani", "—", "Tehzîb 268"),
  E("caferavn", "cuzcani", "س", "Tehzîb 268"),
  E("haccacminhal", "cuzcani", "س", "Tehzîb 268"),
  E("ruhubade", "cuzcani", "ت", "Tehzîb 268"),
  E("saidsuleymansadeviye", "cuzcani", "س", "Tehzîb 268"),
  E("said_mansur", "cuzcani", "—", "Tehzîb 268"),
  E("suleymanharb", "cuzcani", "س", "Tehzîb 268"),
  E("ebuasimnebil", "cuzcani", "سي", "Tehzîb 268"),
  E("abdan", "cuzcani", "—", "Tehzîb 268"),
  E("abdussamed", "cuzcani", "س", "Tehzîb 268"),
  E("ubeydullahmusa", "cuzcani", "س", "Tehzîb 268"),
  E("affanmuslim", "cuzcani", "س", "Tehzîb 268"),
  E("alihasansakik", "cuzcani", "س", "Tehzîb 268"),
  E("alimedini", "cuzcani", "س", "Tehzîb 268"),
  E("ebunuaymfadl", "cuzcani", "—", "Tehzîb 268"),
  E("ibnsabbahdulabi", "cuzcani", "س", "Tehzîb 268"),
  E("muhammedisataba", "cuzcani", "س", "Tehzîb 268"),
  E("misned", "cuzcani", "س", "Tehzîb 268"),
  E("hisamtayalisi", "cuzcani", "س", "Tehzîb 268"),
  E("ibnmain", "cuzcani", "س", "Tehzîb 268"),
  E("yezidharun", "cuzcani", "د س", "Tehzîb 268"),
  E("yalaubeyd", "cuzcani", "س", "Tehzîb 268"),


  /* İbrâhim b. Ya‘kūb el-Cûzcânî (o. 259) -- talebeleri.
     Tehzîb 268. Tercemede 21 kayit var, agda dugumu olan 7'i cizildi. */
  E("cuzcani", "ebudavud", "—", "Tehzîb 268"),
  E("cuzcani", "tirmizi", "—", "Tehzîb 268"),
  E("cuzcani", "nesai", "—", "Tehzîb 268"),
  E("cuzcani", "ebuzuraraazi", "—", "Tehzîb 268"),
  E("cuzcani", "ed24", "—", "Tehzîb 268"),
  E("cuzcani", "ebuhatimrazi", "—", "Tehzîb 268"),
  E("cuzcani", "bh10", "—", "Tehzîb 268"),


  /* Ahmed b. Mansûr er-Ramâdî (o. 265) -- hocalari.
     Tehzîb 113. Tercemede 42 kayit var, agda dugumu olan 14'i cizildi. */
  E("ahmedhanbel", "ramadi", "—", "Tehzîb 113"),
  E("haccacmuhammed", "ramadi", "ق", "Tehzîb 113"),
  E("ebudavudtayalisi", "ramadi", "—", "Tehzîb 113"),
  E("ebuasimnebil", "ramadi", "—", "Tehzîb 113"),
  E("kanebi", "ramadi", "—", "Tehzîb 113"),
  E("duhaym", "ramadi", "—", "Tehzîb 113"),
  E("abdurrezzak", "ramadi", "—", "Tehzîb 113"),
  E("ubeydullahmusa", "ramadi", "—", "Tehzîb 113"),
  E("affanmuslim", "ramadi", "—", "Tehzîb 113"),
  E("alicad", "ramadi", "—", "Tehzîb 113"),
  E("musaismailtebuzeki", "ramadi", "—", "Tehzîb 113"),
  E("harunmaruf", "ramadi", "—", "Tehzîb 113"),
  E("hennadseri", "ramadi", "—", "Tehzîb 113"),
  E("yezidharun", "ramadi", "—", "Tehzîb 113"),


  /* Ahmed b. Mansûr er-Ramâdî (o. 265) -- talebeleri.
     Tehzîb 113. Tercemede 16 kayit var, agda dugumu olan 6'i cizildi. */
  E("ramadi", "ibnmace", "—", "Tehzîb 113"),
  E("ramadi", "ed12", "—", "Tehzîb 113"),
  E("ramadi", "bh17", "—", "Tehzîb 113"),
  E("ramadi", "ms20", "—", "Tehzîb 113"),
  E("ramadi", "ms28", "—", "Tehzîb 113"),
  E("ramadi", "ms29", "—", "Tehzîb 113"),


  /* Ahmed b. Abde ed-Dabbî (o. 245) -- hocalari.
     Tehzîb 75. Tercemede 30 kayit var, agda dugumu olan 12'i cizildi. */
  E("hammadzeyd", "ahmedabde", "م ت س ق", "Tehzîb 75"),
  E("ibnuyeyne", "ahmedabde", "م د", "Tehzîb 75"),
  E("ebudavudtayalisi", "ahmedabde", "م", "Tehzîb 75"),
  E("darevardi", "ahmedabde", "م ت ق", "Tehzîb 75"),
  E("abdulvahidziyad", "ahmedabde", "ق", "Tehzîb 75"),
  E("abdulvarissaid", "ahmedabde", "م", "Tehzîb 75"),
  E("isabyunus", "ahmedabde", "ت", "Tehzîb 75"),
  E("fudaylibnayaz", "ahmedabde", "م تم", "Tehzîb 75"),
  E("mutemirsuleyman", "ahmedabde", "ت ق", "Tehzîb 75"),
  E("ebuavane", "ahmedabde", "—", "Tehzîb 75"),
  E("kattan", "ahmedabde", "م", "Tehzîb 75"),
  E("yezidzurey", "ahmedabde", "م د", "Tehzîb 75"),


  /* Ahmed b. Abde ed-Dabbî (o. 245) -- talebeleri.
     Tehzîb 75. Tercemede 24 kayit var, agda dugumu olan 10'i cizildi. */
  E("ahmedabde", "muslim", "—", "Tehzîb 75"),
  E("ahmedabde", "ebudavud", "—", "Tehzîb 75"),
  E("ahmedabde", "tirmizi", "—", "Tehzîb 75"),
  E("ahmedabde", "nesai", "—", "Tehzîb 75"),
  E("ahmedabde", "ibnmace", "—", "Tehzîb 75"),
  E("ahmedabde", "ed17", "—", "Tehzîb 75"),
  E("ahmedabde", "bh09", "—", "Tehzîb 75"),
  E("ahmedabde", "ebuzuraraazi", "—", "Tehzîb 75"),
  E("ahmedabde", "bh11", "—", "Tehzîb 75"),
  E("ahmedabde", "ebuhatimrazi", "—", "Tehzîb 75"),


  /* Yûsuf b. Mûsâ el-Kattân (o. 253) -- hocalari.
     Tehzîb 7159. Tercemede 28 kayit var, agda dugumu olan 15'i cizildi. */
  E("cerirabdulhamid", "yusufmusakattan", "خ د عس ق", "Tehzîb 7159"),
  E("caferavn", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ebuusamehammad", "yusufmusakattan", "خ د ق", "Tehzîb 7159"),
  E("ibnuyeyne", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ibnidris", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ibnnumeyr", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ibnvehb", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ubeydullahmusa", "yusufmusakattan", "خ", "Tehzîb 7159"),
  E("ebunuaymfadl", "yusufmusakattan", "خ", "Tehzîb 7159"),
  E("ebumuaviyedarir", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("ebuahmedzubeyri", "yusufmusakattan", "خ", "Tehzîb 7159"),
  E("muhammedfudayl", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("muslimibrahim", "yusufmusakattan", "—", "Tehzîb 7159"),
  E("veki", "yusufmusakattan", "خ", "Tehzîb 7159"),
  E("yezidharun", "yusufmusakattan", "خ", "Tehzîb 7159"),


  /* Yûsuf b. Mûsâ el-Kattân (o. 253) -- talebeleri.
     Tehzîb 7159. Tercemede 20 kayit var, agda dugumu olan 13'i cizildi. */
  E("yusufmusakattan", "buhari", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ebudavud", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "tirmizi", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "nesai", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ibnmace", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "bh03", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "bh17", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ed20", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "bh09", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ebuzuraraazi", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ebuhatimrazi", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ms28", "—", "Tehzîb 7159"),
  E("yusufmusakattan", "ibnmain", "—", "Tehzîb 7159"),


  /* Atâ b. Yesâr (o. 103) -- hocalari.
     Tehzîb 3946. Tercemede 32 kayit var, agda dugumu olan 20'i cizildi. */
  E("ubey", "atayesar", "ق", "Tehzîb 3946"),
  E("usame", "atayesar", "س", "Tehzîb 3946"),
  E("cabir", "atayesar", "د", "Tehzîb 3946"),
  E("zeydsabit", "atayesar", "خ م د ت س", "Tehzîb 3946"),
  E("zeydhalid", "atayesar", "خ م د", "Tehzîb 3946"),
  E("ubadesamit", "atayesar", "ت", "Tehzîb 3946"),
  E("ibnabbas", "atayesar", "ع", "Tehzîb 3946"),
  E("ibnomer", "atayesar", "—", "Tehzîb 3946"),
  E("abdullahamr", "atayesar", "خ", "Tehzîb 3946"),
  E("ibnmesud", "atayesar", "—", "Tehzîb 3946"),
  E("kabahbar", "atayesar", "—", "Tehzîb 3946"),
  E("muazcebel", "atayesar", "د ت ق", "Tehzîb 3946"),
  E("ebueyyub", "atayesar", "ت ق", "Tehzîb 3946"),
  E("ebudderda", "atayesar", "س", "Tehzîb 3946"),
  E("ebuzer", "atayesar", "س", "Tehzîb 3946"),
  E("ebusaid", "atayesar", "ع", "Tehzîb 3946"),
  E("ebukatade", "atayesar", "م ت", "Tehzîb 3946"),
  E("ebuhureyre", "atayesar", "ع", "Tehzîb 3946"),
  E("aise", "atayesar", "بخ م ٤", "Tehzîb 3946"),
  E("ummuseleme", "atayesar", "ت", "Tehzîb 3946"),


  /* Atâ b. Yesâr (o. 103) -- talebeleri.
     Tehzîb 3946. Tercemede 22 kayit var, agda dugumu olan 7'i cizildi. */
  E("atayesar", "habibebisabit", "م", "Tehzîb 3946"),
  E("atayesar", "zeydeslem", "ع", "Tehzîb 3946"),
  E("atayesar", "ubeydullahmiksem", "—", "Tehzîb 3946"),
  E("atayesar", "amrdinar", "م", "Tehzîb 3946"),
  E("atayesar", "muhammedibrahimteymi", "م", "Tehzîb 3946"),
  E("atayesar", "yezidkusayt", "خ م د ت س", "Tehzîb 3946"),
  E("atayesar", "ebuselemeavf", "خ م", "Tehzîb 3946"),


  /* Saîd b. Ebî Saîd el-Makburî (o. 123) -- hocalari.
     Tehzîb 2284. Tercemede 41 kayit var, agda dugumu olan 12'i cizildi. */
  E("enes", "makburi", "د ق", "Tehzîb 2284"),
  E("cabir", "makburi", "—", "Tehzîb 2284"),
  E("sadvakkas", "makburi", "—", "Tehzîb 2284"),
  E("saidyesar", "makburi", "م ت س ق", "Tehzîb 2284"),
  E("ibnomer", "makburi", "—", "Tehzîb 2284"),
  E("abdullahebikatade", "makburi", "م", "Tehzîb 2284"),
  E("urve", "makburi", "—", "Tehzîb 2284"),
  E("ebusaid", "makburi", "س", "Tehzîb 2284"),
  E("ebusaidmakburi", "makburi", "ع", "Tehzîb 2284"),
  E("ebuselemeavf", "makburi", "ع", "Tehzîb 2284"),
  E("ebuhureyre", "makburi", "ع", "Tehzîb 2284"),
  E("ummuseleme", "makburi", "د", "Tehzîb 2284"),


  /* Saîd b. Ebî Saîd el-Makburî (o. 123) -- talebeleri.
     Tehzîb 2284. Tercemede 54 kayit var, agda dugumu olan 16'i cizildi. */
  E("makburi", "ibrahimtahman", "—", "Tehzîb 2284"),
  E("makburi", "usamezeydleysi", "٤", "Tehzîb 2284"),
  E("makburi", "ismailumeyye", "خ م", "Tehzîb 2284"),
  E("makburi", "davudkaysferra", "بخ", "Tehzîb 2284"),
  E("makburi", "sube", "—", "Tehzîb 2284"),
  E("makburi", "abdulhamidcafer", "خت م ت س ق", "Tehzîb 2284"),
  E("makburi", "ubeydullahomeri", "ع", "Tehzîb 2284"),
  E("makburi", "amrsuayb", "د", "Tehzîb 2284"),
  E("makburi", "leysbsad", "خ م س ق", "Tehzîb 2284"),
  E("makburi", "malik", "خ م د ت س", "Tehzîb 2284"),
  E("makburi", "ibnishak", "م", "Tehzîb 2284"),
  E("makburi", "ibnebizib", "خ م", "Tehzîb 2284"),
  E("makburi", "muhammedacilan", "خت د س", "Tehzîb 2284"),
  E("makburi", "muhammedvelidzubeydi", "د", "Tehzîb 2284"),
  E("makburi", "velidkesir", "م س", "Tehzîb 2284"),
  E("makburi", "yahyasaidensari", "م", "Tehzîb 2284"),


  /* Ebû Osmân en-Nehdî (o. 95) -- hocalari.
     Tehzîb 3968. Tercemede 38 kayit var, agda dugumu olan 22'i cizildi. */
  E("ubey", "ebuosmannehdi", "م د ق", "Tehzîb 3968"),
  E("usame", "ebuosmannehdi", "ع", "Tehzîb 3968"),
  E("cabir", "ebuosmannehdi", "—", "Tehzîb 3968"),
  E("huzeyfe", "ebuosmannehdi", "—", "Tehzîb 3968"),
  E("zeydarkam", "ebuosmannehdi", "م ت", "Tehzîb 3968"),
  E("sadvakkas", "ebuosmannehdi", "خ م د ق", "Tehzîb 3968"),
  E("selmanfarisi", "ebuosmannehdi", "ع", "Tehzîb 3968"),
  E("talha", "ebuosmannehdi", "خ م", "Tehzîb 3968"),
  E("ibnabbas", "ebuosmannehdi", "م", "Tehzîb 3968"),
  E("ibnomer", "ebuosmannehdi", "خ", "Tehzîb 3968"),
  E("abdullahamr", "ebuosmannehdi", "—", "Tehzîb 3968"),
  E("ibnmesud", "ebuosmannehdi", "ع", "Tehzîb 3968"),
  E("abdrahmanebubekir", "ebuosmannehdi", "خ م د", "Tehzîb 3968"),
  E("ali", "ebuosmannehdi", "عس", "Tehzîb 3968"),
  E("omer", "ebuosmannehdi", "خ م د س ق", "Tehzîb 3968"),
  E("imranhusayn", "ebuosmannehdi", "—", "Tehzîb 3968"),
  E("ebubekre", "ebuosmannehdi", "م د ق", "Tehzîb 3968"),
  E("ebuzer", "ebuosmannehdi", "ت س ق", "Tehzîb 3968"),
  E("ebusaid", "ebuosmannehdi", "م", "Tehzîb 3968"),
  E("ebumusa", "ebuosmannehdi", "ع", "Tehzîb 3968"),
  E("ebuhureyre", "ebuosmannehdi", "ع", "Tehzîb 3968"),
  E("ummuseleme", "ebuosmannehdi", "—", "Tehzîb 3968"),


  /* Ebû Osmân en-Nehdî (o. 95) -- talebeleri.
     Tehzîb 3968. Tercemede 34 kayit var, agda dugumu olan 10'i cizildi. */
  E("ebuosmannehdi", "eyyubsahtiyani", "خ م ت", "Tehzîb 3968"),
  E("ebuosmannehdi", "sabitbunani", "م د س", "Tehzîb 3968"),
  E("ebuosmannehdi", "humeydtavil", "—", "Tehzîb 3968"),
  E("ebuosmannehdi", "halidhazza", "خ م ت س", "Tehzîb 3968"),
  E("ebuosmannehdi", "davudebihind", "م س", "Tehzîb 3968"),
  E("ebuosmannehdi", "cureyri", "م د ت ق", "Tehzîb 3968"),
  E("ebuosmannehdi", "suleymanteymi", "ع", "Tehzîb 3968"),
  E("ebuosmannehdi", "asimahvel", "ع", "Tehzîb 3968"),
  E("ebuosmannehdi", "alizeydcudan", "د ق", "Tehzîb 3968"),
  E("ebuosmannehdi", "avfarabi", "خ", "Tehzîb 3968"),


  /* Cübeyr b. Nüfeyr (o. 80) -- hocalari.
     Tehzîb 905. Tercemede 32 kayit var, agda dugumu olan 11'i cizildi. */
  E("halidvelid", "cubeyrnufeyr", "د", "Tehzîb 905"),
  E("ubadesamit", "cubeyrnufeyr", "ت", "Tehzîb 905"),
  E("ibnomer", "cubeyrnufeyr", "ت ق", "Tehzîb 905"),
  E("abdullahamr", "cubeyrnufeyr", "س ق", "Tehzîb 905"),
  E("ukbeamir", "cubeyrnufeyr", "م د س", "Tehzîb 905"),
  E("omer", "cubeyrnufeyr", "—", "Tehzîb 905"),
  E("mikdad", "cubeyrnufeyr", "بخ د", "Tehzîb 905"),
  E("ebueyyub", "cubeyrnufeyr", "س", "Tehzîb 905"),
  E("ebubekir", "cubeyrnufeyr", "سي", "Tehzîb 905"),
  E("ebuzer", "cubeyrnufeyr", "٤", "Tehzîb 905"),
  E("aise", "cubeyrnufeyr", "س", "Tehzîb 905"),


  /* Cübeyr b. Nüfeyr (o. 80) -- talebeleri.
     Tehzîb 905. Tercemede 21 kayit var, agda dugumu olan 2'i cizildi. */
  E("cubeyrnufeyr", "rebiayezid", "د س", "Tehzîb 905"),
  E("cubeyrnufeyr", "mekhul", "عخ د ت ق", "Tehzîb 905"),


  /* Abdurrahman b. Ganm (o. 78) -- hocalari.
     Tehzîb 3928. Tercemede 17 kayit var, agda dugumu olan 9'i cizildi. */
  E("ubadesamit", "ibnganm", "ق", "Tehzîb 3928"),
  E("osman", "ibnganm", "—", "Tehzîb 3928"),
  E("ali", "ibnganm", "—", "Tehzîb 3928"),
  E("omer", "ibnganm", "—", "Tehzîb 3928"),
  E("muazcebel", "ibnganm", "د ت سي ق", "Tehzîb 3928"),
  E("ebudderda", "ibnganm", "—", "Tehzîb 3928"),
  E("ebuzer", "ibnganm", "ت سي ق", "Tehzîb 3928"),
  E("ebumusa", "ibnganm", "د", "Tehzîb 3928"),
  E("ebuhureyre", "ibnganm", "س", "Tehzîb 3928"),


  /* Abdurrahman b. Ganm (o. 78) -- talebeleri.
     Tehzîb 3928. Tercemede 20 kayit var, agda dugumu olan 4'i cizildi. */
  E("ibnganm", "sehrhavseb", "٤", "Tehzîb 3928"),
  E("ibnganm", "umeyrhani", "—", "Tehzîb 3928"),
  E("ibnganm", "mekhul", "د", "Tehzîb 3928"),
  E("ibnganm", "ebuidrishavlani", "—", "Tehzîb 3928"),


  /* Saîd b. Ebî Hilâl (o. 135) -- hocalari.
     Tehzîb 2372. Tercemede 53 kayit var, agda dugumu olan 14'i cizildi. */
  E("enes", "saidebihilal", "—", "Tehzîb 2372"),
  E("cabir", "saidebihilal", "خت ت", "Tehzîb 2372"),
  E("rebiaebiabdrahman", "saidebihilal", "خ", "Tehzîb 2372"),
  E("zeydeslem", "saidebihilal", "خ م", "Tehzîb 2372"),
  E("ubeydullaherafi", "saidebihilal", "—", "Tehzîb 2372"),
  E("alaabdrahman", "saidebihilal", "—", "Tehzîb 2372"),
  E("kasimebibezze", "saidebihilal", "عس", "Tehzîb 2372"),
  E("katade", "saidebihilal", "خت", "Tehzîb 2372"),
  E("ibnsihab", "saidebihilal", "س", "Tehzîb 2372"),
  E("ibnmunkedir", "saidebihilal", "م قد", "Tehzîb 2372"),
  E("nafiibnomer", "saidebihilal", "خ", "Tehzîb 2372"),
  E("hisamurve", "saidebihilal", "—", "Tehzîb 2372"),
  E("yahyasaidensari", "saidebihilal", "س", "Tehzîb 2372"),
  E("yezidhad", "saidebihilal", "ت س", "Tehzîb 2372"),


  /* Saîd b. Ebî Hilâl (o. 135) -- talebeleri.
     Tehzîb 2372. Tercemede 11 kayit var, agda dugumu olan 3'i cizildi. */
  E("saidebihilal", "amrharis", "ع", "Tehzîb 2372"),
  E("saidebihilal", "leysbsad", "—", "Tehzîb 2372"),
  E("saidebihilal", "yezidebihabib", "—", "Tehzîb 2372"),


  /* Safvân b. Süleym (o. 132) -- hocalari.
     Tehzîb 2882. Tercemede 39 kayit var, agda dugumu olan 22'i cizildi. */
  E("enes", "safvansuleym", "—", "Tehzîb 2882"),
  E("cabir", "safvansuleym", "—", "Tehzîb 2882"),
  E("hamzaibnomer", "safvansuleym", "—", "Tehzîb 2882"),
  E("humeydavf", "safvansuleym", "م", "Tehzîb 2882"),
  E("salimibnomer", "safvansuleym", "—", "Tehzîb 2882"),
  E("saidmusayyeb", "safvansuleym", "د ت", "Tehzîb 2882"),
  E("suleymanyesar", "safvansuleym", "—", "Tehzîb 2882"),
  E("tavus", "safvansuleym", "—", "Tehzîb 2882"),
  E("ibncafer", "safvansuleym", "—", "Tehzîb 2882"),
  E("abdullahdinar", "safvansuleym", "ق", "Tehzîb 2882"),
  E("ibnomer", "safvansuleym", "—", "Tehzîb 2882"),
  E("ibnganm", "safvansuleym", "—", "Tehzîb 2882"),
  E("arac", "safvansuleym", "—", "Tehzîb 2882"),
  E("urve", "safvansuleym", "—", "Tehzîb 2882"),
  E("atayesar", "safvansuleym", "خ م د س ق", "Tehzîb 2882"),
  E("ikrime", "safvansuleym", "—", "Tehzîb 2882"),
  E("kasimmuhammed", "safvansuleym", "—", "Tehzîb 2882"),
  E("kureyb", "safvansuleym", "—", "Tehzîb 2882"),
  E("naficubeyr", "safvansuleym", "د س", "Tehzîb 2882"),
  E("nafiibnomer", "safvansuleym", "—", "Tehzîb 2882"),
  E("ebuumamesehl", "safvansuleym", "—", "Tehzîb 2882"),
  E("ebuselemeavf", "safvansuleym", "س", "Tehzîb 2882"),


  /* Safvân b. Süleym (o. 132) -- talebeleri.
     Tehzîb 2882. Tercemede 34 kayit var, agda dugumu olan 18'i cizildi. */
  E("safvansuleym", "ibrahimsad", "س", "Tehzîb 2882"),
  E("safvansuleym", "ibrahimtahman", "—", "Tehzîb 2882"),
  E("safvansuleym", "usamezeydeslem", "—", "Tehzîb 2882"),
  E("safvansuleym", "usamezeydleysi", "—", "Tehzîb 2882"),
  E("safvansuleym", "enesiyaz", "—", "Tehzîb 2882"),
  E("safvansuleym", "ziyadsad", "—", "Tehzîb 2882"),
  E("safvansuleym", "zeydeslem", "—", "Tehzîb 2882"),
  E("safvansuleym", "sevri", "—", "Tehzîb 2882"),
  E("safvansuleym", "ibnuyeyne", "خ د س ق", "Tehzîb 2882"),
  E("safvansuleym", "darevardi", "م د س", "Tehzîb 2882"),
  E("safvansuleym", "ibncureyc", "د س", "Tehzîb 2882"),
  E("safvansuleym", "leysbsad", "د ت", "Tehzîb 2882"),
  E("safvansuleym", "malik", "ع", "Tehzîb 2882"),
  E("safvansuleym", "muhammedacilan", "—", "Tehzîb 2882"),
  E("safvansuleym", "muhammedamralkame", "—", "Tehzîb 2882"),
  E("safvansuleym", "ibnmunkedir", "—", "Tehzîb 2882"),
  E("safvansuleym", "musaukbe", "س", "Tehzîb 2882"),
  E("safvansuleym", "yezidebihabib", "م", "Tehzîb 2882"),


  /* Bükeyr b. Abdillâh b. el-Eşec (o. 122) -- hocalari.
     Tehzîb 765. Tercemede 60 kayit var, agda dugumu olan 14'i cizildi. */
  E("ebuumamesehl", "bukeyresec", "—", "Tehzîb 765"),
  E("hasanbali", "bukeyresec", "د س", "Tehzîb 765"),
  E("hamranaban", "bukeyresec", "م", "Tehzîb 765"),
  E("saibyezid", "bukeyresec", "—", "Tehzîb 765"),
  E("saidmusayyeb", "bukeyresec", "م س", "Tehzîb 765"),
  E("suleymanyesar", "bukeyresec", "خ م س", "Tehzîb 765"),
  E("suheylebisalih", "bukeyresec", "س", "Tehzîb 765"),
  E("ubeydullahomeri2", "bukeyresec", "م س", "Tehzîb 765"),
  E("ubeydullahmiksem", "bukeyresec", "م د", "Tehzîb 765"),
  E("irakmalik", "bukeyresec", "م", "Tehzîb 765"),
  E("kureyb", "bukeyresec", "خ م د س ق", "Tehzîb 765"),
  E("mahmudlebid", "bukeyresec", "س", "Tehzîb 765"),
  E("nafiibnomer", "bukeyresec", "خ م د س ق", "Tehzîb 765"),
  E("ebuselemeavf", "bukeyresec", "م", "Tehzîb 765"),


  /* Bükeyr b. Abdillâh b. el-Eşec (o. 122) -- talebeleri.
     Tehzîb 765. Tercemede 20 kayit var, agda dugumu olan 5'i cizildi. */
  E("bukeyresec", "amrharis", "خ م د س", "Tehzîb 765"),
  E("bukeyresec", "leysbsad", "خ م س", "Tehzîb 765"),
  E("bukeyresec", "ibnishak", "—", "Tehzîb 765"),
  E("bukeyresec", "muhammedacilan", "بخ م", "Tehzîb 765"),
  E("bukeyresec", "yezidebihabib", "—", "Tehzîb 765"),


  /* Nâfi b. Cübeyr b. Mut‘im (o. 99) -- hocalari.
     Tehzîb 6359. Tercemede 21 kayit var, agda dugumu olan 9'i cizildi. */
  E("besrsuhaym", "naficubeyr", "س ق", "Tehzîb 6359"),
  E("cerirbecelî", "naficubeyr", "م", "Tehzîb 6359"),
  E("rafihadic", "naficubeyr", "م", "Tehzîb 6359"),
  E("sehlsad", "naficubeyr", "—", "Tehzîb 6359"),
  E("ibnabbas", "naficubeyr", "ع", "Tehzîb 6359"),
  E("ali", "naficubeyr", "ت عس", "Tehzîb 6359"),
  E("mugirasube", "naficubeyr", "د", "Tehzîb 6359"),
  E("ebuhureyre", "naficubeyr", "خ م س ق", "Tehzîb 6359"),
  E("ummuseleme", "naficubeyr", "ت ق", "Tehzîb 6359"),


  /* Nâfi b. Cübeyr b. Mut‘im (o. 99) -- talebeleri.
     Tehzîb 6359. Tercemede 33 kayit var, agda dugumu olan 12'i cizildi. */
  E("naficubeyr", "caferebivahsiyye", "—", "Tehzîb 6359"),
  E("naficubeyr", "habibebisabit", "س ق", "Tehzîb 6359"),
  E("naficubeyr", "davudkaysferra", "سي", "Tehzîb 6359"),
  E("naficubeyr", "sadibrahim", "خ م س ق", "Tehzîb 6359"),
  E("naficubeyr", "salihkeysan", "د س", "Tehzîb 6359"),
  E("naficubeyr", "ubeydullahebiyezid", "خ م س ق", "Tehzîb 6359"),
  E("naficubeyr", "urve", "خ", "Tehzîb 6359"),
  E("naficubeyr", "amrdinar", "م س ق", "Tehzîb 6359"),
  E("naficubeyr", "muhammedsuka", "خ ت ق", "Tehzîb 6359"),
  E("naficubeyr", "ibnsihab", "م س", "Tehzîb 6359"),
  E("naficubeyr", "ebuzubeyrmekki", "ت س", "Tehzîb 6359"),
  E("naficubeyr", "musaukbe", "د", "Tehzîb 6359"),


  /* Mus‘ab b. Sa‘d (o. 103) -- hocalari.
     Tehzîb 5982. Tercemede 7 kayit var, agda dugumu olan 5'i cizildi. */
  E("sadvakkas", "musabsad", "ع", "Tehzîb 5982"),
  E("suhayb", "musabsad", "—", "Tehzîb 5982"),
  E("talha", "musabsad", "—", "Tehzîb 5982"),
  E("ibnomer", "musabsad", "م ت ق", "Tehzîb 5982"),
  E("ali", "musabsad", "—", "Tehzîb 5982"),


  /* Mus‘ab b. Sa‘d (o. 103) -- talebeleri.
     Tehzîb 5982. Tercemede 18 kayit var, agda dugumu olan 8'i cizildi. */
  E("musabsad", "suddi", "د س", "Tehzîb 5982"),
  E("musabsad", "hakemuteybe", "خ م س", "Tehzîb 5982"),
  E("musabsad", "zubeyradi", "م س ق", "Tehzîb 5982"),
  E("musabsad", "simakharb", "بخ م ت ق", "Tehzîb 5982"),
  E("musabsad", "asimbehdele", "٤", "Tehzîb 5982"),
  E("musabsad", "abdulmelikumeyr", "خ م ت س", "Tehzîb 5982"),
  E("musabsad", "musacuheni", "م ت سي", "Tehzîb 5982"),
  E("musabsad", "ebuishaksebii", "ت س ق", "Tehzîb 5982"),


  /* İrâk b. Mâlik (o. 105) -- hocalari.
     Tehzîb 3893. Tercemede 13 kayit var, agda dugumu olan 9'i cizildi. */
  E("talha", "irakmalik", "—", "Tehzîb 3893"),
  E("ibnomer", "irakmalik", "س", "Tehzîb 3893"),
  E("ubeydullahutbe", "irakmalik", "خ م س", "Tehzîb 3893"),
  E("urve", "irakmalik", "خ م د س", "Tehzîb 3893"),
  E("ibnsihab", "irakmalik", "س", "Tehzîb 3893"),
  E("ebubekirabdrahman", "irakmalik", "س", "Tehzîb 3893"),
  E("ebuselemeavf", "irakmalik", "خ د", "Tehzîb 3893"),
  E("ebuhureyre", "irakmalik", "ع", "Tehzîb 3893"),
  E("aise", "irakmalik", "م ق", "Tehzîb 3893"),


  /* İrâk b. Mâlik (o. 105) -- talebeleri.
     Tehzîb 3893. Tercemede 15 kayit var, agda dugumu olan 8'i cizildi. */
  E("irakmalik", "hakemuteybe", "—", "Tehzîb 3893"),
  E("irakmalik", "husaymirak", "خ م س", "Tehzîb 3893"),
  E("irakmalik", "suleymanyesar", "ع", "Tehzîb 3893"),
  E("irakmalik", "abdulazizomer", "—", "Tehzîb 3893"),
  E("irakmalik", "ukaylhalid", "—", "Tehzîb 3893"),
  E("irakmalik", "mekhul", "د س", "Tehzîb 3893"),
  E("irakmalik", "yahyasaidensari", "س", "Tehzîb 3893"),
  E("irakmalik", "yezidebihabib", "خ م د س", "Tehzîb 3893"),


  /* Me‘âfâ b. İmrân (o. 185) -- talebeleri.
     Tehzîb 6041. Tercemede 29 kayit var, agda dugumu olan 2'i cizildi. */
  E("mafairan", "bakiyyevelid", "—", "Tehzîb 6041"),
  E("mafairan", "veki", "—", "Tehzîb 6041"),


  /* Mücâhid b. Mûsâ (o. 244) -- talebeleri.
     Tehzîb 5784. Tercemede 16 kayit var, agda dugumu olan 6'i cizildi. */
  E("mucahidmusa", "bh03", "—", "Tehzîb 5784"),
  E("mucahidmusa", "zuhli", "—", "Tehzîb 5784"),
  E("mucahidmusa", "ed20", "—", "Tehzîb 5784"),
  E("mucahidmusa", "ebuhatimrazi", "—", "Tehzîb 5784"),
  E("mucahidmusa", "ebuzuraraazi", "—", "Tehzîb 5784"),

  /* Mücâhid b. Mûsâ -- "روى له الجماعة سوى البخاري" ifadesinden: metinde tek tek adlariyla gecmeyen dort muellif. */
  E("mucahidmusa", "muslim", "—", "Tehzîb 5784, “el-cemâa sivâ'l-Buhârî”"),
  E("mucahidmusa", "ebudavud", "—", "Tehzîb 5784, “el-cemâa sivâ'l-Buhârî”"),
  E("mucahidmusa", "tirmizi", "—", "Tehzîb 5784, “el-cemâa sivâ'l-Buhârî”"),
  E("mucahidmusa", "nesai", "—", "Tehzîb 5784, “el-cemâa sivâ'l-Buhârî”"),
  E("mucahidmusa", "ibnmace", "—", "Tehzîb 5784, “el-cemâa sivâ'l-Buhârî”"),


  /* Amr b. Merzûk (o. 224) -- talebeleri.
     Tehzîb 4446. Tercemede 28 kayit var, agda dugumu olan 6'i cizildi. */
  E("amrmerzuk", "ebudavud", "—", "Tehzîb 4446"),
  E("amrmerzuk", "bh05", "—", "Tehzîb 4446"),
  E("amrmerzuk", "ed13", "—", "Tehzîb 4446"),
  E("amrmerzuk", "ebuzuraraazi", "—", "Tehzîb 4446"),
  E("amrmerzuk", "ebuhatimrazi", "—", "Tehzîb 4446"),
  E("amrmerzuk", "bundar", "—", "Tehzîb 4446"),
  E("amrmerzuk", "buhari", "—", "Tehzîb 4446, makrûnen bi-gayrihî"),


  /* Ebû'l-Mugīre Abdülkuddûs el-Havlânî (o. 212) -- talebeleri.
     Tehzîb 3495. Tercemede 29 kayit var, agda dugumu olan 7'i cizildi. */
  E("ebulmugirehavlani", "buhari", "—", "Tehzîb 3495"),
  E("ebulmugirehavlani", "ahmedhanbel", "د", "Tehzîb 3495"),
  E("ebulmugirehavlani", "ishakkevsec", "خ م ت س", "Tehzîb 3495"),
  E("ebulmugirehavlani", "suaybishakdimaski", "س", "Tehzîb 3495"),
  E("ebulmugirehavlani", "darimi", "م ت", "Tehzîb 3495"),
  E("ebulmugirehavlani", "zuhli", "د ق", "Tehzîb 3495"),
  E("ebulmugirehavlani", "ibnmain", "—", "Tehzîb 3495"),


  /* Ebû Nasr et-Temmâr (o. 228) -- talebeleri.
     Tehzîb 3540. Tercemede 23 kayit var, agda dugumu olan 8'i cizildi. */
  E("ebunasrtemmar", "muslim", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ahmedmeni", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ed20", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ebukudame", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ebuzuraraazi", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "amrbnalisayrafi", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ebuhatimrazi", "—", "Tehzîb 3540"),
  E("ebunasrtemmar", "ibnmusenna", "—", "Tehzîb 3540"),


  /* Süveyd b. Nasr et-Tûsânî (o. 240) -- talebeleri.
     Tehzîb 2651. Tercemede 31 kayit var, agda dugumu olan 3'i cizildi. */
  E("suveydnasr", "tirmizi", "—", "Tehzîb 2651"),
  E("suveydnasr", "nesai", "—", "Tehzîb 2651"),
  E("suveydnasr", "ed16", "—", "Tehzîb 2651"),


  /* Ali b. el-Mübârek (o. ?) -- talebeleri.
     Tehzîb 4124. Tercemede 17 kayit var, agda dugumu olan 7'i cizildi. */
  E("alimubarek", "ibnuleyye", "خ م ت", "Tehzîb 4124"),
  E("alimubarek", "ibnmubarek", "س", "Tehzîb 4124"),
  E("alimubarek", "ebunuaymfadl", "—", "Tehzîb 4124"),
  E("alimubarek", "muslimibrahim", "د", "Tehzîb 4124"),
  E("alimubarek", "veki", "خ م س ق", "Tehzîb 4124"),
  E("alimubarek", "kattan", "د س", "Tehzîb 4124"),
  E("alimubarek", "ebuamirakadi", "—", "Tehzîb 4124"),


  /* Ca‘d Ebû Osmân (o. ?) -- talebeleri.
     Tehzîb 926. Tercemede 13 kayit var, agda dugumu olan 9'i cizildi. */
  E("cadebuosman", "ibrahimtahman", "خت", "Tehzîb 926"),
  E("cadebuosman", "ibnuleyye", "—", "Tehzîb 926"),
  E("cadebuosman", "hammadzeyd", "خ م", "Tehzîb 926"),
  E("cadebuosman", "hammadseleme", "—", "Tehzîb 926"),
  E("cadebuosman", "sube", "—", "Tehzîb 926"),
  E("cadebuosman", "abdulvarissaid", "خ م", "Tehzîb 926"),
  E("cadebuosman", "mamer", "م س", "Tehzîb 926"),
  E("cadebuosman", "ebuavane", "م د ت", "Tehzîb 926"),
  E("cadebuosman", "vuheybhalid", "—", "Tehzîb 926"),


  /* Bekîr b. el-Ahnes (o. ?) -- talebeleri.
     Tehzîb 760. Tercemede 12 kayit var, agda dugumu olan 4'i cizildi. */
  E("bekirahnes", "hamzazeyyat", "—", "Tehzîb 760"),
  E("bekirahnes", "amess", "—", "Tehzîb 760"),
  E("bekirahnes", "misersukdam", "م", "Tehzîb 760"),
  E("bekirahnes", "ismailebiislamsibani", "م", "Tehzîb 760"),
  E("bekirahnes", "ebuavane", "زم د س ق", "Tehzîb 760"),


  /* Vehb b. Keysân (o. 127) -- talebeleri.
     Tehzîb 6765. Tercemede 14 kayit var, agda dugumu olan 9'i cizildi. */
  E("vehbkeysan", "eyyubsahtiyani", "س", "Tehzîb 6765"),
  E("vehbkeysan", "abdulhamidcafer", "س", "Tehzîb 6765"),
  E("vehbkeysan", "macisun", "م", "Tehzîb 6765"),
  E("vehbkeysan", "ubeydullahomeri", "خ م", "Tehzîb 6765"),
  E("vehbkeysan", "malik", "خ م س", "Tehzîb 6765"),
  E("vehbkeysan", "ibnishak", "خت", "Tehzîb 6765"),
  E("vehbkeysan", "muhammedacilan", "بخ", "Tehzîb 6765"),
  E("vehbkeysan", "hisamurve", "خ م ق", "Tehzîb 6765"),
  E("vehbkeysan", "velidkesir", "خ م س ق", "Tehzîb 6765"),


  /* Hamza b. Abdillâh b. Ömer (oğlu) (o. ?) -- talebeleri.
     Tehzîb 1507. Tercemede 11 kayit var, agda dugumu olan 4'i cizildi. */
  E("hamzaibnomerogul", "safvansuleym", "—", "Tehzîb 1507"),
  E("hamzaibnomerogul", "ibnsihab", "ع", "Tehzîb 1507"),
  E("hamzaibnomerogul", "musaukbe", "م", "Tehzîb 1507"),
  E("hamzaibnomerogul", "yezidhad", "—", "Tehzîb 1507"),


  /* Hakem b. el-A‘rec (o. ?) -- talebeleri.
     Tehzîb 1431. Tercemede 8 kayit var, agda dugumu olan 3'i cizildi. */
  E("hakemarac", "halidhazza", "م", "Tehzîb 1431"),
  E("hakemarac", "cureyri", "—", "Tehzîb 1431"),
  E("hakemarac", "alizeydcudan", "—", "Tehzîb 1431"),


  /* Abbâd b. Abdillâh b. ez-Zübeyr (o. ?) -- talebeleri.
     Tehzîb 3086. Tercemede 9 kayit var, agda dugumu olan 2'i cizildi. */
  E("abbadabdullahzubeyr", "ibnebimuleyke", "خ م س", "Tehzîb 3086"),
  E("abbadabdullahzubeyr", "hisamurve", "خ م ت سي", "Tehzîb 3086"),

  E("saidzuhadan", "ebuishaksebii", "عس", "Tehzîb 2266"),


  /* Nu‘mân b. Ebî Ayyâş ez-Zürakī (o. ?) -- talebeleri.
     Tehzîb 6445. Tercemede 13 kayit var, agda dugumu olan 5'i cizildi. */
  E("numanebiayyas", "suheylebisalih", "خ م ت س ق", "Tehzîb 6445"),
  E("numanebiayyas", "safvansuleym", "—", "Tehzîb 6445"),
  E("numanebiayyas", "abdullahdinar", "—", "Tehzîb 6445"),
  E("numanebiayyas", "muhammedacilan", "ي", "Tehzîb 6445"),
  E("numanebiayyas", "yahyasaidensari", "خ م س", "Tehzîb 6445"),


  /* Ebû's-Sıddīk en-Nâcî (o. 108) -- talebeleri.
     Tehzîb 751. Tercemede 11 kayit var, agda dugumu olan 3'i cizildi. */
  E("ebussiddiknaci", "asimahvel", "س", "Tehzîb 751"),
  E("ebussiddiknaci", "amiralhavl", "ت ق", "Tehzîb 751"),
  E("ebussiddiknaci", "katade", "خ م د س ق", "Tehzîb 751"),


  /* Zekvân mevlâ Âişe (o. ?) -- talebeleri.
     Tehzîb 1815. Tercemede 7 kayit var, agda dugumu olan 3'i cizildi. */
  E("zekvanmevlaaise", "ibnebimuleyke", "خ م س", "Tehzîb 1815"),
  E("zekvanmevlaaise", "abdrahmanharis", "س", "Tehzîb 1815"),
  E("zekvanmevlaaise", "zeynelabidin", "م", "Tehzîb 1815"),


  /* Âsım b. Ömer b. el-Hattâb (o. 70) -- talebeleri.
     Tehzîb 3018. Tercemede 3 kayit var, agda dugumu olan 1'i cizildi. */
  E("asimomer", "urve", "خ م د ت س", "Tehzîb 3018"),


  /* Beşîr b. Nehîk (o. ?) -- talebeleri.
     Tehzîb 730. Tercemede 7 kayit var, agda dugumu olan 1'i cizildi. */
  E("besirnehik", "yahyasaidensari", "س", "Tehzîb 730"),

  /* ---- SIYER EKI (Zehebi, Siyer 12/394-395) ----
     Buhari'nin sehirlere gore sayilan seyhleri. Bu dortu ZATEN
     DUGUM olarak vardi ama Buhari'ye bagli degildi; Zehebi dordunu de
     acikca Buhari'nin hocasi olarak sayiyor. */
  E("abdan", "buhari", "—", "Siyer 12/394"),
  E("alihasansakik", "buhari", "—", "Siyer 12/394"),
  E("ubeydullahmusa", "buhari", "—", "Siyer 12/394"),
  E("yahyayahyanisaburi", "buhari", "—", "Siyer 12/394"),

  /* Abdullah b. Yûsuf et-Tinnîsî (o. 218) -- hocalari.
     Tehzîb 3673. Tercemede 29 kayit var, agda dugumu olan 7'i cizildi. */
  E("ibnuleyye", "abdullahyusuftinnisi", "—", "Tehzîb 3673"),
  E("saidabdulaziz", "abdullahyusuftinnisi", "د س", "Tehzîb 3673"),
  E("ibnvehb", "abdullahyusuftinnisi", "خ", "Tehzîb 3673"),
  E("isabyunus", "abdullahyusuftinnisi", "س", "Tehzîb 3673"),
  E("leysbsad", "abdullahyusuftinnisi", "خ س", "Tehzîb 3673"),
  E("malik", "abdullahyusuftinnisi", "خ كن", "Tehzîb 3673"),
  E("velidmuslim", "abdullahyusuftinnisi", "د", "Tehzîb 3673"),


  /* Abdullah b. Yûsuf et-Tinnîsî (o. 218) -- talebeleri.
     Tehzîb 3673. Tercemede 28 kayit var, agda dugumu olan 5'i cizildi. */
  E("abdullahyusuftinnisi", "cuzcani", "س", "Tehzîb 3673"),
  E("abdullahyusuftinnisi", "harmalayahya", "—", "Tehzîb 3673"),
  E("abdullahyusuftinnisi", "ebuhatimrazi", "ت كن", "Tehzîb 3673"),
  E("abdullahyusuftinnisi", "zuhli", "—", "Tehzîb 3673"),
  E("abdullahyusuftinnisi", "ibnmain", "—", "Tehzîb 3673"),
  E("abdullahyusuftinnisi", "buhari", "خ", "Tehzîb 3673"),


  /* Ebü'l-Yemân el-Hakem b. Nâfi‘ (o. 222) -- hocalari.
     Tehzîb 1448. Tercemede 12 kayit var, agda dugumu olan 3'i cizildi. */
  E("ismailayyas", "ebulyemanhakem", "د", "Tehzîb 1448"),
  E("saidabdulaziz", "ebulyemanhakem", "—", "Tehzîb 1448"),
  E("suaybebihamza", "ebulyemanhakem", "ع", "Tehzîb 1448"),


  /* Ebü'l-Yemân el-Hakem b. Nâfi‘ (o. 222) -- talebeleri.
     Tehzîb 1448. Tercemede 20 kayit var, agda dugumu olan 2'i cizildi. */
  E("ebulyemanhakem", "ahmedhanbel", "—", "Tehzîb 1448"),
  E("ebulyemanhakem", "darimi", "م", "Tehzîb 1448"),
  E("ebulyemanhakem", "buhari", "خ", "Tehzîb 1448"),


  /* Mekkî b. İbrâhîm el-Belhî (o. 215) -- hocalari.
     Tehzîb 6170. Tercemede 29 kayit var, agda dugumu olan 10'i cizildi. */
  E("behzhakim", "mekkiibrahim", "عخ ت", "Tehzîb 6170"),
  E("caferisadik", "mekkiibrahim", "—", "Tehzîb 6170"),
  E("hasanisad", "mekkiibrahim", "خ د س", "Tehzîb 6170"),
  E("hanzalasufyan", "mekkiibrahim", "خ", "Tehzîb 6170"),
  E("ibncureyc", "mekkiibrahim", "خ م د س", "Tehzîb 6170"),
  E("fitrhalife", "mekkiibrahim", "—", "Tehzîb 6170"),
  E("malik", "mekkiibrahim", "كن ق", "Tehzîb 6170"),
  E("hasimhasim", "mekkiibrahim", "خ", "Tehzîb 6170"),
  E("hisamhassan", "mekkiibrahim", "خ", "Tehzîb 6170"),
  E("hisamdestuvai", "mekkiibrahim", "خ", "Tehzîb 6170"),


  /* Mekkî b. İbrâhîm el-Belhî (o. 215) -- talebeleri.
     Tehzîb 6170. Tercemede 23 kayit var, agda dugumu olan 6'i cizildi. */
  E("mekkiibrahim", "cuzcani", "س", "Tehzîb 6170"),
  E("mekkiibrahim", "ahmedhanbel", "—", "Tehzîb 6170"),
  E("mekkiibrahim", "zuhli", "—", "Tehzîb 6170"),
  E("mekkiibrahim", "harunhammal", "د س", "Tehzîb 6170"),
  E("mekkiibrahim", "ibnmain", "—", "Tehzîb 6170"),
  E("mekkiibrahim", "yahyayahyanisaburi", "—", "Tehzîb 6170"),
  E("mekkiibrahim", "buhari", "خ", "Tehzîb 6170"),


  /* Hâlid b. Mahled el-Katavânî (o. 213) -- hocalari.
     Tehzîb 1652. Tercemede 33 kayit var, agda dugumu olan 4'i cizildi. */
  E("suleymanbilal", "halidmahled", "خ م ت س ق", "Tehzîb 1652"),
  E("aliebisalihhayy", "halidmahled", "س", "Tehzîb 1652"),
  E("alimushir", "halidmahled", "خ م ت س", "Tehzîb 1652"),
  E("malik", "halidmahled", "م كد س ق", "Tehzîb 1652"),


  /* Hâlid b. Mahled el-Katavânî (o. 213) -- talebeleri.
     Tehzîb 1652. Tercemede 31 kayit var, agda dugumu olan 7'i cizildi. */
  E("halidmahled", "ibnrahuye", "—", "Tehzîb 1652"),
  E("halidmahled", "sufyanveki", "ت", "Tehzîb 1652"),
  E("halidmahled", "abbasanberi", "س", "Tehzîb 1652"),
  E("halidmahled", "ibnebiseybe", "م ق", "Tehzîb 1652"),
  E("halidmahled", "abdhumeyd", "م ت", "Tehzîb 1652"),
  E("halidmahled", "osmanebiseybe", "—", "Tehzîb 1652"),
  E("halidmahled", "ebukureyb", "م", "Tehzîb 1652"),
  E("halidmahled", "buhari", "خ", "Tehzîb 1652"),
  E("halidmahled", "abbasduri", "ت", "Tehzîb 1652"),
  /* Mizzi "وهو أكبر منه" der: ikisi akran, Ubeydullah daha yasli. */
  E("halidmahled", "ubeydullahmusa", "—", "Tehzîb 1652"),


  /* Asbağ b. el-Ferec el-Ümevî (o. 225) -- hocalari.
     Tehzîb 536. Tercemede 10 kayit var, agda dugumu olan 4'i cizildi. */
  E("ibnvehb", "asbagferec", "خ ت س", "Tehzîb 536"),
  E("ibnkasimmisri", "asbagferec", "س", "Tehzîb 536"),
  E("darevardi", "asbagferec", "د", "Tehzîb 536"),
  E("isabyunus", "asbagferec", "—", "Tehzîb 536"),


  /* Asbağ b. el-Ferec el-Ümevî (o. 225) -- talebeleri.
     Tehzîb 536. Tercemede 21 kayit var, agda dugumu olan 2'i cizildi. */
  E("asbagferec", "ebuhatimrazi", "—", "Tehzîb 536"),
  E("asbagferec", "zuhli", "د", "Tehzîb 536"),
  E("asbagferec", "buhari", "خ", "Tehzîb 536"),


  /* Süreyc b. en-Nu‘mân el-Cevherî (o. 217) -- hocalari.
     Tehzîb 2190. Tercemede 29 kayit var, agda dugumu olan 9'i cizildi. */
  E("bakiyyevelid", "surayjnuman", "—", "Tehzîb 2190"),
  E("cerirabdulhamid", "surayjnuman", "—", "Tehzîb 2190"),
  E("hammadzeyd", "surayjnuman", "—", "Tehzîb 2190"),
  E("hammadseleme", "surayjnuman", "تم س", "Tehzîb 2190"),
  E("ibnuyeyne", "surayjnuman", "—", "Tehzîb 2190"),
  E("ibnvehb", "surayjnuman", "—", "Tehzîb 2190"),
  E("macisun", "surayjnuman", "—", "Tehzîb 2190"),
  E("huseym", "surayjnuman", "—", "Tehzîb 2190"),
  E("ebuavane", "surayjnuman", "—", "Tehzîb 2190"),


  /* Süreyc b. en-Nu‘mân el-Cevherî (o. 217) -- talebeleri.
     Tehzîb 2190. Tercemede 27 kayit var, agda dugumu olan 9'i cizildi. */
  E("surayjnuman", "bh03", "—", "Tehzîb 2190"),
  E("surayjnuman", "ahmedhanbel", "—", "Tehzîb 2190"),
  E("surayjnuman", "ahmedmeni", "ت", "Tehzîb 2190"),
  E("surayjnuman", "zuheyrharb", "—", "Tehzîb 2190"),
  E("surayjnuman", "ibnebiseybe", "د ق", "Tehzîb 2190"),
  E("surayjnuman", "ebuzuraraazi", "—", "Tehzîb 2190"),
  E("surayjnuman", "amrnakid", "—", "Tehzîb 2190"),
  E("surayjnuman", "ebuhatimrazi", "—", "Tehzîb 2190"),
  E("surayjnuman", "muhammedrafi", "خ", "Tehzîb 2190"),
  E("surayjnuman", "buhari", "خ", "Tehzîb 2190"),
  E("surayjnuman", "abbasduri", "—", "Tehzîb 2190"),


  /* Müslim b. el-Haccâc (o. 261) -- hocalari.
     Siyer 12/558-561. Tercemede 157 kayit var, agda dugumu olan 11'i cizildi. */
  E("alihucr", "muslim", "—", "Siyer 12/558-561"),
  E("amrbnalisayrafi", "muslim", "—", "Siyer 12/558-561"),
  E("amrnakid", "muslim", "—", "Siyer 12/558-561"),
  E("muhammedabbadcafer", "muslim", "—", "Siyer 12/558-561"),
  E("muhammedabdulalasanani", "muslim", "—", "Siyer 12/558-561"),
  E("ibnebiomeradeni", "muslim", "—", "Siyer 12/558-561"),
  E("mahmudgaylan", "muslim", "—", "Siyer 12/558-561"),
  E("ibnmain", "muslim", "—", "Siyer 12/558-561"),
  E("alicad", "muslim", "—", "Siyer 12/558-561"),
  E("alimedini", "muslim", "—", "Siyer 12/558-561"),
  E("zuhli", "muslim", "—", "Siyer 12/558-561"),


  /* Nesâî (o. 303) -- hocalari.
     Siyer 14/125-126. Tercemede 72 kayit var, agda dugumu olan 7'i cizildi. */
  E("ahmedmeni", "nesai", "—", "Siyer 14/125-126"),
  E("alihucr", "nesai", "—", "Siyer 14/125-126"),
  E("bundar", "nesai", "—", "Siyer 14/125-126"),
  E("muhammedubeydmuharibi", "nesai", "—", "Siyer 14/125-126"),
  E("ibnmusenna", "nesai", "—", "Siyer 14/125-126"),
  E("mahmudgaylan", "nesai", "—", "Siyer 14/125-126"),
  E("hennadseri", "nesai", "—", "Siyer 14/125-126"),


  /* Ebû Dâvûd es-Sicistânî (o. 275) -- hocalari.
     Siyer 13/204-205. Tercemede 44 kayit var, agda dugumu olan 6'i cizildi. */
  E("saidsuleymansadeviye", "ebudavud", "—", "Siyer 13/204-205"),
  E("ibnrecagudani", "ebudavud", "—", "Siyer 13/204-205"),
  E("ibnrahuye", "ebudavud", "—", "Siyer 13/204-205"),
  E("ibrahimmusaferra", "ebudavud", "—", "Siyer 13/204-205"),
  E("alimedini", "ebudavud", "—", "Siyer 13/204-205"),
  E("ibnmain", "ebudavud", "—", "Siyer 13/204-205"),


  /* Tirmizî (o. 279) -- hocalari.
     Siyer 13/271. Tercemede 36 kayit var, agda dugumu olan 4'i cizildi. */
  E("ibnrahuye", "tirmizi", "—", "Siyer 13/271"),
  E("amrbnalisayrafi", "tirmizi", "—", "Siyer 13/271"),
  E("muhammedrafi", "tirmizi", "—", "Siyer 13/271"),
  E("nasralicehdami", "tirmizi", "—", "Siyer 13/271"),


  /* İbn Mâce (o. 273) -- hocalari.
     Siyer 13/277-278. Tercemede 23 kayit var, agda dugumu olan 2'i cizildi. */
  E("ibrahimmunzirhizami", "ibnmace", "—", "Siyer 13/277-278"),
  E("zuheyrharb", "ibnmace", "—", "Siyer 13/277-278"),


  /* Muhammed b. Sâbık et-Temîmî (o. 214) -- hocalari.
     Tehzîb 5230. Tercemede 18 kayit var, agda dugumu olan 9'i cizildi. */
  E("ibrahimtahman", "muhammedsabik", "—", "Tehzîb 5230"),
  E("israilyunus", "muhammedsabik", "—", "Tehzîb 5230"),
  E("zaidekudame", "muhammedsabik", "—", "Tehzîb 5230"),
  E("serikkadi", "muhammedsabik", "—", "Tehzîb 5230"),
  E("seybannahvi", "muhammedsabik", "—", "Tehzîb 5230"),
  E("malikmigvel", "muhammedsabik", "—", "Tehzîb 5230"),
  E("misersukdam", "muhammedsabik", "—", "Tehzîb 5230"),
  E("varkaomer", "muhammedsabik", "—", "Tehzîb 5230"),
  E("ibnebizaide", "muhammedsabik", "—", "Tehzîb 5230"),


  /* Muhammed b. Sâbık et-Temîmî (o. 214) -- talebeleri.
     Tehzîb 5230. Tercemede 15 kayit var, agda dugumu olan 9'i cizildi. */
  E("muhammedsabik", "ahmeddevraki", "—", "Tehzîb 5230"),
  E("muhammedsabik", "ahmedhanbel", "—", "Tehzîb 5230"),
  E("muhammedsabik", "zuheyrharb", "—", "Tehzîb 5230"),
  E("muhammedsabik", "ibnebiseybe", "—", "Tehzîb 5230"),
  E("muhammedsabik", "musnedi", "—", "Tehzîb 5230"),
  E("muhammedsabik", "mahmudgaylan", "—", "Tehzîb 5230"),
  E("muhammedsabik", "yakubdevraki", "—", "Tehzîb 5230"),
  E("muhammedsabik", "zuhli", "—", "Tehzîb 5230"),
  E("muhammedsabik", "ibnmusenna", "—", "Tehzîb 5230"),


  /* Muhammed b. Ar‘ara el-Kuraşî (o. 213) -- hocalari.
     Tehzîb 5463. Tercemede 10 kayit var, agda dugumu olan 3'i cizildi. */
  E("cerirhazim", "muhammedararah", "—", "Tehzîb 5463"),
  E("sube", "muhammedararah", "—", "Tehzîb 5463"),
  E("abdullahavn", "muhammedararah", "—", "Tehzîb 5463"),


  /* Muhammed b. Ar‘ara el-Kuraşî (o. 213) -- talebeleri.
     Tehzîb 5463. Tercemede 9 kayit var, agda dugumu olan 3'i cizildi. */
  E("muhammedararah", "bundar", "—", "Tehzîb 5463"),
  E("muhammedararah", "ibnmusenna", "—", "Tehzîb 5463"),
  E("muhammedararah", "nasralicehdami", "—", "Tehzîb 5463"),


  /* Bedel b. el-Muhabber et-Temîmî (o. 215) -- hocalari.
     Tehzîb 647. Tercemede 14 kayit var, agda dugumu olan 2'i cizildi. */
  E("zaidekudame", "bedelmuhabber", "—", "Tehzîb 647"),
  E("sube", "bedelmuhabber", "—", "Tehzîb 647"),


  /* Bedel b. el-Muhabber et-Temîmî (o. 215) -- talebeleri.
     Tehzîb 647. Tercemede 10 kayit var, agda dugumu olan 3'i cizildi. */
  E("bedelmuhabber", "amrbnalisayrafi", "—", "Tehzîb 647"),
  E("bedelmuhabber", "bundar", "—", "Tehzîb 647"),
  E("bedelmuhabber", "ibnmusenna", "—", "Tehzîb 647"),


  /* Talk b. Gannâm en-Nehaî (o. 211) -- hocalari.
     Tehzîb 2991. Tercemede 17 kayit var, agda dugumu olan 10'i cizildi. */
  E("hafsgiyas", "talkgannam", "—", "Tehzîb 2991"),
  E("zaidekudame", "talkgannam", "—", "Tehzîb 2991"),
  E("serieyyahya", "talkgannam", "—", "Tehzîb 2991"),
  E("serikkadi", "talkgannam", "—", "Tehzîb 2991"),
  E("seybannahvi", "talkgannam", "—", "Tehzîb 2991"),
  E("mesudi", "talkgannam", "—", "Tehzîb 2991"),
  E("abdusselamharb", "talkgannam", "—", "Tehzîb 2991"),
  E("kaysrebi", "talkgannam", "—", "Tehzîb 2991"),
  E("malikmigvel", "talkgannam", "—", "Tehzîb 2991"),
  E("hemmamyahya", "talkgannam", "—", "Tehzîb 2991"),


  /* Talk b. Gannâm en-Nehaî (o. 211) -- talebeleri.
     Tehzîb 2991. Tercemede 11 kayit var, agda dugumu olan 5'i cizildi. */
  E("talkgannam", "ahmeddevraki", "—", "Tehzîb 2991"),
  E("talkgannam", "ahmedhanbel", "—", "Tehzîb 2991"),
  E("talkgannam", "ibnebiseybe", "—", "Tehzîb 2991"),
  E("talkgannam", "osmanebiseybe", "—", "Tehzîb 2991"),
  E("talkgannam", "ebukureyb", "—", "Tehzîb 2991"),


  /* Hallâd b. Yahyâ es-Sülemî (o. 213) -- hocalari.
     Tehzîb 1741. Tercemede 19 kayit var, agda dugumu olan 7'i cizildi. */
  E("sevri", "halladyahya", "—", "Tehzîb 1741"),
  E("omerzerr", "halladyahya", "—", "Tehzîb 1741"),
  E("fitrhalife", "halladyahya", "—", "Tehzîb 1741"),
  E("kaysrebi", "halladyahya", "—", "Tehzîb 1741"),
  E("malikmigvel", "halladyahya", "—", "Tehzîb 1741"),
  E("misersukdam", "halladyahya", "—", "Tehzîb 1741"),
  E("nafiomercumahi", "halladyahya", "—", "Tehzîb 1741"),


  /* Hallâd b. Yahyâ es-Sülemî (o. 213) -- talebeleri.
     Tehzîb 1741. Tercemede 7 kayit var, agda dugumu olan 1'i cizildi. */
  E("halladyahya", "ebuzuraraazi", "—", "Tehzîb 1741"),


  /* Ali b. Ayyâş el-Elhânî (o. 219) -- hocalari.
     Tehzîb 4116. Tercemede 16 kayit var, agda dugumu olan 7'i cizildi. */
  E("ismailayyas", "aliayyas", "—", "Tehzîb 4116"),
  E("bakiyyevelid", "aliayyas", "—", "Tehzîb 4116"),
  E("ibnuyeyne", "aliayyas", "—", "Tehzîb 4116"),
  E("suaybebihamza", "aliayyas", "—", "Tehzîb 4116"),
  E("macisun", "aliayyas", "—", "Tehzîb 4116"),
  E("isabyunus", "aliayyas", "—", "Tehzîb 4116"),
  E("leysbsad", "aliayyas", "—", "Tehzîb 4116"),


  /* Ali b. Ayyâş el-Elhânî (o. 219) -- talebeleri.
     Tehzîb 4116. Tercemede 13 kayit var, agda dugumu olan 4'i cizildi. */
  E("aliayyas", "cuzcani", "—", "Tehzîb 4116"),
  E("aliayyas", "ahmedhanbel", "—", "Tehzîb 4116"),
  E("aliayyas", "duhaym", "—", "Tehzîb 4116"),
  E("aliayyas", "zuhli", "—", "Tehzîb 4116"),


  /* Ebû Müshir ed-Dımaşkī (o. 218) -- hocalari.
     Tehzîb 3691. Tercemede 23 kayit var, agda dugumu olan 9'i cizildi. */
  E("ismailayyas", "ebumushir", "—", "Tehzîb 3691"),
  E("bakiyyevelid", "ebumushir", "—", "Tehzîb 3691"),
  E("saidabdulaziz", "ebumushir", "—", "Tehzîb 3691"),
  E("ibnuyeyne", "ebumushir", "—", "Tehzîb 3691"),
  E("isabyunus", "ebumushir", "—", "Tehzîb 3691"),
  E("malik", "ebumushir", "—", "Tehzîb 3691"),
  E("muhammedharbhavlani", "ebumushir", "—", "Tehzîb 3691"),
  E("muaviyesellam", "ebumushir", "—", "Tehzîb 3691"),
  E("hikalziyad", "ebumushir", "—", "Tehzîb 3691"),


  /* Ebû Müshir ed-Dımaşkī (o. 218) -- talebeleri.
     Tehzîb 3691. Tercemede 8 kayit var, agda dugumu olan 4'i cizildi. */
  E("ebumushir", "cuzcani", "—", "Tehzîb 3691"),
  E("ebumushir", "ahmedsalihmisri", "—", "Tehzîb 3691"),
  E("ebumushir", "ahmedhanbel", "—", "Tehzîb 3691"),
  E("ebumushir", "ishakkevsec", "—", "Tehzîb 3691"),


  /* Bişr b. Şuayb b. Ebî Hamza (o. 213) -- hocalari.
     Tehzîb 691. Tercemede 1 kayit var, agda dugumu olan 1'i cizildi. */
  E("suaybebihamza", "bisrsuayb", "—", "Tehzîb 691"),


  /* Bişr b. Şuayb b. Ebî Hamza (o. 213) -- talebeleri.
     Tehzîb 691. Tercemede 7 kayit var, agda dugumu olan 3'i cizildi. */
  E("bisrsuayb", "ahmedhanbel", "—", "Tehzîb 691"),
  E("bisrsuayb", "ishakkevsec", "—", "Tehzîb 691"),
  E("bisrsuayb", "zuhli", "—", "Tehzîb 691"),


  /* Ahmed b. Hâlid el-Vehbî el-Kindî (o. 214) -- hocalari.
     Tehzîb 30. Tercemede 8 kayit var, agda dugumu olan 6'i cizildi. */
  E("israilyunus", "ahmedhalidvehbi", "—", "Tehzîb 30"),
  E("seybannahvi", "ahmedhalidvehbi", "—", "Tehzîb 30"),
  E("mesudi", "ahmedhalidvehbi", "—", "Tehzîb 30"),
  E("macisun", "ahmedhalidvehbi", "—", "Tehzîb 30"),
  E("kaysrebi", "ahmedhalidvehbi", "—", "Tehzîb 30"),
  E("ibnishak", "ahmedhalidvehbi", "—", "Tehzîb 30"),


  /* Eyyûb b. Süleymân b. Bilâl (o. 224) -- talebeleri.
     Tehzîb 614. Tercemede 6 kayit var, agda dugumu olan 2'i cizildi. */
  E("eyyubsuleymanbilal", "ebuhatimrazi", "—", "Tehzîb 614"),
  E("eyyubsuleymanbilal", "zuhli", "—", "Tehzîb 614"),


  /* SIYER EKI, IKINCI TUR -- Buhari baglari.

     Arac Buhari'yi hicbir zaman otomatik eslestirmiyor: dugumun adi
     «محمد بن إسماعيل البخاري», tercemelerdeki kayit ise yalnizca
     «البخاري». Bu yuzden onun kenarlari her seferinde elle yaziliyor.
     Her biri Mizzi'nin ilgili tercemesindeki «روى عنه: البخاري»
     kaydina dayaniyor. */
  E("muhammedsabik", "buhari", "—", "Tehzîb 5230"),
  E("muhammedararah", "buhari", "—", "Tehzîb 5463"),
  E("bedelmuhabber", "buhari", "—", "Tehzîb 647"),
  E("talkgannam", "buhari", "—", "Tehzîb 2991"),
  E("halladyahya", "buhari", "—", "Tehzîb 1741"),
  E("aliayyas", "buhari", "—", "Tehzîb 4116"),
  E("ebumushir", "buhari", "—", "Tehzîb 3691"),
  E("bisrsuayb", "buhari", "—", "Tehzîb 691"),
  E("ahmedhalidvehbi", "buhari", "—", "Tehzîb 30"),
  E("eyyubsuleymanbilal", "buhari", "—", "Tehzîb 614"),
  E("sadakafadl", "buhari", "—", "Tehzîb 2867"),
  E("hassanhassan", "buhari", "—", "Tehzîb 1189"),
  E("abdulazizuveysi", "buhari", "—", "Tehzîb 3457"),
  E("ahmedeskab", "buhari", "—", "Tehzîb 11"),

  /* Sadaka b. el-Fadl el-Mervezî (o. 223) -- hocalari.
     Tehzîb 2867. Tercemede 21 kayit var, agda dugumu olan 15'i cizildi. */
  E("ibnuleyye", "sadakafadl", "—", "Tehzîb 2867"),
  E("haccacmuhammed", "sadakafadl", "—", "Tehzîb 2867"),
  E("hafsgiyas", "sadakafadl", "—", "Tehzîb 2867"),
  E("ibnuyeyne", "sadakafadl", "—", "Tehzîb 2867"),
  E("ibnvehb", "sadakafadl", "—", "Tehzîb 2867"),
  E("ibnmehdi", "sadakafadl", "—", "Tehzîb 2867"),
  E("abdesuleyman", "sadakafadl", "—", "Tehzîb 2867"),
  E("gunder", "sadakafadl", "—", "Tehzîb 2867"),
  E("ebumuaviyedarir", "sadakafadl", "—", "Tehzîb 2867"),
  E("muazmuaz", "sadakafadl", "—", "Tehzîb 2867"),
  E("mutemirsuleyman", "sadakafadl", "—", "Tehzîb 2867"),
  E("veki", "sadakafadl", "—", "Tehzîb 2867"),
  E("velidmuslim", "sadakafadl", "—", "Tehzîb 2867"),
  E("kattan", "sadakafadl", "—", "Tehzîb 2867"),
  E("yezidharun", "sadakafadl", "—", "Tehzîb 2867"),


  /* Sadaka b. el-Fadl el-Mervezî (o. 223) -- talebeleri.
     Tehzîb 2867. Tercemede 10 kayit var, agda dugumu olan 2'i cizildi. */
  E("sadakafadl", "darimi", "—", "Tehzîb 2867"),
  E("sadakafadl", "ebukudame", "—", "Tehzîb 2867"),


  /* Hassân b. Hassân el-Basrî (o. 213) -- hocalari.
     Tehzîb 1189. Tercemede 11 kayit var, agda dugumu olan 5'i cizildi. */
  E("sube", "hassanhassan", "—", "Tehzîb 1189"),
  E("macisun", "hassanhassan", "—", "Tehzîb 1189"),
  E("kaysrebi", "hassanhassan", "—", "Tehzîb 1189"),
  E("hemmamyahya", "hassanhassan", "—", "Tehzîb 1189"),
  E("ebuavane", "hassanhassan", "—", "Tehzîb 1189"),


  /* Hassân b. Hassân el-Basrî (o. 213) -- talebeleri.
     Tehzîb 1189. Tercemede 6 kayit var, agda dugumu olan 2'i cizildi. */
  E("hassanhassan", "ebuzuraraazi", "—", "Tehzîb 1189"),
  E("hassanhassan", "ms22", "—", "Tehzîb 1189"),


  /* Abdülazîz b. Abdillâh el-Üveysî (o. 223) -- hocalari.
     Tehzîb 3457. Tercemede 17 kayit var, agda dugumu olan 7'i cizildi. */
  E("ibrahimsad", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("suleymanbilal", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("macisun", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("darevardi", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("leysbsad", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("malik", "abdulazizuveysi", "—", "Tehzîb 3457"),
  E("nafiomercumahi", "abdulazizuveysi", "—", "Tehzîb 3457"),


  /* Abdülazîz b. Abdillâh el-Üveysî (o. 223) -- talebeleri.
     Tehzîb 3457. Tercemede 13 kayit var, agda dugumu olan 4'i cizildi. */
  E("abdulazizuveysi", "ebuzuraraazi", "—", "Tehzîb 3457"),
  E("abdulazizuveysi", "ebuhatimrazi", "—", "Tehzîb 3457"),
  E("abdulazizuveysi", "zuhli", "—", "Tehzîb 3457"),
  E("abdulazizuveysi", "harunhammal", "—", "Tehzîb 3457"),


  /* Ahmed b. İşkâb el-Hadramî (o. 217) -- hocalari.
     Tehzîb 11. Tercemede 14 kayit var, agda dugumu olan 5'i cizildi. */
  E("serikkadi", "ahmedeskab", "—", "Tehzîb 11"),
  E("abdusselamharb", "ahmedeskab", "—", "Tehzîb 11"),
  E("muhammedbisrabdi", "ahmedeskab", "—", "Tehzîb 11"),
  E("muhammedfudayl", "ahmedeskab", "—", "Tehzîb 11"),
  E("ebubekirayyas", "ahmedeskab", "—", "Tehzîb 11"),


  /* Ahmed b. İşkâb el-Hadramî (o. 217) -- talebeleri.
     Tehzîb 11. Tercemede 10 kayit var, agda dugumu olan 2'i cizildi. */
  E("ahmedeskab", "ebuhatimrazi", "—", "Tehzîb 11"),
  E("ahmedeskab", "ibnmain", "—", "Tehzîb 11"),

];

/* YINELENEN KENARLAR BURADA TEKILLESTIRILIYOR.

   Ayni ikili birden cok tercemede geciyor: Sube'nin talebe listesinde
   Husyem, Husyem'in hoca listesinde Sube. Ikisi de dogru, ama grafikte
   ayni cizgi iki kez ciziliyor ve derece sayimi siseriyordu (olculdu,
   15 kenar). Hangisinin kalacagi bir veri karari degil -- ikisi de ayni
   iliskiyi anlatiyor; dogru olan birini tutup KAYNAKLARI BIRLESTIRMEK,
   boylece hicbir sehadet kaybolmuyor.

   Yon ilk kayittan geliyor. Kenarlarin yonu zaten hoca->talebe olarak
   giriliyor, iki terceme ayni yonu veriyor; ters yonlu bir cift cikarsa
   burada degil VERIDE duzeltilmeli.

   Tekillestirme CIZIM tarafinda degil burada: dugumleri-cikar.cjs ve
   isle.cjs de bu modulu eval edip EDGES'i okuyor, yani arac zinciri de
   ayni tekil listeyi goruyor. */
export const EDGES = (() => {
  const gorulen = new Map();
  for (const e of EDGES_HAM) {
    const onceki = gorulen.get(e.a + "|" + e.b) || gorulen.get(e.b + "|" + e.a);
    if (!onceki) { gorulen.set(e.a + "|" + e.b, { ...e }); continue; }
    if (e.k && onceki.k && !onceki.k.includes(e.k)) onceki.k += " + " + e.k;
    // Rumuz yalnizca bostan doluya gecer; dolu bir rumuzun ustune yazma.
    if ((!onceki.r || onceki.r === "—") && e.r) onceki.r = e.r;
  }
  return [...gorulen.values()];
})();


// En çok hadis rivayet eden yedi sahâbî
// Ali b. el-Medînî, el-İlel: isnâdın üzerinde döndüğü tabakalar
export const MEDAR = {
  ibnsihab: 1, amrdinar: 1, yahyaebikesir: 1, katade: 1, ebuishaksebii: 1, amess: 1,
  malik: 2, ibnishak: 2, ibncureyc: 2, ibnuyeyne: 2, ibnebiaruba: 2, hammadseleme: 2,
  ebuavane: 2, sube: 2, mamer: 2, sevri: 2, evzai: 2, huseym: 2,
  yahyaadem: 3, ibnebizaide: 3, veki: 3, ibnmubarek: 3, kattan: 3, ibnmehdi: 3,
};
/* MEDAR_AD artik burada DEGIL -- metinler ceviri dosyasina tasindi
   (t.agMedar1..3) ve bilesenin icinde TAB_AD gibi useMemo ile
   kuruluyor. Sabit halde kaldigi surece kart Ingilizce ve Arapca
   modda bu satiri Turkce gosteriyordu (Mustafa, 2026-08-30). */

// Kütüb-i Sitte müellifleri
export const MUELLIF = new Set(["buhari", "muslim", "ebudavud", "tirmizi", "nesai", "ibnmace"]);

export const MUKSIRUN = new Set(["ebuhureyre", "ibnomer", "enes", "aise", "ibnabbas", "cabir", "ebusaid"]);


/* Hz. Peygamber → sahâbe. Tehzîb'de sahâbe tercemeleri kural olarak
   «revâ anı'n-nebî ﷺ» kaydıyla başlar. Okuduğum tercemelerden gelen
   bağlar zaten yukarıda, kalanları burada tamamlanıyor — kaynak alanında
   ayrıca işaretlidir. */
NODES.filter((n) => n.tab === 1 && n.id !== "nebi").forEach((n) => {
  const zaten = EDGES.some((e) => e.a === "nebi" && e.b === n.id);
  if (!zaten) EDGES.push(E("nebi", n.id, "—", "sahâbî olduğuna dayanır, terceme teyidi yapılmadı"));
});

/* Belde ataması ölçütü: râvi, en çok talebe yetiştirdiği ve rivayet
   geçmişinde en çok anıldığı beldeye konur. Sonradan yerleştiği yerler
   düğüm notunda belirtilir. Örnek: Mizzî, Zührî için «el-Medenî, sekene'ş-Şâm»
   der; ağda Medine sütununda durur, çünkü talebe halkasının ağırlığı oradadır. */
/* Sutun olarak cizilen beldeler. IKI LISTE VAR ve ikisi de guncellenmeli:
   burasi hangi beldelerin sutun oldugunu, asagidaki COGRAFI ise
   sutunlarin batidan doguya sirasini soyluyor. Yemen 2026-08-29'da
   once yalnizca COGRAFI'ye eklendi ve o beldeye tasinan dort ravi
   (Abdurrezzak, Ma'mer, Hemmam ve Vehb b. Munebbih) sessizce ag'dan
   dustu -- yerleri hesaplanmadigi icin hicbir yerde cizilmediler.
   Asagidaki denetim ayni hatanin bir daha sessiz kalmamasi icin. */
export const BELDELER = ["Medine", "Mekke", "Kûfe", "Basra", "Şam", "Vâsıt", "Mısır", "Humus",
                  "Yemen", "Horasan", "Mâverâünnehir", "Cibâl"];

/* Belde adlarinin dil karsiliklari. translations.ts'te DEGIL, burada:
   bunlar arayuz metni degil VERI -- dugumun `belde` alani bu Turkce
   adlari anahtar olarak kullaniyor ve tablo disinda bir yerde
   gecmiyorlar. Site geneli ceviri dosyasina 12 x 3 anahtar eklemek
   orayi bu sayfanin verisiyle doldururdu.
   Eksik bir dil olursa Turkce ad kullaniliyor. */
export const BELDE_AD = {
  ar: { "Medine": "المدينة", "Mekke": "مكة", "Kûfe": "الكوفة", "Basra": "البصرة",
        "Şam": "الشام", "Vâsıt": "واسط", "Mısır": "مصر", "Humus": "حمص",
        "Yemen": "اليمن", "Horasan": "خراسان", "Mâverâünnehir": "ما وراء النهر",
        "Cibâl": "الجبال" },
  en: { "Medine": "MEDINA", "Mekke": "MECCA", "Kûfe": "KUFA", "Basra": "BASRA",
        "Şam": "SYRIA", "Vâsıt": "WASIT", "Mısır": "EGYPT", "Humus": "HIMS",
        "Yemen": "YEMEN", "Horasan": "KHURASAN", "Mâverâünnehir": "TRANSOXIANA",
        "Cibâl": "JIBAL" },
};

/* Hicri yil eki. Arapca'da rakamlar da Arap-Hint rakamlariyla yazilmiyor
   -- eksen dar ve latin rakamlar her uc dilde de okunuyor. */
export const YIL_EKI = { tr: "h.", ar: "هـ", en: "AH" };

/* ---------- dünya koordinatları ----------
   Dikey eksen: vefat yılı. Yatay eksen: belde sütunları.
   Medine ortada durur, diğer beldeler iki yana dengeli dağıtılır.
   Her sütun çakışmayı önlemek için gerektiği kadar şeride bölünür.   */
export const YIL_MIN = 5, YIL_MAX = 315;
/* Tuvalin ic olculeri (grafik birimi, ekran pikseli DEGIL).

   2026-08-29'da hepsi buyutuldu: noktalarin yaricapi iki katina
   cikarildi (bkz. rOf) ve o boyda noktalar eski araliklara sigmiyor,
   birbirine giriyordu.
     ONEMLI: burada onemli olan mutlak sayilar DEGIL, sayilarin nokta
     yaricapina ORANI. Tuval her zaman ekrana sigacak sekilde
     olceklendigi icin H'yi tek basina buyutmek hicbir sey degistirmez
     -- olcek ayni oranda kuculur, ekranda gorulen ayni kalir. Nokta
     yaricapi 2 kat buyudugu icin dikeyde AYRILMA istendiginde H'nin
     2 kattan FAZLA buyumesi gerekiyordu.
     H         55000 -> 600000  Uc asamada (hepsi 2026-08-29): once
                                2.7 kat (yaricap 2 kat buyurken dikeyde
                                ayrilma icin), sonra sutunlar esitlenip
                                tuval yayvanlasinca bir kat, sonra bir
                                kat daha.
     ASGARI_DY   580 -> 6264    ayni seritteki iki nokta arasi en az
                                mesafe; H ile ayni oranda buyudu,
                                boylece serit SAYISI degismedi.
                                Buyutulmeseydi ayni yil araligi daha
                                cok birime denk gelecegi icin serit
                                sayisi duser, sutunlar daralirdi.
     SERIT_W     620 -> 2480    once yaricapla ayni oranda 2 kat
                                (yatay sikisiklik artmasin diye),
                                2026-08-29'da bir kat daha (sutunlar
                                dar geliyordu). KAVIS_OLCEK bu sayiya
                                bagli oldugu icin kavisler kendiliginden
                                olcekleniyor.
     UST         210 -> 460     Hz. Peygamber dugumu tuvalin ustunde,
                                "UST - ..." konumunda duruyor; yaricapi
                                192'ye cikinca eski payla ust kenardan
                                tasiyordu. */
export const UST = 460, ALT = 160, SOL_PAY = 60;
export const H = 600000;
export const SERIT_W = 2480;
export const ASGARI_DY = 6264;
export const yOf = (yil) => UST + ((yil - YIL_MIN) / (YIL_MAX - YIL_MIN)) * (H - UST - ALT);

export const DERECE = (() => {
  const d = {};
  EDGES.forEach((e) => { d[e.a] = (d[e.a] || 0) + 1; d[e.b] = (d[e.b] || 0) + 1; });
  return d;
})();
/* Nokta yaricapi. 2026-08-29'da IKI KEZ buyutuldu, toplam DORT kat:
   96 -> 384, taban 13 -> 52, katsayi 11.5 -> 46, tavan 86 -> 344.

   Neden iki kez: ilk seferinde yalnizca yaricap iki katina cikarildi
   ama ayni anda H de 2.7 kat buyudu (dikey ayrilma icin) ve tuval
   ekrana sigacak sekilde olceklendigi icin noktalar EKRANDA aslinda
   kuculdu. Ekranda gorulen boy r/H oranina bagli; o oran ancak
   yaricap H'den hizli buyurse artiyor. Ikinci kattan sonra oran
   4/2.7, yani ilk haline gore ekranda ~1.5 kat. */
export const rOf = (id) => {
  if (id === "nebi") return 384;
  const d = DERECE[id] || 0;
  // taban 52 birim, bağ sayısıyla belirgin şekilde büyür
  return Math.min(52 + Math.sqrt(d) * 46, 344);
};

/* Noktanin EKRANDAKI yaricapi (piksel). Grafik birimindeki yaricap
   olcekle carpiliyor, ama bir TABANIN altina inmiyor.

   Taban sart: tuval 150.000 birim yuksekliginde ve tamami ekrana
   sigdirildiginda olcek %0.5 civari; o olcekte taban yaricap 52 birim
   0.24 piksele denk geliyor, yani noktalarin cogu hic cizilmiyordu.
   "Noktalar hala kucuk" sikayetinin sebebi buydu -- yaricapi grafik
   biriminde buyutmek bunu cozmez, cunku olcek de ayni oranda kuculur.
   TABAN SABIT DEGIL, bag sayisiyla birlikte artiyor. Duz bir taban
   (once 3.4 px) en genis gorunumde HER noktayi ayni boya getiriyordu
   ve "cok bag = buyuk nokta" okumasi tam da en cok ise yarayacagi
   yerde kayboluyordu. Simdi en kucuk nokta ~3.4 px, Hz. Peygamber
   ~8.1 px; aradaki fark yaricapin tavana oranindan geliyor. */
export const R_TAVAN = 384;
export const EN_AZ_EKRAN_R = 2.6, EKRAN_R_ARTIS = 5.5;
export const rEkranOf = (id, k) =>
  Math.max(rOf(id) * k, EN_AZ_EKRAN_R + (rOf(id) / R_TAVAN) * EKRAN_R_ARTIS);


export const { POS, SUTUNLAR, W, MEDINE } = (() => {
  // 1) her belde için şerit ataması
  const plan = {};
  BELDELER.forEach((belde) => {
    const grup = NODES.filter((n) => n.belde === belde && n.id !== "nebi")
      .map((n) => ({ n, y: yOf(tahminiYil(n)) }))
      .sort((a, b) => a.y - b.y);
    // İki geçiş. Birincisi kaç şerit gerektiğini bulur (ilk boş şerit yöntemi),
    // ikincisi o kadar şeridi baştan açıp râvileri aralarında dengeli dağıtır.
    // Tek geçişte şeritler ihtiyaç oldukça açıldığı için râviler sola yığılıyordu.
    let gerekli = 0;
    {
      const sonY = [];
      grup.forEach(({ y }) => {
        let s = sonY.findIndex((v) => y - v >= ASGARI_DY);
        if (s === -1) { sonY.push(y); s = sonY.length - 1; }
        else sonY[s] = y;
      });
      gerekli = Math.max(1, sonY.length);
    }

    /* Serit secimi. Onceki surum bos seritler arasinda EN KUCUK
       INDISLIYI seciyordu; raviler olum yilina gore sirayla geldigi
       icin erken olenler sola, gec olenler saga yigiliyor ve tablo
       bastan asagi bir sol-ust/sag-alt kosegeni ciziyordu. Olum yili
       DIKEY eksenin kurali, yatayda bir karsiligi olmamali.

       Denge korunuyor (en az dolu seritler tercih ediliyor) ama
       esitlik ravinin kendi kimliginden turetilen sabit bir sayiyla
       bozuluyor. Sonuc her calistirmada ayni -- rastgele degil,
       yalnizca yil ile ILISKISIZ. */
    const sonY = new Array(gerekli).fill(-Infinity);
    const sayac = new Array(gerekli).fill(0);
    const atama = [];
    grup.forEach(({ n, y }) => {
      const bos = [];
      let enAz = Infinity;
      for (let i = 0; i < sonY.length; i++) {
        if (y - sonY[i] < ASGARI_DY) continue;
        bos.push(i);
        if (sayac[i] < enAz) enAz = sayac[i];
      }
      const adaylar = bos.filter((i) => sayac[i] === enAz);
      let s;
      if (!adaylar.length) { sonY.push(y); sayac.push(0); s = sonY.length - 1; }
      else { s = adaylar[salSayi(n.id) % adaylar.length]; sonY[s] = y; }
      atama.push({ n, y, s, sira: sayac[s]++ });
    });
    plan[belde] = { atama, seritSayisi: Math.max(1, sonY.length) };
  });

  /* 2) Sütun sırası coğrafidır, batıdan doğuya. Medine tuvalın tam
     ortasına, aşağıdaki simetri kaydırmasıyla getirilir.            */
  /* Yemen 2026-08-29'da eklendi. Abdurrezzak b. Hemmam es-San'ani
     Mekke sutununda duruyordu; San'a'da dogup orada ders veren ve orada
     olen biri icin yanlisti (Mustafa fark etti). Ayni sebeple Hemmam ve
     Vehb b. Munebbih ile -- Basra'da dogup San'a'ya yerlesen ve
     talebe halkasini orada kuran -- Ma'mer b. Rasid de tasindi.
     Cografi sirada Mekke ile Medine arasina degil, Mekke'nin
     GUNEYINE, yani Mekke'den sonraya konuldu. */
  const COGRAFI = ["Mısır", "Humus", "Şam", "Mekke", "Yemen", "Medine",
                   "Basra", "Vâsıt", "Kûfe", "Cibâl", "Horasan", "Mâverâünnehir"];
  const sira = COGRAFI.filter((b) => plan[b]);

  /* 3) konumlar. BUTUN SUTUNLAR AYNI GENISLIKTE -- en cok serit
     gerektiren sutun (Medine) kadar. Onceden her sutun kendi serit
     sayisi kadar genisti; Misir, Humus, Sam gibi az ravili beldeler
     incecik seritlere donuyor ve seyreklikleri gorunmuyordu, hepsi
     ayni doluluktaymis gibi duruyordu. Esit genislikte az sayida nokta
     ayni alana yayilinca seyreklik kendiliginden okunuyor.

     Seritler sutunun TAMAMINA yayiliyor (sabit SERIT_W ile yan yana
     degil): iki seritlik bir belde sutunun 1/4 ve 3/4'unu kullaniyor,
     tek seritlik olan tam ortasini. Kucuk kaydirma da serit araligina
     oranli, yoksa genis sutunlarda etkisi kayboluyordu. */
  const enGenisSerit = Math.max(...sira.map((b) => plan[b].seritSayisi));
  const SUTUN_W = enGenisSerit * SERIT_W;
  const pos = {};
  const sutunlar = [];
  let imlec = SOL_PAY;
  sira.forEach((belde) => {
    const { atama, seritSayisi } = plan[belde];
    const genislik = SUTUN_W;
    const aralik = genislik / seritSayisi;
    atama.forEach(({ n, y, s, sira: k }) => {
      const kaydir = [0, 0.035, -0.035, 0.018, -0.018][k % 5] * aralik;
      pos[n.id] = { x: imlec + (s + 0.5) * aralik + kaydir, y };
    });
    sutunlar.push({ belde, x: imlec, genislik, seritSayisi });
    imlec += genislik;
  });

  let medine = sutunlar.find((c) => c.belde === "Medine");
  let W0 = imlec + SOL_PAY;
  // Medine'nin merkezi tuvalin tam ortasına gelsin diye tuvali simetrikleştir
  const merkez = medine.x + medine.genislik / 2;
  const gerekli = Math.max(merkez, W0 - merkez);
  const kaydir = gerekli - merkez;
  if (kaydir > 0) {
    Object.values(pos).forEach((p) => { p.x += kaydir; });
    sutunlar.forEach((c) => { c.x += kaydir; });
  }
  W0 = gerekli * 2;
  medine = sutunlar.find((c) => c.belde === "Medine");
  pos["nebi"] = { x: medine.x + medine.genislik / 2, y: UST - 240 };
  return { POS: pos, SUTUNLAR: sutunlar, W: W0, MEDINE: medine };
})();

/* ---------- kenar kavisleri ----------
   Her kenar için, yolu başka bir râvi noktasının üzerinden geçmeyen
   bir yanal kavis değeri aranır. Bu arama pahalı olduğu için sonuç
   önceden hesaplanıp aşağıya gömüldü; açılışta hesap yapılmaz.
   [yanal kavis, dikey açılım oranı] çifti olarak saklanır.
   Yerleşim sabitleri (SERIT_W, ASGARI_DY, H, YIL_MAX) değişirse bu
   tablo yeniden üretilmelidir.                                       */
if (process.env.NODE_ENV !== "production") veriyiDenetle(NODES, EDGES);

export const KAVIS_OLCEK = SERIT_W / 620;   // tablo SERIT_W=620 iken uretildi
export const KAVIS = {"omer|ali":[187.5,0.3],"mikdad|ali":[187.5,0.3],"fatima|ali":[187.5,0.3],"ubey|ebuhureyre":[187.5,0.3],"usame|ebuhureyre":[187.5,0.3],"basra|ebuhureyre":[187.5,0.3],"omer|ebuhureyre":[187.5,0.3],"fadl|ebuhureyre":[187.5,0.3],"kabahbar|ebuhureyre":[187.5,0.3],"aise|ebuhureyre":[74,0.3],"ali|ahnef":[187.5,0.3],"ali|esvedyezid":[187.5,0.3],"ali|alkame":[187.5,0.3],"ali|ubeydesel":[187.5,0.3],"ali|suveydgafle":[187.5,0.3],"ali|ebuvail":[187.5,0.3],"ali|zirhubeys":[187.5,0.3],"ali|sureyh":[187.5,0.3],"ali|saidmusayyeb":[187.5,0.3],"ali|hasanbasri":[187.5,0.3],"ali|rebihiras":[187.5,0.3],"ali|zeydvehb":[187.5,0.3],"ali|zadan":[187.5,0.3],"ali|ebutufeyl":[187.5,0.3],"ali|harissuveyd":[187.5,0.3],"ali|harisemudarrib":[187.5,0.3],"ali|salimcad":[187.5,0.45],"ali|hayseme":[187.5,0.3],"ali|ibrhunayn":[187.5,0.3],"ali|abdhayr":[187.5,0.3],"ali|harisaver":[187.5,0.3],"ali|asimdamra":[187.5,0.3],"ali|sabi":[187.5,0.3],"ali|ibnebileyla":[187.5,0.3],"ali|urve":[187.5,0.3],"ali|ikrime":[187.5,0.3],"ali|zeynelabidin":[187.5,0.3],"ali|ubeydullaherafi":[187.5,0.15],"ali|umerbali":[187.5,0.3],"ali|abdrahmanharis":[187.5,0.3],"ali|ubeydumeyr":[187.5,0.3],"ali|saidzuhadan":[187.5,0.15],"ali|ibnabbas":[187.5,0.3],"ali|ibnomer":[187.5,0.3],"ali|ibnmesud":[168.3,0.3],"ali|ibnzubeyr":[187.5,0.3],"ali|bera":[187.5,0.3],"ali|zeydarkam":[187.5,0.3],"ali|cabirsemura":[187.5,0.3],"ali|cabir":[187.5,0.3],"ali|suhayb":[187.5,0.3],"ali|sefine":[187.5,0.3],"ali|hasanbali":[187.5,0.3],"ali|huseyn":[187.5,0.3],"ali|amrhurays":[187.5,0.3],"ali|tariksihab":[187.5,0.3],"ali|besrsuhaym":[187.5,0.3],"ali|ibncafer":[187.5,0.3],"ali|enes":[187.5,0.3],"ebuhureyre|enes":[187.5,0.3],"ebuhureyre|cabir":[187.5,0.3],"ebuhureyre|hasanbasri":[187.5,0.45],"ebuhureyre|salimibnomer":[187.5,0.3],"ebuhureyre|hafsasim":[187.5,0.15],"ebuhureyre|humeydavf":[187.5,0.3],"ebuhureyre|esvedhilal":[187.5,0.3],"ebuhureyre|zurareevfa":[187.5,0.3],"ebuhureyre|busrsaid":[187.5,0.3],"ebuhureyre|hilas":[187.5,0.3],"ebuhureyre|besirnehik":[187.5,0.3],"ebuhureyre|ibrhunayn":[375,0.3],"ebuhureyre|hayseme":[187.5,0.3],"ebuhureyre|zeydeslem":[187.5,0.3],"ebuhureyre|salimcad":[187.5,0.3],"ebuhureyre|bece":[187.5,0.3],"ebuhureyre|saidmusayyeb":[187.5,0.3],"ebubekir|enes":[187.5,0.3],"ebubekir|bera":[187.5,0.3],"ebubekir|cabir":[187.5,0.3],"ebubekir|zeydarkam":[187.5,0.3],"ebubekir|zeydsabit":[187.5,0.3],"ebubekir|suveydgafle":[187.5,0.3],"ebubekir|tariksihab":[187.5,0.15],"ebubekir|ibnzubeyr":[187.5,0.3],"ebubekir|ibnabbas":[187.5,0.3],"ebubekir|ibnomer":[187.5,0.3],"ebubekir|ibnmesud":[187.5,0.3],"ebubekir|ali":[187.5,0.3],"ebubekir|omer":[187.5,0.3],"ebubekir|amrhurays":[187.5,0.3],"ebubekir|ebutufeyl":[187.5,0.3],"ebubekir|ebuhureyre":[187.5,0.3],"ebubekir|aise":[187.5,0.3],"ebubekir|saidmusayyeb":[187.5,0.3],"ebubekir|ebusalih":[187.5,0.3],"ebubekir|kayshazim":[187.5,0.3],"ebubekir|abdrahmanebubekir":[187.5,0.3],"ebubekir|abdrahmanavf":[187.5,0.15],"ebubekir|osman":[187.5,0.15],"ebubekir|ukbeamir":[187.5,0.3],"ebubekir|ebumusa":[187.5,0.3],"ebubekir|ebusaid":[187.5,0.3],"ebubekir|huzeyfe":[187.5,0.3],"ebubekir|rifaazuraki":[187.5,0.3],"ebubekir|aizamr":[187.5,0.15],"ebubekir|murreserahil":[187.5,0.3],"ebubekir|abdrahmanyerbu":[187.5,0.15],"ebubekir|abdrahmanabza":[187.5,0.3],"nebi|ali":[187.5,0.3],"nebi|ebuhureyre":[187.5,0.3],"nebi|ebubekir":[187.5,0.3],"nebi|fatima":[187.5,0.3],"nebi|omer":[187.5,0.3],"ubey|omer":[187.5,0.3],"omer|eslem":[187.5,0.3],"omer|esvedyezid":[187.5,0.3],"omer|esaskays":[187.5,0.3],"omer|enes":[187.5,0.3],"omer|bera":[187.5,0.3],"omer|cabirsemura":[187.5,0.3],"omer|cabir":[187.5,0.3],"omer|cerirbecel\u00ee":[187.5,0.3],"omer|huzeyfe":[187.5,0.3],"omer|hasanbasri":[187.5,0.45],"omer|humeydavf":[187.5,0.3],"omer|zeydsabit":[187.5,0.3],"omer|salimcad":[187.5,0.3],"omer|saibyezid":[187.5,0.3],"omer|sadvakkas":[187.5,0.3],"omer|saidmusayyeb":[187.5,0.3],"omer|suveydgafle":[187.5,0.3],"omer|sureyh":[187.5,0.15],"omer|tariksihab":[187.5,0.3],"omer|talha":[187.5,0.3],"omer|abisrebia":[187.5,0.3],"omer|asimomer":[187.5,0.3],"nebi|osman":[187.5,0.3],"omer|osman":[187.5,0.3],"osman|ebanosman":[187.5,0.3],"osman|ahnef":[187.5,0.15],"osman|enes":[187.5,0.3],"osman|busrsaid":[187.5,0.15],"osman|hasanbasri":[187.5,0.3],"osman|hamranaban":[187.5,0.3],"osman|zeydsabit":[187.5,0.3],"osman|zeydhalid":[187.5,0.3],"osman|saibyezid":[187.5,0.3],"osman|saidmusayyeb":[187.5,0.3],"osman|ebuvail":[187.5,0.3],"osman|ebuumame":[187.5,0.3],"osman|tariksihab":[187.5,0.3],"osman|ibncafer":[187.5,0.3],"osman|ibnzubeyr":[187.5,0.3],"osman|ibnabbas":[187.5,0.3],"osman|ibnomer":[187.5,0.3],"osman|abdrahmanharis":[187.5,0.3],"osman|abdrahmanyezidnehai":[187.5,0.3],"osman|alkame":[187.5,0.3],"osman|kayshazim":[187.5,0.3],"osman|malikevs":[187.5,0.3],"osman|ibnhanefiyye":[187.5,0.3],"osman|mervan":[187.5,0.3],"osman|mugirasube":[187.5,0.3],"osman|imranhusayn":[187.5,0.3],"osman|selemeekva":[187.5,0.3],"osman|ataebirebah":[187.5,0.3],"osman|ebuabdrahmansulemi":[187.5,0.3],"ebanosman|ibnsihab":[187.5,0.3],"ibrhunayn|ibnsihab":[187.5,0.3],"ibrahimavf|ibnsihab":[187.5,0.3],"enes|ibnsihab":[187.5,0.3],"sabitkayszuraki|ibnsihab":[187.5,0.3],"cabir|ibnsihab":[187.5,0.3],"hasanhanefiyye|ibnsihab":[187.5,0.3],"hafsasim|ibnsihab":[187.5,0.3],"hamzaibnomer|ibnsihab":[187.5,0.3],"humeydavf|ibnsihab":[187.5,0.3],"haricezeyd|ibnsihab":[187.5,0.3],"rafihadic|ibnsihab":[187.5,0.3],"ibnomer|ibnsihab":[187.5,0.3],"abdullahkab|ibnsihab":[187.5,0.3],"arac|ibnsihab":[187.5,0.45],"ubeydullahutbe|ibnsihab":[187.5,0.15],"ubeydullaherafi|ibnsihab":[187.5,0.3],"urve|ibnsihab":[187.5,0.3],"ataebirebah|ibnsihab":[187.5,0.3],"zeynelabidin|ibnsihab":[187.5,0.3],"alkamevakkas|ibnsihab":[187.5,0.3],"ibnsihab|ibrahimsad":[187.5,0.3],"ibnsihab|usamezeydleysi":[187.5,0.3],"ibnsihab|eyyubsahtiyani":[187.5,0.15],"ibnsihab|haccacertat":[187.5,0.3],"ibnsihab|ibnuyeyne":[187.5,0.3],"ibnsihab|zeydeslem":[187.5,0.3],"ibnsihab|salihkeysan":[187.5,0.3],"ibnsihab|suaybebihamza":[187.5,0.3],"enes|katade":[187.5,0.3],"hasanbasri|katade":[158.7,0.3],"cabirzeyd|katade":[187.5,0.3],"ebulaliye|katade":[187.5,0.3],"bekirmuzeni|katade":[187.5,0.3],"zurareevfa|katade":[187.5,0.3],"salimcad|katade":[187.5,0.3],"saidmusayyeb|katade":[187.5,0.3],"hayseme|katade":[187.5,0.3],"hilas|katade":[187.5,0.3],"humeydavf|katade":[187.5,0.3],"sefine|katade":[187.5,0.3],"katade|eyyubsahtiyani":[187.5,0.3],"katade|haccacertat":[187.5,0.3],"katade|hammadseleme":[187.5,0.3],"katade|ibnebiaruba":[187.5,0.3],"katade|amess":[187.5,0.3],"katade|sube":[187.5,0.3],"katade|evzai":[187.5,0.3],"katade|mamer":[187.5,0.3],"katade|hisamdestuvai":[187.5,0.3],"katade|hemmamyahya":[187.5,0.3],"katade|ebuavane":[187.5,0.3],"katade|cerirhazim":[187.5,0.3],"katade|misersukdam":[187.5,0.3],"katade|leysbsad":[187.5,0.3],"katade|amrharis":[187.5,0.3],"katade|suleymanteymi":[187.5,0.3],"nehai|amess":[187.5,0.45],"ibrahimteymi|amess":[187.5,0.3],"habibebisabit|amess":[187.5,0.3],"enes|amess":[187.5,0.3],"ebuduha|amess":[187.5,0.3],"yahyavessab|amess":[187.5,0.3],"mearrursuveyd|amess":[187.5,0.3],"hakemuteybe|amess":[187.5,0.3],"amess|sevri":[187.5,0.3],"amess|ibnuyeyne":[187.5,0.3],"amess|sube":[187.5,0.3],"amess|ibnmubarek":[187.5,0.3],"amess|hafsgiyas":[187.5,0.3],"amess|cerirabdulhamid":[187.5,0.3],"amess|cerirhazim":[187.5,0.3],"amess|ibnnumeyr":[187.5,0.3],"amess|ibnidris":[187.5,0.3],"amess|alimushir":[187.5,0.3],"amess|suleymanteymi":[187.5,0.3],"amess|hakemuteybe":[187.5,0.3],"cabirzeyd|amrdinar":[187.5,0.3],"cabir|amrdinar":[187.5,0.3],"hasanhanefiyye|amrdinar":[187.5,0.3],"ebusalih|amrdinar":[187.5,0.3],"salimibnomer|amrdinar":[187.5,0.3],"saibyezid|amrdinar":[187.5,0.3],"saidcubeyr|amrdinar":[187.5,0.3],"saidmusayyeb|amrdinar":[187.5,0.3],"suleymanyesar|amrdinar":[187.5,0.3],"tavus|amrdinar":[187.5,0.3],"ibnzubeyr|amrdinar":[187.5,0.3],"ibnabbas|amrdinar":[187.5,0.3],"ibnomer|amrdinar":[187.5,0.3],"ubeydumeyr|amrdinar":[187.5,0.3],"urve|amrdinar":[187.5,0.3],"ataebirebah|amrdinar":[187.5,0.3],"ikrime|amrdinar":[187.5,0.3],"kureyb|amrdinar":[187.5,0.15],"mucahid|amrdinar":[187.5,0.3],"ebucafermuhbakir|amrdinar":[187.5,0.3],"ibnsihab|amrdinar":[187.5,0.3],"vehbmunebbih|amrdinar":[187.5,0.3],"ebutufeyl|amrdinar":[187.5,0.3],"ebuselemeavf|amrdinar":[187.5,0.3],"ebuhureyre|amrdinar":[187.5,0.3],"amrdinar|eyyubsahtiyani":[187.5,0.3],"amrdinar|hammadzeyd":[187.5,0.3],"amrdinar|hammadseleme":[187.5,0.3],"amrdinar|davudattar":[187.5,0.3],"amrdinar|zekeriyyaishak":[187.5,0.3],"amrdinar|sevri":[187.5,0.3],"amrdinar|ibnuyeyne":[187.5,0.3],"amrdinar|sube":[187.5,0.3],"amrdinar|ibncureyc":[187.5,0.15],"amrdinar|katade":[187.5,0.3],"amrdinar|malik":[187.5,0.3],"amrdinar|misersukdam":[187.5,0.45],"amrdinar|huseym":[187.5,0.45],"amrdinar|ebuavane":[187.5,0.45],"amrdinar|varkaomer":[187.5,0.3],"amrdinar|amrharis":[187.5,0.3],"esaskays|ebuishaksebii":[187.5,0.3],"esvedyezid|ebuishaksebii":[187.5,0.3],"enes|ebuishaksebii":[187.5,0.3],"bera|ebuishaksebii":[187.5,0.3],"egarebumuslim|ebuishaksebii":[187.5,0.3],"usame|ebuishaksebii":[187.5,0.3],"amrmeymun|ebuishaksebii":[187.5,0.3],"mesruk|ebuishaksebii":[187.5,0.15],"kayshazim|ebuishaksebii":[187.5,0.3],"mucahid|ebuishaksebii":[187.5,0.45],"ebucafermuhbakir|ebuishaksebii":[187.5,0.15],"musatalha|ebuishaksebii":[187.5,0.3],"nafiibnomer|ebuishaksebii":[187.5,0.3],"numanbesir|ebuishaksebii":[187.5,0.3],"mugirasube|ebuishaksebii":[187.5,0.3],"ebuishaksebii|sevri":[187.5,0.3],"ebuishaksebii|ibnuyeyne":[187.5,0.45],"ebuishaksebii|amess":[187.5,0.3],"ebuishaksebii|sube":[187.5,0.3],"ebuishaksebii|suleymanteymi":[187.5,0.3],"ebuishaksebii|zuhayrmuaviye":[187.5,0.3],"ebuishaksebii|zaidekudame":[187.5,0.15],"ebuishaksebii|ibnebizaide":[187.5,0.3],"ebuishaksebii|ebulahvess":[187.5,0.3],"ebuishaksebii|serikkadi":[187.5,0.3],"ebuishaksebii|hamzazeyyat":[187.5,0.3],"ebuishaksebii|katade":[187.5,0.3],"ibrahimkariz|yahyaebikesir":[187.5,0.3],"ishaktalha|yahyaebikesir":[187.5,0.3],"enes|yahyaebikesir":[187.5,0.3],"bece|yahyaebikesir":[187.5,0.15],"cabir|yahyaebikesir":[187.5,0.3],"hafsasim|yahyaebikesir":[187.5,0.3],"hakemmina|yahyaebikesir":[187.5,0.3],"saibyezid|yahyaebikesir":[187.5,0.3],"suleymanyesar|yahyaebikesir":[187.5,0.3],"abdullahebikatade|yahyaebikesir":[187.5,0.3],"evzai|yahyaebikesir":[187.5,0.3],"ubeydullahmiksem|yahyaebikesir":[187.5,0.3],"urve|yahyaebikesir":[187.5,0.3],"ataebirebah|yahyaebikesir":[187.5,0.3],"ikrime|yahyaebikesir":[187.5,0.3],"muhammedibrahimteymi|yahyaebikesir":[187.5,0.3],"nafiibnomer|yahyaebikesir":[187.5,0.3],"hilalebimeymune|yahyaebikesir":[187.5,0.3],"ebuselemeavf|yahyaebikesir":[187.5,0.3],"ebukilabe|yahyaebikesir":[187.5,0.3],"ebunadra|yahyaebikesir":[187.5,0.3],"ebuumame|yahyaebikesir":[187.5,0.15],"yahyaebikesir|eyyubsahtiyani":[-169.5,0.3],"yahyaebikesir|cerirhazim":[187.5,0.3],"yahyaebikesir|haccacsavvaf":[187.5,0.3],"yahyaebikesir|huseynmuallim":[187.5,0.3],"yahyaebikesir|seybannahvi":[187.5,0.3],"yahyaebikesir|evzai":[187.5,0.3],"yahyaebikesir|ikrimeammar":[187.5,0.3],"yahyaebikesir|alimubarek":[187.5,0.3],"yahyaebikesir|muaviyesellam":[187.5,0.3],"yahyaebikesir|mamer":[187.5,0.3],"yahyaebikesir|hisamhassan":[187.5,0.3],"yahyaebikesir|hisamdestuvai":[187.5,0.3],"yahyaebikesir|hemmamyahya":[187.5,0.3],"yahyaebikesir|yahyasaidensari":[187.5,0.3],"ubey|ibnabbas":[187.5,0.3],"usame|ibnabbas":[187.5,0.3],"bureyde|ibnabbas":[187.5,0.3],"temimdari|ibnabbas":[187.5,0.3],"halidvelid|ibnabbas":[187.5,0.3],"ibnabbas|hasanbasri":[187.5,0.3],"ibnabbas|hakemmina":[187.5,0.3],"ibnabbas|humeydavf":[187.5,0.3],"ibnabbas|ebusalih":[187.5,0.3],"ibnabbas|ebulaliye":[187.5,0.3],"ibnabbas|zurareevfa":[187.5,0.3],"ibnabbas|salimcad":[187.5,0.45],"ibnabbas|saidcubeyr":[187.5,0.3],"ibnabbas|saidmusayyeb":[187.5,0.3],"ibnabbas|saidyesar":[187.5,0.3],"ibnabbas|suleymanyesar":[187.5,0.15],"ibnabbas|sehrhavseb":[187.5,0.3],"ibnabbas|dahhak":[187.5,0.3],"ibnabbas|tavus":[187.5,0.3],"ibnabbas|sabi":[187.5,0.3],"ibnabbas|ebutufeyl":[187.5,0.3],"ibnabbas|ibnebimuleyke":[187.5,0.3],"ibnabbas|ubeydullahebiyezid":[187.5,0.3],"ibnabbas|ubeydullahutbe":[187.5,0.3],"ibnabbas|abdullahmabed":[187.5,0.15],"ibnabbas|ebulminhal":[187.5,0.3],"ibnabbas|hakemarac":[187.5,0.3],"ibnabbas|ebuzabyan":[187.5,0.3],"ibnabbas|ikrime":[187.5,0.3],"ibnabbas|mucahid":[187.5,0.3],"ibnabbas|ataebirebah":[187.5,0.3],"ibnabbas|kureyb":[187.5,0.3],"ibnabbas|ibnsihab":[187.5,0.3],"bilal|ibnomer":[187.5,0.3],"rafihadic|ibnomer":[74,0.3],"zeydsabit|ibnomer":[187.5,0.3],"sadvakkas|ibnomer":[187.5,0.3],"suhayb|ibnomer":[187.5,0.3],"amirrebia|ibnomer":[187.5,0.3],"ibnmesud|ibnomer":[187.5,0.3],"omer|ibnomer":[187.5,0.3],"ebusaid|ibnomer":[121.4,0.3],"hafsa|ibnomer":[187.5,0.3],"aise|ibnomer":[187.5,0.3],"ebulubabe|ibnomer":[187.5,0.3],"ibnomer|eslem":[187.5,0.3],"ibnomer|enessirin":[187.5,0.15],"ibnomer|busrsaid":[187.5,0.3],"ibnomer|sabitbunani":[187.5,0.3],"ibnomer|cebeleshim":[187.5,0.3],"ibnomer|habibebisabit":[187.5,0.3],"ibnomer|hasanbasri":[187.5,0.3],"ibnomer|hafsasim":[187.5,0.3],"ibnomer|hakemmina":[187.5,0.3],"ibnomer|hamzaibnomerogul":[187.5,0.3],"ibnomer|humeydavf":[187.5,0.3],"ibnomer|ebusalih":[187.5,0.3],"ibnomer|zadan":[187.5,0.6],"ibnomer|zeydeslem":[187.5,0.3],"ibnomer|salimcad":[187.5,0.15],"ibnomer|salimibnomer":[187.5,0.3],"ibnomer|sadubeyde":[187.5,0.3],"ibnomer|saidcubeyr":[187.5,0.3],"ibnomer|saidmusayyeb":[187.5,0.3],"ibnomer|saidyesar":[187.5,0.3],"ibnomer|suleymanyesar":[187.5,0.3],"ibnomer|safvanmuhriz":[187.5,0.3],"ibnomer|tavus":[187.5,0.3],"ibnomer|abdullahdinar":[187.5,0.3],"ibnomer|nafiibnomer":[187.5,0.3],"ibnomer|ataebirebah":[187.5,0.3],"enes|sumameenes":[187.5,0.3],"enes|sabitbunani":[187.5,0.3],"enes|hasanbasri":[187.5,0.3],"enes|bekirmuzeni":[187.5,0.3],"enes|humeydtavil":[187.5,0.3],"enes|hafsubeydullahenes":[187.5,0.3],"enes|cadebuosman":[187.5,0.3],"enes|enessirin":[187.5,0.3],"enes|rebiaebiabdrahman":[187.5,0.3],"enes|ebulaliye":[88.6,0.3],"enes|habibebisabit":[187.5,0.3],"enes|bekirahnes":[187.5,0.3],"enes|zubeyradi":[187.5,0.3],"enes|beyanbisr":[187.5,0.15],"enes|bisryesar":[187.5,0.3],"enes|salimcad":[187.5,0.3],"enes|zeydeslem":[187.5,0.3],"enes|ibnomer":[187.5,0.3],"cabir|ebuzubeyrmekki":[187.5,0.3],"cabir|ibnmunkedir":[187.5,0.3],"cabir|vehbkeysan":[187.5,0.3],"cabir|ebucafermuhbakir":[187.5,0.3],"cabir|muhammedabbadcafer":[187.5,0.3],"cabir|muhammedsevban":[187.5,0.3],"cabir|mahmudlebid":[187.5,0.3],"cabir|ebunadra":[187.5,0.3],"cabir|ebuselemeavf":[187.5,0.3],"cabir|yezidsuheybfakir":[187.5,0.15],"cabir|vehbmunebbih":[187.5,0.3],"cabir|ataebirebah":[187.5,0.3],"cabir|saidcubeyr":[187.5,0.3],"ebusaid|kasimmuhaymire":[187.5,0.3],"ebusaid|katade":[187.5,0.3],"ebusaid|kazaayahya":[187.5,0.3],"ebusaid|mucahid":[187.5,0.3],"ebusaid|ibnsirin":[187.5,0.3],"ebusaid|muhammedsevban":[187.5,0.3],"ebusaid|ebucafermuhbakir":[187.5,0.3],"ebusaid|mahmudlebid":[187.5,0.3],"ebusaid|mabedsirin":[187.5,0.3],"ebusaid|nafiibnomer":[187.5,0.3],"ebusaid|numanebiayyas":[187.5,0.3],"ebusaid|yahyaumare":[187.5,0.3],"ebusaid|ebuumamesehl":[187.5,0.3],"ebusaid|ebusaidmakburi":[187.5,0.3],"ebusaid|ebuselemeavf":[187.5,0.3],"ebusaid|ebusalih":[187.5,0.3],"ebusaid|ebussiddiknaci":[187.5,0.3],"ebusaid|ebulaliye":[187.5,0.15],"ebusaid|ebuidrishavlani":[187.5,0.3],"ebusaid|ebunadra":[187.5,0.3],"ebusaid|muhammedibrahimteymi":[187.5,0.3],"aise|nehai":[187.5,0.3],"aise|ibrahimteymi":[187.5,0.3],"aise|esvedyezid":[187.5,0.3],"aise|hasanbasri":[187.5,0.3],"aise|hamzaibnomerogul":[187.5,0.3],"aise|hilas":[187.5,0.3],"aise|hayseme":[187.5,0.3],"aise|ebusalih":[187.5,0.3],"aise|zekvanmevlaaise":[187.5,0.3],"aise|zadan":[187.5,0.3],"aise|zurareevfa":[187.5,0.3],"aise|zirhubeys":[187.5,0.3],"aise|zeydeslem":[187.5,0.3],"aise|zeydhalid":[172.5,0.3],"aise|salimcad":[187.5,0.3],"aise|salimibnomer":[187.5,0.3],"aise|saibyezid":[187.5,0.3],"aise|sadhisam":[187.5,0.3],"aise|saidcubeyr":[187.5,0.3],"aise|ebusaidmakburi":[187.5,0.3],"aise|saidmusayyeb":[187.5,0.3],"aise|suleymanyesar":[187.5,0.3],"aise|sureyhhani":[187.5,0.3],"aise|ebuvail":[187.5,0.3],"aise|sehrhavseb":[187.5,0.3],"aise|tavus":[187.5,0.3],"aise|abisrebia":[187.5,0.15],"aise|sabi":[187.5,0.3],"aise|abbadabdullahzubeyr":[187.5,0.15],"aise|ibnzubeyr":[187.5,0.3],"aise|abdullahsedddad":[187.5,0.3],"aise|abdullahsakik":[187.5,0.15],"aise|ibnabbas":[187.5,0.3],"aise|ibnebimuleyke":[187.5,0.3],"aise|amrabdrahmanzurara":[187.5,0.15],"aise|kasimmuhammed":[187.5,0.3],"ishaktalha|malik":[187.5,0.3],"eyyubsahtiyani|malik":[187.5,0.3],"caferisadik|malik":[187.5,0.3],"humeyskaysarac|malik":[187.5,0.3],"humeydtavil|malik":[187.5,0.3],"hubeybabdrahman|malik":[187.5,0.3],"davudhusayn|malik":[187.5,0.3],"rebiaebiabdrahman|malik":[187.5,0.3],"ziyadsad|malik":[187.5,0.3],"zeydeslem|malik":[187.5,0.3],"salimebinadr|malik":[187.5,0.3],"nafiibnomer|malik":[187.5,0.3],"yahyasaidensari|malik":[187.5,0.3],"yezidrouman|malik":[187.5,0.3],"yezidkusayt|malik":[187.5,0.3],"yezidhad|malik":[187.5,0.3],"ataihorasani|malik":[187.5,0.3],"abdulmecidsuheyl|malik":[187.5,0.3],"ibnsihab|malik":[187.5,0.3],"ibnmunkedir|malik":[187.5,0.3],"ebuzubeyrmekki|malik":[187.5,0.3],"abdullahdinar|malik":[187.5,0.3],"malik|ibnuyeyne":[187.5,0.3],"malik|sube":[187.5,0.3],"malik|sevri":[187.5,0.3],"malik|ibnmubarek":[187.5,0.3],"malik|ibnidris":[187.5,0.3],"malik|ibnvehb":[187.5,0.3],"malik|kanebi":[187.5,0.3],"malik|ibnkasimmisri":[187.5,0.3],"malik|ibnmehdi":[187.5,0.3],"malik|safii":[187.5,0.3],"malik|kuteybesaid":[187.5,0.3],"malik|ibnebiuveys":[187.5,0.3],"malik|ibnuleyye":[187.5,0.3],"malik|velidmuslim":[187.5,0.3],"malik|ebunuaymfadl":[187.5,0.3],"malik|ebuasimnebil":[187.5,0.15],"malik|veki":[187.5,0.3],"malik|kattan":[187.5,0.3],"malik|ibnebizaide":[187.5,0.3],"malik|leysbsad":[187.5,0.3],"malik|evzai":[187.5,0.3],"malik|ibncureyc":[187.5,0.3],"ismailebihalid|sube":[187.5,0.3],"enessirin|sube":[187.5,0.3],"eyyubsahtiyani|sube":[187.5,0.3],"sabitbunani|sube":[187.5,0.3],"cebeleshim|sube":[187.5,0.3],"cameseddad|sube":[187.5,0.15],"caferisadik|sube":[187.5,0.6],"habibebisabit|sube":[187.5,0.3],"hakemuteybe|sube":[187.5,0.3],"hammadebisuleyman|sube":[187.5,0.3],"huseynmuallim|sube":[187.5,0.3],"husaynabdrahman|sube":[187.5,0.3],"humeydtavil|sube":[187.5,0.3],"halidhazza|sube":[187.5,0.3],"hubeybabdrahman|sube":[187.5,0.3],"davudebihind|sube":[187.5,0.3],"rebiaebiabdrahman|sube":[187.5,0.3],"zubeydyami|sube":[187.5,0.3],"zekeriyyaebizaide|sube":[187.5,0.3],"sadibrahim|sube":[187.5,0.3],"ibnsihab|sube":[187.5,0.3],"ibnishak|sube":[187.5,0.3],"sube|gunder":[187.5,0.3],"sube|kattan":[187.5,0.3],"sube|ibnmehdi":[187.5,0.3],"sube|veki":[187.5,0.3],"sube|ibnmubarek":[187.5,0.45],"sube|ibnidris":[187.5,0.15],"sube|ibnebizaide":[187.5,0.15],"sube|yezidharun":[187.5,0.3],"sube|yezidzurey":[187.5,0.15],"sube|nadrsumeyl":[187.5,0.3],"sube|ebudavudtayalisi":[187.5,0.3],"sube|muazmuaz":[187.5,0.3],"sube|affanmuslim":[187.5,0.3],"sube|alicad":[187.5,0.3],"sube|abdussamed":[187.5,0.3],"sube|isabyunus":[187.5,0.3],"sube|huseym":[187.5,0.3],"sube|ebunuaymfadl":[187.5,0.3],"sube|ebuasimnebil":[187.5,0.3],"sube|kanebi":[187.5,0.3],"sube|ibnuleyye":[187.5,0.3],"sube|varkaomer":[187.5,0.3],"ibrahimukbe|sevri":[187.5,0.3],"ismailumeyye|sevri":[187.5,0.3],"ismailebihalid|sevri":[187.5,0.45],"suddi|sevri":[187.5,0.3],"esvedkays|sevri":[187.5,0.3],"eyyubsahtiyani|sevri":[187.5,0.3],"sevryezid|sevri":[187.5,0.3],"cabircufi|sevri":[187.5,0.3],"cameseddad|sevri":[187.5,0.3],"cebeleshim|sevri":[187.5,0.3],"caferisadik|sevri":[187.5,0.3],"habibebisabit|sevri":[187.5,0.3],"hasanubeydullah|sevri":[187.5,0.3],"hasanamrfukaymi|sevri":[187.5,0.3],"husaynabdrahman|sevri":[187.5,0.3],"hammadebisuleyman|sevri":[187.5,0.3],"ebuhasin|sevri":[187.5,0.3],"katade|sevri":[187.5,0.3],"ibnsihab|sevri":[187.5,0.3],"sevri|ishakyusufezrak":[187.5,0.3],"sevri|ibnuleyye":[187.5,0.15],"sevri|cerirabdulhamid":[187.5,0.3],"sevri|caferavn":[187.5,0.3],"sevri|hafsgiyas":[187.5,0.3],"sevri|ebuusamehammad":[187.5,0.3],"sevri|halidharis":[187.5,0.3],"sevri|ruhubade":[187.5,0.15],"sevri|zaidekudame":[74,0.3],"sevri|zuhayrmuaviye":[187.5,0.3],"sevri|ibnuyeyne":[187.5,0.3],"sevri|suleymanbilal":[187.5,0.3],"sevri|ebudavudtayalisi":[187.5,0.3],"sevri|ebulahvess":[187.5,0.3],"sevri|ebuasimnebil":[187.5,0.3],"sevri|damrarebia":[187.5,0.3],"sevri|bisrsari":[187.5,0.3],"sevri|abdurrezzak":[187.5,0.3],"sevri|veki":[187.5,0.3],"sevri|ibnmubarek":[187.5,0.3],"sevri|ibnmehdi":[187.5,0.3],"sevri|kattan":[187.5,0.3],"sevri|malik":[187.5,0.3],"sevri|yahyaadem":[187.5,0.3],"ibnmunkedir|ibnuyeyne":[187.5,0.3],"hisamurve|ibnuyeyne":[187.5,0.3],"yahyasaidensari|ibnuyeyne":[187.5,0.3],"mansurmutemir|ibnuyeyne":[187.5,0.3],"mansursafiyye|ibnuyeyne":[187.5,0.3],"mamer|ibnuyeyne":[187.5,0.3],"misersukdam|ibnuyeyne":[187.5,0.3],"musaukbe|ibnuyeyne":[187.5,0.3],"muhammedacilan|ibnuyeyne":[187.5,0.3],"muhammedamralkame|ibnuyeyne":[187.5,0.3],"muhammedsuka|ibnuyeyne":[187.5,0.3],"mutarriftarif|ibnuyeyne":[187.5,0.3],"ismailebiislamsibani|ibnuyeyne":[187.5,0.3],"velidkesir|ibnuyeyne":[187.5,0.6],"yezidhusayfe|ibnuyeyne":[187.5,0.3],"yezidhad|ibnuyeyne":[187.5,0.3],"hisamhassan|ibnuyeyne":[187.5,0.3],"ebuzubeyrmekki|ibnuyeyne":[187.5,0.3],"ataebirebah|ibnuyeyne":[187.5,0.3],"ibnuyeyne|ahmedhanbel":[187.5,0.3],"ibnuyeyne|ibnrahuye":[187.5,0.3],"ibnuyeyne|ahmedsalihmisri":[187.5,0.3],"ibnuyeyne|ahmedmeni":[187.5,0.3],"ibnuyeyne|ibrahimfezari":[187.5,0.3],"ibnuyeyne|safii":[187.5,0.3],"ibnuyeyne|kattan":[187.5,0.3],"ibnuyeyne|ibnmehdi":[-2250,0.3],"ibnuyeyne|kuteybesaid":[187.5,0.3],"abdullahtavus|ibncureyc":[187.5,0.3],"ibnebimuleyke|ibncureyc":[187.5,0.3],"ibnhuseymkhaysem|ibncureyc":[187.5,0.3],"abdulhamidcubeyr|ibncureyc":[187.5,0.3],"abdulkerimcezeri|ibncureyc":[187.5,0.3],"ataebirebah|ibncureyc":[187.5,0.3],"ataihorasani|ibncureyc":[187.5,0.3],"ikrimehalid|ibncureyc":[187.5,0.3],"ikrime|ibncureyc":[187.5,0.3],"amrsuayb|ibncureyc":[187.5,0.3],"kasimebibezze|ibncureyc":[187.5,0.3],"alaabdrahman|ibncureyc":[187.5,0.3],"mucahid|ibncureyc":[187.5,0.3],"muhammedabbadcafer|ibncureyc":[187.5,0.3],"yahyasaidensari|ibncureyc":[187.5,0.3],"ubeydullahomeri|ibncureyc":[187.5,0.3],"ubeydullahebiyezid|ibncureyc":[187.5,0.3],"ibnsihab|ibncureyc":[187.5,0.3],"hisamurve|ibncureyc":[187.5,0.3],"nafiibnomer|ibncureyc":[187.5,0.3],"ibncureyc|haccacmuhammed":[187.5,0.3],"ibncureyc|ibnuleyye":[187.5,0.3],"ibncureyc|ismailayyas":[187.5,0.3],"ibncureyc|enesiyaz":[187.5,0.3],"ibncureyc|sevryezid":[174.1,0.3],"ibncureyc|caferavn":[187.5,0.3],"ibncureyc|hafsgiyas":[187.5,0.3],"ibncureyc|ebuusamehammad":[187.5,0.3],"ibncureyc|hammadzeyd":[187.5,0.3],"ibncureyc|hammadseleme":[187.5,0.3],"ibncureyc|halidharis":[187.5,0.15],"ibncureyc|ruhubade":[187.5,0.3],"ibncureyc|davudattar":[187.5,0.3],"ibncureyc|sevri":[187.5,0.3],"ibncureyc|ibnuyeyne":[187.5,0.15],"ibncureyc|abdurrezzak":[187.5,0.3],"ibnsihab|mamer":[187.5,0.3],"ibnmunkedir|mamer":[187.5,0.15],"hisamurve|mamer":[187.5,0.15],"hemmammunebbih|mamer":[187.5,0.3],"matarverrak|mamer":[187.5,0.3],"mansurmutemir|mamer":[187.5,0.3],"ebuishaksebii|mamer":[187.5,0.3],"amrdinar|mamer":[187.5,0.3],"eyyubsahtiyani|mamer":[187.5,0.3],"mamer|abdurrezzak":[187.5,0.3],"mamer|hisamyusufsanani":[187.5,0.15],"mamer|ibnmubarek":[187.5,0.3],"mamer|ibnuleyye":[187.5,0.3],"mamer|sevri":[187.5,0.3],"mamer|mutemirsuleyman":[187.5,0.3],"mamer|abdulalaabdulala":[187.5,0.3],"mamer|isabyunus":[187.5,0.3],"mamer|yezidzurey":[187.5,0.3],"mamer|gunder":[187.5,0.3],"mamer|hammadzeyd":[187.5,0.3],"mamer|vuheybhalid":[187.5,0.3],"mamer|ebansattar":[187.5,0.3],"mamer|mervanfezari":[187.5,0.3],"mamer|vakidi":[187.5,0.3],"mamer|ibncureyc":[187.5,0.3],"mamer|ibnebiaruba":[187.5,0.3],"mamer|sube":[187.5,0.3],"mamer|hisamdestuvai":[74,0.3],"mamer|davudattar":[187.5,0.15],"ishaktalha|evzai":[187.5,0.3],"hassanatiyye|evzai":[187.5,0.3],"rebiaebiabdrahman|evzai":[187.5,0.3],"rebiayezid|evzai":[187.5,0.3],"suleymanhabib|evzai":[187.5,0.3],"amess|evzai":[187.5,0.3],"suleymanmusadimaski|evzai":[187.5,0.3],"saddadebuammar|evzai":[187.5,0.3],"hakemuteybe|evzai":[187.5,0.3],"abdelubabe|evzai":[187.5,0.6],"ataebirebah|evzai":[187.5,0.3],"ataihorasani|evzai":[187.5,0.3],"ikrimehalid|evzai":[187.5,0.3],"amrsuayb|evzai":[187.5,0.3],"umeyrhani|evzai":[187.5,0.3],"kasimmuhaymire|evzai":[187.5,0.3],"kurrahayvil|evzai":[187.5,0.3],"muhammedibrahimteymi|evzai":[187.5,0.3],"ibnsirin|evzai":[187.5,0.3],"muhammedabbadcafer|evzai":[187.5,0.3],"ebucafermuhbakir|evzai":[187.5,0.45],"ibnsihab|evzai":[187.5,0.3],"ibnmunkedir|evzai":[187.5,0.3],"muhammedvelidzubeydi|evzai":[133.2,0.3],"mutallibhantab|evzai":[187.5,0.3],"mekhul|evzai":[187.5,0.3],"nafiibnomer|evzai":[187.5,0.3],"yahyasaidensari|evzai":[187.5,0.3],"meymunmihran|evzai":[187.5,0.3],"ibncureyc|evzai":[187.5,0.3],"evzai|ibrahimfezari":[187.5,0.3],"evzai|ismailayyas":[187.5,0.3],"evzai|enesiyaz":[187.5,0.3],"evzai|bakiyyevelid":[187.5,0.3],"evzai|ibnmubarek":[187.5,0.3],"evzai|ibnnumeyr":[187.5,0.3],"evzai|abdurrezzak":[187.5,0.3],"evzai|ebulmugirehavlani":[187.5,0.3],"evzai|ubeydullahmusa":[187.5,0.3],"evzai|isabyunus":[187.5,0.3],"evzai|suaybishakdimaski":[187.5,0.3],"evzai|muhammedharbhavlani":[187.5,0.3],"evzai|muhammedsuaybsabur":[187.5,0.3],"evzai|firyabi":[187.5,0.3],"evzai|hikalziyad":[187.5,0.3],"evzai|veki":[187.5,0.3],"evzai|mafairan":[187.5,0.3],"evzai|amrebiselemetennisi":[187.5,0.3],"evzai|bisrbekirtennisi":[187.5,0.3],"evzai|damrarebia":[187.5,0.3],"evzai|saidabdulaziz":[187.5,0.3],"evzai|sevri":[187.5,0.3],"evzai|sube":[187.5,0.3],"evzai|malik":[187.5,0.3],"evzai|ebuasimnebil":[187.5,0.15],"eyyubsahtiyani|ibnebiaruba":[187.5,0.3],"hasanbasri|ibnebiaruba":[187.5,0.3],"amess|ibnebiaruba":[187.5,0.3],"asimbehdele|ibnebiaruba":[187.5,0.15],"alizeydcudan|ibnebiaruba":[187.5,0.15],"amiralhavl|ibnebiaruba":[187.5,0.3],"ikrimeammar|ibnebiaruba":[88.6,0.3],"ibnebiaruba|abdulvarissaid":[187.5,0.3],"ibnebiaruba|abdulvehhabata":[187.5,0.3],"ibnebiaruba|abdesuleyman":[187.5,0.3],"ibnebiaruba|alimushir":[187.5,0.3],"ibnebiaruba|isabyunus":[187.5,0.3],"ibnebiaruba|muhammedbisrabdi":[187.5,0.15],"ibnebiaruba|gunder":[187.5,0.3],"ibnebiaruba|muhammedebiadi":[187.5,0.3],"ibnebiaruba|muazmuaz":[187.5,0.3],"ibnebiaruba|nadrsumeyl":[187.5,0.3],"ibnebiaruba|kattan":[187.5,0.3],"ibnebiaruba|yezidzurey":[187.5,0.3],"ibnebiaruba|yezidharun":[187.5,0.3],"ibnebiaruba|ruhubade":[187.5,0.3],"ibnebiaruba|halidharis":[187.5,0.3],"ishaktalha|hammadseleme":[187.5,0.3],"enessirin|hammadseleme":[187.5,0.3],"eyyubsahtiyani|hammadseleme":[187.5,0.3],"sabitbunani|hammadseleme":[187.5,0.3],"sumameenes|hammadseleme":[187.5,0.3],"haccacertat|hammadseleme":[187.5,0.3],"hammadebisuleyman|hammadseleme":[187.5,0.3],"humeydtavil|hammadseleme":[187.5,0.3],"halidhazza|hammadseleme":[187.5,0.3],"davudebihind|hammadseleme":[187.5,0.3],"rebiaebiabdrahman|hammadseleme":[187.5,0.3],"zeydeslem|hammadseleme":[187.5,0.45],"sadibrahim|hammadseleme":[187.5,0.3],"cureyri|hammadseleme":[187.5,0.3],"selemekuheyl|hammadseleme":[187.5,0.3],"suleymanteymi|hammadseleme":[187.5,0.3],"simakharb|hammadseleme":[187.5,0.3],"suheylebisalih|hammadseleme":[187.5,0.3],"asimbehdele|hammadseleme":[187.5,0.3],"amiralhavl|hammadseleme":[187.5,0.3],"ibnebimuleyke|hammadseleme":[187.5,0.3],"ibnhuseymkhaysem|hammadseleme":[187.5,0.45],"abdullahavn|hammadseleme":[187.5,0.3],"ubeydullahomeri2|hammadseleme":[187.5,0.3],"ebuimrancevni|hammadseleme":[187.5,0.3],"abdulmelikumeyr|hammadseleme":[187.5,0.45],"ubeydullahomeri|hammadseleme":[187.5,0.3],"ataisaib|hammadseleme":[187.5,0.3],"ataihorasani|hammadseleme":[187.5,0.3],"ikrimehalid|hammadseleme":[187.5,0.3],"alizeydcudan|hammadseleme":[187.5,0.15],"ammarebiammar|hammadseleme":[187.5,0.3],"amryahyamazini|hammadseleme":[187.5,0.3],"ibnishak|hammadseleme":[187.5,0.3],"hammadseleme|ibnmehdi":[187.5,0.3],"hammadseleme|abdussamed":[187.5,0.3],"hammadseleme|affanmuslim":[187.5,0.3],"hammadseleme|ebunuaymfadl":[187.5,0.3],"hammadseleme|hebbanhilal":[187.5,0.3],"hammadseleme|musaismailtebuzeki":[187.5,0.15],"hammadseleme|hisamtayalisi":[187.5,0.3],"hammadseleme|muslimibrahim":[187.5,0.3],"hammadseleme|amrmerzuk":[187.5,0.3],"hammadseleme|ebunasrtemmar":[187.5,0.3],"hammadseleme|nadrsumeyl":[187.5,0.3],"hammadseleme|muazmuaz":[187.5,0.3],"hammadseleme|malik":[187.5,0.3],"hammadseleme|ibnuleyye":[187.5,0.3],"caferebivahsiyye|ebuavane":[-187.5,0.3],"husaynabdrahman|ebuavane":[187.5,0.3],"hakemuteybe|ebuavane":[187.5,0.3],"hammadebisuleyman|ebuavane":[187.5,0.3],"davudebihind|ebuavane":[187.5,0.3],"sadibrahim|ebuavane":[187.5,0.3],"saidmesrukhsevri|ebuavane":[187.5,0.3],"amess|ebuavane":[187.5,0.3],"simakharb|ebuavane":[187.5,0.3],"suheylebisalih|ebuavane":[187.5,0.3],"asimbehdele|ebuavane":[187.5,0.3],"asimahvel|ebuavane":[187.5,0.3],"abdullahavn|ebuavane":[187.5,0.3],"abdulazizsuheyb|ebuavane":[187.5,0.3],"abdulmelikebisuleyman|ebuavane":[187.5,0.3],"abdulmelikumeyr|ebuavane":[187.5,0.3],"ataisaib|ebuavane":[187.5,0.3],"firasyahya|ebuavane":[187.5,0.3],"ibnishak|ebuavane":[187.5,0.3],"ibnmunkedir|ebuavane":[187.5,0.3],"mutarriftarif|ebuavane":[187.5,0.3],"mugirmiksem|ebuavane":[187.5,0.3],"mansurzazan|ebuavane":[187.5,0.3],"mansurmutemir|ebuavane":[187.5,0.3],"ismailebiislamsibani|ebuavane":[187.5,0.3],"ebuzubeyrmekki|ebuavane":[187.5,0.3],"ebuhasin|ebuavane":[187.5,0.3],"hilalvezzan|ebuavane":[187.5,0.45],"yalaata|ebuavane":[187.5,0.3],"ebuavane|ibnuleyye":[187.5,0.3],"ebuavane|ibnmehdi":[187.5,0.3],"ebuavane|said_mansur":[187.5,0.3],"ebuavane|kavariri":[187.5,0.3],"ebuavane|seybanferruh":[187.5,0.3],"ebuavane|haccacminhal":[187.5,0.3],"ebuavane|halefhisam":[187.5,0.3],"ebuavane|affanmuslim":[187.5,0.3],"ebuavane|musaismailtebuzeki":[187.5,0.3],"ebuavane|hisamtayalisi":[187.5,0.3],"eyyubsahtiyani|huseym":[187.5,0.3],"caferebivahsiyye|huseym":[187.5,0.45],"haccacertat|huseym":[187.5,0.15],"haccacsavvaf|huseym":[187.5,0.3],"husaynabdrahman|huseym":[187.5,0.3],"humeydtavil|huseym":[187.5,0.3],"halidhazza|huseym":[187.5,0.15],"davudebihind|huseym":[187.5,0.3],"sufyanhusayn|huseym":[142,0.3],"amess|huseym":[187.5,0.3],"suleymanteymi|huseym":[187.5,0.3],"siyarebilhakem|huseym":[187.5,0.3],"salihhayy|huseym":[187.5,0.3],"asimahvel|huseym":[187.5,0.3],"amiralhavl|huseym":[187.5,0.3],"abdullahsubrume|huseym":[187.5,0.3],"ebusalih|huseym":[187.5,0.3],"abdullahavn|huseym":[187.5,0.3],"abdulhamidcafer|huseym":[187.5,0.3],"abdulazizsuheyb|huseym":[187.5,0.3],"abdulmelikebisuleyman|huseym":[187.5,0.3],"abdulmelikumeyr|huseym":[187.5,0.15],"ubeydullahomeri|huseym":[187.5,0.3],"ataisaib|huseym":[187.5,0.3],"alizeydcudan|huseym":[187.5,0.3],"avvamhavseb|huseym":[187.5,0.3],"avfarabi|huseym":[187.5,0.3],"kasimmihran|huseym":[187.5,0.3],"leysbsad|huseym":[187.5,0.3],"mucalidsaid|huseym":[187.5,0.3],"ibnishak|huseym":[187.5,0.3],"ibnsihab|huseym":[187.5,0.15],"mutarriftarif|huseym":[187.5,0.3],"mugirmiksem|huseym":[187.5,0.3],"mansurzazan|huseym":[187.5,0.3],"hisamhassan|huseym":[187.5,0.6],"hisamyusufsanani|huseym":[187.5,0.3],"yahyasaidensari|huseym":[187.5,0.3],"huseym|ahmedhanbel":[187.5,0.3],"huseym|ahmedmeni":[187.5,0.3],"huseym|ibnebiseybe":[187.5,0.3],"huseym|osmanebiseybe":[187.5,0.3],"huseym|zuheyrharb":[187.5,0.3],"huseym|alimedini":[187.5,0.3],"huseym|alihucr":[187.5,0.3],"huseym|amrnakid":[187.5,0.3],"huseym|ahmeddevraki":[187.5,0.15],"huseym|saidsuleymansadeviye":[187.5,0.3],"huseym|muhammedisataba":[187.5,0.3],"huseym|said_mansur":[187.5,0.3],"huseym|kuteybesaid":[187.5,0.3],"huseym|gunder":[187.5,0.3],"huseym|ibnmubarek":[187.5,0.3],"huseym|ibnmehdi":[187.5,0.3],"huseym|sevri":[187.5,0.3],"huseym|sube":[187.5,0.3],"huseym|malik":[187.5,0.3],"huseym|ibnuyeyne":[187.5,0.3],"ebanosman|ibnishak":[187.5,0.3],"ataebirebah|ibnishak":[187.5,0.3],"ebuselemeavf|ibnishak":[187.5,0.3],"kasimmuhammed|ibnishak":[187.5,0.3],"mekhul|ibnishak":[187.5,0.15],"abdrahmanesved|ibnishak":[187.5,0.3],"ibnsihab|ibnishak":[187.5,0.3],"yezidebihabib|ibnishak":[187.5,0.3],"enes|ibnishak":[187.5,0.3],"ibnishak|yezidharun":[187.5,0.3],"ibnishak|yezidzurey":[187.5,0.3],"ibnishak|yalaubeyd":[187.5,0.3],"ibnishak|yunusbukeyr":[187.5,0.3],"ibnishak|ibnuleyye":[187.5,0.3],"zekeriyyaishak|veki":[187.5,0.3],"zekeriyyaebizaide|veki":[187.5,0.3],"ibnuyeyne|veki":[187.5,0.3],"amess|veki":[187.5,0.3],"serikkadi|veki":[187.5,0.3],"abdullahavn|veki":[187.5,0.15],"abdulhamidcafer|veki":[187.5,0.3],"mesudi|veki":[187.5,0.3],"ibncureyc|veki":[187.5,0.15],"ubeydullahomeri|veki":[187.5,0.3],"ikrimeammar|veki":[187.5,0.3],"aliebisalihhayy|veki":[187.5,0.3],"alimubarekhinai|veki":[187.5,0.3],"omerzerr|veki":[187.5,0.3],"hanzalasufyan|veki":[187.5,0.3],"suleymanmugire|veki":[187.5,0.45],"saidubeydtai|veki":[187.5,0.3],"davudkaysferra|veki":[187.5,0.3],"saidabdulaziz|veki":[187.5,0.3],"abdulazizomer|veki":[187.5,0.3],"hisamurve|veki":[187.5,0.3],"hammadzeyd|veki":[187.5,0.3],"ibnishak|veki":[187.5,0.3],"veki|ahmedhanbel":[187.5,0.3],"veki|ibnmain":[187.5,0.3],"veki|alimedini":[187.5,0.3],"veki|ibnebiseybe":[187.5,0.3],"veki|osmanebiseybe":[187.5,0.3],"veki|misned":[187.5,0.45],"veki|hennadseri":[187.5,0.3],"veki|yahyayahyanisaburi":[187.5,0.3],"veki|mahmudgaylan":[187.5,0.3],"veki|ibnebiomeradeni":[187.5,0.3],"veki|nasralicehdami":[187.5,0.15],"veki|yahyaadem":[375,0.3],"veki|yezidharun":[178.5,0.3],"veki|kuteybesaid":[187.5,0.3],"veki|ibnrahuye":[187.5,0.3],"ibrahimsad|ibnmubarek":[187.5,0.3],"ibrahimtahman|ibnmubarek":[187.5,0.3],"ibrahimebiable|ibnmubarek":[187.5,0.3],"ibrahimfezari|ibnmubarek":[187.5,0.3],"ibrahimukbe|ibnmubarek":[187.5,0.3],"usamezeydeslem|ibnmubarek":[187.5,0.3],"usamezeydleysi|ibnmubarek":[187.5,0.3],"ismailebihalid|ibnmubarek":[187.5,0.3],"ismailayyas|ibnmubarek":[187.5,0.3],"ebuburde|ibnmubarek":[187.5,0.3],"cerirhazim|ibnmubarek":[187.5,0.3],"caferburkan|ibnmubarek":[187.5,0.3],"haccacertat|ibnmubarek":[187.5,0.3],"harmalaimran|ibnmubarek":[187.5,0.3],"huseynmuallim|ibnmubarek":[375,0.15],"hammadzeyd|ibnmubarek":[187.5,0.3],"hammadseleme|ibnmubarek":[187.5,0.3],"hamzazeyyat|ibnmubarek":[187.5,0.3],"humeydtavil|ibnmubarek":[187.5,0.3],"hanzalasufyan|ibnmubarek":[187.5,0.3],"hayveseri|ibnmubarek":[187.5,0.3],"halidhazza|ibnmubarek":[187.5,0.3],"davudattar|ibnmubarek":[187.5,0.3],"davudkaysferra|ibnmubarek":[187.5,0.3],"zaidekudame|ibnmubarek":[187.5,0.3],"zekeriyyaishak|ibnmubarek":[187.5,0.3],"zekeriyyaebizaide|ibnmubarek":[187.5,0.3],"zuhayrmuaviye|ibnmubarek":[187.5,0.3],"rebiaebiabdrahman|ibnmubarek":[187.5,0.3],"rebiuenes|ibnmubarek":[-187.5,0.3],"serieyyahya|ibnmubarek":[187.5,0.15],"sadsaidensari|ibnmubarek":[187.5,0.3],"cureyri|ibnmubarek":[187.5,0.3],"saidebiyyubmisri|ibnmubarek":[187.5,0.3],"saidabdulaziz|ibnmubarek":[187.5,0.3],"ibnebiaruba|ibnmubarek":[187.5,0.3],"ibnuyeyne|ibnmubarek":[187.5,0.3],"hasanamrfukaymi|ibnmubarek":[187.5,0.3],"ibnmubarek|abdan":[187.5,0.3],"ibnmubarek|ibnebiseybe":[187.5,0.3],"ibnmubarek|osmanebiseybe":[187.5,0.3],"ibnmubarek|ibnvehb":[187.5,0.3],"ibnmubarek|ibnmehdi":[187.5,0.3],"ibnmubarek|abdurrezzak":[187.5,0.3],"ibnmubarek|affanmuslim":[187.5,0.3],"ibnmubarek|alihasansakik":[187.5,0.3],"ibnmubarek|alihucr":[187.5,0.3],"ibnmubarek|kuteybesaid":[187.5,0.3],"ibnmubarek|suveydnasr":[187.5,0.3],"ibnmubarek|ibnmain":[187.5,0.3],"ibnmubarek|yahyaadem":[187.5,0.3],"ibnmubarek|ebulahvess":[187.5,0.3],"ismailebihalid|kattan":[187.5,0.15],"usamezeydleysi|kattan":[187.5,0.3],"esaseabdulmelik|kattan":[187.5,0.15],"behzhakim|kattan":[187.5,0.3],"sevryezid|kattan":[187.5,0.3],"caferisadik|kattan":[187.5,0.3],"hasanisad|kattan":[187.5,0.3],"hatimebisagire|kattan":[187.5,0.3],"haccacsavvaf|kattan":[187.5,0.3],"hasanzekvan|kattan":[187.5,0.3],"huseynmuallim|kattan":[187.5,0.3],"hammadseleme|kattan":[187.5,0.3],"humeydtavil|kattan":[187.5,0.15],"hanzalasufyan|kattan":[187.5,0.6],"halidhazza|kattan":[187.5,0.3],"husaymirak|kattan":[187.5,0.3],"davudkaysferra|kattan":[187.5,0.3],"zekeriyyaebizaide|kattan":[187.5,0.3],"sadibrahim|kattan":[187.5,0.3],"selimhayyan|kattan":[187.5,0.3],"amess|kattan":[187.5,0.15],"suleymanteymi|kattan":[187.5,0.3],"seyfsuleymanmekki|kattan":[187.5,0.3],"kattan|ibnmehdi":[74,0.3],"kattan|ahmedhanbel":[187.5,0.3],"kattan|alimedini":[187.5,0.3],"kattan|ibnmain":[187.5,0.3],"kattan|ibnebiseybe":[187.5,0.15],"kattan|kavariri":[187.5,0.3],"kattan|ubeydullahmuazanberi":[187.5,0.3],"kattan|affanmuslim":[187.5,0.3],"kattan|misned":[187.5,0.3],"kattan|bundar":[187.5,0.3],"kattan|ibnmusenna":[187.5,0.3],"kattan|amrbnalisayrafi":[187.5,0.3],"kattan|abbasanberi":[187.5,0.45],"kattan|yakubdevraki":[187.5,0.3],"kattan|nasralicehdami":[187.5,0.3],"kattan|mutemirsuleyman":[187.5,0.3],"kattan|sube":[187.5,0.3],"ebansattar|ibnmehdi":[187.5,0.3],"ibrahimsad|ibnmehdi":[187.5,0.3],"israilyunus|ibnmehdi":[187.5,0.3],"cerirhazim|ibnmehdi":[187.5,0.3],"harbseddad|ibnmehdi":[187.5,0.3],"hammadzeyd|ibnmehdi":[187.5,0.3],"davudkaysferra|ibnmehdi":[187.5,0.3],"zaidekudame|ibnmehdi":[187.5,0.3],"zuhayrmuaviye|ibnmehdi":[187.5,0.3],"selimhayyan|ibnmehdi":[187.5,0.3],"sallamebimuti|ibnmehdi":[187.5,0.3],"serikkadi|ibnmehdi":[187.5,0.45],"mesudi|ibnmehdi":[187.5,0.3],"macisun|ibnmehdi":[187.5,0.3],"darevardi|ibnmehdi":[187.5,0.3],"abdulvahidziyad|ibnmehdi":[187.5,0.3],"ikrimeammar|ibnmehdi":[187.5,0.3],"omerzerr|ibnmehdi":[187.5,0.3],"malikmigvel|ibnmehdi":[187.5,0.3],"muaviyesalih|ibnmehdi":[187.5,0.3],"ibnmehdi|ahmedhanbel":[187.5,0.3],"ibnmehdi|alimedini":[187.5,0.3],"ibnmehdi|ibnmain":[187.5,0.15],"ibnmehdi|kavariri":[187.5,0.3],"ibnmehdi|osmanebiseybe":[187.5,0.3],"ibnmehdi|ibnvehb":[-750,0.3],"ibnmehdi|amrbnalisayrafi":[187.5,0.3],"ibnmehdi|bundar":[187.5,0.3],"ibnmehdi|ibnmusenna":[187.5,0.3],"ibnmehdi|muhammedabdulalasanani":[187.5,0.3],"ibnmehdi|zuhli":[187.5,0.3],"ibnmehdi|mucahidmusa":[187.5,0.3],"ibnmehdi|nasralicehdami":[187.5,0.3],"ibnmehdi|yahyayahyanisaburi":[187.5,0.3],"ibnmehdi|yakubdevraki":[187.5,0.3],"ibnmehdi|ebuasimnebil":[187.5,0.3],"ibnidris|yahyaadem":[187.5,0.3],"abdusselamharb|yahyaadem":[187.5,0.3],"fudaylibnayaz|yahyaadem":[187.5,0.3],"kaysrebi|yahyaadem":[187.5,0.3],"fitrhalife|yahyaadem":[187.5,0.3],"malikmigvel|yahyaadem":[187.5,0.3],"misersukdam|yahyaadem":[187.5,0.3],"muhammedfudayl|yahyaadem":[187.5,0.3],"huseym|yahyaadem":[187.5,0.3],"varkaomer|yahyaadem":[187.5,0.3],"ebuavane|yahyaadem":[187.5,0.3],"ibnebizaide|yahyaadem":[187.5,0.3],"ebubekirayyas|yahyaadem":[187.5,0.3],"ebumuaviyedarir|yahyaadem":[187.5,0.3],"yahyaadem|ahmedhanbel":[187.5,0.3],"yahyaadem|ibnrahuye":[187.5,0.3],"yahyaadem|ibnebiseybe":[187.5,0.3],"yahyaadem|osmanebiseybe":[187.5,0.3],"yahyaadem|alimedini":[187.5,0.3],"yahyaadem|ibnmain":[187.5,0.3],"yahyaadem|abdhumeyd":[187.5,0.3],"yahyaadem|ebukureyb":[187.5,0.3],"yahyaadem|muhammedrafi":[187.5,0.3],"yahyaadem|mahmudgaylan":[187.5,0.3],"israilyunus|ibnebizaide":[187.5,0.3],"ismailebihalid|ibnebizaide":[187.5,0.15],"haccacertat|ibnebizaide":[187.5,0.3],"hasanamrfukaymi|ibnebizaide":[187.5,0.3],"halidselememahzumi|ibnebizaide":[187.5,0.3],"davudebihind|ibnebizaide":[187.5,0.3],"zekeriyyaebizaide|ibnebizaide":[187.5,0.3],"ibnuyeyne|ibnebizaide":[187.5,0.3],"amess|ibnebizaide":[187.5,0.3],"salihhayy|ibnebizaide":[187.5,0.3],"asimahvel|ibnebizaide":[187.5,0.15],"abdullahavn|ibnebizaide":[187.5,0.3],"abdulazizomer|ibnebizaide":[187.5,0.3],"abdulmelikhumeyd|ibnebizaide":[187.5,0.3],"abdulmelikebisuleyman|ibnebizaide":[187.5,0.3],"ibncureyc|ibnebizaide":[187.5,0.45],"ubeydullahomeri|ibnebizaide":[187.5,0.3],"ikrimeammar|ibnebizaide":[187.5,0.3],"amrmeymunmihran|ibnebizaide":[187.5,0.3],"leysebisuleym|ibnebizaide":[187.5,0.3],"mucalidsaid|ibnebizaide":[187.5,0.15],"ibnishak|ibnebizaide":[187.5,0.3],"misersukdam|ibnebizaide":[187.5,0.3],"musacuheni|ibnebizaide":[187.5,0.3],"nafiomercumahi|ibnebizaide":[187.5,0.3],"hasimhasim|ibnebizaide":[187.5,0.3],"hisamurve|ibnebizaide":[187.5,0.3],"varkaomer|ibnebizaide":[132.2,0.3],"yahyasaidensari|ibnebizaide":[187.5,0.3],"ebumalikesceyi|ibnebizaide":[-187.5,0.3],"ibnebizaide|ibrahimmusaferra":[187.5,0.3],"ibnebizaide|ahmedhanbel":[187.5,0.15],"ibnebizaide|ahmedmeni":[187.5,0.3],"ibnebizaide|hasanarafe":[187.5,0.3],"ibnebizaide|sericyunus":[187.5,0.3],"ibnebizaide|ibnebiseybe":[187.5,0.3],"ibnebizaide|osmanebiseybe":[187.5,0.3],"ibnebizaide|kavariri":[187.5,0.15],"ibnebizaide|alimedini":[187.5,0.15],"ibnebizaide|kuteybesaid":[187.5,0.3],"ibnebizaide|ebukureyb":[187.5,0.3],"ibnebizaide|muhammedubeydmuharibi":[187.5,0.3],"ibnebizaide|muhammedisataba":[187.5,0.3],"ibnebizaide|harunmaruf":[187.5,0.3],"ibnebizaide|hennadseri":[187.5,0.15],"ibnebizaide|ibnmain":[187.5,0.3],"ibnebizaide|yahyayahyanisaburi":[187.5,0.3],"ibnebizaide|yakubdevraki":[187.5,0.45],"ahmedhanbel|buhari":[187.5,0.3],"ahmedsalihmisri|buhari":[187.5,0.3],"ibnrahuye|buhari":[187.5,0.3],"ibnebiuveys|buhari":[187.5,0.3],"ibrahimmusaferra|buhari":[187.5,0.3],"ibrahimmunzirhizami|buhari":[187.5,0.15],"ademebiiyas|buhari":[187.5,0.3],"alimedini|buhari":[187.5,0.15],"ibnmain|buhari":[187.5,0.3],"kanebi|buhari":[187.5,0.3],"kuteybesaid|buhari":[187.5,0.3],"misned|buhari":[187.5,0.3],"bundar|buhari":[187.5,0.3],"ibnmusenna|buhari":[187.5,0.3],"amrbnalisayrafi|buhari":[187.5,0.15],"ebunuaymfadl|buhari":[187.5,0.3],"ebuasimnebil|buhari":[187.5,0.3],"affanmuslim|buhari":[187.5,0.3],"muslimibrahim|buhari":[187.5,0.3],"musaismailtebuzeki|buhari":[187.5,0.3],"hisamtayalisi|buhari":[187.5,0.3],"haccacminhal|buhari":[187.5,0.3],"alicad|buhari":[187.5,0.3],"saidsuleymansadeviye|buhari":[187.5,0.3],"ibnebiseybe|buhari":[187.5,0.3],"muhammedisataba|buhari":[187.5,0.3],"zuhli|buhari":[170.3,0.3],"mahmudgaylan|buhari":[187.5,0.3],"ibnebiomeradeni|buhari":[187.5,0.15],"buhari|tirmizi":[187.5,0.3],"buhari|ebuzuraraazi":[187.5,0.3],"buhari|ebuhatimrazi":[187.5,0.3],"buhari|muslim":[142.3,0.3],"ahmedhanbel|muslim":[187.5,0.3],"ahmeddevraki|muslim":[187.5,0.3],"ahmedmeni|muslim":[187.5,0.3],"ibrahimmusaferra|muslim":[187.5,0.3],"ibnrahuye|muslim":[187.5,0.45],"ishakkevsec|muslim":[187.5,0.45],"ibnebiuveys|muslim":[187.5,0.3],"zuheyrharb|muslim":[187.5,0.3],"said_mansur|muslim":[187.5,0.3],"sericyunus|muslim":[187.5,0.15],"seybanferruh|muslim":[187.5,0.15],"halefhisam|muslim":[187.5,0.3],"kanebi|muslim":[187.5,0.3],"abbasanberi|muslim":[187.5,0.3],"abdhumeyd|muslim":[186.1,0.3],"darimi|muslim":[120.3,0.3],"harmalayahya|muslim":[187.5,0.3],"hasanaliayyal|muslim":[187.5,0.3],"suveydsaidhadesani|muslim":[187.5,0.3],"ibnebiseybe|muslim":[187.5,0.3],"osmanebiseybe|muslim":[187.5,0.3],"kavariri|muslim":[187.5,0.3],"ebukureyb|muslim":[187.5,0.3],"muhammedrafi|muslim":[187.5,0.3],"yahyayahyanisaburi|muslim":[187.5,0.3],"kuteybesaid|muslim":[187.5,0.3],"bundar|muslim":[187.5,0.3],"ibnmusenna|muslim":[187.5,0.3],"hennadseri|muslim":[187.5,0.3],"harunmaruf|muslim":[187.5,0.3],"nasralicehdami|muslim":[187.5,0.15],"yakubdevraki|muslim":[187.5,0.3],"ubeydullahmuazanberi|muslim":[187.5,0.15],"ahmedhanbel|ebudavud":[187.5,0.3],"ibnebiseybe|ebudavud":[187.5,0.3],"osmanebiseybe|ebudavud":[187.5,0.3],"misned|ebudavud":[187.5,0.3],"zuheyrharb|ebudavud":[187.5,0.3],"kanebi|ebudavud":[187.5,0.3],"said_mansur|ebudavud":[187.5,0.3],"ahmeddevraki|ebudavud":[187.5,0.3],"muslimibrahim|ebudavud":[187.5,0.3],"musaismailtebuzeki|ebudavud":[187.5,0.3],"hisamtayalisi|ebudavud":[187.5,0.3],"kuteybesaid|ebudavud":[187.5,0.3],"ahmedsalihmisri|ebudavud":[187.5,0.3],"halefhisam|ebudavud":[187.5,0.3],"yahyaadem|ebudavud":[187.5,0.3],"bundar|tirmizi":[187.5,0.15],"ibnmusenna|tirmizi":[187.5,0.3],"kuteybesaid|tirmizi":[187.5,0.3],"hennadseri|tirmizi":[187.5,0.3],"mahmudgaylan|tirmizi":[187.5,0.3],"ebukureyb|tirmizi":[187.5,0.3],"ibnebiomeradeni|tirmizi":[187.5,0.3],"muhammedubeydmuharibi|tirmizi":[187.5,0.3],"ahmedmeni|tirmizi":[187.5,0.3],"alihucr|tirmizi":[187.5,0.3],"muhammedabdulalasanani|tirmizi":[187.5,0.3],"kuteybesaid|nesai":[187.5,0.15],"ishakkevsec|nesai":[187.5,0.3],"ibnrahuye|nesai":[187.5,0.3],"amrbnalisayrafi|nesai":[187.5,0.3],"muhammedrafi|nesai":[187.5,0.3],"muhammedabdulalasanani|nesai":[187.5,0.3],"abbasanberi|nesai":[187.5,0.3],"harmalayahya|nesai":[187.5,0.3],"ahmedsalihmisri|nesai":[187.5,0.3],"yakubdevraki|nesai":[187.5,0.3],"nasralicehdami|nesai":[187.5,0.3],"hasanarafe|nesai":[187.5,0.3],"ibnebiseybe|ibnmace":[187.5,0.3],"osmanebiseybe|ibnmace":[187.5,0.3],"hennadseri|ibnmace":[187.5,0.15],"suveydsaidhadesani|ibnmace":[187.5,0.3],"ebukureyb|ibnmace":[187.5,0.3],"muhammedubeydmuharibi|ibnmace":[187.5,0.3],"ibnebiomeradeni|ibnmace":[187.5,0.3],"amrnakid|ibnmace":[187.5,0.15],"ibrahimmusaferra|ibnmace":[187.5,0.15],"hasanarafe|ibnmace":[187.5,0.3],"zuhli|ibnmace":[187.5,0.3],"ibnrahuye|darimi":[187.5,0.3],"ahmedhanbel|darimi":[187.5,0.3],"yahyaadem|darimi":[187.5,0.3],"ebunuaymfadl|darimi":[187.5,0.3],"ebuasimnebil|darimi":[187.5,0.3],"ibnmain|darimi":[187.5,0.3],"nebi|mikdad":[187.5,0.3],"nebi|ubey":[187.5,0.3],"nebi|usame":[187.5,0.3],"nebi|basra":[187.5,0.3],"nebi|fadl":[187.5,0.3],"nebi|kabahbar":[187.5,0.3],"nebi|aise":[187.5,0.6],"nebi|enes":[187.5,0.3],"nebi|cabir":[187.5,0.3],"nebi|ibnabbas":[187.5,0.3],"nebi|ibnomer":[187.5,0.3],"nebi|ibnmesud":[187.5,0.3],"nebi|ibnzubeyr":[187.5,0.3],"nebi|bera":[187.5,0.3],"nebi|zeydarkam":[187.5,0.3],"nebi|cabirsemura":[187.5,0.3],"nebi|suhayb":[187.5,0.3],"nebi|sefine":[187.5,0.3],"nebi|hasanbali":[187.5,0.3],"nebi|huseyn":[187.5,0.3],"nebi|amrhurays":[187.5,0.3],"nebi|tariksihab":[187.5,0.3],"nebi|besrsuhaym":[187.5,0.3],"nebi|ibncafer":[187.5,0.3],"nebi|zeydsabit":[187.5,0.3],"nebi|abdrahmanebubekir":[187.5,0.3],"nebi|abdrahmanavf":[187.5,0.3],"nebi|ukbeamir":[187.5,0.3],"nebi|ebumusa":[187.5,0.3],"nebi|ebusaid":[187.5,0.3],"nebi|huzeyfe":[187.5,0.3],"nebi|rifaazuraki":[187.5,0.3],"nebi|aizamr":[187.5,0.3],"nebi|abdrahmanabza":[187.5,0.3],"nebi|esaskays":[187.5,0.3],"nebi|cerirbecel\u00ee":[187.5,0.3],"nebi|saibyezid":[187.5,0.3],"nebi|sadvakkas":[187.5,0.3],"nebi|talha":[187.5,0.3],"nebi|asimomer":[187.5,0.3],"nebi|mervan":[187.5,0.3],"nebi|mugirasube":[187.5,0.3],"nebi|imranhusayn":[187.5,0.3],"nebi|selemeekva":[187.5,0.3],"nebi|zeydhalid":[187.5,0.3],"nebi|ebuumame":[187.5,0.3],"nebi|rafihadic":[187.5,0.3],"nebi|numanbesir":[187.5,0.3],"nebi|halidvelid":[187.5,0.3],"nebi|bureyde":[187.5,0.3],"nebi|temimdari":[187.5,0.3],"nebi|hafsa":[187.5,0.3],"nebi|bilal":[187.5,0.3],"nebi|amirrebia":[187.5,0.3],"nebi|ebulubabe":[187.5,0.3]};

/* ---------- etiket kademeleri ----------
   KADEME: râvinin önem sırası (küçük = önce yer kapar).
   EKRAN_PUNTO: o kademenin ekrandaki punto boyu, ölçekten bağımsız.
   ESIK: etiketin göründüğü asgari view.k değeri.                     */

// Dört halife — müksirûn gibi, ölçekten bağımsız görünür kalırlar
export const HULEFA = new Set(["ebubekir", "omer", "osman", "ali"]);

export const KADEME = (id) => {
  if (id === "nebi") return 0;
  if (HULEFA.has(id)) return 1;
  if (MUELLIF.has(id)) return 1;
  if (MEDAR[id]) return 1;          // İbnü'l-Medînî'nin üç tabakasının tamamı
  if (MUKSIRUN.has(id)) return 1;
  const d = DERECE[id] || 0;
  if (d >= 20) return 2;
  if (d >= 10) return 3;
  if (d >= 5) return 4;
  if (d >= 3) return 5;
  return 6;
};

// kademeye göre ekranda hedeflenen punto (ölçekten bağımsız)
export const EKRAN_PUNTO = { 0: 15, 1: 12.5, 2: 11, 3: 10.5, 4: 10, 5: 9.5, 6: 9 };

/* Ölçek eşiği kullanılmıyor. Hangi isimlerin yazılacağına, ekran
   koordinatlarında yapılan çakışma testi karar verir: önemli isimler
   önce yer kapar, sığmayanlar elenir. Yaklaştıkça yer açıldığı için
   alt kademeler kendiliğinden görünür olur.                        */
export const ESIK = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

// Turkce buyuk harf (i -> I). Arapca metinde buyuk/kucuk harf ayrimi yok, oldugu gibi doner.
export const buyuk = (t) => (/[\u0621-\u064A]/.test(t) ? t : t.replace(/i/g, "\u0130").toUpperCase());

/* RAVI NOTLARININ CEVIRILERI.

   Not metni N() icinde TURKCE duruyor; asil kaynak orasi. Ingilizce
   ve Arapca karsiliklari burada, ravi kimligine gore. Kart once bu
   tabloya bakiyor, karsilik yoksa Turkce metne dusuyor -- yani yeni
   bir not eklemek icin buraya dokunmak ZORUNLU degil, sayfa yalnizca
   o notu her dilde Turkce gosterir.

   Neden ayri tablo: N() zaten yedi argumanli ve 657 satir. Sekizinci
   ve dokuzuncu argumani eklemek butun satirlari dokundururdu.

   Ceviride tutulan olcu: metin ici Arapca alintilar (« » arasindakiler)
   UC DILDE DE aynen birakildi -- onlar Mizzi ve Zehebi nin lafzi, ceviri
   degil delil. Terimler: rumuz/Symbols, sema/audition, mursel/mursal,
   medar/pivot, ihtilat/ikhtilat, tedlis/tadlis. (2026-08-30) */
export const NOT_DIL = {
 en: {
   "hanzalasufyan": "A Meccan transmitter of the clan of Jumah, descended from Umayya b. Khalaf. Ibn Hajar describes him as \"trustworthy, a proof\" and places him in the sixth layer; all six canonical collections transmit from him. He is known for his reports from Tawus, Salim b. Abdallah and al-Qasim b. Muhammad. He died in 151.",
   "humeyskaysarac": "A Meccan reciter and transmitter with the kunya Abu Safwan, known by the epithet al-A'raj, \"the lame\". Ibn Hajar says of him \"there is no harm in him\" and places him in the sixth layer; all six canonical collections transmit from him. Through his reports from Mujahid and Ata b. Abi Rabah he is one of the carriers of Meccan hadith. He died in 130, or shortly after.",
   "humeydavf": "A Medinan Successor-generation transmitter, son of the Companion Abd al-Rahman b. Awf. Ibn Hajar rates him \"trustworthy\" and places him in the second layer; all six canonical collections transmit from him. Through his reports from Abu Hurayra, Abu Sa'id al-Khudri and Mu'awiya he belongs to the early narrators of Medina; Ibn Hajar also records the view that his transmission from Umar is mursal. According to the Taqrib the soundest account places his death in 105.",
   "hamzazeyyat": "A Kufan imam of Qur'anic recitation and a transmitter, one of the seven canonical readers. Ibn Hajar rates him \"truthful, an ascetic\", adding that he sometimes erred, and places him in the seventh layer; Muslim and the four Sunan transmit from him. His standing in hadith falls short of his standing in recitation — an instance of the two disciplines being judged by separate criteria. He was born in 80 and died in 156 (or, in one account, 158).",
   "hammadebisuleyman": "A Kufan jurist and transmitter, the teacher of Abu Hanifa. He inherited the teaching circle of Ibrahim al-Nakha'i and forms the link by which the Kufan school of legal reasoning reached Abu Hanifa. Ibn Hajar calls him \"a jurist, truthful\", noting that he had errors and was accused of irja'; al-Bukhari cites him in al-Adab al-mufrad, while Muslim and the four Sunan transmit from him directly. He died in 120, or shortly before.",
   "hafsubeydullahenes": "A Medinan transmitter, grandson of the Companion Anas b. Malik. Ibn Hajar rates him \"truthful\" and places him in the third layer; al-Bukhari, Muslim, al-Tirmidhi, al-Nasa'i and Ibn Maja transmit from him. He is known for his reports from his grandfather Anas — one of the branches by which Anas's large body of narration passed down within the family.",
   "hafsasim": "A Medinan Successor-generation transmitter, a grandson of Umar b. al-Khattab and thus the nephew of Abdallah b. Umar. Ibn Hajar rates him \"trustworthy\" and places him in the third layer; all six canonical collections transmit from him. Through his reports from his uncle Ibn Umar and from Abu Hurayra he is one of the carriers of the hadith of Umar's household.",
   "husaynabdrahman": "A Kufan transmitter with the kunya Abu al-Hudhayl. Ibn Hajar rates him \"trustworthy\" and places him in the fifth layer, while noting that his memory changed at the end of his life; all six canonical collections transmit from him. That note of ikhtilat means one must ask, of any report from him, whether the hearing came before or after the change. He is known for his reports from Abu Wa'il and al-Sha'bi. He died in 136, aged ninety-three.",
   "huseyn": "The Prophet's grandson and \"sweet basil\", the younger son of Ali and Fatima. He met his grandfather and retained hadith from him. Refusing to pledge allegiance to Yazid b. Mu'awiya, he set out for Iraq at the invitation of the people of Kufa and was killed at Karbala on the tenth of Muharram in the year 61 — the day of Ashura — along with many of his household; he was fifty-six. All six canonical collections transmit from him.",
   "huseynmuallim": "A Basran transmitter, called al-Mu'allim and al-Mukattib because he taught children to write. Ibn Hajar rates him \"trustworthy\", adding that he sometimes erred, and places him in the sixth layer; all six canonical collections transmit from him. He is known for his reports from Amr b. Shu'ayb and Qatada. He died in 145.",
   "hasanhanefiyye": "A Medinan Successor-generation transmitter and jurist; his father was Muhammad b. al-Hanafiyya and his grandfather Ali. Ibn Hajar calls him \"trustworthy, a jurist\" and places him in the third layer; all six canonical collections transmit from him. Ibn Hajar also records the report that he was the first to speak on the question of irja'. He died in 100 (or, in one account, 99).",
   "hasanamrfukaymi": "A Kufan transmitter. Ibn Hajar describes him as \"trustworthy, precise\" and places him in the sixth layer; al-Bukhari, Abu Dawud, al-Nasa'i and Ibn Maja transmit from him. He is known for his reports from Mujahid and Fudayl b. Amr. He died in 142.",
   "hasanaliayyal": "A client of Hudhayl, called al-Hulwani after Hulwan, who later settled in Mecca. Ibn Hajar describes him as \"trustworthy, a memoriser\" and notes that he composed works of his own; al-Bukhari, Muslim, Abu Dawud, al-Tirmidhi and Ibn Maja transmit from him. He belongs to the eleventh layer, which drew together the hadith of the Hijaz, Iraq and Khurasan. He died in 242.",
   "hasanubeydullah": "A Kufan transmitter with the kunya Abu Urwa. Ibn Hajar describes him as \"trustworthy, of excellent standing\" and places him in the sixth layer; Muslim and the four Sunan transmit from him. His reports from Ibrahim al-Nakha'i and Abu Wa'il place him among the reliable narrators of Kufa. He died in 139 (or, in one account, 142).",
   "hasanbali": "The Prophet's grandson and \"sweet basil\", the elder son of Ali and Fatima. He met his grandfather and retained hadith from him. After his father's death the caliphate was pledged to him, but six months later he ceded it to Mu'awiya to stop bloodshed among the Muslims, and that year came to be called the Year of Unity. The four Sunan transmit from him. He died in 49 (or 50), aged forty-seven.",
   "hasanzekvan": "A Basran transmitter with the kunya Abu Salama. Ibn Hajar rates him \"truthful\" but notes that he erred, was accused of Qadari views, and practised tadlis; al-Bukhari, al-Tirmidhi and Ibn Maja transmit from him. He belongs to the sixth layer.",
   "harmalayahya": "An Egyptian transmitter and jurist, among al-Shafi'i's closest students in Egypt; several of al-Shafi'i's works outside the Umm are known through his transmission. Ibn Hajar rates him \"truthful\" and places him in the eleventh layer; Muslim, al-Nasa'i and Ibn Maja transmit from him. His grandfather Harmala b. Imran was also a transmitter. He died in 243 (or 244).",
   "harmalaimran": "An Egyptian transmitter with the kunya Abu Hafs, known as al-Hajib. Ibn Hajar rates him \"trustworthy\" and places him in the seventh layer; al-Bukhari cites him in al-Adab al-mufrad, while Muslim, Abu Dawud, al-Nasa'i and Ibn Maja transmit from him directly. His grandson Harmala b. Yahya was al-Shafi'i's student in Egypt. He died in 160, aged eighty.",
   "harbseddad": "A Basran transmitter with the kunya Abu al-Khattab. Ibn Hajar rates him \"trustworthy\" and places him in the seventh layer; al-Bukhari, Muslim, Abu Dawud, al-Tirmidhi and al-Nasa'i transmit from him. He is known for his reports from Yahya b. Abi Kathir and Qatada. He died in 161.",
   "haccacminhal": "A Basran transmitter. Ibn Hajar describes him as \"trustworthy, of excellent standing\" and places him in the ninth layer; all six canonical collections transmit from him. Through his reports from Shu'ba, Hammad b. Salama and Abdallah b. Awn he is one of those who carried Basran hadith through to the memorisers of the third century. He died in 217 (or, in one account, 216).",
   "haccacsavvaf": "A Basran transmitter with the kunya Abu al-Salt. Ibn Hajar describes him as \"trustworthy, a memoriser\" and places him in the sixth layer; all six canonical collections transmit from him. His reports from Yahya b. Abi Kathir and Qatada place him among the reliable narrators of Basra. He died in 143.",
   "habibebisabit": "A Kufan transmitter and jurist. Ibn Hajar calls him \"trustworthy, a jurist, eminent\" and places him in the third layer; all six canonical collections transmit from him. In the same entry, however, he notes that Habib often transmitted in mursal form and practised tadlis — that is, he frequently omitted his immediate teacher. This double verdict is a classic illustration that a narrator's reliability and the continuity of his chain are two separate questions. He died in 119.",
   "harisemudarrib": "A Kufan Successor-generation transmitter. Ibn Hajar rates him \"trustworthy\" and places him in the second layer; al-Bukhari cites him in al-Adab al-mufrad and the four Sunan transmit from him directly. He is known for his reports from Ali and Abdallah b. Mas'ud. Ibn Hajar explicitly rejects as mistaken the claim that Ibn al-Madini abandoned him.",
   "harissuveyd": "A Kufan Successor-generation transmitter with the kunya Abu A'isha. Ibn Hajar describes him as \"trustworthy, precise\" and places him in the second layer; all six canonical collections transmit from him. Through his reports from Abdallah b. Mas'ud and Ali he belongs to the earliest layer of Kufan narrators. He died after the year 70.",
   "hatimebisagire": "A Basran transmitter with the kunya Abu Yunus. Ibn Hajar rates him \"trustworthy\" and places him in the sixth layer; all six canonical collections transmit from him. \"Abu Saghira\" was not his father but his maternal grandfather — by another account his stepfather — whose name was Muslim. He is known for his reports from Amr b. Dinar and Simak b. Harb. He died in 152.",
   "caferavn": "A Kufan transmitter. Ibn Hajar rates him \"truthful\" and places him in the ninth layer; all six canonical collections transmit from him. Owing to his long life he is one of those who carried the hadith of Kufa through to the memorisers of the early third century; he transmitted from Hisham b. Urwa, al-A'mash and Mis'ar. He died in 207 (or, in one account, 206).",
   "caferburkan": "A transmitter from Raqqa with the kunya Abu Abdallah. Ibn Hajar rates him \"truthful\" but specifically notes that he erred in what he transmitted from al-Zuhri; al-Bukhari cites him in al-Adab al-mufrad, while Muslim and the four Sunan transmit from him directly. Through his reports from Maymun b. Mihran and Yazid b. al-Asamm he is one of the carriers of the hadith of the Jazira. He died around 154.",
   "caferebivahsiyye": "A transmitter from Wasit, famous by the kunya Abu Bishr. Ibn Hajar rates him \"trustworthy\" and notes that he was among the soundest of people in transmitting from Sa'id b. Jubayr; all six canonical collections transmit from him. Shu'ba, however, weakened his reports from Habib b. Salim and from Mujahid — an instance of the same narrator being judged sound in one teacher and weak in another. He died in 125 (or 126).",
   "cadebuosman": "A Basran transmitter with the kunya Abu Uthman, called al-Sayrafi after his trade as a money-changer. Ibn Hajar rates him \"trustworthy\" and places him in the fourth layer; al-Bukhari, Muslim, Abu Dawud, al-Tirmidhi and al-Nasa'i transmit from him. He is known for his reports from Anas b. Malik.",
   "cerirbecelî": "A Companion and chief of the Bajila tribe. He embraced Islam shortly before the Prophet's death and pledged allegiance to him; the report known as the \"pledge of sincere counsel\" comes through him. He later settled in Kufa and took part in the conquest of Iran. All six canonical collections transmit from him. He died in 51, or by another account later.",
   "cameseddad": "A Kufan Successor-generation transmitter with the kunya Abu Sakhra. Ibn Hajar rates him \"trustworthy\" and places him in the fifth layer; all six canonical collections transmit from him. He is known for his reports from Safwan b. Muhriz and Abdallah b. Abi Awfa. He died in 127 (or, in one account, 128).",
   "cabirsemura": "A Companion and the son of a Companion; his mother was the sister of Sa'd b. Abi Waqqas. He settled in Kufa and died there. All six canonical collections transmit from him. He is known for his reports describing the Prophet's prayer, his sermons and his physical appearance. He died after the year 70.",
   "sabitbunani": "A Basran Successor-generation transmitter and ascetic. Ibn Hajar describes him as \"trustworthy, devout\" and places him in the fourth layer; all six canonical collections transmit from him. He was among the most prolific students of Anas b. Malik and the chief carrier of the material transmitted through Anas; Hammad b. Salama, Shu'ba and Sulayman al-Taymi transmitted from him. He died around 127, aged eighty-six.",
   "temimdari": "A Companion; originally a Christian from the Bethlehem region of Palestine, he came to Medina in year 9 and embraced Islam. He is remembered for his night recitation of the Qur'an and for introducing lamps into the mosque. The hadith of al-Jassasa, which he transmitted, is among the long reports included in Muslim's Sahih. After the killing of Uthman he settled in Jerusalem; he died around the year 40.",
   "beyanbisr": "A Kufan transmitter with the kunya Abu Bishr. Ibn Hajar describes him as \"trustworthy, precise\" and places him in the fifth layer; all six canonical collections transmit from him. His reports from al-Sha'bi, Qays b. Abi Hazim and Anas b. Malik place him among the reliable narrators of Kufa.",
   "behzhakim": "A Basran transmitter; his father was Hakim b. Mu'awiya and his grandfather the Companion Mu'awiya b. Hayda al-Qushayri. Ibn Hajar rates him \"truthful\" and places him in the sixth layer. The three-generation family chain \"Bahz, from his father, from his grandfather\" is a much-debated case in hadith methodology: some scholars graded it fair, while others hesitated to argue from it. Al-Bukhari cites him in suspended form and the four Sunan transmit from him directly. He died before 160.",
   "bekirahnes": "A Kufan transmitter. Ibn Hajar rates him \"trustworthy\" and places him in the fourth layer; Muslim, Abu Dawud, al-Nasa'i and Ibn Maja transmit from him, and al-Bukhari cites him in his Raf' al-yadayn. His nisba is disputed, and he is also given as al-Sadusi and al-Laythi.",
   "bekirmuzeni": "A Basran Successor-generation transmitter, remembered for his asceticism and piety. Ibn Hajar describes him as \"trustworthy, precise, eminent\" and places him in the third layer; all six canonical collections transmit from him. Through his reports from Anas b. Malik, Ibn Umar and al-Mughira b. Shu'ba he is one of the carriers of Basra's early hadith. He died in 106.",
   "bakiyyevelid": "A transmitter from Homs, among the most prolific narrators of Syrian hadith. Ibn Hajar rates him \"truthful\" but notes that he practised extensive tadlis from weak narrators — that is, he would omit an intermediary and make a report appear to come from a sounder source. His narrations are therefore accepted only where he states his direct hearing explicitly (with a term such as haddathana); he is the most frequently cited illustration of why tadlis counts as a defect in its own right. He died in 197, aged eighty-seven.",
   "bece": "A Medinan Successor-generation transmitter known by the nisba al-Juhani. Ibn Hajar rates him \"trustworthy\" and places him in the third layer; al-Bukhari, Muslim, Abu Dawud, al-Tirmidhi, al-Nasa'i and Ibn Maja transmit from him. He is known for his reports from Abu Hurayra and, through his father Abdallah b. Badr, from Uqba b. Amir. He died around the year 100.",
   "bisryesar": "A Medinan Successor-generation transmitter and jurist, a client of the Ansar. Ibn Hajar calls him \"trustworthy, a jurist\" and places him in the third layer; all six canonical collections transmit from him. Through his reports from Rafi' b. Khadij and Sahl b. Abi Hathma he transmitted narrations that became the basis of legal discussion, notably on qasama and sharecropping.",
   "besirnehik": "A Basran Successor-generation transmitter with the kunya Abu al-Sha'tha'. Ibn Hajar rates him \"trustworthy\" and places him in the third layer; all six canonical collections transmit from him. He is known for his reports from Abu Hurayra, and the copy he wrote down from Abu Hurayra is among the attested early instances of hadith being committed to writing.",
   "bisrsari": "A transmitter and preacher of Basran origin who settled in Mecca. Ibn Hajar calls him \"trustworthy, exacting\" and places him in the ninth layer; all six canonical collections transmit from him. He was criticised for adopting the doctrine of Jahm, but retracted and repented of it — an instance of a narrator criticised on doctrinal grounds whose reports were accepted because he recanted. He died in 195 (or 196), aged sixty-three.",
   "busrsaid": "A Medinan Successor-generation transmitter known for his asceticism. Ibn Hajar describes him as \"trustworthy, eminent\" and places him in the second layer; all six canonical collections transmit from him. Through his reports from Abu Hurayra, Zayd b. Thabit and Sa'd b. Abi Waqqas he is one of the carriers of Medina's early hadith. He died in 100.",
   "bureyde": "A Companion who embraced Islam before Badr. He later settled in Basra and then in Khurasan, dying in Marw. All six canonical collections transmit from him, and his two sons Abdallah and Sulayman were the chief carriers of his reports. He died in 63.",
   "ebuburde": "A Kufan transmitter, the great-grandson of the Companion Abu Musa al-Ash'ari and thus the third transmitting generation of his family. Ibn Hajar calls him \"trustworthy, errs a little\" and places him in the sixth layer; all six canonical collections transmit from him. The family chain running through his grandfather Abu Burda back to Abu Musa is a textbook instance of how a single household carried a body of narration across generations.",
   "eyyubsahtiyani": "One of the foremost traditionists and jurists of Basra. Ibn Hajar calls him \"trustworthy, precise, a proof; among the leading jurists and ascetics\" and places him in the fifth layer; all six canonical collections transmit from him. His reports from Nafi', Ibn Sirin and al-Hasan al-Basri form a main artery of Basran hadith, and figures such as Hammad b. Zayd, Sufyan al-Thawri and Shu'ba transmitted from him. He died in 131, aged sixty-five.",
   "enesiyaz": "A Medinan transmitter with the kunya Abu Damra. Ibn Hajar rates him \"trustworthy\" and places him in the eighth layer; all six canonical collections transmit from him. His long life made him one of the narrators who carried the hadith of Medina over to the following generation. He died in 200, aged ninety-six.",
   "enessirin": "A Basran Successor-generation transmitter, brother of the famous traditionist and dream-interpreter Muhammad b. Sirin. Ibn Hajar rates him \"trustworthy\" and places him in the third layer; all six canonical collections transmit from him. He is known for his reports from Anas b. Malik. He died in 118 (or, in one account, 120).",
   "egarebumuslim": "A Successor-generation transmitter of Medinan origin who later settled in Kufa. Ibn Hajar rates him \"trustworthy\" and places him in the third layer; Muslim and the four Sunan transmit from him. He is known for his reports from Abu Hurayra and Abu Sa'id al-Khudri. Ibn Hajar expressly notes that he is a different person from Salman al-Aghar, who bore the same epithet and the kunya Abu Abdallah.",
   "esaskays": "The chief of the Kinda tribe and a Companion. He came to Medina with his delegation and embraced Islam; he was among those who apostatized in the turmoil following the Prophet's death, but surrendered to Abu Bakr and returned to Islam. He later settled in Kufa and took part in the conquests. All six canonical collections transmit from him. He died in 40 (or 41), aged sixty-three.",
   "esaseabdulmelik": "A Basran transmitter and jurist, known by the kunya Abu Hani'. Ibn Hajar calls him \"trustworthy, a jurist\" and places him in the sixth layer; al-Bukhari cites him in suspended form and the four Sunan transmit from him directly. He is known for his reports from al-Hasan al-Basri and Ibn Sirin. He died in 142 (or, in one account, 146).",
   "ishakkevsec": "A transmitter and jurist who settled in Marw. Ibn Hajar describes him as \"trustworthy, precise\" and places him in the eleventh layer; al-Bukhari, Muslim, al-Tirmidhi, al-Nasa'i and Ibn Maja transmit from him. He is known for his Masa'il, the collection of legal questions he put to Ahmad b. Hanbal and Ishaq b. Rahawayh. He died in 251.",
   "esvedyezid": "A Kufan mukhadram transmitter and jurist. Ibn Hajar calls him \"trustworthy, prolific, a jurist\" and places him in the second layer; all six canonical collections transmit from him. Through his reports from A'isha and Ibn Mas'ud he shaped the formation of Kufan jurisprudence. He died in 75 (or 74).",
   "esvedhilal": "A Kufan mukhadram transmitter: he lived through the pre-Islamic era but never met the Prophet. Ibn Hajar describes him as \"trustworthy, eminent\" and places him in the second layer. Al-Bukhari, Muslim, Abu Dawud and al-Nasa'i transmit from him. He died in 84.",
   "ismailayyas": "A transmitter from Homs. Ibn Hajar's verdict on him is a celebrated example in hadith criticism: he is \"truthful\" in what he transmits from the people of his own region, the Syrians, but confused in what he transmits from others. This distinction is a foundational illustration that one narrator's reports may be graded differently according to their source. He died in 181 (or 182).",
   "suddi": "A Kufan exegete and transmitter, known as al-Suddi the Elder. Ibn Hajar rates him \"truthful\" while noting that he made errors and was accused of Shi'i leanings; Muslim and the four Sunan transmit from him. His exegetical reports are among the main sources of the classical commentaries. He died in 127.",
   "ibnebiuveys": "A Medinan transmitter, the nephew and student of Imam Malik. Ibn Hajar rates him \"truthful\" but notes that he erred in some hadiths he transmitted from memory. Both al-Bukhari and Muslim transmit from him, and al-Bukhari in particular relied on his recension of Malik. He died in 226.",
   "ismailebihalid": "A Kufan Successor-generation transmitter, a client of the Bajila tribe. Ibn Hajar calls him \"trustworthy, precise\" and places him in the fourth layer; all six canonical collections transmit from him. His reports from Qays b. Abi Hazim and al-Sha'bi make him one of the main channels of Kufan hadith. He died in 146.",
   "usamezeydleysi": "Taqrib 317: «صدوق يهم». Of Medina, a client of the Layth. He died aged over seventy.",
   "usame": "Taqrib 316: «صحابي مشهور». Son of Zayd b. Haritha, the Prophet's freedman; he is styled al-Amir. He died in Medina, aged seventy-five.",
   "ahnef": "Taqrib 288: «مخضرم ثقة». His given name was al-Dahhak, or Sakhr by another view; al-Ahnaf is a byname. Ibn Hajar cites both 67 and 72 for his death.",
   "ibrahimmusaferra": "Taqrib 259: «ثقة حافظ». Of Rayy, nicknamed al-Saghir. He died after 220.",
   "ibrahimavf": "Taqrib 206: He is said to have seen the Prophet; Yaʿqub b. Shayba affirmed his audition from ʿUmar. He died in 95, or 96 by another view.",
   "ebansattar": "Taqrib 143: «ثقة له أفراد». He died around the year sixty.",
   "ibrahimfezari": "Taqrib 230: «الإمام أبو إسحاق ثقة حافظ له تصانيف». He died in 185 or later.",
   "ibrahimukbe": "Taqrib 217: «أخو موسى ثقة من السادسة» — brother of Musa b. ʿUqba, the author of the Maghazi.",
   "ibrahimtahman": "Taqrib 189: «ثقة يغرب وتكلم فيه للإرجاء ويقال رجع عنه». Of Khurasan, he settled in Nishapur then Mecca.",
   "ibrahimsad": "Taqrib 177: «ثقة حجة تُكُلِّم فيه بلا قادح». A great-grandson of ʿAbd al-Rahman b. ʿAwf; of Medina, he settled in Baghdad. Taqrib gives his death as 185.",
   "yezidharun": "Taqrib 7789: «ثقة متقن عابد». The central transmitter of Wasit. He died in 206, close to ninety.",
   "ibnsirin": "Taqrib 5947: «ثقة ثبت عابد كبير القدر كان لا يرى الرواية بالمعنى». That last notice matters for transmission method — he did not allow narration by sense. He died in 110.",
   "ebumusa": "Taqrib 3542: «صحابي مشهور». ʿUmar and then ʿUthman appointed him governor; he was one of the two arbiters at Siffin. He died in 50 or later.",
   "ubeydumeyr": "Taqrib 4385: According to Muslim he was born in the Prophet's lifetime; others count him among the senior Successors. «وكان قاص أهل مكة مجمع على ثقته» — the storyteller of Mecca, agreed upon as reliable. He died before Ibn ʿUmar.",
   "nafiibnomer": "Taqrib 7086: «ثقة ثبت فقيه مشهور». He died in 117 or later. He is the middle link of Malik's chain back to Ibn ʿUmar.",
   "huzeyfe": "Taqrib 1156: «صحابي جليل من السابقين». On the strength of a sound report in Muslim, Ibn Hajar records that the Prophet informed him of «ما كان وما يكون إلى أن تقوم الساعة» — hence the fitan reports come through him. His father was also a Companion, martyred at Uhud. He died in 36, at the start of ʿAli's caliphate.",
   "mugirasube": "Taqrib 6840: «صحابي مشهور أسلم قبل الحديبية وولي إمرة البصرة ثم الكوفة». He died in 50 according to the sounder view.",
   "mesruk": "Taqrib 6601: «ثقة فقيه عابد مخضرم». One of the mukhaḍramun — those who lived through both eras without meeting the Prophet. His kunya is Abu ʿAʾisha. He died in 62 or 63.",
   "bera": "Taqrib 648: «صحابي ابن صحابي نزل الكوفة». He was judged too young at Badr. Ibn Hajar notes «وكان هو وابن عمر لدة» — he and Ibn ʿUmar were of an age. Taqrib gives his death as 72.",
   "ibnuleyye": "Taqrib 416: «ثقة حافظ». He is known as Ibn ʿUlayya after his mother. He died in 193, aged eighty-three.",
   "ubey": "Taqrib 283: «سيد القراء ... من فضلاء الصحابة». His kunya is Abu al-Mundhir, also Abu al-Tufayl. His death year is much disputed — Ibn Hajar cites 19 and 32, and notes other views.",
   "mucahid": "Taqrib 6481: «ثقة إمام في التفسير وفي العلم». His death year is disputed — 101, 102, 103 or 104; he was eighty-three.",
   "ebudavudtayalisi": "Taqrib 2550: «ثقة حافظ غلط في أحاديث». Ibn Hajar grants his reliability while noting that he erred in some hadiths. He died in 204.",
   "salimibnomer": "Taqrib 2176: «أحد الفقهاء السبعة وكان ثبتا عابدا فاضلا كان يشبه بأبيه في الهدي والسمت». One of the seven jurists of Medina; he died at the end of 106 according to the sounder view.",
   "imranhusayn": "Taqrib 5150: He accepted Islam in the year of Khaybar and kept the Prophet's company. «وكان فاضلا وقضى بالكوفة» — he served as judge in Kufa and died in Basra in 52.",
   "osman": "Taqrib 4503: «أمير المؤمنين ذو النورين أحد السابقين الأولين والخلفاء الأربعة والعشرة المبشرة». He was martyred in Dhu al-Hijja 35, just after the Feast of Sacrifice; his caliphate lasted twelve years.",
   "omer": "Taqrib 4888: «أمير المؤمنين مشهور جم المناقب». He was martyred in Dhu al-Hijja 23; his caliphate lasted ten and a half years.",
   "ibncureyc": "Taqrib 4193: «ثقة فقيه فاضل وكان يدلس ويرسل». The notice of tadlis and irsal is Ibn Hajar's own. He died in 150 or later.",
   "ebusaid": "Taqrib 2253: «له ولأبيه صحبة واستصغر بأحد ثم شهد ما بعدها وروى الكثير». He was judged too young at Uhud but took part in every campaign after it. His death year is disputed: 63, 64, 65 or 74.",
   "aise": "Taqrib 8633: «أفقه النساء مطلقا وأفضل أزواج النبي ﷺ إلا خديجة ففيهما خلاف شهير». She died in 57 according to the sounder view.",
   "ibnabbas": "Taqrib 3409: The Prophet prayed that he be given understanding of the Qur'an; for the breadth of his learning he was called «البحر» and «الحبر». ʿUmar said: «لو أدرك ابن عباس أسناننا ما عشره منا أحد». One of the prolific Companions and of the ʿAbādila; he died in 68 at Taif.",
   "sabi": "Taqrib 3092: «ثقة مشهور فقيه فاضل من الثالثة». Makhul said of him «ما رأيت أفقه منه». He died after the year one hundred, aged about eighty.",
   "sube": "Taqrib 2790: al-Thawri used to call him «أمير المؤمنين في الحديث». Ibn Hajar adds «أول من فتش بالعراق عن الرجال وذب عن السنة» — he was the first in Iraq to scrutinise the transmitters.",
   "sevri": "Taqrib 2445: «ثقة حافظ فقيه عابد إمام حجة من رؤوس الطبقة السابعة وكان ربما دلس». He died aged sixty-four.",
   "cabir": "Taqrib 871: «صحابي ابن صحابي غزا تسع عشرة غزوة». He died in Medina after the year seventy, aged ninety-four.",
   "ibnomer": "Taqrib 3490: «أحد المكثرين من الصحابة والعبادلة وكان من أشد الناس اتباعا للأثر». He died at the end of 73 or the beginning of 74.",
   "enes": "Taqrib 565: «خادم رسول الله ﷺ خدمه عشر سنين». He died in 92, or 93 by another view, having passed a hundred.",
   "abdullahamr": "Taqrīb 3499: «أحد السابقين المكثرين من الصحابة وأحد العبادلة الفقهاء». Ibn Ḥajar places his death in the nights of al-Ḥarra and, preferably, at Ṭāʾif; as the network has no Ṭāʾif column he was put in Mecca.",
   "muazcebel": "Taqrīb 6725: «كان إليه المنتهى في العلم بالأحكام والقرآن». He died in Syria.",
   "ebudderda": "Taqrīb 5228: «صحابي جليل ... وكان عابدا». He died at the end of ʿUthmān's caliphate; he sits in the Syria column because of his judgeship in Damascus.",
   "sehlsad": "Taqrīb 2658: «له ولأبيه صحبة». One of the last Companions to die in Medina; he lived past a hundred.",
   "nebi": "The source of all transmission. In the Tahdhīb entries he appears as the teacher of the Companions with the notice «روى عن النبي ﷺ».",
   "ali": "Tahdhīb, entry 4089; symbols ع.",
   "ebuhureyre": "Tahdhīb, entry 7681. The memoriser among the Companions. Al-Mizzī lists 338 names among his students and reports from al-Bukhārī: «روى عنه نحو من ثمان مئة رجل أو أكثر». Those carrying a note denying audition were not drawn as links: al-Zuhrī «ولم يسمع منه»; Yazīd b. Rūmān and Makḥūl «مرسل»; Zayd b. Aslam «قيل لم يسمع منه».",
   "ebubekir": "In the Tahdhīb under the name «عبد الله بن عثمان وهو أبو قحافة», within the chapter of ʿayn.",
   "fatima": "Al-Mizzī mentions her among ʿAlī's teachers as his wife. Her own entry is in the Book of Women.",
   "ibnmesud": "Al-Mizzī counts him among ʿAlī's students while adding the notice «ومات قبله». The direction of transmission is disputed.",
   "alkame": "The core link of the Kufan school of law.",
   "saidmusayyeb": "He transmits from both ʿAlī and Abū Hurayra.",
   "hasanbasri": "He transmits from both centres: from ʿAlī with ت س, from Abū Hurayra with خ ٤.",
   "ebutufeyl": "Reckoned the last Companion to die; his generation is disputed.",
   "salimcad": "Al-Mizzī: he did not live to meet ʿAlī («ولم يدركه»).",
   "ibrhunayn": "His transmission from ʿAlī is mursal.",
   "harisaver": "Contested in ḥadīth criticism; a prolific transmitter of ʿAlī's reports.",
   "urve": "Al-Zuhrī's principal teacher; one of the seven jurists of Medina.",
   "zeynelabidin": "His transmission from ʿAlī is mursal.",
   "ubeydullaherafi": "ʿAlī's scribe («وكان كاتبه»).",
   "zeydsabit": "His transmission from Abū Bakr carries the symbols خ ت س.",
   "abdrahmanebubekir": "Son of Abū Bakr.",
   "ebusalih": "Al-Mizzī: he did not live to meet Abū Bakr («ولم يدركه»).",
   "eslem": "ʿUmar's client (mawlā). Symbols: ع.",
   "sadvakkas": "One of the Ten Promised Paradise.",
   "talha": "One of the Ten Promised Paradise.",
   "asimomer": "Son of ʿUmar.",
   "ebanosman": "Son of ʿUthmān.",
   "ataebirebah": "Al-Mizzī: he has no audition from ʿUthmān («ولم يسمع منه»).",
   "hamranaban": "ʿUthmān's client (mawlā). Symbols: ع.",
   "ebuabdrahmansulemi": "Symbols: خ ٤.",
   "ibnsihab": "Tahdhīb 5606. One of Ibn al-Madīnī's isnād pivots, the pivot of Medina. In the heading al-Mizzī calls him «Abū Bakr al-Madanī, sakana al-Shām» — a Medinan who settled in Damascus; in this network he sits in the Medina column because that is where the weight of his student circle lies. On his audition from Ibn ʿUmar, al-Mizzī reports the negative notices of Ibn Maʿīn, Aḥmad and Abū Ḥātim.",
   "amrdinar": "The pivot of Mecca. Al-Mizzī reports from Ibn al-Madīnī: «ʿAmr b. Dīnār was older than al-Zuhrī; he heard from Jābir, whereas al-Zuhrī did not.»",
   "yahyaebikesir": "One of the two pivots of Basra.",
   "katade": "Ibn al-Madīnī, al-ʿIlal: «and for the people of Basra, Qatāda b. Diʿāma al-Sadūsī, his kunya Abū al-Khaṭṭāb, died in 117.»",
   "ebuishaksebii": "One of the two pivots of Kufa.",
   "amess": "One of the two pivots of Kufa.",
   "malik": "Ibn al-Madīnī: «Then the learning of these six passed to the authors of compilations: in Medina, Mālik b. Anas…»",
   "ibnishak": "The imām of the maghāzī. In his entry al-Mizzī quotes Ibn al-Madīnī verbatim: the learning of the six passed to twelve men, one of them Muḥammad b. Isḥāq. Al-Zuhrī said of him: «Medina will not lack great learning so long as Ibn Isḥāq is in it.»",
   "ibnuyeyne": "In Tahdhīb 5606 among al-Zuhrī's students; symbols ع.",
   "ibnebiaruba": "One of Qatāda's soundest students. Al-Mizzī reports the notice of ikhtilāṭ: he became confused after 145; according to Ibn Maʿīn the audition of anyone who heard from him before 142 is sound, and later ones are not.",
   "hammadseleme": "One of the four pivots of Basra. Al-Mizzī adds for Ibn Jurayj and Ibn Isḥāq the notice «wa-huwa min shuyūkhihi», and for Mālik «min aqrānihi».",
   "ebuavane": "Originally of Wāsiṭ, he settled in Basra. Al-Mizzī: Shuʿba transmitted from him and died before him.",
   "mamer": "Ibn al-Madīnī, al-ʿIlal: «his kunya is Abū ʿUrwa, client of al-Ḥaddānī; he died in Yemen in 154; he heard from Ibn Shihāb.» The sources disagree on the year of his death.",
   "evzai": "The imām of Syria. Al-Mizzī reports from al-Dāraquṭnī and Ibn Maʿīn: his transmission from ʿAṭāʾ is mursal; he visited Ibn Sīrīn during his illness but did not hear from him; nor did he hear from Nāfiʿ.",
   "huseym": "Known for tadlīs. What al-Mizzī reports: he heard only one ḥadīth from Ayyūb (Ibn Maʿīn); he heard nothing at all from Khālid al-Ḥadhdhāʾ and Mughīra (Aḥmad b. Ḥanbal); he heard nothing from Mujālid; and he practised tadlīs from Zādhān.",
   "yahyaadem": "ʿAlī b. al-Madīnī: «May God have mercy on Yaḥyā b. Ādam — what learning he had.» Abū Dāwūd: «Yaḥyā is a man without peer.»",
   "ibnebizaide": "Of Ibn al-Madīnī's third tier. His father Zakariyyā b. Abī Zāʾida is also among his teachers. Al-Mizzī: he transmitted from Sufyān b. ʿUyayna and died before him.",
   "veki": "Al-Thawrī's principal transmitter. Aḥmad b. Ḥanbal: «I have seen no one who gathered more learning than Wakīʿ, nor anyone with a better memory.» Also Aḥmad: «Wakīʿ erred in five hundred ḥadīths», and «he had a far better memory than Ibn Mahdī.»",
   "ibnmubarek": "Ibn Mahdī: «the imāms are four — al-Thawrī, Mālik, Ḥammād b. Zayd and Ibn al-Mubārak»; when compared with al-Thawrī, Ibn Mahdī prefers him. Of Marw by origin (al-Marwazī), hence the Khurasan column. Al-Mizzī: «one of the imāms and of the memorisers of Islam.» Ibn Maʿīn: he heard neither from Ibrāhīm b. ʿUqba nor from Muḥammad b. ʿUqba.",
   "kattan": "An imām of jarḥ wa-taʿdīl and of ʿilal. When Aḥmad b. Ḥanbal was asked about al-Thawrī's students he named four, placing him first: Yaḥyā, Wakīʿ, ʿAbd al-Raḥmān, Abū Nuʿaym.",
   "ibnmehdi": "One of the imāms of ʿilal. In transmission from Shuʿba, ʿAffān and Ghundar are recorded as reckoned sounder than he (Aḥmad b. Ḥanbal and ʿAlī b. al-Madīnī).",
   "haricezeyd": "One of the seven jurists of Medina.",
   "ubeydullahutbe": "One of the seven jurists of Medina. Symbols: ع.",
   "arac": "Symbols: ع.",
   "hamzaibnomer": "Symbols: ع.",
   "rafihadic": "Al-Mizzī: al-Zuhrī's transmission from him is mursal.",
   "salihkeysan": "Symbols: ع.",
   "suaybebihamza": "Symbols: ع.",
   "haccacertat": "Al-Mizzī: his audition from al-Zuhrī is disputed («wa-qīla lam yasmaʿ minhu»).",
   "ebulaliye": "Symbols: ع.",
   "cabirzeyd": "Symbols: ع.",
   "nehai": "Symbols: ع. The core link of the Kufan school of raʾy.",
   "ibrahimteymi": "Symbols: ع.",
   "hakemuteybe": "In al-Aʿmash's entry al-Mizzī adds the notice «wa-huwa min shuyūkhihi» — that is, he is both his teacher and his student.",
   "ebuduha": "Symbols: ع.",
   "mearrursuveyd": "Symbols: ع.",
   "hisamdestuvai": "Symbols: ع.",
   "hemmamyahya": "Symbols: ع.",
   "cerirhazim": "Symbols: ع.",
   "cerirabdulhamid": "Symbols: ع.",
   "hafsgiyas": "Symbols: ع.",
   "leysbsad": "Al-Mizzī: he did not meet Qatāda («wa-lam yalqahu»).",
   "saidcubeyr": "Symbols: ع.",
   "tavus": "Symbols: ع.",
   "suleymanyesar": "One of the seven jurists of Medina.",
   "ebuselemeavf": "One of the seven jurists of Medina.",
   "hammadzeyd": "Symbols: خ م د ت س.",
   "davudattar": "Symbols: ع.",
   "zekeriyyaishak": "Symbols: ع.",
   "amrmeymun": "Symbols: ع.",
   "musatalha": "Al-Dāraquṭnī: Abū Isḥāq did not hear one ḥadīth from him.",
   "zuhayrmuaviye": "Symbols: ع.",
   "ebulahvess": "Symbols: ع.",
   "hafsa": "Daughter of ʿUmar and sister of Ibn ʿUmar. Symbols: ع.",
   "bilal": "Symbols: ع.",
   "amirrebia": "Symbols: ع.",
   "abdullahdinar": "Symbols: ع.",
   "cebeleshim": "Symbols: ع.",
   "saidyesar": "Symbols: ع.",
   "ubeydullahebiyezid": "Symbols: ع.",
   "ibnebimuleyke": "Symbols: ع.",
   "sumameenes": "Grandson of Anas. Symbols: ع.",
   "humeydtavil": "Symbols: ع.",
   "ebuzubeyrmekki": "Jābir's principal transmitter. Symbols: ع.",
   "ibnmunkedir": "Symbols: ع.",
   "sadhisam": "Symbols: ع.",
   "kazaayahya": "Symbols: ع.",
   "yahyaumare": "Symbols: ع.",
   "ebussiddiknaci": "Symbols: ع.",
   "abbadabdullahzubeyr": "Symbols: ع.",
   "amrabdrahmanzurara": "ʿĀʾisha's principal woman transmitter.",
   "kasimmuhammed": "One of the seven jurists of Medina, and ʿĀʾisha's nephew.",
   "caferisadik": "Symbols: م ت س ق.",
   "davudhusayn": "Symbols: ع.",
   "salimebinadr": "Symbols: ع.",
   "ibnvehb": "Symbols: خ م س.",
   "kanebi": "Symbols: خ م د ت.",
   "kuteybesaid": "Symbols: خ م د ت س.",
   "sadibrahim": "Symbols: ع.",
   "gunder": "Shuʿba's best-known transmitter. Symbols: ع.",
   "esvedkays": "Symbols: ع.",
   "cabircufi": "Contested in ḥadīth criticism.",
   "ishakyusufezrak": "Symbols: ع.",
   "abdurrezzak": "Maʿmar's principal transmitter; author of al-Muṣannaf.",
   "hisamurve": "Son of ʿUrwa. Symbols: ع.",
   "ahmedhanbel": "Author of al-Musnad. Symbols: م د.",
   "ibnrahuye": "Symbols: خ م س.",
   "abdullahtavus": "Al-Mizzī: Ibn Jurayj heard only one ḥadīth from him (Yaḥyā al-Qaṭṭān and Ibn Maʿīn).",
   "abdulhamidcubeyr": "Symbols: ع.",
   "amrsuayb": "Al-Mizzī reports from al-Bukhārī: Ibn Jurayj did not hear from him.",
   "ubeydullahomeri": "Al-Mizzī: a peer of Ibn Jurayj.",
   "haccacmuhammed": "Ibn Jurayj's principal transmitter. Symbols: ع.",
   "hemmammunebbih": "Author of al-Ṣaḥīfa al-ṣaḥīḥa. Symbols: ع.",
   "mekhul": "The foremost of the jurists of Syria.",
   "hassanatiyye": "Symbols: ع.",
   "umeyrhani": "Symbols: ع.",
   "hikalziyad": "Al-Mizzī: the soundest of people in al-Awzāʿī («wa-huwa athbat al-nās fīhi»). Symbols: م ٤.",
   "firyabi": "Symbols: ع.",
   "ebulmugirehavlani": "Symbols: ع.",
   "asimbehdele": "One of the seven imāms of Qurʾānic recitation.",
   "suheylebisalih": "Son of Abū Ṣāliḥ al-Sammān.",
   "cureyri": "Al-Mizzī reports the notice of ikhtilāṭ.",
   "ataisaib": "He is recorded to have suffered ikhtilāṭ.",
   "saidmesrukhsevri": "Father of Sufyān al-Thawrī.",
   "said_mansur": "Author of al-Sunan. Symbols: م.",
   "mucalidsaid": "Al-Mizzī, from Aḥmad b. Ḥanbal: Hushaym heard nothing at all from him.",
   "kasimmihran": "Hushaym's maternal uncle.",
   "saidsuleymansadeviye": "Al-Mizzī: the custodian of Hushaym's ḥadīth («wa-huwa qayyim bi-ḥadīthihi»).",
   "ibnebiseybe": "Author of al-Muṣannaf. Symbols: م ق.",
   "alimedini": "Author of al-ʿIlal. The tier scheme of this network is his.",
   "muhammedisataba": "Al-Mizzī: the one who knew Hushaym best («wa-huwa aʿlamuhum bihi»).",
   "yezidebihabib": "The foremost of the jurists of Egypt. Al-Mizzī: one of Ibn Isḥāq's teachers.",
   "yunusbukeyr": "One of the transmitters of Ibn Isḥāq's Maghāzī.",
   "ibnmain": "An imām of jarḥ wa-taʿdīl. Most of the audition notices in this network are reported from him.",
   "alihasansakik": "Symbols: ع.",
   "abdan": "Symbols: خ م د ت س.",
   "bundar": "Symbols: ع.",
   "muaviyesalih": "Symbols: م ٤.",
   "israilyunus": "Grandson of Abū Isḥāq al-Sabīʿī.",
   "abdhumeyd": "Author of al-Musnad and a Tafsīr. Symbols: م.",
   "buhari": "Author of al-Jāmiʿ al-ṣaḥīḥ. Al-Mizzī: «the imām of this discipline, the one followed in it, whose book is a support among all the people of Islam.» He wrote ḥadīth in Khurasan, the Jibāl, all the cities of Iraq, the Hijaz, Syria and Egypt.",
   "muslim": "Author of al-Ṣaḥīḥ. Tahdhīb 6245; of Nishapur.",
   "ebudavud": "Author of al-Sunan.",
   "tirmizi": "Author of al-Jāmiʿ and al-ʿIlal.",
   "nesai": "Author of al-Sunan. His nisba is to Nasā in Khurasan. Al-Dhahabī, Siyar 14/127: «he travelled for learning through Khurasan, the Hijaz, Egypt, Iraq, the Jazīra, Syria and the frontier posts, then settled in Egypt, and the memorisers travelled to him» — «ثم استوطن مصر، ورحل الحفاظ إليه».",
   "ms02": "Siyar 13/551: «تُوُفِّيَ إبراهيم في ثاني رجب سنة خمس وتسعين ومئتين».",
   "ms04": "The transmitter of Ṣaḥīḥ Muslim; in al-Mizzī's list he appears as «إبراهيم بن محمد بن سفيان الفقيه». Al-Ḥākim: «one of the devout mujtahids who never left Muslim's side.» Siyar 14/312: «توفي ابن سفيان عشية الاثنين ودفن يومئذ في رجب سنة ثمان وثلاث مئة».",
   "ms05": "He is said to be the son of Ḥamdūn al-Qaṣṣār. Ibn Khuzayma tested him on al-Aʿmash's reports and was struck by his memory. Siyar 14/554: «مات أبو حامد في ربيع الأول سنة إحدى وعشرين وثلاث مئة وقد قارب التسعين».",
   "ms06": "Muslim's travelling companion on the riḥla. Al-Dhahabī, Siyar 13/373: «تُوُفِّيَ ابن سلمة في غرة جمادى الآخرة سنة ست وثمانين ومئتين».",
   "ms10": "The chief man of Nishapur, known by the title «zayn al-ashrāf». Siyar 13/562: «وكانت وفاته في شهر شعبان سنة تسع وتسعين ومئتين من أبناء الثمانين».",
   "ms12": "Siyar 13/502, from his grandson ʿAbd Allāh b. ʿAlī: «توفي جدي الحسين بن محمد سنة تسع وثمانين ومئتين».",
   "ms14": "Siyar 14/78, from Ibn ʿUqda: «توفي سنة اثنتين وتسعين ومئتين».",
   "ms23": "He was known as «al-Mālikī» because he collected Mālik's ḥadīth in Rayy. His death date is disputed: Abū al-Shaykh gives 291, al-Khalīlī 288. Al-Dhahabī prefers 291 — Siyar 14/17: «الأصح وفاته في آخر سنة إحدى وتسعين ومئتين».",
   "ms25": "Muslim's travelling companion on the riḥla; al-Ḥākim reckons him «shaykh waqtihi». Siyar 13/543: «فدفن عشية الخميس السابع عشر من شهر ربيع الأول سنة إحدى وتسعين ومئتين».",
   "ms27": "He settled in Bukhara and compiled al-Musnad. Siyar 13/538: «توفي سنة ثلاث وتسعين ومئتين».",
   "ms28": "Of Baghdad; he arranged the sunan by legal rulings. Siyar 14/505, from Ibn Shāhīn: «توفي ابن صاعد بالكوفة في ذي القعدة سنة ثمان عشرة وثلاث مئة عن تسعين سنة وأشهر». As the network has no Baghdad column, he was placed where he died, in Kufa.",
   "ibnmace": "Author of al-Sunan.",
   "ishaktalha": "Symbols: خ م س.",
   "abdullahebikatade": "Symbols: ع.",
   "ebukilabe": "Symbols: ع.",
   "alimubarek": "Symbols: ع.",
   "muaviyesellam": "Symbols: ع.",
   "yahyasaidensari": "Al-Mizzī: one of the peers of Yaḥyā b. Abī Kathīr.",
   "zeydeslem": "Al-Mizzī: his audition from Abū Hurayra is disputed («قيل لم يسمع منه»).",
 },
 ar: {
   "hanzalasufyan": "راوٍ مكي من بني جمح، من ولد أمية بن خلف. وصفه ابن حجر بأنه «ثقة حجة» وجعله من السادسة، وروى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته عن طاوس وسالم بن عبد الله والقاسم بن محمد. توفي سنة ١٥١.",
   "humeyskaysarac": "قارئ وراوٍ مكي يكنى أبا صفوان، ويعرف بالأعرج. قال فيه ابن حجر «ليس به بأس» وجعله من السادسة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن مجاهد وعطاء بن أبي رباح كان من حملة حديث مكة. توفي سنة ١٣٠ أو بعدها بقليل.",
   "humeydavf": "راوٍ مدني من التابعين، وهو ابن الصحابي عبد الرحمن بن عوف. عدّه ابن حجر «ثقة» من الثانية، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن أبي هريرة وأبي سعيد الخدري ومعاوية يعد من رواة المدينة المتقدمين، وذكر ابن حجر أنه قيل إن روايته عن عمر مرسلة. وعلى الصحيح في التقريب توفي سنة ١٠٥.",
   "hamzazeyyat": "إمام من أئمة القراءة بالكوفة وراوٍ، وهو أحد القراء السبعة. عدّه ابن حجر «صدوقًا زاهدًا ربما وهم» من السابعة، وروى له مسلم وأصحاب السنن الأربعة. ومنزلته في الرواية دون منزلته في القراءة، وهو مما يبيّن أن الإمامة في القراءة والرواية في الحديث يقاسان بميزانين. ولد سنة ٨٠ وتوفي سنة ١٥٦، وقيل ١٥٨.",
   "hammadebisuleyman": "فقيه وراوٍ كوفي، وهو شيخ أبي حنيفة. خلف إبراهيم النخعي في حلقته، وبه اتصلت مدرسة الرأي بالكوفة إلى أبي حنيفة. عدّه ابن حجر «فقيهًا صدوقًا له أوهام» وذكر أنه رمي بالإرجاء، وأخرج له البخاري في الأدب المفرد وروى له مسلم وأصحاب السنن الأربعة. توفي سنة ١٢٠ أو قبلها.",
   "hafsubeydullahenes": "راوٍ مدني، وهو حفيد الصحابي أنس بن مالك. عدّه ابن حجر «صدوقًا» من الثالثة، وروى عنه البخاري ومسلم والترمذي والنسائي وابن ماجه. واشتهر بمروياته عن جده أنس، وهي أحد الطرق الأسرية التي انتقل بها حديث أنس الكثير.",
   "hafsasim": "راوٍ مدني من التابعين، وهو حفيد عمر بن الخطاب وابن أخي عبد الله بن عمر. عدّه ابن حجر «ثقة» من الثالثة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن عمه ابن عمر وعن أبي هريرة كان من حملة حديث بيت عمر.",
   "husaynabdrahman": "راوٍ كوفي يكنى أبا الهذيل. عدّه ابن حجر «ثقة» من الخامسة، ونصّ على أنه تغيّر حفظه بأخرة، وروى له أصحاب الكتب الستة جميعًا. وهذا الاختلاط يوجب السؤال في كل ما رُوي عنه: أكان السماع قبل التغيّر أم بعده. واشتهر بمروياته عن أبي وائل والشعبي. توفي سنة ١٣٦ وله ثلاث وتسعون سنة.",
   "huseyn": "سبط رسول الله صلى الله عليه وسلم وريحانته، وهو ابن علي وفاطمة الأصغر. أدرك جده وحفظ عنه. وامتنع من بيعة يزيد بن معاوية وسار إلى العراق بدعوة أهل الكوفة، فاستشهد بكربلاء يوم عاشوراء العاشر من محرم سنة ٦١ مع كثير من أهل بيته وهو ابن ست وخمسين. روى له أصحاب الكتب الستة جميعًا.",
   "huseynmuallim": "راوٍ بصري، يعرف بالمعلم والمكتب لأنه كان يعلّم الصبيان الكتابة. عدّه ابن حجر «ثقة ربما وهم» من السادسة، وروى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته عن عمرو بن شعيب وقتادة. توفي سنة ١٤٥.",
   "hasanhanefiyye": "راوٍ وفقيه مدني من التابعين، أبوه محمد ابن الحنفية وجده علي بن أبي طالب. وصفه ابن حجر بأنه «ثقة فقيه» وجعله من الثالثة، وروى له أصحاب الكتب الستة جميعًا. ونقل ابن حجر أنه يقال إنه أول من تكلم في الإرجاء. توفي سنة ١٠٠، وقيل ٩٩.",
   "hasanamrfukaymi": "راوٍ كوفي. وصفه ابن حجر بأنه «ثقة ثبت» وجعله من السادسة، وروى عنه البخاري وأبو داود والنسائي وابن ماجه. واشتهر بمروياته عن مجاهد وفضيل بن عمرو. توفي سنة ١٤٢.",
   "hasanaliayyal": "مولى هذيل، يعرف بالحلواني نسبةً إلى حلوان، ثم سكن مكة. وصفه ابن حجر بأنه «ثقة حافظ» وذكر أن له تصانيف، وروى عنه البخاري ومسلم وأبو داود والترمذي وابن ماجه. وهو من الحادية عشرة التي جمعت حديث الحجاز والعراق وخراسان. توفي سنة ٢٤٢.",
   "hasanubeydullah": "راوٍ كوفي يكنى أبا عروة. وصفه ابن حجر بأنه «ثقة فاضل» وجعله من السادسة، وروى له مسلم وأصحاب السنن الأربعة. وبمروياته عن إبراهيم النخعي وأبي وائل يعد من أثبات رواة الكوفة. توفي سنة ١٣٩، وقيل ١٤٢.",
   "hasanbali": "سبط رسول الله صلى الله عليه وسلم وريحانته، وهو ابن علي وفاطمة الأكبر. أدرك جده وحفظ عنه. وبويع بالخلافة بعد مقتل أبيه ثم نزل عنها لمعاوية بعد ستة أشهر حقنًا لدماء المسلمين، فسمي ذلك العام عام الجماعة. روى له أصحاب السنن الأربعة. توفي سنة ٤٩، وقيل ٥٠، وهو ابن سبع وأربعين.",
   "hasanzekvan": "راوٍ بصري يكنى أبا سلمة. عدّه ابن حجر «صدوقًا يخطئ» وذكر أنه رمي بالقدر وكان يدلس، وروى عنه البخاري والترمذي وابن ماجه. وهو من السادسة.",
   "harmalayahya": "راوٍ وفقيه مصري، من أخصّ أصحاب الشافعي بمصر، وبروايته عُرف بعض كتب الشافعي مما سوى الأم. عدّه ابن حجر «صدوقًا» من الحادية عشرة، وروى عنه مسلم والنسائي وابن ماجه. وجده حرملة بن عمران راوٍ أيضًا. توفي سنة ٢٤٣ أو ٢٤٤.",
   "harmalaimran": "راوٍ مصري يكنى أبا حفص، ويعرف بالحاجب. عدّه ابن حجر «ثقة» من السابعة، وأخرج له البخاري في الأدب المفرد وروى له مسلم وأبو داود والنسائي وابن ماجه. وحفيده حرملة بن يحيى صاحب الشافعي بمصر. توفي سنة ١٦٠ وله ثمانون سنة.",
   "harbseddad": "راوٍ بصري يكنى أبا الخطاب. عدّه ابن حجر «ثقة» من السابعة، وروى عنه البخاري ومسلم وأبو داود والترمذي والنسائي. واشتهر بمروياته عن يحيى بن أبي كثير وقتادة. توفي سنة ١٦١.",
   "haccacminhal": "راوٍ بصري. وصفه ابن حجر بأنه «ثقة فاضل» وجعله من التاسعة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن شعبة وحماد بن سلمة وعبد الله بن عون كان ممن أوصل حديث البصرة إلى حفاظ القرن الثالث. توفي سنة ٢١٧، وقيل ٢١٦.",
   "haccacsavvaf": "راوٍ بصري يكنى أبا الصلت. وصفه ابن حجر بأنه «ثقة حافظ» وجعله من السادسة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن يحيى بن أبي كثير وقتادة يعد من أثبات رواة البصرة. توفي سنة ١٤٣.",
   "habibebisabit": "راوٍ وفقيه كوفي. وصفه ابن حجر بأنه «ثقة فقيه جليل» وجعله من الثالثة، وروى له أصحاب الكتب الستة جميعًا. غير أنه نصّ في الموضع نفسه على أنه «كثير الإرسال والتدليس»، أي كثيرًا ما يسقط شيخه. وهذا الحكم المزدوج من أوضح ما يبين أن ثقة الراوي في نفسه مسألة، واتصال إسناده مسألة أخرى. توفي سنة ١١٩.",
   "harisemudarrib": "راوٍ كوفي من التابعين. عدّه ابن حجر «ثقة» من الثانية، وأخرج له البخاري في الأدب المفرد وروى له أصحاب السنن الأربعة. واشتهر بمروياته عن علي وعبد الله بن مسعود. ونصّ ابن حجر على أن من نقل عن ابن المديني أنه تركه فقد غلط.",
   "harissuveyd": "راوٍ كوفي من التابعين، يكنى أبا عائشة. وصفه ابن حجر بأنه «ثقة ثبت» وجعله من الثانية، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن عبد الله بن مسعود وعلي يعد من أقدم طبقات رواة الكوفة. توفي بعد سنة ٧٠.",
   "hatimebisagire": "راوٍ بصري يكنى أبا يونس. عدّه ابن حجر «ثقة» من السادسة، وروى له أصحاب الكتب الستة جميعًا. و«أبو صغيرة» ليس أباه بل جده لأمه، وقيل زوج أمه، واسمه مسلم. واشتهر بمروياته عن عمرو بن دينار وسماك بن حرب. توفي سنة ١٥٢.",
   "caferavn": "راوٍ كوفي. عدّه ابن حجر «صدوقًا» من التاسعة، وروى له أصحاب الكتب الستة جميعًا. وبطول عمره كان ممن أوصل حديث الكوفة إلى حفاظ أوائل القرن الثالث، وروى عن هشام بن عروة والأعمش ومسعر. توفي سنة ٢٠٧، وقيل ٢٠٦.",
   "caferburkan": "راوٍ رقّي يكنى أبا عبد الله. عدّه ابن حجر «صدوقًا» ونصّ على أنه «يهم في حديث الزهري»، وأخرج له البخاري في الأدب المفرد وروى له مسلم وأصحاب السنن الأربعة. وبمروياته عن ميمون بن مهران ويزيد بن الأصم كان من حملة حديث الجزيرة. توفي نحو سنة ١٥٤.",
   "caferebivahsiyye": "راوٍ واسطي، اشتهر بكنيته أبي بشر. عدّه ابن حجر «ثقة» وذكر أنه من أثبت الناس في سعيد بن جبير، وروى له أصحاب الكتب الستة جميعًا. غير أن شعبة ضعّفه في حبيب بن سالم وفي مجاهد، وهو مثال على تفاوت حال الراوي الواحد بحسب شيخه. توفي سنة ١٢٥ أو ١٢٦.",
   "cadebuosman": "راوٍ بصري يكنى أبا عثمان، ويعرف بالصيرفي لحرفته. عدّه ابن حجر «ثقة» من الرابعة، وروى عنه البخاري ومسلم وأبو داود والترمذي والنسائي. واشتهر بمروياته عن أنس بن مالك.",
   "cerirbecelî": "صحابي وسيد بجيلة. أسلم قبيل وفاة النبي صلى الله عليه وسلم وبايعه على الإسلام، وعنه جاءت رواية البيعة على النصح. ثم نزل الكوفة وشهد فتوح إيران. روى له أصحاب الكتب الستة جميعًا. توفي سنة ٥١، وقيل بعدها.",
   "cameseddad": "راوٍ كوفي من التابعين، يكنى أبا صخرة. عدّه ابن حجر «ثقة» من الخامسة، وروى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته عن صفوان بن محرز وعبد الله بن أبي أوفى. توفي سنة ١٢٧، وقيل ١٢٨.",
   "cabirsemura": "صحابي ابن صحابي، وأمه أخت سعد بن أبي وقاص. نزل الكوفة ومات بها. روى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته في صفة صلاة النبي صلى الله عليه وسلم وخطبته وشمائله. توفي بعد سنة ٧٠.",
   "sabitbunani": "راوٍ بصري من التابعين وزاهد. وصفه ابن حجر بأنه «ثقة عابد» وجعله من الرابعة، وروى له أصحاب الكتب الستة جميعًا. وكان من أكثر أصحاب أنس بن مالك رواية عنه وأهم من نقل ما جاء من طريقه، وروى عنه حماد بن سلمة وشعبة وسليمان التيمي. توفي نحو سنة ١٢٧ وله ست وثمانون سنة.",
   "temimdari": "صحابي، كان نصرانيًّا من ناحية بيت لحم بفلسطين ثم قدم المدينة سنة تسع فأسلم. ويذكر بقيامه بالقرآن في الليل وبإسراجه المسجد. وحديث الجسّاسة الذي رواه من الأخبار الطوال التي أخرجها مسلم في صحيحه. ولما قتل عثمان سكن بيت المقدس، وتوفي نحو سنة ٤٠.",
   "beyanbisr": "راوٍ كوفي يكنى أبا بشر. وصفه ابن حجر بأنه «ثقة ثبت» وجعله من الخامسة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن الشعبي وقيس بن أبي حازم وأنس بن مالك يعد من أثبات رواة الكوفة.",
   "behzhakim": "راوٍ بصري، أبوه حكيم بن معاوية وجده الصحابي معاوية بن حيدة القشيري. عدّه ابن حجر «صدوقًا» من السادسة. وإسناد الأسرة الثلاثي «بهز عن أبيه عن جده» من أشهر ما طال فيه النزاع في علوم الحديث: فحسّنه قوم وتوقف آخرون عن الاحتجاج به. وعلّق له البخاري وروى له أصحاب السنن الأربعة. توفي قبل سنة ١٦٠.",
   "bekirahnes": "راوٍ كوفي. عدّه ابن حجر «ثقة» من الرابعة، وروى له مسلم وأبو داود والنسائي وابن ماجه، وأخرج له البخاري في رفع اليدين. واختُلف في نسبته فقيل السدوسي وقيل الليثي.",
   "bekirmuzeni": "راوٍ بصري من التابعين، عرف بالزهد والورع. وصفه ابن حجر بأنه «ثقة ثبت جليل» وجعله من الثالثة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن أنس بن مالك وابن عمر والمغيرة بن شعبة كان من حملة حديث البصرة المبكر. توفي سنة ١٠٦.",
   "bakiyyevelid": "راوٍ حمصي، من أكثر رواة حديث الشام. عدّه ابن حجر «صدوقًا» غير أنه «كثير التدليس عن الضعفاء»، أي يسقط شيخه فيوهم أن الخبر من طريق أوثق. ولذلك لا تقبل روايته إلا إذا صرّح بالسماع بلفظ كـ«حدثنا»، وهو أشهر ما يمثَّل به على كون التدليس علةً قائمة بنفسها في نقد الحديث. توفي سنة ١٩٧ وله سبع وثمانون سنة.",
   "bece": "راوٍ مدني من التابعين، يعرف بالجهني. عدّه ابن حجر «ثقة» من الثالثة، وروى عنه البخاري ومسلم وأبو داود والترمذي والنسائي وابن ماجه. واشتهر بمروياته عن أبي هريرة، وعن عقبة بن عامر بواسطة أبيه عبد الله بن بدر. توفي على رأس المائة.",
   "bisryesar": "راوٍ وفقيه مدني، مولى الأنصار. وصفه ابن حجر بأنه «ثقة فقيه» وجعله من الثالثة، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن رافع بن خديج وسهل بن أبي حثمة نقل أخبارًا صارت أصلًا في مسائل فقهية كالقسامة والمزارعة.",
   "besirnehik": "راوٍ بصري من التابعين، يكنى أبا الشعثاء. عدّه ابن حجر «ثقة» من الثالثة، وروى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته عن أبي هريرة، ونسخته التي كتبها عنه من الشواهد المبكرة على كتابة الحديث.",
   "bisrsari": "راوٍ وواعظ بصري الأصل سكن مكة. وصفه ابن حجر بأنه «ثقة متقن» وجعله من التاسعة، وروى له أصحاب الكتب الستة جميعًا. وطعن فيه برأي جهم ثم اعتذر وتاب، وهو مثال للراوي المتكلَّم فيه من جهة الاعتقاد إذا رجع فقُبلت روايته. توفي سنة ١٩٥ أو ١٩٦ وله ثلاث وستون سنة.",
   "busrsaid": "راوٍ مدني من التابعين، عرف بالعبادة والزهد. وصفه ابن حجر بأنه «ثقة جليل» وجعله من الثانية، وروى له أصحاب الكتب الستة جميعًا. وبمروياته عن أبي هريرة وزيد بن ثابت وسعد بن أبي وقاص كان من حملة حديث المدينة المبكر. توفي سنة ١٠٠.",
   "bureyde": "صحابي أسلم قبل بدر. ثم نزل البصرة ثم خراسان وتوفي بمرو. روى له أصحاب الكتب الستة جميعًا، وكان ابناه عبد الله وسليمان أهم من نقل مروياته. توفي سنة ٦٣.",
   "ebuburde": "راوٍ كوفي، وهو ابن حفيد الصحابي أبي موسى الأشعري، أي الطبقة الثالثة من رواة أسرته. وصفه ابن حجر بأنه «ثقة يخطئ قليلًا» وجعله من السادسة، وروى له أصحاب الكتب الستة جميعًا. وإسناد الأسرة الموصول عبر جده أبي بردة إلى أبي موسى من أوضح الأمثلة على انتقال المرويات في بيت واحد عبر الأجيال.",
   "eyyubsahtiyani": "من كبار محدثي البصرة وفقهائها. قال فيه ابن حجر: «ثقة ثبت حجة من كبار الفقهاء العباد» وجعله من الخامسة، وروى له أصحاب الكتب الستة جميعًا. ومروياته عن نافع وابن سيرين والحسن البصري من أهم شرايين الحديث البصري، وروى عنه حماد بن زيد وسفيان الثوري وشعبة. توفي سنة ١٣١ وله خمس وستون سنة.",
   "enesiyaz": "راوٍ مدني يكنى أبا ضمرة. عدّه ابن حجر «ثقة» من الثامنة، وروى له أصحاب الكتب الستة جميعًا. وكان بطول عمره من الرواة الذين نقلوا حديث المدينة إلى الطبقة التالية. توفي سنة ٢٠٠ وله ست وتسعون سنة.",
   "enessirin": "راوٍ بصري من التابعين، أخو المحدث المعبّر المشهور محمد بن سيرين. عدّه ابن حجر «ثقة» من الثالثة، وروى له أصحاب الكتب الستة جميعًا. واشتهر بمروياته عن أنس بن مالك. توفي سنة ١١٨، وقيل ١٢٠.",
   "egarebumuslim": "راوٍ من التابعين، مدني الأصل نزل الكوفة. عدّه ابن حجر «ثقة» من الثالثة، وروى له مسلم وأصحاب السنن الأربعة. واشتهر بمروياته عن أبي هريرة وأبي سعيد الخدري. ونصّ ابن حجر على أنه غير سلمان الأغر الذي يكنى أبا عبد الله وإن اشتركا في اللقب.",
   "esaskays": "سيد كندة وصحابي. قدم المدينة في وفد قومه فأسلم، وكان ممن ارتدّ في الفتنة بعد وفاة النبي صلى الله عليه وسلم ثم رجع إلى الإسلام مستسلمًا لأبي بكر. ثم نزل الكوفة وشهد الفتوح. روى له أصحاب الكتب الستة جميعًا. توفي سنة ٤٠ أو ٤١ وهو ابن ثلاث وستين.",
   "esaseabdulmelik": "راوٍ وفقيه بصري، يكنى أبا هانئ. وصفه ابن حجر بأنه «ثقة فقيه» وجعله من السادسة، وعلّق له البخاري وروى له أصحاب السنن الأربعة. واشتهر بمروياته عن الحسن البصري وابن سيرين. توفي سنة ١٤٢، وقيل ١٤٦.",
   "ishakkevsec": "راوٍ وفقيه استوطن مرو. وصفه ابن حجر بأنه «ثقة ثبت» وجعله من الحادية عشرة، وروى عنه البخاري ومسلم والترمذي والنسائي وابن ماجه. واشتهر بـ«المسائل» التي جمع فيها ما سأل عنه أحمد بن حنبل وإسحاق بن راهويه. توفي سنة ٢٥١.",
   "esvedyezid": "راوٍ كوفي مخضرم وفقيه. وصفه ابن حجر بأنه «ثقة مكثر فقيه» وجعله من الثانية، وروى له أصحاب الكتب الستة جميعًا. وكان لمروياته عن عائشة وابن مسعود أثر في تكوّن الفقه الكوفي. توفي سنة ٧٥ أو ٧٤.",
   "esvedhilal": "راوٍ كوفي مخضرم، أدرك الجاهلية ولم ير النبي صلى الله عليه وسلم. وصفه ابن حجر بأنه «ثقة جليل» وجعله من الثانية. روى عنه البخاري ومسلم وأبو داود والنسائي. توفي سنة ٨٤.",
   "ismailayyas": "راوٍ حمصي. وحكم ابن حجر عليه من الأمثلة المشهورة في نقد الحديث: فهو «صدوق في روايته عن أهل بلده» أي الشاميين، «مخلط في غيرهم». وهذا التفريق أصل في بيان أن روايات الراوي الواحد قد تتفاوت بحسب مصدرها. توفي سنة ١٨١ أو ١٨٢.",
   "suddi": "مفسر وراوٍ كوفي، يعرف بالسدي الكبير. عدّه ابن حجر «صدوقًا يهم» وذكر أنه رمي بالتشيع، وروى له مسلم وأصحاب السنن الأربعة. ومروياته في التفسير من أهم مصادر كتب التفسير الكلاسيكية. توفي سنة ١٢٧.",
   "ibnebiuveys": "راوٍ مدني، ابن أخت الإمام مالك وتلميذه. عدّه ابن حجر «صدوقًا» غير أنه أخطأ في أحاديث من حفظه. روى عنه البخاري ومسلم، واعتمد البخاري خاصةً على نسخته عن مالك. توفي سنة ٢٢٦.",
   "ismailebihalid": "راوٍ كوفي من طبقة أتباع التابعين، مولى بجيلة. وصفه ابن حجر بأنه «ثقة ثبت» وجعله من الرابعة، وروى له أصحاب الكتب الستة جميعًا. ومروياته عن قيس بن أبي حازم والشعبي من أهم قنوات الحديث الكوفي. توفي سنة ١٤٦.",
   "usamezeydleysi": "تقريب 317: «صدوق يهم». مدنيٌّ مولى ليث. مات وهو ابن بضع وسبعين.",
   "usame": "تقريب 316: «صحابي مشهور». ابن زيد بن حارثة مولى النبي ﷺ، ويقال له الأمير. مات بالمدينة وهو ابن خمس وسبعين.",
   "ahnef": "تقريب 288: «مخضرم ثقة». اسمه الضحاك وقيل صخر، والأحنف لقب. وذكر ابن حجر في وفاته سنة 67 وقيل 72.",
   "ibrahimmusaferra": "تقريب 259: «ثقة حافظ». رازيٌّ يلقب الصغير. مات بعد العشرين ومئتين.",
   "ibrahimavf": "تقريب 206: قيل له رؤية، وسماعه من عمر أثبته يعقوب بن شيبة. مات سنة 95 وقيل 96.",
   "ebansattar": "تقريب 143: «ثقة له أفراد». مات في حدود الستين.",
   "ibrahimfezari": "تقريب 230: «الإمام أبو إسحاق ثقة حافظ له تصانيف». مات سنة 185 وقيل بعدها.",
   "ibrahimukbe": "تقريب 217: «أخو موسى ثقة من السادسة»، وهو أخو موسى بن عقبة صاحب المغازي.",
   "ibrahimtahman": "تقريب 189: «ثقة يغرب وتكلم فيه للإرجاء ويقال رجع عنه». خراسانيٌّ سكن نيسابور ثم مكة.",
   "ibrahimsad": "تقريب 177: «ثقة حجة تُكُلِّم فيه بلا قادح». مدنيٌّ نزل بغداد. وفي التقريب أنه مات سنة 185.",
   "yezidharun": "تقريب 7789: «ثقة متقن عابد». مات سنة 206 وقد قارب التسعين.",
   "ibnsirin": "تقريب 5947: «ثقة ثبت عابد كبير القدر كان لا يرى الرواية بالمعنى». مات سنة 110.",
   "ebumusa": "تقريب 3542: «صحابي مشهور». أمَّره عمر ثم عثمان، وهو أحد الحكمين بصفين. مات سنة 50 وقيل بعدها.",
   "ubeydumeyr": "تقريب 4385: قال مسلم وُلد على عهد النبي ﷺ، وعدَّه غيره في كبار التابعين. «وكان قاصَّ أهل مكة مجمعٌ على ثقته». مات قبل ابن عمر.",
   "nafiibnomer": "تقريب 7086: «ثقة ثبت فقيه مشهور». مات سنة 117 أو بعد ذلك.",
   "huzeyfe": "تقريب 1156: «صحابي جليل من السابقين». وصحَّ في مسلم أن رسول الله ﷺ أعلمه «بما كان وما يكون إلى أن تقوم الساعة». وأبوه صحابي أيضًا استُشهد بأحد. مات في أول خلافة علي سنة 36.",
   "mugirasube": "تقريب 6840: «صحابي مشهور أسلم قبل الحديبية وولي إمرة البصرة ثم الكوفة». مات سنة 50 على الصحيح.",
   "mesruk": "تقريب 6601: «ثقة فقيه عابد مخضرم». كنيته أبو عائشة. مات سنة 62 ويقال 63.",
   "bera": "تقريب 648: «صحابي ابن صحابي نزل الكوفة». استُصغر يوم بدر، و«كان هو وابن عمر لدة». مات سنة 72.",
   "ibnuleyye": "تقريب 416: «ثقة حافظ». المعروف بابن علية. مات سنة 193 وهو ابن ثلاث وثمانين.",
   "ubey": "تقريب 283: «سيد القراء ... من فضلاء الصحابة». كنيته أبو المنذر ويكنى أبا الطفيل أيضًا. واختُلف في سنة موته اختلافًا كثيرًا: قيل 19 وقيل 32 وقيل غير ذلك.",
   "mucahid": "تقريب 6481: «ثقة إمام في التفسير وفي العلم». وفي وفاته اختلاف: 101 أو 102 أو 103 أو 104، وله ثلاث وثمانون.",
   "ebudavudtayalisi": "تقريب 2550: «ثقة حافظ غلط في أحاديث». مات سنة 204.",
   "salimibnomer": "تقريب 2176: «أحد الفقهاء السبعة وكان ثبتًا عابدًا فاضلًا كان يُشبَّه بأبيه في الهدي والسمت». مات في آخر سنة 106 على الصحيح.",
   "imranhusayn": "تقريب 5150: أسلم عام خيبر وصحب. «وكان فاضلًا وقضى بالكوفة»، ومات سنة 52 بالبصرة.",
   "osman": "تقريب 4503: «أمير المؤمنين ذو النورين أحد السابقين الأولين والخلفاء الأربعة والعشرة المبشرة». استُشهد في ذي الحجة بعد عيد الأضحى سنة 35، فكانت خلافته اثنتي عشرة سنة.",
   "omer": "تقريب 4888: «أمير المؤمنين مشهور جم المناقب». استُشهد في ذي الحجة سنة 23، وولي الخلافة عشر سنين ونصفًا.",
   "ibncureyc": "تقريب 4193: «ثقة فقيه فاضل وكان يدلس ويرسل». مات سنة 150 أو بعدها.",
   "ebusaid": "تقريب 2253: «له ولأبيه صحبة واستُصغر بأحد ثم شهد ما بعدها وروى الكثير». وفي وفاته اختلاف: 63 أو 64 أو 65، وقيل 74.",
   "aise": "تقريب 8633: «أفقه النساء مطلقًا وأفضل أزواج النبي ﷺ إلا خديجة ففيهما خلاف شهير». ماتت سنة 57 على الصحيح.",
   "ibnabbas": "تقريب 3409: دعا له النبي ﷺ بالفهم في القرآن، وكان يسمى «البحر» و«الحبر» لسعة علمه. وقال عمر: «لو أدرك ابن عباس أسناننا ما عشره منا أحد». من المكثرين من الصحابة ومن العبادلة، توفي سنة 68 بالطائف.",
   "sabi": "تقريب 3092: «ثقة مشهور فقيه فاضل من الثالثة». قال فيه مكحول «ما رأيت أفقه منه». مات بعد المئة وله نحو من ثمانين.",
   "sube": "تقريب 2790: كان الثوري يقول فيه «أمير المؤمنين في الحديث». وقيَّده ابن حجر بأنه «أول من فتش بالعراق عن الرجال وذب عن السنة».",
   "sevri": "تقريب 2445: «ثقة حافظ فقيه عابد إمام حجة من رؤوس الطبقة السابعة وكان ربما دلس». مات وله أربع وستون سنة.",
   "cabir": "تقريب 871: «صحابي ابن صحابي غزا تسع عشرة غزوة». مات بالمدينة بعد السبعين وهو ابن أربع وتسعين.",
   "ibnomer": "تقريب 3490: «أحد المكثرين من الصحابة والعبادلة وكان من أشد الناس اتباعًا للأثر». توفي في آخر سنة 73 أو أول التي تليها.",
   "enes": "تقريب 565: «خادم رسول الله ﷺ خدمه عشر سنين». توفي سنة 92 وقيل 93، وقد جاوز المئة.",
   "abdullahamr": "تقريب 3499: «أحد السابقين المكثرين من الصحابة وأحد العبادلة الفقهاء». جعل ابن حجر وفاته ليالي الحرة وموضعها الطائف على الراجح؛ ولمَّا لم يكن في الشبكة عمودٌ للطائف وُضع في مكة.",
   "muazcebel": "تقريب 6725: «كان إليه المنتهى في العلم بالأحكام والقرآن». توفي بالشام.",
   "ebudderda": "تقريب 5228: «صحابي جليل ... وكان عابدا». توفي في أواخر خلافة عثمان، وموضعه عمود الشام لقضائه بدمشق.",
   "sehlsad": "تقريب 2658: «له ولأبيه صحبة». من آخر الصحابة موتًا بالمدينة، وقد جاوز المئة.",
   "nebi": "مصدر الرواية كلها. يرد في تراجم التهذيب شيخًا للصحابة بقيد «روى عن النبي ﷺ».",
   "ali": "تهذيب الكمال، ترجمة 4089، رموز ع.",
   "ebuhureyre": "تهذيب الكمال، ترجمة 7681. حافظ الصحابة. عدَّ المزي في تلاميذه 338 اسمًا، ونقل عن البخاري «روى عنه نحو من ثمان مئة رجل أو أكثر». ولم تُرسَم صلةً مَن نُصَّ على نفي سماعه: الزهري «ولم يسمع منه»؛ يزيد بن رومان ومكحول «مرسل»؛ زيد بن أسلم «قيل لم يسمع منه».",
   "ebubekir": "في التهذيب باسم «عبد الله بن عثمان وهو أبو قحافة»، في باب العين.",
   "fatima": "ذكرها المزي في شيوخ عليٍّ بوصفها زوجته. وترجمتها في كتاب النساء.",
   "ibnmesud": "عدَّه المزي في تلاميذ عليٍّ وقيَّده بقوله «ومات قبله». وجهة الرواية محل نظر.",
   "alkame": "الحلقة الأساسية لمدرسة الكوفة الفقهية.",
   "saidmusayyeb": "يروي عن عليٍّ وعن أبي هريرة معًا.",
   "hasanbasri": "يروي عن المركزين معًا: عن عليٍّ ت س، وعن أبي هريرة خ ٤.",
   "ebutufeyl": "يُعَدُّ آخر الصحابة موتًا، وطبقته مختلف فيها.",
   "salimcad": "المزي: لم يدرك عليًّا («ولم يدركه»).",
   "ibrhunayn": "روايته عن عليٍّ مرسلة.",
   "harisaver": "متكلَّم فيه من جهة الجرح، وهو مُكثِرٌ من رواية أخبار عليٍّ.",
   "urve": "شيخ الزهري الأول، ومن فقهاء المدينة السبعة.",
   "zeynelabidin": "روايته عن عليٍّ مرسلة.",
   "ubeydullaherafi": "كاتب عليٍّ («وكان كاتبه»).",
   "zeydsabit": "روايته عن أبي بكر برمز خ ت س.",
   "abdrahmanebubekir": "ابن أبي بكر الصديق.",
   "ebusalih": "المزي: لم يدرك أبا بكر («ولم يدركه»).",
   "eslem": "مولى عمر بن الخطاب. رموز: ع.",
   "sadvakkas": "من العشرة المبشَّرين بالجنة.",
   "talha": "من العشرة المبشَّرين بالجنة.",
   "asimomer": "ابن عمر بن الخطاب.",
   "ebanosman": "ابن عثمان بن عفان.",
   "ataebirebah": "المزي: لا سماع له من عثمان («ولم يسمع منه»).",
   "hamranaban": "مولى عثمان بن عفان. رموز: ع.",
   "ebuabdrahmansulemi": "رموز: خ ٤.",
   "ibnsihab": "تهذيب الكمال 5606. من مدارات الإسناد عند ابن المديني، وهو مدار المدينة. قال المزي في العنوان «أبو بكر المدني، سكن الشام»، فهو مدنيٌّ استوطن الشام؛ وموضعه في الشبكة عمود المدينة لثقل حلقة تلاميذه فيها. ونقل المزي في سماعه من ابن عمر كلام ابن معين وأحمد وأبي حاتم بالنفي.",
   "amrdinar": "مدار مكة. نقل المزي عن ابن المديني: «عمرو بن دينار أسنُّ من الزهري، سمع من جابر، والزهري لم يسمع منه».",
   "yahyaebikesir": "أحد مداري البصرة.",
   "katade": "ابن المديني في العلل: «ولأهل البصرة قتادة بن دعامة السدوسي، كنيته أبو الخطاب، مات سنة سبع عشرة ومئة».",
   "ebuishaksebii": "أحد مداري الكوفة.",
   "amess": "أحد مداري الكوفة.",
   "malik": "ابن المديني: «ثم صار علم هؤلاء الستة إلى أصحاب التصانيف، فبالمدينة مالك بن أنس…»",
   "ibnishak": "إمام المغازي. نقل المزي في ترجمته قول ابن المديني بنصه: صار علم الستة إلى اثني عشر رجلًا، أحدهم محمد بن إسحاق. وقال فيه الزهري: «لا يزال بالمدينة علم جمٌّ ما دام فيها ابن إسحاق».",
   "ibnuyeyne": "في تهذيب الكمال 5606 ضمن تلاميذ الزهري، رموز ع.",
   "ibnebiaruba": "من أثبت تلاميذ قتادة. نقل المزي قيد الاختلاط: اختلط بعد سنة 145، وعند ابن معين مَن سمع منه قبل سنة 142 فسماعه صحيح، ومَن بعدها فلا.",
   "hammadseleme": "من مدارات البصرة الأربعة. قيَّد المزي ابن جريج وابن إسحاق بقوله «وهو من شيوخه»، ومالكًا بقوله «من أقرانه».",
   "ebuavane": "واسطيُّ الأصل، استوطن البصرة. المزي: روى عنه شعبة ومات قبله.",
   "mamer": "ابن المديني في العلل: «كنيته أبو عروة، مولى الحدَّاني، مات باليمن سنة أربع وخمسين ومئة، سمع من ابن شهاب». وفي سنة وفاته اختلاف بين المصادر.",
   "evzai": "إمام الشام. نقل المزي عن الدارقطني وابن معين: روايته عن عطاء مرسلة، وعاد ابن سيرين في مرضه ولم يسمع منه، ولم يسمع من نافع أيضًا.",
   "huseym": "معروف بالتدليس. ومما نقله المزي: لم يسمع من أيوب إلا حديثًا واحدًا (ابن معين)، ولم يسمع من خالد الحذاء والمغيرة شيئًا (أحمد بن حنبل)، ولم يسمع من مجالد شيئًا، ودلَّس عن زاذان.",
   "yahyaadem": "علي بن المديني: «رحم الله يحيى بن آدم، أيُّ علمٍ كان عنده». وقال أبو داود: «يحيى أوحد الناس».",
   "ibnebizaide": "من الطبقة الثالثة عند ابن المديني. وأبوه زكريا بن أبي زائدة من شيوخه أيضًا. المزي: روى عن سفيان بن عيينة ومات قبله.",
   "veki": "الراوي الأول عن الثوري. قال أحمد بن حنبل: «ما رأيت أحدًا أوعى للعلم من وكيع، ولا أحفظ منه». وقال أيضًا: «أخطأ وكيع في خمس مئة حديث»، و«كان أحفظ من ابن مهدي بكثير».",
   "ibnmubarek": "ابن مهدي: «الأئمة أربعة: الثوري ومالك وحماد بن زيد وابن المبارك»؛ وإذا قُورن بالثوري قدَّمه ابن مهدي. مروزيُّ الأصل، فموضعه عمود خراسان. المزي: «أحد الأئمة ومن حفاظ الإسلام». وقال ابن معين: لم يسمع من إبراهيم بن عقبة ولا من محمد بن عقبة.",
   "kattan": "إمام في الجرح والتعديل والعلل. سُئل أحمد بن حنبل عن أصحاب الثوري فعدَّ أربعةً وقدَّمه عليهم: يحيى ووكيع وعبد الرحمن وأبو نعيم.",
   "ibnmehdi": "من أئمة العلل. ونُقل أن عفان وغُندرًا أثبتُ منه في شعبة (أحمد بن حنبل وعلي بن المديني).",
   "haricezeyd": "من فقهاء المدينة السبعة.",
   "ubeydullahutbe": "من فقهاء المدينة السبعة. رموز: ع.",
   "arac": "رموز: ع.",
   "hamzaibnomer": "رموز: ع.",
   "rafihadic": "المزي: رواية الزهري عنه مرسلة.",
   "salihkeysan": "رموز: ع.",
   "suaybebihamza": "رموز: ع.",
   "haccacertat": "المزي: سماعه من الزهري مختلف فيه («وقيل لم يسمع منه»).",
   "ebulaliye": "رموز: ع.",
   "cabirzeyd": "رموز: ع.",
   "nehai": "رموز: ع. الحلقة الأساسية لمدرسة الرأي بالكوفة.",
   "ibrahimteymi": "رموز: ع.",
   "hakemuteybe": "قيَّده المزي في ترجمة الأعمش بقوله «وهو من شيوخه»، أي إنه شيخه وتلميذه معًا.",
   "ebuduha": "رموز: ع.",
   "mearrursuveyd": "رموز: ع.",
   "hisamdestuvai": "رموز: ع.",
   "hemmamyahya": "رموز: ع.",
   "cerirhazim": "رموز: ع.",
   "cerirabdulhamid": "رموز: ع.",
   "hafsgiyas": "رموز: ع.",
   "leysbsad": "المزي: لم يلقَ قتادة («ولم يلقه»).",
   "saidcubeyr": "رموز: ع.",
   "tavus": "رموز: ع.",
   "suleymanyesar": "من فقهاء المدينة السبعة.",
   "ebuselemeavf": "من فقهاء المدينة السبعة.",
   "hammadzeyd": "رموز: خ م د ت س.",
   "davudattar": "رموز: ع.",
   "zekeriyyaishak": "رموز: ع.",
   "amrmeymun": "رموز: ع.",
   "musatalha": "الدارقطني: لم يسمع أبو إسحاق منه حديثًا.",
   "zuhayrmuaviye": "رموز: ع.",
   "ebulahvess": "رموز: ع.",
   "hafsa": "بنت عمر بن الخطاب وأخت ابن عمر. رموز: ع.",
   "bilal": "رموز: ع.",
   "amirrebia": "رموز: ع.",
   "abdullahdinar": "رموز: ع.",
   "cebeleshim": "رموز: ع.",
   "saidyesar": "رموز: ع.",
   "ubeydullahebiyezid": "رموز: ع.",
   "ibnebimuleyke": "رموز: ع.",
   "sumameenes": "حفيد أنس بن مالك. رموز: ع.",
   "humeydtavil": "رموز: ع.",
   "ebuzubeyrmekki": "الراوي الأول عن جابر. رموز: ع.",
   "ibnmunkedir": "رموز: ع.",
   "sadhisam": "رموز: ع.",
   "kazaayahya": "رموز: ع.",
   "yahyaumare": "رموز: ع.",
   "ebussiddiknaci": "رموز: ع.",
   "abbadabdullahzubeyr": "رموز: ع.",
   "amrabdrahmanzurara": "الراوية الأولى عن عائشة.",
   "kasimmuhammed": "من فقهاء المدينة السبعة، وابن أخي عائشة.",
   "caferisadik": "رموز: م ت س ق.",
   "davudhusayn": "رموز: ع.",
   "salimebinadr": "رموز: ع.",
   "ibnvehb": "رموز: خ م س.",
   "kanebi": "رموز: خ م د ت.",
   "kuteybesaid": "رموز: خ م د ت س.",
   "sadibrahim": "رموز: ع.",
   "gunder": "أشهر الرواة عن شعبة. رموز: ع.",
   "esvedkays": "رموز: ع.",
   "cabircufi": "متكلَّم فيه من جهة الجرح.",
   "ishakyusufezrak": "رموز: ع.",
   "abdurrezzak": "الراوي الأول عن معمر، وصاحب المصنف.",
   "hisamurve": "ابن عروة بن الزبير. رموز: ع.",
   "ahmedhanbel": "صاحب المسند. رموز: م د.",
   "ibnrahuye": "رموز: خ م س.",
   "abdullahtavus": "المزي: لم يسمع ابن جريج منه إلا حديثًا واحدًا (يحيى القطان وابن معين).",
   "abdulhamidcubeyr": "رموز: ع.",
   "amrsuayb": "نقل المزي عن البخاري: لم يسمع ابن جريج منه.",
   "ubeydullahomeri": "المزي: من أقران ابن جريج.",
   "haccacmuhammed": "الراوي الأول عن ابن جريج. رموز: ع.",
   "hemmammunebbih": "صاحب الصحيفة الصحيحة. رموز: ع.",
   "mekhul": "مقدَّم فقهاء الشام.",
   "hassanatiyye": "رموز: ع.",
   "umeyrhani": "رموز: ع.",
   "hikalziyad": "المزي: هو أثبت الناس في الأوزاعي («وهو أثبت الناس فيه»). رموز: م ٤.",
   "firyabi": "رموز: ع.",
   "ebulmugirehavlani": "رموز: ع.",
   "asimbehdele": "من أئمة القراءات السبعة.",
   "suheylebisalih": "ابن أبي صالح السمان.",
   "cureyri": "نقل المزي قيد الاختلاط.",
   "ataisaib": "نُقل أنه اختلط.",
   "saidmesrukhsevri": "والد سفيان الثوري.",
   "said_mansur": "صاحب السنن. رموز: م.",
   "mucalidsaid": "المزي عن أحمد بن حنبل: لم يسمع هشيم منه شيئًا.",
   "kasimmihran": "خال هشيم.",
   "saidsuleymansadeviye": "المزي: هو قيِّمٌ بحديث هشيم («وهو قيِّم بحديثه»).",
   "ibnebiseybe": "صاحب المصنف. رموز: م ق.",
   "alimedini": "صاحب العلل. وتصنيف الطبقات في هذه الشبكة مأخوذ عنه.",
   "muhammedisataba": "المزي: هو أعلمهم به («وهو أعلمهم به»).",
   "yezidebihabib": "مقدَّم فقهاء مصر. المزي: من شيوخ ابن إسحاق.",
   "yunusbukeyr": "من رواة مغازي ابن إسحاق.",
   "ibnmain": "إمام الجرح والتعديل. وأكثر قيود السماع في هذه الشبكة منقولة عنه.",
   "alihasansakik": "رموز: ع.",
   "abdan": "رموز: خ م د ت س.",
   "bundar": "رموز: ع.",
   "muaviyesalih": "رموز: م ٤.",
   "israilyunus": "حفيد أبي إسحاق السبيعي.",
   "abdhumeyd": "صاحب المسند والتفسير. رموز: م.",
   "buhari": "صاحب الجامع الصحيح. قال المزي: «إمام هذا الشأن والمقتدى به فيه، وكتابه معتمَدٌ بين أهل الإسلام كافةً». كتب الحديث بخراسان والجبال ومدائن العراق كلها والحجاز والشام ومصر.",
   "muslim": "صاحب الصحيح. تهذيب الكمال 6245، نيسابوري.",
   "ebudavud": "صاحب السنن.",
   "tirmizi": "صاحب الجامع والعلل.",
   "nesai": "صاحب السنن. ونسبته إلى نَسَا بخراسان. قال الذهبي في السير 14/127: «طوَّف في طلب العلم بخراسان والحجاز ومصر والعراق والجزيرة والشام والثغور، ثم استوطن مصر، ورحل الحفاظ إليه».",
   "ms02": "السير 13/551: «تُوُفِّيَ إبراهيم في ثاني رجب سنة خمس وتسعين ومئتين».",
   "ms04": "راوي صحيح مسلم؛ ويرد في قائمة المزي «إبراهيم بن محمد بن سفيان الفقيه». قال الحاكم: «من العُبَّاد المجتهدين الملازمين لمسلم». السير 14/312: «توفي ابن سفيان عشية الاثنين ودفن يومئذ في رجب سنة ثمان وثلاث مئة».",
   "ms05": "يقال إنه ابن حمدون القصار. وامتحنه ابن خزيمة في أحاديث الأعمش فأُعجب بحفظه. السير 14/554: «مات أبو حامد في ربيع الأول سنة إحدى وعشرين وثلاث مئة وقد قارب التسعين».",
   "ms06": "رفيق مسلم في الرحلة. الذهبي في السير 13/373: «تُوُفِّيَ ابن سلمة في غرة جمادى الآخرة سنة ست وثمانين ومئتين».",
   "ms10": "رئيس نيسابور، وكان يُلقَّب بـ«زين الأشراف». السير 13/562: «وكانت وفاته في شهر شعبان سنة تسع وتسعين ومئتين من أبناء الثمانين».",
   "ms12": "السير 13/502 عن حفيده عبد الله بن علي: «توفي جدي الحسين بن محمد سنة تسع وثمانين ومئتين».",
   "ms14": "السير 14/78 عن ابن عقدة: «توفي سنة اثنتين وتسعين ومئتين».",
   "ms23": "عُرف بـ«المالكي» لجمعه حديث مالك بالرَّي. وفي وفاته اختلاف: أبو الشيخ 291، والخليلي 288. ورجَّح الذهبي 291 — السير 14/17: «الأصح وفاته في آخر سنة إحدى وتسعين ومئتين».",
   "ms25": "رفيق مسلم في الرحلة، وعدَّه الحاكم «شيخ وقته». السير 13/543: «فدفن عشية الخميس السابع عشر من شهر ربيع الأول سنة إحدى وتسعين ومئتين».",
   "ms27": "استوطن بخارى وصنَّف المسند. السير 13/538: «توفي سنة ثلاث وتسعين ومئتين».",
   "ms28": "بغدادي، صنَّف السنن على الأحكام. السير 14/505 عن ابن شاهين: «توفي ابن صاعد بالكوفة في ذي القعدة سنة ثمان عشرة وثلاث مئة عن تسعين سنة وأشهر». ولمَّا لم يكن في الشبكة عمودٌ لبغداد وُضع حيث مات، أي بالكوفة.",
   "ibnmace": "صاحب السنن.",
   "ishaktalha": "رموز: خ م س.",
   "abdullahebikatade": "رموز: ع.",
   "ebukilabe": "رموز: ع.",
   "alimubarek": "رموز: ع.",
   "muaviyesellam": "رموز: ع.",
   "yahyasaidensari": "المزي: من أقران يحيى بن أبي كثير.",
   "zeydeslem": "المزي: سماعه من أبي هريرة مختلف فيه («قيل لم يسمع منه»).",
 },
};

export const YILLAR = Array.from({ length: 31 }, (_, i) => 10 + i * 10);

/* Yatay damali satirlar: 25'er yillik bantlar (Mustafa, 2026-08-29).
   Sutunlardaki damali zeminin dikey karsiligi -- goz, bir ismin hangi
   ceyrek yuzyila dustugunu cizgileri saymadan gorebilsin diye.
   Sutunlarla AYNI iki ton kullaniliyor ama daha soluk: ikisi ust uste
   binince renk birikip zemini kirletmesin. */
export const SATIR_YIL = 25;
/* Bantlar YUVARLAK YILLARA oturuyor: 0-25, 25-50, 50-75... Onceden
   YIL_MIN'den (5) baslayip 25'er gidiyordu, yani sinirlar 30/55/80'e
   dusuyor ve eksendeki 25/50/75 cizgileriyle tutmuyordu (Mustafa,
   2026-08-29). Bant 0'dan basliyor; cizim sirasinda eksenin disinda
   kalan kisim zaten kirpiliyor. */
export const SATIRLAR = Array.from(
  { length: Math.ceil(YIL_MAX / SATIR_YIL) },
  (_, i) => i * SATIR_YIL,
);
/* Sabit bantlar: solda yil ekseni, ustte belde isimleri. Ikisi de
   2026-08-29'da daraltildi (44 -> 26 ve 58 -> 36). Bantlar tuvalden
   yer caliyor; ozellikle telefonda 58 px'lik sol bant ekranin altida
   birine denk geliyordu. Puntolar da birlikte kucultuldu, yoksa yazi
   dar banda sigmaz. */
export const UST_BANT = 26;    // şehir isimleri bandı
/* Yil ekseni bandi 2026-08-30'da 36'dan 24'e indi: "175 h." tek satir
   yerine iki satir yaziliyor (sayi ustte, "h./هـ/AH" altta), boylece
   agdan calinan yatay serit ucte bir daraldi. */
export const SOL_BANT = 24;    // yıl ekseni bandı
/* Arama kutusunun taban genisligi. Kutu ekranin %15'i; dar bir pencerede
   bu 132 px'e dusuyordu ve Ingilizce yer tutucu ("Find a Narrator")
   sigmiyordu -- buyutec ikonu 28 px sol dolgu aliyor, geriye 92 px
   kaliyor, yazi ise ~105 px istiyor. 152 hepsini alir. */
export const KUME_EN_AZ = 152;
/* Bilgi kartinda bir baslik altinda gosterilecek en fazla isim. */
export const KART_TAVAN = 100;
