"use client";

import { useEffect, useRef, useState } from "react";

/* Safari (iPhone ve Mac) WebM/VP9'un alfa kanalini desteklemiyor; oradaki
   klipler opak goruntuleniyordu. Bu yuzden klipler "paketlenmis alfa"
   olarak kodlaniyor: tek bir H.264 mp4'un ust yarisi renk (alfa ile
   onceden carpilmis), alt yarisi ayni karenin siyah-beyaz maskesi.
   H.264 her tarayicida oynadigi icin sorun tarayici bagimsiz cozuluyor;
   iki yariyi burada WebGL ile birlestirip seffafligi geri uretiyoruz.

   Renk onceden alfa ile carpildigi icin seffaf alanlar siyah: boylece
   H.264'un renk altornekleme si yesil perde artigini kenarlara tasimiyor.
   Canvas da varsayilan olarak onceden carpilmis alfa bekledigi icin
   shader ciktisi dogrudan uyumlu. */

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 uv;
void main() {
  uv = vec2((position.x + 1.0) * 0.5, (1.0 - position.y) * 0.5);
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `
precision mediump float;
varying vec2 uv;
uniform sampler2D frame;
uniform float texelY; // 1.0 / video.videoHeight
void main() {
  vec3 color = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  /* Maskenin ILK satirini OKUMA. Kaynak dosyada o satir temiz (olculdu:
     luma 0), ama tarayici yuv420p'yi RGB'ye cevirirken kroma satirlarini
     ARA DEGERLIYOR: kroma yarim cozunurlukte oldugu icin sinirin hemen
     ustundeki son RENK satirinin kromasi maskenin ilk satirina siziyor ve
     alfayi 0 yerine ~10/255 yapiyor. Sonuc, goruntunun UST KENARINDA tam
     genislikte ince bir cizgi (acik temada belli oluyor, siyahta degil).
     Renk yarisinin alt kenari ne kadar parlak/doygunsa cizgi o kadar
     gorunur: kose karakterlerinde fark edilmiyordu, alt kenari bastan
     basa col olan "Mustafa Rihle"de fark edildi (2026-08-20).
     Cozum: ust kenari 2.5 doku satiri icerden ornekle. 1.5 YETMEZ --
     mediump float (iOS'ta gercekten fp16 olabilir) 0.5 civarinda ~1
     satirlik adimlarla yuvarliyor ve kirli satira geri dusebiliyor.
     Bedeli: en ustteki 2 satirin alfasi ucuncu satirdan geliyor; o
     bolge bu kliplerin hepsinde zaten seffaf. */
  float alphaY = max(uv.y * 0.5 + 0.5, 0.5 + 2.5 * texelY);
  float alpha = texture2D(frame, vec2(uv.x, alphaY)).r;
  gl_FragColor = vec4(color, alpha);
}`;

function createProgram(gl: WebGLRenderingContext) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  return program;
}

/* Klip yolundan yedek poster yolunu turetir:
   "/Mustafa%20Karsilama_seffaf.mp4" -> "/poster/Mustafa%20Karsilama_seffaf.png"
   Posterler public/poster/ altinda, kliplerle AYNI adla duruyor. */
function posterYolu(src: string) {
  const egikCizgi = src.lastIndexOf("/");
  const klasor = src.slice(0, egikCizgi + 1);
  const dosya = src.slice(egikCizgi + 1).replace(/\.mp4$/i, ".png");
  return `${klasor}poster/${dosya}`;
}

