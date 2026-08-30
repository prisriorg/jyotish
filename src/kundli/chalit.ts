import { Kundli, ChalitChart, ChalitPlanet, ChalitBhava } from "./types";
import { rashiNames } from "../core/constants";
import { Observer } from "astronomy-engine";
import { getMidheaven } from "../core/calculations";
import { getAyanamsa } from "../core/ayanamsa";

/**
 * Calculates the midpoint between two longitudes along the 360° circle.
 */
function getMidpoint(lonA: number, lonB: number): number {
    const diff = (lonB - lonA + 360) % 360;
    return (lonA + diff / 2) % 360;
}

/**
 * Checks if a longitude falls within a sector [start, end) on a 360° circle.
 */
function isLongitudeBetween(lon: number, start: number, end: number): boolean {
    const p = ((lon % 360) + 360) % 360;
    const s = ((start % 360) + 360) % 360;
    const e = ((end % 360) + 360) % 360;

    if (s < e) {
        return p >= s && p < e;
    } else {
        return p >= s || p < e;
    }
}

/**
 * Generates an authentic Chalit Chart (Bhava Chalit / Sphuta Chart) from a Kundli.
 * 
 * Supports both standard Vedic Sripati Bhava Chalit (default) and Equal House Chalit.
 * In Sripati Bhava Chalit:
 * - Lagna is the Bhava Madhya (midpoint) of House 1.
 * - Midheaven (MC) is the Bhava Madhya of House 10.
 * - Intermediate house madhyas are obtained by trisecting the diurnal/nocturnal arcs.
 * - Bhava Sandhis (house borders) are the midpoints between successive Bhava Madhyas.
 * - Planets are assigned to Bhavas based on Sandhis, revealing true house shifts from D1.
 * 
 * @param kundli The Kundli (birth chart) object
 * @param system House division system: 'sripati' (default) or 'equal_house'
 * @returns ChalitChart object with rich Bhava details, Sandhis, Madhyas, and planetary shifts
 */
