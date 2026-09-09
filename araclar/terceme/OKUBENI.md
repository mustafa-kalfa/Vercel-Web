# Takrîb ve Tehzîb'in yerel metninden vefat yılı çıkarma

Bu klasör, Şâmile'den `.htm` olarak dışarı aktarılmış iki terceme
kitabını düz metne çevirip `silsileVeri.js`'teki tarihsiz râvilerle
eşleştiriyor. **MCP'ye hiç uğramıyor**, hepsi yerel dosya üzerinde.

Kazanç erişim değil, **toplu iş yapabilmek**. MCP tek seferde tek soru
soruyor, isim başına iki çağrı; 200 isim ~400 gidiş-geliş demek. Yerel
metinle bütün liste tek betikle taranıyor ve asıl kıymetli iş —
gözle okuyup karar vermek — geriye kalıyor.

## Kaynak dosyalar nerede

Şâmile'nin kendi dışa aktarması (`تصدير`) ile üretildi, depoya
**girmiyorlar**:

| Kitap | Şâmile no | Yol |
|---|---|---|
| Takrîbü't-Tehzîb | 8609 | `C:\Users\Mustafa Kalfa\Desktop\تصدير من الشاملة\تقريب التهذيب.htm` |
| Tehzîbü'l-Kemâl | 3722 | `C:\Users\Mustafa Kalfa\Desktop\تصدير من الشاملة\تهذيب الكمال في أسماء الرجال\` (35 cilt, `001.htm` … `035.htm`) |

Şâmile kurulumu `C:\shamela4`. Kitapların metni orada **Lucene
dizininde** duruyor (`database\store\page`, 14 GB), kitap `.db`
dosyaları yalnızca sayfa numarası tutuyor — yani SQLite'tan okunamıyor,
`.htm` dışa aktarma bu yüzden gerekli.

## Kullanım

```bash
python araclar/terceme/metne-cevir.py takrib "C:/Users/Mustafa Kalfa/Desktop/تصدير من الشاملة/تقريب التهذيب.htm"
python araclar/terceme/metne-cevir.py tehzib "C:/Users/Mustafa Kalfa/Desktop/تصدير من الشاملة/تهذيب الكمال في أسماء الرجال"
python araclar/terceme/kontrol.py      # isabeti ölç (yazmaz)
python araclar/terceme/tara.py         # tarihsizleri tara (yazmaz)
```

Üretilen metinler `metin/` altına düşüyor ve `.gitignore`'da — Takrîb
2 MB, Tehzîb 45 MB.

Hiçbir betik `silsileVeri.js`'e **yazmıyor**. Yazma işi ayrı:
`node araclar/yil-guncelle.cjs <id>=<yıl> ...` (DİA korumalı).

## Önce ölç, sonra yaz

`kontrol.py` boru hattını **yılı zaten bilinen** düğümler üzerinde
çalıştırıp isabeti veriyor. Ayarı her değiştirdiğinde önce bunu koştur.

2026-09-07 itibarıyla: 535 kontrol isminden **46'sı kabul, 45'i doğru
(%97,8)**. Tek "hata" da kaynak ihtilâfı — Takrîb Nu'mân b. Beşîr'i 65,
DİA 64 veriyor.

