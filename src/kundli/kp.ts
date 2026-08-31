import { Observer, Body } from "astronomy-engine";
import { getAyanamsa, AyanamsaType } from "../core/ayanamsa";
import {
  getUdayaLagna,
  getMidheaven,
  getKpSubLordDetails,
  getPlanetaryPosition,
  getRahuPosition,
  getKetuPosition,
  getVara,
} from "../core/calculations";
import {
  rashiNames,
  nakshatraNames,
  vimshottariLords,
} from "../core/constants";
import { RASHI_LORDS } from "../matching/constants";
import {
  KpConfig,
  KpCusp,
  KpPlanet,
  KpHouse,
  KpSignificators,
  KpHouseSignificator,
  KpPlanetSignificator,
  KpRulingPlanets,
  KpChart,
} from "./kp-types";

// Day lords by weekday (0=Sunday to 6=Saturday)
const DAY_LORDS = [
  "Sun",
  "Moon",
  "Mars",
  "Mercury",
  "Jupiter",
  "Venus",
  "Saturn",
];

/**
 * Checks if a longitude falls within a sector [start, end) on a 360° circle.
 */
function isBetween(lon: number, start: number, end: number): boolean {
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
 * Normalizes an angle in degrees to [0, 360).
 */
function normDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Clamps a number to [-1, 1].
 */
function clamp(val: number, min = -1, max = 1): number {
  return Math.max(min, Math.min(max, val));
}

/**
 * Calculates the 12 Tropical Placidus house cusps using semi-arc trisection.
 *
 * @param mcTropical Tropical longitude of Midheaven in degrees
 * @param ascTropical Tropical longitude of Ascendant in degrees
 * @param latitude Geographic latitude in degrees
 * @param obliquity True obliquity of the ecliptic in degrees
 * @returns Array of 12 Tropical cusps in degrees (0-indexed: index 0 = House 1 / Ascendant)
 */
function calculateTropicalPlacidusCusps(
  mcTropical: number,
  ascTropical: number,
  latitude: number,
  obliquity: number,
): number[] {
  const rad = (d: number) => (d * Math.PI) / 180;
  const deg = (r: number) => (r * 180) / Math.PI;

  const epsRad = rad(obliquity);
  const latRad = rad(latitude);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);
  const tanLat = Math.tan(latRad);

  const getRaDec = (lonDeg: number) => {
    const lRad = rad(lonDeg);
    const sinL = Math.sin(lRad);
    const cosL = Math.cos(lRad);

    const ra = normDeg(deg(Math.atan2(sinL * cosEps, cosL)));
    const dec = deg(Math.asin(sinL * sinEps));
    return { ra, dec };
  };

  const mcTrop = normDeg(mcTropical);
  const ascTrop = normDeg(ascTropical);
  const icTrop = normDeg(mcTrop + 180);
  const dscTrop = normDeg(ascTrop + 180);

  const ramc = getRaDec(mcTrop).ra;

  // Helper to find lambda between startLon and endLon where (RA - ramc) matches targetOffset
  const solveInArc = (
    startLon: number,
    endLon: number,
    calcTargetRA: (lon: number) => number,
  ): number => {
    let low = 0;
    let high = normDeg(endLon - startLon);
    if (high === 0) high = 360;

    for (let iter = 0; iter < 32; iter++) {
      const mid = (low + high) / 2;
      const testLon = normDeg(startLon + mid);
      const { ra } = getRaDec(testLon);
      const targetRA = calcTargetRA(testLon);

      const diff = normDeg(ra - targetRA);
      if (diff < 180) {
        high = mid;
      } else {
        low = mid;
      }
    }

    return normDeg(startLon + (low + high) / 2);
  };

  // Diurnal semi-arc for Cusp 11 and 12 (between MC and ASC)
  const cusp11 = solveInArc(mcTrop, ascTrop, (testLon) => {
    const { dec } = getRaDec(testLon);
    const sinD = clamp(tanLat * Math.tan(rad(dec)));
    const dsa = 90 + deg(Math.asin(sinD));
    return normDeg(ramc + (1 / 3) * dsa);
  });

  const cusp12 = solveInArc(mcTrop, ascTrop, (testLon) => {
    const { dec } = getRaDec(testLon);
    const sinD = clamp(tanLat * Math.tan(rad(dec)));
    const dsa = 90 + deg(Math.asin(sinD));
    return normDeg(ramc + (2 / 3) * dsa);
  });

  // Nocturnal semi-arc for Cusp 2 and 3 (between ASC and IC)
  const cusp2 = solveInArc(ascTrop, icTrop, (testLon) => {
    const { dec } = getRaDec(testLon);
    const sinD = clamp(tanLat * Math.tan(rad(dec)));
    const dsa = 90 + deg(Math.asin(sinD));
    const nsa = 180 - dsa;
    return normDeg(ramc + dsa + (1 / 3) * nsa);
  });

  const cusp3 = solveInArc(ascTrop, icTrop, (testLon) => {
    const { dec } = getRaDec(testLon);
    const sinD = clamp(tanLat * Math.tan(rad(dec)));
    const dsa = 90 + deg(Math.asin(sinD));
    const nsa = 180 - dsa;
    return normDeg(ramc + dsa + (2 / 3) * nsa);
  });

  // Opposite cusps (add 180°)
  const cusp5 = normDeg(cusp11 + 180);
  const cusp6 = normDeg(cusp12 + 180);
  const cusp8 = normDeg(cusp2 + 180);
  const cusp9 = normDeg(cusp3 + 180);

  return [
    ascTrop, // Cusp 1
    cusp2, // Cusp 2
    cusp3, // Cusp 3
    icTrop, // Cusp 4
    cusp5, // Cusp 5
    cusp6, // Cusp 6
    dscTrop, // Cusp 7
    cusp8, // Cusp 8
    cusp9, // Cusp 9
    mcTrop, // Cusp 10
    cusp11, // Cusp 11
    cusp12, // Cusp 12
  ];
}

