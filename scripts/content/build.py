#!/usr/bin/env python3
"""Single source of truth → src/content/gen/*.json + /workspace/german-plan.md. Run: python3 scripts/content/build.py"""
import json, os, re, sys, datetime as dt
sys.path.insert(0, os.path.dirname(__file__))
from common import ROOT, T, load_video_ids, load_word_ids
import lessons_a1a, lessons_a1b, lessons_a1c, lessons_a2, journey, tracks, exams, plan, resources

OUT = os.path.join(ROOT, 'src', 'content', 'gen')
os.makedirs(OUT, exist_ok=True)
errors = []

# ---------- load registries
vsrc = open(os.path.join(ROOT, 'src', 'content', 'videos.ts'), encoding='utf-8').read()
VIDEOS = {}
for line in vsrc.split('\n'):
    m = re.match(r'\s+"([^"]+)": \{ id: "[^"]+", kind: \'(\w+)\', title: "((?:[^"\\]|\\.)*)", channel: "((?:[^"\\]|\\.)*)"(, arabic: true)?', line)
    if m: VIDEOS[m.group(1)] = dict(kind=m.group(2), title=m.group(3).replace('\\"', '"'), channel=m.group(4), arabic=bool(m.group(5)))
WORDS = load_word_ids()
RES = {r['id']: r for r in resources.RESOURCES}

def check_videos(where, ids, arabic_first=True):
    for v in ids:
        if v not in VIDEOS: errors.append(f'{where}: unknown video {v}')
    if arabic_first and ids and ids[0] in VIDEOS and not VIDEOS[ids[0]]['arabic']:
        errors.append(f'{where}: first video {ids[0]} is not Arabic-taught')
    if arabic_first and not ids: errors.append(f'{where}: no video')

def check_res(where, ids):
    for r in ids:
        if r not in RES: errors.append(f'{where}: unknown resource {r}')

# ---------- lessons
LESSONS = sorted(lessons_a1a.L + lessons_a1b.L + lessons_a1c.L + lessons_a2.L, key=lambda l: l['order'])
for l in LESSONS:
    check_videos(f"lesson {l['id']}", l['videos']); check_res(f"lesson {l['id']}", l['resources'])
    for w in l['vocab']:
        if w not in WORDS: errors.append(f"lesson {l['id']}: unknown word {w}")
LESSON_IDS = {l['id'] for l in LESSONS}

# ---------- journey
START1 = dt.date(2026, 11, 11); START2 = dt.date(2026, 11, 16)
DOW_AR = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد']
MONTH_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
fmt_ar = lambda d: f'{d.day} {MONTH_AR[d.month-1]} {d.year}'
fmt_en = lambda d: d.strftime('%-d %b %Y')
DRILLS = tracks.TRACKS[0]['drills']
PROMPTS = tracks.TRACKS[1]['prompts']

