export default function ChromaKeyVideo({
  src,
  className,
}: {
  // a .webm with a real alpha channel (background already keyed out
  // offline) — just a plain video tag, no runtime styling or JS applied
  // to it
  src: string;
  className?: string;
}) {
  // Klipler icerigin ustunde duruyor (z-50); dekoratif olduklari icin
  // tiklamayi gecirmeleri sart, yoksa altlarina denk gelen baglantilar
  // tiklanamaz hale geliyor.
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={`pointer-events-none ${className ?? ""}`}
    />
  );
}
