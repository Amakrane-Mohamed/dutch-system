from common import *

L = []

L.append(dict(id='dativ', order=19, level='A2', title=T('حالة الداتيف', 'The dative case'), titleDe='Der Dativ', minutes=40,
  summary=T('dem / der / dem / den(+n): المفعول غير المباشر، وأفعال مثل helfen و gefallen، وحروف الجر mit, nach, bei, von, zu, aus, seit.', 'dem / der / dem / den(+n): the indirect object, verbs like helfen and gefallen, and the prepositions mit, nach, bei, von, zu, aus, seit.'),
  resources=['shehata', 'lingoni'], videos=['2hkDcmSQZbs', 'wQwpOJQlpb0', 'yuYTleQIIxI', 'CDgG2K7Kbbs'],
  blocks=[
    text('الداتيف يجيب عن سؤال **wem?** (لِمَن؟). مثل العربية «أعطيتُ **للرجلِ** الكتابَ»: الشخص الذي يستقبل = داتيف، والشيء = أكوزاتيف.\n\n- Ich gebe **dem** Mann **das** Buch.\n- Ich helfe **meiner** Mutter.\n- Das Handy gehört **mir**.',
         'The dative answers **wem?** (to whom?). "I give **the man** the book": the receiver is dative, the thing is accusative.\n\n- Ich gebe **dem** Mann **das** Buch.\n- Ich helfe **meiner** Mutter.\n- Das Handy gehört **mir**.'),
    table(['', 'der (m)', 'die (f)', 'das (n)', 'Plural'], [
      ['Nominativ', 'der / ein', 'die / eine', 'das / ein', 'die'], ['Akkusativ', 'den / einen', 'die / eine', 'das / ein', 'die'], ['Dativ', 'dem / einem', 'der / einer', 'dem / einem', 'den + -n']]),
    text('### حروف جرّ تأخذ الداتيف دائمًا\n**aus, bei, mit, nach, seit, von, zu** (احفظها كأغنية). وأفعال مع الداتيف: **helfen, danken, gefallen, gehören, antworten, schmecken**.\n\nالضمائر: ich → **mir**، du → **dir**، er → **ihm**، sie → **ihr**، wir → **uns**، Sie → **Ihnen**.',
         '### Always-dative prepositions\n**aus, bei, mit, nach, seit, von, zu**. Dative verbs: **helfen, danken, gefallen, gehören, antworten, schmecken**.\n\nPronouns: ich → **mir**, du → **dir**, er → **ihm**, sie → **ihr**, wir → **uns**, Sie → **Ihnen**.'),
    examples(
      ex('Ich wohne seit einem Jahr in Berlin.', 'أسكن في برلين منذ سنة.', 'I have lived in Berlin for a year.'),
      ex('Kannst du mir helfen?', 'هل تستطيع مساعدتي؟', 'Can you help me?'),
      ex('Der Film gefällt mir sehr.', 'الفيلم يعجبني كثيرًا.', 'I really like the film.', 'Lfilm 3jbni bzaf.'),
      ex('Ich arbeite bei einer IT-Firma.', 'أعمل في شركة معلوميات.', 'I work at an IT company.'),
      ex('Nach dem Kurs gehe ich nach Hause.', 'بعد الدورة أذهب إلى البيت.', 'After the course I go home.'),
      ex('Ich schenke meinem Vater ein Buch.', 'أهدي أبي كتابًا.', 'I give my father a book.')),
  ],
  vocab=['helfen', 'gefallen', 'gehören', 'die-Firma'],
  exercises=[
    fill('Ich fahre mit ___ Zug. (der)', ['dem']), fill('Ich wohne bei ___ Tante. (meine)', ['meiner']), fill('Der Film gefällt ___. (ich)', ['mir']),
    fill('Kannst du ___ helfen? (er)', ['ihm']), fill('Ich wohne seit ___ Jahr hier. (ein)', ['einem']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Ich helfe meinem Bruder.', 'Ich helfe meinen Bruder.', 'Ich helfe mein Bruder.', 'Ich helfe meiner Bruder.'], 'Ich helfe meinem Bruder.', T('helfen + داتيف، مذكر → meinem.', 'helfen + dative, masculine → meinem.')),
    translate(T('الفيلم يعجبني.', 'I like the film.'), ['Der Film gefällt mir.', 'Der Film gefällt mir']),
  ]))

L.append(dict(id='nebensatz', order=20, level='A2', title=T('الجمل الفرعية: weil، dass، wenn', 'Sub-clauses: weil, dass, wenn'), titleDe='Nebensätze', minutes=40,
  summary=T('بعد weil و dass و wenn يذهب الفعل إلى آخر الجملة. أساس امتحان B1 في الكتابة والمحادثة.', 'After weil, dass and wenn the verb goes to the end. The core of B1 writing and speaking.'),
  resources=['shehata', 'lingoni'], videos=['cwy1aPeUnBQ', 'RMajceyqOGY', 'F8VRv9iQ5a8', 'WV4E71qaQaw', '8Vmwekr6WN4'],
  blocks=[
    text('في الجملة الفرعية **يذهب الفعل المُصرَّف إلى النهاية**:\n\n- Ich lerne Deutsch, **weil** ich in Deutschland arbeiten **möchte**.\n- Ich glaube, **dass** der Kurs gut **ist**.\n- **Wenn** ich Zeit **habe**, lese ich.\n\nوإذا بدأت بالجملة الفرعية، يأتي فعل الجملة الرئيسية **مباشرة بعد الفاصلة**: Wenn ich Zeit habe, **lese** ich.',
         'In a sub-clause **the conjugated verb goes to the end**:\n\n- Ich lerne Deutsch, **weil** ich in Deutschland arbeiten **möchte**.\n- Ich glaube, **dass** der Kurs gut **ist**.\n- **Wenn** ich Zeit **habe**, lese ich.\n\nIf you start with the sub-clause, the main verb comes **right after the comma**: Wenn ich Zeit habe, **lese** ich.'),
    tip('**denn** يعني أيضًا «لأن»، لكن **لا يغيّر** ترتيب الجملة: Ich lerne Deutsch, **denn** ich **möchte** in Deutschland arbeiten. في الامتحان استعمل الاثنين لتُظهر التنوع.',
        '**denn** also means "because" but does **not** change word order: …, **denn** ich **möchte** in Deutschland arbeiten. Use both in the exam to show range.'),
    examples(
      ex('Ich lerne Deutsch, weil ich eine Ausbildung machen möchte.', 'أتعلم الألمانية لأنني أريد القيام بتكوين مهني.', 'I learn German because I want to do an apprenticeship.'),
      ex('Ich glaube, dass das eine gute Idee ist.', 'أعتقد أن هذه فكرة جيدة.', 'I think that is a good idea.'),
      ex('Wenn ich Zeit habe, gehe ich ins Fitnessstudio.', 'عندما يكون لدي وقت أذهب إلى النادي.', 'When I have time, I go to the gym.'),
      ex('Ich weiß nicht, ob er heute kommt.', 'لا أعرف إن كان سيأتي اليوم.', "I don't know if he is coming today."),
      ex('Als ich ein Kind war, habe ich in Fès gewohnt.', 'عندما كنت طفلًا سكنت في فاس.', 'When I was a child, I lived in Fes.')),
  ],
  vocab=['weil', 'dass', 'wenn', 'denn'],
  exercises=[
    order(T('أتعلم الألمانية لأنني أريد العمل في ألمانيا.', 'I learn German because I want to work in Germany.'), ['Ich', 'lerne', 'Deutsch', ',', 'weil', 'ich', 'in', 'Deutschland', 'arbeiten', 'möchte', '.'],
      ['Ich lerne Deutsch , weil ich in Deutschland arbeiten möchte .', 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.']),
    mc(T('أي جملة صحيحة؟', 'Which sentence is correct?'), ['Ich glaube, dass er krank ist.', 'Ich glaube, dass er ist krank.', 'Ich glaube, dass ist er krank.', 'Ich glaube, er dass krank ist.'], 'Ich glaube, dass er krank ist.'),
    mc(T('أكمل: Wenn ich Zeit habe, …', 'Complete: Wenn ich Zeit habe, …'), ['lese ich ein Buch.', 'ich lese ein Buch.', 'ich ein Buch lese.', 'lese ein Buch ich.'], 'lese ich ein Buch.'),
    mc(T('denn أم weil؟ «…, ___ ich habe keine Zeit.»', 'denn or weil? "…, ___ ich habe keine Zeit."'), ['denn', 'weil', 'dass', 'wenn'], 'denn', T('الفعل في الموضع الثاني ← denn.', 'Verb in position 2 → denn.')),
    fill('Ich bleibe zu Hause, weil ich krank ___.', ['bin']),
    translate(T('أعتقد أن هذه فكرة جيدة.', 'I think that is a good idea.'), ['Ich glaube, dass das eine gute Idee ist.', 'Ich denke, dass das eine gute Idee ist.']),
    write(T('لماذا تتعلم الألمانية؟ اكتب 5 جمل باستعمال weil و dass و wenn.', 'Why are you learning German? Write 5 sentences using weil, dass and wenn.'), 45,
      [T('جملة مع weil والفعل في النهاية', 'a weil-clause with the verb at the end'), T('جملة مع dass', 'a dass-clause'), T('جملة تبدأ بـ Wenn … ثم الفعل مباشرة', 'a sentence starting with Wenn … then the verb'), T('رأي: Ich finde / Ich glaube', 'an opinion: Ich finde / Ich glaube')],
      'Ich lerne Deutsch, weil ich in Deutschland eine Ausbildung als Fachinformatiker machen möchte. Ich glaube, dass eine Ausbildung in Deutschland sehr praktisch ist. Wenn ich jeden Tag zwei Stunden lerne, kann ich im Juni die B1-Prüfung machen. Ich finde, dass Deutsch schwer, aber interessant ist. Wenn ich müde bin, höre ich einen Podcast.'),
  ]))

L.append(dict(id='praeteritum', order=21, level='A2', title=T('الماضي البسيط: war و hatte والأفعال الناقصة', 'Simple past: war, hatte and modals'), titleDe='Präteritum: war, hatte, konnte', minutes=30,
  summary=T('مع sein و haben والأفعال الناقصة يستعمل الألمان Präteritum حتى في الكلام: ich war، ich hatte، ich musste.', 'With sein, haben and modals Germans use the Präteritum even in speech: ich war, ich hatte, ich musste.'),
  resources=['shehata'], videos=['ncWlI6GlYJ8', 'bKf3llIO1rQ'],
  blocks=[
    text('القاعدة العملية: للحديث عن الماضي استعمل **Perfekt** لمعظم الأفعال، لكن مع **sein, haben** و**الأفعال الناقصة** استعمل **Präteritum**: «Ich **war** gestern krank» أطبع من «Ich bin krank gewesen».',
         'Rule of thumb: use the **Perfekt** for most verbs, but with **sein, haben** and **modals** use the **Präteritum**: "Ich **war** gestern krank" sounds more natural than "Ich bin krank gewesen".'),
    table(['', 'sein', 'haben', 'können', 'müssen', 'wollen'], [
      ['ich', 'war', 'hatte', 'konnte', 'musste', 'wollte'], ['du', 'warst', 'hattest', 'konntest', 'musstest', 'wolltest'], ['er / sie / es', 'war', 'hatte', 'konnte', 'musste', 'wollte'],
      ['wir / sie / Sie', 'waren', 'hatten', 'konnten', 'mussten', 'wollten'], ['ihr', 'wart', 'hattet', 'konntet', 'musstet', 'wolltet']]),
    examples(
      ex('Gestern war ich sehr müde.', 'أمس كنت متعبًا جدًا.', 'Yesterday I was very tired.'),
      ex('Ich hatte keine Zeit.', 'لم يكن لدي وقت.', "I didn't have time.", 'Makanch 3ndi lwaqt.'),
      ex('Wir mussten lange warten.', 'اضطررنا للانتظار طويلًا.', 'We had to wait a long time.'),
      ex('Als Kind wollte ich Pilot werden.', 'كطفل كنت أريد أن أصبح طيارًا.', 'As a child I wanted to become a pilot.'),
      ex('Konntest du die Aufgabe lösen?', 'هل استطعت حل التمرين؟', 'Were you able to solve the task?')),
  ],
  vocab=['gestern', 'sein', 'haben', 'können', 'müssen'],
  exercises=[
    fill('Gestern ___ ich krank. (sein)', ['war']), fill('Wir ___ keine Zeit. (haben)', ['hatten']), fill('Er ___ lange arbeiten. (müssen)', ['musste']),
    fill('___ du gestern zu Hause? (sein)', ['Warst']), fill('Ich ___ nicht kommen. (können)', ['konnte']),
    translate(T('لم يكن لدي وقت.', "I didn't have time."), ['Ich hatte keine Zeit.', 'Ich hatte keine Zeit']),
  ]))

L.append(dict(id='adjektive', order=22, level='A2', title=T('نهايات الصفات', 'Adjective endings'), titleDe='Adjektivdeklination', minutes=40,
  summary=T('ein neuer Laptop، der neue Laptop، mit dem neuen Laptop: النمطان الأساسيان بطريقة بسيطة.', 'ein neuer Laptop, der neue Laptop, mit dem neuen Laptop: the two main patterns, simplified.'),
  resources=['shehata', 'deutschbuch'], videos=['FRnhnazaBm8', 'yLr0ZHnt_nM', 'exwewlcw8UY'],
  blocks=[
    text('عندما تأتي الصفة **قبل** الاسم تأخذ نهاية. القاعدة المبسطة:\n\n1. بعد **der/die/das** (أداة تعريف): النهاية **-e** في المفرد (Nominativ وAkkusativ لـ die/das)، وفي كل الحالات الأخرى **-en**.\n2. بعد **ein/kein/mein**: الصفة «تُظهر» الجنس عندما لا تُظهره الأداة: ein neu**er** Laptop (der)، ein neu**es** Handy (das)، eine neu**e** Wohnung (die).\n3. في **الداتيف** و**الجمع** بعد أداة: دائمًا **-en**: mit dem neu**en** Laptop.',
         'An adjective **before** a noun takes an ending. Simplified:\n\n1. After **der/die/das**: **-e** in the singular nominative (and accusative of die/das), otherwise **-en**.\n2. After **ein/kein/mein**: the adjective "shows" the gender when the article cannot: ein neu**er** Laptop, ein neu**es** Handy, eine neu**e** Wohnung.\n3. In the **dative** and **plural** after an article: always **-en**: mit dem neu**en** Laptop.'),
    table(['', 'der', 'die', 'das', 'Plural'], [
      ['Nom. (der …)', 'der neue Laptop', 'die neue Wohnung', 'das neue Handy', 'die neuen Bücher'],
      ['Nom. (ein …)', 'ein neuer Laptop', 'eine neue Wohnung', 'ein neues Handy', 'meine neuen Bücher'],
      ['Akk. (ein …)', 'einen neuen Laptop', 'eine neue Wohnung', 'ein neues Handy', 'meine neuen Bücher'],
      ['Dat. (ein …)', 'einem neuen Laptop', 'einer neuen Wohnung', 'einem neuen Handy', 'meinen neuen Büchern']]),
    examples(
      ex('Ich habe einen neuen Laptop.', 'عندي حاسوب محمول جديد.', 'I have a new laptop.'),
      ex('Die kleine Wohnung ist teuer.', 'الشقة الصغيرة غالية.', 'The small flat is expensive.'),
      ex('Das ist ein interessantes Buch.', 'هذا كتاب مثير للاهتمام.', 'That is an interesting book.'),
      ex('Ich suche eine günstige Wohnung.', 'أبحث عن شقة رخيصة.', "I'm looking for an affordable flat."),
      ex('Er arbeitet mit einem großen Team.', 'يعمل مع فريق كبير.', 'He works with a big team.')),
  ],
  vocab=['neu', 'klein', 'groß', 'interessant'],
  exercises=[
    fill('Ich habe einen neu___ Laptop.', ['en']), fill('Das ist ein interessant___ Buch.', ['es']), fill('Die klein___ Wohnung ist teuer.', ['e']),
    fill('Ich wohne in einer groß___ Stadt.', ['en']), fill('Das ist ein gut___ Lehrer.', ['er']),
    mc(T('أي شكل صحيح؟', 'Which form is correct?'), ['mit dem neuen Auto', 'mit dem neue Auto', 'mit dem neues Auto', 'mit dem neuer Auto'], 'mit dem neuen Auto'),
  ]))

L.append(dict(id='komparativ', order=23, level='A2', title=T('المقارنة والتفضيل', 'Comparative and superlative'), titleDe='Komparativ und Superlativ', minutes=30,
  summary=T('schnell → schneller → am schnellsten، و als / wie، والأشكال الشاذة gut → besser → am besten.', 'schnell → schneller → am schnellsten, als / wie, and the irregular gut → besser → am besten.'),
  resources=['shehata', 'lingoni'], videos=['4aPVid4j_l4', 'dLYFZZqpE6c', '8QTb4is_fKw'],
  blocks=[
    text('- **المقارنة:** الصفة + **-er** + **als**: Berlin ist größ**er als** Köln.\n- **المساواة:** **so** + صفة + **wie**: Rabat ist **so** schön **wie** Fès.\n- **التفضيل:** **am** + صفة + **-sten**: Der ICE ist **am** schnell**sten**.\n\nكثير من الصفات القصيرة تأخذ أومْلاوت: alt → **ä**lter، groß → gr**ö**ßer، jung → j**ü**nger. وشاذة: **gut → besser → am besten**، **viel → mehr → am meisten**، **gern → lieber → am liebsten**.',
         '- **Comparative:** adjective + **-er** + **als**: Berlin ist größ**er als** Köln.\n- **Equality:** **so** + adjective + **wie**: Rabat ist **so** schön **wie** Fès.\n- **Superlative:** **am** + adjective + **-sten**: Der ICE ist **am** schnell**sten**.\n\nMany short adjectives add an umlaut: alt → **ä**lter, groß → gr**ö**ßer, jung → j**ü**nger. Irregular: **gut → besser → am besten**, **viel → mehr → am meisten**, **gern → lieber → am liebsten**.'),
    examples(
      ex('Mein Bruder ist älter als ich.', 'أخي أكبر مني.', 'My brother is older than me.'),
      ex('Deutsch ist schwerer als Englisch.', 'الألمانية أصعب من الإنجليزية.', 'German is harder than English.'),
      ex('Ich trinke lieber Tee als Kaffee.', 'أفضّل الشاي على القهوة.', 'I prefer tea to coffee.', 'Kanfaddal atay 3la lqahwa.'),
      ex('Am liebsten programmiere ich mit Kotlin.', 'أكثر ما أحب هو البرمجة بـ Kotlin.', 'Most of all I like programming in Kotlin.'),
      ex('Die Wohnung ist so groß wie meine.', 'الشقة بحجم شقتي.', 'The flat is as big as mine.')),
  ],
  vocab=['groß', 'alt', 'gut', 'schnell'],
  exercises=[
    fill('Berlin ist ___ als Köln. (groß)', ['größer']), fill('Ich trinke ___ Tee als Kaffee. (gern)', ['lieber']), fill('Mein Laptop ist ___ als deiner. (gut)', ['besser']),
    fill('Der ICE ist am ___. (schnell)', ['schnellsten']),
    mc(T('أكمل: Rabat ist so schön ___ Fès.', 'Complete: Rabat ist so schön ___ Fès.'), ['wie', 'als', 'dass', 'wenn'], 'wie'),
    translate(T('الألمانية أصعب من الإنجليزية.', 'German is harder than English.'), ['Deutsch ist schwerer als Englisch.', 'Deutsch ist schwieriger als Englisch.']),
  ]))

L.append(dict(id='beruf', order=24, level='A2', title=T('المهنة والتكوين المهني (Ausbildung)', 'Jobs and the Ausbildung'), titleDe='Beruf und Ausbildung', minutes=35,
  summary=T('تحدث عن دراستك وخبرتك وهدفك: الكلمات الأساسية لـ Bewerbung و Vorstellungsgespräch.', 'Talk about your studies, experience and goal: the core words for applications and interviews.'),
  resources=['ba', 'miig', 'shehata'], videos=['eIzltcP7SJQ', 'RVQGGvm5Q-8', 'I1y460_dViU', 'Dl5sJANIxF0'],
  blocks=[
    text('هدفك: **Ausbildung zum Fachinformatiker für Anwendungsentwicklung** (تكوين مهني مزدوج لمدة 3 سنوات: في الشركة **و**في المدرسة المهنية **Berufsschule**، مع راتب شهري **Ausbildungsvergütung**). هذه الجمل ستكررها في كل رسالة وكل مقابلة.',
         'Your goal: **Ausbildung zum Fachinformatiker für Anwendungsentwicklung** (3-year dual training: company **and** vocational school **Berufsschule**, with a monthly **Ausbildungsvergütung**). You will repeat these sentences in every letter and interview.'),
    examples(
      ex('Ich habe zwei Jahre Informatik studiert.', 'درست المعلوميات لمدة سنتين.', 'I studied computer science for two years.'),
      ex('Ich habe ein Diplom (Bac+2) in Informatik.', 'لدي دبلوم (باك+2) في المعلوميات.', 'I have a diploma (two-year degree) in IT.'),
      ex('Ich habe fast ein Jahr als App-Entwickler gearbeitet.', 'عملت قرابة سنة كمطور تطبيقات.', 'I worked as an app developer for almost a year.'),
      ex('Ich möchte eine Ausbildung als Fachinformatiker machen.', 'أريد القيام بتكوين مهني كأخصائي معلوميات.', 'I would like to do an apprenticeship as an IT specialist.'),
      ex('Meine Stärken sind Teamarbeit und Geduld.', 'نقاط قوتي هي العمل الجماعي والصبر.', 'My strengths are teamwork and patience.'),
      ex('Ich interessiere mich für App-Entwicklung.', 'أنا مهتم بتطوير التطبيقات.', "I'm interested in app development."),
      ex('Wann kann ich anfangen?', 'متى يمكنني البدء؟', 'When can I start?'),
      ex('Ich freue mich auf Ihre Antwort.', 'أتطلع إلى ردكم.', 'I look forward to your reply.')),
    table([T('الكلمة', 'Word'), T('المعنى', 'Meaning')], [
      ['die Bewerbung, -en', T('طلب التوظيف / ملف الترشيح', 'application')], ['der Lebenslauf, -läufe', T('السيرة الذاتية', 'CV')], ['das Anschreiben, -', T('رسالة التحفيز', 'cover letter')],
      ['das Vorstellungsgespräch, -e', T('مقابلة العمل', 'job interview')], ['der Ausbildungsplatz, -plätze', T('مقعد تكوين مهني', 'apprenticeship place')], ['die Berufsschule, -n', T('المدرسة المهنية', 'vocational school')],
      ['der Betrieb, -e', T('الشركة / المؤسسة', 'company')], ['das Praktikum, Praktika', T('تدريب', 'internship')], ['die Erfahrung, -en', T('خبرة', 'experience')], ['die Stärke, -n / die Schwäche, -n', T('نقطة قوة / ضعف', 'strength / weakness')]]),
  ],
  vocab=['die-Bewerbung', 'der-Lebenslauf', 'die-Ausbildung', 'die-Erfahrung', 'der-Entwickler'],
  exercises=[
    mc(T('«مقابلة العمل» بالألمانية:', '"Job interview" in German:'), ['das Vorstellungsgespräch', 'der Lebenslauf', 'die Berufsschule', 'das Anschreiben'], 'das Vorstellungsgespräch'),
    fill('Ich interessiere mich ___ App-Entwicklung.', ['für']), fill('Ich freue mich ___ Ihre Antwort.', ['auf']),
    fill('Ich habe zwei Jahre Informatik ___. (studieren)', ['studiert']),
    order(T('أريد القيام بتكوين مهني كأخصائي معلوميات.', 'I want to do an IT apprenticeship.'), ['Ich', 'möchte', 'eine', 'Ausbildung', 'als', 'Fachinformatiker', 'machen', '.'], ['Ich möchte eine Ausbildung als Fachinformatiker machen .', 'Ich möchte eine Ausbildung als Fachinformatiker machen.']),
    translate(T('متى يمكنني البدء؟', 'When can I start?'), ['Wann kann ich anfangen?', 'Wann kann ich beginnen?']),
    write(T('قدّم نفسك لشركة في 6 جمل: الدراسة، الخبرة، الهدف، نقاط القوة، لماذا ألمانيا.', 'Introduce yourself to a company in 6 sentences: studies, experience, goal, strengths, why Germany.'), 50,
      [T('استعمال Sie (رسمي)', 'formal Sie'), T('Perfekt للدراسة والخبرة', 'Perfekt for studies and experience'), T('جملة مع weil', 'a weil-clause'), T('Ich möchte … machen', 'Ich möchte … machen'), T('خاتمة مهذبة', 'a polite closing')],
      'Guten Tag, mein Name ist Mohamed Amakra. Ich komme aus Marokko und bin 22 Jahre alt. Ich habe zwei Jahre Informatik studiert und fast ein Jahr als App-Entwickler gearbeitet. Jetzt möchte ich eine Ausbildung als Fachinformatiker für Anwendungsentwicklung machen, weil ich in Deutschland professionell lernen und arbeiten möchte. Meine Stärken sind Teamarbeit, Geduld und logisches Denken. Ich freue mich auf ein Gespräch mit Ihnen.'),
  ]))
