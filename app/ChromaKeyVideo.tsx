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
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className={className}
    />
  );
}
