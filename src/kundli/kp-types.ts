/**
 * Configuration options for KP Chart generation.
 */
export interface KpConfig {
  ayanamsa?: "kp" | "lahiri" | "raman"; // Default: 'kp'
  includeSignificators?: boolean; // Default: true
  includeRulingPlanets?: boolean; // Default: true
}

/**
 * Details of a Placidus house cusp in KP system.
 */
export interface KpCusp {
  houseNumber: number; // 1 to 12
  longitude: number; // Sidereal longitude (0-360)
  degree: number; // Degrees in sign (0-29)
  minute: number; // Minutes (0-59)
  second: number; // Seconds (0-59)
  rashi: number; // Sign number (1-12)
  rashiName: string; // Sign name (Aries, Taurus, etc.)
  rashiLord: string; // Sign lord (Mars, Venus, etc.)
  nakshatra: number; // Nakshatra number (1-27)
  nakshatraName: string; // Nakshatra name
  nakshatraLord: string; // Star lord (Ketu, Venus, etc.)
  subLord: string; // KP Sub-Lord
  subSubLord: string; // KP Sub-Sub-Lord
  startLongitude: number; // Starting degree of this house (equal to cusp longitude)
  endLongitude: number; // Ending degree of this house (cusp of next house)
  span: number; // House span in degrees
  planets: string[]; // Names of planets placed in this house
}

/**
 * Planetary position with 4-fold KP rulers and Placidus house allocation.
 */
export interface KpPlanet {
  name: string; // Planet name (Sun, Moon, Mars, etc.)
  longitude: number; // Exact sidereal longitude (0-360)
  degree: number; // Degrees in sign (0-29)
  minute: number; // Minutes (0-59)
  second: number; // Seconds (0-59)
  rashi: number; // Sign number (1-12)
  rashiName: string; // Sign name
  rashiLord: string; // Sign lord
  nakshatra: number; // Nakshatra number (1-27)
  nakshatraName: string; // Nakshatra name
  nakshatraLord: string; // Star lord
  subLord: string; // KP Sub-Lord
  subSubLord: string; // KP Sub-Sub-Lord
  house: number; // House number (1-12) based on Placidus cusps
  housePosition: number; // Degrees progressed into the house
  housePositionDegree: number; // Floor degrees into the house
  housePositionMinute: number; // Minutes into the house
  isRetrograde: boolean; // True if planet is in retrograde motion
  isCombust: boolean; // True if planet is combust with Sun
  speed?: number; // Daily motion speed in degrees
}

/**
 * A single House in the KP Chart.
 */
export interface KpHouse {
  houseNumber: number;
  cusp: KpCusp;
  planets: string[];
}

/**
 * 4-level KP House Significators:
 * - Level A: Planet in constellation of occupant of the house (Strongest)
 * - Level B: Planet occupying the house
 * - Level C: Planet in constellation of lord of the house
 * - Level D: Lord of the house
 */
export interface KpHouseSignificator {
  houseNumber: number;
  levelA: string[];
  levelB: string[];
  levelC: string[];
  levelD: string[];
}

/**
 * Planetary Significators: which houses each planet signifies across levels A, B, C, D.
 */
export interface KpPlanetSignificator {
  planetName: string;
  levelA: number[];
  levelB: number[];
  levelC: number[];
  levelD: number[];
  allHouses: number[]; // Combined unique houses sorted
}

/**
 * Complete set of KP Significators for all 12 houses and all planets.
 */
export interface KpSignificators {
  houses: Record<number, KpHouseSignificator>;
  planets: Record<string, KpPlanetSignificator>;
}

/**
 * KP Ruling Planets (RP) at birth or query moment.
 */
export interface KpRulingPlanets {
  ascendant: {
    rashiLord: string;
    nakshatraLord: string;
    subLord: string;
  };
  moon: {
    rashiLord: string;
    nakshatraLord: string;
    subLord: string;
  };
  dayLord: string;
  rulingPlanetsList: string[]; // Unique ordered list of primary ruling planets
}

/**
 * Complete KP Chart (Krishnamurti Paddhati) data object.
 */
export interface KpChart {
  birthDetails: {
    date: string;
    time: string;
    lat: number;
    lon: number;
    timezone: number;
  };
  ayanamsa: number;
  ayanamsaName: string;
  ascendant: KpCusp;
  midheaven: {
    longitude: number;
    degree: number;
    minute: number;
    second: number;
    rashi: number;
    rashiName: string;
    rashiLord: string;
    nakshatraName: string;
    nakshatraLord: string;
    subLord: string;
  };
  cusps: KpCusp[];
  planets: Record<string, KpPlanet>;
  houses: KpCusp[];
  significators?: KpSignificators;
  rulingPlanets?: KpRulingPlanets;
}
