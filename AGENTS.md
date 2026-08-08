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

`ChromaKeyVideo` varsayilan olarak donguye aliyor (`loop` prop'u, ontanimli
`true`). Anasayfadaki animasyonlu logo `loop={false}` ile bir kez oynayip son karesinde
duruyor -- ek kod gerekmedi: video bitince `requestVideoFrameCallback` yeni
kare uretmiyor, cizim dongusu kendiliginden duruyor ve canvas son kareyi
tutuyor.

`app/IntroVideo.tsx` her ziyarette sirayla bir video gosteriyor. Sayac
`localStorage`'da (`introVideoVisitCount`), liste bitince basa donuyor
(`(visitCount - 1) % VIDEOS.length`). Videolar `z-50` ile icerigin
**onunde** duruyor; bu yuzden `ChromaKeyVideo` hepsine
`pointer-events-none` veriyor, yoksa alta denk gelen baglantilar
tiklanamiyor.

Test ederken: **dev modunda sayac her yuklemede 2 artiyor**, cunku React
StrictMode efekti iki kez calistiriyor. Canlida ziyaret basina 1 artar.
Belirli bir videoyu gormek icin sayaci elle ayarlayip yenile.

### `/sinama` deneme sayfasi KALDIRILDI (2026-08-08)

Bir sure `app/sinama/` anasayfanin birebir kopyasi olarak durdu; yeniden
anahtarlanan klipler `public/sinama/` altindan yayinlanip yayindaki
anasayfaya dokunmadan gercek sitede karsilastirildi. Onaydan sonra
plan uygulandi: dosyalar `public/` kokune tasindi, animasyonlu logo
anasayfaya gecti, `app/sinama/` + `public/sinama/` + `deneme` bayragi +
`denemeSrc` alanlari silindi. **`/sinama` artik 404.** Geri istenirse
tek dayanak git gecmisi (`e9d3afe` ve oncesi).

Ayni anda kullanimdan kalkan iki klip de silindi:
`Mustafa Kediler Dogru_seffaf.mp4` (hem kokte hem `sinama/` altinda).

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

### Ucuncu durum: alfasiz, duz zemine basilmis SIYAH LINE-ART

Logo animasyonu bir kez "teslim" formatinda geldi: 8K HEVC, `yuv420p`,
alfa yok, krem zemine basilmis siyah cizgi. Burada script'in iki yolu da
iyi sonuc VERMIYOR -- fon duz degil, **vinyetli**: kosede luma 154,
ortada 205. `colorkey` mesafeyi tek bir anahtar renkten olctugu icin
kose rengiyle anahtarlarsan vinyetin merkezi 0.19 uzakta kaliyor, o kadar
genis bir esik ise gri "&" ogesini (0.22) de yutuyor.

Cizim NOTR SIYAH oldugu icin cok daha saglam bir yol var: **alfayi
lumadan turet, rengi saf siyah birak.**

- `a = clip((148 - luma) * 255/53, 0, 255)` — 148 ustu tam seffaf,
  95 alti tam opak. Esigi zeminin EN KOYU yerinin (154) biraz altina
  koy; boylece vinyetin tamami sifirlaniyor.
- Renk kanali `r=0:g=0:b=0`. Premultiplied ciktida `A*Fg` gerekiyor ve
  cizimin gercek rengi zaten siyah; sabit siyah vermek hem dogru sonucu
  veriyor hem de zeminden renk sizmasini IMKANSIZ kiliyor. Yan fayda:
  renk yarisi duz siyah oldugu icin dosya kucucuk cikiyor (0.6 MB).
- Zemin bilesenini geri cikarmaya (`C - (1-A)*Bg`) gerek yok: cizimin
  gercek rengi siyah oldugu icin sonuc ayni.
- Gri "&" ogesi bu rampada kendiliginden yari saydam kaliyor (luma ~127
  -> alfa ~100), yani alfali kaynaktaki haline yakin duruyor.

`_yesil-perde.ps1` bu yolu tanimiyor; dogrudan ffmpeg ile uretildi
(`geq` + vstack), ama cikti bayraklari script'inkiyle ayni tutuldu.

