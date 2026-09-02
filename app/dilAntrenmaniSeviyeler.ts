import type { Kelime } from "./DilAntrenmani";

/* DİL ANTRENMANI — kelime havuzları.

   ALTI KÜME, HER BİRİ 24 SEVİYE, 144 KELİME -- toplam 864 kelime.
   Oxford katmanları `A1_SEVIYELERI`, `A2_SEVIYELERI`, `B1_SEVIYELERI`,
   `B2_SEVIYELERI`, `C1_SEVIYELERI`; bir de `HADIS_SEVIYELERI`. Kümeler
   `DilAntrenmaniHub` içinde `KUMELER` dizisinden bağlanıyor.

   Seviye sayıları 2026-09-02'de eşitlendi (Mustafâ: "bütün
   kategorilerde seviye sayısını 24'e çıkar"). Yeni seviyeler dizilerin
   SONUNA eklendi, araya girmedi -- bu yüzden ilerleme anahtarını
   ilerletmek gerekmedi, eski indisler hâlâ aynı seviyeleri gösteriyor.

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

/* A1 ve A2 HAVUZLARI — 24'er seviye, altışar kelime.

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
  {
    tema: "Ev 2",
    kelimeler: [
      { tr: "banyo", en: "bathroom", ar: "حَمَّام" },
      { tr: "oda", en: "room", ar: "غُرْفَة" },
      { tr: "bahçe", en: "garden", ar: "حَدِيقَة" },
      { tr: "duvar", en: "wall", ar: "جِدَار" },
      { tr: "zemin", en: "floor", ar: "أَرْضِيَّة" },
      { tr: "anahtar", en: "key", ar: "مِفْتَاح" },
    ],
  },
  {
    tema: "Giyim",
    kelimeler: [
      { tr: "gömlek", en: "shirt", ar: "قَمِيص" },
      { tr: "ayakkabı", en: "shoe", ar: "حِذَاء" },
      { tr: "etek", en: "skirt", ar: "تَنُّورَة" },
      { tr: "ceket", en: "jacket", ar: "سُتْرَة" },
      { tr: "şapka", en: "hat", ar: "قُبَّعَة" },
      { tr: "palto", en: "coat", ar: "مِعْطَف" },
    ],
  },
  {
    tema: "İçecek",
    kelimeler: [
      { tr: "su", en: "water", ar: "مَاء" },
      { tr: "çay", en: "tea", ar: "شَاي" },
      { tr: "kahve", en: "coffee", ar: "قَهْوَة" },
      { tr: "meyve", en: "fruit", ar: "فَاكِهَة" },
      { tr: "et", en: "meat", ar: "لَحْم" },
      { tr: "çorba", en: "soup", ar: "شُورْبَة" },
    ],
  },
  {
    tema: "Okul 2",
    kelimeler: [
      { tr: "sınıf", en: "classroom", ar: "فَصْل" },
      { tr: "ders", en: "lesson", ar: "دَرْس" },
      { tr: "sınav", en: "exam", ar: "اِمْتِحَان" },
      { tr: "not", en: "note", ar: "مُلَاحَظَة" },
      { tr: "üniversite", en: "university", ar: "جَامِعَة" },
      { tr: "kütüphane", en: "library", ar: "مَكْتَبَة" },
    ],
  },
  {
    tema: "İş ve para",
    kelimeler: [
      { tr: "para", en: "money", ar: "مَال" },
      { tr: "iş", en: "job", ar: "شُغْل" },
      { tr: "fiyat", en: "price", ar: "سِعْر" },
      { tr: "ofis", en: "office", ar: "مَكْتَب" },
      { tr: "dükkân", en: "shop", ar: "دُكَّان" },
      { tr: "müşteri", en: "customer", ar: "زَبُون" },
    ],
  },
  {
    tema: "Ulaşım",
    kelimeler: [
      { tr: "araba", en: "car", ar: "سَيَّارَة" },
      { tr: "otobüs", en: "bus", ar: "حَافِلَة" },
      { tr: "uçak", en: "plane", ar: "طَائِرَة" },
      { tr: "tren", en: "train", ar: "قِطَار" },
      { tr: "bisiklet", en: "bicycle", ar: "دَرَّاجَة" },
      { tr: "yol", en: "road", ar: "طَرِيق" },
    ],
  },
  {
    tema: "Doğa 2",
    kelimeler: [
      { tr: "ada", en: "island", ar: "جَزِيرَة" },
      { tr: "kar", en: "snow", ar: "ثَلْج" },
      { tr: "yağmur", en: "rain", ar: "مَطَر" },
      { tr: "hava", en: "weather", ar: "طَقْس" },
      { tr: "buz", en: "ice", ar: "جَلِيد" },
      { tr: "hayvan", en: "animal", ar: "حَيَوَان" },
    ],
  },
  {
    tema: "Beden 2",
    kelimeler: [
      { tr: "saç", en: "hair", ar: "شَعْر" },
      { tr: "diş", en: "tooth", ar: "سِنّ" },
      { tr: "ayak", en: "foot", ar: "قَدَم" },
      { tr: "bacak", en: "leg", ar: "سَاق" },
      { tr: "kol", en: "arm", ar: "ذِرَاع" },
      { tr: "yüz", en: "face", ar: "وَجْه" },
    ],
  },
  {
    tema: "Hayvanlar 2",
    kelimeler: [
      { tr: "aslan", en: "lion", ar: "أَسَد" },
      { tr: "fil", en: "elephant", ar: "فِيل" },
      { tr: "yılan", en: "snake", ar: "ثُعْبَان" },
      { tr: "inek", en: "cow", ar: "بَقَرَة" },
      { tr: "domuz", en: "pig", ar: "خِنْزِير" },
      { tr: "tavuk", en: "chicken", ar: "دَجَاجَة" },
    ],
  },
  {
    tema: "Zaman 2",
    kelimeler: [
      { tr: "dakika", en: "minute", ar: "دَقِيقَة" },
      { tr: "saat", en: "hour", ar: "سَاعَة" },
      { tr: "akşam", en: "evening", ar: "مَسَاء" },
      { tr: "yaz", en: "summer", ar: "صَيْف" },
      { tr: "kış", en: "winter", ar: "شِتَاء" },
      { tr: "asır", en: "century", ar: "قَرْن" },
    ],
  },
  {
    tema: "Sıfatlar 2",
    kelimeler: [
      { tr: "güzel", en: "beautiful", ar: "جَمِيل" },
      { tr: "kolay", en: "easy", ar: "سَهْل" },
      { tr: "zor", en: "difficult", ar: "صَعْب" },
      { tr: "sıcak", en: "hot", ar: "حَارّ" },
      { tr: "soğuk", en: "cold", ar: "بَارِد" },
      { tr: "temiz", en: "clean", ar: "نَظِيف" },
    ],
  },
  {
    tema: "Sıfatlar 3",
    kelimeler: [
      { tr: "mutlu", en: "happy", ar: "سَعِيد" },
      { tr: "üzgün", en: "sad", ar: "حَزِين" },
      { tr: "yorgun", en: "tired", ar: "تَعِب" },
      { tr: "aç", en: "hungry", ar: "جَائِع" },
      { tr: "zengin", en: "rich", ar: "غَنِيّ" },
      { tr: "fakir", en: "poor", ar: "فَقِير" },
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
  {
    tema: "Suç ve güvenlik",
    kelimeler: [
      { tr: "suç", en: "crime", ar: "جَرِيمَة" },
      { tr: "hırsız", en: "thief", ar: "لِصّ" },
      { tr: "silah", en: "gun", ar: "سِلَاح" },
      { tr: "tehlike", en: "danger", ar: "خَطَر" },
      { tr: "kaza", en: "accident", ar: "حَادِث" },
      { tr: "kanun", en: "law", ar: "قَانُون" },
    ],
  },
  {
    tema: "Bilim",
    kelimeler: [
      { tr: "bilgi", en: "knowledge", ar: "مَعْرِفَة" },
      { tr: "deney", en: "experiment", ar: "تَجْرِبَة" },
      { tr: "kimya", en: "chemistry", ar: "كِيمْيَاء" },
      { tr: "güç", en: "power", ar: "قُوَّة" },
      { tr: "gaz", en: "gas", ar: "غَاز" },
      { tr: "yağ", en: "oil", ar: "زَيْت" },
    ],
  },
  {
    tema: "Bilim 2",
    kelimeler: [
      { tr: "fizik", en: "physics", ar: "فِيزْيَاء" },
      { tr: "teknoloji", en: "technology", ar: "تِقْنِيَّة" },
      { tr: "çevre", en: "environment", ar: "بِيئَة" },
      { tr: "iklim", en: "climate", ar: "مُنَاخ" },
      { tr: "kirlilik", en: "pollution", ar: "تَلَوُّث" },
      { tr: "doğa", en: "nature", ar: "طَبِيعَة" },
    ],
  },
  {
    tema: "Toplum",
    kelimeler: [
      { tr: "toplum", en: "society", ar: "مُجْتَمَع" },
      { tr: "nüfus", en: "population", ar: "سُكَّان" },
      { tr: "seyirci", en: "audience", ar: "جُمْهُور" },
      { tr: "kalabalık", en: "crowd", ar: "حَشْد" },
      { tr: "barış", en: "peace", ar: "سَلَام" },
      { tr: "savaş", en: "war", ar: "حَرْب" },
    ],
  },
  {
    tema: "İş 2",
    kelimeler: [
      { tr: "yönetici", en: "manager", ar: "مُدِير" },
      { tr: "çalışan", en: "employee", ar: "مُوَظَّف" },
      { tr: "maaş", en: "salary", ar: "رَاتِب" },
      { tr: "fabrika", en: "factory", ar: "مَصْنَع" },
      { tr: "ekipman", en: "equipment", ar: "مُعَدَّات" },
      { tr: "hedef", en: "target", ar: "هَدَف" },
    ],
  },
  {
    tema: "Sanat",
    kelimeler: [
      { tr: "eğitim", en: "education", ar: "تَعْلِيم" },
      { tr: "roman", en: "novel", ar: "رِوَايَة" },
      { tr: "deneme", en: "essay", ar: "مَقَالَة" },
      { tr: "dizi", en: "series", ar: "مُسَلْسَل" },
      { tr: "sahne", en: "scene", ar: "مَشْهَد" },
      { tr: "sembol", en: "symbol", ar: "رَمْز" },
    ],
  },
  {
    tema: "Nesne 2",
    kelimeler: [
      { tr: "cep", en: "pocket", ar: "جَيْب" },
      { tr: "fırça", en: "brush", ar: "فُرْشَاة" },
      { tr: "çöp", en: "rubbish", ar: "قُمَامَة" },
      { tr: "alet", en: "tool", ar: "أَدَاة" },
      { tr: "cihaz", en: "device", ar: "جِهَاز" },
      { tr: "ekran", en: "screen", ar: "شَاشَة" },
    ],
  },
  {
    tema: "Yiyecek 2",
    kelimeler: [
      { tr: "sos", en: "sauce", ar: "صَلْصَة" },
      { tr: "fasulye", en: "bean", ar: "فَاصُولْيَا" },
      { tr: "limon", en: "lemon", ar: "لَيْمُون" },
      { tr: "bisküvi", en: "biscuit", ar: "بِسْكُوِيت" },
      { tr: "fındık", en: "nut", ar: "جَوْزَة" },
      { tr: "reçel", en: "jam", ar: "مُرَبَّى" },
    ],
  },
  {
    tema: "Duygu",
    kelimeler: [
      { tr: "korku", en: "fear", ar: "خَوْف" },
      { tr: "şans", en: "luck", ar: "حَظّ" },
      { tr: "alışkanlık", en: "habit", ar: "عَادَة" },
      { tr: "kahkaha", en: "laughter", ar: "ضَحِك" },
      { tr: "hatıra", en: "memory", ar: "ذَاكِرَة" },
      { tr: "rüya", en: "dream", ar: "حُلْم" },
    ],
  },
  {
    tema: "Sıfatlar 2",
    kelimeler: [
      { tr: "canlı", en: "alive", ar: "حَيّ" },
      { tr: "ölü", en: "dead", ar: "مَيِّت" },
      { tr: "gürültülü", en: "noisy", ar: "صَاخِب" },
      { tr: "tembel", en: "lazy", ar: "كَسُول" },
      { tr: "kibar", en: "polite", ar: "مُهَذَّب" },
      { tr: "kaba", en: "rude", ar: "وَقِح" },
    ],
  },
  {
    tema: "Sıfatlar 3",
    kelimeler: [
      { tr: "yabancı", en: "foreign", ar: "أَجْنَبِيّ" },
      { tr: "ulusal", en: "national", ar: "وَطَنِيّ" },
      { tr: "ciddi", en: "serious", ar: "جِدِّيّ" },
      { tr: "garip", en: "strange", ar: "غَرِيب" },
      { tr: "güvenli", en: "safe", ar: "آمِن" },
      { tr: "akıllı", en: "clever", ar: "ذَكِيّ" },
    ],
  },
  {
    tema: "Sıfatlar 4",
    kelimeler: [
      { tr: "kesin", en: "certain", ar: "أَكِيد" },
      { tr: "imkânsız", en: "impossible", ar: "مُسْتَحِيل" },
      { tr: "gerekli", en: "necessary", ar: "ضَرُورِيّ" },
      { tr: "rahat", en: "comfortable", ar: "مُرِيح" },
      { tr: "dijital", en: "digital", ar: "رَقْمِيّ" },
      { tr: "elektrikli", en: "electric", ar: "كَهْرَبَائِيّ" },
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
  {
    tema: "Sanat 2",
    kelimeler: [
      { tr: "yontu", en: "sculpture", ar: "نَحْت" },
      { tr: "sergi", en: "exhibition", ar: "مَعْرِض" },
      { tr: "belgesel", en: "documentary", ar: "وَثَائِقِيّ" },
      { tr: "bölüm", en: "episode", ar: "حَلْقَة" },
      { tr: "başlık", en: "headline", ar: "عُنْوَان" },
      { tr: "baskı", en: "printing", ar: "طِبَاعَة" },
    ],
  },
  {
    tema: "Doğa 3",
    kelimeler: [
      { tr: "yaprak", en: "leaf", ar: "وَرَقَة" },
      { tr: "sel", en: "flood", ar: "فَيَضَان" },
      { tr: "kasırga", en: "hurricane", ar: "إِعْصَار" },
      { tr: "zehir", en: "poison", ar: "سُمّ" },
      { tr: "sıvı", en: "liquid", ar: "سَائِل" },
      { tr: "maden", en: "mine", ar: "مَنْجَم" },
    ],
  },
  {
    tema: "Toplum 2",
    kelimeler: [
      { tr: "politikacı", en: "politician", ar: "سِيَاسِيّ" },
      { tr: "göçmen", en: "immigrant", ar: "مُهَاجِر" },
      { tr: "gönüllü", en: "volunteer", ar: "مُتَطَوِّع" },
      { tr: "oy", en: "vote", ar: "تَصْوِيت" },
      { tr: "yargıç", en: "judge", ar: "قَاضِي" },
      { tr: "vergi", en: "tax", ar: "ضَرِيبَة" },
    ],
  },
  {
    tema: "Nesne 2",
    kelimeler: [
      { tr: "çubuk", en: "stick", ar: "عَصَا" },
      { tr: "paket", en: "package", ar: "طَرْد" },
      { tr: "etiket", en: "label", ar: "بِطَاقَة" },
      { tr: "sinyal", en: "signal", ar: "إِشَارَة" },
      { tr: "dilim", en: "slice", ar: "شَرِيحَة" },
      { tr: "demir", en: "iron", ar: "حَدِيد" },
    ],
  },
];

/* B2 ve C1 HAVUZLARI — 24'er seviye, altışar kelime.

   Kaynak `oxford-B2.csv` (1299 kelime) ve `oxford-C1.csv` (1285 kelime).
   Ölçütler A1/A2 ile aynı: tek anlamlı, türü sabit (isim ve sıfat),
   seviye içi karışma yok, Türkçesi İngilizcesiyle aynı değil.

   Son ölçüt bu iki katmanda daha çok kelime eledi, çünkü ileri seviye
   Oxford listesinde Türkçeye olduğu gibi geçmiş kelimeler yoğun --
   karbon, oksijen, bakteri, mineral, ritim, bale, senatör, referandum,
   rejim, kabine, kota. Hepsi listeye alınmadı; kart üç dilde de aynı
   göründüğünde eşleştirme kendiliğinden çözülüyor.

   Seviye içi karışma yine script'le tarandı. C1'de bir çift yakalandı,
   "bakanlık / egemenlik" (Türkçede ikisi de -nlik ile bitiyor);
   egemenlik yerine "antlaşma / treaty" kondu. */
