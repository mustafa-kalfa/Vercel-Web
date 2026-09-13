/* KUFE TRANSI -- DENEME VERISI, yalnizca /ag-sinamasi kullaniyor.

   Ana harita `silsileVeri.js`ten besleniyor ve bu dosya ona HIC
   dokunmuyor: mevcut dugum ve kenarlari ice aktarip ustune ekliyor.

   TURETILEN DEGERLER FABRIKADAN. `POS`, `DERECE`, `rOf` ve
   `rEkranOf` ana modulde kendi `NODES`/`EDGES`inden hesaplaniyor;
   burada AYNI fabrikalar bu dosyanin listesiyle cagriliyor. Cagirilmasa
   yeni noktalarin yerlesimi hic hesaplanmaz ve sessizce cizilmezlerdi
   -- Yemen sutunu eklenirken bir kez bu olmustu.

   NEREDEN GELDI. Iskelet Takrib'den (`takrib-iskelet.py`), ceviri-yazi
   haritanin kendi dugumlerinden cikarilan sozlukten
   (`ceviri-sozluk.mjs`), mukerrerler `mukerrer-ayikla.mjs` ile
   ayiklandi, kenarlar Tehzibu't-Tehzib taramasindan
   (`kenar-tara.py`). Sayilar ve tuzaklar DEVIR-NOTU.md'de.

   134 dugum, 720 kenar. */
/* Uzanti ACIKCA yaziliyor (`./silsileVeri.js`). Turbopack uzantisiz
   halini de cozuyor ama duz Node cozmuyor, ve bu dosya bir VERI modulu
   -- `dugumleri-cikar.cjs` gibi araclar onu dogrudan yukluyor. */
import {
  NODES as ANA_NODES, EDGES as ANA_EDGES, N, E,
  dereceKur, rOfKur, rEkranOfKur, yerlesimKur, nebiKenarlariEkle,
} from "./silsileVeri.js";

export * from "./silsileVeri.js";

