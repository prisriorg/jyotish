import { PlanetaryPosition, DashaResult } from '../core/types';

/**
 * Represents a single House (Bhava) in the Kundli.
 */
export interface Bhava {
    number: number;         // 1 to 12
    rashi: number;          // Rashi at the cusp/start of the house (0=Aries, 11=Pisces)
    longitude: number;      // Longitude of the cusp (0-360)
    startLongitude: number; // Start degree of the house (for Chalit)
    endLongitude: number;   // End degree of the house
    planets: string[];      // Names of planets residing in this house
}

/**
 * Configuration options for Kundli generation.
 */
export interface KundliConfig {
    houseSystem?: 'whole_sign' | 'equal_house' | 'placidus'; // Default: whole_sign
    ayanamsa?: 'lahiri' | 'raman' | 'kp'; // Default: lahiri (currently only Lahiri supported in Core)
    lang?: 'en' | 'hi'; // Default: en (future implementation)
}

/**
 * The complete Janam Kundli (Horoscope) object.
 */
export interface Kundli {
    // Basic Details
    birthDetails: {
        date: string;
        time: string;
        lat: number;
        lon: number;
        timezone: number; // Offset in minutes? Or just derived from Date object?
        age: {
            years: number
            months: number
            days: number
            hours: number
            minutes: number
            seconds: number
            totalMonths: number
            totalDays: number
            totalHours: number
            totalMinutes: number
            totalSeconds: number
        }
    };

    // Lagna (Ascendant)
    ascendant: {
        rashi: number;
        rashiName: string;
        longitude: number;
        nakshatra: string;
        pada: number;
    };

    // Planetary Positions (Reused from Core, but maybe enriched?)
    planets: Record<string, PlanetaryPosition>;

    // Houses (Bhavas)
    houses: Bhava[];
    dasha: DashaResult;
    vargas?: Record<string, VargaChart>;
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
 * Represents a planet's position in the Chalit Chart.
 * Shows the exact position of a planet within its house.
 */
export interface ChalitPlanet {
    name: string;                  // Planet name (e.g., "Sun", "Moon")
    longitude: number;             // Exact longitude (0-360)
    degree: number;                // Degrees within the rashi (0-29)
    minute: number;                // Minutes (0-59)
    second: number;                // Seconds (0-59)
    house: number;                 // House number (1-12)
    housePosition: number;          // Position within the house (0-30 degrees)
    housePositionDegree: number;    // Degrees into the house
    housePositionMinute: number;    // Minutes into the house
    rashi: number;                  // Rashi number (0-11)
    rashiName: string;              // Rashi name
    isRetrograde?: boolean;         // Is planet retrograde
    isCombust?: boolean;            // Is planet combust
}

/**
 * Represents the complete Chalit Chart (Sphuta Chart).
 * Shows the exact positions of planets within their houses.
 */
export interface ChalitChart {
    ascendant: {
        rashi: number;
        rashiName: string;
        longitude: number;
    };
    planets: ChalitPlanet[];
    housesCusps: {
        houseNumber: number;
        startLongitude: number;
        endLongitude: number;
        rashi: number;
        rashiName: string;
    }[];
}
