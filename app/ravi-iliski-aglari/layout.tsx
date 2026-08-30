import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  /* Duz bir dize DEGIL, `template` tasiyan bir nesne: kalip ALT rotalar
     icin gecerli. Duz dize birakilinca kok layout'un
     "%s — Hadis ve Dijital" kalibi yalnizca BU sayfaya uygulaniyor,
     altindaki /harita sayfasi ekte tek basina "Silsile Haritasi" diye
     goruluyordu (olculdu). `default` bu sayfanin kendi basligi. */
  title: {
    default: "Râvi İlişki Ağları",
    template: "%s — Hadis ve Dijital",
  },
  description: "Hadis râvilerinin hoca-talebe bağlarını haritalama çalışması.",
  /* ARAMA MOTORLARINA ACIK (2026-08-29). Sayfa bos bir yer tutucuyken
     `robots: { index: false }` tasiyordu; silsile agi gelince o satir
     kalkti ve yol app/sitemap.ts'teki YOLLAR listesine eklendi. Ikisi
     birlikte yapildi -- sitemap'te olup noindex tasiyan bir sayfa kendi
     kendiyle celisir.

     2026-08-30: bu adres artik agin KENDISI degil, TANITIMI. Harita bir
     alt adrese indi (/ravi-iliski-aglari/harita). Indeksleme acisindan
     degisiklik iyi yonde -- sayfada artik okunacak gercek metin var.

     Deneme adresi /ag-sinamasi ayni bileseni gosteriyor ve KAPALI
     kalmaya devam ediyor; ikisi indekse girseydi Google kopya sayardi. */
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
