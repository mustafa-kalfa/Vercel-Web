/* Kufe transini `app/silsileVeriKufe.js` olarak yazar: mevcut veriyi
   ice aktarip ustune yeni dugum ve kenarlari ekliyor, turetilen
   degerleri de fabrikalarla KENDI listesinden hesapliyor. */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/* Kullanim (my-app icinden):
     node araclar/catal-yaz.mjs <yeni-dugumler.json> <kenarlar.json> <cikti.js> */
const [, , dugumYol, kenarYol, ciktiYol] = process.argv;
if (!dugumYol || !kenarYol || !ciktiYol) {
  console.error("kullanim: catal-yaz.mjs <yeni-dugumler.json> <kenarlar.json> <cikti.js>");
  process.exit(1);
}
const V = await import(pathToFileURL("app/silsileVeri.js").href);
const yeni = JSON.parse(readFileSync(dugumYol, "utf8"));
const kenar = JSON.parse(readFileSync(kenarYol, "utf8"));

const yeniId = new Set(yeni.map((k) => k.id));
const varOlan = new Set();
for (const e of V.EDGES) { varOlan.add(e.a + "|" + e.b); varOlan.add(e.b + "|" + e.a); }

/* Yalnizca EN AZ BIR UCU YENI olan kenarlar buraya giriyor. Iki ucu da
   mevcut olanlar zaten ana haritaya yazildi (2026-09-13, 289 kenar);
   burada tekrarlanmalari catali gereksiz yere ana veriden ayirirdi. */
const kufeKenar = kenar.filter((e) =>
  (yeniId.has(e.a) || yeniId.has(e.b)) && !varOlan.has(e.a + "|" + e.b));

const q = (s) => JSON.stringify(s);
const dugumSatir = yeni.map((k) =>
  `  N(${q(k.id)}, ${q(k.ar)}, ${q(k.tr)}, ${k.tab}, ${k.olum}, ${q(k.belde)}),`
).join("\n");

/* Kenarlar oznesine gore gruplaniyor -- dosyada her blok "su
   tercemenin listesinden" diye okunuyor, ana veri dosyasindaki
   duzenin aynisi. */
const grup = new Map();
for (const e of kufeKenar) {
  const k = e.ozne + "|" + e.taraf;
  if (!grup.has(k)) grup.set(k, []);
  grup.get(k).push(e);
}
const ad = new Map([...V.NODES.map((n) => [n.id, n.tr]), ...yeni.map((k) => [k.id, k.tr])]);
const kenarBlok = [...grup.entries()].map(([k, list]) => {
  const [ozne, taraf] = k.split("|");
  return `  /* ${ad.get(ozne)} -- ${taraf === "talebe" ? "talebeleri" : "hocalari"} */\n` +
    list.map((e) => `  E(${q(e.a)}, ${q(e.b)}, "—", ${q("Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, " + ad.get(ozne) + " tercemesi")}),`).join("\n");
}).join("\n");

const govde = `/* KUFE TRANSI -- DENEME VERISI, yalnizca /ag-sinamasi kullaniyor.

   Ana harita \`silsileVeri.js\`ten besleniyor ve bu dosya ona HIC
   dokunmuyor: mevcut dugum ve kenarlari ice aktarip ustune ekliyor.

   TURETILEN DEGERLER FABRIKADAN. \`POS\`, \`DERECE\`, \`rOf\` ve
   \`rEkranOf\` ana modulde kendi \`NODES\`/\`EDGES\`inden hesaplaniyor;
   burada AYNI fabrikalar bu dosyanin listesiyle cagriliyor. Cagirilmasa
   yeni noktalarin yerlesimi hic hesaplanmaz ve sessizce cizilmezlerdi
   -- Yemen sutunu eklenirken bir kez bu olmustu.

   NEREDEN GELDI. Iskelet Takrib'den (\`takrib-iskelet.py\`), ceviri-yazi
   haritanin kendi dugumlerinden cikarilan sozlukten
   (\`ceviri-sozluk.mjs\`), mukerrerler \`mukerrer-ayikla.mjs\` ile
   ayiklandi, kenarlar Tehzibu't-Tehzib taramasindan
   (\`kenar-tara.py\`). Sayilar ve tuzaklar DEVIR-NOTU.md'de.

   ${yeni.length} dugum, ${kufeKenar.length} kenar. */
import {
  NODES as ANA_NODES, EDGES as ANA_EDGES, N, E,
  dereceKur, rOfKur, rEkranOfKur, yerlesimKur, nebiKenarlariEkle,
} from "./silsileVeri.js";

export * from "./silsileVeri.js";

const KUFE_NODES = [
${dugumSatir}
];

const KUFE_EDGES = [
${kenarBlok}
];

export const NODES = [...ANA_NODES, ...KUFE_NODES];
export const EDGES = [...ANA_EDGES, ...KUFE_EDGES];
nebiKenarlariEkle(NODES, EDGES);
export const DERECE = dereceKur(EDGES);
export const rOf = rOfKur(DERECE);
export const rEkranOf = rEkranOfKur(rOf);
export const { POS, SUTUNLAR, W, MEDINE } = yerlesimKur(NODES);
`;
writeFileSync(ciktiYol, govde, "utf8");
console.log("dugum :", yeni.length);
console.log("kenar :", kufeKenar.length, "(bir ucu yeni olanlar)");
