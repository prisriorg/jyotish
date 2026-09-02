import {
    VARNA_ORDER, RASHI_VARNA,
    VASHYA_TYPES, RASHI_VASHYA,
    NAKSHATRA_YONI, YONI_NAMES,
    NAKSHATRA_GANA, GANA_NAMES,
    NAKSHATRA_NADI, NADI_NAMES,
    RASHI_LORDS
} from "./constants";
import { KootaResult } from "./types";
import { Language } from "../i18n/types";
import { kootaNamesI18n, varnaI18n, vashyaI18n, ganaI18n, nadiI18n, yoniI18n } from "../i18n/dictionaries/matching";
import { getLocalizedPlanet } from "../i18n/index";

// --- 1. Varna (1 Point) ---
export function calculateVarna(boyRashi: number, girlRashi: number, lang: Language = 'en'): KootaResult {
    const bVarna = RASHI_VARNA[boyRashi];
    const gVarna = RASHI_VARNA[girlRashi];

    let score = 0;
    if (bVarna <= gVarna) {
        score = 1;
    }

    const bName = VARNA_ORDER[bVarna];
    const gName = VARNA_ORDER[gVarna];
    const locB = varnaI18n[lang]?.[bName] || bName;
    const locG = varnaI18n[lang]?.[gName] || gName;
    const meta = kootaNamesI18n[lang]?.Varna || { name: "Varna", area: "Work/Ego" };

    return {
        name: meta.name,
        score,
        maxScore: 1,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG}` : `Boy:${bName} - Girl:${gName}`,
        area: meta.area
    };
}

// --- 2. Vashya (2 Points) ---
export function calculateVashya(boyRashi: number, girlRashi: number, lang: Language = 'en'): KootaResult {
    const bType = RASHI_VASHYA[boyRashi];
    const gType = RASHI_VASHYA[girlRashi];

    const table = [
        [2, 1, 1, 0.5, 1], // Chatushpad
        [1, 2, 0.5, 0, 1], // Manav
        [1, 0.5, 2, 1, 1], // Jalchar
        [0.5, 0, 1, 2, 0], // Vanchar
        [1, 1, 1, 0, 2]    // Keet
    ];

    const score = table[bType][gType];
    const bName = VASHYA_TYPES[bType];
    const gName = VASHYA_TYPES[gType];
    const locB = vashyaI18n[lang]?.[bName] || bName;
    const locG = vashyaI18n[lang]?.[gName] || gName;
    const meta = kootaNamesI18n[lang]?.Vashya || { name: "Vashya", area: "Dominance/Control" };

    return {
        name: meta.name,
        score,
        maxScore: 2,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG}` : `Boy:${bName} - Girl:${gName}`,
        area: meta.area
    };
}

// --- 3. Tara (3 Points) ---
export function calculateTara(boyNak: number, girlNak: number, lang: Language = 'en'): KootaResult {
    let countGB = (boyNak - girlNak);
    if (countGB < 0) countGB += 27;
    countGB += 1;

    const remGB = countGB % 9;
    const isGoodGB = [1, 2, 4, 6, 8, 0].includes(remGB);

    let countBG = (girlNak - boyNak);
    if (countBG < 0) countBG += 27;
    countBG += 1;
    const remBG = countBG % 9;
    const isGoodBG = [1, 2, 4, 6, 8, 0].includes(remBG);

    let score = 0;
    if (isGoodGB && isGoodBG) score = 3;
    else if (isGoodGB || isGoodBG) score = 1.5;
    else score = 0;

    const meta = kootaNamesI18n[lang]?.Tara || { name: "Tara", area: "Destiny/Luck" };
    const goodTxt = lang === 'hi' ? 'शुभ' : 'Good';
    const badTxt = lang === 'hi' ? 'अशुभ' : 'Bad';

    return {
        name: meta.name,
        score,
        maxScore: 3,
        boy: isGoodGB ? goodTxt : badTxt,
        girl: isGoodBG ? goodTxt : badTxt,
        description: lang === 'hi'
            ? `कन्या-वर गणना:${countGB} (${isGoodGB ? 'शुभ' : 'अशुभ'}) / वर-कन्या गणना:${countBG} (${isGoodBG ? 'शुभ' : 'अशुभ'})`
            : `G-B Count:${countGB} (${isGoodGB ? 'Good' : 'Bad'}) / B-G Count:${countBG} (${isGoodBG ? 'Good' : 'Bad'})`,
        area: meta.area
    };
}

