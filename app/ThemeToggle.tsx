"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import { CIPLAK_YOLLAR } from "./ciplakYollar";

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
  const yol = usePathname();

  const isDark = theme === "dark";

  /* Cercevesiz sayfalarda dugme hic cizilmiyor (bkz. ciplakYollar.ts).
     Kancalar YUKARIDA cagrildi, cikis burada: React kancalarin her
     render'da ayni sirayla calismasini istiyor, erken donus onlarin
     ustunde olamaz. */
  if (CIPLAK_YOLLAR.includes(yol)) return null;

  /* Gecis suresi globals.css'teki `.tema-gecisi` ile AYNI (450ms):
     topuz kayarken sayfa renkleri de doniyor, ikisi ayni anda bitsin.
     Egri easeOutQuint -- basta hizli, sonda uzun uzun yavaslayan bir
     yumusama; duz `ease-out`tan daha sakin duruyor. */
  const gecis = "duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)]";
  /* Ikonlar 450ms'in YARISINDA hareket ediyor: biri ilk yarida cikiyor,
     digeri ikinci yarida giriyor (asagidaki `delay` degerlerine bkz.).
     Ikisi arka arkaya oynadigi icin toplam yine 450ms. */
  const ikonGecis = "duration-[225ms] ease-[cubic-bezier(0.22,1,0.36,1)]";

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
      dir="ltr"
      aria-checked={isDark}
      onClick={toggle}
      className="fixed left-4 top-4 z-20 flex h-9 w-16 items-center rounded-full border border-black/20 bg-background p-1 transition-colors hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]"
      aria-label={t.themeToggle}
      title={t.themeToggle}
    >
      {/* `dir="ltr"` SART, hem de yalnizca bu dugmede. Arapca'da sayfanin
          tamami `dir="rtl"` ve o zaman rayin flex baslangici sag kenara
          geciyor: topuz sagda basliyor, ikonlarin yerlesimi TR/EN'in
          aynasi oluyordu. Once `rtl:-translate-x-7` ile kaydirma yonu
          ters cevrilmisti (yani ayna DAVRANIS korunmustu), ama istenen
          bu degil (Mustafa, 2026-08-29): dugme uc dilde de BIREBIR ayni
          gorunsun -- acik temada topuz solda ay yildizla, koyu temada
          sagda gunesle.

          `dir` dugmenin ICINI LTR yapiyor, sayfanin yonune dokunmuyor.
          Icinde metin olmadigi icin (yalnizca topuz ve iki ikon) baska
          hicbir yan etkisi yok. Ayni yaklasim dil dugmesinde
          `rtl:flex-row-reverse` ile cozulmustu; orada metin var, burada
          yok. */}
      <span
        className={`relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-foreground text-background transition-transform ${gecis} ${
          isDark ? "translate-x-7" : "translate-x-0"
        }`}
      >
        {/* Ikonlar AYNI ANDA degil SIRAYLA hareket ediyor.

            Bu ucuncu deneme. Ilk ikisi neden tutmadi:
            1) Kucuk bir yatay kaydirma eklendi -- yetmedi, cunku sorun
               kaydirmanin miktari degildi.
            2) Kaydirma buyutulup topuz kirpildi -- o da yetmedi, cunku
               sorun ikonlarin nereye gittigi degil NE ZAMAN gittigiydi.

            Asil sebep: iki ikon ayni 450ms icinde birlikte hareket
            ediyordu. Capraz gecis boyunca ikisi de yari saydam, ama
            biri sonunda tam gorunur kaldigi icin goz hep ONU takip
            ediyor. Sonuc: hangi yone gidilirse gidilsin "gelen ikon"
            akilda kaliyor, giden fark edilmiyordu. Koyudan aciga
            gecerken gelen ikon hilal oldugu icin "yine ay yildiz
            yuvarlaniyor" goruluyordu.

            Cozum: 450ms ikiye bolundu. Giden ikon ilk yarida sahneyi
            tek basina kullanip cikiyor, gelen ikon ikinci yarida
            geliyor. `delay-0` cikana, `delay-[225ms]` gelene.

              acik -> koyu   0-225ms hilal SAG kenardan cikar
                             225-450ms gunes SOL kenardan girer
              koyu -> acik   0-225ms gunes SOL kenardan cikar
                             225-450ms hilal SAG kenardan girer

            Toplam sure yine 450ms, yani topuzun kaymasi ve sayfa
            renklerinin donusuyle ayni anda bitiyor.

            Gunesin DONUSU hala gorunmuyor (8 esit isin, 45 derecelik
            simetri, 90 derecelik donus sekli kendisiyle ortusuyor);
            yuvarlanma hissini kenardan cikip kirpilma veriyor. */}
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-all ${ikonGecis} ${
            isDark
              ? "translate-x-[20px] rotate-90 opacity-0 delay-0"
              : "translate-x-0 rotate-0 opacity-100 delay-[225ms]"
          }`}
        >
          <CrescentIcon />
        </span>
        <span
          aria-hidden="true"
          className={`absolute inset-0 flex items-center justify-center transition-all ${ikonGecis} ${
            isDark
              ? "translate-x-0 rotate-0 opacity-100 delay-[225ms]"
              : "translate-x-[-20px] -rotate-90 opacity-0 delay-0"
          }`}
        >
          <SunIcon />
        </span>
      </span>
    </button>
  );
}
