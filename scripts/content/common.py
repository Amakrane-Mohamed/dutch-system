# Shared helpers for the content generator. Every user-facing explanation is bilingual:
# {"ar": Modern Standard Arabic (primary), "en": English (secondary)}. German stays German.
import os, re

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def T(ar, en):
    return {'ar': ar, 'en': en}

def ex(de, ar, en, dar=None):
    d = {'de': de, 'ar': ar, 'en': en}
    if dar: d['dar'] = dar
    return d

def text(ar, en): return {'type': 'text', 'md': T(ar, en)}
def tip(ar, en): return {'type': 'tip', 'md': T(ar, en)}
def examples(*items): return {'type': 'examples', 'items': list(items)}
def sounds(title, *items): return {'type': 'sounds', 'title': title, 'items': [{'de': de, 'ar': ar, 'tip': t} for de, ar, t in items]}
def table(columns, rows): return {'type': 'table', 'columns': columns, 'rows': rows}

def mc(q, options, answer, explain=None):
    d = {'type': 'mc', 'q': q, 'options': options, 'answer': answer}
    if explain: d['explain'] = explain
    return d
def fill(q, answers, hint=None, explain=None):
    d = {'type': 'fill', 'q': q, 'answers': answers}
    if hint: d['hint'] = hint
    if explain: d['explain'] = explain
    return d
def order(mean, words, answers, explain=None):
    d = {'type': 'order', 'mean': mean, 'words': words, 'answers': answers}
    if explain: d['explain'] = explain
    return d
def art(word, article, ar, en):
    return {'type': 'article', 'word': word, 'article': article, 'mean': T(ar, en), 'explain': T(f'{article} {word} = {ar}', f'{article} {word} = {en}')}
def listen(text_, mean, options=None, answer=None, q=None):
    d = {'type': 'listen', 'text': text_, 'mean': mean}
    if options: d['options'] = options
    if answer: d['answer'] = answer
    if q: d['q'] = q
    return d
def speak(text_, mean): return {'type': 'speak', 'text': text_, 'mean': mean}
def translate(src, answers, explain=None):
    d = {'type': 'translate', 'src': src, 'answers': answers}
    if explain: d['explain'] = explain
    return d
def write(prompt, min_words, checklist, model):
    return {'type': 'write', 'task': {'prompt': prompt, 'minWords': min_words, 'checklist': checklist, 'model': model}}

def load_video_ids():
    ids = set()
    for line in open(os.path.join(ROOT, 'src', 'content', 'videos.ts'), encoding='utf-8'):
        m = re.match(r'\s+"([^"]+)": \{ id:', line)
        if m: ids.add(m.group(1))
    return ids

def load_word_ids():
    src = open(os.path.join(ROOT, 'src', 'content', 'vocab.ts'), encoding='utf-8').read()
    raw = src.split('const RAW = `', 1)[1].split('`', 1)[0]
    ids = set()
    for line in raw.strip().split('\n'):
        de = line.split('|')[0].strip()
        ids.add(re.sub(r'^-|-$', '', re.sub(r'[^A-Za-z0-9äöüÄÖÜß]+', '-', de)))
    return ids
