# Tehzîbü'l-Kemâl'de terceme bulma (Şâmile kitap 3722)

Bu dosya bir **araç değil, harita**. Bir râvinin `روى عن` / `روى عنه`
listelerine ulaşmak için tercemesini bulmak gerekiyor ve bu, işin en
pahalı adımıydı. Aşağısı o adımı ucuzlatıyor.

**2026-09-02'de yöntem değişti.** Aşağıdaki §1 artık ilk seçenek;
eski "boşluktan kuşatma" (§3) yalnız o tutmazsa gerekiyor. Kalan 27
ismin (aslında 30) hepsi §1 ve §2 ile bulundu, tablo en altta.

## Neden zor: ÖNEMLİ isimlerin başlığı fihristte YOK

`shamela_search_titles` ile aranan isim çoğu zaman bulunamıyor. Sebep
tesadüf değil, sistematik: **tercemesi uzun olan râvinin fihrist kaydı
eksik.** Ölçüldü, defalarca doğrulandı — Hasan-ı Basrî, Dahhâk, İbn
Sîrîn, Nehaî, Alkame, Mesrûk, A‘rec, Şâfiî, Muâz b. Cebel, Ebü'd-Derdâ,
Ukbe b. Âmir, Ali b. el-Ca‘d, Seleme b. el-Ekva‘, Ebû Ümâme, Hârice b.
Zeyd, Sâlih b. Keysân, Cerîr b. Abdülhamîd, Behz b. Hakîm, Şeybân
en-Nahvî, Hişâm ed-Destüvâî, Ebû Dâvûd et-Tayâlisî, Abdullah b. Dînâr,
Yezîd b. Ebî Habîb... Yani tam ihtiyaç duyulan isimler **başlıkla**
aranamıyor.

## 1. YÖNTEM (ÖNCELİKLİ): nesep parçasıyla metin araması

`shamela_search_phrase` ile **nesebin ayırt edici bir parçasını** ara,
kitabı 3722'ye kısıtla. Başlık indeksini hiç kullanmadığı için başlıksız
tercemeleri de buluyor ve tek çağrıda üçünü birden veriyor: `page_id`,
basılı cilt/sayfa, ve pasajın başındaki **terceme numarası**.

```
shamela_search_phrase({
  query: "علي بن الجعد بن عبيد",
  scope: {book_ids: [3722]}, limit: 3
})
→ page_id 10472, 20/341, "٤٠٣٤ - خ د: علي بن الجعد بن عُبَيد الجوهري"
```

Kurallar:

- **Uzun ve tekil bir dizi seç.** `عقبة بن عامر الجهني` 25 sonuç verir
  (başkalarının tercemelerinde geçiyor); `عقبة بن عامر بن عبس` bir
  sonuç verir, o da tercemenin kendisi. Şöhret nisbesi değil, **dedenin
  adı** ayırt ediyor.
- Sonuç 0 ise `mode:"near"` + geniş `distance` dene. `سنبر الدستوائي`
  25 kelime yakınlıkla Destüvâî'yi buldu, düz ibare hiç bulamamıştı.
- Cevaptaki `dropped_tokens`'a bak. Yaygın kelimeler (`الأنصاري`,
  `البصري`, `أبو`) atılıyor ve arama sessizce zayıflıyor.
- **Arama en fazla 5 belirteç alıyor, gerisini atıyor.** `normalized_tokens`
  alanı bunu açıkça gösteriyor: `عبد الرحمن بن عوف بن عبد عوف الزهري`
  sorgusundan geriye `["عبد","الرحمن","بن","عوف","بن"]` kalıyor ve
  `الزهري` düşüyor. Yani sorguya `بن` / `عبد` gibi doldurma kelimeler
  koymak ayırt edici olanı dışarı itiyor. Kısa ve ayırt edici yaz:
  `عوف الزهري أحد العشرة` Abdurrahman b. Avf'ı tek sonuçla getirdi,
  uzun nesep zinciri 409 sonuç verip işe yaramamıştı.
- Künyeyle bilinenlerde **ismi** ara: Ebû Ümâme → `صدي بن عجلان بن وهب`,
  Ebü'd-Derdâ → `عويمر بن مالك`, Ebû Dâvûd et-Tayâlisî →
  `سليمان بن داود بن الجارود`.

