import os
import json
import urllib.request
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("PAGESPEED_API_KEY")
URL = "https://ukfservices.com"

if not API_KEY:
    print("ERROR: PAGESPEED_API_KEY not set in .env")
    exit(1)

api_url = (
    f"https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
    f"?url={URL}&key={API_KEY}&category=PERFORMANCE&category=SEO"
    f"&category=ACCESSIBILITY&category=BEST_PRACTICES&strategy=MOBILE"
)

print(f"Running PageSpeed audit on {URL}...")

try:
    with urllib.request.urlopen(api_url) as response:
        data = json.loads(response.read())

    cats = data["lighthouseResult"]["categories"]
    cwv  = data["lighthouseResult"]["audits"]

    print("\n=== SCORES ===")
    for k, v in cats.items():
        score = v.get("score")
        score_str = f"{int(score*100)}/100" if score is not None else "N/A"
        print(f"  {k.upper():20s}: {score_str}")

    print("\n=== CORE WEB VITALS ===")
    for metric in ["first-contentful-paint","largest-contentful-paint",
                   "total-blocking-time","cumulative-layout-shift","interactive"]:
        a = cwv.get(metric, {})
        print(f"  {a.get('title','?'):35s}: {a.get('displayValue','N/A')}")

    out = "D:\\ukf-astro\\pagespeed-report.json"
    with open(out, "w") as f:
        json.dump(data, f, indent=2)
    print(f"\nFull report saved to {out}")

except Exception as e:
    print(f"ERROR: {e}")
