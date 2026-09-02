import type { Kelime } from "./DilAntrenmani";

/* DİL ANTRENMANI — kelime havuzları.

   İki küme var. `B1_SEVIYELERI` 12 seviye (Oxford B1), `HADIS_SEVIYELERI`
   6 seviye (hadis ilminin ıstılahları). Kümeler `DilAntrenmaniHub`
   içinde `KUMELER` dizisinden bağlanıyor.

   Her seviye TAM 10 kelime tutuyor, çünkü tahta 6x6 = 36 kart ve
   10 kelime × 3 dil + 6 joker tam oturuyor. Seviye sayısını ya da
   kelime sayısını değiştirirsen `DilAntrenmani.tsx` içindeki
   `JOKER_SAYISI` ile tahtanın 6 sütunlu ızgarası da elden geçmeli.

   KAYNAK: İngilizce kelimelerin HEPSİ Oxford 3000'in B1 katmanından
   (elimizdeki `oxford-B1.csv`, 700 kelime). Rastgele seçilmediler,
   şu üç ölçüte göre elendiler.

   1. TEK ANLAMLI olacak. Bağlamsız bir kartta *file*, *bank*, *iron*
      gibi kelimeler hangi anlamda kastedildiğini söylemiyor; oyuncu
      Türkçe karşılığı bilse bile eşleştiremez.
   2. TÜRÜ SABİT olacak. Listede fiil yok, yalnızca isim ve sıfat var.
      Fiil karıştırılsaydı Türkçe mastar, İngilizce yalın hâl ve Arapça
      mâzî/masdar yan yana gelir, kartlar arasında dilbilgisi tutarsız
      görünürdü.
   3. AYNI SEVİYEDEKİ ON KELİME BİRBİRİNE KARIŞMAYACAK. "prens" ile
      "prenses" (أَمِير / أَمِيرَة) ya da "heykel" ile "yontu" gibi çiftler
      bilerek ayrı seviyelere dağıtıldı.

   ARAPÇA KARŞILIKLAR HAREKELİ. Gerekçesi devir notundan geliyor ve
   hâlâ geçerli: harekesiz yazıldığında عَلَم kelimesi عِلْم, جَنَاح ise
   جُنَاح okunuyordu. Yeni kelime eklerken aynı kontrolü yap.

   Seviye 1 oyunun ilk sürümünden olduğu gibi geldi, tarayıcıda
   defalarca oynandı; sıralamayı bozma. */

export type Seviye = {
  /* Yalnızca kod tarafı için; ekranda "Seviye 1" yazıyor. Kutuların
     üzerinde tema adı GÖSTERİLMİYOR, Mustafâ'nın isteği. */
  tema: string;
  kelimeler: Kelime[];
};

