import type { Kelime } from "./DilAntrenmani";

/* DİL ANTRENMANI — kelime havuzları.

   İki küme var, ikisi de 20 seviye: `B1_SEVIYELERI` (Oxford B1) ve
   `HADIS_SEVIYELERI` (hadis ilminin ıstılahları). Kümeler
   `DilAntrenmaniHub` içinde `KUMELER` dizisinden bağlanıyor.

   HER SEVİYE TAM ALTI KELİME TUTUYOR ve o altısı hep aynı. Tahta 5x5 =
   25 kart, 6 kelime × 3 dil + 7 joker tam oturuyor.

   Önceden seviyeler ONAR kelimeydi ve tahtaya her dağıtımda rastgele
   altısı çıkıyordu; Mustafâ 2026-09-02'de kaldırttı: "seviye içi kelime
   değişimi istemiyorum". Kelime kaybı olmasın diye seviye sayısı 12'den
   20'ye çıktı, 240 kelimenin hepsi yerinde. Bölme sırayı korudu, yani
   temalar seviyeler arasında bölünmüş olabilir; `tema` alanı zaten
   yalnızca kod tarafı için, ekranda "Seviye N" yazıyor.

   Kelime ya da seviye sayısını değiştirirsen `DilAntrenmani.tsx`
   içindeki `KELIME_SAYISI` / `JOKER_SAYISI` ile tahtanın 5 sütunlu
   ızgarası da elden geçmeli.

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
   3. AYNI SEVİYEDEKİ ALTI KELİME BİRBİRİNE KARIŞMAYACAK. "prens" ile
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

/* A1 ve A2 HAVUZLARI — 12'şer seviye, altışar kelime.

   Kaynak `oxford-A1.csv` (901 kelime) ve `oxford-A2.csv` (800 kelime).
   Seçim ölçütleri B1 havuzuyla aynı: tek anlamlı olacak, türü sabit
   olacak (yalnız isim ve sıfat, fiil yok) ve aynı seviyedeki altı
   kelime birbirine karışmayacak.

   Bu iki havuzda İNGİLİZCE İLE TÜRKÇENİN AYNI OLMAMASINA ayrıca dikkat
   edildi. "pilot / pilot / طَيَّار" gibi bir kart eşleşmeyi kendiliğinden
   ele veriyor -- Türkçeye İngilizceden geçmiş kelimeler (pilot,
   profesör, sekreter, dedektif) bu yüzden listeye alınmadı, yerlerine
   "yazar / author" gibi ayrı duran çiftler kondu.

   Seviye içi karışma bir script'le tarandı (Arapça 3-gram, Türkçe
   4-gram, İngilizce 7-gram ortaklığı). Yakalanan iki çift ayrıldı:
   "öğrenci / öğretmen" (Türkçede aynı kök) ve "orman / bulut"
   (غَابَة ile سَحَابَة sonu aynı görünüyor). */
