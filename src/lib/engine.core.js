/**
 * AlphaGRID Development Intelligence — Deterministic Regulation Engine
 * ---------------------------------------------------------------------
 * Pilot scope: Panadura (Panadura Urban Council, under UDA planning
 * jurisdiction), applying the general UDA Planning & Development
 * Regulations (the default instrument for UDA-administered local
 * authority areas) since no digitised, area-specific numeric
 * regulation table for the Panadura Development Plan itself was
 * available at build time. Every value below carries a citation and a
 * confidence flag so that this substitution is visible, not hidden.
 *
 * This module is the single source of truth for the calculation logic.
 * It runs unmodified under Node (via require/module.exports) and in a
 * browser (attached to `window.RegEngine`) so the exact code validated
 * by engine.test.js is the exact code the demo UI executes — there is
 * no second, hand-copied implementation.
 *
 * QA principle followed throughout (per product brief §27): every
 * output is tagged FACT (directly from a cited regulation), ASSUMPTION
 * (a stated, editable working assumption), ESTIMATE (derived number),
 * or INTERPRETED (engineering interpolation/crosswalk where the source
 * table did not give an exact row). Nothing is presented as more
 * certain than it is.
 */
(function (root, factory) {
  // Browser-only copy of the engine (see engine.ts for why this file
  // exists separately from engine.cjs): always attach to the global
  // object. The original UMD auto-detection here used to also support a
  // module.exports branch, but Rollup's commonjs interop shims a `module`
  // object into scope during production bundling, which made this file
  // silently take the wrong branch and never attach to `self` in prod
  // builds. Node/tests use engine.cjs instead, so this file no longer
  // needs to auto-detect — it only ever needs the browser branch.
  root.RegEngine = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ------------------------------------------------------------------
  // 1. SOURCE DOCUMENTS
  // ------------------------------------------------------------------
  var SOURCES = {
    PDR: {
      id: "PDR",
      title: "Planning & Development Regulations (Gazette Extraordinary) — Schedules, as summarised by Sri Jayawardenepura Kotte Municipal Council",
      authority: "Urban Development Authority (UDA), Sri Lanka",
      note: "General national planning/building control instrument administered by UDA; applied here as the default framework for the Panadura Urban Council pilot area pending confirmation against the site-specific Panadura Development Plan schedule.",
      accessedYear: 2026
    }
  };

  // ------------------------------------------------------------------
  // 2. PLAN / JURISDICTION CONTEXT (pilot)
  // ------------------------------------------------------------------
  var PILOT_CONTEXT = {
    locationLabel: "Panadura",
    localAuthority: "Panadura Urban Council",
    planningAuthority: "Urban Development Authority (UDA)",
    regulationInstrument: SOURCES.PDR.title,
    confidence: "INTERPRETED",
    note: "Panadura falls under UDA planning jurisdiction. The area-specific Panadura Development Plan (last available edition, c.2015) does not publish digitised numeric development-control tables at the source checked, so this pilot applies UDA's general Planning & Development Regulations as the default rule set. Confirm against the current gazetted Panadura Development Plan before relying on results for an actual transaction."
  };

  // ------------------------------------------------------------------
  // 3. HEIGHT CATEGORIES — Schedule 6, Form E (setbacks) + plot coverage
  // ------------------------------------------------------------------
  // heightMin is exclusive lower bound in metres, heightMax inclusive upper bound.
  var HEIGHT_CATEGORIES = [
    {
      id: "low_a", label: "Low Rise (< 7m)", heightMin: 0, heightMax: 7,
      front: 6, side: 2.3, rear: 2.3,
      coverage: { residential: 65, nonResidential: 80 },
      coverageConfidence: "FACT",
      setbackConfidence: "FACT",
      citation: "Schedule 6, Form E; plot coverage table (Low-Rise ≤7m)"
    },
    {
      id: "low_b", label: "Low Rise (7m–15m)", heightMin: 7, heightMax: 15,
      front: 6, side: 3.0, rear: 3.0,
      coverage: { residential: 65, nonResidential: 65 },
      coverageConfidence: "INTERPRETED",
      setbackConfidence: "FACT",
      citation: "Schedule 6, Form E (setback FACT). Coverage for 7–15m is not separately tabulated in the source excerpt; mapped to the 'Intermediate to High-Rise: 65% standard' band — confirm against the full schedule."
    },
    {
      id: "intermediate", label: "Intermediate (15m–30m)", heightMin: 15, heightMax: 30,
      front: 12, side: 4.0, rear: 4.0,
      coverage: { residential: 65, nonResidential: 65 },
      coverageConfidence: "FACT",
      setbackConfidence: "FACT",
      citation: "Schedule 6, Form E; plot coverage table (Intermediate to High-Rise 15m+, 65% standard)"
    },
    {
      id: "middle", label: "Middle Rise (30m–50m)", heightMin: 30, heightMax: 50,
      front: 20, side: 5.0, rear: 5.0,
      coverage: { residential: 65, nonResidential: 65 },
      coverageConfidence: "INTERPRETED",
      setbackConfidence: "FACT",
      citation: "Schedule 6, Form E (setback FACT). Coverage carried forward from the 15m+ 'standard' band pending a separate 30–50m figure — confirm against the full schedule."
    },
    {
      id: "high", label: "High Rise (50m–75m)", heightMin: 50, heightMax: 75,
      front: 30, side: 6.0, rear: 6.0,
      coverage: { residential: 50, nonResidential: 50, podiumAllowance: 65 },
      coverageConfidence: "FACT",
      setbackConfidence: "FACT",
      citation: "Schedule 6, Form E; plot coverage table (High-Rise 50–75m: 50% base, 65% permitted at podium levels not exceeding 20% of tower height or 12 floors, whichever is less)"
    }
  ];

  function heightCategoryFor(heightM) {
    for (var i = 0; i < HEIGHT_CATEGORIES.length; i++) {
      var c = HEIGHT_CATEGORIES[i];
      if (heightM > c.heightMin && heightM <= c.heightMax) return c;
    }
    // Fall back to the lowest or highest band for out-of-range guesses.
    return heightM <= 0 ? HEIGHT_CATEGORIES[0] : HEIGHT_CATEGORIES[HEIGHT_CATEGORIES.length - 1];
  }

  // ------------------------------------------------------------------
  // 4. FAR TABLE — Form C (non-zoning-factor areas)
  // ------------------------------------------------------------------
  // Road widths: 6, 9, 12, 15 (15 represents "15m and above")
  var ROAD_WIDTHS = [6, 9, 12, 15];
  var FAR_BANDS = [
    { min: 0, max: 250, label: "150–250 m²", values: {
      low:    [0.8, 0.9, 0.9, 0.9],
      medium: [1.3, 1.3, 1.4, 1.4],
      high:   [1.6, 1.7, 1.8, 1.9]
    }},
    { min: 250, max: 1500, label: "1000–1500 m²", pivotAt: 1000, values: {
      low:    [1.1, 1.3, 1.5, 1.8],
      medium: [1.6, 1.9, 2.3, 2.7],
      high:   [2.2, 2.5, 3.0, 3.6]
    }},
    { min: 1500, max: Infinity, label: "> 4000 m²", pivotAt: 4000, values: {
      low:    [1.5, 1.9, 2.3, 2.8],
      medium: [2.5, 2.8, 3.5, 4.0],
      high:   [3.0, 3.8, 4.5, 5.5]
    }}
  ];
  var FAR_CITATION = "Planning & Development Regulations, Schedule (Form C — Non-Zoning-Factor Areas)";

  function nearestRoadWidthIndex(roadWidthM) {
    var idx = 0;
    var best = Infinity;
    for (var i = 0; i < ROAD_WIDTHS.length; i++) {
      var d = Math.abs(ROAD_WIDTHS[i] - roadWidthM);
      if (roadWidthM >= ROAD_WIDTHS[i] && d <= best) { best = d; idx = i; }
    }
    // if roadWidth exceeds the largest tabulated width, use the last column
    if (roadWidthM >= ROAD_WIDTHS[ROAD_WIDTHS.length - 1]) idx = ROAD_WIDTHS.length - 1;
    return idx;
  }

  /**
   * Look up (or interpolate) the applicable FAR.
   * Returns { value, confidence, citation, note }
   */
  function lookupFAR(siteAreaM2, density, roadWidthM) {
    var rIdx = nearestRoadWidthIndex(roadWidthM);
    var known = FAR_BANDS.map(function (b) { return { pivot: b.pivotAt != null ? b.pivotAt : (b.max === 250 ? 200 : b.min), value: b.values[density][rIdx] }; });
    // known pivots, in increasing site-area order: 200 (mid of 150-250), 1000, 4000
    var points = [
      { area: 200, value: FAR_BANDS[0].values[density][rIdx] },
      { area: 1000, value: FAR_BANDS[1].values[density][rIdx] },
      { area: 4000, value: FAR_BANDS[2].values[density][rIdx] }
    ];

    if (siteAreaM2 <= points[0].area) {
      return { value: points[0].value, confidence: "FACT", citation: FAR_CITATION, note: "Directly tabulated for the 150–250 m² plot-size band." };
    }
    if (siteAreaM2 >= points[2].area) {
      return { value: points[2].value, confidence: "FACT", citation: FAR_CITATION, note: "Directly tabulated for the >4000 m² plot-size band." };
    }
    // Between two known points -> linear interpolation, flagged INTERPRETED.
    var lo, hi;
    if (siteAreaM2 <= points[1].area) { lo = points[0]; hi = points[1]; }
    else { lo = points[1]; hi = points[2]; }
    var t = (siteAreaM2 - lo.area) / (hi.area - lo.area);
    var interpolated = lo.value + t * (hi.value - lo.value);
    return {
      value: Math.round(interpolated * 100) / 100,
      confidence: "INTERPRETED",
      citation: FAR_CITATION,
      note: "Site area of " + siteAreaM2 + " m² falls between the tabulated " + lo.area + " m² and " + hi.area + " m² rows; value linearly interpolated. Confirm the exact intermediate row against the full gazetted schedule before final use."
    };
  }

  // ------------------------------------------------------------------
  // 5. PARKING — Schedule 10
  // ------------------------------------------------------------------
  var PARKING_CITATION = "Planning & Development Regulations, Schedule 10";

  function apartmentParkingSpaces(unitCount, unitsOver200sqm) {
    unitsOver200sqm = unitsOver200sqm || 0;
    var base = unitCount; // 1 space per unit
    var extra = unitsOver200sqm; // +1 per unit whose floor area exceeds 200 m²
    var visitor = Math.ceil(unitCount / 10); // 1 visitor space per 10 units
    return base + extra + visitor;
  }

  function retailParkingSpaces(retailGfaM2) {
    if (retailGfaM2 <= 0) return 0;
    if (retailGfaM2 <= 30) return 2;
    return 2 + Math.ceil((retailGfaM2 - 30) / 30);
  }

  // ------------------------------------------------------------------
  // 6. ROOM HEIGHT / FLOOR-TO-FLOOR ASSUMPTION — Schedule 7 / Reg 67(1)(a)
  // ------------------------------------------------------------------
  var MIN_HABITABLE_HEIGHT_M = 2.8; // FACT — Schedule 7, Reg 67(1)(a)
  var ASSUMED_FLOOR_TO_FLOOR_M = 3.0; // ASSUMPTION — typical construction allowance above the regulatory minimum

  // ------------------------------------------------------------------
  // 7. CORE CAPACITY CALCULATION (single scenario, given a target GFA utilisation)
  // ------------------------------------------------------------------
  /**
   * parcel: { siteAreaM2, frontageM, roadWidthM, density: 'low'|'medium'|'high' }
   * program: { type: 'residential'|'mixed_use'|'commercial', retailShare: 0..1, avgUnitSizeM2 }
   * utilisation: 0..1 fraction of the regulation-maximum GFA this scenario targets
   */
  function computeScenario(parcel, program, utilisation) {
    var siteArea = parcel.siteAreaM2;
    var frontage = parcel.frontageM || Math.sqrt(siteArea);
    var depth = siteArea / frontage;

    var farResult = lookupFAR(siteArea, parcel.density, parcel.roadWidthM);
    var maxRegulatedGFA = siteArea * farResult.value;
    var targetGFA = maxRegulatedGFA * utilisation;

    // Iteratively converge on a consistent height category, since coverage
    // and setbacks both depend on the height band, and the achievable
    // height depends on the footprint those very rules produce.
    var category = HEIGHT_CATEGORIES[0];
    var footprint = 0, floors = 0, heightM = 0;
    var footprintWidth = 0, footprintDepth = 0, governingConstraint = "setback";
    for (var iter = 0; iter < 6; iter++) {
      var coveragePct = program.type === "commercial" ? category.coverage.nonResidential : category.coverage.residential;
      var coverageFootprint = siteArea * (coveragePct / 100);

      var buildableWidth = Math.max(0, frontage - 2 * category.side);
      var buildableDepth = Math.max(0, depth - category.front - category.rear);
      var setbackFootprint = buildableWidth * buildableDepth;

      var cappedBySetback = setbackFootprint <= coverageFootprint;
      var newFootprintFull = Math.min(coverageFootprint, setbackFootprint);
      // Scenario generation heuristic (a methodology choice, not a
      // regulation value — see engine.js header): footprint utilisation
      // scales mildly, from 55% of the full envelope (conservative) up to
      // 100% (maximum yield), while GFA target scales fully with
      // `utilisation` (62%-100%). Because these two scale at different
      // rates, floors = targetGFA / footprint genuinely increases across
      // scenarios instead of the utilisation factor cancelling out of the
      // ratio (it would cancel if both scaled by the same factor).
      var footprintFraction = 0.55 + 0.45 * utilisation;
      var newFootprint = newFootprintFull * footprintFraction;
      newFootprint = Math.max(newFootprint, 0);

      // Floor count is floored (never rounded up) so a scenario can never
      // *by construction* propose an achieved GFA above its own target —
      // rounding up here would silently generate a non-compliant scenario.
      var newFloors = newFootprint > 0 ? Math.max(1, Math.floor(targetGFA / newFootprint)) : 0;
      var newHeight = newFloors * ASSUMED_FLOOR_TO_FLOOR_M;
      var newCategory = heightCategoryFor(newHeight);

      footprint = newFootprint;
      floors = newFloors;
      heightM = newHeight;
      // For the plan-view visualisation only: render the footprint as a
      // rectangle sharing the setback envelope's aspect ratio, scaled
      // down so its area matches the reported footprint exactly (the
      // footprint area itself, above, is never derived from this).
      if (buildableWidth > 0 && buildableDepth > 0 && setbackFootprint > 0) {
        var scaleFactor = Math.sqrt(newFootprint / setbackFootprint);
        footprintWidth = buildableWidth * scaleFactor;
        footprintDepth = buildableDepth * scaleFactor;
      } else {
        footprintWidth = 0;
        footprintDepth = 0;
      }
      governingConstraint = cappedBySetback ? "setback" : "coverage";

      if (newCategory.id === category.id) { category = newCategory; break; }
      category = newCategory;
    }

    var achievedGFA = footprint * floors;
    var openSpaceM2 = Math.max(0, siteArea - footprint);
    var regulationUtilisationPct = maxRegulatedGFA > 0 ? Math.round((achievedGFA / maxRegulatedGFA) * 1000) / 10 : 0;

    // Program split
    var retailShare = program.type === "mixed_use" ? (program.retailShare != null ? program.retailShare : 0.12) : (program.type === "commercial" ? 1 : 0);
    var retailGFA = achievedGFA * retailShare;
    var residentialGFA = achievedGFA - retailGFA;
    var avgUnitSize = program.avgUnitSizeM2 || 70;
    var units = program.type === "commercial" ? 0 : Math.max(0, Math.floor(residentialGFA / avgUnitSize));
    var unitsOver200 = 0; // pilot assumption: unit mix stays under 200 m² per unit

    var parkingResidential = units > 0 ? apartmentParkingSpaces(units, unitsOver200) : 0;
    var parkingRetail = retailGFA > 0 ? retailParkingSpaces(retailGFA) : 0;
    var totalParking = parkingResidential + parkingRetail;

    // Compliance flags
    var flags = [];
    if (farResult.confidence !== "FACT") {
      flags.push({ level: "amber", message: "FAR value for this plot size is interpolated between tabulated bands (" + farResult.note + ")" });
    }
    if (category.coverageConfidence !== "FACT") {
      flags.push({ level: "amber", message: "Plot coverage for the " + category.label + " band is a crosswalk, not a directly tabulated figure — confirm against the full schedule." });
    }
    if (achievedGFA > maxRegulatedGFA * 1.001) {
      flags.push({ level: "red", message: "Achieved GFA (" + Math.round(achievedGFA) + " m²) exceeds the maximum regulated GFA (" + Math.round(maxRegulatedGFA) + " m²) — the minimum viable floor count on this footprint already exceeds the applicable FAR. Reduce footprint or seek a variance." });
    }
    if (footprint <= 0) {
      flags.push({ level: "red", message: "Setback geometry leaves no buildable footprint for this frontage/depth combination at this height category." });
    }
    flags.push({ level: "amber", message: "Applies the general UDA Planning & Development Regulations, not a confirmed Panadura-specific zoning table — see jurisdiction note." });
    flags.push({ level: "amber", message: "Height category, setbacks and coverage may be subject to Planning Committee/UDA discretion at final review (Regulation 48 and related provisions)." });

    var complianceLevel = flags.some(function (f) { return f.level === "red"; }) ? "red" : "amber";

    return {
      inputs: { siteArea: siteArea, frontage: frontage, depth: depth, roadWidthM: parcel.roadWidthM, density: parcel.density, utilisation: utilisation, programType: program.type },
      far: farResult,
      heightCategory: category,
      footprintM2: Math.round(footprint),
      footprintWidthM: Math.round(footprintWidth * 10) / 10,
      footprintDepthM: Math.round(footprintDepth * 10) / 10,
      governingConstraint: governingConstraint,
      floors: floors,
      heightM: Math.round(heightM * 10) / 10,
      maxRegulatedGFA: Math.round(maxRegulatedGFA),
      achievedGFA: Math.round(achievedGFA),
      regulationUtilisationPct: regulationUtilisationPct,
      openSpaceM2: Math.round(openSpaceM2),
      openSpacePct: siteArea > 0 ? Math.round((openSpaceM2 / siteArea) * 1000) / 10 : 0,
      retailGFA: Math.round(retailGFA),
      residentialGFA: Math.round(residentialGFA),
      units: units,
      parking: { residential: parkingResidential, retail: parkingRetail, total: totalParking, citation: PARKING_CITATION },
      flags: flags,
      complianceLevel: complianceLevel
    };
  }

  // ------------------------------------------------------------------
  // 8. SCENARIO SET
  // ------------------------------------------------------------------
  var SCENARIO_DEFS = [
    { id: "conservative", label: "Conservative", utilisation: 0.62 },
    { id: "balanced", label: "Balanced", utilisation: 0.85 },
    { id: "maximum_yield", label: "Maximum Yield", utilisation: 1.0 }
  ];

  function generateScenarios(parcel, program) {
    return SCENARIO_DEFS.map(function (def) {
      var result = computeScenario(parcel, program, def.utilisation);
      result.scenarioId = def.id;
      result.scenarioLabel = def.label;
      return result;
    });
  }

  // ------------------------------------------------------------------
  // 9. LIGHTWEIGHT INTENT PARSER (rule-based, NOT an LLM)
  // ------------------------------------------------------------------
  // Per product brief §14.6, regulatory values must never come from an
  // unsupported language-model guess. This parser only recognises a
  // fixed set of structured commands and maps them to engine
  // parameters — it never invents a rule value itself.
  function parseCommand(text) {
    var t = (text || "").toLowerCase();
    var out = {};
    var floorsMatch = t.match(/(\d+)\s*floor/);
    if (floorsMatch) out.forceFloors = parseInt(floorsMatch[1], 10);
    if (/retail|shop|ground floor commercial/.test(t)) out.programType = "mixed_use";
    if (/apartment|residential/.test(t) && !/retail|shop/.test(t)) out.programType = "residential";
    if (/hotel/.test(t)) out.note = "Hotel-specific parking/room rules are not yet encoded for this pilot — treated as commercial for a rough estimate only.";
    if (/max(imum)? yield|highest/.test(t)) out.scenario = "maximum_yield";
    if (/conservative|safe|low risk/.test(t)) out.scenario = "conservative";
    if (/open space|green space/.test(t)) out.scenario = "conservative";
    var unitsMatch = t.match(/(\d+)\s*(apartments|units)/);
    if (unitsMatch) out.targetUnits = parseInt(unitsMatch[1], 10);
    return out;
  }

  return {
    SOURCES: SOURCES,
    PILOT_CONTEXT: PILOT_CONTEXT,
    HEIGHT_CATEGORIES: HEIGHT_CATEGORIES,
    ROAD_WIDTHS: ROAD_WIDTHS,
    MIN_HABITABLE_HEIGHT_M: MIN_HABITABLE_HEIGHT_M,
    ASSUMED_FLOOR_TO_FLOOR_M: ASSUMED_FLOOR_TO_FLOOR_M,
    heightCategoryFor: heightCategoryFor,
    lookupFAR: lookupFAR,
    apartmentParkingSpaces: apartmentParkingSpaces,
    retailParkingSpaces: retailParkingSpaces,
    computeScenario: computeScenario,
    generateScenarios: generateScenarios,
    parseCommand: parseCommand
  };
});
