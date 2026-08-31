import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { CareerPrediction } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";

export function getCareerPrediction(kundli: Kundli): CareerPrediction {
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;

  // Helper to find which house a planet is located in (1 to 12)
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) {
        return h.number;
      }
    }
    return 1;
  };

  // 10th House analysis
  const house10 = houses.find((h) => h.number === 10) || houses[9] || {
    number: 10,
    rashi: 10,
    planets: [] as string[],
  };

  const tenthRashiIdx = (house10.rashi - 1 + 12) % 12;
  const tenthRashiName = rashiNames[tenthRashiIdx] || "Capricorn";
  const tenthRashiLord = RASHI_LORDS[tenthRashiIdx] || "Saturn";
  const tenthLordPlacement = getPlanetHouse(tenthRashiLord);
  const tenthSAVBindus = sav ? sav.byHouse[9] : 28;

  // 6th house (Employment/Job) vs 7th house (Business/Trade/Clients)
  const sixthSAV = sav ? sav.byHouse[5] : 28;
  const seventhSAV = sav ? sav.byHouse[6] : 28;
  const thirdSAV = sav ? sav.byHouse[2] : 28; // Enterprise & courage

  let jobScore = 50;
  let businessScore = 50;

  // Evaluate 6th vs 7th vs 3rd SAV points
  if (seventhSAV > sixthSAV + 3) {
    businessScore += 15;
    jobScore -= 10;
  } else if (sixthSAV > seventhSAV + 3) {
    jobScore += 15;
    businessScore -= 10;
  }

  if (thirdSAV >= 30) {
    businessScore += 10; // High entrepreneurial courage
  }

  // 10th lord placement influences
  if ([1, 3, 7, 10, 11].includes(tenthLordPlacement)) {
    businessScore += 12;
  }
  if ([6, 8, 12].includes(tenthLordPlacement)) {
    jobScore += 10;
  }

  // Planets influencing 10th, 7th, 3rd
  const tenthPlanets = house10.planets || [];
  if (tenthPlanets.includes("Sun") || tenthPlanets.includes("Mars")) {
    jobScore += 10; // Authority, governance, executive roles
    businessScore += 5;
  }
  if (tenthPlanets.includes("Mercury") || tenthPlanets.includes("Rahu")) {
    businessScore += 15; // Trade, software, analytics, innovation
  }
  if (tenthPlanets.includes("Jupiter")) {
    businessScore += 10;
    jobScore += 10; // Advisory, leadership
  }

  // 3rd house planets
  const house3 = houses.find((h) => h.number === 3);
  if (house3?.planets.includes("Mars") || house3?.planets.includes("Rahu")) {
    businessScore += 8; // Bold risk-taking & technical prowess
  }

  // Classical 10th Lord in Houses 1-12 Dictionary (Brihat Parashara & Phaladeepika)
  const tenthLordDictionary: Record<number, string> = {
    1: `10th Lord (${tenthRashiLord}) in 1st House: Creates a self-made leader and pioneer. Native builds high authority through personal enterprise, individual identity, and public recognition.`,
    2: `10th Lord (${tenthRashiLord}) in 2nd House: Career is intrinsically tied to capital, banking, family business, asset accumulation, and verbal advisory.`,
    3: `10th Lord (${tenthRashiLord}) in 3rd House: Excellence in high-tech, software engineering, digital media, independent enterprise, communications, and bold strategic ventures.`,
    4: `10th Lord (${tenthRashiLord}) in 4th House: Native attains high status in real estate, education, institutional administration, manufacturing, or vehicle/infrastructure engineering.`,
    5: `10th Lord (${tenthRashiLord}) in 5th House: Exceptional intellect, high-level investment acumen, advisory council, strategic consulting, creative leadership, and algorithmic thinking.`,
    6: `10th Lord (${tenthRashiLord}) in 6th House: Outstanding competence in competitive environments, technical service, healthcare, legal systems, or operational problem-solving.`,
    7: `10th Lord (${tenthRashiLord}) in 7th House: Global commercial success, high-value contracts, client-facing enterprise, foreign trade, and prominent joint ventures.`,
    8: `10th Lord (${tenthRashiLord}) in 8th House: Master of deep research, confidential data, cybersecurity, metaphysics, forensic investigations, and transformative technology.`,
    9: `10th Lord (${tenthRashiLord}) in 9th House: High ethical leadership, global consulting, international expansion, judiciary, publishing, and mentor-level authority.`,
    10: `10th Lord (${tenthRashiLord}) in 10th House: Swa-Kshetra pinnacle of karma. Unassailable corporate executive status, government recognition, and enduring industry legacy.`,
    11: `10th Lord (${tenthRashiLord}) in 11th House: Multiplier of gains. Native builds scalable enterprise, extensive professional networks, SaaS platforms, and high-margin ventures.`,
    12: `10th Lord (${tenthRashiLord}) in 12th House: Career flourishes with multinational corporations (MNCs), overseas institutions, remote engineering, research labs, or foreign clients.`,
  };
  const tenthLordPlacementResult = tenthLordDictionary[tenthLordPlacement] || tenthLordDictionary[10];

  // Pancha Mahapurusha Yoga Check
  let panchaMahapurushaYoga: string | undefined;
  const kendras = [1, 4, 7, 10];
  for (const k of kendras) {
    const h = houses.find((house) => house.number === k);
    if (!h) continue;
    const rashi = h.rashi;
    if (h.planets.includes("Mars") && ([1, 8, 10].includes(rashi))) {
      panchaMahapurushaYoga = "Ruchaka Mahapurusha Yoga (Mars in Kendra in Own/Exalted sign): Bestows fearless commander intellect, executive authority, and unmatched technical drive.";
    } else if (h.planets.includes("Mercury") && ([3, 6].includes(rashi))) {
      panchaMahapurushaYoga = "Bhadra Mahapurusha Yoga (Mercury in Kendra in Own/Exalted sign): Exceptional algorithmic intelligence, master communicator, and visionary tech architect.";
    } else if (h.planets.includes("Jupiter") && ([4, 9, 12].includes(rashi))) {
      panchaMahapurushaYoga = "Hamsa Mahapurusha Yoga (Jupiter in Kendra in Own/Exalted sign): Sovereign wisdom, universal respect, ethical leadership, and supreme advisory status.";
    } else if (h.planets.includes("Venus") && ([2, 7, 12].includes(rashi))) {
      panchaMahapurushaYoga = "Malavya Mahapurusha Yoga (Venus in Kendra in Own/Exalted sign): Opulent success, creative mastery, high luxury, and magnetic public charisma.";
    } else if (h.planets.includes("Saturn") && ([7, 10, 11].includes(rashi))) {
      panchaMahapurushaYoga = "Sasa Mahapurusha Yoga (Saturn in Kendra in Own/Exalted sign): Immense stamina, institutional leadership, mass enterprise authority, and enduring empire-building.";
    }
  }

  // Jaimini Amatyakaraka (Career Indicator)
  const jaimini = getJaiminiKarakas(kundli);
  const amatyakarakaInsight = `Jaimini Amatyakaraka (AmK) is ${jaimini.amatyakaraka.planet} (at ${jaimini.amatyakaraka.formattedDegree} in ${jaimini.amatyakaraka.rashiName}, House ${jaimini.amatyakaraka.house}): ${jaimini.amatyakaraka.signification}`;

  // Dominant traits list
  const dominantTraitsList: string[] = [];

  // Digbala (Directional Strength)
  if (tenthPlanets.includes("Sun") || tenthPlanets.includes("Mars")) {
    dominantTraitsList.push("Possesses 100% Digbala (Directional Strength) in 10th House: Radiates natural command and executive presence.");
  }

  // Normalize scores (15 to 95)
  jobScore = Math.max(15, Math.min(95, jobScore));
  businessScore = Math.max(15, Math.min(95, businessScore));

  let recommendation: CareerPrediction["recommendation"];
  if (businessScore >= 60 && businessScore > jobScore + 5) {
    recommendation = "Business & Independent Enterprise";
  } else if (jobScore >= 60 && jobScore > businessScore + 5) {
    recommendation = "Employment / Job";
  } else {
    recommendation = "Hybrid / Consulting & Freelance";
  }

  // Suitable career fields
  const fields = new Set<string>();
  const rashiName = tenthRashiName;

  // Add fields by 10th rashi element
  if (["Aries", "Leo", "Sagittarius"].includes(rashiName)) {
    fields.add("Technology & Engineering Leadership");
    fields.add("Executive Management");
    fields.add("Strategic Planning & Operations");
  } else if (["Taurus", "Virgo", "Capricorn"].includes(rashiName)) {
    fields.add("Software Architecture & Systems");
    fields.add("Financial Engineering & Analytics");
    fields.add("Product Development & Infrastructure");
  } else if (["Gemini", "Libra", "Aquarius"].includes(rashiName)) {
    fields.add("Artificial Intelligence & Digital Platforms");
    fields.add("Consulting & High-Tech Research");
    fields.add("Media, Communications & Networking");
  } else {
    // Watery
    fields.add("Data Science & Deep Research");
    fields.add("Healthcare / Biomedical Tech");
    fields.add("Advisory & Human Resources");
  }

  // Specific lord/planet nuances
  if (tenthRashiLord === "Mercury" || tenthPlanets.includes("Mercury") || jaimini.amatyakaraka.planet === "Mercury") {
    fields.add("Fintech, E-Commerce & SaaS");
  }
  if (tenthRashiLord === "Mars" || tenthPlanets.includes("Mars") || jaimini.amatyakaraka.planet === "Mars") {
    fields.add("High-Performance Engineering & Defense Systems");
  }
  if (tenthRashiLord === "Saturn" || tenthPlanets.includes("Saturn") || jaimini.amatyakaraka.planet === "Saturn") {
    fields.add("Enterprise Architecture & Scaled Systems");
  }
  if (tenthRashiLord === "Jupiter" || tenthPlanets.includes("Jupiter") || jaimini.amatyakaraka.planet === "Jupiter") {
    fields.add("High-Level Advisory, Venture Capital & Institutional Strategy");
  }

  // Leadership capacity
  let leadershipCapacity: CareerPrediction["leadershipCapacity"] =
    tenthSAVBindus >= 32
      ? "Executive / High Authority"
      : tenthSAVBindus >= 28
      ? "Mid-to-Senior Leadership"
      : "Individual Contributor / Specialist";

  if (thirdSAV >= 28) dominantTraitsList.push("High initiative and self-starter drive");
  if (tenthSAVBindus >= 30) dominantTraitsList.push("Natural authority and execution prowess");
  if (seventhSAV < 25) dominantTraitsList.push("Works best with solo accountability rather than equal partnerships");
  if (sixthSAV >= 28) dominantTraitsList.push("High resilience in overcoming competitive hurdles");

  const strategicAdvice: string[] = [];
  if (recommendation === "Business & Independent Enterprise") {
    strategicAdvice.push("Your chart favors direct ownership and monetizing specialized knowledge.");
    if (seventhSAV < 25) {
      strategicAdvice.push("Avoid 50-50 partnerships. Maintain primary ownership and clear legal contracts.");
    }
  } else if (recommendation === "Employment / Job") {
    strategicAdvice.push("Focus on structured corporate hierarchy where performance is rewarded with fast promotions.");
  } else {
    strategicAdvice.push("Build a hybrid model: Start with high-income specialist roles, then transition to independent consulting or product ownership.");
  }

  const chalit = getChalitAnalysis(kundli);
  const kp = getKpAnalysis(kundli);
  const lalKitab = getLalKitabAnalysis(kundli);

  const chalitInsight = chalit.keyBhavaInsights.find((i: string) => i.includes("10th")) || "Chalit 10th Bhava reinforces core career direction.";
  const kpInsight = kp.careerCusp10.significationVerdict;
  const lalKitabInsight = `Lal Kitab: Teva is ${lalKitab.tevaType}. Destiny Awakener (${lalKitab.kismatKaGrah.planet}) in House ${lalKitab.kismatKaGrah.house} powers professional expansion.`;

  return {
    recommendation,
    jobScore,
    businessScore,
    dominantTraits: dominantTraitsList,
    suitableFields: Array.from(fields),
    tenthHouseDetails: {
      rashi: tenthRashiName,
      rashiLord: tenthRashiLord,
      lordPlacementHouse: tenthLordPlacement,
      planetsIn10th: tenthPlanets,
      savBindus: tenthSAVBindus,
    },
    leadershipCapacity,
    strategicAdvice,
    tenthLordPlacementResult,
    amatyakarakaInsight,
    panchaMahapurushaYoga,
    chalitInsight,
    kpInsight,
    lalKitabInsight,
  };
}

