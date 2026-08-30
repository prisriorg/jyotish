# @prisri/jyotish

A comprehensive library for Jyotish (Vedic astrology) calculations, built on top of the highly accurate.

## Installation

```bash
npm install @prisri/jyotish
```

## Features

- **Kundli (Birth Chart)**: Generate detailed Ascendant (Lagna), planetary positions, houses, Vimshottari Dasha, and divisional charts (Vargas D1 to D60).
- **Chalit Chart**: Calculate exact planetary positions within houses for precise placement analysis.
- **Panchangam**: Calculate core elements like Tithi, Nakshatra, Yoga, Karana, and Vara.
- **Match Making**: Ashtakoota Guna Milan for marriage compatibility.
- **Festivals**: Determine Vedic festivals and fasting days (Ekadashi) accurately based on Tithis.
- **Doshas & Muhurta Elements**: Calculate Shoola, Chandrashtama, Tarabalam, and Sade Sati Daiya.

## Basic Usage

### 1. Generating a Janam Kundli

Calculates the Ascendant, planetary positions in Rashis and Nakshatras, house mappings, and Vimshottari Dasha.

```typescript
import { getKundli, Observer } from '@prisri/jyotish';

// Use UTC time or handle timezones strictly
const date = new Date('1990-01-01T10:00:00Z');

// Define location: Observer(latitude, longitude, elevation_in_meters)
const observer = new Observer(28.6139, 77.2090, 0); // New Delhi

// Generate the Kundli
const kundli = getKundli(date, observer, { houseSystem: 'whole_sign' });

console.log('Ascendant (Lagna):', kundli.ascendant.rashiName);
console.log('Planets:', kundli.planets);
console.log('Houses:', kundli.houses);
console.log('Dasha:', kundli.dasha);
```

### 2. Formatting Festivals

Easily look up Vedic festivals for any given day based on planetary positions and Udaya Tithi.

```typescript
import { getFestivals } from '@prisri/jyotish';

// Your target date
const today = new Date(); // Or any specific date
const festivals = getFestivals(today);

if (festivals.length > 0) {
  console.log('Festivals today:', festivals);
} else {
  console.log('No major festivals today.');
}
```

### 3. Panchangam Calculations

Direct access to underlying calculations like Tithi or Nakshatra is also available from the core modules.

```typescript
import { getAyanamsa, getTithi, getNakshatra } from '@prisri/jyotish';

const date = new Date();
const ayanamsa = getAyanamsa(date);

// Get current tithi / nakshatra
// Add specific observer/location data depending on your required precision and helper outputs
```

### 4. Chalit Chart (Bhava Chalit / Sripati)

Generate an authentic Vedic Bhava Chalit chart (Sripati or Equal House) with Bhava Madhyas, Sandhis (boundaries), spans, and house shift detection:

```typescript
import { getKundli, getChalitChart, formatChalitChart, getPlanetChalitInfo, getPlanetsInHouse, Observer } from '@prisri/jyotish';

const date = new Date('2004-02-20T07:15:00+05:30');
const observer = new Observer(25.872, 82.685, 0); // Varanasi
const kundli = getKundli(date, observer);

// Generate Chalit Chart (defaults to Sripati system)
const chalitChart = getChalitChart(kundli, 'sripati');

// Pretty-print formatted Bhava table and planetary shifts
console.log(formatChalitChart(chalitChart));

// Access individual Bhava Madhyas and Sandhis
chalitChart.bhavas?.forEach(bhava => {
  console.log(`H${bhava.houseNumber}: Madhya=${bhava.madhyaLongitude.toFixed(2)}°, Span=${bhava.span.toFixed(2)}°, Planets=${bhava.planets.join(', ')}`);
});

// Detect house shifts (shifted: -1 backward, 0 same, 1 forward)
const moon = getPlanetChalitInfo(chalitChart, 'Moon');
console.log('Moon shifted:', moon?.shifted, 'D1 House:', moon?.rashiHouse, 'Chalit House:', moon?.house);
```

### 5. KP Chart (Krishnamurti Paddhati)

Calculate complete Krishnamurti Paddhati chart with **Placidus House Cusps**, **4-fold Lords** (Sign, Star, Sub, Sub-Sub), exact planetary house allocations, **4-level KP Significators** (Levels A, B, C, D), and **KP Ruling Planets (RP)**:

```typescript
import { getKpChart, formatKpChart, getKpPlanetInfo, getPlanetsInKpHouse, getKpCuspInfo, Observer } from '@prisri/jyotish';

const date = new Date('2004-02-20T07:15:00+05:30');
const observer = new Observer(25.872, 82.685, 0);

// Generate full KP Chart (uses KP Ayanamsa and Placidus cusps)
const kpChart = getKpChart(date, observer, { ayanamsa: 'kp' });

// Comprehensive formatted report (Cusps, Planets, Significators, Ruling Planets)
console.log(formatKpChart(kpChart));

// Access Placidus Cuspal Sub-Lords & Sub-Sub-Lords
kpChart.cusps.forEach(cusp => {
  console.log(`Cusp ${cusp.houseNumber}: ${cusp.degree}°${cusp.minute}' ${cusp.rashiName} | Sign: ${cusp.rashiLord} | Star: ${cusp.nakshatraLord} | Sub: ${cusp.subLord} | Sub-Sub: ${cusp.subSubLord}`);
});

// Access Planetary 4-fold rulers and Placidus House
const jupiter = getKpPlanetInfo(kpChart, 'Jupiter');
console.log('Jupiter Sub-Lord:', jupiter?.subLord, 'House:', jupiter?.house);

// KP Ruling Planets (Ascendant, Moon, Day Lord)
console.log('Ruling Planets:', kpChart.rulingPlanets?.rulingPlanetsList);

// KP 4-Level Significators
console.log('House 1 Significators:', kpChart.significators?.houses[1]);
console.log('Sun House Significations:', kpChart.significators?.planets['Sun']);
```

## API Overview

The library encompasses the following broad modules:

- `core/calculations`: Fundamentals like planetary positions, nodes (Rahu/Ketu), Udaya Lagna, Midheaven (MC), KP Sub-Lord and Sub-Sub-Lord calculators, Tithi, Nakshatra.
- `core/ayanamsa`: Calculates sidereal offsets (`lahiri`, `kp`, `raman`).
- `kundli`: Full Janam Kundli (`getKundli()`), Divisional charts (Vargas D1 to D60), Houses, Chalit Chart (`getChalitChart()`), and KP Chart (`getKpChart()`).
- `matching`: Ashtakoota compatibility between individuals.
- `core/muhurta`: Contains logic for determining auspicious/inauspicious times and specific astrological indicators (Sade Sati, Tarabalam, etc.).

## Open Source Contributions

Contributions, bug reports, and features are welcome! Feel free to raise an issue on the repository.

## License

ISC License © Priyansh Srivastava
