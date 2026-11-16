from common import *

L = []

# 7 ------------------------------------------------------------------ Präsens
L.append(dict(id='present', order=7, level='A1', title=T('المضارع: تصريف الأفعال', 'Present tense: conjugating verbs'), titleDe='Das Präsens', minutes=35,
  summary=T('النهايات -e, -st, -t, -en، والأفعال التي يتغير حرفها المتحرك (fahren → du fährst).', 'The endings -e, -st, -t, -en and stem-changing verbs (fahren → du fährst).'),
  resources=['shehata', 'lingoni', 'verbformen'], videos=['CxPWSjxfpBE', '5lykk9bxRDQ', 'GDLwaO3WfjM', 'fVr8sZ9Q5nQ'],
  blocks=[
    text('كل فعل ألماني له **مصدر** ينتهي غالبًا بـ **-en**: **lernen** (يتعلم). احذف **-en** فيبقى **الجذر** (lern-)، ثم أضف النهاية حسب الضمير. المضارع الألماني يعني «الآن» و«عادةً» و«في المستقبل القريب»: Ich lerne morgen = سأتعلم غدًا.',
         'Every German verb has an **infinitive**, usually ending in **-en**: **lernen**. Remove **-en** to get the **stem** (lern-) and add the ending for the pronoun. The present covers "now", "usually" and "soon": Ich lerne morgen = I will study tomorrow.'),
    table([T('الضمير', 'Pronoun'), T('النهاية', 'Ending'), 'lernen', 'arbeiten', 'fahren*'], [
      ['ich', '-e', 'lerne', 'arbeite', 'fahre'], ['du', '-st', 'lernst', 'arbeitest', 'fährst'], ['er / sie / es', '-t', 'lernt', 'arbeitet', 'fährt'],
      ['wir', '-en', 'lernen', 'arbeiten', 'fahren'], ['ihr', '-t', 'lernt', 'arbeitet', 'fahrt'], ['sie / Sie', '-en', 'lernen', 'arbeiten', 'fahren']]),
    tip('* بعض الأفعال الشائعة تغيّر حرفها المتحرك **فقط مع du و er/sie/es**: fahren → du **fä**hrst، sprechen → du spr**i**chst، lesen → du l**ie**st، essen → du **i**sst، nehmen → du n**imm**st، sehen → du s**ie**hst. وإذا انتهى الجذر بـ **t** أو **d** نضيف **e**: du arbeit**e**st.',
        '* Some common verbs change their vowel **only with du and er/sie/es**: fahren → du **fä**hrst, sprechen → du spr**i**chst, lesen → du l**ie**st, essen → du **i**sst, nehmen → du n**imm**st, sehen → du s**ie**hst. If the stem ends in **t** or **d**, add **e**: du arbeit**e**st.'),
    examples(
      ex('Ich lerne jeden Tag Deutsch.', 'أتعلم الألمانية كل يوم.', 'I learn German every day.', 'Kant3llem l2almaniya kol nhar.'),
      ex('Du sprichst gut Deutsch.', 'أنت تتكلم الألمانية جيدًا.', 'You speak German well.'),
      ex('Er arbeitet in Berlin.', 'هو يعمل في برلين.', 'He works in Berlin.'),
      ex('Wir wohnen in Rabat.', 'نحن نسكن في الرباط.', 'We live in Rabat.'),
      ex('Sie fährt mit dem Bus.', 'هي تركب الحافلة.', 'She goes by bus.'),
      ex('Liest du gern?', 'هل تحب القراءة؟', 'Do you like reading?'),
      ex('Was machst du heute?', 'ماذا تفعل اليوم؟', 'What are you doing today?', 'Achnu ghadi dir lyoum?')),
  ],
  vocab=['lernen', 'arbeiten', 'wohnen', 'machen', 'sprechen', 'fahren', 'lesen', 'essen'],
  exercises=[
    fill('Ich ___ Deutsch. (lernen)', ['lerne']), fill('Du ___ in Berlin. (wohnen)', ['wohnst']), fill('Er ___ viel. (arbeiten)', ['arbeitet']),
    fill('Du ___ gut Deutsch. (sprechen)', ['sprichst'], T('فعل يتغير حرفه: e → i', 'stem change e → i')),
    fill('Sie ___ nach Hamburg. (fahren)', ['fährt'], T('a → ä', 'a → ä')),
    fill('Wir ___ Pizza. (essen)', ['essen']),
    mc(T('اختر التصريف الصحيح: du + lesen', 'Pick the correct form: du + lesen'), ['liest', 'lest', 'lesst', 'lesen'], 'liest'),
    order(T('ماذا تفعل اليوم؟', 'What are you doing today?'), ['Was', 'machst', 'du', 'heute', '?'], ['Was machst du heute ?', 'Was machst du heute?']),
    translate(T('هو يعمل في برلين.', 'He works in Berlin.'), ['Er arbeitet in Berlin.', 'Er arbeitet in Berlin']),
  ]))

