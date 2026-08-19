"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";

// Oyun `public/resule-kavusmak-game.html` icinde kendi basina calisan bir
// sayfa (kendi HTML/CSS/JS'i, WebGL ile ChromaKeyVideo cozumunun bir
// kopyasini tasiyor). Iframe icine gomuluyor cunku prototip hala hizla
// degisiyor; tasarim oturunca gercek bir React bilesenine cevrilebilir.
// Iframe kendi yuksekligini postMessage ile bildiriyor (bkz. sablon
// dosyasindaki reportHeight), boylece sabit bir tahmine gerek kalmiyor.
//
// `hadis`: oynatilacak hadisin id'si (game.html icindeki HADITHS
// listesinden). Verilmezse oyun kendi varsayilanini -- niyet hadisini --
// acar, yani /resule-kavusmak sayfasinin davranisi degismez. Birden
// fazla hadis arasinda gecis yapan sayfalar (bkz.
// /resule-kavusmak-sinama) bu bilesene `key={hadis}` vermeli: iframe'in
// bastan yuklenmesi gerekiyor, `src` degisimi tek basina oyunun ic
// durumunu (bulunmus raviler, Mustafa'nin konumu) sifirlamaz.
export default function ResuleKavusmakGame({ hadis }: { hadis?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(1200);
  const { theme } = useTheme();
  const { language } = useLanguage();

  const src = hadis
    ? `/resule-kavusmak-game.html?h=${encodeURIComponent(hadis)}`
    : "/resule-kavusmak-game.html";

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data && e.data.type === "resule-kavusmak-height") {
        setHeight(Math.ceil(e.data.height));
      }
      // Isnad dogru tamamlaninca oyun hadis kutusunun KENDI belgesindeki
      // Y konumunu yolluyor. Iframe'in kendi kaydirma cubugu olmadigi
      // icin kaydirmasi gereken taraf biziz: iframe'in sayfadaki yerine
      // o konumu ekleyip oraya gidiyoruz. Kullanici oyunu bitirdiginde
      // en altta (ravi butonlarinda) duruyor, hadis metni ise en ustte.
      if (e.data && e.data.type === "resule-kavusmak-scroll-to") {
        const frame = iframeRef.current;
        if (!frame) return;
        const hedef =
          window.scrollY +
          frame.getBoundingClientRect().top +
          Number(e.data.top) -
          24; // kutunun ustunde biraz nefes payi
        window.scrollTo({ top: Math.max(0, hedef), behavior: "smooth" });
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
      "*",
    );
  }, [theme, language]);

  function sendAppearance() {
    const frame = iframeRef.current;
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage(
      { type: "resule-kavusmak-appearance", theme, language },
      "*",
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
      const frame = iframeRef.current;
      if (!frame || !frame.contentWindow) return;
      const rect = frame.getBoundingClientRect();
      frame.contentWindow.postMessage(
        {
          type: "resule-kavusmak-viewport",
          frameTop: rect.top,
          viewportHeight: window.innerHeight,
        },
        "*",
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
      src={src}
      title="Mustafâ'nın İsnad Yolculuğu"
      style={{ height }}
      className="w-full border-0"
      onLoad={sendAppearance}
    />
  );
}
