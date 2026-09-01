import { PlanetaryPosition, DashaResult } from '../core/types';
import { KpChart } from './kp-types';

export * from './kp-types';

/**
 * Represents a single House (Bhava) in the Kundli.
 */
export interface Bhava {
    number: number;         // 1 to 12
    rashi: number;          // Rashi at the cusp/start of the house (1=Aries, 12=Pisces)
    longitude: number;      // Longitude of the cusp (0-360)
    madhyaLongitude?: number; // Center of the house (for Sripati Bhava Chalit)
    startLongitude: number; // Start degree of the house (for Chalit/Sandhi)
    endLongitude: number;   // End degree of the house (Sandhi with next house)
    span?: number;          // House span in degrees
    planets: string[];      // Names of planets residing in this house
}

/**
 * Configuration options for Kundli generation.
 */
export interface KundliConfig {
    houseSystem?: 'whole_sign' | 'equal_house' | 'placidus' | 'sripati'; // Default: whole_sign
    ayanamsa?: 'lahiri' | 'raman' | 'kp'; // Default: lahiri
    lang?: 'en' | 'hi'; // Default: en (future implementation)
    includeChalit?: boolean; // If true, attaches chalit chart to Kundli
    includeKp?: boolean;     // If true, attaches KP chart to Kundli
    gender?: 'male' | 'female' | 'other'; // Native's gender (optional)
}

/**
 * The complete Janam Kundli (Horoscope) object.
 */
import { DrishtiResult } from './drishti';
import { AshtakavargaResult } from '../ashtakavarga';
export * from './drishti';
export * from '../ashtakavarga';

export interface Kundli {
    // Basic Details
    birthDetails: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        timezone: number; // Offset in minutes
        rawDate?: Date;
        gender?: 'male' | 'female' | 'other';
        age: {
            years: number;
            months: number;
            days: number;
            hours: number;
            minutes: number;
            seconds: number;
            totalMonths: number;
            totalDays: number;
            totalHours: number;
            totalMinutes: number;
            totalSeconds: number;
        };
    };

    // Lagna (Ascendant)
    ascendant: {
        rashi: number;
        rashiName: string;
        rashiLord?: string;
        longitude: number;
        degree?: number;
        minute?: number;
        second?: number;
        nakshatra: string;
        nakshatraLord?: string;
        pada: number;
    };

    // Planetary Positions
    planets: Record<string, PlanetaryPosition>;

    // Houses (Bhavas)
    houses: Bhava[];
    dasha: DashaResult;
    vargas?: Record<string, VargaChart>;
    chalit?: ChalitChart;
    kp?: KpChart;
    drishti?: DrishtiResult;
    ashtakavarga?: AshtakavargaResult;
}

export interface VargaChart {
    ascendant: {
        rashi: number;
        rashiName: string;
    };
    planets: Record<string, {
        rashi: number;
        rashiName: string;
    }>;
    houses: Bhava[];
}

/**
 * Represents a planet's position in the Chalit Chart (Bhava Chalit).
 * Shows the exact position of a planet within its house and any house shifts.
 */
export interface ChalitPlanet {
    name: string;                  // Planet name (e.g., "Sun", "Moon")
    longitude: number;             // Exact sidereal longitude (0-360)
    degree: number;                // Degrees within the rashi (0-29)
    minute: number;                // Minutes (0-59)
    second: number;                // Seconds (0-59)
    rashi: number;                  // Rashi index (0-11)
    rashiName: string;              // Rashi name
    rashiHouse?: number;            // House number in D1 (Rashi) chart (1-12)
    house: number;                 // House number in Chalit chart (1-12)
    shifted?: number;              // -1: shifted backward, 0: same house, +1: shifted forward
    housePosition: number;          // Position within the house (degrees into house)
    housePositionDegree: number;    // Degrees into the house
    housePositionMinute: number;    // Minutes into the house
    percentage?: number;            // Percentage progressed into the house (0-100%)
    isRetrograde?: boolean;         // Is planet retrograde
    isCombust?: boolean;            // Is planet combust
}

/**
 * A detailed Bhava in the Chalit Chart with Madhya (midpoint) and Sandhi (boundaries).
 */
export interface ChalitBhava {
    houseNumber: number;            // 1 to 12
    madhyaLongitude: number;        // Center of the house (Bhava Madhya)
    madhyaDegree: number;           // Degree within rashi (0-29)
    madhyaMinute: number;           // Minutes
    madhyaSecond: number;           // Seconds
    startLongitude: number;         // House starting Sandhi (Bhava Arambha)
    endLongitude: number;           // House ending Sandhi (Bhava Anta)
    span: number;                   // Span of house in degrees
    rashi: number;                  // Rashi number (1-12)
    rashiName: string;              // Rashi name
    planets: string[];              // Planets residing in this Bhava
}

/**
 * Represents the complete Chalit Chart (Bhava Chalit / Sphuta Chart).
 */
export interface ChalitChart {
    system?: 'sripati' | 'equal_house';
    ascendant: {
        rashi: number;
        rashiName: string;
        longitude: number;
        degree?: number;
        minute?: number;
        second?: number;
    };
    planets: ChalitPlanet[];
    housesCusps: {
        houseNumber: number;
        startLongitude: number;
        endLongitude: number;
        rashi: number;
        rashiName: string;
    }[];
    bhavas?: ChalitBhava[];
}

