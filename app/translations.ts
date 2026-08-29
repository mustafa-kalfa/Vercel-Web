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
  workingOnIt: string;
  journeyAhead: string;
  pageNotCreated: string;
  podcastHadithHistory: string;
  podcastHadithMethodology: string;
  podcastHadithLiterature: string;
  podcastOrientalism: string;
  podcastMihna: string;
  podcastOtherTopics: string;
  playerPlay: string;
  playerPause: string;
  playerBack5: string;
  playerForward5: string;
  playerSpeed: string;
  playerSeek: string;
  playerReplay: string;
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
  eduVideoCevami: string;
  eduPostNotebookLM: string;
  eduPostVolumeLimit: string;
  eduPostShamelaFeature: string;
  eduPostYdsCards: string;
  eduPostDataPrivacy: string;
  footerRights: string;
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
      "İlahiyatçı ve yazılımcıyım. Ama daha çok ilahiyatçı. Akademik koşuşturmacadan bir nebze uzaklaşmak için bu sayfayı kurdum. Buraya hadis ve dijitali birleştirmeyi denediğim çalışmaları yükleyeceğim. Ne kadar malzeme çıkar ve ne kadar devam ettirebilirim bilmiyorum. Şimdilik buradayım :D",
    workingOnIt: "Mustafâ bu iş üzerinde çalışıyor.",
    journeyAhead: "Bir yolculuk yaklaşıyor. Ama önce hazırlık yapmalıyım.",
    pageNotCreated:
      "Şu anda buradasınız. Mustafâ henüz böyle bir sayfa oluşturmadı. Fakat... Neden olmasın?",
    podcastHadithHistory: "Hadis Tarihi",
    podcastHadithMethodology: "Hadis Usûlü",
    podcastHadithLiterature: "Hadis Edebiyatı",
    podcastOrientalism: "Oryantalizm",
    podcastMihna: "Mihne Hâdisesi",
    podcastOtherTopics: "Diğer Konular",
    playerPlay: "Oynat",
    playerPause: "Duraklat",
    playerBack5: "5 saniye geri",
    playerForward5: "5 saniye ileri",
    playerSpeed: "Oynatma hızı",
    playerSeek: "Ses konumu",
    playerReplay: "Baştan çal",
    indexLead: "Burada neler var",
    cardNetworks: "Râvi İlişki Ağları",
    cardNetworksDesc: "Râvilerin hoca-talebe bağlarını haritalama çalışması.",
    cardGames: "Oyunlar",
    cardGamesDesc: "İsnâd zincirini doğru sırayla tamamla.",
    cardPodcasts: "Podcastler",
    cardPodcastsDesc:
      "Hadis tarihi, usûlü, edebiyatı ve oryantalizm üzerine podcastler.",
    cardRihle: "Rihleler",
    cardRihleDesc: "Bir yolculuk yaklaşıyor.",
    cardEducation: "Eğitim İçerikleri ve Diğer Hizmetler",
    cardEducationDesc: "Verilen eğitimler, rehber videoları ve paylaşımlar.",
    eduVideos: "Rehber videoları",
    eduPosts: "Paylaşımlar",
    eduVideoShamelaSetup:
      "el-Mektebetü'ş-Şâmile Kullanım Rehberi 1 — Kurulum Videosu",
    eduVideoMacbook: "Macbook'a Windows ve Şâmile Kurulumu",
    eduVideoSearchPanel: "Arama Paneli 1 — el-Mektebetü'ş-Şâmile Rehberi 3",
    eduVideoClaudeExt:
      "Şâmile ile Türkçe Konuşmak! Claude'a Şâmile Eklentisi Nasıl Kurulur?",
    eduVideoChh:
      "Camiu Hâdimi'l-Haremeyn (CHH) Kurulumu, Sık Karşılaşılan Sorunlar ve Çözümleri",
    eduVideoCevami: "Cevâmiü'l-kelim Programı Kurulumu",
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
    footerRights: "Tüm hakları saklıdır.",
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
      "باحث شرعي ومبرمج، لكنني باحث شرعي أكثر. أنشأت هذه الصفحة للابتعاد قليلاً عن زحمة العمل الأكاديمي. سأرفع هنا الأعمال التي أحاول فيها الجمع بين الحديث والديجيتالية. لا أدري كم ستخرج من مادة ولا إلى متى أستطيع الاستمرار. أنا هنا في الوقت الحالي :ᗡ",
    workingOnIt: "مصطفى يعمل على هذا الأمر.",
    journeyAhead: "رحلةٌ تقترب. ولكن لا بدّ لي من الاستعداد أوّلًا.",
    pageNotCreated:
      "أنتم الآن هنا. لم يُنشئ مصطفى هذه الصفحة بعدُ. ولكن... لِمَ لا؟",
    podcastHadithHistory: "تاريخ الحديث",
    podcastHadithMethodology: "علم مصطلح الحديث",
    podcastHadithLiterature: "أدب الحديث",
    podcastOrientalism: "الاستشراق",
    podcastMihna: "حادثة المحنة",
    podcastOtherTopics: "مواضيع أخرى",
    playerPlay: "تشغيل",
    playerPause: "إيقاف مؤقت",
    playerBack5: "خمس ثوانٍ إلى الوراء",
    playerForward5: "خمس ثوانٍ إلى الأمام",
    playerSpeed: "سرعة التشغيل",
    playerSeek: "موضع الصوت",
    playerReplay: "التشغيل من البداية",
    indexLead: "ما الذي تجده هنا",
    cardNetworks: "شبكات علاقات الرواة",
    cardNetworksDesc: "محاولةٌ لرسم صلات الشيوخ والتلاميذ بين الرواة.",
    cardGames: "الألعاب",
    cardGamesDesc: "أتمِمْ سلسلة الإسناد بترتيبها الصحيح.",
    cardPodcasts: "التسجيلات الصوتية",
    cardPodcastsDesc:
      "تسجيلات في تاريخ الحديث وأصوله وأدبه والاستشراق.",
    cardRihle: "الرحلات",
    cardRihleDesc: "رحلةٌ تقترب.",
    cardEducation: "المحتوى التعليمي وخدمات أخرى",
    cardEducationDesc: "دوراتٌ وفيديوهات إرشادية ومنشورات.",
    eduVideos: "الفيديوهات الإرشادية",
    eduPosts: "المنشورات",
    eduVideoShamelaSetup: "دليل استخدام المكتبة الشاملة ١ — فيديو التثبيت",
    eduVideoMacbook: "تثبيت ويندوز والمكتبة الشاملة على ماك بوك",
    eduVideoSearchPanel: "لوحة البحث ١ — دليل المكتبة الشاملة ٣",
    eduVideoClaudeExt:
      "التحدّث إلى الشاملة بالتركية! كيف تُثبَّت إضافة الشاملة في Claude؟",
    eduVideoChh: "تثبيت جامع خادم الحرمين: المشكلات الشائعة وحلولها",
    eduVideoCevami: "تثبيت برنامج جوامع الكلم",
    eduPostNotebookLM:
      "العمل على الكتب المستخرجة من المكتبة الشاملة بواسطة NotebookLM",
    eduPostVolumeLimit:
      "الحصول على نتائج أفضل في NotebookLM بتقليص حجم الكتاب",
    eduPostShamelaFeature: "ميزةٌ في المكتبة الشاملة قليلة الشهرة عظيمة الفائدة",
    eduPostYdsCards: "إعداد بطاقات مفردات اختبار YDS بواسطة Gemini وNotebookLM",
    eduPostDataPrivacy:
      "منع الشركات من استخدام النصوص الأكاديمية والبيانات الشخصية التي تُعطى لنماذج اللغة (ChatGPT وGemini وClaude)",
    footerRights: "جميع الحقوق محفوظة.",
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
      "I'm a theologian and a developer. But more of a theologian. I set this page up to get some distance from the academic rush. I'll be posting the work where I try to combine hadith and digital here. I don't know how much will come of it, or how long I can keep it going. For now, I'm here :D",
    workingOnIt: "Mustafâ is working on this.",
    journeyAhead: "A journey is drawing near. But first I must prepare.",
    pageNotCreated:
      "You are here right now. Mustafâ hasn't made such a page yet. But... Why not?",
    podcastHadithHistory: "History of Hadith",
    podcastHadithMethodology: "Hadith Methodology",
    podcastHadithLiterature: "Hadith Literature",
    podcastOrientalism: "Orientalism",
    podcastMihna: "The Mihna",
    podcastOtherTopics: "Other Topics",
    playerPlay: "Play",
    playerPause: "Pause",
    playerBack5: "Back 5 seconds",
    playerForward5: "Forward 5 seconds",
    playerSpeed: "Playback speed",
    playerSeek: "Seek",
    playerReplay: "Play from start",
    indexLead: "What's here",
    cardNetworks: "Narrator Networks",
    cardNetworksDesc: "Mapping teacher-student links between hadith narrators.",
    cardGames: "Games",
    cardGamesDesc: "Complete the chain of transmission in the right order.",
    cardPodcasts: "Podcasts",
    cardPodcastsDesc:
      "Podcasts on hadith history, methodology, literature and orientalism.",
    cardRihle: "Journeys",
    cardRihleDesc: "A journey is drawing near.",
    cardEducation: "Training Content and Other Services",
    cardEducationDesc: "Courses taught, guide videos and posts.",
    eduVideos: "Guide videos",
    eduPosts: "Posts",
    eduVideoShamelaSetup: "al-Maktaba al-Shamela Guide 1 — Installation",
    eduVideoMacbook: "Installing Windows and Shamela on a MacBook",
    eduVideoSearchPanel: "Search Panel 1 — al-Maktaba al-Shamela Guide 3",
    eduVideoClaudeExt:
      "Talking to Shamela in Turkish! How to install the Shamela extension for Claude",
    eduVideoChh:
      "Installing Jāmiʿ Khādim al-Ḥaramayn (CHH): common problems and fixes",
    eduVideoCevami: "Installing the Jawāmiʿ al-Kalim program",
    eduPostNotebookLM: "Working on books exported from Shamela with NotebookLM",
    eduPostVolumeLimit:
      "Getting better results in NotebookLM by limiting the size of the work",
    eduPostShamelaFeature: "A little-known but very useful feature of Shamela",
    eduPostYdsCards:
      "Making YDS vocabulary cards with Gemini and NotebookLM",
    eduPostDataPrivacy:
      "Stopping companies from using the academic texts and personal data you give to language models (ChatGPT, Gemini, Claude)",
    footerRights: "All rights reserved.",
  },
};
