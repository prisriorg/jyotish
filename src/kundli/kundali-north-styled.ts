// North Indian Kundali SVG — diamond / triangle layout
// Matches the classic layout with corner diagonals + inner diamond lines

export interface House { number: number; planets: string[] }
export interface AscendantInfo { rashi: number; rashiName: string; longitude: number; nakshatra: string; pada: number }
export interface BirthDetails { date: string; time: string }
export interface PlanetInfo { isRetrograde?: boolean; isCombust?: boolean; dignity?: string }
export interface Kundli {
    houses: House[];
    ascendant: AscendantInfo;
    birthDetails: BirthDetails;
    title?: string;
    planets?: Record<string, PlanetInfo>;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SYMBOL: Record<string, string> = {
    Sun: "☉", Moon: "☽", Mars: "♂", Mercury: "☿", Jupiter: "♃",
    Venus: "♀", Saturn: "♄", Rahu: "☊", Ketu: "☋",
    Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
};
const SHORT: Record<string, string> = {
    Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju",
    Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke",
    Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
};

// House-number label positions (500×500 base)
const H_NUM: Record<number, [number, number]> = {
    1: [250, 193], 2: [125, 93], 3: [50, 168],
    4: [125, 268], 5: [50, 368], 6: [125, 443],
    7: [250, 343], 8: [375, 443], 9: [450, 368],
    10: [375, 268], 11: [450, 168], 12: [375, 93],
};

// Planet-stack anchor (start x, start y) per house (500×500 base)
const H_PLN: Record<number, [number, number]> = {
    1: [250, 28], 2: [125, 22], 3: [32, 88],
    4: [48, 210], 5: [32, 292], 6: [125, 412],
    7: [250, 375], 8: [375, 412], 9: [465, 285],
    10: [462, 202], 11: [465, 88], 12: [375, 22],
};

// ── Helpers ────────────────────────────────────────────────────────────────

const x = (s: string) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function lagnaLabel(asc: AscendantInfo) {
    const dec = asc.longitude % 30;
    const d = Math.floor(dec), m = Math.floor((dec - d) * 60);
    return `${asc.rashiName} ${d}°${m}'`;
}

function planetClass(name: string, map?: Record<string, PlanetInfo>) {
    const p = map?.[name];
    if (!p) return { cls: "planet", suffix: "" };
    const s = (p.isRetrograde ? "ᴿ" : "") + (p.isCombust ? "ᶜ" : "");
    if (p.isRetrograde) return { cls: "retrograde", suffix: s };
    if (p.dignity === "exalted") return { cls: "planet-exalted", suffix: s };
    if (p.dignity === "debilitated") return { cls: "planet-debilitated", suffix: s };
    if (p.isCombust) return { cls: "planet-combust", suffix: s };
    return { cls: "planet", suffix: s };
}

// ── Main generator ─────────────────────────────────────────────────────────

export const generateKundaliSVGNorthStyled = (kundli: Kundli, size = 500): string => {
    const S = size;
    const sc = (v: number) => +(v * S / 500).toFixed(1);

    // house → planets map
    const hmap: Record<number, string[]> = {};
    for (let i = 1; i <= 12; i++) hmap[i] = [];
    for (const h of (kundli.houses ?? []))
        if (h?.number >= 1 && h?.number <= 12) hmap[h.number] = h.planets ?? [];

    // ── House numbers
    const houseNums = Object.entries(H_NUM).map(([h, [hx, hy]]) =>
        `<text x="${sc(hx)}" y="${sc(hy)}" text-anchor="middle" class="rashi-num">${h}</text>`
    ).join("\n  ");

    // ── Planet texts
    let planetTexts = "";
    for (let h = 1; h <= 12; h++) {
        const pls = hmap[h]; if (!pls.length) continue;
        const [ax, ay] = H_PLN[h];
        pls.forEach((name, i) => {
            const sym = SYMBOL[name] ?? name.slice(0, 2);
            const short = SHORT[name] ?? name.slice(0, 2);
            const { cls, suffix } = planetClass(name, kundli.planets);
            const py = sc(ay + i * 20);
            planetTexts += `<text x="${sc(ax + 2)}" y="${py}" text-anchor="middle" class="${cls}">${x(sym)} ${x(short)}${x(suffix)}</text>\n  `;
        });
    }

    // ── Center info block
    const cx = sc(250), cy = sc(250);
    const lagna = lagnaLabel(kundli.ascendant);
    const nak = `${kundli.ascendant.nakshatra} P${kundli.ascendant.pada}`;
    const title = kundli.title ?? "Janam Kundali";
    const fs = (n: number) => sc(n) + "px"; // scaled font-size helper

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#16213e"/>
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#ffd700" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#ff8c00" stop-opacity="0.85"/>
    </linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="${sc(2.5)}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <style>
    .rashi-num        { font: ${fs(11)} 'Segoe UI', sans-serif; fill: #888; }
    .planet           { font: bold ${fs(13)} 'Segoe UI', sans-serif; fill: #00d4ff; }
    .planet-exalted   { font: bold ${fs(13)} 'Segoe UI', sans-serif; fill: #00ff88; }
    .planet-debilitated { font: bold ${fs(13)} 'Segoe UI', sans-serif; fill: #ff6b6b; }
    .planet-combust   { font: bold ${fs(13)} 'Segoe UI', sans-serif; fill: #ff9f43; }
    .retrograde       { font: bold italic ${fs(13)} 'Segoe UI', sans-serif; fill: #ffdd57; }
    .center-title     { font: bold ${fs(14)} 'Segoe UI', sans-serif; fill: #e2e8f0; }
    .center-lagna     { font: bold ${fs(12)} 'Segoe UI', sans-serif; fill: #ffd700; }
    .center-nak       { font: ${fs(11)} 'Segoe UI', sans-serif; fill: #94a3b8; }
    .center-date      { font: ${fs(10)} 'Segoe UI', sans-serif; fill: #64748b; }
  </style>

  <!-- Background -->
  <rect width="${S}" height="${S}" fill="url(#bgGrad)"/>

  <!-- Chart lines: 2 corner diagonals + 4 inner-diamond sides -->
  <g stroke="url(#lineGrad)" stroke-width="${sc(2)}" filter="url(#glow)">
    <line x1="${sc(0)}"   y1="${sc(0)}"   x2="${sc(500)}" y2="${sc(500)}"/>
    <line x1="${sc(500)}" y1="${sc(0)}"   x2="${sc(0)}"   y2="${sc(500)}"/>
    <line x1="${sc(250)}" y1="${sc(0)}"   x2="${sc(500)}" y2="${sc(250)}"/>
    <line x1="${sc(500)}" y1="${sc(250)}" x2="${sc(250)}" y2="${sc(500)}"/>
    <line x1="${sc(250)}" y1="${sc(500)}" x2="${sc(0)}"   y2="${sc(250)}"/>
    <line x1="${sc(0)}"   y1="${sc(250)}" x2="${sc(250)}" y2="${sc(0)}"/>
  </g>

  <!-- House numbers -->
  ${houseNums}

  <!-- Planets -->
  ${planetTexts}
</svg>`;
};
