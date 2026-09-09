export type Language = "tr" | "ar" | "en";

export const LANGUAGES: Language[] = ["tr", "ar", "en"];

export const LANGUAGE_LABELS: Record<Language, string> = {
  tr: "TR",
  ar: "AR",
  en: "EN",
};

export const LANGUAGE_DIR: Record<Language, "ltr" | "rtl"> = {
  tr: "ltr",
  ar: "rtl",
  en: "ltr",
};

type Translation = {
  brandAlt: string;
  title: string;
  welcome: string;
  descriptionQuestion: string;
  descriptionRephrase: string;
  descriptionHadith: string;
  descriptionAnd: string;
  descriptionDigital: string;
  begin: string;
  about: string;
  themeToggle: string;
  languageToggle: string;
  greetingLead: string;
  greetingBody: string;
  greetingMore: string;
  workingOnIt: string;
  journeyAhead: string;
  pageNotCreated: string;
  cardPreparing: string;
  podcastHadithHistory: string;
  podcastCatGeography: string;
  podcastCatTerms: string;
  podcastCatUsulLit: string;
  podcastCatRijal: string;
  podcastCatIlal: string;
  podcastCatTahammul: string;
  podcastCatSources: string;
  podcastCatSitte: string;
  podcastCatFiqh: string;
  podcastCatKalam: string;
  podcastCatQuran: string;
  podcastCatOrientalism: string;
  podcastCatCurrent: string;
  podcastEp001: string;
  podcastEp002: string;
  podcastEp003: string;
  podcastEp004: string;
  podcastEp005: string;
  podcastEp006: string;
  podcastEp007: string;
  podcastEp008: string;
  playerPlay: string;
  playerPause: string;
  playerBack5: string;
  playerForward5: string;
  playerSpeed: string;
  playerSeek: string;
  playerReplay: string;
  playerFailed: string;
  comingSoon: string;
  gameResuleKavusmak: string;
  gameDilAntrenmani: string;
  // /sinama'daki 'burada neler var' kart izgarasi. Anasayfa henuz
  // kullanmiyor -- duzen orada onaylanirsa oraya da tasinacak.
  indexLead: string;
  cardNetworks: string;
  cardNetworksDesc: string;
  cardGames: string;
  cardGamesDesc: string;
  cardPodcasts: string;
  cardPodcastsDesc: string;
  cardRihle: string;
  cardRihleDesc: string;
  cardEducation: string;
  cardEducationDesc: string;
  eduVideos: string;
  eduPosts: string;
  eduVideoShamelaSetup: string;
  eduVideoMacbook: string;
  eduVideoSearchPanel: string;
  eduVideoClaudeExt: string;
  eduVideoChh: string;
  eduVideoChhWindow: string;
  eduVideoCevami: string;
  eduPostNotebookLM: string;
  eduPostVolumeLimit: string;
  eduPostShamelaFeature: string;
  eduPostYdsCards: string;
  eduPostDataPrivacy: string;
  eduPostPdfDarkMode: string;
  eduPostDeepL: string;
  footerRights: string;
  /* Silsile ağı (/ag-sinamasi). Râvi ADLARI burada değil: onlar
     düğümün kendisinde duruyor (Türkçe `tr`, Arapça `ar` alanı) ve
     dile göre orada seçiliyor. Burada yalnızca arayüz metinleri var. */
  agOlum: string;
  agSuzgecKaldir: string;
  agSuzgecIpucu: string;
  agAra: string;
  agHocalari: string;
  agTalebeleri: string;
  agKayitYok: string;
  agRivayetBagi: string;
  agKaynak: string;
  agTahricRumuzu: string;
  agMuksirun: string;
  agMuellif: string;
  agTabaka0: string;
  agTabaka1: string;
  agTabaka2: string;
  agTabaka3: string;
  agTabaka4: string;
  agTabaka5: string;
  agTabaka6: string;
  agMedar1: string;
  agMedar2: string;
  agMedar3: string;
  agGiris: string;
  agHaritayaGit: string;
};

