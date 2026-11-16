from common import *

L = []

# 13 ----------------------------------------------------------------- Familie + Possessiv
L.append(dict(id='family', order=13, level='A1', title=T('العائلة وضمائر الملكية', 'Family and possessives'), titleDe='Meine Familie', minutes=30,
  summary=T('أفراد العائلة، و mein / dein / sein / ihr / unser، وكيف تتحدث عن عائلتك.', 'Family members, mein / dein / sein / ihr / unser, and talking about your family.'),
  resources=['shehata', 'easygerman'], videos=['4wvtNkoLyNY', 'xLayY7zy6yM', 'o-Zu-bUlPb4'],
  blocks=[
    text('ضمائر الملكية تأتي **قبل** الاسم (عكس العربية: كتابِي = **mein** Buch) وتأخذ نهاية **ein**: **mein** Vater، **meine** Mutter، **mein** Kind، **meine** Eltern.\n\nانتبه: **sein** = له (هو)، **ihr** = لها (هي) أو لهم: sein Bruder = أخوه، ihr Bruder = أخوها.',
         'Possessives come **before** the noun and take the **ein** endings: **mein** Vater, **meine** Mutter, **mein** Kind, **meine** Eltern.\n\nCareful: **sein** = his, **ihr** = her or their: sein Bruder = his brother, ihr Bruder = her brother.'),
    table([T('الضمير', 'Pronoun'), T('الملكية', 'Possessive'), 'der / das', 'die / Plural'], [
      ['ich', T('ـي', 'my'), 'mein', 'meine'], ['du', T('ـكَ', 'your'), 'dein', 'deine'], ['er / es', T('ـه', 'his / its'), 'sein', 'seine'],
      ['sie', T('ـها', 'her'), 'ihr', 'ihre'], ['wir', T('ـنا', 'our'), 'unser', 'unsere'], ['ihr', T('ـكم', 'your (pl.)'), 'euer', 'eure'], ['sie / Sie', T('ـهم / حضرتك', 'their / your (formal)'), 'ihr / Ihr', 'ihre / Ihre']]),
    examples(
      ex('Das ist meine Familie.', 'هذه عائلتي.', 'This is my family.', 'Hadi l3a2ila dyali.'),
      ex('Mein Vater heißt Ahmed.', 'اسم أبي أحمد.', 'My father is called Ahmed.'),
      ex('Meine Mutter arbeitet als Lehrerin.', 'أمي تعمل معلمة.', 'My mother works as a teacher.'),
      ex('Ich habe zwei Geschwister.', 'عندي أخ وأخت (إخوة).', 'I have two siblings.'),
      ex('Mein Bruder ist älter als ich.', 'أخي أكبر مني.', 'My brother is older than me.'),
      ex('Wie heißt deine Schwester?', 'ما اسم أختك؟', "What's your sister's name?"),
      ex('Meine Eltern wohnen in Fès.', 'والداي يسكنان في فاس.', 'My parents live in Fes.')),
    tip('**die Geschwister** = الإخوة والأخوات معًا (لا مفرد شائع). **die Eltern** = الوالدان (جمع فقط). وفي امتحان A1 Sprechen سيُطلب منك غالبًا الحديث عن عائلتك.',
        '**die Geschwister** = brothers and sisters together. **die Eltern** = parents (plural only). The A1 speaking exam often asks about your family.'),
  ],
  vocab=['der-Vater', 'die-Mutter', 'der-Bruder', 'die-Schwester', 'die-Eltern', 'die-Familie'],
  exercises=[
    fill('Das ist ___ Mutter. (ich)', ['meine']), fill('Wie heißt ___ Vater? (du)', ['dein']), fill('Sara und ___ Bruder wohnen in Rabat. (sie, f.)', ['ihr']),
    fill('Ahmed und ___ Schwester lernen Deutsch. (er)', ['seine']), fill('Das sind ___ Eltern. (wir)', ['unsere']),
    mc(T('«أخوها» =', '"her brother" ='), ['ihr Bruder', 'sein Bruder', 'ihre Bruder', 'seine Bruder'], 'ihr Bruder'),
    order(T('هذه عائلتي.', 'This is my family.'), ['Das', 'ist', 'meine', 'Familie', '.'], ['Das ist meine Familie .', 'Das ist meine Familie.']),
    write(T('اكتب 5 جمل عن عائلتك: الأسماء، الأعمار، المدن، المهن.', 'Write 5 sentences about your family: names, ages, cities, jobs.'), 25,
      [T('mein / meine صحيحة حسب الجنس', 'mein / meine matching the gender'), T('رقم أو عمر (… ist … Jahre alt)', 'an age (… ist … Jahre alt)'), T('مدينة (wohnt in …)', 'a city (wohnt in …)'), T('مهنة بدون أداة', 'a job without article'), T('الفعل في الموضع الثاني دائمًا', 'verb always in position 2')],
      'Meine Familie wohnt in Marokko. Mein Vater heißt Ahmed und ist 55 Jahre alt. Er ist Taxifahrer. Meine Mutter heißt Fatima, sie ist Lehrerin. Ich habe zwei Geschwister: Mein Bruder studiert in Rabat und meine Schwester geht noch zur Schule.'),
  ]))

