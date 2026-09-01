import type { Kelime } from "./DilAntrenmani";

/* DİL ANTRENMANI — kelime havuzları.

   İki küme var. `B1_SEVIYELERI` 12 seviye (Oxford B1), `HADIS_SEVIYELERI`
   3 seviye (hadis ilminin ıstılahları). Kümeler `DilAntrenmaniHub`
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

/* HADİSLE İLGİLİ KELİMELER — üç seviye.

   Bu küme ötekinden farklı bir iş görüyor. B1 havuzunda oyuncu üç ayrı
   dilde ÜÇ AYRI kelime görüyor; burada Türkçe karşılık çoğu zaman
   Arapça ıstılahın kendisi (isnâd / إِسْنَاد). Kazanç şurada: ıstılahın
   Arapça yazılışını tanımak ve İngilizce karşılığını öğrenmek. Hadis
   ilmi metinleri üç dilde de okunuyor, terimin üç yüzünü birlikte
   görmek işe yarıyor.

   İNGİLİZCE KARŞILIKLAR NASIL SEÇİLDİ. Kural şu: İngilizce akademik
   literatürde o ıstılahın YERLEŞİK bir karşılığı varsa o alınıyor, yoksa
   ıstılah olduğu gibi çevriyazıyla yazılıyor.

   İlk sürümde harfî çeviriler kullanılmıştı ve yanlıştı -- مُرْسَل için
   "sent" yazıyordu. "Sent" kelimenin sözlük anlamı, İngilizce hadis
   literatüründe kimsenin kullanmadığı bir karşılık; o metinlerde terim
   doğrudan "mursal" diye geçiyor (Mustafâ'nın uyarısı, 2026-09-01).

   Ayrımın nerede durduğu:

   - Yerleşik İngilizce karşılığı OLANLAR çevrildi -- hadith, sunnah,
     isnad, matn, transmitter, Companion, Successor, narration,
     traditionist, report; ve dört hüküm: sound, good, weak, fabricated.
   - Yapı ve kusur ıstılahları ÇEVRİYAZIYLA -- marfu, mawquf, mursal,
     mu'allaq, shadhdh, munkar, jarh, ta'dil, illa, mutawatir, ahad,
     ijaza, sama', hafiz, munqati', tadlis. İngilizce metinler bunları
     Arapça bırakıyor, "raised" / "stopped" / "suspended" gibi harfî
     karşılıklar ancak parantez içi etimoloji notu olarak geçiyor.

   Çevriyazı sitenin öteki İngilizce metinleriyle aynı sadelikte
   (`Bukhari`, `Abu Dawud`, `Nasa'i` gibi) -- aksan işareti yok, ayn
   yalnızca kelime içinde ya da sonunda kesme ile.

   İngilizce karşılıklar ayrıca KISA tutuldu: "comprehensive collection"
   gibi tamlamalar kartta 8 puntoya düşüyor (bkz. `DilAntrenmani.tsx`
   içindeki `punto()`), bu yüzden kitap türleri (câmi, müsned, sünen)
   listeye hiç alınmadı.

   Aynı seviyede kök benzerliği olan çiftler bilerek ayrıldı: مَقْطُوع
   ile مُنْقَطِع aynı kökten, ikisi birlikte konsaydı Arapça kartlar bir
   bakışta ayırt edilemezdi -- مَقْطُوع listeye hiç alınmadı. */
export const HADIS_SEVIYELERI: Seviye[] = [
  {
    tema: "Temel kavramlar",
    kelimeler: [
      { tr: "hadis", en: "hadith", ar: "حَدِيث" },
      { tr: "sünnet", en: "sunnah", ar: "سُنَّة" },
      { tr: "isnâd", en: "isnad", ar: "إِسْنَاد" },
      { tr: "metin", en: "matn", ar: "مَتْن" },
      { tr: "râvi", en: "transmitter", ar: "رَاوٍ" },
      { tr: "sahâbî", en: "Companion", ar: "صَحَابِيّ" },
      { tr: "tâbiî", en: "Successor", ar: "تَابِعِيّ" },
      { tr: "rivayet", en: "narration", ar: "رِوَايَة" },
      { tr: "muhaddis", en: "traditionist", ar: "مُحَدِّث" },
      { tr: "haber", en: "report", ar: "خَبَر" },
    ],
  },
  {
    tema: "Hüküm ve dereceler",
    kelimeler: [
      { tr: "sahih", en: "sound", ar: "صَحِيح" },
      { tr: "hasen", en: "good", ar: "حَسَن" },
      { tr: "zayıf", en: "weak", ar: "ضَعِيف" },
      { tr: "mevzû", en: "fabricated", ar: "مَوْضُوع" },
      { tr: "merfû", en: "marfu", ar: "مَرْفُوع" },
      { tr: "mevkuf", en: "mawquf", ar: "مَوْقُوف" },
      { tr: "mürsel", en: "mursal", ar: "مُرْسَل" },
      { tr: "muallak", en: "mu'allaq", ar: "مُعَلَّق" },
      { tr: "şâz", en: "shadhdh", ar: "شَاذّ" },
      { tr: "münker", en: "munkar", ar: "مُنْكَر" },
    ],
  },
  {
    tema: "İlim ve nakil",
    kelimeler: [
      { tr: "cerh", en: "jarh", ar: "جَرْح" },
      { tr: "ta'dîl", en: "ta'dil", ar: "تَعْدِيل" },
      { tr: "illet", en: "illa", ar: "عِلَّة" },
      { tr: "mütevâtir", en: "mutawatir", ar: "مُتَوَاتِر" },
      { tr: "âhâd", en: "ahad", ar: "آحَاد" },
      { tr: "icâzet", en: "ijaza", ar: "إِجَازَة" },
      { tr: "semâ", en: "sama'", ar: "سَمَاع" },
      { tr: "hâfız", en: "hafiz", ar: "حَافِظ" },
      { tr: "munkatı", en: "munqati'", ar: "مُنْقَطِع" },
      { tr: "tedlîs", en: "tadlis", ar: "تَدْلِيس" },
    ],
  },
];