export function getChalitChart(kundli: Kundli, system: 'sripati' | 'equal_house' = 'sripati'): ChalitChart {
    const ascLon = kundli.ascendant.longitude;
    const ascRashiIndex = Math.floor(ascLon / 30);
    const ascRashi = ascRashiIndex + 1; // 1-12

    // 1. Calculate Bhava Madhyas (Midpoints)
    const madhyas: number[] = new Array(12);

    if (system === 'sripati') {
        madhyas[0] = ascLon; // H1 Madhya = Lagna
        madhyas[6] = (ascLon + 180) % 360; // H7 Madhya

        // Try to calculate exact astronomical MC (Midheaven) for House 10
        let mcLon: number | null = null;
        try {
            if (kundli.birthDetails && kundli.birthDetails.lat !== undefined && kundli.birthDetails.lon !== undefined) {
                const observer = new Observer(kundli.birthDetails.lat, kundli.birthDetails.lon, 0);
                // Attempt to parse ISO / standard date if available
                let dateObj: Date | null = null;
                const dStr = kundli.birthDetails.date;
                const tStr = kundli.birthDetails.time;
                if (dStr) {
                    const combined = new Date(`${dStr} ${tStr || ''}`);
                    if (!isNaN(combined.getTime())) {
                        dateObj = combined;
                    }
                }
                if (dateObj) {
                    const ayanamsa = getAyanamsa(dateObj);
                    mcLon = getMidheaven(dateObj, observer, ayanamsa);
                }
            }
        } catch {
            mcLon = null;
        }

        // Fallback for MC if not calculated astronomically: standard 90° behind Lagna
        if (mcLon === null) {
            mcLon = (ascLon - 90 + 360) % 360;
        }

        madhyas[9] = mcLon; // H10 Madhya = MC
        madhyas[3] = (mcLon + 180) % 360; // H4 Madhya = IC

        // Trisection of arc between H10 and H1 (Houses 11 and 12)
        const arc10to1 = (ascLon - mcLon + 360) % 360;
        const part1 = arc10to1 / 3;
        madhyas[10] = (mcLon + part1) % 360;       // H11 Madhya
        madhyas[11] = (mcLon + 2 * part1) % 360;   // H12 Madhya

        // Trisection of arc between H1 and H4 (Houses 2 and 3)
        const icLon = madhyas[3];
        const arc1to4 = (icLon - ascLon + 360) % 360;
        const part2 = arc1to4 / 3;
        madhyas[1] = (ascLon + part2) % 360;       // H2 Madhya
        madhyas[2] = (ascLon + 2 * part2) % 360;   // H3 Madhya

        // Opposite houses (add 180°)
        madhyas[4] = (madhyas[10] + 180) % 360;    // H5 Madhya opposite H11
        madhyas[5] = (madhyas[11] + 180) % 360;    // H6 Madhya opposite H12
        madhyas[7] = (madhyas[1] + 180) % 360;     // H8 Madhya opposite H2
        madhyas[8] = (madhyas[2] + 180) % 360;     // H9 Madhya opposite H3
    } else {
        // Equal House system: Lagna is H1 Madhya, each house 30° apart
        for (let i = 0; i < 12; i++) {
            madhyas[i] = (ascLon + i * 30) % 360;
        }
    }

    // 2. Calculate Bhava Sandhis (Boundaries)
    const chalitBhavas: ChalitBhava[] = [];
    const housesCusps: ChalitChart['housesCusps'] = [];

    for (let i = 0; i < 12; i++) {
        const prevIdx = (i - 1 + 12) % 12;
        const nextIdx = (i + 1) % 12;

        const startLon = getMidpoint(madhyas[prevIdx], madhyas[i]);
        const endLon = getMidpoint(madhyas[i], madhyas[nextIdx]);
        const span = (endLon - startLon + 360) % 360;

        const madhyaLon = madhyas[i];
        const madhyaRashiIdx = Math.floor(madhyaLon / 30);
        const degInRashi = madhyaLon - madhyaRashiIdx * 30;
        const mDeg = Math.floor(degInRashi);
        const mMinDec = (degInRashi - mDeg) * 60;
        const mMin = Math.floor(mMinDec);
        const mSec = Math.round((mMinDec - mMin) * 60);

        chalitBhavas.push({
            houseNumber: i + 1,
            madhyaLongitude: madhyaLon,
            madhyaDegree: mDeg,
            madhyaMinute: mMin,
            madhyaSecond: mSec,
            startLongitude: startLon,
            endLongitude: endLon,
            span,
            rashi: madhyaRashiIdx + 1,
            rashiName: rashiNames[madhyaRashiIdx],
            planets: [],
        });

        housesCusps.push({
            houseNumber: i + 1,
            startLongitude: startLon,
            endLongitude: endLon,
            rashi: madhyaRashiIdx + 1,
            rashiName: rashiNames[madhyaRashiIdx],
        });
    }

    // 3. Map Planets to Chalit Bhavas
    const chalitPlanets: ChalitPlanet[] = [];

    for (const [planetName, planetData] of Object.entries(kundli.planets)) {
        const pLon = ((planetData.longitude % 360) + 360) % 360;

        // Find which Bhava this planet falls into (between start and end Sandhi)
        let foundBhava = chalitBhavas.find((b) => isLongitudeBetween(pLon, b.startLongitude, b.endLongitude));
        if (!foundBhava) {
            // Safety fallback to first house
            foundBhava = chalitBhavas[0];
        }

        foundBhava.planets.push(planetName);

        // Degree in Rashi (0-30°)
        const rashiIndex = Math.floor(pLon / 30);
        const degreeInRashi = pLon - (rashiIndex * 30);
        const degrees = Math.floor(degreeInRashi);
        const minutesDecimal = (degreeInRashi - degrees) * 60;
        const minutes = Math.floor(minutesDecimal);
        const seconds = Math.round((minutesDecimal - minutes) * 60);

        // Progress into the Bhava from its start Sandhi
        const progressIntoBhava = (pLon - foundBhava.startLongitude + 360) % 360;
        const housePositionDegree = Math.floor(progressIntoBhava);
        const housePositionMinutesDecimal = (progressIntoBhava - housePositionDegree) * 60;
        const housePositionMinute = Math.floor(housePositionMinutesDecimal);
        const percentage = foundBhava.span > 0 ? (progressIntoBhava / foundBhava.span) * 100 : 0;

        // D1 Rashi Chart house (Whole sign from Lagna)
        const planetRashi = rashiIndex + 1; // 1-12
        const rashiHouse = ((planetRashi - ascRashi + 12) % 12) + 1; // 1-12

        // Shift calculation
        let shiftVal = foundBhava.houseNumber - rashiHouse;
        if (shiftVal === 11) shiftVal = -1; // e.g. H12 to H1
        else if (shiftVal === -11) shiftVal = 1; // e.g. H1 to H12
        else if (shiftVal > 1) shiftVal = 1;
        else if (shiftVal < -1) shiftVal = -1;

        const chalitPlanet: ChalitPlanet = {
            name: planetName,
            longitude: pLon,
            degree: degrees,
            minute: minutes,
            second: seconds,
            rashi: rashiIndex,
            rashiName: rashiNames[rashiIndex],
            rashiHouse,
            house: foundBhava.houseNumber,
            shifted: shiftVal,
            housePosition: progressIntoBhava,
            housePositionDegree,
            housePositionMinute,
            percentage,
            isRetrograde: planetData.isRetrograde,
            isCombust: planetData.isCombust,
        };

        chalitPlanets.push(chalitPlanet);
    }

    // Sort planets by house number and position
    chalitPlanets.sort((a, b) => {
        if (a.house !== b.house) return a.house - b.house;
        return a.housePosition - b.housePosition;
    });

    const ascDec = ascLon % 30;
    const ascDeg = Math.floor(ascDec);
    const ascMinDec = (ascDec - ascDeg) * 60;
    const ascMin = Math.floor(ascMinDec);
    const ascSec = Math.round((ascMinDec - ascMin) * 60);

    return {
        system,
        ascendant: {
            rashi: kundli.ascendant.rashi,
            rashiName: kundli.ascendant.rashiName,
            longitude: ascLon,
            degree: ascDeg,
            minute: ascMin,
            second: ascSec,
        },
        planets: chalitPlanets,
        housesCusps,
        bhavas: chalitBhavas,
    };
}

