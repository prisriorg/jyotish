import { Body, Observer } from "astronomy-engine";
import { Kundli } from "../kundli/types";
import { getAyanamsa } from "../core/ayanamsa";
import {
  getPlanetaryPosition,
  getRahuPosition,
  getKetuPosition,
} from "../core/calculations";
import { rashiNames } from "../core/constants";
import { checkSadeSati, checkDhaiya } from "../core/sadesati";
import { getChandrashtama } from "../core/chandrashtama";
import {
  FAVORABLE_GOCHAR_HOUSES,
  PLANET_GOCHAR_PHALA,
} from "./constants";
import { checkVedha } from "./vedha";
import {
  GocharAnalysisResult,
  TransitPlanetInfo,
  GocharSpecialTransits,
  LifeAreaGocharImpact,
  GocharBeneficStatus,
} from "./types";

const TRANSIT_BODIES: Array<{ name: string; body: Body }> = [
  { name: "Sun", body: Body.Sun },
  { name: "Moon", body: Body.Moon },
  { name: "Mars", body: Body.Mars },
  { name: "Mercury", body: Body.Mercury },
  { name: "Jupiter", body: Body.Jupiter },
  { name: "Venus", body: Body.Venus },
  { name: "Saturn", body: Body.Saturn },
];

/**
 * Calculates current sidereal positions for 9 Vedic planets on a given date.
 */
export function getTransitPositions(
  date: Date,
  observer?: Observer,
  ayanamsaType: "lahiri" | "raman" | "kp" = "lahiri"
): Record<string, any> {
  const ayanamsa = getAyanamsa(date, ayanamsaType);
  const positions: Record<string, any> = {};

  for (const { name, body } of TRANSIT_BODIES) {
    positions[name] = getPlanetaryPosition(body, date, ayanamsa);
  }

  const rahu = getRahuPosition(date, ayanamsa);
  const ketu = getKetuPosition(rahu);
  positions["Rahu"] = rahu;
  positions["Ketu"] = ketu;

  return positions;
}

/**
 * Performs a comprehensive Vedic Gochar (Transit) analysis for a given Kundli.
 * Evaluates transits from both Janma Rashi (Natal Moon) and Natal Lagna,
 * verifies classical Vedha obstruction, integrates Sade Sati / Dhaiya / Chandrashtama,
 * and calculates life-area impacts with an overall Gochar score.
 *
 * @param kundli The native's Janam Kundli
 * @param transitDate The date of transit to inspect (defaults to current time)
 * @param observer Optional observer location (defaults to Varanasi, India)
 */
