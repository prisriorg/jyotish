import { Kundli } from "../kundli/types";
import { getCareerPrediction } from "./career";
import { getWealthPrediction } from "./wealth";
import { getMarriagePrediction } from "./marriage";
import { getRemedies } from "./remedies";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";
import { ComprehensiveReport } from "./types";

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
 * @returns ComprehensiveReport containing structured sub-predictions and formatted Markdown
 */
export function getComprehensiveReport(kundli: Kundli): ComprehensiveReport {
  const career = getCareerPrediction(kundli);
  const wealth = getWealthPrediction(kundli);
  const marriage = getMarriagePrediction(kundli);
  const remedies = getRemedies(kundli);
  const chalitAnalysis = getChalitAnalysis(kundli);
  const kpAnalysis = getKpAnalysis(kundli);
  const lalKitabAnalysis = getLalKitabAnalysis(kundli);
  const jaiminiKarakas = getJaiminiKarakas(kundli);

  const lagnaName = kundli.ascendant?.rashiName || "Aquarius";
  const moonSign = kundli.planets?.Moon?.rashiName || "Moon Sign";
  const sunSign = kundli.planets?.Sun?.rashiName || "Sun Sign";

  const summary =
    `Horoscope with ${lagnaName} Ascendant and ${moonSign} Moon sign. ` +
    `Career indicates ${career.recommendation.toLowerCase()} with highest potential in ` +
    `${career.suitableFields.slice(0, 2).join(" & ")}. ` +
    `Wealth capacity is rated as ${wealth.wealthRating} with strong financial inflow ` +
    `(11th House SAV: ${wealth.savMetrics.incomeHouse11Bindus} bindus). ` +
    `Marriage harmony points to favorable windows between ages ${marriage.favorableAgeRange}. ` +
    `Cross-verified via Bhava Chalit, KP Sub-Lords, Lal Kitab Dharmi Teva, and Jaimini Chara Karakas.`;

  // Format Markdown report
  let md = `# 🌟 Grand Multi-System Vedic Horoscope & Life Guidance Report\n\n`;
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
