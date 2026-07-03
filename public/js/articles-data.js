/**
 * UKF Services - Articles Database
 * Centralized article management for insights.html
 * Updated: March 2026 — all 11 confirmed article files
 */

const articlesData = [
    {
        id: 11,
        title: "Vaccine Cold Chain Logistics in UAE",
        category: "PHARMACEUTICALS",
        topic: "GUIDE",
        badge: "CRITICAL",
        excerpt: "Ensuring temperature-controlled integrity for pharmaceutical shipments with specialised cold chain protocols and compliance.",
        date: "2026-01-25",
        readTime: "9 min read",
        image: "images/blog-vaccine-cold-chain.jpg",
        url: "articles/vaccine_cold_chain_article.html",
        featured: true
    },
    {
        id: 10,
        title: "Customs Clearance for Electronics in UAE",
        category: "COMPLIANCE",
        topic: "GUIDE",
        badge: "TECHNICAL",
        excerpt: "Specialised guidance for importing electronics: certifications, regulations, and compliance for tech products in the UAE market.",
        date: "2026-01-20",
        readTime: "7 min read",
        image: "images/blog-electronics-customs.jpg",
        url: "articles/customs-clearance-electronics-uae.html",
        featured: false
    },
    {
        id: 9,
        title: "Complete Guide to Customs Clearance in Dubai",
        category: "CUSTOMS",
        topic: "GUIDE",
        badge: "ESSENTIAL",
        excerpt: "Navigate Dubai customs efficiently with our comprehensive guide covering documentation, procedures, and compliance requirements.",
        date: "2026-01-15",
        readTime: "8 min read",
        image: "images/blog-customs-dubai.jpg",
        url: "articles/customs-clearance-dubai.html",
        featured: false
    },
    {
        id: 8,
        title: "FCL vs LCL Shipping: The 2025 Decision Framework",
        category: "SHIPPING",
        topic: "GUIDE",
        badge: "GUIDE",
        excerpt: "A comprehensive guide to choosing between Full Container Load and Less than Container Load shipping based on volume, cost, and timeline requirements.",
        date: "2026-01-23",
        readTime: "6 min read",
        image: "images/blog-FCL-LCL.jpg",
        url: "articles/article-fcl-vs-lcl.html",
        featured: false
    },
    {
        id: 7,
        title: "The UKF 7-Step Clearance Journey",
        category: "OPERATIONS",
        topic: "PROCESS",
        badge: "PROCESS",
        excerpt: "An end-to-end breakdown of our proven logistics process, from pre-shipment planning to final mile delivery in Dubai.",
        date: "2026-01-20",
        readTime: "8 min read",
        image: "images/jebel-ali-port.jpg",
        url: "articles/logistics_process_revised.html",
        featured: false
    },
    {
        id: 6,
        title: "Coffee Journey: 12,000 Miles to Dubai",
        category: "CASE STUDY",
        topic: "STORY",
        badge: "STORY",
        excerpt: "Following the path of a single coffee bean from Ethiopian highlands to Dubai ports through our integrated logistics network.",
        date: "2026-01-15",
        readTime: "5 min read",
        image: "images/blog-coffee.jpg",
        url: "articles/coffee-journey-12000-miles.html",
        featured: true
    },
    {
        id: 5,
        title: "UAE Customs Clearance: The 5-Step Guide",
        category: "CUSTOMS",
        topic: "PROCESS",
        badge: "PROCESS",
        excerpt: "Master the documentation and approval process for seamless UAE entry with our comprehensive clearance guide.",
        date: "2026-01-10",
        readTime: "6 min read",
        image: "images/blog-customs.jpg",
        url: "articles/uae-customs-clearance-guide.html",
        featured: false
    },
    {
        id: 4,
        title: "5 Ways to Optimize Air Freight Costs",
        category: "COST OPTIMIZATION",
        topic: "STRATEGY",
        badge: "STRATEGY",
        excerpt: "Reduce your air cargo spend by 10-30% using these proven consolidation and routing tactics.",
        date: "2026-01-05",
        readTime: "7 min read",
        image: "images/blog-air.jpg",
        url: "articles/optimize-air-freight-costs.html",
        featured: false
    },
    {
        id: 3,
        title: "Shipping Trends 2025: Middle East Focus",
        category: "INDUSTRY ANALYSIS",
        topic: "TRENDS",
        badge: "TRENDS",
        excerpt: "How digitalisation and new trade routes are reshaping the UAE logistics landscape in 2025.",
        date: "2025-12-28",
        readTime: "7 min read",
        image: "images/blog-trends.jpg",
        url: "articles/shipping-trends-2025.html",
        featured: false
    },
    {
        id: 2,
        title: "China to Dubai: Trade Lane Strategy",
        category: "TRADE LANES",
        topic: "STRATEGY",
        badge: "ROUTE",
        excerpt: "Optimising the corridor that fuels Dubai's manufacturing and retail sectors with strategic insights.",
        date: "2025-12-20",
        readTime: "6 min read",
        image: "images/blog-china.jpg",
        url: "articles/china-to-dubai-trade-lane-strategy.html",
        featured: false
    },
    {
        id: 1,
        title: "Jebel Ali Port: 2024 Regulation Updates",
        category: "REGULATIONS",
        topic: "COMPLIANCE",
        badge: "COMPLIANCE",
        excerpt: "Critical compliance updates for all importers using Jebel Ali Port terminals and free zones.",
        date: "2025-12-10",
        readTime: "5 min read",
        image: "images/blog-jebel-ali.jpg",
        url: "articles/jebel_ali_regulations.html",
        featured: false
    }
];

/**
 * Get articles by month/year for archive filtering
 */
function getArchiveMonths() {
    const months = new Set();
    articlesData.forEach(article => {
        const date = new Date(article.date);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        months.add(monthYear);
    });
    return Array.from(months).sort().reverse();
}

/**
 * Get unique topics for filtering
 */
function getUniqueTopics() {
    return [...new Set(articlesData.map(a => a.topic))];
}

/**
 * Filter articles by topic
 */
function filterByTopic(topic) {
    if (topic === 'all') return articlesData;
    return articlesData.filter(a => a.topic === topic);
}

/**
 * Filter articles by date range
 */
function filterByDateRange(yearMonth) {
    if (yearMonth === 'all') return articlesData;
    return articlesData.filter(a => a.date.startsWith(yearMonth));
}

/**
 * Search articles by keyword
 */
function searchArticles(query) {
    const lowerQuery = query.toLowerCase();
    return articlesData.filter(article =>
        article.title.toLowerCase().includes(lowerQuery) ||
        article.excerpt.toLowerCase().includes(lowerQuery) ||
        article.category.toLowerCase().includes(lowerQuery)
    );
}

/**
 * Get featured articles
 */
function getFeaturedArticles() {
    return articlesData.filter(a => a.featured);
}

/**
 * Paginate articles
 */
function paginateArticles(page = 1, perPage = 10) {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return {
        articles: articlesData.slice(start, end),
        currentPage: page,
        totalPages: Math.ceil(articlesData.length / perPage),
        totalArticles: articlesData.length
    };
}
