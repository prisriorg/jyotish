import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { CareerPrediction } from "./types";

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
  if (tenthRashiLord === "Mercury" || tenthPlanets.includes("Mercury")) {
    fields.add("Fintech, E-Commerce & SaaS");
  }
  if (tenthRashiLord === "Mars" || tenthPlanets.includes("Mars")) {
    fields.add("High-Performance Engineering & Defense Systems");
  }
  if (tenthRashiLord === "Saturn" || tenthPlanets.includes("Saturn")) {
    fields.add("Enterprise Architecture & Scaled Systems");
  }

  // Leadership capacity
  let leadershipCapacity: CareerPrediction["leadershipCapacity"] =
    tenthSAVBindus >= 32
      ? "Executive / High Authority"
      : tenthSAVBindus >= 28
      ? "Mid-to-Senior Leadership"
      : "Individual Contributor / Specialist";

  const dominantTraits: string[] = [];
  if (thirdSAV >= 28) dominantTraits.push("High initiative and self-starter drive");
  if (tenthSAVBindus >= 30) dominantTraits.push("Natural authority and execution prowess");
  if (seventhSAV < 25) dominantTraits.push("Works best with solo accountability rather than equal partnerships");
  if (sixthSAV >= 28) dominantTraits.push("High resilience in overcoming competitive hurdles");

  const strategicAdvice: string[] = [];
  if (recommendation === "Business & Independent Enterprise") {
    strategicAdvice.push("Your chart favors direct ownership and monetizing specialized knowledge.");
    if (seventhSAV < 25) {
      strategicAdvice.push("Avoid 50-50 partnerships. Maintain primary ownership and legal contracts.");
    }
  } else if (recommendation === "Employment / Job") {
    strategicAdvice.push("Focus on structured corporate hierarchy where performance is rewarded with fast promotions.");
  } else {
    strategicAdvice.push("Build a hybrid model: Start with high-income specialist roles, then transition to independent consulting or product ownership.");
  }

  return {
    recommendation,
    jobScore,
    businessScore,
    dominantTraits,
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
  };
}