export const B2_SEVIYELERI: Seviye[] = [
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "mağara", en: "cave", ar: "كَهْف" },
      { tr: "uçurum", en: "cliff", ar: "جُرْف" },
      { tr: "kıyı", en: "shore", ar: "شَاطِئ" },
      { tr: "yamaç", en: "slope", ar: "مُنْحَدَر" },
      { tr: "kanal", en: "canal", ar: "قَنَاة" },
      { tr: "liman", en: "harbour", ar: "مِينَاء" },
    ],
  },
  {
    tema: "Malzeme",
    kelimeler: [
      { tr: "çelik", en: "steel", ar: "فُولَاذ" },
      { tr: "tuğla", en: "brick", ar: "طُوب" },
      { tr: "ipek", en: "silk", ar: "حَرِير" },
      { tr: "mürekkep", en: "ink", ar: "حِبْر" },
      { tr: "mum", en: "candle", ar: "شَمْعَة" },
      { tr: "battaniye", en: "blanket", ar: "بِطَّانِيَّة" },
    ],
  },
  {
    tema: "Eşya",
    kelimeler: [
      { tr: "merdiven", en: "ladder", ar: "سُلَّم" },
      { tr: "zarf", en: "envelope", ar: "ظَرْف" },
      { tr: "çengel", en: "hook", ar: "خُطَّاف" },
      { tr: "ok", en: "arrow", ar: "سَهْم" },
      { tr: "mermi", en: "bullet", ar: "رَصَاصَة" },
      { tr: "kask", en: "helmet", ar: "خُوذَة" },
    ],
  },
  {
    tema: "Beden",
    kelimeler: [
      { tr: "dirsek", en: "elbow", ar: "مِرْفَق" },
      { tr: "yanak", en: "cheek", ar: "خَدّ" },
      { tr: "topuk", en: "heel", ar: "كَعْب" },
      { tr: "başparmak", en: "thumb", ar: "إِبْهَام" },
      { tr: "bilek", en: "wrist", ar: "مِعْصَم" },
      { tr: "akciğer", en: "lung", ar: "رِئَة" },
    ],
  },
  {
    tema: "Sağlık",
    kelimeler: [
      { tr: "ateş", en: "fever", ar: "حُمَّى" },
      { tr: "hap", en: "pill", ar: "حَبَّة" },
      { tr: "cerrah", en: "surgeon", ar: "جَرَّاح" },
      { tr: "bulaşma", en: "infection", ar: "عَدْوَى" },
      { tr: "kanser", en: "cancer", ar: "سَرَطَان" },
      { tr: "sinir", en: "nerve", ar: "عَصَب" },
    ],
  },
  {
    tema: "Yönetim",
    kelimeler: [
      { tr: "vatandaş", en: "citizen", ar: "مُوَاطِن" },
      { tr: "meclis", en: "parliament", ar: "بَرْلَمَان" },
      { tr: "bakan", en: "minister", ar: "وَزِير" },
      { tr: "vali", en: "governor", ar: "مُحَافِظ" },
      { tr: "adalet", en: "justice", ar: "عَدْل" },
      { tr: "özgürlük", en: "freedom", ar: "حُرِّيَّة" },
    ],
  },
  {
    tema: "Suç",
    kelimeler: [
      { tr: "hırsızlık", en: "theft", ar: "سَرِقَة" },
      { tr: "soygun", en: "robbery", ar: "سَطْو" },
      { tr: "suç", en: "offence", ar: "جَرِيمَة" },
      { tr: "kanıt", en: "proof", ar: "بُرْهَان" },
      { tr: "tehdit", en: "threat", ar: "تَهْدِيد" },
      { tr: "şiddet", en: "violence", ar: "عُنْف" },
    ],
  },
  {
    tema: "Para",
    kelimeler: [
      { tr: "borç", en: "debt", ar: "دَيْن" },
      { tr: "bütçe", en: "budget", ar: "مِيزَانِيَّة" },
      { tr: "ücret", en: "wage", ar: "أَجْر" },
      { tr: "gelir", en: "income", ar: "دَخْل" },
      { tr: "kredi", en: "loan", ar: "قَرْض" },
      { tr: "harcama", en: "expense", ar: "نَفَقَة" },
    ],
  },
  {
    tema: "İş",
    kelimeler: [
      { tr: "uzman", en: "specialist", ar: "خَبِير" },
      { tr: "danışman", en: "consultant", ar: "مُسْتَشَار" },
      { tr: "satıcı", en: "dealer", ar: "تَاجِر" },
      { tr: "kurucu", en: "founder", ar: "مُؤَسِّس" },
      { tr: "liderlik", en: "leadership", ar: "قِيَادَة" },
      { tr: "sigorta", en: "insurance", ar: "تَأْمِين" },
    ],
  },
  {
    tema: "Bilim",
    kelimeler: [
      { tr: "hücre", en: "cell", ar: "خَلِيَّة" },
      { tr: "evren", en: "universe", ar: "كَوْن" },
      { tr: "roket", en: "rocket", ar: "صَارُوخ" },
      { tr: "derinlik", en: "depth", ar: "عُمْق" },
      { tr: "hacim", en: "volume", ar: "حَجْم" },
      { tr: "ölçüm", en: "measurement", ar: "قِيَاس" },
    ],
  },
  {
    tema: "Kültür",
    kelimeler: [
      { tr: "koro", en: "choir", ar: "جَوْقَة" },
      { tr: "tapınak", en: "temple", ar: "مَعْبَد" },
      { tr: "cami", en: "mosque", ar: "مَسْجِد" },
      { tr: "anıt", en: "monument", ar: "نُصْب" },
      { tr: "efsane", en: "legend", ar: "أُسْطُورَة" },
      { tr: "masal", en: "tale", ar: "حِكَايَة" },
    ],
  },
  {
    tema: "Sıfatlar",
    kelimeler: [
      { tr: "kutsal", en: "holy", ar: "مُقَدَّس" },
      { tr: "kör", en: "blind", ar: "أَعْمَى" },
      { tr: "sığ", en: "shallow", ar: "ضَحْل" },
      { tr: "acı", en: "bitter", ar: "مُرّ" },
      { tr: "çıplak", en: "naked", ar: "عَارِي" },
      { tr: "kalıcı", en: "permanent", ar: "دَائِم" },
    ],
  },
  {
    tema: "Doğa 2",
    kelimeler: [
      { tr: "fosil", en: "fossil", ar: "أُحْفُورَة" },
      { tr: "buğday", en: "wheat", ar: "قَمْح" },
      { tr: "kök", en: "root", ar: "جَذْر" },
      { tr: "gül", en: "rose", ar: "وَرْدَة" },
      { tr: "solucan", en: "worm", ar: "دُودَة" },
      { tr: "yaratık", en: "creature", ar: "مَخْلُوق" },
    ],
  },
  {
    tema: "Eşya 2",
    kelimeler: [
      { tr: "kablo", en: "cable", ar: "كَابِل" },
      { tr: "mercek", en: "lens", ar: "عَدَسَة" },
      { tr: "tel", en: "wire", ar: "سِلْك" },
      { tr: "sepet", en: "basket", ar: "سَلَّة" },
      { tr: "rozet", en: "badge", ar: "شَارَة" },
      { tr: "tünel", en: "tunnel", ar: "نَفَق" },
    ],
  },
  {
    tema: "Sağlık 2",
    kelimeler: [
      { tr: "tedavi", en: "therapy", ar: "عِلَاج" },
      { tr: "bağımlılık", en: "addiction", ar: "إِدْمَان" },
      { tr: "beslenme", en: "nutrition", ar: "تَغْذِيَة" },
      { tr: "kaygı", en: "anxiety", ar: "قَلَق" },
      { tr: "bunalım", en: "depression", ar: "اِكْتِئَاب" },
      { tr: "yara", en: "wound", ar: "جُرْح" },
    ],
  },
  {
    tema: "Tarih",
    kelimeler: [
      { tr: "medeniyet", en: "civilization", ar: "حَضَارَة" },
      { tr: "sömürge", en: "colony", ar: "مُسْتَعْمَرَة" },
      { tr: "ata", en: "ancestor", ar: "سَلَف" },
      { tr: "köle", en: "slave", ar: "عَبْد" },
      { tr: "devrim", en: "revolution", ar: "ثَوْرَة" },
      { tr: "zafer", en: "victory", ar: "نَصْر" },
    ],
  },
  {
    tema: "Toplum 2",
    kelimeler: [
      { tr: "azınlık", en: "minority", ar: "أَقَلِّيَّة" },
      { tr: "mülteci", en: "refugee", ar: "لَاجِئ" },
      { tr: "hane", en: "household", ar: "أُسْرَة" },
      { tr: "konut", en: "housing", ar: "إِسْكَان" },
      { tr: "ilçe", en: "district", ar: "مِنْطَقَة" },
      { tr: "barınak", en: "shelter", ar: "مَأْوَى" },
    ],
  },
  {
    tema: "Yönetim 2",
    kelimeler: [
      { tr: "çoğunluk", en: "majority", ar: "أَغْلَبِيَّة" },
      { tr: "anket", en: "questionnaire", ar: "اِسْتِبْيَان" },
      { tr: "oylama", en: "voting", ar: "اِقْتِرَاع" },
      { tr: "ceza", en: "penalty", ar: "غَرَامَة" },
      { tr: "yönetmelik", en: "regulation", ar: "لَائِحَة" },
      { tr: "ölçüt", en: "criterion", ar: "مِعْيَار" },
    ],
  },
  {
    tema: "Para 2",
    kelimeler: [
      { tr: "yatırım", en: "investment", ar: "اِسْتِثْمَار" },
      { tr: "fon", en: "fund", ar: "صُنْدُوق" },
      { tr: "emeklilik", en: "retirement", ar: "تَقَاعُد" },
      { tr: "servet", en: "wealth", ar: "ثَرْوَة" },
      { tr: "teşvik", en: "incentive", ar: "حَافِز" },
      { tr: "müzayede", en: "auction", ar: "مَزَاد" },
    ],
  },
  {
    tema: "Eğitim",
    kelimeler: [
      { tr: "müfredat", en: "curriculum", ar: "مَنْهَج" },
      { tr: "bağış", en: "donation", ar: "تَبَرُّع" },
      { tr: "kılavuz", en: "guideline", ar: "دَلِيل" },
      { tr: "kurum", en: "institution", ar: "مُؤَسَّسَة" },
      { tr: "bilgin", en: "scholar", ar: "عَالِم" },
      { tr: "defter", en: "notebook", ar: "دَفْتَر" },
    ],
  },
  {
    tema: "Kültür 2",
    kelimeler: [
      { tr: "besteci", en: "composer", ar: "مُلَحِّن" },
      { tr: "tür", en: "genre", ar: "نَوْع" },
      { tr: "romancı", en: "novelist", ar: "رِوَائِيّ" },
      { tr: "mizah", en: "humour", ar: "فُكَاهَة" },
      { tr: "hayal", en: "illusion", ar: "وَهْم" },
      { tr: "gölge", en: "shadow", ar: "ظِلّ" },
    ],
  },
  {
    tema: "Düşünce",
    kelimeler: [
      { tr: "felsefe", en: "philosophy", ar: "فَلْسَفَة" },
      { tr: "ahlak", en: "ethic", ar: "أَخْلَاق" },
      { tr: "ruh", en: "soul", ar: "رُوح" },
      { tr: "iman", en: "faith", ar: "إِيمَان" },
      { tr: "onur", en: "pride", ar: "كِبْرِيَاء" },
      { tr: "utanç", en: "shame", ar: "عَار" },
    ],
  },
  {
    tema: "Duygu",
    kelimeler: [
      { tr: "sabır", en: "patience", ar: "صَبْر" },
      { tr: "cesaret", en: "courage", ar: "شَجَاعَة" },
      { tr: "öfke", en: "anger", ar: "غَضَب" },
      { tr: "sevinç", en: "joy", ar: "فَرَح" },
      { tr: "özgüven", en: "confidence", ar: "ثِقَة" },
      { tr: "kâbus", en: "nightmare", ar: "كَابُوس" },
    ],
  },
  {
    tema: "Sıfatlar 2",
    kelimeler: [
      { tr: "yıllık", en: "annual", ar: "سَنَوِيّ" },
      { tr: "kentsel", en: "urban", ar: "حَضَرِيّ" },
      { tr: "kırsal", en: "rural", ar: "رِيفِيّ" },
      { tr: "geçici", en: "temporary", ar: "مُؤَقَّت" },
      { tr: "gizli", en: "hidden", ar: "مَخْفِيّ" },
      { tr: "yoğun", en: "intense", ar: "كَثِيف" },
    ],
  },
];

