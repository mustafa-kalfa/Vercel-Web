"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import HazirlaniyorRozeti from "../HazirlaniyorRozeti";
import { useLanguage } from "../LanguageContext";

export default function Podcastler() {
  const { t } = useLanguage();

  /* Eskiden `h-12` ve `whitespace-nowrap` vardi: butun basliklar tek
     kelimelikti ("Hadis Tarihi", "Oryantalizm"). Yeni kategori adlari
     uzun ("Guncel Meseleler ve Diger Alanlarla Iliski"), sarmalari
     gerekiyor. `min-h-12` sabit yukseklik yerine ALT SINIR koyuyor,
     `py-2.5` de iki satirlik kutuya nefes veriyor. Kutu `max-w-xs`ten
     `max-w-sm`e genisledi ki cogu baslik tek satirda kalabilsin. */
  const dugmeSinifi =
    "flex min-h-12 w-full max-w-sm items-center justify-center rounded-full border border-solid border-black/20 px-5 py-2.5 text-center text-base font-medium transition-colors dark:border-white/70";
  const acikSinifi = `${dugmeSinifi} hover:border-transparent hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]`;
  /* Kapali dugmede SOLUKLUK ARTIK BUTUN DUGMEDE DEGIL, yalnizca
     yazida ve kenarlikta. Eskiden `opacity-50` dugmenin tamamina
     veriliyordu; icine "Hazirlaniyor" rozeti girince rozet de
     yariya soluyor ve okunmuyordu. Durumu bildiren asil isaret artik
     rozet, o yuzden net duruyor. */
  const kapaliSinifi = `${dugmeSinifi} cursor-default gap-2 border-black/10 dark:border-white/30`;

  /* On dort kategori, Mustafa'nin verdigi sirayla (2026-09-09). Listede
     numara YOK: kendisi "basindaki rakamlari kaldir" dedi, o yuzden
     sira yalnizca dizinin kendi sirasi.

     YALNIZCA ILKI TIKLANABILIR. Digerleri /mustafa-calisiyor'a
     gitmiyor artik, hic tiklanamiyor -- yine Mustafa'nin karari:
     icerigi olmayan bir baslik, ziyaretciyi baska bir sayfaya
     gonderecegine hic tepki vermesin.

     Bir kategori hazir olunca buraya `href` eklenip
     `kapaliSinifi` yerine `acikSinifi` verilmesi yetiyor. */
  const kategoriler = [
    t.podcastHadithHistory,
    t.podcastCatGeography,
    t.podcastCatTerms,
    t.podcastCatUsulLit,
    t.podcastCatRijal,
    t.podcastCatIlal,
    t.podcastCatTahammul,
    t.podcastCatSources,
    t.podcastCatSitte,
    t.podcastCatFiqh,
    t.podcastCatKalam,
    t.podcastCatQuran,
    t.podcastCatOrientalism,
    t.podcastCatCurrent,
  ];

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

      {/* Bosluk `gap-4`ten `gap-3`e indi: dort dugmeyken bol duruyordu,
          on dortte sayfayi gereksiz uzatiyordu. */}
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-6 pb-16 pt-32 sm:px-10">
        {kategoriler.map((ad, i) =>
          i === 0 ? (
            <Link key={ad} href="/hadis-tarihi" className={acikSinifi}>
              {ad}
            </Link>
          ) : (
            /* `disabled` gercekten tiklanamaz yapiyor; `title` ise fareyle
               uzerine gelen ziyaretciye neden tepki vermedigini soyluyor.
               Ayni kalip /oyunlar'daki "?" dugmelerinde de var. */
            <button
              key={ad}
              type="button"
              disabled
              title={t.comingSoon}
              className={kapaliSinifi}
            >
              <span className="opacity-50">{ad}</span>
              <HazirlaniyorRozeti />
            </button>
          ),
        )}
      </div>

      {/* Yagmur klibi. Kediler gibi bu da eskiden anasayfanin acilis
          videolarindan biriydi (bkz. IntroVideo); orasi tek klibe
          indirilince sayfalara dagitildi.

          Konum `absolute`, `fixed` DEGIL -- /selam'daki ile ayni gerekce:
          fixed iken klip gorunum alaninin dibine yapisip footer'in
          uzerini ortuyor. absolute olunca sarmalayici <main>'in dibinde,
          yani tam footer'in ustunde duruyor.

          Olculer IntroVideo'daki ayarindan geliyor: telefonda tam ekran
          genisligi, masaustunde sola yasli 22.5vh. Gokyuzu yesil cekilip
          seffaflastirildigi icin klibin kendi kenari yok, maske
          gerekmiyor. */}
      <ChromaKeyVideo
        src="/Mustafa%20Yagmur_seffaf.mp4"
        className="absolute bottom-0 left-0 h-auto w-full object-contain md:h-[22.5vh] md:w-auto md:max-w-none"
      />
    </main>
  );
}