/**
 * Generates a complete KP Chart (Krishnamurti Paddhati) for a given date and location.
 *
 * Features:
 * - KP Ayanamsa calculation
 * - Placidus House Cusps (1 to 12)
 * - 4-Fold Lords for Cusps and Planets (Sign, Star, Sub, Sub-Sub Lord)
 * - Exact planetary placement into Placidus houses
 * - 4-Level KP Significators (Level A, B, C, D) for all houses and planets
 * - KP Ruling Planets (Ascendant, Moon, Day Lord)
 *
 * @param date Birth date / observation time
 * @param observer Geographic location
 * @param config Optional KP configuration
 * @returns KpChart object
 */
export function getKpChart(
  date: Date,
  observer: Observer,
  config: KpConfig = {},
): KpChart {
  const ayanamsaType: AyanamsaType = config.ayanamsa || "kp";
  const ayanamsa = getAyanamsa(date, ayanamsaType);

  // 1. Calculate Tropical Placidus Cusps
  // Ascendant (Tropical)
  const tropAsc = getUdayaLagna(date, observer, 0);
  // Midheaven (Tropical)
  const tropMC = getMidheaven(date, observer, 0);

  // Calculate tropical Placidus cusps
  const tropicalCusps = calculateTropicalPlacidusCusps(
    tropMC,
    tropAsc,
    observer.latitude,
    23.4392911,
  );

  // 2. Convert Cusps to Sidereal and compute KP 4-fold Lords
  const cusps: KpCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const sidLon = normDeg(tropicalCusps[i] - ayanamsa);
    const details = getKpSubLordDetails(sidLon);

    const nextSidLon = normDeg(tropicalCusps[(i + 1) % 12] - ayanamsa);
    const span = normDeg(nextSidLon - sidLon);

    const degInSign = details.degreeInRashi;
    const d = Math.floor(degInSign);
    const mDec = (degInSign - d) * 60;
    const m = Math.floor(mDec);
    const s = Math.round((mDec - m) * 60);

    cusps.push({
      houseNumber: i + 1,
      longitude: sidLon,
      degree: d,
      minute: m,
      second: s,
      rashi: details.rashiIndex + 1,
      rashiName: details.rashiName,
      rashiLord: details.rashiLord,
      nakshatra: details.nakshatraIndex + 1,
      nakshatraName: details.nakshatraName,
      nakshatraLord: details.nakshatraLord,
      subLord: details.subLord,
      subSubLord: details.subSubLord,
      startLongitude: sidLon,
      endLongitude: nextSidLon,
      span,
      planets: [],
    });
  }

  // 3. Calculate Planetary Positions with KP Ayanamsa
  const planets: Record<string, KpPlanet> = {};
  const bodies = [
    Body.Sun,
    Body.Moon,
    Body.Mercury,
    Body.Venus,
    Body.Mars,
    Body.Jupiter,
    Body.Saturn,
    Body.Uranus,
    Body.Neptune,
    Body.Pluto,
  ];
  const bodyNames = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  bodies.forEach((body, idx) => {
    const name = bodyNames[idx];
    const pos = getPlanetaryPosition(body, date, ayanamsa);
    const details = getKpSubLordDetails(pos.longitude);

    // Find which Placidus house this planet falls into
    let houseNum = 1;
    let housePosDeg = 0;

    for (let h = 0; h < 12; h++) {
      const cStart = cusps[h].startLongitude;
      const cEnd = cusps[h].endLongitude;
      if (isBetween(pos.longitude, cStart, cEnd)) {
        houseNum = h + 1;
        housePosDeg = normDeg(pos.longitude - cStart);
        cusps[h].planets.push(name);
        break;
      }
    }

    const hDeg = Math.floor(housePosDeg);
    const hMinDec = (housePosDeg - hDeg) * 60;
    const hMin = Math.floor(hMinDec);

    const dInSign = details.degreeInRashi;
    const pDeg = Math.floor(dInSign);
    const pMinDec = (dInSign - pDeg) * 60;
    const pMin = Math.floor(pMinDec);
    const pSec = Math.round((pMinDec - pMin) * 60);

    planets[name] = {
      name,
      longitude: pos.longitude,
      degree: pDeg,
      minute: pMin,
      second: pSec,
      rashi: details.rashiIndex + 1,
      rashiName: details.rashiName,
      rashiLord: details.rashiLord,
      nakshatra: details.nakshatraIndex + 1,
      nakshatraName: details.nakshatraName,
      nakshatraLord: details.nakshatraLord,
      subLord: details.subLord,
      subSubLord: details.subSubLord,
      house: houseNum,
      housePosition: housePosDeg,
      housePositionDegree: hDeg,
      housePositionMinute: hMin,
      isRetrograde: pos.isRetrograde,
      isCombust: pos.isCombust,
      speed: pos.speed,
    };
  });

  // Nodes (Rahu and Ketu)
  const rahuPos = getRahuPosition(date, ayanamsa);
  const ketuPos = getKetuPosition(rahuPos);

  [
    { name: "Rahu", pos: rahuPos },
    { name: "Ketu", pos: ketuPos },
  ].forEach(({ name, pos }) => {
    const details = getKpSubLordDetails(pos.longitude);

    let houseNum = 1;
    let housePosDeg = 0;

    for (let h = 0; h < 12; h++) {
      const cStart = cusps[h].startLongitude;
      const cEnd = cusps[h].endLongitude;
      if (isBetween(pos.longitude, cStart, cEnd)) {
        houseNum = h + 1;
        housePosDeg = normDeg(pos.longitude - cStart);
        cusps[h].planets.push(name);
        break;
      }
    }

    const hDeg = Math.floor(housePosDeg);
    const hMinDec = (housePosDeg - hDeg) * 60;
    const hMin = Math.floor(hMinDec);

    const dInSign = details.degreeInRashi;
    const pDeg = Math.floor(dInSign);
    const pMinDec = (dInSign - pDeg) * 60;
    const pMin = Math.floor(pMinDec);
    const pSec = Math.round((pMinDec - pMin) * 60);

    planets[name] = {
      name,
      longitude: pos.longitude,
      degree: pDeg,
      minute: pMin,
      second: pSec,
      rashi: details.rashiIndex + 1,
      rashiName: details.rashiName,
      rashiLord: details.rashiLord,
      nakshatra: details.nakshatraIndex + 1,
      nakshatraName: details.nakshatraName,
      nakshatraLord: details.nakshatraLord,
      subLord: details.subLord,
      subSubLord: details.subSubLord,
      house: houseNum,
      housePosition: housePosDeg,
      housePositionDegree: hDeg,
      housePositionMinute: hMin,
      isRetrograde: true, // Nodes are always retrograde
      isCombust: false,
    };
  });

  // 4. Construct Houses
  const houses: KpCusp[] = cusps;

  // 5. Calculate KP Significators (Levels A, B, C, D)
  const includeSignificators = config.includeSignificators !== false;
  let significators: KpSignificators | undefined = undefined;

  if (includeSignificators) {
    const houseSigMap: Record<number, KpHouseSignificator> = {};
    const planetSigMap: Record<string, KpPlanetSignificator> = {};

    // Initialize planet significator records (for the 9 primary Vedic planets)
    const primaryPlanets = [
      "Sun",
      "Moon",
      "Mars",
      "Mercury",
      "Jupiter",
      "Venus",
      "Saturn",
      "Rahu",
      "Ketu",
    ];
    primaryPlanets.forEach((pName) => {
      planetSigMap[pName] = {
        planetName: pName,
        levelA: [],
        levelB: [],
        levelC: [],
        levelD: [],
        allHouses: [],
      };
    });

    // Initialize house significator records
    for (let h = 1; h <= 12; h++) {
      houseSigMap[h] = {
        houseNumber: h,
        levelA: [],
        levelB: [],
        levelC: [],
        levelD: [],
      };
    }

    // Level B: Occupants of the house
    for (let h = 1; h <= 12; h++) {
      const occupants = cusps[h - 1].planets.filter((p) =>
        primaryPlanets.includes(p),
      );
      houseSigMap[h].levelB = occupants;
      occupants.forEach((pName) => {
        if (planetSigMap[pName]) planetSigMap[pName].levelB.push(h);
      });
    }

    // Level D: Lord of the house
    for (let h = 1; h <= 12; h++) {
      const hLord = cusps[h - 1].rashiLord;
      if (hLord && !houseSigMap[h].levelD.includes(hLord)) {
        houseSigMap[h].levelD.push(hLord);
        if (planetSigMap[hLord]) planetSigMap[hLord].levelD.push(h);
      }
    }

    // Level A: Planet in constellation of occupant of the house
    // Level C: Planet in constellation of lord of the house
    primaryPlanets.forEach((pName) => {
      const p = planets[pName];
      if (!p) return;
      const starLord = p.nakshatraLord;

      for (let h = 1; h <= 12; h++) {
        // If starLord is in Level B (occupant), p is in Level A for house h
        if (houseSigMap[h].levelB.includes(starLord)) {
          if (!houseSigMap[h].levelA.includes(pName))
            houseSigMap[h].levelA.push(pName);
          if (planetSigMap[pName]) planetSigMap[pName].levelA.push(h);
        }
        // If starLord is in Level D (house lord), p is in Level C for house h
        if (houseSigMap[h].levelD.includes(starLord)) {
          if (!houseSigMap[h].levelC.includes(pName))
            houseSigMap[h].levelC.push(pName);
          if (planetSigMap[pName]) planetSigMap[pName].levelC.push(h);
        }
      }
    });

    // Compute allHouses for each planet
    primaryPlanets.forEach((pName) => {
      const pSig = planetSigMap[pName];
      if (pSig) {
        const combined = Array.from(
          new Set([
            ...pSig.levelA,
            ...pSig.levelB,
            ...pSig.levelC,
            ...pSig.levelD,
          ]),
        );
        combined.sort((a, b) => a - b);
        pSig.allHouses = combined;
      }
    });

    significators = {
      houses: houseSigMap,
      planets: planetSigMap,
    };
  }

  // 6. Calculate KP Ruling Planets (RP)
  const includeRulingPlanets = config.includeRulingPlanets !== false;
  let rulingPlanets: KpRulingPlanets | undefined = undefined;

  if (includeRulingPlanets) {
    const ascCusp = cusps[0];
    const moon = planets["Moon"];
    const vara = getVara(date, observer);
    const dayLord = DAY_LORDS[vara];

    const rpList: string[] = [];
    const addRp = (l: string) => {
      if (l && !rpList.includes(l)) rpList.push(l);
    };

    addRp(ascCusp.subLord);
    addRp(ascCusp.nakshatraLord);
    addRp(ascCusp.rashiLord);
    if (moon) {
      addRp(moon.subLord);
      addRp(moon.nakshatraLord);
      addRp(moon.rashiLord);
    }
    addRp(dayLord);

    rulingPlanets = {
      ascendant: {
        rashiLord: ascCusp.rashiLord,
        nakshatraLord: ascCusp.nakshatraLord,
        subLord: ascCusp.subLord,
      },
      moon: {
        rashiLord: moon ? moon.rashiLord : "",
        nakshatraLord: moon ? moon.nakshatraLord : "",
        subLord: moon ? moon.subLord : "",
      },
      dayLord,
      rulingPlanetsList: rpList,
    };
  }

  // Midheaven info
  const mcCusp = cusps[9];

  return {
    birthDetails: {
      date: date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
      time: date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
      lat: observer.latitude,
      lon: observer.longitude,
      timezone: date.getTimezoneOffset(),
    },
    ayanamsa,
    ayanamsaName: ayanamsaType.toUpperCase(),
    ascendant: cusps[0],
    midheaven: {
      longitude: mcCusp.longitude,
      degree: mcCusp.degree,
      minute: mcCusp.minute,
      second: mcCusp.second,
      rashi: mcCusp.rashi,
      rashiName: mcCusp.rashiName,
      rashiLord: mcCusp.rashiLord,
      nakshatraName: mcCusp.nakshatraName,
      nakshatraLord: mcCusp.nakshatraLord,
      subLord: mcCusp.subLord,
    },
    cusps,
    planets,
    houses,
    significators,
    rulingPlanets,
  };
}

