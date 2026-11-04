const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../dist');
const reference = require('./fixtures/swiss-ephemeris.json');
const asOf = new Date('2026-06-15T00:00:00Z');
const core = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
const chart = () => api.getKundli(new Date('1998-05-15T09:00:00Z'), new api.Observer(25.872, 82.685, 0));
const period = (planet, start, end, antars) => ({ planet, startTime: new Date(start), endTime: new Date(end), antars });
const stones = report => [...report.recommendedStones, ...report.conditionalStones, ...report.prohibitedStones];
function place(k, planet, longitude) {
  const p = k.planets[planet];
  p.longitude = longitude;
  p.rashi = Math.floor(longitude / 30) + 1;
  p.rashiName = api.rashiNames[p.rashi - 1];
  p.degree = Math.floor(longitude % 30);
  p.minute = Math.floor((longitude % 1) * 60);
  p.second = Math.round((((longitude % 1) * 60) % 1) * 60);
  k.houses.forEach(h => h.planets = h.planets.filter(x => x !== planet));
  k.houses.find(h => h.rashi === p.rashi).planets.push(planet);
}

test('astronomical positions agree with independent Swiss Ephemeris reference charts', () => {
  const distance = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  for (const fixture of reference.fixtures) {
    const date = new Date(fixture.date);
    const k = api.getKundli(date, new api.Observer(fixture.lat, fixture.lon, 0));
    assert.ok(Math.abs(api.getAyanamsa(date) - fixture.ayanamsa) < 0.001);
    assert.ok(distance(k.ascendant.longitude, fixture.ascendant) < 0.01, fixture.date);
    for (const [planet, longitude] of Object.entries(fixture.planets)) {
      assert.ok(distance(k.planets[planet].longitude, longitude) < 0.01, `${fixture.date}: ${planet}`);
      assert.equal(k.planets[planet].rashi, Math.floor(longitude / 30) + 1);
    }
  }
});

test('requested Placidus houses match reference cusps instead of silently becoming whole-sign', () => {
  for (const fixture of reference.fixtures) {
    const k = api.getKundli(new Date(fixture.date), new api.Observer(fixture.lat, fixture.lon, 0), { houseSystem: 'placidus' });
    for (const h of k.houses) assert.ok(Math.abs(h.longitude - fixture.placidusCusps[h.number - 1]) < 0.01);
    for (const planet of [...core, 'Rahu', 'Ketu']) {
      assert.equal(k.houses.filter(h => h.planets.includes(planet)).length, 1);
    }
  }
});

test('career, marriage, progeny and growth actually consume generated divisional charts', () => {
  const k = chart();
  assert.ok(k.vargas.d9 && k.vargas.d10 && k.vargas.d7);
  const career = api.getCareerPrediction(k);
  assert.ok(career.d10Insight.includes(k.vargas.d10.ascendant.rashiName));
  assert.ok(career.karakamshaInsight);
  assert.ok(api.getMarriagePrediction(k, { asOf }).navamshaSpouseInsight.includes(k.vargas.d9.ascendant.rashiName));
  assert.ok(api.getProgenyPrediction(k).saptamshaD7Insight.includes(k.vargas.d7.ascendant.rashiName));
  assert.ok(JSON.stringify(api.getGrowthPrediction(k, { asOf })).includes('Dashamsha (D10)'));
  // Older caller-supplied uppercase charts remain supported.
  const canonical = api.getMarriagePrediction(k, { asOf });
  k.vargas = Object.fromEntries(Object.entries(k.vargas).map(([key, value]) => [key.toUpperCase(), value]));
  assert.deepEqual(api.getMarriagePrediction(k, { asOf }), canonical);
});

test('gemstone dignity uses the actual 1-based natal sign numbers', () => {
  const k = chart();
  const exalted = { Sun: 1, Moon: 2, Mars: 10, Mercury: 6, Jupiter: 4, Venus: 12, Saturn: 7 };
  for (const [planet, sign] of Object.entries(exalted)) place(k, planet, (sign - 1) * 30 + 10);
  for (const stone of stones(api.getGemstoneRecommendation(k, { asOf })).filter(s => core.includes(s.planet))) {
    assert.match(stone.detailedAnalysis.dignityVerdict, /Exalted/, stone.planet);
  }
  place(k, 'Mars', 100); // Cancer, not Leo.
  assert.match(stones(api.getGemstoneRecommendation(k, { asOf })).find(s => s.planet === 'Mars').detailedAnalysis.dignityVerdict,
    /Debilitated|Neecha Bhanga/);
});

