"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function MustafaCalisiyor() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
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
      <div className="px-6 pt-24 sm:px-10 sm:pt-28">
        <div className="relative ml-auto max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
          <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim ar-greeting">
            {t.workingOnIt}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-black/[.08] bg-background dark:border-white/[.145]"
          />
        </div>
      </div>

      <div aria-hidden="true" className="h-[60vh] shrink-0 sm:h-0" />

      {/* KONUM `absolute`, `fixed` DEGIL. fixed iken klip gorunum
          alaninin dibine yapisiyor ve sayfa sonuna gelindiginde
          footer'in uzerini ortuyordu. absolute olunca sarmalayici
          <main>'in (relative) dibine yapisiyor, yani tam footer'in
          USTUNE -- footer layout.tsx'ten geldigi ve bu ogenin disinda
          kaldigi icin ortusme artik imkansiz. */}
      <ChromaKeyVideo
        src="/Mustafa%20Karsilama_seffaf.mp4"
        className="absolute bottom-0 right-0 h-[50vh] w-auto max-w-none"
      />
    </main>
  );
}
