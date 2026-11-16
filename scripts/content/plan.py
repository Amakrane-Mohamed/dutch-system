from common import T

PHASES = [
  dict(key='a1', label='A1', start='2026-11-11', end='2027-01-17', hours=150, weeks=[1, 10],
       dates=T('الأربعاء 11 نوفمبر 2026 → الأحد 17 يناير 2027 (10 أسابيع)', 'Wed 11 Nov 2026 → Sun 17 Jan 2027 (10 weeks)'),
       book='Schritte international Neu 1 + 2', test=T('Goethe A1 Modellsatz ≥ 60٪', 'Goethe A1 Modellsatz ≥ 60%'),
       can=[T('أقدّم نفسي وأسأل عن الاسم والبلد والعمل.', 'I can introduce myself and ask about name, country, job.'), T('أفهم الأرقام والأوقات والأسعار.', 'I understand numbers, times and prices.'), T('أطلب في مقهى، أسأل عن الطريق، آخذ موعدًا.', 'I can order in a café, ask the way, make an appointment.'), T('أكتب رسالة قصيرة واستمارة.', 'I can write a short message and fill in a form.')],
       checks=[T('Nicos Weg A1 مكتمل', 'Nicos Weg A1 finished'), T('Schritte 1 + 2 مكتمل', 'Schritte 1 + 2 finished'), T('~1000 بطاقة Anki (أسماء مع الأداة والجمع)', '~1,000 Anki cards (nouns with article + plural)'), T('Goethe A1 Modellsatz ≥ 60٪ + تقديم نفسك دقيقتين', 'Goethe A1 Modellsatz ≥ 60% + 2-minute self-introduction')]),
  dict(key='a2', label='A2', start='2027-01-18', end='2027-03-28', hours=150, weeks=[11, 20],
       dates=T('الاثنين 18 يناير → الأحد 28 مارس 2027 (10 أسابيع)', 'Mon 18 Jan → Sun 28 Mar 2027 (10 weeks)'),
       book='Schritte international Neu 3 + 4', test=T('Goethe A2 Modellsatz ≥ 60٪ في الأجزاء الأربعة', 'Goethe A2 Modellsatz ≥ 60% in all four parts'),
       can=[T('أحكي عن الماضي (Perfekt) وأبرّر (weil).', 'I can talk about the past (Perfekt) and give reasons (weil).'), T('أكتب إيميلًا رسميًا قصيرًا وشكوى.', 'I can write a short formal email and a complaint.'), T('أفهم الإعلانات والحوارات اليومية.', 'I understand announcements and everyday dialogues.'), T('Lebenslauf و Anschreiben جاهزان.', 'My Lebenslauf and Anschreiben are ready.')],
       checks=[T('Nicos Weg A2 + Schritte 3/4 مكتمل', 'Nicos Weg A2 + Schritte 3/4 finished'), T('~2000 بطاقة Anki', '~2,000 Anki cards'), T('Goethe A2 Modellsatz ≥ 60٪', 'Goethe A2 Modellsatz ≥ 60%'), T('Lebenslauf + Anschreiben + أول 10 ترشيحات', 'Lebenslauf + Anschreiben + first 10 applications')]),
  dict(key='b1', label='B1', start='2027-03-29', end='2027-06-06', hours=160, weeks=[21, 30],
       dates=T('الاثنين 29 مارس → الأحد 6 يونيو 2027 (10 أسابيع)', 'Mon 29 Mar → Sun 6 Jun 2027 (10 weeks)'),
       book='Schritte international Neu 5 + 6', test=T('Goethe-Zertifikat B1 (الرباط / الدار البيضاء)، بداية يونيو 2027', 'Goethe-Zertifikat B1 (Rabat / Casablanca), early June 2027'),
       can=[T('أشارك في نقاش عن مواضيع مألوفة وأعطي رأيي.', 'I can join a discussion on familiar topics and give my opinion.'), T('أكتب إيميلات ومشاركة منتدى من 80 كلمة.', 'I can write emails and an 80-word forum post.'), T('أفهم النقاط الرئيسية في الراديو والتلفاز.', 'I understand the main points on radio and TV.'), T('أنجح في مقابلة Ausbildung بالألمانية.', 'I can pass an Ausbildung interview in German.')],
       checks=[T('Modellsatz ≥ 60٪ في كل وحدة', 'Modellsatz ≥ 60% in every module'), T('توقيع Ausbildungsvertrag (هدف 31 مايو)', 'Ausbildungsvertrag signed (target 31 May)'), T('اجتياز Goethe-Zertifikat B1', 'Goethe-Zertifikat B1 passed'), T('طلب موعد التأشيرة (§16a AufenthG)', 'Visa appointment requested (§16a AufenthG)')]),
  dict(key='b2', label='B2', start='2027-06-07', end='2027-08-29', hours=200, weeks=[31, 42],
       dates=T('الاثنين 7 يونيو → الأحد 29 أغسطس 2027 (12 أسبوعًا، هدف إضافي)', 'Mon 7 Jun → Sun 29 Aug 2027 (12 weeks, stretch)'),
       book='Goethe/telc B2 Modellsatz + DW Top-Thema + Deutsch mit Marija', test=T('Goethe B2 Modellsatz (اختياري: Goethe-Zertifikat B2)', 'Goethe B2 Modellsatz (optional: Goethe-Zertifikat B2)'),
       can=[T('أتابع الأخبار والمحاضرات التقنية.', 'I can follow the news and technical talks.'), T('أقدّم عرضًا وأدافع عن رأيي.', 'I can give a presentation and defend my view.'), T('أكتب نصوصًا واضحة ومفصلة (150 كلمة).', 'I can write clear, detailed texts (150 words).'), T('أتواصل في Berufsschule وفي الشركة.', 'I can communicate at Berufsschule and work.')],
       checks=[T('Goethe B2 Modellsatz ≥ 60٪ لكل وحدة', 'Goethe B2 Modellsatz ≥ 60% per module'), T('محادثة 45 دقيقة بدون إنجليزية', '45-minute conversation without English'), T('التأشيرة + السفر + السكن الأول', 'Visa + flight + first accommodation'), T('300 كلمة IT', '300 IT words')]),
]

