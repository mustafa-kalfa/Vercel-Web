"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import ChromaKeyVideo from "../ChromaKeyVideo";
import ResuleKavusmakGame from "../ResuleKavusmakGame";
import { useLanguage } from "../LanguageContext";
import type { Language } from "../translations";

// /resule-kavusmak'in coklu-hadis SINAMA surumu: tek bir hadis yerine
// once 12 hadisten olusan bir izgara aciliyor, bir kutuya basilinca o
// hadisin oyunu geliyor.
//
// Buradaki `id`'ler `public/resule-kavusmak-game.html` icindeki HADITHS
// listesinin id'leriyle BIREBIR AYNI olmali -- oyun `?h=<id>` ile
// seciliyor, eslesmezse sessizce varsayilana (niyet hadisi) duser.
// Yeni bir hadis eklenecekse IKI yere birden yazilmali: oradaki HADITHS
// kaydi (isnad + metin) ve buradaki kisaltma/kaynak etiketi.
//
// `label` yalnizca kutunun uzerindeki KISALTMA; hadisin kendi metni ve
// isnadi oyunun icinde duruyor, burada tekrarlanmiyor.
type HadithCard = {
  id: string;
  label: Record<Language, string>;
  source: Record<Language, string>;
};

const HADITHS: HadithCard[] = [
  {
    id: "niyet",
    label: { tr: "Niyet Hadisi", ar: "حديث النية", en: "The Hadith of Intention" },
    source: { tr: "Buhârî 1", ar: "البخاري ١", en: "Bukhari 1" },
  },
  {
    id: "islamin-sartlari",
    label: { tr: "İslâm’ın Beş Şartı", ar: "أركان الإسلام الخمسة", en: "The Five Pillars" },
    source: { tr: "Buhârî 8", ar: "البخاري ٨", en: "Bukhari 8" },
  },
  {
    id: "musluman",
    label: { tr: "Müslümanın Tarifi", ar: "من هو المسلم", en: "Who Is a Muslim" },
    source: { tr: "Buhârî 10", ar: "البخاري ١٠", en: "Bukhari 10" },
  },
  {
    id: "kardeslik",
    label: { tr: "Kardeşi İçin İstemek", ar: "أن يحب لأخيه", en: "Loving for One’s Brother" },
    source: { tr: "Buhârî 13", ar: "البخاري ١٣", en: "Bukhari 13" },
  },
  {
    id: "helal-haram",
    label: { tr: "Helâl ve Harâm", ar: "الحلال والحرام", en: "The Lawful and the Unlawful" },
    source: { tr: "Buhârî 52", ar: "البخاري ٥٢", en: "Bukhari 52" },
  },
  {
    id: "merhamet",
    label: { tr: "Merhamet Hadisi", ar: "حديث الرحمة", en: "The Hadith of Mercy" },
    source: { tr: "Buhârî 5997", ar: "البخاري ٥٩٩٧", en: "Bukhari 5997" },
  },
  {
    id: "komsu",
    label: { tr: "Komşu ve Misafir", ar: "الجار والضيف", en: "Neighbour and Guest" },
    source: { tr: "Buhârî 6018", ar: "البخاري ٦٠١٨", en: "Bukhari 6018" },
  },
  {
    id: "ofke",
    label: { tr: "Öfke Hadisi", ar: "لا تغضب", en: "Do Not Get Angry" },
    source: { tr: "Buhârî 6116", ar: "البخاري ٦١١٦", en: "Bukhari 6116" },
  },
  {
    id: "kolaylik",
    label: { tr: "Kolaylaştırma Hadisi", ar: "يسروا ولا تعسروا", en: "Make Things Easy" },
    source: { tr: "Buhârî 6125", ar: "البخاري ٦١٢٥", en: "Bukhari 6125" },
  },
  {
    id: "iki-kelime",
    label: { tr: "İki Kelime", ar: "كلمتان", en: "Two Words" },
    source: { tr: "Buhârî 7563", ar: "البخاري ٧٥٦٣", en: "Bukhari 7563" },
  },
  {
    id: "nasihat",
    label: { tr: "Din Nasihattir", ar: "الدين النصيحة", en: "Religion Is Sincere Counsel" },
    source: { tr: "Müslim 55", ar: "مسلم ٥٥", en: "Muslim 55" },
  },
  {
    id: "munker",
    label: { tr: "Kötülüğe Karşı Durmak", ar: "تغيير المنكر", en: "Confronting Wrong" },
    source: { tr: "Müslim 49", ar: "مسلم ٤٩", en: "Muslim 49" },
  },
];

