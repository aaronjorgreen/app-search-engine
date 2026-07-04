const fs = require('fs');
const path = require('path');

// 1. Data Templates for curating realistic tech/business intelligence articles
const CATEGORIES = [
  "AI & Automation",
  "Software Trends",
  "Startup Moves",
  "Market Signals",
  "Product Strategy",
  "Digital Business",
  "Founder Stories"
];

const AUTHORS = [
  "Maya Chen", "Liam Sterling", "Aria Vance", "Devon Cole",
  "Elena Rostova", "Marcus Thorne", "Sarah Jenkins", "Hassan Jamil"
];

const TAGS_BY_CATEGORY = {
  "AI & Automation": ["AI agents", "automation", "operations", "SaaS", "LLMs", "orchestration", "SLMs", "neural nets", "workflow design"],
  "Software Trends": ["local-first", "serverless", "monolith", "microservices", "webassembly", "typescript", "rust", "databases", "APIs"],
  "Startup Moves": ["venture capital", "seed round", "valuation", "fundraising", "fintech", "biotech", "unicorns", "acquisitions", "IPO"],
  "Market Signals": ["macro economics", "tech stocks", "interest rates", "hiring trends", "regulatory", "cloud spend", "ad tech", "hardware"],
  "Product Strategy": ["product-led growth", "pricing model", "retention", "user onboarding", "feature flags", "analytics", "UX design"],
  "Digital Business": ["creator economy", "e-commerce", "subscription model", "remote work", "cybersecurity", "privacy", "digital media"],
  "Founder Stories": ["founder lessons", "bootstrapping", "pivot", "co-founders", "burnout", "scaleup", "culture", "failure"]
};

