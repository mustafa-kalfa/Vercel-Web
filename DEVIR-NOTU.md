# Devir notu — rivayet haritası, bilgi kartları

Bu dosya sohbet değiştirmek için yazıldı. Yeni sohbette **ilk iş bunu
okumak**, sonra "Havuzu tazele" bölümündeki iki komutu çalıştırmak.

## Nerede kaldık

| | |
|---|---|
| düğüm | 821 |
| kenar | 8220 |
| bilgi kartı | **720** |
| tercemesi çözülmüş düğüm | 708 / 821 |
| Şâmile bağlantısı | 707 |
| kart yazılabilir havuz | **0 — bitti** |

Çalışma ağacı temiz, son doğrulanan build `✓ Compiled successfully`.
**Push `main`'e canlıya deploy demek**, Mustafâ söyleyince atılıyor.

Kırk ikinci parti 35 kartın tamamını birden yazdı. Kalan 113
çözülemeyen kaydın 108'i `aday-yok` ve hemen hepsi **Kütüb-i
Sitte'nin kitap râvileri** — Firebrî, Nesefî, İbn Dâse, Taberânî
gibi, yani müelliflerden kitabı nakleden nesil. Tehzîb'in kapsamı
müelliflerin hocalarında bittiği için bu isimlerin tercemesi **yok**,
çözülememeleri hata değil. Gerçek râvilerden elde kalan tek isim
`abdulmelikhumeyd` (aşağıda).

Yani havuzu tekrar doldurmanın yolu Tehzîb'de terceme aramak değil,
**başka bir kaynağa geçmek** — bu isimlerin çoğu Târîhu Bağdâd,
Siyeru a'lâmi'n-nübelâ ve Tezkiretü'l-huffâz'da var.

## Asıl iş — Takrîb'i haritaya almak

Mustafâ 11 Eylül'de yönü netleştirdi: **asıl iş Takrîb ve Tehzîb'i
tamamlamak**, kalan kitap râvilerini Siyer'den kovalamak değil.

**İş bölümü.** İskelet Takrîb'den, bağlar ve kart Tehzîb'den. Sebebi
şu — bir düğümün ihtiyacı olan dört alan Takrîb'de **tek satırda** ve
düzenli bir kalıpla duruyor.

```
331- <ad ve nisbeler> <cerh-ta'dîl> من <tabaka> مات سنة <yıl> <rumûz>
```

Tehzîb bunların hiçbirini bu düzenlilikte vermiyor. Buna karşılık
hoca-talebe listeleri ve cerh-ta'dîl malzemesi yalnızca onda var.

**Araç** `araclar/terceme/takrib-iskelet.py`. Yazmıyor, çıkarıyor ve
sayıyor. `--dogrula` kipi haritadaki düğümleri ölçüt alıp aynı
çıkarımı onların üzerinde yapıyor.

| | |
|---|---|
| Takrîb kaydı | 8.261 |
| tam iskelet veren | **1.144** |
| vefat ifadesi yok | 2.591 |
| belde yok | 2.488 |
| tabaka yok | 1.084 |
| ihtilâflı yıl | 367 |
| yaklaşık ifade («بعد», «قبل») | 248 |
| birden çok nisbe | 136 |

**Doğrulama** (119 düğüm eşleşti, ölçüt haritanın kendisi).

| alan | isabet |
|---|---|
| vefat yılı | **%95,8** |
| belde | **%95,8** |
| tabaka | %77,3 |

Yıldaki beş sapmanın bir kısmı hata değil **kaynak ihtilâfı** — Nu'mân
b. Beşîr'de Takrîb 65 diyor, düğümde 64 yazıyor.