export const C1_SEVIYELERI: Seviye[] = [
  {
    tema: "Devlet",
    kelimeler: [
      { tr: "büyükelçi", en: "ambassador", ar: "سَفِير" },
      { tr: "bakanlık", en: "ministry", ar: "وِزَارَة" },
      { tr: "anayasa", en: "constitution", ar: "دُسْتُور" },
      { tr: "cumhuriyet", en: "republic", ar: "جُمْهُورِيَّة" },
      { tr: "eyalet", en: "province", ar: "مُقَاطَعَة" },
      { tr: "antlaşma", en: "treaty", ar: "مُعَاهَدَة" },
    ],
  },
  {
    tema: "Hukuk",
    kelimeler: [
      { tr: "dava", en: "lawsuit", ar: "دَعْوَى" },
      { tr: "karar", en: "verdict", ar: "حُكْم" },
      { tr: "tanıklık", en: "testimony", ar: "شَهَادَة" },
      { tr: "gözaltı", en: "custody", ar: "حِرَاسَة" },
      { tr: "yaptırım", en: "sanction", ar: "عُقُوبَة" },
      { tr: "yetki", en: "jurisdiction", ar: "اِخْتِصَاص" },
    ],
  },
  {
    tema: "Savaş",
    kelimeler: [
      { tr: "rehine", en: "hostage", ar: "رَهِينَة" },
      { tr: "füze", en: "missile", ar: "صَارُوخ" },
      { tr: "tüfek", en: "rifle", ar: "بُنْدُقِيَّة" },
      { tr: "kılıç", en: "sword", ar: "سَيْف" },
      { tr: "savaşçı", en: "warrior", ar: "مُحَارِب" },
      { tr: "ayaklanma", en: "rebellion", ar: "تَمَرُّد" },
    ],
  },
  {
    tema: "Din ve ahlak",
    kelimeler: [
      { tr: "melek", en: "angel", ar: "مَلَاك" },
      { tr: "günah", en: "sin", ar: "إِثْم" },
      { tr: "merhamet", en: "mercy", ar: "رَحْمَة" },
      { tr: "vicdan", en: "conscience", ar: "ضَمِير" },
      { tr: "erdem", en: "virtue", ar: "فَضِيلَة" },
      { tr: "keşiş", en: "monk", ar: "رَاهِب" },
    ],
  },
  {
    tema: "Duygu",
    kelimeler: [
      { tr: "keder", en: "grief", ar: "حُزْن" },
      { tr: "nefret", en: "hatred", ar: "كَرَاهِيَة" },
      { tr: "öfke", en: "rage", ar: "غَضَب" },
      { tr: "şefkat", en: "compassion", ar: "شَفَقَة" },
      { tr: "suçluluk", en: "guilt", ar: "ذَنْب" },
      { tr: "sadakat", en: "loyalty", ar: "وَلَاء" },
    ],
  },
  {
    tema: "Toplum",
    kelimeler: [
      { tr: "göç", en: "migration", ar: "هِجْرَة" },
      { tr: "eşitlik", en: "equality", ar: "مُسَاوَاة" },
      { tr: "ayrımcılık", en: "discrimination", ar: "تَمْيِيز" },
      { tr: "refah", en: "prosperity", ar: "اِزْدِهَار" },
      { tr: "köylü", en: "peasant", ar: "فَلَّاح" },
      { tr: "dul", en: "widow", ar: "أَرْمَلَة" },
    ],
  },
  {
    tema: "Ekonomi",
    kelimeler: [
      { tr: "açık", en: "deficit", ar: "عَجْز" },
      { tr: "hissedar", en: "shareholder", ar: "مُسَاهِم" },
      { tr: "birleşme", en: "merger", ar: "اِنْدِمَاج" },
      { tr: "tekel", en: "monopoly", ar: "اِحْتِكَار" },
      { tr: "verim", en: "productivity", ar: "إِنْتَاجِيَّة" },
      { tr: "yük", en: "burden", ar: "عِبْء" },
    ],
  },
  {
    tema: "Mekân",
    kelimeler: [
      { tr: "sığınak", en: "refuge", ar: "مَلْجَأ" },
      { tr: "ambar", en: "warehouse", ar: "مُسْتَوْدَع" },
      { tr: "mezarlık", en: "cemetery", ar: "مَقْبَرَة" },
      { tr: "eşik", en: "threshold", ar: "عَتَبَة" },
      { tr: "çayır", en: "lawn", ar: "مَرْج" },
      { tr: "gölet", en: "pond", ar: "بِرْكَة" },
    ],
  },
  {
    tema: "Doğa",
    kelimeler: [
      { tr: "şafak", en: "dawn", ar: "فَجْر" },
      { tr: "ufuk", en: "horizon", ar: "أُفُق" },
      { tr: "gelgit", en: "tide", ar: "مَدّ" },
      { tr: "kereste", en: "timber", ar: "خَشَب" },
      { tr: "ot", en: "weed", ar: "عُشْب" },
      { tr: "yırtıcı", en: "predator", ar: "مُفْتَرِس" },
    ],
  },
  {
    tema: "Bilim",
    kelimeler: [
      { tr: "mantık", en: "logic", ar: "مَنْطِق" },
      { tr: "denklem", en: "equation", ar: "مُعَادَلَة" },
      { tr: "oran", en: "ratio", ar: "نِسْبَة" },
      { tr: "tayf", en: "spectrum", ar: "طَيْف" },
      { tr: "boyut", en: "dimension", ar: "بُعْد" },
      { tr: "yoğunluk", en: "density", ar: "كَثَافَة" },
    ],
  },
  {
    tema: "Metin ve sanat",
    kelimeler: [
      { tr: "elyazması", en: "manuscript", ar: "مَخْطُوطَة" },
      { tr: "mısra", en: "verse", ar: "بَيْت" },
      { tr: "ezgi", en: "melody", ar: "لَحْن" },
      { tr: "anı", en: "memoir", ar: "مُذَكِّرَة" },
      { tr: "taslak", en: "sketch", ar: "مُسَوَّدَة" },
      { tr: "miras", en: "heritage", ar: "تُرَاث" },
    ],
  },
  {
    tema: "Sıfatlar",
    kelimeler: [
      { tr: "kırılgan", en: "fragile", ar: "هَشّ" },
      { tr: "ölümcül", en: "lethal", ar: "فَتَّاك" },
      { tr: "görünmez", en: "invisible", ar: "خَفِيّ" },
      { tr: "asil", en: "noble", ar: "نَبِيل" },
      { tr: "zehirli", en: "toxic", ar: "سَامّ" },
      { tr: "muğlak", en: "vague", ar: "غَامِض" },
    ],
  },
  {
    tema: "Din 2",
    kelimeler: [
      { tr: "piskopos", en: "bishop", ar: "أُسْقُف" },
      { tr: "aziz", en: "saint", ar: "قِدِّيس" },
      { tr: "ilahiyat", en: "theology", ar: "لَاهُوت" },
      { tr: "öğreti", en: "doctrine", ar: "عَقِيدَة" },
      { tr: "ibadet", en: "worship", ar: "عِبَادَة" },
      { tr: "ayin", en: "ritual", ar: "طَقْس" },
    ],
  },
  {
    tema: "Fikir",
    kelimeler: [
      { tr: "söylem", en: "discourse", ar: "خِطَاب" },
      { tr: "önyargı", en: "prejudice", ar: "تَحَيُّز" },
      { tr: "hoşgörü", en: "tolerance", ar: "تَسَامُح" },
      { tr: "itiraz", en: "objection", ar: "اِعْتِرَاض" },
      { tr: "uzlaşı", en: "consensus", ar: "تَوَافُق" },
      { tr: "taviz", en: "concession", ar: "تَنَازُل" },
    ],
  },
  {
    tema: "Savaş 2",
    kelimeler: [
      { tr: "darbe", en: "coup", ar: "اِنْقِلَاب" },
      { tr: "ittifak", en: "alliance", ar: "تَحَالُف" },
      { tr: "casus", en: "spy", ar: "جَاسُوس" },
      { tr: "çatışma", en: "clash", ar: "اِشْتِبَاك" },
      { tr: "zulüm", en: "atrocity", ar: "فَظَاعَة" },
      { tr: "sürgün", en: "exile", ar: "مَنْفَى" },
    ],
  },
  {
    tema: "Hukuk 2",
    kelimeler: [
      { tr: "mahkûmiyet", en: "conviction", ar: "إِدَانَة" },
      { tr: "kefalet", en: "bail", ar: "كَفَالَة" },
      { tr: "suçlama", en: "accusation", ar: "اِتِّهَام" },
      { tr: "tutuklu", en: "inmate", ar: "نَزِيل" },
      { tr: "denetim", en: "audit", ar: "تَدْقِيق" },
      { tr: "savunma", en: "plea", ar: "دِفَاع" },
    ],
  },
  {
    tema: "Ticaret",
    kelimeler: [
      { tr: "emtia", en: "commodity", ar: "سِلْعَة" },
      { tr: "ticaret", en: "commerce", ar: "تِجَارَة" },
      { tr: "nakliye", en: "shipping", ar: "شَحْن" },
      { tr: "prim", en: "premium", ar: "عَلَاوَة" },
      { tr: "abone", en: "subscriber", ar: "مُشْتَرِك" },
      { tr: "teşebbüs", en: "enterprise", ar: "مَشْرُوع" },
    ],
  },
  {
    tema: "Bilim 2",
    kelimeler: [
      { tr: "değişken", en: "variable", ar: "مُتَغَيِّر" },
      { tr: "örneklem", en: "specimen", ar: "عَيِّنَة" },
      { tr: "bağıntı", en: "correlation", ar: "اِرْتِبَاط" },
      { tr: "sentez", en: "synthesis", ar: "تَرْكِيب" },
      { tr: "benzetim", en: "simulation", ar: "مُحَاكَاة" },
      { tr: "gösterge", en: "indicator", ar: "مُؤَشِّر" },
    ],
  },
  {
    tema: "Doğa 2",
    kelimeler: [
      { tr: "arazi", en: "terrain", ar: "تَضَارِيس" },
      { tr: "sürü", en: "cattle", ar: "مَاشِيَة" },
      { tr: "lif", en: "fibre", ar: "لِيف" },
      { tr: "hasat", en: "harvest", ar: "حَصَاد" },
      { tr: "kül", en: "ash", ar: "رَمَاد" },
      { tr: "kütük", en: "log", ar: "جِذْع" },
    ],
  },
  {
    tema: "Duygu 2",
    kelimeler: [
      { tr: "küçümseme", en: "contempt", ar: "اِزْدِرَاء" },
      { tr: "nezaket", en: "courtesy", ar: "لُطْف" },
      { tr: "merak", en: "curiosity", ar: "فُضُول" },
      { tr: "haysiyet", en: "dignity", ar: "كَرَامَة" },
      { tr: "sefalet", en: "misery", ar: "بُؤْس" },
      { tr: "iyimserlik", en: "optimism", ar: "تَفَاؤُل" },
    ],
  },
  {
    tema: "Toplum 2",
    kelimeler: [
      { tr: "intikam", en: "revenge", ar: "اِنْتِقَام" },
      { tr: "dayanışma", en: "solidarity", ar: "تَضَامُن" },
      { tr: "esaret", en: "slavery", ar: "عُبُودِيَّة" },
      { tr: "adaletsizlik", en: "injustice", ar: "ظُلْم" },
      { tr: "sömürü", en: "exploitation", ar: "اِسْتِغْلَال" },
      { tr: "taciz", en: "harassment", ar: "تَحَرُّش" },
    ],
  },
  {
    tema: "Yönetişim",
    kelimeler: [
      { tr: "özerklik", en: "autonomy", ar: "اِسْتِقْلَال" },
      { tr: "yetkinlik", en: "competence", ar: "كَفَاءَة" },
      { tr: "gözetim", en: "supervision", ar: "إِشْرَاف" },
      { tr: "denetleyici", en: "regulator", ar: "مُنَظِّم" },
      { tr: "yönetişim", en: "governance", ar: "حَوْكَمَة" },
      { tr: "temsil", en: "representation", ar: "تَمْثِيل" },
    ],
  },
  {
    tema: "Sıfatlar 2",
    kelimeler: [
      { tr: "acımasız", en: "brutal", ar: "وَحْشِيّ" },
      { tr: "müzmin", en: "chronic", ar: "مُزْمِن" },
      { tr: "muazzam", en: "immense", ar: "هَائِل" },
      { tr: "ince", en: "subtle", ar: "دَقِيق" },
      { tr: "sağlam", en: "robust", ar: "مَتِين" },
      { tr: "üstün", en: "superior", ar: "مُتَفَوِّق" },
    ],
  },
  {
    tema: "Sıfatlar 3",
    kelimeler: [
      { tr: "dünyevi", en: "secular", ar: "عَلْمَانِيّ" },
      { tr: "ölçülü", en: "moderate", ar: "مُعْتَدِل" },
      { tr: "meşru", en: "legitimate", ar: "شَرْعِيّ" },
      { tr: "alçakgönüllü", en: "humble", ar: "مُتَوَاضِع" },
      { tr: "düşmanca", en: "hostile", ar: "عَدَائِيّ" },
      { tr: "belirgin", en: "prominent", ar: "بَارِز" },
    ],
  },
];

