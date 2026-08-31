import { TOTAL_BINDUS, PLANET_NAMES, AshtakavargaPlanet } from "./constants";
import { PlanetBAV } from "./bav";

export interface HouseStrength {
  house: number; // 1-12 from Lagna
  rashi: number; // 1-12 sign (1=Aries, ..., 12=Pisces)
  bindus: number;
  strength: "Exceptional" | "Very Strong" | "Strong" | "Average" | "Weak";
  category: "beneficial" | "neutral" | "challenging";
}

export interface SAVResult {
  totalBindus: number;
  byRashi: number[]; // 12 signs: 0 = Aries, ..., 11 = Pisces
  byHouse: number[]; // 12 houses from Lagna: 0 = 1st, ..., 11 = 12th
  houseStrengths: HouseStrength[];
  strongestHouse: number; // 1-12
  weakestHouse: number; // 1-12
  averageBindus: number; // ~28.08
}

/**
 * Interprets bindu strength according to classical rules:
 * >= 31: Exceptional
 * 28 - 30: Strong / Very Strong
 * 25 - 27: Average
 * < 25: Weak
 */
export function interpretStrength(bindus: number): {
  strength: "Exceptional" | "Very Strong" | "Strong" | "Average" | "Weak";
  category: "beneficial" | "neutral" | "challenging";
} {
  if (bindus >= 32) return { strength: "Exceptional", category: "beneficial" };
  if (bindus >= 28) return { strength: "Strong", category: "beneficial" };
  if (bindus >= 25) return { strength: "Average", category: "neutral" };
  return { strength: "Weak", category: "challenging" };
}

/**
 * Calculates Sarvashtakavarga (SAV) from BAV charts.
 */
export function calculateSAV(
  bavCharts: Record<AshtakavargaPlanet, PlanetBAV>,
  lagnaRashi: number,
): SAVResult {
  const byRashi = new Array(12).fill(0);
  const byHouse = new Array(12).fill(0);

  for (const planet of PLANET_NAMES) {
    const bav = bavCharts[planet];
    for (let r = 0; r < 12; r++) {
      byRashi[r] += bav.byRashi[r];
    }
  }

  for (let h = 0; h < 12; h++) {
    const targetRashi = (lagnaRashi + h) % 12;
    byHouse[h] = byRashi[targetRashi];
  }

  const houseStrengths: HouseStrength[] = byHouse.map((bindus, idx) => {
    const { strength, category } = interpretStrength(bindus);
    const targetRashi = ((lagnaRashi + idx) % 12) + 1;
    return {
      house: idx + 1,
      rashi: targetRashi,
      bindus,
      strength,
      category,
    };
  });

  const maxBindus = Math.max(...byHouse);
  const minBindus = Math.min(...byHouse);
  const strongestHouse = byHouse.indexOf(maxBindus) + 1;
  const weakestHouse = byHouse.indexOf(minBindus) + 1;
  const totalBindus = byRashi.reduce((sum, b) => sum + b, 0);

  return {
    totalBindus,
    byRashi,
    byHouse,
    houseStrengths,
    strongestHouse,
    weakestHouse,
    averageBindus: parseFloat((totalBindus / 12).toFixed(2)),
  };
}