MILESTONES = [
  dict(id='start', date='2026-11-11', emoji='🚀', title=T('البداية A1', 'Start A1'), note=T('اليوم الأول', 'Day 1'), city='Casablanca'),
  dict(id='a1', date='2027-01-17', emoji='🟢', title=T('نهاية A1', 'A1 done'), note=T('Goethe A1 Modellsatz', 'Goethe A1 Modellsatz'), city='Rabat'),
  dict(id='apply', date='2027-03-01', emoji='📨', title=T('بداية الترشيحات', 'Applications start'), note=T('Lebenslauf + Anschreiben', 'Lebenslauf + Anschreiben'), city='Tanger'),
  dict(id='a2', date='2027-03-28', emoji='🔵', title=T('نهاية A2', 'A2 done'), note=T('Goethe A2 Modellsatz', 'Goethe A2 Modellsatz'), city='Madrid'),
  dict(id='contract', date='2027-05-31', emoji='✍️', title=T('توقيع العقد', 'Contract signed'), note=T('Ausbildungsvertrag', 'Ausbildungsvertrag'), city='Paris'),
  dict(id='b1exam', date='2027-06-04', emoji='🎓', title=T('امتحان Goethe B1', 'Goethe B1 exam'), note=T('الرباط / الدار البيضاء', 'Rabat / Casablanca'), city='Köln'),
  dict(id='visa', date='2027-08-15', emoji='🛂', title=T('التأشيرة (مايو–أغسطس)', 'Visa (May–Aug)'), note=T('بعد العقد + B1', 'after contract + B1'), city='Frankfurt'),
  dict(id='b2', date='2027-08-29', emoji='🟠', title=T('B2 (هدف إضافي)', 'B2 (stretch)'), note=T('~3 ساعات يوميًا', '~3 h/day'), city='Leipzig'),
  dict(id='ausbildung', date='2027-09-01', emoji='💻', title=T('بداية Ausbildung', 'Ausbildung starts'), note=T('Fachinformatiker AE', 'Fachinformatiker AE'), city='Berlin'),
  dict(id='backup', date='2028-09-01', emoji='🛟', title=T('الخطة البديلة', 'Backup start'), note=T('إذا تأخرت 2027', 'if 2027 slips'), city=''),
]