test('gemstone Pisces BAV and Vargottama comparisons use the correct array index', () => {
  const k = chart();
  place(k, 'Jupiter', 350);
  k.vargas.d9.planets.Jupiter = { rashi: 12, rashiName: 'Pisces' };
  k.ashtakavarga.bav.Jupiter.byRashi = Array(12).fill(0);
  k.ashtakavarga.bav.Jupiter.byRashi[11] = 7;
  const stone = stones(api.getGemstoneRecommendation(k, { asOf })).find(s => s.planet === 'Jupiter');
  assert.match(stone.detailedAnalysis.ashtakavargaVerdict, /7\/8/);
  assert.match(stone.detailedAnalysis.navamshaVerdict, /Vargottama/);
});

test('gemstone timing and comprehensive reports use asOf instead of cached current dashas', () => {
  const k = chart();
  const eligible = stones(api.getGemstoneRecommendation(k, { asOf })).find(s => s.suitability !== 'prohibited');
  assert.ok(eligible);
  const p = eligible.planet;
  k.dasha.mahadashas = [period(p, '2026-01-01Z', '2027-01-01Z', [period(p, '2026-01-01Z', '2027-01-01Z')])];
  k.dasha.currentMahadasha = period('Unknown', '2000-01-01Z', '2001-01-01Z');
  k.dasha.currentAntar = k.dasha.currentMahadasha;
  const direct = api.getGemstoneRecommendation(k, { asOf });
  const timing = stones(direct).find(s => s.planet === p).timing;
  assert.equal(timing.isActiveNow, true);
  assert.equal(timing.startDate, '01/01/2026');
  assert.equal(timing.endDate, '01/01/2027');
  assert.deepEqual(api.getComprehensiveReport(k, { asOf }).gemstones, direct);
  assert.equal(stones(api.getGemstoneRecommendation(k, { asOf: new Date('2028-01-01Z') })).find(s => s.planet === p).timing, undefined);
  assert.throws(() => api.getGemstoneRecommendation(k, { asOf: new Date(NaN) }), /valid Date/);
});

test('pratyantardasha uses its own dates and future periods come from the supplied tree', () => {
  const k = chart();
  const active = period('Jupiter', '2026-01-01Z', '2027-01-01Z');
  active.pratyantars = [period('Moon', '2026-06-01Z', '2026-07-01Z')];
  k.dasha.mahadashas = [period('Venus', '2026-01-01Z', '2028-01-01Z', [
    active, period('Saturn', '2027-01-01Z', '2028-01-01Z')
  ])];
  for (const lang of ['en', 'hi']) {
    const result = api.getDashaTimelinePrediction(k, { asOf, lang });
    assert.equal(result.currentPratyantardasha.startDate, '2026-06-01');
    assert.equal(result.currentPratyantardasha.endDate, '2026-07-01');
    assert.equal(result.upcomingMajorPeriods.length, 1);
    assert.match(result.upcomingMajorPeriods[0].periodSpan, /2027-01-01.*2028-01-01/);
    assert.deepEqual(result.criticalMilestoneAges, []);
  }
});

test('invalid nested periods cannot produce an active prediction or gemstone timing', () => {
  const k = chart();
  const ad = period('Jupiter', '2025-01-01Z', '2028-01-01Z');
  k.dasha.mahadashas = [period('Venus', '2026-01-01Z', '2027-01-01Z', [ad])];
  assert.throws(() => api.getDashaTimelinePrediction(k, { asOf }), /No active/);
  ad.startTime = new Date('2026-01-01Z'); ad.endTime = new Date('2027-01-01Z');
  ad.pratyantars = [period('Sun', '2025-01-01Z', '2028-01-01Z')];
  assert.equal(api.getDashaTimelinePrediction(k, { asOf }).currentPratyantardasha, undefined);
});

