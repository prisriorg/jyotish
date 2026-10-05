import { Kundli } from "../kundli/types";
import { getCareerPrediction } from "./career";
import { getWealthPrediction } from "./wealth";
import { getMarriagePrediction } from "./marriage";
import { getHealthPrediction } from "./health";
import { getEducationPrediction } from "./education";
import { getProgenyPrediction } from "./progeny";
import { getYogasAndDoshas } from "./yogas";
import { getDashaTimelinePrediction } from "./dasha_timeline";
import { getTransitPredictions } from "./transits";
import { getRemedies } from "./remedies";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";
import { getGemstoneRecommendation } from "./gemstones";
import { getGrowthPrediction } from "./growth";
import { ComprehensiveReport, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";
import { rashiNames } from "../core/constants";

export * from "./types";
export * from "./career";
export * from "./wealth";
export * from "./marriage";
export * from "./health";
export * from "./education";
export * from "./progeny";
export * from "./yogas";
export * from "./dasha_timeline";
export * from "./transits";
export * from "./remedies";
export * from "./multisystem";
export * from "./jaimini";
export * from "./gemstones";
export * from "./growth";

/**
 * Generates an exhaustive A-to-Z Vedic life prediction report synthesizing:
 * 1. Career & Professional Trajectory (D1, D10, AmK, Karakamsha, A10)
 * 2. Wealth & Indu Lagna (BPHS Kalas, Dhana Yogas, Real Estate, Equity)
 * 3. Love, Marriage & Relationships (Upapada Lagna, D9, Dara Pada, Timing)
 * 4. Health, Longevity & Medical Astrology (Badhaka, Maraka, Tridosha, Organ mapping)
 * 5. Education & Intellect (Academic streams, Competitive exams, Foreign study)
 * 6. Children & Progeny (Santana Bhava, D7, Putradosha, Timing)
 * 7. Classical Yogas & Doshas (Raja, Mahapurusha, Gaja Kesari, Kaal Sarp 12 types, Kemadruma)
 * 8. Vimshottari Dasha Timeline (Current Mahadasha/Antardasha predictions & milestones)
 * 9. Gochara Planetary Transits (Saturn Sade Sati, Jupiter Guru Balam, Rahu-Ketu axis)
 * 10. Multi-Chart Vedic Gemstones
 * 11. Bhava Chalit & KP Cuspal Systems
 * 12. Authentic Lal Kitab & Vedic Remedies
 *
 * @param kundli Complete Janam Kundli object
 * @param options Optional prediction options (e.g. { lang: 'hi' })
 * @returns ComprehensiveReport containing structured sub-predictions and formatted Markdown
 */
export function getComprehensiveReport(kundli: Kundli, options?: PredictionOptions): ComprehensiveReport {
  const lang: Language = options?.lang || 'en';

  const career = getCareerPrediction(kundli, { lang });
  const wealth = getWealthPrediction(kundli, { lang });
  const marriage = getMarriagePrediction(kundli, { ...options, lang });
  const health = getHealthPrediction(kundli, { lang });
  const education = getEducationPrediction(kundli, { lang });
  const progeny = getProgenyPrediction(kundli, { lang });
  const yogas = getYogasAndDoshas(kundli, { lang });
  const dashaTimeline = getDashaTimelinePrediction(kundli, { ...options, lang });
  const transits = getTransitPredictions(kundli, { ...options, lang });
  const remedies = getRemedies(kundli, { lang });
  const chalitAnalysis = getChalitAnalysis(kundli, { lang });
  const kpAnalysis = getKpAnalysis(kundli, { lang });
  const lalKitabAnalysis = getLalKitabAnalysis(kundli, { lang });
  const jaiminiKarakas = getJaiminiKarakas(kundli, { lang });
  const gemstones = getGemstoneRecommendation(kundli, { lang });
  const growth = getGrowthPrediction(kundli, { ...options, lang });

  const lagnaRashiIdx = kundli.ascendant ? kundli.ascendant.rashi - 1 : 10;
  const moonRashiIdx = kundli.planets?.Moon ? (kundli.planets.Moon.rashi ? kundli.planets.Moon.rashi - 1 : rashiNames.indexOf(kundli.planets.Moon.rashiName || "")) : 0;
  const sunRashiIdx = kundli.planets?.Sun ? (kundli.planets.Sun.rashi ? kundli.planets.Sun.rashi - 1 : rashiNames.indexOf(kundli.planets.Sun.rashiName || "")) : 0;

  const lagnaName = getLocalizedRashi(lagnaRashiIdx, lang);
  const moonSign = getLocalizedRashi(moonRashiIdx, lang);
  const sunSign = getLocalizedRashi(sunRashiIdx, lang);

  const summary = lang === 'hi'
    ? `${lagnaName} लग्न और ${moonSign} चंद्र राशि युक्त संपूर्ण वैदिक जन्म कुंडली। ` +
      `करियर: ${career.recommendation} (व्यवसाय: ${career.businessScore}/100, नौकरी: ${career.jobScore}/100)। ` +
      `धन क्षमता: ${wealth.wealthRating} (इंदु लग्न: ${wealth.induLagnaDetails?.rashi || ""} में)। ` +
      `स्वास्थ्य: ${health.healthRating} (${health.longevityAssessment.category})। ` +
      `शिक्षा: ${education.intellectRating} (${education.academicSuccessScore}/100)। ` +
      `दांपत्य: अनुकूल आयु वर्ग ${marriage.favorableAgeRange} (${marriage.maritalHarmonyRating})। ` +
      `सक्रिय योग: ${yogas.totalYogasDetected} शुभ योग (गजकेसरी, बुधादित्य आदि)। ` +
      `वर्तमान दशा: ${dashaTimeline.currentMahadasha.planet}-${dashaTimeline.currentAntardasha.planet}। ` +
      `गोचर: ${transits.summary}`
    : `Complete Vedic horoscope featuring ${lagnaName} Ascendant and ${moonSign} Moon sign. ` +
      `Career trajectory indicates ${career.recommendation.toLowerCase()} (Business: ${career.businessScore}/100, Job: ${career.jobScore}/100). ` +
      `Wealth potential is rated as ${wealth.wealthRating} (Indu Lagna in ${wealth.induLagnaDetails?.rashi || ""}). ` +
      `Health vitality is ${health.healthRating} (${health.longevityAssessment.category}). ` +
      `Academic intellect: ${education.intellectRating} (${education.academicSuccessScore}/100). ` +
      `Marriage alignment favors ages ${marriage.favorableAgeRange} (${marriage.maritalHarmonyRating}). ` +
      `Active Yogas: ${yogas.totalYogasDetected} classical Raja/Dhana Yogas. ` +
      `Current Dasha: ${dashaTimeline.currentMahadasha.planet}-${dashaTimeline.currentAntardasha.planet}. ` +
      `Gochara Transits: ${transits.summary}`;

  // Format Markdown report
  let md = "";
  if (lang === 'hi') {
    md = `# 🌟 महा-वैदिक संपूर्ण जीवन भविष्यवाणी एवं मार्गदर्शन रिपोर्ट (A to Z)\n\n`;
    md += `**लग्न (Ascendant):** ${lagnaName} | **चंद्र राशि:** ${moonSign} | **सूर्य राशि:** ${sunSign}\n`;
    md += `**एकीकृत शास्त्रीय पद्धतियां:** महर्षि पाराशर (D1/D9/D10/D7) • इंदु लग्न • श्रीपति भाव चलित • केपी ज्योतिष (कृष्णमूर्ति पद्धति) • लाल किताब • जैमिनी चर कारक एवं उपपद लग्न\n\n`;
    md += `> ${summary}\n\n`;

    // 1. Career
    md += `## 💼 1. आजीविका, करियर एवं व्यावसायिक दिशा\n\n`;
    md += `- **मुख्य अनुशंसा:** **${career.recommendation}**\n`;
    md += `- **करियर संरेखण स्कोर:** व्यवसाय / उद्यम: **${career.businessScore}/100** | नौकरी / सर्विस: **${career.jobScore}/100**\n`;
    md += `- **प्रशासनिक व नेतृत्व स्तर:** ${career.leadershipCapacity}\n`;
    md += `- **कर्म भाव (दशम भाव - D1):** ${career.tenthHouseDetails.rashi} (स्वामी: ${career.tenthHouseDetails.rashiLord}, भाव ${career.tenthHouseDetails.lordPlacementHouse} में), अष्टकवर्ग: ${career.tenthHouseDetails.savBindus} बिंदु\n`;
    if (career.governmentJobLikelihood) md += `- **सरकारी सेवा / प्रशासनिक प्राधिकार:** **${career.governmentJobLikelihood.likelihood}** (${career.governmentJobLikelihood.score}/100) — *${career.governmentJobLikelihood.description}*\n`;
    if (career.tenthLordPlacementResult) md += `- **दशमेश स्थिति फल:** ${career.tenthLordPlacementResult}\n`;
    if (career.amatyakarakaInsight) md += `- **जैमिनी अमात्यकारक (AmK):** ${career.amatyakarakaInsight}\n`;
    if (career.karakamshaInsight) md += `- **कारकांश लग्न:** ${career.karakamshaInsight}\n`;
    if (career.d10Insight) md += `- **दशांश (D10):** ${career.d10Insight}\n`;
    if (career.arudhaInsight) md += `- **आरूढ़ प्रतिष्ठा:** ${career.arudhaInsight}\n`;
    if (career.panchaMahapurushaYoga) md += `- **सक्रिय महापुरुष योग:** 👑 ${career.panchaMahapurushaYoga}\n`;
    if (career.kpInsight) md += `- **केपी उप-स्वामी निर्णय:** ${career.kpInsight}\n\n`;

    md += `### अनुशंसित उच्च-विकास कार्यक्षेत्र:\n`;
    career.suitableFields.forEach((field) => {
      md += `- ${field}\n`;
    });
    md += `\n### रणनीतिक करियर सलाह:\n`;
    career.strategicAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // 2. Wealth
    md += `\n## 💰 2. धन संपदा, इंदु लग्न एवं आर्थिक समृद्धि\n\n`;
    md += `- **धन स्तर:** **${wealth.wealthRating}** (आय क्षमता: ${wealth.incomePotential}/100)\n`;
    md += `- **बचत एवं संचय क्षमता:** ${wealth.savingCapacity}\n`;
    md += `- **अष्टकवर्ग आय बनाम व्यय:** एकादश भाव: **${wealth.savMetrics.incomeHouse11Bindus}** बिंदु बनाम द्वादश भाव: **${wealth.savMetrics.expenditureHouse12Bindus}** बिंदु (शुद्ध बचत: +${wealth.savMetrics.surplusRatio})\n`;
    if (wealth.induLagnaInsight) md += `- **इंदु लग्न (धन लग्न):** 🪙 ${wealth.induLagnaInsight}\n`;
    if (wealth.propertyAndRealEstate) md += `- **भूमि व अचल संपत्ति:** 🏡 ${wealth.propertyAndRealEstate.description}\n`;
    if (wealth.speculativeAndInvestment) md += `- **शेयर बाजार व निवेश:** 📈 ${wealth.speculativeAndInvestment.description}\n`;
    if (wealth.secondLordPlacementResult) md += `- **द्वितीयेश स्थिति:** ${wealth.secondLordPlacementResult}\n`;
    if (wealth.eleventhLordPlacementResult) md += `- **एकादशेश स्थिति:** ${wealth.eleventhLordPlacementResult}\n`;
    if (wealth.arudhaWealthInsight) md += `- **धन आरूढ़:** ${wealth.arudhaWealthInsight}\n\n`;

    if (wealth.dhanaYogas.length > 0) {
      md += `### सक्रिय धन योग:\n`;
      wealth.dhanaYogas.forEach((yoga) => {
        md += `- **${yoga.name}** (${yoga.strength}): ${yoga.description}\n`;
      });
      md += `\n`;
    }

    // 3. Marriage
    md += `\n## 💍 3. विवाह, संबंध, उपपद लग्न एवं अनुकूल समय\n\n`;
    md += `- **विवाह स्वरूप अनुशंसा:** **${marriage.marriageType.recommendation}** (प्रेम: ${marriage.marriageType.loveScore}/100 | पारंपरिक: ${marriage.marriageType.arrangedScore}/100)\n`;
    md += `- **जीवनसाथी आयु अंतर:** **${marriage.spouseAgeDifference.relativeAge}** (${marriage.spouseAgeDifference.estimatedDifferenceYears}) | परिपक्वता: ${marriage.spouseAgeDifference.maturityLevel}\n`;
    md += `- **दांपत्य सामंजस्य स्थिति:** **${marriage.maritalHarmonyRating}** (${marriage.maritalStabilityRating || ""})\n`;
    md += `- **अनुकूल आयु वर्ग:** ${marriage.favorableAgeRange}\n`;
    md += `- **ज्योतिषीय समर्थित विवाह वर्ष:** ${(marriage.predictedTimingYears.join(", ") || marriage.favorableAgeRange)}\n`;
    md += `- **दशा सहयोग:** ${marriage.dashaSupportExplanation}\n`;
    md += `- **मांगलिक दोष विश्लेषण:** ${marriage.mangalDosha.description}\n`;
    if (marriage.upapadaLagnaInsight) md += `- **जैमिनी उपपद लग्न (UL):** ${marriage.upapadaLagnaInsight}\n`;
    if (marriage.navamshaSpouseInsight) md += `- **नवमांश (D9):** ${marriage.navamshaSpouseInsight}\n`;
    if (marriage.seventhLordPlacementResult) md += `- **सप्तमेश शास्त्रीय फल:** ${marriage.seventhLordPlacementResult}\n`;
    if (marriage.darakarakaInsight) md += `- **जैमिनी दाराकारक (DK):** ${marriage.darakarakaInsight}\n`;
    if (marriage.vivahaVilambaFactors?.hasDelay) {
      md += `- **विवाह विलंब कारक:** ⏳ ${marriage.vivahaVilambaFactors.causes.join(" ")} *(उपाय: ${marriage.vivahaVilambaFactors.mitigation})*\n`;
    }
    if (marriage.upapadaLagnaDetails) {
      md += `- **उपपद से द्वितीय भाव (वैवाहिक स्थायित्व):** ${marriage.upapadaLagnaDetails.sustenanceVerdict}\n`;
    }
    if (marriage.spouseCareerAndBackground) {
      md += `- **जीवनसाथी की संभावित आजीविका:** ${marriage.spouseCareerAndBackground.probableProfessions.join(", ")} (${marriage.spouseCareerAndBackground.financialStatus})\n`;
    }
    md += `\n`;

    md += `### जीवनसाथी के स्वाभाविक गुण:\n`;
    md += `- **सामान्य स्वभाव:** ${marriage.partnerCharacteristics.nature}\n`;
    md += `- **प्रमुख विशेषताएं:** ${marriage.partnerCharacteristics.dominantTraits.join(", ")}\n\n`;

    // 4. Health
    md += `\n## 🩺 4. स्वास्थ्य, दीर्घायु एवं त्रिदोष विश्लेषण\n\n`;
    md += `- **स्वास्थ्य स्तर:** **${health.healthRating}** (सूचकांक: ${health.healthScore}/100)\n`;
    md += `- **आयुर्दाय (दीर्घायु):** **${health.longevityAssessment.category}** — *${health.longevityAssessment.description}*\n`;
    md += `- **आयुर्वेदिक त्रिदोष प्रकृति:** **${health.ayurvedicConstitution.primaryDosha}** — *${health.ayurvedicConstitution.explanation}*\n`;
    md += `- **बाधक भाव एवं स्वामी:** ${health.badhakaSthana.impact}\n`;
    md += `- **मारक ग्रह प्रभाव:** ${health.marakaPlanets.explanation}\n\n`;

    if (health.organVulnerabilities.length > 0) {
      md += `### शारीरिक संवेदनशीलता एवं मेडिकल ज्योतिष:\n`;
      health.organVulnerabilities.forEach((ov) => {
        md += `- **${ov.organOrSystem} (${ov.rulingPlanetOrHouse} - ${ov.severity}):** ${ov.guidance}\n`;
      });
      md += `\n`;
    }

    md += `### स्वास्थ्य संरक्षण एवं खानपान मार्गदर्शन:\n`;
    health.ayurvedicConstitution.dietLifestyleRecommendations.forEach((rec) => {
      md += `- 🥗 ${rec}\n`;
    });

    // 5. Education
    md += `\n## 🎓 5. विद्या, बुद्धि एवं उच्च शिक्षा (Education)\n\n`;
    md += `- **बौद्धिक स्तर:** **${education.intellectRating}** (शैक्षणिक सफलता: ${education.academicSuccessScore}/100)\n`;
    md += `- **अध्ययन शैली:** ${education.learningStyle}\n`;
    md += `- **प्रतियोगी परीक्षा (UPSC/JEE/GRE/Banking):** **${education.competitiveExams.successLikelihood}** — *${education.competitiveExams.advice}*\n`;
    md += `- **विदेशी उच्च शिक्षा संभावना:** ${education.higherEducationAndResearch.description}\n`;
    md += `- **बुध व गुरु प्रभाव:** ${education.mercuryJupiterSignificance.mercuryImpact} ${education.mercuryJupiterSignificance.jupiterImpact}\n\n`;

    md += `### अनुशंसित शैक्षणिक संकाय (Recommended Streams):\n`;
    education.recommendedStreams.forEach((st) => {
      md += `- **${st.stream} (${st.suitability}):** ${st.astrologicalReason}\n`;
    });

    // 6. Progeny
    md += `\n## 👶 6. संतान सुख एवं संतति भाव (Progeny)\n\n`;
    md += `- **संतान सुख स्तर:** **${progeny.progenyRating}** (अनुकूलता: ${progeny.progenyBlessingScore}/100)\n`;
    md += `- **पंचम भाव स्थिति:** ${progeny.fifthHouseDetails.rashi} (स्वामी: ${progeny.fifthHouseDetails.lord}, भाव ${progeny.fifthHouseDetails.lordPlacementHouse} में), अष्टकवर्ग: ${progeny.fifthHouseDetails.savBindus} बिंदु\n`;
    md += `- **गुरु (संतान कारक) स्थिति:** ${progeny.jupiterStrengthVerdict}\n`;
    if (progeny.putraDosha.hasDosha) {
      md += `- **संतान दोष / विलंब कारक:** ⚠️ **${progeny.putraDosha.type}**: ${progeny.putraDosha.description}\n`;
    }
    if (progeny.saptamshaD7Insight) md += `- **सप्तमांश (D7) चक्र:** ${progeny.saptamshaD7Insight}\n\n`;

    md += `### संतान के स्वभाव एवं गुण:\n`;
    progeny.childrenTraits.forEach((ct) => {
      md += `- ${ct}\n`;
    });

    // 7. Yogas & Doshas
    md += `\n## 👑 7. शास्त्रीय राजयोग एवं ग्रह दोष विश्लेषण\n\n`;
    md += `> **योग सारांश:** ${yogas.summaryVerdict}\n\n`;

    if (yogas.rajaYogas.length > 0) {
      md += `### सक्रिय राजयोग:\n`;
      yogas.rajaYogas.forEach((ry) => {
        md += `- **${ry.name}** (${ry.strength}): ${ry.description}\n`;
      });
      md += `\n`;
    }

    if (yogas.specialAuspiciousYogas.length > 0) {
      md += `### प्रमुख शुभ योग:\n`;
      yogas.specialAuspiciousYogas.forEach((sy) => {
        md += `- **${sy.name}**: ${sy.description}\n`;
      });
      md += `\n`;
    }

    if (yogas.vipreetRajYogas.length > 0) {
      md += `### विपरीत राजयोग (संकट में अभय):\n`;
      yogas.vipreetRajYogas.forEach((vry) => {
        md += `- 🛡️ **${vry.name}**: ${vry.description}\n`;
      });
      md += `\n`;
    }

    md += `### ग्रह दोष एवं शांति:\n`;
    md += `- **कालसर्प दोष:** ${yogas.kaalSarpDosha.description}\n`;
    md += `- **केमद्रुम योग:** ${yogas.kemadrumaYoga.description}\n`;
    if (yogas.inauspiciousDoshas.length > 0) {
      yogas.inauspiciousDoshas.forEach((d) => {
        md += `- **${d.name} (${d.severity}):** ${d.description} *(उपाय: ${d.remedy})*\n`;
      });
    }

    // 8. Growth Trajectory
    md += `\n## 🚀 8. सर्वांगीण करियर, व्यवसाय एवं वित्तीय विकास (Life & Growth Trajectory)\n\n`;
    md += `- **विकास प्रक्षेपवक्र एवं गति:** **${growth.overallGrowthVelocity}** (समग्र विकास सूचकांक: **${growth.growthScore}/100**)\n`;
    md += `- **आयामी विकास स्कोर:** करियर: **${growth.careerGrowthScore}/100** | वित्तीय संचय: **${growth.financialGrowthScore}/100** | उद्यमशीलता: **${growth.entrepreneurialGrowthScore}/100**\n`;
    md += `- **विकास स्वरूप (Archetype):** **${growth.growthArchetype.title}** — *${growth.growthArchetype.description}*\n`;
    if (growth.d10DashamshaGrowthInsight) md += `- **दशांश (D10):** ${growth.d10DashamshaGrowthInsight}\n`;
    if (growth.amatyakarakaGrowthInsight) md += `- **अमात्यकारक:** ${growth.amatyakarakaGrowthInsight}\n`;
    if (growth.induLagnaWealthGrowthInsight) md += `- **धन अधिशेष:** ${growth.induLagnaWealthGrowthInsight}\n\n`;

    if (growth.keyGrowthDrivers.length > 0) {
      md += `### मुख्य विकास चालक (Key Growth Drivers):\n`;
      growth.keyGrowthDrivers.forEach((dr) => {
        md += `- **${dr.driver}:** ${dr.impact}\n`;
      });
      md += `\n`;
    }

    if (growth.growthBlockersAndFriction.length > 0) {
      md += `### विकास अवरोधक एवं समाधान:\n`;
      growth.growthBlockersAndFriction.forEach((b) => {
        md += `- ⚠️ **${b.challenge}:** *${b.mitigationStrategy}*\n`;
      });
      md += `\n`;
    }

    md += `### आयु अनुसार जीवन विकास रोडमैप (Life Growth Roadmap):\n`;
    growth.lifeGrowthRoadmap.forEach((rm) => {
      md += `- **आयु ${rm.ageSpan} वर्ष (${rm.phaseName}):** ${rm.focusArea} — *कार्रवाई: ${rm.growthAction}*\n`;
    });
    md += `\n`;

    if (growth.upcomingPeakGrowthPeriods.length > 0) {
      md += `### आगामी शीर्ष विकास काल (Peak Growth Periods):\n`;
      growth.upcomingPeakGrowthPeriods.forEach((pg) => {
        md += `- **${pg.periodSpan} (${pg.dashaPlanets}):** ${pg.growthTheme}\n`;
      });
      md += `\n`;
    }

    // 8. Dasha Timeline
    md += `\n## ⏳ 8. विंशोत्तरी दशा समय-चक्र एवं जीवन पड़ाव\n\n`;
    md += `- **वर्तमान महादशा:** **${dashaTimeline.currentMahadasha.planet}** (${dashaTimeline.currentMahadasha.startDate} से ${dashaTimeline.currentMahadasha.endDate}) — *${dashaTimeline.currentMahadasha.prediction}*\n`;
    md += `- **वर्तमान अंतर्दशा:** **${dashaTimeline.currentAntardasha.planet}** (${dashaTimeline.currentAntardasha.startDate} से ${dashaTimeline.currentAntardasha.endDate}) — *${dashaTimeline.currentAntardasha.prediction}*\n\n`;

    md += `### वर्तमान दशा विषयक प्रभाव:\n`;
    md += `- **करियर:** ${dashaTimeline.currentPeriodThemes.career}\n`;
    md += `- **धन:** ${dashaTimeline.currentPeriodThemes.wealth}\n`;
    md += `- **पारिवारिक संबंध:** ${dashaTimeline.currentPeriodThemes.relationships}\n`;
    md += `- **स्वास्थ्य:** ${dashaTimeline.currentPeriodThemes.health}\n\n`;

    md += `### जीवन के महत्वपूर्ण मील के पत्थर (Milestone Ages):\n`;
    dashaTimeline.criticalMilestoneAges.forEach((m) => {
      md += `- **आयु ${m.age} वर्ष (${m.astrologicalCycle}):** ${m.significance}\n`;
    });

    // 9. Transits (Gochara)
    md += `\n## 🪐 9. वर्तमान ग्रह गोचर एवं साढ़ेसाती स्थिति\n\n`;
    md += `- **शनि गोचर / साढ़ेसाती:** **${transits.saturnTransit.currentSign}** में (चंद्र से ${transits.saturnTransit.houseFromMoon}वां भाव) — *${transits.saturnTransit.prediction}*\n`;
    if (transits.saturnTransit.remedy) md += `  - *शनि उपाय:* ${transits.saturnTransit.remedy}\n`;
    md += `- **बृहस्पति गोचर (गुरु बल):** **${transits.jupiterTransit.currentSign}** में (चंद्र से ${transits.jupiterTransit.houseFromMoon}वां भाव) — *${transits.jupiterTransit.blessings}*\n`;
    md += `- **राहु-केतु अक्ष:** ${transits.rahuKetuTransit.prediction}\n`;
    md += `- **समग्र गोचर सूचकांक:** **${transits.overallTransitScore}/100**\n`;

    // 10. Gemstones
    md += `\n## 💎 10. वैदिक रत्न परामर्श (त्रि-स्तरीय बहु-चक्र सत्यापित)\n\n`;
    const primaryRec = gemstones.recommendedStones.map(s => s.gemstoneHindiName).join(", ");
    const prohibitedStr = gemstones.prohibitedStones.slice(0, 3).map(s => s.gemstoneHindiName).join(", ");
    md += `- **अत्यधिक शुभ व धारण योग्य:** **${primaryRec || "कोई विशिष्ट नहीं"}**\n`;
    md += `- **पूर्णतः वर्जित (भूलकर भी न पहनें):** ❌ ${prohibitedStr || "कोई नहीं"}\n\n`;
    if (gemstones.recommendedStones.length > 0) {
      md += `### मुख्य अनुशंसित रत्न विवरण:\n`;
      gemstones.recommendedStones.forEach((s) => {
        md += `- **${s.gemstoneHindiName} (${getLocalizedPlanet(s.planet, lang)}):** ${s.specifications?.weightRatti || ""} | धातु: ${s.specifications?.metal || ""} | उंगली: ${s.specifications?.finger || ""} | मंत्र: \`${s.specifications?.beejMantra || ""}\`\n`;
      });
      md += `\n`;
    }

    // 11. Remedies
    md += `\n## 🛠️ 11. व्यावहारिक, वैदिक एवं लाल किताब उपाय\n\n`;
    if (remedies.practicalDoAndDonts.length > 0) {
      md += `### क्या करें और क्या न करें:\n`;
      remedies.practicalDoAndDonts[0].dos.forEach((d) => {
        md += `- ✅ **करें:** ${d}\n`;
      });
      remedies.practicalDoAndDonts[0].donts.forEach((d) => {
        md += `- ❌ **न करें:** ${d}\n`;
      });
    }

    if (remedies.mantras.length > 0) {
      md += `\n### दैनिक शांति मंत्र:\n`;
      remedies.mantras.forEach((m) => {
        md += `- **${m.deity}:** \`${m.mantra}\` (${m.count}) — *${m.benefit}*\n`;
      });
    }

  } else {
    // English Report
    md = `# 🌟 Grand All-Inclusive Vedic Life Horoscope & Destiny Report (A to Z)\n\n`;
    md += `**Ascendant (Lagna):** ${lagnaName} | **Moon Sign:** ${moonSign} | **Sun Sign:** ${sunSign}\n`;
    md += `**Integrated Shastric Systems:** Maharishi Parashara (D1/D9/D10/D7) • Indu Lagna (BPHS) • Sripati Bhava Chalit • KP Astrology (Krishnamurti Paddhati) • Lal Kitab Teva • Jaimini Chara Karakas & Upapada Lagna\n\n`;
    md += `> ${summary}\n\n`;

    // 1. Career
    md += `## 💼 1. Career & Professional Trajectory\n\n`;
    md += `- **Primary Recommendation:** **${career.recommendation}**\n`;
    md += `- **Career Alignment Score:** Business / Enterprise: **${career.businessScore}/100** | Employment / Corporate: **${career.jobScore}/100**\n`;
    md += `- **Executive & Leadership Level:** ${career.leadershipCapacity}\n`;
    md += `- **10th House of Karma (D1):** ${career.tenthHouseDetails.rashi} (Lord: ${career.tenthHouseDetails.rashiLord} in House ${career.tenthHouseDetails.lordPlacementHouse}) with ${career.tenthHouseDetails.savBindus} SAV bindus\n`;
    if (career.governmentJobLikelihood) md += `- **Civil Services / Executive Governance Likelihood:** **${career.governmentJobLikelihood.likelihood}** (${career.governmentJobLikelihood.score}/100) — *${career.governmentJobLikelihood.description}*\n`;
    if (career.tenthLordPlacementResult) md += `- **10th Lord Placement Shastra Verdict:** ${career.tenthLordPlacementResult}\n`;
    if (career.amatyakarakaInsight) md += `- **Jaimini Amatyakaraka (AmK):** ${career.amatyakarakaInsight}\n`;
    if (career.karakamshaInsight) md += `- **Karakamsha Lagna:** ${career.karakamshaInsight}\n`;
    if (career.d10Insight) md += `- **Dashamsha (D10):** ${career.d10Insight}\n`;
    if (career.arudhaInsight) md += `- **Arudha Status:** ${career.arudhaInsight}\n`;
    if (career.panchaMahapurushaYoga) md += `- **Mahapurusha Yoga Active:** 👑 ${career.panchaMahapurushaYoga}\n`;
    if (career.kpInsight) md += `- **KP Sub-Lord Ruling:** ${career.kpInsight}\n\n`;

    md += `### Recommended High-Growth Sectors:\n`;
    career.suitableFields.forEach((field) => {
      md += `- ${field}\n`;
    });
    md += `\n### Strategic Career Guidance:\n`;
    career.strategicAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // 2. Wealth
    md += `\n## 💰 2. Wealth Potential, Indu Lagna & Financial Fortunes\n\n`;
    md += `- **Wealth Rating:** **${wealth.wealthRating}** (Income Potential: ${wealth.incomePotential}/100)\n`;
    md += `- **Saving Capacity:** ${wealth.savingCapacity}\n`;
    md += `- **Ashtakavarga Inflow vs Outflow:** House 11 (Gains): **${wealth.savMetrics.incomeHouse11Bindus}** bindus vs House 12 (Expenses): **${wealth.savMetrics.expenditureHouse12Bindus}** bindus (Net Surplus: +${wealth.savMetrics.surplusRatio})\n`;
    if (wealth.induLagnaInsight) md += `- **BPHS Indu Lagna (Wealth Ascendant):** 🪙 ${wealth.induLagnaInsight}\n`;
    if (wealth.propertyAndRealEstate) md += `- **Real Estate & Land Holdings:** 🏡 ${wealth.propertyAndRealEstate.description}\n`;
    if (wealth.speculativeAndInvestment) md += `- **Equity Markets & Venture Capital:** 📈 ${wealth.speculativeAndInvestment.description}\n`;
    if (wealth.secondLordPlacementResult) md += `- **2nd Lord (Dhana) Verdict:** ${wealth.secondLordPlacementResult}\n`;
    if (wealth.eleventhLordPlacementResult) md += `- **11th Lord (Labha) Verdict:** ${wealth.eleventhLordPlacementResult}\n`;
    if (wealth.arudhaWealthInsight) md += `- **Arudha Wealth Padas:** ${wealth.arudhaWealthInsight}\n\n`;

    if (wealth.dhanaYogas.length > 0) {
      md += `### Active Dhana Yogas:\n`;
      wealth.dhanaYogas.forEach((yoga) => {
        md += `- **${yoga.name}** (${yoga.strength}): ${yoga.description}\n`;
      });
      md += `\n`;
    }

    // 3. Marriage
    md += `\n## 💍 3. Marriage, Relationships & Upapada Lagna\n\n`;
    md += `- **Marriage Type Recommendation:** **${marriage.marriageType.recommendation}** (Love: ${marriage.marriageType.loveScore}/100 | Arranged: ${marriage.marriageType.arrangedScore}/100)\n`;
    md += `- **Spouse Age Difference:** **${marriage.spouseAgeDifference.relativeAge}** (${marriage.spouseAgeDifference.estimatedDifferenceYears}) | Demeanor: ${marriage.spouseAgeDifference.maturityLevel}\n`;
    md += `- **Marital Harmony Status:** **${marriage.maritalHarmonyRating}** (${marriage.maritalStabilityRating || ""})\n`;
    md += `- **Optimal Age Window:** ${marriage.favorableAgeRange}\n`;
    md += `- **Astrologically Supported Timing Years:** ${(marriage.predictedTimingYears.join(", ") || marriage.favorableAgeRange)}\n`;
    md += `- **Dasha Support:** ${marriage.dashaSupportExplanation}\n`;
    md += `- **Mangal Dosha Analysis:** ${marriage.mangalDosha.description}\n`;
    if (marriage.upapadaLagnaInsight) md += `- **Jaimini Upapada Lagna (UL):** ${marriage.upapadaLagnaInsight}\n`;
    if (marriage.navamshaSpouseInsight) md += `- **Navamsha (D9):** ${marriage.navamshaSpouseInsight}\n`;
    if (marriage.seventhLordPlacementResult) md += `- **7th Lord Shastra Verdict:** ${marriage.seventhLordPlacementResult}\n`;
    if (marriage.darakarakaInsight) md += `- **Jaimini Darakaraka (DK):** ${marriage.darakarakaInsight}\n`;
    if (marriage.vivahaVilambaFactors?.hasDelay) {
      md += `- **Marriage Delay Factors Analysis:** ⏳ ${marriage.vivahaVilambaFactors.causes.join(" ")} *(Mitigation: ${marriage.vivahaVilambaFactors.mitigation})*\n`;
    }
    if (marriage.upapadaLagnaDetails) {
      md += `- **2nd from Upapada (Longevity Anchor):** ${marriage.upapadaLagnaDetails.sustenanceVerdict}\n`;
    }
    if (marriage.spouseCareerAndBackground) {
      md += `- **Spouse Probable Career:** ${marriage.spouseCareerAndBackground.probableProfessions.join(", ")} (${marriage.spouseCareerAndBackground.financialStatus})\n`;
    }
    md += `\n`;

    md += `### Partner Characteristics:\n`;
    md += `- **General Nature:** ${marriage.partnerCharacteristics.nature}\n`;
    md += `- **Key Traits:** ${marriage.partnerCharacteristics.dominantTraits.join(", ")}\n\n`;

    // 4. Health
    md += `\n## 🩺 4. Health, Longevity & Medical Astrology\n\n`;
    md += `- **Health Rating:** **${health.healthRating}** (Vitality Index: ${health.healthScore}/100)\n`;
    md += `- **Longevity Classification:** **${health.longevityAssessment.category}** — *${health.longevityAssessment.description}*\n`;
    md += `- **Ayurvedic Constitution (Tridosha):** **${health.ayurvedicConstitution.primaryDosha}** — *${health.ayurvedicConstitution.explanation}*\n`;
    md += `- **Badhaka Sthana & Lord:** ${health.badhakaSthana.impact}\n`;
    md += `- **Maraka Planetary Forces:** ${health.marakaPlanets.explanation}\n\n`;

    if (health.organVulnerabilities.length > 0) {
      md += `### Anatomical & Organ Vulnerability Mapping:\n`;
      health.organVulnerabilities.forEach((ov) => {
        md += `- **${ov.organOrSystem} (${ov.rulingPlanetOrHouse} - ${ov.severity}):** ${ov.guidance}\n`;
      });
      md += `\n`;
    }

    md += `### Ayurvedic Diet & Lifestyle Guidance:\n`;
    health.ayurvedicConstitution.dietLifestyleRecommendations.forEach((rec) => {
      md += `- 🥗 ${rec}\n`;
    });

    // 5. Education
    md += `\n## 🎓 5. Education, Intellect & Academic Direction\n\n`;
    md += `- **Intellect Rating:** **${education.intellectRating}** (Academic Success Score: ${education.academicSuccessScore}/100)\n`;
    md += `- **Cognitive Learning Style:** ${education.learningStyle}\n`;
    md += `- **Competitive Exams (UPSC/JEE/GRE/CAT):** **${education.competitiveExams.successLikelihood}** — *${education.competitiveExams.advice}*\n`;
    md += `- **International Higher Education Potential:** ${education.higherEducationAndResearch.description}\n`;
    md += `- **Mercury & Jupiter Impact:** ${education.mercuryJupiterSignificance.mercuryImpact} ${education.mercuryJupiterSignificance.jupiterImpact}\n\n`;

    md += `### Recommended Academic Streams:\n`;
    education.recommendedStreams.forEach((st) => {
      md += `- **${st.stream} (${st.suitability}):** ${st.astrologicalReason}\n`;
    });

    // 6. Progeny
    md += `\n## 👶 6. Children & Progeny Blessings (Santana Bhava)\n\n`;
    md += `- **Progeny Rating:** **${progeny.progenyRating}** (Blessing Score: ${progeny.progenyBlessingScore}/100)\n`;
    md += `- **5th House Details:** ${progeny.fifthHouseDetails.rashi} (Lord: ${progeny.fifthHouseDetails.lord} in House ${progeny.fifthHouseDetails.lordPlacementHouse}) with ${progeny.fifthHouseDetails.savBindus} SAV bindus\n`;
    md += `- **Jupiter (Putrakaraka) Disposition:** ${progeny.jupiterStrengthVerdict}\n`;
    if (progeny.putraDosha.hasDosha) {
      md += `- **Putra Dosha / Conception Alert:** ⚠️ **${progeny.putraDosha.type}**: ${progeny.putraDosha.description}\n`;
    }
    if (progeny.saptamshaD7Insight) md += `- **Saptamsha (D7) Verification:** ${progeny.saptamshaD7Insight}\n\n`;

    md += `### Progeny Traits & Demeanor:\n`;
    progeny.childrenTraits.forEach((ct) => {
      md += `- ${ct}\n`;
    });

    // 7. Yogas & Doshas
    md += `\n## 👑 7. Classical Vedic Yogas & Planetary Doshas\n\n`;
    md += `> **Synthesis Verdict:** ${yogas.summaryVerdict}\n\n`;

    if (yogas.rajaYogas.length > 0) {
      md += `### Active Kendra-Trikona Raja Yogas:\n`;
      yogas.rajaYogas.forEach((ry) => {
        md += `- **${ry.name}** (${ry.strength}): ${ry.description}\n`;
      });
      md += `\n`;
    }

    if (yogas.specialAuspiciousYogas.length > 0) {
      md += `### Classical Auspicious Yogas:\n`;
      yogas.specialAuspiciousYogas.forEach((sy) => {
        md += `- **${sy.name}**: ${sy.description}\n`;
      });
      md += `\n`;
    }

    if (yogas.vipreetRajYogas.length > 0) {
      md += `### Vipreet Raja Yogas (Triumph in Adversity):\n`;
      yogas.vipreetRajYogas.forEach((vry) => {
        md += `- 🛡️ **${vry.name}**: ${vry.description}\n`;
      });
      md += `\n`;
    }

    md += `### Planetary Doshas & Remedial Status:\n`;
    md += `- **Kaal Sarp Dosha:** ${yogas.kaalSarpDosha.description}\n`;
    md += `- **Kemadruma Yoga:** ${yogas.kemadrumaYoga.description}\n`;
    if (yogas.inauspiciousDoshas.length > 0) {
      yogas.inauspiciousDoshas.forEach((d) => {
        md += `- **${d.name} (${d.severity}):** ${d.description} *(Remedy: ${d.remedy})*\n`;
      });
    }

    // 8. Growth Trajectory
    md += `\n## 🚀 8. Comprehensive Career & Financial Growth Trajectory\n\n`;
    md += `- **Overall Growth Velocity:** **${growth.overallGrowthVelocity}** (Composite Growth Index: **${growth.growthScore}/100**)\n`;
    md += `- **Dimensional Scores:** Career: **${growth.careerGrowthScore}/100** | Financial Wealth: **${growth.financialGrowthScore}/100** | Entrepreneurship: **${growth.entrepreneurialGrowthScore}/100**\n`;
    md += `- **Growth Archetype:** **${growth.growthArchetype.title}** — *${growth.growthArchetype.description}*\n`;
    if (growth.d10DashamshaGrowthInsight) md += `- **Dashamsha (D10):** ${growth.d10DashamshaGrowthInsight}\n`;
    if (growth.amatyakarakaGrowthInsight) md += `- **Amatyakaraka:** ${growth.amatyakarakaGrowthInsight}\n`;
    if (growth.induLagnaWealthGrowthInsight) md += `- **Wealth Surplus:** ${growth.induLagnaWealthGrowthInsight}\n\n`;

    if (growth.keyGrowthDrivers.length > 0) {
      md += `### Key Growth Drivers:\n`;
      growth.keyGrowthDrivers.forEach((dr) => {
        md += `- **${dr.driver}:** ${dr.impact}\n`;
      });
      md += `\n`;
    }

    if (growth.growthBlockersAndFriction.length > 0) {
      md += `### Growth Blockers & Mitigations:\n`;
      growth.growthBlockersAndFriction.forEach((b) => {
        md += `- ⚠️ **${b.challenge}:** *${b.mitigationStrategy}*\n`;
      });
      md += `\n`;
    }

    md += `### Life Growth Roadmap by Age Milestones:\n`;
    growth.lifeGrowthRoadmap.forEach((rm) => {
      md += `- **Ages ${rm.ageSpan} (${rm.phaseName}):** ${rm.focusArea} — *Action: ${rm.growthAction}*\n`;
    });
    md += `\n`;

    if (growth.upcomingPeakGrowthPeriods.length > 0) {
      md += `### Upcoming Peak Growth Periods:\n`;
      growth.upcomingPeakGrowthPeriods.forEach((pg) => {
        md += `- **${pg.periodSpan} (${pg.dashaPlanets}):** ${pg.growthTheme}\n`;
      });
      md += `\n`;
    }

    // 8. Dasha Timeline
    md += `\n## ⏳ 8. Vimshottari Dasha Timeline & Milestone Predictions\n\n`;
    md += `- **Current Mahadasha:** **${dashaTimeline.currentMahadasha.planet}** (${dashaTimeline.currentMahadasha.startDate} to ${dashaTimeline.currentMahadasha.endDate}) — *${dashaTimeline.currentMahadasha.prediction}*\n`;
    md += `- **Current Antardasha:** **${dashaTimeline.currentAntardasha.planet}** (${dashaTimeline.currentAntardasha.startDate} to ${dashaTimeline.currentAntardasha.endDate}) — *${dashaTimeline.currentAntardasha.prediction}*\n\n`;

    md += `### Current Sub-Period Life Influences:\n`;
    md += `- **Career:** ${dashaTimeline.currentPeriodThemes.career}\n`;
    md += `- **Wealth:** ${dashaTimeline.currentPeriodThemes.wealth}\n`;
    md += `- **Relationships:** ${dashaTimeline.currentPeriodThemes.relationships}\n`;
    md += `- **Health:** ${dashaTimeline.currentPeriodThemes.health}\n\n`;

    md += `### Critical Life Milestone Ages:\n`;
    dashaTimeline.criticalMilestoneAges.forEach((m) => {
      md += `- **Age ${m.age} (${m.astrologicalCycle}):** ${m.significance}\n`;
    });

    // 9. Transits (Gochara)
    md += `\n## 🪐 9. Gochara (Planetary Transits) & Sade Sati Status\n\n`;
    md += `- **Saturn Transit / Sade Sati:** In **${transits.saturnTransit.currentSign}** (House ${transits.saturnTransit.houseFromMoon} from natal Moon) — *${transits.saturnTransit.prediction}*\n`;
    if (transits.saturnTransit.remedy) md += `  - *Saturn Remedy:* ${transits.saturnTransit.remedy}\n`;
    md += `- **Jupiter Transit (Guru Balam):** In **${transits.jupiterTransit.currentSign}** (House ${transits.jupiterTransit.houseFromMoon} from natal Moon) — *${transits.jupiterTransit.blessings}*\n`;
    md += `- **Rahu-Ketu Axis:** ${transits.rahuKetuTransit.prediction}\n`;
    md += `- **Net Transit Score:** **${transits.overallTransitScore}/100**\n`;

    // 10. Gemstones
    md += `\n## 💎 10. Vedic Gemstone Recommendations (Multi-Chart Synthesis)\n\n`;
    const primaryRecEn = gemstones.recommendedStones.map(s => s.gemstoneName).join(", ");
    const prohibitedStrEn = gemstones.prohibitedStones.slice(0, 3).map(s => s.gemstoneName).join(", ");
    md += `- **Auspicious & Safe to Wear:** **${primaryRecEn || "None primary"}**\n`;
    md += `- **Strictly Prohibited ('Never Wear'):** ❌ ${prohibitedStrEn || "None"}\n\n`;
    if (gemstones.recommendedStones.length > 0) {
      md += `### Primary Recommended Gemstones:\n`;
      gemstones.recommendedStones.forEach((s) => {
        md += `- **${s.gemstoneName} (${s.planet}):** ${s.specifications?.weightRatti || ""} (${s.specifications?.weightCarat || ""}) | Metal: ${s.specifications?.metal || ""} | Finger: ${s.specifications?.finger || ""} | Mantra: \`${s.specifications?.beejMantra || ""}\`\n`;
      });
      md += `\n`;
    }

    // 11. Remedies
    md += `\n## 🛠️ 11. Authentic Vedic & Practical Remedies\n\n`;
    if (remedies.practicalDoAndDonts.length > 0) {
      md += `### Practical Do's and Don'ts:\n`;
      remedies.practicalDoAndDonts[0].dos.forEach((d) => {
        md += `- ✅ **DO:** ${d}\n`;
      });
      remedies.practicalDoAndDonts[0].donts.forEach((d) => {
        md += `- ❌ **DON'T:** ${d}\n`;
      });
    }

    if (remedies.mantras.length > 0) {
      md += `\n### Daily Harmonizing Mantras:\n`;
      remedies.mantras.forEach((m) => {
        md += `- **${m.deity}:** \`${m.mantra}\` (${m.count}) — *${m.benefit}*\n`;
      });
    }
  }

  return {
    summary,
    career,
    wealth,
    marriage,
    health,
    education,
    progeny,
    yogas,
    dashaTimeline,
    transits,
    remedies,
    chalitAnalysis,
    kpAnalysis,
    lalKitabAnalysis,
    jaiminiKarakas,
    gemstones,
    growth,
    formattedMarkdown: md.trim(),
  };
}
