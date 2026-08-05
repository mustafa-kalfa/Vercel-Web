import Image from "next/image";
import IntroVideo from "./IntroVideo";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <IntroVideo />
      {/* Icerik dikeyde ortalandigi icin alt dolgunun ancak yarisi
          gorunur bosluga donusuyor: pb, pt'den 112px fazla verilerek
          About butonunun altinda ~38px aciklik birakiliyor. */}
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-8 px-16 pt-20 pb-48 sm:items-start">
        <Image
          className="dark:invert"
          src="/HD-logo.png"
          alt="Hadis ve Dijital"
          width={44}
          height={33}
          priority
        />
        <div className="flex flex-col items-center gap-4 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Trying Something.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Is it possible to combine the classical and the contemporary? Or
            let&apos;s put it this way:
            <br />
            <strong className="font-semibold">Hadith</strong> and{" "}
            <strong className="font-semibold">Digital</strong>.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <span className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background md:w-[158px]">
            Let&apos;s Begin
          </span>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Mustafâ
          </a>
        </div>
      </main>
    </div>
  );
}