const KUFE_NODES = [
  N("ahmedbabdullahbmuhamme", "أحمد بن عبد الله بن محمد", "Ahmed b. Abdullah b. Muhammed", 5, 258, "Kûfe"),
  N("ahmedbabdullahbyunus", "أحمد بن عبد الله بن يونس", "Ahmed b. Abdullah b. Yûnus", 5, 227, "Kûfe"),
  N("ahmedbelmufaddal", "أحمد بن المفضل الحفري", "Ahmed b. el-Mufaddal", 5, 215, "Kûfe"),
  N("ahmedbyahyabzekeriyyae", "أحمد بن يحيى بن زكريا الأودي أبو جعفر الكوفي", "Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer", 5, 264, "Kûfe"),
  N("ibrahimbismailbyahyaeb", "إبراهيم بن إسماعيل بن يحيى أبو إسحاق الكوفي", "İbrâhim b. İsmâîl b. Yahyâ Ebû İshak", 5, 258, "Kûfe"),
  N("ibrahimbhumeydbabdirra", "إبراهيم بن حميد بن عبد الرحمن الرؤاسي", "İbrâhim b. Humeyd b. Abdirrahman", 5, 178, "Kûfe"),
  N("ibrahimbebibekirabdull", "إبراهيم بن أبي بكر عبد الله بن محمد بن أبي شيبة العبسي أبو شيبة الكوفي", "İbrâhim b. Ebî Bekir Abdullah b. Muhammed b. Ebî Şeybe Ebû Şeybe", 5, 265, "Kûfe"),
  N("ibrahimbosman", "إبراهيم بن عثمان العبسي", "İbrâhim b. Osmân", 5, 169, "Kûfe"),
  N("ismailbeban", "إسماعيل بن أبان الغنوي", "İsmâîl b. Ebân", 5, 210, "Kûfe"),
  N("ismailbhalife", "إسماعيل بن خليفة العبسي", "İsmâîl b. Halîfe", 5, 169, "Kûfe"),
  N("ismailbabdirrahman", "إسماعيل بن عبد الرحمن", "İsmâîl b. Abdirrahman", 4, 127, "Kûfe"),
  N("ismailbmusaelfezariebu", "إسماعيل بن موسى الفزاري أبو محمد", "İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed", 5, 245, "Kûfe"),
  N("temimbselemeessulemi", "تميم بن سلمة السلمي الكوفي", "Temîm b. Seleme es-Sülemî", 3, 100, "Kûfe"),
  N("sabitbmusababdirrahman", "ثابت بن موسى بن عبد الرحمن أبو يزيد الكوفي الضرير", "Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr", 5, 229, "Kûfe"),
  N("cabirbnuh", "جابر بن نوح الحماني", "Câbir b. Nûh", 5, 203, "Kûfe"),
  N("caferbhumeydebumuhamme", "جعفر بن حميد العبسي الكوفي أبو محمد", "Ca‘fer b. Humeyd Ebû Muhammed", 5, 240, "Kûfe"),
  N("caferbziyadelahmer", "جعفر بن زياد الأحمر الكوفي", "Ca‘fer b. Ziyâd el-Ahmer", 5, 167, "Kûfe"),
  N("caferbmuhammed", "جعفر بن محمد", "Ca‘fer b. Muhammed", 5, 260, "Kûfe"),
  N("habibbebiamre", "حبيب بن أبي عمرة", "Habîb b. Ebî Amre", 5, 142, "Kûfe"),
  N("hasanbbisr", "الحسن بن بشر", "Hasan b. Bişr", 5, 221, "Kûfe"),
  N("hasanbhammadeddabbiebu", "الحسن بن حماد الضبي أبو علي الوراق الصيرفي الكوفي", "Hasan b. Hammâd ed-Dabbî Ebû Ali el-Verrâk es-Sayrafî", 5, 238, "Kûfe"),
  N("hasanbumareelbeceli", "الحسن بن عمارة البجلي", "Hasan b. Umâre el-Becelî", 5, 153, "Kûfe"),
  N("hasanbayyas", "الحسن بن عياش", "Hasan b. Ayyâş", 5, 172, "Kûfe"),
  N("huseyinbyezidbyahya", "الحسين بن يزيد بن يحيى", "Hüseyin b. Yezîd b. Yahyâ", 5, 244, "Kûfe"),
  N("hammadbusame", "حماد بن أسامة القرشي", "Hammâd b. Üsâme", 5, 201, "Kûfe"),
  N("halidbselemebelas", "خالد بن سلمة بن العاص", "Hâlid b. Seleme b. el-Âs", 5, 132, "Kûfe"),
  N("halidbukbeessekuniebuu", "خالد بن عقبة السكوني أبو عتبة الكوفي", "Hâlid b. Ukbe es-Sekûnî Ebû Utbe", 5, 247, "Kûfe"),
  N("halefbtemim", "خلف بن تميم", "Halef b. Temîm", 5, 206, "Kûfe"),
  N("halefbhalifebsaidelesc", "خلف بن خليفة بن صاعد الأشجعي", "Halef b. Halîfe b. Sâid el-Eşce‘î", 5, 181, "Kûfe"),
  N("halladbyezidelcufi", "خلاد بن يزيد الجعفي الكوفي", "Hallâd b. Yezîd el-Cu‘fî", 5, 220, "Kûfe"),
  N("davudbyezidbabdirrahma", "داود بن يزيد بن عبد الرحمن الأودي الزعافري", "Dâvûd b. Yezîd b. Abdirrahman el-Evdî", 5, 151, "Kûfe"),
  N("ezzubeyrbadielhemdanie", "الزبير بن عدي الهمداني اليامي", "ez-Zübeyr b. Adî el-Hemdânî el-Yâmî", 5, 131, "Kûfe"),
  N("zekeriyyabyahyabomer", "زكريا بن يحيى بن عمر", "Zekeriyyâ b. Yahyâ b. Ömer", 5, 201, "Kûfe"),
  N("saidbcubeyrelesedi", "سعيد بن جبير الأسدي", "Saîd b. Cübeyr el-Esedî", 3, 95, "Kûfe"),
  N("saidbabdirrahmanbabdul", "سعيد بن عبد الرحمن بن عبد الله الزبيدي", "Saîd b. Abdirrahman b. Abdullah ez-Zübeydî", 5, 156, "Kûfe"),
  N("saidbamrbsehlelkindieb", "سعيد بن عمرو بن سهل الكندي الأشعثي أبو عثمان الكوفي", "Saîd b. Amr b. Sehl el-Kindî Ebû Osmân", 5, 230, "Kûfe"),
  N("suleymanbabdirrahmanbh", "سليمان بن عبد الرحمن بن حماد أبو داود التمار الكوفي", "Süleymân b. Abdirrahman b. Hammâd Ebû Dâvûd et-Temmâr", 5, 252, "Kûfe"),
  N("sellambsuleym", "سلام بن سليم الحنفي", "Sellâm b. Süleym", 5, 179, "Kûfe"),
  N("sellambsuleymanelmuzen", "سلام بن سليمان المزني أبو المنذر", "Sellâm b. Süleymân el-Müzenî Ebû Münzir", 5, 171, "Kûfe"),
  N("sihabbabbadelabdiebuom", "شهاب بن عباد العبدي أبو عمر الكوفي", "Şihâb b. Abbâd el-Abdî Ebû Ömer", 5, 224, "Kûfe"),
  N("seybanbabdirrahmanette", "شيبان بن عبد الرحمن التميمي", "Şeybân b. Abdirrahman et-Temîmî", 5, 164, "Kûfe"),
  N("talhabyahyabtalha", "طلحة بن يحيى بن طلحة", "Talha b. Yahyâ b. Talha", 5, 148, "Kûfe"),
  N("asimbyusufebuamr", "عاصم بن يوسف اليربوعي أبو عمرو", "Âsım b. Yûsuf Ebû Amr", 5, 220, "Kûfe"),
  N("abdullahbahmedbabdulla", "عبد الله بن أحمد بن عبد الله أبو حصين", "Abdullah b. Ahmed b. Abdullah Ebû Husayn", 5, 248, "Kûfe"),
  N("abdullahbsalim", "عبد الله بن سالم", "Abdullah b. Sâlim", 5, 235, "Kûfe"),
  N("abdullahbamirbzurareel", "عبد الله بن عامر بن زرارة الحضرمي", "Abdullah b. Âmir b. Zürâre el-Hadramî", 5, 237, "Kûfe"),
  N("abdullahbomerbmuhammed", "عبد الله بن عمر بن محمد", "Abdullah b. Ömer b. Muhammed", 5, 239, "Kûfe"),
  N("abdullahbisababdirrahm", "عبد الله بن عيسى بن عبد الرحمن أبي ليلى الأنصاري أبو محمد الكوفي", "Abdullah b. Îsâ b. Abdirrahman Ebî Leylâ el-Ensârî Ebû Muhammed", 5, 130, "Kûfe"),
  N("abdullahbmakil", "عبد الله بن معقل", "Abdullah b. Ma‘kıl", 3, 88, "Kûfe"),
  N("abdulalabvasilbabdulal", "عبد الأعلى بن واصل بن عبد الأعلى الأسدي الكوفي", "Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî", 5, 247, "Kûfe"),
  N("abdulhamidbsalihbaclan", "عبد الحميد بن صالح بن عجلان البرجمي", "Abdülhamîd b. Sâlih b. Aclân", 5, 230, "Kûfe"),
  N("abdulhamidbabdirrahman", "عبد الحميد بن عبد الرحمن الحماني", "Abdülhamîd b. Abdirrahman", 5, 202, "Kûfe"),
  N("abdirrahman", "عبد الرحمن", "Abdirrahman", 5, 120, "Kûfe"),
  N("abdirrahmanbserikbabdu", "عبد الرحمن بن شريك بن عبد الله النخعي الكوفي", "Abdirrahman b. Şerîk b. Abdullah en-Nehaî", 5, 227, "Kûfe"),
  N("abdirrahmanbabis", "عبد الرحمن بن عابس", "Abdirrahman b. Âbis", 4, 119, "Kûfe"),
  N("abdirrahmanbabdullahbm", "عبد الرحمن بن عبد الله بن مسعود الهذلي الكوفي", "Abdirrahman b. Abdullah b. Mes‘ûd", 2, 79, "Kûfe"),
  N("abdirrahmanbabdulmelik", "عبد الرحمن بن عبد الملك بن سعيد", "Abdirrahman b. Abdülmelik b. Saîd", 5, 181, "Kûfe"),
  N("abdirrahmanbmuhammedbz", "عبد الرحمن بن محمد بن زياد المحاربي أبو محمد الكوفي", "Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed", 5, 195, "Kûfe"),
  N("osmanbhakim", "عثمان بن حكيم", "Osmân b. Hakîm", 5, 219, "Kûfe"),
  N("atabsaibebumuhammed", "عطاء بن السائب أبو محمد", "Atâ b. Sâib Ebû Muhammed", 5, 136, "Kûfe"),
  N("atabmuslimelhaffafebum", "عطاء بن مسلم الخفاف أبو مخلد الكوفي", "Atâ b. Müslim el-Haffâf Ebû Mahled", 5, 190, "Kûfe"),
  N("atiyyebsad", "عطية بن سعد", "Atiyye b. Sa‘d", 3, 111, "Kûfe"),
  N("alkamebamrbelhusaynebu", "علقمة بن عمرو بن الحصين العطاردي أبو الفضل الكوفي", "Alkame b. Amr b. el-Husayn Ebû Fazl", 5, 256, "Kûfe"),
  N("alibsabit", "علي بن ثابت", "Ali b. Sâbit", 5, 219, "Kûfe"),
  N("alibhakim", "علي بن حكيم", "Ali b. Hakîm", 5, 231, "Kûfe"),
  N("alibsaidbmesrukelkindi", "علي بن سعيد بن مسروق الكندي الكوفي", "Ali b. Saîd b. Mesrûk el-Kindî", 5, 249, "Kûfe"),
  N("alibzabyan", "علي بن ظبيان", "Ali b. Zabyân", 5, 192, "Kûfe"),
  N("ammarbmuhammedessevri", "عمار بن محمد الثوري", "Ammâr b. Muhammed es-Sevrî", 5, 182, "Kûfe"),
  N("ammarbmuaviye", "عمار بن معاوية الدهني", "Ammâr b. Muâviye", 5, 133, "Kûfe"),
  N("omerbhafsbgiyas", "عمر بن حفص بن غياث", "Ömer b. Hafs b. Giyâs", 5, 222, "Kûfe"),
  N("amrbsabit", "عمرو بن ثابت", "Amr b. Sâbit", 5, 172, "Kûfe"),
  N("amrbhammadbtalha", "عمرو بن حماد بن طلحة", "Amr b. Hammâd b. Talha", 5, 222, "Kûfe"),
  N("amrbrabibtarik", "عمرو بن الربيع بن طارق الكوفي", "Amr b. Rabî‘ b. Târık", 5, 219, "Kûfe"),
  N("amrbmuhammed", "عمرو بن محمد العنقزي", "Amr b. Muhammed", 5, 199, "Kûfe"),
  N("avnbsellam", "عون بن سلام", "Avn b. Sellâm", 5, 230, "Kûfe"),
  N("isabomerelesedielhemda", "عيسى بن عمر الأسدي الهمداني", "Îsâ b. Ömer el-Esedî el-Hemdânî", 5, 156, "Kûfe"),
  N("fadalebfazlbfadaleette", "فضالة بن الفضل بن فضالة التميمي أبو الفضل الكوفي", "Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl", 5, 250, "Kûfe"),
  N("kasimbhakembkesir", "القاسم بن الحكم بن كثير العرني", "Kâsım b. Hakem b. Kesîr", 5, 208, "Kûfe"),
  N("kasimbman", "القاسم بن معن", "Kâsım b. Ma‘n", 5, 175, "Kûfe"),
  N("muhammedbibrahimbosman", "محمد بن إبراهيم بن عثمان العبسي", "Muhammed b. İbrâhim b. Osmân", 5, 182, "Kûfe"),
  N("muhammedbishakbavnelam", "محمد بن إسحاق بن عون العامري أبو بكر الكوفي", "Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir", 5, 264, "Kûfe"),
  N("muhammedbcabirbbuceyre", "محمد بن جابر بن بجير أبو بجير", "Muhammed b. Câbir b. Büceyr Ebû Büceyr", 5, 256, "Kûfe"),
  N("muhammedbhasan", "محمد بن الحسن", "Muhammed b. Hasan", 5, 56, "Kûfe"),
  N("muhammedbhasanbezzubey", "محمد بن الحسن بن الزبير الأسدي الكوفي", "Muhammed b. Hasan b. ez-Zübeyr el-Esedî", 5, 200, "Kûfe"),
  N("muhammedbsaibbbisrebun", "محمد بن السائب بن بشر الكلبي أبو النضر الكوفي", "Muhammed b. Sâib b. Bişr Ebû Nadr", 5, 146, "Kûfe"),
  N("muhammedbabdullahbezzu", "محمد بن عبد الله بن الزبير أبو أحمد الزبيري الكوفي", "Muhammed b. Abdullah b. ez-Zübeyr Ebû Ahmed", 5, 203, "Kûfe"),
  N("muhammedbabdirrahmanbe", "محمد بن عبد الرحمن بن أبي ليلى الأنصاري الكوفي القاضي أبو عبد الرحمن", "Muhammed b. Abdirrahman b. Ebî Leylâ el-Ensârî el-Kādî Ebû Abdirrahman", 5, 148, "Kûfe"),
  N("muhammedbubeyd", "محمد بن عبيد", "Muhammed b. Ubeyd", 5, 204, "Kûfe"),
  N("muhammedbebiubeydebman", "محمد بن أبي عبيدة بن معن بن عبد الرحمن بن عبد الله بن مسعود المسعودي الكوفي", "Muhammed b. Ebî Ubeyde b. Ma‘n b. Abdirrahman b. Abdullah b. Mes‘ûd Abdillâh", 5, 205, "Kûfe"),
  N("muhammedbosman", "محمد بن عثمان", "Muhammed b. Osmân", 5, 256, "Kûfe"),
  N("muhammedbukbebkesir", "محمد بن عقبة بن كثير", "Muhammed b. Ukbe b. Kesîr", 5, 220, "Kûfe"),
  N("muhammedbomer", "محمد بن عمر", "Muhammed b. Ömer", 5, 255, "Kûfe"),
  N("muhammedbomerbelvelide", "محمد بن عمر بن الوليد الكندي أبو جعفر الكوفي", "Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer", 5, 256, "Kûfe"),
  N("muhammedbkasimelesedie", "محمد بن القاسم الأسدي أبو القاسم الكوفي", "Muhammed b. Kâsım el-Esedî Ebû Kâsım", 5, 207, "Kûfe"),
  N("muhammedbyezidelattar", "محمد بن يزيد الحنفي الكوفي العطار", "Muhammed b. Yezîd el-Attâr", 5, 276, "Kûfe"),
  N("malikbismail", "مالك بن إسماعيل النهدي", "Mâlik b. İsmâîl", 5, 217, "Kûfe"),
  N("mesudbmalik", "مسعود بن مالك", "Mes‘ûd b. Mâlik", 2, 85, "Kûfe"),
  N("muttalibbziyadbebizuhe", "المطلب بن زياد بن أبي زهير الثقفي", "Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî", 5, 185, "Kûfe"),
  N("muaviyebhisam", "معاوية بن هشام", "Muâviye b. Hişâm", 5, 204, "Kûfe"),
  N("mugirebmiksem", "المغيرة بن مقسم", "Mugīre b. Miksem", 5, 136, "Kûfe"),
  N("elmufaddalbyunuselcufi", "المفضل بن يونس الجعفي أبو يونس الكوفي", "el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus", 5, 178, "Kûfe"),
  N("musababdirrahmanbsaide", "موسى بن عبد الرحمن بن سعيد أبو عيسى الكوفي", "Mûsâ b. Abdirrahman b. Saîd Ebû Îsâ", 5, 258, "Kûfe"),
  N("musabisaelleysi", "موسى بن عيسى الليثي", "Mûsâ b. Îsâ el-Leysî", 5, 183, "Kûfe"),
  N("musabharun", "موسى بن هارون القيسي البردي", "Mûsâ b. Hârûn", 5, 224, "Kûfe"),
  N("nasrbabdirrahman", "نصر بن عبد الرحمن", "Nasr b. Abdirrahman", 5, 248, "Kûfe"),
  N("numanbsabit", "النعمان بن ثابت الكوفي", "Nu‘mân b. Sâbit", 5, 150, "Kûfe"),
  N("hemmambelharisbkays", "همام بن الحارث بن قيس", "Hemmâm b. el-Hâris b. Kays", 2, 65, "Kûfe"),
  N("heysembhalid", "الهيثم بن خالد", "Heysem b. Hâlid", 5, 239, "Kûfe"),
  N("vasilbabdulalabhilalel", "واصل بن عبد الأعلى بن هلال الأسدي أبو القاسم", "Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım", 5, 244, "Kûfe"),
  N("elvelidbkasimbelvelide", "الوليد بن القاسم بن الوليد الهمداني الكوفي", "el-Velîd b. Kâsım b. el-Velîd el-Hemdânî", 5, 183, "Kûfe"),
  N("yahyabbisrbkesir", "يحيى بن بشر بن كثير الحريري", "Yahyâ b. Bişr b. Kesîr", 5, 227, "Kûfe"),
  N("yahyabebibukeyrennehai", "يحيى بن أبي بكير النخعي الكوفي", "Yahyâ b. Ebî Bükeyr en-Nehaî", 5, 230, "Kûfe"),
  N("yahyabsaidbhayyan", "يحيى بن سعيد بن حيان", "Yahyâ b. Saîd b. Hayyân", 5, 145, "Kûfe"),
  N("yahyabisaettemimi", "يحيى بن عيسى التميمي النهشلي الفاخوري", "Yahyâ b. Îsâ et-Temîmî", 5, 201, "Kûfe"),
  N("yahyabmeymuneddabbiebu", "يحيى بن ميمون الضبي أبو المعلى العطار الكوفي", "Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr", 5, 132, "Kûfe"),
  N("yahyabyalabelhariselmu", "يحيى بن يعلى بن الحارث المحاربي الكوفي", "Yahyâ b. Ya‘lâ b. el-Hâris el-Muhâribî", 5, 216, "Kûfe"),
  N("yezidbebiziyad", "يزيد بن أبي زياد الهاشمي", "Yezîd b. Ebî Ziyâd", 5, 136, "Kûfe"),
  N("yezidbmihranelesediebu", "يزيد بن مهران الأسدي أبو خالد", "Yezîd b. Mihrân el-Esedî Ebû Hâlid", 5, 229, "Kûfe"),
  N("yalabelharisbharbelmuh", "يعلى بن الحارث بن حرب المحاربي الكوفي", "Ya‘lâ b. el-Hâris b. Harb el-Muhâribî", 5, 168, "Kûfe"),
  N("yusufbyakubessaffarebu", "يوسف بن يعقوب الصفار أبو يعقوب الكوفي مولى قريش", "Yûsuf b. Ya‘kûb es-Saffâr Ebû Ya‘kûb mevlâ Kureyş", 5, 231, "Kûfe"),
  N("ebubekir2", "أبو بكر النهشلي الكوفي", "Ebû Bekir", 5, 166, "Kûfe"),
  N("ismailb", "إسماعيل بن صبيح", "İsmâîl b. «صبيح»", 5, 217, "Kûfe"),
  N("bebielmuharibi", "أشعث بن أبي الشعثاء المحاربي الكوفي", "«أشعث» b. Ebî «الشعثاء» el-Muhâribî", 5, 125, "Kûfe"),
  N("huseyinbhasanelfezari", "الحسين بن الحسن الأشقر الفزاري الكوفي", "Hüseyin b. Hasan «الأشقر» el-Fezârî", 5, 208, "Kûfe"),
  N("hafsbsuleymanelesedieb", "حفص بن سليمان الأسدي أبو عمر البزاز الكوفي الغاضري", "Hafs b. Süleymân el-Esedî Ebû Ömer «البزاز»", 5, 180, "Kûfe"),
  N("saidbbvailelhadrami", "سعيد بن عبد الجبار بن وائل الحضرمي الكوفي", "Saîd b. «عبد الجبار» b. Vâil el-Hadramî", 5, 158, "Kûfe"),
  N("abdullahbebumuhammedel", "عبد الله بن الوضاح أبو محمد الكوفي اللؤلؤي", "Abdullah b. «الوضاح» Ebû Muhammed el-Lü'lüî", 5, 250, "Kûfe"),
  N("ubeyd", "عبيد الله", "Ubeyd «الله»", 5, 169, "Kûfe"),
  N("ubeydbubeydelesceiebua", "عبيد الله بن عبيد الرحمن الأشجعي أبو عبد الرحمن الكوفي", "Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman", 5, 182, "Kûfe"),
  N("ubeydebhumeydebuabdirr", "عبيدة بن حميد الكوفي أبو عبد الرحمن المعروف", "Ubeyde b. Humeyd Ebû Abdirrahman «المعروف»", 5, 190, "Kûfe"),
  N("gaylanbcamibelmuharibi", "غيلان بن جامع بن أشعث المحاربي أبو عبد الله الكوفي", "Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah", 5, 132, "Kûfe"),
  N("muhammedbbkayselkindie", "محمد بن الأشعث بن قيس الكندي أبو القاسم الكوفي", "Muhammed b. «الأشعث» b. Kays el-Kindî Ebû Kâsım", 2, 67, "Kûfe"),
  N("muhammedbbmalikennehai", "محمد بن الطفيل بن مالك النخعي أبو جعفر الكوفي", "Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer", 5, 222, "Kûfe"),
  N("musabtalhabubeydetteym", "موسى بن طلحة بن عبيد الله التيمي أبو عيسى", "Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ", 2, 103, "Kûfe"),
];