// --- 4. Yoni (4 Points) ---
export function calculateYoni(boyNak: number, girlNak: number, lang: Language = 'en'): KootaResult {
    const bYoni = NAKSHATRA_YONI[boyNak];
    const gYoni = NAKSHATRA_YONI[girlNak];
    const bName = YONI_NAMES[bYoni];
    const gName = YONI_NAMES[gYoni];
    const locB = yoniI18n[lang]?.[bName] || bName;
    const locG = yoniI18n[lang]?.[gName] || gName;
    const meta = kootaNamesI18n[lang]?.Yoni || { name: "Yoni", area: "Sexual Compatibility" };

    if (bYoni === gYoni) {
        return {
            name: meta.name,
            score: 4,
            maxScore: 4,
            boy: locB,
            girl: locG,
            description: lang === 'hi' ? "समान योनि (सर्वोत्तम सामंजस्य)" : "Same Yoni (Perfect)",
            area: meta.area
        };
    }

    const greatEnemies = [[0, 8], [1, 13], [2, 11], [3, 12], [4, 10], [5, 6], [7, 9]];
    let isGreatEnemy = false;
    greatEnemies.forEach(pair => {
        if ((bYoni === pair[0] && gYoni === pair[1]) || (bYoni === pair[1] && gYoni === pair[0])) {
            isGreatEnemy = true;
        }
    });
    if (isGreatEnemy) return {
        name: meta.name,
        score: 0,
        maxScore: 4,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG} (परम शत्रु योनि)` : `Boy:${bName} - Girl:${gName} (Great Enemies)`,
        area: meta.area
    };

    const enemies = [[8, 9], [1, 9], [0, 10]];
    let isEnemy = false;
    enemies.forEach(pair => {
        if ((bYoni === pair[0] && gYoni === pair[1]) || (bYoni === pair[1] && gYoni === pair[0])) {
            isEnemy = true;
        }
    });
    if (isEnemy) return {
        name: meta.name,
        score: 1,
        maxScore: 4,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG} (शत्रु योनि)` : `Boy:${bName} - Girl:${gName} (Enemies)`,
        area: meta.area
    };

    return {
        name: meta.name,
        score: 2,
        maxScore: 4,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG} (सम / सामान्य)` : `Boy:${bName} - Girl:${gName} (Neutral)`,
        area: meta.area
    };
}

// --- 5. Graha Maitri (5 Points) ---
export function calculateGrahaMaitri(boyRashi: number, girlRashi: number, lang: Language = 'en'): KootaResult {
    const bLord = RASHI_LORDS[boyRashi];
    const gLord = RASHI_LORDS[girlRashi];
    const locB = getLocalizedPlanet(bLord, lang);
    const locG = getLocalizedPlanet(gLord, lang);
    const meta = kootaNamesI18n[lang]?.["Graha Maitri"] || { name: "Graha Maitri", area: "Mental Compatibility" };

    const friends: Record<string, string[]> = {
        "Sun": ["Moon", "Mars", "Jupiter"],
        "Moon": ["Sun", "Mercury"],
        "Mars": ["Sun", "Moon", "Jupiter"],
        "Mercury": ["Sun", "Venus"],
        "Jupiter": ["Sun", "Moon", "Mars"],
        "Venus": ["Mercury", "Saturn"],
        "Saturn": ["Mercury", "Venus"]
    };

    const enemies: Record<string, string[]> = {
        "Sun": ["Venus", "Saturn"],
        "Moon": [],
        "Mars": ["Mercury"],
        "Mercury": ["Moon"],
        "Jupiter": ["Mercury", "Venus"],
        "Venus": ["Sun", "Moon"],
        "Saturn": ["Sun", "Moon", "Mars"]
    };

    const getRel = (planet: string, other: string): number => {
        if (planet === other) return 1;
        if (friends[planet].includes(other)) return 1;
        if (enemies[planet].includes(other)) return -1;
        return 0;
    };

    const bToG = getRel(bLord, gLord);
    const gToB = getRel(gLord, bLord);

    let score = 0;
    if (bToG === 1 && gToB === 1) score = 5;
    else if ((bToG === 1 && gToB === 0) || (bToG === 0 && gToB === 1)) score = 4;
    else if (bToG === 0 && gToB === 0) score = 3;
    else if ((bToG === 1 && gToB === -1) || (bToG === -1 && gToB === 1)) score = 1;
    else if ((bToG === 0 && gToB === -1) || (bToG === -1 && gToB === 0)) score = 0.5;
    else score = 0;

    const relMapEn: Record<number, string> = {
        5: "Best Friends",
        4: "Friends",
        3: "Neutral",
        1: "Enemies",
        0.5: "Bad enemies",
        0: "Bitter Enemies"
    };

    const relMapHi: Record<number, string> = {
        5: "परम मित्र",
        4: "मित्र",
        3: "सम / तटस्थ",
        1: "शत्रु",
        0.5: "अधम शत्रु",
        0: "कट्टर शत्रु"
    };

    const relTxt = lang === 'hi' ? relMapHi[score] : relMapEn[score];

    return {
        name: meta.name,
        score,
        maxScore: 5,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG} (${relTxt})` : `Boy:${bLord} - Girl:${gLord} (${relTxt || ''})`,
        area: meta.area
    };
}

