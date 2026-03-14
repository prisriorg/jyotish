# @prisri/jyotish

A comprehensive library for Jyotish (Vedic astrology) calculations, built on top of the highly accurate.

## Installation

```bash
npm install @prisri/jyotish
```

## Features

- **Kundli (Birth Chart)**: Generate detailed Ascendant (Lagna), planetary positions, houses, Vimshottari Dasha, and divisional charts (Vargas D1 to D60).
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

## API Overview

The library encompasses the following broad modules:

- `core/calculations`: Fundamentals like planetary positions, nodes (Rahu/Ketu), Udaya Lagna, Tithi, Nakshatra.
- `core/ayanamsa`: Calculates the sidereal offset (Ayanamsa) using standard astrological models.
- `kundli`: Logic for generating and building a full birth chart structure (`getKundli()`), Vargas, and Houses.
- `matching`: Logic for calculating Ashtakoota compatibility between individuals.
- `core/muhurta`: Contains logic for determining auspicious/inauspicious times and specific astrological indicators (Sade Sati, Tarabalam, etc.).

## Open Source Contributions

Contributions, bug reports, and features are welcome! Feel free to raise an issue on the repository.

## License

ISC License © Priyansh Srivastava