export const B1_SEVIYELERI: Seviye[] = [
  {
    tema: "Nesneler",
    kelimeler: [
      { tr: "zil", en: "bell", ar: "جَرَس" },
      { tr: "dal", en: "branch", ar: "غُصْن" },
      { tr: "perde", en: "curtain", ar: "سِتَارَة" },
      { tr: "bayrak", en: "flag", ar: "عَلَم" },
      { tr: "tohum", en: "seed", ar: "بَذْرَة" },
      { tr: "iğne", en: "needle", ar: "إِبْرَة" },
      { tr: "şiir", en: "poem", ar: "قَصِيدَة" },
      { tr: "kum", en: "sand", ar: "رَمْل" },
      { tr: "çadır", en: "tent", ar: "خَيْمَة" },
      { tr: "kanat", en: "wing", ar: "جَنَاح" },
    ],
  },
  {
    tema: "Ev ve eşya",
    kelimeler: [
      { tr: "tavan", en: "ceiling", ar: "سَقْف" },
      { tr: "raf", en: "shelf", ar: "رَفّ" },
      { tr: "ip", en: "rope", ar: "حَبْل" },
      { tr: "tencere", en: "pot", ar: "قِدْر" },
      { tr: "tava", en: "pan", ar: "مِقْلَاة" },
      { tr: "boru", en: "pipe", ar: "أُنْبُوب" },
      { tr: "zincir", en: "chain", ar: "سِلْسِلَة" },
      { tr: "çit", en: "fence", ar: "سِيَاج" },
      { tr: "kulübe", en: "cottage", ar: "كُوخ" },
      { tr: "avlu", en: "yard", ar: "فِنَاء" },
    ],
  },
  {
    tema: "İnsanlar",
    kelimeler: [
      { tr: "gelin", en: "bride", ar: "عَرُوس" },
      { tr: "denizci", en: "sailor", ar: "بَحَّار" },
      { tr: "şair", en: "poet", ar: "شَاعِر" },
      { tr: "rahip", en: "priest", ar: "قِسِّيس" },
      { tr: "prens", en: "prince", ar: "أَمِير" },
      { tr: "hizmetçi", en: "servant", ar: "خَادِم" },
      { tr: "yabancı", en: "stranger", ar: "غَرِيب" },
      { tr: "mahkûm", en: "prisoner", ar: "سَجِين" },
      { tr: "düşman", en: "enemy", ar: "عَدُوّ" },
      { tr: "kurban", en: "victim", ar: "ضَحِيَّة" },
    ],
  },
  {
    tema: "Beden ve giyim",
    kelimeler: [
      { tr: "göğüs", en: "chest", ar: "صَدْر" },
      { tr: "dudak", en: "lip", ar: "شَفَة" },
      { tr: "boğaz", en: "throat", ar: "حَلْق" },
      { tr: "kas", en: "muscle", ar: "عَضَلَة" },
      { tr: "eldiven", en: "glove", ar: "قُفَّاز" },
      { tr: "şapka", en: "cap", ar: "قُبَّعَة" },
      { tr: "yün", en: "wool", ar: "صُوف" },
      { tr: "pamuk", en: "cotton", ar: "قُطْن" },
      { tr: "kumaş", en: "cloth", ar: "قُمَاش" },
      { tr: "deri", en: "leather", ar: "جِلْد" },
    ],
  },
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "arı", en: "bee", ar: "نَحْلَة" },
      { tr: "çamur", en: "mud", ar: "طِين" },
      { tr: "toprak", en: "soil", ar: "تُرْبَة" },
      { tr: "toz", en: "dust", ar: "غُبَار" },
      { tr: "kömür", en: "coal", ar: "فَحْم" },
      { tr: "elmas", en: "diamond", ar: "مَاس" },
      { tr: "deprem", en: "earthquake", ar: "زِلْزَال" },
      { tr: "kürk", en: "fur", ar: "فَرْو" },
      { tr: "deniz kabuğu", en: "shell", ar: "صَدَفَة" },
      { tr: "kır", en: "countryside", ar: "رِيف" },
    ],
  },
  {
    tema: "Sanat ve sahne",
    kelimeler: [
      { tr: "davul", en: "drum", ar: "طَبْل" },
      { tr: "heykel", en: "statue", ar: "تِمْثَال" },
      { tr: "dergi", en: "journal", ar: "مَجَلَّة" },
      { tr: "edebiyat", en: "literature", ar: "أَدَب" },
      { tr: "gösteri", en: "performance", ar: "عَرْض" },
      { tr: "stadyum", en: "stadium", ar: "مَلْعَب" },
      { tr: "tören", en: "ceremony", ar: "اِحْتِفَال" },
      { tr: "bant", en: "tape", ar: "شَرِيط" },
      { tr: "sicim", en: "string", ar: "خَيْط" },
      { tr: "hayalet", en: "ghost", ar: "شَبَح" },
    ],
  },
  {
    tema: "Duygular",
    kelimeler: [
      { tr: "mutluluk", en: "happiness", ar: "سَعَادَة" },
      { tr: "güzellik", en: "beauty", ar: "جَمَال" },
      { tr: "dostluk", en: "friendship", ar: "صَدَاقَة" },
      { tr: "tutku", en: "passion", ar: "شَغَف" },
      { tr: "zevk", en: "pleasure", ar: "مُتْعَة" },
      { tr: "dehşet", en: "horror", ar: "رُعْب" },
      { tr: "saygı", en: "respect", ar: "اِحْتِرَام" },
      { tr: "duygu", en: "emotion", ar: "شُعُور" },
      { tr: "zekâ", en: "intelligence", ar: "ذَكَاء" },
      { tr: "gençlik", en: "youth", ar: "شَبَاب" },
    ],
  },
  {
    tema: "Toplum",
    kelimeler: [
      { tr: "millet", en: "nation", ar: "أُمَّة" },
      { tr: "birlik", en: "union", ar: "اِتِّحَاد" },
      { tr: "seçim", en: "election", ar: "اِنْتِخَاب" },
      { tr: "aday", en: "candidate", ar: "مُرَشَّح" },
      { tr: "mahkeme", en: "court", ar: "مَحْكَمَة" },
      { tr: "ceza", en: "punishment", ar: "عِقَاب" },
      { tr: "din", en: "religion", ar: "دِين" },
      { tr: "dua", en: "prayer", ar: "دُعَاء" },
      { tr: "gelenek", en: "custom", ar: "عَادَة" },
      { tr: "kimlik", en: "identity", ar: "هُوِيَّة" },
    ],
  },
  {
    tema: "Hayat",
    kelimeler: [
      { tr: "çocukluk", en: "childhood", ar: "طُفُولَة" },
      { tr: "evlilik", en: "marriage", ar: "زَوَاج" },
      { tr: "nesil", en: "generation", ar: "جِيل" },
      { tr: "ruh", en: "spirit", ar: "رُوح" },
      { tr: "inanç", en: "belief", ar: "إِيمَان" },
      { tr: "hakikat", en: "truth", ar: "حَقِيقَة" },
      { tr: "yoksulluk", en: "poverty", ar: "فَقْر" },
      { tr: "kayıp", en: "loss", ar: "خَسَارَة" },
      { tr: "vesile", en: "occasion", ar: "مُنَاسَبَة" },
      { tr: "sorumluluk", en: "responsibility", ar: "مَسْؤُولِيَّة" },
    ],
  },
  {
    tema: "İş ve para",
    kelimeler: [
      { tr: "ekonomi", en: "economy", ar: "اِقْتِصَاد" },
      { tr: "kâr", en: "profit", ar: "رِبْح" },
      { tr: "ödeme", en: "payment", ar: "دَفْع" },
      { tr: "mülk", en: "property", ar: "مِلْك" },
      { tr: "fiş", en: "receipt", ar: "إِيصَال" },
      { tr: "rezervasyon", en: "reservation", ar: "حَجْز" },
      { tr: "görev", en: "duty", ar: "وَاجِب" },
      { tr: "emniyet", en: "safety", ar: "أَمَان" },
      { tr: "sınır", en: "border", ar: "حُدُود" },
      { tr: "giriş", en: "entrance", ar: "مَدْخَل" },
    ],
  },
  {
    tema: "Bilim ve ölçü",
    kelimeler: [
      { tr: "katman", en: "layer", ar: "طَبَقَة" },
      { tr: "uzunluk", en: "length", ar: "طُول" },
      { tr: "basınç", en: "pressure", ar: "ضَغْط" },
      { tr: "madde", en: "substance", ar: "مَادَّة" },
      { tr: "kuram", en: "theory", ar: "نَظَرِيَّة" },
      { tr: "laboratuvar", en: "laboratory", ar: "مُخْتَبَر" },
      { tr: "güç", en: "strength", ar: "قُوَّة" },
      { tr: "pil", en: "battery", ar: "بَطَّارِيَّة" },
      { tr: "lastik", en: "tyre", ar: "إِطَار" },
      { tr: "ağ", en: "net", ar: "شَبَكَة" },
    ],
  },
  {
    tema: "Sıfatlar",
    kelimeler: [
      { tr: "cesur", en: "brave", ar: "شُجَاع" },
      { tr: "cömert", en: "generous", ar: "كَرِيم" },
      { tr: "dürüst", en: "honest", ar: "صَادِق" },
      { tr: "utangaç", en: "shy", ar: "خَجُول" },
      { tr: "yalnız", en: "lonely", ar: "وَحِيد" },
      { tr: "keskin", en: "sharp", ar: "حَادّ" },
      { tr: "pürüzsüz", en: "smooth", ar: "نَاعِم" },
      { tr: "parlak", en: "shiny", ar: "لَامِع" },
      { tr: "sessiz", en: "silent", ar: "صَامِت" },
      { tr: "çirkin", en: "ugly", ar: "قَبِيح" },
    ],
  },
];

