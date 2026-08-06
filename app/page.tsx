"use client";

import Image from "next/image";
import IntroVideo from "./IntroVideo";
import { useLanguage } from "./LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <IntroVideo />
      {/* Icerik dikeyde ortalandigi icin alt dolgunun ancak yarisi
          gorunur bosluga donusuyor: pb, pt'den 112px fazla verilerek
          About butonunun altinda ~38px aciklik birakiliyor. */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 px-16 pt-20 pb-48 sm:items-start">
        <Image
          className="dark:invert"
          src="/HD-logo.png"
          alt={t.brandAlt}
          width={44}
          height={33}
          priority
        />
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-start">
          <h1 className="site-title max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {t.title}
          </h1>
          <p className="site-welcome text-base font-medium text-zinc-700 dark:text-zinc-300">
            {t.welcome}
          </p>
          <p className="site-description max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
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
          <span className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background md:w-[158px]">
            {t.begin}
          </span>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.about}
          </a>
        </div>
      </main>
    </div>
  );
}
