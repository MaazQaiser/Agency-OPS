/* ─────────────────────────────────────────────────────────────────────────────
   Farmers Edge Hub — Data (PRD v1.15 §5.9)
   All content is static placeholder until Google Sheets API layer is wired.
   Zero PL content in this hub — PL Farmers benefits live in Training Hub (§5.4).
   In production: Tab 12 drives verticalList; every content range sourced from Sheets.
───────────────────────────────────────────────────────────────────────────── */

export type VerticalId = string;

export type ContentType =
  | "benefits"
  | "gaps"
  | "equip"
  | "objections"
  | "scripts"
  | "xsell"
  | "edge";

export type ViewId = "playbook" | "benefits" | "scripts" | "edge";

export const farmersEdgeViews: { id: ViewId; label: string }[] = [
  { id: "playbook", label: "Playbook View" },
  { id: "benefits", label: "Benefits Only" },
  { id: "scripts", label: "Scripts Only" },
  { id: "edge", label: "Our Edge" },
];

export const contentTypeColors: Record<ContentType, string> = {
  benefits: "#10B981",
  gaps: "#F43F5E",
  equip: "#3B82F6",
  objections: "#F59E0B",
  scripts: "#AAD0E7",
  xsell: "#8B5CF6",
  edge: "#10B981",
};

export const contentTypeLabels: Record<ContentType, string> = {
  benefits: "Farmers Benefits",
  gaps: "Coverage Gaps",
  equip: "Equipment Intel",
  objections: "Objection Reframes",
  scripts: "Script Lines",
  xsell: "Cross-Sell",
  edge: "Our Edge vs Competitors",
};

/** Tab 12 drives this list in production — never hardcoded in React. */
export const farmersEdgeVerticals: { id: string; label: string; emoji: string; sub: string }[] = [
  { id: "all", label: "All Verticals", emoji: "", sub: "Showing all commercial intelligence" },
  { id: "landscapers", label: "Landscapers", emoji: "🌿", sub: "Exterior maintenance · Equipment-heavy vertical" },
  { id: "contractors", label: "Contractors", emoji: "🔨", sub: "General construction · High liability exposure" },
  { id: "restaurants", label: "Restaurants", emoji: "🍽", sub: "Food service · Liquor liability · Slip and fall" },
  { id: "cleaning", label: "Cleaning Services", emoji: "🧹", sub: "Janitorial · Bonding requirements · Key holder exposure" },
  { id: "trucking", label: "Trucking / Towing", emoji: "🚛", sub: "Commercial auto · Cargo · High premium vertical" },
  { id: "beauty", label: "Beauty Services", emoji: "💅", sub: "Salon · Nail · Spa · Professional liability required" },
];

export type BenefitsRow = { item: string };
export type GapsRow = { item: string };
export type EquipRow = { equipment: string; exposure: string; itaRec: string };
export type ObjectionRow = { objection: string; reframe: string };
export type ScriptRow = { cue: string; line: string };
export type CrossSellRow = { trigger: string; action: string };
export type EdgeRow = { feature: string; itaFarmers: string; standard: string; competitors: string };

export type VerticalContent = {
  benefits: BenefitsRow[];
  gaps: GapsRow[];
  equip: EquipRow[];
  objections: ObjectionRow[];
  scripts: ScriptRow[];
  xsell: CrossSellRow[];
  edge: EdgeRow[];
};

const sharedBenefits: BenefitsRow[] = [
  { item: "Blanket additional insured at no extra cost" },
  { item: "Waiver of subrogation included standard" },
  { item: "Primary and non-contributory language included" },
  { item: "Hired and non-owned auto included in BOP" },
  { item: "Employment practices liability available" },
];

const sharedGaps: GapsRow[] = [
  { item: "Competitors exclude blanket AI — Farmers includes it" },
  { item: "Standard BOP excludes EPLI — Farmers offers it" },
  { item: "Hired auto excluded on most competitors' BOP" },
  { item: "Waiver of subrogation costs extra on most markets" },
  { item: "Primary and non-contributory requires endorsement elsewhere" },
];

const sharedEdge: EdgeRow[] = [
  { feature: "Blanket Additional Insured", itaFarmers: "Included standard", standard: "Endorsement required", competitors: "Extra premium" },
  { feature: "Waiver of Subrogation", itaFarmers: "Included standard", standard: "Extra cost", competitors: "Not always available" },
  { feature: "Hired and Non-Owned Auto", itaFarmers: "In BOP standard", standard: "Separate policy", competitors: "Excluded in BOP" },
  { feature: "Primary and Non-Contributory", itaFarmers: "Included", standard: "Endorsement only", competitors: "Not offered" },
];

