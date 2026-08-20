"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";
import ResuleKavusmakGame from "./ResuleKavusmakGame";
import { useLanguage } from "./LanguageContext";
import type { Language } from "./translations";

// Isnad oyununun TAM deneyimi: uc katman (4 bolum kutusu -> 12 hadis
// kutusu -> oyun), sirali kilit, localStorage'da ilerleme, tebrik
// pop-up'i ve tarayici gecmisi entegrasyonu.
//
// Once /resule-kavusmak-sinama'da denendi, 2026-08-19'da Mustafa'nin
// istegiyle GERCEK sayfaya (/resule-kavusmak) tasindi. Iki rota da bu
// AYNI bileseni render ediyor -- sinama adresi eski baglantilar
// kirilmasin diye duruyor, istenildiginde silinebilir.
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

// Sira, game.html'deki HADITHS ile BIREBIR ayni olmali: kilit
// "bir onceki hadis bitti mi" diye sirayla bakiyor, oyunun
// "Onceki"/"Sonraki" dugmeleri de o siraya gore komsu buluyor.
// Ilki BILEREK niyet hadisi -- parametresiz /resule-kavusmak onu acar.
const HADITHS: HadithCard[] = [
  {
    id: "niyet",
    label: { tr: "Niyet Hadisi", ar: "حديث النية", en: "The Hadith of Intention" },
    source: { tr: "Buhârî 1", ar: "البخاري ١", en: "Bukhari 1" },
  },
  {
    id: "helal-haram",
    label: { tr: "Helâl ve Harâm", ar: "الحلال والحرام", en: "The Lawful and the Unlawful" },
    source: { tr: "Buhârî 52", ar: "البخاري ٥٢", en: "Bukhari 52" },
  },
  {
    id: "kalpler",
    label: { tr: "Allah Kalplere Bakar", ar: "ينظر إلى قلوبكم", en: "Allah Looks at Hearts" },
    source: { tr: "Müslim 2564", ar: "مسلم ٢٥٦٤", en: "Muslim 2564" },
  },
  {
    id: "ahlak-iman",
    label: { tr: "Îmân ve Güzel Ahlâk", ar: "أكمل المؤمنين إيمانًا", en: "Faith and Character" },
    source: { tr: "Ebû Dâvûd 4682", ar: "أبو داود ٤٦٨٢", en: "Abu Dawud 4682" },
  },
  {
    id: "takva",
    label: { tr: "Takvâ Hadisi", ar: "اتق الله حيثما كنت", en: "The Hadith of Taqwā" },
    source: { tr: "Tirmizî 1987", ar: "الترمذي ١٩٨٧", en: "Tirmidhi 1987" },
  },
  {
    id: "gozumun-nuru",
    label: { tr: "Gözümün Nûru Namaz", ar: "قرة عيني في الصلاة", en: "Delight of My Eye" },
    source: { tr: "Nesâî 3939", ar: "النسائي ٣٩٣٩", en: "Nasa’i 3939" },
  },
  {
    id: "malayani",
    label: { tr: "Mâlâyâniyi Terk", ar: "ترك ما لا يعنيه", en: "Leaving the Idle" },
    source: { tr: "İbn Mâce 3976", ar: "ابن ماجه ٣٩٧٦", en: "Ibn Majah 3976" },
  },
  {
    id: "deniz-suyu",
    label: { tr: "Deniz Suyu", ar: "هو الطهور ماؤه", en: "The Water of the Sea" },
    source: { tr: "Muvatta’, Tahâret 12", ar: "الموطأ، الطهارة ١٢", en: "Muwatta, Tahara 12" },
  },
  {
    id: "guzel-ahlak",
    label: { tr: "Güzel Ahlâkı Tamamlamak", ar: "لأتمم صالح الأخلاق", en: "Perfecting Character" },
    source: { tr: "Müsned 8952", ar: "المسند ٨٩٥٢", en: "Musnad 8952" },
  },
  {
    id: "teblig",
    label: { tr: "Tebliğ Hadisi", ar: "بلغوا عني ولو آية", en: "Convey from Me" },
    source: { tr: "Dârimî 559", ar: "الدارمي ٥٥٩", en: "Darimi 559" },
  },
  {
    id: "nasihat",
    label: { tr: "Din Nasihattir", ar: "الدين النصيحة", en: "Religion Is Sincere Counsel" },
    source: { tr: "Müslim 55", ar: "مسلم ٥٥", en: "Muslim 55" },
  },
  {
    id: "komsu",
    label: { tr: "Komşu ve Misafir", ar: "الجار والضيف", en: "Neighbour and Guest" },
    source: { tr: "Buhârî 6018", ar: "البخاري ٦٠١٨", en: "Bukhari 6018" },
  },
];

