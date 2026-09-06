# -*- coding: utf-8 -*-
"""KONTROL: boru hattini YILI ZATEN BILINEN dugumler uzerinde
   sinar, hicbir sey yazmaz. Amac YUKSEK ISABET, yuksek kapsama
   degil: kabul edilenler dogru olsun, gerisi elde kalsin.

   Kullanim (my-app icinden): python araclar/terceme/kontrol.py"""
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
dolu = [d for d in dug if isinstance(d.get("olum"), int)]

kabul_d = kabul_y = 0
red = 0
hata = []
for d in dolu:
    ad = onek_esle(d["ar"], TERC)
    if len(ad) != 1:                      # hic yok ya da birden fazla aday -> ELDE
        red += 1; continue
    T = ad[0][1]
    ifd = vefat_ifadeleri(T["n"])
    if not ifd:
        red += 1; continue
    fiil, edat, kuyruk = ifd[0]
    if edat not in ("سنه", ""):           # "bad/kabl/hudud" -> yaklasik, ELDE
        red += 1; continue
    # IHTILAFLI IFADE KABUL EDILMEZ. Takrib sik sik birden cok ihtimal
    # sayiyor ("57, denildi 58, denildi 59"); ilkini almak kontrol
    # turundaki 20 hatanin cogunu uretti. Boyle bir kayit otomatik
    # yazilamaz, elde kalir.
    if re.search(r"او |وقيل|ويقال|يقال|بعد|قبل|بضع", kuyruk):
        red += 1; continue
    taban, acik, blrsz = yil_coz(kuyruk)
    if taban is None or blrsz:
        red += 1; continue
    yil, kip = yuzu_tamamla(taban, acik, d["tab"], takrib_tabaka(T["n"]))
    if kip == "cikarim-suphe":            # yuz basamagi net degil -> ELDE
        red += 1; continue
    if yil == d["olum"]: kabul_d += 1
    else:
        kabul_y += 1
        hata.append({"tr": d.get("tr"), "id": d["id"], "gercek": d["olum"],
                     "cikan": yil, "tab": d["tab"], "no": T["no"],
                     "kuyruk": kuyruk[:50], "terceme": T["ham"][:110]})
kab = kabul_d + kabul_y
print(f"KABUL: {kab} | dogru {kabul_d} | yanlis {kabul_y} | "
      f"ISABET %{100*kabul_d/kab:.1f}" if kab else "kabul yok")
print(f"ELDE BIRAKILAN: {red} (toplam {len(dolu)})")
io.open(SC + "/kontrol2_hatalar.json", "w", encoding="utf-8").write(
    json.dumps(hata, ensure_ascii=False, indent=1))
for x in hata[:10]:
    print(f"  ! {x['tr']}: gercek {x['gercek']} / cikan {x['cikan']} | {x['kuyruk']}")
