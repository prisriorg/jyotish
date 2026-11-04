# Prediction audit — 4 November 2026

The prediction layer contained confirmed implementation errors. Those errors have
been corrected, but the library's life-event forecasts are **not established as
accurate predictions**. Passing regression tests establishes calculation and
software behavior for the covered cases; it does not validate marriage, career,
wealth, fertility, health, or gemstone outcomes.

## Coverage by report key

| Report key | Findings and corrections | Remaining limits |
| --- | --- | --- |
| `career` | Generated `d10` and `d9` were skipped because consumers expected uppercase keys. Fixed chart lookup, Hindi Amatyakaraka sign rendering, and missing SAV calculation. Empty D10 houses no longer imply a benefic aspect. | Job/business and government-job scores are manually weighted indicators; field lists and age-window narratives are not independently validated. |
| `wealth` | Rating was calculated before later Indu Lagna score increases. Rating now follows the final score. Missing SAV is derived. Removed invented benefic aspects for empty Indu Lagna and blanket positive Chalit conclusions. | Wealth magnitude, best-source templates, property and investment narratives are not predictions of earnings or returns. |
| `marriage` | Fixed skipped D9, missing-cache calculation, invalid nested timing periods, and language-dependent Upapada benefic detection. Neutral Venus dignity no longer becomes automatically harmonious. Removed a guarantee of spouse character/marital endurance. | Marriage years are candidate dasha windows, not established event years. Spouse age gaps, appearance, background, marriage type and intercaste scores remain heuristic. |
| `health` | Added chart validation and real SAV fallback. Removed numerical lifespan estimates and fixed critical ages that were returned for every native. | `healthScore`, constitution, organ sensitivities and remedy narratives are traditional associations, not clinical measurements or validated medical predictions. |
| `education` | Added chart validation/SAV calculation. Foreign-study scores no longer masquerade as measured percentages. | Streams, intelligence labels and exam likelihoods are heuristic rankings; no admission or examination outcome dataset was supplied. |
| `progeny` | Fixed skipped D7, missing SAV, and `else if` logic that discarded simultaneous fifth-house factors. Empty D7 houses no longer imply benefic aspects. | Conception, fertility, child traits and remedy effects are not established by these rules. |
| `yogas` | Sign relationships now use whole-sign D1 rather than shifted Bhava buckets. Kaal Sarp uses exact longitudes across the node axis; Kemadruma excludes outer planets from classical support. | Cancellation and strength interpretations differ across traditions. The explicit axis convention here is: seven strictly enclosed planets = full; planets exactly on the axis with the others on one side = partial; planets on both sides = absent. This convention is not a claim of universal textual authority. |
| `dashaTimeline` | Fixed Pratyantardasha dates copied from Antardasha, fabricated upcoming years and fixed milestone ages. Actual nested periods supply dates; period themes now reference lordship, placement, dignity and combustion. Nodes are no longer labeled ordinary Kendra lords. | Dates use the library's Vimshottari year convention, 365.2425 days. Themes are interpretable rules, not guaranteed events. |
| `transits` | Natal ayanamsa is retained and used for transits. Summary now acknowledges Ashtama/Kantaka Shani instead of declaring unhindered stability. | Transit scores and interpretation text are heuristic. Absence of Sade Sati alone does not establish that a period is favorable. |
| `remedies` | Added chart validation and calculated SAV fallback. | Tradition-based suggestions; efficacy has not been tested. |
| `chalitAnalysis` | Preserved natal ayanamsa, handled serialized birth timestamps, and rejected missing natal details when a chart must be calculated. | Legacy low-level `getChalitChart` still has display-date/approximate-MC fallbacks; prediction entry points require proper natal data or an already calculated chart. |
| `kpAnalysis` | Removed planet-name-only conclusions that always promised success. Career, marriage and wealth now cite actual sub-lord house significators. Cusps are found by house number; absent significators are reported as unavailable. | This is a simplified assessment of supporting/challenging houses. It does not implement a complete KP event-judgment or rectification procedure. |
| `lalKitabAnalysis` | Added shared input validation. | Existing Teva, karmic-debt, sleeping-house and remedy rules are simplified templates; they have not been certified against a complete Lal Kitab source corpus. |
| `jaiminiKarakas` | Degree ranking now uses exact longitude rather than rounded display seconds; incomplete charts are rejected. | Implements the documented seven-karaka convention. Exact ties need a chosen traditional tie-breaking convention; eight-karaka/Rahu variants are not implemented here. |
| `gemstones` | Fixed 1-based/0-based sign mismatches in dignity, dispositor, D9/Vargottama, BNN and BAV lookup. Timing uses `asOf` and the period tree instead of stale cached current periods. Implemented `currentDashaOnly`; no fabricated timing when no period exists. | Suitability, dosage, claimed benefits/harms, trial periods and removal prescriptions remain traditional heuristics. Scores are not empirical measures of safety or effectiveness. |
| `growth` | Fixed skipped D10, missing SAV and invalid timing periods. Negative SAV differences no longer claim income exceeds expenditure. | Velocity scores, archetypes, sector narratives and the four-stage life roadmap are manually weighted/templates, not established personal trajectories. |
| `summary`, `formattedMarkdown` | A comprehensive report freezes one `asOf` instant and forwards it to all time-sensitive sections, including gemstones. | A narrative summary inherits the limitations of its component modules. |

