# -*- coding: utf-8 -*-
"""Cozulemeyen dugumler icin baslik-elle.json'a ONERI uretir.

Cozucu adin ilk belirtecini basliga cakiyor. Kaydettigimiz ad sohret
adiysa bu tutmuyor ve sohret adi neredeyse her zaman basligin SONUNDA
duruyor ("...الزهري", "...السبيعي", "...ابن أبي شيبة"). Burada sart
gevsetiliyor: belirtecler basligin herhangi bir yerinde, SIRALI
gecsin. Gevsek sart ata karismasi getirdiginden iki kapi var.

  1. Dugumun yili varsa terceme govdesi onu soylemeli (+-2).
  2. Yil yoksa aday TEK olmali ve dugumun son belirteci basligin da
     son belirteci olmali -- yani sohret adi kuyrukta.

Ikisi de tutmayan adaylar "gozle bak" listesine dusuyor; betik onlari
yazmiyor.
"""
import io, json, os, re, sys
B = os.path.abspath("araclar/terceme")
sys.path.insert(0, B)
from takrib_lib import (nrm, serhi_at, parcala, DUR,
                        vefat_ifadeleri, yil_coz)

KUN = {"ابو", "ابي", "ابا", "ام"}

HAREKE = re.compile("[ً-ْٰـ‌‍]")
BASLIK = re.compile(r"^•\s*(?:([^-]{0,40})-)?\s*(.+?)$")
ROA = re.compile("روى عن")
ham = io.open(os.path.join(B, "metin", "tehzibut.txt"),
              encoding="utf-8").read().split("\n")
satirlar = [i for i, l in enumerate(ham)
            if HAREKE.sub("", l).strip().startswith("•")]
basliklar = []
for i in satirlar:
    d = HAREKE.sub("", ham[i]).strip()
    m = BASLIK.match(d)
    if not m or "تمييز" in d[:60]:
        continue
    an = serhi_at(nrm(m.group(2).rstrip(".")))
    basliklar.append({"satir": i, "ad": m.group(2).strip(),
                      "tok": [w for w in an.split() if w not in DUR and len(w) > 1]})


def govde(k):
    i = basliklar[k]["satir"]
    son = next((j for j in satirlar if j > i), len(ham))
    return HAREKE.sub("", "\n".join(ham[i:son]))


def govdeli(k):
    g = govde(k)
    return len(g) > 300 and bool(ROA.search(g))


def yillari(g):
    out = set()
    for _, _, kuyruk in vefat_ifadeleri(nrm(g)):
        y, acik, bel = yil_coz(kuyruk)
        if y is not None and not bel:
            out.add(y)
            if not acik:
                out.update({y + 100, y + 200})
    return out


def ham_tok(s):
    return [w for w in nrm(s).split() if len(w) > 1]


def sirali(tok, bt):
    j = 0
    for w in tok:
        while j < len(bt) and bt[j] != w:
            j += 1
        if j == len(bt):
            return False
        j += 1
    return True


dug = {d["id"]: d for d in json.load(
    io.open("araclar/dugumler.json", encoding="utf-8"))}
cozulen = {x["id"] for x in json.load(io.open(sys.argv[1], encoding="utf-8"))}
mevcut = json.load(io.open(os.path.join(B, "baslik-elle.json"), encoding="utf-8"))

oneri, gozle, yok = {}, [], 0
for hid, d in dug.items():
    if hid in cozulen or hid in mevcut or hid == "nebi":
        continue
    tok = parcala(d["ar"])
    if len(tok) < 2:
        continue
    ad = [k for k, b in enumerate(basliklar) if sirali(tok, b["tok"])]
    ad = [k for k in ad if govdeli(k)]
    if not ad:
        yok += 1
        continue
    # ILK KAPI: YIL. Gevsek eslesme tek basina cok yanlis uretiyor,
    # cunku bizim ad baskasinin nesebinde ya da tercemesinin icinde
    # gecebiliyor. Yili olmayan dugum burada hic onerilmiyor.
    if d["olum"] is None:
        gozle.append((hid, d["tr"], None,
                      [basliklar[k]["ad"][:90] for k in ad[:4]]))
        continue
    uy = [k for k in ad if any(abs(y - d["olum"]) <= 2 for y in yillari(govde(k)))]
    if len(uy) != 1:
        gozle.append((hid, d["tr"], d["olum"],
                      [basliklar[k]["ad"][:90] for k in ad[:4]]))
        continue
    k = uy[0]
    # IKINCI KAPI: BASLIK BIZIM ADLA BASLAMALI ya da bizim ad KUNYE
    # olmali. Yil tek basina yetmiyor -- terceme baskasinin yilini da
    # aniyor. Kaydettigimiz ad kunye degilse ("كريب مولي ابن عباس",
    # "يعلى بن أمية") ve baslik baska bir sahis adiyla basliyorsa
    # ("محمد بن كريب" = oglu, "صفوان بن يعلى" = oglu) kayit ONUN degil.
    kunye = ham_tok(d["ar"]) and ham_tok(d["ar"])[0] in KUN
    bas_uyar = basliklar[k]["tok"] and basliklar[k]["tok"][0] in tok
    if kunye or bas_uyar:
        oneri[hid] = (basliklar[k]["ad"], "yil+kunye" if kunye else "yil+bas")
    else:
        gozle.append((hid, d["tr"], d["olum"], [basliklar[k]["ad"][:90]]))
        continue
    gozle.append((hid, d["tr"], d["olum"],
                  [basliklar[k]["ad"][:90] for k in ad[:4]]))

print("oneri %d  gozle %d  aday yok %d" % (len(oneri), len(gozle), yok))
io.open(sys.argv[2], "w", encoding="utf-8").write(
    json.dumps({k: v[0] for k, v in oneri.items()}, ensure_ascii=False, indent=1))
for hid, (ad, nic) in list(oneri.items()):
    print("  [%s] %-22s %s" % (nic, hid, ad[:95]))
