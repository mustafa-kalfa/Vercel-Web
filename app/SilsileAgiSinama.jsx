"use client";

/* DENEME SURUMU -- yalnizca /ag-sinamasi kullaniyor.

   Cizim kodu ve veri yayindakiyle AYNI (app/silsileAgiKur.jsx,
   app/silsileVeri.js); tek fark `deneme` bayragi. Bileseni kopyalamak
   yerine boyle yapiliyor cunku 1400 satirin iki yerde yasamasi her
   duzeltmeyi iki kez uygulamayi gerektirir -- SVG surumu son gunlerin
   butun iyilestirmelerini tam bu yuzden kacirmisti.

   Bayrak su an tek bir seyi aciyor: arama kutusunun yanindaki
   hamburger menu ve icindeki "Sadece Ağları Göster" dugmesi. */
import * as V from "./silsileVeri";
import { kur } from "./silsileAgiKur";

export default kur(V, { deneme: true });
