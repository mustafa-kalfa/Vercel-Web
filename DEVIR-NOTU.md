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
| 8220 kenarı bézier olarak çizmek | **13,5 ms** |
| 820 noktayı daire olarak çizmek | 0,2 ms |
| 110 etiket (kontur + iki yazı) | 0,7 ms |
| hazır tuvali yapıştırmak | ~0 ms |

Karenin bütün maliyeti kenarlarda ve **kenarlar oynamıyor**. 13,5 ms
masaüstünde 60 Hz bütçesinin tamamı, telefonda birkaç katı.

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

## Daha derin arka plan

`silsile-agi-notlar.md` — belde denetimi, Bağdat sütunu kararı, başlık
çözümü, gizli başlıklar, oğul kalıbı hepsi orada uzun uzun yazılı.
Araç kullanımı için `araclar/terceme/OKUBENI.md`.
