import { Observer } from "astronomy-engine";
import { rashiNames, nakshatraNames, nakshatraLords } from "../core/constants";
import { RASHI_LORDS } from "../matching/constants";
import { getSunrise, getNakshatra, getNakshatraPada } from "../core/calculations";
import {
  Kundli,
  VargaChart,
  SpecialLagna,
  InduLagnaInfo,
  SpecialLagnasResult,
} from "./types";
import { createRashiCentricChart } from "./reference-charts";

/**
 * Planetary Kalas (Rays) according to Brihat Parashara Hora Shastra
 * for calculating Indu Lagna (Wealth Lagna).
 */
const INDU_KALAS: Record<string, number> = {
  Sun: 30,
  Moon: 16,
  Mars: 6,
  Mercury: 8,
  Jupiter: 10,
  Venus: 12,
  Saturn: 1,
};

function formatSpecialLagna(lon: number): SpecialLagna {
  const norm = ((lon % 360) + 360) % 360;
  const rashi0Based = Math.floor(norm / 30);
  const degreeDec = norm % 30;
  const deg = Math.floor(degreeDec);
  const minDec = (degreeDec - deg) * 60;
  const min = Math.floor(minDec);
  const sec = Math.round((minDec - min) * 60);
  const nakIdx = getNakshatra(norm);
  const nakName = nakshatraNames[nakIdx];
  const pada = getNakshatraPada(norm);

  return {
    longitude: Math.round(norm * 10000) / 10000,
    rashi: rashi0Based + 1,
    rashiName: rashiNames[rashi0Based],
    degree: deg,
    minute: min,
    second: sec,
    nakshatra: nakName,
    nakshatraLord: nakshatraLords[nakName],
    pada,
  };
}

/**
 * Calculates all Classical Special Lagnas according to Maharishi Parashara's
 * Brihat Parashara Hora Shastra (BPHS Chapter 5):
 *
 * 1. Ghatika Lagna (GL) - Power, authority, government and politics (1 rashi per ghati / 24 min).
 * 2. Hora Lagna (HL) - Financial riches and prosperity (1 rashi per 2.5 ghatis / 1 hour).
 * 3. Bhava Lagna (BL) - Physical vitality and strength (1 rashi per 5 ghatis / 2 hours).
 * 4. Shree Lagna (SL) - Auspiciousness, wealth and marriage blessings.
 * 5. Indu Lagna (IL) - Dhana Yoga and billionaire wealth potential.
 * 6. Pranapada Lagna (PP) - Life breath, vitality and birth time rectification.
 *
 * @param kundli Complete Janam Kundli
 * @param observer Location observer
 */
