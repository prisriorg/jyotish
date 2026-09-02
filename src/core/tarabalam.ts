/**
 * Tarabalam - Nakshatra Strength Calculation
 * 
 * Tarabalam measures the strength/auspiciousness of a day based on the
 * relationship between one's birth Nakshatra and the current day's Nakshatra.
 */

import { nakshatraNames } from './constants';
import { Language } from '../i18n/types';
import { getLocalizedNakshatra } from '../i18n/index';
import { tarabalamI18n } from '../i18n/dictionaries/panchang';

export interface TarabalamInfo {
    birthNakshatra: number;       // Birth Nakshatra index (0-26)
    birthNakshatraName: string;   // Birth Nakshatra name
    currentNakshatra: number;     // Current Nakshatra index (0-26)
    currentNakshatraName: string; // Current Nakshatra name
    taraNumber: number;           // Tara number (1-9)
    taraName: string;             // Tara name (Janma, Sampat, etc.)
    isAuspicious: boolean;        // True if this Tara is considered good
    description: string;          // Brief description of the Tara's effect
}

const TARA_INFO: Record<number, { name: string; isAuspicious: boolean; description: string }> = {
    1: { name: 'Janma', isAuspicious: false, description: 'Birth star - may cause physical discomfort' },
    2: { name: 'Sampat', isAuspicious: true, description: 'Wealth star - good for financial matters' },
    3: { name: 'Vipat', isAuspicious: false, description: 'Danger star - obstacles and troubles possible' },
    4: { name: 'Kshema', isAuspicious: true, description: 'Well-being star - prosperity and good health' },
    5: { name: 'Pratyak', isAuspicious: false, description: 'Opposition star - hindrances and delays' },
    6: { name: 'Sadhana', isAuspicious: true, description: 'Achievement star - success in endeavors' },
    7: { name: 'Naidhana', isAuspicious: false, description: 'Death star - avoid important activities' },
    8: { name: 'Mitra', isAuspicious: true, description: 'Friend star - support and cooperation' },
    9: { name: 'Parama Mitra', isAuspicious: true, description: 'Great friend star - highly favorable' },
};

export function getTarabalam(
    birthNakshatra: number,
    currentNakshatra: number,
    options?: { lang?: Language }
): TarabalamInfo {
    const lang: Language = options?.lang || 'en';
    const normalizedBirth = ((birthNakshatra % 27) + 27) % 27;
    const normalizedCurrent = ((currentNakshatra % 27) + 27) % 27;

    let count: number;
    if (normalizedCurrent >= normalizedBirth) {
        count = normalizedCurrent - normalizedBirth + 1;
    } else {
        count = (27 - normalizedBirth) + normalizedCurrent + 1;
    }

    const remainder = count % 9;
    const taraNumber = remainder === 0 ? 9 : remainder;

    const taraMeta = tarabalamI18n[lang]?.[taraNumber];
    const defaultMeta = TARA_INFO[taraNumber];

    return {
        birthNakshatra: normalizedBirth,
        birthNakshatraName: getLocalizedNakshatra(normalizedBirth, lang),
        currentNakshatra: normalizedCurrent,
        currentNakshatraName: getLocalizedNakshatra(normalizedCurrent, lang),
        taraNumber,
        taraName: taraMeta?.name || defaultMeta.name,
        isAuspicious: defaultMeta.isAuspicious,
        description: taraMeta?.description || defaultMeta.description,
    };
}

export function getAuspiciousNakshatras(birthNakshatra: number): number[] {
    const auspicious: number[] = [];
    const auspiciousTaras = [2, 4, 6, 8, 9];

    for (let i = 0; i < 27; i++) {
        const tara = getTarabalam(birthNakshatra, i);
        if (auspiciousTaras.includes(tara.taraNumber)) {
            auspicious.push(i);
        }
    }

    return auspicious;
}
