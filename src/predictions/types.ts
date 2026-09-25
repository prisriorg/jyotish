import { Language } from '../i18n/types';

export interface PredictionOptions {
  lang?: Language;
}

export interface CareerPrediction {
  recommendation: 'Business & Independent Enterprise' | 'Employment / Job' | 'Hybrid / Consulting & Freelance' | (string & {});
  jobScore: number;       // 0 - 100
  businessScore: number;  // 0 - 100
  dominantTraits: string[];
  suitableFields: string[];
  tenthHouseDetails: {
    rashi: string;
    rashiLord: string;
    lordPlacementHouse: number;
    planetsIn10th: string[];
    savBindus: number;
  };
  leadershipCapacity: 'Executive / High Authority' | 'Mid-to-Senior Leadership' | 'Individual Contributor / Specialist' | (string & {});
  strategicAdvice: string[];
  tenthLordPlacementResult?: string;
  amatyakarakaInsight?: string;
  panchaMahapurushaYoga?: string;
  chalitInsight?: string;
  kpInsight?: string;
  lalKitabInsight?: string;
}

export interface WealthPrediction {
  wealthRating: 'Exceptional' | 'High' | 'Moderate' | 'Fluctuating' | (string & {});
  incomePotential: number; // 0 - 100 scale
  savingCapacity: 'Strong' | 'Average' | 'Challenging' | (string & {});
  savMetrics: {
    incomeHouse11Bindus: number;
    expenditureHouse12Bindus: number;
    wealthHouse2Bindus: number;
    surplusRatio: number; // 11th minus 12th
  };
  dhanaYogas: {
    name: string;
    description: string;
    strength: 'Powerful' | 'Moderate' | (string & {});
  }[];
  vipreetRajYogas?: string[];
  secondLordPlacementResult?: string;
  eleventhLordPlacementResult?: string;
  bestWealthSources: string[];
  financialCautions: string[];
  chalitInsight?: string;
  kpInsight?: string;
  lalKitabInsight?: string;
}

export interface MarriagePrediction {
  maritalHarmonyRating: 'Very Good' | 'Good' | 'Average' | 'Needs Caution' | (string & {});
  favorableAgeRange: string;
  predictedTimingYears: number[];
  currentDashaFavorableForMarriage: boolean;
  dashaSupportExplanation: string;
  partnerCharacteristics: {
    nature: string;
    dominantTraits: string[];
    directionOrBackground: string;
  };
  marriageType: {
    recommendation: 'Love Marriage' | 'Arranged Marriage' | 'Love-cum-Arranged (Self-Choice with Family Approval)' | (string & {});
    loveScore: number;     // 0 - 100
    arrangedScore: number; // 0 - 100
    isIntercasteLikely: boolean;
    intercasteProbability: number; // 0 - 100%
    keyIndicators: string[];
  };
  mangalDosha: {
    hasDosha: boolean;
    isCancelled: boolean;
    description: string;
  };
  spouseAgeDifference: {
    relativeAge: 'Younger' | 'Older' | 'Similar Age (Peer)' | (string & {});
    estimatedDifferenceYears: string;
    minGapYears: number;
    maxGapYears: number;
    partnerIsOlder: boolean;
    reason: string;
    maturityLevel: 'High / Senior Demeanor' | 'Balanced / Peer-Level' | 'Youthful / Energetic' | (string & {});
    unconventionalGapLikely?: boolean;
    genderPerspective?: {
      ifMaleNative: string;
      ifFemaleNative: string;
    };
  };
  relationshipAdvice: string[];
  seventhLordPlacementResult?: string;
  darakarakaInsight?: string;
  chalitInsight?: string;
  kpInsight?: string;
  lalKitabInsight?: string;
}

export interface RemedyItem {
  area: string;
  house?: number;
  reason: string;
  remedyType: 'Practical / Behavioral' | 'Mantra' | 'Lifestyle' | 'Charity / Donation' | (string & {});
  title: string;
  instructions: string;
}

export interface RemediesPrediction {
  weakHousesIdentified: {
    house: number;
    rashi: string;
    bindus: number;
    impact: string;
  }[];
  practicalDoAndDonts: {
    dos: string[];
    donts: string[];
  }[];
  mantras: {
    deity: string;
    mantra: string;
    count: string;
    benefit: string;
  }[];
  lifestyleHabits: string[];
  remedyList: RemedyItem[];
  lalKitabRemedies?: {
    area: string;
    remedy: string;
    caution: string;
  }[];
}

