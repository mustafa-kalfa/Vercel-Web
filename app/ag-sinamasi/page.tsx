import SilsileAgi from "../SilsileAgi";

/* CIPLAK SAYFA: yalnizca silsile agi. Site basligi (HD logosu),
   tema/dil dugmeleri ve footer BU ROTADA YOK -- Mustafa'nin karari,
   2026-08-29. Agin kendi ust basligi da kaldirildi (bkz.
   SilsileAgi.jsx basindaki not, madde 3).

   Neden: gorsellestirme ekranin tamamini istiyor. Dar ekranda site
   basligi + agin basligi + footer birlikte yuksekligin yarisina
   yakinini yiyordu, geriye agi gostermeye yer kalmiyordu.

   Kaldirma isi tek tek bilesenlerde yapiliyor, burada degil: Footer,
   ThemeToggle ve LanguageSwitcher kok layout'ta bir kez cagriliyor
   (app/layout.tsx), sayfalara tek tek eklenmiyorlar. Her biri hangi
   yolda gorunecegine kendi iceriginde bir liste ile karar veriyor;
   uc dosyada da bu rotanin yolu o listeye eklendi.

   YAN ETKI, bilerek: bu sayfada siteye donen HICBIR baglanti yok --
   ne logo ne footer. Ziyaretci ancak tarayicinin geri dugmesiyle
   cikiyor. Ag icin tam ekran bundan onemli goruldu.

   Bu dosya "use client" DEGIL: artik hicbir kanca ya da olay
   kullanmiyor, yalnizca istemci bilesenini yerlestiriyor. Sunucu
   bileseni oldugu icin metadata'yi da dogrudan verebilirdi ama
   layout.tsx zaten veriyor, oldugu yerde birakildi. */
export default function AgSinamasi() {
  /* `fixed inset-0`: ag gorunum alaninin tamamini kapliyor. `absolute`
     DEGIL cunku artik sarmalayacak bir <main> yok; `h-full` de yetmez,
     kok layout govdeye `min-h-dvh` veriyor (`height` degil) ve yuzde
     yukseklik kesin olmayan bir kapsayicida cozulmuyor -- bilesen o
     zaman kendi icerigi kadar, neredeyse sifir yer kapliyor. */
  return (
    <div className="fixed inset-0">
      <SilsileAgi />
    </div>
  );
}
