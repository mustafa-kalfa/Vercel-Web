import type { MetadataRoute } from "next";

/* Yayinda /robots.txt olarak cikiyor, build sirasinda uretiliyor.

   HICBIR SEY ENGELLENMIYOR, bu KASITLI. /sinama gibi kopya sayfalar
   `robots: { index: false }` meta etiketiyle indeks disi tutuluyor; ama
   Google bir sayfayi TARAYAMAZSA uzerindeki o etiketi de OKUYAMAZ ve
   adresi baska bir yerde gorurse yine listeye alabilir. Yani burada
   `disallow` yazmak, indeks disi birakma isini bozardi.

   Buranin asil isi sitemap'in yerini gostermek. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://mustafakalfa.com/sitemap.xml",
  };
}
