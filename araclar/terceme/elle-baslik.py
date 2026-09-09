# -*- coding: utf-8 -*-
"""Baslik cozucunun ulasamadigi dugumlerde basligi ELLE sabitler.

Ibn Hacer muhtasarinda gercek tercemelerin yaninda KISA ISARET
kayitlari da var: "Osman b. Ebi Seybe, Osman b. Muhammed'de gelecek",
"Ebu Hatim er-Razi, o Muhammed b. Idris el-Hanzali'dir" gibi. Bunlar
ayni adla basladigi ve KISA oldugu icin cozucunun "en kisa baslik"
tercihini kaziniyor, sonuc hoca/talebe listesi olmayan bos bir govde.
Boyle dugumlerde dogru baslik gozle secilip buraya yaziliyor.
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
for parca in sys.argv[1:]:
    ad, kalip = parca.split("=", 1)
    i = next((k for k in satirlar if kalip in HAREKE.sub("", ham[k])), None)
    if i is None:
        print("BULUNAMADI: " + ad)
        continue
    son = next((j for j in satirlar if j > i), len(ham))
    g = HAREKE.sub("", "\n".join(ham[i:son]))
    m = KES.search(g)
    print("=" * 70)
    print(ad + "  (satir %d)" % i)
    print(g[:m.start() if m else 300][:320].replace("\n", " | "))
    print("-- degerlendirme --")
    print((g[m.start():] if m else "")[:2400].replace("\n", " | "))
    print()
