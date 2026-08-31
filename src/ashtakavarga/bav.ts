import {
  CONTRIBUTIONS,
  PLANET_NAMES,
  PLANET_TOTALS,
  REFERENCE_POINTS,
  AshtakavargaPlanet,
  ReferencePoint,
} from "./constants";

export interface PlanetBAV {
  planet: AshtakavargaPlanet;
  totalBindus: number;
  byRashi: number[]; // 12 signs: 0 = Aries, ..., 11 = Pisces
  byHouse: number[]; // 12 houses from Lagna: 0 = 1st, ..., 11 = 12th
  contributionsByRef: Record<ReferencePoint, number[]>; // Which signs received 1 from each ref point
}

/**
 * Calculates BAV (Bhinnashtakavarga) for a single planet.
 *
 * @param planet Planet name (Sun, Moon, Mars, etc.)
 * @param rashiPositions Rashi indices (0-11) for all 7 planets and Ascendant
 * @param lagnaRashi Rashi index (0-11) of Lagna
 */
export function calculateBAV(
  planet: AshtakavargaPlanet,
  rashiPositions: Record<ReferencePoint, number>,
  lagnaRashi: number,
): PlanetBAV {
  const byRashi = new Array(12).fill(0);
  const contributions = CONTRIBUTIONS[planet];
  const contributionsByRef: Record<ReferencePoint, number[]> = {} as any;

  for (const refPoint of REFERENCE_POINTS) {
    contributionsByRef[refPoint] = new Array(12).fill(0);
    const refRashi = rashiPositions[refPoint];
    if (refRashi === undefined) continue;

    const housesList = contributions[refPoint] || [];
    for (const offset of housesList) {
      // offset is 1-based (e.g. 1 = same sign, 2 = next sign)
      const targetRashi = (refRashi + (offset - 1)) % 12;
      byRashi[targetRashi]++;
      contributionsByRef[refPoint][targetRashi] = 1;
    }
  }

  // Calculate byHouse relative to Lagna (0 = Lagna Rashi, 1 = 2nd from Lagna, ...)
  const byHouse = new Array(12).fill(0);
  for (let h = 0; h < 12; h++) {
    const targetRashi = (lagnaRashi + h) % 12;
    byHouse[h] = byRashi[targetRashi];
  }

  const totalBindus = byRashi.reduce((sum, b) => sum + b, 0);

  return {
    planet,
    totalBindus,
    byRashi,
    byHouse,
    contributionsByRef,
  };
}

/**
 * Calculates BAV for all 7 classical planets.
 */
export function calculateAllBAV(
  rashiPositions: Record<ReferencePoint, number>,
  lagnaRashi: number,
): Record<AshtakavargaPlanet, PlanetBAV> {
  const bavCharts: Partial<Record<AshtakavargaPlanet, PlanetBAV>> = {};

  for (const planet of PLANET_NAMES) {
    bavCharts[planet] = calculateBAV(planet, rashiPositions, lagnaRashi);
  }

  return bavCharts as Record<AshtakavargaPlanet, PlanetBAV>;
}
