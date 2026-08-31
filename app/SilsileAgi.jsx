"use client";

/* SILSILE AGI GORSELLESTIRMESI. Bu dosya bir artifact'ten OLDUGU GIBI
   alindi; icerigi hala hizla degistigi icin site tarafinda elle yapilan
   degisiklikler EN AZDA tutuluyor. Yeni surum gelince dosyanin ustune
   yazip yalnizca asagidaki bes noktayi tekrar uygulamak yetiyor:

   1) Bu "use client" satiri. App Router'da bir dosya varsayilan olarak
      SUNUCU bileseni; useState/useEffect ve fare olaylari orada
      calismaz. Artifact tarayicida durdugu icin bunu bilmiyor.
   2) Kok div'de `h-screen` DEGIL `h-full`. Artifact tek basina bir
      sayfaydi, tam ekran kapliyordu; burada kapsayicinin -- yani
      /ag-sinamasi sayfasinin ona ayirdigi yerin -- boyunu almasi
      gerekiyor.
   3) KOK DIV'IN HEMEN ICINDEKI <header> SILINDI. Artifact'te ustte
      iki satirlik bir baslik vardi ("MIZZI, TEHZIBU'L-KEMAL ..." ve
      "Silsile Agi"). Mustafa'nin karari, 2026-08-29: sayfa tamamen
      gorsellestirmeden ibaret olsun, ne site basligi ne agin kendi
      basligi dursun. Dar ekranda o baslik iki satira sariyor ve
      ekranin besde birini yiyordu.
   4) `.jsx` uzanti, `.tsx` DEGIL. Proje TypeScript ama tsconfig'in
      `include` listesi yalnizca .ts/.tsx tariyor, yani bu dosya tip
      denetiminden gecmiyor -- Next.js `allowJs` ile derliyor.
      Artifact tip bilgisi tasimadigi icin (`useState(null)` gibi)
      .tsx yapmak her surumde bastan tip yazmak demek olurdu.
      Gorsellestirme oturdugunda .tsx'e cevrilebilir.

   5) DOKUNMA DESTEGI ve DAR EKRAN ACILISI. Artifact tuvali yalnizca
      fare olaylarini dinliyordu, bu yuzden telefonda ag kaydirilamiyor
      ve yakinlastirilamiyordu (2026-08-29'da fark edildi). Iki ekleme
      yapildi, ikisi de yerinde ayrica anlatildi:
        - Tuvalin isleyicileri pointer olaylarina cevrildi ve iki
          parmakla yakinlastirma eklendi (bkz. pointerBas /
          pointerKimilda / pointerBirak).
        - Acilis gorunumu dar ekranda tuvali dolduruyor (bkz.
          `baslangic`); eskiden agin tamami sigdiriliyordu ve telefonda
          ekranin ucte ikisi bos kaliyordu.
      Yeni artifact surumu bunlari kendi icinde cozuyorsa bu madde
      dusebilir; cozmuyorsa tekrar uygulanmali. */
import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";
/* Veri modulunun TAMAMI iceri aliniyor. Secici bir liste uc kez
   eksik cikti (POS, YIL_MAX, useLanguage); kullanilmayan ad zaten
   paketlemede eleniyor, eksik ad ise sayfayi calisma aninda kiriyor. */
import {
  ALT, ASGARI_DY, BANT, BELDELER, BELDE_AD, DERECE, DIA, DIS, E, EDGES,
  EKRAN_PUNTO, EKRAN_R_ARTIS, EN_AZ_EKRAN_R, ESIK, H, HULEFA, ING_HARF,
  ING_SOZLUK, KADEME, KART_TAVAN, KAVIS, KAVIS_OLCEK, KUME_EN_AZ, MEDAR,
  MEDINE, MUELLIF, MUKSIRUN, N, NEBI_RENK, NODES, NOT_DIL, PALET, POS,
  R_TAVAN, SATIRLAR, SATIR_YIL, SERIT_W, SOL_BANT, SOL_PAY, SUTUNLAR,
  TAB, TAHMIN, UST, UST_BANT, W, YILLAR, YIL_EKI, YIL_MAX, YIL_MIN,
  buyuk, dagit, ek, ingAd, miladiKestirim, rEkranOf, rOf, renkOf,
  salSayi, tahminiYil, tarihYaz, veriyiDenetle, yOf
} from "./silsileVeri";