export function getGocharAnalysis(
  kundli: Kundli,
  transitDate: Date = new Date(),
  observer?: Observer
): GocharAnalysisResult {
  const obs =
    observer ||
    (kundli.birthDetails
      ? new Observer(kundli.birthDetails.lat, kundli.birthDetails.lon, 0)
      : new Observer(25.3176, 82.9739, 0));

  // 1. Determine Natal Moon and Lagna Rashis (1-indexed, 1=Aries ... 12=Pisces)
  const natalMoonRashi = kundli.planets.Moon?.rashi || 1;
  const natalMoonRashiName = kundli.planets.Moon?.rashiName || rashiNames[natalMoonRashi - 1];
  const natalMoonLon = kundli.planets.Moon?.longitude || (natalMoonRashi - 1) * 30;

  const natalLagnaRashi = kundli.ascendant?.rashi || 1;
  const natalLagnaRashiName = kundli.ascendant?.rashiName || rashiNames[natalLagnaRashi - 1];

  // 2. Fetch Transit Planetary Positions
  const transitPositions = getTransitPositions(transitDate, obs);

  // 3. Compute Houses from Janma Rashi for all 9 planets
  const planetNames = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
  const allTransitHousesFromMoon: Record<string, number> = {};

  for (const pName of planetNames) {
    const pPos = transitPositions[pName];
    if (pPos) {
      const transitRashi = pPos.rashi; // 1-12
      const houseFromMoon = ((transitRashi - natalMoonRashi + 12) % 12) + 1;
      allTransitHousesFromMoon[pName] = houseFromMoon;
    }
  }

  // 4. Build Detailed Transit Planet Information (Gochar Phala & Vedha)
  const planetsInfo: Record<string, TransitPlanetInfo> = {};
  let favorableCount = 0;

  for (const pName of planetNames) {
    const pPos = transitPositions[pName];
    const houseFromMoon = allTransitHousesFromMoon[pName] || 1;
    const houseFromLagna = ((pPos.rashi - natalLagnaRashi + 12) % 12) + 1;

    const favorableHouses = FAVORABLE_GOCHAR_HOUSES[pName] || [];
    const isFavorableFromMoon = favorableHouses.includes(houseFromMoon);

    let hasVedha = false;
    let vedhaCausedBy: string | undefined;

    if (isFavorableFromMoon) {
      const vedhaCheck = checkVedha(pName, houseFromMoon, allTransitHousesFromMoon);
      hasVedha = vedhaCheck.hasVedha;
      vedhaCausedBy = vedhaCheck.vedhaCausedBy;
    }

    let netStatus: GocharBeneficStatus = "Unfavorable";
    if (isFavorableFromMoon) {
      if (hasVedha) {
        netStatus = "Obstructed";
      } else {
        netStatus = "Favorable";
        favorableCount++;
      }
    }

    // Classical prediction text
    const phalaRecord = PLANET_GOCHAR_PHALA[pName]?.[houseFromMoon];
    let prediction = phalaRecord
      ? phalaRecord.description
      : `Transit of ${pName} in House ${houseFromMoon} from Moon.`;

    if (hasVedha && vedhaCausedBy) {
      prediction += ` (⚠️ Auspicious result obstructed: ${vedhaCausedBy})`;
    }

    // Ashtakavarga SAV Bindus in this transited house (house from lagna)
    const savBindus = kundli.ashtakavarga?.sav?.byHouse
      ? kundli.ashtakavarga.sav.byHouse[houseFromLagna - 1]
      : undefined;

    planetsInfo[pName] = {
      planet: pName,
      longitude: pPos.longitude,
      rashi: pPos.rashi,
      rashiName: pPos.rashiName,
      degree: pPos.degree,
      minute: pPos.minute,
      nakshatra: pPos.nakshatra,
      nakshatraLord: pPos.nakshatraLord,
      pada: pPos.pada,
      isRetrograde: !!pPos.isRetrograde,
      houseFromMoon,
      houseFromLagna,
      isFavorableFromMoon,
      hasVedha,
      vedhaCausedBy,
      netStatus,
      prediction,
      savBindusInHouse: savBindus,
    };
  }

  // 5. Special Sensitive Transits
  const transitSaturnLon = transitPositions["Saturn"].longitude;
  const sadeSati = checkSadeSati(natalMoonLon, transitSaturnLon);
  const dhaiya = checkDhaiya(natalMoonLon, transitSaturnLon);

  const transitMoonRashi = transitPositions["Moon"].rashi - 1; // 0-indexed
  const chandrashtama = getChandrashtama(natalMoonRashi - 1, transitMoonRashi);

  // Jupiter Gochar blessing & aspects
  const guruHouseFromMoon = allTransitHousesFromMoon["Jupiter"];
  const guruStatus = FAVORABLE_GOCHAR_HOUSES["Jupiter"].includes(guruHouseFromMoon)
    ? "Favorable"
    : "Unfavorable";

  // Jupiter's classical aspects: 5th, 7th, 9th from its transit position
  const guruAspectHouses = [
    ((guruHouseFromMoon + 4 - 1) % 12) + 1,
    ((guruHouseFromMoon + 6 - 1) % 12) + 1,
    ((guruHouseFromMoon + 8 - 1) % 12) + 1,
  ];

  let guruBlessingSummary = `Jupiter is transiting House ${guruHouseFromMoon} from Janma Rashi.`;
  if (guruStatus === "Favorable") {
    guruBlessingSummary += ` Highly auspicious period conferring divine protection and expansion to houses ${guruAspectHouses.join(", ")} from Moon.`;
  } else {
    guruBlessingSummary += ` Requires prudent financial and professional patience; divine protection remains active on houses ${guruAspectHouses.join(", ")} from Moon.`;
  }

  const rahuHouseFromMoon = allTransitHousesFromMoon["Rahu"];
  const ketuHouseFromMoon = allTransitHousesFromMoon["Ketu"];
  const karmicImpact = `Rahu transits House ${rahuHouseFromMoon} (amplifying intense ambition and desire) while Ketu transits House ${ketuHouseFromMoon} (triggering spiritual surrender and letting go).`;

  const specialTransits: GocharSpecialTransits = {
    sadeSati,
    dhaiya,
    chandrashtama,
    guruGochar: {
      houseFromMoon: guruHouseFromMoon,
      status: guruStatus,
      blessingSummary: guruBlessingSummary,
      aspectHousesFromMoon: guruAspectHouses,
    },
    rahuKetuAxis: {
      rahuHouseFromMoon,
      ketuHouseFromMoon,
      karmicImpact,
    },
  };

  // 6. Life Area Impact Assessments
  const saturnNet = planetsInfo["Saturn"].netStatus;
  const guruNet = planetsInfo["Jupiter"].netStatus;
  const sunNet = planetsInfo["Sun"].netStatus;
  const venusNet = planetsInfo["Venus"].netStatus;
  const marsNet = planetsInfo["Mars"].netStatus;
  const mercuryNet = planetsInfo["Mercury"].netStatus;

  // Career: 10th house, Saturn, Jupiter, Sun
  let careerRating: LifeAreaGocharImpact["career"]["rating"] = "Mixed";
  let careerSummary = "";
  if (guruNet === "Favorable" && (sunNet === "Favorable" || saturnNet === "Favorable")) {
    careerRating = "Favorable";
    careerSummary = "Excellent window for professional expansion, recognition, new leadership projects, and strategic promotions.";
  } else if (saturnNet === "Unfavorable" && (sadeSati.status || dhaiya.status)) {
    careerRating = "Challenging";
    careerSummary = "Heavy workload and structural delays under Saturn's scrutiny. Focus on discipline, persistence, and avoid impulsive job changes.";
  } else {
    careerRating = "Mixed";
    careerSummary = "Balanced career trajectory. Growth comes through consistent execution and structured collaboration.";
  }

  // Wealth: 2nd & 11th houses, Jupiter, Venus, Mercury
  let wealthRating: LifeAreaGocharImpact["wealth"]["rating"] = "Mixed";
  let wealthSummary = "";
  if (guruNet === "Favorable" || venusNet === "Favorable") {
    wealthRating = "Favorable";
    wealthSummary = "Benefic planetary support enhances financial liquidity, investment returns, and acquisition of valuable assets.";
  } else if (planetsInfo["Sun"].houseFromMoon === 12 || planetsInfo["Mars"].houseFromMoon === 12) {
    wealthRating = "Challenging";
    wealthSummary = "Prone to unexpected overheads and expenditure outlays. Exercise strict budgeting and refrain from speculative risks.";
  } else {
    wealthRating = "Mixed";
    wealthSummary = "Stable financial flow with moderate savings potential. Avoid speculative shortcuts.";
  }

  // Relationships: 7th house, Venus, Jupiter
  let relRating: LifeAreaGocharImpact["relationships"]["rating"] = "Mixed";
  let relSummary = "";
  if (venusNet === "Favorable" && (guruNet === "Favorable" || guruAspectHouses.includes(7))) {
    relRating = "Favorable";
    relSummary = "Harmonious transit for love, marital peace, family celebrations, and successful bilateral partnerships.";
  } else if (chandrashtama.isActive) {
    relRating = "Challenging";
    relSummary = "Active Chandrashtama creates emotional sensitivity. Postpone crucial relationship discussions for the next 48 hours.";
  } else if (marsNet === "Unfavorable" && planetsInfo["Mars"].houseFromMoon === 7) {
    relRating = "Challenging";
    relSummary = "Mars transiting 7th house triggers ego frictions and sudden impatience. Practice mindful calm and avoid harsh debates.";
  } else {
    relRating = "Mixed";
    relSummary = "Standard relationship stability. Transparent communication keeps mutual bonding smooth.";
  }

  // Health: 1st, 6th, 8th houses, Sun, Moon, Saturn
  let healthRating: LifeAreaGocharImpact["health"]["rating"] = "Mixed";
  let healthSummary = "";
  if (sunNet === "Favorable" && marsNet === "Favorable") {
    healthRating = "Favorable";
    healthSummary = "High physical stamina, radiant vitality, and rapid recovery from any previous fatigue.";
  } else if (chandrashtama.isActive || sadeSati.phase === 2) {
    healthRating = "Challenging";
    healthSummary = "Vulnerable to mental restlessness or joint/sleep fatigue. Prioritize adequate rest, hydration, and grounding routines.";
  } else {
    healthRating = "Mixed";
    healthSummary = "Satisfactory overall health. Maintain regular sleep hygiene and moderate nutrition.";
  }

  const lifeAreas: LifeAreaGocharImpact = {
    career: { rating: careerRating, summary: careerSummary },
    wealth: { rating: wealthRating, summary: wealthSummary },
    relationships: { rating: relRating, summary: relSummary },
    health: { rating: healthRating, summary: healthSummary },
  };

  // 7. Overall Score and Verdict
  const overallFavorablePercentage = Math.round((favorableCount / 9) * 100);
  let overallVerdict: GocharAnalysisResult["overallVerdict"] = "Mixed / Moderate";
  if (overallFavorablePercentage >= 65) {
    overallVerdict = "Highly Favorable";
  } else if (overallFavorablePercentage >= 44) {
    overallVerdict = "Favorable";
  } else if (overallFavorablePercentage >= 30) {
    overallVerdict = "Mixed / Moderate";
  } else {
    overallVerdict = "Caution Required";
  }

  // 8. Actionable Advice
  const actionableAdvice: string[] = [];
  if (sadeSati.status) {
    actionableAdvice.push(`Sade Sati Phase ${sadeSati.phase} is active: Chant Hanuman Chalisa, serve elders/underprivileged, and embrace patient perseverance.`);
  }
  if (dhaiya.status) {
    actionableAdvice.push(`Saturn's Dhaiya (${dhaiya.type} house) is active: Avoid hasty real-estate or vehicle deals; practice steady daily sadhana.`);
  }
  if (chandrashtama.isActive) {
    actionableAdvice.push(`Moon in 8th from Janma Rashi (Chandrashtama): Avoid major agreements, high-risk financial commitments, or confrontations for 2.5 days.`);
  }
  if (guruStatus === "Favorable") {
    actionableAdvice.push(`Jupiter's auspicious transit supports beginning new education, spiritual initiation, or key long-term investments.`);
  }
  if (actionableAdvice.length === 0) {
    actionableAdvice.push("Current planetary transits are balanced. Align daily initiatives with favorable hora and tithi periods.");
  }

  // 9. Formatted Markdown Summary
  let formattedSummary = `### 🌌 Vedic Gochar (Transit) Report\n`;
  formattedSummary += `**Transit Date:** ${transitDate.toLocaleDateString("en-IN")} | **Janma Rashi:** ${natalMoonRashiName} | **Lagna:** ${natalLagnaRashiName}\n`;
  formattedSummary += `**Overall Transit Strength:** **${overallFavorablePercentage}%** (${overallVerdict})\n\n`;

  if (sadeSati.status) {
    formattedSummary += `⚠️ **Saturn Sade Sati:** Active (Phase ${sadeSati.phase} — Saturn in ${rashiNames[sadeSati.saturnRashi - 1]})\n`;
  }
  if (dhaiya.status) {
    formattedSummary += `⚠️ **Saturn Dhaiya:** Active (${dhaiya.type} House Shani)\n`;
  }
  if (chandrashtama.isActive) {
    formattedSummary += `🚨 **Chandrashtama:** ACTIVE today (Transiting Moon in 8th house from Janma Rashi)\n`;
  }

  formattedSummary += `\n#### Transiting Grahas Summary:\n`;
  for (const pName of planetNames) {
    const p = planetsInfo[pName];
    const icon = p.netStatus === "Favorable" ? "✅" : p.netStatus === "Obstructed" ? "⚠️" : "❌";
    formattedSummary += `- ${icon} **${p.planet}:** In ${p.rashiName} (House ${p.houseFromMoon} from Moon, House ${p.houseFromLagna} from Lagna) — *${p.netStatus}*. ${p.prediction}\n`;
  }

  return {
    transitDate,
    natalMoonRashi,
    natalMoonRashiName,
    natalLagnaRashi,
    natalLagnaRashiName,
    overallFavorablePercentage,
    overallVerdict,
    planets: planetsInfo,
    specialTransits,
    lifeAreas,
    actionableAdvice,
    formattedSummary,
  };
}

/**
 * Quick single-planet transit lookup for a given Kundli.
 */
export function getPlanetGochar(
  planetName: string,
  kundli: Kundli,
  transitDate: Date = new Date(),
  observer?: Observer
): TransitPlanetInfo | undefined {
  const analysis = getGocharAnalysis(kundli, transitDate, observer);
  return analysis.planets[planetName];
}
