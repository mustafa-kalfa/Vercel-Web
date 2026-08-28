"use client";

import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

/* Tombul hilal + yildiz: acik moddayken gorunur, "karanliga gec" demek.
   Hilal, buyuk dairenin icinden kaydirilmis ikinci dairenin maske ile
   cikarilmasiyla olusuyor; iki yaricapin farki (8 / 6.5) genis govdeyi
   veriyor. */
function CrescentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
      focusable="false"
    >
      <mask id="crescent-mask">
        <circle cx="10" cy="12" r="8" fill="white" />
        <circle cx="13.5" cy="12" r="6.5" fill="black" />
      </mask>
      <rect
        width="24"
        height="24"
        fill="currentColor"
        mask="url(#crescent-mask)"
      />
      <path
        d="M16.8 9 L17.47 11.07 L19.65 11.07 L17.89 12.35 L18.56 14.43 L16.8 13.15 L15.04 14.43 L15.71 12.35 L13.95 11.07 L16.13 11.07 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* Gunes: karanlik moddayken gorunur, "aydinliga don" demek. */
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[15px] w-[15px]"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="4.6" fill="currentColor" />
      <g
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      >
        <line x1="12" y1="5.4" x2="12" y2="2.8" />
        <line x1="12" y1="18.6" x2="12" y2="21.2" />
        <line x1="18.6" y1="12" x2="21.2" y2="12" />
        <line x1="5.4" y1="12" x2="2.8" y2="12" />
        <line x1="16.67" y1="7.33" x2="18.51" y2="5.49" />
        <line x1="7.33" y1="16.67" x2="5.49" y2="18.51" />
        <line x1="16.67" y1="16.67" x2="18.51" y2="18.51" />
        <line x1="7.33" y1="7.33" x2="5.49" y2="5.49" />
      </g>
    </svg>
  );
}

/* Kaydirmali tema anahtari.

   Olculer: ray 64x36 (sitedeki diger dugmelerle ayni 36px yukseklik,
   boylece dil dugmesiyle hizali kaliyor), topuz 28px, iki yanda 4px pay
   -> topuzun gidecegi yol tam 28px (64 - 4 - 4 - 28).

   HAREKET tek bir durumdan (`isDark`) besleniyor, yani hem gidis hem
   donus kendiliginden calisiyor: topuz saga kayarken hilal kucultup
   dondurulerek siliniyor, ayni anda gunes buyuyerek geliyor; tekrar
   basildiginda ayni sey ters yonde oluyor. Iki ikon da topuzun icinde
   ust uste duruyor (`absolute inset-0`), yani biri digerini iterek yer
   degistirmiyor -- gecis boyunca merkez sabit.

   `prefers-reduced-motion` istisnasi YOK (Mustafa'nin acik talimati,
   2026-08-29): animasyon guc modu dusuk cihazlarda da gorunsun. Ayni
   karar globals.css'teki tema gecisi blogunda ve swap-in/swap-out'ta da
   gecerli, gerekcesi orada. */
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";

  /* Gecis suresi globals.css'teki `.tema-gecisi` ile AYNI (450ms):
     topuz kayarken sayfa renkleri de doniyor, ikisi ayni anda bitsin.
     Egri easeOutQuint -- basta hizli, sonda uzun uzun yavaslayan bir
     yumusama; duz `ease-out`tan daha sakin duruyor. */
  const gecis =
    "duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

  const toggle = () => {
    /* Gecis sinifi once ekleniyor, tema ONDAN SONRA degisiyor: sinif
       ayni karede girmezse tarayici eski (kisa) sureyle animasyona
       baslar. Sure dolunca temizleniyor, yoksa hover'lar da kalici
       olarak agirlasirdi. */
    const kok = document.documentElement;
    kok.classList.add("tema-gecisi");
    toggleTheme();
    window.setTimeout(() => kok.classList.remove("tema-gecisi"), 450);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggle}
      className="fixed left-4 top-4 z-20 flex h-9 w-16 items-center rounded-full border border-black/20 bg-background p-1 transition-colors hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]"
      aria-label={t.themeToggle}
      title={t.themeToggle}
    >
      {/* `rtl:-translate-x-7` SART. Arapca'da <html dir="rtl"> oldugu icin
          rayin flex baslangici SAG kenar, yani topuz sagda duruyor.
          Yalnizca `translate-x-7` verilirse topuz oradan bir 28px daha
          saga itiliyor ve rayin TAMAMEN DISINA cikiyor (olculdu: ray
          16-80, topuz 75-103). Ters yone kaydirinca hareket RTL'de de
          "obur uca git" anlamina geliyor: hilal sagda basliyor, sola
          kayarken gunese donuyor. */}
      <span
        className={`relative flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background transition-transform ${gecis} ${
          isDark ? "translate-x-7 rtl:-translate-x-7" : "translate-x-0"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-all ${gecis} ${
            isDark ? "scale-50 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        >
          <CrescentIcon />
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-all ${gecis} ${
            isDark ? "scale-100 rotate-0 opacity-100" : "scale-50 -rotate-90 opacity-0"
          }`}
        >
          <SunIcon />
        </span>
      </span>
    </button>
  );
}
