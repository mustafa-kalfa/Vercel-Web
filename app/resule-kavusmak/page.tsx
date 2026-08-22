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
export default function ResuleKavusmak() {
  return <ResuleKavusmakHub />;
}
