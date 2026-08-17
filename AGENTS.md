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

### `/sinama` deneme sayfasi — KALICI, SILINMEZ

`app/sinama/page.tsx` anasayfanin birebir kopyasi ve **her zaman var
olacak** (Mustafa'nin acik talimati, 2026-08-17). Amaci: bir degisiklik
yayindaki anasayfaya dokunmadan GERCEK sitede denenebilsin. Yeni bir
efekt/klip/duzen once burada denenir, onaylanirsa anasayfaya tasinir --
`/sinama` sonrasinda da yerinde kalir.

**Bu sayfayi silme, "kullanilmiyor" diye temizleme, `git status`ta fazla
gorunuyor diye kaldirmayi onerme.** Bir kez silinmisti (2026-08-08) ve
geri acildi; buton parilti efektlerinin uc surumu (`036ab8d`, `a0da1fc`,
`79f1ee5`) bu sayfada denendi.

Anasayfa degisince `/sinama` da elle guncellenmeli -- ortak bir bilesen
degil, KOPYA; iki dosya kendiliginden es kalmiyor.

`public/sinama/` klasoru ise yok: deneme varliklari (klipler vb.)
`public/` kokunde duruyor. 2026-08-08'de kullanimdan kalkan
`Mustafa Kediler Dogru_seffaf.mp4` o zaman silinmisti.

## 404: her bilinmeyen adres `/su-anda-buradasiniz`a gider

`app/not-found.tsx` tek is yapiyor: `redirect("/su-anda-buradasiniz")`.
Next.js'in ontanimli siyah-beyaz "404 | This page could not be found"
ekrani artik hic gorunmuyor; ziyaretci 307 ile gercek bir sayfaya
dusuyor ve adres cubugu da `/su-anda-buradasiniz` oluyor.

`app/su-anda-buradasiniz/page.tsx` duzen olarak `/mustafa-calisiyor`in
KOPYASI, tek fark balondaki cumle (`t.pageNotCreated`, uc dilde).
Ortak bilesen degil: birinin duzeni degisirse otekini elle guncelle.

**Bilincli tercih, yan etkisi var:** arama motorlari artik 404 yerine
yonlendirme goruyor ("soft 404"). Gercek 404 durumu istenirse
`not-found.tsx` redirect yerine ayni icerigi RENDER etmeli.

## Vercel Web Analytics (trafik istatistigi)

`app/layout.tsx`'in `<head>`inde tek satir:
`<script defer src="/_vercel/insights/script.js" />`.

**`@vercel/analytics` paketi BILEREK kurulmadi.** Bu makinenin bagli
oldugu ISAM agindaki FortiGate guvenlik duvari npm registry'sinin TLS
baglantisini kesip kendi sertifikasiyla imzaliyor ve ara sertifikayi
zincire koymuyor; Node dogrulayamiyor, `npm install` bu agda
`UNABLE_TO_VERIFY_LEAF_SIGNATURE` ile HER ZAMAN patliyor (kok
sertifikayi Windows deposundan cikarip `NODE_EXTRA_CA_CERTS` ile vermek
de ise yaramaz -- eksik olan kok degil, ara sertifika). Baska bir agda
`npm install` normal calisir.

Script yolu pakete hic bagimli degil, bundle'a agirlik eklemiyor.
Yerel `npm run dev`de 404 doner (dosyayi yalnizca Vercel uretir) --
NORMAL, dokunma. Vercel panelinde Analytics "Enable" edilmeden hic veri
akmaz.

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

Zaman ekseninde kesmek (`-frames:v 61`) yeniden kodlama ISTEMIYOR;
`-c copy` ile kalite kaybi sifir olur ve bayraklar kaynakla birebir ayni
kalir (Main / 5.0 / yuv420p / bt709 / SAR 1:1 / faststart).

**Son karede kalan parilti lekeleri.** Klip boyunca kucuk noktalar yanip
sonuyor ve uc tanesi son karede ACIK kaliyor; klip orada dondugu icin
kalici goruluyor. **Daha erken kesmek COZMUYOR:** olculdu, 53-55.
karelerde 7-9 leke var, sona dogru azaliyorlar -- 60. kare zaten en
temizi. Cozum, lekeleri `drawbox` ile sifirlamak (bu, `-c copy`yi
imkansiz kilar; crf 18 ile yeniden kodlandi).

- Lekelerin yerini gozle arama, **bagli bilesen analizi** yap: maskede
  en buyuk bilesen monogramdir, geri kalan her sey lekedir. Frame 60'ta
  bulunanlar: (1446-1455, 468-480), (1196-1205, 765-775),
  (528-533, 738-743).
- **Kutuyu HER IKI YARIYA da ciz** (`y` ve `y+1080`). Renk yarisi
  premultiplied oldugu icin yalnizca maskeyi sifirlamak rengi oldugu
  gibi birakir ve shader `color + (1-alpha)*bg` hesabinda toplamsal bir
  hayalet cikar.
- D'nin ic bosluğundaki 6 piksellik zerre BIRAKILDI: harf kenarina 5
  piksel mesafede, kutusu harfi keserdi; bu olcekte zaten gorunmuyor.

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
- **`w-full` verilen kliplerde bos pay = konu ekran kenarina DEGMEZ.**
  Kediler klibi 1920x1080 geldi ama icerik iki yanda 108'er piksel bos
  birakiyordu; mobilde tam genislik kutusuna konunca kenarlarda serit
  kaliyordu. `cropdetect` ile olcup 1704x1080'e kirpildi. Kirpmayi
  H.264 ciktisi uzerinde degil **ProRes kaynaktan** yeniden ureterek
  yap, ikinci nesil kayip olmasin. Yalnizca YATAYDA kirp: dikey kirpma
  alt hizalamayi ve `bottom-[-*vh]` payini kaydirir.
  Olcum tarifi: `ffmpeg -i klip.mp4 -vf "crop=W:H:0:H,cropdetect=limit=20:round=2:reset=0" -f null -`
  (paketli klipte once maske yarisini kirp).
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

## `/resule-kavusmak` — Isnad oyunu (Mustafa'yi Peygamberine kavustur)

Kucuk bir egitici oyun: kullanici hadis raviler bir isnad zincirinde
DOGRU sirayla secip Mustafa karakterini Hz. Nebi'ye "tirmandiriyor".

**Dosyalar:**
- `public/resule-kavusmak-game.html` — oyunun TAMAMI (HTML+CSS+JS tek
  dosyada, hicbir build adimi yok, Next.js'e dokunmuyor). Duzenlemeler
  DOGRUDAN bu dosyada yapilir, degisiklik icin `npm run build` gerekmez.
- `app/resule-kavusmak/page.tsx` — ince bir sarmalayici: yukaridaki HTML'i
  `<iframe src="/resule-kavusmak-game.html">` icine gomuyor (prototip
  hizli degistigi icin iframe secildi; tasarim oturunca gercek React
  bilesenine cevrilebilir).

Iframe SECILDI cunku dosya, sitenin geri kalanindan bagimsiz kendi
basina duran, kopyalanmis bir WebGL chroma-key cozumu tasiyor
(`app/ChromaKeyVideo.tsx`'in ayni mantiginin bir kopyasi, `initChromaKey`
fonksiyonu). Video: `public/Mustafa Karsilama_seffaf.mp4` (paketlenmis
alfa, bkz. yukaridaki "Yesil/kirmizi perde" bolumu).

### Oyun mekanigi ("kat tirmanma")

- `CORRECT` dizisi 7 kisi: `buhari` (muellif) + 6 gercek ravi
  (`humeydi`..`omer`). Buhari ve Hz. Nebi (hedef) birer "ravi"
  SAYILMIYOR — sayac (`FLOOR_COUNT = CORRECT.length - 1 = 6`) yalnizca
  aradaki 6 kisiyi sayiyor.
- Buhari oyuna ZATEN SECILI gelir (tiklama gerektirmez), Mustafa en
  basta onun yaninda durur. `step` 1'den baslar (Buhari zaten
  "bulunmus" sayilir).
- Geri kalan her ravi kendi KATINI (floor) alir: 1 dogru + 2 celdirici
  (`DECOY_POOL`'dan rastgele, 22 kisilik havuzdan 12'si kullanilir).
  Katlar DOM'a Hz. Nebi'ye en yakindan (son bulunacak ravi, `omer`)
  baslayarak yazilir — gorsel siralama YUKARIDAN ASAGI, tirmanis
  sirasinin TERSi.
- **ONEMLI DUZELTME (bu oturumda):** `step` sayaci ESKIDEN yalnizca
  Mustafa'nin 900ms'lik hareket animasyonu BITINCE artiyordu. Kullanici
  dogru cevaplara ART ARDA hizli basinca, ikinci tiklama hala ESKI
  `step` degeriyle kiyaslanip YANLIS sayiliyordu (kirmizi titreme).
  `handleCorrect()` icinde artik `step++` TIKLAMA ANINDA senkron
  calisiyor; yalniz gorsel/toast tarafi (Mustafa'nin hareketi, rozet,
  mesaj) hala 900ms'lik animasyonu bekliyor. Bu alani DEGISTIRIRSEN
  ayni hataya tekrar dusme: mantiksal state (`step`) ile gorsel
  animasyon ZAMANLAMASINI birbirinden AYRI tut.

### Coklu dil (TR/AR/EN) ve tema

Oyunun kendi tema/dil dugmesi YOK — gercek site basligindaki (page.tsx
DISINDA, layout.tsx'teki global) `ThemeToggle`/`LanguageSwitcher`
kullaniliyor. Iki yonlu senkron:

1. **Parent → iframe, ILK YUKLEME (senkron, flash yok):** `game.html`
   script'inin EN BASINDA, ayni origin oldugu icin `window.parent.document`
   dogrudan okunuyor (tema: `.dark` sinifi var mi; dil: `document
   Element.lang`). `buildNodes()+initState()`'ten HEMEN SONRA, hala AYNI
   senkron script calismasi icinde `applyLanguage(...)` cagriliyor.
   Boylece tarayici yanlis dili (varsayilan Turkce) HIC BOYAMIYOR —
   eskiden postMessage round-trip'i (ust pencerenin React effect'i
   calisip iframe'in `onLoad`'undan SONRA gelir) yuzunden kisa bir
   "once Turkce gorunup sonra degisiyor" yanip sonmesi vardi, bu artik
   yok. **Bu alani bozmamaya dikkat et:** `initialAppearance` okuma
   kodu ile `applyLanguage()` cagrisi arasinda HICBIR `await`/`setTimeout`
   olmamali, yoksa flash geri gelir.
2. **Parent → iframe, SONRAKI DEGISIKLIKLER:** `page.tsx`'teki
   `GameFrame` bileseni `useTheme()`/`useLanguage()`'i izleyip her
   degisiklikte + iframe `onLoad`'unda `{type:'resule-kavusmak-appearance',
   theme, language}` postMessage'i gonderiyor. `game.html` bunu dinleyip
   `data-theme` niteligini ve `applyLanguage()`'i guncelliyor.

**Ceviri kapsami** (kullanicinin acikca belirledigi kural):
- **Turkce (varsayilan):** ravi isimleri Turkce harf cevirisi
  (`Buhârî`, `Süfyân b. Uyeyne`...), hadis metni Turkce.
- **Arapca:** ISIMLER DAHIL HER SEY Arapca (ravi isimleri Arapca
  yaziyla, hadis metni de gercek Arapca haliyle).
- **Ingilizce:** isnad'in Arapca ALINTI metni HARIC her sey Ingilizce
  (ravi isimleri Ingilizce harf cevirisi, hadis metni Ingilizce
  ceviri).
- **isnad'in kendi Arapca metni (`.isnad-ar`, `data-ravi` span'lari)
  HICBIR ZAMAN cevrilmez** — o dogrudan alinti, 3 dilde de sabit.

Veri yapisi: `CORRECT` ve `DECOY_POOL`'daki her kisi nesnesi
`{id, tr, ar, en}` seklinde (tek tek `.name` alani YOK, `nameFor(entry)`
fonksiyonu `entry[currentLang] || entry.tr` doner). Hadis metni ayri:
`HADITH_TEXT_BY_LANG = {tr,ar,en}`. Arayuz metinleri (baslik, buton
yazilari, toast mesajlari vb.) `STRINGS = {tr:{...}, ar:{...}, en:{...}}`
icinde. Dil degisince `applyLanguage(lang)`: STRINGS'i uygular +
ekrandaki HER `.node` butonunu `NAME_BY_ID` uzerinden yeniden adlandirir
+ (oyun bitmisse) hadis metnini yeni dile gore yeniden yazar.

**Yeni bir ravi/celdirici eklerken** UCUNU de (tr/ar/en) birlikte
yazmayi unutma, yoksa o kisi Arapca/Ingilizce modda Turkce kalir
(fallback `entry.tr`'ye duser, sessizce, hata vermez).

### Font boyutu kurali

**Arapca metin = Turkce karsiligi + 4px**, `.lang-ar` sinifi altinda
scoped kurallarla (`#pageRoot`'a `applyLanguage()` icinde eklenir).
`.isnad-ar`'in kendi Arapca alinti metninin Turkce karsiligi olmadigi
icin o KOSULSUZ (dil modundan bagimsiz) kendi eski boyutunun +4px'i
(15→19px). Ravi buton isimleri (`.node`) ayrica Turkce/Ingilizce'de
+2px buyutuldu (11→13px), Arapcasi da bunun ustune +4 (13→17px). Yeni
bir metin elemani eklersen ayni oraninda bir `.lang-ar <secici>{font-size:
tr+4px;}` kurali ekle.

