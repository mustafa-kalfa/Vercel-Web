import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Râvi İlişki Ağları",
  description: "Hadis râvilerinin hoca-talebe bağlarını haritalama çalışması.",
  /* ARAMA MOTORLARINA ACIK (2026-08-29). Sayfa bos bir yer tutucuyken
     `robots: { index: false }` tasiyordu; silsile agi gelince o satir
     kalkti ve yol app/sitemap.ts'teki YOLLAR listesine eklendi. Ikisi
     birlikte yapildi -- sitemap'te olup noindex tasiyan bir sayfa kendi
     kendiyle celisir.

     Deneme adresi /ag-sinamasi ayni bileseni gosteriyor ve KAPALI
     kalmaya devam ediyor; ikisi indekse girseydi Google kopya sayardi. */
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
