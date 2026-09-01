"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";
import DilAntrenmani from "./DilAntrenmani";
import { SEVIYELER } from "./dilAntrenmaniSeviyeler";
import { useLanguage } from "./LanguageContext";
import type { Language } from "./translations";

/* DİL ANTRENMANI -- üç katmanlı sayfa.

   Düzen `/resule-kavusmak` ile bilerek aynı (bkz. `ResuleKavusmakHub`):
   üstte marka logosu, altında kare kutulardan bir ızgara, katman
   değiştiren her düğmede kısa bir basma efekti ve tarayıcı geçmişine
   bırakılan bir adım.

     katman 1  seviye kümeleri     B1 / B2 / C1
     katman 2  12 seviye kutusu    "Seviye 1" ... "Seviye 12"
     katman 3  oyun                seçilen seviyenin on kelimesi

   B2 ve C1 henüz YOK. İkisi de `/mustafa-calisiyor` sayfasına gidiyor
   (sitede "bu kısım hazırlanıyor" anlamına gelen sayfa) -- kilitli bir
   kutu olarak göstermek yerine gerçek bir bağlantı olmaları istendi.
   İçerikleri gelince buradaki `kind` alanını `"liste"` yapmak ve
   `dilAntrenmaniSeviyeler.ts`e o katmanın seviyelerini eklemek yetiyor.

   KİLİT YOK. İsnâd oyununda hadisler sırayla açılıyor ve ilerleme
   localStorage'da tutuluyor; burada on iki seviyenin hepsi baştan açık,
   Mustafâ'nın tarifi böyleydi ("tıklayınca oyun açılacak"). Sıralı
   kilit istenirse `ResuleKavusmakHub`taki `PROGRESS_KEY` bloğu buraya
   olduğu gibi taşınabilir. */

type Kume = {
  id: string;
  etiket: string;
  kind: "liste" | "link";
  href?: string;
  /* Kutunun sağ üst köşesindeki rozet. Seviye kümesinin ne kadar zor
     olduğunu söylüyor, isnâd oyunundaki zorluk rozetiyle aynı yerde. */
  rozet: Record<Language, string>;
};

const KUMELER: Kume[] = [
  {
    id: "b1",
    etiket: "B1",
    kind: "liste",
    rozet: { tr: "Orta", ar: "متوسط", en: "Intermediate" },
  },
  {
    id: "b2",
    etiket: "B2",
    kind: "link",
    href: "/mustafa-calisiyor",
    rozet: { tr: "Orta üstü", ar: "فوق المتوسط", en: "Upper intermediate" },
  },
  {
    id: "c1",
    etiket: "C1",
    kind: "link",
    href: "/mustafa-calisiyor",
    rozet: { tr: "İleri", ar: "متقدّم", en: "Advanced" },
  },
];

const UI: Record<
  Language,
  {
    kumeBaslik: string;
    kumeAlt: string;
    seviyeBaslik: string;
    seviyeAlt: string;
    kural: string;
    seviye: (n: number) => string;
    kumelereDon: string;
    seviyelereDon: string;
  }
> = {
  tr: {
    kumeBaslik: "Aynı kelime, üç dilde.",
    kumeAlt: "Başlamak istediğin seviyeyi seç.",
    seviyeBaslik: "B1 — on iki seviye",
    seviyeAlt: "Her seviyede on kelime var. İstediğin yerden başla.",
    kural:
      "Aynı kelimenin Türkçe, İngilizce ve Arapça karşılığını art arda aç. Mustafâ kartı eksik dilin yerine geçer, tahtada altı tane var.",
    seviye: (n) => `Seviye ${n}`,
    kumelereDon: "← Seviye Kümeleri",
    seviyelereDon: "← Seviyeler",
  },
  ar: {
    kumeBaslik: "كلمة واحدة، بثلاث لغات.",
    kumeAlt: "اختر المستوى الذي تريد أن تبدأ منه.",
    seviyeBaslik: "B1 — اثنا عشر مستوى",
    seviyeAlt: "في كل مستوى عشر كلمات. ابدأ من حيث شئت.",
    kural:
      "افتح المقابل التركي والإنجليزي والعربي للكلمة نفسها تباعًا. بطاقة مصطفى تقوم مقام اللغة الناقصة، وفي اللوح ست منها.",
    seviye: (n) => `المستوى ${arapcaSayi(n)}`,
    kumelereDon: "→ مجموعات المستويات",
    seviyelereDon: "→ المستويات",
  },
  en: {
    kumeBaslik: "One word, three languages.",
    kumeAlt: "Pick the level you want to start from.",
    seviyeBaslik: "B1 — twelve levels",
    seviyeAlt: "Each level holds ten words. Start wherever you like.",
    kural:
      "Turn over the Turkish, English and Arabic forms of the same word one after another. A Mustafâ card stands in for a missing language, and there are six on the board.",
    seviye: (n) => `Level ${n}`,
    kumelereDon: "← Level Groups",
    seviyelereDon: "← Levels",
  },
};

