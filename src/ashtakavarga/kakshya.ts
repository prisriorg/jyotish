import {
  KAKSHYA_SIZE,
  NUM_KAKSHYAS,
  KAKSHYA_RULERS,
  ReferencePoint,
  AshtakavargaPlanet,
} from "./constants";
import { PlanetBAV } from "./bav";

export interface KakshyaDetail {
  index: number; // 0 to 7
  ruler: ReferencePoint;
  startDegree: number; // 0.00 to 26.25
  endDegree: number; // 3.75 to 30.00
  degreeInKakshya: number;
}

/**
 * Determines which Kakshya (1 of 8) a degree falls into within a sign.
 */
export function getKakshya(degreeInSign: number): KakshyaDetail {
  const normDeg = ((degreeInSign % 30) + 30) % 30;
  const index = Math.min(Math.floor(normDeg / KAKSHYA_SIZE), NUM_KAKSHYAS - 1);
  const ruler = KAKSHYA_RULERS[index];
  const startDegree = index * KAKSHYA_SIZE;
  const endDegree = (index + 1) * KAKSHYA_SIZE;
  const degreeInKakshya = normDeg - startDegree;

  return {
    index,
    ruler,
    startDegree,
    endDegree,
    degreeInKakshya,
  };
}

/**
 * Checks if a transiting planet receives a benefic bindu in its current Kakshya.
 * In classical astrology, when a transiting planet enters a Kakshya whose ruler
 * contributed a bindu in that sign in the planet's natal BAV, the transit yields positive results.
 *
 * @param transitingPlanet Planet that is transiting (e.g. "Jupiter", "Saturn")
 * @param transitLongitude Sidereal longitude of the transiting planet (0-360°)
 * @param natalBav Natal BAV for that planet
 */
export function checkKakshyaTransit(
  transitingPlanet: AshtakavargaPlanet,
  transitLongitude: number,
  natalBav: PlanetBAV,
): {
  rashi: number; // 1-12
  kakshya: KakshyaDetail;
  hasBindu: boolean;
  status: "benefic" | "malefic";
  description: string;
} {
  const normLon = ((transitLongitude % 360) + 360) % 360;
  const rashiIndex = Math.floor(normLon / 30);
  const degreeInSign = normLon % 30;
  const kakshya = getKakshya(degreeInSign);

  // Check if ruler of this kakshya gave a bindu in this rashi in natal BAV
  const contributionList = natalBav.contributionsByRef[kakshya.ruler] || [];
  const hasBindu = contributionList[rashiIndex] === 1;

  return {
    rashi: rashiIndex + 1,
    kakshya,
    hasBindu,
    status: hasBindu ? "benefic" : "malefic",
    description: hasBindu
      ? `Transit of ${transitingPlanet} through ${kakshya.ruler}'s Kakshya in Rashi ${rashiIndex + 1} has 1 bindu (Favorable)`
      : `Transit of ${transitingPlanet} through ${kakshya.ruler}'s Kakshya in Rashi ${rashiIndex + 1} has 0 bindus (Unfavorable)`,
  };
}
