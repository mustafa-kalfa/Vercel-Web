/* Bir tercemenin cikarilmis listesini KENARA cevirip SilsileAgi.jsx'e
   ekler. EDGES dizisinin sonuna, kaynagiyla birlikte.
   Kullanim: node isle.cjs <ozneId> <yon:talebe|hoca> <metinDosya> <kaynak> */
const fs = require("fs");
const path = require("path");
const SP = __dirname;
const { eslestir } = require(path.join(SP, "esle.cjs"));

const [, , ozneId, yon, metinDosya, kaynak] = process.argv;
const YOL = path.join(SP, "..", "app", "silsileVeri.js");
const dugumler = JSON.parse(fs.readFileSync(path.join(SP, "dugumler.json"), "utf8"));
const ozne = dugumler.find((d) => d.id === ozneId);
if (!ozne) throw new Error("ozne yok: " + ozneId);
const metin = fs.readFileSync(metinDosya, "utf8");
const { kayitSayisi, eslesen } = eslestir(metin, dugumler, ozne, yon);

let f = fs.readFileSync(YOL, "utf8");
// mevcut kenarlari topla ki tekrar eklemeyelim
const varOlan = new Set();
for (const m of f.matchAll(/E\(\s*"([^"]+)"\s*,\s*"([^"]+)"/g)) varOlan.add(m[1] + "|" + m[2]);
for (const m of f.matchAll(/\["([^"]+)"\s*,\s*"[^"]*"\]/g)) { /* map bloklari asagida */ }

const yeni = [];
for (const e of eslesen) {
  const [a, b] = yon === "talebe" ? [ozneId, e.id] : [e.id, ozneId];
  if (varOlan.has(a + "|" + b) || varOlan.has(b + "|" + a)) continue;
  yeni.push([a, b, e.rumuz, e.tr]);
}
if (!yeni.length) { console.log("yeni kenar yok (" + ozne.tr + ")"); process.exit(0); }

const satirlar = yeni.map(([a, b, r]) =>
  `  E(${JSON.stringify(a)}, ${JSON.stringify(b)}, ${JSON.stringify(r)}, ${JSON.stringify(kaynak)}),`);
const blok = `\n  /* ${ozne.tr} (o. ${ozne.olum ?? "?"}) -- ${yon === "talebe" ? "talebeleri" : "hocalari"}.\n` +
  `     ${kaynak}. Tercemede ${kayitSayisi} kayit var, agda dugumu olan ${yeni.length}'i cizildi. */\n` +
  satirlar.join("\n") + "\n";

// EDGES dizisinin kapanisindan hemen once ekle
const kapanis = f.indexOf("\n];", f.indexOf("const EDGES = ["));
if (kapanis < 0) throw new Error("EDGES kapanisi bulunamadi");
f = f.slice(0, kapanis) + "\n" + blok + f.slice(kapanis);
fs.writeFileSync(YOL, f);
console.log(ozne.tr + ": " + yeni.length + " yeni kenar eklendi (tercemede " + kayitSayisi + " kayit)");
