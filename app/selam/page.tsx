"use client";

import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

export default function Selam() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Sarmalayici tam olarak ust yari (h-1/2): icindeki balon alta
          yaslandigi icin videonun hemen ustunde duruyor. Sayfaya dolgu
          eklemek yerine bu yol seciliyor, cunku 50vh'lik bir alt dolgu
          sayfayi viewport'tan uzun yapip kaydirma cubugu cikariyordu.
          `ml-auto` mantiksal degil fiziksel: Arapca'da (rtl) da balonu
          sagda, yani karakterin ustunde tutuyor. */}
      <div className="flex h-[50vh] flex-col justify-end px-6 pb-4 sm:px-10">
        {/* Kuyruk: 45 derece dondurulmus bir kare. Kendi zemini balonunkiyle
            ayni oldugu icin altta kalan kenarligi kapatiyor, kendi iki
            kenarligi da cizgiyi surduruyor. */}
        <div className="relative ml-auto max-w-md rounded-3xl border border-black/[.08] bg-background px-6 py-5 dark:border-white/[.145]">
          <p className="text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8 dark:text-cream-dim">
            {t.greeting}
          </p>
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-12 h-4 w-4 rotate-45 border-b border-r border-black/[.08] bg-background dark:border-white/[.145]"
          />
        </div>
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
