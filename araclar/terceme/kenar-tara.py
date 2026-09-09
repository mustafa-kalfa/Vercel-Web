# -*- coding: utf-8 -*-
"""Cozulmus baslik listesinden (baslik-cozum.json) eksik kenar cikarir.

Onceki tarayici tercemeyi kendi buluyordu ve yalnizca "tek aday"
verenleri isliyordu; 416 dugum hic acilmamisti. Baslik secimi artik
ayri bir betikte (baslik-coz.py) ve VEFAT YILI capasiyla yapiliyor,
burasi yalnizca cozulmus satiri okuyor.

Kabul olcutleri onceki turla ayni; hepsi gercek yanlislardan dogdu ve
silsile-agi-notlar.md'de yazili.
"""
import io, json, os, re, sys, collections

B = os.path.abspath("araclar/terceme")
sys.path.insert(0, B)
from takrib_lib import nrm, serhi_at, parcala, DUR

HAREKE = re.compile("[ً-ْٰـ‌‍]")
ham = io.open(os.path.join(B, "metin", "tehzibut.txt"),
              encoding="utf-8").read().split("\n")
satirlar = [i for i, l in enumerate(ham)
            if HAREKE.sub("", l).strip().startswith("•")]

AN = re.compile("روى عن(?!ه)")
ANHU = re.compile("(?:روى عنه|وروى عنه|وعنه)")
KES = re.compile("قال |وقال |ذكره |قلت ")
AYRAC = re.compile(r"،\s*(?=و?[؀-ۿ])")
KUN = {"ابو", "ابي", "ابا", "ام"}

dug = {d["id"]: d for d in json.load(
    io.open("araclar/dugumler.json", encoding="utf-8"))}
DN = {i: (d, parcala(d["ar"])) for i, d in dug.items()}
kenar = set()
for e in json.load(io.open(sys.argv[1], encoding="utf-8")):
    kenar.add((e["a"], e["b"]))
    kenar.add((e["b"], e["a"]))


def hamtok(s):
    return [w for w in nrm(s).split() if len(w) > 1]


def tok(s):
    return [w for w in hamtok(s) if w not in DUR]


def aday(kayit):
    """Kayit, dugum adinin KISALTILMISI mi? (tersi degil)"""
    kt = tok(kayit)
    if not kt:
        return []
    out = []
    for d, dt in DN.values():
        if not dt or len(kt) > len(dt):
            continue
        j = 0
        for w in kt:
            while j < len(dt) and dt[j] != w:
                j += 1
            if j == len(dt):
                break
            j += 1
        else:
            out.append((len(kt) / len(dt), d))
    return sorted(out, key=lambda x: -x[0])


def kapi(kayit, hedef):
    """Kisaltilmis eslesmede ek kapilar. Donen deger: sebep ya da None."""
    ht, kt, kh = tok(hedef["ar"]), tok(kayit), hamtok(kayit)
    if not kt or not ht:
        return None
    if len(kt) == len(ht):
        return "tam"
    if kh and kh[0] in KUN:
        hh = hamtok(hedef["ar"])
        for i in range(len(hh) - 1):
            if hh[i] in KUN and hh[i + 1] == kt[0]:
                return "kunye"
        return None
    i = ht.index(kt[0]) if kt[0] in ht else -1
    if 0 <= i <= 1:
        return "bas"
    if nrm(kayit).startswith("بن "):
        return "ibn"
    if len(kt) == 1:
        return "lakap"
    return None


cozum = json.load(io.open(sys.argv[2], encoding="utf-8"))
sayac = collections.Counter()
bulunan, teyit = [], collections.Counter()
for c in cozum:
    d = dug[c["id"]]
    i = c["satir"]
    son = next((j for j in satirlar if j > i), len(ham))
    g = HAREKE.sub("", "\n".join(ham[i:son]))
    m1 = AN.search(g)
    if not m1:
        sayac["listesiz"] += 1
        continue
    a = m1.end()
    m2 = ANHU.search(g[a:])
    hoca_m = g[a:a + m2.start()] if m2 else g[a:a + 1200]
    kal = g[a + m2.end():] if m2 else ""
    k = KES.search(kal)
    talebe_m = kal[:k.start()] if k else kal[:1600]
    sayac["islendi"] += 1
    for taraf, metin in (("hoca", hoca_m), ("talebe", talebe_m)):
        for kayit in AYRAC.split(metin):
            kayit = kayit.strip().lstrip("و").strip()
            if not kayit or len(kayit) > 90:
                continue
            uygun = []
            for _, o in aday(kayit):
                if o["id"] == d["id"]:
                    continue
                h, t = ((o["id"], d["id"]) if taraf == "hoca"
                        else (d["id"], o["id"]))
                yh, yt = dug[h]["olum"], dug[t]["olum"]
                if yh is not None and yt is not None and (yt < yh - 60 or yt > yh + 100):
                    continue
                uygun.append((h, t, o))
            if len(uygun) != 1:
                sayac["belirsiz/bos"] += 1
                continue
            h, t, o = uygun[0]
            sb = kapi(kayit, o)
            if not sb:
                sayac["kapi elemesi"] += 1
                continue
            # Kisa eslesmede iki tarafin da yili olmali
            if sb not in ("tam", "bas") and (dug[h]["olum"] is None or dug[t]["olum"] is None):
                sayac["kisa+yilsiz"] += 1
                continue
            if (h, t) in kenar:
                sayac["zaten var"] += 1
                teyit[d["id"]] += 1
                continue
            bulunan.append({"a": h, "b": t, "ozne": d["id"], "taraf": taraf,
                            "kayit": kayit[:70], "sebep": sb})
            kenar.add((h, t))
            kenar.add((t, h))

for x in bulunan:
    x["teyit"] = teyit[x["ozne"]]
io.open(sys.argv[3], "w", encoding="utf-8").write(
    json.dumps(bulunan, ensure_ascii=False, indent=1))
for a, b in sayac.most_common():
    print("%-16s %d" % (a, b))
print("ADAY: %d  (teyitli: %d)" % (len(bulunan),
                                   sum(1 for x in bulunan if x["teyit"] > 0)))
