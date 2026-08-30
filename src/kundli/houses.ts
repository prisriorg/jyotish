import { Bhava, KundliConfig } from "./types";

/**
 * Calculates the House (Bhava) cusps and spans based on the given system.
 *
 * @param ascendantLongitude Sidereal longitude of the Ascendant (Lagna) in degrees (0-360).
 * @param system 'whole_sign' | 'equal_house' (Default: 'whole_sign')
 * @returns Array of 12 Bhava objects.
 */
export function getHouses(
  ascendantLongitude: number,
  system: KundliConfig["houseSystem"] = "whole_sign",
): Bhava[] {
  const bhavas: Bhava[] = [];

  // 1. Whole Sign House System (Standard for BPHS)
  // The Rashi containing the Ascendant is the entire 1st House.
  // e.g., if Ascendant is 45° (Taurus 15°), 1st House is 30°-60°.
  if (system === "whole_sign") {
    const ascendantRashi = Math.floor(ascendantLongitude / 30); // 0-11
    const startOfRashi = ascendantRashi * 30;

    for (let i = 0; i < 12; i++) {
      const currentRashi = (ascendantRashi + i) % 12;
      const houseStart = (startOfRashi + i * 30) % 360;
      const houseEnd = (houseStart + 30) % 360;

      // In Whole Sign, the cusp is conceptually the start of the sign (or 15 deg in some traditions, but mostly start)
      // We'll set the cusp as 0 deg of that sign.

      bhavas.push({
        number: i + 1,
        rashi: currentRashi + 1,
        longitude: houseStart, // Cusp is start of sign
        startLongitude: houseStart,
        endLongitude: houseEnd,
        planets: [], // Populated later
      });
    }
  }

  // 2. Equal House System
  // Ascendant Degree is the Cusp (Start) of the 1st House.
  // Each house is exactly 30 degrees.
  else if (system === "equal_house") {
    for (let i = 0; i < 12; i++) {
      const cusp = (ascendantLongitude + i * 30) % 360;
      const end = (cusp + 30) % 360;
      const rashiAtCusp = Math.floor(cusp / 30); // 0–11

      bhavas.push({
        number: i + 1,
        rashi: rashiAtCusp + 1,
        longitude: cusp,
        startLongitude: cusp,
        endLongitude: end,
        span: 30,
        planets: [],
      });
    }
  }

  // 3. Sripati Bhava Chalit System
  else if (system === "sripati") {
    const mc = (ascendantLongitude - 90 + 360) % 360; // Approximate MC without observer
    const ic = (mc + 180) % 360;
    const madhyas: number[] = new Array(12);
    madhyas[0] = ascendantLongitude;
    madhyas[6] = (ascendantLongitude + 180) % 360;
    madhyas[9] = mc;
    madhyas[3] = ic;

    const arc1 = (ascendantLongitude - mc + 360) % 360;
    madhyas[10] = (mc + arc1 / 3) % 360;
    madhyas[11] = (mc + (2 * arc1) / 3) % 360;

    const arc2 = (ic - ascendantLongitude + 360) % 360;
    madhyas[1] = (ascendantLongitude + arc2 / 3) % 360;
    madhyas[2] = (ascendantLongitude + (2 * arc2) / 3) % 360;

    madhyas[4] = (madhyas[10] + 180) % 360;
    madhyas[5] = (madhyas[11] + 180) % 360;
    madhyas[7] = (madhyas[1] + 180) % 360;
    madhyas[8] = (madhyas[2] + 180) % 360;

    for (let i = 0; i < 12; i++) {
      const prevIdx = (i - 1 + 12) % 12;
      const nextIdx = (i + 1) % 12;
      const diffPrev = (madhyas[i] - madhyas[prevIdx] + 360) % 360;
      const start = (madhyas[prevIdx] + diffPrev / 2) % 360;
      const diffNext = (madhyas[nextIdx] - madhyas[i] + 360) % 360;
      const end = (madhyas[i] + diffNext / 2) % 360;
      const span = (end - start + 360) % 360;
      const rashiAtMadhya = Math.floor(madhyas[i] / 30);

      bhavas.push({
        number: i + 1,
        rashi: rashiAtMadhya + 1,
        longitude: madhyas[i],
        madhyaLongitude: madhyas[i],
        startLongitude: start,
        endLongitude: end,
        span,
        planets: [],
      });
    }
  }

  // Fallback to whole_sign if unknown
  else {
    return getHouses(ascendantLongitude, "whole_sign");
  }

  return bhavas;
}

