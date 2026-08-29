import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* /ravi-iliski-aglari GECICI OLARAK /mustafa-calisiyor'a yonlendiriliyor
     (Mustafa'nin talebi, 2026-08-29). Sayfa duruyor ve yerinde kalacak --
     asil icerik (ravilerin hoca-talebe baglarini gosteren gorsellestirme)
     hazir olunca oraya yuklenecek.

     `permanent: false` (307) BILEREK: kalici bir yonlendirme (308)
     tarayicilar tarafindan agresif onbellege alinir ve yonlendirme
     kaldirildiktan sonra bile ziyaretciyi eski hedefe goturmeye devam
     eder. Bu durum gecici oldugu icin 307 dogru olan.

     Kartlar ve footer HALA /ravi-iliski-aglari'na baglaniyor, bilerek:
     icerik hazir oldugunda yalnizca asagidaki blogu silmek yeterli,
     baglantilara hic dokunmak gerekmiyor. O zaman ayrica
     app/ravi-iliski-aglari/layout.tsx'teki `robots: index:false`
     kaldirilip yol app/sitemap.ts'e eklenmeli. */
  async redirects() {
    return [
      {
        source: "/ravi-iliski-aglari",
        destination: "/mustafa-calisiyor",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
