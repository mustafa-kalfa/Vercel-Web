"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";
import { TRANSLATIONS, type Language } from "../translations";

/* Ceviri sozlugunun anahtarlari. */
type CeviriAnahtari = keyof (typeof TRANSLATIONS)[Language];

/* Liste kalemleri metni degil ceviri ANAHTARINI tutuyor. Onceden
   basliklar dogrudan Turkce yazilmisti; gerekce "her satir gercek bir
   seyin adi, cevirmek olmayan bir ad uydurmak olur" idi. Mustafa
   sayfanin ucu dilde de degismesini istedi (2026-08-29), o yuzden
   basliklar artik ceviriliyor.

   Adresler DEGISMIYOR: hedef video ve gonderi hangi dilde ise oyle
   kaliyor, ceviri yalnizca ziyaretcinin ne oldugunu anlamasi icin.
   `?s=20` gibi paylasim parametreleri temizlendi; hedefi degistirmiyor,
   yalnizca nereden paylasildigini tasiyor. */

type Kalem = { anahtar: CeviriAnahtari; href: string };

const VIDEOLAR: Kalem[] = [
  { anahtar: "eduVideoShamelaSetup", href: "https://youtu.be/E2FQ54kZ2j4" },
  { anahtar: "eduVideoSearchPanel", href: "https://youtu.be/Nzpnf_YN47o" },
  { anahtar: "eduVideoMacbook", href: "https://youtu.be/kOFPtcE4O54" },
  { anahtar: "eduVideoClaudeExt", href: "https://youtu.be/qLbSDKsBXBA" },
  { anahtar: "eduVideoChh", href: "https://youtu.be/RnauL-BLXmg" },
  { anahtar: "eduVideoChhWindow", href: "https://youtu.be/jIhwOq7nL7Q" },
  { anahtar: "eduVideoCevami", href: "https://youtu.be/mv91CJnRZTY" },
];

const PAYLASIMLAR: Kalem[] = [
  {
    anahtar: "eduPostNotebookLM",
    href: "https://x.com/mustafakalfa__/status/2020937920647962728",
  },
  {
    anahtar: "eduPostVolumeLimit",
    href: "https://x.com/mustafakalfa__/status/2021647890674762009",
  },
  {
    anahtar: "eduPostShamelaFeature",
    href: "https://x.com/mustafakalfa__/status/2015870691728654502",
  },
  {
    anahtar: "eduPostYdsCards",
    href: "https://x.com/mustafakalfa__/status/2029559654775132636",
  },
  {
    anahtar: "eduPostDataPrivacy",
    href: "https://x.com/mustafakalfa__/status/2035419172813902122",
  },
  {
    anahtar: "eduPostPdfDarkMode",
    href: "https://x.com/mustafakalfa__/status/2064060099765657952",
  },
  {
    anahtar: "eduPostDeepL",
    href: "https://x.com/mustafakalfa__/status/2073120147670237655",
  },
];

/* Dis baglantilar YENI SEKMEDE aciliyor: hepsi YouTube ya da X, yani
   siteden tamamen ayri yerler. `rel="noopener"` sart -- onsuz acilan
   sayfa `window.opener` uzerinden bu sekmeyi baska bir adrese
   gonderebiliyor. */
function Liste({
  baslik,
  kalemler,
  t,
}: {
  baslik: string;
  kalemler: Kalem[];
  t: (typeof TRANSLATIONS)[Language];
}) {
  return (
    <section className="w-full">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-cream-dimmer">
        {baslik}
      </h2>
      <ul className="flex flex-col gap-2">
        {kalemler.map((k) => (
          <li key={k.href}>
            <a
              href={k.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex rounded-2xl border border-solid border-black/20 p-4 text-base leading-6 text-black transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:text-foreground dark:hover:bg-[#1a1a1a]"
            >
              {t[k.anahtar]}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EgitimIcerikleri() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col items-center">
      {/* Sitenin diger ic sayfalarindaki (/podcastler, /mustafa-calisiyor)
          ust-orta logo yerlesiminin aynisi: HD-Mini, 72px, anasayfaya
          baglanti. */}
      <Link
        href="/"
        aria-label={t.brandAlt}
        className="absolute left-1/2 top-1 z-20 flex h-[48px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[48px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      <div className="flex w-full max-w-3xl flex-col gap-10 px-8 pb-16 pt-28 sm:px-16 sm:pt-32">
        <h1 className="sr-only">{t.cardEducation}</h1>
        <Liste baslik={t.eduVideos} kalemler={VIDEOLAR} t={t} />
        <Liste baslik={t.eduPosts} kalemler={PAYLASIMLAR} t={t} />
      </div>

    </main>
  );
}
