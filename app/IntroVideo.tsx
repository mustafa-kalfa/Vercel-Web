"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: her ziyaret siradakini gosterir,
// liste bitince bastan baslar (asagida mod alinarak).
const VIDEOS: {
  src: string;
  className: string;
  wrapperClassName?: string;
}[] = [
  {
    // Karakterin sagindaki seffaf bosluk (video karesinin %7.7'si) ve
    // object-contain'in biraktigi bosluk yuzunden goruntu kenardan iceride
    // kaliyordu; negatif right ile o boslugu kapatiyoruz.
    src: "/Mustafa%20Thinking%20Green_seffaf.webm",
    className:
      "fixed bottom-0 right-[-32px] z-10 h-[135px] w-[240px] object-contain md:right-[-68px] md:h-[180px] md:w-[360px]",
  },
  {
    // Klip soldan %10, sagdan %20 kirpildigi icin 644x720 oldu; kutu
    // genisligi bu orana gore (270 * 644/720) ayarli, yoksa object-contain
    // yanlarda olu bosluk birakip goruntuyu saga kaydiriyor. (270x242,
    // onceki 180x161'in %50 buyutulmus hali.)
    src: "/Derince%20Sunum.webm",
    className: "fixed bottom-[-20px] left-0 z-10 h-[270px] w-[242px] object-contain",
  },
  {
    // Mobil: tam genislik, sol-alt (degismedi). Masaustu: sabit 400x225,
    // sag-alt, sagdan -15px tasarak. `left-auto` mobildeki left-0'i
    // masaustunde iptal ediyor, yoksa left ve right ayni anda sabit
    // genislikle celisip left kazanirdi.
    src: "/Mustafa%20ve%20Kediler_seffaf.webm",
    className:
      "fixed bottom-[-20px] left-0 z-10 h-auto w-full md:left-auto md:right-[-15px] md:h-[225px] md:w-[400px] md:object-contain",
  },
  {
    // Bu klip seffaf degil, kendi arka plani var; ust ve sag kenari
    // dalgali maskeyle sayfa zeminine karisiyor (bkz. globals.css).
    // Iki dalga kesismek zorunda oldugu icin biri sarmalayicida, digeri
    // videoda. `object-contain` sart: mobil kutu 270x135 (2:1) klibin
    // 16:9 oraniyla ayni degil, contain olmadan goruntu ezilirdi.
    src: "/Mustafa%20Rain.mp4",
    wrapperClassName:
      "wave-top fixed bottom-0 left-0 z-10 h-[135px] w-[270px] md:h-[180px] md:w-[320px]",
    className: "wave-right h-full w-full max-w-none object-contain",
  },
];

export default function IntroVideo() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(VISIT_KEY) ?? "0");
    const count = stored + 1;
    localStorage.setItem(VISIT_KEY, String(count));
    setVisitCount(count);
  }, []);

  if (visitCount === null) return null;

  const video = VIDEOS[(visitCount - 1) % VIDEOS.length];

  return (
    <ChromaKeyVideo
      src={video.src}
      className={video.className}
      wrapperClassName={video.wrapperClassName}
    />
  );
}