export const A1_SEVIYELERI: Seviye[] = [
  {
    tema: "Aile",
    kelimeler: [
      { tr: "anne", en: "mother", ar: "أُمّ" },
      { tr: "baba", en: "father", ar: "أَب" },
      { tr: "oğul", en: "son", ar: "اِبْن" },
      { tr: "teyze", en: "aunt", ar: "خَالَة" },
      { tr: "çocuk", en: "child", ar: "طِفْل" },
      { tr: "aile", en: "family", ar: "عَائِلَة" },
    ],
  },
  {
    tema: "Ev",
    kelimeler: [
      { tr: "kapı", en: "door", ar: "بَاب" },
      { tr: "pencere", en: "window", ar: "نَافِذَة" },
      { tr: "masa", en: "table", ar: "طَاوِلَة" },
      { tr: "sandalye", en: "chair", ar: "كُرْسِيّ" },
      { tr: "yatak", en: "bed", ar: "سَرِير" },
      { tr: "mutfak", en: "kitchen", ar: "مَطْبَخ" },
    ],
  },
  {
    tema: "Yiyecek",
    kelimeler: [
      { tr: "ekmek", en: "bread", ar: "خُبْز" },
      { tr: "peynir", en: "cheese", ar: "جُبْن" },
      { tr: "süt", en: "milk", ar: "حَلِيب" },
      { tr: "yumurta", en: "egg", ar: "بَيْضَة" },
      { tr: "pirinç", en: "rice", ar: "أَرُزّ" },
      { tr: "tuz", en: "salt", ar: "مِلْح" },
    ],
  },
  {
    tema: "Meyve ve sebze",
    kelimeler: [
      { tr: "elma", en: "apple", ar: "تُفَّاحَة" },
      { tr: "muz", en: "banana", ar: "مَوْزَة" },
      { tr: "patates", en: "potato", ar: "بَطَاطِس" },
      { tr: "havuç", en: "carrot", ar: "جَزَرَة" },
      { tr: "soğan", en: "onion", ar: "بَصَل" },
      { tr: "şeker", en: "sugar", ar: "سُكَّر" },
    ],
  },
  {
    tema: "Hayvanlar",
    kelimeler: [
      { tr: "kedi", en: "cat", ar: "قِطّ" },
      { tr: "köpek", en: "dog", ar: "كَلْب" },
      { tr: "kuş", en: "bird", ar: "طَائِر" },
      { tr: "at", en: "horse", ar: "حِصَان" },
      { tr: "balık", en: "fish", ar: "سَمَكَة" },
      { tr: "koyun", en: "sheep", ar: "خَرُوف" },
    ],
  },
  {
    tema: "Beden",
    kelimeler: [
      { tr: "baş", en: "head", ar: "رَأْس" },
      { tr: "göz", en: "eye", ar: "عَيْن" },
      { tr: "burun", en: "nose", ar: "أَنْف" },
      { tr: "kulak", en: "ear", ar: "أُذُن" },
      { tr: "ağız", en: "mouth", ar: "فَم" },
      { tr: "el", en: "hand", ar: "يَد" },
    ],
  },
  {
    tema: "Şehir",
    kelimeler: [
      { tr: "şehir", en: "city", ar: "مَدِينَة" },
      { tr: "sokak", en: "street", ar: "شَارِع" },
      { tr: "hastane", en: "hospital", ar: "مُسْتَشْفَى" },
      { tr: "otel", en: "hotel", ar: "فُنْدُق" },
      { tr: "pazar", en: "market", ar: "سُوق" },
      { tr: "köy", en: "village", ar: "قَرْيَة" },
    ],
  },
  {
    tema: "Okul",
    kelimeler: [
      { tr: "öğrenci", en: "student", ar: "طَالِب" },
      { tr: "sözlük", en: "dictionary", ar: "قَامُوس" },
      { tr: "kitap", en: "book", ar: "كِتَاب" },
      { tr: "kalem", en: "pen", ar: "قَلَم" },
      { tr: "kâğıt", en: "paper", ar: "وَرَق" },
      { tr: "soru", en: "question", ar: "سُؤَال" },
    ],
  },
  {
    tema: "Zaman",
    kelimeler: [
      { tr: "gün", en: "day", ar: "يَوْم" },
      { tr: "hafta", en: "week", ar: "أُسْبُوع" },
      { tr: "ay", en: "month", ar: "شَهْر" },
      { tr: "yıl", en: "year", ar: "سَنَة" },
      { tr: "sabah", en: "morning", ar: "صَبَاح" },
      { tr: "gece", en: "night", ar: "لَيْل" },
    ],
  },
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "güneş", en: "sun", ar: "شَمْس" },
      { tr: "deniz", en: "sea", ar: "بَحْر" },
      { tr: "nehir", en: "river", ar: "نَهْر" },
      { tr: "dağ", en: "mountain", ar: "جَبَل" },
      { tr: "ağaç", en: "tree", ar: "شَجَرَة" },
      { tr: "çiçek", en: "flower", ar: "زَهْرَة" },
    ],
  },
  {
    tema: "Renkler",
    kelimeler: [
      { tr: "siyah", en: "black", ar: "أَسْوَد" },
      { tr: "beyaz", en: "white", ar: "أَبْيَض" },
      { tr: "kırmızı", en: "red", ar: "أَحْمَر" },
      { tr: "yeşil", en: "green", ar: "أَخْضَر" },
      { tr: "sarı", en: "yellow", ar: "أَصْفَر" },
      { tr: "mavi", en: "blue", ar: "أَزْرَق" },
    ],
  },
  {
    tema: "Sıfatlar",
    kelimeler: [
      { tr: "büyük", en: "big", ar: "كَبِير" },
      { tr: "küçük", en: "small", ar: "صَغِير" },
      { tr: "yeni", en: "new", ar: "جَدِيد" },
      { tr: "eski", en: "old", ar: "قَدِيم" },
      { tr: "uzun", en: "long", ar: "طَوِيل" },
      { tr: "kısa", en: "short", ar: "قَصِير" },
    ],
  },
];

