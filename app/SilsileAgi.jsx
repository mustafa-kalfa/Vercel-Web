"use client";

/* YAYINDAKI HARITA. Cizim kodu app/silsileAgiKur.jsx, veri
   app/silsileVeri.js. Deneme surumu SilsileAgiSinama.jsx -- ayni
   `kur`u `{ deneme: true }` ile cagiriyor, kopya kod yok. */
import * as V from "./silsileVeri";
import { kur } from "./silsileAgiKur";

export default kur(V);