ROUTINE = {  # concrete daily routines per skill and phase (minutes, steps)
 'sprechen': {
  'a1': (15, [T('Shadowing: كرّر حوار الدرس/الحلقة 5 مرات (10 د).', 'Shadowing: repeat the lesson/episode dialogue 5 times (10 min).'), T('زوجا نطق اليوم: {drill} (3 د).', 'Pronunciation pair of the day: {drill} (3 min).'), T('سجّل جوابك على سؤال الأسبوع (دقيقة واحدة).', 'Record your answer to the weekly prompt (1 min).')]),
  'a2': (20, [T('Shadowing 5 د من Easy German / Nicos Weg A2.', 'Shadowing 5 min from Easy German / Nicos Weg A2.'), T('Selbstgespräch: احكِ يومك في Perfekt (3 د).', 'Self-talk: tell your day in Perfekt (3 min).'), T('سؤال الأسبوع: سجّل دقيقتين وصحّح 3 أخطاء.', 'Weekly prompt: record 2 minutes and fix 3 mistakes.'), T('حصة italki أو Tandem مرة في الأسبوع (السبت).', 'One italki or Tandem session a week (Saturday).')]),
  'b1': (25, [T('Shadowing 5 د من Easy German Podcast.', 'Shadowing 5 min from Easy German Podcast.'), T('سؤال الأسبوع: 3 دقائق بدون ورقة + تقييم ذاتي.', 'Weekly prompt: 3 minutes without notes + self-assessment.'), T('Redemittel الامتحان: احفظ 3 عبارات وقلها في جمل.', 'Exam Redemittel: memorise 3 phrases and use them.'), T('معلم أو Tandem مرتين في الأسبوع.', 'Tutor or Tandem twice a week.')]),
  'b2': (30, [T('3 دقائق كلام حر عن خبر اليوم.', '3 minutes of free speech about today\'s news.'), T('سؤال الأسبوع: 4 دقائق بصيغة الامتحان.', 'Weekly prompt: 4 minutes in exam format.'), T('نقاش مع/ضد مع شريك أو معلم (مرتان أسبوعيًا).', 'Pro/contra discussion with a partner or tutor (twice a week).')])},
 'schreiben': {
  'a1': (15, [T('يوميات: 5 جمل عن «{prompt}».', 'Journal: 5 sentences on "{prompt}".'), T('صحّح بـ LanguageTool وانقل الأخطاء إلى دفتر الأخطاء.', 'Check with LanguageTool and log mistakes.'), T('السبت: مهمة الأسبوع.', 'Saturday: the weekly task.')]),
  'a2': (20, [T('يوميات 60 كلمة عن «{prompt}».', 'Journal: 60 words on "{prompt}".'), T('صحّح بـ LanguageTool + دفتر الأخطاء.', 'LanguageTool + error log.'), T('السبت: مهمة الأسبوع، يصححها المعلم أو الشريك.', 'Saturday: the weekly task, corrected by a tutor/partner.')]),
  'b1': (25, [T('80 كلمة بصيغة الامتحان عن «{prompt}» في 20 دقيقة.', '80 words in exam format on "{prompt}" in 20 minutes.'), T('قارن مع DeepL Write ودوّن 3 صياغات أفضل.', 'Compare with DeepL Write and note 3 better phrasings.'), T('مهمة الأسبوع مصححة من المعلم.', 'Weekly task corrected by the tutor.')]),
  'b2': (30, [T('150 كلمة عن «{prompt}».', '150 words on "{prompt}".'), T('صحّح وأعد كتابة الفقرة الأضعف.', 'Correct and rewrite the weakest paragraph.'), T('مهمة الأسبوع بصيغة الامتحان.', 'Weekly task in exam format.')])},
 'hoeren': {
  'a1': (25, [T('استماع مركّز (3 مرات) لمادة الأسبوع.', 'Intensive listening (3 passes) of the week\'s material.'), T('إملاء: 5 جمل من الحلقة أو من تمارين الاستماع في التطبيق.', 'Dictation: 5 sentences from the episode or in-app listening.'), T('استماع واسع في المواصلات: Coffee Break German.', 'Extensive listening on the go: Coffee Break German.')]),
  'a2': (25, [T('استماع مركّز لمادة الأسبوع.', 'Intensive listening of the week\'s material.'), T('إملاء 5 جمل.', 'Dictate 5 sentences.'), T('Slow German أو Easy German في المواصلات.', 'Slow German or Easy German on the go.')]),
  'b1': (30, [T('مادة الأسبوع بدون ترجمة ثم مع الترجمة.', 'The week\'s material without, then with subtitles.'), T('إملاء فقرة واحدة (5 د).', 'Dictate one paragraph (5 min).'), T('جزء Hören واحد من Modellsatz كل يومين.', 'One Modellsatz Hören part every other day.')]),
  'b2': (30, [T('Langsam gesprochene Nachrichten + الملخص شفهيًا.', 'Langsam gesprochene Nachrichten + an oral summary.'), T('جزء Hören B2 كل يومين.', 'One B2 Hören part every other day.'), T('بودكاست بدون نص.', 'A podcast without transcript.')])},
 'lesen': {
  'a1': (15, [T('اقرأ نص الأسبوع بصوت عالٍ ولوّن الأدوات.', 'Read the week\'s text aloud and colour the articles.'), T('استخرج جملتين إلى Anki.', 'Mine two sentences into Anki.'), T('اقرأ نص الوحدة في التطبيق وأجب عن أسئلته.', 'Read the unit text in the app and answer its questions.')]),
  'a2': (20, [T('مقال nachrichtenleicht واحد يوميًا.', 'One nachrichtenleicht article a day.'), T('استخرج جملتين إلى Anki.', 'Mine two sentences into Anki.'), T('لخّص المقال في 3 جمل.', 'Summarise the article in 3 sentences.')]),
  'b1': (25, [T('مقال Top-Thema + الأسئلة.', 'A Top-Thema article + questions.'), T('جزء Lesen واحد من Modellsatz كل يومين.', 'One Modellsatz Lesen part every other day.'), T('3 جمل إلى Anki.', '3 sentences into Anki.')]),
  'b2': (25, [T('مقال tagesschau.de + ملخص كتابي.', 'A tagesschau.de article + a written summary.'), T('جزء Lesen B2 كل يومين.', 'One B2 Lesen part every other day.'), T('5 مصطلحات IT جديدة.', '5 new IT terms.')])},
}
SKILL_GOAL = {
 'sprechen': lambda w: T(f'أتكلم بثقة عن: {w["speak"]}', f'I can speak confidently about: {w["speak"]}'),
 'schreiben': lambda w: T(f'أكتب: {w["write"]}', f'I can write: {w["write"]}'),
 'hoeren': lambda w: T('أفهم مادة الأسبوع: ' + w['listen']['ar'], 'I understand this week\'s material: ' + w['listen']['en']),
 'lesen': lambda w: T('أقرأ وأفهم: ' + w['read']['ar'], 'I can read and understand: ' + w['read']['en']),
}