export const A2_SEVIYELERI: Seviye[] = [
  {
    tema: "Beden",
    kelimeler: [
      { tr: "kalp", en: "heart", ar: "قَلْب" },
      { tr: "beyin", en: "brain", ar: "دِمَاغ" },
      { tr: "kemik", en: "bone", ar: "عَظْم" },
      { tr: "omuz", en: "shoulder", ar: "كَتِف" },
      { tr: "diz", en: "knee", ar: "رُكْبَة" },
      { tr: "boyun", en: "neck", ar: "رَقَبَة" },
    ],
  },
  {
    tema: "Sağlık",
    kelimeler: [
      { tr: "kan", en: "blood", ar: "دَم" },
      { tr: "hastalık", en: "illness", ar: "مَرَض" },
      { tr: "ilaç", en: "medicine", ar: "دَوَاء" },
      { tr: "ağrı", en: "pain", ar: "أَلَم" },
      { tr: "yaralanma", en: "injury", ar: "إِصَابَة" },
      { tr: "sıcaklık", en: "temperature", ar: "حَرَارَة" },
    ],
  },
  {
    tema: "Mutfak",
    kelimeler: [
      { tr: "çatal", en: "fork", ar: "شَوْكَة" },
      { tr: "kaşık", en: "spoon", ar: "مِلْعَقَة" },
      { tr: "bıçak", en: "knife", ar: "سِكِّين" },
      { tr: "tabak", en: "plate", ar: "صَحْن" },
      { tr: "kâse", en: "bowl", ar: "وِعَاء" },
      { tr: "fırın", en: "oven", ar: "فُرْن" },
    ],
  },
  {
    tema: "Ev eşyası",
    kelimeler: [
      { tr: "halı", en: "carpet", ar: "سَجَّادَة" },
      { tr: "ayna", en: "mirror", ar: "مِرْآة" },
      { tr: "lamba", en: "lamp", ar: "مِصْبَاح" },
      { tr: "dolap", en: "cupboard", ar: "خِزَانَة" },
      { tr: "havlu", en: "towel", ar: "مِنْشَفَة" },
      { tr: "sabun", en: "soap", ar: "صَابُون" },
    ],
  },
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "orman", en: "forest", ar: "غَابَة" },
      { tr: "göl", en: "lake", ar: "بُحَيْرَة" },
      { tr: "tepe", en: "hill", ar: "تَلّ" },
      { tr: "çöl", en: "desert", ar: "صَحْرَاء" },
      { tr: "taş", en: "stone", ar: "حَجَر" },
      { tr: "okyanus", en: "ocean", ar: "مُحِيط" },
    ],
  },
  {
    tema: "Gökyüzü",
    kelimeler: [
      { tr: "gökyüzü", en: "sky", ar: "سَمَاء" },
      { tr: "fırtına", en: "storm", ar: "عَاصِفَة" },
      { tr: "ay", en: "moon", ar: "قَمَر" },
      { tr: "gezegen", en: "planet", ar: "كَوْكَب" },
      { tr: "dalga", en: "wave", ar: "مَوْجَة" },
      { tr: "bulut", en: "cloud", ar: "سَحَابَة" },
    ],
  },
  {
    tema: "Yapılar",
    kelimeler: [
      { tr: "köprü", en: "bridge", ar: "جِسْر" },
      { tr: "kule", en: "tower", ar: "بُرْج" },
      { tr: "saray", en: "palace", ar: "قَصْر" },
      { tr: "kale", en: "castle", ar: "قَلْعَة" },
      { tr: "kilise", en: "church", ar: "كَنِيسَة" },
      { tr: "çatı", en: "roof", ar: "سَقْف" },
    ],
  },
  {
    tema: "Ulaşım",
    kelimeler: [
      { tr: "kamyon", en: "truck", ar: "شَاحِنَة" },
      { tr: "gemi", en: "ship", ar: "سَفِينَة" },
      { tr: "tekerlek", en: "wheel", ar: "عَجَلَة" },
      { tr: "motor", en: "engine", ar: "مُحَرِّك" },
      { tr: "yolcu", en: "passenger", ar: "رَاكِب" },
      { tr: "peron", en: "platform", ar: "رَصِيف" },
    ],
  },
  {
    tema: "Devlet",
    kelimeler: [
      { tr: "ordu", en: "army", ar: "جَيْش" },
      { tr: "asker", en: "soldier", ar: "جُنْدِيّ" },
      { tr: "kral", en: "king", ar: "مَلِك" },
      { tr: "hükümet", en: "government", ar: "حُكُومَة" },
      { tr: "hapishane", en: "prison", ar: "سِجْن" },
      { tr: "avukat", en: "lawyer", ar: "مُحَامِي" },
    ],
  },
  {
    tema: "Meslekler",
    kelimeler: [
      { tr: "şef", en: "chef", ar: "طَبَّاخ" },
      { tr: "yazar", en: "author", ar: "مُؤَلِّف" },
      { tr: "mühendis", en: "engineer", ar: "مُهَنْدِس" },
      { tr: "gazeteci", en: "journalist", ar: "صَحَفِيّ" },
      { tr: "ressam", en: "painter", ar: "رَسَّام" },
      { tr: "müzisyen", en: "musician", ar: "مُوسِيقِيّ" },
    ],
  },
  {
    tema: "Eşya",
    kelimeler: [
      { tr: "düğme", en: "button", ar: "زِرّ" },
      { tr: "kemer", en: "belt", ar: "حِزَام" },
      { tr: "çorap", en: "sock", ar: "جَوْرَب" },
      { tr: "takı", en: "jewellery", ar: "حُلِيّ" },
      { tr: "oyuncak", en: "toy", ar: "لُعْبَة" },
      { tr: "pul", en: "stamp", ar: "طَابَع" },
    ],
  },
  {
    tema: "Sıfatlar",
    kelimeler: [
      { tr: "ağır", en: "heavy", ar: "ثَقِيل" },
      { tr: "kalın", en: "thick", ar: "سَمِيك" },
      { tr: "derin", en: "deep", ar: "عَمِيق" },
      { tr: "dar", en: "narrow", ar: "ضَيِّق" },
      { tr: "geniş", en: "wide", ar: "وَاسِع" },
      { tr: "boş", en: "empty", ar: "فَارِغ" },
    ],
  },
];

