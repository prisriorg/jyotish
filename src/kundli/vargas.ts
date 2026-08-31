import { rashiNames } from "../core/constants";
import { Body } from "astronomy-engine";
import { VargaChart, Bhava } from "./types";
import { getHouses } from "./houses";

// --- Helper for creating full Chart ---
function createVargaChart(
  ascendantLength: number,
  planets: Record<string, { longitude: number }>,
  calculationFn: (lon: number) => number,
): VargaChart {
  const ascRashi = calculationFn(ascendantLength);
  const dPlanets: Record<string, { rashi: number; rashiName: string }> = {};

  for (const [name, data] of Object.entries(planets)) {
    const sign = calculationFn(data.longitude);
    dPlanets[name] = { rashi: sign + 1, rashiName: rashiNames[sign] };
  }

  // Assign planets to Houses (Whole Sign System for Vargas)
  // House 1 is the sign of the Ascendant.
  const ascDegree = ascRashi * 30 + 15;
  const houses = getHouses(ascDegree, "whole_sign");

  for (const [pName, pData] of Object.entries(dPlanets)) {
    const pRashi = pData.rashi;
    const house = houses.find((h: Bhava) => h.rashi === pRashi);
    if (house) house.planets.push(pName);
  }

  return {
    ascendant: { rashi: ascRashi + 1, rashiName: rashiNames[ascRashi] },
    planets: dPlanets,
    houses: houses,
  };
}

// --- Helper for normalizing longitude to [0, 360) ---
function norm360(longitude: number): number {
  return ((longitude % 360) + 360) % 360;
}

// --- D1 (Rashi): The main birth chart, covering overall physical appearance, health, and life's direction.
function getRashiSign(longitude: number): number {
  const norm = norm360(longitude);
  return Math.floor(norm / 30);
}

// --- D-2 (Hora): Wealth and accumulated resources.
// Parashara Hora: Odd Signs (0-15° = Sun/Leo, 15-30° = Moon/Cancer)
// Even Signs (0-15° = Moon/Cancer, 15-30° = Sun/Leo)
function getHoraSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;
  const isOdd = rashi % 2 === 0; // 0=Aries (Odd)

  if (isOdd) {
    return degrees < 15 ? 4 : 3; // Leo(4), Cancer(3)
  } else {
    return degrees < 15 ? 3 : 4; // Cancer(3), Leo(4)
  }
}

// --- D-3 (Drekkana): Co-borns (siblings), courage, and happiness.
// 0-10: Same Sign, 10-20: 5th, 20-30: 9th
function getDrekkanaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;

  if (degrees < 10) return rashi;
  if (degrees < 20) return (rashi + 4) % 12;
  return (rashi + 8) % 12;
}

// --- D-4 (Chaturthamsha): Fixed assets, land, and overall luck. ---
function getChaturthamshaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;
  const part = Math.min(3, Math.floor(degrees / 7.5));
  return (rashi + part * 3) % 12;
}

// --- D-7 (Saptamansha): Children, grandchildren, and creative projects. ---
function getSaptamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;
  const part = Math.min(6, Math.floor(degrees / (30 / 7))); // 0 to 6
  const isOdd = rashi % 2 === 0;

  if (isOdd) {
    return (rashi + part) % 12;
  } else {
    const startSign = (rashi + 6) % 12;
    return (startSign + part) % 12;
  }
}

// --- D-9 (Navamsa): Spouse, married life, and ultimate strength of planets. ---
export function getNavamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const navamsaSpan = 360 / 108;
  const index = Math.floor(norm / navamsaSpan);
  return index % 12;
}

// --- D-10 (Dashamsha): Career, professional achievements, and status. ---
function getDasamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;
  const part = Math.min(9, Math.floor(degrees / 3));
  const isOdd = rashi % 2 === 0;

  if (isOdd) {
    return (rashi + part) % 12;
  } else {
    const startSign = (rashi + 8) % 12;
    return (startSign + part) % 12;
  }
}

// --- D-12 (Dwadashamsha): Parents, ancestors, and lineage. ---
function getDwadasamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashi = Math.floor(norm / 30);
  const degrees = norm % 30;
  const part = Math.min(11, Math.floor(degrees / 2.5));
  return (rashi + part) % 12;
}

