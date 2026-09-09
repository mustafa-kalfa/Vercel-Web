# Silsile ağı — devir notları

Son güncelleme 2026-09-09. Önceki not dosyasının yerini alır.

## Nerede ne var

| Adres | Dosya | Durum |
|---|---|---|
| `/ravi-iliski-aglari` | `app/ravi-iliski-aglari/page.tsx` | Tanıtım metni, haritaya buton. Sitemap'te, indekse açık |
| `/ravi-iliski-aglari/harita` | `app/SilsileAgi.jsx` → `silsileVeri.js` | **Yayındaki sürüm**, canvas. Sayfa adı "Rivayet Haritası". Çalışma burada yürüyor |
| `/ag-sinamasi` | `app/SilsileAgi.jsx` → `silsileVeri.js` | Deneme adresi, `noindex`. Şu an yayındakiyle birebir aynı |
| — | `app/silsileAgiKur.jsx` | Çizim kodu. İki sayfa da bunu kullanıyor |
| — | `app/silsileVeri.js` | 821 râvi, 8126 bağ, çeviriler, konum hesabı |

ÇİZİM KODU TEK, VERİ İKİ. `silsileAgiKur.jsx` bir fabrika — `kur(V)` bir veri modülü alıp ondan beslenen bileşen döndürüyor. İki sayfa birer satırlık sarmalayıcı. Bileşeni kopyalamak da bir seçenekti ama 1400 satır iki yerde yaşardı ve her düzeltmeyi iki kez uygulamak gerekirdi — SVG sürümü son günlerin bütün iyileştirmelerini tam da bu yüzden kaçırmıştı.

Veri bir süre çatallanmıştı (kart doldurma yayındaki haritayı etkilemesin diye); 2026-08-30'da yayına alınıp çatal kapatıldı. Yeni bir deneme gerekirse yol açık — veriyi ya da bileşeni kopyala, `/ag-sinamasi`'nı kopyaya bağla. Ana sayfa kartı ve footer `/ravi-iliski-aglari`'ne bakıyor.

`next.config.ts`'te eskiden `/ravi-iliski-aglari → /mustafa-calisiyor` yönlendirmesi vardı, kaldırıldı.

## Veri durumu

- **821 râvi, 8126 bağ.**
- **160 boşluk** — kendi tercemesi hiç açılmamış, yani talebe tarafı boş râviler.
- **Bilgi kartları 208/661.** Kaynak İbn Hacer, *Takrîbü't-Tehzîb* (Şâmile 8609). Medâr, müksirûn, müellif ve "en önemli 60" listesi tamamlandı; kalanı düz taramayla sürüyor.

### Vefat yılları nereden geliyor

İki ayrı kaynak var ve karışması kolay:

- **141 râvide DİA'dan** geliyor. `DIA` tablosu hicrî ve milâdî yılı birlikte tutuyor ve `N()` içindeki değeri **eziyor** — yani o râvilerde N() satırına yazılan yıl hiç kullanılmıyor.
- **Kalan 520'de** `N()` çağrısındaki değer geçerli.
- Milâdî yılı DİA'dan gelmeyenlerde `miladiKestirim` ile hesaplanıyor ve tilde ile yazılıyor ("ö. 256/~870").

Takrîb ile fark çıkması **hata değil**: DİA modern tercihi, İbn Hacer klasik ihtilâftan bir görüşü yansıtıyor (Übey'de İbn Hacer 19 ve 32'yi anıyor, DİA 33 diyor). DİA'da olmayan râvilerde ise Takrîb daha güvenilir kaynak — özellikle yılın hiç bulunmadığı yerlerde.
- Tabakaya göre — 1'de 23, 2'de 32, 3'te 25, 4'te 9, 5'te 67.
- 6. tabakadaki 116 kişi **bilerek** boş. Kütüb-i Sitte müelliflerinin öğrencileri son sınır.
- Ebû Hüreyre'nin tercemesi neredeyse tam işlenmiş — Mizzî'nin saydığı 338 talebeden **333'ü kartta** görünüyor. Ama bunun yalnızca **64'ü haritada çizili**; kalan 269'u `DIS` tablosunda, kesik çerçeveli ve tıklanamaz çip olarak duruyor. Fark şundan: bir ismi haritaya nokta olarak koymak belde, vefat yılı ve tabaka ister, bunlar da o kişinin **kendi tercemesinden** gelir. Yani 338'i birden çizmek 269 terceme daha işlemek demek.
- İşlenmiş olanlar — İsmâîl İbn Uleyye, Abdürrezzâk b. Hemmâm. İş listesi `araclar/` altında üretilebiliyor.

## Terceme işleme boru hattı

Betikler `my-app/araclar/` altında.

