# Tehzîbü'l-Kemâl'de terceme bulma (Şâmile kitap 3722)

Bu dosya bir **araç değil, harita**. Bir râvinin `روى عن` / `روى عنه`
listelerine ulaşmak için tercemesini bulmak gerekiyor ve bu, işin en
pahalı adımı. Aşağısı o adımı ucuzlatıyor.

## Neden zor: ÖNEMLİ isimlerin başlığı fihristte YOK

`shamela_search_titles` ile aranan isim çoğu zaman bulunamıyor. Sebep
tesadüf değil, sistematik: **tercemesi uzun olan râvinin fihrist kaydı
eksik.** Ölçüldü, yedisi de böyle çıktı:

Hasan-ı Basrî · Dahhâk b. Müzâhim · İbn Sîrîn · İbrâhim en-Nehaî ·
Alkame b. Kays · Mesrûk b. el-Ecda‘ · Abdurrahman b. Hürmüz el-A‘rec

Yani tam ihtiyaç duyulan isimler aramayla bulunamıyor. Bulunabilenler
(Leys b. Sa‘d 5422, Vehb b. Münebbih 7118, Hemmâm b. Münebbih 6937,
İbrâhim b. Sa‘d 220) zaten kolay olanlar.

## Yöntem: boşluktan kuşatma

1. `shamela_get_toc(book_id:3722, parent_id:0, depth:1)` → 30 küsur
   **bâb** (باب الألف, باب الباء ...). Aşağıda tablosu var, tekrar
   çekmeye gerek yok.
2. İlgili bâbın çocukları → `من اسمه X` **grupları**. Küçük bir liste.
3. O grubun çocukları → **tercemeler**, her biri `page_id` ile.
4. Aradığın isim listede yoksa, **alfabetik olarak nereye düşeceğine**
   bak ve komşularının `page_id`leri arasındaki BOŞLUĞU al. Terceme
   orada, başlıksız duruyor.
5. O aralıktan `shamela_get_pages_range` ile oku. `روى عن` ve
   `روى عنه` tercemenin hemen başında.