// --- D-16 (Shodashamsha): Vehicles, luxuries, and pleasures. ---
// Movable: Starts from Aries (0), Fixed: Starts from Leo (4), Dual: Starts from Sagittarius (8)
function getShodasamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const signNumber = Math.floor(norm / 30); // 0-11
  const degreeInSign = norm % 30;
  const part = Math.min(15, Math.floor(degreeInSign / 1.875)); // 0-15

  let startSign;
  // Determine start sign based on Rasi Type
  if ([0, 3, 6, 9].includes(signNumber))
    startSign = 0; // Movable
  else if ([1, 4, 7, 10].includes(signNumber))
    startSign = 4; // Fixed
  else startSign = 8; // Dual

  return (startSign + part) % 12;
}

// --- D-20 (Vimshamsha): Spiritual practices, belief systems, and auspiciousness. ---
function getVimsamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const sign = Math.floor(norm / 30); // 0-11
  const degreesInSign = norm % 30;
  const division = Math.min(20, Math.floor(degreesInSign / 1.5) + 1); // 1-20

  // Sign types: Movable (0,3,6,9), Fixed (1,4,7,10), Dual (2,5,8,11)
  let startSign;
  if (sign % 3 === 0)
    startSign = 0; // Movable -> Aries (0)
  else if (sign % 3 === 1)
    startSign = 8; // Fixed -> Sagittarius (8)
  else startSign = 4; // Dual -> Leo (4)

  return (startSign + (division - 1)) % 12;
}

// --- D-24 (Chaturvimshamsha): Education, learning, and academic success. ---
function getChaturvimshamsaSign(longitude: number): number {
  const norm = norm360(longitude);
  const signNumber = Math.floor(norm / 30); // 0-11
  const degreeInSign = norm % 30; // 0-29.99

  // Each part is 1.25 degrees (30 / 24)
  const division = Math.min(23, Math.floor(degreeInSign / 1.25)); // 0-23

  // Odd sign: Starts from Leo (4)
  if (signNumber % 2 === 0) {
    return (4 + division) % 12;
  }
  // Even sign: Starts from Cancer (3)
  else {
    return (3 + division) % 12;
  }
}

// --- D-27 (Saptavimshamsha): Strength, weaknesses, and general endurance. ---
function getSaptavimshamshaSign(longitude: number): number {
  const norm = norm360(longitude);
  const rashiIndex = Math.floor(norm / 30);
  const degreeInRashi = norm % 30;

  // 27 divisions of 30/27 degrees each
  const divisionSize = 30 / 27; // 1.111111...
  const division = Math.min(26, Math.floor(degreeInRashi / divisionSize)); // 0-26

  // Starting sign based on element
  // Fiery: Aries (0) | Earthy: Cancer (3) | Airy: Libra (6) | Watery: Capricorn (9)
  let startSign;
  if ([0, 4, 8].includes(rashiIndex))
    startSign = 0; // Aries
  else if ([1, 5, 9].includes(rashiIndex))
    startSign = 3; // Cancer
  else if ([2, 6, 10].includes(rashiIndex))
    startSign = 6; // Libra
  else startSign = 9; // Capricorn

  return (startSign + division) % 12;
}

// --- D-30 (Trimshamsha): Misfortunes, obstacles, and debts. ---
// In BPHS:
// Odd Signs: Mars (0-5° Aries), Saturn (5-10° Aquarius), Jupiter (10-18° Sagittarius), Mercury (18-25° Gemini), Venus (25-30° Libra)
// Even Signs: Venus (0-5° Taurus), Mercury (5-12° Virgo), Jupiter (12-20° Pisces), Saturn (20-25° Capricorn), Mars (25-30° Scorpio)
function getTrimshamshaSign(longitude: number): number {
  const norm = norm360(longitude);
  const sign = Math.floor(norm / 30);
  const degree = norm % 30;
  const isOddSign = sign % 2 === 0; // 0=Aries (Odd), 1=Taurus (Even), etc.

  if (isOddSign) {
    if (degree < 5) return 0;       // Mars (Aries)
    if (degree < 10) return 10;     // Saturn (Aquarius)
    if (degree < 18) return 8;      // Jupiter (Sagittarius)
    if (degree < 25) return 2;      // Mercury (Gemini)
    return 6;                       // Venus (Libra)
  } else {
    if (degree < 5) return 1;       // Venus (Taurus)
    if (degree < 12) return 5;      // Mercury (Virgo)
    if (degree < 20) return 11;     // Jupiter (Pisces)
    if (degree < 25) return 9;      // Saturn (Capricorn)
    return 7;                       // Mars (Scorpio)
  }
}

