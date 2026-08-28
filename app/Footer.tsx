"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";

/* Sitenin alt bilgisi. app/layout.tsx'te bir kez cagriliyor, yani
   ANASAYFA DISINDA her sayfada var (asagidaki FOOTERSIZ listesine bkz.).

   Yil ELLE yazili. `new Date().getFullYear()` bu sayfalar statik olarak
   onceden uretildigi icin zaten derleme anindaki yila donardi; sabit
   yazmak hem ayni sonucu veriyor hem de sunucu/istemci uyusmazligi
   riskini tamamen kaldiriyor. Yil degisince burayi guncelle. */
const YIL = 2026;

/* Footer app/layout.tsx'te BIR KEZ cagriliyor, sayfalara tek tek
   eklenmiyor. Boylece yeni acilan her sayfa kendiliginden aliyor ve
   yedi ayri dosyada ayni satiri tekrarlamak gerekmiyor.

   Hangi sayfada ne yapacagini da kendisi biliyor. Iki liste var: */

// Footer'in HIC gorunmedigi yollar. Anasayfa: tasarimi tek ekrana
// kurulmus, altina bir seyler eklemek istenmiyor.
const FOOTERSIZ = ["/"];

// Footer'in gorundugu ama ust siradaki SAYFA LISTESININ gizlendigi
// yollar. Bu sayfalar govdesinde zaten ayni yerlere goturen kart
// izgarasini tasiyor; footer'da tekrarlamak ayni listeyi tek ekranda
// iki kez gostermek olur. Diger sayfalarda kart izgarasi yok, orada bu
// liste sitede gezinmenin tek yolu.
const LISTESIZ = ["/", "/sinama"];

export default function Footer() {
  const { t } = useLanguage();
  const yol = usePathname();

  if (FOOTERSIZ.includes(yol)) return null;

  const sayfaListesi = !LISTESIZ.includes(yol);

  const baglantilar = [
    { href: "/ravi-iliski-aglari", ad: t.cardNetworks },
    { href: "/podcastler", ad: t.cardPodcasts },
    { href: "/hadis-tarihi", ad: t.podcastHadithHistory },
    { href: "/rihle", ad: t.cardRihle },
    { href: "/resule-kavusmak", ad: t.cardGames },
    { href: "/egitim-icerikleri", ad: t.cardEducation },
    { href: "/selam", ad: t.about },
  ];

  return (
    /* `mt-auto`: govde kisa kalan sayfalarda (ornegin /rihle) footer
       ekranin ortasinda asili kalmasin, dibe otursun. */
    <footer className="mt-auto w-full border-t border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-8 py-8 sm:px-16 md:max-w-5xl">
        {sayfaListesi ? (
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
        ) : null}

        {/* Her sey SOLA yasli, sag alt kose bilerek bos birakiliyor.
            Sitede karakter klipleri (`/sinama`, `/selam`) tam oraya
            `fixed` konumlaniyor; footer'in dis baglantilari saga
            yaslandiginda klibin altinda kaliyordu (olculdu). Sol taraf
            her sayfada guvenli. */}
        <div className="flex flex-col gap-3 text-xs text-zinc-500 dark:text-cream-dimmer">
          {/* Iki satir. Tek satirda "© 2026 Mustafâ Kalfa. Tum haklari
              saklidir." mobilde 267px'e uzayip sag alt kosedeki klibin
              (x=194'ten basliyor) altina giriyordu; bolununce iki parca da
              162px'in altinda kaliyor. */}
          <p>
            © {YIL} Mustafâ Kalfa
            <br />
            {t.footerRights}
          </p>

          {/* Dis baglantilar alt alta, Academia ustte. */}
          <ul className="flex flex-col items-start gap-1.5">
            <li>
              <a
                href="https://ibnhaldun.academia.edu/MustafaKalfa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-foreground"
              >
                {/* Academia.edu logosu (Mustafa'nin verdigi dosyadan,
                    SVG Repo). Tek parca yol, dolgu `currentColor` -- kart
                    ikonlarinin aksine cizgi degil dolgu. viewBox 32'lik,
                    digerleri 24; yol o koordinatlara gore cizildigi icin
                    degistirilmedi, olcuyu zaten sinif veriyor. */}
                <svg
                  viewBox="0 0 32 32"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                  focusable="false"
                  fill="currentColor"
                >
                  <path d="M9.527 18.95q2.116-5.301 4.098-10.653l4.261 10.653zM28.538 27.472l-10.326-25.894h-7.374l1.311 3.278-8.85 22.616c-0.327 1.147-1.311 1.312-2.294 1.476v1.475h8.523v-1.475c-2.294-0.164-3.606-0.492-2.623-2.95 0.531-1.125 1.086-2.536 1.56-3.983l0.079-0.278h10.488l1.475 3.769c0.161 0.479 0.277 1.036 0.326 1.612l0.002 0.026c0 1.311-1.147 1.803-3.278 1.803v1.475h13.441v-1.475c-1.147-0.163-2.131-0.491-2.458-1.475z" />
                </svg>
                academia.edu/MustafaKalfa
              </a>
            </li>
            <li>
              <a
                href="https://x.com/mustafakalfa__"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-foreground"
              >
                {/* X logosu: tek parca yol, dolgu `currentColor` -- kart
                    ikonlarinin aksine cizgi degil dolgu, cunku logonun
                    kendisi boyle. */}
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
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
