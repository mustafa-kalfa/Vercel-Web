"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

/* Sayfanin ICERIGI bilerek TURKCE, cevirilere baglanmadi. Buradaki her
   satir gercek bir seyin ADI: bir kursun adi, bir videonun basligi, bir
   X gonderisinin konusu. Bunlari Arapca/Ingilizce'ye "cevirmek" olmayan
   bir ad uydurmak olurdu. Yalnizca bolum basliklari ceviriden geliyor.

   Adresler `?s=20` gibi paylasim parametreleri temizlenerek yazildi;
   parametre hedefi degistirmiyor, yalnizca nereden paylasildigini
   tasiyor. */

type Kalem = { ad: string; alt?: string; href?: string };

const EGITIMLER: Kalem[] = [
  {
    ad: "Akademik Yazım Kursu",
    alt: "İstanbul, 2021 — Türkiye İlahiyatlılar Derneği (TÜİD)",
  },
  {
    ad: "Robotik Kodlama Eğitimi",
    alt: "İstanbul, 2022-2023 — Hüdayi Vakfı Lider Eğitim Programı",
  },
];

const VIDEOLAR: Kalem[] = [
  {
    ad: "el-Mektebetü'ş-Şâmile Kullanım Rehberi 1 — Kurulum Videosu",
    href: "https://youtu.be/E2FQ54kZ2j4",
  },
  {
    ad: "Macbook'a Windows ve Şâmile Kurulumu",
    href: "https://youtu.be/kOFPtcE4O54",
  },
  {
    ad: "Arama Paneli 1 — el-Mektebetü'ş-Şâmile Rehberi 3",
    href: "https://youtu.be/Nzpnf_YN47o",
  },
  {
    ad: "Şâmile ile Türkçe Konuşmak! Claude'a Şâmile Eklentisi Nasıl Kurulur?",
    href: "https://youtu.be/qLbSDKsBXBA",
  },
  {
    ad: "Camiu Hâdimi'l-Haremeyn (CHH) Kurulumu, Sık Karşılaşılan Sorunlar ve Çözümleri",
    href: "https://youtu.be/RnauL-BLXmg",
  },
  {
    ad: "Cevâmiü'l-kelim Programı Kurulumu",
    href: "https://youtu.be/mv91CJnRZTY",
  },
];

const PAYLASIMLAR: Kalem[] = [
  {
    ad: "Şâmile'den elde edilen kitaplar üzerinde NotebookLM ile işlem yapma",
    href: "https://x.com/mustafakalfa__/status/2020937920647962728",
  },
  {
    ad: "Eser hacminde sınırlamaya giderek NotebookLM'de daha etkili sonuç almak",
    href: "https://x.com/mustafakalfa__/status/2021647890674762009",
  },
  {
    ad: "Şâmile'nin çok bilinmeyen ama oldukça işlevsel bir özelliği",
    href: "https://x.com/mustafakalfa__/status/2015870691728654502",
  },
  {
    ad: "Gemini ve NotebookLM ile YDS kelime çalışma kartları hazırlamak",
    href: "https://x.com/mustafakalfa__/status/2029559654775132636",
  },
  {
    ad: "Dil modellerine verilen akademik metinlerin ve kişisel verilerin şirketlerce kullanımını önlemek (ChatGPT, Gemini, Claude)",
    href: "https://x.com/mustafakalfa__/status/2035419172813902122",
  },
];

/* Dis baglantilar YENI SEKMEDE aciliyor: hepsi YouTube ya da X, yani
   siteden tamamen ayri yerler. `rel="noopener"` sart -- onsuz acilan
   sayfa `window.opener` uzerinden bu sekmeyi baska bir adrese
   gonderebiliyor. */
function Liste({ baslik, kalemler }: { baslik: string; kalemler: Kalem[] }) {
  return (
    <section className="w-full">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-cream-dimmer">
        {baslik}
      </h2>
      <ul className="flex flex-col gap-2">
        {kalemler.map((k) => {
          const govde = (
            <>
              <span className="text-base leading-6 text-black dark:text-foreground">
                {k.ad}
              </span>
              {k.alt ? (
                <span className="text-sm leading-6 text-zinc-600 dark:text-cream-dimmer">
                  {k.alt}
                </span>
              ) : null}
            </>
          );

          return (
            <li key={k.ad}>
              {k.href ? (
                <a
                  href={k.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col gap-0.5 rounded-2xl border border-solid border-black/[.08] p-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                >
                  {govde}
                </a>
              ) : (
                <div className="flex flex-col gap-0.5 rounded-2xl border border-solid border-black/[.08] p-4 dark:border-white/[.145]">
                  {govde}
                </div>
              )}
            </li>
          );
        })}
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
        className="absolute left-1/2 top-1 z-20 flex h-[72px] -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <ChromaKeyVideo
          src="/HD-Mini.mp4"
          loop={false}
          className="h-[72px] w-auto max-w-none brightness-0 dark:brightness-100"
        />
      </Link>

      <div className="flex w-full max-w-3xl flex-col gap-10 px-8 pb-16 pt-28 sm:px-16 sm:pt-32">
        <h1 className="sr-only">{t.cardEducation}</h1>
        <Liste baslik={t.eduTrainings} kalemler={EGITIMLER} />
        <Liste baslik={t.eduVideos} kalemler={VIDEOLAR} />
        <Liste baslik={t.eduPosts} kalemler={PAYLASIMLAR} />
      </div>
    </main>
  );
}