Arapca font: `.lang-ar` sinifi `#pageRoot`'a font-family zincirini
(`"Traditional Arabic","Noto Naskh Arabic","Arabic Typesetting",
"Segoe UI",serif`) veriyor, INHERITANCE ile tum sayfaya yayiliyor.
`<button>` elemanlari (`.node`, `.reset-btn`) tarayicinin UA
stylesheet'i font'u miras almayabildigi icin ACIKCA `font-family:
inherit;` tasiyor — yeni bir buton eklersen bunu unutma.

### Toast (bildirim) konumlandirmasi

Iframe'in KENDI kaydirma cubugu yok (yuksekligi icerige esitleniyor,
`page.tsx` postMessage ile `resule-kavusmak-height` alip iframe'i
buyutuyor) — yani CSS `position:fixed` burada TARAYICI PENCERESINE
degil, iframe'in KENDI (cok uzun) document'ine gore sabitleniyor. Bunu
duzeltmek icin `page.tsx` kendi kaydirma/viewport bilgisini
`{type:'resule-kavusmak-viewport', frameTop, viewportHeight}` ile
gonderiyor (scroll/resize + mount'ta), `game.html` bunu `lastViewportData`'da
onbelleklemis, `applyToastPosition()` bundan `position:absolute` +
hesaplanmis `top`/`bottom` degeri turetiyor.

`showToast(msg, variant, duration, position)`:
- `variant`: `'rose'` (yanlis, kirmizi) | `'green'` (basari, yesil) |
  `undefined` (notr).
- `duration`: ms, varsayilan 1600; kavusma mesaji 5000 kullaniyor.
- `position`: `'top'` (kavusma mesaji — YUKARIDA cikar, `.toast.top-pos`
  sinifi) | `undefined` (varsayilan ALTTA).

Mesaj hic gelmezse (sayfa iframe disinda dogrudan aciliyorsa) CSS'teki
sabit `bottom:24px` / `.top-pos{top:24px}` degerleri zaten dogru
calisir — `applyToastPosition()` `lastViewportData` bos oldugunda
no-op yapar.

### Hadis kutusu border parildamasi (2026-08-09)

Isnad tamamlanip hadis metni ortaya cikinca (`finish()`) `#hadithBubble`
(`.bubble` kutusunun kendisi -- hadis metnini VE isnad satirini birlikte
saran, `border-radius:22px` tasiyan bordurlu kutu) `glow-active` sinifini
alir: kutunun kenarinda surekli donen bir isik izi belirir. "Bastan
baslat" tiklaninca `glow-active` KALDIRILIR.

**Eskiden** (`#metinValue`'ye `sparkle` sinifi + `hadith-sparkle`
keyframe'i ile text-shadow pulse) yalnizca metnin kendisi parildiyordu;
Mustafa'nin acik istegiyle (2026-08-09) KALDIRILDI, yerine kutunun
BORDER'i parildiyor.

Kaynak: freefrontend.com "Glowing Border Trace Button"
(`codepen.io/gusevdigital/pen/JjxvbEW`) -- embedded SVG (`<rect
pathLength="100">` iki kopya: `glow-line` keskin cizgi, `glow-blur`
bulanik parlama), `stroke-dasharray`/`stroke-dashoffset` ile perimetre
etrafinda kayan bir "iz" olusturuyor. **Orijinali** `:hover`/`:focus`'ta
`transition` ile TEK SEFERLIK bir iz cizip birakiyordu ve JS ile
`getComputedStyle(...).borderRadius`'u SVG `rx`'ine senkronluyordu.
Burada oyun bitince "baslasin ve DEVAM etsin" istendigi icin:
- `transition` yerine `@keyframes glow-trace{ to{stroke-dashoffset:-100} }`
  + `animation:...linear infinite` kullanildi (sonsuz dongu).
- Tetikleyici `:hover` degil `.bubble.glow-active` sinifi.
- `rx` JS'le senkronlanmiyor, dogrudan CSS'te `22px` sabit (kutunun
  kendi `border-radius`'uyla ayni deger) -- boylece orijinaldeki JS
  senkron script'i (`setGlowEffectRx`) hic eklenmedi, gerek yok.
- Renk `var(--sparkle)` (eski efektle ayni degisken, `#fff`) kullaniyor,
  yani tema degisince ayrica dokunmaya gerek yok.

**`prefers-reduced-motion: reduce`'a KASITLI OLARAK bagli degil** (digger
sitede `.goal-pill`/`.node` gibi geceli efektlerin aksine). Ilk surumde
bagliydi: `animation:none !important` ile duruyordu ama `opacity:1`
kaldigi icin dasharray'in yalnizca 20/100'luk parcasi YANIK, SABIT bir
yay olarak donup kaliyordu. Mustafa'nin makinesinde/tarayicisinda bu
tercih ACIK oldugu icin ("Windows'ta animasyonlari azalt" veya benzeri)
efekt masaustunde TAM BU SEKILDE goruldu ve "yarida kaliyor" diye rapor
edildi (2026-08-09); telefonda ayni tercih kapali oldugundan sorunsuzdu.
Cozum: bu tek efekt icin reduced-motion sorgusu tamamen KALDIRILDI,
boylece iki platformda da ayni sekilde akar. Yeni bir azaltilmis-hareket
kosulu eklenecekse burada TEKRAR bu tuzaga dusme: `animation:none` DEGIL,
ya opacity'yi de birlikte sifirla ya da hic dokunma.

### "Sonraki" butonu ve `/mustafa-calisiyor` (2026-08-09)

`#nextBtn` (`.next-btn`, `#resetBtn`'in hemen alti, `footer-row` artik
`flex-direction:column`) varsayilan `display:none`; yalnizca `finish()`
`visible` sinifini ekleyince gorunur olur, "Bastan baslat" tekrar gizler.
Yani isnad DOGRU tamamlanmadan bu buton hic yok -- bos bir bosluk da
birakmiyor (opacity degil display).

`/mustafa-calisiyor` sayfasi `/selam`'in (`app/selam/page.tsx`) birebir
kopyasi (ayni logo/karakter/balon duzeni), TEK farki: balonda uzun
tanitim metni yerine tek cumle var -- `t.greetingLead`/`t.greetingBody`
DEGIL, `t.workingOnIt` (uc dilde de cevirisi var). `#nextBtn`
`target="_top"` tasiyor: bu HTML `/resule-kavusmak` sayfasinda bir iframe
icinde gomulu oldugu icin `_top` olmadan tiklama yalnizca iframe'i
degistirir, ust sayfayi degil.

### Bu sayfanin kendi basligi YOK

Eskiden `game.html` kendi karanlik/aydinlik dugmesi + "HD" yazisi +
"TR" dil rozeti ciziyordu (`.chip-icon`/`.brand-mark`/`.chip-lang`) —
bunlar KALDIRILDI, cunku gercek site basligi (marka logosu, tema/dil
dugmeleri) zaten `/resule-kavusmak` sayfasinda DISARIDA duruyor.
`.wrap`'in ust bosluğu da bu yuzden 76px'den 24px'e indirildi.

### Claude Artifact kopyasi (opsiyonel, siteden BAGIMSIZ)

Bu oyunun bir de Claude'da yayinlanmis "Artifact" onizlemesi var:
`https://claude.ai/code/artifact/b38e1974-0611-4d2e-933a-0ffe4c4b169d`
(URL sabit tutuluyor, her guncellemede ayni linke tekrar publish
ediliyor). **Bu, siteden TAMAMEN AYRI bir kopya** — canli siteye
pushlamak bunu OTOMATIK guncellemez, ayrica elle publish etmek gerekir.

**NE ZAMAN GUNCELLENIR: SADECE Mustafa acikca istedigi zaman**
("artifact'i de guncelle" gibi). Her siteye push'tan sonra otomatik
guncelleme YOK -- bu, 2026-08-11'de Mustafa'nin kendi acik talimati
(onceki not "gecmiste her degisiklikten sonra ikisini de istedi"
YANLIS/ESKI cikti, boyle bir talep gelmedi; simdi tam tersi acikca
soylendi: yalniz ara sira, ben istedigimde). O tarihte artifact ~19
commit/birkaç ay geride kalmisti, hicbir sorun cikarmadi -- yani
geride kalmasi BASLI BASINA bir sorun degil, sadece istendiginde
tazelenir.

**Guncelleme siteye push'tan cok daha fazlasini gerektirebilir.**
Artifact'ler DIS AG ISTEGI ATAMIYOR (strict CSP) -- yalnizca video
degil, siteye SONRADAN eklenen HERHANGI bir dis kaynak (2026-08-10'da
eklenen Google Fonts Arapca font linki gibi) da SESSIZCE basarisiz
olur. Guncellemeden once `public/resule-kavusmak-game.html`'i BASTAN
tara: `<link href="https://...">`, `@import`, veya baska bir goreli
`/...` kaynak eklenmis mi? Her biri ayni sekilde (video gibi) base64
`data:` URI'ye gomulmeli, yoksa o ozellik (font, vs.) artifact'te
sessizce bozuk kalir -- HATA VERMEZ, sadece yedek foota duser.

Guncellemek icin (script'i scratchpad'te tut, repo'ya commit ETME):

```js
// build-artifact.js -- gomulmesi gereken her yeni dis kaynagi buraya ekle
const fs = require("fs");
const [, , src, videoPath, fontPath, out] = process.argv;

let html = fs.readFileSync(src, "utf8");

// Video: ayni-kaynak GORELI yol bile agdan erisilemiyor.
const videoB64 = fs.readFileSync(videoPath).toString("base64");
html = html.replace(
  'src="/Mustafa%20Karsilama_seffaf.mp4"',
  'src="data:video/mp4;base64,' + videoB64 + '"',
);

// Arapca font: <link> DIS istek, CSP'de sessizce basarisiz olurdu.
const fontB64 = fs.readFileSync(fontPath).toString("base64");
const fontFace =
  "<style>@font-face{font-family:'Noto Naskh Arabic';font-style:normal;" +
  "font-weight:400 700;font-display:swap;src:url(data:font/woff2;base64," +
  fontB64 + ") format('woff2');}</style>";
html = html.replace(
  /<link rel="preconnect"[^>]*>\s*<link rel="preconnect"[^>]*>\s*<link href="https:\/\/fonts\.googleapis\.com[^>]*>/,
  fontFace,
);

fs.writeFileSync(out, html, "utf8");
```

Font dosyasini once indir (yalnizca Arapca subset yeterli, ~90 KB):
`curl -s -A "Mozilla/5.0 ... Chrome/120" "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap"`
CSS'teki `arabic` etiketli `@font-face`in `.woff2` linkini bul, indir.

Sonra `Artifact` aracini (`file_path` = ustteki `out`, `url` =
yukaridaki sabit link, `favicon`= 🕌) cagirarak publish et. Baska bir
oturum dokunmussa "hasn't viewed the latest version" hatasi gelebilir
-- burada ENDISE ETME: cikti resule-kavusmak-game.html'in TAMAMINDAN
YENIDEN uretiliyor (ustune ekleme degil), yani `force:true` guvenli.

### Genel notlar

- Butonlar (`.node`) TAM GENISLIKTE kalir, Mustafa'ya yer acmak icin
  KISILMEZ; Mustafa en sagdaki butonun yaninda dururken gerekirse
  `.page`'in `overflow-x:hidden`'i icinde board'un/sayfanin disina
  gorunmez sekilde tasar (bkz. `rightEdgePct()` yorumlari).
- `git status`'u kontrol etmeden varsayima girme: bu oyun uzerinde
  calisirken bir kez (2026-08-09 sabahi) commit'lenmemis degisiklikler
  disaridan (muhtemelen kullanicinin kendi git komutuyla) son commit'e
  SIFIRLANDI ve o oturumdaki is kaybolup yeniden yapilmak zorunda
  kalindi. Onemli bir asama bitince ARA SIRA commit atmak (kullanici
  onayiyla) bu riski azaltir.
- Test ederken `preview_start({name:'next-dev'})` + Browser panelinden
  hem `/resule-kavusmak-game.html` (dogrudan, standalone) hem
  `/resule-kavusmak` (gercek iframe icinde, tema/dil postMessage'lari
  dahil) ayri ayri kontrol edilmeli — ikisinin davranisi FARKLI
  (standalone'da `lastViewportData` hep null, toast CSS varsayilanlarina
  duser; postMessage'lar da standalone'da hic gelmez).
