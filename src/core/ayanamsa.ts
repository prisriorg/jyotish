export type AyanamsaType = 'lahiri' | 'raman' | 'kp';

export function getAyanamsa(date: Date, type: AyanamsaType = 'lahiri'): number {
    // Julian Day Calculation
    // We can use astronomy-engine's utilities if exposed, or implement standard formula
    // Using a high precision formula for Lahiri Ayanamsa (Chitra Paksha)

    // Formula based on standard epochs
    // Epoch J2000.0 = 2000 Jan 1 12:00 TT = JD 2451545.0
    // Rate is approx 5029 arcsec per CENTURY (approx 50.29 arcsec per year)

    const time = date.getTime();
    const JD = (time / 86400000) + 2440587.5; // Date to JD

    const T = (JD - 2451545.0) / 36525.0; // Julian centuries since J2000

    // Lahiri (Chitrapaksha) is DEFINED as 23°15'00" at JD 2435553.5
    // (21 March 1956, 0h) — the Indian Calendar Reform Committee value,
    // and the definition Swiss Ephemeris encodes for SE_SIDM_LAHIRI.
    //
    // The previous J2000 anchor of 23°51'25.532" does not satisfy that
    // definition: propagated back through the polynomial below it gives
    // 23°14'43.889" at the defining epoch, 16.111 arcsec low. The anchor
    // used here is derived by requiring the polynomial to reproduce
    // 23°15'00.000" exactly at JD 2435553.5, so the series is traceable
    // to the definition rather than to an unsourced constant:
    //
    //   T_1956  = (2435553.5 - 2451545.0) / 36525 = -0.43776865...
    //   offset  = 5029.0966*T + 1.11161*T^2       = -2201.357"
    //   anchor  = 23°15'00" + 2201.357"           =  23°51'41.643"
    //
    // tests/ayanamsa.test.cjs asserts the defining epoch directly, so a
    // future change to the polynomial cannot silently break it again.
    //
    // Caveat: this is still a quadratic approximation. Swiss Ephemeris
    // propagates Lahiri with the Vondrák (2011) precession model, so
    // values here drift from SE as |T| grows — they now agree at the
    // definition instead of being offset everywhere. Callers needing
    // SE-identical values across millennia want the full model.
    const offsetSeconds = 5029.0966 * T + 1.11161 * T * T;
    const initialAyanamsaSeconds = (23 * 3600) + (51 * 60) + 41.643;

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