// Bolumler (en ust katman). Ilki bu sayfadaki 12 hadislik listeyi acar;
// ikincisi 12'si de bitince acilir ve site icinde baska bir sayfaya
// goturur. Kalan ikisinin icerigi henuz yok, DAIMA kilitli duruyor.
type SectionCard = {
  id: string;
  // Turkce etiketlerdeki `\n` KASITLI satir kirilimi ("Hadisler" alt
  // satira insin). Kutu `whitespace-pre-line` tasidigi icin oldugu gibi
  // uygulaniyor; Arapca/Ingilizce'de kirilim yok, dogal sariyorlar.
  label: Record<Language, string>;
  // Zorluk rozeti (kutunun sag ust kosesi). Kilitli kutularda da
  // gorunuyor: zorlugu soylemek icerigi sizdirmiyor.
  badge: Record<Language, string>;
  // 'list'  = bu sayfadaki hadis izgarasini acar
  // 'link'  = siteye ait baska bir sayfaya gider
  // 'soon'  = icerik henuz yok, hep kilitli
  kind: "list" | "link" | "soon";
  href?: string;
};

const SECTIONS: SectionCard[] = [
  {
    id: "tek-isnad",
    kind: "list",
    label: {
      tr: "Tek İsnadlı\nHadisler",
      ar: "الأحاديث ذات الإسناد الواحد",
      en: "Hadiths with a Single Isnād",
    },
    badge: { tr: "Kolay", ar: "سهل", en: "Easy" },
  },
  {
    id: "tahvil",
    kind: "link",
    href: "/mustafa-calisiyor",
    label: {
      tr: "Tahvîl İçeren\nHadisler",
      ar: "الأحاديث التي فيها تحويل",
      en: "Hadiths Containing a Taḥwīl",
    },
    badge: { tr: "Orta", ar: "متوسط", en: "Medium" },
  },
  {
    id: "bolum-3",
    kind: "soon",
    label: { tr: "", ar: "", en: "" },
    badge: { tr: "Meşakkatli", ar: "شاقّ", en: "Demanding" },
  },
  {
    id: "bolum-4",
    kind: "soon",
    label: { tr: "", ar: "", en: "" },
    badge: {
      tr: "Yalnızca Buhârî’ler İçin",
      ar: "للبخاريّين فقط",
      en: "For Bukhārīs Only",
    },
  },
];

// Izgaralarin ve gezinme dugmelerinin arayuz metinleri. Oyunun KENDI
// metinleri game.html'deki STRINGS'ten geliyor, burasi yalnizca bu
// sayfaya ait.
const UI: Record<
  Language,
  {
    sectionsHeading: string;
    sectionsLede: string;
    heading: string;
    lede: string;
    back: string;
    backToSections: string;
    locked: string;
    lockedSection: string;
    soon: string;
    congrats: string;
    close: string;
  }
> = {
  tr: {
    sectionsHeading: "Mustafâ’yı Peygamberine kavuşturabilir misin?",
    sectionsLede: "Bölümler sırayla açılır. Haydi başlayalım.",
    heading: "Hadislerin isnâdında dolaşma vakti.",
    lede: "Sonraki hadise geçmek için isnadları sırayla tamamla.",
    back: "← Hadis Listesi",
    backToSections: "← Bölümlere Dön",
    locked: "Henüz kilitli — önceki hadisi tamamla",
    lockedSection: "Henüz kilitli — önceki bölümü tamamla",
    soon: "Yakında",
    congrats: "Tebrikler!\nTahvîl İçeren Hadisler’in kilidini açtınız.",
    close: "Kapat",
  },
  ar: {
    sectionsHeading: "هل تستطيع أن توصل مصطفى إلى نبيّه؟",
    sectionsLede: "تُفتح الأقسام بالترتيب. هيّا نبدأ.",
    heading: "حان وقت التجوّل في أسانيد الأحاديث.",
    lede: "أتمم الأسانيد بالترتيب لتنتقل إلى الحديث التالي.",
    back: "→ قائمة الأحاديث",
    backToSections: "→ العودة إلى الأقسام",
    locked: "مقفل — أتمم الحديث السابق",
    lockedSection: "مقفل — أتمم القسم السابق",
    soon: "قريبًا",
    congrats: "تهانينا!\nلقد فتحتَ قسم «الأحاديث التي فيها تحويل».",
    close: "إغلاق",
  },
  en: {
    sectionsHeading: "Can you reunite Mustafâ with his Prophet?",
    sectionsLede: "The sections unlock in order. Let’s begin.",
    heading: "Time to wander through the isnāds of the hadiths.",
    lede: "Complete the isnāds in order to move on to the next hadith.",
    back: "← Hadith List",
    backToSections: "← Back to Sections",
    locked: "Locked — complete the previous hadith",
    lockedSection: "Locked — finish the previous section",
    soon: "Coming soon",
    congrats: "Congratulations!\nYou have unlocked ‘Hadiths Containing a Taḥwīl’.",
    close: "Close",
  },
};

