# -*- coding: utf-8 -*-
"""TAKRIB'DEN DUGUM ISKELETI CIKARIR. Yazmaz, cikarir ve sayar.

NEDEN TAKRIB. Bir dugumun ihtiyaci olan dort alan -- Arapca ad,
tabaka, vefat yili, belde -- Takrib'de TEK SATIRDA ve duzenli bir
kalipla duruyor:

    331- <ad ve nisbeler> <cerh-tadil> من <tabaka> مات سنة <yil> <rumuz>

Tehzib bunlarin hicbirini bu duzenlilikte vermiyor; onun isi
hoca-talebe listeleri ve bilgi karti. Is bolumu su:
ISKELET Takrib'den, BAGLAR ve KART Tehzib'den.

NE KADAR GUVENILIR. `--dogrula` kipi haritadaki dugumleri olcut alip
ayni cikarimi onlar uzerinde yapiyor ve tuttugunu sayiyor. Kapsama
degil ISABET onemli: kabul edilen dogru olsun, gerisi elde kalsin.

Kullanim (my-app icinden):
    python araclar/terceme/takrib-iskelet.py <cikti.json>
    python araclar/terceme/takrib-iskelet.py --dogrula
"""
import io
import json
import os
import re
import sys
import collections

B = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, B)
from takrib_lib import (nrm, tercemeleri_yukle, takrib_tabaka, TAB_MERKEZ,
                        vefat_ifadeleri, yil_coz, serhi_at, altdizi_esle)

METIN = os.path.join(B, "metin", "takrib.txt")
DUGUMLER = os.path.join(B, "..", "dugumler.json")

# Takrib on iki tabaka kullaniyor, harita yedi (bkz. TAB tablosu).
# Esleme TAHMIN EDILMEDI, haritadaki dugumlerden OGRENILDI: 349
# eslesen kayitta Takrib tabakasi ile bizim `tab` capraz sayildi ve
# her satirin en cok gittigi kademe alindi.
#
# ILK TAHMIN YANLISTI. "8-10 etbau't-tabiin, 11-12 muellif nesli"
# diye kurmustum, isabet %50'de kaldi; veri Takrib'in 5'ten 11'e
# kadarki butun tabakalarinin bizim 5'e dustugunu soyluyor.
#
# BU TAVANI DA VAR: ogrenilmis eslemeyle isabet %77,7. Bandlar
# gercekten ortusuyor (bizim tab 3 vefat yili 43-123, tab 4 ise
# 92-165), yani `tab` haritada elle verilmis bir hukum, Takrib'in
# tabakasinin bire bir karsiligi degil. Yildan kestirmek biraz daha
# iyi (%81,9) ama o da tavan.
#
# YERLESIME ETKISI YOK. Nokta BELDE (sutun) ve VEFAT YILI (satir) ile
# konuluyor; `tab` yalnizca kartta gorunen kademe adini ve yil
# bilinmediginde kullanilan `TAHMIN` tahminini besliyor. Yil zaten
# cikarildigi icin burada ikincisi de devrede degil.
HARITA_TAB = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 5, 7: 5,
              8: 5, 9: 5, 10: 5, 11: 5, 12: 6}

# Nisbe -> harita sutunu. Burada olmayan bir belde URETILMEZ: yeni
# sutun butun haritayi genisletiyor (bkz. devir notu, "yeni belde
# sutunu tam genislige mal oluyor") ve bu karar Mustafa'nin.
NISBE = [
    ("Medine", ["المدني", "المديني"]),
    ("Mekke", ["المكي"]),
    ("Kûfe", ["الكوفي"]),
    ("Basra", ["البصري"]),
    ("Bağdat", ["البغدادي"]),
    ("Şam", ["الدمشقي", "الشامي", "الاردني", "الفلسطيني", "الرملي"]),
    ("Vâsıt", ["الواسطي"]),
    ("Mısır", ["المصري", "الاسكندراني", "التنيسي"]),
    ("Humus", ["الحمصي", "الحلبي", "الجزري", "الحراني", "الرقي", "الموصلي"]),
    ("Yemen", ["الصنعاني", "اليماني", "اليمني", "الجندي", "العدني"]),
    ("Horasan", ["المروزي", "النيسابوري", "الهروي", "البلخي", "الطوسي",
                 "السرخسي", "الترمذي", "الخراساني"]),
    ("Mâverâünnehir", ["البخاري", "السمرقندي", "النسفي", "الفرغاني"]),
    ("Cibâl", ["الرازي", "الاصبهاني", "الاصفهاني", "الهمذاني", "القزويني",
               "الجرجاني", "النهاوندي"]),
]
NISBE_N = [(b, [nrm(x) for x in liste]) for b, liste in NISBE]