/**
 * Formats chalit chart data into a human-readable string representation.
 * 
 * @param chalitChart The chalit chart object
 * @returns Formatted string representation of the chalit chart
 */
export function formatChalitChart(chalitChart: ChalitChart): string {
    const sysName = chalitChart.system === 'equal_house' ? 'Equal House' : 'Sripati';
    let result = `=== CHALIT CHART (BHAVA CHALIT - ${sysName.toUpperCase()}) ===\n\n`;

    result += `Ascendant (Lagna): ${chalitChart.ascendant.rashiName} (${chalitChart.ascendant.longitude.toFixed(2)}°)\n\n`;

    if (chalitChart.bhavas && chalitChart.bhavas.length > 0) {
        result += "--- BHAVA DETAILS (MADHYA & SANDHI) ---\n";
        result += "House | Sign | Arambha (Start) | Madhya (Center) | Anta (End) | Span | Planets\n";
        result += "--------------------------------------------------------------------------------\n";
        chalitChart.bhavas.forEach((b) => {
            const plStr = b.planets.length > 0 ? b.planets.join(', ') : '-';
            const hNum = String(b.houseNumber).padStart(2, ' ');
            const rName = b.rashiName.padEnd(11, ' ');
            const startStr = `${b.startLongitude.toFixed(2)}°`.padEnd(10, ' ');
            const madhyaStr = `${b.madhyaLongitude.toFixed(2)}°`.padEnd(10, ' ');
            const endStr = `${b.endLongitude.toFixed(2)}°`.padEnd(10, ' ');
            const spanStr = `${b.span.toFixed(2)}°`.padEnd(7, ' ');
            result += `H${hNum}  | ${rName} | ${startStr} | ${madhyaStr} | ${endStr} | ${spanStr} | ${plStr}\n`;
        });
    } else {
        result += "--- HOUSE CUSPS ---\n";
        chalitChart.housesCusps.forEach((cusp) => {
            result += `H${cusp.houseNumber}: ${cusp.rashiName} (${cusp.startLongitude.toFixed(2)}° - ${cusp.endLongitude.toFixed(2)}°)\n`;
        });
    }

    result += "\n--- PLANETS IN BHAVAS (CHALIT POSITIONS & SHIFTS) ---\n";
    chalitChart.planets.forEach((planet) => {
        const retroStatus = planet.isRetrograde ? " [R]" : "";
        const combustStatus = planet.isCombust ? " [C]" : "";
        let shiftNotice = "No shift";
        if (planet.shifted === 1) {
            shiftNotice = `Shifted FORWARD (D1: H${planet.rashiHouse} -> Chalit: H${planet.house})`;
        } else if (planet.shifted === -1) {
            shiftNotice = `Shifted BACKWARD (D1: H${planet.rashiHouse} -> Chalit: H${planet.house})`;
        }

        const pctStr = planet.percentage !== undefined ? ` (${planet.percentage.toFixed(1)}% through house)` : '';

        result += `\n${planet.name}${retroStatus}${combustStatus}\n`;
        result += `  Longitude: ${planet.longitude.toFixed(2)}° (${planet.degree}°${planet.minute}'${planet.second}\")\n`;
        result += `  Rashi: ${planet.rashiName}\n`;
        result += `  Chalit House: ${planet.house} | D1 House: ${planet.rashiHouse || planet.house} | [${shiftNotice}]\n`;
        result += `  Position in House: ${planet.housePositionDegree}°${planet.housePositionMinute}' (${planet.housePosition.toFixed(2)}° into house)${pctStr}\n`;
    });

    return result;
}

