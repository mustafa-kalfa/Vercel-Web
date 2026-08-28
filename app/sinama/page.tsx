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
      {/* Giris klibi ESKI HALINE dondu: kosede `fixed z-50`, dongude ve
          IntroVideo'daki olculerin aynisi. Tek fark, havuzdan sirayla
          degil yalnizca bu klip geliyor -- digerleri sayfalara
          dagitilacak.

          Alttaki `pb-[35vh]` bu yuzden geri kondu: klip icerigin ONUNDE
          durdugu icin dar ekranda en alttaki ogeyi kesiyordu ve
          kaydiracak yer olmadigi icin ulasilamiyordu. */}
      <ChromaKeyVideo
        src="/Mustafa%20Thinking%20Green_seffaf.mp4"
        className="fixed bottom-0 right-[-4vh] z-50 h-[16.875vh] w-auto max-w-none md:right-[-6vh] md:h-[22.5vh]"
      />
      {/* Logo artik main'in ICINDE degil, ustte kendi header'inda: sitenin
          diger sayfalarindaki (/mustafa-calisiyor, /podcastler ...) ust
          orta logo yerlesimiyle ayni his.

          `my-[-38px]` yerinde kaliyor -- kadrajin ust/alt %40'i bos, o
          negatif kenar bosluklari olmadan header kocaman gorunur.
          Hesap: 140px kutu - 76px bosluk = 64px gorunur yukseklik,
          ustteki pt-4 ile gorunen cizim y=16'da basliyor.

          Dar ekranda (sm alti) logo 104px'e iniyor, negatif kenar
          boslugu da ayni oranda -28px oluyor. Sebep: 140px'lik logo
          320px genislikte 249px yer kapliyor ve sag ustteki dil
          dugmesine (fixed right-4) degiyordu. 104px'te 185px kaliyor,
          iki dugmeyle de arasi aciliyor. */}
      <header className="flex w-full justify-center pt-4">
        <span
          role="img"
          aria-label={t.brandAlt}
          className="my-[-28px] block sm:my-[-38px]"
        >
          <ChromaKeyVideo
            src="/HD-Animasyon.mp4"
            loop={false}
            className="h-[104px] w-auto max-w-none brightness-0 sm:h-[140px] dark:brightness-100"
          />
        </span>
      </header>
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-8 px-8 pt-8 pb-[35vh] sm:items-start sm:px-16 sm:pt-12 sm:pb-24">
        {/* Sayfada gorunur bir h1 kalmadi ("Bir Seyler Deniyorum"
            kaldirildi). Belgenin yine de tek bir ana basligi olmali --
            ekran okuyucular sayfayi basliklardan geziyor. Gorsel duzeni
            hic etkilemeyen bir h1 birakildi. */}
        <h1 className="sr-only">{t.brandAlt}</h1>

        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-start">
          <p className="site-description max-w-md text-lg leading-8 text-zinc-600 dark:text-cream-dimmer">
            {t.descriptionQuestion}
            <br />
            {t.descriptionRephrase}
            <br />
            <strong className="font-semibold">{t.descriptionHadith}</strong>{" "}
            {t.descriptionAnd}{" "}
            <strong className="font-semibold">{t.descriptionDigital}</strong>
          </p>
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
              { href: "/mustafa-calisiyor", ad: t.cardNetworks, alt: t.cardNetworksDesc },
              { href: "/resule-kavusmak", ad: t.cardGames, alt: t.cardGamesDesc },
              { href: "/podcastler", ad: t.cardPodcasts, alt: t.cardPodcastsDesc },
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
                  <span className="text-lg font-semibold text-black dark:text-foreground">
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
