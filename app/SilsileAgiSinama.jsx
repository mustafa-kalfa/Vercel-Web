"use client";

/* DENEME SURUMU -- yalnizca /ag-sinamasi kullaniyor.

   Ayri bir dosya olmasinin TEK sebebi VERI: bu sayfa
   silsileVeriSinama.js'i okuyor, yayindaki harita silsileVeri.js'i.
   Cizim kodu tek ve ortak (silsileAgiKur.jsx).

   Bir sure iki sayi burada eziliyordu, ikisi de 2026-09-05'te birakildi:

   - `yay: 640` (yayindakinin on kati). Goruntuye HIC etkisi yoktu:
     acilis cercevesi YAY'dan bagimsiz ve ekranda gorulen mesafe
     `k * YAY` ile orantili, acilis k'si de YAY ile ters orantili --
     carpim sabit. Olculdu, YAY 16/32/64/640'ta acilis goruntusu piksel
     piksel ayni.
   - `acilis: 32` (yayindaki 10,5). Bunun etkisi GERCEKTI, harita uc
     kat yakindan aciliyordu; ama Mustafa acilisin yayindaki haritayla
     ayni olmasini istedi ("acilis ekraninda gorunen noktalari
     ravi-iliski-aglari/harita sayfasindaki ile ayni hale getir").
     Olculdu: 32 ile kadraja uc sutun ve uc nokta giriyor ve etiketler
     aciliyordu, 10,5 ile bes sutun ve sekiz nokta -- yayindakinin
     aynisi.

   Geriye kalan tek gorsel fark sayfanin gecirdigi `denemeZemin`:
   acik temada zemin koyulastirilip baglanti cizgileri beyaza
   cekiliyor. */
import * as V from "./silsileVeriSinama";
import { kur } from "./silsileAgiKur";

export default kur(V);
