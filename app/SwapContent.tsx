"use client";

import type { ReactNode } from "react";

/* Deger degisiminde eski icerik yukari kayip cikiyor, yenisi asagidan
   geliyor (bkz. globals.css'teki swap-in / swap-out).

   Cikan kopya akis disinda (absolute) durdugu icin kutunun olcusunu her
   zaman guncel icerik belirliyor; boylece sabit genislik vermek zorunda
   kalmadan "Mustafâ Hakkında" gibi dile gore uzayan etiketlerde de
   kullanilabiliyor. */
export default function SwapContent({
  current,
  outgoing,
  render,
  className = "",
}: {
  current: string;
  outgoing: string | null;
  render: (key: string) => ReactNode;
  className?: string;
}) {
  const swapping = outgoing !== null && outgoing !== current;

  return (
    <span className={`relative block overflow-hidden ${className}`}>
      {swapping && (
        <span
          key={outgoing}
          className="swap-out absolute inset-0 flex items-center justify-center whitespace-nowrap"
        >
          {render(outgoing)}
        </span>
      )}
      <span
        key={current}
        className={`flex items-center justify-center whitespace-nowrap ${
          swapping ? "swap-in" : ""
        }`}
      >
        {render(current)}
      </span>
    </span>
  );
}
