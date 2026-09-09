/* BELDEYI (harita sutununu) GUNCELLER.

   Kullanim:
     node araclar/belde-guncelle.cjs ismailayyas=Humus harunmaruf=Bağdat

   Belde, dugumun haritadaki YATAY konumunu belirliyor: yanlis belde
   noktayi yanlis sutuna koyar ve bu gozle gorulur bir hata. Yil
   tarafindaki DIA gibi bir koruma yok -- belde tek yerden, N()'in 6.
   argumanindan geliyor.

   TEK KORUMA: yeni belde BELDELER listesinde olmali. Listede olmayan
   bir belde yazilirsa o ravi hicbir sutuna dusmez ve haritadan SESSIZCE
   kaybolur (Yemen eklenirken tam bu olmustu, bkz. BELDELER yorumu).
   Yeni bir sutun aciyorsan once BELDELER ile COGRAFI ve BELDE_AD
   tablolarini guncelle, sonra bu araci calistir. */
const fs = require("fs");
const path = require("path");
const YOL = path.join(__dirname, "..", "app", "silsileVeri.js");

/* N(id, ar, tr, tab, olum, belde, not) -- belde 6. arguman. */
const BELDE_SIRA = 5;

function argumanlariAyir(govde) {
  const par = [];
  let derinlik = 0, tirnak = false, kacis = false, cur = "";
  for (const c of govde) {
    if (kacis) { cur += c; kacis = false; continue; }
    if (c === "\\") { cur += c; kacis = true; continue; }
    if (c === '"') { tirnak = !tirnak; cur += c; continue; }
    if (!tirnak) {
      if (c === "(" || c === "[" || c === "{") derinlik++;
      if (c === ")" || c === "]" || c === "}") derinlik--;
      if (c === "," && derinlik === 0) { par.push(cur); cur = ""; continue; }
    }
    cur += c;
  }
  par.push(cur);
  return par;
}

function guncelle(cift) {
  let f = fs.readFileSync(YOL, "utf8");
  const { BELDELER } = eval(f.replace(/^export /gm, "") + "\n;({BELDELER})");
  const bilinen = new Set(BELDELER);
  const yapilan = [];

  for (const [id, belde] of cift) {
    if (!bilinen.has(belde)) {
      throw new Error("BELDELER'de yok, ravi haritadan duserdi: " + belde);
    }
    const anahtar = '  N("' + id + '",';
    const bas = f.indexOf(anahtar);
    if (bas < 0) throw new Error("N satiri yok: " + id);
    let son = f.indexOf("\n", bas);
    while (son > 0 && !f.slice(bas, son).replace(/\r$/, "").endsWith("),")) {
      son = f.indexOf("\n", son + 1);
      if (son < 0) throw new Error("N kapanisi bulunamadi: " + id);
    }
    const satir = f.slice(bas, son).replace(/\r$/, "");
    const par = argumanlariAyir(satir.slice(4, -2));
    if (par.length <= BELDE_SIRA) throw new Error("arguman sayisi az: " + id);
    const eski = par[BELDE_SIRA].trim();
    par[BELDE_SIRA] = ' "' + belde + '"';
    f = f.slice(0, bas) + "  N(" + par.join(",") + ")," + f.slice(son);
    yapilan.push({ id, eski: eski.replace(/"/g, ""), yeni: belde });
  }

  fs.writeFileSync(YOL, f);
  return yapilan;
}

module.exports = { guncelle };

if (require.main === module) {
  const cift = process.argv.slice(2).map((s) => {
    const i = s.indexOf("=");
    return [s.slice(0, i), s.slice(i + 1)];
  });
  if (!cift.length) { console.error("kullanim: id=Belde id=Belde ..."); process.exit(1); }
  guncelle(cift).forEach((x) =>
    console.log("  " + x.id.padEnd(22) + x.eski + " -> " + x.yeni));
}
