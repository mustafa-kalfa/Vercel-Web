"use client";

import IntroVideo from "./IntroVideo";
import { useLanguage } from "./LanguageContext";
import SwapContent from "./SwapContent";
import { TRANSLATIONS, type Language } from "./translations";

export default function Home() {
  const { t, language, outgoingLanguage } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <IntroVideo />
      {/* Icerik dikeyde ortalandigi icin alt dolgunun ancak yarisi
          gorunur bosluga donusuyor: pb, pt'den 112px fazla verilerek
          About butonunun altinda ~38px aciklik birakiliyor. */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 px-16 pt-20 pb-48 sm:items-start">
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
          <span className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-center text-background md:w-auto md:min-w-[158px]">
            {t.begin}
          </span>
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
