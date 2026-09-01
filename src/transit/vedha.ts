import { VEDHA_PAIRS, VEDHA_EXEMPTIONS } from "./constants";

export interface VedhaCheckResult {
  hasVedha: boolean;
  vedhaCausedBy?: string; // e.g. "Mars transiting in 12th house (Vedha for Sun in 6th)"
  vedhaHouse?: number;
}

/**
 * Checks if a planet transiting an auspicious house from Janma Rashi (Natal Moon)
 * suffers from Vedha (obstruction) due to another transiting planet.
 *
 * @param planet Planet being checked (e.g. "Jupiter", "Sun")
 * @param houseFromMoon House number (1-12) the planet is currently transiting from Janma Rashi
 * @param allTransitHousesFromMoon Record mapping planet names to their transit house from Janma Rashi (1-12)
 */
export function checkVedha(
  planet: string,
  houseFromMoon: number,
  allTransitHousesFromMoon: Record<string, number>
): VedhaCheckResult {
  const planetVedhaMap = VEDHA_PAIRS[planet];
  if (!planetVedhaMap) {
    return { hasVedha: false };
  }

  const expectedVedhaHouse = planetVedhaMap[houseFromMoon];
  if (!expectedVedhaHouse) {
    // This house does not have a Vedha pair or is not an auspicious transit house
    return { hasVedha: false };
  }

  // Look for any transiting planet occupying the expectedVedhaHouse
  for (const [otherPlanet, otherHouse] of Object.entries(allTransitHousesFromMoon)) {
    if (otherPlanet === planet) continue; // Planet does not obstruct itself

    if (otherHouse === expectedVedhaHouse) {
      // Check Shastric exemptions
      const isExempt = VEDHA_EXEMPTIONS.some(
        (ex) =>
          (ex.planetA === planet && ex.planetB === otherPlanet) ||
          (ex.planetB === planet && ex.planetA === otherPlanet)
      );

      if (!isExempt) {
        return {
          hasVedha: true,
          vedhaHouse: expectedVedhaHouse,
          vedhaCausedBy: `${otherPlanet} transiting in House ${expectedVedhaHouse} (causes Vedha to ${planet} in House ${houseFromMoon})`,
        };
      }
    }
  }

  return { hasVedha: false };
}
