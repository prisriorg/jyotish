import { Language } from "../i18n/types";
import { sadesatiI18n } from "../i18n/dictionaries/panchang";

function getRashiIndex(longitude: number): number {
    return Math.floor(longitude / 30); // 0–11
}

export type SadeSatiResult = {
    status: boolean;
    phase?: 1 | 2 | 3;
    phaseName?: string;
    description?: string;
    saturnRashi: number;
    moonRashi: number;
};

export function checkSadeSati(
    natalMoonLongitude: number,
    transitSaturnLongitude: number,
    options?: { lang?: Language }
): SadeSatiResult {
    const lang: Language = options?.lang || 'en';
    const moonRashi = getRashiIndex(natalMoonLongitude);
    const saturnRashi = getRashiIndex(transitSaturnLongitude);

    // Distance Saturn from Moon (0–11)
    let diff = ((saturnRashi - moonRashi + 12) % 12);

    if (diff === 11) {
        return {
            status: true,
            phase: 1,
            phaseName: lang === 'hi' ? "प्रथम चरण (उदय चरण)" : "First Phase (Rising)",
            description: sadesatiI18n[lang]?.risingPhase || sadesatiI18n.en.risingPhase,
            saturnRashi: saturnRashi + 1,
            moonRashi: moonRashi + 1
        };
    }

    if (diff === 0) {
        return {
            status: true,
            phase: 2,
            phaseName: lang === 'hi' ? "द्वितीय चरण (शिखर चरण)" : "Second Phase (Peak)",
            description: sadesatiI18n[lang]?.peakPhase || sadesatiI18n.en.peakPhase,
            saturnRashi: saturnRashi + 1,
            moonRashi: moonRashi + 1
        };
    }

    if (diff === 1) {
        return {
            status: true,
            phase: 3,
            phaseName: lang === 'hi' ? "तृतीय चरण (अस्त चरण)" : "Third Phase (Setting)",
            description: sadesatiI18n[lang]?.settingPhase || sadesatiI18n.en.settingPhase,
            saturnRashi: saturnRashi + 1,
            moonRashi: moonRashi + 1
        };
    }

    return {
        status: false,
        description: sadesatiI18n[lang]?.notActive || sadesatiI18n.en.notActive,
        saturnRashi: saturnRashi + 1,
        moonRashi: moonRashi + 1
    };
}

export type DhaiyaResult = {
    status: boolean;
    type?: 'Fourth' | 'Eighth' | (string & {});
    typeName?: string;
    description?: string;
    saturnRashi: number;
    moonRashi: number;
};

export function checkDhaiya(
    natalMoonLongitude: number,
    transitSaturnLongitude: number,
    options?: { lang?: Language }
): DhaiyaResult {
    const lang: Language = options?.lang || 'en';
    const moonRashi = getRashiIndex(natalMoonLongitude);
    const saturnRashi = getRashiIndex(transitSaturnLongitude);

    let diff = (saturnRashi - moonRashi + 12) % 12;

    if (diff === 3) {
        return {
            status: true,
            type: 'Fourth',
            typeName: lang === 'hi' ? "कंटक शनि (चतुर्थ ढैय्या)" : "Kantaka Shani (4th Dhaiya)",
            description: sadesatiI18n[lang]?.dhaiya4th || sadesatiI18n.en.dhaiya4th,
            saturnRashi: saturnRashi + 1,
            moonRashi: moonRashi + 1
        };
    }

    if (diff === 7) {
        return {
            status: true,
            type: 'Eighth',
            typeName: lang === 'hi' ? "अष्टम शनि (अष्टम ढैय्या)" : "Ashtama Shani (8th Dhaiya)",
            description: sadesatiI18n[lang]?.dhaiya8th || sadesatiI18n.en.dhaiya8th,
            saturnRashi: saturnRashi + 1,
            moonRashi: moonRashi + 1
        };
    }

    return {
        status: false,
        description: sadesatiI18n[lang]?.noDhaiya || sadesatiI18n.en.noDhaiya,
        saturnRashi: saturnRashi + 1,
        moonRashi: moonRashi + 1
    };
}