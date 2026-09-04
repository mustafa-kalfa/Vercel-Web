"use client";

/* DENEME SURUMU -- yalnizca /ag-sinamasi kullaniyor. Cizim kodu ve veri
   yayindaki haritayla AYNI (app/silsileAgiKur.jsx, app/silsileVeri.js);
   tek fark yerlesim yayilmasi.

   YAY 640, yani yayindakinin (64) on kati (Mustafa, 2026-09-04: "su
   genislik ve yuksekligi 10 katina cikar bakalim ne oluyor, bunu deneme
   sayfasinda yap"). Ayri bir dosya gerekti cunku YAY bilesenin DISINDA,
   `kur()` govdesinde duruyor: konumlar, sutun seritleri, tuval boyu, yil
   ekseni ve kavis buyuklugu ondan tureyip bir kez hesaplaniyor, yani
   prop'la degistirilemiyor.

   acilis (ACILIS_YAKINLIK) 32, yayindaki 10,5. ASIL FERAHLAMAYI BU
   YAPIYOR, YAY degil: YAY acilis cercevesini hic degistirmiyor (bkz.
   silsileAgiKur.jsx'teki not), bu ise haritayi uc kat yakindan
   acip noktalari birbirinden ayiriyor.

   Bedeli: bu sayfa ag govdesini bir kez daha kuruyor. Sayfalar ayri
   yuklendigi icin ikisi ayni anda bellekte durmuyor. */
import * as V from "./silsileVeri";
import { kur } from "./silsileAgiKur";

export default kur(V, { yay: 640, acilis: 32 });
