const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../dist');
const date = value => new Date(value);
const asOf = date('2026-10-05T00:00:00Z');
function chart() {
  return api.getKundli(date('1998-05-15T14:30:00+05:30'), new api.Observer(25.872, 82.685, 0));
}
function period(planet, start, end, antars) {
  return { planet, startTime: date(start), endTime: date(end), antars };
}
test('missing dasha never invents marriage years or a fixed age', () => {
  const k = chart(); k.dasha.mahadashas = [];
  const result = api.getMarriagePrediction(k, { asOf });
  assert.deepEqual(result.predictedTimingYears, []);
  assert.equal(result.favorableAgeRange, 'Not established');
  assert.equal(result.currentDashaFavorableForMarriage, false);
  assert.throws(() => api.getDashaTimelinePrediction(k, { asOf }), /No active/);
});
test('incomplete or duplicate placements are rejected', () => {
  const k = chart();
  k.houses.forEach(h => h.planets = h.planets.filter(p => p !== 'Saturn'));
  for (const fn of [api.getCareerPrediction, api.getWealthPrediction, api.getMarriagePrediction]) {
    assert.throws(() => fn(k), /Saturn/);
  }
  k.houses[0].planets.push('Saturn', 'Saturn');
  assert.throws(() => api.getCareerPrediction(k), /Saturn/);
});
test('invalid reference dates fail explicitly', () => {
  for (const fn of [api.getMarriagePrediction, api.getDashaTimelinePrediction, api.getTransitPredictions]) {
    assert.throws(() => fn(chart(), { asOf: date('invalid') }), /valid Date/);
  }
});
test('ended periods and exclusive January boundaries do not leak years', () => {
  const k = chart();
  k.dasha.mahadashas = [period('Venus', '2025-01-01Z', '2027-01-01Z', [
    period('Venus', '2025-01-01Z', '2026-01-01Z'),
    period('Jupiter', '2026-01-01Z', '2027-01-01Z')
  ])];
  assert.deepEqual(api.getMarriagePrediction(k, { asOf }).predictedTimingYears, [2026]);
  assert.deepEqual(api.getMarriagePrediction(k, { asOf: date('2027-01-01Z') }).predictedTimingYears, []);
});
test('marriage indicators are not discarded after age 35', () => {
  const k = chart();
  k.birthDetails.rawDate = date('1970-01-01Z');
  k.dasha.mahadashas = [period('Venus', '2026-01-01Z', '2027-01-01Z', [period('Venus', '2026-01-01Z', '2027-01-01Z')])];
  assert.deepEqual(api.getMarriagePrediction(k, { asOf }).predictedTimingYears, [2026]);
});
test('invalid and out-of-parent periods cannot create marriage years', () => {
  const k = chart();
  k.dasha.mahadashas = [period('Venus', '2025-01-01Z', '2026-01-01Z', [
    period('Venus', '2027-01-01Z', '2028-01-01Z'), period('Venus', 'invalid', '2028-01-01Z')
  ])];
  assert.deepEqual(api.getMarriagePrediction(k, { asOf }).predictedTimingYears, []);
});
test('timeline uses requested date, ignoring stale cached current periods', () => {
  const k = chart();
  k.dasha.mahadashas = [period('Venus', '2026-01-01Z', '2027-01-01Z', [period('Jupiter', '2026-01-01Z', '2027-01-01Z')])];
  const result = JSON.stringify(api.getDashaTimelinePrediction(k, { asOf }));
  assert.match(result, /2026-01-01/);
  assert.match(result, /Venus/);
  assert.throws(() => api.getDashaTimelinePrediction(k, { asOf: date('2027-01-01Z') }), /No active/);
});
test('complete reports support reproducible reference dates in both languages', () => {
  const k = chart();
  for (const lang of ['en', 'hi']) {
    assert.deepEqual(api.getComprehensiveReport(k, { asOf, lang }), api.getComprehensiveReport(k, { asOf, lang }));
  }
});

test('accurate marriage prediction computes delay, Upapada, partner profile, and remedies', () => {
  const k = chart();
  const mEn = api.getMarriagePrediction(k, { asOf, lang: 'en' });
  const mHi = api.getMarriagePrediction(k, { asOf, lang: 'hi' });

  assert.ok(mEn.vivahaVilambaFactors);
  assert.equal(typeof mEn.vivahaVilambaFactors.hasDelay, 'boolean');
  assert.ok(mEn.upapadaLagnaDetails);
  assert.ok(mEn.spouseCareerAndBackground);
  assert.ok(mEn.spouseCareerAndBackground.probableProfessions.length > 0);
  assert.ok(mEn.remediesForMarriage && mEn.remediesForMarriage.length >= 3);
  assert.ok(mEn.predictedTimingYears.length > 0);
  assert.match(mEn.favorableAgeRange, /years/);
  assert.match(mHi.favorableAgeRange, /वर्ष/);
  assert.ok(mHi.remediesForMarriage && mHi.remediesForMarriage.length >= 3);
});

test('growth prediction computes trajectory velocity, archetypes, roadmap, and scores', () => {
  const k = chart();
  const gEn = api.getGrowthPrediction(k, { asOf, lang: 'en' });
  const gHi = api.getGrowthPrediction(k, { asOf, lang: 'hi' });

  assert.ok(gEn.growthScore >= 15 && gEn.growthScore <= 100);
  assert.ok(gEn.careerGrowthScore >= 15 && gEn.careerGrowthScore <= 100);
  assert.ok(gEn.financialGrowthScore >= 15 && gEn.financialGrowthScore <= 100);
  assert.ok(gEn.entrepreneurialGrowthScore >= 15 && gEn.entrepreneurialGrowthScore <= 100);

  assert.ok(gEn.growthArchetype.title.length > 0);
  assert.ok(gEn.keyGrowthDrivers.length > 0);
  assert.ok(gEn.growthBlockersAndFriction.length > 0);
  assert.equal(gEn.lifeGrowthRoadmap.length, 4);
  assert.ok(gEn.growthSectorsAndDomains.length > 0);
  assert.ok(gEn.strategicGrowthAccelerators.length > 0);
  assert.ok(gEn.astrologicalRemediesForGrowth.length > 0);

  // Cross-verify report integration
  const report = api.getComprehensiveReport(k, { asOf, lang: 'en' });
  assert.ok(report.growth);
  assert.equal(report.growth.growthScore, gEn.growthScore);
  assert.match(report.formattedMarkdown, /Comprehensive Career & Financial Growth Trajectory/);
  assert.match(report.formattedMarkdown, /Overall Growth Velocity/);
});
