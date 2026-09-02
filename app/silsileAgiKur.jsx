"use client";

/* SILSILE AGININ CIZIM KODU -- fabrika halinde.

   Cizim katmani <canvas>. 2026-08-30'a kadar SVG idi; sahne React
   ogelerinden kuruluyor ve kaydirmada tarayici agacin tamamini
   yeniden boyuyordu. Tuvalde agac yok: grafik icin DOM'da sifir oge
   var, sahne dogrudan piksel tamponuna ciziliyor.

   BEDELI: haritadaki isimler metin degil piksel -- secilemiyor,
   Ctrl+F bulmuyor, ekran okuyucu gormuyor. Bilgi karti DOM oldugu
   icin kart metni kopyalanabilir. Tiklama hedefi elle kuruluyor
   (bkz. vurusRef / tuvaldaBul). */
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
/* Veri modulunun TAMAMI iceri aliniyor. Secici bir liste uc kez
   eksik cikti (POS, YIL_MAX, useLanguage); kullanilmayan ad zaten
   paketlemede eleniyor, eksik ad ise sayfayi calisma aninda kiriyor. */
/* BILESEN BIR FABRIKADAN URETILIYOR.

   `kur(V)` bir veri modulu alip ondan beslenen bilesen donduruyor.
   Sebep: /ag-sinamasi'nda VERI uzerinde deneme yapiliyor (bilgi
   kartlari Takrib'den dolduruluyor) ve denemenin yayindaki haritayi
   etkilememesi gerekiyor. Iki veri dosyasi var, cizim kodu TEK.

   Bileseni kopyalamak da bir secenekti ama 1400 satir iki yerde
   yasardi ve her duzeltmeyi iki kez uygulamak gerekirdi -- SVG
   surumu son uc gunun butun iyilestirmelerini tam da bu yuzden
   kacirmisti. Fabrika o tuzagi kapatiyor.

   Kullanimi: app/SilsileAgi.jsx (canli) ve app/SilsileAgiSinama.jsx
   (deneme) birer satirlik sarmalayici. */
/* ARAMA ICIN HARF KATLAMA.

   Kullanici "salim" yazinca "Sâlim" cikmiyordu, "firebri" yazinca
   "Firebrî" cikmiyordu (Mustafa, 2026-08-30). Isimler ceviri yazi
   oldugu icin sapkali harflerle dolu ve kimse arama kutusuna sapka
   yazmaz.

   NFD ile ayirip birlesen isaretleri atiyoruz (â -> a, î -> i,
   ū -> u). Turkce'ye ozgu olanlar ayri ele aliniyor cunku onlar
   birlesen isaret degil, tek kod noktasi (ı, ş, ğ). Ayrica ceviri
   yazidaki kesme ve ayin/hemze isaretleri (‘ ’ ʿ ʾ) atiliyor.

   TURKCE KUCUK HARF TUZAGI: "I".toLowerCase() dilden dile degisiyor.
   Once katlayip sonra kucultuyoruz, boylece sonuc dilden bagimsiz.

   Arapca tarafta da elif/ya/te merbuta cesitleri birlestiriliyor ki
   "عبد الله" ile "عبد اللّه" ayni sayilsin. */
const KATLA_TR = { "ı": "i", "İ": "i", "ş": "s", "Ş": "s", "ğ": "g", "Ğ": "g",
                   "ç": "c", "Ç": "c", "ö": "o", "Ö": "o", "ü": "u", "Ü": "u" };
