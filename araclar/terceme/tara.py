# -*- coding: utf-8 -*-
"""TARAMA: TARIHSIZ dugumleri Takrib'de arar, hicbir sey yazmaz.
   Kabul edilenler kalan_kabul.json'a dusuyor; yazma isi ayri:
   node araclar/yil-guncelle.cjs <id>=<yil> ...

   Kullanim (my-app icinden): python araclar/terceme/tara.py"""
import sys, json, io, re, os

# Yollar betigin KENDI yerinden turetiliyor, calisma dizininden degil:
# metinler yanindaki metin/ klasorunde, dugum dizini bir ust klasorde.
# Elle bir dizin vermek gerekirse tek arguman olarak gecilebilir.
BURASI = os.path.dirname(os.path.abspath(__file__))
SC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(BURASI, "metin")
DUGUMLER = os.path.join(BURASI, "..", "dugumler.json")
sys.path.insert(0, BURASI)
from takrib_lib import (nrm, tercemeleri_yukle, vefat_ifadeleri,
                        yil_coz, takrib_tabaka, TAB_MERKEZ,
                        serhi_at, altdizi_esle)

TAHMIN = {0: 11, 1: 55, 2: 90, 3: 105, 4: 135, 5: 175, 6: 300}
TERC = tercemeleri_yukle(SC + "/takrib.txt")

# Takrib kalibi: AD + nisbe/kunye + HUKUM + tabaka + kitap rumuzlari.
# Hukum kelimesi ad bolgesinin sonunu isaretliyor.
# HER ALTERNATIF KELIME BASINDA OLMALI. Onceden ciplak birer
# desendiler ve "من ال" (min el-) kalibi
# ABDURRAHMAN isminin ORTASINA dusuyordu ("...abdurrah|man
# el-|attar"), yani en sik gecen adlardan biri ad bolgesi
# kesilirken ikiye biciliyordu ve hic eslesemiyordu.
HUKUM = re.compile("(?:^| )(?:"
                   "ثقه|صدوق|"
                   "ضعيف|مقبول|"
                   "لين|متروك|"
                   "مجهول|صحابي|"
                   "وثقه|مخضرم|"
                   "من ال|من كبار|"
                   "من صغار)")

def ad_bolgesi(tn):
    m = HUKUM.search(tn)
    return (tn[:m.start()] if m else tn[:120]).strip()

def onek_esle(ar, TERC):
    """Dugum adi tercemenin BASINDA bitisik gecmeli."""
    a = nrm(ar)
    if len(a.split()) < 2:
        return []
    ad_tok = a.split()
    ad = []
    for T in TERC:
        bol_tok = serhi_at(ad_bolgesi(T["n"])).split()
        if altdizi_esle(ad_tok, bol_tok):
            ad.append((100 - (len(bol_tok) - len(ad_tok)), T))
    ad.sort(key=lambda x: -x[0])
    return ad

def yuzu_tamamla(taban, acik, tab, tt=None):
    if acik or taban is None:
        return taban, "acik"
    # TAKRIB TABAKA VERMIYORSA YUZ BASAMAGI TAHMIN EDILMEZ. Bizim `tab`
    # alanimiz yalnizca yedi kademe ve gec ravilerde yaniltiyor: Muslim
    # b. el-Haccac'in tercemesinde tabaka hic yok, bizim tab'i (5, merkez
    # 175) kullanmak 261'i 161 yapiyordu. Ayni sey Ishak el-Kevsec ve
    # Ahmed b. Salih'te de oldu. Boyle kayitlar elde kaliyor.
    if not tt:
        # ERKEN TABAKADA (0-3) bizim `tab` yeterli: merkezler 11/55/90/105
        # ve yuzluk adaylar birbirinden 100 uzakta, secim tartismasiz.
        # GEC TABAKADA yaniltiyor -- merkezler (135/175/300) yuzluk
        # sinirlarin yaninda duruyor ve Muslim'i 261 yerine 161 yapmisti.
        if tab > 3:
            return taban, "cikarim-suphe"
        hedef = TAHMIN.get(tab, 150)
    else:
        hedef = TAB_MERKEZ[tt]
    ad = sorted([taban + 100 * i for i in range(0, 5)], key=lambda v: abs(v - hedef))
    net = abs(abs(ad[0] - hedef) - abs(ad[1] - hedef)) >= 45
    return ad[0], ("cikarim-net" if net else "cikarim-suphe")

dug = json.load(io.open(DUGUMLER, encoding="utf-8"))
dolu = [d for d in dug if d.get("olum") in (None, "", 0)]

kabul, red = [], []
for d in dolu:
    ad = onek_esle(d["ar"], TERC)
    if len(ad) != 1:
        red.append((d, "aday %d" % len(ad))); continue
    T = ad[0][1]
    ifd = vefat_ifadeleri(T["n"])
    if not ifd:
        red.append((d, "vefat kaydi yok")); continue
    fiil, edat, kuyruk = ifd[0]
    if edat not in ("سنه", ""):
        red.append((d, "yaklasik")); continue
    if re.search("او |وقيل|ويقال|"
                 "يقال|بعد|قبل|"
                 "بضع", kuyruk):
        red.append((d, "ihtilafli ifade")); continue
    taban, acik, blrsz = yil_coz(kuyruk)
    if taban is None or blrsz:
        red.append((d, "sayi cozulemedi")); continue
    tt = takrib_tabaka(T["n"])
    yil, kip = yuzu_tamamla(taban, acik, d["tab"], tt)
    if kip == "cikarim-suphe":
        red.append((d, "yuz basamagi supheli")); continue
    kabul.append({"id": d["id"], "tr": d.get("tr"), "tab": d["tab"], "yil": yil,
                  "kip": kip, "tt": tt, "no": T["no"],
                  "kuyruk": kuyruk.strip()[:40], "terceme": T["ham"][:160]})

print("KABUL: %d | ELDE: %d | toplam %d" % (len(kabul), len(red), len(dolu)))
io.open(SC + "/kalan_kabul.json", "w", encoding="utf-8").write(
    json.dumps(kabul, ensure_ascii=False, indent=1))
import collections
print(collections.Counter(s for _, s in red).most_common())
print()
for k in sorted(kabul, key=lambda x: x["yil"]):
    print("  %-20s %-30s o.%4d  tab%d  Takrib#%-5d ttab=%s" %
          (k["id"], (k["tr"] or "")[:30], k["yil"], k["tab"], k["no"], k["tt"]))
