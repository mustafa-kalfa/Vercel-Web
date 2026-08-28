import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Eğitim İçerikleri ve Diğer Hizmetler",
  description:
    "Verilen eğitimler, el-Mektebetü'ş-Şâmile ve Cevâmiü'l-kelim rehber videoları, yapay zekâ araçları üzerine paylaşımlar.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