export const verticalContent: Record<string, VerticalContent> = {
  all: {
    benefits: sharedBenefits,
    gaps: sharedGaps,
    equip: [
      { equipment: "Mowers", exposure: "Theft, blade damage", itaRec: "Inland Marine" },
      { equipment: "Trailers", exposure: "Liability, theft", itaRec: "Commercial Auto" },
      { equipment: "Hand tools", exposure: "Theft on site", itaRec: "Tools Floater" },
      { equipment: "Commercial vehicles", exposure: "Liability, collision", itaRec: "Commercial Auto" },
    ],
    objections: [
      { objection: '"Too expensive"', reframe: "Walk through what their current policy excludes. Price makes sense when the gap is visible." },
      { objection: '"My current agent is fine"', reframe: "Ask when they last had a coverage review. If over 12 months, that is the in." },
      { objection: '"I\'ll think about it"', reframe: "Summarize the two or three gaps found. Offer to send a comparison." },
    ],
    scripts: [
      { cue: "Open", line: "A lot of businesses in your vertical are underinsured specifically on additional insured requirements. We cover that standard." },
      { cue: "Position", line: "Farmers includes waiver of subrogation and primary language that most carriers charge extra for." },
      { cue: "Close", line: "Let me get you a quote so you can see exactly what this covers and what it costs side by side." },
    ],
    xsell: [
      { trigger: "GL quoted", action: "Surface Commercial Auto if they have vehicles" },
      { trigger: "BOP quoted", action: "Add Workers Comp if any employees" },
      { trigger: "Commercial Auto", action: "Add Hired and Non-Owned if employees drive" },
      { trigger: "Any policy", action: "Ask about tools and equipment exposure" },
    ],
    edge: sharedEdge,
  },
  landscapers: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Equipment breakdown often excluded — Farmers Inland Marine covers it" },
      { item: "Pesticide/herbicide application exposure missed by standard BOP" },
      { item: "Seasonal layoff workers comp gap — Farmers addresses proactively" },
      ...sharedGaps.slice(2),
    ],
    equip: [
      { equipment: "Zero-turn mowers", exposure: "Blade damage, theft, rollover", itaRec: "Inland Marine" },
      { equipment: "Trailers", exposure: "Liability during transit, theft", itaRec: "Commercial Auto" },
      { equipment: "Blowers / trimmers", exposure: "Theft on-site", itaRec: "Tools Floater" },
      { equipment: "Irrigation equipment", exposure: "Property damage to client site", itaRec: "GL endorsement" },
    ],
    objections: [
      { objection: '"I\'m a one-man operation, I don\'t need much"', reframe: "One slip-and-fall from a client can exceed $50k. A BOP is less than your monthly fuel bill." },
      { objection: '"My truck is personal, not commercial"', reframe: "If you haul equipment or clients interact with your vehicle, personal auto excludes it." },
      { objection: '"Too expensive"', reframe: "Walk through what their current policy excludes. Price makes sense when the gap is visible." },
      { objection: '"My current agent is fine"', reframe: "Ask when they last had a coverage review. If over 12 months, that is the in." },
    ],
    scripts: [
      { cue: "Open", line: "Landscaping contractors carry equipment that standard home-based policies completely ignore. Let me show you what you're actually exposed to." },
      { cue: "Position", line: "Farmers Inland Marine covers your mowers and trailers whether they're on a job site, in transit, or stored at your shop." },
      { cue: "Close", line: "Can I pull a quick BOP + Inland Marine combo quote? Takes 10 minutes and shows exactly what you're missing." },
    ],
    xsell: [
      { trigger: "BOP quoted", action: "Add Inland Marine for equipment over $5k" },
      { trigger: "Equipment insured", action: "Ask about seasonal employees — trigger Workers Comp" },
      { trigger: "GL in place", action: "Surface Hired and Non-Owned if any subcontractors used" },
      { trigger: "Any quote", action: "Ask about irrigation or hardscape — may trigger contractor's E&O" },
    ],
    edge: sharedEdge,
  },
  contractors: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Subcontractor inclusion on AI schedule — Farmers handles blanket" },
      { item: "Completed operations exposure often excluded — Farmers includes it" },
      { item: "Tools and equipment on job site uninsured by standard GL" },
      ...sharedGaps.slice(2),
    ],
    equip: [
      { equipment: "Power tools", exposure: "Theft on job site", itaRec: "Tools Floater" },
      { equipment: "Scaffolding", exposure: "Liability, structural damage", itaRec: "GL endorsement" },
      { equipment: "Trucks and vans", exposure: "Liability, cargo damage", itaRec: "Commercial Auto" },
      { equipment: "Heavy equipment (rented)", exposure: "Damage, liability", itaRec: "Inland Marine" },
    ],
    objections: [
      { objection: '"The GC carries insurance, I\'m covered"', reframe: "Their policy protects them, not you. If you cause damage, you're paying." },
      { objection: '"I only need the minimum to get the contract"', reframe: "Minimum limits rarely cover a real loss. Let me show you the exposure." },
    ],
    scripts: [
      { cue: "Open", line: "Most GCs require blanket AI and completed ops coverage. Farmers includes both standard — most carriers charge extra." },
      { cue: "Position", line: "If a subcontractor on your job causes damage six months after completion, completed operations has you covered. Standard markets often exclude that." },
      { cue: "Close", line: "Let me pull a BOP with completed ops included. I can have numbers in front of you today." },
    ],
    xsell: [
      { trigger: "GL quoted", action: "Add tools floater for any on-site equipment" },
      { trigger: "Commercial Auto", action: "Confirm cargo coverage for materials in transit" },
      { trigger: "Any quote", action: "Ask about employees vs subcontractors — Workers Comp trigger" },
    ],
    edge: sharedEdge,
  },
  restaurants: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Liquor liability often excluded from standard BOP — Farmers adds it" },
      { item: "Food spoilage coverage not standard — Farmers BOP includes it" },
      { item: "Slip and fall in dining area requires strong GL limit — Farmers standard" },
    ],
    equip: [
      { equipment: "Commercial kitchen equipment", exposure: "Breakdown, fire", itaRec: "Equipment Breakdown" },
      { equipment: "POS systems", exposure: "Theft, power surge", itaRec: "Business Personal Property" },
      { equipment: "Refrigeration units", exposure: "Breakdown, spoilage", itaRec: "Food Spoilage Rider" },
    ],
    objections: [
      { objection: '"I haven\'t had a claim in 5 years"', reframe: "Great. That means you haven't tested your coverage yet. Let's make sure you're protected when you do." },
      { objection: '"Liquor liability is too expensive"', reframe: "One dram shop claim can exceed your annual premium by 20x. Farmers bundles it at competitive pricing." },
    ],
    scripts: [
      { cue: "Open", line: "Restaurants carry one of the highest slip-and-fall exposures of any vertical. Farmers GL includes liquor liability and food spoilage coverage standard." },
      { cue: "Position", line: "If your walk-in fails on a Friday night and you lose $4,000 in inventory, that's covered. Most standard BOPs say it isn't." },
      { cue: "Close", line: "Let me pull a quote with liquor liability included and show you the side-by-side." },
    ],
    xsell: [
      { trigger: "BOP quoted", action: "Add equipment breakdown for kitchen equipment" },
      { trigger: "Any quote", action: "Ask about delivery drivers — Hired Non-Owned Auto trigger" },
      { trigger: "Full-service restaurant", action: "Surface Workers Comp — table service staff exposure" },
    ],
    edge: sharedEdge,
  },
  cleaning: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Key and lock replacement exposure — missed by standard GL" },
      { item: "Property damage on client site often sub-limited — Farmers standard" },
      { item: "Employee bonding required by contracts — Farmers includes it" },
    ],
    equip: [
      { equipment: "Industrial vacuums", exposure: "Theft, breakdown", itaRec: "Business Personal Property" },
      { equipment: "Floor buffers", exposure: "Client property damage", itaRec: "GL endorsement" },
      { equipment: "Chemical equipment", exposure: "Spill, surface damage", itaRec: "Pollution endorsement" },
    ],
    objections: [
      { objection: '"I\'m bonded already, that\'s enough"', reframe: "Bonding covers theft by employees. It doesn't cover property damage to client sites — GL does." },
      { objection: '"My clients don\'t ask for proof"', reframe: "Until the day they do, and by then there's a claim pending. Certificate of insurance takes 10 minutes." },
    ],
    scripts: [
      { cue: "Open", line: "Cleaning companies have two exposures most agents miss: client property damage and key-holder liability. Farmers covers both standard." },
      { cue: "Position", line: "If an employee damages a client's hardwood floors, you need GL with no property damage sub-limit. Farmers gives you that." },
      { cue: "Close", line: "Can I put together a BOP with employee dishonesty included? Most of your contracts probably require it." },
    ],
    xsell: [
      { trigger: "GL in place", action: "Add employee dishonesty rider" },
      { trigger: "Employees confirmed", action: "Surface Workers Comp" },
      { trigger: "Any quote", action: "Ask about commercial vehicle — cleaning van trigger" },
    ],
    edge: sharedEdge,
  },
  trucking: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Motor truck cargo often excluded from standard commercial auto" },
      { item: "Non-owned trailer liability gap — Farmers addresses it" },
      { item: "Bobtail / deadhead coverage missing from most fleet policies" },
    ],
    equip: [
      { equipment: "Semi-trucks / class 8", exposure: "Liability, collision, cargo", itaRec: "Commercial Auto + Cargo" },
      { equipment: "Trailers (non-owned)", exposure: "Liability while hitched", itaRec: "Non-Owned Trailer" },
      { equipment: "Tow trucks", exposure: "On-hook liability", itaRec: "On-Hook Towing coverage" },
    ],
    objections: [
      { objection: '"My owner-op handles his own insurance"', reframe: "If he's under your authority, you're still exposed. Contingent cargo protects you." },
      { objection: '"Rates are already too high"', reframe: "Let me show you what a proper cargo limit does vs what you'd pay out-of-pocket. The math usually changes the conversation." },
    ],
    scripts: [
      { cue: "Open", line: "Trucking is the highest-premium commercial vertical we work with. The gap between proper coverage and a covered loss is also the largest." },
      { cue: "Position", line: "Farmers Commercial Auto includes hired and non-owned coverage standard. Most fleet policies charge a separate premium for that." },
      { cue: "Close", line: "Let me run a cargo + liability combo. I need your authority number and top five lanes — takes 15 minutes." },
    ],
    xsell: [
      { trigger: "Commercial Auto quoted", action: "Add Motor Truck Cargo separately" },
      { trigger: "Owner-ops confirmed", action: "Surface bobtail / occupational accident" },
      { trigger: "Multiple vehicles", action: "Fleet pricing — consolidate under one policy" },
    ],
    edge: sharedEdge,
  },
  beauty: {
    benefits: sharedBenefits,
    gaps: [
      { item: "Professional liability (E&O) not in standard BOP — Farmers offers it" },
      { item: "Product liability for retail sales often excluded" },
      { item: "Client injury from chemical services requires GL + professional — Farmers bundles" },
    ],
    equip: [
      { equipment: "Styling chairs / equipment", exposure: "Client injury, malfunction", itaRec: "Business Personal Property" },
      { equipment: "Chemical supplies", exposure: "Client reaction, property damage", itaRec: "Product Liability" },
      { equipment: "Retail display/inventory", exposure: "Theft, damage", itaRec: "Business Personal Property" },
    ],
    objections: [
      { objection: '"I work from home, not a salon"', reframe: "Home-based business exclusions in your homeowner's policy mean zero coverage for client visits. A BOP fixes that." },
      { objection: '"I\'ve never had a client complaint"', reframe: "A chemical reaction claim can come weeks later. Professional liability is retroactive — standard markets don't include it." },
    ],
    scripts: [
      { cue: "Open", line: "Beauty service providers have a professional liability exposure that almost every standard BOP excludes. Farmers is one of the few that includes it." },
      { cue: "Position", line: "If a client has a reaction to a chemical treatment two weeks after service, professional liability is what pays. GL alone won't cover that." },
      { cue: "Close", line: "Let me build a BOP with professional liability included. Most of your competitors don't have this — it's a strong retention point." },
    ],
    xsell: [
      { trigger: "BOP quoted", action: "Add professional liability / E&O" },
      { trigger: "Retail sales confirmed", action: "Surface product liability" },
      { trigger: "Any employees", action: "Workers Comp — chemical exposure risk" },
    ],
    edge: sharedEdge,
  },
};

export const farmersEdgeHeader = {
  title: "Farmers Edge",
  subtitle: "Commercial intelligence hub — live call reference, coverage gaps, scripts, and our edge over competitors.",
  helpId: "farmers-edge" as const,
  freshnessLabel: "Updated 4 min ago · Sheets",
  scopeTag: "Commercial Only",
  prdRef: "PRD v1.15 §5.9",
};