1. **Düğüm tablosunu üret** — `node araclar/dugumleri-cikar.cjs` (`araclar/dugumler.json` yazar).
2. **Tehzîb'de tercemeyi bul.** Şâmile'de `shamela_get_toc` ile gez: `باب X` → `من اسمه Y` → terceme. Kitap kimliği **3722**, 35 cilt, 19.002 sayfa, ~8.000 terceme.
3. **Sayfaları çek**, «روى عنه» ve «روى عن» listelerini ham metin olarak bir dosyaya yaz.
4. **Eşleştir** — `node araclar/esle.cjs <metin> araclar/dugumler.json <ravi-id> talebe|hoca`
5. **İşle** — `node araclar/isle.cjs <ravi-id> talebe|hoca <metin> "<kaynak>"` (kenarları `EDGES` sonuna ekler).

### Şâmile tuzağı

**Başlık ve sayfa araması Tehzîb'de güvenilmez.** Dizin `ابن`'i `بن`'e indirgiyor, `ابن علية` araması 3466 sonuç veriyor. Uzun adlarda ise tokenleştirici kuyruğu tek bir token yapıp sıfır sonuç döndürüyor. Ayrıca **arama en fazla 5 belirteç alıyor**, gerisini sessizce atıyor — uzun nesep zinciri yazmak ayırt edici kelimeyi dışarı itiyor.

Bugün öncelikli yöntem **`shamela_search_phrase` ile kısa ve ayırt edici bir nesep parçası**; TOC gezintisi yalnızca o tutmayınca. Ayrıntı ve çözülmüş konum tablosu `araclar/tehzib-konum.md`'de.

### Eşleştiricinin süzgeçleri

Hepsi gerçek yanlış eşleşmelerden doğdu, teorik değil.

- **Kayıt sınırı** — `حميد بن عبد الرحمن بن عوف` kaydı Abdurrahman b. Avf düğümüyle eşleşmemeli, oradaki isim dedenin adı. İsim kaydın başında olmalı.
- **Kronoloji penceresi** — `علي بن الحسين` hem Zeynelâbidîn'in (ö. 94) hem Ali b. el-Huseyin b. Eşkâb'ın (3. yüzyıl) adının başı. Ters yönde 60 yıl pay var (talebe hocadan önce ölebilir, Mizzî `ومات قبله` der), düz yönde 100 yıl.

- **Künye başta ise ikinci belirteç de tutmalı** — `أبي بردة بن أبي موسى الأشعري` kaydı `أبو موسى الأشعري` düğümüne bağlanıyordu, yani oğul babaya. `ابو` herkeste ortak, ayırt eden ardındaki ad.
- **`مولى`nın ardındaki ad öznenin değil efendisinin** — `أبي المنذر مولى أبي ذر الغفاري` kaydı Ebû Zer'e gidiyordu. Künyesi atılmış varyant mevlâ işaretinde kesiliyor; tam varyant kesilmiyor ki `عكرمة مولى ابن عباس` gibi mevlâlığı adının parçası olanlar bozulmasın.

Bir de sessiz bir hata vardı: `nesep()` `ابن`i `بن` yaptığı için `وابنه` önce `وبنه`, baştaki waw düşünce `بنه` oluyordu; BAGLAYICI'daki `ابنه` bu yüzden hiç tutmuyor ve **her `وابنه X` kaydı** ismi başta sayılmadığından eleniyordu. Ebû Seleme, babası Abdurrahman b. Avf'ın talebe listesinde bu yüzden yoktu.

Ad karşılaştırması **alt dizi**, hem de iki yönde. Nesep zinciri iki tarafa da uzayabiliyor — `احمد بن حنبل` ile `احمد بن محمد بن حنبل` aynı kişi, `عبد الرحمن بن مهدي بن حسان` ile `عبد الرحمن بن مهدي` de öyle. Şöhret adları (`ابن جريج`) için ismin başta olma şartı aranmıyor.

## Performans — ne işe yaradı, ne yaramadı

### Yarayanlar

- Gövdeyi **durgun ölçekte dondurmak** (`useMemo`, `kg`). Kare 49 ms'den 4,9 ms'ye indi.
- **Görüş elemesi**, pencere ızgaraya yuvarlanıyor ki memo kararlı kalsın. ~4500 öğe ~1800'e.
- Uzaktaki kenarları **tek yolda birleştirmek**. ~1800 öğe 138'e.
- **JS hover'ı kaldırmak**, CSS'e almak. Fan sorununun asıl kaynağı buydu — her fare hareketi 4700 öğeyi yeniden kuruyordu.
- Salınım animasyonunu **38 öne çıkan düğümle** sınırlamak. 541 birleştirme katmanı telefonu dize getiriyordu.
- **Ekranda 3 pikselden kısa kenarları elemek.** 434 alt parça → 188, 52 KB → 22 KB.
- **`non-scaling-stroke`'u kaldırmak**, kalınlığı `w / kg` vermek. Kalemi cihaz uzayında üretmek zorunda olduğu için dönüşüm her değiştiğinde bütün şerit yeniden kuruluyordu. Blink'te bilinen yavaş yol.
- Akış animasyonunu **`steps()`** ile adımlı yapmak. Saniyede 60 boyama yerine ~9. Süreyi uzatmak tek başına işe yaramaz, maliyet kare sayısından gelir.

### Yaramayanlar

