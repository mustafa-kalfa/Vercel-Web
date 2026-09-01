"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";
import s from "./DilAntrenmani.module.css";
import { useLanguage } from "./LanguageContext";
import type { Language } from "./translations";

/* ÜÇ DİL, TEK KELİME -- eşleştirme kart oyunu.

   Tahta 5x5, 25 kart. İçinde 6 kelime × 3 dil = 18 kart ve 7 "Mustafâ"
   kartı (joker) var. Oyuncu art arda ÜÇ kart açar, üç durum eşleşme
   sayılır:

   - 3 kelime kartı, aynı kelime üç ayrı dilde.  Tahtadan 3 kart çıkar.
   - 2 kelime + 1 joker.  Eksik dildeki kart açılır, 4 kart çıkar.

   BAŞKA HİÇBİR ŞEY EŞLEŞME DEĞİL. Bir turda İKİ ya da ÜÇ Mustafâ
   seçilirse o turda hiçbir kart tamamlanmış sayılmıyor, kartlar yanlış
   seçim gibi kapanıyor (Mustafâ'nın kuralı, 2026-09-01).

   Kural bir gün "1 kelime + 2 joker" eşleşmesine de izin veriyordu ve
   ÖLÇÜLDÜ: jokerler bedelsiz olduğu için oyuncu her turda bir kelime
   kartı ile iki Mustafâ seçip tahtayı altı hamlede, hiçbir kartı
   ezberlemeden bitirebiliyordu. Oyunun hafıza yönü fiilen kapanıyordu.
   Bu yüzden kural kaldırıldı; geri getirmeden önce aynı hesabı yap.

   Oyun `/resule-kavusmak`taki isnâd oyunundan farklı olarak IFRAME
   DEĞİL, gerçek bir React bileşeni. Sebep: dışarıyla hiçbir alışverişi
   yok -- tema/dil senkronu, yükseklik bildirimi, toast konumu gibi
   postMessage'ların hiçbiri gerekmiyor. Biçimler
   `DilAntrenmani.module.css` içinde, hangi kelimelerin geleceğini ise
   `DilAntrenmaniHub` seçiyor. */

type Dil = "tr" | "en" | "ar";
export type Kelime = { tr: string; en: string; ar: string };

/* Râvi ilişki haritasındaki nokta renkleri. Kart yüzündeki şerit ve
   dil rozeti bunlardan boyanıyor. */
const NOKTALAR = [
  "--n1", "--n2", "--n3", "--n4", "--n5", "--n6", "--n7",
  "--n8", "--n9", "--n10", "--n11", "--n12", "--n13",
];

const DILLER: Dil[] = ["tr", "en", "ar"];

/* TAHTA 5x5 = 25 KART. 7'si Mustafâ kartı, kalan 18'i 6 kelimenin üç
   dildeki karşılığı. Üç sayı birbirine bağlı, birini değiştirirsen
   ötekileri de tut: `KART = KELIME * 3 + JOKER`.

   Seviye dosyasında her seviyede ON kelime var ama tahtaya ALTISI
   çıkıyor -- her dağıtımda seviyenin on kelimesinden rastgele altısı
   seçiliyor. Böylece "Yeniden dağıt" aynı tahtayı tekrarlamıyor ve
   seviye birkaç turda tümüyle görülüyor. */
const JOKER_SAYISI = 7;
const KELIME_SAYISI = 6;

/* Joker kartındaki karakter. `/resule-kavusmak` oyununun kavuşma
   sahnesinde ve tebrik pop-up'ında kullanılan KLİBİN AYNISI -- oyunlar
   arasında aynı Mustafâ görünsün diye.

   Klip "paketlenmiş alfa" taşıyor (üst yarı renk, alt yarı maske), yani
   düz bir `<video>` saydam göstermez; saydamlığı `ChromaKeyVideo` WebGL
   ile geri üretiyor. Ayrıntı AGENTS.md'de. */
const MUSTAFA_KLIP = "/Mustafa%20Karsilama_seffaf.mp4";

type Kart = {
  tip: "kelime" | "joker";
  kelimeId: number;
  dil: Dil | null;
  metin: string;
  renk: string;
  egim: string;
  acik: boolean;
  bitti: boolean;
  gitti: boolean;
  eslesti: boolean;
  yanlis: boolean;
};

