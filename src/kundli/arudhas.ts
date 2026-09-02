import { rashiNames } from "../core/constants";
import { RASHI_LORDS } from "../matching/constants";
import { Kundli, VargaChart, ArudhaPadaInfo, ArudhaPadasResult } from "./types";
import { createRashiCentricChart } from "./reference-charts";

const ARUDHA_NAMES: Record<number, { code: string; name: string }> = {
  1: { code: "A1", name: "Arudha Lagna (AL) - Public Persona & Worldly Status" },
  2: { code: "A2", name: "Dhana Pada (A2) - Wealth Assets & Material Resources" },
  3: { code: "A3", name: "Bhratri Pada (A3) - Siblings, Courage & Enterprise" },
  4: { code: "A4", name: "Matri Pada (A4) - Domestic Peace, Vehicles & Properties" },
  5: { code: "A5", name: "Putra Pada (A5) - Progeny, Creative Intellect & Mentorship" },
  6: { code: "A6", name: "Shatru Pada (A6) - Competitors, Debts & Litigations" },
  7: { code: "A7", name: "Dara Pada (A7) - Business Alliances & Social Partners" },
  8: { code: "A8", name: "Mrityu Pada (A8) - Longevity, Transformations & Hidden Vulnerabilities" },
  9: { code: "A9", name: "Bhagya Pada (A9) - Destiny, Mentors & Higher Knowledge" },
  10: { code: "A10", name: "Rajya Pada (A10) - High Executive Status & Professional Authority" },
  11: { code: "A11", name: "Labha Pada (A11) - Cash Inflows & Fulfilled Aspirations" },
  12: { code: "A12", name: "Upapada Lagna (UL) - Marriage, Spouse Heritage & Marital Concord" },
};

/**
 * Calculates Jaimini Arudha Padas (A1 to A12) for all 12 houses according to
 * Maharishi Parashara and Sage Jaimini rules, incorporating standard 1st/7th house exceptions.
 *
 * @param kundli Complete Janam Kundli
 */
export function getArudhaPadas(kundli: Kundli): ArudhaPadasResult {
  const planets = kundli.planets || {};
  const lagnaRashi0Based = (kundli.ascendant.rashi - 1) % 12;

  // Helper to find planet sign (0-11)
  const getPlanetSign0Based = (planetName: string): number => {
    const p = planets[planetName];
    if (p) {
      if (typeof p.rashi === "number") return (p.rashi - 1) % 12;
      return Math.floor((((p.longitude % 360) + 360) % 360) / 30);
    }
    return 0;
  };

  const padas: ArudhaPadaInfo[] = [];

  for (let h = 1; h <= 12; h++) {
    // Sign of house h (0-based)
    const houseSign0Based = (lagnaRashi0Based + (h - 1)) % 12;

    // Lord of the house
    const lord = RASHI_LORDS[houseSign0Based];
    const lordSign0Based = getPlanetSign0Based(lord);

    // Distance D from house to lord (1-12)
    const dist = ((lordSign0Based - houseSign0Based + 12) % 12) + 1;

    // Projected sign: D signs forward from lord
    let padaSign0Based = (lordSign0Based + (dist - 1)) % 12;

    // Parashara / Jaimini Exception:
    // If the pada falls in the 1st or 7th house from the house itself:
    // Pada cannot be in 1st or 7th from house. If so, add 10 houses (9 signs forward).
    const relFromHouse = ((padaSign0Based - houseSign0Based + 12) % 12) + 1;
    if (relFromHouse === 1 || relFromHouse === 7) {
      padaSign0Based = (padaSign0Based + 9) % 12;
    }

    const padaRashi1Based = padaSign0Based + 1;
    const meta = ARUDHA_NAMES[h];

    padas.push({
      pada: h,
      code: meta.code,
      name: meta.name,
      rashi: padaRashi1Based,
      rashiName: rashiNames[padaSign0Based],
      houseNumber: h,
      lord,
    });
  }

  return {
    a1_al: padas[0],
    a2: padas[1],
    a3: padas[2],
    a4: padas[3],
    a5: padas[4],
    a6: padas[5],
    a7: padas[6],
    a8: padas[7],
    a9: padas[8],
    a10: padas[9],
    a11: padas[10],
    a12_ul: padas[11],
    all: padas,
  };
}

/**
 * Generates the Arudha Lagna (AL / Pada Lagna) Chart.
 * In Jaimini astrology, the AL chart depicts the native's external status, social reputation,
 * and how society views them in the material world.
 *
 * @param kundli Complete Janam Kundli
 */
export function getArudhaLagnaChart(kundli: Kundli): VargaChart {
  const padas = kundli.arudhaPadas || getArudhaPadas(kundli);
  return createRashiCentricChart(padas.a1_al.rashi, kundli.planets);
}

/**
 * Generates the Upapada Lagna (UL / A12) Chart.
 * In Jaimini astrology, the UL chart is the fundamental chart for predicting marriage,
 * marital longevity, spouse's background, and in-laws relations.
 *
 * @param kundli Complete Janam Kundli
 */
export function getUpapadaChart(kundli: Kundli): VargaChart {
  const padas = kundli.arudhaPadas || getArudhaPadas(kundli);
  return createRashiCentricChart(padas.a12_ul.rashi, kundli.planets);
}
