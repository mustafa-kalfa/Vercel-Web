/* TAKRIB TRANSI -- DENEME VERISI, yalnizca /ag-sinamasi kullaniyor.

   Ana harita `silsileVeri.js`ten besleniyor ve bu dosya ona HIC
   dokunmuyor: mevcut dugum ve kenarlari ice aktarip ustune ekliyor.

   TURETILEN DEGERLER FABRIKADAN. `POS`, `DERECE`, `rOf` ve
   `rEkranOf` ana modulde kendi `NODES`/`EDGES`inden hesaplaniyor;
   burada AYNI fabrikalar bu dosyanin listesiyle cagriliyor. Cagirilmasa
   yeni noktalarin yerlesimi hic hesaplanmaz ve sessizce cizilmezlerdi
   -- Yemen sutunu eklenirken bir kez bu olmustu.

   NEREDEN GELDI. Iskelet Takrib'den (`takrib-iskelet.py`), ceviri-yazi
   haritanin kendi dugumlerinden cikarilan sozlukten
   (`ceviri-sozluk.mjs`), mukerrerler `mukerrer-ayikla.mjs` ile
   ayiklandi, kenarlar Tehzibu't-Tehzib taramasindan
   (`kenar-tara.py`). Sayilar ve tuzaklar DEVIR-NOTU.md'de.

   0 dugum, 0 kenar. */
import {
  NODES as ANA_NODES, EDGES as ANA_EDGES, SAMILE as ANA_SAMILE, N, E,
  dereceKur, rOfKur, rEkranOfKur, yerlesimKur, nebiKenarlariEkle,
} from "./silsileVeri.js";

export * from "./silsileVeri.js";

const KUFE_NODES = [

];

const KUFE_EDGES = [

];

export const NODES = [...ANA_NODES, ...KUFE_NODES];
export const EDGES = [...ANA_EDGES, ...KUFE_EDGES];
nebiKenarlariEkle(NODES, EDGES);
export const DERECE = dereceKur(EDGES);
export const rOf = rOfKur(DERECE);
export const rEkranOf = rEkranOfKur(rOf);
export const { POS, SUTUNLAR, W, MEDINE } = yerlesimKur(NODES);

export const SAMILE = { ...ANA_SAMILE, ...{} };
