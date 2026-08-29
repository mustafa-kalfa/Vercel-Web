"use client";

/* SILSILE AGI GORSELLESTIRMESI. Bu dosya bir artifact'ten OLDUGU GIBI
   alindi; icerigi hala hizla degistigi icin site tarafinda elle yapilan
   degisiklikler EN AZDA tutuluyor. Yeni surum gelince dosyanin ustune
   yazip yalnizca asagidaki uc noktayi tekrar uygulamak yetiyor:

   1) Bu "use client" satiri. App Router'da bir dosya varsayilan olarak
      SUNUCU bileseni; useState/useEffect ve fare olaylari orada
      calismaz. Artifact tarayicida durdugu icin bunu bilmiyor.
   2) Kok div'de `h-screen` DEGIL `h-full`. Artifact tek basina bir
      sayfaydi, tam ekran kapliyordu; burada ustunde site basligi
      (HD logosu, tema/dil dugmeleri) var. `h-full` ile kapsayicinin
      -- yani /ag-sinamasi sayfasinin ona ayirdigi yerin -- boyunu
      aliyor, yoksa o basligin yuksekligi kadar tasip footer'i
      asagi itiyor.
   3) `.jsx` uzanti, `.tsx` DEGIL. Proje TypeScript ama tsconfig'in
      `include` listesi yalnizca .ts/.tsx tariyor, yani bu dosya tip
      denetiminden gecmiyor -- Next.js `allowJs` ile derliyor.
      Artifact tip bilgisi tasimadigi icin (`useState(null)` gibi)
      .tsx yapmak her surumde bastan tip yazmak demek olurdu.
      Gorsellestirme oturdugunda .tsx'e cevrilebilir. */

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";

/* ==================================================================
   SİLSİLE AĞI — v3
   Dikey eksen: vefat yılı (hicrî), yukarıdan aşağı. Yatay: belde sütunları.
   Kaynak: Mizzî, Tehzîbü'l-Kemâl (Şâmile 3722), terceme 4089 ve 7681.
   Tabaka tasnifi: İbn Hacer, Takrîbü't-Tehzîb (8609).
================================================================== */

const TAB = {
  0: { ad: "Kaynak" },
  1: { ad: "Sahâbe" },
  2: { ad: "Kibâr-ı tâbiîn" },
  3: { ad: "Vustâ" },
  4: { ad: "Sigār-ı tâbiîn" },
  5: { ad: "Etbâu't-tâbiîn" },
};

// Râvi noktaları için canlı palet. Renk anlam taşımaz, ayırt etmeye yarar.
const PALET = [
  "#E14D2A", "#2A9D8F", "#F4A261", "#6A4C93", "#0FA3B1", "#D7263D",
  "#3D5A80", "#EE9B00", "#8AB17D", "#C2185B", "#1B998B", "#F26419",
  "#5F0F40", "#00A6A6", "#BC4B51", "#4361EE", "#7B9E3F", "#FF7B9C",
  "#118AB2", "#E4572E", "#2D6A4F", "#9D4EDD", "#F72585", "#06A77D",
];
const NEBI_RENK = "#49C6A6";   // turkuaza çalan açık yeşil

// salınım süresi/gecikmesi için sabit sözde-rastgele sayı
const salSayi = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 37 + id.charCodeAt(i)) >>> 0;
  return h;
};

const renkOf = (id) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALET[h % PALET.length];
};

// Kaynakta vefat yılı verilmeyen râviler için yerleşim değeri.
// Kaynağa dayanmaz, yalnız râviyi tabakasının tipik aralığının ortasına koyar.
const TAHMIN = { 0: 11, 1: 55, 2: 90, 3: 105, 4: 135, 5: 175 };

// DİA'dan alınan hicrî/milâdî vefat yılları (madde tanıtım cümlelerinden)
const DIA = {"ali": [40, "661"], "ebuhureyre": [58, "678"], "ebubekir": [13, "634"], "omer": [23, "644"], "aise": [58, "678"], "enes": [93, "711"], "cabir": [78, "697"], "ibnabbas": [68, "687"], "ibnomer": [73, "693"], "ibnmesud": [32, "652"], "ibnzubeyr": [73, "692"], "bera": [71, "690"], "zeydarkam": [68, "688"], "suhayb": [38, "659"], "hasanbali": [49, "669"], "huseyn": [61, "680"], "ibncafer": [80, "699"], "mikdad": [33, "653"], "fatima": [11, "632"], "ubey": [33, "654"], "usame": [54, "674"], "kabahbar": [32, "652"], "ahnef": [67, "686"], "esvedyezid": [75, "694"], "alkame": [62, "682"], "suveydgafle": [80, "699"], "ebuvail": [82, "701"], "zirhubeys": [82, "701"], "saidmusayyeb": [94, "713"], "hasanbasri": [110, "728"], "rebihiras": [101, "719"], "zeydvehb": [83, "702"], "ebutufeyl": [100, "718"], "sabi": [104, "722"], "urve": [94, "713"], "ikrime": [105, "723"], "zeynelabidin": [94, "712"], "zeydeslem": [136, "754"], "salimibnomer": [106, "725"], "amrhurays": [85, "704"], "zeydsabit": [45, "665"], "kayshazim": [97, "715"], "abdrahmanebubekir": [53, "673"], "abdrahmanavf": [32, "652"], "osman": [35, "656"], "ukbeamir": [58, "678"], "ebumusa": [42, "662"], "ebusaid": [74, "693"], "huzeyfe": [36, "656"], "ebusalih": [101, "719"], "esaskays": [40, "661"], "cerirbecelî": [51, "671"], "sadvakkas": [55, "675"], "talha": [36, "656"], "asimomer": [70, "689"], "ebanosman": [105, "723"], "ibnhanefiyye": [81, "700"], "ataebirebah": [114, "732"], "ubeydullahadi": [58, "678"], "abdrahmanyezid": [198, "813"], "ebuabdrahmansulemi": [73, "692"], "selemeekva": [74, "693"], "imranhusayn": [52, "672"], "mugirasube": [50, "670"], "abdrahmanabza": [70, "689"], "amrdinar": [126, "744"], "ebuishaksebii": [127, "745"], "amess": [148, "765"], "malik": [179, "795"], "ibncureyc": [150, "767"], "ibnuyeyne": [198, "814"], "hammadseleme": [167, "784"], "mamer": [153, "770"], "sevri": [161, "778"], "evzai": [157, "774"], "huseym": [183, "799"], "yahyaadem": [203, "818"], "kattan": [198, "813"], "ibnmehdi": [198, "813"], "rafihadic": [73, "692"], "eyyubsahtiyani": [131, "749"], "haccacertat": [145, "762"], "ebulaliye": [90, "709"], "ibrahimteymi": [92, "710"], "hafsgiyas": [194, "810"], "leysbsad": [175, "791"], "ibnidris": [192, "807"], "alimushir": [189, "805"], "saidcubeyr": [94, "713"], "tavus": [106, "725"], "mucahid": [103, "721"], "suleymanyesar": [107, "725"], "vehbmunebbih": [114, "732"], "hammadzeyd": [179, "795"], "numanbesir": [64, "684"], "zuhayrmuaviye": [173, "789"], "temimdari": [40, "661"], "bilal": [20, "641"], "amirrebia": [35, "656"], "sabitbunani": [127, "744"], "dahhak": [105, "723"], "ebukilabe": [104, "722"], "yahyasaidensari": [143, "760"], "katade": [117, "735"], "yahyaebikesir": [129, "747"], "ibnishak": [151, "768"], "ibnebiaruba": [156, "773"], "ebuavane": [176, "792"], "sube": [160, "776"], "veki": [197, "812"], "ibnmubarek": [181, "797"], "cerirabdulhamid": [188, "804"], "ebucafermuhbakir": [114, "733"], "ebuselemeavf": [94, "712"], "mesruk": [63, "683"], "amrmeymun": [74, "693"], "hamzazeyyat": [156, "773"], "halidvelid": [21, "642"], "bureyde": [63, "682"], "hafsa": [45, "665"], "ibnebimuleyke": [117, "735"], "ebunadra": [108, "726"], "haricezeyd": [100, "718"], "ubeydullahutbe": [98, "716"], "arac": [117, "735"], "ibrahimsad": [183, "799"], "suaybebihamza": [162, "779"], "ibnsihab": [124, "742"], "hisamdestuvai": [153, "770"], "misersukdam": [155, "772"], "suleymanteymi": [143, "761"], "serikkadi": [177, "794"], "sureyh": [80, "699"], "ibnebizaide": [182, "798"], "nebi": [11, "632"]};

const N = (id, ar, tr, tab, olum, belde, not) => {
  const d = DIA[id];
  return { id, ar, tr, tab, olum: d ? d[0] : olum, mil: d ? d[1] : null, belde, not };
};
// "ö. 40/661", "ö. 83/?" veya "ö. ?/?"
const tarihYaz = (n) => `ö. ${n.olum ?? "?"}/${n.mil ?? "?"}`;

