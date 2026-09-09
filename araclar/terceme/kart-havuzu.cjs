/* Bilgi karti YAZILABILIR dugumlerin havuzu.

   Kart yazmak icin iki sey gerek: dugumde henuz not olmamali ve
   tercemesi acilabiliyor olmali (baslik-coz.py o dugumu cozmus
   olmali). Ikisini kesistirip dereceye gore siralar -- en cok kenari
   olan dugumun karti en cok goruluyor, sira oradan basliyor.

   Kullanim:
     python araclar/terceme/baslik-coz.py <cozum.json> <kalan.json>
     node araclar/terceme/kart-havuzu.cjs <cozum.json> <havuz.json>

   Hicbir sey YAZMIYOR silsileVeri.js'e; yazma isi not-guncelle.cjs. */
const fs = require("fs");
const path = require("path");
const KOK = path.join(__dirname, "..", "..");

const COZUM = process.argv[2];
const CIKTI = process.argv[3];
if (!COZUM || !CIKTI) {
  console.error("kullanim: node kart-havuzu.cjs <cozum.json> <havuz.json>");
  process.exit(1);
}

const kod = fs.readFileSync(
  path.join(KOK, process.env.SILSILE_VERI || "app/silsileVeri.js"), "utf8")
  .replace(/^export /gm, "");
const { NODES, EDGES } = eval(kod + "\n;({ NODES, EDGES })");

const derece = {};
EDGES.forEach((e) => {
  derece[e.a] = (derece[e.a] || 0) + 1;
  derece[e.b] = (derece[e.b] || 0) + 1;
});

const cozum = {};
JSON.parse(fs.readFileSync(COZUM, "utf8")).forEach((c) => { cozum[c.id] = c; });

const havuz = NODES
  .filter((n) => !n.not && cozum[n.id])
  .map((n) => ({ id: n.id, tr: n.tr, ar: n.ar, tab: n.tab, belde: n.belde,
                 olum: n.olum, derece: derece[n.id] || 0,
                 satir: cozum[n.id].satir, baslik: cozum[n.id].baslik }))
  .sort((a, b) => b.derece - a.derece);

fs.writeFileSync(CIKTI, JSON.stringify(havuz, null, 1));
const kartli = NODES.filter((n) => n.not).length;
console.log("dugum:", NODES.length, " kartli:", kartli,
            " terceme cozulmus:", Object.keys(cozum).length,
            " yazilabilir havuz:", havuz.length);
