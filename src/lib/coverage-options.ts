export interface CoverageOption {
    value: string;
    title: string;
    badge: string;
    badgeClass: string;
    description: string;
    bullets: string[];
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
    {
        value: "road-traffic-act-only",
        title: "Road Traffic Act Only",
        badge: "Statutory Minimum",
        badgeClass: "text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-semibold",
        description:
            "This policy covers liability for Third Party Personal Injuries or Death. For any vehicle, this is the minimum cover required by the Road Traffic Act.",
        bullets: [
            "Third-party bodily injury or death",
            "Meets legal requirements for public roads",
            "No own vehicle or property damage coverage",
        ],
    },
];