const NODES = [
  N("nebi", "النبي صلى الله عليه وسلم", "Hz. Peygamber", 0, 11, "Medine", "Bütün rivayetin kaynağı. Tehzîb tercemelerinde sahâbenin hocası olarak «روى عن النبي ﷺ» kaydıyla geçer."),
  N("ali", "علي بن أبي طالب", "Ali b. Ebî Tâlib", 1, 40, "Kûfe", "Tehzîb terceme 4089, rumûz ع. Tercemesi 18 sayfa, ilk 3 sayfası işlendi."),
  N("ebuhureyre", "أبو هريرة الدوسي", "Ebû Hüreyre", 1, 57, "Medine", "Tehzîb terceme 7681. Sahâbenin hâfızı."),
  N("ebubekir", "أبو بكر الصديق", "Ebû Bekir es-Sıddîk", 1, 13, "Medine", "Tehzîb'de «عبد الله بن عثمان وهو أبو قحافة» adıyla, bâbü'l-ayn içinde. Şu an yalnız hoca konumunda."),
  N("omer", "عمر بن الخطاب", "Ömer b. el-Hattâb", 1, 23, "Medine"),
  N("mikdad", "المقداد بن الأسود", "Mikdâd b. el-Esved", 1, 33, "Medine"),
  N("fatima", "فاطمة بنت رسول الله", "Fâtıma bint Resûlillâh", 1, 11, "Medine", "Mizzî, Hz. Ali’nin hocaları arasında zevcesi olarak zikreder. Kendi tercemesi Kitâbü’n-nisâ’da, henüz işlenmedi."),
  N("ubey", "أبي بن كعب", "Übey b. Kâ‘b", 1, 30, "Medine"),
  N("usame", "أسامة بن زيد", "Üsâme b. Zeyd", 1, 54, "Medine"),
  N("basra", "بصرة بن أبي بصرة الغفاري", "Basra b. Ebû Basra el-Gıfârî", 1, null, "Mısır"),
  N("fadl", "الفضل بن العباس", "Fazl b. Abbâs", 1, 18, "Medine"),
  N("kabahbar", "كعب الأحبار", "Kâ‘bü'l-ahbâr", 1, 32, "Humus"),
  N("aise", "عائشة أم المؤمنين", "Âişe bint Ebî Bekir", 1, 58, "Medine"),
  N("enes", "أنس بن مالك", "Enes b. Mâlik", 1, 93, "Basra"),
  N("cabir", "جابر بن عبد الله", "Câbir b. Abdullah", 1, 78, "Medine"),
  N("ibnabbas", "عبد الله بن عباس", "Abdullah b. Abbâs", 1, 68, "Mekke"),
  N("ibnomer", "عبد الله بن عمر", "Abdullah b. Ömer", 1, 73, "Medine"),
  N("ibnmesud", "عبد الله بن مسعود", "Abdullah b. Mes‘ûd", 1, 32, "Kûfe", "Mizzî onu Ali'nin talebeleri arasında sayarken «ومات قبله» kaydını düşer. Rivayet yönü tartışmalı."),
  N("ibnzubeyr", "عبد الله بن الزبير", "Abdullah b. ez-Zübeyr", 1, 73, "Mekke"),
  N("bera", "البراء بن عازب", "Berâ b. Âzib", 1, 72, "Kûfe"),
  N("zeydarkam", "زيد بن أرقم", "Zeyd b. Erkam", 1, 68, "Kûfe"),
  N("cabirsemura", "جابر بن سمرة", "Câbir b. Semüre", 1, 74, "Kûfe"),
  N("suhayb", "صهيب بن سنان الرومي", "Suheyb b. Sinân er-Rûmî", 1, 38, "Medine"),
  N("sefine", "سفينة مولى رسول الله", "Sefîne mevlâ Resûlillâh", 1, null, "Medine"),
  N("hasanbali", "الحسن بن علي", "Hasan b. Ali", 1, 50, "Medine"),
  N("huseyn", "الحسين بن علي", "Hüseyin b. Ali", 1, 61, "Medine"),
  N("amrhurays", "عمرو بن حريث المخزومي", "Amr b. Hurays", 1, 85, "Kûfe"),
  N("tariksihab", "طارق بن شهاب الأحمسي", "Târık b. Şihâb el-Ahmesî", 1, 83, "Kûfe"),
  N("besrsuhaym", "بشر بن سحيم الغفاري", "Bişr b. Süheym el-Gıfârî", 1, null, "Medine"),
  N("ibncafer", "عبد الله بن جعفر", "Abdullah b. Ca‘fer", 1, 80, "Medine"),

  N("ahnef", "الأحنف بن قيس", "Ahnef b. Kays", 2, 72, "Basra"),
  N("esvedyezid", "الأسود بن يزيد النخعي", "Esved b. Yezîd en-Nehaî", 2, 75, "Kûfe"),
  N("alkame", "علقمة بن قيس النخعي", "Alkame b. Kays en-Nehaî", 2, 62, "Kûfe", "Kûfe fıkıh ekolünün temel halkası."),
  N("ubeydesel", "عبيدة السلماني", "Ubeyde es-Selmânî", 2, 72, "Kûfe"),
  N("suveydgafle", "سويد بن غفلة الجعفي", "Süveyd b. Gafele", 2, 80, "Kûfe"),
  N("ebuvail", "أبو وائل شقيق بن سلمة", "Ebû Vâil Şakīk b. Seleme", 2, 82, "Kûfe"),
  N("zirhubeys", "زر بن حبيش الأسدي", "Zir b. Hubeyş el-Esedî", 2, 82, "Kûfe"),
  N("sureyh", "شريح بن الحارث القاضي", "Şüreyh b. el-Hâris el-Kādî", 2, 78, "Kûfe"),
  N("saidmusayyeb", "سعيد بن المسيب", "Saîd b. el-Müseyyeb", 2, 94, "Medine", "Hem Ali'den hem Ebû Hüreyre'den rivayeti var."),
  N("hasanbasri", "الحسن البصري", "Hasan-ı Basrî", 2, 110, "Basra", "İki merkezden de rivayeti var. Ali'den ت س, Ebû Hüreyre'den خ ٤."),
  N("rebihiras", "ربعي بن حراش", "Rib‘î b. Hırâş", 2, 100, "Kûfe"),
  N("zeydvehb", "زيد بن وهب الجهني", "Zeyd b. Vehb el-Cühenî", 2, 96, "Kûfe"),
  N("zadan", "زاذان أبو عمر الكندي", "Zâzân Ebû Ömer el-Kindî", 2, 82, "Kûfe"),
  N("ebutufeyl", "أبو الطفيل عامر بن واثلة", "Ebü't-Tufeyl Âmir b. Vâsile", 2, 110, "Mekke", "Son vefat eden sahâbî sayılır, tabakası ihtilâflı."),
  N("harissuveyd", "الحارث بن سويد التيمي", "Hâris b. Süveyd et-Teymî", 2, 72, "Kûfe"),
  N("harisemudarrib", "حارثة بن مضرب", "Hârise b. Mudarrib", 2, null, "Kûfe"),
  N("salimcad", "سالم بن أبي الجعد", "Sâlim b. Ebü'l-Ca‘d", 2, 100, "Kûfe", "Mizzî: Ali'ye yetişmedi («ولم يدركه»)."),
  N("hayseme", "خيثمة بن عبد الرحمن", "Hayseme b. Abdurrahman", 2, 80, "Kûfe"),
  N("ibrhunayn", "إبراهيم بن عبد الله بن حنين", "İbrâhim b. Abdillâh b. Huneyn", 2, null, "Medine", "Ali'den rivayeti mürseldir."),
  N("abdhayr", "عبد خير بن يزيد الهمداني", "Abd-i Hayr el-Hemdânî", 2, null, "Kûfe"),
  N("harisaver", "الحارث الأعور الهمداني", "Hâris el-A‘ver el-Hemdânî", 2, 65, "Kûfe", "Cerh açısından tartışmalı, Ali rivayetlerinin yoğun râvisi."),
  N("asimdamra", "عاصم بن ضمرة السلولي", "Âsım b. Damra es-Selûlî", 2, 74, "Kûfe"),
  N("salimibnomer", "سالم بن عبد الله بن عمر", "Sâlim b. Abdillâh b. Ömer", 2, 106, "Medine"),
  N("humeydavf", "حميد بن عبد الرحمن بن عوف", "Humeyd b. Abdirrahman b. Avf", 2, 95, "Medine"),
  N("hafsasim", "حفص بن عاصم بن عمر", "Hafs b. Âsım b. Ömer", 2, null, "Medine"),
  N("zurareevfa", "زرارة بن أوفى", "Zürâre b. Evfâ", 2, 93, "Basra"),
  N("busrsaid", "بسر بن سعيد", "Büsr b. Saîd", 2, 100, "Medine"),
  N("besirnehik", "بشير بن نهيك", "Beşîr b. Nehîk", 2, null, "Basra"),
  N("esvedhilal", "الأسود بن هلال المحاربي", "Esved b. Hilâl el-Muhâribî", 2, null, "Kûfe"),
  N("hilas", "خلاس الهجري", "Hılâs el-Hecerî", 2, null, "Basra"),
  N("bece", "بعجة بن عبد الله الجهني", "Ba‘ce b. Abdillâh el-Cühenî", 2, 100, "Medine"),

  N("sabi", "عامر بن شراحيل الشعبي", "Âmir b. Şerâhîl eş-Şa‘bî", 3, 104, "Kûfe"),
  N("ibnebileyla", "عبد الرحمن بن أبي ليلى", "Abdurrahman b. Ebî Leylâ", 3, 83, "Kûfe"),
  N("urve", "عروة بن الزبير", "Urve b. ez-Zübeyr", 3, 94, "Medine", "Zührî'nin başlıca hocası. Ağ genişleyince Zührî halkasının bağlantı noktası olacak."),
  N("ikrime", "عكرمة مولى ابن عباس", "İkrime mevlâ İbn Abbâs", 3, 105, "Medine"),
  N("zeynelabidin", "علي بن الحسين", "Ali b. el-Hüseyin (Zeynelâbidîn)", 3, 94, "Medine", "Ali'den rivayeti mürseldir."),
  N("ubeydullaherafi", "عبيد الله بن أبي رافع", "Ubeydullah b. Ebî Râfi‘", 3, null, "Medine", "Hz. Ali'nin kâtibi («وكان كاتبه»)."),
  N("umerbali", "عمر بن علي بن أبي طالب", "Ömer b. Ali b. Ebî Tâlib", 3, 77, "Medine"),
  N("abdrahmanharis", "عبد الرحمن بن الحارث بن هشام", "Abdurrahman b. el-Hâris", 3, null, "Medine"),
  N("ubeydumeyr", "عبيد بن عمير الليثي", "Ubeyd b. Umeyr el-Leysî", 3, 74, "Mekke"),
  N("saidzuhadan", "سعيد بن ذي حدان", "Saîd b. Zî Hudân", 3, null, "Kûfe"),

  N("zeydsabit", "زيد بن ثابت", "Zeyd b. Sâbit", 1, 45, "Medine", "Ebû Bekir'den rivayeti رمز خ ت س."),
  N("kayshazim", "قيس بن أبي حازم", "Kays b. Ebû Hâzim", 2, 97, "Kûfe"),
  N("abdrahmanebubekir", "عبد الرحمن بن أبي بكر", "Abdurrahman b. Ebî Bekir", 1, 53, "Medine", "Hz. Ebû Bekir'in oğlu."),
  N("abdrahmanavf", "عبد الرحمن بن عوف", "Abdurrahman b. Avf", 1, 32, "Medine"),
  N("osman", "عثمان بن عفان", "Osman b. Affân", 1, 35, "Medine"),
  N("ukbeamir", "عقبة بن عامر الجهني", "Ukbe b. Âmir el-Cühenî", 1, 58, "Mısır"),
  N("ebumusa", "أبو موسى الأشعري", "Ebû Mûsâ el-Eş‘arî", 1, 42, "Kûfe"),
  N("ebusaid", "أبو سعيد الخدري", "Ebû Saîd el-Hudrî", 1, 74, "Medine"),
  N("huzeyfe", "حذيفة بن اليمان", "Huzeyfe b. el-Yemân", 1, 36, "Kûfe"),
  N("ebusalih", "أبو صالح ذكوان السمان", "Ebû Sâlih Zekvân es-Semmân", 2, 101, "Medine", "Mizzî: Ebû Bekir'e yetişmedi («ولم يدركه»)."),
  N("rifaazuraki", "رفاعة بن رافع الزرقي", "Rifâa b. Râfi‘ ez-Zürakī", 1, null, "Medine"),
  N("aizamr", "عائذ بن عمرو المزني", "Âiz b. Amr el-Müzenî", 1, null, "Basra"),
  N("murreserahil", "مرة بن شراحيل", "Mürre b. Şerâhîl", 2, null, "Kûfe"),
  N("abdrahmanyerbu", "عبد الرحمن بن يربوع", "Abdurrahman b. Yerbû‘", 2, null, "Medine"),
  N("abdrahmanabza", "عبد الرحمن بن أبزى", "Abdurrahman b. Ebzâ", 1, null, "Kûfe"),
  N("eslem", "أسلم مولى عمر", "Eslem mevlâ Ömer", 2, null, "Medine", "Hz. Ömer'in mevlâsı. Rumûz ع."),
  N("esaskays", "الأشعث بن قيس", "Eş‘as b. Kays el-Kindî", 1, 40, "Kûfe"),
  N("cerirbecelî", "جرير بن عبد الله البجلي", "Cerîr b. Abdillâh el-Becelî", 1, 51, "Kûfe"),
  N("saibyezid", "السائب بن يزيد", "Sâib b. Yezîd", 1, null, "Medine"),
  N("sadvakkas", "سعد بن أبي وقاص", "Sa‘d b. Ebî Vakkās", 1, 55, "Medine", "Aşere-i mübeşşereden."),
  N("talha", "طلحة بن عبيد الله", "Talha b. Ubeydillâh", 1, 36, "Medine", "Aşere-i mübeşşereden."),
  N("abisrebia", "عابس بن ربيعة النخعي", "Âbis b. Rebîa en-Nehaî", 2, null, "Kûfe"),
  N("asimomer", "عاصم بن عمر بن الخطاب", "Âsım b. Ömer b. el-Hattâb", 1, 70, "Medine", "Hz. Ömer'in oğlu."),
  N("ebanosman", "أبان بن عثمان بن عفان", "Ebân b. Osman b. Affân", 3, 105, "Medine", "Hz. Osman'ın oğlu."),
  N("mervan", "مروان بن الحكم", "Mervân b. el-Hakem", 1, null, "Medine"),
  N("ibnhanefiyye", "محمد بن علي ابن الحنفية", "Muhammed b. Ali İbnü'l-Hanefiyye", 2, 81, "Medine"),
  N("malikevs", "مالك بن أوس بن الحدثان", "Mâlik b. Evs b. el-Hadesân", 2, null, "Medine"),
  N("ataebirebah", "عطاء بن أبي رباح", "Atâ b. Ebî Rebâh", 3, 114, "Mekke", "Mizzî: Hz. Osman'dan semâı yok («ولم يسمع منه»)."),
  N("hamranaban", "حمران بن أبان", "Humrân b. Ebân", 2, null, "Basra", "Hz. Osman'ın mevlâsı. Rumûz ع."),
  N("ebuabdrahmansulemi", "أبو عبد الرحمن السلمي", "Ebû Abdirrahman es-Sülemî", 2, 73, "Kûfe", "Rumûz خ ٤."),
  N("abdrahmanyezidnehai", "عبد الرحمن بن يزيد النخعي", "Abdurrahman b. Yezîd en-Nehaî", 2, null, "Kûfe"),
  N("mugirasube", "المغيرة بن شعبة", "Mugīre b. Şu‘be", 1, 50, "Kûfe"),
  N("imranhusayn", "عمران بن حصين", "İmrân b. Husayn", 1, 52, "Basra"),
  N("selemeekva", "سلمة بن الأكوع", "Seleme b. el-Ekva‘", 1, 74, "Medine"),
  N("zeydhalid", "زيد بن خالد الجهني", "Zeyd b. Hâlid el-Cühenî", 1, null, "Medine"),
  N("ebuumame", "أبو أمامة الباهلي", "Ebû Ümâme el-Bâhilî", 1, null, "Humus"),

  // ---- Ali b. el-Medini'nin I. tabakasi: mudevvinler ----
  N("ibnsihab", "محمد بن مسلم بن شهاب الزهري", "İbn Şihâb ez-Zührî", 4, 124, "Medine", "Tehzîb 5606. İbnü'l-Medînî'nin isnâd medârlarından, Medine'nin medârı. Mizzî başlıkta «Ebû Bekir el-Medenî, sekene'ş-Şâm» der, yani Medineli olup Şam'a yerleşmiştir; ağda talebe halkasının ağırlığı sebebiyle Medine sütunundadır. Mizzî, İbn Ömer'den semâı hakkında İbn Ma‘în, Ahmed ve Ebû Hâtim'in menfi kayıtlarını nakleder."),
  N("amrdinar", "عمرو بن دينار", "Amr b. Dînâr", 4, 126, "Mekke", "Mekke'nin medârı. Mizzî, İbnü'l-Medînî'den şunu nakleder: «Amr b. Dînâr Zührî'den yaşlıydı, Câbir'den işitti, Zührî ise işitmedi.»"),
  N("yahyaebikesir", "يحيى بن أبي كثير", "Yahyâ b. Ebî Kesîr", 4, 129, "Basra", "Basra'nın iki medârından biri."),
  N("katade", "قتادة بن دعامة السدوسي", "Katâde b. Diâme es-Sedûsî", 4, 117, "Basra", "İbnü'l-Medînî, el-İlel: «ve li-ehli'l-Basra Katâde b. Diâme es-Sedûsî, künyesi Ebû'l-Hattâb, 117'de vefat etti.»"),
  N("ebuishaksebii", "أبو إسحاق السبيعي", "Ebû İshak es-Sebîî", 4, 127, "Kûfe", "Kûfe'nin iki medârından biri."),
  N("amess", "سليمان بن مهران الأعمش", "A‘meş", 5, 148, "Kûfe", "Kûfe'nin iki medârından biri."),

  // ---- II. tabaka: musannifler ----
  N("malik", "مالك بن أنس", "Mâlik b. Enes", 5, 179, "Medine", "İbnü'l-Medînî: «Sonra bu altısının ilmi tasnif sahiplerine geçti, Medine'de Mâlik b. Enes...»"),
  N("ibnishak", "محمد بن إسحاق بن يسار", "Muhammed b. İshak", 5, 151, "Medine", "Megâzî imâmı. Mizzî, tercemesinde İbnü'l-Medînî'nin sözünü aynen nakleder: altının ilmi on iki kişiye geçti, biri Muhammed b. İshak'tır. Zührî onun için «Medine'de İbn İshak bulunduğu sürece büyük ilim eksilmez» der."),
  N("ibncureyc", "ابن جريج", "İbn Cüreyc", 5, 150, "Mekke"),
  N("ibnuyeyne", "سفيان بن عيينة", "Süfyân b. Uyeyne", 5, 198, "Mekke", "Tehzîb 5606'da Zührî'nin talebeleri arasında, rumûz ع."),
  N("ibnebiaruba", "سعيد بن أبي عروبة", "İbn Ebî Arûbe", 5, 156, "Basra", "Katâde'nin en sağlam talebelerinden. Mizzî, ihtilât kaydını nakleder: 145'ten sonra karıştırdı, İbn Ma‘în'e göre 142'den önce işitenin semâı sahih, sonrakiler değil."),
  N("hammadseleme", "حماد بن سلمة", "Hammâd b. Seleme", 5, 167, "Basra", "Basra'nın dört medârından. Mizzî, İbn Cüreyc ve İbn İshak için «ve hüve min şuyûhihî», Mâlik için «min akrânihî» kaydını düşer."),
  N("ebuavane", "الوضاح بن عبد الله اليشكري", "Ebû Avâne el-Vâsıtî", 5, 176, "Basra", "Vâsıt asıllı, Basra'ya yerleşti. Mizzî: Şu‘be ondan rivayet etti ve ondan önce vefat etti."),
  N("sube", "شعبة بن الحجاج", "Şu‘be b. el-Haccâc", 5, 160, "Basra"),
  N("mamer", "معمر بن راشد", "Ma‘mer b. Râşid", 5, 153, "Basra", "İbnü'l-Medînî, el-İlel: «künyesi Ebû Urve, Haddânî'nin mevlâsı, Yemen'de 154'te vefat etti, İbn Şihâb'dan işitti.» Vefat yılında kaynaklar arasında ihtilâf var."),
  N("sevri", "سفيان الثوري", "Süfyân es-Sevrî", 5, 161, "Kûfe"),
  N("evzai", "الأوزاعي", "Evzâî", 5, 157, "Şam", "Şam'ın imâmı. Mizzî, Dârekutnî ve İbn Ma‘în'den şu kayıtları nakleder: Atâ’dan rivayeti mürseldir, İbn Sîrîn'i hastalığında ziyaret etti fakat ondan işitmedi, Nâfi‘den de işitmedi."),
  N("huseym", "هشيم بن بشير", "Hüşeym b. Beşîr", 5, 183, "Vâsıt", "Tedlîsiyle bilinir. Mizzî'nin naklettikleri: Eyyûb'dan yalnız bir hadis işitti (İbn Ma‘în), Hâlid el-Hazzâ ve Mugīre'den hiç işitmedi (Ahmed b. Hanbel), Mücâlid'den hiçbir şey işitmedi, Zâzân'dan tedlîs yaptı."),

  // ---- III. tabaka: munekkit ve fakih muhaddisler ----
  N("yahyaadem", "يحيى بن آدم بن سليمان", "Yahyâ b. Âdem", 5, 203, "Kûfe", "Ali b. el-Medînî: «Allah Yahyâ b. Âdem'e rahmet etsin, ne ilim vardı onda.» Ebû Dâvûd: «Yahyâ insanların tekidir.»"),
  N("ibnebizaide", "يحيى بن زكريا بن أبي زائدة", "İbn Ebî Zâide", 5, 182, "Kûfe", "İbnü'l-Medînî'nin üçüncü tabakasından. Babası Zekeriyyâ b. Ebî Zâide de hocaları arasında. Mizzî: Süfyân b. Uyeyne'den rivayet etti ve ondan önce vefat etti."),
  N("veki", "وكيع بن الجراح", "Vekî‘ b. el-Cerrâh", 5, 197, "Kûfe", "Sevrî'nin başlıca râvisi. Ahmed b. Hanbel: «Vekī‘den daha çok ilim toplayanı görmedim, ondan daha hâfızını görmedim.» Yine Ahmed: «Vekī‘ beş yüz hadiste hata etti» ve «İbn Mehdî'den çok daha hâfızdı.»"),
  N("ibnmubarek", "عبد الله بن المبارك بن واضح", "Abdullah b. el-Mübârek", 5, 181, "Horasan", "İbn Mehdî: «imâmlar dörttür, Sevrî, Mâlik, Hammâd b. Zeyd ve İbnü'l-Mübârek»; Sevrî ile kıyaslandığında İbn Mehdî onu tercih eder. Merv asıllı (el-Mervezî), Horasan sütununda. Mizzî: «imâmlardan biri ve İslâm hâfızlarından.» İbn Ma‘în: İbrâhim b. Ukbe'den de Muhammed b. Ukbe'den de işitmedi."),
  N("kattan", "يحيى بن سعيد بن فروخ القطان", "Yahyâ b. Saîd el-Kattân", 5, 198, "Basra", "Cerh-ta‘dîl ve ilel imâmı. Ahmed b. Hanbel, Sevrî'nin talebeleri sorulduğunda dördünü sayar ve başa onu koyar: Yahyâ, Vekī‘, Abdurrahman, Ebû Nuaym."),
  N("ibnmehdi", "عبد الرحمن بن مهدي بن حسان", "Abdurrahman b. Mehdî", 5, 198, "Basra", "İlel imâmlarından. Şu‘be rivayetinde Affân ve Günder'in ondan daha sağlam sayıldığı kaydedilir (Ahmed b. Hanbel ve Ali b. el-Medînî)."),

  // ---- Zuhri'nin Tehzib'de gecen, agda henuz olmayan hocalari ----
  N("sabitkayszuraki", "ثابت بن قيس الزرقي", "Sâbit b. Kays ez-Zürakī", 2, null, "Medine"),
  N("ibrahimavf", "إبراهيم بن عبد الرحمن بن عوف", "İbrâhim b. Abdirrahman b. Avf", 3, null, "Medine"),
  N("haricezeyd", "خارجة بن زيد بن ثابت", "Hârice b. Zeyd b. Sâbit", 3, 100, "Medine", "Medine'nin yedi fakıhından."),
  N("ubeydullahutbe", "عبيد الله بن عبد الله بن عتبة", "Ubeydullah b. Abdillâh b. Utbe", 3, 98, "Medine", "Medine'nin yedi fakıhından. Rumûz ع."),
  N("arac", "عبد الرحمن بن هرمز الأعرج", "Abdurrahman b. Hürmüz el-A‘rec", 3, 117, "Medine", "Rumûz ع."),
  N("hamzaibnomer", "حمزة بن عبد الله بن عمر", "Hamza b. Abdillâh b. Ömer", 3, null, "Medine", "Rumûz ع."),
  N("hasanhanefiyye", "الحسن بن محمد ابن الحنفية", "Hasan b. Muhammed İbnü'l-Hanefiyye", 3, null, "Medine"),
  N("alkamevakkas", "علقمة بن وقاص الليثي", "Alkame b. Vakkâs el-Leysî", 2, null, "Medine"),
  N("abdullahkab", "عبد الله بن كعب بن مالك", "Abdullah b. Kâ‘b b. Mâlik", 3, null, "Medine"),
  N("rafihadic", "رافع بن خديج", "Râfi‘ b. Hadîc", 1, 74, "Medine", "Mizzî: Zührî'nin ondan rivayeti mürseldir."),

  // ---- Zuhri'nin Tehzib'de gecen talebeleri ----
  N("salihkeysan", "صالح بن كيسان", "Sâlih b. Keysân", 5, null, "Medine", "Rumûz ع."),
  N("suaybebihamza", "شعيب بن أبي حمزة", "Şuayb b. Ebî Hamza", 5, null, "Şam", "Rumûz ع."),
  N("ibrahimsad", "إبراهيم بن سعد الزهري", "İbrâhim b. Sa‘d ez-Zührî", 5, null, "Medine"),
  N("eyyubsahtiyani", "أيوب السختياني", "Eyyûb es-Sahtiyânî", 5, 131, "Basra"),
  N("usamezeydleysi", "أسامة بن زيد الليثي", "Üsâme b. Zeyd el-Leysî", 5, null, "Medine"),
  N("haccacertat", "الحجاج بن أرطاة", "Haccâc b. Ertât", 5, null, "Kûfe", "Mizzî: Zührî'den semâı ihtilâflı («ve kîle lem yesma‘ minhu»)."),

  // ---- Katade ve A'mes cevresinde aga giren yeni raviler ----
  N("ebulaliye", "أبو العالية الرياحي", "Ebû'l-Âliye er-Riyâhî", 2, 90, "Basra", "Rumûz ع."),
  N("cabirzeyd", "أبو الشعثاء جابر بن زيد", "Câbir b. Zeyd Ebû’ş-Şa‘sâ", 3, 93, "Basra", "Rumûz ع."),
  N("bekirmuzeni", "بكر بن عبد الله المزني", "Bekir b. Abdillâh el-Müzenî", 3, 106, "Basra"),
  N("nehai", "إبراهيم النخعي", "İbrâhim en-Nehaî", 4, 96, "Kûfe", "Rumûz ع. Kûfe re’y ekolünün temel halkası."),
  N("ibrahimteymi", "إبراهيم التيمي", "İbrâhim et-Teymî", 4, 92, "Kûfe", "Rumûz ع."),
  N("habibebisabit", "حبيب بن أبي ثابت", "Habîb b. Ebî Sâbit", 4, 119, "Kûfe"),
  N("hakemuteybe", "الحكم بن عتيبة", "Hakem b. Uteybe", 4, 115, "Kûfe", "Mizzî, A‘meş’in tercemesinde «ve hüve min şuyûhihî» kaydını düşer, yani hem hocası hem talebesidir."),
  N("ebuduha", "أبو الضحى مسلم بن صبيح", "Ebû’d-Duhâ Müslim b. Subıh", 4, 100, "Kûfe", "Rumûz ع."),
  N("yahyavessab", "يحيى بن وثاب", "Yahyâ b. Vessâb", 4, 103, "Kûfe"),
  N("mearrursuveyd", "المعرور بن سويد", "Ma‘rûr b. Süveyd", 2, null, "Kûfe", "Rumûz ع."),
  N("hisamdestuvai", "هشام الدستوائي", "Hişâm ed-Destevâî", 5, 154, "Basra", "Rumûz ع."),
  N("hemmamyahya", "همام بن يحيى", "Hemmâm b. Yahyâ", 5, 164, "Basra", "Rumûz ع."),
  N("cerirhazim", "جرير بن حازم", "Cerîr b. Hâzim", 5, 170, "Basra", "Rumûz ع."),
  N("cerirabdulhamid", "جرير بن عبد الحميد", "Cerîr b. Abdilhamîd", 5, 188, "Kûfe", "Rumûz ع."),
  N("hafsgiyas", "حفص بن غياث", "Hafs b. Giyâs", 5, 194, "Kûfe", "Rumûz ع."),
  N("leysbsad", "الليث بن سعد", "Leys b. Sa‘d", 5, 175, "Mısır", "Mizzî: Katâde ile görüşmedi («ve lem yelkahu»)."),
  N("amrharis", "عمرو بن الحارث", "Amr b. el-Hâris", 5, null, "Mısır"),
  N("misersukdam", "مسعر بن كدام", "Mis‘ar b. Kedâm", 5, 155, "Kûfe"),
  N("suleymanteymi", "سليمان التيمي", "Süleymân et-Teymî", 5, 143, "Basra"),
  N("ibnnumeyr", "عبد الله بن نمير", "Abdullah b. Nümeyr", 5, 199, "Kûfe"),
  N("ibnidris", "عبد الله بن إدريس", "Abdullah b. İdrîs", 5, 192, "Kûfe"),
  N("alimushir", "علي بن مسهر", "Ali b. Müshir", 5, 189, "Kûfe"),

  // ---- Amr b. Dinar cevresinde aga giren raviler ----
  N("saidcubeyr", "سعيد بن جبير", "Saîd b. Cübeyr", 4, 95, "Kûfe", "Rumûz ع."),
  N("tavus", "طاووس بن كيسان", "Tâvûs b. Keysân", 4, 106, "Mekke", "Rumûz ع."),
  N("mucahid", "مجاهد بن جبر", "Mücâhid b. Cebr", 4, 104, "Mekke"),
  N("kureyb", "كريب مولى ابن عباس", "Küreyb mevlâ İbn Abbâs", 3, 98, "Medine"),
  N("ebucafermuhbakir", "محمد بن علي الباقر", "Muhammed b. Ali el-Bâkır", 4, 114, "Medine"),
  N("suleymanyesar", "سليمان بن يسار", "Süleymân b. Yesâr", 3, 107, "Medine", "Medine'nin yedi fakıhından."),
  N("ebuselemeavf", "أبو سلمة بن عبد الرحمن", "Ebû Seleme b. Abdirrahman", 3, 94, "Medine", "Medine'nin yedi fakıhından."),
  N("vehbmunebbih", "وهب بن منبه", "Vehb b. Münebbih", 4, 114, "Mekke"),
  N("hammadzeyd", "حماد بن زيد", "Hammâd b. Zeyd", 5, 179, "Basra", "Rumûz خ م د ت س."),
  N("varkaomer", "ورقاء بن عمر", "Varkā b. Ömer", 5, null, "Kûfe"),
  N("davudattar", "داود بن عبد الرحمن العطار", "Dâvûd b. Abdirrahman el-Attâr", 5, null, "Mekke", "Rumûz ع."),
  N("zekeriyyaishak", "زكريا بن إسحاق المكي", "Zekeriyyâ b. İshak el-Mekkî", 5, null, "Mekke", "Rumûz ع."),

  // ---- Ebu Ishak es-Sebii cevresinde aga giren raviler ----
  N("egarebumuslim", "الأغر أبو مسلم", "Egar Ebû Müslim", 2, null, "Kûfe"),
  N("amrmeymun", "عمرو بن ميمون الأودي", "Amr b. Meymûn el-Evdî", 2, 74, "Kûfe", "Rumûz ع."),
  N("mesruk", "مسروق بن الأجدع", "Mesrûk b. el-Ecda‘", 2, 63, "Kûfe"),
  N("musatalha", "موسى بن طلحة", "Mûsâ b. Talha", 3, 103, "Kûfe", "Dârekutnî: Ebû İshak ondan bir hadisi işitmemiştir."),
  N("numanbesir", "النعمان بن بشير", "Nu‘mân b. Beşîr", 1, 64, "Şam"),
  N("nafiibnomer", "نافع مولى ابن عمر", "Nâfi‘ mevlâ İbn Ömer", 4, 117, "Medine"),
  N("zuhayrmuaviye", "زهير بن معاوية", "Züheyr b. Muâviye", 5, 173, "Kûfe", "Rumûz ع."),
  N("zaidekudame", "زائدة بن قدامة", "Zâide b. Kedâme", 5, 161, "Kûfe"),
  N("ebulahvess", "أبو الأحوص سلام بن سليم", "Ebû’l-Ahves Süllâm b. Süleym", 5, 179, "Kûfe", "Rumûz ع."),
  N("serikkadi", "شريك بن عبد الله النخعي", "Şerîk b. Abdillâh en-Nehaî", 5, 177, "Kûfe"),
  N("hamzazeyyat", "حمزة بن حبيب الزيات", "Hamza b. Habîb ez-Zeyyât", 5, 156, "Kûfe"),

  // ---- Yahya b. Ebi Kesir cevresinde aga giren raviler ----

  // ---- Ibn Abbas ve Ibn Omer cevresinde aga giren raviler ----
  N("halidvelid", "خالد بن الوليد", "Hâlid b. el-Velîd", 1, 21, "Humus"),
  N("bureyde", "بريدة بن الحصيب", "Büreyde b. el-Hasıyb", 1, 63, "Basra"),
  N("temimdari", "تميم الداري", "Temîm ed-Dârî", 1, 40, "Şam"),
  N("hafsa", "حفصة أم المؤمنين", "Hafsa bint Ömer", 1, 45, "Medine", "Hz. Ömer'in kızı, İbn Ömer'in kız kardeşi. Rumûz ع."),
  N("bilal", "بلال مؤذن رسول الله", "Bilâl-i Habeşî", 1, 20, "Şam", "Rumûz ع."),
  N("amirrebia", "عامر بن ربيعة", "Âmir b. Rebîa", 1, 32, "Medine", "Rumûz ع."),
  N("ebulubabe", "أبو لبابة الأنصاري", "Ebû Lübâbe el-Ensârî", 1, null, "Medine"),
  N("abdullahdinar", "عبد الله بن دينار", "Abdullah b. Dînâr", 4, 127, "Medine", "Rumûz ع."),
  N("hamzaibnomerogul", "حمزة بن عبد الله بن عمر (ابنه)", "Hamza b. Abdillâh b. Ömer (oğlu)", 3, null, "Medine"),
  N("cebeleshim", "جبلة بن سحيم", "Cebele b. Süheym", 4, 125, "Kûfe", "Rumûz ع."),
  N("saidyesar", "أبو الحباب سعيد بن يسار", "Saîd b. Yesâr", 3, 117, "Medine", "Rumûz ع."),
  N("sadubeyde", "سعد بن عبيدة", "Sa‘d b. Ubeyde", 3, null, "Kûfe"),
  N("safvanmuhriz", "صفوان بن محرز", "Safvân b. Muhriz", 2, 74, "Basra"),
  N("enessirin", "أنس بن سيرين", "Enes b. Sîrîn", 3, 118, "Basra"),
  N("sabitbunani", "ثابت البناني", "Sâbit el-Bünânî", 4, 127, "Basra"),
  N("dahhak", "الضحاك بن مزاحم", "Dahhâk b. Müzâhim", 4, 105, "Basra"),
  N("sehrhavseb", "شهر بن حوشب", "Şehr b. Havşeb", 3, 112, "Şam"),
  N("hakemarac", "الحكم بن الأعرج", "Hakem b. el-A‘rec", 3, null, "Basra"),
  N("ebuzabyan", "أبو ظبيان حصين بن جندب", "Ebû Zabyân Hüsayn b. Cündeb", 2, 90, "Kûfe"),
  N("abdullahmabed", "عبد الله بن معبد بن عباس", "Abdullah b. Ma‘bed b. Abbâs", 3, null, "Medine"),
  N("ebulminhal", "أبو المنهال عبد الرحمن بن مطعم", "Ebû'l-Minhâl Abdurrahman b. Mut‘im", 3, null, "Mekke"),
  N("ubeydullahebiyezid", "عبيد الله بن أبي يزيد", "Ubeydullah b. Ebî Yezîd", 4, 126, "Mekke", "Rumûz ع."),
  N("ibnebimuleyke", "عبد الله بن أبي مليكة", "İbn Ebî Müleyke", 4, 117, "Mekke", "Rumûz ع."),

  // ---- Enes ve Cabir cevresinde aga giren raviler ----
  N("sumameenes", "ثمامة بن عبد الله بن أنس", "Sümâme b. Abdillâh b. Enes", 4, null, "Basra", "Enes'in torunu. Rumûz ع."),
  N("humeydtavil", "حميد الطويل", "Humeyd et-Tavîl", 5, 142, "Basra", "Rumûz ع."),
  N("hafsubeydullahenes", "حفص بن عبيد الله بن أنس", "Hafs b. Ubeydillâh b. Enes", 4, null, "Basra"),
  N("cadebuosman", "الجعد أبو عثمان", "Ca‘d Ebû Osmân", 4, null, "Basra"),
  N("rebiaebiabdrahman", "ربيعة بن أبي عبد الرحمن", "Rabîa b. Ebî Abdirrahman (Rabîatü'r-re'y)", 5, 136, "Medine"),
  N("bekirahnes", "بكير بن الأخنس", "Bekîr b. el-Ahnes", 4, null, "Kûfe"),
  N("zubeyradi", "الزبير بن عدي", "Zübeyr b. Adî", 4, 131, "Kûfe"),
  N("beyanbisr", "بيان بن بشر", "Beyân b. Bişr el-Ahmesî", 4, null, "Kûfe"),
  N("bisryesar", "بشير بن يسار", "Beşîr b. Yesâr", 3, null, "Medine"),
  N("ebuzubeyrmekki", "أبو الزبير محمد بن مسلم المكي", "Ebû'z-Zübeyr el-Mekkî", 4, 126, "Mekke", "Câbir'in başlıca râvisi. Rumûz ع."),
  N("ibnmunkedir", "محمد بن المنكدر", "Muhammed b. el-Münkedir", 4, 130, "Medine", "Rumûz ع."),
  N("vehbkeysan", "وهب بن كيسان", "Vehb b. Keysân", 4, 127, "Medine"),
  N("mahmudlebid", "محمود بن لبيد", "Mahmûd b. Lebîd", 2, 96, "Medine"),
  N("muhammedabbadcafer", "محمد بن عباد بن جعفر", "Muhammed b. Abbâd b. Ca‘fer", 4, null, "Mekke"),
  N("muhammedsevban", "محمد بن عبد الرحمن بن ثوبان", "Muhammed b. Abdirrahman b. Sevbân", 4, null, "Medine"),
  N("yezidsuheybfakir", "يزيد بن صهيب الفقير", "Yezîd b. Suheyb el-Fakır", 4, null, "Kûfe"),

  // ---- Ebu Said ve Aise cevresinde aga giren raviler ----
  N("sadhisam", "سعد بن هشام بن عامر", "Sa‘d b. Hişâm b. Âmir", 3, null, "Medine", "Rumûz ع."),
  N("kazaayahya", "قزعة بن يحيى", "Kaz‘a b. Yahyâ", 3, null, "Basra", "Rumûz ع."),
  N("ibnsirin", "محمد بن سيرين", "Muhammed b. Sîrîn", 4, 110, "Basra"),
  N("mabedsirin", "معبد بن سيرين", "Ma‘bed b. Sîrîn", 3, null, "Basra"),
  N("kasimmuhaymire", "القاسم بن مخيمرة", "Kâsım b. Muhaymire", 4, 100, "Kûfe"),
  N("yahyaumare", "يحيى بن عمارة المازني", "Yahyâ b. Umâre el-Mâzinî", 3, null, "Medine", "Rumûz ع."),
  N("ebuumamesehl", "أبو أمامة بن سهل بن حنيف", "Ebû Ümâme b. Sehl b. Huneyf", 3, 100, "Medine"),
  N("ebusaidmakburi", "أبو سعيد المقبري", "Ebû Saîd el-Makburî", 3, null, "Medine"),
  N("numanebiayyas", "النعمان بن أبي عياش الزرقي", "Nu‘mân b. Ebî Ayyâş ez-Zürakī", 3, null, "Medine"),
  N("ebussiddiknaci", "أبو الصديق الناجي", "Ebû's-Sıddīk en-Nâcî", 3, 108, "Basra", "Rumûz ع."),
  N("ebuidrishavlani", "أبو إدريس الخولاني", "Ebû İdrîs el-Havlânî", 3, 80, "Şam"),
  N("zekvanmevlaaise", "ذكوان مولى عائشة", "Zekvân mevlâ Âişe", 3, null, "Medine"),
  N("abbadabdullahzubeyr", "عباد بن عبد الله بن الزبير", "Abbâd b. Abdillâh b. ez-Zübeyr", 3, null, "Medine", "Rumûz ع."),
  N("sureyhhani", "شريح بن هانئ الحارثي", "Şüreyh b. Hâni’ el-Hârisî", 2, 78, "Kûfe"),
  N("abdullahsakik", "عبد الله بن شقيق العقيلي", "Abdullah b. Şakīk el-Ukaylî", 3, 108, "Basra"),
  N("abdullahsedddad", "عبد الله بن شداد بن الهاد", "Abdullah b. Şeddâd b. el-Hâd", 2, 81, "Kûfe"),
  N("amrabdrahmanzurara", "عمرة بنت عبد الرحمن", "Amre bint Abdirrahman", 3, 98, "Medine", "Âişe'nin başlıca kadın râvisi."),
  N("kasimmuhammed", "القاسم بن محمد بن أبي بكر", "Kâsım b. Muhammed b. Ebî Bekir", 4, 106, "Medine", "Medine'nin yedi fakıhından, Âişe'nin kardeş oğlu."),

  // ---- Malik cevresinde aga giren raviler ----
  N("caferisadik", "جعفر بن محمد الصادق", "Ca‘fer b. Muhammed es-Sâdık", 5, 148, "Medine", "Rumûz م ت س ق."),
  N("humeyskaysarac", "حميد بن قيس المكي الأعرج", "Humeyd b. Kays el-Mekkî el-A‘rec", 5, null, "Mekke"),
  N("davudhusayn", "داود بن الحصين", "Dâvûd b. el-Husayn", 5, 135, "Medine", "Rumûz ع."),
  N("salimebinadr", "سالم أبو النضر", "Sâlim Ebû'n-Nadr", 5, 129, "Medine", "Rumûz ع."),
  N("hubeybabdrahman", "خبيب بن عبد الرحمن", "Hubîb b. Abdirrahman", 5, 132, "Medine"),
  N("ziyadsad", "زياد بن سعد", "Ziyâd b. Sa‘d", 5, null, "Mekke"),
  N("yezidhad", "يزيد بن عبد الله بن الهاد", "Yezîd b. Abdillâh b. el-Hâd", 5, 139, "Medine"),
  N("yezidrouman", "يزيد بن رومان", "Yezîd b. Rûmân", 5, 130, "Medine"),
  N("yezidkusayt", "يزيد بن عبد الله بن قسيط", "Yezîd b. Abdillâh b. Kusıyt", 5, 122, "Medine"),
  N("ataihorasani", "عطاء الخراساني", "Atâ el-Horâsânî", 5, 135, "Şam"),
  N("abdulmecidsuheyl", "عبد المجيد بن سهيل", "Abdülmecîd b. Süheyl", 5, null, "Medine"),
  N("ibnvehb", "عبد الله بن وهب", "Abdullah b. Vehb", 5, 197, "Mısır", "Rumûz خ م س."),
  N("kanebi", "عبد الله بن مسلمة القعنبي", "Ka‘nevî, Abdullah b. Mesleme", 5, 221, "Basra", "Rumûz خ م د ت."),
  N("ibnkasimmisri", "عبد الرحمن بن القاسم المصري", "İbn Kâsım el-Mısrî", 5, 191, "Mısır"),
  N("safii", "محمد بن إدريس الشافعي", "Muhammed b. İdrîs eş-Şâfiî", 5, 204, "Mısır"),
  N("kuteybesaid", "قتيبة بن سعيد", "Kuteybe b. Saîd", 5, 240, "Basra", "Rumûz خ م د ت س."),
  N("ibnebiuveys", "إسماعيل بن أبي أويس", "İsmâîl b. Ebî Üveys", 5, 226, "Medine"),
  N("ibnuleyye", "إسماعيل ابن علية", "İsmâîl İbn Uleyye", 5, 193, "Basra"),
  N("velidmuslim", "الوليد بن مسلم", "Velîd b. Müslim", 5, 195, "Şam"),
  N("ebunuaymfadl", "أبو نعيم الفضل بن دكين", "Ebû Nuaym el-Fazl b. Dükeyn", 5, 219, "Kûfe"),
  N("ebuasimnebil", "أبو عاصم الضحاك بن مخلد", "Ebû Âsım ed-Dahhâk b. Mahled", 5, 212, "Basra"),

  // ---- Su'be cevresinde aga giren raviler ----
  N("ismailebihalid", "إسماعيل بن أبي خالد", "İsmâîl b. Ebî Hâlid", 5, 146, "Kûfe"),
  N("halidhazza", "خالد الحذاء", "Hâlid el-Hazzâ", 5, 141, "Basra"),
  N("davudebihind", "داود بن أبي هند", "Dâvûd b. Ebî Hind", 5, 140, "Basra"),
  N("sadibrahim", "سعد بن إبراهيم", "Sa‘d b. İbrâhim", 5, 125, "Medine", "Rumûz ع."),
  N("husaynabdrahman", "حصين بن عبد الرحمن", "Husayn b. Abdirrahman", 5, 136, "Kûfe"),
  N("hammadebisuleyman", "حماد بن أبي سليمان", "Hammâd b. Ebî Süleymân", 5, 120, "Kûfe"),
  N("zubeydyami", "زبيد اليامي", "Zübeyd el-Yâmî", 5, 122, "Kûfe"),
  N("zekeriyyaebizaide", "زكريا بن أبي زائدة", "Zekeriyyâ b. Ebî Zâide", 5, 148, "Kûfe"),
  N("cameseddad", "جامع بن شداد", "Câmi‘ b. Şeddâd", 5, null, "Kûfe"),
  N("gunder", "محمد بن جعفر غندر", "Muhammed b. Ca‘fer Günder", 5, 193, "Basra", "Şu‘be'nin en meşhur râvisi. Rumûz ع."),
  N("yezidharun", "يزيد بن هارون", "Yezîd b. Hârûn", 5, 206, "Vâsıt"),
  N("yezidzurey", "يزيد بن زريع", "Yezîd b. Zürey‘", 5, 182, "Basra"),
  N("nadrsumeyl", "النضر بن شميل", "Nadr b. Şümeyl", 5, 204, "Basra"),
  N("ebudavudtayalisi", "أبو داود الطيالسي", "Ebû Dâvûd et-Tayâlisî", 5, 204, "Basra"),
  N("muazmuaz", "معاذ بن معاذ العنبري", "Muâz b. Muâz el-Anberî", 5, 196, "Basra"),
  N("affanmuslim", "عفان بن مسلم", "Affân b. Müslim", 5, 220, "Basra"),
  N("alicad", "علي بن الجعد", "Ali b. el-Ca‘d", 5, 230, "Basra"),
  N("abdussamed", "عبد الصمد بن عبد الوارث", "Abdüssamed b. Abdilvâris", 5, 207, "Basra"),
  N("isabyunus", "عيسى بن يونس", "Ísâ b. Yûnus", 5, 191, "Şam"),

  // ---- Sevri cevresinde aga giren raviler ----
  N("esvedkays", "الأسود بن قيس", "Esved b. Kays", 5, null, "Kûfe", "Rumûz ع."),
  N("hasanubeydullah", "الحسن بن عبيد الله النخعي", "Hasan b. Ubeydillâh en-Nehaî", 5, null, "Kûfe"),
  N("sevryezid", "ثور بن يزيد الرحبي", "Sevr b. Yezîd er-Rahbî", 5, 153, "Şam"),
  N("ismailumeyye", "إسماعيل بن أمية", "İsmâîl b. Ümeyye", 5, 144, "Mekke"),
  N("suddi", "إسماعيل السدي", "İsmâîl es-Süddî", 5, 127, "Kûfe"),
  N("ibrahimukbe", "إبراهيم بن عقبة", "İbrâhim b. Ukbe", 5, null, "Medine"),
  N("ebuhasin", "أبو حصين عثمان بن عاصم", "Ebû Hasīn Osmân b. Âsım", 5, 128, "Kûfe"),
  N("cabircufi", "جابر الجعفي", "Câbir el-Cu‘fî", 5, 128, "Kûfe", "Cerh açısından tartışmalı."),
  N("hasanamrfukaymi", "الحسن بن عمرو الفقيمي", "Hasan b. Amr el-Fukaymî", 5, null, "Kûfe"),
  N("ishakyusufezrak", "إسحاق بن يوسف الأزرق", "İshak b. Yûsuf el-Ezrak", 5, 195, "Vâsıt", "Rumûz ع."),
  N("ebuusamehammad", "أبو أسامة حماد بن أسامة", "Ebû Üsâme Hammâd b. Üsâme", 5, 201, "Kûfe"),
  N("caferavn", "جعفر بن عون", "Ca‘fer b. Avn", 5, 207, "Kûfe"),
  N("halidharis", "خالد بن الحارث الهجيمي", "Hâlid b. el-Hâris el-Hüceyî", 5, 186, "Basra"),
  N("ruhubade", "روح بن عبادة", "Ruh b. Ubâde", 5, 205, "Basra"),
  N("abdurrezzak", "عبد الرزاق بن همام", "Abdürrezzâk b. Hemmâm", 5, 211, "Mekke", "Ma‘mer'in başlıca râvisi, el-Musannef sahibi."),
  N("damrarebia", "ضمرة بن ربيعة", "Damra b. Rabîa", 5, 202, "Şam"),
  N("suleymanbilal", "سليمان بن بلال", "Süleymân b. Bilâl", 5, 172, "Medine"),
  N("bisrsari", "بشر بن السري", "Bişr b. es-Serî", 5, 195, "Basra"),

  // ---- Sufyan b. Uyeyne cevresinde aga giren raviler ----
  N("hisamurve", "هشام بن عروة", "Hişâm b. Urve", 5, 146, "Medine", "Urve'nin oğlu. Rumûz ع."),
  N("mansurmutemir", "منصور بن المعتمر", "Mansûr b. el-Mu‘temir", 5, 132, "Kûfe"),
  N("mansursafiyye", "منصور بن صفية", "Mansûr b. Safiyye", 5, null, "Mekke"),
  N("musaukbe", "موسى بن عقبة", "Mûsâ b. Ukbe", 5, 141, "Medine"),
  N("muhammedacilan", "محمد بن عجلان", "Muhammed b. Aclân", 5, 148, "Medine"),
  N("muhammedamralkame", "محمد بن عمرو بن علقمة", "Muhammed b. Amr b. Alkame", 5, 145, "Medine"),
  N("muhammedsuka", "محمد بن سوقة", "Muhammed b. Sûka", 5, null, "Kûfe"),
  N("mutarriftarif", "مطرف بن طريف", "Mutarrif b. Tarîf", 5, 141, "Kûfe"),
  N("ismailebiislamsibani", "أبو إسحاق الشيباني", "Ebû İshak eş-Şeybânî", 5, 141, "Kûfe"),
  N("velidkesir", "الوليد بن كثير", "Velîd b. Kesîr", 5, 151, "Medine"),
  N("yezidhusayfe", "يزيد بن خصيفة", "Yezîd b. Husıyfe", 5, null, "Medine"),
  N("ahmedhanbel", "أحمد بن حنبل", "Ahmed b. Hanbel", 5, 241, "Basra", "el-Müsned sahibi. Rumûz م د."),
  N("ibnrahuye", "إسحاق بن راهويه", "İshak b. Râhûye", 5, 238, "Horasan", "Rumûz خ م س."),
  N("ahmedsalihmisri", "أحمد بن صالح المصري", "Ahmed b. Sâlih el-Mısrî", 5, 248, "Mısır"),
  N("ahmedmeni", "أحمد بن منيع", "Ahmed b. Manî‘ el-Bağavî", 5, 244, "Basra"),
  N("ibrahimfezari", "إبراهيم بن محمد الفزاري", "İbrâhim b. Muhammed el-Fezârî", 5, 188, "Şam"),

  // ---- Ibn Cureyc cevresinde aga giren raviler ----
  N("abdullahtavus", "عبد الله بن طاووس", "Abdullah b. Tâvûs", 5, 132, "Mekke", "Mizzî: İbn Cüreyc ondan yalnız bir hadis işitti (Yahyâ el-Kattân ve İbn Ma‘în)."),
  N("abdulhamidcubeyr", "عبد الحميد بن جبير بن شيبة", "Abdülhamîd b. Cübeyr b. Şeybe", 5, null, "Mekke", "Rumûz ع."),
  N("abdulkerimcezeri", "عبد الكريم بن مالك الجزري", "Abdülkerîm b. Mâlik el-Cezerî", 5, 127, "Şam"),
  N("ikrimehalid", "عكرمة بن خالد المخزومي", "İkrime b. Hâlid el-Mahzûmî", 4, null, "Mekke"),
  N("kasimebibezze", "القاسم بن أبي بزة", "Kâsım b. Ebî Bezze", 5, 124, "Mekke"),
  N("alaabdrahman", "العلاء بن عبد الرحمن", "Alâ b. Abdirrahman", 5, 132, "Medine"),
  N("amrsuayb", "عمرو بن شعيب", "Amr b. Şuayb", 5, 118, "Mekke", "Mizzî, Buhârî'den nakleder: İbn Cüreyc ondan işitmedi."),
  N("ibnhuseymkhaysem", "عبد الله بن عثمان بن خثيم", "Abdullah b. Osmân b. Husıym", 5, 132, "Mekke"),
  N("ubeydullahomeri", "عبيد الله بن عمر العمري", "Ubeydullah b. Ömer el-Ömerî", 5, 147, "Medine", "Mizzî: İbn Cüreyc'in akranı."),
  N("haccacmuhammed", "حجاج بن محمد المصيصي", "Haccâc b. Muhammed el-Masīsī", 5, 206, "Şam", "İbn Cüreyc'in başlıca râvisi. Rumûz ع."),
  N("ismailayyas", "إسماعيل بن عياش", "İsmâîl b. Ayyâş", 5, 181, "Şam"),
  N("enesiyaz", "أنس بن عياض", "Enes b. İyâz", 5, 200, "Medine"),

  // ---- Ma'mer cevresinde aga giren raviler ----
  N("hemmammunebbih", "همام بن منبه", "Hemmâm b. Münebbih", 4, 132, "Mekke", "es-Sahîfetu's-sahîha sahibi. Rumûz ع."),
  N("matarverrak", "مطر الوراق", "Matar el-Verrâk", 5, 129, "Basra"),
  N("hisamyusufsanani", "هشام بن يوسف الصنعاني", "Hişâm b. Yûsuf es-San‘ânî", 5, 197, "Mekke"),
  N("mutemirsuleyman", "معتمر بن سليمان", "Mu‘temir b. Süleymân", 5, 187, "Basra"),
  N("abdulalaabdulala", "عبد الأعلى بن عبد الأعلى", "Abdül'alâ b. Abdil'alâ", 5, 189, "Basra"),
  N("vuheybhalid", "وهيب بن خالد", "Vüheyb b. Hâlid", 5, 165, "Basra"),
  N("ebansattar", "أبان بن يزيد العطار", "Ebân b. Yezîd el-Attâr", 5, 160, "Basra"),
  N("mervanfezari", "مروان بن معاوية الفزاري", "Mervân b. Muâviye el-Fezârî", 5, 193, "Kûfe"),
  N("vakidi", "محمد بن عمر الواقدي", "Vâkıdî, Muhammed b. Ömer", 5, 207, "Medine"),

  // ---- Evzai cevresinde aga giren raviler ----
  N("mekhul", "مكحول الشامي", "Mekhûl eş-Şâmî", 4, 112, "Şam", "Şam fakıhlerinin önde geleni."),
  N("hassanatiyye", "حسان بن عطية", "Hassân b. Atiyye", 5, 130, "Şam", "Rumûz ع."),
  N("rebiayezid", "ربيعة بن يزيد", "Rabîa b. Yezîd", 5, 123, "Şam"),
  N("umeyrhani", "عمير بن هانئ", "Umeyr b. Hâni’", 4, null, "Şam", "Rumûz ع."),
  N("abdelubabe", "عبدة بن أبي لبابة", "Abde b. Ebî Lübâbe", 5, null, "Şam"),
  N("muhammedvelidzubeydi", "محمد بن الوليد الزبيدي", "Muhammed b. el-Velîd ez-Zübeydî", 5, 149, "Şam"),
  N("suleymanhabib", "سليمان بن حبيب المحاربي", "Süleymân b. Habîb el-Muhâribî", 4, null, "Şam"),
  N("suleymanmusadimaski", "سليمان بن موسى الدمشقي", "Süleymân b. Mûsâ ed-Dımaşkī", 5, 119, "Şam"),
  N("saddadebuammar", "شداد أبو عمار", "Şeddâd Ebû Ammâr", 3, null, "Şam"),
  N("mutallibhantab", "المطلب بن عبد الله بن حنطب", "Muttalib b. Abdillâh b. Hantab", 4, null, "Medine"),
  N("kurrahayvil", "قرة بن عبد الرحمن", "Kurre b. Abdirrahman", 5, 147, "Mısır"),
  N("meymunmihran", "ميمون بن مهران", "Meymûn b. Mihrân", 4, 117, "Şam"),

  // ---- Evzai'nin talebeleri ve Ibn Ebi Aruba cevresi ----
  N("hikalziyad", "الهقل بن زياد", "Hıkal b. Ziyâd", 5, 179, "Şam", "Mizzî: Evzâî hakkında insanların en sağlamı («ve hüve esbetu'n-nâsi fîhî»). Rumûz م ٤."),
  N("bakiyyevelid", "بقية بن الوليد", "Bakiyye b. el-Velîd", 5, 197, "Humus"),
  N("firyabi", "محمد بن يوسف الفريابي", "Mmuhammed b. Yûsuf el-Firyâbî", 5, 212, "Şam", "Rumûz ع."),
  N("ebulmugirehavlani", "أبو المغيرة عبد القدوس", "Ebû'l-Mugīre Abdülkuddûs el-Havlânî", 5, 212, "Humus", "Rumûz ع."),
  N("suaybishakdimaski", "شعيب بن إسحاق الدمشقي", "Şuayb b. İshak ed-Dımaşkī", 5, 189, "Şam"),
  N("muhammedharbhavlani", "محمد بن حرب الخولاني", "Muhammed b. Harb el-Havlânî", 5, 194, "Humus"),
  N("muhammedsuaybsabur", "محمد بن شعيب بن شابور", "Muhammed b. Şuayb b. Şâbûr", 5, 200, "Şam"),
  N("ubeydullahmusa", "عبيد الله بن موسى العبسي", "Ubeydullah b. Mûsâ el-Absî", 5, 213, "Kûfe"),
  N("amrebiselemetennisi", "عمرو بن أبي سلمة التنيسي", "Amr b. Ebî Seleme et-Tinnîsî", 5, 214, "Mısır"),
  N("mafairan", "المعافى بن عمران", "Me‘âfâ b. İmrân", 5, 185, "Şam"),
  N("bisrbekirtennisi", "بشر بن بكر التنيسي", "Bişr b. Bekir et-Tinnîsî", 5, 205, "Mısır"),
  N("saidabdulaziz", "سعيد بن عبد العزيز التنوخي", "Saîd b. Abdil'azîz et-Tenûhî", 5, 167, "Şam"),
  N("asimbehdele", "عاصم بن بهدلة", "Âsım b. Behdele", 5, 128, "Kûfe", "Yedi kıraat imâmından."),
  N("alizeydcudan", "علي بن زيد بن جدعان", "Ali b. Zeyd b. Cüd‘ân", 5, 131, "Basra"),
  N("amiralhavl", "عامر الأحول", "Âmir el-Ahvel", 5, null, "Basra"),
  N("abdulvarissaid", "عبد الوارث بن سعيد", "Abdülvâris b. Saîd", 5, 180, "Basra"),
  N("abdulvehhabata", "عبد الوهاب بن عطاء", "Abdülvehhâb b. Atâ", 5, 204, "Basra"),
  N("abdesuleyman", "عبدة بن سليمان", "Abde b. Süleymân", 5, 187, "Kûfe"),
  N("muhammedbisrabdi", "محمد بن بشر العبدي", "Muhammed b. Bişr el-Abdî", 5, 203, "Kûfe"),
  N("muhammedebiadi", "محمد بن أبي عدي", "Muhammed b. Ebî Adî", 5, 194, "Basra"),

  // ---- Hammad b. Seleme cevresinde aga giren raviler ----
  N("simakharb", "سماك بن حرب", "Simâk b. Harb", 5, 123, "Kûfe"),
  N("suheylebisalih", "سهيل بن أبي صالح", "Süheyl b. Ebî Sâlih", 5, 138, "Medine", "Ebû Sâlih es-Semmân'ın oğlu."),
  N("selemekuheyl", "سلمة بن كهيل", "Seleme b. Küheyl", 5, 121, "Kûfe"),
  N("cureyri", "سعيد بن إياس الجريري", "Saîd b. İyâs el-Cüreyrî", 5, 144, "Basra", "Mizzî ihtilât kaydını nakleder."),
  N("abdullahavn", "عبد الله بن عون", "Abdullah b. Avn", 5, 151, "Basra"),
  N("ebuimrancevni", "أبو عمران الجوني", "Ebû İmrân el-Cevnî", 5, 128, "Basra"),
  N("abdulmelikumeyr", "عبد الملك بن عمير", "Abdülmelik b. Umeyr", 5, 136, "Kûfe"),
  N("ataisaib", "عطاء بن السائب", "Atâ b. es-Sâib", 5, 136, "Kûfe", "İhtilât ettiği kaydedilir."),
  N("ammarebiammar", "عمار بن أبي عمار", "Ammâr b. Ebî Ammâr", 4, null, "Mekke"),
  N("amryahyamazini", "عمرو بن يحيى المازني", "Amr b. Yahyâ el-Mâzinî", 5, null, "Medine"),
  N("ubeydullahomeri2", "عبد الرحمن بن القاسم", "Abdurrahman b. el-Kâsım", 5, 126, "Medine"),
  N("hebbanhilal", "هدبة بن خالد", "Hüdbe b. Hâlid", 5, 235, "Basra"),
  N("musaismailtebuzeki", "موسى بن إسماعيل التبوذكي", "Mûsâ b. İsmâîl et-Tebûzekî", 5, 223, "Basra"),
  N("hisamtayalisi", "أبو الوليد هشام الطيالسي", "Ebû'l-Velîd Hişâm et-Tayâlisî", 5, 227, "Basra"),
  N("muslimibrahim", "مسلم بن إبراهيم", "Müslim b. İbrâhim", 5, 222, "Basra"),
  N("amrmerzuk", "عمرو بن مرزوق", "Amr b. Merzûk", 5, 224, "Basra"),
  N("ebunasrtemmar", "أبو نصر التمار", "Ebû Nasr et-Temmâr", 5, 228, "Basra"),

  // ---- Ebu Avane cevresinde aga giren raviler ----
  N("caferebivahsiyye", "جعفر بن أبي وحشية", "Ca‘fer b. Ebî Vahşiyye (Ebû Bişr)", 5, 126, "Vâsıt"),
  N("asimahvel", "عاصم الأحول", "Âsım b. Süleymân el-Ahvel", 5, 142, "Basra"),
  N("mugirmiksem", "مغيرة بن مقسم الضبي", "Mugīre b. Miksem ed-Dabbî", 5, 136, "Kûfe"),
  N("firasyahya", "فراس بن يحيى الهمداني", "Firâs b. Yahyâ el-Hemdânî", 5, 129, "Kûfe"),
  N("mansurzazan", "منصور بن زاذان", "Mansûr b. Zâzân", 5, 131, "Vâsıt"),
  N("abdulmelikebisuleyman", "عبد الملك بن أبي سليمان", "Abdülmelik b. Ebî Süleymân", 5, 145, "Kûfe"),
  N("abdulazizsuheyb", "عبد العزيز بن صهيب", "Abdýlazîz b. Suheyb", 5, 130, "Basra"),
  N("saidmesrukhsevri", "سعيد بن مسروق الثوري", "Saîd b. Mesrûk es-Sevrî", 5, 126, "Kûfe", "Süfyân es-Sevrî'nin babası."),
  N("yalaata", "يعلى بن عطاء العامري", "Ya‘lâ b. Atâ el-Âmirî", 5, 120, "Vâsıt"),
  N("hilalvezzan", "هلال الوزان", "Hilâl el-Vezzân", 5, null, "Kûfe"),
  N("said_mansur", "سعيد بن منصور", "Saîd b. Mansûr", 5, 227, "Mekke", "es-Sünen sahibi. Rumûz م."),
  N("kavariri", "عبيد الله بن عمر القواريري", "Kavârîrî, Ubeydullah b. Ömer", 5, 235, "Basra"),
  N("seybanferruh", "شيبان بن فروخ", "Şeybân b. Ferrûh", 5, 236, "Basra"),
  N("haccacminhal", "حجاج بن منهال", "Haccâc b. Minhâl", 5, 217, "Basra"),
  N("halefhisam", "خلف بن هشام البزار", "Halef b. Hişâm el-Bezzâr", 5, 229, "Basra"),

  // ---- Huseym cevresinde aga giren raviler ----
  N("avvamhavseb", "العوام بن حوشب", "Avvâm b. Havşeb", 5, 148, "Vâsıt"),
  N("avfarabi", "عوف الأعرابي", "Avf el-A‘râbî", 5, 146, "Basra"),
  N("abdullahsubrume", "عبد الله بن شبرمة", "Abdullah b. Şübrume", 5, 144, "Kûfe"),
  N("abdulhamidcafer", "عبد الحميد بن جعفر", "Abdülhamîd b. Ca‘fer", 5, 153, "Medine"),
  N("sufyanhusayn", "سفيان بن حسين", "Süfyân b. Husayn", 5, null, "Vâsıt"),
  N("mucalidsaid", "مجالد بن سعيد", "Mücâlid b. Saîd", 5, 144, "Kûfe", "Mizzî, Ahmed b. Hanbel'den: Hüşeym ondan hiçbir şey işitmedi."),
  N("salihhayy", "صالح بن صالح بن حي", "Sâlih b. Sâlih b. Hayy", 5, null, "Kûfe"),
  N("siyarebilhakem", "سيار أبو الحكم", "Siyâr Ebû'l-Hakem", 5, 129, "Vâsıt"),
  N("kasimmihran", "القاسم بن مهران", "Kâsım b. Mihrân", 5, null, "Basra", "Hüşeym'in dayısı."),

  // ---- Huseym'in talebeleri ve Ibn Ishak cevresi ----
  N("saidsuleymansadeviye", "سعيد بن سليمان الواسطي", "Saîd b. Süleymân (Sa‘deveyh)", 5, 225, "Vâsıt", "Mizzî: Hüşeym'in hadisinin kıyyımı («ve hüve kayyimun bi-hadîsihî»)."),
  N("ibnebiseybe", "أبو بكر بن أبي شيبة", "Ebû Bekir b. Ebî Şeybe", 5, 235, "Kûfe", "el-Musannef sahibi. Rumûz م ق."),
  N("zuheyrharb", "زهير بن حرب أبو خيثمة", "Züheyr b. Harb Ebû Hayseme", 5, 234, "Basra"),
  N("alimedini", "علي بن المديني", "Ali b. el-Medînî", 5, 234, "Basra", "el-İlel sahibi. Bu ağın tabaka tasnifi ona aittir."),
  N("alihucr", "علي بن حجر المروزي", "Ali b. Hucr el-Mervezî", 5, 244, "Horasan"),
  N("amrnakid", "عمرو بن محمد الناقد", "Amr b. Muhammed en-Nâkıd", 5, 232, "Basra"),
  N("osmanebiseybe", "عثمان بن أبي شيبة", "Osmân b. Ebî Şeybe", 5, 239, "Kûfe"),
  N("ahmeddevraki", "أحمد بن إبراهيم الدورقي", "Ahmed b. İbrâhim ed-Devrakī", 5, 246, "Basra"),
  N("muhammedisataba", "محمد بن عيسى ابن الطباع", "Muhammed b. Ísâ İbnü't-Tabbâ‘", 5, 224, "Basra", "Mizzî: Hüşeym'i en iyi bilen («ve hüve a‘lemühum bihî»)."),
  N("yezidebihabib", "يزيد بن أبي حبيب", "Yezîd b. Ebî Habîb", 5, 128, "Mısır", "Mısır fakıhlerinin önde geleni. Mizzî: İbn İshak'ın hocalarından."),
  N("yalaubeyd", "يعلى بن عبيد الطنافسي", "Ya‘lâ b. Ubeyd et-Tanâfisî", 5, 209, "Kûfe"),
  N("yunusbukeyr", "يونس بن بكير الشيباني", "Yûnus b. Bükeyr eş-Şeybânî", 5, 199, "Kûfe", "İbn İshak'ın Megâzî'sinin râvilerinden."),
  N("abdrahmanesved", "عبد الرحمن بن الأسود", "Abdurrahman b. el-Esved", 3, null, "Kûfe"),

  // ---- Veki' cevresinde aga giren raviler ----
  N("aliebisalihhayy", "علي بن صالح بن حي", "Ali b. Sâlih b. Hayy", 5, 151, "Kûfe"),
  N("alimubarekhinai", "علي بن المبارك الهنائي", "Ali b. el-Mübârek el-Hinâî", 5, null, "Basra"),
  N("omerzerr", "عمر بن ذر الهمداني", "Ömer b. Zerr el-Hemdânî", 5, 153, "Kûfe"),
  N("mesudi", "عبد الرحمن بن عبد الله المسعودي", "Mes‘ûdî, Abdurrahman b. Abdillâh", 5, 160, "Kûfe"),
  N("suleymanmugire", "سليمان بن المغيرة", "Süleymân b. el-Mugīre", 5, 165, "Basra"),
  N("saidubeydtai", "سعيد بن عبيد الطائي", "Saîd b. Ubeyd et-Tâî", 5, null, "Kûfe"),
  N("davudkaysferra", "داود بن قيس الفراء", "Dâvûd b. Kays el-Ferrâ", 5, null, "Medine"),
  N("hanzalasufyan", "حنظلة بن أبي سفيان", "Hanzala b. Ebî Süfyân", 5, 151, "Mekke"),
  N("abdulazizomer", "عبد العزيز بن عمر بن عبد العزيز", "Abdülazîz b. Ömer b. Abdil‘azîz", 5, null, "Şam"),
  N("misned", "مسدد بن مسرهد", "Müsedded b. Müserhed", 5, 228, "Basra"),
  N("hennadseri", "هناد بن السري", "Hennâd b. es-Serî", 5, 243, "Kûfe"),
  N("ibnmain", "يحيى بن معين", "Yahyâ b. Ma‘în", 5, 233, "Basra", "Cerh-ta‘dîl imâmı. Bu ağdaki semâ kayıtlarının çoğu ondan nakledilir."),
  N("yahyayahyanisaburi", "يحيى بن يحيى النيسابوري", "Yahyâ b. Yahyâ en-Nîsâbûrî", 5, 226, "Horasan"),
  N("mahmudgaylan", "محمود بن غيلان", "Mahmûd b. Gaylân", 5, 239, "Horasan"),
  N("ibnebiomeradeni", "محمد بن يحيى بن أبي عمر العدني", "İbn Ebî Ömer el-Adenî", 5, 243, "Mekke"),
  N("nasralicehdami", "نصر بن علي الجهضمي", "Nasr b. Ali el-Cehdamî", 5, 250, "Basra"),

  // ---- Ibnu'l-Mubarek cevresinde aga giren raviler ----
  N("ibrahimtahman", "إبراهيم بن طهمان", "İbrâhim b. Tahmân", 5, 163, "Horasan"),
  N("ibrahimebiable", "إبراهيم بن أبي عبلة", "İbrâhim b. Ebî Able", 5, 152, "Şam"),
  N("usamezeydeslem", "أسامة بن زيد بن أسلم", "Üsâme b. Zeyd b. Eslem", 5, null, "Medine"),
  N("caferburkan", "جعفر بن برقان", "Ca‘fer b. Burkān", 5, 154, "Şam"),
  N("hayveseri", "حيوة بن شريح المصري", "Hayve b. Şureyh el-Mısrî", 5, 158, "Mısır"),
  N("saidebiyyubmisri", "سعيد بن أبي أيوب المصري", "Saîd b. Ebî Eyyûb el-Mısrî", 5, 161, "Mısır"),
  N("harmalaimran", "حرملة بن عمران التجيبي", "Harmala b. İmrân et-Tüceybî", 5, 160, "Mısır"),
  N("ebuburde", "بريد بن عبد الله بن أبي بردة", "Büreyd b. Abdillâh b. Ebî Bürde", 5, null, "Kûfe"),
  N("serieyyahya", "السري بن يحيى", "Serî b. Yahyâ", 5, 167, "Basra"),
  N("sadsaidensari", "سعد بن سعيد الأنصاري", "Sa‘d b. Saîd el-Ensârî", 5, 141, "Medine"),
  N("rebiuenes", "الربيع بن أنس", "Rabî‘ b. Enes", 5, 139, "Şam"),

  // ---- Ibnu'l-Mubarek'in talebeleri ve Yahya el-Kattan cevresi ----
  N("alihasansakik", "علي بن الحسن بن شقيق المروزي", "Ali b. el-Hasan b. Şakīk el-Mervezî", 5, 215, "Horasan", "Rumûz ع."),
  N("abdan", "عبد الله بن عثمان عبدان", "Abdân, Abdullah b. Osmân el-Mervezî", 5, 221, "Horasan", "Rumûz خ م د ت س."),
  N("suveydnasr", "سويد بن نصر الطوساني", "Süveyd b. Nasr et-Tûsânî", 5, 240, "Horasan"),
  N("hasanisad", "الجعيد بن عبد الرحمن", "Cu‘ayd b. Abdirrahman", 5, null, "Medine"),
  N("behzhakim", "بهز بن حكيم", "Behz b. Hakîm", 5, null, "Basra"),
  N("hatimebisagire", "حاتم بن أبي صغيرة", "Hâtim b. Ebî Sagīre", 5, 152, "Basra"),
  N("hasanzekvan", "الحسن بن ذكوان", "Hasan b. Zekvân", 5, null, "Basra"),
  N("selimhayyan", "سليم بن حيان", "Süleym b. Hayyân", 5, null, "Basra"),
  N("seyfsuleymanmekki", "سيف بن سليمان المكي", "Seyf b. Süleymân el-Mekkî", 5, null, "Mekke"),
  N("husaymirak", "خثيم بن عراك", "Husıym b. İrâk b. Mâlik", 5, null, "Medine"),
  N("esaseabdulmelik", "أشعث بن عبد الملك", "Eş‘as b. Abdilmelik el-Humrânî", 5, 142, "Basra"),

  // ---- Kattan'in talebeleri ve Ibn Mehdi cevresi ----
  N("bundar", "محمد بن بشار بندار", "Muhammed b. Beşşâr (Bündâr)", 5, 252, "Basra", "Rumûz ع."),
  N("ibnmusenna", "محمد بن المثنى أبو موسى", "Muhammed b. el-Müsennâ (Ez-Zemin)", 5, 252, "Basra"),
  N("amrbnalisayrafi", "عمرو بن علي الصيرفي", "Amr b. Ali es-Sayrafî (el-Fellâs)", 5, 249, "Basra"),
  N("abbasanberi", "عباس بن عبد العظيم العنبري", "Abbâs b. Abdil‘azīm el-Anberî", 5, 246, "Basra"),
  N("ubeydullahmuazanberi", "عبيد الله بن معاذ العنبري", "Ubeydullah b. Muâz el-Anberî", 5, 237, "Basra"),
  N("yakubdevraki", "يعقوب بن إبراهيم الدورقي", "Ya‘kûb b. İbrâhim ed-Devrakī", 5, 252, "Basra"),
  N("muaviyesalih", "معاوية بن صالح الحضرمي", "Muâviye b. Sâlih el-Hadramî", 5, 158, "Mısır", "Rumûz م ٤."),
  N("israilyunus", "إسرائيل بن يونس", "İsrâîl b. Yûnus", 5, 160, "Kûfe", "Ebû İshak es-Sebîî'nin torunu."),
  N("darevardi", "عبد العزيز بن محمد الدراوردي", "Abdülazîz b. Muhammed ed-Derâverdî", 5, 187, "Medine"),
  N("macisun", "عبد العزيز بن أبي سلمة الماجشون", "Abdülazîz b. Ebî Seleme el-Mâcişûn", 5, 164, "Medine"),
  N("harbseddad", "حرب بن شداد", "Harb b. Şeddâd", 5, 161, "Basra"),
  N("abdulvahidziyad", "عبد الواحد بن زياد", "Abdülvâhid b. Ziyâd", 5, 176, "Basra"),
  N("malikmigvel", "مالك بن مغول", "Mâlik b. Migvel", 5, 159, "Kûfe"),
  N("sallamebimuti", "سلام بن أبي مطيع", "Sellâm b. Ebî Mutī‘", 5, 164, "Basra"),

  // ---- Ibn Mehdi'nin talebeleri ve Yahya b. Adem cevresi ----
  N("abdhumeyd", "عبد بن حميد", "Abd b. Humeyd", 5, 249, "Horasan", "el-Müsned ve Tefsîr sahibi. Rumûz م."),
  N("ebukureyb", "أبو كريب محمد بن العلاء", "Ebû Küreyb Muhammed b. el-Alâ", 5, 248, "Kûfe"),
  N("muhammedrafi", "محمد بن رافع النيسابوري", "Muhammed b. Râfi‘ en-Nîsâbûrî", 5, 245, "Horasan"),
  N("zuhli", "محمد بن يحيى الذهلي", "Muhammed b. Yahyâ ez-Zühlî", 5, 258, "Horasan"),
  N("muhammedabdulalasanani", "محمد بن عبد الأعلى الصنعاني", "Muhammed b. Abdil'alâ es-San‘ânî", 5, 245, "Basra"),
  N("mucahidmusa", "مجاهد بن موسى", "Mücâhid b. Mûsâ", 5, 244, "Basra"),
  N("ebubekirayyas", "أبو بكر بن عياش", "Ebû Bekir b. Ayyâş", 5, 193, "Kûfe"),
  N("ebumuaviyedarir", "أبو معاوية الضرير", "Ebû Muâviye ed-Darîr", 5, 195, "Kûfe"),
  N("muhammedfudayl", "محمد بن فضيل بن غزوان", "Muhammed b. Fudayl b. Gazvân", 5, 195, "Kûfe"),
  N("fudaylibnayaz", "فضيل بن عياض", "Fudayl b. İyâz", 5, 187, "Mekke"),
  N("kaysrebi", "قيس بن الربيع", "Kays b. er-Rabî‘", 5, 168, "Kûfe"),
  N("fitrhalife", "فطر بن خليفة", "Fıtr b. Halîfe", 5, 155, "Kûfe"),
  N("abdusselamharb", "عبد السلام بن حرب", "Abdüsselâm b. Harb", 5, 187, "Kûfe"),

  // ---- Ibn Ebi Zaide cevresinde aga giren raviler ----
  N("halidselememahzumi", "خالد بن سلمة المخزومي", "Hâlid b. Seleme el-Mahzûmî", 5, null, "Kûfe"),
  N("abdulmelikhumeyd", "عبد الملك بن حميد بن أبي عيينة", "Abdülmelik b. Humeyd b. Ebî Uyeyne", 5, null, "Basra"),
  N("amrmeymunmihran", "عمرو بن ميمون بن مهران", "Amr b. Meymûn b. Mihrân", 5, null, "Şam"),
  N("musacuheni", "موسى الجهني", "Mûsâ el-Cühenî", 5, null, "Kûfe"),
  N("nafiomercumahi", "نافع بن عمر الجمحي", "Nâfi‘ b. Ömer el-Cümahî", 5, 169, "Mekke"),
  N("hasimhasim", "هاشم بن هاشم بن عتبة", "Hâşim b. Hâşim b. Utbe", 5, null, "Medine"),
  N("ebumalikesceyi", "أبو مالك الأشجعي", "Ebû Mâlik el-Eşce‘î", 5, null, "Kûfe"),
  N("leysebisuleym", "ليث بن أبي سليم", "Leys b. Ebî Süleym", 5, 143, "Kûfe"),
  N("harunmaruf", "هارون بن معروف", "Hârûn b. Ma‘rûf", 5, 231, "Basra"),
  N("ibrahimmusaferra", "إبراهيم بن موسى الفراء", "İbrâhim b. Mûsâ el-Ferrâ", 5, 220, "Kûfe"),
  N("sericyunus", "سريج بن يونس", "Serîc b. Yûnus", 5, 235, "Basra"),
  N("hasanarafe", "الحسن بن عرفة", "Hasan b. Arafe", 5, 257, "Basra"),
  N("muhammedubeydmuharibi", "محمد بن عبيد المحاربي", "Muhammed b. Ubeyd el-Muhâribî", 5, 245, "Kûfe"),

  // ---- Kütüb-i Sitte müellifleri ----
  N("buhari", "محمد بن إسماعيل البخاري", "Buhârî", 5, 256, "Mâverâünnehir", "el-Câmi‘u's-sahîh sahibi. Mizzî: «bu işin imâmı, kendisine uyulanı ve kitabı bütün İslâm ehli arasında dayanak olan.» Horasan, Cibâl, bütün Irak şehirleri, Hicaz, Şam ve Mısır'da hadis yazdı."),
  N("muslim", "مسلم بن الحجاج القشيري", "Müslim b. el-Haccâc", 5, 261, "Horasan", "es-Sahîh sahibi. Tehzîb 6245, Nîsâbûrî."),
  N("ebudavud", "أبو داود السجستاني", "Ebû Dâvûd es-Sicistânî", 5, 275, "Basra", "es-Sünen sahibi."),
  N("tirmizi", "محمد بن عيسى الترمذي", "Tirmizî", 5, 279, "Horasan", "el-Câmi‘ ve el-İlel sahibi."),
  N("nesai", "أحمد بن شعيب النسائي", "Nesâî", 5, 303, "Mısır", "es-Sünen sahibi."),
  N("ibnmace", "محمد بن يزيد ابن ماجه", "İbn Mâce", 5, 273, "Cibâl", "es-Sünen sahibi."),
  N("darimi", "عبد الله بن عبد الرحمن الدارمي", "Dârimî", 5, 255, "Horasan"),
  N("ebuzuraraazi", "أبو زرعة الرازي", "Ebû Zür‘a er-Râzî", 5, 264, "Cibâl"),
  N("ebuhatimrazi", "أبو حاتم الرازي", "Ebû Hâtim er-Râzî", 5, 277, "Cibâl"),
  N("harmalayahya", "حرملة بن يحيى التجيبي", "Harmala b. Yahyâ et-Tüceybî", 5, 243, "Mısır"),
  N("ishakkevsec", "إسحاق بن منصور الكوسج", "İshak b. Mansûr el-Kevsec", 5, 251, "Şam"),
  N("ibrahimmunzirhizami", "إبراهيم بن المنذر الحزامي", "İbrâhim b. el-Münzir el-Hizâmî", 5, 236, "Medine"),
  N("ademebiiyas", "آدم بن أبي إياس", "Âdem b. Ebî İyâs el-Askalânî", 5, 220, "Şam"),
  N("hasanaliayyal", "الحسن بن علي الخلال", "Hasan b. Ali el-Hallâl", 5, 242, "Basra"),
  N("suveydsaidhadesani", "سويد بن سعيد الحدثاني", "Süveyd b. Saîd el-Hadesânî", 5, 240, "Şam"),
  N("ibrahimkariz", "إبراهيم بن عبد الله بن قارظ", "İbrâhim b. Abdillâh b. Kâriz", 2, null, "Medine"),
  N("hakemmina", "الحكم بن ميناء", "Hakem b. Mînâ", 2, null, "Medine"),
  N("ishaktalha", "إسحاق بن عبد الله بن أبي طلحة", "İshak b. Abdillâh b. Ebî Talha", 4, 132, "Medine", "Rumûz خ م س."),
  N("abdullahebikatade", "عبد الله بن أبي قتادة", "Abdullah b. Ebî Katâde", 3, 95, "Medine", "Rumûz ع."),
  N("ebukilabe", "أبو قلابة الجرمي", "Ebû Kılâbe el-Cermî", 4, 104, "Basra", "Rumûz ع."),
  N("ebunadra", "أبو نضرة العبدي", "Ebû Nadra el-Abdî", 4, 108, "Basra"),
  N("ubeydullahmiksem", "عبيد الله بن مقسم", "Ubeydullah b. Miksem", 4, null, "Medine"),
  N("hilalebimeymune", "هلال بن أبي ميمونة", "Hilâl b. Ebî Meymûne", 4, null, "Medine"),
  N("muhammedibrahimteymi", "محمد بن إبراهيم التيمي", "Muhammed b. İbrâhim et-Teymî", 4, 120, "Medine"),
  N("alimubarek", "علي بن المبارك", "Ali b. el-Mübârek", 5, null, "Basra", "Rumûz ع."),
  N("hisamhassan", "هشام بن حسان", "Hişâm b. Hassân", 5, 148, "Basra"),
  N("haccacsavvaf", "حجاج بن أبي عثمان الصواف", "Haccâc b. Ebî Osmân es-Savvâf", 5, null, "Basra"),
  N("huseynmuallim", "حسين المعلم", "Hüseyin el-Muallim", 5, null, "Basra"),
  N("seybannahvi", "شيبان بن عبد الرحمن النحوي", "Şeybân b. Abdirrahman en-Nahvî", 5, 164, "Basra"),
  N("muaviyesellam", "معاوية بن سلام", "Muâviye b. Sellâm", 5, null, "Şam", "Rumûz ع."),
  N("yahyasaidensari", "يحيى بن سعيد الأنصاري", "Yahyâ b. Saîd el-Ensârî", 5, 143, "Medine", "Mizzî: Yahyâ b. Ebî Kesîr'in akranlarından."),
  N("ikrimeammar", "عكرمة بن عمار", "İkrime b. Ammâr", 5, 159, "Basra"),
  N("zeydeslem", "زيد بن أسلم", "Zeyd b. Eslem", 4, 136, "Medine", "Mizzî: Ebû Hüreyre'den semâı ihtilâflı («قيل لم يسمع منه»)."),
];