function katla(s) {
  return (s || "")
    .replace(/[ıİşŞğĞçÇöÖüÜ]/g, (c) => KATLA_TR[c])
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[‘’ʿʾ'`´]/g, "")
    .replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/[ً-ْـ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ").trim();
}

export function kur(V) {
  const {
    ALT, ASGARI_DY, BANT, BELDELER, BELDE_AD, DERECE, DIA, DIS, E, EDGES,
    EKRAN_PUNTO, EKRAN_R_ARTIS, EN_AZ_EKRAN_R, ESIK, H: HAM_H, HULEFA,
    ING_HARF, ING_SOZLUK, KADEME, KART_TAVAN, KAVIS,
    KAVIS_OLCEK: HAM_KAVIS_OLCEK, KUME_EN_AZ, MEDAR, MEDINE, MUELLIF,
    MUKSIRUN, N, NEBI_RENK, NODES, NOT_DIL, PALET, POS: HAM_POS, R_TAVAN,
    SATIRLAR, SATIR_YIL, SERIT_W, SOL_BANT, SOL_PAY,
    SUTUNLAR: HAM_SUTUNLAR, TAB, TAHMIN, UST, UST_BANT, W: HAM_W, YILLAR,
    YIL_EKI, YIL_MAX, YIL_MIN, buyuk, dagit, ek, ingAd, miladiKestirim,
    rEkranOf, rOf, renkOf, salSayi, tahminiYil, tarihYaz, veriyiDenetle,
    yOf: HAM_yOf
  } = V;


  /* YERLESIM BU SAYFADA DORT KAT SEYREK.

     Yalnizca ARALIKLAR buyuyor: nokta yaricaplari ve yazi puntolari
     ekranda oldugu gibi kaliyor. Aciliste butun ag yine ekrana
     sigdirildigi icin olcek ayni oranda iniyor; noktalarin kucumesin
     diye yaricap hesabina `k * YAY` veriliyor, boylece ekrandaki boy
     degismiyor ama iki nokta arasindaki mesafe YAY kati aciliyor.
     Kullanicinin istedigi seyreltme bu.

     2026-09-02'de 2'den 4'e cikarildi (Mustafa: "genislik ve
     yuksekligi 2 katina cikar ki noktalar arasi bosluk artsin").
     Tuval W ve H'si iki katina ciktı, nokta ve yazi boyu degismedi.

     Olceklenenler: konumlar, sutun seritleri, tuval boyu, yil ekseni
     ve kavis buyuklugu. Kavis de olcekleniyor, yoksa egriler
     duzlesirdi. Kenar ucundaki bosluk da (bkz. kenarKubik) grafik
     birimi oldugu icin olcekleniyor.

     DEGISIKLIK YALNIZCA BU DOSYADA. Yerlesim sabitleri paylasilan
     app/silsileVeri.js icinde ve orayi degistirmek yayindaki SVG
     sayfasini da degistirirdi. */
  const YAY = 4;
  /* Acilis yakinligi: sigdirma olceginin kac kati. Buyudukce daha
     yakindan baslar. YAY ile carpilmasi sart, yoksa seyreltme acilisi
     da kucultur ve birbirlerini gotururler. 12 * YAY fazla yakindi --
     fazla yakindi. Mustafa'nin verdigi ekran goruntulerinde yil
     ekseni yilda ~24,4 piksel; olculen deger 12 * YAY iken 39,4 idi,
     yani 1,6 kat fazla yakin. 5,25 * YAY o oranı veriyor. */
  const ACILIS_YAKINLIK = 5.25 * YAY;
  const POS = Object.fromEntries(Object.entries(HAM_POS)
    .map(([id, p]) => [id, { x: p.x * YAY, y: p.y * YAY }]));
  const SUTUNLAR = HAM_SUTUNLAR.map((c) => ({ ...c, x: c.x * YAY, genislik: c.genislik * YAY }));
  const W = HAM_W * YAY;
  const H = HAM_H * YAY;
  const yOf = (yil) => HAM_yOf(yil) * YAY;
  const KAVIS_OLCEK = HAM_KAVIS_OLCEK * YAY;

  /* Etiketin arkasindaki halenin kalinligi, punto'nun kati. Tek yerden
     ayarlanabilsin diye burada: ad ve tarih ayni degeri kullaniyor. */
  const HALE_KALINLIK = 0.14;

  /* Akan kesik cizginin hizi, saniyede piksel. Kesik deseni 14+8=22
     piksel, yani saniyede bir turun biraz uzerinde. Iki kez
     yarilandi (100 -> 50 -> 25); ilk degerler gozu yoruyordu. */
  const AKIS_HIZ = 25;

  return function SilsileAgi() {
    const [secim, setSecim] = useState(null);   // {tur:"ravi",id} | {tur:"kenar",e}
    const [arama, setArama] = useState("");
    const [acikArama, setAcikArama] = useState(false);
    const [view, setView] = useState({ x: 0, y: 0, k: 0.4 });
    const [suruk, setSuruk] = useState(null);
    /* HOVER JS'TE TUTULMUYOR. Eskiden `uzerinde` diye bir state vardi:
       imlec bir dugumun uzerine gelince o dugum buyuyor ve kenarlari akan
       kesik cizgiye donusuyordu. Bedeli agirdi -- `uzerinde` ag govdesini
       donduran useMemo'nun bagimliliklarindaydi, yani FARE HER DUGUMUN
       USTUNDEN GECTIGINDE 4700 SVG elemani bastan kuruluyordu. Bilgisayarin
       fani bundan calisiyordu (Mustafa, 2026-08-29).
  
       Yerine: vurgu artik yalnizca TIKLAMAYLA (secim) geliyor; imlecin
       uzerinde oldugu dugum ise saf CSS ile isaretleniyor
       (`.dugum:hover circle.ana`, asagidaki stil blogu) -- React'in
       hicbir sey yeniden cizmesine gerek kalmadan. */
    const [acildi, setAcildi] = useState(false);
    const tweenRef = useRef(null);
    /* `tasindi` REF, state degil. Iki sebep: (1) hicbir yerde
       cizilmiyor, yalnizca "bu bir dokunus muydu yoksa surukleme mi"
       sorusuna cevap veriyor -- state olmasi her surukleme basinda bir
       yeniden cizim demekti; (2) asagida ag'in govdesi useMemo ile
       dondurulunun icinde kalan olay isleyicileri ESKI bir state
       degerini gorurdu, ref her zaman guncel. */
    const tasindiRef = useRef(false);
    const { t, language } = useLanguage();
    const { theme } = useTheme();
    const koyu = theme === "dark";
  
    /* KARANLIK MOD DENEMESI (2026-08-29).
  
       Artifact tek bir acik palete gore yazilmisti; renkler koda gomulu
       onlarca sabitti. Hepsi buraya toplandi ve koyu icin bir esi
       yazildi. RAVI NOKTALARININ RENKLERI DEGISMIYOR -- onlar ayirt
       etmeye yariyor ve iki zeminde de okunuyor; degistirmek 24 tonu
       yeniden dengelemek olurdu.
  
       Koyu paletin mantigi: kagit yerine murekkep. Zemin sicak bir
       koyu kahve (siyah degil -- siyah zeminde renkli noktalar
       titriyor), yazi kirik beyaz, bantlar ayni iki ton ama daha
       dusuk saydamlikta, kenarlar aciga cekildi cunku koyu zeminde
       koyu cizgi kayboluyor. */
    const C = koyu ? {
      zemin: "#1C1A17", tuval: "#232019", kart: "rgba(35,32,25,0.97)",
      cizgi: "#4A4438", ink: "#EDE7DA", solukInk: "#A79E8C", vurguInk: "#D9C77A",
      kenar: "#8A7F55", kenarSonuk: "#5A5340", kenarSecili: "#E0785A",
      okSonuk: "#4A4433", dugumCerceve: "#232019", etiketHale: "#1C1A17",
      etiketAna: "#EDE7DA", etiketAlt: "#8F8878", sonucVurgu: "#2E2A22",
      kesikCerceve: "#4A4438",
      /* KOYU MODDA DAMA RENK DEGIL ISIK FARKI. Acik modda iki ton
         (altin/yesil) cok soluk oldugu icin kagit gibi duruyor; koyu
         zeminde ayni tonlar renkli bir sis yapip rahatsiz ediyordu
         (Mustafa, 2026-08-29). Burada iki bant da BEYAZ, yalnizca
         saydamliklari farkli -- yani dama bir aydinlik basamagi.
         Renksiz oldugu icin ravi noktalarinin rengiyle yarismiyor. */
      /* Akan kenarlar Hz. Peygamber'in noktasinin rengini aliyor
         (NEBI_RENK, #80D7C1). Onceden altin-zeytin bir tondu ve
         zeminin kendi sarisiyla ayni ailedendi, hareket ederken goz
         yoruyordu (Mustafa, 2026-08-30). Turkuaz zeminde hicbir seyle
         karismiyor ve vurguyu rivayetin kaynagina bagliyor.
         Ok uclari ayni aileden bir tik koyu. */
      kenarCanli: "#80D7C1", okVurgu: "#4FB39C",
      damaA: "#FFFFFF", damaAOp: 0.040, damaB: "#FFFFFF", damaBOp: 0.014,
      satirA: "#FFFFFF", satirAOp: 0.030, satirB: "#FFFFFF", satirBOp: 0.010,
    } : {
      zemin: "#FBF9F4", tuval: "#FFFFFF", kart: "rgba(255,255,255,0.97)",
      cizgi: "#D8D0BF", ink: "#23201B", solukInk: "#8C8676", vurguInk: "#8A7A34",
      kenar: "#6F6438", kenarSonuk: "#B3A88E", kenarSecili: "#B5462B",
      okSonuk: "#C9BFA8", dugumCerceve: "white", etiketHale: "#FFFFFF",
      etiketAna: "#2B2721", etiketAlt: "#8C8676", sonucVurgu: "#F5F1E6",
      kesikCerceve: "#E0D8C6",
      // Acik temada ayni turkuaz krem zemin uzerinde okunacak kadar koyu.
      kenarCanli: "#2E9483", okVurgu: "#1F7767",
      damaA: "#8A7A34", damaAOp: 0.05, damaB: "#2E7D6E", damaBOp: 0.026,
      satirA: "#8A7A34", satirAOp: 0.055, satirB: "#2E7D6E", satirBOp: 0.028,
    };
  
    /* RAVI ADI DILE GORE. Arapca'da dugumun kendi `ar` alani, digerinde
       `tr`. Ingilizce icin AYRI BIR AD YOK: 570 ismin latinize
       karsiligini yazmak ayri bir is ve Mustafa ceviri yazi istemiyor;
       Ingilizce'de Turkce latinizasyon kullaniliyor -- hadis
       literaturunde zaten alisildik bir cozum. Arayuz metinleri uc dilde
       (bkz. translations.ts, ag* anahtarlari). */
    const adi = useCallback(
      (n) => (language === "ar" ? n.ar : language === "en" ? ingAd(n.tr) : n.tr),
      [language],
    );
    /* Belde adi da dile bagli. Sutun basliklarinda buyuk harfe
       ceviriliyor, kartta oldugu gibi. */
    const beldeAdi = useCallback((b) => BELDE_AD[language]?.[b] ?? b, [language]);
    const TAB_AD = useMemo(() => [t.agTabaka0, t.agTabaka1, t.agTabaka2,
      t.agTabaka3, t.agTabaka4, t.agTabaka5, t.agTabaka6], [t]);
    // Medar tabakalari (I: mudevvinler, II: musannifler, III: munekkit
    // ve fakih muhaddisler). Anahtarlar 1-3, MEDAR degerleriyle ayni.
    const MEDAR_AD = useMemo(() => ({ 1: t.agMedar1, 2: t.agMedar2, 3: t.agMedar3 }), [t]);
  
    const boxRef = useRef(null);
    /* Ekrandaki parmaklarin (ve farenin) defteri: pointerId -> {x,y}.
       Kiskac (iki parmakla yakinlastirma) basladiginda baslangic
       mesafesi/merkezi ve o andaki görünüm burada saklaniyor. Ikisi de
       ref, state degil: her parmak kimildadiginda yeniden cizim
       gerekmiyor, yalnizca gorunum degisirse gerekiyor. */
    const isaretler = useRef(new Map());
    const kiskac = useRef(null);
    /* Suruklemede sayfaya devredilen toplam mesafe (bkz. pointerKimilda).
       Her yeni suruklemede sifirlaniyor. */
    const artanRef = useRef(0);
    /* Suruklemede parmagin dikey toplam yer degistirmesi, bir onceki
       kimildamada okunmus hali. Sayfayi geri sararken ARTISI bulmak
       icin gerekiyor (bkz. pointerKimilda). */
    const sayfaDyRef = useRef(0);
    /* Kapsayicinin olculeri. SIFIRDAN basliyor, bir tahminden degil:
       acilis gorunumu (bkz. `baslangic`) bir kez kuruluyor ve "hic
       olculmedi" halini tanimasi gerekiyor. Eskiden burada {1000, 640}
       yaziyordu; bu gecerli bir olcum gibi gorundugu icin acilis o
       uydurma boya gore kuruluyor, gercek olcum gelince bir daha
       duzelmiyordu. Telefonda sonuc: yanlis olcek ve Medine sutunu
       ortalanacagi yerde ekranin disinda kaliyordu (olculdu). */
    const [box, setBox] = useState({ w: 0, h: 0 });
  
    /* Dar ekran esigi. Kontrol kutulari ve bilgi karti bu esigin altinda
       farkli diziliyor (bkz. asagisi): telefonda ikisi yan yana
       sigmiyor. 640, tabletin dikey genisliginin altinda, telefonun
       ustunde. */
    const dar = box.w < 640;
  
    useEffect(() => {
      const el = boxRef.current;
      if (!el) return;
      const ol = () => {
        const r = el.getBoundingClientRect();
        setBox((ö) => (Math.abs(ö.w - r.width) < 0.5 && Math.abs(ö.h - r.height) < 0.5
          ? ö : { w: r.width, h: r.height }));
      };
      ol();
      // pencere boyutu değişmeden panel yeniden boyutlanabildiği için
      // doğrudan kapsayıcıyı izliyoruz
      const go = typeof ResizeObserver !== "undefined" ? new ResizeObserver(ol) : null;
      if (go) go.observe(el);
      window.addEventListener("resize", ol);
      return () => {
        if (go) go.disconnect();
        window.removeEventListener("resize", ol);
      };
    }, []);
  
    // Kaydırmayı sınırla: tuval kenarlarında boş beyaz alan görünmesin.
    const sinirla = useCallback((v) => {
      const gw = box.w - SOL_BANT, gh = box.h - UST_BANT;
      const cw = W * v.k, ch = H * v.k;
      let x = v.x, y = v.y;
      // Kenar payları. Etiketler düğümün altına yazıldığı için alt pay daha büyük.
      /* ALT PAY: agin en altindaki isimler de goruntuye girebilsin.

         190 piksel yetmiyordu. Ekranin alt seridinde arama kumesi ve
         -- bir ravi secilince -- bilgi karti duruyor; dar ekranda kart
         tam genislik ve kume onun ustune cikiyor, ikisi birlikte
         ucyuz pikselden fazla yer kapliyor. Sonuc: son tabakanin
         noktalari kartin ardinda kaliyor ve asagi kaydirilsa bile
         hicbir zaman goruntuye girmiyordu (Mustafa, 2026-08-30).

         Taban 260'a cikarildi, secim varken karta yer acmak icin
         dar ekranda 320, genis ekranda 190 daha ekleniyor -- genis
         ekranda kart yalnizca yarim genislik kapliyor, o yuzden daha
         az pay yetiyor.

         Payi buyutmek gorunumu ZIPLATMIYOR: alt sinir daha musamahakar
         hale geliyor, mevcut konum her zaman yeni sinirin icinde
         kaliyor. */
      const YAN = 130, UST_PAY = 70;
      const ALT_PAY = 260 + (secim ? (dar ? 320 : 190) : 0);
      if (cw >= gw) x = Math.min(SOL_BANT + YAN, Math.max(box.w - cw - YAN, x));
      else x = SOL_BANT + (gw - cw) / 2;
      if (ch >= gh) y = Math.min(UST_BANT + UST_PAY, Math.max(box.h - ch - ALT_PAY, y));
      else y = Math.min(UST_BANT + (gh - ch) / 2, UST_BANT + UST_PAY);
      return { k: v.k, x, y };
    }, [box, secim, dar]);
  
    const gitView = useCallback((v) => setView(sinirla(v)), [sinirla]);
  
    /* Yumuşak kamera geçişi. Ani sıçrama yerine kısa bir yumuşatma
       eğrisiyle kaydırılır; sürüklerken devreye girmez. */
    const kaydir = useCallback((hedef, sure = 520) => {
      if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
      const son = sinirla(hedef);
      const bas = { ...view };
      const t0 = performance.now();
      const yumusat = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const adim = (an) => {
        const t = Math.min(1, (an - t0) / sure);
        const e = yumusat(t);
        setView({
          k: bas.k + (son.k - bas.k) * e,
          x: bas.x + (son.x - bas.x) * e,
          y: bas.y + (son.y - bas.y) * e,
        });
        if (t < 1) tweenRef.current = requestAnimationFrame(adim);
      };
      tweenRef.current = requestAnimationFrame(adim);
    }, [view, sinirla]);
  
    // açılış animasyonu için bayrak
    useEffect(() => {
      const z = setTimeout(() => setAcildi(true), 2200);
      return () => clearTimeout(z);
    }, []);
  
    /* Tuvalin görüş alanını doldurabileceği en küçük ölçek.
  
       POZITIF TABAN sart: kapsayici henuz olculmemisse (gizli sekme,
       kapali panel, ilk kare) genislik ve yukseklik 0 gelir, band
       paylari cikinca oranlar EKSIYE duser ve `scale(-0.0008)` gibi bir
       donusum ag'i aynalar. Olculdu, gercekten oluyor. */
    const enAzOlcek = useCallback(
      () => Math.max(1e-4, Math.min((box.w - SOL_BANT) / W, (box.h - UST_BANT) / H)),
      [box]
    );
  
  
    /* Acilis gorunumu: HZ. PEYGAMBER'E ODAKLI.
  
       Eskiden ag'in tamami sigdiriliyordu; o gorunumde her sey birkac
       piksellik bir kutle olarak duruyor ve sayfa "ne oldugu belirsiz
       bir yumak" izlenimi veriyordu. Rivayetin kaynagi tuvalin en
       ustunde ve ortasinda; oradan baslamak hem ag'in okunma yonunu
       (yukaridan asagi, kaynaktan talebeye) hem de olceginin ne
       oldugunu gosteriyor. "Tamami" dugmesi bir tikla eski gorunumu
       veriyor.
  
       Olcek: ag'in tamamini sigdiran olcegin 12 kati, ama %8'i
       gecmiyor. Tek bir sabit sayi vermek yerine sigdirma olcegine
       baglanmasinin sebebi, cok kucuk ve cok buyuk kapsayicilarda ayni
       "yakinlik hissini" korumak. */
    const baslangic = useCallback(() => {
      const yatay = (box.w - SOL_BANT) / W, dikey = (box.h - UST_BANT) / H;
      /* Olcek POZITIF bir tabana bagli, tipki enAzOlcek gibi. Taban
         olmadan sivri bir olcum -- kapsayici bir an cok kisa olursa --
         eksi bir olcek uretiyor ve acilis gorunumu bir kez kuruldugu
         icin bu kaliciya biniyordu. */
      const kSigdir = Math.max(1e-4, Math.min(yatay, dikey));
      // Yakinlik ACILIS_YAKINLIK sabitinde, sebebiyle birlikte.
      const k = Math.min(kSigdir * ACILIS_YAKINLIK, 0.08);
      const nebi = POS["nebi"];
      return sinirla({
        k,
        x: (box.w + SOL_BANT) / 2 - nebi.x * k,
        /* Dikeyde ortalanmiyor: Hz. Peygamber tuvalin en ustunde, ustunde
           gosterilecek bir sey yok. sinirla zaten ust kenara yasliyor,
           boylece altta ilk tabakalar goruntuye giriyor. */
        y: UST_BANT + 40 - nebi.y * k,
      });
    }, [box, sinirla]);
  
    /* Kapsayici GERCEKTEN olculdu mu.
  
       Iki isi var. Birincisi: olculmeden once `view` baslangic
       degerinde (%40) duruyor ve o olcekte tuvalin bos bir kosesi
       ekrani kapliyor -- sayfa acilirken bir an bos beyaz goruntu
       cikiyordu; ag ancak bu bayrak dogruyken ciziliyor. Ikincisi:
       acilis gorunumu bir KEZ kuruldugu icin sivri bir olcumun (panel
       gizlenip acilirken olusan cok kisa/dar kapsayici) kaliciya
       binmesini engelliyor. Bu yuzden esik sifir degil, bantlarin 80
       piksel ustu. */
    const olculdu = box.w >= SOL_BANT + 80 && box.h >= UST_BANT + 80;
  
    /* Acilis gorunumu BIR KEZ kuruluyor, kapsayici her olculdugunde
       degil. Eskiden bu etki `box` her degistiginde gorunumu sifirdan
       kuruyordu: telefon yan cevrilince ya da adres cubugu girip
       cikinca kullanicinin geldigi yer siliniyor, ag basa donuyordu.
       Sonraki olcumlerde yalnizca sinirlar tazeleniyor -- kucuklen
       ekranda ag'in kenarda bosluk birakmasi boyle onleniyor. */
    const kuruldu = useRef(false);
    useEffect(() => {
      /* Sivri olcumleri ELE: yalnizca 0x0 degil, bir an olusan cok
         kisa/dar kapsayici da gercek bir olcum sayilmiyor. Acilis
         gorunumu bir kez kuruldugu icin boyle bir olcum kaliciya
         binerdi (olculdu: gizlenip acilan panelde oluyor). */
      if (!olculdu) return;
      if (kuruldu.current) { setView((o) => sinirla(o)); return; }
      kuruldu.current = true;
      setView(baslangic());
    }, [box, olculdu, baslangic, sinirla]);
  
    const sonuclar = useMemo(() => {
      const q = katla(arama);
      if (!q) return [];
      /* Uc ad da taraniyor: Turkce, Arapca ve GORUNEN ad. Sonuncusu
         onemli -- Ingilizce moddayken listede "Malik b. Anas" yaziyor
         ve kullanici onu arar, oysa n.tr "Mâlik b. Enes". */
      return NODES.filter((n) => katla(n.tr).includes(q) ||
                                 katla(n.ar).includes(q) ||
                                 katla(adi(n)).includes(q))
        .sort((a, b) => (a.olum ?? 999) - (b.olum ?? 999));
    }, [arama, adi]);
  
    const eslesen = useMemo(
      () => (arama.trim() ? new Set(sonuclar.map((n) => n.id)) : null),
      [arama, sonuclar]
    );
  
    const vurgu = useMemo(() => {
      if (!secim) return null;
      if (secim.tur === "kenar") return new Set([secim.e.a, secim.e.b]);
      const s = new Set([secim.id]);
      EDGES.forEach((e) => { if (e.a === secim.id) s.add(e.b); if (e.b === secim.id) s.add(e.a); });
      return s;
    }, [secim]);
  
    const sonuk = (id) => (vurgu ? !vurgu.has(id) : eslesen ? !eslesen.has(id) : false);
    const kenarSonuk = (e) => {
      if (secim && secim.tur === "kenar") return !(secim.e.a === e.a && secim.e.b === e.b);
      if (vurgu) return !(vurgu.has(e.a) && vurgu.has(e.b));
      return false;
    };
  
    /* TEKERLEK. Ucu birden:
         ctrl (ya da Mac'te cmd) + tekerlek -> yakinlastir/uzaklastir
         duz tekerlek                       -> yukari/asagi kaydir
         shift + tekerlek                   -> saga/sola kaydir
       Eskiden duz tekerlek yakinlastiriyordu; harita disindaki hicbir
       arayuz boyle davranmadigi icin degistirildi (Mustafa, 2026-08-29).
  
       SAYFA KAYDIRMASINA YOL VERME: ag dikeyde son sinirina dayanmissa
       ve kullanici hala asagi kaydiriyorsa olayi ENGELLEMIYORUZ -- o
       zaman sayfa kayiyor ve altta duran footer goruntuye giriyor.
       Bu olmadan ag tekerlegi bastan sona yutar, footer'a hic
       ulasilamazdi.
  
       Isleyici REACT'IN onWheel'i DEGIL, elle baglanan bir olay
       dinleyicisi (asagidaki effect). Sebep: React 17'den beri wheel
       kok kapsayiciya PASIF baglaniyor ve pasif bir dinleyicide
       preventDefault sessizce hicbir sey yapmiyor -- sayfa `fixed`
       oldugu surece fark edilmiyordu, footer eklenince edilir. */
    const tekerlek = useCallback((ev) => {
      // kontrol kutulari ve bilgi karti kendi kaydirmasini yapsin
      if (ev.target.closest && ev.target.closest("[data-ustlik]")) return;
      const r = boxRef.current.getBoundingClientRect();
  
      if (ev.ctrlKey || ev.metaKey) {
        ev.preventDefault();
        const mx = ev.clientX - r.left, my = ev.clientY - r.top;
        const asgari = enAzOlcek();
        const yeni = Math.max(asgari, Math.min(4, view.k * (ev.deltaY < 0 ? 1.13 : 1 / 1.13)));
        gitView({ k: yeni, x: mx - ((mx - view.x) / view.k) * yeni, y: my - ((my - view.y) / view.k) * yeni });
        return;
      }
  
      if (ev.shiftKey) {
        ev.preventDefault();
        // bazi fareler shift ile deltaX uretir, bazilari deltaY'de birakir
        const dx = ev.deltaX || ev.deltaY;
        gitView({ ...view, x: view.x - dx });
        return;
      }
  
      /* DOKUNMATIK YUZEYDE IKI PARMAK YATAY DA URETIR.
  
         Yukaridaki shift dali fareler icin: cogu fare yatay tekerlek
         tasimadigindan yatay kaydirmayi shift ile veriyor. Dizustunde
         ise iki parmagi yana kaydirmak dogrudan `deltaX` uretiyor ve
         hicbir tus basili degil. Eskiden bu dal yalnizca `deltaY`yi
         okudugu icin yana kaydirma tamamen yok sayiliyordu (Mustafa,
         2026-08-30). Simdi iki eksen birlikte uygulaniyor, capraz
         hareket de dogal calisiyor. */
      const dx = ev.deltaX || 0, dy = ev.deltaY || 0;
  
      /* Sayfaya devretme kurallari YALNIZCA DIKEYI ilgilendiriyor.
         Agirlikli olarak yatay bir harekette sayfa kaydirilmamali,
         yoksa yana kaydirirken footer aciliyor. */
      const dikeyBaskin = Math.abs(dy) > Math.abs(dx);
      if (dikeyBaskin && dy < 0 && window.scrollY > 0) return;
  
      const hedef = { ...view, x: view.x - dx, y: view.y - dy };
      const sonuc = sinirla(hedef);
      const kimildadi = Math.abs(sonuc.x - view.x) > 0.5 ||
                        Math.abs(sonuc.y - view.y) > 0.5;
      // sinir yuzunden hic kimildamadiysak tekerlek sayfaya kalsin
      if (!kimildadi && dikeyBaskin && dy > 0) return;
      ev.preventDefault();
      setView(sonuc);
    }, [view, sinirla, gitView, enAzOlcek]);
  
    useEffect(() => {
      const el = boxRef.current;
      if (!el) return;
      el.addEventListener("wheel", tekerlek, { passive: false });
      return () => el.removeEventListener("wheel", tekerlek);
    }, [tekerlek]);
  
    /* ---------- imlec/parmak isleyicileri ----------
  
       Fare olaylari (onMouseDown/Move/Up) yerine POINTER olaylari
       kullaniliyor. Sebep: fare olaylari telefonda yok. Parmak
       `touchstart/move/end` uretir; tarayici bunlardan yalnizca TEK
       DOKUNUS icin sahte fare olaylari turetir, SURUKLEME icin turetmez.
       Yani eski surumde telefonda isme dokunmak calisiyor, agi
       kaydirmak calismiyordu. Pointer olaylari fareyi, parmagi ve kalemi
       tek arayuzde birlestirdigi icin ikisi de tek kod yoluyla
       karsilaniyor.
  
       setPointerCapture BILEREK kullanilmiyor: yakalama sonraki butun
       olaylari tuvale yonlendirir, dugumlerin ve kenarlarin kendi
       `onPointerUp`'i hic calismaz, yani isme dokunup odaklanmak
       bozulurdu. Yakalama olmayinca imlec tuvalden cikarsa surukleme
       birakiliyor -- eski `onMouseLeave` davranisinin aynisi. */
    const pointerBirak = (e) => {
      isaretler.current.delete(e.pointerId);
      if (isaretler.current.size < 2) kiskac.current = null;
      if (isaretler.current.size === 0) setSuruk(null);
    };
  
    const pointerBas = (e) => {
      isaretler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (isaretler.current.size === 1) {
        setSuruk({ mx: e.clientX, my: e.clientY, vx: view.x, vy: view.y });
        artanRef.current = 0;
        sayfaDyRef.current = 0;
        tasindiRef.current = false;
        return;
      }
      if (isaretler.current.size === 2) {
        /* Ikinci parmak indi: kaydirmayi birak, kiskaci baslat. Baslangic
           mesafesi ve merkezi SABITLENIYOR; her karede bir oncekiyle
           degil, basla karsilastirmak birikimli yuvarlama hatasini
           onluyor. `tasindi` isaretleniyor ki iki parmak kaldirilinca
           "bos yere dokundu" sayilip secim kapanmasin. */
        const [a, b] = [...isaretler.current.values()];
        const r = boxRef.current.getBoundingClientRect();
        kiskac.current = {
          mesafe: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
          mx: (a.x + b.x) / 2 - r.left,
          my: (a.y + b.y) / 2 - r.top,
          view: { ...view },
        };
        setSuruk(null);
        tasindiRef.current = true;
      }
    };
  
    const pointerKimilda = (e) => {
      // Defterde olmayan bir imlec: basma olayi yutulmustu (ornegin arama
      // kutusunda basladi). Tuvali oynatmiyoruz.
      if (!isaretler.current.has(e.pointerId)) return;
      isaretler.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  
      if (kiskac.current && isaretler.current.size >= 2) {
        const [a, b] = [...isaretler.current.values()];
        const bas = kiskac.current;
        const oran = Math.hypot(a.x - b.x, a.y - b.y) / bas.mesafe;
        const k = Math.max(enAzOlcek(), Math.min(4, bas.view.k * oran));
        // iki parmagin ortasi hangi noktayi tutuyorsa orada kalsin
        gitView({
          k,
          x: bas.mx - ((bas.mx - bas.view.x) / bas.view.k) * k,
          y: bas.my - ((bas.my - bas.view.y) / bas.view.k) * k,
        });
        return;
      }
  
      if (!suruk) return;
      const dx = e.clientX - suruk.mx, dy = e.clientY - suruk.my;
      if (Math.abs(dx) + Math.abs(dy) > 4) tasindiRef.current = true;
  
      /* SAYFA KAYDIRMASINA YOL VERME -- dokunmanin karsiligi.
  
         Masaustunde bunu tekerlek isleyicisi yapiyor: ag sinira
         dayaninca olayi engellemiyoruz, sayfa kayiyor ve footer
         gelip gidiyor. TELEFONDA ayni is kendiliginden olmuyor,
         cunku tuval `touchAction: none` tasiyor -- tarayici parmak
         hareketini kaydirma icin hic degerlendirmiyor (bu bilerek:
         olmazsa ag surukleneMEZ). Sonuc: footer bir kez cikinca geri
         gitmiyordu (Mustafa, 2026-08-29).
  
         Cozum, artan mesafeyi ELLE sayfaya devretmek: istenen konum ile
         sinirlanmis konum arasindaki fark kadar sayfa kaydiriliyor.
         Isaret ters: icerik yukari giderse (ag'da asagi inersek) sayfa
         asagi kayar.
  
         FARK, TOPLAM DEGIL. `artan` surukleme baslangicindan olculuyor
         ve parmak sinirin otesinde kaldigi surece BUYUYOR; her
         kimildamada onu oldugu gibi uygulamak sayfayi her karede giderek
         daha cok kaydiriyordu. Ekranda titreme/sicrama olarak
         goruluyordu (Mustafa, 2026-08-29). Bir onceki artan ref'te
         tutuluyor, sayfaya yalnizca ARADAKI FARK veriliyor. */
      /* FOOTER ACIKKEN ONCE SAYFAYI GERI SAR -- masaustundeki kuralin
         dokunmadaki karsiligi.
  
         Tekerlek isleyicisinde su var: yukari cevrildiginde ve sayfa
         asagi kaymissa ag'a hic dokunulmuyor, once sayfa tepeye
         donuyor (bkz. tekerlek). Telefonda bunun aynasi yoktu; footer
         gorunur haldeyken parmagi asagi cekmek ag'i kaydiriyor, footer
         ekranda asili kaliyordu (Mustafa, 2026-08-30).
  
         Parmagin ASAGI gitmesi (dy artiyor) icerigin asagi kaymasi,
         yani sayfada yukari cikmak demek -- tekerlegin yukari
         cevrilmesiyle ayni sey. Toplam degil ARTIS uygulaniyor; toplami
         her karede uygulamak sayfayi giderek daha cok kaydirir ve
         titremeye yol acar (ayni hata artanRef'te bir kez yapildi). */
      if (window.scrollY > 0) {
        const artis = dy - sayfaDyRef.current;
        sayfaDyRef.current = dy;
        if (artis > 0) { window.scrollBy(0, -artis); return; }
      } else {
        sayfaDyRef.current = dy;
      }
  
      const istenen = { ...view, x: suruk.vx + dx, y: suruk.vy + dy };
      const sonuc = sinirla(istenen);
      const artan = istenen.y - sonuc.y;
      const fark = artan - artanRef.current;
      if (Math.abs(fark) > 0.5) { window.scrollBy(0, -fark); artanRef.current = artan; }
      setView(sonuc);
    };
  
  
    /* Bir raviye tiklanmasi. OLCEK DEGISMIYOR -- kamera yalnizca o
       noktayi ortaya aliyor. Eskiden `Math.max(view.k, 0.9)` ile
       yakinlasiyordu ve nokta ekrani kaplayacak kadar buyuyordu; istenen
       bu degildi (Mustafa, 2026-08-29).
  
       Ortalama KALIYOR: bu islev arama sonucundan da cagriliyor, bir
       isim arayip secince kamera hic kimildamazsa arama iseyaramaz hale
       gelir. */
    const odaklan = (id) => {
      if (secim && secim.tur === "ravi" && secim.id === id) { setSecim(null); return; }
      setSecim({ tur: "ravi", id });
      const p = POS[id];
      const k = view.k;
      /* Dikeyde tam ORTA degil: dar ekranda bilgi karti alt seridi
         kapliyor ve secilen ravi kartin ardinda kaliyordu (Mustafa,
         2026-08-30). Kart 130 px + pay, arama kumesi de ustunde; geriye
         kalan bos alanin ortasi yaklasik %35'e denk geliyor.
  
         Genis ekranda da tam orta DEGIL, %42. Kart orada yalnizca yarim
         genislik kapliyor ama yine de alt seride oturuyor; secilen ravi
         biraz yukarida dururken hem kart hem de raviden CIKAN baglar
         (asagi dogru inen talebe kollari) ayni anda goruluyor. */
      const oran = dar ? 0.35 : 0.42;
      const hy = UST_BANT + (box.h - UST_BANT) * oran;
      kaydir({ k, x: (box.w + SOL_BANT) / 2 - p.x * k, y: hy - p.y * k }, 620);
    };
  
  
  
    /* Etiket yerleştirme. Etiketler ekranda sabit puntoda çizildiği için
       uzaklaşıldıkça kutuları çakışır. Burada önem sırasına göre
       (kademe, sonra bağ sayısı) tek tek yerleştirilir; yeri dolu olan
       eleni r. Böylece önemli isimler her zaman önce yer kapar.
  
       HESAP CANLI GORUNUME DEGIL, DURGUN GORUNUME BAGLI. Kaydirma
       sirasinda `view` saniyede ~60 kez degisiyor ve bu blok her
       seferinde 541 dugumu suzup siralayip birbirine karsi carpisma
       testinden geciriyordu -- kaydirmanin agir gelmesinin ikinci
       sebebi buydu. Simdi hareket durduktan 140 ms sonra bir kez
       hesaplaniyor. Hareket sirasinda etiket KUMESI sabit kaliyor, ama
       etiketler icerikle birlikte kaydigi icin bu disaridan fark
       edilmiyor; punto hala canli `view.k`ya bagli. */
    const [durgun, setDurgun] = useState(view);
    useEffect(() => {
      const z = setTimeout(() => setDurgun(view), 140);
      return () => clearTimeout(z);
    }, [view]);
  
    const etiketliler = useMemo(() => {
      const sirali = NODES
        .filter((n) => POS[n.id])
        .map((n) => ({ n, kad: KADEME(n.id), dg: DERECE[n.id] || 0 }))
        .sort((a, b) => a.kad - b.kad || b.dg - a.dg);
  
      const yerlesen = [];
      const secilenler = new Map();      // id -> "alt" | "ust"
      const bos = (k) => !yerlesen.some(
        (q) => k.x1 < q.x2 && k.x2 > q.x1 && k.y1 < q.y2 && k.y2 > q.y1);
  
      const dene = ({ n, kad }, zorla) => {
        const p = POS[n.id];
        const cx = durgun.x + p.x * durgun.k;
        const cy = durgun.y + p.y * durgun.k;
        /* Dugumun kendisi gorus alaninin epeyce disindaysa etiket
           yazilmiyor -- yoksa ekranda hic gorunmeyen noktalarin isimleri
           kenarda yigiliyor. PAY var: bir ekranin besde biri kadar
           disarida olan dugum hala isimlensin ki kenardaki noktalar
           cıplak kalmasin. */
        const etiketPay = Math.min(box.w, box.h) * 0.2;
        if (cx < SOL_BANT - etiketPay || cx > box.w + etiketPay ||
            cy < UST_BANT - etiketPay || cy > box.h + etiketPay) return;
        if (!zorla && durgun.k < ESIK[kad]) return;
  
        const punto = Math.max(EKRAN_PUNTO[kad], rEkranOf(n.id, durgun.k) * 0.42);
        const ad = Math.min(adi(n).length, 26);
        const g = Math.max(ad * punto * 0.5, 48);          // etiket genişliği
        const y = punto * 2.1 + 4;                          // iki satır
        const r = rEkranOf(n.id, durgun.k);
        const kutuAlt = { x1: cx - g / 2, x2: cx + g / 2, y1: cy + r + 2, y2: cy + r + 2 + y };
        const kutuUst = { x1: cx - g / 2, x2: cx + g / 2, y1: cy - r - 2 - y, y2: cy - r - 2 };
  
        /* KENARDAN TASAN ETIKET ARTIK GIZLENMIYOR. Eskiden isim bir
           harfiyle bile gorus alanindan tasiyorsa hic yazilmiyordu;
           ekranin kenarindaki noktalar isimsiz kaliyordu (Mustafa,
           2026-08-29). Simdi yaziliyor ve kenarda kirpiliyor -- yarim
           okunan bir isim, hic olmayandan iyi.
  
           Iceri CEKILMIYOR: bir zamanlar denenmis ve kenarda isimler
           ust uste yiğilmisti. Kirpma bu sorunu dogurmuyor cunku
           etiketin yeri degismiyor, yalnizca gorunen kismi kisaliyor. */
        const kay = 0;
  
        /* CARPISMA TESTI VURGULU ISIMLERDE DE GECERLI.
  
           Eskiden `zorla` burada da devredeydi: bir raviye tiklaninca
           butun hoca ve talebelerinin etiketi carpisma testine hic
           girmeden yaziliyordu. Ebû Hüreyre gibi 60'tan fazla bagi olan
           bir isimde sonuc okunmaz bir yigin oluyordu (Mustafa'nin
           ekran goruntusu, 2026-08-29).
  
           `zorla` artik yalnizca OLCEK ESIGINI (yukarida) atlatiyor,
           yani vurgulu isimler uzaktan da yazilmaya CALISILIYOR -- ama
           yer yoksa yine eleniyorlar. Yigilma yerine eksik isim tercih
           edildi; vurgulular zaten ONCE yerlestigi icin yeri onlar
           kapiyor, elenenler kenardaki kalabalik olanlar oluyor. */
        let kutu = null, yon = null;
        if (bos(kutuAlt)) { kutu = kutuAlt; yon = "alt"; }
        else if (bos(kutuUst)) { kutu = kutuUst; yon = "ust"; }
        if (!kutu) return;
  
        yerlesen.push(kutu);
        secilenler.set(n.id, { yon, kay });
      };
  
      // odaktaki râvi ve komşuları her halûkârda yazılır
      if (secim && vurgu) {
        sirali.filter((x) => vurgu.has(x.n.id)).forEach((x) => dene(x, true));
      }
      sirali.forEach((x) => {
        /* ETIKET SAYISINA UST SINIR. Carpisma testi zaten sigmayani
           eliyor ama genis ve bos bir bolgede yuzlerce isim
           yazilabiliyor; her etiket iki <text> ve bir kontur demek.
           Dar ekranda sinir daha dusuk. Onem sirasina gore
           yerlestirildigi icin elenenler her zaman en az bagli
           olanlar. */
        if (secilenler.size >= (dar ? 45 : 110)) return;
        if (!secilenler.has(x.n.id)) dene(x, false);
      });
      return secilenler;
    }, [durgun, box, secim, vurgu, adi, dar]);
  
    /* Kenarlarin tiklama seritleri bu esigin ustunde uretiliyor (bkz.
       kenar cizimi). 0.05, agin tamami ekrana sigmis haldeki olcegin
       (~0.006-0.014) belirgin ustunde; yani "biraz yakinlastim" demek. */
    const yakin = durgun.k > 0.05;
  
  
    /* SUS ANIMASYONLARI DAR EKRANDA KAPALI.
  
       Geriye kalan telefon kasmasinin kaynagi bunlar: one cikan 38
       dugumun salinimi ve halesi kesintisiz isliyor, tarayici her biri
       icin ayri bir birlestirme katmani tutuyor. Masaustunde bedeli
       gorunmuyor, telefonun GPU'sunda goruluyor.
  
       `prefers-reduced-motion` de saygi goruyor: kullanici isletim
       sisteminde hareketi azaltmayi secmisse animasyon hic
       baslatilmiyor -- bu zaten dogru davranis, yan faydasi performans.
  
       Kapali olan yalnizca SUS: acilis dalgasi, secim vurgusu ve kamera
       gecisleri yerinde duruyor, cunku onlar bilgi tasiyor. */
    const azHareket = typeof window !== "undefined" &&
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const susAnimasyon = !dar && !azHareket;
    /* Kenar akisi telefonda da acik -- salinim/hale ise degil.
       Ikisi ayri: salinim 38 dugume 38 birlestirme katmani aciyordu
       (pahali olan buydu), akis ise tek katmani adimli boyuyor. */
    const akisAnim = !azHareket;
  
    /* Kartin gercek yuksekligi: dar ekranda arama kumesi kartin hemen
       ustune oturuyor. Sabit sayi tutmuyordu -- ravi karti 130,
       kenar karti degisken (maxHeight 130). */
    const [kartYuk, setKartYuk] = useState(0);
    const kartGozRef = useRef(null);
    const kartRef = useCallback((el) => {
      kartGozRef.current?.disconnect();
      kartGozRef.current = null;
      if (!el) { setKartYuk(0); return; }
      setKartYuk(el.offsetHeight);
      const go = new ResizeObserver(() => setKartYuk(el.offsetHeight));
      go.observe(el);
      kartGozRef.current = go;
    }, []);
  
    /* Kenar kalinligi carpani. Kalinlik artik ekran pikseli olarak sabit
       (vectorEffect), ama 1382 kenarin tamami uzaktan tam kalinlikta
       cizilince tuval bir yumaga donuyor -- denendi, ag hic
       okunmuyordu. Uzaklastikca inceliyor: %0.5'te ~0.33, %10'da 1.
       Ok uclari da ancak yakinda cikiyor; uzakta her kenarin ucundaki
       ucgen cizginin kendisinden buyuk kaliyor.
  
       KALINLIK TEK BASINA YETMIYOR, saydamlik da uzaklastikca artiyor:
       1382 kenar tuvalin kucuk bir alaninda ust uste bindiginde, incecik
       de olsalar birikip dolu bir kutle olusturuyor ve noktalari
       yutuyorlar (denendi). Ikisi birlikte, uzakta ag'in genel dokusunu,
       yakinda tek tek baglari veriyor. */
    const cizgiCarpani = Math.min(1, 0.3 + durgun.k * 7);
  
    /* Bir kenarin yol dizgisi. Iki yerde lazim: tek tek cizilen
       (vurgulu / yakin) kenarlarda ve uzakta hepsinin birlestirildigi
       tek yolda. */
    const kenarYolu = useCallback((e) => {
      const pa = POS[e.a], pb = POS[e.b];
      if (!pa || !pb) return null;
      const dy = pb.y - pa.y;
      const [kavisHam, kf] = KAVIS[e.a + "|" + e.b] || [0, 0.3];
      const kavis = kavisHam * KAVIS_OLCEK;
      const k1x = pa.x + kavis, k1y = pa.y + dy * kf;
      const k2x = pb.x + kavis, k2y = pb.y - dy * kf;
      const vx = pb.x - k2x, vy = pb.y - k2y;
      const vu = Math.hypot(vx, vy) || 1;
      const bosluk = (rOf(e.b) + 10) * YAY;
      return `M ${pa.x} ${pa.y} C ${k1x} ${k1y}, ${k2x} ${k2y}, ` +
             `${pb.x - (vx / vu) * bosluk} ${pb.y - (vy / vu) * bosluk}`;
    }, []);
    const cizgiSaydam = Math.min(1, 0.3 + durgun.k * 6);
  
  
    const MEDINE_I = SUTUNLAR.findIndex((c) => c.belde === "Medine");
  
    const secRavi = secim && secim.tur === "ravi" ? NODES.find((n) => n.id === secim.id) : null;
    const secKenar = secim && secim.tur === "kenar" ? secim.e : null;
    /* KARTTA EN COK `KART_TAVAN` ISIM. Ebu Hureyre'nin tercemesinde
       Mizzi 338 talebe sayiyor; hepsini basmak karti okunmaz yapar ve
       zaten kimse 338 cipin arasindan bir sey secmez. Onem sirasi:
  
         1. Merkezilik -- Hz. Peygamber, sonra medarlar, muellifler,
            muksirun. Bunlar isnadin dugum noktalari.
         2. Kendi bag sayisi -- agda ne kadar cok baglantisi varsa
            o kadar yukarida. DERECE zaten hesaplanmis durumda.
         3. Rumuz genisligi -- ع (alti kitap) en genis, tek harf en dar.
            Rivayeti kac kitaba girmisse o kadar merkezi sayiliyor.
  
       Ag disinda kalanlar (DIS) her zaman agdakilerin ARDINDAN geliyor:
       onlar tiklanamiyor, dolayisiyla listenin basini isgal etmemeliler. */
    const RUMUZ_AGIRLIK = { "ع": 6, "٤": 4 };
    const rumuzGenislik = (r) => {
      if (!r || r === "—") return 0;
      return r.trim().split(/s+/)
        .reduce((a, h) => a + (RUMUZ_AGIRLIK[h] ?? 1), 0);
    };
    const merkezilik = (id) =>
      id === "nebi" ? 400 : (MEDAR[id] ? 200 : 0) +
      (MUELLIF.has(id) ? 120 : 0) + (MUKSIRUN.has(id) ? 80 : 0);
    const onemSirasi = (a, b) =>
      (merkezilik(b.n.id) - merkezilik(a.n.id)) ||
      ((DERECE[b.n.id] || 0) - (DERECE[a.n.id] || 0)) ||
      (rumuzGenislik(b.r) - rumuzGenislik(a.r));
  
    const hocaTum = secRavi
      ? EDGES.filter((e) => e.b === secRavi.id).map((e) => ({ ...e, n: NODES.find((x) => x.id === e.a) }))
          .sort(onemSirasi)
      : [];
    const talebeTum = secRavi
      ? EDGES.filter((e) => e.a === secRavi.id).map((e) => ({ ...e, n: NODES.find((x) => x.id === e.b) }))
          .sort(onemSirasi)
      : [];
    const hocalar = hocaTum.slice(0, KART_TAVAN);
    const talebeler = talebeTum.slice(0, KART_TAVAN);
    /* Ag disindakiler (bkz. DIS): tercemede gecen ama dugumu olmayan
       hoca/talebeler. Kartta gosteriliyor, ag'a cizilmiyor. Agdakiler
       tavani doldurduysa bunlara hic yer kalmiyor. */
    const disHam = (secRavi && DIS[secRavi.id]) || { hoca: [], talebe: [] };
    const disSirala = (l) => [...l].sort((a, b) => rumuzGenislik(b[1]) - rumuzGenislik(a[1]));
    const disKayit = {
      hoca: disSirala(disHam.hoca).slice(0, Math.max(0, KART_TAVAN - hocalar.length)),
      talebe: disSirala(disHam.talebe).slice(0, Math.max(0, KART_TAVAN - talebeler.length)),
    };
    // Tercemedeki toplam (gosterilen degil) -- basliktaki sayi bu.
    const tumSayi = {
      hoca: hocaTum.length + disHam.hoca.length,
      talebe: talebeTum.length + disHam.talebe.length,
    };
  
    /* AGIN GOVDESI DONDURULMUS BIR AGAC.
  
       Kaydirma sirasinda `view.x` / `view.y` saniyede ~60 kez
       degisiyordu ve her degisimde React butun agaci -- 541 dugum,
       1381 kenar, ~4700 SVG elemani -- bastan kuruyordu: her kenarin
       yol dizgisi yeniden hesaplaniyor, her dugumun yaricapi ve
       kademesi yeniden bulunuyordu. Kalan kasmanin buyuk kismi buydu.
  
       Oysa govdenin KAYDIRMAYLA hicbir isi yok: konum, disaridaki
       `<g transform="translate(...)">` ile veriliyor. Govde yalnizca
       OLCEGE ve vurgu durumuna bagli. Bu useMemo tam da bunu soyluyor:
       x/y degisince yeniden kurulma, sadece transform niteligi
       guncellensin. Yakinlastirma hala bastan kuruyor ama o surekli
       degil, kesik kesik oluyor.
  
       Bagimlilik listesine DIKKAT: govdenin okudugu her sey burada
       olmali, yoksa ekran gercekten eskimis bir hal gosterir. Olay
       isleyicilerinin okudugu `tasindi` bu yuzden ref'e cevrildi. */
    /* Govdenin cizildigi olcek: CANLI olcek degil, DURGUN olcek.
  
       Kaydirma cozuldukten sonra geriye yakinlastirma kaldi ve olculdu:
       govdenin bastan kuruldugu bir kare ~49 ms, kurulmadigi bir kare
       ~4.9 ms. Yani parmak acilip kapanirken saniyede ~20 kare
       duselebiliyordu. Cozum kaydirmadakinin ayni: govde durgun olcekte
       bir kez kuruluyor, aradaki fark disaridaki <g>'ye bir ORAN olarak
       veriliyor. Iki donusum birleince net sonuc yine scale(view.k).
  
       Bedeli: parmak hareket ederken yazi puntolari ve nokta yaricaplari
       -- ekran biriminde hesaplandiklari icin -- oranla birlikte bir
       miktar buyuyup kuculuyor, parmak kalkinca yerine oturuyor. Kenar
       kalinliklari da ayni sekilde etkileniyor (kalem artik kullanici
       uzayinda, bkz. birlesik yol).
       Harita uygulamalarinin yaptigi da budur. */
    const kg = durgun.k;
  
    /* GORUS PENCERESI (grafik biriminde). Disinda kalan dugum ve kenar
       hic uretilmiyor.
  
       Tuvalin tamami her zaman DOM'da duruyordu: 541 dugum, 1381 kenar,
       ~4500 SVG elemani. Yakinlasilmis bir gorunumde bunlarin buyuk
       cogunlugu ekranin disinda ama tarayici yine de her kaydirmada
       hepsini yeniden cizmek zorunda -- React tarafi dondurulduktan
       sonra kalan kasmanin kaynagi buydu. Elemeyle ~4500 eleman ~1800'e
       iniyor (olculdu, acilis gorunumunde).
  
       PENCERE BIR EKRANLIK IZGARAYA YUVARLANIYOR. Canli gorunume birebir
       baglansa her karede degisir, govdenin dondurulmus olmasi da bir ise
       yaramazdi. Yuvarlanmis hali ancak kullanici bir ekran boyu
       kaydirinca degisiyor; arada kalan uc ekranlik pay (birer yandan)
       bu sirada gozukecek her seyi zaten iceriyor.
  
       `zoomPay`: uzaklasirken (view.k, kg'nin altina duserken) gercek
       gorus alani, pencerenin hesaplandigi olcege gore buyuyor. Pay
       olmasa "Tamami"ye basildiginda gorunum genislerken tuvalin bir
       kismi 140 ms boyunca bos kalirdi. */
    /* Pay HER EKRANDA BIR EKRAN. Bir sure dar ekranda yariya
       indirilmisti (eleman sayisini dusurmek icin); sonuc, hizli
       kaydirmada kullanicinin penceresinin disina cikip noktalarin
       kaybolmasiydi (Mustafa, 2026-08-29). Pencere bir ekranlik
       izgaraya yuvarlandigi icin pay da en az bir ekran olmali, yoksa
       iki yenilenme arasinda bosluk kaliyor. Eleman sayisi zaten
       kenarlarin tek yolda birlestirilmesiyle dustu; payi kismaya
       gerek kalmadi. */
    const zoomPay = Math.max(1, kg / view.k);
    const gw = (box.w / kg) * zoomPay, gh = (box.h / kg) * zoomPay;
    const qx = olculdu && gw > 0 ? Math.floor(-view.x / kg / gw) : 0;
    const qy = olculdu && gh > 0 ? Math.floor(-view.y / kg / gh) : 0;
    const pencere = useMemo(() => (olculdu
      ? { x1: (qx - 1) * gw, x2: (qx + 2) * gw, y1: (qy - 1) * gh, y2: (qy + 2) * gh }
      : null), [qx, qy, gw, gh, olculdu]);
  
    /* Bir noktanin pencereye girip girmedigi. Kenar icin iki ucun
       KUTUSU pencereyle kesisiyorsa ciziliyor -- uzun bir kenarin iki
       ucu disarida ama govdesi iceride olabilir. */
    const icerde = (p) => !pencere ||
      (p.x >= pencere.x1 && p.x <= pencere.x2 && p.y >= pencere.y1 && p.y <= pencere.y2);
    const kenarIcerde = (pa, pb) => !pencere ||
      (Math.min(pa.x, pb.x) <= pencere.x2 && Math.max(pa.x, pb.x) >= pencere.x1 &&
       Math.min(pa.y, pb.y) <= pencere.y2 && Math.max(pa.y, pb.y) >= pencere.y1);
  
    /* ---- TUVAL CIZICISI ----
  
       SVG surumunde burada `agGovdesi` adli bir useMemo vardi: butun
       sahne React ogelerinden kuruluyor, kaydirmada dis <g>'nin
       transform'u degisiyor ve tarayici agacin tamamini yeniden
       boyuyordu. Donmus agac, eleme, birlestirilmis yol, kullanici
       uzayinda kalem -- hepsi o boyamayi ucuzlatma denemeleriydi.
  
       Burada agac yok. Tek bir <canvas> var ve sahne her gorunum
       degisiminde dogrudan piksel tamponuna ciziliyor. DOM hic
       buyumuyor, stil hesabi ve duzen asamasi tamamen ortadan kalkiyor.
  
       KOORDINAT DUZENI: sekiller GRAFIK biriminde ciziliyor (ctx'e
       view uygulaniyor), yazilar EKRAN biriminde. Yaziyi da olcekli
       birakmak metni bulaniklastiriyor -- tarayici yazi tipini
       olceklenmis bir matris altinda ipuclandiramiyor. */
    const tuvalRef = useRef(null);
    const cizIstekRef = useRef(0);
    const akisFazRef = useRef(0);
    /* Vurus kayitlari. `ciz` her gecisinde dolduruyor, `tuvaldaBul`
       okuyor. Ayri bir hesap degil -- zaten cizerken bilinen ekran
       konumlari saklaniyor, maliyeti bir dizi doldurmak. */
    const vurusRef = useRef({ dugum: [], etiket: [], kenar: [] });
  
    /* Kenarin kubik egrisi SAYI olarak. SVG surumunde bu bir yol
       dizgisiydi (`kenarYolu`); tuvalde dizgi uretip ayristirmak bosa is,
       dogrudan denetim noktalari gerekiyor. Geometri birebir ayni. */
    const kenarKubik = useCallback((e) => {
      const pa = POS[e.a], pb = POS[e.b];
      if (!pa || !pb) return null;
      const dy = pb.y - pa.y;
      const [kavisHam, kf] = KAVIS[e.a + "|" + e.b] || [0, 0.3];
      const kavis = kavisHam * KAVIS_OLCEK;
      const k1x = pa.x + kavis, k1y = pa.y + dy * kf;
      const k2x = pb.x + kavis, k2y = pb.y - dy * kf;
      const vx = pb.x - k2x, vy = pb.y - k2y;
      const vu = Math.hypot(vx, vy) || 1;
      const bosluk = (rOf(e.b) + 10) * YAY;
      return { x0: pa.x, y0: pa.y, k1x, k1y, k2x, k2y,
               x1: pb.x - (vx / vu) * bosluk, y1: pb.y - (vy / vu) * bosluk };
    }, []);
  
    const ciz = useCallback(() => {
      const cv = tuvalRef.current;
      if (!cv || !box.w || !box.h) return;
      /* CIHAZ PIKSEL ORANI TAM KULLANILIYOR (uc kata kadar).
  
         Once ikiyle sinirlanmisti, "gozle secilmez" diye. Yanlisti:
         SVG cozunurlukten bagimsiz, cihaz ne veriyorsa o kadar keskin
         cikiyor. Uc kat yogunluklu bir telefonda tuvali ikiyle
         cizdirmek eksen basina ucte bir daha az piksel demek ve fark
         yaziciklarda dogrudan goruluyor (Mustafa, 2026-08-30).
  
         CSS boyu da TAM SAYIYA oturtuluyor. Kap kesirli bir genislikte
         olcurse (375.5 gibi) arka tampon ile CSS kutusu tam ortulmuyor
         ve tarayici araya bir yeniden orneklemye sokuyor -- bulanikligin
         ikinci kaynagi buydu. */
      const dprHam = Math.min(window.devicePixelRatio || 1, 3);
      const cw = Math.round(box.w), ch = Math.round(box.h);
      /* Tampon boyu YUVARLANIYOR, cunku devicePixelRatio kesirli
         gelebiliyor (olculen: 1.9999999835). Yuvarlanmadan 375 * 1.9999
         = 749.99 cikiyor, tuval bunu 749'a kirpiyor ve tarayici 749
         pikseli 375 CSS pikseline sigdirmak icin yeniden ornekliyor --
         yaziciklardaki bulanikligin bir kaynagi da buydu. Yuvarlayinca
         oran tam 2 oluyor. */
      const gw = Math.round(cw * dprHam), gh = Math.round(ch * dprHam);
      if (cv.width !== gw || cv.height !== gh) {
        cv.width = gw; cv.height = gh;
        cv.style.width = cw + "px"; cv.style.height = ch + "px";
      }
      // Cizim olcegi TAMPONDAN turetiliyor, ham orandan degil.
      const olcek = gw / cw;
      const ctx = cv.getContext("2d");
      ctx.setTransform(olcek, 0, 0, olcek, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      if (!olculdu) return;
  
      const k = view.k;
      const eX = (gx) => view.x + gx * k;     // grafik -> ekran
      const eY = (gy) => view.y + gy * k;
      const vurus = { dugum: [], etiket: [], kenar: [] };
      vurusRef.current = vurus;
  
      /* CANLANAN KENARLAR SECILEN NOKTANIN RENGINDE. Sabit bir vurgu
         rengi yerine bu, cunku bag zaten o raviye ait -- goz cizgiyi
         kaynagina baglayabiliyor. Hz. Peygamber'de turkuaz, Malik'te
         Malik'in tonu.
  
         Acik temada bir duzeltme var: palet acik zemin icin secilmis
         oldugundan bazi tonlar krem uzerinde kayboluyor. Parlakligi
         esigin ustunde olanlar koyulastiriliyor. */
      const canliRenk = (() => {
        if (!(secim && secim.tur === "ravi")) return C.kenarCanli;
        const ham = secim.id === "nebi" ? NEBI_RENK : renkOf(secim.id);
        if (koyu) return ham;
        const s = ham.replace("#", "");
        const r = parseInt(s.slice(0, 2), 16), g = parseInt(s.slice(2, 4), 16),
              b = parseInt(s.slice(4, 6), 16);
        const parlaklik = (r * 299 + g * 587 + b * 114) / 1000;
        if (parlaklik < 150) return ham;
        const o = 150 / parlaklik;
        const iki = (v) => Math.round(v * o).toString(16).padStart(2, "0");
        return "#" + iki(r) + iki(g) + iki(b);
      })();
  
      // ---- zemin ----
      ctx.fillStyle = C.tuval;
      ctx.fillRect(0, 0, cw, ch);
  
      // ---- sutun seritleri ----
      /* Serit rengi Medine'den baslayip BIRER ATLAYARAK tekrar ediyor.
         Parite indise degil MEDINE'ye gore: araya yeni bir belde girse
         (Yemen girdi) Medine tonunu kaybetmesin. */
      SUTUNLAR.forEach((c, i) => {
        const ilk = i === 0, son = i === SUTUNLAR.length - 1;
        const zx = ilk ? -W : c.x;
        const zw = (son ? W * 2 : c.x + c.genislik) - zx;
        const cift = (i - MEDINE_I) % 2 === 0;
        ctx.globalAlpha = cift ? C.damaAOp : C.damaBOp;
        ctx.fillStyle = cift ? C.damaA : C.damaB;
        ctx.fillRect(eX(zx), 0, zw * k, box.h);
      });
      ctx.globalAlpha = 1;
  
      // ---- 25'er yillik satirlar ----
      SATIRLAR.forEach((y, i) => {
        const ilk = i === 0, son = i === SATIRLAR.length - 1;
        const ust = ilk ? -H : yOf(y);
        const alt = son ? H * 2 : yOf(Math.min(y + SATIR_YIL, YIL_MAX));
        if (alt <= ust) return;
        const y1 = eY(ust), y2 = eY(alt);
        if (y2 < 0 || y1 > box.h) return;
        ctx.globalAlpha = i % 2 === 0 ? C.satirAOp : C.satirBOp;
        ctx.fillStyle = i % 2 === 0 ? C.satirA : C.satirB;
        ctx.fillRect(0, y1, box.w, y2 - y1);
      });
      ctx.globalAlpha = 1;
  
      // ---- sutun ayraclari ----
      ctx.strokeStyle = C.cizgi;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      SUTUNLAR.forEach((c, i) => {
        if (!i) return;
        const x = Math.round(eX(c.x)) + 0.5;   // yarim piksel: cizgi keskin cikar
        if (x < -2 || x > box.w + 2) return;
        ctx.moveTo(x, 0); ctx.lineTo(x, box.h);
      });
      ctx.stroke();
  
      // ---- yil cizgileri ----
      ctx.lineWidth = 1;
      for (const y of YILLAR) {
        const ey = Math.round(eY(yOf(y))) + 0.5;
        if (ey < -2 || ey > box.h + 2) continue;
        ctx.globalAlpha = y % 50 === 0 ? 0.85 : 0.28;
        ctx.beginPath();
        ctx.moveTo(eX(0), ey); ctx.lineTo(eX(W), ey);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
  
      // ---- kenarlar ----
      /* Vurgusuzler TEK YOLDA toplaniyor: tuvalde de her cizgiyi ayri
         beginPath/stroke ile vermek her seferinde kalem kurdurur.
         Sonuk ve normal ayri iki gecis, cunku renkleri farkli. */
      const kubik = (ctx, c) => {
        ctx.moveTo(eX(c.x0), eY(c.y0));
        ctx.bezierCurveTo(eX(c.k1x), eY(c.k1y), eX(c.k2x), eY(c.k2y),
                          eX(c.x1), eY(c.y1));
      };
      const canliKenarlar = [];
      let seciliKenar = null;
      const sonukYol = [], normalYol = [];
      for (const e of EDGES) {
        const pa = POS[e.a], pb = POS[e.b];
        if (!pa || !pb || !kenarIcerde(pa, pb)) continue;
        const secili = secKenar && secKenar.a === e.a && secKenar.b === e.b;
        const canli = !secili && !!(secim && secim.tur === "ravi" &&
          (e.a === secim.id || e.b === secim.id));
        const c = kenarKubik(e);
        if (!c) continue;
        vurus.kenar.push({ e, c });
        if (secili) { seciliKenar = c; continue; }
        if (canli) { canliKenarlar.push(c); continue; }
        // ekranda uc pikselden kisa kalan kenar gorunmuyor
        if (Math.hypot(pb.x - pa.x, pb.y - pa.y) * k < 3) continue;
        (kenarSonuk(e) ? sonukYol : normalYol).push(c);
      }
      const topluCiz = (liste, renk, kalinlik, saydam) => {
        if (!liste.length) return;
        ctx.strokeStyle = renk;
        ctx.lineWidth = kalinlik;
        ctx.globalAlpha = saydam;
        ctx.beginPath();
        for (const c of liste) kubik(ctx, c);
        ctx.stroke();
      };
      topluCiz(sonukYol, C.kenarSonuk, 0.7 * cizgiCarpani,
               (vurgu ? 0.22 : 0.5) * cizgiSaydam);
      topluCiz(normalYol, C.kenar, 1.2 * cizgiCarpani, 0.85 * cizgiSaydam);
  
      // vurgulular: akan kesik cizgi
      if (canliKenarlar.length) {
        ctx.save();
        if (akisAnim) {
          ctx.setLineDash([14, 8]);
          ctx.lineDashOffset = akisFazRef.current;
        }
        /* Kalinlik ve opaklik, renk turkuaza donunce GERI CEKILDI.
           Eski zeytin ton zeminin sarisiyla ayni ailedendi ve
           secilebilmesi icin kalinliga yuklenmek gerekiyordu. Turkuaz
           zaten hicbir seyle karismiyor, dolayisiyla ayni okunurluk
           daha ince ve daha soluk bir cizgiyle elde ediliyor. Hz.
           Peygamber gibi altmis kenarli bir dugum secilince fark
           dogrudan goruluyor: eskisi ekrani kapliyordu. */
        topluCiz(canliKenarlar, canliRenk, 1.4 * Math.max(0.7, cizgiCarpani), 0.72);
        ctx.restore();
      }
      if (seciliKenar) topluCiz([seciliKenar], C.kenarSecili, 2.6, 1);
      ctx.globalAlpha = 1;
  
      // ---- ok uclari ----
      /* Yalnizca vurgulu ve secili kenarlarda. Ucun yonu son denetim
         noktasindan bitis noktasina bakan vektor. */
      const okCiz = (c, renk, boy) => {
        const ax = eX(c.x1), ay = eY(c.y1);
        const vx = eX(c.x1) - eX(c.k2x), vy = eY(c.y1) - eY(c.k2y);
        const u = Math.hypot(vx, vy) || 1;
        const ux = vx / u, uy = vy / u;
        ctx.fillStyle = renk;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax - ux * boy - uy * boy * 0.42, ay - uy * boy + ux * boy * 0.42);
        ctx.lineTo(ax - ux * boy + uy * boy * 0.42, ay - uy * boy - ux * boy * 0.42);
        ctx.closePath();
        ctx.fill();
      };
      for (const c of canliKenarlar) okCiz(c, canliRenk, 7);
      if (seciliKenar) okCiz(seciliKenar, C.okVurgu, 9);
  
      // ---- dugumler ----
      for (const n of NODES) {
        const p = POS[n.id];
        if (!p || !icerde(p)) continue;
        const px = eX(p.x), py = eY(p.y);
        const r = rEkranOf(n.id, k);          // dogrudan ekran yaricapi
        if (px < -r - 20 || px > box.w + r + 20 ||
            py < -r - 20 || py > box.h + r + 20) continue;
        vurus.dugum.push({ id: n.id, px, py, r });
        const sonukMu = sonuk(n.id);
        const secili = secRavi && secRavi.id === n.id;
        const renk = n.id === "nebi" ? NEBI_RENK : renkOf(n.id);
        ctx.globalAlpha = sonukMu ? 0.14 : 1;
  
        /* Muksirun halkasi ve medar baklavasi. Salinim ve hale
           animasyonu tuvalde YOK: SVG'de bunlar CSS ile bedavaya
           yakindi, tuvalde her kare yeniden cizim demek olurdu ve
           kazanilan seyi geri verirdi. */
        /* HALKA VE BAKLAVA PAYLARI GRAFIK BIRIMINDE, ekran degil.
  
           SVG'de bu sekiller `scale(kg)` grubunun icindeydi: `r + 8`
           yazildiginda ekranda `8 * kg` kadar disariya tasiyordu, yani
           acilis gorunumunde onda bir pikselden az -- halka noktanin
           kenarina yapisiktir. Tuvale birebir tasininca 8 GERCEK piksel
           oldu ve noktalar birbirine girdi (Mustafa, 2026-08-30).
           Kalemler icin de ayni sey gecerli. */
        if (MUKSIRUN.has(n.id)) {
          ctx.strokeStyle = renk; ctx.lineWidth = 2.4 * k;
          ctx.globalAlpha = (sonukMu ? 0.14 : 1) * 0.55;
          ctx.beginPath(); ctx.arc(px, py, r + 8 * k, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha = sonukMu ? 0.14 : 1;
        }
        if (MEDAR[n.id]) {
          const d = r + 10 * k;
          ctx.strokeStyle = renk; ctx.lineWidth = 2.4 * k;
          ctx.globalAlpha = (sonukMu ? 0.14 : 1) * 0.6;
          ctx.beginPath();
          ctx.moveTo(px, py - d); ctx.lineTo(px + d, py);
          ctx.lineTo(px, py + d); ctx.lineTo(px - d, py);
          ctx.closePath(); ctx.stroke();
          ctx.globalAlpha = sonukMu ? 0.14 : 1;
        }
        ctx.fillStyle = renk;
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        /* Beyaz cerceve de grafik biriminde. Ekran biriminde birakilinca
           her nokta tam iki piksellik bir halkayla ciziliyordu ve
           noktalar oldugundan iri gorunuyordu. */
        ctx.strokeStyle = secili ? C.ink : "#ffffff";
        ctx.lineWidth = (secili ? 3.4 : 2) * k;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
  
      // ---- etiketler ----
      /* Butun noktalardan SONRA, ayri bir gecis: yazilar butun
         dairelerin ustunde kalsin. Yazi EKRAN biriminde -- olcekli bir
         matris altinda yazi tipi ipuclandirilamiyor ve metin
         bulaniklasiyor. */
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      for (const n of NODES) {
        const bilgi = etiketliler.get(n.id);
        const p = POS[n.id];
        if (!bilgi || !p) continue;
        const r = rEkranOf(n.id, k);
        const kad = KADEME(n.id);
        const punto = Math.max(EKRAN_PUNTO[kad], r * 0.42);
        const altPunto = punto * 0.8;
        const px = eX(p.x) + bilgi.kay;
        // Buradaki 8 de grafik birimi (bkz. halka paylari).
        const py = eY(p.y) + (bilgi.yon === "ust"
          ? -(2 * r + punto + altPunto + 8 * k) : 0);
        ctx.globalAlpha = sonuk(n.id) ? 0.12 : 1;
        const ad = adi(n).length > 26 ? adi(n).slice(0, 25) + "…" : adi(n);
  
        /* Hale: SVG'de `paintOrder: stroke` ile yapiliyordu, tuvalde
           once kalin bir kalemle yazip sonra icini doldurmak ayni sey.
           Yazinin kenar cizgileri uzerinde okunakli kalmasini sagliyor.

           KALINLIK 0.32'den 0.14'e indi (Mustafa, 2026-09-02). Once
           tumden kaldirilmisti; hale olmadan yazi kenar cizgilerinin
           uzerinde daginik goruluyor, eski kalinlikta ise harflerin
           cevresinde gorunur bir golge birakiyordu. 0.14 ikisinin
           ortasi: cizgiyi kesiyor ama kendisi fark edilmiyor. */
        ctx.font = `${kad <= 1 ? 600 : 400} ${punto}px Georgia, 'Times New Roman', serif`;
        ctx.strokeStyle = C.etiketHale;
        ctx.lineWidth = punto * HALE_KALINLIK;
        ctx.lineJoin = "round";
        ctx.strokeText(ad, px, py + r + punto);
        ctx.fillStyle = C.etiketAna;
        ctx.fillText(ad, px, py + r + punto);
        /* Hedef alani yazinin kendi kutusu. Yaziyi zaten cizdik, o
           yuzden olcum bedavaya yakin. Dikeyde punto kadar pay var --
           SVG'deki hale kalinliginin karsiligi. */
        const gen = ctx.measureText(ad).width;
        vurus.etiket.push({ id: n.id, x0: px - gen / 2 - 2, x1: px + gen / 2 + 2,
                            y0: py + r + 2, y1: py + r + punto * 1.15 });
  
        const tarih = tarihYaz(n, t.agOlum);
        ctx.font = `400 ${altPunto}px Georgia, 'Times New Roman', serif`;
        ctx.lineWidth = altPunto * HALE_KALINLIK;
        ctx.strokeText(tarih, px, py + r + punto + altPunto + 3 * k);
        ctx.fillStyle = C.solukInk;
        ctx.fillText(tarih, px, py + r + punto + altPunto + 3 * k);
      }
      ctx.globalAlpha = 1;
    }, [box, olculdu, view, pencere, secim, secRavi, secKenar, vurgu,
        cizgiCarpani, cizgiSaydam, MEDINE_I, adi, koyu, akisAnim, t,
        etiketliler, kenarKubik]);
  
    /* TUVALDA NE TIKLANDI.
  
       Sira onemli: once etiketler, sonra dugumler, en son kenarlar.
       Ciziliste de bu sira var (yazilar en ustte) ve tiklamada da
       ustteki kazanmali. Kenarlar en sona kaliyor, cunku hepsi
       birbirini kesiyor ve bir dugumun uzerindeyken kenar secilmesi
       sasirtici olurdu.
  
       Dugum icin pay: kucuk noktalar telefonda parmakla tutulamiyor,
       o yuzden yaricap ne olursa olsun en az 11 piksellik bir hedef
       veriliyor. */
    const tuvaldaBul = useCallback((nokta) => {
      const cv = tuvalRef.current;
      if (!cv) return null;
      const kutu = cv.getBoundingClientRect();
      const x = nokta.x - kutu.left, y = nokta.y - kutu.top;
      const v = vurusRef.current;
  
      for (let i = v.etiket.length - 1; i >= 0; i--) {
        const et = v.etiket[i];
        if (x >= et.x0 && x <= et.x1 && y >= et.y0 && y <= et.y1)
          return { tur: "ravi", id: et.id };
      }
      let enYakin = null, enAz = Infinity;
      for (const dg of v.dugum) {
        const uz = Math.hypot(x - dg.px, y - dg.py);
        if (uz <= Math.max(dg.r, 11) && uz < enAz) { enAz = uz; enYakin = dg; }
      }
      if (enYakin) return { tur: "ravi", id: enYakin.id };
  
      /* Kenar testi YALNIZCA YAKINDA. SVG surumunde kenarlarin
         tiklama seridi de ancak `yakin` iken ciziliyordu; ayni kural
         burada da gecerli olmali, yoksa uzaklasilmis bir gorunumde bos
         bir yere tiklamak neredeyse her zaman bir kenar seciyor --
         yuzlerce egri her pikselin yakininda geciyor.
  
         Egriyi on parcaya bolup en yakin ornege bakiyoruz. Tam bir
         egri-nokta uzakligi cozumu gereksiz, dokuz piksellik esikte on
         ornek fazlasiyla yetiyor. */
      if (!yakin) return null;
      const kubikNokta = (c, u) => {
        const m = 1 - u;
        return [m*m*m*c.x0 + 3*m*m*u*c.k1x + 3*m*u*u*c.k2x + u*u*u*c.x1,
                m*m*m*c.y0 + 3*m*m*u*c.k1y + 3*m*u*u*c.k2y + u*u*u*c.y1];
      };
      const k = view.k;
      const eX = (gx) => view.x + gx * k, eY = (gy) => view.y + gy * k;
      let enKenar = null, enKenarAz = 9;
      for (const { e, c } of v.kenar) {
        for (let i = 0; i <= 10; i++) {
          const [gx, gy] = kubikNokta(c, i / 10);
          const uz = Math.hypot(x - eX(gx), y - eY(gy));
          if (uz < enKenarAz) { enKenarAz = uz; enKenar = e; }
        }
      }
      if (enKenar) return { tur: "kenar", e: enKenar };
      return null;
    }, [view, yakin]);
  
    /* Cizim rAF ile kisitli: bir karede birden cok durum degisirse
       (kaydirma + secim gibi) tuval bir kez boyansin. */
    useEffect(() => {
      cancelAnimationFrame(cizIstekRef.current);
      cizIstekRef.current = requestAnimationFrame(ciz);
      return () => cancelAnimationFrame(cizIstekRef.current);
    }, [ciz]);
  
    /* Akan kesik cizgi. Yalnizca bir ravi seciliyken donuyor, cunku
       canlanan kenar ancak o zaman var.
  
       KARE ATLAMA YOK. Onceden 40 ms'de bir 4 piksel atlaniyordu; hiz
       dogruydu ama hareket kesik kesik gorunuyordu -- goz 4 piksellik
       sicramalari tek tek seciyor ve sonuc "hem hizli hem yavas"
       oluyordu (Mustafa, 2026-08-30). Simdi her karede ve GECEN SUREYE
       gore ilerliyor, yani ekran kac hertz ise o kadar akici.
  
       Maliyet bir tam sahne cizimi; kaydirmada da her karede ayni is
       yapiliyor ve orada sorun yok. Faz FARKLA ilerledigi icin dongu
       yeniden kurulsa bile (ciz kimligi degisince oluyor) hareket
       ziplamiyor. */
    useEffect(() => {
      if (!akisAnim || !(secim && secim.tur === "ravi")) return;
      let calisiyor = true, sonT = performance.now();
      const dongu = (t) => {
        if (!calisiyor) return;
        akisFazRef.current -= ((t - sonT) / 1000) * AKIS_HIZ;
        sonT = t;
        ciz();
        requestAnimationFrame(dongu);
      };
      const id = requestAnimationFrame(dongu);
      return () => { calisiyor = false; cancelAnimationFrame(id); };
    }, [akisAnim, secim, ciz]);
  
  
    return (
      <div className="w-full h-full flex flex-col overflow-hidden"
           style={{ fontFamily: "Georgia, 'Times New Roman', serif",
                    background: C.zemin, color: C.ink }}>
        {/* `select-none` tuvalde: surukleyerek gezerken tarayici metin
            secmeye kalkmasin. Bilgi kartlari bunun DISINDA tutuluyor
            (`select-text`), yoksa karttaki Arapca ad, tarih ve Mizzî
            nakli kopyalanamiyordu (Mustafa, 2026-08-29). */}
        <div ref={boxRef} className="relative flex-1 overflow-hidden select-none"
          data-tuval
          /* `touchAction: none`: tarayici parmak hareketini KENDI kaydirma
             ve yakinlastirmasi icin kapmasin, olaylar bize gelsin. Bu
             olmadan dokunma isleyicileri yazilsa bile telefonda hicbir
             sey olmaz. */
          /* `contain: layout paint`: tarayiciya bu kutunun cizimi
             kendi icinde biter diyor. Olmadan, buyuk SVG her yeniden
             boyandiginda tarayici sayfanin geri kalanini da (sabit
             konumlu ust bant dahil) gecersiz sayabiliyor ve baslikta
             yanip sonme goruluyordu. */
          style={{ cursor: suruk ? "grabbing" : "grab", touchAction: "none",
                   background: C.tuval, contain: "layout paint" }}
          onPointerDown={pointerBas}
          onPointerMove={pointerKimilda}
          onPointerUp={(e) => {
            const sonParmak = isaretler.current.size <= 1;
            const nokta = { x: e.clientX, y: e.clientY };
            pointerBirak(e);
            if (sonParmak && !tasindiRef.current) {
              /* Tuvalde tiklanan sey ne ise o seciliyor; hicbir sey
                 yoksa secim temizleniyor. SVG surumunde bu is ogelerin
                 kendi isleyicilerindeydi.
  
                 DUGUM VE ETIKET `odaklan`DAN GECIYOR, dogrudan setSecim'den
                 degil. Tuvale gecerken bu atlanmisti ve iki davranis birden
                 kaybolmustu (Mustafa, 2026-08-30): secilen ravinin ekrana
                 ORTALANMASI ve ayni raviye tekrar tiklayinca secimin
                 KALKMASI. Arama kutusu ile karttaki cipler zaten odaklan'i
                 cagirdigi icin oralarda calismaya devam ediyordu, fark da
                 bu yuzden goze carpiyordu. */
              const vurulan = tuvaldaBul(nokta);
              if (vurulan && vurulan.tur === "ravi") odaklan(vurulan.id);
              else setSecim(vurulan);
              /* ARAMA KUTUSU DA SIFIRLANIYOR, yalnizca acilir liste degil.
                 Eskiden sadece `setAcikArama(false)` vardi: yazilan metin
                 kutuda kaliyordu, dolayisiyla arama sonucundaki isimler
                 haritada vurgulu kalmaya devam ediyor ve kullanici baska
                 bir raviye gectiginde bile kutu eski aramada takili
                 duruyordu (Mustafa, 2026-09-02). Metin `sonuclarSet`i
                 besledigi icin onu temizlemek vurguyu da kaldiriyor. */
              setAcikArama(false);
              setArama("");
            }
          }}
          onPointerCancel={pointerBirak}
          onPointerLeave={pointerBirak}>
  
          {/* ---- ana tuval ---- */}
          {/* ---- ana tuval ----
              SVG yerine <canvas>. Butun sahne `ciz` icinde piksel
              tamponuna yaziliyor; burada tek bir oge var ve kaydirma
              sirasinda DOM'da hicbir sey degismiyor.
  
              Tiklama hedefi kendiliginden olusmuyor: SVG'de her dugum
              ve etiket bir ogeydi ve tarayici vurus testini kendi
              yapiyordu. Tuvalde bunu biz yapiyoruz -- `ciz` her
              gecisinde vurus kayitlarini `vurusRef`e dolduruyor,
              `tuvaldaBul` de onlari geriden one dogru tariyor. */}
          <canvas ref={tuvalRef}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                     visibility: olculdu ? undefined : "hidden" }} />
  
          {/* ---- sabit yıl ekseni (sol) ---- */}
          <svg width={SOL_BANT} height="100%"
            style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            <rect x="0" y="0" width={SOL_BANT} height="100%" fill={C.zemin} />
            <line x1={SOL_BANT - 0.5} y1="0" x2={SOL_BANT - 0.5} y2="100%"
              stroke={C.cizgi} strokeWidth="1" />
            {/* Once GORUNUR yillar suzuluyor, sonra ciziliyor. Suzgecte
                iki is var:
                  - bant disinda kalanlari at,
                  - birbirine 22 px'den yakin olanlari at. Etiket artik
                    iki satir; uzaklasilinca on yillik araliklar birkac
                    piksele dusuyor ve satirlar ust uste biniyordu. */}
            {YILLAR.reduce((liste, y) => {
              const ky = view.y + yOf(y) * view.k;
              if (ky < UST_BANT + 10 || ky > box.h - 10) return liste;
              const onceki = liste[liste.length - 1];
              if (onceki && ky - onceki.ky < 22) return liste;
              liste.push({ y, ky });
              return liste;
            }, []).map(({ y, ky }) => (
              /* SAYI USTTE, EK ALTTA. Tek satirken ("175 h.") bant 36 px
                 istiyordu; iki satir 24 px'e siginca ag o kadar genisledi.
  
                 `direction: ltr` SART: Arapcada kok ogeye dir="rtl"
                 veriliyor ve SVG'de `text-anchor` yon duyarli -- "end"
                 RTL'de SOL kenari isaret ediyor, yazi saga dogru uzayip
                 24 px'lik svg'nin disinda kaliyor ve HIC GORUNMUYORDU
                 (Mustafa, 2026-08-30). Sayilar her dilde soldan saga. */
              <text key={y} x={SOL_BANT - 4} textAnchor="end"
                style={{ direction: "ltr" }}>
                <tspan x={SOL_BANT - 4} y={ky - 1} fontSize="9"
                  fill={y % 50 === 0 ? C.ink : C.solukInk}>{y}</tspan>
                <tspan x={SOL_BANT - 4} y={ky + 7} fontSize="7"
                  fill={C.solukInk}>{YIL_EKI[language] ?? "h."}</tspan>
              </text>
            ))}
          </svg>
  
          {/* ---- sabit şehir bandı (üst) ---- */}
          <svg width="100%" height={UST_BANT}
            style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
            <rect x="0" y="0" width="100%" height={UST_BANT} fill={C.zemin} />
            <line x1="0" y1={UST_BANT - 0.5} x2="100%" y2={UST_BANT - 0.5}
              stroke={C.cizgi} strokeWidth="1" />
            {SUTUNLAR.map((c) => {
              const kx = view.x + (c.x + c.genislik / 2) * view.k;
              const sol = view.x + c.x * view.k;
              const sag = view.x + (c.x + c.genislik) * view.k;
              if (sag < SOL_BANT + 10 || sol > box.w - 10) return null;
              // sutunun ekrandaki genisligine gore ismi kisalt
              const gorunurSol = Math.max(sol, SOL_BANT);
              const gorunurSag = Math.min(sag, box.w);
              const alan = Math.max(0, gorunurSag - gorunurSol) - 10;
              const tam = buyuk(BELDE_AD[language]?.[c.belde] ?? c.belde);
              const harfW = 8.6;                        // 10.5px + 1.6px harf araligi
              const sigan = Math.floor(alan / harfW);
              if (sigan < 1) return null;
              const yazi = sigan >= tam.length ? tam : tam.slice(0, Math.max(1, sigan - 1)) + "\u2026";
              // varsayılan olarak sütunun gerçek merkezi; ancak sütun kısmen
              // görünüyorsa görünen kısmın ortasına kaydırılır
              const yariGen = (Math.min(alan, tam.length * harfW)) / 2;
              const gx = Math.min(Math.max(kx, gorunurSol + yariGen), gorunurSag - yariGen);
              return (
                <g key={c.belde}>
                  <line x1={sol} y1={UST_BANT - 5} x2={sol} y2={UST_BANT}
                    stroke={C.cizgi} strokeWidth="1" />
                  <text x={gx + 0.8} y={16} textAnchor="middle" fontSize="10.5" letterSpacing="1.6"
                    fill={c.belde === "Medine" ? C.vurguInk : C.solukInk}>
                    {yazi}
                  </text>
                </g>
              );
            })}
            <rect x="0" y="0" width={SOL_BANT} height={UST_BANT} fill={C.zemin} />
          </svg>
  
          {/* ---- sağ üst: râvi bul + yakınlaştırma ---- */}
          {/* Sag altta yalnizca ARAMA KUTUSU kaldi. Yakinlastirma
              dugmeleri ve "Tamami" 2026-08-29'da kaldirildi: olcek artik
              ctrl+tekerlek ve iki parmakla ayarlaniyor, dugmelere gerek
              kalmadi.
  
              Kume EKRANIN %15'i. `minWidth` bilerek var: dar bir
              telefonda %15 yaklasik 56 piksel eder, o genislige yazi
              sigmiyor. Taban yalnizca en dar ekranlarda devreye giriyor.
  
              `data-ustlik`: tekerlek isleyicisi (bkz. tekerlek) bu
              isareti tasiyan bir seyin uzerindeyse olayi ag'a
              gecirmiyor, kutu kendi kaydirmasini yapiyor. */}
          {/* DAR EKRANDA KUME KARTIN USTUNDE ve tam genislikte; yan yana
              dizilis telefonda karti okunmaz hale getiriyordu. Kart
              acikken kume onun ustune cikiyor (kart 130 + 12 pay + 12
              aralik), kapaliyken en alta iniyor. Genis ekranda eskisi
              gibi sag altta, %15. */}
          <div className="absolute z-20" data-ustlik
            style={{ bottom: dar ? 12 + kartYuk + (kartYuk ? 6 : 0) : 12,
                     right: 12, width: "15%", minWidth: KUME_EN_AZ }}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}>
            {acikArama && arama.trim() && (
              /* Sonuc listesi kumeden GENIS: isimler 132 px'e sigmaz.
                 Saga yaslanip sola dogru tasiyor. */
              <div className="shadow gizli-kaydirma" style={{ marginBottom: 6, maxHeight: 260, overflowY: "auto", background: C.tuval, border: "1px solid " + C.cizgi, borderRadius: 2, width: dar ? "calc(100vw - 24px)" : 300, marginLeft: "auto", position: "relative", right: 0 }}>
                {sonuclar.length ? sonuclar.map((n) => (
                  <button key={n.id}
                    onClick={() => { odaklan(n.id); setAcikArama(false); }}
                    className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 border-b last:border-0"
                    style={{ borderColor: C.cizgi, color: C.ink }}>
                    <span className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: n.id === "nebi" ? NEBI_RENK : renkOf(n.id) }} />
                    <span className="flex-1 truncate">{adi(n)}</span>
                    <span className="text-[11px] shrink-0" style={{ color: C.solukInk }}>{tarihYaz(n, t.agOlum)}</span>
                  </button>
                )) : <div className="px-3 py-2 text-sm" style={{ color: C.solukInk }}>{t.agKayitYok}</div>}
              </div>
            )}
  
            {/* Buyutec ikonu kutunun ICINDE, mutlak konumlu; yazi
                alani ona yer acmak icin soldan paylı. Ikon
                `pointerEvents: none` -- ustune tiklayinca da kutu
                odaklansin. */}
            <div className="relative">
              <svg viewBox="0 0 16 16" aria-hidden="true"
                style={{ position: "absolute", left: 8, top: "50%", marginTop: -7,
                         width: 14, height: 14, pointerEvents: "none" }}
                fill="none" stroke={C.solukInk} strokeWidth="1.6"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 L14 14" />
              </svg>
              <input value={arama}
                onChange={(e) => { setArama(e.target.value); setAcikArama(true); }}
                onFocus={() => setAcikArama(true)}
                placeholder={t.agAra}
                className="w-full py-1.5 pr-3 text-sm border rounded-sm shadow-sm outline-none"
                style={{ paddingLeft: 28, background: C.tuval, borderColor: C.cizgi, color: C.ink }} />
            </div>
          </div>
  
          {/* ---- sabit bilgi paneli ---- */}
          {secRavi && (
            <div ref={kartRef} className="absolute z-20 shadow-lg select-text gizli-kaydirma"
              style={{
                /* Dar ekranda kart TAM GENISLIK ve kontrol kumesinin
                   USTUNDE (kume ~106 px + 12 pay). Yan yana koymak
                   telefonda karti 95 px'e dusuruyordu. Genis ekranda
                   eskisi gibi solda, yalnizca kumeye ayrilan pay 280'den
                   200'e indi -- kume daraldi. */
                /* Genis ekranda kart sayfa genisliginin YARISI ve kume
                   yaninda duruyor. DAR EKRANDA TAM GENISLIK: yan yana
                   dizilisde karta 180-200 px kaliyordu ve hoca/talebe
                   cipleri okunmuyordu (Mustafa, 2026-08-29). Kume o
                   zaman kartin ustune cikiyor. */
                left: 12, bottom: 12, right: dar ? 12 : undefined,
                width: dar ? undefined : "50%",
                minWidth: dar ? undefined : 180,
                maxWidth: dar ? undefined : "calc(100% - 36px - max(15%, 152px))",
                height: 130, overflowY: "auto", overflowX: "hidden",
                background: C.kart, border: "1px solid " + C.cizgi,
                borderRadius: 2, padding: 16,
              }}
              data-ustlik
              onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}>
              <button onClick={() => setSecim(null)}
                className="absolute top-2 right-3" style={{ color: C.solukInk }}>×</button>
              <div className="flex items-baseline gap-3 flex-wrap pr-6">
                <h2 className="text-xl">{adi(secRavi)}</h2>
                {/* Arapca modda BASLIK ZATEN Arapca (adi() n.ar donuyor);
                    bu satir da eklenince isim iki kez yaziliyordu. */}
                {language !== "ar" && (
                  <span className="text-lg" style={{ color: C.ink }} dir="rtl">{secRavi.ar}</span>
                )}
                <span className="text-xs" style={{ color: C.vurguInk }}>
                  {tarihYaz(secRavi, t.agOlum)} · {beldeAdi(secRavi.belde)} · {TAB_AD[secRavi.tab]}{MUKSIRUN.has(secRavi.id) ? " · " + t.agMuksirun : ""}{MEDAR[secRavi.id] ? " · " + MEDAR_AD[MEDAR[secRavi.id]] : ""}{MUELLIF.has(secRavi.id) ? " · " + t.agMuellif : ""}
                </span>
              </div>
              {/* Not once ceviri tablosunda aranir (bkz. NOT_DIL), yoksa
                  Turkce aslina duser. */}
              {secRavi.not && <p className="text-sm mt-2 leading-relaxed" style={{ color: C.ink }}>
                {NOT_DIL[language]?.[secRavi.id] ?? secRavi.not}</p>}
              <div className="grid md:grid-cols-2 gap-5 mt-3 text-sm">
                {[[t.agHocalari, hocalar, disKayit.hoca, tumSayi.hoca],
                  [t.agTalebeleri, talebeler, disKayit.talebe, tumSayi.talebe]]
                  .map(([baslik, liste, disListe, toplam]) => (
                  <div key={baslik}>
                    {/* Sayi TERCEMEDEKI toplam: agda cizili olanlar + ag
                        disinda kalanlar. Parantez ici yalnizca cizili
                        olani sayarsa kart tercemeyi eksik gosterir. */}
                    {/* Parantez ici TERCEMEDEKI toplam. Tavan asilmissa
                        "100 / 338" gibi yaziliyor -- ziyaretci kartta
                        gordugunun tamami olmadigini bilsin. */}
                    <div className="text-[11px] uppercase tracking-wider mb-1.5" style={{ color: C.vurguInk }}>
                      {baslik} ({liste.length + disListe.length < toplam
                        ? `${liste.length + disListe.length} / ${toplam}`
                        : toplam})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {liste.map((h) => (
                        <button key={h.n.id} onClick={() => odaklan(h.n.id)} title={h.k}
                          className="px-2 py-0.5 border rounded-sm" style={{ borderColor: C.cizgi, color: C.ink }}>
                          {adi(h.n)} <span className="text-xs" style={{ color: C.solukInk }} dir="rtl">{h.r}</span>
                        </button>
                      ))}
                      {/* Ag disindakiler: kesikli cerceve ve solgun renk --
                          tiklanabilir olmadiklari bakinca anlasilsin. */}
                      {disListe.map(([ad, r], i) => (
                        <span key={"d" + i} dir="rtl"
                          className="px-2 py-0.5 border border-dashed rounded-sm" style={{ borderColor: C.kesikCerceve, color: C.solukInk }}>
                          {ad} {r !== "—" && <span className="text-[#B5AC93] text-xs">{r}</span>}
                        </span>
                      ))}
                      {!liste.length && !disListe.length && (
                        <span style={{ color: C.solukInk }}>{t.agKayitYok}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
  
          {secKenar && (() => {
            const hoca = NODES.find((n) => n.id === secKenar.a);
            const talebe = NODES.find((n) => n.id === secKenar.b);
            return (
              <div ref={kartRef} className="absolute z-20 shadow-lg select-text gizli-kaydirma"
                style={{
                  left: 12, bottom: 12, right: dar ? 12 : undefined,
                  width: dar ? undefined : "50%",
                  minWidth: dar ? undefined : 180,
                  maxWidth: dar ? undefined : "calc(100% - 36px - max(15%, 152px))",
                  maxHeight: 130, overflowY: "auto",
                  background: C.kart, border: "1px solid " + C.cizgi,
                  borderRadius: 2, padding: 16,
                }}
                data-ustlik onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
                <button onClick={() => setSecim(null)}
                  className="absolute top-2 right-3" style={{ color: C.solukInk }}>×</button>
                <div className="text-[11px] uppercase tracking-wider mb-2" style={{ color: C.kenarSecili }}>{t.agRivayetBagi}</div>
                <div className="flex items-center gap-3 flex-wrap pr-6">
                  <button onClick={() => odaklan(hoca.id)} className="text-left hover:underline">
                    <div className="text-base">{adi(hoca)}</div>
                    <div className="text-xs" style={{ color: C.solukInk }}>{tarihYaz(hoca, t.agOlum)} · {beldeAdi(hoca.belde)}</div>
                  </button>
                  <span className="text-lg" style={{ color: C.kenarSecili }}>→</span>
                  <button onClick={() => odaklan(talebe.id)} className="text-left hover:underline">
                    <div className="text-base">{adi(talebe)}</div>
                    <div className="text-xs" style={{ color: C.solukInk }}>{tarihYaz(talebe, t.agOlum)} · {beldeAdi(talebe.belde)}</div>
                  </button>
                </div>
                <p className="text-xs mt-3" style={{ color: C.ink }}>
                  {t.agKaynak} {secKenar.k}. {t.agTahricRumuzu} <span dir="rtl" className="text-sm">{secKenar.r}</span>.
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };
}
