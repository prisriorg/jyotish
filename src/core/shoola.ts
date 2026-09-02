/**
 * Disha Shoola - Direction-based Travel Dosha
 * 
 * Certain directions are inauspicious for travel on specific weekdays.
 * This is a traditional Vedic concept used in Panchang calculations.
 */

import { dayNames } from './constants';
import { Language } from '../i18n/types';
import { getLocalizedVaara } from '../i18n/index';
import { shoolaI18n } from '../i18n/dictionaries/panchang';

export interface DishaShoola {
    vara: number;                    // Day of week (0=Sunday, 6=Saturday)
    varaName: string;                // Name of the day
    inauspiciousDirection: string;   // Direction to avoid for travel
    safeDirections: string[];        // Safe directions for travel
    remedy?: string;
    description?: string;
}

const SHOOLA_DIRECTIONS: Record<number, string> = {
    0: 'West',    // Sunday
    1: 'East',    // Monday
    2: 'North',   // Tuesday
    3: 'North',   // Wednesday
    4: 'South',   // Thursday
    5: 'West',    // Friday
    6: 'East',    // Saturday
};

const ALL_DIRECTIONS = ['East', 'West', 'North', 'South'];

export function getDishaShoola(vara: number, options?: { lang?: Language }): DishaShoola {
    const lang: Language = options?.lang || 'en';
    const normalizedVara = ((vara % 7) + 7) % 7;

    const rawInauspicious = SHOOLA_DIRECTIONS[normalizedVara];
    const rawSafe = ALL_DIRECTIONS.filter(d => d !== rawInauspicious);

    const shoolaMeta = shoolaI18n[lang]?.[rawInauspicious];

    const dirMap: Record<string, string> = lang === 'hi'
        ? { East: "पूर्व", West: "पश्चिम", North: "उत्तर", South: "दक्षिण" }
        : { East: "East", West: "West", North: "North", South: "South" };

    return {
        vara: normalizedVara,
        varaName: getLocalizedVaara(normalizedVara, lang),
        inauspiciousDirection: dirMap[rawInauspicious] || rawInauspicious,
        safeDirections: rawSafe.map(d => dirMap[d] || d),
        remedy: shoolaMeta?.remedy,
        description: shoolaMeta?.description,
    };
}

export function isDirectionSafe(vara: number, direction: string): boolean {
    const normalizedVara = ((vara % 7) + 7) % 7;
    const inauspiciousDirection = SHOOLA_DIRECTIONS[normalizedVara];
    return direction.toLowerCase() !== inauspiciousDirection.toLowerCase();
}
