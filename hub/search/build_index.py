"""Build hub/search/search-index.js, the index the Hub search page reads.

Run from the repo root after any page's title, description or headings change:
    python hub/search/build_index.py

One row per real page (redirect stubs, checkout, the design system and pages that
are deliberately unlinked are skipped), plus the Hub's gut articles, which live as
sections of the complete gut guide and link to their own anchor there.
"""
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BASE = '/phenome-store/'
SKIP = ('design-system/', 'quiz/', 'find-your-test/', 'store/checkout/', 'hub/search/', 'supplements/index.html')

# (path prefix, filter tags, meta label). First match wins.
KIND = [
    ('hub/gut-guide/', ['Guides', 'Gut'], 'Longevity Hub, Guide'),
    ('hub/', ['Guides'], 'Longevity Hub'),
    ('testing/gut-microbiome/', ['Gut'], 'Testing'),
    ('testing/oral-microbiome/', ['Oral'], 'Testing'),
    ('testing/microbiome/', ['Gut', 'Oral'], 'Testing'),
    ('store/microbiome/', ['Gut', 'Oral'], 'Store'),
    ('testing/sports-performance/', ['Genetic', 'Sport'], 'Testing'),
    ('testing/', ['Genetic'], 'Testing'),
    ('store/genetic/', ['Genetic'], 'Store'),
    ('science/whole-genome-sequencing/', ['Genetic'], 'Science'),
    ('science/', [], 'Science'),
    ('supplements/', ['Supplements'], 'Supplements'),
    ('store/supplements/', ['Supplements'], 'Store'),
    ('store/', [], 'Store'),
    ('devices/', [], 'Devices'),
    ('app/', [], 'App'),
    ('account/', [], 'Your account'),
    ('clinic/', [], 'Clinic'),
    ('', [], 'Phenome'),
]
# testing/genetic and testing/ hub are not only genetic
OVERRIDE = {'testing/': ['Genetic', 'Gut', 'Oral'], 'testing/how-it-works/': ['Genetic', 'Gut', 'Oral']}

# The Hub's gut articles: words as the Hub search listed them, each linked to the
# section of the complete guide that covers it.
GUT = 'hub/gut-guide/'
HUB = [
    ('Why am I constantly bloated?', 'Persistent bloating that won’t settle can point to how your gut is digesting food and where the balance may be off. Here’s what constant bloating means and when to look deeper.', 'Gut health, Longevity Hub  ›  Gut Health, 4 min read', GUT + '#signs', ['Gut']),
    ('7 signs of an unhealthy gut', 'Bloating and gas, irregular bowel movements, skin issues, low mood and fatigue, the most common signals your gut is out of balance.', 'Gut health, Longevity Hub  ›  Gut Health, 5 min read', GUT + '#signs', ['Gut']),
    ('How to Improve Your Gut Health: The Complete Guide', 'Your complete guide to a healthier gut: the signs (including bloating), what throws it off, the foods that help, and how to know what your gut actually needs.', 'Gut health, Guide, Longevity Hub  ›  Gut Health, 9 min read', GUT, ['Guides', 'Gut']),
    ('What causes an unhealthy gut?', 'Low fibre diets, frequent antibiotics, ongoing stress and poor sleep can quietly throw off your balance, often showing up first as bloating.', 'Gut health, Longevity Hub  ›  Gut Health, 4 min read', GUT + '#causes', ['Gut']),
    ('Best foods for gut health', 'Fibre rich, fermented, prebiotic and polyphenol rich foods feed your good bacteria and can ease bloating over time.', 'Gut health, Longevity Hub  ›  Gut Health, 6 min read', GUT + '#foods', ['Gut']),
    ('What is gut dysbiosis?', 'When your gut microbiome loses its balance, symptoms like bloating, irregularity and low energy can follow. Here’s what dysbiosis really means.', 'Gut health, Longevity Hub  ›  Gut Health, 5 min read', GUT + '#body', ['Gut']),
    ('What are the 4 Rs of gut healing?', 'Remove, Replace, Reinoculate, Repair, a simple framework often used to calm bloating and rebuild a healthier gut.', 'Gut health, Longevity Hub  ›  Gut Health, 6 min read', GUT + '#naturally', ['Gut']),
]


def clean(t):
    t = re.sub(r'<(script|style|svg|template)\b.*?</\1>', ' ', t, flags=re.S)
    t = re.sub(r'<!--.*?-->', ' ', t, flags=re.S)
    t = re.sub(r'<[^>]+>', ' ', t)
    return re.sub(r'\s+', ' ', html.unescape(t)).strip()


def kind(rel):
    if rel in OVERRIDE:
        return OVERRIDE[rel], 'Testing'
    for pre, tags, label in KIND:
        if rel.startswith(pre):
            return tags, label
    return [], 'Phenome'


rows = []
for dp, dn, fn in os.walk(ROOT):
    dn[:] = [d for d in dn if not d.startswith('.') and d not in ('assets', 'kit', 'node_modules')]
    if 'index.html' not in fn:
        continue
    path = os.path.join(dp, 'index.html')
    rel = os.path.relpath(dp, ROOT).replace('\\', '/')
    rel = '' if rel == '.' else rel + '/'
    if any(rel.startswith(s) or (rel + 'index.html') == s for s in SKIP):
        continue
    s = open(path, encoding='utf-8').read()
    if 'location.replace' in s or 'http-equiv="refresh"' in s:
        continue
    title = re.search(r'<title>(.*?)</title>', s, re.S)
    title = clean(title.group(1)) if title else rel
    title = re.split(r',\s*(?:Phenome|Longevity Hub)\b', title)[0].strip() or title
    if rel == '':
        title = 'Phenome Longevity'
    desc = re.search(r'<meta content="([^"]*)" name="description"', s) or re.search(r'<meta name="description" content="([^"]*)"', s)
    desc = html.unescape(desc.group(1)) if desc else ''
    main = re.search(r'<main[^>]*>(.*?)</main>', s, re.S)
    main = main.group(1) if main else ''
    heads = [clean(h) for h in re.findall(r'<h[1-3][^>]*>(.*?)</h[1-3]>', main, re.S)]
    body = clean(main)[:1600]
    tags, label = kind(rel)
    rows.append({'t': title, 'd': desc, 'm': label, 'u': BASE + rel, 'c': tags,
                 'k': ' '.join(heads) + ' ' + body})

for t, d, m, u, c in HUB:
    rows.append({'t': t, 'd': d, 'm': m, 'u': BASE + u, 'c': c, 'k': '', 'hub': 1})

rows.sort(key=lambda r: (not r.get('hub'), r['u']))
out = os.path.join(ROOT, 'hub', 'search', 'search-index.js')
with open(out, 'w', encoding='utf-8', newline='') as f:
    f.write('/* Generated by hub/search/build_index.py, do not edit by hand. */\n')
    f.write('window.PH_SEARCH = ' + json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + ';\n')
print(len(rows), 'rows ->', out, os.path.getsize(out), 'bytes')
