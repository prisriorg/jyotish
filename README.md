# @prisri/jyotish

[![npm version](https://img.shields.io/npm/v/@prisri/jyotish.svg)](https://www.npmjs.com/package/@prisri/jyotish)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

A high-performance, developer-friendly TypeScript/JavaScript library for **Jyotish (Vedic Astrology)** and **Panchangam** calculations, powered by high-precision ephemeris algorithms via `astronomy-engine`.

---

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Core Modules & Examples](#-core-modules--examples)
  - [1. Janam Kundli (Birth Chart)](#1-janam-kundli-birth-chart)
  - [2. Graha Drishti (Planetary Aspects)](#2-graha-drishti-planetary-aspects-new-in-v109)
  - [3. Ashtakavarga System (BAV & SAV)](#3-ashtakavarga-system-bav--sav-new-in-v109)
  - [4. Bhava Chalit Chart (Sripati / Equal House)](#4-bhava-chalit-chart-sripati--equal-house)
  - [5. KP Astrology (Krishnamurti Paddhati)](#5-kp-astrology-krishnamurti-paddhati)
  - [6. Kundli Matching (Ashtakoota Milan & Mangal Dosha)](#6-kundli-matching-ashtakoota-guna-milan)
  - [7. Complete Panchangam & Muhurta](#7-complete-panchangam--muhurta)
  - [8. Transits, Sade Sati & Daily Strengths](#8-transits-sade-sati--daily-strengths)
  - [9. Festivals & Ekadashis](#9-festivals--ekadashis)
  - [10. Life Predictions & Guidance (Career, Wealth, Marriage, Remedies)](#10-life-predictions--guidance-career-wealth-marriage-remedies)
- [Configuration Options](#-configuration-options)
- [TypeScript Types Reference](#-typescript-types-reference)
- [License](#-license)

---

## 🚀 Features

- **Accurate Astronomical Engine**: Sidereal calculations with multiple Ayanamsas (`Lahiri`, `KP`, `Raman`).
- **Janam Kundli (Horoscope)**: Lagna, 9 Vedic planets + Outer planets, Dignities (Exalted, Debilitated, Combust, Retrograde, Vargottama), Houses.
- **Divisional Charts (Vargas)**: Accurate classical algorithms for D1 through D60 (D1, D2, D3, D4, D7, D9 Navamsha, D10 Dashamsha, D12, D16, D20, D24, D27, D30, D40, D45, D60).
- **Vimshottari Dasha Engine**: Full 120-year tree spanning Mahadasha, Antardasha, and Pratyantardasha with precise birth balance.
- **Graha Drishti (Aspects)**: Complete Parashari planetary aspects (7th full aspect, Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th, Rahu/Ketu, mutual aspects, house aspects).
- **Ashtakavarga Engine**: 7-planet Bhinnashtakavarga (BAV), Sarvashtakavarga (SAV) per rashi and house, house strength evaluation, and Kakshya analysis.
- **Bhava Chalit Chart**: Sripati and Equal House systems with Bhava Madhyas, Sandhis, spans, and planet shift detection.
- **KP System**: Placidus cusps, 4-fold rulers (Sign, Star, Sub, Sub-sub lords), 4-level Significators (A, B, C, D), and Ruling Planets (RP).
- **Kundli Matching (Milan)**: Full 36 Guna Ashtakoota Milan (Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi) + Mangal Dosha detection & cancellations.
- **Comprehensive Panchangam**: Tithi, Nakshatra, Yoga, Karana, Vara, Sunrise/Sunset, Rahu Kalam, Yamaganda, Gulika, Abhijit Muhurta, Brahma Muhurta, Choghadiya, Hora, Gowri Panchangam.
- **Muhurta & Transit Indicators**: Sade Sati (with phases), Dhaiya, Chandrashtama, Tarabalam, Disha Shoola.

---

## 📦 Installation

```bash
npm install @prisri/jyotish
```

Or using Yarn / pnpm:

```bash
yarn add @prisri/jyotish
# or
pnpm add @prisri/jyotish
```

---

## ⚡ Quick Start

```typescript
import { getKundli, Observer } from '@prisri/jyotish';

// 1. Specify Date (UTC or ISO string with timezone)
const birthDate = new Date('1995-05-15T14:30:00+05:30');

// 2. Specify Geographic Location: Observer(latitude, longitude, elevationMeters)
const observer = new Observer(28.6139, 77.2090, 0); // New Delhi

// 3. Calculate Kundli
const kundli = getKundli(birthDate, observer);

console.log(`Lagna: ${kundli.ascendant.rashiName} (${kundli.ascendant.degree}°${kundli.ascendant.minute}')`);
console.log(`Moon Sign: ${kundli.planets.Moon.rashiName} in ${kundli.planets.Moon.nakshatra}`);
console.log(`Current Mahadasha:`, kundli.dasha.mahadashas[0].planet);
```

---

## 📖 Core Modules & Examples

### 1. Janam Kundli (Birth Chart)

`getKundli()` computes the complete Janam Kundli including Ascendant, planetary positions with planetary dignities, 12 houses, Vimshottari Dasha, Vargas (D1 to D60), Graha Drishti, and Ashtakavarga.

```typescript
import { getKundli, Observer } from '@prisri/jyotish';

const date = new Date('2000-01-01T12:00:00+05:30');
const observer = new Observer(19.0760, 72.8777, 0); // Mumbai

const kundli = getKundli(date, observer, {
  ayanamsa: 'lahiri',          // 'lahiri' | 'kp' | 'raman'
  houseSystem: 'whole_sign',   // 'whole_sign' | 'equal_house' | 'sripati' | 'placidus'
  includeChalit: true,        // Automatically attach Chalit chart
  includeKp: true             // Automatically attach KP chart
});

// Access Planetary Dignities & Attributes
const jupiter = kundli.planets.Jupiter;
console.log({
  rashi: jupiter.rashiName,
  degree: `${jupiter.degree}° ${jupiter.minute}'`,
  dignity: jupiter.dignity,       // 'exalted' | 'moolatrikona' | 'own' | 'friendly' | 'neutral' | 'enemy' | 'debilitated'
  isRetrograde: jupiter.isRetrograde,
  isCombust: jupiter.isCombust,
  isVargottama: jupiter.isVargottama
});

// Access Navamsha (D9) Chart
const d9 = kundli.vargas?.d9;
console.log('D9 Lagna:', d9?.ascendant.rashiName);
console.log('D9 Mars House:', d9?.planets.Mars.house);

// Access Vimshottari Dasha Tree
const currentMaha = kundli.dasha.mahadashas[0];
console.log(`Maha: ${currentMaha.planet}, Ends: ${currentMaha.endTime}`);
currentMaha.antars?.forEach(antar => {
  console.log(`  Antar: ${antar.planet} (${antar.startTime.toDateString()} - ${antar.endTime.toDateString()})`);
});
```

---

### 2. Graha Drishti (Planetary Aspects) *(New in v1.0.9)*

Automatically computed and available on `kundli.drishti`, or callable standalone via `getGrahaDrishti(kundli)`. Calculates classical Parashari aspects (Full 7th aspect, Mars 4th/8th, Jupiter 5th/9th, Saturn 3rd/10th, Rahu/Ketu 5th/9th).

```typescript
import { getKundli, getGrahaDrishti, Observer } from '@prisri/jyotish';

const kundli = getKundli(new Date(), new Observer(28.6139, 77.2090, 0));

// 1. Inspect Planetary Aspects
const drishti = kundli.drishti || getGrahaDrishti(kundli);

// Which planets does Mars aspect?
const marsAspects = drishti.planetAspects.Mars;
console.log('Mars aspects houses:', marsAspects.aspectedHouses.map(h => `H${h.house} (${h.type})`));
console.log('Mars aspects planets:', marsAspects.aspectedPlanets.map(p => `${p.planet} (${p.type})`));

// Which planets are aspecting the 7th house?
console.log('Planets aspecting House 7:', drishti.houseAspects[7]);

// Mutual Aspects (planets looking at each other)
drishti.mutualAspects.forEach(m => {
  console.log(`${m.planet1} <-> ${m.planet2} (Mutual aspect)`);
});
```

---

### 3. Ashtakavarga System (BAV & SAV) *(New in v1.0.9)*

Includes Bhinnashtakavarga (BAV) for all 7 planets calculated from 8 reference points, Sarvashtakavarga (SAV) totals per rashi and house, house strength ratings, and Kakshya calculations.

```typescript
import { getKundli, getAshtakavarga, Observer } from '@prisri/jyotish';

const kundli = getKundli(new Date(), new Observer(28.6139, 77.2090, 0));

const av = kundli.ashtakavarga || getAshtakavarga(kundli);

// 1. Sarvashtakavarga (SAV) Totals
console.log('Total Bindus:', av.sav.totalBindus); // Typically 337
console.log('Strongest House:', av.sav.strongestHouse);
console.log('Weakest House:', av.sav.weakestHouse);

// SAV Points and Strength per House
av.sav.houseStrengths.forEach(hs => {
  console.log(`House ${hs.house}: ${hs.bindus} bindus -> ${hs.strength} (${hs.category})`);
});

// 2. Bhinnashtakavarga (BAV) for Jupiter
const jupiterBAV = av.bav.Jupiter;
console.log('Jupiter BAV Total Bindus:', jupiterBAV.totalBindus);
console.log('Jupiter Bindus in Aries (Rashi 1):', jupiterBAV.byRashi[0]);
console.log('Jupiter Bindus in 1st House:', jupiterBAV.byHouse[0]);
```

---

### 4. Bhava Chalit Chart (Sripati / Equal House)

Calculates the actual house placement of planets, Bhava Madhyas (mid-points), Sandhis (junctions), and detects house shifts relative to the D1 chart.

```typescript
import { getKundli, getChalitChart, formatChalitChart, getPlanetChalitInfo, Observer } from '@prisri/jyotish';

const kundli = getKundli(new Date(), new Observer(28.6139, 77.2090, 0));

// Calculate Chalit Chart ('sripati' or 'equal_house')
const chalit = getChalitChart(kundli, 'sripati');

// Pretty-print Chalit Table
console.log(formatChalitChart(chalit));

// Check if a planet has shifted into an adjacent house
const moonShift = getPlanetChalitInfo(chalit, 'Moon');
console.log({
  d1House: moonShift?.rashiHouse,
  chalitHouse: moonShift?.house,
  shifted: moonShift?.shifted // -1: shifted backward, 0: same, 1: shifted forward
});
```

---

### 5. KP Astrology (Krishnamurti Paddhati)

Full KP calculation suite with **Placidus House Cusps**, **4-fold Rulers** (Sign, Star, Sub, Sub-sub lords), **4-Level KP Significators (A, B, C, D)**, and **Ruling Planets (RP)**.

```typescript
import { getKpChart, formatKpChart, getKpPlanetInfo, Observer } from '@prisri/jyotish';

const date = new Date('1998-11-20T08:30:00+05:30');
const observer = new Observer(28.6139, 77.2090, 0);

const kp = getKpChart(date, observer, { ayanamsa: 'kp' });

// Formatted KP summary table
console.log(formatKpChart(kp));

// 1. Cusp Sub-Lords (e.g., 7th House for Marriage)
const cusp7 = kp.cusps[6]; // 0-indexed
console.log(`7th Cusp Sub-Lord: ${cusp7.subLord}, Sub-Sub-Lord: ${cusp7.subSubLord}`);

// 2. Planet 4-fold rulers
const venus = getKpPlanetInfo(kp, 'Venus');
console.log(`Venus Star Lord: ${venus?.nakshatraLord}, Sub-Lord: ${venus?.subLord}`);

// 3. Ruling Planets (RP)
console.log('KP Ruling Planets:', kp.rulingPlanets?.rulingPlanetsList);

// 4. House Significators (Level A, B, C, D)
console.log('House 10 Significators:', kp.significators?.houses[10]);
```

---

### 6. Kundli Matching (Ashtakoota Guna Milan)

Calculates the traditional 36-point Guna Milan along with Mangal Dosha detection and cancellations for both charts.

```typescript
import { getKundli, matchKundli, checkMangalDosha, Observer } from '@prisri/jyotish';

const boyKundli = getKundli(new Date('1994-06-12T06:30:00+05:30'), new Observer(28.6139, 77.2090, 0));
const girlKundli = getKundli(new Date('1996-08-25T11:15:00+05:30'), new Observer(26.8467, 80.9462, 0));

// Ashtakoota Match (Score out of 36)
const match = matchKundli(boyKundli, girlKundli);

console.log(`Total Score: ${match.totalScore} / 36`);
console.log(`Verdict: ${match.verdict}`); // e.g. "Good Match", "Average Match", "Poor Match"

// Breakdown of the 8 Kootas:
match.kootas.forEach(k => {
  console.log(`${k.name}: ${k.score}/${k.maxScore} (${k.description})`);
});

// Mangal Dosha check with exceptions
const boyDosha = checkMangalDosha(boyKundli);
const girlDosha = checkMangalDosha(girlKundli);
console.log('Boy Mangal Dosha:', boyDosha.hasDosha, boyDosha.description);
console.log('Girl Mangal Dosha:', girlDosha.hasDosha, girlDosha.description);
```

---

### 7. Complete Panchangam & Muhurta

Provides instant or day-long Vedic calendar metrics: Tithi, Nakshatra, Yoga, Karana, Vara, Sunrise/Sunset, Choghadiya, Hora, and inauspicious/auspicious Muhurtas.

```typescript
import { getPanchangamDetails, Observer } from '@prisri/jyotish';

const now = new Date();
const observer = new Observer(28.6139, 77.2090, 0); // New Delhi

const panchang = getPanchangamDetails(now, observer);

// Basic Panchangam Elements
console.log(`Tithi: ${panchang.tithi.name} (${panchang.paksha} Paksha)`);
console.log(`Nakshatra: ${panchang.nakshatra.name} (Pada ${panchang.nakshatraPada})`);
console.log(`Yoga: ${panchang.yoga.name}`);
console.log(`Karana: ${panchang.karana.name}`);
console.log(`Vara: ${panchang.vara.name}`);

// Solar & Lunar Timings
console.log(`Sunrise: ${panchang.sunrise?.toLocaleTimeString()}`);
console.log(`Sunset: ${panchang.sunset?.toLocaleTimeString()}`);

// Auspicious & Inauspicious Periods
console.log('Rahu Kalam:', panchang.rahuKalam?.start, 'to', panchang.rahuKalam?.end);
console.log('Abhijit Muhurta:', panchang.abhijitMuhurta?.start, 'to', panchang.abhijitMuhurta?.end);
console.log('Brahma Muhurta:', panchang.brahmaMuhurta?.start, 'to', panchang.brahmaMuhurta?.end);

// Hora & Choghadiya
console.log('Current Hora Lord:', panchang.currentHora?.lord);
```

---

### 8. Vedic Gochar (Transits), Sade Sati & Daily Strengths

Perform comprehensive Vedic planetary transit (Gochar) analysis for all 9 grahas, including classical **Vedha (obstruction)** detection, Shastric exemptions, Sade Sati, Dhaiya, Chandrashtama, and life-area impact scoring.

```typescript
import { 
  getKundli,
  getGocharAnalysis,
  getPlanetGochar,
  checkSadeSati, 
  checkDhaiya, 
  getChandrashtama, 
  getTarabalam, 
  getDishaShoola,
  isDirectionSafe 
} from '@prisri/jyotish';

// 1. Comprehensive Gochar Analysis for a Kundli
const gochar = getGocharAnalysis(kundli, new Date());
console.log('Overall Verdict:', gochar.overallVerdict, `(${gochar.overallFavorablePercentage}% Favorable)`);
console.log('Sade Sati Active:', gochar.specialTransits.sadeSati.status);
console.log('Guru Gochar:', gochar.specialTransits.guruGochar.blessingSummary);
console.log('Career Impact:', gochar.lifeAreas.career.rating, '-', gochar.lifeAreas.career.summary);
console.log('Wealth Impact:', gochar.lifeAreas.wealth.rating, '-', gochar.lifeAreas.wealth.summary);

// Inspect any individual transiting planet
const jupTransit = gochar.planets.Jupiter;
console.log(`Jupiter in ${jupTransit.rashiName}: House ${jupTransit.houseFromMoon} from Moon, Status: ${jupTransit.netStatus}, Vedha: ${jupTransit.hasVedha}`);

// Quick single planet lookup
const saturnTransit = getPlanetGochar('Saturn', kundli);
console.log('Saturn Transit Status:', saturnTransit?.netStatus, saturnTransit?.prediction);

// 2. Direct Shani Sade Sati & Dhaiya calculations
const sadeSati = checkSadeSati(120.5, 330.2);
console.log('Sade Sati Active:', sadeSati.status, 'Phase:', sadeSati.phase); // Phase 1, 2, or 3

const dhaiya = checkDhaiya(120.5, 210.5);
console.log('Dhaiya Active:', dhaiya.status, 'Type:', dhaiya.type); // 'Fourth' (Kantaka) or 'Eighth' (Ashtama)

// 3. Chandrashtama (Inauspicious 8th Moon transit)
const chandra = getChandrashtama(0, 7); // Aries native, Moon in Scorpio
console.log('Chandrashtama Active:', chandra.isActive);

// 4. Tarabalam & Disha Shoola
const tara = getTarabalam(0, 1); // Ashwini to Bharani
console.log(`Tara: ${tara.taraName}, Auspicious: ${tara.isAuspicious} (${tara.description})`);

const shoola = getDishaShoola(0); // 0 = Sunday
console.log(`Avoid traveling ${shoola.inauspiciousDirection} on ${shoola.varaName}`);
console.log('Is traveling North safe on Sunday?', isDirectionSafe('North', 0));
```

---

### 9. Festivals & Ekadashis

Retrieve accurate Hindu festivals, Vratas, and Ekadashi dates calculated per Udaya Tithi.

```typescript
import { getFestivals, getEkadashiName } from '@prisri/jyotish';

const date = new Date('2026-11-08');
const festivals = getFestivals(date);

if (festivals.length > 0) {
  festivals.forEach(f => {
    console.log(`Festival: ${f.name} - ${f.description}`);
  });
}

// Get Ekadashi name for a specific Tithi and Masa
const ekadashi = getEkadashiName(11, 7); // Shukla Ekadashi in Kartika Masa
console.log('Ekadashi:', ekadashi); // e.g. "Prabodhini / Devutthana Ekadashi"
```

---

### 10. Multi-System Life Predictions & Guidance (Parashari, Jaimini, Chalit, KP & Lal Kitab)

A unified Vedic prediction suite synthesizing **Classical Parashari (D1/D9/D10)**, **Jaimini Chara Karakas**, **Sripati Bhava Chalit**, **KP Astrology (Cusp Sub-Lords)**, and **Lal Kitab Teva & Totke** for pinpoint accuracy on any chart:

```typescript
import { 
  getKundli, 
  getCareerPrediction, 
  getWealthPrediction, 
  getMarriagePrediction, 
  getRemedies, 
  getChalitAnalysis,
  getKpAnalysis,
  getLalKitabAnalysis,
  getJaiminiKarakas,
  getComprehensiveReport,
  Observer 
} from '@prisri/jyotish';

const kundli = getKundli(new Date('2004-02-20T07:15:00+05:30'), new Observer(25.872, 82.685, 0));

// 1. Career: Job vs Business, 10th Lord Placement, Jaimini AmK, KP 10th Sub-Lord
const career = getCareerPrediction(kundli);
console.log('Recommendation:', career.recommendation);
console.log('10th Lord Shastra Placement:', career.tenthLordPlacementResult);
console.log('Jaimini Amatyakaraka (AmK):', career.amatyakarakaInsight);
console.log('KP 10th Sub-Lord Insight:', career.kpInsight);

// 2. Wealth: Dhana Yogas, Vipreet Raj Yogas, 2nd & 11th Lord Placements, Lal Kitab Kismat
const wealth = getWealthPrediction(kundli);
console.log('Wealth Rating:', wealth.wealthRating);
console.log('2nd Lord Placement:', wealth.secondLordPlacementResult);
console.log('11th Lord Placement:', wealth.eleventhLordPlacementResult);
console.log('Vipreet Raj Yogas:', wealth.vipreetRajYogas);

// 3. Marriage: Type (Love vs Arranged), Age Gap (+ -), Jaimini Darakaraka (DK), KP 7th Sub-Lord
const marriage = getMarriagePrediction(kundli);
console.log('Marriage Type:', marriage.marriageType.recommendation);
console.log('Spouse Age Gap:', marriage.spouseAgeDifference.relativeAge, `(${marriage.spouseAgeDifference.estimatedDifferenceYears})`);
console.log('7th Lord Placement:', marriage.seventhLordPlacementResult);
console.log('Jaimini Darakaraka (Spouse):', marriage.darakarakaInsight);

// 4. Jaimini Chara Karakas (AK, AmK, BK, MK, PK, GK, DK)
const jaimini = getJaiminiKarakas(kundli);
console.log('Atmakaraka (Soul):', jaimini.atmakaraka.planet, `(${jaimini.atmakaraka.formattedDegree})`);
console.log('Amatyakaraka (Career):', jaimini.amatyakaraka.planet, `(${jaimini.amatyakaraka.formattedDegree})`);
console.log('Darakaraka (Spouse):', jaimini.darakaraka.planet, `(${jaimini.darakaraka.formattedDegree})`);

// 5. Bhava Chalit Analysis (Planetary Shifts & Real Occupants)
const chalit = getChalitAnalysis(kundli);
console.log('Shifted Planets (D1 -> Chalit):', chalit.shiftedPlanets);

// 6. KP System (Krishnamurti Paddhati Cusp Sub-Lords)
const kp = getKpAnalysis(kundli);
console.log('Career Cusp 10 Sub-Lord:', kp.careerCusp10.subLord);
console.log('Marriage Cusp 7 Sub-Lord:', kp.marriageCusp7.subLord);

// 7. Lal Kitab Teva & Authentic Totke
const lalkitab = getLalKitabAnalysis(kundli);
console.log('Teva Classification:', lalkitab.tevaType); // e.g. "Dharmi Teva (Blessed / Auspicious)"
console.log('Kismat Ka Grah:', lalkitab.kismatKaGrah.planet, `(House ${lalkitab.kismatKaGrah.house})`);
console.log('Lal Kitab Actionable Totke:', lalkitab.lalKitabRemedies);

// 8. Complete Multi-System Grand Report (Structured JSON + Markdown)
const report = getComprehensiveReport(kundli);
console.log(report.formattedMarkdown); // Full multi-system formatted Markdown reading!
```

---

## ⚙️ Configuration Options

### Ayanamsa Systems

Supported in `getKundli()`, `getKpChart()`, and `getAyanamsa()`:
- `'lahiri'` (Default - Chitra Paksha Ayanamsa)
- `'kp'` (Krishnamurti Paddhati Ayanamsa)
- `'raman'` (B.V. Raman Ayanamsa)

### House Systems

Supported in `getKundli()`, `getChalitChart()`, and `getHouses()`:
- `'whole_sign'` (Default Vedic whole-sign houses)
- `'sripati'` (Classical Vedic Sripati / Porphyry-style Chalit)
- `'equal_house'` (Equal 30° from exact Lagna degree)
- `'placidus'` (Standard semi-arc division used in KP Astrology)

---

## 📐 TypeScript Types Reference

All types are exported directly from `@prisri/jyotish`:

```typescript
import type {
  Kundli,
  KundliConfig,
  PlanetaryPosition,
  Bhava,
  VargaChart,
  VimshottariDasha,
  ChalitChart,
  KpChart,
  KpCusp,
  KpPlanet,
  KpSignificators,
  KpRulingPlanets,
  DrishtiResult,
  PlanetAspect,
  MutualAspect,
  AshtakavargaResult,
  PlanetBAV,
  SAVResult,
  PanchangamDetails,
  MatchResult,
  DoshaResult,
  KootaResult,
  TarabalamInfo,
  ChandrashtamaInfo,
  DishaShoola,
  CareerPrediction,
  WealthPrediction,
  MarriagePrediction,
  RemediesPrediction,
  ComprehensiveReport
} from '@prisri/jyotish';
```

---

## 🤝 Contributing

Contributions, bug reports, and feature requests are welcome!
Feel free to open an issue or submit a Pull Request on [GitHub](https://github.com/prisriorg/jyotish).

---

## 📄 License

ISC License © [Priyansh Srivastava](https://github.com/prisriorg)
