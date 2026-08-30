export type AyanamsaType = 'lahiri' | 'raman' | 'kp';

export function getAyanamsa(date: Date, type: AyanamsaType = 'lahiri'): number {
    // Julian Day Calculation
    // We can use astronomy-engine's utilities if exposed, or implement standard formula
    // Using a high precision formula for Lahiri Ayanamsa (Chitra Paksha)

    // Formula based on standard epochs
    // Epoch J2000.0 = 2000 Jan 1 12:00 TT = JD 2451545.0
    // Lahiri Ayanamsa at J2000.0 is approx 23° 51' 25.532"
    // Rate is approx 5029 arcsec per CENTURY (approx 50.29 arcsec per year)

    const time = date.getTime();
    const JD = (time / 86400000) + 2440587.5; // Date to JD

    const T = (JD - 2451545.0) / 36525.0; // Julian centuries since J2000

    // 23 deg 51' 25.532" (Standard Swiss Ephemeris Lahiri)
    // We strictly use the standard value for astronomical accuracy.
    const offsetSeconds = 5029.0966 * T + 1.11161 * T * T;
    const initialAyanamsaSeconds = (23 * 3600) + (51 * 60) + 25.532;

    const lahiriSeconds = initialAyanamsaSeconds + offsetSeconds;
    const lahiriAyanamsa = lahiriSeconds / 3600;

    if (type === 'kp') {
        // KP (Krishnamurti) Ayanamsa is approx 5' 54" (354 arcsec) less than Lahiri
        const kpOffsetSeconds = 354.0;
        return (lahiriSeconds - kpOffsetSeconds) / 3600;
    }

    if (type === 'raman') {
        // Raman Ayanamsa is approx 1° 26' 47" (5207 arcsec) less than Lahiri
        const ramanOffsetSeconds = 5207.0;
        return (lahiriSeconds - ramanOffsetSeconds) / 3600;
    }

    return lahiriAyanamsa;
}

