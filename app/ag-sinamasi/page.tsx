"use client";

import Link from "next/link";
import ChromaKeyVideo from "../ChromaKeyVideo";
import SilsileAgi from "../SilsileAgi";
import { useLanguage } from "../LanguageContext";

/* Duzen /mustafa-calisiyor'un aynisi -- ustte anasayfaya goturen HD
   logosu, footer'i ve tema/dil dugmelerini kok layout veriyor. Iki fark
   var, ikisi de asagida yerinde anlatildi: govde konusma balonu yerine
   silsile agini tasiyor, ve karsilama karakteri BURADA YOK.

   Gorsellestirme IFRAME DEGIL, dogrudan React bileseni (bkz.
   SilsileAgi.jsx). /resule-kavusmak'taki oyun iframe icinde cunku o
   kendi HTML/CSS/JS'ini tasiyan bagimsiz bir sayfa; bu ise zaten bir
   React bileseni, iframe'e sokmak icin once tek basina calisan bir
   sayfaya cevirmek gerekirdi. */
export default function AgSinamasi() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
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

      {/* KARSILAMA KARAKTERI BU SAYFADA YOK, oysa /mustafa-calisiyor,
          /selam ve /su-anda-buradasiniz'da sag alt kosede duruyor.
          Sebep: agin kendi "Râvi bul" kutusu ve yakinlastirma dugmeleri
          tam o kosede; 25vh'lik klip onlarin uzerine biniyordu
          (`pointer-events-none` ile tiklanabilir kaliyorlardi ama
          gorunusteki ortusme kaliyordu, dar ekranda iyice baskindi).
          Mustafa'nin karari, 2026-08-29: bu sayfada karakter olmasin,
          ag tam ekrani kullansin. */}

      {/* Gorsellestirme MUTLAK KONUMLU, akista degil.

          Sebebi bilesenin kok div'inin `h-full` (yani `height:100%`)
          olmasi: yuzde yukseklik ancak kapsayicinin yuksekligi KESIN
          ise cozulur. Buradaki zincirde kesin degil -- kok layout
          govdeye `min-h-dvh` veriyor, `height` degil, `flex-1` de bu
          belirsizligi asagi tasiyor. Akista birakildiginda bilesen
          %100 yerine kendi icerigi kadar, yani yalnizca 76px'lik kendi
          basligi kadar yer kapliyordu (olculdu; tuval sifir yukseklikte
          kaliyordu). `inset` ile yukseklik kesinlesiyor ve yuzde
          cozuluyor. <main> zaten `relative`.

          `top-20`: ag, logonun (72px) ve iki yandaki tema/dil
          dugmelerinin ALTINDAN basliyor -- agin kendi basligi da sol
          ustte duruyor, ustuste binmeleri sorun olurdu.

          <main> boyunu bu cocuktan ALMIYOR (mutlak konumlu cocuk
          yukseklige katkida bulunmaz); kok layout'un `min-h-dvh`
          kabindan `flex-1` ile bir ekran boyu aliyor, footer da
          katlanma cizgisinin altinda kaliyor. */}
      <div className="absolute inset-x-0 bottom-0 top-20">
        <SilsileAgi />
      </div>
    </main>
  );
}