# 14 ----------------------------------------------------------------- Essen + Einkaufen
L.append(dict(id='food', order=14, level='A1', title=T('الطعام والتسوق', 'Food and shopping'), titleDe='Essen und Einkaufen', minutes=30,
  summary=T('اطلب في المقهى، اشترِ في السوبرماركت، وتحدث عمّا تحب: möchten، gern، es gibt.', 'Order in a café, shop in a supermarket, say what you like: möchten, gern, es gibt.'),
  resources=['shehata', 'nicosweg'], videos=['Oxii0wFbhSo', 'aZTUJm8O2Ds'],
  blocks=[
    text('ثلاث أدوات بسيطة تكفي للمطعم والسوق:\n\n- **Ich möchte** + أكوزاتيف: Ich möchte **einen** Tee. (أريد بأدب)\n- **gern** = أحب: Ich esse **gern** Couscous. / Ich trinke **nicht gern** Bier.\n- **Es gibt** + أكوزاتيف = يوجد: Es gibt **einen** Markt hier.',
         'Three tools cover cafés and shops:\n\n- **Ich möchte** + accusative: Ich möchte **einen** Tee. (polite "I would like")\n- **gern** = like doing: Ich esse **gern** Couscous.\n- **Es gibt** + accusative = there is: Es gibt **einen** Markt hier.'),
    examples(
      ex('Ich möchte einen Tee, bitte.', 'أريد شايًا من فضلك.', "I'd like a tea, please.", 'Bghit wa7d atay 3afak.'),
      ex('Was kostet ein Kilo Tomaten?', 'بكم كيلو الطماطم؟', 'How much is a kilo of tomatoes?', 'Bch7al kilo dyal maticha?'),
      ex('Ich esse gern Couscous.', 'أحب أكل الكسكس.', 'I like eating couscous.'),
      ex('Ich esse kein Schweinefleisch.', 'لا آكل لحم الخنزير.', "I don't eat pork."),
      ex('Haben Sie Brot ohne Ei?', 'هل عندكم خبز بدون بيض؟', 'Do you have bread without egg?'),
      ex('Die Rechnung, bitte.', 'الحساب من فضلك.', 'The bill, please.'),
      ex('Zusammen oder getrennt?', 'معًا أم كل واحد وحده؟', 'Together or separately?')),
    tip('في ألمانيا يسألك النادل غالبًا **Zusammen oder getrennt?** (هل تدفعون معًا أم كلٌّ وحده؟). وإذا لم تأكل لحم الخنزير، ابحث عن **Schwein** في القائمة، و**halal** معروفة في المدن الكبيرة.',
        'In Germany waiters often ask **Zusammen oder getrennt?** (pay together or separately?). If you avoid pork, look for **Schwein** on the menu.'),
  ],
  vocab=['das-Brot', 'der-Tee', 'das-Wasser', 'der-Apfel', 'das-Fleisch', 'die-Rechnung'],
  exercises=[
    mc(T('في المقهى، بأدب:', 'In a café, politely:'), ['Ich möchte einen Kaffee, bitte.', 'Ich will Kaffee!', 'Gib Kaffee.', 'Kaffee ich möchte.'], 'Ich möchte einen Kaffee, bitte.'),
    fill('Ich esse ___ Pizza. (أحب)', ['gern', 'gerne']),
    fill('Es ___ einen Supermarkt hier.', ['gibt']),
    fill('Die ___, bitte! (الحساب)', ['Rechnung']),
    listen('Ein Kilo Äpfel kostet zwei Euro fünfzig.', T('كيلو التفاح بـ 2.50 يورو.', 'A kilo of apples costs 2.50 euros.'), ['2,50 €', '2,15 €', '5,20 €', '12,50 €'], '2,50 €', T('كم سعر التفاح؟', 'How much are the apples?')),
    order(T('هل عندكم خبز بدون بيض؟', 'Do you have bread without egg?'), ['Haben', 'Sie', 'Brot', 'ohne', 'Ei', '?'], ['Haben Sie Brot ohne Ei ?', 'Haben Sie Brot ohne Ei?']),
    translate(T('لا آكل لحم الخنزير.', "I don't eat pork."), ['Ich esse kein Schweinefleisch.', 'Ich esse kein Schweinefleisch']),
  ]))