/* Arapçada rakamlar da Arapça yazılıyor (isnâd oyununda hadis
   numaraları için de aynısı yapılmıştı). */
function arapcaSayi(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

const KUTU_ACIK =
  "border-black/20 hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";
const GERI_DUGMESI =
  "press-go rounded-full border border-solid border-black/20 px-4 py-2 text-sm hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

export default function DilAntrenmaniHub() {
  const { t, language } = useLanguage();
  const ui = UI[language];

  /* Üç katman tek bir state çiftiyle anlatılıyor.
       listede false, seviye null  -> küme ızgarası (açılış)
       listede true,  seviye null  -> 12 seviye kutusu
       seviye dolu                 -> oyun  */
  const [listede, setListede] = useState(false);
  const [seviye, setSeviye] = useState<number | null>(null);

  /* Katmanlar arası HER geçiş tarayıcı geçmişine bir adım bırakıyor.
     Aksi hâlde üç katman da tek bir URL'de yaşadığı için geri tuşu
     "bir önceki aşama" yerine sayfadan TAMAMEN çıkarırdı -- isnâd
     oyununda 2026-08-19'da yaşanan hata. State'i doğrudan
     `setListede`/`setSeviye` ile değiştirme, o adım geçmişe yazılmaz. */
  const git = useCallback((yeniListede: boolean, yeniSeviye: number | null) => {
    window.history.pushState({ da: { listede: yeniListede, seviye: yeniSeviye } }, "");
    setListede(yeniListede);
    setSeviye(yeniSeviye);
  }, []);

  /* Katman değiştiren her düğme önce 160ms'lik bir basma efekti
     oynatıyor, sonra geçiş oluyor. Sayfa "gecikiyor" değil "onaylıyor"
     gibi dursun diye (bkz. globals.css `.press-go` / `.is-going`). */
  const basVeGit = useCallback(
    (e: React.MouseEvent<HTMLElement>, yeniListede: boolean, yeniSeviye: number | null) => {
      const el = e.currentTarget;
      el.classList.add("is-going");
      window.setTimeout(() => {
        /* Sınıf geri alınıyor: React bu elemanı (listeye dönünce)
           yeniden kullanabilir, üzerinde kalırsa solgun görünürdü. */
        el.classList.remove("is-going");
        git(yeniListede, yeniSeviye);
      }, 160);
    },
    [git],
  );

  useEffect(() => {
    function onPop(e: PopStateEvent) {
      /* Bizim bırakmadığımız adımda (sayfaya ilk giriş) state boş olur,
         o zaman en üst katmana dönüyoruz. */
      const d = e.state && e.state.da;
      setListede(d ? !!d.listede : false);
      setSeviye(d && typeof d.seviye === "number" ? d.seviye : null);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Üst-orta logo. Altı sayfada tekrar eden aynı satır -- birini
          değiştirirken hepsini birlikte değiştir, yoksa sayfalar arası
          zıplama olur (bkz. AGENTS.md "Marka logosu artık sabit değil"). */}
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

      {seviye === null && !listede ? (
        /* 1. katman: B1 / B2 / C1 */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">{ui.kumeBaslik}</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.kumeAlt}
          </p>

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-4">
            {KUMELER.map((k) => {
              const kutuSinifi =
                "press-go relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-solid px-2 text-center sm:px-4 " +
                KUTU_ACIK;
              const rozet = (
                <span className="absolute right-2 top-2 max-w-[70%] whitespace-normal rounded-full border border-solid border-black/[.12] px-2 py-0.5 text-[9px] leading-tight text-black/55 dark:border-white/[.18] dark:text-cream-dimmer sm:text-[10px]">
                  {k.rozet[language]}
                </span>
              );
              const etiket = (
                <span className="text-2xl font-semibold tracking-wide sm:text-3xl">
                  {k.etiket}
                </span>
              );

              /* Bir sayfaya götüren kutu gerçek bir bağlantı olsun --
                 yeni sekmede açılabilsin, durum çubuğunda hedefi
                 görünsün. Yalnızca B1 katman değiştiriyor, o buton. */
              if (k.kind === "link" && k.href) {
                return (
                  <Link key={k.id} href={k.href} className={kutuSinifi}>
                    {rozet}
                    {etiket}
                  </Link>
                );
              }
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={(e) => basVeGit(e, true, null)}
                  className={kutuSinifi}
                >
                  {rozet}
                  {etiket}
                </button>
              );
            })}
          </div>
        </div>
      ) : seviye === null ? (
        /* 2. katman: 12 seviye. Sütun sayısı ekrandan BAĞIMSIZ olarak 3
           -- dar ekranda kutular küçülür, sarmalanmaz. İsnâd oyunundaki
           hadis ızgarasıyla aynı düzen. */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">{ui.seviyeBaslik}</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.seviyeAlt}
          </p>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={(e) => basVeGit(e, false, null)}
              className={GERI_DUGMESI}
            >
              {ui.kumelereDon}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
            {SEVIYELER.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => basVeGit(e, true, i)}
                className={
                  "press-go flex aspect-square items-center justify-center rounded-2xl border border-solid px-2 text-center sm:px-4 " +
                  KUTU_ACIK
                }
              >
                <span className="text-[13px] font-medium leading-tight sm:text-base">
                  {ui.seviye(i + 1)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 3. katman: oyun. Genişlik oyunun kendi tahtasıyla aynı
           hizada dursun diye `max-w-[46rem]` -- CSS modülündeki tahta
           genişliği de aynı üst sınırı kullanıyor. */
        <div className="mx-auto w-full max-w-[46rem] px-3 pb-8 pt-20 sm:px-6">
          {/* Geri düğmesi ve seviye adı AYNI SATIRDA. Ayrı satırlarda
              dururlarken tahtaya kalan yükseklik ~50px azalıyor ve
              kartlar gözle görülür şekilde küçülüyordu -- altı sıra kart
              ekran yüksekliğine sığmak zorunda olduğu için üstteki her
              piksel doğrudan kart boyundan çıkıyor (bkz. CSS modülündeki
              genişlik hesabı). Sağdaki boş `span` başlığı gerçekten
              ortada tutuyor; olmasaydı düğmenin genişliği kadar sağa
              kayardı. */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => basVeGit(e, true, null)}
              className={GERI_DUGMESI}
            >
              {ui.seviyelereDon}
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold sm:text-xl">
              {ui.seviye(seviye + 1)}
            </h1>
            <span aria-hidden className="hidden w-[7.5rem] sm:block" />
          </div>
          <p className="mx-auto mt-1 max-w-2xl text-center text-xs text-black/60 dark:text-cream-dimmer">
            {ui.kural}
          </p>

          <div className="mt-3 flex justify-center">
            {/* `key` ZORUNLU: seviye değişince oyunun destesi baştan
                kurulmalı. Bileşen kelime listesini yalnızca ilk
                kurulumda okuyor, prop'un değişmesi tahtayı kendiliğinden
                yenilemiyor (bkz. DilAntrenmani.tsx'teki not). */}
            <DilAntrenmani
              key={seviye}
              kelimeler={SEVIYELER[seviye].kelimeler}
              onListeyeDon={() => git(true, null)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
