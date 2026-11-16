// German seed vocabulary: word | article | plural | English | Arabic | topic | emoji (optional)
// article: der / die / das, or - for non-nouns. plural: plural form without article, - = no plural
// in normal use, PL = plural-only noun (die Eltern). Checked against Duden/DWDS conventions.
const RAW = `
Hallo|-|-|hello|مرحبا|greetings|👋
Guten Morgen|-|-|good morning|صباح الخير|greetings|🌅
Guten Tag|-|-|hello (good day)|نهارك سعيد|greetings|🌤️
Guten Abend|-|-|good evening|مساء الخير|greetings|🌆
Gute Nacht|-|-|good night|تصبح على خير|greetings|😴
Tschüss|-|-|bye|مع السلامة|greetings|✌️
Auf Wiedersehen|-|-|goodbye (formal)|إلى اللقاء|greetings|👋
Bis später|-|-|see you later|أراك لاحقا|greetings|⏳
Bis morgen|-|-|see you tomorrow|إلى الغد|greetings|📅
Wie geht's?|-|-|how are you?|كيف حالك؟|greetings|🙂
Danke|-|-|thanks|شكرا|greetings|🙏
Vielen Dank|-|-|thank you very much|شكرا جزيلا|greetings|🙏
Bitte|-|-|please / you're welcome|من فضلك / عفوا|greetings|🙏
Entschuldigung|-|-|excuse me / sorry|عفوا / آسف|greetings|😔
Ja|-|-|yes|نعم|greetings|👍
Nein|-|-|no|لا|greetings|👎
Willkommen|-|-|welcome|أهلا وسهلا|greetings|🤗
Gern geschehen|-|-|you're welcome|العفو|greetings|😊
Kein Problem|-|-|no problem|لا مشكلة|greetings|👌
Herzlichen Glückwunsch|-|-|congratulations|مبروك|greetings|🎉
ich|-|-|I|أنا|pronouns
du|-|-|you (informal)|أنتَ / أنتِ|pronouns
er|-|-|he|هو|pronouns
sie|-|-|she / they|هي / هم|pronouns
es|-|-|it|هو / هي (لغير العاقل)|pronouns
wir|-|-|we|نحن|pronouns
ihr|-|-|you (plural, informal)|أنتم|pronouns
Sie|-|-|you (formal)|حضرتك / أنتم (رسمي)|pronouns
mein|-|-|my|ـي (ملكي)|pronouns
dein|-|-|your (informal)|ـك|pronouns
unser|-|-|our|ـنا|pronouns
sein|-|-|to be|يكون|verbs
haben|-|-|to have|يملك|verbs
werden|-|-|to become|يصبح|verbs
gehen|-|-|to go (on foot)|يذهب|verbs|🚶
kommen|-|-|to come|يأتي|verbs
machen|-|-|to do / make|يفعل / يصنع|verbs
heißen|-|-|to be called|يُدعى|verbs
wohnen|-|-|to live (reside)|يسكن|verbs|🏠
arbeiten|-|-|to work|يعمل|verbs|💼
lernen|-|-|to learn|يتعلم|verbs|📚
sprechen|-|-|to speak|يتكلم|verbs|🗣️
verstehen|-|-|to understand|يفهم|verbs
essen|-|-|to eat|يأكل|verbs|🍽️
trinken|-|-|to drink|يشرب|verbs|🥤
schlafen|-|-|to sleep|ينام|verbs|😴
lesen|-|-|to read|يقرأ|verbs|📖
schreiben|-|-|to write|يكتب|verbs|✍️
hören|-|-|to hear / listen|يسمع|verbs|👂
sehen|-|-|to see|يرى|verbs|👀
fahren|-|-|to drive / ride|يسوق / يركب|verbs|🚗
kaufen|-|-|to buy|يشتري|verbs|🛒
bezahlen|-|-|to pay|يدفع|verbs|💳
kochen|-|-|to cook|يطبخ|verbs|👨‍🍳
spielen|-|-|to play|يلعب|verbs|⚽
brauchen|-|-|to need|يحتاج|verbs
finden|-|-|to find|يجد|verbs
geben|-|-|to give|يعطي|verbs
nehmen|-|-|to take|يأخذ|verbs
helfen|-|-|to help|يساعد|verbs|🤝
wissen|-|-|to know (a fact)|يعرف (معلومة)|verbs
kennen|-|-|to know (a person/place)|يعرف (شخصا / مكانا)|verbs
fragen|-|-|to ask|يسأل|verbs|❓
antworten|-|-|to answer|يجيب|verbs|💬
sagen|-|-|to say|يقول|verbs
denken|-|-|to think|يفكر|verbs|🤔
lieben|-|-|to love|يحب|verbs|❤️
mögen|-|-|to like|يحب / يعجبه|verbs
können|-|-|can / to be able to|يستطيع|verbs
müssen|-|-|must / to have to|يجب عليه|verbs
wollen|-|-|to want|يريد|verbs
dürfen|-|-|may / to be allowed to|يُسمح له|verbs
sollen|-|-|should / to be supposed to|ينبغي عليه|verbs
möchten|-|-|would like|يود|verbs
aufstehen|-|-|to get up|يستيقظ / ينهض|verbs|⏰
anrufen|-|-|to call (phone)|يتصل|verbs|📞
einkaufen|-|-|to go shopping|يتسوق|verbs|🛍️
fernsehen|-|-|to watch TV|يشاهد التلفاز|verbs|📺
anfangen|-|-|to begin|يبدأ|verbs
warten|-|-|to wait|ينتظر|verbs|⏳
bleiben|-|-|to stay|يبقى|verbs
suchen|-|-|to look for|يبحث عن|verbs|🔍
zeigen|-|-|to show|يُري|verbs
bringen|-|-|to bring|يُحضر|verbs
tragen|-|-|to carry / wear|يحمل / يرتدي|verbs
laufen|-|-|to run / walk|يجري / يمشي|verbs|🏃
reisen|-|-|to travel|يسافر|verbs|🧳
besuchen|-|-|to visit|يزور|verbs
öffnen|-|-|to open|يفتح|verbs
schließen|-|-|to close|يغلق|verbs
studieren|-|-|to study (at university)|يدرس (في الجامعة)|verbs|🎓
programmieren|-|-|to program|يبرمج|it|👨‍💻
entwickeln|-|-|to develop|يطوّر|it
testen|-|-|to test|يختبر|it|🧪
erklären|-|-|to explain|يشرح|verbs
wiederholen|-|-|to repeat|يكرر|verbs|🔁
buchstabieren|-|-|to spell|يتهجى|verbs|🔤
sich bewerben|-|-|to apply (for a job)|يتقدم لوظيفة|work|📨
der Mann|der|Männer|man|رجل|people|👨
die Frau|die|Frauen|woman / Mrs|امرأة / سيدة|people|👩
das Kind|das|Kinder|child|طفل|people|🧒
der Junge|der|Jungen|boy|ولد|people|👦
das Mädchen|das|Mädchen|girl|بنت|people|👧
der Mensch|der|Menschen|human, person|إنسان|people|🧑
die Leute|die|PL|people|ناس|people|👥
der Freund|der|Freunde|friend (m) / boyfriend|صديق|people|🧑‍🤝‍🧑
die Freundin|die|Freundinnen|friend (f) / girlfriend|صديقة|people|🧑‍🤝‍🧑
der Nachbar|der|Nachbarn|neighbour|جار|people|🏘️
der Name|der|Namen|name|اسم|people|🏷️
der Lehrer|der|Lehrer|teacher (m)|معلم|people|🧑‍🏫
die Lehrerin|die|Lehrerinnen|teacher (f)|معلمة|people|🧑‍🏫
der Arzt|der|Ärzte|doctor (m)|طبيب|people|🧑‍⚕️
die Ärztin|die|Ärztinnen|doctor (f)|طبيبة|people|🧑‍⚕️
der Student|der|Studenten|student (m)|طالب|people|🧑‍🎓
die Studentin|die|Studentinnen|student (f)|طالبة|people|🧑‍🎓
der Kollege|der|Kollegen|colleague (m)|زميل|work|🧑‍💼
die Kollegin|die|Kolleginnen|colleague (f)|زميلة|work|🧑‍💼
der Chef|der|Chefs|boss (m)|مدير|work|👔
die Chefin|die|Chefinnen|boss (f)|مديرة|work|👔
die Familie|die|Familien|family|عائلة|family|👨‍👩‍👧‍👦
die Eltern|die|PL|parents|الوالدان|family|👪
die Mutter|die|Mütter|mother|أم|family|👩
der Vater|der|Väter|father|أب|family|👨
der Bruder|der|Brüder|brother|أخ|family|👦
die Schwester|die|Schwestern|sister|أخت|family|👧
die Geschwister|die|PL|siblings|الإخوة|family|👫
der Sohn|der|Söhne|son|ابن|family|👦
die Tochter|die|Töchter|daughter|ابنة|family|👧
die Oma|die|Omas|grandma|جدة|family|👵
der Opa|der|Opas|grandpa|جد|family|👴
der Onkel|der|Onkel|uncle|عم / خال|family|👨
die Tante|die|Tanten|aunt|عمة / خالة|family|👩
das Baby|das|Babys|baby|رضيع|family|👶
der Ehemann|der|Ehemänner|husband|زوج|family|💍
die Ehefrau|die|Ehefrauen|wife|زوجة|family|💍
der Kopf|der|Köpfe|head|رأس|body|🙂
das Auge|das|Augen|eye|عين|body|👁️
das Ohr|das|Ohren|ear|أذن|body|👂
die Nase|die|Nasen|nose|أنف|body|👃
der Mund|der|Münder|mouth|فم|body|👄
der Zahn|der|Zähne|tooth|سن|body|🦷
das Haar|das|Haare|hair|شعر|body|💇
die Hand|die|Hände|hand|يد|body|✋
der Arm|der|Arme|arm|ذراع|body|💪
das Bein|das|Beine|leg|ساق|body|🦵
der Fuß|der|Füße|foot|قدم|body|🦶
der Bauch|der|Bäuche|belly|بطن|body|🫃
der Rücken|der|Rücken|back|ظهر|body|🧍
das Herz|das|Herzen|heart|قلب|body|❤️
der Hals|der|Hälse|neck / throat|رقبة / حلق|body|🧣
das Haus|das|Häuser|house|بيت|home|🏠
die Wohnung|die|Wohnungen|apartment|شقة|home|🏢
das Zimmer|das|Zimmer|room|غرفة|home|🚪
die Küche|die|Küchen|kitchen|مطبخ|home|🍳
das Bad|das|Bäder|bathroom|حمام|home|🛁
das Schlafzimmer|das|Schlafzimmer|bedroom|غرفة النوم|home|🛏️
das Wohnzimmer|das|Wohnzimmer|living room|غرفة الجلوس|home|🛋️
der Tisch|der|Tische|table|طاولة|home|🍽️
der Stuhl|der|Stühle|chair|كرسي|home|🪑
das Bett|das|Betten|bed|سرير|home|🛏️
das Sofa|das|Sofas|sofa|أريكة|home|🛋️
der Schrank|der|Schränke|cupboard / wardrobe|خزانة|home|🗄️
die Tür|die|Türen|door|باب|home|🚪
das Fenster|das|Fenster|window|نافذة|home|🪟
die Lampe|die|Lampen|lamp|مصباح|home|💡
der Kühlschrank|der|Kühlschränke|fridge|ثلاجة|home|🧊
die Miete|die|Mieten|rent|إيجار|home|💶
der Schlüssel|der|Schlüssel|key|مفتاح|home|🔑
der Balkon|der|Balkone|balcony|شرفة|home|🌇
der Garten|der|Gärten|garden|حديقة|home|🌳
die Treppe|die|Treppen|stairs|درج|home|🪜
die Wand|die|Wände|wall|جدار|home|🧱
das Brot|das|Brote|bread|خبز|food|🍞
das Brötchen|das|Brötchen|bread roll|خبز صغير|food|🥖
der Käse|der|Käse|cheese|جبن|food|🧀
die Butter|die|-|butter|زبدة|food|🧈
die Milch|die|-|milk|حليب|food|🥛
der Kaffee|der|-|coffee|قهوة|food|☕
der Tee|der|Tees|tea|شاي|food|🍵
das Wasser|das|-|water|ماء|food|💧
der Saft|der|Säfte|juice|عصير|food|🧃
das Ei|das|Eier|egg|بيضة|food|🥚
der Apfel|der|Äpfel|apple|تفاحة|food|🍎
die Banane|die|Bananen|banana|موزة|food|🍌
die Orange|die|Orangen|orange|برتقالة|food|🍊
die Tomate|die|Tomaten|tomato|طماطم|food|🍅
die Kartoffel|die|Kartoffeln|potato|بطاطس|food|🥔
die Zwiebel|die|Zwiebeln|onion|بصل|food|🧅
der Reis|der|-|rice|أرز|food|🍚
die Nudeln|die|PL|pasta|معكرونة|food|🍝
das Fleisch|das|-|meat|لحم|food|🥩
das Schweinefleisch|das|-|pork|لحم الخنزير|food|🐖
das Rindfleisch|das|-|beef|لحم البقر|food|🥩
das Hähnchen|das|Hähnchen|chicken (food)|دجاج|food|🍗
der Fisch|der|Fische|fish|سمك|food|🐟
das Gemüse|das|-|vegetables|خضروات|food|🥦
das Obst|das|-|fruit|فواكه|food|🍇
der Zucker|der|-|sugar|سكر|food|🍬
das Salz|das|-|salt|ملح|food|🧂
die Suppe|die|Suppen|soup|حساء|food|🥣
der Salat|der|Salate|salad|سلطة|food|🥗
der Kuchen|der|Kuchen|cake|كعكة|food|🍰
das Frühstück|das|Frühstücke|breakfast|فطور|food|🥐
das Mittagessen|das|Mittagessen|lunch|غداء|food|🍲
das Abendessen|das|Abendessen|dinner|عشاء|food|🍝
die Rechnung|die|Rechnungen|bill / invoice|فاتورة|food|🧾
die Flasche|die|Flaschen|bottle|زجاجة|food|🍾
das Glas|das|Gläser|glass|كأس|food|🥛
die Tasse|die|Tassen|cup|فنجان|food|☕
der Teller|der|Teller|plate|صحن|food|🍽️
das Messer|das|Messer|knife|سكين|food|🔪
die Gabel|die|Gabeln|fork|شوكة|food|🍴
der Löffel|der|Löffel|spoon|ملعقة|food|🥄
die Stadt|die|Städte|city|مدينة|city|🏙️
das Dorf|das|Dörfer|village|قرية|city|🏘️
die Straße|die|Straßen|street|شارع|city|🛣️
der Platz|der|Plätze|square / seat / space|ساحة / مكان|city|⛲
der Bahnhof|der|Bahnhöfe|train station|محطة القطار|city|🚉
der Zug|der|Züge|train|قطار|city|🚆
der Bus|der|Busse|bus|حافلة|city|🚌
die U-Bahn|die|U-Bahnen|underground (metro)|مترو الأنفاق|city|🚇
das Auto|das|Autos|car|سيارة|city|🚗
das Fahrrad|das|Fahrräder|bicycle|دراجة|city|🚲
das Taxi|das|Taxis|taxi|سيارة أجرة|city|🚕
der Flughafen|der|Flughäfen|airport|مطار|city|🛫
das Flugzeug|das|Flugzeuge|airplane|طائرة|city|✈️
die Haltestelle|die|Haltestellen|stop (bus/tram)|محطة|city|🚏
die Fahrkarte|die|Fahrkarten|ticket (transport)|تذكرة|city|🎫
die Apotheke|die|Apotheken|pharmacy|صيدلية|city|💊
das Krankenhaus|das|Krankenhäuser|hospital|مستشفى|city|🏥
die Bank|die|Banken|bank|بنك|city|🏦
die Post|die|-|post office / mail|البريد|city|📮
der Park|der|Parks|park|حديقة عامة|city|🌳
die Schule|die|Schulen|school|مدرسة|city|🏫
die Universität|die|Universitäten|university|جامعة|city|🎓
das Kino|das|Kinos|cinema|سينما|city|🎬
das Museum|das|Museen|museum|متحف|city|🏛️
die Moschee|die|Moscheen|mosque|مسجد|city|🕌
die Kirche|die|Kirchen|church|كنيسة|city|⛪
das Hotel|das|Hotels|hotel|فندق|city|🏨
der Markt|der|Märkte|market|سوق|city|🧺
der Supermarkt|der|Supermärkte|supermarket|سوبر ماركت|city|🛒
das Geschäft|das|Geschäfte|shop / business|متجر|city|🏪
das Restaurant|das|Restaurants|restaurant|مطعم|city|🍽️
die Ampel|die|Ampeln|traffic light|إشارة المرور|city|🚦
die Kreuzung|die|Kreuzungen|crossroads|تقاطع|city|✖️
das Amt|das|Ämter|(government) office|إدارة / مصلحة|city|🏛️
das Rathaus|das|Rathäuser|town hall|البلدية|city|🏛️
die Polizei|die|-|police|الشرطة|city|👮
der Tag|der|Tage|day|يوم|time|📅
die Woche|die|Wochen|week|أسبوع|time|🗓️
der Monat|der|Monate|month|شهر|time|🗓️
das Jahr|das|Jahre|year|سنة|time|📆
die Stunde|die|Stunden|hour|ساعة (مدة)|time|⏱️
die Minute|die|Minuten|minute|دقيقة|time|⏱️
die Uhr|die|Uhren|clock / o'clock|ساعة|time|🕐
die Zeit|die|Zeiten|time|وقت|time|⏳
der Morgen|der|Morgen|morning|صباح|time|🌅
der Vormittag|der|Vormittage|late morning|الضحى|time|🌤️
der Mittag|der|Mittage|noon|الظهر|time|🌞
der Nachmittag|der|Nachmittage|afternoon|بعد الظهر|time|🌇
der Abend|der|Abende|evening|مساء|time|🌆
die Nacht|die|Nächte|night|ليل|time|🌙
der Montag|der|Montage|Monday|الاثنين|time|📅
der Dienstag|der|Dienstage|Tuesday|الثلاثاء|time|📅
der Mittwoch|der|Mittwoche|Wednesday|الأربعاء|time|📅
der Donnerstag|der|Donnerstage|Thursday|الخميس|time|📅
der Freitag|der|Freitage|Friday|الجمعة|time|📅
der Samstag|der|Samstage|Saturday|السبت|time|📅
der Sonntag|der|Sonntage|Sunday|الأحد|time|📅
das Wochenende|das|Wochenenden|weekend|عطلة نهاية الأسبوع|time|🎉
der Frühling|der|Frühlinge|spring|الربيع|time|🌷
der Sommer|der|Sommer|summer|الصيف|time|☀️
der Herbst|der|Herbste|autumn|الخريف|time|🍂
der Winter|der|Winter|winter|الشتاء|time|❄️
der Urlaub|der|Urlaube|holiday, vacation|عطلة|time|🏝️
der Termin|der|Termine|appointment|موعد|time|📅
der Geburtstag|der|Geburtstage|birthday|عيد الميلاد|time|🎂
heute|-|-|today|اليوم|time
morgen|-|-|tomorrow|غدا|time
gestern|-|-|yesterday|أمس|time
jetzt|-|-|now|الآن|time
später|-|-|later|لاحقا|time
bald|-|-|soon|قريبا|time
immer|-|-|always|دائما|time
oft|-|-|often|غالبا|time
manchmal|-|-|sometimes|أحيانا|time
nie|-|-|never|أبدا|time
früh|-|-|early|مبكرا|time
spät|-|-|late|متأخرا|time
die Arbeit|die|Arbeiten|work|عمل|work|💼
der Beruf|der|Berufe|profession|مهنة|work|👷
die Firma|die|Firmen|company|شركة|work|🏢
das Unternehmen|das|Unternehmen|company, enterprise|مؤسسة|work|🏢
das Büro|das|Büros|office|مكتب|work|🏢
die Ausbildung|die|Ausbildungen|vocational training|تكوين مهني|work|🛠️
der Azubi|der|Azubis|trainee, apprentice|متدرب|work|🧑‍🔧
die Berufsschule|die|Berufsschulen|vocational school|مدرسة مهنية|work|🏫
die Bewerbung|die|Bewerbungen|job application|طلب توظيف|work|📨
der Lebenslauf|der|Lebensläufe|CV|سيرة ذاتية|work|📄
das Anschreiben|das|Anschreiben|cover letter|رسالة تحفيزية|work|✉️
das Vorstellungsgespräch|das|Vorstellungsgespräche|job interview|مقابلة عمل|work|🤝
das Praktikum|das|Praktika|internship|تدريب|work|🧑‍💻
die Stelle|die|Stellen|position, job|منصب / وظيفة|work|💼
der Vertrag|der|Verträge|contract|عقد|work|📝
das Gehalt|das|Gehälter|salary|راتب|work|💶
die Erfahrung|die|Erfahrungen|experience|خبرة|work|⭐
das Zeugnis|das|Zeugnisse|certificate, report card|شهادة|work|📜
die Kenntnisse|die|PL|knowledge, skills|معارف|work|🧠
das Team|das|Teams|team|فريق|work|👥
die Besprechung|die|Besprechungen|meeting|اجتماع|work|🗣️
die Aufgabe|die|Aufgaben|task|مهمة|work|✅
das Projekt|das|Projekte|project|مشروع|work|📁
der Kunde|der|Kunden|customer (m)|زبون|work|🧑
die Kundin|die|Kundinnen|customer (f)|زبونة|work|👩
die Lösung|die|Lösungen|solution|حل|work|💡
der Computer|der|Computer|computer|حاسوب|it|🖥️
der Laptop|der|Laptops|laptop|حاسوب محمول|it|💻
das Handy|das|Handys|mobile phone|هاتف محمول|it|📱
die App|die|Apps|app|تطبيق|it|📲
die Software|die|-|software|برمجيات|it|💿
das Programm|das|Programme|program|برنامج|it|🧩
die Datenbank|die|Datenbanken|database|قاعدة بيانات|it|🗄️
die Schnittstelle|die|Schnittstellen|interface (API)|واجهة برمجية|it|🔌
der Fehler|der|Fehler|mistake / bug|خطأ|it|🐞
der Server|der|Server|server|خادم|it|🖧
das Netzwerk|das|Netzwerke|network|شبكة|it|🌐
die Daten|die|PL|data|بيانات|it|📊
der Code|der|Codes|code|كود|it|⌨️
die Programmiersprache|die|Programmiersprachen|programming language|لغة برمجة|it|👨‍💻
der Entwickler|der|Entwickler|developer (m)|مطوّر|it|🧑‍💻
die Entwicklerin|die|Entwicklerinnen|developer (f)|مطوّرة|it|👩‍💻
die Webseite|die|Webseiten|web page|صفحة ويب|it|🌐
das Passwort|das|Passwörter|password|كلمة السر|it|🔐
die E-Mail|die|E-Mails|e-mail|بريد إلكتروني|it|📧
die Tastatur|die|Tastaturen|keyboard|لوحة المفاتيح|it|⌨️
der Bildschirm|der|Bildschirme|screen|شاشة|it|🖥️
die Maus|die|Mäuse|mouse|فأرة|it|🖱️
das Gerät|das|Geräte|device|جهاز|it|📟
das Hobby|das|Hobbys|hobby|هواية|free time|🎨
der Sport|der|-|sport|رياضة|free time|🏋️
der Fußball|der|Fußbälle|football|كرة القدم|free time|⚽
das Spiel|das|Spiele|game|لعبة / مباراة|free time|🎲
die Musik|die|-|music|موسيقى|free time|🎵
das Lied|das|Lieder|song|أغنية|free time|🎶
das Buch|das|Bücher|book|كتاب|free time|📕
der Film|der|Filme|film|فيلم|free time|🎬
das Foto|das|Fotos|photo|صورة|free time|📷
die Reise|die|Reisen|journey, trip|رحلة|free time|🧳
das Meer|das|Meere|sea|بحر|free time|🌊
der Strand|der|Strände|beach|شاطئ|free time|🏖️
der Berg|der|Berge|mountain|جبل|free time|⛰️
das Wetter|das|-|weather|طقس|free time|🌦️
die Sonne|die|Sonnen|sun|شمس|free time|☀️
der Regen|der|-|rain|مطر|free time|🌧️
der Schnee|der|-|snow|ثلج|free time|❄️
das Geld|das|-|money|مال|free time|💶
das Land|das|Länder|country|بلد|free time|🗺️
die Sprache|die|Sprachen|language|لغة|free time|🗣️
das Fitnessstudio|das|Fitnessstudios|gym|نادي رياضي|free time|🏋️
die Hose|die|Hosen|trousers|سروال|clothes|👖
das Hemd|das|Hemden|shirt|قميص|clothes|👔
das T-Shirt|das|T-Shirts|T-shirt|تي شيرت|clothes|👕
die Jacke|die|Jacken|jacket|سترة|clothes|🧥
der Mantel|der|Mäntel|coat|معطف|clothes|🧥
der Schuh|der|Schuhe|shoe|حذاء|clothes|👟
das Kleid|das|Kleider|dress|فستان|clothes|👗
der Rock|der|Röcke|skirt|تنورة|clothes|👗
die Socke|die|Socken|sock|جورب|clothes|🧦
der Pullover|der|Pullover|pullover|كنزة|clothes|🧶
die Mütze|die|Mützen|cap, beanie|قبعة|clothes|🧢
die Tasche|die|Taschen|bag / pocket|حقيبة / جيب|clothes|👜
der Hund|der|Hunde|dog|كلب|animals|🐕
die Katze|die|Katzen|cat|قطة|animals|🐈
der Vogel|der|Vögel|bird|طائر|animals|🐦
das Pferd|das|Pferde|horse|حصان|animals|🐎
die Kuh|die|Kühe|cow|بقرة|animals|🐄
das Schaf|das|Schafe|sheep|خروف|animals|🐑
das Tier|das|Tiere|animal|حيوان|animals|🐾
das Ding|das|Dinge|thing|شيء|general|📦
die Frage|die|Fragen|question|سؤال|general|❓
die Antwort|die|Antworten|answer|جواب|general|💬
das Wort|das|Wörter|word|كلمة|general|🔤
der Satz|der|Sätze|sentence|جملة|general|📝
das Problem|das|Probleme|problem|مشكلة|general|⚠️
die Idee|die|Ideen|idea|فكرة|general|💡
der Weg|der|Wege|way, path|طريق|general|🛤️
die Nummer|die|Nummern|number|رقم|general|🔢
die Telefonnummer|die|Telefonnummern|phone number|رقم الهاتف|general|☎️
die Adresse|die|Adressen|address|عنوان|general|📍
der Ausweis|der|Ausweise|ID card|بطاقة الهوية|general|🪪
der Pass|der|Pässe|passport|جواز السفر|general|🛂
das Visum|das|Visa|visa|تأشيرة|general|🛂
das Formular|das|Formulare|form|استمارة|general|📋
der Brief|der|Briefe|letter|رسالة|general|✉️
die Karte|die|Karten|card / map / ticket|بطاقة / خريطة|general|🗺️
das Papier|das|Papiere|paper|ورق|general|📄
der Stift|der|Stifte|pen|قلم|general|🖊️
die Seite|die|Seiten|page / side|صفحة / جانب|general|📄
die Farbe|die|Farben|colour|لون|general|🎨
die Hilfe|die|-|help|مساعدة|general|🆘
die Welt|die|Welten|world|عالم|general|🌍
die Prüfung|die|Prüfungen|exam|امتحان|general|📝
der Kurs|der|Kurse|course|دورة|general|📚
die Übung|die|Übungen|exercise|تمرين|general|🏋️
der Unterricht|der|-|lessons, class|درس / حصة|general|🧑‍🏫
Deutschland|-|-|Germany|ألمانيا|general|🇩🇪
Marokko|-|-|Morocco|المغرب|general|🇲🇦
Deutsch|-|-|German (language)|اللغة الألمانية|general|🇩🇪
Arabisch|-|-|Arabic|اللغة العربية|general|🇲🇦
gut|-|-|good|جيد|adjectives|👍
schlecht|-|-|bad|سيء|adjectives|👎
groß|-|-|big, tall|كبير / طويل|adjectives|🐘
klein|-|-|small|صغير|adjectives|🐭
alt|-|-|old|قديم / كبير في السن|adjectives|👴
neu|-|-|new|جديد|adjectives|✨
jung|-|-|young|شاب|adjectives|🧒
schön|-|-|beautiful, nice|جميل|adjectives|🌸
teuer|-|-|expensive|غالٍ|adjectives|💰
billig|-|-|cheap|رخيص|adjectives|🏷️
warm|-|-|warm|دافئ|adjectives|🌡️
kalt|-|-|cold|بارد|adjectives|🥶
heiß|-|-|hot|حار|adjectives|🔥
schnell|-|-|fast|سريع|adjectives|⚡
langsam|-|-|slow|بطيء|adjectives|🐢
leicht|-|-|easy / light|سهل / خفيف|adjectives|🪶
schwer|-|-|difficult / heavy|صعب / ثقيل|adjectives|🏋️
richtig|-|-|correct|صحيح|adjectives|✅
falsch|-|-|wrong|خاطئ|adjectives|❌
wichtig|-|-|important|مهم|adjectives|❗
müde|-|-|tired|متعب|adjectives|😫
krank|-|-|ill|مريض|adjectives|🤒
gesund|-|-|healthy|بصحة جيدة|adjectives|💪
glücklich|-|-|happy|سعيد|adjectives|😊
traurig|-|-|sad|حزين|adjectives|😢
freundlich|-|-|friendly|لطيف|adjectives|😊
lang|-|-|long|طويل|adjectives|📏
kurz|-|-|short|قصير|adjectives|✂️
laut|-|-|loud|صاخب|adjectives|📢
leise|-|-|quiet|هادئ|adjectives|🤫
sauber|-|-|clean|نظيف|adjectives|🧼
einfach|-|-|simple, easy|بسيط|adjectives|👌
schwierig|-|-|difficult|صعب|adjectives|🧗
interessant|-|-|interesting|مثير للاهتمام|adjectives|🤩
langweilig|-|-|boring|ممل|adjectives|🥱
lecker|-|-|tasty|لذيذ|adjectives|😋
frei|-|-|free, available|حر / شاغر|adjectives|🆓
rot|-|-|red|أحمر|adjectives|🔴
blau|-|-|blue|أزرق|adjectives|🔵
grün|-|-|green|أخضر|adjectives|🟢
gelb|-|-|yellow|أصفر|adjectives|🟡
schwarz|-|-|black|أسود|adjectives|⚫
weiß|-|-|white|أبيض|adjectives|⚪
und|-|-|and|و|function
oder|-|-|or|أو|function
aber|-|-|but|لكن|function
denn|-|-|because (verb 2nd)|لأن|function
weil|-|-|because (verb last)|لأن|function
dass|-|-|that (conjunction)|أنّ|function
wenn|-|-|if / when|إذا / عندما|function
mit|-|-|with|مع|function
ohne|-|-|without|بدون|function
für|-|-|for|من أجل|function
von|-|-|from / of|من|function
nach|-|-|to (cities) / after|إلى / بعد|function
aus|-|-|from (origin)|من|function
bei|-|-|at (someone's) / near|عند|function
hier|-|-|here|هنا|function
dort|-|-|there|هناك|function
sehr|-|-|very|جدا|function
auch|-|-|also|أيضا|function
nur|-|-|only|فقط|function
noch|-|-|still / yet|ما زال|function
schon|-|-|already|بالفعل|function
nicht|-|-|not|لا / ليس|function
kein|-|-|no, not a|لا ... أيّ|function
viel|-|-|much, a lot|كثير|function
wenig|-|-|little|قليل|function
gern|-|-|gladly (likes to)|بكل سرور|function
vielleicht|-|-|maybe|ربما|function
zusammen|-|-|together|معا|function
wer|-|-|who|من|questions
was|-|-|what|ماذا|questions
wo|-|-|where|أين|questions
woher|-|-|where from|من أين|questions
wohin|-|-|where to|إلى أين|questions
wann|-|-|when|متى|questions
wie|-|-|how|كيف|questions
warum|-|-|why|لماذا|questions
wie viel|-|-|how much|كم|questions
links|-|-|left|يسار|city|⬅️
rechts|-|-|right|يمين|city|➡️
geradeaus|-|-|straight on|إلى الأمام مباشرة|city|⬆️
gefallen|-|-|to please (I like)|يُعجِب|verbs|😍
gehören|-|-|to belong to|يخصّ / يملكه|verbs|🏷️
null|-|-|zero|صفر|numbers|0️⃣
eins|-|-|one|واحد|numbers|1️⃣
zwei|-|-|two|اثنان|numbers|2️⃣
drei|-|-|three|ثلاثة|numbers|3️⃣
vier|-|-|four|أربعة|numbers|4️⃣
fünf|-|-|five|خمسة|numbers|5️⃣
sechs|-|-|six|ستة|numbers|6️⃣
sieben|-|-|seven|سبعة|numbers|7️⃣
acht|-|-|eight|ثمانية|numbers|8️⃣
neun|-|-|nine|تسعة|numbers|9️⃣
zehn|-|-|ten|عشرة|numbers|🔟
elf|-|-|eleven|أحد عشر|numbers
zwölf|-|-|twelve|اثنا عشر|numbers
sechzehn|-|-|sixteen|ستة عشر|numbers
siebzehn|-|-|seventeen|سبعة عشر|numbers
zwanzig|-|-|twenty|عشرون|numbers
einundzwanzig|-|-|twenty-one|واحد وعشرون|numbers
dreißig|-|-|thirty|ثلاثون|numbers
hundert|-|-|hundred|مائة|numbers|💯
tausend|-|-|thousand|ألف|numbers
`

