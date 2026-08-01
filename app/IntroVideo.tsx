"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

export default function IntroVideo() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(VISIT_KEY) ?? "0");
    const count = stored + 1;
    localStorage.setItem(VISIT_KEY, String(count));
    setVisitCount(count);
  }, []);

  if (visitCount === null) return null;

  if (visitCount >= 3) {
    return (
      <ChromaKeyVideo
        src="/Mustafa%20and%20Cats.mp4"
        keyColor="green"
        loopSlideOffsetPercent={5}
        className="fixed bottom-0 left-0 z-10 h-auto w-full"
      />
    );
  }

  if (visitCount === 2) {
    return (
      <ChromaKeyVideo
        src="/Derince%20Sunum.mp4"
        keyColor="red"
        className="fixed bottom-0 left-0 z-10 h-[180px] w-[360px] object-contain"
      />
    );
  }

  return (
    <ChromaKeyVideo
      src="/Mustafa%20Thinking%20Green.mp4"
      keyColor="green"
      className="fixed bottom-0 right-0 z-10 h-[180px] w-[360px] object-contain"
    />
  );
}
