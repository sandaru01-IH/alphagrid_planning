import { create } from "zustand";
import type { DensityTier, ProgramType } from "../lib/engine";

export type ScenarioId = "conservative" | "balanced" | "maximum_yield";
export type ViewerMode = "developer" | "investor" | "professional";

export interface ParcelProfile {
  id: string;
  name: string;
  siteAreaM2: number;
  frontageM: number;
  roadWidthM: number;
  density: DensityTier;
  programType: ProgramType;
}

export const SAVED_PARCELS: ParcelProfile[] = [
  {
    id: "panadura-01",
    name: "Panadura — Galle Road frontage",
    siteAreaM2: 950,
    frontageM: 22,
    roadWidthM: 12,
    density: "medium",
    programType: "mixed_use",
  },
  {
    id: "panadura-02",
    name: "Panadura — Wickramasinghepura lane",
    siteAreaM2: 200,
    frontageM: 10,
    roadWidthM: 9,
    density: "low",
    programType: "residential",
  },
  {
    id: "panadura-03",
    name: "Panadura — Kaldemulla arterial",
    siteAreaM2: 3200,
    frontageM: 40,
    roadWidthM: 15,
    density: "high",
    programType: "commercial",
  },
];

interface AssessmentState {
  mode: ViewerMode;
  setMode: (m: ViewerMode) => void;

  activeParcelId: string;
  siteAreaM2: number;
  frontageM: number;
  roadWidthM: number;
  density: DensityTier;
  programType: ProgramType;
  scenarioId: ScenarioId;

  loadParcel: (p: ParcelProfile) => void;
  setField: <K extends "siteAreaM2" | "frontageM" | "roadWidthM" | "density" | "programType">(
    key: K,
    value: AssessmentState[K]
  ) => void;
  setScenario: (id: ScenarioId) => void;
}

const initial = SAVED_PARCELS[0];

export const useAssessment = create<AssessmentState>((set) => ({
  mode: "developer",
  setMode: (m) => set({ mode: m }),

  activeParcelId: initial.id,
  siteAreaM2: initial.siteAreaM2,
  frontageM: initial.frontageM,
  roadWidthM: initial.roadWidthM,
  density: initial.density,
  programType: initial.programType,
  scenarioId: "balanced",

  loadParcel: (p) =>
    set({
      activeParcelId: p.id,
      siteAreaM2: p.siteAreaM2,
      frontageM: p.frontageM,
      roadWidthM: p.roadWidthM,
      density: p.density,
      programType: p.programType,
    }),
  setField: (key, value) => set({ [key]: value } as Partial<AssessmentState>),
  setScenario: (id) => set({ scenarioId: id }),
}));
