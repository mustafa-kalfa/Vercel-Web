"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";
import SwapContent from "../SwapContent";
import { TRANSLATIONS, type Language } from "../translations";

/* Ceviri sozlugunun anahtarlari. Kart dizisi metni degil bu anahtari
   tutuyor, boylece SwapContent ayni anahtari iki dilde de cozebiliyor. */
type CeviriAnahtari = keyof (typeof TRANSLATIONS)[Language];

/* Kart ikonlari. Hepsi ayni kalipta: 24'luk viewBox, dolgu yok, cizgi
   `currentColor`'dan geliyor (yani kartin metin rengini takip ediyor,
   iki temada da ayri bir kural gerekmiyor), kalinlik 1.8.
   `shrink-0` sart -- kart basligi uzun olunca flex ikonu eziyordu. */
function IkonKabi({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[19px] w-[19px] shrink-0"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

// Ravi Iliski Aglari: birbirine bagli uc dugum.
function AgIcon() {
  return (
    <IkonKabi>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M10.4 7.2 6.6 16.8" />
      <path d="m13.6 7.2 3.8 9.6" />
      <path d="M7.5 19h9" />
    </IkonKabi>
  );
}

// Podcastler: mikrofon.
function MikrofonIcon() {
  return (
    <IkonKabi>
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
      <path d="M8.5 21h7" />
    </IkonKabi>
  );
}

// Rihleler: bir noktadan digerine kivrilan yol.
function YolIcon() {
  return (
    <IkonKabi>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6" />
    </IkonKabi>
  );
}

// Oyunlar: oyun kolu. Eskiden sag ustteki dugmenin icindeydi.
function GamepadIcon() {
  return (
    <IkonKabi>
      <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      <path d="M6 12h4" />
      <path d="M8 10v4" />
      <path d="M15 13h.01" />
      <path d="M18 11h.01" />
    </IkonKabi>
  );
}

// Egitim Icerikleri: acik kitap.
function KitapIcon() {
  return (
    <IkonKabi>
      <path d="M12 6.5S9.5 4.5 4 4.5v13c5.5 0 8 2 8 2s2.5-2 8-2v-13c-5.5 0-8 2-8 2z" />
      <path d="M12 6.5v13" />
    </IkonKabi>
  );
}

export default function Sinama() {
  const { t, language, outgoingLanguage } = useLanguage();

  /* Kartlar. Metinler COZULMUS DEGIL, ceviri ANAHTARI olarak tutuluyor
     (`adAnahtar` / `altAnahtar`). Sebep: dil degisiminde SwapContent
     hem eski hem yeni dilin metnini ayni anda cizmek zorunda, yani
     `t.cardPodcasts` gibi tek bir dile baglanmis bir dize ise
     yaramiyor -- anahtardan iki dilde de okunabilmesi gerekiyor. */
  const kartlar: {
    href: string;
    adAnahtar: CeviriAnahtari;
    altAnahtar: CeviriAnahtari;
    ikon: React.ReactNode;
  }[] = [
    {
      href: "/ravi-iliski-aglari",
      adAnahtar: "cardNetworks",
      altAnahtar: "cardNetworksDesc",
      ikon: <AgIcon />,
    },
    {
      href: "/podcastler",
      adAnahtar: "cardPodcasts",
      altAnahtar: "cardPodcastsDesc",
      ikon: <MikrofonIcon />,
    },
    {
      href: "/rihleler",
      adAnahtar: "cardRihle",
      altAnahtar: "cardRihleDesc",
      ikon: <YolIcon />,
    },
    {
      href: "/oyunlar",
      adAnahtar: "cardGames",
      altAnahtar: "cardGamesDesc",
      ikon: <GamepadIcon />,
    },
    {
      href: "/egitim-icerikleri",
      adAnahtar: "cardEducation",
      altAnahtar: "cardEducationDesc",
      ikon: <KitapIcon />,
    },
  ];

  /* Kok div'de `overflow-x-clip`: klibin `right-[-4.5vh]` negatif payi
     (karakterin sagindaki seffaf boslugu kapatiyor) artik akisin icinde
     oldugu icin sayfaya yatay kaydirma cubugu ekliyordu. `clip` secildi,
     `hidden` DEGIL: overflow-x:hidden overflow-y'yi de auto'ya cevirip
     istenmeyen bir kaydirma kabi olusturuyor, clip ise sadece kirpiyor. */
  return (
    <div className="relative flex flex-col flex-1 items-center justify-center overflow-x-clip font-sans">
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
      {/* Dar ekranda ust dolgu 56px: tema anahtari (64px genis) ve dil
          dugmesi (ikon eklenince 71px) buyudugu icin logo 320px'lik bir
          ekranda ikisinin arasina sigmiyordu. Logoyu kucultmek yerine
          dugmelerin ALTINA indirildi -- boylece yatay sigma sorunu
          tamamen ortadan kalkiyor. Genis ekranda yer bol, eski dolgu. */}
      <header className="flex w-full justify-center pt-14 sm:pt-4">
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
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-start gap-8 px-8 pt-8 pb-8 sm:items-start sm:px-16 sm:pt-12 sm:pb-12">
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

        {/* "Burada neler var" izgarasi. Sayfanin govdesi bu: anasayfadan
            hic baglanti almayan /podcastler nihayet ulasilabilir oluyor.
            Arama tarafi icin de onemli -- Google ic baglantiyla geziyor,
            sitemap'te olmak tek basina yetmiyor.

            /hadis-tarihi'nin kendi karti YOK ama /podcastler ona baglanti
            veriyor, yani zincir kopmuyor.

            "Ravi Iliski Aglari"nin henuz sayfasi yok; /mustafa-calisiyor
            ("Mustafa bu is uzerinde calisiyor") tam bunun icin duruyor. */}
        <nav aria-label={t.indexLead} className="w-full">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-cream-dimmer">
            {t.indexLead}
          </h2>
          {/* `auto-rows-fr`: kartlarin BASLIK uzunlugu farkli ("Oyunlar" tek
              satir, "Egitim Icerikleri ve Diger Hizmetler" iki satir).
              Onsuz her satir kendi icerigine gore yukseklik aliyor ve
              kartlar farkli boyda cikiyor; bununla butun satirlar en
              uzununa esitleniyor. */}
          <ul className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2">
            {kartlar.map((kart) => (
              <li key={kart.href}>
                <Link
                  href={kart.href}
                  className="flex h-full flex-col gap-1 rounded-2xl border border-solid border-black/20 p-4 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]"
                >
                  <span className="flex items-start justify-between gap-3">
                  {/* Baslik ve aciklama SwapContent'ten geciyor: dil
                      degisince eski metin yukari kayip cikiyor, yenisi
                      asagidan geliyor -- dil ve "Mustafâ Hakkında"
                      dugmelerindeki hareketin aynisi.

                      `cokSatir` sart: ontanimli hal dugme etiketlerine
                      gore ayarli (tek satir, ortali). Kart metni sola
                      yasli ve sarabiliyor.

                      Baslikta `min-w-0`: flex satirinda ikonun yaninda
                      duruyor ve onsuz uzun baslik ikonu eziyor. */}
                  <SwapContent
                    className="min-w-0 flex-1 text-lg font-semibold text-black dark:text-foreground"
                    current={language}
                    outgoing={outgoingLanguage}
                    render={(anahtar) =>
                      TRANSLATIONS[anahtar as Language][kart.adAnahtar]
                    }
                    cokSatir
                  />
                  <span className="mt-1 text-zinc-500 dark:text-cream-dimmer">
                    {kart.ikon}
                  </span>
                </span>
                <SwapContent
                  className="text-sm leading-6 text-zinc-600 dark:text-cream-dimmer"
                  current={language}
                  outgoing={outgoingLanguage}
                  render={(anahtar) =>
                    TRANSLATIONS[anahtar as Language][kart.altAnahtar]
                  }
                  cokSatir
                />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tek dugme, kartlarin ALTINDA. "Baslayalim" kaldirildi; geriye
            kalan "Mustafa Hakkinda" da artik X profiline degil /selam'a
            gidiyor.

            Mutlak adres (https://www.mustafakalfa.com/selam) yerine
            goreli `/selam` ve <a> yerine <Link>: ayni hedef, ama Next
            sayfayi bastan yuklemek yerine istemci tarafinda geciyor. */}

        <div className="site-actions flex w-full text-base font-medium">
          <Link
            href="/selam"
            className="flex h-12 w-full items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/20 px-5 text-center transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a] md:w-auto md:min-w-[158px]"
          >
            <SwapContent
              current={language}
              outgoing={outgoingLanguage}
              render={(key) => TRANSLATIONS[key as Language].about}
            />
          </Link>
        </div>
      </main>
      {/* Klip `sticky`, akisin EN SONUNDA. Uc denemenin ucuncusu:

          `fixed`   gorunum alanina yapisiyor, hep gorunuyor -- ama sayfa
                    sonunda footer'in uzerine biniyordu.
          `absolute` sarmalayicinin dibine yapisiyor, footer'a hic
                    degmiyor -- ama /sinama'nin govdesi bir ekrandan
                    UZUN oldugu icin klip katlanma cizgisinin altinda
                    kaliyor ve acilista hic gorunmuyordu.
          `sticky`  ikisinin birlesimi: kaydirdikca gorunum alaninin
                    dibinde duruyor, sayfa sonuna gelindiginde sarmalayici
                    bitiyor ve klip tam footer'in ustunde duruyor.

          Kap `h-0`: sticky oge akisin icinde oldugu icin yukseklik
          verseydi sayfaya o kadar bosluk eklerdi. Klip kabin icinde
          `absolute bottom-0` ile yukari dogru ciziliyor. */}
      <div className="pointer-events-none sticky bottom-0 z-50 h-0 w-full">
        <ChromaKeyVideo
          src="/Mustafa%20Thinking%20Green_seffaf.mp4"
          className="absolute bottom-0 right-[-3vh] h-[12.65625vh] w-auto max-w-none md:right-[-4.5vh] md:h-[16.875vh]"
        />
      </div>
    </div>
  );
}