# 8 ------------------------------------------------------------------ Satzbau + W-Fragen
L.append(dict(id='wordorder', order=8, level='A1', title=T('ترتيب الجملة وأسئلة W', 'Word order and W-questions'), titleDe='Verb auf Position 2 · W-Fragen', minutes=35,
  summary=T('القاعدة الأهم في الألمانية: الفعل في المكان الثاني. وكلمات السؤال wer, was, wo, woher, wann, wie, warum.', 'The most important rule in German: the verb is in position 2. Plus the question words wer, was, wo, woher, wann, wie, warum.'),
  resources=['shehata', 'lingoni'], videos=['RqpdgksdR74', 'XlW6dFxJUvQ', 'pqnYBp5dmYo', 'cCEnhEDLmIk'],
  blocks=[
    text('في الجملة الخبرية الألمانية **الفعل المُصرَّف دائمًا في الموضع الثاني**. إذا بدأت الجملة بكلمة غير الفاعل (مثل الوقت **heute**)، ينتقل الفاعل إلى ما بعد الفعل:\n\n- **Ich** lerne heute Deutsch.\n- **Heute** lerne ich Deutsch.\n- **In Berlin** wohnt mein Bruder.\n\nالعربية تسمح بـ «اليوم أنا أتعلم»، أما الألمانية فلا: ~~Heute ich lerne~~ خطأ.',
         'In a German statement **the conjugated verb is always in position 2**. If the sentence starts with something other than the subject (like **heute**), the subject moves after the verb:\n\n- **Ich** lerne heute Deutsch.\n- **Heute** lerne ich Deutsch.\n- **In Berlin** wohnt mein Bruder.\n\n~~Heute ich lerne~~ is wrong.'),
    table([T('كلمة السؤال', 'Question word'), T('المعنى', 'Meaning'), T('مثال', 'Example')], [
      ['wer', T('مَن', 'who'), 'Wer ist das?'], ['was', T('ماذا / ما', 'what'), 'Was machst du?'], ['wo', T('أين', 'where'), 'Wo wohnst du?'],
      ['woher', T('من أين', 'where from'), 'Woher kommst du?'], ['wohin', T('إلى أين', 'where to'), 'Wohin fährst du?'], ['wann', T('متى', 'when'), 'Wann beginnt der Kurs?'],
      ['wie', T('كيف', 'how'), 'Wie heißt du?'], ['warum', T('لماذا', 'why'), 'Warum lernst du Deutsch?'], ['wie viel', T('كم', 'how much'), 'Wie viel kostet das?']]),
    text('في سؤال W يأتي الفعل أيضًا **ثانيًا**: **Wo wohnst du?** وفي سؤال نعم/لا يأتي الفعل **أولًا**: **Wohnst du in Rabat?** → Ja / Nein.',
         'In a W-question the verb is also **second**: **Wo wohnst du?** In a yes/no question the verb comes **first**: **Wohnst du in Rabat?** → Ja / Nein.'),
    examples(
      ex('Heute lerne ich Deutsch.', 'اليوم أتعلم الألمانية.', 'Today I am learning German.'),
      ex('Am Montag arbeite ich.', 'يوم الاثنين أعمل.', 'On Monday I work.'),
      ex('Warum lernst du Deutsch?', 'لماذا تتعلم الألمانية؟', 'Why are you learning German?', '3lach kat3llem l2almaniya?'),
      ex('Ich möchte eine Ausbildung in Deutschland machen.', 'أريد أن أقوم بتكوين مهني في ألمانيا.', 'I would like to do vocational training in Germany.'),
      ex('Wann beginnt der Kurs?', 'متى تبدأ الدورة؟', 'When does the course start?'),
      ex('Kommst du aus Marokko?', 'هل أنت من المغرب؟', 'Are you from Morocco?')),
  ],
  vocab=['wer', 'was', 'wo', 'woher', 'wann', 'wie', 'warum', 'heute'],
  exercises=[
    order(T('اليوم أتعلم الألمانية.', 'Today I am learning German.'), ['Heute', 'lerne', 'ich', 'Deutsch', '.'], ['Heute lerne ich Deutsch .', 'Heute lerne ich Deutsch.', 'Ich lerne heute Deutsch .', 'Ich lerne heute Deutsch.']),
    order(T('في برلين يسكن أخي.', 'My brother lives in Berlin.'), ['In', 'Berlin', 'wohnt', 'mein', 'Bruder', '.'], ['In Berlin wohnt mein Bruder .', 'In Berlin wohnt mein Bruder.', 'Mein Bruder wohnt in Berlin .', 'Mein Bruder wohnt in Berlin.']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Morgen fahre ich nach Köln.', 'Morgen ich fahre nach Köln.', 'Morgen fahre nach Köln ich.', 'Ich morgen fahre nach Köln.'], 'Morgen fahre ich nach Köln.', T('الفعل في الموضع الثاني.', 'Verb in position 2.')),
    mc(T('تريد أن تعرف مدينة شخص. تسأل:', 'You want to know where someone lives:'), ['Wo wohnst du?', 'Wer wohnst du?', 'Woher wohnst du?', 'Wann wohnst du?'], 'Wo wohnst du?'),
    fill('___ kommst du? – Aus Marokko.', ['Woher'], T('من أين', 'where from')),
    fill('___ lernst du Deutsch? – Für meine Ausbildung.', ['Warum'], T('لماذا', 'why')),
    fill('___ kostet das? – 5 Euro.', ['Wie viel', 'Was'], T('كم', 'how much')),
    translate(T('متى تبدأ الدورة؟', 'When does the course start?'), ['Wann beginnt der Kurs?', 'Wann fängt der Kurs an?']),
  ]))

# 9 ------------------------------------------------------------------ Negation
L.append(dict(id='negation', order=9, level='A1', title=T('النفي: nicht و kein', 'Negation: nicht and kein'), titleDe='nicht oder kein?', minutes=25,
  summary=T('متى تقول nicht ومتى تقول kein، وأين تضع nicht في الجملة.', 'When to say nicht vs kein, and where nicht goes in the sentence.'),
  resources=['shehata', 'easygerman'], videos=['VGu5DZdD1oI', 'dsplri0EKiY', 'vC_7XBaqsc4'],
  blocks=[
    text('**kein** = «لا … أيّ»، ويُستعمل مع **الاسم النكرة** (مع ein أو بدون أداة). يتصرف مثل ein: **kein** Auto، **keine** Zeit، **kein** Problem.\n\n**nicht** = «لا / ليس»، ويُستعمل مع **الفعل والصفة والاسم المعرّف**: Ich arbeite **nicht**. Das ist **nicht** teuer. Das ist **nicht** mein Handy.',
         '**kein** = "no / not a", used with **indefinite nouns** (with ein or no article). It behaves like ein: **kein** Auto, **keine** Zeit, **kein** Problem.\n\n**nicht** = "not", used with **verbs, adjectives and definite nouns**: Ich arbeite **nicht**. Das ist **nicht** teuer. Das ist **nicht** mein Handy.'),
    examples(
      ex('Ich habe keine Zeit.', 'ليس لدي وقت.', 'I have no time.', 'Ma3ndich lwaqt.'),
      ex('Das ist kein Problem.', 'هذه ليست مشكلة.', 'That is no problem.', 'Machi mochkil.'),
      ex('Ich habe kein Auto.', 'ليست عندي سيارة.', "I don't have a car."),
      ex('Ich arbeite heute nicht.', 'لا أعمل اليوم.', "I'm not working today."),
      ex('Das ist nicht teuer.', 'هذا ليس غاليًا.', "That isn't expensive.", 'Hadchi machi ghali.'),
      ex('Er kommt nicht aus Deutschland.', 'هو ليس من ألمانيا.', "He doesn't come from Germany.")),
    tip('اختبار سريع: هل يمكنك وضع **ein/eine** أمام الاسم أو لا أداة أصلًا؟ ← **kein**. في كل الحالات الأخرى ← **nicht**. والدارجة تساعدك: «ما عنديش» ≈ kein، «ماشي» ≈ nicht.',
        'Quick test: could the noun take **ein/eine** or no article? → **kein**. Everything else → **nicht**.'),
  ],
  vocab=['nicht', 'kein', 'das-Problem', 'die-Zeit', 'das-Auto'],
  exercises=[
    fill('Ich habe ___ Zeit.', ['keine'], T('Zeit مؤنث (die)', 'Zeit is feminine')),
    fill('Das ist ___ Problem.', ['kein']),
    fill('Ich arbeite heute ___.', ['nicht']),
    fill('Das Essen ist ___ teuer.', ['nicht']),
    mc(T('«ليس عندي أخ» =', '"I have no brother" ='), ['Ich habe keinen Bruder.', 'Ich habe nicht Bruder.', 'Ich habe nicht einen Bruder.', 'Ich nicht habe Bruder.'], 'Ich habe keinen Bruder.', T('مفعول به مذكر → keinen (الأكوزاتيف).', 'Masculine object → keinen (accusative).')),
    mc(T('أين nicht؟', 'Where does nicht go?'), ['Ich komme heute nicht.', 'Ich nicht komme heute.', 'Nicht ich komme heute.', 'Ich komme nicht heute nicht.'], 'Ich komme heute nicht.'),
    translate(T('هذا ليس غاليًا.', "That isn't expensive."), ['Das ist nicht teuer.', 'Das ist nicht teuer']),
  ]))

# 10 ----------------------------------------------------------------- Plural
L.append(dict(id='plural', order=10, level='A1', title=T('جمع الأسماء', 'Plural nouns'), titleDe='Der Plural', minutes=30,
  summary=T('أنماط الجمع الخمسة (-e، -er، -(e)n، -s، بلا نهاية + أومْلاوت) ولماذا تحفظ الجمع مع كل اسم.', 'The five plural patterns (-e, -er, -(e)n, -s, none + umlaut) and why you learn each plural.'),
  resources=['anki', 'easygerman'], videos=['UwKUWIVmJHs', 'Q3eCDhwMRv8', 'BgZ--QmPAIw'],
  blocks=[
    text('مثل **جمع التكسير** في العربية (كتاب ← كُتُب)، الجمع الألماني **لا يتبع قاعدة واحدة**. لذلك احفظ دائمًا: **das Buch, die Bücher**. لكن هناك ميول تساعدك:',
         'Like Arabic broken plurals (kitab → kutub), German plurals **follow no single rule**. Always learn: **das Buch, die Bücher**. But there are tendencies:'),
    table([T('النمط', 'Pattern'), T('غالبًا مع', 'Often with'), T('أمثلة', 'Examples')], [
      ['-(e)n', T('معظم الأسماء المؤنثة', 'most feminine nouns'), 'die Frau → die Frauen, die Lampe → die Lampen'],
      ['-e (+ ¨)', T('كثير من المذكر', 'many masculine nouns'), 'der Tag → die Tage, der Stuhl → die Stühle'],
      ['-er (+ ¨)', T('كثير من المحايد', 'many neuter nouns'), 'das Kind → die Kinder, das Buch → die Bücher'],
      ['– (+ ¨)', T('المنتهية بـ -er, -el, -en', 'nouns in -er, -el, -en'), 'der Lehrer → die Lehrer, der Vater → die Väter'],
      ['-s', T('الكلمات الأجنبية', 'foreign words'), 'das Auto → die Autos, das Handy → die Handys']]),
    examples(
      ex('Ich habe zwei Kinder.', 'عندي طفلان.', 'I have two children.'),
      ex('Die Bücher sind auf dem Tisch.', 'الكتب على الطاولة.', 'The books are on the table.'),
      ex('Drei Tage, vier Wochen.', 'ثلاثة أيام، أربعة أسابيع.', 'Three days, four weeks.'),
      ex('Die Lehrer sind nett.', 'المعلمون لطفاء.', 'The teachers are nice.'),
      ex('Wir brauchen zwei Stühle.', 'نحتاج كرسيين.', 'We need two chairs.')),
  ],
  vocab=['das-Kind', 'das-Buch', 'der-Tag', 'die-Woche', 'der-Stuhl', 'die-Frau'],
  exercises=[
    mc('das Kind → die …', ['Kinder', 'Kinds', 'Kinde', 'Kindern'], 'Kinder'),
    mc('die Frau → die …', ['Frauen', 'Fraue', 'Fraus', 'Fräuer'], 'Frauen'),
    mc('der Stuhl → die …', ['Stühle', 'Stuhle', 'Stuhls', 'Stühler'], 'Stühle'),
    mc('das Auto → die …', ['Autos', 'Auten', 'Autoe', 'Äuto'], 'Autos'),
    mc('der Lehrer → die …', ['Lehrer', 'Lehrers', 'Lehreren', 'Lehrern'], 'Lehrer'),
    fill('Ich habe zwei ___. (das Buch)', ['Bücher']),
    fill('Eine Woche hat sieben ___. (der Tag)', ['Tage']),
    translate(T('عندي طفلان.', 'I have two children.'), ['Ich habe zwei Kinder.', 'Ich habe zwei Kinder']),
  ]))

# 11 ----------------------------------------------------------------- Akkusativ
L.append(dict(id='akkusativ', order=11, level='A1', title=T('المفعول به: الأكوزاتيف', 'The accusative case'), titleDe='Der Akkusativ', minutes=35,
  summary=T('عندما يقع الفعل على اسم مذكر: der → den، ein → einen. مع haben و brauchen و möchten و kaufen.', 'When a verb acts on a masculine noun: der → den, ein → einen. With haben, brauchen, möchten, kaufen.'),
  resources=['shehata', 'easygerman'], videos=['qDtqMf8LT5Q', 'A3kDyxMO2xI', 'fd_5Wjsf9xo'],
  blocks=[
    text('تعرف من العربية الإعراب: «رأيتُ الرجلَ» (منصوب). في الألمانية تتغير **الأداة** بدل الحركة. والخبر السعيد: في الأكوزاتيف **يتغير المذكر فقط**:\n\n- Das ist **der** Computer. → Ich kaufe **den** Computer.\n- Das ist **ein** Tisch. → Ich brauche **einen** Tisch.\n- die و das والجمع **لا تتغير**.',
         'You know case endings from Arabic ("ra2aytu r-rajula"). German changes the **article** instead. Good news: in the accusative **only masculine changes**:\n\n- Das ist **der** Computer. → Ich kaufe **den** Computer.\n- Das ist **ein** Tisch. → Ich brauche **einen** Tisch.\n- die, das and plural **stay the same**.'),
    table(['', 'der (m)', 'die (f)', 'das (n)', 'Plural'], [
      ['Nominativ', 'der / ein / kein', 'die / eine / keine', 'das / ein / kein', 'die / – / keine'],
      ['Akkusativ', 'den / einen / keinen', 'die / eine / keine', 'das / ein / kein', 'die / – / keine']]),
    examples(
      ex('Ich brauche einen Laptop.', 'أحتاج حاسوبًا محمولًا.', 'I need a laptop.'),
      ex('Ich möchte einen Kaffee, bitte.', 'أريد قهوة من فضلك.', "I'd like a coffee, please.", 'Bghit wa7d lqahwa 3afak.'),
      ex('Hast du einen Bruder?', 'هل لديك أخ؟', 'Do you have a brother?'),
      ex('Wir suchen eine Wohnung.', 'نبحث عن شقة.', 'We are looking for a flat.'),
      ex('Ich sehe den Bus.', 'أرى الحافلة.', 'I see the bus.'),
      ex('Er kauft das Brot.', 'هو يشتري الخبز.', 'He buys the bread.')),
    tip('أفعال شائعة مع الأكوزاتيف: **haben, brauchen, möchten, kaufen, suchen, sehen, essen, trinken, finden, besuchen, lernen**. وأيضًا **es gibt**: Es gibt **einen** Supermarkt hier.',
        'Common accusative verbs: **haben, brauchen, möchten, kaufen, suchen, sehen, essen, trinken, finden, besuchen, lernen**. Also **es gibt**: Es gibt **einen** Supermarkt hier.'),
  ],
  vocab=['der-Kaffee', 'der-Bus', 'das-Brot', 'brauchen', 'kaufen', 'suchen'],
  exercises=[
    fill('Ich brauche ___ Laptop. (ein, m)', ['einen']),
    fill('Ich sehe ___ Bus. (der)', ['den']),
    fill('Wir suchen ___ Wohnung. (eine, f)', ['eine']),
    fill('Er kauft ___ Brot. (das)', ['das']),
    fill('Ich habe ___ Bruder. (kein, m)', ['keinen']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Ich möchte einen Kaffee.', 'Ich möchte ein Kaffee.', 'Ich möchte einem Kaffee.', 'Ich möchte der Kaffee.'], 'Ich möchte einen Kaffee.'),
    mc(T('في الأكوزاتيف يتغير…', 'In the accusative, what changes?'), [T('المذكر فقط', 'only masculine'), T('المؤنث فقط', 'only feminine'), T('كل الأجناس', 'all genders'), T('الجمع فقط', 'only plural')], T('المذكر فقط', 'only masculine')),
    translate(T('أحتاج حاسوبًا محمولًا.', 'I need a laptop.'), ['Ich brauche einen Laptop.', 'Ich brauche einen Laptop']),
  ]))

# 12 ----------------------------------------------------------------- Zeit
L.append(dict(id='time', order=12, level='A1', title=T('الساعة والأيام والمواعيد', 'Time, days and appointments'), titleDe='Uhrzeit und Termine', minutes=30,
  summary=T('قراءة الساعة (halb acht!)، أيام الأسبوع، um / am / im، وحجز موعد.', 'Telling time (halb acht!), weekdays, um / am / im, and making an appointment.'),
  resources=['shehata', 'lingoni'], videos=['FNA-TfeEcrk', '8Ph3tbuhtsY', 'J0S37KBxqow', 'Xi3irLjbu7A'],
  blocks=[
    text('انتبه لكلمة **halb**: **halb acht** = **7:30** (نصف الطريق إلى الثامنة)، وليس 8:30! وفي الأخبار والمواعيد الرسمية يستعمل الألمان نظام 24 ساعة: **19:30 = neunzehn Uhr dreißig**.',
         'Careful with **halb**: **halb acht** = **7:30** (half way to eight), not 8:30! Officially Germans use 24-hour time: **19:30 = neunzehn Uhr dreißig**.'),
    table([T('الوقت', 'Time'), T('غير رسمي', 'Informal'), T('رسمي', 'Official')], [
      ['8:00', 'acht Uhr', 'acht Uhr'], ['8:15', 'Viertel nach acht', 'acht Uhr fünfzehn'], ['8:30', 'halb neun', 'acht Uhr dreißig'],
      ['8:45', 'Viertel vor neun', 'acht Uhr fünfundvierzig'], ['8:50', 'zehn vor neun', 'acht Uhr fünfzig'], ['20:00', 'acht Uhr (abends)', 'zwanzig Uhr']]),
    text('### um، am، im\n- **um** + ساعة: **um** 9 Uhr\n- **am** + يوم أو جزء من اليوم: **am** Montag، **am** Abend، **am** Wochenende\n- **im** + شهر أو فصل: **im** Mai، **im** Sommer\n\nأيام الأسبوع كلها مذكرة: der Montag، Dienstag، Mittwoch، Donnerstag، Freitag، Samstag، Sonntag.',
         '### um, am, im\n- **um** + clock time: **um** 9 Uhr\n- **am** + day or part of day: **am** Montag, **am** Abend, **am** Wochenende\n- **im** + month or season: **im** Mai, **im** Sommer\n\nAll weekdays are masculine: der Montag, Dienstag, Mittwoch, Donnerstag, Freitag, Samstag, Sonntag.'),
    examples(
      ex('Wie spät ist es?', 'كم الساعة؟', 'What time is it?', 'Ch7al fssa3a?'),
      ex('Es ist halb acht.', 'الساعة السابعة والنصف.', "It's half past seven."),
      ex('Der Kurs beginnt um neun Uhr.', 'تبدأ الدورة في الساعة التاسعة.', 'The course starts at nine.'),
      ex('Am Montag habe ich einen Termin.', 'يوم الاثنين عندي موعد.', 'On Monday I have an appointment.'),
      ex('Haben Sie am Freitag Zeit?', 'هل لديك وقت يوم الجمعة؟', 'Do you have time on Friday?'),
      ex('Die Prüfung ist im Juni.', 'الامتحان في يونيو.', 'The exam is in June.')),
  ],
  vocab=['die-Uhr', 'der-Montag', 'der-Freitag', 'der-Termin', 'das-Wochenende', 'heute', 'morgen'],
  exercises=[
    mc('halb acht = ?', ['7:30', '8:30', '8:00', '7:00'], '7:30', T('halb + الساعة التالية.', 'halb + the next hour.')),
    mc('Viertel vor neun = ?', ['8:45', '9:15', '9:45', '8:15'], '8:45'),
    fill('Der Kurs beginnt ___ 9 Uhr.', ['um']), fill('___ Montag habe ich frei.', ['Am']), fill('Die Prüfung ist ___ Juni.', ['im']),
    listen('Der Termin ist am Dienstag um zehn Uhr.', T('الموعد يوم الثلاثاء في الساعة العاشرة.', 'The appointment is on Tuesday at ten.'), ['Dienstag, 10:00', 'Donnerstag, 10:00', 'Dienstag, 12:00', 'Montag, 10:00'], 'Dienstag, 10:00', T('متى الموعد؟', 'When is the appointment?')),
    translate(T('كم الساعة؟', 'What time is it?'), ['Wie spät ist es?', 'Wie viel Uhr ist es?']),
  ]))