ACTIVITIES = [
  ('book', T('الكتاب / Nicos Weg', 'Book / Nicos Weg'), 'lesen'), ('anki', T('البطاقات', 'Flashcards'), 'lesen'),
  ('listening', T('الاستماع', 'Listening'), 'hoeren'), ('speaking', T('المحادثة', 'Speaking'), 'sprechen'),
  ('writing', T('الكتابة', 'Writing'), 'schreiben'), ('reading', T('القراءة', 'Reading'), 'lesen'),
  ('tutor', T('معلم / Tandem', 'Tutor / Tandem'), 'sprechen'), ('exam', T('تدريب الامتحان', 'Exam practice'), None), ('app', T('هذا التطبيق', 'This app'), None),
]

DAILY = [
  dict(id='anki', time='07:30', minutes=20, activity='anki', title=T('البطاقات (Anki + التطبيق)', 'Flashcards (Anki + app)'),
       by=dict(a1=T('20 جديدة + مراجعة، الأسماء مع der/die/das + الجمع', '20 new + reviews, nouns with der/die/das + plural'), a2=T('20 جديدة + مراجعة', '20 new + reviews'), b1=T('15 جديدة + بطاقات جمل', '15 new + sentence cards'), b2=T('مفردات IT + مراجعة', 'IT vocab + reviews'))),
  dict(id='book', time='19:00', minutes=45, activity='book', title=T('درس Nicos Weg + الكتاب', 'Nicos Weg lesson + book'),
       by=dict(a1=T('Nicos Weg A1 + Schritte 1/2', 'Nicos Weg A1 + Schritte 1/2'), a2=T('Nicos Weg A2 + Schritte 3/4', 'Nicos Weg A2 + Schritte 3/4'), b1=T('Nicos Weg B1 + Schritte 5/6', 'Nicos Weg B1 + Schritte 5/6'), b2=T('تدريب بصيغة Goethe B2', 'Goethe B2 format practice'))),
  dict(id='listening', time='19:45', minutes=25, activity='listening', title=T('الاستماع', 'Listening'),
       by=dict(a1=T('lingoni A1 / Super Easy German', 'lingoni A1 / Super Easy German'), a2=T('Easy German A2 + Slow German', 'Easy German A2 + Slow German'), b1=T('Easy German B1 + Easy German Podcast', 'Easy German B1 + Easy German Podcast'), b2=T('Langsam gesprochene Nachrichten + Marija', 'Langsam gesprochene Nachrichten + Marija'))),
  dict(id='speaking', time='20:10', minutes=15, activity='speaking', title=T('تحدّث بصوت عالٍ (Shadowing + التسجيل)', 'Speak aloud (shadowing + recording)'),
       by=dict(a1=T('كرّر جمل الدرس', 'Repeat the lesson sentences'), a2=T('صف يومك وسجّل نفسك', 'Describe your day, record yourself'), b1=T('مواضيع Goethe B1 Sprechen', 'Goethe B1 Sprechen topics'), b2=T('أسئلة المقابلة والعرض', 'Interview answers, presentation'))),
  dict(id='writing', time='20:25', minutes=15, activity='writing', title=T('اكتب (مع تصحيح)', 'Write (with correction)'),
       by=dict(a1=T('5 جمل عن نفسك', '5 sentences about yourself'), a2=T('إيميل قصير', 'Short email'), b1=T('إيميل / مشاركة منتدى B1', 'B1 email / forum post'), b2=T('Anschreiben ونصوص رسمية', 'Anschreiben, formal texts'))),
  dict(id='evening', time='21:30', minutes=60, activity=None, title=T('+ ساعة إن استطعت (خطة 3 ساعات)', '+1 h if you can (3 h/day plan)'),
       by=dict(a1=T('درس Nicos Weg ثانٍ', 'A second Nicos Weg lesson'), a2=T('معلم / Tandem أو الكتاب', 'Tutor / Tandem or the book'), b1=T('وحدة Modellsatz', 'A Modellsatz module'), b2=T('وحدة B2 + الترشيحات', 'A B2 module + applications'))),
]

