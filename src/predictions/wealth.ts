import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { WealthPrediction } from "./types";

export function getWealthPrediction(kundli: Kundli): WealthPrediction {
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;

  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const house12 = houses.find((h) => h.number === 12) || houses[11];

  const bindus11 = sav ? sav.byHouse[10] : 28;
  const bindus12 = sav ? sav.byHouse[11] : 28;
  const bindus2 = sav ? sav.byHouse[1] : 28;
  const surplusRatio = bindus11 - bindus12;

  // Dhana Yogas Detection
  const dhanaYogas: WealthPrediction["dhanaYogas"] = [];

  // 1. Ashtakavarga Mahadhan Yoga
  if (surplusRatio >= 5 && bindus11 >= 32) {
    dhanaYogas.push({
      name: "Ashtakavarga Mahadhan Yoga",
      description: `11th House of Gains (${bindus11} bindus) significantly exceeds 12th House of Expenses (${bindus12} bindus). Unstoppable net wealth accumulation.`,
      strength: "Powerful",
    });
  } else if (surplusRatio > 0) {
    dhanaYogas.push({
      name: "Ashtakavarga Dhana Yoga",
      description: `Gains (${bindus11}) exceed Expenditures (${bindus12}), ensuring positive financial growth over time.`,
      strength: "Moderate",
    });
  }

  // 2. Exalted planet in wealth house
  if (house2?.planets) {
    for (const pName of house2.planets) {
      if (planets[pName]?.dignity === "exalted") {
        dhanaYogas.push({
          name: `Uccha ${pName} Dhana Yoga`,
          description: `Exalted ${pName} in 2nd House (Dhana Bhava) brings tremendous capacity for accumulating luxury, wealth, and liquid assets.`,
          strength: "Powerful",
        });
      }
    }
  }

  // 3. Gaja Kesari Yoga
  if (planets.Jupiter && planets.Moon) {
    const jupRashi = planets.Jupiter.rashi;
    const moonRashi = planets.Moon.rashi;
    const distFromMoon = ((jupRashi - moonRashi + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(distFromMoon)) {
      dhanaYogas.push({
        name: "Gaja Kesari Yoga",
        description: "Jupiter in Kendra from Moon grants continuous prosperity, respected social status, and enduring wealth.",
        strength: "Powerful",
      });
    }
  }

  // 4. Chandra-Mangala Yoga
  if (planets.Moon && planets.Mars) {
    const moonRashi = planets.Moon.rashi;
    const marsRashi = planets.Mars.rashi;
    const diff = Math.abs(moonRashi - marsRashi);
    if (diff === 0 || diff === 6) {
      dhanaYogas.push({
        name: "Chandra-Mangala Yoga",
        description: "Mutual association of Moon and Mars creates sharp financial acumen, wealth through real estate, trade, and enterprise.",
        strength: "Powerful",
      });
    }
  }

  // 5. Lord of 11th in Kendra or Trikona
  const rashi11Idx = (house11.rashi - 1 + 12) % 12;
  const lord11 = RASHI_LORDS[rashi11Idx];
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };
  const lord11House = getPlanetHouse(lord11);
  if ([1, 4, 7, 10, 5, 9, 11].includes(lord11House)) {
    dhanaYogas.push({
      name: "Kendra-Trikona Labha Yoga",
      description: `11th Lord (${lord11}) placed favorably in House ${lord11House}, ensuring sustained revenues and commercial rewards.`,
      strength: "Moderate",
    });
  }

  // Calculate Income Potential (0 - 100)
  let incomePotential = 50;
  if (bindus11 >= 35) incomePotential += 30;
  else if (bindus11 >= 30) incomePotential += 20;
  else if (bindus11 >= 28) incomePotential += 10;
  else incomePotential -= 10;

  if (surplusRatio >= 5) incomePotential += 15;
  if (dhanaYogas.some((y) => y.strength === "Powerful")) incomePotential += 10;
  incomePotential = Math.max(20, Math.min(99, incomePotential));

  // Determine Wealth Rating
  let wealthRating: WealthPrediction["wealthRating"] = "Moderate";
  if (incomePotential >= 85) wealthRating = "Exceptional";
  else if (incomePotential >= 70) wealthRating = "High";
  else if (surplusRatio < 0) wealthRating = "Fluctuating";

  // Saving Capacity
  let savingCapacity: WealthPrediction["savingCapacity"] = "Average";
  if (surplusRatio >= 4 && bindus2 >= 25) {
    savingCapacity = "Strong";
  } else if (surplusRatio < 0) {
    savingCapacity = "Challenging";
  }

  // Best Wealth Sources
  const bestWealthSources: string[] = [
    "Digital assets, software platforms, and proprietary technology products",
    "Professional consulting and specialized technical services",
    "Equity investments, long-term capital compounding, and strategic networking",
  ];
  if (house2?.planets.includes("Venus")) {
    bestWealthSources.push("High-value creative assets, design, premium media, or luxury goods");
  }

  // Financial Cautions
  const financialCautions: string[] = [];
  if (surplusRatio >= 5) {
    financialCautions.push("High earning potential can cause lifestyle inflation; automate investments into compounding assets early.");
  }
  if (bindus2 < 26) {
    financialCautions.push("Liquid savings can fluctuate; avoid lending substantial funds without formal collateral.");
  }
  financialCautions.push("Avoid impulsive speculative bets during unfavorable dasha sub-periods.");

  return {
    wealthRating,
    incomePotential,
    savingCapacity,
    savMetrics: {
      incomeHouse11Bindus: bindus11,
      expenditureHouse12Bindus: bindus12,
      wealthHouse2Bindus: bindus2,
      surplusRatio,
    },
    dhanaYogas,
    bestWealthSources,
    financialCautions,
  };
}