def fill(t, **kw):
    return {k: v.format(**kw) for k, v in t.items()}

WEEKS = []
for i, w in enumerate(journey.WEEKS):
    n = i + 1
    start = START1 if n == 1 else START2 + dt.timedelta(days=7 * (n - 2))
    end = dt.date(2026, 11, 15) if n == 1 else start + dt.timedelta(days=6)
    ph = w['phase']
    drill = DRILLS[i % len(DRILLS)]; drill2 = DRILLS[(i + 3) % len(DRILLS)]
    prompts = PROMPTS[ph]; prompt = prompts[i % len(prompts)]
    skills = {}
    for sk in ['sprechen', 'schreiben', 'hoeren', 'lesen']:
        mins, steps = ROUTINE[sk][ph]
        skills[sk] = dict(goal=SKILL_GOAL[sk](w), minutes=mins,
                          daily=[fill(s, drill=f"{drill['a']} / {drill['b']} · {drill2['a']} / {drill2['b']}", prompt=prompt) for s in steps],
                          task=dict(sprechen=w['speak'], schreiben=w['write']).get(sk), material=dict(hoeren=w['listen'], lesen=w['read']).get(sk))
    tasks = [dict(id=f'l-{l}', kind='lesson', ref=l) for l in w['lessons']]
    tasks += [dict(id='nicos', kind='nicos', label=T(w['nicos'], w['nicos'])), dict(id='book', kind='book', label=T(w['book'], w['book'])),
              dict(id='speak', kind='speak', label=T('سؤال المحادثة مسجَّل', 'Speaking prompt recorded')),
              dict(id='write', kind='write', label=T('مهمة الكتابة مصححة', 'Writing task corrected')),
              dict(id='listen', kind='listen', label=w['listen']), dict(id='read', kind='read', label=w['read']),
              dict(id='test', kind='test', label=w['test'])]
    for l in w['lessons']:
        if l not in LESSON_IDS: errors.append(f'week {n}: unknown lesson {l}')
    check_videos(f'week {n}', w['videos'])
    WEEKS.append(dict(n=n, phase=ph, emoji=w['emoji'], title=w['title'], titleDe=w['titleDe'], start=start.isoformat(), end=end.isoformat(),
                      dates=T(f'{fmt_ar(start)} – {fmt_ar(end)}', f'{fmt_en(start)} – {fmt_en(end)}'),
                      grammar=w['grammar'], vocab=w['vocab'], nicos=w['nicos'], book=w['book'], lessons=w['lessons'], videos=w['videos'],
                      speak=w['speak'], write=w['write'], skills=skills, test=w['test'], readTask=w['readTask'], extra=w['extra'], tasks=tasks,
                      drills=[drill, drill2], prompt=prompt))

