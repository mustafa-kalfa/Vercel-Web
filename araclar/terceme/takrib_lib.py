# -*- coding: utf-8 -*-
"""Takrib duz metni: terceme ayirma, ad esleme, vefat yili cozumleme."""
import io
import re
import unicodedata

TASHKIL = re.compile(r"[ً-ْٰـ‌‍ۖ-ۭ]")


def nrm(s):
    s = unicodedata.normalize("NFKC", s)
    s = TASHKIL.sub("", s)
    s = re.sub(r"[أإآٱ]", "ا", s)
    s = s.replace("ى", "ي").replace("ة", "ه").replace("ؤ", "و").replace("ئ", "ي")
    s = re.sub(r"(?:(?<=\s)|^)ابن(?=\s|$)", "بن", s)
    # RAKAMLAR KORUNUR. Onceden Arapca harf ve bosluk disindaki HER SEY
    # atiliyordu, rakamlar dahil. Takrib yillari cogunlukla kelimeyle
    # yaziyor ama bir kismini rakamla veriyor ("mat sene 197"); o
    # kayitlarda yil sessizce siliniyor, sonra "sayi cozulemedi" deyip
    # eleniyordu. Yanlis cevap uretmedi, yalnizca kapsama kaybettirdi.
    # Hem Latin hem Arap-Hint rakamlari birakiliyor; Python'un \d ve
    # int() ikisini de tanidigi icin ayrica cevirmeye gerek yok.
    s = re.sub(r"[^ء-ي0-9٠-٩ ]", " ", s)
    return re.sub(r"\s+", " ", s).strip()


DUR = {"بن", "ابو", "ابي", "ابا", "مولي"}


def parcala(s):
    return [w for w in nrm(s).split() if w not in DUR and len(w) > 1]


BIRLER = {"احدي": 1, "واحده": 1, "واحد": 1,
          "اثنتين": 2, "اثنين": 2, "ثنتين": 2, "اثنتي": 2, "اثنا": 2,
          "ثلاث": 3, "ثلاثه": 3, "اربع": 4, "اربعه": 4,
          "خمس": 5, "خمسه": 5, "ست": 6, "سته": 6,
          "سبع": 7, "سبعه": 7, "ثمان": 8, "ثماني": 8, "ثمانيه": 8,
          "تسع": 9, "تسعه": 9}
ONLAR = {"عشره": 10, "عشر": 10, "عشرين": 20, "ثلاثين": 30, "اربعين": 40,
         "خمسين": 50, "ستين": 60, "سبعين": 70, "ثمانين": 80, "تسعين": 90}
YUZLER = {"مايه": 100, "مايتين": 200, "مايتان": 200,
          "ثلاثمايه": 300, "اربعمايه": 400}
BELIRSIZ = ("بضع", "نيف", "نحو")

# TAKRIB KENDI TABAKASINI SOYLUYOR ve bu, yuz basamagini tamamlamak icin
# bizim kaba `tab` alanimizdan cok daha keskin bir capa. Asagidaki
# merkezler Takrib'in 12 tabakasinin olum yili agirlik merkezleri.
TAKRIB_TAB = {"الاولي": 1, "الثانيه": 2, "الثالثه": 3, "الرابعه": 4,
              "الخامسه": 5, "السادسه": 6, "السابعه": 7, "الثامنه": 8,
              "التاسعه": 9, "العاشره": 10, "الحاديه عشره": 11,
              "الثانيه عشره": 12}
TAB_MERKEZ = {1: 45, 2: 90, 3: 105, 4: 120, 5: 138, 6: 148, 7: 158,
              8: 172, 9: 195, 10: 225, 11: 247, 12: 268}


def takrib_tabaka(n_metin):
    # Takrib cogu yerde "onuncudan" demiyor, "onuncunun BUYUKLERINDEN"
    # ya da "kucuklerinden" diyor. Bu ek olmadan tabaka hic
    # yakalanmiyor ve yuz basamagi bizim kaba `tab`a dusuyordu --
    # 3. yuzyil ravileri bir yuzyil geriye kayiyordu (Muslim 261 -> 161).
    m = re.search(r"من (?:كبار |صغار |اوساط |وسطي )?(الحاديه عشره|الثانيه عشره|[ا-ي]+ه)", n_metin)
    if not m:
        return None
    return TAKRIB_TAB.get(m.group(1))


def yil_coz(ifade):
    """(deger, yuz_acik_mi, belirsiz_mi)"""
    # RAKAM YALNIZCA BASTA KABUL EDILIR. `ifade` "sene"nin hemen
    # ardindaki kuyruk oldugu icin rakamla yazilmis bir yil buranin en
    # basinda durur. Metnin herhangi bir yerinde rakam aramak felaket:
    # Takrib her tercemenin SONUNA kitap rumuzlarini koyuyor ve "dort
    # Sunen" rumuzu rakamla yaziliyor ("...seksen iki, bh m 4"), yani
    # ayristirici yili birakip rumuzu okuyordu -- kontrol turunda
    # isabet %98'den %61'e dusmus, yanlislarin hepsi 4 cikmisti.
    rk = re.match(r"\s*(\d{1,3})(?!\d)", ifade)
    if rk:
        return int(rk.group(1)), True, False
    kel = ifade.split()
    birim = onluk = yuz = None
    belirsiz = any(k.lstrip("و") in BELIRSIZ for k in kel)
    for k in kel:
        k2 = k.lstrip("و")
        # EN BUYUK yuzler alinir, ilki degil: "on bes, yuz ve IKI YUZ"
        # gibi kayitlarda ilkini almak 215'i 115 yapiyordu.
        if k2 in YUZLER:
            yuz = YUZLER[k2] if yuz is None else max(yuz, YUZLER[k2])
        elif k2 in ONLAR and onluk is None:
            onluk = ONLAR[k2]
        elif k2 in BIRLER and birim is None:
            birim = BIRLER[k2]
    if birim is None and onluk is None and yuz is None:
        return None, False, belirsiz
    taban = (birim or 0) + (onluk or 0)
    if yuz is not None:
        return yuz + taban, True, belirsiz
    return taban, False, belirsiz


