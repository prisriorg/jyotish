import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { WealthPrediction } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";

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

  // 6. Budhaditya Yoga
  if (planets.Sun && planets.Mercury && planets.Sun.rashi === planets.Mercury.rashi) {
    dhanaYogas.push({
      name: "Budhaditya Yoga",
      description: "Conjunction of Sun and Mercury confers high commercial intellect, administrative clarity, and strategic financial foresight.",
      strength: "Moderate",
    });
  }

  // 7. Vipreet Raj Yogas (Harsha, Sarala, Vimala)
  const vipreetRajYogas: string[] = [];
  const house6 = houses.find((h) => h.number === 6) || houses[5];
  const house8 = houses.find((h) => h.number === 8) || houses[7];
  const lord6 = RASHI_LORDS[(house6.rashi - 1 + 12) % 12];
  const lord8 = RASHI_LORDS[(house8.rashi - 1 + 12) % 12];
  const lord12 = RASHI_LORDS[(house12.rashi - 1 + 12) % 12];

  const lord6House = getPlanetHouse(lord6);
  const lord8House = getPlanetHouse(lord8);
  const lord12House = getPlanetHouse(lord12);

  const dusthanas = [6, 8, 12];
  if (dusthanas.includes(lord6House)) {
    vipreetRajYogas.push(`Harsha Vipreet Raj Yoga (6th Lord ${lord6} in House ${lord6House}): Bestows unshakeable immunity to financial crises, victory over rivals, and ability to thrive under pressure.`);
  }
  if (dusthanas.includes(lord8House)) {
    vipreetRajYogas.push(`Sarala Vipreet Raj Yoga (8th Lord ${lord8} in House ${lord8House}): Grants sudden financial breakthroughs, fearlessness in adversity, and immense transformative wealth.`);
  }
  if (dusthanas.includes(lord12House)) {
    vipreetRajYogas.push(`Vimala Vipreet Raj Yoga (12th Lord ${lord12} in House ${lord12House}): Ensures independent financial prosperity, noble character, and immunity against heavy losses.`);
  }

  // Classical 2nd Lord Placement Dictionary (Dhansthan)
  const rashi2Idx = (house2.rashi - 1 + 12) % 12;
  const lord2 = RASHI_LORDS[rashi2Idx];
  const lord2House = getPlanetHouse(lord2);

  const secondLordDictionary: Record<number, string> = {
    1: `2nd Lord (${lord2}) in 1st House: Wealth comes through personal reputation, leadership initiative, and self-built enterprise. Strong monetary identity.`,
    2: `2nd Lord (${lord2}) in 2nd House: Swa-Kshetra treasury. High capacity for compounding assets, noble speech, luxury inheritance, and liquid savings.`,
    3: `2nd Lord (${lord2}) in 3rd House: Wealth generated through media, communications, technology, bold self-efforts, and entrepreneurial ventures.`,
    4: `2nd Lord (${lord2}) in 4th House: Accumulation of prime real estate, agricultural/land assets, luxury vehicles, and parental blessings.`,
    5: `2nd Lord (${lord2}) in 5th House: High intelligence yields financial dividends. Gains through strategic investments, trading, intellectual property, and royal patronage.`,
    6: `2nd Lord (${lord2}) in 6th House: Financial growth through professional service, litigation success, healthcare/banking, or overcoming commercial debts.`,
    7: `2nd Lord (${lord2}) in 7th House: Substantial wealth unlocked post-marriage and through client-facing trade, partnerships, and foreign commerce.`,
    8: `2nd Lord (${lord2}) in 8th House: Secret assets, sudden windfalls, inheritance, deep research monetization, insurance, and high-stakes financial turnarounds.`,
    9: `2nd Lord (${lord2}) in 9th House: Divine Lakshmi Yoga. Wealth flows through high ethics, global enterprise, higher learning, and mentor guidance.`,
    10: `2nd Lord (${lord2}) in 10th House: High executive revenue, corporate leadership prestige, government contracts, and pinnacle social authority.`,
    11: `2nd Lord (${lord2}) in 11th House: Supreme Dhana Yoga. Multiple continuous income streams, exponential networking returns, and compounding wealth.`,
    12: `2nd Lord (${lord2}) in 12th House: Earning through overseas institutions, export/import, remote MNC operations, and generous philanthropic nature.`,
  };
  const secondLordPlacementResult = secondLordDictionary[lord2House] || secondLordDictionary[2];

  // Classical 11th Lord Placement Dictionary (Labhasthan)
  const eleventhLordDictionary: Record<number, string> = {
    1: `11th Lord (${lord11}) in 1st House: Born with innate magnetism for profits. Desires materialize rapidly through personal authority and focus.`,
    2: `11th Lord (${lord11}) in 2nd House: Direct wealth multiplier. Every earning stream converts directly into solid bank savings and tangible capital.`,
    3: `11th Lord (${lord11}) in 3rd House: Scalable income through technology platforms, digital networks, bold enterprise, and media outreach.`,
    4: `11th Lord (${lord11}) in 4th House: Commercial gains from properties, infrastructure, educational institutions, and homeland ventures.`,
    5: `11th Lord (${lord11}) in 5th House: High gains from intellectual assets, strategic portfolio investing, and creative monetization.`,
    6: `11th Lord (${lord11}) in 6th House: Monetization through competitive contracts, problem resolution, financial arbitration, and service delivery.`,
    7: `11th Lord (${lord11}) in 7th House: Lucrative commercial partnerships, high-value clientele, foreign market expansion, and prosperous spouse.`,
    8: `11th Lord (${lord11}) in 8th House: Gains through confidential projects, research royalties, R&D breakthroughs, and unexpected opportunities.`,
    9: `11th Lord (${lord11}) in 9th House: Fortune smiles on big-picture expansion. Global revenues, consulting retainers, and institutional support.`,
    10: `11th Lord (${lord11}) in 10th House: Industry prestige turns into massive revenue. Executive status with high equity and institutional ownership.`,
    11: `11th Lord (${lord11}) in 11th House: Swa-Kshetra Labha. Unstoppable cashflow, massive community networks, and limitless commercial upside.`,
    12: `11th Lord (${lord11}) in 12th House: International earnings, global remote consulting, overseas clients, and high expenditure balanced by foreign inflows.`,
  };
  const eleventhLordPlacementResult = eleventhLordDictionary[lord11House] || eleventhLordDictionary[11];

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

  const chalit = getChalitAnalysis(kundli);
  const kp = getKpAnalysis(kundli);
  const lalKitab = getLalKitabAnalysis(kundli);

  const chalitInsight = `Chalit Bhava 2 has ${chalit.actualHouseOccupants[2]?.length ? chalit.actualHouseOccupants[2].join(", ") : "clear status"}, stabilizing asset compounding. Chalit Bhava 11 supports scalable gains.`;
  const kpInsight = kp.wealthCusps.financialSignification;
  const lalKitabInsight = `Lal Kitab: Teva is ${lalKitab.tevaType}. Kismat Ka Grah ${lalKitab.kismatKaGrah.planet} in House ${lalKitab.kismatKaGrah.house} activates prosperity and treasury stability.`;

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
    vipreetRajYogas,
    secondLordPlacementResult,
    eleventhLordPlacementResult,
    bestWealthSources,
    financialCautions,
    chalitInsight,
    kpInsight,
    lalKitabInsight,
  };
}
