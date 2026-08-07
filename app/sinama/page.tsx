"use client";

import Link from "next/link";
import IntroVideo from "../IntroVideo";
import { useLanguage } from "../LanguageContext";
import SwapContent from "../SwapContent";
import { TRANSLATIONS, type Language } from "../translations";

/* GECICI: anasayfanin birebir kopyasi. Tek farki `IntroVideo`ya `deneme`
   bayragini vermesi; boylece yeniden anahtarlanan Kediler ve Derince
   klipleri (`public/sinama/`) anasayfaya dokunmadan yayinda gorulebiliyor.
   Icerik anasayfayla ayni kalmali, yoksa karsilastirma anlamini yitirir.
   Onaydan sonra bu klasor silinecek — `app/IntroVideo.tsx`'teki nota bak. */
export default function Sinama() {
  const { t, language, outgoingLanguage } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <IntroVideo deneme />
      {/* Icerik dikeyde ORTALANMIYOR, ustten sabit uzaklikta basliyor:
          ortalandiginda blogun toplam yuksekligi metnin uzunluguna bagli
          oldugu icin logo her dilde baska yerden basliyordu.

          Alttaki dolgu dar ekranda 35vh: giris klipleri sayfanin onunde
          (z-50) durdugu icin en uzunu "Mustafâ Hakkında" butonunu tam
          siniginda kesiyordu ve kaydiracak yer olmadigi icin buton
          acilamiyordu. Bu dolgu sayfayi kaydirilabilir yapip butonu
          klibin onunden yukari cikariyor. Genis ekranda klipler sag alt
          kosede kalip icerige degmedigi icin normal dolgu yetiyor. */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-8 px-16 pt-28 pb-[35vh] sm:items-start sm:pt-36 sm:pb-24">
        <span className="brand-logo" role="img" aria-label={t.brandAlt} />
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-start">
          <h1 className="site-title max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-foreground">
            {t.title}
          </h1>
          <p className="site-welcome text-base font-medium text-zinc-700 dark:text-cream-dim">
            {t.welcome}
          </p>
          <p className="site-description max-w-md text-lg leading-8 text-zinc-600 dark:text-cream-dimmer">
            {t.descriptionQuestion}
            <br />
            {t.descriptionRephrase}
            <br />
            <strong className="font-semibold">{t.descriptionHadith}</strong>{" "}
            {t.descriptionAnd}{" "}
            <strong className="font-semibold">{t.descriptionDigital}</strong>
          </p>
        </div>
        <div className="site-actions flex flex-col gap-4 text-base font-medium sm:flex-row">
          {/* Masaustunde genislik sabit degil, en az 158px: "Mustafâ
              Hakkinda" 158px'e sigmayip iki satira dusuyordu. Tasan
              durumda da yazi ortali kalsin diye text-center. */}
          <Link
            href="/selam"
            className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-center text-background transition-opacity hover:opacity-90 md:w-auto md:min-w-[158px]"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].begin}
            />
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/[.08] px-5 text-center transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-auto md:min-w-[158px]"
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].about}
            />
          </a>
        </div>
      </main>
    </div>
  );
}
