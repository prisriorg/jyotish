import { Kundli } from "../kundli/types";
import { getChalitChart } from "../kundli/chalit";
import { getKpChart } from "../kundli/kp";
import { Observer } from "astronomy-engine";
import { ChalitAnalysis, KpAnalysis, LalKitabAnalysis } from "./types";

/**
 * Computes Bhava Chalit chart and provides deep insights on planetary shifts
 * and actual bhava cuspal occupants.
 */
export function getChalitAnalysis(kundli: Kundli): ChalitAnalysis {
  const chalit = kundli.chalit || getChalitChart(kundli);
  const actualHouseOccupants: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  };

  for (const p of chalit.planets) {
    if (actualHouseOccupants[p.house]) {
      actualHouseOccupants[p.house].push(p.name);
    }
  }

  const shiftedPlanets: ChalitAnalysis["shiftedPlanets"] = [];
  const keyBhavaInsights: string[] = [];

  for (const p of chalit.planets) {
    const shiftVal = p.shifted ?? 0;
    if (shiftVal !== 0) {
      const shiftDirection = shiftVal > 0 ? "Forward (+1)" : "Backward (-1)";
      let impact = "";

      if (p.name === "Moon") {
        impact = `Moon shifted from D1 House ${p.rashiHouse ?? p.house} to Chalit Bhava ${p.house}: Directs emotional intelligence and mental focus towards deep intuition, research, remote/foreign linkages, and solitary reflection.`;
      } else if (p.name === "Sun") {
        impact = `Sun shifted to Chalit Bhava ${p.house}: Focuses core vitality and authority on House ${p.house} affairs rather than conventional sign position.`;
      } else if (p.name === "Saturn") {
        impact = `Saturn shifted to Chalit Bhava ${p.house}: Disciplines House ${p.house} with patience, karmic endurance, and structural mastery.`;
      } else if (p.name === "Jupiter") {
        impact = `Jupiter shifted to Chalit Bhava ${p.house}: Expands fortune, wisdom, and ethics in House ${p.house}.`;
      } else if (p.name === "Venus") {
        impact = `Venus shifted to Chalit Bhava ${p.house}: Enhances diplomacy, luxury, and relationship grace in House ${p.house}.`;
      } else if (p.name === "Mercury") {
        impact = `Mercury shifted to Chalit Bhava ${p.house}: Sharpens analytical acumen and commerce in House ${p.house}.`;
      } else if (p.name === "Mars") {
        impact = `Mars shifted to Chalit Bhava ${p.house}: Channels ambition, drive, and executive action into House ${p.house}.`;
      } else {
        impact = `${p.name} shifted to Chalit Bhava ${p.house}: Delivers practical life results through House ${p.house} rather than D1 rashi house.`;
      }

      shiftedPlanets.push({
        planet: p.name,
        d1House: p.rashiHouse ?? p.house,
        chalitBhava: p.house,
        shiftDirection,
        impact,
      });
    }
  }

  // Generate overarching Chalit Bhava insights
  if (shiftedPlanets.length === 0) {
    keyBhavaInsights.push("All planets maintain consistent house alignment between Rashi (D1) and Bhava Chalit.");
  } else {
    keyBhavaInsights.push(`${shiftedPlanets.length} planetary shift(s) detected between D1 Rashi and Bhava Chalit, refining exact timing and results.`);
    shiftedPlanets.forEach((sp) => {
      keyBhavaInsights.push(`${sp.planet}: Evaluated in Bhava ${sp.chalitBhava} (${sp.shiftDirection}).`);
    });
  }

  // 10th House (Career) in Chalit
  const planetsIn10Chalit = actualHouseOccupants[10] || [];
  if (planetsIn10Chalit.length > 0) {
    keyBhavaInsights.push(`Chalit 10th Bhava is actively occupied by ${planetsIn10Chalit.join(", ")}, providing direct professional prominence.`);
  } else {
    keyBhavaInsights.push("Chalit 10th Bhava is clear of direct malefic interference, allowing 10th lord and aspecting planets full command.");
  }

  // 7th House (Marriage) in Chalit
  const planetsIn7Chalit = actualHouseOccupants[7] || [];
  if (planetsIn7Chalit.length > 0) {
    keyBhavaInsights.push(`Chalit 7th Bhava is blessed by ${planetsIn7Chalit.join(", ")}, confirming direct partnership dynamics.`);
  }

  return {
    shiftedPlanets,
    actualHouseOccupants,
    keyBhavaInsights,
  };
}

