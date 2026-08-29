"use client";

import { usePathname } from "next/navigation";
import { LANGUAGE_LABELS, type Language } from "./translations";
import { useLanguage } from "./LanguageContext";
import SwapContent from "./SwapContent";
import { CIPLAK_YOLLAR } from "./ciplakYollar";

/* Ceviri isareti: Material Symbols'un `translate` glifi (Apache 2.0).

   BU, GOOGLE TRANSLATE'IN URUN LOGOSU DEGIL -- o logo (iki renkli konusma
   balonu) Google'in tescilli markasi ve sayfaya konulursa ziyaretciye
   "bu site Google Translate ile ceviriliyor" der. Oysa sitenin
   cevirileri elle yazilmis (app/translations.ts), makine cevirisi yok.
   Yanlis bir iddia olmasin diye herkesin tanidigi genel ceviri glifi
   secildi; anlami ayni, marka iddiasi yok. */
function TranslateIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px] shrink-0"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const { language, outgoingLanguage, cycleLanguage, t } = useLanguage();
  const yol = usePathname();

  /* Cercevesiz sayfalarda dugme hic cizilmiyor (bkz. ciplakYollar.ts).
     Kancalar YUKARIDA cagrildi, cikis burada: React kancalarin her
     render'da ayni sirayla calismasini istiyor, erken donus onlarin
     ustunde olamaz. */
  if (CIPLAK_YOLLAR.includes(yol)) return null;

  /* `rtl:flex-row-reverse` SART. Arapca'da <html dir="rtl"> oldugu icin
     flex satiri sagdan sola diziliyor ve ceviri glifi (DOM'da ikinci
     cocuk) etiketin SOLUNA geciyordu. Ters cevrilince fiziksel yerlesim
     uc dilde de ayni kaliyor: etiket solda, glif sagda. */
  return (
    <button
      type="button"
      onClick={cycleLanguage}
      className="lang-switcher fixed right-4 top-4 z-20 flex h-9 items-center justify-center gap-1.5 rounded-full border border-black/20 bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-black/[.04] rtl:flex-row-reverse dark:border-white/70 dark:hover:bg-[#1a1a1a]"
      aria-label={t.languageToggle}
      title={t.languageToggle}
    >
      {/* Sabit genislik: etiket degisince dugme genisligi ziplamasin. */}
      <SwapContent
        className="h-[18px] w-[24px]"
        current={language}
        outgoing={outgoingLanguage}
        render={(key) => LANGUAGE_LABELS[key as Language]}
      />
      <TranslateIcon />
    </button>
  );
}
