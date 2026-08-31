# Silsile ağı — devir notları

Son güncelleme 2026-08-30. Önceki not dosyasının yerini alır.

## Nerede ne var

| Adres | Dosya | Durum |
|---|---|---|
| `/ravi-iliski-aglari` | `app/ravi-iliski-aglari/page.tsx` | Tanıtım metni, haritaya buton. Sitemap'te, indekse açık |
| `/ravi-iliski-aglari/harita` | `app/SilsileAgi.jsx` | **Yayındaki sürüm**, canvas. Sayfa adı "Rivayet Haritası" |
| `/ag-sinamasi` | `app/SilsileAgi.jsx` | Deneme adresi, `noindex`. Şu an yayındakiyle birebir aynı, sıradaki deneme için boş |
| — | `app/silsileVeri.js` | 657 râvi, 1647 bağ, çeviriler, konum hesabı |

İki çizim bileşeni de aynı veri modülünden besleniyor. Terceme işlendikçe her ikisinde birden görünür. Ana sayfa kartı ve footer `/ravi-iliski-aglari`'ne bakıyor.

`next.config.ts`'te eskiden `/ravi-iliski-aglari → /mustafa-calisiyor` yönlendirmesi vardı, kaldırıldı.

## Veri durumu

- **657 râvi, 1647 bağ.**
- **156 boşluk kaldı** — kendi tercemesi hiç açılmamış, yani talebe tarafı boş râviler.
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

**Başlık ve sayfa araması Tehzîb'de güvenilmez.** Dizin `ابن`'i `بن`'e indirgiyor, `ابن علية` araması 3466 sonuç veriyor. Uzun adlarda ise tokenleştirici kuyruğu tek bir token yapıp sıfır sonuç döndürüyor. **TOC ile gezinmek tek güvenilir yol.**

### Eşleştiricinin iki süzgeci

Her ikisi de gerçek yanlış eşleşmelerden doğdu, teorik değil.

- **Kayıt sınırı** — `حميد بن عبد الرحمن بن عوف` kaydı Abdurrahman b. Avf düğümüyle eşleşmemeli, oradaki isim dedenin adı. İsim kaydın başında olmalı.
- **Kronoloji penceresi** — `علي بن الحسين` hem Zeynelâbidîn'in (ö. 94) hem Ali b. el-Huseyin b. Eşkâb'ın (3. yüzyıl) adının başı. Ters yönde 60 yıl pay var (talebe hocadan önce ölebilir, Mizzî `ومات قبله` der), düz yönde 100 yıl.

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

Yerleşim `YAY = 2` ile iki kat seyrek, açılış yakınlığı `ACILIS_YAKINLIK` sabitinde. İkisi birbirine bağlı — seyreltme açılış çarpanıyla telafi edilmezse hiçbir şey değişmez, çünkü ağ yine aynı piksellere sığar.

## Açık işler

- **156 terceme.** Ölçülen hız râvi başına ~30 bin token, toplam kabaca 4-5 milyon.
- **KAVIS eğri tablosu bayat.** Yerleşim sabitleri (`SERIT_W`, `ASGARI_DY`, `H`, `YIL_MAX`) değiştiğinde yeniden üretilmesi gerekiyordu, yalnızca orantılı ölçeklendi. Çakışma verisi artık geçerli değil.
- **Bağdat sütunu yok.** 3. yüzyılın büyük merkezi. `ms28` (İbn Sâid) bu yüzden öldüğü yere, Kûfe'ye kondu.
- **İngilizce isimlerde mekanik çevrim boşlukları** — "Eslem mevla Omer", "Fatima bint Resulillah" gibi. `ING_SOZLUK` elle genişletilebilir.
- **Belde ataması en zayıf halka.** Nisbe ile belde alanı çelişenler taranmalı.

## Kurallar

- `git add -A` **kullanma.** Bir kez kullanıcının işlenmemiş işini commit'e süpürdü. Yalnızca dokunduğun dosyaları evrele.
- Bilgi kartındaki metinler kopyalanabilir olmalı (`select-text`), tuval `select-none`.
- Yeni sayfa eklerken `app/sitemap.ts`'teki `YOLLAR` listesine de ekle. `noindex` taşıyan sayfa sitemap'e girmemeli.