## 1b. Başlık aramasının üç tuzağı (2026-09-03)

`search_titles` belirteci **yazıldığı gibi** eşliyor; kök ya da ek
analizi yok. Üç yerde ısrarla yanılttı:

- **Harf-i tarif.** Mizzî başlıkta çoğu zaman `عباس`, `صفوان` yazıyor,
  `العباس` değil. `العباس بن محمد الدوري` sıfır sonuç verdi; terceme
  fihristte duruyordu (3141).
- **Ön ek belirtece yapışıyor.** `المعروف بالرمادي` içinde belirteç
  `بالرمادي`; `الرمادي` ile aranınca tutmuyor. Ahmed b. Mansûr
  er-Ramâdî bu yüzden "yok" göründü (var, 156).
- **Başlığın kendisi hatalı olabilir.** Ebû Ahmed ez-Zübeyrî'nin
  başlığında `الأسلمي` yazıyor, doğrusu `الأسدي`. Nisbeyle aranınca
  bulunamadı; `الزبير عمر درهم` (dede adları) buldu.

Üçünde de çözüm aynı: nisbeyi bırak, **nesep zincirindeki özel adları**
ara — ya da doğrudan §3'e geç, `من اسمه X` çocuklarını dök ve boşluğu
oku. Bu partide beş ismin tercemesine ancak öyle ulaşıldı (Cûzcânî,
Ramâdî, Ebû Osmân en-Nehdî, Cübeyr b. Nüfeyr, Mus'ab b. Sa'd).

## 2. YÖNTEM: sayfadan başlığa sorma (ikili arama)

`shamela_get_toc({book_id:3722, containing_page_id:N})` bir sayfanın
ata zincirini döndürüyor — bâb, grup ve **o sayfayı içeren terceme
başlığı**. Çıktısı üç satır, yani neredeyse bedava. Bir grubun 600
çocuğunu dökmek yerine 4-5 sorguyla ikili arama yap.

Alfabetik konumdan bir sayfa tahmin et, sor, hangi tercemede olduğunu
gör, daralt. Başlıksız terceme, iki başlık arasındaki boşluk olarak
kendini belli ediyor: sorgu hep bir öncekini döndürüyorsa aradaki
sayfalarda başlıksız bir terceme vardır.

## 3. YÖNTEM (eski): TOC'ta boşluktan kuşatma

1. `shamela_get_toc(book_id:3722, parent_id:0, depth:1)` → bâblar
   (tablo aşağıda, tekrar çekme).
2. Bâbın çocukları → `من اسمه X` grupları.
3. Grubun çocukları → tercemeler, her biri `page_id` ile.
4. Ad listede yoksa **alfabetik olarak nereye düşeceğine** bak,
   komşularının `page_id`leri arasındaki BOŞLUĞU al.

Pahalı olan 3. adım (`من اسمه محمد` 624 çocuk). §1 tutmazsa kullan.

### Sıralama kuralları (ölçüldü)

Sıralama **babanın adına** göre. Ama iki istisna var ve ikisi de
yanlış tahmine yol açtı:

- **`عبد الله` her zaman önce geliyor**, alfabetik olarak `عبد الرحمن`
  ve `عبد الحميد`den sonra gelmesi gerekirken. Bâb düzeyinde de böyle
  (`من اسمه عبد الله` 3150, `عبد الرحمن` 3685). Cerîr b. Abdülhamîd bu
  yüzden Cerîr b. Abdillâh'tan **sonra**.