export interface ChalitAnalysis {
  shiftedPlanets: {
    planet: string;
    d1House: number;
    chalitBhava: number;
    shiftDirection: 'Forward (+1)' | 'Backward (-1)' | (string & {});
    impact: string;
  }[];
  actualHouseOccupants: Record<number, string[]>;
  keyBhavaInsights: string[];
}

export interface KpAnalysis {
  cuspSubLords: {
    cuspNumber: number;
    subLord: string;
    starLord: string;
  }[];
  careerCusp10: {
    subLord: string;
    starLord: string;
    significationVerdict: string;
  };
  marriageCusp7: {
    subLord: string;
    starLord: string;
    marriagePromise: string;
    typeIndication: string;
  };
  wealthCusps: {
    cusp2SubLord: string;
    cusp11SubLord: string;
    financialSignification: string;
  };
}

export interface LalKitabAnalysis {
  tevaType: 'Dharmi Teva (Blessed / Auspicious)' | 'Aam Teva (Standard)' | 'Paapi Teva (Challenging)' | (string & {});
  kismatKaGrah: {
    planet: string;
    house: number;
    role: string;
  };
  sleepingHouses: number[];
  awakenedHouses: number[];
  specialYogas: {
    name: string;
    planets: string[];
    house: number;
    effect: string;
  }[];
  karmicDebts: {
    debtType: string;
    isAfflicted: boolean;
    description: string;
    remedy: string;
  }[];
  lalKitabRemedies: {
    area: string;
    remedy: string;
    caution: string;
  }[];
}

export interface KarakaInfo {
  planet: string;
  degreeInSign: number;
  formattedDegree: string;
  rashiName: string;
  house: number;
  role: string;
  signification: string;
}

export interface JaiminiKarakas {
  atmakaraka: KarakaInfo;
  amatyakaraka: KarakaInfo;
  bhratrikaraka: KarakaInfo;
  matrikaraka: KarakaInfo;
  putrakaraka: KarakaInfo;
  gnatikaraka: KarakaInfo;
  darakaraka: KarakaInfo;
}

export type GemstoneSuitability = 'recommended' | 'conditional' | 'prohibited';

export type GemstoneCategory =
  | 'life_stone'         // 1st Lord (Lagnesh)
  | 'lucky_stone'        // 9th Lord (Bhagyesh)
  | 'knowledge_stone'    // 5th Lord (Panchamesh)
  | 'career_stone'       // 10th Lord (Karmesh / Yoga Karaka)
  | 'conditional_dasha'  // Mahadasha / Trial specific
  | 'prohibited';        // Dusthana / Maraka / KP 6,8,12

export interface GemstoneSpecification {
  weightRatti: string;
  weightCarat: string;
  metal: string;
  finger: string;
  hand: string;
  day: string;
  paksha: string;
  beejMantra: string;
  chantCount: number;
  purificationRitual: string;
  trialPeriodDays?: number;
  uparatna: string[];
}

export interface GemstoneRecommendationItem {
  planet: string;
  gemstoneName: string;
  gemstoneHindiName: string;
  category: GemstoneCategory;
  suitability: GemstoneSuitability;
  score: number; // 0 - 100 overall astrological safety & beneficence score
  reason: string;
  detailedAnalysis: {
    d1LagnaVerdict: string;
    chalitVerdict: string;
    kpVerdict: string;
    navamshaVerdict: string;
    combustionOrRetrograde?: string;
  };
  specifications?: GemstoneSpecification;
  clashingGemstones: string[];
}

export interface GemstoneOptions extends PredictionOptions {
  userWeightKg?: number;
  currentDashaOnly?: boolean;
}

export interface GemstoneReport {
  recommendedStones: GemstoneRecommendationItem[]; // 🟢 Highly beneficial & safe to wear (Life, Lucky, Punya stone)
  conditionalStones: GemstoneRecommendationItem[];  // 🟡 Conditional / Dasha-specific (Wear with caution)
  prohibitedStones: GemstoneRecommendationItem[];   // 🔴 Strictly prohibited / Hazardous ('Never Wear')
  clashingCombinationsWarning: string[];
  summary: string;
  formattedMarkdown: string;
}

export interface ComprehensiveReport {
  summary: string;
  career: CareerPrediction;
  wealth: WealthPrediction;
  marriage: MarriagePrediction;
  remedies: RemediesPrediction;
  chalitAnalysis: ChalitAnalysis;
  kpAnalysis: KpAnalysis;
  lalKitabAnalysis: LalKitabAnalysis;
  jaiminiKarakas: JaiminiKarakas;
  gemstones?: GemstoneReport;
  formattedMarkdown: string;
}

