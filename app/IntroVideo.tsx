"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: her ziyaret siradakini gosterir,
// liste bitince bastan baslar (asagida mod alinarak).
const VIDEOS = [
  {
    // Karakterin sagindaki seffaf bosluk (video karesinin %7.7'si) ve
    // object-contain'in biraktigi bosluk yuzunden goruntu kenardan iceride
    // kaliyordu; negatif right ile o boslugu kapatiyoruz.
    src: "/Mustafa%20Thinking%20Green_seffaf.mp4",
    className:
      "fixed bottom-0 right-[-32px] z-50 h-[135px] w-[240px] object-contain md:right-[-68px] md:h-[180px] md:w-[360px]",
  },
  {
    // Klip soldan %10, sagdan %20 kirpildigi icin 644x720 oldu; kutu
    // genisligi bu orana gore (270 * 644/720) ayarli, yoksa object-contain
    // yanlarda olu bosluk birakip goruntuyu saga kaydiriyor. (270x242,
    // onceki 180x161'in %50 buyutulmus hali.)
    src: "/Derince%20Sunum.mp4",
    className:
      "fixed bottom-[-20px] left-0 z-50 h-[270px] w-[242px] object-contain",
  },
  {
    // Mobil: tam genislik, sol-alt. Masaustu: sabit 360x225, sag-alt,
    // sagdan -15px tasarak. `left-auto` mobildeki left-0'i masaustunde
    // iptal ediyor, yoksa left ve right ayni anda sabit genislikle
    // celisip left kazanirdi. Kutu 360x225, klip 1152x720 (1.6:1)
    // oldugu icin: oran tutmazsa object-contain yanlarda olu bosluk
    // birakip karakteri kenardan iceri kaydiriyor.
    src: "/Mustafa%20ve%20Kediler_seffaf.mp4",
    className:
      "fixed bottom-[-10px] left-0 z-50 h-auto w-full md:left-auto md:right-[-15px] md:h-[225px] md:w-[360px] md:object-contain",
  },
  {
    // Gokyuzu yesil cekilip seffaflastirildi, artik digerleri gibi kendi
    // kenari yok; kenar maskesine gerek kalmadi. `object-contain` sart:
    // mobil kutu 270x135 (2:1) klibin 16:9 oraniyla ayni degil, contain
    // Mobil: iki yana yasli (w-full + h-auto ile oran kendiliginden
    // korunur). Masaustu: 320x180, klibin 16:9 orani — sabit yukseklikle
    // birlikte oranin disina cikan bir kutu verilirse object-contain
    // yanlarda olu bosluk birakiyor.
    src: "/Mustafa%20Yagmur_seffaf.mp4",
    className:
      "fixed bottom-0 left-0 z-50 h-auto w-full object-contain md:h-[180px] md:w-[320px]",
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

  return <ChromaKeyVideo src={video.src} className={video.className} />;
}