- **`سلام` / `سلامة` s harfinin SONUNA** atılıyor (`من اسمه سلام` 2695,
  `سويد` 2679'dan sonra). İbn Sîrîn bu yüzden `محمد بن سلام`ların
  hemen üstünde değil, arasında çıktı.

Künyeliler künyenin harfinde değil **ismin** harfinde sıralı
(Ebü'd-Derdâ → عويمر, Ebû Ümâme → صدي, Ebû Mûsâ → عبد الله بن قيس).

## Sayfa ↔ terceme numarası bağıntısı

| terceme | page_id |
|---|---|
| 1216 Hasan-ı Basrî | ~2761 |
| 2928 Dahhâk | 6673 |
| 5016 Leys b. Sa‘d | 12767 |
| 6767 Vehb b. Münebbih | 16689 |

Eğim ≈ **2.62 sayfa / terceme**, kitap ortasında tutarlı. `باب الألف`
daha yoğun (~1.94). Kaba tahmin: `page ≈ 2761 + 2.62 × (N − 1216)`.
İkili arama için başlangıç noktası olarak yeterli.

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

## ÇÖZÜLMÜŞ KONUMLAR

`title` = fihristte başlığı var, `shamela_get_book_section(3722, title)`
doğrudan okur. `Tehzîb N` = terceme numarası, başlık yok, sayfadan oku.

### Önceki oturumlardan

| kişi | konum |
|---|---|
| Leys b. Sa‘d | title 5422 · Tehzîb 5016 · s. 12767 |
| Vehb b. Münebbih | title 7118 · Tehzîb 6767 · s. 16689 |
| Hemmâm b. Münebbih | title 6937 · Tehzîb 6600 · s. 16365 |
| İbrâhim b. Sa‘d ez-Zührî | title 220 · Tehzîb 174 · s. 570 |
| Hasan-ı Basrî | BAŞLIKSIZ · s. 2761-2767 (listeler 2762-2767) |
| Dahhâk b. Müzâhim | BAŞLIKSIZ · Tehzîb 2928 · s. 6673-6675 |
| İbrâhim en-Nehaî | BAŞLIKSIZ · s. 716-718 |
| Alkame b. Kays | BAŞLIKSIZ · s. 10432-10433 |
| Mesrûk b. el-Ecda‘ | BAŞLIKSIZ · s. 14842-14843 |
| Abdurrahman b. Hürmüz el-A‘rec | BAŞLIKSIZ · s. 9019-9021 |

### Kalan 30 isim — 2026-09-02'de çözüldü, hepsi ölçülü

| id | Tehzîb'deki ad | konum |
|---|---|---|
| ibnsirin | محمد بن سيرين | BAŞLIKSIZ · Tehzîb 5280 · s. 13438 (25/344) |
| kasimmuhammed | القاسم بن محمد بن أبي بكر | **title 5222** · s. 12315 |
| ubeydullahutbe | عبيد الله بن عبد الله بن عتبة | **title 4127** · s. 9648 (19/73) |
| haricezeyd | خارجة بن زيد بن ثابت | BAŞLIKSIZ · Tehzîb 1589 · s. 3720 (8/8) |
| abdullahdinar | عبد الله بن دينار القرشي العدوي | BAŞLIKSIZ · Tehzîb 3251 · s. 7400 (14/471) |
| suaybebihamza | شعيب بن أبي حمزة | **title 2784** · s. 6290 |
| salihkeysan | صالح بن كيسان | BAŞLIKSIZ · Tehzîb 2834 · s. 6461 (13/79) |
| ebudavudtayalisi | سليمان بن داود بن الجارود | BAŞLIKSIZ · Tehzîb 2507 · s. 5722 (11/401) |
| hisamdestuvai | هشام بن أبي عبد الله الدستوائي | BAŞLIKSIZ · Tehzîb 6582 · s. 16282 (30/215) |
| seybannahvi | شيبان بن عبد الرحمن التميمي | BAŞLIKSIZ · Tehzîb 2784 · s. 6366 (12/592) |
| hemmamyahya | همام بن يحيى | **title 6939** · s. 16369 |
| israilyunus | إسرائيل بن يونس | **title 458** · s. 997 |
| cerirabdulhamid | جرير بن عبد الحميد بن قرط | BAŞLIKSIZ · Tehzîb 918 · s. 2054 (4/540) |
| velidmuslim | الوليد بن مسلم | **title 7086** · s. 16635 |
| safii | محمد بن إدريس بن العباس | BAŞLIKSIZ · Tehzîb 5049 · s. 12866-12869 (24/355) |
| muazcebel | معاذ بن جبل | BAŞLIKSIZ · Tehzîb 6020 · s. 15081 (28/105) |
| ebudderda | عويمر بن مالك | BAŞLIKSIZ · Tehzîb 4558 · s. 11723 (22/469) |
| imranhusayn | عمران بن حصين | **title 4901** · s. 11573 |
| sehlsad | سهل بن سعد الساعدي | **title 2649** · s. 5962 |
| ukbeamir | عقبة بن عامر بن عبس | BAŞLIKSIZ · Tehzîb 3978 · s. 10333 (20/202) |
| ebuumame | صدي بن عجلان بن وهب | BAŞLIKSIZ · Tehzîb 2872 · s. 6540 (13/158) |
| selemeekva | سلمة بن عمرو بن الأكوع | BAŞLIKSIZ · Tehzîb 2462 · s. 5622 (11/301) |
| cerirbecelî | جرير بن عبد الله البجلي | **title 987** · s. 2047-2065 |
| alicad | علي بن الجعد بن عبيد | BAŞLIKSIZ · Tehzîb 4034 · s. 10472 (20/341) |
| ebuzuraraazi | عبيد الله بن عبد الكريم أبو زرعة | **title 4135** · s. 9664-9686 |
| ebuhatimrazi | محمد بن إدريس الحنظلي | **title 5452** · s. 12892 |
| bakiyyevelid | بقية بن الوليد | **title 814** · s. 1707 |
| yezidebihabib | يزيد بن أبي حبيب | BAŞLIKSIZ · Tehzîb 6975 · s. 17217 (32/102) |
| amrsuayb | عمرو بن شعيب | **title 4818** · s. 11318 |
| behzhakim | بهز بن حكيم بن معاوية | BAŞLIKSIZ · Tehzîb 775 · s. 1774 (4/259) |

Dikkat: `suaybebihamza` **title_id** 2784, `seybannahvi` **Tehzîb no**
2784. Aynı sayı, ayrı numaralandırma. Karıştırma.

### Tek yönlü kalan hatırı sayılı isimler (2026-09-03)

Hepsi BAŞLIKSIZ, §1 ile bulundu (aksi belirtilmedikçe).

| kişi | konum |
|---|---|
| ebuvail (Ebû Vâil) | Tehzîb 2767 · s. 6322 (12/548) |
| ibnvehb (Abdullah b. Vehb) | Tehzîb 3645 · s. 8271 (16/277) |
| gunder (Muhammed b. Ca‘fer) | Tehzîb 5120 · s. 13099 (25/5) |
| hafsgiyas | Tehzîb 1415 · s. 3279 (7/56) — title 1478 de var |
| ibnnumeyr (Abdullah b. Nümeyr) | Tehzîb 3618 · s. 8219 — title 3552 |
| yezidzurey | Tehzîb 6987 · s. 17239 — title 7310 |
| nadrsumeyl | Tehzîb 6421 · s. 15951-52 (29/379) |
| huseyn (Hüseyin b. Ali) | Tehzîb 1323 · s. 3061 (6/396) |
| abdrahmanavf | Tehzîb 3923 · s. 8875 (17/324) |
| tariksihab | Tehzîb 2950 · s. 6723 — title 2960 |
| zeydvehb | Tehzîb 2131 · s. 4884 — title 2220 |
| asimbehdele | Tehzîb 3002 · s. 6855 — title 3011 |
| abdulmelikumeyr | Tehzîb 3546 · s. 9404 — title 4019 |
| fudaylibnayaz | Tehzîb 4763 · s. 12169 (23/281) |
| ebumuaviyedarir | Tehzîb 5173 · s. 13217 (25/123) |
| leysebisuleym | Tehzîb 5017 · s. 12791 (24/279) |
| cabirzeyd | Tehzîb 866 · s. 1948 (4/434) |
| suddi (İsmâîl es-Süddî) | Tehzîb 462 · s. 1147 — title 523 |
| suleymanbilal | Tehzîb 2496 · s. 5693 (11/372) |
| mutemirsuleyman | Tehzîb 6080 · s. 15226 — title 6409 |
| muazmuaz | Tehzîb 6036 · s. 15108 (28/132) |
| ruhubade | Tehzîb 1930 · s. 4479 — title 2049 |
| abdulvarissaid | Tehzîb 3595 · s. 9512 — title 4066 |
| abdussamed | Tehzîb 3431 · s. 9133 (18/99) |
| ebulahvess (Sellâm b. Süleym) | Tehzîb 2655 · s. 6056 (12/282) |
| ishaktalha | Tehzîb 366 · s. 926 — title 420 |
| suleymanmugire | Tehzîb 2567 · s. 5843 (12/69) |
| muaviyesalih | Tehzîb 6058 · s. 15162 (28/186) |

**Bulunamayanlar** (aramanın hepsi ayırt edici belirteci düşürdü,
ikili arama da tutmadı): Mes‘ûdî (Abdurrahman b. Abdillâh),
Abdülmelik b. Ebî Süleymân, Hâlid b. el-Hâris el-Hüceymî.

## Çözülmüş grup listeleri

Bu grupların çocukları bir kez çekildi; tekrar çekmeden önce buraya bak.

- `الألف / من اسمه إبراهيم` = **189**, s. 509-740, çocuklar 190-324.
  İbrâhim b. Sa‘d = 220. Nehaî 307 ile 308 arasında, başlıksız.
- `الألف / من اسمه أسد وإسرائيل` = **454**, çocuklar 455-458.
- `الباء / من اسمه بصرة وبعجة وبقية` = **811**, s. 1704, çocuklar 812-814.
- `الباء / من اسمه بهز وبهلول وبور` = **850**, s. 1772, çocuklar 851-853.
- `الجيم / من اسمه جرهد وجرير وجري` = **982**, s. 2037, çocuklar 983-992.
- `الحاء / من اسمه حسام وحسان` = **1244**, s. 2670-3014, çocuklar
  1245-1347. Hasan-ı Basrî 1271 (s. 2749) ile 1272 (s. 2792) arasında.
- `الخاء / من اسمه خارجة` = **1672**, s. 3717, çocuklar 1673-1676.
  Hârice b. Zeyd 1673'ün içinde, s. 3720'de başlıksız.
- `السين / من اسمه سلمة` = **2495**, s. 5584, çocuklar 2496-2524.
- `السين / من اسمه سليمان` = **2541**, s. 5672, çocuklar 2542-2620.
- `السين / من اسمه سهل` = **2644**, s. 5942, çocuklar 2645-2658.
- `الشين / من اسمه شعيب وشعيث` = **2780**, s. 6275, çocuklar 2781-2795.
- `الشين / من اسمه شيبان وشيبة وشييم` = **2819**, s. 6365, çocuklar 2820-2826.
- `الصاد / من اسمه صاعد وصالح` = **2828**, s. 6387, çocuklar 2829-2864.
- `الصاد / من اسمه صدقة وصدي وصرد` = **2880**, s. 6509, çocuklar 2881-2891.
- `الضاد / من اسمه الضحاك` = **2928**, s. 6641-6684. Dahhâk b. Müzâhim
  2937 (s. 6658) ile 2938 (s. 6671) arasında.
- `العين` alt grupları = 3009-5019:
  - `من اسمه عبد الله` **3150** s. 7201 (535 çocuk — dökme, ikili ara)
  - `من اسمه عبد الرحمن` **3685** s. 8556, çocuklar 3686-3886
  - `من اسمه عبيد الله` **4089** s. 9580, çocuklar 4090-4178
  - `من اسمه عقار وعقبة` **4437** s. 10317, çocuklar 4438-4462
  - `من اسمه علباء وعلقمة` **4478** s. 10424, çocuklar 4479-4488
  - `من اسمه علي` **4489** s. 10446 (275 çocuk)
  - `من اسمه عمرو` **4764** s. 11185 (131 çocuk)
  - `من اسمه عمران` **4895** s. 11559, çocuklar 4896-4926
  - `من اسمه عويم وعويمر` **4968** s. 11720-11729, çocuklar 4969-4970
  - `من اسمه العلاء` **4971** s. 11730
- `القاف / من اسمه القاسم` = **5184**, s. 12223, çocuklar 5185-5241.
- `الميم / من اسمه محمد` = **5425**, s. 12804, çocuklar 5426-6049
  (624 terceme — dökmek pahalı, §1 veya §2 kullan).
- `الميم / من اسمه مسرة ومسروح ومسروق` = **6225**, s. 14839,
  çocuklar 6226-6229. Mesrûk 6227 ile 6228 arasında.
- `الميم / من اسمه معاذ` = **6347**, s. 15079, çocuklar 6348-6367.
  Muâz b. Cebel 6349 ile 6350 arasında, başlıksız.
- `الهاء / من اسمه هشام` = **6904**, s. 16241, çocuklar 6905-6928.
- `الهاء / من اسمه همام وهناد` = **6935**, s. 16364, çocuklar 6936-6941.
- `الواو / من اسمه وليد` = **7042**, s. 16554, çocuklar 7043-7098.
- `الياء / من اسمه يزداد ويزيد` = **7282**, s. 17179, çocuklar 7283-7396.

## 150 listesinden tabloda hiç olmayan 15 isim (TAMAMLANDI 2026-09-03)

Hepsi eklendi ve iki yönde işlendi:
Ebû Zer, Selmân-ı Fârisî, Ubâde b. es-Sâmit, Ebû Eyyûb, Ebû Katâde,
Ebû Bekre, Vâsile, Ümmü Seleme, Esmâ bint Ebî Bekir, Ukayl b. Hâlid,
Yûnus b. Yezîd el-Eylî, İbn Ebî Zi'b, Humeydî, Süleymân b. Harb,
Ebû Bekir b. Abdirrahman. Hanım râvi kapsamı genel olarak zayıf.

## 2026-09-03 partisi: eklenen 35 ismin terceme numaraları

| râvi | Tehzîb | nasıl bulundu |
|---|---|---|
| Süfyân b. Vekî‘ | 2418 | başlık |
| Hârûn b. Abdillâh el-Hammâl | 6520 | başlık |
| Muhammed b. Sellâm el-Bîkendî | 5278 | başlık |
| Habbân b. Hilâl | 1064 | başlık |
| Abdül'alâ b. Hammâd en-Nersî | 3683 | başlık |
| Duhaym | 3747 | başlık |
| Ahmed b. Sinân el-Kattân | 45 | başlık |
| Ebû Kudâme es-Serahsî | 3639 | başlık (künye + dede) |
| Yahyâ b. Mûsâ el-Belhî | 6930 | TOC boşluğu (17120-17125) |
| Esed b. Mûsâ | 400 | başlık |
| Abdullah b. Muhammed el-Müsnedî | 3536 | başlık (dede adları) |
| Rebî‘ b. Süleymân el-Murâdî | 1864 | başlık |
| Ebû Âmir el-Akadî | 3545 | başlık |
| Ebû Ahmed ez-Zübeyrî | 5343 | başlık (nisbe hatalı, dede adıyla) |
| Muhammed b. es-Sabbâh ed-Dûlâbî | 5298 | şerh dipnotundan cilt/sayfa |
| Abdullah b. Recâ el-Gudânî | 3262 | başlık |
| Abbâs b. Abdil'azîm el-Anberî | 3128 | TOC listesi (`من اسمه عباس`) |
| Hasan b. Muhammed ez-Za‘ferânî | 1270 | başlık |
| Abbâs b. Muhammed ed-Dûrî | 3141 | TOC listesi (`من اسمه عباس`) |
| Haccâc b. eş-Şâir | 1131 | başlık |
| İbrâhim b. Ya‘kūb el-Cûzcânî | 268 | TOC boşluğu (727-730) |
| Ahmed b. Mansûr er-Ramâdî | 113 | TOC listesi (`من اسمه أحمد`) |
| Ahmed b. Abde ed-Dabbî | 75 | TOC listesi (`من اسمه أحمد`) |
| Yûsuf b. Mûsâ el-Kattân | 7159 | TOC listesi (`من اسمه يوسف`) |
| Atâ b. Yesâr | 3946 | başlık |
| Saîd b. Ebî Saîd el-Makburî | 2284 | TOC boşluğu (5239-5245) |
| Ebû Osmân en-Nehdî | 3968 | TOC boşluğu (8975-8980) |
| Cübeyr b. Nüfeyr | 905 | TOC boşluğu (2023-2025) |
| Abdurrahman b. Ganm | 3928 | TOC listesi |
| Saîd b. Ebî Hilâl | 2372 | TOC listesi |
| Safvân b. Süleym | 2882 | TOC boşluğu (6566-6572) |
| Bükeyr b. Abdillâh b. el-Eşec | 765 | TOC listesi (`من اسمه بكير`) |
| Nâfi‘ b. Cübeyr b. Mut‘im | 6359 | TOC listesi (`من اسمه نافع`) |
| Mus‘ab b. Sa‘d | 5982 | TOC boşluğu (15000-15002) |
| İrâk b. Mâlik | 3893 | başlık |