export const TRANSLATIONS: Record<Language, Translation> = {
  tr: {
    brandAlt: "Hadis ve Dijital",
    title: "Bir Şeyler Deniyorum.",
    welcome: "Test Yayınıma Hoş Geldiniz.",
    descriptionQuestion: "Klasik ile günümüzü birleştirmek mümkün mü?",
    descriptionRephrase: "Ya da şöyle diyelim:",
    descriptionHadith: "Hadis",
    descriptionAnd: "ve",
    descriptionDigital: "Dijital.",
    begin: "Başlayalım",
    about: "Mustafâ Hakkında",
    themeToggle: "Karanlık modu aç/kapat",
    languageToggle: "Dili değiştir",
    greetingLead: "Merhaba, ben Mustafâ.",
    greetingBody:
      "İlahiyatçı ve yazılımcıyım. Ama daha çok ilahiyatçı. Bu sayfayı, klasik hadis ilimleriyle dijital araçları bir araya getiren çalışmalarımı paylaşmak için kurdum. Yapılacak çok işimiz var.",
    greetingMore: "Daha fazla bilgi için tıklayın.",
    workingOnIt: "Mustafâ bu iş üzerinde çalışıyor.",
    journeyAhead:
      "Bir yolculuk yaklaşıyor. Kütüb-i Sitte müelliflerinin rihle güzergâhlarını öğrenelim. Ama önce hazırlık yapmalıyım. Mustafâ bu iş üzerinde çalışıyor.",
    pageNotCreated:
      "Şu anda buradasınız. Mustafâ henüz böyle bir sayfa oluşturmadı. Fakat... Neden olmasın?",
    cardPreparing: "Hazırlanıyor",
    podcastHadithHistory: "Hadis Tarihi",
    podcastCatGeography: "Coğrafya, Tabakât ve Tarih Yazımı",
    podcastCatTerms: "Usûl Istılahları",
    podcastCatUsulLit: "Usûl Literatürünün Gelişimi",
    podcastCatRijal: "Ricâl ve Cerh-Ta'dîl",
    podcastCatIlal: "İlel ve Tenkit Yöntemi",
    podcastCatTahammul: "Rivâyet Usûlü, Tahammül ve Edâ",
    podcastCatSources: "Kaynak Türleri ve Literatür Bilgisi",
    podcastCatSitte: "Kütüb-i Sitte ve Tis'a",
    podcastCatFiqh: "Hadis-Fıkıh ve Mezhep",
    podcastCatKalam: "Hadis-Kelâm ve İtikad",
    podcastCatQuran: "Sünnet ve Kur'an",
    podcastCatOrientalism: "Oryantalizm ve Modern Tartışmalar",
    podcastCatCurrent: "Güncel Meseleler ve Diğer Alanlarla İlişki",
    podcastEp001: "K2 001 Hz. Peygamber ve sahâbe döneminde rivâyet",
    podcastEp002: "K1 002 Hadislerin yazılması, sadrın zabtından satrın zabtına",
    podcastEp003: "K1 003 Fitne ve isnâdın başlangıcı",
    podcastEp004: "K1 004 Tedvîn süreci",
    podcastEp005: "K1 005 Tasnîf dönemi, öncesi ve sonrası",
    podcastEp006: "K2 006 İkinci asır rivâyetleri ve ilk musannifler",
    podcastEp007: "K2 007 Mihne Hâdisesi",
    podcastEp008: "K2 008 Ref' olgusu ve rivâyetin dönüşümü",
    playerPlay: "Oynat",
    playerPause: "Duraklat",
    playerBack5: "5 saniye geri",
    playerForward5: "5 saniye ileri",
    playerSpeed: "Oynatma hızı",
    playerSeek: "Ses konumu",
    playerReplay: "Baştan çal",
    playerFailed: "Ses dosyası yüklenemedi.",
    comingSoon: "Yakında",
    gameResuleKavusmak: "Resûle Kavuşmak",
    gameDilAntrenmani: "1 Kelime 3 Dil",
    indexLead: "Burada neler var",
    cardNetworks: "Râvi İlişki Ağları",
    cardNetworksDesc: "Râvilerin hoca-talebe bağlarını haritalama çalışması.",
    cardGames: "Oyunlar",
    cardGamesDesc: "Oynarken öğrenelim.",
    cardPodcasts: "Podcastler",
    cardPodcastsDesc:
      "Hadis tarihi, usûlü, edebiyatı ve oryantalizm üzerine yapay zekâ destekli podcastler.",
    cardRihle: "Rihleler",
    cardRihleDesc:
      "Kütüb-i Sitte müelliflerinin rihle güzergâhlarını görelim.",
    cardEducation: "Eğitim İçerikleri ve Diğer Hizmetler",
    cardEducationDesc: "Verilen eğitimler, rehber videoları ve paylaşımlar.",
    eduVideos: "Rehber videolar",
    eduPosts: "Paylaşımlar",
    eduVideoShamelaSetup: "el-Mektebetü'ş-Şâmile, kurulum",
    eduVideoMacbook: "el-Mektebetü'ş-Şâmile, macOS üzerinde kurulum",
    eduVideoSearchPanel: "el-Mektebetü'ş-Şâmile, arama panelinin kullanımı",
    eduVideoClaudeExt: "el-Mektebetü'ş-Şâmile'nin yapay zekâ istemcisiyle kullanımı",
    eduVideoChh: "Câmiu Hâdimi'l-Haremeyn, kurulum ve sık karşılaşılan sorunlar",
    eduVideoChhWindow: "Câmiu Hâdimi'l-Haremeyn, pencere probleminin çözümü",
    eduVideoCevami: "Cevâmiu'l-Kelim, kurulum",
    eduPostNotebookLM:
      "Şâmile'den elde edilen kitaplar üzerinde NotebookLM ile işlem yapma",
    eduPostVolumeLimit:
      "Eser hacminde sınırlamaya giderek NotebookLM'de daha etkili sonuç almak",
    eduPostShamelaFeature:
      "Şâmile'nin çok bilinmeyen ama oldukça işlevsel bir özelliği",
    eduPostYdsCards:
      "Gemini ve NotebookLM ile YDS kelime çalışma kartları hazırlamak",
    eduPostDataPrivacy:
      "Dil modellerine verilen akademik metinlerin ve kişisel verilerin şirketlerce kullanımını önlemek (ChatGPT, Gemini, Claude)",
    eduPostPdfDarkMode: "Pdf'leri gece moduna çeviren siteler",
    eduPostDeepL:
      "Seçilen metni her programda çeviren masaüstü aracı (DeepL)",
    footerRights: "Tüm hakları saklıdır.",
    agOlum: "ö.",
    agSuzgecKaldir: "Tüm Filtreleri Kaldır",
    agSuzgecIpucu: "Yıllara ve bölgelere göre filtreleme yapmak için kenar verilerini kullanabilirsiniz.",
    agAra: "Râvi Ara",
    agHocalari: "Hocaları",
    agTalebeleri: "Talebeleri",
    agKayitYok: "kayıt yok",
    agRivayetBagi: "Rivayet bağı",
    agKaynak: "Kaynak",
    agTahricRumuzu: "Tahrîc rumuzu",
    agMuksirun: "müksirûndan",
    agMuellif: "Kütüb-i Sitte müellifi",
    agTabaka0: "Kaynak",
    agTabaka1: "Sahâbe",
    agTabaka2: "Kibâr-ı tâbiîn",
    agTabaka3: "Vustâ",
    agTabaka4: "Sigār-ı tâbiîn",
    agTabaka5: "Etbâu't-tâbiîn",
    agTabaka6: "Müellif sonrası",
    agMedar1: "I. tabaka — müdevvinler",
    agMedar2: "II. tabaka — musannifler",
    agMedar3: "III. tabaka — münekkit ve fakîh muhaddisler",
    agGiris:
      "Tercemeler ve bağlar Mizzî'nin Tehzîbü'l-Kemâl'i ile İbn Hacer'in Takrîbü't-Tehzîb ve Tehzîbü't-Tehzîb'inden, Kütüb-i Sitte müelliflerinin talebe halkaları Zehebî'nin Siyeru a'lâmi'n-nübelâ'sından alındı; tabaka tasnifi Takrîb'e, vefat yıllarının bir kısmı DİA'ya dayanıyor. Ağ Ali b. el-Medînî'nin medâr saydığı isimlerle müksirûndan başladı, ama artık onlarla sınırlı değil: on üç beldedeki 821 râvinin ancak otuz biri o çekirdekten geliyor, gerisi işlenen tercemelerin hoca ve talebe listelerinden çıktı ve aradaki bağ sayısı 5.904. Ağ Kütüb-i Sitte râvileriyle bitiyor; müelliflerin kendi hocaları olan tabaka bir hayli genişledi ama hâlâ eksik, bir kısım râvinin de yalnızca hocaları ya da yalnızca talebeleri işlenmiş durumda.",
    agHaritayaGit: "Haritaya erişmek için tıklayınız",
  },
  ar: {
    brandAlt: "الحديث والديجيتالية",
    title: "أجرّب شيئا ما.",
    welcome: "مرحبًا بكم في بثّي التجريبي.",
    descriptionQuestion: "هل يمكن الجمع بين الكلاسيكي والمعاصر؟",
    descriptionRephrase: "أو لنقل بهذه الطريقة:",
    descriptionHadith: "الحديث",
    descriptionAnd: "و",
    descriptionDigital: "الديجيتالية.",
    begin: "لنبدأ",
    about: "عن مصطفى",
    themeToggle: "تبديل الوضع الليلي",
    languageToggle: "تغيير اللغة",
    greetingLead: "مرحبًا، أنا مصطفى.",
    greetingBody:
      "باحث شرعي ومبرمج، لكنني باحث شرعي أكثر. أنشأت هذه الصفحة لأنشر فيها أعمالي التي أجمع فيها بين علوم الحديث الكلاسيكية والأدوات الرقمية. أمامنا عمل كثير.",
    greetingMore: "اضغط لمزيد من المعلومات.",
    workingOnIt: "مصطفى يعمل على هذا الأمر.",
    journeyAhead:
      "رحلةٌ تقترب. لنتعرّف على مسارات رحلات مؤلّفي الكتب الستّة. ولكن لا بدّ لي من الاستعداد أوّلًا. مصطفى يعمل على هذا الأمر.",
    pageNotCreated:
      "أنتم الآن هنا. لم يُنشئ مصطفى هذه الصفحة بعدُ. ولكن... لِمَ لا؟",
    cardPreparing: "قيد الإعداد",
    podcastHadithHistory: "تاريخ الحديث",
    podcastCatGeography: "الجغرافيا والطبقات والتأريخ",
    podcastCatTerms: "مصطلحات علوم الحديث",
    podcastCatUsulLit: "تطور مصنفات علوم الحديث",
    podcastCatRijal: "الرجال والجرح والتعديل",
    podcastCatIlal: "العلل ومنهج النقد",
    podcastCatTahammul: "أصول الرواية والتحمل والأداء",
    podcastCatSources: "أنواع المصادر ومعرفة المصنفات",
    podcastCatSitte: "الكتب الستة والتسعة",
    podcastCatFiqh: "الحديث والفقه والمذاهب",
    podcastCatKalam: "الحديث والكلام والعقيدة",
    podcastCatQuran: "السنة والقرآن",
    podcastCatOrientalism: "الاستشراق والنقاشات المعاصرة",
    podcastCatCurrent: "القضايا الراهنة وصلة الحديث بسائر العلوم",
    podcastEp001: "K2 001 الرواية في عهد النبي ﷺ والصحابة",
    podcastEp002: "K1 002 كتابة الحديث، من ضبط الصدور إلى ضبط السطور",
    podcastEp003: "K1 003 الفتنة وبداية الإسناد",
    podcastEp004: "K1 004 عملية التدوين",
    podcastEp005: "K1 005 عصر التصنيف، ما قبله وما بعده",
    podcastEp006: "K2 006 روايات القرن الثاني والمصنفون الأوائل",
    podcastEp007: "K2 007 محنة خلق القرآن",
    podcastEp008: "K2 008 ظاهرة الرفع وتحول الرواية",
    playerPlay: "تشغيل",
    playerPause: "إيقاف مؤقت",
    playerBack5: "خمس ثوانٍ إلى الوراء",
    playerForward5: "خمس ثوانٍ إلى الأمام",
    playerSpeed: "سرعة التشغيل",
    playerSeek: "موضع الصوت",
    playerReplay: "التشغيل من البداية",
    playerFailed: "تعذّر تحميل الملف الصوتي.",
    comingSoon: "قريبًا",
    gameResuleKavusmak: "لقاء الرسول",
    gameDilAntrenmani: "كلمة واحدة، ثلاث لغات",
    indexLead: "ما الذي تجده هنا",
    cardNetworks: "شبكات علاقات الرواة",
    cardNetworksDesc: "محاولةٌ لرسم صلات الشيوخ والتلاميذ بين الرواة.",
    cardGames: "الألعاب",
    cardGamesDesc: "لنتعلّم ونحن نلعب.",
    cardPodcasts: "التسجيلات الصوتية",
    cardPodcastsDesc:
      "تسجيلات في تاريخ الحديث وأصوله وأدبه والاستشراق.",
    cardRihle: "الرحلات",
    cardRihleDesc: "لنتعرّف على مسارات رحلات مؤلّفي الكتب الستّة.",
    cardEducation: "المحتوى التعليمي وخدمات أخرى",
    cardEducationDesc: "دوراتٌ وفيديوهات إرشادية ومنشورات.",
    eduVideos: "الفيديوهات الإرشادية",
    eduPosts: "المنشورات",
    eduVideoShamelaSetup: "المكتبة الشاملة، التثبيت",
    eduVideoMacbook: "المكتبة الشاملة، التثبيت على macOS",
    eduVideoSearchPanel: "المكتبة الشاملة، استخدام لوحة البحث",
    eduVideoClaudeExt: "استخدام المكتبة الشاملة مع عميل ذكاء اصطناعيّ",
    eduVideoChh: "جامع خادم الحرمين، التثبيت والمشكلات الشائعة",
    eduVideoChhWindow: "جامع خادم الحرمين، حلّ مشكلة النافذة",
    eduVideoCevami: "جوامع الكلم، التثبيت",
    eduPostNotebookLM:
      "العمل على الكتب المستخرجة من المكتبة الشاملة بواسطة NotebookLM",
    eduPostVolumeLimit:
      "الحصول على نتائج أفضل في NotebookLM بتقليص حجم الكتاب",
    eduPostShamelaFeature: "ميزةٌ في المكتبة الشاملة قليلة الشهرة عظيمة الفائدة",
    eduPostYdsCards: "إعداد بطاقات مفردات اختبار YDS بواسطة Gemini وNotebookLM",
    eduPostDataPrivacy:
      "منع الشركات من استخدام النصوص الأكاديمية والبيانات الشخصية التي تُعطى لنماذج اللغة (ChatGPT وGemini وClaude)",
    eduPostPdfDarkMode: "مواقع تحوّل ملفات PDF إلى الوضع الداكن",
    eduPostDeepL:
      "أداة سطح مكتب تترجم النصّ المحدَّد في أيّ برنامج (DeepL)",
    footerRights: "جميع الحقوق محفوظة.",
    agOlum: "ت",
    agSuzgecKaldir: "إزالة كل المرشِّحات",
    agSuzgecIpucu: "يمكنك التصفية حسب السنوات والأقاليم بالنقر على الشريطين الجانبيين.",
    agAra: "ابحث عن راوٍ",
    agHocalari: "شيوخه",
    agTalebeleri: "تلاميذه",
    agKayitYok: "لا يوجد",
    agRivayetBagi: "صلة الرواية",
    agKaynak: "المصدر",
    agTahricRumuzu: "رمز التخريج",
    agMuksirun: "من المكثرين",
    agMuellif: "من مؤلفي الكتب الستة",
    agTabaka0: "الأصل",
    agTabaka1: "الصحابة",
    agTabaka2: "كبار التابعين",
    agTabaka3: "الوسطى",
    agTabaka4: "صغار التابعين",
    agTabaka5: "أتباع التابعين",
    agTabaka6: "ما بعد المؤلفين",
    agMedar1: "الطبقة الأولى — المدوِّنون",
    agMedar2: "الطبقة الثانية — المصنِّفون",
    agMedar3: "الطبقة الثالثة — النقاد والفقهاء من المحدِّثين",
    agGiris:
      "التراجم والصلات في هذه الخريطة مأخوذة من تهذيب الكمال للمزّيّ ومن تقريب التهذيب وتهذيب التهذيب لابن حجر، وحلقات تلاميذ أصحاب الكتب الستّة من سير أعلام النبلاء للذهبيّ؛ وتصنيف الطبقات على التقريب، وبعض سنيّ الوفيات على دائرة المعارف الإسلاميّة التركيّة. وقد بدأت الشبكة بمن عدّهم عليّ بن المدينيّ مدارًا للإسناد وبالمكثرين من الصحابة، غير أنّها لم تعد مقصورة عليهم: فمن رواتها البالغين 821 راويًا في ثلاث عشرة بلدة واحدٌ وثلاثون فحسب من تلك النواة، وسائرهم جاء من قوائم الشيوخ والتلاميذ في التراجم المعالَجة، وعدد الصلات بينهم 5904. وتنتهي الشبكة عند رواة الكتب الستّة؛ وطبقة شيوخ المؤلّفين أنفسهم قد اتّسعت كثيرًا لكنّها ما زالت ناقصة، كما أنّ بعض الرواة لم يُعالَج منهم إلّا الشيوخ أو إلّا التلاميذ.",
    agHaritayaGit: "اضغط للوصول إلى الخريطة",
  },
  en: {
    brandAlt: "Hadith and Digital",
    title: "Trying Something.",
    welcome: "Welcome to My Test Broadcast.",
    descriptionQuestion:
      "Is it possible to combine the classical and the contemporary?",
    descriptionRephrase: "Or let's put it this way:",
    descriptionHadith: "Hadith",
    descriptionAnd: "and",
    descriptionDigital: "Digital.",
    begin: "Let's Begin",
    about: "About Mustafâ",
    themeToggle: "Toggle dark mode",
    languageToggle: "Change language",
    greetingLead: "Hi, I'm Mustafâ.",
    greetingBody:
      "I'm a theologian and a developer. But more of a theologian. I set this page up to share the work where I bring the classical hadith sciences together with digital tools. There is a lot of work ahead of us.",
    greetingMore: "Click for more information.",
    workingOnIt: "Mustafâ is working on this.",
    journeyAhead:
      "A journey is drawing near. Let us learn the travel routes of the authors of the Six Books. But first I must prepare. Mustafâ is working on this.",
    pageNotCreated:
      "You are here right now. Mustafâ hasn't made such a page yet. But... Why not?",
    cardPreparing: "In preparation",
    podcastHadithHistory: "History of Hadith",
    podcastCatGeography: "Geography, Ṭabaqāt and Historiography",
    podcastCatTerms: "Terminology of Uṣūl al-Ḥadīth",
    podcastCatUsulLit: "Development of the Uṣūl al-Ḥadīth Literature",
    podcastCatRijal: "Rijāl and al-Jarḥ wa-l-Taʿdīl",
    podcastCatIlal: "ʿIlal and the Critical Method",
    podcastCatTahammul: "Uṣūl al-Riwāya, Taḥammul and Adāʾ",
    podcastCatSources: "Source Types and Knowledge of the Literature",
    podcastCatSitte: "Kutub al-Sitta and al-Tisʿa",
    podcastCatFiqh: "Ḥadīth, Fiqh and the Madhhabs",
    podcastCatKalam: "Ḥadīth, Kalām and ʿAqīda",
    podcastCatQuran: "Sunna and Qurʾān",
    podcastCatOrientalism: "Orientalism and Modern Debates",
    podcastCatCurrent: "Contemporary Issues and Relations with Other Disciplines",
    podcastEp001: "K2 001 Transmission in the era of the Prophet and the Companions",
    podcastEp002: "K1 002 The writing down of ḥadīth, from ḍabṭ al-ṣudūr to ḍabṭ al-suṭūr",
    podcastEp003: "K1 003 The Fitna and the beginning of the isnād",
    podcastEp004: "K1 004 The process of tadwīn",
    podcastEp005: "K1 005 The era of taṣnīf, before and after",
    podcastEp006: "K2 006 Second-century narrations and the earliest muṣannifs",
    podcastEp007: "K2 007 The Miḥna",
    podcastEp008: "K2 008 The phenomenon of rafʿ and the transformation of transmission",
    playerPlay: "Play",
    playerPause: "Pause",
    playerBack5: "Back 5 seconds",
    playerForward5: "Forward 5 seconds",
    playerSpeed: "Playback speed",
    playerSeek: "Seek",
    playerReplay: "Play from start",
    playerFailed: "The audio file could not be loaded.",
    comingSoon: "Coming soon",
    gameResuleKavusmak: "Meeting the Messenger",
    gameDilAntrenmani: "1 Word 3 Languages",
    indexLead: "What's here",
    cardNetworks: "Narrator Networks",
    cardNetworksDesc: "Mapping teacher-student links between hadith narrators.",
    cardGames: "Games",
    cardGamesDesc: "Let us learn while playing.",
    cardPodcasts: "Podcasts",
    cardPodcastsDesc:
      "Podcasts on hadith history, methodology, literature and orientalism.",
    cardRihle: "Journeys",
    cardRihleDesc:
      "Let us learn the travel routes of the authors of the Six Books.",
    cardEducation: "Training Content and Other Services",
    cardEducationDesc: "Courses taught, guide videos and posts.",
    eduVideos: "Guide videos",
    eduPosts: "Posts",
    eduVideoShamelaSetup: "al-Maktaba al-Shāmila, installation",
    eduVideoMacbook: "al-Maktaba al-Shāmila, installation on macOS",
    eduVideoSearchPanel: "al-Maktaba al-Shāmila, using the search panel",
    eduVideoClaudeExt: "Using al-Maktaba al-Shāmila with an AI client",
    eduVideoChh: "Jāmiʿ Khādim al-Ḥaramayn, installation and common problems",
    eduVideoChhWindow: "Jāmiʿ Khādim al-Ḥaramayn, solving the window problem",
    eduVideoCevami: "Jawāmiʿ al-Kalim, installation",
    eduPostNotebookLM: "Working on books exported from Shamela with NotebookLM",
    eduPostVolumeLimit:
      "Getting better results in NotebookLM by limiting the size of the work",
    eduPostShamelaFeature: "A little-known but very useful feature of Shamela",
    eduPostYdsCards:
      "Making YDS vocabulary cards with Gemini and NotebookLM",
    eduPostDataPrivacy:
      "Stopping companies from using the academic texts and personal data you give to language models (ChatGPT, Gemini, Claude)",
    eduPostPdfDarkMode: "Sites that convert PDFs to dark mode",
    eduPostDeepL:
      "A desktop tool that translates selected text in any program (DeepL)",
    footerRights: "All rights reserved.",
    agOlum: "d.",
    agSuzgecKaldir: "Clear All Filters",
    agSuzgecIpucu: "You can filter by year and region using the bands along the edges.",
    agAra: "Find a Narrator",
    agHocalari: "Teachers",
    agTalebeleri: "Students",
    agKayitYok: "no record",
    agRivayetBagi: "Transmission link",
    agKaynak: "Source",
    agTahricRumuzu: "Collection symbol",
    agMuksirun: "among the muksirūn",
    agMuellif: "author of the Six Books",
    agTabaka0: "Source",
    agTabaka1: "Companions",
    agTabaka2: "Senior successors",
    agTabaka3: "Middle successors",
    agTabaka4: "Junior successors",
    agTabaka5: "Followers of the successors",
    agTabaka6: "After the authors",
    agMedar1: "Tier I — recorders (tadwīn)",
    agMedar2: "Tier II — arrangers (taṣnīf)",
    agMedar3: "Tier III — critic and jurist traditionists",
    agGiris:
      "The entries and the links come from al-Mizzī's Tahdhīb al-Kamāl and from Ibn Ḥajar's Taqrīb al-Tahdhīb and Tahdhīb al-Tahdhīb, and the student circles of the authors of the Six Books from al-Dhahabī's Siyar aʿlām al-nubalāʾ; the ṭabaqāt classification rests on the Taqrīb, and some of the death dates on the Turkish Encyclopaedia of Islam. The network began with the narrators ʿAlī b. al-Madīnī counts as madār and with the muksirūn among the Companions, but it is no longer confined to them: of its 821 narrators across thirteen towns only thirty-one come from that core, the rest having emerged from the teacher and student lists of the entries worked through, with 5,904 links between them. The network stops at the transmitters of the Six Books; the ṭabaqa of the authors' own teachers has grown a great deal but is still incomplete, and for some narrators only the teachers or only the students have been worked through.",
    agHaritayaGit: "Click to open the map",
  },
};
