"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";
import SwapContent from "../SwapContent";
import { TRANSLATIONS, type Language } from "../translations";

function GamepadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      // relative: .glow-ring/.glow-cover position:absolute oldugu icin
      // DOM sirasindan bagimsiz olarak normalde onlarin ALTINDA kalirdi
      // (konumlanmamis/in-flow icerik, konumlanmis kardeslerden once
      // boyanir) -- ikonun opak .glow-cover'in ALTINDA kaybolmasini
      // (ve boylece dugmenin tamamen bombos gorunmesini) engelliyor.
      className="relative h-[19px] w-[19px]"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      <path d="M6 12h4" />
      <path d="M8 10v4" />
      <path d="M15 13h.01" />
      <path d="M18 11h.01" />
    </svg>
  );
}

export default function Sinama() {
  const { t, language, outgoingLanguage } = useLanguage();

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      {/* Dil dugmesinin (layout.tsx, fixed right-4 top-4, h-9) hemen
          altinda, ayni gorunumde bir dugme: 8px bosluk icin top-[60px]
          (16 + 36 + 8). Yalnizca bu sayfaya ozgu oldugundan layout.tsx
          yerine burada duruyor.

          glow-btn-test: iPhone/Safari uyumluluk denemesi (2026-08-10).
          Anasayfadaki/oyundaki .glow-btn / .bubble.glow-active henuz
          buna gecirilmedi -- onaylanana kadar yalniz burada.

          v5: SVG'yi TAMAMEN birakan farkli bir teknik (globals.css'teki
          .glow-ring yorumuna bkz.) -- v1/v2/v3'te sirayla pathLength,
          calc(), SVG'ye dogrudan filter:blur() kusurlari bulunup
          duzeltildi ama iPhone'da yine degisiklik gorulmedi. v4
          (conic-gradient + mask-composite:exclude ring-oyma) test
          aracimda BILE tutarsiz davrandi (buyuk boyutta calisiyor, 36px
          dugmede kayboluyor) -- o yuzden mask'a hic guvenmeyen v5'e
          gecildi: donen bir conic-gradient dairesi dugmenin ARKASINA
          konup uzerine dugmeyle AYNI boyutta opak bir "kapak" katmani
          bindiriliyor; halka yalniz kapaktan tasan kenarda (RIM'de)
          gorunuyor. Hicbir mask/filtre/SVG YOK, sadece DOM sirasiyla
          (arka->kapak->ikon) katman katman boyama -- CSS'in en temel,
          en eski ozelligi. JS de hala gerekmiyor. */}
      <Link
        href="/resule-kavusmak"
        className="glow-btn-test fixed right-4 top-[60px] z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-background text-foreground transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        aria-label="Resûle Kavuşmak"
        title="Resûle Kavuşmak"
      >
        <span className="glow-ring" aria-hidden="true" />
        <span className="glow-cover" aria-hidden="true" />
        <GamepadIcon />
      </Link>
      {/* Giris klibi burada `IntroVideo` ile GELMIYOR. Anasayfadaki
          surum klibi `fixed z-50` ile gorunum alanina cakiyor, sonsuz
          donguye aliyor ve her ziyarette listeden sirayla birini
          gosteriyor. Uc sorun da burada bilerek terk edildi:

          - Dongu kapatildi (`loop={false}`). Klip bir kez oynayip son
            karesinde duruyor -- tipki logo gibi. Okurken kosede surekli
            hareket eden bir sey kalmiyor.
          - `fixed` yerine akisin ICINDE. Kaydirinca pesimizden gelmiyor,
            sayfanin bir parcasi. Bu sayede anasayfadaki `pb-[35vh]`
            kacamagina da gerek kalmadi (o dolgu, ustte duran klibin
            butonlari kapatmasini onlemek icindi).
          - Havuz degil tek klip. Digerleri sayfalara dagitilacak. */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-10 px-8 pt-28 pb-24 sm:items-start sm:px-16 sm:pt-36 md:max-w-5xl">
        {/* Sayfada gorunur bir h1 kalmadi ("Bir Seyler Deniyorum"
            kaldirildi). Belgenin yine de tek bir ana basligi olmali --
            ekran okuyucular sayfayi basliklardan geziyor. Gorsel duzeni
            hic etkilemeyen bir h1 birakildi. */}
        <h1 className="sr-only">{t.brandAlt}</h1>

        <div className="flex w-full flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-6">
          <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-start">
            <span role="img" aria-label={t.brandAlt} className="my-[-38px] block">
              <ChromaKeyVideo
                src="/HD-Animasyon.mp4"
                loop={false}
                className="h-[140px] w-auto max-w-none brightness-0 dark:brightness-100"
              />
            </span>
            <p className="site-welcome text-sm font-medium uppercase tracking-[0.14em] text-zinc-500 dark:text-cream-dimmer">
              {t.welcome}
            </p>
            {/* Metin serifi yalnizca BURADA. Baslik kaldirildigi icin
                sayfanin gorsel agirligini artik bu paragraf tasiyor;
                serif ona hem agirlik hem sicaklik veriyor. Font
                degiskeni app/sinama/layout.tsx'ten geliyor, bu yuzden
                anasayfada bu sinif hicbir sey yapmaz. */}
            <p className="site-description max-w-md font-[family-name:var(--font-newsreader)] text-2xl leading-9 text-zinc-700 dark:text-cream-dim">
              {t.descriptionQuestion}
              <br />
              {t.descriptionRephrase}
              <br />
              <strong className="font-semibold text-black dark:text-foreground">
                {t.descriptionHadith}
              </strong>{" "}
              {t.descriptionAnd}{" "}
              <strong className="font-semibold text-black dark:text-foreground">
                {t.descriptionDigital}
              </strong>
            </p>
          </div>

          {/* Olcu px, vh DEGIL. vh kurali kosede duran fixed konumlu susleme
              klipleri icin; bu klip akisin icinde, yani logo gibi
              sayfanin geri kalaniyla birlikte yakinlastirmadan
              ETKILENMELI (bkz. logonun uzerindeki not).

              Yukseklik 210px'i gecmemeli: klip 16:9 oldugu icin 210px
              yukseklik ~373px genislik demek ve metin sutununa
              (max-w-md = 448px) 896px'lik alanda ancak bu kaliyor.
              Denemede 38vh ile birakilmisti, klip 486px'e ciktigi icin
              metni 249px'e sikistiriyordu. */}
          <ChromaKeyVideo
            src="/Mustafa%20Thinking%20Green_seffaf.mp4"
            loop={false}
            className="h-[150px] w-auto max-w-none shrink-0 md:h-[210px]"
          />
        </div>

        <div className="site-actions flex w-full flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            href="/selam"
            className="flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-5 text-center text-background transition-opacity hover:opacity-90 md:w-auto md:min-w-[158px]"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].begin}
            />
          </Link>
          <a
            className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/[.08] px-5 text-center transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-auto md:min-w-[158px]"
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].about}
            />
          </a>
        </div>

        {/* "Burada neler var" izgarasi. Iki isi birden goruyor: sayfa iki
            dugmeyle bitmedigi icin daha bitmis duruyor, VE anasayfadan
            hic baglanti almayan sayfalar (/podcastler, /hadis-tarihi)
            nihayet ulasilabilir oluyor. Ikincisi arama tarafi icin de
            onemli -- Google ic baglantiyla geziyor, sitemap'te olmak tek
            basina yetmiyor. */}
        <nav aria-label={t.indexLead} className="w-full">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-cream-dimmer">
            {t.indexLead}
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/podcastler", ad: t.cardPodcasts, alt: t.cardPodcastsDesc },
              { href: "/hadis-tarihi", ad: t.cardHadithHistory, alt: t.cardHadithHistoryDesc },
              { href: "/resule-kavusmak", ad: t.cardGame, alt: t.cardGameDesc },
              { href: "/rihle", ad: t.cardRihle, alt: t.cardRihleDesc },
            ].map((kart) => (
              <li key={kart.href}>
                {/* Kenar rengi `dark:border-white/[.145]` ILE VERILMIYOR. O
                    sinif sitede her yerde var ama koyu temada CALISMIYOR:
                    `@custom-variant dark (&:where(.dark, .dark *))` ozgullugu
                    :where() ile sifirladigi icin dark kurali
                    `border-black/[.08]` ile ayni ozgullukte kaliyor ve
                    siralamada kaybediyor -- koyu temada kenar, siyah zemin
                    uzerinde %8 siyah cikiyor, yani gorunmuyor. (Yayindaki
                    anasayfada da boyle, ayri bir is.)

                    Cozum globals.css icindeki `.hairline-card` sinifi:
                    duz CSS oldugu icin tema degisince gercekten donuyor.
                    Tailwind ile denenen iki yol da donmedi, gerekcesi orada. */}
                <Link
                  href={kart.href}
                  className="hairline-card flex h-full flex-col gap-1 rounded-2xl p-4 transition-colors hover:bg-foreground/[.04]"
                >
                  <span className="font-[family-name:var(--font-newsreader)] text-lg font-semibold text-black dark:text-foreground">
                    {kart.ad}
                  </span>
                  <span className="text-sm leading-6 text-zinc-600 dark:text-cream-dimmer">
                    {kart.alt}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </div>
  );
}
