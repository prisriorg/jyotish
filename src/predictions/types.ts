import { Language } from '../i18n/types';

export interface PredictionOptions {
  lang?: Language;
  /** Date used for time-sensitive predictions; defaults to now. */
  asOf?: Date;
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
  d10Insight?: string;
  karakamshaInsight?: string;
  arudhaInsight?: string;
  governmentJobLikelihood?: {
    likelihood: 'High' | 'Moderate' | 'Low' | (string & {});
    score: number; // 0 - 100
    description: string;
  };
  careerGrowthTrajectory?: {
    growthVelocity: string;
    peakCareerAgeWindows: string[];
    growthFactors: string[];
  };
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
  induLagnaInsight?: string;
  induLagnaDetails?: {
    rashi: string;
    rashiLord: string;
    occupants: string[];
    wealthMagnitude: string;
  };
  arudhaWealthInsight?: string;
  propertyAndRealEstate?: {
    potential: 'High / Multiple Properties' | 'Moderate / Steady Acquisition' | 'Cautious / Delays Likely' | (string & {});
    description: string;
  };
  speculativeAndInvestment?: {
    potential: 'Favorable / High Return Potential' | 'Moderate / Long-term Balanced' | 'High Risk / Strictly Avoid Speculation' | (string & {});
    description: string;
  };
  daridraYogas?: string[];
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
  upapadaLagnaInsight?: string;
  navamshaSpouseInsight?: string;
  maritalStabilityRating?: 'High Stability & Concord' | 'Balanced with Periodic Adjustments' | 'Challenging / Shastric Remedies Recommended' | (string & {});
  darapadaInsight?: string;
  vivahaVilambaFactors?: {
    hasDelay: boolean;
    delayYearsEstimate?: number;
    causes: string[];
    mitigation: string;
  };
  upapadaLagnaDetails?: {
    rashi: string;
    lord: string;
    secondFromUlRashi: string;
    secondFromUlOccupants: string[];
    sustenanceVerdict: string;
  };
  navamshaSpouseDetails?: {
    d9House7Rashi: string;
    d9House7Lord: string;
    d9House7Occupants: string[];
    venusD9Dignity: string;
    explanation: string;
  };
  spouseCareerAndBackground?: {
    probableProfessions: string[];
    financialStatus: string;
    socialStanding: string;
  };
  remediesForMarriage?: {
    name: string;
    mantraOrAction: string;
    purpose: string;
  }[];
}

export interface HealthPrediction {
  healthScore: number; // 0 - 100
  healthRating: 'Robust & Vibrant' | 'Good with Minor Sensitivities' | 'Moderate / Routine Care Needed' | 'Vulnerable / Medical Vigilance Advised' | (string & {});
  vitalityAndImmunity: string;
  longevityAssessment: {
    category: 'Deerghayu (Long Life: 75+ yrs)' | 'Madhyayu (Medium Life: 50-75 yrs)' | 'Alpayu (Caution: <50 yrs)' | (string & {});
    description: string;
    astrologicalBasis: string;
  };
  badhakaSthana: {
    house: number;
    lord: string;
    lagnaType: 'Movable (Chara)' | 'Fixed (Sthira)' | 'Dual (Dwisvabhava)' | (string & {});
    impact: string;
  };
  marakaPlanets: {
    primaryMarakas: string[];
    secondaryMarakas: string[];
    explanation: string;
  };
  ayurvedicConstitution: {
    primaryDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic' | (string & {});
    explanation: string;
    dietLifestyleRecommendations: string[];
  };
  organVulnerabilities: {
    organOrSystem: string;
    rulingPlanetOrHouse: string;
    severity: 'High' | 'Moderate' | 'Mild';
    guidance: string;
  }[];
  criticalAgeWindows: string[];
  remediesAndPrecautions: string[];
}