# 15 ----------------------------------------------------------------- Stadt + Weg + Dativ-Präpositionen (Einstieg)
L.append(dict(id='city', order=15, level='A1', title=T('في المدينة: الطريق والمواصلات', 'In the city: directions and transport'), titleDe='In der Stadt', minutes=35,
  summary=T('اسأل عن الطريق، افهم links/rechts/geradeaus، وتنقّل بـ mit dem Bus / mit der U-Bahn (مدخل إلى الداتيف).', 'Ask the way, understand links/rechts/geradeaus, and travel mit dem Bus / mit der U-Bahn (intro to the dative).'),
  resources=['nicosweg', 'easygerman'], videos=['WGYZtuE3uu4', '5mr-oFRZOhI', 'OV-YbBgwaj8', 'GT6ZDpB_7rA'],
  blocks=[
    text('بعد **mit** (بـ / مع) و**zu** (إلى) تأتي **حالة الداتيف**: der/das → **dem**، die → **der**. احفظها الآن كعبارات جاهزة:\n\n- mit **dem** Bus، mit **dem** Auto، mit **der** U-Bahn، mit **der** Bahn\n- zu**m** Bahnhof (= zu dem)، zu**r** Post (= zu der)\n- **zu Fuß** = مشيًا على الأقدام',
         'After **mit** (by / with) and **zu** (to) comes the **dative**: der/das → **dem**, die → **der**. Learn them as chunks now:\n\n- mit **dem** Bus, mit **dem** Auto, mit **der** U-Bahn, mit **der** Bahn\n- zu**m** Bahnhof (= zu dem), zu**r** Post (= zu der)\n- **zu Fuß** = on foot'),
    examples(
      ex('Entschuldigung, wo ist der Bahnhof?', 'عذرًا، أين محطة القطار؟', 'Excuse me, where is the train station?', 'Smeh lia, fin kayna lagar?'),
      ex('Gehen Sie geradeaus und dann links.', 'امشِ مستقيمًا ثم يسارًا.', 'Go straight on and then left.', 'Sir nichan w mn b3d 3la liser.'),
      ex('Die Apotheke ist neben der Bank.', 'الصيدلية بجانب البنك.', 'The pharmacy is next to the bank.'),
      ex('Ich fahre mit dem Bus zur Arbeit.', 'أذهب إلى العمل بالحافلة.', 'I take the bus to work.'),
      ex('Wie komme ich zum Rathaus?', 'كيف أصل إلى البلدية؟', 'How do I get to the town hall?'),
      ex('Ist das weit von hier?', 'هل هذا بعيد من هنا؟', 'Is that far from here?', 'Wach b3id mn hna?'),
      ex('Nehmen Sie die U-Bahn Linie zwei.', 'خذ خط المترو رقم اثنين.', 'Take underground line two.')),
    tip('**rechts** = يمين، **links** = يسار، **geradeaus** = مستقيمًا، **die erste Straße rechts** = أول شارع على اليمين. وفي ألمانيا ستحتاج كثيرًا: **das Bürgeramt** (مكتب المواطنين) للتسجيل (**Anmeldung**).',
        '**rechts** = right, **links** = left, **geradeaus** = straight on, **die erste Straße rechts** = first street on the right. In Germany you will need **das Bürgeramt** for your registration (**Anmeldung**).'),
  ],
  vocab=['der-Bahnhof', 'die-Straße', 'die-Apotheke', 'die-Bank', 'die-U-Bahn', 'links', 'rechts'],
  exercises=[
    mc(T('«امشِ مستقيمًا» =', '"Go straight on" ='), ['Gehen Sie geradeaus.', 'Gehen Sie links.', 'Gehen Sie zurück.', 'Gehen Sie rechts.'], 'Gehen Sie geradeaus.'),
    fill('Ich fahre mit ___ Bus. (der)', ['dem']), fill('Ich fahre mit ___ U-Bahn. (die)', ['der']),
    fill('Wie komme ich ___ Bahnhof? (zu + dem)', ['zum']),
    listen('Gehen Sie die zweite Straße rechts.', T('خذ الشارع الثاني على اليمين.', 'Take the second street on the right.'), ['2. Straße rechts', '2. Straße links', '1. Straße rechts', 'geradeaus'], '2. Straße rechts', T('إلى أين؟', 'Which way?')),
    order(T('عذرًا، أين محطة القطار؟', 'Excuse me, where is the station?'), ['Entschuldigung', ',', 'wo', 'ist', 'der', 'Bahnhof', '?'], ['Entschuldigung , wo ist der Bahnhof ?', 'Entschuldigung, wo ist der Bahnhof?']),
    translate(T('هل هذا بعيد من هنا؟', 'Is that far from here?'), ['Ist das weit von hier?', 'Ist es weit von hier?']),
  ]))