// Paragraph generators for realistic body content. 
// We define templates for each category. Each category has multiple sections we mix and match.
const TEMPLATES = {
  "AI & Automation": {
    intros: [
      "In the rapidly shifting landscape of machine learning, {subject} has transitioned from a theoretical benchmark to a core component of enterprise engineering.",
      "As software platforms integrate deeper automation, the deployment of {subject} is redefining how engineering teams structure their operational pipelines.",
      "The promise of {subject} has dominated industry headlines for months, but the reality of executing these systems at scale reveals a complex set of challenges."
    ],
    points: [
      "Historically, tech systems relied on rigid rules-based architectures. Today, the introduction of {tech_term} allows systems to handle high-variance inputs with surprising flexibility. This has led to a major increase in throughput, with mock testing environments showing up to a {stat}% reduction in manual overrides.",
      "The primary bottleneck, however, lies in context window economics and tokens. While model providers boast about multi-million token limits, the latency and cost of processing massive prompts make {tech_term} a design trade-off rather than an automatic solution.",
      "Engineers are shifting towards hybrid agentic workflows. By combining small language models (SLMs) on the edge with larger reasoning models for complex steps, companies can build reliable and low-latency systems without blowing their cloud budgets."
    ],
    challenges: [
      "Furthermore, debugging non-deterministic agents remains a massive hurdle. In traditional software, stack traces identify the exact line of code that failed. With agentic architectures, failure modes are soft, emergent, and difficult to reproduce under synthetic testing suites.",
      "Security compliance is also a primary concern. Allowing autonomous {tech_term} systems to execute database queries or interact with external APIs introduces risk surfaces that traditional security policies are ill-equipped to police."
    ],
    conclusions: [
      "Ultimately, the winner of this race won't be the team with the largest model, but the one that designs the best deterministic guardrails around their probabilistic agents.",
      "As we move into the second half of the decade, the integration of these tools will shift from an optional efficiency gain to a survival requirement for digital-native enterprises.",
      "The organizations that master the balance of agent autonomy and strict execution safety will dominate the next decade of software-enabled services."
    ]
  },
  "Software Trends": {
    intros: [
      "The modern developer stack is undergoing a quiet revolution as {subject} challenges long-held assumptions about web architecture.",
      "For years, the industry pushed toward fully centralized cloud databases. However, the rise of {subject} is prompting teams to look back at local-first principles.",
      "Deciding between {subject} and older architectural styles remains one of the most contentiously debated topics in modern engineering teams."
    ],
    points: [
      "By pushing database compute and state management to the client device, {tech_term} architectures achieve sub-millisecond interaction speeds. This changes the feel of web applications, transforming them from document viewers into fluid, responsive workspaces.",
      "However, synchronization and conflict resolution remain hard computer science problems. Implementing CRDTs (Conflict-free Replicated Data Types) requires developers to restructure their data models, adding initial complexity for long-term reliability benefits.",
      "At the same time, we are witnessing the resurgence of the 'modular monolith'. Many engineering teams that split their codebases into microservices are finding that network latency and operational overhead outweigh the scaling benefits, leading to a consolidation wave."
    ],
    challenges: [
      "Operational overhead is the silent killer of early-stage software projects. Managing multiple serverless functions, database instances, and API gateways often consumes more engineering hours than shipping features.",
      "Additionally, the fragmentation of browser APIs and client capabilities means developers must implement robust fallback mechanisms to support older devices and varying network conditions."
    ],
    conclusions: [
      "The path forward is likely hybrid. By utilizing serverless technology for heavy compute and edge functions for instant routing, teams can build highly responsive applications without sacrificing scalability.",
      "Ultimately, architecture should serve the user experience. If a developer-facing tool feels slow or unresponsive, no amount of back-end elegance can save it from user churn.",
      "As frameworks mature, the barrier to entry for building local-first, highly collaborative applications will fall, sparking a new wave of interactive software."
    ]
  },
  "Startup Moves": {
    intros: [
      "The funding landscape for early-stage {subject} startups is showing signs of structural adaptation as macroeconomic shifts take hold.",
      "A new wave of founders is building in {subject}, trading hyper-growth metrics for capital efficiency and early product-market fit.",
      "The recent movement of venture capital into {subject} highlights a shifting appetite among institutional allocators."
    ],
    points: [
      "While the era of zero-interest-rate funding is long gone, seed and Series A rounds for teams building {tech_term} are still commanding premium valuations. Investors are prioritizing teams with high technical leverage and clear distribution advantages over generic SaaS copies.",
      "This funding reality has forced startups to reconsider their run rates. Bootstrapping features, leveraging developer API credits, and focusing on immediate customer revenue are back in style, resulting in healthier, more resilient business models.",
      "Interestingly, corporate VC arms are playing a much larger role in early stages. Companies are seeking strategic partnerships that guarantee enterprise pilots, viewing venture capital not just as finance, but as a direct pipeline to market distribution."
    ],
    challenges: [
      "The path to scale is fraught with regulatory and retention issues. Startups often find that while initial customer acquisition is fast, long-term retention remains low due to intense feature overlap from bigger platform competitors.",
      "Furthermore, the talent war for highly specialized engineers means early-stage teams must allocate significant portions of their capital simply to maintain competitive payrolls."
    ],
    conclusions: [
      "The next generation of tech giants is being founded in this environment. Hard times force disciplined engineering, clearer positioning, and a relentless focus on customer utility.",
      "As capital remains disciplined, founders who can demonstrate real operational efficiency and sustained user growth will find no shortage of backing.",
      "In summary, the venture ecosystem is returning to fundamentals: building software that solves high-value problems and charging customers more than it costs to deliver."
    ]
  },
  "Market Signals": {
    intros: [
      "An analysis of recent data suggests that {subject} is becoming a leading indicator for broader tech spending trends.",
      "As public market valuations adjust, the enterprise appetite for {subject} is revealing deeper shifts in corporate IT budgets.",
      "The convergence of regulatory pressures and efficiency drives is creating a dynamic environment for {subject} vendors."
    ],
    points: [
      "According to internal CIO surveys, IT spending is undergoing consolidation. Enterprise buyers are looking to replace single-point products with unified platforms, putting pressure on standalone {tech_term} companies to bundle features or face displacement.",
      "On the hardware side, the cost of specialized compute chips continues to influence cloud pricing. As chip capacity increases, edge delivery networks are becoming more viable, shifting processing power away from centralized data centers.",
      "At the same time, regional compliance mandates are forcing companies to adopt strict data residency protocols. This shift is driving demand for regional cloud services and specialized compliance automation tools."
    ],
    challenges: [
      "The biggest market risk is the contraction in secondary software sales. As companies trim their headcount, SaaS license seat counts drop, forcing vendor growth to rely on usage-based models rather than fixed subscriptions.",
      "Moreover, macroeconomic headwinds make enterprise sales cycles longer. Decisions that used to take three weeks now require multi-department reviews, slowing down growth rates."
    ],
    conclusions: [
      "Vendors that can demonstrate clear, auditable cost savings will win budget share, while purely speculative toolings will see churn rates rise.",
      "As the market stabilizes, the premium on scalability and operational efficiency will remain, shaping the product roadmaps of major vendors.",
      "We expect to see further consolidation through M&A, as legacy platforms acquire distressed point solutions to bolster their feature suites."
    ]
  },
  "Product Strategy": {
    intros: [
      "In the age of software saturation, the design of {subject} has become a critical differentiator for user acquisition and retention.",
      "Successful product teams are shifting from feature-driven roadmaps to systemic feedback loops built around {subject}.",
      "The evolution of {subject} showcases how product design can directly influence customer lifetime value and expansion revenue."
    ],
    points: [
      "By adopting product-led growth (PLG) mechanics, teams can lower the barrier to trial. Letting users experience the value of {tech_term} within minutes of landing on the site generates higher conversion rates than any traditional sales demo.",
      "This requires a rigorous approach to onboarding UX. If a user encounters friction before experiencing the core product loop, they will abandon the app. Metrics indicate that simplifying signup steps can increase activation rates by up to {stat}%.",
      "Additionally, the integration of usage-based pricing models requires a product experience that helps users monitor and optimize their spend, building trust and preventing bill-shock churn."
    ],
    challenges: [
      "The core challenge is balancing simplicity for new users with depth for power users. Over-simplifying interfaces can alienate technical champions, while complex options overwhelm non-technical buyers.",
      "Another obstacle is data silos. Product teams often lack access to clean, real-time user behavior data, making it difficult to run valid A/B tests or track feature adoption metrics."
    ],
    conclusions: [
      "Product strategy is ultimately about prioritization. The best teams focus on refining the core loop before expanding into adjacent feature categories.",
      "By designing interfaces that are responsive, accessible, and clean, companies can build product experiences that users genuinely enjoy returning to daily.",
      "The future of product design belongs to platforms that can present complex underlying data and logic in a calm, intuitive, and highly functional workspace."
    ]
  },
  "Digital Business": {
    intros: [
      "The digitization of traditional workflows has accelerated the adoption of {subject} across diverse market sectors.",
      "As online commerce channels mature, the integration of {subject} is reshaping customer expectations and brand loyalty.",
      "The shift toward subscription-first models for {subject} has created a highly predictable yet hyper-competitive digital economy."
    ],
    points: [
      "Modern digital businesses are relying on modular API integrations. Instead of building customer support, billing systems, and search from scratch, teams can plug in specialized {tech_term} systems, shortening time-to-market to weeks instead of years.",
      "This API economy has democratized the building of complex web experiences. A three-person team can now deploy global, multi-region services that handle secure transactions and high-volume media processing.",
      "However, dependency risk is an emerging concern. If a critical service provider goes offline or changes their pricing structure, digital businesses can experience immediate margins compression or service outages."
    ],
    challenges: [
      "Customer acquisition costs (CAC) are rising across almost all channels. Organic search traffic is harder to secure, forcing businesses to rely on expensive paid ads or build highly specialized community hubs.",
      "Data privacy regulations also present ongoing engineering overhead, requiring companies to constantly update cookie consent flows and user data storage policies."
    ],
    conclusions: [
      "The digital businesses that survive and thrive will be those that build owned distribution channels and maintain high gross margins through automation.",
      "As consumer behavior continues to favor instant utility and high personalization, the infrastructure backing digital services must evolve to match.",
      "In the long run, the division between technology companies and traditional businesses will dissolve entirely, leaving only digitally optimized enterprises."
    ]
  },
  "Founder Stories": {
    intros: [
      "Behind every successful launch in {subject} lies a story of pivots, operational adjustments, and intense focus on customer feedback.",
      "Bootstrapping a company in the {subject} space offers a starkly different experience than raising venture millions, demanding resourcefulness and grit.",
      "Reflecting on the early stages of building in {subject} reveals valuable lessons about building team culture and managing burn rate."
    ],
    points: [
      "In the early days, the team operated on a shoestring budget. By writing custom frameworks and focusing entirely on customer-facing features, they avoided the trap of premature scaling. They launched the first version of their {tech_term} system in just three months.",
      "The initial launch was a quiet affair. Rather than seeking press coverage, the founders spent hours in developer communities, answering questions, writing technical guides, and gathering direct feedback to iterate on the product hourly.",
      "This customer intimacy created a strong feedback loop. Users weren't just clients; they were co-designers. This collaboration resulted in highly specialized features that larger competitors, insulated from their users, missed entirely."
    ],
    challenges: [
      "Burnout is the founder's constant shadow. Operating a lean team means wearing ten hats at once, balancing server operations, customer support, sales calls, and code development under high stress.",
      "Co-founder misalignment is another common startup killer. Without clear division of responsibility and shared values, scaling pressure can rupture the core team."
    ],
    conclusions: [
      "The founders who succeed are not those who never fail, but those who build a codebase and an organization resilient enough to survive multiple iterations.",
      "Looking back, the struggle wasn't a distraction — it was the foundation. The constraints of bootstrapping forced a healthy culture of capital efficiency.",
      "For future builders, the message is clear: ignore the hype cycles, find a real problem, build a solution, and talk to your users every single day."
    ]
  }
};

