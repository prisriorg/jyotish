import { Kundli } from "../kundli/types";
import { getCareerPrediction } from "./career";
import { getWealthPrediction } from "./wealth";
import { getMarriagePrediction } from "./marriage";
import { getRemedies } from "./remedies";
import { ComprehensiveReport } from "./types";

export * from "./types";
export * from "./career";
export * from "./wealth";
export * from "./marriage";
export * from "./remedies";

/**
 * Generates a comprehensive Vedic life prediction report combining Career,
 * Wealth, Marriage & Relationship timing, and practical Remedies.
 *
 * @param kundli Complete Janam Kundli object
 * @returns ComprehensiveReport containing structured sub-predictions and formatted Markdown
 */
export function getComprehensiveReport(kundli: Kundli): ComprehensiveReport {
  const career = getCareerPrediction(kundli);
  const wealth = getWealthPrediction(kundli);
  const marriage = getMarriagePrediction(kundli);
  const remedies = getRemedies(kundli);

  const lagnaName = kundli.ascendant?.rashiName || "Aquarius";
  const moonSign = kundli.planets?.Moon?.rashiName || "Moon Sign";
  const sunSign = kundli.planets?.Sun?.rashiName || "Sun Sign";

  const summary =
    `Horoscope with ${lagnaName} Ascendant and ${moonSign} Moon sign. ` +
    `Career indicates ${career.recommendation.toLowerCase()} with highest potential in ` +
    `${career.suitableFields.slice(0, 2).join(" & ")}. ` +
    `Wealth capacity is rated as ${wealth.wealthRating} with strong financial inflow ` +
    `(11th House SAV: ${wealth.savMetrics.incomeHouse11Bindus} bindus). ` +
    `Marriage harmony points to favorable windows between ages ${marriage.favorableAgeRange}.`;

  // Format Markdown report
  let md = `# 🌟 Vedic Life Guidance & Horoscope Predictions\n\n`;
  md += `**Ascendant (Lagna):** ${lagnaName} | **Moon Sign:** ${moonSign} | **Sun Sign:** ${sunSign}\n\n`;
  md += `> ${summary}\n\n`;

  // Career Section
  md += `## 💼 1. Career & Professional Trajectory\n\n`;
  md += `- **Primary Recommendation:** **${career.recommendation}**\n`;
  md += `- **Career Alignment Score:** Business / Enterprise: **${career.businessScore}/100** | Employment / Job: **${career.jobScore}/100**\n`;
  md += `- **Executive & Leadership Level:** ${career.leadershipCapacity}\n`;
  md += `- **10th House of Karma:** ${career.tenthHouseDetails.rashi} (Lord: ${career.tenthHouseDetails.rashiLord} in House ${career.tenthHouseDetails.lordPlacementHouse}) with ${career.tenthHouseDetails.savBindus} SAV bindus\n\n`;
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
  md += `- **Ashtakavarga Inflow vs Outflow:** House 11 (Gains): **${wealth.savMetrics.incomeHouse11Bindus}** bindus vs House 12 (Expenses): **${wealth.savMetrics.expenditureHouse12Bindus}** bindus (Net Surplus: +${wealth.savMetrics.surplusRatio})\n\n`;
  if (wealth.dhanaYogas.length > 0) {
    md += `### Active Dhana Yogas Detected:\n`;
    wealth.dhanaYogas.forEach((yoga) => {
      md += `- **${yoga.name}** (${yoga.strength}): ${yoga.description}\n`;
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
  md += `- **Spouse Age Difference:** **${marriage.spouseAgeDifference.relativeAge}** (${marriage.spouseAgeDifference.estimatedDifferenceYears})\n`;
  md += `- **Age Gap Astrological Basis:** ${marriage.spouseAgeDifference.reason}\n`;
  md += `- **Marital Harmony Status:** **${marriage.maritalHarmonyRating}**\n`;
  md += `- **Optimal Age Window:** ${marriage.favorableAgeRange}\n`;
  md += `- **Astrologically Supported Timing Years:** ${marriage.predictedTimingYears.join(", ")}\n`;
  md += `- **Dasha Support:** ${marriage.dashaSupportExplanation}\n`;
  md += `- **Mangal Dosha Analysis:** ${marriage.mangalDosha.description}\n\n`;
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

  // Remedies Section
  md += `\n## 🛠️ 4. Actionable Remedies & Weakness Rectification\n\n`;
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
    formattedMarkdown: md.trim(),
  };
}
