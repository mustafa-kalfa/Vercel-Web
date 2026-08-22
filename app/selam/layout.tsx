import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Mustafâ Hakkında",
  description: "İlahiyatçı ve yazılımcı Mustafâ Kalfa kendini anlatıyor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
