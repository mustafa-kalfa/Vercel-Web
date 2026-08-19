"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import ResuleKavusmakGame from "../ResuleKavusmakGame";
import { useLanguage } from "../LanguageContext";

export default function ResuleKavusmak() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Header bolgesi /selam ile BIREBIR ayni: sabit, ortalanmis marka
          logosu, anasayfaya donus baglantisi.

          Statik `.brand-logo` maskesi yerine `HD-Mini.mp4` (2026-08-10):
          anasayfadaki logo klibinin ilk 61 karesi, yalnizca HD monogramini
          cizen bolum. Kutu `h-9` degil `h-[72px]`: maske sikica kirpilmis
          bir PNG'ydi, videoda ise monogram kadrajin ortadaki %45'ini
          kapliyor -- 72px'lik kutuda monogram 32px cikiyor, yani eski
          maskeyle ayni gorunur boyda.

          `brightness-0 dark:brightness-100`: klibin renk yarisi koyu tema
          foreground'uyla (#e5dfd0) tintli, koyu temada filtre gerekmiyor;
          acik temada brightness RGB'yi sifirlayip siyaha indiriyor. */}
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

      {/* Hadis secilmeden aciliyor: oyun kendi varsayilanini (niyet
          hadisi) yukler. Bir listeden secim yapilan surumu icin bkz.
          /resule-kavusmak-sinama. */}
      <div className="pt-20">
        <ResuleKavusmakGame />
      </div>
    </main>
  );
}
