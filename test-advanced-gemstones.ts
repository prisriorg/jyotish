import { Observer, getKundli, getGemstoneRecommendation } from "./src/index";

console.log("===============================================================================");
console.log("   🌟 ADVANCED GEMSTONE VERIFICATION: EXALTED, DEBILITATED, ASTH, VAKRI, BNN");
console.log("===============================================================================\n");

const observer = new Observer(28.6139, 77.2090, 0); // New Delhi
// Chart 1: Aries Lagna with Exalted Sun (Aries) or various placements
const date = new Date("1995-04-16T06:30:00+05:30"); // Mid-April -> Sun in Aries (Exalted!)

const kundli = getKundli(date, observer, {
  includeChalit: true,
  includeKp: true,
});

console.log(`Lagna: ${kundli.ascendant.rashiName} (${kundli.ascendant.rashi}) | Lord: ${kundli.ascendant.rashiLord}`);
console.log(`Planets in Chart:`);
for (const [p, pos] of Object.entries(kundli.planets)) {
  console.log(`  - ${p}: Rashi ${pos.rashiName} (${pos.rashi}), Combust: ${pos.isCombust}, Retrograde: ${pos.isRetrograde}`);
}

const rep = getGemstoneRecommendation(kundli, { lang: "hi", userWeightKg: 70 });

console.log("\n-------------------------------------------------------------------------------");
console.log("💎 DETAILED GEMSTONE VERDICTS:");
console.log("-------------------------------------------------------------------------------");
const allStones = [...rep.recommendedStones, ...rep.conditionalStones, ...rep.prohibitedStones];

for (const s of allStones) {
  console.log(`\n▶ [${s.suitability.toUpperCase()}] ${s.gemstoneHindiName} (${s.planet}) - Score: ${s.score}/100`);
  console.log(`  Reason: ${s.reason}`);
  if (s.detailedAnalysis.dignityVerdict) {
    console.log(`  Dignity: ${s.detailedAnalysis.dignityVerdict}`);
  }
  if (s.detailedAnalysis.combustionOrRetrograde) {
    console.log(`  Asth/Vakri: ${s.detailedAnalysis.combustionOrRetrograde}`);
  }
  if (s.detailedAnalysis.bnnVerdict) {
    console.log(`  BNN: ${s.detailedAnalysis.bnnVerdict}`);
  }
  if (s.detailedAnalysis.moolatrikonaVerdict) {
    console.log(`  Moolatrikona: ${s.detailedAnalysis.moolatrikonaVerdict}`);
  }
  if (s.timing) {
    console.log(`  Timing Dasha: ${s.timing.applicableDasha} | Window: ${s.timing.startDate} to ${s.timing.endDate} | Active: ${s.timing.isActiveNow}`);
    console.log(`  Wearing Window: ${s.timing.wearingWindowHi}`);
    console.log(`  Removal Protocol: ${s.timing.removalInstructionsHi}`);
  }
}

console.log("\n===============================================================================");
console.log("📝 GENERATED MARKDOWN SUMMARY:");
console.log("===============================================================================");
console.log(rep.formattedMarkdown);

console.log("\n===============================================================================");
