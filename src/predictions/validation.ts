import { Kundli } from '../kundli/types';
import { PredictionOptions } from './types';

export function predictionDate(options?: PredictionOptions): Date {
  const value = options?.asOf ?? new Date();
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new Error('Prediction asOf must be a valid Date.');
  }
  return new Date(value.getTime());
}

/** Reject incomplete charts instead of inventing planetary placements. */
export function validatePredictionChart(kundli: Kundli): void {
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
        houses.reduce((count, h) => count + h.planets.filter(p => p === name).length, 0) !== 1) {
      throw new Error(`Predictions require a valid ${name} and exactly one house placement.`);
    }
  }
}
