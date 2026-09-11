/* CEVIRI-YAZI SOZLUGU. Haritadaki 821 dugumun (ar, tr) ciftlerinden
   belirtec duzeyinde bir sozluk cikariyor: sitenin kendi yazim
   gelenegi zaten orada duruyor, elle kural yazmaktansa oradan
   ogrenmek hem tutarli hem denetlenebilir.

   Hizalama yalnizca belirtec sayilari TUTAN ciftlerde yapiliyor;
   tutmayanlar sessizce atlanyor. Amac kapsama degil isabet. */
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const S = "C:/Users/MUSTAF~1/AppData/Local/Temp/claude/C--Users-Mustafa-Kalfa-Desktop-Vercel-Web/8eb4f327-3b9a-40af-b36e-888c4f9ac8e5/scratchpad";
const V = await import(pathToFileURL("app/silsileVeri.js").href);

/* «بن» ile «b.» ve «أبو» ile «Ebû» birebir karsilik; hizalamadan once
   ikisini de ayni birim sayiyoruz. */
const birlestir = (t) => {
  /* BILESIK ADLAR TEK BIRIM. \u00AB\u0639\u0628\u062F \u0627\u0644\u0631\u062D\u0645\u0646\u00BB Turkce'de tek kelime
     (Abdurrahman); iki belirtec sayilirsa hizalama bir kayiyor ve
     sozluk \u00AB\u0627\u0644\u0631\u062D\u0645\u0646\u00BBa bambaska bir karsilik ogreniyordu -- Said b.
     Abdurrahman "Said b. Abd (Rabiatu'r-re'y)" cikmisti. \u00AB\u0627\u0628\u0648\u00BB ve
     \u00AB\u0627\u0645\u00BB oncesinde bu sorun yok, onlar Turkce'de de iki kelime. */
  const out = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] === "\u0639\u0628\u062F" && i + 1 < t.length) out.push(t[i] + " " + t[++i]);
    else out.push(t[i]);
  }
  return out;
};
const arHazirla = (s) => birlestir(s
  .replace(/\u0640/g, "")
  .replace(/[\u064B-\u0652\u0670]/g, "")
  .replace(/(^|\s)ابن(\s|$)/g, "$1بن$2")
  .trim().split(/\s+/));
const trHazirla = (s) => s.trim().split(/\s+/);

const say = new Map();               // ar belirteci -> {tr: adet}
let hizalanan = 0, atlanan = 0;
for (const n of V.NODES) {
  const a = arHazirla(n.ar), t = trHazirla(n.tr);
  if (a.length !== t.length) { atlanan++; continue; }
  hizalanan++;
  for (let i = 0; i < a.length; i++) {
    if (!say.has(a[i])) say.set(a[i], new Map());
    const m = say.get(a[i]);
    m.set(t[i], (m.get(t[i]) || 0) + 1);
  }
}
/* Her Arapca belirtec icin EN COK gecen Turkce karsilik. Ikinci
   karsiligin payi yuksekse belirtec SUPHELI sayiliyor -- ornegin
   «عبد» tek basina hem "Abd" hem "Abdullah"in parcasi olabiliyor. */
const sozluk = {}, supheli = [];
for (const [ar, m] of say) {
  const s = [...m.entries()].sort((x, y) => y[1] - x[1]);
  const toplam = s.reduce((a, b) => a + b[1], 0);
  sozluk[ar] = s[0][0];
  if (s.length > 1 && s[1][1] / toplam > 0.25) {
    supheli.push([ar, s.slice(0, 3).map(([t, n]) => t + "(" + n + ")").join(" / ")]);
  }
}
writeFileSync(S + "/ceviri-sozluk.json", JSON.stringify(sozluk, null, 1), "utf8");
console.log("hizalanan cift :", hizalanan, "| atlanan:", atlanan);
console.log("sozluk belirteci:", Object.keys(sozluk).length);
console.log("supheli         :", supheli.length);
console.log("\n-- supheliler --");
for (const [ar, d] of supheli.slice(0, 25)) console.log("  " + ar.padEnd(14), d);
