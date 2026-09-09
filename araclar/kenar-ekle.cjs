/* ELLE SECILMIS KENARLARI EKLER.
   Kullanim: node araclar/kenar-ekle.cjs <ozneId> <talebe|hoca> "<kaynak>" <id> <id> ...

   isle.cjs'ten farki: o, terceme listesini kendi eslestiriyor. Bu arac
   eslesmeyi GOZE birakiyor.

   Gerekcesi: esle.cjs bilerek siki -- kayit dugumun adiyla BASLAMALI.
   Bu kural yanlis kenari onluyor ama terceme listelerindeki kisa
   bicimleri de eliyor: "الاعمش", "شعبة", "الزهري", "عائشة" gibi sohret
   adlari ve "ابيه" (babasi), "عمته حفصة" (halasi Hafsa) gibi akrabalik
   zamirleri. Bunlar cogu zaman haritanin EN BUYUK dugumlerine isaret
   ediyor, yani kaybedilen kenarlarin degeri yuksek. Ornek: Hamza b.
   Abdillah b. Omer'in uc hocasi da ("ابيه، وعمته حفصة، وعائشة") bu
   yuzden hic cizilmemisti.

   Dedup isle.cjs ile ayni yontemde: EDGES modulu calistirilarak
   okunuyor, metinden regex ile degil -- kenarlarin bir kismi toplu
   .map() bloklarinda uretiliyor ve regex onlari gormuyor. */
const fs = require("fs");
const path = require("path");
const SP = __dirname;
const YOL = path.join(SP, "..", process.env.SILSILE_VERI || "app/silsileVeri.js");

const [, , ozneId, yon, kaynak, ...idler] = process.argv;
if (!ozneId || !["talebe", "hoca"].includes(yon) || !kaynak || !idler.length) {
  console.error('kullanim: kenar-ekle.cjs <ozneId> <talebe|hoca> "<kaynak>" <id>...');
  process.exit(1);
}
const dugumler = JSON.parse(fs.readFileSync(path.join(SP, "dugumler.json"), "utf8"));
const bul = (id) => {
  const d = dugumler.find((x) => x.id === id);
  if (!d) throw new Error("dugum yok: " + id);
  return d;
};
const ozne = bul(ozneId);

let f = fs.readFileSync(YOL, "utf8");
const varOlan = new Set();
{
  const { EDGES } = eval(f.replace(/^export /gm, "") + "\n;({ EDGES })");
  EDGES.forEach((e) => varOlan.add(e.a + "|" + e.b));
}

const yeni = [];
for (const id of idler) {
  const d = bul(id);
  const [a, b] = yon === "talebe" ? [ozneId, id] : [id, ozneId];
  if (varOlan.has(a + "|" + b) || varOlan.has(b + "|" + a)) {
    console.log("  zaten var, atlandi: " + a + " -> " + b);
    continue;
  }
  varOlan.add(a + "|" + b);
  yeni.push([a, b, d.tr]);
}
if (!yeni.length) { console.log("yeni kenar yok (" + ozne.tr + ")"); process.exit(0); }

const satirlar = yeni.map(([a, b]) =>
  `  E(${JSON.stringify(a)}, ${JSON.stringify(b)}, "—", ${JSON.stringify(kaynak)}),`);
const blok = `\n  /* ${ozne.tr} (o. ${ozne.olum ?? "?"}) -- ` +
  `${yon === "talebe" ? "talebeleri" : "hocalari"}.\n` +
  `     ${kaynak}. Elle secildi: ${yeni.map((x) => x[2]).join(", ")}. */\n` +
  satirlar.join("\n") + "\n";

const kapanis = f.indexOf("\n];", f.indexOf("const EDGES_HAM = ["));
if (kapanis < 0) throw new Error("EDGES kapanisi bulunamadi");
f = f.slice(0, kapanis) + "\n" + blok + f.slice(kapanis);
fs.writeFileSync(YOL, f);
console.log(ozne.tr + ": " + yeni.length + " kenar eklendi");
