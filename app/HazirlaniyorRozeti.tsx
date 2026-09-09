"use client";

import { useLanguage } from "./LanguageContext";

/* Icerigi henuz gelmemis dugmelerin uzerindeki durum rozeti.

   Anasayfadaki kart rozetiyle AYNI gorunum (bkz. page.tsx,
   `rozetAnahtar`): ayni renk kaynagi (`--color-secim`, yani metin
   secim rengi -- Mustafa oyle istedi), ayni yuvarlak hap bicimi. Orada
   SwapContent ile ciziliyor cunku kartlar dil degisiminde capraz gecis
   yapiyor; bu sayfalar dogrudan `t` okudugu icin o sarmalayiciya gerek
   yok.

   `shrink-0` ve `whitespace-nowrap`: baslik uzun olup sardiginda rozet
   ezilmesin, kendi genisligini korusun. */
export default function HazirlaniyorRozeti() {
  const { t } = useLanguage();
  return (
    <span className="shrink-0 whitespace-nowrap rounded-full bg-secim px-2 py-0.5 text-xs font-medium text-secim-metin">
      {t.cardPreparing}
    </span>
  );
}
