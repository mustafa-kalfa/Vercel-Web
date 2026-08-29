import ResuleKavusmakHub from "../ResuleKavusmakHub";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resûle Kavuşmak",
  description:
    "Hadis râvilerini doğru sırayla seçip isnâd zincirini tamamlama oyunu.",
};

// Isnad oyununun asil sayfasi. Butun icerik (bolum/hadis izgaralari,
// kilit, ilerleme, oyun) `app/ResuleKavusmakHub.tsx` icinde; burasi
// yalnizca rotayi ona bagliyor.
//
// Eskiden bu sayfa TEK bir hadisi (niyet) dogrudan aciyordu; coklu-hadis
// deneyimi /resule-kavusmak-sinama'da denendi ve 2026-08-19'da buraya
// tasindi. `/resule-kavusmak-game.html`'in PARAMETRESIZ hali hala niyet
// hadisini acar, yani oyun dosyasi tek basina da calismaya devam ediyor.
//
// EZBER AKISI 2026-08-29'da yayina alindi: hadis gelir, oyuncu isnadi
// ezberler, "Ezberledim" dedikten sonra Arapca isnad kaybolur ve oyun
// ezberden oynanir. Akis yine sinama adresinde denenmisti; onay gelince
// sinama'nin HTML dosyasi `public/resule-kavusmak-game.html` uzerine
// kopyalandi. Sayfa kodunda degisiklik YOK -- ontanimli dosyayi zaten
// bu sayfa oynatiyor.
export default function ResuleKavusmak() {
  return <ResuleKavusmakHub />;
}
