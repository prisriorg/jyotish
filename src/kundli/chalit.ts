import { Kundli, ChalitChart, ChalitPlanet } from "./types";
import { rashiNames } from "../core/constants";
import { PlanetaryPosition } from "../core/types";

/**
 * Generates a Chalit Chart (Sphuta Chart) from a Kundli.
 * 
 * The Chalit Chart shows the exact positions of planets within their houses,
 * demonstrating how many degrees/minutes into each house a planet is positioned.
 * This is more precise than just knowing which house a planet is in.
 * 
 * @param kundli The Kundli (birth chart) object
 * @returns ChalitChart object with planet positions and house cusps
 */
export function getChalitChart(kundli: Kundli): ChalitChart {
    const chalitPlanets: ChalitPlanet[] = [];

    // Iterate through all planets and calculate their chalit positions
    for (const [planetName, planetData] of Object.entries(kundli.planets)) {
        const pLon = planetData.longitude;
        
        // Find which house this planet falls into
        // Handle the wrap-around case properly (when we cross 0°/360°)
        let house = kundli.houses.find((h) => {
            const normalizedStart = h.startLongitude;
            const normalizedEnd = h.endLongitude === 0 ? 360 : h.endLongitude;
            
            if (normalizedStart < normalizedEnd) {
                // Normal case: 30 to 60
                return pLon >= normalizedStart && pLon < normalizedEnd;
            } else {
                // Wrap case: 330 to 360 (treating 0 as 360)
                return pLon >= normalizedStart || pLon < normalizedEnd;
            }
        });

        if (house) {
            // Calculate degree, minute, second within the Rashi (sign)
            const rashiIndex = Math.floor(pLon / 30);
            const degreeInRashi = pLon - (rashiIndex * 30); // 0-30°
            const degrees = Math.floor(degreeInRashi);
            const minutesDecimal = (degreeInRashi - degrees) * 60;
            const minutes = Math.floor(minutesDecimal);
            const seconds = Math.round((minutesDecimal - minutes) * 60);

            // Calculate position within the house (0-30° degrees)
            const normalizedEnd = house.endLongitude === 0 ? 360 : house.endLongitude;
            let housePositionLon = pLon - house.startLongitude;
            
            // Handle wrap-around for house position
            if (housePositionLon < 0) {
                housePositionLon += 360;
            }
            if (housePositionLon >= 30) {
                // Should not happen if house finding is correct, but safety check
                housePositionLon = housePositionLon % 30;
            }

            const housePositionDegree = Math.floor(housePositionLon);
            const housePositionMinutesDecimal = (housePositionLon - housePositionDegree) * 60;
            const housePositionMinute = Math.floor(housePositionMinutesDecimal);

            // Get rashi information (0-11)
            const rashiname = rashiNames[rashiIndex];

            const chalitPlanet: ChalitPlanet = {
                name: planetName,
                longitude: pLon,
                degree: degrees,
                minute: minutes,
                second: seconds,
                house: house.number,
                housePosition: housePositionLon,
                housePositionDegree: housePositionDegree,
                housePositionMinute: housePositionMinute,
                rashi: rashiIndex,
                rashiName: rashiname,
                isRetrograde: planetData.isRetrograde,
                isCombust: planetData.isCombust,
            };

            chalitPlanets.push(chalitPlanet);
        }
    }

    // Create house cusps data
    const housesCusps = kundli.houses.map((house) => ({
        houseNumber: house.number,
        startLongitude: house.startLongitude,
        endLongitude: house.endLongitude,
        rashi: house.rashi,
        rashiName: rashiNames[house.rashi - 1],
    }));

    // Sort planets by house number and then by position within house
    chalitPlanets.sort((a, b) => {
        if (a.house !== b.house) {
            return a.house - b.house;
        }
        return a.housePosition - b.housePosition;
    });

    return {
        ascendant: {
            rashi: kundli.ascendant.rashi,
            rashiName: kundli.ascendant.rashiName,
            longitude: kundli.ascendant.longitude,
        },
        planets: chalitPlanets,
        housesCusps: housesCusps,
    };
}

/**
 * Formats chalit chart data into a human-readable string representation.
 * 
 * @param chalitChart The chalit chart object
 * @returns Formatted string representation of the chalit chart
 */
export function formatChalitChart(chalitChart: ChalitChart): string {
    let result = "=== CHALIT CHART (SPHUTA CHART) ===\n\n";

    result += `Ascendant: ${chalitChart.ascendant.rashiName} (${chalitChart.ascendant.longitude.toFixed(2)}°)\n\n`;

    result += "--- HOUSE CUSPS ---\n";
    chalitChart.housesCusps.forEach((cusp) => {
        result += `H${cusp.houseNumber}: ${cusp.rashiName} (${cusp.startLongitude.toFixed(2)}° - ${cusp.endLongitude.toFixed(2)}°)\n`;
    });

    result += "\n--- PLANETS IN HOUSES (CHALIT POSITIONS) ---\n";
    chalitChart.planets.forEach((planet) => {
        const retroStatus = planet.isRetrograde ? " [R]" : "";
        const combustStatus = planet.isCombust ? " [C]" : "";
        result += `\n${planet.name}${retroStatus}${combustStatus}\n`;
        result += `  Longitude: ${planet.longitude.toFixed(2)}° (${planet.degree}°${planet.minute}'${planet.second}\")\n`;
        result += `  Rashi: ${planet.rashiName}\n`;
        result += `  House: ${planet.house}\n`;
        result += `  Position in House: ${planet.housePositionDegree}°${planet.housePositionMinute}' (${planet.housePosition.toFixed(2)}° into house)\n`;
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
 * Gets the exact degrees a planet has progressed into its house.
 * Useful for understanding planetary strength and placement within a house.
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
        percentage: (planet.housePosition / 30) * 100,
    };
}
