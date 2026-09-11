"use client";

import { useEffect, useRef } from "react";

/* SAYFA ESKIYSE KENDINI YENILER.

   SORUN. Sunucu tarafi dogru: HTML `max-age=0, must-revalidate` ile
   geliyor, `_next/static` altindaki paket adlari icerikten tureniyor,
   ETag ile 304 dogru calisiyor, hizmet calisani (service worker) hic
   olmadi. Buna ragmen daha once siteye girmis bir tarayici eski
   surumu gosterebiliyordu (Mustafa, 2026-09-11: "siteye daha once
   girenler ayni tarayicidan bu degisiklikleri neden goremiyorlar").

   Sebep onbellek BASLIKLARI degil: tarayici sayfayi aga hic sormadan
   geri getiriyor. Arka planda duran bir sekme, geri dugmesi, telefonda
   uygulamanin yeniden acilmasi -- ucunde de istek CIKMIYOR, dolayisiyla
   hicbir baslik ayari devreye giremiyor. `no-store` bile cozmez.

   COZUM. Sayfa acilirken kendi surumunu ogreniyor ve geri
   donuldugunde sunucudakine bir daha bakiyor. Degismisse yeniliyor.
   Damgayi `araclar/surum-yaz.cjs` her yapimda uretiyor.

   NE ZAMAN BAKILIYOR.
   - `pageshow` olayi `persisted` ile geldiginde, yani sayfa geri/ileri
     onbellegin­den (bfcache) donduğunde. Asil vaka bu.
   - Sekme yeniden gorunur oldugunda. Telefonda uygulamaya donmek bunu
     uretiyor ama bfcache olayini her zaman uretmiyor.

   `BEKLEME` ile seyreltiliyor: sekme arasi gezinen biri dakikada
   onlarca `visibilitychange` uretebilir, her birinde istek atmanin
   anlami yok. Bir dakika, yeni yayinin fark edilmesi icin fazlasiyla
   sik.

   ILK ISTEK YOK. Surum ilk `pageshow`/gorunurluk olayinda ogreniliyor
   degil, bilesen baglanirken ogreniliyor -- cunku o an sayfanin
   GERCEKTEN yuklendigi andir ve sunucudan gelen deger o anki yayin
   demektir. Sonraki her bakis bununla karsilastiriliyor.

   SESSIZCE VAZGECIYOR. Ag yoksa, dosya 404 verirse ya da cevap boyu
   sasarsa hicbir sey yapilmiyor. Bir bekcinin yapabilecegi en kotu sey
   ziyaretciyi durduk yere yeniden yuklemektir. */

const DOSYA = "/surum.txt";
const BEKLEME = 60_000;

async function surumOku(): Promise<string | null> {
  try {
    const c = await fetch(DOSYA, { cache: "no-store" });
    if (!c.ok) return null;
    const s = (await c.text()).trim();
    /* Beklenen sey kisa bir damga. Uzun bir sey geldiyse muhtemelen
       bir vekil sunucunun hata sayfasi -- ona bakip yenilemeyelim. */
    return s && s.length <= 64 ? s : null;
  } catch {
    return null;
  }
}

export default function SurumBekcisi() {
  const surum = useRef<string | null>(null);
  const sonBakis = useRef(0);

  useEffect(() => {
    let canli = true;

    surumOku().then((s) => { if (canli) surum.current = s; });

    const bak = async (zorla: boolean) => {
      if (!surum.current) return;
      const simdi = Date.now();
      if (!zorla && simdi - sonBakis.current < BEKLEME) return;
      sonBakis.current = simdi;
      const s = await surumOku();
      if (!canli || !s || s === surum.current) return;
      /* Yenilemeden once damgayi guncelliyoruz: yenileme herhangi bir
         sebeple gerceklesmezse sonsuz bir donguye girmeyelim. */
      surum.current = s;
      window.location.reload();
    };

    const gorunurluk = () => {
      if (document.visibilityState === "visible") bak(false);
    };
    const geriGeldi = (e: PageTransitionEvent) => {
      if (e.persisted) bak(true);
    };

    document.addEventListener("visibilitychange", gorunurluk);
    window.addEventListener("pageshow", geriGeldi);
    return () => {
      canli = false;
      document.removeEventListener("visibilitychange", gorunurluk);
      window.removeEventListener("pageshow", geriGeldi);
    };
  }, []);

  return null;
}
