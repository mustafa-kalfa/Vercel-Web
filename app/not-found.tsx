import SuAndaBuradasiniz from "./SuAndaBuradasiniz";

// Var olmayan her adres bu sayfayi gosteriyor; Next.js'in ontanimli
// siyah-beyaz "404 | This page could not be found" ekrani hic gorunmuyor.
//
// DIKKAT -- burada `redirect("/su-anda-buradasiniz")` KULLANMA. Calisiyor
// gibi gorunur (dev sunucusunda 307 doner) ama site tamamen statik oldugu
// icin `/_not-found` build sirasinda onceden uretiliyor; redirect o anda
// tuketiliyor ve YAYINDA hicbir sey yapmiyor -- ziyaretci Next'in ham 404
// ekranini goruyor. 2026-08-18'de tam olarak bu yasandi. Icerigi burada
// RENDER etmek tek guvenilir yol (ustelik dogru 404 durum kodu da korunur).
export default function NotFound() {
  return <SuAndaBuradasiniz />;
}
