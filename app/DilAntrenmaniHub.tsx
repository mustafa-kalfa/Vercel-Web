"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";
import DilAntrenmani from "./DilAntrenmani";
import {
  B1_SEVIYELERI,
  HADIS_SEVIYELERI,
  type Seviye,
} from "./dilAntrenmaniSeviyeler";
import { useLanguage } from "./LanguageContext";
import type { Language } from "./translations";

/* DİL ANTRENMANI -- üç katmanlı sayfa.

   Düzen `/resule-kavusmak` ile bilerek aynı (bkz. `ResuleKavusmakHub`):
   üstte marka logosu, altında kare kutulardan bir ızgara, katman
   değiştiren her düğmede kısa bir basma efekti ve tarayıcı geçmişine
   bırakılan bir adım.

     katman 1  kümeler    B1 / B2 / C1 / Hadisle İlgili Kelimeler
     katman 2  seviyeler  "Seviye 1" ... (kümenin kendi sayısı kadar)
     katman 3  oyun       seçilen seviyenin on kelimesi

   İki küme gerçek liste açıyor: B1 (12 seviye) ve hadis ıstılahları
   (3 seviye). B2 ile C1 henüz YOK, ikisi de `/mustafa-calisiyor`
   sayfasına gidiyor. İçerikleri gelince `KUMELER` içindeki `kind`i
   `"liste"` yapıp `seviyeler` alanına o kümenin dizisini vermek
   yetiyor -- geri kalan her şey (kilit, ilerleme kaydı, başlıklar)
   küme kimliğinden türüyor. */

type Kume = {
  id: string;
  /* Kutunun üzerindeki ad. B1/B2/C1 dile bağlı değil, hadis kümesinin
     adı ise çeviriliyor -- bu yüzden alan `string | Record<...>` değil,
     her zaman üç dilli. */
  etiket: Record<Language, string>;
  /* İki harflik seviye kodları (B1, B2, C1) iri puntoyla duruyor, uzun
     ad ise normal metin gibi. Aynı ızgarada ikisi de var. */
  iri?: boolean;
  kind: "liste" | "link";
  href?: string;
  seviyeler?: Seviye[];
  /* 2. katmanın başlığı. */
  listeBaslik?: Record<Language, string>;
  /* Kutunun sağ üst köşesindeki rozet. Kümenin ne kadar zor olduğunu
     söylüyor, isnâd oyunundaki zorluk rozetiyle aynı yerde. */
  rozet: Record<Language, string>;
};

const KUMELER: Kume[] = [
  {
    id: "b1",
    etiket: { tr: "B1", ar: "B1", en: "B1" },
    iri: true,
    kind: "liste",
    seviyeler: B1_SEVIYELERI,
    listeBaslik: {
      tr: "B1 — on iki seviye",
      ar: "B1 — اثنا عشر مستوى",
      en: "B1 — twelve levels",
    },
    rozet: { tr: "Orta", ar: "متوسط", en: "Intermediate" },
  },
  {
    id: "b2",
    etiket: { tr: "B2", ar: "B2", en: "B2" },
    iri: true,
    kind: "link",
    href: "/mustafa-calisiyor",
    rozet: { tr: "Orta üstü", ar: "فوق المتوسط", en: "Upper intermediate" },
  },
  {
    id: "c1",
    etiket: { tr: "C1", ar: "C1", en: "C1" },
    iri: true,
    kind: "link",
    href: "/mustafa-calisiyor",
    rozet: { tr: "İleri", ar: "متقدّم", en: "Advanced" },
  },
  {
    id: "hadis",
    /* Türkçedeki `\n` KASITLI satır kırılımı ("Kelimeler" alt satıra
       insin). Kutu `whitespace-pre-line` taşıdığı için olduğu gibi
       uygulanıyor; Arapça ve İngilizce'de kırılım yok, doğal sarıyorlar.
       Aynı yol `ResuleKavusmakHub`taki bölüm kutularında da var. */
    etiket: {
      tr: "Hadisle İlgili\nKelimeler",
      ar: "مصطلحات علم الحديث",
      en: "Hadith Terminology",
    },
    kind: "liste",
    seviyeler: HADIS_SEVIYELERI,
    listeBaslik: {
      tr: "Hadisle İlgili Kelimeler — üç seviye",
      ar: "مصطلحات علم الحديث — ثلاثة مستويات",
      en: "Hadith Terminology — three levels",
    },
    rozet: { tr: "Istılah", ar: "اصطلاح", en: "Technical" },
  },
];

