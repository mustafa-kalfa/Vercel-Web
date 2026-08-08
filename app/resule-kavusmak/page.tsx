"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { useTheme } from "../ThemeContext";

// Oyun `public/resule-kavusmak-game.html` icinde kendi basina calisan bir
// sayfa (kendi HTML/CSS/JS'i, WebGL ile ChromaKeyVideo cozumunun bir
// kopyasini tasiyor). Iframe icine gomuluyor cunku prototip hala hizla
// degisiyor; tasarim oturunca gercek bir React bilesenine cevrilebilir.
// Iframe kendi yuksekligini postMessage ile bildiriyor (bkz. sablon
// dosyasindaki reportHeight), boylece sabit bir tahmine gerek kalmiyor.
function GameFrame() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);
  const { theme } = useTheme();
  const { language } = useLanguage();

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data && e.data.type === "resule-kavusmak-height") {
        setHeight(Math.ceil(e.data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Oyunun kendi tema/dil dugmesi yok (gercek site basligindaki
  // dugmeler yeterli) -- onlara her basildiginda buradaki `theme`/
  // `language` degisir, biz de degisimi iframe'e bildiririz ki oyun
  // ayni anda karanlik/aydinlik gecis yapsin VE arayuz metinlerini
  // (rävi isimleri/hadis/isnad haric) o dile cevirsin. `onLoad` ile de
  // ilk yuklemede (ve her navigasyonda) gonderiyoruz, cunku iframe'in
  // script'i mesaj dinleyicisini kurana kadar bu effect'in ilk
  // calismasi kacabilir.
  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { type: "resule-kavusmak-appearance", theme, language },
      "*"
    );
  }, [theme, language]);

  function sendAppearance() {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { type: "resule-kavusmak-appearance", theme, language },
      "*"
    );
  }

  // Iframe yuksekligi ICERIGE esitlendigi icin kendi kaydirma cubugu
  // yok -- oyunun ic toast'i (bildirim balonu) tarayici penceresinin
  // neresini gosterdigini bilemiyor. Burasi kendi kaydirma konumunu ve
  // pencere yuksekligini oyuna bildirir ki toast, sayfanin en altina
  // degil, kullanicinin O AN gordugu ekranin altina sabitlensin.
  useEffect(() => {
    let ticking = false;
    function post() {
      ticking = false;
      var frame = iframeRef.current;
      if (!frame || !frame.contentWindow) return;
      var rect = frame.getBoundingClientRect();
      frame.contentWindow.postMessage(
        {
          type: "resule-kavusmak-viewport",
          frameTop: rect.top,
          viewportHeight: window.innerHeight,
        },
        "*"
      );
    }
    function onScrollOrResize() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(post);
    }
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    post();
    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [height]);

  return (
    <iframe
      ref={iframeRef}
      src="/resule-kavusmak-game.html"
      title="Mustafâ'nın İsnad Yolculuğu"
      style={{ height }}
      className="w-full border-0"
      onLoad={sendAppearance}
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
