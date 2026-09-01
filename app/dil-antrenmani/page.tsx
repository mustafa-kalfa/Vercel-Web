import type { Metadata } from "next";
import { Amiri, EB_Garamond } from "next/font/google";
import DilAntrenmaniHub from "../DilAntrenmaniHub";

export const metadata: Metadata = {
  title: "Dil Antrenmanı",
  description:
    "Aynı kelimenin Türkçe, İngilizce ve Arapça karşılığını eşleştirme oyunu.",
};

/* Kartların yazı aileleri. Sitenin gövde yazısı Geist, ama kart yüzü
   bir oyun kâğıdı gibi görünsün diye Garamond'a, Arapça kartlar da
   Amiri'ye çekiliyor.

   `next/font` ile alınıyorlar, `<link>` ile DEĞİL: dosyalar build
   sırasında kendi alanımıza kopyalanıyor, çalışma anında Google'a hiç
   istek gitmiyor ve yazı geç geldiği için oluşan sıçrama olmuyor.
   Değişken adları CSS modülünde `var(--font-garamond)` diye geçiyor.

   Font yükleyicileri yalnızca SUNUCU dosyasında modül düzeyinde
   çağrılabiliyor, bu yüzden burada -- sayfanın gövdesi ("use client")
   değişkenleri sarmalayıcı div üzerinden miras alıyor. */
const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

export default function DilAntrenmaniSayfasi() {
  return (
    <div className={`${garamond.variable} ${amiri.variable} flex flex-1 flex-col`}>
      <DilAntrenmaniHub />
    </div>
  );
}
