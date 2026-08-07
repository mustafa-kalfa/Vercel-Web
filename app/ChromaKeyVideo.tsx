"use client";

import { useEffect, useRef } from "react";

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
void main() {
  vec3 color = texture2D(frame, vec2(uv.x, uv.y * 0.5)).rgb;
  float alpha = texture2D(frame, vec2(uv.x, uv.y * 0.5 + 0.5)).r;
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

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let stopped = false;
    let rafId = 0;

    const draw = () => {
      if (stopped) return;
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const width = video.videoWidth;
        const height = Math.floor(video.videoHeight / 2);
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
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
      }
      schedule();
    };

    // requestVideoFrameCallback kareyi videoya kilitliyor; yoksa rAF.
    const hasFrameCallback = "requestVideoFrameCallback" in video;
    const schedule = () => {
      if (stopped) return;
      if (hasFrameCallback) {
        rafId = video.requestVideoFrameCallback(draw);
      } else {
        rafId = requestAnimationFrame(draw);
      }
    };

    schedule();

    return () => {
      stopped = true;
      if (hasFrameCallback) {
        video.cancelVideoFrameCallback(rafId);
      } else {
        cancelAnimationFrame(rafId);
      }
    };
  }, [src]);

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
