const { test } = require('node:test');
const assert = require('node:assert/strict');
const api = require('../dist');

// Lahiri (Chitrapaksha) is defined by a single fixed point: the ayanamsa
// equals 23°15'00" at JD 2435553.5 (21 March 1956, 0h). Everything else
// follows from propagating precession away from it. Anchoring the series
// anywhere else leaves it unverifiable, so these tests assert the
// definition rather than a value copied from another implementation.

const JD_UNIX_EPOCH = 2440587.5;
const jdToDate = jd => new Date((jd - JD_UNIX_EPOCH) * 86400000);

const LAHIRI_EPOCH_JD = 2435553.5;          // 21 March 1956, 0h
const LAHIRI_EPOCH_ARCSEC = 23 * 3600 + 15 * 60; // 23°15'00"

const arcsec = deg => deg * 3600;

test('lahiri reproduces its defining value at the defining epoch', () => {
  const got = arcsec(api.getAyanamsa(jdToDate(LAHIRI_EPOCH_JD), 'lahiri'));
  // 0.01" is far tighter than any astrological use needs and still leaves
  // room for floating point; the previous anchor missed by 16.111".
  assert.ok(
    Math.abs(got - LAHIRI_EPOCH_ARCSEC) < 0.01,
    `expected 23°15'00" (${LAHIRI_EPOCH_ARCSEC}") at JD ${LAHIRI_EPOCH_JD}, got ${got.toFixed(3)}"`,
  );
});

test('lahiri increases with time at roughly the precession rate', () => {
  const y2000 = api.getAyanamsa(jdToDate(2451545.0), 'lahiri');
  const y2100 = api.getAyanamsa(jdToDate(2451545.0 + 36525), 'lahiri');
  const perCentury = arcsec(y2100 - y2000);
  // General precession in longitude is ~5029"/century; allow a wide band
  // so this asserts direction and order of magnitude, not the model.
  assert.ok(
    perCentury > 4900 && perCentury < 5150,
    `expected ~5029"/century, got ${perCentury.toFixed(1)}"`,
  );
});

test('kp and raman stay at their documented offsets below lahiri', () => {
  const d = jdToDate(2451545.0);
  const lahiri = arcsec(api.getAyanamsa(d, 'lahiri'));
  assert.ok(Math.abs((lahiri - arcsec(api.getAyanamsa(d, 'kp'))) - 354.0) < 0.01);
  assert.ok(Math.abs((lahiri - arcsec(api.getAyanamsa(d, 'raman'))) - 5207.0) < 0.01);
});
