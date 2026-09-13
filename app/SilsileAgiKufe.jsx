"use client";

/* HARITANIN KUFE DENEMESI. Cizim kodu ana haritayla AYNI
   (`silsileAgiKur.jsx`), yalnizca veri farkli: `silsileVeriKufe.js`
   mevcut 821 dugumun ustune Takrib'den cikarilmis 134 Kufeli ekliyor.

   Bilesen catallanMIYOR, yalnizca veri catallaniyor. Bir sure ayri bir
   SilsileAgiSinama bileseni de vardi ve iki dosya birbirinden ayrildi;
   2026-09-05'te silindi. `kur(V)` zaten veri modulunu disaridan aldigi
   icin bu dosyanin tamami uc satir.

   Begenilirse Kufe dugumleri ana veriye tasinir ve bu iki dosya
   (bu + silsileVeriKufe.js) silinir. */
import * as V from "./silsileVeriKufe";
import { kur } from "./silsileAgiKur";

export default kur(V);