# ---------- tracks, exams, resources
for t in tracks.TRACKS:
    for m in t['methods']:
        check_videos(f"track {t['key']}/{m['id']}", m['videos'], arabic_first=False); check_res(f"track {t['key']}/{m['id']}", m['res'])
for e in exams.EXAMS:
    check_videos(f"exam {e['id']}", e['videos']); check_res(f"exam {e['id']}", [e['res']])
for p in plan.PHASES: pass

if errors:
    print('\n'.join(errors)); sys.exit(1)

def dump(name, data):
    with open(os.path.join(OUT, name), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

dump('lessons.json', LESSONS)
dump('journey.json', WEEKS)
dump('tracks.json', tracks.TRACKS)
for e in exams.EXAMS: e['pass'] = e.pop('pass_')
dump('exams.json', dict(exams=exams.EXAMS, redemittel=exams.REDEMITTEL, practice=exams.PRACTICE))
dump('plan.json', dict(phases=plan.PHASES, milestones=plan.MILESTONES, activities=[dict(key=k, label=l, skill=s) for k, l, s in plan.ACTIVITIES],
                       daily=plan.DAILY, weekly=plan.WEEKLY, pitfalls=[dict(pitfall=a, why=b, fix=c) for a, b, c in plan.PITFALLS],
                       budget=[dict(item=a, cost=b) for a, b in plan.BUDGET]))
dump('resources.json', resources.RESOURCES)

# ---------- markdown plan (Arabic first)
V = lambda v: f"[{VIDEOS[v]['title']}](https://www.youtube.com/watch?v={v}) — {VIDEOS[v]['channel']}{' 🇸🇦' if VIDEOS[v]['arabic'] else ''}"
SK = dict(sprechen='🗣️ المحادثة (Sprechen)', schreiben='✍️ الكتابة (Schreiben)', hoeren='🎧 الاستماع (Hören)', lesen='📖 القراءة (Lesen)')
md = []
A = md.append
A('# رحلة · Rihla — خطة الألمانية من الصفر إلى B2 للتكوين المهني في ألمانيا')
A('')
A('> **Fachinformatiker für Anwendungsentwicklung** · البداية 11 نوفمبر 2026 · A2 مارس 2027 · امتحان Goethe B1 يونيو 2027 · بداية Ausbildung 1 سبتمبر 2027 (بديل: 1 سبتمبر 2028)')
A('>')
A('> *German plan from zero to B2 for an Ausbildung in Germany. Arabic first; English summary in each heading.*')
A('')
A('هذا الملف مولَّد من نفس بيانات التطبيق (`scripts/content/build.py`)، فالتطبيق والخطة متطابقان دائمًا. كل روابط يوتيوب تم التحقق منها عبر oEmbed، و🇸🇦 تعني فيديو يشرح الألمانية بالعربية.')
A('')
A('## المحطات الكبرى (Milestones)')
A('')
A('| التاريخ | المحطة | ملاحظة |'); A('|---|---|---|')
for m in plan.MILESTONES: A(f"| {m['date']} | {m['emoji']} {m['title']['ar']} | {m['note']['ar']} |")
A('')
A('## المراحل (Phases)')
for p in plan.PHASES:
    A(''); A(f"### {p['label']} — {p['dates']['ar']} · ~{p['hours']} ساعة")
    A(f"- **الكتاب:** {p['book']}"); A(f"- **اختبار المرحلة:** {p['test']['ar']}"); A('- **ماذا أستطيع في النهاية (Can-do):**')
    for c in p['can']: A(f"  - {c['ar']}")
    A('- **قائمة التحقق:**')
    for c in p['checks']: A(f"  - [ ] {c['ar']}")
A('')
A('## اليوم النموذجي (ساعتان، و3 ساعات إن أمكن)')
A(''); A('| الوقت | الدقائق | النشاط | A1 | A2 | B1 | B2 |'); A('|---|---|---|---|---|---|---|')
for d in plan.DAILY: A(f"| {d['time']} | {d['minutes']} | {d['title']['ar']} | " + ' | '.join(d['by'][k]['ar'] for k in ['a1', 'a2', 'b1', 'b2']) + ' |')
A(''); A('**الأسبوع النموذجي:**'); A('')
for wk in plan.WEEKLY: A(f"- **{wk['day']['ar']}** ({wk['time']['ar']}): {wk['focus']['ar']}")
A('')
A('## الرحلة أسبوعًا بأسبوع (Week-by-week journey)')
lesson_by = {l['id']: l for l in LESSONS}
cur = None
for w in WEEKS:
    if w['phase'] != cur:
        cur = w['phase']; A(''); A(f"## المستوى {cur.upper()}")
    A(''); A(f"### الأسبوع {w['n']} · {w['emoji']} {w['title']['ar']} — *{w['titleDe']}*")
    A(f"*{w['dates']['ar']} · Week {w['n']}: {w['title']['en']}*"); A('')
    if w['extra']: A(f"> {w['extra']['ar']}"); A('')
    A(f"- **القواعد:** " + '، '.join(g['ar'] for g in w['grammar']))
    A(f"- **المفردات:** " + '، '.join(v['ar'] for v in w['vocab']))
    A(f"- **Nicos Weg:** {w['nicos']}"); A(f"- **الكتاب:** {w['book']}")
    if w['lessons']: A('- **دروس التطبيق:** ' + '، '.join(f"{lesson_by[l]['title']['ar']} ({lesson_by[l]['titleDe']})" for l in w['lessons']))
    A('- **فيديوهات (مُتحقَّق منها):**')
    for v in w['videos']: A(f'  - {V(v)}')
    for sk in ['sprechen', 'schreiben', 'hoeren', 'lesen']:
        s = w['skills'][sk]
        A(f"- **{SK[sk]}** — {s['minutes']} د/يوم · الهدف: {s['goal']['ar']}")
        for st in s['daily']: A(f"  - {st['ar']}")
    A(f"- **🧪 اختبار الأسبوع:** {w['test']['ar']}")
A('')
A('## مسارات المهارات (Skill tracks)')
for t in tracks.TRACKS:
    A(''); A(f"### {t['title']['ar']} ({t['de']})"); A(''); A(t['intro']['ar']); A('')
    for m in t['methods']:
        A(f"**{m['title']['ar']}** — {m['minutes']} د. {m['why']['ar']}"); A('')
        for i, s in enumerate(m['steps'], 1): A(f"{i}. {s['ar']}")
        if m['res']: A('   - الموارد: ' + '، '.join(f"[{RES[r]['name']}]({RES[r]['urls'][0]})" for r in m['res']))
        for v in m['videos']: A(f'   - {V(v)}')
        A('')
    if 'drills' in t:
        A('**أزواج النطق للناطقين بالعربية:**'); A(''); A('| الكلمة 1 | الكلمة 2 | المعنى | النصيحة |'); A('|---|---|---|---|')
        for d in t['drills']: A(f"| {d['a']} | {d['b']} | {d['ar']} | {d['tip']['ar']} |")
        A('')
    if 'prompts' in t:
        A('**مواضيع اليوميات حسب المستوى:**'); A('')
        for lv, ps in t['prompts'].items(): A(f"- {lv.upper()}: " + ' · '.join(ps))
        A(''); A('**بنية Lebenslauf:**'); A('')
        for x in t['lebenslauf']: A(f"- {x['ar']}")
        A(''); A('**نموذج Anschreiben (للتعديل حسب كل شركة):**'); A(''); A('```'); A(t['anschreiben']); A('```'); A('')
    A('**السلّم حسب المستوى:**'); A('')
    for l in t['ladder']: A(f"- **{l['level']}:** " + '، '.join(x['ar'] for x in l['items']) + f" ← الهدف: {l['goal']['ar']}")
A('')
A('## الامتحانات: Goethe و telc (B1 و B2)')
for e in exams.EXAMS:
    A(''); A(f"### {e['name']}"); A(''); A(e['pass']['ar'] if 'pass' in e else ''); A('')
    A('| الجزء | المدة | المحتوى | الاستراتيجية |'); A('|---|---|---|---|')
    for p in e['parts']: A(f"| {p['name']} | {p['minutes']} د | {p['detail']['ar']} | {p['strategy']['ar']} |")
    A(''); A(f"- النماذج الرسمية: {RES[e['res']]['urls'][0]}")
    for v in e['videos']: A(f'- {V(v)}')
A(''); A('### عبارات جاهزة (Redemittel)')
for lv, groups in exams.REDEMITTEL.items():
    A(''); A(f'**{lv.upper()}**')
    for g, items in groups: A(f"- *{g}:* " + ' · '.join(items))
A('')
A('## أخطاء شائعة عند الناطقين بالعربية')
A(''); A('| الخطأ | لماذا | الحل |'); A('|---|---|---|')
for a, b, c in plan.PITFALLS: A(f"| {a['ar']} | {b['ar']} | {c['ar']} |")
A('')
A('## الموارد (مختارة بعناية ومُتحقَّق منها)')
TYPES = dict(course='الدورات', books='الكتب', vocab='المفردات', arabic='بالعربية / الدارجة', youtube='يوتيوب', podcasts='البودكاست', reading='القراءة', speaking='المحادثة', writing='الكتابة', exam='الامتحانات', ausbildung='التكوين المهني والتأشيرة')
for ty, label in TYPES.items():
    rs = [r for r in resources.RESOURCES if r['type'] == ty]
    if not rs: continue
    A(''); A(f'### {label}')
    for r in rs: A(f"- **[{r['name']}]({r['urls'][0]})** ({r['level']} · {r['cost']['ar']}) — {r['why']['ar']}")
A('')
A('## الميزانية')
A(''); A('| البند | التكلفة |'); A('|---|---|')
for a, b in plan.BUDGET: A(f"| {a['ar']} | {b} |")
A('')
A('---'); A('*تم التحقق من الروابط يوم 11 نوفمبر 2026. goethe.de يمنع الزيارات الآلية (403)، لذلك تم التحقق من صفحاته عبر نتائج البحث. تأكد دائمًا من تواريخ الامتحانات في تقويم Goethe-Institut Marokko.*')
open('/workspace/german-plan.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(f'OK: {len(LESSONS)} lessons, {len(WEEKS)} weeks, {len(tracks.TRACKS)} tracks, {len(exams.EXAMS)} exams, {len(exams.PRACTICE)} practice sets, {len(resources.RESOURCES)} resources; plan.md {len(md)} lines')
