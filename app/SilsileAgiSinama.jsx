"use client";

/* DENEME HARITASI (/ag-sinamasi). Cizim kodu yayindakiyle AYNI
   (app/silsileAgiKur.jsx); yalnizca veri ayri (silsileVeriSinama.js).
   Veri calismasi bitince o dosya silsileVeri.js'in uzerine kopyalanir
   ve bu sayfa yeniden yayindakiyle ayni veriyi gosterir. */
import * as V from "./silsileVeriSinama";
import { kur } from "./silsileAgiKur";

export default kur(V);
