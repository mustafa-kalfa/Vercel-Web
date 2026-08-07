<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hadis ve Dijital — proje notlari

Mustafa Kalfa'nin kisisel sitesi. Canli adres **mustafakalfa.com**, Vercel
uzerinde. Deploy ayri bir komut istemiyor: `main` dalina push edilince
otomatik yayina giriyor.

Repo koku `my-app/`. Video uretim scriptleri repo'nun **disinda**,
`../Çalışma Alanı/` altinda — o klasore de erisimin olmasi icin oturumu
`Vercel Web` klasorunde ac, `my-app` icinde degil.

## Giris videolari

`app/IntroVideo.tsx` her ziyarette sirayla bir video gosteriyor. Sayac
`localStorage`'da (`introVideoVisitCount`), liste bitince basa donuyor
(`(visitCount - 1) % VIDEOS.length`). Videolar `z-50` ile icerigin
**onunde** duruyor; bu yuzden `ChromaKeyVideo` hepsine
`pointer-events-none` veriyor, yoksa alta denk gelen baglantilar
tiklanamiyor.

Test ederken: **dev modunda sayac her yuklemede 2 artiyor**, cunku React
StrictMode efekti iki kez calistiriyor. Canlida ziyaret basina 1 artar.
Belirli bir videoyu gormek icin sayaci elle ayarlayip yenile.

## Yesil/kirmizi perde -> seffaf mp4 (paketlenmis alfa)

`Çalışma Alanı/Yesil-Perde-Kaldir.bat` uzerine video surukleyince
`_yesil-perde.ps1` calisiyor: arka plan rengini otomatik algilayip
siliyor ve **paketlenmis alfa** mp4 uretiyor. Ayarlar dosyanin basinda.

**Neden webm degil:** Safari (iPhone ve Mac) WebM/VP9'un alfa kanalini
desteklemiyor; seffaf webm orada opak goruntuleniyor. Alfa kanalli HEVC
Safari'nin destekledigi tek alternatif ama onu yalnizca macOS uretebiliyor
(Windows'taki x265 derlemesi `does not support alpha layer encoding`
diyor). Bu yuzden alfa, videonun **ikinci bir yarisina** tasiniyor:

- Ust yari: renk, **alfa ile onceden carpilmis** (premultiplied).
- Alt yari: ayni karenin siyah-beyaz maskesi.
- Tek dosya, duz H.264 -> her tarayicida oynuyor.
- `app/ChromaKeyVideo.tsx` iki yariyi WebGL ile birlestirip seffafligi
  geri uretiyor; canvas zaten onceden carpilmis alfa bekledigi icin
  shader ciktisi dogrudan uyumlu.

`premultiply` atlanirsa seffaf alanda kalan yesil perde artigi H.264'un
renk altorneklemesinde kenarlara tasiyor ve karakterin cevresinde yesil
halka olusuyor. Eski gercek-alfa webm'ler `Çalışma Alanı/eski-webm-arsiv/`
altinda duruyor; site artik onlari kullanmiyor.

Bu hatta pahaliya mal olmus dersler:

- **ffmpeg, alfali bir webm'i yeniden kodlarken alfayi sessizce
  dusuruyor.** Kirpma/olcek gibi bir islem gerekiyorsa mutlaka **mp4
  kaynaktan** yeniden anahtarla; mevcut webm'i tekrar kodlama.
- **Renk uzayi etiketlenmezse** tarayici ile masaustu oynatici ayni
  dosyayi farkli renklerde gosteriyor. Ciktiya her zaman
  `-colorspace bt709 -color_primaries bt709 -color_trc bt709` ve filtre
  zincirine `setparams=...` ekle (yalniz ffmpeg bayraklari `primaries`
  ve `trc`'yi her zaman gecersiz kilmiyor).
- **Esik degeri (similarity) genis tutulmamali.** Genis esik, konunun
  arka plana yakin renkteki kisimlarini yari saydam yapip karakteri
  "hayalet" gosteriyor. Yesil/mavi icin 0.10 + blend 0.05, kirmizi icin
  ~0.06 (kirmizida ten rengi arka plana yakin oldugu icin dar). Eski 0.16
  + 0.08 fazla genisti: adacayi yesili bir tisort yesil perdeye 0.176
  uzaklikta kaliyor, yani bandin icine dusup neredeyse tamamen siliniyordu.
- **despill varsayilan olarak KAPALI (`$DespillMix = 0`).** Perdeden konuya
  vuran renk yansimasini temizlemek icin var ama konunun KENDI rengini de
  soldurur: `mix=0.5` ile adacayi yesili tisort gri-kahveye donuyordu,
  `mix=0.15` bile yesil kanali gorunur olcude kirpiyor. Bu klipler cizim
  oldugu ve gercek bir isik yansimasi tasimadigi icin despill'e ihtiyac
  yok; kenarlarda yesil halka gorursen kucuk bir degerle ac.
- Kaynak mp4'leri silme; kirpma ya da yeniden anahtarlama gerektiginde
  tek dayanak onlar.

## Yerlesim tuzaklari

- Tailwind temel stilleri `<video>` ogesine `max-width: 100%` veriyor.
  Sabit genislik verirken `max-w-none` eklenmezse dar ekranda genislik
  kirpilir, yukseklik sabit kaldigi icin **goruntu ezilir**.
- Kutu orani klibin oranindan farkliysa `object-contain` yanlarda olu
  bosluk birakir. Kutu olcusunu klibin oranina gore sec. En temizi
  yalnizca yukseklik verip `w-auto max-w-none` birakmak: genislik
  canvas'in kendi oranindan gelir, olu bosluk hic olusmaz. Masaustu
  olculeri ve `/selam` boyle.
- **Klip olculeri px degil vh.** Tarayici yakinlastirmasi (Ctrl +)
  gorunum alanini CSS pikseli cinsinden kucultur, yani px ile verilen bir
  kutu ekranda BUYUR. vh ile verilen kutu ayni kalir. Masaustu olculeri
  1vh = 8px (800px yukseklikli gorunum alani) referansiyla cevrildi.
  Mobil olculer px kalabilir: telefonda sayfa yakinlastirmasi duzeni
  degistirmiyor.
- Negatif arbitrary deger `-right-[32px]` seklinde yazilinca bu Tailwind
  surumunde **hic CSS uretilmiyor**; dogrusu `right-[-32px]`.
- **Icerigi dikeyde ortalama.** Ana sayfa ile `/selam` ustten sabit
  dolguyla basliyor (`justify-start` / `pt-*`), cunku ortalanan ya da alta
  yaslanan bir blogun ust kenari metnin uzunluguna baglidir: dil TR/AR/EN
  arasinda degisince logo ve balon yer degistiriyordu. Ustten sabitlemek
  bunu tamamen kaldiriyor.
- Dev sunucusunun Tailwind ciktisi bazen bayatliyor: yeni bir sinif
  eklendigi halde CSS'te gorunmuyor. `rm -rf .next` + yeniden baslat.

## Dogrulama

Tarayici panelinin ekran goruntusu olcekli geldigi icin olculeri gozle
kestirme; `getBoundingClientRect` / `getComputedStyle` ile **olc**.
Alfa ve renk sorunlarinda videoyu canvas'a cizip piksel orneklemek en
guvenilir yontem.
