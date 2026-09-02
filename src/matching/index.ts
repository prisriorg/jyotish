import { Kundli } from "../kundli/types";
import { MatchResult, DoshaResult, KootaResult } from "./types";
import {
    calculateVarna, calculateVashya, calculateTara, calculateYoni,
    calculateGrahaMaitri, calculateGana, calculateBhakoot, calculateNadi
} from "./kootas";
import { Language } from "../i18n/types";
import { matchingVerdictsI18n } from "../i18n/dictionaries/matching";

/**
 * Checks for Mangal Dosha (Mars defect) with exceptions.
 * Logic:
 * 1. Check Mars position from Lagna, Moon, and Venus.
 * 2. Standard Houses: 1, 4, 7, 8, 12. (Some traditions include 2).
 * 3. Exceptions: Mars in Own Sign (Aries, Scorpio), Exalted (Capricorn), or specific house/sign combos.
 */
export function checkMangalDosha(kundli: Kundli, options?: { lang?: Language }): DoshaResult {
    const lang: Language = options?.lang || 'en';

    // Helper to get house position from a reference point (1-based)
    const getPos = (planetLon: number, refLon: number) => {
        let diff = Math.floor(planetLon / 30) - Math.floor(refLon / 30);
        if (diff < 0) diff += 12;
        return diff + 1;
    };

    const marsLon = kundli.planets["Mars"].longitude;
    const lagnaLon = kundli.ascendant.longitude;
    const moonLon = kundli.planets["Moon"].longitude;
    const venusLon = kundli.planets["Venus"].longitude;

    // Positions (1-based relative house)
    const posLagna = getPos(marsLon, lagnaLon);
    const posMoon = getPos(marsLon, moonLon);
    const posVenus = getPos(marsLon, venusLon);

    const doshaHouses = [1, 2, 4, 7, 8, 12];

    const isLagnaDosha = doshaHouses.includes(posLagna);
    const isMoonDosha = doshaHouses.includes(posMoon);
    const isVenusDosha = doshaHouses.includes(posVenus);

    if (!isLagnaDosha && !isMoonDosha && !isVenusDosha) {
        return {
            hasDosha: false,
            isHigh: false,
            description: lang === 'hi' ? "मांगलिक दोष नहीं है" : "No Mangal Dosha"
        };
    }

    const marsRashi = Math.floor(marsLon / 30);
    const isOwnOrExalted = [0, 7, 9].includes(marsRashi);

    let descParts = [];
    if (isLagnaDosha) descParts.push(lang === 'hi' ? `लग्न से (भाव ${posLagna})` : `Lagna(H${posLagna})`);
    if (isMoonDosha) descParts.push(lang === 'hi' ? `चन्द्र से (भाव ${posMoon})` : `Moon(H${posMoon})`);
    if (isVenusDosha) descParts.push(lang === 'hi' ? `शुक्र से (भाव ${posVenus})` : `Venus(H${posVenus})`);

    const descriptionBase = lang === 'hi'
        ? `उपस्थिति: ${descParts.join(', ')}`
        : `Present in: ${descParts.join(', ')}`;

    if (isOwnOrExalted) {
        return {
            hasDosha: false,
            isHigh: false,
            description: lang === 'hi'
                ? `दोष परिहार (निरस्त): ${descriptionBase} - मंगल स्वराशि अथवा उच्च राशि में है`
                : `Cancelled: ${descriptionBase} - Mars is Own/Exalted`
        };
    }

    const isHigh = isLagnaDosha;

    return {
        hasDosha: true,
        isHigh,
        description: descriptionBase
    };
}

/**
 * Calculates the complete Ashtakoot Guna Milan score.
 */
export function matchKundli(boy: Kundli, girl: Kundli, options?: { lang?: Language }): MatchResult {
    const lang: Language = options?.lang || 'en';

    // 1. Get Nakshatra and Rashi indices
    const getNakIndex = (lon: number) => Math.floor(lon / (360 / 27));
    const getRashiIndex = (lon: number) => Math.floor(lon / 30);

    const bMoon = boy.planets["Moon"].longitude;
    const gMoon = girl.planets["Moon"].longitude;

    const bNak = getNakIndex(bMoon);
    const gNak = getNakIndex(gMoon);

    const bRashi = getRashiIndex(bMoon);
    const gRashi = getRashiIndex(gMoon);

    // 2. Calculate Kootas
    const kootas: KootaResult[] = [
        calculateVarna(bRashi, gRashi, lang),
        calculateVashya(bRashi, gRashi, lang),
        calculateTara(bNak, gNak, lang),
        calculateYoni(bNak, gNak, lang),
        calculateGrahaMaitri(bRashi, gRashi, lang),
        calculateGana(bNak, gNak, lang),
        calculateBhakoot(bRashi, gRashi, lang),
        calculateNadi(bNak, gNak, bRashi, gRashi, lang)
    ];

    const totalScore = kootas.reduce((sum, k) => sum + k.score, 0);

    // 3. Dosha Check
    const boyDosha = checkMangalDosha(boy, { lang });
    const girlDosha = checkMangalDosha(girl, { lang });

    // 4. Verdict
    let rawVerdict = "Not Recommended";

    if (totalScore >= 18) {
        if (boyDosha.hasDosha && girlDosha.hasDosha) {
            rawVerdict = "Good (Both Manglik)";
        } else if (!boyDosha.hasDosha && !girlDosha.hasDosha) {
            rawVerdict = "Good to Proceed";
        } else {
            if (totalScore > 25) {
                rawVerdict = "Mismatch (Manglik Mismatch) - Consult Astrologer (High Score)";
            } else {
                rawVerdict = "Mismatch (Manglik Mismatch)";
            }
        }
    } else {
        rawVerdict = "Low Score (<18)";
    }

    const verdict = matchingVerdictsI18n[lang]?.[rawVerdict] || rawVerdict;

    return {
        ashtakoot: {
            totalScore,
            kootas
        },
        dosha: {
            boy: boyDosha,
            girl: girlDosha
        },
        verdict
    };
}