test('period themes react to afflicted placement rather than always promising growth', () => {
  const k = chart();
  k.dasha.mahadashas = [period('Venus', '2026-01-01Z', '2027-01-01Z', [period('Jupiter', '2026-01-01Z', '2027-01-01Z')])];
  const before = api.getDashaTimelinePrediction(k, { asOf });
  k.planets.Venus.dignity = 'debilitated';
  k.planets.Venus.isCombust = true;
  k.houses.forEach(h => h.planets = h.planets.filter(p => p !== 'Venus'));
  k.houses.find(h => h.number === 8).planets.push('Venus');
  const after = api.getDashaTimelinePrediction(k, { asOf });
  assert.notDeepEqual(after.currentPeriodThemes, before.currentPeriodThemes);
  assert.match(after.currentPeriodThemes.career, /mixed|cautionary/);
});

test('all prediction entry points reject missing, duplicate and inconsistent planetary data', () => {
  const fns = [api.getCareerPrediction, api.getWealthPrediction, api.getMarriagePrediction,
    api.getHealthPrediction, api.getEducationPrediction, api.getProgenyPrediction,
    api.getYogasAndDoshas, api.getJaiminiKarakas, api.getGemstoneRecommendation,
    api.getGrowthPrediction, api.getRemedies, api.getChalitAnalysis, api.getKpAnalysis,
    api.getLalKitabAnalysis, api.getDashaTimelinePrediction, api.getTransitPredictions, api.getComprehensiveReport];
  for (const mutate of [
    k => { delete k.planets.Saturn; },
    k => k.houses[0].planets.push('Saturn'),
    k => { k.planets.Saturn.longitude = NaN; },
    k => { k.planets.Saturn.rashi = (k.planets.Saturn.rashi % 12) + 1; }
  ]) {
    const k = chart(); mutate(k);
    for (const fn of fns) assert.throws(() => fn(k, { asOf }), /Saturn/, fn.name);
  }
  const k = chart(); k.ascendant.longitude = NaN;
  assert.throws(() => api.getComprehensiveReport(k, { asOf }), /ascendant/);
});

test('missing natal data cannot silently substitute today or a default location for KP', () => {
  const k = chart(); delete k.birthDetails.rawDate;
  for (const fn of [api.getKpAnalysis, api.getGemstoneRecommendation]) {
    assert.throws(() => fn(k, { asOf }), /rawDate/);
  }
});

test('missing optional varga and Ashtakavarga caches are calculated rather than replaced with defaults', () => {
  const k = chart();
  const full = api.getComprehensiveReport(k, { asOf });
  delete k.vargas;
  delete k.ashtakavarga;
  assert.deepEqual(api.getComprehensiveReport(k, { asOf }), full);
});

test('currentDashaOnly filters positive gemstone suggestions using the requested date', () => {
  const k = chart();
  const full = api.getGemstoneRecommendation(k, { asOf });
  const filtered = api.getGemstoneRecommendation(k, { asOf, currentDashaOnly: true });
  assert.deepEqual(filtered.prohibitedStones, full.prohibitedStones);
  for (const s of [...filtered.recommendedStones, ...filtered.conditionalStones]) {
    assert.equal(s.timing.isActiveNow, true);
  }
  const ended = api.getGemstoneRecommendation(k, { asOf: new Date('2200-01-01Z'), currentDashaOnly: true });
  assert.deepEqual(ended.recommendedStones, []);
  assert.deepEqual(ended.conditionalStones, []);
});

test('KP verdicts evaluate signified houses and are independent of cusp array order', () => {
  const k = chart();
  k.kp = api.getKpChart(k.birthDetails.rawDate, new api.Observer(25.872, 82.685, 0));
  const lord = k.kp.cusps.find(c => c.houseNumber === 10).subLord;
  k.kp.significators.planets[lord].allHouses = [8, 12];
  const caution = api.getKpAnalysis(k);
  assert.match(caution.careerCusp10.significationVerdict, /Direct support not established/);
  assert.match(caution.careerCusp10.significationVerdict, /challenging 8, 12/);
  k.kp.significators.planets[lord].allHouses = [2, 6, 10, 11];
  const supported = api.getKpAnalysis(k);
  assert.match(supported.careerCusp10.significationVerdict, /Supportive indications/);
  k.kp.cusps.reverse();
  assert.deepEqual(api.getKpAnalysis(k), supported);
  delete k.kp.significators;
  assert.match(api.getKpAnalysis(k).careerCusp10.significationVerdict, /unavailable/);
});

