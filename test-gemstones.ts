import {
  Observer,
  getKundli,
  getGemstoneRecommendation,
  getComprehensiveReport,
} from "./src/index";

function runGemstoneTests() {
  console.log("===============================================================================");
  console.log("   🌟 TESTING MULTI-CHART GEMSTONE RECOMMENDATION SYSTEM (रत्न विश्लेषण)");
  console.log("===============================================================================\n");

  const observer = new Observer(25.872, 82.685, 0); // Varanasi
  const date = new Date("2004-02-20T07:15:00+05:30");

  const kundli = getKundli(date, observer, {
    houseSystem: "whole_sign",
    includeChalit: true,
    includeKp: true,
  });

  console.log(`Lagna: ${kundli.ascendant.rashiName} (${kundli.ascendant.rashi}) | Lagna Lord: ${kundli.ascendant.rashiLord}`);
  console.log(`Birth Date: ${kundli.birthDetails.date} ${kundli.birthDetails.time}\n`);

  // Test 1: English Gemstone Recommendation with 68 kg body weight
  console.log("-------------------------------------------------------------------------------");
  console.log("TEST 1: English Gemstone Recommendation (User Weight: 68 kg)");
  console.log("-------------------------------------------------------------------------------");
  const reportEn = getGemstoneRecommendation(kundli, {
    lang: "en",
    userWeightKg: 68,
  });

  console.log("\n🟢 RECOMMENDED STONES (Auspicious):");
  reportEn.recommendedStones.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.gemstoneName} (${s.planet}) - Score: ${s.score}/100`);
    console.log(`     Category: ${s.category}`);
    console.log(`     Weight: ${s.specifications?.weightRatti} | ${s.specifications?.weightCarat}`);
    console.log(`     Metal: ${s.specifications?.metal} | Finger: ${s.specifications?.finger}`);
    console.log(`     Beej Mantra: ${s.specifications?.beejMantra}`);
    console.log(`     D1 Note: ${s.detailedAnalysis.d1LagnaVerdict}`);
    console.log(`     Chalit: ${s.detailedAnalysis.chalitVerdict}`);
    console.log(`     KP: ${s.detailedAnalysis.kpVerdict}`);
    console.log(`     Navamsha: ${s.detailedAnalysis.navamshaVerdict}`);
    console.log(`     Uparatna: ${s.specifications?.uparatna.join(", ")}\n`);
  });

  console.log("🟡 CONDITIONAL STONES:");
  reportEn.conditionalStones.forEach((s) => {
    console.log(`  • ${s.gemstoneName} (${s.planet}) - Reason: ${s.reason}`);
    console.log(`    Chalit/KP: ${s.detailedAnalysis.chalitVerdict} | ${s.detailedAnalysis.kpVerdict}`);
  });

  console.log("\n🔴 STRICTLY PROHIBITED STONES ('Never Wear' - 'ये तो बिल्कुल भी नहीं'):");
  reportEn.prohibitedStones.forEach((s) => {
    console.log(`  ❌ ${s.gemstoneName} (${s.planet})`);
    console.log(`     Reason: ${s.reason}`);
    console.log(`     Affliction: ${s.detailedAnalysis.d1LagnaVerdict}`);
    console.log(`     KP/Chalit: ${s.detailedAnalysis.kpVerdict}\n`);
  });

  console.log("⚡ ANTI-CONFLICT WARNINGS (Clashing Gemstones):");
  reportEn.clashingCombinationsWarning.forEach((w) => {
    console.log(`  ${w}`);
  });

  // Test 2: Hindi Gemstone Recommendation
  console.log("\n-------------------------------------------------------------------------------");
  console.log("TEST 2: Hindi Gemstone Recommendation (हिंदी में रत्न रिपोर्ट)");
  console.log("-------------------------------------------------------------------------------");
  const reportHi = getGemstoneRecommendation(kundli, {
    lang: "hi",
    userWeightKg: 75,
  });

  console.log(`\nसारांश: ${reportHi.summary}\n`);
  console.log("🟢 अनुशंसित रत्न (Recommended):");
  reportHi.recommendedStones.forEach((s, idx) => {
    console.log(`  ${idx + 1}. ${s.gemstoneHindiName} (${s.planet}) - शुभता: ${s.score}/100`);
    console.log(`     वजन: ${s.specifications?.weightRatti} (${s.specifications?.weightCarat})`);
    console.log(`     धातु: ${s.specifications?.metal} | उंगली: ${s.specifications?.finger}`);
    console.log(`     मंत्र: ${s.specifications?.beejMantra}`);
  });

  console.log("\n🔴 पूर्णतः वर्जित रत्न (Prohibited):");
  reportHi.prohibitedStones.forEach((s) => {
    console.log(`  ❌ ${s.gemstoneHindiName} (${s.planet}) ➔ ${s.reason}`);
  });

  // Test 3: Integration in getComprehensiveReport
  console.log("\n-------------------------------------------------------------------------------");
  console.log("TEST 3: Comprehensive Report Integration (Vedic Life Prediction Report)");
  console.log("-------------------------------------------------------------------------------");
  const compReport = getComprehensiveReport(kundli, { lang: "hi" });
  console.log(`Has gemstones property: ${compReport.gemstones !== undefined}`);
  console.log(`Gemstones recommended count: ${compReport.gemstones?.recommendedStones.length}`);
  console.log(`Gemstones prohibited count: ${compReport.gemstones?.prohibitedStones.length}`);
  console.log("Contains section 9 in Markdown:", compReport.formattedMarkdown.includes("9. वैदिक रत्न परामर्श"));

  console.log("\n===============================================================================");
  console.log("   ✅ ALL GEMSTONE RECOMMENDATION TESTS COMPLETED SUCCESSFULLY!");
  console.log("===============================================================================");
}

runGemstoneTests();
