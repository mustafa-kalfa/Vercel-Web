"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function Selam() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Ana sayfaya donus. Dil ve tema dugmeleri gibi sabit duruyor ki
          sayfa kaydirildiginda da erisilebilsin; iki dugmenin arasinda
          ortada kaliyor.

          Statik `.brand-logo` maskesi yerine `HD-Mini.mp4`: anasayfadaki
          logo klibinin ilk 61 karesi (2.03 sn), yalnizca HD monogramini
          cizen bolum. 62. karede H ile D'nin kosegen baglantisi kopmaya
          basliyor, o yuzden orada kesildi. `-c copy` ile kesildigi icin
          yeniden kodlanmadi.

          Kutu `h-9`dan yuksek: `.brand-logo` sikica kirpilmis bir PNG
          maskesiydi, videoda ise monogram kadrajin ortadaki %45'ini
          kapliyor (olculdu: 924x484 / 1920x1080) -- kalan pay, cizim
          sirasinda etrafta suzulen yaylara ait. 72px'lik kutuda monogram
          32px cikiyor, yani eski maskeyle ayni gorunur boyda. Genislik
          verilmiyor, oran klibin kendisinden geliyor.

          `brightness-0 dark:brightness-100`: klibin renk yarisi koyu tema
          foreground'uyla (#e5dfd0) tintli, koyu temada filtre gerekmiyor;
          acik temada brightness RGB'yi sifirlayip siyaha indiriyor. Ayni
          yontem anasayfadaki animasyonlu logoda da var. */}
      <Link
        href="/"
        aria-label={t.brandAlt}
        className="absolute left-1/2 top-1 z-20 flex h-[72px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[72px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>
      {/* Balon ustten sabit uzaklikta: alta yaslasaydi yuksekligi metnin
          uzunluguyla degistigi icin ust kenari her dilde baska yerden
          baslardi. `ml-auto` mantiksal degil fiziksel: Arapca'da (rtl) da
          balonu sagda, yani karakterin ustunde tutuyor. */}
      <div className="px-6 pt-24 sm:px-10 sm:pt-28">
        {/* Kuyruk: 45 derece dondurulmus bir kare. Kendi zemini balonunkiyle
            ayni oldugu icin altta kalan kenarligi kapatiyor, kendi iki
            kenarligi da cizgiyi surduruyor. */}
        <div className="relative ml-auto max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
          <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim ar-greeting">
            {t.greetingLead}
            <br />
            {t.greetingBody}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-black/[.08] bg-background dark:border-white/[.145]"
          />
        </div>
      </div>

      {/* Karakter dar ekranda balonun alt kismini ortuyor. Bu bos pay
          sayfayi kaydirilabilir yapiyor: asagi kaydirinca balon karakterin
          onunden yukari cikip tamamen okunuyor. Genis ekranda ortusme
          olmadigi icin pay kapatiliyor.

          Pay da klip ile birlikte yarilandi (60 -> 30vh): karakter yari
          boya inince ortu de yarisina indi. */}
      <div aria-hidden="true" className="h-[30vh] shrink-0 sm:h-0" />

      {/* Yuksekligi ekranin CEYREGI (once yarisiydi, 2026-08-28'de
          yarilandi); genislik klibin kendi oranindan geliyor (canvas'in
          ic olcusu 720x722). */}
      <ChromaKeyVideo
        src="/Mustafa%20Karsilama_seffaf.mp4"
        className="fixed bottom-0 right-0 h-[25vh] w-auto max-w-none"
      />
    </main>
  );
}
