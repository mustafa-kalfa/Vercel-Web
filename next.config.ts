import type { NextConfig } from "next";

/* Su an ozel bir ayar yok.

   Burada bir sure /ravi-iliski-aglari -> /mustafa-calisiyor yonlendirmesi
   durdu (2026-08-29). Sayfa o zaman bos bir yer tutucuydu; silsile agi
   ayni gun oraya yuklenince yonlendirme kaldirildi. Yonlendirme kasitli
   olarak 307'ydi (kalici 308 tarayicida onbellege alinip kaldirildiktan
   sonra bile ziyaretciyi eski hedefe goturur), bu yuzden geri donusu
   temiz oldu.

   Yonlendirmeyle birlikte kaldirilanlar: layout'taki `robots: index:false`
   ve sitemap'e eklenen yol. Ucu birden ayni ise bakiyor -- gelecekte bir
   sayfayi yine boyle beklemeye alirsan ucunu de kur. */
const nextConfig: NextConfig = {};

export default nextConfig;
