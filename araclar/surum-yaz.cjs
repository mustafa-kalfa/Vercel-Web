/* HER YAPIMDA `public/surum.txt`e O YAPIMIN KIMLIGINI YAZAR.

   Neden gerekiyor: sayfanin HTML'i `max-age=0, must-revalidate` ile
   geliyor ve `_next/static` altindaki paketlerin adi icerikten
   tureniyor, yani SUNUCU tarafi dogru. Buna ragmen daha once siteye
   girmis bir tarayici eski surumu gosterebiliyor (Mustafa, 2026-09-11:
   "siteye daha once girenler ayni tarayicidan bu degisiklikleri neden
   goremiyorlar"). Sebep sunucu degil, tarayicinin sayfayi agdan
   sormadan geri getirmesi -- arka planda duran bir sekme, geri
   dugmesi, ya da telefonda uygulamanin yeniden acilmasi. O anda
   hicbir istek cikmiyor, dolayisiyla hicbir onbellek basligi ise
   yaramiyor.

   Cozum, sayfanin kendi surumunu bilmesi ve geri donuldugunde
   sunucudakiyle karsilastirmasi: `SurumBekcisi`. Bu dosya da ona
   karsilastiracak bir sey veriyor.

   Dosya `public/` altinda cunku Vercel orayi `max-age=0,
   must-revalidate` ile veriyor, ustelik bekci `cache: "no-store"` ile
   istiyor -- yani her zaman tazesi geliyor.

   Depoya GIRMIYOR (.gitignore). Her yapimda yeniden uretiliyor ve
   commit'lerde gereksiz bir satir olusturmasinin anlami yok. */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const HEDEF = path.join(__dirname, "..", "public", "surum.txt");

/* Vercel yapimda commit ozetini ortam degiskeninde veriyor. Yerelde
   yoksa git'ten soruluyor; o da yoksa (depo disinda bir kopya) yapim
   anina duselim -- onemli olan surumler arasinda FARKLI olmasi. */
function surum() {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 12);
  }
  try {
    return execSync("git rev-parse --short=12 HEAD", {
      cwd: path.join(__dirname, ".."), encoding: "utf8", stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return String(Date.now());
  }
}

/* Calisma agacinda islenmemis degisiklik varsa commit ozeti iki farkli
   yapim icin ayni kalir. Yerelde sinarken bu yanlis bir "guncel"
   cevabi uretirdi, o yuzden yereldeki damgaya yapim ani da giriyor.
   Vercel'de calisma agaci her zaman temiz, orada gerek yok. */
const damga = process.env.VERCEL_GIT_COMMIT_SHA
  ? surum()
  : surum() + "-" + Date.now();

fs.writeFileSync(HEDEF, damga + "\n", "utf8");
console.log("surum.txt <- " + damga);
