# -*- coding: utf-8 -*-
"""Cozulmus tercemenin GOVDESINI okur (bilgi karti yazmak icin).

Hoca/talebe listeleri atlanip degerlendirme kismi veriliyor: kart
metni cerh-ta'dil nakillerinden ve vefat kaydindan yaziliyor, isim
listesinden degil.
"""
import io, json, os, re, sys
B = os.path.abspath("araclar/terceme")
sys.path.insert(0, B)
from tt_lib import basliksa, satir_sadelestir
HAREKE = re.compile("[ً-ْٰـ‌‍]")
ham = io.open(os.path.join(B, "metin", "tehzibut.txt"),
              encoding="utf-8").read().split("\n")
satirlar = [i for i, l in enumerate(ham)
            if basliksa(l)]
KES = re.compile("قال |وقال |ذكره |قلت |روى له ")
liste = json.load(io.open(sys.argv[1], encoding="utf-8"))
istenen = set(sys.argv[2].split(","))
for x in liste:
    if x["id"] not in istenen:
        continue
    i = x["satir"]
    son = next((j for j in satirlar if j > i), len(ham))
    g = HAREKE.sub("", "\n".join(ham[i:son]))
    m = KES.search(g)
    bas = g[:m.start()] if m else g
    kalan = g[m.start():] if m else ""
    print("=" * 70)
    print("%s | %s | tab%s | %s | o.%s | derece %s" %
          (x["id"], x["tr"], x["tab"], x["belde"], x["olum"], x["derece"]))
    print("-- baslik/liste --")
    print(bas[:400].replace("\n", " | "))
    print("-- degerlendirme --")
    print(kalan[:2600].replace("\n", " | "))
    print()
