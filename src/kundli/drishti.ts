import { Kundli, Bhava } from "./types";

export interface HouseAspectDetail {
  house: number; // 1-12
  rashi: number; // 1-12
  type: '7th' | '4th' | '8th' | '5th' | '9th' | '3rd' | '10th';
}

export interface PlanetAspectDetail {
  planet: string;
  house: number; // 1-12
  rashi: number; // 1-12
  type: '7th' | '4th' | '8th' | '5th' | '9th' | '3rd' | '10th';
}

export interface PlanetAspect {
  planet: string;
  sourceHouse: number; // 1-12
  sourceRashi: number; // 1-12
  aspectedHouses: HouseAspectDetail[];
  aspectedPlanets: PlanetAspectDetail[];
}

export interface MutualAspect {
  planet1: string;
  planet2: string;
  planet1AspectOnPlanet2: string;
  planet2AspectOnPlanet1: string;
}

export interface DrishtiResult {
  planetAspects: Record<string, PlanetAspect>;
  houseAspects: Record<number, string[]>; // House number (1-12) -> List of planet names aspecting it
  mutualAspects: MutualAspect[];
}

// Special aspects rules according to Parashari Jyotish (BPHS)
// Offset in signs (houses): e.g. 7th house aspect = offset +6 (since (curr + 6) % 12 + 1 is 7th house)
const SPECIAL_ASPECTS: Record<string, { offset: number; type: '7th' | '4th' | '8th' | '5th' | '9th' | '3rd' | '10th' }[]> = {
  Mars: [
    { offset: 3, type: "4th" },
    { offset: 6, type: "7th" },
    { offset: 7, type: "8th" },
  ],
  Jupiter: [
    { offset: 4, type: "5th" },
    { offset: 6, type: "7th" },
    { offset: 8, type: "9th" },
  ],
  Saturn: [
    { offset: 2, type: "3rd" },
    { offset: 6, type: "7th" },
    { offset: 9, type: "10th" },
  ],
  Rahu: [
    { offset: 4, type: "5th" },
    { offset: 6, type: "7th" },
    { offset: 8, type: "9th" },
  ],
  Ketu: [
    { offset: 4, type: "5th" },
    { offset: 6, type: "7th" },
    { offset: 8, type: "9th" },
  ],
};

// Fix type key for Saturn

/**
 * Calculates Graha Drishti (Planetary Aspects) for all planets on houses and other planets
 * according to classical Brihat Parashara Hora Shastra (BPHS).
 *
 * @param kundli The complete Kundli object
 * @returns DrishtiResult with planetAspects, houseAspects, and mutualAspects
 */
export function getGrahaDrishti(kundli: Kundli): DrishtiResult {
  const planetAspects: Record<string, PlanetAspect> = {};
  const houseAspects: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) {
    houseAspects[h] = [];
  }

  // Helper to find a planet's house and rashi
  const planetLocations: Record<string, { house: number; rashi: number }> = {};

  kundli.houses.forEach((house: Bhava) => {
    house.planets.forEach((pName: string) => {
      planetLocations[pName] = {
        house: house.number,
        rashi: house.rashi,
      };
    });
  });

  const allPlanetNames = Object.keys(planetLocations);

  // Compute aspects for each planet
  for (const [pName, loc] of Object.entries(planetLocations)) {
    const sourceHouse = loc.house;
    const sourceRashi = loc.rashi;

    // Determine which aspect rules apply
    const aspectRules = SPECIAL_ASPECTS[pName] || [
      { offset: 6, type: "7th" },
    ];

    const aspectedHouses: HouseAspectDetail[] = [];
    const aspectedPlanets: PlanetAspectDetail[] = [];

    for (const rule of aspectRules) {
      // Target house (1-based)
      const targetHouseNum = ((sourceHouse - 1 + rule.offset) % 12) + 1;
      const targetHouseObj = kundli.houses.find((h) => h.number === targetHouseNum);
      const targetRashi = targetHouseObj ? targetHouseObj.rashi : ((sourceRashi - 1 + rule.offset) % 12) + 1;

      aspectedHouses.push({
        house: targetHouseNum,
        rashi: targetRashi,
        type: rule.type,
      });

      if (!houseAspects[targetHouseNum].includes(pName)) {
        houseAspects[targetHouseNum].push(pName);
      }

      // Check which planets reside in the target house
      if (targetHouseObj && targetHouseObj.planets) {
        for (const targetPName of targetHouseObj.planets) {
          if (targetPName !== pName) {
            aspectedPlanets.push({
              planet: targetPName,
              house: targetHouseNum,
              rashi: targetRashi,
              type: rule.type,
            });
          }
        }
      }
    }

    planetAspects[pName] = {
      planet: pName,
      sourceHouse,
      sourceRashi,
      aspectedHouses,
      aspectedPlanets,
    };
  }

  // Compute mutual aspects
  const mutualAspects: MutualAspect[] = [];
  const checkedPairs = new Set<string>();

  for (let i = 0; i < allPlanetNames.length; i++) {
    for (let j = i + 1; j < allPlanetNames.length; j++) {
      const p1 = allPlanetNames[i];
      const p2 = allPlanetNames[j];
      const pairKey = [p1, p2].sort().join(":");

      if (checkedPairs.has(pairKey)) continue;
      checkedPairs.add(pairKey);

      const p1AspP2 = planetAspects[p1]?.aspectedPlanets.find((a) => a.planet === p2);
      const p2AspP1 = planetAspects[p2]?.aspectedPlanets.find((a) => a.planet === p1);

      if (p1AspP2 && p2AspP1) {
        mutualAspects.push({
          planet1: p1,
          planet2: p2,
          planet1AspectOnPlanet2: p1AspP2.type,
          planet2AspectOnPlanet1: p2AspP1.type,
        });
      }
    }
  }

  return {
    planetAspects,
    houseAspects,
    mutualAspects,
  };
}
