import { Kundli } from "../kundli/types";
import { rashiNames } from "../core/constants";
import { PredictionOptions, RemediesPrediction, RemedyItem } from "./types";
import { getLalKitabAnalysis } from "./multisystem";
import { Language } from "../i18n/types";
import { remediesI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedRashi } from "../i18n/index";

export function getRemedies(kundli: Kundli, options?: PredictionOptions): RemediesPrediction {
  const lang: Language = options?.lang || 'en';
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
    const impactsDict = remediesI18n.weakHouseImpacts[lang] || remediesI18n.weakHouseImpacts.en;
    for (const hs of sav.houseStrengths) {
      if (hs.bindus < 27) {
        let impact = "";
        if (hs.house === 7) {
          impact = impactsDict[7] as string;
        } else if (hs.house === 1) {
          impact = impactsDict[1] as string;
        } else if (hs.house === 2) {
          impact = impactsDict[2] as string;
        } else if (hs.house === 8) {
          impact = impactsDict[8] as string;
        } else if (hs.house === 12) {
          impact = impactsDict[12] as string;
        } else {
          impact = (impactsDict.default as (h: number) => string)(hs.house);
        }

        const houseObj = houses[hs.house - 1];
        const rashiIdx = houseObj ? (houseObj.rashi - 1 + 12) % 12 : ((hs.rashi - 1 + 12) % 12);
        const rashiNameStr = getLocalizedRashi(rashiIdx, lang);

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
    if (lang === 'hi') {
      dos.push("व्यापार, स्वतंत्र अनुबंध व संपत्ति के मामलों में हमेशा स्पष्ट व कानूनी रूप से सुरक्षित लिखित समझौते करें।");
      dos.push("साझेदारों व सहयोगियों के साथ जिम्मेदारियों व वित्तीय सीमाओं का स्पष्ट विभाजन रखें।");
      donts.push("मौखिक अथवा अनौपचारिक आधार पर 50-50 की व्यावसायिक साझेदारी कभी न करें।");
      donts.push("भावुकतावश मित्रों अथवा रिश्तेदारों को बिना लिखित प्रमाण के बड़ी धनराशि उधार न दें।");

      remedyList.push({
        area: "साझेदारी एवं जनसंपर्क",
        house: 7,
        reason: `सप्तम भाव में अष्टकवर्ग के ${house7Bindus} बिंदु हैं (मानक 28 से कम)।`,
        remedyType: "व्यावहारिक उपाय",
        title: "औपचारिक अनुबंध व वित्तीय पारदर्शिता",
        instructions: "व्यापार में सभी लेन-देन लिखित रखें। मौखिक आश्वासनों पर निर्भर न रहें।",
      });
    } else {
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
    }

    // Jupiter or Sun in 7th
    const house7 = houses.find((h) => h.number === 7);
    if (house7?.planets.includes("Jupiter")) {
      mantras.push({
        deity: lang === 'hi' ? "भगवान श्री विष्णु / देवगुरु बृहस्पति" : "Lord Vishnu / Brihaspati",
        mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
        count: lang === 'hi' ? "गुरुवार को 108 बार" : "108 times on Thursdays",
        benefit: lang === 'hi' ? "सद्बुद्धि, कार्यक्षेत्र में प्रतिष्ठा और सप्तम भाव को शुभता प्रदान करता है।" : "Strengthens wisdom, career ethics, and harmonizes the 7th house.",
      });
    }
  }

  // Check Lagna (1st House) & Moon condition
  const moon = planets.Moon;
  if (moon && moon.isCombust) {
    if (lang === 'hi') {
      dos.push("मानसिक स्थिरता व भावनात्मक शांति के लिए प्रतिदिन 10 मिनट ध्यान, प्राणायाम अथवा गहरी सांस लेने का अभ्यास करें।");
      donts.push("अत्यधिक मानसिक तनाव या देर रात के समय जीवन के महत्वपूर्ण निर्णय लेने से बचें।");

      mantras.push({
        deity: "भगवान शिव (चंद्र सोमेश्वर)",
        mantra: "ॐ नमः शिवाय",
        count: "प्रतिदिन अथवा सोमवार को 108 बार",
        benefit: "मानसिक अशांति दूर करता है, चिंताओं को समाप्त कर आंतरिक संकल्प को मजबूत बनाता है।",
      });

      lifestyleHabits.push("सोमवार को शिवलिंग पर शुद्ध जल अथवा कच्चा दूध अर्पित करें।");
      lifestyleHabits.push("स्नायु तंत्र के संतुलन के लिए सोने-जागने का नियमित समय निर्धारित रखें।");

      remedyList.push({
        area: "मानसिक स्पष्टता व भावनात्मक संतुलन",
        house: 1,
        reason: "लग्न में चंद्रमा अस्त / अमावस्या का प्रभाव।",
        remedyType: "मंत्र साधना",
        title: "शिव आराधना एवं ध्यान",
        instructions: "'ॐ नमः शिवाय' का 108 बार जप कर विचारों को स्थिर करें और आत्मविश्वास बढ़ाएं।",
      });
    } else {
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
  }

  // Check Lagna Lord
  const lagnaLord = kundli.ascendant.rashiLord;
  if (lagnaLord === "Saturn") {
    if (lang === 'hi') {
      lifestyleHabits.push("शनि देव निरंतरता और अनुशासन के कारक हैं: दैनिक व्यायाम, योग अथवा शारीरिक श्रम की दिनचर्या रखें।");
      lifestyleHabits.push("श्रमिकों, सफाई कर्मचारियों अथवा असहाय वृद्धों की बिना किसी स्वार्थ के सहायता करें।");

      remedyList.push({
        area: "लग्न बल, स्वास्थ्य व दीर्घायु",
        house: 1,
        reason: "शनि लग्नेश (कुंडली के मुख्य स्वामी) हैं।",
        remedyType: "जीवनशैली सुधार",
        title: "अनुशासित शारीरिक दिनचर्या",
        instructions: "प्रातःकाल जल्दी उठें और अनुशासित दिनचर्या अपनाएं; शनि अनुशासित जातक को सर्वोच्च फल प्रदान करते हैं।",
      });
    } else {
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
  }

  // Sun Arghya (Universal vitality)
  if (lang === 'hi') {
    dos.push("प्रातःकाल तांबे के पात्र से उगते हुए सूर्य देव को जल (अर्घ्य) अर्पित करें।");
    mantras.push({
      deity: "सूर्य देव / गायत्री माता",
      mantra: "ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्",
      count: "सूर्योदय के समय 24 या 108 बार",
      benefit: "आत्मबल, नेतृत्व क्षमता, तेज और शारीरिक आरोग्यता में वृद्धि करता है।",
    });
  } else {
    dos.push("Offer water (Arghya) to the rising Sun in the morning using a copper vessel.");
    mantras.push({
      deity: "Surya Deva / Gayatri",
      mantra: "Om Bhur Bhuva Swaha, Tat Savitur Varenyam, Bhargo Devasya Dheemahi, Dhiyo Yo Nah Prachodayat",
      count: "24 or 108 times at sunrise",
      benefit: "Enhances personal authority, leadership brilliance, and physical vitality.",
    });
  }

  // Default practical Do & Don'ts if array small
  if (dos.length < 3) {
    if (lang === 'hi') {
      dos.push("अतिरिक्त आय को सुरक्षित व दीर्घकालिक निवेश में लगाएं।");
      dos.push("ऐसे मार्गदर्शकों व गुरुओं के संपर्क में रहें जो आपकी क्षमताओं को विस्तार दें।");
    } else {
      dos.push("Invest surplus earnings into long-term compounding instruments.");
      dos.push("Nurture intellectual mentors who challenge your boundaries.");
    }
  }
  if (donts.length < 3) {
    if (lang === 'hi') {
      donts.push("सार्वजनिक मंचों पर व्यर्थ के वाद-विवाद अथवा अहंकार के टकराव से बचें।");
      donts.push("व्यस्तता के समय भी अपने स्वास्थ्य और नियमित खान-पान की उपेक्षा न करें।");
    } else {
      donts.push("Avoid unnecessary confrontations or ego battles in public forums.");
      donts.push("Do not neglect physical fitness during intensive work sprints.");
    }
  }

  const lalKitab = getLalKitabAnalysis(kundli, { lang });

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