VEFAT = re.compile(r"(مات|توفي|قتل|استشهد)\s+"
                   r"(سنه|بعد|قبل|في|حدود)?\s*"
                   r"([^\n]{0,60})")

# YAS IFADESI YILA KARISMASIN. Takrib sik sik "... vefat etti, YUZ otuz
# yasindaydi" diyor; yastaki "mie" (100) yila katilinca 80 olan vefat
# 180 cikiyordu -- kontrol turundaki 38 hatanin sebebi buydu. Kuyruk bu
# belirteclerin ilkinde kesiliyor.
YAS_KES = re.compile(r"\s(وله|وعاش|وهو|وقد|عن)\s")


def vefat_ifadeleri(n_metin):
    out = []
    for m in VEFAT.finditer(n_metin):
        kuyruk = m.group(3)
        kes = YAS_KES.search(kuyruk)
        if kes:
            kuyruk = kuyruk[:kes.start()]
        out.append((m.group(1), m.group(2) or "", kuyruk))
    return out


def tercemeleri_yukle(yol):
    T = []
    for ham in io.open(yol, encoding="utf-8").read().split("\n"):
        m = re.match(r"^[‌\s]*(\d+)\s*-\s*(.+)$", ham.strip())
        if m:
            T.append({"no": int(m.group(1)), "ham": m.group(2),
                      "n": nrm(m.group(2))})
    return T


def esle(tok, TERC):
    """Aday tercemeler, en iyiden kotuye.

    ESLESME TERCEMENIN BASINA CAKILI. Ilk surumde ad parcalarinin
    terceme icinde HERHANGI BIR YERDE gecmesi yetiyordu ve kontrol
    turunda 74 yanlis esleme cikti: Hz. Peygamber mevlasi Sevban'in
    tercemesine, Ali b. Ebi Talib torunu Ali b. el-Huseyin'e, Ebu
    Hureyre "mevla Ebi Hureyre" diyen bir tercemeye dustu -- cunku bir
    ravinin adi baskasinin tercemesinde NISPET olarak gecebiliyor.
    Terceme SAHIBININ adi ise her zaman "NNN- " isaretinden hemen sonra
    basliyor; olcut bu oldu.
    """
    ad = []
    for T in TERC:
        tn = T["n"]
        bas_tok = tn.split()[:12]
        if not bas_tok or not tok or bas_tok[0] != tok[0]:
            continue
        basta = sum(1 for w in tok if w in bas_tok)
        if basta < max(2, len(tok) - 1):
            continue
        vur = sum(1 for w in tok if w in tn)
        ad.append((vur + basta * 1.5, T))
    ad.sort(key=lambda a: -a[0])
    return ad


# ---- TELAFFUZ SERHI ----
# Ibn Hacer ismin HEMEN ORTASINA nasil okunacagini yaziyor:
# "Abis -- muvahhade kesreli, sonra muhmele -- b. Rabia en-Nehai",
# "Humran -- evveli otreli -- b. Eban". Meshur isimler serh istemedigi
# icin kontrol turunda bu hic gorunmedi; tarihsiz 204 ismin 149'u ise
# tam bu yuzden hic aday bulamadi. Serh kelimeleri sabit bir sozluk,
# ad bolgesinden atiliyor.
SERH = set("""بضم بفتح بكسر بسكون بتشديد بتخفيف بتثقيل بضمتين بفتحتين بكسرتين
موحده مهمله معجمه مثناه مثلثه ساكنه مكسوره مفتوحه مضمومه مشدده مخففه
ثقيله خفيفه تحتانيه فوقانيه تحتانيتين مكسورتين مضمومتين مفتوحتان
اوله اولها ثانيه بعدها ثم وسكون وتخفيف وتشديد وفتح وضم وكسر
نون جيم حاء خاء سين شين صاد ضاد طاء ظاء عين غين فاء قاف كاف لام ميم
هاء واو ياء الف باء تاء ثاء دال ذال راء زاي همزه لامين بالتصغير
بنون بجيم بحاء بخاء بسين بشين بصاد بضاد بطاء بظاء بعين بغين بفاء بقاف
بكاف بلام بميم بهاء بواو بياء بالف بباء بتاء بثاء بدال بذال براء بزاي
بمهمله بمعجمه بموحده بمثناه بمثلثه بمهملتين بمعجمتين""".split())


def serhi_at(n_metin):
    return " ".join(w for w in n_metin.split() if w not in SERH)


def altdizi_esle(ad_tok, bol_tok, azami_bosluk=3):
    """ad_tok, bol_tok icinde 0'DAN BASLAYAN sirali bir altdizi mi?
       Aradaki toplam bosluk azami_bosluk'u gecmemeli -- bu sinir,
       'Ali b. Ebi Talib'in torunu 'Ali b. el-Huseyin b. Ali b. Ebi
       Talib'in tercemesine dusmesini onluyor (aradaki bosluk 4)."""
    if not ad_tok or not bol_tok or bol_tok[0] != ad_tok[0]:
        return False
    j = 0
    bosluk = 0
    for w in ad_tok:
        bulundu = -1
        for k in range(j, len(bol_tok)):
            if bol_tok[k] == w:
                bulundu = k
                break
        if bulundu < 0:
            return False
        bosluk += bulundu - j
        if bosluk > azami_bosluk:
            return False
        j = bulundu + 1
    return True