- **Uzakta kübik eğriyi düz çizgiye çevirmek.** 188 kenarın yalnızca 1'inde tetikledi. O ölçekte kavisler gerçekten görünür genişlikte.
- **`will-change: transform` SVG `<g>` üzerinde.** SVG içeriği HTML gibi katmana terfi etmiyor.
- **Veriyi paketten çıkarmak** ve **ızgara uzamsal dizin.** Bu ölçekte darboğaz değiller. 8.000 râviye çıkılırsa gerekli olurlar.

### Ölçüm tuzağı

Tarayıcı paneli gizlenince `requestAnimationFrame` duruyor, `setTimeout` 1 saniyeye kırpılıyor. **Kare süresi bu ortamda ölçülemedi**, dört farklı yöntemde de aynı duvara çarpıldı. Eleman sayısı ve yol verisi uzunluğu güvenilir, zamanlama değil.

## Canvas

2026-08-30'da yayına alındı ve SVG sürümü silindi. Grafik için DOM'da **sıfır öğe** (SVG'de aynı görünümde 185).

- Şekiller grafik biriminde, **yazılar ekran biriminde**. Ölçekli matris altında yazı tipi ipuçlandırılamıyor, metin bulanıklaşıyor.
- Tıklama hedefi elle kuruldu. `ciz` her geçişte vuruş kayıtlarını dolduruyor, `tuvaldaBul` etiket → düğüm → kenar sırasıyla tarıyor. **Kenar testi yalnızca yakında** çalışıyor, yoksa uzakta boş bir yere tıklamak hep kenar seçiyor.
- **Kaybedilenler** — salınım ve hale animasyonu, metin seçimi, ekran okuyucu erişimi.

### Canvas'a taşırken düşülen tuzak

SVG'de bütün gövde `scale(kg)` grubunun içindeydi, yani oradaki her sabit **grafik birimi**. `r + 8` yazıldığında ekranda `8 * kg` kadar taşıyordu — açılış görünümünde onda bir pikselden az. Canvas'a birebir taşınınca 8 **gerçek** piksel oldu. Müksirûn halkası, medar baklavası ve noktaların beyaz çerçevesi olduğundan çok kalın çıktı, noktalar birbirine girdi. Hepsi `* k` ile düzeltildi.

Netlik iki kaynaktan bozuluyordu. Cihaz piksel oranı ikiyle sınırlanmıştı, üç kata çıkarıldı. Ayrıca `devicePixelRatio` kesirli gelebiliyor (ölçülen 1.9999999835), yuvarlanmadan tampon 749 piksele kırpılıp 375 CSS pikseline yeniden örnekleniyordu. Tampon yuvarlanınca oran tam 2 oldu.

**Ölçüm tuzağı** — tampon boyutunu ilk çizimden önce okursanız 300×150 görürsünüz, yani canvas'ın varsayılanını. Birkaç kez yanlış teşhise götürdü.

Bir de **öğe işleyicilerinde yaşayan davranışlar sessizce kaybolur.** SVG'de her düğümün kendi `onPointerUp`'ı vardı ve `odaklan`'ı çağırıyordu; o fonksiyon yalnızca seçmiyor, ekranı seçilen râviye **ortalıyor** ve aynı râviye tekrar tıklandığında seçimi **kaldırıyordu**. Canvas'ta tıklama tek bir yere toplanınca doğrudan `setSecim`'e bağlandı ve iki davranış birden gitti. Arama kutusu ile karttaki çipler hâlâ `odaklan`'ı çağırdığı için fark ancak haritaya tıklarken görülüyordu. Tuvalde vuruş sonucu düğümse **`odaklan`'dan geçmeli**.
- Doğrulandı: açılış, yakınlaşma, kaydırma, düğüm ve etiket tıklaması, koyu mod, DPR (750×1516 tampon).

Yerleşim `YAY = 16` ile on altı kat seyrek (2026-09-02'de önce 2'den 4'e, sonra 16'ya çıkarıldı).

**`ACILIS_YAKINLIK` ile `YAY` birbirine BAĞLANMAMALI, bu bir kez yanlış yapıldı.** Eskiden `5.25 * YAY` yazılıydı. Sığdırma ölçeği `YAY` ile ters orantılı olduğu için çarpan `k`yı sabit tutuyor — ama grafik birimindeki mesafeler `YAY` katı açıldığından ekranda çerçeveye giren düğüm sayısı `YAY` katı **azalıyor**. `YAY` 16'da açılışta Hz. Peygamber'den başka nokta kadraja girmiyordu. Çarpan kaldırıldı, sabit **10,5** oldu (aynı değer, `YAY` 2'deki hâli): açılış artık `YAY`dan bağımsız, `YAY` yalnızca yakınlaşıldığında iş görüyor.

Açılış kadrajı: beş belde şeridi, Hz. Peygamber / Fâtıma / Ebû Bekir / Fazl b. Abbâs / Ömer, yıl ekseninde ~24 piksel/yıl. Telefonda da aynı — harita çok uzun ve dar olduğu için sığdırma ölçeğini iki cihazda da **yükseklik** belirliyor.

**Ölçek tabanları sabit sayı olamaz, `W`ye bağlı olmalı.** `enAzOlcek` ve `baslangic`taki `kSigdir` tabanı `1e-4` yazılıydı; tabanların asıl gerekçesi ölçülmemiş kapsayıcıda oranın eksiye düşüp ağı aynalaması. `YAY` 16'da gerçek sığdırma ölçeği bu sabitin altına indi ve uzaklaştırma orada durdu — telefonda harita bir türlü bütün olarak görünmüyordu (ölçüldü: 375×812'de sığdırma 7,54e-5, taban 1e-4, harita ekranı 1,33 kat aşıyor). Taban artık `1 / W`.

**Etiketlerin arkasındaki hale inceltildi**, kalınlık `punto * 0.32` → `punto * 0.14` (`HALE_KALINLIK`). Yazı zeminin renginde kalın bir kalemle bir kez daha yazılıp (SVG'deki `paintOrder: stroke`in tuval karşılığı) kenar çizgileri üzerinde okunaklı kalıyor. Önce tümden kaldırılmıştı; hale olmadan yazı çizgilerin üzerinde dağınık görünüyor, eski kalınlıkta ise harflerin çevresinde gözle görülür bir gölge bırakıyordu.

## Açık işler

- **156 terceme.** Ölçülen hız râvi başına ~30 bin token, toplam kabaca 4-5 milyon.
- **KAVIS eğri tablosu bayat.** Yerleşim sabitleri (`SERIT_W`, `ASGARI_DY`, `H`, `YIL_MAX`) değiştiğinde yeniden üretilmesi gerekiyordu, yalnızca orantılı ölçeklendi. Çakışma verisi artık geçerli değil.
- **İngilizce isimlerde mekanik çevrim boşlukları** — "Eslem mevla Omer", "Fatima bint Resulillah" gibi. `ING_SOZLUK` elle genişletilebilir.
- **Belde ataması denetlendi ama bitmedi.** Aşağıya bak: 821 düğümün
  332'si kaynakla teyitli, 274'ünde Takrîb/Tehzîb tercemesi hiç
  bulunamadı. O 274'ün çoğu sahâbe (kısa künye) ve şöhret adıyla
  kayıtlı meşhurlar.

## Belde denetimi (2026-09-09)

Belde haritanın **yatay ekseni**: yanlış belde noktayı yanlış sütuna
koyar. Yıl tarafındaki `DIA` gibi bir koruma yok, değer tek yerden —
`N()`'in 6. argümanından — geliyor.

Denetim mekanik tarama + hakemlik olarak yürüdü. Tarama, her düğümün
Takrîb (ve bulamazsa Tehzîbü't-Tehzîb) tercemesini bulup **ad
bölgesindeki nisbeyi** belde alanıyla karşılaştırıyor; kararı vermiyor,
yalnızca aday çıkarıyor. 821 düğümde: 332 uyuyor, 27 çelişki, 32'si
sütunu olmayan bir şehir, 110 çok aday, 131 nisbesiz, 274'ünde terceme
bulunamadı.

Ardından şüpheli olanlar tek tek karara bağlandı ve **her öneri ayrı bir
çürütme turundan geçti**. Çürütme boşuna değildi: on öneri orada
elendi.

### Tarayıcının tuzakları

**Eşleştirici yanılıyor ve yanıldığında sonuç makul görünüyor.**
"Abdurrahman b. Avf" (sahâbî) "Abdurrahman b. **Ebî** Avf el-Cüreşî
el-Hımsî"ye, "Nâfi‘ mevlâ İbn Ömer" "Nâfi‘ b. Ömer el-Cumahî
el-Mekkî"ye düştü. Her kararda kimlik ayrıca soruldu; vefat yılı en iyi
tutarlılık ölçüsü.

**Takrîb'in `تمييز` kayıtları râvinin kendisi değil adaşıdır.** Ebû
İmrân el-Cevnî (Basralı, ö. 128) "Bağdat'a yerleşti" diyen bir temyîz
kaydına düştü — Bağdat 145'te kurulduğu için ölüm yılı tek başına
yeterdi. Temyîz satırları artık taramada eleniyor.

**Ad iki tarafta da aynı süzgeçten geçmeli.** `parcala()` durak
sözcüklerini (bn, ebû, ebî, mevlâ) atıyordu ama terceme tarafında
atmıyordum; ilk belirteç eşitliği şartı yüzünden künyeyle başlayan her
isim sıfır aday veriyordu. Tek satırlık düzeltme 387 "terceme yok"u
274'e indirdi.

**Nisbe sanılan kabile adları.** `الهمداني` Hemdân **kabilesi**, Hemedân
şehri değil; Ebû'd-Duhâ bu yüzden Kûfe'den çıkarılacaktı.

**Düğümün kendi `not` alanı çoğu zaman kararı zaten yazmış.** "Yemâme
sütunlarda yok, ... Kûfe alındı", "Tâif sütunlarda yok, Mekke sütununa
konuldu" gibi. Hakem notu okumadığı için üç öneri bilinçli bir kararı
bozacaktı; çürütme turu yakaladı. **Belde önerirken önce `not` okunmalı.**

### Ölçüt: nereli değil, nerede rivayet etti

Mevcut veriden okunan kural şu: râvi **yerleştiği** yere konuyor, aslen
nereli olduğuna değil. Ma‘mer b. Râşid Takrîb'de "el-Basrî nezîlü'l-Yemen"
ama haritada Yemen; Saîd b. Mansûr "el-Horasânî nezîlü Mekke" ama
Mekke; Ebû Râfi‘ Nüfey‘ "el-Medenî nezîlü'l-Basra" ama Basra. Yani
`نزل / سكن` aslî nisbeyi yener.

Ama **uğramak yerleşmek değil**. İbrâhim b. Tahmân Bağdat'a geldi ve
Mekke'de öldü; Hafs b. Giyâs Bağdat'ta kadılık edip Kûfe'ye döndü. İkisi
de taşınmadı. Ebû Müshir ed-Dımaşkī mihnede Bağdat'a **sevk edilip**
orada öldü — Şam'da kaldı.

### Bağdat sütunu açıldı

Şehir 145'te kuruldu ve 3. yüzyılın hadis merkezi oldu; sütunu
olmadığı için orada yaşayan râviler başka şeritlere dağılmıştı ve
neredeyse hepsi **Basra**'ya düşmüştü. Yani haritanın 3. yüzyıl Basra'sı
gerçekte Bağdat'tı: İbn Maîn, Ali b. el-Ca‘d, Züheyr b. Harb, Affân b.
Müslim, Amr en-Nâkıd hep oradaydı. Bilgi kartlarının bir kısmı bunu
zaten yazıyordu ("Bağdat sütunlarda yok") — o cümleler artık kaldırıldı.

**30 râvi taşındı**, Basra 209'dan 187'ye indi. Sütun coğrafî sırada
Kûfe ile Cibâl arasında.

Hâlâ sütunu olmayan yerler: **Cezîre** (Rakka, Harrân, Musul; en
kalabalığı bu — Meymûn b. Mihrân, oğlu Amr, Abdülkerîm el-Cezerî,
Ca‘fer b. Burkān, Züheyr b. Muâviye, Me‘âfâ b. İmrân), Yemâme,
Medâin, Tâif, Askalan, Eyle, Filistin, Hadîse. Her biri bir elin parmakları
kadar râvi tutuyor; sütun açmak yerine en yakın merkeze konuldular ve
**bu tercih ilgili düğümün `not` alanında yazılı**.

### Araç

`node araclar/belde-guncelle.cjs <id>=<Belde> ...` — `BELDELER`'de
olmayan bir belde yazılmasını reddeder. Yemen eklenirken dört râvi tam
bu yüzden sessizce haritadan düşmüştü.

## Yarim islenmis dugumler (2026-09-09)

Bir dugumun yalnizca hocalari ya da yalnizca talebeleri islenmis
olabiliyor. Bunlar **en ucuz kenarlar**: kisi zaten haritada, yalnizca
tercemesinin bir yarisi okunmamis. Tarama basit —
`dugumleri-cikar.cjs`'in "kalan bosluk" sayaci talebe tarafini, ayni
hesabin tersi hoca tarafini veriyor.

Yirmi sekiz yarim dugumden yirmisi acildi, **55 kenar**. Geriye sekizi
kaldi ve hepsinde sebep ayni: karsi taraftaki isimler haritada yok
(Ebu Cuhayfe, Cundeb b. Abdillah el-Beceli, Musafi' b. Seybe...).

### Cikarirken cikan iki tuzak

**Talebe basligi iki bicimde geciyor.** Tehzibu't-Tehzib cogu yerde
«روى عنه» degil kisaca **«وعنه»** yaziyor. Yalnizca uzun bicimi aramak
Ali b. Mudrik, Ibrahim b. Meysere ve Yahya b. Umare'nin talebe
listesini BOS gosteriyordu.

**Kaydettigimiz ad cogu kez kisa.** "Mansur b. Safiyye" Ibn Hacer'de
"Mansur b. Abdirrahman b. Talha" (Safiyye annesi); "Hilal el-Vezzan"
"Hilal b. Ebi Humeyd ... el-Kufi es-Sayrafi el-Cehbez el-Vezzan". Bu
dugumlerde mekanik eslesme ya sifir ya cok aday veriyor; dogru baslik
gozle secilip betige yazildi.

### Ayni bosluk butun haritada vardi: +742 kenar

Yarim dugumlerde cikan ders butun tercemelere uygulandi. Tehzibu't-
Tehzib'de 359 dugumun listesi acilabildi ve kisa bicimlerden **742
kenar** cikti -- kenar sayisi 5959'dan 6701'e. En yuksek dereceler
tarihen dogru isimlere oturuyor: Su'be 140, Zuhri 104, Ibnu'l-Mubarek
99, Ebu Hureyre 96.

Kabul olcutu uc kath:

1. **Kayit, dugum adinin KISALTILMISI olmali -- tersi degil.** Kaydin
   butun belirtecleri dugumun adinda, AYNI SIRADA gecmeli ve kayit
   dugumden uzun olmamali. Ilk gevsek surum "dugumun belirtecleri
   kayitta gecsin" diyordu ve yari yariya yanlis uretti: kayit
   uzadikca ismimiz onun NESEP ZINCIRINE dusuyor
   ("معبد بن كعب بن مالك" Ubey b. Ka'b'a, "عامر بن سعد بن ابي وقاص"
   babasi Sa'd'a). Sira sarti da sart: "علي بن نصر الجهضمي" ile
   "نصر بن علي الجهضمي" ayni belirtecleri tasiyor ama biri otekinin
   OGLU. Uzun kayitlar zaten esle.cjs'in isi.
2. **Kronolojiden sonra TEK aday kalmali.** "شعبة" hem Su'be b.
   el-Haccac'a hem Mugire b. Su'be'ye uyuyor; ikisini ayiran sey isim
   degil yil.
3. **Terceme teyidi.** Baslik eslesmesi tek aday verse bile yanlis kisi
   olabilir. Dogru tercemenin listesinde o dugumun ZATEN cizili
   kenarlarindan bir kismi gorunmeli. 786 tam ad eslesmesinden 742'si
   boyle teyitlendi, teyitsiz 44'u ayrildi.

Toplu yazim `node araclar/kenar-toplu.cjs <json> "<kaynak>"` ile;
kenarlar oznesine gore bloklara ayriliyor.

Ardindan **kisaltilmis** (tam olmayan) ad eslesmeleri isledi: 564
teyitli adaydan 503'u kabul edildi, kenar 6701'den **7204**'e cikti.
Burada dort ek kapi var, hepsi gercek yanlislardan dogdu:

- **Kunye, hedefin adinda da gecmeli.** «ابو ضمرة» Enes b. Iyad'in
  kunyesi, Damra b. Rabia'nin ADI; «ابو ثور» Ibrahim b. Halid'in,
  «ابو معمر» Abdullah b. Sahbere'nin. Kunye "filancanin babasi"
  demektir, adin kendisi degil. Kaydettigimiz adlarin cogu kunyeyi
  zaten tasiyor («ابو هريرة الدوسي», «ابو نعيم الفضل بن دكين»);
  tasimayanlar tam da bu yanlislar.
- **Kisa eslesmede iki tarafin da yili olmali.** Kisa bicim adasi
  ayirt edemiyor, ayiran tek sey kronoloji. «ابو عوانة» kaydi Sabit
  el-Bunani'nin (o. 127) talebesi olarak Ebu Avane el-**Isferayini**'ye
  dusmustu; dogrusu Ebu Avane el-**Vasiti** (o. 176). Isferayini'nin
  dugumunde yil olmadigi icin pencere calismamisti.
- **Kayit dugumun adinin BASINDA baslamali** (ilk iki belirtecten
  birinde) -- yoksa kayit sona denk geliyor ve cogu zaman babayi
  anlatiyor. «عمر بن عبد العزيز» (halife) boyle «عبد العزيز بن عمر بن
  عبد العزيز» (oglu) dugumune dusmustu.
- Bu sarti asmanin uc mesru yolu var ve ucu de isaretli: kayit «ابن»
  ile basliyorsa, kunye ile basliyorsa, ya da tek kelimelik bir
  lakap/nisbe ise («الاعمش», «الشعبي», «بندار», «دحيم»).

Elenen 61 adayin bir kismi dogru kenardi ama yil eksikligi yuzunden
dusuruldu (Deraverdi, Ibn Huzeyme, Mutayyen). **Bu kasitli:** bir
dogru kenari kacirmak, bir yanlisini cizmekten iyi.

**Kovada is bitmedi.** Teyitsiz 44 aday hala duruyor. Ayrica «ابيه»
(babasi), «عمه» (amcasi) gibi AKRABALIK ZAMIRLERI hic cozulmedi --
bunlar dugumun kendi nesebinden cikarilabilir; Hamza b. Abdillah b.
Omer'in uc hocasi elle boyle bulundu.

### Terceme basligini secmek: yil capasi, belde DEGIL

Ilk taramada 821 dugumun yalnizca **405'inin** tercemesi acilabildi.
Sebep sudur: kaydettigimiz Arapca ad, Ibn Hacer'in baslik satirlarindan
(«• rumuz - tam nesep.») ya HICBIRINE ya da BIRDEN FAZLASINA uyuyor.
Ikisinde de terceme aciilmadi -- yanlis terceme secmek, baskasinin
butun hoca-talebe listesini iceri almak demek.

Ilk cozum denemesi adaylari **beldeye** gore ayirdi ve yanlis kisileri
sectti, cunku adaslarin cogu ayni sehirli:

| dugum | secilen |
|---|---|
| Abdullah b. Omer (sahabi) | Abdullah b. Omer el-**Omeri** (o. 171) |
| Ebu Said el-Hudri | **torunu** Said b. Abdirrahman |
| Abdurrahman b. Ebza | **oglu** Abdullah |
| Omer b. Ali b. Ebi Talib | Omer b. Ali b. el-**Huseyin** |

Hepsi ayni kaliptan: bizim ad, uzun bir nesebin ICINDE ata olarak
geciyor. Olcut **vefat yili** oldu: tercemenin govdesi dugumun yilini
soylemeli (+-2); soylemiyorsa terceme BIRAKILIYOR, baska olcute
dusulmuyor.

**Yil hem rakamla hem YAZIYLA aranmali.** Ilk surum yalnizca
«مات سنة (73)» bicimini ariyordu. Sahabe tercemelerinde yil cogunlukla
yaziyla geciyor («مات سنة ثلاث وسبعين») ve o kayitlar bos donuyordu:
Abdullah b. Omer'in dogru tercemesi hic yil vermedi, adasi el-Omeri'nin
tercemesindeki «(71)» ise +-2 penceresine girdi. Yani sahabinin yerine
171'de olen birinin hoca-talebe listesi alinacakti. `takrib_lib`in
`yil_coz`u ikisini de okuyor.

Sonuc **506 terceme** (405'ten). Acilanlar arasinda haritanin en buyuk
dugumleri var ve hicbirinin tercemesi daha once okunmamisti: Ibn Omer,
Enes, Ibn Abbas, Malik, Sevri, Ibn Uyeyne, Nafi', Hasan-i Basri.
Bunlardan **518 kenar** cikti (7204 -> 7722) ve ayni tarama zaten
cizili **4359** kenari da yeniden buldu -- baslik seciminin dogrulugu
asil bu orandan okunuyor.

**ISARET KAYDI TERCEME SANILIYORDU.** Ibn Hacer'in muhtasarinda
gercek tercemelerin yaninda kisa isaret kayitlari da var --
«عثمان بن أبي شيبة يأتي في عثمان بن محمد» (falancada gelecek),
«أبو حاتم الرازي. هو محمد بن إدريس الحنظلي» (o sudur), bir de tercemesi
olmayan isimlerde gecerken dusulmus isnad notlari. Bunlar ayni adla
basliyor ve gercek tercemeden KISA, dolayisiyla cozucunun "en kisa
basligi al" tercihi tam da yanlis tarafi seciyordu. «تقدم/يأتي» filtresi
yetmedi, cunku o kelimeler kaydin sonunda degil ortasinda geciyor.

Ayirici sart sudur: **gercek tercemenin hoca listesi vardir.** Aday
basliklar artik govdesine bakilarak eleniyor (300 karakterden uzun ve
icinde «روى عن» gecen). Sonuc: **37 dugum** bu sekilde yanlis tercemeye
baglanmisti, alti tanesinin hedefi degisti. Hicbiri kenar uretmemisti
-- isaret kaydinda liste olmadigi icin aday cikmiyor, teyit sarti da
zaten elerdi. Ama kart yazilacak olsaydi bos govdeden yazilacakti.

Duzeltmeden sonra 494 terceme aciliyor ve 60 kenar daha cikti.

**SOHRET ADI OLAN DUGUMLER ELLE SABITLENIYOR.** Cozucu adin ILK
belirtecini basliga cakiyor -- bu kural ata karismasini onluyor ama
kaydettigimiz ad sohret adiysa gercek baslikla ilk belirtecten
tutmuyor. «ابن شهاب الزهري» ile «محمد بن مسلم بن عبيد الله بن شهاب»,
«أبو إسحاق السبيعي» ile «عمرو بن عبد الله بن عبيد», «أبو بكر بن أبي شيبة»
ile «عبد الله بن محمد بن أبي شيبة» hep boyle. Bu dugumler eskiden
isaret kaydina dusuyordu, govde sarti gelince tamamen dustuler.

Ayni ailede ayni ad da elle sabitleme istiyor. Nasr b. Ali
el-Cehdami'nin hem dedesi hem torunu Tehzib'de var ve tek aday cikinca
yil hic sorulmuyor; Ebu Ishak es-Seybani ile oglu Ishak b. Suleyman da
oyle.

Sabit basliklar `araclar/terceme/baslik-elle.json`'da (id -> baslik
parcasi), `baslik-coz.py` onu once okuyor. **76 kayit**, terceme
sayisini 494'ten **568**'e cikardi ve toplam **347 kenar** getirdi
(7779 -> 8126).

Sozluge aday `araclar/terceme/sozluk-oner.py` ile uretiliyor. Orada
sart gevsetiliyor -- belirtecler basligin herhangi bir yerinde sirali
gecsin -- ve gevsek sart ata karismasi getirdigi icin IKI KAPI var:

1. **Yil.** Terceme govdesi dugumun yilini soylemeli (+-2). Yili
   olmayan dugum hic onerilmiyor.
2. **Baslik bizim adla baslamali ya da ad kunye olmali.** Yil tek
   basina yetmiyor, cunku terceme baskasinin yilini da aniyor. Ilk
   surumde bu kapi yoktu ve su yanlislari uretti: «كريب مولي ابن عباس»
   -> OGLU «محمد بن كريب», «يعلى بن أمية» -> OGLU «صفوان بن يعلى»,
   Hz. Peygamber -> «عبد الله بن عامر» (tercemede "Hz. Peygamber
   doneminde dogdu" cumlesi geciyor diye). Kunye istisnasi sart, cunku
   kaydettigimiz ad kunyeyse baslik verilen adla baslar
   («ابو سعيد الخدري» -> «سعد بن مالك بن سنان»).

Kapilari gecemeyen 135 aday "gozle bak" listesinde bekliyor.

**TEKIL ESLESME DE YANLIS OLABILIR.** Yil olcutu yalnizca birden
fazla aday varken calisiyor. Nasr b. Ali el-Cehdami'de dugumumuz torun
(o. 250), Ibn Hacer'in basliklarinda ise yalnizca DEDE var
("el-Cehdami el-Kebir", 2. yuzyil); tek aday oldugu icin yil hic
sorulmadi ve dedenin talebe listesi torunun kenari olarak yazildi.
Uc kenar bu sekilde girdi, sonra silindi. Ayni denetim butun tekil
eslesmelere uygulandiginda tek gercek hata bu cikti -- Ebu Bekir
es-Siddik da yanlis bir tercemeye ("Bekr b. Amr, Ebu's-Siddik
en-Naci") dusmustu ama teyit sarti onu zaten elemisti. Yeni bir
tarama kosulacaksa tekil eslesmeler de yila vurulmali.

Kalan 315 dugumde terceme hala acilmiyor: 262'sinde hic aday yok
(kaydettigimiz ad Ibn Hacer'inkinden farkli), 41'inde yil ayirmadi,
9'unda basliklar birbirine cok yakin, 3'unde ad tek belirtecli.

### esle.cjs'in kacirdiklari ve kenar-ekle.cjs

`esle.cjs` bilerek siki: kayit dugumun adiyla BASLAMALI. Bu kural
yanlis kenari onluyor ama terceme listelerindeki **kisa bicimleri** de
eliyor — «الاعمش», «شعبة», «الزهري», «عائشة» gibi sohret adlari ve
«ابيه» (babasi), «عمته حفصة» (halasi Hafsa) gibi akrabalik zamirleri.
Kaybedilenlerin degeri yuksek, cunku bunlar cogu zaman haritanin en
buyuk dugumleri. Hamza b. Abdillah b. Omer'in uc hocasi da
(«ابيه، وعمته حفصة، وعائشة») bu yuzden hic cizilmemisti.

Cozum eslestiriciyi gevsetmek DEGIL: gevsek surum yalnizca aday
gosteriyor, secim goze kaliyor, kabul edilenler
`node araclar/kenar-ekle.cjs <ozneId> <talebe|hoca> "<kaynak>" <id>...`
ile yaziliyor. Gevsek surumun neden karar veremeyecegi de olculdu --
"عبد الله بن وهب بن زمعة" (Medineli tabii) kaydi Misirli Abdullah b.
Vehb'e (o. 197), "وابي بشر" kaydi Ebu Bisr ed-Dulabi'ye (o. 310)
dusuyordu.

Bir de sessiz bir tercih hatasi: Besir b. Yesar'in talebesi
«ويحيى بن سعيد» icin esle.cjs **el-Kattan**'i (o. 198, Basra) sectti;
dogrusu Medineli **Yahya b. Said el-Ensari** (o. 143). Ayni ada sahip
iki dugumden birini secerken kronoloji penceresi yetmiyor, belde de
bakilmali.

## Bilgi kartlari

Kart metni artik **yerel Tehzibu't-Tehzib metninden** yaziliyor, MCP'ye
ugramadan. `baslik-coz.py` dogru tercemenin satirini veriyor,
`terceme-oku.py` govdeyi hoca/talebe listelerini atlayip cerh-ta'dil
bolumunden okuyor, karti insan yaziyor.

Yazma araci: `node araclar/not-guncelle.cjs <json>` --
`[{"id": "...", "not": "..."}]`. Metin komut satirindan degil
DOSYADAN aliniyor (kart metinleri uzun ve icinde hem Turkce hem
Arapca tirnak var) ve **var olan notu ezmiyor**; ustune yazmak icin
kayda `"ez": true` konmali. Kartlarin bir kismi arastirma sonucu, bir
kismi da yil calismasindan kalma kisa kayit ("Vefat yili ... girildi");
ikisini de kazara silmemek icin.

Kartsiz 398 dugumun **203'unde** terceme acilabiliyor; digerlerinde
once baslik cozulmeli. Sira dereceye gore: en cok kenari olan dugumun
karti en cok goruluyor.

## Kurallar

- `git add -A` **kullanma.** Bir kez kullanıcının işlenmemiş işini commit'e süpürdü. Yalnızca dokunduğun dosyaları evrele.
- Bilgi kartındaki metinler kopyalanabilir olmalı (`select-text`), tuval `select-none`.
- Yeni sayfa eklerken `app/sitemap.ts`'teki `YOLLAR` listesine de ekle. `noindex` taşıyan sayfa sitemap'e girmemeli.
