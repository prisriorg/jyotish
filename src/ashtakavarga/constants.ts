/**
 * Ashtakavarga Constants
 * Classical Brihat Parashara Hora Shastra (BPHS) Bindu Tables
 */

export const PLANET_NAMES = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
] as const;

export type AshtakavargaPlanet = (typeof PLANET_NAMES)[number];

export const REFERENCE_POINTS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
  "Ascendant",
] as const;

export type ReferencePoint = (typeof REFERENCE_POINTS)[number];

// BAV contribution tables (houses 1-12 counted from each reference point)
export const CONTRIBUTIONS: Record<
  AshtakavargaPlanet,
  Record<ReferencePoint, number[]>
> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11],
    Moon: [3, 6, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12],
    Jupiter: [5, 6, 9, 11],
    Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Moon: [1, 3, 6, 7, 10, 11],
    Sun: [3, 6, 7, 8, 10, 11],
    Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11],
    Jupiter: [1, 4, 7, 8, 10, 11, 12],
    Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11],
    Ascendant: [3, 6, 10, 11],
  },
  Mars: {
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Sun: [3, 5, 6, 10, 11],
    Moon: [3, 6, 11],
    Mercury: [3, 5, 6, 11],
    Jupiter: [6, 10, 11, 12],
    Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 10, 11, 12],
    Ascendant: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12],
    Sun: [5, 6, 9, 11, 12],
    Moon: [2, 4, 6, 8, 10, 11],
    Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Jupiter: [6, 8, 11, 12],
    Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11],
    Ascendant: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Jupiter: [1, 2, 3, 4, 7, 8, 10, 11],
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11],
    Moon: [2, 5, 7, 9, 11],
    Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11],
    Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12],
    Ascendant: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Sun: [8, 11, 12],
    Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12],
    Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11],
    Jupiter: [5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11],
    Ascendant: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Saturn: [3, 5, 6, 11],
    Sun: [1, 2, 4, 7, 8, 10, 11],
    Moon: [3, 6, 11],
    Mars: [3, 5, 6, 10, 11],
    Mercury: [6, 8, 9, 10, 11, 12],
    Jupiter: [3, 5, 6, 11, 12],
    Venus: [6, 11, 12],
    Ascendant: [1, 3, 4, 6, 10, 11],
  },
};

// Expected total bindus per planet (sum across 12 signs = constant)
export const PLANET_TOTALS: Record<AshtakavargaPlanet, number> = {
  Sun: 48,
  Moon: 49,
  Mars: 39,
  Mercury: 54,
  Jupiter: 56,
  Venus: 52,
  Saturn: 39,
};

// Total bindus across all 7 planets = 337
export const TOTAL_BINDUS = 337;

// Kakshya division constants (each sign = 30° / 8 kakshyas = 3.75°)
export const KAKSHYA_SIZE = 3.75;
export const NUM_KAKSHYAS = 8;

export const KAKSHYA_RULERS = [
  "Saturn",
  "Jupiter",
  "Mars",
  "Sun",
  "Venus",
  "Mercury",
  "Moon",
  "Ascendant",
] as const;
