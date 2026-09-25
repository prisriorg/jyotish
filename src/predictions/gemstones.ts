import { Kundli } from "../kundli/types";
import { getChalitChart } from "../kundli/chalit";
import { getKpChart } from "../kundli/kp";
import { Observer } from "astronomy-engine";
import {
  GemstoneReport,
  GemstoneRecommendationItem,
  GemstoneOptions,
  GemstoneCategory,
  GemstoneSuitability,
  GemstoneSpecification,
} from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";

// --- Planetary Gemstone Static Knowledge Base ---
interface GemstoneMeta {
  planet: string;
  nameEn: string;
  nameHi: string;
  uparatnaEn: string[];
  uparatnaHi: string[];
  minRatti: number;
  maxRatti: number;
  diamondCarat?: { min: number; max: number };
  metalEn: string;
  metalHi: string;
  fingerEn: string;
  fingerHi: string;
  handEn: string;
  handHi: string;
  dayEn: string;
  dayHi: string;
  pakshaEn: string;
  pakshaHi: string;
  beejMantra: string;
  chantCount: number;
  trialDays?: number;
  purificationEn: string;
  purificationHi: string;
  conflictingPlanets: string[]; // Planets whose stones must NOT be worn together
}

const GEMSTONE_CATALOG: Record<string, GemstoneMeta> = {
  Sun: {
    planet: "Sun",
    nameEn: "Ruby (Manikya)",
    nameHi: "माणिक्य (माणिक / Ruby)",
    uparatnaEn: ["Red Garnet", "Red Spinel", "Star Ruby"],
    uparatnaHi: ["लाल गार्नेट", "रेड स्पिनेल", "स्टार रूबी"],
    minRatti: 5.25,
    maxRatti: 7.25,
    metalEn: "Gold or Copper",
    metalHi: "स्वर्ण (सोना) अथवा तांबा",
    fingerEn: "Ring finger (Anamika)",
    fingerHi: "अनामिका (Ring Finger)",
    handEn: "Right hand (or working hand)",
    handHi: "दाहिना हाथ (कार्यकारी हाथ)",
    dayEn: "Sunday morning at sunrise",
    dayHi: "रविवार प्रातः सूर्योदय के समय",
    pakshaEn: "Shukla Paksha (Waxing Moon)",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः",
    chantCount: 108,
    purificationEn: "Dip in unboiled cow milk, Gangajal, honey and tulsi leaves for 1 hour. Chant the Beej Mantra 108 times and wear facing east.",
    purificationHi: "कच्चे गाय के दूध, गंगाजल, शहद और तुलसी पत्र में 1 घंटा रखें। पूर्व दिशा की ओर मुख करके 108 बार बीज मंत्र का जाप करें।",
    conflictingPlanets: ["Saturn", "Venus", "Rahu", "Ketu"],
  },
  Moon: {
    planet: "Moon",
    nameEn: "Natural Pearl (Moti)",
    nameHi: "सच्चा मोती (Pearl)",
    uparatnaEn: ["Moonstone", "White Agate"],
    uparatnaHi: ["चंद्रकांत मणि (मूनस्टोन)", "सफेद अकीक"],
    minRatti: 6.25,
    maxRatti: 9.25,
    metalEn: "Silver",
    metalHi: "शुद्ध चांदी",
    fingerEn: "Little finger (Kanishthika) or Ring finger",
    fingerHi: "कनिष्ठिका (Little Finger) अथवा अनामिका",
    handEn: "Right or Left hand",
    handHi: "दाहिना अथवा बायां हाथ",
    dayEn: "Monday evening or morning",
    dayHi: "सोमवार संध्या अथवा प्रातः काल",
    pakshaEn: "Shukla Paksha (Waxing Moon)",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ श्रां श्रीं श्रौं सः चंद्राय नमः",
    chantCount: 108,
    purificationEn: "Immerse in Gangajal and raw cow milk. Chant the Chandra Beej Mantra 108 times and wear in silver ring.",
    purificationHi: "गंगाजल व कच्चे दूध में शुद्ध करें। चंद्र बीज मंत्र का 108 बार जप कर चांदी की अंगूठी में धारण करें।",
    conflictingPlanets: ["Rahu", "Ketu", "Saturn"],
  },
  Mars: {
    planet: "Mars",
    nameEn: "Red Coral (Moonga)",
    nameHi: "लाल मूँगा (Red Coral)",
    uparatnaEn: ["Carnelian", "Red Jasper"],
    uparatnaHi: ["रक्तमणि (कार्नेलियन)", "रेड जैस्पर"],
    minRatti: 6.25,
    maxRatti: 9.25,
    metalEn: "Gold, Copper or Panchadhatu",
    metalHi: "स्वर्ण (सोना), तांबा अथवा पंचधातु",
    fingerEn: "Ring finger (Anamika)",
    fingerHi: "अनामिका (Ring Finger)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Tuesday morning (8:00 AM - 10:30 AM)",
    dayHi: "मंगलवार प्रातः (8:00 से 10:30 बजे)",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ क्रां क्रीं क्रौं सः भौमाय नमः",
    chantCount: 108,
    purificationEn: "Purify with Gangajal and raw milk. Apply red sandalwood tilak. Chant Mars Beej Mantra 108 times.",
    purificationHi: "गंगाजल व कच्चे दूध से अभिषेक कर लाल चंदन का तिलक लगाएं। मंगल बीज मंत्र का 108 बार जाप करें।",
    conflictingPlanets: ["Mercury", "Saturn", "Rahu"],
  },
  Mercury: {
    planet: "Mercury",
    nameEn: "Emerald (Panna)",
    nameHi: "पन्ना (Emerald)",
    uparatnaEn: ["Peridot", "Green Tourmaline", "Green Jade"],
    uparatnaHi: ["पेरिडॉट (जबर्जद)", "हरा टूमलाइन", "ग्रीन जेड"],
    minRatti: 4.25,
    maxRatti: 6.25,
    metalEn: "Gold, Silver, Bronze or Panchadhatu",
    metalHi: "स्वर्ण, चांदी, कांसा अथवा पंचधातु",
    fingerEn: "Little finger (Kanishthika)",
    fingerHi: "कनिष्ठिका (सबसे छोटी उंगली)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Wednesday morning (after 2 hours of sunrise)",
    dayHi: "बुधवार प्रातः काल",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः",
    chantCount: 108,
    purificationEn: "Cleanse with Gangajal and raw milk, touch with green durva grass. Chant Mercury Beej Mantra 108 times.",
    purificationHi: "गंगाजल व कच्चे दूध से धोएं, हरी दूर्वा स्पर्श कराएं। बुध बीज मंत्र का 108 बार जाप करें।",
    conflictingPlanets: ["Mars", "Moon"],
  },
  Jupiter: {
    planet: "Jupiter",
    nameEn: "Yellow Sapphire (Pukhraj)",
    nameHi: "पीला पुखराज (Yellow Sapphire)",
    uparatnaEn: ["Yellow Citrine (Sunahla)", "Yellow Topaz"],
    uparatnaHi: ["सुनहला (Citrine)", "पीला टोपाज"],
    minRatti: 4.25,
    maxRatti: 7.25,
    metalEn: "Gold, Brass or Panchadhatu",
    metalHi: "स्वर्ण (पीला सोना), पीतल अथवा पंचधातु",
    fingerEn: "Index finger (Tarjani)",
    fingerHi: "तर्जनी (Index Finger - पहली उंगली)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Thursday morning (Pushya / Punarvasu / Vishakha nakshatra is ideal)",
    dayHi: "गुरुवार प्रातः काल (8:00 से 10:30 बजे)",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः",
    chantCount: 108,
    purificationEn: "Dip in turmeric water, Gangajal, and raw milk. Offer yellow flowers. Chant Guru Beej Mantra 108 times.",
    purificationHi: "हल्दी मिश्रित गंगाजल व कच्चे दूध में शुद्ध करें। पीले पुष्प अर्पित कर गुरु बीज मंत्र का 108 बार जाप करें।",
    conflictingPlanets: ["Venus", "Mercury", "Saturn"],
  },
  Venus: {
    planet: "Venus",
    nameEn: "Diamond (Heera) / White Opal",
    nameHi: "हीरा (Diamond) / सफेद ओपल",
    uparatnaEn: ["White Sapphire", "Australian White Opal", "White Zircon"],
    uparatnaHi: ["सफेद पुखराज", "ऑस्ट्रेलियाई सफेद ओपल", "सफेद जिरकॉन"],
    minRatti: 0.5,
    maxRatti: 1.5,
    diamondCarat: { min: 0.5, max: 1.5 },
    metalEn: "Platinum, White Gold or Silver",
    metalHi: "प्लैटिनम, व्हाइट गोल्ड अथवा चांदी",
    fingerEn: "Middle finger or Little finger (or Ring finger)",
    fingerHi: "मध्यमा अथवा कनिष्ठिका (या अनामिका)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Friday morning at sunrise",
    dayHi: "शुक्रवार प्रातः सूर्योदय के समय",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ द्रां द्रीं द्रौं सः शुक्राय नमः",
    chantCount: 108,
    purificationEn: "Soak in raw milk, rose water and Gangajal. Chant Venus Beej Mantra 108 times.",
    purificationHi: "कच्चे दूध, गुलाब जल और गंगाजल में स्नान कराएं। शुक्र बीज मंत्र का 108 बार जाप करें।",
    conflictingPlanets: ["Sun", "Moon", "Mars", "Jupiter"],
  },
  Saturn: {
    planet: "Saturn",
    nameEn: "Blue Sapphire (Neelam)",
    nameHi: "नीलम (Blue Sapphire)",
    uparatnaEn: ["Iolite (Neeli)", "Amethyst (Kataila)", "Blue Topaz"],
    uparatnaHi: ["नीली (Iolite)", "कटैला (Amethyst)", "ब्लू टोपाज"],
    minRatti: 4.25,
    maxRatti: 7.25,
    metalEn: "Panchadhatu, Ashtadhatu, White Gold or Iron/Steel alloy",
    metalHi: "पंचधातु, अष्टधातु, व्हाइट गोल्ड अथवा लोहे का छल्ला",
    fingerEn: "Middle finger (Madhyama)",
    fingerHi: "मध्यमा (Middle Finger - बीच की उंगली)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Saturday evening at sunset or early morning",
    dayHi: "शनिवार सूर्यास्त के समय अथवा प्रातः काल",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः",
    chantCount: 108,
    trialDays: 3,
    purificationEn: "MANDATORY 3-DAY TRIAL: Keep wrapped in blue silk under your pillow for 3 nights. If no bad dreams or mishaps occur, cleanse in Gangajal & mustard oil, chant Shani Beej Mantra 108 times and wear.",
    purificationHi: "अनिवार्य 3 दिवसीय परीक्षण: 3 रातों तक नीले रेशमी वस्त्र में तकिए के नीचे रखें। यदि कोई अशुभ स्वप्न या हानि न हो, तो गंगाजल व तिल तेल से शुद्ध कर 108 बार शनि मंत्र जप कर धारण करें।",
    conflictingPlanets: ["Sun", "Moon", "Mars"],
  },
  Rahu: {
    planet: "Rahu",
    nameEn: "Hessonite (Gomed)",
    nameHi: "गोमेद (Hessonite Garnet)",
    uparatnaEn: ["Spessartite Garnet", "Brown Tourmaline", "Orange Zircon"],
    uparatnaHi: ["स्पेसरटाइट गार्नेट", "ब्राउन टूमलाइन", "ऑरेंज जिरकॉन"],
    minRatti: 6.25,
    maxRatti: 9.25,
    metalEn: "Silver or Ashtadhatu",
    metalHi: "चांदी अथवा अष्टधातु",
    fingerEn: "Middle finger (Madhyama)",
    fingerHi: "मध्यमा (Middle Finger)",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Saturday night or Wednesday during Rahu Kaal",
    dayHi: "शनिवार रात्रि अथवा बुधवार राहुकाल में",
    pakshaEn: "Krishna Paksha or Shukla Paksha Saturday",
    pakshaHi: "शुक्ल पक्ष शनिवार",
    beejMantra: "ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः",
    chantCount: 108,
    trialDays: 3,
    purificationEn: "MANDATORY 3-DAY TRIAL: Keep under pillow for 3 nights. Purify in Gangajal and raw milk, chant Rahu Beej Mantra 108 times.",
    purificationHi: "अनिवार्य 3 दिवसीय परीक्षण: 3 रातों तक सिरहाने रखें। गंगाजल व कच्चे दूध में स्नान कराकर राहु बीज मंत्र का 108 बार जाप करें।",
    conflictingPlanets: ["Sun", "Moon", "Mars", "Jupiter"],
  },
  Ketu: {
    planet: "Ketu",
    nameEn: "Cat's Eye (Lehsuniya)",
    nameHi: "लहसुनिया (Cat's Eye Chrysoberyl)",
    uparatnaEn: ["Tiger Eye", "Cat's Eye Quartz", "Fibrolite"],
    uparatnaHi: ["टाइगर आई", "कैट्स आई क्वार्ट्ज"],
    minRatti: 5.25,
    maxRatti: 8.25,
    metalEn: "Silver, Panchadhatu or Ashtadhatu",
    metalHi: "चांदी, पंचधातु अथवा अष्टधातु",
    fingerEn: "Middle finger (Madhyama) or Little finger",
    fingerHi: "मध्यमा अथवा कनिष्ठिका",
    handEn: "Right hand",
    handHi: "दाहिना हाथ",
    dayEn: "Thursday or Tuesday night / early morning",
    dayHi: "गुरुवार अथवा मंगलवार प्रातः काल",
    pakshaEn: "Shukla Paksha",
    pakshaHi: "शुक्ल पक्ष",
    beejMantra: "ॐ स्रां स्रीं स्रौं सः केतवे नमः",
    chantCount: 108,
    trialDays: 3,
    purificationEn: "MANDATORY 3-DAY TRIAL: Keep under pillow for 3 days. Cleanse with Gangajal and raw milk, chant Ketu Beej Mantra 108 times.",
    purificationHi: "अनिवार्य 3 दिवसीय परीक्षण: 3 दिनों तक परीक्षण करें। गंगाजल व कच्चे दूध से अभिषेक कर 108 बार केतु बीज मंत्र का जाप करें।",
    conflictingPlanets: ["Sun", "Moon", "Mars", "Venus"],
  },
};

