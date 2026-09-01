import { SadeSatiResult, DhaiyaResult } from '../core/sadesati';
import { ChandrashtamaInfo } from '../core/chandrashtama';

export type GocharBeneficStatus = 'Favorable' | 'Obstructed' | 'Unfavorable';

export interface TransitPlanetInfo {
  planet: string;
  longitude: number;
  rashi: number; // 1 to 12
  rashiName: string;
  degree: number;
  minute: number;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  isRetrograde: boolean;
  
  // Transit houses
  houseFromMoon: number; // 1 to 12
  houseFromLagna: number; // 1 to 12

  // Gochar Phala
  isFavorableFromMoon: boolean;
  hasVedha: boolean;
  vedhaCausedBy?: string; // e.g. "Mars in 12th house causes Vedha"
  netStatus: GocharBeneficStatus;
  prediction: string;
  savBindusInHouse?: number; // Ashtakavarga SAV bindus in the transited house
}

export interface GocharSpecialTransits {
  sadeSati: SadeSatiResult;
  dhaiya: DhaiyaResult;
  chandrashtama: ChandrashtamaInfo;
  guruGochar: {
    houseFromMoon: number;
    status: 'Favorable' | 'Unfavorable';
    blessingSummary: string;
    aspectHousesFromMoon: number[]; // e.g. 5th, 7th, 9th aspects
  };
  rahuKetuAxis: {
    rahuHouseFromMoon: number;
    ketuHouseFromMoon: number;
    karmicImpact: string;
  };
}

export interface LifeAreaGocharImpact {
  career: {
    rating: 'Favorable' | 'Mixed' | 'Challenging';
    summary: string;
  };
  wealth: {
    rating: 'Favorable' | 'Mixed' | 'Challenging';
    summary: string;
  };
  relationships: {
    rating: 'Favorable' | 'Mixed' | 'Challenging';
    summary: string;
  };
  health: {
    rating: 'Favorable' | 'Mixed' | 'Challenging';
    summary: string;
  };
}

export interface GocharAnalysisResult {
  transitDate: Date;
  natalMoonRashi: number; // 1 to 12
  natalMoonRashiName: string;
  natalLagnaRashi: number; // 1 to 12
  natalLagnaRashiName: string;
  overallFavorablePercentage: number; // 0 to 100
  overallVerdict: 'Highly Favorable' | 'Favorable' | 'Mixed / Moderate' | 'Caution Required';
  planets: Record<string, TransitPlanetInfo>;
  specialTransits: GocharSpecialTransits;
  lifeAreas: LifeAreaGocharImpact;
  actionableAdvice: string[];
  formattedSummary: string;
}
