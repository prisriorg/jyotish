import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { checkMangalDosha } from "../matching/index";
import { MarriagePrediction } from "./types";

export function getMarriagePrediction(kundli: Kundli): MarriagePrediction {
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const house7 = houses.find((h) => h.number === 7) || houses[6];
  const birthYear = kundli.birthDetails?.rawDate
    ? kundli.birthDetails.rawDate.getFullYear()
    : new Date().getFullYear() - 22;

  const currentYear = new Date().getFullYear();

  // 7th lord & planets
  const rashi7Idx = ((house7?.rashi || 7) - 1 + 12) % 12;
  const lord7 = RASHI_LORDS[rashi7Idx];
  const planetsIn7 = house7?.planets || [];

  // 2nd and 11th lords (family & union)
  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const lord2 = RASHI_LORDS[((house2?.rashi || 2) - 1 + 12) % 12];
  const lord11 = RASHI_LORDS[((house11?.rashi || 11) - 1 + 12) % 12];

  // Marriage significators (Lords of 7th, 2nd, 11th, natural karakas Venus & Jupiter, or planets in 7th)
  const significators = new Set<string>([lord7, lord2, lord11, "Venus", "Jupiter", ...planetsIn7]);

  // Analyze Dasha tree for potential timing years
  const potentialYears = new Set<number>();
  let currentDashaFavorable = false;
  let dashaSupportExplanation = "";

  const dashaTree = kundli.dasha?.mahadashas || [];
  const now = new Date();

  for (const maha of dashaTree) {
    if (maha.antars) {
      for (const antar of maha.antars) {
        const startYear = antar.startTime.getFullYear();
        const endYear = antar.endTime.getFullYear();
        const ageAtStart = startYear - birthYear;

        // Realistic marriage window: age 23 to 35
        if (ageAtStart >= 23 && ageAtStart <= 35) {
          if (significators.has(antar.planet) || significators.has(maha.planet)) {
            for (let y = startYear; y <= endYear; y++) {
              if (y >= currentYear) {
                potentialYears.add(y);
              }
            }
          }
        }

        // Check if currently running antar is favorable
        if (now >= antar.startTime && now <= antar.endTime) {
          if (significators.has(antar.planet) || significators.has(maha.planet)) {
            currentDashaFavorable = true;
            dashaSupportExplanation = `Currently running ${maha.planet} Mahadasha with ${antar.planet} Antardasha carries strong relationship activation.`;
          }
        }
      }
    }
  }

  if (!dashaSupportExplanation) {
    dashaSupportExplanation = `Upcoming dasha sub-periods involving 7th lord (${lord7}) or benefic influences will trigger marriage readiness.`;
  }

  // Sort predicted timing years and limit to top 3-4 distinct years
  const sortedYears = Array.from(potentialYears).sort((a, b) => a - b).slice(0, 4);

  // Favorable age range
  const favorableAgeRange = "26 to 29 years";

  // Partner characteristics based on 7th sign and occupants
  const signDescriptions: Record<string, { nature: string; traits: string[]; direction: string }> = {
    Aries: {
      nature: "Dynamic, energetic, courageous, and direct in communication.",
      traits: ["High initiative", "Independent mindset", "Passionate"],
      direction: "East or active urban environment",
    },
    Taurus: {
      nature: "Grounded, graceful, values financial security and aesthetic comfort.",
      traits: ["Loyal", "Artistic appreciation", "Practical"],
      direction: "South or flourishing family background",
    },
    Gemini: {
      nature: "Intellectual, curious, witty, and highly communicative.",
      traits: ["Adaptable", "Loves learning & discussions", "Youthful energy"],
      direction: "West or tech/commercial background",
    },
    Cancer: {
      nature: "Empathetic, deeply caring, family-oriented, and emotionally supportive.",
      traits: ["Intuitive", "Protective", "Nurturing"],
      direction: "North or ancestral roots near water",
    },
    Leo: {
      nature: "Dignified, proud, confident, with natural leadership and magnetic presence.",
      traits: ["High self-respect", "Generous", "Strong professional ambition"],
      direction: "East or reputed / well-regarded family",
    },
    Virgo: {
      nature: "Analytical, organized, service-oriented, with sharp eye for detail.",
      traits: ["Methodical", "Reliable", "Health-conscious"],
      direction: "South or academic / administrative background",
    },
    Libra: {
      nature: "Charming, socially poised, balanced, with high diplomacy and aesthetic sense.",
      traits: ["Diplomatic", "Fair-minded", "Cultured & artistic"],
      direction: "West or creative / commercial circles",
    },
    Scorpio: {
      nature: "Intense, deeply loyal, perceptive, with an investigative and private nature.",
      traits: ["Emotionally profound", "Resilient", "Determined"],
      direction: "North or transformative / research background",
    },
    Sagittarius: {
      nature: "Optimistic, philosophical, principled, loves freedom and higher learning.",
      traits: ["Truthful", "Inspirational", "Travel-loving"],
      direction: "East or educational / spiritual background",
    },
    Capricorn: {
      nature: "Pragmatic, disciplined, hardworking, and deeply responsible.",
      traits: ["Patient", "Career-focused", "Steadfast"],
      direction: "South or established industry background",
    },
    Aquarius: {
      nature: "Progressive, unconventional, humanitarian, and intellectually independent.",
      traits: ["Forward-thinking", "Egalitarian", "Tech-savvy"],
      direction: "West or innovative / modern background",
    },
    Pisces: {
      nature: "Compassionate, gentle, spiritual, with creative and intuitive imagination.",
      traits: ["Kind-hearted", "Imaginative", "Devotional"],
      direction: "North or peaceful retreat background",
    },
  };

  const rashi7Name = rashiNames[rashi7Idx] || "Leo";
  const partnerInfo = signDescriptions[rashi7Name] || signDescriptions.Leo;

  if (planetsIn7.includes("Jupiter")) {
    partnerInfo.traits.push("Wise, ethically upright, and culturally knowledgeable");
  }
  if (planetsIn7.includes("Venus")) {
    partnerInfo.traits.push("Visually appealing, sophisticated taste, and charming");
  }

  // Mangal Dosha
  const dosha = checkMangalDosha(kundli);
  const mangalDosha = {
    hasDosha: dosha.hasDosha,
    isCancelled: dosha.description.toLowerCase().includes("cancelled"),
    description: dosha.description,
  };

  // --- Love vs Arranged Marriage & Intercaste Analysis ---
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };

  const house1 = houses.find((h) => h.number === 1) || houses[0];
  const house5 = houses.find((h) => h.number === 5) || houses[4];
  const house9 = houses.find((h) => h.number === 9) || houses[8];
  const house12 = houses.find((h) => h.number === 12) || houses[11];

  const lord1 = kundli.ascendant.rashiLord || RASHI_LORDS[((house1?.rashi || 1) - 1 + 12) % 12];
  const lord5 = RASHI_LORDS[((house5?.rashi || 5) - 1 + 12) % 12];
  const lord9 = RASHI_LORDS[((house9?.rashi || 9) - 1 + 12) % 12];
  const lord12 = RASHI_LORDS[((house12?.rashi || 12) - 1 + 12) % 12];

  const lord1House = getPlanetHouse(lord1);
  const lord5House = getPlanetHouse(lord5);
  const lord7House = getPlanetHouse(lord7);
  const lord9House = getPlanetHouse(lord9);
  const lord2House = getPlanetHouse(lord2);
  const lord12House = getPlanetHouse(lord12);

  const venusHouse = getPlanetHouse("Venus");
  const marsHouse = getPlanetHouse("Mars");
  const rahuHouse = getPlanetHouse("Rahu");
  const ketuHouse = getPlanetHouse("Ketu");
  const saturnHouse = getPlanetHouse("Saturn");
  const jupiterHouse = getPlanetHouse("Jupiter");

  let loveScore = 45;
  let arrangedScore = 45;
  let intercasteProbability = 20;
  const keyIndicators: string[] = [];

  // 1. 5th House & 7th House Connections (Core Love Marriage Yoga)
  if (lord5House === 7) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("5th Lord (Romance) placed in 7th House (Marriage): Classical Love Marriage Yoga.");
  }
  if (lord7House === 5) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("7th Lord (Marriage) placed in 5th House (Romance): Marriage born out of romantic courtship.");
  }
  if (lord5House === lord7House) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("5th Lord and 7th Lord are conjunct in the same house: Direct union of love and marriage.");
  }
  if (Math.abs(lord5House - lord7House) === 6) {
    loveScore += 20;
    arrangedScore -= 10;
    keyIndicators.push("5th Lord and 7th Lord mutually aspect each other: Mutual romantic attraction leading to wedlock.");
  }

  // Lagna Lord in 5th or 7th
  if (lord1House === 5) {
    loveScore += 15;
    keyIndicators.push("Lagna Lord placed in 5th House: Native exercises strong personal choice and romantic autonomy.");
  }
  if (lord1House === 7) {
    loveScore += 15;
    keyIndicators.push("Lagna Lord placed in 7th House: Direct control over choice of life partner.");
  }
  if (saturnHouse === 5 && house7?.number === 7) {
    // Saturn's 3rd aspect on 7th house
    loveScore += 10;
    intercasteProbability += 15;
    keyIndicators.push("Lagna Lord Saturn in 5th house aspecting 7th house: Self-selected courtship with unconventional choice.");
  }

  // Venus-Mars connection (Passion & Romantic drive)
  if (venusHouse === marsHouse) {
    loveScore += 15;
    keyIndicators.push("Venus-Mars conjunction: Intense romantic passion and strong natural desire for love marriage.");
  } else if (Math.abs(venusHouse - marsHouse) === 6) {
    loveScore += 12;
    keyIndicators.push("Venus-Mars mutual aspect: Dynamic romantic chemistry.");
  }

  // Rahu in 5th or 7th house (Unconventional / Breaking orthodox rules)
  if (rahuHouse === 7 || house7?.planets.includes("Rahu")) {
    loveScore += 18;
    arrangedScore -= 12;
    intercasteProbability += 30;
    keyIndicators.push("Rahu in 7th House: Strong drive for unconventional, intercaste, or cross-cultural marriage.");
  }
  if (rahuHouse === 5 || house5?.planets.includes("Rahu")) {
    loveScore += 15;
    intercasteProbability += 15;
    keyIndicators.push("Rahu in 5th House: Modern and progressive romantic views, breaking caste or regional barriers.");
  }
  if (rahuHouse === lord7House) {
    intercasteProbability += 25;
    keyIndicators.push("Rahu conjunct 7th Lord: Strong probability of marriage outside traditional clan/caste boundary.");
  }
  if (rahuHouse === venusHouse) {
    intercasteProbability += 20;
    loveScore += 10;
    keyIndicators.push("Rahu conjunct Venus: Attraction towards non-traditional or diverse cultural backgrounds.");
  }

  // Traditional & Arranged Marriage Factors (9th, 2nd, Jupiter)
  if (lord9House === 7 || lord7House === 9) {
    arrangedScore += 20;
    loveScore -= 10;
    keyIndicators.push("9th Lord (Tradition & Elders) connected with 7th: Strong family involvement and parental blessing.");
  }
  if (lord2House === 7 || lord7House === 2) {
    arrangedScore += 15;
    keyIndicators.push("2nd Lord (Family Clan) connected with 7th: Traditional family-mediated alliance favored.");
  }
  if (house7?.planets.includes("Jupiter")) {
    arrangedScore += 18;
    keyIndicators.push("Jupiter in 7th House: High moral values, mutual respect for family heritage, and elder support.");
  }
  if ([1, 3, 11].includes(jupiterHouse)) {
    arrangedScore += 12;
    keyIndicators.push("Jupiter's auspicious aspect on 7th House: Family consent and auspicious traditional sanction.");
  }

  // Ketu / 12th House (Distant or different cultural origins)
  if (house9?.planets.includes("Ketu") || ketuHouse === 9) {
    intercasteProbability += 12;
    keyIndicators.push("Ketu in 9th House: Detachment from orthodox ritualistic barriers in partner selection.");
  }
  if (lord7House === 12 || lord12House === 7) {
    intercasteProbability += 15;
    keyIndicators.push("7th Lord in 12th House / foreign connection: Partner likely from distant culture, state, or nationality.");
  }

  // Clamp scores
  loveScore = Math.max(15, Math.min(95, loveScore));
  arrangedScore = Math.max(15, Math.min(95, arrangedScore));
  intercasteProbability = Math.max(10, Math.min(95, intercasteProbability));

  let recommendation: MarriagePrediction["marriageType"]["recommendation"] = "Love-cum-Arranged (Self-Choice with Family Approval)";
  if (loveScore >= 58 && arrangedScore >= 52) {
    recommendation = "Love-cum-Arranged (Self-Choice with Family Approval)";
  } else if (loveScore >= 60 && loveScore > arrangedScore + 6) {
    recommendation = "Love Marriage";
  } else if (arrangedScore >= 60 && arrangedScore > loveScore + 6) {
    recommendation = "Arranged Marriage";
  } else {
    recommendation = "Love-cum-Arranged (Self-Choice with Family Approval)";
  }

  const isIntercasteLikely = intercasteProbability >= 50;

  const marriageType: MarriagePrediction["marriageType"] = {
    recommendation,
    loveScore,
    arrangedScore,
    isIntercasteLikely,
    intercasteProbability,
    keyIndicators,
  };

  // Relationship advice & harmony rating
  const sav7 = kundli.ashtakavarga?.sav?.byHouse[6] ?? 28;
  let maritalHarmonyRating: MarriagePrediction["maritalHarmonyRating"] = "Good";
  const relationshipAdvice: string[] = [];

  if (sav7 < 24) {
    maritalHarmonyRating = "Needs Caution";
    relationshipAdvice.push("7th house has low Ashtakavarga bindus: Maintain clear, transparent communication and avoid unrealistic expectations.");
    relationshipAdvice.push("Avoid merging 100% of commercial/business operations with in-laws or spouse; keep financial roles clearly defined.");
  } else if (sav7 >= 28) {
    maritalHarmonyRating = "Very Good";
    relationshipAdvice.push("Favorable Ashtakavarga support in 7th house fosters lasting mutual respect and teamwork.");
  } else {
    maritalHarmonyRating = "Good";
  }

  if (isIntercasteLikely) {
    relationshipAdvice.push("Open communication between both families will smoothly bridge any cultural or community differences.");
  }
  relationshipAdvice.push("Match horoscopes (Kundli Milan) with emphasis on Nadi and Bhakoot kootas before finalizing marriage.");
  relationshipAdvice.push("Marriage after age 25 brings greater emotional maturity and financial stability.");

  // --- Spouse Age Difference (+ / - Age Gap) Calculation ---
  let ageWeight = 0;
  const ageReasons: string[] = [];

  if (planetsIn7.includes("Saturn")) {
    ageWeight += 3;
    ageReasons.push("Saturn in 7th House: Strong classical indicator of a mature spouse or notable age difference (+2 to +5 years).");
  }
  if (saturnHouse === 5 && house7?.number === 7) {
    ageWeight += 1.5;
    ageReasons.push("Saturn aspecting 7th House: Imparts seriousness, emotional stability, and mature demeanor to spouse.");
  }
  if (lord7 === "Saturn") {
    ageWeight += 2;
    ageReasons.push("7th Lord is Saturn: Partner tends to be older or carries higher professional and emotional maturity.");
  }

  if (planetsIn7.includes("Mercury")) {
    ageWeight -= 2.5;
    ageReasons.push("Mercury in 7th House: Mercury (Kumar) indicates a younger partner with youthful, lively demeanor.");
  }
  if (lord7 === "Mercury") {
    ageWeight -= 2;
    ageReasons.push("7th Lord is Mercury: High likelihood of spouse being 2 to 4 years younger.");
  }

  if (planetsIn7.includes("Venus")) {
    ageWeight -= 1;
    ageReasons.push("Venus in 7th House: Indicates peer age or slightly younger spouse (within 1 to 2 years).");
  }
  if (planetsIn7.includes("Moon")) {
    ageWeight -= 1;
    ageReasons.push("Moon in 7th House: Emotional peer age or 1 to 2 years younger.");
  }
  if (planetsIn7.includes("Jupiter")) {
    ageWeight += 1;
    ageReasons.push("Jupiter in 7th House: Well-balanced maturity, dignified wisdom, and traditional gap.");
  }
  if (planetsIn7.includes("Rahu")) {
    ageReasons.push("Rahu in 7th House: Unconventional age difference (can create wider gap outside standard norms).");
  }

  let relativeAge: MarriagePrediction["spouseAgeDifference"]["relativeAge"] = "Similar Age (Peer)";
  let estimatedDifferenceYears = "-1 to -3 years younger";
  let minGapYears = 1;
  let maxGapYears = 3;
  let partnerIsOlder = false;

  if (planetsIn7.includes("Saturn") || (lord7 === "Saturn" && planetsIn7.includes("Rahu"))) {
    relativeAge = "Older";
    partnerIsOlder = true;
    minGapYears = 1;
    maxGapYears = 4;
    estimatedDifferenceYears = "+1 to +4 years older (or notable age gap / career seniority)";
  } else if (planetsIn7.includes("Mercury") || lord7 === "Mercury") {
    relativeAge = "Younger";
    partnerIsOlder = false;
    minGapYears = 2;
    maxGapYears = 4;
    estimatedDifferenceYears = "-2 to -4 years younger (youthful persona)";
  } else if (ageWeight > 1) {
    relativeAge = "Similar Age (Peer)";
    partnerIsOlder = false;
    minGapYears = 0;
    maxGapYears = 2;
    estimatedDifferenceYears = "Similar age (0 to -2 years younger / peer age with high mental maturity & wisdom)";
  } else {
    relativeAge = "Younger";
    partnerIsOlder = false;
    minGapYears = 1;
    maxGapYears = 3;
    estimatedDifferenceYears = "-1 to -3 years younger";
  }

  const ageReason = ageReasons.length > 0
    ? ageReasons.join(" ")
    : "Influences of 7th house and its rulers indicate standard contemporary age difference.";

  const spouseAgeDifference: MarriagePrediction["spouseAgeDifference"] = {
    relativeAge,
    estimatedDifferenceYears,
    minGapYears,
    maxGapYears,
    partnerIsOlder,
    reason: ageReason,
  };

  return {
    maritalHarmonyRating,
    favorableAgeRange,
    predictedTimingYears: sortedYears.length > 0 ? sortedYears : [currentYear + 2, currentYear + 3],
    currentDashaFavorableForMarriage: currentDashaFavorable,
    dashaSupportExplanation,
    partnerCharacteristics: {
      nature: partnerInfo.nature,
      dominantTraits: partnerInfo.traits,
      directionOrBackground: partnerInfo.direction,
    },
    marriageType,
    mangalDosha,
    spouseAgeDifference,
    relationshipAdvice,
  };
}