// Exaltation and Debilitation Rashi Indices (0=Aries, 1=Taurus, ... 11=Pisces)
const EXALTATION_SIGNS: Record<string, number> = {
  Sun: 0,      // Aries
  Moon: 1,     // Taurus
  Mars: 9,     // Capricorn
  Mercury: 5,  // Virgo
  Jupiter: 3,  // Cancer
  Venus: 11,   // Pisces
  Saturn: 6,   // Libra
  Rahu: 1,     // Taurus (or Gemini 2)
  Ketu: 7,     // Scorpio (or Sagittarius 8)
};

const DEBILITATION_SIGNS: Record<string, number> = {
  Sun: 6,      // Libra
  Moon: 7,     // Scorpio
  Mars: 3,     // Cancer
  Mercury: 11, // Pisces
  Jupiter: 9,  // Capricorn
  Venus: 5,    // Virgo
  Saturn: 0,   // Aries
  Rahu: 7,     // Scorpio
  Ketu: 1,     // Taurus
};

// Yoga Karaka mappings for specific Lagnas (Lagna Rashi 1-12)
const YOGA_KARAKAS: Record<number, string> = {
  2: "Saturn", // Taurus (Lord of 9 & 10)
  4: "Mars",   // Cancer (Lord of 5 & 10)
  5: "Mars",   // Leo (Lord of 4 & 9)
  7: "Saturn", // Libra (Lord of 4 & 5)
  10: "Venus", // Capricorn (Lord of 5 & 10)
  11: "Venus", // Aquarius (Lord of 4 & 9)
};