export type Article = 'der' | 'die' | 'das' | '-'
export interface Word { id: string; de: string; article: Article; plural: string; en: string; ar: string; topic: string; emoji?: string }

/** Stable id: the German as written (case kept, so "sie" and "Sie" differ), non-letters → "-". */
export const wordId = (de: string) => de.replace(/[^A-Za-z0-9äöüÄÖÜß]+/g, '-').replace(/^-|-$/g, '')

export const WORDS: Word[] = RAW.trim().split('\n').map((line) => {
  const [de, article, plural, en, ar, topic, emoji] = line.split('|').map((s) => s.trim())
  return { id: wordId(de), de, article: article as Article, plural, en, ar, topic, emoji: emoji || undefined }
})

/** Nouns with a grammatical gender in the singular (plural-only nouns excluded). */
export const NOUNS = WORDS.filter((w) => w.article !== '-' && w.plural !== 'PL')
export const bare = (w: Word) => (w.article === '-' ? w.de : w.de.replace(/^(der|die|das) /, ''))
export const pluralOf = (w: Word) => (w.article === '-' || w.plural === '-' ? '' : w.plural === 'PL' ? 'plural only' : `die ${w.plural}`)
export const TOPICS = Array.from(new Set(WORDS.map((w) => w.topic)))
export const ARTICLE_COLOR: Record<string, string> = { der: 'text-majorelle', die: 'text-terra', das: 'text-zellige' }

const TOPIC_EMOJI: Record<string, string> = { greetings: '👋', pronouns: '👤', verbs: '🏃', people: '🧑', family: '👨‍👩‍👧', body: '🫀', home: '🏠', food: '🍽️', city: '🏙️', time: '🕒', work: '💼', it: '💻', 'free time': '🎈', clothes: '👕', animals: '🐾', general: '🔤', adjectives: '🎨', function: '🔗', questions: '❓', numbers: '🔢' }
export const emojiFor = (w: Word) => w.emoji ?? TOPIC_EMOJI[w.topic] ?? '🔤'
