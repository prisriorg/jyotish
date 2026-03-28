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
        // Find which house this planet falls into
        const house = kundli.houses.find((h) => {
            const pLon = planetData.longitude;
            
            // Normal case: Start < End (e.g., 30 to 60)
            if (h.startLongitude < h.endLongitude) {
                return pLon >= h.startLongitude && pLon < h.endLongitude;
            }
            // Wrap case: Start > End (e.g., 330 to 0/360 - Pisces crossing 0)
            else {
                return pLon >= h.startLongitude || pLon < h.endLongitude;
            }
        });

        if (house) {
            // Calculate degree, minute, second from longitude
            const degreeDecimal = planetData.longitude % 30;
            const degrees = Math.floor(degreeDecimal);
            const minutesDecimal = (degreeDecimal - degrees) * 60;
            const minutes = Math.floor(minutesDecimal);
            const seconds = Math.round((minutesDecimal - minutes) * 60);

            // Calculate position within the house
            let housePositionLon = planetData.longitude - house.startLongitude;
            if (housePositionLon < 0) {
                housePositionLon += 360;
            }

            const housePositionDegree = Math.floor(housePositionLon);
            const housePositionMinutesDecimal = (housePositionLon - housePositionDegree) * 60;
            const housePositionMinute = Math.floor(housePositionMinutesDecimal);

            // Get rashi information
            const rashiIndex = Math.floor(planetData.longitude / 30);
            const rashiname = rashiNames[rashiIndex];

            const chalitPlanet: ChalitPlanet = {
                name: planetName,
                longitude: planetData.longitude,
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