test('health and education do not invent lifespans, fixed risk ages or calibrated probabilities', () => {
  const k = chart();
  for (const lang of ['en', 'hi']) {
    const health = api.getHealthPrediction(k, { lang });
    assert.deepEqual(health.criticalAgeWindows, []);
    assert.doesNotMatch(health.longevityAssessment.category, /75|50/);
    assert.doesNotMatch(api.getEducationPrediction(k, { lang }).higherEducationAndResearch.description, /\d+%/);
  }
});

test('malformed optional calculation caches fail before producing NaN scores', () => {
  const k = chart();
  k.ashtakavarga.sav.byHouse[10] = NaN;
  assert.throws(() => api.getWealthPrediction(k), /Ashtakavarga/);
  delete k.ashtakavarga;
  k.vargas.d9.planets.Venus.rashi = 0;
  assert.throws(() => api.getMarriagePrediction(k, { asOf }), /D9/);
});

test('serialized natal dates retain the same Chalit geometry', () => {
  const k = chart();
  const original = api.getChalitAnalysis(k);
  assert.deepEqual(api.getChalitAnalysis(JSON.parse(JSON.stringify(k))), original);
});

test('wealth rating corresponds to final income score including Indu adjustments', () => {
  for (let hour = 0; hour < 24; hour += 2) {
    const k = api.getKundli(new Date(Date.UTC(1998, 4, 15, hour)), new api.Observer(25.872, 82.685, 0));
    const w = api.getWealthPrediction(k);
    assert.equal(w.wealthRating, w.incomePotential >= 85 ? 'Exceptional' : w.incomePotential >= 70 ? 'High' :
      w.savMetrics.surplusRatio < 0 ? 'Fluctuating' : 'Moderate');
  }
});

test('progeny factors retain concurrent fifth-house afflictions', () => {
  const k = chart();
  const sign = k.houses.find(h => h.number === 5).rashi;
  for (const p of ['Rahu', 'Saturn', 'Mars']) place(k, p, (sign - 1) * 30 + 15);
  const result = api.getProgenyPrediction(k);
  assert.match(result.putraDosha.type, /Sarpa/);
  assert.match(result.putraDosha.type, /Shani/);
  assert.match(result.putraDosha.type, /Kuja/);
});

test('Raman transits and Chalit preserve the natal calculation settings', () => {
  const k = api.getKundli(new Date('1998-05-15T09:00:00Z'), new api.Observer(25.872, 82.685, 0), { ayanamsa: 'raman' });
  assert.equal(k.calculationConfig.ayanamsa, 'raman');
  const date = new Date('2025-03-20T00:00:00Z');
  const positions = api.getTransitPositions(date, undefined, 'raman');
  assert.notEqual(positions.Saturn.rashi, api.getTransitPositions(date).Saturn.rashi);
  assert.equal(api.getTransitPredictions(k, { asOf: date }).saturnTransit.currentSign, positions.Saturn.rashiName);
  const chalit = api.getChalitChart(k);
  const mc = api.getMidheaven(k.birthDetails.rawDate, new api.Observer(25.872, 82.685, 0), api.getAyanamsa(k.birthDetails.rawDate, 'raman'));
  assert.ok(Math.abs(chalit.bhavas[9].madhyaLongitude - mc) < 1e-9, 'Chalit uses Raman MC');
});

test('Saturn caution phases are represented consistently in the summary', () => {
  const k = chart();
  const saturn = api.getTransitPositions(asOf).Saturn.rashi;
  // Choose the Moon sign that puts Saturn eighth from it.
  place(k, 'Moon', ((saturn - 1 - 7 + 12) % 12) * 30 + 15);
  const result = api.getTransitPredictions(k, { asOf });
  assert.equal(result.saturnTransit.isAshtamaShani, true);
  assert.match(result.summary, /Ashtama Shani/);
  assert.doesNotMatch(result.summary, /unhindered/);
});

