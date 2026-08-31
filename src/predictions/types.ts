export interface CareerPrediction {
  recommendation: 'Business & Independent Enterprise' | 'Employment / Job' | 'Hybrid / Consulting & Freelance';
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
  leadershipCapacity: 'Executive / High Authority' | 'Mid-to-Senior Leadership' | 'Individual Contributor / Specialist';
  strategicAdvice: string[];
  tenthLordPlacementResult?: string;
  amatyakarakaInsight?: string;
  panchaMahapurushaYoga?: string;
  chalitInsight?: string;
  kpInsight?: string;
  lalKitabInsight?: string;
}

export interface WealthPrediction {
  wealthRating: 'Exceptional' | 'High' | 'Moderate' | 'Fluctuating';
  incomePotential: number; // 0 - 100 scale
  savingCapacity: 'Strong' | 'Average' | 'Challenging';
  savMetrics: {
    incomeHouse11Bindus: number;
    expenditureHouse12Bindus: number;
    wealthHouse2Bindus: number;
    surplusRatio: number; // 11th minus 12th
  };
  dhanaYogas: {
    name: string;
    description: string;
    strength: 'Powerful' | 'Moderate';
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
  maritalHarmonyRating: 'Very Good' | 'Good' | 'Average' | 'Needs Caution';
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
    recommendation: 'Love Marriage' | 'Arranged Marriage' | 'Love-cum-Arranged (Self-Choice with Family Approval)';
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
    relativeAge: 'Younger' | 'Older' | 'Similar Age (Peer)';
    estimatedDifferenceYears: string;
    minGapYears: number;
    maxGapYears: number;
    partnerIsOlder: boolean;
    reason: string;
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
  remedyType: 'Practical / Behavioral' | 'Mantra' | 'Lifestyle' | 'Charity / Donation';
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
    shiftDirection: 'Forward (+1)' | 'Backward (-1)';
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
  tevaType: 'Dharmi Teva (Blessed / Auspicious)' | 'Aam Teva (Standard)' | 'Paapi Teva (Challenging)';
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
  formattedMarkdown: string;
}

