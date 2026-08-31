import { Kundli } from "../kundli/types";
import { rashiNames } from "../core/constants";
import { RemediesPrediction, RemedyItem } from "./types";
import { getLalKitabAnalysis } from "./multisystem";

export function getRemedies(kundli: Kundli): RemediesPrediction {
  const sav = kundli.ashtakavarga?.sav;
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};

  const weakHousesIdentified: RemediesPrediction["weakHousesIdentified"] = [];
  const remedyList: RemedyItem[] = [];
  const dos: string[] = [];
  const donts: string[] = [];
  const mantras: RemediesPrediction["mantras"] = [];
  const lifestyleHabits: string[] = [];

  // 1. Evaluate Ashtakavarga Houses (< 28 bindus)
  if (sav?.houseStrengths) {
    for (const hs of sav.houseStrengths) {
      if (hs.bindus < 27) {
        let impact = "";
        if (hs.house === 7) {
          impact = "Sensitivity in partnerships, legal agreements, and public collaborations.";
        } else if (hs.house === 1) {
          impact = "Energy fluctuations, self-doubt, or physical stamina needs consistent focus.";
        } else if (hs.house === 2) {
          impact = "Liquid wealth management requires structured discipline.";
        } else if (hs.house === 8) {
          impact = "Positive protection against major sudden accidents or chronic vulnerabilities (low bindus in 8th is classically protective).";
        } else if (hs.house === 12) {
          impact = "Controlled expenditure and reduced financial wastage (classical asset).";
        } else {
          impact = `Requires conscious effort and structured planning in house ${hs.house} matters.`;
        }

        const houseObj = houses[hs.house - 1];
        const rashiIdx = houseObj ? (houseObj.rashi - 1 + 12) % 12 : ((hs.rashi - 1 + 12) % 12);
        const rashiNameStr = rashiNames[rashiIdx] || `Sign ${hs.rashi}`;

        weakHousesIdentified.push({
          house: hs.house,
          rashi: rashiNameStr,
          bindus: hs.bindus,
          impact,
        });
      }
    }
  }

  // 2. Specific Checks & Custom Remedies

  // Check 7th house weakness
  const house7Bindus = sav?.byHouse[6] ?? 28;
  if (house7Bindus < 26) {
    dos.push("Always draft written, legally sound agreements for business, freelancing, or property deals.");
    dos.push("Maintain transparent boundaries and clear division of responsibilities with partners.");
    donts.push("Never enter into 50-50 informal or verbal business partnerships.");
    donts.push("Do not lend significant money to friends or in-laws based on emotional goodwill.");

    remedyList.push({
      area: "Partnership & Public Relations",
      house: 7,
      reason: `7th House has ${house7Bindus} bindus (below standard 28).`,
      remedyType: "Practical / Behavioral",
      title: "Formal Contract Governance",
      instructions: "Keep all financial transactions documented. Avoid verbal promises in business.",
    });

    // Jupiter or Sun in 7th
    const house7 = houses.find((h) => h.number === 7);
    if (house7?.planets.includes("Jupiter")) {
      mantras.push({
        deity: "Lord Vishnu / Brihaspati",
        mantra: "Om Gram Greem Graum Sah Guruve Namah",
        count: "108 times on Thursdays",
        benefit: "Strengthens wisdom, career ethics, and harmonizes the 7th house.",
      });
    }
  }

  // Check Lagna (1st House) & Moon condition
  const moon = planets.Moon;
  if (moon && moon.isCombust) {
    dos.push("Practice 10 minutes of daily mindfulness, deep breathing, or meditation to anchor emotional clarity.");
    donts.push("Avoid making major life decisions during peak emotional agitation or late at night.");

    mantras.push({
      deity: "Lord Shiva (Chandra Someshwara)",
      mantra: "Om Namah Shivaya",
      count: "108 times daily or on Mondays",
      benefit: "Calms mental agitation, dissolves anxiety, and strengthens inner resolve.",
    });

    lifestyleHabits.push("Offer fresh water (Jal-Arghya) to Lord Shiva or a Peepal tree on Mondays.");
    lifestyleHabits.push("Keep a regular sleep-wake schedule to support nervous system balance.");

    remedyList.push({
      area: "Mental Clarity & Emotional Resilience",
      house: 1,
      reason: "Moon is combust / Amavasya influence in Lagna.",
      remedyType: "Mantra",
      title: "Shiva Aradhana & Dhyana",
      instructions: "Chant 'Om Namah Shivaya' with 108 counts to stabilize thoughts and build unshakeable confidence.",
    });
  }

  // Check Lagna Lord (Saturn for Aquarius/Capricorn, Mars for Aries/Scorpio, etc.)
  const lagnaLord = kundli.ascendant.rashiLord;
  if (lagnaLord === "Saturn") {
    lifestyleHabits.push("Saturn rewards consistency and physical discipline: maintain daily gym, running, or yoga routine.");
    lifestyleHabits.push("Help blue-collar workers, cleaners, or elderly people unprompted.");

    remedyList.push({
      area: "Lagna Vitality & Longevity",
      house: 1,
      reason: "Saturn is Lagnesh (Chart Ruler).",
      remedyType: "Lifestyle",
      title: "Disciplined Physical Routine",
      instructions: "Wake up early and maintain rigorous physical fitness; Saturn bestows maximum power on disciplined natives.",
    });
  }

  // Sun Arghya (Universal vitality)
  dos.push("Offer water (Arghya) to the rising Sun in the morning using a copper vessel.");
  mantras.push({
    deity: "Surya Deva / Gayatri",
    mantra: "Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dheemahi, Dhiyo Yo Nah Prachodayat",
    count: "24 or 108 times at sunrise",
    benefit: "Enhances personal authority, leadership brilliance, and physical vitality.",
  });

  // Default practical Do & Don'ts if array small
  if (dos.length < 3) {
    dos.push("Invest surplus earnings into long-term compounding instruments.");
    dos.push("Nurture intellectual mentors who challenge your boundaries.");
  }
  if (donts.length < 3) {
    donts.push("Avoid unnecessary confrontations or ego battles in public forums.");
    donts.push("Do not neglect physical fitness during intensive work sprints.");
  }

  const lalKitab = getLalKitabAnalysis(kundli);

  return {
    weakHousesIdentified,
    practicalDoAndDonts: [
      {
        dos,
        donts,
      },
    ],
    mantras,
    lifestyleHabits,
    remedyList,
    lalKitabRemedies: lalKitab.lalKitabRemedies,
  };
}
