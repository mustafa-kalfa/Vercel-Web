# Devir notu — 2026-09-02

Râvi ilişki ağı üzerinde çalışıldı. Öncesi için `silsile-agi-notlar.md`
ve `araclar/tehzib-konum.md` da okunmalı.

## Durum

```
düğüm 661 · kenar 1850 · bilgi kartı 271/661 · vefat yılı olmayan 210
yinelenen kenar 7 (hepsi bu oturumdan ÖNCE vardı)
```

Commit'ler `main`'de, hepsi yayında.

## Bu oturumda yapılanlar

### 1. Takrîb taraması (kart doldurma) — DURDURULDU

Takrîb (Şâmile 8609) sayfa 25-109 tarandı, **59 bilgi kartı** yazıldı
(212 → 271). Dokuz vefat yılı Takrîb'den girildi, biri düzeltildi
(`humeydavf` 95 → 105). Kullanıcı araya girip bağ işine geçilmesini
istedi; tarama **Takrîb sayfa 110'da** duruyor.

### 2. Önemli isimlerin hoca/talebe bağları — ASIL İŞ

On terceme Tehzîbü'l-Kemâl'den (Şâmile 3722) açılıp işlendi:

| kişi | önce | sonra | kaynak |
|---|---|---|---|
| Leys b. Sa‘d | 3 | 33 | Tehzîb 5016 |
| Hasan-ı Basrî | 10 | 46 | Tehzîb 1216 |
| Dahhâk b. Müzâhim | 1 | 12 | Tehzîb 2928 |
| Vehb b. Münebbih | 2 | 14 | Tehzîb 6767 |
| İbrâhim en-Nehaî | 2 | 26 | Tehzîb 2/233-238 |
| İbrâhim b. Sa‘d ez-Zührî | 3 | 26 | Tehzîb 174 |
| Alkame b. Kays | 2 | 20 | Tehzîb 20/300-303 |
| Mesrûk b. el-Ecda‘ | 1 | 20 | Tehzîb 27/451-454 |
| Abdurrahman b. Hürmüz el-A‘rec | 2 | 26 | Tehzîb 17/467-470 |
| Hemmâm b. Münebbih | 3 | 6 | Tehzîb 6600 |

Kenar 1651 → 1850.

### 3. Eşleştiricide YEDİ sistematik kusur bulundu ve düzeltildi

`araclar/esle.cjs`. Hepsi ölçüldü, her düzeltmeden sonra daha önce
işlenmiş bütün listeler yeniden geçirildi.

1. **Baştaki bağlaç `و` iki kez siliniyordu.** `kayitlar()` zaten
   atıyor, `eslestir()` bir daha atınca adı `و` ile başlayan herkes
   ilk harfini kaybediyordu: `ووكيع بن الجراح` → `كيع بن الجراح`.
   Vekî', Velîd, Vehb, Vâsile, Vâkıd — hepsi sessizce kayıptı.
2. **Künye, nesep zincirinin önündeyken de atılıyordu.**
   `أبي عبيدة بن عبد الله بن مسعود` kaydından künye atılınca geriye
   öznenin değil BABASININ adı kalıyordu.
3. **Bu kural bir kez `\b` ile yazılmıştı ve araç zinciri onu GERÇEK
   backspace karakterine (0x08) çevirmişti.** `grep` göstermiyor.
   Ayrıca JS'te `\b` sınırını `\w` tanımlar ve `\w` Arapça harf
   içermez — doğru yazılsa da çalışmazdı. **Bu tuzağa tekrar düşme:
   Arapça regex'te `\b` KULLANMA.**
4. **`عبد` ayrı belirteç sayılıyordu.** `عبد الله` ile `عبد الرحمن`
   ilk belirteci paylaşınca "ism başta" denetimi boşa düşüyor,
   oğulların kayıtları babalara bağlanıyordu.
5. **İsm + şöhret kısaltması eşleşmiyordu.** `سليمان الأعمش` kaydı
   `سليمان بن مهران الأعمش` düğümüne gitmiyordu (adın ORTASI atılmış).
6. **Ters yön serbest alt diziydi**, adın ortasından atlayabiliyordu.
   Önek şartına çevrildi, yanına iki-uç-çapa kuralı kondu.
7. **Düz yönde "en uzun ad kazanır" yanlış seçiyordu.**
   `علي بن الحسين بن علي بن أبي طالب` kaydına hem Zeynelâbidîn hem
   Hz. Ali uyuyor; artık kaydın ÖNEKİ olan aday öncelikli.

Ayrıca akrabalık önekleri (`اخيه`, `ابنه`, `ابيه`, `عمه`, `جده`...)
BAGLAYICI'ya eklendi — Vehb'in öz kardeşi Hemmâm bu yüzden
eşleşmiyordu. Künyenin üç hâli (`ابو/ابي/ابا`) tek biçime indirildi;
Mizzî listeleri cer hâlinde yazdığı için yalnız künyesiyle bilinen
**88 düğüm** sessizce eşleşmiyormuş.

### 4. `araclar/isle.cjs`'te tekilleştirme hatası

Mevcut kenarlar metinden regex ile aranıyordu, oysa kenarların büyük
kısmı dosyada `E("a","b")` olarak DURMUYOR — toplu `.map()`
bloklarından üretiliyor. Regex onları görmediği için 10 kenar iki kez
yazıldı; satırlar silindi, araç artık modülü `eval` edip okuyor.

