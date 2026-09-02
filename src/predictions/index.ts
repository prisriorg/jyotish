import { Kundli } from "../kundli/types";
import { getCareerPrediction } from "./career";
import { getWealthPrediction } from "./wealth";
import { getMarriagePrediction } from "./marriage";
import { getRemedies } from "./remedies";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";
import { ComprehensiveReport, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";
import { rashiNames } from "../core/constants";

export * from "./types";
export * from "./career";
export * from "./wealth";
export * from "./marriage";
export * from "./remedies";
export * from "./multisystem";
export * from "./jaimini";

/**
 * Generates a comprehensive Vedic life prediction report combining Career,
 * Wealth, Marriage & Relationship timing, Bhava Chalit shifts, KP sub-lords,
 * Lal Kitab Teva analysis, Jaimini Chara Karakas, and practical Remedies.
 *
 * @param kundli Complete Janam Kundli object
 * @param options Optional prediction options (e.g. { lang: 'hi' })
 * @returns ComprehensiveReport containing structured sub-predictions and formatted Markdown
 */
export function getComprehensiveReport(kundli: Kundli, options?: PredictionOptions): ComprehensiveReport {
  const lang: Language = options?.lang || 'en';

  const career = getCareerPrediction(kundli, { lang });
  const wealth = getWealthPrediction(kundli, { lang });
  const marriage = getMarriagePrediction(kundli, { lang });
  const remedies = getRemedies(kundli, { lang });
  const chalitAnalysis = getChalitAnalysis(kundli, { lang });
  const kpAnalysis = getKpAnalysis(kundli, { lang });
  const lalKitabAnalysis = getLalKitabAnalysis(kundli, { lang });
  const jaiminiKarakas = getJaiminiKarakas(kundli, { lang });

  const lagnaRashiIdx = kundli.ascendant ? kundli.ascendant.rashi - 1 : 10;
  const moonRashiIdx = kundli.planets?.Moon ? (kundli.planets.Moon.rashi ? kundli.planets.Moon.rashi - 1 : rashiNames.indexOf(kundli.planets.Moon.rashiName || "")) : 0;
  const sunRashiIdx = kundli.planets?.Sun ? (kundli.planets.Sun.rashi ? kundli.planets.Sun.rashi - 1 : rashiNames.indexOf(kundli.planets.Sun.rashiName || "")) : 0;

  const lagnaName = getLocalizedRashi(lagnaRashiIdx, lang);
  const moonSign = getLocalizedRashi(moonRashiIdx, lang);
  const sunSign = getLocalizedRashi(sunRashiIdx, lang);

  const summary = lang === 'hi'
    ? `${lagnaName} लग्न और ${moonSign} चंद्र राशि युक्त जन्म कुंडली। ` +
      `करियर: ${career.recommendation} में सर्वोत्तम संभावना, विशेष रूप से ` +
      `${career.suitableFields.slice(0, 2).join(" और ")} में। ` +
      `धन क्षमता: ${wealth.wealthRating}, एकादश (लाभ) भाव में ${wealth.savMetrics.incomeHouse11Bindus} बिंदु। ` +
      `दांपत्य: अनुकूल आयु वर्ग ${marriage.favorableAgeRange}। ` +
      `भाव चलित, केपी उप-स्वामी, लाल किताब और जैमिनी चर कारकों द्वारा त्रि-स्तरीय सत्यापित।`
    : `Horoscope with ${lagnaName} Ascendant and ${moonSign} Moon sign. ` +
      `Career indicates ${career.recommendation.toLowerCase()} with highest potential in ` +
      `${career.suitableFields.slice(0, 2).join(" & ")}. ` +
      `Wealth capacity is rated as ${wealth.wealthRating} with strong financial inflow ` +
      `(11th House SAV: ${wealth.savMetrics.incomeHouse11Bindus} bindus). ` +
      `Marriage harmony points to favorable windows between ages ${marriage.favorableAgeRange}. ` +
      `Cross-verified via Bhava Chalit, KP Sub-Lords, Lal Kitab Dharmi Teva, and Jaimini Chara Karakas.`;

  // Format Markdown report
  let md = "";
  if (lang === 'hi') {
    md = `# 🌟 संपूर्ण वैदिक जन्मकुंडली एवं जीवन मार्गदर्शन रिपोर्ट\n\n`;
    md += `**लग्न (Ascendant):** ${lagnaName} | **चंद्र राशि:** ${moonSign} | **सूर्य राशि:** ${sunSign}\n`;
    md += `**एकीकृत ज्योतिष पद्धतियां:** महर्षि पाराशर (D1/D9/D10) • श्रीपति भाव चलित • केपी ज्योतिष (कृष्णमूर्ति पद्धति) • लाल किताब • जैमिनी चर कारक\n\n`;
    md += `> ${summary}\n\n`;

    // Career
    md += `## 💼 1. आजीविका, करियर एवं व्यावसायिक दिशा\n\n`;
    md += `- **मुख्य अनुशंसा:** **${career.recommendation}**\n`;
    md += `- **करियर संरेखण स्कोर:** व्यवसाय / उद्यम: **${career.businessScore}/100** | नौकरी / सर्विस: **${career.jobScore}/100**\n`;
    md += `- **प्रशासनिक व नेतृत्व स्तर:** ${career.leadershipCapacity}\n`;
    md += `- **कर्म भाव (दशम भाव - D1):** ${career.tenthHouseDetails.rashi} (स्वामी: ${career.tenthHouseDetails.rashiLord}, भाव ${career.tenthHouseDetails.lordPlacementHouse} में), अष्टकवर्ग: ${career.tenthHouseDetails.savBindus} बिंदु\n`;
    if (career.tenthLordPlacementResult) md += `- **दशमेश स्थिति शास्त्रीय फल:** ${career.tenthLordPlacementResult}\n`;
    if (career.amatyakarakaInsight) md += `- **जैमिनी अमात्यकारक (AmK) प्रभाव:** ${career.amatyakarakaInsight}\n`;
    if (career.panchaMahapurushaYoga) md += `- **सक्रिय महापुरुष योग:** 👑 ${career.panchaMahapurushaYoga}\n`;
    if (career.chalitInsight) md += `- **भाव चलित संदर्भ:** ${career.chalitInsight}\n`;
    if (career.kpInsight) md += `- **केपी उप-स्वामी निर्णय:** ${career.kpInsight}\n`;
    if (career.lalKitabInsight) md += `- **लाल किताब किस्मत संदर्भ:** ${career.lalKitabInsight}\n\n`;

    md += `### अनुशंसित उच्च-विकास कार्यक्षेत्र:\n`;
    career.suitableFields.forEach((field) => {
      md += `- ${field}\n`;
    });
    md += `\n### रणनीतिक करियर सलाह:\n`;
    career.strategicAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // Wealth
    md += `\n## 💰 2. धन क्षमता एवं आर्थिक समृद्धि\n\n`;
    md += `- **धन स्तर:** **${wealth.wealthRating}** (आय क्षमता: ${wealth.incomePotential}/100)\n`;
    md += `- **बचत एवं संचय क्षमता:** ${wealth.savingCapacity}\n`;
    md += `- **अष्टकवर्ग आय बनाम व्यय:** एकादश भाव (आय): **${wealth.savMetrics.incomeHouse11Bindus}** बिंदु बनाम द्वादश भाव (व्यय): **${wealth.savMetrics.expenditureHouse12Bindus}** बिंदु (शुद्ध बचत: +${wealth.savMetrics.surplusRatio})\n`;
    if (wealth.secondLordPlacementResult) md += `- **द्वितीयेश (धन भाव) स्थिति:** ${wealth.secondLordPlacementResult}\n`;
    if (wealth.eleventhLordPlacementResult) md += `- **एकादशेश (लाभ भाव) स्थिति:** ${wealth.eleventhLordPlacementResult}\n`;
    if (wealth.chalitInsight) md += `- **चलित संपत्ति पुष्टि:** ${wealth.chalitInsight}\n`;
    if (wealth.kpInsight) md += `- **केपी वित्तीय आय:** ${wealth.kpInsight}\n`;
    if (wealth.lalKitabInsight) md += `- **लाल किताब समृद्धि:** ${wealth.lalKitabInsight}\n\n`;

    if (wealth.dhanaYogas.length > 0) {
      md += `### सक्रिय धन योग:\n`;
      wealth.dhanaYogas.forEach((yoga) => {
        md += `- **${yoga.name}** (${yoga.strength}): ${yoga.description}\n`;
      });
    }

    if (wealth.vipreetRajYogas && wealth.vipreetRajYogas.length > 0) {
      md += `\n### सक्रिय विपरीत राजयोग (विपत्ति में विजय):\n`;
      wealth.vipreetRajYogas.forEach((vry) => {
        md += `- 🛡️ ${vry}\n`;
      });
    }

    md += `\n### प्रमुख आय स्रोत:\n`;
    wealth.bestWealthSources.forEach((src) => {
      md += `- ${src}\n`;
    });

    // Marriage
    md += `\n## 💍 3. विवाह, संबंध एवं अनुकूल समय\n\n`;
    md += `- **विवाह स्वरूप अनुशंसा:** **${marriage.marriageType.recommendation}** (प्रेम विवाह: ${marriage.marriageType.loveScore}/100 | पारंपरिक: ${marriage.marriageType.arrangedScore}/100)\n`;
    md += `- **अंतरजातीय / विविध सांस्कृतिक संभावना:** **${marriage.marriageType.isIntercasteLikely ? 'उच्च संभावना' : 'पारंपरिक समुदाय'}** (${marriage.marriageType.intercasteProbability}%)\n`;
    md += `- **जीवनसाथी आयु अंतर:** **${marriage.spouseAgeDifference.relativeAge}** (${marriage.spouseAgeDifference.estimatedDifferenceYears}) | परिपक्वता: ${marriage.spouseAgeDifference.maturityLevel}\n`;
    md += `- **दांपत्य सामंजस्य स्थिति:** **${marriage.maritalHarmonyRating}**\n`;
    md += `- **अनुकूल आयु वर्ग:** ${marriage.favorableAgeRange}\n`;
    md += `- **ज्योतिषीय समर्थित विवाह वर्ष:** ${marriage.predictedTimingYears.join(", ")}\n`;
    md += `- **दशा सहयोग:** ${marriage.dashaSupportExplanation}\n`;
    md += `- **मांगलिक दोष विश्लेषण:** ${marriage.mangalDosha.description}\n`;
    if (marriage.seventhLordPlacementResult) md += `- **सप्तमेश स्थिति शास्त्रीय फल:** ${marriage.seventhLordPlacementResult}\n`;
    if (marriage.darakarakaInsight) md += `- **जैमिनी दाराकारक (DK) फल:** ${marriage.darakarakaInsight}\n`;
    if (marriage.chalitInsight) md += `- **चलित भाव संदर्भ:** ${marriage.chalitInsight}\n`;
    if (marriage.kpInsight) md += `- **केपी सप्तम भाव फल:** ${marriage.kpInsight}\n\n`;

    md += `### जीवनसाथी के स्वाभाविक गुण:\n`;
    md += `- **सामान्य स्वभाव:** ${marriage.partnerCharacteristics.nature}\n`;
    md += `- **प्रमुख विशेषताएं:** ${marriage.partnerCharacteristics.dominantTraits.join(", ")}\n`;
    md += `- **दिशा व पृष्ठभूमि:** ${marriage.partnerCharacteristics.directionOrBackground}\n\n`;

    md += `### दांपत्य मार्गदर्शन:\n`;
    marriage.relationshipAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // Jaimini
    md += `\n## 🏛️ 4. जैमिनी चर कारक (आत्मा एवं जीवन उद्देश्य)\n\n`;
    md += `- **आत्मकारक (AK):** **${getLocalizedPlanet(jaiminiKarakas.atmakaraka.planet, lang)}** (${jaiminiKarakas.atmakaraka.formattedDegree}, ${jaiminiKarakas.atmakaraka.rashiName}) — *${jaiminiKarakas.atmakaraka.signification}*\n`;
    md += `- **अमात्यकारक (AmK):** **${getLocalizedPlanet(jaiminiKarakas.amatyakaraka.planet, lang)}** (${jaiminiKarakas.amatyakaraka.formattedDegree}, ${jaiminiKarakas.amatyakaraka.rashiName}) — *${jaiminiKarakas.amatyakaraka.signification}*\n`;
    md += `- **भ्रातृकारक (BK):** **${getLocalizedPlanet(jaiminiKarakas.bhratrikaraka.planet, lang)}** (${jaiminiKarakas.bhratrikaraka.formattedDegree}, ${jaiminiKarakas.bhratrikaraka.rashiName}) — *${jaiminiKarakas.bhratrikaraka.signification}*\n`;
    md += `- **मातृकारक (MK):** **${getLocalizedPlanet(jaiminiKarakas.matrikaraka.planet, lang)}** (${jaiminiKarakas.matrikaraka.formattedDegree}, ${jaiminiKarakas.matrikaraka.rashiName}) — *${jaiminiKarakas.matrikaraka.signification}*\n`;
    md += `- **पुत्रकारक (PK):** **${getLocalizedPlanet(jaiminiKarakas.putrakaraka.planet, lang)}** (${jaiminiKarakas.putrakaraka.formattedDegree}, ${jaiminiKarakas.putrakaraka.rashiName}) — *${jaiminiKarakas.putrakaraka.signification}*\n`;
    md += `- **ज्ञाति कारक (GK):** **${getLocalizedPlanet(jaiminiKarakas.gnatikaraka.planet, lang)}** (${jaiminiKarakas.gnatikaraka.formattedDegree}, ${jaiminiKarakas.gnatikaraka.rashiName}) — *${jaiminiKarakas.gnatikaraka.signification}*\n`;
    md += `- **दाराकारक (DK):** **${getLocalizedPlanet(jaiminiKarakas.darakaraka.planet, lang)}** (${jaiminiKarakas.darakaraka.formattedDegree}, ${jaiminiKarakas.darakaraka.rashiName}) — *${jaiminiKarakas.darakaraka.signification}*\n`;

    // Bhava Chalit
    md += `\n## 🪐 5. भाव चलित चक्र एवं ग्रह स्थानांतरण\n\n`;
    if (chalitAnalysis.shiftedPlanets.length > 0) {
      md += `### स्थानांतरित ग्रह:\n`;
      chalitAnalysis.shiftedPlanets.forEach((sp) => {
        const locP = getLocalizedPlanet(sp.planet, lang);
        md += `- **${locP}:** लग्न भाव ${sp.d1House} से चलित भाव ${sp.chalitBhava} (${sp.shiftDirection})। *${sp.impact}*\n`;
      });
    } else {
      md += `- लग्न कुंडली के सभी ग्रह भाव चलित में समान भाव में हैं।\n`;
    }
    md += `\n### मुख्य भाव अवलोकन:\n`;
    chalitAnalysis.keyBhavaInsights.forEach((kbi) => {
      md += `- ${kbi}\n`;
    });

    // KP
    md += `\n## 📐 6. केपी ज्योतिष (कृष्णमूर्ति पद्धति) भाव कस्प विश्लेषण\n\n`;
    md += `- **दशम भाव उप-स्वामी:** **${getLocalizedPlanet(kpAnalysis.careerCusp10.subLord, lang)}** (नक्षत्र स्वामी: ${getLocalizedPlanet(kpAnalysis.careerCusp10.starLord, lang)}) — *${kpAnalysis.careerCusp10.significationVerdict}*\n`;
    md += `- **सप्तम भाव उप-स्वामी:** **${getLocalizedPlanet(kpAnalysis.marriageCusp7.subLord, lang)}** (नक्षत्र स्वामी: ${getLocalizedPlanet(kpAnalysis.marriageCusp7.starLord, lang)}) — *${kpAnalysis.marriageCusp7.marriagePromise}* ${kpAnalysis.marriageCusp7.typeIndication}\n`;
    md += `- **वित्तीय भाव (2 व 11):** उप-स्वामी **${getLocalizedPlanet(kpAnalysis.wealthCusps.cusp2SubLord, lang)}** व **${getLocalizedPlanet(kpAnalysis.wealthCusps.cusp11SubLord, lang)}** — *${kpAnalysis.wealthCusps.financialSignification}*\n`;

    // Lal Kitab
    md += `\n## 📕 7. लाल किताब टेवा एवं अचूक टोटके\n\n`;
    md += `- **टेवा प्रकार:** **${lalKitabAnalysis.tevaType}**\n`;
    md += `- **किस्मत का ग्रह:** **${getLocalizedPlanet(lalKitabAnalysis.kismatKaGrah.planet, lang)}** (भाव ${lalKitabAnalysis.kismatKaGrah.house} में) — *${lalKitabAnalysis.kismatKaGrah.role}*\n`;
    md += `- **सोए हुए घर:** भाव ${lalKitabAnalysis.sleepingHouses.join(", ")}\n`;
    md += `- **जगे हुए घर:** भाव ${lalKitabAnalysis.awakenedHouses.join(", ")}\n\n`;

    md += `### लाल किताब सावधानियां एवं उपाय:\n`;
    lalKitabAnalysis.lalKitabRemedies.forEach((lkr) => {
      md += `- **${lkr.area}:** ${lkr.remedy} *(⚠️ सावधानी: ${lkr.caution})*\n`;
    });

    // Remedies
    md += `\n## 🛠️ 8. व्यावहारिक एवं वैदिक उपाय\n\n`;
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
      md += `\n### अनुशंसित मंत्र:\n`;
      remedies.mantras.forEach((m) => {
        md += `- **${m.deity}:** \`${m.mantra}\` (${m.count}) — *${m.benefit}*\n`;
      });
    }

    if (remedies.lifestyleHabits.length > 0) {
      md += `\n### जीवनशैली आदतें:\n`;
      remedies.lifestyleHabits.forEach((hab) => {
        md += `- 🔹 ${hab}\n`;
      });
    }

  } else {
    // English report
    md = `# 🌟 Grand Multi-System Vedic Horoscope & Life Guidance Report\n\n`;
    md += `**Ascendant (Lagna):** ${lagnaName} | **Moon Sign:** ${moonSign} | **Sun Sign:** ${sunSign}\n`;
    md += `**Integrated Systems:** Classical Parashari (D1/D9/D10) • Sripati Bhava Chalit • KP Astrology (Krishnamurti Paddhati) • Lal Kitab Teva • Jaimini Chara Karakas\n\n`;
    md += `> ${summary}\n\n`;

    // Career Section
    md += `## 💼 1. Career & Professional Trajectory\n\n`;
    md += `- **Primary Recommendation:** **${career.recommendation}**\n`;
    md += `- **Career Alignment Score:** Business / Enterprise: **${career.businessScore}/100** | Employment / Job: **${career.jobScore}/100**\n`;
    md += `- **Executive & Leadership Level:** ${career.leadershipCapacity}\n`;
    md += `- **10th House of Karma (D1):** ${career.tenthHouseDetails.rashi} (Lord: ${career.tenthHouseDetails.rashiLord} in House ${career.tenthHouseDetails.lordPlacementHouse}) with ${career.tenthHouseDetails.savBindus} SAV bindus\n`;
    if (career.tenthLordPlacementResult) md += `- **10th Lord Placement Shastra Verdict:** ${career.tenthLordPlacementResult}\n`;
    if (career.amatyakarakaInsight) md += `- **Jaimini Amatyakaraka (AmK) Insight:** ${career.amatyakarakaInsight}\n`;
    if (career.panchaMahapurushaYoga) md += `- **Mahapurusha Yoga Active:** 👑 ${career.panchaMahapurushaYoga}\n`;
    if (career.chalitInsight) md += `- **Chalit Bhava Context:** ${career.chalitInsight}\n`;
    if (career.kpInsight) md += `- **KP Sub-Lord Ruling:** ${career.kpInsight}\n`;
    if (career.lalKitabInsight) md += `- **Lal Kitab Destiny Context:** ${career.lalKitabInsight}\n\n`;

    md += `### Recommended High-Growth Sectors:\n`;
    career.suitableFields.forEach((field) => {
      md += `- ${field}\n`;
    });
    md += `\n### Strategic Career Advice:\n`;
    career.strategicAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // Wealth Section
    md += `\n## 💰 2. Wealth Potential & Financial Fortunes\n\n`;
    md += `- **Wealth Rating:** **${wealth.wealthRating}** (Income Potential: ${wealth.incomePotential}/100)\n`;
    md += `- **Saving Capacity:** ${wealth.savingCapacity}\n`;
    md += `- **Ashtakavarga Inflow vs Outflow:** House 11 (Gains): **${wealth.savMetrics.incomeHouse11Bindus}** bindus vs House 12 (Expenses): **${wealth.savMetrics.expenditureHouse12Bindus}** bindus (Net Surplus: +${wealth.savMetrics.surplusRatio})\n`;
    if (wealth.secondLordPlacementResult) md += `- **2nd Lord (Dhana) Placement Shastra Verdict:** ${wealth.secondLordPlacementResult}\n`;
    if (wealth.eleventhLordPlacementResult) md += `- **11th Lord (Labha) Placement Shastra Verdict:** ${wealth.eleventhLordPlacementResult}\n`;
    if (wealth.chalitInsight) md += `- **Chalit Asset Confirmation:** ${wealth.chalitInsight}\n`;
    if (wealth.kpInsight) md += `- **KP Cuspal Inflow:** ${wealth.kpInsight}\n`;
    if (wealth.lalKitabInsight) md += `- **Lal Kitab Prosperity:** ${wealth.lalKitabInsight}\n\n`;

    if (wealth.dhanaYogas.length > 0) {
      md += `### Active Dhana Yogas Detected:\n`;
      wealth.dhanaYogas.forEach((yoga) => {
        md += `- **${yoga.name}** (${yoga.strength}): ${yoga.description}\n`;
      });
    }

    if (wealth.vipreetRajYogas && wealth.vipreetRajYogas.length > 0) {
      md += `\n### Active Vipreet Raj Yogas (Triumph in Adversity):\n`;
      wealth.vipreetRajYogas.forEach((vry) => {
        md += `- 🛡️ ${vry}\n`;
      });
    }

    md += `\n### Key Financial Sources:\n`;
    wealth.bestWealthSources.forEach((src) => {
      md += `- ${src}\n`;
    });

    // Marriage Section
    md += `\n## 💍 3. Marriage, Relationships & Timing\n\n`;
    md += `- **Marriage Type Recommendation:** **${marriage.marriageType.recommendation}** (Love: ${marriage.marriageType.loveScore}/100 | Arranged: ${marriage.marriageType.arrangedScore}/100)\n`;
    md += `- **Intercaste / Cross-Cultural Likelihood:** **${marriage.marriageType.isIntercasteLikely ? 'High Probability' : 'Traditional Community'}** (${marriage.marriageType.intercasteProbability}%)\n`;
    md += `- **Spouse Age Difference:** **${marriage.spouseAgeDifference.relativeAge}** (${marriage.spouseAgeDifference.estimatedDifferenceYears}) | Maturity: ${marriage.spouseAgeDifference.maturityLevel}\n`;
    if (marriage.spouseAgeDifference.unconventionalGapLikely) {
      md += `- **Unconventional Age Alignment:** ⚡ Astrological indicators show non-traditional age alignment defying orthodox norms.\n`;
    }
    md += `- **Age Gap Astrological Basis:** ${marriage.spouseAgeDifference.reason}\n`;
    if (marriage.spouseAgeDifference.genderPerspective) {
      md += `- **Gender Context:** ${marriage.spouseAgeDifference.genderPerspective.ifMaleNative} • ${marriage.spouseAgeDifference.genderPerspective.ifFemaleNative}\n`;
    }
    md += `- **Marital Harmony Status:** **${marriage.maritalHarmonyRating}**\n`;
    md += `- **Optimal Age Window:** ${marriage.favorableAgeRange}\n`;
    md += `- **Astrologically Supported Timing Years:** ${marriage.predictedTimingYears.join(", ")}\n`;
    md += `- **Dasha Support:** ${marriage.dashaSupportExplanation}\n`;
    md += `- **Mangal Dosha Analysis:** ${marriage.mangalDosha.description}\n`;
    if (marriage.seventhLordPlacementResult) md += `- **7th Lord Placement Shastra Verdict:** ${marriage.seventhLordPlacementResult}\n`;
    if (marriage.darakarakaInsight) md += `- **Jaimini Darakaraka (DK) Insight:** ${marriage.darakarakaInsight}\n`;
    if (marriage.chalitInsight) md += `- **Chalit Bhava Context:** ${marriage.chalitInsight}\n`;
    if (marriage.kpInsight) md += `- **KP 7th Cusp Verdict:** ${marriage.kpInsight}\n\n`;

    if (marriage.marriageType.keyIndicators.length > 0) {
      md += `### Marriage Type Astrological Factors:\n`;
      marriage.marriageType.keyIndicators.forEach((ind) => {
        md += `- ${ind}\n`;
      });
      md += `\n`;
    }
    md += `### Partner Traits & Characteristics:\n`;
    md += `- **General Nature:** ${marriage.partnerCharacteristics.nature}\n`;
    md += `- **Key Attributes:** ${marriage.partnerCharacteristics.dominantTraits.join(", ")}\n`;
    md += `- **Background/Direction:** ${marriage.partnerCharacteristics.directionOrBackground}\n\n`;

    md += `### Relationship Guidance:\n`;
    marriage.relationshipAdvice.forEach((adv) => {
      md += `- ${adv}\n`;
    });

    // Jaimini Chara Karakas Section
    md += `\n## 🏛️ 4. Jaimini Chara Karakas (Soul & Destiny Indicators)\n\n`;
    md += `*Calculated strictly based on highest planetary degrees (0° - 30°)*:\n\n`;
    md += `- **Atmakaraka (AK - Soul Planet):** **${jaiminiKarakas.atmakaraka.planet}** (${jaiminiKarakas.atmakaraka.formattedDegree} in ${jaiminiKarakas.atmakaraka.rashiName}) — *${jaiminiKarakas.atmakaraka.signification}*\n`;
    md += `- **Amatyakaraka (AmK - Career Minister):** **${jaiminiKarakas.amatyakaraka.planet}** (${jaiminiKarakas.amatyakaraka.formattedDegree} in ${jaiminiKarakas.amatyakaraka.rashiName}) — *${jaiminiKarakas.amatyakaraka.signification}*\n`;
    md += `- **Bhratrikaraka (BK - Guides & Siblings):** **${jaiminiKarakas.bhratrikaraka.planet}** (${jaiminiKarakas.bhratrikaraka.formattedDegree} in ${jaiminiKarakas.bhratrikaraka.rashiName}) — *${jaiminiKarakas.bhratrikaraka.signification}*\n`;
    md += `- **Matrikaraka (MK - Mother & Property):** **${jaiminiKarakas.matrikaraka.planet}** (${jaiminiKarakas.matrikaraka.formattedDegree} in ${jaiminiKarakas.matrikaraka.rashiName}) — *${jaiminiKarakas.matrikaraka.signification}*\n`;
    md += `- **Putrakaraka (PK - Creative Intellect):** **${jaiminiKarakas.putrakaraka.planet}** (${jaiminiKarakas.putrakaraka.formattedDegree} in ${jaiminiKarakas.putrakaraka.rashiName}) — *${jaiminiKarakas.putrakaraka.signification}*\n`;
    md += `- **Gnatikaraka (GK - Competition & Rivals):** **${jaiminiKarakas.gnatikaraka.planet}** (${jaiminiKarakas.gnatikaraka.formattedDegree} in ${jaiminiKarakas.gnatikaraka.rashiName}) — *${jaiminiKarakas.gnatikaraka.signification}*\n`;
    md += `- **Darakaraka (DK - Spouse & Partnerships):** **${jaiminiKarakas.darakaraka.planet}** (${jaiminiKarakas.darakaraka.formattedDegree} in ${jaiminiKarakas.darakaraka.rashiName}) — *${jaiminiKarakas.darakaraka.signification}*\n`;

    // Bhava Chalit Section
    md += `\n## 🪐 5. Bhava Chalit System & Planetary Shifts\n\n`;
    if (chalitAnalysis.shiftedPlanets.length > 0) {
      md += `### Detected Planetary Bhava Shifts:\n`;
      chalitAnalysis.shiftedPlanets.forEach((sp) => {
        md += `- **${sp.planet}:** Shifted from D1 House ${sp.d1House} to Chalit Bhava ${sp.chalitBhava} (${sp.shiftDirection}). *${sp.impact}*\n`;
      });
    } else {
      md += `- All planetary placements in D1 align identically with Bhava Chalit.\n`;
    }
    md += `\n### Key Bhava Observations:\n`;
    chalitAnalysis.keyBhavaInsights.forEach((kbi) => {
      md += `- ${kbi}\n`;
    });

    // KP System Section
    md += `\n## 📐 6. KP Astrology (Krishnamurti Paddhati) Cuspal Analysis\n\n`;
    md += `- **Career Cusp (10th) Sub-Lord:** **${kpAnalysis.careerCusp10.subLord}** (Star-Lord: ${kpAnalysis.careerCusp10.starLord}) — *${kpAnalysis.careerCusp10.significationVerdict}*\n`;
    md += `- **Marriage Cusp (7th) Sub-Lord:** **${kpAnalysis.marriageCusp7.subLord}** (Star-Lord: ${kpAnalysis.marriageCusp7.starLord}) — *${kpAnalysis.marriageCusp7.marriagePromise}* ${kpAnalysis.marriageCusp7.typeIndication}\n`;
    md += `- **Financial Cusps (2nd & 11th):** Sub-Lords **${kpAnalysis.wealthCusps.cusp2SubLord}** & **${kpAnalysis.wealthCusps.cusp11SubLord}** — *${kpAnalysis.wealthCusps.financialSignification}*\n`;

    // Lal Kitab Section
    md += `\n## 📕 7. Lal Kitab Teva & Authentic Totke\n\n`;
    md += `- **Horoscope Classification (Teva):** **${lalKitabAnalysis.tevaType}**\n`;
    md += `- **Kismat Ka Grah (Planet of Destiny):** **${lalKitabAnalysis.kismatKaGrah.planet}** in House ${lalKitabAnalysis.kismatKaGrah.house} — *${lalKitabAnalysis.kismatKaGrah.role}*\n`;
    md += `- **Sleeping Houses (Soya Ghar):** House ${lalKitabAnalysis.sleepingHouses.join(", ")}\n`;
    md += `- **Awakened Houses (Jaga Ghar):** House ${lalKitabAnalysis.awakenedHouses.join(", ")}\n\n`;

    if (lalKitabAnalysis.specialYogas.length > 0) {
      md += `### Active Lal Kitab Yogas:\n`;
      lalKitabAnalysis.specialYogas.forEach((yoga) => {
        md += `- **${yoga.name}** in House ${yoga.house} (${yoga.planets.join(", ")}): ${yoga.effect}\n`;
      });
      md += `\n`;
    }

    md += `### Lal Kitab Actionable Totke & Precautions:\n`;
    lalKitabAnalysis.lalKitabRemedies.forEach((lkr) => {
      md += `- **${lkr.area}:** ${lkr.remedy} *(⚠️ Caution: ${lkr.caution})*\n`;
    });

    // Vedic Remedies Section
    md += `\n## 🛠️ 8. Vedic & Behavioral Remedies\n\n`;
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
      md += `\n### Recommended Mantras for Balance:\n`;
      remedies.mantras.forEach((m) => {
        md += `- **${m.deity}:** \`${m.mantra}\` (${m.count}) — *${m.benefit}*\n`;
      });
    }

    if (remedies.lifestyleHabits.length > 0) {
      md += `\n### Lifestyle & Behavioral Habits:\n`;
      remedies.lifestyleHabits.forEach((hab) => {
        md += `- 🔹 ${hab}\n`;
      });
    }
  }

  return {
    summary,
    career,
    wealth,
    marriage,
    remedies,
    chalitAnalysis,
    kpAnalysis,
    lalKitabAnalysis,
    jaiminiKarakas,
    formattedMarkdown: md.trim(),
  };
}
