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

### `/sinama` — gecici deneme sayfasi

`app/sinama/` anasayfanin birebir kopyasi, tek farki `IntroVideo`ya
`deneme` bayragini vermesi. Yeniden anahtarlanan Kediler ve Derince
klipleri `public/sinama/` altinda duruyor; boylece yayindaki anasayfa
eski dosyalarla dokunulmadan kalirken yenileri gercek sitede
karsilastirilabiliyor. Belirli bir klibi gormek icin `localStorage`
sayacini elle ayarla (yukariya bak).

**Onaydan sonra silinecek:** `public/sinama/` dosyalari `public/`
kokune tasinir, sonra `app/sinama/`, `public/sinama/`, `deneme`
bayragi ve `denemeSrc` alanlari kaldirilir.

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

### Kaynagin IKI turu var — script ikisini de otomatik tanir

1. **Perde/duz fon (renk anahtarlama gerekir):** kamera cekimi ya da
   AI-uretimi bir video, arka planda yesil perde ya da nötr bir zemin
   var. Script `Get-ArkaPlanRengi` ile kose rengini okuyup `colorkey`
   ile siliyor (yukaridaki tum ayarlar bunun icin).
2. **Kaynak zaten gercek alfa tasiyor** (DaVinci Resolve'un "ProRes
   4444 + Alpha" gibi bir kalipla export ettigi dosya): script `pix_fmt`
   adinda alfa bileseni gorunce (`yuva*`, `rgba`, vb.) renk anahtarlama
   adiminin TAMAMINI atlayip dogrudan premultiply+paketlemeye geciyor.
   **Bu YOL TERCIH EDILEN yoldur** eger kaynak zaten Resolve/Fusion'da
   duzgun keylenmisse: Resolve'un keyeri muhtemelen bizim otomatik
   corner-sampling + colorkey'imizden daha hassas, VE Fusion'da
   arkaplani duz renge doldurmak (Background+Merge node'lari) gibi ekstra
   bir adima hic gerek kalmiyor. **DIKKAT:** ffmpeg alfa kanalini yalnizca
   DOGRUDAN dekode ederken guvenilir (test edildi: ProRes4444 -> alfa
   0/255 birebir korundu). Bu, ayri bir konu olan "ffmpeg alfali bir
   WEBM'i yeniden kodlarken alfayi dusuruyor" sorunuyla (asagida)
   KARISTIRILMAMALI -- o, VP9/webm'in kendi (kirilgan) alfa ISLEME
   yolunda; ProRes'in kendi alfa DEKODE yolu ayri ve saglam.

Script artik surukle-birak disinda parametreli de calisabiliyor
(`-Daralt`, `-Sure`, `-Basla`, `-Kalitesi`, `-SagGenislik`, `-PanKaydir`,
`-GolgeSil`). "Kediler ilk" klibinin surukle-birak DISI hazirlanmasinin
tam gerekcesi ve kullanilan degerler:

- **Klibin neresi "baslangic", neresi "bitis"?** Kaynak `Kediler Ilk.mp4`
  10 saniyelik tek bir dongu: comelip kediyi kaldiriyor, yuruyup ekrandan
  cikip giriyor, kedileri birakip tekrar comelip BASKA bir kediyi
  kaldiriyor, sonra duz duruyor. "Kediyi kaldirmadan onceki saniyeleri,
  sondan da kaldirdiktan sonrakileri sil" istegi frame-frame (topmost
  opak piksel + gorsel kontrol) izlenerek karsiligini buldu: kare 9
  (t=0.375, comelip kediye TAM DOKUNDUGU an, `-Basla 0.375`) ile kare 204
  (t=8.5, IKINCI kaldirisin zirvesi, `-Sure 8.16667` = (204-9+1)/24)
  arasi tutuldu; sondaki "kediyi indirip duz durma" kuyrugu (~1.2s) atildi.
  `topY` tek basina GUVENILMEZ: ayakta duran karakterin sac ustu, comelip
  kaldirilan bir kedinin ustunden bile daha yuksek olabiliyor (govde
  duz olunca govde-yuksekligi topY'yi domine ediyor) -- gorsel kontrol
  sart.
- **Donguye kesilen bir klipte ilk ve son kare ayni x'te durmayabilir.**
  Aradaki yuruyus sahnesi karakteri sahne icinde otelemis: ayak orta
  noktasi ilk karede x=990, son karede x=947 (43px sola kaymis). `-PanKaydir
  43` bunu DOGRUSAL bir kaymayla telafi ediyor (baslangicta 0, cikti
  suresinin sonunda tam 43px) -- kayma 8+ saniyeye yayildigi icin goze
  batmiyor. Yon: konu SONDA ne kadar SOLA kaymissa `-PanKaydir` o kadar
  POZITIF (klip boyunca saga geri itiyor).
- **Klip icindeki gorsel artifact'ler (bir "sparkle"/yildiz sekli, muhtemelen
  uretici modelin kendi filigrani) sahnenin ortasinda, konu ile ayni
  x araliginda beliriyor -- basit bir zaman kesmesiyle atilamiyor.**
  "Kediler ilk"te bu sekil, kadrajin sag ucundaki turuncu kedinin
  govdesinin uzerinde/yaninda x~1140-1240 arasinda (birkac farkli anda)
  cikiyor. `-SagGenislik 1140` (kaynagin SOLUNDAN itibaren tutulacak
  genislik) o kediyi yariya yakin kirpip sekli TUM gorulen anlarda
  goturuyor -- coz karari cikan konu (uretici filigrani) ile "yarisina
  kadar kirp" istegi cakisinca oncelik seklin TAMAMEN gitmesine verildi.
  `-PanKaydir` ile birlikte kullanildiginda `-SagGenislik` PANDAN SONRAKI
  genisligi ifade eder (script once dolgu+pan uygular, sonra kirpar).

Bu hatta pahaliya mal olmus dersler:

- **Notr fon klipleri kendi cizilmis bir yer golgesi tasiyabiliyor, ve bu
  golge acik temada gorunmez ama sitenin SIYAH koyu temasinda bej bir
  leke olarak kaliyor.** `-GolgeSil` bunu ayri bir renkten (golgenin
  kendi tonu, fondan degil) anahtalayip fon anahtariyla BIRLESTIRIR
  (`blend=darken`, iki alfadan kucugu kazanir). Tek anahtari genisletmek
  ISE YARAMAZ: golge fondan 0.16-0.26 uzaklikta ama ayakkabi/ten de
  fondan 0.06-0.09 uzaklikta -- fonu golgeyi yutacak kadar genisletmek
  ayakkabiyi da yutar. Golgenin kendi tonundan (ayri referans noktasi)
  olculdugunde ayakkabi guvenli mesafede (0.12) kaliyor. Sonuc TAM degil,
  KISMI: en koyu (ust uste binmis) golgeler hafif bir iz birakabilir --
  ayakkabiyi riske atmadan gidebilecek maksimum bu. Acik temada zaten
  sorun yoktu (`#d2ccbe` zemin krem sizintiyi kendiliginden gizliyor);
  bu yalniz koyu (siyah) tema icin.
- **Perde degil de duz bir fon (krem/bej/gri) geldiginde ayarlar bambaska.**
  Script fonun doygunlugundan anliyor (yesil perde 0.80, kirmizi 0.73, krem
  0.15; sinir 0.35) ve otomatik gecis yapiyor. Krem fonda esik **cok dar**
  olmali: "Kediler ilk" klibinde ayakkabi fona 0.064, ten 0.081, tuxedo
  kedinin beyazi 0.094 uzaklikta -- yesil perde ayari (0.10) bunlarin
  ucunu de siliyor, karakterin yuzu ve ayakkabilari delik cikiyor. Fonun
  kendi sapmasi 0.015 oldugu icin 0.03 hem yetiyor hem 4 kat pay birakiyor.
  Notr fonda alfa lut'u ve maske daraltmasi **kapali**: lut kenari
  basamakli yapiyor (tirtikli gorunum), erozyon ise esik bandina yakin
  duran acik renkleri yiyip ayakkabinin ortasinda delik aciyor. Halkaya
  gerek yok zaten -- kalan sizinti krem, sitenin acik temasiyla ayni aile.
- **Bu klipler sonda KARARARAK bitiyor.** Solma karelerinde arka plan artik
  anahtar renginde olmadigi icin hic silinmiyor; video her dondugunde
  sayfanin uzerinde krem bir dikdortgen cakip sonuyor. "Kediler ilk"in HAM
  kaynaginda solma 9.733'te basliyor; nihai klip zaten t=8.5'te (ikinci
  kaldirisin zirvesinde, yukarida) kesildigi icin bu sorunu ayrica
  cozmeye gerek kalmadi, ama BASKA bir kaynakta hala gecerli: once son
  yarim saniyeyi kare kare kontrol et.
- **Uzun animasyonlarin ortasinda konular kadraj disina yuruyebiliyor.**
  Bu kasitli olabilir (soldan cikip sagdan girme efekti), klibi bolme --
  ama masaustunde kutu kosede ve dar oldugu icin cikis cizgisi ekranin
  kenari degil kutunun kenari oluyor. Mobilde `w-full` oldugundan sorun yok.
- **Kenardaki yesil/kirmizi halkanin sebebi esik degil, 4:2:0.** Kaynak
  mp4'ler `yuv420p`: renk her 2x2 blok icin tek ornek. Siluetin kenarinda
  perde rengi konunun rengiyle ayni ornege karisiyor, `colorkey` mesafeyi
  RGB'den hesapladigi icin bu pikseller esigin DISINDA kalip **tam opak**
  kaliyor. Esigi genisletmek cozmuyor (alfa zaten 255), despill ise
  konunun kendi rengini soldurur. Cozum **maskeyi 1-2 piksel daraltmak**
  (`$AlfaDaralt`, `erosion`): kirli seridi kesiyor, renklere dokunmuyor.
  Olculen kenar rengi sapmasi: Kediler +21.7 -> +1.6, Derince -27.5 ->
  -7.4. **3 piksel fazla** — kedilerin ince siyah konturunu yiyor.
- **Daraltma kucuk ve ayrik ogeleri de yiyor.** "Derince Sunum"un birkac
  piksellik sari yildizlari 2 pikselde kayboluyor; o klip `-Daralt 1` ile
  uretildi. Yeni bir klipte once 1 ile dene, ciktiyi gozle karsilastir.
- **Halkanin gorunurlugu konunun kontur kalinligina bagli.** "Mustafa
  Thinking" ve "/selam" klipleri kalin koyu line-art tasidigi icin halka
  (fiziksel olarak orada olsa bile) koyu kaliyor ve goze carpmiyor; ince
  konturlu kedilerde ayni sizinti kurkun uzerine binip yesil goruluyor.
- **`setsar=1` sart.** Kaynaklarin bir kismi kare olmayan piksel orani
  tasiyor; tarayici `videoWidth/videoHeight`'i goruntuleme olcusu olarak
  verdigi icin 1440 satirlik klip 1441 goruluyor ve canvas'in ic olcusu
  (dolayisiyla `w-auto` ile turetilen sayfa genisligi) kayiyor.
- **ffmpeg, alfali bir webm'i yeniden kodlarken alfayi sessizce
  dusuruyor.** Kirpma/olcek gibi bir islem gerekiyorsa mutlaka **mp4
  kaynaktan** yeniden anahtarla; mevcut webm'i tekrar kodlama.
  `Derince Sunum.mp4` (644x720) bu yuzden `Derince.mp4`'ten (920x720)
  `crop=644:720:92:0` ile bir kez uretilip Calisma Alani'na kaynak olarak
  konuldu; artik .bat'a surukleyince dogru olcude cikiyor.
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

### iPhone / Mac (Safari) uyumlulugu — her yeni video'da kontrol et

Gercek bir iPhone/Mac elimde yok, Tarayici paneli de Chromium tabanli;
Safari'de GOZLE goremem. Ama Safari'nin kirici oldugu noktalarin HEPSI
`_yesil-perde.ps1` ve `ChromaKeyVideo.tsx` tarafindan HER klipte ayni
sekilde uygulaniyor (bkz. yukaridaki "Neden webm degil" bolumu), yani
bunlar dosyaya OZGU degil, BORUHATTINA ozgu. Yeni bir klip eklerken
gozle goremedigim seyi olcerek dogrularim, ffprobe ile:

```bash
ffprobe -v error -select_streams v:0 -show_entries \
  stream=codec_name,profile,pix_fmt,color_space,color_primaries,color_transfer,sample_aspect_ratio \
  -of default=noprint_wrappers=1 "public/.../klip.mp4"
```

Hepsi bunlarla eslesmeli (esik degeri yok, ya boyle ya degil):
- `codec_name=h264` (VP9/webm degil — Safari alfali webm'i opak gosteriyor)
- `pix_fmt=yuv420p`, `profile=Main` (ya da Baseline)
- `color_space/primaries/transfer=bt709` (etiketsizse Safari ile Chrome
  klibi FARKLI renkte gosterir)
- `sample_aspect_ratio=1:1` (degilse `videoWidth/Height` tarayicida
  kaydigi icin `ChromaKeyVideo`'nun canvas olcusu ve ondan tureyen sayfa
  genisligi kayar)

`app/ChromaKeyVideo.tsx`'te de degismemesi gereken ucu: `<video>`
etiketinde `autoPlay muted playsInline` (iOS'ta bu ucu olmadan inline
autoplay ya hic baslamiyor ya tam ekrana aciyor) ve
`requestVideoFrameCallback` yoksa `requestAnimationFrame`'e dusen fallback
(eski Safari surumleri icin).

`_yesil-perde.ps1` bunlarin hepsini HER ciktiya otomatik uyguluyor
(degistirilmedigi surece); yeni parametreler (`-SagGenislik`,
`-PanKaydir`, `-GolgeSil`) renk anahtarlanmasindan ONCE ham RGB uzerinde
calisiyor, kodek/profil/renk etiketlerine dokunmuyor. Yani BU liste
gecerse iPhone/Mac konusunda ayrica endise tasimana gerek yok — sorun
cikarsa zaten script'in kendisinde cikar, tek bir klipte degil.