WEEKLY = [
  dict(day=T('الاثنين → الجمعة', 'Mon → Fri'), time=T('ساعتان مساءً (+ ساعة إن أمكن)', '2 h evening (+1 h if possible)'), focus=T('مادة جديدة: Nicos Weg + الكتاب، البطاقات، الاستماع، المحادثة', 'New material: Nicos Weg + book, cards, listening, speaking')),
  dict(day=T('السبت', 'Saturday'), time=T('3 ساعات', '3 h'), focus=T('اختبار الأسبوع في التطبيق، مهمة الكتابة، حصة معلم أو Tandem (من A2)', 'Weekly test in the app, writing task, a tutor or Tandem session (from A2)')),
  dict(day=T('الأحد', 'Sunday'), time=T('ساعتان', '2 h'), focus=T('مراجعة الأسبوع، دفتر الأخطاء، وحدة Modellsatz (من B1)، الترشيحات (من مارس)', 'Weekly review, error log, a Modellsatz module (from B1), applications (from March)')),
]

PITFALLS = [
  (T('حفظ الاسم بدون der/die/das', 'Learning nouns without der/die/das'), T('العربية فيها أداة واحدة (ال)، والألمانية فيها ثلاث تتغير مع الإعراب. الأداة جزء من الكلمة.', 'Arabic has one article (al-). German has three, and they change with case.'), T('كل بطاقة: die Wohnung, die Wohnungen. ألوان: der أزرق، die أحمر، das أخضر.', 'Every card: die Wohnung, die Wohnungen. Colour code der/die/das.')),
  (T('إهمال الجمع', 'Ignoring the plural'), T('لا توجد قاعدة واحدة للجمع (-e، -er، -n، -s، Umlaut) – مثل جموع التكسير في العربية!', 'No single plural rule (-e, -er, -n, -s, umlaut) – like Arabic broken plurals!'), T('احفظ الجمع مع الاسم من اليوم الأول.', 'Learn the plural with the noun from day one.')),
  (T('الهروب من الإعراب (Kasus)', 'Avoiding cases'), T('Akkusativ و Dativ يغيّران الأداة (der → den / dem). الفصحى فيها إعراب، لكن الدارجة لا تنطقه، فتنساه.', 'Accusative and dative change the article. MSA has case endings, but Darija does not pronounce them.'), T('فكّر: مفعول به = Akkusativ؛ «لِـ / مع / عند» = غالبًا Dativ. تدرّب: Ich sehe den Mann / Ich helfe dem Mann.', 'Think: object = accusative; "to / with / at" = often dative. Drill Ich sehe den Mann / Ich helfe dem Mann.')),
  (T('موقع الفعل', 'Verb position'), T('الجملة الرئيسية: الفعل ثانيًا. بعد weil / dass: الفعل في النهاية. مع Modal / Perfekt: الفعل الثاني في النهاية.', 'Main clause: verb second. After weil/dass: verb last. Modal/Perfekt: second verb last.'), T('تمارين ترتيب الكلمات في التطبيق يوميًا.', 'Do the word-order exercises in the app daily.')),
  (T('ü و ö', 'ü and ö'), T('غير موجودين في العربية ولا الدارجة. المغاربة يقولون «i» بدل ü و «e» بدل ö (Tür → Tir).', 'Not in Arabic or Darija. Moroccans often say "i" for ü and "e" for ö.'), T('ü = «i» مع شفاه مستديرة (مثل tu في الفرنسية). ö = «e» مع شفاه مستديرة (peu).', 'ü = "i" with rounded lips (French tu). ö = "e" with rounded lips (peu).')),
  (T('ch', 'ch'), T('بعد a, o, u (Bach, Buch) = خ، وهذا سهل عليك. بعد e, i, ä, ö, ü (ich, Milch) = صوت ناعم، ليس خ وليس ش.', 'After a, o, u it is خ. After e, i, ä, ö, ü it is a soft hiss, not خ and not ش.'), T('ich = «هـ» خفيفة في مقدمة الفم. تدرّب على أزواج ich / ach.', 'ich = soft "h" at the front of the mouth. Practise ich / ach pairs.')),
  (T('p و b، v و f', 'p vs b, v vs f'), T('لا يوجد p في العربية. v الألمانية غالبًا = f (Vater).', 'Arabic has no p. German v is usually f.'), T('p مع نفخة هواء: Paket, Papier. v = f: Vater, viel. w = v الفرنسية: Wasser.', 'p with a puff of air. v = f. w = French v.')),
  (T('الترجمة من الفرنسية', 'Translating from French'), T('ترتيب الجملة الفرنسية والكلمات المخادعة.', 'French word order and false friends.'), T('احفظ جملًا كاملة. انتبه: bekommen = يحصل على، وليس become.', 'Learn whole sentences. bekommen = get, not become.')),
  (T('du و Sie', 'du vs Sie'), T('الخطأ في الترشيح أو المقابلة يبدو قلة احترام.', 'The wrong form in an application or interview sounds rude.'), T('Sie للشركات والإدارات والمقابلات؛ du للأصدقاء وغالبًا بين الزملاء لاحقًا.', 'Sie for companies, offices, interviews; du with friends.')),
  (T('تأجيل الكلام', 'Waiting with speaking'), T('كثيرون ينجحون في القراءة ويرسبون في Sprechen.', 'Many pass reading but fail Sprechen.'), T('تكلّم بصوت عالٍ كل يوم من الأسبوع 1، ومعلم من A2.', 'Speak aloud daily from week 1, tutor from A2.')),
  (T('الدفع لوسطاء من أجل مقعد في الامتحان', 'Paying agents for exam places'), T('Goethe Marokko يحذّر: لا يتعامل مع وسطاء ويراسل فقط من @goethe.de.', 'Goethe Marokko warns it does not work with agents.'), T('سجّل فقط في متجر Goethe الرسمي.', 'Register only in the official Goethe webshop.')),
  (T('تأجيل الترشيحات إلى ما بعد B1', 'Leaving applications for after B1'), T('الشركات تملأ مقاعد Ausbildung قبل 6–12 شهرًا.', 'Companies fill places 6–12 months ahead.'), T('ابدأ الترشيح في A2 (مارس 2027) واذكر موعد امتحان B1.', 'Start applying at A2 (March 2027) and mention your B1 date.')),
]