# «نزيل بغداد» -- YERLESTIGI yer. Olcut "nereli" degil "nerede rivayet
# etti" (silsile-agi-notlar.md), o yuzden yerlesim nisbeden agir
# basiyor ve once buna bakiliyor.
NEZIL = [
    ("Medine", "المدينه"), ("Mekke", "مكه"), ("Kûfe", "الكوفه"),
    ("Basra", "البصره"), ("Bağdat", "بغداد"), ("Şam", "دمشق"),
    ("Şam", "الشام"), ("Vâsıt", "واسط"), ("Mısır", "مصر"),
    ("Humus", "حمص"), ("Yemen", "اليمن"), ("Yemen", "صنعاء"),
    ("Horasan", "مرو"), ("Horasan", "نيسابور"), ("Horasan", "هراه"),
    ("Mâverâünnehir", "بخاري"), ("Cibâl", "الري"), ("Cibâl", "اصبهان"),
]
NEZIL_N = [(b, nrm(x)) for b, x in NEZIL]

CAPRAZ = re.compile(r"يأتي|تقدم|نسب لجده|^هو ابن")
# Takrib ihtilafli yil verdiginde otomatik yazilamaz, elde kalir.
IHTILAF = re.compile(r"او |وقيل|ويقال|يقال|بعد|قبل|بضع")


def belde_bul(n):
    """(belde, nasil). Birden cok nisbe varsa BELIRSIZ sayilir --
    «المدني نزيل بغداد» gibi kayitlarda nezil zaten once bakiliyor,
    ama «البصري الكوفي» ikisi de nisbe ise secim bizim degil."""
    for belde, kok in NEZIL_N:
        if "نزيل " + kok in n:
            return belde, "nezil"
    bulunan = []
    for belde, liste in NISBE_N:
        if any(x in n for x in liste):
            bulunan.append(belde)
    if len(bulunan) == 1:
        return bulunan[0], "nisbe"
    if len(bulunan) > 1:
        return None, "cok-nisbe"
    return None, "yok"


def yuzu_tamamla(taban, acik, tt):
    """Takrib yuz basamagini cogu yerde yazmiyor. Tabaka capasiyla
    tamamlaniyor; capa yoksa ya da iki aday birbirine yakinsa ELDE
    kaliyor. (kontrol.py'deki ayni islevin tabakasiz dalindan arindirilmis
    hali -- burada kendi `tab`imiz yok, yalnizca Takrib'inki var.)"""
    if acik:
        return taban, "acik"
    if not tt:
        return taban, "suphe"
    hedef = TAB_MERKEZ[tt]
    ad = sorted([taban + 100 * i for i in range(0, 5)], key=lambda v: abs(v - hedef))
    net = abs(abs(ad[0] - hedef) - abs(ad[1] - hedef)) >= 45
    return ad[0], ("net" if net else "suphe")


def yil_bul(n, tt):
    ifd = vefat_ifadeleri(n)
    if not ifd:
        return None, "vefat ifadesi yok"
    fiil, edat, kuyruk = ifd[0]
    if edat not in ("سنه", ""):
        return None, "yaklasik ifade"
    if IHTILAF.search(kuyruk):
        return None, "ihtilafli yil"
    taban, acik, blrsz = yil_coz(kuyruk)
    if taban is None or blrsz:
        return None, "yil cozulemedi"
    yil, kip = yuzu_tamamla(taban, acik, tt)
    if kip == "suphe":
        return None, "yuz basamagi supheli"
    return yil, kip


def iskelet(T):
    """Bir Takrib kaydindan (id, tab, olum, belde) ya da eksik sebebi."""
    n = T["n"]
    if CAPRAZ.search(n):
        return None, "capraz kayit"
    tt = takrib_tabaka(n)
    if not tt:
        return None, "tabaka yok"
    belde, nasil = belde_bul(n)
    if not belde:
        return None, "belde " + nasil
    yil, kip = yil_bul(n, tt)
    if yil is None:
        return None, kip
    return {"no": T["no"], "ar": serhi_at(T["ham"]).strip(),
            "ham": T["ham"], "tab": HARITA_TAB[tt], "takribTab": tt,
            "olum": yil, "yilKipi": kip, "belde": belde,
            "beldeNasil": nasil}, None


