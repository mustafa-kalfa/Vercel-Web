"use client";

/* HARITANIN TAKRIB DENEMESI. Cizim kodu ana haritayla AYNI
   (`silsileAgiKur.jsx`), yalnizca veri farkli: `silsileVeriTakrib.js`
   mevcut 821 dugumun ustune Takrib'den cikarilmis 793 ravi ekliyor.

   Bilesen catallanMIYOR, yalnizca veri catallaniyor. Bir sure ayri bir
   SilsileAgiSinama bileseni de vardi ve iki dosya birbirinden ayrildi;
   2026-09-05'te silindi. `kur(V)` zaten veri modulunu disaridan aldigi
   icin bu dosyanin tamami uc satir.

   Begenilirse bu dugumler ana veriye tasinir ve iki dosya
   (bu + silsileVeriTakrib.js) silinir. */
import * as V from "./silsileVeriTakrib";
import { kur } from "./silsileAgiKur";

export default kur(V);
