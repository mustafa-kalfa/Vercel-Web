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
    pageNotCreated:
      "Şu anda buradasınız. Mustafâ henüz böyle bir sayfa oluşturmadı. Fakat neden olmasın?",
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
    pageNotCreated:
      "أنتم الآن هنا. لم يُنشئ مصطفى هذه الصفحة بعدُ. ولكن لِمَ لا؟",
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
    pageNotCreated:
      "You are here right now. Mustafâ hasn't made such a page yet. But why not?",
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
  },
};