Kapsama kasten düşük. Boru hattı şunları **reddediyor**: birden fazla
aday, ihtilaflı ifade ("57, denildi 58"), yaklaşık kayıt ("yüzden
sonra"), yüzler basamağı belirsiz kalanlar.

## Yol boyunca çıkan tuzaklar

Hepsi ölçümle bulundu; ayar değiştirirken geri gelmesinler.

**İsim tercemenin başına çakılı olmalı.** Ad parçalarını terceme içinde
herhangi bir yerde aramak 74 yanlış eşleme verdi: Hz. Peygamber
mevlâsı Sevbân'ın tercemesine, Ali b. Ebî Tâlib torunu Ali b.
el-Hüseyin'e düştü. Bir râvinin adı **başkasının** tercemesinde nispet
olarak geçiyor.

**Telaffuz şerhi ismin ortasına giriyor.** "Âbis — *muvahhade kesreli,
sonra mühmele* — b. Rabîa en-Nehaî". Meşhur isimler şerh istemediği
için kontrol setinde görünmüyor, ama tarihsizlerin çoğu bu yüzden
bulunamıyordu. `serhi_at()` bu sözlüğü atıyor.

**Yaştaki "yüz" yıla karışıyor.** "Seksende öldü, **yüz** otuz
yaşındaydı" → 80 yerine 180. Kuyruk yaş belirtecinde kesiliyor.

**Rumuzdaki rakam yıl sanılıyor.** Takrîb her tercemenin sonuna kitap
rumuzlarını koyuyor ve "dört Sünen" rumuzu rakamla yazılıyor ("…seksen
iki, bh m **4**"). Rakam yalnızca "sene"nin hemen ardında kabul
ediliyor. Bu gözden kaçınca isabet %98'den %61'e düştü.

**Yüzler basamağı çoğu kayıtta yazılmıyor** ve tabakadan çıkarılıyor.
Takrîb **kendi** tabakasını söylüyor ve bu bizim yedi kademeli `tab`
alanımızdan çok daha keskin — ama "onuncudan" değil "onuncunun
**büyüklerinden**" diyor, kalıp onu da almalı. Takrîb tabaka
vermiyorsa çıkarım yalnızca erken tabakada (0–3) yapılıyor; geç
tabakada merkezler yüzlük sınırların yanında durduğu için yanıltıyor
(Müslim 261 → 161).

**Tehzîb'de "ilk `mâte sene`yi al" kuralı yanlıştır.** Takrîb'de
terceme tek satır ve içindeki tek vefat kaydı râvinin kendisinin.
Tehzîb'de terceme sayfalarca sürer ve içinde **başkalarının** vefat
kayıtları geçer. Hılâs el-Hecerî'nin tercemesinden çıkan "Mısır'da
Zilhicce 214'te vefat etti" kaydı başkasına ait. Bu yüzden `tehzib_lib`
otomatik yıl vermiyor, yalnızca cümleleri çıkarıyor — kararı insan
veriyor.

**Tehzîb'in terceme indeksi numara artışıyla kuruluyor.** Başlık
kalıbına 7267 satır uyuyor ama araya muhakkikin dipnotları karışıyor ve
onlar her sayfada 1'den başlıyor. "Numara öncekinden büyük olsun"
yetmiyor — mukaddimenin dipnotları dosyanın başında 1'den başladığı
için sayaç onlara kilitleniyor. **En uzun artan altdizi** doğru
çözüm: 6538 terceme, numaralar 1..8045 (kitabın bilinen toplamı).

## Kenar çıkarma (2026-09-09)

Yıl için değil **kenar** için iki betik daha var. İkisi de
Tehzîbü't-Tehzîb metni üzerinde çalışıyor; o kitapta her terceme
`• <rumûz> - <tam neseb>.` biçiminde tek satırlık bir başlıkla açılıyor
ve hoca/talebe listeleri hemen altında duruyor.

```bash
python araclar/terceme/baslik-coz.py cozum.json kalan.json
python araclar/terceme/kenar-tara.py kenarlar.json cozum.json yeni.json
node araclar/kenar-toplu.cjs yeni.json "Tehzîbü't-Tehzîb"
```

`baslik-coz.py` her düğüm için doğru tercemeyi bulur. **Ayırt edici
ölçüt vefat yılıdır, belde değil** — belde denendi ve yanlış kişileri
seçti (Abdullah b. Ömer yerine el-Ömerî, Ebû Saîd el-Hudrî yerine
torunu), çünkü adaşların çoğu aynı şehirli. Yıl hem rakamla hem
**yazıyla** aranıyor; sahâbe tercemelerinde yıl neredeyse hep yazıyla
geçiyor.

`kenar-tara.py` çözülen tercemelerin listelerini tarar ve ağda düğümü
olup da kenarı olmayan çiftleri çıkarır. Karar vermez, aday gösterir.

`kenar-toplu.cjs` kabul edilenleri yazar; kenarlar öznesine göre
bloklara ayrılır.

Ayrıntılı gerekçeler ve tuzaklar `silsile-agi-notlar.md`'de.

## Bu yolun tavanı

Boru hattı 195 tarihsiz isimde **sıfır** sonuç veriyor, ve sebep ayarla
açılacak cinsten değil:

- **127'sinde isim hiç eşleşmiyor.** Takrîb onları bizim
  kaydettiğimizden başka bir ad biçimiyle anıyor: Mansûr b. Safiyye'yi
  "Mansûr b. Abdirrahmân b. Talha" diye (Safiyye anneannesi, sonradan
  açıklama cümlesinde geçiyor), Yezîd el-Fakır'ı "Yezîd b. Suheyb
  el-Kûfî, el-Fakīr diye bilinir" diye.
- **39'unda terceme var ama yıl yok.** Takrîb küçük râvileri tabakaya
  koyup geçiyor. Tehzîb de öyle: erken tabakadaki 38 tarihsiz isimden
  21'inin tercemesi var, çoğunda "sene" kelimesi hiç geçmiyor.
- Kalan ~29'u yaklaşık ya da ihtilaflı ifadeler.

Yani bu isimlerin tarihsiz kalması taramanın eksikliği değil,
**kaynakların sessizliği**. Kalanı açacaksa tabakat ve tarih kitapları
açar; Takrîb ile Tehzîb bu iş için tüketildi.