// Izgaranin ve geri dugmesinin arayuz metinleri. Oyunun KENDI metinleri
// game.html'deki STRINGS'ten geliyor, burasi yalnizca bu sayfaya ait.
const UI: Record<
  Language,
  { heading: string; lede: string; back: string; locked: string }
> = {
  tr: {
    heading: "Hangi hadisin isnâdını tırmanmak istersin?",
    lede: "Hadisler sırayla açılır. Bir isnâdı tamamlamadan sonraki hadise geçemezsin.",
    back: "← Hadis listesi",
    locked: "Henüz kilitli — önceki hadisi tamamla",
  },
  ar: {
    heading: "أيَّ حديثٍ تريد أن تصعد إسناده؟",
    lede: "تُفتح الأحاديث بالترتيب: لا تنتقل إلى الحديث التالي قبل إتمام الإسناد الذي قبله.",
    back: "→ قائمة الأحاديث",
    locked: "مقفل — أتمم الحديث السابق",
  },
  en: {
    heading: "Which hadith’s isnād would you like to climb?",
    lede: "The hadiths unlock in order: you cannot move on before completing the isnād you are on.",
    back: "← Hadith list",
    locked: "Locked — complete the previous hadith",
  },
};

// Ilerleme tarayici hafizasinda: tamamlanan hadislerin id listesi.
// Anahtar surumlu (`-v1`): ileride HADITHS'in SIRASI degisirse eski
// kayit yanlis kutulari acabilir, o zaman anahtari `-v2` yapmak
// ilerlemeyi temiz bir sekilde sifirlar.
const PROGRESS_KEY = "resule-kavusmak-sinama-progress-v1";

// Kayit `useSyncExternalStore` ile okunuyor (sitedeki tema/dil ile ayni
// desen): localStorage sunucuda YOK, effect icinde setState ise
// gereksiz basamakli render uretiyor.
//
// Sunucu/hidrasyon anlik degeri `null` = "kayit henuz okunmadi".
// Izgara bu asamada hic cizilmiyor; boylece geri donen kullanici bir
// kare boyunca kendi actigi hadisleri "?" olarak GORMUYOR.
const progressListeners = new Set<() => void>();
// Bellek-once: localStorage'dan BIR KEZ okunup burada tutuluyor.
// getSnapshot her cagrildiginda AYNI referansi dondurmek zorunda
// (yoksa React sonsuz donguye girer), ayrica localStorage yazmayi
// reddederse (kota/gizli sekme) ilerleme hic olmazsa bu oturum boyunca
// ayakta kalir.
let current: string[] | null = null;

function subscribeProgress(onChange: () => void) {
  progressListeners.add(onChange);
  return () => {
    progressListeners.delete(onChange);
  };
}

function getProgressSnapshot(): string[] {
  if (current === null) {
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(PROGRESS_KEY);
    } catch {
      raw = null;
    }
    current = parseProgress(raw);
  }
  return current;
}

function getProgressServerSnapshot(): null {
  return null;
}

function parseProgress(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    // Bozuk/elle duzenlenmis kayit oyunu kirmasin: yalnizca gercekten
    // taniyacagimiz id'leri kabul ediyoruz.
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (id): id is string =>
        typeof id === "string" && HADITHS.some((h) => h.id === id),
    );
  } catch {
    return [];
  }
}

function writeProgress(next: string[]) {
  current = next;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  } catch {
    // Kaydedilemezse yalnizca KALICILIK kaybolur; `current` guncel
    // kaldigi icin bu oturumda kilit dogru sekilde acik kalir.
  }
  progressListeners.forEach((listener) => listener());
}