/* HADİSLE İLGİLİ KELİMELER — altı seviye.

   AMAÇ: hadis talebesi İngilizce bir makale okurken karşılaştığı
   kelimeyi tanıyabilsin. Yani İngilizce sütun, o literatürde GERÇEKTEN
   kullanılan kelime -- ıstılahın çevriyazısı değil.

   BİR TRİPLET ÜÇ AYRI YÜZ TAŞIMALI. Bu listenin ilk hâli çevriyazıyla
   yazılmıştı ve oyun çöküyordu: "mevkuf / mawquf / موقوف" gibi kartlar
   birbirinin aynısı olduğu için eşleştirme kendiliğinden çözülüyordu,
   hafıza da bilgi de devreye girmiyordu (Mustafâ'nın uyarısı,
   2026-09-02). Kural artık şu -- Türkçesi, İngilizcesi ve Arapçası
   birbirinden AYRI görünmüyorsa o ıstılah listeye girmiyor.

   Bu yüzden ELENEN ıstılahlar var. mursal, mawquf, marfu', mu'allaq,
   munqati', shadhdh, munkar, tadlis... İngilizce makalelerde bunlar
   Arapça bırakılıyor, yani İngilizce sütun Türkçe sütunun kopyası
   oluyor. Yerlerine İngilizce karşılığı gerçekten olan ıstılahlar ve
   Batı'daki hadis çalışmalarının kendi kavram dili kondu.

   ÜÇÜNCÜ SEVİYE ORYANTALİST LİTERATÜRÜN SÖZLÜĞÜ. Türkçe karşılıklar
   TDV İslâm Ansiklopedisi'nin Juynboll maddesinden alındı (müşterek
   râvi, kısmî müşterek râvi, tek râvili tarîk, örümcek, dalış, isnâd
   kümesi). "Common link"in Arapça karşılığı olarak مَدَار seçildi:
   Juynboll'ün kendisi de klasik literatürde bu kavramın "medâr" diye
   anıldığını söylüyor, yani uydurma bir karşılık değil.

   cerh/ta'dîl için "impugnment" ve "accreditation" Dickinson'ın İbnü's-
   Salâh çevirisinden ("impugning ... accrediting"); "criticism and
   praise" de kullanılıyor ama o çift daha gevşek.

   DÖRDÜNCÜ SEVİYEDEKİ nakil usullerinin İngilizce karşılıkları da aynı
   çeviri geleneğinden: samâ' "audition", kırâat "recitation", icâzet
   "licence", münâvele "handing over", mükâtebe "correspondence", i'lâm
   "notification", vasiyet "bequest", vicâde "finding". Sekizi de
   İngilizce metinlerde bu şekilde geçiyor, yani öğrenci makalede
   "handing over" görünce münâveleyi tanıyacak.

   ARAPÇA KARŞILIKLAR HAREKELİ, B1 havuzuyla aynı gerekçe. Uzun
   tamlamalardan kaçınıldı -- kartın puntosu harf sayısına göre
   düşüyor (bkz. `DilAntrenmani.tsx` içindeki `punto()`), "isnad-cum-matn
   analysis" gibi bir ifade kartta okunmaz hâle geliyor. */