/**
 * Calculates optimal gemstone weight in Ratti and Carats based on user weight.
 */
function calculateDosage(
  meta: GemstoneMeta,
  userWeightKg?: number
): { weightRatti: string; weightCarat: string } {
  if (meta.planet === "Venus" && meta.diamondCarat) {
    return {
      weightRatti: "0.50 - 1.25 Ratti (हीरा) / 6.25 - 8.25 Ratti (ओपल)",
      weightCarat: "0.50 - 1.25 Carat (Diamond) / 5.70 - 7.50 Carat (Opal)",
    };
  }

  let rattiMin = meta.minRatti;
  let rattiMax = meta.maxRatti;

  if (userWeightKg && userWeightKg > 30) {
    // Traditional rule: approx 1 ratti per 10-12 kg body weight
    const bodyRatti = Math.round((userWeightKg / 11) * 4) / 4; // Round to nearest 0.25
    rattiMin = Math.max(meta.minRatti, bodyRatti);
    rattiMax = Math.max(rattiMin + 1.0, meta.maxRatti);
  }

  // 1 Ratti = 0.91 Carat (approx standard 182 mg astrological ratti)
  const caratMin = Math.round(rattiMin * 0.91 * 100) / 100;
  const caratMax = Math.round(rattiMax * 0.91 * 100) / 100;

  return {
    weightRatti: `${rattiMin.toFixed(2)} - ${rattiMax.toFixed(2)} Ratti (रत्ती)`,
    weightCarat: `${caratMin.toFixed(2)} - ${caratMax.toFixed(2)} Carat (कैरेट)`,
  };
}

/**
 * Deep Multi-Chart Gemstone Recommendation Engine.
 * Evaluates Lagna (D1), Bhava Chalit shifts, KP sub-lords & significators,
 * and Navamsha (D9) internal dignity.
 */
