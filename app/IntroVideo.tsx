"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: her ziyaret siradakini gosterir,
// liste bitince bastan baslar (asagida mod alinarak).
/* Masaustu olculeri neden px degil vh?
   Tarayici yakinlastirmasi (Ctrl +) gorunum alanini CSS pikseli cinsinden
   kucultuyor: 180px'lik bir kutu ekranda BUYUYOR. `/selam` sayfasindaki
   karakter `h-[50vh]` oldugu icin yakinlastirmadan etkilenmiyor; buradaki
   klipler de ayni davranissin diye masaustu olculeri vh'ye cevrildi
   (1vh = 8px, 800px yuksekliginde bir gorunum alani referans alindi).

   Ayrica masaustunde genislik verilmiyor: `w-auto` + `max-w-none` ile
   genislik canvas'in kendi oranindan geliyor. Boylece kutu orani klibin
   oranindan sapamiyor ve object-contain'in yanlarda birakacagi olu bosluk
   sorunu tamamen ortadan kalkiyor (negatif kenar degerleri de artik
   dogrudan goruntunun kenarini olcuyor). Mobil olculer px olarak kaldi:
   telefonda sayfa yakinlastirmasi duzeni degistirmiyor. */
const VIDEOS: { src: string; denemeSrc?: string; className: string }[] = [
  {
    // Karakterin sagindaki seffaf bosluk yuzunden goruntu kenardan iceride
    // kaliyordu; negatif right ile o boslugu kapatiyoruz.
    src: "/Mustafa%20Thinking%20Green_seffaf.mp4",
    className:
      "fixed bottom-0 right-[-32px] z-50 h-[135px] w-[240px] object-contain md:right-[-6vh] md:h-[22.5vh] md:w-auto md:max-w-none",
  },
  {
    // Klip soldan %10, sagdan %20 kirpildigi icin 644x720 oldu; mobil kutu
    // genisligi bu orana gore (270 * 644/720) ayarli, yoksa object-contain
    // yanlarda olu bosluk birakip goruntuyu saga kaydiriyor.
    src: "/Derince%20Sunum.mp4",
    denemeSrc: "/sinama/Derince%20Sunum.mp4",
    className:
      "fixed bottom-[-20px] left-0 z-50 h-[270px] w-[242px] object-contain md:bottom-[-2.5vh] md:h-[34vh] md:w-auto md:max-w-none",
  },
  {
    // Mobil: tam genislik, sol-alt. Masaustu: SAG-alt. Karakter ve kediler
    // karenin sag yarisinda duruyor (soldaki ~%43 bos), bu yuzden kutuyu
    // sola yaslamak karakteri ekranin ortasina itiyordu.
    src: "/Mustafa%20Kediler%20Dogru_seffaf.mp4",
    denemeSrc: "/sinama/Mustafa%20Kediler%20Dogru_seffaf.mp4",
    className:
      "fixed bottom-[-10px] left-0 z-50 h-auto w-full md:bottom-[-1.25vh] md:left-auto md:right-0 md:h-[28vh] md:w-auto md:max-w-none",
  },
  {
    // Gokyuzu yesil cekilip seffaflastirildi, artik digerleri gibi kendi
    // kenari yok; kenar maskesine gerek kalmadi. Mobil: iki yana yasli
    // (w-full + h-auto ile oran kendiliginden korunur).
    src: "/Mustafa%20Yagmur_seffaf.mp4",
    className:
      "fixed bottom-0 left-0 z-50 h-auto w-full object-contain md:h-[22.5vh] md:w-auto md:max-w-none",
  },
];

/* `deneme`: `/sinama` sayfasi icin. Yeniden anahtarlanmis klipler once
   `public/sinama/` altina konup orada yayina alindi, boylece anasayfa
   eski dosyalarla dokunulmadan kaldi. Onaydan sonra yeni dosyalar
   `public/` kokune tasinacak ve bu bayrak, `denemeSrc` alanlari,
   `app/sinama/` ile `public/sinama/` birlikte silinecek. */
export default function IntroVideo({ deneme = false }: { deneme?: boolean }) {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(VISIT_KEY) ?? "0");
    const count = stored + 1;
    localStorage.setItem(VISIT_KEY, String(count));
    setVisitCount(count);
  }, []);

  if (visitCount === null) return null;

  const video = VIDEOS[(visitCount - 1) % VIDEOS.length];
  // Yalnizca yeniden anahtarlanan iki klibin deneme surumu var; digerleri
  // degismedigi icin ikinci bir kopya tutulmuyor.
  const src = (deneme && video.denemeSrc) || video.src;

  return <ChromaKeyVideo src={src} className={video.className} />;
}
