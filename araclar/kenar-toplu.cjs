/* TOPLU KENAR EKLEME. Girdi: [{a, b, ozne, taraf, kayit}] JSON'u.
   Kullanim: node araclar/kenar-toplu.cjs <json> "<kaynak>"

   kenar-ekle.cjs tek tek calisiyor ve elle secilmis birkac kenar icin
   dogru; bu arac ise toplu taramanin ciktisini yaziyor. Kenarlar
   OZNESINE gore gruplanip ayri bloklar halinde ekleniyor, yani
   dosyada her blok "su tercemenin listesinden" diye okunuyor.

   Dedup isle.cjs ile ayni: EDGES modulu calistirilarak okunuyor. */
const fs = require("fs");
const path = require("path");
const SP = __dirname;
const YOL = path.join(SP, "..", process.env.SILSILE_VERI || "app/silsileVeri.js");

const [, , jsonYol, kaynak] = process.argv;
if (!jsonYol || !kaynak) {
  console.error('kullanim: kenar-toplu.cjs <json> "<kaynak>"');
  process.exit(1);
}
const istek = JSON.parse(fs.readFileSync(jsonYol, "utf8"));
const dugumler = JSON.parse(fs.readFileSync(path.join(SP, "dugumler.json"), "utf8"));
const D = new Map(dugumler.map((d) => [d.id, d]));

let f = fs.readFileSync(YOL, "utf8");
const varOlan = new Set();
{
  const { EDGES } = eval(f.replace(/^export /gm, "") + "\n;({ EDGES })");
  EDGES.forEach((e) => varOlan.add(e.a + "|" + e.b));
}

const gruplar = new Map();
let atlanan = 0;
for (const x of istek) {
  if (!D.has(x.a) || !D.has(x.b)) throw new Error("dugum yok: " + x.a + "/" + x.b);
  if (varOlan.has(x.a + "|" + x.b) || varOlan.has(x.b + "|" + x.a)) { atlanan++; continue; }
  varOlan.add(x.a + "|" + x.b);
  const k = x.ozne + "|" + x.taraf;
  if (!gruplar.has(k)) gruplar.set(k, []);
  gruplar.get(k).push(x);
}

const bloklar = [];
let toplam = 0;
for (const [k, list] of gruplar) {
  const [ozneId, taraf] = k.split("|");
  const ozne = D.get(ozneId);
  const satirlar = list.map((x) =>
    `  E(${JSON.stringify(x.a)}, ${JSON.stringify(x.b)}, "—", ${JSON.stringify(kaynak + ", " + ozne.tr + " tercemesi")}),`);
  bloklar.push(`\n  /* ${ozne.tr} (o. ${ozne.olum ?? "?"}) -- ` +
    `${taraf === "talebe" ? "talebeleri" : "hocalari"}, kisa ad taramasi.\n` +
    `     ${list.map((x) => D.get(taraf === "talebe" ? x.b : x.a).tr).join(", ")}. */\n` +
    satirlar.join("\n") + "\n");
  toplam += list.length;
}
if (!toplam) { console.log("yeni kenar yok"); process.exit(0); }

const kapanis = f.indexOf("\n];", f.indexOf("const EDGES_HAM = ["));
if (kapanis < 0) throw new Error("EDGES kapanisi bulunamadi");
f = f.slice(0, kapanis) + "\n" + bloklar.join("") + f.slice(kapanis);
fs.writeFileSync(YOL, f);
console.log(toplam + " kenar eklendi, " + gruplar.size + " blok (zaten var: " + atlanan + ")");
