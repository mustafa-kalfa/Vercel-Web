"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { CIPLAK_YOLLAR } from "./ciplakYollar";

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

// Footer'in HIC gorunmedigi yollar. 2026-08-29'a kadar burada "/" vardi:
// anasayfa o zaman tek ekranlik eski duzendi ve altina bir sey eklemek
// istenmiyordu. Anasayfa /sinama duzenine gecince (kart izgarasi + uzun
// govde) footer da onun bir parcasi oldu, liste bosaldi.
//
// Bugun liste, cercevesi hic olmayan sayfalarin ortak listesi: tema ve
// dil dugmeleri de ayni yollarda gizleniyor, o yuzden liste tek bir
// yerde duruyor (bkz. ciplakYollar.ts). Yalnizca footer'i olmayan ama
// dugmeleri duran bir sayfa gerekirse buraya ayrica yol eklenebilir.
const FOOTERSIZ: string[] = CIPLAK_YOLLAR;

// Footer'in gorundugu ama ust siradaki SAYFA LISTESININ gizlendigi
// yollar. Anasayfa ve onun kopyasi /sinama govdesinde zaten ayni
// yerlere goturen kart izgarasini tasiyor; footer'da tekrarlamak ayni
// listeyi tek ekranda iki kez gostermek olur. Diger sayfalarda kart
// izgarasi yok, orada bu liste sitede gezinmenin tek yolu.
const LISTESIZ = ["/", "/sinama"];

export default function Footer() {
  const { t } = useLanguage();
  const yol = usePathname();

  if (FOOTERSIZ.includes(yol)) return null;

  const sayfaListesi = !LISTESIZ.includes(yol);

  const baglantilar = [
    { href: "/ravi-iliski-aglari", ad: t.cardNetworks },
    { href: "/podcastler", ad: t.cardPodcasts },
    { href: "/rihleler", ad: t.cardRihle },
    { href: "/oyunlar", ad: t.cardGames },
    { href: "/egitim-icerikleri", ad: t.cardEducation },
    { href: "/selam", ad: t.about },
  ];

  return (
    /* `mt-auto`: govde kisa kalan sayfalarda (ornegin /rihleler) footer
       ekranin ortasinda asili kalmasin, dibe otursun. */
    <footer className="mt-auto w-full border-t border-black/20 dark:border-white/70">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-8 py-8 sm:px-16 md:max-w-5xl">
        {sayfaListesi ? (
        <nav aria-label={t.brandAlt}>
          {/* Liste FLEX DEGIL, duz metin akisi (`li` inline). Flex iken
              her baglanti bolunmez bir kutuydu: "Egitim Icerikleri ve
              Diger Hizmetler" satira sigmayinca komple alta atlayip
              ustunde kocaman bir bosluk birakiyordu. Inline akista uzun
              bir baslik kendi icinde bolunup alt satirdan devam ediyor,
              satirlar da dolu gorunuyor.

              Ayirac ile ondan ONCEKI baglanti arasinda BOSLUK YOK
              (gorsel araligi `ml-2` veriyor); bosluk olsa orasi bir
              satir sonu firsati olur ve nokta yeni satirin basina
              duserdi. Noktadan SONRAKI `{" "}` ise bilerek var, sonraki
              baglantinin alta gecebilmesi icin. */}
          <ul className="text-sm leading-7">
            {baglantilar.map((b, i) => (
              <li key={b.href} className="inline">
                <Link
                  href={b.href}
                  className="text-zinc-600 transition-colors hover:text-black dark:text-cream-dimmer dark:hover:text-foreground"
                >
                  {b.ad}
                </Link>
                {i < baglantilar.length - 1 ? (
                  <>
                    {/* Bosluk `mx-2` ile veriliyor, metin boslugu ile
                        DEGIL: onceden solda `ml-2` (8px), sagda ise bir
                        kelime boslugu (~4px) vardi ve nokta sagindaki
                        baglantiya daha yakin duruyordu. Simdi iki yan
                        da 8px.

                        Ardindaki <wbr />: satir sonu FIRSATI, genisligi
                        sifir. Onceden bu isi noktadan sonraki gercek
                        bosluk goruyordu; o kalksa liste hic saramazdi.
                        Noktadan ONCE hala hicbir firsat yok, yani nokta
                        yeni satirin basina dusemiyor. */}
                    <span
                      aria-hidden="true"
                      className="mx-2 text-zinc-400 dark:text-cream-dimmer"
                    >
                      ·
                    </span>
                    <wbr />
                  </>
                ) : null}
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
          {/* Tek satir. Bir ara iki satira bolunmustu: kosedeki klip o
              zaman `fixed` idi ve sayfa sonunda bu satirin uzerine
              biniyordu. Klipler `absolute` olup footer'in USTUNE
              alininca (bkz. selam/rihleler/mustafa-calisiyor sayfalari) o
              kisitlama ortadan kalkti. */}
          <p>
            © {YIL} Mustafâ Kalfa{" "}
            <span aria-hidden="true" className="text-zinc-400 dark:text-cream-dimmer">
              ·
            </span>{" "}
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
                {/* <bdi>: Arapca'da sayfa RTL oldugu icin adresin SONUNDAKI
                    alt cizgiler (yonu olmayan karakterler) paragrafin
                    yonune uyup gorsel olarak BASA kayiyordu --
                    "__x.com/mustafakalfa" gibi goruluyordu. <bdi>
                    tarayicida ontanimli olarak `unicode-bidi: isolate` ve
                    `dir="auto"` demek: yon ilk guclu karakterden ("a" /
                    "x") belirleniyor, adres kendi icinde soldan saga
                    kaliyor ve alt cizgiler sonda duruyor. */}
                <bdi>academia.edu/MustafaKalfa</bdi>
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
                <bdi>x.com/mustafakalfa__</bdi>
              </a>
            </li>
            <li>
              <a
                href="mailto:mustafa.kalfa@stu.ihu.edu.tr"
                className="inline-flex items-center gap-1.5 transition-colors hover:text-black dark:hover:text-foreground"
              >
                {/* Zarf: ust kenari kapak cizgisi olan basit bir dikdortgen.
                    Diger iki baglantinin aksine `mailto:` bir dis site
                    acmiyor, o yuzden `target="_blank"` ve `rel` yok. */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                  focusable="false"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                  <path d="m3.5 7 8.5 6 8.5-6" />
                </svg>
                <bdi>mustafa.kalfa@stu.ihu.edu.tr</bdi>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