export interface EducationPrediction {
  intellectRating: 'Genius / Highly Analytical' | 'Strong Academic Acumen' | 'Practical / Applied Intellect' | 'Creative / Non-Traditional' | (string & {});
  academicSuccessScore: number; // 0 - 100
  learningStyle: string;
  recommendedStreams: {
    stream: string;
    suitability: 'Highly Auspicious' | 'Favorable' | 'Secondary';
    astrologicalReason: string;
  }[];
  higherEducationAndResearch: {
    foreignEducationPotential: boolean;
    score: number; // 0 - 100
    description: string;
  };
  competitiveExams: {
    successLikelihood: 'Very High' | 'High' | 'Moderate' | 'Requires Extra Effort' | (string & {});
    keyStrengths: string[];
    advice: string;
  };
  mercuryJupiterSignificance: {
    mercuryImpact: string;
    jupiterImpact: string;
  };
  strategicEducationalAdvice: string[];
}

export interface ProgenyPrediction {
  progenyBlessingScore: number; // 0 - 100
  progenyRating: 'Highly Favorable' | 'Favorable with Minor Delay' | 'Challenging / Remedial Support Advised' | 'Needs Deep Astrological Consultation' | (string & {});
  fifthHouseDetails: {
    rashi: string;
    lord: string;
    lordPlacementHouse: number;
    planetsIn5th: string[];
    savBindus: number;
  };
  jupiterStrengthVerdict: string;
  putraDosha: {
    hasDosha: boolean;
    type?: string;
    description: string;
    remedies: string[];
  };
  saptamshaD7Insight?: string;
  favorableConceptionWindows: string[];
  childrenTraits: string[];
  remedies: string[];
}

export interface YogasAndDoshasReport {
  summaryVerdict: string;
  totalYogasDetected: number;
  totalDoshasDetected: number;
  rajaYogas: {
    name: string;
    planets: string[];
    description: string;
    strength: 'Very Strong' | 'Strong' | 'Moderate';
  }[];
  dhanaYogas: {
    name: string;
    planets: string[];
    description: string;
    strength: 'Very Strong' | 'Strong' | 'Moderate';
  }[];
  mahapurushaYogas: {
    name: string;
    planet: string;
    description: string;
  }[];
  specialAuspiciousYogas: {
    name: string;
    description: string;
  }[];
  vipreetRajYogas: {
    name: string;
    type: 'Harsha' | 'Sarala' | 'Vimala';
    description: string;
  }[];
  inauspiciousDoshas: {
    name: string;
    hasDosha: boolean;
    isCancelled?: boolean;
    cancellationReason?: string;
    severity: 'High' | 'Moderate' | 'Mild' | 'None';
    description: string;
    remedy: string;
  }[];
  kaalSarpDosha: {
    hasDosha: boolean;
    type?: string;
    isFull: boolean;
    isCancelled: boolean;
    cancellationReason?: string;
    description: string;
    remedy: string;
  };
  kemadrumaYoga: {
    hasYoga: boolean;
    isCancelled: boolean;
    cancellationReason?: string;
    description: string;
    remedy?: string;
  };
}

export interface DashaTimelinePrediction {
  currentMahadasha: {
    planet: string;
    startDate: string;
    endDate: string;
    nature: string;
    lordOfHouses: number[];
    placementHouse: number;
    prediction: string;
  };
  currentAntardasha: {
    planet: string;
    startDate: string;
    endDate: string;
    prediction: string;
  };
  currentPratyantardasha?: {
    planet: string;
    startDate: string;
    endDate: string;
  };
  currentPeriodThemes: {
    career: string;
    wealth: string;
    relationships: string;
    health: string;
  };
  upcomingMajorPeriods: {
    planet: string;
    periodSpan: string;
    keyForecast: string;
  }[];
  criticalMilestoneAges: {
    age: number;
    astrologicalCycle: string;
    significance: string;
  }[];
}

export interface TransitPredictions {
  saturnTransit: {
    currentSign: string;
    houseFromMoon: number;
    isSadeSati: boolean;
    sadeSatiPhase?: '1st Phase (Rising - 12th from Moon)' | '2nd Phase (Peak / Janma - 1st from Moon)' | '3rd Phase (Setting - 2nd from Moon)' | (string & {});
    isKantakaShani: boolean;
    isAshtamaShani: boolean;
    prediction: string;
    remedy?: string;
  };
  jupiterTransit: {
    currentSign: string;
    houseFromMoon: number;
    hasGuruBalam: boolean;
    blessings: string;
    prediction: string;
  };
  rahuKetuTransit: {
    rahuSign: string;
    ketuSign: string;
    rahuHouseFromMoon: number;
    ketuHouseFromMoon: number;
    prediction: string;
  };
  overallTransitScore: number; // 0 - 100
  summary: string;
}