# 16 ----------------------------------------------------------------- Tagesablauf + trennbare Verben
L.append(dict(id='routine', order=16, level='A1', title=T('يومي والأفعال المنفصلة', 'My day and separable verbs'), titleDe='Mein Tag · trennbare Verben', minutes=35,
  summary=T('aufstehen, anfangen, einkaufen, fernsehen: البادئة تنفصل وتذهب إلى آخر الجملة.', 'aufstehen, anfangen, einkaufen, fernsehen: the prefix splits off and goes to the end.'),
  resources=['shehata', 'easygerman'], videos=['cFAL6PhExPU', 'sLiDDoNPEX8', 'pCw0kXIZ1xI'],
  blocks=[
    text('بعض الأفعال لها **بادئة** (an, auf, aus, ein, mit, zu, fern …). في الجملة **تنفصل البادئة** وتذهب إلى **آخر الجملة**، والفعل يبقى في الموضع الثاني:\n\n- **auf**stehen → Ich **stehe** um 7 Uhr **auf**.\n- **ein**kaufen → Am Samstag **kaufe** ich **ein**.\n- **an**fangen → Der Kurs **fängt** um 9 Uhr **an**.\n\nتخيّل الجملة كـ **«قوس»**: الفعل يفتح والبادئة تغلق.',
         'Some verbs have a **prefix** (an, auf, aus, ein, mit, zu, fern …). In a sentence the **prefix splits off** and goes to the **end**, while the verb stays in position 2:\n\n- **auf**stehen → Ich **stehe** um 7 Uhr **auf**.\n- **ein**kaufen → Am Samstag **kaufe** ich **ein**.\n- **an**fangen → Der Kurs **fängt** um 9 Uhr **an**.\n\nThink of a **bracket**: the verb opens, the prefix closes.'),
    examples(
      ex('Ich stehe um sechs Uhr auf.', 'أستيقظ في الساعة السادسة.', 'I get up at six.', 'Kannod m3a 6.'),
      ex('Der Kurs fängt um neun Uhr an.', 'تبدأ الدورة في التاسعة.', 'The course starts at nine.'),
      ex('Am Samstag kaufe ich ein.', 'يوم السبت أتسوّق.', 'On Saturday I go shopping.'),
      ex('Am Abend sehe ich fern.', 'في المساء أشاهد التلفاز.', 'In the evening I watch TV.'),
      ex('Ich rufe dich morgen an.', 'سأتصل بك غدًا.', "I'll call you tomorrow."),
      ex('Kommst du mit?', 'هل تأتي معنا؟', 'Are you coming along?', 'Wach ghadi tji m3ana?')),
    tip('اكتب يومك كل مساء في 5 جمل بهذه الأفعال: aufstehen، frühstücken، anfangen، einkaufen، fernsehen، einschlafen. هذا تمرين الكتابة اليومي لهذا الأسبوع.',
        'Each evening write your day in 5 sentences with these verbs: aufstehen, frühstücken, anfangen, einkaufen, fernsehen, einschlafen. That is this week\'s daily writing drill.'),
  ],
  vocab=['aufstehen', 'anfangen', 'einkaufen', 'fernsehen', 'anrufen', 'das-Frühstück'],
  exercises=[
    order(T('أستيقظ في الساعة السابعة.', 'I get up at seven.'), ['Ich', 'stehe', 'um', 'sieben', 'Uhr', 'auf', '.'], ['Ich stehe um sieben Uhr auf .', 'Ich stehe um sieben Uhr auf.', 'Um sieben Uhr stehe ich auf .', 'Um sieben Uhr stehe ich auf.']),
    order(T('يوم السبت أتسوّق.', 'On Saturday I go shopping.'), ['Am', 'Samstag', 'kaufe', 'ich', 'ein', '.'], ['Am Samstag kaufe ich ein .', 'Am Samstag kaufe ich ein.']),
    fill('Der Film ___ um 20 Uhr an. (anfangen)', ['fängt']),
    fill('Ich rufe dich morgen ___. (anrufen)', ['an']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Am Abend sehe ich fern.', 'Am Abend fernsehe ich.', 'Am Abend ich sehe fern.', 'Am Abend sehe fern ich.'], 'Am Abend sehe ich fern.'),
    translate(T('هل تأتي معنا؟', 'Are you coming along?'), ['Kommst du mit?', 'Kommst du mit']),
    write(T('صف يومك العادي في 6 جمل باستعمال 3 أفعال منفصلة على الأقل.', 'Describe your normal day in 6 sentences with at least 3 separable verbs.'), 35,
      [T('الوقت مع um', 'times with um'), T('3 أفعال منفصلة والبادئة في آخر الجملة', '3 separable verbs, prefix at the end'), T('جملة تبدأ بالوقت (Dann / Am Abend …) والفعل ثانيًا', 'a sentence starting with time, verb second'), T('dann / danach للربط', 'dann / danach to link')],
      'Ich stehe um sechs Uhr auf. Dann frühstücke ich und trinke einen Tee. Um acht Uhr fange ich mit der Arbeit an. Am Nachmittag kaufe ich ein. Am Abend lerne ich zwei Stunden Deutsch. Danach sehe ich ein bisschen fern und gehe um elf Uhr schlafen.'),
  ]))

# 17 ----------------------------------------------------------------- Modalverben
L.append(dict(id='modals', order=17, level='A1', title=T('الأفعال الناقصة: können, müssen, wollen', 'Modal verbs: können, müssen, wollen'), titleDe='Die Modalverben', minutes=35,
  summary=T('أستطيع، يجب، أريد، مسموح: الفعل الناقص ثانيًا والفعل الأساسي في آخر الجملة بالمصدر.', 'Can, must, want, may: the modal is second and the main verb goes to the end as an infinitive.'),
  resources=['shehata', 'easygerman'], videos=['lGpQPC_qh3o', 'H_jAPCKbZ_4', '6CiH-RP_MtQ', 'QBBlMrj0lTw'],
  blocks=[
    text('القوس مرة أخرى: **الفعل الناقص** في الموضع الثاني، و**المصدر** في آخر الجملة:\n\n- Ich **kann** gut Deutsch **sprechen**.\n- Ich **muss** heute **arbeiten**.\n- Ich **möchte** in Deutschland eine Ausbildung **machen**.\n\nلاحظ: مع ich و er/sie/es **نفس الشكل** وبدون نهاية: ich kann، er kann.',
         'The bracket again: the **modal** in position 2, the **infinitive** at the end:\n\n- Ich **kann** gut Deutsch **sprechen**.\n- Ich **muss** heute **arbeiten**.\n- Ich **möchte** in Deutschland eine Ausbildung **machen**.\n\nNote: ich and er/sie/es have **the same form** with no ending: ich kann, er kann.'),
    table(['', 'können', 'müssen', 'wollen', 'dürfen', 'möchten'], [
      ['ich', 'kann', 'muss', 'will', 'darf', 'möchte'], ['du', 'kannst', 'musst', 'willst', 'darfst', 'möchtest'], ['er / sie / es', 'kann', 'muss', 'will', 'darf', 'möchte'],
      ['wir / sie / Sie', 'können', 'müssen', 'wollen', 'dürfen', 'möchten'], ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'möchtet']]),
    examples(
      ex('Ich kann gut programmieren.', 'أستطيع البرمجة جيدًا.', 'I can program well.', 'Kan9der nprogrammi mzyan.'),
      ex('Ich muss heute lernen.', 'يجب أن أدرس اليوم.', 'I have to study today.', 'Khasni n9ra lyoum.'),
      ex('Ich will Fachinformatiker werden.', 'أريد أن أصبح أخصائي معلوماتية.', 'I want to become an IT specialist.'),
      ex('Darf ich hier rauchen?', 'هل مسموح لي أن أدخن هنا؟', 'May I smoke here?'),
      ex('Kannst du mir helfen?', 'هل يمكنك مساعدتي؟', 'Can you help me?', 'Wach t9der t3awnni?'),
      ex('Wir müssen um acht Uhr da sein.', 'يجب أن نكون هناك في الثامنة.', 'We have to be there at eight.')),
    tip('**wollen** = أريد (بقوة) و**möchten** = أودّ (بأدب). في رسائل الشركات ومقابلة العمل استعمل **möchten**: Ich **möchte** mich um einen Ausbildungsplatz bewerben.',
        '**wollen** = want (strong) and **möchten** = would like (polite). In applications and interviews use **möchten**: Ich **möchte** mich um einen Ausbildungsplatz bewerben.'),
  ],
  vocab=['können', 'müssen', 'wollen', 'dürfen', 'helfen'],
  exercises=[
    fill('Ich ___ gut programmieren. (können)', ['kann']), fill('Du ___ heute lernen. (müssen)', ['musst']), fill('___ ich hier parken? (dürfen)', ['Darf']),
    order(T('أريد أن أعمل في ألمانيا.', 'I want to work in Germany.'), ['Ich', 'will', 'in', 'Deutschland', 'arbeiten', '.'], ['Ich will in Deutschland arbeiten .', 'Ich will in Deutschland arbeiten.']),
    order(T('هل يمكنك مساعدتي؟', 'Can you help me?'), ['Kannst', 'du', 'mir', 'helfen', '?'], ['Kannst du mir helfen ?', 'Kannst du mir helfen?']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Ich muss morgen arbeiten.', 'Ich muss arbeiten morgen.', 'Ich arbeiten muss morgen.', 'Ich muss morgen arbeite.'], 'Ich muss morgen arbeiten.'),
    translate(T('يجب أن أدرس اليوم.', 'I have to study today.'), ['Ich muss heute lernen.', 'Heute muss ich lernen.', 'Ich muss heute studieren.']),
  ]))

# 18 ----------------------------------------------------------------- Perfekt
L.append(dict(id='perfekt', order=18, level='A1', title=T('الماضي التام: Perfekt', 'Talking about the past: Perfekt'), titleDe='Das Perfekt', minutes=40,
  summary=T('haben/sein + التصريف الثالث (gemacht, gegangen): الطريقة التي يتكلم بها الألمان عن الماضي.', 'haben/sein + past participle (gemacht, gegangen): how Germans talk about the past.'),
  resources=['shehata', 'easygerman'], videos=['e1O9HdP2CSU', 'T75R4aB4DTg', 'Ou5V8H_Yy14', 'hTvyNDDhG2M'],
  blocks=[
    text('في الكلام اليومي يستعمل الألمان **Perfekt** للماضي: **haben** أو **sein** في الموضع الثاني + **Partizip II** في آخر الجملة.\n\n- الأفعال المنتظمة: **ge** + الجذر + **t**: machen → **gemacht**، lernen → **gelernt**، arbeiten → **gearbeitet**\n- الأفعال الشاذة: **ge** + … + **en**، تُحفظ: sehen → **gesehen**، essen → **gegessen**، schreiben → **geschrieben**\n- الأفعال المنفصلة: ge في الوسط: einkaufen → ein**ge**kauft\n- الأفعال المنتهية بـ -ieren بدون ge: studieren → **studiert**',
         'In everyday speech Germans use the **Perfekt** for the past: **haben** or **sein** in position 2 + **Partizip II** at the end.\n\n- Regular verbs: **ge** + stem + **t**: machen → **gemacht**, lernen → **gelernt**, arbeiten → **gearbeitet**\n- Irregular verbs: **ge** + … + **en**, memorise: sehen → **gesehen**, essen → **gegessen**, schreiben → **geschrieben**\n- Separable verbs: ge in the middle: einkaufen → ein**ge**kauft\n- Verbs in -ieren have no ge: studieren → **studiert**'),
    tip('**sein** بدل haben مع أفعال **الحركة من مكان إلى مكان** وتغيّر الحال: gehen → ich **bin** gegangen، fahren → ich **bin** gefahren، kommen → ich **bin** gekommen، fliegen، aufstehen → ich **bin** aufgestanden. وأيضًا: ich **bin** gewesen، es **ist** passiert.',
        '**sein** instead of haben with **movement from A to B** and change of state: gehen → ich **bin** gegangen, fahren → ich **bin** gefahren, kommen → ich **bin** gekommen, fliegen, aufstehen. Also: ich **bin** gewesen, es **ist** passiert.'),
    examples(
      ex('Ich habe gestern Deutsch gelernt.', 'تعلمت الألمانية أمس.', 'I studied German yesterday.', 'Lbare7 9rit l2almaniya.'),
      ex('Wir haben Couscous gegessen.', 'أكلنا الكسكس.', 'We ate couscous.'),
      ex('Ich bin nach Rabat gefahren.', 'ذهبت (بالسيارة) إلى الرباط.', 'I went to Rabat.'),
      ex('Hast du den Film gesehen?', 'هل شاهدت الفيلم؟', 'Did you see the film?'),
      ex('Am Wochenende habe ich eingekauft.', 'في عطلة الأسبوع تسوّقت.', 'At the weekend I went shopping.'),
      ex('Ich habe zwei Jahre Informatik studiert.', 'درست المعلوميات سنتين.', 'I studied computer science for two years.'),
      ex('Er ist um sieben Uhr aufgestanden.', 'استيقظ في السابعة.', 'He got up at seven.')),
  ],
  vocab=['gestern', 'machen', 'lernen', 'gehen', 'sehen', 'schreiben'],
  exercises=[
    fill('Ich habe gestern Deutsch ___. (lernen)', ['gelernt']), fill('Wir ___ nach Berlin gefahren.', ['sind']), fill('Hast du den Brief ___? (schreiben)', ['geschrieben']),
    fill('Sie hat Informatik ___. (studieren)', ['studiert']), fill('Ich ___ um 6 Uhr aufgestanden.', ['bin']),
    mc(T('اختر الجملة الصحيحة.', 'Choose the correct sentence.'), ['Ich bin nach Hause gegangen.', 'Ich habe nach Hause gegangen.', 'Ich bin nach Hause gegeht.', 'Ich gegangen nach Hause.'], 'Ich bin nach Hause gegangen.'),
    order(T('ماذا فعلت في عطلة الأسبوع؟', 'What did you do at the weekend?'), ['Was', 'hast', 'du', 'am', 'Wochenende', 'gemacht', '?'], ['Was hast du am Wochenende gemacht ?', 'Was hast du am Wochenende gemacht?']),
    translate(T('تعلمت الألمانية أمس.', 'I studied German yesterday.'), ['Ich habe gestern Deutsch gelernt.', 'Gestern habe ich Deutsch gelernt.']),
    write(T('اكتب 6 جمل عن عطلة نهاية الأسبوع الماضية بالـ Perfekt (مع haben و sein).', 'Write 6 sentences about last weekend in the Perfekt (with haben and sein).'), 35,
      [T('3 أفعال مع haben', '3 verbs with haben'), T('فعلان مع sein (حركة)', '2 verbs with sein (movement)'), T('Partizip في آخر الجملة', 'participle at the end'), T('كلمات زمن: am Samstag, dann, danach', 'time words: am Samstag, dann, danach')],
      'Am Samstag bin ich früh aufgestanden. Ich habe gefrühstückt und dann zwei Stunden Deutsch gelernt. Am Nachmittag bin ich mit meinem Bruder in die Stadt gefahren. Wir haben eingekauft und Tee getrunken. Am Sonntag habe ich meine Eltern besucht. Am Abend habe ich einen Film auf Deutsch gesehen.'),
  ]))