/**
 * Formats a KP Chart into a readable, comprehensive ASCII table report.
 *
 * @param kpChart Complete KP chart object
 * @returns Formatted string report
 */
export function formatKpChart(kpChart: KpChart): string {
  let result = "=== KP CHART (KRISHNAMURTI PADDHATI) ===\n\n";

  result += `Date: ${kpChart.birthDetails.date}  Time: ${kpChart.birthDetails.time}\n`;
  result += `Lat: ${kpChart.birthDetails.lat.toFixed(4)}°  Lon: ${kpChart.birthDetails.lon.toFixed(4)}°\n`;
  result += `Ayanamsa: ${kpChart.ayanamsaName} (${kpChart.ayanamsa.toFixed(4)}°)\n\n`;

  result += "--- PLACIDUS HOUSE CUSPS (4-FOLD KP LORDS) ---\n";
  result +=
    "Cusp | Degree       | Sign        | Sign Lord | Star Lord | Sub Lord  | Sub-Sub   | Planets in House\n";
  result +=
    "-----------------------------------------------------------------------------------------------------\n";
  kpChart.cusps.forEach((c) => {
    const cNum = String(c.houseNumber).padStart(2, " ");
    const degStr =
      `${c.degree}°${String(c.minute).padStart(2, "0")}'${String(c.second).padStart(2, "0")}"`.padEnd(
        12,
        " ",
      );
    const signStr = c.rashiName.padEnd(11, " ");
    const sLord = c.rashiLord.padEnd(9, " ");
    const stLord = c.nakshatraLord.padEnd(9, " ");
    const subL = c.subLord.padEnd(9, " ");
    const subSubL = c.subSubLord.padEnd(9, " ");
    const plStr = c.planets.length > 0 ? c.planets.join(", ") : "-";
    result += `C${cNum}  | ${degStr} | ${signStr} | ${sLord} | ${stLord} | ${subL} | ${subSubL} | ${plStr}\n`;
  });

  result += "\n--- PLANETARY POSITIONS (KP 4-FOLD LORDS & HOUSES) ---\n";
  result +=
    "Planet  | Motion | Degree       | Sign        | Star Lord | Sub Lord  | Sub-Sub   | House | Into House\n";
  result +=
    "----------------------------------------------------------------------------------------------------\n";
  Object.values(kpChart.planets).forEach((p) => {
    const pName = p.name.padEnd(7, " ");
    const motion =
      (p.isRetrograde ? "[R]" : "   ") + (p.isCombust ? "[C]" : "   ");
    const degStr =
      `${p.degree}°${String(p.minute).padStart(2, "0")}'${String(p.second).padStart(2, "0")}"`.padEnd(
        12,
        " ",
      );
    const signStr = p.rashiName.padEnd(11, " ");
    const stLord = p.nakshatraLord.padEnd(9, " ");
    const subL = p.subLord.padEnd(9, " ");
    const subSubL = p.subSubLord.padEnd(9, " ");
    const hStr = String(p.house).padStart(2, " ");
    const intoStr = `${p.housePositionDegree}°${String(p.housePositionMinute).padStart(2, "0")}' (${p.housePosition.toFixed(2)}°)`;
    result += `${pName} | ${motion} | ${degStr} | ${signStr} | ${stLord} | ${subL} | ${subSubL} | H${hStr}   | ${intoStr}\n`;
  });

  if (kpChart.significators) {
    result += "\n--- KP HOUSE SIGNIFICATORS (LEVELS A, B, C, D) ---\n";
    result +=
      "House | Level A (Strongest) | Level B (Occupants) | Level C            | Level D (Lord)\n";
    result +=
      "--------------------------------------------------------------------------------------------\n";
    for (let h = 1; h <= 12; h++) {
      const sig = kpChart.significators.houses[h];
      const hNum = String(h).padStart(2, " ");
      const aStr = (sig.levelA.length ? sig.levelA.join(", ") : "-").padEnd(
        19,
        " ",
      );
      const bStr = (sig.levelB.length ? sig.levelB.join(", ") : "-").padEnd(
        19,
        " ",
      );
      const cStr = (sig.levelC.length ? sig.levelC.join(", ") : "-").padEnd(
        18,
        " ",
      );
      const dStr = sig.levelD.length ? sig.levelD.join(", ") : "-";
      result += `H${hNum}   | ${aStr} | ${bStr} | ${cStr} | ${dStr}\n`;
    }

    result += "\n--- KP PLANET SIGNIFICATORS (HOUSES SIGNIFIED) ---\n";
    result +=
      "Planet  | Level A       | Level B       | Level C       | Level D       | All Houses\n";
    result +=
      "------------------------------------------------------------------------------------\n";
    Object.values(kpChart.significators.planets).forEach((pSig) => {
      const pName = pSig.planetName.padEnd(7, " ");
      const aStr = (pSig.levelA.length ? pSig.levelA.join(",") : "-").padEnd(
        13,
        " ",
      );
      const bStr = (pSig.levelB.length ? pSig.levelB.join(",") : "-").padEnd(
        13,
        " ",
      );
      const cStr = (pSig.levelC.length ? pSig.levelC.join(",") : "-").padEnd(
        13,
        " ",
      );
      const dStr = (pSig.levelD.length ? pSig.levelD.join(",") : "-").padEnd(
        13,
        " ",
      );
      const allStr = pSig.allHouses.length ? pSig.allHouses.join(", ") : "-";
      result += `${pName} | ${aStr} | ${bStr} | ${cStr} | ${dStr} | ${allStr}\n`;
    });
  }

  if (kpChart.rulingPlanets) {
    result += "\n--- KP RULING PLANETS (RP) ---\n";
    const rp = kpChart.rulingPlanets;
    result += `Ascendant: Sign Lord = ${rp.ascendant.rashiLord}, Star Lord = ${rp.ascendant.nakshatraLord}, Sub Lord = ${rp.ascendant.subLord}\n`;
    result += `Moon:      Sign Lord = ${rp.moon.rashiLord}, Star Lord = ${rp.moon.nakshatraLord}, Sub Lord = ${rp.moon.subLord}\n`;
    result += `Day Lord:  ${rp.dayLord}\n`;
    result += `Ruling Planets (Ordered): ${rp.rulingPlanetsList.join(", ")}\n`;
  }

  return result;
}

