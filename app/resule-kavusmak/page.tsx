"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";

// Oyun `public/resule-kavusmak-game.html` icinde kendi basina calisan bir
// sayfa (kendi HTML/CSS/JS'i, WebGL ile ChromaKeyVideo cozumunun bir
// kopyasini tasiyor). Iframe icine gomuluyor cunku prototip hala hizla
// degisiyor; tasarim oturunca gercek bir React bilesenine cevrilebilir.
// Iframe kendi yuksekligini postMessage ile bildiriyor (bkz. sablon
// dosyasindaki reportHeight), boylece sabit bir tahmine gerek kalmiyor.
function GameFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data && e.data.type === "resule-kavusmak-height") {
        setHeight(Math.ceil(e.data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/resule-kavusmak-game.html"
      title="Mustafâ'nın İsnad Yolculuğu"
      style={{ height }}
      className="w-full border-0"
    />
  );
}

export default function ResuleKavusmak() {
  const { t } = useLanguage();

  return (
    <main className="relative flex flex-1 flex-col">
      {/* Header bolgesi /selam ile ayni: sabit, ortalanmis marka logosu,
          anasayfaya donus baglantisi. */}
      <Link
        href="/"
        aria-label={t.brandAlt}
        className="fixed left-1/2 top-4 z-20 flex h-9 -translate-x-1/2 items-center transition-opacity hover:opacity-70"
      >
        <span className="brand-logo" aria-hidden="true" />
      </Link>

      <div className="pt-20">
        <GameFrame />
      </div>
    </main>
  );
}
