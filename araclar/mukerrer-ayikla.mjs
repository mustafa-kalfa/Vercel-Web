/* MUKERRER DENETIMI. Takrib'den cikan bir kayit haritada ZATEN varsa
   ikinci bir nokta acilmamali -- mukerrer dugum kenarlari da ikiye
   boler, yani yanlisi eksikten beter.

   ILK SURUM ALTDIZI TESTIYDI VE SIZDIRDI. Iki sebep:
     1. Haritadaki adlarin bir kismi KUNYA-ONCE yazili
        («أبو كريب محمد بن العلاء»), Takrib ise AD-ONCE veriyor
        («محمد بن العلاء بن كريب»). Altdizi testi ilk belirtecin
        tutmasini istiyordu, tutmuyordu -- Ebu Kureyb, Ebu Usame ve
        Ebu'l-Ahves haritada olduklari halde "yeni" sayildilar.
     2. Harf-i tarif farki: «الحجاج بن أرطاة» ile «حجاج بن أرطاة».

   YENI OLCUT KUME. Cekirdek belirtecler (baglac ve kunya isareti
   atilmis, harf-i tarif soyulmus) kumesi biri otekini KAPSIYORSA ve
   en az iki ortak belirtec varsa ayni kisi sayiliyor. Vefat yili
   ikisinde de biliniyorsa 15 yil tolerans araniyor.

   Yanlis birlestirmenin bedeli DUSUK: o kaydi eklemeyiz, yani
   kapsamadan kaybederiz. Yanlis AYIRMANIN bedeli yuksek: haritada iki
   nokta ve bolunmus kenarlar. O yuzden supheli durumda birlestiriyoruz. */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

/* Kullanim (my-app icinden):
     node araclar/mukerrer-ayikla.mjs <temiz.json> <kirli.json> <cikti.json> */
const [, , temizYol, kirliYol, ciktiYol] = process.argv;
if (!temizYol || !kirliYol || !ciktiYol) {
  console.error("kullanim: mukerrer-ayikla.mjs <temiz.json> <kirli.json> <cikti.json>");
  process.exit(1);
}
const V = await import(pathToFileURL("app/silsileVeri.js").href);
const temiz = JSON.parse(readFileSync(temizYol, "utf8"));
const kirli = JSON.parse(readFileSync(kirliYol, "utf8"));
const kufe = [...temiz, ...kirli].filter((k) => k.id && k.ar);

const ATIL = new Set(["بن", "ابن", "أبو", "أبي", "أبا", "أم", "بنت", "مولي", "مولاهم"]);
function cekirdek(s) {
  const t = s.replace(/[ً-ْٰـ]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .split(/\s+/)
    .map((w) => w.replace(/^ال/, ""))          // harf-i tarif soyuluyor
    .filter((w) => w.length > 1 && !ATIL.has(w) && !ATIL.has("ال" + w));
  return new Set(t);
}
const kapsar = (a, b) => [...a].every((w) => b.has(w));
const kesisim = (a, b) => [...a].filter((w) => b.has(w)).length;

const mevcut = V.NODES.map((n) => ({ n, c: cekirdek(n.ar) }));

/* AYIRT EDICILIK. Kume testi tek basina fazla birlestirdi: «جعفر محمد»
   gibi iki YAYGIN addan olusan bir cekirdek, ayni iki adi tasiyan
   bambaska bir dugumun altkumesi cikiyor ve Ca'fer b. Muhammed uc ayri
   kisiyle eslesti. Cozum, ortak belirteclerden en az birinin NADIR
   olmasini sart kosmak -- kimligi tasiyan belirtec zaten odur. */
const sıklık = new Map();
for (const { c } of mevcut) for (const w of c) sıklık.set(w, (sıklık.get(w) || 0) + 1);
const YAYGIN_ESIK = 25;
const ayirtEdici = (a, b) =>
  [...a].some((w) => b.has(w) && (sıklık.get(w) || 0) <= YAYGIN_ESIK);
const ayni = [], yeni = [];
for (const k of kufe) {
  const kc = cekirdek(k.ar);
  const esles = mevcut.filter(({ n, c }) => {
    if (!(kapsar(kc, c) || kapsar(c, kc))) return false;
    if (kesisim(kc, c) < 2) return false;
    if (!ayirtEdici(kc, c)) return false;
    /* IKI BELIRTECLIK CEKIRDEK ANCAK ESITSE DELIL. «جعفر محمد» daha
       uzun bir adin altkumesi cikip Ca'fer b. Muhammed'i uc ayri
       kisiyle eslestirmisti; iki yaygin ad tek basina kimlik degil.
       Cekirdekler BIREBIR aynysa ya da kucuk olan uc belirtece
       ulasiyorsa delil sayiliyor. */
    if (Math.min(kc.size, c.size) < 3 && kc.size !== c.size) return false;
    if (typeof n.olum === "number" && typeof k.olum === "number")
      return Math.abs(n.olum - k.olum) <= 15;
    return true;
  });
  if (esles.length) ayni.push({ k, esles: esles.map((e) => e.n) });
  else yeni.push(k);
}
writeFileSync(ciktiYol, JSON.stringify(yeni, null, 1), "utf8");
console.log("aday kayit        :", kufe.length);
console.log("haritada ZATEN var:", ayni.length);
console.log("gercekten yeni    :", yeni.length);
console.log("\n-- mukerrer olarak elenenler --");
for (const x of ayni.slice(0, 40)) {
  console.log("  " + (x.k.tr || x.k.ar).slice(0, 40).padEnd(42), "->",
              x.esles.map((n) => n.tr).slice(0, 3).join(" / "));
}