/**
 * Gets detailed KP information for a specific planet.
 *
 * @param kpChart Complete KP chart
 * @param planetName Name of planet
 * @returns KpPlanet or null if not found
 */
export function getKpPlanetInfo(
  kpChart: KpChart,
  planetName: string,
): KpPlanet | null {
  return kpChart.planets[planetName] || null;
}

/**
 * Gets all planets located in a specific KP house.
 *
 * @param kpChart Complete KP chart
 * @param houseNumber House number (1-12)
 * @returns Array of planet names
 */
export function getPlanetsInKpHouse(
  kpChart: KpChart,
  houseNumber: number,
): string[] {
  const house = kpChart.houses.find((h) => h.houseNumber === houseNumber);
  return house ? [...house.planets] : [];
}

/**
 * Gets detailed cusp information for a specific KP house.
 *
 * @param kpChart Complete KP chart
 * @param houseNumber House number (1-12)
 * @returns KpCusp or null if not found
 */
export function getKpCuspInfo(
  kpChart: KpChart,
  houseNumber: number,
): KpCusp | null {
  return kpChart.cusps.find((c) => c.houseNumber === houseNumber) || null;
}

/**
 * Retrieves the KP Significators from a KP chart.
 *
 * @param kpChart Complete KP chart
 * @returns KpSignificators or null
 */
export function getKpSignificators(kpChart: KpChart): KpSignificators | null {
  return kpChart.significators || null;
}

/**
 * Retrieves the KP Ruling Planets from a KP chart.
 *
 * @param kpChart Complete KP chart
 * @returns KpRulingPlanets or null
 */
export function getKpRulingPlanets(kpChart: KpChart): KpRulingPlanets | null {
  return kpChart.rulingPlanets || null;
}
