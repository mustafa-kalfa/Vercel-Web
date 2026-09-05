/* app/silsileVeri.js'ten dugum tablosunu cikarir (araclar/dugumler.json).
   esle.cjs ve isle.cjs bu dosyayi okur.

   Modul ES import kullandigi icin dogrudan require edilemiyor; export
   sozcukleri sokulup metin olarak degerlendiriliyor. Kaba ama veri
   dosyasinda React ve baglilik olmadigi icin calisiyor. */
const fs = require('fs');
const path = require('path');
const KOK = path.join(__dirname, '..');

/* Veri dosyasi ortam degiskeniyle degistirilebiliyor: /ag-sinamasi
   catallanmis bir kopya kullaniyor ve
   arastirma o kopya uzerinde yapiliyor. Bos birakilirsa yayindaki
   dosya. Ornek: SILSILE_VERI=app/silsileVeriDeneme.js node ... */
const VERI = process.env.SILSILE_VERI || 'app/silsileVeri.js';
const kod = fs.readFileSync(path.join(KOK, VERI), 'utf8')
  .replace(/^export /gm, '');
const { NODES, EDGES } = eval(kod + '\n;({ NODES, EDGES })');

fs.writeFileSync(path.join(__dirname, 'dugumler.json'),
  JSON.stringify(NODES.map((n) => ({ id: n.id, ar: n.ar, tr: n.tr,
                                     olum: n.olum, tab: n.tab }))));

/* Is listesi: kendi tercemesi hic acilmamis raviler. 6. tabaka disarida
   -- muelliflerin ogrencileri bilerek son sinir, talebeleri olmayacak. */
const hoca = {}, tal = {};
EDGES.forEach((e) => {
  (tal[e.a] = tal[e.a] || new Set()).add(e.b);
  (hoca[e.b] = hoca[e.b] || new Set()).add(e.a);
});
const eksik = NODES
  .filter((n) => n.tab !== 6 && !(tal[n.id] || new Set()).size && (hoca[n.id] || new Set()).size)
  .map((n) => ({ id: n.id, ar: n.ar, tr: n.tr, tab: n.tab, olum: n.olum,
                 hoca: (hoca[n.id] || new Set()).size }))
  .sort((a, b) => a.tab - b.tab || b.hoca - a.hoca);
fs.writeFileSync(path.join(__dirname, 'is-listesi.json'), JSON.stringify(eksik, null, 1));

console.log('dugum:', NODES.length, ' kenar:', EDGES.length, ' kalan bosluk:', eksik.length);
const g = {};
eksik.forEach((x) => { g[x.tab] = (g[x.tab] || 0) + 1; });
console.log('tabakalara gore:', JSON.stringify(g));
