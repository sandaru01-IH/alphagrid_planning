// ---------------------------------------------------------------------------
// Typed ESM bridge to the validated regulation engine.
//
// engine.js is intentionally left byte-for-byte as authored and validated by
// engine.test.cjs (13 passing tests, run with `node --test`). It is a UMD
// module: in a browser context it attaches itself to `self.RegEngine`. This
// file's only job is to import it for its side effect (so it executes and
// attaches) and re-export its members with types, so the exact tested logic
// — not a reimplementation — is what the UI calls.
// ---------------------------------------------------------------------------
import "./engine.core.js";

export type Confidence = "FACT" | "ASSUMPTION" | "ESTIMATE" | "INTERPRETED";

export interface ComplianceFlag {
  level: "amber" | "red";
  message: string;
}

export type ProgramType = "residential" | "commercial" | "mixed_use";
export type DensityTier = "low" | "medium" | "high";

export interface Parcel {
  siteAreaM2: number;
  frontageM: number;
  roadWidthM: number;
  density: DensityTier;
}

export interface Program {
  type: ProgramType;
  retailShare?: number;
  avgUnitSizeM2?: number;
}

export interface FARResult {
  value: number;
  confidence: Confidence;
  note?: string;
  bandLabel?: string;
}

export interface HeightCategory {
  id: string;
  label: string;
  heightMin: number;
  heightMax: number;
  side: number;
  front: number;
  rear: number;
  coverage: { residential: number; nonResidential: number };
  coverageConfidence: Confidence;
}

export interface ScenarioResult {
  scenarioId: string;
  scenarioLabel: string;
  inputs: {
    siteArea: number;
    frontage: number;
    depth: number;
    roadWidthM: number;
    density: DensityTier;
    utilisation: number;
    programType: ProgramType;
  };
  far: FARResult;
  heightCategory: HeightCategory;
  footprintM2: number;
  footprintWidthM: number;
  footprintDepthM: number;
  governingConstraint: "setback" | "coverage";
  floors: number;
  heightM: number;
  maxRegulatedGFA: number;
  achievedGFA: number;
  regulationUtilisationPct: number;
  openSpaceM2: number;
  openSpacePct: number;
  retailGFA: number;
  residentialGFA: number;
  units: number;
  parking: { residential: number; retail: number; total: number; citation?: unknown };
  flags: ComplianceFlag[];
  complianceLevel: "amber" | "red";
}

export interface ParsedCommand {
  forceFloors?: number;
  programType?: ProgramType;
  note?: string;
  scenario?: "maximum_yield" | "conservative";
  targetUnits?: number;
}

interface RegEngineShape {
  SOURCES: Record<string, unknown>;
  PILOT_CONTEXT: unknown;
  HEIGHT_CATEGORIES: HeightCategory[];
  ROAD_WIDTHS: unknown;
  MIN_HABITABLE_HEIGHT_M: number;
  ASSUMED_FLOOR_TO_FLOOR_M: number;
  heightCategoryFor: (heightM: number) => HeightCategory;
  lookupFAR: (siteAreaM2: number, density: string, roadWidthM: number) => FARResult;
  apartmentParkingSpaces: (unitCount: number, unitsOver200sqm: number) => number;
  retailParkingSpaces: (retailGfaM2: number) => number;
  computeScenario: (parcel: Parcel, program: Program, utilisation: number) => ScenarioResult;
  generateScenarios: (parcel: Parcel, program: Program) => ScenarioResult[];
  parseCommand: (text: string) => ParsedCommand;
}

declare global {
  interface Window {
    RegEngine: RegEngineShape;
  }
}

const Engine: RegEngineShape = (typeof window !== "undefined" ? window.RegEngine : undefined) as RegEngineShape;

export default Engine;