const UI: Record<
  Language,
  {
    kumeBaslik: string;
    kumeAlt: string;
    seviyeAlt: string;
    kural: string;
    seviye: (n: number) => string;
    kumelereDon: string;
    seviyelereDon: string;
    kilitli: string;
  }
> = {
  tr: {
    kumeBaslik: "Aynı kelime, üç dilde.",
    kumeAlt: "Başlamak istediğin kümeyi seç.",
    seviyeAlt: "Seviyeler sırayla açılır. Her turda altı kelime dağıtılır.",
    kural:
      "Aynı kelimenin Türkçe, İngilizce ve Arapça karşılığını art arda aç. Mustafâ kartı eksik dilin yerine geçer. İki Mustafâ birden kullanırsan kartlar tahtada kalır.",
    seviye: (n) => `Seviye ${n}`,
    kumelereDon: "← Kümeler",
    seviyelereDon: "← Seviyeler",
    kilitli: "Henüz kilitli — önceki seviyeyi tamamla",
  },
  ar: {
    kumeBaslik: "كلمة واحدة، بثلاث لغات.",
    kumeAlt: "اختر المجموعة التي تريد أن تبدأ منها.",
    seviyeAlt: "تُفتح المستويات بالترتيب. تُوزَّع في كل جولة ست كلمات.",
    kural:
      "افتح المقابل التركي والإنجليزي والعربي للكلمة نفسها تباعًا. بطاقة مصطفى تقوم مقام اللغة الناقصة، وإن استعملت بطاقتين معًا بقيتا في اللوح.",
    seviye: (n) => `المستوى ${arapcaSayi(n)}`,
    kumelereDon: "→ المجموعات",
    seviyelereDon: "→ المستويات",
    kilitli: "مقفل — أتمم المستوى السابق",
  },
  en: {
    kumeBaslik: "One word, three languages.",
    kumeAlt: "Pick the group you want to start from.",
    seviyeAlt: "The levels unlock in order. Six words are dealt each round.",
    kural:
      "Turn over the Turkish, English and Arabic forms of the same word one after another. A Mustafâ card stands in for a missing language. Use two at once and they stay on the board.",
    seviye: (n) => `Level ${n}`,
    kumelereDon: "← Groups",
    seviyelereDon: "← Levels",
    kilitli: "Locked — finish the previous level",
  },
};

/* Arapçada rakamlar da Arapça yazılıyor (isnâd oyununda hadis
   numaraları için de aynısı yapılmıştı). */
function arapcaSayi(n: number) {
  return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
}

const KUTU =
  "press-go relative flex aspect-square flex-col items-center justify-center rounded-2xl border border-solid px-2 text-center sm:px-4 ";
const KUTU_ACIK =
  "border-black/20 hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";
const KUTU_KILITLI =
  "cursor-not-allowed border-dashed border-black/[.12] text-black/25 dark:border-white/[.12] dark:text-cream-dimmer/40";
const GERI_DUGMESI =
  "press-go rounded-full border border-solid border-black/20 px-4 py-2 text-sm hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

