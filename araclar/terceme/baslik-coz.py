# -*- coding: utf-8 -*-
"""Acilamayan tercemeleri acar. Olcut: VEFAT YILI, belde DEGIL.

Ilk denemede aday secimi beldeye birakilmisti ve yanlis kisileri
sectti -- cunku adaslarin cogu ayni sehirde. Sonuclar:
  Abdullah b. Omer (sahabi)   -> Abdullah b. Omer el-OMERI (o. 171)
  Ebu Said el-Hudri           -> TORUNU Said b. Abdirrahman
  Abdurrahman b. Ebza         -> OGLU Abdullah
  Omer b. Ali b. Ebi Talib    -> Omer b. Ali b. el-HUSEYIN
Hepsi ayni kaliptan: bizim ad, uzun bir nesebin ICINDE ata olarak
geciyor. Terceme secmek o kisinin butun hoca-talebe listesini iceri
almak demek; boyle bir hata yuzlerce yanlis kenar uretir.

Yeni olcut:
  1. Dugumun yili varsa, tercemenin GOVDESI o yili soylemeli (+-2).
     Tutan tek terceme varsa al; hicbiri tutmuyorsa BIRAK -- baska
     olcute dusme.
  2. Yil yoksa EN KISA basligi tercih et, ama ancak ikinciden en az
     iki belirtec kisaysa. Ata olarak gecen adlar basligi hep
     uzatir; en kisa olan, adi tam bizimki olandir.
"""
import io, json, os, re, sys, collections

B = os.path.abspath("araclar/terceme")
sys.path.insert(0, B)
from tt_lib import basliksa, baslik_coz, temyiz_mi, satir_sadelestir
from takrib_lib import (nrm, serhi_at, parcala, altdizi_esle, DUR,
                        vefat_ifadeleri, yil_coz)

HAREKE = re.compile("[ً-ْٰـ‌‍]")
BASLIK = re.compile(r"^•\s*(?:([^-]{0,40})-)?\s*(.+?)$")
CAPRAZ = re.compile(r"(تقدم|يأتي|ياتي)\s*\.?\s*$")

ham = io.open(os.path.join(B, "metin", "tehzibut.txt"),
              encoding="utf-8").read().split("\n")
basliklar = []
for i, satir in enumerate(ham):
    s = satir_sadelestir(satir)
    if not s.startswith("•"):
        continue
    m = BASLIK.match(s)
    if not m or "تمييز" in s[:60]:
        continue
    ad = m.group(2).strip()
    if CAPRAZ.search(ad):
        continue
    an = serhi_at(nrm(ad.rstrip(".")))
    basliklar.append({"satir": i, "ad": ad,
                      "tok": [w for w in an.split() if w not in DUR and len(w) > 1]})
satirlar = [b["satir"] for b in basliklar]

# ELLE SABITLEMENIN ARADIGI LISTE AYRI VE DAHA GENIS.
#
# `basliklar` iki suzgecten geciyor: «تمييز» kayitlari ve «تقدم/يأتي»
# ile biten capraz yonlendirmeler atiliyor. Otomatik eslesme icin
# dogru -- biri ayirt etmek icin konmus bir kayit, oteki govdesiz bir
# isaret. Ama ELLE sabitlerken bu suzgec engel oluyor: Tirmizi'nin
# KENDI tercemesi «تمييز» damgali bir kayit ve `basliklar`da hic yok,
# dolayisiyla elle bile baglanamiyordu (2026-09-11).
#
# `tum_basliklar` suzgecsiz. Yalnizca ELLE yolu buna bakiyor, otomatik
# eslesme eskisi gibi `basliklar` uzerinde calisiyor.
tum_basliklar = []
for i, satir in enumerate(ham):
    s = satir_sadelestir(satir)
    if not s.startswith("•"):
        continue
    m = BASLIK.match(s)
    if m:
        tum_basliklar.append({"satir": i, "ad": m.group(2).strip()})