Sıralama **babanın adına** göre alfabetik. `عبد الله` ile
`عبد الرحمن` ayrı ayrı sıralanıyor, `أبو X` künyeleri kendi
harfinde değil `X`in harfinde değil — künyeliler ismiyle sıralı
(Ebü'd-Derdâ → عويمر, Ebû Ümâme → صدي, Ebû Mûsâ → عبد الله بن قيس).

## Sayfa ↔ terceme numarası bağıntısı

Ölçülen dört çıpa (terceme no → page_id):

| terceme | page_id |
|---|---|
| 1216 Hasan-ı Basrî | ~2761 |
| 2928 Dahhâk | 6673 |
| 5016 Leys b. Sa‘d | 12767 |
| 6767 Vehb b. Münebbih | 16689 |

Eğim ≈ **2.62 sayfa / terceme**, kitap ortasında tutarlı. Ama
`باب الألف` daha yoğun (~1.94), yani bâb içinde yerel eğim kullan.
Kaba tahmin için: `page ≈ 2761 + 2.62 × (N − 1216)`.

## Bâb tablosu (parent_id:0, depth:1 çıktısı)

| bâb | title_id | ilk page_id |
|---|---|---|
| الألف | 39 | 204 |
| الباء | 718 | 1520 |
| التاء | 871 | 1823 |
| الثاء | 887 | 1856 |
| الجيم | 931 | 1946 |
| الحاء | 1051 | 2261 |
| الخاء | 1671 | 3716 |
| الدال | 1856 | 4087 |
| الذال | 1928 | 4223 |
| الراء | 1937 | 4246 |
| الزاي | 2067 | 4504 |
| السين | 2232 | 4898 |
| الشين | 2717 | 6113 |
| الصاد | 2827 | 6387 |
| الضاد | 2924 | 6636 |
| الطاء | 2954 | 6715 |
| الظاء | 3003 | 6851 |
| العين | 3008 | 6854 |
| الغين | 5074 | 11970 |
| الفاء | 5104 | 12022 |
| القاف | 5180 | 12215 |
| الكاف | 5336 | 12608 |
| اللام | 5411 | 12757 |
| الميم | 5424 | 12804 |
| النون | 6678 | 15821 |
| الهاء | 6833 | 16141 |
| الواو | 6999 | 16458 |
| اللام ألف | 7124 | 16725 |
| الياء | 7126 | 16730 |
| كتاب الكنى | 7515 | 17677 |
| كتاب النساء | 10119 | 18723 |

## Çözülmüş konumlar (tekrar aramaya gerek yok)

| kişi | konum |
|---|---|
| Leys b. Sa‘d | title 5422 · Tehzîb 5016 · s. 12767 |
| Vehb b. Münebbih | title 7118 · Tehzîb 6767 · s. 16689 |
| Hemmâm b. Münebbih | title 6937 · Tehzîb 6600 · s. 16365 |
| İbrâhim b. Sa‘d ez-Zührî | title 220 · Tehzîb 174 · s. 570 |
| Hasan-ı Basrî | BAŞLIKSIZ · s. 2761-2767 (listeler 2762-2767) |
| Dahhâk b. Müzâhim | BAŞLIKSIZ · Tehzîb 2928 · s. 6673-6675 |
| İbrâhim en-Nehaî | BAŞLIKSIZ · 307↔308 arası · s. 716-718 |
| Alkame b. Kays | BAŞLIKSIZ · 4485↔4486 arası · s. 10432-10433 |
| Mesrûk b. el-Ecda‘ | BAŞLIKSIZ · 6227↔6228 arası · s. 14842-14843 |
| Abdurrahman b. Hürmüz el-A‘rec | BAŞLIKSIZ · 3869↔3870 arası · s. 9019-9021 |

## Çözülmüş grup listeleri

Bu grupların çocukları bir kez çekildi; tekrar çekmeden önce buraya bak.

- `باب الألف / من اسمه إبراهيم` = **189**, s. 509-740, çocuklar 190-324.
  İbrâhim b. Sa‘d = 220. Nehaî 307 ile 308 arasında, başlıksız.
- `باب الحاء / من اسمه حسام وحسان` = **1244**, s. 2670-3014,
  çocuklar 1245-1347. Hasan-ı Basrî 1271 (s. 2749) ile 1272 (s. 2792)
  arasında, başlıksız.
- `باب الضاد / من اسمه الضحاك` = **2928**, s. 6641-6684.
  Dahhâk b. Müzâhim 2937 (s. 6658) ile 2938 (s. 6671) arasında.
- `باب العين` alt grupları = 3009-5019 (tam tablo aşağıda kritik olanlar):
  - `من اسمه عبد الله` **3150** s. 7201
  - `من اسمه عبد الرحمن` **3685** s. 8556, çocuklar 3686-3886
  - `من اسمه عبيد الله` **4089** s. 9580
  - `من اسمه عقار وعقبة` **4437** s. 10317
  - `من اسمه علباء وعلقمة` **4478** s. 10424, çocuklar 4479-4488
  - `من اسمه علي` **4489** s. 10446
  - `من اسمه عمرو` **4764** s. 11185
  - `من اسمه عمران` **4895** s. 11559
  - `من اسمه عويم وعويمر` **4968** s. 11720
- `باب الميم / من اسمه محمد` = **5425**, s. 12804, çocuklar 5426-6049
  (624 terceme — dökmek pahalı, önce alfabetik daralt).
- `باب الميم / من اسمه مسرة ومسروح ومسروق` = **6225**, s. 14839,
  çocuklar 6226-6229. Mesrûk 6227 ile 6228 arasında.

## Kalan 27 ismin muhtemel yeri

Aşağıdakiler için henüz konum çıkarılmadı. Parantezde Tehzîb'deki
sıralama adı (baba adına göre aranacak).

| id | Tehzîb'de aranacak ad | bâb / grup |
|---|---|---|
| ibnsirin | محمد بن سيرين | الميم / محمد (5425) |
| kasimmuhammed | القاسم بن محمد بن أبي بكر | القاف (5180) |
| ubeydullahutbe | عبيد الله بن عبد الله بن عتبة | العين / 4089 |
| haricezeyd | خارجة بن زيد بن ثابت | الخاء (1671) |
| abdullahdinar | عبد الله بن دينار | العين / 3150 |
| suaybebihamza | شعيب بن أبي حمزة | الشين (2717) |
| salihkeysan | صالح بن كيسان | الصاد (2827) |
| ebudavudtayalisi | سليمان بن داود الطيالسي | السين (2232) |
| hisamdestuvai | هشام بن أبي عبد الله الدستوائي | الهاء (6833) |
| seybannahvi | شيبان بن عبد الرحمن النحوي | الشين (2717) |
| hemmamyahya | همام بن يحيى | الهاء (6833) |
| israilyunus | إسرائيل بن يونس | الألف / 454 |
| cerirabdulhamid | جرير بن عبد الحميد | الجيم (931) |
| velidmuslim | الوليد بن مسلم | الواو (6999) |
| safii | محمد بن إدريس الشافعي | الميم / محمد (5425) |
| muazcebel | معاذ بن جبل | الميم / معاذ (6347) |
| ebudderda | عويمر أبو الدرداء | العين / 4968 |
| imranhusayn | عمران بن حصين | العين / 4895 |
| sehlsad | سهل بن سعد الساعدي | السين (2232) |
| ukbeamir | عقبة بن عامر الجهني | العين / 4437 |
| ebuumame | صدي بن عجلان أبو أمامة | الصاد (2827) |
| selemeekva | سلمة بن الأكوع | السين (2232) |
| cerirbecelî | جرير بن عبد الله البجلي | الجيم (931) |
| alicad | علي بن الجعد | العين / 4489 |
| ebuzuraraazi | عبيد الله بن عبد الكريم أبو زرعة | العين / 4089 |
| ebuhatimrazi | محمد بن إدريس الحنظلي أبو حاتم | الميم / محمد (5425) |
| bakiyyevelid | بقية بن الوليد | الباء (718) |
| yezidebihabib | يزيد بن أبي حبيب | الياء (7126) |
| amrsuayb | عمرو بن شعيب | العين / 4764 |
| behzhakim | بهز بن حكيم | الباء (718) |

**Tavsiye:** aynı gruptakileri birlikte çöz. `باب العين` altındaki
yedi isim, `السين` altındaki üç isim, `الشين` altındaki iki isim
tek grup dökümüyle halloluyor.
