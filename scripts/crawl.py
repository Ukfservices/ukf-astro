import urllib.request
import urllib.parse
import json
from html.parser import HTMLParser

BASE = "https://ukfservices.com"
visited = set()
broken = []
orphans = {}
inbound = {}

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag == "a":
            for k, v in attrs:
                if k == "href" and v:
                    self.links.append(v)

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "UKF-LinkChecker/1.0"})
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:
        return 0, ""

def crawl(url):
    if url in visited:
        return
    visited.add(url)
    status, html = fetch(url)
    if status != 200:
        broken.append((url, status))
        return
    parser = LinkParser()
    parser.feed(html)
    links = []
    for href in parser.links:
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:"):
            continue
        if href.startswith("/"):
            full = BASE + href.split("?")[0].split("#")[0]
        elif href.startswith("http"):
            continue
        else:
            continue
        links.append(full)
        inbound.setdefault(full, set()).add(url)
    orphans[url] = links
    for link in links:
        crawl(link)

print("Crawling site... this may take 1-2 minutes")
crawl(BASE + "/")

print("\n=== BROKEN LINKS ===")
if broken:
    for url, code in broken:
        print(f"  {code}  {url}")
else:
    print("  None found")

print("\n=== ORPHAN PAGES (no inbound links) ===")
for url in visited:
    if url != BASE + "/" and url not in inbound:
        print(f"  {url}")

print("\n=== DEAD ENDS (no outbound links) ===")
for url, links in orphans.items():
    if not links:
        print(f"  {url}")

print(f"\nTotal pages crawled: {len(visited)}")