// Ilerleme tarayici hafizasinda: tamamlanan hadislerin id listesi.
// Anahtar SURUMLU: HADITHS'in sirasi/id'leri degisirse eski kayit
// YANLIS kutulari acar. 2026-08-19'da 12 hadis bastan secilince (artik
// Kutub-i Tis'a'nin dokuzundan) -v1→-v2 yapildi ve herkesin ilerlemesi
// bilerek sifirlandi. Bir dahaki listede -v3 yap.
const PROGRESS_KEY = "resule-kavusmak-sinama-progress-v2";

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

export default function ResuleKavusmakHub() {
  const { t, language } = useLanguage();
  // Uc katman: bolumler -> hadis listesi -> oyun.
  //  - inList false, selected null  -> bolum izgarasi (acilis)
  //  - inList true,  selected null  -> 12 hadislik izgara
  //  - selected dolu                -> oyun
  const [inList, setInList] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  // Tebrik pop-up'i yalnizca 12. hadisin BITTIGI AN aciliyor; sonraki
  // ziyaretlerde (allDone hala true olsa bile) tekrar cikmiyor.
  const [showCongrats, setShowCongrats] = useState(false);
  // `null` = kayit henuz okunmadi (sunucu render'i / hidrasyon).
  const completed = useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getProgressServerSnapshot,
  );
  const ui = UI[language];
  // 12'sinin de bitmesi ikinci bolumun kilidini aciyor.
  const allDone =
    completed !== null && HADITHS.every((h) => completed.includes(h.id));

  const markCompleted = useCallback((id: string) => {
    const list = getProgressSnapshot();
    if (list.includes(id)) return;
    writeProgress([...list, id]);
  }, []);

  // Katmanlar arasi HER gecis tarayici gecmisine bir adim birakiyor.
  // Aksi halde uc katman da tek bir URL'de yasadigi icin geri tusu
  // "bir onceki asama" yerine sayfadan TAMAMEN cikariyordu (2026-08-19).
  // Ileri/geri artik gezinti izini adim adim yuruyor; en bastaki
  // bolum izgarasinda geri tusuna basmak ise dogal olarak siteden
  // cikarir (o adim bizim birakmadigimiz, sayfaya giris adimidir).
  const go = useCallback((nextInList: boolean, nextSelected: string | null) => {
    window.history.pushState(
      { rk: { inList: nextInList, selected: nextSelected } },
      "",
    );
    setInList(nextInList);
    setSelected(nextSelected);
  }, []);

  // Katman degistiren her dugme once KISA bir basma efekti oynatiyor,
  // sonra gecis oluyor: tiklamanin hissedilmesi icin. 160ms bilerek
  // kisa -- sayfa "gecikiyor" degil "onayliyor" gibi dursun (bkz.
  // globals.css `.press-go` / `.is-going`).
  const pressThenGo = useCallback(
    (
      e: React.MouseEvent<HTMLElement>,
      nextInList: boolean,
      nextSelected: string | null,
    ) => {
      const el = e.currentTarget;
      el.classList.add("is-going");
      window.setTimeout(() => {
        // Sinifi geri aliyoruz: React bu elemani (ornegin listeye geri
        // donunce) yeniden kullanabilir, uzerinde kalirsa solgun kalirdi.
        el.classList.remove("is-going");
        go(nextInList, nextSelected);
      }, 160);
    },
    [go],
  );

  useEffect(() => {
    function onPop(e: PopStateEvent) {
      // Bizim birakmadigimiz adimda (sayfaya ilk giris) state bos olur:
      // o zaman en ust katmana, bolum izgarasina donuyoruz.
      const s = e.state && e.state.rk;
      setInList(s ? !!s.inList : false);
      setSelected(s && typeof s.selected === "string" ? s.selected : null);
      setShowCongrats(false);
    }
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // Oyun isnadi tamamlayinca iframe'den "bitti" haberi geliyor
  // (game.html icindeki finish()). Kilidi acan tek olay bu -- kutuya
  // girip cikmak yetmiyor, hadisin GERCEKTEN bitirilmesi gerekiyor.
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (!e.data) return;
      if (e.data.type === "resule-kavusmak-completed") {
        const id = String(e.data.hadis);
        if (!HADITHS.some((h) => h.id === id)) return;
        markCompleted(id);
        // 12'nin sonuncusu SIMDI mi bitti? Kayda bu hadis eklendikten
        // sonraki hale bakiyoruz; oyle ise tebrik pop-up'ini aciyoruz.
        const after = getProgressSnapshot();
        if (HADITHS.every((h) => after.includes(h.id))) setShowCongrats(true);
      }
      // Oyunun alt bilgisindeki "Onceki"/"Sonraki": listeye ugramadan
      // dogrudan komsu hadise geciyoruz. "Sonraki" zaten ancak siradaki
      // hadis acikken goruniyor -- yine de kilit kontrolunu burada
      // tekrarliyoruz, cunku iframe'den gelen mesaja guvenilmez.
      if (
        e.data.type === "resule-kavusmak-next" ||
        e.data.type === "resule-kavusmak-prev"
      ) {
        const id = String(e.data.hadis);
        const index = HADITHS.findIndex((h) => h.id === id);
        if (index < 0) return;
        const unlocked =
          index === 0 ||
          getProgressSnapshot().includes(HADITHS[index - 1].id);
        if (!unlocked) return;
        go(true, id);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [markCompleted, go]);

  // Pop-up acikken Esc kapatsin (yalnizca acikken dinleniyor).
  useEffect(() => {
    if (!showCongrats) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowCongrats(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCongrats]);

  // Sirali kilit: ilk hadis daima acik, digeri ancak KENDINDEN ONCEKI
  // hadis tamamlanmissa acilir.
  function isUnlocked(index: number) {
    if (index === 0) return true;
    return (completed ?? []).includes(HADITHS[index - 1].id);
  }

  // Oyuna "siradaki hadis zaten acik mi" diye bildirmek icin: kilit
  // bilgisi burada (localStorage) duruyor, iframe kendi basina bilemez.
  // Acikken oyunun "Sonraki" dugmesi bastan gorunur.
  function isNextUnlocked(id: string) {
    return (completed ?? []).includes(id);
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

      {selected === null && !inList ? (
        /* 1. katman: bolumler. Ilki daima acik; ikincisi 12 hadisin
           tamami bitince acilir; kalan ikisinin icerigi henuz yok. */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            {ui.sectionsHeading}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.sectionsLede}
          </p>

          {completed !== null && (
            <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3 sm:gap-4">
              {SECTIONS.map((s) => {
                const unlocked =
                  s.kind === "list" || (s.kind === "link" && allDone);
                const hint =
                  s.kind === "soon" ? ui.soon : ui.lockedSection;
                const cardClass =
                  "press-go relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-solid px-3 text-center sm:px-5 " +
                  (unlocked
                    ? "border-black/[.08] hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
                    : "cursor-not-allowed border-dashed border-black/[.12] text-black/25 dark:border-white/[.12] dark:text-cream-dimmer/40");
                // Zorluk rozeti: kilitli kutuda da duruyor, yalnizca
                // biraz daha soluk. `whitespace-normal` uzun etiket
                // ("Yalnızca Buhârî'ler İçin") sarabilsin diye.
                const badge = (
                  <span
                    className={
                      "absolute right-2 top-2 max-w-[62%] whitespace-normal rounded-full border border-solid px-2 py-0.5 text-[9px] leading-tight sm:text-[10px] " +
                      (unlocked
                        ? "border-black/[.12] text-black/55 dark:border-white/[.18] dark:text-cream-dimmer"
                        : "border-black/[.10] text-black/30 dark:border-white/[.12] dark:text-cream-dimmer/50")
                    }
                  >
                    {s.badge[language]}
                  </span>
                );
                const label = (
                  <span className="whitespace-pre-line text-sm font-medium leading-tight sm:text-base">
                    {s.label[language]}
                  </span>
                );

                // Acik VE bir sayfaya goturuyorsa gercek bir baglanti
                // olsun (yeni sekmede acilabilsin, durum cubugunda
                // hedefi gorunsun); digerleri buton.
                if (unlocked && s.kind === "link" && s.href) {
                  return (
                    <Link key={s.id} href={s.href} className={cardClass}>
                      {badge}
                      {label}
                    </Link>
                  );
                }
                return (
                  <button
                    key={s.id}
                    type="button"
                    disabled={!unlocked}
                    aria-label={unlocked ? undefined : hint}
                    title={unlocked ? undefined : hint}
                    onClick={(e) => pressThenGo(e, true, null)}
                    className={cardClass}
                  >
                    {badge}
                    {unlocked ? (
                      label
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
      ) : selected === null ? (
        /* 2. katman: 12 hadislik izgara. */
        <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-28 sm:px-6">
          <h1 className="text-center text-xl font-semibold sm:text-2xl">
            {ui.heading}
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-black/60 dark:text-cream-dimmer">
            {ui.lede}
          </p>

          <div className="mt-6 flex justify-start">
            <button
              type="button"
              onClick={(e) => pressThenGo(e, false, null)}
              className="press-go rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              {ui.backToSections}
            </button>
          </div>


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
                    onClick={(e) => pressThenGo(e, true, h.id)}
                    className={
                      "press-go flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-solid px-2 text-center sm:px-4 " +
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
        /* 3. katman: oyun. */
        <div className="pt-24">
          {/* Genislik ve ic bosluk OYUNUN kendi sutunuyla ayni olmali:
              `game.html`'de `.wrap` `max-width:640px` + `padding:24px`.
              Burada `max-w-3xl` (768px) kullanilinca dugme oyunun sol
              kenarindan 64px disariya tasip kopuk duruyordu. */}
          <div className="mx-auto w-full max-w-[640px] px-6">
            <button
              type="button"
              onClick={(e) => pressThenGo(e, true, null)}
              className="press-go rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              {ui.back}
            </button>
          </div>
          {/* `key` ZORUNLU: yalnizca `src` degisirse iframe yeniden
              yuklenmeyip onceki hadisin ic durumunu (bulunmus raviler,
              Mustafa'nin konumu) tasiyabiliyor. */}
          <ResuleKavusmakGame
            key={selected}
            hadis={selected}
            nextUnlocked={isNextUnlocked(selected)}
          />
        </div>
      )}

      {/* 12. hadis bitince acilan tebrik pop-up'i. Kapatilinca oyunda
          KALINIYOR -- son hadisin metni daha yeni ortaya cikti,
          kullanici okumaya devam edebilsin; "Bolumlere don" isteyen
          icin de ayri bir dugme var. */}
      {showCongrats && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.congrats}
          onClick={() => setShowCongrats(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            /* Koyu temada zemin de kart da siyah: golge is gormez,
               karti arka plandan ayiran sey bu ince cerceve. */
            /* `pb-28`: Mustafa karakteri sag alt koseye oturuyor,
               dugmelerin uzerine binmesin diye asagida yer aciliyor.
               `overflow-hidden` karakterin yuvarlak koseden tasmasini
               engelliyor. */
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-solid border-black/[.08] bg-background px-6 py-6 text-center shadow-xl dark:border-white/[.145]"
          >
            {/* Kavusmayi karsilayan Mustafa. Oyunun icindeki ile ayni
                klip; burada React bileseni kullanilabiliyor cunku bu
                pop-up iframe'in DISINDA, sitenin kendi agacinda. */}
            <ChromaKeyVideo
              src="/Mustafa%20Karsilama_seffaf.mp4"
              className="pointer-events-none absolute bottom-0 right-1 z-10 h-28 w-auto max-w-none select-none"
            />
            <p className="whitespace-pre-line text-base font-medium leading-snug">
              {ui.congrats}
            </p>
            <div className="mt-5 flex flex-col items-stretch gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCongrats(false);
                  go(false, null);
                }}
                className="press-go rounded-full border border-solid border-black/[.08] px-4 py-2 text-sm hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                {ui.backToSections}
              </button>
              <button
                type="button"
                onClick={() => setShowCongrats(false)}
                className="px-4 py-1 text-sm text-black/50 transition-opacity hover:opacity-70 dark:text-cream-dimmer"
              >
                {ui.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
