# -*- coding: utf-8 -*-
"""Tehzibu'l-Kemal duz metni: terceme ayirma ve vefat cumlesi cikarma.

TAKRIB'DEN YAPISAL FARK. Takrib'de terceme tek satir ve icindeki tek
vefat kaydi ravinin kendisinindir. Tehzib'de terceme sayfalarca surer
ve icinde BASKALARININ vefat kayitlari da gecer -- hocalarin,
talebelerin, nakli yapan alimlerin. Bu yuzden "ilk 'mate sene'yi al"
kurali burada dogrudan yanlis sonuc verir.

Mizzi vefat kaydini tercemenin SONUNA, cerh-ta'dil nakillerinden sonra
koyuyor. Burada da cumleler tercemenin son bolumunden toplaniyor ve
OTOMATIK YAZILMIYOR: amac kaydi bulup gostermek, karari insana
birakmak.
"""
import io
import re

from takrib_lib import nrm  # ayni normallestirme

# "229- بخ م 4:  İbrahim b. Muhammed..." -- numaradan sonra, iki
# noktadan once kitap rumuzlari duruyor; ad ondan sonra basliyor.
BASLIK = re.compile(r"^[‌\s]*(\d{1,5})\s*-\s*(.*)$")


def tercemeleri_yukle(yol):
    """Terceme basliklarini ayirir.

    NUMARA ARTANLIGI SART. ZWNJ + "NNN-" kalibina 7267 satir uyuyor ama
    numaralari 1..8798 arasinda ve ARTAN DEGIL: araya muhakkikin dipnot
    numaralari karisiyor ve onlar her sayfada 1'den yeniden basliyor.
    Mizzi'nin tercemeleri ise bastan sona sirali (son kayit 8045, kitabin
    bilinen toplami). Bu yuzden baslik ancak numarasi bir oncekinden
    BUYUKSE kabul ediliyor; ustteki kucuk siniri asan sicramalar da
    (yeni cilde gecerken degil, dipnotta) eleniyor.
    """
    ham = io.open(yol, encoding="utf-8").read().split("\n")
    aday = []
    for i, satir in enumerate(ham):
        m = BASLIK.match(satir.strip("﻿").strip())
        if not m:
            continue
        kalan = m.group(2)
        # rumuz kismi: ilk iki noktaya kadar kisa bir parca ise atilir
        p = kalan.find(":")
        ad = kalan[p + 1:].strip() if 0 <= p <= 25 else kalan
        aday.append((i, int(m.group(1)), ad))

    # EN UZUN ARTAN ALTDIZI. Basitce "numara oncekinden buyuk olsun"
    # demek yetmiyor: mukaddimenin dipnotlari dosyanin BASINDA 1'den
    # basliyor, sayac onlara kilitlenip gercek tercemeleri eliyordu
    # (349 terceme, tek govde 21 milyon karakter). Dipnotlar her sayfada
    # 1'e dondugu icin uzun bir artan zincir kuramaz; kitabin kendi
    # numaralandirmasi (1..8045) kurar. O yuzden zinciri secmek dogru.
    n = len(aday)
    kuyruk, onceki, kuyruk_i = [], [-1] * n, []
    import bisect
    for k in range(n):
        v = aday[k][1]
        j = bisect.bisect_left(kuyruk, v)
        if j == len(kuyruk):
            kuyruk.append(v)
            kuyruk_i.append(k)
        else:
            kuyruk[j] = v
            kuyruk_i[j] = k
        onceki[k] = kuyruk_i[j - 1] if j > 0 else -1
    secili = []
    k = kuyruk_i[-1] if kuyruk_i else -1
    while k >= 0:
        secili.append(k)
        k = onceki[k]
    basliklar = [aday[k] for k in reversed(secili)]
    T = []
    for k, (i, no, ad) in enumerate(basliklar):
        son = basliklar[k + 1][0] if k + 1 < len(basliklar) else len(ham)
        govde = "\n".join(ham[i:son])
        T.append({"no": no, "ad": ad, "n": nrm(ad), "govde": govde,
                  "ngovde": nrm(govde)})
    return T


# Vefat cumlesi: "mate" / "tuvuffiye" / "kutile" gecen ve icinde bir yil
# sozcugu bulunan parca.
FIIL = "مات|توفي|قتل|استشهد"
SENE = "سنه"        # "sene"
VEFAT = re.compile("(?:%s)[^.]{0,90}" % FIIL)


def vefat_cumleleri(ngovde, son_oran=0.45):
    """Tercemenin SON bolumundeki vefat cumleleri.

    son_oran: govdenin sondan bu kadarlik dilimine bakilir. Mizzi
    vefat kaydini sona koydugu icin bu dilim hem dogru kaydi yakaliyor
    hem de metnin basindaki hoca/talebe listelerinde gecen baska
    kisilerin vefat yillarini disarida birakiyor.
    """
    bas = int(len(ngovde) * (1 - son_oran))
    dilim = ngovde[bas:]
    out = []
    for m in VEFAT.finditer(dilim):
        c = m.group(0).strip()
        if SENE in c:
            out.append(c)
    return out