BUDGET = [
  (T('Nicos Weg، Easy German، lingoni، شحاته، بدر، البودكاست، Anki (حاسوب/أندرويد)', 'Nicos Weg, Easy German, lingoni, Shehata, Badr, podcasts, Anki (desktop/Android)'), '€0'),
  (T('Schritte international Neu 1–6، Kursbuch + Arbeitsbuch (~23€ لكل كتاب عند Hueber)', 'Schritte international Neu 1–6, Kursbuch + Arbeitsbuch (~€23 each at Hueber)'), '≈ €138 + shipping'),
  (T('italki / معلم مرة أسبوعيًا من A2 (~30 حصة، السعر حسب المعلم)', 'italki / tutor weekly from A2 (~30 lessons, price varies)'), '≈ €300–450'),
  (T('Goethe-Zertifikat B1، مترشح خارجي، Goethe Marokko', 'Goethe-Zertifikat B1, external candidate, Goethe Marokko'), '2,500 MAD'),
  (T('اختياري: Goethe-Zertifikat B2', 'Optional: Goethe-Zertifikat B2'), '2,800 MAD'),
  (T('المجموع (مسار B1، بدون التأشيرة والسفر)', 'Total (B1 path, without visa/moving)'), '≈ €450–600 + 2,500 MAD'),
]
