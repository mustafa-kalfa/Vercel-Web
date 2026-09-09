/* BILGI KARTI METNINI (N()'in 7. argumani) YAZAR.
   Kullanim: node araclar/not-guncelle.cjs <json>
   JSON: [{"id": "...", "not": "..."}]

   Metin komut satirindan degil dosyadan aliniyor: kart metinleri uzun,
   Turkce ve Arapca tirnak iceriyor; kabuk uzerinden gecirmek hem
   kacislari bozuyor hem de metni okunmaz kiliyor.

   VAR OLAN NOTU EZMEZ. Kartlarin bir kismi arastirma sonucu, bir
   kismi da yil calismasindan kalma kisa kayit ("Vefat yili ...
   girildi"); ikisini de kazara silmemek icin ustune yazma acikca
   istenmeli (JSON'da "ez": true). */
const fs = require("fs");
const path = require("path");
const YOL = path.join(__dirname, "..", process.env.SILSILE_VERI || "app/silsileVeri.js");
const NOT_SIRA = 6;

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

const istek = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
let f = fs.readFileSync(YOL, "utf8");
const yapilan = [];
for (const { id, not, ez } of istek) {
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
  if (par.length > NOT_SIRA && par[NOT_SIRA].trim() && !ez) {
    console.log("  notu var, atlandi: " + id);
    continue;
  }
  while (par.length <= NOT_SIRA) par.push("");
  par[NOT_SIRA] = "\n    " + JSON.stringify(not);
  f = f.slice(0, bas) + "  N(" + par.join(",") + ")," + f.slice(son);
  yapilan.push(id);
}
fs.writeFileSync(YOL, f);
console.log(yapilan.length + " kart yazildi: " + yapilan.join(", "));
