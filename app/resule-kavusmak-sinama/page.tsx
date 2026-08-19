import ResuleKavusmakHub from "../ResuleKavusmakHub";

// Eski SINAMA adresi. Icerik 2026-08-19'da gercek sayfaya
// (/resule-kavusmak) tasindi; bu rota, daha once paylasilmis
// baglantilar kirilmasin diye AYNI bileseni render etmeye devam
// ediyor. Artik ayri bir "deneme surumu" degil -- iki adres birebir
// ayni sayfayi gosterir. Gerek kalmadiginda bu klasor silinebilir.
export default function ResuleKavusmakSinama() {
  return <ResuleKavusmakHub />;
}
