# Skill tracks: methods + level ladders. Resource ids refer to resources.py, video ids to videos.ts.
from common import T

def M(id, title, minutes, steps, why, res=(), videos=()):
    return dict(id=id, title=title, minutes=minutes, steps=steps, why=why, res=list(res), videos=list(videos))

def L(level, items, goal):
    return dict(level=level, items=items, goal=goal)

TRACKS = [
 dict(key='sprechen', de='Sprechen', icon='mic', color='terracotta', title=T('المحادثة', 'Speaking'),
  intro=T('الكلام مهارة عضلية: فمك يحتاج تدريبًا يوميًا مثل الرياضة. أغلب المغاربة ينجحون في القراءة ويتعثرون في Sprechen لأنهم يؤجلون الكلام. ابدأ من اليوم الأول ولو بجملة واحدة.', 'Speaking is a muscle skill: your mouth needs daily training. Most learners pass reading and struggle in Sprechen because they postpone speaking. Start on day one, even with one sentence.'),
  methods=[
   M('shadowing', T('التظليل (Shadowing)', 'Shadowing'), 10, [T('اختر مقطعًا قصيرًا (30–60 ثانية) من Nicos Weg أو Easy German بمستواك.', 'Pick a 30–60 s clip from Nicos Weg or Easy German at your level.'), T('استمع مرة مع النص وافهم كل كلمة.', 'Listen once with the transcript and understand every word.'), T('شغّله وكرّر خلف المتحدث بنصف ثانية تأخير، بنفس اللحن والسرعة.', 'Play it and repeat half a second behind the speaker, same melody and speed.'), T('5 مرات: مع النص مرتين، ثم بدون نص 3 مرات. سجّل المحاولة الأخيرة.', '5 rounds: twice with text, then 3 times without. Record the last one.')],
     T('يدرّب النطق واللحن وترتيب الجملة في نفس الوقت، دون الحاجة إلى شريك.', 'Trains sounds, melody and word order at once, no partner needed.'), ['nicosyt', 'easygerman']),
   M('selftalk', T('الحديث مع النفس (Selbstgespräch)', 'Self-talk'), 5, [T('صف بصوت عالٍ ما تفعله الآن: Ich koche jetzt Tee. Dann lerne ich.', 'Narrate what you are doing: Ich koche jetzt Tee. Dann lerne ich.'), T('عند كل كلمة لا تعرفها: اكتبها في دفتر وابحث عنها مساءً.', 'Every missing word goes into a notebook; look it up in the evening.'), T('من A2: احكِ يومك في Perfekt قبل النوم (دقيقتان).', 'From A2: tell your day in Perfekt before sleeping (2 minutes).')],
     T('يحوّل الوقت الميت (المواصلات، الطبخ) إلى تدريب، ويكشف الكلمات الناقصة.', 'Turns dead time into practice and reveals missing words.')),
   M('record', T('سجّل نفسك وقارن', 'Record and compare'), 5, [T('سجّل جواب سؤال الأسبوع (دقيقة في A1، 3 دقائق في B1).', 'Record the weekly prompt (1 min at A1, 3 min at B1).'), T('استمع واكتب 3 أخطاء: صوت، فعل، أداة.', 'Listen back and note 3 mistakes: a sound, a verb, an article.'), T('سجّل مرة ثانية بعد التصحيح. احتفظ بالتسجيلات لتسمع تقدمك.', 'Record again after fixing. Keep the files to hear your progress.')],
     T('الطريقة الوحيدة لتسمع نفسك كما يسمعك الممتحن.', 'The only way to hear yourself as the examiner does.')),
   M('pairs', T('تمارين النطق للناطقين بالعربية', 'Pronunciation drills for Arabic speakers'), 5, [T('كل يوم زوجان من القائمة أدناه: 10 مرات ببطء، ثم بسرعة.', 'Each day, two pairs from the list below: 10 times slowly, then fast.'), T('استعمل زر «تحدث» في التطبيق: إن فهمك التعرف الصوتي فالنطق جيد.', 'Use the speak button in the app: if speech recognition gets it, you said it right.')],
     T('أصوات ü، ö، ich، p، z، والـ r الألمانية غير موجودة بنفس الشكل في الدارجة.', 'ü, ö, ich, p, z and the German r do not exist in the same way in Darija.'), ['badr'], ['Mr97reuPZ34', 'TNwopLJMmSw']),
   M('tutor', T('معلم أو شريك Tandem (من A2)', 'Tutor or Tandem partner (from A2)'), 45, [T('حصة واحدة أسبوعيًا على italki (اختر معلمًا «Community Tutor» بتقييم عالٍ ومراجعات كثيرة).', 'One weekly lesson on italki (pick a highly rated tutor with many reviews).'), T('أرسل له مسبقًا موضوع الأسبوع وسؤال Sprechen.', 'Send the week\'s topic and speaking prompt beforehand.'), T('مجانًا: تبادل لغوي على Tandem أو HelloTalk (عربية ↔ ألمانية)، 30 دقيقة لكل لغة.', 'Free: a language exchange on Tandem or HelloTalk (Arabic ↔ German), 30 minutes each language.'), T('اطلب منه أن يصحح فقط الأخطاء المتكررة، واكتبها في دفتر الأخطاء.', 'Ask them to correct only repeated mistakes, and log them.')],
     T('الامتحان يقيس التفاعل مع إنسان، لا مع تطبيق.', 'The exam measures interaction with a person, not an app.'), ['italki', 'tandem', 'hellotalk']),
   M('exam-sprechen', T('تدريب Sprechen للامتحان (من B1)', 'Exam speaking practice (from B1)'), 20, [T('Goethe B1: Teil 1 التخطيط معًا، Teil 2 عرض بـ 5 شرائح، Teil 3 رد فعل وسؤال.', 'Goethe B1: part 1 plan together, part 2 a 5-slide presentation, part 3 feedback + question.'), T('telc B1: التعارف، نقاش، التخطيط معًا.', 'telc B1: getting to know each other, discussion, planning together.'), T('احفظ Redemittel لكل جزء (انظر صفحة الامتحانات).', 'Memorise Redemittel for each part (see the Exams page).')],
     T('الامتحان له بنية ثابتة: من يعرفها يكسب نقاطًا سهلة.', 'The exam has a fixed structure: knowing it earns easy points.'), ['goethe-b1', 'telc-b1'], ['XcNawpHowLo', 'dONkw8oazpo', 'k4PozpqtkOs']),
  ],
  drills=[dict(a=a, b=b, ar=ar, tip=tip) for a, b, ar, tip in [
   ('ich', 'ach', 'ich (ناعم) / ach (خ)', T('ich: اللسان قريب من سقف الفم الأمامي، مثل «هـ» قوية. ach: خ عادية.', 'ich: tongue near the front palate, like a strong "h". ach: a normal خ.')),
   ('Tier', 'Tür', 'حيوان / باب', T('Tür: قل «i» ثم دوّر شفتيك دون تحريك اللسان.', 'Tür: say "i", then round your lips without moving your tongue.')),
   ('lesen', 'lösen', 'يقرأ / يحل', T('ö = «e» مع شفاه مستديرة (مثل peu بالفرنسية).', 'ö = "e" with rounded lips (French peu).')),
   ('Bein', 'Pein', 'ساق / ألم', T('p: ضع يدك أمام فمك، يجب أن تحس بنفخة هواء.', 'p: hold your hand in front of your mouth; feel a puff of air.')),
   ('Vater', 'Wasser', 'أب / ماء', T('v = f، و w = v الفرنسية.', 'v = f, and w = French v.')),
   ('Zeit', 'seit', 'وقت / منذ', T('z = «تس» دائمًا. s قبل حرف علة = «ز».', 'z is always "ts". s before a vowel = "z".')),
   ('Stadt', 'Staat', 'مدينة / دولة', T('a قصيرة قبل حرفين ساكنين، وطويلة مع aa / ah.', 'Short a before two consonants, long with aa / ah.')),
   ('Hölle', 'Höhle', 'جهنم / كهف', T('ö قصيرة مقابل ö طويلة.', 'Short ö vs long ö.')),
   ('rot', 'Brot', 'أحمر / خبز', T('r الألمانية من الحلق (قريبة من غ خفيفة)، وليست r المغربية الملفوفة.', 'German r comes from the throat (a light غ), not the rolled Moroccan r.')),
   ('Lehrer', 'Leere', 'معلم / فراغ', T('-er في آخر الكلمة = «ا» قصيرة: Lehrer ≈ «ليرا».', 'Final -er sounds like a short "a": Lehrer ≈ "Lehra".')),
  ]],
  ladder=[L('A1', [T('جمل دروس التطبيق + Nicos Weg', 'App lesson sentences + Nicos Weg'), T('تقديم نفسك (30 ثانية → دقيقتان)', 'Self-introduction (30 s → 2 min)')], T('تقديم نفسك دقيقتين بدون ورقة', 'A 2-minute self-introduction without notes')),
          L('A2', [T('حصة italki / Tandem أسبوعيًا', 'A weekly italki / Tandem session'), T('حكي اليوم في Perfekt', 'Telling your day in Perfekt')], T('محادثة 15 دقيقة عن حياتك اليومية', 'A 15-minute conversation about daily life')),
          L('B1', [T('Goethe B1 Sprechen Teil 1–3', 'Goethe B1 Sprechen parts 1–3'), T('مقابلة Ausbildung تجريبية', 'Mock Ausbildung interview')], T('≥ 60/100 في Sprechen', '≥ 60/100 in Sprechen')),
          L('B2', [T('عرض 4 دقائق + نقاش', '4-minute talk + discussion'), T('تقديم مشروعك التقني', 'Presenting your tech project')], T('45 دقيقة بدون إنجليزية', '45 minutes without English'))]),
 dict(key='schreiben', de='Schreiben', icon='pen', color='saffron', title=T('الكتابة', 'Writing'),
  intro=T('الكتابة هي المكان الذي ترى فيه أخطاءك بوضوح. اكتب قليلًا كل يوم، صحّح دائمًا، واجمع أخطاءك في دفتر حتى تختفي.', 'Writing is where you see your mistakes clearly. Write a little every day, always correct, and collect your mistakes until they disappear.'),
  methods=[
   M('journal', T('يوميات مع تصحيح', 'Journal with correction'), 15, [T('اكتب يوميًا حسب مستواك: 5 جمل (A1) → 80 كلمة (B1) → 150 كلمة (B2).', 'Write daily at your level: 5 sentences (A1) → 80 words (B1) → 150 words (B2).'), T('صحّح بـ LanguageTool أولًا، ثم افهم كل تصحيح (لا تنسخ فقط).', 'Correct with LanguageTool first, then understand every fix (do not just copy).'), T('مرة أسبوعيًا: أرسل أفضل نص لمعلمك أو شريك Tandem.', 'Once a week: send your best text to a tutor or tandem partner.'), T('من B1: قارن مع DeepL Write لترى صياغة أكثر طبيعية.', 'From B1: compare with DeepL Write for more natural phrasing.')],
     T('التصحيح الفوري يمنع ترسخ الأخطاء.', 'Immediate correction stops mistakes from sticking.'), ['languagetool', 'italki']),
   M('errorlog', T('دفتر الأخطاء', 'Error log'), 5, [T('3 أعمدة: الخطأ ← الصحيح ← القاعدة.', '3 columns: mistake → correct → rule.'), T('كل أحد: اقرأ الدفتر وحوّل الأخطاء المتكررة إلى بطاقات Anki.', 'Every Sunday: read it and turn repeated mistakes into Anki cards.')],
     T('أغلب الأخطاء تتكرر: 10 أخطاء = 80٪ من مشاكلك.', 'Most mistakes repeat: 10 mistakes = 80% of your problems.')),
   M('formal', T('الرسائل والإيميلات الرسمية', 'Formal letters and emails'), 20, [T('البنية: Betreff → Sehr geehrte Damen und Herren, → السبب → التفاصيل → الطلب → Mit freundlichen Grüßen.', 'Structure: subject → greeting → reason → details → request → closing.'), T('استعمل Sie وأفعالًا مهذبة: Ich möchte … / Könnten Sie …?', 'Use Sie and polite verbs: Ich möchte … / Könnten Sie …?'), T('أنواع الامتحان: شكوى، طلب معلومات، اعتذار، دعوة.', 'Exam types: complaint, information request, apology, invitation.')],
     T('Schreiben Teil 3 في B1 والجزء 2 في B2 رسالة رسمية دائمًا.', 'B1 part 3 and B2 part 2 are always a formal message.'), ['goethe-b1'], ['vVYRDrC8XJ4', '61EcojJHF38', '85DifZ7Lq0c']),
   M('bewerbung', T('ملف الترشيح: Lebenslauf + Anschreiben', 'Application: Lebenslauf + Anschreiben'), 30, [T('Lebenslauf جدولي (صفحة 1–2) بصورة احترافية اختيارية: البيانات، التعليم، الخبرة، المهارات، اللغات، الاهتمامات.', 'A tabular CV (1–2 pages), optional professional photo: details, education, experience, skills, languages, interests.'), T('Anschreiben صفحة واحدة: لماذا هذه المهنة؟ لماذا هذه الشركة؟ لماذا أنت؟', 'A one-page cover letter: why this job, why this company, why you?'), T('اذكر مشاريعك في تطوير التطبيقات (رابط GitHub) وموعد امتحان B1.', 'Mention your app projects (GitHub link) and your B1 exam date.'), T('غيّر كل Anschreiben حسب الإعلان؛ لا ترسل نفس النص لـ 20 شركة.', 'Adapt every letter to the ad; never send the same text to 20 companies.')],
     T('الشركات تقرأ Anschreiben لتعرف هل ستتواصل معك بالألمانية.', 'Companies read the cover letter to see whether you can work in German.'), ['europass', 'boards', 'ba'], ['fv60wa-OHgo', 'onwS9GTrh7Y', 'EnSzJcmyI2E', 'v1jl3fuv4W0']),
  ],
  prompts=dict(a1=['Ich heiße … und komme aus …', 'Mein Tag: Ich stehe um … auf.', 'Meine Familie', 'Meine Wohnung', 'Was ich gern esse', 'Mein Wochenende (Perfekt)'],
               a2=['Ein schöner Tag in meiner Kindheit', 'E-Mail an einen Freund: Ich habe eine neue Wohnung.', 'Warum ich Deutsch lerne (weil …)', 'Reklamation: Mein Handy ist kaputt.', 'Marokko und Deutschland im Vergleich'],
               b1=['Forumsbeitrag: Sollen Kinder ein Handy haben?', 'E-Mail an deinen Ausbilder: Du bist krank.', 'Meine Pläne für die Ausbildung', 'Vor- und Nachteile von Homeoffice', 'Ein Problem in meiner Stadt und meine Lösung'],
               b2=['Forumsbeitrag: Studium oder Ausbildung?', 'Wie verändert KI die Arbeit von Entwicklern?', 'Formelle Nachricht an den Betriebsrat', 'Zusammenfassung eines Zeitungsartikels']),
  lebenslauf=[T('Persönliche Daten: الاسم، العنوان، الهاتف، الإيميل، تاريخ الميلاد (03.12.2003)، الجنسية', 'Persönliche Daten: name, address, phone, email, date of birth (03.12.2003), nationality'),
              T('Schulbildung: البكالوريا + الشهادة (Bac+2) مع التواريخ', 'Schulbildung: Baccalauréat + Bac+2 diploma with dates'),
              T('Berufserfahrung / Projekte: تطوير تطبيقات الهاتف (أقل من سنة) – اذكر التقنيات', 'Berufserfahrung / Projekte: mobile app development (< 1 year) – list the technologies'),
              T('Kenntnisse: لغات البرمجة، الأدوات، Git', 'Kenntnisse: programming languages, tools, Git'),
              T('Sprachen: العربية (لغة أم)، الدارجة، الإنجليزية، الفرنسية، الألمانية (B1, Goethe, Juni 2027)', 'Sprachen: Arabic (native), Darija, English, French, German (B1, Goethe, June 2027)'),
              T('Interessen: مشاريعك الشخصية، رياضة… (قصير)', 'Interessen: personal projects, sports… (short)'),
              T('المكان + التاريخ (Ort, Datum) – بدون توقيع في النسخة الإلكترونية غالبًا', 'Place + date – usually without signature in the digital version')],
  anschreiben='''Bewerbung um einen Ausbildungsplatz als Fachinformatiker für Anwendungsentwicklung ab dem 01.09.2027

Sehr geehrte Frau …, / Sehr geehrte Damen und Herren,

mit großem Interesse habe ich Ihre Anzeige auf … gelesen. Seit fast einem Jahr entwickle ich mobile Apps und möchte diese Leidenschaft mit einer fundierten Ausbildung in Ihrem Unternehmen verbinden.

Nach meinem Abschluss (Bac+2) in Marokko habe ich eigene Apps programmiert, zum Beispiel … Dabei habe ich gelernt, selbstständig Probleme zu lösen und im Team mit Git zu arbeiten.

Ihr Unternehmen interessiert mich besonders, weil … Ich lerne seit November 2026 intensiv Deutsch und lege im Juni 2027 die Prüfung Goethe-Zertifikat B1 ab.

Über eine Einladung zu einem Vorstellungsgespräch – gern auch online – freue ich mich sehr.

Mit freundlichen Grüßen
Mohamed [Nachname]''',
  ladder=[L('A1', [T('5 جمل يوميًا', '5 sentences a day'), T('استمارات ورسائل SMS', 'Forms and text messages')], T('رسالة 40 كلمة (Goethe A1 Schreiben)', 'A 40-word message (Goethe A1)')),
          L('A2', [T('إيميلات قصيرة 60–80 كلمة', 'Short 60–80 word emails'), T('Lebenslauf الأول', 'First Lebenslauf')], T('Goethe A2 Schreiben ≥ 60٪', 'Goethe A2 Schreiben ≥ 60%')),
          L('B1', [T('مشاركة منتدى 80 كلمة + إيميل رسمي', '80-word forum post + formal email'), T('Anschreiben لكل ترشيح', 'A cover letter per application')], T('Goethe B1 Schreiben ≥ 60/100', 'Goethe B1 Schreiben ≥ 60/100')),
          L('B2', [T('150 كلمة رأي + 100 كلمة رسالة رسمية', '150-word opinion + 100-word formal message'), T('توثيق تقني قصير', 'Short technical documentation')], T('Goethe B2 Schreiben ≥ 60/100', 'Goethe B2 Schreiben ≥ 60/100'))]),
 dict(key='hoeren', de='Hören', icon='headphones', color='teal', title=T('الاستماع', 'Listening'),
  intro=T('اسمع كثيرًا (استماع واسع) واسمع بدقة (استماع مركّز). الأول يعوّد أذنك، والثاني يعلمك الكلمات.', 'Listen a lot (extensive) and listen precisely (intensive). The first trains your ear, the second teaches words.'),
  methods=[
   M('intensive', T('الاستماع المركّز (3 مرات)', 'Intensive listening (3 passes)'), 15, [T('مرة 1: بدون ترجمة – ما الموضوع؟ من يتكلم؟', 'Pass 1: no subtitles – what is it about? who speaks?'), T('مرة 2: مع الترجمة الألمانية – اكتب 5 كلمات جديدة.', 'Pass 2: with German subtitles – note 5 new words.'), T('مرة 3: بدون ترجمة – هل تفهم الآن 80٪؟', 'Pass 3: no subtitles – do you understand 80% now?')],
     T('تحويل «ضجيج» إلى كلمات مفهومة.', 'Turns "noise" into understood words.'), ['nicosyt', 'easygerman']),
   M('dictation', T('الإملاء (Diktat)', 'Dictation'), 10, [T('شغّل جملة واحدة، أوقف، واكتبها كاملة.', 'Play one sentence, pause, write it all.'), T('قارن مع النص وصحّح بلون آخر.', 'Compare with the transcript and correct in another colour.'), T('في التطبيق: تمارين الاستماع تقرأ لك الجملة بصوت ألماني.', 'In the app: listening exercises read the sentence in a German voice.')],
     T('يكشف بالضبط ما لا تسمعه: النهايات، الأدوات، الأفعال المنفصلة.', 'Shows exactly what you miss: endings, articles, separable prefixes.'), ['lgn', 'slowgerman']),
   M('extensive', T('الاستماع الواسع', 'Extensive listening'), 25, [T('بودكاست أو فيديو بمستواك أثناء المشي أو الطبخ.', 'A podcast or video at your level while walking or cooking.'), T('القاعدة: تفهم 60–80٪ → المستوى مناسب. أقل من 50٪ → انزل مستوى.', 'Rule: 60–80% understood = right level. Under 50% = go down a level.')],
     T('يحتاج دماغك مئات الساعات من الألمانية المفهومة.', 'Your brain needs hundreds of hours of understood German.'), ['coffeebreak', 'dwn', 'egpodcast']),
   M('exam-hoeren', T('تدريب Hören للامتحان', 'Exam listening practice'), 20, [T('اقرأ الأسئلة قبل الاستماع وسطّر الكلمات المفتاحية.', 'Read the questions before listening and underline key words.'), T('Goethe B1: Teil 1 و 4 مرتين، Teil 2 و 3 مرة واحدة. B2: Teil 1 و 3 مرة، Teil 2 و 4 مرتين.', 'Goethe B1: parts 1 and 4 twice, 2 and 3 once. B2: parts 1 and 3 once, 2 and 4 twice.'), T('لا تتوقف عند كلمة: انتقل للسؤال التالي.', 'Never get stuck on one word; move to the next question.')],
     T('في الامتحان لا يمكنك إعادة التسجيل.', 'In the exam you cannot replay.'), ['goethe-b1', 'goethe-b2'], ['7wF2A2g845w', 'e4oZ5MHCBVo']),
  ],
  ladder=[L('A1', [T('Nicos Weg A1 (يوتيوب)', 'Nicos Weg A1 (YouTube)'), T('Super Easy German', 'Super Easy German'), T('lingoni A1', 'lingoni A1'), T('Coffee Break German S1', 'Coffee Break German S1'), T('Deutsch – warum nicht? 1', 'Deutsch – warum nicht? 1')], T('Goethe A1 Hören ≥ 60٪', 'Goethe A1 Hören ≥ 60%')),
          L('A2', [T('Nicos Weg A2', 'Nicos Weg A2'), T('Easy German (مع ترجمة)', 'Easy German (with subtitles)'), T('Slow German', 'Slow German'), T('البودكاست الأول لأحمد ياغي', 'Ahmad Yaghi listening podcast')], T('Goethe A2 Hören ≥ 60٪', 'Goethe A2 Hören ≥ 60%')),
          L('B1', [T('Nicos Weg B1', 'Nicos Weg B1'), T('Easy German Podcast', 'Easy German Podcast'), T('DW Top-Thema (صوت)', 'DW Top-Thema (audio)'), T('lingoni B1', 'lingoni B1')], T('Goethe B1 Hören ≥ 60/100', 'Goethe B1 Hören ≥ 60/100')),
          L('B2', [T('Langsam gesprochene Nachrichten → Originaltempo', 'Langsam gesprochene Nachrichten → original speed'), T('tagesschau in 100 Sekunden', 'tagesschau in 100 Sekunden'), T('Deutsch mit Marija', 'Deutsch mit Marija')], T('Goethe B2 Hören ≥ 60/100', 'Goethe B2 Hören ≥ 60/100'))]),
 dict(key='lesen', de='Lesen', icon='book', color='majorelle', title=T('القراءة', 'Reading'),
  intro=T('القراءة أسرع طريق للمفردات. اقرأ نصوصًا تفهم 90٪ منها، وكل يوم قليلًا.', 'Reading is the fastest way to vocabulary. Read texts you understand 90% of, a little every day.'),
  methods=[
   M('intensive-r', T('القراءة المركّزة', 'Intensive reading'), 15, [T('نص قصير (150–300 كلمة). اقرأه مرة كاملة دون قاموس.', 'A short text (150–300 words). Read it once without a dictionary.'), T('سطّر الكلمات المهمة وابحث عن 5–8 منها فقط.', 'Underline key words and look up only 5–8.'), T('لوّن الأدوات (der / die / das) والأفعال في آخر الجملة.', 'Colour the articles and the sentence-final verbs.'), T('لخّص النص في 3 جمل بالألمانية.', 'Summarise it in 3 German sentences.')],
     T('تفهم كيف تُبنى الجملة الألمانية فعليًا.', 'You see how German sentences are really built.'), ['nachrichtenleicht', 'topthema']),
   M('mining', T('استخراج الجمل (Sentence mining)', 'Sentence mining'), 5, [T('من كل نص: انسخ جملتين مفيدتين إلى Anki (الجملة كاملة + الترجمة العربية).', 'From every text, copy two useful sentences to Anki (full sentence + Arabic translation).')],
     T('تحفظ الكلمة في سياقها مع الأداة والإعراب.', 'You learn words in context, with article and case.'), ['anki']),
   M('extensive-r', T('القراءة الواسعة', 'Extensive reading'), 15, [T('مقالات سهلة يوميًا دون التوقف عند كل كلمة.', 'Easy articles daily without stopping at every word.'), T('A2: nachrichtenleicht و logo!؛ B1: Top-Thema؛ B2: tagesschau.de.', 'A2: nachrichtenleicht and logo!; B1: Top-Thema; B2: tagesschau.de.')],
     T('السرعة مهمة في Lesen: 65 دقيقة لـ 5 أجزاء.', 'Speed matters in Lesen: 65 minutes for 5 parts.'), ['logo', 'tagesschau']),
   M('exam-lesen', T('تدريب Lesen للامتحان', 'Exam reading practice'), 20, [T('اقرأ الأسئلة أولًا، ثم ابحث في النص (Scanning).', 'Read the questions first, then scan the text.'), T('Teil 3 (الإعلانات): انتبه أن إعلانًا واحدًا لا يناسب أحدًا.', 'Part 3 (ads): remember one ad matches nobody.'), T('خصص الوقت: ~13 دقيقة لكل جزء.', 'Budget ~13 minutes per part.')],
     T('أسئلة Lesen تختبر استراتيجية بقدر ما تختبر اللغة.', 'Lesen tests strategy as much as language.'), ['goethe-b1', 'schubert'], ['t1mtApcj4_4', 'A_nzwTvVzLY']),
  ],
  ladder=[L('A1', [T('حوارات Nicos Weg A1', 'Nicos Weg A1 dialogues'), T('نصوص القراءة في التطبيق', 'In-app reading texts'), T('Schubert A1 Lesetexte', 'Schubert A1 reading texts')], T('Goethe A1 Lesen ≥ 60٪', 'Goethe A1 Lesen ≥ 60%')),
          L('A2', [T('nachrichtenleicht.de', 'nachrichtenleicht.de'), T('logo! (ZDF للأطفال)', 'logo! (ZDF for kids)'), T('mein-deutschbuch A2', 'mein-deutschbuch A2')], T('Goethe A2 Lesen ≥ 60٪', 'Goethe A2 Lesen ≥ 60%')),
          L('B1', [T('DW Top-Thema', 'DW Top-Thema'), T('إعلانات Ausbildung حقيقية', 'Real Ausbildung ads'), T('Schubert B1', 'Schubert B1')], T('Goethe B1 Lesen ≥ 60/100', 'Goethe B1 Lesen ≥ 60/100')),
          L('B2', [T('Langsam gesprochene Nachrichten (النص)', 'Langsam gesprochene Nachrichten (transcript)'), T('tagesschau.de', 'tagesschau.de'), T('BERUFENET ووثائق تقنية', 'BERUFENET and tech docs')], T('Goethe B2 Lesen ≥ 60/100', 'Goethe B2 Lesen ≥ 60/100'))]),
]
