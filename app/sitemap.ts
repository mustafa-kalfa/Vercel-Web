import type { MetadataRoute } from "next";

const SITE = "https://mustafakalfa.com";

/* Arama motorlarina verilen adres listesi. Yayinda /sitemap.xml olarak
   cikiyor, build sirasinda uretiliyor -- calisan bir program yok.

   YENI SAYFA EKLEYINCE BURAYA DA EKLE. Liste elle tutuluyor; app/ altini
   otomatik taramak mumkun ama o zaman deneme kopyalari da listeye girer
   ve hangisinin bilerek disarida oldugu belirsizlesir.

   Listede OLMAYANLAR ve sebepleri:
   - /sinama, /resule-kavusmak-sinama, /su-anda-buradasiniz
     Bunlar `robots: { index: false }` tasiyor (bkz. AGENTS.md, "Sayfa
     basliklari"). Indekslenmesini istemedigimiz sayfayi sitemap'e koymak
     kendi kendiyle celisir.

   `lastModified` BILEREK yazilmiyor: her deploy'da "bugun" yazmak butun
   sayfalar her gun degisiyormus izlenimi verir, Google da boyle bir
   sitemap'in tarihlerine guvenmeyi birakir. Alan zaten istege bagli. */
const YOLLAR = [
  "/",
  "/selam",
  "/podcastler",
  "/hadis-tarihi",
  "/rihle",
  "/resule-kavusmak",
  "/mustafa-calisiyor",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return YOLLAR.map((yol) => ({ url: `${SITE}${yol}` }));
}