### `HD-Mini.mp4` — ayni klipten kirpilmis header logosu

`/selam` ustundeki logo (eskiden `.brand-logo` CSS maskesi) artik
`HD-Mini.mp4`: `HD-Animasyon.mp4`in ILK 61 KARESI (2.033 sn), yani
yalnizca HD monogramini cizen bolum. **Kesme noktasi keyfi degil:**
62. karede H'nin kolu ile D'nin govdesi arasindaki kosegen baglantiya
bir centik girip harfler ayrilmaya basliyor (58-60 temiz, 61'de kopuyor).
Yeni bir kirpma gerekirse once o birlesim noktasini kare kare kontrol et.

`-c copy -frames:v 61` ile kesildi: paketlenmis klibi zaman ekseninde
kesmek yeniden kodlama ISTEMIYOR, dolayisiyla kalite kaybi sifir ve
kodek/profil/seviye/renk bayraklari kaynakla birebir ayni kaliyor
(Main / 5.0 / yuv420p / bt709 / SAR 1:1 / faststart).

### Mustafa'ya ne soylemeli: DaVinci'den nasil export etsin

**"Seffaf - ProRes 4444 + Alpha" kalibi. Baska hicbir sey gerekmiyor.**
Fusion sayfasina girmesine, `Background`+`Merge` node'lariyla arkaplani
duz renge doldurmasina GEREK YOK -- bir kez oyle yonlendirildi, yanlisti,
bosa emek oldu. 3D Keyer ile arkaplani silip dogrudan bu kalipla export
etmesi yeterli.

Dosya devasa cikar (8 saniye ~350-460 MB) -- **normal ve sorun degil.**
ProRes her kareyi ayri kodluyor. O dosya siteye hic gitmiyor; script onu
H.264'e yeniden kodluyor ve ~1 MB'a iniyor.

**Buyuk kaynaklari `my-app/public/` icine KOYMA.** Oraya konan her sey
siteyle birlikte yayinlanir. Kaynaklar `Çalışma Alanı/`'ya ait. (Bir kez
`Kediler ilk.mp4` public'e konmustu, tasindi.)

Script artik surukle-birak disinda parametreli de calisabiliyor
(`-Daralt`, `-Sure`, `-Basla`, `-Kalitesi`, `-SagGenislik`, `-PanKaydir`,
`-GolgeSil`, `-AlfaTaban`). "Kediler ilk" klibinin surukle-birak DISI
hazirlanmasinin tam gerekcesi ve kullanilan degerler:

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

- **Resolve'un keyeri arka planda TAM SIFIR alfa birakmiyor.** 1-20
  arasi ince bir film kaliyor; kendi basina gorunmez ama duz bir sayfa
  zeminine bindirilince cizimin dokusu (halka desenleri vb.) hayalet gibi
  goruluyor. `-AlfaTaban N`: N'in ALTINI sifirlar, ustunu 0-255'e yeniden
  gerdirir. Once artigi OLC (kadraj kenar seridindeki max alfa), sonra
  biraz ustunu ver. HD animasyonunda olculen artik max 18-19 idi,
  `-AlfaTaban 24` kullanildi -- gercek kenar yumusatmasi 255'e kadar
  uzandigi icin bu kadar kucuk bir taban onu bozmuyor. **Artik miktari
  export'tan export'a degisiyor:** `Kediler.mov`da (2026-08-07, 1920x1080
  ProRes 4444) kenar seridi max'i 51 cikti, `-AlfaTaban 55` kullanildi.
  Her yeni kaynakta yeniden OLC, onceki degeri varsayma.
  Olcum tarifi: `alphaextract` + `signalstats` ile kenar seridinde
  YMAX dagilimina bak; 255 cikan kareler konunun kenara degdigi
  karelerdir, onlari haric tut.
- **Bu klipler sonda BOZUK bitiyor -- ama her seferinde ayni sekilde
  degil.** Iki farkli bicim gorulen: (a) yesil/krem perdeli kaynaklarda
  KARARARAK soluyor, solma karelerinde arka plan artik anahtar renginde
  olmadigi icin hic silinmiyor; (b) Resolve export'unda son 17 kare
  bastan asagi OPAK siyah bir karta donuyor (alfa tum karede 255). Ikisi
  de dongude sayfanin uzerinde bir dikdortgen caktiriyor. **Her yeni
  kaynakta son yarim saniyeyi kare kare kontrol et.**
- **Bazi kaynaklarin ILK kareleri de bozuk.** HD animasyonunun ilk 2
  karesi, animasyon daha baslamadan BITMIS lockup'i gosteriyor, sonra
  siliniyor ve cizim basliyor -- dongude iki karelik bir sicrama. `-Basla`
  ile atlandi. Basi da sonu kadar kontrol et.
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
  **`/selam` klibi bu duzeltmeden ONCE uretilmisti ve gozden kacmisti:**
  `Mustafa Karsilama_seffaf.mp4` SAR'i `801623:800061` ile yayindaydi,
  tarayici 720 yerine 721 goruyordu (2026-08-08'de duzeltildi). Yeni bir
  klip eklemeden once TUM yayindaki klipleri ffprobe'dan gecir, yalnizca
  yeni olani degil.
  **Kabi `-c copy` ile duzeltmeye calisma:** SAR hem H.264 SPS'inde hem
  MP4 `pasp` kutusunda yaziyor; `h264_metadata` bsf'i ve `-aspect`
  denendi, ikisi de 1:1 vermedi (45847:45900 gibi degerlerde takildi).
  `setsar=1` ile yeniden kodlamak tek guvenilir yol -- paketlenmis alfada
  alfa piksel verisi oldugu icin yeniden kodlama onu bozmuyor (webm'deki
  gercek alfa kanaliyla KARISTIRMA, o baska).
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
  tek dayanak onlar. **ISTISNA (2026-08-08, Mustafa'nin acik talebi):**
  HD logosunun TUM kaynaklari silindi -- uc ProRes master (`HD 08.mov`,
  `HD Animation seffaf_arkaplan.mov`, `HD Seffaf Son.mov`, toplam 933 MB),
  eski islenmis ciktilar ve teslim dosyasi `HD Claude Teslim.mp4`.
  Geriye yalnizca paketlenmis klip kaldi:
  `Çalışma Alanı/HD Claude Teslim_seffaf.mp4` = `public/HD-Animasyon.mp4`.
  Logo yeniden uretilmek istenirse Resolve'dan yeni export sart; PNG'ler
  (`public/HD.png`, `HD-logo.png`, `icon-*.png`) duruyor.

## Tema (acik/koyu) ve video

Site iki tema tasiyor ve **koyu tema SAF SIYAH** (`--background: #000`,
`--foreground: #e5dfd0`; acik tema `#d2ccbe` / `#171717`). Video ile
calisirken en cok atlanan sey bu.

- **Statik SVG/PNG logo temayla kendiliginden donuyor, VIDEO donmez.**
  `.brand-logo` bir CSS maskesi: `mask: url(/HD-logo.png)` +
  `background-color: var(--foreground)`. Yani renk temadan geliyor, acik
  modda siyah koyu modda krem oluyor. Bir videoda cizim SIYAH olarak
  GOMULU; koyu tema siyah oldugu icin oldugu gibi konulursa GORUNMEZ.

  **Kullanilan cozum (2026-08-08): rengi klibin ICINE gom.** Paketlenmis
  klibin renk yarisi = maske x `#e5dfd0` (koyu tema foreground'u). Boylece
  koyu temada HIC filtre gerekmiyor, logo dogrudan dogru kremde cikiyor;
  acik temada `brightness-0` RGB'yi sifirlayip saf siyaha indiriyor.
  Tailwind: `brightness-0 dark:brightness-100`. `brightness()` yalniz
  RGB'yi olcekliyor, alfaya dokunmuyor.

  Renk yarisini tint'lemek ayri bir kaynak istemiyor: mevcut paketlenmis
  klibin MASKE yarisindan uretiliyor --
  `crop=...:0:1080,format=rgb24,lutrgb=r='val*229/255':g='val*223/255':b='val*208/255'`
  sonra maskeyle `vstack`. **`blend=all_mode=multiply` KULLANMA:** paketli
  `rgb24` girislerde kanallari karistirip yesil cikti veriyor (yasandi);
  `lutrgb` kanal basina calistigi icin guvenli.

  **Onceki cozum `dark:invert`'ti** -- klip saf siyah gomuluydu, koyu
  temada invert onu BEYAZ yapiyordu. Calisiyordu ama beyaz, sayfanin krem
  foreground'una gore fazla sertti. Beyaz surum yedekte:
  `Çalışma Alanı/HD Claude Teslim_seffaf_beyaz-yedek.mp4`.

  **Renkli bir klipte bunlarin HICBIRI ise yaramaz** -- tek renge indirmek
  de invert de renkleri bozar. Renkli klipler (karakter animasyonlari)
  zaten kendi renklerini tasidigi icin iki temada da dogru gorunuyor,
  onlara dokunma.
- Koyu temada dikkat edilecek ikinci sey: **cizimin kendi yer golgesi**.
  Acik temada zemin krem oldugu icin gorunmuyor, siyahta bej leke
  olarak kaliyor (`-GolgeSil`, yukarida).

## Yerlesim tuzaklari

- **Sabit (fixed) susleme klipleri vh, satir-ici (inline) ogeler px.**
  Kosede duran giris klipleri vh kullaniyor cunku tarayici
  yakinlastirmasinda ekranda ayni kalmalari isteniyor (asagida). Ama
  anasayfadaki animasyonlu logo gibi metnin arasinda akan bir oge
  px olmali -- o, sayfadaki diger her sey gibi yakinlastirmayla BUYUMELI.
- **Kadrajin bos payi yerlesimi bozar.** Animasyonlu logoda durgun
  haldeki yazi kadrajin yalnizca ortadaki %20'sinde (y 445-656 / 1080);
  kalan %40+%40 seffaf. Oldugu gibi konursa logo ile baslik arasinda
  kocaman bir bosluk kaliyor. Negatif dikey kenar bosluguyla toplandi
  (`my-[-38px]`). Yeni bir klipte once icerigin sinir kutusunu olc.
- Tailwind temel stilleri `<video>` ogesine `max-width: 100%` veriyor.
  Sabit genislik verirken `max-w-none` eklenmezse dar ekranda genislik
  kirpilir, yukseklik sabit kaldigi icin **goruntu ezilir**.
- Kutu orani klibin oranindan farkliysa `object-contain` yanlarda olu
  bosluk birakir. Kutu olcusunu klibin oranina gore sec. En temizi
  yalnizca yukseklik verip `w-auto max-w-none` birakmak: genislik
  canvas'in kendi oranindan gelir, olu bosluk hic olusmaz. Masaustu
  olculeri ve `/selam` boyle.
- **Klip olculeri px degil vh -- MOBIL KIRILIM DAHIL.** Tarayici
  yakinlastirmasi (Ctrl +) gorunum alanini CSS pikseli cinsinden kucultur,
  yani px ile verilen bir kutu ekranda BUYUR. vh ile verilen kutu ayni
  kalir. Cevrim: 1vh = 8px (800px yukseklikli gorunum alani referansi).
  **Bir sure yalnizca masaustu olculeri cevrilmisti, mobil olculer px
  kalmisti** ("telefonda yakinlastirma duzeni degistirmiyor" gerekcesiyle)
  -- bu EKSIKTI: masaustunde yeterince yakinlastirinca gorunum alani
  768px'in altina duser, `md:` kalkar ve px'li MOBIL olculer devreye
  girer, klip birden buyur. Olculdu: Derince klibi 526px yuksekliginde bir
  gorunum alaninda `h-[270px]` ile ekranin %51'ini kapliyordu, masaustunde
  ise %34'unu. Iki kirilimde de vh olunca %31.2 / %31.5'e oturdu.
  `w-full` verilen mobil klipler zaten guvenli: `w-full` her zaman ekranin
  tamami demek, yakinlastirmayla degismiyor.
- **Kirilim basamagi ayri bir sey, ve normaldir.** vh'ye gecmek bir klibin
  768px'i gecerken olcu DEGISTIRMESINI engellemez, yalnizca her iki
  kirilimda da yakinlastirmaya karsi bagisik yapar. Kediler ve Yagmur
  kliplerinde mobil duzen (`w-full`, tam genislik) masaustunden zaten
  bambaska oldugu icin bu basamak kasitli. Derince'de iki deger
  neredeyse ayni oldugundan (31.25 / 31.5vh) basamak pratikte yok.
  Basamagin tamamen kalkmasi isteniyorsa `/selam` deseni izlenir: tek bir
  vh yukseklik, `md:` varyanti hic yok.
- Negatif arbitrary deger `-right-[32px]` seklinde yazilinca bu Tailwind
  surumunde **hic CSS uretilmiyor**; dogrusu `right-[-32px]`.
- **Icerigi dikeyde ortalama.** Ana sayfa ile `/selam` ustten sabit
  dolguyla basliyor (`justify-start` / `pt-*`), cunku ortalanan ya da alta
  yaslanan bir blogun ust kenari metnin uzunluguna baglidir: dil TR/AR/EN
  arasinda degisince logo ve balon yer degistiriyordu. Ustten sabitlemek
  bunu tamamen kaldiriyor.
- Dev sunucusunun Tailwind ciktisi bazen bayatliyor: yeni bir sinif
  eklendigi halde CSS'te gorunmuyor. `rm -rf .next` + yeniden baslat.

## Arac tuzaklari (defalarca vakit kaybettirdi)

- **`select=eq(n\,N)` bash'te patlar.** `\,` kacisi bash tarafindan
  yenip ffmpeg `eq(n,N)` goruyor ve `N)` diye bir filtre ariyor
  ("No such filter: '0)'"). Bash'ten cagirirken ya cift kacis kullan
  ya da filtre ifadesini bir **node/ps1 dosyasina** koy (tek tirnakli
  arguman olarak gecince sorun yok). Tekrar tekrar bu hataya dusuldu.
- **`ffmpeg ... out.png` tek kare icin `-frames:v 1` ISTER.** Yoksa
  "Cannot write more than one file with the same name" der.
- **PowerShell'de degisken adlari buyuk/kucuk harf AYIRMAZ.** Script
  icinde `$daralt` yazmak `[int]$Daralt` parametresinin uzerine yazar ve
  "Object[] -> Int32 cevrilemedi" verir. Yerel degiskenlere parametre
  adlarindan FARKLI ad ver (`$daraltZinciri`, `$ssArg`, `$tArg`).
- **PowerShell'de native exe'ye `2>&1` yapma.** ffmpeg'in `-stats`
  ciktisi stderr'e gidiyor; yonlendirince her satir ErrorRecord'a
  sarilip komut basarisiz sayiliyor. stderr zaten yakalaniyor.
- **`$LASTEXITCODE`'u kontrol et.** Sadece "dosya var mi" bakmak
  yaniltici: basarisiz bir ffmpeg calismasi onceki denemeden kalan
  dosyayi oldugu gibi birakiyor ve "Bitti" yaziliyordu.
- **Tarayici panelinin `zoom` bolge kirpmasi calismiyor** ("region crop
  not yet supported"), tam ekran goruntusu doner.
- **Emulasyonlu gorunum alaninda (resize_window ile) ekran goruntusu
  yaniltici olcekte geliyor** -- oge sayfanin ortasinda duruyormus gibi
  gorunebilir. Yerlesim dogrulamasi icin ya `preset desktop` (yerel
  boyut) kullan ya da olcumlere guven.

## Dogrulama

Mustafa'nin tercihi: **hizli git, her seyi sayisal dogrulama, kucuk
seylere takilma, o soylerse yap.** Asagidakiler gerektiginde basvurulacak
yontemler -- rutin olarak hepsini calistirma.

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
