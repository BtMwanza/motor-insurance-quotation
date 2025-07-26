export interface CoverageOption {
    value: string;
    title: string;
    badge: string;
    badgeClass: string;
    description: string;
    bullets: string[];
}
export interface CoveragePeriodOptions {
    value: string;
    label: string;
    description: string;
}

export const COVERAGE_OPTIONS: CoverageOption[] = [
    {
        value: "third-party-only",
        title: "Third Party Only",
        badge: "Minimum Legal Requirement",
        badgeClass: "text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded",
        description:
            "Basic protection covering accidents causing injury or death to others only. This is the minimum legal requirement in Zambia.",
        bullets: [
            "Third-party bodily injury coverage",
            "Third-party property damage",
            "Legal liability protection",
            "No own vehicle damage coverage",
        ],
    },
    {
        value: "third-party-fire-theft",
        title: "Third Party Fire & Theft",
        badge: "Enhanced Protection",
        badgeClass: "text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded",
        description:
            "Includes all Third Party Only benefits plus protection against vehicle fire and theft.",
        bullets: [
            "All Third Party Only benefits",
            "Fire damage to your vehicle",
            "Theft protection",
            "Vandalism coverage",
            "Attempted theft damage",
        ],
    },
    {
        value: "comprehensive",
        title: "Comprehensive",
        badge: "Complete Protection",
        badgeClass: "text-xs bg-green-100 text-green-800 px-2 py-1 rounded",
        description:
            "Complete protection including own-vehicle damage, theft, fire, plus third-party liability. Eligible for No-Claim Discount.",
        bullets: [
            "All Third Party Fire & Theft benefits",
            "Own vehicle accident damage",
            "Collision coverage",
            "Weather damage protection",
            "Windscreen replacement",
            "No-Claim Discount eligible",
        ],
    },
];


export const COVERAGE_PERIOD_OPTIONS: CoveragePeriodOptions[] = [
    {
        value: "quarterly",
        label: "Quarterly (3 months)",
        description: "Pay every 3 months + 2% admin fee",
    },
    {
        value: "semi-annual",
        label: "Semi-Annual (6 months)",
        description: "Pay every 6 months + 1% admin fee",
    },
    {
        value: "three-quarters",
        label: "Three Quarters (9 months)",
        description: "Pay for 9 months + 0.5% admin fee",
    },
    {
        value: "annual",
        label: "Annual (12 months)",
        description: "Pay once yearly - 3% discount",
    },
];