export default function ChromaKeyVideo({
  src,
  className,
  loop = true,
}: {
  // Ust yarisi renk / alt yarisi maske olacak sekilde kodlanmis mp4.
  src: string;
  className?: string;
  /* Kose susu klipleri surekli donuyor, ama anasayfadaki animasyonlu logo
     bir kez oynayip son karesinde donuyor. Dondurma isi ek kod istemiyor:
     video bitince `requestVideoFrameCallback` yeni kare uretmedigi icin
     cizim dongusu kendiliginden duruyor ve canvas son kareyi tutuyor. */
  loop?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /* WebGL yolu tamamen basarisiz olursa (context alinamiyor, video hic
     yuklenmiyor, cihazda WebGL yok) canvas SONSUZA KADAR bos kalirdi.
     Bu durumda yerine statik poster gosteriliyor -- animasyon yok ama
     karakter/logo GORUNUYOR. */
  const [yedegeGec, setYedegeGec] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let stopped = false;
    let rafId = 0;
    let cizildi = false; // en az bir kare canvas'a gitti mi?
    let gozcu: ReturnType<typeof setTimeout> | null = null;
    let gl: WebGLRenderingContext | null = null;
    let texelYKonum: WebGLUniformLocation | null = null;
    let hasFrameCallback = false;

    /* --- WebGL kurulumu. Context kaybinda yeniden cagrilabilir. --- */
    function kur(): boolean {
      const ctx = canvas!.getContext("webgl", {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
      });
      if (!ctx) return false;
      const program = createProgram(ctx);
      if (!program) return false;
      ctx.useProgram(program);

      const buffer = ctx.createBuffer();
      ctx.bindBuffer(ctx.ARRAY_BUFFER, buffer);
      ctx.bufferData(
        ctx.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        ctx.STATIC_DRAW,
      );
      const position = ctx.getAttribLocation(program, "position");
      ctx.enableVertexAttribArray(position);
      ctx.vertexAttribPointer(position, 2, ctx.FLOAT, false, 0, 0);

      const texture = ctx.createTexture();
      ctx.bindTexture(ctx.TEXTURE_2D, texture);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR);
      ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR);

      texelYKonum = ctx.getUniformLocation(program, "texelY");
      gl = ctx;
      return true;
    }

    if (!kur()) {
      setYedegeGec(true);
      return;
    }

    const draw = () => {
      if (stopped || !gl) return;
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const width = video.videoWidth;
        const height = Math.floor(video.videoHeight / 2);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        gl.uniform1f(texelYKonum, 1 / video.videoHeight);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          video,
        );
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        cizildi = true;
      }
      schedule();
    };

    // requestVideoFrameCallback kareyi videoya kilitliyor; yoksa rAF.
    hasFrameCallback = "requestVideoFrameCallback" in video;
    const schedule = () => {
      if (stopped) return;
      if (hasFrameCallback) {
        rafId = video.requestVideoFrameCallback(draw);
      } else {
        rafId = requestAnimationFrame(draw);
      }
    };

    /* --- Oynatmayi ACIKCA baslat ---
       `autoPlay` niteligi bir ISTEKTIR, garanti degil: iOS Dusuk Guc Modu,
       veri/pil tasarrufu ve otomatik oynatma politikalari engelleyebiliyor.
       Engellenirse video hic oynamaz; `requestVideoFrameCallback` YALNIZCA
       yeni kare gosterildiginde tetiklendigi icin cizim dongusu hic
       calismaz ve canvas kalici olarak bos kalirdi. */
    const oynat = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    oynat();

    /* --- Gozcu ---
       Belirli sure sonunda hala tek kare bile cizilmediyse sirayla:
       1) oynatmayi tekrar dene,
       2) rVFC yerine rAF dongusune gec (video DURUYOR olsa bile, verisi
          varsa karesi cizilebilir -- autoplay engellendiginde animasyon
          olmaz ama karakter GORUNUR),
       3) hicbiri olmadiysa statik postere dus. */
    const gozcuBaslat = (ms: number, adim: number) => {
      gozcu = setTimeout(() => {
        if (stopped || cizildi) return;
        if (adim === 1) {
          oynat();
          if (hasFrameCallback) {
            // rVFC hic tetiklenmiyor olabilir; rAF'e gecip duraklatilmis
            // videonun mevcut karesini de cizebilir hale geliyoruz.
            hasFrameCallback = false;
            schedule();
          }
          gozcuBaslat(2500, 2);
        } else {
          setYedegeGec(true);
        }
      }, ms);
    };
    gozcuBaslat(1500, 1);

    /* --- Oynatma ORTASINDA takilma ---
       Gozcu YALNIZCA hic kare cizilmemisken ise yariyor: ilk kare
       cizilince `cizildi` kalici olarak true oluyor ve gozcu bir daha
       hicbir seye bakmiyor. Yani video basliyor, birkac kare cizip
       DURUYORSA kimse toparlamiyordu -- rVFC yeni kare gelmedigi icin
       susuyor ve canvas o yarim karede kaliyor.

       Bu, uzun klipte (HD-Animasyon 7.2 sn / 1.1 MB) kisa olandan
       (HD-Mini 2.0 sn / 0.29 MB) cok daha olasi: video ekranda 1x1
       piksel ve saydam durdugu icin bazi mobil tarayicilar onu "gizli"
       sayip kod cozmeyi kisiyor, zayif agda arabellek de tukeniyor.
       Kisa klip bu kisitlar devreye girmeden bitiyor, uzun olan
       ortasinda kaliyor.

       KLIBIN SONU HARIC TUTULUYOR: `loop={false}` kliplerin son karede
       donmasi KASITLI (bkz. `loop` prop'unun aciklamasi), orada
       yeniden oynatmak animasyonu bastan baslatir.

       Burada `ended` olayina BAKMAK YETMIYOR. HTML olcunune gore video
       dogal olarak bitince tarayici once `pause`, SONRA `ended`
       tetikliyor. `ended`i bekleyen bir bayrak, arada gelen `pause`
       sirasinda henuz kalkmamis oluyor ve toparlayici klibi bastan
       baslatiyordu -- anasayfa logosu bir yerine IKI kez oynuyordu
       (2026-08-30). O yuzden bayrak yerine oynatma KONUMUNA bakiliyor:
       konum sona dayanmissa bu bir takilma degil, klibin normal sonu.
       `video.ended` olcunde bir bayrak degil, konumdan HESAPLANAN bir
       ozellik; `pause` aninda zaten true oluyor. Yine de sureye gore
       ikinci bir esik konuldu, cunku bazi tarayicilar son karede
       currentTime'i duration'in bir tik altinda birakiyor.

       Donguye alinmis klipler (loop={true}) bu duruma hic girmiyor:
       onlar sona varinca duraklamiyor, basa sariyor. */
    const klibinSonuMu = () =>
      video.ended ||
      (Number.isFinite(video.duration) &&
        video.duration > 0 &&
        video.currentTime >= video.duration - 0.08);
    const takilmaToparla = () => {
      if (stopped || klibinSonuMu()) return;
      oynat();
      /* rVFC susmus olabilir; rAF'e gecmek duraklamis videonun mevcut
         karesini de cizilebilir kiliyor. */
      if (hasFrameCallback) {
        hasFrameCallback = false;
        schedule();
      }
    };
    video.addEventListener("waiting", takilmaToparla);
    video.addEventListener("stalled", takilmaToparla);
    video.addEventListener("pause", takilmaToparla);


    /* --- Context kaybi ---
       Mobilde sekme arka plana atilip donunce veya GPU baskisinda tarayici
       WebGL context'ini dusurebiliyor. Islenmezse canvas kalici bos kalir. */
    const contextKayboldu = (e: Event) => {
      e.preventDefault(); // varsayilan: context bir daha ASLA geri gelmez
      gl = null;
    };
    const contextGeriGeldi = () => {
      if (stopped) return;
      if (kur()) schedule();
      else setYedegeGec(true);
    };
    canvas.addEventListener("webglcontextlost", contextKayboldu);
    canvas.addEventListener("webglcontextrestored", contextGeriGeldi);

    // Video hic yuklenemezse (ag hatasi, eksik dosya) postere dus.
    const videoHatasi = () => setYedegeGec(true);
    video.addEventListener("error", videoHatasi);

    schedule();

    return () => {
      stopped = true;
      if (gozcu) clearTimeout(gozcu);
      canvas.removeEventListener("webglcontextlost", contextKayboldu);
      canvas.removeEventListener("webglcontextrestored", contextGeriGeldi);
      video.removeEventListener("error", videoHatasi);
      video.removeEventListener("waiting", takilmaToparla);
      video.removeEventListener("stalled", takilmaToparla);
      video.removeEventListener("pause", takilmaToparla);
      if (hasFrameCallback) {
        video.cancelVideoFrameCallback(rafId);
      } else {
        cancelAnimationFrame(rafId);
      }
      /* Context'i ACIKCA birak: tarayicilar ayni anda ~8-16 WebGL
         context'ine izin veriyor. Sayfalar arasi gezinirken her bilesen
         yenisini aciyordu ve eskiler belirsiz bir zamana kadar
         toplanmiyordu; uzun oturumlarda limite dayanip yeni context
         alinamaz hale gelebiliyordu. */
      const kayip = gl?.getExtension("WEBGL_lose_context");
      if (kayip) kayip.loseContext();
      gl = null;
    };
  }, [src]);

  if (yedegeGec) {
    /* Yedek poster. next/image burada ise yaramaz: olcu canvas ile ayni
       kalmali ve dosya zaten optimize edilmis bir PNG. */
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={posterYolu(src)}
        alt=""
        aria-hidden="true"
        className={`pointer-events-none ${className ?? ""}`}
      />
    );
  }

  return (
    <>
      {/* Kaynak video ekranda degil ama DOM'da kalmali: display:none
          verilirse bazi tarayicilar kare uretmeyi durduruyor. */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop={loop}
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          left: 0,
          bottom: 0,
        }}
      />
      <canvas ref={canvasRef} className={`pointer-events-none ${className ?? ""}`} />
    </>
  );
}
