import { rashiNames } from "../core/constants";
import { Kundli, VargaChart, Bhava } from "./types";
import { getHouses } from "./houses";

/**
 * Creates a reference chart where a specific Rashi (1-12) is treated as House 1 (Ascendant).
 * Used for Chandra Kundli (Moon Chart), Surya Kundli (Sun Chart), etc.
 *
 * @param centerRashi1Based Rashi index (1 = Aries, 12 = Pisces) to place in House 1
 * @param planets Planetary records from Kundli
 */
export function createRashiCentricChart(
  centerRashi1Based: number,
  planets: Record<string, { longitude: number; rashi?: number; rashiName?: string }>,
): VargaChart {
  const centerSign0Based = ((centerRashi1Based - 1) % 12 + 12) % 12;
  const centerDegree = centerSign0Based * 30 + 15;
  const houses = getHouses(centerDegree, "whole_sign");

  const chartPlanets: Record<string, { rashi: number; rashiName: string }> = {};

  for (const [name, pData] of Object.entries(planets)) {
    const rashi0Based = Math.floor(((pData.longitude % 360) + 360) % 360 / 30);
    const rashi1Based = rashi0Based + 1;
    chartPlanets[name] = {
      rashi: rashi1Based,
      rashiName: rashiNames[rashi0Based],
    };

    const house = houses.find((h: Bhava) => h.rashi === rashi1Based);
    if (house) {
      house.planets.push(name);
    }
  }

  return {
    ascendant: {
      rashi: centerSign0Based + 1,
      rashiName: rashiNames[centerSign0Based],
    },
    planets: chartPlanets,
    houses,
  };
}

/**
 * Generates Chandra Kundli (Moon Chart) where the Moon's natal sign is taken as the 1st House.
 * In Vedic astrology, Chandra Kundli reveals the psychological temperament, emotional foundation,
 * and is the primary reference chart for transit (Gochar) predictions.
 *
 * @param kundli Complete Janam Kundli
 */
export function getChandraKundli(kundli: Kundli): VargaChart {
  const moon = kundli.planets["Moon"];
  if (!moon) {
    throw new Error("Moon position not found in Kundli to generate Chandra Kundli.");
  }

  const moonRashi1Based = moon.rashi || Math.floor((((moon.longitude % 360) + 360) % 360) / 30) + 1;
  return createRashiCentricChart(moonRashi1Based, kundli.planets);
}

/**
 * Generates Surya Kundli (Sun Chart) where the Sun's natal sign is taken as the 1st House.
 * In Vedic astrology, Surya Kundli represents the soul's vitality, professional authority,
 * public recognition, and fatherly/governmental karma.
 *
 * @param kundli Complete Janam Kundli
 */
export function getSuryaKundli(kundli: Kundli): VargaChart {
  const sun = kundli.planets["Sun"];
  if (!sun) {
    throw new Error("Sun position not found in Kundli to generate Surya Kundli.");
  }

  const sunRashi1Based = sun.rashi || Math.floor((((sun.longitude % 360) + 360) % 360) / 30) + 1;
  return createRashiCentricChart(sunRashi1Based, kundli.planets);
}