/**
 * Gets detailed chalit information for a specific planet.
 * 
 * @param chalitChart The chalit chart object
 * @param planetName The name of the planet to get info for
 * @returns The ChalitPlanet object or null if not found
 */
export function getPlanetChalitInfo(chalitChart: ChalitChart, planetName: string): ChalitPlanet | null {
    return chalitChart.planets.find((p) => p.name === planetName) || null;
}

/**
 * Gets all planets in a specific house from the chalit chart.
 * 
 * @param chalitChart The chalit chart object
 * @param houseNumber The house number (1-12)
 * @returns Array of ChalitPlanet objects in that house
 */
export function getPlanetsInHouse(chalitChart: ChalitChart, houseNumber: number): ChalitPlanet[] {
    return chalitChart.planets.filter((p) => p.house === houseNumber);
}

/**
 * Gets the exact degrees and percentage a planet has progressed into its house.
 * 
 * @param chalitChart The chalit chart object
 * @param planetName The name of the planet
 * @returns Object with house position details or null if planet not found
 */
export function getPlanetHouseProgress(
    chalitChart: ChalitChart,
    planetName: string
): { house: number; degreesInto: number; percentage: number } | null {
    const planet = chalitChart.planets.find((p) => p.name === planetName);
    if (!planet) return null;

    return {
        house: planet.house,
        degreesInto: planet.housePosition,
        percentage: planet.percentage !== undefined ? planet.percentage : (planet.housePosition / 30) * 100,
    };
}
