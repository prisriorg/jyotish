type DashaPeriod = {
    planet: string;
    startTime: Date;
    endTime: Date;
    durationYears: number;
    progressPercent?: number;
    antars?: DashaPeriod[]; // only for mahadasha
    pratyantars?: DashaPeriod[]; // only for antar
};
type DashaResult = {
    birthNakshatra: string;
    nakshatraPada: number;
    mahadashas: DashaPeriod[];
    currentMahadasha?: any;
    currentAntar?: any;
    currentPratyantar?: any;
};

const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

// Standard Vimshottari order and durations (years)
const vimshottariLords = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const vimshottariDurations = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // sum = 120

// Nakshatra names (0..26)
const nakshatraNames = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha',
    'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula',
    'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// helper: get pada (1..4) from moon longitude (deg)
function getNakshatraPada(moonLon: number): number {
    const lonMinutes = moonLon * 60;
    const nakshatraDurationMin = 800; // 13deg20' = 800'
    const nakIndex = Math.floor(lonMinutes / nakshatraDurationMin);
    const elapsed = lonMinutes % nakshatraDurationMin;
    // each pada = nakshatraDurationMin/4 = 200'
    return Math.floor(elapsed / 200) + 1;
}

function addMs(date: Date, ms: number): Date {
    return new Date(date.getTime() + ms);
}

function yearsBetweenMs(ms: number): number {
    return ms / MS_PER_YEAR;
}

/**
 * Main function: returns full mahadasha timeline with antars & pratyantars
 * moonLon in degrees (0..360), birthDate is Date object
 */
