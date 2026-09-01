/* VEFAT YILINI TAKRIB'E GORE GUNCELLER.

   Kullanim:
     node araclar/yil-guncelle.cjs ibrahimtahman=168 ibrahimavf=95

   DIA KORUMASI VAR. `DIA` tablosunda kaydi olan bir ravide yil zaten
   N() icindeki degeri EZIYOR (bkz. N tanimi), yani orada N()'i
   degistirmek hicbir seye yaramaz -- ve degistirmemeli de: DIA modern
   tercihi yansitiyor, Takrib klasik ihtilaftan bir gorusu. Boyle bir
   kimlik verilirse arac reddediyor.

   Yil, dugumun haritadaki DIKEY konumunu belirliyor; degistirmek
   noktayi yerinden oynatir. O yuzden degisiklikler tek tek ve
   kaynagiyla birlikte yapiliyor. */
const fs = require("fs");
const path = require("path");
const YOL = path.join(__dirname, "..", "app", "silsileVeri.js");

/* N(id, ar, tr, tab, olum, belde, not) -- olum 5. arguman. */
const OLUM_SIRA = 4;

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
  const kod = f.replace(/^export /gm, "");
  const { DIA } = eval(kod + "\n;({DIA})");
  const yapilan = [];

  for (const [id, yil] of cift) {
    if (DIA[id]) {
      throw new Error("DIA'da kayitli, dokunulmuyor: " + id +
                      " (DIA " + DIA[id][0] + ")");
    }
    const anahtar = '  N("' + id + '",';
    const bas = f.indexOf(anahtar);
    if (bas < 0) throw new Error("N satiri yok: " + id);
    // satirin sonu: ilk "),"nin ardindaki satir sonu degil, N(...) kapanisi
    let son = f.indexOf("\n", bas);
    while (son > 0 && !f.slice(bas, son).replace(/\r$/, "").endsWith("),")) {
      son = f.indexOf("\n", son + 1);
      if (son < 0) throw new Error("N kapanisi bulunamadi: " + id);
    }
    const satir = f.slice(bas, son).replace(/\r$/, "");
    const govde = satir.slice(anahtar.length - ("  N(").length + 4, -2); // "  N(" ... "),"
    const par = argumanlariAyir(satir.slice(4, -2));
    if (par.length <= OLUM_SIRA) throw new Error("arguman sayisi az: " + id);
    const eski = par[OLUM_SIRA].trim();
    par[OLUM_SIRA] = " " + yil;
    const yeni = "  N(" + par.join(",") + "),";
    f = f.slice(0, bas) + yeni + f.slice(son);
    yapilan.push({ id, eski, yeni: String(yil) });
  }

  fs.writeFileSync(YOL, f);
  return yapilan;
}

module.exports = { guncelle };

if (require.main === module) {
  const cift = process.argv.slice(2).map((s) => {
    const [id, y] = s.split("=");
    return [id, Number(y)];
  });
  if (!cift.length) { console.error("kullanim: id=yil id=yil ..."); process.exit(1); }
  guncelle(cift).forEach((x) =>
    console.log("  " + x.id.padEnd(20) + x.eski + " -> " + x.yeni));
}
