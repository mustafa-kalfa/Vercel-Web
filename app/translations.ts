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
  },
};
