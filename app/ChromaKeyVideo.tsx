export default function ChromaKeyVideo({
  src,
  className,
  wrapperClassName,
}: {
  // a .webm with a real alpha channel (background already keyed out
  // offline) — just a plain video tag, no runtime styling or JS applied
  // to it
  src: string;
  className?: string;
  // when set, the video is wrapped in a div carrying this class. Needed
  // when two CSS masks have to intersect (e.g. a wavy top edge and a
  // wavy right edge): a single mask layer list can only union or
  // intersect in sequence, never group, so the second mask goes on a
  // parent and the browser intersects them by nesting.
  wrapperClassName?: string;
}) {
  const video = (
    <video src={src} autoPlay muted loop playsInline className={className} />
  );

  if (!wrapperClassName) return video;

  return <div className={wrapperClassName}>{video}</div>;
}