# Takrib kalibi: AD + nisbe/kunye + HUKUM + tabaka + rumuz. Hukum
# kelimesi ad bolgesinin sonunu isaretliyor. Kalip kontrol.py'den
# aynen aliniyor -- ikisinin ayrisması, aynı düğümün iki betikte
# farkli tercemeye baglanmasi demek olurdu.
HUKUM = re.compile("(?:^| )(?:"
                   "ثقه|صدوق|ضعيف|مقبول|لين|متروك|مجهول|صحابي|وثقه|مخضرم|"
                   "لا باس به|له صحبه|مستور|متهم|كذاب|واه|منكر الحديث|"
                   "فيه ضعف|فيه لين|شبه المجهول|اختلف|روي له|من كبار|"
                   "من الثانيه|من الثالثه|من الرابعه|من الخامسه|من السادسه|"
                   "من السابعه|من الثامنه|من التاسعه|من العاشره|من الحاديه|"
                   "من الاولي|من صغار|من اوساط)")


def ad_bolgesi(n):
    m = HUKUM.search(n)
    return n[:m.start()] if m else n


def onek_esle(ad, TERC):
    """Dugum adi tercemenin BASINDA bitisik gecmeli. Uzunluk farki en
    kucuk olan basta doner, yani en dar eslesme."""
    a = nrm(ad)
    if len(a.split()) < 2:
        return []
    ad_tok = a.split()
    bulunan = []
    for T in TERC:
        bol_tok = serhi_at(ad_bolgesi(T["n"])).split()
        if altdizi_esle(ad_tok, bol_tok):
            bulunan.append((len(bol_tok) - len(ad_tok), T))
    bulunan.sort(key=lambda x: x[0])
    return [T for _, T in bulunan]


def dogrula(TERC):
    dug = json.load(io.open(DUGUMLER, encoding="utf-8"))
    sayac = collections.Counter()
    yil_d = yil_y = belde_d = belde_y = tab_d = tab_y = 0
    hatalar = {"yil": [], "belde": [], "tab": []}
    for d in dug:
        ad = onek_esle(d["ar"], TERC)
        if len(ad) != 1:
            sayac["esleme tekil degil"] += 1
            continue
        isk, sebep = iskelet(ad[0])
        if not isk:
            sayac["cikarilamadi: " + sebep] += 1
            continue
        sayac["cikarildi"] += 1
        if isinstance(d.get("olum"), int):
            if isk["olum"] == d["olum"]:
                yil_d += 1
            else:
                yil_y += 1
                hatalar["yil"].append((d.get("tr"), d["olum"], isk["olum"]))
        if d.get("belde"):
            if isk["belde"] == d["belde"]:
                belde_d += 1
            else:
                belde_y += 1
                hatalar["belde"].append((d.get("tr"), d["belde"], isk["belde"]))
        if isinstance(d.get("tab"), int):
            if isk["tab"] == d["tab"]:
                tab_d += 1
            else:
                tab_y += 1
                hatalar["tab"].append((d.get("tr"), d["tab"], isk["tab"]))
    print("--- dogrulama: haritadaki dugumler olcut ---")
    for a, b in sayac.most_common():
        print("%-32s %d" % (a, b))
    for ad, dg, yn, hl in (("yil", yil_d, yil_y, "yil"),
                           ("belde", belde_d, belde_y, "belde"),
                           ("tabaka", tab_d, tab_y, "tab")):
        t = dg + yn
        oran = (100.0 * dg / t) if t else 0
        print("\n%-7s dogru %4d / %4d  ISABET %%%.1f" % (ad, dg, t, oran))
        for x in hatalar[hl][:8]:
            print("    ! %-34s harita %-14s cikan %s" % (x[0], x[1], x[2]))


def main():
    TERC = tercemeleri_yukle(METIN)
    if "--dogrula" in sys.argv:
        dogrula(TERC)
        return
    sayac = collections.Counter()
    cikti = []
    for T in TERC:
        sayac["kayit"] += 1
        isk, sebep = iskelet(T)
        if isk:
            cikti.append(isk)
            sayac["ISKELET"] += 1
        else:
            sayac[sebep] += 1
    for a, b in sayac.most_common():
        print("%-28s %d" % (a, b))
    if len(sys.argv) > 1 and not sys.argv[1].startswith("--"):
        io.open(sys.argv[1], "w", encoding="utf-8").write(
            json.dumps(cikti, ensure_ascii=False, indent=1))
        print("\nyazildi:", sys.argv[1], "->", len(cikti))


if __name__ == "__main__":
    main()