/* HADİSLE İLGİLİ KELİMELER — yirmi dört seviye.

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
  {
    tema: "Râvi tabakaları",
    kelimeler: [
      { tr: "akran", en: "peers", ar: "أَقْرَان" },
      { tr: "meşhur", en: "well-known", ar: "مَشْهُور" },
      { tr: "ulüvv", en: "elevation", ar: "عُلُوّ" },
      { tr: "nüzûl", en: "descent", ar: "نُزُول" },
      { tr: "müselsel", en: "chained", ar: "مُسَلْسَل" },
      { tr: "vefeyat", en: "obituaries", ar: "وَفَيَات" },
    ],
  },
  {
    tema: "Usûlle kesişim",
    kelimeler: [
      { tr: "mutlak", en: "absolute", ar: "مُطْلَق" },
      { tr: "mukayyed", en: "qualified", ar: "مُقَيَّد" },
      { tr: "âmm", en: "general", ar: "عَامّ" },
      { tr: "hâss", en: "specific", ar: "خَاصّ" },
      { tr: "mücmel", en: "ambiguous", ar: "مُجْمَل" },
      { tr: "mübeyyen", en: "clarified", ar: "مُبَيَّن" },
    ],
  },
  {
    tema: "Rivayet çeşitleri",
    kelimeler: [
      { tr: "kudsî", en: "sacred", ar: "قُدْسِيّ" },
      { tr: "nebevî", en: "prophetic", ar: "نَبَوِيّ" },
      { tr: "eser", en: "tradition", ar: "أَثَر" },
      { tr: "nakil", en: "conveyance", ar: "نَقْل" },
      { tr: "lafız", en: "wording", ar: "لَفْظ" },
      { tr: "mefhum", en: "purport", ar: "مَفْهُوم" },
    ],
  },
  {
    tema: "Tearuz ve tercih",
    kelimeler: [
      { tr: "muteber", en: "authoritative", ar: "مُعْتَبَر" },
      { tr: "müşkil", en: "problematic", ar: "مُشْكِل" },
      { tr: "nâsih", en: "abrogating", ar: "نَاسِخ" },
      { tr: "teâruz", en: "conflict", ar: "تَعَارُض" },
      { tr: "tercih", en: "preference", ar: "تَرْجِيح" },
      { tr: "cem", en: "reconciliation", ar: "جَمْع" },
    ],
  },
];
