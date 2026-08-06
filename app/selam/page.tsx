"use client";

import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function Selam() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col px-6 pt-20 pb-10 sm:px-10 sm:pt-24">
      {/* Konusma balonu: kuyrugu alt kenarda duran, 45 derece dondurulmus
          bir kare. Kendi zemini balonunkiyle ayni oldugu icin altta kalan
          kenarligi kapatiyor, kendi iki kenarligi da cizgiyi surduruyor. */}
      <div className="relative max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
        <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim">
          {t.greeting}
        </p>
        <span
          aria-hidden="true"
          className="absolute -bottom-2 left-10 h-4 w-4 rotate-45 border-b border-r border-black/[.08] bg-background dark:border-white/[.145]"
        />
      </div>

      {/* Yuksekligi ekranin yarisi; genislik klibin kendi oranindan
          geliyor (canvas'in ic olcusu 720x722). */}
      <ChromaKeyVideo
        src="/Mustafa%20Karsilama_seffaf.mp4"
        className="fixed bottom-0 right-0 h-[50vh] w-auto max-w-none"
      />
    </main>
  );
}
