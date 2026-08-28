import type { Metadata } from "next";
import { Newsreader } from "next/font/google";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Sınama",
  // Anasayfanin birebir kopyasi oldugu icin arama motorlarina KAPALI;
  // acik kalsa Google iki ayni sayfa gorup anasayfayi da zayiflatirdi.
  robots: { index: false, follow: false },
};

/* Metin serifi, YALNIZCA bu sayfa icin. Kok layout'a konmadi: orada
   tanimlansa butun sayfalar font CSS'ini yuklerdi, oysa duzen henuz
   denemede. Onaylanirsa layout.tsx'e tasinacak.

   `latin-ext` SART. Turkce'nin s/g/i harfleri ve "Mustafâ"daki inceltme
   isareti `latin` altkumesinde YOK; yalniz `latin` verilirse o harfler
   yedek fonttan gelir ve satirin ortasinda font degisir. (Kok
   layout.tsx'teki Geist su an tam bu yuzden eksik -- ayri bir is.) */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={`${newsreader.variable} contents`}>{children}</div>;
}
