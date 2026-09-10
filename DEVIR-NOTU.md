# Devir notu — rivayet haritası, bilgi kartları

Bu dosya sohbet değiştirmek için yazıldı. Yeni sohbette **ilk iş bunu
okumak**, sonra "Havuzu tazele" bölümündeki iki komutu çalıştırmak.

## Nerede kaldık

| | |
|---|---|
| düğüm | 821 |
| kenar | 8220 |
| bilgi kartı | **627** |
| tercemesi çözülmüş düğüm | 621 / 821 |
| kart yazılabilir havuz | **59** |

Son commit `4a1dc73` (Bilgi kartlari otuz birinci parti). Çalışma ağacı
temiz. **Push edilmedi** — `main`'e push canlıya deploy demek, o yüzden
Mustafâ söyleyince atılıyor. Son doğrulanan build `✓ Compiled
successfully`.

**Açık iş tek** — kart yazmaya devam. Kullanıcının son talimatı
"kartlara devam et". Başka bekleyen istek yok.

## Havuzu tazele

Kart havuzu ve terceme çözümü **scratchpad'de değil**, komutla
üretiliyor. `$S` yeni oturumun kendi scratchpad'i olsun.

```bash
PYTHONIOENCODING=utf-8 python araclar/terceme/baslik-coz.py "$S/cozum.json" "$S/kalan.json"
node araclar/terceme/kart-havuzu.cjs "$S/cozum.json" "$S/havuz.json"
```

Birincisi `COZULEN: 621 / 821` yazmalı, ikincisi
`yazilabilir havuz: 59`. Sayılar tutmuyorsa bir şey bozulmuş demektir,
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

Commit mesajı biçimi `Bilgi kartlari otuz ikinci parti: alti kart`.

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

İkincisi için `baslik-elle.json` artık **`null`** değeri kabul ediyor,
anlamı "bu düğümün tercemesi yok, çözme". Aynı durum yine çıkarsa
oraya `null` yaz, betiği değiştirme.

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

Mustafâ'ya sorulmadan ikisine de dokunulmadı.

## İstenmedi, not düşüldü

- `/podcastler` mobilde yağmur klibi taşıyor — klip 211px, `pb-16`
  ise 64px.
- `araclar/dugumler.json` ara dosyaları duruyor.

## Daha derin arka plan

`silsile-agi-notlar.md` — belde denetimi, Bağdat sütunu kararı, başlık
çözümü, gizli başlıklar, oğul kalıbı hepsi orada uzun uzun yazılı.
Araç kullanımı için `araclar/terceme/OKUBENI.md`.
