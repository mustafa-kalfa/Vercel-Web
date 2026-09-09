"use client";

import Link from "next/link";
import { useState } from "react";
import AudioPlayer from "../AudioPlayer";
import ChromaKeyVideo from "../ChromaKeyVideo";
import { useLanguage } from "../LanguageContext";

const MIHNE_SRC = "/podcast/mihne-hadisesi.mp3";

/* Hadis Tarihi kategorisinin sekiz bolumu, Mustafa'nin verdigi sirayla
   (2026-09-09). Basliklardaki "K2 007" gibi onekler KIMLIK: hangi kayit
   olduklarini soyluyorlar, ceviride de aynen duruyorlar.

   Simdilik YALNIZCA Mihne kaydi var. Digerleri tiklanamiyor -- boyle
   olmasi Mustafa'nin karari: kaydi olmayan bir bolum, ziyaretciyi baska
   bir sayfaya gonderecegine hic tepki vermesin.

   Yeni bir kayit gelince o kalemin `ses` alanina dosya yolu yazmak
   yetiyor; asagidaki cizim onu kendiliginden oynatilabilir yapiyor. */
const BOLUMLER = [
  { anahtar: "podcastEp001", ses: null },
  { anahtar: "podcastEp002", ses: null },
  { anahtar: "podcastEp003", ses: null },
  { anahtar: "podcastEp004", ses: null },
  { anahtar: "podcastEp005", ses: null },
  { anahtar: "podcastEp006", ses: null },
  { anahtar: "podcastEp007", ses: MIHNE_SRC },
  { anahtar: "podcastEp008", ses: null },
] as const;

export default function HadisTarihi() {
  const { t } = useLanguage();
  /* Acik oynaticinin ANAHTARI tutuluyor, acik/kapali bir bayrak degil:
     ikinci bir kayit eklendiginde ayni durum onu da yonetsin ve ayni
     anda yalnizca bir oynatici acik kalsin. */
  const [acikBolum, setAcikBolum] = useState<string | null>(null);

  /* Basliklar uzun ("K1 002 Hadislerin yazilmasi, sadrin zabtindan
     satrin zabtina"), o yuzden sabit `h-12` ve `whitespace-nowrap`
     birakildi: kutu `min-h-12` ile alt sinira oturuyor ve metin
     sarmalayabiliyor. Genislik `max-w-md` -- /podcastler'deki
     kategorilerden bir kademe genis, cunku bu basliklar daha uzun. */
  const dugmeSinifi =
    "flex min-h-12 w-full max-w-md items-center justify-center rounded-full border border-solid border-black/20 px-5 py-2.5 text-center text-base font-medium transition-colors dark:border-white/70";
  const acikSinifi = `${dugmeSinifi} hover:border-transparent hover:bg-black/[.04] dark:hover:bg-[#1a1a1a]`;
  const kapaliSinifi = `${dugmeSinifi} cursor-default opacity-50`;
  const basiliSinifi = `${acikSinifi} border-transparent bg-black/[.04] dark:bg-[#1a1a1a]`;

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

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-6 pb-16 pt-32 sm:px-10">
        {BOLUMLER.map((b) => {
          const ad = t[b.anahtar];
          if (!b.ses) {
            return (
              <button
                key={b.anahtar}
                type="button"
                disabled
                title={t.comingSoon}
                className={kapaliSinifi}
              >
                {ad}
              </button>
            );
          }
          const acik = acikBolum === b.anahtar;
          return (
            <div key={b.anahtar} className="contents">
              {/* Oynatici acikken dugme gizlenmiyor, basili kaliyor:
                  kullanici hangi bolumu dinledigini gorsun. Ikinci
                  tiklama duraklatmiyor, oynaticinin kendi dugmesi o isi
                  yapiyor. */}
              <button
                type="button"
                onClick={() => setAcikBolum(b.anahtar)}
                aria-expanded={acik}
                className={acik ? basiliSinifi : acikSinifi}
              >
                {ad}
              </button>
              {/* `autoPlay`: oynatici yalnizca dugmeye basilinca mount
                  oldugu icin tarayicinin otomatik oynatma kisiti
                  asiliyor -- kullanici hareketi zincirin icinde. */}
              {acik && <AudioPlayer src={b.ses} autoPlay />}
            </div>
          );
        })}
      </div>
    </main>
  );
}