export function getGemstoneRecommendation(
  kundli: Kundli,
  options?: GemstoneOptions
): GemstoneReport {
  const lang: Language = options?.lang || "en";
  const userWeightKg = options?.userWeightKg;

  // 1. Lagna Details
  const lagnaRashi = kundli.ascendant.rashi; // 1 to 12
  const lagnaRashiIdx = lagnaRashi - 1;
  const lagnaLord = kundli.ascendant.rashiLord || RASHI_LORDS[lagnaRashiIdx];

  // Map House Lords for all 12 houses
  const houseLords: Record<number, string> = {};
  for (let h = 1; h <= 12; h++) {
    const rIdx = (lagnaRashiIdx + h - 1) % 12;
    houseLords[h] = RASHI_LORDS[rIdx];
  }

  const lord1 = houseLords[1];  // Lagnesh (Life Stone)
  const lord5 = houseLords[5];  // Panchamesh (Knowledge Stone)
  const lord9 = houseLords[9];  // Bhagyesh (Lucky Stone)
  const lord10 = houseLords[10]; // Karmesh (Career Stone)
  const yogaKaraka = YOGA_KARAKAS[lagnaRashi];

  // Dusthana (Trik) lords
  const lord6 = houseLords[6];
  const lord8 = houseLords[8];
  const lord12 = houseLords[12];
  const dusthanaLords = new Set([lord6, lord8, lord12]);

  // Maraka lords (2 & 7)
  const lord2 = houseLords[2];
  const lord7 = houseLords[7];
  const marakaLords = new Set([lord2, lord7]);

  // Badhaka Lord:
  // Movable (Chara: 1, 4, 7, 10) -> 11th house
  // Fixed (Sthira: 2, 5, 8, 11) -> 9th house
  // Dual (Dwisvabhava: 3, 6, 9, 12) -> 7th house
  let badhakaHouse = 11;
  if ([1, 4, 7, 10].includes(lagnaRashi)) badhakaHouse = 11;
  else if ([2, 5, 8, 11].includes(lagnaRashi)) badhakaHouse = 9;
  else badhakaHouse = 7;
  const badhakaLord = houseLords[badhakaHouse];

  // 2. Bhava Chalit Setup
  const chalit = kundli.chalit || getChalitChart(kundli);
  const chalitPlanetMap = new Map<string, { house: number; shifted: number; rashiHouse: number }>();
  if (chalit?.planets) {
    for (const cp of chalit.planets) {
      chalitPlanetMap.set(cp.name, {
        house: cp.house,
        shifted: cp.shifted ?? 0,
        rashiHouse: cp.rashiHouse ?? cp.house,
      });
    }
  }

  // 3. KP Chart Setup
  let kp = kundli.kp;
  if (!kp) {
    const date = kundli.birthDetails?.rawDate || new Date();
    const lat = kundli.birthDetails?.lat ?? 25.872;
    const lon = kundli.birthDetails?.lon ?? 82.685;
    const observer = new Observer(lat, lon, 0);
    kp = getKpChart(date, observer, { ayanamsa: "kp" });
  }

  // 4. Navamsha (D9) Setup
  const d9 = kundli.vargas?.d9;

  // Active Dasha Lord
  const currentMahadasha = kundli.dasha?.currentMahadasha?.planet || kundli.dasha?.currentMahadasha?.lord;

  // Containers for 3 tiers
  const recommendedStones: GemstoneRecommendationItem[] = [];
  const conditionalStones: GemstoneRecommendationItem[] = [];
  const prohibitedStones: GemstoneRecommendationItem[] = [];

  // Evaluate each of the 9 celestial bodies
  const allPlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

  for (const planet of allPlanets) {
    const meta = GEMSTONE_CATALOG[planet];
    if (!meta) continue;

    const pPos = kundli.planets ? kundli.planets[planet] : undefined;
    const d1Rashi = pPos ? pPos.rashi : 0; // 0-indexed rashi in PlanetaryPosition (0=Aries, 11=Pisces)
    const houseFound = kundli.houses?.find((h) => h.planets?.includes(planet));
    const d1House = houseFound ? houseFound.number : (((d1Rashi - lagnaRashiIdx + 12) % 12) + 1);
    const isCombust = pPos?.isCombust ?? false;
    const isRetrograde = pPos?.isRetrograde ?? false;

    // A. D1 Lagna Analysis
    let isLifeStone = (planet === lord1);
    let isLuckyStone = (planet === lord9);
    let isKnowledgeStone = (planet === lord5);
    let isCareerStone = (planet === lord10 || planet === yogaKaraka);
    let isYogaKarakaPlanet = (planet === yogaKaraka);

    let isDusthana = dusthanaLords.has(planet);
    let isMaraka = marakaLords.has(planet);
    let isBadhaka = (planet === badhakaLord);

    let d1Verdict = "";
    let d1Score = 50;

    if (isLifeStone) {
      d1Verdict = lang === "hi"
        ? `लग्नेश (प्रथम भाव स्वामी): जातक का जीवन रत्न। स्वास्थ्य, आत्मबल, दीर्घायु एवं संपूर्ण व्यक्तित्व को शक्ति प्रदान करता है।`
        : `Lagna Lord (1st House Ruler): Life Stone. Strengthens physical vitality, longevity, immune aura, and identity.`;
      d1Score += 45;
    } else if (isYogaKarakaPlanet) {
      d1Verdict = lang === "hi"
        ? `योगकारक ग्रह: केंद्र व त्रिकोण का अधिपति होने से परम राजयोगकारी। भाग्य व सफलता का प्रबल कारक।`
        : `Yogakaraka Planet: Commands both Kendra and Trikona, creating supreme Raja Yoga prosperity.`;
      d1Score += 40;
    } else if (isLuckyStone) {
      d1Verdict = lang === "hi"
        ? `भाग्येश (नवम भाव स्वामी): जातक का भाग्य रत्न। ईश्वरीय कृपा, समृद्धि, उच्च शिक्षा एवं भाग्य वृद्धि करता है।`
        : `Bhagya Lord (9th House Ruler): Lucky Stone. Activates fortune, higher wisdom, spiritual grace, and overall rise.`;
      d1Score += 35;
    } else if (isKnowledgeStone) {
      d1Verdict = lang === "hi"
        ? `पंचमेश (पंचम भाव स्वामी): पुण्य व विद्या रत्न। बुद्धि, एकाग्रता, संतान सुख और सही निर्णय लेने की क्षमता देता है।`
        : `Panchama Lord (5th House Ruler): Knowledge Stone. Boosts intellect, speculative acumen, learning, and mantra siddhi.`;
      d1Score += 30;
    } else if (isCareerStone) {
      d1Verdict = lang === "hi"
        ? `दशमेश (दशम भाव स्वामी): कार्यक्षेत्र, प्रशासनिक पद, सामाजिक प्रतिष्ठा और आजीविका का संवर्धन करता है।`
        : `10th Lord (Karma Ruler): Enhances professional authority, enterprise, and societal status.`;
      d1Score += 25;
    }

    // Check if rules 6, 8, 12 in D1
    if (isDusthana && !isLifeStone) {
      const ownedDusthanas: number[] = [];
      if (lord6 === planet) ownedDusthanas.push(6);
      if (lord8 === planet) ownedDusthanas.push(8);
      if (lord12 === planet) ownedDusthanas.push(12);

      const dStr = ownedDusthanas.join(", ");
      const d1DusthanaWarning = lang === "hi"
        ? `भाव ${dStr} (त्रिक / दुःस्थान) का स्वामी है। इसका रत्न पहनने से रोग, ऋण, गुप्त शत्रु अथवा व्यय में तीव्र वृद्धि का जोखिम है।`
        : `Rules Dusthana house(s) ${dStr}. Wearing its stone risks amplifying illness, debts, litigation, or unforeseen losses.`;
      d1Verdict = d1Verdict ? `${d1Verdict} [सावधानी: ${d1DusthanaWarning}]` : d1DusthanaWarning;
      d1Score -= 45;
    }

    // Natural Rahu/Ketu considerations
    if (["Rahu", "Ketu"].includes(planet)) {
      if (lang === "hi") {
        d1Verdict = `${planet} छाया ग्रह है; इसका रत्न केवल अनुकूल भावों (3, 6, 10, 11) में होने पर अथवा विशिष्ट दशा में सतर्कतापूर्वक धारण किया जाता है।`;
      } else {
        d1Verdict = `${planet} is a shadow node; its stone is strictly conditional and worn only if posited in auspicious growth houses (3, 6, 10, 11) or during active Dasha.`;
      }
      d1Score = (d1House === 3 || d1House === 6 || d1House === 10 || d1House === 11) ? 60 : 35;
    }

    // B. Bhava Chalit Analysis
    let chalitVerdict = "";
    const cpData = chalitPlanetMap.get(planet);
    if (cpData) {
      const chalitHouse = cpData.house;
      const shiftVal = cpData.shifted;

      if (shiftVal !== 0) {
        if ([6, 8, 12].includes(chalitHouse)) {
          chalitVerdict = lang === "hi"
            ? `भाव चलित में ग्रह भाव ${chalitHouse} (त्रिक भाव) में स्थानांतरित हुआ है। रत्न धारण करने पर यह अनिष्ट फल दे सकता है!`
            : `Planet has shifted into Bhava ${chalitHouse} (Dusthana) in Chalit chart. Caution: Gemstone may activate negative bhava energy!`;
          d1Score -= 20;
        } else if ([1, 4, 5, 7, 9, 10, 11].includes(chalitHouse)) {
          chalitVerdict = lang === "hi"
            ? `भाव चलित में शुभ भाव ${chalitHouse} में स्थानांतरित हुआ है, जो इसके सकारात्मक प्रभाव की पुष्टि करता है।`
            : `Planet shifted into auspicious Bhava ${chalitHouse} in Chalit, affirming positive life energy.`;
          d1Score += 10;
        } else {
          chalitVerdict = lang === "hi"
            ? `भाव चलित में ग्रह भाव ${chalitHouse} में स्थित है।`
            : `Planet positioned in Chalit Bhava ${chalitHouse}.`;
        }
      } else {
        chalitVerdict = lang === "hi"
          ? `लग्न और भाव चलित में स्थिति स्थिर है (भाव ${chalitHouse})।`
          : `Position stable in Bhava ${chalitHouse} between D1 and Chalit.`;
      }
    } else {
      chalitVerdict = lang === "hi" ? "भाव चलित स्थिति सामान्य।" : "Chalit alignment standard.";
    }

    // C. KP Krishnamurti Paddhati Analysis
    let kpVerdict = "";
    let kpStarLord = "";
    let kpSubLord = "";
    let kpSignifiesDusthana = false;

    if (kp?.planets && kp.planets[planet]) {
      const kpPlanetData = kp.planets[planet];
      kpStarLord = kpPlanetData.nakshatraLord;
      kpSubLord = kpPlanetData.subLord;

      // Check significators
      const sigData = kp.significators?.planets[planet];
      const signifiedHouses = sigData ? sigData.allHouses : [kpPlanetData.house];
      const dusthanaOverlap = signifiedHouses.filter((h) => [6, 8, 12].includes(h));

      if (dusthanaOverlap.length >= 2) {
        kpSignifiesDusthana = true;
        kpVerdict = lang === "hi"
          ? `केपी पद्धति: नक्षत्र स्वामी ${getLocalizedPlanet(kpStarLord, lang)} है। ग्रह भाव ${dusthanaOverlap.join(", ")} का प्रबल कार्यकत्व दे रहा है; रत्न पहनना हानिकारक हो सकता है!`
          : `KP System: Star Lord is ${kpStarLord}. Planet strongly signifies Dusthanas ${dusthanaOverlap.join(", ")}; gemstone could trigger negative events!`;
        d1Score -= 25;
      } else if (signifiedHouses.some((h) => [1, 2, 3, 5, 9, 10, 11].includes(h))) {
        kpVerdict = lang === "hi"
          ? `केपी पद्धति: नक्षत्र स्वामी ${getLocalizedPlanet(kpStarLord, lang)}, उप-स्वामी ${getLocalizedPlanet(kpSubLord, lang)}। शुभ भावों (1, 2, 5, 9, 10, 11) का फलदायी कार्यकत्व।`
          : `KP System: Star Lord ${kpStarLord}, Sub-Lord ${kpSubLord}. Auspicious signification of fruitful houses (1, 2, 5, 9, 10, 11).`;
        d1Score += 15;
      } else {
        kpVerdict = lang === "hi"
          ? `केपी उप-स्वामी ${getLocalizedPlanet(kpSubLord, lang)} द्वारा सामान्य कार्यकत्व।`
          : `KP Sub-Lord ${kpSubLord} provides neutral signification.`;
      }
    } else {
      kpVerdict = lang === "hi" ? "केपी कार्यकत्व अनुकूल।" : "KP significations standard.";
    }

    // D. Navamsha (D9) Analysis
    let navamshaVerdict = "";
    if (d9?.planets && d9.planets[planet]) {
      const d9Rashi = d9.planets[planet].rashi - 1; // 0 to 11
      const d9RashiName = getLocalizedRashi(d9Rashi, lang);
      const isVargottama = (d9Rashi === d1Rashi);
      const isExaltedInD9 = (EXALTATION_SIGNS[planet] === d9Rashi);
      const isDebilitatedInD9 = (DEBILITATION_SIGNS[planet] === d9Rashi);

      if (isVargottama) {
        navamshaVerdict = lang === "hi"
          ? `🌟 वर्गोत्तम (Vargottama in ${d9RashiName}): ग्रह D1 और नवमांश दोनों में समान राशि में है। रत्न का प्रभाव अत्यंत शक्तिशाली व स्थिर रहेगा!`
          : `🌟 Vargottama in ${d9.planets[planet].rashiName}: Same sign in D1 and D9. Tremendous enduring power and highest gemstone efficacy!`;
        d1Score += 20;
      } else if (isExaltedInD9) {
        navamshaVerdict = lang === "hi"
          ? `नवमांश में उच्च राशि (${d9RashiName}) में स्थित है। आंतरिक बल अत्यंत सुदृढ़ है।`
          : `Exalted in Navamsha (${d9.planets[planet].rashiName}). Exceptional inner strength.`;
        d1Score += 15;
      } else if (isDebilitatedInD9) {
        navamshaVerdict = lang === "hi"
          ? `⚠️ नवमांश में नीच राशि (${d9RashiName}) में स्थित है। ग्रह की आंतरिक नींव कमजोर है, रत्न प्रभाव में उतार-चढ़ाव रह सकता है।`
          : `⚠️ Debilitated in Navamsha (${d9.planets[planet].rashiName}). Inner foundational weakness, gemstone results may fluctuate.`;
        d1Score -= 20;
      } else {
        navamshaVerdict = lang === "hi"
          ? `नवमांश में ${d9RashiName} राशि में स्थित।`
          : `Posited in ${d9.planets[planet].rashiName} in Navamsha.`;
      }
    } else {
      navamshaVerdict = lang === "hi" ? "नवमांश स्थिति सामान्य।" : "Navamsha alignment standard.";
    }

    // E. Combustion & Retrogression
    let combustionOrRetrograde = "";
    if (isCombust) {
      if (isLifeStone || isLuckyStone || isKnowledgeStone) {
        combustionOrRetrograde = lang === "hi"
          ? "सूर्य के निकट अस्त (Combust): ग्रह की किरणें क्षीण हैं; रत्न धारण करना संजीवनी बूटी की भांति इसकी ऊर्जा को पुनर्जीवित करेगा।"
          : "Combust (Asta): Weakened by solar proximity; wearing its gemstone acts as a revitalizing catalyst to awaken its latent benefic rays.";
        d1Score += 10;
      } else {
        combustionOrRetrograde = lang === "hi"
          ? "सूर्य के निकट अस्त (Combust): ग्रह की ऊर्जा असंतुलित है, सावधानी आवश्यक।"
          : "Combust (Asta): Solar affliction creates volatile energy; exercise caution.";
        d1Score -= 10;
      }
    } else if (isRetrograde) {
      combustionOrRetrograde = lang === "hi"
        ? "वक्री (Retrograde): ग्रह में उच्च चेष्टा बल है; रत्न धारण से पूर्व 3 दिन का परीक्षण अवश्य करें।"
        : "Retrograde (Vakri): Possesses high Chestha Bala; a 3-day trial period is strictly recommended.";
    }

    // F. Final Categorization Determination
    let category: GemstoneCategory = "conditional_dasha";
    let suitability: GemstoneSuitability = "conditional";
    let finalReason = "";

    // Strictly Prohibited Conditions
    // 1. Lord of 6, 8, 12 without being Lagna Lord
    // 2. KP strongly signifies 6, 8, 12 with low score
    // 3. Debilitated in D1 and causing malefic results
    const isDebilitatedInD1 = (DEBILITATION_SIGNS[planet] === d1Rashi);
    const isLagneshEnemy = (
      (lagnaLord === "Sun" && ["Saturn", "Venus", "Rahu"].includes(planet)) ||
      (lagnaLord === "Moon" && ["Saturn", "Rahu", "Ketu"].includes(planet)) ||
      (lagnaLord === "Mars" && ["Mercury", "Saturn", "Rahu"].includes(planet)) ||
      (lagnaLord === "Mercury" && ["Mars"].includes(planet)) ||
      (lagnaLord === "Jupiter" && ["Venus", "Mercury"].includes(planet)) ||
      (lagnaLord === "Venus" && ["Sun", "Moon", "Jupiter"].includes(planet)) ||
      (lagnaLord === "Saturn" && ["Sun", "Moon", "Mars"].includes(planet))
    );

    if (
      (!isLifeStone && isDusthana && !isYogaKarakaPlanet) ||
      (!isLifeStone && kpSignifiesDusthana && d1Score < 40) ||
      (!isLifeStone && isDebilitatedInD1 && !isLuckyStone && !isKnowledgeStone) ||
      (!isLifeStone && !isLuckyStone && !isKnowledgeStone && !isCareerStone && isLagneshEnemy)
    ) {
      category = "prohibited";
      suitability = "prohibited";
      d1Score = Math.min(d1Score, 25);
      finalReason = lang === "hi"
        ? `पूर्णतः वर्जित (ये तो बिल्कुल भी नहीं): यह ग्रह जन्मकुंडली में त्रिक भावों (6, 8, 12) अथवा मारक/शत्रु प्रभाव से युक्त है। इसका रत्न पहनने से रोग, कलह, आर्थिक नुकसान अथवा दुर्घटना की आशंका प्रबल हो सकती है।`
        : `Strictly Prohibited: This planet governs Dusthana houses (6, 8, 12) or acts as a Maraka/enemy of Lagnesh. Wearing its stone risks magnifying illness, disputes, financial loss, or sudden setbacks.`;
    } else if (
      (isLifeStone || isLuckyStone || isKnowledgeStone || isYogaKarakaPlanet) &&
      d1Score >= 60 &&
      !kpSignifiesDusthana
    ) {
      // Highly Recommended
      suitability = "recommended";
      if (isLifeStone) category = "life_stone";
      else if (isYogaKarakaPlanet || isCareerStone) category = "career_stone";
      else if (isLuckyStone) category = "lucky_stone";
      else category = "knowledge_stone";

      finalReason = lang === "hi"
        ? `शुभ एवं अत्यंत फलदायी: लग्न, भाव चलित, केपी और नवमांश चारों चक्रों द्वारा सत्यापित। यह रत्न आपके जीवन में स्वास्थ्य, भाग्य, बुद्धि और समृद्धि को तीव्र गति प्रदान करेगा।`
        : `Highly Auspicious & Recommended: Fully cross-verified across D1, Bhava Chalit, KP sub-lords, and Navamsha. Wearing this gem unlocks longevity, fortune, intellect, and career growth.`;
    } else {
      // Conditional
      category = "conditional_dasha";
      suitability = "conditional";
      const isCurrentDashaLord = (currentMahadasha === planet);
      finalReason = lang === "hi"
        ? (isCurrentDashaLord
            ? `सशर्त अनुशंसा: वर्तमान में ${getLocalizedPlanet(planet, lang)} की महादशा सक्रिय है। 3 दिन के ट्रायल के बाद किसी शुभ कार्य या दशा काल में पहन सकते हैं।`
            : `सशर्त अनुशंसा: यह रत्न केवल विशेष ग्रह दशा अथवा ज्योतिषी परीक्षण के बाद ही सीमित समय के लिए धारण करें।`)
        : (isCurrentDashaLord
            ? `Conditional Recommendation: Currently active Mahadasha lord is ${planet}. Safe to wear during this Dasha period following a 3-day trial.`
            : `Conditional Recommendation: Wear only during specific planetary transits/dashas or under strict trial.`);
    }

    // Build Specifications
    const dosage = calculateDosage(meta, userWeightKg);
    const specs: GemstoneSpecification = {
      weightRatti: dosage.weightRatti,
      weightCarat: dosage.weightCarat,
      metal: lang === "hi" ? meta.metalHi : meta.metalEn,
      finger: lang === "hi" ? meta.fingerHi : meta.fingerEn,
      hand: lang === "hi" ? meta.handHi : meta.handEn,
      day: lang === "hi" ? meta.dayHi : meta.dayEn,
      paksha: lang === "hi" ? meta.pakshaHi : meta.pakshaEn,
      beejMantra: meta.beejMantra,
      chantCount: meta.chantCount,
      purificationRitual: lang === "hi" ? meta.purificationHi : meta.purificationEn,
      trialPeriodDays: meta.trialDays,
      uparatna: lang === "hi" ? meta.uparatnaHi : meta.uparatnaEn,
    };

    const item: GemstoneRecommendationItem = {
      planet,
      gemstoneName: meta.nameEn,
      gemstoneHindiName: meta.nameHi,
      category,
      suitability,
      score: Math.max(5, Math.min(100, d1Score)),
      reason: finalReason,
      detailedAnalysis: {
        d1LagnaVerdict: d1Verdict,
        chalitVerdict,
        kpVerdict,
        navamshaVerdict,
        combustionOrRetrograde: combustionOrRetrograde || undefined,
      },
      specifications: specs,
      clashingGemstones: meta.conflictingPlanets.map((cp) => {
        const cMeta = GEMSTONE_CATALOG[cp];
        return lang === "hi" ? (cMeta ? cMeta.nameHi : cp) : (cMeta ? cMeta.nameEn : cp);
      }),
    };

    if (suitability === "recommended") {
      recommendedStones.push(item);
    } else if (suitability === "conditional") {
      conditionalStones.push(item);
    } else {
      prohibitedStones.push(item);
    }
  }

  // Sort recommended stones by score desc
  recommendedStones.sort((a, b) => b.score - a.score);
  conditionalStones.sort((a, b) => b.score - a.score);
  prohibitedStones.sort((a, b) => a.score - b.score);

  // Generate clashing combinations warning list based on recommended stones
  const clashingCombinationsWarning: string[] = [];

  for (const rec of recommendedStones) {
    const meta = GEMSTONE_CATALOG[rec.planet];
    if (meta) {
      for (const conf of meta.conflictingPlanets) {
        const confMeta = GEMSTONE_CATALOG[conf];
        if (confMeta) {
          const recName = lang === "hi" ? rec.gemstoneHindiName : rec.gemstoneName;
          const confName = lang === "hi" ? confMeta.nameHi : confMeta.nameEn;
          const warningStr = lang === "hi"
            ? `⚠️ ${recName} के साथ कभी भी ${confName} न पहनें (घातक परस्पर शत्रुता)।`
            : `⚠️ Never combine ${recName} with ${confName} (Strict Planetary Enmity).`;
          if (!clashingCombinationsWarning.includes(warningStr)) {
            clashingCombinationsWarning.push(warningStr);
          }
        }
      }
    }
  }

  // Summary String
  const primaryRecNames = recommendedStones.map((r) => lang === "hi" ? r.gemstoneHindiName : r.gemstoneName).join(", ");
  const prohibitedNames = prohibitedStones.slice(0, 3).map((p) => lang === "hi" ? p.gemstoneHindiName : p.gemstoneName).join(", ");

  const summary = lang === "hi"
    ? `जन्मकुंडली विश्लेषण अनुसार आपके लिए सर्वाधिक शुभ रत्न: ${primaryRecNames || "कोई विशिष्ट नहीं"}। ` +
      `भाव चलित, केपी उप-स्वामी एवं नवमांश द्वारा सत्यापित। ` +
      `भूलकर भी न पहनें: ${prohibitedNames}।`
    : `Multi-chart astrological synthesis identifies most auspicious gemstones: ${primaryRecNames || "None primary"}. ` +
      `Cross-verified via Bhava Chalit, KP sub-lords, and Navamsha. ` +
      `Strictly prohibited to avoid harm: ${prohibitedNames}.`;

  // Markdown Formatter
  let md = "";
  if (lang === "hi") {
    md = `# 💎 वैदिक रत्न परामर्श एवं त्रि-स्तरीय बहु-चक्र विश्लेषण\n\n`;
    md += `**लग्न:** ${getLocalizedRashi(lagnaRashiIdx, lang)} | **लग्नेश:** ${getLocalizedPlanet(lagnaLord, lang)} | **भाग्येश:** ${getLocalizedPlanet(lord9, lang)}\n`;
    md += `**सत्यापित चक्र:** लग्न (D1) • भाव चलित (Chalit) • केपी उप-स्वामी (KP Sub-Lord) • नवमांश (D9)\n\n`;
    md += `> ${summary}\n\n`;

    // 1. Recommended Stones
    md += `## 🟢 1. अत्यंत शुभ एवं धारणीय रत्न (Highly Recommended)\n\n`;
    if (recommendedStones.length === 0) {
      md += `*वर्तमान कुंडली में बिना विस्तृत दशा परीक्षण के कोई भी रत्न दीर्घकाल हेतु सीधे अनुशंसित नहीं है।*\n\n`;
    } else {
      recommendedStones.forEach((s, idx) => {
        md += `### ${idx + 1}. ${s.gemstoneHindiName} (${getLocalizedPlanet(s.planet, lang)} ग्रह)\n`;
        md += `- **श्रेणी:** ${getCategoryLabelHi(s.category)} | **शुभता स्कोर:** **${s.score}/100**\n`;
        md += `- **कारण:** ${s.reason}\n`;
        md += `- **D1 लग्न विश्लेषण:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
        md += `- **भाव चलित चक्र:** ${s.detailedAnalysis.chalitVerdict}\n`;
        md += `- **केपी ज्योतिष:** ${s.detailedAnalysis.kpVerdict}\n`;
        md += `- **नवमांश (D9):** ${s.detailedAnalysis.navamshaVerdict}\n`;
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **अस्त/वक्री स्थिति:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        if (s.specifications) {
          md += `\n**धारण विधि एवं विनिर्देश:**\n`;
          md += `- **वजन (रत्ती / कैरेट):** **${s.specifications.weightRatti}** (${s.specifications.weightCarat})\n`;
          md += `- **उचित धातु:** ${s.specifications.metal}\n`;
          md += `- **उंगली व हाथ:** ${s.specifications.finger} (${s.specifications.hand})\n`;
          md += `- **शुभ वार एवं पक्ष:** ${s.specifications.day}, ${s.specifications.paksha}\n`;
          md += `- **बीज मंत्र (108 जप):** \`${s.specifications.beejMantra}\`\n`;
          md += `- **उपरत्न (सस्ता विकल्प):** ${s.specifications.uparatna.join(", ")}\n`;
          md += `- **शुद्धिकरण विधि:** ${s.specifications.purificationRitual}\n`;
          if (s.specifications.trialPeriodDays) {
            md += `- **परीक्षण अवधि:** ⚠️ कम से कम ${s.specifications.trialPeriodDays} दिन तक सिरहाने रखकर परीक्षण करें।\n`;
          }
        }
        md += `\n`;
      });
    }

    // 2. Conditional Stones
    md += `## 🟡 2. सशर्त रत्न / केवल विशेष दशा में (Wear with Caution)\n\n`;
    if (conditionalStones.length === 0) {
      md += `*कोई मध्यवर्ती सशर्त रत्न नहीं।*\n\n`;
    } else {
      conditionalStones.forEach((s) => {
        md += `### • ${s.gemstoneHindiName} (${getLocalizedPlanet(s.planet, lang)})\n`;
        md += `- **स्थिति:** ${s.reason}\n`;
        md += `- **चलित व केपी प्रभाव:** ${s.detailedAnalysis.chalitVerdict} | ${s.detailedAnalysis.kpVerdict}\n`;
        if (s.specifications) {
          md += `- **अनुशंसित वजन:** ${s.specifications.weightRatti} | धातु: ${s.specifications.metal} | उंगली: ${s.specifications.finger}\n`;
        }
        md += `\n`;
      });
    }

    // 3. Prohibited Stones
    md += `## 🔴 3. पूर्णतः वर्जित रत्न (भूलकर भी न पहनें - 'ये तो बिल्कुल भी नहीं')\n\n`;
    prohibitedStones.forEach((s) => {
      md += `### ❌ ${s.gemstoneHindiName} (${getLocalizedPlanet(s.planet, lang)})\n`;
      md += `- **निषेध का कारण:** ${s.reason}\n`;
      md += `- **शास्त्रीय दोष:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
      md += `- **केपी / चलित चेतावनी:** ${s.detailedAnalysis.kpVerdict}\n\n`;
    });

    // 4. Clashing Combinations
    if (clashingCombinationsWarning.length > 0) {
      md += `## ⚡ परस्पर विरोधी रत्न चेतावनी (Clashing Gemstones)\n\n`;
      clashingCombinationsWarning.forEach((w) => {
        md += `- ${w}\n`;
      });
      md += `\n`;
    }
  } else {
    // English Formatting
    md = `# 💎 Vedic Gemstone Recommendation & Multi-Chart Report\n\n`;
    md += `**Ascendant:** ${kundli.ascendant.rashiName} | **Lagna Lord:** ${lagnaLord} | **Bhagya Lord (9th):** ${lord9}\n`;
    md += `**Verified Frameworks:** Rashi (D1) • Bhava Chalit • KP Sub-Lords • Navamsha (D9)\n\n`;
    md += `> ${summary}\n\n`;

    // 1. Recommended
    md += `## 🟢 1. Highly Beneficial Gemstones (Recommended)\n\n`;
    if (recommendedStones.length === 0) {
      md += `*No gemstone is unconditionally recommended for lifetime wear without specific dasha validation.*\n\n`;
    } else {
      recommendedStones.forEach((s, idx) => {
        md += `### ${idx + 1}. ${s.gemstoneName} (${s.planet})\n`;
        md += `- **Role:** ${getCategoryLabelEn(s.category)} | **Safety & Beneficence Score:** **${s.score}/100**\n`;
        md += `- **Verdict:** ${s.reason}\n`;
        md += `- **D1 Lagna Analysis:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
        md += `- **Bhava Chalit Status:** ${s.detailedAnalysis.chalitVerdict}\n`;
        md += `- **KP System:** ${s.detailedAnalysis.kpVerdict}\n`;
        md += `- **Navamsha (D9):** ${s.detailedAnalysis.navamshaVerdict}\n`;
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **Combust / Retrograde Note:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        if (s.specifications) {
          md += `\n**Wearing Specifications:**\n`;
          md += `- **Weight:** **${s.specifications.weightRatti}** (${s.specifications.weightCarat})\n`;
          md += `- **Metal:** ${s.specifications.metal}\n`;
          md += `- **Finger & Hand:** ${s.specifications.finger} (${s.specifications.hand})\n`;
          md += `- **Auspicious Time:** ${s.specifications.day}, ${s.specifications.paksha}\n`;
          md += `- **Beej Mantra (108 chants):** \`${s.specifications.beejMantra}\`\n`;
          md += `- **Substitutes (Uparatna):** ${s.specifications.uparatna.join(", ")}\n`;
          md += `- **Purification Ritual:** ${s.specifications.purificationRitual}\n`;
          if (s.specifications.trialPeriodDays) {
            md += `- **Mandatory Trial:** ⚠️ Keep under pillow for ${s.specifications.trialPeriodDays} nights before setting into ring.\n`;
          }
        }
        md += `\n`;
      });
    }

    // 2. Conditional
    md += `## 🟡 2. Conditional / Dasha-Specific Gemstones (Wear with Caution)\n\n`;
    if (conditionalStones.length === 0) {
      md += `*No secondary conditional gemstones identified.*\n\n`;
    } else {
      conditionalStones.forEach((s) => {
        md += `### • ${s.gemstoneName} (${s.planet})\n`;
        md += `- **Condition:** ${s.reason}\n`;
        md += `- **Chalit & KP Note:** ${s.detailedAnalysis.chalitVerdict} | ${s.detailedAnalysis.kpVerdict}\n`;
        if (s.specifications) {
          md += `- **Specs:** ${s.specifications.weightRatti} | Metal: ${s.specifications.metal} | Finger: ${s.specifications.finger}\n`;
        }
        md += `\n`;
      });
    }

    // 3. Prohibited
    md += `## 🔴 3. Strictly Prohibited Gemstones (Hazardous - 'Never Wear')\n\n`;
    prohibitedStones.forEach((s) => {
      md += `### ❌ ${s.gemstoneName} (${s.planet})\n`;
      md += `- **Prohibition Rationale:** ${s.reason}\n`;
      md += `- **Classical Affliction:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
      md += `- **KP / Chalit Warning:** ${s.detailedAnalysis.kpVerdict}\n\n`;
    });

    // 4. Clashing Combinations
    if (clashingCombinationsWarning.length > 0) {
      md += `## ⚡ Clashing Gemstone Conflicts (Strict Incompatibility)\n\n`;
      clashingCombinationsWarning.forEach((w) => {
        md += `- ${w}\n`;
      });
      md += `\n`;
    }
  }

  return {
    recommendedStones,
    conditionalStones,
    prohibitedStones,
    clashingCombinationsWarning,
    summary,
    formattedMarkdown: md,
  };
}

function getCategoryLabelHi(cat: GemstoneCategory): string {
  switch (cat) {
    case "life_stone": return "जीवन रत्न (Life Stone - स्वास्थ्य व आत्मबल)";
    case "lucky_stone": return "भाग्य रत्न (Lucky Stone - भाग्य व समृद्धि)";
    case "knowledge_stone": return "पुण्य / विद्या रत्न (Knowledge Stone - बुद्धि व मंत्र)";
    case "career_stone": return "कर्म / राजयोग रत्न (Career & Prominence)";
    case "conditional_dasha": return "दशा आधारित / सशर्त (Conditional)";
    case "prohibited": return "वर्जित (Prohibited)";
  }
}

function getCategoryLabelEn(cat: GemstoneCategory): string {
  switch (cat) {
    case "life_stone": return "Life Stone (Lagna Lord - Vitality & Identity)";
    case "lucky_stone": return "Lucky Stone (9th Lord - Fortune & Destiny)";
    case "knowledge_stone": return "Knowledge Stone (5th Lord - Intellect & Insight)";
    case "career_stone": return "Karma / Career Stone (10th Lord & Yogakaraka)";
    case "conditional_dasha": return "Conditional / Dasha-Specific";
    case "prohibited": return "Prohibited";
  }
}
