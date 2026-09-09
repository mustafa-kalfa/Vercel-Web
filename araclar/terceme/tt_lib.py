# -*- coding: utf-8 -*-
"""Tehzibu't-Tehzib duz metninin ortak okuma katmani.

Tek isi var: BASLIK SATIRINI DOGRU TANIMAK. Betiklerin hepsi bunu
kendi basina yapiyordu ve hepsi ayni seyi kaciriyordu.

Metinde her terceme «• <rumuz> - <tam neseb>.» satiriyla aciliyor.
Ama Samile'nin disa aktarmasi sayfa basligini
(«تهذيب التهذيب - ط الرسالة - ج 3(ص: 471)») bazen ayri satira degil,
bir sonraki satirin ONUNE yapistiriyor. O zaman satir «•» ile
BASLAMIYOR ve baslik gorunmez oluyor. Boyle 180 terceme vardi ve
aralarinda Ka'b el-Ahbar gibi isimler bulunuyordu; "Samile'nin
kaybettigi baslik" sanilan seyin bir kismi buydu.
"""
import re

HAREKE = re.compile("[ً-ْٰـ‌‍]")
SAYFA = re.compile(r"^تهذيب التهذيب[^•\n]{0,60}?\(ص:\s*\d+\)\s*")
BASLIK = re.compile(r"^•\s*(?:([^-]{0,40})-)?\s*(.+?)$")


def satir_sadelestir(l):
    """Hareke atilmis, onundeki sayfa basligi kirpilmis satir."""
    return SAYFA.sub("", HAREKE.sub("", l).strip()).strip()


def basliksa(l):
    return satir_sadelestir(l).startswith("•")


def baslik_satirlari(ham):
    """Baslik satirlarinin indisleri."""
    return [i for i, l in enumerate(ham) if basliksa(l)]


def baslik_coz(l):
    """(rumuz, ad) ya da None."""
    m = BASLIK.match(satir_sadelestir(l))
    if not m:
        return None
    return (m.group(1) or "").strip(), m.group(2).strip()


def temyiz_mi(l):
    return "تمييز" in satir_sadelestir(l)[:60]