/* İLERLEME (sıralı kilit). Bir seviye ancak KENDİNDEN ÖNCEKİ seviye
   tamamlanmışsa açılıyor, her kümenin ilki daima açık. Kilidi açan tek
   olay oyunun GERÇEKTEN bitirilmesi -- kutuya girip çıkmak yetmiyor
   (bkz. `DilAntrenmani`in `onTamamlandi` prop'u).

   Kayıt tarayıcı hafızasında, küme kimliğinden tamamlanan seviye
   numaralarına bir eşleme olarak. Kümeler ayrı sayılıyor: hadis
   ıstılahlarını bitirmek B1'in kilidini açmıyor.

   Anahtar SÜRÜMLÜ: `dilAntrenmaniSeviyeler.ts` içindeki sıra ya da
   seviye sayısı değişirse eski kayıt YANLIŞ kutuları açar; o zaman
   numarayı bir ilerlet (-v2), tarayıcılar eski anahtarı hiç okumadığı
   için herkes baştan başlar.

   Okuma `useSyncExternalStore` ile, bir efekt içinde `setState` ile
   DEĞİL: localStorage sunucuda yok ve efektte setState hem lint
   tarafından yasak (`react-hooks/set-state-in-effect`) hem de gereksiz
   basamaklı render üretiyor. Sitedeki tema/dil ve isnâd oyununun
   ilerlemesi de aynı deseni kullanıyor. */
const ILERLEME_ANAHTARI = "dil-antrenmani-ilerleme-v1";

type Ilerleme = Record<string, number[]>;

const dinleyiciler = new Set<() => void>();
/* Bellek-önce: localStorage'dan BİR KEZ okunup burada tutuluyor.
   `getSnapshot` her çağrıldığında AYNI referansı döndürmek zorunda,
   yoksa React sonsuz döngüye girer. Ayrıca localStorage yazmayı
   reddederse (kota, gizli sekme) kilit hiç olmazsa o oturum boyunca
   doğru kalıyor. */
let ilerleme: Ilerleme | null = null;

function ilerlemeAbone(degisti: () => void) {
  dinleyiciler.add(degisti);
  return () => {
    dinleyiciler.delete(degisti);
  };
}

function ilerlemeOku(): Ilerleme {
  if (ilerleme === null) {
    let ham: string | null = null;
    try {
      ham = window.localStorage.getItem(ILERLEME_ANAHTARI);
    } catch {
      ham = null;
    }
    ilerleme = ilerlemeCoz(ham);
  }
  return ilerleme;
}

/* Sunucu/hidrasyon anlık değeri `null` = "kayıt henüz okunmadı".
   Izgara o aşamada hiç çizilmiyor; yoksa geri dönen kullanıcı bir kare
   boyunca kendi açtığı seviyeleri kilitli görürdü. */
function ilerlemeSunucu(): null {
  return null;
}

function ilerlemeCoz(ham: string | null): Ilerleme {
  if (!ham) return {};
  try {
    const cozulen: unknown = JSON.parse(ham);
    if (!cozulen || typeof cozulen !== "object" || Array.isArray(cozulen)) return {};
    const sonuc: Ilerleme = {};
    /* Bozuk ya da elle düzenlenmiş kayıt oyunu kırmasın: yalnızca
       gerçekten tanıdığımız küme ve seviye numaraları kabul ediliyor. */
    for (const kume of KUMELER) {
      const uzunluk = kume.seviyeler?.length ?? 0;
      const ham2 = (cozulen as Record<string, unknown>)[kume.id];
      if (!Array.isArray(ham2)) continue;
      sonuc[kume.id] = ham2.filter(
        (n): n is number => typeof n === "number" && n >= 0 && n < uzunluk,
      );
    }
    return sonuc;
  } catch {
    return {};
  }
}

function ilerlemeYaz(yeni: Ilerleme) {
  ilerleme = yeni;
  try {
    window.localStorage.setItem(ILERLEME_ANAHTARI, JSON.stringify(yeni));
  } catch {
    /* Kaydedilemezse yalnızca KALICILIK kayboluyor; `ilerleme` güncel
       kaldığı için bu oturumda kilit doğru açılmaya devam ediyor. */
  }
  dinleyiciler.forEach((f) => f());
}

