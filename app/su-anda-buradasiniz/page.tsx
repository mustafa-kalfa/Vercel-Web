import SuAndaBuradasiniz from "../SuAndaBuradasiniz";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şu Anda Buradasınız",
  // Ayni bilesen not-found.tsx tarafindan da kullaniliyor; bu adresin
  // arama sonuclarinda cikmasinin anlami yok.
  robots: { index: false, follow: true },
};

export default function Page() {
  return <SuAndaBuradasiniz />;
}
