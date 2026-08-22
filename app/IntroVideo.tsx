"use client";

import { useEffect, useState } from "react";
import ChromaKeyVideo from "./ChromaKeyVideo";

const VISIT_KEY = "introVideoVisitCount";

// Ziyaret sirasina gore donen videolar: her ziyaret siradakini gosterir,
// liste bitince bastan baslar (asagida mod alinarak).
/* Olculerin TAMAMI px degil vh -- mobil kirilim dahil.
   Tarayici yakinlastirmasi (Ctrl +) gorunum alanini CSS pikseli cinsinden
   kucultuyor: 180px'lik bir kutu ekranda BUYUYOR, ayni kutu vh ile
   verilirse ekranda ayni kaliyor. Referans: `/selam` sayfasindaki karakter
   (`h-[50vh] w-auto`), yakinlastirmadan hic etkilenmiyor.

   Once yalnizca MASAUSTU olculeri cevrilmisti, mobil olculer px kalmisti
   ("telefonda yakinlastirma duzeni degistirmiyor" gerekcesiyle). Bu
   EKSIKTI: masaustunde yeterince yakinlastirinca gorunum alani 768px'in
   altina dusuyor, `md:` kalkiyor ve px'li MOBIL olculer devreye giriyor --
   klip birden buyuyordu. Yakinlastirma bagisikligi ancak her iki kirilimda
   da px olmayinca saglaniyor.

   Cevrim: 1vh = 8px (800px yuksekliginde bir gorunum alani referans).

   Genislik mumkun oldugunca verilmiyor: `w-auto` + `max-w-none` ile
   genislik canvas'in kendi oranindan geliyor. Boylece kutu orani klibin
   oranindan sapamiyor ve object-contain'in yanlarda birakacagi olu bosluk
   sorunu ortadan kalkiyor (negatif kenar degerleri de dogrudan goruntunun
   kenarini olcuyor). `w-full` verilen mobil kliplerde de sorun yok:
   `w-full` her zaman ekranin tamami demek, yakinlastirmayla degismiyor. */
const VIDEOS: { src: string; className: string }[] = [
  {
    // Karakterin sagindaki seffaf bosluk yuzunden goruntu kenardan iceride
    // kaliyordu; negatif right ile o boslugu kapatiyoruz.
    src: "/Mustafa%20Thinking%20Green_seffaf.mp4",
    className:
      "fixed bottom-0 right-[-4vh] z-50 h-[16.875vh] w-auto max-w-none md:right-[-6vh] md:h-[22.5vh]",
  },
  {
    // Klip soldan %10, sagdan %20 kirpildigi icin 644x720. Genislik artik
    // verilmiyor (`w-auto`), klibin kendi oranindan geliyor -- mobil ve
    // masaustu kutularinin oranini ayri ayri elde tutmaya gerek kalmadi.
    // Yukseklik iki kirilimda da iki kez 20px kisaltildi (toplam 40px):
    // mobil 270 -> 230px (28.75vh), masaustu 34 -> 29vh (40px = 5vh).
    src: "/Derince%20Sunum.mp4",
    className:
      "fixed bottom-[-2.5vh] left-0 z-50 h-[28.75vh] w-auto max-w-none md:h-[29vh]",
  },
  {
    // Mobil: tam genislik, sol-alt. Masaustu: SAG-alt. Karakter ve kediler
    // karenin sag yarisinda duruyor (soldaki ~%43 bos), bu yuzden kutuyu
    // sola yaslamak karakteri ekranin ortasina itiyordu.
    // Resolve'dan "ProRes 4444 + Alpha" olarak gelen cekim
    // (Çalışma Alanı/Kediler.mov), renk anahtarlama olmadan dogrudan
    // paketlendi. Kaynak 1920x1080'di ama iki yaninda 108'er piksel bos
    // pay vardi, mobildeki `w-full` kutusunda konu ekran kenarlarina
    // degmiyordu; `cropdetect` ile olculup 1704x1080'e kirpildi (oran
    // 1.578 -- bu klibin yerini aldigi eski klibin oraniyla ayni).
    src: "/Kediler_seffaf.mp4",
    className:
      "fixed bottom-[-1.25vh] left-0 z-50 h-auto w-full md:left-auto md:right-0 md:h-[28vh] md:w-auto md:max-w-none",
  },
  {
    // Gokyuzu yesil cekilip seffaflastirildi, artik digerleri gibi kendi
    // kenari yok; kenar maskesine gerek kalmadi. Mobil: iki yana yasli
    // (w-full + h-auto ile oran kendiliginden korunur).
    src: "/Mustafa%20Yagmur_seffaf.mp4",
    className:
      "fixed bottom-0 left-0 z-50 h-auto w-full object-contain md:h-[22.5vh] md:w-auto md:max-w-none",
  },
];

export default function IntroVideo() {
  const [visitCount, setVisitCount] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(VISIT_KEY) ?? "0");
    const count = stored + 1;
    localStorage.setItem(VISIT_KEY, String(count));
    // Sayac localStorage'dan geliyor, sunucuda render sirasinda okunamaz.
    // Ilk render bilerek null donuyor (asagidaki erken cikis), yoksa sunucu
    // ciktisi ile istemci uyusmaz. Kural bu istisnayi tanimiyor.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisitCount(count);
  }, []);

  if (visitCount === null) return null;

  const video = VIDEOS[(visitCount - 1) % VIDEOS.length];

  return <ChromaKeyVideo src={video.src} className={video.className} />;
}
