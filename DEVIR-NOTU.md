# Devir notu — rivayet haritası, bilgi kartları

Bu dosya sohbet değiştirmek için yazıldı. Yeni sohbette **ilk iş bunu
okumak**, sonra "Havuzu tazele" bölümündeki iki komutu çalıştırmak.

## Nerede kaldık

| | |
|---|---|
| düğüm | 821 |
| kenar | 8220 |
| bilgi kartı | **524** |
| tercemesi çözülmüş düğüm | 622 / 821 |
| kart yazılabilir havuz | **163** |

Son commit `c1939f8` (Bilgi kartlari on dorduncu parti). Çalışma ağacı
temiz, `main`'e push edilmiş durumda. Son doğrulanan build
`✓ Compiled successfully`.

**Açık iş tek** — kart yazmaya devam. Kullanıcının son talimatı
"kartlara devam et". Başka bekleyen istek yok.

## Havuzu tazele

Kart havuzu ve terceme çözümü **scratchpad'de değil**, komutla
üretiliyor. `$S` yeni oturumun kendi scratchpad'i olsun.

```bash
PYTHONIOENCODING=utf-8 python araclar/terceme/baslik-coz.py "$S/cozum.json" "$S/kalan.json"
node araclar/terceme/kart-havuzu.cjs "$S/cozum.json" "$S/havuz.json"
```

Birincisi `COZULEN: 622 / 821` yazmalı, ikincisi
`yazilabilir havuz: 163`. Sayılar tutmuyorsa bir şey bozulmuş demektir,
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

Commit mesajı biçimi `Bilgi kartlari on besinci parti: alti kart`.

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

## Bir düğüm atlandı

`ibnrecagudani` — Abdullah b. Recâ el-Gudânî. Cerh-ta'dîl bölümü
gövdenin ilerisinde kalıyor, `terceme-oku.py`'nin `KES` regex'i talebe
listesindeki "روى له" ifadesinde kesiyor. Kart yazacak malzeme
çıkmıyor. Ya okuyucunun kesme noktası düzeltilecek ya da bu terceme
elle okunacak.

## İstenmedi, not düşüldü

- `/podcastler` mobilde yağmur klibi taşıyor — klip 211px, `pb-16`
  ise 64px.
- `araclar/dugumler.json` ara dosyaları duruyor.

## Daha derin arka plan

`silsile-agi-notlar.md` — belde denetimi, Bağdat sütunu kararı, başlık
çözümü, gizli başlıklar, oğul kalıbı hepsi orada uzun uzun yazılı.
Araç kullanımı için `araclar/terceme/OKUBENI.md`.