/**
 * Computes Krishnamurti Paddhati (KP) 4-fold cuspal rulers and sub-lord significations.
 */
export function getKpAnalysis(kundli: Kundli): KpAnalysis {
  const date = kundli.birthDetails?.rawDate || new Date();
  const lat = kundli.birthDetails?.lat ?? 25.872;
  const lon = kundli.birthDetails?.lon ?? 82.685;
  const observer = new Observer(lat, lon, 0);

  const kp = kundli.kp || getKpChart(date, observer, { ayanamsa: "kp" });
  const cusps = kp.cusps || [];

  const cuspSubLords = cusps.map((c) => ({
    cuspNumber: c.houseNumber,
    subLord: c.subLord,
    starLord: c.nakshatraLord,
  }));

  // 10th Cusp (Career) Sub-Lord
  const cusp10 = cusps[9] || cusps.find((c) => c.houseNumber === 10) || cusps[0];
  const sub10 = cusp10.subLord;
  const star10 = cusp10.nakshatraLord;

  let careerVerdict = "";
  if (sub10 === "Rahu" || star10 === "Rahu") {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10} (Star: ${star10}): Strong promise of unconventional domains, software engineering, AI, digital networks, deep research, and high-tech consulting.`;
  } else if (sub10 === "Saturn" || star10 === "Saturn") {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10}: Favors large-scale systems, enterprise architecture, long-term engineering, industrial operations, and structural persistence.`;
  } else if (sub10 === "Mercury" || star10 === "Mercury") {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10}: Signals high analytical mastery, commerce, trading, data structures, and media entrepreneurship.`;
  } else if (sub10 === "Jupiter") {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10}: High executive advisory, institutional consulting, financial management, and leadership.`;
  } else if (sub10 === "Mars") {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10}: Dynamic leadership, executive drive, technical engineering, and independent venture.`;
  } else {
    careerVerdict = `KP 10th Cusp Sub-Lord is ${sub10}: Governs professional growth through strategic planning and individual expertise.`;
  }

  // 7th Cusp (Marriage) Sub-Lord
  const cusp7 = cusps[6] || cusps.find((c) => c.houseNumber === 7) || cusps[0];
  const sub7 = cusp7.subLord;
  const star7 = cusp7.nakshatraLord;

  let marriagePromise = "";
  let typeIndication = "";

  if (["Jupiter", "Venus", "Moon"].includes(sub7)) {
    marriagePromise = `KP 7th Cusp Sub-Lord is ${sub7} (Star: ${star7}): Auspicious sub-lord ensuring fruitful marriage, moral alignment, and strong matrimonial bonding.`;
  } else if (sub7 === "Saturn") {
    marriagePromise = `KP 7th Cusp Sub-Lord is ${sub7}: Indicates serious, mature, and deeply loyal union, favoring marriage after age 26.`;
  } else {
    marriagePromise = `KP 7th Cusp Sub-Lord is ${sub7}: Active partnership promise with mutual intellectual focus.`;
  }

  if (["Venus", "Mars", "Rahu"].includes(sub7) || ["Venus", "Mars", "Rahu"].includes(star7)) {
    typeIndication = "KP indicates strong romantic chemistry and personal courtship (Love-cum-Arranged supported).";
  } else if (["Jupiter", "Sun"].includes(sub7)) {
    typeIndication = "KP highlights elder blessings, high family status, and traditional dignity (Arranged / Self-choice with family consent).";
  } else {
    typeIndication = "KP indicates balanced partnership through mutual intellectual wavelength.";
  }

  // 2nd & 11th Cusps (Wealth & Net Inflow)
  const cusp2 = cusps[1] || cusps[0];
  const cusp11 = cusps[10] || cusps[0];
  const sub2 = cusp2.subLord;
  const sub11 = cusp11.subLord;

  const financialSignification = `Cusp 2 Sub-Lord (${sub2}) stabilizes wealth accumulation and family assets. Cusp 11 Sub-Lord (${sub11}) activates exponential financial gains, scalable networks, and fulfillment of high ambitions.`;

  return {
    cuspSubLords,
    careerCusp10: {
      subLord: sub10,
      starLord: star10,
      significationVerdict: careerVerdict,
    },
    marriageCusp7: {
      subLord: sub7,
      starLord: star7,
      marriagePromise,
      typeIndication,
    },
    wealthCusps: {
      cusp2SubLord: sub2,
      cusp11SubLord: sub11,
      financialSignification,
    },
  };
}

/**
 * Computes Lal Kitab Kundli metrics:
 * Teva classification (Dharmi vs Paapi), Kismat Ka Grah, Sleeping Houses,
 * Karmic Debts (Rin), and practical time-tested Lal Kitab totke.
 */
export function getLalKitabAnalysis(kundli: Kundli): LalKitabAnalysis {
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};

  const getHouseOfPlanet = (name: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(name)) return h.number;
    }
    return 1;
  };

  const jupiterHouse = getHouseOfPlanet("Jupiter");
  const saturnHouse = getHouseOfPlanet("Saturn");
  const venusHouse = getHouseOfPlanet("Venus");
  const sunHouse = getHouseOfPlanet("Sun");
  const moonHouse = getHouseOfPlanet("Moon");
  const marsHouse = getHouseOfPlanet("Mars");
  const mercuryHouse = getHouseOfPlanet("Mercury");
  const rahuHouse = getHouseOfPlanet("Rahu");
  const ketuHouse = getHouseOfPlanet("Ketu");

  // 1. Dharmi Teva Check
  // In Lal Kitab, a chart is "Dharmi Teva" (Divine Shield) when:
  // - Jupiter is in Kendra (1, 4, 7, 10) or Trikona (5, 9)
  // - Or Moon and Saturn are in mutual peace
  let tevaType: LalKitabAnalysis["tevaType"] = "Aam Teva (Standard)";
  if ([1, 4, 7, 10, 5, 9].includes(jupiterHouse)) {
    tevaType = "Dharmi Teva (Blessed / Auspicious)";
  } else if ([1, 4, 7].includes(rahuHouse) && [1, 4, 7].includes(ketuHouse) && jupiterHouse === 6) {
    tevaType = "Paapi Teva (Challenging)";
  }

  // 2. Kismat Ka Grah (Planet of Destiny Awakening)
  let kismatPlanet = "Jupiter";
  let kismatHouse = jupiterHouse;
  let kismatRole = "Awakens divine wisdom, elder support, and social respect.";

  if (venusHouse === 2) {
    kismatPlanet = "Venus";
    kismatHouse = 2;
    kismatRole = "Venus occupies House 2 (Own Pakka Ghar in Lal Kitab): Bestows Lakshmi Grace, charismatic speech, and financial abundance.";
  } else if (jupiterHouse === 7) {
    kismatPlanet = "Jupiter";
    kismatHouse = 7;
    kismatRole = "Jupiter in House 7 acts as 'Dharmatma ki Takdeer', ensuring noble partner and respected societal standing.";
  } else if (sunHouse === 1) {
    kismatPlanet = "Sun";
    kismatHouse = 1;
    kismatRole = "Sun in House 1 brings natural command, royal executive authority, and strong vitality.";
  }

  // 3. Sleeping Houses (Soya Hua Ghar)
  const sleepingHouses: number[] = [];
  const awakenedHouses: number[] = [];

  for (let i = 1; i <= 12; i++) {
    const h = houses.find((house) => house.number === i);
    if (!h || h.planets.length === 0) {
      sleepingHouses.push(i);
    } else {
      awakenedHouses.push(i);
    }
  }

  // 4. Special Lal Kitab Yogas
  const specialYogas: LalKitabAnalysis["specialYogas"] = [];

  if (marsHouse === rahuHouse) {
    specialYogas.push({
      name: "Angarak / Lal Kitab Toofan Yoga",
      planets: ["Mars", "Rahu"],
      house: marsHouse,
      effect: "Unstoppable daring courage, technological prowess, and aggressive entrepreneurial instincts in House " + marsHouse + ".",
    });
  }

  if (jupiterHouse === 7) {
    specialYogas.push({
      name: "Lal Kitab Dharmatma Yoga",
      planets: ["Jupiter"],
      house: 7,
      effect: "Partner acts as a spiritual and ethical pillar, bringing prosperity and social dignity after marriage.",
    });
  }

  if (venusHouse === 2) {
    specialYogas.push({
      name: "Lal Kitab Lakshmi Bhandar Yoga",
      planets: ["Venus"],
      house: 2,
      effect: "House 2 is the Pakka Ghar of Venus in Lal Kitab. Wealth and sweet communication multiply with time.",
    });
  }

  if (saturnHouse === 5) {
    specialYogas.push({
      name: "Lal Kitab Gyani Shani Yoga",
      planets: ["Saturn"],
      house: 5,
      effect: "Deep analytical mind, strategic patience, and technical research intellect.",
    });
  }

  // 5. Lal Kitab Karmic Debts (Rin)
  const karmicDebts: LalKitabAnalysis["karmicDebts"] = [];

  // Pitra Rin: Jupiter afflicted in 2, 5, 9, 12 by Saturn/Rahu
  const hasPitraRin = [2, 5, 9, 12].includes(jupiterHouse) && (jupiterHouse === rahuHouse || jupiterHouse === saturnHouse);
  karmicDebts.push({
    debtType: "Pitra Rin (Ancestral Debt)",
    isAfflicted: hasPitraRin,
    description: hasPitraRin
      ? "Ancestral obligations require ethical charity and respect for elders."
      : "No Pitra Rin detected. Jupiter is free from heavy ancestral affliction.",
    remedy: "Donate yellow items (chana dal, turmeric, brass utensils) at religious or educational shrines.",
  });

  // Stri Rin: Venus afflicted by Sun or Rahu
  const hasStriRin = venusHouse === sunHouse || venusHouse === rahuHouse;
  karmicDebts.push({
    debtType: "Stri Rin (Partner / Feminine Debt)",
    isAfflicted: hasStriRin,
    description: hasStriRin
      ? "Requires honoring women, mother, and partner with high respect."
      : "No Stri Rin detected. Venus functions with elegance and dignity.",
    remedy: "Feed grass and sweet bread to cows; never disrespect women or domestic partners.",
  });

  // 6. Actionable Lal Kitab Remedies (Totke & Habits)
  const lalKitabRemedies: LalKitabAnalysis["lalKitabRemedies"] = [
    {
      area: "Wealth",
      remedy: "Apply a small Tilak of genuine Saffron (Kesar) on your forehead, navel, and tongue every morning. Keep a square piece of pure solid silver in your wallet.",
      caution: "Never accept electronic gadgets, dark blue, or black apparel free of charge from acquaintances.",
    },
    {
      area: "Career",
      remedy: "Treat blue-collar staff, drivers, security personnel, and laborers with utmost generosity. Pay fair wages promptly to keep Shani pleased.",
      caution: "Avoid arrogant speech when in positions of command; never insult mentors or teachers.",
    },
    {
      area: "Marriage & Peace",
      remedy: "Feed a desi cow with fresh dough (loi) mixed with a pinch of turmeric and jaggery on Thursdays.",
      caution: "Never keep non-functional clocks, cracked mirrors, or rusted iron tools in the bedroom or living area.",
    },
    {
      area: "General Health",
      remedy: "Drink water from a silver cup or silver vessel. It harmonizes the Moon, pacifies Rahu, and brings sharp mental clarity.",
      caution: "Avoid late-night overthinking and stay hydrated during sunlit hours.",
    },
  ];

  return {
    tevaType,
    kismatKaGrah: {
      planet: kismatPlanet,
      house: kismatHouse,
      role: kismatRole,
    },
    sleepingHouses,
    awakenedHouses,
    specialYogas,
    karmicDebts,
    lalKitabRemedies,
  };
}