def govde_yillari(g):
    """Tercemenin soyledigi vefat yillari -- RAKAM VE YAZI ile.

    Ilk surum yalnizca "مات سنة (73)" bicimini ariyordu. Sahabe
    tercemelerinde yil cogunlukla YAZIYLA geciyor
    ("مات سنة ثلاث وسبعين") ve o kayitlar bos donuyordu. Sonuc:
    Abdullah b. Omer (sahabi, o. 73) icin dogru terceme hic yil
    vermedi, adasi Abdullah b. Omer el-OMERI'nin tercemesindeki
    "(71)" ise +-2 penceresine girdi ve secim ona gitti -- yani
    sahabinin butun hoca-talebe listesi yerine 171'de olen birinin
    listesi alinacakti."""
    out = set()
    for _, _, kuyruk in vefat_ifadeleri(nrm(g)):
        y, acik, belirsiz = yil_coz(kuyruk)
        if y is not None and not belirsiz:
            out.add(y)
            if not acik:
                out.add(y + 100)
                out.add(y + 200)
    return out


def govde(k):
    i = basliklar[k]["satir"]
    son = next((j for j in satirlar if j > i), len(ham))
    return HAREKE.sub("", "\n".join(ham[i:son]))


ROA = re.compile("روى عن")


def govdesi_var(k):
    """Aday gercek bir terceme mi, yoksa isaret kaydi mi?

    Ibn Hacer muhtasarinda gercek tercemelerin yaninda kisa isaret
    kayitlari da var -- «عثمان بن أبي شيبة يأتي في عثمان بن محمد»,
    «أبو حاتم الرازي. هو محمد بن إدريس الحنظلي» gibi. Ikisi de ayni
    adla basliyor ve gercek tercemeden KISA, dolayisiyla asagidaki
    "en kisa basligi al" tercihi tam da yanlis tarafi seciyordu;
    sonuc hoca-talebe listesi olmayan bos bir govde oluyordu. Bir de
    tercemesi olmayan isimlerde gecerken dusulmus isnad notlari var
    (Simak b. Harb, Zuhli). Hepsini ayni sart eliyor."""
    g = govde(k)
    return len(g) > 300 and bool(ROA.search(g))


def kuyruk_lakap(ad_tok, bol_tok):
    """Bosluk sinirini YALNIZCA son belirtec icin gevsetir.

    Kaydettigimiz ad cogu kez "ilk ad + sohret lakabi" ("سليمان بن
    مهران الاعمش"); Ibn Hacer araya nisbe yiginiyor ("... الاسدي
    الكاهلي ابو محمد الكوفي الاعمش"). Aradaki bosluk alti belirtec,
    3'luk sinir bunu eliyor. Gevseme yalnizca SON belirtec icin ve
    o belirtec basligin da SONUNDA duruyorsa; boylece ata karismasi
    (bizim adin uzun bir nesebin ortasinda gecmesi) acilmiyor."""
    if len(ad_tok) < 2 or not bol_tok:
        return False
    if bol_tok[0] != ad_tok[0] or bol_tok[-1] != ad_tok[-1]:
        return False
    return altdizi_esle(ad_tok[:-1], bol_tok[:-1], 3)


# Elle sabitlenen basliklar. Cozucu adin ILK belirtecini basliga
# cakiyor; kaydettigimiz ad sohret adiysa ("Ibn Sihab ez-Zuhri", "Ebu
# Ishak es-Sebii") bu tutmuyor, ayni ailede ayni ad varsa da (Nasr b.
# Ali el-Cehdami'nin dedesi ile torunu) tek aday cikip yil hic
# sorulmuyor. O dugumlerde dogru baslik gozle secilip yaziliyor.
ELLE = json.load(io.open(os.path.join(B, "baslik-elle.json"),
                         encoding="utf-8"))

