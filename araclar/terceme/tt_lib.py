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
BASLIK = re.compile(r"^•?\s*(?:([^-]{0,40})-)?\s*(.+?)$")


def satir_sadelestir(l):
    """Hareke atilmis, onundeki sayfa basligi kirpilmis satir."""
    return SAYFA.sub("", HAREKE.sub("", l).strip()).strip()


"""Bolum basligi: «• من اسمه سماك» gibi, "adi su olanlar" demek.
   Madde isaretini O aliyor ve hemen ardindaki GERCEK terceme basligi
   isaretsiz kaliyor -- Samile'nin disa aktarmasinda 62 terceme boyle.
   Simak b. Harb ile Ebu Salih Zekvan es-Semman bunlardan ikisi, ve
   ikisi de bu yuzden hic cozulemiyordu (2026-09-11).

   Bu, devir notundaki «gizli basliklar» tuzagindan FARKLI bir durum:
   orada sayfa basligi bir sonraki satirin onune yapisiyordu ve cozum
   `SAYFA` regexiyle onu kirpmakti. Burada satirin onunde hicbir sey
   yok, madde isareti bir ust satira gitmis.
"""
BOLUM_BAS = re.compile(r"^•\s*من اسم")
# «خت م 4 - » gibi bir rumuz onekiyle baslayan satir. Rumuzlar kisa,
# 22 karakter tavani gerceklerin hepsini aliyor ve govde cumlelerinin
# icindeki tireleri disarida birakiyor.
RUMUZ_BAS = re.compile(r"^[^-\n]{0,22}-\s*\S")


def basliksa(l, onceki=None):
    """Satir bir terceme basligi mi.

    `onceki` verilirse GIZLI basliklar da taniniyor: bir ust satir
    «من اسمه ...» bolum basligiysa ve bu satir rumuzla basliyorsa,
    madde isareti tasimasa bile basliktir. Cagiranlarin cogu tek
    satira bakiyor ve `onceki` gecmiyor -- onlarin davranisi aynen
    korunuyor, cunku ikinci arguman olmadan eski yol calisiyor.
    """
    s = satir_sadelestir(l)
    if s.startswith("•"):
        return True
    if onceki is not None and BOLUM_BAS.match(satir_sadelestir(onceki)):
        # Bolum basliginin HEMEN ARDI her zaman o bolumun ilk tercemesi.
        # Bir sure burada rumuz onekini de sart kosuyorduk; 67 bolum
        # ardindan 6'si rumuzsuz cikti ve besi gercek baslikti --
        # aralarinda Suhayb b. Sinan er-Rumi de vardi (2026-09-11).
        return bool(s)
    return False


def baslik_satirlari(ham):
    """Baslik satirlarinin indisleri. Gizli basliklar dahil."""
    return [i for i, l in enumerate(ham)
            if basliksa(l, ham[i - 1] if i else None)]


def baslik_coz(l):
    """(rumuz, ad) ya da None."""
    m = BASLIK.match(satir_sadelestir(l))
    if not m:
        return None
    return (m.group(1) or "").strip(), m.group(2).strip()


def temyiz_mi(l):
    return "تمييز" in satir_sadelestir(l)[:60]
