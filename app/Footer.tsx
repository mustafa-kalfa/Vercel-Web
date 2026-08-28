"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageContext";

/* Sitenin alt bilgisi.

   AYRI BIR BILESEN, cunku hedef butun sayfalara konmasi. Su an yalnizca
   /sinama kullaniyor -- once orada denenip onaylanacak, sonra ya tek tek
   sayfalara ya da dogrudan app/layout.tsx'e eklenecek. layout'a konursa
   her sayfa kendiliginden alir; ama /resule-kavusmak gibi tam ekran
   calisan sayfalarda istenmeyebilir, o yuzden karar sonraya birakildi.

   Yil ELLE yazili. `new Date().getFullYear()` bu sayfalar statik olarak
   onceden uretildigi icin zaten derleme anindaki yila donardi; sabit
   yazmak hem ayni sonucu veriyor hem de sunucu/istemci uyusmazligi
   riskini tamamen kaldiriyor. Yil degisince burayi guncelle. */
const YIL = 2026;

export default function Footer() {
  const { t } = useLanguage();

  const baglantilar = [
    { href: "/mustafa-calisiyor", ad: t.cardNetworks },
    { href: "/podcastler", ad: t.cardPodcasts },
    { href: "/hadis-tarihi", ad: t.podcastHadithHistory },
    { href: "/rihle", ad: t.cardRihle },
    { href: "/resule-kavusmak", ad: t.cardGames },
    { href: "/selam", ad: t.about },
  ];

  return (
    /* `mt-auto`: govde kisa kalan sayfalarda (ornegin /rihle) footer
       ekranin ortasinda asili kalmasin, dibe otursun. */
    <footer className="mt-auto w-full border-t border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-8 py-8 sm:px-16 md:max-w-5xl">
        <nav aria-label={t.brandAlt}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {baglantilar.map((b) => (
              <li key={b.href}>
                <Link
                  href={b.href}
                  className="text-zinc-600 transition-colors hover:text-black dark:text-cream-dimmer dark:hover:text-foreground"
                >
                  {b.ad}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between dark:text-cream-dimmer">
          <p>
            © {YIL} Mustafâ Kalfa. {t.footerRights}
          </p>
          <a
            href="https://x.com/mustafakalfa__"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-foreground"
          >
            {/* X logosu: tek parca yol, dolgu `currentColor` -- diger
                ikonlarin aksine cizgi degil dolgu, cunku logonun kendisi
                boyle. */}
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5"
              aria-hidden="true"
              focusable="false"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            mustafakalfa__
          </a>
        </div>
      </div>
    </footer>
  );
}