export function getVimshottariDasha(moonLon: number, birthDate: Date, asOf: Date = new Date()): DashaResult {
    // 1. Nakshatra + pada + starting mahadasha lord index and balance
    const lonMinutes = moonLon * 60;
    const nakshatraDurationMin = 800;
    const nakshatraIndex = Math.floor(lonMinutes / nakshatraDurationMin);
    const elapsedInNakshatra = lonMinutes % nakshatraDurationMin;
    const fractionElapsed = elapsedInNakshatra / nakshatraDurationMin;
    const fractionRemaining = 1 - fractionElapsed;

    // Lord index mapping: sequence aligns so nakshatraIndex % 9 gives lord index
    const lordIndex = nakshatraIndex % 9;
    const lordDurationYears = vimshottariDurations[lordIndex];
    const balanceYears = lordDurationYears * fractionRemaining;

    // helper to add fractional years to a date using MS_PER_YEAR
    const addYearsMs = (date: Date, years: number): Date => addMs(date, years * MS_PER_YEAR);

    // build mahadashas starting at birthDate
    const mahadashas: DashaPeriod[] = [];
    let currentStart = new Date(birthDate.getTime());
    let currentEnd = addYearsMs(currentStart, balanceYears);

    // first (possibly partial) mahadasha
    mahadashas.push({
        planet: vimshottariLords[lordIndex],
        startTime: new Date(currentStart),
        endTime: new Date(currentEnd),
        durationYears: yearsBetweenMs(currentEnd.getTime() - currentStart.getTime())
    });

    currentStart = currentEnd;

    let i = 1;
    for (i = 1; i < 9; i++) {
        const nextIndex = (lordIndex + i) % 9;
        const dur = vimshottariDurations[nextIndex];
        currentEnd = addYearsMs(currentStart, dur);
        mahadashas.push({
            planet: vimshottariLords[nextIndex],
            startTime: new Date(currentStart),
            endTime: new Date(currentEnd),
            durationYears: yearsBetweenMs(currentEnd.getTime() - currentStart.getTime())
        });
        currentStart = currentEnd;
    }

    // Ensure at least one future mahadasha that includes asOf (if asOf is after built ones)
    // If asOf still > last end, continue until we pass it
    let idxCounter = 0;
    while (asOf >= mahadashas[mahadashas.length - 1].endTime && idxCounter < 50) {
        const last = mahadashas[mahadashas.length - 1];
        const lastLordIndex = vimshottariLords.indexOf(last.planet);
        const nextIndex = (lastLordIndex + 1) % 9;
        const dur = vimshottariDurations[nextIndex];
        const start = new Date(last.endTime);
        const end = addYearsMs(start, dur);
        mahadashas.push({
            planet: vimshottariLords[nextIndex],
            startTime: start,
            endTime: end,
            durationYears: yearsBetweenMs(end.getTime() - start.getTime())
        });
        idxCounter++;
    }


    // Helper to calculate antars & pratyantars for a Mahadasha.
    // For the first (birth) Mahadasha, the period theoretically began before birthDate.
    // We compute the true uncompressed antardashas and pratyantars from theoreticalMahaStart,
    // and for the native's chart we only include periods that end after birthDate.
    const elapsedYears = lordDurationYears * fractionElapsed;
    const theoreticalMahaStart = new Date(birthDate.getTime() - elapsedYears * MS_PER_YEAR);

    for (let m = 0; m < mahadashas.length; m++) {
        const maha = mahadashas[m];
        const isFirstMaha = m === 0;
        const startLordIndex = vimshottariLords.indexOf(maha.planet);
        const fullMahaDurationYears = vimshottariDurations[startLordIndex];
        
        // For first Mahadasha, calculate from theoretical start before birth; for others, from maha.startTime
        let antarStart = isFirstMaha ? new Date(theoreticalMahaStart) : new Date(maha.startTime);
        maha.antars = [];

        for (let a = 0; a < 9; a++) {
            const antarLordIdx = (startLordIndex + a) % 9;
            const antarLord = vimshottariLords[antarLordIdx];
            // Antar duration is based on the full standard Mahadasha duration
            const fullAntarDurYears = fullMahaDurationYears * (vimshottariDurations[antarLordIdx] / 120);
            const antarEnd = addYearsMs(antarStart, fullAntarDurYears);

            // If this Antardasha finished before birth, skip it for the native's timeline
            if (isFirstMaha && antarEnd.getTime() <= birthDate.getTime()) {
                antarStart = antarEnd;
                continue;
            }

            // If this Antardasha was active at birth, clamp its effective start to birthDate
            const effectiveAntarStart = (isFirstMaha && antarStart.getTime() < birthDate.getTime())
                ? new Date(birthDate)
                : new Date(antarStart);
            const effectiveAntarDurYears = yearsBetweenMs(antarEnd.getTime() - effectiveAntarStart.getTime());

            const antarPeriod: DashaPeriod = {
                planet: antarLord,
                startTime: effectiveAntarStart,
                endTime: new Date(antarEnd),
                durationYears: effectiveAntarDurYears
            };

            // Now calculate Pratyantars inside this Antardasha
            antarPeriod.pratyantars = [];
            let pratyStart = new Date(antarStart);

            for (let p = 0; p < 9; p++) {
                const pratyLordIdx = (antarLordIdx + p) % 9;
                const pratyLord = vimshottariLords[pratyLordIdx];
                // Pratyantar duration based on the full uncompressed Antar duration
                const fullPratyDurYears = fullAntarDurYears * (vimshottariDurations[pratyLordIdx] / 120);
                const pratyEnd = addYearsMs(pratyStart, fullPratyDurYears);

                // If this Pratyantar ended before birth, skip it
                if (isFirstMaha && pratyEnd.getTime() <= birthDate.getTime()) {
                    pratyStart = pratyEnd;
                    continue;
                }

                const effectivePratyStart = (isFirstMaha && pratyStart.getTime() < birthDate.getTime())
                    ? new Date(birthDate)
                    : new Date(pratyStart);
                const effectivePratyDurYears = yearsBetweenMs(pratyEnd.getTime() - effectivePratyStart.getTime());

                antarPeriod.pratyantars.push({
                    planet: pratyLord,
                    startTime: effectivePratyStart,
                    endTime: new Date(pratyEnd),
                    durationYears: effectivePratyDurYears
                });

                pratyStart = pratyEnd;
            }

            maha.antars.push(antarPeriod);
            antarStart = antarEnd;
        }
    }

    // Find current Mahadasha / Antar / Pratyantar as of 'asOf' date
    let currentMahadasha: DashaPeriod | undefined;
    let currentAntar: DashaPeriod | undefined;
    let currentPratyantar: DashaPeriod | undefined;

    for (const maha of mahadashas) {
        if (asOf >= maha.startTime && asOf < maha.endTime) {
            currentMahadasha = maha;
            // mark progress%
            currentMahadasha.progressPercent = ((asOf.getTime() - maha.startTime.getTime()) / (maha.endTime.getTime() - maha.startTime.getTime())) * 100;


            // find antar
            if (maha.antars) {
                for (const antar of maha.antars) {
                    if (asOf >= antar.startTime && asOf < antar.endTime) {
                        currentAntar = antar;
                        antar.progressPercent = ((asOf.getTime() - antar.startTime.getTime()) / (antar.endTime.getTime() - antar.startTime.getTime())) * 100;
                        if (antar.pratyantars) {
                            for (const praty of antar.pratyantars) {
                                if (asOf >= praty.startTime && asOf < praty.endTime) {
                                    currentPratyantar = praty;
                                    praty.progressPercent = ((asOf.getTime() - praty.startTime.getTime()) / (praty.endTime.getTime() - praty.startTime.getTime())) * 100;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            break;
        }
    }


    return {
        birthNakshatra: nakshatraNames[nakshatraIndex],
        nakshatraPada: getNakshatraPada(moonLon),
        mahadashas,
        currentMahadasha: {
            ...currentMahadasha,
            antars: undefined
        },
        currentAntar: {
            ...currentAntar,
            pratyantars: undefined
        },
        currentPratyantar
    };
}