const E = (a, b, r, k) => ({ a, b, r, k });
const EDGES = [
  E("omer", "ali", "—", "Tehzîb 4089"),
  E("mikdad", "ali", "م د س ق", "Tehzîb 4089"),
  E("fatima", "ali", "—", "Tehzîb 4089"),
  E("ubey", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("usame", "ebuhureyre", "س", "Tehzîb 7681"),
  E("basra", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("omer", "ebuhureyre", "ع", "Tehzîb 7681"),
  E("fadl", "ebuhureyre", "م س", "Tehzîb 7681"),
  E("kabahbar", "ebuhureyre", "د ت س", "Tehzîb 7681"),
  E("aise", "ebuhureyre", "م د س ق", "Tehzîb 7681"),
  ...[["ahnef","ص"],["esvedyezid","—"],["alkame","عس"],["ubeydesel","ع"],["suveydgafle","خ م ت س"],
      ["ebuvail","ت عس"],["zirhubeys","م ٤"],["sureyh","س"],["saidmusayyeb","ت س ق"],["hasanbasri","ت س"],
      ["rebihiras","خ مق ٤"],["zeydvehb","خ م د س"],["zadan","د ص ق"],["ebutufeyl","خ م د س"],
      ["harissuveyd","خ م س"],["harisemudarrib","د س"],["salimcad","د س فق"],["hayseme","بخ"],
      ["ibrhunayn","س ق"],["abdhayr","٤"],["harisaver","٤"],["asimdamra","٤"],["sabi","خ د س"],
      ["ibnebileyla","ع"],["urve","د س"],["ikrime","س"],["zeynelabidin","ت س"],["ubeydullaherafi","ع"],
      ["umerbali","٤"],["abdrahmanharis","٤"],["ubeydumeyr","عس"],["saidzuhadan","عس"],
      ["ibnabbas","خ م د س ق"],["ibnomer","—"],["ibnmesud","—"],["ibnzubeyr","—"],["bera","د س"],
      ["zeydarkam","—"],["cabirsemura","—"],["cabir","—"],["suhayb","—"],["sefine","—"],
      ["hasanbali","—"],["huseyn","ع"],["amrhurays","—"],["tariksihab","—"],["besrsuhaym","س"],
      ["ibncafer","خ م ت س ق"],["enes","—"]].map(([b, r]) => E("ali", b, r, "Tehzîb 4089")),
  ...[["enes","خ م"],["cabir","م"],["hasanbasri","خ ٤"],["salimibnomer","خ م س"],["hafsasim","ع"],
      ["humeydavf","ع"],["esvedhilal","س"],["zurareevfa","ع"],["busrsaid","خ ٤"],["hilas","خ ت س ق"],
      ["besirnehik","ع"],["ibrhunayn","بخ ق"],["hayseme","ت"],["zeydeslem","ت"],["salimcad","س ق"],
      ["bece","م س ق"],["saidmusayyeb","—"]].map(([b, r]) => E("ebuhureyre", b, r, "Tehzîb 7681")),

  // Hz. Ebû Bekir'den rivayet edenler — Tehzîb 3418
  ...[["enes","ع"],["bera","خ م د"],["cabir","ت"],["zeydarkam","—"],["zeydsabit","خ ت س"],
      ["suveydgafle","—"],["tariksihab","خ"],["ibnzubeyr","خ ت س"],["ibnabbas","خ د تم س ق"],
      ["ibnomer","خ ت"],["ibnmesud","—"],["ali","٤"],["omer","خ م د ت س"],
      ["amrhurays","ت ق"],["ebutufeyl","د"],["ebuhureyre","ع"],["aise","ع"],
      ["saidmusayyeb","د"],["ebusalih","سي"],["kayshazim","٤"],
      ["abdrahmanebubekir","م قد"],["abdrahmanavf","—"],["osman","—"],["ukbeamir","—"],
      ["ebumusa","—"],["ebusaid","ت"],["huzeyfe","—"],["rifaazuraki","ت"],
      ["aizamr","م"],["murreserahil","ت ق"],["abdrahmanyerbu","ت ق"],["abdrahmanabza","—"],
     ].map(([b, r]) => E("ebubekir", b, r, "Tehzîb 3418")),

  // Hz. Peygamber'den rivayet — yalnız okunan tercemelerde açıkça kayıtlı olanlar
  E("nebi", "ali", "ع", "Tehzîb 4089"),
  E("nebi", "ebuhureyre", "ع", "Tehzîb 7681"),
  E("nebi", "ebubekir", "ع", "Tehzîb 3418"),
  E("nebi", "fatima", "—", "Tehzîb, Kitâbü'n-nisâ — sayfa teyidi yapılmadı"),

  // Hz. Ömer — Tehzîb 4225
  E("nebi", "omer", "بخ", "Tehzîb 4225"),
  E("ubey", "omer", "خ س", "Tehzîb 4225"),
  ...[["eslem","ع"],["esvedyezid","د"],["esaskays","د س ق"],["enes","خ م ت س ق"],["bera","—"],
      ["cabirsemura","س ق"],["cabir","ع"],["cerirbecelî","تم"],["huzeyfe","م"],["hasanbasri","د"],
      ["humeydavf","س"],["zeydsabit","خ ت س"],["salimcad","س"],["saibyezid","خ س"],
      ["sadvakkas","—"],["saidmusayyeb","٤"],["suveydgafle","م ت س"],["sureyh","س"],
      ["tariksihab","خ م ت س"],["talha","سي"],["abisrebia","خ م د ت س"],["asimomer","خ م د ت س"],
     ].map(([b, r]) => E("omer", b, r, "Tehzîb 4225")),

  // Hz. Osman — Tehzîb 3849
  E("nebi", "osman", "ع", "Tehzîb 3849"),
  E("omer", "osman", "—", "Tehzîb 3849"),
  ...[["ebanosman","بخ م ٤"],["ahnef","س"],["enes","خ ت س"],["busrsaid","س"],["hasanbasri","بخ ق"],
      ["hamranaban","ع"],["zeydsabit","—"],["zeydhalid","خ م"],["saibyezid","خ"],
      ["saidmusayyeb","خ م س ق"],["ebuvail","د ت ق"],["ebuumame","—"],["tariksihab","ت"],
      ["ibncafer","—"],["ibnzubeyr","خ ق"],["ibnabbas","د ت س"],["ibnomer","س"],
      ["abdrahmanharis","س"],["abdrahmanyezidnehai","م"],["alkame","م س"],["kayshazim","—"],
      ["malikevs","م د ت س"],["ibnhanefiyye","خ"],["mervan","خ س"],["mugirasube","—"],
      ["imranhusayn","—"],["selemeekva","تم"],["ataebirebah","ق"],["ebuabdrahmansulemi","خ ٤"],
     ].map(([b, r]) => E("osman", b, r, "Tehzîb 3849")),

  // ---- Zuhri, Tehzib 5606 ----
  ...[["ebanosman","سي"],["ibrhunayn","د ت س"],["ibrahimavf","ق"],["enes","ع"],
      ["sabitkayszuraki","بخ د سي ق"],["cabir","د"],["hasanhanefiyye","خ م كد س ق"],
      ["hafsasim","—"],["hamzaibnomer","ع"],["humeydavf","ع"],["haricezeyd","خ د ت س"],
      ["rafihadic","س"],["ibnomer","س"],["abdullahkab","خ م د س ق"],
      ["arac","ع"],["ubeydullahutbe","ع"],["ubeydullaherafi","د"],["urve","ع"],
      ["ataebirebah","خ م د س"],["zeynelabidin","ع"],["alkamevakkas","خ م د ت س"],
     ].map(([a, r]) => E(a, "ibnsihab", r, "Tehzîb 5606")),
  ...[["ibrahimsad","خ م د س ق"],["usamezeydleysi","د ت ق"],["eyyubsahtiyani","س"],
      ["haccacertat","د ق"],["ibnuyeyne","ع"],["zeydeslem","—"],["salihkeysan","ع"],
      ["suaybebihamza","ع"],
     ].map(([b, r]) => E("ibnsihab", b, r, "Tehzîb 5606")),

  // ---- Katade, Tehzib (bab el-kaf, s. 23/499-505) ----
  ...[["enes","ع"],["hasanbasri","ع"],["cabirzeyd","ع"],["ebulaliye","ع"],
      ["bekirmuzeni","س"],["zurareevfa","ع"],["salimcad","خ م ت س"],
      ["saidmusayyeb","خ م ت س ق"],["hayseme","ت"],["hilas","م ٤"],
      ["humeydavf","سي"],["sefine","س"],
     ].map(([a, r]) => E(a, "katade", r, "Tehzîb, Kâf bölümü")),
  ...[["eyyubsahtiyani","د س ق"],["haccacertat","د"],["hammadseleme","خت م ٤"],
      ["ibnebiaruba","ع"],["amess","—"],["sube","ع"],["evzai","م د ت ق"],
      ["mamer","خت م ٤"],["hisamdestuvai","ع"],["hemmamyahya","ع"],
      ["ebuavane","ع"],["cerirhazim","ع"],["misersukdam","خ م"],
      ["leysbsad","س"],["amrharis","خ م س"],["suleymanteymi","خ م د س ق"],
     ].map(([b, r]) => E("katade", b, r, "Tehzîb, Kâf bölümü")),

  // ---- A'mes, Tehzib 2570 ----
  ...[["nehai","ع"],["ibrahimteymi","ع"],["habibebisabit","م ٤"],["enes","د ت"],
      ["ebuduha","ع"],["yahyavessab","بخ ت ق"],["mearrursuveyd","ع"],
      ["hakemuteybe","—"],
     ].map(([a, r]) => E(a, "amess", r, "Tehzîb 2570")),
  ...[["sevri","ع"],["ibnuyeyne","خ م ت"],["sube","خ م د ت س"],
      ["ibnmubarek","س"],["hafsgiyas","ع"],["cerirabdulhamid","ع"],
      ["cerirhazim","م"],["ibnnumeyr","م ٤"],["ibnidris","م ق"],
      ["alimushir","خ م ت س ق"],["suleymanteymi","ت"],["hakemuteybe","—"],
     ].map(([b, r]) => E("amess", b, r, "Tehzîb 2570")),

  // ---- Amr b. Dinar el-Mekki, Tehzib 4360 ----
  ...[["cabirzeyd","ع"],["cabir","ع"],["hasanhanefiyye","خ م د ت س"],
      ["ebusalih","خ م س ق"],["salimibnomer","خ م د س"],["saibyezid","—"],
      ["saidcubeyr","ع"],["saidmusayyeb","—"],["suleymanyesar","م"],["tavus","ع"],
      ["ibnzubeyr","—"],["ibnabbas","ع"],["ibnomer","ع"],["ubeydumeyr","فق"],
      ["urve","م"],["ataebirebah","ع"],["ikrime","خ ٤"],["kureyb","خ م ت س ق"],
      ["mucahid","خ م س"],["ebucafermuhbakir","خ م د س"],["ibnsihab","خ م ت س ق"],
      ["vehbmunebbih","خ م ت س"],["ebutufeyl","ر م"],["ebuselemeavf","م س"],
      ["ebuhureyre","ق"],
     ].map(([a, r]) => E(a, "amrdinar", r, "Tehzîb 4360")),
  ...[["eyyubsahtiyani","خ م"],["hammadzeyd","خ م د ت س"],["hammadseleme","س"],
      ["davudattar","ع"],["zekeriyyaishak","ع"],["sevri","خ م"],
      ["ibnuyeyne","ع"],["sube","خ م س"],["ibncureyc","خ م د س"],
      ["katade","—"],["malik","—"],["misersukdam","—"],["huseym","م"],
      ["ebuavane","خ"],["varkaomer","خ م د ت س"],["amrharis","—"],
     ].map(([b, r]) => E("amrdinar", b, r, "Tehzîb 4360")),

  // ---- Ebu Ishak es-Sebii, Tehzib 4400 ----
  ...[["esaskays","—"],["esvedyezid","ع"],["enes","سي"],["bera","ع"],
      ["egarebumuslim","بخ م"],["usame","—"],["amrmeymun","ع"],
      ["mesruk","م د س"],["kayshazim","—"],["mucahid","س"],
      ["ebucafermuhbakir","خ"],["musatalha","م"],["nafiibnomer","س ق"],
      ["numanbesir","خ م ت"],["mugirasube","—"],
     ].map(([a, r]) => E(a, "ebuishaksebii", r, "Tehzîb 4400")),
  ...[["sevri","ع"],["ibnuyeyne","ت سي"],["amess","م ت س ق"],
      ["sube","ع"],["suleymanteymi","ت س"],["zuhayrmuaviye","ع"],
      ["zaidekudame","د"],["ibnebizaide","خ م د س"],["ebulahvess","ع"],
      ["serikkadi","٤"],["hamzazeyyat","٤"],["katade","س"],
     ].map(([b, r]) => E("ebuishaksebii", b, r, "Tehzîb 4400")),

  // ---- Yahya b. Ebi Kesir, Tehzib 6907 ----
  ...[["ibrahimkariz","م د ت"],["ishaktalha","خ م س"],["enes","س"],
      ["bece","خ م مد ت س"],["cabir","مد"],["hafsasim","—"],
      ["hakemmina","ق"],["saibyezid","—"],["suleymanyesar","—"],
      ["abdullahebikatade","ع"],["evzai","م"],["ubeydullahmiksem","خ م د س"],
      ["urve","ت ق"],["ataebirebah","س ق"],["ikrime","خ ٤"],
      ["muhammedibrahimteymi","خ م س"],["nafiibnomer","س"],
      ["hilalebimeymune","خ م د س"],["ebuselemeavf","ع"],["ebukilabe","ع"],
      ["ebunadra","م"],["ebuumame","م"],
     ].map(([a, r]) => E(a, "yahyaebikesir", r, "Tehzîb 6907")),
  ...[["eyyubsahtiyani","م"],["cerirhazim","—"],["haccacsavvaf","م ٤"],
      ["huseynmuallim","خ م د ت س"],["seybannahvi","خ م س"],
      ["evzai","ع"],["ikrimeammar","خت م د ق"],["alimubarek","ع"],
      ["muaviyesellam","ع"],["mamer","خ م د ت س"],["hisamhassan","ق"],
      ["hisamdestuvai","خ م س"],["hemmamyahya","خ م"],["yahyasaidensari","—"],
     ].map(([b, r]) => E("yahyaebikesir", b, r, "Tehzîb 6907")),

  // ---- Ibn Abbas, Tehzib 3358 ----
  ...[["ubey","ع"],["usame","خ م س ق"],["bureyde","س"],["temimdari","ت"],
      ["halidvelid","خ م د س ق"],
     ].map(([a, r]) => E(a, "ibnabbas", r, "Tehzîb 3358")),
  ...[["hasanbasri","د ت س"],["hakemmina","س ق"],["humeydavf","خ م ت س"],
      ["ebusalih","خ م س ق"],["ebulaliye","ع"],["zurareevfa","ت س"],
      ["salimcad","س ق"],["saidcubeyr","ع"],["saidmusayyeb","خ م د س ق"],
      ["saidyesar","م د س"],["suleymanyesar","ع"],["sehrhavseb","بخ ت س"],
      ["dahhak","ت س ق"],["tavus","ع"],["sabi","ع"],["ebutufeyl","م د ت ق"],
      ["ibnebimuleyke","ع"],["ubeydullahebiyezid","ع"],["ubeydullahutbe","ع"],
      ["abdullahmabed","م د س ق"],["ebulminhal","ع"],["hakemarac","م د ت س"],
      ["ebuzabyan","خ د ت س"],["ikrime","ع"],["mucahid","ع"],["ataebirebah","ع"],
      ["kureyb","ع"],["ibnsihab","—"],
     ].map(([b, r]) => E("ibnabbas", b, r, "Tehzîb 3358")),

  // ---- Ibn Omer, Tehzib 3441 ----
  ...[["bilal","ع"],["rafihadic","م د س ق"],["zeydsabit","ع"],
      ["sadvakkas","خ س"],["suhayb","٤"],["amirrebia","ع"],["ibnmesud","ت"],
      ["omer","ع"],
      ["ebusaid","خ"],["hafsa","ع"],["aise","م ت س"],["ebulubabe","م د"],
     ].map(([a, r]) => E(a, "ibnomer", r, "Tehzîb 3441")),
  ...[["eslem","خ م ق"],["enessirin","خ م ت ق"],["busrsaid","م"],
      ["sabitbunani","م س"],["cebeleshim","ع"],["habibebisabit","٤"],
      ["hasanbasri","س ق"],["hafsasim","خ م د س ق"],["hakemmina","م س ق"],
      ["hamzaibnomerogul","ع"],["humeydavf","خ م س"],["ebusalih","م د"],
      ["zadan","بخ م د ت س"],["zeydeslem","ع"],["salimcad","خ"],
      ["salimibnomer","ع"],["sadubeyde","خ م د ت ص"],["saidcubeyr","ع"],
      ["saidmusayyeb","خ م س ق"],["saidyesar","ع"],["suleymanyesar","د س"],
      ["safvanmuhriz","خ م س ق"],["tavus","ع"],["abdullahdinar","ع"],
      ["nafiibnomer","—"],["ataebirebah","—"],
     ].map(([b, r]) => E("ibnomer", b, r, "Tehzîb 3441")),

  // ---- Enes b. Malik, Tehzib (bab el-elif, s. 3/355-356) ----
  ...[["sumameenes","ع"],["sabitbunani","ع"],["hasanbasri","ع"],["bekirmuzeni","ع"],
      ["humeydtavil","ع"],["hafsubeydullahenes","خ م ت س ق"],["cadebuosman","خ م د ت س"],
      ["enessirin","—"],["rebiaebiabdrahman","خ م ت س"],["ebulaliye","ت"],
      ["habibebisabit","ت"],["bekirahnes","م"],["zubeyradi","خ م ت"],
      ["beyanbisr","خ ت س"],["bisryesar","خ"],["salimcad","خ م"],
      ["zeydeslem","س"],["ibnomer","—"],
     ].map(([b, r]) => E("enes", b, r, "Tehzîb, bâbü'l-elif")),

  // ---- Cabir b. Abdullah, Tehzib (bab el-cim) ----
  ...[["ebuzubeyrmekki","ع"],["ibnmunkedir","ع"],["vehbkeysan","٤"],
      ["ebucafermuhbakir","ع"],["muhammedabbadcafer","خ م س ق"],
      ["muhammedsevban","خ ٤"],["mahmudlebid","بخ د"],["ebunadra","خ م ٤"],
      ["ebuselemeavf","ع"],["yezidsuheybfakir","خ م د س ق"],
      ["vehbmunebbih","د"],["ataebirebah","—"],["saidcubeyr","—"],
     ].map(([b, r]) => E("cabir", b, r, "Tehzîb, bâbü'l-cîm")),

  // ---- Ebu Said el-Hudri, Tehzib (bab es-sin, s. 10/298) ----
  ...[["kasimmuhaymire","ق"],["katade","د"],["kazaayahya","ع"],["mucahid","س"],
      ["ibnsirin","س"],["muhammedsevban","د"],["ebucafermuhbakir","٤"],
      ["mahmudlebid","ق"],["mabedsirin","خ م د س"],["nafiibnomer","خ م ت س"],
      ["numanebiayyas","خ م ت س ق"],["yahyaumare","ع"],["ebuumamesehl","خ م د ت س"],
      ["ebusaidmakburi","خ س"],["ebuselemeavf","ع"],["ebusalih","ع"],
      ["ebussiddiknaci","ع"],["ebulaliye","س"],["ebuidrishavlani","م"],
      ["ebunadra","—"],["muhammedibrahimteymi","ت ق"],
     ].map(([b, r]) => E("ebusaid", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Aise, Tehzib 8862 (Kitabu'n-nisa) ----
  ...[["nehai","د س ق"],["ibrahimteymi","د س"],["esvedyezid","ع"],
      ["hasanbasri","د س"],["hamzaibnomerogul","م س"],["hilas","د س"],
      ["hayseme","د ت ق"],["ebusalih","د ت ق"],["zekvanmevlaaise","خ م د س"],
      ["zadan","سي"],["zurareevfa","د"],["zirhubeys","تم"],["zeydeslem","د"],
      ["zeydhalid","د سي"],["salimcad","د"],["salimibnomer","س"],
      ["saibyezid","ت"],["sadhisam","ع"],["saidcubeyr","—"],["ebusaidmakburi","س"],
      ["saidmusayyeb","ع"],["suleymanyesar","ع"],["sureyhhani","بخ م ٤"],
      ["ebuvail","ت س"],["sehrhavseb","بخ"],["tavus","م ت س"],
      ["abisrebia","خ م ت س ق"],["sabi","د ت س"],["abbadabdullahzubeyr","ع"],
      ["ibnzubeyr","ع"],["abdullahsedddad","خ م د ق"],["abdullahsakik","م ٤"],
      ["ibnabbas","خ ت س"],["ibnebimuleyke","ع"],["amrabdrahmanzurara","ع"],["kasimmuhammed","ع"],
     ].map(([b, r]) => E("aise", b, r, "Tehzîb 8862")),

  // ---- Malik b. Enes, Tehzib (bab el-mim, s. 27/93-109) ----
  ...[["ishaktalha","ع"],["eyyubsahtiyani","د ت س"],["caferisadik","م ت س ق"],
      ["humeyskaysarac","خ س"],["humeydtavil","خ م د ت س"],["hubeybabdrahman","م ت"],
      ["davudhusayn","ع"],["rebiaebiabdrahman","خ م د ت س"],["ziyadsad","عخ م س"],
      ["zeydeslem","خ م د ت س"],["salimebinadr","ع"],["nafiibnomer","ع"],
      ["yahyasaidensari","خ م د ت س"],["yezidrouman","خ م د س"],
      ["yezidkusayt","م د س ق"],["yezidhad","خ د ت س"],["ataihorasani","مد"],
      ["abdulmecidsuheyl","خ م س"],["ibnsihab","ع"],["ibnmunkedir","ع"],
      ["ebuzubeyrmekki","م"],["abdullahdinar","ع"],].map(([a, r]) => E(a, "malik", r, "Tehzîb, bâbü'l-mîm")),
  ...[["ibnuyeyne","س"],["sube","م ت س ق"],["sevri","—"],["ibnmubarek","خ م ت س"],
      ["ibnidris","ت"],["ibnvehb","خ م س"],["kanebi","خ م د ت"],
      ["ibnkasimmisri","مد س"],["ibnmehdi","ع"],["safii","—"],["kuteybesaid","خ م د ت س"],
      ["ibnebiuveys","خ م"],["ibnuleyye","—"],["velidmuslim","—"],
      ["ebunuaymfadl","خ س"],["ebuasimnebil","خ"],["veki","—"],
      ["kattan","خ"],["ibnebizaide","س"],["leysbsad","—"],["evzai","—"],
      ["ibncureyc","—"],
     ].map(([b, r]) => E("malik", b, r, "Tehzîb, bâbü'l-mîm")),

  // ---- Su'be b. el-Haccac, Tehzib (bab es-sin, s. 12/480-489) ----
  ...[["ismailebihalid","خ م"],["enessirin","خ م د س ق"],["eyyubsahtiyani","خ م س"],
      ["sabitbunani","خ م د ت س"],["cebeleshim","خ م س"],["cameseddad","خ م د س ق"],
      ["caferisadik","—"],["habibebisabit","خ م س"],["hakemuteybe","خ م د ت س"],
      ["hammadebisuleyman","م د ت س"],["huseynmuallim","خ"],["husaynabdrahman","خ م س"],
      ["humeydtavil","خ م س"],["halidhazza","خ م د س"],["hubeybabdrahman","ع"],
      ["davudebihind","س"],["rebiaebiabdrahman","—"],["zubeydyami","خ م د س ق"],
      ["zekeriyyaebizaide","—"],["sadibrahim","ع"],["ibnsihab","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "sube", r, "Tehzîb, bâbü'ş-şîn")),
  ...[["gunder","ع"],["kattan","ع"],["ibnmehdi","ع"],["veki","ع"],
      ["ibnmubarek","خ مق ت س"],["ibnidris","خ م د ت س"],["ibnebizaide","ت"],
      ["yezidharun","خ م ت س ق"],["yezidzurey","م د س ق"],["nadrsumeyl","خ م ت س ق"],
      ["ebudavudtayalisi","خت م د ت س"],["muazmuaz","خ م د س"],["affanmuslim","م س"],
      ["alicad","خ د"],["abdussamed","خ م ت س ق"],["isabyunus","م سي"],
      ["huseym","س"],["ebunuaymfadl","—"],["ebuasimnebil","خ"],["kanebi","د"],
      ["ibnuleyye","ت س"],["varkaomer","س"],
     ].map(([b, r]) => E("sube", b, r, "Tehzîb, bâbü'ş-şîn")),

  // ---- Sufyan es-Sevri, Tehzib (bab es-sin, s. 11/155-162) ----
  ...[["ibrahimukbe","م د س ق"],["ismailumeyye","م مد ت س ق"],["ismailebihalid","خ م"],
      ["suddi","م د ت س"],["esvedkays","ع"],["eyyubsahtiyani","خ م س"],
      ["sevryezid","خ د س"],["cabircufi","د ق"],["cameseddad","خ ت"],
      ["cebeleshim","خ م ت س ق"],["caferisadik","م ٤"],["habibebisabit","خ م ت س ق"],
      ["hasanubeydullah","م س"],["hasanamrfukaymi","خ د س"],["husaynabdrahman","خ م س"],
      ["hammadebisuleyman","م س ق"],["ebuhasin","ع"],["katade","—"],["ibnsihab","—"],
      ].map(([a, r]) => E(a, "sevri", r, "Tehzîb, bâbü's-sîn")),
  ...[["ishakyusufezrak","ع"],["ibnuleyye","م"],["cerirabdulhamid","—"],
      ["caferavn","خ م"],["hafsgiyas","—"],["ebuusamehammad","خ م ق"],
      ["halidharis","خ"],["ruhubade","م عس"],["zaidekudame","—"],
      ["zuhayrmuaviye","—"],["ibnuyeyne","—"],["suleymanbilal","—"],
      ["ebudavudtayalisi","س"],["ebulahvess","—"],["ebuasimnebil","خ م ت"],
      ["damrarebia","س ق"],["bisrsari","م ت س"],["abdurrezzak","—"],
      ["veki","—"],["ibnmubarek","—"],["ibnmehdi","—"],["kattan","—"],
      ["malik","—"],["yahyaadem","—"],
     ].map(([b, r]) => E("sevri", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Sufyan b. Uyeyne, Tehzib 2413 (s. 11/182-183) ----
  ...[["ibnmunkedir","ع"],["hisamurve","ع"],["yahyasaidensari","خ م س ق"],
      ["mansurmutemir","خ م ت"],["mansursafiyye","خ م د س"],["mamer","خ م ت س ق"],
      ["misersukdam","خ م ت ق"],["musaukbe","خ"],["muhammedacilan","بخ م د ت ق"],
      ["muhammedamralkame","خ م ت"],["muhammedsuka","خ ت ق"],["mutarriftarif","خ م ت س ق"],
      ["ismailebiislamsibani","خ م د ق"],["velidkesir","خ م س ق"],["yezidhusayfe","م د تم س ق"],
      ["yezidhad","س"],["hisamhassan","م س"],["ebuzubeyrmekki","م ت س ق"],
      ["ataebirebah","—"],
     ].map(([a, r]) => E(a, "ibnuyeyne", r, "Tehzîb 2413")),
  ...[["ahmedhanbel","م د"],["ibnrahuye","خ م س"],["ahmedsalihmisri","د"],
      ["ahmedmeni","ت ق"],["ibrahimfezari","—"],["safii","—"],
      ["kattan","—"],["ibnmehdi","—"],["kuteybesaid","—"],
     ].map(([b, r]) => E("ibnuyeyne", b, r, "Tehzîb 2413")),

  // ---- Ibn Cureyc, Tehzib (s. 18/341-344) ----
  ...[["abdullahtavus","م د س"],["ibnebimuleyke","ع"],["ibnhuseymkhaysem","س"],
      ["abdulhamidcubeyr","ع"],["abdulkerimcezeri","خ م ت س"],["ataebirebah","ع"],
      ["ataihorasani","خ م ق"],["ikrimehalid","خ د س"],["ikrime","ت"],
      ["amrsuayb","٤"],["kasimebibezze","خ م س"],
      ["alaabdrahman","ر م"],["mucahid","فق"],["muhammedabbadcafer","خ م د س ق"],
      ["yahyasaidensari","م"],["ubeydullahomeri","خ م س ق"],["ubeydullahebiyezid","م د ت س"],
      ["ibnsihab","—"],["hisamurve","—"],["nafiibnomer","—"],
     ].map(([a, r]) => E(a, "ibncureyc", r, "Tehzîb, bâbü'l-ayn")),
  ...[["haccacmuhammed","ع"],["ibnuleyye","خ م د س"],["ismailayyas","س"],
      ["enesiyaz","م"],["sevryezid","س ق"],["caferavn","س"],["hafsgiyas","م د س"],
      ["ebuusamehammad","م"],["hammadzeyd","خ"],["hammadseleme","—"],
      ["halidharis","م س"],["ruhubade","خ م ت ق"],["davudattar","د س"],
      ["sevri","—"],["ibnuyeyne","—"],["abdurrezzak","—"],
     ].map(([b, r]) => E("ibncureyc", b, r, "Tehzîb, bâbü'l-ayn")),

  // ---- Ma'mer b. Rasid, Tehzib (s. 28/305-306) ----
  //  Bu tercemede İbnü'l-Medînî'nin ikinci tabaka ifadesi aynen geçer:
  //  «fe-li-ehli'l-Basra Şu‘be ve Saîd b. Ebî Arûbe ve Hammâd b. Seleme ve Ma‘mer b. Râşid»
  ...[["ibnsihab","ع"],["ibnmunkedir","م ت"],["hisamurve","خ م د س"],
      ["hemmammunebbih","ع"],["matarverrak","س"],["mansurmutemir","—"],
      ["ebuishaksebii","—"],
      ["amrdinar","—"],["eyyubsahtiyani","—"],
     ].map(([a, r]) => E(a, "mamer", r, "Tehzîb, bâbü'l-mîm")),
  ...[["abdurrezzak","ع"],["hisamyusufsanani","خ د ت س"],["ibnmubarek","خ م ت س ق"],
      ["ibnuleyye","م س"],["sevri","خ ت س ق"],
      ["mutemirsuleyman","م س"],["abdulalaabdulala","خ م س ق"],["isabyunus","م س ق"],
      ["yezidzurey","خ م ت س"],["gunder","خ"],["hammadzeyd","—"],
      ["vuheybhalid","—"],["ebansattar","د"],["mervanfezari","—"],
      ["vakidi","—"],["ibncureyc","م س"],["ibnebiaruba","—"],
      ["sube","—"],["hisamdestuvai","س"],["davudattar","ت"],
     ].map(([b, r]) => E("mamer", b, r, "Tehzîb, bâbü'l-mîm")),

  // ---- Evzai, Tehzib 3918 (s. 17/308-309) ----
  ...[["ishaktalha","خ م س"],["hassanatiyye","ع"],["rebiaebiabdrahman","م"],
      ["rebiayezid","س ق"],["suleymanhabib","خ د ق"],["amess","—"],
      ["suleymanmusadimaski","مق"],["saddadebuammar","م ٤"],["hakemuteybe","—"],
      ["abdelubabe","خ م ت س"],["ataebirebah","خ م د س ق"],["ataihorasani","س"],
      ["ikrimehalid","—"],["amrsuayb","ر د سي"],["umeyrhani","ع"],
      ["kasimmuhaymire","—"],["kurrahayvil","٤"],
      ["muhammedibrahimteymi","م"],["ibnsirin","ق"],["muhammedabbadcafer","—"],
      ["ebucafermuhbakir","م"],["ibnsihab","ع"],["ibnmunkedir","—"],
      ["muhammedvelidzubeydi","د س"],["mutallibhantab","ر س ق"],["mekhul","ق"],
      ["nafiibnomer","خ ق"],["yahyasaidensari","م س"],["meymunmihran","—"],["ibncureyc","ق"],
     ].map(([a, r]) => E(a, "evzai", r, "Tehzîb 3918")),

  // ---- Evzai'nin talebeleri, Tehzib 3918 (s. 17/310-311) ----
  ...[["ibrahimfezari","س"],["ismailayyas","ر"],["enesiyaz","س"],["bakiyyevelid","خت ق"],
      ["ibnmubarek","خ م ت سي ق"],["ibnnumeyr","—"],["abdurrezzak","س"],
      ["ebulmugirehavlani","ع"],["ubeydullahmusa","خ ق"],["isabyunus","م"],
      ["suaybishakdimaski","خ م د س"],["muhammedharbhavlani","خ س"],
      ["muhammedsuaybsabur","د س ق"],["firyabi","ع"],["hikalziyad","م ٤"],
      ["veki","م"],["mafairan","خ د س"],["amrebiselemetennisi","خ م"],
      ["bisrbekirtennisi","خ د س"],["damrarebia","س"],["saidabdulaziz","—"],
      ["sevri","—"],["sube","—"],["malik","—"],["ebuasimnebil","—"],
     ].map(([b, r]) => E("evzai", b, r, "Tehzîb 3918")),

  // ---- Ibn Ebi Aruba, Tehzib (s. 11/6-9) ----
  ...[["eyyubsahtiyani","د ت س"],["hasanbasri","—"],["amess","—"],
      ["asimbehdele","—"],["alizeydcudan","—"],["amiralhavl","س ق"],
      ["ikrimeammar","—"],
     ].map(([a, r]) => E(a, "ibnebiaruba", r, "Tehzîb, bâbü's-sîn")),
  ...[["abdulvarissaid","خ ت س"],["abdulvehhabata","عخ م د س"],["abdesuleyman","م د س ق"],
      ["alimushir","م"],["isabyunus","م د س"],["muhammedbisrabdi","م ت ق"],
      ["gunder","م د"],["muhammedebiadi","خ م د ت ق"],["muazmuaz","د"],
      ["nadrsumeyl","ق"],["kattan","خ م د س"],["yezidzurey","ع"],
      ["yezidharun","—"],["ruhubade","—"],["halidharis","—"],
     ].map(([b, r]) => E("ibnebiaruba", b, r, "Tehzîb, bâbü's-sîn")),

  // ---- Hammad b. Seleme, Tehzib 1481 (s. 7/254-258) ----
  ...[["ishaktalha","م د س ق"],["enessirin","م د س"],["eyyubsahtiyani","خت م ٤"],
      ["sabitbunani","خت م ٤"],["sumameenes","د س"],["haccacertat","ت ق"],
      ["hammadebisuleyman","د س ق"],["humeydtavil","خت م ٤"],["halidhazza","—"],
      ["davudebihind","م د ق"],["rebiaebiabdrahman","م"],["zeydeslem","—"],
      ["sadibrahim","خت"],["cureyri","م د س"],["selemekuheyl","م د"],
      ["suleymanteymi","م س"],["simakharb","ر م ٤"],["suheylebisalih","م د سي"],
      ["asimbehdele","د س ق"],["amiralhavl","د"],["ibnebimuleyke","—"],
      ["ibnhuseymkhaysem","د ق"],["abdullahavn","—"],["ubeydullahomeri2","م د"],
      ["ebuimrancevni","خت م د ت س"],["abdulmelikumeyr","م"],
      ["ubeydullahomeri","خت م د ق"],["ataisaib","د س ق"],["ataihorasani","د ت"],
      ["ikrimehalid","—"],["alizeydcudan","بخ م د ت ق"],["ammarebiammar","م قد ت س ق"],["amryahyamazini","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "hammadseleme", r, "Tehzîb 1481")),
  ...[["ibnmehdi","م ت س ق"],["abdussamed","م ت ق"],["affanmuslim","م ٤"],
      ["ebunuaymfadl","—"],["hebbanhilal","م"],["musaismailtebuzeki","خت د س ق"],
      ["hisamtayalisi","—"],["muslimibrahim","د س"],["amrmerzuk","—"],
      ["ebunasrtemmar","م س"],["nadrsumeyl","م س ق"],["muazmuaz","ت"],
      ["malik","—"],["ibnuleyye","—"],
     ].map(([b, r]) => E("hammadseleme", b, r, "Tehzîb 1481")),

  // ---- Ebu Avane el-Vasiti, Tehzib (s. 30/443-444) ----
  ...[["caferebivahsiyye","خ م د ت س"],["husaynabdrahman","خ م س"],["hakemuteybe","م"],
      ["hammadebisuleyman","—"],["davudebihind","—"],["sadibrahim","م س"],
      ["saidmesrukhsevri","خ ت"],["amess","خ م ت س ق"],["simakharb","ي م د ت س"],
      ["suheylebisalih","م د ت"],["asimbehdele","د س"],["asimahvel","خ م"],
      ["abdullahavn","—"],["abdulazizsuheyb","م د ت س"],["abdulmelikebisuleyman","س"],
      ["abdulmelikumeyr","بخ م"],["ataisaib","ت"],
      ["firasyahya","خ م د س"],["ibnishak","ر"],
      ["ibnmunkedir","م س"],["mutarriftarif","س"],["mugirmiksem","خ م"],
      ["mansurzazan","م س"],["mansurmutemir","م"],["ismailebiislamsibani","خ م"],
      ["ebuzubeyrmekki","م س ق"],["ebuhasin","خ م ق"],["hilalvezzan","خ م د س"],
      ["yalaata","م د س"],
     ].map(([a, r]) => E(a, "ebuavane", r, "Tehzîb, bâbü'l-vâv")),
  ...[["ibnuleyye","—"],["ibnmehdi","—"],["said_mansur","م"],["kavariri","م"],
      ["seybanferruh","م س"],["haccacminhal","خ"],["halefhisam","د"],
      ["affanmuslim","—"],["musaismailtebuzeki","—"],["hisamtayalisi","—"],
     ].map(([b, r]) => E("ebuavane", b, r, "Tehzîb, bâbü'l-vâv")),

  // ---- Huseym b. Besir, Tehzib (s. 30/273-274) ----
  //  Mizzi bu tercemede cok sayida sema ve tedlis kaydi nakleder.
  ...[["eyyubsahtiyani","—"],["caferebivahsiyye","ع"],["haccacertat","د ت"],
      ["haccacsavvaf","س"],["husaynabdrahman","خ م ت سي"],["humeydtavil","خ م د ت س"],
      ["halidhazza","خ م د"],["davudebihind","م"],["sufyanhusayn","س"],
      ["amess","م"],["suleymanteymi","م"],["siyarebilhakem","خ م س"],["salihhayy","م"],["asimahvel","م"],["amiralhavl","ت ق"],
      ["abdullahsubrume","د س"],["ebusalih","—"],["abdullahavn","س"],
      ["abdulhamidcafer","م"],["abdulazizsuheyb","م د س"],["abdulmelikebisuleyman","م د س ق"],
      ["abdulmelikumeyr","م"],["ubeydullahomeri","—"],["ataisaib","خ"],
      ["alizeydcudan","ت ق"],["avvamhavseb","خ د س"],
      ["avfarabi","د ت"],["kasimmihran","م"],["leysbsad","س"],
      ["mucalidsaid","م د ت"],["ibnishak","ت"],["ibnsihab","ت س"],
      ["mutarriftarif","ت"],["mugirmiksem","خ م"],["mansurzazan","ع"],
      ["hisamhassan","م ت س"],["hisamyusufsanani","سي"],["yahyasaidensari","م د س"],
     ].map(([a, r]) => E(a, "huseym", r, "Tehzîb, bâbü'l-hâ")),

  // ---- Huseym'in talebeleri, Tehzib (s. 30/275-276) ----
  ...[["ahmedhanbel","م د"],["ahmedmeni","م ت س"],["ibnebiseybe","م ق"],
      ["osmanebiseybe","خ م د"],["zuheyrharb","م د ق"],["alimedini","خ"],
      ["alihucr","م"],["amrnakid","خ م"],["ahmeddevraki","د ق"],
      ["saidsuleymansadeviye","خ م ت س"],["muhammedisataba","خت د س"],
      ["said_mansur","م ق"],["kuteybesaid","خ"],["gunder","—"],
      ["ibnmubarek","—"],["ibnmehdi","—"],["sevri","—"],["sube","—"],
      ["malik","—"],["ibnuyeyne","—"],
     ].map(([b, r]) => E("huseym", b, r, "Tehzîb, bâbü'l-hâ")),

  // ---- Ibn Ishak, Tehzib 5057 (s. 24/411-412) ----
  //  Mizzi burada Ali b. el-Medini'nin sozunu nakleder: «medaru hadisi
  //  Resulillah ala sitte... summe sara ilmu's-sitteti inde isney aser,
  //  ehaduhum Muhammed b. Ishak»
  ...[["ebanosman","—"],["ataebirebah","—"],["ebuselemeavf","—"],
      ["kasimmuhammed","—"],["mekhul","—"],["abdrahmanesved","—"],
      ["ibnsihab","—"],["yezidebihabib","—"],["enes","—"],
     ].map(([a, r]) => E(a, "ibnishak", r, "Tehzîb 5057")),
  ...[["yezidharun","رم"],["yezidzurey","س"],["yalaubeyd","د س ق"],
      ["yunusbukeyr","ر د ت ق"],["ibnuleyye","—"],
     ].map(([b, r]) => E("ibnishak", b, r, "Tehzîb 5057")),

  // ---- Veki' b. el-Cerrah, Tehzib (s. 30/464-471) ----
  ...[["zekeriyyaishak","ع"],["zekeriyyaebizaide","م ٤"],["ibnuyeyne","—"],["amess","خ م د ت ق"],["serikkadi","ت"],["abdullahavn","م"],["abdulhamidcafer","م ق"],["mesudi","د ق"],["ibncureyc","م ق"],
      ["ubeydullahomeri","—"],["ikrimeammar","م د س ق"],["aliebisalihhayy","م ت س"],
      ["alimubarekhinai","خ م س ق"],["omerzerr","خ د ت"],["hanzalasufyan","م ت"],
      ["suleymanmugire","س ق"],["saidubeydtai","م"],["davudkaysferra","س ق"],
      ["saidabdulaziz","د ق"],["abdulazizomer","٤"],["hisamurve","—"],
      ["hammadzeyd","—"],["ibnishak","—"],
     ].map(([a, r]) => E(a, "veki", r, "Tehzîb, bâbü'l-vâv")),
  ...[["ahmedhanbel","—"],["ibnmain","—"],["alimedini","—"],
      ["ibnebiseybe","—"],["osmanebiseybe","—"],["misned","د"],
      ["hennadseri","—"],["yahyayahyanisaburi","م"],["mahmudgaylan","ت س"],
      ["ibnebiomeradeni","م ت"],["nasralicehdami","م"],["yahyaadem","—"],
      ["yezidharun","—"],["kuteybesaid","—"],["ibnrahuye","—"],
     ].map(([b, r]) => E("veki", b, r, "Tehzîb, bâbü'l-vâv")),

  // ---- Ibnu'l-Mubarek, Tehzib 3520 (s. 16/6-7) ----
  ...[["ibrahimsad","—"],["ibrahimtahman","خ"],["ibrahimebiable","س"],
      ["ibrahimfezari","—"],["ibrahimukbe","م س"],["usamezeydeslem","ق"],
      ["usamezeydleysi","خت ع"],["ismailebihalid","م"],["ismailayyas","ق"],
      ["ebuburde","م"],["cerirhazim","—"],["caferburkan","س"],
      ["haccacertat","س ق"],["harmalaimran","د ق"],["huseynmuallim","خ م د ت س"],
      ["hammadzeyd","—"],["hammadseleme","ت س"],["hamzazeyyat","س"],
      ["humeydtavil","خ د ت س"],["hanzalasufyan","س"],["hayveseri","خ م د ت س"],
      ["halidhazza","س"],["davudattar","—"],["davudkaysferra","رمدس"],
      ["zaidekudame","س"],["zekeriyyaishak","خ س"],["zekeriyyaebizaide","خ ع"],
      ["zuhayrmuaviye","—"],["rebiaebiabdrahman","سي"],["rebiuenes","—"],
      ["serieyyahya","س"],["sadsaidensari","بخ م"],["cureyri","م د ت س"],
      ["saidebiyyubmisri","م ت س ق"],["saidabdulaziz","ت"],["ibnebiaruba","خ ت س"],["ibnuyeyne","س"],["hasanamrfukaymi","بخ"],
     ].map(([a, r]) => E(a, "ibnmubarek", r, "Tehzîb 3520")),

  // ---- Ibnu'l-Mubarek'in talebeleri, Tehzib 3520 (s. 16/12-14) ----
  ...[["abdan","خ م د ت س"],["ibnebiseybe","م د ق"],["osmanebiseybe","د ق"],
      ["ibnvehb","—"],["ibnmehdi","خ د"],["abdurrezzak","ت"],
      ["affanmuslim","—"],["alihasansakik","ع"],["alihucr","م"],
      ["kuteybesaid","—"],["suveydnasr","ت س"],["ibnmain","—"],
      ["yahyaadem","—"],["ebulahvess","—"],
     ].map(([b, r]) => E("ibnmubarek", b, r, "Tehzîb 3520")),

  // ---- Yahya b. Said el-Kattan, Tehzib 6834 (s. 31/329-330) ----
  ...[["ismailebihalid","خ م"],["usamezeydleysi","س"],["esaseabdulmelik","س"],
      ["behzhakim","د ت س"],["sevryezid","بخ ٤"],["caferisadik","د س"],
      ["hasanisad","س"],["hatimebisagire","خ م س"],["haccacsavvaf","م د س ق"],
      ["hasanzekvan","خ د ت ق"],["huseynmuallim","خ م د س"],["hammadseleme","م"],
      ["humeydtavil","خ م د س"],["hanzalasufyan","—"],["halidhazza","—"],
      ["husaymirak","خ س"],["davudkaysferra","س"],["zekeriyyaebizaide","د س"],
      ["sadibrahim","—"],["selimhayyan","خ د"],["amess","—"],
      ["suleymanteymi","خ م س"],["seyfsuleymanmekki","خ س"],
     ].map(([a, r]) => E(a, "kattan", r, "Tehzîb 6834")),

  // ---- Yahya el-Kattan'in talebeleri, Tehzib 6834 (s. 31/333-334) ----
  ...[["ibnmehdi","—"],["ahmedhanbel","—"],["alimedini","خ د"],
      ["ibnmain","د"],["ibnebiseybe","خ م ق"],["kavariri","م د"],
      ["ubeydullahmuazanberi","د"],["affanmuslim","—"],["misned","خ د"],
      ["bundar","ع"],["ibnmusenna","خ م س ق"],["amrbnalisayrafi","خ م ت س"],
      ["abbasanberi","تم ق"],["yakubdevraki","م س"],["nasralicehdami","د"],
      ["mutemirsuleyman","—"],["sube","—"],
     ].map(([b, r]) => E("kattan", b, r, "Tehzîb 6834")),

  // ---- Abdurrahman b. Mehdi, Tehzib (s. 17/431-432) ----
  ...[["ebansattar","س"],["ibrahimsad","—"],["israilyunus","تم س"],
      ["cerirhazim","م س ق"],["harbseddad","خ ت س"],["hammadzeyd","مق ت"],
      ["davudkaysferra","س ق"],["zaidekudame","—"],["zuhayrmuaviye","—"],
      ["selimhayyan","م ق"],["sallamebimuti","خ س"],["serikkadi","—"],["mesudi","—"],
      ["macisun","م س"],["darevardi","س"],["abdulvahidziyad","—"],
      ["ikrimeammar","م د س"],["omerzerr","—"],["malikmigvel","م"],["muaviyesalih","م ٤"],
     ].map(([a, r]) => E(a, "ibnmehdi", r, "Tehzîb, bâbü'l-ayn")),

  // ---- Ibn Mehdi'nin talebeleri, Tehzib (s. 17/434-435) ----
  ...[["ahmedhanbel","—"],["alimedini","خ فق"],["ibnmain","—"],
      ["kavariri","م د"],["osmanebiseybe","ق"],["ibnvehb","س"],
      ["amrbnalisayrafi","خ م س"],["bundar","ع"],["ibnmusenna","خ م ت س ق"],
      ["muhammedabdulalasanani","ت"],["zuhli","ق"],["mucahidmusa","د س ق"],
      ["nasralicehdami","—"],["yahyayahyanisaburi","م"],["yakubdevraki","د س"],
      ["ebuasimnebil","—"],
     ].map(([b, r]) => E("ibnmehdi", b, r, "Tehzîb, bâbü'l-ayn")),

  // ---- Yahya b. Adem, Tehzib (s. 31/190-191) ----
  ...[["ibnidris","مق س"],["abdusselamharb","—"],
      ["fudaylibnayaz","—"],["kaysrebi","—"],["fitrhalife","سي"],
      ["malikmigvel","—"],["misersukdam","م س"],["muhammedfudayl","—"],
      ["huseym","—"],["varkaomer","خ"],["ebuavane","—"],["ibnebizaide","خ م س"],["ebubekirayyas","خ"],["ebumuaviyedarir","—"],
     ].map(([a, r]) => E(a, "yahyaadem", r, "Tehzîb, bâbü'l-yâ")),
  ...[["ahmedhanbel","د"],["ibnrahuye","خ م د س"],["ibnebiseybe","م"],
      ["osmanebiseybe","د"],["alimedini","—"],["ibnmain","—"],
      ["abdhumeyd","م"],["ebukureyb","م د ت"],["muhammedrafi","م س"],
      ["mahmudgaylan","ت س"],
     ].map(([b, r]) => E("yahyaadem", b, r, "Tehzîb, bâbü'l-yâ")),

  // ---- Yahya b. Zekeriyya Ibn Ebi Zaide, Tehzib 6826 (s. 31/305-307) ----
  ...[["israilyunus","م"],["ismailebihalid","—"],["haccacertat","م س"],
      ["hasanamrfukaymi","فق"],["halidselememahzumi","٤"],["davudebihind","م س"],
      ["zekeriyyaebizaide","ع"],["ibnuyeyne","د س"],["amess","م س ق"],["salihhayy","د س ق"],["asimahvel","خ م ت س"],
      ["abdullahavn","م"],["abdulazizomer","د"],["abdulmelikhumeyd","م"],
      ["abdulmelikebisuleyman","م س"],["ibncureyc","م"],["ubeydullahomeri","م د ت س"],
      ["ikrimeammar","د س"],["amrmeymunmihran","م"],["leysebisuleym","—"],["mucalidsaid","د"],["ibnishak","د"],
      ["misersukdam","م د ق"],["musacuheni","م س"],["nafiomercumahi","س"],
      ["hasimhasim","خ ق"],["hisamurve","م ق"],["varkaomer","خد"],
      ["yahyasaidensari","م س ق"],["ebumalikesceyi","م ق"],
     ].map(([a, r]) => E(a, "ibnebizaide", r, "Tehzîb 6826")),
  ...[["ibrahimmusaferra","خ م د"],["ahmedhanbel","م"],["ahmedmeni","د ت س"],
      ["hasanarafe","—"],["sericyunus","م"],["ibnebiseybe","م"],
      ["osmanebiseybe","م د"],["kavariri","س"],["alimedini","خ"],
      ["kuteybesaid","—"],["ebukureyb","م د ت"],["muhammedubeydmuharibi","ت س"],
      ["muhammedisataba","—"],["harunmaruf","م د"],["hennadseri","م ت س"],["ibnmain","س"],["yahyayahyanisaburi","م"],
      ["yakubdevraki","م س"],
     ].map(([b, r]) => E("ibnebizaide", b, r, "Tehzîb 6826")),

  // ---- Buhari, Tehzib 5060 (s. 24/431) ----
  ...[["ahmedhanbel","—"],["ahmedsalihmisri","—"],["ibnrahuye","—"],
      ["ibnebiuveys","—"],["ibrahimmusaferra","—"],["ibrahimmunzirhizami","—"],
      ["ademebiiyas","—"],["alimedini","—"],["ibnmain","—"],
      ["kanebi","—"],["kuteybesaid","—"],["misned","—"],
      ["bundar","—"],["ibnmusenna","—"],["amrbnalisayrafi","—"],
      ["ebunuaymfadl","—"],["ebuasimnebil","—"],["affanmuslim","—"],
      ["muslimibrahim","—"],["musaismailtebuzeki","—"],["hisamtayalisi","—"],
      ["haccacminhal","—"],["alicad","—"],["saidsuleymansadeviye","—"],
      ["ibnebiseybe","—"],["muhammedisataba","—"],["zuhli","—"],
      ["mahmudgaylan","—"],["ibnebiomeradeni","—"],
     ].map(([a, r]) => E(a, "buhari", r, "Tehzîb 5060")),
  E("buhari", "tirmizi", "—", "Tehzîb 5060"),
  E("buhari", "ebuzuraraazi", "—", "Tehzîb 5060"),
  E("buhari", "ebuhatimrazi", "—", "Tehzîb 5060"),
  E("buhari", "muslim", "—", "Tehzîb 5060"),

  // ---- Muslim, Tehzib 6245 (s. 27/500-501) ----
  ...[["ahmedhanbel","—"],["ahmeddevraki","—"],["ahmedmeni","—"],
      ["ibrahimmusaferra","—"],["ibnrahuye","—"],["ishakkevsec","—"],
      ["ibnebiuveys","—"],["zuheyrharb","—"],["said_mansur","—"],
      ["sericyunus","—"],["seybanferruh","—"],["halefhisam","—"],
      ["kanebi","—"],["abbasanberi","—"],["abdhumeyd","—"],
      ["darimi","—"],["harmalayahya","—"],["hasanaliayyal","—"],
      ["suveydsaidhadesani","—"],["ibnebiseybe","—"],["osmanebiseybe","—"],
      ["kavariri","—"],["ebukureyb","—"],["muhammedrafi","—"],
      ["yahyayahyanisaburi","—"],["kuteybesaid","—"],["bundar","—"],
      ["ibnmusenna","—"],["hennadseri","—"],["harunmaruf","—"],
      ["nasralicehdami","—"],["yakubdevraki","—"],["ubeydullahmuazanberi","—"],
     ].map(([a, r]) => E(a, "muslim", r, "Tehzîb 6245")),

  // ---- Diger dort muellif: agdaki hocalarindan secme ----
  ...[["ahmedhanbel","—"],["ibnebiseybe","—"],["osmanebiseybe","—"],
      ["misned","—"],["zuheyrharb","—"],["kanebi","—"],
      ["said_mansur","—"],["ahmeddevraki","—"],["muslimibrahim","—"],
      ["musaismailtebuzeki","—"],["hisamtayalisi","—"],["kuteybesaid","—"],
      ["ahmedsalihmisri","—"],["halefhisam","—"],["yahyaadem","—"],
     ].map(([a, r]) => E(a, "ebudavud", r, "Tehzîb, şuyûh listesi")),
  ...[["bundar","—"],["ibnmusenna","—"],["kuteybesaid","—"],
      ["hennadseri","—"],["mahmudgaylan","—"],["ebukureyb","—"],
      ["ibnebiomeradeni","—"],["muhammedubeydmuharibi","—"],["ahmedmeni","—"],
      ["alihucr","—"],["muhammedabdulalasanani","—"],
     ].map(([a, r]) => E(a, "tirmizi", r, "Tehzîb, şuyûh listesi")),
  ...[["kuteybesaid","—"],["ishakkevsec","—"],["ibnrahuye","—"],
      ["amrbnalisayrafi","—"],["muhammedrafi","—"],["muhammedabdulalasanani","—"],
      ["abbasanberi","—"],["harmalayahya","—"],["ahmedsalihmisri","—"],
      ["yakubdevraki","—"],["nasralicehdami","—"],["hasanarafe","—"],
     ].map(([a, r]) => E(a, "nesai", r, "Tehzîb, şuyûh listesi")),
  ...[["ibnebiseybe","—"],["osmanebiseybe","—"],["hennadseri","—"],
      ["suveydsaidhadesani","—"],["ebukureyb","—"],["muhammedubeydmuharibi","—"],
      ["ibnebiomeradeni","—"],["amrnakid","—"],["ibrahimmusaferra","—"],
      ["hasanarafe","—"],["zuhli","—"],
     ].map(([a, r]) => E(a, "ibnmace", r, "Tehzîb, şuyûh listesi")),

  // ---- Darimi ve Razi'ler ----
  ...[["ibnrahuye","—"],["ahmedhanbel","—"],["yahyaadem","—"],
      ["ebunuaymfadl","—"],["ebuasimnebil","—"],["ibnmain","—"],
     ].map(([a, r]) => E(a, "darimi", r, "Tehzîb, şuyûh listesi")),
];

// En çok hadis rivayet eden yedi sahâbî
// Ali b. el-Medînî, el-İlel: isnâdın üzerinde döndüğü tabakalar
const MEDAR = {
  ibnsihab: 1, amrdinar: 1, yahyaebikesir: 1, katade: 1, ebuishaksebii: 1, amess: 1,
  malik: 2, ibnishak: 2, ibncureyc: 2, ibnuyeyne: 2, ibnebiaruba: 2, hammadseleme: 2,
  ebuavane: 2, sube: 2, mamer: 2, sevri: 2, evzai: 2, huseym: 2,
  yahyaadem: 3, ibnebizaide: 3, veki: 3, ibnmubarek: 3, kattan: 3, ibnmehdi: 3,
};
const MEDAR_AD = {
  1: "I. tabaka — müdevvinler",
  2: "II. tabaka — musannifler",
  3: "III. tabaka — münekkit ve fakîh muhaddisler",
};

// Kütüb-i Sitte müellifleri
const MUELLIF = new Set(["buhari", "muslim", "ebudavud", "tirmizi", "nesai", "ibnmace"]);

const MUKSIRUN = new Set(["ebuhureyre", "ibnomer", "enes", "aise", "ibnabbas", "cabir", "ebusaid"]);


/* Hz. Peygamber → sahâbe. Tehzîb'de sahâbe tercemeleri kural olarak
   «revâ anı'n-nebî ﷺ» kaydıyla başlar. Okuduğum tercemelerden gelen
   bağlar zaten yukarıda, kalanları burada tamamlanıyor — kaynak alanında
   ayrıca işaretlidir. */
NODES.filter((n) => n.tab === 1 && n.id !== "nebi").forEach((n) => {
  const zaten = EDGES.some((e) => e.a === "nebi" && e.b === n.id);
  if (!zaten) EDGES.push(E("nebi", n.id, "—", "sahâbî olduğuna dayanır, terceme teyidi yapılmadı"));
});

/* Belde ataması ölçütü: râvi, en çok talebe yetiştirdiği ve rivayet
   geçmişinde en çok anıldığı beldeye konur. Sonradan yerleştiği yerler
   düğüm notunda belirtilir. Örnek: Mizzî, Zührî için «el-Medenî, sekene'ş-Şâm»
   der; ağda Medine sütununda durur, çünkü talebe halkasının ağırlığı oradadır. */
const BELDELER = ["Medine", "Mekke", "Kûfe", "Basra", "Şam", "Vâsıt", "Mısır", "Humus",
                  "Horasan", "Mâverâünnehir", "Cibâl"];

/* ---------- dünya koordinatları ----------
   Dikey eksen: vefat yılı. Yatay eksen: belde sütunları.
   Medine ortada durur, diğer beldeler iki yana dengeli dağıtılır.
   Her sütun çakışmayı önlemek için gerektiği kadar şeride bölünür.   */
const YIL_MIN = 5, YIL_MAX = 315;
const UST = 210, ALT = 160, SOL_PAY = 60;
const H = 55000;
const SERIT_W = 620;
const ASGARI_DY = 580;
const yOf = (yil) => UST + ((yil - YIL_MIN) / (YIL_MAX - YIL_MIN)) * (H - UST - ALT);

const DERECE = (() => {
  const d = {};
  EDGES.forEach((e) => { d[e.a] = (d[e.a] || 0) + 1; d[e.b] = (d[e.b] || 0) + 1; });
  return d;
})();
const rOf = (id) => {
  if (id === "nebi") return 96;
  const d = DERECE[id] || 0;
  // taban 10 piksel, bağ sayısıyla belirgin şekilde büyür
  return Math.min(13 + Math.sqrt(d) * 11.5, 86);
};


const { POS, SUTUNLAR, W, MEDINE } = (() => {
  // 1) her belde için şerit ataması
  const plan = {};
  BELDELER.forEach((belde) => {
    const grup = NODES.filter((n) => n.belde === belde && n.id !== "nebi")
      .map((n) => ({ n, y: yOf(n.olum ?? TAHMIN[n.tab]) }))
      .sort((a, b) => a.y - b.y);
    // İki geçiş. Birincisi kaç şerit gerektiğini bulur (ilk boş şerit yöntemi),
    // ikincisi o kadar şeridi baştan açıp râvileri aralarında dengeli dağıtır.
    // Tek geçişte şeritler ihtiyaç oldukça açıldığı için râviler sola yığılıyordu.
    let gerekli = 0;
    {
      const sonY = [];
      grup.forEach(({ y }) => {
        let s = sonY.findIndex((v) => y - v >= ASGARI_DY);
        if (s === -1) { sonY.push(y); s = sonY.length - 1; }
        else sonY[s] = y;
      });
      gerekli = Math.max(1, sonY.length);
    }

    const sonY = new Array(gerekli).fill(-Infinity);
    const sayac = new Array(gerekli).fill(0);
    const atama = [];
    grup.forEach(({ n, y }) => {
      let s = -1, enAz = Infinity, enEski = Infinity;
      for (let i = 0; i < gerekli; i++) {
        if (y - sonY[i] < ASGARI_DY) continue;
        if (sayac[i] < enAz || (sayac[i] === enAz && sonY[i] < enEski)) {
          s = i; enAz = sayac[i]; enEski = sonY[i];
        }
      }
      if (s === -1) { sonY.push(y); sayac.push(0); s = sonY.length - 1; }
      else sonY[s] = y;
      atama.push({ n, y, s, sira: sayac[s]++ });
    });
    plan[belde] = { atama, seritSayisi: Math.max(1, sonY.length) };
  });

  /* 2) Sütun sırası coğrafidır, batıdan doğuya. Medine tuvalın tam
     ortasına, aşağıdaki simetri kaydırmasıyla getirilir.            */
  const COGRAFI = ["Mısır", "Humus", "Şam", "Mekke", "Medine",
                   "Basra", "Vâsıt", "Kûfe", "Cibâl", "Horasan", "Mâverâünnehir"];
  const sira = COGRAFI.filter((b) => plan[b]);

  // 3) konumlar
  const pos = {};
  const sutunlar = [];
  let imlec = SOL_PAY;
  sira.forEach((belde) => {
    const { atama, seritSayisi } = plan[belde];
    const genislik = seritSayisi * SERIT_W;
    atama.forEach(({ n, y, s, sira: k }) => {
      const kaydir = [0, 22, -22, 11, -11][k % 5];
      pos[n.id] = { x: imlec + s * SERIT_W + SERIT_W / 2 + kaydir, y };
    });
    sutunlar.push({ belde, x: imlec, genislik, seritSayisi });
    imlec += genislik;
  });

  let medine = sutunlar.find((c) => c.belde === "Medine");
  let W0 = imlec + SOL_PAY;
  // Medine'nin merkezi tuvalin tam ortasına gelsin diye tuvali simetrikleştir
  const merkez = medine.x + medine.genislik / 2;
  const gerekli = Math.max(merkez, W0 - merkez);
  const kaydir = gerekli - merkez;
  if (kaydir > 0) {
    Object.values(pos).forEach((p) => { p.x += kaydir; });
    sutunlar.forEach((c) => { c.x += kaydir; });
  }
  W0 = gerekli * 2;
  medine = sutunlar.find((c) => c.belde === "Medine");
  pos["nebi"] = { x: medine.x + medine.genislik / 2, y: UST - 110 };
  return { POS: pos, SUTUNLAR: sutunlar, W: W0, MEDINE: medine };
})();

/* ---------- kenar kavisleri ----------
   Her kenar için, yolu başka bir râvi noktasının üzerinden geçmeyen
   bir yanal kavis değeri aranır. Bu arama pahalı olduğu için sonuç
   önceden hesaplanıp aşağıya gömüldü; açılışta hesap yapılmaz.
   [yanal kavis, dikey açılım oranı] çifti olarak saklanır.
   Yerleşim sabitleri (SERIT_W, ASGARI_DY, H, YIL_MAX) değişirse bu
   tablo yeniden üretilmelidir.                                       */
const KAVIS = {"omer|ali":[187.5,0.3],"mikdad|ali":[187.5,0.3],"fatima|ali":[187.5,0.3],"ubey|ebuhureyre":[187.5,0.3],"usame|ebuhureyre":[187.5,0.3],"basra|ebuhureyre":[187.5,0.3],"omer|ebuhureyre":[187.5,0.3],"fadl|ebuhureyre":[187.5,0.3],"kabahbar|ebuhureyre":[187.5,0.3],"aise|ebuhureyre":[74,0.3],"ali|ahnef":[187.5,0.3],"ali|esvedyezid":[187.5,0.3],"ali|alkame":[187.5,0.3],"ali|ubeydesel":[187.5,0.3],"ali|suveydgafle":[187.5,0.3],"ali|ebuvail":[187.5,0.3],"ali|zirhubeys":[187.5,0.3],"ali|sureyh":[187.5,0.3],"ali|saidmusayyeb":[187.5,0.3],"ali|hasanbasri":[187.5,0.3],"ali|rebihiras":[187.5,0.3],"ali|zeydvehb":[187.5,0.3],"ali|zadan":[187.5,0.3],"ali|ebutufeyl":[187.5,0.3],"ali|harissuveyd":[187.5,0.3],"ali|harisemudarrib":[187.5,0.3],"ali|salimcad":[187.5,0.45],"ali|hayseme":[187.5,0.3],"ali|ibrhunayn":[187.5,0.3],"ali|abdhayr":[187.5,0.3],"ali|harisaver":[187.5,0.3],"ali|asimdamra":[187.5,0.3],"ali|sabi":[187.5,0.3],"ali|ibnebileyla":[187.5,0.3],"ali|urve":[187.5,0.3],"ali|ikrime":[187.5,0.3],"ali|zeynelabidin":[187.5,0.3],"ali|ubeydullaherafi":[187.5,0.15],"ali|umerbali":[187.5,0.3],"ali|abdrahmanharis":[187.5,0.3],"ali|ubeydumeyr":[187.5,0.3],"ali|saidzuhadan":[187.5,0.15],"ali|ibnabbas":[187.5,0.3],"ali|ibnomer":[187.5,0.3],"ali|ibnmesud":[168.3,0.3],"ali|ibnzubeyr":[187.5,0.3],"ali|bera":[187.5,0.3],"ali|zeydarkam":[187.5,0.3],"ali|cabirsemura":[187.5,0.3],"ali|cabir":[187.5,0.3],"ali|suhayb":[187.5,0.3],"ali|sefine":[187.5,0.3],"ali|hasanbali":[187.5,0.3],"ali|huseyn":[187.5,0.3],"ali|amrhurays":[187.5,0.3],"ali|tariksihab":[187.5,0.3],"ali|besrsuhaym":[187.5,0.3],"ali|ibncafer":[187.5,0.3],"ali|enes":[187.5,0.3],"ebuhureyre|enes":[187.5,0.3],"ebuhureyre|cabir":[187.5,0.3],"ebuhureyre|hasanbasri":[187.5,0.45],"ebuhureyre|salimibnomer":[187.5,0.3],"ebuhureyre|hafsasim":[187.5,0.15],"ebuhureyre|humeydavf":[187.5,0.3],"ebuhureyre|esvedhilal":[187.5,0.3],"ebuhureyre|zurareevfa":[187.5,0.3],"ebuhureyre|busrsaid":[187.5,0.3],"ebuhureyre|hilas":[187.5,0.3],"ebuhureyre|besirnehik":[187.5,0.3],"ebuhureyre|ibrhunayn":[375,0.3],"ebuhureyre|hayseme":[187.5,0.3],"ebuhureyre|zeydeslem":[187.5,0.3],"ebuhureyre|salimcad":[187.5,0.3],"ebuhureyre|bece":[187.5,0.3],"ebuhureyre|saidmusayyeb":[187.5,0.3],"ebubekir|enes":[187.5,0.3],"ebubekir|bera":[187.5,0.3],"ebubekir|cabir":[187.5,0.3],"ebubekir|zeydarkam":[187.5,0.3],"ebubekir|zeydsabit":[187.5,0.3],"ebubekir|suveydgafle":[187.5,0.3],"ebubekir|tariksihab":[187.5,0.15],"ebubekir|ibnzubeyr":[187.5,0.3],"ebubekir|ibnabbas":[187.5,0.3],"ebubekir|ibnomer":[187.5,0.3],"ebubekir|ibnmesud":[187.5,0.3],"ebubekir|ali":[187.5,0.3],"ebubekir|omer":[187.5,0.3],"ebubekir|amrhurays":[187.5,0.3],"ebubekir|ebutufeyl":[187.5,0.3],"ebubekir|ebuhureyre":[187.5,0.3],"ebubekir|aise":[187.5,0.3],"ebubekir|saidmusayyeb":[187.5,0.3],"ebubekir|ebusalih":[187.5,0.3],"ebubekir|kayshazim":[187.5,0.3],"ebubekir|abdrahmanebubekir":[187.5,0.3],"ebubekir|abdrahmanavf":[187.5,0.15],"ebubekir|osman":[187.5,0.15],"ebubekir|ukbeamir":[187.5,0.3],"ebubekir|ebumusa":[187.5,0.3],"ebubekir|ebusaid":[187.5,0.3],"ebubekir|huzeyfe":[187.5,0.3],"ebubekir|rifaazuraki":[187.5,0.3],"ebubekir|aizamr":[187.5,0.15],"ebubekir|murreserahil":[187.5,0.3],"ebubekir|abdrahmanyerbu":[187.5,0.15],"ebubekir|abdrahmanabza":[187.5,0.3],"nebi|ali":[187.5,0.3],"nebi|ebuhureyre":[187.5,0.3],"nebi|ebubekir":[187.5,0.3],"nebi|fatima":[187.5,0.3],"nebi|omer":[187.5,0.3],"ubey|omer":[187.5,0.3],"omer|eslem":[187.5,0.3],"omer|esvedyezid":[187.5,0.3],"omer|esaskays":[187.5,0.3],"omer|enes":[187.5,0.3],"omer|bera":[187.5,0.3],"omer|cabirsemura":[187.5,0.3],"omer|cabir":[187.5,0.3],"omer|cerirbecel\u00ee":[187.5,0.3],"omer|huzeyfe":[187.5,0.3],"omer|hasanbasri":[187.5,0.45],"omer|humeydavf":[187.5,0.3],"omer|zeydsabit":[187.5,0.3],"omer|salimcad":[187.5,0.3],"omer|saibyezid":[187.5,0.3],"omer|sadvakkas":[187.5,0.3],"omer|saidmusayyeb":[187.5,0.3],"omer|suveydgafle":[187.5,0.3],"omer|sureyh":[187.5,0.15],"omer|tariksihab":[187.5,0.3],"omer|talha":[187.5,0.3],"omer|abisrebia":[187.5,0.3],"omer|asimomer":[187.5,0.3],"nebi|osman":[187.5,0.3],"omer|osman":[187.5,0.3],"osman|ebanosman":[187.5,0.3],"osman|ahnef":[187.5,0.15],"osman|enes":[187.5,0.3],"osman|busrsaid":[187.5,0.15],"osman|hasanbasri":[187.5,0.3],"osman|hamranaban":[187.5,0.3],"osman|zeydsabit":[187.5,0.3],"osman|zeydhalid":[187.5,0.3],"osman|saibyezid":[187.5,0.3],"osman|saidmusayyeb":[187.5,0.3],"osman|ebuvail":[187.5,0.3],"osman|ebuumame":[187.5,0.3],"osman|tariksihab":[187.5,0.3],"osman|ibncafer":[187.5,0.3],"osman|ibnzubeyr":[187.5,0.3],"osman|ibnabbas":[187.5,0.3],"osman|ibnomer":[187.5,0.3],"osman|abdrahmanharis":[187.5,0.3],"osman|abdrahmanyezidnehai":[187.5,0.3],"osman|alkame":[187.5,0.3],"osman|kayshazim":[187.5,0.3],"osman|malikevs":[187.5,0.3],"osman|ibnhanefiyye":[187.5,0.3],"osman|mervan":[187.5,0.3],"osman|mugirasube":[187.5,0.3],"osman|imranhusayn":[187.5,0.3],"osman|selemeekva":[187.5,0.3],"osman|ataebirebah":[187.5,0.3],"osman|ebuabdrahmansulemi":[187.5,0.3],"ebanosman|ibnsihab":[187.5,0.3],"ibrhunayn|ibnsihab":[187.5,0.3],"ibrahimavf|ibnsihab":[187.5,0.3],"enes|ibnsihab":[187.5,0.3],"sabitkayszuraki|ibnsihab":[187.5,0.3],"cabir|ibnsihab":[187.5,0.3],"hasanhanefiyye|ibnsihab":[187.5,0.3],"hafsasim|ibnsihab":[187.5,0.3],"hamzaibnomer|ibnsihab":[187.5,0.3],"humeydavf|ibnsihab":[187.5,0.3],"haricezeyd|ibnsihab":[187.5,0.3],"rafihadic|ibnsihab":[187.5,0.3],"ibnomer|ibnsihab":[187.5,0.3],"abdullahkab|ibnsihab":[187.5,0.3],"arac|ibnsihab":[187.5,0.45],"ubeydullahutbe|ibnsihab":[187.5,0.15],"ubeydullaherafi|ibnsihab":[187.5,0.3],"urve|ibnsihab":[187.5,0.3],"ataebirebah|ibnsihab":[187.5,0.3],"zeynelabidin|ibnsihab":[187.5,0.3],"alkamevakkas|ibnsihab":[187.5,0.3],"ibnsihab|ibrahimsad":[187.5,0.3],"ibnsihab|usamezeydleysi":[187.5,0.3],"ibnsihab|eyyubsahtiyani":[187.5,0.15],"ibnsihab|haccacertat":[187.5,0.3],"ibnsihab|ibnuyeyne":[187.5,0.3],"ibnsihab|zeydeslem":[187.5,0.3],"ibnsihab|salihkeysan":[187.5,0.3],"ibnsihab|suaybebihamza":[187.5,0.3],"enes|katade":[187.5,0.3],"hasanbasri|katade":[158.7,0.3],"cabirzeyd|katade":[187.5,0.3],"ebulaliye|katade":[187.5,0.3],"bekirmuzeni|katade":[187.5,0.3],"zurareevfa|katade":[187.5,0.3],"salimcad|katade":[187.5,0.3],"saidmusayyeb|katade":[187.5,0.3],"hayseme|katade":[187.5,0.3],"hilas|katade":[187.5,0.3],"humeydavf|katade":[187.5,0.3],"sefine|katade":[187.5,0.3],"katade|eyyubsahtiyani":[187.5,0.3],"katade|haccacertat":[187.5,0.3],"katade|hammadseleme":[187.5,0.3],"katade|ibnebiaruba":[187.5,0.3],"katade|amess":[187.5,0.3],"katade|sube":[187.5,0.3],"katade|evzai":[187.5,0.3],"katade|mamer":[187.5,0.3],"katade|hisamdestuvai":[187.5,0.3],"katade|hemmamyahya":[187.5,0.3],"katade|ebuavane":[187.5,0.3],"katade|cerirhazim":[187.5,0.3],"katade|misersukdam":[187.5,0.3],"katade|leysbsad":[187.5,0.3],"katade|amrharis":[187.5,0.3],"katade|suleymanteymi":[187.5,0.3],"nehai|amess":[187.5,0.45],"ibrahimteymi|amess":[187.5,0.3],"habibebisabit|amess":[187.5,0.3],"enes|amess":[187.5,0.3],"ebuduha|amess":[187.5,0.3],"yahyavessab|amess":[187.5,0.3],"mearrursuveyd|amess":[187.5,0.3],"hakemuteybe|amess":[187.5,0.3],"amess|sevri":[187.5,0.3],"amess|ibnuyeyne":[187.5,0.3],"amess|sube":[187.5,0.3],"amess|ibnmubarek":[187.5,0.3],"amess|hafsgiyas":[187.5,0.3],"amess|cerirabdulhamid":[187.5,0.3],"amess|cerirhazim":[187.5,0.3],"amess|ibnnumeyr":[187.5,0.3],"amess|ibnidris":[187.5,0.3],"amess|alimushir":[187.5,0.3],"amess|suleymanteymi":[187.5,0.3],"amess|hakemuteybe":[187.5,0.3],"cabirzeyd|amrdinar":[187.5,0.3],"cabir|amrdinar":[187.5,0.3],"hasanhanefiyye|amrdinar":[187.5,0.3],"ebusalih|amrdinar":[187.5,0.3],"salimibnomer|amrdinar":[187.5,0.3],"saibyezid|amrdinar":[187.5,0.3],"saidcubeyr|amrdinar":[187.5,0.3],"saidmusayyeb|amrdinar":[187.5,0.3],"suleymanyesar|amrdinar":[187.5,0.3],"tavus|amrdinar":[187.5,0.3],"ibnzubeyr|amrdinar":[187.5,0.3],"ibnabbas|amrdinar":[187.5,0.3],"ibnomer|amrdinar":[187.5,0.3],"ubeydumeyr|amrdinar":[187.5,0.3],"urve|amrdinar":[187.5,0.3],"ataebirebah|amrdinar":[187.5,0.3],"ikrime|amrdinar":[187.5,0.3],"kureyb|amrdinar":[187.5,0.15],"mucahid|amrdinar":[187.5,0.3],"ebucafermuhbakir|amrdinar":[187.5,0.3],"ibnsihab|amrdinar":[187.5,0.3],"vehbmunebbih|amrdinar":[187.5,0.3],"ebutufeyl|amrdinar":[187.5,0.3],"ebuselemeavf|amrdinar":[187.5,0.3],"ebuhureyre|amrdinar":[187.5,0.3],"amrdinar|eyyubsahtiyani":[187.5,0.3],"amrdinar|hammadzeyd":[187.5,0.3],"amrdinar|hammadseleme":[187.5,0.3],"amrdinar|davudattar":[187.5,0.3],"amrdinar|zekeriyyaishak":[187.5,0.3],"amrdinar|sevri":[187.5,0.3],"amrdinar|ibnuyeyne":[187.5,0.3],"amrdinar|sube":[187.5,0.3],"amrdinar|ibncureyc":[187.5,0.15],"amrdinar|katade":[187.5,0.3],"amrdinar|malik":[187.5,0.3],"amrdinar|misersukdam":[187.5,0.45],"amrdinar|huseym":[187.5,0.45],"amrdinar|ebuavane":[187.5,0.45],"amrdinar|varkaomer":[187.5,0.3],"amrdinar|amrharis":[187.5,0.3],"esaskays|ebuishaksebii":[187.5,0.3],"esvedyezid|ebuishaksebii":[187.5,0.3],"enes|ebuishaksebii":[187.5,0.3],"bera|ebuishaksebii":[187.5,0.3],"egarebumuslim|ebuishaksebii":[187.5,0.3],"usame|ebuishaksebii":[187.5,0.3],"amrmeymun|ebuishaksebii":[187.5,0.3],"mesruk|ebuishaksebii":[187.5,0.15],"kayshazim|ebuishaksebii":[187.5,0.3],"mucahid|ebuishaksebii":[187.5,0.45],"ebucafermuhbakir|ebuishaksebii":[187.5,0.15],"musatalha|ebuishaksebii":[187.5,0.3],"nafiibnomer|ebuishaksebii":[187.5,0.3],"numanbesir|ebuishaksebii":[187.5,0.3],"mugirasube|ebuishaksebii":[187.5,0.3],"ebuishaksebii|sevri":[187.5,0.3],"ebuishaksebii|ibnuyeyne":[187.5,0.45],"ebuishaksebii|amess":[187.5,0.3],"ebuishaksebii|sube":[187.5,0.3],"ebuishaksebii|suleymanteymi":[187.5,0.3],"ebuishaksebii|zuhayrmuaviye":[187.5,0.3],"ebuishaksebii|zaidekudame":[187.5,0.15],"ebuishaksebii|ibnebizaide":[187.5,0.3],"ebuishaksebii|ebulahvess":[187.5,0.3],"ebuishaksebii|serikkadi":[187.5,0.3],"ebuishaksebii|hamzazeyyat":[187.5,0.3],"ebuishaksebii|katade":[187.5,0.3],"ibrahimkariz|yahyaebikesir":[187.5,0.3],"ishaktalha|yahyaebikesir":[187.5,0.3],"enes|yahyaebikesir":[187.5,0.3],"bece|yahyaebikesir":[187.5,0.15],"cabir|yahyaebikesir":[187.5,0.3],"hafsasim|yahyaebikesir":[187.5,0.3],"hakemmina|yahyaebikesir":[187.5,0.3],"saibyezid|yahyaebikesir":[187.5,0.3],"suleymanyesar|yahyaebikesir":[187.5,0.3],"abdullahebikatade|yahyaebikesir":[187.5,0.3],"evzai|yahyaebikesir":[187.5,0.3],"ubeydullahmiksem|yahyaebikesir":[187.5,0.3],"urve|yahyaebikesir":[187.5,0.3],"ataebirebah|yahyaebikesir":[187.5,0.3],"ikrime|yahyaebikesir":[187.5,0.3],"muhammedibrahimteymi|yahyaebikesir":[187.5,0.3],"nafiibnomer|yahyaebikesir":[187.5,0.3],"hilalebimeymune|yahyaebikesir":[187.5,0.3],"ebuselemeavf|yahyaebikesir":[187.5,0.3],"ebukilabe|yahyaebikesir":[187.5,0.3],"ebunadra|yahyaebikesir":[187.5,0.3],"ebuumame|yahyaebikesir":[187.5,0.15],"yahyaebikesir|eyyubsahtiyani":[-169.5,0.3],"yahyaebikesir|cerirhazim":[187.5,0.3],"yahyaebikesir|haccacsavvaf":[187.5,0.3],"yahyaebikesir|huseynmuallim":[187.5,0.3],"yahyaebikesir|seybannahvi":[187.5,0.3],"yahyaebikesir|evzai":[187.5,0.3],"yahyaebikesir|ikrimeammar":[187.5,0.3],"yahyaebikesir|alimubarek":[187.5,0.3],"yahyaebikesir|muaviyesellam":[187.5,0.3],"yahyaebikesir|mamer":[187.5,0.3],"yahyaebikesir|hisamhassan":[187.5,0.3],"yahyaebikesir|hisamdestuvai":[187.5,0.3],"yahyaebikesir|hemmamyahya":[187.5,0.3],"yahyaebikesir|yahyasaidensari":[187.5,0.3],"ubey|ibnabbas":[187.5,0.3],"usame|ibnabbas":[187.5,0.3],"bureyde|ibnabbas":[187.5,0.3],"temimdari|ibnabbas":[187.5,0.3],"halidvelid|ibnabbas":[187.5,0.3],"ibnabbas|hasanbasri":[187.5,0.3],"ibnabbas|hakemmina":[187.5,0.3],"ibnabbas|humeydavf":[187.5,0.3],"ibnabbas|ebusalih":[187.5,0.3],"ibnabbas|ebulaliye":[187.5,0.3],"ibnabbas|zurareevfa":[187.5,0.3],"ibnabbas|salimcad":[187.5,0.45],"ibnabbas|saidcubeyr":[187.5,0.3],"ibnabbas|saidmusayyeb":[187.5,0.3],"ibnabbas|saidyesar":[187.5,0.3],"ibnabbas|suleymanyesar":[187.5,0.15],"ibnabbas|sehrhavseb":[187.5,0.3],"ibnabbas|dahhak":[187.5,0.3],"ibnabbas|tavus":[187.5,0.3],"ibnabbas|sabi":[187.5,0.3],"ibnabbas|ebutufeyl":[187.5,0.3],"ibnabbas|ibnebimuleyke":[187.5,0.3],"ibnabbas|ubeydullahebiyezid":[187.5,0.3],"ibnabbas|ubeydullahutbe":[187.5,0.3],"ibnabbas|abdullahmabed":[187.5,0.15],"ibnabbas|ebulminhal":[187.5,0.3],"ibnabbas|hakemarac":[187.5,0.3],"ibnabbas|ebuzabyan":[187.5,0.3],"ibnabbas|ikrime":[187.5,0.3],"ibnabbas|mucahid":[187.5,0.3],"ibnabbas|ataebirebah":[187.5,0.3],"ibnabbas|kureyb":[187.5,0.3],"ibnabbas|ibnsihab":[187.5,0.3],"bilal|ibnomer":[187.5,0.3],"rafihadic|ibnomer":[74,0.3],"zeydsabit|ibnomer":[187.5,0.3],"sadvakkas|ibnomer":[187.5,0.3],"suhayb|ibnomer":[187.5,0.3],"amirrebia|ibnomer":[187.5,0.3],"ibnmesud|ibnomer":[187.5,0.3],"omer|ibnomer":[187.5,0.3],"ebusaid|ibnomer":[121.4,0.3],"hafsa|ibnomer":[187.5,0.3],"aise|ibnomer":[187.5,0.3],"ebulubabe|ibnomer":[187.5,0.3],"ibnomer|eslem":[187.5,0.3],"ibnomer|enessirin":[187.5,0.15],"ibnomer|busrsaid":[187.5,0.3],"ibnomer|sabitbunani":[187.5,0.3],"ibnomer|cebeleshim":[187.5,0.3],"ibnomer|habibebisabit":[187.5,0.3],"ibnomer|hasanbasri":[187.5,0.3],"ibnomer|hafsasim":[187.5,0.3],"ibnomer|hakemmina":[187.5,0.3],"ibnomer|hamzaibnomerogul":[187.5,0.3],"ibnomer|humeydavf":[187.5,0.3],"ibnomer|ebusalih":[187.5,0.3],"ibnomer|zadan":[187.5,0.6],"ibnomer|zeydeslem":[187.5,0.3],"ibnomer|salimcad":[187.5,0.15],"ibnomer|salimibnomer":[187.5,0.3],"ibnomer|sadubeyde":[187.5,0.3],"ibnomer|saidcubeyr":[187.5,0.3],"ibnomer|saidmusayyeb":[187.5,0.3],"ibnomer|saidyesar":[187.5,0.3],"ibnomer|suleymanyesar":[187.5,0.3],"ibnomer|safvanmuhriz":[187.5,0.3],"ibnomer|tavus":[187.5,0.3],"ibnomer|abdullahdinar":[187.5,0.3],"ibnomer|nafiibnomer":[187.5,0.3],"ibnomer|ataebirebah":[187.5,0.3],"enes|sumameenes":[187.5,0.3],"enes|sabitbunani":[187.5,0.3],"enes|hasanbasri":[187.5,0.3],"enes|bekirmuzeni":[187.5,0.3],"enes|humeydtavil":[187.5,0.3],"enes|hafsubeydullahenes":[187.5,0.3],"enes|cadebuosman":[187.5,0.3],"enes|enessirin":[187.5,0.3],"enes|rebiaebiabdrahman":[187.5,0.3],"enes|ebulaliye":[88.6,0.3],"enes|habibebisabit":[187.5,0.3],"enes|bekirahnes":[187.5,0.3],"enes|zubeyradi":[187.5,0.3],"enes|beyanbisr":[187.5,0.15],"enes|bisryesar":[187.5,0.3],"enes|salimcad":[187.5,0.3],"enes|zeydeslem":[187.5,0.3],"enes|ibnomer":[187.5,0.3],"cabir|ebuzubeyrmekki":[187.5,0.3],"cabir|ibnmunkedir":[187.5,0.3],"cabir|vehbkeysan":[187.5,0.3],"cabir|ebucafermuhbakir":[187.5,0.3],"cabir|muhammedabbadcafer":[187.5,0.3],"cabir|muhammedsevban":[187.5,0.3],"cabir|mahmudlebid":[187.5,0.3],"cabir|ebunadra":[187.5,0.3],"cabir|ebuselemeavf":[187.5,0.3],"cabir|yezidsuheybfakir":[187.5,0.15],"cabir|vehbmunebbih":[187.5,0.3],"cabir|ataebirebah":[187.5,0.3],"cabir|saidcubeyr":[187.5,0.3],"ebusaid|kasimmuhaymire":[187.5,0.3],"ebusaid|katade":[187.5,0.3],"ebusaid|kazaayahya":[187.5,0.3],"ebusaid|mucahid":[187.5,0.3],"ebusaid|ibnsirin":[187.5,0.3],"ebusaid|muhammedsevban":[187.5,0.3],"ebusaid|ebucafermuhbakir":[187.5,0.3],"ebusaid|mahmudlebid":[187.5,0.3],"ebusaid|mabedsirin":[187.5,0.3],"ebusaid|nafiibnomer":[187.5,0.3],"ebusaid|numanebiayyas":[187.5,0.3],"ebusaid|yahyaumare":[187.5,0.3],"ebusaid|ebuumamesehl":[187.5,0.3],"ebusaid|ebusaidmakburi":[187.5,0.3],"ebusaid|ebuselemeavf":[187.5,0.3],"ebusaid|ebusalih":[187.5,0.3],"ebusaid|ebussiddiknaci":[187.5,0.3],"ebusaid|ebulaliye":[187.5,0.15],"ebusaid|ebuidrishavlani":[187.5,0.3],"ebusaid|ebunadra":[187.5,0.3],"ebusaid|muhammedibrahimteymi":[187.5,0.3],"aise|nehai":[187.5,0.3],"aise|ibrahimteymi":[187.5,0.3],"aise|esvedyezid":[187.5,0.3],"aise|hasanbasri":[187.5,0.3],"aise|hamzaibnomerogul":[187.5,0.3],"aise|hilas":[187.5,0.3],"aise|hayseme":[187.5,0.3],"aise|ebusalih":[187.5,0.3],"aise|zekvanmevlaaise":[187.5,0.3],"aise|zadan":[187.5,0.3],"aise|zurareevfa":[187.5,0.3],"aise|zirhubeys":[187.5,0.3],"aise|zeydeslem":[187.5,0.3],"aise|zeydhalid":[172.5,0.3],"aise|salimcad":[187.5,0.3],"aise|salimibnomer":[187.5,0.3],"aise|saibyezid":[187.5,0.3],"aise|sadhisam":[187.5,0.3],"aise|saidcubeyr":[187.5,0.3],"aise|ebusaidmakburi":[187.5,0.3],"aise|saidmusayyeb":[187.5,0.3],"aise|suleymanyesar":[187.5,0.3],"aise|sureyhhani":[187.5,0.3],"aise|ebuvail":[187.5,0.3],"aise|sehrhavseb":[187.5,0.3],"aise|tavus":[187.5,0.3],"aise|abisrebia":[187.5,0.15],"aise|sabi":[187.5,0.3],"aise|abbadabdullahzubeyr":[187.5,0.15],"aise|ibnzubeyr":[187.5,0.3],"aise|abdullahsedddad":[187.5,0.3],"aise|abdullahsakik":[187.5,0.15],"aise|ibnabbas":[187.5,0.3],"aise|ibnebimuleyke":[187.5,0.3],"aise|amrabdrahmanzurara":[187.5,0.15],"aise|kasimmuhammed":[187.5,0.3],"ishaktalha|malik":[187.5,0.3],"eyyubsahtiyani|malik":[187.5,0.3],"caferisadik|malik":[187.5,0.3],"humeyskaysarac|malik":[187.5,0.3],"humeydtavil|malik":[187.5,0.3],"hubeybabdrahman|malik":[187.5,0.3],"davudhusayn|malik":[187.5,0.3],"rebiaebiabdrahman|malik":[187.5,0.3],"ziyadsad|malik":[187.5,0.3],"zeydeslem|malik":[187.5,0.3],"salimebinadr|malik":[187.5,0.3],"nafiibnomer|malik":[187.5,0.3],"yahyasaidensari|malik":[187.5,0.3],"yezidrouman|malik":[187.5,0.3],"yezidkusayt|malik":[187.5,0.3],"yezidhad|malik":[187.5,0.3],"ataihorasani|malik":[187.5,0.3],"abdulmecidsuheyl|malik":[187.5,0.3],"ibnsihab|malik":[187.5,0.3],"ibnmunkedir|malik":[187.5,0.3],"ebuzubeyrmekki|malik":[187.5,0.3],"abdullahdinar|malik":[187.5,0.3],"malik|ibnuyeyne":[187.5,0.3],"malik|sube":[187.5,0.3],"malik|sevri":[187.5,0.3],"malik|ibnmubarek":[187.5,0.3],"malik|ibnidris":[187.5,0.3],"malik|ibnvehb":[187.5,0.3],"malik|kanebi":[187.5,0.3],"malik|ibnkasimmisri":[187.5,0.3],"malik|ibnmehdi":[187.5,0.3],"malik|safii":[187.5,0.3],"malik|kuteybesaid":[187.5,0.3],"malik|ibnebiuveys":[187.5,0.3],"malik|ibnuleyye":[187.5,0.3],"malik|velidmuslim":[187.5,0.3],"malik|ebunuaymfadl":[187.5,0.3],"malik|ebuasimnebil":[187.5,0.15],"malik|veki":[187.5,0.3],"malik|kattan":[187.5,0.3],"malik|ibnebizaide":[187.5,0.3],"malik|leysbsad":[187.5,0.3],"malik|evzai":[187.5,0.3],"malik|ibncureyc":[187.5,0.3],"ismailebihalid|sube":[187.5,0.3],"enessirin|sube":[187.5,0.3],"eyyubsahtiyani|sube":[187.5,0.3],"sabitbunani|sube":[187.5,0.3],"cebeleshim|sube":[187.5,0.3],"cameseddad|sube":[187.5,0.15],"caferisadik|sube":[187.5,0.6],"habibebisabit|sube":[187.5,0.3],"hakemuteybe|sube":[187.5,0.3],"hammadebisuleyman|sube":[187.5,0.3],"huseynmuallim|sube":[187.5,0.3],"husaynabdrahman|sube":[187.5,0.3],"humeydtavil|sube":[187.5,0.3],"halidhazza|sube":[187.5,0.3],"hubeybabdrahman|sube":[187.5,0.3],"davudebihind|sube":[187.5,0.3],"rebiaebiabdrahman|sube":[187.5,0.3],"zubeydyami|sube":[187.5,0.3],"zekeriyyaebizaide|sube":[187.5,0.3],"sadibrahim|sube":[187.5,0.3],"ibnsihab|sube":[187.5,0.3],"ibnishak|sube":[187.5,0.3],"sube|gunder":[187.5,0.3],"sube|kattan":[187.5,0.3],"sube|ibnmehdi":[187.5,0.3],"sube|veki":[187.5,0.3],"sube|ibnmubarek":[187.5,0.45],"sube|ibnidris":[187.5,0.15],"sube|ibnebizaide":[187.5,0.15],"sube|yezidharun":[187.5,0.3],"sube|yezidzurey":[187.5,0.15],"sube|nadrsumeyl":[187.5,0.3],"sube|ebudavudtayalisi":[187.5,0.3],"sube|muazmuaz":[187.5,0.3],"sube|affanmuslim":[187.5,0.3],"sube|alicad":[187.5,0.3],"sube|abdussamed":[187.5,0.3],"sube|isabyunus":[187.5,0.3],"sube|huseym":[187.5,0.3],"sube|ebunuaymfadl":[187.5,0.3],"sube|ebuasimnebil":[187.5,0.3],"sube|kanebi":[187.5,0.3],"sube|ibnuleyye":[187.5,0.3],"sube|varkaomer":[187.5,0.3],"ibrahimukbe|sevri":[187.5,0.3],"ismailumeyye|sevri":[187.5,0.3],"ismailebihalid|sevri":[187.5,0.45],"suddi|sevri":[187.5,0.3],"esvedkays|sevri":[187.5,0.3],"eyyubsahtiyani|sevri":[187.5,0.3],"sevryezid|sevri":[187.5,0.3],"cabircufi|sevri":[187.5,0.3],"cameseddad|sevri":[187.5,0.3],"cebeleshim|sevri":[187.5,0.3],"caferisadik|sevri":[187.5,0.3],"habibebisabit|sevri":[187.5,0.3],"hasanubeydullah|sevri":[187.5,0.3],"hasanamrfukaymi|sevri":[187.5,0.3],"husaynabdrahman|sevri":[187.5,0.3],"hammadebisuleyman|sevri":[187.5,0.3],"ebuhasin|sevri":[187.5,0.3],"katade|sevri":[187.5,0.3],"ibnsihab|sevri":[187.5,0.3],"sevri|ishakyusufezrak":[187.5,0.3],"sevri|ibnuleyye":[187.5,0.15],"sevri|cerirabdulhamid":[187.5,0.3],"sevri|caferavn":[187.5,0.3],"sevri|hafsgiyas":[187.5,0.3],"sevri|ebuusamehammad":[187.5,0.3],"sevri|halidharis":[187.5,0.3],"sevri|ruhubade":[187.5,0.15],"sevri|zaidekudame":[74,0.3],"sevri|zuhayrmuaviye":[187.5,0.3],"sevri|ibnuyeyne":[187.5,0.3],"sevri|suleymanbilal":[187.5,0.3],"sevri|ebudavudtayalisi":[187.5,0.3],"sevri|ebulahvess":[187.5,0.3],"sevri|ebuasimnebil":[187.5,0.3],"sevri|damrarebia":[187.5,0.3],"sevri|bisrsari":[187.5,0.3],"sevri|abdurrezzak":[187.5,0.3],"sevri|veki":[187.5,0.3],"sevri|ibnmubarek":[187.5,0.3],"sevri|ibnmehdi":[187.5,0.3],"sevri|kattan":[187.5,0.3],"sevri|malik":[187.5,0.3],"sevri|yahyaadem":[187.5,0.3],"ibnmunkedir|ibnuyeyne":[187.5,0.3],"hisamurve|ibnuyeyne":[187.5,0.3],"yahyasaidensari|ibnuyeyne":[187.5,0.3],"mansurmutemir|ibnuyeyne":[187.5,0.3],"mansursafiyye|ibnuyeyne":[187.5,0.3],"mamer|ibnuyeyne":[187.5,0.3],"misersukdam|ibnuyeyne":[187.5,0.3],"musaukbe|ibnuyeyne":[187.5,0.3],"muhammedacilan|ibnuyeyne":[187.5,0.3],"muhammedamralkame|ibnuyeyne":[187.5,0.3],"muhammedsuka|ibnuyeyne":[187.5,0.3],"mutarriftarif|ibnuyeyne":[187.5,0.3],"ismailebiislamsibani|ibnuyeyne":[187.5,0.3],"velidkesir|ibnuyeyne":[187.5,0.6],"yezidhusayfe|ibnuyeyne":[187.5,0.3],"yezidhad|ibnuyeyne":[187.5,0.3],"hisamhassan|ibnuyeyne":[187.5,0.3],"ebuzubeyrmekki|ibnuyeyne":[187.5,0.3],"ataebirebah|ibnuyeyne":[187.5,0.3],"ibnuyeyne|ahmedhanbel":[187.5,0.3],"ibnuyeyne|ibnrahuye":[187.5,0.3],"ibnuyeyne|ahmedsalihmisri":[187.5,0.3],"ibnuyeyne|ahmedmeni":[187.5,0.3],"ibnuyeyne|ibrahimfezari":[187.5,0.3],"ibnuyeyne|safii":[187.5,0.3],"ibnuyeyne|kattan":[187.5,0.3],"ibnuyeyne|ibnmehdi":[-2250,0.3],"ibnuyeyne|kuteybesaid":[187.5,0.3],"abdullahtavus|ibncureyc":[187.5,0.3],"ibnebimuleyke|ibncureyc":[187.5,0.3],"ibnhuseymkhaysem|ibncureyc":[187.5,0.3],"abdulhamidcubeyr|ibncureyc":[187.5,0.3],"abdulkerimcezeri|ibncureyc":[187.5,0.3],"ataebirebah|ibncureyc":[187.5,0.3],"ataihorasani|ibncureyc":[187.5,0.3],"ikrimehalid|ibncureyc":[187.5,0.3],"ikrime|ibncureyc":[187.5,0.3],"amrsuayb|ibncureyc":[187.5,0.3],"kasimebibezze|ibncureyc":[187.5,0.3],"alaabdrahman|ibncureyc":[187.5,0.3],"mucahid|ibncureyc":[187.5,0.3],"muhammedabbadcafer|ibncureyc":[187.5,0.3],"yahyasaidensari|ibncureyc":[187.5,0.3],"ubeydullahomeri|ibncureyc":[187.5,0.3],"ubeydullahebiyezid|ibncureyc":[187.5,0.3],"ibnsihab|ibncureyc":[187.5,0.3],"hisamurve|ibncureyc":[187.5,0.3],"nafiibnomer|ibncureyc":[187.5,0.3],"ibncureyc|haccacmuhammed":[187.5,0.3],"ibncureyc|ibnuleyye":[187.5,0.3],"ibncureyc|ismailayyas":[187.5,0.3],"ibncureyc|enesiyaz":[187.5,0.3],"ibncureyc|sevryezid":[174.1,0.3],"ibncureyc|caferavn":[187.5,0.3],"ibncureyc|hafsgiyas":[187.5,0.3],"ibncureyc|ebuusamehammad":[187.5,0.3],"ibncureyc|hammadzeyd":[187.5,0.3],"ibncureyc|hammadseleme":[187.5,0.3],"ibncureyc|halidharis":[187.5,0.15],"ibncureyc|ruhubade":[187.5,0.3],"ibncureyc|davudattar":[187.5,0.3],"ibncureyc|sevri":[187.5,0.3],"ibncureyc|ibnuyeyne":[187.5,0.15],"ibncureyc|abdurrezzak":[187.5,0.3],"ibnsihab|mamer":[187.5,0.3],"ibnmunkedir|mamer":[187.5,0.15],"hisamurve|mamer":[187.5,0.15],"hemmammunebbih|mamer":[187.5,0.3],"matarverrak|mamer":[187.5,0.3],"mansurmutemir|mamer":[187.5,0.3],"ebuishaksebii|mamer":[187.5,0.3],"amrdinar|mamer":[187.5,0.3],"eyyubsahtiyani|mamer":[187.5,0.3],"mamer|abdurrezzak":[187.5,0.3],"mamer|hisamyusufsanani":[187.5,0.15],"mamer|ibnmubarek":[187.5,0.3],"mamer|ibnuleyye":[187.5,0.3],"mamer|sevri":[187.5,0.3],"mamer|mutemirsuleyman":[187.5,0.3],"mamer|abdulalaabdulala":[187.5,0.3],"mamer|isabyunus":[187.5,0.3],"mamer|yezidzurey":[187.5,0.3],"mamer|gunder":[187.5,0.3],"mamer|hammadzeyd":[187.5,0.3],"mamer|vuheybhalid":[187.5,0.3],"mamer|ebansattar":[187.5,0.3],"mamer|mervanfezari":[187.5,0.3],"mamer|vakidi":[187.5,0.3],"mamer|ibncureyc":[187.5,0.3],"mamer|ibnebiaruba":[187.5,0.3],"mamer|sube":[187.5,0.3],"mamer|hisamdestuvai":[74,0.3],"mamer|davudattar":[187.5,0.15],"ishaktalha|evzai":[187.5,0.3],"hassanatiyye|evzai":[187.5,0.3],"rebiaebiabdrahman|evzai":[187.5,0.3],"rebiayezid|evzai":[187.5,0.3],"suleymanhabib|evzai":[187.5,0.3],"amess|evzai":[187.5,0.3],"suleymanmusadimaski|evzai":[187.5,0.3],"saddadebuammar|evzai":[187.5,0.3],"hakemuteybe|evzai":[187.5,0.3],"abdelubabe|evzai":[187.5,0.6],"ataebirebah|evzai":[187.5,0.3],"ataihorasani|evzai":[187.5,0.3],"ikrimehalid|evzai":[187.5,0.3],"amrsuayb|evzai":[187.5,0.3],"umeyrhani|evzai":[187.5,0.3],"kasimmuhaymire|evzai":[187.5,0.3],"kurrahayvil|evzai":[187.5,0.3],"muhammedibrahimteymi|evzai":[187.5,0.3],"ibnsirin|evzai":[187.5,0.3],"muhammedabbadcafer|evzai":[187.5,0.3],"ebucafermuhbakir|evzai":[187.5,0.45],"ibnsihab|evzai":[187.5,0.3],"ibnmunkedir|evzai":[187.5,0.3],"muhammedvelidzubeydi|evzai":[133.2,0.3],"mutallibhantab|evzai":[187.5,0.3],"mekhul|evzai":[187.5,0.3],"nafiibnomer|evzai":[187.5,0.3],"yahyasaidensari|evzai":[187.5,0.3],"meymunmihran|evzai":[187.5,0.3],"ibncureyc|evzai":[187.5,0.3],"evzai|ibrahimfezari":[187.5,0.3],"evzai|ismailayyas":[187.5,0.3],"evzai|enesiyaz":[187.5,0.3],"evzai|bakiyyevelid":[187.5,0.3],"evzai|ibnmubarek":[187.5,0.3],"evzai|ibnnumeyr":[187.5,0.3],"evzai|abdurrezzak":[187.5,0.3],"evzai|ebulmugirehavlani":[187.5,0.3],"evzai|ubeydullahmusa":[187.5,0.3],"evzai|isabyunus":[187.5,0.3],"evzai|suaybishakdimaski":[187.5,0.3],"evzai|muhammedharbhavlani":[187.5,0.3],"evzai|muhammedsuaybsabur":[187.5,0.3],"evzai|firyabi":[187.5,0.3],"evzai|hikalziyad":[187.5,0.3],"evzai|veki":[187.5,0.3],"evzai|mafairan":[187.5,0.3],"evzai|amrebiselemetennisi":[187.5,0.3],"evzai|bisrbekirtennisi":[187.5,0.3],"evzai|damrarebia":[187.5,0.3],"evzai|saidabdulaziz":[187.5,0.3],"evzai|sevri":[187.5,0.3],"evzai|sube":[187.5,0.3],"evzai|malik":[187.5,0.3],"evzai|ebuasimnebil":[187.5,0.15],"eyyubsahtiyani|ibnebiaruba":[187.5,0.3],"hasanbasri|ibnebiaruba":[187.5,0.3],"amess|ibnebiaruba":[187.5,0.3],"asimbehdele|ibnebiaruba":[187.5,0.15],"alizeydcudan|ibnebiaruba":[187.5,0.15],"amiralhavl|ibnebiaruba":[187.5,0.3],"ikrimeammar|ibnebiaruba":[88.6,0.3],"ibnebiaruba|abdulvarissaid":[187.5,0.3],"ibnebiaruba|abdulvehhabata":[187.5,0.3],"ibnebiaruba|abdesuleyman":[187.5,0.3],"ibnebiaruba|alimushir":[187.5,0.3],"ibnebiaruba|isabyunus":[187.5,0.3],"ibnebiaruba|muhammedbisrabdi":[187.5,0.15],"ibnebiaruba|gunder":[187.5,0.3],"ibnebiaruba|muhammedebiadi":[187.5,0.3],"ibnebiaruba|muazmuaz":[187.5,0.3],"ibnebiaruba|nadrsumeyl":[187.5,0.3],"ibnebiaruba|kattan":[187.5,0.3],"ibnebiaruba|yezidzurey":[187.5,0.3],"ibnebiaruba|yezidharun":[187.5,0.3],"ibnebiaruba|ruhubade":[187.5,0.3],"ibnebiaruba|halidharis":[187.5,0.3],"ishaktalha|hammadseleme":[187.5,0.3],"enessirin|hammadseleme":[187.5,0.3],"eyyubsahtiyani|hammadseleme":[187.5,0.3],"sabitbunani|hammadseleme":[187.5,0.3],"sumameenes|hammadseleme":[187.5,0.3],"haccacertat|hammadseleme":[187.5,0.3],"hammadebisuleyman|hammadseleme":[187.5,0.3],"humeydtavil|hammadseleme":[187.5,0.3],"halidhazza|hammadseleme":[187.5,0.3],"davudebihind|hammadseleme":[187.5,0.3],"rebiaebiabdrahman|hammadseleme":[187.5,0.3],"zeydeslem|hammadseleme":[187.5,0.45],"sadibrahim|hammadseleme":[187.5,0.3],"cureyri|hammadseleme":[187.5,0.3],"selemekuheyl|hammadseleme":[187.5,0.3],"suleymanteymi|hammadseleme":[187.5,0.3],"simakharb|hammadseleme":[187.5,0.3],"suheylebisalih|hammadseleme":[187.5,0.3],"asimbehdele|hammadseleme":[187.5,0.3],"amiralhavl|hammadseleme":[187.5,0.3],"ibnebimuleyke|hammadseleme":[187.5,0.3],"ibnhuseymkhaysem|hammadseleme":[187.5,0.45],"abdullahavn|hammadseleme":[187.5,0.3],"ubeydullahomeri2|hammadseleme":[187.5,0.3],"ebuimrancevni|hammadseleme":[187.5,0.3],"abdulmelikumeyr|hammadseleme":[187.5,0.45],"ubeydullahomeri|hammadseleme":[187.5,0.3],"ataisaib|hammadseleme":[187.5,0.3],"ataihorasani|hammadseleme":[187.5,0.3],"ikrimehalid|hammadseleme":[187.5,0.3],"alizeydcudan|hammadseleme":[187.5,0.15],"ammarebiammar|hammadseleme":[187.5,0.3],"amryahyamazini|hammadseleme":[187.5,0.3],"ibnishak|hammadseleme":[187.5,0.3],"hammadseleme|ibnmehdi":[187.5,0.3],"hammadseleme|abdussamed":[187.5,0.3],"hammadseleme|affanmuslim":[187.5,0.3],"hammadseleme|ebunuaymfadl":[187.5,0.3],"hammadseleme|hebbanhilal":[187.5,0.3],"hammadseleme|musaismailtebuzeki":[187.5,0.15],"hammadseleme|hisamtayalisi":[187.5,0.3],"hammadseleme|muslimibrahim":[187.5,0.3],"hammadseleme|amrmerzuk":[187.5,0.3],"hammadseleme|ebunasrtemmar":[187.5,0.3],"hammadseleme|nadrsumeyl":[187.5,0.3],"hammadseleme|muazmuaz":[187.5,0.3],"hammadseleme|malik":[187.5,0.3],"hammadseleme|ibnuleyye":[187.5,0.3],"caferebivahsiyye|ebuavane":[-187.5,0.3],"husaynabdrahman|ebuavane":[187.5,0.3],"hakemuteybe|ebuavane":[187.5,0.3],"hammadebisuleyman|ebuavane":[187.5,0.3],"davudebihind|ebuavane":[187.5,0.3],"sadibrahim|ebuavane":[187.5,0.3],"saidmesrukhsevri|ebuavane":[187.5,0.3],"amess|ebuavane":[187.5,0.3],"simakharb|ebuavane":[187.5,0.3],"suheylebisalih|ebuavane":[187.5,0.3],"asimbehdele|ebuavane":[187.5,0.3],"asimahvel|ebuavane":[187.5,0.3],"abdullahavn|ebuavane":[187.5,0.3],"abdulazizsuheyb|ebuavane":[187.5,0.3],"abdulmelikebisuleyman|ebuavane":[187.5,0.3],"abdulmelikumeyr|ebuavane":[187.5,0.3],"ataisaib|ebuavane":[187.5,0.3],"firasyahya|ebuavane":[187.5,0.3],"ibnishak|ebuavane":[187.5,0.3],"ibnmunkedir|ebuavane":[187.5,0.3],"mutarriftarif|ebuavane":[187.5,0.3],"mugirmiksem|ebuavane":[187.5,0.3],"mansurzazan|ebuavane":[187.5,0.3],"mansurmutemir|ebuavane":[187.5,0.3],"ismailebiislamsibani|ebuavane":[187.5,0.3],"ebuzubeyrmekki|ebuavane":[187.5,0.3],"ebuhasin|ebuavane":[187.5,0.3],"hilalvezzan|ebuavane":[187.5,0.45],"yalaata|ebuavane":[187.5,0.3],"ebuavane|ibnuleyye":[187.5,0.3],"ebuavane|ibnmehdi":[187.5,0.3],"ebuavane|said_mansur":[187.5,0.3],"ebuavane|kavariri":[187.5,0.3],"ebuavane|seybanferruh":[187.5,0.3],"ebuavane|haccacminhal":[187.5,0.3],"ebuavane|halefhisam":[187.5,0.3],"ebuavane|affanmuslim":[187.5,0.3],"ebuavane|musaismailtebuzeki":[187.5,0.3],"ebuavane|hisamtayalisi":[187.5,0.3],"eyyubsahtiyani|huseym":[187.5,0.3],"caferebivahsiyye|huseym":[187.5,0.45],"haccacertat|huseym":[187.5,0.15],"haccacsavvaf|huseym":[187.5,0.3],"husaynabdrahman|huseym":[187.5,0.3],"humeydtavil|huseym":[187.5,0.3],"halidhazza|huseym":[187.5,0.15],"davudebihind|huseym":[187.5,0.3],"sufyanhusayn|huseym":[142,0.3],"amess|huseym":[187.5,0.3],"suleymanteymi|huseym":[187.5,0.3],"siyarebilhakem|huseym":[187.5,0.3],"salihhayy|huseym":[187.5,0.3],"asimahvel|huseym":[187.5,0.3],"amiralhavl|huseym":[187.5,0.3],"abdullahsubrume|huseym":[187.5,0.3],"ebusalih|huseym":[187.5,0.3],"abdullahavn|huseym":[187.5,0.3],"abdulhamidcafer|huseym":[187.5,0.3],"abdulazizsuheyb|huseym":[187.5,0.3],"abdulmelikebisuleyman|huseym":[187.5,0.3],"abdulmelikumeyr|huseym":[187.5,0.15],"ubeydullahomeri|huseym":[187.5,0.3],"ataisaib|huseym":[187.5,0.3],"alizeydcudan|huseym":[187.5,0.3],"avvamhavseb|huseym":[187.5,0.3],"avfarabi|huseym":[187.5,0.3],"kasimmihran|huseym":[187.5,0.3],"leysbsad|huseym":[187.5,0.3],"mucalidsaid|huseym":[187.5,0.3],"ibnishak|huseym":[187.5,0.3],"ibnsihab|huseym":[187.5,0.15],"mutarriftarif|huseym":[187.5,0.3],"mugirmiksem|huseym":[187.5,0.3],"mansurzazan|huseym":[187.5,0.3],"hisamhassan|huseym":[187.5,0.6],"hisamyusufsanani|huseym":[187.5,0.3],"yahyasaidensari|huseym":[187.5,0.3],"huseym|ahmedhanbel":[187.5,0.3],"huseym|ahmedmeni":[187.5,0.3],"huseym|ibnebiseybe":[187.5,0.3],"huseym|osmanebiseybe":[187.5,0.3],"huseym|zuheyrharb":[187.5,0.3],"huseym|alimedini":[187.5,0.3],"huseym|alihucr":[187.5,0.3],"huseym|amrnakid":[187.5,0.3],"huseym|ahmeddevraki":[187.5,0.15],"huseym|saidsuleymansadeviye":[187.5,0.3],"huseym|muhammedisataba":[187.5,0.3],"huseym|said_mansur":[187.5,0.3],"huseym|kuteybesaid":[187.5,0.3],"huseym|gunder":[187.5,0.3],"huseym|ibnmubarek":[187.5,0.3],"huseym|ibnmehdi":[187.5,0.3],"huseym|sevri":[187.5,0.3],"huseym|sube":[187.5,0.3],"huseym|malik":[187.5,0.3],"huseym|ibnuyeyne":[187.5,0.3],"ebanosman|ibnishak":[187.5,0.3],"ataebirebah|ibnishak":[187.5,0.3],"ebuselemeavf|ibnishak":[187.5,0.3],"kasimmuhammed|ibnishak":[187.5,0.3],"mekhul|ibnishak":[187.5,0.15],"abdrahmanesved|ibnishak":[187.5,0.3],"ibnsihab|ibnishak":[187.5,0.3],"yezidebihabib|ibnishak":[187.5,0.3],"enes|ibnishak":[187.5,0.3],"ibnishak|yezidharun":[187.5,0.3],"ibnishak|yezidzurey":[187.5,0.3],"ibnishak|yalaubeyd":[187.5,0.3],"ibnishak|yunusbukeyr":[187.5,0.3],"ibnishak|ibnuleyye":[187.5,0.3],"zekeriyyaishak|veki":[187.5,0.3],"zekeriyyaebizaide|veki":[187.5,0.3],"ibnuyeyne|veki":[187.5,0.3],"amess|veki":[187.5,0.3],"serikkadi|veki":[187.5,0.3],"abdullahavn|veki":[187.5,0.15],"abdulhamidcafer|veki":[187.5,0.3],"mesudi|veki":[187.5,0.3],"ibncureyc|veki":[187.5,0.15],"ubeydullahomeri|veki":[187.5,0.3],"ikrimeammar|veki":[187.5,0.3],"aliebisalihhayy|veki":[187.5,0.3],"alimubarekhinai|veki":[187.5,0.3],"omerzerr|veki":[187.5,0.3],"hanzalasufyan|veki":[187.5,0.3],"suleymanmugire|veki":[187.5,0.45],"saidubeydtai|veki":[187.5,0.3],"davudkaysferra|veki":[187.5,0.3],"saidabdulaziz|veki":[187.5,0.3],"abdulazizomer|veki":[187.5,0.3],"hisamurve|veki":[187.5,0.3],"hammadzeyd|veki":[187.5,0.3],"ibnishak|veki":[187.5,0.3],"veki|ahmedhanbel":[187.5,0.3],"veki|ibnmain":[187.5,0.3],"veki|alimedini":[187.5,0.3],"veki|ibnebiseybe":[187.5,0.3],"veki|osmanebiseybe":[187.5,0.3],"veki|misned":[187.5,0.45],"veki|hennadseri":[187.5,0.3],"veki|yahyayahyanisaburi":[187.5,0.3],"veki|mahmudgaylan":[187.5,0.3],"veki|ibnebiomeradeni":[187.5,0.3],"veki|nasralicehdami":[187.5,0.15],"veki|yahyaadem":[375,0.3],"veki|yezidharun":[178.5,0.3],"veki|kuteybesaid":[187.5,0.3],"veki|ibnrahuye":[187.5,0.3],"ibrahimsad|ibnmubarek":[187.5,0.3],"ibrahimtahman|ibnmubarek":[187.5,0.3],"ibrahimebiable|ibnmubarek":[187.5,0.3],"ibrahimfezari|ibnmubarek":[187.5,0.3],"ibrahimukbe|ibnmubarek":[187.5,0.3],"usamezeydeslem|ibnmubarek":[187.5,0.3],"usamezeydleysi|ibnmubarek":[187.5,0.3],"ismailebihalid|ibnmubarek":[187.5,0.3],"ismailayyas|ibnmubarek":[187.5,0.3],"ebuburde|ibnmubarek":[187.5,0.3],"cerirhazim|ibnmubarek":[187.5,0.3],"caferburkan|ibnmubarek":[187.5,0.3],"haccacertat|ibnmubarek":[187.5,0.3],"harmalaimran|ibnmubarek":[187.5,0.3],"huseynmuallim|ibnmubarek":[375,0.15],"hammadzeyd|ibnmubarek":[187.5,0.3],"hammadseleme|ibnmubarek":[187.5,0.3],"hamzazeyyat|ibnmubarek":[187.5,0.3],"humeydtavil|ibnmubarek":[187.5,0.3],"hanzalasufyan|ibnmubarek":[187.5,0.3],"hayveseri|ibnmubarek":[187.5,0.3],"halidhazza|ibnmubarek":[187.5,0.3],"davudattar|ibnmubarek":[187.5,0.3],"davudkaysferra|ibnmubarek":[187.5,0.3],"zaidekudame|ibnmubarek":[187.5,0.3],"zekeriyyaishak|ibnmubarek":[187.5,0.3],"zekeriyyaebizaide|ibnmubarek":[187.5,0.3],"zuhayrmuaviye|ibnmubarek":[187.5,0.3],"rebiaebiabdrahman|ibnmubarek":[187.5,0.3],"rebiuenes|ibnmubarek":[-187.5,0.3],"serieyyahya|ibnmubarek":[187.5,0.15],"sadsaidensari|ibnmubarek":[187.5,0.3],"cureyri|ibnmubarek":[187.5,0.3],"saidebiyyubmisri|ibnmubarek":[187.5,0.3],"saidabdulaziz|ibnmubarek":[187.5,0.3],"ibnebiaruba|ibnmubarek":[187.5,0.3],"ibnuyeyne|ibnmubarek":[187.5,0.3],"hasanamrfukaymi|ibnmubarek":[187.5,0.3],"ibnmubarek|abdan":[187.5,0.3],"ibnmubarek|ibnebiseybe":[187.5,0.3],"ibnmubarek|osmanebiseybe":[187.5,0.3],"ibnmubarek|ibnvehb":[187.5,0.3],"ibnmubarek|ibnmehdi":[187.5,0.3],"ibnmubarek|abdurrezzak":[187.5,0.3],"ibnmubarek|affanmuslim":[187.5,0.3],"ibnmubarek|alihasansakik":[187.5,0.3],"ibnmubarek|alihucr":[187.5,0.3],"ibnmubarek|kuteybesaid":[187.5,0.3],"ibnmubarek|suveydnasr":[187.5,0.3],"ibnmubarek|ibnmain":[187.5,0.3],"ibnmubarek|yahyaadem":[187.5,0.3],"ibnmubarek|ebulahvess":[187.5,0.3],"ismailebihalid|kattan":[187.5,0.15],"usamezeydleysi|kattan":[187.5,0.3],"esaseabdulmelik|kattan":[187.5,0.15],"behzhakim|kattan":[187.5,0.3],"sevryezid|kattan":[187.5,0.3],"caferisadik|kattan":[187.5,0.3],"hasanisad|kattan":[187.5,0.3],"hatimebisagire|kattan":[187.5,0.3],"haccacsavvaf|kattan":[187.5,0.3],"hasanzekvan|kattan":[187.5,0.3],"huseynmuallim|kattan":[187.5,0.3],"hammadseleme|kattan":[187.5,0.3],"humeydtavil|kattan":[187.5,0.15],"hanzalasufyan|kattan":[187.5,0.6],"halidhazza|kattan":[187.5,0.3],"husaymirak|kattan":[187.5,0.3],"davudkaysferra|kattan":[187.5,0.3],"zekeriyyaebizaide|kattan":[187.5,0.3],"sadibrahim|kattan":[187.5,0.3],"selimhayyan|kattan":[187.5,0.3],"amess|kattan":[187.5,0.15],"suleymanteymi|kattan":[187.5,0.3],"seyfsuleymanmekki|kattan":[187.5,0.3],"kattan|ibnmehdi":[74,0.3],"kattan|ahmedhanbel":[187.5,0.3],"kattan|alimedini":[187.5,0.3],"kattan|ibnmain":[187.5,0.3],"kattan|ibnebiseybe":[187.5,0.15],"kattan|kavariri":[187.5,0.3],"kattan|ubeydullahmuazanberi":[187.5,0.3],"kattan|affanmuslim":[187.5,0.3],"kattan|misned":[187.5,0.3],"kattan|bundar":[187.5,0.3],"kattan|ibnmusenna":[187.5,0.3],"kattan|amrbnalisayrafi":[187.5,0.3],"kattan|abbasanberi":[187.5,0.45],"kattan|yakubdevraki":[187.5,0.3],"kattan|nasralicehdami":[187.5,0.3],"kattan|mutemirsuleyman":[187.5,0.3],"kattan|sube":[187.5,0.3],"ebansattar|ibnmehdi":[187.5,0.3],"ibrahimsad|ibnmehdi":[187.5,0.3],"israilyunus|ibnmehdi":[187.5,0.3],"cerirhazim|ibnmehdi":[187.5,0.3],"harbseddad|ibnmehdi":[187.5,0.3],"hammadzeyd|ibnmehdi":[187.5,0.3],"davudkaysferra|ibnmehdi":[187.5,0.3],"zaidekudame|ibnmehdi":[187.5,0.3],"zuhayrmuaviye|ibnmehdi":[187.5,0.3],"selimhayyan|ibnmehdi":[187.5,0.3],"sallamebimuti|ibnmehdi":[187.5,0.3],"serikkadi|ibnmehdi":[187.5,0.45],"mesudi|ibnmehdi":[187.5,0.3],"macisun|ibnmehdi":[187.5,0.3],"darevardi|ibnmehdi":[187.5,0.3],"abdulvahidziyad|ibnmehdi":[187.5,0.3],"ikrimeammar|ibnmehdi":[187.5,0.3],"omerzerr|ibnmehdi":[187.5,0.3],"malikmigvel|ibnmehdi":[187.5,0.3],"muaviyesalih|ibnmehdi":[187.5,0.3],"ibnmehdi|ahmedhanbel":[187.5,0.3],"ibnmehdi|alimedini":[187.5,0.3],"ibnmehdi|ibnmain":[187.5,0.15],"ibnmehdi|kavariri":[187.5,0.3],"ibnmehdi|osmanebiseybe":[187.5,0.3],"ibnmehdi|ibnvehb":[-750,0.3],"ibnmehdi|amrbnalisayrafi":[187.5,0.3],"ibnmehdi|bundar":[187.5,0.3],"ibnmehdi|ibnmusenna":[187.5,0.3],"ibnmehdi|muhammedabdulalasanani":[187.5,0.3],"ibnmehdi|zuhli":[187.5,0.3],"ibnmehdi|mucahidmusa":[187.5,0.3],"ibnmehdi|nasralicehdami":[187.5,0.3],"ibnmehdi|yahyayahyanisaburi":[187.5,0.3],"ibnmehdi|yakubdevraki":[187.5,0.3],"ibnmehdi|ebuasimnebil":[187.5,0.3],"ibnidris|yahyaadem":[187.5,0.3],"abdusselamharb|yahyaadem":[187.5,0.3],"fudaylibnayaz|yahyaadem":[187.5,0.3],"kaysrebi|yahyaadem":[187.5,0.3],"fitrhalife|yahyaadem":[187.5,0.3],"malikmigvel|yahyaadem":[187.5,0.3],"misersukdam|yahyaadem":[187.5,0.3],"muhammedfudayl|yahyaadem":[187.5,0.3],"huseym|yahyaadem":[187.5,0.3],"varkaomer|yahyaadem":[187.5,0.3],"ebuavane|yahyaadem":[187.5,0.3],"ibnebizaide|yahyaadem":[187.5,0.3],"ebubekirayyas|yahyaadem":[187.5,0.3],"ebumuaviyedarir|yahyaadem":[187.5,0.3],"yahyaadem|ahmedhanbel":[187.5,0.3],"yahyaadem|ibnrahuye":[187.5,0.3],"yahyaadem|ibnebiseybe":[187.5,0.3],"yahyaadem|osmanebiseybe":[187.5,0.3],"yahyaadem|alimedini":[187.5,0.3],"yahyaadem|ibnmain":[187.5,0.3],"yahyaadem|abdhumeyd":[187.5,0.3],"yahyaadem|ebukureyb":[187.5,0.3],"yahyaadem|muhammedrafi":[187.5,0.3],"yahyaadem|mahmudgaylan":[187.5,0.3],"israilyunus|ibnebizaide":[187.5,0.3],"ismailebihalid|ibnebizaide":[187.5,0.15],"haccacertat|ibnebizaide":[187.5,0.3],"hasanamrfukaymi|ibnebizaide":[187.5,0.3],"halidselememahzumi|ibnebizaide":[187.5,0.3],"davudebihind|ibnebizaide":[187.5,0.3],"zekeriyyaebizaide|ibnebizaide":[187.5,0.3],"ibnuyeyne|ibnebizaide":[187.5,0.3],"amess|ibnebizaide":[187.5,0.3],"salihhayy|ibnebizaide":[187.5,0.3],"asimahvel|ibnebizaide":[187.5,0.15],"abdullahavn|ibnebizaide":[187.5,0.3],"abdulazizomer|ibnebizaide":[187.5,0.3],"abdulmelikhumeyd|ibnebizaide":[187.5,0.3],"abdulmelikebisuleyman|ibnebizaide":[187.5,0.3],"ibncureyc|ibnebizaide":[187.5,0.45],"ubeydullahomeri|ibnebizaide":[187.5,0.3],"ikrimeammar|ibnebizaide":[187.5,0.3],"amrmeymunmihran|ibnebizaide":[187.5,0.3],"leysebisuleym|ibnebizaide":[187.5,0.3],"mucalidsaid|ibnebizaide":[187.5,0.15],"ibnishak|ibnebizaide":[187.5,0.3],"misersukdam|ibnebizaide":[187.5,0.3],"musacuheni|ibnebizaide":[187.5,0.3],"nafiomercumahi|ibnebizaide":[187.5,0.3],"hasimhasim|ibnebizaide":[187.5,0.3],"hisamurve|ibnebizaide":[187.5,0.3],"varkaomer|ibnebizaide":[132.2,0.3],"yahyasaidensari|ibnebizaide":[187.5,0.3],"ebumalikesceyi|ibnebizaide":[-187.5,0.3],"ibnebizaide|ibrahimmusaferra":[187.5,0.3],"ibnebizaide|ahmedhanbel":[187.5,0.15],"ibnebizaide|ahmedmeni":[187.5,0.3],"ibnebizaide|hasanarafe":[187.5,0.3],"ibnebizaide|sericyunus":[187.5,0.3],"ibnebizaide|ibnebiseybe":[187.5,0.3],"ibnebizaide|osmanebiseybe":[187.5,0.3],"ibnebizaide|kavariri":[187.5,0.15],"ibnebizaide|alimedini":[187.5,0.15],"ibnebizaide|kuteybesaid":[187.5,0.3],"ibnebizaide|ebukureyb":[187.5,0.3],"ibnebizaide|muhammedubeydmuharibi":[187.5,0.3],"ibnebizaide|muhammedisataba":[187.5,0.3],"ibnebizaide|harunmaruf":[187.5,0.3],"ibnebizaide|hennadseri":[187.5,0.15],"ibnebizaide|ibnmain":[187.5,0.3],"ibnebizaide|yahyayahyanisaburi":[187.5,0.3],"ibnebizaide|yakubdevraki":[187.5,0.45],"ahmedhanbel|buhari":[187.5,0.3],"ahmedsalihmisri|buhari":[187.5,0.3],"ibnrahuye|buhari":[187.5,0.3],"ibnebiuveys|buhari":[187.5,0.3],"ibrahimmusaferra|buhari":[187.5,0.3],"ibrahimmunzirhizami|buhari":[187.5,0.15],"ademebiiyas|buhari":[187.5,0.3],"alimedini|buhari":[187.5,0.15],"ibnmain|buhari":[187.5,0.3],"kanebi|buhari":[187.5,0.3],"kuteybesaid|buhari":[187.5,0.3],"misned|buhari":[187.5,0.3],"bundar|buhari":[187.5,0.3],"ibnmusenna|buhari":[187.5,0.3],"amrbnalisayrafi|buhari":[187.5,0.15],"ebunuaymfadl|buhari":[187.5,0.3],"ebuasimnebil|buhari":[187.5,0.3],"affanmuslim|buhari":[187.5,0.3],"muslimibrahim|buhari":[187.5,0.3],"musaismailtebuzeki|buhari":[187.5,0.3],"hisamtayalisi|buhari":[187.5,0.3],"haccacminhal|buhari":[187.5,0.3],"alicad|buhari":[187.5,0.3],"saidsuleymansadeviye|buhari":[187.5,0.3],"ibnebiseybe|buhari":[187.5,0.3],"muhammedisataba|buhari":[187.5,0.3],"zuhli|buhari":[170.3,0.3],"mahmudgaylan|buhari":[187.5,0.3],"ibnebiomeradeni|buhari":[187.5,0.15],"buhari|tirmizi":[187.5,0.3],"buhari|ebuzuraraazi":[187.5,0.3],"buhari|ebuhatimrazi":[187.5,0.3],"buhari|muslim":[142.3,0.3],"ahmedhanbel|muslim":[187.5,0.3],"ahmeddevraki|muslim":[187.5,0.3],"ahmedmeni|muslim":[187.5,0.3],"ibrahimmusaferra|muslim":[187.5,0.3],"ibnrahuye|muslim":[187.5,0.45],"ishakkevsec|muslim":[187.5,0.45],"ibnebiuveys|muslim":[187.5,0.3],"zuheyrharb|muslim":[187.5,0.3],"said_mansur|muslim":[187.5,0.3],"sericyunus|muslim":[187.5,0.15],"seybanferruh|muslim":[187.5,0.15],"halefhisam|muslim":[187.5,0.3],"kanebi|muslim":[187.5,0.3],"abbasanberi|muslim":[187.5,0.3],"abdhumeyd|muslim":[186.1,0.3],"darimi|muslim":[120.3,0.3],"harmalayahya|muslim":[187.5,0.3],"hasanaliayyal|muslim":[187.5,0.3],"suveydsaidhadesani|muslim":[187.5,0.3],"ibnebiseybe|muslim":[187.5,0.3],"osmanebiseybe|muslim":[187.5,0.3],"kavariri|muslim":[187.5,0.3],"ebukureyb|muslim":[187.5,0.3],"muhammedrafi|muslim":[187.5,0.3],"yahyayahyanisaburi|muslim":[187.5,0.3],"kuteybesaid|muslim":[187.5,0.3],"bundar|muslim":[187.5,0.3],"ibnmusenna|muslim":[187.5,0.3],"hennadseri|muslim":[187.5,0.3],"harunmaruf|muslim":[187.5,0.3],"nasralicehdami|muslim":[187.5,0.15],"yakubdevraki|muslim":[187.5,0.3],"ubeydullahmuazanberi|muslim":[187.5,0.15],"ahmedhanbel|ebudavud":[187.5,0.3],"ibnebiseybe|ebudavud":[187.5,0.3],"osmanebiseybe|ebudavud":[187.5,0.3],"misned|ebudavud":[187.5,0.3],"zuheyrharb|ebudavud":[187.5,0.3],"kanebi|ebudavud":[187.5,0.3],"said_mansur|ebudavud":[187.5,0.3],"ahmeddevraki|ebudavud":[187.5,0.3],"muslimibrahim|ebudavud":[187.5,0.3],"musaismailtebuzeki|ebudavud":[187.5,0.3],"hisamtayalisi|ebudavud":[187.5,0.3],"kuteybesaid|ebudavud":[187.5,0.3],"ahmedsalihmisri|ebudavud":[187.5,0.3],"halefhisam|ebudavud":[187.5,0.3],"yahyaadem|ebudavud":[187.5,0.3],"bundar|tirmizi":[187.5,0.15],"ibnmusenna|tirmizi":[187.5,0.3],"kuteybesaid|tirmizi":[187.5,0.3],"hennadseri|tirmizi":[187.5,0.3],"mahmudgaylan|tirmizi":[187.5,0.3],"ebukureyb|tirmizi":[187.5,0.3],"ibnebiomeradeni|tirmizi":[187.5,0.3],"muhammedubeydmuharibi|tirmizi":[187.5,0.3],"ahmedmeni|tirmizi":[187.5,0.3],"alihucr|tirmizi":[187.5,0.3],"muhammedabdulalasanani|tirmizi":[187.5,0.3],"kuteybesaid|nesai":[187.5,0.15],"ishakkevsec|nesai":[187.5,0.3],"ibnrahuye|nesai":[187.5,0.3],"amrbnalisayrafi|nesai":[187.5,0.3],"muhammedrafi|nesai":[187.5,0.3],"muhammedabdulalasanani|nesai":[187.5,0.3],"abbasanberi|nesai":[187.5,0.3],"harmalayahya|nesai":[187.5,0.3],"ahmedsalihmisri|nesai":[187.5,0.3],"yakubdevraki|nesai":[187.5,0.3],"nasralicehdami|nesai":[187.5,0.3],"hasanarafe|nesai":[187.5,0.3],"ibnebiseybe|ibnmace":[187.5,0.3],"osmanebiseybe|ibnmace":[187.5,0.3],"hennadseri|ibnmace":[187.5,0.15],"suveydsaidhadesani|ibnmace":[187.5,0.3],"ebukureyb|ibnmace":[187.5,0.3],"muhammedubeydmuharibi|ibnmace":[187.5,0.3],"ibnebiomeradeni|ibnmace":[187.5,0.3],"amrnakid|ibnmace":[187.5,0.15],"ibrahimmusaferra|ibnmace":[187.5,0.15],"hasanarafe|ibnmace":[187.5,0.3],"zuhli|ibnmace":[187.5,0.3],"ibnrahuye|darimi":[187.5,0.3],"ahmedhanbel|darimi":[187.5,0.3],"yahyaadem|darimi":[187.5,0.3],"ebunuaymfadl|darimi":[187.5,0.3],"ebuasimnebil|darimi":[187.5,0.3],"ibnmain|darimi":[187.5,0.3],"nebi|mikdad":[187.5,0.3],"nebi|ubey":[187.5,0.3],"nebi|usame":[187.5,0.3],"nebi|basra":[187.5,0.3],"nebi|fadl":[187.5,0.3],"nebi|kabahbar":[187.5,0.3],"nebi|aise":[187.5,0.6],"nebi|enes":[187.5,0.3],"nebi|cabir":[187.5,0.3],"nebi|ibnabbas":[187.5,0.3],"nebi|ibnomer":[187.5,0.3],"nebi|ibnmesud":[187.5,0.3],"nebi|ibnzubeyr":[187.5,0.3],"nebi|bera":[187.5,0.3],"nebi|zeydarkam":[187.5,0.3],"nebi|cabirsemura":[187.5,0.3],"nebi|suhayb":[187.5,0.3],"nebi|sefine":[187.5,0.3],"nebi|hasanbali":[187.5,0.3],"nebi|huseyn":[187.5,0.3],"nebi|amrhurays":[187.5,0.3],"nebi|tariksihab":[187.5,0.3],"nebi|besrsuhaym":[187.5,0.3],"nebi|ibncafer":[187.5,0.3],"nebi|zeydsabit":[187.5,0.3],"nebi|abdrahmanebubekir":[187.5,0.3],"nebi|abdrahmanavf":[187.5,0.3],"nebi|ukbeamir":[187.5,0.3],"nebi|ebumusa":[187.5,0.3],"nebi|ebusaid":[187.5,0.3],"nebi|huzeyfe":[187.5,0.3],"nebi|rifaazuraki":[187.5,0.3],"nebi|aizamr":[187.5,0.3],"nebi|abdrahmanabza":[187.5,0.3],"nebi|esaskays":[187.5,0.3],"nebi|cerirbecel\u00ee":[187.5,0.3],"nebi|saibyezid":[187.5,0.3],"nebi|sadvakkas":[187.5,0.3],"nebi|talha":[187.5,0.3],"nebi|asimomer":[187.5,0.3],"nebi|mervan":[187.5,0.3],"nebi|mugirasube":[187.5,0.3],"nebi|imranhusayn":[187.5,0.3],"nebi|selemeekva":[187.5,0.3],"nebi|zeydhalid":[187.5,0.3],"nebi|ebuumame":[187.5,0.3],"nebi|rafihadic":[187.5,0.3],"nebi|numanbesir":[187.5,0.3],"nebi|halidvelid":[187.5,0.3],"nebi|bureyde":[187.5,0.3],"nebi|temimdari":[187.5,0.3],"nebi|hafsa":[187.5,0.3],"nebi|bilal":[187.5,0.3],"nebi|amirrebia":[187.5,0.3],"nebi|ebulubabe":[187.5,0.3]};

/* ---------- etiket kademeleri ----------
   KADEME: râvinin önem sırası (küçük = önce yer kapar).
   EKRAN_PUNTO: o kademenin ekrandaki punto boyu, ölçekten bağımsız.
   ESIK: etiketin göründüğü asgari view.k değeri.                     */

// Dört halife — müksirûn gibi, ölçekten bağımsız görünür kalırlar
const HULEFA = new Set(["ebubekir", "omer", "osman", "ali"]);

const KADEME = (id) => {
  if (id === "nebi") return 0;
  if (HULEFA.has(id)) return 1;
  if (MUELLIF.has(id)) return 1;
  if (MEDAR[id]) return 1;          // İbnü'l-Medînî'nin üç tabakasının tamamı
  if (MUKSIRUN.has(id)) return 1;
  const d = DERECE[id] || 0;
  if (d >= 20) return 2;
  if (d >= 10) return 3;
  if (d >= 5) return 4;
  if (d >= 3) return 5;
  return 6;
};

// kademeye göre ekranda hedeflenen punto (ölçekten bağımsız)
const EKRAN_PUNTO = { 0: 15, 1: 12.5, 2: 11, 3: 10.5, 4: 10, 5: 9.5, 6: 9 };

/* Ölçek eşiği kullanılmıyor. Hangi isimlerin yazılacağına, ekran
   koordinatlarında yapılan çakışma testi karar verir: önemli isimler
   önce yer kapar, sığmayanlar elenir. Yaklaştıkça yer açıldığı için
   alt kademeler kendiliğinden görünür olur.                        */
const ESIK = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

// Türkçe büyük harf (i → İ), sütun başlıkları için
const buyuk = (t) => t.replace(/i/g, "\u0130").toUpperCase();

const YILLAR = Array.from({ length: 31 }, (_, i) => 10 + i * 10);
const UST_BANT = 44;    // şehir isimleri bandı
const SOL_BANT = 58;    // yıl ekseni bandı

export default function SilsileAgi() {
  const [secim, setSecim] = useState(null);   // {tur:"ravi",id} | {tur:"kenar",e}
  const [arama, setArama] = useState("");
  const [acikArama, setAcikArama] = useState(false);
  const [view, setView] = useState({ x: 0, y: 0, k: 0.4 });
  const [suruk, setSuruk] = useState(null);
  const [uzerinde, setUzerinde] = useState(null);
  const [acildi, setAcildi] = useState(false);
  const tweenRef = useRef(null);
  const [tasindi, setTasindi] = useState(false);
  const boxRef = useRef(null);
  const [box, setBox] = useState({ w: 1000, h: 640 });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ol = () => {
      const r = el.getBoundingClientRect();
      setBox((ö) => (Math.abs(ö.w - r.width) < 0.5 && Math.abs(ö.h - r.height) < 0.5
        ? ö : { w: r.width, h: r.height }));
    };
    ol();
    // pencere boyutu değişmeden panel yeniden boyutlanabildiği için
    // doğrudan kapsayıcıyı izliyoruz
    const go = typeof ResizeObserver !== "undefined" ? new ResizeObserver(ol) : null;
    if (go) go.observe(el);
    window.addEventListener("resize", ol);
    return () => {
      if (go) go.disconnect();
      window.removeEventListener("resize", ol);
    };
  }, []);

  // Kaydırmayı sınırla: tuval kenarlarında boş beyaz alan görünmesin.
  const sinirla = useCallback((v) => {
    const gw = box.w - SOL_BANT, gh = box.h - UST_BANT;
    const cw = W * v.k, ch = H * v.k;
    let x = v.x, y = v.y;
    // Kenar payları. Etiketler düğümün altına yazıldığı için alt pay daha büyük.
    const YAN = 130, UST_PAY = 70, ALT_PAY = 190;
    if (cw >= gw) x = Math.min(SOL_BANT + YAN, Math.max(box.w - cw - YAN, x));
    else x = SOL_BANT + (gw - cw) / 2;
    if (ch >= gh) y = Math.min(UST_BANT + UST_PAY, Math.max(box.h - ch - ALT_PAY, y));
    else y = Math.min(UST_BANT + (gh - ch) / 2, UST_BANT + UST_PAY);
    return { k: v.k, x, y };
  }, [box]);

  const gitView = useCallback((v) => setView(sinirla(v)), [sinirla]);

  /* Yumuşak kamera geçişi. Ani sıçrama yerine kısa bir yumuşatma
     eğrisiyle kaydırılır; sürüklerken devreye girmez. */
  const kaydir = useCallback((hedef, sure = 520) => {
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    const son = sinirla(hedef);
    const bas = { ...view };
    const t0 = performance.now();
    const yumusat = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const adim = (an) => {
      const t = Math.min(1, (an - t0) / sure);
      const e = yumusat(t);
      setView({
        k: bas.k + (son.k - bas.k) * e,
        x: bas.x + (son.x - bas.x) * e,
        y: bas.y + (son.y - bas.y) * e,
      });
      if (t < 1) tweenRef.current = requestAnimationFrame(adim);
    };
    tweenRef.current = requestAnimationFrame(adim);
  }, [view, sinirla]);

  // açılış animasyonu için bayrak
  useEffect(() => {
    const z = setTimeout(() => setAcildi(true), 2200);
    return () => clearTimeout(z);
  }, []);

  // tuvalin görüş alanını doldurabileceği en küçük ölçek
  const enAzOlcek = useCallback(
    () => Math.min((box.w - SOL_BANT) / W, (box.h - UST_BANT) / H),
    [box]
  );

  const sigdir = useCallback(() => {
    setView(sinirla({ k: enAzOlcek(), x: 0, y: 0 }));
  }, [sinirla, enAzOlcek]);

  useEffect(() => { sigdir(); }, [sigdir]);

  const sonuclar = useMemo(() => {
    const q = arama.trim().toLowerCase();
    if (!q) return [];
    return NODES.filter((n) => n.tr.toLowerCase().includes(q) || n.ar.includes(arama.trim()))
      .sort((a, b) => (a.olum ?? 999) - (b.olum ?? 999));
  }, [arama]);

  const eslesen = useMemo(
    () => (arama.trim() ? new Set(sonuclar.map((n) => n.id)) : null),
    [arama, sonuclar]
  );

  const vurgu = useMemo(() => {
    if (!secim) return null;
    if (secim.tur === "kenar") return new Set([secim.e.a, secim.e.b]);
    const s = new Set([secim.id]);
    EDGES.forEach((e) => { if (e.a === secim.id) s.add(e.b); if (e.b === secim.id) s.add(e.a); });
    return s;
  }, [secim]);

  const sonuk = (id) => (vurgu ? !vurgu.has(id) : eslesen ? !eslesen.has(id) : false);
  const kenarSonuk = (e) => {
    if (secim && secim.tur === "kenar") return !(secim.e.a === e.a && secim.e.b === e.b);
    if (vurgu) return !(vurgu.has(e.a) && vurgu.has(e.b));
    return false;
  };

  const tekerlek = (ev) => {
    ev.preventDefault();
    const r = boxRef.current.getBoundingClientRect();
    const mx = ev.clientX - r.left, my = ev.clientY - r.top;
    const asgari = enAzOlcek();
    const yeni = Math.max(asgari, Math.min(4, view.k * (ev.deltaY < 0 ? 1.13 : 1 / 1.13)));
    gitView({ k: yeni, x: mx - ((mx - view.x) / view.k) * yeni, y: my - ((my - view.y) / view.k) * yeni });
  };

  const zoomla = (carpan) => {
    const cx = (box.w + SOL_BANT) / 2, cy = (box.h + UST_BANT) / 2;
    const asgari = enAzOlcek();
    const yeni = Math.max(asgari, Math.min(4, view.k * carpan));
    kaydir({ k: yeni, x: cx - ((cx - view.x) / view.k) * yeni, y: cy - ((cy - view.y) / view.k) * yeni }, 340);
  };

  const odaklan = (id) => {
    if (secim && secim.tur === "ravi" && secim.id === id) { setSecim(null); return; }
    setSecim({ tur: "ravi", id });
    const p = POS[id];
    const k = Math.max(view.k, 0.9);
    kaydir({ k, x: (box.w + SOL_BANT) / 2 - p.x * k, y: (box.h + UST_BANT) / 2 - p.y * k }, 620);
  };



  /* Etiket yerleştirme. Etiketler ekranda sabit puntoda çizildiği için
     uzaklaşıldıkça kutuları çakışır. Burada önem sırasına göre
     (kademe, sonra bağ sayısı) tek tek yerleştirilir; yeri dolu olan
     eleni r. Böylece önemli isimler her zaman önce yer kapar. */
  const etiketliler = useMemo(() => {
    const sirali = NODES
      .filter((n) => POS[n.id])
      .map((n) => ({ n, kad: KADEME(n.id), dg: DERECE[n.id] || 0 }))
      .sort((a, b) => a.kad - b.kad || b.dg - a.dg);

    const yerlesen = [];
    const secilenler = new Map();      // id -> "alt" | "ust"
    const bos = (k) => !yerlesen.some(
      (q) => k.x1 < q.x2 && k.x2 > q.x1 && k.y1 < q.y2 && k.y2 > q.y1);

    const dene = ({ n, kad }, zorla) => {
      const p = POS[n.id];
      const cx = view.x + p.x * view.k;
      const cy = view.y + p.y * view.k;
      // görüş alanı dışındakiler yer kaplamasın
      // düğümün kendisi görüş alanında değilse etiket yazılmaz;
      // aksi halde kenarda isim yığılması oluşuyor
      if (cx < SOL_BANT + 4 || cx > box.w - 4 || cy < UST_BANT + 4 || cy > box.h - 4) return;
      if (!zorla && view.k < ESIK[kad]) return;

      const punto = Math.max(EKRAN_PUNTO[kad], rOf(n.id) * 0.42 * view.k);
      const ad = Math.min(n.tr.length, 26);
      const g = Math.max(ad * punto * 0.5, 48);          // etiket genişliği
      const y = punto * 2.1 + 4;                          // iki satır
      const r = rOf(n.id) * view.k;
      const kutuAlt = { x1: cx - g / 2, x2: cx + g / 2, y1: cy + r + 2, y2: cy + r + 2 + y };
      const kutuUst = { x1: cx - g / 2, x2: cx + g / 2, y1: cy - r - 2 - y, y2: cy - r - 2 };

      // görüş alanının sağından veya solundan taşarsa yatayda kaydırılır
      // Etiket görüş alanına sığmıyorsa hiç yazılmaz. İçeri çekmek
      // kenarlarda isim yığılmasına yol açıyordu.
      if (cx - g / 2 < SOL_BANT + 4 || cx + g / 2 > box.w - 4) return;
      const kay = 0;

      let kutu = null, yon = null;
      if (zorla || bos(kutuAlt)) { kutu = kutuAlt; yon = "alt"; }
      else if (bos(kutuUst)) { kutu = kutuUst; yon = "ust"; }
      if (!kutu) return;

      yerlesen.push(kutu);
      secilenler.set(n.id, { yon, kay });
    };

    // odaktaki râvi ve komşuları her halûkârda yazılır
    if (secim && vurgu) {
      sirali.filter((x) => vurgu.has(x.n.id)).forEach((x) => dene(x, true));
    }
    sirali.forEach((x) => { if (!secilenler.has(x.n.id)) dene(x, false); });
    return secilenler;
  }, [view, box, secim, vurgu]);

  const secRavi = secim && secim.tur === "ravi" ? NODES.find((n) => n.id === secim.id) : null;
  const secKenar = secim && secim.tur === "kenar" ? secim.e : null;
  const hocalar = secRavi
    ? EDGES.filter((e) => e.b === secRavi.id).map((e) => ({ ...e, n: NODES.find((x) => x.id === e.a) }))
    : [];
  const talebeler = secRavi
    ? EDGES.filter((e) => e.a === secRavi.id).map((e) => ({ ...e, n: NODES.find((x) => x.id === e.b) }))
    : [];

  return (
    <div className="w-full h-full bg-[#FBF9F4] text-[#23201B] flex flex-col overflow-hidden"
         style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <header className="px-5 pt-4 pb-3 border-b border-[#D8D0BF] shrink-0">
        <div className="text-[10.5px] tracking-[0.22em] uppercase text-[#8A7A34] mb-0.5">
          Mizzî, Tehzîbü'l-Kemâl · Ali b. el-Medînî, el-İlel
        </div>
        <h1 className="text-2xl leading-tight">Silsile Ağı</h1>
      </header>

      <div ref={boxRef} className="relative flex-1 bg-white overflow-hidden select-none"
        style={{ cursor: suruk ? "grabbing" : "grab" }}
        onWheel={tekerlek}
        onMouseDown={(e) => { setSuruk({ mx: e.clientX, my: e.clientY, vx: view.x, vy: view.y }); setTasindi(false); }}
        onMouseMove={(e) => {
          if (!suruk) return;
          const dx = e.clientX - suruk.mx, dy = e.clientY - suruk.my;
          if (Math.abs(dx) + Math.abs(dy) > 4) setTasindi(true);
          gitView({ ...view, x: suruk.vx + dx, y: suruk.vy + dy });
        }}
        onMouseUp={() => { if (!tasindi) { setSecim(null); setAcikArama(false); } setSuruk(null); }}
        onMouseLeave={() => setSuruk(null)}>

        {/* ---- ana tuval ---- */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <style>{`
            @keyframes akis   { to { stroke-dashoffset: -46; } }
            @keyframes belir  { from { opacity: 0; transform: scale(0.4); }
                                to   { opacity: 1; transform: scale(1); } }
            @keyframes salin1 { 0%   { transform: translate(0,0); }
                                25%  { transform: translate(19px,-13px); }
                                50%  { transform: translate(9px,17px); }
                                75%  { transform: translate(-17px,8px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin2 { 0%   { transform: translate(0,0); }
                                25%  { transform: translate(-15px,-16px); }
                                50%  { transform: translate(14px,-6px); }
                                75%  { transform: translate(6px,18px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin3 { 0%   { transform: translate(0,0); }
                                20%  { transform: translate(13px,14px); }
                                45%  { transform: translate(-11px,17px); }
                                70%  { transform: translate(-18px,-9px); }
                                100% { transform: translate(0,0); } }
            @keyframes salin4 { 0%   { transform: translate(0,0); }
                                30%  { transform: translate(-20px,6px); }
                                55%  { transform: translate(-4px,-17px); }
                                80%  { transform: translate(16px,11px); }
                                100% { transform: translate(0,0); } }
            @keyframes hale   { 0%,100% { opacity: .30; transform: scale(1); }
                                50%     { opacity: .06; transform: scale(1.55); } }
            .kenar   { transition: stroke .35s ease, stroke-width .35s ease, opacity .35s ease; }
            .kenar-v { stroke-dasharray: 14 8; animation: akis 1.1s linear infinite; }
            .dugum   { transition: opacity .35s ease; }
            .dugum circle.ana { transition: r .28s cubic-bezier(.34,1.4,.5,1), stroke-width .2s ease; }
            .dugum:hover circle.ana { stroke: #23201B; stroke-width: 3; }
            .etiket  { transition: opacity .3s ease; }
            .acilis  { animation: belir .85s cubic-bezier(.22,1,.36,1) backwards; transform-box: fill-box; transform-origin: center; }
            .salinim { animation-duration: var(--sure); animation-timing-function: linear;
                       animation-iteration-count: infinite; animation-delay: var(--gec);
                       will-change: transform; }
            .sal1 { animation-name: salin1; }
            .sal2 { animation-name: salin2; }
            .sal3 { animation-name: salin3; }
            .sal4 { animation-name: salin4; }
            .hale    { animation: hale 3.4s ease-in-out infinite;
                       transform-box: fill-box; transform-origin: center; }
          `}</style>
          <defs>
            <marker id="ok" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8A7A34" />
            </marker>
            <marker id="okSonuk" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#C9BFA8" />
            </marker>
            <marker id="okVurgu" viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#B5462B" />
            </marker>
          </defs>

          <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
            <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#FFFFFF" />
            {SUTUNLAR.map((c, i) => {
              const ilk = i === 0, son = i === SUTUNLAR.length - 1;
              // taşma payında beyaz alan görünmesin diye uç sütunlar yanlara uzatılır
              const zx = ilk ? -W : c.x;
              const zw = (son ? W * 2 : c.x + c.genislik) - zx;
              return (
                <g key={c.belde}>
                  <rect x={zx} y={-H} width={zw} height={H * 3}
                    fill={c.belde === "Medine" ? "#8A7A34" : i % 2 ? "#1F4E5F" : "#2E7D6E"}
                    opacity={c.belde === "Medine" ? 0.05 : 0.026} />
                  {!ilk && (
                    <line x1={c.x} y1={-H} x2={c.x} y2={H * 2}
                      stroke="#D8D0BF" strokeWidth="1.2" opacity="0.7" />
                  )}
                </g>
              );
            })}
            {YILLAR.map((y) => (
              <line key={y} x1="0" y1={yOf(y)} x2={W} y2={yOf(y)}
                stroke="#D8D0BF" strokeWidth="1" opacity={y % 50 === 0 ? 0.85 : 0.28} />
            ))}

            {/* kenarlar */}
            {EDGES.map((e, i) => {
              const pa = POS[e.a], pb = POS[e.b];
              if (!pa || !pb) return null;
              const dim = kenarSonuk(e);
              const secili = secKenar && secKenar.a === e.a && secKenar.b === e.b;
              // odaktaki râvinin kendi bağlarında rivayet yönü akış olarak görünür
              const canli = !secili && ((secim && secim.tur === "ravi" &&
                (e.a === secim.id || e.b === secim.id)) ||
                uzerinde === e.a || uzerinde === e.b);
              const dy = pb.y - pa.y;
              const [kavis, kf] = KAVIS[e.a + "|" + e.b] || [0, 0.3];
              const k1x = pa.x + kavis, k1y = pa.y + dy * kf;
              const k2x = pb.x + kavis, k2y = pb.y - dy * kf;
              const vx = pb.x - k2x, vy = pb.y - k2y;
              const vu = Math.hypot(vx, vy) || 1;
              const bosluk = rOf(e.b) + 10;
              const sonX = pb.x - (vx / vu) * bosluk;
              const sonY = pb.y - (vy / vu) * bosluk;
              const d = `M ${pa.x} ${pa.y} C ${k1x} ${k1y}, ${k2x} ${k2y}, ${sonX} ${sonY}`;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke="transparent" strokeWidth="16"
                    style={{ cursor: "pointer", pointerEvents: "stroke" }}
                    onMouseUp={(ev) => {
                      ev.stopPropagation(); setSuruk(null);
                      if (!tasindi) setSecim({ tur: "kenar", e });
                    }} />
                  <path d={d} fill="none"
                    className={"kenar" + (canli ? " kenar-v" : "")}
                    stroke={secili ? "#B5462B" : canli ? "#8A7A34" : dim ? "#C4B99E" : "#8F8256"}
                    strokeWidth={secili ? 2.8 : canli ? 2.2 : dim ? 0.8 : 1.7}
                    opacity={secili ? 1 : canli ? 0.95 : dim ? 0.45 : 0.78}
                    markerEnd={secili || canli ? "url(#okVurgu)" : dim ? "url(#okSonuk)" : "url(#ok)"}
                    style={{ pointerEvents: "none" }} />
                </g>
              );
            })}

            {/* düğümler */}
            {NODES.map((n) => {
              const p = POS[n.id];
              if (!p) return null;
              const d = sonuk(n.id);
              const dg = DERECE[n.id] || 0;
              const r = rOf(n.id);
              const kad = KADEME(n.id);
              const etiketBilgi = etiketliler.get(n.id);
              const etiket = !!etiketBilgi;
              const etiketYonu = etiketBilgi && etiketBilgi.yon;
              const etiketKay = etiketBilgi ? etiketBilgi.kay / view.k : 0;
              // punto ekranda sabit kalsın diye ölçeğe bölünür
              // Ekranda sabit punto uzakta doğru, ama çok yaklaşınca nokta
              // devleşip yazı minik kalıyordu. Bu yüzden yazı en az noktanın
              // yarıçapıyla orantılı bir alt sınırı korur.
              const punto = Math.max(EKRAN_PUNTO[kad] / view.k, r * 0.42);
              const altPunto = punto * 0.8;
              const secili = secRavi && secRavi.id === n.id;
              return (
                <g key={n.id} className="dugum" transform={`translate(${p.x},${p.y})`}
                  onMouseUp={(ev) => { ev.stopPropagation(); setSuruk(null); if (!tasindi) odaklan(n.id); }}
                  onMouseEnter={() => setUzerinde(n.id)}
                  onMouseLeave={() => setUzerinde((ö) => (ö === n.id ? null : ö))}
                  style={{ cursor: "pointer", opacity: d ? 0.38 : 1 }}>
                  <g className={`salinim sal${(salSayi(n.id) % 4) + 1}`}
                     style={{ "--sure": `${3.4 + (salSayi(n.id) % 26) / 10}s`,
                              "--gec": `${-(salSayi(n.id) % 60) / 10}s` }}>
                  {(MEDAR[n.id] || MUKSIRUN.has(n.id) || MUELLIF.has(n.id) || n.id === "nebi") && (
                    <circle className="hale" r={r + 14} fill="none"
                      stroke={n.id === "nebi" ? NEBI_RENK : renkOf(n.id)} strokeWidth="3"
                      style={{ animationDelay: `${(salSayi(n.id) % 30) / 10}s` }} />
                  )}
                  {MUKSIRUN.has(n.id) && (
                    <circle r={r + 8} fill="none" stroke={renkOf(n.id)}
                      strokeWidth="2.4" opacity="0.55" />
                  )}
                  {MEDAR[n.id] && (
                    <rect x={-(r + 10)} y={-(r + 10)} width={(r + 10) * 2} height={(r + 10) * 2}
                      fill="none" stroke={renkOf(n.id)} strokeWidth="2.4" opacity="0.6"
                      transform="rotate(45)" />
                  )}
                  <circle className={"ana" + (acildi ? "" : " acilis")}
                    r={uzerinde === n.id ? r * 1.14 : r}
                    style={acildi ? undefined : { animationDelay: `${Math.min(p.y / H, 1) * 1500}ms` }}
                    fill={n.id === "nebi" ? NEBI_RENK : renkOf(n.id)}
                    stroke={secili ? "#23201B" : "white"} strokeWidth={secili ? 3.4 : 2} />
                  </g>
                  {/* etiket salınım grubunun dışında: yazılar sabit durur */}
                  {etiket && (
                    <g className="etiket" style={{ paintOrder: "stroke", stroke: "#FFFFFF", strokeWidth: punto * 0.32 }}
                       transform={`translate(${etiketKay},${etiketYonu === "ust"
                         ? -(2 * r + punto + altPunto + 8) : 0})`}>
                      <text y={r + punto} textAnchor="middle" fontSize={punto}
                        fontWeight={kad <= 1 ? 600 : 400} fill="#2B2721">
                        {n.tr.length > 26 ? n.tr.slice(0, 25) + "…" : n.tr}
                      </text>
                      <text y={r + punto + altPunto + 3} textAnchor="middle"
                        fontSize={altPunto} fill="#8C8676">{tarihYaz(n)}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* ---- sabit yıl ekseni (sol) ---- */}
        <svg width={SOL_BANT} height="100%"
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <rect x="0" y="0" width={SOL_BANT} height="100%" fill="#FBF9F4" />
          <line x1={SOL_BANT - 0.5} y1="0" x2={SOL_BANT - 0.5} y2="100%"
            stroke="#D8D0BF" strokeWidth="1" />
          {YILLAR.map((y) => {
            const ky = view.y + yOf(y) * view.k;
            if (ky < UST_BANT + 6 || ky > box.h - 4) return null;
            return (
              <text key={y} x={SOL_BANT - 8} y={ky + 4} textAnchor="end"
                fontSize="11" fill={y % 50 === 0 ? "#5F594E" : "#9C9382"}>{y} h.</text>
            );
          })}
        </svg>

        {/* ---- sabit şehir bandı (üst) ---- */}
        <svg width="100%" height={UST_BANT}
          style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
          <rect x="0" y="0" width="100%" height={UST_BANT} fill="#FBF9F4" />
          <line x1="0" y1={UST_BANT - 0.5} x2="100%" y2={UST_BANT - 0.5}
            stroke="#D8D0BF" strokeWidth="1" />
          {SUTUNLAR.map((c) => {
            const kx = view.x + (c.x + c.genislik / 2) * view.k;
            const sol = view.x + c.x * view.k;
            const sag = view.x + (c.x + c.genislik) * view.k;
            if (sag < SOL_BANT + 10 || sol > box.w - 10) return null;
            // sutunun ekrandaki genisligine gore ismi kisalt
            const gorunurSol = Math.max(sol, SOL_BANT);
            const gorunurSag = Math.min(sag, box.w);
            const alan = Math.max(0, gorunurSag - gorunurSol) - 10;
            const tam = buyuk(c.belde);
            const harfW = 10.6;                       // 12.5px + 2.5px harf araligi
            const sigan = Math.floor(alan / harfW);
            if (sigan < 1) return null;
            const yazi = sigan >= tam.length ? tam : tam.slice(0, Math.max(1, sigan - 1)) + "\u2026";
            // varsayılan olarak sütunun gerçek merkezi; ancak sütun kısmen
            // görünüyorsa görünen kısmın ortasına kaydırılır
            const yariGen = (Math.min(alan, tam.length * harfW)) / 2;
            const gx = Math.min(Math.max(kx, gorunurSol + yariGen), gorunurSag - yariGen);
            return (
              <g key={c.belde}>
                <line x1={sol} y1={UST_BANT - 8} x2={sol} y2={UST_BANT}
                  stroke="#D8D0BF" strokeWidth="1" />
                <text x={gx + 1.25} y={25} textAnchor="middle" fontSize="12.5" letterSpacing="2.5"
                  fill={c.belde === "Medine" ? "#8A7A34" : "#7A7263"}>
                  {yazi}
                </text>
              </g>
            );
          })}
          <rect x="0" y="0" width={SOL_BANT} height={UST_BANT} fill="#FBF9F4" />
        </svg>

        {/* ---- sağ üst: râvi bul + yakınlaştırma ---- */}
        <div className="absolute z-20" style={{ bottom: 12, right: 12, width: 232 }}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}>
          {acikArama && arama.trim() && (
            <div className="shadow" style={{ marginBottom: 6, maxHeight: 260, overflowY: "auto", background: "#fff", border: "1px solid #D8D0BF", borderRadius: 2 }}>
              {sonuclar.length ? sonuclar.map((n) => (
                <button key={n.id}
                  onClick={() => { odaklan(n.id); setAcikArama(false); }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-[#F5F1E6] flex items-center gap-2 border-b border-[#F0EAD9] last:border-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: n.id === "nebi" ? NEBI_RENK : renkOf(n.id) }} />
                  <span className="flex-1 truncate">{n.tr}</span>
                  <span className="text-[11px] text-[#8C8676] shrink-0">{tarihYaz(n)}</span>
                </button>
              )) : <div className="px-3 py-2 text-sm text-[#8C8676]">Bu isimde râvi yok.</div>}
            </div>
          )}

          <input value={arama}
            onChange={(e) => { setArama(e.target.value); setAcikArama(true); }}
            onFocus={() => setAcikArama(true)}
            placeholder="Râvi bul"
            className="w-full px-3 py-1.5 text-sm bg-white border border-[#D8D0BF] rounded-sm shadow-sm outline-none focus:border-[#8A7A34]" />

          <div className="flex gap-1.5 justify-end" style={{ marginTop: 6 }}>
            <div className="flex border border-[#D8D0BF] bg-white rounded-sm overflow-hidden shadow-sm">
              <button onClick={() => zoomla(1 / 1.3)} className="px-2.5 py-1 text-sm hover:bg-[#F1EDE2]">−</button>
              <span className="px-2 py-1 text-[11px] text-[#8C8676] border-x border-[#E6DFCF] self-center">
                {Math.round(view.k * 100)}%
              </span>
              <button onClick={() => zoomla(1.3)} className="px-2.5 py-1 text-sm hover:bg-[#F1EDE2]">+</button>
            </div>
            <button onClick={sigdir}
              className="px-2.5 py-1 text-sm border border-[#D8D0BF] bg-white rounded-sm shadow-sm hover:bg-[#F1EDE2]">
              Tamamı
            </button>
          </div>
        </div>

        {/* ---- sabit bilgi paneli ---- */}
        {secRavi && (
          <div className="absolute z-20 shadow-lg"
            style={{
              left: 12, bottom: 12, width: "min(620px, calc(100% - 280px))",
              height: 188, overflowY: "auto", overflowX: "hidden",
              background: "rgba(255,255,255,0.97)", border: "1px solid #D8D0BF",
              borderRadius: 2, padding: 16,
            }}
            onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}>
            <button onClick={() => setSecim(null)}
              className="absolute top-2 right-3 text-[#8C8676] hover:text-[#23201B]">×</button>
            <div className="flex items-baseline gap-3 flex-wrap pr-6">
              <h2 className="text-xl">{secRavi.tr}</h2>
              <span className="text-lg text-[#5F594E]" dir="rtl">{secRavi.ar}</span>
              <span className="text-xs text-[#8A7A34]">
                {tarihYaz(secRavi)} · {secRavi.belde} · {TAB[secRavi.tab].ad}{MUKSIRUN.has(secRavi.id) ? " · müksirûndan" : ""}{MEDAR[secRavi.id] ? " · " + MEDAR_AD[MEDAR[secRavi.id]] : ""}{MUELLIF.has(secRavi.id) ? " · Kütüb-i Sitte müellifi" : ""}
              </span>
            </div>
            {secRavi.not && <p className="text-sm text-[#5F594E] mt-2 leading-relaxed">{secRavi.not}</p>}
            <div className="grid md:grid-cols-2 gap-5 mt-3 text-sm">
              {[["Hocaları", hocalar], ["Talebeleri", talebeler]].map(([baslik, liste]) => (
                <div key={baslik}>
                  <div className="text-[11px] uppercase tracking-wider text-[#8A7A34] mb-1.5">
                    {baslik} ({liste.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {liste.length ? liste.map((h) => (
                      <button key={h.n.id} onClick={() => odaklan(h.n.id)} title={h.k}
                        className="px-2 py-0.5 border border-[#D8D0BF] rounded-sm hover:border-[#8A7A34]">
                        {h.n.tr} <span className="text-[#A2966F] text-xs" dir="rtl">{h.r}</span>
                      </button>
                    )) : <span className="text-[#8C8676]">kayıt yok</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {secKenar && (() => {
          const hoca = NODES.find((n) => n.id === secKenar.a);
          const talebe = NODES.find((n) => n.id === secKenar.b);
          return (
            <div className="absolute z-20 shadow-lg"
              style={{
                left: 12, bottom: 12, width: "min(520px, calc(100% - 280px))",
                maxHeight: 188, overflowY: "auto",
                background: "rgba(255,255,255,0.97)", border: "1px solid #D8D0BF",
                borderRadius: 2, padding: 16,
              }}
              onMouseDown={(e) => e.stopPropagation()} onMouseUp={(e) => e.stopPropagation()}>
              <button onClick={() => setSecim(null)}
                className="absolute top-2 right-3 text-[#8C8676] hover:text-[#23201B]">×</button>
              <div className="text-[11px] uppercase tracking-wider text-[#B5462B] mb-2">Rivayet bağı</div>
              <div className="flex items-center gap-3 flex-wrap pr-6">
                <button onClick={() => odaklan(hoca.id)} className="text-left hover:underline">
                  <div className="text-base">{hoca.tr}</div>
                  <div className="text-xs text-[#8C8676]">{tarihYaz(hoca)} · {hoca.belde}</div>
                </button>
                <span className="text-[#B5462B] text-lg">→</span>
                <button onClick={() => odaklan(talebe.id)} className="text-left hover:underline">
                  <div className="text-base">{talebe.tr}</div>
                  <div className="text-xs text-[#8C8676]">{tarihYaz(talebe)} · {talebe.belde}</div>
                </button>
              </div>
              <p className="text-xs text-[#5F594E] mt-3">
                Kaynak {secKenar.k}. Tahrîc rumuzu <span dir="rtl" className="text-sm">{secKenar.r}</span>.
              </p>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
