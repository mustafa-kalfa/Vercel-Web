import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// WhatsApp/X paylasim onizlemesi. Mustafa jenerik bir fontla yaklasik bir
// "Hadis & Dijital" yazisi degil, SITENIN GERCEK marka goruntusunu istedi.
// Bu metin aslinda hicbir yerde duz yazi olarak yok -- anasayfadaki
// animasyonlu logo videosunun (public/HD-Animasyon.mp4) kendi cizdigi bir
// gorsel, ozel bir fontla. O yuzden burada "Hadis & Dijital" YAZILMIYOR,
// videonun SON KARESİNDEN (koyu tema, WebGL chroma-key shader'i ile
// paketlenmis alfadan geri acilmis, sonra ChromaKeyVideo.tsx'teki
// `brightness-0` mantigiyla ayni sekilde siyaha indirilmis) bir kez
// cikarilan, siki kirpilmis bir PNG kullanılıyor: public/hadis-dijital-
// wordmark.png. Video/kaynak degismedigi surece bu dosya sabit kalir;
// logo yeniden uretilirse (bkz. AGENTS.md "Giris videolari") bu PNG de
// ayni yontemle yeniden cikarilmali.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const logo = readFileSync(
    join(process.cwd(), "public/hadis-dijital-wordmark.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  // Kaynak PNG 1820x359 (oran ~5.07:1).
  const logoWidth = 860;
  const logoHeight = Math.round(logoWidth / (1820 / 359));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#d2ccbe",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
      </div>
    ),
    { ...size },
  );
}
