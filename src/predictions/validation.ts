import { Kundli } from '../kundli/types';
import { PredictionOptions } from './types';
import { DashaPeriodInfo } from '../core/types';
import { getAshtakavarga } from '../ashtakavarga';
import { getAllVargas } from '../kundli/vargas';

export function predictionSav(kundli: Kundli) {
  return (kundli.ashtakavarga || getAshtakavarga(kundli)).sav;
}

export function predictionVarga(kundli: Kundli, key: 'd7' | 'd9' | 'd10') {
  const chart = kundli.vargas?.[key] || kundli.vargas?.[key.toUpperCase()] ||
    getAllVargas(kundli.ascendant.longitude, kundli.planets)[key];
  const sign = (rashi: number) => Number.isInteger(rashi) && rashi >= 1 && rashi <= 12;
  if (!sign(chart.ascendant?.rashi) || !Array.isArray(chart.houses) || chart.houses.length !== 12 ||
      ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
        .some(p => !sign(chart.planets?.[p]?.rashi))) {
    throw new Error(`Predictions require a valid ${key.toUpperCase()} chart.`);
  }
  return chart;
}

/** Periods use [start, end); a child must be wholly inside its parent. */
export function validDashaPeriod(period: DashaPeriodInfo, parent?: DashaPeriodInfo): boolean {
  const start = new Date(period.startTime).getTime();
  const end = new Date(period.endTime).getTime();
  return ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'].includes(period.planet) &&
    Number.isFinite(start) && Number.isFinite(end) && start < end &&
    (!parent || (start >= new Date(parent.startTime).getTime() && end <= new Date(parent.endTime).getTime()));
}

export function activeDashaPeriods(kundli: Kundli, asOf: Date) {
  const active = (period: DashaPeriodInfo, parent?: DashaPeriodInfo) =>
    validDashaPeriod(period, parent) && asOf.getTime() >= new Date(period.startTime).getTime() &&
    asOf.getTime() < new Date(period.endTime).getTime();
  const maha = kundli.dasha?.mahadashas?.find(p => active(p));
  const antar = maha?.antars?.find(p => active(p, maha));
  const pratyantar = antar?.pratyantars?.find(p => active(p, antar));
  return { maha, antar, pratyantar };
}

/** Never substitute today's sky or a default city for missing natal data. */
export function natalDetails(kundli: Kundli) {
  const details = kundli.birthDetails;
  const date = details?.rawDate;
  const value = date instanceof Date ? new Date(date.getTime()) : typeof date === 'string' ? new Date(date) : undefined;
  if (!value || !Number.isFinite(value.getTime()) ||
      !Number.isFinite(details.lat) || Math.abs(details.lat) > 90 ||
      !Number.isFinite(details.lon) || Math.abs(details.lon) > 180) {
    throw new Error('Natal calculations require a valid birthDetails.rawDate, latitude and longitude.');
  }
  return { date: value, lat: details.lat, lon: details.lon };
}

export function predictionDate(options?: PredictionOptions): Date {
  const value = options?.asOf ?? new Date();
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new Error('Prediction asOf must be a valid Date.');
  }
  return new Date(value.getTime());
}

/** Reject incomplete charts instead of inventing planetary placements. */
export function validatePredictionChart(kundli: Kundli): void {
  if (!Number.isInteger(kundli?.ascendant?.rashi) || kundli.ascendant.rashi < 1 || kundli.ascendant.rashi > 12 ||
      !Number.isFinite(kundli.ascendant.longitude) || kundli.ascendant.longitude < 0 || kundli.ascendant.longitude >= 360 ||
      Math.floor(kundli.ascendant.longitude / 30) + 1 !== kundli.ascendant.rashi) {
    throw new Error('Predictions require a valid ascendant with consistent longitude and rashi.');
  }
  const houses = kundli?.houses;
  if (!Array.isArray(houses) || houses.length !== 12 ||
      new Set(houses.map(h => h.number)).size !== 12 ||
      houses.some(h => !Number.isInteger(h.number) || h.number < 1 || h.number > 12 ||
        !Number.isInteger(h.rashi) || h.rashi < 1 || h.rashi > 12 || !Array.isArray(h.planets))) {
    throw new Error('Predictions require 12 valid, distinct houses.');
  }
  for (const name of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
    const planet = kundli.planets?.[name];
    if (!planet || !Number.isInteger(planet.rashi) || planet.rashi < 1 || planet.rashi > 12 ||
        !Number.isFinite(planet.longitude) || planet.longitude < 0 || planet.longitude >= 360 ||
        Math.floor(planet.longitude / 30) + 1 !== planet.rashi ||
        houses.reduce((count, h) => count + h.planets.filter(p => p === name).length, 0) !== 1) {
      throw new Error(`Predictions require a valid ${name} and exactly one house placement.`);
    }
  }
  const validBindus = (values: number[], max: number) => Array.isArray(values) && values.length === 12 &&
    values.every(n => Number.isInteger(n) && n >= 0 && n <= max);
  const av = kundli.ashtakavarga;
  if (av && (!av.sav || !validBindus(av.sav.byHouse, 56) || !validBindus(av.sav.byRashi, 56) ||
      !av.bav || Object.values(av.bav).some(b => !validBindus(b.byRashi, 8)))) {
    throw new Error('Predictions require valid Ashtakavarga bindu arrays.');
  }
}
