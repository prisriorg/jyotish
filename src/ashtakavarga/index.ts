import { Kundli } from "../kundli/types";
import {
  PLANET_NAMES,
  REFERENCE_POINTS,
  AshtakavargaPlanet,
  ReferencePoint,
} from "./constants";
import { calculateAllBAV, PlanetBAV } from "./bav";
import { calculateSAV, SAVResult } from "./sav";

export * from "./constants";
export * from "./bav";
export * from "./sav";
export * from "./kakshya";

export interface AshtakavargaResult {
  bav: Record<AshtakavargaPlanet, PlanetBAV>;
  sav: SAVResult;
}

/**
 * Calculates complete Ashtakavarga (BAV for 7 planets and combined SAV) for a given Kundli.
 *
 * @param kundli The Janam Kundli object
 * @returns AshtakavargaResult containing BAV for each planet and SAV
 */
export function getAshtakavarga(kundli: Kundli): AshtakavargaResult {
  const lagnaRashi = kundli.ascendant.rashi - 1; // 0-indexed (0=Aries, ..., 11=Pisces)

  // Map 7 planets and Ascendant to their rashi indices (0-11)
  const rashiPositions: Record<ReferencePoint, number> = {
    Sun: kundli.planets.Sun ? kundli.planets.Sun.rashi - 1 : 0,
    Moon: kundli.planets.Moon ? kundli.planets.Moon.rashi - 1 : 0,
    Mars: kundli.planets.Mars ? kundli.planets.Mars.rashi - 1 : 0,
    Mercury: kundli.planets.Mercury ? kundli.planets.Mercury.rashi - 1 : 0,
    Jupiter: kundli.planets.Jupiter ? kundli.planets.Jupiter.rashi - 1 : 0,
    Venus: kundli.planets.Venus ? kundli.planets.Venus.rashi - 1 : 0,
    Saturn: kundli.planets.Saturn ? kundli.planets.Saturn.rashi - 1 : 0,
    Ascendant: lagnaRashi,
  };

  const bav = calculateAllBAV(rashiPositions, lagnaRashi);
  const sav = calculateSAV(bav, lagnaRashi);

  return {
    bav,
    sav,
  };
}