export interface ComprehensiveReport {
  summary: string;
  career: CareerPrediction;
  wealth: WealthPrediction;
  marriage: MarriagePrediction;
  health: HealthPrediction;
  education: EducationPrediction;
  progeny: ProgenyPrediction;
  yogas: YogasAndDoshasReport;
  dashaTimeline: DashaTimelinePrediction;
  transits: TransitPredictions;
  remedies: RemediesPrediction;
  chalitAnalysis: ChalitAnalysis;
  kpAnalysis: KpAnalysis;
  lalKitabAnalysis: LalKitabAnalysis;
  jaiminiKarakas: JaiminiKarakas;
  gemstones?: GemstoneReport;
  growth?: GrowthPrediction;
  formattedMarkdown: string;
}

export interface GrowthPrediction {
  overallGrowthVelocity: 'Fast-Paced & Exponential' | 'High-Trajectory & Steadily Compounding' | 'Progressive with Cyclical Leaps' | 'Late-Blooming High Zenith' | (string & {});
  growthScore: number; // 0 - 100 overall composite growth index
  careerGrowthScore: number; // 0 - 100
  financialGrowthScore: number; // 0 - 100
  entrepreneurialGrowthScore: number; // 0 - 100
  growthArchetype: {
    title: string;
    description: string;
    keyStrengths: string[];
  };
  keyGrowthDrivers: {
    driver: string;
    planetaryBasis: string;
    impact: string;
  }[];
  growthBlockersAndFriction: {
    challenge: string;
    astrologicalSource: string;
    mitigationStrategy: string;
  }[];
  lifeGrowthRoadmap: {
    ageSpan: string;
    phaseName: string;
    focusArea: string;
    astrologicalCycle: string;
    growthAction: string;
  }[];
  upcomingPeakGrowthPeriods: {
    periodSpan: string;
    dashaPlanets: string;
    growthTheme: string;
    favorableInitiatives: string[];
  }[];
  growthSectorsAndDomains: string[];
  strategicGrowthAccelerators: string[];
  astrologicalRemediesForGrowth: {
    remedy: string;
    purpose: string;
  }[];
  d10DashamshaGrowthInsight?: string;
  amatyakarakaGrowthInsight?: string;
  induLagnaWealthGrowthInsight?: string;
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

export interface GemstoneDashaTiming {
  applicableDasha: string;
  applicableDashaHi: string;
  startDate?: string;
  endDate?: string;
  isActiveNow: boolean;
  wearingWindow: string;
  wearingWindowHi: string;
  removalInstructions: string;
  removalInstructionsHi: string;
}

export type LifeAreaCategory = "wealth" | "career" | "marriage" | "health" | "education";
export type LifeAreaImpactType = "positive" | "negative" | "mixed" | "neutral";

export interface GemstoneLifeAreaImpact {
  area: LifeAreaCategory;
  areaNameEn: string;
  areaNameHi: string;
  impact: LifeAreaImpactType;
  effectEn: string;
  effectHi: string;
  astrologicalReasonEn: string;
  astrologicalReasonHi: string;
}

export interface GemstoneAdverseAlert {
  whatWillHarmEn: string;
  whatWillHarmHi: string;
  whyItHarmsEn: string;
  whyItHarmsHi: string;
  affectedHouses: number[];
}

export interface GemstoneBeneficHighlights {
  whatWillFlourishEn: string;
  whatWillFlourishHi: string;
  whyItFlourishesEn: string;
  whyItFlourishesHi: string;
  benefitedHouses: number[];
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
    dignityVerdict?: string;
    bnnVerdict?: string;
    moolatrikonaVerdict?: string;
    ashtakavargaVerdict?: string;
  };
  timing?: GemstoneDashaTiming;
  lifeAreaImpacts?: GemstoneLifeAreaImpact[];
  adverseAlert?: GemstoneAdverseAlert;
  beneficHighlights?: GemstoneBeneficHighlights;
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