function karistir<T>(a: readonly T[]): T[] {
  const d = a.slice();
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

function desteKur(kelimeler: Kelime[]): Kart[] {
  const veri: Omit<Kart, "acik" | "bitti" | "gitti" | "eslesti" | "yanlis" | "egim">[] = [];
  /* Seviyenin on kelimesinden bu tura çıkacak altısı. Liste zaten
     altı ya da daha az ise olduğu gibi alınıyor. */
  const bugunku = karistir(kelimeler).slice(0, KELIME_SAYISI);
  bugunku.forEach((k, i) => {
    /* AYNI KELİMENİN ÜÇ KARTI ÜÇ AYRI RENK ALIR. Renk tamamen rastgele
       dağıtılsaydı bir kelimenin kartları tesadüfen aynı rengi alabilir
       ve bu doğrudan ipucu olurdu. Bu kural bozulursa oyun kolaylaşır. */
    const uclu = karistir(NOKTALAR).slice(0, 3);
    DILLER.forEach((d, j) =>
      veri.push({ tip: "kelime", kelimeId: i, dil: d, metin: k[d], renk: uclu[j] }),
    );
  });
  for (let i = 0; i < JOKER_SAYISI; i++) {
    veri.push({ tip: "joker", kelimeId: -1, dil: null, metin: "", renk: "--altin-sicak" });
  }

  return karistir(veri).map((v) => ({
    ...v,
    egim: (Math.random() * 10 - 5).toFixed(1) + "deg",
    acik: false,
    bitti: false,
    gitti: false,
    eslesti: false,
    yanlis: false,
  }));
}

/* KART ÜZERİNDEKİ PUNTO harf sayısından hesaplanıyor.

   Sabit bir punto vermek olmuyor: "responsibility" 14 harf, "zil" 3.
   Kademeli sınıflarla da denendi, iki sorunu vardı -- kademe sınırında
   punto zıplıyordu ve en uzun kelimeler okunamayacak kadar (ölçüldü,
   7px) küçülüyordu. Formül sürekli bir küçültme veriyor ve yalnızca
   gerektiği kadar iniyor.

   Ölçü birimi `cqw`, yani KARTIN kendi genişliğinin yüzdesi: kart
   büyüyünce yazı da büyüyor, hesap her ekran boyutunda aynı kalıyor.
   `KULLANILABILIR` kartın iç genişliği -- 100'den iki yandaki 5cqw
   dolgu ve 4cqw'lik iç çerçeve payı düşülmüş hâli.

   `ADIM` bir harfin ortalama genişliği (em cinsinden). Değerler tarayıcıda
   `measureText` ile ÖLÇÜLDÜ, tahmin değil: EB Garamond'da en geniş
   kelimeler 0.52'ye çıkıyor (0.55 pay bırakıyor), Amiri'de 0.36'yı
   geçmiyor. Arapça harfler daha dar bağlandığı ve harekeler YATAYDA yer
   kaplamadığı için harf sayısı harekeler ATILARAK sayılıyor -- yoksa
   "قَصِيدَة" 12 harf sayılıp gereksiz küçülürdü.

   Ölçü kelimenin TAMAMINA değil EN UZUN PARÇASINA bakıyor: "deniz
   kabuğu" iki satıra sarıyor, yani sığması gereken şey 12 harf değil
   "kabuğu". Kartın boyu iki satırı rahat alıyor. */
const HAREKE = /[ً-ْٰ]/g;
const TABAN_PUNTO: Record<Dil, number> = { tr: 20, en: 20, ar: 26 };
const ADIM: Record<Dil, number> = { tr: 0.55, en: 0.55, ar: 0.42 };
const KULLANILABILIR = 84;

function punto(metin: string, dil: Dil | null): string | undefined {
  if (!dil) return undefined;
  const sade = dil === "ar" ? metin.replace(HAREKE, "") : metin;
  const n = Math.max(...sade.split(/\s+/).map((p) => p.length));
  if (!n) return undefined;
  const sigan = KULLANILABILIR / (n * ADIM[dil]);
  return `${Math.min(TABAN_PUNTO[dil], sigan).toFixed(2)}cqw`;
}

/* Çizim için sığ kopya. Oyun mantığı kartları YERİNDE değiştiriyor
   (aşağıya bkz.); React'in değişimi görebilmesi için her çizimde yeni
   nesneler veriliyor. 36 kart, maliyeti yok. */
const kopya = (k: Kart[]) => k.map((x) => ({ ...x }));

/* İstemcide miyiz. `useSyncExternalStore` sunucuda `false`, tarayıcıda
   `true` döner ve bunu bir efekt içinde `setState` çağırmadan yapar
   (proje bu deseni ilerleme kaydında da kullanıyor, bkz. AGENTS.md).

   Neye yarıyor: deste RASTGELE karılıyor, yani sunucunun ürettiği sıra
   ile tarayıcınınki asla tutmaz. Hidrasyon sırasında `false` döndüğü
   için tahta İKİ TARAFTA DA boş çiziliyor, uyuşmazlık hiç doğmuyor;
   kartlar hemen ardından gelen ikinci çizimde beliriyor. */
const bosAbone = () => () => {};

/* Oyunun kendi arayüz metinleri. Kartların üzerindeki KELİMELER
   çevrilmiyor -- oyunun bütün meselesi zaten üç dili yan yana görmek.
   Çeviri yalnızca sayaç, bitiş ekranı ve düğmeler için. */
const UI: Record<
  Language,
  {
    hamle: string;
    tamamlananlar: string;
    kapaliKart: string;
    mustafaKarti: string;
    bitisBaslik: (n: number) => string;
    bitisAlt: (n: number) => string;
    yeniden: string;
    listeyeDon: string;
  }
> = {
  tr: {
    hamle: "Hamle",
    tamamlananlar: "Tamamlanan kelimeler",
    kapaliKart: "Kapalı kart",
    mustafaKarti: "Mustafâ kartı",
    bitisBaslik: (n) => `${n} kelime tamam`,
    bitisAlt: (n) => `${n} hamlede tamamladın.`,
    yeniden: "Yeniden dağıt",
    listeyeDon: "Seviyelere dön",
  },
  ar: {
    hamle: "نقلة",
    tamamlananlar: "الكلمات المكتملة",
    kapaliKart: "بطاقة مغلقة",
    mustafaKarti: "بطاقة مصطفى",
    bitisBaslik: (n) => `اكتملت ${n} كلمات`,
    bitisAlt: (n) => `أتممتها في ${n} نقلة.`,
    yeniden: "وزّع من جديد",
    listeyeDon: "العودة إلى المستويات",
  },
  en: {
    hamle: "Moves",
    tamamlananlar: "Completed words",
    kapaliKart: "Face-down card",
    mustafaKarti: "Mustafâ card",
    bitisBaslik: (n) => `${n} words done`,
    bitisAlt: (n) => `You finished in ${n} moves.`,
    yeniden: "Deal again",
    listeyeDon: "Back to levels",
  },
};

export default function DilAntrenmani({
  kelimeler,
  onListeyeDon,
  onTamamlandi,
}: {
  /* Seviyenin kelime listesi -- tahtaya bunun rastgele altısı çıkıyor
     (bkz. `desteKur`). Seviyeyi `DilAntrenmaniHub` seçiyor,
     oyun hangi seviyede olduğunu bilmiyor. Liste yalnızca İLK kurulumda ve "Yeniden
     dağıt"ta okunuyor, oyun ortasında değişmesi tahtayı yenilemez;
     seviye değişiminde çağıran taraf `key` vermeli. */
  kelimeler: Kelime[];
  /* Bitiş ekranındaki "Seviyelere dön" düğmesi. Verilmezse düğme hiç
     çizilmiyor, yani oyun tek başına da çalışmaya devam eder. */
  onListeyeDon?: () => void;
  /* Seviye GERÇEKTEN bitince bir kez çağrılıyor -- sonraki seviyenin
     kilidini açan tek olay bu. Kutuya girip çıkmak yetmiyor. */
  onTamamlandi?: () => void;
}) {
  const { language } = useLanguage();
  const ui = UI[language];
  const istemci = useSyncExternalStore(
    bosAbone,
    () => true,
    () => false,
  );

  /* OYUNUN DOĞRU DURUMU `kartlarRef`TE, ekrana çizilen ise `kartlar`
     state'inde. İkiye bölünmesinin sebebi akışın zincirleme
     `setTimeout`lardan oluşması (kart çevir → bekle → eşleştir → bekle
     → tahtadan çıkar): her zamanlayıcı O ANKİ diziyi okumak zorunda ve
     tek başına state ile yazılsaydı her adım bayat closure riski
     taşırdı. Ref tek bir doğru kaynak tutuyor, `ciz()` de o kaynağın
     bir fotoğrafını React'e veriyor. Render YALNIZCA state'i okur. */
  const [kartlar, setKartlar] = useState<Kart[]>(() => desteKur(kelimeler));
  const kartlarRef = useRef<Kart[]>([]);
  /* Ref her çizimden sonra state'in son fotoğrafına eşitleniyor. Bu
     yüzden gecikmeli iş yapan her yer kartları İNDEKSLE tutuyor ve her
     seferinde ref'ten yeniden okuyor -- eski nesneleri elde saklamak
     mutasyonun kaybolmasına yol açar. */
  useEffect(() => {
    kartlarRef.current = kartlar;
  }, [kartlar]);

  const seciliRef = useRef<number[]>([]);
  const kilitRef = useRef(false);
  const parlakRef = useRef<HTMLDivElement>(null);
  /* Kurulan her zamanlayıcı burada tutuluyor ve bileşen sökülürken
     temizleniyor. Yoksa sayfa değiştirildikten sonra kalan bir
     `setTimeout` sökülmüş DOM'a dokunmaya çalışır. */
  const zamanlayicilar = useRef<number[]>([]);

  const [hamle, setHamle] = useState(0);
  const [tamam, setTamam] = useState(0);
  const [bitti, setBitti] = useState(false);

  const ciz = useCallback(() => setKartlar(kopya(kartlarRef.current)), []);

  const bekle = useCallback((f: () => void, ms: number) => {
    const id = window.setTimeout(f, ms);
    zamanlayicilar.current.push(id);
  }, []);

  useEffect(() => {
    const kalanlar = zamanlayicilar;
    return () => {
      kalanlar.current.forEach(clearTimeout);
      kalanlar.current = [];
    };
  }, []);

  /* Işıltı halkası ve konfeti. React'e emanet edilmedi -- parçacıklar
     tek seferlik, kendi animasyonu bitince silinen süs; state'e
     alınsaydı her kare için yeniden çizim tetiklerdi. */
  const patlat = useCallback((el: HTMLElement | null) => {
    if (!el || !parlakRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const kok = getComputedStyle(el);
    const renkler = [
      ...NOKTALAR.map((n) => kok.getPropertyValue(n).trim()).filter(Boolean),
      "#EFE7D6",
      "#E3C25C",
    ];
    const r = el.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;

    const halka = document.createElement("span");
    halka.className = s.halka;
    halka.style.left = x + "px";
    halka.style.top = y + "px";
    parlakRef.current.appendChild(halka);
    window.setTimeout(() => halka.remove(), 820);

    for (let i = 0; i < 18; i++) {
      const z = document.createElement("span");
      z.className = s.zerre;
      const aci = Math.random() * Math.PI * 2;
      const uzak = 50 + Math.random() * 100;
      z.style.left = x + "px";
      z.style.top = y + "px";
      z.style.background = renkler[i % renkler.length];
      z.style.setProperty("--dx", (Math.cos(aci) * uzak).toFixed(1) + "px");
      z.style.setProperty("--dy", (Math.sin(aci) * uzak - 32).toFixed(1) + "px");
      z.style.setProperty("--don", (Math.random() * 720 - 360).toFixed(0) + "deg");
      z.style.setProperty("--sure", (900 + Math.random() * 520).toFixed(0) + "ms");
      if (i % 3 === 0) {
        z.style.width = "6px";
        z.style.height = "6px";
        z.style.borderRadius = "50%";
      }
      parlakRef.current.appendChild(z);
      window.setTimeout(() => z.remove(), 1550);
    }
  }, []);

  const patlatIndeks = useCallback(
    (i: number) => patlat(document.getElementById("dil-kart-" + i)),
    [patlat],
  );

  /* Artan jokerleri toplu açıp temizler, sonra bitiş ekranını verir.
     Oyuncu jokerleri hiç kullanmadan on kelimeyi bitirirse tahtada altı
     joker kalır; onları sessizce yok saymak yerine aynı animasyonla
     çıkarıyoruz, tahta boşalarak kapansın. */
  const bitir = useCallback(() => {
    /* Kilidi açan haber BURADA veriliyor, bitiş ekranında değil: bu
       noktada bütün kelime kartları eşleşmiş durumda, geri kalan yalnız
       artan jokerlerin temizlenme animasyonu. Oyuncu o animasyon
       biterken sayfadan çıkarsa da seviye tamamlanmış sayılmalı. */
    onTamamlandi?.();

    const artan = kartlarRef.current
      .map((k, i) => (k.tip === "joker" && !k.bitti ? i : -1))
      .filter((i) => i >= 0);

    if (!artan.length) {
      bekle(() => setBitti(true), 400);
      return;
    }
    artan.forEach((i) => (kartlarRef.current[i].acik = true));
    ciz();
    bekle(() => {
      artan.forEach((i) => {
        kartlarRef.current[i].bitti = true;
        kartlarRef.current[i].eslesti = true;
        patlatIndeks(i);
      });
      ciz();
      bekle(() => {
        artan.forEach((i) => (kartlarRef.current[i].gitti = true));
        ciz();
        setBitti(true);
      }, 720);
    }, 560);
  }, [bekle, ciz, patlatIndeks, onTamamlandi]);

  const eslestir = useCallback(
    (grup: number[]) => {
      grup.forEach((i) => {
        const k = kartlarRef.current[i];
        k.bitti = true;
        k.eslesti = true;
        patlatIndeks(i);
      });
      setTamam((n) => n + 1);
      ciz();
      bekle(() => {
        grup.forEach((i) => (kartlarRef.current[i].gitti = true));
        seciliRef.current = [];
        kilitRef.current = false;
        ciz();
        if (!kartlarRef.current.some((k) => !k.bitti && k.tip === "kelime")) bitir();
      }, 640);
    },
    [bekle, ciz, patlatIndeks, bitir],
  );

  const degerlendir = useCallback(() => {
    kilitRef.current = true;
    setHamle((n) => n + 1);

    const secili = seciliRef.current;
    const sozler = secili.filter((i) => kartlarRef.current[i].tip === "kelime");
    const jokerSayisi = secili.length - sozler.length;
    const idler = new Set(sozler.map((i) => kartlarRef.current[i].kelimeId));
    const dilSayisi = new Set(sozler.map((i) => kartlarRef.current[i].dil)).size;

    let uygun = false;
    let ekler: number[] = [];
    /* Eşleşmenin DÖRT şartı. Kelimeler TEK bir kelimeye ait olacak,
       hepsi AYRI dillerde olacak, eksik kalan dil sayısı elde tutulan
       joker sayısına TAM eşit olacak, ve elde EN FAZLA BİR joker
       olacak.

       Sonuncusu oyunun dengesini tutan şart: iki Mustafâ ile tek bir
       kelime kartı da geçerli sayılsaydı tahta altı hamlede, hiçbir
       kart ezberlenmeden temizlenebilirdi. */
    if (
      sozler.length >= 1 &&
      idler.size === 1 &&
      dilSayisi === sozler.length &&
      jokerSayisi <= 1
    ) {
      const id = kartlarRef.current[sozler[0]].kelimeId;
      const varOlan = sozler.map((i) => kartlarRef.current[i].dil);
      const eksik = DILLER.filter((d) => !varOlan.includes(d));
      ekler = eksik
        .map((d) =>
          kartlarRef.current.findIndex(
            (k) => k.tip === "kelime" && k.kelimeId === id && k.dil === d,
          ),
        )
        .filter((i) => i >= 0);
      uygun = ekler.length === eksik.length && eksik.length === jokerSayisi;
    }

    if (uygun) {
      const grup = [...secili, ...ekler];
      if (ekler.length) {
        /* Joker kullanıldıysa eksik dildeki kart önce AÇILIP gösteriliyor,
           eşleşme animasyonu ancak ondan sonra başlıyor. Oyuncu jokerin
           neyin yerine geçtiğini görmeli. */
        ekler.forEach((i) => (kartlarRef.current[i].acik = true));
        ciz();
        bekle(() => eslestir(grup), 660);
      } else {
        bekle(() => eslestir(grup), 360);
      }
    } else {
      secili.forEach((i) => (kartlarRef.current[i].yanlis = true));
      ciz();
      bekle(() => {
        secili.forEach((i) => {
          const k = kartlarRef.current[i];
          k.yanlis = false;
          k.acik = false;
        });
        seciliRef.current = [];
        kilitRef.current = false;
        ciz();
      }, 900);
    }
  }, [bekle, ciz, eslestir]);

  function tikla(i: number) {
    const k = kartlarRef.current[i];
    if (kilitRef.current || k.acik || k.bitti || seciliRef.current.length === 3) return;
    k.acik = true;
    seciliRef.current.push(i);
    ciz();
    if (seciliRef.current.length === 3) degerlendir();
  }

  /* "Yeniden dağıt". Bir efektten değil, yalnızca düğmeden çağrılıyor;
     ilk deste zaten `useState`in tembel başlatıcısında kuruldu. */
  function yenidenDagit() {
    zamanlayicilar.current.forEach(clearTimeout);
    zamanlayicilar.current = [];
    seciliRef.current = [];
    kilitRef.current = false;
    setHamle(0);
    setTamam(0);
    setBitti(false);
    /* Yeni deste doğrudan state'e veriliyor; ref'i yukarıdaki efekt
       hemen ardından eşitliyor. */
    setKartlar(desteKur(kelimeler));
  }

  return (
    <div className={s.sahne}>
      <div className={s.serit}>
        <div className={s.tally} aria-label={ui.tamamlananlar}>
          {Array.from({ length: KELIME_SAYISI }, (_, i) => (
            <i key={i} className={i < tamam ? s.dolu : undefined} />
          ))}
        </div>
        <p className={s.hamle}>
          {ui.hamle} <b>{hamle}</b>
        </p>
      </div>

      {/* Tahta yalnızca tarayıcıda doluyor; gerekçe `bosAbone`nin
          üstündeki notta. Sunucu ızgarayı boş bırakıyor, ölçüsü
          (6 sütun + oran) CSS'ten geldiği için yerleşim zıplamıyor. */}
      <div className={s.tahta} aria-label="Kart tahtası">
        {istemci &&
          kartlar.map((k, i) => (
            <button
              key={i}
              id={"dil-kart-" + i}
              type="button"
              className={[
                s.kart,
                k.acik ? s.acik : "",
                k.eslesti ? s.eslesti : "",
                k.gitti ? s.gitti : "",
                k.yanlis ? s.yanlis : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={
                {
                  "--nokta": `var(${k.renk})`,
                  "--egim": k.egim,
                } as React.CSSProperties
              }
              disabled={k.bitti}
              aria-label={
                k.acik ? (k.tip === "joker" ? ui.mustafaKarti : k.metin) : ui.kapaliKart
              }
              onClick={() => tikla(i)}
            >
              <span className={s.ic}>
                <span className={`${s.yuz} ${s.arka}`} />
                {k.tip === "joker" ? (
                  <div className={`${s.yuz} ${s.on} ${s.joker}`} data-dil="joker">
                    <figure>
                      {/* Karakter YALNIZCA kart açıkken ve henüz
                          tahtadan çıkmamışken monte ediliyor.
                          `ChromaKeyVideo` örnek başına bir WebGL bağlamı
                          açıyor; altı jokerin altısını birden kurmak
                          gereksiz -- kapalı kartta zaten arka yüz
                          görünüyor (`backface-visibility: hidden`), yani
                          monte edilse de kimse görmezdi. */}
                      {k.acik && !k.gitti && <ChromaKeyVideo src={MUSTAFA_KLIP} />}
                    </figure>
                    <span className={s.dil}>Mustafâ</span>
                  </div>
                ) : (
                  <div className={`${s.yuz} ${s.on}`} data-dil={k.dil}>
                    {/* Punto inline veriliyor: satır içi stil CSS
                        modülündeki `font-size`ı geçersiz kılıyor, yani
                        hesap her kelime için tek yerden çıkıyor. */}
                    <span className={s.kelime} style={{ fontSize: punto(k.metin, k.dil) }}>
                      {k.metin}
                    </span>
                    <span className={s.dil}>
                      <i />
                      {k.dil}
                    </span>
                  </div>
                )}
              </span>
            </button>
          ))}
      </div>

      {/* Konfeti katmanı ve bitiş ekranı `.sahne`nın İÇİNDE duruyor,
          kardeşi değil. Dışarıda dururlarken altın/varak renk
          değişkenleri (`.sahne` üzerinde tanımlı) onlara miras
          kalmıyordu: "Yeniden dağıt" düğmesi zeminsiz, ışıltı halkası
          da yanlış kenarlıkla çiziliyordu. İkisi de `position: fixed`
          ve `.sahne` transform/filter taşımadığı için içeri alınmaları
          konumlarını değiştirmiyor -- hâlâ görünüm alanına göre
          yerleşiyorlar. */}
      <div className={s.parlak} ref={parlakRef} aria-hidden />

      {bitti && (
        <div className={s.bitis} role="dialog" aria-modal="true">
          <div>
            <h2>{ui.bitisBaslik(KELIME_SAYISI)}</h2>
            <p>{ui.bitisAlt(hamle)}</p>
            <div className={s.bitisDugmeler}>
              <button type="button" className={s.yeni} onClick={yenidenDagit}>
                {ui.yeniden}
              </button>
              {onListeyeDon && (
                <button type="button" className={s.ikincil} onClick={onListeyeDon}>
                  {ui.listeyeDon}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