export default function SilsileAgi() {
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
    kenarCanli: "#9C8F5A", okVurgu: "#A9603F",
    damaA: "#FFFFFF", damaAOp: 0.040, damaB: "#FFFFFF", damaBOp: 0.014,
    satirA: "#FFFFFF", satirAOp: 0.030, satirB: "#FFFFFF", satirBOp: 0.010,
  } : {
    zemin: "#FBF9F4", tuval: "#FFFFFF", kart: "rgba(255,255,255,0.97)",
    cizgi: "#D8D0BF", ink: "#23201B", solukInk: "#8C8676", vurguInk: "#8A7A34",
    kenar: "#6F6438", kenarSonuk: "#B3A88E", kenarSecili: "#B5462B",
    okSonuk: "#C9BFA8", dugumCerceve: "white", etiketHale: "#FFFFFF",
    etiketAna: "#2B2721", etiketAlt: "#8C8676", sonucVurgu: "#F5F1E6",
    kesikCerceve: "#E0D8C6",
    kenarCanli: "#8A7A34", okVurgu: "#B5462B",
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
    const YAN = 130, UST_PAY = 70, ALT_PAY = 190;
    if (cw >= gw) x = Math.min(SOL_BANT + YAN, Math.max(box.w - cw - YAN, x));
    else x = SOL_BANT + (gw - cw) / 2;
    if (ch >= gh) y = Math.min(UST_BANT + UST_PAY, Math.max(box.h - ch - ALT_PAY, y));
    else y = Math.min(UST_BANT + (gh - ch) / 2, UST_BANT + UST_PAY);
    return { k: v.k, x, y };
  }, [box]);

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
    const k = Math.min(kSigdir * 12, 0.08);
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
    const q = arama.trim().toLowerCase();
    if (!q) return [];
    return NODES.filter((n) => n.tr.toLowerCase().includes(q) || n.ar.includes(arama.trim()))
      .sort((a, b) => (a.olum ?? 999) - (b.olum ?? 999));
  }, [arama]);

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

    /* YUKARI GIDERKEN ONCE SAYFAYI GERI SAR. Footer gorunur haldeyken
       tekerlegi yukari cevirince ag kayiyor ve footer ekranda asili
       kaliyordu (Mustafa, 2026-08-29). Sayfa tepeye donmeden ag'a
       dokunulmuyor -- asagi inerken isleyen kuralin aynadaki hali. */
    if (ev.deltaY < 0 && window.scrollY > 0) return;

    const hedef = { ...view, y: view.y - ev.deltaY };
    const sonuc = sinirla(hedef);
    // sinir yuzunden hic kimildamadiysak tekerlek sayfaya kalsin
    if (ev.deltaY > 0 && Math.abs(sonuc.y - view.y) < 0.5) return;
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
    kaydir({ k, x: (box.w + SOL_BANT) / 2 - p.x * k, y: (box.h + UST_BANT) / 2 - p.y * k }, 620);
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
    const bosluk = rOf(e.b) + 10;
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

  const agGovdesi = useMemo(() => (
    <g transform={`scale(${kg})`}>
            <rect x={-W} y={-H} width={W * 3} height={H * 3} fill={C.tuval} />
            {SUTUNLAR.map((c, i) => {
              const ilk = i === 0, son = i === SUTUNLAR.length - 1;
              // taşma payında beyaz alan görünmesin diye uç sütunlar yanlara uzatılır
              const zx = ilk ? -W : c.x;
              const zw = (son ? W * 2 : c.x + c.genislik) - zx;
              return (
                <g key={c.belde}>
                  {/* Serit rengi Medine'den baslayip BIRER ATLAYARAK
                      tekrar ediyor: Misir, Sam, Medine, Vasit, Cibal,
                      Maveraunnehir ayni ton. Onceden yalnizca Medine
                      ayriydi, digerleri birbirinin ayniydi ve sutun
                      sinirlari zor secikiyordu (Mustafa, 2026-08-29).
                      Parite indise degil MEDINE'YE gore: araya yeni bir
                      belde girse (Yemen girdi) Medine tonunu kaybetmesin. */}
                  <rect x={zx} y={-H} width={zw} height={H * 3}
                    fill={(i - MEDINE_I) % 2 === 0 ? C.damaA : C.damaB}
                    opacity={(i - MEDINE_I) % 2 === 0 ? C.damaAOp : C.damaBOp} />
                  {!ilk && (
                    <line x1={c.x} y1={-H} x2={c.x} y2={H * 2}
                      stroke={C.cizgi} strokeWidth="1.2" opacity="0.7" />
                  )}
                </g>
              );
            })}
            {/* 25'er yillik damali satirlar. Sutun seritlerinin USTUNE
                cizilliyor ki iki desen carpisip birbirini bozmasin;
                ikisi de cok soluk oldugu icin ust uste gelen yerde
                yalnizca bir tik koyulasiyor. */}
            {SATIRLAR.map((y, i) => {
              /* UC BANTLAR TUVALIN DISINA UZATILIYOR, tipki sutunlarda
                 oldugu gibi. Eskiden bantlar eksenin sinirlarinda
                 (YIL_MIN / YIL_MAX) kesiliyordu; ust sinirin YUKARISI
                 -- Hz. Peygamber'in durdugu pay -- hicbir banda
                 girmediginden orada renksiz bir serit kaliyordu
                 (Mustafa'nin ekran goruntusu, 2026-08-29). Ilk bant
                 yukari, son bant asagi tasiyor. */
              const ilk = i === 0, son = i === SATIRLAR.length - 1;
              const ust = ilk ? -H : yOf(y);
              const alt = son ? H * 2 : yOf(Math.min(y + SATIR_YIL, YIL_MAX));
              if (alt <= ust) return null;
              return (
                <rect key={"s" + y} x={-W} y={ust} width={W * 3} height={alt - ust}
                  fill={i % 2 === 0 ? C.satirA : C.satirB}
                  opacity={i % 2 === 0 ? C.satirAOp : C.satirBOp} />
              );
            })}
            {YILLAR.map((y) => (
              <line key={y} x1="0" y1={yOf(y)} x2={W} y2={yOf(y)}
                stroke={C.cizgi} strokeWidth="1" opacity={y % 50 === 0 ? 0.85 : 0.28} />
            ))}

            {/* kenarlar */}
            {/* KENARLAR IKI YOLDAN CIZILIYOR.

                UZAKTA (yakin degilken) vurgusuz kenarlarin hepsi TEK
                BIR <path> icinde birlestiriliyor. Her kenar ayri bir
                eleman oldugunda uzaklasilmis gorunumde ~1400 yol
                olusuyor; hepsi ayni renk ve kalinlikta cizildigi icin
                bunu tek bir yolun alt parcalari olarak vermek ayni
                goruntuyu veriyor ve tarayicinin isini yuzlerce kat
                azaltiyor. Tiklama seritleri ve ok uclari zaten uzakta
                cizilmiyordu.

                YAKINDA ve VURGULULARDA kenarlar tek tek: her birinin
                kendi rengi, kalinligi, ok ucu ve tiklama seridi var. */}
            {!yakin && (() => {
              const dimD = [], normalD = [];
              for (const e of EDGES) {
                const pa = POS[e.a], pb = POS[e.b];
                if (!pa || !pb || !kenarIcerde(pa, pb)) continue;
                if (vurgu && (vurgu.has(e.a) || vurgu.has(e.b))) continue;
                /* EKRANDA UC PIKSELDEN KISA KALAN KENAR CIZILMIYOR.

                   Uzaklasinca butun kenarlar tek yolda birlesiyor ve o
                   yol telefonda 434 alt parca / 52 KB'a cikiyordu
                   (olculdu, 2026-08-30). Eleman sayisi dusuk ama
                   BOYANAN GEOMETRI buyuk: tarayici her karede her
                   kubigi duz parcalara bolup kenar yumusatmasiyla
                   tariyor. Kullanicinin "ekrana daha fazla veri
                   sigdikca kasma artiyor" dedigi sey buydu.

                   Bu suzgec 434 parcayi 188'e, 52 KB'i 22 KB'a
                   dusuruyor ve hicbir sey kaybettirmiyor -- uc piksel
                   uzunlugundaki bir kenar zaten gorunmuyor. */
                if (Math.hypot(pb.x - pa.x, pb.y - pa.y) * kg < 3) continue;
                const yol = kenarYolu(e);
                if (!yol) continue;
                (kenarSonuk(e) ? dimD : normalD).push(yol);
              }
              /* BURADA `non-scaling-stroke` YOK, kalinlik elle olcege
                 bolunuyor.

                 Sebep: non-scaling-stroke kalemi CIHAZ uzayinda
                 uretmek zorunda, yani donusum her degistiginde
                 tarayici butun kenar seridini yeniden kuruyor. Tek bir
                 yolda 188 alt parca varken bu her kaydirma karesinde
                 tekrarlanan bir is demek ve Blink'te bilinen bir yavas
                 yol. Govde zaten `scale(kg)` icinde durdugu icin
                 `w / kg` ayni ekran kalinligini veriyor, kalem de
                 kullanici uzayinda bir kez kuruluyor.

                 Kucuk bedel: parmak yakinlastirirken (view.k ile kg
                 ayrildiginda) cizgiler bir miktar kalinlasip
                 inceliyor, parmak kalkinca yerine oturuyor. Punto ve
                 yaricap zaten ayni sekilde davraniyordu. */
              const ortak = { fill: "none", style: { pointerEvents: "none" } };
              return (
                <g>
                  {dimD.length > 0 && (
                    <path {...ortak} d={dimD.join(" ")} stroke={C.kenarSonuk}
                      strokeWidth={(0.7 * cizgiCarpani) / kg} opacity={0.5 * cizgiSaydam} />
                  )}
                  {normalD.length > 0 && (
                    <path {...ortak} d={normalD.join(" ")} stroke={C.kenar}
                      strokeWidth={(1.2 * cizgiCarpani) / kg} opacity={0.85 * cizgiSaydam} />
                  )}
                </g>
              );
            })()}

            {EDGES.map((e, i) => {
              const pa = POS[e.a], pb = POS[e.b];
              if (!pa || !pb) return null;
              if (!kenarIcerde(pa, pb)) return null;
              const dim = kenarSonuk(e);
              const secili = secKenar && secKenar.a === e.a && secKenar.b === e.b;
              const canli = !secili && !!(secim && secim.tur === "ravi" &&
                (e.a === secim.id || e.b === secim.id));
              // uzakta vurgusuzler yukaridaki birlesik yola girdi
              if (!yakin && !secili && !canli) return null;
              const d = kenarYolu(e);
              if (!d) return null;
              return (
                <g key={i}>
                  {yakin && (
                    <path d={d} fill="none" stroke="transparent" strokeWidth={16 / kg}
                      style={{ cursor: "pointer", pointerEvents: "stroke" }}
                      onPointerUp={(ev) => {
                        ev.stopPropagation(); pointerBirak(ev);
                        if (!tasindiRef.current) setSecim({ tur: "kenar", e });
                      }} />
                  )}
                  <path d={d} fill="none"
                    className={"kenar" + (canli && akisAnim ? (dar ? " kenar-y" : " kenar-v") : "")}
                    /* Kesik deseni ve akis mesafesi de olcege bolunuyor:
                       kalem artik kullanici uzayinda kuruldugu icin
                       sabit 14/8 birakilsa desen uzaklastikca
                       gorunmez, yakinlasinca devasa olurdu. */
                    strokeDasharray={canli && akisAnim ? `${14 / kg} ${8 / kg}` : undefined}
                    style={canli && akisAnim
                      ? { pointerEvents: "none", "--akis": `${-44 / kg}` }
                      : { pointerEvents: "none" }}
                    stroke={secili ? C.kenarSecili : canli ? C.kenarCanli : dim ? C.kenarSonuk : C.kenar}
                    /* Vurgulu kenarlar da uzaklastikca inceliyor.
                       Sabit kalinlikta birakildiginda bir raviye
                       tiklaninca 60 kenar tam kalinlikta ciziliyor ve
                       ekrani kapliyordu (Mustafa'nin ekran goruntusu,
                       2026-08-29). Secili TEK kenar sabit kaliyor --
                       o zaten bir tane. */
                    /* Vurgulu kenar uzaklikla bir miktar inceliyor ama
                       tabani yuksek: 0.55'te birakilinca telefonda
                       cizgiler secilemiyordu (Mustafa, 2026-08-29).
                       Sonuk kenarlar ise iyice geri cekildi -- vurgu
                       kalinliktan cok KARSITLIKTAN dogsun. */
                    strokeWidth={((secili ? 2.6 : canli ? 2 : dim ? 0.6 : 1.2) *
                                  (secili ? 1 : Math.max(canli ? 0.9 : 0, cizgiCarpani))) / kg}
                    opacity={secili ? 1 : canli ? 0.95
                             : (dim ? 0.22 : 0.85) * cizgiSaydam}
                    markerEnd={secili || canli ? "url(#okVurgu)"
                               : !yakin ? undefined
                               : dim ? "url(#okSonuk)" : "url(#ok)"} />
                </g>
              );
            })}

            {/* düğümler */}
            {NODES.map((n) => {
              const p = POS[n.id];
              if (!p) return null;
              if (!icerde(p)) return null;
              const d = sonuk(n.id);
              const dg = DERECE[n.id] || 0;
              const r = rEkranOf(n.id, kg) / kg;
              const secili = secRavi && secRavi.id === n.id;
              // halesi olan = one cikan dugum (salinim ve hale bunlara ozel)
              const onCikan = susAnimasyon && !!(MEDAR[n.id] || MUKSIRUN.has(n.id) ||
                                 MUELLIF.has(n.id) || n.id === "nebi");
              return (
                <g key={n.id} className="dugum" transform={`translate(${p.x},${p.y})`}
                  onPointerUp={(ev) => { ev.stopPropagation(); pointerBirak(ev); if (!tasindiRef.current) odaklan(n.id); }}
                  style={{ cursor: "pointer", opacity: d ? 0.14 : 1 }}>
                  {/* SALINIM YALNIZCA ONE CIKAN DUGUMLERDE (halesi
                      olanlar: Hz. Peygamber, muksirun, medar, muellif --
                      541 dugumun 38'i). Eskiden HEPSI salinirdi.

                      Sebep, olculdu: salinan her dugum surekli isleyen
                      bir transform animasyonu demek ve tarayici bunlarin
                      her birine ayri bir birlestirme katmani acar. 541
                      katman telefonu dize getiriyordu -- kullanicinin
                      "asiri kasma" dedigi sey buydu. 38 katman rahat.

                      Sahnenin nefes almasi korunuyor: goz zaten bu
                      isimlerde. Hepsine geri istenirse asagidaki kosul
                      kaldirilir. */}
                  <g className={onCikan
                        ? `salinim sal${(salSayi(n.id) % 4) + 1}`
                        : undefined}
                     /* Sureler 2026-08-29'da yaklasik iki kat
                        hizlandirildi: 3.4-5.9 sn araligi 1.5-2.5 sn
                        oldu. Dugumden dugume degismesi kasitli --
                        hepsi ayni tempoda salinsa sahne makine gibi
                        gorunuyor. */
                     style={onCikan
                        ? { "--sure": `${1.5 + (salSayi(n.id) % 26) / 25}s`,
                            "--gec": `${-(salSayi(n.id) % 60) / 20}s` }
                        : undefined}>
                  {onCikan && (
                    <circle className="hale" r={r + 14} fill="none"
                      stroke={n.id === "nebi" ? NEBI_RENK : renkOf(n.id)} strokeWidth="3"
                      style={{ animationDelay: `${(salSayi(n.id) % 30) / 20}s` }} />
                  )}
                  {MUKSIRUN.has(n.id) && (
                    <circle r={r + 8} fill="none" stroke={renkOf(n.id)}
                      strokeWidth="2.4" opacity="0.55" />
                  )}
                  {MEDAR[n.id] && (
                    <rect x={-(r + 10)} y={-(r + 10)} width={(r + 10) * 2} height={(r + 10) * 2}
                      fill="none" stroke={renkOf(n.id)} strokeWidth="2.4" opacity="0.6"
                      transform="rotate(45)" />
                  )}
                  <circle className={"ana" + (acildi ? "" : " acilis")}
                    r={r}
                    style={acildi ? undefined : { animationDelay: `${Math.min(p.y / H, 1) * 1500}ms` }}
                    fill={n.id === "nebi" ? NEBI_RENK : renkOf(n.id)}
                    stroke={secili ? C.ink : "white"} strokeWidth={secili ? 3.4 : 2} />
                  </g>
                </g>
              );
            })}

            {/* ---- etiketler ----
                AYRI BIR GECISTE ve butun noktalardan SONRA ciziliyor.
                Onceden her etiket kendi dugum grubunun icindeydi; SVG
                belge sirasina gore boyadigi icin sonra gelen bir
                dugumun dairesi, onceki bir dugumun yazisinin uzerine
                biniyordu. Ayri gecis butun yazilari butun dairelerin
                ustune aliyor.

                Yalnizca etiketi olan dugumler donuluyor (etiketliler
                ~100 kayit tutuyor, 541 degil). Etiket salinim grubunun
                da disinda: yazilar oynamiyor. */}
            {NODES.map((n) => {
              const etiketBilgi = etiketliler.get(n.id);
              if (!etiketBilgi || !POS[n.id]) return null;
              const p = POS[n.id];
              const r = rEkranOf(n.id, kg) / kg;
              const kad = KADEME(n.id);
              const punto = Math.max(EKRAN_PUNTO[kad] / kg, r * 0.42);
              const altPunto = punto * 0.8;
              return (
                /* ISIMLER DE TIKLANABILIR (2026-08-30). Onceden bu grup
                   `pointerEvents="none"` tasiyordu, yalnizca nokta
                   tiklanabiliyordu -- oysa gozun gittigi yer isim, hedefi
                   de nokta degil isim. Isleyici dugumunkinin AYNISI.

                   Kaydirma bozulmuyor: pointerdown burada durdurulmuyor,
                   tuvale kadar cikip `pointerBas`i tetikliyor. Suruklendi
                   mi diye `tasindiRef` bakiliyor, yani ismin uzerinden
                   baslayan bir suruklemede odaklanma OLMUYOR.

                   Hedef alani yazinin kendi geometrisi. Metnin altinda
                   `paintOrder: stroke` ile cizilen kalin bir hale var ve o
                   da BOYANMIS sayildigi icin tiklama payi harflerden biraz
                   genis. `bounding-box` denenmedi, tarayici destegi
                   kirilgan. */
                <g key={n.id} className="etiket"
                   onPointerUp={(ev) => { ev.stopPropagation(); pointerBirak(ev); if (!tasindiRef.current) odaklan(n.id); }}
                   style={{ cursor: "pointer", paintOrder: "stroke", stroke: C.etiketHale, strokeWidth: punto * 0.32,
                            opacity: sonuk(n.id) ? 0.12 : 1 }}
                   transform={`translate(${p.x + etiketBilgi.kay / kg},${
                     p.y + (etiketBilgi.yon === "ust"
                       ? -(2 * r + punto + altPunto + 8) : 0)})`}>
                  <text y={r + punto} textAnchor="middle" fontSize={punto}
                    fontWeight={kad <= 1 ? 600 : 400} fill={C.etiketAna}>
                    {adi(n).length > 26 ? adi(n).slice(0, 25) + "…" : adi(n)}
                  </text>
                  <text y={r + punto + altPunto + 3} textAnchor="middle"
                    fontSize={altPunto} fill={C.solukInk}>{tarihYaz(n, t.agOlum)}</text>
                </g>
              );
            })}
    </g>
  /* `koyu` bagimlilikta: tema degisince govde bastan kurulmali,
     yoksa donmus agac eski paletle kalir. Palet nesnesi `C` her
     render'da yeniden uretildigi icin onu koymak memo'yu bosa
     cikarirdi -- yerine tek bir mantiksal deger. */
  ), [kg, box, olculdu, pencere, secim, secRavi, secKenar, acildi,
      vurgu, etiketliler, yakin, cizgiCarpani, cizgiSaydam, MEDINE_I, adi, koyu,
      susAnimasyon, akisAnim, dar, t]);

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
          pointerBirak(e);
          if (sonParmak && !tasindiRef.current) { setSecim(null); setAcikArama(false); }
        }}
        onPointerCancel={pointerBirak}
        onPointerLeave={pointerBirak}>

        {/* ---- ana tuval ---- */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <style>{`
            @keyframes akisY  { to { stroke-dashoffset: var(--akis, -44); } }
            @keyframes belir  { from { opacity: 0; transform: scale(0.4); }
                                to   { opacity: 1; transform: scale(1); } }
            @keyframes salin1 { 0%   { transform: translate(0,0); }
                                25%  { transform: translate(19px,-13px); }
                                50%  { transform: translate(9px,17px); }
                                75%  { transform: translate(-17px,8px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin2 { 0%   { transform: translate(0,0); }
                                25%  { transform: translate(-15px,-16px); }
                                50%  { transform: translate(14px,-6px); }
                                75%  { transform: translate(6px,18px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin3 { 0%   { transform: translate(0,0); }
                                20%  { transform: translate(13px,14px); }
                                45%  { transform: translate(-11px,17px); }
                                70%  { transform: translate(-18px,-9px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin4 { 0%   { transform: translate(0,0); }
                                30%  { transform: translate(-20px,6px); }
                                55%  { transform: translate(-4px,-17px); }
                                80%  { transform: translate(16px,11px); }
                                100% { transform: translate(0,0); } }
            @keyframes hale   { 0%,100% { opacity: .30; transform: scale(1); }
                                50%     { opacity: .06; transform: scale(1.55); } }
            .kenar   { transition: stroke .35s ease, stroke-width .35s ease, opacity .35s ease; }
            /* AKIS HER IKI CIHAZDA DA ADIMLI. Duz (linear) surum
               saniyede 60 kez boyuyordu ve bir raviye tiklaninca
               60 kenar birden canlandigi icin masaustunde fan
               calisiyordu (Mustafa, 2026-08-30). steps() ile deger
               yalnizca adim sinirlarinda degisiyor, arada hicbir sey
               gecersiz olmuyor: masaustu ~9, telefon ~5 boyama/sn.
               Goz akisi yine akis olarak okuyor. */
            .kenar-v { animation: akisY 1.8s steps(16) infinite; }
            /* AKISIN UCUZ SURUMU (telefon). Suresi uzun degil, ADIMLI:
               steps(12) ile tarayici saniyede 60 kez degil ~5 kez
               boyuyor. Kasmanin sebebi hizin kendisi degil, her
               karede kocaman bir SVG katmaninin gecersiz olmasiydi;
               adim sayisini dusurmek maliyeti dogrudan bolüyor.
               Dasharray 14+8=22, bir tur -44 -> baslangica dikissiz
               doner (duz surumdeki -46 her turda 2 px zipliyordu). */
            .kenar-y { animation: akisY 2.6s steps(12) infinite; }
            /* Bilgi kartlarinin kaydirma cubugu gizli: kutu kaydiriliyor
               ama Windows'un ok basli gri cubugu tuvalin uzerinde
               yamalik duruyordu (Mustafa'nin eki, 2026-08-29). */
            .gizli-kaydirma { scrollbar-width: none; -ms-overflow-style: none; }
            .gizli-kaydirma::-webkit-scrollbar { width: 0; height: 0; display: none; }
            .dugum   { transition: opacity .35s ease; }
            .dugum circle.ana { transition: r .28s cubic-bezier(.34,1.4,.5,1), stroke-width .2s ease; }
            /* Imlec geri bildirimi SAF CSS. React'e hic ugramiyor,
               dolayisiyla hicbir sey yeniden cizilmiyor. */
            .dugum:hover circle.ana { stroke: #23201B; stroke-width: 3; }
            .etiket  { transition: opacity .3s ease; }
            .acilis  { animation: belir .85s cubic-bezier(.22,1,.36,1) backwards; transform-box: fill-box; transform-origin: center; }
            .salinim { animation-duration: var(--sure); animation-timing-function: linear;
                       animation-iteration-count: infinite; animation-delay: var(--gec);
                       will-change: transform; }
            .sal1 { animation-name: salin1; }
            .sal2 { animation-name: salin2; }
            .sal3 { animation-name: salin3; }
            .sal4 { animation-name: salin4; }
            .hale    { animation: hale 1.8s ease-in-out infinite;
                       transform-box: fill-box; transform-origin: center; }
          `}</style>
          <defs>
            <marker id="ok" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.vurguInk} />
            </marker>
            <marker id="okSonuk" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.okSonuk} />
            </marker>
            <marker id="okVurgu" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={C.okVurgu} />
            </marker>
          </defs>

          {/* Konum burada, govde disarida (bkz. agGovdesi): kaydirinca
              yalnizca bu nitelik degisiyor, altindaki agac degil. */}
          {/* `will-change: transform`: bu grup kendi birlestirme
              katmanina aliniyor. Kaydirmada nitelik degisen tek sey bu
              transform oldugu icin tarayici altindaki devasa yolu
              yeniden BOYAMAK yerine hazir katmani kaydiriyor. Katman
              eleme sayesinde en fazla ucte uc ekran buyuklugunde, yani
              bellek maliyeti sinirli. */}
          <g transform={`translate(${view.x},${view.y}) scale(${view.k / kg})`}
             style={{ visibility: olculdu ? undefined : "hidden",
                      willChange: "transform" }}>
            {agGovdesi}
          </g>
        </svg>

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
}
