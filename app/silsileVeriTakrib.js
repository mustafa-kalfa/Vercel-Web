/* TAKRIB TRANSI -- DENEME VERISI, yalnizca /ag-sinamasi kullaniyor.

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

   793 dugum, 3365 kenar. */
import {
  NODES as ANA_NODES, EDGES as ANA_EDGES, N, E,
  dereceKur, rOfKur, rEkranOfKur, yerlesimKur, nebiKenarlariEkle,
} from "./silsileVeri.js";

export * from "./silsileVeri.js";

const KUFE_NODES = [
  N("ahmedbibrahimbhalidebu", "أحمد بن إبراهيم بن خالد الموصلي أبو علي", "Ahmed b. İbrâhim b. Hâlid Ebû Ali", 5, 236, "Bağdat"),
  N("ahmedbibrahimbkesir", "أحمد بن إبراهيم بن كثير", "Ahmed b. İbrâhim b. Kesîr", 5, 246, "Bağdat"),
  N("ahmedbishakbzeydebiish", "أحمد بن إسحاق بن زيد أبو إسحاق البصري", "Ahmed b. İshak b. Zeyd Ebû İshak el-Basrî", 5, 211, "Basra"),
  N("ahmedbcafer", "أحمد بن جعفر المعقري", "Ahmed b. Ca‘fer", 5, 255, "Mekke"),
  N("ahmedbelhaccacelmervez", "أحمد بن الحجاج البكري المروزي", "Ahmed b. el-Haccâc el-Mervezî", 5, 222, "Horasan"),
  N("ahmedbhafsbabdullahebu", "أحمد بن حفص بن عبد الله أبو علي بن أبي عمرو", "Ahmed b. Hafs b. Abdullah Ebû Ali b. Ebî Amr", 5, 258, "Horasan"),
  N("ahmedbhalidelhallal", "أحمد بن خالد الخلال", "Ahmed b. Hâlid el-Hallâl", 5, 247, "Bağdat"),
  N("ahmedbsadbhakemebucafe", "أحمد بن سعد بن الحكم أبو جعفر بن أبي مريم", "Ahmed b. Sa‘d b. Hakem Ebû Ca‘fer b. Ebî Meryem", 5, 253, "Mısır"),
  N("ahmedbsaidbbesirelhemd", "أحمد بن سعيد بن بشير الهمداني أبو جعفر المصري", "Ahmed b. Saîd b. Beşîr el-Hemdânî Ebû Ca‘fer el-Mısrî", 5, 253, "Mısır"),
  N("ahmedbsaid", "أحمد بن سعيد بن صخر الدارمي أبو جعفر السرخسي", "Ahmed b. Saîd b. Sahr Ebû Ca‘fer", 5, 253, "Horasan"),
  N("ahmedbseyyarbeyyubebuh", "أحمد بن سيار بن أيوب أبو الحسن المروزي الفقيه", "Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh", 5, 268, "Horasan"),
  N("ahmedbsebibbsaid", "أحمد بن شبيب بن سعيد الحبطي", "Ahmed b. Şebîb b. Saîd", 5, 229, "Basra"),
  N("ahmedbsalih", "أحمد بن صالح البغدادي", "Ahmed b. Sâlih", 5, 245, "Bağdat"),
  N("ahmedbabdullahbhakem", "أحمد بن عبد الله بن الحكم", "Ahmed b. Abdullah b. Hakem", 5, 247, "Basra"),
  N("ahmedbabdullahbmuhamme", "أحمد بن عبد الله بن محمد", "Ahmed b. Abdullah b. Muhammed", 5, 258, "Kûfe"),
  N("ahmedbabdullahbyunus", "أحمد بن عبد الله بن يونس", "Ahmed b. Abdullah b. Yûnus", 5, 227, "Kûfe"),
  N("ahmedbabdirrahman", "أحمد بن عبد الرحمن بن بكار", "Ahmed b. Abdirrahman b. Bekkâr", 5, 248, "Şam"),
  N("ahmedbabdulmelikbvakid", "أحمد بن عبد الملك بن واقد الحراني أبو يحيى الأسدي", "Ahmed b. Abdülmelik b. Vâkid Ebû Yahyâ el-Esedî", 5, 221, "Humus"),
  N("ahmedbalibsaidebubekir", "أحمد بن علي بن سعيد أبو بكر القاضي", "Ahmed b. Ali b. Saîd Ebû Bekir el-Kādî", 6, 292, "Horasan"),
  N("ahmedbomerebucafer", "أحمد بن عمر الحميري أبو جعفر البغدادي", "Ahmed b. Ömer Ebû Ca‘fer", 5, 258, "Bağdat"),
  N("ahmedbamrbabdullah", "أحمد بن عمرو بن عبد الله", "Ahmed b. Amr b. Abdullah", 5, 250, "Mısır"),
  N("ahmedbisabhassanelmisr", "أحمد بن عيسى بن حسان المصري", "Ahmed b. Îsâ b. Hassân el-Mısrî", 5, 243, "Mısır"),
  N("ahmedbisaettinnisielmi", "أحمد بن عيسى التنيسي المصري", "Ahmed b. Îsâ et-Tinnîsî el-Mısrî", 5, 273, "Mısır"),
  N("ahmedbmuhammedbahmedeb", "أحمد بن محمد بن أحمد", "Ahmed b. Muhammed b. Ahmed", 5, 233, "Bağdat"),
  N("ahmedbmuhammedbmugire", "أحمد بن محمد بن المغيرة", "Ahmed b. Muhammed b. Mugīre", 5, 264, "Humus"),
  N("ahmedbmuhammedbyahyaeb", "أحمد بن محمد بن يحيى أبو سعيد البصري", "Ahmed b. Muhammed b. Yahyâ Ebû Saîd el-Basrî", 5, 258, "Basra"),
  N("ahmedbelmufaddal", "أحمد بن المفضل الحفري", "Ahmed b. el-Mufaddal", 5, 215, "Kûfe"),
  N("ahmedbmansurbseyyarebu", "أحمد بن منصور بن سيار البغدادي الرمادي أبو بكر", "Ahmed b. Mansûr b. Seyyâr Ebû Bekir", 5, 265, "Bağdat"),
  N("ahmedbnasrbziyadennisa", "أحمد بن نصر بن زياد النيسابوري", "Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî", 5, 245, "Horasan"),
  N("ahmedbyahyabzekeriyyae", "أحمد بن يحيى بن زكريا الأودي أبو جعفر الكوفي", "Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer", 5, 264, "Kûfe"),
  N("ibrahimbishakbisaelbun", "إبراهيم بن إسحاق بن عيسى البناني", "İbrâhim b. İshak b. Îsâ el-Bünânî", 5, 215, "Horasan"),
  N("ibrahimbismail", "إبراهيم بن إسماعيل بن أبي حبيبة الأنصاري الأشهلي", "İbrâhim b. İsmâîl b. Ebî Habîbe el-Ensârî el-Eşhelî", 5, 165, "Medine"),
  N("ibrahimbismailbyahyaeb", "إبراهيم بن إسماعيل بن يحيى أبو إسحاق الكوفي", "İbrâhim b. İsmâîl b. Yahyâ Ebû İshak", 5, 258, "Kûfe"),
  N("ibrahimbelharisbismail", "إبراهيم بن الحارث بن إسماعيل البغدادي أبو إسحاق", "İbrâhim b. el-Hâris b. İsmâîl Ebû İshak", 5, 265, "Horasan"),
  N("ibrahimbhabibbessehide", "إبراهيم بن حبيب بن الشهيد الأزدي أبو إسحاق البصري", "İbrâhim b. Habîb b. eş-Şehîd el-Ezdî Ebû İshak el-Basrî", 5, 203, "Basra"),
  N("ibrahimbelhaccac", "إبراهيم بن الحجاج النيلي", "İbrâhim b. el-Haccâc", 5, 232, "Basra"),
  N("ibrahimbhasan", "إبراهيم بن الحسن بن نجيح الباهلي", "İbrâhim b. Hasan b. Necîh el-Bâhilî", 5, 235, "Basra"),
  N("ibrahimbhamzabmuhammed", "إبراهيم بن حمزة بن محمد أبو إسحاق", "İbrâhim b. Hamza b. Muhammed Ebû İshak", 5, 230, "Medine"),
  N("ibrahimbhumeydbabdirra", "إبراهيم بن حميد بن عبد الرحمن الرؤاسي", "İbrâhim b. Humeyd b. Abdirrahman", 5, 178, "Kûfe"),
  N("ibrahimbdinarebuishake", "إبراهيم بن دينار البغدادي أبو إسحاق التمار", "İbrâhim b. Dînâr Ebû İshak et-Temmâr", 5, 232, "Bağdat"),
  N("ibrahimbsadbibrahimebu", "إبراهيم بن سعد بن إبراهيم أبو إسحاق المدني", "İbrâhim b. Sa‘d b. İbrâhim Ebû İshak el-Medenî", 5, 185, "Bağdat"),
  N("ibrahimbabdullahbahmed", "إبراهيم بن عبد الله بن أحمد الخلال المروزي أبو إسحاق", "İbrâhim b. Abdullah b. Ahmed el-Hallâl el-Mervezî Ebû İshak", 5, 241, "Horasan"),
  N("ibrahimbabdullahbhatim", "إبراهيم بن عبد الله بن حاتم الهروي أبو إسحاق", "İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak", 5, 244, "Bağdat"),
  N("ibrahimbebibekirabdull", "إبراهيم بن أبي بكر عبد الله بن محمد أبو شيبة الكوفي", "İbrâhim b. Ebî Bekir Abdullah b. Muhammed Ebû Şeybe", 5, 265, "Kûfe"),
  N("ibrahimbosman", "إبراهيم بن عثمان العبسي", "İbrâhim b. Osmân", 5, 169, "Kûfe"),
  N("ibrahimbalabeddahhak", "إبراهيم بن العلاء بن الضحاك", "İbrâhim b. Alâ b. ed-Dahhâk", 5, 235, "Humus"),
  N("ibrahimbmuhammedbabdul", "إبراهيم بن محمد بن عبد الله أبو إسحاق البصري", "İbrâhim b. Muhammed b. Abdullah Ebû İshak el-Basrî", 5, 250, "Basra"),
  N("ibrahimbmehdibabdirrah", "إبراهيم بن مهدي بن عبد الرحمن الأبلي", "İbrâhim b. Mehdî b. Abdirrahman", 6, 280, "Basra"),
  N("ibrahimbmeymunrafielme", "إبراهيم بن ميمون الصائغ المروزي", "İbrâhim b. Meymûn es-Sâiğ el-Mervezî", 5, 131, "Horasan"),
  N("ibrahimbyezid", "إبراهيم بن يزيد الخوزي", "İbrâhim b. Yezîd", 5, 151, "Mekke"),
  N("ertatbmunzirbelesved", "أرطاة بن المنذر بن الأسود الألهاني", "Ertât b. Münzir b. el-Esved", 5, 163, "Humus"),
  N("ishakbibrahimbsuveyd", "إسحاق بن إبراهيم بن سويد", "İshak b. İbrâhim b. Süveyd", 5, 254, "Şam"),
  N("ishakbibrahimbmuhammed", "إسحاق بن إبراهيم بن محمد الصواف الباهلي أبو يعقوب البصري", "İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî", 5, 253, "Basra"),
  N("ishakbibrahimbnasrebui", "إسحاق بن إبراهيم بن نصر البخاري أبو إبراهيم السعدي", "İshak b. İbrâhim b. Nasr Ebû İbrâhim", 5, 242, "Mâverâünnehir"),
  N("ishakbibrahimbyezidebu", "إسحاق بن إبراهيم بن يزيد أبو النضر الدمشقي الفراديسي", "İshak b. İbrâhim b. Yezîd Ebû Nadr ed-Dımaşkī", 5, 227, "Şam"),
  N("ishakbibrahimbyunuselv", "إسحاق بن إبراهيم بن يونس المنجنيقي الوراق أبو يعقوب البغدادي", "İshak b. İbrâhim b. Yûnus el-Verrâk Ebû Ya‘kûb", 6, 314, "Mısır"),
  N("ishakbibrahim", "إسحاق بن إبراهيم الحنيني", "İshak b. İbrâhim", 5, 216, "Medine"),
  N("ishakbbekir", "إسحاق بن بكر بن مضر أبو يعقوب", "İshak b. Bekir b. Mudar Ebû Ya‘kûb", 5, 218, "Mısır"),
  N("ishakbsuveyd", "إسحاق بن سويد بن هبيرة العدوي البصري", "İshak b. Süveyd b. Hübeyre el-Adevî el-Basrî", 3, 131, "Basra"),
  N("ishakbabdulvahid", "إسحاق بن عبد الواحد الموصلي", "İshak b. Abdülvâhid", 5, 226, "Humus"),
  N("ishakbmuhammedbismail", "إسحاق بن محمد بن إسماعيل", "İshak b. Muhammed b. İsmâîl", 5, 226, "Medine"),
  N("ishakbmusababdullahebu", "إسحاق بن موسى بن عبد الله أبو موسى المدني", "İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî", 5, 244, "Medine"),
  N("esmabubeyd", "أسماء بن عبيد بن مخارق الضبعي أبو المفضل البصري", "Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî", 5, 141, "Basra"),
  N("ismailbeban", "إسماعيل بن أبان الغنوي", "İsmâîl b. Ebân", 5, 210, "Kûfe"),
  N("ismailbibrahim", "إسماعيل بن إبراهيم بن بسام البغدادي أبو إبراهيم الترجماني", "İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim", 5, 236, "Bağdat"),
  N("ismailbibrahimbmikseme", "إسماعيل بن إبراهيم بن مقسم الأسدي", "İsmâîl b. İbrâhim b. Miksem el-Esedî", 5, 193, "Basra"),
  N("ismailbibrahimebuibrah", "إسماعيل بن إبراهيم الكرابيسي أبو إبراهيم البصري", "İsmâîl b. İbrâhim Ebû İbrâhim el-Basrî", 5, 194, "Basra"),
  N("ismailbebielharisesed", "إسماعيل بن أبي الحارث أسد بن شاهين البغدادي أبو إسحاق", "İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak", 5, 258, "Bağdat"),
  N("ismailbhalife", "إسماعيل بن خليفة العبسي", "İsmâîl b. Halîfe", 5, 169, "Kûfe"),
  N("ismailbabdullahbzurare", "إسماعيل بن عبد الله بن زرارة أبو الحسن الرقي", "İsmâîl b. Abdullah b. Zürâre Ebû Hasan", 5, 229, "Humus"),
  N("ismailbabdirrahman", "إسماعيل بن عبد الرحمن بن أبي كريمة السدي", "İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî", 4, 127, "Kûfe"),
  N("ismailbubeyd", "إسماعيل بن عبيد بن أبي كريمة الأموي", "İsmâîl b. Ubeyd b. Ebî Kerîme", 5, 240, "Humus"),
  N("ismailbmuhammedbsadebi", "إسماعيل بن محمد بن سعد أبو محمد", "İsmâîl b. Muhammed b. Sa‘d Ebû Muhammed", 4, 134, "Medine"),
  N("ismailbb", "إسماعيل بن مسلمة بن قعنب الحارثي القعنبي أبو بشر", "İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr", 5, 209, "Mısır"),
  N("ismailbmusaelfezariebu", "إسماعيل بن موسى الفزاري أبو محمد", "İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed", 5, 245, "Kûfe"),
  N("rebiababdirrahmanerrem", "أسيد بن عبد الرحمن الخثعمي الرملي", "Rebîa b. Abdirrahman er-Remlî", 5, 144, "Şam"),
  N("umeyyebabdullahbhalid", "أمية بن عبد الله بن خالد", "Ümeyye b. Abdullah b. Hâlid", 3, 87, "Mekke"),
  N("iyasbselemebelekvaebus", "إياس بن سلمة بن الأكوع الأسلمي أبو سلمة", "İyâs b. Seleme b. el-Ekva‘ Ebû Seleme", 3, 119, "Medine"),
  N("iyasbmuaviyebkurreebuv", "إياس بن معاوية بن قرة أبو واثلة البصري القاضي", "İyâs b. Muâviye b. Kurre Ebû Vâsile el-Basrî el-Kādî", 5, 122, "Basra"),
  N("eyyubbbesirbkabeladevi", "أيوب بن بشير بن كعب العدوي البصري", "Eyyûb b. Beşîr b. Kâ‘b el-Adevî el-Basrî", 5, 119, "Basra"),
  N("eyyubbhabibezzuhrielme", "أيوب بن حبيب الزهري المدني", "Eyyûb b. Habîb ez-Zührî el-Medenî", 5, 131, "Medine"),
  N("eyyubbmusabamrebumusae", "أيوب بن موسى بن عمرو أبو موسى المكي الأموي", "Eyyûb b. Mûsâ b. Amr Ebû Mûsâ el-Mekkî", 5, 132, "Mekke"),
  N("bisrbelharisbabdirrahm", "بشر بن الحارث بن عبد الرحمن", "Bişr b. el-Hâris b. Abdirrahman", 5, 227, "Bağdat"),
  N("bisrbmuhammedessahtiya", "بشر بن محمد السختياني أبو محمد المروزي", "Bişr b. Muhammed es-Sahtiyânî Ebû Muhammed el-Mervezî", 5, 224, "Horasan"),
  N("bisrbmansur", "بشر بن منصور السليمي", "Bişr b. Mansûr", 5, 180, "Basra"),
  N("bekirbisa", "بكر بن عيسى الراسبي", "Bekir b. Îsâ", 5, 204, "Basra"),
  N("bukeyrbmarufelesediebu", "بكير بن معروف الأسدي أبو معاذ", "Bükeyr b. Ma‘rûf el-Esedî Ebû Muâz", 5, 163, "Şam"),
  N("temimbselemeessulemi", "تميم بن سلمة السلمي الكوفي", "Temîm b. Seleme es-Sülemî", 3, 100, "Kûfe"),
  N("sabitbumareebumalikelb", "ثابت بن عمارة الحنفي أبو مالك البصري", "Sâbit b. Umâre Ebû Mâlik el-Basrî", 5, 149, "Basra"),
  N("sabitbkayselgifari", "ثابت بن قيس الغفاري", "Sâbit b. Kays el-Gıfârî", 5, 168, "Medine"),
  N("sabitbmusababdirrahman", "ثابت بن موسى بن عبد الرحمن أبو يزيد الكوفي الضرير", "Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr", 5, 229, "Kûfe"),
  N("sabitbyezidelahvelebuz", "ثابت بن يزيد الأحول أبو زيد البصري", "Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî", 5, 169, "Basra"),
  N("cabirbnuh", "جابر بن نوح الحماني", "Câbir b. Nûh", 5, 203, "Kûfe"),
  N("caferbhumeydebumuhamme", "جعفر بن حميد العبسي الكوفي أبو محمد", "Ca‘fer b. Humeyd Ebû Muhammed", 5, 240, "Kûfe"),
  N("caferbziyadelahmer", "جعفر بن زياد الأحمر الكوفي", "Ca‘fer b. Ziyâd el-Ahmer", 5, 167, "Kûfe"),
  N("caferbsuleymaneddubai", "جعفر بن سليمان الضبعي", "Ca‘fer b. Süleymân ed-Dubaî", 5, 178, "Basra"),
  N("caferbmuhammedsadeveyh", "جعفر بن محمد الواسطي الوراق", "Ca‘fer b. Muhammed el-Vâsıtî el-Verrâk", 5, 265, "Bağdat"),
  N("hatimbyusufbhalid", "حاتم بن يوسف بن خالد", "Hâtim b. Yûsuf b. Hâlid", 5, 213, "Horasan"),
  N("elharisbesedbmakilelhe", "الحارث بن أسد بن معقل الهمداني", "el-Hâris b. Esed b. Ma‘kıl el-Hemdânî", 5, 256, "Mısır"),
  N("elharisbesed", "الحارث بن أسد المحاسبي", "el-Hâris b. Esed", 5, 243, "Bağdat"),
  N("elharisbabdirrahmanbab", "الحارث بن عبد الرحمن بن عبد الله", "el-Hâris b. Abdirrahman b. Abdullah", 5, 146, "Medine"),
  N("elharisbatiyyeelbasri", "الحارث بن عطية البصري", "el-Hâris b. Atiyye el-Basrî", 5, 199, "Basra"),
  N("elharisbyezidelhadrami", "الحارث بن يزيد الحضرمي أبو عبد الكريم المصري", "el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî", 4, 130, "Mısır"),
  N("elharisbyakubelensari", "الحارث بن يعقوب الأنصاري", "el-Hâris b. Ya‘kûb el-Ensârî", 5, 130, "Mısır"),
  N("hamidbomerbhafsebibekr", "حامد بن عمر بن حفص أبو عبد الرحمن البصري", "Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî", 5, 233, "Basra"),
  N("hamidbyahyabhaniebuabd", "حامد بن يحيى بن هانئ البلخي أبو عبد الله", "Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah", 5, 242, "Horasan"),
  N("habibbebihabibelcermie", "حبيب بن أبي حبيب الجرمي البصري", "Habîb b. Ebî Habîb el-Cermî el-Basrî", 5, 162, "Basra"),
  N("habibebihabibelmisri", "حبيب أبي حبيب المصري", "Habîb Ebî Habîb el-Mısrî", 5, 218, "Mısır"),
  N("habibbsalih", "حبيب بن صالح", "Habîb b. Sâlih", 5, 147, "Humus"),
  N("habibbebiamre", "حبيب بن أبي عمرة", "Habîb b. Ebî Amre", 5, 142, "Kûfe"),
  N("habibelmuallimebumuham", "حبيب المعلم أبو محمد البصري", "Habîb el-Muallim Ebû Muhammed el-Basrî", 5, 130, "Basra"),
  N("haccacbebiosmanmeysere", "حجاج بن أبي عثمان ميسرة", "Haccâc b. Ebî Osmân Meysere", 5, 143, "Basra"),
  N("hassanbabdullahbsehlel", "حسان بن عبد الله بن سهل الكندي أبو علي الواسطي", "Hassân b. Abdullah b. Sehl el-Kindî Ebû Ali el-Vâsıtî", 5, 222, "Mısır"),
  N("hasanbishakbziyadelley", "الحسن بن إسحاق بن زياد الليثي", "Hasan b. İshak b. Ziyâd el-Leysî", 5, 241, "Horasan"),
  N("hasanbbisr", "الحسن بن بشر بن سلم", "Hasan b. Bişr b. Selm", 5, 221, "Kûfe"),
  N("hasanbsevbanbamir", "الحسن بن ثوبان بن عامر الهوزني", "Hasan b. Sevbân b. Âmir", 5, 145, "Mısır"),
  N("hasanbebicafer", "الحسن بن أبي جعفر الجفري", "Hasan b. Ebî Ca‘fer", 5, 167, "Basra"),
  N("hasanbhabib", "الحسن بن حبيب بن ندبة", "Hasan b. Habîb b. Nedebe", 5, 197, "Basra"),
  N("hasanbhammad", "الحسن بن حماد بن كسيب", "Hasan b. Hammâd b. Küseyb", 5, 241, "Bağdat"),
  N("hasanbhammadeddabbiebu", "الحسن بن حماد الضبي أبو علي الوراق الصيرفي", "Hasan b. Hammâd ed-Dabbî Ebû Ali el-Verrâk es-Sayrafî", 5, 238, "Kûfe"),
  N("hasanbdavudbmuhammedeb", "الحسن بن داود بن محمد أبو محمد المدني المنكدري", "Hasan b. Dâvûd b. Muhammed Ebû Muhammed el-Medenî", 5, 247, "Medine"),
  N("hasanbzeydbhasanebital", "الحسن بن زيد بن الحسن أبو محمد المدني", "Hasan b. Zeyd b. Hasan Ebû Muhammed el-Medenî", 5, 168, "Medine"),
  N("hasanbabdulaziz", "الحسن بن عبد العزيز بن الوزير الجروي", "Hasan b. Abdülazîz b. el-Vezîr", 5, 257, "Bağdat"),
  N("hasanbalibrasidsadevey", "الحسن بن علي بن راشد الواسطي", "Hasan b. Ali b. Râşid el-Vâsıtî", 5, 237, "Basra"),
  N("hasanbumareelbeceli", "الحسن بن عمارة البجلي", "Hasan b. Umâre el-Becelî", 5, 153, "Kûfe"),
  N("hasanbomerbsakikelcerm", "الحسن بن عمر بن شقيق الجرمي", "Hasan b. Ömer b. Şakīk el-Cermî", 5, 232, "Cibâl"),
  N("hasanbomer", "الحسن بن عمر", "Hasan b. Ömer", 5, 181, "Humus"),
  N("hasanbayyas", "الحسن بن عياش", "Hasan b. Ayyâş", 5, 172, "Kûfe"),
  N("hasanbisa", "الحسن بن عيسى بن ماسرجس", "Hasan b. Îsâ b. Mâserces", 5, 240, "Horasan"),
  N("hasanbkaza", "الحسن بن قزعة الهاشمي", "Hasan b. Kaz‘a", 5, 250, "Basra"),
  N("hasanbmuhammed", "الحسن بن محمد بن أعين الحراني أبو علي", "Hasan b. Muhammed b. A‘yen Ebû Ali", 5, 210, "Humus"),
  N("hasanbyahya", "الحسن بن يحيى بن السكن الرملي", "Hasan b. Yahyâ b. es-Seken er-Remlî", 5, 257, "Şam"),
  N("huseyinbelcuneyd", "الحسين بن الجنيد البغدادي", "Hüseyin b. el-Cüneyd", 5, 247, "Bağdat"),
  N("huseyinbhasanbharbessu", "الحسين بن الحسن بن حرب السلمي أبو عبد الله المروزي", "Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî", 5, 246, "Mekke"),
  N("huseyinbhasan", "الحسين بن الحسن الشيلماني", "Hüseyin b. Hasan", 5, 235, "Bağdat"),
  N("huseyinbalibhuseyinebi", "الحسين بن علي بن الحسين", "Hüseyin b. Ali b. Hüseyin", 5, 160, "Medine"),
  N("huseyinbmuhammedbeyyub", "الحسين بن محمد بن أيوب الذارع السعدي أبو علي البصري", "Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî", 5, 247, "Basra"),
  N("huseyinbyezidbyahya", "الحسين بن يزيد بن يحيى", "Hüseyin b. Yezîd b. Yahyâ", 5, 244, "Kûfe"),
  N("hafsbabdullahbrasidess", "حفص بن عبد الله بن راشد السلمي أبو عمرو النيسابوري", "Hafs b. Abdullah b. Râşid es-Sülemî Ebû Amr en-Nîsâbûrî", 5, 209, "Horasan"),
  N("hafsbabdirrahmanbomere", "حفص بن عبد الرحمن بن عمر أبو عمر البلخي الفقيه النيسابوري", "Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî", 5, 199, "Horasan"),
  N("hafsbmeysereelukayli", "حفص بن ميسرة العقيلي", "Hafs b. Meysere el-Ukaylî", 5, 181, "Yemen"),
  N("hakembebanebuisa", "الحكم بن أبان العدني أبو عيسى", "Hakem b. Ebân Ebû Îsâ", 5, 154, "Yemen"),
  N("hakembmusabebizuheyreb", "الحكم بن موسى بن أبي زهير البغدادي أبو صالح القنطري", "Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih", 5, 232, "Bağdat"),
  N("hakimbabdullahbkays", "حكيم بن عبد الله بن قيس", "Hakîm b. Abdullah b. Kays", 4, 118, "Mısır"),
  N("hammadbismailbuleyyeel", "حماد بن إسماعيل بن علية البصري", "Hammâd b. İsmâîl b. Uleyye el-Basrî", 5, 244, "Bağdat"),
  N("humeydbhaniebuhanielha", "حميد بن هانئ أبو هانئ الخولاني المصري", "Humeyd b. Hâni’ Ebû Hâni’ el-Havlânî el-Mısrî", 5, 142, "Mısır"),
  N("hayvebsureyhbyezidelha", "حيوة بن شريح بن يزيد الحضرمي أبو العباس الحمصي", "Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs", 5, 224, "Humus"),
  N("haricebabdullahbsuleym", "خارجة بن عبد الله بن سليمان أبو زيد المدني", "Hârice b. Abdullah b. Süleymân Ebû Zeyd el-Medenî", 5, 165, "Medine"),
  N("halidbelharisbubeydebu", "خالد بن الحارث بن عبيد أبو عثمان البصري", "Hâlid b. el-Hâris b. Ubeyd Ebû Osmân el-Basrî", 5, 186, "Basra"),
  N("halidbhumeyd", "خالد بن حميد المهري", "Hâlid b. Humeyd", 5, 169, "Mısır"),
  N("halidbhayyanebuyezidel", "خالد بن حيان الرقي أبو يزيد الكندي", "Hâlid b. Hayyân Ebû Yezîd el-Kindî", 5, 191, "Humus"),
  N("halidbziyadelezdiebuab", "خالد بن زياد الأزدي أبو عبد الرحمن الترمذي", "Hâlid b. Ziyâd el-Ezdî Ebû Abdirrahman", 5, 100, "Horasan"),
  N("halidbselemebelas", "خالد بن سلمة بن العاص", "Hâlid b. Seleme b. el-Âs", 5, 132, "Kûfe"),
  N("halidbukbeessekuniebuu", "خالد بن عقبة السكوني أبو عتبة الكوفي", "Hâlid b. Ukbe es-Sekûnî Ebû Utbe", 5, 247, "Kûfe"),
  N("halidbyezidbabdirrahma", "خالد بن يزيد بن عبد الرحمن", "Hâlid b. Yezîd b. Abdirrahman", 5, 185, "Şam"),
  N("halidbyezidbmuaviyeebi", "خالد بن يزيد بن معاوية أبو هاشم الدمشقي", "Hâlid b. Yezîd b. Muâviye Ebû Hâşim ed-Dımaşkī", 3, 90, "Şam"),
  N("halidbyezidelcumahi", "خالد بن يزيد الجمحي", "Hâlid b. Yezîd el-Cümahî", 5, 139, "Mısır"),
  N("elhidrbmuhammedbsucael", "الخضر بن محمد بن شجاع الجزري أبو مروان", "el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân", 5, 221, "Humus"),
  N("halefbeyyubelamiriebus", "خلف بن أيوب العامري أبو سعيد البلخي", "Halef b. Eyyûb el-Âmirî Ebû Saîd", 5, 215, "Horasan"),
  N("halefbtemim", "خلف بن تميم بن أبي عتاب أبو عبد الرحمن الكوفي", "Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman", 5, 206, "Kûfe"),
  N("halefbhalifebsaidelesc", "خلف بن خليفة بن صاعد الأشجعي", "Halef b. Halîfe b. Sâid el-Eşce‘î", 5, 181, "Kûfe"),
  N("halefbmuhammedbisa", "خلف بن محمد بن عيسى", "Halef b. Muhammed b. Îsâ", 5, 274, "Vâsıt"),
  N("halladbsuleymanelhadra", "خلاد بن سليمان الحضرمي أبو سليمان المصري", "Hallâd b. Süleymân el-Hadramî Ebû Süleymân el-Mısrî", 5, 178, "Mısır"),
  N("halladbyezidelcufi", "خلاد بن يزيد الجعفي الكوفي", "Hallâd b. Yezîd el-Cu‘fî", 5, 220, "Kûfe"),
  N("halladbyezidbhabibette", "خلاد بن يزيد بن حبيب التميمي البصري", "Hallâd b. Yezîd b. Habîb et-Temîmî el-Basrî", 5, 214, "Mısır"),
  N("davudbamrbzuheyr", "داود بن عمرو بن زهير أبو سليمان البغدادي", "Dâvûd b. Amr b. Züheyr Ebû Süleymân", 5, 228, "Bağdat"),
  N("davudbyezidbabdirrahma", "داود بن يزيد بن عبد الرحمن الأودي الزعافري", "Dâvûd b. Yezîd b. Abdirrahman el-Evdî", 5, 151, "Kûfe"),
  N("rasidbsaidbrasidebubek", "راشد بن سعيد بن راشد القرشي أبو بكر الرملي", "Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî", 5, 243, "Şam"),
  N("rebahbzeyd", "رباح بن زيد القرشي", "Rebâh b. Zeyd", 5, 187, "Yemen"),
  N("rebahbabdirrahmanbebis", "رباح بن عبد الرحمن بن أبي سفيان أبو بكر الحويطبي المدني", "Rebâh b. Abdirrahman b. Ebî Süfyân Ebû Bekir el-Medenî", 5, 132, "Medine"),
  N("rabibsuleymanbdavudebu", "الربيع بن سليمان بن داود الجيزي أبو محمد الأزدي الأعرج", "Rabî‘ b. Süleymân b. Dâvûd Ebû Muhammed el-Ezdî el-A‘rec", 5, 256, "Mısır"),
  N("rabibmuslimelcumahiebu", "الربيع بن مسلم الجمحي أبو بكر البصري", "Rabî‘ b. Müslim el-Cümahî Ebû Bekir el-Basrî", 5, 167, "Basra"),
  N("rabibnafi", "الربيع بن نافع أبو توبة الحلبي", "Rabî‘ b. Nâfi‘ Ebû Tevbe", 5, 241, "Humus"),
  N("rabibyahyabmiksem", "الربيع بن يحيى بن مقسم الأشناني", "Rabî‘ b. Yahyâ b. Miksem", 5, 224, "Basra"),
  N("rebiabseyf", "ربيعة بن سيف بن ماتع", "Rebîa b. Seyf b. Mâti‘", 4, 120, "Mısır"),
  N("ruhbeslemelbahiliebuha", "روح بن أسلم الباهلي أبو حاتم البصري", "Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî", 5, 200, "Basra"),
  N("ruhbkasimettemimielanb", "روح بن القاسم التميمي العنبري أبو غياث", "Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs", 5, 141, "Basra"),
  N("zekeriyyabyahyabiyas", "زكريا بن يحيى بن إياس", "Zekeriyyâ b. Yahyâ b. İyâs", 6, 289, "Şam"),
  N("zekeriyyabyahyabsalihe", "زكريا بن يحيى بن صالح القضاعي أبو يحيى المصري", "Zekeriyyâ b. Yahyâ b. Sâlih Ebû Yahyâ el-Mısrî", 5, 242, "Mısır"),
  N("zekeriyyabyahyabomer", "زكريا بن يحيى بن عمر أبو السكين", "Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn", 5, 201, "Kûfe"),
  N("zuheyrbharbbseddad", "زهير بن حرب بن شداد أبو خثيمة النسائي", "Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî", 5, 234, "Bağdat"),
  N("zuheyrbmuhammed", "زهير بن محمد بن قمير", "Züheyr b. Muhammed b. Kumeyr", 5, 258, "Bağdat"),
  N("ziyadbeyyubbziyadebuha", "زياد بن أيوب بن زياد البغدادي أبو هاشم", "Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim", 5, 252, "Bağdat"),
  N("ziyadbrabi", "زياد بن الربيع اليحمدي", "Ziyâd b. Rabî‘", 5, 185, "Basra"),
  N("ziyadbrebiabnuaym", "زياد بن ربيعة بن نعيم", "Ziyâd b. Rebîa b. Nuaym", 3, 95, "Mısır"),
  N("ziyadbebiziyadmeyseree", "زياد بن أبي زياد ميسرة المخزومي المدني", "Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî", 5, 135, "Medine"),
  N("ziyadbyunusbsaidelhadr", "زياد بن يونس بن سعيد الحضرمي أبو سلامة الإسكندراني", "Ziyâd b. Yûnus b. Saîd el-Hadramî Ebû Selâme", 5, 211, "Mısır"),
  N("zeydbhasanbaliebitalib", "زيد بن الحسن بن علي", "Zeyd b. Hasan b. Ali", 4, 120, "Medine"),
  N("zeydbalibhuseyinebital", "زيد بن علي بن الحسين أبو الحسين المدني", "Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî", 4, 122, "Medine"),
  N("zeydbyahyabubeydelhuza", "زيد بن يحيى بن عبيد الخزاعي أبو عبد الله الدمشقي", "Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī", 5, 207, "Şam"),
  N("salimbabdullah", "سالم بن عبد الله النصري", "Sâlim b. Abdullah", 3, 110, "Medine"),
  N("salimbaclan", "سالم بن عجلان", "Sâlim b. Aclân", 5, 132, "Humus"),
  N("sadbibrahimbsadebuisha", "سعد بن إبراهيم بن سعد أبو إسحاق البغدادي", "Sa‘d b. İbrâhim b. Sa‘d Ebû İshak", 5, 201, "Bağdat"),
  N("sadbabdulhamidbcafereb", "سعد بن عبد الحميد بن جعفر أبو معاذ المدني", "Sa‘d b. Abdülhamîd b. Ca‘fer Ebû Muâz el-Medenî", 5, 219, "Bağdat"),
  N("saidbevsbsabitebuzeyde", "سعيد بن أوس بن ثابت أبو زيد الأنصاري النحوي", "Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî", 5, 214, "Basra"),
  N("saidbhafsbamr", "سعيد بن حفص بن عمرو", "Saîd b. Hafs b. Amr", 5, 237, "Humus"),
  N("saidbhakembmuhammed", "سعيد بن الحكم بن محمد", "Saîd b. Hakem b. Muhammed", 5, 224, "Mısır"),
  N("saidbzekeriyya", "سعيد بن زكريا", "Saîd b. Zekeriyyâ", 5, 207, "Mısır"),
  N("saidbabdirrahmanelcuma", "سعيد بن عبد الرحمن الجمحي", "Saîd b. Abdirrahman el-Cümahî", 5, 176, "Medine"),
  N("saidbabdirrahmanbabdul", "سعيد بن عبد الرحمن بن عبد الله الزبيدي", "Saîd b. Abdirrahman b. Abdullah ez-Zübeydî", 5, 156, "Kûfe"),
  N("saidbamrbsehlelkindieb", "سعيد بن عمرو بن سهل الكندي الأشعثي أبو عثمان", "Saîd b. Amr b. Sehl el-Kindî Ebû Osmân", 5, 230, "Kûfe"),
  N("saidbkesir", "سعيد بن كثير بن عفير", "Saîd b. Kesîr b. Ufeyr", 5, 226, "Mısır"),
  N("saidbmervanbaliebuosma", "سعيد بن مروان بن علي أبو عثمان البغدادي", "Saîd b. Mervân b. Ali Ebû Osmân", 5, 252, "Horasan"),
  N("saidbnadrebuosman", "سعيد بن النضر البغدادي أبو عثمان", "Saîd b. Nadr Ebû Osmân", 5, 234, "Bağdat"),
  N("saidbhanielhavlaniebuo", "سعيد بن هانئ الخولاني أبو عثمان المصري", "Saîd b. Hâni’ el-Havlânî Ebû Osmân el-Mısrî", 3, 127, "Mısır"),
  N("saidbyahyabsaidebuosma", "سعيد بن يحيى بن سعيد أبو عثمان البغدادي", "Saîd b. Yahyâ b. Saîd Ebû Osmân", 5, 249, "Bağdat"),
  N("saidbyahyabmehdiebusuf", "سعيد بن يحيى بن مهدي أبو سفيان الحميري الحذاء الواسطي", "Saîd b. Yahyâ b. Mehdî Ebû Süfyân el-Hazzâ el-Vâsıtî", 5, 202, "Vâsıt"),
  N("selemebsuleymanelmerve", "سلمة بن سليمان المروزي أبو سليمان", "Seleme b. Süleymân el-Mervezî Ebû Süleymân", 5, 203, "Horasan"),
  N("selemebalkameettemimie", "سلمة بن علقمة التميمي أبو بشر البصري", "Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî", 5, 139, "Basra"),
  N("suleymbcubeyrebuyunuse", "سليم بن جبير الدوسي أبو يونس المصري", "Süleym b. Cübeyr Ebû Yûnus el-Mısrî", 3, 123, "Mısır"),
  N("suleymbamir", "سليم بن عامر الكلاعي", "Süleym b. Âmir", 3, 130, "Humus"),
  N("suleymanbeyyubbsuleyma", "سليمان بن أيوب بن سليمان أبو أيوب الدمشقي", "Süleymân b. Eyyûb b. Süleymân Ebû Eyyûb ed-Dımaşkī", 6, 289, "Şam"),
  N("suleymanbeyyubbsuleyma2", "سليمان بن أيوب بن سليمان أبو أيوب", "Süleymân b. Eyyûb b. Süleymân Ebû Eyyûb", 5, 235, "Basra"),
  N("suleymanbbureydebelhas", "سليمان بن بريدة بن الحصيب الأسلمي المروزي", "Süleymân b. Büreyde b. el-Hasıyb el-Mervezî", 3, 105, "Horasan"),
  N("suleymanbdavud", "سليمان بن داود بن رشيد البغدادي الأحول أبو الربيع الختلي", "Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘", 5, 231, "Bağdat"),
  N("suleymanbdavudeburabie", "سليمان بن داود العتكي أبو الربيع الزهراني", "Süleymân b. Dâvûd Ebû Rabî‘", 5, 234, "Bağdat"),
  N("suleymanbsuleymebusele", "سليمان بن سليم الكلبي أبو سلمة الشامي", "Süleymân b. Süleym Ebû Seleme eş-Şâmî", 5, 147, "Şam"),
  N("suleymanbseyfbyahya", "سليمان بن سيف بن يحيى", "Süleymân b. Seyf b. Yahyâ", 5, 272, "Humus"),
  N("suleymanbabdullahbmuha", "سليمان بن عبد الله بن محمد أبو أيوب", "Süleymân b. Abdullah b. Muhammed Ebû Eyyûb", 5, 263, "Humus"),
  N("suleymanbabdulhamidbra", "سليمان بن عبد الحميد بن رافع البهراني أبو أيوب الحمصي", "Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb", 5, 274, "Humus"),
  N("suleymanbabdirrahmanbh", "سليمان بن عبد الرحمن بن حماد أبو داود التمار الكوفي", "Süleymân b. Abdirrahman b. Hammâd Ebû Dâvûd et-Temmâr", 5, 252, "Kûfe"),
  N("suleymanbabdirrahmanbi", "سليمان بن عبد الرحمن بن عيسى التميمي الدمشقي أبو أيوب", "Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb", 5, 233, "Şam"),
  N("suleymanbmabed", "سليمان بن معبد بن كوسجان", "Süleymân b. Ma‘bed b. Kevsecân", 5, 257, "Horasan"),
  N("sinanbebisinanelmedeni", "سنان بن أبي سنان الديلي المدني", "Sinân b. Ebî Sinân el-Medenî", 3, 105, "Medine"),
  N("sehlbeslemeladevi", "سهل بن أسلم العدوي", "Sehl b. Eslem el-Adevî", 5, 181, "Basra"),
  N("sehlbosmanbfariselkind", "سهل بن عثمان بن فارس الكندي أبو مسعود العسكري", "Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd", 5, 235, "Cibâl"),
  N("sehlbmuhammedbezzubeyr", "سهل بن محمد بن الزبير العسكري", "Sehl b. Muhammed b. ez-Zübeyr", 5, 227, "Basra"),
  N("sehlbmuhammedbosmanebu", "سهل بن محمد بن عثمان أبو حاتم السجستاني النحوي", "Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî", 5, 255, "Basra"),
  N("sehlbyusufelbasri", "سهل بن يوسف الأنماطي البصري", "Sehl b. Yûsuf el-Basrî", 5, 190, "Basra"),
  N("sevvarbabdullahbsevvar", "سوار بن عبد الله بن سوار أبو عبد الله البصري", "Sevvâr b. Abdullah b. Sevvâr Ebû Abdullah el-Basrî", 5, 245, "Basra"),
  N("suveydbabdulazizbnumey", "سويد بن عبد العزيز بن نمير السلمي", "Süveyd b. Abdülazîz b. Nümeyr es-Sülemî", 5, 194, "Şam"),
  N("suveydbnasrbsuveydelme", "سويد بن نصر بن سويد المروزي أبو الفضل", "Süveyd b. Nasr b. Süveyd el-Mervezî Ebû Fazl", 5, 240, "Horasan"),
  N("sellambsuleymanelmuzen", "سلام بن سليمان المزني أبو المنذر", "Sellâm b. Süleymân el-Müzenî Ebû Münzir", 5, 171, "Kûfe"),
  N("sucabmahledelfellasebu", "شجاع بن مخلد الفلاس أبو الفضل البغوي", "Şücâ‘ b. Mahled el-Fellâs Ebû Fazl", 5, 235, "Bağdat"),
  N("suaybbharbelmedainiebu", "شعيب بن حرب المدائني أبو صالح", "Şuayb b. Harb el-Medâinî Ebû Sâlih", 5, 197, "Mekke"),
  N("suaybbleysbsad", "شعيب بن الليث بن سعد الفهمي", "Şuayb b. Leys b. Sa‘d", 5, 199, "Mısır"),
  N("sakikbsevr", "شقيق بن ثور بن عفير السدوسي أبو الفضل البصري", "Şakīk b. Sevr b. Ufeyr es-Sedûsî Ebû Fazl el-Basrî", 2, 64, "Basra"),
  N("sihabbabbadelabdiebuom", "شهاب بن عباد العبدي أبو عمر الكوفي", "Şihâb b. Abbâd el-Abdî Ebû Ömer", 5, 224, "Kûfe"),
  N("seybanbabdirrahmanette", "شيبان بن عبد الرحمن التميمي", "Şeybân b. Abdirrahman et-Temîmî", 5, 164, "Kûfe"),
  N("salihbhatim", "صالح بن حاتم بن وردان البصري أبو محمد", "Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed", 5, 236, "Basra"),
  N("sadakababdullah", "صدقة بن عبد الله", "Sadaka b. Abdullah", 5, 166, "Şam"),
  N("safvanbsuleymelmedenie", "صفوان بن سليم المدني أبو عبد الله", "Safvân b. Süleym el-Medenî Ebû Abdullah", 4, 132, "Medine"),
  N("damrabhabibbsuheybezzu", "ضمرة بن حبيب بن صهيب الزبيدي", "Damra b. Habîb b. Suheyb ez-Zübeydî", 4, 130, "Humus"),
  N("talhabebisaidebuabdulm", "طلحة بن أبي سعيد الإسكندراني أبو عبد الملك القرشي", "Talha b. Ebî Saîd Ebû Abdülmelik", 5, 157, "Mısır"),
  N("talhababdullahbavfezzu", "طلحة بن عبد الله بن عوف الزهري المدني", "Talha b. Abdullah b. Avf ez-Zührî el-Medenî", 3, 97, "Medine"),
  N("talhabamrbosmanelhadra", "طلحة بن عمرو بن عثمان الحضرمي المكي", "Talha b. Amr b. Osmân el-Hadramî el-Mekkî", 5, 152, "Mekke"),
  N("talhabyahyabtalha", "طلحة بن يحيى بن طلحة", "Talha b. Yahyâ b. Talha", 5, 148, "Kûfe"),
  N("asimbyusufebuamr", "عاصم بن يوسف اليربوعي أبو عمرو", "Âsım b. Yûsuf Ebû Amr", 5, 220, "Kûfe"),
  N("amirbsadbebivakkasezzu", "عامر بن سعد بن أبي وقاص الزهري المدني", "Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî", 3, 104, "Medine"),
  N("amirbabdullahbezzubeyr", "عامر بن عبد الله بن الزبير أبو الحارث المدني", "Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî", 4, 121, "Medine"),
  N("abbadbmusa", "عباد بن موسى الختلي", "Abbâd b. Mûsâ", 5, 230, "Bağdat"),
  N("abbadbyusufelkindiebuo", "عباد بن يوسف الكندي أبو عثمان الحمصي", "Abbâd b. Yûsuf el-Kindî Ebû Osmân", 5, 206, "Humus"),
  N("abbasbcaferbabdullah", "عباس بن جعفر بن عبد الله أبو محمد بن أبي طالب", "Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib", 5, 258, "Bağdat"),
  N("abbasbhasan", "عباس بن الحسن", "Abbâs b. Hasan", 5, 258, "Bağdat"),
  N("abbasbosmanbmuhammedel", "عباس بن عثمان بن محمد البجلي أبو الفضل الدمشقي المعلم", "Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim", 5, 239, "Şam"),
  N("abbasbmuhammedbhatimeb", "عباس بن محمد بن حاتم الدوري أبو الفضل البغدادي", "Abbâs b. Muhammed b. Hâtim Ebû Fazl", 5, 271, "Bağdat"),
  N("abbasbelvelid", "عباس بن الوليد بن صبح", "Abbâs b. el-Velîd b. Subh", 5, 248, "Şam"),
  N("abdullahbahmedbabdulla", "عبد الله بن أحمد بن عبد الله أبو حصين", "Abdullah b. Ahmed b. Abdullah Ebû Husayn", 5, 248, "Kûfe"),
  N("abdullahbishakelbasri", "عبد الله بن إسحاق الجوهري البصري", "Abdullah b. İshak el-Basrî", 5, 257, "Basra"),
  N("abdullahbebibekirbmuha", "عبد الله بن أبي بكر بن محمد", "Abdullah b. Ebî Bekir b. Muhammed", 5, 135, "Medine"),
  N("abdullahbcaferbabdirra", "عبد الله بن جعفر بن عبد الرحمن أبو محمد المدني المخرمي", "Abdullah b. Ca‘fer b. Abdirrahman Ebû Muhammed el-Medenî", 5, 170, "Medine"),
  N("abdullahbcaferbgaylan", "عبد الله بن جعفر بن غيلان", "Abdullah b. Ca‘fer b. Gaylân", 5, 220, "Humus"),
  N("abdullahbdavudbamirelh", "عبد الله بن داود بن عامر الهمداني أبو عبد الرحمن الخريبي", "Abdullah b. Dâvûd b. Âmir el-Hemdânî Ebû Abdirrahman", 5, 213, "Mâverâünnehir"),
  N("abdullahbebizekeriyyae", "عبد الله بن أبي زكريا الخزاعي أبو يحيى الشامي", "Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî", 4, 119, "Şam"),
  N("abdullahbzeydbeslemela", "عبد الله بن زيد بن أسلم العدوي", "Abdullah b. Zeyd b. Eslem el-Adevî", 5, 164, "Medine"),
  N("abdullahbsalimelesarie", "عبد الله بن سالم الأشعري أبو يوسف الحمصي", "Abdullah b. Sâlim el-Eş‘arî Ebû Yûsuf", 5, 179, "Humus"),
  N("abdullahbsalim", "عبد الله بن سالم", "Abdullah b. Sâlim", 5, 235, "Kûfe"),
  N("abdullahbsaibbyezidelk", "عبد الله بن السائب بن يزيد الكندي أبو محمد المدني", "Abdullah b. Sâib b. Yezîd el-Kindî Ebû Muhammed el-Medenî", 4, 126, "Medine"),
  N("abdullahbsadbibrahim", "عبد الله بن سعد بن إبراهيم", "Abdullah b. Sa‘d b. İbrâhim", 5, 238, "Mâverâünnehir"),
  N("abdullahbsuleymelcezer", "عبد الله بن سليم الجزري أبو عبد الرحمن الرقي", "Abdullah b. Süleym el-Cezerî Ebû Abdirrahman", 5, 213, "Humus"),
  N("abdullahbsuleymanbzura", "عبد الله بن سليمان بن زرعة الحميري أبو حمزة البصري الطويل", "Abdullah b. Süleymân b. Zür‘a Ebû Hamza el-Basrî et-Tavîl", 5, 136, "Basra"),
  N("abdullahbsuveydbhayyan", "عبد الله بن سويد بن حيان", "Abdullah b. Süveyd b. Hayyân", 5, 102, "Mısır"),
  N("abdullahbsalihbmuhamme", "عبد الله بن صالح بن محمد أبو صالح المصري", "Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî", 5, 222, "Mısır"),
  N("abdullahbamirbzurareel", "عبد الله بن عامر بن زرارة الحضرمي", "Abdullah b. Âmir b. Zürâre el-Hadramî", 5, 237, "Kûfe"),
  N("abdullahbamirbyezid", "عبد الله بن عامر بن يزيد", "Abdullah b. Âmir b. Yezîd", 3, 118, "Şam"),
  N("abdullahbabdullahbuvey", "عبد الله بن عبد الله بن أويس أبو أويس المدني", "Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî", 5, 167, "Medine"),
  N("abdullahbabdullahbelha", "عبد الله بن عبد الله بن الحارث أبو يحيى المدني", "Abdullah b. Abdullah b. el-Hâris Ebû Yahyâ el-Medenî", 3, 99, "Medine"),
  N("abdullahbabdullahbebit", "عبد الله بن عبد الله بن أبي طلحة الأنصاري أبو يحيى المدني", "Abdullah b. Abdullah b. Ebî Talha el-Ensârî Ebû Yahyâ el-Medenî", 4, 134, "Medine"),
  N("abdullahbabdirrahmanbf", "عبد الله بن عبد الرحمن بن الفضل أبو محمد الدارمي الحافظ", "Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız", 5, 255, "Mâverâünnehir"),
  N("abdullahbabdirrahmanel", "عبد الله بن عبد الرحمن البصري بن الرومي", "Abdullah b. Abdirrahman el-Basrî b. er-Rûmî", 4, 130, "Basra"),
  N("abdullahbabdussamed", "عبد الله بن عبد الصمد بن أبي خداش", "Abdullah b. Abdüssamed b. Ebî Hıdâş", 5, 255, "Humus"),
  N("abdullahbubeyd", "عبد الله بن عبيد", "Abdullah b. Ubeyd", 3, 113, "Mekke"),
  N("abdullahbosmanbcebele", "عبد الله بن عثمان بن جبلة", "Abdullah b. Osmân b. Cebele", 5, 221, "Horasan"),
  N("abdullahbomerbabdirrah", "عبد الله بن عمر بن عبد الرحمن", "Abdullah b. Ömer b. Abdirrahman", 5, 236, "Basra"),
  N("abdullahbomerbmuhammed", "عبد الله بن عمر بن محمد", "Abdullah b. Ömer b. Muhammed", 5, 239, "Kûfe"),
  N("abdullahbimran", "عبد الله بن عمران بن رزين", "Abdullah b. İmrân b. Rezîn", 5, 245, "Mekke"),
  N("abdullahbavnbebiavnbye", "عبد الله بن عون بن أبي عون", "Abdullah b. Avn b. Ebî Avn", 5, 232, "Bağdat"),
  N("abdullahbala", "عبد الله بن العلاء بن زبر", "Abdullah b. Alâ b. Zebr", 5, 164, "Şam"),
  N("abdullahbayyas", "عبد الله بن عياش", "Abdullah b. Ayyâş", 5, 170, "Mısır"),
  N("abdullahbisababdirrahm", "عبد الله بن عيسى بن عبد الرحمن أبو محمد الكوفي", "Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed", 5, 130, "Kûfe"),
  N("abdullahbgalib", "عبد الله بن غالب الحداني", "Abdullah b. Gālib", 3, 83, "Basra"),
  N("abdullahbferruhelhoras", "عبد الله بن فروخ الخراساني", "Abdullah b. Ferrûh el-Horâsânî", 5, 175, "Horasan"),
  N("abdullahbkesireddariel", "عبد الله بن كثير الداري المكي أبو معبد", "Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed", 5, 120, "Mekke"),
  N("abdullahbkesireddimask", "عبد الله بن كثير الدمشقي الطويل", "Abdullah b. Kesîr ed-Dımaşkī et-Tavîl", 5, 196, "Şam"),
  N("abdullahbkuleybbkeysan", "عبد الله بن كليب بن كيسان المرادي أبو عبد الملك المصري", "Abdullah b. Küleyb b. Keysân Ebû Abdülmelik el-Mısrî", 5, 193, "Mısır"),
  N("abdullahbelmubarekelme", "عبد الله بن المبارك المروزي", "Abdullah b. el-Mübârek el-Mervezî", 5, 181, "Horasan"),
  N("abdullahbmuhammedbesma", "عبد الله بن محمد بن أسماء أبو عبيد الضبعي", "Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî", 5, 231, "Basra"),
  N("abdullahbmuhammedbebie", "عبد الله بن محمد بن أبي الأسود البصري أبو بكر", "Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir", 5, 223, "Basra"),
  N("abdullahbmuhammedbabdu2", "عبد الله بن محمد بن عبد الله", "Abdullah b. Muhammed b. Abdullah", 5, 190, "Medine"),
  N("abdullahbmuhammedbubey", "عبد الله بن محمد بن عبيد", "Abdullah b. Muhammed b. Ubeyd", 6, 281, "Bağdat"),
  N("abdullahbmuhammedbali", "عبد الله بن محمد بن علي", "Abdullah b. Muhammed b. Ali", 5, 234, "Humus"),
  N("abdullahbmuhammedelyem", "عبد الله بن محمد اليمامي", "Abdullah b. Muhammed el-Yemâmî", 5, 236, "Bağdat"),
  N("abdullahbmahled", "عبد الله بن مخلد", "Abdullah b. Mahled", 5, 260, "Horasan"),
  N("abdullahbelmuseyyeb", "عبد الله بن المسيب القرشي", "Abdullah b. el-Müseyyeb", 5, 170, "Mısır"),
  N("abdullahbmutibrasidebu", "عبد الله بن مطيع بن راشد البكري أبو محمد النيسابوري", "Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî", 5, 237, "Bağdat"),
  N("abdullahbmuaviyebmusae", "عبد الله بن معاوية بن موسى الجمحي أبو جعفر البصري", "Abdullah b. Muâviye b. Mûsâ el-Cümahî Ebû Ca‘fer el-Basrî", 5, 243, "Basra"),
  N("abdullahbmakil", "عبد الله بن معقل", "Abdullah b. Ma‘kıl", 3, 88, "Kûfe"),
  N("abdullahbnafimevlabome", "عبد الله بن نافع", "Abdullah b. Nâfi‘", 5, 154, "Medine"),
  N("abdullahbheysembosman", "عبد الله بن الهيثم بن عثمان", "Abdullah b. Heysem b. Osmân", 5, 261, "Basra"),
  N("abdullahbvakidbabdulla", "عبد الله بن واقد بن عبد الله", "Abdullah b. Vâkid b. Abdullah", 4, 119, "Medine"),
  N("abdullahbvakidebukatad", "عبد الله بن واقد الحراني أبو قتادة", "Abdullah b. Vâkid Ebû Katâde", 5, 210, "Humus"),
  N("abdullahbelvelidbkayse", "عبد الله بن الوليد بن قيس التجيبي المصري", "Abdullah b. el-Velîd b. Kays et-Tüceybî el-Mısrî", 5, 131, "Mısır"),
  N("abdulalabvasilbabdulal", "عبد الأعلى بن واصل بن عبد الأعلى الأسدي الكوفي", "Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî", 5, 247, "Kûfe"),
  N("abdulhamidbsalihbaclan", "عبد الحميد بن صالح بن عجلان البرجمي", "Abdülhamîd b. Sâlih b. Aclân", 5, 230, "Kûfe"),
  N("abdulhamidbabdirrahman", "عبد الحميد بن عبد الرحمن الحماني", "Abdülhamîd b. Abdirrahman", 5, 202, "Kûfe"),
  N("abdulhamidbmuhammed", "عبد الحميد بن محمد بن المستام", "Abdülhamîd b. Muhammed b. el-Müstâm", 5, 266, "Humus"),
  N("abdirrahmanbibrahimbam", "عبد الرحمن بن إبراهيم بن عمرو العثماني", "Abdirrahman b. İbrâhim b. Amr", 5, 245, "Şam"),
  N("abdirrahmanbbekirbrabi", "عبد الرحمن بن بكر بن الربيع", "Abdirrahman b. Bekir b. Rabî‘", 5, 230, "Basra"),
  N("abdirrahmanbsabitbsevb", "عبد الرحمن بن ثابت بن ثوبان العنسي", "Abdirrahman b. Sâbit b. Sevbân", 5, 165, "Şam"),
  N("abdirrahmanbcubeyr", "عبد الرحمن بن جبير", "Abdirrahman b. Cübeyr", 4, 118, "Humus"),
  N("abdirrahmanbelharisbab", "عبد الرحمن بن الحارث بن عبد الله", "Abdirrahman b. el-Hâris b. Abdullah", 5, 143, "Medine"),
  N("abdirrahmanbhammad", "عبد الرحمن بن حماد بن شعيث", "Abdirrahman b. Hammâd b. Şuays", 5, 212, "Basra"),
  N("abdirrahmanbhumeydbabd", "عبد الرحمن بن حميد بن عبد الرحمن", "Abdirrahman b. Humeyd b. Abdirrahman", 5, 137, "Medine"),
  N("abdirrahmanbserikbabdu", "عبد الرحمن بن شريك بن عبد الله النخعي الكوفي", "Abdirrahman b. Şerîk b. Abdullah en-Nehaî", 5, 227, "Kûfe"),
  N("abdirrahmanbabis", "عبد الرحمن بن عابس", "Abdirrahman b. Âbis", 4, 119, "Kûfe"),
  N("abdirrahmanbabdullahbu", "عبد الرحمن بن عبد الله بن عبيد البصري أبو سعيد", "Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd", 5, 197, "Mekke"),
  N("abdirrahmanbabdullahbo", "عبد الرحمن بن عبد الله بن عمر أبو القاسم المدني العمري", "Abdirrahman b. Abdullah b. Ömer Ebû Kâsım el-Medenî", 5, 186, "Bağdat"),
  N("abdirrahmanbabdullahbm", "عبد الرحمن بن عبد الله بن مسعود الهذلي الكوفي", "Abdirrahman b. Abdullah b. Mes‘ûd", 2, 79, "Kûfe"),
  N("abdirrahmanbabdulhamid", "عبد الرحمن بن عبد الحميد بن سالم المهري", "Abdirrahman b. Abdülhamîd b. Sâlim", 5, 192, "Mısır"),
  N("abdirrahmanbabdulazizb", "عبد الرحمن بن عبد العزيز بن عبد الله أبو محمد المدني الأمامي", "Abdirrahman b. Abdülazîz b. Abdullah Ebû Muhammed el-Medenî", 5, 162, "Medine"),
  N("abdirrahmanbabdulmelik", "عبد الرحمن بن عبد الملك بن سعيد", "Abdirrahman b. Abdülmelik b. Saîd", 5, 181, "Kûfe"),
  N("abdirrahmanbata", "عبد الرحمن بن عطاء القرشي", "Abdirrahman b. Atâ", 5, 143, "Medine"),
  N("abdirrahmanbomerbyezid", "عبد الرحمن بن عمر بن يزيد أبو الحسن الأصبهاني", "Abdirrahman b. Ömer b. Yezîd Ebû Hasan", 5, 250, "Cibâl"),
  N("abdirrahmanbamr", "عبد الرحمن بن عمرو بن عبسة السلمي الشامي", "Abdirrahman b. Amr b. Abese es-Sülemî eş-Şâmî", 3, 110, "Şam"),
  N("abdirrahmanbkasimbhali", "عبد الرحمن بن القاسم بن خالد", "Abdirrahman b. Kâsım b. Hâlid", 5, 191, "Mısır"),
  N("abdirrahmanbmuhammedbz", "عبد الرحمن بن محمد بن زياد المحاربي أبو محمد الكوفي", "Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed", 5, 195, "Kûfe"),
  N("abdirrahmanbmuaviye", "عبد الرحمن بن معاوية بن حديج", "Abdirrahman b. Muâviye b. Hudeyc", 3, 95, "Mısır"),
  N("abdirrahmanbmeysereelh", "عبد الرحمن بن ميسرة الحضرمي أبو ميسرة المصري", "Abdirrahman b. Meysere el-Hadramî Ebû Meysere el-Mısrî", 5, 188, "Mısır"),
  N("abdirrahmanbvakidbmusl", "عبد الرحمن بن واقد بن مسلم البغدادي أبو مسلم الواقدي", "Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer", 5, 247, "Bağdat"),
  N("abdusselambsuayb", "عبد السلام بن شعيب بن الحبحاب البصري", "Abdüsselâm b. Şuayb b. el-Habhâb el-Basrî", 5, 184, "Basra"),
  N("abdusselambatik", "عبد السلام بن عتيق العنسي", "Abdüsselâm b. Atîk", 5, 257, "Şam"),
  N("abdussamedbmakilbmuneb", "عبد الصمد بن معقل بن منبه اليماني", "Abdüssamed b. Ma‘kıl b. Münebbih", 5, 183, "Yemen"),
  N("abdulazizbebanbmuhamme", "عبد العزيز بن أبان بن محمد أبو خالد الكوفي", "Abdülazîz b. Ebân b. Muhammed Ebû Hâlid", 5, 207, "Bağdat"),
  N("abdulazizbelhattabebuh", "عبد العزيز بن الخطاب الكوفي أبو الحسن", "Abdülazîz b. el-Hattâb Ebû Hasan", 5, 224, "Basra"),
  N("abdulazizbyahyabyusuf", "عبد العزيز بن يحيى بن يوسف البكائي أبو الأصبغ الحراني", "Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ", 5, 235, "Humus"),
  N("abdulkerimbmuhammedelk", "عبد الكريم بن محمد الجرجاني القاضي", "Abdülkerîm b. Muhammed el-Kādî", 5, 100, "Cibâl"),
  N("abdulmelikbsuaybbleys", "عبد الملك بن شعيب بن الليث", "Abdülmelik b. Şuayb b. Leys", 5, 248, "Mısır"),
  N("abdulmelikbabdulhamidb", "عبد الملك بن عبد الحميد بن عبد الحميد", "Abdülmelik b. Abdülhamîd b. Abdülhamîd", 5, 274, "Humus"),
  N("abdulmelikbmervanbkari", "عبد الملك بن مروان بن قارظ", "Abdülmelik b. Mervân b. Kâriz", 5, 250, "Basra"),
  N("abdulmelikbyesarelmede", "عبد الملك بن يسار الهلالي المدني", "Abdülmelik b. Yesâr el-Medenî", 3, 110, "Medine"),
  N("abdulvahidbebiavnelmed", "عبد الواحد بن أبي عون المدني", "Abdülvâhid b. Ebî Avn el-Medenî", 5, 144, "Medine"),
  N("abdulvahidbvasilessedu", "عبد الواحد بن واصل السدوسي", "Abdülvâhid b. Vâsıl es-Sedûsî", 5, 190, "Bağdat"),
  N("abdulvehhabbeddahhakbe", "عبد الوهاب بن الضحاك بن أبان العرضي", "Abdülvehhâb b. ed-Dahhâk b. Ebân", 5, 245, "Humus"),
  N("abdulvehhabbabdulmecid", "عبد الوهاب بن عبد المجيد بن الصلت الثقفي أبو محمد البصري", "Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî", 5, 194, "Basra"),
  N("abdebsuleymanelbasri", "عبدة بن سليمان البصري", "Abde b. Süleymân el-Basrî", 6, 273, "Mısır"),
  N("ubeydbhuneyn", "عبيد بن حنين", "Ubeyd b. Huneyn", 3, 105, "Medine"),
  N("ubeydebbilalelammi", "عبيدة بن بلال العمي", "Ubeyde b. Bilâl el-Ammî", 5, 160, "Mâverâünnehir"),
  N("utbebabdullahbutbeebua", "عتبة بن عبد الله بن عتبة اليحمدي أبو عبد الله المروزي", "Utbe b. Abdullah b. Utbe Ebû Abdullah el-Mervezî", 5, 244, "Horasan"),
  N("osmanbhakemelmisri", "عثمان بن الحكم الجذامي المصري", "Osmân b. Hakem el-Mısrî", 5, 163, "Mısır"),
  N("osmanbhakim", "عثمان بن حكيم بن ذبيان الأودي أبو عمر الكوفي", "Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer", 5, 219, "Kûfe"),
  N("osmanbsaidbkesir", "عثمان بن سعيد بن كثير", "Osmân b. Saîd b. Kesîr", 5, 209, "Humus"),
  N("osmanbsalihbsaid", "عثمان بن صالح بن سعيد", "Osmân b. Sâlih b. Saîd", 5, 256, "Bağdat"),
  N("osmanbsalihbsafvan", "عثمان بن صالح بن صفوان السهمي", "Osmân b. Sâlih b. Safvân", 5, 219, "Mısır"),
  N("osmanbabdullahbabdulla", "عثمان بن عبد الله بن عبد الله أبو عبد الله المدني", "Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî", 3, 118, "Medine"),
  N("osmanbmuslim", "عثمان بن مسلم البتي", "Osmân b. Müslim", 5, 143, "Basra"),
  N("adibadi", "عدي بن عدي بن عميرة", "Adî b. Adî b. Umeyra", 4, 120, "Humus"),
  N("adibfazletteymiebuhati", "عدي بن الفضل التيمي أبو حاتم البصري", "Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî", 5, 171, "Basra"),
  N("atabmuslimelhaffafebum", "عطاء بن مسلم الخفاف أبو مخلد الكوفي", "Atâ b. Müslim el-Haffâf Ebû Mahled", 5, 190, "Kûfe"),
  N("atabebimeymuneelbasrie", "عطاء بن أبي ميمونة البصري أبو معاذ", "Atâ b. Ebî Meymûne el-Basrî Ebû Muâz", 4, 131, "Basra"),
  N("atiyyebsad", "عطية بن سعد بن جنادة", "Atiyye b. Sa‘d b. Cünâde", 3, 111, "Kûfe"),
  N("atiyyebkayselkilabi", "عطية بن قيس الكلابي", "Atiyye b. Kays el-Kilâbî", 3, 121, "Şam"),
  N("ukbebmuslimettuceybi", "عقبة بن مسلم التجيبي", "Ukbe b. Müslim et-Tüceybî", 4, 120, "Mısır"),
  N("alkamebabdullahbsinan", "علقمة بن عبد الله بن سنان", "Alkame b. Abdullah b. Sinân", 3, 100, "Basra"),
  N("alkamebamrbelhusaynebu", "علقمة بن عمرو بن الحصين العطاردي أبو الفضل الكوفي", "Alkame b. Amr b. el-Husayn Ebû Fazl", 5, 256, "Kûfe"),
  N("alibishakessulemi", "علي بن إسحاق السلمي", "Ali b. İshak es-Sülemî", 5, 213, "Horasan"),
  N("alibishakbmuslimesseme", "علي بن إسحاق بن مسلم الحنظلي السمرقندي", "Ali b. İshak b. Müslim es-Semerkandî", 5, 237, "Mâverâünnehir"),
  N("alibsabit", "علي بن ثابت", "Ali b. Sâbit", 5, 219, "Kûfe"),
  N("alibharbbabdirrahman", "علي بن حرب بن عبد الرحمن الجنديسابوري", "Ali b. Harb b. Abdirrahman", 5, 258, "Yemen"),
  N("alibhuseyinbmatarelbas", "علي بن الحسين بن مطر الدرهمي البصري", "Ali b. Hüseyin b. Matar el-Basrî", 5, 253, "Basra"),
  N("alibhuseyinbvakidelmer", "علي بن الحسين بن واقد المروزي", "Ali b. Hüseyin b. Vâkid el-Mervezî", 5, 211, "Horasan"),
  N("alibhuseyin", "علي بن الحسين الرقي", "Ali b. Hüseyin", 5, 250, "Humus"),
  N("alibhakemelbunani", "علي بن الحكم البناني", "Ali b. Hakem el-Bünânî", 5, 131, "Basra"),
  N("alibhakim", "علي بن حكيم بن ذبيان", "Ali b. Hakîm b. Zibyân", 5, 231, "Kûfe"),
  N("alibhakim2", "علي بن حكيم بن زاهر الخراساني", "Ali b. Hakîm b. Zâhir el-Horâsânî", 5, 235, "Horasan"),
  N("alibsaidbmesrukelkindi", "علي بن سعيد بن مسروق الكندي الكوفي", "Ali b. Saîd b. Mesrûk el-Kindî", 5, 249, "Kûfe"),
  N("alibsuaybbadi", "علي بن شعيب بن عدي", "Ali b. Şuayb b. Adî", 5, 253, "Bağdat"),
  N("alibzabyan", "علي بن ظبيان", "Ali b. Zabyân", 5, 192, "Kûfe"),
  N("alibosmanbmuhammed", "علي بن عثمان بن محمد", "Ali b. Osmân b. Muhammed", 5, 272, "Humus"),
  N("alibisabyezid", "علي بن عيسى بن يزيد البغدادي الكراجكي", "Ali b. Îsâ b. Yezîd", 5, 247, "Bağdat"),
  N("alibmabedbseddad", "علي بن معبد بن شداد الرقي", "Ali b. Ma‘bed b. Şeddâd", 5, 218, "Mısır"),
  N("alibmabedbnuh", "علي بن معبد بن نوح البغدادي", "Ali b. Ma‘bed b. Nûh", 5, 259, "Mısır"),
  N("alibmeymunelattar", "علي بن ميمون الرقي العطار", "Ali b. Meymûn el-Attâr", 5, 246, "Humus"),
  N("ammarbhasanebuhasanerr", "عمار بن الحسن الهلالي أبو الحسن الرازي", "Ammâr b. Hasan Ebû Hasan er-Râzî", 5, 242, "Cibâl"),
  N("ammarbhalidbyezidebufa", "عمار بن خالد بن يزيد أبو الفضل", "Ammâr b. Hâlid b. Yezîd Ebû Fazl", 5, 260, "Vâsıt"),
  N("ammarbsad", "عمار بن سعد السلهمي", "Ammâr b. Sa‘d", 5, 148, "Mısır"),
  N("ammarbmuhammedessevri", "عمار بن محمد الثوري أبو اليقظان الكوفي", "Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân", 5, 182, "Kûfe"),
  N("ammarbmuaviye", "عمار بن معاوية الدهني", "Ammâr b. Muâviye", 5, 133, "Kûfe"),
  N("ammarbnasr", "عمار بن نصر السعدي أبو ياسر", "Ammâr b. Nasr Ebû Yâsir", 5, 229, "Bağdat"),
  N("omerbeyyubelabdi", "عمر بن أيوب العبدي الموصلي", "Ömer b. Eyyûb el-Abdî", 5, 188, "Humus"),
  N("omerbhafsbgiyas", "عمر بن حفص بن غياث", "Ömer b. Hafs b. Giyâs", 5, 222, "Kûfe"),
  N("omerbhakembsevbanelmed", "عمر بن الحكم بن ثوبان المدني", "Ömer b. Hakem b. Sevbân el-Medenî", 3, 117, "Medine"),
  N("omerbebihalifehaccacel", "عمر بن أبي خليفة حجاج العبدي البصري", "Ömer b. Ebî Halîfe Haccâc el-Abdî el-Basrî", 5, 189, "Basra"),
  N("omerbsaibbebirasidelmi", "عمر بن السائب بن أبي راشد المصري", "Ömer b. Sâib b. Ebî Râşid el-Mısrî", 5, 134, "Mısır"),
  N("omerbabdullah", "عمر بن عبد الله بن رزين السلمي أبو العباس النيسابوري", "Ömer b. Abdullah b. Rezîn es-Sülemî Ebû Abbâs en-Nîsâbûrî", 5, 203, "Horasan"),
  N("omerbabdulazizbimran", "عمر بن عبد العزيز بن عمران", "Ömer b. Abdülazîz b. İmrân", 6, 285, "Mısır"),
  N("omerbabdulvehhab", "عمر بن عبد الوهاب بن رياح", "Ömer b. Abdülvehhâb b. Riyâh", 5, 221, "Basra"),
  N("omerbosmanbomer", "عمر بن عثمان بن عمر", "Ömer b. Osmân b. Ömer", 5, 166, "Medine"),
  N("omerbmeymun", "عمر بن ميمون بن بحر", "Ömer b. Meymûn b. Bahr", 5, 171, "Horasan"),
  N("omerbharunbyezidesseka", "عمر بن هارون بن يزيد الثقفي", "Ömer b. Hârûn b. Yezîd es-Sekafî", 5, 194, "Horasan"),
  N("amrbsabit", "عمرو بن ثابت", "Amr b. Sâbit", 5, 172, "Kûfe"),
  N("amrbhammadbtalha", "عمرو بن حماد بن طلحة", "Amr b. Hammâd b. Talha", 5, 222, "Kûfe"),
  N("amrbhalidbferruh", "عمرو بن خالد بن فروخ", "Amr b. Hâlid b. Ferrûh", 5, 229, "Mısır"),
  N("amrbrafi", "عمرو بن رافع بن الفرات القزويني البجلي أبو حجر", "Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr", 5, 237, "Cibâl"),
  N("amrbrabibtarik", "عمرو بن الربيع بن طارق الكوفي", "Amr b. Rabî‘ b. Târık", 5, 219, "Kûfe"),
  N("amrbzurarebvakidelkila", "عمرو بن زرارة بن واقد الكلابي أبو محمد النيسابوري", "Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî", 5, 238, "Horasan"),
  N("amrbeddahhakbmahledelb", "عمرو بن الضحاك بن مخلد البصري", "Amr b. ed-Dahhâk b. Mahled el-Basrî", 5, 242, "Basra"),
  N("amrbabbaselbahiliebuos", "عمرو بن العباس الباهلي أبو عثمان البصري", "Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî", 5, 235, "Basra"),
  N("amrbosmanbsaid", "عمرو بن عثمان بن سعيد", "Amr b. Osmân b. Saîd", 5, 250, "Humus"),
  N("amrbali", "عمرو بن علي بن بحر", "Amr b. Ali b. Bahr", 5, 249, "Basra"),
  N("amrbmuhammed", "عمرو بن محمد بن أبي رزين الخزاعي", "Amr b. Muhammed b. Ebî Rezîn el-Huzâî", 5, 206, "Basra"),
  N("amrbmuhammed2", "عمرو بن محمد العنقزي", "Amr b. Muhammed", 5, 199, "Kûfe"),
  N("amrbmansurelbasri", "عمرو بن منصور القيسي البصري", "Amr b. Mansûr el-Basrî", 5, 215, "Basra"),
  N("amrbhisamebuumeyye", "عمرو بن هشام الحراني أبو أمية", "Amr b. Hişâm Ebû Ümeyye", 5, 245, "Humus"),
  N("imranbebanbimranessule", "عمران بن أبان بن عمران السلمي", "İmrân b. Ebân b. İmrân es-Sülemî", 5, 205, "Vâsıt"),
  N("imranbmeysere", "عمران بن ميسرة", "İmrân b. Meysere", 5, 223, "Basra"),
  N("umeyrbabdullahebuabdul", "عمير بن عبد الله الهلالي أبو عبد الله المدني", "Umeyr b. Abdullah Ebû Abdullah el-Medenî", 3, 104, "Medine"),
  N("avnbsellam", "عون بن سلام", "Avn b. Sellâm", 5, 230, "Kûfe"),
  N("avnbumareebumuhammedel", "عون بن عمارة القيسي أبو محمد البصري", "Avn b. Umâre Ebû Muhammed el-Basrî", 5, 212, "Basra"),
  N("alabelharisbabdilvaris", "العلاء بن الحارث بن عبد الوارث الحضرمي أبو وهب الدمشقي", "Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī", 5, 136, "Şam"),
  N("alabfazlbabdulmelik", "العلاء بن الفضل بن عبد الملك المنقري", "Alâ b. Fazl b. Abdülmelik", 5, 220, "Basra"),
  N("alabhilalbomerebumuham", "العلاء بن هلال بن عمر أبو محمد الرقي", "Alâ b. Hilâl b. Ömer Ebû Muhammed", 5, 215, "Humus"),
  N("ayyasbukbebkuleybelhad", "عياش بن عقبة بن كليب الحضرمي أبو عقبة المصري", "Ayyâş b. Ukbe b. Küleyb el-Hadramî Ebû Ukbe el-Mısrî", 5, 160, "Mısır"),
  N("ayyasbelvelid", "عياش بن الوليد", "Ayyâş b. el-Velîd", 5, 226, "Basra"),
  N("isabhafsbasimebuziyade", "عيسى بن حفص بن عاصم أبو زياد المدني", "Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî", 5, 157, "Medine"),
  N("isabomerelesedielhemda", "عيسى بن عمر الأسدي الهمداني", "Îsâ b. Ömer el-Esedî el-Hemdânî", 5, 156, "Kûfe"),
  N("isabmusaebuahmedelezra", "عيسى بن موسى البخاري أبو أحمد الأزرق", "Îsâ b. Mûsâ Ebû Ahmed el-Ezrak", 5, 187, "Mâverâünnehir"),
  N("fadalebfazlbfadaleette", "فضالة بن الفضل بن فضالة التميمي أبو الفضل الكوفي", "Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl", 5, 250, "Kûfe"),
  N("fazlbcaferbabdullahebu", "الفضل بن جعفر بن عبد الله البغدادي أبو سهل بن أبي طالب", "Fazl b. Ca‘fer b. Abdullah Ebû Sehl b. Ebî Tâlib", 5, 252, "Bağdat"),
  N("fazlbsehlbibrahimelare", "الفضل بن سهل بن إبراهيم الأعرج البغدادي", "Fazl b. Sehl b. İbrâhim el-A‘rec", 5, 255, "Bağdat"),
  N("fazlbmusa", "الفضل بن موسى السيناني", "Fazl b. Mûsâ", 5, 192, "Horasan"),
  N("fazlbyakubbibrahim", "الفضل بن يعقوب بن إبراهيم", "Fazl b. Ya‘kûb b. İbrâhim", 5, 258, "Bağdat"),
  N("kasimbhakembkesir", "القاسم بن الحكم بن كثير العرني", "Kâsım b. Hakem b. Kesîr", 5, 208, "Kûfe"),
  N("kasimbzekeriyyabyahyae", "القاسم بن زكريا بن يحيى البغدادي أبو بكر", "Kâsım b. Zekeriyyâ b. Yahyâ Ebû Bekir", 6, 305, "Bağdat"),
  N("kasimbsellam", "القاسم بن سلام", "Kâsım b. Sellâm", 5, 224, "Bağdat"),
  N("kasimbsellam2", "القاسم بن سلام بن مسكين الأزدي أبو محمد البصري", "Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî", 5, 228, "Basra"),
  N("kasimbabdirrahmaneddim", "القاسم بن عبد الرحمن الدمشقي أبو عبد الرحمن", "Kâsım b. Abdirrahman ed-Dımaşkī Ebû Abdirrahman", 3, 112, "Şam"),
  N("kasimbisabibrahimettai", "القاسم بن عيسى بن إبراهيم الطائي الواسطي", "Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî", 5, 240, "Vâsıt"),
  N("kasimbfazl", "القاسم بن الفضل بن معدان الحدائي", "Kâsım b. Fazl b. Ma‘dân", 5, 167, "Basra"),
  N("kasimbkesirbnumanebuab", "القاسم بن كثير بن النعمان الإسكندراني أبو العباس القاضي", "Kâsım b. Kesîr b. Nu‘mân Ebû Abbâs el-Kādî", 5, 220, "Mısır"),
  N("kasimbman", "القاسم بن معن", "Kâsım b. Ma‘n", 5, 175, "Kûfe"),
  N("kasimbelvelidelhemdani", "القاسم بن الوليد الهمداني أبو عبد الرحمن الكوفي", "Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman", 5, 141, "Kûfe"),
  N("kasimbyahyabata", "القاسم بن يحيى بن عطاء أبو محمد الواسطي", "Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî", 5, 197, "Vâsıt"),
  N("kasimbyezidelcermi", "القاسم بن يزيد الجرمي", "Kâsım b. Yezîd el-Cermî", 5, 194, "Humus"),
  N("kedamebmusabomer", "قدامة بن موسى بن عمر", "Kedâme b. Mûsâ b. Ömer", 5, 53, "Medine"),
  N("kureysbeneselensari", "قريش بن أنس الأنصاري", "Kureyş b. Enes el-Ensârî", 5, 208, "Basra"),
  N("kaysbelhaccacelmisri", "قيس بن الحجاج الكلاعي المصري", "Kays b. el-Haccâc el-Mısrî", 5, 129, "Mısır"),
  N("kaysbhafsettemimiebumu", "قيس بن حفص التميمي الدارمي أبو محمد", "Kays b. Hafs et-Temîmî Ebû Muhammed", 5, 227, "Basra"),
  N("kulsumbcebrelbasri", "كلثوم بن جبر البصري", "Külsûm b. Cebr el-Basrî", 4, 130, "Basra"),
  N("leysbasimbkuleybelkutb", "الليث بن عاصم بن كليب القتباني", "Leys b. Âsım b. Küleyb el-Kütbânî", 5, 211, "Mısır"),
  N("leysbasimbalaelhavlani", "الليث بن عاصم بن العلاء الخولاني أبو الحسن المصري", "Leys b. Âsım b. Alâ el-Havlânî Ebû Hasan el-Mısrî", 5, 182, "Mısır"),
  N("muhammedbibrahimbelhar", "محمد بن إبراهيم بن الحارث أبو عبد الله المدني", "Muhammed b. İbrâhim b. el-Hâris Ebû Abdullah el-Medenî", 4, 120, "Medine"),
  N("muhammedbibrahimbdinar", "محمد بن إبراهيم بن دينار المدني", "Muhammed b. İbrâhim b. Dînâr el-Medenî", 5, 182, "Medine"),
  N("muhammedbibrahimbsuley", "محمد بن إبراهيم بن سليمان أبو جعفر البزاز الكوفي", "Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz", 5, 248, "Mısır"),
  N("muhammedbibrahimbosman", "محمد بن إبراهيم بن عثمان العبسي", "Muhammed b. İbrâhim b. Osmân", 5, 182, "Kûfe"),
  N("muhammedbahmedbcafereb", "محمد بن أحمد بن جعفر أبو العلاء الوكيعي الكوفي", "Muhammed b. Ahmed b. Ca‘fer Ebû Alâ", 5, 300, "Mısır"),
  N("muhammedbahmed", "محمد بن أحمد القرشي", "Muhammed b. Ahmed", 5, 255, "Medine"),
  N("muhammedbishak", "محمد بن إسحاق الصغاني", "Muhammed b. İshak", 5, 270, "Bağdat"),
  N("muhammedbishakbavnelam", "محمد بن إسحاق بن عون العامري أبو بكر الكوفي", "Muhammed b. İshak b. Avn el-Âmirî Ebû Bekir", 5, 264, "Kûfe"),
  N("muhammedbishakbmuhamme", "محمد بن إسحاق بن محمد", "Muhammed b. İshak b. Muhammed", 5, 236, "Medine"),
  N("muhammedbishakbmansure", "محمد بن إسحاق بن منصور أبو عبد الله بن أبي يعقوب الكرماني", "Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî", 5, 244, "Basra"),
  N("muhammedbismailbibrahi", "محمد بن إسماعيل بن إبراهيم", "Muhammed b. İsmâîl b. İbrâhim", 5, 264, "Şam"),
  N("muhammedbismailb", "محمد بن إسماعيل بن البختري", "Muhammed b. İsmâîl b. el-Bahterî", 5, 258, "Bağdat"),
  N("muhammedbismailbmuslim", "محمد بن إسماعيل بن مسلم", "Muhammed b. İsmâîl b. Müslim", 5, 200, "Medine"),
  N("muhammedbbekirbosman", "محمد بن بكر بن عثمان البرساني", "Muhammed b. Bekir b. Osmân", 5, 204, "Basra"),
  N("muhammedbebibekirbalib", "محمد بن أبي بكر بن علي", "Muhammed b. Ebî Bekir b. Ali", 5, 234, "Basra"),
  N("muhammedbebibekirbmuha", "محمد بن أبي بكر بن محمد أبو عبد الملك القاضي", "Muhammed b. Ebî Bekir b. Muhammed Ebû Abdülmelik el-Kādî", 5, 132, "Medine"),
  N("muhammedbsevressananie", "محمد بن ثور الصنعاني أبو عبد الله", "Muhammed b. Sevr es-San‘ânî Ebû Abdullah", 5, 190, "Yemen"),
  N("muhammedbcabirbbuceyre", "محمد بن جابر بن بجير أبو بجير", "Muhammed b. Câbir b. Büceyr Ebû Büceyr", 5, 256, "Kûfe"),
  N("muhammedbcaferbziyad", "محمد بن جعفر بن زياد الوركاني", "Muhammed b. Ca‘fer b. Ziyâd", 5, 228, "Bağdat"),
  N("muhammedbhatim", "محمد بن حاتم بن بزيع", "Muhammed b. Hâtim b. Büzey‘", 5, 249, "Bağdat"),
  N("muhammedbhatimbsuleyma", "محمد بن حاتم بن سليمان الزمي", "Muhammed b. Hâtim b. Süleymân", 5, 246, "Horasan"),
  N("muhammedbelharisbrasid", "محمد بن الحارث بن راشد", "Muhammed b. el-Hâris b. Râşid", 5, 241, "Mısır"),
  N("muhammedbhassanbhalide", "محمد بن حسان بن خالد الضبي السمتي", "Muhammed b. Hassân b. Hâlid ed-Dabbî", 5, 228, "Bağdat"),
  N("muhammedbhasanbezzubey", "محمد بن الحسن بن الزبير الأسدي الكوفي", "Muhammed b. Hasan b. ez-Zübeyr el-Esedî", 5, 200, "Kûfe"),
  N("muhammedbhuseyinbibrah", "محمد بن الحسين بن إبراهيم العامري أبو جعفر بن إشكاب", "Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb", 5, 261, "Bağdat"),
  N("muhammedbhakemelmervez", "محمد بن الحكم المروزي الأحول", "Muhammed b. Hakem el-Mervezî el-Ahvel", 5, 223, "Horasan"),
  N("muhammedbhumeydbhayyan", "محمد بن حميد بن حيان الرازي", "Muhammed b. Humeyd b. Hayyân er-Râzî", 5, 248, "Cibâl"),
  N("muhammedbhumeydebusufy", "محمد بن حميد اليشكري أبو سفيان المعمري", "Muhammed b. Humeyd Ebû Süfyân", 5, 182, "Bağdat"),
  N("muhammedbhayyan", "محمد بن حيان", "Muhammed b. Hayyân", 5, 227, "Bağdat"),
  N("muhammedbhalidbabdulla", "محمد بن خالد بن عبد الله", "Muhammed b. Hâlid b. Abdullah", 5, 240, "Vâsıt"),
  N("muhammedbhalefebubekir", "محمد بن خلف الحدادي أبو بكر البغدادي", "Muhammed b. Halef Ebû Bekir", 5, 261, "Bağdat"),
  N("muhammedbhalladbkesire", "محمد بن خلاد بن كثير الباهلي أبو بكر البصري", "Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî", 5, 240, "Basra"),
  N("muhammedbebinaciyedavu", "محمد بن أبي ناجية داود بن رزق", "Muhammed b. Ebî Nâciye Dâvûd b. Rizk", 5, 251, "Mısır"),
  N("muhammedbsaibbbisrebun", "محمد بن السائب بن بشر الكلبي أبو النضر الكوفي", "Muhammed b. Sâib b. Bişr Ebû Nadr", 5, 146, "Kûfe"),
  N("muhammedbsaidbsabikerr", "محمد بن سعيد بن سابق الرازي", "Muhammed b. Saîd b. Sâbık er-Râzî", 5, 216, "Cibâl"),
  N("muhammedbsaidbelvelide", "محمد بن سعيد بن الوليد الخزاعي أبو عمرو", "Muhammed b. Saîd b. el-Velîd el-Huzâî Ebû Amr", 5, 230, "Basra"),
  N("muhammedbselemebabdull", "محمد بن سلمة بن عبد الله الباهلي", "Muhammed b. Seleme b. Abdullah el-Bâhilî", 5, 91, "Humus"),
  N("muhammedbsuleymanbebid", "محمد بن سليمان بن أبي داود الحراني", "Muhammed b. Süleymân b. Ebî Dâvûd", 5, 213, "Humus"),
  N("muhammedbsinanelbahili", "محمد بن سنان الباهلي أبو بكر البصري", "Muhammed b. Sinân el-Bâhilî Ebû Bekir el-Basrî", 5, 223, "Basra"),
  N("muhammedbsinanbyezid", "محمد بن سنان بن يزيد", "Muhammed b. Sinân b. Yezîd", 5, 271, "Bağdat"),
  N("muhammedbsehl", "محمد بن سهل بن عسكر التميمي", "Muhammed b. Sehl b. Asker et-Temîmî", 5, 251, "Bağdat"),
  N("muhammedbsevvar", "محمد بن سوار", "Muhammed b. Sevvâr", 5, 248, "Mısır"),
  N("muhammedbsuca", "محمد بن شجاع المروذي", "Muhammed b. Şücâ‘", 5, 244, "Bağdat"),
  N("muhammedbsucaelkadi", "محمد بن شجاع البغدادي القاضي", "Muhammed b. Şücâ‘ el-Kādî", 5, 266, "Bağdat"),
  N("muhammedbserikelmekkie", "محمد بن شريك المكي أبو عثمان", "Muhammed b. Şerîk el-Mekkî Ebû Osmân", 5, 168, "Mekke"),
  N("muhammedbsalihbabdirra", "محمد بن صالح بن عبد الرحمن البغدادي أبو بكر الأنماطي", "Muhammed b. Sâlih b. Abdirrahman Ebû Bekir", 5, 271, "Bağdat"),
  N("muhammedbsalihbmihrane", "محمد بن صالح بن مهران البصري أبو جعفر بن النطاح الهاشمي أبو التياح", "Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh", 5, 252, "Basra"),
  N("muhammedbasimbcaferelm", "محمد بن عاصم بن جعفر المعافري المصري", "Muhammed b. Âsım b. Ca‘fer el-Mısrî", 5, 215, "Mısır"),
  N("muhammedbabdullahbisma", "محمد بن عبد الله بن إسماعيل", "Muhammed b. Abdullah b. İsmâîl", 5, 257, "Bağdat"),
  N("muhammedbabdullah", "محمد بن عبد الله بن بزيع", "Muhammed b. Abdullah b. Büzey‘", 5, 247, "Basra"),
  N("muhammedbabdullah2", "محمد بن عبد الله بن حسن", "Muhammed b. Abdullah b. Hasan", 5, 145, "Medine"),
  N("muhammedbabdullahbezzu", "محمد بن عبد الله بن الزبير أبو أحمد الزبيري الكوفي", "Muhammed b. Abdullah b. ez-Zübeyr Ebû Ahmed", 5, 203, "Kûfe"),
  N("muhammedbabdullahbabdi", "محمد بن عبد الله بن عبد الرحمن أبو عبد الرحمن المدني", "Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî", 5, 139, "Medine"),
  N("muhammedbabdullahbamma", "محمد بن عبد الله بن عمار المخرمي", "Muhammed b. Abdullah b. Ammâr", 5, 242, "Bağdat"),
  N("muhammedbabdullahbamr", "محمد بن عبد الله بن عمرو", "Muhammed b. Abdullah b. Amr", 5, 145, "Medine"),
  N("muhammedbabdullah3", "محمد بن عبد الله بن علاثة", "Muhammed b. Abdullah b. Ulâse", 5, 168, "Humus"),
  N("muhammedbabdullah4", "محمد بن عبد الله بن قهزاد", "Muhammed b. Abdullah b. Kahzâd", 5, 262, "Horasan"),
  N("muhammedbabdullahbmuha", "محمد بن عبد الله بن محمد", "Muhammed b. Abdullah b. Muhammed", 5, 219, "Basra"),
  N("muhammedbabdullah5", "محمد بن عبد الله الرزي", "Muhammed b. Abdullah", 5, 231, "Bağdat"),
  N("muhammedbabdirrahmanbh", "محمد بن عبد الرحمن بن الحسن", "Muhammed b. Abdirrahman b. Hasan", 5, 260, "Şam"),
  N("muhammedbabdirrahmanbe2", "محمد بن عبد الرحمن بن أبي ليلى الأنصاري الكوفي أبو عبد الرحمن", "Muhammed b. Abdirrahman b. Ebî Leylâ el-Ensârî Ebû Abdirrahman", 5, 148, "Kûfe"),
  N("muhammedbabdulaziz", "محمد بن عبد العزيز بن أبي رزمة", "Muhammed b. Abdülazîz b. Ebî Rizme", 5, 241, "Horasan"),
  N("muhammedbabdulmelik", "محمد بن عبد الملك بن زنجويه البغدادي أبو بكر", "Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir", 5, 258, "Bağdat"),
  N("muhammedbabdulmelikbme", "محمد بن عبد الملك بن مروان الواسطي أبو جعفر الدقيقي", "Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer", 5, 266, "Vâsıt"),
  N("muhammedbubeyd", "محمد بن عبيد", "Muhammed b. Ubeyd", 5, 204, "Kûfe"),
  N("muhammedbubeydbabdulme", "محمد بن عبيد بن عبد الملك الأسدي الهمذاني", "Muhammed b. Ubeyd b. Abdülmelik el-Esedî", 5, 249, "Cibâl"),
  N("muhammedbebiubeydebman", "محمد بن أبي عبيدة بن معن", "Muhammed b. Ebî Ubeyde b. Ma‘n", 5, 205, "Kûfe"),
  N("muhammedbosman", "محمد بن عثمان بن كرامة", "Muhammed b. Osmân b. Kerâme", 5, 256, "Kûfe"),
  N("muhammedbukbebkesir", "محمد بن عقبة بن كثير", "Muhammed b. Ukbe b. Kesîr", 5, 220, "Kûfe"),
  N("muhammedbalibhasan", "محمد بن علي بن الحسن", "Muhammed b. Ali b. Hasan", 5, 250, "Horasan"),
  N("muhammedbalibhamzaelme", "محمد بن علي بن حمزة المروزي", "Muhammed b. Ali b. Hamza el-Mervezî", 5, 261, "Horasan"),
  N("muhammedbalibhamza", "محمد بن علي بن حمزة", "Muhammed b. Ali b. Hamza", 6, 286, "Bağdat"),
  N("muhammedbalibhamzaebub", "محمد بن علي بن حمزة أبو بكر الأنطاكي", "Muhammed b. Ali b. Hamza Ebû Bekir", 6, 323, "Bağdat"),
  N("muhammedbalibmeymunebu", "محمد بن علي بن ميمون الرقي أبو العباس العطار", "Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr", 5, 268, "Humus"),
  N("muhammedbomerbelvelide", "محمد بن عمر بن الوليد الكندي أبو جعفر الكوفي", "Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer", 5, 256, "Kûfe"),
  N("muhammedbamr", "محمد بن عمرو بن حنان", "Muhammed b. Amr b. Hannân", 5, 257, "Humus"),
  N("muhammedbamrbabbad", "محمد بن عمرو بن عباد", "Muhammed b. Amr b. Abbâd", 5, 234, "Basra"),
  N("muhammedbamr2", "محمد بن عمرو", "Muhammed b. Amr", 5, 236, "Horasan"),
  N("muhammedbebigalibettay", "محمد بن أبي غالب القومسي الطيالسي", "Muhammed b. Ebî Gālib et-Tayâlisî", 5, 250, "Bağdat"),
  N("muhammedbebigalib", "محمد بن أبي غالب البغدادي", "Muhammed b. Ebî Gālib", 5, 224, "Bağdat"),
  N("muhammedbfiras", "محمد بن فراس", "Muhammed b. Firâs", 5, 245, "Basra"),
  N("muhammedbfazlbatiyye", "محمد بن الفضل بن عطية", "Muhammed b. Fazl b. Atiyye", 5, 180, "Mâverâünnehir"),
  N("muhammedbkasimelesedie", "محمد بن القاسم الأسدي أبو القاسم الكوفي", "Muhammed b. Kâsım el-Esedî Ebû Kâsım", 5, 207, "Kûfe"),
  N("muhammedbelmubarek", "محمد بن المبارك الصوري", "Muhammed b. el-Mübârek", 5, 215, "Şam"),
  N("muhammedbmuhammedbhall", "محمد بن محمد بن خلاد الباهلي أبو عمر البصري", "Muhammed b. Muhammed b. Hallâd el-Bâhilî Ebû Ömer el-Basrî", 5, 257, "Basra"),
  N("muhammedbmuzahimelamir", "محمد بن مزاحم العامري", "Muhammed b. Müzâhim el-Âmirî", 5, 209, "Horasan"),
  N("muhammedbmesudbyusufen", "محمد بن مسعود بن يوسف النيسابوري أبو جعفر بن العجمي", "Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî", 5, 247, "Horasan"),
  N("muhammedbmusabebinuaym", "محمد بن موسى بن أبي نعيم الواسطي الهذلي", "Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî", 5, 223, "Vâsıt"),
  N("muhammedbnasrelmervezi", "محمد بن نصر المروزي الفقيه أبو عبد الله", "Muhammed b. Nasr el-Mervezî el-Fakīh Ebû Abdullah", 6, 294, "Horasan"),
  N("muhammedbnadrbselemeel", "محمد بن النضر بن سلمة العامري أبو بكر الجارودي", "Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir", 6, 291, "Horasan"),
  N("muhammedbnadr", "محمد بن النضر بن مساور المروزي", "Muhammed b. Nadr b. Müsâvir el-Mervezî", 5, 239, "Horasan"),
  N("muhammedbhisam", "محمد بن هشام بن أبي خيرة", "Muhammed b. Hişâm b. Ebî Hıyera", 5, 251, "Mısır"),
  N("muhammedbhisambisa", "محمد بن هشام بن عيسى", "Muhammed b. Hişâm b. Îsâ", 5, 252, "Bağdat"),
  N("muhammedbhilalbebihila", "محمد بن هلال بن أبي هلال المدني", "Muhammed b. Hilâl b. Ebî Hilâl el-Medenî", 5, 162, "Medine"),
  N("muhammedbvehbbomer", "محمد بن وهب بن عمر أبو المعافي الحراني", "Muhammed b. Vehb b. Ömer", 5, 243, "Humus"),
  N("muhammedbyahyabsaidelk", "محمد بن يحيى بن سعيد القطان أبو صالح البصري", "Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî", 5, 233, "Basra"),
  N("muhammedbyahya", "محمد بن يحيى بن أبي سمينة", "Muhammed b. Yahyâ b. Ebî Semîne", 5, 239, "Bağdat"),
  N("muhammedbyahyababdulla", "محمد بن يحيى بن عبد الله", "Muhammed b. Yahyâ b. Abdullah", 5, 258, "Horasan"),
  N("muhammedbyahyababdulke", "محمد بن يحيى بن عبد الكريم", "Muhammed b. Yahyâ b. Abdülkerîm", 5, 252, "Bağdat"),
  N("muhammedbyahyabmuhamme", "محمد بن يحيى بن محمد", "Muhammed b. Yahyâ b. Muhammed", 5, 267, "Humus"),
  N("muhammedbebiyahyaelmed", "محمد بن أبي يحيى الأسلمي المدني", "Muhammed b. Ebî Yahyâ el-Medenî", 5, 147, "Medine"),
  N("muhammedbyezidbsinanel", "محمد بن يزيد بن سنان الجزري أبو عبد الله بن أبي فروة الرهاوي", "Muhammed b. Yezîd b. Sinân el-Cezerî Ebû Abdullah b. Ebî Ferve", 5, 220, "Humus"),
  N("muhammedbyezidelattar", "محمد بن يزيد الحنفي الكوفي العطار", "Muhammed b. Yezîd el-Attâr", 5, 276, "Kûfe"),
  N("muhammedbyezidebucafer", "محمد بن يزيد الأدمي أبو جعفر", "Muhammed b. Yezîd Ebû Ca‘fer", 5, 245, "Bağdat"),
  N("bmuhammedbmesudebumesu", "الماضي بن محمد بن مسعود الغافقي أبو مسعود", "el-Mâdî b. Muhammed b. Mes‘ûd el-Gāfikī Ebû Mes‘ûd", 5, 183, "Mısır"),
  N("malikbismail", "مالك بن إسماعيل النهدي أبو غسان الكوفي", "Mâlik b. İsmâîl Ebû Gassân", 5, 217, "Kûfe"),
  N("malikbabdulvahid", "مالك بن عبد الواحد أبو غسان المسمعي البصري", "Mâlik b. Abdülvâhid Ebû Gassân el-Basrî", 5, 230, "Basra"),
  N("mahmudbhalidessulemieb", "محمود بن خالد السلمي أبو علي الدمشقي", "Mahmûd b. Hâlid es-Sülemî Ebû Ali ed-Dımaşkī", 5, 247, "Şam"),
  N("mahledbhuseyin", "مخلد بن الحسين", "Mahled b. Hüseyin", 5, 191, "Basra"),
  N("mahledbmalikbcabir", "مخلد بن مالك بن جابر", "Mahled b. Mâlik b. Câbir", 5, 241, "Horasan"),
  N("mahledbmalikbseybanebu", "مخلد بن مالك بن شيبان الحراني أبو محمد", "Mahled b. Mâlik b. Şeybân Ebû Muhammed", 5, 242, "Humus"),
  N("mahledbyezid", "مخلد بن يزيد القرشي الحراني", "Mahled b. Yezîd", 5, 193, "Humus"),
  N("mervanbhakembebielasbu", "مروان بن الحكم بن أبي العاص أبو عبد الملك الأموي المدني", "Mervân b. Hakem b. Ebî el-Âs Ebû Abdülmelik el-Medenî", 2, 105, "Medine"),
  N("mervanbsucaelcezeriebu", "مروان بن شجاع الجزري أبو عمرو", "Mervân b. Şücâ‘ el-Cezerî Ebû Amr", 5, 184, "Humus"),
  N("mervanbmuhammedbhassan", "مروان بن محمد بن حسان الأسدي الدمشقي", "Mervân b. Muhammed b. Hassân el-Esedî ed-Dımaşkī", 5, 210, "Şam"),
  N("mervanbmuaviyebelharis", "مروان بن معاوية بن الحارث أبو عبد الله الكوفي", "Mervân b. Muâviye b. el-Hâris Ebû Abdullah", 5, 193, "Mekke"),
  N("mesudbmalik", "مسعود بن مالك أبو رزين الأسدي الكوفي", "Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî", 2, 85, "Kûfe"),
  N("muslimbcundebelmedenie", "مسلم بن جندب الهذلي المدني", "Müslim b. Cündeb el-Medenî", 3, 106, "Medine"),
  N("mutarrifbabdullah", "مطرف بن عبد الله بن الشخير", "Mutarrif b. Abdullah b. eş-Şihhîr", 2, 95, "Basra"),
  N("mutarrifbabdullahbmuta", "مطرف بن عبد الله بن مطرف اليساري", "Mutarrif b. Abdullah b. Mutarrif", 5, 220, "Medine"),
  N("muttalibbziyadbebizuhe", "المطلب بن زياد بن أبي زهير الثقفي", "Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî", 5, 185, "Kûfe"),
  N("muazbhanielbasriebuhan", "معاذ بن هانئ القيسي البصري أبو هانئ", "Muâz b. Hâni’ el-Basrî Ebû Hâni’", 5, 209, "Basra"),
  N("muazbhisambebiabdullah", "معاذ بن هشام بن أبي عبد الله الدستوائي البصري", "Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî", 5, 200, "Basra"),
  N("muaviyebkurrebiyasebui", "معاوية بن قرة بن إياس أبو إياس البصري", "Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî", 3, 113, "Basra"),
  N("muaviyebhisam", "معاوية بن هشام", "Muâviye b. Hişâm", 5, 204, "Kûfe"),
  N("marufbsuveydebuselemee", "معروف بن سويد الجذامي أبو سلمة المصري", "Ma‘rûf b. Süveyd Ebû Seleme el-Mısrî", 5, 150, "Mısır"),
  N("mugirebselemeelmahzumi", "المغيرة بن سلمة المخزومي أبو هشام البصري", "Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî", 5, 200, "Basra"),
  N("mugirebabdirrahmanbavn", "المغيرة بن عبد الرحمن بن عون أبو أحمد", "Mugīre b. Abdirrahman b. Avn Ebû Ahmed", 5, 243, "Humus"),
  N("elmufaddalbfadalebubey", "المفضل بن فضالة بن عبيد", "el-Mufaddal b. Fadâle b. Ubeyd", 5, 181, "Mısır"),
  N("elmufaddalbfadaleelmis", "المفضل بن فضالة المصري", "el-Mufaddal b. Fadâle el-Mısrî", 5, 252, "Mısır"),
  N("elmufaddalbyunuselcufi", "المفضل بن يونس الجعفي أبو يونس الكوفي", "el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus", 5, 178, "Kûfe"),
  N("mansurbebimuzahimbesir", "منصور بن أبي مزاحم بشير التركي أبو نصر البغدادي", "Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr", 5, 235, "Bağdat"),
  N("elmunkedirbmuhammedbel", "المنكدر بن محمد بن المنكدر القرشي التيمي", "el-Münkedir b. Muhammed b. el-Münkedir et-Teymî", 5, 180, "Medine"),
  N("mehdibhafsebuahmed", "مهدي بن حفص البغدادي أبو أحمد", "Mehdî b. Hafs Ebû Ahmed", 5, 223, "Bağdat"),
  N("mehdibcafer", "مهدي بن جعفر بن حيهان", "Mehdî b. Ca‘fer b. Hayyehân", 5, 230, "Şam"),
  N("musabeyyubbamir", "موسى بن أيوب بن عامر الغافقي", "Mûsâ b. Eyyûb b. Âmir el-Gāfikī", 5, 153, "Mısır"),
  N("musabseleme", "موسى بن سلمة بن أبي مريم المصري", "Mûsâ b. Seleme b. Ebî Meryem el-Mısrî", 5, 163, "Mısır"),
  N("musabsehl", "موسى بن سهل بن قادم أبو عمران الرملي", "Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî", 5, 262, "Şam"),
  N("musababdirrahmanbsaide", "موسى بن عبد الرحمن بن سعيد أبو عيسى الكوفي", "Mûsâ b. Abdirrahman b. Saîd Ebû Îsâ", 5, 258, "Kûfe"),
  N("musababdulazizebusuayb", "موسى بن عبد العزيز العدني أبو شعيب القنباري", "Mûsâ b. Abdülazîz Ebû Şuayb", 5, 175, "Yemen"),
  N("musabubeyde", "موسى بن عبيدة", "Mûsâ b. Ubeyde", 5, 153, "Medine"),
  N("musabali", "موسى بن علي", "Mûsâ b. Ali", 5, 163, "Mısır"),
  N("musabisaelleysi", "موسى بن عيسى الليثي", "Mûsâ b. Îsâ el-Leysî", 5, 183, "Kûfe"),
  N("musabkureysbnafiettemi", "موسى بن قريش بن نافع التميمي البخاري", "Mûsâ b. Kureyş b. Nâfi‘ et-Temîmî", 5, 252, "Mâverâünnehir"),
  N("musabmuhammedbibrahime", "موسى بن محمد بن إبراهيم أبو محمد المدني", "Mûsâ b. Muhammed b. İbrâhim Ebû Muhammed el-Medenî", 5, 151, "Medine"),
  N("musabmervanebuimranett", "موسى بن مروان أبو عمران التمار البغدادي", "Mûsâ b. Mervân Ebû İmrân et-Temmâr", 5, 246, "Bağdat"),
  N("musabharun", "موسى بن هارون القيسي البردي", "Mûsâ b. Hârûn", 5, 224, "Kûfe"),
  N("nafibomerbabdullah", "نافع بن عمر بن عبد الله", "Nâfi‘ b. Ömer b. Abdullah", 5, 169, "Mekke"),
  N("nasrbabdirrahman", "نصر بن عبد الرحمن بن بكار الناجي الكوفي", "Nasr b. Abdirrahman b. Bekkâr", 5, 248, "Kûfe"),
  N("nadrbmuhammedelmervezi", "النضر بن محمد المروزي", "Nadr b. Muhammed el-Mervezî", 5, 183, "Horasan"),
  N("numanbsabit", "النعمان بن ثابت الكوفي أبو حنيفة", "Nu‘mân b. Sâbit Ebû Hanîfe", 5, 150, "Kûfe"),
  N("numanbabdusselambhabib", "النعمان بن عبد السلام بن حبيب التيمي أبو المنذر الأصبهاني", "Nu‘mân b. Abdüsselâm b. Habîb et-Teymî Ebû Münzir", 5, 183, "Cibâl"),
  N("numanbmunzir", "النعمان بن المنذر الغساني أبو الوزير الدمشقي", "Nu‘mân b. Münzir Ebû el-Vezîr ed-Dımaşkī", 5, 132, "Şam"),
  N("nuaymbhammadbmuaviyeeb", "نعيم بن حماد بن معاوية أبو عبد الله المروزي", "Nuaym b. Hammâd b. Muâviye Ebû Abdullah el-Mervezî", 5, 228, "Mısır"),
  N("nuaymbmeysere", "نعيم بن ميسرة الكوفي", "Nuaym b. Meysere", 5, 174, "Cibâl"),
  N("nuhbmeymunbabdulhamid", "نوح بن ميمون بن عبد الحميد البغدادي", "Nûh b. Meymûn b. Abdülhamîd", 5, 218, "Bağdat"),
  N("harunbismail", "هارون بن إسماعيل", "Hârûn b. İsmâîl", 5, 206, "Basra"),
  N("hasimbkasimbmuslimelle", "هاشم بن القاسم بن مسلم الليثي", "Hâşim b. Kâsım b. Müslim el-Leysî", 5, 207, "Bağdat"),
  N("hisambismailbyahyaebua", "هشام بن إسماعيل بن يحيى أبو عبد الملك الدمشقي", "Hişâm b. İsmâîl b. Yahyâ Ebû Abdülmelik ed-Dımaşkī", 5, 216, "Şam"),
  N("hisambhalidbzeydebumer", "هشام بن خالد بن زيد أبو مروان الدمشقي", "Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī", 5, 249, "Şam"),
  N("hisambebiabdullah", "هشام بن أبي عبد الله", "Hişâm b. Ebî Abdullah", 5, 154, "Basra"),
  N("hisambabdulmelikbimran", "هشام بن عبد الملك بن عمران اليزني", "Hişâm b. Abdülmelik b. İmrân", 5, 251, "Humus"),
  N("hisambammar", "هشام بن عمار بن نصير", "Hişâm b. Ammâr b. Nusayr", 5, 245, "Şam"),
  N("hemmambelharisbkays", "همام بن الحارث بن قيس", "Hemmâm b. el-Hâris b. Kays", 2, 65, "Kûfe"),
  N("heysembhariceebuahmed", "الهيثم بن خارجة المروذي أبو أحمد", "Heysem b. Hârice Ebû Ahmed", 5, 227, "Bağdat"),
  N("heysembhalid", "الهيثم بن خالد", "Heysem b. Hâlid", 5, 239, "Kûfe"),
  N("vasilbsaiberrakasiebuy", "واصل بن السائب الرقاشي أبو يحيى البصري", "Vâsıl b. Sâib er-Rakāşî Ebû Yahyâ el-Basrî", 5, 144, "Basra"),
  N("vasilbabdulalabhilalel", "واصل بن عبد الأعلى بن هلال الأسدي أبو القاسم", "Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım", 5, 244, "Kûfe"),
  N("vakidbamrbsadebuabdull", "واقد بن عمرو بن سعد أبو عبد الله المدني", "Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî", 4, 120, "Medine"),
  N("elvelidbrebahelmedeni", "الوليد بن رباح المدني", "el-Velîd b. Rebâh el-Medenî", 3, 117, "Medine"),
  N("elvelidbsucabelvelideb", "الوليد بن شجاع بن الوليد أبو همام بن أبي بدر الكوفي", "el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr", 5, 243, "Bağdat"),
  N("elvelidbabdirrahmanbha", "الوليد بن عبد الرحمن بن حبيب الجارودي البصري أبو العباس", "el-Velîd b. Abdirrahman b. Habîb el-Basrî Ebû Abbâs", 5, 282, "Basra"),
  N("elvelidbutbeelesceiebu", "الوليد بن عتبة الأشجعي أبو العباس الدمشقي", "el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī", 5, 240, "Şam"),
  N("elvelidbkasimbelvelide", "الوليد بن القاسم بن الوليد الهمداني الكوفي", "el-Velîd b. Kâsım b. el-Velîd el-Hemdânî", 5, 183, "Kûfe"),
  N("elvelidbmugirebsuleyma", "الوليد بن المغيرة بن سليمان المصري أبو العباس", "el-Velîd b. Mugīre b. Süleymân el-Mısrî Ebû Abbâs", 5, 172, "Mısır"),
  N("vehbbbakiyyebosmansade", "وهب بن بقية بن عثمان الواسطي أبو محمد", "Vehb b. Bakiyye b. Osmân el-Vâsıtî Ebû Muhammed", 5, 239, "Vâsıt"),
  N("yahyabishak", "يحيى بن إسحاق السيلحيني", "Yahyâ b. İshak", 5, 210, "Bağdat"),
  N("yahyabeyyub", "يحيى بن أيوب الغافقي", "Yahyâ b. Eyyûb el-Gāfikī", 5, 168, "Mısır"),
  N("yahyabeyyub2", "يحيى بن أيوب المقابري", "Yahyâ b. Eyyûb el-Makābirî", 5, 234, "Bağdat"),
  N("yahyabbisrbkesir", "يحيى بن بشر بن كثير الحريري", "Yahyâ b. Bişr b. Kesîr", 5, 227, "Kûfe"),
  N("yahyabbisrelfellas", "يحيى بن بشر البلخي الفلاس", "Yahyâ b. Bişr el-Fellâs", 5, 232, "Horasan"),
  N("yahyabebibukeyrennehai", "يحيى بن أبي بكير النخعي الكوفي", "Yahyâ b. Ebî Bükeyr en-Nehaî", 5, 230, "Kûfe"),
  N("yahyabcabirbhassanetta", "يحيى بن جابر بن حسان الطائي أبو عمرو الحمصي", "Yahyâ b. Câbir b. Hassân et-Tâî Ebû Amr", 5, 126, "Humus"),
  N("yahyabcafer", "يحيى بن جعفر بن أعين الأزدي البخاري", "Yahyâ b. Ca‘fer b. A‘yen el-Ezdî", 5, 243, "Mâverâünnehir"),
  N("yahyabhammadbebiziyade", "يحيى بن حماد بن أبي زياد الشيباني", "Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî", 5, 215, "Basra"),
  N("yahyabhamzabvakidelhad", "يحيى بن حمزة بن واقد الحضرمي أبو عبد الرحمن الدمشقي", "Yahyâ b. Hamza b. Vâkid el-Hadramî Ebû Abdirrahman ed-Dımaşkī", 5, 183, "Şam"),
  N("yahyabhalefelbahiliebu", "يحيى بن خلف الباهلي أبو سلمة البصري", "Yahyâ b. Halef el-Bâhilî Ebû Seleme el-Basrî", 5, 242, "Basra"),
  N("yahyabdavudbmeymunsade", "يحيى بن داود بن ميمون الواسطي", "Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî", 5, 244, "Vâsıt"),
  N("yahyabrasidelbasriebub", "يحيى بن راشد البصري أبو بكر", "Yahyâ b. Râşid el-Basrî Ebû Bekir", 5, 211, "Basra"),
  N("yahyabzekeriyyabyahyae", "يحيى بن زكريا بن يحيى النيسابوري الأعرج", "Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec", 6, 307, "Horasan"),
  N("yahyabziyadbabdullahel", "يحيى بن زياد بن عبد الله الأسدي", "Yahyâ b. Ziyâd b. Abdullah el-Esedî", 5, 207, "Bağdat"),
  N("yahyabsaidbebanebueyyu", "يحيى بن سعيد بن أبان أبو أيوب الكوفي", "Yahyâ b. Saîd b. Ebân Ebû Eyyûb", 5, 194, "Bağdat"),
  N("yahyabsaidbhayyan", "يحيى بن سعيد بن حيان", "Yahyâ b. Saîd b. Hayyân", 5, 145, "Kûfe"),
  N("yahyababbadeddubai", "يحيى بن عباد الضبعي", "Yahyâ b. Abbâd ed-Dubaî", 5, 198, "Bağdat"),
  N("yahyababdullahbbukeyre", "يحيى بن عبد الله بن بكير المخزومي", "Yahyâ b. Abdullah b. Bükeyr el-Mahzûmî", 5, 231, "Mısır"),
  N("yahyababdullahbsalim", "يحيى بن عبد الله بن سالم", "Yahyâ b. Abdullah b. Sâlim", 5, 153, "Medine"),
  N("yahyababdirrahman", "يحيى بن عبد الرحمن بن حاطب أبو محمد", "Yahyâ b. Abdirrahman b. Hâtıb Ebû Muhammed", 3, 104, "Medine"),
  N("yahyabalibyahya", "يحيى بن علي بن يحيى", "Yahyâ b. Ali b. Yahyâ", 5, 129, "Medine"),
  N("yahyabisaettemimi", "يحيى بن عيسى التميمي النهشلي", "Yahyâ b. Îsâ et-Temîmî", 5, 201, "Kûfe"),
  N("yahyabgaylanbabdullah", "يحيى بن غيلان بن عبد الله", "Yahyâ b. Gaylân b. Abdullah", 5, 220, "Bağdat"),
  N("yahyabfazlbyahya", "يحيى بن الفضل بن يحيى", "Yahyâ b. Fazl b. Yahyâ", 5, 256, "Basra"),
  N("yahyabmuhammedbmuaviye", "يحيى بن محمد بن معاوية اللؤلؤي المروزي", "Yahyâ b. Muhammed b. Muâviye el-Lü'lüî el-Mervezî", 5, 257, "Mâverâünnehir"),
  N("yahyabmugirebismailebu", "يحيى بن المغيرة بن إسماعيل أبو سلمة المدني", "Yahyâ b. Mugīre b. İsmâîl Ebû Seleme el-Medenî", 5, 253, "Medine"),
  N("yahyabmeymunelhadramie", "يحيى بن ميمون الحضرمي أبو عمرة المصري", "Yahyâ b. Meymûn el-Hadramî Ebû Amre el-Mısrî", 5, 114, "Mısır"),
  N("yahyabmeymuneddabbiebu", "يحيى بن ميمون الضبي أبو المعلى العطار الكوفي", "Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr", 5, 132, "Kûfe"),
  N("yahyabyahyabkaysebuosm", "يحيى بن يحيى بن قيس أبو عثمان الشامي", "Yahyâ b. Yahyâ b. Kays Ebû Osmân eş-Şâmî", 5, 133, "Şam"),
  N("yahyabyalabelhariselmu", "يحيى بن يعلى بن الحارث المحاربي الكوفي", "Yahyâ b. Ya‘lâ b. el-Hâris el-Muhâribî", 5, 216, "Kûfe"),
  N("yezidbibrahim", "يزيد بن إبراهيم التستري", "Yezîd b. İbrâhim", 5, 163, "Basra"),
  N("yezidbhazimbzeydelezdi", "يزيد بن حازم بن زيد الأزدي البصري أبو بكر", "Yezîd b. Hâzim b. Zeyd el-Ezdî el-Basrî Ebû Bekir", 5, 148, "Basra"),
  N("yezidbebiziyad", "يزيد بن أبي زياد الهاشمي", "Yezîd b. Ebî Ziyâd", 5, 136, "Kûfe"),
  N("yezidbebisaidennahvieb", "يزيد بن أبي سعيد النحوي أبو الحسن القرشي", "Yezîd b. Ebî Saîd en-Nahvî Ebû Hasan", 5, 131, "Horasan"),
  N("yezidbsinanbyezid", "يزيد بن سنان بن يزيد", "Yezîd b. Sinân b. Yezîd", 5, 264, "Mısır"),
  N("yezidbabdullahbusameeb", "يزيد بن عبد الله بن أسامة أبو عبد الله المدني", "Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî", 5, 139, "Medine"),
  N("yezidbubeyd", "يزيد بن عبيد أبو وجزة", "Yezîd b. Ubeyd Ebû Vecze", 5, 130, "Medine"),
  N("yezidbatabyezid", "يزيد بن عطاء بن يزيد اليشكري", "Yezîd b. Atâ b. Yezîd", 5, 177, "Vâsıt"),
  N("yezidbmihranelesediebu", "يزيد بن مهران الأسدي أبو خالد", "Yezîd b. Mihrân el-Esedî Ebû Hâlid", 5, 229, "Kûfe"),
  N("yesarelmekki", "يسار المكي أبو نجيح", "Yesâr el-Mekkî Ebû Necîh", 3, 109, "Mekke"),
  N("yakubbibrahimbsadebuyu", "يعقوب بن إبراهيم بن سعد أبو يوسف المدني", "Ya‘kûb b. İbrâhim b. Sa‘d Ebû Yûsuf el-Medenî", 5, 208, "Bağdat"),
  N("yakubbabdirrahmanbmuha", "يعقوب بن عبد الرحمن بن محمد", "Ya‘kûb b. Abdirrahman b. Muhammed", 5, 181, "Medine"),
  N("yakubbatabebirebahelme", "يعقوب بن عطاء بن أبي رباح المكي", "Ya‘kûb b. Atâ b. Ebî Rebâh el-Mekkî", 5, 155, "Mekke"),
  N("yakubbmuhammed", "يعقوب بن محمد بن طحلاء", "Ya‘kûb b. Muhammed b. Tahlâ", 5, 162, "Medine"),
  N("yakubbmuhammedbisa", "يعقوب بن محمد بن عيسى", "Ya‘kûb b. Muhammed b. Îsâ", 5, 213, "Bağdat"),
  N("yalabelharisbharbelmuh", "يعلى بن الحارث بن حرب المحاربي الكوفي", "Ya‘lâ b. el-Hâris b. Harb el-Muhâribî", 5, 168, "Kûfe"),
  N("yusufbamrbyezidfarisie", "يوسف بن عمرو بن يزيد الفارسي أبو يزيد المصري", "Yûsuf b. Amr b. Yezîd Fârisî Ebû Yezîd el-Mısrî", 5, 205, "Mısır"),
  N("yusufbisabdinarezzuhri", "يوسف بن عيسى بن دينار الزهري أبو يعقوب المروزي", "Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî", 5, 249, "Horasan"),
  N("yusufbmervanennesaiebu", "يوسف بن مروان النسائي أبو الحسن", "Yûsuf b. Mervân en-Nesâî Ebû Hasan", 5, 228, "Bağdat"),
  N("yusufbyakubbebikasimes", "يوسف بن يعقوب بن أبي القاسم السدوسي", "Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî", 5, 201, "Basra"),
  N("yusufbyakubessaffarebu", "يوسف بن يعقوب الصفار أبو يعقوب الكوفي", "Yûsuf b. Ya‘kûb es-Saffâr Ebû Ya‘kûb", 5, 231, "Kûfe"),
  N("yunusbmuhammedbmuslime", "يونس بن محمد بن مسلم البغدادي أبو محمد", "Yûnus b. Muhammed b. Müslim Ebû Muhammed", 5, 207, "Bağdat"),
  N("yunusbnafielhorasani", "يونس بن نافع الخراساني أبو غانم القاضي", "Yûnus b. Nâfi‘ el-Horâsânî Ebû Gānim el-Kādî", 5, 159, "Horasan"),
  N("yunusbyahya", "يونس بن يحيى بن نباتة الأموي أبو نباتة المدني", "Yûnus b. Yahyâ b. Nübâte Ebû Nübâte el-Medenî", 5, 207, "Medine"),
  N("ebuelesved", "أبو الأسود الديلي", "Ebû el-Esved", 2, 69, "Basra"),
  N("ebubekirbabdullahbmuha", "أبو بكر بن عبد الله بن محمد", "Ebû Bekir b. Abdullah b. Muhammed", 5, 162, "Medine"),
  N("ebubekirbabdullah", "أبو بكر بن عبد الله بن أبي مريم الغساني الشامي", "Ebû Bekir b. Abdullah b. Ebî Meryem eş-Şâmî", 5, 156, "Şam"),
  N("ebubekirbmuhammedbzeyd", "أبو بكر بن محمد بن زيد", "Ebû Bekir b. Muhammed b. Zeyd", 5, 150, "Medine"),
  N("ebubekir2", "أبو بكر النهشلي الكوفي", "Ebû Bekir", 5, 166, "Kûfe"),
  N("ebuharbbebielesvedelba", "أبو حرب بن أبي الأسود الديلي البصري", "Ebû Harb b. Ebî el-Esved el-Basrî", 3, 108, "Basra"),
  N("ebuhassanelarec", "أبو حسان الأعرج", "Ebû Hassân el-A‘rec", 4, 130, "Basra"),
  N("ebuabbas", "أبو العباس القلوري", "Ebû Abbâs", 5, 263, "Basra"),
  N("ahmedbsaidbibrahimelme", "أحمد بن سعيد بن إبراهيم الرباطي المروزي أبو عبد الله الأشقر", "Ahmed b. Saîd b. İbrâhim el-Mervezî Ebû Abdullah el-Eşkar", 5, 246, "Horasan"),
  N("ahmedbabdullahbeyyubeb", "أحمد بن عبد الله بن أيوب أبو الوليد بن أبي رجاء الهروي", "Ahmed b. Abdullah b. Eyyûb Ebû el-Velîd b. Ebî Recâ el-Herevî", 5, 232, "Horasan"),
  N("ahmedbabdulvahidbvakid", "أحمد بن عبد الواحد بن واقد التميمي", "Ahmed b. Abdülvâhid b. Vâkid et-Temîmî", 5, 254, "Şam"),
  N("ahmedbmunzirbelbasrieb", "أحمد بن المنذر بن الجارود البصري أبو بكر", "Ahmed b. Münzir b. el-Cârûd el-Basrî Ebû Bekir", 5, 230, "Basra"),
  N("ahmedbnasrbsakireddima", "أحمد بن نصر بن شاكر الدمشقي أبو الحسن بن أبي رجاء", "Ahmed b. Nasr b. Şâkir ed-Dımaşkī Ebû Hasan b. Ebî Recâ", 6, 292, "Şam"),
  N("ahmedbyusufbhalidelezd", "أحمد بن يوسف بن خالد الأزدي أبو الحسن النيسابوري", "Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî", 5, 264, "Horasan"),
  N("ibrahimbziyad", "إبراهيم بن زياد البغدادي", "İbrâhim b. Ziyâd", 5, 228, "Bağdat"),
  N("ibrahimbsalimbebiumeyy", "إبراهيم بن سالم بن أبي أمية التميمي المدني أبو إسحاق", "İbrâhim b. Sâlim b. Ebî Ümeyye et-Temîmî el-Medenî Ebû İshak", 5, 153, "Medine"),
  N("ibrahimbmuhammedb", "إبراهيم بن محمد بن عرعرة", "İbrâhim b. Muhammed b. Ar‘ara", 5, 231, "Bağdat"),
  N("ismailb", "إسماعيل بن صبيح", "İsmâîl b. Subıh", 5, 217, "Kûfe"),
  N("bebielmuharibi", "أشعث بن أبي الشعثاء المحاربي الكوفي", "Eş‘as b. Ebî eş-Şa‘sâ el-Muhâribî", 5, 125, "Kûfe"),
  N("bisrbeddarirebuabdulla", "بشر بن آدم الضرير أبو عبد الله البغدادي", "Bişr b. Âdem ed-Darîr Ebû Abdullah", 5, 218, "Bağdat"),
  N("bisrbelbasriebuheysem", "بشر بن الوضاح البصري أبو الهيثم", "Bişr b. el-Vaddâh el-Basrî Ebû Heysem", 5, 221, "Basra"),
  N("bamrebumuhammed", "بيان بن عمرو البخاري أبو محمد", "Beyân b. Amr Ebû Muhammed", 5, 222, "Mâverâünnehir"),
  N("bebisebre", "الجارود بن أبي سبرة", "el-Cârûd b. Ebî Sebre", 3, 120, "Basra"),
  N("bmuazessulemi", "الجارود بن معاذ السلمي الترمذي", "el-Cârûd b. Muâz es-Sülemî", 5, 244, "Horasan"),
  N("bmusabelkilabiebumuham", "حبان بن موسى بن حبان الكلابي أبو محمد الدمشقي", "Habbân b. Mûsâ b. Habbân el-Kilâbî Ebû Muhammed ed-Dımaşkī", 6, 331, "Şam"),
  N("haccacbebiyakubyusufbh", "حجاج بن أبي يعقوب يوسف بن حجاج الثقفي البغدادي", "Haccâc b. Ebî Ya‘kûb Yûsuf b. Haccâc es-Sekafî", 5, 259, "Bağdat"),
  N("hasanbsucabebuali", "الحسن بن شجاع بن رجاء البلخي أبو علي", "Hasan b. Şücâ‘ b. Recâ Ebû Ali", 5, 244, "Horasan"),
  N("hasanbelbezzar", "الحسن بن الصباح البزار", "Hasan b. es-Sabbâh el-Bezzâr", 5, 249, "Bağdat"),
  N("huseyinbelhuzai", "الحسين بن حريث الخزاعي", "Hüseyin b. Hurays el-Huzâî", 5, 244, "Horasan"),
  N("huseyinbhasanelfezari", "الحسين بن الحسن الأشقر الفزاري الكوفي", "Hüseyin b. Hasan el-Eşkar el-Fezârî", 5, 208, "Kûfe"),
  N("hafsbsuleymanelesedieb", "حفص بن سليمان الأسدي أبو عمر البزاز الكوفي", "Hafs b. Süleymân el-Esedî Ebû Ömer el-Bezzâz", 5, 180, "Kûfe"),
  N("bumareebucafer", "حمدون بن عمارة البغدادي أبو جعفر البزاز", "Hamdûn b. Umâre Ebû Ca‘fer el-Bezzâz", 5, 262, "Bağdat"),
  N("haricebbhariceebuelhac", "خارجة بن مصعب بن خارجة أبو الحجاج السرخسي", "Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc", 5, 168, "Horasan"),
  N("halidbebibekirbubeydba", "خالد بن أبي بكر بن عبيد الله", "Hâlid b. Ebî Bekir b. Ubeydullah", 5, 162, "Medine"),
  N("bnuaymbmurre", "خير بن نعيم بن مرة", "Hayr b. Nuaym b. Mürre", 5, 137, "Mısır"),
  N("rabib", "الربيع بن صبيح", "Rabî‘ b. Subıh", 5, 160, "Basra"),
  N("bhayve", "رجاء بن حيوة", "Recâ b. Hayve", 3, 112, "Şam"),
  N("zeydb", "زيد بن حبان", "Zeyd b. Habbân", 5, 158, "Humus"),
  N("saidbzeydbelezdielcehd", "سعيد بن زيد بن درهم الأزدي الجهضمي أبو الحسن", "Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan", 5, 167, "Basra"),
  N("saidbbvailelhadrami", "سعيد بن عبد الجبار بن وائل الحضرمي الكوفي", "Saîd b. Abdülcebbâr b. Vâil el-Hadramî", 5, 158, "Kûfe"),
  N("saidbebunadrbebisaid", "سعيد بن الفرج البلخي أبو النضر بن أبي سعيد", "Saîd b. el-Ferec Ebû Nadr b. Ebî Saîd", 5, 241, "Horasan"),
  N("sureyhbyezidelhadramie", "شريح بن يزيد الحضرمي أبو حيوة الحمصي المؤذن", "Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin", 5, 203, "Humus"),
  N("salihbelmuzeni", "صالح بن رستم المزني", "Sâlih b. Rüstem el-Müzenî", 5, 152, "Basra"),
  N("abbasb", "عباس بن الفرج الرياشي", "Abbâs b. el-Ferec", 5, 257, "Basra"),
  N("abdullahb", "عبد الله بن عبد الحكم بن أعين المصري أبو محمد الفقيه المالكي", "Abdullah b. Abdülhakem b. A‘yen el-Mısrî Ebû Muhammed el-Fakīh", 5, 214, "Mısır"),
  N("abdullahbmuhammedbabdu", "عبد الله بن محمد بن عبد الله أبو جعفر البخاري", "Abdullah b. Muhammed b. Abdullah Ebû Ca‘fer", 5, 229, "Mâverâünnehir"),
  N("abdullahbebumuhammedel", "عبد الله بن الوضاح أبو محمد الكوفي اللؤلؤي", "Abdullah b. el-Vaddâh Ebû Muhammed el-Lü'lüî", 5, 250, "Kûfe"),
  N("balabelattarelbasriebu", "عبد الجبار بن العلاء بن عبد الجبار العطار البصري أبو بكر", "Abdülcebbâr b. Alâ b. Abdülcebbâr el-Attâr el-Basrî Ebû Bekir", 5, 248, "Mekke"),
  N("bhalidbabdulmelik", "عبد ربه بن خالد بن عبد الملك أبو المغلس البصري", "Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî", 5, 242, "Basra"),
  N("abdirrahmanbsuleymanba", "عبد الرحمن بن سليمان بن عبد الله أبو سليمان المدني", "Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî", 5, 172, "Medine"),
  N("abdirrahmanbsureyhbube", "عبد الرحمن بن شريح بن عبيد الله المعافري", "Abdirrahman b. Şüreyh b. Ubeydullah", 5, 167, "Mısır"),
  N("abdirrahmanbabdullahb", "عبد الرحمن بن عبد الله بن عبد الحكم أبو القاسم", "Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım", 5, 257, "Mısır"),
  N("abdilvarisbubeyd", "عبد الوارث بن عبيد الله العتكي", "Abdilvâris b. Ubeydullah", 5, 239, "Horasan"),
  N("abdeb", "عبدة بن عبد الرحيم بن حسان المروزي أبو سعيد", "Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd", 5, 244, "Şam"),
  N("ubeydbhasanbelhusayn", "عبيد الله بن الحسن بن الحصين", "Ubeydullah b. Hasan b. el-Husayn", 5, 168, "Basra"),
  N("ubeydbebiziyad", "عبيد الله بن أبي زياد", "Ubeydullah b. Ebî Ziyâd", 5, 150, "Mekke"),
  N("ubeydbsadbibrahimebufa", "عبيد الله بن سعد بن إبراهيم أبو الفضل البغدادي", "Ubeydullah b. Sa‘d b. İbrâhim Ebû Fazl", 5, 260, "Bağdat"),
  N("ubeydbsaidbyahyaebuked", "عبيد الله بن سعيد بن يحيى اليشكري أبو قدامة السرخسي", "Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme", 5, 241, "Horasan"),
  N("ubeydbabdullahbomerebu", "عبيد الله بن عبد الله بن عمر أبو بكر شقيق سالم", "Ubeydullah b. Abdullah b. Ömer Ebû Bekir Şakīk Sâlim", 3, 106, "Medine"),
  N("ubeydbabdulmecidebuali", "عبيد الله بن عبد المجيد الحنفي أبو علي البصري", "Ubeydullah b. Abdülmecîd Ebû Ali el-Basrî", 5, 209, "Basra"),
  N("ubeydbubeydelesceiebua", "عبيد الله بن عبيد الرحمن الأشجعي أبو عبد الرحمن الكوفي", "Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman", 5, 182, "Kûfe"),
  N("ubeydbamrbebielvelideb", "عبيد الله بن عمرو بن أبي الوليد الرقي أبو وهب الأسدي", "Ubeydullah b. Amr b. Ebî el-Velîd Ebû Vehb el-Esedî", 5, 180, "Humus"),
  N("ubeydbmuhammedbyezid", "عبيد الله بن محمد بن يزيد", "Ubeydullah b. Muhammed b. Yezîd", 5, 252, "Mekke"),
  N("ubeydbmuazbmuazebuamre", "عبيد الله بن معاذ بن معاذ أبو عمرو البصري", "Ubeydullah b. Muâz b. Muâz Ebû Amr el-Basrî", 5, 237, "Basra"),
  N("ubeydb", "عبيد بن عقيل", "Ubeyd b. Ukayl", 5, 207, "Basra"),
  N("ubeydebhumeydebuabdirr", "عبيدة بن حميد الكوفي أبو عبد الرحمن", "Ubeyde b. Humeyd Ebû Abdirrahman", 5, 190, "Kûfe"),
  N("osmanbabdirrahmanbmusl", "عثمان بن عبد الرحمن بن مسلم الحراني", "Osmân b. Abdirrahman b. Müslim", 5, 202, "Humus"),
  N("amrbasimbubeydelkilabi", "عمرو بن عاصم بن عبيد الله الكلابي القيسي أبو عثمان", "Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân", 5, 213, "Basra"),
  N("alabelensari", "العلاء بن عبد الجبار الأنصاري", "Alâ b. Abdülcebbâr el-Ensârî", 5, 212, "Mekke"),
  N("isabtalhabubeydetteymi", "عيسى بن طلحة بن عبيد الله التيمي أبو محمد المدني", "Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî", 3, 100, "Medine"),
  N("gaylanbcamibelmuharibi", "غيلان بن جامع بن أشعث المحاربي أبو عبد الله الكوفي", "Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah", 5, 132, "Kûfe"),
  N("muhammedbahmedbelcerra", "محمد بن أحمد بن الجراح أبو عبد الرحيم الجوزجاني", "Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm", 5, 245, "Horasan"),
  N("muhammedbbkayselkindie", "محمد بن الأشعث بن قيس الكندي أبو القاسم الكوفي", "Muhammed b. el-Eş‘as b. Kays el-Kindî Ebû Kâsım", 2, 67, "Kûfe"),
  N("muhammedbselemebebi", "محمد بن سلمة بن أبي فاطمة المرادي الجملي", "Muhammed b. Seleme b. Ebî Fâtıma", 5, 248, "Mısır"),
  N("muhammedbeddulabiebuca", "محمد بن الصباح البزاز الدولابي أبو جعفر البغدادي", "Muhammed b. es-Sabbâh el-Bezzâz ed-Dûlâbî Ebû Ca‘fer", 5, 227, "Bağdat"),
  N("muhammedbbmalikennehai", "محمد بن الطفيل بن مالك النخعي أبو جعفر الكوفي", "Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer", 5, 222, "Kûfe"),
  N("muhammedbabdullahb", "محمد بن عبد الله بن عبد الحكم", "Muhammed b. Abdullah b. Abdülhakem", 5, 268, "Mısır"),
  N("muhammedbabdullahb2", "محمد بن عبد الله بن عبد الرحيم", "Muhammed b. Abdullah b. Abdürrahîm", 5, 249, "Mısır"),
  N("muhammedbabdullahb3", "محمد بن عبد الله بن المثنى", "Muhammed b. Abdullah b. el-Müsennâ", 5, 215, "Basra"),
  N("muhammedbabdirrahmanbe", "محمد بن عبد الرحمن بن الأشعث العجلي أبو بكر الدمشقي", "Muhammed b. Abdirrahman b. el-Eş‘as Ebû Bekir ed-Dımaşkī", 5, 266, "Şam"),
  N("muhammedb", "محمد بن عبد الرحيم بن أبي زهير البغدادي البزاز أبو يحيى", "Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ", 5, 255, "Bağdat"),
  N("muhammedbabdulmelikbeb", "محمد بن عبد الملك بن أبي الشوارب الأموي البصري", "Muhammed b. Abdülmelik b. Ebî eş-Şevârib el-Basrî", 5, 244, "Basra"),
  N("muhammedbubeydbabdilaz", "محمد بن عبيد الله بن عبد العظيم الكريزي", "Muhammed b. Ubeydullah b. Abdil‘azīm", 5, 260, "Basra"),
  N("muhammedbelbunani", "محمد بن محبوب البناني", "Muhammed b. Mahbûb el-Bünânî", 5, 223, "Basra"),
  N("muhammedbeddarirebuabd", "محمد بن المنهال الضرير أبو عبد الله", "Muhammed b. el-Minhâl ed-Darîr Ebû Abdullah", 5, 231, "Basra"),
  N("muhammedbharunbibrahim", "محمد بن هارون بن إبراهيم الربعي أبو جعفر البغدادي البزاز أبو نشيط", "Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît", 5, 258, "Bağdat"),
  N("muhammedbyahyab", "محمد بن يحيى بن حبان", "Muhammed b. Yahyâ b. Habbân", 4, 121, "Medine"),
  N("b", "المثنى بن الصباح", "el-Müsennâ b. es-Sabbâh", 5, 149, "Mekke"),
  N("bmusaebusalihelferra", "محبوب بن موسى أبو صالح الأنطاكي الفراء", "Mahbûb b. Mûsâ Ebû Sâlih el-Ferrâ", 5, 231, "Mâverâünnehir"),
  N("bsadbebivakkasezzuhrie", "مصعب بن سعد بن أبي وقاص الزهري أبو زرارة المدني", "Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî", 3, 103, "Medine"),
  N("babdullahbebuabdullahe", "مصعب بن عبد الله بن مصعب أبو عبد الله الزبيري المدني", "Mus‘ab b. Abdullah b. Mus‘ab Ebû Abdullah el-Medenî", 5, 236, "Bağdat"),
  N("muazbmuazbnasrebuelbas", "معاذ بن معاذ بن نصر أبو المثنى البصري القاضي", "Muâz b. Muâz b. Nasr Ebû el-Müsennâ el-Basrî el-Kādî", 5, 196, "Basra"),
  N("muaviyebsalihbebiubeyd", "معاوية بن صالح بن أبي عبيد الله الأشعري أبو عبيد الله الدمشقي", "Muâviye b. Sâlih b. Ebî Ubeydullah el-Eş‘arî Ebû Ubeydullah ed-Dımaşkī", 5, 263, "Şam"),
  N("makilbubeydelcezeriebu", "معقل بن عبيد الله الجزري أبو عبد الله العبسي", "Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah", 5, 166, "Humus"),
  N("nadrb", "النضر بن عبد الجبار المرادي", "Nadr b. Abdülcebbâr", 5, 219, "Mısır"),
  N("hilalbbisrbelmuzeniebu", "هلال بن بشر بن محبوب المزني أبو الحسن البصري", "Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî", 5, 246, "Basra"),
  N("vehbbsadeveyhebuabdull", "وهب بن بيان الواسطي أبو عبد الله", "Vehb b. Beyân el-Vâsıtî Ebû Abdullah", 5, 246, "Mısır"),
  N("yasinb", "ياسين بن عبد الأحد بن أبي زرارة القتباني", "Yâsîn b. Abdülehad b. Ebî Zürâre el-Kütbânî", 5, 269, "Mısır"),
  N("yahyababdullahbubeydeb", "يحيى بن عبد الله بن عبيد الله", "Yahyâ b. Abdullah b. Ubeydullah", 5, 173, "Mekke"),
  N("yahyabkesirbelanberi", "يحيى بن كثير بن درهم العنبري", "Yahyâ b. Kesîr b. Dirhem el-Anberî", 5, 206, "Basra"),
  N("yezidbezzubeydi", "يزيد بن عبد ربه الزبيدي", "Yezîd b. Abdürabbih ez-Zübeydî", 5, 224, "Humus"),
  N("yakubbabdullahbebuyusu", "يعقوب بن عبد الله بن الأشج أبو يوسف المدني", "Ya‘kûb b. Abdullah b. el-Eşecc Ebû Yûsuf el-Medenî", 5, 122, "Medine"),
];

const KUFE_EDGES = [
  /* Ali b. Ebî Tâlib -- talebeleri */
  E("ali", "abdullahbisababdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ebî Tâlib tercemesi"),
  /* Ebû Hüreyre -- talebeleri */
  E("ebuhureyre", "sinanbebisinanelmedeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hüreyre tercemesi"),
  E("ebuhureyre", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hüreyre tercemesi"),
  E("ebuhureyre", "ubeydbhuneyn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hüreyre tercemesi"),
  /* Mikdâd b. el-Esved -- talebeleri */
  E("mikdad", "hemmambelharisbkays", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mikdâd b. el-Esved tercemesi"),
  E("mikdad", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mikdâd b. el-Esved tercemesi"),
  /* Üsâme b. Zeyd -- talebeleri */
  E("usame", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Üsâme b. Zeyd tercemesi"),
  /* Fazl b. Abbâs -- talebeleri */
  E("fadl", "umeyrbabdullahebuabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Abbâs tercemesi"),
  /* İbn Ebî Zi’b -- hocalari */
  E("abdullahbsaibbyezidelk", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Zi’b tercemesi"),
  E("abdirrahmanbata", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Zi’b tercemesi"),
  /* İbn Ebî Zi’b -- talebeleri */
  E("ibnebizib", "muhammedbibrahimbdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Zi’b tercemesi"),
  /* Humeydî -- talebeleri */
  E("humeydi", "muhammedbahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Humeydî tercemesi"),
  /* Süleymân b. Harb -- hocalari */
  E("yezidbibrahim", "suleymanharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Harb tercemesi"),
  /* Abdullah b. Abbâs -- talebeleri */
  E("ibnabbas", "saidbzeydbelezdielcehd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abbâs tercemesi"),
  E("ibnabbas", "talhababdullahbavfezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abbâs tercemesi"),
  E("ibnabbas", "ubeydbhuneyn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abbâs tercemesi"),
  E("ibnabbas", "ebuhassanelarec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abbâs tercemesi"),
  /* Abdullah b. Ömer -- talebeleri */
  E("ibnomer", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer tercemesi"),
  /* Esved b. Yezîd en-Nehaî -- talebeleri */
  E("esvedyezid", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esved b. Yezîd en-Nehaî tercemesi"),
  /* Ubeyde es-Selmânî -- talebeleri */
  E("ubeydesel", "ebuhassanelarec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyde es-Selmânî tercemesi"),
  /* Zir b. Hubeyş el-Esedî -- talebeleri */
  E("zirhubeys", "isabhafsbasimebuziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zir b. Hubeyş el-Esedî tercemesi"),
  /* Hasan-ı Basrî -- talebeleri */
  E("hasanbasri", "rabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan-ı Basrî tercemesi"),
  E("hasanbasri", "osmanbmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan-ı Basrî tercemesi"),
  /* Ebü't-Tufeyl Âmir b. Vâsile -- talebeleri */
  E("ebutufeyl", "kulsumbcebrelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebü't-Tufeyl Âmir b. Vâsile tercemesi"),
  /* Hâris b. Süveyd et-Teymî -- talebeleri */
  E("harissuveyd", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâris b. Süveyd et-Teymî tercemesi"),
  /* Sâlim b. Ebü'l-Ca‘d -- talebeleri */
  E("salimcad", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Ebü'l-Ca‘d tercemesi"),
  /* Büsr b. Saîd -- talebeleri */
  E("busrsaid", "yakubbabdullahbebuyusu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Büsr b. Saîd tercemesi"),
  /* Esved b. Hilâl el-Muhâribî -- talebeleri */
  E("esvedhilal", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esved b. Hilâl el-Muhâribî tercemesi"),
  /* Abdurrahman b. Ebî Leylâ -- talebeleri */
  E("ibnebileyla", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Ebî Leylâ tercemesi"),
  /* Urve b. ez-Zübeyr -- talebeleri */
  E("urve", "temimbselemeessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Urve b. ez-Zübeyr tercemesi"),
  /* İkrime mevlâ İbn Abbâs -- talebeleri */
  E("ikrime", "hakembebanebuisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  E("ikrime", "abdullahbisababdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  E("ikrime", "muhammedbebiyahyaelmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  E("ikrime", "yezidbebisaidennahvieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  E("ikrime", "yezidbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime mevlâ İbn Abbâs tercemesi"),
  /* Osman b. Affân -- talebeleri */
  E("osman", "ubeydbabdullahbomerebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osman b. Affân tercemesi"),
  /* Ebû Saîd el-Hudrî -- talebeleri */
  E("ebusaid", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Hudrî tercemesi"),
  E("ebusaid", "ubeydbhuneyn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Hudrî tercemesi"),
  /* Eş‘as b. Kays el-Kindî -- talebeleri */
  E("esaskays", "abdirrahmanbabdullahbm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eş‘as b. Kays el-Kindî tercemesi"),
  /* Cerîr b. Abdillâh el-Becelî -- talebeleri */
  E("cerirbecelî", "hemmambelharisbkays", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Abdillâh el-Becelî tercemesi"),
  /* Sâib b. Yezîd -- talebeleri */
  E("saibyezid", "abdirrahmanbhumeydbabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâib b. Yezîd tercemesi"),
  /* Atâ b. Ebî Rebâh -- talebeleri */
  E("ataebirebah", "habibelmuallimebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Rebâh tercemesi"),
  E("ataebirebah", "muhammedbabdirrahmanbe2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Rebâh tercemesi"),
  /* Abdullah b. Amr b. el-Âs -- talebeleri */
  E("abdullahamr", "ebuharbbebielesvedelba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Amr b. el-Âs tercemesi"),
  /* Sehl b. Sa‘d es-Sâidî -- talebeleri */
  E("sehlsad", "yahyabmeymunelhadramie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Sa‘d es-Sâidî tercemesi"),
  /* Ebû Ümâme el-Bâhilî -- talebeleri */
  E("ebuumame", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Ümâme el-Bâhilî tercemesi"),
  E("ebuumame", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Ümâme el-Bâhilî tercemesi"),
  /* İbn Şihâb ez-Zührî -- hocalari */
  E("amirbsadbebivakkasezzu", "ibnsihab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Şihâb ez-Zührî tercemesi"),
  E("ismailbmuhammedbsadebi", "ibnsihab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Şihâb ez-Zührî tercemesi"),
  E("talhababdullahbavfezzu", "ibnsihab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Şihâb ez-Zührî tercemesi"),
  /* İbn Şihâb ez-Zührî -- talebeleri */
  E("ibnsihab", "abdullahbabdullahbuvey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Şihâb ez-Zührî tercemesi"),
  /* Amr b. Dînâr -- hocalari */
  E("amirbsadbebivakkasezzu", "amrdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Dînâr tercemesi"),
  E("amirbabdullahbezzubeyr", "amrdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Dînâr tercemesi"),
  /* Amr b. Dînâr -- talebeleri */
  E("amrdinar", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Dînâr tercemesi"),
  /* Katâde b. Diâme es-Sedûsî -- hocalari */
  E("ebuhassanelarec", "katade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Katâde b. Diâme es-Sedûsî tercemesi"),
  /* Katâde b. Diâme es-Sedûsî -- talebeleri */
  E("katade", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Katâde b. Diâme es-Sedûsî tercemesi"),
  /* Ebû İshak es-Sebîî -- hocalari */
  E("adibfazletteymiebuhati", "ebuishaksebii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak es-Sebîî tercemesi"),
  /* Ebû İshak es-Sebîî -- talebeleri */
  E("ebuishaksebii", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak es-Sebîî tercemesi"),
  /* A‘meş -- talebeleri */
  E("amess", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, A‘meş tercemesi"),
  /* Mâlik b. Enes -- hocalari */
  E("muhammedbyahyab", "malik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  /* Mâlik b. Enes -- talebeleri */
  E("malik", "kasimbyezidelcermi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "yahyababdullahbbukeyre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "ismailbmusaelfezariebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "babdullahbebuabdullahe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  E("malik", "utbebabdullahbutbeebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Enes tercemesi"),
  /* Muhammed b. İshak -- hocalari */
  E("muhammedbyahyab", "ibnishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak tercemesi"),
  /* İbn Cüreyc -- hocalari */
  E("ismailbmuhammedbsadebi", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Cüreyc tercemesi"),
  E("abdullahbkuleybbkeysan", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Cüreyc tercemesi"),
  /* İbn Cüreyc -- talebeleri */
  E("ibncureyc", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Cüreyc tercemesi"),
  E("ibncureyc", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Cüreyc tercemesi"),
  E("ibncureyc", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Cüreyc tercemesi"),
  /* Süfyân b. Uyeyne -- hocalari */
  E("eyyubbmusabamrebumusae", "ibnuyeyne", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân b. Uyeyne tercemesi"),
  /* İbn Ebî Arûbe -- hocalari */
  E("alibhakemelbunani", "ibnebiaruba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Arûbe tercemesi"),
  /* İbn Ebî Arûbe -- talebeleri */
  E("ibnebiaruba", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Arûbe tercemesi"),
  /* Ebû Avâne el-Vâsıtî -- talebeleri */
  E("ebuavane", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Avâne el-Vâsıtî tercemesi"),
  E("ebuavane", "ahmedbishakbzeydebiish", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Avâne el-Vâsıtî tercemesi"),
  E("ebuavane", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Avâne el-Vâsıtî tercemesi"),
  /* Şu‘be b. el-Haccâc -- hocalari */
  E("ibrahimbmeymunrafielme", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("bebielmuharibi", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("eyyubbmusabamrebumusae", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("davudbyezidbabdirrahma", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("abdullahbisababdirrahm", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("ubeydbhasanbelhusayn", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("osmanbmuslim", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("atabebimeymuneelbasrie", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("gaylanbcamibelmuharibi", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("yezidbebiziyad", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  E("yakubbatabebirebahelme", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şu‘be b. el-Haccâc tercemesi"),
  /* Ma‘mer b. Râşid -- hocalari */
  E("hakembebanebuisa", "mamer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘mer b. Râşid tercemesi"),
  /* Ma‘mer b. Râşid -- talebeleri */
  E("mamer", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘mer b. Râşid tercemesi"),
  E("mamer", "muhammedbsevressananie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘mer b. Râşid tercemesi"),
  /* Süfyân es-Sevrî -- hocalari */
  E("eyyubbmusabamrebumusae", "sevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  /* Süfyân es-Sevrî -- talebeleri */
  E("sevri", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  E("sevri", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  E("sevri", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  E("sevri", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  E("sevri", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân es-Sevrî tercemesi"),
  /* Evzâî -- talebeleri */
  E("evzai", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Evzâî tercemesi"),
  E("evzai", "yahyabhamzabvakidelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Evzâî tercemesi"),
  /* Hüşeym b. Beşîr -- talebeleri */
  E("huseym", "amrbzurarebvakidelkila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüşeym b. Beşîr tercemesi"),
  /* Yahyâ b. Âdem -- hocalari */
  E("hasanbayyas", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Âdem tercemesi"),
  /* Yahyâ b. Âdem -- talebeleri */
  E("yahyaadem", "ahmedbabdullahbeyyubeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Âdem tercemesi"),
  /* İbn Ebî Zâide -- talebeleri */
  E("ibnebizaide", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Zâide tercemesi"),
  E("ibnebizaide", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Zâide tercemesi"),
  /* Vekî‘ b. el-Cerrâh -- hocalari */
  E("talhabyahyabtalha", "veki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vekî‘ b. el-Cerrâh tercemesi"),
  E("yezidbibrahim", "veki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vekî‘ b. el-Cerrâh tercemesi"),
  E("abdirrahmanbabdullahbo", "veki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vekî‘ b. el-Cerrâh tercemesi"),
  /* Abdullah b. el-Mübârek -- hocalari */
  E("suleymanbabdirrahmanbi", "ibnmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("talhabebisaidebuabdulm", "ibnmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  /* Abdullah b. el-Mübârek -- talebeleri */
  E("ibnmubarek", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "nuaymbhammadbmuaviyeeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "bisrbmuhammedessahtiya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "selemebsuleymanelmerve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  E("ibnmubarek", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Mübârek tercemesi"),
  /* Yahyâ b. Saîd el-Kattân -- hocalari */
  E("yezidbubeyd", "kattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd el-Kattân tercemesi"),
  /* Abdurrahman b. Mehdî -- hocalari */
  E("muhammedbelharisbrasid", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Mehdî tercemesi"),
  /* Abdurrahman b. Mehdî -- talebeleri */
  E("ibnmehdi", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Mehdî tercemesi"),
  /* Ubeydullah b. Abdillâh b. Utbe -- hocalari */
  E("abdullahbabdullahbebit", "ubeydullahutbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Abdillâh b. Utbe tercemesi"),
  /* Ubeydullah b. Abdillâh b. Utbe -- talebeleri */
  E("ubeydullahutbe", "talhabyahyabtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Abdillâh b. Utbe tercemesi"),
  /* Abdurrahman b. Hürmüz el-A‘rec -- talebeleri */
  E("arac", "muhammedbyahyab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Hürmüz el-A‘rec tercemesi"),
  /* Râfi‘ b. Hadîc -- talebeleri */
  E("rafihadic", "muhammedbyahyab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râfi‘ b. Hadîc tercemesi"),
  /* Sâlih b. Keysân -- hocalari */
  E("ismailbmuhammedbsadebi", "salihkeysan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Keysân tercemesi"),
  /* İbrâhim en-Nehaî -- hocalari */
  E("hemmambelharisbkays", "nehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim en-Nehaî tercemesi"),
  /* Hemmâm b. Yahyâ -- talebeleri */
  E("hemmamyahya", "ahmedbishakbzeydebiish", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hemmâm b. Yahyâ tercemesi"),
  E("hemmamyahya", "muazbhanielbasriebuhan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hemmâm b. Yahyâ tercemesi"),
  /* Cerîr b. Hâzim -- talebeleri */
  E("cerirhazim", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Hâzim tercemesi"),
  /* Cerîr b. Abdilhamîd -- hocalari */
  E("yezidbebiziyad", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Abdilhamîd tercemesi"),
  /* Cerîr b. Abdilhamîd -- talebeleri */
  E("cerirabdulhamid", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Cerîr b. Abdilhamîd tercemesi"),
  /* Leys b. Sa‘d -- hocalari */
  E("elharisbyakubelensari", "leysbsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("eyyubbmusabamrebumusae", "leysbsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("hasanbsevbanbamir", "leysbsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  /* Leys b. Sa‘d -- talebeleri */
  E("leysbsad", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "yakubbibrahimbsadebuyu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "yahyabishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "zeydbyahyabubeydelhuza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "amrbrabibtarik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "yahyababdullahbbukeyre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "kasimbkesirbnumanebuab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  E("leysbsad", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Sa‘d tercemesi"),
  /* Mis‘ar b. Kedâm -- talebeleri */
  E("misersukdam", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mis‘ar b. Kedâm tercemesi"),
  /* Abdullah b. İdrîs -- hocalari */
  E("yezidbebiziyad", "ibnidris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İdrîs tercemesi"),
  /* Ali b. Müshir -- talebeleri */
  E("alimushir", "bisrbeddarirebuabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Müshir tercemesi"),
  E("alimushir", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Müshir tercemesi"),
  /* Saîd b. Cübeyr -- talebeleri */
  E("saidcubeyr", "bebielmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Cübeyr tercemesi"),
  /* Muhammed b. Ali el-Bâkır -- talebeleri */
  E("ebucafermuhbakir", "kasimbfazl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali el-Bâkır tercemesi"),
  /* Ebû Seleme b. Abdirrahman -- talebeleri */
  E("ebuselemeavf", "omerbhakembsevbanelmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Seleme b. Abdirrahman tercemesi"),
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
  E("serikkadi", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şerîk b. Abdillâh en-Nehaî tercemesi"),
  E("serikkadi", "yakubbibrahimbsadebuyu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şerîk b. Abdillâh en-Nehaî tercemesi"),
  E("serikkadi", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şerîk b. Abdillâh en-Nehaî tercemesi"),
  /* Saîd b. Yesâr -- talebeleri */
  E("saidyesar", "elharisbyakubelensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Yesâr tercemesi"),
  /* Sâbit el-Bünânî -- talebeleri */
  E("sabitbunani", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit el-Bünânî tercemesi"),
  /* Dahhâk b. Müzâhim -- talebeleri */
  E("dahhak", "alibhakemelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dahhâk b. Müzâhim tercemesi"),
  /* Ubeydullah b. Ebî Yezîd -- hocalari */
  E("huseyinbalibhuseyinebi", "ubeydullahebiyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Yezîd tercemesi"),
  /* İbn Ebî Müleyke -- talebeleri */
  E("ibnebimuleyke", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Ebî Müleyke tercemesi"),
  /* Humeyd et-Tavîl -- talebeleri */
  E("humeydtavil", "kureysbeneselensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Humeyd et-Tavîl tercemesi"),
  /* Rabîa b. Ebî Abdirrahman (Rabîatü'r-re'y) -- hocalari */
  E("muhammedbyahyab", "rebiaebiabdrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabîa b. Ebî Abdirrahman (Rabîatü'r-re'y) tercemesi"),
  /* Ebû'z-Zübeyr el-Mekkî -- talebeleri */
  E("ebuzubeyrmekki", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'z-Zübeyr el-Mekkî tercemesi"),
  E("ebuzubeyrmekki", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'z-Zübeyr el-Mekkî tercemesi"),
  /* Muhammed b. el-Münkedir -- hocalari */
  E("amirbsadbebivakkasezzu", "ibnmunkedir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Münkedir tercemesi"),
  /* Muhammed b. el-Münkedir -- talebeleri */
  E("ibnmunkedir", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Münkedir tercemesi"),
  E("ibnmunkedir", "osmanbhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Münkedir tercemesi"),
  /* Muhammed b. Abbâd b. Ca‘fer -- talebeleri */
  E("muhammedabbadcafer", "isabmusaebuahmedelezra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abbâd b. Ca‘fer tercemesi"),
  /* Kaz‘a b. Yahyâ -- talebeleri */
  E("kazaayahya", "atiyyebkayselkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kaz‘a b. Yahyâ tercemesi"),
  E("kazaayahya", "ismailbmuhammedbsadebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kaz‘a b. Yahyâ tercemesi"),
  /* Muhammed b. Sîrîn -- talebeleri */
  E("ibnsirin", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sîrîn tercemesi"),
  /* Kâsım b. Muhaymire -- hocalari */
  E("suleymanbbureydebelhas", "kasimmuhaymire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Muhaymire tercemesi"),
  /* Yahyâ b. Umâre el-Mâzinî -- talebeleri */
  E("yahyaumare", "muhammedbyahyab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Umâre el-Mâzinî tercemesi"),
  /* Ebû Saîd el-Makburî -- talebeleri */
  E("ebusaidmakburi", "eyyubbmusabamrebumusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Makburî tercemesi"),
  E("ebusaidmakburi", "talhabebisaidebuabdulm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Makburî tercemesi"),
  /* Humeyd b. Kays el-Mekkî el-A‘rec -- talebeleri */
  E("humeyskaysarac", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Humeyd b. Kays el-Mekkî el-A‘rec tercemesi"),
  /* Sâlim Ebû'n-Nadr -- hocalari */
  E("amirbsadbebivakkasezzu", "salimebinadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim Ebû'n-Nadr tercemesi"),
  E("ubeydbhuneyn", "salimebinadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim Ebû'n-Nadr tercemesi"),
  /* Yezîd b. Abdillâh b. el-Hâd -- hocalari */
  E("ziyadbebiziyadmeyseree", "yezidhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdillâh b. el-Hâd tercemesi"),
  /* Abdullah b. Vehb -- hocalari */
  E("abdirrahmanbsureyhbube", "ibnvehb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  E("saidbabdirrahmanelcuma", "ibnvehb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  E("hafsbmeysereelukayli", "ibnvehb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  /* Abdullah b. Vehb -- talebeleri */
  E("ibnvehb", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  E("ibnvehb", "muhammedbselemebebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  E("ibnvehb", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Vehb tercemesi"),
  /* Ka‘nevî, Abdullah b. Mesleme -- hocalari */
  E("yezidbibrahim", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ka‘nevî, Abdullah b. Mesleme tercemesi"),
  /* Ka‘nevî, Abdullah b. Mesleme -- talebeleri */
  E("kanebi", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ka‘nevî, Abdullah b. Mesleme tercemesi"),
  E("kanebi", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ka‘nevî, Abdullah b. Mesleme tercemesi"),
  E("kanebi", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ka‘nevî, Abdullah b. Mesleme tercemesi"),
  /* İbn Kâsım el-Mısrî -- talebeleri */
  E("ibnkasimmisri", "muhammedbselemebebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Kâsım el-Mısrî tercemesi"),
  E("ibnkasimmisri", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbn Kâsım el-Mısrî tercemesi"),
  /* Muhammed b. İdrîs eş-Şâfiî -- talebeleri */
  E("safii", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İdrîs eş-Şâfiî tercemesi"),
  /* Kuteybe b. Saîd -- hocalari */
  E("halefbhalifebsaidelesc", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  E("abdullahbzeydbeslemela", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  E("caferbsuleymaneddubai", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  E("sehlbyusufelbasri", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  /* Kuteybe b. Saîd -- talebeleri */
  E("kuteybesaid", "nuaymbhammadbmuaviyeeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kuteybe b. Saîd tercemesi"),
  /* Velîd b. Müslim -- hocalari */
  E("musabeyyubbamir", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  /* Velîd b. Müslim -- talebeleri */
  E("velidmuslim", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  E("velidmuslim", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  E("velidmuslim", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Velîd b. Müslim tercemesi"),
  /* Ebû Nuaym el-Fazl b. Dükeyn -- talebeleri */
  E("ebunuaymfadl", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Nuaym el-Fazl b. Dükeyn tercemesi"),
  E("ebunuaymfadl", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Nuaym el-Fazl b. Dükeyn tercemesi"),
  E("ebunuaymfadl", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Nuaym el-Fazl b. Dükeyn tercemesi"),
  /* Ebû Âsım ed-Dahhâk b. Mahled -- hocalari */
  E("yezidbubeyd", "ebuasimnebil", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Âsım ed-Dahhâk b. Mahled tercemesi"),
  /* Ebû Âsım ed-Dahhâk b. Mahled -- talebeleri */
  E("ebuasimnebil", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Âsım ed-Dahhâk b. Mahled tercemesi"),
  /* Hâlid el-Hazzâ -- hocalari */
  E("atabebimeymuneelbasrie", "halidhazza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid el-Hazzâ tercemesi"),
  /* Husayn b. Abdirrahman -- talebeleri */
  E("husaynabdrahman", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Husayn b. Abdirrahman tercemesi"),
  /* Câmi‘ b. Şeddâd -- hocalari */
  E("amirbabdullahbezzubeyr", "cameseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câmi‘ b. Şeddâd tercemesi"),
  /* Muhammed b. Ca‘fer Günder -- talebeleri */
  E("gunder", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer Günder tercemesi"),
  /* Yezîd b. Hârûn -- hocalari */
  E("rabibmuslimelcumahiebu", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Hârûn tercemesi"),
  /* Yezîd b. Hârûn -- talebeleri */
  E("yezidharun", "bamrebumuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Hârûn tercemesi"),
  E("yezidharun", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Hârûn tercemesi"),
  /* Yezîd b. Zürey‘ -- hocalari */
  E("habibelmuallimebumuham", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  E("ruhbkasimettemimielanb", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  /* Yezîd b. Zürey‘ -- talebeleri */
  E("yezidzurey", "yahyabgaylanbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  E("yezidzurey", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  E("yezidzurey", "hasanbomerbsakikelcerm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  E("yezidzurey", "muhammedbeddarirebuabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  E("yezidzurey", "muhammedbabdulmelikbeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Zürey‘ tercemesi"),
  /* Nadr b. Şümeyl -- talebeleri */
  E("nadrsumeyl", "bamrebumuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Şümeyl tercemesi"),
  E("nadrsumeyl", "yahyabmuhammedbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Şümeyl tercemesi"),
  /* Ebû Dâvûd et-Tayâlisî -- hocalari */
  E("zuheyrbmuhammed", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Dâvûd et-Tayâlisî tercemesi"),
  E("yezidbibrahim", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Dâvûd et-Tayâlisî tercemesi"),
  /* Muâz b. Muâz el-Anberî -- talebeleri */
  E("muazmuaz", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Muâz el-Anberî tercemesi"),
  E("muazmuaz", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Muâz el-Anberî tercemesi"),
  E("muazmuaz", "amrbzurarebvakidelkila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Muâz el-Anberî tercemesi"),
  /* Affân b. Müslim -- talebeleri */
  E("affanmuslim", "ishakbibrahimbyunuselv", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Affân b. Müslim tercemesi"),
  E("affanmuslim", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Affân b. Müslim tercemesi"),
  /* Ali b. el-Ca‘d -- hocalari */
  E("abdirrahmanbsabitbsevb", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  E("yezidbibrahim", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  /* Ali b. el-Ca‘d -- talebeleri */
  E("alicad", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  E("alicad", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  E("alicad", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Ca‘d tercemesi"),
  /* Ísâ b. Yûnus -- hocalari */
  E("osmanbhakim", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ísâ b. Yûnus tercemesi"),
  /* Ísâ b. Yûnus -- talebeleri */
  E("isabyunus", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ísâ b. Yûnus tercemesi"),
  /* Sevr b. Yezîd er-Rahbî -- hocalari */
  E("bhayve", "sevryezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sevr b. Yezîd er-Rahbî tercemesi"),
  /* Sevr b. Yezîd er-Rahbî -- talebeleri */
  E("sevryezid", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sevr b. Yezîd er-Rahbî tercemesi"),
  E("sevryezid", "yahyabhamzabvakidelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sevr b. Yezîd er-Rahbî tercemesi"),
  /* İsmâîl b. Ümeyye -- hocalari */
  E("muhammedbyahyab", "ismailumeyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ümeyye tercemesi"),
  /* İsmâîl b. Ümeyye -- talebeleri */
  E("ismailumeyye", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ümeyye tercemesi"),
  /* Abdürrezzâk b. Hemmâm -- hocalari */
  E("caferbsuleymaneddubai", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürrezzâk b. Hemmâm tercemesi"),
  /* Abdürrezzâk b. Hemmâm -- talebeleri */
  E("abdurrezzak", "ishakbibrahimbnasrebui", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürrezzâk b. Hemmâm tercemesi"),
  /* Süleymân b. Bilâl -- talebeleri */
  E("suleymanbilal", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Bilâl tercemesi"),
  /* Hişâm b. Urve -- talebeleri */
  E("hisamurve", "yahyababdullahbsalim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Urve tercemesi"),
  E("hisamurve", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Urve tercemesi"),
  E("hisamurve", "saidbabdirrahmanelcuma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Urve tercemesi"),
  E("hisamurve", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Urve tercemesi"),
  /* Mansûr b. el-Mu‘temir -- hocalari */
  E("temimbselemeessulemi", "mansurmutemir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. el-Mu‘temir tercemesi"),
  /* Mansûr b. el-Mu‘temir -- talebeleri */
  E("mansurmutemir", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. el-Mu‘temir tercemesi"),
  E("mansurmutemir", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. el-Mu‘temir tercemesi"),
  /* Mûsâ b. Ukbe -- hocalari */
  E("muhammedbyahyab", "musaukbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ukbe tercemesi"),
  /* Mûsâ b. Ukbe -- talebeleri */
  E("musaukbe", "hafsbmeysereelukayli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ukbe tercemesi"),
  /* Muhammed b. Aclân -- hocalari */
  E("bhayve", "muhammedacilan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Aclân tercemesi"),
  E("amirbabdullahbezzubeyr", "muhammedacilan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Aclân tercemesi"),
  E("muhammedbyahyab", "muhammedacilan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Aclân tercemesi"),
  /* Muhammed b. Amr b. Alkame -- hocalari */
  E("omerbhakembsevbanelmed", "muhammedamralkame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Alkame tercemesi"),
  /* Muhammed b. Sûka -- talebeleri */
  E("muhammedsuka", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sûka tercemesi"),
  E("muhammedsuka", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sûka tercemesi"),
  /* Mutarrif b. Tarîf -- talebeleri */
  E("mutarriftarif", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mutarrif b. Tarîf tercemesi"),
  /* Ebû İshak eş-Şeybânî -- hocalari */
  E("bebielmuharibi", "ismailebiislamsibani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İshak eş-Şeybânî tercemesi"),
  /* Ahmed b. Hanbel -- talebeleri */
  E("ahmedhanbel", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Hanbel tercemesi"),
  E("ahmedhanbel", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Hanbel tercemesi"),
  /* Ahmed b. Manî‘ el-Bağavî -- hocalari */
  E("mervanbsucaelcezeriebu", "ahmedmeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Manî‘ el-Bağavî tercemesi"),
  /* Abdullah b. Tâvûs -- hocalari */
  E("muhammedbibrahimbelhar", "abdullahtavus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Tâvûs tercemesi"),
  /* Abdullah b. Tâvûs -- talebeleri */
  E("abdullahtavus", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Tâvûs tercemesi"),
  /* Abdülkerîm b. Mâlik el-Cezerî -- talebeleri */
  E("abdulkerimcezeri", "ubeydbamrbebielvelideb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülkerîm b. Mâlik el-Cezerî tercemesi"),
  /* İkrime b. Hâlid el-Mahzûmî -- talebeleri */
  E("ikrimehalid", "makilbubeydelcezeriebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime b. Hâlid el-Mahzûmî tercemesi"),
  /* Alâ b. Abdirrahman -- talebeleri */
  E("alaabdrahman", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdirrahman tercemesi"),
  E("alaabdrahman", "hafsbmeysereelukayli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdirrahman tercemesi"),
  /* Amr b. Şuayb -- talebeleri */
  E("amrsuayb", "b", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Şuayb tercemesi"),
  /* Ubeydullah b. Ömer el-Ömerî -- hocalari */
  E("muhammedbyahyab", "ubeydullahomeri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ömer el-Ömerî tercemesi"),
  /* Ubeydullah b. Ömer el-Ömerî -- talebeleri */
  E("ubeydullahomeri", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ömer el-Ömerî tercemesi"),
  /* İsmâîl b. Ayyâş -- hocalari */
  E("habibbsalih", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ayyâş tercemesi"),
  /* Matar el-Verrâk -- hocalari */
  E("bhayve", "matarverrak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Matar el-Verrâk tercemesi"),
  /* Matar el-Verrâk -- talebeleri */
  E("matarverrak", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Matar el-Verrâk tercemesi"),
  /* Hişâm b. Yûsuf es-San‘ânî -- talebeleri */
  E("hisamyusufsanani", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Yûsuf es-San‘ânî tercemesi"),
  /* Mu‘temir b. Süleymân -- talebeleri */
  E("mutemirsuleyman", "hamidbomerbhafsebibekr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mu‘temir b. Süleymân tercemesi"),
  E("mutemirsuleyman", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mu‘temir b. Süleymân tercemesi"),
  /* Vüheyb b. Hâlid -- talebeleri */
  E("vuheybhalid", "ahmedbishakbzeydebiish", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vüheyb b. Hâlid tercemesi"),
  E("vuheybhalid", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vüheyb b. Hâlid tercemesi"),
  /* Mervân b. Muâviye el-Fezârî -- talebeleri */
  E("mervanfezari", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mervân b. Muâviye el-Fezârî tercemesi"),
  E("mervanfezari", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mervân b. Muâviye el-Fezârî tercemesi"),
  /* Hassân b. Atiyye -- talebeleri */
  E("hassanatiyye", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hassân b. Atiyye tercemesi"),
  /* Umeyr b. Hâni’ -- talebeleri */
  E("umeyrhani", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Umeyr b. Hâni’ tercemesi"),
  /* Abde b. Ebî Lübâbe -- talebeleri */
  E("abdelubabe", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Ebî Lübâbe tercemesi"),
  /* Muhammed b. el-Velîd ez-Zübeydî -- hocalari */
  E("amirbabdullahbezzubeyr", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Velîd ez-Zübeydî tercemesi"),
  E("suleymbamir", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Velîd ez-Zübeydî tercemesi"),
  E("yahyabcabirbhassanetta", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Velîd ez-Zübeydî tercemesi"),
  /* Muhammed b. el-Velîd ez-Zübeydî -- talebeleri */
  E("muhammedvelidzubeydi", "yahyabhamzabvakidelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Velîd ez-Zübeydî tercemesi"),
  E("muhammedvelidzubeydi", "abdullahbsalimelesarie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Velîd ez-Zübeydî tercemesi"),
  /* Şeddâd Ebû Ammâr -- hocalari */
  E("abdullahbferruhelhoras", "saddadebuammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeddâd Ebû Ammâr tercemesi"),
  /* Meymûn b. Mihrân -- talebeleri */
  E("meymunmihran", "alibhakemelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Meymûn b. Mihrân tercemesi"),
  /* Hıkal b. Ziyâd -- hocalari */
  E("talhabamrbosmanelhadra", "hikalziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hıkal b. Ziyâd tercemesi"),
  E("b", "hikalziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hıkal b. Ziyâd tercemesi"),
  /* Bakiyye b. el-Velîd -- talebeleri */
  E("bakiyyevelid", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bakiyye b. el-Velîd tercemesi"),
  E("bakiyyevelid", "yezidbezzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bakiyye b. el-Velîd tercemesi"),
  /* Muhammed b. Yûsuf el-Firyâbî -- hocalari */
  E("abdirrahmanbsabitbsevb", "firyabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yûsuf el-Firyâbî tercemesi"),
  /* Muhammed b. Yûsuf el-Firyâbî -- talebeleri */
  E("firyabi", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yûsuf el-Firyâbî tercemesi"),
  E("firyabi", "elvelidbutbeelesceiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yûsuf el-Firyâbî tercemesi"),
  /* Ebû'l-Mugīre Abdülkuddûs el-Havlânî -- hocalari */
  E("abdullahbsalimelesarie", "ebulmugirehavlani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'l-Mugīre Abdülkuddûs el-Havlânî tercemesi"),
  E("yezidbatabyezid", "ebulmugirehavlani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'l-Mugīre Abdülkuddûs el-Havlânî tercemesi"),
  /* Şuayb b. İshak ed-Dımaşkī -- talebeleri */
  E("suaybishakdimaski", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. İshak ed-Dımaşkī tercemesi"),
  E("suaybishakdimaski", "ishakbibrahimbyezidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. İshak ed-Dımaşkī tercemesi"),
  E("suaybishakdimaski", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. İshak ed-Dımaşkī tercemesi"),
  /* Muhammed b. Şuayb b. Şâbûr -- talebeleri */
  E("muhammedsuaybsabur", "ishakbibrahimbyezidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şuayb b. Şâbûr tercemesi"),
  E("muhammedsuaybsabur", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şuayb b. Şâbûr tercemesi"),
  E("muhammedsuaybsabur", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şuayb b. Şâbûr tercemesi"),
  E("muhammedsuaybsabur", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şuayb b. Şâbûr tercemesi"),
  /* Ubeydullah b. Mûsâ el-Absî -- hocalari */
  E("muhammedbabdirrahmanbe2", "ubeydullahmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  /* Ubeydullah b. Mûsâ el-Absî -- talebeleri */
  E("ubeydullahmusa", "muhammedbhuseyinbibrah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  E("ubeydullahmusa", "ibrahimbdinarebuishake", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  E("ubeydullahmusa", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  E("ubeydullahmusa", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  E("ubeydullahmusa", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Mûsâ el-Absî tercemesi"),
  /* Me‘âfâ b. İmrân -- hocalari */
  E("abdirrahmanbabdullahbo", "mafairan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Me‘âfâ b. İmrân tercemesi"),
  /* Me‘âfâ b. İmrân -- talebeleri */
  E("mafairan", "muhammedbabdullahbamma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Me‘âfâ b. İmrân tercemesi"),
  /* Saîd b. Abdil'azîz et-Tenûhî -- hocalari */
  E("atiyyebkayselkilabi", "saidabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdil'azîz et-Tenûhî tercemesi"),
  /* Saîd b. Abdil'azîz et-Tenûhî -- talebeleri */
  E("saidabdulaziz", "zeydbyahyabubeydelhuza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdil'azîz et-Tenûhî tercemesi"),
  E("saidabdulaziz", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdil'azîz et-Tenûhî tercemesi"),
  /* Âsım b. Behdele -- talebeleri */
  E("asimbehdele", "hafsbsuleymanelesedieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Behdele tercemesi"),
  /* Ali b. Zeyd b. Cüd‘ân -- talebeleri */
  E("alizeydcudan", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Zeyd b. Cüd‘ân tercemesi"),
  /* Abdülvâris b. Saîd -- hocalari */
  E("eyyubbmusabamrebumusae", "abdulvarissaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâris b. Saîd tercemesi"),
  E("alibhakemelbunani", "abdulvarissaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâris b. Saîd tercemesi"),
  /* Abdülvâris b. Saîd -- talebeleri */
  E("abdulvarissaid", "imranbmeysere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâris b. Saîd tercemesi"),
  E("abdulvarissaid", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâris b. Saîd tercemesi"),
  /* Abdülvehhâb b. Atâ -- talebeleri */
  E("abdulvehhabata", "muhammedbabdullah5", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Atâ tercemesi"),
  /* Abde b. Süleymân -- hocalari */
  E("talhabyahyabtalha", "abdesuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Süleymân tercemesi"),
  /* Muhammed b. Ebî Adî -- talebeleri */
  E("muhammedebiadi", "alibhuseyinbmatarelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Adî tercemesi"),
  E("muhammedebiadi", "yahyabhalefelbahiliebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Adî tercemesi"),
  /* Süheyl b. Ebî Sâlih -- talebeleri */
  E("suheylebisalih", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süheyl b. Ebî Sâlih tercemesi"),
  E("suheylebisalih", "saidbabdirrahmanelcuma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süheyl b. Ebî Sâlih tercemesi"),
  /* Saîd b. İyâs el-Cüreyrî -- talebeleri */
  E("cureyri", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. İyâs el-Cüreyrî tercemesi"),
  /* Ebû İmrân el-Cevnî -- talebeleri */
  E("ebuimrancevni", "ziyadbrabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû İmrân el-Cevnî tercemesi"),
  /* Abdülmelik b. Umeyr -- talebeleri */
  E("abdulmelikumeyr", "ubeydbamrbebielvelideb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Umeyr tercemesi"),
  E("abdulmelikumeyr", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Umeyr tercemesi"),
  /* Amr b. Yahyâ el-Mâzinî -- hocalari */
  E("muhammedbyahyab", "amryahyamazini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Yahyâ el-Mâzinî tercemesi"),
  E("isabomerelesedielhemda", "amryahyamazini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Yahyâ el-Mâzinî tercemesi"),
  /* Amr b. Yahyâ el-Mâzinî -- talebeleri */
  E("amryahyamazini", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Yahyâ el-Mâzinî tercemesi"),
  /* Hüdbe b. Hâlid -- talebeleri */
  E("hebbanhilal", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüdbe b. Hâlid tercemesi"),
  E("hebbanhilal", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüdbe b. Hâlid tercemesi"),
  /* Mûsâ b. İsmâîl et-Tebûzekî -- hocalari */
  E("yezidbibrahim", "musaismailtebuzeki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. İsmâîl et-Tebûzekî tercemesi"),
  /* Ebû'l-Velîd Hişâm et-Tayâlisî -- talebeleri */
  E("hisamtayalisi", "abdullahbheysembosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'l-Velîd Hişâm et-Tayâlisî tercemesi"),
  E("hisamtayalisi", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'l-Velîd Hişâm et-Tayâlisî tercemesi"),
  /* Amr b. Merzûk -- talebeleri */
  E("amrmerzuk", "abbasb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Merzûk tercemesi"),
  /* Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) -- talebeleri */
  E("caferebivahsiyye", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Ebî Vahşiyye (Ebû Bişr) tercemesi"),
  /* Firâs b. Yahyâ el-Hemdânî -- talebeleri */
  E("firasyahya", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Firâs b. Yahyâ el-Hemdânî tercemesi"),
  /* Mansûr b. Zâzân -- talebeleri */
  E("mansurzazan", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Zâzân tercemesi"),
  /* Saîd b. Mansûr -- talebeleri */
  E("said_mansur", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mansûr tercemesi"),
  /* Kavârîrî, Ubeydullah b. Ömer -- hocalari */
  E("muazbhisambebiabdullah", "kavariri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kavârîrî, Ubeydullah b. Ömer tercemesi"),
  /* Kavârîrî, Ubeydullah b. Ömer -- talebeleri */
  E("kavariri", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kavârîrî, Ubeydullah b. Ömer tercemesi"),
  /* Şeybân b. Ferrûh -- talebeleri */
  E("seybanferruh", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Ferrûh tercemesi"),
  /* Haccâc b. Minhâl -- hocalari */
  E("yezidbibrahim", "haccacminhal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Haccâc b. Minhâl tercemesi"),
  /* Haccâc b. Minhâl -- talebeleri */
  E("haccacminhal", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Haccâc b. Minhâl tercemesi"),
  E("haccacminhal", "abdullahbheysembosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Haccâc b. Minhâl tercemesi"),
  /* Halef b. Hişâm el-Bezzâr -- talebeleri */
  E("halefhisam", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Hişâm el-Bezzâr tercemesi"),
  /* Avf el-A‘râbî -- talebeleri */
  E("avfarabi", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avf el-A‘râbî tercemesi"),
  E("avfarabi", "saidbyahyabmehdiebusuf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avf el-A‘râbî tercemesi"),
  E("avfarabi", "saidbevsbsabitebuzeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avf el-A‘râbî tercemesi"),
  /* Abdülhamîd b. Ca‘fer -- talebeleri */
  E("abdulhamidcafer", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Ca‘fer tercemesi"),
  E("abdulhamidcafer", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Ca‘fer tercemesi"),
  /* Süfyân b. Husayn -- hocalari */
  E("iyasbmuaviyebkurreebuv", "sufyanhusayn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân b. Husayn tercemesi"),
  /* Sâlih b. Sâlih b. Hayy -- talebeleri */
  E("salihhayy", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Sâlih b. Hayy tercemesi"),
  /* Siyâr Ebû'l-Hakem -- talebeleri */
  E("siyarebilhakem", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Siyâr Ebû'l-Hakem tercemesi"),
  /* Saîd b. Süleymân (Sa‘deveyh) -- hocalari */
  E("halefbhalifebsaidelesc", "saidsuleymansadeviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Süleymân (Sa‘deveyh) tercemesi"),
  /* Saîd b. Süleymân (Sa‘deveyh) -- talebeleri */
  E("saidsuleymansadeviye", "muhammedbebigalibettay", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Süleymân (Sa‘deveyh) tercemesi"),
  /* Ebû Bekir b. Ebî Şeybe -- hocalari */
  E("halefbhalifebsaidelesc", "ibnebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ebî Şeybe tercemesi"),
  /* Züheyr b. Harb Ebû Hayseme -- hocalari */
  E("muazbhisambebiabdullah", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb Ebû Hayseme tercemesi"),
  /* Züheyr b. Harb Ebû Hayseme -- talebeleri */
  E("zuheyrharb", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb Ebû Hayseme tercemesi"),
  /* Ali b. el-Medînî -- talebeleri */
  E("alimedini", "ibrahimbelharisbismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Medînî tercemesi"),
  E("alimedini", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Medînî tercemesi"),
  E("alimedini", "abdirrahmanbabdullahbo", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Medînî tercemesi"),
  E("alimedini", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Medînî tercemesi"),
  /* Ali b. Hucr el-Mervezî -- hocalari */
  E("halefbhalifebsaidelesc", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hucr el-Mervezî tercemesi"),
  E("ubeydbamrbebielvelideb", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hucr el-Mervezî tercemesi"),
  E("fazlbmusa", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hucr el-Mervezî tercemesi"),
  /* Amr b. Muhammed en-Nâkıd -- hocalari */
  E("ammarbmuhammedessevri", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed en-Nâkıd tercemesi"),
  E("yakubbibrahimbsadebuyu", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed en-Nâkıd tercemesi"),
  /* Amr b. Muhammed en-Nâkıd -- talebeleri */
  E("amrnakid", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed en-Nâkıd tercemesi"),
  /* Osmân b. Ebî Şeybe -- hocalari */
  E("ubeydbubeydelesceiebua", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ebî Şeybe tercemesi"),
  E("muttalibbziyadbebizuhe", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ebî Şeybe tercemesi"),
  /* Muhammed b. Ísâ İbnü't-Tabbâ‘ -- talebeleri */
  E("muhammedisataba", "muhammedbabdirrahmanbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ísâ İbnü't-Tabbâ‘ tercemesi"),
  /* Yezîd b. Ebî Habîb -- hocalari */
  E("elharisbyakubelensari", "yezidebihabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Habîb tercemesi"),
  E("yakubbabdullahbebuyusu", "yezidebihabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Habîb tercemesi"),
  /* Yûnus b. Bükeyr eş-Şeybânî -- hocalari */
  E("talhabyahyabtalha", "yunusbukeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Bükeyr eş-Şeybânî tercemesi"),
  /* Ali b. Sâlih b. Hayy -- hocalari */
  E("yezidbebiziyad", "aliebisalihhayy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  E("bebielmuharibi", "aliebisalihhayy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  /* Ali b. Sâlih b. Hayy -- talebeleri */
  E("aliebisalihhayy", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  E("aliebisalihhayy", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâlih b. Hayy tercemesi"),
  /* Ömer b. Zerr el-Hemdânî -- talebeleri */
  E("omerzerr", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Zerr el-Hemdânî tercemesi"),
  /* Saîd b. Ubeyd et-Tâî -- talebeleri */
  E("saidubeydtai", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ubeyd et-Tâî tercemesi"),
  /* Abdülazîz b. Ömer b. Abdil‘azîz -- hocalari */
  E("ismailbmuhammedbsadebi", "abdulazizomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Ömer b. Abdil‘azîz tercemesi"),
  /* Abdülazîz b. Ömer b. Abdil‘azîz -- talebeleri */
  E("abdulazizomer", "yahyabhamzabvakidelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Ömer b. Abdil‘azîz tercemesi"),
  /* Hennâd b. es-Serî -- talebeleri */
  E("hennadseri", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hennâd b. es-Serî tercemesi"),
  /* Yahyâ b. Ma‘în -- talebeleri */
  E("ibnmain", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Ma‘în tercemesi"),
  E("ibnmain", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Ma‘în tercemesi"),
  E("ibnmain", "muaviyebsalihbebiubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Ma‘în tercemesi"),
  /* Mahmûd b. Gaylân -- hocalari */
  E("fazlbmusa", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Gaylân tercemesi"),
  E("muaviyebhisam", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Gaylân tercemesi"),
  /* Mahmûd b. Gaylân -- talebeleri */
  E("mahmudgaylan", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Gaylân tercemesi"),
  /* İbrâhim b. Tahmân -- talebeleri */
  E("ibrahimtahman", "hafsbabdullahbrasidess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Tahmân tercemesi"),
  /* Ca‘fer b. Burkān -- talebeleri */
  E("caferburkan", "omerbeyyubelabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Burkān tercemesi"),
  /* Saîd b. Ebî Eyyûb el-Mısrî -- hocalari */
  E("elvelidbkasimbelvelide", "saidebiyyubmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ebî Eyyûb el-Mısrî tercemesi"),
  /* Rabî‘ b. Enes -- talebeleri */
  E("rebiuenes", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Enes tercemesi"),
  /* Ali b. el-Hasan b. Şakīk el-Mervezî -- hocalari */
  E("haricebbhariceebuelhac", "alihasansakik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. el-Hasan b. Şakīk el-Mervezî tercemesi"),
  /* Hasan b. Zekvân -- talebeleri */
  E("hasanzekvan", "muhammedbelharisbrasid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Zekvân tercemesi"),
  /* Eş‘as b. Abdilmelik el-Humrânî -- talebeleri */
  E("esaseabdulmelik", "kureysbeneselensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eş‘as b. Abdilmelik el-Humrânî tercemesi"),
  /* Muhammed b. Beşşâr (Bündâr) -- hocalari */
  E("muazbhisambebiabdullah", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Beşşâr (Bündâr) tercemesi"),
  E("sehlbyusufelbasri", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Beşşâr (Bündâr) tercemesi"),
  E("muhammedbbekirbosman", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Beşşâr (Bündâr) tercemesi"),
  /* Muhammed b. Beşşâr (Bündâr) -- talebeleri */
  E("bundar", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Beşşâr (Bündâr) tercemesi"),
  /* Muhammed b. el-Müsennâ (Ez-Zemin) -- hocalari */
  E("muazbhisambebiabdullah", "ibnmusenna", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Müsennâ (Ez-Zemin) tercemesi"),
  /* Amr b. Ali es-Sayrafî (el-Fellâs) -- hocalari */
  E("abdullahbdavudbamirelh", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali es-Sayrafî (el-Fellâs) tercemesi"),
  E("muazbhisambebiabdullah", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali es-Sayrafî (el-Fellâs) tercemesi"),
  E("muazbhanielbasriebuhan", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali es-Sayrafî (el-Fellâs) tercemesi"),
  /* Ubeydullah b. Muâz el-Anberî -- talebeleri */
  E("ubeydullahmuazanberi", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Muâz el-Anberî tercemesi"),
  /* Ya‘kûb b. İbrâhim ed-Devrakī -- hocalari */
  E("suaybbharbelmedainiebu", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. İbrâhim ed-Devrakī tercemesi"),
  /* Ya‘kûb b. İbrâhim ed-Devrakī -- talebeleri */
  E("yakubdevraki", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. İbrâhim ed-Devrakī tercemesi"),
  E("yakubdevraki", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. İbrâhim ed-Devrakī tercemesi"),
  /* Muâviye b. Sâlih el-Hadramî -- hocalari */
  E("suleymbamir", "muaviyesalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sâlih el-Hadramî tercemesi"),
  E("alabelharisbabdilvaris", "muaviyesalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sâlih el-Hadramî tercemesi"),
  /* Abdülazîz b. Muhammed ed-Derâverdî -- talebeleri */
  E("darevardi", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Muhammed ed-Derâverdî tercemesi"),
  /* Abdülazîz b. Ebî Seleme el-Mâcişûn -- hocalari */
  E("abdulvahidbebiavnelmed", "macisun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Ebî Seleme el-Mâcişûn tercemesi"),
  /* Abdülazîz b. Ebî Seleme el-Mâcişûn -- talebeleri */
  E("macisun", "abdullahbsalihbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Ebî Seleme el-Mâcişûn tercemesi"),
  /* Harb b. Şeddâd -- talebeleri */
  E("harbseddad", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Harb b. Şeddâd tercemesi"),
  /* Abdülvâhid b. Ziyâd -- hocalari */
  E("habibbebiamre", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  E("talhabyahyabtalha", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  /* Abdülvâhid b. Ziyâd -- talebeleri */
  E("abdulvahidziyad", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  E("abdulvahidziyad", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ziyâd tercemesi"),
  /* Mâlik b. Migvel -- talebeleri */
  E("malikmigvel", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Migvel tercemesi"),
  E("malikmigvel", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Migvel tercemesi"),
  E("malikmigvel", "suaybbharbelmedainiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Migvel tercemesi"),
  /* Sellâm b. Ebî Mutī‘ -- hocalari */
  E("esmabubeyd", "sallamebimuti", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Ebî Mutī‘ tercemesi"),
  /* Sellâm b. Ebî Mutī‘ -- talebeleri */
  E("sallamebimuti", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Ebî Mutī‘ tercemesi"),
  /* Abd b. Humeyd -- hocalari */
  E("ahmedbishakbzeydebiish", "abdhumeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abd b. Humeyd tercemesi"),
  E("muhammedbbekirbosman", "abdhumeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abd b. Humeyd tercemesi"),
  E("yakubbibrahimbsadebuyu", "abdhumeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abd b. Humeyd tercemesi"),
  /* Ebû Küreyb Muhammed b. el-Alâ -- hocalari */
  E("muhammedbebiubeydebman", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  E("yahyabyalabelhariselmu", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  E("muaviyebhisam", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Küreyb Muhammed b. el-Alâ tercemesi"),
  /* Bişr b. el-Mufaddal er-Rakāşî -- talebeleri */
  E("bisrmufaddal", "hamidbomerbhafsebibekr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Mufaddal er-Rakāşî tercemesi"),
  /* Şebâbe b. Sevvâr el-Medâinî -- talebeleri */
  E("sebabesevvar", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şebâbe b. Sevvâr el-Medâinî tercemesi"),
  E("sebabesevvar", "yahyabbisrelfellas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şebâbe b. Sevvâr el-Medâinî tercemesi"),
  E("sebabesevvar", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şebâbe b. Sevvâr el-Medâinî tercemesi"),
  /* Hammâd b. Mes‘ade et-Temîmî -- hocalari */
  E("yezidbubeyd", "hammadmesade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hammâd b. Mes‘ade et-Temîmî tercemesi"),
  /* Ebû Hâzim Seleme b. Dînâr -- hocalari */
  E("amirbabdullahbezzubeyr", "ebuhazimseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâzim Seleme b. Dînâr tercemesi"),
  /* Muallâ b. Mansûr er-Râzî -- talebeleri */
  E("muallamansur", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muallâ b. Mansûr er-Râzî tercemesi"),
  /* Ebû Râfi‘ Nüfey‘ es-Sâiğ -- talebeleri */
  E("eburafinufey", "atabebimeymuneelbasrie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Râfi‘ Nüfey‘ es-Sâiğ tercemesi"),
  /* Behz b. Esed el-Ammî -- hocalari */
  E("yezidbibrahim", "behzesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Behz b. Esed el-Ammî tercemesi"),
  /* Alkame b. Mersed el-Hadramî -- hocalari */
  E("suleymanbbureydebelhas", "alkamemersed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Mersed el-Hadramî tercemesi"),
  /* Alkame b. Mersed el-Hadramî -- talebeleri */
  E("alkamemersed", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Mersed el-Hadramî tercemesi"),
  /* Ukbe b. Hâlid es-Sekûnî -- hocalari */
  E("muhammedbabdirrahmanbe2", "ukbehalidsekuni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Hâlid es-Sekûnî tercemesi"),
  /* Ukbe b. Hâlid es-Sekûnî -- talebeleri */
  E("ukbehalidsekuni", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Hâlid es-Sekûnî tercemesi"),
  /* Ebû Hâşim er-Rummânî -- talebeleri */
  E("ebuhasimrummani", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâşim er-Rummânî tercemesi"),
  /* Fudayl b. Süleymân en-Nümeyrî -- hocalari */
  E("muhammedbebiyahyaelmed", "fudaylsuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. Süleymân en-Nümeyrî tercemesi"),
  /* Mehdî b. Meymûn el-Ezdî -- talebeleri */
  E("mehdimeymun", "abdullahbmuaviyebmusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Meymûn el-Ezdî tercemesi"),
  E("mehdimeymun", "abdullahbmuhammedbesma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Meymûn el-Ezdî tercemesi"),
  /* Şebîb b. Garkade -- talebeleri */
  E("sebibgarkade", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şebîb b. Garkade tercemesi"),
  /* Muâviye b. Amr el-Ezdî -- talebeleri */
  E("muaviyeamrezdi", "ahmedbabdullahbeyyubeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Amr el-Ezdî tercemesi"),
  E("muaviyeamrezdi", "ismailbebielharisesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Amr el-Ezdî tercemesi"),
  /* Mufaddal b. Fadâle el-Kütbânî -- hocalari */
  E("rebiabseyf", "mufaddalfadale", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mufaddal b. Fadâle el-Kütbânî tercemesi"),
  /* Mufaddal b. Fadâle el-Kütbânî -- talebeleri */
  E("mufaddalfadale", "hassanbabdullahbsehlel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mufaddal b. Fadâle el-Kütbânî tercemesi"),
  E("mufaddalfadale", "muhammedbasimbcaferelm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mufaddal b. Fadâle el-Kütbânî tercemesi"),
  /* Ma‘kıl b. Yesâr el-Müzenî -- talebeleri */
  E("makilyesar", "alkamebabdullahbsinan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘kıl b. Yesâr el-Müzenî tercemesi"),
  /* Şeddâd b. Evs el-Ensârî -- talebeleri */
  E("seddadevs", "damrabhabibbsuheybezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeddâd b. Evs el-Ensârî tercemesi"),
  /* Ebû'n-Nadr Hâşim b. el-Kāsım -- hocalari */
  E("ubeydbubeydelesceiebua", "ebunadrhasim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'n-Nadr Hâşim b. el-Kāsım tercemesi"),
  /* Ebû'n-Nadr Hâşim b. el-Kāsım -- talebeleri */
  E("ebunadrhasim", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'n-Nadr Hâşim b. el-Kāsım tercemesi"),
  E("ebunadrhasim", "hamidbyahyabhaniebuabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû'n-Nadr Hâşim b. el-Kāsım tercemesi"),
  /* Yûnus b. Ubeyd el-Abdî -- talebeleri */
  E("yunusubeyd", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Ubeyd el-Abdî tercemesi"),
  /* Abbâd b. el-Avvâm el-Kilâbî -- talebeleri */
  E("abbadavvam", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. el-Avvâm el-Kilâbî tercemesi"),
  E("abbadavvam", "imranbmeysere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. el-Avvâm el-Kilâbî tercemesi"),
  E("abbadavvam", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. el-Avvâm el-Kilâbî tercemesi"),
  /* Abbâd b. Temîm el-Ensârî -- talebeleri */
  E("abbadtemim", "muhammedbyahyab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Temîm el-Ensârî tercemesi"),
  /* Amr b. Süleym ez-Zürakī -- talebeleri */
  E("amrsuleymzuraki", "muhammedbyahyab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Süleym ez-Zürakī tercemesi"),
  E("amrsuleymzuraki", "amirbabdullahbezzubeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Süleym ez-Zürakī tercemesi"),
  /* Yezîd b. Ebî Yezîd ed-Dubaî -- talebeleri */
  E("yezidebiyezid", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Yezîd ed-Dubaî tercemesi"),
  /* Süleymân b. Hayyân Ebû Hâlid el-Ahmer -- hocalari */
  E("osmanbhakim", "suleymanhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Hayyân Ebû Hâlid el-Ahmer tercemesi"),
  /* İsmâîl b. Ca‘fer el-Ensârî -- talebeleri */
  E("ismailcafer", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ca‘fer el-Ensârî tercemesi"),
  E("ismailcafer", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ca‘fer el-Ensârî tercemesi"),
  /* Hâtim b. İsmâîl el-Medenî -- hocalari */
  E("yezidbubeyd", "hatimismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâtim b. İsmâîl el-Medenî tercemesi"),
  /* Hâtim b. İsmâîl el-Medenî -- talebeleri */
  E("hatimismail", "saidbamrbsehlelkindieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâtim b. İsmâîl el-Medenî tercemesi"),
  E("hatimismail", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâtim b. İsmâîl el-Medenî tercemesi"),
  /* Osmân b. el-Esved el-Mekkî -- talebeleri */
  E("osmanesved", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. el-Esved el-Mekkî tercemesi"),
  /* Ca‘fer b. Rebîa el-Kindî -- hocalari */
  E("yakubbabdullahbebuyusu", "cafercrebia", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Rebîa el-Kindî tercemesi"),
  /* Osmân b. Ömer b. Fâris el-Abdî -- hocalari */
  E("salihbelmuzeni", "osmanomerfaris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ömer b. Fâris el-Abdî tercemesi"),
  E("isabhafsbasimebuziyade", "osmanomerfaris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Ömer b. Fâris el-Abdî tercemesi"),
  /* Yahyâ b. Ebî Bükeyr el-Kirmânî -- hocalari */
  E("zuheyrbmuhammed", "yahyaebibukeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Ebî Bükeyr el-Kirmânî tercemesi"),
  /* Habîb b. eş-Şehîd el-Ezdî -- talebeleri */
  E("habibsehid", "kureysbeneselensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. eş-Şehîd el-Ezdî tercemesi"),
  /* İsmâîl b. Zekeriyyâ el-Halkānî -- talebeleri */
  E("ismailzekeriyya", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Zekeriyyâ el-Halkānî tercemesi"),
  /* Ebû Mus‘ab ez-Zührî -- hocalari */
  E("mugirebabdirrahmanbavn", "ebumusabzuhri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Mus‘ab ez-Zührî tercemesi"),
  E("muhammedbibrahimbdinar", "ebumusabzuhri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Mus‘ab ez-Zührî tercemesi"),
  /* Ebû Saîd el-Eşecc -- hocalari */
  E("abdirrahmanbmuhammedbz", "ebusaidesecc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Eşecc tercemesi"),
  E("muazbhisambebiabdullah", "ebusaidesecc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Saîd el-Eşecc tercemesi"),
  /* Muhammed b. Râfi‘ en-Nîsâbûrî -- hocalari */
  E("yahyabishak", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Râfi‘ en-Nîsâbûrî tercemesi"),
  /* Muhammed b. Yahyâ ez-Zühlî -- hocalari */
  E("muhammedbbekirbosman", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ ez-Zühlî tercemesi"),
  E("yakubbibrahimbsadebuyu", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ ez-Zühlî tercemesi"),
  /* Muhammed b. Yahyâ ez-Zühlî -- talebeleri */
  E("zuhli", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ ez-Zühlî tercemesi"),
  /* Mücâhid b. Mûsâ -- hocalari */
  E("yunusbmuhammedbmuslime", "mucahidmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mücâhid b. Mûsâ tercemesi"),
  /* Mücâhid b. Mûsâ -- talebeleri */
  E("mucahidmusa", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mücâhid b. Mûsâ tercemesi"),
  /* Ebû Bekir b. Ayyâş -- hocalari */
  E("yezidbebiziyad", "ebubekirayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ayyâş tercemesi"),
  /* Ebû Bekir b. Ayyâş -- talebeleri */
  E("ebubekirayyas", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ayyâş tercemesi"),
  E("ebubekirayyas", "amrbzurarebvakidelkila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Ayyâş tercemesi"),
  /* Ebû Muâviye ed-Darîr -- talebeleri */
  E("ebumuaviyedarir", "yusufbisabdinarezzuhri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Muâviye ed-Darîr tercemesi"),
  E("ebumuaviyedarir", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Muâviye ed-Darîr tercemesi"),
  /* Muhammed b. Fudayl b. Gazvân -- talebeleri */
  E("muhammedfudayl", "imranbmeysere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fudayl b. Gazvân tercemesi"),
  /* Fudayl b. İyâz -- hocalari */
  E("ziyadbebiziyadmeyseree", "fudaylibnayaz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  /* Fudayl b. İyâz -- talebeleri */
  E("fudaylibnayaz", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  E("fudaylibnayaz", "yusufbmervanennesaiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  E("fudaylibnayaz", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  E("fudaylibnayaz", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fudayl b. İyâz tercemesi"),
  /* Fıtr b. Halîfe -- talebeleri */
  E("fitrhalife", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fıtr b. Halîfe tercemesi"),
  E("fitrhalife", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fıtr b. Halîfe tercemesi"),
  E("fitrhalife", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fıtr b. Halîfe tercemesi"),
  /* Abdüsselâm b. Harb b. Selm -- talebeleri */
  E("abdusselamharb", "ismailbmusaelfezariebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Harb b. Selm tercemesi"),
  E("abdusselamharb", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Harb b. Selm tercemesi"),
  /* Mûsâ el-Cühenî -- talebeleri */
  E("musacuheni", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ el-Cühenî tercemesi"),
  /* Nâfi‘ b. Ömer el-Cümahî -- talebeleri */
  E("nafiomercumahi", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer el-Cümahî tercemesi"),
  /* Hâşim b. Hâşim b. Utbe -- talebeleri */
  E("hasimhasim", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Hâşim b. Utbe tercemesi"),
  /* Ebû Mâlik el-Eşce‘î -- talebeleri */
  E("ebumalikesceyi", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Mâlik el-Eşce‘î tercemesi"),
  /* Leys b. Ebî Süleym -- hocalari */
  E("bebielmuharibi", "leysebisuleym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Leys b. Ebî Süleym tercemesi"),
  /* Hârûn b. Ma‘rûf -- hocalari */
  E("mervanbsucaelcezeriebu", "harunmaruf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. Ma‘rûf tercemesi"),
  /* Hârûn b. Ma‘rûf -- talebeleri */
  E("harunmaruf", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. Ma‘rûf tercemesi"),
  /* Serîc b. Yûnus -- talebeleri */
  E("sericyunus", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Serîc b. Yûnus tercemesi"),
  /* Hasan b. Arafe -- hocalari */
  E("abdirrahmanbmuhammedbz", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  E("halefbhalifebsaidelesc", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  /* Hasan b. Arafe -- talebeleri */
  E("hasanarafe", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  E("hasanarafe", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Arafe tercemesi"),
  /* Buhârî -- talebeleri */
  E("buhari", "kasimbzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Buhârî tercemesi"),
  /* Müslim b. el-Haccâc -- hocalari */
  E("ahmedbabdullahbyunus", "muslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Müslim b. el-Haccâc tercemesi"),
  E("heysembhariceebuahmed", "muslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Müslim b. el-Haccâc tercemesi"),
  /* Ebû Dâvûd es-Sicistânî -- hocalari */
  E("suleymanbabdirrahmanbi", "ebudavud", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Dâvûd es-Sicistânî tercemesi"),
  /* Hüseyin b. Muhammed el-Kabbânî -- hocalari */
  E("mansurbebimuzahimbesir", "ms12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed el-Kabbânî tercemesi"),
  E("amrbzurarebvakidelkila", "ms12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed el-Kabbânî tercemesi"),
  /* Ebû Bekir Muhammed b. en-Nadr el-Cârûdî -- hocalari */
  E("ismailbmusaelfezariebu", "ms25", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir Muhammed b. en-Nadr el-Cârûdî tercemesi"),
  E("muhammedbabdulmelikbeb", "ms25", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir Muhammed b. en-Nadr el-Cârûdî tercemesi"),
  E("amrbzurarebvakidelkila", "ms25", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir Muhammed b. en-Nadr el-Cârûdî tercemesi"),
  /* Ebû Bekir İbn Ebi'd-Dünyâ -- hocalari */
  E("ahmedbibrahimbhalidebu", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir İbn Ebi'd-Dünyâ tercemesi"),
  E("mansurbebimuzahimbesir", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir İbn Ebi'd-Dünyâ tercemesi"),
  /* Dârimî -- hocalari */
  E("mervanbmuhammedbhassan", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dârimî tercemesi"),
  /* Dârimî -- talebeleri */
  E("darimi", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dârimî tercemesi"),
  /* Ebû Zür‘a er-Râzî -- hocalari */
  E("ahmedbabdullahbyunus", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  E("muhammedbsaidbsabikerr", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  E("hakembmusabebizuheyreb", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  E("yahyababdullahbbukeyre", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  /* Ebû Zür‘a er-Râzî -- talebeleri */
  E("ebuzuraraazi", "muhammedbhumeydbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Zür‘a er-Râzî tercemesi"),
  /* Ebû Hâtim er-Râzî -- hocalari */
  E("muhammedbyezidbsinanel", "ebuhatimrazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâtim er-Râzî tercemesi"),
  E("amrbrabibtarik", "ebuhatimrazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâtim er-Râzî tercemesi"),
  E("omerbhafsbgiyas", "ebuhatimrazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hâtim er-Râzî tercemesi"),
  /* Harmala b. Yahyâ et-Tüceybî -- hocalari */
  E("yahyababdullahbbukeyre", "harmalayahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Harmala b. Yahyâ et-Tüceybî tercemesi"),
  /* Hasan b. Ali el-Hallâl -- hocalari */
  E("yakubbibrahimbsadebuyu", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali el-Hallâl tercemesi"),
  E("muazbhisambebiabdullah", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali el-Hallâl tercemesi"),
  E("yahyabishak", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali el-Hallâl tercemesi"),
  /* Süveyd b. Saîd el-Hadesânî -- hocalari */
  E("hafsbmeysereelukayli", "suveydsaidhadesani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Saîd el-Hadesânî tercemesi"),
  /* Süveyd b. Saîd el-Hadesânî -- talebeleri */
  E("suveydsaidhadesani", "ishakbibrahimbyunuselv", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Saîd el-Hadesânî tercemesi"),
  /* Muhammed b. İbrâhim et-Teymî -- hocalari */
  E("amirbsadbebivakkasezzu", "muhammedibrahimteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim et-Teymî tercemesi"),
  E("isabtalhabubeydetteymi", "muhammedibrahimteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim et-Teymî tercemesi"),
  /* Hişâm b. Hassân -- hocalari */
  E("eyyubbmusabamrebumusae", "hisamhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hassân tercemesi"),
  /* Hişâm b. Hassân -- talebeleri */
  E("hisamhassan", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hassân tercemesi"),
  /* Şeybân b. Abdirrahman en-Nahvî -- hocalari */
  E("bebielmuharibi", "seybannahvi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman en-Nahvî tercemesi"),
  /* Şeybân b. Abdirrahman en-Nahvî -- talebeleri */
  E("seybannahvi", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman en-Nahvî tercemesi"),
  E("seybannahvi", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman en-Nahvî tercemesi"),
  /* Muâviye b. Sellâm -- talebeleri */
  E("muaviyesellam", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sellâm tercemesi"),
  E("muaviyesellam", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sellâm tercemesi"),
  E("muaviyesellam", "osmanbabdirrahmanbmusl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sellâm tercemesi"),
  E("muaviyesellam", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Sellâm tercemesi"),
  /* Yahyâ b. Saîd el-Ensârî -- hocalari */
  E("ubeydbhuneyn", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd el-Ensârî tercemesi"),
  E("muhammedbyahyab", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd el-Ensârî tercemesi"),
  /* İkrime b. Ammâr -- hocalari */
  E("iyasbselemebelekvaebus", "ikrimeammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İkrime b. Ammâr tercemesi"),
  /* Zeyd b. Eslem -- hocalari */
  E("abdirrahmanbabdulmelik", "zeydeslem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Eslem tercemesi"),
  /* Zeyd b. Eslem -- talebeleri */
  E("zeydeslem", "hafsbmeysereelukayli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Eslem tercemesi"),
  /* Süfyân b. Vekî‘ -- hocalari */
  E("abdulhamidbabdirrahman", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süfyân b. Vekî‘ tercemesi"),
  /* Hârûn b. Abdillâh el-Hammâl -- hocalari */
  E("muhammedbbekirbosman", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. Abdillâh el-Hammâl tercemesi"),
  /* Hârûn b. Abdillâh el-Hammâl -- talebeleri */
  E("harunhammal", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. Abdillâh el-Hammâl tercemesi"),
  /* Muhammed b. Sellâm el-Bîkendî -- hocalari */
  E("ubeydebhumeydebuabdirr", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sellâm el-Bîkendî tercemesi"),
  /* Muhammed b. Sellâm el-Bîkendî -- talebeleri */
  E("ibnsellam", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sellâm el-Bîkendî tercemesi"),
  /* Habbân b. Hilâl -- talebeleri */
  E("habbanhilal", "ahmedbsaidbibrahimelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habbân b. Hilâl tercemesi"),
  /* Abdül'alâ b. Hammâd en-Nersî -- talebeleri */
  E("nersi", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdül'alâ b. Hammâd en-Nersî tercemesi"),
  /* Ebû Kudâme es-Serahsî -- hocalari */
  E("muhammedbbekirbosman", "ebukudame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Kudâme es-Serahsî tercemesi"),
  E("muazbhisambebiabdullah", "ebukudame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Kudâme es-Serahsî tercemesi"),
  /* Yahyâ b. Mûsâ el-Belhî (Hat) -- hocalari */
  E("muhammedbbekirbosman", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Mûsâ el-Belhî (Hat) tercemesi"),
  /* Yahyâ b. Mûsâ el-Belhî (Hat) -- talebeleri */
  E("yahyamusa", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Mûsâ el-Belhî (Hat) tercemesi"),
  /* Abdullah b. Muhammed el-Müsnedî -- talebeleri */
  E("musnedi", "muhammedbnasrelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Müsnedî tercemesi"),
  E("musnedi", "bumareebucafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Müsnedî tercemesi"),
  /* Muhammed b. es-Sabbâh ed-Dûlâbî -- hocalari */
  E("fazlbmusa", "ibnsabbahdulabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. es-Sabbâh ed-Dûlâbî tercemesi"),
  /* Muhammed b. es-Sabbâh ed-Dûlâbî -- talebeleri */
  E("ibnsabbahdulabi", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. es-Sabbâh ed-Dûlâbî tercemesi"),
  /* Abdullah b. Recâ el-Gudânî -- talebeleri */
  E("ibnrecagudani", "sehlbmuhammedbosmanebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Recâ el-Gudânî tercemesi"),
  E("ibnrecagudani", "abdullahbishakelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Recâ el-Gudânî tercemesi"),
  /* Hasan b. Muhammed ez-Za‘ferânî -- hocalari */
  E("ubeydebhumeydebuabdirr", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed ez-Za‘ferânî tercemesi"),
  /* Hasan b. Muhammed ez-Za‘ferânî -- talebeleri */
  E("zaferani", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed ez-Za‘ferânî tercemesi"),
  E("zaferani", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed ez-Za‘ferânî tercemesi"),
  /* Abbâs b. Muhammed ed-Dûrî -- hocalari */
  E("abdullahbavnbebiavnbye", "abbasduri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed ed-Dûrî tercemesi"),
  /* Abbâs b. Muhammed ed-Dûrî -- talebeleri */
  E("abbasduri", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed ed-Dûrî tercemesi"),
  /* Yûsuf b. Mûsâ el-Kattân -- hocalari */
  E("asimbyusufebuamr", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mûsâ el-Kattân tercemesi"),
  E("ahmedbabdullahbyunus", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mûsâ el-Kattân tercemesi"),
  /* Yûsuf b. Mûsâ el-Kattân -- talebeleri */
  E("yusufmusakattan", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mûsâ el-Kattân tercemesi"),
  /* Atâ b. Yesâr -- hocalari */
  E("amirbsadbebivakkasezzu", "atayesar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Yesâr tercemesi"),
  /* Saîd b. Ebî Saîd el-Makburî -- talebeleri */
  E("makburi", "eyyubbmusabamrebumusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ebî Saîd el-Makburî tercemesi"),
  E("makburi", "talhabebisaidebuabdulm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ebî Saîd el-Makburî tercemesi"),
  /* Abdurrahman b. Ganm -- talebeleri */
  E("ibnganm", "atiyyebkayselkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Ganm tercemesi"),
  E("ibnganm", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdurrahman b. Ganm tercemesi"),
  /* Saîd b. Ebî Hilâl -- hocalari */
  E("rebiabseyf", "saidebihilal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Ebî Hilâl tercemesi"),
  /* Nâfi b. Cübeyr b. Mut‘im -- talebeleri */
  E("naficubeyr", "hakimbabdullahbkays", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi b. Cübeyr b. Mut‘im tercemesi"),
  /* Abdullah b. Yûsuf et-Tinnîsî -- hocalari */
  E("yahyabhamzabvakidelhad", "abdullahyusuftinnisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Yûsuf et-Tinnîsî tercemesi"),
  E("abdullahbsalimelesarie", "abdullahyusuftinnisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Yûsuf et-Tinnîsî tercemesi"),
  /* Abdullah b. Yûsuf et-Tinnîsî -- talebeleri */
  E("abdullahyusuftinnisi", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Yûsuf et-Tinnîsî tercemesi"),
  /* Ebü'l-Yemân el-Hakem b. Nâfi‘ -- talebeleri */
  E("ebulyemanhakem", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebü'l-Yemân el-Hakem b. Nâfi‘ tercemesi"),
  /* Mekkî b. İbrâhîm el-Belhî -- hocalari */
  E("yezidbubeyd", "mekkiibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mekkî b. İbrâhîm el-Belhî tercemesi"),
  E("yakubbatabebirebahelme", "mekkiibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mekkî b. İbrâhîm el-Belhî tercemesi"),
  /* Hâlid b. Mahled el-Katavânî -- hocalari */
  E("abdirrahmanbabdullahbo", "halidmahled", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Mahled el-Katavânî tercemesi"),
  /* Hâlid b. Mahled el-Katavânî -- talebeleri */
  E("halidmahled", "kasimbzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Mahled el-Katavânî tercemesi"),
  E("halidmahled", "muaviyebsalihbebiubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Mahled el-Katavânî tercemesi"),
  /* Süreyc b. en-Nu‘mân el-Cevherî -- talebeleri */
  E("surayjnuman", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süreyc b. en-Nu‘mân el-Cevherî tercemesi"),
  /* Bedel b. el-Muhabber et-Temîmî -- talebeleri */
  E("bedelmuhabber", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bedel b. el-Muhabber et-Temîmî tercemesi"),
  /* Ali b. Ayyâş el-Elhânî -- hocalari */
  E("b", "aliayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ayyâş el-Elhânî tercemesi"),
  /* Ali b. Ayyâş el-Elhânî -- talebeleri */
  E("aliayyas", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ayyâş el-Elhânî tercemesi"),
  /* Ebû Müshir ed-Dımaşkī -- hocalari */
  E("yahyabhamzabvakidelhad", "ebumushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  /* Ebû Müshir ed-Dımaşkī -- talebeleri */
  E("ebumushir", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "muhammedbabdirrahmanbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  E("ebumushir", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Müshir ed-Dımaşkī tercemesi"),
  /* Sadaka b. el-Fadl el-Mervezî -- talebeleri */
  E("sadakafadl", "muhammedbnasrelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. el-Fadl el-Mervezî tercemesi"),
  /* Abdülazîz b. Abdillâh el-Üveysî -- hocalari */
  E("abdirrahmanbabdullahbo", "abdulazizuveysi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Abdillâh el-Üveysî tercemesi"),
  /* Abdülazîz b. Abdillâh el-Üveysî -- talebeleri */
  E("abdulazizuveysi", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Abdillâh el-Üveysî tercemesi"),
  E("abdulazizuveysi", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Abdillâh el-Üveysî tercemesi"),
  /* Ahmed b. İbrâhim b. Kesîr -- hocalari */
  E("huseym", "ahmedbibrahimbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İbrâhim b. Kesîr tercemesi"),
  E("sebabesevvar", "ahmedbibrahimbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İbrâhim b. Kesîr tercemesi"),
  E("yezidharun", "ahmedbibrahimbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İbrâhim b. Kesîr tercemesi"),
  E("halidmahled", "ahmedbibrahimbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İbrâhim b. Kesîr tercemesi"),
  /* Ahmed b. İbrâhim b. Kesîr -- talebeleri */
  E("ahmedbibrahimbkesir", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İbrâhim b. Kesîr tercemesi"),
  /* Ahmed b. İshak b. Zeyd Ebû İshak el-Basrî -- hocalari */
  E("hammadseleme", "ahmedbishakbzeydebiish", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İshak b. Zeyd Ebû İshak el-Basrî tercemesi"),
  /* Ahmed b. İshak b. Zeyd Ebû İshak el-Basrî -- talebeleri */
  E("ahmedbishakbzeydebiish", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. İshak b. Zeyd Ebû İshak el-Basrî tercemesi"),
  /* Ahmed b. Ca‘fer -- hocalari */
  E("nadrbmuhammedelmervezi", "ahmedbcafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Ca‘fer tercemesi"),
  /* Ahmed b. el-Haccâc el-Mervezî -- hocalari */
  E("hatimismail", "ahmedbelhaccacelmervez", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Haccâc el-Mervezî tercemesi"),
  E("darevardi", "ahmedbelhaccacelmervez", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Haccâc el-Mervezî tercemesi"),
  /* Ahmed b. el-Haccâc el-Mervezî -- talebeleri */
  E("ahmedbelhaccacelmervez", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Haccâc el-Mervezî tercemesi"),
  /* Ahmed b. Hâlid el-Hallâl -- hocalari */
  E("ishakyusufezrak", "ahmedbhalidelhallal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Hâlid el-Hallâl tercemesi"),
  E("safii", "ahmedbhalidelhallal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Hâlid el-Hallâl tercemesi"),
  E("yezidharun", "ahmedbhalidelhallal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Hâlid el-Hallâl tercemesi"),
  /* Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh -- hocalari */
  E("affanmuslim", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh tercemesi"),
  E("suleymanharb", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh tercemesi"),
  /* Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh -- talebeleri */
  E("ahmedbseyyarbeyyubebuh", "muhammedbnasrelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh tercemesi"),
  E("ahmedbseyyarbeyyubebuh", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Seyyâr b. Eyyûb Ebû Hasan el-Mervezî el-Fakīh tercemesi"),
  /* Ahmed b. Şebîb b. Saîd -- hocalari */
  E("yezidzurey", "ahmedbsebibbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Şebîb b. Saîd tercemesi"),
  /* Ahmed b. Şebîb b. Saîd -- talebeleri */
  E("ahmedbsebibbsaid", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Şebîb b. Saîd tercemesi"),
  E("ahmedbsebibbsaid", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Şebîb b. Saîd tercemesi"),
  /* Ahmed b. Abdullah b. Hakem -- hocalari */
  E("gunder", "ahmedbabdullahbhakem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Hakem tercemesi"),
  /* Ahmed b. Abdullah b. Muhammed -- hocalari */
  E("haccacmuhammed", "ahmedbabdullahbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  /* Ahmed b. Abdullah b. Muhammed -- talebeleri */
  E("ahmedbabdullahbmuhamme", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ahmedbabdullahbmuhamme", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  E("ahmedbabdullahbmuhamme", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Muhammed tercemesi"),
  /* Ahmed b. Abdullah b. Yûnus -- hocalari */
  E("israilyunus", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  /* Ahmed b. Abdullah b. Yûnus -- talebeleri */
  E("ahmedbabdullahbyunus", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  E("ahmedbabdullahbyunus", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Yûnus tercemesi"),
  /* Ahmed b. Abdirrahman b. Bekkâr -- hocalari */
  E("velidmuslim", "ahmedbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdirrahman b. Bekkâr tercemesi"),
  E("abdurrezzak", "ahmedbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdirrahman b. Bekkâr tercemesi"),
  /* Ahmed b. Abdirrahman b. Bekkâr -- talebeleri */
  E("ahmedbabdirrahman", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdirrahman b. Bekkâr tercemesi"),
  /* Ahmed b. Ömer Ebû Ca‘fer -- hocalari */
  E("ruhubade", "ahmedbomerebucafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Ömer Ebû Ca‘fer tercemesi"),
  /* Ahmed b. Amr b. Abdullah -- hocalari */
  E("safii", "ahmedbamrbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Amr b. Abdullah tercemesi"),
  E("velidmuslim", "ahmedbamrbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Amr b. Abdullah tercemesi"),
  E("bisrbekirtennisi", "ahmedbamrbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Amr b. Abdullah tercemesi"),
  /* Ahmed b. Amr b. Abdullah -- talebeleri */
  E("ahmedbamrbabdullah", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Amr b. Abdullah tercemesi"),
  /* Ahmed b. Îsâ b. Hassân el-Mısrî -- talebeleri */
  E("ahmedbisabhassanelmisr", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Îsâ b. Hassân el-Mısrî tercemesi"),
  E("ahmedbisabhassanelmisr", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Îsâ b. Hassân el-Mısrî tercemesi"),
  E("ahmedbisabhassanelmisr", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Îsâ b. Hassân el-Mısrî tercemesi"),
  /* Ahmed b. Muhammed b. Mugīre -- hocalari */
  E("bisrsuayb", "ahmedbmuhammedbmugire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Muhammed b. Mugīre tercemesi"),
  E("osmanbsaidbkesir", "ahmedbmuhammedbmugire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Muhammed b. Mugīre tercemesi"),
  /* Ahmed b. el-Mufaddal -- hocalari */
  E("israilyunus", "ahmedbelmufaddal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Mufaddal tercemesi"),
  /* Ahmed b. el-Mufaddal -- talebeleri */
  E("ahmedbelmufaddal", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Mufaddal tercemesi"),
  E("ahmedbelmufaddal", "ishakbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. el-Mufaddal tercemesi"),
  /* Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî -- hocalari */
  E("caferavn", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî tercemesi"),
  E("ruhubade", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî tercemesi"),
  E("yezidharun", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî tercemesi"),
  E("ibnnumeyr", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Nasr b. Ziyâd en-Nîsâbûrî tercemesi"),
  /* Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer -- hocalari */
  E("abdirrahmanbserikbabdu", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer tercemesi"),
  E("muhammedbisrabdi", "ahmedbyahyabzekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yahyâ b. Zekeriyyâ el-Evdî Ebû Ca‘fer tercemesi"),
  /* İbrâhim b. İshak b. Îsâ el-Bünânî -- hocalari */
  E("darevardi", "ibrahimbishakbisaelbun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. İshak b. Îsâ el-Bünânî tercemesi"),
  E("velidmuslim", "ibrahimbishakbisaelbun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. İshak b. Îsâ el-Bünânî tercemesi"),
  E("mutemirsuleyman", "ibrahimbishakbisaelbun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. İshak b. Îsâ el-Bünânî tercemesi"),
  /* İbrâhim b. el-Hâris b. İsmâîl Ebû İshak -- hocalari */
  E("yahyaebibukeyr", "ibrahimbelharisbismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. el-Hâris b. İsmâîl Ebû İshak tercemesi"),
  E("yezidharun", "ibrahimbelharisbismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. el-Hâris b. İsmâîl Ebû İshak tercemesi"),
  /* İbrâhim b. Habîb b. eş-Şehîd el-Ezdî Ebû İshak el-Basrî -- talebeleri */
  E("ibrahimbhabibbessehide", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Habîb b. eş-Şehîd el-Ezdî Ebû İshak el-Basrî tercemesi"),
  /* İbrâhim b. el-Haccâc -- hocalari */
  E("hammadzeyd", "ibrahimbelhaccac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. el-Haccâc tercemesi"),
  /* İbrâhim b. Hasan b. Necîh el-Bâhilî -- hocalari */
  E("haccacmuhammed", "ibrahimbhasan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hasan b. Necîh el-Bâhilî tercemesi"),
  E("elharisbatiyyeelbasri", "ibrahimbhasan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hasan b. Necîh el-Bâhilî tercemesi"),
  E("mahledbyezid", "ibrahimbhasan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hasan b. Necîh el-Bâhilî tercemesi"),
  /* İbrâhim b. Hamza b. Muhammed Ebû İshak -- hocalari */
  E("darevardi", "ibrahimbhamzabmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hamza b. Muhammed Ebû İshak tercemesi"),
  /* İbrâhim b. Hamza b. Muhammed Ebû İshak -- talebeleri */
  E("ibrahimbhamzabmuhammed", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hamza b. Muhammed Ebû İshak tercemesi"),
  E("ibrahimbhamzabmuhammed", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Hamza b. Muhammed Ebû İshak tercemesi"),
  /* İbrâhim b. Humeyd b. Abdirrahman -- hocalari */
  E("ismailebihalid", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  E("hisamurve", "ibrahimbhumeydbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  /* İbrâhim b. Humeyd b. Abdirrahman -- talebeleri */
  E("ibrahimbhumeydbabdirra", "sihabbabbadelabdiebuom", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  E("ibrahimbhumeydbabdirra", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Humeyd b. Abdirrahman tercemesi"),
  /* İbrâhim b. Dînâr Ebû İshak et-Temmâr -- hocalari */
  E("huseym", "ibrahimbdinarebuishake", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Dînâr Ebû İshak et-Temmâr tercemesi"),
  /* İbrâhim b. Dînâr Ebû İshak et-Temmâr -- talebeleri */
  E("ibrahimbdinarebuishake", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Dînâr Ebû İshak et-Temmâr tercemesi"),
  /* İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak -- hocalari */
  E("huseym", "ibrahimbabdullahbhatim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak tercemesi"),
  E("isabyunus", "ibrahimbabdullahbhatim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak tercemesi"),
  /* İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak -- talebeleri */
  E("ibrahimbabdullahbhatim", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak tercemesi"),
  E("ibrahimbabdullahbhatim", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Abdullah b. Hâtim el-Herevî Ebû İshak tercemesi"),
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
  /* İbrâhim b. Alâ b. ed-Dahhâk -- hocalari */
  E("ismailayyas", "ibrahimbalabeddahhak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Alâ b. ed-Dahhâk tercemesi"),
  E("velidmuslim", "ibrahimbalabeddahhak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Alâ b. ed-Dahhâk tercemesi"),
  E("bakiyyevelid", "ibrahimbalabeddahhak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Alâ b. ed-Dahhâk tercemesi"),
  /* İbrâhim b. Yezîd -- hocalari */
  E("muhammedabbadcafer", "ibrahimbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Yezîd tercemesi"),
  /* İbrâhim b. Yezîd -- talebeleri */
  E("ibrahimbyezid", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Yezîd tercemesi"),
  E("ibrahimbyezid", "mutemirsuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Yezîd tercemesi"),
  /* Ertât b. Münzir b. el-Esved -- hocalari */
  E("ibnganm", "ertatbmunzirbelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ertât b. Münzir b. el-Esved tercemesi"),
  E("mucahid", "ertatbmunzirbelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ertât b. Münzir b. el-Esved tercemesi"),
  E("saidmusayyeb", "ertatbmunzirbelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ertât b. Münzir b. el-Esved tercemesi"),
  /* Ertât b. Münzir b. el-Esved -- talebeleri */
  E("ertatbmunzirbelesved", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ertât b. Münzir b. el-Esved tercemesi"),
  /* İshak b. İbrâhim b. Süveyd -- hocalari */
  E("ademebiiyas", "ishakbibrahimbsuveyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Süveyd tercemesi"),
  E("eyyubsuleymanbilal", "ishakbibrahimbsuveyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Süveyd tercemesi"),
  /* İshak b. İbrâhim b. Süveyd -- talebeleri */
  E("ishakbibrahimbsuveyd", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Süveyd tercemesi"),
  /* İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî -- hocalari */
  E("yezidharun", "ishakbibrahimbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî tercemesi"),
  E("muazbhisambebiabdullah", "ishakbibrahimbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî tercemesi"),
  E("yusufbyakubbebikasimes", "ishakbibrahimbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî tercemesi"),
  /* İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî -- talebeleri */
  E("ishakbibrahimbmuhammed", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Muhammed es-Savvâf el-Bâhilî Ebû Ya‘kûb el-Basrî tercemesi"),
  /* İshak b. İbrâhim b. Yezîd Ebû Nadr ed-Dımaşkī -- hocalari */
  E("yahyabhamzabvakidelhad", "ishakbibrahimbyezidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim b. Yezîd Ebû Nadr ed-Dımaşkī tercemesi"),
  /* İshak b. İbrâhim -- talebeleri */
  E("ishakbibrahim", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. İbrâhim tercemesi"),
  /* İshak b. Bekir b. Mudar Ebû Ya‘kûb -- talebeleri */
  E("ishakbbekir", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Bekir b. Mudar Ebû Ya‘kûb tercemesi"),
  E("ishakbbekir", "musabkureysbnafiettemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Bekir b. Mudar Ebû Ya‘kûb tercemesi"),
  /* İshak b. Abdülvâhid -- hocalari */
  E("mafairan", "ishakbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Abdülvâhid tercemesi"),
  E("huseym", "ishakbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Abdülvâhid tercemesi"),
  E("darevardi", "ishakbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Abdülvâhid tercemesi"),
  E("fudaylibnayaz", "ishakbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Abdülvâhid tercemesi"),
  E("hammadzeyd", "ishakbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Abdülvâhid tercemesi"),
  /* İshak b. Muhammed b. İsmâîl -- talebeleri */
  E("ishakbmuhammedbismail", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Muhammed b. İsmâîl tercemesi"),
  /* İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî -- hocalari */
  E("velidmuslim", "ishakbmusababdullahebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  E("cerirabdulhamid", "ishakbmusababdullahebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  /* İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî -- talebeleri */
  E("ishakbmusababdullahebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  E("ishakbmusababdullahebu", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  E("ishakbmusababdullahebu", "bh06", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  E("ishakbmusababdullahebu", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İshak b. Mûsâ b. Abdullah Ebû Mûsâ el-Medenî tercemesi"),
  /* Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî -- hocalari */
  E("sabi", "esmabubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî tercemesi"),
  /* Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî -- talebeleri */
  E("esmabubeyd", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî tercemesi"),
  E("esmabubeyd", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Esmâ b. Ubeyd b. Muhârik ed-Dubaî Ebû el-Mufaddal el-Basrî tercemesi"),
  /* İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim -- hocalari */
  E("ismailayyas", "ismailbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  E("suaybishakdimaski", "ismailbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  E("huseym", "ismailbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  E("isabyunus", "ismailbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  /* İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim -- talebeleri */
  E("ismailbibrahim", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  E("ismailbibrahim", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  E("ismailbibrahim", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Bessâm Ebû İbrâhim tercemesi"),
  /* İsmâîl b. İbrâhim b. Miksem el-Esedî -- hocalari */
  E("abdulazizsuheyb", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("suleymanteymi", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("humeydtavil", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("asimahvel", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("cureyri", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("mamer", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("avfarabi", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("yunusubeyd", "ismailbibrahimbmikseme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  /* İsmâîl b. İbrâhim b. Miksem el-Esedî -- talebeleri */
  E("ismailbibrahimbmikseme", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "ibrahimtahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "safii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  E("ismailbibrahimbmikseme", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. İbrâhim b. Miksem el-Esedî tercemesi"),
  /* İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak -- hocalari */
  E("ruhubade", "ismailbebielharisesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  E("caferavn", "ismailbebielharisesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  E("abdulvehhabata", "ismailbebielharisesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  E("yezidharun", "ismailbebielharisesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  /* İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak -- talebeleri */
  E("ismailbebielharisesed", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  E("ismailbebielharisesed", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ebî el-Hâris Esed b. Şâhîn Ebû İshak tercemesi"),
  /* İsmâîl b. Halîfe -- hocalari */
  E("hakemuteybe", "ismailbhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  E("suddi", "ismailbhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  /* İsmâîl b. Halîfe -- talebeleri */
  E("ismailbhalife", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Halîfe tercemesi"),
  /* İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî -- hocalari */
  E("ebuhureyre", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî tercemesi"),
  E("sadubeyde", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî tercemesi"),
  E("ebuabdrahmansulemi", "ismailbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî tercemesi"),
  /* İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî -- talebeleri */
  E("ismailbabdirrahman", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî tercemesi"),
  E("ismailbabdirrahman", "ebubekirayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Abdirrahman b. Ebî Kerîme es-Süddî tercemesi"),
  /* İsmâîl b. Ubeyd b. Ebî Kerîme -- hocalari */
  E("yezidharun", "ismailbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ubeyd b. Ebî Kerîme tercemesi"),
  E("sebabesevvar", "ismailbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ubeyd b. Ebî Kerîme tercemesi"),
  /* İsmâîl b. Ubeyd b. Ebî Kerîme -- talebeleri */
  E("ismailbubeyd", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ubeyd b. Ebî Kerîme tercemesi"),
  E("ismailbubeyd", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Ubeyd b. Ebî Kerîme tercemesi"),
  /* İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr -- hocalari */
  E("sube", "ismailbb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr tercemesi"),
  E("hammadseleme", "ismailbb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr tercemesi"),
  /* İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr -- talebeleri */
  E("ismailbb", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mesleme b. Ka‘neb el-Hârisî Mesleme Ebû Bişr tercemesi"),
  /* İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed -- talebeleri */
  E("ismailbmusaelfezariebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  E("ismailbmusaelfezariebu", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Mûsâ el-Fezârî Ebû Muhammed tercemesi"),
  /* Rebîa b. Abdirrahman er-Remlî -- hocalari */
  E("mekhul", "rebiababdirrahmanerrem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebîa b. Abdirrahman er-Remlî tercemesi"),
  /* Rebîa b. Abdirrahman er-Remlî -- talebeleri */
  E("rebiababdirrahmanerrem", "evzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebîa b. Abdirrahman er-Remlî tercemesi"),
  E("rebiababdirrahmanerrem", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebîa b. Abdirrahman er-Remlî tercemesi"),
  /* Ümeyye b. Abdullah b. Hâlid -- talebeleri */
  E("umeyyebabdullahbhalid", "atiyyebkayselkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ümeyye b. Abdullah b. Hâlid tercemesi"),
  /* İyâs b. Seleme b. el-Ekva‘ Ebû Seleme -- talebeleri */
  E("iyasbselemebelekvaebus", "omerbsaibbebirasidelmi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İyâs b. Seleme b. el-Ekva‘ Ebû Seleme tercemesi"),
  E("iyasbselemebelekvaebus", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İyâs b. Seleme b. el-Ekva‘ Ebû Seleme tercemesi"),
  /* Eyyûb b. Beşîr b. Kâ‘b el-Adevî el-Basrî -- talebeleri */
  E("eyyubbbesirbkabeladevi", "humeydhilal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eyyûb b. Beşîr b. Kâ‘b el-Adevî el-Basrî tercemesi"),
  /* Bişr b. el-Hâris b. Abdirrahman -- hocalari */
  E("hammadzeyd", "bisrbelharisbabdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("fudaylibnayaz", "bisrbelharisbabdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("ebubekirayyas", "bisrbelharisbabdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("ibnmehdi", "bisrbelharisbabdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  /* Bişr b. el-Hâris b. Abdirrahman -- talebeleri */
  E("bisrbelharisbabdirrahm", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("bisrbelharisbabdirrahm", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("bisrbelharisbabdirrahm", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  E("bisrbelharisbabdirrahm", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Hâris b. Abdirrahman tercemesi"),
  /* Bişr b. Muhammed es-Sahtiyânî Ebû Muhammed el-Mervezî -- hocalari */
  E("fazlbmusa", "bisrbmuhammedessahtiya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Muhammed es-Sahtiyânî Ebû Muhammed el-Mervezî tercemesi"),
  /* Bişr b. Mansûr -- hocalari */
  E("eyyubsahtiyani", "bisrbmansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("cureyri", "bisrbmansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("asimahvel", "bisrbmansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("ibncureyc", "bisrbmansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  /* Bişr b. Mansûr -- talebeleri */
  E("bisrbmansur", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("bisrbmansur", "fudaylibnayaz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("bisrbmansur", "nersi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("bisrbmansur", "seybanferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  E("bisrbmansur", "kavariri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Mansûr tercemesi"),
  /* Bükeyr b. Ma‘rûf el-Esedî Ebû Muâz -- hocalari */
  E("yahyasaidensari", "bukeyrbmarufelesediebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bükeyr b. Ma‘rûf el-Esedî Ebû Muâz tercemesi"),
  /* Bükeyr b. Ma‘rûf el-Esedî Ebû Muâz -- talebeleri */
  E("bukeyrbmarufelesediebu", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bükeyr b. Ma‘rûf el-Esedî Ebû Muâz tercemesi"),
  /* Temîm b. Seleme es-Sülemî -- hocalari */
  E("sureyh", "temimbselemeessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  /* Temîm b. Seleme es-Sülemî -- talebeleri */
  E("temimbselemeessulemi", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  E("temimbselemeessulemi", "talhamusarrif", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Temîm b. Seleme es-Sülemî tercemesi"),
  /* Sâbit b. Umâre Ebû Mâlik el-Basrî -- talebeleri */
  E("sabitbumareebumalikelb", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Umâre Ebû Mâlik el-Basrî tercemesi"),
  E("sabitbumareebumalikelb", "osmanomerfaris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Umâre Ebû Mâlik el-Basrî tercemesi"),
  E("sabitbumareebumalikelb", "nadrsumeyl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Umâre Ebû Mâlik el-Basrî tercemesi"),
  /* Sâbit b. Kays el-Gıfârî -- hocalari */
  E("naficubeyr", "sabitbkayselgifari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Kays el-Gıfârî tercemesi"),
  E("haricezeyd", "sabitbkayselgifari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Kays el-Gıfârî tercemesi"),
  /* Sâbit b. Kays el-Gıfârî -- talebeleri */
  E("sabitbkayselgifari", "ibnebiuveys", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Kays el-Gıfârî tercemesi"),
  E("sabitbkayselgifari", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Kays el-Gıfârî tercemesi"),
  E("sabitbkayselgifari", "halidmahled", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Kays el-Gıfârî tercemesi"),
  /* Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr -- hocalari */
  E("sevri", "sabitbmusababdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  /* Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr -- talebeleri */
  E("sabitbmusababdirrahman", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  E("sabitbmusababdirrahman", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Mûsâ b. Abdirrahman Ebû Yezîd ed-Darîr tercemesi"),
  /* Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî -- hocalari */
  E("asimahvel", "sabitbyezidelahvelebuz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî tercemesi"),
  E("suleymanteymi", "sabitbyezidelahvelebuz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî tercemesi"),
  /* Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî -- talebeleri */
  E("sabitbyezidelahvelebuz", "abdullahbmuaviyebmusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî tercemesi"),
  E("sabitbyezidelahvelebuz", "muaviyeamrezdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâbit b. Yezîd el-Ahvel Ebû Zeyd el-Basrî tercemesi"),
  /* Câbir b. Nûh -- hocalari */
  E("amess", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("muhammedamralkame", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("ismailebihalid", "cabirbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  /* Câbir b. Nûh -- talebeleri */
  E("cabirbnuh", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("cabirbnuh", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  E("cabirbnuh", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Câbir b. Nûh tercemesi"),
  /* Ca‘fer b. Süleymân ed-Dubaî -- hocalari */
  E("cadebuosman", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Süleymân ed-Dubaî tercemesi"),
  E("ibncureyc", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Süleymân ed-Dubaî tercemesi"),
  E("ataisaib", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Süleymân ed-Dubaî tercemesi"),
  /* Ca‘fer b. Süleymân ed-Dubaî -- talebeleri */
  E("caferbsuleymaneddubai", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Süleymân ed-Dubaî tercemesi"),
  E("caferbsuleymaneddubai", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ca‘fer b. Süleymân ed-Dubaî tercemesi"),
  /* Hâtim b. Yûsuf b. Hâlid -- hocalari */
  E("fudaylibnayaz", "hatimbyusufbhalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâtim b. Yûsuf b. Hâlid tercemesi"),
  /* el-Hâris b. Esed b. Ma‘kıl el-Hemdânî -- hocalari */
  E("bisrbekirtennisi", "elharisbesedbmakilelhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Esed b. Ma‘kıl el-Hemdânî tercemesi"),
  /* el-Hâris b. Esed b. Ma‘kıl el-Hemdânî -- talebeleri */
  E("elharisbesedbmakilelhe", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Esed b. Ma‘kıl el-Hemdânî tercemesi"),
  /* el-Hâris b. Abdirrahman b. Abdullah -- hocalari */
  E("saidmusayyeb", "elharisbabdirrahmanbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  E("mucahid", "elharisbabdirrahmanbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  E("busrsaid", "elharisbabdirrahmanbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  /* el-Hâris b. Abdirrahman b. Abdullah -- talebeleri */
  E("elharisbabdirrahmanbab", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  E("elharisbabdirrahmanbab", "ismailumeyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  E("elharisbabdirrahmanbab", "suleymanhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Abdirrahman b. Abdullah tercemesi"),
  /* el-Hâris b. Atiyye el-Basrî -- hocalari */
  E("evzai", "elharisbatiyyeelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Atiyye el-Basrî tercemesi"),
  E("hisamhassan", "elharisbatiyyeelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Atiyye el-Basrî tercemesi"),
  E("mahledbhuseyin", "elharisbatiyyeelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Atiyye el-Basrî tercemesi"),
  E("sube", "elharisbatiyyeelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Atiyye el-Basrî tercemesi"),
  /* el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî -- hocalari */
  E("cubeyrnufeyr", "elharisbyezidelhadrami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî tercemesi"),
  /* el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî -- talebeleri */
  E("elharisbyezidelhadrami", "elvelidbmugirebsuleyma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî tercemesi"),
  E("elharisbyezidelhadrami", "evzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hâris b. Yezîd el-Hadramî Ebû Abdülkerîm el-Mısrî tercemesi"),
  /* Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî -- hocalari */
  E("abdulvahidziyad", "hamidbomerbhafsebibekr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî tercemesi"),
  E("hammadzeyd", "hamidbomerbhafsebibekr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî tercemesi"),
  /* Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî -- talebeleri */
  E("hamidbomerbhafsebibekr", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî tercemesi"),
  E("hamidbomerbhafsebibekr", "ms12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Ömer b. Hafs Ebû Abdirrahman el-Basrî tercemesi"),
  /* Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah -- hocalari */
  E("abdullahyusuftinnisi", "hamidbyahyabhaniebuabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah tercemesi"),
  /* Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah -- talebeleri */
  E("hamidbyahyabhaniebuabd", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah tercemesi"),
  E("hamidbyahyabhaniebuabd", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâmid b. Yahyâ b. Hâni’ Ebû Abdullah tercemesi"),
  /* Habîb b. Ebî Habîb el-Cermî el-Basrî -- talebeleri */
  E("habibbebihabibelcermie", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Habîb el-Cermî el-Basrî tercemesi"),
  E("habibbebihabibelcermie", "suleymanharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Habîb el-Cermî el-Basrî tercemesi"),
  /* Habîb b. Sâlih -- hocalari */
  E("yahyabcabirbhassanetta", "habibbsalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Sâlih tercemesi"),
  /* Habîb b. Sâlih -- talebeleri */
  E("habibbsalih", "bakiyyevelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Sâlih tercemesi"),
  /* Habîb b. Ebî Amre -- hocalari */
  E("mucahid", "habibbebiamre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  E("saidcubeyr", "habibbebiamre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  /* Habîb b. Ebî Amre -- talebeleri */
  E("habibbebiamre", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  E("habibbebiamre", "muhammedfudayl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  E("habibbebiamre", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb b. Ebî Amre tercemesi"),
  /* Habîb el-Muallim Ebû Muhammed el-Basrî -- hocalari */
  E("amrsuayb", "habibelmuallimebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb el-Muallim Ebû Muhammed el-Basrî tercemesi"),
  E("hisamurve", "habibelmuallimebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb el-Muallim Ebû Muhammed el-Basrî tercemesi"),
  /* Habîb el-Muallim Ebû Muhammed el-Basrî -- talebeleri */
  E("habibelmuallimebumuham", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb el-Muallim Ebû Muhammed el-Basrî tercemesi"),
  E("habibelmuallimebumuham", "abdulvarissaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Habîb el-Muallim Ebû Muhammed el-Basrî tercemesi"),
  /* Hasan b. İshak b. Ziyâd el-Leysî -- hocalari */
  E("ruhubade", "hasanbishakbziyadelley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. İshak b. Ziyâd el-Leysî tercemesi"),
  E("nadrsumeyl", "hasanbishakbziyadelley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. İshak b. Ziyâd el-Leysî tercemesi"),
  E("affanmuslim", "hasanbishakbziyadelley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. İshak b. Ziyâd el-Leysî tercemesi"),
  /* Hasan b. İshak b. Ziyâd el-Leysî -- talebeleri */
  E("hasanbishakbziyadelley", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. İshak b. Ziyâd el-Leysî tercemesi"),
  /* Hasan b. Bişr b. Selm -- hocalari */
  E("ebulahvess", "hasanbbisr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  E("kaysrebi", "hasanbbisr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  /* Hasan b. Bişr b. Selm -- talebeleri */
  E("hasanbbisr", "fazlbcaferbabdullahebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  E("hasanbbisr", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  E("hasanbbisr", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  E("hasanbbisr", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Bişr b. Selm tercemesi"),
  /* Hasan b. Sevbân b. Âmir -- hocalari */
  E("yezidebihabib", "hasanbsevbanbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Sevbân b. Âmir tercemesi"),
  /* Hasan b. Sevbân b. Âmir -- talebeleri */
  E("hasanbsevbanbamir", "amrharis", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Sevbân b. Âmir tercemesi"),
  /* Hasan b. Ebî Ca‘fer -- hocalari */
  E("asimbehdele", "hasanbebicafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ebî Ca‘fer tercemesi"),
  E("eyyubsahtiyani", "hasanbebicafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ebî Ca‘fer tercemesi"),
  E("leysebisuleym", "hasanbebicafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ebî Ca‘fer tercemesi"),
  /* Hasan b. Ebî Ca‘fer -- talebeleri */
  E("hasanbebicafer", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ebî Ca‘fer tercemesi"),
  E("hasanbebicafer", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ebî Ca‘fer tercemesi"),
  /* Hasan b. Habîb b. Nedebe -- hocalari */
  E("ismailebihalid", "hasanbhabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Habîb b. Nedebe tercemesi"),
  E("ruhbkasimettemimielanb", "hasanbhabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Habîb b. Nedebe tercemesi"),
  E("hisamurve", "hasanbhabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Habîb b. Nedebe tercemesi"),
  /* Hasan b. Habîb b. Nedebe -- talebeleri */
  E("hasanbhabib", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Habîb b. Nedebe tercemesi"),
  E("hasanbhabib", "kavariri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Habîb b. Nedebe tercemesi"),
  /* Hasan b. Zeyd b. Hasan Ebû Muhammed el-Medenî -- talebeleri */
  E("hasanbzeydbhasanebital", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Zeyd b. Hasan Ebû Muhammed el-Medenî tercemesi"),
  /* Hasan b. Abdülazîz b. el-Vezîr -- hocalari */
  E("amrebiselemetennisi", "hasanbabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Abdülazîz b. el-Vezîr tercemesi"),
  E("abdullahyusuftinnisi", "hasanbabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Abdülazîz b. el-Vezîr tercemesi"),
  /* Hasan b. Abdülazîz b. el-Vezîr -- talebeleri */
  E("hasanbabdulaziz", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Abdülazîz b. el-Vezîr tercemesi"),
  /* Hasan b. Ali b. Râşid el-Vâsıtî -- hocalari */
  E("huseym", "hasanbalibrasidsadevey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  E("mutemirsuleyman", "hasanbalibrasidsadevey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  E("abbadavvam", "hasanbalibrasidsadevey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  E("yezidharun", "hasanbalibrasidsadevey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  /* Hasan b. Ali b. Râşid el-Vâsıtî -- talebeleri */
  E("hasanbalibrasidsadevey", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  E("hasanbalibrasidsadevey", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ali b. Râşid el-Vâsıtî tercemesi"),
  /* Hasan b. Umâre el-Becelî -- hocalari */
  E("habibebisabit", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hakemuteybe", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("ebuishaksebii", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("amess", "hasanbumareelbeceli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  /* Hasan b. Umâre el-Becelî -- talebeleri */
  E("hasanbumareelbeceli", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  E("hasanbumareelbeceli", "halladyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Umâre el-Becelî tercemesi"),
  /* Hasan b. Ömer b. Şakīk el-Cermî -- hocalari */
  E("mutemirsuleyman", "hasanbomerbsakikelcerm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer b. Şakīk el-Cermî tercemesi"),
  E("hammadzeyd", "hasanbomerbsakikelcerm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer b. Şakīk el-Cermî tercemesi"),
  E("caferbsuleymaneddubai", "hasanbomerbsakikelcerm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer b. Şakīk el-Cermî tercemesi"),
  E("cerirabdulhamid", "hasanbomerbsakikelcerm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer b. Şakīk el-Cermî tercemesi"),
  /* Hasan b. Ömer b. Şakīk el-Cermî -- talebeleri */
  E("hasanbomerbsakikelcerm", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer b. Şakīk el-Cermî tercemesi"),
  /* Hasan b. Ömer -- talebeleri */
  E("hasanbomer", "ahmedbabdulmelikbvakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Ömer tercemesi"),
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
  /* Hasan b. Kaz‘a -- hocalari */
  E("mutemirsuleyman", "hasanbkaza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  E("fudaylibnayaz", "hasanbkaza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  /* Hasan b. Kaz‘a -- talebeleri */
  E("hasanbkaza", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  E("hasanbkaza", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  E("hasanbkaza", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  E("hasanbkaza", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  E("hasanbkaza", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Kaz‘a tercemesi"),
  /* Hasan b. Muhammed b. A‘yen Ebû Ali -- hocalari */
  E("makilbubeydelcezeriebu", "hasanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed b. A‘yen Ebû Ali tercemesi"),
  E("zuhayrmuaviye", "hasanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Muhammed b. A‘yen Ebû Ali tercemesi"),
  /* Hasan b. Yahyâ b. es-Seken er-Remlî -- hocalari */
  E("halidmahled", "hasanbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  E("abdullahbdavudbamirelh", "hasanbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  E("ubeydullahmusa", "hasanbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  E("nadrsumeyl", "hasanbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  E("yalaubeyd", "hasanbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  /* Hasan b. Yahyâ b. es-Seken er-Remlî -- talebeleri */
  E("hasanbyahya", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Yahyâ b. es-Seken er-Remlî tercemesi"),
  /* Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî -- hocalari */
  E("huseym", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("yezidzurey", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("velidmuslim", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("fazlbmusa", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("caferavn", "huseyinbhasanbharbessu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  /* Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî -- talebeleri */
  E("huseyinbhasanbharbessu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("huseyinbhasanbharbessu", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  E("huseyinbhasanbharbessu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan b. Harb es-Sülemî Ebû Abdullah el-Mervezî tercemesi"),
  /* Hüseyin b. Ali b. Hüseyin -- talebeleri */
  E("huseyinbalibhuseyinebi", "musaukbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Ali b. Hüseyin tercemesi"),
  /* Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî -- hocalari */
  E("yezidzurey", "huseyinbmuhammedbeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî tercemesi"),
  E("fudaylsuleyman", "huseyinbmuhammedbeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî tercemesi"),
  /* Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî -- talebeleri */
  E("huseyinbmuhammedbeyyub", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî tercemesi"),
  E("huseyinbmuhammedbeyyub", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî tercemesi"),
  E("huseyinbmuhammedbeyyub", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Muhammed b. Eyyûb ez-Zâri‘ Ebû Ali el-Basrî tercemesi"),
  /* Hüseyin b. Yezîd b. Yahyâ -- hocalari */
  E("abdusselamharb", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("abdulhamidbabdirrahman", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("muhammedfudayl", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("suleymanhayyan", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  E("ibnidris", "huseyinbyezidbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  /* Hüseyin b. Yezîd b. Yahyâ -- talebeleri */
  E("huseyinbyezidbyahya", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Yezîd b. Yahyâ tercemesi"),
  /* Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî -- hocalari */
  E("haricebbhariceebuelhac", "hafsbabdirrahmanbomere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  E("israilyunus", "hafsbabdirrahmanbomere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  E("ibnebiaruba", "hafsbabdirrahmanbomere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  E("asimahvel", "hafsbabdirrahmanbomere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  E("ibnebizib", "hafsbabdirrahmanbomere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  /* Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî -- talebeleri */
  E("hafsbabdirrahmanbomere", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  E("hafsbabdirrahmanbomere", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Abdirrahman b. Ömer Ebû Ömer el-Fakīh en-Nîsâbûrî tercemesi"),
  /* Hafs b. Meysere el-Ukaylî -- hocalari */
  E("hisamurve", "hafsbmeysereelukayli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  E("suheylebisalih", "hafsbmeysereelukayli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  /* Hafs b. Meysere el-Ukaylî -- talebeleri */
  E("hafsbmeysereelukayli", "amrebiselemetennisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  E("hafsbmeysereelukayli", "heysembhariceebuahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  E("hafsbmeysereelukayli", "ademebiiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  E("hafsbmeysereelukayli", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hafs b. Meysere el-Ukaylî tercemesi"),
  /* Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih -- hocalari */
  E("damrarebia", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("ismailayyas", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("velidmuslim", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("yahyabhamzabvakidelhad", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("hikalziyad", "hakembmusabebizuheyreb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  /* Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih -- talebeleri */
  E("hakembmusabebizuheyreb", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("hakembmusabebizuheyreb", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("hakembmusabebizuheyreb", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  E("hakembmusabebizuheyreb", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hakem b. Mûsâ b. Ebî Züheyr Ebû Sâlih tercemesi"),
  /* Humeyd b. Hâni’ Ebû Hâni’ el-Havlânî el-Mısrî -- hocalari */
  E("amrhurays", "humeydbhaniebuhanielha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Humeyd b. Hâni’ Ebû Hâni’ el-Havlânî el-Mısrî tercemesi"),
  /* Humeyd b. Hâni’ Ebû Hâni’ el-Havlânî el-Mısrî -- talebeleri */
  E("humeydbhaniebuhanielha", "abdirrahmanbsureyhbube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Humeyd b. Hâni’ Ebû Hâni’ el-Havlânî el-Mısrî tercemesi"),
  /* Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs -- hocalari */
  E("ismailayyas", "hayvebsureyhbyezidelha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  E("damrarebia", "hayvebsureyhbyezidelha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  E("velidmuslim", "hayvebsureyhbyezidelha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  /* Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs -- talebeleri */
  E("hayvebsureyhbyezidelha", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  E("hayvebsureyhbyezidelha", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  E("hayvebsureyhbyezidelha", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayve b. Şüreyh b. Yezîd el-Hadramî Ebû Abbâs tercemesi"),
  /* Hâlid b. Humeyd -- hocalari */
  E("halidbyezidelcumahi", "halidbhumeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Humeyd tercemesi"),
  /* Hâlid b. Hayyân Ebû Yezîd el-Kindî -- hocalari */
  E("caferburkan", "halidbhayyanebuyezidel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Hayyân Ebû Yezîd el-Kindî tercemesi"),
  E("hemmamyahya", "halidbhayyanebuyezidel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Hayyân Ebû Yezîd el-Kindî tercemesi"),
  /* Hâlid b. Hayyân Ebû Yezîd el-Kindî -- talebeleri */
  E("halidbhayyanebuyezidel", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Hayyân Ebû Yezîd el-Kindî tercemesi"),
  E("halidbhayyanebuyezidel", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Hayyân Ebû Yezîd el-Kindî tercemesi"),
  E("halidbhayyanebuyezidel", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Hayyân Ebû Yezîd el-Kindî tercemesi"),
  /* Hâlid b. Ziyâd el-Ezdî Ebû Abdirrahman -- hocalari */
  E("ebussiddiknaci", "halidbziyadelezdiebuab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Ziyâd el-Ezdî Ebû Abdirrahman tercemesi"),
  E("misersukdam", "halidbziyadelezdiebuab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Ziyâd el-Ezdî Ebû Abdirrahman tercemesi"),
  /* Hâlid b. Seleme b. el-Âs -- hocalari */
  E("saidmusayyeb", "halidbselemebelas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("sabi", "halidbselemebelas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  /* Hâlid b. Seleme b. el-Âs -- talebeleri */
  E("halidbselemebelas", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "misersukdam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  E("halidbselemebelas", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Seleme b. el-Âs tercemesi"),
  /* Hâlid b. Yezîd b. Abdirrahman -- talebeleri */
  E("halidbyezidbabdirrahma", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Abdirrahman tercemesi"),
  E("halidbyezidbabdirrahma", "heysembhariceebuahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Abdirrahman tercemesi"),
  E("halidbyezidbabdirrahma", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Abdirrahman tercemesi"),
  E("halidbyezidbabdirrahma", "hisambhalidbzeydebumer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Abdirrahman tercemesi"),
  E("halidbyezidbabdirrahma", "suveydsaidhadesani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Abdirrahman tercemesi"),
  /* Hâlid b. Yezîd b. Muâviye Ebû Hâşim ed-Dımaşkī -- talebeleri */
  E("halidbyezidbmuaviyeebi", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd b. Muâviye Ebû Hâşim ed-Dımaşkī tercemesi"),
  /* Hâlid b. Yezîd el-Cümahî -- hocalari */
  E("saidebihilal", "halidbyezidelcumahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd el-Cümahî tercemesi"),
  E("b", "halidbyezidelcumahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâlid b. Yezîd el-Cümahî tercemesi"),
  /* el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân -- hocalari */
  E("huseym", "elhidrbmuhammedbsucael", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân tercemesi"),
  E("caferbsuleymaneddubai", "elhidrbmuhammedbsucael", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân tercemesi"),
  /* el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân -- talebeleri */
  E("elhidrbmuhammedbsucael", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Hıdr b. Muhammed b. Şücâ‘ el-Cezerî Ebû Mervân tercemesi"),
  /* Halef b. Eyyûb el-Âmirî Ebû Saîd -- hocalari */
  E("avfarabi", "halefbeyyubelamiriebus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Eyyûb el-Âmirî Ebû Saîd tercemesi"),
  E("mamer", "halefbeyyubelamiriebus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Eyyûb el-Âmirî Ebû Saîd tercemesi"),
  E("kaysrebi", "halefbeyyubelamiriebus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Eyyûb el-Âmirî Ebû Saîd tercemesi"),
  E("israilyunus", "halefbeyyubelamiriebus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Eyyûb el-Âmirî Ebû Saîd tercemesi"),
  /* Halef b. Eyyûb el-Âmirî Ebû Saîd -- talebeleri */
  E("halefbeyyubelamiriebus", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Eyyûb el-Âmirî Ebû Saîd tercemesi"),
  /* Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman -- hocalari */
  E("israilyunus", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman tercemesi"),
  E("ebulahvess", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman tercemesi"),
  /* Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman -- talebeleri */
  E("halefbtemim", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Temîm b. Ebî Attâb Ebû Abdirrahman tercemesi"),
  /* Halef b. Halîfe b. Sâid el-Eşce‘î -- hocalari */
  E("ismailebihalid", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  E("malik", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  E("ataisaib", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  /* Halef b. Halîfe b. Sâid el-Eşce‘î -- talebeleri */
  E("halefbhalifebsaidelesc", "surayjnuman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  E("halefbhalifebsaidelesc", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Halîfe b. Sâid el-Eşce‘î tercemesi"),
  /* Halef b. Muhammed b. Îsâ -- hocalari */
  E("ruhubade", "halefbmuhammedbisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  E("yezidharun", "halefbmuhammedbisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  /* Halef b. Muhammed b. Îsâ -- talebeleri */
  E("halefbmuhammedbisa", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  E("halefbmuhammedbisa", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  E("halefbmuhammedbisa", "ed28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  E("halefbmuhammedbisa", "ed07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Halef b. Muhammed b. Îsâ tercemesi"),
  /* Hallâd b. Süleymân el-Hadramî Ebû Süleymân el-Mısrî -- talebeleri */
  E("halladbsuleymanelhadra", "yahyababdullahbbukeyre", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Süleymân el-Hadramî Ebû Süleymân el-Mısrî tercemesi"),
  /* Hallâd b. Yezîd el-Cu‘fî -- hocalari */
  E("zuhayrmuaviye", "halladbyezidelcufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Yezîd el-Cu‘fî tercemesi"),
  /* Hallâd b. Yezîd el-Cu‘fî -- talebeleri */
  E("halladbyezidelcufi", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Yezîd el-Cu‘fî tercemesi"),
  E("halladbyezidelcufi", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hallâd b. Yezîd el-Cu‘fî tercemesi"),
  /* Dâvûd b. Amr b. Züheyr Ebû Süleymân -- hocalari */
  E("nafiomercumahi", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  E("hammadzeyd", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  E("ebulahvess", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  E("davudattar", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  E("abdirrahmanbabdullahbo", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  E("isabyunus", "davudbamrbzuheyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  /* Dâvûd b. Amr b. Züheyr Ebû Süleymân -- talebeleri */
  E("davudbamrbzuheyr", "muhammedbahmedbcafereb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Amr b. Züheyr Ebû Süleymân tercemesi"),
  /* Dâvûd b. Yezîd b. Abdirrahman el-Evdî -- hocalari */
  E("sabi", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  E("hakemuteybe", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  E("simakharb", "davudbyezidbabdirrahma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Dâvûd b. Yezîd b. Abdirrahman el-Evdî tercemesi"),
  /* Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî -- hocalari */
  E("damrarebia", "rasidbsaidbrasidebubek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  E("velidmuslim", "rasidbsaidbrasidebubek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  E("muhammedsuaybsabur", "rasidbsaidbrasidebubek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  E("yezidharun", "rasidbsaidbrasidebubek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  E("ubeydullahmusa", "rasidbsaidbrasidebubek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  /* Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî -- talebeleri */
  E("rasidbsaidbrasidebubek", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Râşid b. Saîd b. Râşid Ebû Bekir er-Remlî tercemesi"),
  /* Rebâh b. Zeyd -- hocalari */
  E("mamer", "rebahbzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebâh b. Zeyd tercemesi"),
  /* Rebâh b. Zeyd -- talebeleri */
  E("rebahbzeyd", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebâh b. Zeyd tercemesi"),
  /* Rebâh b. Abdirrahman b. Ebî Süfyân Ebû Bekir el-Medenî -- hocalari */
  E("muhammedsevban", "rebahbabdirrahmanbebis", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebâh b. Abdirrahman b. Ebî Süfyân Ebû Bekir el-Medenî tercemesi"),
  /* Rabî‘ b. Müslim el-Cümahî Ebû Bekir el-Basrî -- talebeleri */
  E("rabibmuslimelcumahiebu", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Müslim el-Cümahî Ebû Bekir el-Basrî tercemesi"),
  E("rabibmuslimelcumahiebu", "muslimibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Müslim el-Cümahî Ebû Bekir el-Basrî tercemesi"),
  E("rabibmuslimelcumahiebu", "musaismailtebuzeki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Müslim el-Cümahî Ebû Bekir el-Basrî tercemesi"),
  /* Rabî‘ b. Nâfi‘ Ebû Tevbe -- hocalari */
  E("muaviyesellam", "rabibnafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  E("ubeydbamrbebielvelideb", "rabibnafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  E("saidbabdirrahmanelcuma", "rabibnafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  E("isabyunus", "rabibnafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  /* Rabî‘ b. Nâfi‘ Ebû Tevbe -- talebeleri */
  E("rabibnafi", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  E("rabibnafi", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Nâfi‘ Ebû Tevbe tercemesi"),
  /* Rabî‘ b. Yahyâ b. Miksem -- hocalari */
  E("sube", "rabibyahyabmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  E("israilyunus", "rabibyahyabmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  E("malikmigvel", "rabibyahyabmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  E("hammadseleme", "rabibyahyabmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  /* Rabî‘ b. Yahyâ b. Miksem -- talebeleri */
  E("rabibyahyabmiksem", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  E("rabibyahyabmiksem", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Yahyâ b. Miksem tercemesi"),
  /* Rebîa b. Seyf b. Mâti‘ -- hocalari */
  E("abdullahamr", "rebiabseyf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rebîa b. Seyf b. Mâti‘ tercemesi"),
  /* Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî -- hocalari */
  E("hemmamyahya", "ruhbeslemelbahiliebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî tercemesi"),
  /* Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî -- talebeleri */
  E("ruhbeslemelbahiliebuha", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî tercemesi"),
  E("ruhbeslemelbahiliebuha", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî tercemesi"),
  E("ruhbeslemelbahiliebuha", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Eslem el-Bâhilî Ebû Hâtim el-Basrî tercemesi"),
  /* Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs -- hocalari */
  E("muhammedacilan", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs tercemesi"),
  E("atabebimeymuneelbasrie", "ruhbkasimettemimielanb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs tercemesi"),
  /* Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs -- talebeleri */
  E("ruhbkasimettemimielanb", "ibnebiaruba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs tercemesi"),
  E("ruhbkasimettemimielanb", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ruh b. Kâsım et-Temîmî el-Anberî Ebû Giyâs tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. İyâs -- hocalari */
  E("ibnrahuye", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  E("duhaym", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  E("ibnebiomeradeni", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  E("bundar", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  E("harunhammal", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  E("hebbanhilal", "zekeriyyabyahyabiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. İyâs -- talebeleri */
  E("zekeriyyabyahyabiyas", "ishakbibrahimbyunuselv", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. İyâs tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn -- hocalari */
  E("ibnnumeyr", "zekeriyyabyahyabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn tercemesi"),
  E("ebubekirayyas", "zekeriyyabyahyabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn tercemesi"),
  /* Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn -- talebeleri */
  E("zekeriyyabyahyabomer", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn tercemesi"),
  E("zekeriyyabyahyabomer", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn tercemesi"),
  E("zekeriyyabyahyabomer", "halefbhalifebsaidelesc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zekeriyyâ b. Yahyâ b. Ömer Ebû es-Sükeyn tercemesi"),
  /* Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî -- hocalari */
  E("ibnidris", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("cerirabdulhamid", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("ibnnumeyr", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("abdurrezzak", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("omeryunusyemami", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("muazbhisambebiabdullah", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("huseym", "zuheyrbharbbseddad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  /* Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî -- talebeleri */
  E("zuheyrbharbbseddad", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("zuheyrbharbbseddad", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("zuheyrbharbbseddad", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("zuheyrbharbbseddad", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  E("zuheyrbharbbseddad", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Züheyr b. Harb b. Şeddâd Ebû Hayseme en-Nesâî tercemesi"),
  /* Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim -- hocalari */
  E("ibnidris", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  E("ebubekirayyas", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  E("huseym", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  E("mutemirsuleyman", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  E("yezidharun", "ziyadbeyyubbziyadebuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  /* Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim -- talebeleri */
  E("ziyadbeyyubbziyadebuha", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Eyyûb b. Ziyâd Ebû Hâşim tercemesi"),
  /* Ziyâd b. Rabî‘ -- hocalari */
  E("sumameenes", "ziyadbrabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  E("halidselememahzumi", "ziyadbrabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  E("hisamhassan", "ziyadbrabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  /* Ziyâd b. Rabî‘ -- talebeleri */
  E("ziyadbrabi", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  E("ziyadbrabi", "muhammedbsaidbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  E("ziyadbrabi", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rabî‘ tercemesi"),
  /* Ziyâd b. Rebîa b. Nuaym -- talebeleri */
  E("ziyadbrebiabnuaym", "elharisbyezidelhadrami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Rebîa b. Nuaym tercemesi"),
  /* Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî -- hocalari */
  E("irakmalik", "ziyadbebiziyadmeyseree", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî tercemesi"),
  /* Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî -- talebeleri */
  E("ziyadbebiziyadmeyseree", "musaukbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî tercemesi"),
  E("ziyadbebiziyadmeyseree", "usamezeydleysi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Ebî Ziyâd Meysere el-Mahzûmî el-Medenî tercemesi"),
  /* Ziyâd b. Yûnus b. Saîd el-Hadramî Ebû Selâme -- talebeleri */
  E("ziyadbyunusbsaidelhadr", "muhammedbselemebebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ziyâd b. Yûnus b. Saîd el-Hadramî Ebû Selâme tercemesi"),
  /* Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî -- hocalari */
  E("ebanosman", "zeydbalibhuseyinebital", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  E("urve", "zeydbalibhuseyinebital", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  E("ubeydullaherafi", "zeydbalibhuseyinebital", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  /* Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî -- talebeleri */
  E("zeydbalibhuseyinebital", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  E("zeydbalibhuseyinebital", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  E("zeydbalibhuseyinebital", "suddi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  E("zeydbalibhuseyinebital", "zubeydyami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Ali b. Hüseyin Ebû Hüseyin el-Medenî tercemesi"),
  /* Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī -- hocalari */
  E("abdirrahmanbsabitbsevb", "zeydbyahyabubeydelhuza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī tercemesi"),
  E("evzai", "zeydbyahyabubeydelhuza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī tercemesi"),
  /* Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī -- talebeleri */
  E("zeydbyahyabubeydelhuza", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī tercemesi"),
  E("zeydbyahyabubeydelhuza", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī tercemesi"),
  E("zeydbyahyabubeydelhuza", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Yahyâ b. Ubeyd el-Huzâî Ebû Abdullah ed-Dımaşkī tercemesi"),
  /* Sâlim b. Abdullah -- hocalari */
  E("ebuhureyre", "salimbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  E("abdrahmanebubekir", "salimbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  E("ebusaid", "salimbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  /* Sâlim b. Abdullah -- talebeleri */
  E("salimbabdullah", "bukeyresec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  E("salimbabdullah", "muhammedamralkame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  E("salimbabdullah", "ebuselemeavf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Abdullah tercemesi"),
  /* Sâlim b. Aclân -- hocalari */
  E("saidcubeyr", "salimbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Aclân tercemesi"),
  /* Sâlim b. Aclân -- talebeleri */
  E("salimbaclan", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Aclân tercemesi"),
  E("salimbaclan", "mervanbsucaelcezeriebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlim b. Aclân tercemesi"),
  /* Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî -- hocalari */
  E("ibnebiaruba", "saidbevsbsabitebuzeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî tercemesi"),
  E("suleymanteymi", "saidbevsbsabitebuzeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî tercemesi"),
  E("ibncureyc", "saidbevsbsabitebuzeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî tercemesi"),
  /* Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî -- talebeleri */
  E("saidbevsbsabitebuzeyde", "sehlbmuhammedbosmanebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Evs b. Sâbit Ebû Zeyd el-Ensârî en-Nahvî tercemesi"),
  /* Saîd b. Hafs b. Amr -- hocalari */
  E("zuhayrmuaviye", "saidbhafsbamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hafs b. Amr tercemesi"),
  E("makilbubeydelcezeriebu", "saidbhafsbamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hafs b. Amr tercemesi"),
  /* Saîd b. Hakem b. Muhammed -- hocalari */
  E("abdirrahmanbabdullahbo", "saidbhakembmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  E("darevardi", "saidbhakembmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  /* Saîd b. Hakem b. Muhammed -- talebeleri */
  E("saidbhakembmuhammed", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  E("saidbhakembmuhammed", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  E("saidbhakembmuhammed", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  E("saidbhakembmuhammed", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  E("saidbhakembmuhammed", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hakem b. Muhammed tercemesi"),
  /* Saîd b. Abdirrahman b. Abdullah ez-Zübeydî -- hocalari */
  E("mucahid", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("saidcubeyr", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("nehai", "saidbabdirrahmanbabdul", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  /* Saîd b. Abdirrahman b. Abdullah ez-Zübeydî -- talebeleri */
  E("saidbabdirrahmanbabdul", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  E("saidbabdirrahmanbabdul", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Abdirrahman b. Abdullah ez-Zübeydî tercemesi"),
  /* Saîd b. Kesîr b. Ufeyr -- hocalari */
  E("yahyabeyyub", "saidbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Kesîr b. Ufeyr tercemesi"),
  E("yakubbabdirrahmanbmuha", "saidbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Kesîr b. Ufeyr tercemesi"),
  /* Saîd b. Kesîr b. Ufeyr -- talebeleri */
  E("saidbkesir", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Kesîr b. Ufeyr tercemesi"),
  E("saidbkesir", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Kesîr b. Ufeyr tercemesi"),
  E("saidbkesir", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Kesîr b. Ufeyr tercemesi"),
  /* Saîd b. Mervân b. Ali Ebû Osmân -- hocalari */
  E("ibnmain", "saidbmervanbaliebuosma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  E("ahmedbabdullahbyunus", "saidbmervanbaliebuosma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  E("suleymanharb", "saidbmervanbaliebuosma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  E("kanebi", "saidbmervanbaliebuosma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  E("misned", "saidbmervanbaliebuosma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  /* Saîd b. Mervân b. Ali Ebû Osmân -- talebeleri */
  E("saidbmervanbaliebuosma", "bh20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Mervân b. Ali Ebû Osmân tercemesi"),
  /* Saîd b. Nadr Ebû Osmân -- hocalari */
  E("huseym", "saidbnadrebuosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Nadr Ebû Osmân tercemesi"),
  /* Saîd b. Hâni’ el-Havlânî Ebû Osmân el-Mısrî -- talebeleri */
  E("saidbhanielhavlaniebuo", "muaviyesalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Hâni’ el-Havlânî Ebû Osmân el-Mısrî tercemesi"),
  /* Seleme b. Süleymân el-Mervezî Ebû Süleymân -- talebeleri */
  E("selemebsuleymanelmerve", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Süleymân el-Mervezî Ebû Süleymân tercemesi"),
  E("selemebsuleymanelmerve", "ahmedbabdullahbeyyubeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Süleymân el-Mervezî Ebû Süleymân tercemesi"),
  E("selemebsuleymanelmerve", "ahmedbsaidbibrahimelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Süleymân el-Mervezî Ebû Süleymân tercemesi"),
  /* Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî -- hocalari */
  E("ibnsirin", "selemebalkameettemimie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî tercemesi"),
  /* Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî -- talebeleri */
  E("selemebalkameettemimie", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî tercemesi"),
  E("selemebalkameettemimie", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî tercemesi"),
  E("selemebalkameettemimie", "bisrmufaddal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî tercemesi"),
  E("selemebalkameettemimie", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Seleme b. Alkame et-Temîmî Ebû Bişr el-Basrî tercemesi"),
  /* Süleym b. Âmir -- hocalari */
  E("ebudderda", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleym b. Âmir tercemesi"),
  E("ebuhureyre", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleym b. Âmir tercemesi"),
  E("atiyyebkayselkilabi", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleym b. Âmir tercemesi"),
  E("cubeyrnufeyr", "suleymbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleym b. Âmir tercemesi"),
  /* Süleymân b. Eyyûb b. Süleymân Ebû Eyyûb ed-Dımaşkī -- hocalari */
  E("duhaym", "suleymanbeyyubbsuleyma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Eyyûb b. Süleymân Ebû Eyyûb ed-Dımaşkī tercemesi"),
  /* Süleymân b. Büreyde b. el-Hasıyb el-Mervezî -- hocalari */
  E("imranhusayn", "suleymanbbureydebelhas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Büreyde b. el-Hasıyb el-Mervezî tercemesi"),
  E("yahyayamer", "suleymanbbureydebelhas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Büreyde b. el-Hasıyb el-Mervezî tercemesi"),
  /* Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ -- hocalari */
  E("ismailayyas", "suleymanbdavud", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  E("abdirrahmanbmuhammedbz", "suleymanbdavud", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  E("ibnebizaide", "suleymanbdavud", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  /* Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ -- talebeleri */
  E("suleymanbdavud", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  E("suleymanbdavud", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  E("suleymanbdavud", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd b. Reşîd el-Ahvel Ebû Rabî‘ tercemesi"),
  /* Süleymân b. Dâvûd Ebû Rabî‘ -- hocalari */
  E("hammadzeyd", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  /* Süleymân b. Dâvûd Ebû Rabî‘ -- talebeleri */
  E("suleymanbdavudeburabie", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  E("suleymanbdavudeburabie", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  E("suleymanbdavudeburabie", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  E("suleymanbdavudeburabie", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  E("suleymanbdavudeburabie", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Dâvûd Ebû Rabî‘ tercemesi"),
  /* Süleymân b. Süleym Ebû Seleme eş-Şâmî -- hocalari */
  E("amrsuayb", "suleymanbsuleymebusele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Süleym Ebû Seleme eş-Şâmî tercemesi"),
  /* Süleymân b. Süleym Ebû Seleme eş-Şâmî -- talebeleri */
  E("suleymanbsuleymebusele", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Süleym Ebû Seleme eş-Şâmî tercemesi"),
  E("suleymanbsuleymebusele", "muhammedharbhavlani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Süleym Ebû Seleme eş-Şâmî tercemesi"),
  E("suleymanbsuleymebusele", "abdullahbsalimelesarie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Süleym Ebû Seleme eş-Şâmî tercemesi"),
  /* Süleymân b. Seyf b. Yahyâ -- hocalari */
  E("yezidharun", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("yakubbibrahimbsadebuyu", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("yalaubeyd", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("caferavn", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("abdussamed", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("halidmahled", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("saidamirdubai", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("affanmuslim", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("hisamtayalisi", "suleymanbseyfbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  /* Süleymân b. Seyf b. Yahyâ -- talebeleri */
  E("suleymanbseyfbyahya", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  E("suleymanbseyfbyahya", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Seyf b. Yahyâ tercemesi"),
  /* Süleymân b. Abdullah b. Muhammed Ebû Eyyûb -- talebeleri */
  E("suleymanbabdullahbmuha", "ms14", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdullah b. Muhammed Ebû Eyyûb tercemesi"),
  /* Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb -- hocalari */
  E("ebulyemanhakem", "suleymanbabdulhamidbra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb tercemesi"),
  E("hayvebsureyhbyezidelha", "suleymanbabdulhamidbra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb tercemesi"),
  E("aliayyas", "suleymanbabdulhamidbra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb tercemesi"),
  /* Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb -- talebeleri */
  E("suleymanbabdulhamidbra", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdülhamîd b. Râfi‘ Ebû Eyyûb tercemesi"),
  /* Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb -- hocalari */
  E("yahyabhamzabvakidelhad", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("velidmuslim", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("halidbyezidbabdirrahma", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("hatimismail", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("damrarebia", "suleymanbabdirrahmanbi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  /* Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb -- talebeleri */
  E("suleymanbabdirrahmanbi", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("suleymanbabdirrahmanbi", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  E("suleymanbabdirrahmanbi", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Abdirrahman b. Îsâ et-Temîmî ed-Dımaşkī Ebû Eyyûb tercemesi"),
  /* Süleymân b. Ma‘bed b. Kevsecân -- hocalari */
  E("abdurrezzak", "suleymanbmabed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  E("nadrsumeyl", "suleymanbmabed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  E("caferavn", "suleymanbmabed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  E("osmanomerfaris", "suleymanbmabed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  E("suleymanharb", "suleymanbmabed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  /* Süleymân b. Ma‘bed b. Kevsecân -- talebeleri */
  E("suleymanbmabed", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süleymân b. Ma‘bed b. Kevsecân tercemesi"),
  /* Sehl b. Eslem el-Adevî -- hocalari */
  E("humeydhilal", "sehlbeslemeladevi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  E("humeydtavil", "sehlbeslemeladevi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  /* Sehl b. Eslem el-Adevî -- talebeleri */
  E("sehlbeslemeladevi", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  E("sehlbeslemeladevi", "ziyadyahyahassani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  E("sehlbeslemeladevi", "kavariri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  E("sehlbeslemeladevi", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Eslem el-Adevî tercemesi"),
  /* Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd -- hocalari */
  E("yezidzurey", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  E("hammadzeyd", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  E("alimushir", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  E("abdurrezzak", "sehlbosmanbfariselkind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  /* Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd -- talebeleri */
  E("sehlbosmanbfariselkind", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  E("sehlbosmanbfariselkind", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Osmân b. Fâris el-Kindî Ebû Mes‘ûd tercemesi"),
  /* Sehl b. Muhammed b. ez-Zübeyr -- hocalari */
  E("ebubekirayyas", "sehlbmuhammedbezzubeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. ez-Zübeyr tercemesi"),
  E("ibnidris", "sehlbmuhammedbezzubeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. ez-Zübeyr tercemesi"),
  E("ibnebizaide", "sehlbmuhammedbezzubeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. ez-Zübeyr tercemesi"),
  /* Sehl b. Muhammed b. ez-Zübeyr -- talebeleri */
  E("sehlbmuhammedbezzubeyr", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. ez-Zübeyr tercemesi"),
  E("sehlbmuhammedbezzubeyr", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. ez-Zübeyr tercemesi"),
  /* Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî -- talebeleri */
  E("sehlbmuhammedbosmanebu", "ed24", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî tercemesi"),
  E("sehlbmuhammedbosmanebu", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî tercemesi"),
  E("sehlbmuhammedbosmanebu", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî tercemesi"),
  E("sehlbmuhammedbosmanebu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Muhammed b. Osmân Ebû Hâtim es-Sicistânî en-Nahvî tercemesi"),
  /* Sehl b. Yûsuf el-Basrî -- hocalari */
  E("avfarabi", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("humeydtavil", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("suleymanteymi", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("avvamhavseb", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("sube", "sehlbyusufelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  /* Sehl b. Yûsuf el-Basrî -- talebeleri */
  E("sehlbyusufelbasri", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("sehlbyusufelbasri", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  E("sehlbyusufelbasri", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sehl b. Yûsuf el-Basrî tercemesi"),
  /* Süveyd b. Abdülazîz b. Nümeyr es-Sülemî -- hocalari */
  E("humeydtavil", "suveydbabdulazizbnumey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  E("asimahvel", "suveydbabdulazizbnumey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  E("evzai", "suveydbabdulazizbnumey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  E("hisambammar", "suveydbabdulazizbnumey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  /* Süveyd b. Abdülazîz b. Nümeyr es-Sülemî -- talebeleri */
  E("suveydbabdulazizbnumey", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  E("suveydbabdulazizbnumey", "duhaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Süveyd b. Abdülazîz b. Nümeyr es-Sülemî tercemesi"),
  /* Sellâm b. Süleymân el-Müzenî Ebû Münzir -- hocalari */
  E("sabitbunani", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("davudebihind", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("alizeydcudan", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("matarverrak", "sellambsuleymanelmuzen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  /* Sellâm b. Süleymân el-Müzenî Ebû Münzir -- talebeleri */
  E("sellambsuleymanelmuzen", "ibnuyeyne", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("sellambsuleymanelmuzen", "affanmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("sellambsuleymanelmuzen", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  E("sellambsuleymanelmuzen", "ahmedbibrahimbhalidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sellâm b. Süleymân el-Müzenî Ebû Münzir tercemesi"),
  /* Şücâ‘ b. Mahled el-Fellâs Ebû Fazl -- hocalari */
  E("ismailayyas", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şücâ‘ b. Mahled el-Fellâs Ebû Fazl tercemesi"),
  E("huseym", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şücâ‘ b. Mahled el-Fellâs Ebû Fazl tercemesi"),
  /* Şücâ‘ b. Mahled el-Fellâs Ebû Fazl -- talebeleri */
  E("sucabmahledelfellasebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şücâ‘ b. Mahled el-Fellâs Ebû Fazl tercemesi"),
  E("sucabmahledelfellasebu", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şücâ‘ b. Mahled el-Fellâs Ebû Fazl tercemesi"),
  /* Şuayb b. Harb el-Medâinî Ebû Sâlih -- hocalari */
  E("ikrimeammar", "suaybbharbelmedainiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  E("israilyunus", "suaybbharbelmedainiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  E("misersukdam", "suaybbharbelmedainiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  /* Şuayb b. Harb el-Medâinî Ebû Sâlih -- talebeleri */
  E("suaybbharbelmedainiebu", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  E("suaybbharbelmedainiebu", "ahmedbhalidelhallal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  E("suaybbharbelmedainiebu", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Harb el-Medâinî Ebû Sâlih tercemesi"),
  /* Şuayb b. Leys b. Sa‘d -- talebeleri */
  E("suaybbleysbsad", "rebimuradi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şuayb b. Leys b. Sa‘d tercemesi"),
  /* Şihâb b. Abbâd el-Abdî Ebû Ömer -- hocalari */
  E("caferbsuleymaneddubai", "sihabbabbadelabdiebuom", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şihâb b. Abbâd el-Abdî Ebû Ömer tercemesi"),
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
  E("simakharb", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("amess", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("bebielmuharibi", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("ziyadilaka", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("mansurmutemir", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("hilalvezzan", "seybanbabdirrahmanette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  /* Şeybân b. Abdirrahman et-Temîmî -- talebeleri */
  E("seybanbabdirrahmanette", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ademebiiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "ubeydullahmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  E("seybanbabdirrahmanette", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şeybân b. Abdirrahman et-Temîmî tercemesi"),
  /* Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed -- hocalari */
  E("yezidzurey", "salihbhatim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed tercemesi"),
  E("hammadzeyd", "salihbhatim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed tercemesi"),
  E("mutemirsuleyman", "salihbhatim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed tercemesi"),
  /* Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed -- talebeleri */
  E("salihbhatim", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed tercemesi"),
  E("salihbhatim", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Hâtim b. Verdân el-Basrî Ebû Muhammed tercemesi"),
  /* Sadaka b. Abdullah -- hocalari */
  E("ibncureyc", "sadakababdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("ibnebiaruba", "sadakababdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("musaukbe", "sadakababdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("hisamurve", "sadakababdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("evzai", "sadakababdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  /* Sadaka b. Abdullah -- talebeleri */
  E("sadakababdullah", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("sadakababdullah", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("sadakababdullah", "amrebiselemetennisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  E("sadakababdullah", "firyabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sadaka b. Abdullah tercemesi"),
  /* Safvân b. Süleym el-Medenî Ebû Abdullah -- hocalari */
  E("ibnganm", "safvanbsuleymelmedenie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  E("ebuumamesehl", "safvanbsuleymelmedenie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  E("ebuselemeavf", "safvanbsuleymelmedenie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  E("atayesar", "safvanbsuleymelmedenie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  /* Safvân b. Süleym el-Medenî Ebû Abdullah -- talebeleri */
  E("safvanbsuleymelmedenie", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  E("safvanbsuleymelmedenie", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  E("safvanbsuleymelmedenie", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Safvân b. Süleym el-Medenî Ebû Abdullah tercemesi"),
  /* Damra b. Habîb b. Suheyb ez-Zübeydî -- hocalari */
  E("ebuumame", "damrabhabibbsuheybezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Damra b. Habîb b. Suheyb ez-Zübeydî tercemesi"),
  /* Damra b. Habîb b. Suheyb ez-Zübeydî -- talebeleri */
  E("damrabhabibbsuheybezzu", "muaviyesalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Damra b. Habîb b. Suheyb ez-Zübeydî tercemesi"),
  E("damrabhabibbsuheybezzu", "ertatbmunzirbelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Damra b. Habîb b. Suheyb ez-Zübeydî tercemesi"),
  /* Talha b. Abdullah b. Avf ez-Zührî el-Medenî -- hocalari */
  E("ebuhureyre", "talhababdullahbavfezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Abdullah b. Avf ez-Zührî el-Medenî tercemesi"),
  /* Talha b. Amr b. Osmân el-Hadramî el-Mekkî -- hocalari */
  E("muhammedamralkame", "talhabamrbosmanelhadra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  E("saidcubeyr", "talhabamrbosmanelhadra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  /* Talha b. Amr b. Osmân el-Hadramî el-Mekkî -- talebeleri */
  E("talhabamrbosmanelhadra", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  E("talhabamrbosmanelhadra", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  E("talhabamrbosmanelhadra", "caferavn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  E("talhabamrbosmanelhadra", "ubeydullahmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Amr b. Osmân el-Hadramî el-Mekkî tercemesi"),
  /* Talha b. Yahyâ b. Talha -- hocalari */
  E("mucahid", "talhabyahyabtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  /* Talha b. Yahyâ b. Talha -- talebeleri */
  E("talhabyahyabtalha", "ibnidris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  E("talhabyahyabtalha", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  E("talhabyahyabtalha", "ismailzekeriyya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  E("talhabyahyabtalha", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Talha b. Yahyâ b. Talha tercemesi"),
  /* Âsım b. Yûsuf Ebû Amr -- hocalari */
  E("israilyunus", "asimbyusufebuamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  E("ebulahvess", "asimbyusufebuamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  /* Âsım b. Yûsuf Ebû Amr -- talebeleri */
  E("asimbyusufebuamr", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âsım b. Yûsuf Ebû Amr tercemesi"),
  /* Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî -- hocalari */
  E("ebueyyub", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  E("ummuseleme", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  E("cabirsemura", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  E("ebanosman", "amirbsadbebivakkasezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  /* Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî -- talebeleri */
  E("amirbsadbebivakkasezzu", "mucahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  E("amirbsadbebivakkasezzu", "musaukbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Sa‘d b. Ebî Vakkās ez-Zührî el-Medenî tercemesi"),
  /* Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî -- talebeleri */
  E("amirbabdullahbezzubeyr", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî tercemesi"),
  E("amirbabdullahbezzubeyr", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî tercemesi"),
  E("amirbabdullahbezzubeyr", "osmanbhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî tercemesi"),
  E("amirbabdullahbezzubeyr", "malik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Âmir b. Abdullah b. ez-Zübeyr Ebû el-Hâris el-Medenî tercemesi"),
  /* Abbâd b. Mûsâ -- hocalari */
  E("ismailcafer", "abbadbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  E("halefbhalifebsaidelesc", "abbadbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  E("abbadavvam", "abbadbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  E("huseym", "abbadbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  /* Abbâd b. Mûsâ -- talebeleri */
  E("abbadbmusa", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  E("abbadbmusa", "bh06", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  E("abbadbmusa", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Mûsâ tercemesi"),
  /* Abbâd b. Yûsuf el-Kindî Ebû Osmân -- hocalari */
  E("ertatbmunzirbelesved", "abbadbyusufelkindiebuo", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Yûsuf el-Kindî Ebû Osmân tercemesi"),
  /* Abbâd b. Yûsuf el-Kindî Ebû Osmân -- talebeleri */
  E("abbadbyusufelkindiebuo", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâd b. Yûsuf el-Kindî Ebû Osmân tercemesi"),
  /* Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib -- hocalari */
  E("muslimibrahim", "abbasbcaferbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("ahmedbabdullahbyunus", "abbasbcaferbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("ahmedbishakbzeydebiish", "abbasbcaferbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("sebabesevvar", "abbasbcaferbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("kanebi", "abbasbcaferbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  /* Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib -- talebeleri */
  E("abbasbcaferbabdullah", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("abbasbcaferbabdullah", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  E("abbasbcaferbabdullah", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Ca‘fer b. Abdullah Ebû Muhammed b. Ebî Tâlib tercemesi"),
  /* Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim -- hocalari */
  E("velidmuslim", "abbasbosmanbmuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim tercemesi"),
  E("ismailayyas", "abbasbosmanbmuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim tercemesi"),
  /* Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim -- talebeleri */
  E("abbasbosmanbmuhammedel", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim tercemesi"),
  E("abbasbosmanbmuhammedel", "ms23", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Osmân b. Muhammed el-Becelî Ebû Fazl ed-Dımaşkī el-Muallim tercemesi"),
  /* Abbâs b. Muhammed b. Hâtim Ebû Fazl -- hocalari */
  E("saidamirdubai", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("halidmahled", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("ebudavudtayalisi", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("ebuamirakadi", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("abdullahbavnbebiavnbye", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("ubeydullahmusa", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("alihasansakik", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("ebunuaymfadl", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("yahyaebibukeyr", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("affanmuslim", "abbasbmuhammedbhatimeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  /* Abbâs b. Muhammed b. Hâtim Ebû Fazl -- talebeleri */
  E("abbasbmuhammedbhatimeb", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("abbasbmuhammedbhatimeb", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("abbasbmuhammedbhatimeb", "ed28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("abbasbmuhammedbhatimeb", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  E("abbasbmuhammedbhatimeb", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. Muhammed b. Hâtim Ebû Fazl tercemesi"),
  /* Abbâs b. el-Velîd b. Subh -- hocalari */
  E("zeydbyahyabubeydelhuza", "abbasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("mervanbmuhammedbhassan", "abbasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("firyabi", "abbasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  /* Abbâs b. el-Velîd b. Subh -- talebeleri */
  E("abbasbelvelid", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("abbasbelvelid", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("abbasbelvelid", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("abbasbelvelid", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("abbasbelvelid", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  E("abbasbelvelid", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Velîd b. Subh tercemesi"),
  /* Abdullah b. İshak el-Basrî -- hocalari */
  E("bedelmuhabber", "abdullahbishakelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İshak el-Basrî tercemesi"),
  E("yahyabhammadbebiziyade", "abdullahbishakelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İshak el-Basrî tercemesi"),
  /* Abdullah b. İshak el-Basrî -- talebeleri */
  E("abdullahbishakelbasri", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İshak el-Basrî tercemesi"),
  E("abdullahbishakelbasri", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İshak el-Basrî tercemesi"),
  /* Abdullah b. Ebî Bekir b. Muhammed -- hocalari */
  E("salimibnomer", "abdullahbebibekirbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Bekir b. Muhammed tercemesi"),
  E("urve", "abdullahbebibekirbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Bekir b. Muhammed tercemesi"),
  /* Abdullah b. Ebî Bekir b. Muhammed -- talebeleri */
  E("abdullahbebibekirbmuha", "hisamurve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Bekir b. Muhammed tercemesi"),
  E("abdullahbebibekirbmuha", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Bekir b. Muhammed tercemesi"),
  E("abdullahbebibekirbmuha", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Bekir b. Muhammed tercemesi"),
  /* Abdullah b. Ca‘fer b. Gaylân -- hocalari */
  E("darevardi", "abdullahbcaferbgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("mutemirsuleyman", "abdullahbcaferbgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  /* Abdullah b. Ca‘fer b. Gaylân -- talebeleri */
  E("abdullahbcaferbgaylan", "ahmeddevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "ismailbabdullahbzurare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "alibhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "muaviyebsalihbebiubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  E("abdullahbcaferbgaylan", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ca‘fer b. Gaylân tercemesi"),
  /* Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî -- hocalari */
  E("bhayve", "abdullahbebizekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî tercemesi"),
  E("ubadesamit", "abdullahbebizekeriyyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî tercemesi"),
  /* Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî -- talebeleri */
  E("abdullahbebizekeriyyae", "rebiayezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî tercemesi"),
  E("abdullahbebizekeriyyae", "saidabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî tercemesi"),
  E("abdullahbebizekeriyyae", "evzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ebî Zekeriyyâ el-Huzâî Ebû Yahyâ eş-Şâmî tercemesi"),
  /* Abdullah b. Zeyd b. Eslem el-Adevî -- talebeleri */
  E("abdullahbzeydbeslemela", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Zeyd b. Eslem el-Adevî tercemesi"),
  E("abdullahbzeydbeslemela", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Zeyd b. Eslem el-Adevî tercemesi"),
  /* Abdullah b. Sâlim el-Eş‘arî Ebû Yûsuf -- talebeleri */
  E("abdullahbsalimelesarie", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim el-Eş‘arî Ebû Yûsuf tercemesi"),
  /* Abdullah b. Sâlim -- hocalari */
  E("ubeydullahmusa", "abdullahbsalim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  /* Abdullah b. Sâlim -- talebeleri */
  E("abdullahbsalim", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  E("abdullahbsalim", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  E("abdullahbsalim", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlim tercemesi"),
  /* Abdullah b. Sa‘d b. İbrâhim -- hocalari */
  E("yunusbmuhammedbmuslime", "abdullahbsadbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sa‘d b. İbrâhim tercemesi"),
  E("caferavn", "abdullahbsadbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sa‘d b. İbrâhim tercemesi"),
  /* Abdullah b. Süleym el-Cezerî Ebû Abdirrahman -- hocalari */
  E("isabyunus", "abdullahbsuleymelcezer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Süleym el-Cezerî Ebû Abdirrahman tercemesi"),
  /* Abdullah b. Süleym el-Cezerî Ebû Abdirrahman -- talebeleri */
  E("abdullahbsuleymelcezer", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Süleym el-Cezerî Ebû Abdirrahman tercemesi"),
  E("abdullahbsuleymelcezer", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Süleym el-Cezerî Ebû Abdirrahman tercemesi"),
  /* Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî -- hocalari */
  E("muaviyesalih", "abdullahbsalihbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("harmalaimran", "abdullahbsalihbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("saidabdulaziz", "abdullahbsalihbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("bisrsari", "abdullahbsalihbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  /* Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî -- talebeleri */
  E("abdullahbsalihbmuhamme", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("abdullahbsalihbmuhamme", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("abdullahbsalihbmuhamme", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("abdullahbsalihbmuhamme", "duhaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  E("abdullahbsalihbmuhamme", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Sâlih b. Muhammed Ebû Sâlih el-Mısrî tercemesi"),
  /* Abdullah b. Âmir b. Zürâre el-Hadramî -- hocalari */
  E("ebubekirayyas", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("ibnebizaide", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("muhammedfudayl", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("ubeydebhumeydebuabdirr", "abdullahbamirbzurareel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  /* Abdullah b. Âmir b. Zürâre el-Hadramî -- talebeleri */
  E("abdullahbamirbzurareel", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  E("abdullahbamirbzurareel", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Zürâre el-Hadramî tercemesi"),
  /* Abdullah b. Âmir b. Yezîd -- hocalari */
  E("numanbesir", "abdullahbamirbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Yezîd tercemesi"),
  E("ebuidrishavlani", "abdullahbamirbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Yezîd tercemesi"),
  /* Abdullah b. Âmir b. Yezîd -- talebeleri */
  E("abdullahbamirbyezid", "rebiayezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Yezîd tercemesi"),
  E("abdullahbamirbyezid", "cafercrebia", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Yezîd tercemesi"),
  E("abdullahbamirbyezid", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Âmir b. Yezîd tercemesi"),
  /* Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî -- hocalari */
  E("abdullahdinar", "abdullahbabdullahbuvey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("yahyasaidensari", "abdullahbabdullahbuvey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("hisamurve", "abdullahbabdullahbuvey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("alaabdrahman", "abdullahbabdullahbuvey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  /* Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî -- talebeleri */
  E("abdullahbabdullahbuvey", "yakubbibrahimbsadebuyu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "muallamansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "ismailb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  E("abdullahbabdullahbuvey", "abdullahbmuaviyebmusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. Üveys Ebû Üveys el-Medenî tercemesi"),
  /* Abdullah b. Abdullah b. el-Hâris Ebû Yahyâ el-Medenî -- hocalari */
  E("abdullahsedddad", "abdullahbabdullahbelha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdullah b. el-Hâris Ebû Yahyâ el-Medenî tercemesi"),
  /* Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız -- hocalari */
  E("nadrsumeyl", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("mervanbmuhammedbhassan", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("yezidharun", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("habbanhilal", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("caferavn", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("saidamirdubai", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("osmanomerfaris", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("yalaubeyd", "abdullahbabdirrahmanbf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  /* Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız -- talebeleri */
  E("abdullahbabdirrahmanbf", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  E("abdullahbabdirrahmanbf", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdirrahman b. Fazl Ebû Muhammed el-Hâfız tercemesi"),
  /* Abdullah b. Abdüssamed b. Ebî Hıdâş -- hocalari */
  E("velidmuslim", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  E("mutemirsuleyman", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  E("isabyunus", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  E("mahledbyezid", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  E("ishakbabdulvahid", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  E("mafairan", "abdullahbabdussamed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdüssamed b. Ebî Hıdâş tercemesi"),
  /* Abdullah b. Ubeyd -- talebeleri */
  E("abdullahbubeyd", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  E("abdullahbubeyd", "ismailumeyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  E("abdullahbubeyd", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  E("abdullahbubeyd", "evzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  E("abdullahbubeyd", "ikrimeammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  E("abdullahbubeyd", "ataisaib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ubeyd tercemesi"),
  /* Abdullah b. Osmân b. Cebele -- hocalari */
  E("yezidzurey", "abdullahbosmanbcebele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  E("cerirabdulhamid", "abdullahbosmanbcebele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  E("sube", "abdullahbosmanbcebele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  E("hammadzeyd", "abdullahbosmanbcebele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  /* Abdullah b. Osmân b. Cebele -- talebeleri */
  E("abdullahbosmanbcebele", "ms22", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  E("abdullahbosmanbcebele", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Osmân b. Cebele tercemesi"),
  /* Abdullah b. Ömer b. Muhammed -- hocalari */
  E("ebulahvess", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("muhammedfudayl", "abdullahbomerbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  /* Abdullah b. Ömer b. Muhammed -- talebeleri */
  E("abdullahbomerbmuhammed", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("abdullahbomerbmuhammed", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  E("abdullahbomerbmuhammed", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ömer b. Muhammed tercemesi"),
  /* Abdullah b. İmrân b. Rezîn -- hocalari */
  E("darevardi", "abdullahbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İmrân b. Rezîn tercemesi"),
  E("fudaylibnayaz", "abdullahbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İmrân b. Rezîn tercemesi"),
  E("isabyunus", "abdullahbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İmrân b. Rezîn tercemesi"),
  /* Abdullah b. İmrân b. Rezîn -- talebeleri */
  E("abdullahbimran", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İmrân b. Rezîn tercemesi"),
  E("abdullahbimran", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. İmrân b. Rezîn tercemesi"),
  /* Abdullah b. Alâ b. Zebr -- hocalari */
  E("sevryezid", "abdullahbala", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("salimibnomer", "abdullahbala", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("atiyyebkayselkilabi", "abdullahbala", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("kasimmuhammed", "abdullahbala", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  /* Abdullah b. Alâ b. Zebr -- talebeleri */
  E("abdullahbala", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("abdullahbala", "muhammedsuaybsabur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("abdullahbala", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  E("abdullahbala", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Alâ b. Zebr tercemesi"),
  /* Abdullah b. Ayyâş -- hocalari */
  E("arac", "abdullahbayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ayyâş tercemesi"),
  /* Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed -- hocalari */
  E("saidcubeyr", "abdullahbisababdirrahm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed tercemesi"),
  /* Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed -- talebeleri */
  E("abdullahbisababdirrahm", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed tercemesi"),
  E("abdullahbisababdirrahm", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Îsâ b. Abdirrahman Ebû Muhammed tercemesi"),
  /* Abdullah b. Gālib -- talebeleri */
  E("abdullahbgalib", "kasimbfazl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Gālib tercemesi"),
  /* Abdullah b. Ferrûh el-Horâsânî -- hocalari */
  E("usamezeydleysi", "abdullahbferruhelhoras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ferrûh el-Horâsânî tercemesi"),
  E("amess", "abdullahbferruhelhoras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ferrûh el-Horâsânî tercemesi"),
  E("ibncureyc", "abdullahbferruhelhoras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ferrûh el-Horâsânî tercemesi"),
  E("hisamurve", "abdullahbferruhelhoras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ferrûh el-Horâsânî tercemesi"),
  /* Abdullah b. Ferrûh el-Horâsânî -- talebeleri */
  E("abdullahbferruhelhoras", "amrbrabibtarik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Ferrûh el-Horâsânî tercemesi"),
  /* Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed -- hocalari */
  E("ebulminhal", "abdullahbkesireddariel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed tercemesi"),
  E("ikrime", "abdullahbkesireddariel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed tercemesi"),
  /* Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed -- talebeleri */
  E("abdullahbkesireddariel", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed tercemesi"),
  E("abdullahbkesireddariel", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed tercemesi"),
  E("abdullahbkesireddariel", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dârî el-Mekkî Ebû Ma‘bed tercemesi"),
  /* Abdullah b. Kesîr ed-Dımaşkī et-Tavîl -- hocalari */
  E("saidabdulaziz", "abdullahbkesireddimask", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dımaşkī et-Tavîl tercemesi"),
  /* Abdullah b. Kesîr ed-Dımaşkī et-Tavîl -- talebeleri */
  E("abdullahbkesireddimask", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dımaşkī et-Tavîl tercemesi"),
  E("abdullahbkesireddimask", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Kesîr ed-Dımaşkī et-Tavîl tercemesi"),
  /* Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî -- talebeleri */
  E("abdullahbmuhammedbesma", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî tercemesi"),
  E("abdullahbmuhammedbesma", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî tercemesi"),
  E("abdullahbmuhammedbesma", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî tercemesi"),
  E("abdullahbmuhammedbesma", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Esmâ Ebû Ubeyd ed-Dubaî tercemesi"),
  /* Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir -- hocalari */
  E("hammadzeyd", "abdullahbmuhammedbebie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("caferbsuleymaneddubai", "abdullahbmuhammedbebie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("kureysbeneselensari", "abdullahbmuhammedbebie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("abdulvahidziyad", "abdullahbmuhammedbebie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("muazbhisambebiabdullah", "abdullahbmuhammedbebie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  /* Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir -- talebeleri */
  E("abdullahbmuhammedbebie", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("abdullahbmuhammedbebie", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  E("abdullahbmuhammedbebie", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ebî el-Esved el-Basrî Ebû Bekir tercemesi"),
  /* Abdullah b. Muhammed b. Abdullah -- hocalari */
  E("yezidhusayfe", "abdullahbmuhammedbabdu2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  /* Abdullah b. Muhammed b. Abdullah -- talebeleri */
  E("abdullahbmuhammedbabdu2", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "ibrahimmunzirhizami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "muhammedbhisambisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  E("abdullahbmuhammedbabdu2", "ahmedabde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Abdullah tercemesi"),
  /* Abdullah b. Muhammed b. Ubeyd -- hocalari */
  E("ahmedbibrahimbhalidebu", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("ahmeddevraki", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("alicad", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("ibrahimmunzirhizami", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("halefhisam", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("sericyunus", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("saidsuleymansadeviye", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("mansurbebimuzahimbesir", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("ebudavud", "abdullahbmuhammedbubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  /* Abdullah b. Muhammed b. Ubeyd -- talebeleri */
  E("abdullahbmuhammedbubey", "ms20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("abdullahbmuhammedbubey", "ed24", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  E("abdullahbmuhammedbubey", "ed04", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ubeyd tercemesi"),
  /* Abdullah b. Muhammed b. Ali -- hocalari */
  E("davudattar", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("zuhayrmuaviye", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("darevardi", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("huseym", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("abdusselamharb", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("abbadavvam", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("makilbubeydelcezeriebu", "abdullahbmuhammedbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  /* Abdullah b. Muhammed b. Ali -- talebeleri */
  E("abdullahbmuhammedbali", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("abdullahbmuhammedbali", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  E("abdullahbmuhammedbali", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed b. Ali tercemesi"),
  /* Abdullah b. Muhammed el-Yemâmî -- hocalari */
  E("darevardi", "abdullahbmuhammedelyem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Yemâmî tercemesi"),
  E("abdurrezzak", "abdullahbmuhammedelyem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Yemâmî tercemesi"),
  /* Abdullah b. Muhammed el-Yemâmî -- talebeleri */
  E("abdullahbmuhammedelyem", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Yemâmî tercemesi"),
  E("abdullahbmuhammedelyem", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Yemâmî tercemesi"),
  E("abdullahbmuhammedelyem", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Muhammed el-Yemâmî tercemesi"),
  /* Abdullah b. Mahled -- hocalari */
  E("mekkiibrahim", "abdullahbmahled", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mahled tercemesi"),
  E("affanmuslim", "abdullahbmahled", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mahled tercemesi"),
  E("ahmedhanbel", "abdullahbmahled", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mahled tercemesi"),
  /* Abdullah b. el-Müseyyeb -- hocalari */
  E("ikrime", "abdullahbelmuseyyeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Müseyyeb tercemesi"),
  /* Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî -- hocalari */
  E("huseym", "abdullahbmutibrasidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("ismailcafer", "abdullahbmutibrasidebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî tercemesi"),
  /* Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî -- talebeleri */
  E("abdullahbmutibrasidebu", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("abdullahbmutibrasidebu", "ishakbibrahimbyunuselv", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Mutī‘ b. Râşid Ebû Muhammed en-Nîsâbûrî tercemesi"),
  /* Abdullah b. Heysem b. Osmân -- hocalari */
  E("ebuamirakadi", "abdullahbheysembosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  E("yezidharun", "abdullahbheysembosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  E("hammadmesade", "abdullahbheysembosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  /* Abdullah b. Heysem b. Osmân -- talebeleri */
  E("abdullahbheysembosman", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  E("abdullahbheysembosman", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  E("abdullahbheysembosman", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Heysem b. Osmân tercemesi"),
  /* Abdullah b. el-Velîd b. Kays et-Tüceybî el-Mısrî -- hocalari */
  E("saidmusayyeb", "abdullahbelvelidbkayse", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. el-Velîd b. Kays et-Tüceybî el-Mısrî tercemesi"),
  /* Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî -- hocalari */
  E("ibnidris", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("muhammedbkasimelesedie", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("yahyaadem", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("yalaubeyd", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("caferavn", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  /* Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî -- talebeleri */
  E("abdulalabvasilbabdulal", "cerirabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  E("abdulalabvasilbabdulal", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüla‘lâ b. Vâsıl b. Abdüla‘lâ el-Esedî tercemesi"),
  /* Abdülhamîd b. Sâlih b. Aclân -- hocalari */
  E("ebubekirayyas", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("fudaylibnayaz", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("zuhayrmuaviye", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("huseym", "abdulhamidbsalihbaclan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  /* Abdülhamîd b. Sâlih b. Aclân -- talebeleri */
  E("abdulhamidbsalihbaclan", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  E("abdulhamidbsalihbaclan", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Sâlih b. Aclân tercemesi"),
  /* Abdülhamîd b. Abdirrahman -- hocalari */
  E("ebuburde", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("amess", "abdulhamidbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  /* Abdülhamîd b. Abdirrahman -- talebeleri */
  E("abdulhamidbabdirrahman", "muhammedbhalefebubekir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  E("abdulhamidbabdirrahman", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Abdirrahman tercemesi"),
  /* Abdülhamîd b. Muhammed b. el-Müstâm -- hocalari */
  E("mahledbyezid", "abdulhamidbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Muhammed b. el-Müstâm tercemesi"),
  /* Abdülhamîd b. Muhammed b. el-Müstâm -- talebeleri */
  E("abdulhamidbmuhammed", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Muhammed b. el-Müstâm tercemesi"),
  E("abdulhamidbmuhammed", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülhamîd b. Muhammed b. el-Müstâm tercemesi"),
  /* Abdirrahman b. Bekir b. Rabî‘ -- talebeleri */
  E("abdirrahmanbbekirbrabi", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Bekir b. Rabî‘ tercemesi"),
  E("abdirrahmanbbekirbrabi", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Bekir b. Rabî‘ tercemesi"),
  /* Abdirrahman b. Sâbit b. Sevbân -- hocalari */
  E("alaabdrahman", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  E("amrdinar", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  /* Abdirrahman b. Sâbit b. Sevbân -- talebeleri */
  E("abdirrahmanbsabitbsevb", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  E("abdirrahmanbsabitbsevb", "osmanbsaidbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  E("abdirrahmanbsabitbsevb", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  E("abdirrahmanbsabitbsevb", "aliayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Sâbit b. Sevbân tercemesi"),
  /* Abdirrahman b. Cübeyr -- hocalari */
  E("enes", "abdirrahmanbcubeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  /* Abdirrahman b. Cübeyr -- talebeleri */
  E("abdirrahmanbcubeyr", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  E("abdirrahmanbcubeyr", "muaviyesalih", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  E("abdirrahmanbcubeyr", "sevryezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  E("abdirrahmanbcubeyr", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  E("abdirrahmanbcubeyr", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Cübeyr tercemesi"),
  /* Abdirrahman b. el-Hâris b. Abdullah -- hocalari */
  E("ebuhureyre", "abdirrahmanbelharisbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  E("hafsa", "abdirrahmanbelharisbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  E("ummuseleme", "abdirrahmanbelharisbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  E("zekvanmevlaaise", "abdirrahmanbelharisbab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  /* Abdirrahman b. el-Hâris b. Abdullah -- talebeleri */
  E("abdirrahmanbelharisbab", "ebukilabe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  E("abdirrahmanbelharisbab", "sabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. el-Hâris b. Abdullah tercemesi"),
  /* Abdirrahman b. Hammâd b. Şuays -- hocalari */
  E("ibnebiaruba", "abdirrahmanbhammad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Hammâd b. Şuays tercemesi"),
  /* Abdirrahman b. Humeyd b. Abdirrahman -- hocalari */
  E("saidmusayyeb", "abdirrahmanbhumeydbabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Humeyd b. Abdirrahman tercemesi"),
  /* Abdirrahman b. Humeyd b. Abdirrahman -- talebeleri */
  E("abdirrahmanbhumeydbabd", "salihkeysan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Humeyd b. Abdirrahman tercemesi"),
  E("abdirrahmanbhumeydbabd", "hatimismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Humeyd b. Abdirrahman tercemesi"),
  /* Abdirrahman b. Şerîk b. Abdullah en-Nehaî -- talebeleri */
  E("abdirrahmanbserikbabdu", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Şerîk b. Abdullah en-Nehaî tercemesi"),
  E("abdirrahmanbserikbabdu", "muhammedbebigalibettay", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Şerîk b. Abdullah en-Nehaî tercemesi"),
  /* Abdirrahman b. Âbis -- talebeleri */
  E("abdirrahmanbabis", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Âbis tercemesi"),
  E("abdirrahmanbabis", "kaysrebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Âbis tercemesi"),
  /* Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd -- hocalari */
  E("ebansattar", "abdirrahmanbabdullahbu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  E("zuhayrmuaviye", "abdirrahmanbabdullahbu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  E("hammadseleme", "abdirrahmanbabdullahbu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  E("sube", "abdirrahmanbabdullahbu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  /* Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd -- talebeleri */
  E("abdirrahmanbabdullahbu", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  E("abdirrahmanbabdullahbu", "ibnebiomeradeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Ubeyd el-Basrî Ebû Saîd tercemesi"),
  /* Abdirrahman b. Abdülhamîd b. Sâlim -- hocalari */
  E("ukaylhalid", "abdirrahmanbabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülhamîd b. Sâlim tercemesi"),
  E("yahyabeyyub2", "abdirrahmanbabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülhamîd b. Sâlim tercemesi"),
  /* Abdirrahman b. Abdülhamîd b. Sâlim -- talebeleri */
  E("abdirrahmanbabdulhamid", "ibnvehb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülhamîd b. Sâlim tercemesi"),
  E("abdirrahmanbabdulhamid", "harunmaruf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülhamîd b. Sâlim tercemesi"),
  /* Abdirrahman b. Abdülmelik b. Saîd -- hocalari */
  E("elmufaddalbyunuselcufi", "abdirrahmanbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  /* Abdirrahman b. Abdülmelik b. Saîd -- talebeleri */
  E("abdirrahmanbabdulmelik", "sericyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  E("abdirrahmanbabdulmelik", "ahmedeskab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdülmelik b. Saîd tercemesi"),
  /* Abdirrahman b. Atâ -- hocalari */
  E("suleymanyesar", "abdirrahmanbata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Atâ tercemesi"),
  E("saidmusayyeb", "abdirrahmanbata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Atâ tercemesi"),
  /* Abdirrahman b. Atâ -- talebeleri */
  E("abdirrahmanbata", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Atâ tercemesi"),
  E("abdirrahmanbata", "hatimismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Atâ tercemesi"),
  /* Abdirrahman b. Ömer b. Yezîd Ebû Hasan -- hocalari */
  E("ebudavudtayalisi", "abdirrahmanbomerbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Ömer b. Yezîd Ebû Hasan tercemesi"),
  E("muazmuaz", "abdirrahmanbomerbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Ömer b. Yezîd Ebû Hasan tercemesi"),
  /* Abdirrahman b. Ömer b. Yezîd Ebû Hasan -- talebeleri */
  E("abdirrahmanbomerbyezid", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Ömer b. Yezîd Ebû Hasan tercemesi"),
  /* Abdirrahman b. Amr b. Abese es-Sülemî eş-Şâmî -- talebeleri */
  E("abdirrahmanbamr", "damrabhabibbsuheybezzu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Amr b. Abese es-Sülemî eş-Şâmî tercemesi"),
  /* Abdirrahman b. Kâsım b. Hâlid -- talebeleri */
  E("abdirrahmanbkasimbhali", "asbagferec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Kâsım b. Hâlid tercemesi"),
  E("abdirrahmanbkasimbhali", "muhammedbselemebebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Kâsım b. Hâlid tercemesi"),
  E("abdirrahmanbkasimbhali", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Kâsım b. Hâlid tercemesi"),
  /* Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed -- hocalari */
  E("ismailebihalid", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("amess", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("ismailebiislamsibani", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("yahyasaidensari", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("ataisaib", "abdirrahmanbmuhammedbz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  /* Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed -- talebeleri */
  E("abdirrahmanbmuhammedbz", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  E("abdirrahmanbmuhammedbz", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muhammed b. Ziyâd el-Muhâribî Ebû Muhammed tercemesi"),
  /* Abdirrahman b. Muâviye b. Hudeyc -- talebeleri */
  E("abdirrahmanbmuaviye", "ukbebmuslimettuceybi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muâviye b. Hudeyc tercemesi"),
  E("abdirrahmanbmuaviye", "yezidebihabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muâviye b. Hudeyc tercemesi"),
  E("abdirrahmanbmuaviye", "hasanbsevbanbamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Muâviye b. Hudeyc tercemesi"),
  /* Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer -- hocalari */
  E("velidmuslim", "abdirrahmanbvakidbmusl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  E("ismailcafer", "abdirrahmanbvakidbmusl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  E("halefbhalifebsaidelesc", "abdirrahmanbvakidbmusl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  /* Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer -- talebeleri */
  E("abdirrahmanbvakidbmusl", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  E("abdirrahmanbvakidbmusl", "abbasb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  E("abdirrahmanbvakidbmusl", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Vâkid b. Müslim Ebû Müslim Ömer tercemesi"),
  /* Abdüsselâm b. Atîk -- hocalari */
  E("muhammedbelmubarek", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  E("velidmuslim", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  E("ademebiiyas", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  E("mervanbmuhammedbhassan", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  E("hisambammar", "abdusselambatik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  /* Abdüsselâm b. Atîk -- talebeleri */
  E("abdusselambatik", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüsselâm b. Atîk tercemesi"),
  /* Abdüssamed b. Ma‘kıl b. Münebbih -- talebeleri */
  E("abdussamedbmakilbmuneb", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüssamed b. Ma‘kıl b. Münebbih tercemesi"),
  E("abdussamedbmakilbmuneb", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdüssamed b. Ma‘kıl b. Münebbih tercemesi"),
  /* Abdülazîz b. el-Hattâb Ebû Hasan -- hocalari */
  E("sube", "abdulazizbelhattabebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. el-Hattâb Ebû Hasan tercemesi"),
  E("kaysrebi", "abdulazizbelhattabebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. el-Hattâb Ebû Hasan tercemesi"),
  /* Abdülazîz b. el-Hattâb Ebû Hasan -- talebeleri */
  E("abdulazizbelhattabebuh", "amrbnalisayrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. el-Hattâb Ebû Hasan tercemesi"),
  E("abdulazizbelhattabebuh", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. el-Hattâb Ebû Hasan tercemesi"),
  /* Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ -- hocalari */
  E("velidmuslim", "abdulazizbyahyabyusuf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ tercemesi"),
  E("mahledbyezid", "abdulazizbyahyabyusuf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ tercemesi"),
  E("isabyunus", "abdulazizbyahyabyusuf", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ tercemesi"),
  /* Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ -- talebeleri */
  E("abdulazizbyahyabyusuf", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülazîz b. Yahyâ b. Yûsuf Ebû el-Asbağ tercemesi"),
  /* Abdülmelik b. Şuayb b. Leys -- hocalari */
  E("esedmusa", "abdulmelikbsuaybbleys", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Şuayb b. Leys tercemesi"),
  /* Abdülmelik b. Şuayb b. Leys -- talebeleri */
  E("abdulmelikbsuaybbleys", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Şuayb b. Leys tercemesi"),
  E("abdulmelikbsuaybbleys", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Şuayb b. Leys tercemesi"),
  /* Abdülmelik b. Mervân b. Kâriz -- hocalari */
  E("ebudavudtayalisi", "abdulmelikbmervanbkari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  E("ebuamirakadi", "abdulmelikbmervanbkari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  E("haccacmuhammed", "abdulmelikbmervanbkari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  E("yezidzurey", "abdulmelikbmervanbkari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  E("sebabesevvar", "abdulmelikbmervanbkari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  /* Abdülmelik b. Mervân b. Kâriz -- talebeleri */
  E("abdulmelikbmervanbkari", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülmelik b. Mervân b. Kâriz tercemesi"),
  /* Abdülvâhid b. Ebî Avn el-Medenî -- hocalari */
  E("kasimmuhammed", "abdulvahidbebiavnelmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ebî Avn el-Medenî tercemesi"),
  E("ismailbmuhammedbsadebi", "abdulvahidbebiavnelmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ebî Avn el-Medenî tercemesi"),
  /* Abdülvâhid b. Ebî Avn el-Medenî -- talebeleri */
  E("abdulvahidbebiavnelmed", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Ebî Avn el-Medenî tercemesi"),
  /* Abdülvâhid b. Vâsıl es-Sedûsî -- hocalari */
  E("behzhakim", "abdulvahidbvasilessedu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Vâsıl es-Sedûsî tercemesi"),
  /* Abdülvâhid b. Vâsıl es-Sedûsî -- talebeleri */
  E("abdulvahidbvasilessedu", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Vâsıl es-Sedûsî tercemesi"),
  E("abdulvahidbvasilessedu", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Vâsıl es-Sedûsî tercemesi"),
  E("abdulvahidbvasilessedu", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Vâsıl es-Sedûsî tercemesi"),
  E("abdulvahidbvasilessedu", "amrbzurarebvakidelkila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvâhid b. Vâsıl es-Sedûsî tercemesi"),
  /* Abdülvehhâb b. ed-Dahhâk b. Ebân -- hocalari */
  E("ismailayyas", "abdulvehhabbeddahhakbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("bakiyyevelid", "abdulvehhabbeddahhakbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("isabyunus", "abdulvehhabbeddahhakbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("muhammedsuaybsabur", "abdulvehhabbeddahhakbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("velidmuslim", "abdulvehhabbeddahhakbe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  /* Abdülvehhâb b. ed-Dahhâk b. Ebân -- talebeleri */
  E("abdulvehhabbeddahhakbe", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("abdulvehhabbeddahhakbe", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  E("abdulvehhabbeddahhakbe", "bh20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. ed-Dahhâk b. Ebân tercemesi"),
  /* Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî -- hocalari */
  E("humeydtavil", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("eyyubsahtiyani", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("halidhazza", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("davudebihind", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("avfarabi", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("yunusubeyd", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("yahyasaidensari", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("habibelmuallimebumuham", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("cureyri", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("ibncureyc", "abdulvehhabbabdulmecid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  /* Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî -- talebeleri */
  E("abdulvehhabbabdulmecid", "safii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "misned", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "kavariri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "ibnebiomeradeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "suveydsaidhadesani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  E("abdulvehhabbabdulmecid", "hasanarafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdülvehhâb b. Abdülmecîd b. es-Salt es-Sekafî Ebû Muhammed el-Basrî tercemesi"),
  /* Utbe b. Abdullah b. Utbe Ebû Abdullah el-Mervezî -- hocalari */
  E("fazlbmusa", "utbebabdullahbutbeebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Utbe b. Abdullah b. Utbe Ebû Abdullah el-Mervezî tercemesi"),
  /* Osmân b. Hakem el-Mısrî -- hocalari */
  E("yahyasaidensari", "osmanbhakemelmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakem el-Mısrî tercemesi"),
  E("musaukbe", "osmanbhakemelmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakem el-Mısrî tercemesi"),
  E("yunusyezid", "osmanbhakemelmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakem el-Mısrî tercemesi"),
  E("ibncureyc", "osmanbhakemelmisri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakem el-Mısrî tercemesi"),
  /* Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer -- hocalari */
  E("ishaktalha", "osmanbhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  /* Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer -- talebeleri */
  E("osmanbhakim", "abdulvahidziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  E("osmanbhakim", "huseym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  E("osmanbhakim", "zuhayrmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  E("osmanbhakim", "alimushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  E("osmanbhakim", "ibnnumeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  E("osmanbhakim", "yalaubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Hakîm b. Zibyân el-Evdî Ebû Ömer tercemesi"),
  /* Osmân b. Saîd b. Kesîr -- hocalari */
  E("muaviyesellam", "osmanbsaidbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Saîd b. Kesîr tercemesi"),
  /* Osmân b. Sâlih b. Saîd -- hocalari */
  E("ebuamirakadi", "osmanbsalihbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Saîd tercemesi"),
  E("saidamirdubai", "osmanbsalihbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Saîd tercemesi"),
  E("muhammedbbekirbosman", "osmanbsalihbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Saîd tercemesi"),
  /* Osmân b. Sâlih b. Saîd -- talebeleri */
  E("osmanbsalihbsaid", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Saîd tercemesi"),
  E("osmanbsalihbsaid", "ed28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Saîd tercemesi"),
  /* Osmân b. Sâlih b. Safvân -- hocalari */
  E("damrarebia", "osmanbsalihbsafvan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Safvân tercemesi"),
  /* Osmân b. Sâlih b. Safvân -- talebeleri */
  E("osmanbsalihbsafvan", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Safvân tercemesi"),
  E("osmanbsalihbsafvan", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Sâlih b. Safvân tercemesi"),
  /* Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî -- hocalari */
  E("ebuhureyre", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("ummuseleme", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("cabirsemura", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("abdullahebikatade", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("musatalha", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("sabi", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("hamranaban", "osmanbabdullahbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  /* Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî -- talebeleri */
  E("osmanbabdullahbabdulla", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("osmanbabdullahbabdulla", "kaysrebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("osmanbabdullahbabdulla", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("osmanbabdullahbabdulla", "sallamebimuti", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  E("osmanbabdullahbabdulla", "serikkadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Osmân b. Abdullah b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  /* Adî b. Adî b. Umeyra -- hocalari */
  E("bhayve", "adibadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Adî b. Umeyra tercemesi"),
  /* Adî b. Adî b. Umeyra -- talebeleri */
  E("adibadi", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Adî b. Umeyra tercemesi"),
  E("adibadi", "ibrahimebiable", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Adî b. Umeyra tercemesi"),
  E("adibadi", "ataihorasani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Adî b. Umeyra tercemesi"),
  /* Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî -- hocalari */
  E("alibhakemelbunani", "adibfazletteymiebuhati", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("halidhazza", "adibfazletteymiebuhati", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("davudebihind", "adibfazletteymiebuhati", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("suheylebisalih", "adibfazletteymiebuhati", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  /* Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî -- talebeleri */
  E("adibfazletteymiebuhati", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("adibfazletteymiebuhati", "muslimibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("adibfazletteymiebuhati", "alicad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("adibfazletteymiebuhati", "muhammedbcaferbziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  E("adibfazletteymiebuhati", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Adî b. Fazl et-Teymî Ebû Hâtim el-Basrî tercemesi"),
  /* Atâ b. Müslim el-Haffâf Ebû Mahled -- hocalari */
  E("amess", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("caferburkan", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("muhammedamralkame", "atabmuslimelhaffafebum", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  /* Atâ b. Müslim el-Haffâf Ebû Mahled -- talebeleri */
  E("atabmuslimelhaffafebum", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("atabmuslimelhaffafebum", "amrebiselemetennisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  E("atabmuslimelhaffafebum", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Müslim el-Haffâf Ebû Mahled tercemesi"),
  /* Atâ b. Ebî Meymûne el-Basrî Ebû Muâz -- hocalari */
  E("cabirsemura", "atabebimeymuneelbasrie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Meymûne el-Basrî Ebû Muâz tercemesi"),
  E("ebuselemeavf", "atabebimeymuneelbasrie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Meymûne el-Basrî Ebû Muâz tercemesi"),
  /* Atâ b. Ebî Meymûne el-Basrî Ebû Muâz -- talebeleri */
  E("atabebimeymuneelbasrie", "hammadseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atâ b. Ebî Meymûne el-Basrî Ebû Muâz tercemesi"),
  /* Atiyye b. Sa‘d b. Cünâde -- hocalari */
  E("ebuhureyre", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("zeydarkam", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("adisabit", "atiyyebsad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  /* Atiyye b. Sa‘d b. Cünâde -- talebeleri */
  E("atiyyebsad", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("atiyyebsad", "haccacertat", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("atiyyebsad", "muhammedbabdirrahmanbe2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("atiyyebsad", "mutarriftarif", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("atiyyebsad", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  E("atiyyebsad", "firasyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Sa‘d b. Cünâde tercemesi"),
  /* Atiyye b. Kays el-Kilâbî -- hocalari */
  E("numanbesir", "atiyyebkayselkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Kays el-Kilâbî tercemesi"),
  E("ebuidrishavlani", "atiyyebkayselkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Atiyye b. Kays el-Kilâbî tercemesi"),
  /* Ukbe b. Müslim et-Tüceybî -- hocalari */
  E("ukbeamir", "ukbebmuslimettuceybi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Müslim et-Tüceybî tercemesi"),
  /* Ukbe b. Müslim et-Tüceybî -- talebeleri */
  E("ukbebmuslimettuceybi", "hayveseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Müslim et-Tüceybî tercemesi"),
  E("ukbebmuslimettuceybi", "elvelidbkasimbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Müslim et-Tüceybî tercemesi"),
  E("ukbebmuslimettuceybi", "cafercrebia", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Müslim et-Tüceybî tercemesi"),
  E("ukbebmuslimettuceybi", "harmalaimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ukbe b. Müslim et-Tüceybî tercemesi"),
  /* Alkame b. Abdullah b. Sinân -- talebeleri */
  E("alkamebabdullahbsinan", "avfarabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Abdullah b. Sinân tercemesi"),
  E("alkamebabdullahbsinan", "ebuimrancevni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Abdullah b. Sinân tercemesi"),
  /* Alkame b. Amr b. el-Husayn Ebû Fazl -- hocalari */
  E("ebubekirayyas", "alkamebamrbelhusaynebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  /* Alkame b. Amr b. el-Husayn Ebû Fazl -- talebeleri */
  E("alkamebamrbelhusaynebu", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  E("alkamebamrbelhusaynebu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alkame b. Amr b. el-Husayn Ebû Fazl tercemesi"),
  /* Ali b. İshak es-Sülemî -- hocalari */
  E("fazlbmusa", "alibishakessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. İshak es-Sülemî tercemesi"),
  /* Ali b. İshak es-Sülemî -- talebeleri */
  E("alibishakessulemi", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. İshak es-Sülemî tercemesi"),
  E("alibishakessulemi", "ibrahimmusaferra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. İshak es-Sülemî tercemesi"),
  E("alibishakessulemi", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. İshak es-Sülemî tercemesi"),
  /* Ali b. Sâbit -- hocalari */
  E("aliebisalihhayy", "alibsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  E("fudaylibnayaz", "alibsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  /* Ali b. Sâbit -- talebeleri */
  E("alibsabit", "abdulalabvasilbabdulal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Sâbit tercemesi"),
  /* Ali b. Hüseyin b. Matar el-Basrî -- hocalari */
  E("mutemirsuleyman", "alibhuseyinbmatarelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Matar el-Basrî tercemesi"),
  /* Ali b. Hüseyin b. Matar el-Basrî -- talebeleri */
  E("alibhuseyinbmatarelbas", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Matar el-Basrî tercemesi"),
  E("alibhuseyinbmatarelbas", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Matar el-Basrî tercemesi"),
  /* Ali b. Hüseyin b. Vâkid el-Mervezî -- hocalari */
  E("abdirrahmanbabdullahbo", "alibhuseyinbvakidelmer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Vâkid el-Mervezî tercemesi"),
  /* Ali b. Hüseyin b. Vâkid el-Mervezî -- talebeleri */
  E("alibhuseyinbvakidelmer", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Vâkid el-Mervezî tercemesi"),
  E("alibhuseyinbvakidelmer", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Vâkid el-Mervezî tercemesi"),
  E("alibhuseyinbvakidelmer", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hüseyin b. Vâkid el-Mervezî tercemesi"),
  /* Ali b. Hakem el-Bünânî -- hocalari */
  E("ebuosmannehdi", "alibhakemelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("amrsuayb", "alibhakemelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("ebunadra", "alibhakemelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  /* Ali b. Hakem el-Bünânî -- talebeleri */
  E("alibhakemelbunani", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("alibhakemelbunani", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("alibhakemelbunani", "caferbsuleymaneddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("alibhakemelbunani", "hisamhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  E("alibhakemelbunani", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakem el-Bünânî tercemesi"),
  /* Ali b. Hakîm b. Zibyân -- hocalari */
  E("sihabbabbadelabdiebuom", "alibhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  E("alimushir", "alibhakim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  /* Ali b. Hakîm b. Zibyân -- talebeleri */
  E("alibhakim", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  /* Ali b. Hakîm b. Zibyân -- hocalari */
  E("sihabbabbadelabdiebuom", "alibhakim2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  E("alimushir", "alibhakim2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  /* Ali b. Hakîm b. Zibyân -- talebeleri */
  E("alibhakim2", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Hakîm b. Zibyân tercemesi"),
  /* Ali b. Saîd b. Mesrûk el-Kindî -- hocalari */
  E("ibnebizaide", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("isabyunus", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("alimushir", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  E("ibnidris", "alibsaidbmesrukelkindi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Saîd b. Mesrûk el-Kindî tercemesi"),
  /* Ali b. Şuayb b. Adî -- hocalari */
  E("haccacmuhammed", "alibsuaybbadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  E("ibnnumeyr", "alibsuaybbadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  /* Ali b. Şuayb b. Adî -- talebeleri */
  E("alibsuaybbadi", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  E("alibsuaybbadi", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  E("alibsuaybbadi", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  E("alibsuaybbadi", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Şuayb b. Adî tercemesi"),
  /* Ali b. Osmân b. Muhammed -- hocalari */
  E("muhammedbelmubarek", "alibosmanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  E("halidmahled", "alibosmanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  E("ademebiiyas", "alibosmanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  E("yalaubeyd", "alibosmanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  E("osmanbsalihbsafvan", "alibosmanbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  /* Ali b. Osmân b. Muhammed -- talebeleri */
  E("alibosmanbmuhammed", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  E("alibosmanbmuhammed", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Osmân b. Muhammed tercemesi"),
  /* Ali b. Îsâ b. Yezîd -- hocalari */
  E("ruhubade", "alibisabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Îsâ b. Yezîd tercemesi"),
  E("sebabesevvar", "alibisabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Îsâ b. Yezîd tercemesi"),
  /* Ali b. Îsâ b. Yezîd -- talebeleri */
  E("alibisabyezid", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Îsâ b. Yezîd tercemesi"),
  E("alibisabyezid", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Îsâ b. Yezîd tercemesi"),
  /* Ali b. Ma‘bed b. Nûh -- hocalari */
  E("ruhubade", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ma‘bed b. Nûh tercemesi"),
  E("muallamansur", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ma‘bed b. Nûh tercemesi"),
  E("sebabesevvar", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ma‘bed b. Nûh tercemesi"),
  E("yezidharun", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ma‘bed b. Nûh tercemesi"),
  E("yalaubeyd", "alibmabedbnuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Ma‘bed b. Nûh tercemesi"),
  /* Ali b. Meymûn el-Attâr -- hocalari */
  E("ebumuaviyedarir", "alibmeymunelattar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Meymûn el-Attâr tercemesi"),
  /* Ali b. Meymûn el-Attâr -- talebeleri */
  E("alibmeymunelattar", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Meymûn el-Attâr tercemesi"),
  E("alibmeymunelattar", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Meymûn el-Attâr tercemesi"),
  E("alibmeymunelattar", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Meymûn el-Attâr tercemesi"),
  E("alibmeymunelattar", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ali b. Meymûn el-Attâr tercemesi"),
  /* Ammâr b. Hâlid b. Yezîd Ebû Fazl -- hocalari */
  E("ebubekirayyas", "ammarbhalidbyezidebufa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Hâlid b. Yezîd Ebû Fazl tercemesi"),
  E("ishakyusufezrak", "ammarbhalidbyezidebufa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Hâlid b. Yezîd Ebû Fazl tercemesi"),
  E("yezidharun", "ammarbhalidbyezidebufa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Hâlid b. Yezîd Ebû Fazl tercemesi"),
  /* Ammâr b. Hâlid b. Yezîd Ebû Fazl -- talebeleri */
  E("ammarbhalidbyezidebufa", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Hâlid b. Yezîd Ebû Fazl tercemesi"),
  E("ammarbhalidbyezidebufa", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Hâlid b. Yezîd Ebû Fazl tercemesi"),
  /* Ammâr b. Sa‘d -- talebeleri */
  E("ammarbsad", "bukeyresec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Sa‘d tercemesi"),
  /* Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân -- hocalari */
  E("amess", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("leysebisuleym", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("ataisaib", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("muhammedamralkame", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("muhammedbsaibbbisrebun", "ammarbmuhammedessevri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  /* Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân -- talebeleri */
  E("ammarbmuhammedessevri", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("ammarbmuhammedessevri", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  E("ammarbmuhammedessevri", "alihucr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muhammed es-Sevrî Ebû el-Yakzân tercemesi"),
  /* Ammâr b. Muâviye -- hocalari */
  E("ebutufeyl", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ebuselemeavf", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("abdullahsedddad", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("saidcubeyr", "ammarbmuaviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  /* Ammâr b. Muâviye -- talebeleri */
  E("ammarbmuaviye", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "cabircufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  E("ammarbmuaviye", "ubeydebhumeydebuabdirr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Muâviye tercemesi"),
  /* Ammâr b. Nasr Ebû Yâsir -- hocalari */
  E("cerirabdulhamid", "ammarbnasr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Nasr Ebû Yâsir tercemesi"),
  E("ibnuyeyne", "ammarbnasr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Nasr Ebû Yâsir tercemesi"),
  E("fazlbmusa", "ammarbnasr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Nasr Ebû Yâsir tercemesi"),
  E("abdurrezzak", "ammarbnasr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Nasr Ebû Yâsir tercemesi"),
  /* Ammâr b. Nasr Ebû Yâsir -- talebeleri */
  E("ammarbnasr", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ammâr b. Nasr Ebû Yâsir tercemesi"),
  /* Ömer b. Eyyûb el-Abdî -- hocalari */
  E("muhammedbabdirrahmanbe2", "omerbeyyubelabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Eyyûb el-Abdî tercemesi"),
  /* Ömer b. Eyyûb el-Abdî -- talebeleri */
  E("omerbeyyubelabdi", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Eyyûb el-Abdî tercemesi"),
  E("omerbeyyubelabdi", "muhammedbabdullahbamma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Eyyûb el-Abdî tercemesi"),
  /* Ömer b. Hafs b. Giyâs -- hocalari */
  E("ebubekirayyas", "omerbhafsbgiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  /* Ömer b. Hafs b. Giyâs -- talebeleri */
  E("omerbhafsbgiyas", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "ahmeddevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  E("omerbhafsbgiyas", "ibrahimbebibekirabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hafs b. Giyâs tercemesi"),
  /* Ömer b. Sâib b. Ebî Râşid el-Mısrî -- talebeleri */
  E("omerbsaibbebirasidelmi", "usamezeydleysi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Sâib b. Ebî Râşid el-Mısrî tercemesi"),
  E("omerbsaibbebirasidelmi", "amrharis", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Sâib b. Ebî Râşid el-Mısrî tercemesi"),
  /* Ömer b. Abdullah b. Rezîn es-Sülemî Ebû Abbâs en-Nîsâbûrî -- hocalari */
  E("ibrahimtahman", "omerbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdullah b. Rezîn es-Sülemî Ebû Abbâs en-Nîsâbûrî tercemesi"),
  E("sufyanhusayn", "omerbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdullah b. Rezîn es-Sülemî Ebû Abbâs en-Nîsâbûrî tercemesi"),
  E("bukeyrbmarufelesediebu", "omerbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdullah b. Rezîn es-Sülemî Ebû Abbâs en-Nîsâbûrî tercemesi"),
  /* Ömer b. Abdülazîz b. İmrân -- hocalari */
  E("yahyababdullahbbukeyre", "omerbabdulazizbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülazîz b. İmrân tercemesi"),
  E("amrbhalidbferruh", "omerbabdulazizbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülazîz b. İmrân tercemesi"),
  E("ibrahimmunzirhizami", "omerbabdulazizbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülazîz b. İmrân tercemesi"),
  /* Ömer b. Abdülazîz b. İmrân -- talebeleri */
  E("omerbabdulazizbimran", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülazîz b. İmrân tercemesi"),
  E("omerbabdulazizbimran", "ns02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülazîz b. İmrân tercemesi"),
  /* Ömer b. Abdülvehhâb b. Riyâh -- hocalari */
  E("mutemirsuleyman", "omerbabdulvehhab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülvehhâb b. Riyâh tercemesi"),
  E("yezidzurey", "omerbabdulvehhab", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülvehhâb b. Riyâh tercemesi"),
  /* Ömer b. Abdülvehhâb b. Riyâh -- talebeleri */
  E("omerbabdulvehhab", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Abdülvehhâb b. Riyâh tercemesi"),
  /* Ömer b. Osmân b. Ömer -- hocalari */
  E("yunusyezid", "omerbosmanbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Osmân b. Ömer tercemesi"),
  /* Ömer b. Osmân b. Ömer -- talebeleri */
  E("omerbosmanbomer", "ibrahimmunzirhizami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Osmân b. Ömer tercemesi"),
  /* Ömer b. Meymûn b. Bahr -- hocalari */
  E("suheylebisalih", "omerbmeymun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  E("dahhak", "omerbmeymun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  /* Ömer b. Meymûn b. Bahr -- talebeleri */
  E("omerbmeymun", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  E("omerbmeymun", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  E("omerbmeymun", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  E("omerbmeymun", "surayjnuman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Meymûn b. Bahr tercemesi"),
  /* Ömer b. Hârûn b. Yezîd es-Sekafî -- hocalari */
  E("ibncureyc", "omerbharunbyezidesseka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("usamezeydleysi", "omerbharunbyezidesseka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("ibnebiaruba", "omerbharunbyezidesseka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("sube", "omerbharunbyezidesseka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("hemmamyahya", "omerbharunbyezidesseka", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  /* Ömer b. Hârûn b. Yezîd es-Sekafî -- talebeleri */
  E("omerbharunbyezidesseka", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  E("omerbharunbyezidesseka", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ömer b. Hârûn b. Yezîd es-Sekafî tercemesi"),
  /* Amr b. Sâbit -- hocalari */
  E("ebuishaksebii", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amess", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("simakharb", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("hakemuteybe", "amrbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  /* Amr b. Sâbit -- talebeleri */
  E("amrbsabit", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "amrbmuhammed2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  E("amrbsabit", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Sâbit tercemesi"),
  /* Amr b. Hammâd b. Talha -- hocalari */
  E("muttalibbziyadbebizuhe", "amrbhammadbtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("hafsbsuleymanelesedieb", "amrbhammadbtalha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  /* Amr b. Hammâd b. Talha -- talebeleri */
  E("amrbhammadbtalha", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("amrbhammadbtalha", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  E("amrbhammadbtalha", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hammâd b. Talha tercemesi"),
  /* Amr b. Hâlid b. Ferrûh -- hocalari */
  E("zuhayrmuaviye", "amrbhalidbferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("hammadseleme", "amrbhalidbferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("ubeydbamrbebielvelideb", "amrbhalidbferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("yakubbabdirrahmanbmuha", "amrbhalidbferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  /* Amr b. Hâlid b. Ferrûh -- talebeleri */
  E("amrbhalidbferruh", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("amrbhalidbferruh", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("amrbhalidbferruh", "ahmedbsadbhakemebucafe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("amrbhalidbferruh", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  E("amrbhalidbferruh", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Hâlid b. Ferrûh tercemesi"),
  /* Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr -- hocalari */
  E("cerirabdulhamid", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  E("fazlbmusa", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  E("huseym", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  E("ibnebizaide", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  E("nuaymbmeysere", "amrbrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  /* Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr -- talebeleri */
  E("amrbrafi", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  E("amrbrafi", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Râfi‘ b. el-Furât el-Becelî Ebû Hucr tercemesi"),
  /* Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî -- hocalari */
  E("ibnebizaide", "amrbzurarebvakidelkila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  /* Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî -- talebeleri */
  E("amrbzurarebvakidelkila", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("amrbzurarebvakidelkila", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("amrbzurarebvakidelkila", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("amrbzurarebvakidelkila", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("amrbzurarebvakidelkila", "ms19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  E("amrbzurarebvakidelkila", "ms22", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Zürâre b. Vâkid el-Kilâbî Ebû Muhammed en-Nîsâbûrî tercemesi"),
  /* Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî -- hocalari */
  E("gunder", "amrbabbaselbahiliebuos", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî tercemesi"),
  E("yezidharun", "amrbabbaselbahiliebuos", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî tercemesi"),
  /* Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî -- talebeleri */
  E("amrbabbaselbahiliebuos", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî tercemesi"),
  E("amrbabbaselbahiliebuos", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî tercemesi"),
  E("amrbabbaselbahiliebuos", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Abbâs el-Bâhilî Ebû Osmân el-Basrî tercemesi"),
  /* Amr b. Osmân b. Saîd -- hocalari */
  E("muhammedharbhavlani", "amrbosmanbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("velidmuslim", "amrbosmanbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("mervanbmuhammedbhassan", "amrbosmanbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("ismailayyas", "amrbosmanbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("ibnuyeyne", "amrbosmanbsaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  /* Amr b. Osmân b. Saîd -- talebeleri */
  E("amrbosmanbsaid", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("amrbosmanbsaid", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("amrbosmanbsaid", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("amrbosmanbsaid", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  E("amrbosmanbsaid", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Osmân b. Saîd tercemesi"),
  /* Amr b. Ali b. Bahr -- hocalari */
  E("yezidzurey", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("ebudavudtayalisi", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("abdullahbdavudbamirelh", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("gunder", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("ibnidris", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("muazbhisambebiabdullah", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("muazbhanielbasriebuhan", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("yezidharun", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("bisrmufaddal", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("affanmuslim", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("fudaylsuleyman", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("muhammedfudayl", "amrbali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  /* Amr b. Ali b. Bahr -- talebeleri */
  E("amrbali", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("amrbali", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  E("amrbali", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Ali b. Bahr tercemesi"),
  /* Amr b. Muhammed b. Ebî Rezîn el-Huzâî -- hocalari */
  E("ebuishaksebii", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amess", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("simakharb", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("hakemuteybe", "amrbmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  /* Amr b. Muhammed b. Ebî Rezîn el-Huzâî -- talebeleri */
  E("amrbmuhammed", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed", "amrbmuhammed2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  /* Amr b. Muhammed b. Ebî Rezîn el-Huzâî -- hocalari */
  E("hanzalasufyan", "amrbmuhammed2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("ibncureyc", "amrbmuhammed2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("israilyunus", "amrbmuhammed2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  /* Amr b. Muhammed b. Ebî Rezîn el-Huzâî -- talebeleri */
  E("amrbmuhammed2", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed2", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed2", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed2", "ahmedbnasrbziyadennisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed2", "hasanbhammadeddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  E("amrbmuhammed2", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Muhammed b. Ebî Rezîn el-Huzâî tercemesi"),
  /* Amr b. Mansûr el-Basrî -- hocalari */
  E("hisamhassan", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Mansûr el-Basrî tercemesi"),
  E("sube", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Mansûr el-Basrî tercemesi"),
  /* İmrân b. Meysere -- hocalari */
  E("mutemirsuleyman", "imranbmeysere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İmrân b. Meysere tercemesi"),
  E("ibnidris", "imranbmeysere", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İmrân b. Meysere tercemesi"),
  /* İmrân b. Meysere -- talebeleri */
  E("imranbmeysere", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İmrân b. Meysere tercemesi"),
  /* Umeyr b. Abdullah Ebû Abdullah el-Medenî -- talebeleri */
  E("umeyrbabdullahebuabdul", "salimebinadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Umeyr b. Abdullah Ebû Abdullah el-Medenî tercemesi"),
  /* Avn b. Sellâm -- hocalari */
  E("zuhayrmuaviye", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("ebubekir2", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("israilyunus", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("kaysrebi", "avnbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  /* Avn b. Sellâm -- talebeleri */
  E("avnbsellam", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  E("avnbsellam", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Sellâm tercemesi"),
  /* Avn b. Umâre Ebû Muhammed el-Basrî -- hocalari */
  E("suleymanteymi", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("humeydtavil", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("ruhbkasimettemimielanb", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("hisamhassan", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("muhammedamralkame", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("behzhakim", "avnbumareebumuhammedel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  /* Avn b. Umâre Ebû Muhammed el-Basrî -- talebeleri */
  E("avnbumareebumuhammedel", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  E("avnbumareebumuhammedel", "suleymanbdavudeburabie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Avn b. Umâre Ebû Muhammed el-Basrî tercemesi"),
  /* Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī -- hocalari */
  E("amrsuayb", "alabelharisbabdilvaris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī tercemesi"),
  /* Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī -- talebeleri */
  E("alabelharisbabdilvaris", "evzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī tercemesi"),
  E("alabelharisbabdilvaris", "yahyabhamzabvakidelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī tercemesi"),
  E("alabelharisbabdilvaris", "abdirrahmanbsabitbsevb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. el-Hâris b. Abdilvâris el-Hadramî Ebû Vehb ed-Dımaşkī tercemesi"),
  /* Alâ b. Fazl b. Abdülmelik -- talebeleri */
  E("alabfazlbabdulmelik", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Fazl b. Abdülmelik tercemesi"),
  /* Alâ b. Hilâl b. Ömer Ebû Muhammed -- hocalari */
  E("ubeydbamrbebielvelideb", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("halefbhalifebsaidelesc", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("hammadzeyd", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("mutemirsuleyman", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("huseym", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("yezidzurey", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("velidmuslim", "alabhilalbomerebumuham", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  /* Alâ b. Hilâl b. Ömer Ebû Muhammed -- talebeleri */
  E("alabhilalbomerebumuham", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  E("alabhilalbomerebumuham", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Hilâl b. Ömer Ebû Muhammed tercemesi"),
  /* Ayyâş b. Ukbe b. Küleyb el-Hadramî Ebû Ukbe el-Mısrî -- hocalari */
  E("yahyabmeymunelhadramie", "ayyasbukbebkuleybelhad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. Ukbe b. Küleyb el-Hadramî Ebû Ukbe el-Mısrî tercemesi"),
  /* Ayyâş b. el-Velîd -- hocalari */
  E("velidmuslim", "ayyasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  E("mutemirsuleyman", "ayyasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  E("ebumuaviyedarir", "ayyasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  E("saidbyahyabmehdiebusuf", "ayyasbelvelid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  /* Ayyâş b. el-Velîd -- talebeleri */
  E("ayyasbelvelid", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  E("ayyasbelvelid", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  E("ayyasbelvelid", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ayyâş b. el-Velîd tercemesi"),
  /* Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî -- hocalari */
  E("saidmusayyeb", "isabhafsbasimebuziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  E("kasimmuhammed", "isabhafsbasimebuziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  /* Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî -- talebeleri */
  E("isabhafsbasimebuziyade", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  E("isabhafsbasimebuziyade", "caferavn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  E("isabhafsbasimebuziyade", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  E("isabhafsbasimebuziyade", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Hafs b. Âsım Ebû Ziyâd el-Medenî tercemesi"),
  /* Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl -- hocalari */
  E("ebubekirayyas", "fadalebfazlbfadaleette", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl tercemesi"),
  /* Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl -- talebeleri */
  E("fadalebfazlbfadaleette", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fadâle b. Fazl b. Fadâle et-Temîmî Ebû Fazl tercemesi"),
  /* Fazl b. Sehl b. İbrâhim el-A‘rec -- hocalari */
  E("yezidharun", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("yakubbibrahimbsadebuyu", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("affanmuslim", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("yahyabgaylanbabdullah", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  /* Fazl b. Sehl b. İbrâhim el-A‘rec -- talebeleri */
  E("fazlbsehlbibrahimelare", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("fazlbsehlbibrahimelare", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("fazlbsehlbibrahimelare", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("fazlbsehlbibrahimelare", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  E("fazlbsehlbibrahimelare", "ed28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Sehl b. İbrâhim el-A‘rec tercemesi"),
  /* Fazl b. Mûsâ -- hocalari */
  E("ismailebihalid", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("amess", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("hisamurve", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("hanzalasufyan", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("hasanisad", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("davudebihind", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("huseynzekvan", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("husaymirak", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("mamer", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("muhammedamralkame", "fazlbmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  /* Fazl b. Mûsâ -- talebeleri */
  E("fazlbmusa", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("fazlbmusa", "yusufbisabdinarezzuhri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("fazlbmusa", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  E("fazlbmusa", "muhammedbhumeydbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Mûsâ tercemesi"),
  /* Fazl b. Ya‘kûb b. İbrâhim -- hocalari */
  E("haccacmuhammed", "fazlbyakubbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Ya‘kûb b. İbrâhim tercemesi"),
  E("mervanbmuhammedbhassan", "fazlbyakubbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Ya‘kûb b. İbrâhim tercemesi"),
  /* Fazl b. Ya‘kûb b. İbrâhim -- talebeleri */
  E("fazlbyakubbibrahim", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Ya‘kûb b. İbrâhim tercemesi"),
  E("fazlbyakubbibrahim", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Ya‘kûb b. İbrâhim tercemesi"),
  E("fazlbyakubbibrahim", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Fazl b. Ya‘kûb b. İbrâhim tercemesi"),
  /* Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî -- hocalari */
  E("huseym", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("ismailayyas", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("ismailcafer", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("cerirabdulhamid", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("saidbevsbsabitebuzeyde", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("yezidharun", "kasimbsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  /* Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî -- talebeleri */
  E("kasimbsellam", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("kasimbsellam", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("kasimbsellam", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  /* Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî -- hocalari */
  E("huseym", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("ismailayyas", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("ismailcafer", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("cerirabdulhamid", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("saidbevsbsabitebuzeyde", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("yezidharun", "kasimbsellam2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  /* Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî -- talebeleri */
  E("kasimbsellam2", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("kasimbsellam2", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  E("kasimbsellam2", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Sellâm b. Miskîn el-Ezdî Ebû Muhammed el-Basrî tercemesi"),
  /* Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî -- hocalari */
  E("haccacmuhammed", "kasimbisabibrahimettai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî tercemesi"),
  E("huseym", "kasimbisabibrahimettai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî tercemesi"),
  /* Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî -- talebeleri */
  E("kasimbisabibrahimettai", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî tercemesi"),
  E("kasimbisabibrahimettai", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Îsâ b. İbrâhim et-Tâî el-Vâsıtî tercemesi"),
  /* Kâsım b. Fazl b. Ma‘dân -- hocalari */
  E("ebunadra", "kasimbfazl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  /* Kâsım b. Fazl b. Ma‘dân -- talebeleri */
  E("kasimbfazl", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "nadrsumeyl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "behzesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "musaismailtebuzeki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "muslimibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "abdullahbmuaviyebmusae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
  E("kasimbfazl", "seybanferruh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Fazl b. Ma‘dân tercemesi"),
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
  /* Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman -- hocalari */
  E("mucahid", "kasimbelvelidelhemdani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman tercemesi"),
  E("sabi", "kasimbelvelidelhemdani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman tercemesi"),
  E("asimbehdele", "kasimbelvelidelhemdani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman tercemesi"),
  E("talhamusarrif", "kasimbelvelidelhemdani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman tercemesi"),
  /* Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman -- talebeleri */
  E("kasimbelvelidelhemdani", "muhammedbabdirrahmanbe2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. el-Velîd el-Hemdânî Ebû Abdirrahman tercemesi"),
  /* Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî -- hocalari */
  E("ubeydullahomeri", "kasimbyahyabata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî tercemesi"),
  E("ibnhuseymkhaysem", "kasimbyahyabata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî tercemesi"),
  E("amess", "kasimbyahyabata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî tercemesi"),
  E("davudebihind", "kasimbyahyabata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî tercemesi"),
  E("hisamhassan", "kasimbyahyabata", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yahyâ b. Atâ Ebû Muhammed el-Vâsıtî tercemesi"),
  /* Kâsım b. Yezîd el-Cermî -- hocalari */
  E("ibnebizib", "kasimbyezidelcermi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yezîd el-Cermî tercemesi"),
  E("darevardi", "kasimbyezidelcermi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yezîd el-Cermî tercemesi"),
  E("israilyunus", "kasimbyezidelcermi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yezîd el-Cermî tercemesi"),
  E("ubeydbamrbebielvelideb", "kasimbyezidelcermi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yezîd el-Cermî tercemesi"),
  /* Kâsım b. Yezîd el-Cermî -- talebeleri */
  E("kasimbyezidelcermi", "muhammedbabdullahbamma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kâsım b. Yezîd el-Cermî tercemesi"),
  /* Kedâme b. Mûsâ b. Ömer -- hocalari */
  E("ebueyyub", "kedamebmusabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kedâme b. Mûsâ b. Ömer tercemesi"),
  E("ebusalih", "kedamebmusabomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kedâme b. Mûsâ b. Ömer tercemesi"),
  /* Kedâme b. Mûsâ b. Ömer -- talebeleri */
  E("kedamebmusabomer", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kedâme b. Mûsâ b. Ömer tercemesi"),
  /* Kureyş b. Enes el-Ensârî -- hocalari */
  E("avfarabi", "kureysbeneselensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  E("hammadseleme", "kureysbeneselensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  /* Kureyş b. Enes el-Ensârî -- talebeleri */
  E("kureysbeneselensari", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  E("kureysbeneselensari", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  E("kureysbeneselensari", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  E("kureysbeneselensari", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kureyş b. Enes el-Ensârî tercemesi"),
  /* Kays b. Hafs et-Temîmî Ebû Muhammed -- hocalari */
  E("huseym", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("mamer", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("ismailayyas", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("caferbsuleymaneddubai", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("abdulvarissaid", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("yezidzurey", "kaysbhafsettemimiebumu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  /* Kays b. Hafs et-Temîmî Ebû Muhammed -- talebeleri */
  E("kaysbhafsettemimiebumu", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("kaysbhafsettemimiebumu", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  E("kaysbhafsettemimiebumu", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Kays b. Hafs et-Temîmî Ebû Muhammed tercemesi"),
  /* Külsûm b. Cebr el-Basrî -- hocalari */
  E("saidcubeyr", "kulsumbcebrelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Külsûm b. Cebr el-Basrî tercemesi"),
  E("kazaayahya", "kulsumbcebrelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Külsûm b. Cebr el-Basrî tercemesi"),
  /* Külsûm b. Cebr el-Basrî -- talebeleri */
  E("kulsumbcebrelbasri", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Külsûm b. Cebr el-Basrî tercemesi"),
  E("kulsumbcebrelbasri", "abdulvarissaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Külsûm b. Cebr el-Basrî tercemesi"),
  /* Muhammed b. İbrâhim b. Dînâr el-Medenî -- hocalari */
  E("yezidbubeyd", "muhammedbibrahimbdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Dînâr el-Medenî tercemesi"),
  E("musaukbe", "muhammedbibrahimbdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Dînâr el-Medenî tercemesi"),
  /* Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz -- hocalari */
  E("abdusselamharb", "muhammedbibrahimbsuley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz tercemesi"),
  E("muttalibbziyadbebizuhe", "muhammedbibrahimbsuley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz tercemesi"),
  /* Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz -- talebeleri */
  E("muhammedbibrahimbsuley", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İbrâhim b. Süleymân Ebû Ca‘fer el-Bezzâz tercemesi"),
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
  /* Muhammed b. İshak b. Muhammed -- hocalari */
  E("yezidharun", "muhammedbishakbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  E("manisa", "muhammedbishakbmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  /* Muhammed b. İshak b. Muhammed -- talebeleri */
  E("muhammedbishakbmuhamme", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  E("muhammedbishakbmuhamme", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  E("muhammedbishakbmuhamme", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  E("muhammedbishakbmuhamme", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Muhammed tercemesi"),
  /* Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî -- hocalari */
  E("isabyunus", "muhammedbishakbmansure", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî tercemesi"),
  E("bisrmufaddal", "muhammedbishakbmansure", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî tercemesi"),
  E("gunder", "muhammedbishakbmansure", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî tercemesi"),
  E("hisamtayalisi", "muhammedbishakbmansure", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İshak b. Mansûr Ebû Abdullah b. Ebî Ya‘kûb el-Kirmânî tercemesi"),
  /* Muhammed b. İsmâîl b. İbrâhim -- hocalari */
  E("ubeydullahmusa", "muhammedbismailbibrahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("affanmuslim", "muhammedbismailbibrahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("mekkiibrahim", "muhammedbismailbibrahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("ahmedhalidvehbi", "muhammedbismailbibrahi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  /* Muhammed b. İsmâîl b. İbrâhim -- talebeleri */
  E("muhammedbismailbibrahi", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "ed24", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "kasimbzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "bh09", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  E("muhammedbismailbibrahi", "bh20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. İbrâhim tercemesi"),
  /* Muhammed b. İsmâîl b. el-Bahterî -- hocalari */
  E("ibnnumeyr", "muhammedbismailb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. el-Bahterî tercemesi"),
  E("yezidharun", "muhammedbismailb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. el-Bahterî tercemesi"),
  /* Muhammed b. İsmâîl b. el-Bahterî -- talebeleri */
  E("muhammedbismailb", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. el-Bahterî tercemesi"),
  E("muhammedbismailb", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. el-Bahterî tercemesi"),
  E("muhammedbismailb", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. el-Bahterî tercemesi"),
  /* Muhammed b. İsmâîl b. Müslim -- hocalari */
  E("ibnebizib", "muhammedbismailbmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("davudkaysferra", "muhammedbismailbmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  /* Muhammed b. İsmâîl b. Müslim -- talebeleri */
  E("muhammedbismailbmuslim", "safii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "humeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "hasanbdavudbmuhammedeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "ibrahimmunzirhizami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "duhaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  E("muhammedbismailbmuslim", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. İsmâîl b. Müslim tercemesi"),
  /* Muhammed b. Bekir b. Osmân -- hocalari */
  E("ibnebiaruba", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("sube", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("hammadseleme", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("yunusyezid", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  /* Muhammed b. Bekir b. Osmân -- talebeleri */
  E("muhammedbbekirbosman", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  E("muhammedbbekirbosman", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Bekir b. Osmân tercemesi"),
  /* Muhammed b. Ebî Bekir b. Ali -- hocalari */
  E("yezidzurey", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  E("hammadzeyd", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  E("bisrmufaddal", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  E("mutemirsuleyman", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  E("ebudavudtayalisi", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  E("ibnmehdi", "muhammedbebibekirbalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Ali tercemesi"),
  /* Muhammed b. Ebî Bekir b. Muhammed Ebû Abdülmelik el-Kādî -- hocalari */
  E("abbadtemim", "muhammedbebibekirbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Bekir b. Muhammed Ebû Abdülmelik el-Kādî tercemesi"),
  /* Muhammed b. Sevr es-San‘ânî Ebû Abdullah -- hocalari */
  E("ibncureyc", "muhammedbsevressananie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevr es-San‘ânî Ebû Abdullah tercemesi"),
  E("avfarabi", "muhammedbsevressananie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevr es-San‘ânî Ebû Abdullah tercemesi"),
  /* Muhammed b. Sevr es-San‘ânî Ebû Abdullah -- talebeleri */
  E("muhammedbsevressananie", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevr es-San‘ânî Ebû Abdullah tercemesi"),
  /* Muhammed b. Ca‘fer b. Ziyâd -- hocalari */
  E("malik", "muhammedbcaferbziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  E("fudaylibnayaz", "muhammedbcaferbziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  /* Muhammed b. Ca‘fer b. Ziyâd -- talebeleri */
  E("muhammedbcaferbziyad", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  E("muhammedbcaferbziyad", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  E("muhammedbcaferbziyad", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  E("muhammedbcaferbziyad", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  E("muhammedbcaferbziyad", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ca‘fer b. Ziyâd tercemesi"),
  /* Muhammed b. Hâtim b. Süleymân -- hocalari */
  E("ubeydebhumeydebuabdirr", "muhammedbhatimbsuleyma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâtim b. Süleymân tercemesi"),
  E("yunusbmuhammedbmuslime", "muhammedbhatimbsuleyma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâtim b. Süleymân tercemesi"),
  E("abbadavvam", "muhammedbhatimbsuleyma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâtim b. Süleymân tercemesi"),
  /* Muhammed b. Hâtim b. Süleymân -- talebeleri */
  E("muhammedbhatimbsuleyma", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâtim b. Süleymân tercemesi"),
  /* Muhammed b. el-Hâris b. Râşid -- talebeleri */
  E("muhammedbelharisbrasid", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Hâris b. Râşid tercemesi"),
  /* Muhammed b. Hassân b. Hâlid ed-Dabbî -- hocalari */
  E("halefbhalifebsaidelesc", "muhammedbhassanbhalide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hassân b. Hâlid ed-Dabbî tercemesi"),
  E("huseym", "muhammedbhassanbhalide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hassân b. Hâlid ed-Dabbî tercemesi"),
  /* Muhammed b. Hassân b. Hâlid ed-Dabbî -- talebeleri */
  E("muhammedbhassanbhalide", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hassân b. Hâlid ed-Dabbî tercemesi"),
  /* Muhammed b. Hasan b. ez-Zübeyr el-Esedî -- hocalari */
  E("fitrhalife", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  E("suleymanmugire", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  E("ibrahimtahman", "muhammedbhasanbezzubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  /* Muhammed b. Hasan b. ez-Zübeyr el-Esedî -- talebeleri */
  E("muhammedbhasanbezzubey", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hasan b. ez-Zübeyr el-Esedî tercemesi"),
  /* Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb -- hocalari */
  E("muhammedbebiubeydebman", "muhammedbhuseyinbibrah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb tercemesi"),
  E("abdussamed", "muhammedbhuseyinbibrah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb tercemesi"),
  E("yahyabishak", "muhammedbhuseyinbibrah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb tercemesi"),
  /* Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb -- talebeleri */
  E("muhammedbhuseyinbibrah", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb tercemesi"),
  E("muhammedbhuseyinbibrah", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hüseyin b. İbrâhim el-Âmirî Ebû Ca‘fer b. İşkâb tercemesi"),
  /* Muhammed b. Hakem el-Mervezî el-Ahvel -- hocalari */
  E("nadrsumeyl", "muhammedbhakemelmervez", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hakem el-Mervezî el-Ahvel tercemesi"),
  /* Muhammed b. Humeyd b. Hayyân er-Râzî -- hocalari */
  E("cerirabdulhamid", "muhammedbhumeydbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  E("ebudavudtayalisi", "muhammedbhumeydbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  /* Muhammed b. Humeyd b. Hayyân er-Râzî -- talebeleri */
  E("muhammedbhumeydbhayyan", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  E("muhammedbhumeydbhayyan", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  E("muhammedbhumeydbhayyan", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  E("muhammedbhumeydbhayyan", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd b. Hayyân er-Râzî tercemesi"),
  /* Muhammed b. Humeyd Ebû Süfyân -- hocalari */
  E("hisamhassan", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("sevri", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  /* Muhammed b. Humeyd Ebû Süfyân -- talebeleri */
  E("muhammedbhumeydebusufy", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("muhammedbhumeydebusufy", "muhammedisataba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("muhammedbhumeydebusufy", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("muhammedbhumeydebusufy", "sericyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("muhammedbhumeydebusufy", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  E("muhammedbhumeydebusufy", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Humeyd Ebû Süfyân tercemesi"),
  /* Muhammed b. Hayyân -- hocalari */
  E("huseym", "muhammedbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("omerbeyyubelabdi", "muhammedbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("ishakyusufezrak", "muhammedbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("affanmuslim", "muhammedbhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  /* Muhammed b. Hayyân -- talebeleri */
  E("muhammedbhayyan", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("muhammedbhayyan", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("muhammedbhayyan", "ahmedmeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("muhammedbhayyan", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("muhammedbhayyan", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  E("muhammedbhayyan", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hayyân tercemesi"),
  /* Muhammed b. Hâlid b. Abdullah -- hocalari */
  E("huseym", "muhammedbhalidbabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâlid b. Abdullah tercemesi"),
  /* Muhammed b. Hâlid b. Abdullah -- talebeleri */
  E("muhammedbhalidbabdulla", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hâlid b. Abdullah tercemesi"),
  /* Muhammed b. Halef Ebû Bekir -- hocalari */
  E("osmanomerfaris", "muhammedbhalefebubekir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Halef Ebû Bekir tercemesi"),
  E("muaviyebhisam", "muhammedbhalefebubekir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Halef Ebû Bekir tercemesi"),
  /* Muhammed b. Halef Ebû Bekir -- talebeleri */
  E("muhammedbhalefebubekir", "bh20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Halef Ebû Bekir tercemesi"),
  E("muhammedbhalefebubekir", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Halef Ebû Bekir tercemesi"),
  /* Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî -- hocalari */
  E("darevardi", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("velidmuslim", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("behzesed", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("gunder", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("manisa", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("yezidharun", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("ebuamirakadi", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("hisamtayalisi", "muhammedbhalladbkesire", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  /* Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî -- talebeleri */
  E("muhammedbhalladbkesire", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("muhammedbhalladbkesire", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  E("muhammedbhalladbkesire", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hallâd b. Kesîr el-Bâhilî Ebû Bekir el-Basrî tercemesi"),
  /* Muhammed b. Saîd b. el-Velîd el-Huzâî Ebû Amr -- talebeleri */
  E("muhammedbsaidbelvelide", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Saîd b. el-Velîd el-Huzâî Ebû Amr tercemesi"),
  E("muhammedbsaidbelvelide", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Saîd b. el-Velîd el-Huzâî Ebû Amr tercemesi"),
  /* Muhammed b. Seleme b. Abdullah el-Bâhilî -- hocalari */
  E("hisamhassan", "muhammedbselemebabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Seleme b. Abdullah el-Bâhilî tercemesi"),
  E("b", "muhammedbselemebabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Seleme b. Abdullah el-Bâhilî tercemesi"),
  /* Muhammed b. Süleymân b. Ebî Dâvûd -- hocalari */
  E("fitrhalife", "muhammedbsuleymanbebid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Süleymân b. Ebî Dâvûd tercemesi"),
  E("caferburkan", "muhammedbsuleymanbebid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Süleymân b. Ebî Dâvûd tercemesi"),
  /* Muhammed b. Sehl b. Asker et-Temîmî -- hocalari */
  E("osmanomerfaris", "muhammedbsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("abdurrezzak", "muhammedbsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("ubeydullahmusa", "muhammedbsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  /* Muhammed b. Sehl b. Asker et-Temîmî -- talebeleri */
  E("muhammedbsehl", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "bh12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  E("muhammedbsehl", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sehl b. Asker et-Temîmî tercemesi"),
  /* Muhammed b. Sevvâr -- hocalari */
  E("abdusselamharb", "muhammedbsevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevvâr tercemesi"),
  E("muhammedfudayl", "muhammedbsevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevvâr tercemesi"),
  E("suleymanhayyan", "muhammedbsevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevvâr tercemesi"),
  E("abdirrahmanbmuhammedbz", "muhammedbsevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevvâr tercemesi"),
  /* Muhammed b. Sevvâr -- talebeleri */
  E("muhammedbsevvar", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sevvâr tercemesi"),
  /* Muhammed b. Şücâ‘ -- hocalari */
  E("huseym", "muhammedbsuca", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şücâ‘ tercemesi"),
  /* Muhammed b. Şücâ‘ -- talebeleri */
  E("muhammedbsuca", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şücâ‘ tercemesi"),
  /* Muhammed b. Şerîk el-Mekkî Ebû Osmân -- hocalari */
  E("amrdinar", "muhammedbserikelmekkie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şerîk el-Mekkî Ebû Osmân tercemesi"),
  E("ikrimehalid", "muhammedbserikelmekkie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şerîk el-Mekkî Ebû Osmân tercemesi"),
  E("humeyskaysarac", "muhammedbserikelmekkie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şerîk el-Mekkî Ebû Osmân tercemesi"),
  /* Muhammed b. Şerîk el-Mekkî Ebû Osmân -- talebeleri */
  E("muhammedbserikelmekkie", "caferavn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Şerîk el-Mekkî Ebû Osmân tercemesi"),
  /* Muhammed b. Sâlih b. Abdirrahman Ebû Bekir -- hocalari */
  E("affanmuslim", "muhammedbsalihbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Abdirrahman Ebû Bekir tercemesi"),
  E("muslimibrahim", "muhammedbsalihbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Abdirrahman Ebû Bekir tercemesi"),
  E("musaismailtebuzeki", "muhammedbsalihbabdirra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Abdirrahman Ebû Bekir tercemesi"),
  /* Muhammed b. Sâlih b. Abdirrahman Ebû Bekir -- talebeleri */
  E("muhammedbsalihbabdirra", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Abdirrahman Ebû Bekir tercemesi"),
  /* Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh -- hocalari */
  E("mutemirsuleyman", "muhammedbsalihbmihrane", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh tercemesi"),
  /* Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh -- talebeleri */
  E("muhammedbsalihbmihrane", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh tercemesi"),
  E("muhammedbsalihbmihrane", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Sâlih b. Mihrân el-Basrî Ebû Ca‘fer b. en-Nettâh Ebû et-Teyyâh tercemesi"),
  /* Muhammed b. Âsım b. Ca‘fer el-Mısrî -- hocalari */
  E("abdullahbnafimevlabome", "muhammedbasimbcaferelm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Âsım b. Ca‘fer el-Mısrî tercemesi"),
  /* Muhammed b. Âsım b. Ca‘fer el-Mısrî -- talebeleri */
  E("muhammedbasimbcaferelm", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Âsım b. Ca‘fer el-Mısrî tercemesi"),
  E("muhammedbasimbcaferelm", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Âsım b. Ca‘fer el-Mısrî tercemesi"),
  /* Muhammed b. Abdullah b. İsmâîl -- hocalari */
  E("abdussamed", "muhammedbabdullahbisma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  E("haccacmuhammed", "muhammedbabdullahbisma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  E("yezidharun", "muhammedbabdullahbisma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  E("saidamirdubai", "muhammedbabdullahbisma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  E("ruhubade", "muhammedbabdullahbisma", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  /* Muhammed b. Abdullah b. İsmâîl -- talebeleri */
  E("muhammedbabdullahbisma", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  E("muhammedbabdullahbisma", "ms20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. İsmâîl tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- hocalari */
  E("haricebbhariceebuelhac", "muhammedbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("gunder", "muhammedbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- talebeleri */
  E("muhammedbabdullah", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- hocalari */
  E("ikrime", "muhammedbabdullah2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("salimibnomer", "muhammedbabdullah2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî -- hocalari */
  E("yahyaumare", "muhammedbabdullahbabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî tercemesi"),
  E("abbadtemim", "muhammedbabdullahbabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî tercemesi"),
  E("saidyesar", "muhammedbabdullahbabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî tercemesi"),
  /* Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî -- talebeleri */
  E("muhammedbabdullahbabdi", "velidkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdirrahman Ebû Abdirrahman el-Medenî tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- hocalari */
  E("ibnuleyye", "muhammedbabdullah3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("huseym", "muhammedbabdullah3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- talebeleri */
  E("muhammedbabdullah3", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("muhammedbabdullah3", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- hocalari */
  E("nadrsumeyl", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("caferavn", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("yalaubeyd", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("alibhuseyinbvakidelmer", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("alihasansakik", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("selemebsuleymanelmerve", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("abdan", "muhammedbabdullah4", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- talebeleri */
  E("muhammedbabdullah4", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("muhammedbabdullah4", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("muhammedbabdullah4", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Muhammed -- hocalari */
  E("abdulvahidziyad", "muhammedbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("mutemirsuleyman", "muhammedbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("caferbsuleymaneddubai", "muhammedbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("bisrbmansur", "muhammedbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("yezidzurey", "muhammedbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  /* Muhammed b. Abdullah b. Muhammed -- talebeleri */
  E("muhammedbabdullahbmuha", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("muhammedbabdullahbmuha", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("muhammedbabdullahbmuha", "amrbmansurelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("muhammedbabdullahbmuha", "hasanbishakbziyadelley", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  E("muhammedbabdullahbmuha", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Muhammed tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- hocalari */
  E("mutemirsuleyman", "muhammedbabdullah5", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("esedmusa", "muhammedbabdullah5", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdullah b. Büzey‘ -- talebeleri */
  E("muhammedbabdullah5", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("muhammedbabdullah5", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  E("muhammedbabdullah5", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Büzey‘ tercemesi"),
  /* Muhammed b. Abdirrahman b. Hasan -- hocalari */
  E("mervanbmuhammedbhassan", "muhammedbabdirrahmanbh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("caferavn", "muhammedbabdirrahmanbh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("abdulhamidbabdirrahman", "muhammedbabdirrahmanbh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("muhammedbisrabdi", "muhammedbabdirrahmanbh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  /* Muhammed b. Abdirrahman b. Hasan -- talebeleri */
  E("muhammedbabdirrahmanbh", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("muhammedbabdirrahmanbh", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("muhammedbabdirrahmanbh", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  E("muhammedbabdirrahmanbh", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdirrahman b. Hasan tercemesi"),
  /* Muhammed b. Abdülazîz b. Ebî Rizme -- hocalari */
  E("fazlbmusa", "muhammedbabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  E("velidmuslim", "muhammedbabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  E("alihasansakik", "muhammedbabdulaziz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  /* Muhammed b. Abdülazîz b. Ebî Rizme -- talebeleri */
  E("muhammedbabdulaziz", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  E("muhammedbabdulaziz", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  E("muhammedbabdulaziz", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  E("muhammedbabdulaziz", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülazîz b. Ebî Rizme tercemesi"),
  /* Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir -- hocalari */
  E("yezidharun", "muhammedbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("abdurrezzak", "muhammedbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("bisrsuayb", "muhammedbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("osmanbsalihbsafvan", "muhammedbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  /* Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir -- talebeleri */
  E("muhammedbabdulmelik", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("muhammedbabdulmelik", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("muhammedbabdulmelik", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  E("muhammedbabdulmelik", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Zencûyeh Ebû Bekir tercemesi"),
  /* Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer -- hocalari */
  E("yalaubeyd", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("abdussamed", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("ruhubade", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("saidamirdubai", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muslimibrahim", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer -- talebeleri */
  E("muhammedbabdulmelikbme", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muhammedbabdulmelikbme", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muhammedbabdulmelikbme", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muhammedbabdulmelikbme", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muhammedbabdulmelikbme", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  E("muhammedbabdulmelikbme", "ed12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdülmelik b. Mervân el-Vâsıtî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Ubeyd b. Hisâb -- hocalari */
  E("ismailebihalid", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("amess", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("hisamurve", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("avvamhavseb", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("abdulmelikebisuleyman", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("misersukdam", "muhammedbubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  /* Muhammed b. Ubeyd b. Hisâb -- talebeleri */
  E("muhammedbubeyd", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "ahmedmeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "hennadseri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "muhammedisataba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "misned", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "ishakbibrahimbnasrebui", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "ahmedsinan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  E("muhammedbubeyd", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Hisâb tercemesi"),
  /* Muhammed b. Ubeyd b. Abdülmelik el-Esedî -- hocalari */
  E("ibnuyeyne", "muhammedbubeydbabdulme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Abdülmelik el-Esedî tercemesi"),
  E("ubeydebhumeydebuabdirr", "muhammedbubeydbabdulme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Abdülmelik el-Esedî tercemesi"),
  E("yezidharun", "muhammedbubeydbabdulme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Abdülmelik el-Esedî tercemesi"),
  /* Muhammed b. Ubeyd b. Abdülmelik el-Esedî -- talebeleri */
  E("muhammedbubeydbabdulme", "ed24", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeyd b. Abdülmelik el-Esedî tercemesi"),
  /* Muhammed b. Osmân b. Kerâme -- hocalari */
  E("ibnnumeyr", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("muhammedbisrabdi", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("halidmahled", "muhammedbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  /* Muhammed b. Osmân b. Kerâme -- talebeleri */
  E("muhammedbosman", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("muhammedbosman", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("muhammedbosman", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("muhammedbosman", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  E("muhammedbosman", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Osmân b. Kerâme tercemesi"),
  /* Muhammed b. Ukbe b. Kesîr -- hocalari */
  E("fudaylsuleyman", "muhammedbukbebkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  /* Muhammed b. Ukbe b. Kesîr -- talebeleri */
  E("muhammedbukbebkesir", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  E("muhammedbukbebkesir", "osmanebiseybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ukbe b. Kesîr tercemesi"),
  /* Muhammed b. Ali b. Hasan -- hocalari */
  E("nadrsumeyl", "muhammedbalibhasan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hasan tercemesi"),
  /* Muhammed b. Ali b. Hasan -- talebeleri */
  E("muhammedbalibhasan", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hasan tercemesi"),
  E("muhammedbalibhasan", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hasan tercemesi"),
  E("muhammedbalibhasan", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hasan tercemesi"),
  E("muhammedbalibhasan", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hasan tercemesi"),
  /* Muhammed b. Ali b. Hamza el-Mervezî -- hocalari */
  E("alibhuseyinbvakidelmer", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  E("alihasansakik", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  E("ebulyemanhakem", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  E("yahyabishak", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  /* Muhammed b. Ali b. Hamza el-Mervezî -- talebeleri */
  E("muhammedbalibhamzaelme", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  E("muhammedbalibhamzaelme", "ms23", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  E("muhammedbalibhamzaelme", "bh12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza el-Mervezî tercemesi"),
  /* Muhammed b. Ali b. Hamza -- hocalari */
  E("alibhuseyinbvakidelmer", "muhammedbalibhamza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("alihasansakik", "muhammedbalibhamza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("ebulyemanhakem", "muhammedbalibhamza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("bmusabelkilabiebumuham", "muhammedbalibhamza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("yahyabishak", "muhammedbalibhamza", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  /* Muhammed b. Ali b. Hamza -- talebeleri */
  E("muhammedbalibhamza", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("muhammedbalibhamza", "ms23", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  E("muhammedbalibhamza", "bh12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Hamza tercemesi"),
  /* Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr -- hocalari */
  E("ebudavudtayalisi", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr tercemesi"),
  E("firyabi", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr tercemesi"),
  E("humeydi", "muhammedbalibmeymunebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr tercemesi"),
  /* Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr -- talebeleri */
  E("muhammedbalibmeymunebu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ali b. Meymûn Ebû Abbâs el-Attâr tercemesi"),
  /* Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer -- hocalari */
  E("ibnnumeyr", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("yahyaadem", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("ubeydebhumeydebuabdirr", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("abdulvehhabata", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("muhammedfudayl", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("yezidharun", "muhammedbomerbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer -- talebeleri */
  E("muhammedbomerbelvelide", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  E("muhammedbomerbelvelide", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ömer b. el-Velîd el-Kindî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Amr b. Hannân -- hocalari */
  E("bakiyyevelid", "muhammedbamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("osmanbsaidbkesir", "muhammedbamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("damrarebia", "muhammedbamr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  /* Muhammed b. Amr b. Hannân -- talebeleri */
  E("muhammedbamr", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("muhammedbamr", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("muhammedbamr", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  /* Muhammed b. Amr b. Hannân -- hocalari */
  E("darevardi", "muhammedbamr2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("huseym", "muhammedbamr2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("hatimismail", "muhammedbamr2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("yahyaadem", "muhammedbamr2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  E("mekkiibrahim", "muhammedbamr2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  /* Muhammed b. Amr b. Hannân -- talebeleri */
  E("muhammedbamr2", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Amr b. Hannân tercemesi"),
  /* Muhammed b. Ebî Gālib et-Tayâlisî -- hocalari */
  E("yezidharun", "muhammedbebigalibettay", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib et-Tayâlisî tercemesi"),
  E("ibrahimmunzirhizami", "muhammedbebigalibettay", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib et-Tayâlisî tercemesi"),
  E("ahmedhanbel", "muhammedbebigalibettay", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib et-Tayâlisî tercemesi"),
  /* Muhammed b. Ebî Gālib et-Tayâlisî -- talebeleri */
  E("muhammedbebigalibettay", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib et-Tayâlisî tercemesi"),
  E("muhammedbebigalibettay", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib et-Tayâlisî tercemesi"),
  /* Muhammed b. Ebî Gālib -- hocalari */
  E("ibnnumeyr", "muhammedbebigalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib tercemesi"),
  E("safii", "muhammedbebigalib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib tercemesi"),
  /* Muhammed b. Ebî Gālib -- talebeleri */
  E("muhammedbebigalib", "ms20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib tercemesi"),
  E("muhammedbebigalib", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Gālib tercemesi"),
  /* Muhammed b. Firâs -- hocalari */
  E("ebudavudtayalisi", "muhammedbfiras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  E("yezidharun", "muhammedbfiras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  E("muazbhisambebiabdullah", "muhammedbfiras", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  /* Muhammed b. Firâs -- talebeleri */
  E("muhammedbfiras", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  E("muhammedbfiras", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  E("muhammedbfiras", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Firâs tercemesi"),
  /* Muhammed b. Fazl b. Atiyye -- hocalari */
  E("ebuishaksebii", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("amrdinar", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("simakharb", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("ziyadilaka", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("suleymanteymi", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("mansurmutemir", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("ibncureyc", "muhammedbfazlbatiyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  /* Muhammed b. Fazl b. Atiyye -- talebeleri */
  E("muhammedbfazlbatiyye", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  E("muhammedbfazlbatiyye", "esedmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Fazl b. Atiyye tercemesi"),
  /* Muhammed b. el-Mübârek -- hocalari */
  E("muaviyesellam", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("yahyabhamzabvakidelhad", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("ismailayyas", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("darevardi", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("amrbzurarebvakidelkila", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("isabyunus", "muhammedbelmubarek", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  /* Muhammed b. el-Mübârek -- talebeleri */
  E("muhammedbelmubarek", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("muhammedbelmubarek", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  E("muhammedbelmubarek", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Mübârek tercemesi"),
  /* Muhammed b. Muhammed b. Hallâd el-Bâhilî Ebû Ömer el-Basrî -- hocalari */
  E("manisa", "muhammedbmuhammedbhall", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Muhammed b. Hallâd el-Bâhilî Ebû Ömer el-Basrî tercemesi"),
  E("misned", "muhammedbmuhammedbhall", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Muhammed b. Hallâd el-Bâhilî Ebû Ömer el-Basrî tercemesi"),
  /* Muhammed b. Müzâhim el-Âmirî -- hocalari */
  E("nadrbmuhammedelmervezi", "muhammedbmuzahimelamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Müzâhim el-Âmirî tercemesi"),
  E("bukeyrbmarufelesediebu", "muhammedbmuzahimelamir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Müzâhim el-Âmirî tercemesi"),
  /* Muhammed b. Müzâhim el-Âmirî -- talebeleri */
  E("muhammedbmuzahimelamir", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Müzâhim el-Âmirî tercemesi"),
  /* Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî -- hocalari */
  E("abdurrezzak", "muhammedbmesudbyusufen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî tercemesi"),
  E("alihasansakik", "muhammedbmesudbyusufen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî tercemesi"),
  /* Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî -- talebeleri */
  E("muhammedbmesudbyusufen", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî tercemesi"),
  E("muhammedbmesudbyusufen", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mes‘ûd b. Yûsuf en-Nîsâbûrî Ebû Ca‘fer b. el-Acemî tercemesi"),
  /* Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî -- hocalari */
  E("ebansattar", "muhammedbmusabebinuaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  E("hammadzeyd", "muhammedbmusabebinuaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  E("abdulvarissaid", "muhammedbmusabebinuaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  E("mehdimeymun", "muhammedbmusabebinuaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  E("huseym", "muhammedbmusabebinuaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  /* Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî -- talebeleri */
  E("muhammedbmusabebinuaym", "ahmedsinan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  E("muhammedbmusabebinuaym", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mûsâ b. Ebî Nuaym el-Vâsıtî tercemesi"),
  /* Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir -- hocalari */
  E("ismailbmusaelfezariebu", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  E("amrbnalisayrafi", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  E("suveydsaidhadesani", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  E("muhammedbabdulmelikbeb", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  E("amrbzurarebvakidelkila", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  E("ibnrahuye", "muhammedbnadrbselemeel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Seleme el-Âmirî Ebû Bekir tercemesi"),
  /* Muhammed b. Nadr b. Müsâvir el-Mervezî -- hocalari */
  E("hammadzeyd", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  E("fudaylibnayaz", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  E("mutemirsuleyman", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  E("ishakbibrahim", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  E("caferbsuleymaneddubai", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  E("yezidzurey", "muhammedbnadr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  /* Muhammed b. Nadr b. Müsâvir el-Mervezî -- talebeleri */
  E("muhammedbnadr", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Nadr b. Müsâvir el-Mervezî tercemesi"),
  /* Muhammed b. Hişâm b. Ebî Hıyera -- hocalari */
  E("mutemirsuleyman", "muhammedbhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Ebî Hıyera tercemesi"),
  E("bisrmufaddal", "muhammedbhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Ebî Hıyera tercemesi"),
  E("gunder", "muhammedbhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Ebî Hıyera tercemesi"),
  E("alihucr", "muhammedbhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Ebî Hıyera tercemesi"),
  /* Muhammed b. Hişâm b. Îsâ -- hocalari */
  E("huseym", "muhammedbhisambisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Îsâ tercemesi"),
  E("ebubekirayyas", "muhammedbhisambisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Îsâ tercemesi"),
  E("omerbeyyubelabdi", "muhammedbhisambisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Îsâ tercemesi"),
  E("caferavn", "muhammedbhisambisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Îsâ tercemesi"),
  /* Muhammed b. Hişâm b. Îsâ -- talebeleri */
  E("muhammedbhisambisa", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hişâm b. Îsâ tercemesi"),
  /* Muhammed b. Hilâl b. Ebî Hilâl el-Medenî -- hocalari */
  E("saidmusayyeb", "muhammedbhilalbebihila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  E("salimibnomer", "muhammedbhilalbebihila", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  /* Muhammed b. Hilâl b. Ebî Hilâl el-Medenî -- talebeleri */
  E("muhammedbhilalbebihila", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  E("muhammedbhilalbebihila", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  E("muhammedbhilalbebihila", "ibnebiuveys", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  E("muhammedbhilalbebihila", "kanebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hilâl b. Ebî Hilâl el-Medenî tercemesi"),
  /* Muhammed b. Vehb b. Ömer -- hocalari */
  E("isabyunus", "muhammedbvehbbomer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Vehb b. Ömer tercemesi"),
  /* Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî -- hocalari */
  E("fudaylibnayaz", "muhammedbyahyabsaidelk", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  E("ibnmehdi", "muhammedbyahyabsaidelk", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  E("abdullahbdavudbamirelh", "muhammedbyahyabsaidelk", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  /* Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî -- talebeleri */
  E("muhammedbyahyabsaidelk", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  E("muhammedbyahyabsaidelk", "abbasb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  E("muhammedbyahyabsaidelk", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  E("muhammedbyahyabsaidelk", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Saîd el-Kattân Ebû Sâlih el-Basrî tercemesi"),
  /* Muhammed b. Yahyâ b. Ebî Semîne -- hocalari */
  E("huseym", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("mutemirsuleyman", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("abbadavvam", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("bisrmufaddal", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("abdulhamidbabdirrahman", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("abdurrezzak", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("saidamirdubai", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("mafairan", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("osmanomerfaris", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("ebuamirakadi", "muhammedbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  /* Muhammed b. Yahyâ b. Ebî Semîne -- talebeleri */
  E("muhammedbyahya", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("muhammedbyahya", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("muhammedbyahya", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  E("muhammedbyahya", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Ebî Semîne tercemesi"),
  /* Muhammed b. Yahyâ b. Abdullah -- hocalari */
  E("ibnmehdi", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("muhammedbbekirbosman", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("ebudavudtayalisi", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("abdurrezzak", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("abdussamed", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("osmanomerfaris", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("amrebiselemetennisi", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("muallamansur", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("yakubbibrahimbsadebuyu", "muhammedbyahyababdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  /* Muhammed b. Yahyâ b. Abdullah -- talebeleri */
  E("muhammedbyahyababdulla", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  E("muhammedbyahyababdulla", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdullah tercemesi"),
  /* Muhammed b. Yahyâ b. Abdülkerîm -- hocalari */
  E("haccacmuhammed", "muhammedbyahyababdulke", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("abdussamed", "muhammedbyahyababdulke", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("ruhubade", "muhammedbyahyababdulke", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("yezidharun", "muhammedbyahyababdulke", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  /* Muhammed b. Yahyâ b. Abdülkerîm -- talebeleri */
  E("muhammedbyahyababdulke", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  E("muhammedbyahyababdulke", "bh17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Abdülkerîm tercemesi"),
  /* Muhammed b. Yahyâ b. Muhammed -- hocalari */
  E("ademebiiyas", "muhammedbyahyabmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Muhammed tercemesi"),
  E("elhidrbmuhammedbsucael", "muhammedbyahyabmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Muhammed tercemesi"),
  E("saidbhafsbamr", "muhammedbyahyabmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Muhammed tercemesi"),
  E("yahyabyalabelhariselmu", "muhammedbyahyabmuhamme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Muhammed tercemesi"),
  /* Muhammed b. Yahyâ b. Muhammed -- talebeleri */
  E("muhammedbyahyabmuhamme", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yahyâ b. Muhammed tercemesi"),
  /* Muhammed b. Ebî Yahyâ el-Medenî -- hocalari */
  E("salimibnomer", "muhammedbebiyahyaelmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ebî Yahyâ el-Medenî tercemesi"),
  /* Muhammed b. Yezîd Ebû Ca‘fer -- hocalari */
  E("velidmuslim", "muhammedbyezidebucafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yezîd Ebû Ca‘fer tercemesi"),
  E("manisa", "muhammedbyezidebucafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yezîd Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Yezîd Ebû Ca‘fer -- talebeleri */
  E("muhammedbyezidebucafer", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yezîd Ebû Ca‘fer tercemesi"),
  E("muhammedbyezidebucafer", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Yezîd Ebû Ca‘fer tercemesi"),
  /* el-Mâdî b. Muhammed b. Mes‘ûd el-Gāfikī Ebû Mes‘ûd -- hocalari */
  E("hisamurve", "bmuhammedbmesudebumesu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mâdî b. Muhammed b. Mes‘ûd el-Gāfikī Ebû Mes‘ûd tercemesi"),
  E("muhammedamralkame", "bmuhammedbmesudebumesu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mâdî b. Muhammed b. Mes‘ûd el-Gāfikī Ebû Mes‘ûd tercemesi"),
  /* Mâlik b. Abdülvâhid Ebû Gassân el-Basrî -- hocalari */
  E("mutemirsuleyman", "malikbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Abdülvâhid Ebû Gassân el-Basrî tercemesi"),
  E("bisrmufaddal", "malikbabdulvahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Abdülvâhid Ebû Gassân el-Basrî tercemesi"),
  /* Mâlik b. Abdülvâhid Ebû Gassân el-Basrî -- talebeleri */
  E("malikbabdulvahid", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mâlik b. Abdülvâhid Ebû Gassân el-Basrî tercemesi"),
  /* Mahmûd b. Hâlid es-Sülemî Ebû Ali ed-Dımaşkī -- hocalari */
  E("muhammedsuaybsabur", "mahmudbhalidessulemieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Hâlid es-Sülemî Ebû Ali ed-Dımaşkī tercemesi"),
  /* Mahmûd b. Hâlid es-Sülemî Ebû Ali ed-Dımaşkī -- talebeleri */
  E("mahmudbhalidessulemieb", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahmûd b. Hâlid es-Sülemî Ebû Ali ed-Dımaşkī tercemesi"),
  /* Mahled b. Hüseyin -- hocalari */
  E("evzai", "mahledbhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  E("ibncureyc", "mahledbhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  E("hisamhassan", "mahledbhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  E("yunusyezid", "mahledbhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  E("musaukbe", "mahledbhuseyin", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  /* Mahled b. Hüseyin -- talebeleri */
  E("mahledbhuseyin", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  E("mahledbhuseyin", "haccacmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Hüseyin tercemesi"),
  /* Mahled b. Mâlik b. Câbir -- hocalari */
  E("darevardi", "mahledbmalikbcabir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  E("velidmuslim", "mahledbmalikbcabir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  E("ibnmehdi", "mahledbmalikbcabir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  E("nadrsumeyl", "mahledbmalikbcabir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  /* Mahled b. Mâlik b. Câbir -- talebeleri */
  E("mahledbmalikbcabir", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  E("mahledbmalikbcabir", "ms22", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Mâlik b. Câbir tercemesi"),
  /* Mahled b. Yezîd -- hocalari */
  E("yahyasaidensari", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  E("israilyunus", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  E("saidabdulaziz", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  E("hanzalasufyan", "mahledbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  /* Mahled b. Yezîd -- talebeleri */
  E("mahledbyezid", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  E("mahledbyezid", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  E("mahledbyezid", "ibnsellam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahled b. Yezîd tercemesi"),
  /* Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî -- hocalari */
  E("muazcebel", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("ebumusa", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("ebuhureyre", "mesudbmalik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  /* Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî -- talebeleri */
  E("mesudbmalik", "ismailebihalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("mesudbmalik", "ataisaib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("mesudbmalik", "amess", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("mesudbmalik", "mugirmiksem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  E("mesudbmalik", "zubeyradi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mes‘ûd b. Mâlik Ebû Rezîn el-Esedî tercemesi"),
  /* Mutarrif b. Abdullah b. Mutarrif -- hocalari */
  E("ibnebizib", "mutarrifbabdullahbmuta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mutarrif b. Abdullah b. Mutarrif tercemesi"),
  E("abdirrahmanbabdullahbo", "mutarrifbabdullahbmuta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mutarrif b. Abdullah b. Mutarrif tercemesi"),
  /* Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî -- hocalari */
  E("ziyadilaka", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("suddi", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("leysebisuleym", "muttalibbziyadbebizuhe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  /* Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî -- talebeleri */
  E("muttalibbziyadbebizuhe", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("muttalibbziyadbebizuhe", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  E("muttalibbziyadbebizuhe", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muttalib b. Ziyâd b. Ebî Züheyr es-Sekafî tercemesi"),
  /* Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî -- hocalari */
  E("sube", "muazbhisambebiabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî tercemesi"),
  E("esaseabdulmelik", "muazbhisambebiabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî tercemesi"),
  /* Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî -- talebeleri */
  E("muazbhisambebiabdullah", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî tercemesi"),
  E("muazbhisambebiabdullah", "affanmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî tercemesi"),
  E("muazbhisambebiabdullah", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâz b. Hişâm b. Ebî Abdullah ed-Destevâî el-Basrî tercemesi"),
  /* Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî -- hocalari */
  E("makilyesar", "muaviyebkurrebiyasebui", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("ebueyyub", "muaviyebkurrebiyasebui", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  /* Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî -- talebeleri */
  E("muaviyebkurrebiyasebui", "sabitbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("muaviyebkurrebiyasebui", "simakharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("muaviyebkurrebiyasebui", "kurrehalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("muaviyebkurrebiyasebui", "mansurzazan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("muaviyebkurrebiyasebui", "matarverrak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  E("muaviyebkurrebiyasebui", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Kurre b. İyâs Ebû İyâs el-Basrî tercemesi"),
  /* Muâviye b. Hişâm -- hocalari */
  E("sevri", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  E("malik", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  E("hamzazeyyat", "muaviyebhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  /* Muâviye b. Hişâm -- talebeleri */
  E("muaviyebhisam", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muâviye b. Hişâm tercemesi"),
  /* Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî -- hocalari */
  E("mehdimeymun", "mugirebselemeelmahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("ebansattar", "mugirebselemeelmahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("suleymanmugire", "mugirebselemeelmahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("rabibmuslimelcumahiebu", "mugirebselemeelmahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("abdulvahidziyad", "mugirebselemeelmahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  /* Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî -- talebeleri */
  E("mugirebselemeelmahzumi", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("mugirebselemeelmahzumi", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  E("mugirebselemeelmahzumi", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mugīre b. Seleme el-Mahzûmî Ebû Hişâm el-Basrî tercemesi"),
  /* el-Mufaddal b. Fadâle b. Ubeyd -- hocalari */
  E("muhammedacilan", "elmufaddalbfadalebubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("rebiabseyf", "elmufaddalbfadalebubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("ibncureyc", "elmufaddalbfadalebubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("yunusyezid", "elmufaddalbfadalebubey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  /* el-Mufaddal b. Fadâle b. Ubeyd -- talebeleri */
  E("elmufaddalbfadalebubey", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("elmufaddalbfadalebubey", "hassanbabdullahbsehlel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("elmufaddalbfadalebubey", "muhammedbasimbcaferelm", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  E("elmufaddalbfadalebubey", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Fadâle b. Ubeyd tercemesi"),
  /* el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus -- hocalari */
  E("evzai", "elmufaddalbyunuselcufi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus tercemesi"),
  /* el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus -- talebeleri */
  E("elmufaddalbyunuselcufi", "halefbtemim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Mufaddal b. Yûnus el-Cu‘fî Ebû Yûnus tercemesi"),
  /* Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr -- hocalari */
  E("yahyabhamzabvakidelhad", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr tercemesi"),
  E("ebulahvess", "mansurbebimuzahimbesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr tercemesi"),
  /* Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr -- talebeleri */
  E("mansurbebimuzahimbesir", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr tercemesi"),
  E("mansurbebimuzahimbesir", "muaviyebsalihbebiubeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr tercemesi"),
  E("mansurbebimuzahimbesir", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mansûr b. Ebî Müzâhim Beşîr Ebû Nasr tercemesi"),
  /* el-Münkedir b. Muhammed b. el-Münkedir et-Teymî -- talebeleri */
  E("elmunkedirbmuhammedbel", "manisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Münkedir b. Muhammed b. el-Münkedir et-Teymî tercemesi"),
  E("elmunkedirbmuhammedbel", "ibnvehb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Münkedir b. Muhammed b. el-Münkedir et-Teymî tercemesi"),
  E("elmunkedirbmuhammedbel", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Münkedir b. Muhammed b. el-Münkedir et-Teymî tercemesi"),
  /* Mehdî b. Hafs Ebû Ahmed -- hocalari */
  E("hammadzeyd", "mehdibhafsebuahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Hafs Ebû Ahmed tercemesi"),
  E("ebulahvess", "mehdibhafsebuahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Hafs Ebû Ahmed tercemesi"),
  E("halefbhalifebsaidelesc", "mehdibhafsebuahmed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Hafs Ebû Ahmed tercemesi"),
  /* Mehdî b. Hafs Ebû Ahmed -- talebeleri */
  E("mehdibhafsebuahmed", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mehdî b. Hafs Ebû Ahmed tercemesi"),
  /* Mûsâ b. Seleme b. Ebî Meryem el-Mısrî -- hocalari */
  E("davudebihind", "musabseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Seleme b. Ebî Meryem el-Mısrî tercemesi"),
  E("muhammedamralkame", "musabseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Seleme b. Ebî Meryem el-Mısrî tercemesi"),
  E("hisamurve", "musabseleme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Seleme b. Ebî Meryem el-Mısrî tercemesi"),
  /* Mûsâ b. Seleme b. Ebî Meryem el-Mısrî -- talebeleri */
  E("musabseleme", "saidbhakembmuhammed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Seleme b. Ebî Meryem el-Mısrî tercemesi"),
  /* Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî -- hocalari */
  E("ademebiiyas", "musabsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî tercemesi"),
  E("ishakbibrahimbyezidebu", "musabsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî tercemesi"),
  E("nuaymbhammadbmuaviyeeb", "musabsehl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî tercemesi"),
  /* Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî -- talebeleri */
  E("musabsehl", "ms29", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Sehl b. Kādim Ebû İmrân er-Remlî tercemesi"),
  /* Mûsâ b. Abdülazîz Ebû Şuayb -- hocalari */
  E("hakembebanebuisa", "musababdulazizebusuayb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Abdülazîz Ebû Şuayb tercemesi"),
  /* Mûsâ b. Ubeyde -- hocalari */
  E("abdullahdinar", "musabubeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  E("iyasbselemebelekvaebus", "musabubeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  E("alkamemersed", "musabubeyde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  /* Mûsâ b. Ubeyde -- talebeleri */
  E("musabubeyde", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  E("musabubeyde", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  E("musabubeyde", "ibnnumeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  E("musabubeyde", "caferavn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Ubeyde tercemesi"),
  /* Mûsâ b. Îsâ el-Leysî -- hocalari */
  E("zaidekudame", "musabisaelleysi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  /* Mûsâ b. Îsâ el-Leysî -- talebeleri */
  E("musabisaelleysi", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  E("musabisaelleysi", "sufyanveki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Îsâ el-Leysî tercemesi"),
  /* Mûsâ b. Kureyş b. Nâfi‘ et-Temîmî -- talebeleri */
  E("musabkureysbnafiettemi", "muslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Kureyş b. Nâfi‘ et-Temîmî tercemesi"),
  /* Mûsâ b. Muhammed b. İbrâhim Ebû Muhammed el-Medenî -- talebeleri */
  E("musabmuhammedbibrahime", "ibnebizib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mûsâ b. Muhammed b. İbrâhim Ebû Muhammed el-Medenî tercemesi"),
  /* Nâfi‘ b. Ömer b. Abdullah -- hocalari */
  E("saidebihind", "nafibomerbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer b. Abdullah tercemesi"),
  /* Nâfi‘ b. Ömer b. Abdullah -- talebeleri */
  E("nafibomerbabdullah", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer b. Abdullah tercemesi"),
  E("nafibomerbabdullah", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer b. Abdullah tercemesi"),
  E("nafibomerbabdullah", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer b. Abdullah tercemesi"),
  E("nafibomerbabdullah", "muhammedbisrabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nâfi‘ b. Ömer b. Abdullah tercemesi"),
  /* Nasr b. Abdirrahman b. Bekkâr -- hocalari */
  E("ibnidris", "nasrbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  E("abdirrahmanbmuhammedbz", "nasrbabdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  /* Nasr b. Abdirrahman b. Bekkâr -- talebeleri */
  E("nasrbabdirrahman", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  E("nasrbabdirrahman", "bh12", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  E("nasrbabdirrahman", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  E("nasrbabdirrahman", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nasr b. Abdirrahman b. Bekkâr tercemesi"),
  /* Nadr b. Muhammed el-Mervezî -- hocalari */
  E("ismailebiislamsibani", "nadrbmuhammedelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  E("amess", "nadrbmuhammedelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  E("misersukdam", "nadrbmuhammedelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  E("yezidbebiziyad", "nadrbmuhammedelmervezi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  /* Nadr b. Muhammed el-Mervezî -- talebeleri */
  E("nadrbmuhammedelmervezi", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  E("nadrbmuhammedelmervezi", "alihasansakik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Muhammed el-Mervezî tercemesi"),
  /* Nu‘mân b. Sâbit Ebû Hanîfe -- hocalari */
  E("hakemuteybe", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("selemekuheyl", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("ziyadilaka", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("saidmesrukhsevri", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("adisabit", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("yahyasaidensari", "numanbsabit", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  /* Nu‘mân b. Sâbit Ebû Hanîfe -- talebeleri */
  E("numanbsabit", "ibrahimtahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "hamzazeyyat", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "yezidzurey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "alimushir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "muhammedbisrabdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  E("numanbsabit", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Sâbit Ebû Hanîfe tercemesi"),
  /* Nu‘mân b. Münzir Ebû el-Vezîr ed-Dımaşkī -- talebeleri */
  E("numanbmunzir", "muhammedvelidzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Münzir Ebû el-Vezîr ed-Dımaşkī tercemesi"),
  E("numanbmunzir", "suveydbabdulazizbnumey", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Münzir Ebû el-Vezîr ed-Dımaşkī tercemesi"),
  E("numanbmunzir", "muhammedsuaybsabur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nu‘mân b. Münzir Ebû el-Vezîr ed-Dımaşkī tercemesi"),
  /* Nûh b. Meymûn b. Abdülhamîd -- hocalari */
  E("bukeyrbmarufelesediebu", "nuhbmeymunbabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nûh b. Meymûn b. Abdülhamîd tercemesi"),
  E("abdirrahmanbabdullahbo", "nuhbmeymunbabdulhamid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nûh b. Meymûn b. Abdülhamîd tercemesi"),
  /* Nûh b. Meymûn b. Abdülhamîd -- talebeleri */
  E("nuhbmeymunbabdulhamid", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nûh b. Meymûn b. Abdülhamîd tercemesi"),
  E("nuhbmeymunbabdulhamid", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nûh b. Meymûn b. Abdülhamîd tercemesi"),
  /* Hârûn b. İsmâîl -- hocalari */
  E("hemmamyahya", "harunbismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. İsmâîl tercemesi"),
  E("kurrehalid", "harunbismail", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. İsmâîl tercemesi"),
  /* Hârûn b. İsmâîl -- talebeleri */
  E("harunbismail", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. İsmâîl tercemesi"),
  E("harunbismail", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. İsmâîl tercemesi"),
  E("harunbismail", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârûn b. İsmâîl tercemesi"),
  /* Hâşim b. Kâsım b. Müslim el-Leysî -- hocalari */
  E("ikrimeammar", "hasimbkasimbmuslimelle", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("zuhayrmuaviye", "hasimbkasimbmuslimelle", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("ubeydbubeydelesceiebua", "hasimbkasimbmuslimelle", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("macisun", "hasimbkasimbmuslimelle", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  /* Hâşim b. Kâsım b. Müslim el-Leysî -- talebeleri */
  E("hasimbkasimbmuslimelle", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "musnedi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "mahmudgaylan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "amrnakid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "muhammedrafi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "fazlbsehlbibrahimelare", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "mucahidmusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  E("hasimbkasimbmuslimelle", "hamidbyahyabhaniebuabd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hâşim b. Kâsım b. Müslim el-Leysî tercemesi"),
  /* Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī -- hocalari */
  E("suveydbabdulazizbnumey", "hisambhalidbzeydebumer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  E("suaybishakdimaski", "hisambhalidbzeydebumer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  E("damrarebia", "hisambhalidbzeydebumer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  E("muhammedsuaybsabur", "hisambhalidbzeydebumer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  /* Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī -- talebeleri */
  E("hisambhalidbzeydebumer", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  E("hisambhalidbzeydebumer", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Hâlid b. Zeyd Ebû Mervân ed-Dımaşkī tercemesi"),
  /* Hişâm b. Ebî Abdullah -- hocalari */
  E("mekhul", "hisambebiabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  E("amrsuayb", "hisambebiabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  /* Hişâm b. Ebî Abdullah -- talebeleri */
  E("hisambebiabdullah", "ismailayyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  E("hisambebiabdullah", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  E("hisambebiabdullah", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  E("hisambebiabdullah", "suleymanhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  E("hisambebiabdullah", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ebî Abdullah tercemesi"),
  /* Hişâm b. Abdülmelik b. İmrân -- hocalari */
  E("ismailayyas", "hisambabdulmelikbimran", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Abdülmelik b. İmrân tercemesi"),
  /* Hişâm b. Abdülmelik b. İmrân -- talebeleri */
  E("hisambabdulmelikbimran", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Abdülmelik b. İmrân tercemesi"),
  E("hisambabdulmelikbimran", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Abdülmelik b. İmrân tercemesi"),
  E("hisambabdulmelikbimran", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Abdülmelik b. İmrân tercemesi"),
  /* Hişâm b. Ammâr b. Nusayr -- hocalari */
  E("yahyabhamzabvakidelhad", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  E("isabyunus", "hisambammar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  /* Hişâm b. Ammâr b. Nusayr -- talebeleri */
  E("hisambammar", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  E("hisambammar", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  E("hisambammar", "duhaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  E("hisambammar", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  E("hisambammar", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hişâm b. Ammâr b. Nusayr tercemesi"),
  /* Heysem b. Hâlid -- hocalari */
  E("ibnnumeyr", "heysembhalid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Heysem b. Hâlid tercemesi"),
  /* Vâsıl b. Sâib er-Rakāşî Ebû Yahyâ el-Basrî -- talebeleri */
  E("vasilbsaiberrakasiebuy", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Sâib er-Rakāşî Ebû Yahyâ el-Basrî tercemesi"),
  E("vasilbsaiberrakasiebuy", "suleymanhayyan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Sâib er-Rakāşî Ebû Yahyâ el-Basrî tercemesi"),
  /* Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım -- hocalari */
  E("ebubekirayyas", "vasilbabdulalabhilalel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  E("yahyaadem", "vasilbabdulalabhilalel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  /* Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım -- talebeleri */
  E("vasilbabdulalabhilalel", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâsıl b. Abdüla‘lâ b. Hilâl el-Esedî Ebû Kâsım tercemesi"),
  /* Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî -- hocalari */
  E("naficubeyr", "vakidbamrbsadebuabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî tercemesi"),
  /* Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî -- talebeleri */
  E("vakidbamrbsadebuabdull", "yahyasaidensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî tercemesi"),
  E("vakidbamrbsadebuabdull", "muhammedamralkame", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî tercemesi"),
  E("vakidbamrbsadebuabdull", "davudhusayn", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vâkid b. Amr b. Sa‘d Ebû Abdullah el-Medenî tercemesi"),
  /* el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr -- hocalari */
  E("velidmuslim", "elvelidbsucabelvelideb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("haccacmuhammed", "elvelidbsucabelvelideb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("alimushir", "elvelidbsucabelvelideb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  /* el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr -- talebeleri */
  E("elvelidbsucabelvelideb", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("elvelidbsucabelvelideb", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("elvelidbsucabelvelideb", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("elvelidbsucabelvelideb", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  E("elvelidbsucabelvelideb", "kasimbzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Şücâ‘ b. el-Velîd Ebû Hemmâm b. Ebî Bedr tercemesi"),
  /* el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī -- hocalari */
  E("velidmuslim", "elvelidbutbeelesceiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī tercemesi"),
  E("mervanbmuhammedbhassan", "elvelidbutbeelesceiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī tercemesi"),
  E("damrarebia", "elvelidbutbeelesceiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī tercemesi"),
  /* el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī -- talebeleri */
  E("elvelidbutbeelesceiebu", "muhammedbishakbavnelam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Utbe el-Eşce‘î Ebû Abbâs ed-Dımaşkī tercemesi"),
  /* el-Velîd b. Kâsım b. el-Velîd el-Hemdânî -- hocalari */
  E("mucalidsaid", "elvelidbkasimbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("omerzerr", "elvelidbkasimbelvelide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  /* el-Velîd b. Kâsım b. el-Velîd el-Hemdânî -- talebeleri */
  E("elvelidbkasimbelvelide", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("elvelidbkasimbelvelide", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  E("elvelidbkasimbelvelide", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Velîd b. Kâsım b. el-Velîd el-Hemdânî tercemesi"),
  /* Yahyâ b. Eyyûb el-Gāfikī -- hocalari */
  E("humeydtavil", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyasaidensari", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("abdullahdinar", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("ismailumeyye", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("bukeyresec", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("muhammedacilan", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yezidhad", "yahyabeyyub", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  /* Yahyâ b. Eyyûb el-Gāfikī -- talebeleri */
  E("yahyabeyyub", "cerirhazim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub", "yahyabishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub", "makburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub", "amrbrabibtarik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  /* Yahyâ b. Eyyûb el-Gāfikī -- hocalari */
  E("huseym", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("halefbhalifebsaidelesc", "yahyabeyyub2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  /* Yahyâ b. Eyyûb el-Gāfikī -- talebeleri */
  E("yahyabeyyub2", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub2", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub2", "ms19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  E("yahyabeyyub2", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Eyyûb el-Gāfikī tercemesi"),
  /* Yahyâ b. Bişr b. Kesîr -- hocalari */
  E("saidabdulaziz", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  E("caferbziyadelahmer", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  E("velidmuslim", "yahyabbisrbkesir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  /* Yahyâ b. Bişr b. Kesîr -- talebeleri */
  E("yahyabbisrbkesir", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr b. Kesîr tercemesi"),
  /* Yahyâ b. Bişr el-Fellâs -- hocalari */
  E("velidmuslim", "yahyabbisrelfellas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr el-Fellâs tercemesi"),
  E("ruhubade", "yahyabbisrelfellas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Bişr el-Fellâs tercemesi"),
  /* Yahyâ b. Ca‘fer b. A‘yen el-Ezdî -- hocalari */
  E("yezidharun", "yahyabcafer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Ca‘fer b. A‘yen el-Ezdî tercemesi"),
  /* Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî -- hocalari */
  E("ikrimeammar", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("sube", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("hammadseleme", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("hemmamyahya", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("cerirhazim", "yahyabhammadbebiziyade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  /* Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî -- talebeleri */
  E("yahyabhammadbebiziyade", "ishakkevsec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("yahyabhammadbebiziyade", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("yahyabhammadbebiziyade", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  E("yahyabhammadbebiziyade", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hammâd b. Ebî Ziyâd eş-Şeybânî tercemesi"),
  /* Yahyâ b. Hamza b. Vâkid el-Hadramî Ebû Abdirrahman ed-Dımaşkī -- talebeleri */
  E("yahyabhamzabvakidelhad", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hamza b. Vâkid el-Hadramî Ebû Abdirrahman ed-Dımaşkī tercemesi"),
  E("yahyabhamzabvakidelhad", "mervanbmuhammedbhassan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hamza b. Vâkid el-Hadramî Ebû Abdirrahman ed-Dımaşkī tercemesi"),
  E("yahyabhamzabvakidelhad", "yahyabcabirbhassanetta", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Hamza b. Vâkid el-Hadramî Ebû Abdirrahman ed-Dımaşkī tercemesi"),
  /* Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî -- hocalari */
  E("ibnidris", "yahyabdavudbmeymunsade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî tercemesi"),
  E("ishakyusufezrak", "yahyabdavudbmeymunsade", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî tercemesi"),
  /* Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî -- talebeleri */
  E("yahyabdavudbmeymunsade", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Dâvûd b. Meymûn el-Vâsıtî tercemesi"),
  /* Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec -- hocalari */
  E("ibnrahuye", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec tercemesi"),
  E("alihucr", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec tercemesi"),
  E("kuteybesaid", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec tercemesi"),
  E("muhammedrafi", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec tercemesi"),
  E("yakubdevraki", "yahyabzekeriyyabyahyae", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Zekeriyyâ b. Yahyâ en-Nîsâbûrî el-A‘rec tercemesi"),
  /* Yahyâ b. Saîd b. Hayyân -- talebeleri */
  E("yahyabsaidbhayyan", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Saîd b. Hayyân tercemesi"),
  /* Yahyâ b. Abbâd ed-Dubaî -- hocalari */
  E("macisun", "yahyababbadeddubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abbâd ed-Dubaî tercemesi"),
  /* Yahyâ b. Abbâd ed-Dubaî -- talebeleri */
  E("yahyababbadeddubai", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abbâd ed-Dubaî tercemesi"),
  E("yahyababbadeddubai", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abbâd ed-Dubaî tercemesi"),
  /* Yahyâ b. Abdullah b. Bükeyr el-Mahzûmî -- talebeleri */
  E("yahyababdullahbbukeyre", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abdullah b. Bükeyr el-Mahzûmî tercemesi"),
  E("yahyababdullahbbukeyre", "duhaym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abdullah b. Bükeyr el-Mahzûmî tercemesi"),
  /* Yahyâ b. Abdullah b. Sâlim -- talebeleri */
  E("yahyababdullahbsalim", "mekkiibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abdullah b. Sâlim tercemesi"),
  /* Yahyâ b. Abdirrahman b. Hâtıb Ebû Muhammed -- hocalari */
  E("abdrahmanharis", "yahyababdirrahman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abdirrahman b. Hâtıb Ebû Muhammed tercemesi"),
  /* Yahyâ b. Abdirrahman b. Hâtıb Ebû Muhammed -- talebeleri */
  E("yahyababdirrahman", "urve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Abdirrahman b. Hâtıb Ebû Muhammed tercemesi"),
  /* Yahyâ b. Gaylân b. Abdullah -- hocalari */
  E("fudaylsuleyman", "yahyabgaylanbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Gaylân b. Abdullah tercemesi"),
  E("ms29", "yahyabgaylanbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Gaylân b. Abdullah tercemesi"),
  E("hatimismail", "yahyabgaylanbabdullah", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Gaylân b. Abdullah tercemesi"),
  /* Yahyâ b. Gaylân b. Abdullah -- talebeleri */
  E("yahyabgaylanbabdullah", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Gaylân b. Abdullah tercemesi"),
  /* Yahyâ b. Fazl b. Yahyâ -- hocalari */
  E("ebuamirakadi", "yahyabfazlbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  E("abdussamed", "yahyabfazlbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  E("omeryunusyemami", "yahyabfazlbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  E("muslimibrahim", "yahyabfazlbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  /* Yahyâ b. Fazl b. Yahyâ -- talebeleri */
  E("yahyabfazlbyahya", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  E("yahyabfazlbyahya", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Fazl b. Yahyâ tercemesi"),
  /* Yahyâ b. Meymûn el-Hadramî Ebû Amre el-Mısrî -- talebeleri */
  E("yahyabmeymunelhadramie", "amrharis", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn el-Hadramî Ebû Amre el-Mısrî tercemesi"),
  /* Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr -- hocalari */
  E("ebuosmannehdi", "yahyabmeymuneddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("saidcubeyr", "yahyabmeymuneddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("nehai", "yahyabmeymuneddabbiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  /* Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr -- talebeleri */
  E("yahyabmeymuneddabbiebu", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("yahyabmeymuneddabbiebu", "hammadzeyd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  E("yahyabmeymuneddabbiebu", "ibnuleyye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Meymûn ed-Dabbî Ebû el-Muallâ el-Attâr tercemesi"),
  /* Yezîd b. İbrâhim -- hocalari */
  E("leysebisuleym", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. İbrâhim tercemesi"),
  E("amrdinar", "yezidbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. İbrâhim tercemesi"),
  /* Yezîd b. İbrâhim -- talebeleri */
  E("yezidbibrahim", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. İbrâhim tercemesi"),
  E("yezidbibrahim", "yezidharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. İbrâhim tercemesi"),
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
  /* Yezîd b. Ebî Saîd en-Nahvî Ebû Hasan -- hocalari */
  E("mucahid", "yezidbebisaidennahvieb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ebî Saîd en-Nahvî Ebû Hasan tercemesi"),
  /* Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî -- hocalari */
  E("abdullahdinar", "yezidbabdullahbusameeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî tercemesi"),
  E("ziyadbebiziyadmeyseree", "yezidbabdullahbusameeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî tercemesi"),
  E("suheylebisalih", "yezidbabdullahbusameeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî tercemesi"),
  E("yahyasaidensari", "yezidbabdullahbusameeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî tercemesi"),
  /* Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî -- talebeleri */
  E("yezidbabdullahbusameeb", "darevardi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdullah b. Üsâme Ebû Abdullah el-Medenî tercemesi"),
  /* Yezîd b. Ubeyd Ebû Vecze -- talebeleri */
  E("yezidbubeyd", "hisamurve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ubeyd Ebû Vecze tercemesi"),
  E("yezidbubeyd", "abdirrahmanbabdullahbo", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Ubeyd Ebû Vecze tercemesi"),
  /* Yezîd b. Atâ b. Yezîd -- hocalari */
  E("simakharb", "yezidbatabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("ismailebihalid", "yezidbatabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("beyanbisr", "yezidbatabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("amess", "yezidbatabyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  /* Yezîd b. Atâ b. Yezîd -- talebeleri */
  E("yezidbatabyezid", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("yezidbatabyezid", "yahyabishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("yezidbatabyezid", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  E("yezidbatabyezid", "saidsuleymansadeviye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Atâ b. Yezîd tercemesi"),
  /* Yezîd b. Mihrân el-Esedî Ebû Hâlid -- hocalari */
  E("ebubekirayyas", "yezidbmihranelesediebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Mihrân el-Esedî Ebû Hâlid tercemesi"),
  /* Yesâr el-Mekkî Ebû Necîh -- hocalari */
  E("ebuhureyre", "yesarelmekki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yesâr el-Mekkî Ebû Necîh tercemesi"),
  E("ubeydumeyr", "yesarelmekki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yesâr el-Mekkî Ebû Necîh tercemesi"),
  /* Yesâr el-Mekkî Ebû Necîh -- talebeleri */
  E("yesarelmekki", "amrdinar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yesâr el-Mekkî Ebû Necîh tercemesi"),
  /* Ya‘kûb b. Abdirrahman b. Muhammed -- hocalari */
  E("musaukbe", "yakubbabdirrahmanbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Abdirrahman b. Muhammed tercemesi"),
  E("suheylebisalih", "yakubbabdirrahmanbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Abdirrahman b. Muhammed tercemesi"),
  /* Ya‘kûb b. Abdirrahman b. Muhammed -- talebeleri */
  E("yakubbabdirrahmanbmuha", "said_mansur", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Abdirrahman b. Muhammed tercemesi"),
  E("yakubbabdirrahmanbmuha", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Abdirrahman b. Muhammed tercemesi"),
  /* Ya‘kûb b. Muhammed b. Îsâ -- hocalari */
  E("darevardi", "yakubbmuhammedbisa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Muhammed b. Îsâ tercemesi"),
  /* Ya‘kûb b. Muhammed b. Îsâ -- talebeleri */
  E("yakubbmuhammedbisa", "harunhammal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Muhammed b. Îsâ tercemesi"),
  E("yakubbmuhammedbisa", "yusufmusakattan", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Muhammed b. Îsâ tercemesi"),
  E("yakubbmuhammedbisa", "muhammedbabdulmelikbme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Muhammed b. Îsâ tercemesi"),
  E("yakubbmuhammedbisa", "yahyamusa", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘kûb b. Muhammed b. Îsâ tercemesi"),
  /* Ya‘lâ b. el-Hâris b. Harb el-Muhâribî -- hocalari */
  E("iyasbselemebelekvaebus", "yalabelharisbharbelmuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("ismailebihalid", "yalabelharisbharbelmuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("bebielmuharibi", "yalabelharisbharbelmuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  /* Ya‘lâ b. el-Hâris b. Harb el-Muhâribî -- talebeleri */
  E("yalabelharisbharbelmuh", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("yalabelharisbharbelmuh", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  E("yalabelharisbharbelmuh", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ya‘lâ b. el-Hâris b. Harb el-Muhâribî tercemesi"),
  /* Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî -- hocalari */
  E("ibnnumeyr", "yusufbisabdinarezzuhri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî tercemesi"),
  /* Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî -- talebeleri */
  E("yusufbisabdinarezzuhri", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî tercemesi"),
  E("yusufbisabdinarezzuhri", "abdebsuleymanelbasri", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî tercemesi"),
  E("yusufbisabdinarezzuhri", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Îsâ b. Dînâr ez-Zührî Ebû Ya‘kûb el-Mervezî tercemesi"),
  /* Yûsuf b. Mervân en-Nesâî Ebû Hasan -- hocalari */
  E("isabyunus", "yusufbmervanennesaiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mervân en-Nesâî Ebû Hasan tercemesi"),
  E("mahledbhuseyin", "yusufbmervanennesaiebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Mervân en-Nesâî Ebû Hasan tercemesi"),
  /* Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî -- hocalari */
  E("suleymanteymi", "yusufbyakubbebikasimes", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  E("behzhakim", "yusufbyakubbebikasimes", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  E("hisamhassan", "yusufbyakubbebikasimes", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  E("malikmigvel", "yusufbyakubbebikasimes", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  E("sube", "yusufbyakubbebikasimes", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  /* Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî -- talebeleri */
  E("yusufbyakubbebikasimes", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  E("yusufbyakubbebikasimes", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûsuf b. Ya‘kûb b. Ebî Kâsım es-Sedûsî tercemesi"),
  /* Yûnus b. Muhammed b. Müslim Ebû Muhammed -- hocalari */
  E("mutemirsuleyman", "yunusbmuhammedbmuslime", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  /* Yûnus b. Muhammed b. Müslim Ebû Muhammed -- talebeleri */
  E("yunusbmuhammedbmuslime", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  E("yunusbmuhammedbmuslime", "musnedi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  E("yunusbmuhammedbmuslime", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  E("yunusbmuhammedbmuslime", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  E("yunusbmuhammedbmuslime", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  E("yunusbmuhammedbmuslime", "ahmedbsaidbibrahimelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Muhammed b. Müslim Ebû Muhammed tercemesi"),
  /* Yûnus b. Nâfi‘ el-Horâsânî Ebû Gānim el-Kādî -- hocalari */
  E("amrdinar", "yunusbnafielhorasani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Nâfi‘ el-Horâsânî Ebû Gānim el-Kādî tercemesi"),
  /* Yûnus b. Yahyâ b. Nübâte Ebû Nübâte el-Medenî -- hocalari */
  E("ibnebizib", "yunusbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Yahyâ b. Nübâte Ebû Nübâte el-Medenî tercemesi"),
  E("davudkaysferra", "yunusbyahya", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yûnus b. Yahyâ b. Nübâte Ebû Nübâte el-Medenî tercemesi"),
  /* Ebû el-Esved -- hocalari */
  E("muazcebel", "ebuelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû el-Esved tercemesi"),
  E("ebuzer", "ebuelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû el-Esved tercemesi"),
  E("imranhusayn", "ebuelesved", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû el-Esved tercemesi"),
  /* Ebû el-Esved -- talebeleri */
  E("ebuelesved", "yahyayamer", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû el-Esved tercemesi"),
  /* Ebû Bekir b. Abdullah b. Muhammed -- hocalari */
  E("musaukbe", "ebubekirbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Abdullah b. Muhammed tercemesi"),
  E("hisamurve", "ebubekirbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Abdullah b. Muhammed tercemesi"),
  E("yahyasaidensari", "ebubekirbabdullahbmuha", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Abdullah b. Muhammed tercemesi"),
  /* Ebû Bekir b. Abdullah b. Muhammed -- talebeleri */
  E("ebubekirbabdullahbmuha", "abdurrezzak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Abdullah b. Muhammed tercemesi"),
  E("ebubekirbabdullahbmuha", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Abdullah b. Muhammed tercemesi"),
  /* Ebû Bekir b. Muhammed b. Zeyd -- talebeleri */
  E("ebubekirbmuhammedbzeyd", "sube", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir b. Muhammed b. Zeyd tercemesi"),
  /* Ebû Bekir -- hocalari */
  E("ziyadilaka", "ebubekir2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("habibebisabit", "ebubekir2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  /* Ebû Bekir -- talebeleri */
  E("ebubekir2", "behzesed", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  E("ebubekir2", "amrmerzuk", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Bekir tercemesi"),
  /* Ebû Harb b. Ebî el-Esved el-Basrî -- talebeleri */
  E("ebuharbbebielesvedelba", "davudebihind", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Harb b. Ebî el-Esved el-Basrî tercemesi"),
  E("ebuharbbebielesvedelba", "ibncureyc", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Harb b. Ebî el-Esved el-Basrî tercemesi"),
  /* Ebû Hassân el-A‘rec -- hocalari */
  E("ebuhureyre", "ebuhassanelarec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hassân el-A‘rec tercemesi"),
  E("esvedyezid", "ebuhassanelarec", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hassân el-A‘rec tercemesi"),
  /* Ebû Hassân el-A‘rec -- talebeleri */
  E("ebuhassanelarec", "asimahvel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Hassân el-A‘rec tercemesi"),
  /* Ebû Abbâs -- hocalari */
  E("saidamirdubai", "ebuabbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Abbâs tercemesi"),
  E("osmanomerfaris", "ebuabbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ebû Abbâs tercemesi"),
  /* Ahmed b. Abdullah b. Eyyûb Ebû el-Velîd b. Ebî Recâ el-Herevî -- talebeleri */
  E("ahmedbabdullahbeyyubeb", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Abdullah b. Eyyûb Ebû el-Velîd b. Ebî Recâ el-Herevî tercemesi"),
  /* Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî -- hocalari */
  E("abdurrezzak", "ahmedbyusufbhalidelezd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî tercemesi"),
  E("halidmahled", "ahmedbyusufbhalidelezd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî tercemesi"),
  /* Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî -- talebeleri */
  E("ahmedbyusufbhalidelezd", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî tercemesi"),
  E("ahmedbyusufbhalidelezd", "bh06", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî tercemesi"),
  E("ahmedbyusufbhalidelezd", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ahmed b. Yûsuf b. Hâlid el-Ezdî Ebû Hasan en-Nîsâbûrî tercemesi"),
  /* İbrâhim b. Ziyâd -- hocalari */
  E("huseym", "ibrahimbziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  E("hammadzeyd", "ibrahimbziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  /* İbrâhim b. Ziyâd -- talebeleri */
  E("ibrahimbziyad", "alimedini", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  E("ibrahimbziyad", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  E("ibrahimbziyad", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  E("ibrahimbziyad", "muazbmuazbnasrebuelbas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Ziyâd tercemesi"),
  /* İbrâhim b. Muhammed b. Ar‘ara -- hocalari */
  E("caferbsuleymaneddubai", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  E("abdurrezzak", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  E("muazbhisambebiabdullah", "ibrahimbmuhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  /* İbrâhim b. Muhammed b. Ar‘ara -- talebeleri */
  E("ibrahimbmuhammedb", "muhammedbishak", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  E("ibrahimbmuhammedb", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  E("ibrahimbmuhammedb", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  E("ibrahimbmuhammedb", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İbrâhim b. Muhammed b. Ar‘ara tercemesi"),
  /* İsmâîl b. Subıh -- hocalari */
  E("hammadseleme", "ismailb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Subıh tercemesi"),
  /* İsmâîl b. Subıh -- talebeleri */
  E("ismailb", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, İsmâîl b. Subıh tercemesi"),
  /* Eş‘as b. Ebî eş-Şa‘sâ el-Muhâribî -- talebeleri */
  E("bebielmuharibi", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eş‘as b. Ebî eş-Şa‘sâ el-Muhâribî tercemesi"),
  E("bebielmuharibi", "misersukdam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Eş‘as b. Ebî eş-Şa‘sâ el-Muhâribî tercemesi"),
  /* Bişr b. Âdem ed-Darîr Ebû Abdullah -- hocalari */
  E("isabyunus", "bisrbeddarirebuabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Âdem ed-Darîr Ebû Abdullah tercemesi"),
  E("hammadzeyd", "bisrbeddarirebuabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Âdem ed-Darîr Ebû Abdullah tercemesi"),
  E("hammadseleme", "bisrbeddarirebuabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Âdem ed-Darîr Ebû Abdullah tercemesi"),
  E("ebulahvess", "bisrbeddarirebuabdulla", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. Âdem ed-Darîr Ebû Abdullah tercemesi"),
  /* Bişr b. el-Vaddâh el-Basrî Ebû Heysem -- hocalari */
  E("hasanbebicafer", "bisrbelbasriebuheysem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Vaddâh el-Basrî Ebû Heysem tercemesi"),
  /* Bişr b. el-Vaddâh el-Basrî Ebû Heysem -- talebeleri */
  E("bisrbelbasriebuheysem", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Bişr b. el-Vaddâh el-Basrî Ebû Heysem tercemesi"),
  /* Beyân b. Amr Ebû Muhammed -- talebeleri */
  E("bamrebumuhammed", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Beyân b. Amr Ebû Muhammed tercemesi"),
  /* el-Cârûd b. Ebî Sebre -- talebeleri */
  E("bebisebre", "sabitbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Cârûd b. Ebî Sebre tercemesi"),
  /* el-Cârûd b. Muâz es-Sülemî -- hocalari */
  E("velidmuslim", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Cârûd b. Muâz es-Sülemî tercemesi"),
  E("suleymanhayyan", "bmuazessulemi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Cârûd b. Muâz es-Sülemî tercemesi"),
  /* el-Cârûd b. Muâz es-Sülemî -- talebeleri */
  E("bmuazessulemi", "tirmizi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Cârûd b. Muâz es-Sülemî tercemesi"),
  /* Hasan b. Şücâ‘ b. Recâ Ebû Ali -- hocalari */
  E("ubeydullahmusa", "hasanbsucabebuali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Şücâ‘ b. Recâ Ebû Ali tercemesi"),
  E("mekkiibrahim", "hasanbsucabebuali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Şücâ‘ b. Recâ Ebû Ali tercemesi"),
  E("hisamtayalisi", "hasanbsucabebuali", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. Şücâ‘ b. Recâ Ebû Ali tercemesi"),
  /* Hasan b. es-Sabbâh el-Bezzâr -- hocalari */
  E("velidmuslim", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("ishakyusufezrak", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("caferavn", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("ruhubade", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("ahmedhanbel", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("alimedini", "hasanbelbezzar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  /* Hasan b. es-Sabbâh el-Bezzâr -- talebeleri */
  E("hasanbelbezzar", "bh03", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("hasanbelbezzar", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  E("hasanbelbezzar", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hasan b. es-Sabbâh el-Bezzâr tercemesi"),
  /* Hüseyin b. Hurays el-Huzâî -- hocalari */
  E("fazlbmusa", "huseyinbelhuzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("darevardi", "huseyinbelhuzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("velidmuslim", "huseyinbelhuzai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  /* Hüseyin b. Hurays el-Huzâî -- talebeleri */
  E("huseyinbelhuzai", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("huseyinbelhuzai", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("huseyinbelhuzai", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("huseyinbelhuzai", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  E("huseyinbelhuzai", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hurays el-Huzâî tercemesi"),
  /* Hüseyin b. Hasan el-Eşkar el-Fezârî -- hocalari */
  E("kaysrebi", "huseyinbhasanelfezari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  E("huseym", "huseyinbhasanelfezari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  /* Hüseyin b. Hasan el-Eşkar el-Fezârî -- talebeleri */
  E("huseyinbhasanelfezari", "ahmedabde", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  E("huseyinbhasanelfezari", "muhammedbhalefebubekir", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hüseyin b. Hasan el-Eşkar el-Fezârî tercemesi"),
  /* Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc -- hocalari */
  E("suheylebisalih", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("bukeyresec", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("halidhazza", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("asimahvel", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("yunusyezid", "haricebbhariceebuelhac", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  /* Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc -- talebeleri */
  E("haricebbhariceebuelhac", "sebabesevvar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("haricebbhariceebuelhac", "ibnmehdi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  E("haricebbhariceebuelhac", "yahyayahyanisaburi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hârice b. Mus‘ab b. Hârice Ebû el-Haccâc tercemesi"),
  /* Hayr b. Nuaym b. Mürre -- talebeleri */
  E("bnuaymbmurre", "amrharis", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hayr b. Nuaym b. Mürre tercemesi"),
  /* Rabî‘ b. Subıh -- hocalari */
  E("humeydtavil", "rabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Subıh tercemesi"),
  E("sabitbunani", "rabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Subıh tercemesi"),
  E("mucahid", "rabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Subıh tercemesi"),
  /* Rabî‘ b. Subıh -- talebeleri */
  E("rabib", "ademebiiyas", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Rabî‘ b. Subıh tercemesi"),
  /* Recâ b. Hayve -- hocalari */
  E("abdullahamr", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  E("ubadesamit", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  E("ebudderda", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  E("ebusaid", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  E("ebusalih", "bhayve", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  /* Recâ b. Hayve -- talebeleri */
  E("bhayve", "humeydtavil", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Recâ b. Hayve tercemesi"),
  /* Zeyd b. Habbân -- hocalari */
  E("ibncureyc", "zeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Habbân tercemesi"),
  E("eyyubsahtiyani", "zeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Habbân tercemesi"),
  E("ataisaib", "zeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Habbân tercemesi"),
  E("ebuishaksebii", "zeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Zeyd b. Habbân tercemesi"),
  /* Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan -- hocalari */
  E("abdulazizsuheyb", "saidbzeydbelezdielcehd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan tercemesi"),
  E("cadebuosman", "saidbzeydbelezdielcehd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan tercemesi"),
  E("alizeydcudan", "saidbzeydbelezdielcehd", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan tercemesi"),
  /* Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan -- talebeleri */
  E("saidbzeydbelezdielcehd", "habbanhilal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan tercemesi"),
  E("saidbzeydbelezdielcehd", "suleymanharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. Zeyd b. Dirhem el-Ezdî el-Cehdamî Ebû Hasan tercemesi"),
  /* Saîd b. el-Ferec Ebû Nadr b. Ebî Saîd -- hocalari */
  E("mekkiibrahim", "saidbebunadrbebisaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. el-Ferec Ebû Nadr b. Ebî Saîd tercemesi"),
  /* Saîd b. el-Ferec Ebû Nadr b. Ebî Saîd -- talebeleri */
  E("saidbebunadrbebisaid", "ms18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Saîd b. el-Ferec Ebû Nadr b. Ebî Saîd tercemesi"),
  /* Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin -- hocalari */
  E("ertatbmunzirbelesved", "sureyhbyezidelhadramie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin tercemesi"),
  E("saidabdulaziz", "sureyhbyezidelhadramie", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin tercemesi"),
  /* Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin -- talebeleri */
  E("sureyhbyezidelhadramie", "yezidbezzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin tercemesi"),
  E("sureyhbyezidelhadramie", "ibnrahuye", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin tercemesi"),
  E("sureyhbyezidelhadramie", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Şüreyh b. Yezîd el-Hadramî Ebû Hayve el-Müezzin tercemesi"),
  /* Sâlih b. Rüstem el-Müzenî -- hocalari */
  E("ebukilabe", "salihbelmuzeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("humeydhilal", "salihbelmuzeni", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  /* Sâlih b. Rüstem el-Müzenî -- talebeleri */
  E("salihbelmuzeni", "israilyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("salihbelmuzeni", "huseym", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("salihbelmuzeni", "mutemirsuleyman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("salihbelmuzeni", "ebudavudtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("salihbelmuzeni", "nadrsumeyl", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  E("salihbelmuzeni", "saidamirdubai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Sâlih b. Rüstem el-Müzenî tercemesi"),
  /* Abbâs b. el-Ferec -- hocalari */
  E("ebudavudtayalisi", "abbasb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abbâs b. el-Ferec tercemesi"),
  /* Abdullah b. Abdülhakem b. A‘yen el-Mısrî Ebû Muhammed el-Fakīh -- talebeleri */
  E("abdullahb", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdülhakem b. A‘yen el-Mısrî Ebû Muhammed el-Fakīh tercemesi"),
  E("abdullahb", "darimi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdullah b. Abdülhakem b. A‘yen el-Mısrî Ebû Muhammed el-Fakīh tercemesi"),
  /* Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî -- hocalari */
  E("fudaylsuleyman", "bhalidbabdulmelik", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî tercemesi"),
  /* Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî -- talebeleri */
  E("bhalidbabdulmelik", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî tercemesi"),
  E("bhalidbabdulmelik", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî tercemesi"),
  E("bhalidbabdulmelik", "muhammedbhumeydebusufy", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdürabbih b. Hâlid b. Abdülmelik Ebû el-Muğallis el-Basrî tercemesi"),
  /* Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî -- hocalari */
  E("sehlsad", "abdirrahmanbsuleymanba", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî tercemesi"),
  /* Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî -- talebeleri */
  E("abdirrahmanbsuleymanba", "ibnidris", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî tercemesi"),
  E("abdirrahmanbsuleymanba", "ebuamirakadi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî tercemesi"),
  E("abdirrahmanbsuleymanba", "ibnebizaide", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî tercemesi"),
  E("abdirrahmanbsuleymanba", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Süleymân b. Abdullah Ebû Süleymân el-Medenî tercemesi"),
  /* Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım -- hocalari */
  E("esedmusa", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım tercemesi"),
  E("alibmabedbseddad", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım tercemesi"),
  E("nadrb", "abdirrahmanbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım tercemesi"),
  /* Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım -- talebeleri */
  E("abdirrahmanbabdullahb", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdirrahman b. Abdullah b. Abdülhakem Ebû Kâsım tercemesi"),
  /* Abdilvâris b. Ubeydullah -- talebeleri */
  E("abdilvarisbubeyd", "muhammedbalibhamzaelme", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abdilvâris b. Ubeydullah tercemesi"),
  /* Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd -- hocalari */
  E("nadrsumeyl", "abdeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd tercemesi"),
  E("fazlbmusa", "abdeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd tercemesi"),
  E("damrarebia", "abdeb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd tercemesi"),
  /* Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd -- talebeleri */
  E("abdeb", "ed13", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd tercemesi"),
  E("abdeb", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Abde b. Abdürrahîm b. Hassân el-Mervezî Ebû Saîd tercemesi"),
  /* Ubeydullah b. Ebî Ziyâd -- hocalari */
  E("ebutufeyl", "ubeydbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("kasimmuhammed", "ubeydbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("sehrhavseb", "ubeydbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("mucahid", "ubeydbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("saidcubeyr", "ubeydbebiziyad", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  /* Ubeydullah b. Ebî Ziyâd -- talebeleri */
  E("ubeydbebiziyad", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("ubeydbebiziyad", "abdullahbdavudbamirelh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  E("ubeydbebiziyad", "muhammedbbekirbosman", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ebî Ziyâd tercemesi"),
  /* Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme -- hocalari */
  E("ibnnumeyr", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("hammadzeyd", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("ibnmehdi", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("velidmuslim", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("ruhubade", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("affanmuslim", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("muhammedbbekirbosman", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("muazbhisambebiabdullah", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("nadrsumeyl", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("yezidharun", "ubeydbsaidbyahyaebuked", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  /* Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme -- talebeleri */
  E("ubeydbsaidbyahyaebuked", "ebuzuraraazi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("ubeydbsaidbyahyaebuked", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  E("ubeydbsaidbyahyaebuked", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Saîd b. Yahyâ Ebû Kedâme tercemesi"),
  /* Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman -- hocalari */
  E("hisamurve", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ismailebihalid", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("sube", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("muhammedamralkame", "ubeydbubeydelesceiebua", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  /* Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman -- talebeleri */
  E("ubeydbubeydelesceiebua", "yahyaadem", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "ebukureyb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  E("ubeydbubeydelesceiebua", "yakubdevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Ubeydirrahman el-Eşce‘î Ebû Abdirrahman tercemesi"),
  /* Ubeydullah b. Muhammed b. Yezîd -- hocalari */
  E("ibnebiuveys", "ubeydbmuhammedbyezid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeydullah b. Muhammed b. Yezîd tercemesi"),
  /* Ubeyd b. Ukayl -- hocalari */
  E("cerirhazim", "ubeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  E("sube", "ubeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  E("hammadzeyd", "ubeydb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  /* Ubeyd b. Ukayl -- talebeleri */
  E("ubeydb", "halefhisam", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  E("ubeydb", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  E("ubeydb", "sehlbmuhammedbosmanebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  E("ubeydb", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ubeyd b. Ukayl tercemesi"),
  /* Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân -- hocalari */
  E("sube", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("hammadseleme", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("hemmamyahya", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("cerirhazim", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("suleymanmugire", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("mutemirsuleyman", "amrbasimbubeydelkilabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  /* Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân -- talebeleri */
  E("amrbasimbubeydelkilabi", "hasanaliayyal", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("amrbasimbubeydelkilabi", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  E("amrbasimbubeydelkilabi", "cuzcani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Amr b. Âsım b. Ubeydullah el-Kilâbî Ebû Osmân tercemesi"),
  /* Alâ b. Abdülcebbâr el-Ensârî -- hocalari */
  E("cerirhazim", "alabelensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("caferbsuleymaneddubai", "alabelensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("nafiomercumahi", "alabelensari", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  /* Alâ b. Abdülcebbâr el-Ensârî -- talebeleri */
  E("alabelensari", "ahmeddevraki", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("alabelensari", "humeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("alabelensari", "zuheyrharb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("alabelensari", "nasralicehdami", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("alabelensari", "muhammedbmesudbyusufen", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  E("alabelensari", "muhammedbishakbmansure", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Alâ b. Abdülcebbâr el-Ensârî tercemesi"),
  /* Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî -- hocalari */
  E("muazcebel", "isabtalhabubeydetteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  E("abdullahamr", "isabtalhabubeydetteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  E("ebuhureyre", "isabtalhabubeydetteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  E("hamranaban", "isabtalhabubeydetteymi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  /* Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî -- talebeleri */
  E("isabtalhabubeydetteymi", "halidselememahzumi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  E("isabtalhabubeydetteymi", "yezidebihabib", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Îsâ b. Talha b. Ubeydullah et-Teymî Ebû Muhammed el-Medenî tercemesi"),
  /* Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah -- hocalari */
  E("ebuvail", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("ebuishaksebii", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("ismailebihalid", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("iyasbselemebelekvaebus", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("leysebisuleym", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("simakharb", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("suleymanbbureydebelhas", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  E("ebuzubeyrmekki", "gaylanbcamibelmuharibi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Gaylân b. Câmi‘ b. Eş‘as el-Muhâribî Ebû Abdullah tercemesi"),
  /* Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm -- hocalari */
  E("ruhubade", "muhammedbahmedbelcerra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm tercemesi"),
  E("saidamirdubai", "muhammedbahmedbelcerra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm tercemesi"),
  E("caferavn", "muhammedbahmedbelcerra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm tercemesi"),
  E("yezidharun", "muhammedbahmedbelcerra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm tercemesi"),
  /* Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm -- talebeleri */
  E("muhammedbahmedbelcerra", "ms02", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ahmed b. el-Cerrâh Ebû Abdürrahîm tercemesi"),
  /* Muhammed b. el-Eş‘as b. Kays el-Kindî Ebû Kâsım -- talebeleri */
  E("muhammedbbkayselkindie", "sabi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Eş‘as b. Kays el-Kindî Ebû Kâsım tercemesi"),
  E("muhammedbbkayselkindie", "mucahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. el-Eş‘as b. Kays el-Kindî Ebû Kâsım tercemesi"),
  /* Muhammed b. Seleme b. Ebî Fâtıma -- hocalari */
  E("abdullahbkuleybbkeysan", "muhammedbselemebebi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Seleme b. Ebî Fâtıma tercemesi"),
  /* Muhammed b. Seleme b. Ebî Fâtıma -- talebeleri */
  E("muhammedbselemebebi", "ibnmace", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Seleme b. Ebî Fâtıma tercemesi"),
  E("muhammedbselemebebi", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Seleme b. Ebî Fâtıma tercemesi"),
  /* Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer -- hocalari */
  E("abdusselamharb", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  E("fudaylibnayaz", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  E("hammadzeyd", "muhammedbbmalikennehai", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer -- talebeleri */
  E("muhammedbbmalikennehai", "ahmedbseyyarbeyyubebuh", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  E("muhammedbbmalikennehai", "abbasb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. et-Tufeyl b. Mâlik en-Nehaî Ebû Ca‘fer tercemesi"),
  /* Muhammed b. Abdullah b. Abdülhakem -- hocalari */
  E("safii", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdülhakem tercemesi"),
  E("suaybbleysbsad", "muhammedbabdullahb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdülhakem tercemesi"),
  /* Muhammed b. Abdullah b. Abdülhakem -- talebeleri */
  E("muhammedbabdullahb", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdülhakem tercemesi"),
  E("muhammedbabdullahb", "ms20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdülhakem tercemesi"),
  /* Muhammed b. Abdullah b. Abdürrahîm -- hocalari */
  E("abdulvarissaid", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("fudaylsuleyman", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("mutemirsuleyman", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("yezidzurey", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("bisrmufaddal", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("ziyadbrabi", "muhammedbabdullahb2", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  /* Muhammed b. Abdullah b. Abdürrahîm -- talebeleri */
  E("muhammedbabdullahb2", "musabharun", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("muhammedbabdullahb2", "ed17", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("muhammedbabdullahb2", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("muhammedbabdullahb2", "ed20", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  E("muhammedbabdullahb2", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. Abdürrahîm tercemesi"),
  /* Muhammed b. Abdullah b. el-Müsennâ -- hocalari */
  E("suleymanteymi", "muhammedbabdullahb3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("humeydtavil", "muhammedbabdullahb3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("cureyri", "muhammedbabdullahb3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("ibnebiaruba", "muhammedbabdullahb3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("hisamhassan", "muhammedbabdullahb3", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  /* Muhammed b. Abdullah b. el-Müsennâ -- talebeleri */
  E("muhammedbabdullahb3", "ahmedhanbel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "kuteybesaid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "zaferani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "hisamtayalisi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  E("muhammedbabdullahb3", "ibnmain", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdullah b. el-Müsennâ tercemesi"),
  /* Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ -- hocalari */
  E("bakiyyevelid", "muhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  E("osmanbsaidbkesir", "muhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  E("damrarebia", "muhammedb", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  /* Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ -- talebeleri */
  E("muhammedb", "bh07", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  E("muhammedb", "bh11", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  E("muhammedb", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Abdürrahîm b. Ebî Züheyr el-Bezzâz Ebû Yahyâ tercemesi"),
  /* Muhammed b. Ubeydullah b. Abdil‘azīm -- hocalari */
  E("alimedini", "muhammedbubeydbabdilaz", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Ubeydullah b. Abdil‘azīm tercemesi"),
  /* Muhammed b. Mahbûb el-Bünânî -- hocalari */
  E("abdulvahidziyad", "muhammedbelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mahbûb el-Bünânî tercemesi"),
  E("huseym", "muhammedbelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mahbûb el-Bünânî tercemesi"),
  E("sallamebimuti", "muhammedbelbunani", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mahbûb el-Bünânî tercemesi"),
  /* Muhammed b. Mahbûb el-Bünânî -- talebeleri */
  E("muhammedbelbunani", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Mahbûb el-Bünânî tercemesi"),
  /* Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît -- hocalari */
  E("firyabi", "muhammedbharunbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  E("yahyaebibukeyr", "muhammedbharunbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  E("ruhubade", "muhammedbharunbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  E("ebulyemanhakem", "muhammedbharunbibrahim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  /* Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît -- talebeleri */
  E("muhammedbharunbibrahim", "sucabmahledelfellasebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  E("muhammedbharunbibrahim", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Muhammed b. Hârûn b. İbrâhim Ebû Ca‘fer el-Bezzâz Ebû Neşît tercemesi"),
  /* el-Müsennâ b. es-Sabbâh -- hocalari */
  E("mucahid", "b", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  E("amrdinar", "b", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  E("ibrahimmeysere", "b", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  E("ataihorasani", "b", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  /* el-Müsennâ b. es-Sabbâh -- talebeleri */
  E("b", "isabyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  E("b", "fitrhalife", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  E("b", "velidmuslim", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, el-Müsennâ b. es-Sabbâh tercemesi"),
  /* Mahbûb b. Mûsâ Ebû Sâlih el-Ferrâ -- hocalari */
  E("suaybbharbelmedainiebu", "bmusaebusalihelferra", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mahbûb b. Mûsâ Ebû Sâlih el-Ferrâ tercemesi"),
  /* Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî -- talebeleri */
  E("bsadbebivakkasezzuhrie", "mucahid", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "ebuishaksebii", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "abdulmelikumeyr", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "suddi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "asimbehdele", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "zubeyradi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  E("bsadbebivakkasezzuhrie", "hakemuteybe", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Mus‘ab b. Sa‘d b. Ebî Vakkās ez-Zührî Ebû Zürâre el-Medenî tercemesi"),
  /* Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah -- hocalari */
  E("amrdinar", "makilbubeydelcezeriebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah tercemesi"),
  E("ibrahimebiable", "makilbubeydelcezeriebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah tercemesi"),
  /* Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah -- talebeleri */
  E("makilbubeydelcezeriebu", "muhammedbyezidbsinanel", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah tercemesi"),
  E("makilbubeydelcezeriebu", "ahmedbabdullahbyunus", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Ma‘kıl b. Ubeydullah el-Cezerî Ebû Abdullah tercemesi"),
  /* Nadr b. Abdülcebbâr -- talebeleri */
  E("nadrb", "rabibsuleymanbdavudebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Abdülcebbâr tercemesi"),
  E("nadrb", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Nadr b. Abdülcebbâr tercemesi"),
  /* Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî -- hocalari */
  E("hammadzeyd", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  E("ruhubade", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  E("hammadmesade", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  E("avnbumareebumuhammedel", "hilalbbisrbelmuzeniebu", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  /* Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî -- talebeleri */
  E("hilalbbisrbelmuzeniebu", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  E("hilalbbisrbelmuzeniebu", "ms28", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Hilâl b. Bişr b. Mahbûb el-Müzenî Ebû Hasan el-Basrî tercemesi"),
  /* Vehb b. Beyân el-Vâsıtî Ebû Abdullah -- hocalari */
  E("ubeydebhumeydebuabdirr", "vehbbsadeveyhebuabdull", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vehb b. Beyân el-Vâsıtî Ebû Abdullah tercemesi"),
  /* Vehb b. Beyân el-Vâsıtî Ebû Abdullah -- talebeleri */
  E("vehbbsadeveyhebuabdull", "ed18", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vehb b. Beyân el-Vâsıtî Ebû Abdullah tercemesi"),
  E("vehbbsadeveyhebuabdull", "ed19", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Vehb b. Beyân el-Vâsıtî Ebû Abdullah tercemesi"),
  /* Yahyâ b. Kesîr b. Dirhem el-Anberî -- hocalari */
  E("sube", "yahyabkesirbelanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Kesîr b. Dirhem el-Anberî tercemesi"),
  /* Yahyâ b. Kesîr b. Dirhem el-Anberî -- talebeleri */
  E("yahyabkesirbelanberi", "bundar", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Kesîr b. Dirhem el-Anberî tercemesi"),
  E("yahyabkesirbelanberi", "abbasanberi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Kesîr b. Dirhem el-Anberî tercemesi"),
  E("yahyabkesirbelanberi", "haccacsair", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yahyâ b. Kesîr b. Dirhem el-Anberî tercemesi"),
  /* Yezîd b. Abdürabbih ez-Zübeydî -- hocalari */
  E("velidmuslim", "yezidbezzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdürabbih ez-Zübeydî tercemesi"),
  E("muhammedharbhavlani", "yezidbezzubeydi", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdürabbih ez-Zübeydî tercemesi"),
  /* Yezîd b. Abdürabbih ez-Zübeydî -- talebeleri */
  E("yezidbezzubeydi", "zuhli", "—", "Takrîb iskeleti + Tehzîbü't-Tehzîb taraması, Yezîd b. Abdürabbih ez-Zübeydî tercemesi"),
];

export const NODES = [...ANA_NODES, ...KUFE_NODES];
export const EDGES = [...ANA_EDGES, ...KUFE_EDGES];
nebiKenarlariEkle(NODES, EDGES);
export const DERECE = dereceKur(EDGES);
export const rOf = rOfKur(DERECE);
export const rEkranOf = rEkranOfKur(rOf);
export const { POS, SUTUNLAR, W, MEDINE } = yerlesimKur(NODES);
