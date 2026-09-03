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
/* /rihle -> /rihleler (2026-09-03). Sayfanin adi degisti; eski yol
   disarida (paylasilmis baglantilarda, tarayici gecmisinde) durdugu icin
   yonlendirme birakiliyor.

   `permanent: false`, yani 307. Yukaridaki notun sebebi ayni: 308
   tarayicida kaliciya yaziliyor ve yonlendirme kaldirildiktan sonra bile
   ziyaretciyi eski hedefe goturuyor. Sayfa henuz bir yer tutucu, arama
   motoru agirligi tasimiyor -- geri donusun temiz olmasi daha degerli. */
const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/rihle", destination: "/rihleler", permanent: false }];
  },
};

export default nextConfig;