export const B1_SEVIYELERI: Seviye[] = [
  {
    tema: "Nesneler I",
    kelimeler: [
      { tr: "zil", en: "bell", ar: "جَرَس" },
      { tr: "dal", en: "branch", ar: "غُصْن" },
      { tr: "perde", en: "curtain", ar: "سِتَارَة" },
      { tr: "bayrak", en: "flag", ar: "عَلَم" },
      { tr: "tohum", en: "seed", ar: "بَذْرَة" },
      { tr: "iğne", en: "needle", ar: "إِبْرَة" },
    ],
  },
  {
    tema: "Nesneler II",
    kelimeler: [
      { tr: "şiir", en: "poem", ar: "قَصِيدَة" },
      { tr: "kum", en: "sand", ar: "رَمْل" },
      { tr: "çadır", en: "tent", ar: "خَيْمَة" },
      { tr: "kanat", en: "wing", ar: "جَنَاح" },
      { tr: "tavan", en: "ceiling", ar: "سَقْف" },
      { tr: "raf", en: "shelf", ar: "رَفّ" },
    ],
  },
  {
    tema: "Ev ve eşya",
    kelimeler: [
      { tr: "ip", en: "rope", ar: "حَبْل" },
      { tr: "tencere", en: "pot", ar: "قِدْر" },
      { tr: "tava", en: "pan", ar: "مِقْلَاة" },
      { tr: "boru", en: "pipe", ar: "أُنْبُوب" },
      { tr: "zincir", en: "chain", ar: "سِلْسِلَة" },
      { tr: "çit", en: "fence", ar: "سِيَاج" },
    ],
  },
  {
    tema: "İnsanlar I",
    kelimeler: [
      { tr: "kulübe", en: "cottage", ar: "كُوخ" },
      { tr: "avlu", en: "yard", ar: "فِنَاء" },
      { tr: "gelin", en: "bride", ar: "عَرُوس" },
      { tr: "denizci", en: "sailor", ar: "بَحَّار" },
      { tr: "şair", en: "poet", ar: "شَاعِر" },
      { tr: "rahip", en: "priest", ar: "قِسِّيس" },
    ],
  },
  {
    tema: "İnsanlar II",
    kelimeler: [
      { tr: "prens", en: "prince", ar: "أَمِير" },
      { tr: "hizmetçi", en: "servant", ar: "خَادِم" },
      { tr: "yabancı", en: "stranger", ar: "غَرِيب" },
      { tr: "mahkûm", en: "prisoner", ar: "سَجِين" },
      { tr: "düşman", en: "enemy", ar: "عَدُوّ" },
      { tr: "kurban", en: "victim", ar: "ضَحِيَّة" },
    ],
  },
  {
    tema: "Beden ve giyim I",
    kelimeler: [
      { tr: "göğüs", en: "chest", ar: "صَدْر" },
      { tr: "dudak", en: "lip", ar: "شَفَة" },
      { tr: "boğaz", en: "throat", ar: "حَلْق" },
      { tr: "kas", en: "muscle", ar: "عَضَلَة" },
      { tr: "eldiven", en: "glove", ar: "قُفَّاز" },
      { tr: "şapka", en: "cap", ar: "قُبَّعَة" },
    ],
  },
  {
    tema: "Beden ve giyim II",
    kelimeler: [
      { tr: "yün", en: "wool", ar: "صُوف" },
      { tr: "pamuk", en: "cotton", ar: "قُطْن" },
      { tr: "kumaş", en: "cloth", ar: "قُمَاش" },
      { tr: "deri", en: "leather", ar: "جِلْد" },
      { tr: "arı", en: "bee", ar: "نَحْلَة" },
      { tr: "çamur", en: "mud", ar: "طِين" },
    ],
  },
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "toprak", en: "soil", ar: "تُرْبَة" },
      { tr: "toz", en: "dust", ar: "غُبَار" },
      { tr: "kömür", en: "coal", ar: "فَحْم" },
      { tr: "elmas", en: "diamond", ar: "مَاس" },
      { tr: "deprem", en: "earthquake", ar: "زِلْزَال" },
      { tr: "kürk", en: "fur", ar: "فَرْو" },
    ],
  },
  {
    tema: "Sanat ve sahne I",
    kelimeler: [
      { tr: "deniz kabuğu", en: "shell", ar: "صَدَفَة" },
      { tr: "kır", en: "countryside", ar: "رِيف" },
      { tr: "davul", en: "drum", ar: "طَبْل" },
      { tr: "heykel", en: "statue", ar: "تِمْثَال" },
      { tr: "dergi", en: "journal", ar: "مَجَلَّة" },
      { tr: "edebiyat", en: "literature", ar: "أَدَب" },
    ],
  },
  {
    tema: "Sanat ve sahne II",
    kelimeler: [
      { tr: "gösteri", en: "performance", ar: "عَرْض" },
      { tr: "stadyum", en: "stadium", ar: "مَلْعَب" },
      { tr: "tören", en: "ceremony", ar: "اِحْتِفَال" },
      { tr: "bant", en: "tape", ar: "شَرِيط" },
      { tr: "sicim", en: "string", ar: "خَيْط" },
      { tr: "hayalet", en: "ghost", ar: "شَبَح" },
    ],
  },
  {
    tema: "Duygular I",
    kelimeler: [
      { tr: "mutluluk", en: "happiness", ar: "سَعَادَة" },
      { tr: "güzellik", en: "beauty", ar: "جَمَال" },
      { tr: "dostluk", en: "friendship", ar: "صَدَاقَة" },
      { tr: "tutku", en: "passion", ar: "شَغَف" },
      { tr: "zevk", en: "pleasure", ar: "مُتْعَة" },
      { tr: "dehşet", en: "horror", ar: "رُعْب" },
    ],
  },
  {
    tema: "Duygular II",
    kelimeler: [
      { tr: "saygı", en: "respect", ar: "اِحْتِرَام" },
      { tr: "duygu", en: "emotion", ar: "شُعُور" },
      { tr: "zekâ", en: "intelligence", ar: "ذَكَاء" },
      { tr: "gençlik", en: "youth", ar: "شَبَاب" },
      { tr: "millet", en: "nation", ar: "أُمَّة" },
      { tr: "birlik", en: "union", ar: "اِتِّحَاد" },
    ],
  },
  {
    tema: "Toplum",
    kelimeler: [
      { tr: "seçim", en: "election", ar: "اِنْتِخَاب" },
      { tr: "aday", en: "candidate", ar: "مُرَشَّح" },
      { tr: "mahkeme", en: "court", ar: "مَحْكَمَة" },
      { tr: "ceza", en: "punishment", ar: "عِقَاب" },
      { tr: "din", en: "religion", ar: "دِين" },
      { tr: "dua", en: "prayer", ar: "دُعَاء" },
    ],
  },
  {
    tema: "Hayat I",
    kelimeler: [
      { tr: "gelenek", en: "custom", ar: "عَادَة" },
      { tr: "kimlik", en: "identity", ar: "هُوِيَّة" },
      { tr: "çocukluk", en: "childhood", ar: "طُفُولَة" },
      { tr: "evlilik", en: "marriage", ar: "زَوَاج" },
      { tr: "nesil", en: "generation", ar: "جِيل" },
      { tr: "ruh", en: "spirit", ar: "رُوح" },
    ],
  },
  {
    tema: "Hayat II",
    kelimeler: [
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
    ],
  },
  {
    tema: "Bilim ve ölçü I",
    kelimeler: [
      { tr: "pil", en: "battery", ar: "بَطَّارِيَّة" },
      { tr: "emniyet", en: "safety", ar: "أَمَان" },
      { tr: "sınır", en: "border", ar: "حُدُود" },
      { tr: "giriş", en: "entrance", ar: "مَدْخَل" },
      { tr: "katman", en: "layer", ar: "طَبَقَة" },
      { tr: "uzunluk", en: "length", ar: "طُول" },
    ],
  },
  {
    tema: "Bilim ve ölçü II",
    kelimeler: [
      { tr: "basınç", en: "pressure", ar: "ضَغْط" },
      { tr: "madde", en: "substance", ar: "مَادَّة" },
      { tr: "kuram", en: "theory", ar: "نَظَرِيَّة" },
      { tr: "laboratuvar", en: "laboratory", ar: "مُخْتَبَر" },
      { tr: "güç", en: "strength", ar: "قُوَّة" },
      { tr: "görev", en: "duty", ar: "وَاجِب" },
    ],
  },
  {
    tema: "Sıfatlar I",
    kelimeler: [
      { tr: "lastik", en: "tyre", ar: "إِطَار" },
      { tr: "ağ", en: "net", ar: "شَبَكَة" },
      { tr: "cesur", en: "brave", ar: "شُجَاع" },
      { tr: "cömert", en: "generous", ar: "كَرِيم" },
      { tr: "dürüst", en: "honest", ar: "صَادِق" },
      { tr: "utangaç", en: "shy", ar: "خَجُول" },
    ],
  },
  {
    tema: "Sıfatlar II",
    kelimeler: [
      { tr: "yalnız", en: "lonely", ar: "وَحِيد" },
      { tr: "keskin", en: "sharp", ar: "حَادّ" },
      { tr: "pürüzsüz", en: "smooth", ar: "نَاعِم" },
      { tr: "parlak", en: "shiny", ar: "لَامِع" },
      { tr: "sessiz", en: "silent", ar: "صَامِت" },
      { tr: "çirkin", en: "ugly", ar: "قَبِيح" },
    ],
  },
];

