"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

/* Oyunlarin arasayfasi. Onceden "Oyunlar" karti dogrudan tek oyuna
   (/resule-kavusmak) gidiyordu; bu sayfa araya girdi ki ileride eklenen
   oyunlar da ayni yerden secilebilsin.

   Duzen /podcastler ile ayni: ust-orta logo, altinda alt alta hap
   dugmeler. Henuz yapilmamis uc oyun "?" olarak duruyor -- adlari
   bilerek gizli, tiklanamiyorlar. Ayni kalip oyunun kendi icinde de
   var (ResuleKavusmakHub'daki kilitli hadis kutulari). */
export default function Oyunlar() {
  const { t } = useLanguage();

  const dugmeSinifi =
    "flex h-12 w-full max-w-xs items-center justify-center whitespace-nowrap rounded-full border border-solid border-black/20 px-5 text-center text-base font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/70 dark:hover:bg-[#1a1a1a]";

  return (
    <main className="relative flex flex-1 flex-col items-center">
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

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-4 px-6 pb-16 pt-32 sm:px-10">
        <h1 className="sr-only">{t.cardGames}</h1>

        <Link href="/resule-kavusmak" className={dugmeSinifi}>
          {t.gameResuleKavusmak}
        </Link>

        {/* Uc yer tutucu. `disabled` gercekten tiklanamaz yapiyor,
            `aria-label` ise ekran okuyucuya "?" yerine anlamli bir sey
            soyluyor. */}
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            disabled
            aria-label={t.gamesSoon}
            title={t.gamesSoon}
            className={`${dugmeSinifi} cursor-default opacity-50`}
          >
            ?
          </button>
        ))}
      </div>

      {/* Kediler klibi. Eskiden anasayfanin acilis videolarindan biriydi
          (bkz. IntroVideo); orasi tek klibe indirilince digerleri
          sayfalara dagitildi, bu da oyunlara dustu.

          Konum `absolute`, `fixed` DEGIL -- /selam'daki ile ayni gerekce:
          fixed iken klip gorunum alaninin dibine yapisip footer'in
          uzerini ortuyor. absolute olunca sarmalayici <main>'in dibinde,
          yani tam footer'in ustunde duruyor.

          Telefonda klip ekranin TAM genisligi (`w-full`, yukseklik orandan
          geliyor); masaustunde saga yaslanip yuksekligiyle olculuyor.
          Klibin sol ~%43'u bos (kediler ve karakter sag yarida), o yuzden
          saga yaslandiginda konu ekranin kosesine oturuyor -- dar ekranda
          ise bos payin da isi var, konuyu ekran kenarina degdirmiyor. */}
      <ChromaKeyVideo
        src="/Kediler_seffaf.mp4"
        className="absolute bottom-0 left-0 h-auto w-full md:left-auto md:right-0 md:h-[25vh] md:w-auto md:max-w-none"
      />
    </main>
  );
}
