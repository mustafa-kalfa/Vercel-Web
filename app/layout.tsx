import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeProvider } from "./ThemeContext";
import ThemeToggle from "./ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  // WhatsApp/X gibi paylasim onizlemeleri og:image'i MUTLAK URL bekliyor;
  // bu olmadan Next.js goreli bir yol uretiyor ve harici botlar goruntuyu
  // hic cekemiyor, onizleme bos/beyaz kaliyordu. Goruntunun kendisi
  // app/opengraph-image.tsx'te.
  metadataBase: new URL("https://mustafakalfa.com"),
  title: "Hadis ve Dijital",
  description: "Klasik ile günümüzü birleştirmek mümkün mü? Hadis ve Dijital.",
  // Sekme ikonu seffaf zeminli: acik modda siyah, koyu modda beyaz HD.
  // (app/icon.png dosya kuralindan cikarildi, yoksa kendi linkini de
  // ekleyip koyu mod varyantiyla yarisirdi.)
  icons: {
    icon: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} ${notoNaskhArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Tema ve dil ilk boyamadan once <html>'e yazilmali; React'i
            beklersek koyu mod kullanicisi bir an acik temayi, Arapca
            secmis olan da bir an Turkceyi goruyor. Tema tercihi yoksa
            isletim sistemine bakiliyor. Asagidaki context'ler durumu
            bu iki nitelikten okuyor. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var e=document.documentElement;var t=localStorage.getItem("theme");if(t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches)e.classList.add("dark");var l=localStorage.getItem("language");if(l==="tr"||l==="ar"||l==="en"){e.lang=l;e.dir=l==="ar"?"rtl":"ltr"}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <ThemeProvider>
            <ThemeToggle />
            <LanguageSwitcher />
            {children}
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