/* HADİSLE İLGİLİ KELİMELER — yirmi seviye.

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
    tema: "İsnâd ve nakil I",
    kelimeler: [
      { tr: "sahih", en: "authentic", ar: "صَحِيح" },
      { tr: "isnâd", en: "chain", ar: "إِسْنَاد" },
      { tr: "râvi", en: "transmitter", ar: "رَاوٍ" },
      { tr: "metin", en: "text", ar: "مَتْن" },
      { tr: "sahâbî", en: "Companion", ar: "صَحَابِيّ" },
      { tr: "tâbiî", en: "Successor", ar: "تَابِعِيّ" },
    ],
  },
  {
    tema: "İsnâd ve nakil II",
    kelimeler: [
      { tr: "tabaka", en: "generation", ar: "طَبَقَة" },
      { tr: "tarîk", en: "strand", ar: "طَرِيق" },
      { tr: "muhaddis", en: "traditionist", ar: "مُحَدِّث" },
      { tr: "şâhid", en: "corroboration", ar: "شَاهِد" },
      { tr: "hadis", en: "report", ar: "حَدِيث" },
      { tr: "hasen", en: "fair", ar: "حَسَن" },
    ],
  },
  {
    tema: "Sıhhat ve tenkit I",
    kelimeler: [
      { tr: "tek râvili tarîk", en: "single strand", ar: "طَرِيق مُفْرَد" },
      { tr: "mevzû", en: "forgery", ar: "مَوْضُوع" },
      { tr: "illet", en: "defect", ar: "عِلَّة" },
      { tr: "sika", en: "reliable", ar: "ثِقَة" },
      { tr: "adâlet", en: "uprightness", ar: "عَدَالَة" },
      { tr: "zabt", en: "accuracy", ar: "ضَبْط" },
    ],
  },
  {
    tema: "Sıhhat ve tenkit II",
    kelimeler: [
      { tr: "cerh", en: "impugnment", ar: "جَرْح" },
      { tr: "ta'dîl", en: "accreditation", ar: "تَعْدِيل" },
      { tr: "müşterek râvi", en: "common link", ar: "مَدَار" },
      { tr: "örümcek", en: "spider", ar: "عَنْكَبُوت" },
      { tr: "dalış", en: "dive", ar: "غَوْص" },
      { tr: "zayıf", en: "weak", ar: "ضَعِيف" },
    ],
  },
  {
    tema: "Batı'da hadis çalışmaları",
    kelimeler: [
      { tr: "isnâd kümesi", en: "isnad bundle", ar: "حُزْمَة أَسَانِيد" },
      { tr: "geriye doğru büyüme", en: "backward growth", ar: "النُّمُوّ الْعَكْسِيّ" },
      { tr: "müsteşrik", en: "orientalist", ar: "مُسْتَشْرِق" },
      { tr: "tarihlendirme", en: "dating", ar: "تَأْرِيخ" },
      { tr: "uydurma", en: "fabrication", ar: "وَضْع" },
      { tr: "hadis tenkidi", en: "hadith criticism", ar: "نَقْد الْحَدِيث" },
    ],
  },
  {
    tema: "Tahammül ve edâ I",
    kelimeler: [
      { tr: "semâ", en: "audition", ar: "سَمَاع" },
      { tr: "kırâat", en: "recitation", ar: "قِرَاءَة" },
      { tr: "icâzet", en: "licence", ar: "إِجَازَة" },
      { tr: "münâvele", en: "handing over", ar: "مُنَاوَلَة" },
      { tr: "mükâtebe", en: "correspondence", ar: "مُكَاتَبَة" },
      { tr: "vicâde", en: "finding", ar: "وِجَادَة" },
    ],
  },
  {
    tema: "Tahammül ve edâ II",
    kelimeler: [
      { tr: "i'lâm", en: "notification", ar: "إِعْلَام" },
      { tr: "vasiyet", en: "bequest", ar: "وَصِيَّة" },
      { tr: "tahammül", en: "reception", ar: "تَحَمُّل" },
      { tr: "rihle", en: "journey", ar: "رِحْلَة" },
      { tr: "tasnif", en: "compilation", ar: "تَصْنِيف" },
      { tr: "şerh", en: "commentary", ar: "شَرْح" },
    ],
  },
  {
    tema: "Kitaplar ve âlimler",
    kelimeler: [
      { tr: "muhtasar", en: "abridgement", ar: "مُخْتَصَر" },
      { tr: "nüsha", en: "recension", ar: "نُسْخَة" },
      { tr: "sahîfe", en: "scroll", ar: "صَحِيفَة" },
      { tr: "Kütüb-i Sitte", en: "the Six Books", ar: "الْكُتُب السِّتَّة" },
      { tr: "ricâl", en: "biographies", ar: "رِجَال" },
      { tr: "bâb", en: "chapter", ar: "بَاب" },
    ],
  },
  {
    tema: "Metin ve muhteva I",
    kelimeler: [
      { tr: "mukaddime", en: "introduction", ar: "مُقَدِّمَة" },
      { tr: "hâfız", en: "memoriser", ar: "حَافِظ" },
      { tr: "tevâtür", en: "mass transmission", ar: "تَوَاتُر" },
      { tr: "haber-i vâhid", en: "solitary report", ar: "خَبَر الْوَاحِد" },
      { tr: "ziyade", en: "addition", ar: "زِيَادَة" },
      { tr: "ihtilâf", en: "divergence", ar: "اِخْتِلَاف" },
    ],
  },
  {
    tema: "Metin ve muhteva II",
    kelimeler: [
      { tr: "nesih", en: "abrogation", ar: "نَسْخ" },
      { tr: "te'vil", en: "interpretation", ar: "تَأْوِيل" },
      { tr: "mütâbi", en: "parallel", ar: "مُتَابِع" },
      { tr: "garîb", en: "rare", ar: "غَرِيب" },
      { tr: "müdrec", en: "interpolation", ar: "مُدْرَج" },
      { tr: "mânâ rivayeti", en: "paraphrase", ar: "رِوَايَة بِالْمَعْنَى" },
    ],
  },
  {
    tema: "Râvi tenkidi I",
    kelimeler: [
      { tr: "ittisâl", en: "continuity", ar: "اِتِّصَال" },
      { tr: "metrûk", en: "abandoned", ar: "مَتْرُوك" },
      { tr: "müttehem", en: "accused", ar: "مُتَّهَم" },
      { tr: "kezzâb", en: "liar", ar: "كَذَّاب" },
      { tr: "sadûk", en: "truthful", ar: "صَدُوق" },
      { tr: "hüccet", en: "proof", ar: "حُجَّة" },
    ],
  },
  {
    tema: "Râvi tenkidi II",
    kelimeler: [
      { tr: "imam", en: "authority", ar: "إِمَام" },
      { tr: "mestûr", en: "obscure", ar: "مَسْتُور" },
      { tr: "mübhem", en: "unnamed", ar: "مُبْهَم" },
      { tr: "muhtelit", en: "confused", ar: "مُخْتَلِط" },
      { tr: "inkıtâ", en: "discontinuity", ar: "اِنْقِطَاع" },
      { tr: "mecrûh", en: "discredited", ar: "مَجْرُوح" },
    ],
  },
  {
    tema: "İsnâd kusurları",
    kelimeler: [
      { tr: "tedlîs", en: "concealment", ar: "تَدْلِيس" },
      { tr: "kalb", en: "inversion", ar: "قَلْب" },
      { tr: "tashîf", en: "misreading", ar: "تَصْحِيف" },
      { tr: "ıztırâb", en: "inconsistency", ar: "اِضْطِرَاب" },
      { tr: "şüzûz", en: "anomaly", ar: "شُذُوذ" },
      { tr: "vehim", en: "error", ar: "وَهْم" },
    ],
  },
  {
    tema: "Erken dönem I",
    kelimeler: [
      { tr: "cehâlet", en: "anonymity", ar: "جَهَالَة" },
      { tr: "teferrüd", en: "singularity", ar: "تَفَرُّد" },
      { tr: "hicret", en: "emigration", ar: "هِجْرَة" },
      { tr: "sünnet", en: "precedent", ar: "سُنَّة" },
      { tr: "bid'at", en: "innovation", ar: "بِدْعَة" },
      { tr: "fitne", en: "civil strife", ar: "فِتْنَة" },
    ],
  },
  {
    tema: "Erken dönem II",
    kelimeler: [
      { tr: "mezhep", en: "school", ar: "مَذْهَب" },
      { tr: "re'y", en: "opinion", ar: "رَأْي" },
      { tr: "fıkıh", en: "jurisprudence", ar: "فِقْه" },
      { tr: "kelâm", en: "theology", ar: "كَلَام" },
      { tr: "tefsir", en: "exegesis", ar: "تَفْسِير" },
      { tr: "megâzî", en: "campaigns", ar: "مَغَازِي" },
    ],
  },
  {
    tema: "Modern hadis çalışmaları",
    kelimeler: [
      { tr: "kısmî müşterek râvi", en: "partial common link", ar: "مَدَار جُزْئِيّ" },
      { tr: "isnâdların yayılması", en: "spread of isnads", ar: "اِنْتِشَار الْأَسَانِيد" },
      { tr: "şifahî nakil", en: "oral transmission", ar: "نَقْل شَفَوِيّ" },
      { tr: "otantiklik", en: "authenticity", ar: "أَصَالَة" },
      { tr: "şüphecilik", en: "scepticism", ar: "شَكّ" },
      { tr: "tabakat", en: "prosopography", ar: "طَبَقَات" },
    ],
  },
  {
    tema: "İsim ve kimlik I",
    kelimeler: [
      { tr: "doğum", en: "birth", ar: "مَوْلِد" },
      { tr: "nâkid", en: "critic", ar: "نَاقِد" },
      { tr: "kaynak", en: "source", ar: "مَصْدَر" },
      { tr: "tarihsellik", en: "historicity", ar: "تَارِيخِيَّة" },
      { tr: "künye", en: "teknonym", ar: "كُنْيَة" },
      { tr: "lakap", en: "epithet", ar: "لَقَب" },
    ],
  },
  {
    tema: "İsim ve kimlik II",
    kelimeler: [
      { tr: "nesep", en: "lineage", ar: "نَسَب" },
      { tr: "mevlâ", en: "client", ar: "مَوْلَى" },
      { tr: "kabile", en: "tribe", ar: "قَبِيلَة" },
      { tr: "vefat", en: "death", ar: "وَفَاة" },
      { tr: "metin tenkidi", en: "textual criticism", ar: "نَقْد الْمَتْن" },
      { tr: "hoca", en: "teacher", ar: "شَيْخ" },
    ],
  },
  {
    tema: "Rivayet ve amel I",
    kelimeler: [
      { tr: "talebe", en: "student", ar: "تِلْمِيذ" },
      { tr: "muâsır", en: "contemporary", ar: "مُعَاصِر" },
      { tr: "amel", en: "practice", ar: "عَمَل" },
      { tr: "ihticâc", en: "argumentation", ar: "اِحْتِجَاج" },
      { tr: "maslahat", en: "public interest", ar: "مَصْلَحَة" },
      { tr: "hüküm", en: "ruling", ar: "حُكْم" },
    ],
  },
  {
    tema: "Rivayet ve amel II",
    kelimeler: [
      { tr: "delil", en: "evidence", ar: "دَلِيل" },
      { tr: "icmâ", en: "consensus", ar: "إِجْمَاع" },
      { tr: "kıyas", en: "analogy", ar: "قِيَاس" },
      { tr: "ruhsat", en: "dispensation", ar: "رُخْصَة" },
      { tr: "azimet", en: "strictness", ar: "عَزِيمَة" },
      { tr: "fetva", en: "responsum", ar: "فَتْوَى" },
    ],
  },
];