// --- D-40 (Khavedamsha): Auspicious and inauspicious effects, specifically concerning maternal lineage. ---
export function getKhavedamshaSign(longitude: number): number {
  const lon = norm360(longitude);
  const rashi = Math.floor(lon / 30);
  const within = lon - rashi * 30;
  const partSize = 0.75;
  const division = Math.min(40, Math.floor(within / partSize) + 1);

  // Odd signs: Aries (0), Even signs: Libra (6)
  const isOddRashiZeroBased = rashi % 2 === 0;
  const startSign = isOddRashiZeroBased ? 0 : 6;

  return (startSign + (division - 1)) % 12;
}

// --- D-45 (Akshavedamsha): Overall character, reputation, and general well-being. ---
export function getAkshavedamshaSign(longitude: number): number {
  const norm = norm360(longitude);
  const sign = Math.floor(norm / 30);
  const longWithinSign = norm % 30;
  const division = Math.min(44, Math.floor(longWithinSign / (40 / 60)));

  let startSign;
  if ([0, 3, 6, 9].includes(sign)) {
    startSign = 0; // Movable -> Aries
  } else if ([1, 4, 7, 10].includes(sign)) {
    startSign = 4; // Fixed -> Leo
  } else {
    startSign = 8; // Dual -> Sagittarius
  }

  return (startSign + division) % 12;
}

// --- D-60 (Shashtyamsha): Past life karma and deep, minute karmic patterns. --- 
// In BPHS: Each sign is divided into 60 parts of 0.5° (30') each.
// The signs advance sequentially starting from the sign itself: (signIndex + part) % 12.
export function getShastiamsaSign(longitude: number): number {
  const normalized = norm360(longitude);
  const signIndex = Math.floor(normalized / 30); // 0–11
  const degreeInSign = normalized % 30;
  const part = Math.min(59, Math.floor(degreeInSign / 0.5)); // 0–59

  return (signIndex + part) % 12;
}



// --- Main Export ---
export function getAllVargas(
  ascendantLength: number,
  planets: Record<string, { longitude: number }>,
): Record<string, VargaChart> {
  return {
    d1: createVargaChart(ascendantLength, planets, getRashiSign),
    d2: createVargaChart(ascendantLength, planets, getHoraSign),
    d3: createVargaChart(ascendantLength, planets, getDrekkanaSign),
    d4: createVargaChart(ascendantLength, planets, getChaturthamshaSign),
    d7: createVargaChart(ascendantLength, planets, getSaptamsaSign),
    d9: createVargaChart(ascendantLength, planets, getNavamsaSign),
    d10: createVargaChart(ascendantLength, planets, getDasamsaSign),
    d12: createVargaChart(ascendantLength, planets, getDwadasamsaSign),
    d16: createVargaChart(ascendantLength, planets, getShodasamsaSign),
    d20: createVargaChart(ascendantLength, planets, getVimsamsaSign),
    d24: createVargaChart(ascendantLength, planets, getChaturvimshamsaSign),
    d27: createVargaChart(ascendantLength, planets, getSaptavimshamshaSign),
    d30: createVargaChart(ascendantLength, planets, getTrimshamshaSign),
    d40: createVargaChart(ascendantLength, planets, getKhavedamshaSign),
    d45: createVargaChart(ascendantLength, planets, getAkshavedamshaSign),
    d60: createVargaChart(ascendantLength, planets, getShastiamsaSign),
  };
}

// Keep the old single export for backward compatibility or direct use if needed,
// though getAllVargas covers it.
export function getNavamsaChart(
  ascendantLength: number,
  planets: Record<string, { longitude: number }>,
): VargaChart {
  return createVargaChart(ascendantLength, planets, getNavamsaSign);
}
