import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// WhatsApp, X, vb. paylasim onizlemeleri koyu temayi bilmiyor (statik bir
// goruntu istiyor) -- sitenin varsayilan koyu temasiyla ayni renkler
// (globals.css .dark: #000 zemin, #e5dfd0 krem yazi) sabit kullanildi.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  // icon-dark.png: koyu zeminde gorunecek sekilde krem renkte, seffaf
  // fonlu HD monogrami (bkz. layout.tsx metadata.icons -- ayni dosya
  // koyu-tema favicon'u icin de kullaniliyor). ImageResponse'un istek
  // baglaminda /public'e HTTP ile erisimi yok, dogrudan dosyadan okuyup
  // data URI'ye ceviriyoruz.
  const logo = readFileSync(join(process.cwd(), "public/icon-dark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "#000000",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={132} height={132} alt="" />
        <div
          style={{
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "#e5dfd0",
          }}
        >
          Hadis ve Dijital
        </div>
      </div>
    ),
    { ...size },
  );
}
