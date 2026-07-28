-- Migration: New companion article — Hormuz global cost/impact piece
-- Slug: hormuz-strait-closure-global-shipping-impact-2026
-- Date: 2026-07-26
-- Purpose: Companion to existing 'hormuz-rerouting-uae-shippers-2026' article.
-- That piece covers UAE-specific routing (Khorfakkan, Jeddah, Cape).
-- This piece covers the broader cost/insurance/global trade impact, targeting
-- different search intent (news-cycle "is Hormuz closed" style queries) and
-- includes FAQ schema for rich-result eligibility. Cross-linked both ways
-- to avoid orphaning either page.
--
-- NOTE: image_url left NULL — add a value matching your existing naming
-- convention before/after running, or the article may render without a
-- hero image depending on how ArticleLayout handles a null image_url.

INSERT INTO articles (
  title,
  slug,
  excerpt,
  content,
  category,
  image_url,
  author,
  read_time,
  published_date,
  featured,
  trending,
  views
)
VALUES (
  'Hormuz Strait Closure 2026: Global Shipping Cost Impact',
  'hormuz-strait-closure-global-shipping-impact-2026',
  'Hormuz disruptions are driving up freight costs and insurance globally. See what''s changed and what it means for your shipments.',
  '<h1>Hormuz Strait Closure 2026: Global Shipping Cost Impact</h1>

<p>Since the Strait of Hormuz effectively closed on 28 February 2026 following military strikes between the US, Israel, and Iran, major carriers including Maersk, MSC, CMA CGM, and Hapag-Lloyd suspended transits within 48 hours, with over 150 tankers anchoring outside the strait rather than risking attack. Nearly five months later, the disruption shows no sign of easing, and its effects have spread well beyond the Gulf itself.</p>

<p>For a detailed look at how UAE shippers are actually rerouting cargo right now — including specific port and land-bridge options — see our companion piece, <a href="/articles/hormuz-rerouting-uae-shippers-2026">When Hormuz Closes: How UAE Shippers Are Rerouting Right Now</a>. This article focuses on the broader cost, insurance, and global trade picture.</p>

<h2>What''s actually happening</h2>
<p>Outbound commercial traffic through the strait has remained near zero for extended stretches, with over 1,550 vessels stranded and roughly 22,500 mariners trapped in the surrounding waters at points during the crisis. A US-guided transit corridor announced in early May was paused within days of launch. As recently as mid-July, Iranian cruise missiles struck two ADNOC Logistics and Services tankers transiting the strait — a reminder that even limited transits carry real risk.</p>
<p>The strait hasn''t been formally closed for the entirety of 2026, but the risk premium attached to it has become permanent, with recurring Iran-Gulf tensions reliably pushing fuel costs higher.</p>

<h2>The global rerouting picture</h2>
<p>With Hormuz unreliable and Red Sea transits also disrupted by renewed Houthi activity, the Cape of Good Hope has become the default route for Asia–Europe and Asia–Middle East cargo, adding 3,500–4,000 nautical miles and 10–14 days per voyage, along with sharply higher fuel costs and freight rates. Industry analysts increasingly describe this as a permanent rewrite of global logistics network architecture rather than a temporary workaround.</p>
<p>Some governments are adapting at the infrastructure level: Saudi Arabia has been rerouting crude exports through its East-West pipeline to Yanbu on the Red Sea, bypassing Hormuz entirely, and Pakistan formally requested Saudi oil supply via this route in March.</p>

<h2>What this means for cost and insurance</h2>
<p>The disruption reaches shipments that never touch the Gulf directly. Bunker fuel cost increases flow into freight rates within days through Bunker Adjustment Factor (BAF) revisions on nearly all lanes, not just Gulf-specific ones. War-risk insurance premiums have risen sharply on any cargo transiting or near the strait, and oil production across Kuwait, Iraq, Saudi Arabia, and the UAE has dropped by a reported 6.7 million barrels per day, with Brent crude jumping from roughly $75 to over $100 within days of the initial closure.</p>
<p>Global oil inventories are drifting toward record lows even before accounting for further disruption, which suggests upward cost pressure is more likely to continue than ease in the near term.</p>

<h2>What shippers should do</h2>
<ul>
  <li><strong>Build in buffer time.</strong> Where Cape routing applies to your lane, plan for the added 10–14 days as the new baseline, not a temporary delay.</li>
  <li><strong>Review insurance coverage now.</strong> War-risk premiums are moving quickly; don''t wait for renewal to check exposure on Gulf-transiting cargo.</li>
  <li><strong>Lock in rate conversations early.</strong> Costs are more likely to keep climbing than to ease soon, so early conversations with your forwarder protect your margins.</li>
  <li><strong>Check your specific routing options.</strong> If you''re shipping into or out of the UAE, see our breakdown of the <a href="/articles/hormuz-rerouting-uae-shippers-2026">three routes UAE shippers are using right now</a> for lane-specific guidance.</li>
</ul>

<p>If your supply chain touches the Gulf in any way — direct imports, transshipment, or just fuel-cost exposure — it''s worth a conversation about how exposed your current routing actually is.</p>

<h2>Frequently asked questions</h2>

<div itemscope itemtype="https://schema.org/FAQPage">

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">Is the Strait of Hormuz still closed in 2026?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">The strait has not been under a single continuous closure, but commercial traffic has been severely disrupted since 28 February 2026, with outbound transits repeatedly dropping to near-zero and remaining unreliable due to ongoing military activity and attacks on vessels.</p>
    </div>
  </div>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">How long will Hormuz-related shipping delays last?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">There''s no confirmed resolution timeline. Analysts have been extending their outlook as the conflict continues, and most major carriers have shifted to Cape of Good Hope routing as their default rather than a temporary measure, adding roughly 10–14 days per voyage.</p>
    </div>
  </div>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">Does the Hormuz disruption affect my shipments even if they don''t pass through the Gulf?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">Yes. Bunker fuel cost increases from the crisis flow into freight rates within days through Bunker Adjustment Factor (BAF) revisions on most global lanes, so cost impacts reach far beyond cargo physically transiting the strait.</p>
    </div>
  </div>

  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">What should shippers do right now?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">Build in extra transit time for Cape-routed cargo, review war-risk insurance coverage on any Gulf-transiting shipments, and lock in freight rate conversations early given the upward cost trend. UAE-based shippers should also review lane-specific routing options.</p>
    </div>
  </div>

</div>',
  'Sea Freight',
  NULL,
  'UKF Intelligence',
  '7 min read',
  '2026-07-26',
  0,
  0,
  0
);

-- Cross-link: append a reference to the new companion piece at the end of
-- the existing routing article's content. Uses SQLite string concatenation
-- so the existing content and Mirza's byline/voice are left untouched.

UPDATE articles
SET content = content || '

<p>For a broader look at how this closure is affecting freight costs, insurance, and global shipping routes beyond the Gulf, see our companion piece: <a href="/articles/hormuz-strait-closure-global-shipping-impact-2026">Hormuz Strait Closure 2026: Global Shipping Cost Impact</a>.</p>'
WHERE slug = 'hormuz-rerouting-uae-shippers-2026';