### 5. Düğüm adı belirsizliği (çözüldü)

`nehai`'nin Arapçası `إبراهيم النخعي` idi ve Tehzîb'de **iki kişiye**
birden uyuyordu (b. Yezîd ve b. Süveyd, ikisi de Nehaî, ikisi de
Alkame'nin talebesi). Mustafâ teyit etti: bizimki **İbrâhim b. Yezîd**.
Ad `إبراهيم بن يزيد النخعي` yapıldı.

### 6. Arayüz: arama kutusu sıfırlanması

Haritada bir yere tıklandığında yalnızca açılır liste kapanıyordu,
yazılan metin kutuda kalıyordu. `setArama("")` eklendi. Tarayıcıda
doğrulandı.

## Sırada ne var

### A. Kalan 27 isim (kullanıcının açık talebi)

En önemli 150 listesinden bağı hâlâ 0-3 olanlar. Tam liste ve her
birinin Tehzîb'de nerede aranacağı **`araclar/tehzib-konum.md`**
içinde. Aynı gruptakileri birlikte çöz.

### B. Konum haritası — BAŞLANDI, BİTMEDİ

Kullanıcı "önce bir konum haritası çıkar" dedi. `tehzib-konum.md`
yöntemi, bâb tablosunu, çözülmüş 10 konumu ve çözülmüş grup
listelerini içeriyor. **Eksik olan:** kalan 27 ismin grup dökümleri.
Bunu bu oturumda bitirmedim çünkü her grup dökümü büyük ve bağlam
penceresi zaten şişmişti — taze bir oturumda yapılması daha doğru.

### C. Eski tercemeleri yeniden geçirme (ÖNEMLİ)

1., 4., 5. ve 7. kusurlar daha önce işlenmiş **bütün** tercemeleri de
etkilemiş olmalı. O 50 kaynaktan gelen 1651 kenarda `و` ile başlayan
isimler, ism+şöhret kısaltmaları ve künyeli isimler düşmüş olabilir.
Ölçmenin tek yolu o tercemeleri yeniden açıp düzeltilmiş
eşleştiriciden geçirmek. **Muhtemelen kayda değer sayıda kenar
kazanılır.**

### D. Küçük açık işler

- **7 yinelenen kenar** duruyor (`buhari|tirmizi`, `*|abdurrezzak`
  vb.), hepsi iki ayrı kaynaktan girilmiş. Hangisinin kalacağı veri
  kararı, dokunulmadı.
- Takrîb taraması sayfa 110'da duruyor; 390 kart hâlâ boş.
- 150 listesinden **15 isim** tabloda hiç yok (Ebû Zer, Selmân-ı
  Fârisî, Ubâde b. es-Sâmit, Ebû Eyyûb, Ebû Katâde, Ebû Bekre,
  Vâsile, Ümmü Seleme, Esmâ bint Ebî Bekir, Ukayl b. Hâlid, Yûnus
  b. Yezîd el-Eylî, İbn Ebî Zi'b, Humeydî, Süleymân b. Harb,
  Ebû Bekir b. Abdirrahman). Hanım râvi kapsamı genel olarak zayıf.

## Boru hattı — nasıl çalıştırılır

```bash
cd my-app
# 1. düğüm tablosunu tazele (silsileVeri.js her değiştiğinde)
node araclar/dugumleri-cikar.cjs

# 2. tercemeden çekilen listeyi bir dosyaya yaz, KURU ÇALIŞTIR
node araclar/esle.cjs <metin.txt> araclar/dugumler.json <ozneId> <hoca|talebe>

# 3. her eşleşmeyi GÖZLE DOĞRULA, sonra yaz
node araclar/isle.cjs <ozneId> <hoca|talebe> <metin.txt> "<kaynak>"
```

**Kuru çalıştırmayı atlama.** Eşleştirici iyi ama yapısal olarak
ayırt edilemeyen durumlar var — `الحسن بن يحيى البصري` Hasan-ı Basrî
değil, `عبد الله بن وهب بن منبه` Mısırlı İbn Vehb değil Vehb'in oğlu.
Bunlar ancak tercemeyi okuyarak yakalanıyor; yakalananlar girdi
dosyasından elle çıkarıldı.

Vefat yılı için `node araclar/yil-guncelle.cjs id=yil` — DİA'da kaydı
olanı reddeder (DİA `N()`'i zaten eziyor).

## Referans belge

Hadis rivayet ilmi için en önemli 150 isim, önem sırasına dizilip
tabloyla karşılaştırıldı:
https://claude.ai/code/artifact/5fbe0326-ed28-4418-9718-c5127c156b86

Ham veri `150-sonuc.json` olarak scratchpad'deydi, kalıcı değil —
gerekirse artifact'ten okunur.

## Çalışma tarzı notları

- Mustafâ: hızlı git, her şeyi sayısal doğrulama, küçük şeylere
  takılma, o söylerse yap.
- Commit + push `main`'e serbest. Ama **`git add -A` KULLANMA** —
  yalnızca dokunduğun dosyaları stage'le. (Bir kez kullanıcının
  commit'lenmemiş işi süpürüldü.)
- Build'i `&&` zincirine güvenerek geçme; `Compiled successfully`
  satırını AÇIKÇA kontrol et.
- Çeviri yazı işi istenmiyor.