export const HADIS_SEVIYELERI: Seviye[] = [
  {
    tema: "İsnâd ve nakil",
    kelimeler: [
      { tr: "hadis", en: "report", ar: "حَدِيث" },
      { tr: "isnâd", en: "chain", ar: "إِسْنَاد" },
      { tr: "râvi", en: "transmitter", ar: "رَاوٍ" },
      { tr: "metin", en: "text", ar: "مَتْن" },
      { tr: "sahâbî", en: "Companion", ar: "صَحَابِيّ" },
      { tr: "tâbiî", en: "Successor", ar: "تَابِعِيّ" },
      { tr: "tabaka", en: "generation", ar: "طَبَقَة" },
      { tr: "tarîk", en: "strand", ar: "طَرِيق" },
      { tr: "muhaddis", en: "traditionist", ar: "مُحَدِّث" },
      { tr: "şâhid", en: "corroboration", ar: "شَاهِد" },
    ],
  },
  {
    tema: "Sıhhat ve tenkit",
    kelimeler: [
      { tr: "sahih", en: "authentic", ar: "صَحِيح" },
      { tr: "hasen", en: "fair", ar: "حَسَن" },
      { tr: "zayıf", en: "weak", ar: "ضَعِيف" },
      { tr: "mevzû", en: "forgery", ar: "مَوْضُوع" },
      { tr: "illet", en: "defect", ar: "عِلَّة" },
      { tr: "sika", en: "reliable", ar: "ثِقَة" },
      { tr: "adâlet", en: "uprightness", ar: "عَدَالَة" },
      { tr: "zabt", en: "accuracy", ar: "ضَبْط" },
      { tr: "cerh", en: "impugnment", ar: "جَرْح" },
      { tr: "ta'dîl", en: "accreditation", ar: "تَعْدِيل" },
    ],
  },
  {
    tema: "Batı'da hadis çalışmaları",
    kelimeler: [
      { tr: "müşterek râvi", en: "common link", ar: "مَدَار" },
      { tr: "örümcek", en: "spider", ar: "عَنْكَبُوت" },
      { tr: "dalış", en: "dive", ar: "غَوْص" },
      { tr: "tek râvili tarîk", en: "single strand", ar: "طَرِيق مُفْرَد" },
      { tr: "isnâd kümesi", en: "isnad bundle", ar: "حُزْمَة أَسَانِيد" },
      { tr: "geriye doğru büyüme", en: "backward growth", ar: "النُّمُوّ الْعَكْسِيّ" },
      { tr: "müsteşrik", en: "orientalist", ar: "مُسْتَشْرِق" },
      { tr: "tarihlendirme", en: "dating", ar: "تَأْرِيخ" },
      { tr: "uydurma", en: "fabrication", ar: "وَضْع" },
      { tr: "hadis tenkidi", en: "hadith criticism", ar: "نَقْد الْحَدِيث" },
    ],
  },
  {
    tema: "Tahammül ve edâ",
    kelimeler: [
      { tr: "semâ", en: "audition", ar: "سَمَاع" },
      { tr: "kırâat", en: "recitation", ar: "قِرَاءَة" },
      { tr: "icâzet", en: "licence", ar: "إِجَازَة" },
      { tr: "münâvele", en: "handing over", ar: "مُنَاوَلَة" },
      { tr: "mükâtebe", en: "correspondence", ar: "مُكَاتَبَة" },
      { tr: "vicâde", en: "finding", ar: "وِجَادَة" },
      { tr: "i'lâm", en: "notification", ar: "إِعْلَام" },
      { tr: "vasiyet", en: "bequest", ar: "وَصِيَّة" },
      { tr: "tahammül", en: "reception", ar: "تَحَمُّل" },
      { tr: "rihle", en: "journey", ar: "رِحْلَة" },
    ],
  },
  {
    tema: "Kitaplar ve âlimler",
    kelimeler: [
      { tr: "tasnif", en: "compilation", ar: "تَصْنِيف" },
      { tr: "şerh", en: "commentary", ar: "شَرْح" },
      { tr: "muhtasar", en: "abridgement", ar: "مُخْتَصَر" },
      { tr: "nüsha", en: "recension", ar: "نُسْخَة" },
      { tr: "sahîfe", en: "scroll", ar: "صَحِيفَة" },
      { tr: "Kütüb-i Sitte", en: "the Six Books", ar: "الْكُتُب السِّتَّة" },
      { tr: "ricâl", en: "biographies", ar: "رِجَال" },
      { tr: "bâb", en: "chapter", ar: "بَاب" },
      { tr: "mukaddime", en: "introduction", ar: "مُقَدِّمَة" },
      { tr: "hâfız", en: "memoriser", ar: "حَافِظ" },
    ],
  },
  {
    tema: "Metin ve muhteva",
    kelimeler: [
      { tr: "tevâtür", en: "mass transmission", ar: "تَوَاتُر" },
      { tr: "haber-i vâhid", en: "solitary report", ar: "خَبَر الْوَاحِد" },
      { tr: "ziyade", en: "addition", ar: "زِيَادَة" },
      { tr: "ihtilâf", en: "divergence", ar: "اِخْتِلَاف" },
      { tr: "nesih", en: "abrogation", ar: "نَسْخ" },
      { tr: "te'vil", en: "interpretation", ar: "تَأْوِيل" },
      { tr: "mütâbi", en: "parallel", ar: "مُتَابِع" },
      { tr: "garîb", en: "rare", ar: "غَرِيب" },
      { tr: "müdrec", en: "interpolation", ar: "مُدْرَج" },
      { tr: "mânâ rivayeti", en: "paraphrase", ar: "رِوَايَة بِالْمَعْنَى" },
    ],
  },
];
