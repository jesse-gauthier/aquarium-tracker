// Structured optimal / acceptable parameter ranges for freshwater community aquariums.
// Source text that was converted:
// Ammonia: 0 ppm, Nitrite: 0 ppm, Nitrate: 0 - 40 ppm (with lower preferred),
// pH: 6.5 - 7.5 (specific fish vary), General Hardness (GH): 4 - 8 dGH / 70 - 140 ppm,
// Carbonate Hardness (KH): 3 dKH / 50 ppm or above to maintain stable pH.
// These ideal ranges can vary depending on specific fish and plants.

// Exposed globally (no module system) so other inline scripts can access.
window.AQUARIUM_OPTIMAL = {
    ammonia: {
        key: "ammonia",
        label: "Ammonia (NH3/NH4)",
        ideal: 0,
        min: 0,
        max: 0, // Any readable ammonia is undesirable in a fully cycled tank
        unit: "ppm",
        cautionAbove: 0.25, // common hobby warning threshold
        dangerAbove: 1.0,
        description: "Should always remain at 0 once the tank is cycled.",
    },
    nitrite: {
        key: "nitrite",
        label: "Nitrite (NO2)",
        ideal: 0,
        min: 0,
        max: 0,
        unit: "ppm",
        cautionAbove: 0.25,
        dangerAbove: 1.0,
        description: "Persistent nitrite indicates the second phase still in progress.",
    },
    nitrate: {
        key: "nitrate",
        label: "Nitrate (NO3)",
        min: 0,
        max: 40,
        preferredBelow: 20,
        unit: "ppm",
        description: "Keep as low as practical (<20ppm preferred) via water changes / plants.",
    },
    ph: {
        key: "ph",
        label: "pH",
        min: 6.5,
        max: 7.5,
        unit: "pH",
        description: "General mid-range community pH; species-specific needs may differ.",
    },
    gh: {
        key: "gh",
        label: "General Hardness (GH)",
        min_dGH: 4,
        max_dGH: 8,
        min_ppm: 70,
        max_ppm: 140,
        unitPrimary: "dGH",
        unitAlt: "ppm",
        description: "Moderate hardness suitable for many community fish and plants.",
    },
    kh: {
        key: "kh",
        label: "Carbonate Hardness (KH)",
        min_dKH: 3,
        min_ppm: 50,
        unitPrimary: "dKH",
        unitAlt: "ppm",
        description: "At least 3 dKH (≈50ppm) helps buffer and stabilize pH.",
    },
};

// Convenience: also provide as an ordered array (could be useful for rendering tables)
window.AQUARIUM_OPTIMAL_LIST = Object.keys(window.AQUARIUM_OPTIMAL).map(
    (k) => window.AQUARIUM_OPTIMAL[k]
);

// Optional helper utilities (can be used later for coloring logic)
window.getParameterStatus = function (paramKey, value) {
    const p = window.AQUARIUM_OPTIMAL[paramKey];
    if (!p || value === undefined || value === null || value === "") return "unknown";

    const numeric = parseFloat(value);
    if (isNaN(numeric)) return "invalid";

    // Special handling for ammonia & nitrite (ideal exactly 0)
    if (paramKey === "ammonia" || paramKey === "nitrite") {
        if (numeric <= p.max) return "ideal"; // exactly 0
        if (numeric > p.dangerAbove) return "danger";
        if (numeric > p.cautionAbove) return "warning";
        return "elevated"; // >0 but below cautionAbove
    }

    if (paramKey === "nitrate") {
        if (numeric <= p.preferredBelow) return "preferred";
        if (numeric <= p.max) return "acceptable";
        return "high";
    }

    if (paramKey === "ph") {
        if (numeric < p.min) return "low";
        if (numeric > p.max) return "high";
        // Optionally classify midpoint preference
        const mid = (p.min + p.max) / 2;
        if (Math.abs(numeric - mid) <= 0.2) return "optimal";
        return "acceptable";
    }

    if (paramKey === "gh") {
        if (numeric < p.min_dGH) return "low";
        if (numeric > p.max_dGH) return "high";
        return "acceptable";
    }

    if (paramKey === "kh") {
        if (numeric < p.min_dKH) return "low";
        return "acceptable"; // Only minimum constraint in source text
    }

    return "unknown";
};

// Returns a CSS class (can map later) for quick styling
window.getParameterClass = function (status) {
    switch (status) {
        case "ideal":
        case "preferred":
        case "optimal":
            return "param-ok";
        case "acceptable":
            return "param-acceptable";
        case "elevated":
        case "low":
            return "param-elevated";
        case "warning":
            return "param-warning";
        case "high":
        case "danger":
            return "param-danger";
        default:
            return "param-unknown";
    }
};

// (You can define the CSS classes above in your main HTML to color-code.)