const KUFE_EDGES = [
  /* Ali b. Ebî Tâlib -- talebeleri */
  E("ali", "abdullahbisababdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ebî Tâlib tercemesi"),
  /* Mikdâd b. el-Esved -- talebeleri */
  E("mikdad", "hemmambelharisbkays", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mikdâd b. el-Esved tercemesi"),
  /* Esved b. Yezîd en-Nehaî -- talebeleri */
  E("esvedyezid", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esved b. Yezîd en-Nehaî tercemesi"),
  /* Hâris b. Süveyd et-Teymî -- talebeleri */
  E("harissuveyd", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâris b. Süveyd et-Teymî tercemesi"),
  /* Sâlim b. Ebü'l-Ca‘d -- talebeleri */
  E("salimcad", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Ebü'l-Ca‘d tercemesi"),
  /* Esved b. Hilâl el-Muhâribî -- talebeleri */
  E("esvedhilal", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esved b. Hilâl el-Muhâribî tercemesi"),
  /* Abdurrahman b. Ebî Leylâ -- talebeleri */
  E("ibnebileyla", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Ebî Leylâ tercemesi"),
  /* Urve b. ez-Zübeyr -- talebeleri */
  E("urve", "temimbselemeessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Urve b. ez-Zübeyr tercemesi"),
  /* İkrime mevlâ İbn Abbâs -- talebeleri */
  E("ikrime", "abdullahbisababdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  E("ikrime", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  /* Eş‘as b. Kays el-Kindî -- talebeleri */
  E("esaskays", "abdirrahmanbabdullahbm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eş‘as b. Kays el-Kindî tercemesi"),
  /* Cerîr b. Abdillâh el-Becelî -- talebeleri */
  E("cerirbecelî", "hemmambelharisbkays", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Abdillâh el-Becelî tercemesi"),
  /* Atâ b. Ebî Rebâh -- talebeleri */
  E("ataebirebah", "muhammedbabdirrahmanbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Rebâh tercemesi"),
  /* Ebû İshak es-Sebîî -- hocalari */
  E("musabtalhabubeydetteym", "ebuishaksebii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak es-Sebîî tercemesi"),
  /* Ebû İshak es-Sebîî -- talebeleri */
  E("ebuishaksebii", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak es-Sebîî tercemesi"),
  /* Mâlik b. Enes -- talebeleri */
  E("malik", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "ismailbmusaelfezariebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  /* Şu‘be b. el-Haccâc -- hocalari */
  E("bebielmuharibi", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("davudbyezidbabdirrahma", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("abdullahbisababdirrahm", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("gaylanbcamibelmuharibi", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("yezidbebiziyad", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  /* Süfyân es-Sevrî -- talebeleri */
  E("sevri", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  E("sevri", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  /* Yahyâ b. Âdem -- hocalari */
  E("hasanbayyas", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Âdem tercemesi"),
  /* Vekî‘ b. el-Cerrâh -- hocalari */
  E("talhabyahyabtalha", "veki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vekî‘ b. el-Cerrâh tercemesi"),
  /* Abdullah b. el-Mübârek -- talebeleri */
  E("ibnmubarek", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  /* Ubeydullah b. Abdillâh b. Utbe -- talebeleri */
  E("ubeydullahutbe", "talhabyahyabtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Abdillâh b. Utbe tercemesi"),
  /* İbrâhim en-Nehaî -- hocalari */
  E("hemmambelharisbkays", "nehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim en-Nehaî tercemesi"),
  /* Cerîr b. Abdilhamîd -- hocalari */
  E("yezidbebiziyad", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Abdilhamîd tercemesi"),
  /* Leys b. Sa‘d -- talebeleri */
  E("leysbsad", "amrbrabibtarik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  /* Abdullah b. İdrîs -- hocalari */
  E("yezidbebiziyad", "ibnidris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İdrîs tercemesi"),
  /* Ali b. Müshir -- talebeleri */
  E("alimushir", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Müshir tercemesi"),
  /* Saîd b. Cübeyr -- talebeleri */
  E("saidcubeyr", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr tercemesi"),
  /* Mesrûk b. el-Ecda‘ -- talebeleri */
  E("mesruk", "abdirrahmanbabdullahbm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mesrûk b. el-Ecda‘ tercemesi"),
  /* Züheyr b. Muâviye -- talebeleri */
  E("zuhayrmuaviye", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Muâviye tercemesi"),
  /* Zâide b. Kedâme -- talebeleri */
  E("zaidekudame", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zâide b. Kedâme tercemesi"),
  /* Ebû’l-Ahves Süllâm b. Süleym -- hocalari */
  E("bebielmuharibi", "ebulahvess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû’l-Ahves Süllâm b. Süleym tercemesi"),
  /* Ebû’l-Ahves Süllâm b. Süleym -- talebeleri */
  E("ebulahvess", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû’l-Ahves Süllâm b. Süleym tercemesi"),
  /* Şerîk b. Abdillâh en-Nehaî -- hocalari */
  E("ammarbmuaviye", "serikkadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şerîk b. Abdillâh en-Nehaî tercemesi"),
  /* Şerîk b. Abdillâh en-Nehaî -- talebeleri */
  E("serikkadi", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şerîk b. Abdillâh en-Nehaî tercemesi"),
  /* Ebû'z-Zübeyr el-Mekkî -- talebeleri */
  E("ebuzubeyrmekki", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'z-Zübeyr el-Mekkî tercemesi"),
  /* Muhammed b. el-Münkedir -- talebeleri */
  E("ibnmunkedir", "osmanbhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Münkedir tercemesi"),
  /* Kuteybe b. Saîd -- hocalari */
  E("halefbhalifebsaidelesc", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  /* Velîd b. Müslim -- talebeleri */
  E("velidmuslim", "suleymanbabdirrahmanbh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  E("velidmuslim", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  /* Ebû Nuaym el-Fazl b. Dükeyn -- talebeleri */
  E("ebunuaymfadl", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Nuaym el-Fazl b. Dükeyn tercemesi"),
  E("ebunuaymfadl", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Nuaym el-Fazl b. Dükeyn tercemesi"),
  /* Husayn b. Abdirrahman -- talebeleri */
  E("husaynabdrahman", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Husayn b. Abdirrahman tercemesi"),
  /* Ali b. el-Ca‘d -- talebeleri */
  E("alicad", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  /* Ísâ b. Yûnus -- hocalari */
  E("osmanbhakim", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ísâ b. Yûnus tercemesi"),
  /* Mansûr b. el-Mu‘temir -- hocalari */
  E("temimbselemeessulemi", "mansurmutemir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. el-Mu‘temir tercemesi"),
  /* Mansûr b. el-Mu‘temir -- talebeleri */
  E("mansurmutemir", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. el-Mu‘temir tercemesi"),
  /* Muhammed b. Sûka -- talebeleri */
  E("muhammedsuka", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sûka tercemesi"),
  E("muhammedsuka", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sûka tercemesi"),
  /* Mutarrif b. Tarîf -- talebeleri */
  E("mutarriftarif", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mutarrif b. Tarîf tercemesi"),
  /* Ebû İshak eş-Şeybânî -- hocalari */
  E("bebielmuharibi", "ismailebiislamsibani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak eş-Şeybânî tercemesi"),
  /* Hişâm b. Yûsuf es-San‘ânî -- talebeleri */
  E("hisamyusufsanani", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Yûsuf es-San‘ânî tercemesi"),
  /* Mervân b. Muâviye el-Fezârî -- talebeleri */
  E("mervanfezari", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mervân b. Muâviye el-Fezârî tercemesi"),
  /* Ubeydullah b. Mûsâ el-Absî -- hocalari */
  E("muhammedbabdirrahmanbe", "ubeydullahmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  /* Âsım b. Behdele -- talebeleri */
  E("asimbehdele", "hafsbsuleymanelesedieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Behdele tercemesi"),
  /* Abde b. Süleymân -- hocalari */
  E("talhabyahyabtalha", "abdesuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Süleymân tercemesi"),
  /* Simâk b. Harb -- hocalari */
  E("musabtalhabubeydetteym", "simakharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Simâk b. Harb tercemesi"),
  /* Abdülmelik b. Umeyr -- hocalari */
  E("musabtalhabubeydetteym", "abdulmelikumeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Umeyr tercemesi"),
  /* Abdülmelik b. Umeyr -- talebeleri */
  E("abdulmelikumeyr", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Umeyr tercemesi"),
  /* Amr b. Yahyâ el-Mâzinî -- hocalari */
  E("isabomerelesedielhemda", "amryahyamazini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Yahyâ el-Mâzinî tercemesi"),
  /* Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) -- talebeleri */
  E("caferebivahsiyye", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) tercemesi"),
  /* Firâs b. Yahyâ el-Hemdânî -- talebeleri */
  E("firasyahya", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Firâs b. Yahyâ el-Hemdânî tercemesi"),
  /* Mansûr b. Zâzân -- talebeleri */
  E("mansurzazan", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Zâzân tercemesi"),
  /* Şeybân b. Ferrûh -- talebeleri */
  E("seybanferruh", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Ferrûh tercemesi"),
  /* Halef b. Hişâm el-Bezzâr -- talebeleri */
  E("halefhisam", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Hişâm el-Bezzâr tercemesi"),
  /* Sâlih b. Sâlih b. Hayy -- talebeleri */
  E("salihhayy", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Sâlih b. Hayy tercemesi"),
  /* Siyâr Ebû'l-Hakem -- talebeleri */
  E("siyarebilhakem", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Siyâr Ebû'l-Hakem tercemesi"),
  /* Saîd b. Süleymân (Sa‘deveyh) -- hocalari */
  E("halefbhalifebsaidelesc", "saidsuleymansadeviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Süleymân (Sa‘deveyh) tercemesi"),
  /* Ebû Bekir b. Ebî Şeybe -- hocalari */
  E("halefbhalifebsaidelesc", "ibnebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ebî Şeybe tercemesi"),
  /* Züheyr b. Harb Ebû Hayseme -- talebeleri */
  E("zuheyrharb", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb Ebû Hayseme tercemesi"),
  /* Ali b. Hucr el-Mervezî -- hocalari */
  E("halefbhalifebsaidelesc", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hucr el-Mervezî tercemesi"),
  /* Amr b. Muhammed en-Nâkıd -- hocalari */
  E("ammarbmuhammedessevri", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed en-Nâkıd tercemesi"),
  /* Osmân b. Ebî Şeybe -- hocalari */
  E("ubeydbubeydelesceiebua", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ebî Şeybe tercemesi"),
  E("muttalibbziyadbebizuhe", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ebî Şeybe tercemesi"),
  /* Yûnus b. Bükeyr eş-Şeybânî -- hocalari */
  E("talhabyahyabtalha", "yunusbukeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Bükeyr eş-Şeybânî tercemesi"),
  /* Ali b. Sâlih b. Hayy -- hocalari */
  E("yezidbebiziyad", "aliebisalihhayy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  E("bebielmuharibi", "aliebisalihhayy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  /* Ali b. Sâlih b. Hayy -- talebeleri */
  E("aliebisalihhayy", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  /* Mahmûd b. Gaylân -- hocalari */
  E("muaviyebhisam", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Gaylân tercemesi"),
  /* Saîd b. Ebî Eyyûb el-Mısrî -- hocalari */
  E("elvelidbkasimbelvelide", "saidebiyyubmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ebî Eyyûb el-Mısrî tercemesi"),
  /* Abdülvâhid b. Ziyâd -- hocalari */
  E("habibbebiamre", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  E("talhabyahyabtalha", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  /* Mâlik b. Migvel -- talebeleri */
  E("malikmigvel", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Migvel tercemesi"),
  /* Ebû Küreyb Muhammed b. el-Alâ -- hocalari */
  E("muhammedbebiubeydebman", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  E("yahyabyalabelhariselmu", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  E("muaviyebhisam", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  /* Alkame b. Mersed el-Hadramî -- talebeleri */
  E("alkamemersed", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Mersed el-Hadramî tercemesi"),
  /* Ukbe b. Hâlid es-Sekûnî -- hocalari */
  E("muhammedbabdirrahmanbe", "ukbehalidsekuni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Hâlid es-Sekûnî tercemesi"),
  /* Ebû Hâşim er-Rummânî -- talebeleri */
  E("ebuhasimrummani", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâşim er-Rummânî tercemesi"),
  /* Şebîb b. Garkade -- talebeleri */
  E("sebibgarkade", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şebîb b. Garkade tercemesi"),
  /* Mufaddal b. Fadâle el-Kütbânî -- talebeleri */
  E("mufaddalfadale", "zekeriyyabyahyabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mufaddal b. Fadâle el-Kütbânî tercemesi"),
  /* Ebû'n-Nadr Hâşim b. el-Kāsım -- hocalari */
  E("ubeydbubeydelesceiebua", "ebunadrhasim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'n-Nadr Hâşim b. el-Kāsım tercemesi"),
  /* Süleymân b. Hayyân Ebû Hâlid el-Ahmer -- hocalari */
  E("osmanbhakim", "suleymanhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Hayyân Ebû Hâlid el-Ahmer tercemesi"),
  /* Hâtim b. İsmâîl el-Medenî -- talebeleri */
  E("hatimismail", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâtim b. İsmâîl el-Medenî tercemesi"),
  /* İsmâîl b. Zekeriyyâ el-Halkānî -- hocalari */
  E("talhabyahyabtalha", "ismailzekeriyya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Zekeriyyâ el-Halkānî tercemesi"),
  /* Ebû Saîd el-Eşecc -- hocalari */
  E("abdirrahmanbmuhammedbz", "ebusaidesecc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Eşecc tercemesi"),
  /* Mücâhid b. Mûsâ -- talebeleri */
  E("mucahidmusa", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mücâhid b. Mûsâ tercemesi"),
  /* Ebû Bekir b. Ayyâş -- hocalari */
  E("yezidbebiziyad", "ebubekirayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ayyâş tercemesi"),
  /* Muhammed b. Fudayl b. Gazvân -- talebeleri */
  E("muhammedfudayl", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fudayl b. Gazvân tercemesi"),
  /* Fudayl b. İyâz -- talebeleri */
  E("fudaylibnayaz", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  /* Fıtr b. Halîfe -- talebeleri */
  E("fitrhalife", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fıtr b. Halîfe tercemesi"),
  /* Abdüsselâm b. Harb -- talebeleri */
  E("abdusselamharb", "ismailbmusaelfezariebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Harb tercemesi"),
  E("abdusselamharb", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Harb tercemesi"),
  /* Mûsâ el-Cühenî -- talebeleri */
  E("musacuheni", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ el-Cühenî tercemesi"),
  /* Hâşim b. Hâşim b. Utbe -- talebeleri */
  E("hasimhasim", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Hâşim b. Utbe tercemesi"),
  /* Ebû Mâlik el-Eşce‘î -- hocalari */
  E("musabtalhabubeydetteym", "ebumalikesceyi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Mâlik el-Eşce‘î tercemesi"),
  /* Ebû Mâlik el-Eşce‘î -- talebeleri */
  E("ebumalikesceyi", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Mâlik el-Eşce‘î tercemesi"),
  /* Leys b. Ebî Süleym -- hocalari */
  E("bebielmuharibi", "leysebisuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Ebî Süleym tercemesi"),
  /* Hârûn b. Ma‘rûf -- talebeleri */
  E("harunmaruf", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. Ma‘rûf tercemesi"),
  /* Serîc b. Yûnus -- talebeleri */
  E("sericyunus", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Serîc b. Yûnus tercemesi"),
  /* Hasan b. Arafe -- hocalari */
  E("abdirrahmanbmuhammedbz", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  E("halefbhalifebsaidelesc", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  /* Müslim b. el-Haccâc -- hocalari */
  E("ahmedbabdullahbyunus", "muslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Müslim b. el-Haccâc tercemesi"),
  /* Ebû Bekir Muhammed b. en-Nadr el-Cârûdî -- hocalari */
  E("ismailbmusaelfezariebu", "ms25", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir Muhammed b. en-Nadr el-Cârûdî tercemesi"),
  /* Ahmed b. el-Muallâ ed-Dımaşkī -- hocalari */
  E("suleymanbabdirrahmanbh", "ed10", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Muallâ ed-Dımaşkī tercemesi"),
  /* Ebû Zür‘a er-Râzî -- hocalari */
  E("ahmedbabdullahbyunus", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  /* Ebû Hâtim er-Râzî -- hocalari */
  E("amrbrabibtarik", "ebuhatimrazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâtim er-Râzî tercemesi"),
  E("omerbhafsbgiyas", "ebuhatimrazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâtim er-Râzî tercemesi"),
  /* Şeybân b. Abdirrahman en-Nahvî -- hocalari */
  E("bebielmuharibi", "seybannahvi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman en-Nahvî tercemesi"),
  /* Şeybân b. Abdirrahman en-Nahvî -- talebeleri */
  E("seybannahvi", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman en-Nahvî tercemesi"),
  /* Muâviye b. Sellâm -- talebeleri */
  E("muaviyesellam", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sellâm tercemesi"),
  /* Zeyd b. Eslem -- hocalari */
  E("abdirrahmanbabdulmelik", "zeydeslem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Eslem tercemesi"),
  /* Süfyân b. Vekî‘ -- hocalari */
  E("abdulhamidbabdirrahman", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân b. Vekî‘ tercemesi"),
  /* Muhammed b. Sellâm el-Bîkendî -- hocalari */
  E("ubeydebhumeydebuabdirr", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sellâm el-Bîkendî tercemesi"),
  /* Abdül'alâ b. Hammâd en-Nersî -- talebeleri */
  E("nersi", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Hammâd en-Nersî tercemesi"),
  /* Yahyâ b. Mûsâ el-Belhî (Hat) -- talebeleri */
  E("yahyamusa", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Mûsâ el-Belhî (Hat) tercemesi"),
  /* Hasan b. Muhammed ez-Za‘ferânî -- hocalari */
  E("ubeydebhumeydebuabdirr", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed ez-Za‘ferânî tercemesi"),
  /* Yûsuf b. Mûsâ el-Kattân -- hocalari */
  E("asimbyusufebuamr", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mûsâ el-Kattân tercemesi"),
  E("ahmedbabdullahbyunus", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mûsâ el-Kattân tercemesi"),
  /* Ahmed b. Abdullah b. Muhammed -- hocalari */
  E("haccacmuhammed", "ahmedbabdullahbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ibnnumeyr", "ahmedbabdullahbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  /* Ahmed b. Abdullah b. Muhammed -- talebeleri */
  E("ahmedbabdullahbmuhamme", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ahmedbabdullahbmuhamme", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ahmedbabdullahbmuhamme", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ahmedbabdullahbmuhamme", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  /* Ahmed b. Abdullah b. Yûnus -- hocalari */
  E("israilyunus", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  /* Ahmed b. Abdullah b. Yûnus -- talebeleri */
  E("ahmedbabdullahbyunus", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  E("ahmedbabdullahbyunus", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  /* Ahmed b. el-Mufaddal -- hocalari */
  E("israilyunus", "ahmedbelmufaddal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Mufaddal tercemesi"),
  /* Ahmed b. el-Mufaddal -- talebeleri */
  E("ahmedbelmufaddal", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Mufaddal tercemesi"),
  /* Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer -- hocalari */
  E("abdirrahmanbserikbabdu", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer tercemesi"),
  E("muhammedbisrabdi", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer tercemesi"),
  /* İbrâhim b. Humeyd b. Abdirrahman -- hocalari */
  E("ismailebihalid", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  E("hisamurve", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  /* İbrâhim b. Humeyd b. Abdirrahman -- talebeleri */
  E("ibrahimbhumeydbabdirra", "sihabbabbadelabdiebuom", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  E("ibrahimbhumeydbabdirra", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  /* İbrâhim b. Osmân -- hocalari */
  E("ebuishaksebii", "ibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("amess", "ibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  /* İbrâhim b. Osmân -- talebeleri */
  E("ibrahimbosman", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("ibrahimbosman", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("ibrahimbosman", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("ibrahimbosman", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("ibrahimbosman", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  E("ibrahimbosman", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Osmân tercemesi"),
  /* İsmâîl b. Halîfe -- hocalari */
  E("hakemuteybe", "ismailbhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  E("suddi", "ismailbhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  /* İsmâîl b. Halîfe -- talebeleri */
  E("ismailbhalife", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  E("ismailbhalife", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  /* İsmâîl b. Abdirrahman -- hocalari */
  E("ebuhureyre", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman tercemesi"),
  E("sadubeyde", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman tercemesi"),
  E("ebuabdrahmansulemi", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman tercemesi"),
  /* İsmâîl b. Abdirrahman -- talebeleri */
  E("ismailbabdirrahman", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman tercemesi"),
  E("ismailbabdirrahman", "ebubekirayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman tercemesi"),
  /* İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed -- hocalari */
  E("ibrahimsad", "ismailbmusaelfezariebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  /* İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed -- talebeleri */
  E("ismailbmusaelfezariebu", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  E("ismailbmusaelfezariebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  E("ismailbmusaelfezariebu", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  /* Temîm b. Seleme es-Sülemî -- hocalari */
  E("sureyh", "temimbselemeessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  /* Temîm b. Seleme es-Sülemî -- talebeleri */
  E("temimbselemeessulemi", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  E("temimbselemeessulemi", "talhamusarrif", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  /* Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr -- hocalari */
  E("sevri", "sabitbmusababdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  /* Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr -- talebeleri */
  E("sabitbmusababdirrahman", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  E("sabitbmusababdirrahman", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  /* Câbir b. Nûh -- hocalari */
  E("amess", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("muhammedamralkame", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("ismailebihalid", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  /* Câbir b. Nûh -- talebeleri */
  E("cabirbnuh", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("cabirbnuh", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("cabirbnuh", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  /* Habîb b. Ebî Amre -- hocalari */
  E("mucahid", "habibbebiamre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  /* Habîb b. Ebî Amre -- talebeleri */
  E("habibbebiamre", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  E("habibbebiamre", "muhammedfudayl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  E("habibbebiamre", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  /* Hasan b. Bişr -- hocalari */
  E("ebulahvess", "hasanbbisr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  E("kaysrebi", "hasanbbisr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  /* Hasan b. Bişr -- talebeleri */
  E("hasanbbisr", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  E("hasanbbisr", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  E("hasanbbisr", "abbasduri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  E("hasanbbisr", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr tercemesi"),
  /* Hasan b. Umâre el-Becelî -- hocalari */
  E("habibebisabit", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hakemuteybe", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("ibnebimuleyke", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("ebuishaksebii", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("amess", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  /* Hasan b. Umâre el-Becelî -- talebeleri */
  E("hasanbumareelbeceli", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "halladyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  /* Hasan b. Ayyâş -- hocalari */
  E("amess", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("mugirmiksem", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("ismailebihalid", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("ismailebiislamsibani", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("yahyasaidensari", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("caferisadik", "hasanbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  /* Hasan b. Ayyâş -- talebeleri */
  E("hasanbayyas", "asimbyusufebuamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  E("hasanbayyas", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ayyâş tercemesi"),
  /* Hüseyin b. Yezîd b. Yahyâ -- hocalari */
  E("abdusselamharb", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("abdulhamidbabdirrahman", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("muhammedfudayl", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("suleymanhayyan", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("ibnidris", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  /* Hüseyin b. Yezîd b. Yahyâ -- talebeleri */
  E("huseyinbyezidbyahya", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("huseyinbyezidbyahya", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  /* Hammâd b. Üsâme -- hocalari */
  E("hisamurve", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("ebuburde", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("ismailebihalid", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("amess", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("mucalidsaid", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("ibncureyc", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("sadsaidensari", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("fitrhalife", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("muhammedamralkame", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hisamhassan", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("sube", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("misersukdam", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadzeyd", "hammadbusame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  /* Hammâd b. Üsâme -- talebeleri */
  E("hammadbusame", "safii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  E("hammadbusame", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Üsâme tercemesi"),
  /* Hâlid b. Seleme b. el-Âs -- hocalari */
  E("saidmusayyeb", "halidbselemebelas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("sabi", "halidbselemebelas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  /* Hâlid b. Seleme b. el-Âs -- talebeleri */
  E("halidbselemebelas", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "misersukdam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  /* Halef b. Temîm -- hocalari */
  E("israilyunus", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm tercemesi"),
  E("ebulahvess", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm tercemesi"),
  /* Halef b. Temîm -- talebeleri */
  E("halefbtemim", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm tercemesi"),
  E("halefbtemim", "abbasduri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm tercemesi"),
  /* Halef b. Halîfe b. Sâid el-Eşce‘î -- hocalari */
  E("ismailebihalid", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  E("malik", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  /* Halef b. Halîfe b. Sâid el-Eşce‘î -- talebeleri */
  E("halefbhalifebsaidelesc", "surayjnuman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  E("halefbhalifebsaidelesc", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  /* Hallâd b. Yezîd el-Cu‘fî -- hocalari */
  E("zuhayrmuaviye", "halladbyezidelcufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Yezîd el-Cu‘fî tercemesi"),
  /* Hallâd b. Yezîd el-Cu‘fî -- talebeleri */
  E("halladbyezidelcufi", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Yezîd el-Cu‘fî tercemesi"),
  /* Dâvûd b. Yezîd b. Abdirrahman el-Evdî -- hocalari */
  E("sabi", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  E("hakemuteybe", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  E("simakharb", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  /* Dâvûd b. Yezîd b. Abdirrahman el-Evdî -- talebeleri */
  E("davudbyezidbabdirrahma", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  /* ez-Zübeyr b. Adî el-Hemdânî el-Yâmî -- hocalari */
  E("enes", "ezzubeyrbadielhemdanie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, ez-Zübeyr b. Adî el-Hemdânî el-Yâmî tercemesi"),
  E("musabsad", "ezzubeyrbadielhemdanie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, ez-Zübeyr b. Adî el-Hemdânî el-Yâmî tercemesi"),
  E("nehai", "ezzubeyrbadielhemdanie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, ez-Zübeyr b. Adî el-Hemdânî el-Yâmî tercemesi"),
  E("talhamusarrif", "ezzubeyrbadielhemdanie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, ez-Zübeyr b. Adî el-Hemdânî el-Yâmî tercemesi"),
  /* ez-Zübeyr b. Adî el-Hemdânî el-Yâmî -- talebeleri */
  E("ezzubeyrbadielhemdanie", "misersukdam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, ez-Zübeyr b. Adî el-Hemdânî el-Yâmî tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. Ömer -- hocalari */
  E("ibnnumeyr", "zekeriyyabyahyabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer tercemesi"),
  E("ebubekirayyas", "zekeriyyabyahyabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. Ömer -- talebeleri */
  E("zekeriyyabyahyabomer", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer tercemesi"),
  E("zekeriyyabyahyabomer", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer tercemesi"),
  /* Saîd b. Cübeyr el-Esedî -- hocalari */
  E("ebusaid", "saidbcubeyrelesedi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("ebuhureyre", "saidbcubeyrelesedi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("ebumusa", "saidbcubeyrelesedi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  /* Saîd b. Cübeyr el-Esedî -- talebeleri */
  E("saidbcubeyrelesedi", "ebuishaksebii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "ebuzubeyrmekki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "habibebisabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "caferebivahsiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "hakemuteybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "husaynabdrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "simakharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "selemekuheyl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "talhamusarrif", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "abdulmelikebisuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "kasimebibezze", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "muhammedsuka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  E("saidbcubeyrelesedi", "mansurmutemir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr el-Esedî tercemesi"),
  /* Saîd b. Abdirrahman b. Abdullah ez-Zübeydî -- hocalari */
  E("mucahid", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("ibnebimuleyke", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("nehai", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  /* Saîd b. Abdirrahman b. Abdullah ez-Zübeydî -- talebeleri */
  E("saidbabdirrahmanbabdul", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("saidbabdirrahmanbabdul", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  /* Sellâm b. Süleym -- hocalari */
  E("ebuishaksebii", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("asimahvel", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("simakharb", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sebibgarkade", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("esvedkays", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("beyanbisr", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("amess", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("bebielmuharibi", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("husaynabdrahman", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("saidmesrukhsevri", "sellambsuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  /* Sellâm b. Süleym -- talebeleri */
  E("sellambsuleym", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "misned", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "halefhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  E("sellambsuleym", "suveydsaidhadesani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleym tercemesi"),
  /* Sellâm b. Süleymân el-Müzenî Ebû Münzir -- hocalari */
  E("sabitbunani", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("davudebihind", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("alizeydcudan", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("matarverrak", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  /* Sellâm b. Süleymân el-Müzenî Ebû Münzir -- talebeleri */
  E("sellambsuleymanelmuzen", "ibnuyeyne", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("sellambsuleymanelmuzen", "affanmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("sellambsuleymanelmuzen", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  /* Şihâb b. Abbâd el-Abdî Ebû Ömer -- hocalari */
  E("isabyunus", "sihabbabbadelabdiebuom", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("ebubekirayyas", "sihabbabbadelabdiebuom", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  /* Şihâb b. Abbâd el-Abdî Ebû Ömer -- talebeleri */
  E("sihabbabbadelabdiebuom", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("sihabbabbadelabdiebuom", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("sihabbabbadelabdiebuom", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("sihabbabbadelabdiebuom", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("sihabbabbadelabdiebuom", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  E("sihabbabbadelabdiebuom", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
  /* Şeybân b. Abdirrahman et-Temîmî -- hocalari */
  E("abdulmelikumeyr", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("firasyahya", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("yahyaebikesir", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("simakharb", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("amess", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("bebielmuharibi", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("hasanbasri", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("ziyadilaka", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("mansurmutemir", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("hilalvezzan", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  /* Şeybân b. Abdirrahman et-Temîmî -- talebeleri */
  E("seybanbabdirrahmanette", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ademebiiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ubeydullahmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  /* Talha b. Yahyâ b. Talha -- hocalari */
  E("mucahid", "talhabyahyabtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  /* Talha b. Yahyâ b. Talha -- talebeleri */
  E("talhabyahyabtalha", "ibnidris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  E("talhabyahyabtalha", "kattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  E("talhabyahyabtalha", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  /* Âsım b. Yûsuf Ebû Amr -- hocalari */
  E("israilyunus", "asimbyusufebuamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  E("ebulahvess", "asimbyusufebuamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  /* Âsım b. Yûsuf Ebû Amr -- talebeleri */
  E("asimbyusufebuamr", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  /* Abdullah b. Sâlim -- hocalari */
  E("ubeydullahmusa", "abdullahbsalim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  /* Abdullah b. Sâlim -- talebeleri */
  E("abdullahbsalim", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  E("abdullahbsalim", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  E("abdullahbsalim", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  /* Abdullah b. Âmir b. Zürâre el-Hadramî -- hocalari */
  E("ebubekirayyas", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("ibnebizaide", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("ubeydebhumeydebuabdirr", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  /* Abdullah b. Âmir b. Zürâre el-Hadramî -- talebeleri */
  E("abdullahbamirbzurareel", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  /* Abdullah b. Ömer b. Muhammed -- hocalari */
  E("ebulahvess", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("abdesuleyman", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("ibnnumeyr", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("muhammedfudayl", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  /* Abdullah b. Ömer b. Muhammed -- talebeleri */
  E("abdullahbomerbmuhammed", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("abdullahbomerbmuhammed", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  /* Abdullah b. Îsâ b. Abdirrahman Ebî Leylâ el-Ensârî Ebû Muhammed -- talebeleri */
  E("abdullahbisababdirrahm", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Îsâ b. Abdirrahman Ebî Leylâ el-Ensârî Ebû Muhammed tercemesi"),
  E("abdullahbisababdirrahm", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Îsâ b. Abdirrahman Ebî Leylâ el-Ensârî Ebû Muhammed tercemesi"),
  /* Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî -- hocalari */
  E("ibnidris", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("muhammedbkasimelesedie", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("yahyaadem", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("yalaubeyd", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("caferavn", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  /* Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî -- talebeleri */
  E("abdulalabvasilbabdulal", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Vâsıl b. Abdül'alâ el-Esedî tercemesi"),
  /* Abdülhamîd b. Sâlih b. Aclân -- hocalari */
  E("ebubekirayyas", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("fudaylibnayaz", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("zuhayrmuaviye", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("huseym", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  /* Abdülhamîd b. Sâlih b. Aclân -- talebeleri */
  E("abdulhamidbsalihbaclan", "abbasduri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("abdulhamidbsalihbaclan", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("abdulhamidbsalihbaclan", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  /* Abdülhamîd b. Abdirrahman -- hocalari */
  E("ebuburde", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("amess", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  /* Abdülhamîd b. Abdirrahman -- talebeleri */
  E("abdulhamidbabdirrahman", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  /* Abdirrahman -- hocalari */
  E("zadan", "abdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("suveydgafle", "abdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  /* Abdirrahman -- talebeleri */
  E("abdirrahman", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("abdirrahman", "ebuishaksebii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("abdirrahman", "leysebisuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("abdirrahman", "fitrhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("abdirrahman", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  E("abdirrahman", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman tercemesi"),
  /* Abdirrahman b. Şerîk b. Abdullah en-Nehaî -- talebeleri */
  E("abdirrahmanbserikbabdu", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Şerîk b. Abdullah en-Nehaî tercemesi"),
  /* Abdirrahman b. Âbis -- talebeleri */
  E("abdirrahmanbabis", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Âbis tercemesi"),
  E("abdirrahmanbabis", "kaysrebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Âbis tercemesi"),
  /* Abdirrahman b. Abdülmelik b. Saîd -- hocalari */
  E("elmufaddalbyunuselcufi", "abdirrahmanbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  /* Abdirrahman b. Abdülmelik b. Saîd -- talebeleri */
  E("abdirrahmanbabdulmelik", "sericyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  E("abdirrahmanbabdulmelik", "ahmedeskab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  /* Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed -- hocalari */
  E("ismailebihalid", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("amess", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("ismailebiislamsibani", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("yahyasaidensari", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  /* Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed -- talebeleri */
  E("abdirrahmanbmuhammedbz", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  /* Osmân b. Hakîm -- hocalari */
  E("ishaktalha", "osmanbhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  /* Osmân b. Hakîm -- talebeleri */
  E("osmanbhakim", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "huseym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "mervanfezari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "alimushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "ibnnumeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  E("osmanbhakim", "yalaubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm tercemesi"),
  /* Atâ b. Müslim el-Haffâf Ebû Mahled -- hocalari */
  E("amess", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("caferburkan", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("muhammedamralkame", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  /* Atâ b. Müslim el-Haffâf Ebû Mahled -- talebeleri */
  E("atabmuslimelhaffafebum", "amrebiselemetennisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  /* Atiyye b. Sa‘d -- hocalari */
  E("ebuhureyre", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("zeydarkam", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("adisabit", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  /* Atiyye b. Sa‘d -- talebeleri */
  E("atiyyebsad", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("atiyyebsad", "haccacertat", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("atiyyebsad", "muhammedbabdirrahmanbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("atiyyebsad", "mutarriftarif", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("atiyyebsad", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  E("atiyyebsad", "firasyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d tercemesi"),
  /* Alkame b. Amr b. el-Husayn Ebû Fazl -- hocalari */
  E("ebubekirayyas", "alkamebamrbelhusaynebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  /* Alkame b. Amr b. el-Husayn Ebû Fazl -- talebeleri */
  E("alkamebamrbelhusaynebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  E("alkamebamrbelhusaynebu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  /* Ali b. Sâbit -- hocalari */
  E("aliebisalihhayy", "alibsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  E("fudaylibnayaz", "alibsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  /* Ali b. Sâbit -- talebeleri */
  E("alibsabit", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  /* Ali b. Hakîm -- hocalari */
  E("sihabbabbadelabdiebuom", "alibhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm tercemesi"),
  E("alimushir", "alibhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm tercemesi"),
  /* Ali b. Hakîm -- talebeleri */
  E("alibhakim", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm tercemesi"),
  /* Ali b. Saîd b. Mesrûk el-Kindî -- hocalari */
  E("ibnebizaide", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("isabyunus", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("mervanfezari", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("alimushir", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("ibnidris", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  /* Ali b. Saîd b. Mesrûk el-Kindî -- talebeleri */
  E("alibsaidbmesrukelkindi", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  /* Ammâr b. Muhammed es-Sevrî -- hocalari */
  E("amess", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  E("leysebisuleym", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  E("muhammedamralkame", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  E("muhammedbsaibbbisrebun", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  /* Ammâr b. Muhammed es-Sevrî -- talebeleri */
  E("ammarbmuhammedessevri", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  E("ammarbmuhammedessevri", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  E("ammarbmuhammedessevri", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî tercemesi"),
  /* Ammâr b. Muâviye -- hocalari */
  E("ebutufeyl", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ebuselemeavf", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("abdullahsedddad", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  /* Ammâr b. Muâviye -- talebeleri */
  E("ammarbmuaviye", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "cabircufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  /* Ömer b. Hafs b. Giyâs -- hocalari */
  E("ebubekirayyas", "omerbhafsbgiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  /* Ömer b. Hafs b. Giyâs -- talebeleri */
  E("omerbhafsbgiyas", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "ahmeddevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "ibrahimbebibekirabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  /* Amr b. Sâbit -- hocalari */
  E("ebuishaksebii", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amess", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("simakharb", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("hakemuteybe", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  /* Amr b. Sâbit -- talebeleri */
  E("amrbsabit", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  /* Amr b. Hammâd b. Talha -- hocalari */
  E("muttalibbziyadbebizuhe", "amrbhammadbtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("hafsbsuleymanelesedieb", "amrbhammadbtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  /* Amr b. Hammâd b. Talha -- talebeleri */
  E("amrbhammadbtalha", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("amrbhammadbtalha", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("amrbhammadbtalha", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  /* Amr b. Muhammed -- hocalari */
  E("hanzalasufyan", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("ibncureyc", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("israilyunus", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  /* Amr b. Muhammed -- talebeleri */
  E("amrbmuhammed", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("amrbmuhammed", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("amrbmuhammed", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("amrbmuhammed", "hasanbhammadeddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  E("amrbmuhammed", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed tercemesi"),
  /* Avn b. Sellâm -- hocalari */
  E("zuhayrmuaviye", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("ebubekir2", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("israilyunus", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("kaysrebi", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  /* Avn b. Sellâm -- talebeleri */
  E("avnbsellam", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("avnbsellam", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  /* Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl -- hocalari */
  E("ebubekirayyas", "fadalebfazlbfadaleette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl tercemesi"),
  /* Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl -- talebeleri */
  E("fadalebfazlbfadaleette", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl tercemesi"),
  E("fadalebfazlbfadaleette", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl tercemesi"),
  /* Kâsım b. Ma‘n -- hocalari */
  E("amess", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("asimahvel", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("abdulmelikumeyr", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("mansurmutemir", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("talhabyahyabtalha", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("davudebihind", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("muhammedamralkame", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  E("hisamurve", "kasimbman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  /* Kâsım b. Ma‘n -- talebeleri */
  E("kasimbman", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Ma‘n tercemesi"),
  /* Muhammed b. İbrâhim b. Osmân -- hocalari */
  E("ismailebihalid", "muhammedbibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  E("amess", "muhammedbibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  E("muhammedamralkame", "muhammedbibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  E("sube", "muhammedbibrahimbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  /* Muhammed b. İbrâhim b. Osmân -- talebeleri */
  E("muhammedbibrahimbosman", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  E("muhammedbibrahimbosman", "saidsuleymansadeviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Osmân tercemesi"),
  /* Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir -- hocalari */
  E("yalaubeyd", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  E("caferavn", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  E("ahmedbabdullahbyunus", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  E("halidmahled", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  E("ubeydullahmusa", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  /* Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir -- talebeleri */
  E("muhammedbishakbavnelam", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir tercemesi"),
  /* Muhammed b. Hasan b. ez-Zübeyr el-Esedî -- hocalari */
  E("fitrhalife", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  E("suleymanmugire", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  E("ibrahimtahman", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  /* Muhammed b. Hasan b. ez-Zübeyr el-Esedî -- talebeleri */
  E("muhammedbhasanbezzubey", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  /* Muhammed b. Ubeyd -- hocalari */
  E("ismailebihalid", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("amess", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("hisamurve", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("avvamhavseb", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("abdulmelikebisuleyman", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("misersukdam", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  /* Muhammed b. Ubeyd -- talebeleri */
  E("muhammedbubeyd", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "ahmedmeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "muhammedisataba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "misned", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "ahmedsinan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  E("muhammedbubeyd", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd tercemesi"),
  /* Muhammed b. Osmân -- hocalari */
  E("ibnnumeyr", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbisrabdi", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("ebunuaymfadl", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("halidmahled", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  /* Muhammed b. Osmân -- talebeleri */
  E("muhammedbosman", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbosman", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbosman", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbosman", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbosman", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  E("muhammedbosman", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân tercemesi"),
  /* Muhammed b. Ukbe b. Kesîr -- hocalari */
  E("fudaylsuleyman", "muhammedbukbebkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  E("mervanfezari", "muhammedbukbebkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  /* Muhammed b. Ukbe b. Kesîr -- talebeleri */
  E("muhammedbukbebkesir", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  E("muhammedbukbebkesir", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  /* Muhammed b. Ömer -- hocalari */
  E("ibnnumeyr", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("yahyaadem", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("ubeydebhumeydebuabdirr", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("abdulvehhabata", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("muhammedfudayl", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("yezidharun", "muhammedbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  /* Muhammed b. Ömer -- talebeleri */
  E("muhammedbomer", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("muhammedbomer", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  E("muhammedbomer", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer tercemesi"),
  /* Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer -- hocalari */
  E("ibnnumeyr", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("yahyaadem", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("ubeydebhumeydebuabdirr", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("abdulvehhabata", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("muhammedfudayl", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("yezidharun", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer -- talebeleri */
  E("muhammedbomerbelvelide", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("muhammedbomerbelvelide", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("muhammedbomerbelvelide", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  /* Mes‘ûd b. Mâlik -- hocalari */
  E("muazcebel", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  E("ebumusa", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  E("ebuhureyre", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  /* Mes‘ûd b. Mâlik -- talebeleri */
  E("mesudbmalik", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  E("mesudbmalik", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  E("mesudbmalik", "mugirmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik tercemesi"),
  /* Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî -- hocalari */
  E("ziyadilaka", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("suddi", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("leysebisuleym", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  /* Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî -- talebeleri */
  E("muttalibbziyadbebizuhe", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("muttalibbziyadbebizuhe", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("muttalibbziyadbebizuhe", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  /* Muâviye b. Hişâm -- hocalari */
  E("sevri", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  E("malik", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  E("hamzazeyyat", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  /* Muâviye b. Hişâm -- talebeleri */
  E("muaviyebhisam", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  /* Mugīre b. Miksem -- hocalari */
  E("nehai", "mugirebmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("sabi", "mugirebmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mucahid", "mugirebmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("simakharb", "mugirebmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  /* Mugīre b. Miksem -- talebeleri */
  E("mugirebmiksem", "suleymanteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "ibrahimtahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "zaidekudame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  E("mugirebmiksem", "huseym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Miksem tercemesi"),
  /* el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus -- hocalari */
  E("evzai", "elmufaddalbyunuselcufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus tercemesi"),
  /* el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus -- talebeleri */
  E("elmufaddalbyunuselcufi", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus tercemesi"),
  /* Mûsâ b. Îsâ el-Leysî -- hocalari */
  E("zaidekudame", "musabisaelleysi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  /* Mûsâ b. Îsâ el-Leysî -- talebeleri */
  E("musabisaelleysi", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  E("musabisaelleysi", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  /* Nasr b. Abdirrahman -- hocalari */
  E("ibnidris", "nasrbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  E("abdirrahmanbmuhammedbz", "nasrbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  /* Nasr b. Abdirrahman -- talebeleri */
  E("nasrbabdirrahman", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  E("nasrbabdirrahman", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  E("nasrbabdirrahman", "bh12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  E("nasrbabdirrahman", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  E("nasrbabdirrahman", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman tercemesi"),
  /* Nu‘mân b. Sâbit -- hocalari */
  E("ataebirebah", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("hakemuteybe", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("selemekuheyl", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("ziyadilaka", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("saidmesrukhsevri", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("adisabit", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("yahyasaidensari", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  /* Nu‘mân b. Sâbit -- talebeleri */
  E("numanbsabit", "ibrahimtahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "hamzazeyyat", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "alimushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "muhammedbisrabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  E("numanbsabit", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit tercemesi"),
  /* Heysem b. Hâlid -- hocalari */
  E("ibnnumeyr", "heysembhalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Heysem b. Hâlid tercemesi"),
  /* Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım -- hocalari */
  E("ebubekirayyas", "vasilbabdulalabhilalel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  E("yahyaadem", "vasilbabdulalabhilalel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  /* Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım -- talebeleri */
  E("vasilbabdulalabhilalel", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdül'alâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  /* el-Velîd b. Kâsım b. el-Velîd el-Hemdânî -- hocalari */
  E("mucalidsaid", "elvelidbkasimbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("omerzerr", "elvelidbkasimbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  /* el-Velîd b. Kâsım b. el-Velîd el-Hemdânî -- talebeleri */
  E("elvelidbkasimbelvelide", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("elvelidbkasimbelvelide", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("elvelidbkasimbelvelide", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("elvelidbkasimbelvelide", "ramadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  /* Yahyâ b. Bişr b. Kesîr -- hocalari */
  E("saidabdulaziz", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  E("caferbziyadelahmer", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  E("velidmuslim", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  /* Yahyâ b. Bişr b. Kesîr -- talebeleri */
  E("yahyabbisrbkesir", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  /* Yahyâ b. Saîd b. Hayyân -- talebeleri */
  E("yahyabsaidbhayyan", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd b. Hayyân tercemesi"),
  E("yahyabsaidbhayyan", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd b. Hayyân tercemesi"),
  E("yahyabsaidbhayyan", "kattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd b. Hayyân tercemesi"),
  /* Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr -- hocalari */
  E("ebuosmannehdi", "yahyabmeymuneddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("nehai", "yahyabmeymuneddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  /* Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr -- talebeleri */
  E("yahyabmeymuneddabbiebu", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("yahyabmeymuneddabbiebu", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("yahyabmeymuneddabbiebu", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  /* Yezîd b. Ebî Ziyâd -- hocalari */
  E("nehai", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("ebusalih", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("mucahid", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("sabitbunani", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  /* Yezîd b. Ebî Ziyâd -- talebeleri */
  E("yezidbebiziyad", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("yezidbebiziyad", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("yezidbebiziyad", "huseym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("yezidbebiziyad", "alimushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  E("yezidbebiziyad", "muhammedfudayl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Ziyâd tercemesi"),
  /* Yezîd b. Mihrân el-Esedî Ebû Hâlid -- hocalari */
  E("ebubekirayyas", "yezidbmihranelesediebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Mihrân el-Esedî Ebû Hâlid tercemesi"),
  /* Ya‘lâ b. el-Hâris b. Harb el-Muhâribî -- hocalari */
  E("ismailebihalid", "yalabelharisbharbelmuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("bebielmuharibi", "yalabelharisbharbelmuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  /* Ya‘lâ b. el-Hâris b. Harb el-Muhâribî -- talebeleri */
  E("yalabelharisbharbelmuh", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("yalabelharisbharbelmuh", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("yalabelharisbharbelmuh", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  /* Ebû Bekir -- hocalari */
  E("ziyadilaka", "ebubekir2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("habibebisabit", "ebubekir2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  /* Ebû Bekir -- talebeleri */
  E("ebubekir2", "behzesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "ebukudame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "ebunuaymfadl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "amrmerzuk", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  /* İsmâîl b. «صبيح» -- hocalari */
  E("hammadseleme", "ismailb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. «صبيح» tercemesi"),
  /* İsmâîl b. «صبيح» -- talebeleri */
  E("ismailb", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. «صبيح» tercemesi"),
  /* «أشعث» b. Ebî «الشعثاء» el-Muhâribî -- talebeleri */
  E("bebielmuharibi", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, «أشعث» b. Ebî «الشعثاء» el-Muhâribî tercemesi"),
  E("bebielmuharibi", "misersukdam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, «أشعث» b. Ebî «الشعثاء» el-Muhâribî tercemesi"),
  /* Hüseyin b. Hasan «الأشقر» el-Fezârî -- hocalari */
  E("kaysrebi", "huseyinbhasanelfezari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  E("huseym", "huseyinbhasanelfezari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  /* Hüseyin b. Hasan «الأشقر» el-Fezârî -- talebeleri */
  E("huseyinbhasanelfezari", "ahmedabde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan «الأشقر» el-Fezârî tercemesi"),
  /* Ubeyd «الله» -- talebeleri */
  E("ubeyd", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  E("ubeyd", "affanmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  E("ubeyd", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  E("ubeyd", "caferbhumeydebumuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  E("ubeyd", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  E("ubeyd", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» tercemesi"),
  /* Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman -- hocalari */
  E("hisamurve", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ismailebihalid", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("sube", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("muhammedamralkame", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  /* Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman -- talebeleri */
  E("ubeydbubeydelesceiebua", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd «الله» b. Ubeyd «الرحمن» el-Eşce‘î Ebû Abdirrahman tercemesi"),
  /* Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah -- hocalari */
  E("ebuvail", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  E("ebuishaksebii", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  E("ismailebihalid", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  E("leysebisuleym", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  E("simakharb", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  E("ebuzubeyrmekki", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. «أشعث» el-Muhâribî Ebû Abdullah tercemesi"),
  /* Muhammed b. «الأشعث» b. Kays el-Kindî Ebû Kâsım -- talebeleri */
  E("muhammedbbkayselkindie", "sabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الأشعث» b. Kays el-Kindî Ebû Kâsım tercemesi"),
  E("muhammedbbkayselkindie", "mucahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الأشعث» b. Kays el-Kindî Ebû Kâsım tercemesi"),
  /* Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer -- hocalari */
  E("abdusselamharb", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  E("fudaylibnayaz", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  E("hammadzeyd", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer -- talebeleri */
  E("muhammedbbmalikennehai", "abbasduri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. «الطفيل» b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  /* Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ -- hocalari */
  E("hakimhizam", "musabtalhabubeydetteym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ tercemesi"),
  E("ebuhureyre", "musabtalhabubeydetteym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ tercemesi"),
  /* Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ -- talebeleri */
  E("musabtalhabubeydetteym", "hakemuteybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Talha b. Ubeyd «الله» et-Teymî Ebû Îsâ tercemesi"),
];

export const NODES = [...ANA_NODES, ...KUFE_NODES];
export const EDGES = [...ANA_EDGES, ...KUFE_EDGES];
nebiKenarlariEkle(NODES, EDGES);
export const DERECE = dereceKur(EDGES);
export const rOf = rOfKur(DERECE);
export const rEkranOf = rEkranOfKur(rOf);
export const { POS, SUTUNLAR, W, MEDINE } = yerlesimKur(NODES);