**Tabaka ayrı bir mesele ve yerleşimi etkilemiyor.** Nokta belde
(sütun) ve vefat yılı (satır) ile konuluyor; `tab` yalnızca kartta
görünen kademe adını besliyor. Takrîb'in on iki tabakasıyla bizim yedi
kademenin eşlemesi tahmin edilmedi, veriden öğrenildi — ilk tahminim
%50'de kalmıştı. Öğrenilmiş eşlemenin tavanı %77,7, yıldan kestirmek
%81,9. Bandlar gerçekten örtüşüyor (bizim tab 3'ün vefat yılı 43-123,
tab 4'ün 92-165), yani `tab` elle verilmiş bir hüküm.

**Sütunlara dağılım** (harita → +yeni → toplam).

| belde | harita | yeni | toplam |
|---|---|---|---|
| Basra | 187 | 211 | 398 |
| Kûfe | 175 | 208 | 383 |
| Medine | 164 | 117 | 281 |
| Bağdat | 30 | 143 | 173 |
| Mısır | 41 | 121 | 162 |
| Horasan | 50 | 91 | 141 |
| Şam | 47 | 72 | 119 |
| Humus | 16 | 82 | 98 |
| Mekke | 47 | 36 | 83 |
| Mâverâünnehir | 32 | 15 | 47 |
| Vâsıt | 13 | 18 | 31 |
| Cibâl | 12 | 18 | 30 |
| Yemen | 6 | 12 | 18 |
| **toplam** | **820** | **1.144** | **1.964** |

### Kûfe transı ölçüldü (2026-09-13)

Mustafâ "önce yalnız Kûfe'yi görelim, ağ sınaması sayfasında" dedi.
Boru hattı uçtan uca koşturuldu, sonuç şu.

| adım | sayı |
|---|---|
| Takrîb'in Kûfe iskeleti | 208 |
| ad bölgesi çıkarılamadı | −45 |
| haritada **zaten var** | −29 |
| **gerçekten yeni düğüm** | **134** |
| tercemesi çözülen (kendi Tehzîb tercemesi) | 98 / 134 |
| aday kenar | **997** |
| — bir ya da iki ucu yeni | 720 |
| — ikisi de mevcut düğüm | **277** |
| bağı olan yeni düğüm | **114 / 134** |
| derecesi 3+ (süzgeçten geçecek) | **93** |

**ASIL BULGU: yeni kişinin KENDİ tercemesini çözmek şart.** Yalnızca
var olan 708 tercemenin hoca-talebe listelerini taramak 130 düğümün
**47'sini** bağlıyor ve **19'u** süzgeçten geçiyordu. Yeni gelenlerin
kendi tercemeleri de çözülünce aynı sayı **114** ve **93** oldu, kenar
423'ten 997'ye çıktı. Yani Takrîb iskeleti ucuz veriyor ama ağı ören
şey Tehzîb tercemesi; iş birimi hâlâ "kişi başına bir terceme".

**277 kenar mevcut düğümler arasında** ve transtan bağımsız — hiç yeni
nokta eklemeden, bugünkü haritaya doğrudan yazılabilir.

### Bu turda kapanan üç tuzak

- **`ابن` → `بن` çevrimi atlamalı çalışıyordu.** `(\s|$)` sondaki
  boşluğu yutuyor, ardışık «ابن X ابن Y» dizisinde ikinci ve dördüncü
  geçişler eşleşmiyordu. Nesep kırpması bu yüzden hiç devreye girmedi
  ve **39 dereceli bir mıknatıs düğüm** üretti — uzun ve çöplük bir ad,
  kenar tarayıcısında her kaydı kendine çekiyor. İleriye bakış
  (`(?=...)`) boşluğu tüketmiyor.
- **Ad bölgesi kara listeyle kesilemiyor.** Takrîb adın ortasına zapt
  açıklaması sokuyor («رقبة بقاف وموحدة مفتوحتين ابن مصقلة») ve bu
  sözvarlığı açık uçlu. Ölçüt **beyaz liste** oldu: bir belirteç ancak
  neseb bağlacı, nisbe kalıbı ya da haritanın sözvarlığında geçen bir
  adsa adın parçası. Kısa kesmek güvenli yön — kenar tarayıcısı kaydı
  düğüm adının kısaltılmışı sayıyor, yani kısa ad daha AZ eşleşir.
- **Mükerrer denetimi iki kez sızdırdı.** Haritadaki adların bir kısmı
  künye-önce yazılı («أبو كريب محمد بن العلاء»), Takrîb ad-önce
  veriyor; bir de harf-i tarif farkı var. Altdizi testi bu yüzden Ebû
  Küreyb'i, Ebû Üsâme'yi ve Haccâc b. Ertât'ı "yeni" saydı. Ölçüt
  **çekirdek kümesi** oldu — bağlaç ve künye işareti atılmış, harf-i
  tarif soyulmuş. Küme testi tek başına da fazla birleştirdi («جعفر
  محمد» üç ayrı kişiye), o yüzden ortak belirteçlerden birinin **nadir**
  olması ve iki belirteçlik çekirdeğin ancak **birebir eşitse** delil
  sayılması şart koşuldu. `araclar/mukerrer-ayikla.mjs`.

### Yapılanlar (2026-09-13)

**277 → 289 kenar ana haritaya yazıldı.** Yayına yazılacak şey yayındaki
düğüm kümesiyle bulunmuş olmalı, o yüzden tarama genişletilmiş tabloyla
değil **ana tabloyla** yeniden koşturuldu; sayı 289 çıktı. Kenar
**8220 → 8509**. Eşleşme sebepleri — 174 `tam`, 69 `bas`, 23 `kunye`,
19 `lakap`, 4 `ibn`. En riskli grup olan `lakap` ve `ibn` (23 kayıt)
tek tek gözden geçirildi; hepsi tanınmış lakap (A‘meş, Gunder, Zühlî,
Bündâr, Fellâs, Duhaym, Şa‘bî) ve kronoloji kapısı yerinde.

**Kûfe çatalı kuruldu.** `app/silsileVeriKufe.js` ana veriye hiç
dokunmadan 134 düğüm ve 720 kenar ekliyor, `/ag-sinamasi` ona bağlı.
Kûfe sütunu **176 → 310**. Bütün yeni düğümlerin yerleşimi hesaplandı
(eksik 0), sütun sayısı ve genişliği değişmedi.

Tarayıcıda doğrulandı — `Ahmed b. Abdullah b. Yûnus` (ö. 227, Kûfe,
Etbâu't-tâbiîn) doğru sütunda, 12 hoca 6 talebeyle çizili; hocaları
arasında Süfyân es-Sevrî ve Mâlik, talebeleri arasında Müslim.

Çatal modülünde import **uzantılı** yazılıyor (`./silsileVeri.js`).
Turbopack uzantısızı da çözüyor ama düz Node çözmüyor ve bu bir **veri**
modülü — araçlar onu doğrudan yüklüyor.

**Bunlar iskelet düğüm**: bilgi kartı ve Şâmile bağlantısı yok. Kart
yazmak yine terceme okumak demek.

### Bütün sütunlar transa alındı (2026-09-13)

Mustafâ Kûfe'ye bakıp "sorun yok, sayfa hızını etkilemeyecekse devam
et" dedi. **Hız ölçüldü, etkilemiyor** (aşağıda), aynı boru hattı on üç
sütuna birden koşturuldu.

| | ana harita | çatal |
|---|---|---|
| düğüm | 821 | **1.614** |
| kenar | 8.509 | **11.874** |
| sütun | 13 | 13 |

**793 yeni düğüm**, 656'sı bağlı (%83), **512'si derece 3+** (%64).
Yerleşimi hesaplanmayan düğüm yok. Sütun genişliği 520.920 → 706.920
(%36), Basra daha çok şerit istediği için.

| sütun | ana → çatal | | sütun | ana → çatal |
|---|---|---|---|---|
| Basra | 187 → 327 | | Şam | 47 → 98 |
| Kûfe | 176 → 299 | | Humus | 16 → 79 |
| Medine | 164 → 250 | | Mekke | 47 → 69 |
| Bağdat | 30 → 137 | | Mâverâünnehir | 32 → 46 |
| Mısır | 41 → 130 | | Vâsıt | 13 → 25 |
| Horasan | 50 → 118 | | Cibâl | 12 → 23 |
| | | | Yemen | 6 → 13 |

**Hız ölçümü.** Yükleme farkı gürültü içinde (JS +4 KB, canlıda ölçüldü).
Çizim tarafında kenar sayısı yalnızca **görünüm değişince** ödeniyor,
her karede değil — sabit katman önbelleği o işi atlıyor. Toplu yolla
8.509 kenar 1,1 ms, 15.000 kenar 2,1 ms, 25.000 kenar 3,3 ms.

**Mükerrer denetimi bu turda İKİ KEZ daha sızdırdı.** Sebepleri ayrı ve
ikisi de kodda yazılı — ters sıralı adlar («جعفر بن محمد» dedesi Ca‘fer
olan birine yapışıyordu) ve künyesi atılınca tek belirteç kalan düğümler
(«أبو داود الطيالسي» → «الطيالسي»). Ölçüt artık **sıralı altdizi** ve
bir adın **iki okunuşu** (künyeli/künyesiz) birden deneniyor. 160
mükerrer yakalandı.

**Elde kalanlar.** 1.144 iskeletin 190'ının ad bölgesi çıkarılamadı,
303'ünde çeviri-yazı eksik («...» içinde işaretli, uydurulmadı). Kalan
birkaç mükerrer olabilir — her tur öncekinden az yakalıyor ama sıfıra
inmedi.

**Karar bekleyen iki şey.**

1. **Görselleştirme.** 1.964 nokta bugünkü haritanın iki buçuk katı.
   Mustafâ'nın kendi önerisi duruyor (2026-09-11): "üçün altında hoca
   ve talebesi olanlar haritada hiç görünmesin, sadece Râvi Ara ile
   arandığında görünsün." Bu yapılmadan düğüm eklemek haritayı
   okunmaz kılar.
2. **Eleme eşiğini gevşetmek.** Reddedilen 7.100 kaydın bir kısmı
   kurtarılabilir — nisbe listesi kısa, ihtilâflı yıl zaten haritada
   tilde ile gösterilebiliyor. Ama gevşetmenin bedeli isabet, ve
   ilke belli: "bir doğru kenarı kaçırmak, yanlışını çizmekten iyi."

## Havuzu tazele

Kart havuzu ve terceme çözümü **scratchpad'de değil**, komutla
üretiliyor. `$S` yeni oturumun kendi scratchpad'i olsun.

```bash
PYTHONIOENCODING=utf-8 python araclar/terceme/baslik-coz.py "$S/cozum.json" "$S/kalan.json"
node araclar/terceme/kart-havuzu.cjs "$S/cozum.json" "$S/havuz.json"
```

Birincisi `COZULEN: 708 / 821` yazmalı, ikincisi
`yazilabilir havuz: 0`. Sayılar tutmuyorsa bir şey bozulmuş demektir,
kart yazmadan önce ona bak.

Havuz **dereceye göre sıralı** — en çok kenarı olan düğüm başta, çünkü
kartı en çok o görülüyor.

## Kart yazma döngüsü

Altışar altışar gidiyoruz. Bir parti şöyle işliyor.

**1. Tercemeyi oku.** `terceme-oku.py` gövdeyi hoca ve talebe
listelerini atlayarak, cerh-ta'dîl bölümünden gösteriyor.

```bash
PYTHONIOENCODING=utf-8 python araclar/terceme/terceme-oku.py "$S/havuz.json" id1,id2,id3
```

**2. Kartı elle yaz.** Metni ben yazıyorum, betik yazmıyor. Kartlar
Türkçe, iki üç cümle, tercemede geçen cerh-ta'dîl sözünü tırnak içinde
Arapça vermek yerleşik biçim. Örnek için `silsileVeri.js`'te var olan
notlara bak.

**3. Yaz.** JSON dosyadan alıyor, komut satırından değil (metinlerde hem
Türkçe hem Arapça tırnak var).

```bash
node araclar/not-guncelle.cjs "$S/kartlar-20.json"
```

Biçim `[{"id": "...", "not": "..."}]`. **Var olan notu ezmiyor**,
üstüne yazmak için kayda `"ez": true` konmalı. Kartların bir kısmı
yıl çalışmasından kalma kısa kayıt ("Vefat yılı ... girildi"), onları
kazara silmemek için.

**4. Build'i doğrula, commit et.**

```bash
npm run build
```

Commit mesajı biçimi `Bilgi kartlari kirkinci parti: alti kart`.

## Kural olmuş şeyler

- **`git add -A` kullanma.** Bir kez kullanıcının işlenmemiş işini
  commit'e süpürdü. Yalnızca dokunduğun dosyaları evrele.
- **Build'i `&&` zincirinde doğrulama.** `npm run build` ayrı
  çalışacak ve `Compiled successfully` satırı gözle görülecek.
- `/sinama` sayfası kalıcı, silinmeyecek.
- Arapça regex'te `\b` **yok**.
- `python -c` içine bash üzerinden ters tırnak koyma.
- `esle.cjs` kuru çalıştırması `isle.cjs`'ten önce gözle okunacak.
- Çeviri-yazı (transliterasyon) yazım işi yapılmıyor.
- Kullanıcı **kısa cevap** istiyor. `noktalama-tercihi` skill'i
  yüklüydü — Türkçe metinde `:` ve `;` azaltılıyor.

## Zaman yiyen tuzaklar

Bunlar bir kez ödendi, tekrar ödenmesin.

**Kaynak metinler yerel ve gitignore'da.**
`araclar/terceme/metin/` altında — `takrib.txt` 2 MB,
`tehzib.txt` 45 MB, `tehzibut.txt` 12 MB. MCP'ye gidip gelmeye
gerek yok, hepsi tek betikle taranıyor.

**Şâmile'nin gizlediği başlıklar.** Dışa aktarma sayfa başlığını bir
sonraki satırın önüne yapıştırıyor, o satır «•» ile başlamıyor ve
başlık görünmez oluyor. 180 terceme böyleydi. Çözüm `tt_lib.py`'de —
başlık tanıma **yalnızca oradan** yapılacak, betikler kendi başına
yapmayacak.

**"bas" kapısında oğul kalıbı.** Eşleşmede indis 0 **ve** 1'e izin
verilince indis 1 tam olarak "X b. \<babanın tam adı\>" oluyor ve
râvi oğluna bağlanıyor. İndis 0'a sıkıldı, üretilmiş 59 kenar silindi.

**İşaret kayıtları terceme sanılıyordu.** «عثمان بن أبي شيبة يأتي في
عثمان بن محمد» gibi yönlendirmeler. 37 düğüm etkilenmişti. Gövde şartı
(300+ karakter ve «روى عن» içermeli) kapattı.

**Yıl yalnızca rakamdan okunuyordu.** Sahâbe tercemeleri yılı yazıyla
veriyor («مات سنة ثلاث وسبعين»). `takrib_lib.yil_coz` ikisini de
okuyor.

**Belde eşitlik bozucu olarak yanlış kişiyi seçiyordu** — İbn Ömer
yerine el-Ömerî, Ebû Saîd el-Hudrî yerine torunu. Vefat yılı çapası
kullanılıyor artık.

**Yeni belde sütunu tam genişliğe mal oluyor** (bütün sütunlar en
genişine eşit). Bağdat 30 kişiyle değdi, Cezîre 6 kişiyle değmedi.
`BELDELER`, `COGRAFI` ve `BELDE_AD` **üçü birden** güncellenecek —
Yemen bir kez yalnız `COGRAFI`'ye eklendi ve dört râvi sessizce
haritadan düştü.

**İlke.** "Bir doğru kenarı kaçırmak, yanlışını çizmekten iyi."
Terceme başına teyit şartı (doğru terceme, düğümün zaten çizilmiş
kenarlarından bir kısmını yeniden üretmeli) en güçlü tek koruma çıktı.

## Yanlış terceme taraması

On sekizinci partide iki düğümün **yanlış tercemeye** bağlandığı
görüldü, kart yazılmadan önce yakalandı. Tarama şu kalıpla yapıldı —
düğümün Arapça adının ilk üç belirteci (`X بن Y`) başlıkta bitişik
geçmiyorsa bayrak. 144 düğümden 7'si bayraklandı, 5'i yanlış alarmdı
(dedesiyle meşhur olan râviler — Selemetü'bnü'l-Ekva‘, Mikdâd b.
el-Esved, İbn Husayfe, el-Hakem el-A‘rec, Selîm b. Hayyân).

- `amrharis` Humuslu bir adaşa bağlanmıştı, doğrusu 58274. satır.
  `baslik-elle.json`'a yazıldı.
- `ms03` (İbrâhim b. Muhammed b. Hamza) — bu adın Tehzîb'de tercemesi
  **yok**, çözücü Medineli başka birine çarpıyordu.

**Kalıp otuz dokuzuncu partide düzeltildi.** Alt dizi testi
`abd/ebu/um` ile başlayan bileşik adlarda boşta kalıyordu — düğüm
`عبد الله بن كعب` için ilk üç belirteç `عبد الله بن` oluyor ve bu
**oğlunun** başlığında da geçiyor. Doğru test **önek**, yani başlık
düğüm adıyla BAŞLAMALI, ve ilk belirteç `abd/ebu/um/ubeyd/ibn` ise
üç değil **dört** belirteç bakılmalı. 620 çözümün tamamı bu testten
geçirildi, 39 bayraktan üçü gerçek hataydı — `abdullahkab` (oğluna),
`ibnvehb` (dede adı üzerinden İbn Muhayrîz'e), `ed19` (tercemesi
yok). Üçünün de notu eski kısa kayıttı, yani yanlış kart yazılmamıştı.

**Bölüm başlığı gizli başlık üretiyor — kapandı.** «من اسمه ذكوان»
gibi bölüm başlıkları madde işaretini alıyor, hemen ardındaki gerçek
terceme başlığı işaretsiz kalıyor. `tt_lib.basliksa` artık ikinci
argümanla bir üst satıra bakıyor: bölüm başlığının **hemen ardı** her
zaman o bölümün ilk tercemesidir. Bu 62 tercemeyi açtı, `ebusalih`
(Ebû Sâlih es-Semmân) ve Simâk b. Harb bunlardan ikisi.

İlk sürümde ardıl satırın rumuzla başlaması da şart koşulmuştu; 67
bölüm ardından 6'sı rumuzsuz çıktı ve beşi gerçek başlıktı — Suheyb
b. Sinân er-Rûmî bunlardan biri. Şart kaldırıldı, ardıl satır boş
değilse başlık sayılıyor. Kaldırmadan önce iki koşum diffleşti:
**tek kazanç, sıfır kayıp, sıfır kayma.**

`baslik-elle.json` **`null`** değeri kabul ediyor, anlamı "bu düğümün
tercemesi yok, çözme". Bir düğüm çözülemiyorsa ve Tehzîb'de gerçekten
yoksa oraya `null` yaz, betiği değiştirme.

**ELLE alt dizi arıyor, önek değil.** `baslik-elle.json`'daki değer
başlığın **içinde** geçiyorsa tutuyor ve **indis sırasında ilk**
tutan başlık seçiliyor. Ad uzun bir nesebin içinde ata olarak geçen
biriyse erken bir başlığa çakılır — Hüseyin b. Ali yazınca Ca'fer
es-Sâdık'ın başlığı geliyordu. Çare, adı ayırt eden kuyruğu da
yazmak («... الهاشمي، أبو عبد الله المدني، سبط»). Yazdıktan sonra her
ELLE kaydının **beklenen satıra** düştüğü programla denetlendi.

## Kapanan iş

`ibnrecagudani` on dördüncü partide "malzeme çıkmıyor" diye atlanmıştı,
doğru değilmiş. `KES` gerçekten talebe listesindeki "روى له" ifadesinde
kesiyor ama cerh-ta'dîl bölümü o listenin hemen ardından geliyor ve
2600 karakterlik pencerenin içinde kalıyor. On beşinci partide yazıldı,
okuyucuda düzeltme gerekmedi. **Uzun talebe listesi olan tercemelerde
çıktının sonuna kadar bak, ilk ekrana bakıp vazgeçme.**

## Gece zamanlı görev

`gece-bilgi-kartlari` adında bir zamanlı görev var, her gece 00.00,
01.00, 02.00, 03.00, 04.00 ve 05.00'te bir parti yazıyor. Görev dosyası
`~/.claude/scheduled-tasks/gece-bilgi-kartlari/SKILL.md`. **Yalnızca
Claude uygulaması açıkken çalışır**, kapalıysa açılışta birikmişi
çalıştırır. Push etmiyor.

Sabah çalışma ağacında beklenmedik commit görürsen paniğe kapılma,
gece partileridir. `git log --oneline` ile bak.

## Gözden geçirilecek iki kayıt

- `selimhayyan` sitede **Süleym b. Hayyân** yazıyor, Tehzîb adı
  `بالفتح` diye zaptediyor, yani **Selîm**.
- `muhammedabdulalasanani` haritada **Yemen** sütununda, ama Tehzîb
  onu `الصنعاني القيسي **البصري**` diye veriyor ve Basra'da öldüğünü
  söylüyor. Nesâî ile Ebû Hâtim de Basralı muamelesi yapıyor. Yemen'de
  altı düğüm var, biri gitse sütun ayakta kalır.

- `abdulmelikhumeyd` sitede **عبد الملك بن حميد بن أبي عيينة**,
  Basra, rumuz «م ت», hocası Abdürrezzâk. Tehzîb'de bu adda kimse
  yok. En yakın isim **İbn Ebî Ğaniyye** (`عبد الملك بن حميد بن أبي
  غنية`) ama o Kûfeli, tercemesi **rumuzsuz** ve talebeleri arasında
  Abdürrezzâk geçmiyor — aynı kişi değil. Şâmile bağlantısı bu yüzden
  verilmedi, düğümün Arapça adı gözden geçirilmeli.

Mustafâ'ya sorulmadan üçüne de dokunulmadı.

## İstenmedi, not düşüldü

- `/podcastler` mobilde yağmur klibi taşıyor — klip 211px, `pb-16`
  ise 64px.
- `araclar/dugumler.json` ara dosyaları duruyor.

## Şâmile bağlantısı nasıl üretiliyor

`silsileVeri.js`'in sonundaki `SAMILE` tablosu **elle yazılmıyor**,
çözümden üretiliyor. Eşleme şu: `tehzibut.txt` içindeki sayfa
işaretleri («تهذيب التهذيب ... (ص: N)», `tt_lib.SAYFA`) sırayla
sayıldığında **sayaç doğrudan Şâmile'nin `page_id`'si oluyor**, kayma
yok. Var olan 657 kaydın 656'sı bu formülle bire bir tuttu, kalan bir
kayıt çözümden düşmüştü.

```python
say = 0
for i, l in enumerate(ham):
    if SAYFA.match(HAREKE.sub("", l).strip()):
        say += 1
    sayfa[i] = say          # dugumun satiri -> page_id
```

Bağlantı `https://shamela.ws/book/1293/<page_id>`. Terceme çözümü
değiştiğinde tablo **bütünüyle** yeniden yazılıyor, tek tek
düzeltilmiyor. Düğüm sırası `NODES` sırasıdır.

## Kırk ikinci parti — 35 kart birden

Kartlar o güne kadar altışar yazılıyordu. Kırk ikinci partide havuzun
tamamı **iki iş akışıyla** (Workflow) yazıldı, 70 + 70 ajan.

**Birinci akış — yaz, sonra çürüt.** Her râvi için bir ajan tercemeyi
`terceme-oku.py` ile okuyup kartı yazdı, ardından **ikinci bir ajan
aynı tercemeyi kendi okuyup** karttaki her tekil iddiayı metinde tek
tek aradı. Denetim ajanı 35 kartın 21'inde düzeltme yaptı ve
yakaladıkları rastgele değil, **tekrar eden kalıplar**.

- «قيل» ile gelen bilginin kesin gibi yazılması.
- "tek çekince", "tevsîkte ittifak var" gibi tercemede karşılığı
  olmayan editoryal genellemeler.
- Bir sözün yanlış kişiye atfı. Varkā'da «لا يساوي شيئا» Yahyâ
  el-Kattân'a yazılmıştı, diyalogda sözü söyleyen Muâz b. Muâz.
- Sahnenin tersine dönmesi. Duhaym Bağdat'a geldiğinde Ahmed b.
  Hanbel, İbn Maîn ve Halef **onun önünde** oturuyor, kart tersini
  yazmıştı.
- Nesebin bir kuşak kayması. Cu‘ayd'da Evs/Uveys ihtilâfı babanın
  değil **dedenin** adı üzerinde.
- Dayanak uydurma. «روى عنه: الجماعة» diye bir satır gösterilmişti,
  tercemede öyle bir satır yok, iddia yalnız başlıktaki rumuza
  dayanıyor.

**İkinci akış — kısalt.** İlk turun kartları ortalama 865 karakterdi,
sitenin ortancası ise 324. Kart 130 piksellik kutuda görünüyor, o
boyda okunmuyor. Kısaltma **yalnızca silerek** yapıldı, yeni tek bir
olgu eklenmedi. Ardından iki denetim.

- Ajan denetimi (13 kartta düzeltme). Buradaki risk uydurma değil,
  **silmenin yarattığı çarpıtma**. Haccâc'ta Ebû Hâtim'in «صدوق»u
  düşüp yalnız «ثقة» kalınca ta'dîl derecesi yükselmişti. Duhaym'da
  İbn Hibbân'ın tevsîki silinip geriye kalan cümle "ise" ile
  bağlanınca İbn Hibbân itiraz eden imam gibi okunuyordu. Ebû
  Zabyân'da ihtilâfın yalnız olumsuz tarafı kalmıştı.
- Makine denetimi (0 hata). Kısa karttaki **her Arapça alıntı, her
  rakam ve her Arapça kelime** uzun kartta aynen bulunmalı. Betik
  `scratchpad/kisa-denetle.mjs`.

Sonuç 445 karakter ortalama, en uzun 557 — sitenin %75'lik dilimi
540, yani kadro içinde. Uzun hâller `scratchpad/uzun/` altında
duruyordu, oturum bitince gider.

**Kalıp işe yarıyor, tekrarı düşünülebilir.** Kritik olan iki şey —
denetleyen ajanın tercemeyi **kendi okuması** (yazanın dayanak
listesine güvenmemesi) ve kısaltmanın **makineyle** de denetlenmesi.

## Eski sürümde takılan ziyaretçi

Mustafâ 11 Eylül'de "siteye daha önce girenler aynı tarayıcıdan bu
değişiklikleri neden göremiyorlar" diye sordu. **Sunucu tarafı temiz**,
ölçüldü.

| | |
|---|---|
| HTML | `Cache-Control: public, max-age=0, must-revalidate` |
| ETag | 304 doğru dönüyor |
| `_next/static` | `max-age=31536000, immutable` — ama dosya adları **içerikten** türüyor (A/B denendi, içerik değişince ad değişti) |
| hizmet çalışanı | depoda hiç olmadı (`git log --diff-filter=A`) |
| Vercel Skew Protection | kapalı, `Set-Cookie` yok |

Yani sorun başlıklarda değil. Tarayıcı sayfayı **ağa hiç sormadan**
geri getiriyor — arka planda duran sekme, geri düğmesi, telefonda
uygulamanın yeniden açılması. O anda istek çıkmıyor, dolayısıyla
hiçbir önbellek ayarı devreye giremiyor. `no-store` bile çözmez.

Çözüm `app/SurumBekcisi.tsx`. Sayfa açılırken `/surum.txt`i okuyup
kendi sürümünü öğreniyor, geri dönüldüğünde (`pageshow` + görünürlük)
bir daha bakıyor ve damga değişmişse kendini yeniliyor. Damgayı
`araclar/surum-yaz.cjs` her yapımda üretiyor (`prebuild`), dosya
gitignore'da.

Sınandı — damga değişince `navigation.type` **reload** oluyor,
değişmeyince iki `pageshow` üst üste gelse bile sayfa ayakta kalıyor.

## Derece süzgeci ve nokta büyüklüğü (2026-09-13)

### Süzgeç — az bağlantılı râvi haritada çizilmiyor

Mustafâ 11 Eylül'de istemişti, 13 Eylül'de kuruldu: **derecesi üçün
altında olan râvi haritada hiç görünmüyor, yalnızca Râvi Ara ile
bulunuyor.** Sabit `silsileAgiKur.jsx`'te `GIZLI_ESIK`, sıfıra çekmek
süzgeci tümden kapatır.

**`tamBoy`dan farklı, ikisini karıştırma.** O UZAKLIĞA bağlı bir
kademelendirme — eşiğin altında kalan nokta kaybolmuyor, 2 piksellik
minik bir noktaya iniyor ve yaklaşınca geri büyüyor. Bu ise MUTLAK:
hangi ölçekte olursa olsun çizilmiyor, kenarları da çizilmiyor (yoksa
boşlukta biten çizgiler kalırdı).

Dört istisna `tamBoy`dakiyle aynı ve aynı gerekçeyle — seçili râvi,
vurgulu (seçiliye bağlı) düğümler, arama eşleşmeleri, ve sahâbe
(`KADEME <= 1`). İlk üçü olmasa arama kutusu kendi sonucunu
gösteremezdi.

**Ne kadarını gizliyor.**

| | gizlenen | toplam |
|---|---|---|
| ana harita | 99 | 821 (%12) |
| Takrîb çatalı | 371 | 1.614 (%23) |

Ana haritada gizlenen 99 düğümün **91'i tabaka 6**, yani Kütüb-i
Sitte'nin kitap râvileri — ağın zaten dış halkası. Geriye kalan 8'i
2-5. tabakadan. Gizlenenlerin 15'inin yazılmış bilgi kartı var, onlar
aramadan erişilebiliyor.

### Nokta büyüklüğü — tavan kaldırıldı

Eski biçim `min(52 + sqrt(d) * 46, 344)` idi ve **41 bağlantıdan
sonra sonuç hep 344 çıkıyordu**. Ölçüldü: ana haritada 821 düğümün
**99'u (%12)**, çatalda 1.614'ün **148'i (%9)** tam tavanda — derecesi
41 olan râvi ile 226 olan aynı büyüklükte çiziliyordu. Mustafâ'nın
"daha dakik" dediği kayıp tam olarak buydu.

Yeni biçim katsayıyı sabit vermek yerine **en büyük dereceye göre
normalize ediyor**, yani en çok bağı olan tavana oturuyor ve hiçbiri
doymuyor. Ağ büyüdükçe ölçek kendiliğinden ayarlanıyor. Karekök
korundu — gözün okuduğu şey yarıçap değil ALAN, `r ~ sqrt(d)` demek
`alan ~ d` demek.

`EKRAN_R_ARTIS` 5,5'ten 10'a çıkarıldı. Sebep: normalizasyon doymayı
kaldırırken ORTA değerleri de aşağı çekiyordu (medyan yarıçap 230 →
127) ve artış eski değerinde kalsaydı noktaların çoğu **ekranda
küçülürdü** — yıllardır tekrarlanan "noktalar hâlâ küçük" şikâyeti
geri gelirdi. Artış büyütülünce medyan nokta eskisiyle aynı kalıyor,
kazanılan ayrım tavana ekleniyor.

| derece | eski ekran px | yeni ekran px |
|---|---|---|
| 0 | 3,4 | 3,95 |
| 15 (medyan) | ~5,9 | 6,14 |
| 47 (%90) | 7,5 (tavan) | 7,82 |
| 182 (en yüksek) | 7,5 (tavan) | **11,56** |
| Hz. Peygamber | 8,1 | **12,60** |

Tavandaki düğüm 99'dan **2'ye** indi. Hiçbir nokta küçülmedi.

## Düğüm salınımı

İsim noktaları dar bir çerçevede oynuyor. Üç kez ayar istendi, üçünün
de gerekçesi kodda yazılı ama özeti şu.

- **`prefers-reduced-motion`e bağlanmayacak.** Mustafâ'nın Windows'unda
  "animasyon efektleri" kapalı, yani o sorgu sürekli açık. Bağlarsan
  bende döner, onda hiç dönmez.
- **Telefonda da açık.** Bir süre `!dar` ile kapalıydı, kaldırıldı.
- **Seçim varken duruyor** (`salinimAnim = !secim`). Hem Mustafâ istedi
  hem de sürekliliğin telefondaki pil maliyetini bu karşılıyor — parmak
  bir noktaya değdiği anda döngü duruyor.

Salınım ile kenar akışı birbirinin tersi. Salınım seçim YOKKEN, akış
ancak bir râvi SEÇİLİYKEN döner. Kenar seçilince ikisi de yok, döngü
tamamen duruyor.

### Kasmanın sebebi ve sabit katman

Salınım açılınca site kasmaya başladı. Ölçüm (masaüstü, 1766×930
tuval) sebebi tek satırda gösterdi.

| iş | süre |
|---|---|
| 8220 kenarı **ayrı ayrı** `stroke` ile çizmek | 13,5 ms |
| 8509 kenarı **toplu yolla** çizmek (uygulamanın yaptığı) | **1,1 ms** |
| 820 noktayı daire olarak çizmek | 0,2 ms |
| 110 etiket (kontur + iki yazı) | 0,7 ms |
| hazır tuvali yapıştırmak | ~0 ms |

**İLK ÖLÇÜM YANLIŞ ŞEYİ ÖLÇTÜ** (13 Eylül'de düzeltildi). Kenar başına
`beginPath`/`stroke` çağırıp 13,5 ms buldum, oysa `topluCiz` bütün
kenarları **iki** yola topluyor ve gerçek maliyet 1,1 ms. Yani karenin
ağırlığı tuvalin boyamasında değil, çizimden önceki **JS döngüsünde** —
8509 kenarın her biri için `kenarKubik`, kırpma, `tamBoy` ve
`vurus.kenar` doldurma. Katman önbelleği o döngüyü de atladığı için
çözüm yine doğru, ama sebep başkaymış.

`katmanRef` sahnenin kımıldamayan yarısını — zemin, sütunlar, yıl
çizgileri, kenarların tamamı — ayrı bir tuvalde tutuyor. Hareketli
karede o tuval yapıştırılıyor, üstüne yalnız noktalar ve etiketler
çiziliyor. Kare 15 ms'ten 1 ms'in altına iniyor.

**Geçerlilik `ciz`in kimliğine bağlı**, elle bağımlılık listesi yok —
katmanı etkileyen ne varsa zaten `ciz`in bağımlılık dizisinde ve
`useEffect(() => { katmanRef.current = null }, [ciz])` onu atıyor.
Elle liste tutmak, listeye bir şey eklemeyi unuttuğunda ekranda
**donmuş bir kare** olarak geri döner.

`vurus.kenar`, `canliKenarlar` ve `seciliKenar` da katmanla birlikte
saklanıyor. Üçü de aynı döngüde üretiliyor ve üçü de kenarlara ait,
yani nokta salınırken değişmiyorlar — saklanmasaydı önbellekli
karelerde kenara tıklanamazdı.

Katman seçiliyken de çalışıyor. Canlı kenarlar (akan kesik çizgi)
zaten katmanın dışında, her karede ayrı çiziliyor; yani bir râvi
seçiliyken de yığın kenarlar önbellekten geliyor.

## Latin yazı tipi

Sitenin Latin gövde yazısı **Georgia**. Önce Arial'dı, sonra Geist
oldu, 2026-09-11'de Mustafâ "haritadaki latin yazı tipini tüm siteye
uygula" dedi ve haritanın yığınına geçti.

Tek kaynak `globals.css`'te `--yazi-latin`. Üç yerde okunuyor — gövde,
Tailwind'in `--font-sans` jetonu (yani `font-sans` sınıfı) ve
Arapça'da dil düğmesini Naskh'tan geri alan kural.

**İki kopyası var, ikisi de zorunlu.**

- `silsileAgiKur.jsx` içindeki `ctx.font`. Tuval bir CSS değişkeni
  okuyamıyor, yığın düz metin olarak duruyor.
- `public/resule-kavusmak-game*.html`. Oyun `/resule-kavusmak`'a
  `<iframe>` ile gömülü, ayrı bir document, CSS değişkenleri o sınırı
  geçmiyor. Aynı dosyadaki `::selection` rengi de aynı sebeple elle
  duruyor.

Geist **Sans** kaldırıldı, artık indirilmiyor. Geist **Mono** duruyor
(ses oynatıcının süre sayacı), Naskh duruyor (Arapça), Garamond ile
Amiri duruyor (dil antrenmanı kartları).

`/dil-antrenmani`'nin "bitiş" perdesinde eski bir karar var — "yazı
tipi sitenin kendisi, Garamond değil" (2026-09-01). Kural değişmedi
ama sonucu değişti, o ekran artık serif. Mustafâ'nın o günkü itirazı
Garamond'aydı, serif'e değil.

## Transın adları onarıldı (2026-09-13)

Çataldaki 793 düğümün **97'sinin etiketi bozuktu** ve bunun 3'ü hiçbir
işaret taşımıyordu — sözlük kayması ürettiği ad yanlış ama temiz
görünüyor (`İsmâîl b. b.`). Yani "«...» sayısı" tek başına kalite ölçüsü
değil; tarama `b. b.`, `b.` ile bitme, `b.` ile başlama ve tek ögeli ad
kalıplarını da aramalı.

Sekiz ayrı kusur çıktı, hepsi `araclar/iskelet-dugume.mjs` içinde
yorumlu. Sırayla en çok kayıp verenler:

- **`عبيد الله` çiftlenmiyordu** (20 düğüm). Bileşik ad çiftlemesi
  yalnızca `عبد` biliyordu, `عبيد` ikiye bölünüp `الله` çevrilemiyordu.
- **Ad, `عبد`in tam ortasından kesiliyordu** (5 düğüm). İkinci öge
  (`الرحيم` gibi) haritanın sözvarlığında yoksa beyaz liste orada
  kesiyor ve geriye `محمد بن عبد` kalıyordu.
- **`المعروف بـ` ada yapışıyordu** (9 düğüm). "Filanca diye bilinen"
  Takrîb'in açıklaması; haritanın sözvarlığında da geçtiği için beyaz
  listeden geçiyordu. Aynı kümeye `مولى` (âzatlısı), `صاحب`, `أخو`,
  `نزيل` de kondu — kesilmezse etiketin kuyruğuna `mevlâ Rebîa b.
  el-Hâris` gibi **ikinci bir ad** takılıyor.
- **Künye tanıma yanlıştı.** `أحمد بن أبي بكر بن الحارث...` adında
  nesebin içindeki `أبي` künye sanılıyor, gövde `أحمد بن`de bitiyor ve
  nesep kırpması hiç çalışmıyordu. Künye, önünde `بن` OLMAYAN olandır.
  En uzun etiket **111 harf**ti.
- **Bilinmeyen nisbe atılınca önündeki bağlaç boşta kalıyordu** —
  `Muhammed b. İsmâîl b.`.
- **Baştaki nisbe kalıbı nisbe değil, isimdir.** `الماضي بن محمد` adında
  el-Mâdî kişinin kendi adı; kalıba (ال...ي) uyduğu için atılıyor ve
  etiket **babasının adıyla** başlıyordu.

**Sözlükte üç gerçek kayma vardı.** `ceviri-sozluk.mjs` haritanın kendi
düğümlerinden hizalayarak öğreniyor, ama yalnızca Türkçesi
KISALTILMAMIŞ kayıtlardan. `محمد بن الصباح الدولابي البزاز` →
`Muhammed b. es-Sabbâh ed-Dûlâbî` kaydında البزاز düştüğü için o
belirteç hiç öğrenilemedi. Kaymalar — `عبد القدوس` bir nisbeyle,
`مسلمة` doğrudan «b.» ile, `أخو` parantezli bir künyeyle hizalanmıştı.
Çözüm elle yazılmış bir ek: `araclar/ceviri-elle.json`, 57 kayıt,
öğrenilenin üzerine yazılıyor. Her biri haritanın KENDİ yazımından
okundu, haritada hiç geçmeyen birkaçı İSAM çevriyazısıyla.

**Bir düzeltme geri teptiği için ölçüldü.** `عبيد`i koşulsuz çiftlemek
`عبيد الخزاعي`، `عبيد بن`، hattâ Takrîb'in zapt şerhi `عبيد بالتصغير`
gibi şeyleri ada yapıştırdı — **Ubeyd çoğu yerde başlı başına bir ad**
(Ubeyd b. Huneyn, Yûnus b. Ubeyd). Nisbe kalıbını elemek de yetmiyor,
`عبد الغني`، `عبد الباقي`، `عبد الهادي` o kalıba uyuyor. Ölçüt ikinci
ögenin **esmâ-i hüsnâ**dan olması oldu.

Sonuç: çeviri kapsamı 841 → 953, bozuk etiket **97 → 0**, gerileme
**0** (eski/yeni çıktı kayıt numarasıyla birebir karşılaştırıldı),
en uzun etiket 111 → 70 harf.

**Kimlikler değiştirilmedi.** 3.365 kenar onlara bağlı; kimlik ad
sülüğünden türediği için yeniden üretim onları kaydırırdı. Onarım
yerinde yapıldı, köprü kayıt numarası (`no`) — eski çıktı dosyaları onu
taşıyor, çatal taşımıyor. Kenar açıklamaları ve `E()` kaynak dizgeleri
de eski adı taşıdığı için birlikte güncellendi (172 yorum, 473 kaynak);
bunlar kendi sınırlayıcılarıyla aranıyor, çıplak arama kısa bir adı
(`Ahmed b. Hasan`) başka bir adın içinde bulup bozardı.

**Etiket uzunluğu hâlâ haritanın kendi yazımından uzun** — ortanca 31'e
karşı 22, 45 harfi aşan 163/953'e karşı 1/821. Kalanı meşru ad
malzemesi (nesep + künye + iki nisbe); haritanın elle yazılmış kısa
biçimleri (`İbn Ebî Zi'b`) editöryal karar, üretilemez.

## Takrîb kütüğünün tamamı çözüldü (2026-09-13)

Adlar onarılınca kalan 191 kayda bakıldı ve tek bir sebep çıktı — **beyaz
liste `بن`in ardını da süzüyordu.** Babanın adı haritada geçmiyorsa
`أحمد ابن بكار ابن أبي ميمونة` kaydından yalnızca `أحمد` kalıyor, tek ögeli
ad da "çok kısa" diye eleniyordu. 183 kayıt, kütüğün %16'sı.

Kırpılmış adlar üstelik **çakışıyordu**: 10 küme, 23 kayıt, biri beş
kişilik (`Muhammed b. Abdullah` x5). Yani o kayıtlar eksik değil,
ayırt edilemez hâldeydi.

Üç yapısal kural kondu, hepsi Takrîb'in kendi yapısından çıkıyor.

1. **Kaydın ilk belirteci ad**, Takrîb her kaydı kişinin adıyla açar.
2. **Her bağlacın ardı ad** — `بن`, `أبو`, `بنت` hepsi tamlayan ister.
   Önce yalnız `بن` için açılmıştı, künyeden sonrası dışarıda kalıyordu
   (`أحمد ابن أبي طيبة عيسى` → `أحمد`).
3. **Zapt kümesi atlanabilir.** Takrîb hareke tarifini ismin hemen
   ardına sokuyor (`أصبغ آخره معجمة ابن زيد`) ve nesep ondan sonra
   geliyor. Şerhin sözvarlığı açık uçlu olduğu için şerh **tanınmıyor**;
   yalnızca ad tek ögeliyken ve on belirteçlik pencerede bir `بن` ya da
   künye varsa oraya atlanıyor.

### Takrîb'in zapt şerhi bir hareke otoritesi

Ortaya çıkan 260 baba adının çoğu haritada hiç geçmiyor ve okunuşları
tahmine kalıyordu. Ama Takrîb harekeyi **kendisi tarif ediyor** —
`جواس بفتح الجيم وتشديد الواو` doğrudan Cevvâs okutuyor. Şüphelenilen her
ad oradan soruldu ve **üç okuyuş düzeldi**: `بري` Berrî (Berî değil),
`ندبة` Nedebe (Nedbe değil), `تدرس` Tedrüs. Bundan sonra da şüpheli bir
adı önce oraya sormak gerekir.

`عم` ("amcası") ve `أخت` ("kız kardeşinin oğlu") de durak listesine
girdi — `مولى` ve `صاحب` gibi, ad değil akrabalık işareti.

Sonuç: çevrilen **841 → 1144**, yani kütüğün tamamı. Elde kalan 0,
çakışan etiket 0. Çataldaki 793 düğümün adı yerinde onarıldı (284 satır,
339 yorum, 1017 kenar kaynağı), boşa düşen kenar 0.

### Mükerrer süzgecinde ata tuzağı

Yeni çözülen 190 kayıt süzgeçten geçirilince iki **gerçek râvî** yanlışlıkla
mükerrer sayıldı — `Dâvûd b. Reşîd` ve `Füleyh b. Süleymân`. Sıralı altdizi,
kişinin **nesebindeki atayı** kişinin kendisi sanıyor: `داود رشيد`,
`سليمان بن داود بن رشيد`in altdizisi çıkıyor. Ölüm yılı kapısı bunu
geçiriyor, çünkü baba ile oğul çoğu zaman on beş yıl içinde.

Ölçüt **isim çapası** oldu — kısa adın ismi, uzun adın da ismi olmalı,
yani eşleşme sıfırıncı ögeden başlamalı. Ata tanımı gereği orada değildir.

**İstisna künye ile başlayan ad.** `أبو داود الطيالسي` ve `أبو سعيد المقبري`de
çapalanacak isim yok; çapa aransa kendi tam adlarıyla (`سليمان بن داود`,
`كيسان`) ayrı düşerlerdi. Bu arada aracın maliyet dengesi yön veriyor —
yanlış birleştirme ucuz (o kaydı eklemeyiz), yanlış **ayırma** pahalı
(haritada iki nokta, bölünmüş kenarlar). O yüzden künye tarafında
birleştirmeye meylediliyor.

Ana haritaya karşı mükerrer 152'den 149'a indi; serbest kalan üçü
Hasan-ı Basrî'nin **kardeşi**, Zühlî'nin **oğlu** ve Füleyh. Çatala karşı
190 adayın 6'sı mükerrer, **184'ü gerçekten yeni** — henüz eklenmediler,
kenar taraması yapılmadı.

`mukerrer-ayikla.mjs`, `iskelet-dugume.mjs` ve `ceviri-sozluk.mjs` artık
`DUGUM_TABLO` değişkenini okuyor; çatalı ölçerken ana haritaya değil ona
bakmaları gerekiyor, yoksa transa girmiş biri ikinci kez "yeni" sayılır.
Python tarafındaki `kenar-tara`/`baslik-coz` aynı değişkeni zaten okuyordu.

## 182 düğüm daha çatala (2026-09-14)

Çözülen 184 yeni kayıt için Tehzîb taraması koşturuldu. Terceme çözümü
1798 düğümün 1434'ünü açtı, tarama **1371 aday kenar** verdi; 1098'i yeni
düğümlere dokunuyor, 273'ü eskiler arasında. **184'ün 160'ı bağlandı
(%87)** — Kûfe transının ilk turundaki 47/130 ile karşılaştır, fark
yeni gelenlerin KENDİ tercemelerinin çözülmüş olması.

Çatal artık **975 trans düğümü ve 13.187 kenar**. Süzgeci geçen trans
düğümü 512'den 682'ye çıktı, yerleşimi eksik düğüm 0, sütun sayısı
değişmedi, boşa düşen kenar 0.

### Mükerrer denetiminin kör noktası ve çözümü

İki aday gerçekte mevcut düğümdü — `محمد بن خازم` = **Ebû Muâviye
ed-Darîr**, `عبد الله بن طاوس` = **Abdullah b. Tâvûs**. Birincisini ad
karşılaştırması **ilkesel olarak** yakalayamaz: harita onu künye+lakapla
(`أبو معاوية الضرير`), Takrîb isim+nesepte anıyor ve **ortak tek belirteç
yok**. Altdizi de, isim çapası da, nadirlik şartı da bu boşluğu görmez.

Yıl+belde denendi, işe yaramadı — 441 çift veriyor, Şâfiî ile Eşheb'i
bile eşliyor.

Çözen ölçüt: **iki düğüm aynı Tehzîb tercemesine çözülüyorsa aynı
kişidir.** `baslik-coz.py` zaten her düğüm için bir terceme satırı
veriyor; aynı satıra düşenleri saymak yetiyor. Kesin ölçüt değil, çünkü
çözücünün kendi hatası da aynı satıra düşürebiliyor — **vefat yılı da
tutmalı**. Yıl tutmayan çiftler (Buhârî ö.256 ?= ö.264 gibi) çözücü
hatası, mükerrer değil.

Düşen iki adayın kenarları atılmadı, mevcut kimliğe **taşındı**.

### Bu denetimin ortaya çıkardığı eski mükerrerler

Aynı test çatalda **zaten duran** 24 mükerrer çift gösterdi, hepsi aynı
kalıptan — harita künye/lakapla, trans isim+nesepte:

`İsmâîl İbn Uleyye` = `İsmâîl b. İbrâhim b. Miksem`, `İbn Kâsım el-Mısrî`
= `Abdirrahman b. Kâsım b. Hâlid`, `Abdân` = `Abdullah b. Osmân b.
Cebele`, `el-Fellâs` = `Amr b. Ali b. Bahr`, `İbn Ebi'd-Dünyâ` =
`Abdullah b. Muhammed b. Ubeyd`, `Ebû Kudâme es-Serahsî` = `Ubeydullah b.
Saîd b. Yahyâ`, `Ebû'n-Nadr Hâşim` = `Hâşim b. Kâsım b. Müslim`, `ez-Zühlî`
= `Muhammed b. Yahyâ b. Abdullah` ve benzeri.

**İkisi ANA HARİTADA** ve transtan önce de oradaydı — `Ali b. el-Mübârek
el-Hinâî` = `Ali b. el-Mübârek`, `Hüseyin b. Zekvân el-Muallim` =
`Hüseyin el-Muallim`. Bunlar henüz birleştirilmedi.

## Mükerrer düğümler birleştirildi (2026-09-14)

Aynı-terceme denetimi 24 mükerrer çift gösterdi. **Yirmi biri tek tek
elle denetlendi, hepsi gerçekti** — el-Hâd Üsâme'nin lakabı, İbn Uleyye
İsmâîl b. İbrâhim b. Miksem, el-Fellâs Amr b. Ali b. Bahr, İbn Ebi'd-Dünyâ
Abdullah b. Muhammed b. Ubeyd, Abdân Abdullah b. Osmân b. Cebele. Yanlış
pozitif yok.

Ölçüt **aynı Tehzîb terceme satırı + aynı vefat yılı**. Yıl şartı gerekli,
çözücünün kendi hatası da iki düğümü aynı satıra düşürebiliyor (Buhârî
ö.256 ile ö.264 eşleniyordu).

**Ortak belirteç şartı KOYULAMAZ** — tam da kör noktayı geri getirir.
`ابن علية` ile `إسماعيل بن إبراهيم بن مقسم` arasında ortak tek belirteç
yok; zaten bu yüzden ad karşılaştırması bunları hiç yakalayamamıştı.
Altdizi şartı denendi, 21 çiftin yalnız 1'ini bıraktı.

**Aynı Şâmile sayfası ölçüt değil.** Denendi ve 49 küme verdi, çoğu ayrı
kişi — bir Tehzîb sayfası birden çok terceme taşıyor, alfabetik komşular
aynı sayfaya düşüyor (Enes b. Mâlik ile Enes b. İyâz, Zeyd b. Erkam ile
Zeyd b. Eslem).

Çatalda 21 trans düğümü ana haritadaki karşılığına taşındı — 975 → 954
düğüm, 13.187 → 12.961 kenar. Dereceler bir miktar **düştü** ve bu doğru:
mükerrer yüzünden iki kez sayılan aynı ilişki tekleşti (ez-Zühlî 110 → 108).

### Ana haritadaki üç çift

Üçü de yayındaki veride duruyordu, transtan önce:

| kalan | düşen | derece |
|---|---|---|
| `alimubarek` | `alimubarekhinai` | 12 |
| `hamzaibnomer` | `hamzaibnomerogul` | 7 |
| `huseynzekvan` | `huseynmuallim` | 21 |

Kalan kimlik kenarı çok olan; ad ve not daha dolu olan taraftan alındı.
Ali ile Hamza'da düşen tarafın notu zaten yalnızca "Rumûz ع.", kayıp yok.
**Hüseyin'de iki taraf da yazılı içerik taşıyordu ve ikisi birleştirildi**,
hiçbiri atılmadı.

Ana harita 821 → 818 düğüm, 8509 → 8482 kenar. Komşu kümesi tek tek
doğrulandı: birleşme öncesi iki düğümün komşularının birleşimi, sonrasında
kalan düğümün komşu kümesine **birebir** eşit; graf genelinde kayıp 0.

### Bu boru hattında sonraki tur için

`catal-yaz.mjs` "iki ucu da mevcut düğüm" olan kenarı atıyor. Birleştirme
bir kenarın iki ucunu da ana haritaya taşıyabildiği için bu sessiz bir
kayıp riski — ölçüldü, bu turda taşınanların hepsi zaten ana haritada
vardı (kayıp 0), ama sonraki turda ayrıca toplanmalı.

## Transa Şâmile bağlantısı (2026-09-14)

Trans düğümlerinin 954'ünden **703'üne** Şâmile bağlantısı çıkarıldı; artık
kartlarında «Şâmile'de görüntüle» düğmesi var. Kalan 251'in tercemesi
çözülmediği için düğme çıkmıyor — mevcut davranışın aynısı.

Yöntem `silsileVeri.js`teki SAMILE yorumunda zaten yazılıydı: düğümün
Tehzîb satırında ve öncesinde kaç sayfa işareti (`جـ N(ص: M)`) geçtiğini
saymak. Üretmeden önce **haritanın kendi 704 değerine karşı doğrulandı,
sapma 0.** Bu adım atlanamaz — yanlış sayfa numarası ekranda görünmez,
düğme yine çıkar ve yanlış tercemeye götürür.

### İki tuzak, ikisi de ölçülerek bulundu

- **Satır ayrımı Python gibi olmalı.** `satir` alanları `baslik-coz.py`den
  geliyor ve Python metin kipinde **evrensel satır sonu** kullanıyor —
  tek başına `
` de satır sonu sayılıyor. Node'un `split("
")`i onları
  saymadığı için dosya 104.417 yerine 101.630 satır görünüyordu ve bütün
  indeksler kayıyordu (Ali için 1499 yerine 1548). Sapma **sabit değildi**,
  konumla büyüyordu; kaydırma sanıp aramak yanlış yöne götürürdü.
- İşaretin kendi satırı da o sayfaya ait, yani sayaç önce artmalı.

Şâmile'den iki uçtan teyit edildi — sayfa 504 `حيوة بن شريح بن يزيد
الحضرمي` tercemesini, sayfa 2523 `يوسف بن بهلول التميمي` tercemesini
taşıyor. **Bir Tehzîb sayfası birden çok terceme taşıdığı için tek bir
ibare aramak yanıltıyor**; ilk denemede sayfa 504'te Mısırlı Hayve'nin
tercemesi bulunup bağlantı yanlış sanılmıştı.

`catal-yaz.mjs` artık dördüncü bir argüman alıyor (`samile.json`) ve
çatalda `SAMILE`yi ana modülün üzerine yazıyor — `export *` ile gelen
tablo yalnız ana haritayı kapsıyor, override edilmezse yeni noktalarda
düğme hiç çıkmıyor.

## Üç mükerrer daha, bir ad düzeltmesi (2026-09-14)

Aynı-terceme ölçütü yalnızca **tercemesi çözülmüş** düğümleri kapsıyor;
çözülemeyen 251 trans düğümü o denetimden hiç geçmemişti. Onlara ayrı bir
ölçütle bakıldı — aynı vefat yılı + **kısa adın bütün belirteçlerinin**
uzun adda geçmesi + en az birinin nadir olması.

Gevşek sürümü (iki ortak belirteç) 76 çift verdi ve çoğu ayrı kişiydi;
"kısa adın tamamı" şartı dörde indirdi. Üçü gerçek çıktı:

| trans | ana harita |
|---|---|
| Ahmed b. Mansûr b. Seyyâr Ebû Bekir | Ahmed b. Mansûr er-Ramâdî |
| Abdullah b. Abdirrahman b. Fazl Ebû Muhammed | Dârimî |
| Muhammed b. es-Sabbâh el-Bezzâz ed-Dûlâbî | Muhammed b. es-Sabbâh ed-Dûlâbî |

Dördüncüsü elle elendi ve **yeni bir kusur açığa çıkardı**: `عبيد الله بن
عبد الله بن عمر أبو بكر شقيق سالم` kaydında Sâlim ile aralarındaki bağ
Takrîb'in «شقيق» (öz kardeşi) sözüydü, ad değil — ikisi kardeş, ayrı kişi.

**`شقيق` koşulsuz durak olamaz**, çünkü aynı zamanda bir addır:
`الحسن بن عمر بن شقيق الجرمي` kaydında babanın adı. Ayrım yerinde —
bağlaçtan sonra geliyorsa ad, gelmiyorsa ilişki. `SARTLI_DURAK` bunu
yapıyor. İlk sürümü kaydın **ilk** belirtecinde de çalışıyordu ve
`شقيق بن ثور بن عفير` kaydını boşalttı; orası da yapısal olarak ad.

### Kaybolan bir kenar ölçüldü ve YANLIŞ çıktı

Birleşme `Dârimî — Ziyâd b. Sa‘d` kenarını iki ucuyla ana haritaya taşıdı,
`catal-yaz.mjs` de attı. Eklenmedi, çünkü **kronolojisi imkânsız** —
Dârimî ö. 255, Ziyâd b. Sa‘d'ın komşuları 124-187 arası.

Sebebi şu: `kenar-tara.py`nin kronoloji kapısı yıla bakıyor ve
`Ziyâd b. Sa‘d`ın **vefat yılı kayıtlı değil**, o yüzden kapı hiç
ateşlenmiyor. Haritada yılsız 216 düğüm var; bu kapı onların hepsinde
sessizce devre dışı. Komşu yılının ortancasıyla bir tahmin denendi ama
güvenilir değil — hocanın komşuları çoğunlukla talebeleri olduğu için
tahmin geç tarafa kayıyor. Gerçek çözüm yılsız düğümlere yıl yazmak.

Çatal 954 → 951 düğüm, 12.961 → 12.949 kenar. Takrîb kütüğü 1144/1144
temiz kaldı.

## Çekirdek + yıl: 89 terceme daha (2026-09-14)

`baslik-coz.py` adayı **tam altdiziyle** arıyor ve Takrîb adın arasına
Tehzîb başlığında olmayan bir nisbe sokunca eşleşme kırılıyor —
`أحمد بن منصور بن سيار البغدادي الرمادي` ile
`أحمد بن منصور بن سيار بن معارك الرمادي`. Terceme orada duruyor ama kayıt
"aday yok"a düşüyordu. Ölçüldü: çözülemeyen 248 düğümün **209'unda**
ilk üç belirteci birebir tutan bir başlık vardı.

Eklenen yedek kural: nisbeler atılıp **nesep çekirdeği** eşleştiriliyor,
ama kabul **yalnızca vefat yılı tutarsa** veriliyor — tek aday bile olsa
yıl sorulur. Çekirdek tek başına güvenilmez, adın uzun bir nesebin
ortasında ata olarak geçmesine açık (Abdullah b. Ömer'in el-Ömerî'ye
bağlanması tam bu tuzaktandı).

**89 düğüm** böyle çözüldü, 555 aday kenar çıktı, 89'un **82'si** bağ
kazandı. Şâmile bağı 703 → 788. Ana haritada kural **hiç ateşlenmedi** —
oradaki çözülmemişlerin çoğu yılsız, kapı yılı şart koşuyor.

Yeni çözümler 5 mükerrer daha açığa çıkardı (İbnü'l-Mübârek, Duhaym,
Ebû Ahmed ez-Zübeyrî, Muâz b. Muâz el-Anberî, el-Müsnedî).

### Künye ile yanlış eşleşme — sahâbe seviyesinde vurdu

Birleşme sonrası iki kenar ana haritaya düştü ve eklenmeden önce
kontrol edilince **yanlış kişiye ait** oldukları görüldü. Kaydın metni
`معاذ بن المثنى` — o **Muâz b. el-Müsennâ** (ö. 228), düğüm ise
`معاذ بن معاذ بن نصر أبو المثنى`. Tarayıcının `bas` kuralı ilk ögeyi
(معاذ) tutturuyor, ikinci öge (المثنى) ise düğümün **nesebinde değil
künyesinde**.

Aynı kalıp tarandığında sahâbe seviyesinde iki vaka daha çıktı —
`عدي بن حاتم` (Adî b. Hâtim et-Tâî) Adî b. el-Fazl **Ebû Hâtim**'e,
`عمار بن ياسر` (Ammâr b. Yâsir) Ammâr b. Nasr **Ebû Yâsir**'e
bağlanmıştı. Toplam 10 kenar çatalda, ana haritada yok.

Kapı `kenar-tara.py`ye eklendi. **Ölçüt kaydın `بن` ile babalık iddia
etmesi** — bu daraltma şart: ilk sürüm yalnızca "ikinci öge künyede"
diye bakıyordu ve `دراج أبي السمح` gibi aynı kişinin künyeyle anılmasını
da eliyordu. İstisna, düğümün kendi adında `بن <öge>` geçmesi (dedeye
nisbet): `أحمد بن أبي رجاء الهروي` meşru, elenmiyor.

**Vefat yılı kenar yönünü kanıtlamaz.** Yönü yılla denetlemek denendi,
ana haritada 81 "ters" kenar gösterdi — ama çoğu meşru, akran râvîler
birbirinden rivayet ediyor (Süfyân es-Sevrî ö. 161, Mâlik'ten ö. 179
rivayet etmiş). Bu testle toplu düzeltme yapılamaz.

Çatal 951 → 946 düğüm, 13.373 kenar, süzgeci geçen 704.

## Lakap/künye eşleşmeleri denetlendi (2026-09-14)

Ana haritanın 289 kenarında en riskli grup olan `lakap` ve `ibn`
kayıtları tek tek gözden geçirilmişti; **çataldakiler geçirilmemişti.**
Şimdi geçirildi.

Çataldaki 4.891 kenarın dağılımı — `tam` 2.069, `bas` 2.032, `kunye` 327,
`ibn` 246, `lakap` 213. Tekrarları saymak yanıltıcı, doğru birim **ayrı
metin**: 109 ayrı lakap/künye/ibn ifadesi var ve **107'si tek bir düğüme
bağlanıyor**. A‘meş, İbn Ebî Zi’b, Humeydî, Derâverdî, Hureybî, Şa‘bî,
İbn Ebî'z-Zinâd, İbn Ebî Arûbe — hepsi tartışmasız.

İkisi birden çok kişiye bağlanmış ve ikisi de incelendi:

- **`ابن صاعد`** — 40'ın üzerinde kenarda Yahyâ b. Muhammed b. Sâid'e
  (ö. 318) gidiyor ve hepsi doğru; ö. 244-274 arası nesilden rivayet
  etmiş, kronoloji tam. Tek istisna Ebû's-Sükeyn'in (ö. 201) tercemesinde
  Halef b. Halîfe b. Sâid'e (ö. 181) bağlanan kayıt — o tarihte meşhur
  İbn Sâid henüz doğmamış, kapı onu eleyip dedesinin adı Sâid olan
  başkasına düşmüş. Çıkarıldı.
- **`الترمذي`** — el-Cârûd b. Muâz es-Sülemî **et-Tirmizî**'nin de
  nisbesi, yani metin gerçekten iki kişiye uyuyor. İbn Ulâse'nin (ö. 168)
  tercemesi Tehzîb'den okundu: talebe listesi Harâmî b. Hafs, Hafs b.
  Gıyâs, İbnü'l-Mübârek, Vekî‘ diye gidiyor ve **içinde Tirmizî yok**.
  O kenar çıkarıldı. `el-Cârûd → Tirmizî` kenarı ise doğru, duruyor.

Sonuç: 2 kenar çıkarıldı, çatal 13.371.

**Ders:** bu sınıfın denetim birimi kenar sayısı değil **ayrı metin
sayısı**. 459 kayıt korkutucu görünüyor ama 109 ifadeye iniyor ve
elle gözden geçirilebilir bir büyüklük.

## Muhakkikin tashihi parantezdeydi (2026-09-14)

Züheyr b. Harb çatalda ayrı bir düğüm olarak duruyordu, oysa haritada
`zuheyrharb` olarak zaten var. **Hiçbir denetim yakalayamamıştı** —
tercemesi çözülmediği için aynı-satır testi koşamıyor, adı da haritadakine
uymuyordu: çatalda `أبو خثيمة`, haritada `أبو خيثمة`. Aynı kelime, iki
harfi yer değişmiş; sıralı karşılaştırma bunu göremez.

Harf sırasından bağımsız anahtar (kelimenin harfleri sıralanmış) onu
buldu. Aynı testte **başka hiçbir eşleşme çıkmadı**, yani bu yazım
kayması nadir.

Sebebi ilgi çekici. Takrîb'in kendisi düzeltmiş — metin
`أبو خثيمة [خيثمة] النسائي` diyor, doğru yazım **köşeli parantezin
içinde**. `adBolgesi` parantezleri şerh sayıp atıyordu ve tashihi de
birlikte atıyordu.

Parantezler tek işe yaramıyor: kimi ekleme (`وخمسين [ومائتين]` vefat
yılı), kimi seçenek (`د [ت]` rumûz), kimi şerh. Tashihi ayıran ölçüt,
parantez içindekinin **önceki kelimenin yakın bir varyantı** olması —
aynı harfler başka sırada ya da tek harf farkı. Metinde 109 böyle çift
var; öteki parantezler eskisi gibi atılıyor.

Yedi kayıt düzeldi — `بشير→بشر`, `الحسين→الحسن`, `البزاز→البزار`,
`أبو يزيد→أبو زيد`, `خثيمة→خيثمة`, `الحدائي→الحداني`, Hemmâm b.
Münebbih'in künyesi `أبو عتبة→أبو عقبة`. Kütük 1144/1144 temiz kaldı,
gerileme yok.

**Ana harita etkilenmiyor** — orada `خثيمة` yazımı hiç yok, hepsi doğru;
bu kayma yalnızca Takrîb metninde.

Çatal 945 düğüm, 13.359 kenar.

## İlk iki bilgi kartı, ve babanın kenarları (2026-09-14)

Trans düğümlerinin **hiçbirinde** not yoktu. En çok bağlantılı ikisine
kart yazıldı — her biri kişinin **kendi Tehzîb tercemesi okunarak**,
ezberden tek cümle yok.

- **Abdirrahman b. Ebî'z-Zinâd** (ö. 174). Tercemenin kendi gerilimi
  şurada: hakkındaki ihtilaf sıkalık-zayıflık değil, **nerede** rivayet
  ettiği. İbnü'l-Medînî «Medine'de rivayet ettiği sahih, Bağdat'ta
  rivayet ettiğini Bağdatlılar bozdu» der; Amr b. Ali ve Sâcî aynı
  ayrımı tekrarlar.
- **Fazl b. Mûsâ es-Sînânî** (ö. 192). Tercemesi baştan sona
  İbnü'l-Mübârek'le ölçülerek yürüyor — Ebû Nuaym «ondan daha sebt»,
  Vekî‘ «hangisinden işitmişim aldırmayız», İbn Şâhîn «İbnü'l-Mübârek'in
  ad vermeden 'bana sika haber verdi' dediği odur» der.

`catal-yaz.mjs` artık yedinci alanı (not) yazıyor.

### Kart yazmak bir veri hatasını açığa çıkardı

Kartı tarayıcıda okurken hoca listesi gözüme takıldı — Saîd b. el-Müseyyeb
(ö. 94), Urve (ö. 94), eş-Şa‘bî (ö. 104), Zeynelâbidîn (ö. 94). Oysa bu
râvî **100'de doğmuş**. Bunlar babası **Ebû'z-Zinâd**'ın hocaları.

Sebep düğümün kendi adında. Takrîb babanın asıl adını açıklama olarak
ekliyor — `عبد الرحمن بن أبي الزناد **عبد الله بن ذكوان** المدني` — ve ad
mıknatısa dönüyor. Tarayıcının `kunye` kuralı `أبو الزناد` metnini de
bu düğüme bağlıyordu. Sayıldı: 61 kenarın **25'i babanınmış** (hocaları
Saîd b. el-Müseyyeb, Urve, el-A‘rec, Zeynelâbidîn; talebeleri Mâlik,
Sevrî, Leys, Süfyân b. Uyeyne).

Kapı eklendi — **künye `بن`den sonra geliyorsa babanındır, kişinin
değil.** Aynı ölçüt `iskelet-dugume.mjs`te ad çıkarırken zaten
kullanılıyordu, tarayıcıda yoktu.

Aynı kalıp tarandığında üç kayıt daha çıktı. İkisi kronolojik olarak
imkânsızdı ve çıkarıldı (`أبي طلحة الأنصاري` sahâbî Ebû Talha yerine
torununa, `أبي رجاء الهروي` dedesi yerine toruna). Üçüncüsü
(`أبي جحيفة` → Avn b. Ebî Cuhayfe) kronolojik olarak sağlam, duruyor.

İbn Ebî'z-Zinâd 61 → **36 kenar**, kronolojik olarak imkânsız komşu **0**,
komşu vefat yılları 122-245. Çatal 13.332 kenar.

**Ders:** kart yazmak veriyi denetlemenin en iyi yolu. Hiçbir otomatik
ölçüt bu 25 kenarı bulmamıştı; terceme okunup kartla karşılaştırılınca
ilk bakışta görüldü.

## İki kart daha — Ebû Hanîfe ve İbn Lehîa (2026-09-14)

- **Ebû Hanîfe** (ö. 150, Kûfe, 31 bağlantı). Tehzîb'deki tercemesi hadis
  tenkidi değil neredeyse baştan sona **fakīhlik** üzerine. İbn Maîn dört
  ayrı nakilde olumlu; Yahyâ b. Saîd el-Kattân «Allah'a yalan
  söylemeyelim, görüşünden güzelini işitmedik ve sözlerinin çoğunu aldık»
  demiş. Süfyân'a «ne diye kızıyorsun?» diye sorulunca usûlü nakledilir —
  Kitap, Sünnet, sahâbe sözü; iş İbrâhim, Şa‘bî, İbn Sîrîn ve Atâ'ya
  gelince «onlar ictihad eden bir topluluktur, ben de onlar gibi ictihad
  ederim». Rumûzu yalnız `ت س`.
- **İbn Lehîa** (ö. 174, Mısır, 27 bağlantı). Tercemenin tamamı tek bir
  soru etrafında döner — **nüsha**. Ahmed b. Sâlih teşhisi koyar: önce
  kitaplarını çıkarıp imlâ etmiş, sonra bir daha kitap çıkarmamış ve
  kendisinden işitmek isteyen, ondan yazmış birinden istinsah edip getirip
  ona okur olmuş. «Sahih bir nüshaya denk gelenin hadisi sahihtir,
  zabtedilmemiş nüshadan yazana çok halel girer.»

### Kenar yönü hakkındaki notun kaynaktan teyidi

İbn Lehîa'nın kartındaki komşuları denetlerken Şu‘be (ö. 160) ve Evzâî
(ö. 157) **talebesi** olarak duruyordu — o ise 174'te vefat etmiş.
Tehzîb bunu kendisi söylüyor: `وعنه ... والثوري، وشعبة، والأوزاعي،
وعمرو بن الحارث **وماتوا قبله**` — "ondan rivayet ettiler ve ondan önce
öldüler".

Yani daha önce ölçüp not ettiğimiz şey kaynakta açıkça yazılı: **vefat
yılı kenar yönünü kanıtlamaz.** Yılla toplu düzeltme yapmaya kalkışmak
bu dört kenarı da bozardı.

İkisinin komşuları da tercemedeki listelerle karşılaştırıldı, kronolojik
olarak şüpheli hiçbir bağ yok.

## Takrîb'in TAMAMI açıldı — 945 → 3.310 düğüm (2026-09-14)

Mustafâ sordu: "Takrîb'de sadece 1.144 kişi mi var?" Cevap **hayır** ve
bu, o güne kadarki "Takrîb bitti" ifadesini düzeltiyor. Takrîb'de
**8.261 terceme** var; araç ancak 1.144'ünü çıkarabiliyordu, yani %14.

Sebep aracın kendi şartıydı — harita noktayı **belde × vefat yılı** ile
koyuyor, ikisinden biri yoksa kayıt eleniyordu. Ölçüldü: 2.591 kayıtta
vefat ifadesi, 2.488'inde şehir nisbesi yok. Nisbesizlerin nisbeleri
neredeyse tamamen **kabile** nisbesi (el-Ensârî 206, es-Sekafî 78,
el-Esedî 66, el-Kuraşî 66), yani Takrîb tek başına şehri söylemiyor.

**Mustafâ'nın kararı:** yılsız râvîler haritaya girsin, belde Tehzîb'den
ya da komşudan tamamlansın, hiçbiri olmazsa ve bağı üçün altındaysa
çizilmesin ama Râvi Ara ile bulunabilsin (bu sonuncusu `GIZLI_ESIK`
olarak zaten kuruluydu).

Yılsız düğüm haritada **dürüst duruyor** — `tarihYaz` kartta «ö. ?/?»
yazıyor, uydurma yıl yok; `TAHMIN` yalnızca dikey yeri tabakanın tipik
bandının ortasına koyuyor ve o sayı hiçbir yerde gösterilmiyor.

`takrib-iskelet.py`ye **gevşek kip** eklendi (`--gevsek`). Sonuç:

| | önce | sonra |
|---|---|---|
| çıkarılabilen kayıt | 1.144 | **7.095** |
| tam çevrilen ad | 1.144 | 5.622 |
| beldesi olan | 1.144 | 3.760 |
| mükerrer elendikten sonra | 945 | **3.310** |
| kenar | 13.332 | **18.307** |
| Şâmile bağı | 788 | **2.288** |

Elenen 1.084 kayıtta ne tabaka ne yıl var, yani dikey dayanak sıfır;
82'si çapraz atıf kaydı.

Yeni düğümlerin **%72'si bağlandı** (2.388/3.310), 1.608'i süzgeci
geçiyor. Çizilen düğüm 719'dan 2.331'e çıkıyor. Yerleşimi eksik düğüm 0,
sütun sayısı değişmedi, boşa düşen ve çift kenar 0.

Dokuz kayıt tek ögeli adla kaldı (`Dînâr`, `Rebâh`, `Zeyd`) ve
çıkarıldı — o adlar kimliği taşımıyor.

### Kalanlar

- **1.473 kayıt** çevrilemeyen belirteç taşıyor. Arkasında **871 ayrı
  ad** var (Sa‘lebe, Anbese, el-Cehm, Eymen, Nebhân...) ve uzun kuyruk —
  en sık 200'ü geçişlerin ancak %48'ini kapsıyor. Elle yazılabilir ama
  tek seferde büyük bir iş.
- **1.862 kayıtta belde yok.** Sıradaki adım Tehzîb'den, sonra komşudan
  okumak.
- Harita bu yoğunlukta **kalabalık**. Etiketler bazı yakınlıklarda üst
  üste biniyor; `GIZLI_ESIK`i yükseltmek gerekebilir.

## Trans ana haritaya taşındı (2026-09-14)

Mustafâ'nın kararıyla çataldaki 3.310 düğüm, 9.825 kenar ve 2.288 Şâmile
bağı `silsileVeri.js`e yazıldı.

| | önce | sonra |
|---|---|---|
| ana harita düğüm | 818 | **4.128** |
| ana harita kenar | 8.482 | **18.307** |
| Şâmile bağı | 704 | **2.992** |
| çizilen düğüm | 719 | 2.339 |

Boşa düşen kenar 0, çift kenar 0, yerleşimi eksik düğüm 0, sütun sayısı
13'te kaldı. Çatal boşaltıldı ama **dosya duruyor** — `/ag-sinamasi` ona
bağlı ve sonraki transın yeri orası.

**Taşıma betiğinde bir tuzak:** `silsileVeri.js` CRLF satır sonu
kullanıyor, dolayısıyla `"
];"` gibi düz dizge çengelleri hiçbir şey
bulmuyor. Düzenli ifadeye (`/
?
\];/`) çevrildi.

## Beldesi olmayanlar Tehzîb'den ve komşudan tamamlandı (2026-09-14)

Takrîb 2.488 kayıtta şehir söylemiyor. Temiz adlılardan 1.862'si beldesiz
kalmıştı. İki yol denendi, ikisi de Mustafâ'nın önerisi.

**Tehzîb'den.** 1.007'sinin tercemesi çözüldü, **452'sinde belde
bulundu.** Ölçüt Takrîb'dekiyle aynı — önce «نزيل <şehir>» (yerleştiği
yer, çünkü harita "nereli" değil "nerede rivayet etti" soruyor), sonra
şehir nisbesi. Yalnız **başlık satırı** okunuyor, gövde değil; gövdede
hoca ve talebelerin nisbeleri geçiyor ve onlar kişinin kendi beldesi
değil.

**Komşudan.** Kalanlar için kenar taraması koşturulup hoca-talebe
beldelerine bakıldı. Ölçüt **açık çoğunluk** — en çok çıkan belde
komşunun yarısından fazlası ve ikincisinden en az iki fazla olmalı.
**334 düğüm** böyle yerleşti; 177'sinde çoğunluk zayıf kaldı ve
bırakıldı, çünkü yanlış sütuna koymak koymamaktan kötü.

Toplam **786/1.862**, mükerrer elendikten sonra **698 yeni düğüm**
(382 Tehzîb, 316 komşu), 2.204 kenar, 587 Şâmile bağı.

| | önce | sonra |
|---|---|---|
| ana harita düğüm | 4.128 | **4.826** |
| ana harita kenar | 18.307 | **20.511** |
| Şâmile bağı | 2.992 | **3.579** |
| çizilen düğüm | 2.339 | 2.686 |

### Kalan 1.076

899'unun **hiç komşusu yok** (kenar taraması bağ bulamadı), 177'sinde
çoğunluk zayıf. Bunlar haritaya **eklenmedi**: beldesiz düğümün sütunu
yok, sütunu olmayanın `POS`u yok, `POS`u olmayan ne çizilebiliyor ne de
arama kamerasının gidebileceği bir yere sahip. Râvi Ara ile bulunabilmesi
için önce bir yerleşim kararı gerekiyor — keyfî bir sütuna koymak veri
olarak yanlış olurdu.

## Tuval yayvanlaştı, dikeye çevrildi (2026-09-14)

Trans girince tuval **korkunç yayvanlaştı** — genişlik 520.920'den
3.645.720'ye çıktı, yani yüksekliğin altı katı. `/ag-sinamasi`'nda bu
görünmemişti çünkü oradaki ekran görüntüleri yakınlaştırılmış hâldeydi,
tuvalin bütün oranı hiç bakılmamıştı.

Sebep **şerit sayısı**. Aynı yıl aralığına altı kat düğüm düşünce
`ASGARI_DY` onları yana itiyor ve Basra 98 şeride çıkıyordu.

Çözüm dosyanın kendi notunda yazılıydı — mutlak sayılar değil, **nokta
yarıçapına oranları** önemli. `H` büyütülüp `ASGARI_DY` **sabit**
tutulunca aynı yıl aralığı daha çok birime denk geliyor ve şerit sayısı
düşüyor.

| H | W/H | azamî şerit |
|---|---|---|
| 600.000 (önceki) | 6,08 | 98 |
| 1.800.000 | 0,81 | 39 |
| **2.400.000 (seçilen)** | **0,45** | **29** |
| 4.800.000 | 0,15 | 19 |
| 9.600.000 | 0,054 | 14 |

16 kat da denendi ve şerit sayısını birleştirme öncesine (14)
düşürüyordu, ama tuval o kadar incelince **ekranın ortasına sıkışıyor**
ve belde başlıkları kırpılıyordu. Dört kat dengeli — harita genişliğinin
iki katı yükseklikte, sütun başlıkları okunuyor.

Noktalar kaybolmuyor: `rEkranOf` ekran yarıçapına taban koyuyor
(`EN_AZ_EKRAN_R`), ölçekten bağımsız.

## 871 ad çevrildi, 1.529 düğüm daha (2026-09-14)

Adında çevrilemeyen belirteç taşıyan 1.473 kaydın arkasındaki **871 ayrı
ad** elle yazıldı. Şüpheli okuyuşlar Takrîb'in kendi zapt şerhinden
doğrulandı — 871'in **606'sında** şerh var.

871'in hepsi ad değildi. Takrîb'in **sayım sözleri** listeye karışmıştı —
`أحدهما` (ikisinden biri), `والثاني`, `الثالث`, `الرابع`, `والآخر`.
Bunlar «تمييز» kayıtlarında aynı adı taşıyan kişileri sıralarken geçiyor.
Sözlüğe değil `DURAK` listesine gittiler; yoksa etiket "... ve ikincisi"
diye okunacaktı. Yanlarında `امرأة` (kadın), `فلان` (filanca), `شيخ`,
`ولد`, `ابنة` de var.

| | önce | sonra |
|---|---|---|
| tam çevrilen kayıt | 5.622 | **6.918** |
| kirli kalan | 1.473 | **177** |
| beldesi olan | 3.760 | 4.432 |
| sözlük kaydı | 315 | **1.171** |

Mükerrer elenince **1.529 yeni düğüm**, 4.099 kenar, 1.007 Şâmile bağı.
950'si bağlandı.

| | önce | sonra |
|---|---|---|
| ana harita düğüm | 4.826 | **6.355** |
| ana harita kenar | 20.511 | **24.610** |
| Şâmile bağı | 3.579 | **4.586** |
| çizilen düğüm | 2.686 | 3.406 |

### H yeniden ayarlandı

Düğüm 6.355'e çıkınca oran 0,45'ten 0,57'ye kaydı (azamî şerit 29 → 37),
yani tuval yeniden yayvanlaşmaya başladı. `H` 2.400.000'den 3.200.000'e
çıkarıldı, oran 0,37, azamî şerit 32.

**Kural:** düğüm sayısı arttıkça `H` da artmalı. Yoksa `ASGARI_DY`
düğümleri yana itiyor ve tuval yayvanlaşıyor.

## Daha derin arka plan

`silsile-agi-notlar.md` — belde denetimi, Bağdat sütunu kararı, başlık
çözümü, gizli başlıklar, oğul kalıbı hepsi orada uzun uzun yazılı.
Araç kullanımı için `araclar/terceme/OKUBENI.md`.