const VOCABULARY = {
  "AI & Automation": {
    subjects: ["AI agents", "autonomous agents", "LLM orchestration", "self-healing codebases", "semantic search systems", "agentic workflows"],
    tech_terms: ["autonomous agents", "LLM orchestrator", "vector retrieval", "agentic loops", "retrieval-augmented generation (RAG)", "context windowing"],
    stats: [30, 45, 60, 75, 80],
    frameworks: ["LangChain", "LlamaIndex", "AutoGPT", "CrewAI", "Hugging Face", "Ollama"]
  },
  "Software Trends": {
    subjects: ["local-first databases", "modular monoliths", "WebAssembly runtimes", "serverless edge computing", "Conflict-Free Replicated Data Types (CRDTs)", "relational database schemas"],
    tech_terms: ["local-first sync", "modular monolith architecture", "Wasm binaries", "edge workers", "event-sourcing databases", "GraphQL gateways"],
    stats: [15, 25, 40, 50, 99],
    frameworks: ["Next.js", "Vite", "Rust", "SQLite", "Yjs", "WebAssembly"]
  },
  "Startup Moves": {
    subjects: ["early-stage SaaS models", "capital-efficient startups", "corporate venture investments", "developer-led API startups", "series-A financing trends", "bootstrapped SaaS operations"],
    tech_terms: ["seed fundraising", "capital-efficient growth", "strategic partnerships", "usage-based pricing", "unit economics", "minimum viable products"],
    stats: [20, 35, 50, 100, 150],
    frameworks: ["Stripe", "Y Combinator", "Carta", "AWS Credits", "Posthog", "Hubspot"]
  },
  "Market Signals": {
    subjects: ["enterprise IT budgeting", "cloud compute infrastructure spending", "regional compliance automation", "usage-based cloud pricing", "SaaS vendor consolidation", "macroeconomic tech headwinds"],
    tech_terms: ["vendor consolidation", "usage-based billing", "data residency compliance", "IT budget allocations", "edge-delivery cloud", "hardware supply chains"],
    stats: [10, 18, 30, 42, 55],
    frameworks: ["Snowflake", "Datadog", "AWS", "Azure", "GCP", "Cloudflare"]
  },
  "Product Strategy": {
    subjects: ["product-led growth (PLG)", "user onboarding optimization", "usage-based product metrics", "feature flag systems", "product analytics loops", "accessible UX workspaces"],
    tech_terms: ["product-led growth", "activation metrics", "A/B testing datasets", "user onboarding flows", "UX accessibility", "retention curves"],
    stats: [12, 28, 35, 50, 65],
    frameworks: ["Mixpanel", "LaunchDarkly", "Segment", "Amplitude", "Intercom", "Figma"]
  },
  "Digital Business": {
    subjects: ["modular API integrations", "creator-led media platforms", "subscription-based billing models", "GDPR compliance pipelines", "headless e-commerce backends", "distributed digital workspace tools"],
    tech_terms: ["headless content delivery", "subscription analytics", "customer support automation", "API micro-billing", "data privacy systems", "remote work tools"],
    stats: [8, 22, 38, 48, 70],
    frameworks: ["Shopify", "Contentful", "Vercel", "Zapier", "Auth0", "SendGrid"]
  },
  "Founder Stories": {
    subjects: ["bootstrapped software ventures", "customer-led product iteration", "early team development culture", "founder health and operations", "co-founder alignment frameworks", "capital-efficient software scaling"],
    tech_terms: ["bootstrapping mechanics", "customer co-designing", "feedback loops", "capital-efficient engineering", "organic distribution channels", "culture scaling"],
    stats: [5, 15, 30, 50, 85],
    frameworks: ["Slack", "GitHub", "Notion", "Linear", "Tailwind CSS", "TypeScript"]
  }
};

