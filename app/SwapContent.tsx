"use client";

import type { ReactNode } from "react";

/* Deger degisiminde eski icerik yukari kayip cikiyor, yenisi asagidan
   geliyor (bkz. globals.css'teki swap-in / swap-out).

   Cikan kopya akis disinda (absolute) durdugu icin kutunun olcusunu her
   zaman guncel icerik belirliyor; boylece sabit genislik vermek zorunda
   kalmadan "Mustafâ Hakkında" gibi dile gore uzayan etiketlerde de
   kullanilabiliyor.

   `satirIci`: kutu metnin AKISI icinde durmali oldugunda (footer telif
   satiri gibi). Kokun ontanimli `block` degeri orada satir sonu
   yaratiyordu -- className ile `inline-block` gecmek ise ise yaramiyor,
   cunku iki sinif ayni ozgullukte ve hangisinin kazandigini Tailwind
   ciktisindaki sira belirliyor.

   `cokSatir`: uzun ve saran metinler icin. Ontanimli (false) hal
   dugme etiketlerine gore ayarli -- tek satir, ortalanmis, sarmiyor.
   Kart basligi/aciklamasi gibi bir paragrafta bu yanlis olur, cunku
   metin ortalanip tek satira sikisir. `cokSatir` verildiginde kopyalar
   duz blok olarak akiyor, hizalamayi ve satir sarmasini disaridan
   (kapsayan ogeden) miras aliyorlar. */
export default function SwapContent({
  current,
  outgoing,
  render,
  className = "",
  cokSatir = false,
  satirIci = false,
}: {
  current: string;
  outgoing: string | null;
  render: (key: string) => ReactNode;
  className?: string;
  cokSatir?: boolean;
  satirIci?: boolean;
}) {
  const swapping = outgoing !== null && outgoing !== current;
  const icerik = cokSatir
    ? "block"
    : "flex items-center justify-center whitespace-nowrap";

  const kok = satirIci ? "inline-block align-bottom" : "block";

  return (
    <span className={`relative ${kok} overflow-hidden ${className}`}>
      {swapping && (
        <span
          key={outgoing}
          className={`swap-out absolute inset-0 ${icerik}`}
        >
          {render(outgoing)}
        </span>
      )}
      <span
        key={current}
        className={`${icerik} ${swapping ? "swap-in" : ""}`}
      >
        {render(current)}
      </span>
    </span>
  );
}