export default function DilAntrenmaniHub() {
  const { t, language } = useLanguage();
  const ui = UI[language];

  /* Üç katman tek bir state çiftiyle anlatılıyor.
       kume null                 -> küme ızgarası (açılış)
       kume dolu, seviye null    -> o kümenin seviye ızgarası
       ikisi de dolu             -> oyun  */
  const [kumeId, setKumeId] = useState<string | null>(null);
  const [seviye, setSeviye] = useState<number | null>(null);

  /* `null` = kayıt henüz okunmadı (sunucu render'ı ve hidrasyon). */
  const tamamlananlar = useSyncExternalStore(
    ilerlemeAbone,
    ilerlemeOku,
    ilerlemeSunucu,
  );

  const kume = KUMELER.find((k) => k.id === kumeId) ?? null;
  const seviyeler = kume?.seviyeler ?? [];
  const bitenler = (tamamlananlar ?? {})[kumeId ?? ""] ?? [];

  const tamamlandiIsaretle = useCallback((id: string, i: number) => {
    const hepsi = ilerlemeOku();
    const liste = hepsi[id] ?? [];
    if (liste.includes(i)) return;
    ilerlemeYaz({ ...hepsi, [id]: [...liste, i] });
  }, []);

  /* Sıralı kilit: her kümenin ilk seviyesi daima açık, diğeri ancak
     KENDİNDEN ÖNCEKİ seviye tamamlanmışsa. */
  function acikMi(i: number) {
    return i === 0 || bitenler.includes(i - 1);
  }

  /* Katmanlar arası HER geçiş tarayıcı geçmişine bir adım bırakıyor.
     Aksi hâlde üç katman da tek bir URL'de yaşadığı için geri tuşu
     "bir önceki aşama" yerine sayfadan TAMAMEN çıkarırdı -- isnâd
     oyununda 2026-08-19'da yaşanan hata. State'i doğrudan
     `setKumeId`/`setSeviye` ile değiştirme, o adım geçmişe yazılmaz. */
  const git = useCallback((yeniKume: string | null, yeniSeviye: number | null) => {
    window.history.pushState({ da: { kume: yeniKume, seviye: yeniSeviye } }, "");
    setKumeId(yeniKume);
    setSeviye(yeniSeviye);
  }, []);

  /* Katman değiştiren her düğme önce 160ms'lik bir basma efekti
     oynatıyor, sonra geçiş oluyor. Sayfa "gecikiyor" değil "onaylıyor"
     gibi dursun diye (bkz. globals.css `.press-go` / `.is-going`). */
  const basVeGit = useCallback(
    (e: React.MouseEvent<HTMLElement>, yeniKume: string | null, yeniSeviye: number | null) => {
      const el = e.currentTarget;
      el.classList.add("is-going");
      window.setTimeout(() => {
        /* Sınıf geri alınıyor: React bu elemanı (listeye dönünce)
           yeniden kullanabilir, üzerinde kalırsa solgun görünürdü. */
        el.classList.remove("is-going");
        git(yeniKume, yeniSeviye);
      }, 160);
    },
    [git],
  );

  useEffect(() => {
    function onPop(e: PopStateEvent) {
      /* Bizim bırakmadığımız adımda (sayfaya ilk giriş) state boş olur,
         o zaman en üst katmana dönüyoruz. */
      const d = e.state && e.state.da;
      setKumeId(d && typeof d.kume === "string" ? d.kume : null);
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

      {kume === null ? (
        /* 1. katman: kümeler. Dört kutu, 2x2 -- isnâd oyunundaki bölüm
           ızgarasıyla aynı düzen. */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">{ui.kumeBaslik}</h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.kumeAlt}
          </p>

          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
            {KUMELER.map((k) => {
              const rozet = (
                <span className="absolute right-2 top-2 max-w-[70%] whitespace-normal rounded-full border border-solid border-black/[.12] px-2 py-0.5 text-[9px] leading-tight text-black/55 dark:border-white/[.18] dark:text-cream-dimmer sm:text-[10px]">
                  {k.rozet[language]}
                </span>
              );
              const etiket = (
                <span
                  className={
                    k.iri
                      ? "text-2xl font-semibold tracking-wide sm:text-3xl"
                      : "whitespace-pre-line text-sm font-medium leading-tight sm:text-base"
                  }
                >
                  {k.etiket[language]}
                </span>
              );

              /* Bir sayfaya götüren kutu gerçek bir bağlantı olsun --
                 yeni sekmede açılabilsin, durum çubuğunda hedefi
                 görünsün. Yalnızca liste açanlar buton. */
              if (k.kind === "link" && k.href) {
                return (
                  <Link key={k.id} href={k.href} className={KUTU + KUTU_ACIK}>
                    {rozet}
                    {etiket}
                  </Link>
                );
              }
              return (
                <button
                  key={k.id}
                  type="button"
                  onClick={(e) => basVeGit(e, k.id, null)}
                  className={KUTU + KUTU_ACIK}
                >
                  {rozet}
                  {etiket}
                </button>
              );
            })}
          </div>
        </div>
      ) : seviye === null ? (
        /* 2. katman: seviyeler. Sütun sayısı ekrandan BAĞIMSIZ olarak 3
           -- dar ekranda kutular küçülür, sarmalanmaz. İsnâd oyunundaki
           hadis ızgarasıyla aynı düzen. */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            {kume.listeBaslik?.[language]}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.seviyeAlt}
          </p>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={(e) => basVeGit(e, null, null)}
              className={GERI_DUGMESI}
            >
              {ui.kumelereDon}
            </button>
          </div>

          {/* İlerleme okunana kadar ızgara HİÇ çizilmiyor: aksi hâlde
              geri dönen kullanıcı bir kare boyunca kendi açtığı
              seviyeleri kilitli görürdü. */}
          {tamamlananlar !== null && (
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              {seviyeler.map((_, i) => {
                const acik = acikMi(i);
                const bitti = bitenler.includes(i);
                /* Kilitli kutuda seviye ADI gizlenmiyor -- isnâd
                   oyununda hadis adı içeriği sızdırdığı için "?" ile
                   örtülüyordu, "Seviye 5" ise hiçbir şey sızdırmıyor.
                   Kutu yalnızca soluk, kesik çizgili ve tıklanamaz. */
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!acik}
                    aria-label={acik ? undefined : ui.kilitli}
                    title={acik ? undefined : ui.kilitli}
                    onClick={(e) => basVeGit(e, kume.id, i)}
                    className={
                      "press-go flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border border-solid px-2 text-center sm:px-4 " +
                      (acik ? KUTU_ACIK : KUTU_KILITLI)
                    }
                  >
                    <span className="text-[13px] font-medium leading-tight sm:text-base">
                      {ui.seviye(i + 1)}
                    </span>
                    {bitti && (
                      <span
                        aria-hidden
                        className="text-[11px] leading-none text-black/45 dark:text-cream-dimmer sm:text-xs"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* 3. katman: oyun. Genişlik oyunun kendi tahtasıyla aynı hizada
           dursun diye `max-w-[46rem]` -- CSS modülündeki tahta genişliği
           de aynı üst sınırı kullanıyor. */
        <div className="mx-auto w-full max-w-[46rem] px-3 pb-10 pt-24 sm:px-6">
          <button
            type="button"
            onClick={(e) => basVeGit(e, kume.id, null)}
            className={GERI_DUGMESI}
          >
            {ui.seviyelereDon}
          </button>

          <h1 className="mt-4 text-center text-xl font-semibold sm:text-2xl">
            {ui.seviye(seviye + 1)}
          </h1>
          <p className="mx-auto mt-1 max-w-xl text-center text-xs text-black/60 dark:text-cream-dimmer sm:text-sm">
            {ui.kural}
          </p>

          <div className="mt-4 flex justify-center">
            {/* `key` ZORUNLU: seviye değişince oyunun destesi baştan
                kurulmalı. Bileşen kelime listesini yalnızca ilk
                kurulumda okuyor, prop'un değişmesi tahtayı kendiliğinden
                yenilemiyor (bkz. DilAntrenmani.tsx'teki not). */}
            <DilAntrenmani
              key={`${kume.id}-${seviye}`}
              kelimeler={seviyeler[seviye].kelimeler}
              onListeyeDon={() => git(kume.id, null)}
              onTamamlandi={() => tamamlandiIsaretle(kume.id, seviye)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
