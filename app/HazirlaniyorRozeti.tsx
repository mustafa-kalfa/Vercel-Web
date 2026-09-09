"use client";

import { useLanguage } from "./LanguageContext";

/* Icerigi henuz gelmemis dugmelerin uzerindeki durum rozeti.

   Anasayfadaki kart rozetiyle AYNI gorunum (bkz. page.tsx,
   `rozetAnahtar`): ayni renk kaynagi (`--color-secim`, yani metin
   secim rengi -- Mustafa oyle istedi), ayni yuvarlak hap bicimi. Orada
   SwapContent ile ciziliyor cunku kartlar dil degisiminde capraz gecis
   yapiyor; bu sayfalar dogrudan `t` okudugu icin o sarmalayiciya gerek
   yok.

   KONUM: dugmenin KOSESINDE, kenarligin bir miktar disinda
   (`-top-1.5 -end-1.5`). Bir sure dugme metninin yaninda, akisin icinde
   duruyordu; Mustafa "kosede olmali" dedi (2026-09-09) ve anasayfa
   kartindaki rozet de ayni gun oraya tasindi.

   Rozet akistan CIKTIGI icin dugmeyi genisletmiyor: uzun basliklar artik
   rozete yer acmak zorunda degil. Buna karsilik KAPSAYAN DUGME
   `relative` OLMALI, yoksa rozet en yakin konumlandirilmis ataya --
   muhtemelen sayfanin tamamina -- gore yerlesir. Uc cagiran sayfanin
   `dugmeSinifi` dizisinde bu yuzden `relative` var.

   `-end-2`, `-right-2` DEGIL: mantiksal ozellik, Arapca'da (rtl) rozeti
   kendiliginden sol ust koseye aliyor.

   `whitespace-nowrap`: rozet metni hicbir ekranda iki satira inmesin. */
export default function HazirlaniyorRozeti() {
  const { t } = useLanguage();
  return (
    <span className="absolute -top-1.5 -end-1.5 whitespace-nowrap rounded-full bg-secim px-1.5 py-[1.5px] text-[9px] font-medium leading-3 text-secim-metin">
      {t.cardPreparing}
    </span>
  );
}
