/* SITE CERCEVESI OLMAYAN YOLLAR.

   Kok layout (app/layout.tsx) uc parcayi her sayfaya bir kez ekliyor:
   tema dugmesi (sol ust), dil dugmesi (sag ust) ve footer. Bu listedeki
   yollarda ucu de gizleniyor, yani sayfa cercevesiz -- "ciplak" --
   kaliyor.

   Uc dosya da ayni listeye baktigi icin yeni bir ciplak sayfa acarken
   tek yer degistiriliyor. Onceden liste yalnizca Footer'in icindeydi;
   tema/dil dugmeleri de ayni karari almaya baslayinca buraya alindi.

   Bir sayfanin footer'i olup dugmeleri olmamasi (ya da tersi) bugun
   gerekmiyor. Gerekirse bu liste bolunur; simdilik ucu birlikte
   gidiyor ve tek liste hangi sayfanin cercevesiz oldugunu tek bakista
   gosteriyor.

   /ag-sinamasi: bastan asaga bir gorsellestirme ve ekranin tamamini
   istiyor. Dar ekranda site basligi + agin kendi basligi + footer
   birlikte yuksekligin yarisina yakinini yiyordu. Agin kendi ust
   basligi da ayni sebeple kaldirildi (bkz. SilsileAgi.jsx basindaki
   not, madde 3). */
export const CIPLAK_YOLLAR = ["/ag-sinamasi"];
