# -*- coding: utf-8 -*-
"""Samile'den .htm olarak disari aktarilmis kitaplari duz metne cevirir.

Kullanim (my-app icinden):
    python araclar/terceme/metne-cevir.py takrib "<takrib.htm yolu>"
    python araclar/terceme/metne-cevir.py tehzib "<35 ciltlik klasorun yolu>"

Cikti araclar/terceme/metin/ altina yaziliyor. O klasor .gitignore'da:
metinler kullanicinin kendi Samile kutuphanesinden geliyor, 2 MB ve
45 MB tutuyor ve depoya girmemeleri gerekiyor. Kaynak dosyalarin nerede
durdugu OKUBENI.md'de yazili.
"""
import glob
import html
import io
import os
import re
import sys

BURASI = os.path.dirname(os.path.abspath(__file__))
CIKTI = os.path.join(BURASI, "metin")


def htm_to_metin(yol):
    t = open(yol, "rb").read().decode("utf-8", "replace")
    t = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", t)
    t = re.sub(r"(?i)<br\s*/?>", "\n", t)
    t = re.sub(r"(?i)</p>", "\n", t)
    t = re.sub(r"(?s)<[^>]+>", "", t)
    t = html.unescape(t)
    t = re.sub(r"[ \t ]+", " ", t)
    return re.sub(r"\n{3,}", "\n\n", t)


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 1
    ad, kaynak = sys.argv[1], sys.argv[2]
    if os.path.isdir(kaynak):
        dosyalar = sorted(glob.glob(os.path.join(kaynak, "*.htm")))
    else:
        dosyalar = [kaynak]
    if not dosyalar:
        print("kaynak bulunamadi:", kaynak)
        return 1
    os.makedirs(CIKTI, exist_ok=True)
    metin = "\n".join(htm_to_metin(f) for f in dosyalar)
    hedef = os.path.join(CIKTI, ad + ".txt")
    io.open(hedef, "w", encoding="utf-8").write(metin)
    print("%s  <- %d dosya, %d karakter" % (hedef, len(dosyalar), len(metin)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