export default function ResuleKavusmakSinama() {
  const { t, language } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  // `null` = kayit henuz okunmadi (sunucu render'i / hidrasyon).
  const completed = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );
  const ui = UI[language];

  const markCompleted = useCallback((id: string) => {
    const list = getProgressSnapshot();
    if (list.includes(id)) return;
    writeProgress([...list, id]);
  }, []);

  // Oyun isnadi tamamlayinca iframe'den "bitti" haberi geliyor
  // (game.html icindeki finish()). Kilidi acan tek olay bu -- kutuya
  // girip cikmak yetmiyor, hadisin GERCEKTEN bitirilmesi gerekiyor.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data) return;
      if (e.data.type === "resule-kavusmak-completed") {
        const id = String(e.data.hadis);
        if (HADITHS.some((h) => h.id === id)) markCompleted(id);
      }
      // Oyundaki "Sonraki hadis" dugmesi: listeye ugramadan dogrudan
      // siradaki hadise geciyoruz. Dugme zaten yalnizca isnad
      // tamamlaninca goruniyor, yani siradaki hadis o an acilmis
      // oluyor -- yine de kilit kontrolunu burada tekrarliyoruz.
      if (e.data.type === "resule-kavusmak-next") {
        const id = String(e.data.hadis);
        const index = HADITHS.findIndex((h) => h.id === id);
        if (index > 0 && getProgressSnapshot().includes(HADITHS[index - 1].id)) {
          setSelected(id);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [markCompleted]);

  // Sirali kilit: ilk hadis daima acik, digeri ancak KENDINDEN ONCEKI
  // hadis tamamlanmissa acilir.
  function isUnlocked(index: number) {
    if (index === 0) return true;
    return (completed ?? []).includes(HADITHS[index - 1].id);
  }

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Header bolgesi /resule-kavusmak ile birebir ayni. */}
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

      {selected === null ? (
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            {ui.heading}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.lede}
          </p>

          {/* Kullanicinin istedigi duzen: yan yana 3, alt alta 4 sira.
              Sutun sayisi ekran boyutundan BAGIMSIZ olarak 3 -- dar
              ekranda kutular kuculur, sarmalanmaz.

              Ilerleme okunana kadar izgara hic cizilmiyor: aksi halde
              geri donen kullanici bir kare boyunca kendi actigi
              hadisleri "?" olarak gorurdu. */}
          {completed !== null && (
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-4">
              {HADITHS.map((h, i) => {
                const unlocked = isUnlocked(i);
                const done = completed.includes(h.id);
                // KILITLI kutu: ismi de kaynagi da gizli (hangi hadis
                // oldugu sizmasin diye), yalnizca "?" ve tiklanamaz.
                return (
                  <button
                    key={h.id}
                    type="button"
                    disabled={!unlocked}
                    aria-label={unlocked ? undefined : ui.locked}
                    title={unlocked ? undefined : ui.locked}
                    onClick={() => setSelected(h.id)}
                    className={
                      "flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-solid px-2 text-center transition-colors sm:px-4 " +
                      (unlocked
                        ? "border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                        : "cursor-not-allowed border-dashed border-black/[.12] text-black/25 dark:border-white/[.12] dark:text-cream-dimmer/40")
                    }
                  >
                    {unlocked ? (
                      <>
                        <span className="text-[13px] font-medium leading-tight sm:text-base">
                          {h.label[language]}
                        </span>
                        <span className="text-[10px] text-black/50 dark:text-cream-dimmer sm:text-xs">
                          {done ? "✓ " : ""}
                          {h.source[language]}
                        </span>
                      </>
                    ) : (
                      <span
                        aria-hidden
                        className="text-2xl font-medium sm:text-3xl"
                      >
                        ?
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="pt-24">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              {ui.back}
            </button>
          </div>
          {/* `key` ZORUNLU: yalnizca `src` degisirse iframe yeniden
              yuklenmeyip onceki hadisin ic durumunu (bulunmus raviler,
              Mustafa'nin konumu) tasiyabiliyor. */}
          <ResuleKavusmakGame key={selected} hadis={selected} />
        </div>
      )}
    </main>
  );
}
