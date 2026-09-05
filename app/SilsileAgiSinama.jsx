"use client";

/* DENEME SURUMU -- yalnizca /ag-sinamasi kullaniyor. Cizim kodu ve veri
   yayindaki haritayla AYNI (app/silsileAgiKur.jsx, app/silsileVeri.js);
   tek fark yerlesim yayilmasi.

   Bir sure YAY 640 deneniyordu (yayindakinin on kati); 2026-09-05'te
   BIRAKILDI ve yayindaki degerin aynisi kullaniliyor. Sebep: YAY
   goruntuyu hic degistirmiyor -- acilis cercevesi ondan bagimsiz ve
   ekranda gorulen mesafe `k * YAY` ile orantili, acilis k'si de YAY
   ile ters orantili; carpim sabit. Olculdu, YAY 16/32/64/640'ta acilis
   goruntusu piksel piksel ayni. Ayri bir dosya yine de gerekiyor,
   cunku ACILIS_YAKINLIK de bilesenin DISINDA, `kur()` govdesinde.

   acilis (ACILIS_YAKINLIK) 32, yayindaki 10,5. FERAHLAMAYI YAPAN
   TEK SEY BU: haritayi uc kat yakindan acip noktalari birbirinden
   ayiriyor.

   Bedeli: bu sayfa ag govdesini bir kez daha kuruyor. Sayfalar ayri
   yuklendigi icin ikisi ayni anda bellekte durmuyor. */
import * as V from "./silsileVeriSinama";
import { kur } from "./silsileAgiKur";

export default kur(V, { acilis: 32 });
