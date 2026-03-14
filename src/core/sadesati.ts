function getRashiIndex(longitude: number): number {
    return Math.floor(longitude / 30); // 0–11
}

type SadeSatiResult = {
    status: boolean;
    phase?: 1 | 2 | 3;
    saturnRashi: number;
    moonRashi: number;
};

export function checkSadeSati(
    natalMoonLongitude: number,
    transitSaturnLongitude: number
): SadeSatiResult {

    const moonRashi = getRashiIndex(natalMoonLongitude);
    const saturnRashi = getRashiIndex(transitSaturnLongitude);

    // Distance Saturn from Moon (0–11)
    let diff = ((saturnRashi - moonRashi + 12) % 12);

    if (diff === 11) {
        return { status: true, phase: 1, saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
    }

    if (diff === 0) {
        return { status: true, phase: 2, saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
    }

    if (diff === 1) {
        return { status: true, phase: 3, saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
    }

    return { status: false, saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
}


type DhaiyaResult = {
    status: boolean;
    type?: 'Fourth' | 'Eighth';
    saturnRashi: number;
    moonRashi: number;
};

export function checkDhaiya(
    natalMoonLongitude: number,
    transitSaturnLongitude: number
): DhaiyaResult {

    const moonRashi = getRashiIndex(natalMoonLongitude);
    const saturnRashi = getRashiIndex(transitSaturnLongitude);

    let diff = (saturnRashi - moonRashi + 12) % 12;

    if (diff === 3) {
        return { status: true, type: 'Fourth', saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
    }

    if (diff === 7) {
        return { status: true, type: 'Eighth', saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
    }

    return { status: false, saturnRashi: saturnRashi + 1, moonRashi: moonRashi + 1 };
}