All 17 public prediction entry points reject missing/duplicate required planet
placements and invalid or inconsistent longitude/sign data. Malformed SAV/BAV
arrays are rejected rather than producing `NaN` scores. Missing divisional-chart
and Ashtakavarga caches are derived from the supplied natal positions rather
than invented from Aries or a fixed bindu value.

## Astronomical verification

Independent fixtures in `tests/fixtures/swiss-ephemeris.json` were calculated with
Swiss Ephemeris 2.10.03 through pyswisseph 2.10.3.2, using Moshier ephemerides,
Lahiri sidereal positions and the mean lunar node. They cover:

- 15 May 1998, 09:00 UTC, 25.872° N / 82.685° E.
- 1 January 2000, 12:00 UTC, 28.6139° N / 77.209° E.
- 4 November 2026, 00:00 UTC, 33.8688° S / 151.2093° E.

The Sun, Moon, five classical planets, mean node, Ascendant and Placidus cusps
agree within **0.01° for these fixtures**. The ayanamsa comparison tolerance is
0.001°. These are bounded reference checks, not an accuracy guarantee for every
date, location or sign/division boundary. The library's ayanamsa model remains an
approximation, and true-node charts can differ from its mean-node charts.

The `placidus` option previously fell through to whole-sign houses. It now uses
the existing Placidus geometry and converts cusps into the requested sidereal
frame. Polar-latitude behavior has not been independently validated in this
audit. Classical sign-based and cusp-based interpretations should be kept
conceptually distinct when comparing outputs.

Reference documentation: [Swiss Ephemeris programming interface](https://www.astro.com/swisseph/swephprg.htm).
The tests use committed numeric fixtures; Python and Swiss Ephemeris are not
production dependencies of this package.

## API behavior to account for

- `PlanetaryPosition.rashi` is **1–12**. Internal array indices are 0–11.
- Use an ISO timestamp with an explicit offset for birth input. `rawDate` is the
  authoritative timestamp for natal recalculation; a display date is ambiguous.
- `calculationConfig` is now retained on generated Kundli objects. Legacy charts
  without it default to Lahiri; callers of legacy Raman/KP charts should supply
  the original calculation setting.
- Dates shown by dasha predictions and gemstone timing use UTC calendar dates.
  Active periods use `[start, end)`, and nested periods must fit their parent.
- Missing future periods produce empty lists or absent `timing`, not guessed
  dates. A timeline query without a valid active Mahadasha/Antardasha throws.
- `health.longevityAssessment.category` no longer returns numerical lifespan
  bands, and `health.criticalAgeWindows` is empty because no individualized
  calculation for those ages exists.
- `currentDashaOnly` filters positive gemstone suggestions to active windows;
  prohibitions stay visible.
- Numeric score fields are rule indices, **not calibrated probabilities**.

## Validation and remaining work

Run `npm test` for TypeScript build and regression tests. CI now runs the tests
on its existing Node matrix. The compiler is declared as a development
dependency, so a clean install can build the package.

The substantial remaining question is interpretation validity: confirm a
specific textual tradition, replace generic narratives with explicit evidence,
and evaluate event claims against independently labeled historical examples.
Without that work, describing every prediction key as correct would be
unsupported. This audit fixes demonstrable software defects and records the
boundary of what was actually verified.