test('Kaal Sarp checks exact nodal longitudes, including a planet sharing a node sign', () => {
  const k = chart();
  place(k, 'Rahu', 10); place(k, 'Ketu', 190);
  core.forEach((p, i) => place(k, p, [15, 40, 70, 100, 130, 160, 185][i]));
  assert.equal(api.getYogasAndDoshas(k).kaalSarpDosha.isFull, true);
  place(k, 'Sun', 5); // Cross Rahu within Aries: now planets occupy both sides.
  assert.equal(api.getYogasAndDoshas(k).kaalSarpDosha.hasDosha, false);
  place(k, 'Sun', 10); // Exact node-axis boundary is classified explicitly as partial.
  const boundary = api.getYogasAndDoshas(k).kaalSarpDosha;
  assert.equal(boundary.hasDosha, true);
  assert.equal(boundary.isFull, false);
});

test('outer planets do not suppress classical Kemadruma detection', () => {
  const k = chart();
  place(k, 'Moon', 5);
  for (const p of core.filter(p => p !== 'Moon')) place(k, p, 95);
  place(k, 'Uranus', 35); place(k, 'Neptune', 335); place(k, 'Pluto', 40);
  assert.equal(api.getYogasAndDoshas(k).kemadrumaYoga.hasYoga, true);
  place(k, 'Mercury', 35);
  assert.equal(api.getYogasAndDoshas(k).kemadrumaYoga.hasYoga, false);
});

test('Jaimini rankings use exact longitude rather than rounded display seconds', () => {
  const k = chart();
  core.forEach((p, i) => place(k, p, i + 1));
  place(k, 'Sun', 29.99986); place(k, 'Moon', 59.99987);
  // Both values round to 30 degrees in old display fields.
  assert.equal(api.getJaiminiKarakas(k).atmakaraka.planet, 'Moon');
});

test('negative SAV difference never claims the income house exceeds expenditure', () => {
  const k = chart();
  k.ashtakavarga.sav.byHouse[10] = 20;
  k.ashtakavarga.sav.byHouse[11] = 35;
  const result = api.getGrowthPrediction(k, { asOf });
  assert.match(JSON.stringify(result), /expenditure house/);
  assert.doesNotMatch(JSON.stringify(result), /outperforming|\+\-15/);
});

test('dasha longitude normalization, invalid dates and dates before birth are explicit', () => {
  const birth = new Date('2000-01-01Z');
  const zero = api.calculateVimshottariDasha(0, birth, birth);
  assert.deepEqual(api.calculateVimshottariDasha(360, birth, birth), zero);
  assert.deepEqual(api.calculateVimshottariDasha(-360, birth, birth), zero);
  assert.throws(() => api.calculateVimshottariDasha(NaN, birth), /finite/);
  assert.throws(() => api.calculateVimshottariDasha(0, new Date(NaN)), /valid Dates/);
  assert.equal(api.calculateVimshottariDasha(0, birth, new Date('1999-01-01Z')).currentMahadasha, undefined);
  assert.throws(() => api.getKundli(new Date(NaN), new api.Observer(0, 0, 0)), /valid Date/);
});

test('all report keys produce finite outputs across birth times, house systems and languages', () => {
  const keys = ['summary', 'career', 'wealth', 'marriage', 'health', 'education', 'progeny', 'yogas',
    'dashaTimeline', 'transits', 'remedies', 'chalitAnalysis', 'kpAnalysis', 'lalKitabAnalysis',
    'jaiminiKarakas', 'gemstones', 'growth', 'formattedMarkdown'];
  function finite(value, path = '') {
    if (typeof value === 'number') {
      assert.ok(Number.isFinite(value), path);
      if (/score$/i.test(path)) assert.ok(value >= 0 && value <= 100, path);
    } else if (value && typeof value === 'object') {
      for (const [key, item] of Object.entries(value)) finite(item, `${path}.${key}`);
    }
  }
  for (let hour = 0; hour < 24; hour += 2) {
    const houseSystem = ['whole_sign', 'equal_house', 'sripati', 'placidus'][(hour / 2) % 4];
    const k = api.getKundli(new Date(Date.UTC(1998, 4, 15, hour)), new api.Observer(25.872, 82.685, 0), { houseSystem });
    for (const lang of ['en', 'hi']) {
      const report = api.getComprehensiveReport(k, { asOf, lang });
      for (const key of keys) assert.ok(report[key] !== undefined, `${hour} ${lang} ${key}`);
      finite(report);
      assert.doesNotMatch(report.formattedMarkdown, /\bundefined\b|\bNaN\b|\?{3}/);
    }
  }
});
