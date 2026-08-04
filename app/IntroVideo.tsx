"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: 1. ziyaret ilkini, 2. ziyaret
// ikincisini, 3. ziyaret ucuncusunu gosterir; 4. ziyarette bastan baslar.
// (Onceden 3 ve sonrasi hep ucuncu videoda takili kaliyordu.)
const VIDEOS = [
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
    className: "fixed bottom-0 left-0 z-10 h-[270px] w-[242px] object-contain",
  },
  {
    src: "/Mustafa%20ve%20Kediler_seffaf.webm",
    className: "fixed bottom-0 left-0 z-10 h-auto w-full",
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
