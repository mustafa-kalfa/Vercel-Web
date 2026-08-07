import type { Metadata } from "next";

// Gecici deneme sayfasi: arama motorlarina girmesin, anasayfanin kopyasi
// oldugu icin ayni icerikle iki adres indekslenmis olurdu.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function SinamaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
