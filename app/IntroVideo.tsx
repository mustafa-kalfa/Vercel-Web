"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: 1. ziyaret ilkini, 2. ziyaret
// ikincisini, 3. ziyaret ucuncusunu gosterir; 4. ziyarette bastan baslar.
// (Onceden 3 ve sonrasi hep ucuncu videoda takili kaliyordu.)
const VIDEOS = [
  {
    src: "/Mustafa%20Thinking%20Green_seffaf.webm",
    className:
      "fixed bottom-0 right-0 z-10 h-[180px] w-[360px] object-contain",
  },
  {
    src: "/Derince%20Sunum.webm",
    className: "fixed bottom-0 left-0 z-10 h-[180px] w-[360px] object-contain",
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
