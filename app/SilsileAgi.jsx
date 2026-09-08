"use client";

/* HARITA. Cizim kodu app/silsileAgiKur.jsx, veri app/silsileVeri.js.

   /ravi-iliski-aglari/harita ile /ag-sinamasi AYNI bileseni ve AYNI
   veriyi kullaniyor; tek fark sinama sayfasinin gecirdigi `denemeIpucu`
   prop'u (2026-09-07). Ondan onceki uc deneme prop'u -- `denemeZemin`,
   `denemeKenarKirp`, `denemeSuzgec` -- yayina alinip kaldirildi. Bir
   sure ayri bir SilsileAgiSinama bileseni ve ayri bir veri kopyasi da
   vardi; 2026-09-05'te Siyer eki yayina alininca ikisi de silindi. */
import * as V from "./silsileVeri";
import { kur } from "./silsileAgiKur";

export default kur(V);