dug = json.load(io.open("araclar/dugumler.json", encoding="utf-8"))
sayac = collections.Counter()
cozum, kalan = [], []
for d in dug:
    tok = parcala(d["ar"])
    # ELLE SABITLEME EN ONDE. Bir sure "ad cok kisa" denetimi bunun
    # ustundeydi ve iki belirtecten kisa adlari elle bile
    # baglayamiyorduk: «ابن جريج» ile «الأوزاعي» ELLE'de yazili
    # olmalarina ragmen cozulmeden kaliyordu, cunku `parcala` durak
    # kelimelerini atinca geriye tek belirtec kaliyor (2026-09-11).
    # Elle sabitlemenin varlik sebebi zaten otomatigin tutmadigi
    # yerler, dolayisiyla hicbir otomatik denetimin gerisinde
    # kalmamali.
    if d["id"] in ELLE:
        if ELLE[d["id"]] is None:
            # null = "bu dugumun Tehzib'de tercemesi YOK". Cozucu
            # yakin bir ada carpip yanlis terceme baglamasin diye
            # elle kapatiliyor.
            sayac["elle: tercemesi yok"] += 1
            kalan.append(dict(d, durum="elle-terceme-yok"))
            continue
        k = next((k for k, b in enumerate(tum_basliklar)
                  if ELLE[d["id"]] in b["ad"]), None)
        if k is None:
            sayac["elle baslik tutmadi"] += 1
            kalan.append(dict(d, durum="elle-tutmadi"))
        else:
            sayac["elle sabit"] += 1
            cozum.append(dict(d, satir=tum_basliklar[k]["satir"],
                              baslik=tum_basliklar[k]["ad"][:150], olcut="elle"))
        continue
    if len(tok) < 2:
        sayac["ad cok kisa"] += 1
        kalan.append(dict(d, durum="ad-kisa"))
        continue
    idx = [k for k, b in enumerate(basliklar)
           if altdizi_esle(tok, b["tok"]) or kuyruk_lakap(tok, b["tok"])]
    gercek = [k for k in idx if govdesi_var(k)]
    if gercek:
        idx = gercek
    elif idx:
        sayac["yalnizca isaret kaydi"] += 1
        kalan.append(dict(d, durum="isaret-kaydi",
                          adaylar=[basliklar[k]["ad"][:120] for k in idx[:3]]))
        continue
    if not idx:
        sayac["aday yok"] += 1
        kalan.append(dict(d, durum="aday-yok"))
        continue
    if len(idx) == 1:
        sayac["tekil"] += 1
        cozum.append(dict(d, satir=basliklar[idx[0]]["satir"],
                          baslik=basliklar[idx[0]]["ad"][:150], olcut="tekil"))
        continue
    if d["olum"] is not None:
        uy = [k for k in idx
              if any(abs(y - d["olum"]) <= 2 for y in govde_yillari(govde(k)))]
        if len(uy) > 1:
            # Ikisi de yila uyuyorsa EN KISA basligi al: ata olarak
            # gecen adlar basligi hep uzatir.
            uy = sorted(uy, key=lambda k: len(basliklar[k]["tok"]))[:1]
        if len(uy) == 1:
            sayac["yil ile cozuldu"] += 1
            cozum.append(dict(d, satir=basliklar[uy[0]]["satir"],
                              baslik=basliklar[uy[0]]["ad"][:150], olcut="yil"))
        else:
            sayac["yil ayirmadi"] += 1
            kalan.append(dict(d, durum="cok-aday", aday=len(idx),
                              adaylar=[basliklar[k]["ad"][:120] for k in idx[:5]]))
        continue
    sirali = sorted(idx, key=lambda k: len(basliklar[k]["tok"]))
    if len(basliklar[sirali[1]]["tok"]) - len(basliklar[sirali[0]]["tok"]) >= 2:
        sayac["en kisa baslik"] += 1
        cozum.append(dict(d, satir=basliklar[sirali[0]]["satir"],
                          baslik=basliklar[sirali[0]]["ad"][:150], olcut="kisa"))
    else:
        sayac["ayirt edilemedi"] += 1
        kalan.append(dict(d, durum="cok-aday", aday=len(idx),
                          adaylar=[basliklar[k]["ad"][:120] for k in idx[:5]]))

io.open(sys.argv[1], "w", encoding="utf-8").write(
    json.dumps(cozum, ensure_ascii=False, indent=1))
io.open(sys.argv[2], "w", encoding="utf-8").write(
    json.dumps(kalan, ensure_ascii=False, indent=1))
for a, b in sayac.most_common():
    print("%-20s %d" % (a, b))
print("COZULEN: %d / %d" % (len(cozum), len(dug)))