// Curated headlines (realistic, premium tech/business headlines)
const HEADLINES_BY_CATEGORY = {
  "AI & Automation": [
    "AI Agents Are Moving From Demos to Daily Operations",
    "The Real Cost of Autonomous Workflow Orchestration",
    "Self-Healing Codebases: Debugging the Probabilistic Future",
    "Why Context Window Optimization is the New Database Tuning",
    "The Shift to Agentic UI: Dynamic Interfaces in Modern SaaS",
    "Small Language Models (SLMs) Find Their Niche on the Edge",
    "Beyond Copilot: The Rise of Autonomous Software Agents",
    "Orchestrating Multi-Agent Systems inside Legacy Architectures",
    "Why Standardized Benchmarks for AI Agents Still Don't Work",
    "Evaluating LLM Retrieval Architectures: RAG vs Long-Context",
    "Sovereign AI: The Case for Building and Running In-House Models",
    "How Automated Support Pipelines Halved Customer Escalation Rates",
    "The Design Constraints of Building Non-Deterministic User Workflows",
    "Fine-Tuning is Not Search: Resolving the AI Knowledge Gap",
    "The Ethics and Governance of Agentic Decision Making in Fintech"
  ],
  "Software Trends": [
    "The Quiet Revolution of Local-First Application Architecture",
    "Resurging Monoliths: Why Teams Are Consolidating Microservices",
    "WebAssembly (Wasm) in 2026: Running Heavy Compute in the Browser",
    "Conflict Resolution in Distributed Workspaces: CRDTs Explained",
    "Serverless Edge Computing: Balancing Cost, Speed, and Latency",
    "The Database Bottleneck: Scaling Real-Time Sync on SQLite",
    "Why TypeScript Remains the Undisputed Foundation of SaaS Frontend",
    "GraphQL vs REST: Re-evaluating API Architectures for SPA Apps",
    "The Operational Cost of Managing Serverless Function Sprawl",
    "Event Sourcing vs Relational Models: Choosing a Ledger Architecture",
    "State Management in Collaborative Apps: Strategies That Work",
    "The Transition from Client-Side SPA to Server-Driven Render",
    "Securing the Software Supply Chain: Lessons from Open Source Failures",
    "Is WebRTC Stable Enough for Real-Time Multi-User Collaboration?",
    "Modern CSS in 2026: Container Queries, Nesting, and Scope"
  ],
  "Startup Moves": [
    "Building in Public: The Capital-Efficient Founder's Playbook",
    "Valuation Adjustments: How Series A Requirements Shifted in 2026",
    "Corporate Venture Capital: The Strategic Partner Startups Need",
    "Usage-Based Billing: Aligning Pricing Models with Value Delivered",
    "The Startup Pivot: When to Change Direction and How to Fund It",
    "Bootstrapping to $10M ARR: The Capital-Efficient SaaS Blueprint",
    "Why Early Strategic Alliances Are Outperforming Paid Ad Channels",
    "Building High-Leverage Engineering Teams with Fractional Talents",
    "The Fintech Sandbox: Navigating Early-Stage Regulatory Constraints",
    "Seed Financing in AI: What Allocators Look for Beyond the Pitch",
    "Minimum Viable Products: Redefining 'Viable' in a Saturated Market",
    "Navigating a Hardware Pivot: Lessons from a Defunct IoT Venture",
    "The Talent Acquisition Playbook for Early-Stage Remote Startups",
    "Equity Compensation Trends: Structuring Early Option Pools",
    "Acquisitions at the Edge: How Big Tech is Buying Small Tools"
  ],
  "Market Signals": [
    "IT Budget Consolidation: The Platform Era Returns to Enterprise",
    "Cloud Compute Budgets: How CIOs Are Optimizing Infrastructure Spend",
    "Data Residency Mandates: Designing Systems for Global Compliance",
    "The Contraction of SaaS License Counts: Impacts of Automation",
    "Chip Geopolitics and the Shifting Cost of Cloud-Based GPU Compute",
    "Cloudflare, Vercel, and the Consolidation of Edge Hosting Markets",
    "Hiring Trends in Tech: The Demand Shift Toward Generalist Engineers",
    "The Impact of Interest Rates on Tech Infrastructure Investments",
    "The Regulatory Landscape for Artificial Intelligence in EU Markets",
    "Ad Tech Evolution: Privacy Controls and the Death of Third-Party Cookies",
    "Enterprise Subscription Churn: Analyzing Software Spending Cuts",
    "The Subscription fatigue: How Businesses Are Consolidating SaaS Tools",
    "E-commerce Growth Curves: Post-Pandemic Correction Signals",
    "The Rising Cost of Cybersecurity Insurance for Digital Enterprises",
    "Why Digital Media Platforms Are Shifting to Micro-Transactions"
  ],
  "Product Strategy": [
    "Product-Led Growth (PLG): Optimizing the Self-Serve User Loop",
    "User Onboarding UX: Eliminating Friction in Technical SaaS Tools",
    "Designing Dashboards for High-Volume Analytics: Performance Rules",
    "The Art of Feature Flag Management: Guarding Production Deploys",
    "Pricing Strategy: Transitioning from Flat Subscriptions to Usage Metrics",
    "UX Accessibility: Designing Premium Interfaces for Everyone",
    "Why Clean Typography is the Most Underappreciated UI Element",
    "Product Analytics: Mapping User Onboarding Paths to Retention",
    "Systemic Feedback Loops: How to Drive User Engagement Without Spam",
    "Balancing Simplicity and Power: Interface Design Guidelines",
    "The Role of Customer Success Teams in Product-Led Orgs",
    "A/B Testing Best Practices: Avoiding False Positives in Analytics",
    "Designing Workspaces: The Command Palette as a Core Navigation Tool",
    "Why We Replaced Our Complex Dashboard with a Single Search Bar",
    "The Product Roadmap: Managing Customer Requests Without Bloating Software"
  ],
  "Digital Business": [
    "The Modular API Stack: Building Global Platforms in Weeks",
    "Navigating GDPR and Privacy Regulations in E-commerce Pipelines",
    "The Remote Work Shift: Building Distributed Infrastructure That Scales",
    "Creator Economy Economics: Monetization Trends in Digital Media",
    "Headless Commerce Architectures: Uncoupling Frontend from Database",
    "Cybersecurity for Small Businesses: Implementing Basic Hygiene",
    "The Rising Demand for Regional SaaS Vendors in European Markets",
    "Subscription Billing Engines: Why Building Your Own is a Mistake",
    "Headless Content Management: Scaling Editorial Workflows Locally",
    "Automating Invoicing and Billing Pipelines for Global Business",
    "The Cost of API Dependencies: Managing Risk in Third-Party SaaS",
    "Digital Business Models: The Subscription vs Transaction Conundrum",
    "Virtual Events Infrastructure: What Happens When the Hype Fades?",
    "Securing User Data: Best Practices for Passwordless Authentication",
    "Optimizing Core Web Vitals for Content-Dense Media Portals"
  ],
  "Founder Stories": [
    "Reflections on Bootstrapping: Lessons from a Solopreneur's Journey",
    "The Pivot That Saved Us: Transitioning from Consumer to B2B SaaS",
    "Building Team Culture Across Borders: A Founder's Checklist",
    "Co-Founder Alignment: Structuring Responsibilities and Equity early",
    "Managing Founder Burnout: Building Rest into the Launch Calendar",
    "Organic Growth: How We Reached 50k Users Without Paid Advertising",
    "Lessons from Failure: What We Learned from a Failed Seed Launch",
    "Customer Co-Design: Building Features in Partnership with Users",
    "From Zero to $5M ARR: Scaleup Lessons from the Trenches",
    "The Decisive Move: Why We Chose to Bootstrip Instead of Raising VC",
    "How We Handled Our First Critical Database Outage in Public",
    "Scaling the Team: When to Hire Your First Non-Technical Employee",
    "The Freedom of a Lean Codebase: Shipping Fast Without Legacy Bloat",
    "Building for a Niche: Why Narrow Focus Wins Against Large Platforms",
    "The Final Handshake: A Founder's Personal Account of the Acquisition Process"
  ]
};

