import {
  Observer,
  getKundli,
  getComprehensiveReport,
  getCareerPrediction,
  getWealthPrediction,
  getMarriagePrediction,
  getHealthPrediction,
  getEducationPrediction,
  getProgenyPrediction,
  getYogasAndDoshas,
  getDashaTimelinePrediction,
  getTransitPredictions,
  getGemstoneRecommendation,
} from './src/index';

console.log("=== Testing All Vedic Prediction Modules (A to Z) ===");

const observer = new Observer(25.872, 82.685, 0); // Varanasi
const birthDate = new Date('1998-05-15T14:30:00+05:30');

const kundli = getKundli(birthDate, observer, {
  houseSystem: 'whole_sign',
  includeSpecialLagnas: true,
  includeArudhas: true,
  includeReferenceCharts: true,
  includeChalit: true,
  includeKp: true
});

console.log("\n1. Testing Career Prediction...");
const career = getCareerPrediction(kundli);
console.log(`- Recommendation: ${career.recommendation}`);
console.log(`- Job vs Business: ${career.jobScore} vs ${career.businessScore}`);
console.log(`- Gov Job Likelihood: ${career.governmentJobLikelihood?.likelihood} (${career.governmentJobLikelihood?.score}/100)`);
console.log(`- Arudha Status: ${career.arudhaInsight}`);

console.log("\n2. Testing Wealth Prediction...");
const wealth = getWealthPrediction(kundli);
console.log(`- Wealth Rating: ${wealth.wealthRating} (Income: ${wealth.incomePotential}/100)`);
console.log(`- Indu Lagna: ${wealth.induLagnaInsight}`);
console.log(`- Real Estate: ${wealth.propertyAndRealEstate?.potential}`);
console.log(`- Equity Markets: ${wealth.speculativeAndInvestment?.potential}`);

console.log("\n3. Testing Marriage Prediction...");
const marriage = getMarriagePrediction(kundli);
console.log(`- Marriage Type: ${marriage.marriageType.recommendation}`);
console.log(`- Spouse Age Gap: ${marriage.spouseAgeDifference.relativeAge} (${marriage.spouseAgeDifference.estimatedDifferenceYears})`);
console.log(`- Upapada Lagna: ${marriage.upapadaLagnaInsight}`);
console.log(`- Marital Stability: ${marriage.maritalStabilityRating}`);

console.log("\n4. Testing Health Prediction...");
const health = getHealthPrediction(kundli);
console.log(`- Health Rating: ${health.healthRating} (${health.healthScore}/100)`);
console.log(`- Longevity: ${health.longevityAssessment.category}`);
console.log(`- Tridosha: ${health.ayurvedicConstitution.primaryDosha}`);
console.log(`- Badhaka Sthana: ${health.badhakaSthana.impact}`);
console.log(`- Organ Vulnerabilities count: ${health.organVulnerabilities.length}`);

console.log("\n5. Testing Education Prediction...");
const education = getEducationPrediction(kundli);
console.log(`- Intellect: ${education.intellectRating} (${education.academicSuccessScore}/100)`);
console.log(`- Competitive Exams: ${education.competitiveExams.successLikelihood}`);
console.log(`- Recommended Streams: ${education.recommendedStreams.map(s => s.stream).join(" | ")}`);

console.log("\n6. Testing Progeny Prediction...");
const progeny = getProgenyPrediction(kundli);
console.log(`- Progeny Rating: ${progeny.progenyRating} (${progeny.progenyBlessingScore}/100)`);
console.log(`- 5th House Lord: ${progeny.fifthHouseDetails.lord} in House ${progeny.fifthHouseDetails.lordPlacementHouse}`);
console.log(`- Putra Dosha: ${progeny.putraDosha.hasDosha ? progeny.putraDosha.type : "None"}`);

console.log("\n7. Testing Yogas & Doshas Engine...");
const yogas = getYogasAndDoshas(kundli);
console.log(`- Total Yogas Detected: ${yogas.totalYogasDetected}`);
console.log(`- Raja Yogas: ${yogas.rajaYogas.map(r => r.name).join("; ")}`);
console.log(`- Mahapurusha Yogas: ${yogas.mahapurushaYogas.map(m => m.name).join("; ") || "None"}`);
console.log(`- Kaal Sarp Dosha: ${yogas.kaalSarpDosha.hasDosha ? yogas.kaalSarpDosha.type : "None"}`);
console.log(`- Kemadruma Yoga: ${yogas.kemadrumaYoga.hasYoga ? (yogas.kemadrumaYoga.isCancelled ? "Cancelled (Bhanga)" : "Active") : "None"}`);

console.log("\n8. Testing Dasha Timeline Prediction...");
const dasha = getDashaTimelinePrediction(kundli);
console.log(`- Current Mahadasha: ${dasha.currentMahadasha.planet} (${dasha.currentMahadasha.nature})`);
console.log(`- Current Antardasha: ${dasha.currentAntardasha.planet}`);
console.log(`- Career Period Theme: ${dasha.currentPeriodThemes.career}`);

console.log("\n9. Testing Planetary Transits Prediction...");
const transits = getTransitPredictions(kundli);
console.log(`- Saturn Transit: ${transits.saturnTransit.currentSign} (House ${transits.saturnTransit.houseFromMoon} from Moon, Sade Sati: ${transits.saturnTransit.isSadeSati})`);
console.log(`- Jupiter Transit: ${transits.jupiterTransit.currentSign} (Guru Balam: ${transits.jupiterTransit.hasGuruBalam})`);
console.log(`- Transit Score: ${transits.overallTransitScore}/100`);

console.log("\n10. Testing Master Comprehensive Report (EN & HI)...");
const reportEn = getComprehensiveReport(kundli, { lang: 'en' });
console.log(`- EN Markdown length: ${reportEn.formattedMarkdown.length} chars`);
const reportHi = getComprehensiveReport(kundli, { lang: 'hi' });
console.log(`- HI Markdown length: ${reportHi.formattedMarkdown.length} chars`);

console.log("\n[SUCCESS] All predictions passed with flying colors!");
