import type { Metadata } from "next";

// Bu rotanin sayfasi "use client" oldugu icin metadata export edemiyor;
// Next.js metadata'yi yalnizca sunucu bileseninden okur. Ince bir layout
// bu isi cozuyor -- sayfaya hic dokunmadan basligi veriyor.
export const metadata: Metadata = {
  title: "Râvi İlişki Ağları",
  description: "Hadis râvilerinin hoca-talebe bağlarını haritalama çalışması.",
  /* SIMDILIK ARAMA MOTORLARINA KAPALI. Sayfa bos bir yer tutucu; asil
     icerik (gorsellestirme) sonra gelecek. Bos bir sayfanin indekse
     girmesi hem ziyaretciyi bos bir sonuca goturur hem sitenin genel
     degerlendirmesine zarar eder.

     ICERIK GELINCE: (1) bu satiri sil, (2) yolu app/sitemap.ts'teki
     YOLLAR listesine ekle. Ikisi birlikte yapilmali -- sitemap'te olup
     noindex tasiyan bir sayfa kendi kendiyle celisir. */
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