// Helper: Pick a random element from an array
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper: Interpolate template string
function interpolate(template, vocab) {
  let result = template;
  
  // Replace placeholders with random matches from vocabulary
  const placeholders = [
    { key: '{subject}', source: vocab.subjects },
    { key: '{tech_term}', source: vocab.tech_terms },
    { key: '{stat}', source: vocab.stats },
    { key: '{framework}', source: vocab.frameworks }
  ];

  placeholders.forEach(p => {
    // We replace multiple occurrences
    while (result.includes(p.key)) {
      result = result.replace(p.key, pickRandom(p.source));
    }
  });

  // Capitalize first letter of sentence if needed
  result = result.charAt(0).toUpperCase() + result.slice(1);
  return result;
}

// Helper: Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/\s+/g, '-')     // replace spaces with hyphens
    .replace(/-+/g, '-');     // remove double hyphens
}

// Generator function
function generateArticles() {
  const articles = [];
  let articleId = 1;

  CATEGORIES.forEach(category => {
    const headlines = HEADLINES_BY_CATEGORY[category];
    const vocab = VOCABULARY[category];
    const templates = TEMPLATES[category];

    headlines.forEach(title => {
      const slug = generateSlug(title);
      
      // Curate random tags from the category tag list (3-6 tags)
      const possibleTags = TAGS_BY_CATEGORY[category];
      const tagCount = Math.floor(Math.random() * 4) + 3; // 3 to 6 tags
      const shuffledTags = [...possibleTags].sort(() => 0.5 - Math.random());
      const tags = shuffledTags.slice(0, tagCount);

      // Generate description
      const introTemplate = pickRandom(templates.intros);
      const description = interpolate(introTemplate, vocab);

      // Generate content paragraphs
      const bodyParagraphs = [];
      
      // 1. Intro paragraph
      bodyParagraphs.push(description + " In this comprehensive intelligence report, we evaluate the recent breakthroughs, developer practices, and systemic adjustments reshaping the industry. As organizations move to adopt modern paradigms, understanding the baseline operational constraints and scale dynamics becomes paramount to achieving high performance.");

      // 2. Historical context / Background
      bodyParagraphs.push(`### Historical Context and Evolution\n\nHistorically, the industry has swung between centralized and decentralized paradigms. With the rise of ${pickRandom(vocab.subjects)}, teams are forced to re-evaluate the trade-offs between execution speed, cost, and developer friction. Over the past twelve months, the adoption rate of these methodologies has increased, especially in high-scale environments. We are observing that early architectural decisions have a compounding effect on long-term project viability.`);

      // 3. Dynamic Points paragraphs (Include all of them for maximum content and depth)
      bodyParagraphs.push(`### Key Analysis and Constraints`);
      templates.points.forEach(pt => {
        bodyParagraphs.push(interpolate(pt, vocab));
      });

      // 4. Add a quote or callout block to make it look premium
      bodyParagraphs.push(`> "The challenge with implementing ${pickRandom(vocab.subjects)} is not code syntax; it is managing the state transition models securely under peak concurrent load." — *Senior Engineering Lead*`);

      // 5. Challenges
      bodyParagraphs.push(`### Structural Challenges`);
      templates.challenges.forEach(ch => {
        bodyParagraphs.push(interpolate(ch, vocab));
      });

      // 6. Conclusion
      bodyParagraphs.push(`### Future Outlook and Strategy`);
      templates.conclusions.forEach(concl => {
        bodyParagraphs.push(interpolate(concl, vocab));
      });

      // Assemble content
      let content = bodyParagraphs.join("\n\n");
      let wordCount = content.split(/\s+/).length;
      
      // Pad content if under 420 words
      if (wordCount < 420) {
        const sectorFillers = [
          "Additionally, the industry is witnessing a structural realignment in resource allocation. Organizations are shifting budgets away from speculative projects toward high-uptime, robust operations that promise measurable efficiency gains. As security architectures grow more complex, maintaining low-friction developer workflows requires teams to establish highly structured design patterns early in the lifecycle.",
          "Moreover, the geopolitical factors influencing cloud infrastructure availability cannot be overlooked. As sovereign data centers become a legal mandate in multiple regions, digital-first businesses must design their systems to handle distributed data pipelines. This introduces new complexity around state synchronization, network latencies, and regional user privacy controls.",
          "In parallel, customer acquisition dynamics are undergoing a quiet transformation. Relying entirely on paid advertising channels yields diminishing returns, forcing teams to prioritize product-led growth (PLG) mechanics and building technical developer advocacy programs. By aligning software value directly with user onboarding velocity, modern platforms can sustain organic scaling without burning venture reserves."
        ];
        bodyParagraphs.push(`### Market Implications\n\n${pickRandom(sectorFillers)}`);
        content = bodyParagraphs.join("\n\n");
        wordCount = content.split(/\s+/).length;
      }

      // Assert word count is in 400-800 range
      if (wordCount < 400 || wordCount > 800) {
        console.warn(`WARNING: Post ID post-${articleId} word count is ${wordCount}`);
      }

      const readTimeVal = Math.max(Math.ceil(wordCount / 180), 2); // average 180 wpm
      const readTime = `${readTimeVal} min read`;

      // Date: Distribute dates backward from 2026-07-04
      const dateOffset = articleId * 3; // spread dates backward
      const pubDate = new Date("2026-07-04");
      pubDate.setDate(pubDate.getDate() - dateOffset);
      const date = pubDate.toISOString().split('T')[0];

      articles.push({
        id: `post-${String(articleId).padStart(3, '0')}`,
        title,
        slug,
        description,
        category,
        tags,
        author: pickRandom(AUTHORS),
        date,
        readTime,
        content
      });

      articleId++;
    });
  });

  // Sort articles by date descending (most recent first)
  articles.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Limit to exactly 100 articles if we have more, or pad if we have less.
  // We have 7 categories * 15 headlines = 105 total headlines.
  // Let's slice it to exactly 100 articles to match the user's requirements.
  const finalArticles = articles.slice(0, 100);

  // Ensure IDs are sequential from 1 to 100
  finalArticles.forEach((art, index) => {
    art.id = `post-${String(index + 1).padStart(3, '0')}`;
  });

  return finalArticles;
}

// Main execution
console.log("Generating 100 mock articles for Signal Ledger...");
const generatedArticles = generateArticles();

const outputDir = path.join(__dirname, '../planning');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, 'mock-articles.json');
fs.writeFileSync(outputPath, JSON.stringify(generatedArticles, null, 2), 'utf-8');

console.log(`Successfully generated ${generatedArticles.length} mock articles!`);
console.log(`Saved to: ${outputPath}`);
