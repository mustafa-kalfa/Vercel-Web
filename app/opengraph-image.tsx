import { ImageResponse } from "next/og";

// WhatsApp/X paylasim onizlemesi. Mustafa'nin istedigi tasarim
// (2026-08-10): sitenin ACIK temasiyla ayni -- krem zemin (#d2ccbe),
// siyah "Hadis & Dijital" yazisi, ortadaki "&" ana kelimelerden kucuk
// (site basligindaki gorunumun aynisi). Onceki surum siyah zemin +
// HD monogramiydi, begenilmedi.
//
// NOT: WhatsApp onizlemeyi URL basina GUNLERCE onbellekliyor; tasarim
// degisince eski kartin gorunmeye devam etmesi normaldir. Taze sonucu
// gormek icin linki soru isaretli bir varyantla (ornegin
// mustafakalfa.com/?v=2) gondererek test et.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 44,
          background: "#d2ccbe",
          color: "#171717",
        }}
      >
        <div
          style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Hadis
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, display: "flex" }}>&</div>
        <div
          style={{ fontSize: 128, fontWeight: 700, letterSpacing: "-0.03em" }}
        >
          Dijital
        </div>
      </div>
    ),
    { ...size },
  );
}
