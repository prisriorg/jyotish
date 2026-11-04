import { activeDashaPeriods, predictionDate, validDashaPeriod, validatePredictionChart } from "./validation";
import { Kundli } from "../kundli/types";
import { DashaPeriodInfo } from "../core/types";
import { RASHI_LORDS } from "../matching/constants";
import { DashaTimelinePrediction, PredictionOptions } from "./types";
import { getLocalizedPlanet } from "../i18n/index";

export function getDashaTimelinePrediction(kundli: Kundli, options?: PredictionOptions): DashaTimelinePrediction {
  validatePredictionChart(kundli);
  const lang = options?.lang || 'en';
  const hi = lang === 'hi';
  const now = predictionDate(options);
  const { maha: md, antar: ad, pratyantar: pd } = activeDashaPeriods(kundli, now);
  if (!md || !ad) {
    throw new Error('No active mahadasha/antardasha available for the prediction date.');
  }
  const iso = (value: Date) => new Date(value).toISOString().split('T')[0];
  const name = (planet: string) => getLocalizedPlanet(planet, lang);
  const houseOf = (planet: string) => kundli.houses.find(h => h.planets.includes(planet))!.number;
  // D1 sign ownership is counted from Lagna; shifted Bhava cusps do not change it.
  const ruledBy = (planet: string) => Array.from({ length: 12 }, (_, i) => i + 1)
    .filter(h => RASHI_LORDS[(kundli.ascendant.rashi + h - 2) % 12] === planet);
  const role = (planet: string): string => {
    const ruled = ruledBy(planet);
    if (planet === 'Rahu' || planet === 'Ketu') {
      const dispositor = RASHI_LORDS[kundli.planets[planet].rashi - 1];
      return hi ? `छाया ग्रह; राशि स्वामी ${name(dispositor)} के फल भी देखें` : `Node; also assess sign lord ${dispositor}`;
    }
    const labels = [];
    if (ruled.includes(1)) labels.push(hi ? 'लग्नेश' : 'Lagna Lord');
    if (ruled.some(h => [5, 9].includes(h))) labels.push(hi ? 'त्रिकोणेश' : 'Trikona Lord');
    if (ruled.some(h => [4, 7, 10].includes(h))) labels.push(hi ? 'केंद्रेश' : 'Kendra Lord');
    if (ruled.some(h => [2, 11].includes(h))) labels.push(hi ? 'धन / लाभ स्वामी' : 'Dhana / Labha Lord');
    if (ruled.some(h => [6, 8, 12].includes(h))) labels.push(hi ? 'त्रिकेश' : 'Dusthana Lord');
    return labels.join('; ') || (hi ? 'प्रयास भाव का स्वामी' : 'Effort House Lord');
  };
  const describe = (planet: string) => {
    const p = kundli.planets[planet];
    const ruled = ruledBy(planet);
    return hi
      ? `${name(planet)}: भाव ${houseOf(planet)}, स्वामी भाव ${ruled.join(', ') || 'कोई नहीं'}। ${role(planet)}। राशि बल: ${p.dignity}${p.isCombust ? '; अस्त' : ''}।`
      : `${planet}: placed in House ${houseOf(planet)}, ruling Houses ${ruled.join(', ') || 'none'}. ${role(planet)}. Sign dignity: ${p.dignity}${p.isCombust ? '; combust' : ''}.`;
  };
  const theme = (relatedHouses: number[]): string => {
    const details = [md.planet, ad.planet].map(planet => {
      const p = kundli.planets[planet];
      const placement = houseOf(planet);
      const ruled = ruledBy(planet);
      const linked = relatedHouses.some(h => ruled.includes(h) || placement === h);
      const challenged = [6, 8, 12].includes(placement) || p.dignity === 'debilitated' || p.isCombust ||
        ruled.some(h => [6, 8, 12].includes(h));
      const assessment = linked
        ? (challenged ? (hi ? 'मिश्रित संकेत' : 'mixed indications') : (hi ? 'सहायक संकेत' : 'supportive indications'))
        : (challenged ? (hi ? 'सावधानी के संकेत' : 'cautionary indications') : (hi ? 'सीमित प्रत्यक्ष संबंध' : 'limited direct connection'));
      return hi
        ? `${name(planet)}: ${assessment} (स्थिति भाव ${placement}, स्वामित्व ${ruled.join(', ') || 'कोई नहीं'})`
        : `${planet}: ${assessment} (placement ${placement}, lordship ${ruled.join(', ') || 'none'})`;
    });
    return details.join('; ') + (hi ? '। यह नियम आधारित संकेत है, घटना की गारंटी नहीं।' : '. These are rule-based indicators, not guaranteed events.');
  };

  const upcomingMajorPeriods: DashaTimelinePrediction['upcomingMajorPeriods'] = [];
  for (const maha of kundli.dasha.mahadashas) {
    if (!validDashaPeriod(maha)) continue;
    for (const antar of maha.antars || []) {
      if (!validDashaPeriod(antar, maha) || new Date(antar.startTime).getTime() <= now.getTime()) continue;
      upcomingMajorPeriods.push({
        planet: name(antar.planet),
        periodSpan: `${iso(antar.startTime)} ${hi ? 'से' : 'to'} ${iso(antar.endTime)}`,
        keyForecast: `${name(maha.planet)} / ${name(antar.planet)}: ${describe(antar.planet)}`,
      });
    }
  }
  upcomingMajorPeriods.sort((a, b) => a.periodSpan.localeCompare(b.periodSpan));

  const criticalMilestoneAges: DashaTimelinePrediction['criticalMilestoneAges'] = [];
  const rawBirth = kundli.birthDetails?.rawDate;
  const birth = rawBirth ? new Date(rawBirth) : undefined;
  if (birth && Number.isFinite(birth.getTime())) {
    const futureMahas = kundli.dasha.mahadashas.filter(p => validDashaPeriod(p) &&
      new Date(p.startTime).getTime() > Math.max(now.getTime(), birth.getTime()))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    for (const maha of futureMahas.slice(0, 4)) {
      const start = new Date(maha.startTime);
      let age = start.getUTCFullYear() - birth.getUTCFullYear();
      const anniversary = new Date(birth.getTime());
      anniversary.setUTCFullYear(start.getUTCFullYear());
      if (start < anniversary) age--;
      criticalMilestoneAges.push({
        age,
        astrologicalCycle: hi ? `${name(maha.planet)} महादशा प्रारंभ (${iso(start)})` : `${maha.planet} Mahadasha begins (${iso(start)})`,
        significance: describe(maha.planet),
      });
    }
  }

  const periodDates = (p: DashaPeriodInfo) => ({ planet: p.planet, startDate: iso(p.startTime), endDate: iso(p.endTime) });
  return {
    currentMahadasha: {
      ...periodDates(md), nature: role(md.planet), lordOfHouses: ruledBy(md.planet),
      placementHouse: houseOf(md.planet), prediction: describe(md.planet),
    },
    currentAntardasha: { ...periodDates(ad), prediction: describe(ad.planet) },
    currentPratyantardasha: pd ? periodDates(pd) : undefined,
    currentPeriodThemes: {
      career: theme([2, 6, 10, 11]), wealth: theme([2, 5, 9, 11]),
      relationships: theme([2, 7, 11]), health: theme([1, 6, 8, 12]),
    },
    upcomingMajorPeriods: upcomingMajorPeriods.slice(0, 3),
    criticalMilestoneAges,
  };
}
