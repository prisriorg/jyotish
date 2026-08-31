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

  relationshipAdvice.push("Match horoscopes (Kundli Milan) with emphasis on Nadi and Bhakoot kootas before finalizing marriage.");
  relationshipAdvice.push("Marriage after age 25 brings greater emotional maturity and financial stability.");

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
    mangalDosha,
    relationshipAdvice,
  };
}
