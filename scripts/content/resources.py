# Resource library. Every URL returned HTTP 200 on 11 Nov 2026 (goethe.de blocks bots with 403;
# those pages were confirmed through search results). YouTube channels confirmed via oEmbed author_url.
from common import T
ALL = ['a1', 'a2', 'b1', 'b2']
YT = lambda h: f'https://www.youtube.com/@{h}'
PL = lambda i: f'https://www.youtube.com/playlist?list={i}'
FREE = T('مجاني', 'Free')

def R(id, name, type, level, phases, cost, why, urls, **kw):
    d = dict(id=id, name=name, type=type, level=level, phases=phases, cost=cost, why=why, urls=urls); d.update(kw); return d

RESOURCES = [
  R('nicosweg', 'DW Nicos Weg (A1–B1)', 'course', 'A1–B1', ['a1', 'a2', 'b1'], FREE,
    T('العمود الفقري المجاني لخطتك: دورة فيديو من Deutsche Welle بالتعاون مع وكالة العمل الألمانية. لكل مستوى مقدمة + 18 فصلًا × 4 دروس، مع تمارين وقواعد ومفردات، وواجهة باللغة العربية. الأكثر توصية في r/German.',
      'Your free backbone: a Deutsche Welle video course made with the Federal Employment Agency. Each level has an intro + 18 chapters × 4 lessons, with exercises, grammar and vocab, and an Arabic interface. The most recommended free course on r/German.'),
    ['https://learngerman.dw.com/ar/nicos-weg/c-47993645', 'https://learngerman.dw.com/en/nicos-weg-a1/c-36519789', 'https://learngerman.dw.com/en/nicos-weg-a2/c-36519797', 'https://learngerman.dw.com/de/nicos-weg-b1/c-36519718'], primary=True, arabic=True),
  R('dwplacement', 'DW Einstufungstest + Deutschtrainer', 'course', 'A1–B1', ALL, FREE,
    T('اختبر مستواك في نهاية كل مرحلة. و Deutschtrainer فيه 100 موضوع مفردات قصير.', 'Check your level at the end of each phase. The Deutschtrainer has 100 short vocab topics.'),
    ['https://learngerman.dw.com/en/placement-test', 'https://learngerman.dw.com/de/deutschtrainer/c-62078010']),
  R('nicosyt', 'Nicos Weg – YouTube', 'youtube', 'A1–B1', ['a1', 'a2', 'b1'], FREE,
    T('نفس حلقات الدورة على يوتيوب، والفيلم الكامل لكل مستوى. ممتاز للاستماع على الهاتف.', 'The same episodes on YouTube plus the full film per level. Great for listening on your phone.'),
    [PL('PLs7zUO7VPyJ6eoN6SmB1UcwvPUagK87ix'), PL('PLs7zUO7VPyJ7YxTq_g2Rcl3Jthd5bpTdY'), PL('PLs7zUO7VPyJ5razSfhOUVbTv9q6SAuPx-')]),
  R('schritte', 'Schritte international Neu 1–6 (Hueber)', 'books', 'A1: 1–2 · A2: 3–4 · B1: 5–6', ['a1', 'a2', 'b1'], T('≈ 23 € للجزء (كتاب الدرس + كتاب التمارين)', '≈ €23 per volume (Kursbuch + Arbeitsbuch)'),
    T('كتاب الدرس وكتاب التمارين في مجلد واحد، 7 دروس لكل جزء، والصوتيات مجانية على الإنترنت. مستعمل في دورات الاندماج في ألمانيا ويُعدّ لامتحانات Goethe/telc. اختر سلسلة واحدة فقط.',
      'Coursebook and workbook in one volume, 7 Lektionen each, free online audio. Used in German integration courses and prepares for Goethe/telc. Pick ONE series only.'),
    ['https://www.hueber.de/schritte-international-neu', 'https://shop.hueber.de/en/schritte-int-neu-1-kb-ab-978-3-19-361082-9.html'], primary=True),
  R('menschen', 'Menschen A1.1–B1.2 (Hueber)', 'books', 'A1–B1', ['a1', 'a2', 'b1'], T('A1.1: كتاب 15.50 € + تمارين 13.50 €', 'A1.1: Kursbuch €15.50 + Arbeitsbuch €13.50'),
    T('بديل في ستة أنصاف مستويات. لا تشترِ السلسلتين.', 'Alternative in six half-levels. Do not buy both series.'),
    ['https://www.hueber.de/reihe/menschen'], optional=True),
  R('netzwerk', 'Netzwerk neu A1–B1 (Klett)', 'books', 'A1–B1', ['a1', 'a2', 'b1'], T('حسب المكتبة', 'varies by shop'),
    T('بديل ثالث شائع في معاهد Goethe.', 'A third option popular at Goethe-Instituts.'), ['https://www.klett-sprachen.de/netzwerk-neu/r-1/605'], optional=True),
  R('anki', 'Anki + 4000 German Words by Frequency', 'vocab', 'A1–B2', ALL, T('مجاني (الحاسوب، AnkiWeb، أندرويد)', 'Free (desktop, AnkiWeb, Android)'),
    T('التكرار المتباعد هو أقوى أداة للمفردات حسب مجتمع r/German. أكثر 4000 كلمة استعمالًا مع الصوت والجمع وجمل أمثلة. 20 بطاقة جديدة يوميًا.', 'Spaced repetition is the strongest vocab tool according to r/German. The 4,000 most frequent words with audio, plurals and example sentences. 20 new cards a day.'),
    ['https://apps.ankiweb.net/', 'https://ankiweb.net/shared/info/1367106924', 'https://ankiweb.net/shared/info/653061995'], primary=True),
  R('verbformen', 'verbformen.de', 'vocab', 'A1–C1', ALL, FREE, T('ابحث عن der/die/das والجمع وكل تصريفات الفعل في ثوانٍ.', 'Look up der/die/das, plurals and every verb form in seconds.'), ['https://www.verbformen.de/']),
  R('dwds', 'DWDS + Duden', 'vocab', 'A2+', ['a2', 'b1', 'b2'], FREE, T('القواميس المرجعية مع أمثلة ونطق.', 'Reference dictionaries with examples and pronunciation.'), ['https://www.dwds.de/', 'https://www.duden.de/']),
  # Arabic-taught
  R('mira', 'Deutsch mit Mira', 'arabic', 'A1–B2', ALL, FREE,
    T('سلسلة «تعلم الألمانية من الصفر» بالعربية، درس لكل قاعدة A1 بمشاهدات تتجاوز مليون مشاهدة لبعض الدروس، مع بث مباشر للمراجعة.', 'The Arabic "German from zero" series, one video per A1 grammar point, some with over a million views, plus live review streams.'),
    [YT('DeutschmitMira')], arabic=True, primary=True),
  R('shehata', 'Shehata Deutsch – الألمانية مع مستر شحاته', 'arabic', 'A1–B2', ALL, FREE,
    T('من أقدم القنوات العربية لتعليم الألمانية: قوائم A1 و A2 و B1 و B2 وتدريب امتحانات Goethe بالعربية.', 'One of the oldest Arabic German channels: A1, A2, B1, B2 playlists and Goethe exam training in Arabic.'),
    [YT('MohammadShehata-Official'), PL('PLOLEcgfCxrf-_aFPd2gnBsHfA066_Ka0M'), PL('PLOLEcgfCxrf8bFnxewy5RmOH0tMXV2HdG'), PL('PLOLEcgfCxrf85Hzb1RYMXuDKhBbpNxtqF'), PL('PLOLEcgfCxrf9zsfn7fo5Ik4cyt-c1jcHa'), PL('PLOLEcgfCxrf9xtuJ7zrYBUCLr9RnhRiob')], arabic=True, primary=True),
  R('badr', 'German with Badr (بالدارجة)', 'arabic', 'A0–A2', ['a1', 'a2'], FREE,
    T('أستاذ مغربي يشرح بالدارجة، خاصة النطق والأخطاء التي يقع فيها المغاربة.', 'A Moroccan teacher explaining in Darija, especially pronunciation and typical Moroccan mistakes.'), [YT('Eaasygerman'), 'https://deutschmitbadr.de/'], arabic=True),
  R('gtc', 'German Training Center (بالدارجة)', 'arabic', 'A1–B1', ['a1', 'a2', 'b1'], FREE,
    T('دروس A1 بالدارجة المغربية، وشرح وحدات امتحان Goethe/ÖSD B1 (Sprechen و Schreiben)، ونصائح Bewerbung.', 'A1 lessons in Moroccan Darija, Goethe/ÖSD B1 Speaking and Writing explained, and application tips.'), [YT('GermanTrainingCenter')], arabic=True),
  R('yaghi', 'Deutsch mit Ahmad Yaghi', 'arabic', 'A1–B1', ['a1', 'a2', 'b1'], FREE,
    T('شرح عربي واضح للقواعد ومحادثات مثل مقابلة العمل، وملخصات A1–A2.', 'Clear Arabic grammar explanations, dialogues like a job interview, and A1–A2 summaries.'), [YT('DeutschmitAhmadYaghi')], arabic=True),
  R('bdarija', "Deutsch B'darija", 'arabic', 'B1', ['b1'], FREE,
    T('نصائح امتحان B1 (Goethe/ÖSD) بالدارجة: Lesen و Hören و Schreiben و Sprechen.', 'B1 exam tips (Goethe/ÖSD) in Darija: reading, listening, writing, speaking.'), [YT('deutschbdarija')], arabic=True),
  # German-only YouTube
  R('easygerman', 'Easy German + Super Easy German', 'youtube', 'A1–C1', ALL, FREE,
    T('مقابلات في الشارع بترجمة ألمانية وإنجليزية، وقوائم لكل مستوى. الأكثر توصية للاستماع الحقيقي.', 'Street interviews with German + English subtitles and playlists per level. The top pick for real spoken German.'),
    [YT('EasyGerman'), PL('PLk1fjOl39-50kWobutO8NVFzbw9PHtbbg'), PL('PLk1fjOl39-5201BUdhtOM_x23poNvLouT'), PL('PLk1fjOl39-53yooogv6RaJAK29mx7nz1d'), PL('PLk1fjOl39-51lvdiuQYsLW-0aGIdNNknA'), PL('PLk1fjOl39-53GxQIn1Hxdouokf0J0SDpl')], primary=True),
  R('lingoni', 'lingoni GERMAN (Learn German with Jenny)', 'youtube', 'A1–B2', ALL, FREE,
    T('قناة Jenny سابقًا: دروس قواعد واضحة لكل مستوى، تحضير Goethe/telc A1، وتمارين استماع A1/A2 و B1.', 'Formerly Learn German with Jenny: clear grammar per level, Goethe/telc A1 prep, A1/A2 and B1 listening practice.'),
    [YT('lingoniGERMAN'), PL('PL5QyCnFPRx0GxaFjdAVkx7K9TfEklY4sg'), PL('PL5QyCnFPRx0EvA_Kg42rbnyJC484MSJc8'), PL('PL5QyCnFPRx0G5PtPzSzKSErpev2uDf5ef'), PL('PL5QyCnFPRx0G7Zy9OEU62AIPuwRcWvX8U')], primary=True),
  R('anja', 'Learn German with Anja', 'youtube', 'A1–A2', ['a1', 'a2'], FREE, T('دورة A1 ممتعة وواضحة (63 درسًا) وقائمة للنطق.', 'A fun, clear A1 course (63 lessons) and a pronunciation playlist.'), [YT('LearnGermanwithAnja'), PL('PLYzp2xhTw9W1Z9RvnCoveC0W7pkwUMHXy')]),
  R('marija', 'Deutsch mit Marija', 'youtube', 'B1–C1', ['b1', 'b2'], FREE,
    T('ممتحِنة telc سابقة: نصائح الامتحان، B2 Sprechen، والكتابة.', 'A former telc examiner: exam tips, B2 speaking and writing.'), [YT('DeutschmitMarija'), PL('PL3o7sSg88Dn3dRLZPgsGlRdoDmsOX79kj'), PL('PL3o7sSg88Dn0u6xltU160L6N78oMg-JUI'), PL('PL3o7sSg88Dn0EZTysBToTed3nA6kDlEc1')]),
  # Podcasts
  R('coffeebreak', 'Coffee Break German', 'podcasts', 'A1–B1', ['a1', 'a2'], T('الصوت مجاني', 'Free audio'), T('دروس صوتية منظمة بالإنجليزية للمبتدئين، مثالية في الطريق.', 'Structured audio lessons in English for beginners, perfect on the go.'), ['https://coffeebreaklanguages.com/coffeebreakgerman/']),
  R('dwn', 'Deutsch – warum nicht? (DW)', 'podcasts', 'A1–A2', ['a1', 'a2'], FREE, T('دورة صوتية كلاسيكية من DW في 4 أجزاء.', 'A classic DW audio course in 4 series.'), ['https://learngerman.dw.com/en/deutsch-warum-nicht/s-2548']),
  R('slowgerman', 'Slow German (Annik Rubens)', 'podcasts', 'A2–B1', ['a2', 'b1'], T('حلقات مجانية', 'Free episodes'), T('قصص عن ألمانيا بنطق بطيء وواضح.', 'Slowly spoken stories about life in Germany.'), ['https://www.slowgerman.com/']),
  R('egpodcast', 'Easy German Podcast', 'podcasts', 'B1+', ['b1', 'b2'], T('مجاني (النصوص مدفوعة)', 'Free (transcripts paid)'), T('محادثات طبيعية عن الحياة في ألمانيا.', 'Natural conversations about life in Germany.'), ['https://www.easygerman.org/podcast', PL('PLk1fjOl39-52AXeDQz2WPVv-wZnkjldoX')]),
  # Reading
  R('nachrichtenleicht', 'nachrichtenleicht.de (Deutschlandfunk)', 'reading', 'A2–B1', ['a2', 'b1'], FREE, T('أخبار أسبوعية بلغة ألمانية بسيطة مع صوت وقاموس.', 'Weekly news in simple German with audio and a glossary.'), ['https://www.nachrichtenleicht.de/'], primary=True),
  R('logo', 'logo! (ZDF – Nachrichten für Kinder)', 'reading', 'A2–B1', ['a2', 'b1'], FREE, T('أخبار للأطفال بجمل قصيرة وفيديوهات: قراءة واستماع سهلان.', 'Kids news in short sentences with videos: easy reading and listening.'), ['https://www.logo.de']),
  R('topthema', 'DW Top-Thema', 'reading', 'B1–B2', ['b1', 'b2'], FREE, T('مقال أسبوعي من DW مع صوت ومفردات وأسئلة فهم.', 'A weekly DW article with audio, vocabulary and comprehension questions.'), ['https://learngerman.dw.com/de/top-thema/s-8031'], primary=True),
  R('lgn', 'DW Langsam gesprochene Nachrichten', 'reading', 'B2', ['b2'], FREE, T('أخبار يومية (الاثنين–السبت) بنطق بطيء مع النص الكامل: تمرين يومي ممتاز للقراءة والاستماع في B2.', 'Daily news (Mon–Sat) read slowly with the full transcript: an ideal daily B2 reading + listening drill.'), ['https://learngerman.dw.com/de/langsam-gesprochene-nachrichten/s-60040332'], primary=True),
  R('tagesschau', 'tagesschau.de', 'reading', 'B2', ['b2'], FREE, T('الأخبار الألمانية الأصلية: الهدف النهائي للقراءة والاستماع.', 'Authentic German news: the final goal for reading and listening.'), ['https://www.tagesschau.de/']),
  R('schubert', 'Schubert Verlag – Online-Aufgaben', 'reading', 'A1–C1', ALL, FREE, T('آلاف تمارين القواعد والمفردات المجانية لكل مستوى.', 'Thousands of free grammar and vocab exercises per level.'), ['https://www.schubert-verlag.de/aufgaben/']),
  R('deutschbuch', 'mein-deutschbuch.de + Lingolia', 'reading', 'A1–B2', ALL, FREE, T('شرح القواعد مع تمارين. Lingolia من أكثر المراجع توصية على r/German.', 'Grammar explanations with exercises. Lingolia is a top r/German recommendation.'), ['https://www.mein-deutschbuch.de', 'https://www.lingolia.com/de/']),
  # Speaking / writing
  R('italki', 'italki', 'speaking', 'A2+', ['a2', 'b1', 'b2'], T('حسب المعلم', 'varies by tutor'), T('معلم أسبوعي للمحادثة وتصحيح نصوص Bewerbung. ابحث عن معلم «Goethe B1 Prüfungsvorbereitung».', 'A weekly tutor for speaking and correcting your application texts. Search for "Goethe B1 Prüfungsvorbereitung".'), ['https://www.italki.com/en/teachers/german'], primary=True),
  R('tandem', 'Tandem', 'speaking', 'A2+', ['a2', 'b1', 'b2'], T('مجاني (اشتراك اختياري)', 'Free (optional premium)'), T('تبادل لغوي مجاني مع ألمان يتعلمون العربية أو الفرنسية.', 'Free language exchange with Germans learning Arabic or French.'), ['https://www.tandem.net/']),
  R('hellotalk', 'HelloTalk', 'speaking', 'A2+', ['a2', 'b1', 'b2'], T('مجاني (اشتراك اختياري)', 'Free (optional premium)'), T('رسائل صوتية ونصية مع متحدثين أصليين يصححون جملك.', 'Voice and text chats with native speakers who correct your sentences.'), ['https://www.hellotalk.com/']),
  R('languagetool', 'LanguageTool + DeepL Write', 'writing', 'A2+', ['a2', 'b1', 'b2'], T('مجاني (نسخ مدفوعة)', 'Free (paid tiers)'), T('مصحح إملائي ونحوي للألمانية. اكتب أولًا بنفسك، ثم صحّح، ثم انسخ الأخطاء إلى دفتر أخطائك.', 'German grammar and spelling checkers. Write yourself first, then check, then copy your mistakes into your error log.'), ['https://languagetool.org/de', 'https://www.deepl.com/write']),
  # Exams
  R('goethe-a1', 'Goethe-Zertifikat A1 – Übungsmaterial', 'exam', 'A1', ['a1'], FREE, T('مواد رسمية للمهارات الأربع: الاستماع والقراءة والكتابة والتحدّث. يضمّ الموقع نموذجًا تفاعليًا وملفات تدريب مع صوت.', 'Official practice for listening, reading, writing and speaking, with an interactive model and downloadable tests with audio.'), ['https://bfu.goethe.de/a1_sd1/', 'https://www.goethe.de/ins/de/de/prf/prf/gzsd1/ueb.html']),
  R('goethe-a2', 'Goethe-Zertifikat A2 – Modellsatz', 'exam', 'A2', ['a2'], FREE, T('نماذج رسمية مع الصوت.', 'Official model sets with audio.'), ['https://www.goethe.de/ins/de/de/prf/prf/gzsd2/ub2.html', 'https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Modellsatz_Erwachsene.pdf']),
  R('goethe-b1', 'Goethe-Zertifikat B1 – Modellsatz + Übungssatz', 'exam', 'B1', ['b1'], FREE, T('امتحانك المستهدف: نموذج تفاعلي وملفات PDF وصوت وفيديو للمحادثة.', 'Your target exam: interactive model set, PDFs, audio and a speaking video.'), ['https://bfu.goethe.de/b1_mod/', 'https://www.goethe.de/ins/de/de/prf/prf/gzb1/ueb.html', 'https://www.goethe.de/pro/relaunch/prf/materialien/B1/b1_modellsatz_erwachsene.pdf'], primary=True),
  R('goethe-b2', 'Goethe-Zertifikat B2 – Modellsatz', 'exam', 'B2', ['b2'], FREE, T('نموذج مع الحلول والنصوص ومعايير التقييم.', 'Model set with key, transcripts and assessment criteria.'), ['https://www.goethe.de/ins/de/de/prf/prf/gzb2/ue9.html', 'https://www.goethe.de/pro/relaunch/prf/materialien/B2/b2_modellsatz_erwachsene.pdf']),
  R('telc-b1', 'telc Deutsch B1 – Übungstest', 'exam', 'B1', ['b1'], T('تحميل مجاني', 'Free download'), T('امتحان telc تجريبي كامل مع الحلول (صيغة مختلفة: Sprachbausteine).', 'A full telc practice test with key (different format: Sprachbausteine).'), ['https://www.telc.net/sprachpruefungen/deutsch/zertifikat-deutsch-telc-deutsch-b1/']),
  R('telc-b2', 'telc Deutsch B2', 'exam', 'B2', ['b2'], T('تحميل مجاني', 'Free download'), T('صفحة telc B2 الرسمية مع اختبار تجريبي ونصائح التحضير.', 'Official telc B2 page with a practice test and preparation tips.'), ['https://www.telc.net/index.php?L=5&id=647&no_cache=1', 'https://www.telc.net/fileadmin/user_upload/pdfs/Handbuch_und_Tipps_fuer_Pruefungsvorbereitung/Deutsch_B2_tipps_zur_Pruefungsvorbereitung.pdf']),
  R('osd', 'ÖSD – Übungsmaterialien', 'exam', 'A2–B1', ['a2', 'b1'], FREE, T('ÖSD Zertifikat B1 منتج مشترك مع Goethe: نفس الصيغة ونماذج إضافية.', 'ÖSD Zertifikat B1 is a joint product with Goethe: same format, more practice sets.'), ['https://osd.at/portfolio-item/osd-zertifikat-a2-za2/', 'https://osd.at/wp-content/uploads/2026/09/ZB1-Uebungsmaterialien-Band-1_WEB.pdf', 'https://test-training-digital.osd.at/']),
  R('goethe-ma', 'Goethe-Institut Marokko (الرباط / الدار البيضاء)', 'exam', 'A1–C2', ALL, T('B1: 2500 درهم (مترشح خارجي) · A1: 1950 · A2: 2000 · B2: 2800', 'B1: 2,500 MAD (external) · A1: 1,950 · A2: 2,000 · B2: 2,800'),
    T('سجّل فقط عبر المتجر الإلكتروني الرسمي. المعهد يحذّر من الوسطاء ولا يراسل إلا من عناوين @goethe.de. تقويم 2026/27 فيه دورات B1 في أوائل يونيو ويوليو 2027.', 'Register only in the official webshop. The institute warns against agents and only emails from @goethe.de. The 2026/27 calendar has B1 sessions in early June and July 2027.'),
    ['https://www.goethe.de/ins/ma/de/spr/prf.html', 'https://www.goethe.de/ins/ma/de/spr/prf/anm.html', 'https://www.goethe.de/resources/files/pdf359/pruefungskalender-2026-27.pdf'], primary=True),
  # Ausbildung
  R('miig', 'Make it in Germany', 'ausbildung', '—', ALL, FREE, T('البوابة الرسمية: كيف يعمل التكوين المهني، الشروط، والتأشيرة (اللغة الألمانية B1 على الأقل في الغالب).', 'Official portal: how an Ausbildung works, requirements, and the visa (usually at least B1 German).'),
    ['https://www.make-it-in-germany.com/de/', 'https://www.make-it-in-germany.com/en/study-training/training-in-germany', 'https://www.make-it-in-germany.com/en/visa-residence/types/vocational-training'], primary=True),
  R('ba', 'Bundesagentur für Arbeit – Jobsuche + BERUFENET', 'ausbildung', '—', ['a2', 'b1', 'b2'], FREE, T('منصة الوظائف الرسمية: اختر «Ausbildung» وابحث عن «Fachinformatiker/in – Anwendungsentwicklung».', 'The official job board: filter "Ausbildung" and search "Fachinformatiker/in – Anwendungsentwicklung".'),
    ['https://www.arbeitsagentur.de/jobsuche/', 'https://web.arbeitsagentur.de/berufenet/'], primary=True),
  R('boards', 'Ausbildung.de + AZUBIYO + planet-beruf', 'ausbildung', '—', ['a2', 'b1', 'b2'], FREE, T('منصات كبيرة لعروض التكوين ونصائح كتابة الطلب.', 'Large apprenticeship boards with application tips.'), ['https://www.ausbildung.de/', 'https://www.azubiyo.de/', 'https://www.planet-beruf.de/']),
  R('visa', 'Auswärtiges Amt – Visum Ausbildung + Botschaft Rabat', 'ausbildung', '—', ['b1', 'b2'], T('رسوم حسب السفارة', 'fee per embassy'), T('العقد + B1 (أو تأكيد من الشركة) + إثبات التمويل.', 'Contract + B1 (or company confirmation) + proof of funds.'), ['https://digital.diplo.de/aus-und-weiterbildung', 'https://rabat.diplo.de/']),
  R('recognition', 'anabin + Anerkennung in Deutschland', 'ausbildung', '—', ['a2', 'b1'], FREE, T('تحقق من معادلة الباكالوريا و Bac+2 في ألمانيا.', 'Check how your Bac and Bac+2 are recognised in Germany.'), ['https://anabin.kmk.org/', 'https://www.anerkennung-in-deutschland.de/']),
  R('europass', 'Europass', 'ausbildung', '—', ['a2', 'b1'], FREE, T('محرر سيرة ذاتية أوروبي؛ الشركات الألمانية تفضّل Lebenslauf جدولي.', 'EU CV editor; German companies prefer a tabular Lebenslauf.'), ['https://europass.europa.eu/de'], optional=True),
]