export function getSpecialLagnas(kundli: Kundli, observer?: Observer): SpecialLagnasResult {
  const date = kundli.birthDetails.rawDate || new Date(kundli.birthDetails.date);
  const obs = observer || new Observer(kundli.birthDetails.lat, kundli.birthDetails.lon, 0);

  // 1. Determine Sunrise
  let sunrise = getSunrise(date, obs);
  if (!sunrise || date.getTime() < sunrise.getTime()) {
    // If born before sunrise, the Vedic astrological day begins at the previous day's sunrise
    const prevDay = new Date(date.getTime() - 24 * 60 * 60 * 1000);
    sunrise = getSunrise(prevDay, obs) || new Date(date.getTime() - 12 * 60 * 60 * 1000);
  }

  const elapsedMs = Math.max(0, date.getTime() - sunrise.getTime());
  const elapsedMinutes = elapsedMs / (60 * 1000);
  const elapsedVighatis = (elapsedMinutes / 24) * 60; // 1 Ghati = 60 Vighatis = 24 minutes

  const sun = kundli.planets["Sun"];
  const moon = kundli.planets["Moon"];
  const sunLon = sun ? sun.longitude : 0;
  const moonLon = moon ? moon.longitude : 0;
  const lagnaLon = kundli.ascendant.longitude;

  // 2. Ghatika Lagna (GL)
  // Moves 1 sign (30 degrees) per 1 Ghati (24 minutes) -> 1.25 degrees per minute
  const glLon = (sunLon + elapsedMinutes * 1.25) % 360;
  const ghatikaLagna = formatSpecialLagna(glLon);

  // 3. Hora Lagna (HL)
  // Moves 1 sign (30 degrees) per 2.5 Ghatis (60 minutes / 1 hour) -> 0.5 degrees per minute
  const hlLon = (sunLon + elapsedMinutes * 0.5) % 360;
  const horaLagna = formatSpecialLagna(hlLon);

  // 4. Bhava Lagna (BL)
  // Moves 1 sign (30 degrees) per 5 Ghatis (120 minutes / 2 hours) -> 0.25 degrees per minute
  const blLon = (sunLon + elapsedMinutes * 0.25) % 360;
  const bhavaLagna = formatSpecialLagna(blLon);

  // 5. Shree Lagna (SL)
  // Add proportional traversal of Moon in its current Nakshatra (span: 13° 20' = 13.33333°) to Lagna
  const nakshatraSpan = 360 / 27; // 13.333333°
  const moonNakshatraTraversed = (((moonLon % 360) + 360) % 360) % nakshatraSpan;
  const moonFraction = moonNakshatraTraversed / nakshatraSpan;
  const slLon = (lagnaLon + moonFraction * 360) % 360;
  const shreeLagna = formatSpecialLagna(slLon);

  // 6. Indu Lagna (IL)
  // Kalas from 9th lord of Lagna + 9th lord of Moon
  const lagnaRashi0Based = (kundli.ascendant.rashi - 1) % 12;
  const moonRashi0Based = Math.floor((((moonLon % 360) + 360) % 360) / 30);

  const ninthFromLagna0Based = (lagnaRashi0Based + 8) % 12;
  const ninthFromMoon0Based = (moonRashi0Based + 8) % 12;

  const lordLagna9th = RASHI_LORDS[ninthFromLagna0Based];
  const lordMoon9th = RASHI_LORDS[ninthFromMoon0Based];

  const kalasLagna = INDU_KALAS[lordLagna9th] || 10;
  const kalasMoon = INDU_KALAS[lordMoon9th] || 10;
  const totalKalas = kalasLagna + kalasMoon;

  let remainder = totalKalas % 12;
  if (remainder === 0) remainder = 12;

  // Count remainder signs starting from Moon's sign inclusive
  const induRashi0Based = (moonRashi0Based + remainder - 1) % 12;
  const induLagna: InduLagnaInfo = {
    rashi: induRashi0Based + 1,
    rashiName: rashiNames[induRashi0Based],
    totalKalas,
    ninthLordFromLagna: lordLagna9th,
    ninthLordFromMoon: lordMoon9th,
    kalasLagnaNinth: kalasLagna,
    kalasMoonNinth: kalasMoon,
  };

  // 7. Pranapada Lagna (PP)
  // In BPHS: Vighatis from sunrise converted to degrees (each vighati = 0.4° or 24 arcsec)
  // Base point depends on whether Sun is in Movable, Fixed, or Dual sign
  const sunSign0Based = Math.floor((((sunLon % 360) + 360) % 360) / 30);
  let ppBaseLon = sunLon;
  if ([0, 3, 6, 9].includes(sunSign0Based)) {
    // Movable: Sun's sign
    ppBaseLon = sunLon;
  } else if ([1, 4, 7, 10].includes(sunSign0Based)) {
    // Fixed: 9th from Sun (240 degrees forward)
    ppBaseLon = (sunLon + 240) % 360;
  } else {
    // Dual: 5th from Sun (120 degrees forward)
    ppBaseLon = (sunLon + 120) % 360;
  }
  const ppLon = (ppBaseLon + elapsedVighatis * 0.4) % 360;
  const pranapadaLagna = formatSpecialLagna(ppLon);

  return {
    ghatikaLagna,
    horaLagna,
    bhavaLagna,
    shreeLagna,
    induLagna,
    pranapadaLagna,
  };
}

/**
 * Generates Ghatika Lagna (GL) Chart.
 * In BPHS & Jaimini, Ghatika Lagna is used to evaluate political power, executive authority,
 * status in bureaucracy/administration, and societal influence.
 *
 * @param kundli Complete Janam Kundli
 * @param observer Optional observer location
 */
export function getGhatikaChart(kundli: Kundli, observer?: Observer): VargaChart {
  const lagnas = kundli.specialLagnas || getSpecialLagnas(kundli, observer);
  return createRashiCentricChart(lagnas.ghatikaLagna.rashi, kundli.planets);
}

/**
 * Generates Hora Lagna (HL) Chart.
 * In BPHS, Hora Lagna is the premier special lagna for assessing financial liquid wealth,
 * trade fortunes, treasures, and prosperity.
 *
 * @param kundli Complete Janam Kundli
 * @param observer Optional observer location
 */
export function getHoraLagnaChart(kundli: Kundli, observer?: Observer): VargaChart {
  const lagnas = kundli.specialLagnas || getSpecialLagnas(kundli, observer);
  return createRashiCentricChart(lagnas.horaLagna.rashi, kundli.planets);
}

/**
 * Generates Bhava Lagna (BL) Chart.
 * In BPHS, Bhava Lagna indicates bodily stamina, physical foundation, and the life force.
 *
 * @param kundli Complete Janam Kundli
 * @param observer Optional observer location
 */
export function getBhavaLagnaChart(kundli: Kundli, observer?: Observer): VargaChart {
  const lagnas = kundli.specialLagnas || getSpecialLagnas(kundli, observer);
  return createRashiCentricChart(lagnas.bhavaLagna.rashi, kundli.planets);
}

/**
 * Generates Indu Lagna Chart.
 * In classical Parashari Jyotish, planets placed in or aspecting Indu Lagna produce
 * extraordinary Dhana Yogas (wealth yogas).
 *
 * @param kundli Complete Janam Kundli
 * @param observer Optional observer location
 */
export function getInduLagnaChart(kundli: Kundli, observer?: Observer): VargaChart {
  const lagnas = kundli.specialLagnas || getSpecialLagnas(kundli, observer);
  return createRashiCentricChart(lagnas.induLagna.rashi, kundli.planets);
}