// --- 6. Gana (6 Points) ---
export function calculateGana(boyNak: number, girlNak: number, lang: Language = 'en'): KootaResult {
    const bGana = NAKSHATRA_GANA[boyNak];
    const gGana = NAKSHATRA_GANA[girlNak];
    const bName = GANA_NAMES[bGana];
    const gName = GANA_NAMES[gGana];
    const locB = ganaI18n[lang]?.[bName] || bName;
    const locG = ganaI18n[lang]?.[gName] || gName;
    const meta = kootaNamesI18n[lang]?.Gana || { name: "Gana", area: "Temperament" };

    if (bGana === gGana) {
        return {
            name: meta.name,
            score: 6,
            maxScore: 6,
            boy: locB,
            girl: locG,
            description: lang === 'hi' ? "समान गण (उत्तम सामंजस्य)" : "Same Gana",
            area: meta.area
        };
    }

    const matrix = [
        [6, 6, 0], // Deva vs [D, M, R]
        [5, 6, 0], // Manushya vs [D, M, R]
        [0, 0, 6]  // Rakshasa vs [D, M, R]
    ];

    const score = matrix[bGana][gGana];

    return {
        name: meta.name,
        score,
        maxScore: 6,
        boy: locB,
        girl: locG,
        description: lang === 'hi' ? `वर: ${locB} - कन्या: ${locG}` : `Boy:${bName} - Girl:${gName}`,
        area: meta.area
    };
}

// --- 7. Bhakoot (7 Points) ---
export function calculateBhakoot(boyRashi: number, girlRashi: number, lang: Language = 'en'): KootaResult {
    let diff = (girlRashi - boyRashi);
    if (diff < 0) diff += 12;
    const pos = diff + 1;

    const isBad = [2, 12, 5, 9, 6, 8].includes(pos);

    let score = 7;
    let relName = `${pos}-axis`;
    if ([2, 12].includes(pos)) relName = lang === 'hi' ? "द्विर्द्वादश (2-12)" : "Dwirdwadash (2-12)";
    if ([6, 8].includes(pos)) relName = lang === 'hi' ? "षडाष्टक (6-8)" : "Shadashtak (6-8)";
    if ([5, 9].includes(pos)) relName = lang === 'hi' ? "नवपंचम (5-9)" : "Navpancham (5-9)";

    let description = lang === 'hi' ? `स्थिति: ${relName}` : `Position: ${relName}`;
    const bLord = RASHI_LORDS[boyRashi];
    const gLord = RASHI_LORDS[girlRashi];
    const locB = getLocalizedPlanet(bLord, lang);
    const locG = getLocalizedPlanet(gLord, lang);
    const meta = kootaNamesI18n[lang]?.Bhakoot || { name: "Bhakoot", area: "Love/Happiness" };

    if (isBad) {
        if (bLord === gLord) {
            score = 7;
            description += lang === 'hi' ? ` (परिहार: समान राशि स्वामी ${locB})` : ` (Exception: Same Lord ${bLord})`;
        } else {
            score = 0;
            description += lang === 'hi' ? " (भकूट दोष)" : " (Bhakoot Dosha)";
        }
    }

    return {
        name: meta.name,
        score,
        maxScore: 7,
        boy: locB,
        girl: locG,
        description,
        area: meta.area
    };
}

// --- 8. Nadi (8 Points) ---
export function calculateNadi(boyNak: number, girlNak: number, boyRashi?: number, girlRashi?: number, lang: Language = 'en'): KootaResult {
    const bNadi = NAKSHATRA_NADI[boyNak];
    const gNadi = NAKSHATRA_NADI[girlNak];
    const bName = NADI_NAMES[bNadi];
    const gName = NADI_NAMES[gNadi];
    const locB = nadiI18n[lang]?.[bName] || bName;
    const locG = nadiI18n[lang]?.[gName] || gName;
    const meta = kootaNamesI18n[lang]?.Nadi || { name: "Nadi", area: "Health/Genes" };

    let score = 8;
    let description = lang === 'hi' ? `वर: ${locB} - कन्या: ${locG}` : `Boy:${bName} - Girl:${gName}`;

    if (bNadi === gNadi) {
        score = 0;
        description += lang === 'hi' ? " (नाड़ी दोष)" : " (Nadi Dosha)";

        if (boyRashi !== undefined && girlRashi !== undefined) {
            if (boyRashi === girlRashi && boyNak !== girlNak) {
                score = 8;
                description += lang === 'hi' ? " (दोष परिहार: समान राशि, भिन्न नक्षत्र)" : " (Exception: Same Rashi, Diff Nakshatra)";
            }
        }
    }

    return {
        name: meta.name,
        score,
        maxScore: 8,
        description,
        boy: locB,
        girl: locG,
        area: meta.area
    };
}
