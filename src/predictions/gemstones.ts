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
  GemstoneDashaTiming,
  LifeAreaCategory,
  LifeAreaImpactType,
  GemstoneLifeAreaImpact,
  GemstoneAdverseAlert,
  GemstoneBeneficHighlights,
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

// Moolatrikona Signs (0=Aries ... 11=Pisces) - Parashara Rule: Planet delivers 70-75% results of Moolatrikona house
const MOOLATRIKONA_SIGNS: Record<string, number> = {
  Sun: 4,      // Leo (0-20°)
  Moon: 1,     // Taurus (3-30°)
  Mars: 0,     // Aries (0-12°)
  Mercury: 5,  // Virgo (15-20°)
  Jupiter: 8,  // Sagittarius (0-10°)
  Venus: 6,    // Libra (0-15°)
  Saturn: 10,  // Aquarius (0-20°)
};

// Dispositors of Debilitation Signs (for Neecha Bhanga Raja Yoga analysis)
const DEBILITATION_DISPOSITORS: Record<string, string> = {
  Sun: "Venus",       // Sun in Libra -> Dispositor Venus
  Moon: "Mars",       // Moon in Scorpio -> Dispositor Mars
  Mars: "Moon",       // Mars in Cancer -> Dispositor Moon
  Mercury: "Jupiter", // Mercury in Pisces -> Dispositor Jupiter
  Jupiter: "Saturn",  // Jupiter in Capricorn -> Dispositor Saturn
  Venus: "Mercury",   // Venus in Virgo -> Dispositor Mercury
  Saturn: "Mars",     // Saturn in Aries -> Dispositor Mars
  Rahu: "Mars",       // Rahu in Scorpio -> Dispositor Mars
  Ketu: "Venus",      // Ketu in Taurus -> Dispositor Venus
};

// Exaltation Lords in Debilitation Signs (e.g. Saturn is exalted in Libra where Sun is debilitated)
const EXALTATION_LORDS_OF_DEBILITY: Record<string, string> = {
  Sun: "Saturn",      // Saturn is exalted in Libra
  Moon: "Jupiter",    // Jupiter aspecting/exalted in Cancer
  Mars: "Jupiter",    // Jupiter is exalted in Cancer
  Mercury: "Venus",   // Venus is exalted in Pisces
  Jupiter: "Mars",    // Mars is exalted in Capricorn
  Venus: "Mercury",   // Mercury is exalted in Virgo
  Saturn: "Sun",      // Sun is exalted in Aries
};

// Solar Relationships for Combustion Analysis
const SOLAR_ENEMIES = new Set(["Saturn", "Venus", "Rahu", "Ketu"]);
const SOLAR_FRIENDS = new Set(["Moon", "Mars", "Jupiter"]);

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
 * Formats a Date object or string into DD/MM/YYYY format.
 */
function formatDashaDate(d: Date | string | undefined): string {
  if (!d) return "";
  const dateObj = typeof d === "string" ? new Date(d) : d;
  if (isNaN(dateObj.getTime())) return "";
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Computes exact Dasha / Antardasha wearing window for a gemstone (कब से कब तक).
 */
function calculateGemstoneDashaTiming(
  planet: string,
  kundli: Kundli,
  lang: Language
): GemstoneDashaTiming | undefined {
  const dasha = kundli.dasha;
  if (!dasha) return undefined;

  const now = new Date();
  const planetHi = getLocalizedPlanet(planet, "hi");
  const planetEn = planet;

  let applicableDasha = "";
  let applicableDashaHi = "";
  let startDateStr = "";
  let endDateStr = "";
  let isActiveNow = false;

  // 1. Check if the current Mahadasha is this planet
  const currMaha = dasha.currentMahadasha;
  const currMahaPlanet = currMaha?.planet || currMaha?.lord;

  if (currMahaPlanet === planet && currMaha?.startTime && currMaha?.endTime) {
    isActiveNow = true;
    applicableDasha = `${planetEn} Mahadasha`;
    applicableDashaHi = `${planetHi} महादशा`;
    startDateStr = formatDashaDate(currMaha.startTime);
    endDateStr = formatDashaDate(currMaha.endTime);
  }

  // 2. Check if the current Antardasha is this planet
  const currAntar = dasha.currentAntar;
  const currAntarPlanet = currAntar?.planet || currAntar?.lord;
  if (!isActiveNow && currAntarPlanet === planet && currAntar?.startTime && currAntar?.endTime) {
    isActiveNow = true;
    const parentMahaHi = getLocalizedPlanet(currMahaPlanet || "", "hi");
    applicableDasha = `${planetEn} Antardasha in ${currMahaPlanet || ""} Mahadasha`;
    applicableDashaHi = `${parentMahaHi} महादशा में ${planetHi} की अंतर्दशा`;
    startDateStr = formatDashaDate(currAntar.startTime);
    endDateStr = formatDashaDate(currAntar.endTime);
  }

  // 3. If not currently active, find the earliest upcoming period (Antardasha or Mahadasha)
  if (!isActiveNow && dasha.mahadashas && Array.isArray(dasha.mahadashas)) {
    interface UpcomingWindow {
      type: "mahadasha" | "antardasha";
      parentMaha?: string;
      startTime: Date;
      endTime: Date;
    }
    const candidates: UpcomingWindow[] = [];

    for (const m of dasha.mahadashas) {
      const mStart = new Date(m.startTime);
      const mEnd = new Date(m.endTime);

      // Check Mahadasha itself
      if (m.planet === planet && mEnd.getTime() > now.getTime()) {
        candidates.push({
          type: "mahadasha",
          startTime: mStart,
          endTime: mEnd,
        });
      }

      // Check Antardashas within this Mahadasha
      if (m.antars && Array.isArray(m.antars)) {
        for (const a of m.antars) {
          const aStart = new Date(a.startTime);
          const aEnd = new Date(a.endTime);
          if (a.planet === planet && aEnd.getTime() > now.getTime()) {
            candidates.push({
              type: "antardasha",
              parentMaha: m.planet,
              startTime: aStart,
              endTime: aEnd,
            });
          }
        }
      }
    }

    // Sort by earliest start time
    candidates.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

    if (candidates.length > 0) {
      const best = candidates[0];
      startDateStr = formatDashaDate(best.startTime);
      endDateStr = formatDashaDate(best.endTime);

      if (best.type === "mahadasha") {
        applicableDasha = `${planetEn} Mahadasha`;
        applicableDashaHi = `${planetHi} महादशा`;
      } else {
        const parentHi = getLocalizedPlanet(best.parentMaha || "", "hi");
        applicableDasha = `${planetEn} Antardasha in ${best.parentMaha} Mahadasha`;
        applicableDashaHi = `${parentHi} महादशा में ${planetHi} की अंतर्दशा`;
      }
    }
  }

  // Fallback if no upcoming window found in 120-year cycle
  if (!startDateStr) {
    applicableDasha = `${planetEn} Mahadasha / Antardasha`;
    applicableDashaHi = `${planetHi} महादशा / अंतर्दशा`;
    startDateStr = lang === "hi" ? "दशा प्रारंभ होने पर" : "At Dasha Start";
    endDateStr = lang === "hi" ? "दशा समाप्ति पर" : "At Dasha End";
  }

  const wearingWindow = `Wear exclusively during ${applicableDasha} (${startDateStr} to ${endDateStr}). Mandatory to remove immediately upon dasha completion.`;
  const wearingWindowHi = `केवल ${applicableDashaHi} के दौरान (${startDateStr} से ${endDateStr} तक) ही धारण करें। दशा समाप्त होते ही उतार देना अनिवार्य है।`;

  const removalInstructions = `Upon conclusion of ${applicableDasha} (${endDateStr}), respectfully remove the gemstone on a Shukla Paksha morning, cleanse in Gangajal, and store in a sacred place. Do not continue wearing to prevent adverse planetary energy reversals.`;
  const removalInstructionsHi = `दशा समाप्ति (${endDateStr}) पर शुक्ल पक्ष के प्रातः काल में इस रत्न को विधिपूर्वक उंगली से उतार लें, गंगाजल व कच्चे दूध से शुद्ध कर पूजा स्थान में सुरक्षित रख दें। दशा समाप्त होने के बाद इसे पहने रहने से ग्रह का विपरीत प्रभाव हो सकता है।`;

  return {
    applicableDasha,
    applicableDashaHi,
    startDate: startDateStr,
    endDate: endDateStr,
    isActiveNow,
    wearingWindow,
    wearingWindowHi,
    removalInstructions,
    removalInstructionsHi,
  };
}

/**
 * Evaluates the impact of wearing a gemstone across 5 primary life dimensions:
 * Wealth, Career, Marriage, Health, and Education, along with explicit
 * warnings on what specific areas will be damaged (and why) for prohibited/conditional stones,
 * and what specific areas will flourish (and why) for recommended stones.
 */
function calculateLifeAreaImpactsAndAlerts(
  planet: string,
  suitability: GemstoneSuitability,
  ownedHouses: number[],
  d1House: number,
  isLifeStone: boolean,
  isLuckyStone: boolean,
  isKnowledgeStone: boolean,
  isCareerStone: boolean,
  isYogaKarakaPlanet: boolean,
  rulesDusthana: boolean,
  rulesTrishadaya: boolean,
  rulesMaraka: boolean,
  isCombust: boolean,
  isRetrograde: boolean,
  isExalted: boolean,
  isDebilitated: boolean,
  hasNeechaBhanga: boolean,
  kpDanger: boolean,
  kpProsperity: boolean,
  bnnAfflicted: boolean
): {
  lifeAreaImpacts: GemstoneLifeAreaImpact[];
  adverseAlert?: GemstoneAdverseAlert;
  beneficHighlights?: GemstoneBeneficHighlights;
} {
  const houseStrHi = ownedHouses.length > 0 ? `भाव ${ownedHouses.join(", ")}` : `भाव ${d1House}`;
  const houseStrEn = ownedHouses.length > 0 ? `house(s) ${ownedHouses.join(", ")}` : `house ${d1House}`;

  // 1. Wealth & Finance
  let wealthImpact: LifeAreaImpactType = "neutral";
  let wealthEffectHi = "";
  let wealthEffectEn = "";
  let wealthReasonHi = "";
  let wealthReasonEn = "";

  if (suitability === "prohibited") {
    wealthImpact = "negative";
    if (ownedHouses.includes(6) || ownedHouses.includes(8) || ownedHouses.includes(12) || kpDanger) {
      wealthEffectHi = "अचानक बड़ा आर्थिक संकट, संचित धन का तीव्र क्षरण, शेयर बाजार व व्यापार में भारी घाटा, और कर्ज के चक्रव्यूह में फंसने की प्रबल आशंका।";
      wealthEffectEn = "Severe financial drain, sudden heavy losses in investments/business, depletion of accumulated savings, and entrapment in debt spirals.";
      wealthReasonHi = `चूंकि यह ग्रह ${ownedHouses.includes(6) ? "षष्ठेश (ऋण भाव) " : ""}${ownedHouses.includes(8) ? "अष्टमेश (आकस्मिक नुकसान भाव) " : ""}${ownedHouses.includes(12) ? "द्वादशेश (अपव्यय भाव) " : ""}${kpDanger ? "एवं केपी में 6-8-12 का प्रबल सिग्निफिकेटर " : ""}है; रत्न धारण करने से धन क्षरण और व्यय के द्वार खुल जाएंगे।`;
      wealthReasonEn = `Since this planet rules or triggers dusthana houses (${ownedHouses.filter(h => [6,8,12,2,7].includes(h)).join(", ") || d1House}), wearing its gemstone triggers unexpected wealth drain and capital destruction.`;
    } else if (rulesMaraka) {
      wealthEffectHi = "पारिवारिक विवादों, अनियोजित खर्चों व कानूनी उलझनों में धन की बर्बादी।";
      wealthEffectEn = "Depletion of family wealth and capital loss due to unplanned obligations and disputes.";
      wealthReasonHi = "यह ग्रह द्वितीय/सप्तम (मारक भाव) का स्वामी होकर धन भाव को दूषित करता है।";
      wealthReasonEn = "Ruling maraka houses, its harsh vibration destabilizes financial continuity and capital preservation.";
    } else {
      wealthEffectHi = "आर्थिक स्थिरता में अवरोध, आय में रुकावट और अवांछित आर्थिक तनाव।";
      wealthEffectEn = "Impediment to financial liquidity and rise in unexpected monetary stress.";
      wealthReasonHi = "ग्रह की अकारक अथवा पीड़ित स्थिति के कारण धन संचय बाधित होता है।";
      wealthReasonEn = "Afflicted planetary disposition obstructs steady capital accumulation.";
    }
  } else if (suitability === "recommended") {
    wealthImpact = "positive";
    wealthEffectHi = "स्थाई धन संचय में अप्रत्याशित वृद्धि, व्यापार व आजीविका से निरंतर धन लाभ, पैतृक संपत्ति का लाभ, और नए आय स्रोतों का सृजन।";
    wealthEffectEn = "Substantial growth in financial savings, consistent inflow of money through business/profession, gains from assets, and expansion of income avenues.";
    wealthReasonHi = `शुभ केंद्र/त्रिकोण (${houseStrHi}) का स्वामी होने से यह ग्रह महालक्ष्मी व धन योगों को बल प्रदान करता है।`;
    wealthReasonEn = `Ruling auspicious kendra/trikona houses (${houseStrEn}), this gemstone activates Dhana Yogas and accelerates prosperity.`;
  } else {
    wealthImpact = "mixed";
    wealthEffectHi = "दशा के दौरान सीमित व्यावसायिक व आर्थिक लाभ संभव, परंतु दशा समाप्ति के बाद या अनियंत्रित उपयोग से व्यय बढ़ सकता है।";
    wealthEffectEn = "Moderate income during its active Dasha period, but vulnerable to financial leaks if worn beyond the prescribed window.";
    wealthReasonHi = "ग्रह पर मध्यम अथवा मिश्रित आधिपत्य होने के कारण यह केवल उचित दशावधि में ही धन प्रदायक रहता है।";
    wealthReasonEn = "Possesses mixed house lordships; hence favorable for financial gains only during its specific dasha cycle.";
  }

  // 2. Career & Business
  let careerImpact: LifeAreaImpactType = "neutral";
  let careerEffectHi = "";
  let careerEffectEn = "";
  let careerReasonHi = "";
  let careerReasonEn = "";

  if (suitability === "prohibited") {
    careerImpact = "negative";
    careerEffectHi = "कार्यक्षेत्र में अचानक निलंबन (Suspension), उच्चाधिकारियों से कलह, व्यापार में साझेदार द्वारा विश्वासघात, प्रतिष्ठा पर आंच, और नौकरी छूटने का जोखिम।";
    careerEffectEn = "Sudden career demotion, workplace harassment, rupture of business partnerships, public defamation, or abrupt job loss.";
    careerReasonHi = `यह ग्रह ${ownedHouses.includes(8) ? "अष्टमेश (अचानक पतन) " : ""}${ownedHouses.includes(12) ? "द्वादशेश (पद-हानि) " : ""}${ownedHouses.includes(6) ? "षष्ठेश (शत्रु व विवाद) " : ""}${isDebilitated ? "नीच राशि में स्थित " : ""}होकर करियर के दशम भाव को दूषित करता है।`;
    careerReasonEn = `Connecting unfavorably with dusthana houses (${ownedHouses.filter(h => [6,8,12].includes(h)).join(", ") || d1House}), it causes professional sabotage and loss of authority.`;
  } else if (suitability === "recommended") {
    careerImpact = "positive";
    careerEffectHi = "शीर्ष प्रशासनिक पद, मनचाही पदोन्नति (Promotion), व्यापार का बहुमुखी विस्तार, सामाजिक प्रतिष्ठा में वृद्धि, और प्रतिद्वंद्वियों पर विजय।";
    careerEffectEn = "Accelerated promotion, executive authority, rapid business expansion, high social prestige, and triumph over professional rivals.";
    careerReasonHi = `दशमेश/लग्नेश/भाग्येश (${houseStrHi}) होने के कारण यह ग्रह कर्मक्षेत्र में अपार ऊर्जा, नेतृत्व क्षमता और राजयोग का वरदान देता है।`;
    careerReasonEn = `By fortifying houses ${houseStrEn}, it creates powerful Raj Yogas that elevate authority and leadership.`;
  } else {
    careerImpact = "mixed";
    careerEffectHi = "अपनी दशा के दौरान पद व जिम्मेदारी में वृद्धि देगा, परंतु अन्य अवधियों में कार्यस्थल पर अनावश्यक तनाव दे सकता है।";
    careerEffectEn = "Delivers career boosts during active Dasha sub-periods, but may cause workplace friction during neutral periods.";
    careerReasonHi = "यह ग्रह सीमित समय के लिए कर्म भाव को सक्रिय करता है।";
    careerReasonEn = "Transfers selective career strength strictly aligned with its planetary period.";
  }

  // 3. Marriage & Relationships
  let marriageImpact: LifeAreaImpactType = "neutral";
  let marriageEffectHi = "";
  let marriageEffectEn = "";
  let marriageReasonHi = "";
  let marriageReasonEn = "";

  if (suitability === "prohibited") {
    if (ownedHouses.includes(7) || ownedHouses.includes(6) || ownedHouses.includes(8) || rulesMaraka || planet === "Venus" || bnnAfflicted) {
      marriageImpact = "negative";
      marriageEffectHi = "दांपत्य जीवन में कटुता, पति-पत्नी में तलाक व अलगाव की नौबत, दैनिक कलह, और जीवनसाथी के स्वास्थ्य को गंभीर खतरा।";
      marriageEffectEn = "Bitter marital friction, risk of divorce/legal separation, chronic domestic quarrels, and severe health jeopardy for the spouse.";
      marriageReasonHi = "यह ग्रह सप्तम भाव से अष्टम/व्यय भाव का अधिपति है अथवा मारक ऊर्जा रखता है; रत्न पहनने से दांपत्य संबंध टूट सकते हैं।";
      marriageReasonEn = "Positioned as an adversary to the 7th house or carrying Maraka energy, wearing this stone directly shatters domestic peace.";
    } else {
      marriageImpact = "mixed";
      marriageEffectHi = "पारिवारिक शांति में व्यवधान एवं जीवनसाथी के साथ सामंजस्य की कमी।";
      marriageEffectEn = "Occasional disruption to domestic harmony and slight emotional friction with spouse.";
      marriageReasonHi = "अशुभ ग्रह की किरणें गृहस्थ सुख में अनावश्यक उत्तेजना उत्पन्न करती हैं।";
      marriageReasonEn = "Harsh planetary rays induce temperamental discord within the family environment.";
    }
  } else if (suitability === "recommended") {
    marriageImpact = "positive";
    marriageEffectHi = "दांपत्य जीवन में गहरा प्रेम व सौहार्द, योग्य जीवनसाथी की प्राप्ति, पारिवारिक शांति, और ससुराल पक्ष से सहयोग।";
    marriageEffectEn = "Deep marital harmony, early arrival of a compatible life partner, domestic happiness, and supportive spousal bonds.";
    marriageReasonHi = "यह ग्रह कुटुंब (2), सुख (4) अथवा भाग्य (9) भाव को पुष्ट कर वैवाहिक स्थायित्व प्रदान करता है।";
    marriageReasonEn = "Harmonizes domestic peace and longevity of relationships through benefic house rulership.";
  } else {
    marriageImpact = "mixed";
    marriageEffectHi = "दशा में विवाह या संबंधों में मधुरता आ सकती है, परंतु परीक्षण के बिना पहनने पर जीवनसाथी से गलतफहमियां बढ़ सकती हैं।";
    marriageEffectEn = "Can facilitate marriage timing if running its period, but prone to minor spousal misunderstandings if over-activated.";
    marriageReasonHi = "ग्रह की दोहरी प्रकृति होने से दांपत्य पर मिश्रित प्रभाव रहता है।";
    marriageReasonEn = "Exerts dual influences on partnership dynamics requiring guarded usage.";
  }

  // 4. Health & Longevity
  let healthImpact: LifeAreaImpactType = "neutral";
  let healthEffectHi = "";
  let healthEffectEn = "";
  let healthReasonHi = "";
  let healthReasonEn = "";

  if (suitability === "prohibited") {
    healthImpact = "negative";
    healthEffectHi = "पुरानी अथवा गंभीर बीमारी का उभरना, अस्पताल में भर्ती होने की नौबत, मानसिक अशांति/डिप्रेशन, और दुर्घटना का भय।";
    healthEffectEn = "Flare-up of chronic ailments, frequent hospital visits, mental anxiety/depression, and vulnerability to accidents.";
    healthReasonHi = "षष्ठेश (रोग), अष्टमेश (संकट) अथवा मारक भाव से संबंधित होने के कारण यह रत्न शरीर की जीवन-ऊर्जा (Immunity) को आघात पहुंचाता है।";
    healthReasonEn = "By amplifying 6th (illness), 8th (vulnerability) or maraka houses, it disrupts bodily equilibrium and vitality.";
  } else if (suitability === "recommended") {
    healthImpact = "positive";
    healthEffectHi = "रोग प्रतिरोधक क्षमता (Immunity) में भारी वृद्धि, असाध्य रोगों से मुक्ति, मानसिक शांति, स्फूर्ति, और दीर्घायु।";
    healthEffectEn = "Strong physical vitality, robust immune system, recovery from persistent health issues, and enhanced longevity.";
    healthReasonHi = "लग्नेश अथवा शुभ त्रिकोणेश होने से यह शरीर के चारों ओर सकारात्मक सुरक्षा-कवच निर्मित करता है।";
    healthReasonEn = "As Lagnesh or a prime functional benefic, it reinforces the body's natural defense systems and vitality.";
  } else {
    healthImpact = "mixed";
    healthEffectHi = "सीमित समय के लिए ऊर्जा देगा, परंतु सिरहाने रखकर 3-दिवसीय परीक्षण (Trial) अनिवार्य है ताकि किसी गुप्त विकार का पता चल सके।";
    healthEffectEn = "Provides temporary vitality but demands a mandatory trial to ensure no latency of latent inflammatory or nervous reactions.";
    healthReasonHi = "ग्रह का चेष्टा बल अथवा आधिपत्य संवेदनशील है।";
    healthReasonEn = "Possesses high cheshta or sensitive lordship requiring physiological tolerance verification.";
  }

  // 5. Education & Intellect
  let eduImpact: LifeAreaImpactType = "neutral";
  let eduEffectHi = "";
  let eduEffectEn = "";
  let eduReasonHi = "";
  let eduReasonEn = "";

  if (suitability === "prohibited") {
    eduImpact = "negative";
    eduEffectHi = "पढ़ाई में अचानक एकाग्रता भंग होना, प्रतियोगी परीक्षाओं में असफलता, स्मरण शक्ति में गिरावट, और संतान संबंधी चिंताएं।";
    eduEffectEn = "Loss of academic concentration, examination setbacks, weakened memory recall, and distress concerning children.";
    eduReasonHi = "यह ग्रह पंचम (बुद्धि-संतान) भाव से प्रतिकूल षडाष्टक अथवा दुःस्थान संबंध बनाता है; अतः मानसिक भ्रम बढ़ाता है।";
    eduReasonEn = "Forms conflicting geometric angles to the 5th house of intellect, inducing cognitive distraction and educational hurdles.";
  } else if (suitability === "recommended") {
    eduImpact = "positive";
    eduEffectHi = "अध्ययन में विलक्षण एकाग्रता, प्रतियोगी परीक्षाओं में शीर्ष सफलता, कुशाग्र याददाश्त, संतान सुख, और बौद्धिक ख्याति।";
    eduEffectEn = "Exceptional mental focus, top ranks in competitive examinations, sharp analytical memory, and scholastic distinction.";
    eduReasonHi = `पंचमेश अथवा ज्ञान के नैसर्गिक कारक (${houseStrHi}) को शक्ति मिलने से जातक की प्रज्ञा व विवेक शक्ति चरम पर पहुंचती है।`;
    eduReasonEn = `Energizing the 5th/4th house axis (${houseStrEn}) unlocks higher cognitive faculties, analytical prowess, and creative excellence.`;
  } else {
    eduImpact = "mixed";
    eduEffectHi = "दशा के दौरान उच्च अध्ययन या शोध में सहायक, परंतु अनियंत्रित उपयोग से मस्तिष्क में अति-उत्तेजना या तनाव आ सकता है।";
    eduEffectEn = "Aids research and specialized learning during its cycle, though prone to mental fatigue if worn unchecked.";
    eduReasonHi = "बुद्धिकारक ग्रहों के साथ मिश्रित संबंध होने के कारण मध्यम फलदायक।";
    eduReasonEn = "Exerts conditioned influence on cognitive channels.";
  }

  // Synthesize Adverse Alert
  let adverseAlert: GemstoneAdverseAlert | undefined = undefined;
  if (suitability === "prohibited" || suitability === "conditional") {
    const harms: string[] = [];
    const harmsEn: string[] = [];
    const affected: number[] = [];

    if (ownedHouses.includes(6) || d1House === 6) {
      harms.push("कर्ज का भारी बोझ, अदालती मुकदमों में पराजय, और पेट/आंतों या रक्त विकार");
      harmsEn.push("heavy debt burden, defeat in legal battles, and gastrointestinal/blood ailments");
      affected.push(6);
    }
    if (ownedHouses.includes(8) || d1House === 8) {
      harms.push("अचानक बड़ा वित्तीय दिवालियापन, शेयर बाजार में भारी नुकसान, मानहानि, और गंभीर दुर्घटना का संकट");
      harmsEn.push("sudden insolvency, crushing investment losses, loss of social status, and acute physical hazards");
      affected.push(8);
    }
    if (ownedHouses.includes(12) || d1House === 12) {
      harms.push("अस्पताल व अदालतों में जमा-पूंजी की बर्बादी, मानसिक अवसाद (Depression), और व्यापार में लगातार घाटा");
      harmsEn.push("depletion of savings in hospitals/litigation, clinical anxiety/depression, and chronic business hemorrhaging");
      affected.push(12);
    }
    if (rulesMaraka || [2, 7].includes(d1House)) {
      harms.push("वैवाहिक संबंध टूटना/तलाक, जीवनसाथी को गंभीर रोग, और स्वयं के स्वास्थ्य में मारक कष्ट");
      harmsEn.push("marital divorce/rupture, spousal health crises, and acute maraka bodily afflictions");
      if (!affected.includes(2)) affected.push(2);
      if (!affected.includes(7)) affected.push(7);
    }
    if (rulesTrishadaya && !affected.includes(3) && !affected.includes(11)) {
      harms.push("अहंकार, गलत संगति में धन हानि, और भाई-बहनों व मित्रों से संबंध विच्छेद");
      harmsEn.push("destructive ego, squandering of wealth in toxic networks, and estrangement from siblings");
      if (ownedHouses.includes(3)) affected.push(3);
      if (ownedHouses.includes(11)) affected.push(11);
    }
    if (isCombust && SOLAR_ENEMIES.has(planet)) {
      harms.push("उच्चाधिकारियों व पिता से भयंकर टकराव, नेत्र/अस्थि विकार, और अनियंत्रित क्रोध");
      harmsEn.push("severe conflicts with government/father, bone/vision disorders, and uncontrollable rage");
    }
    if (isDebilitated) {
      harms.push("आत्मविश्वास का पतन, निर्णय क्षमता में भारी भूल, और जिस भाव में ग्रह बैठा है उसका विनाश");
      harmsEn.push("collapse of self-confidence, catastrophic errors in judgement, and ruin of the occupied house");
    }

    if (harms.length === 0) {
      harms.push("मानसिक अशांति, स्वास्थ्य विकार, और वित्तीय अस्थिरता");
      harmsEn.push("mental turmoil, vitality depletion, and volatile financial strain");
      affected.push(d1House);
    }

    const whatWillHarmHi = harms.join("; ");
    const whatWillHarmEn = harmsEn.join("; ");

    const afflictionsListHi: string[] = [];
    if (isCombust) afflictionsListHi.push("सूर्य से अस्त है");
    if (isDebilitated) afflictionsListHi.push("नीच राशि में दूषित है");
    const affStrHi = afflictionsListHi.length > 0 ? ` तथा ${afflictionsListHi.join(" व ")}` : "";

    const afflictionsListEn: string[] = [];
    if (isCombust) afflictionsListEn.push("is combust");
    if (isDebilitated) afflictionsListEn.push("is debilitated");
    const affStrEn = afflictionsListEn.length > 0 ? ` and ${afflictionsListEn.join(" & ")}` : "";

    const whyItHarmsHi = `रत्न उस ग्रह की ब्रह्मांडीय किरणों को प्रवर्धित (Amplify) करता है। चूंकि यह ग्रह कुंडली में अशुभ दुःस्थान (${houseStrHi}) का स्वामी है${affStrHi}; इसका रत्न पहनने से इन अशुभ भावों की नकारात्मक ऊर्जा जाग्रत हो जाएगी जिससे जीवन के उक्त क्षेत्र नष्ट हो सकते हैं।`;
    const whyItHarmsEn = `Gemstones act as cosmic magnifying lenses. Because this planet rules or triggers adverse houses (${houseStrEn})${affStrEn}, wearing its gemstone awakens and exponentially amplifies these destructive frequencies, resulting in direct harm to the specified life dimensions.`;

    adverseAlert = {
      whatWillHarmEn,
      whatWillHarmHi,
      whyItHarmsEn,
      whyItHarmsHi,
      affectedHouses: affected,
    };
  }

  // Synthesize Benefic Highlights
  let beneficHighlights: GemstoneBeneficHighlights | undefined = undefined;
  if (suitability === "recommended" || suitability === "conditional") {
    const gains: string[] = [];
    const gainsEn: string[] = [];
    const benefited: number[] = [];

    if (isCareerStone || ownedHouses.includes(10)) {
      gains.push("करियर में अभूतपूर्व पदोन्नति, प्रशासनिक अधिकार, व्यापार विस्तार, और समाज में उच्च पद-प्रतिष्ठा");
      gainsEn.push("monumental career promotion, executive authority, business expansion, and eminent social stature");
      benefited.push(10);
    }
    if (isLuckyStone || ownedHouses.includes(9)) {
      gains.push("सोए हुए भाग्य का उदय, ईश्वरीय कृपा, उच्च शिक्षा में सफलता, और लंबी लाभकारी यात्राएं");
      gainsEn.push("awakening of luck, divine grace, academic triumphs, and highly lucrative long journeys");
      benefited.push(9);
    }
    if (isKnowledgeStone || ownedHouses.includes(5)) {
      gains.push("कुशाग्र बुद्धि, प्रतियोगी परीक्षाओं में सर्वोच्च रैंक, संतान सुख, और रचनात्मक विवेक");
      gainsEn.push("sharp intellect, apex ranks in competitive exams, progeny bliss, and creative acumen");
      benefited.push(5);
    }
    if (isLifeStone || ownedHouses.includes(1)) {
      gains.push("शारीरिक आरोग्य, रोग प्रतिरोधक क्षमता (Immunity), व्यक्तित्व में चुंबकत्व, और दीर्घायु");
      gainsEn.push("robust physical immunity, freedom from illness, charismatic aura, and enhanced longevity");
      benefited.push(1);
    }
    if (ownedHouses.includes(2) || ownedHouses.includes(11)) {
      gains.push("स्थाई धन संचय, नियमित आय के नए स्रोत, और सभी मनोकामनाओं की पूर्ति");
      gainsEn.push("enduring capital accumulation, multiple streams of active income, and fulfillment of ambitions");
      if (ownedHouses.includes(2)) benefited.push(2);
      if (ownedHouses.includes(11)) benefited.push(11);
    }

    if (gains.length === 0) {
      gains.push("समग्र जीवन में संतुलन, सकारात्मक ऊर्जा, और आत्म-विश्वास में वृद्धि");
      gainsEn.push("all-round life equilibrium, positive aura, and self-confidence");
      benefited.push(d1House);
    }

    const whatWillFlourishHi = gains.join("; ");
    const whatWillFlourishEn = gainsEn.join("; ");

    const whyItFlourishesHi = `यह ग्रह कुंडली में परम शुभ केंद्र/त्रिकोण (${houseStrHi}) का स्वामी है। इसका रत्न इस ग्रह की सात्विक किरणों को शरीर में अवशोषित कराकर राजयोग, लक्ष्मी योग और आरोग्य को पूर्ण रूप से जाग्रत करता है।`;
    const whyItFlourishesEn = `Ruling sovereign kendra/trikona houses (${houseStrEn}), this gemstone funnels pure benefic cosmic wavelengths into the native's physiology, fully awakening Raj Yogas, Dhana Yogas, and vitality.`;

    beneficHighlights = {
      whatWillFlourishEn,
      whatWillFlourishHi,
      whyItFlourishesEn,
      whyItFlourishesHi,
      benefitedHouses: benefited,
    };
  }

  const lifeAreaImpacts: GemstoneLifeAreaImpact[] = [
    {
      area: "wealth",
      areaNameEn: "Wealth & Finance",
      areaNameHi: "धन व संपत्ति",
      impact: wealthImpact,
      effectEn: wealthEffectEn,
      effectHi: wealthEffectHi,
      astrologicalReasonEn: wealthReasonEn,
      astrologicalReasonHi: wealthReasonHi,
    },
    {
      area: "career",
      areaNameEn: "Career & Business",
      areaNameHi: "करियर व व्यवसाय",
      impact: careerImpact,
      effectEn: careerEffectEn,
      effectHi: careerEffectHi,
      astrologicalReasonEn: careerReasonEn,
      astrologicalReasonHi: careerReasonHi,
    },
    {
      area: "marriage",
      areaNameEn: "Marriage & Relationships",
      areaNameHi: "विवाह व दांपत्य",
      impact: marriageImpact,
      effectEn: marriageEffectEn,
      effectHi: marriageEffectHi,
      astrologicalReasonEn: marriageReasonEn,
      astrologicalReasonHi: marriageReasonHi,
    },
    {
      area: "health",
      areaNameEn: "Health & Longevity",
      areaNameHi: "स्वास्थ्य व आयु",
      impact: healthImpact,
      effectEn: healthEffectEn,
      effectHi: healthEffectHi,
      astrologicalReasonEn: healthReasonEn,
      astrologicalReasonHi: healthReasonHi,
    },
    {
      area: "education",
      areaNameEn: "Education & Intellect",
      areaNameHi: "शिक्षा व बुद्धि",
      impact: eduImpact,
      effectEn: eduEffectEn,
      effectHi: eduEffectHi,
      astrologicalReasonEn: eduReasonEn,
      astrologicalReasonHi: eduReasonHi,
    },
  ];

  return { lifeAreaImpacts, adverseAlert, beneficHighlights };
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

  // Trishadaya (3, 6, 11) lords - Parashara functional malefics
  const lord3 = houseLords[3];
  const lord11 = houseLords[11];
  const trishadayaLords = new Set([lord3, lord6, lord11]);

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

  // Map each planet's current Rashi for BNN (Bhrigu Nandi Nadi) 1-5-9 trines and conjunctions
  const planetRashiMap: Record<string, number> = {};
  if (kundli.planets) {
    for (const [pName, pData] of Object.entries(kundli.planets)) {
      planetRashiMap[pName] = pData.rashi; // 0 to 11
    }
  }

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

    // A. Lordship & Functional Role
    const ownedHouses = Object.entries(houseLords)
      .filter(([_, l]) => l === planet)
      .map(([h]) => Number(h));
    const rulesDusthana = ownedHouses.some(h => [6, 8, 12].includes(h));
    const rulesTrishadaya = ownedHouses.some(h => [3, 6, 11].includes(h));
    const rulesMaraka = ownedHouses.some(h => [2, 7].includes(h));

    const isLifeStone = (planet === lord1);
    const isLuckyStone = (planet === lord9);
    const isKnowledgeStone = (planet === lord5);
    const isCareerStone = (planet === lord10 || planet === yogaKaraka);
    const isYogaKarakaPlanet = (planet === yogaKaraka);
    const isBadhaka = (planet === badhakaLord);

    let d1Verdict = "";
    let d1Score = 50;

    if (isLifeStone) {
      d1Verdict = lang === "hi"
        ? `लग्नेश (प्रथम भाव स्वामी): जातक का जीवन रत्न। स्वास्थ्य, आत्मबल, दीर्घायु एवं संपूर्ण व्यक्तित्व को शक्ति प्रदान करता है।`
        : `Lagna Lord (1st House Ruler): Life Stone. Strengthens physical vitality, longevity, immune aura, and identity.`;
      d1Score += 40;
    } else if (isYogaKarakaPlanet) {
      d1Verdict = lang === "hi"
        ? `योगकारक ग्रह: केंद्र व त्रिकोण का अधिपति होने से परम राजयोगकारी। भाग्य व सफलता का प्रबल कारक।`
        : `Yogakaraka Planet: Commands both Kendra and Trikona, creating supreme Raja Yoga prosperity.`;
      d1Score += 38;
    } else if (isLuckyStone) {
      d1Verdict = lang === "hi"
        ? `भाग्येश (नवम भाव स्वामी): जातक का भाग्य रत्न। ईश्वरीय कृपा, समृद्धि, उच्च शिक्षा एवं भाग्य वृद्धि करता है।`
        : `Bhagya Lord (9th House Ruler): Lucky Stone. Activates fortune, higher wisdom, spiritual grace, and overall rise.`;
      d1Score += 32;
    } else if (isKnowledgeStone) {
      d1Verdict = lang === "hi"
        ? `पंचमेश (पंचम भाव स्वामी): पुण्य व विद्या रत्न। बुद्धि, एकाग्रता, संतान सुख और सही निर्णय लेने की क्षमता देता है।`
        : `Panchama Lord (5th House Ruler): Knowledge Stone. Boosts intellect, speculative acumen, learning, and mantra siddhi.`;
      d1Score += 28;
    } else if (isCareerStone) {
      d1Verdict = lang === "hi"
        ? `दशमेश (दशम भाव स्वामी): कार्यक्षेत्र, प्रशासनिक पद, सामाजिक प्रतिष्ठा और आजीविका का संवर्धन करता है।`
        : `10th Lord (Karma Ruler): Enhances professional authority, enterprise, and societal status.`;
      d1Score += 22;
    }

    // Check if rules 6, 8, 12 in D1
    if (rulesDusthana && !isLifeStone) {
      const ownedDusthanas = ownedHouses.filter(h => [6, 8, 12].includes(h));
      const dStr = ownedDusthanas.join(", ");
      const d1DusthanaWarning = lang === "hi"
        ? `भाव ${dStr} (त्रिक / दुःस्थान) का स्वामी है। इसका रत्न पहनने से रोग, ऋण, गुप्त शत्रु अथवा व्यय में तीव्र वृद्धि का जोखिम है।`
        : `Rules Dusthana house(s) ${dStr}. Wearing its stone risks amplifying illness, debts, litigation, or unforeseen losses.`;
      d1Verdict = d1Verdict ? `${d1Verdict} [सावधानी: ${d1DusthanaWarning}]` : d1DusthanaWarning;
      d1Score -= 45;
    }

    // Check if rules Trishadaya (3, 6, 11)
    if (rulesTrishadaya && !isLifeStone && !isLuckyStone && !isKnowledgeStone && !isYogaKarakaPlanet) {
      const tHouses = ownedHouses.filter(h => [3, 6, 11].includes(h)).join(", ");
      const trishadayaWarning = lang === "hi"
        ? `त्रिशडाय भाव (${tHouses}) का स्वामी: महर्षि पाराशर अनुसार काम/रोग/स्पर्धा का अकारक अधिपति।`
        : `Rules Trishadaya house(s) ${tHouses}: Functional malefic according to Sage Parashara.`;
      d1Verdict = d1Verdict ? `${d1Verdict} [${trishadayaWarning}]` : trishadayaWarning;
      d1Score -= 20;
    }

    // Check Badhakesh
    if (isBadhaka && !isLifeStone && !isYogaKarakaPlanet) {
      const badhakaWarning = lang === "hi"
        ? `बाधकेश (भाव ${badhakaHouse}): प्रगति में अदृश्य अड़चनें व रुकावटें ला सकता है।`
        : `Badhakesh (House ${badhakaHouse}): Potential to trigger hidden roadblocks and delays.`;
      d1Verdict = d1Verdict ? `${d1Verdict} [${badhakaWarning}]` : badhakaWarning;
      d1Score -= 15;
    }

    // Natural Rahu/Ketu considerations
    if (["Rahu", "Ketu"].includes(planet)) {
      if (lang === "hi") {
        d1Verdict = `${planet} छाया ग्रह है; इसका रत्न केवल अनुकूल उपचय भावों (3, 6, 10, 11) में होने पर अथवा विशिष्ट दशा में 3-दिवसीय परीक्षण के बाद ही सीमित समय के लिए धारण किया जाता है।`;
      } else {
        d1Verdict = `${planet} is a shadow node; its stone is strictly conditional and worn only if posited in auspicious growth houses (3, 6, 10, 11) or during active Dasha after strict trial.`;
      }
      d1Score = (d1House === 3 || d1House === 6 || d1House === 10 || d1House === 11) ? 55 : 30;
    }

    // B. Moolatrikona Lordship Analysis (Parashara Rule)
    let moolatrikonaVerdict: string | undefined = undefined;
    const mtkRashi = MOOLATRIKONA_SIGNS[planet];
    if (mtkRashi !== undefined) {
      const mtkHouse = ((mtkRashi - lagnaRashiIdx + 12) % 12) + 1;
      if ([6, 8, 12].includes(mtkHouse) && !isLifeStone) {
        moolatrikonaVerdict = lang === "hi"
          ? `⚠️ मूलत्रिकोण भाव ${mtkHouse} (त्रिक भाव): शास्त्रीय नियमानुसार ग्रह अपनी मूलत्रिकोण राशि का 75% प्राथमिक फल देता है। अतः यह शुभ भाव से अधिक रोग/ऋण/विवाद की ऊर्जा जाग्रत कर सकता है!`
          : `⚠️ Moolatrikona in House ${mtkHouse} (Dusthana): Parashara rules state a planet delivers 75% results of its Moolatrikona sign. This risks triggering illness/debts over benefic outcomes!`;
        d1Score -= 25;
      } else if ([1, 5, 9, 10].includes(mtkHouse)) {
        moolatrikonaVerdict = lang === "hi"
          ? `मूलत्रिकोण भाव ${mtkHouse} (शुभ केंद्र/त्रिकोण): ग्रह की मूल शक्ति शुभ व उन्नति प्रदायक भाव में स्थित है।`
          : `Moolatrikona in House ${mtkHouse} (Auspicious Kendra/Trikona): Planetary core energy resides in a fruitful growth sector.`;
        d1Score += 8;
      }
    }

    // C. Exaltation & Debilitation (Dignity & Cancellation)
    let dignityVerdict: string | undefined = undefined;
    const isDebilitatedInD1 = (DEBILITATION_SIGNS[planet] === d1Rashi);
    const isExaltedInD1 = (EXALTATION_SIGNS[planet] === d1Rashi);

    let neechBhang = false;
    let neechBhangDispositor = "";

    if (isDebilitatedInD1) {
      const dispName = DEBILITATION_DISPOSITORS[planet];
      const dispPos = kundli.planets ? kundli.planets[dispName] : undefined;
      const dispRashi = dispPos ? dispPos.rashi : -1;
      const dispHouseFromLagna = dispRashi >= 0 ? (((dispRashi - lagnaRashiIdx + 12) % 12) + 1) : -1;

      // Check cancellation conditions (NBRY)
      if ([1, 4, 7, 10].includes(dispHouseFromLagna)) {
        neechBhang = true;
        neechBhangDispositor = dispName;
      } else if ([1, 4, 7, 10].includes(d1House)) {
        neechBhang = true;
        neechBhangDispositor = "Kendra Bhava";
      } else if (d9?.planets && d9.planets[planet]) {
        const d9Rashi = d9.planets[planet].rashi - 1;
        if (EXALTATION_SIGNS[planet] === d9Rashi) {
          neechBhang = true;
          neechBhangDispositor = "Navamsha Exaltation";
        }
      }

      if (neechBhang) {
        dignityVerdict = lang === "hi"
          ? `⚠️ नीच भंग राजयोग (Neecha Bhanga): ग्रह नीच राशि में है परंतु नीच भंग हो रहा है। नाड़ी एवं शास्त्रीय नियम अनुसार नीच ग्रह का रत्न कभी न पहनें; इसके स्थान पर नीच-भंगकर्ता ग्रह (${neechBhangDispositor}) अथवा लग्नेश का रत्न धारण करना ही निरापद व कल्याणकारी है।`
          : `⚠️ Neecha Bhanga Raja Yoga (NBRY): Planet is debilitated but cancelled by ${neechBhangDispositor}. Classical & Nadi masters advise never wearing the debilitated gem directly; instead wear the cancellation lord (${neechBhangDispositor}) or Lagnesh.`;
        d1Score = Math.min(d1Score, 35);
      } else {
        dignityVerdict = lang === "hi"
          ? `❌ नीच राशि (Debilitated - पूर्णतः वर्जित): ग्रह नीच राशि में स्थित है और कोई नीच भंग नहीं है। रत्न एक ऊर्जा प्रवर्धक (Amplifier) है; नीच ग्रह का रत्न पहनने से उसकी विकृत, पीड़ित व अशुभ ऊर्जा कई गुना बढ़ जाएगी। यह रत्न भूलकर भी न पहनें!`
          : `❌ Debilitated without Cancellation (Neecha): Planet is debilitated. A gemstone amplifies energy; wearing a debilitated stone directly intensifies afflicted and sorrowful vibrations. Strictly prohibited!`;
        d1Score = Math.min(d1Score, 15);
      }
    } else if (isExaltedInD1) {
      if (rulesDusthana || (rulesTrishadaya && !isLifeStone) || (rulesMaraka && !isLifeStone && !isYogaKarakaPlanet)) {
        dignityVerdict = lang === "hi"
          ? `❌ उच्च राशि में मारक/त्रिक आधिपत्य: ग्रह उच्च का है परंतु भाव ${ownedHouses.join(", ")} (त्रिक/त्रिशडाय/मारक) का स्वामी है। उच्च पापी ग्रह का रत्न पहनने से रोग, शत्रु, अहंकार, दुर्घटना व अनियंत्रित संकट भड़क सकते हैं। पूर्णतः वर्जित!`
          : `❌ Exalted Malefic Lordship: Planet is exalted but commands house(s) ${ownedHouses.join(", ")} (Dusthana/Trishadaya/Maraka). Amplifying an exalted functional malefic triggers severe crises, litigation, or health shocks. Strictly prohibited!`;
        d1Score = Math.min(d1Score, 20);
      } else {
        dignityVerdict = lang === "hi"
          ? `⚠️ उच्च राशि (Exalted - 100% स्थान बल): ग्रह पहले से ही पूर्ण क्षमता पर जाग्रत है। इस पर रत्न का प्रवर्धक लगाने से अति-ऊर्जा (Hyper-activation) व अहंकार का जोखिम रहता है। रत्न अनिवार्य नहीं है; केवल विशिष्ट आवश्यकता में हल्का उपरत्न विचारणीय है।`
          : `⚠️ Exalted (Peak Positional Strength): Planet already operates at peak potency. Wearing a heavy gemstone risks hyper-activation, ego, or physiological imbalance. Primary gemstone is not mandatory; only a light Uparatna under guidance is considered.`;
        d1Score = Math.min(d1Score, 68);
      }
    }

    // D. Bhava Chalit Analysis
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

    // E. KP Krishnamurti Paddhati Analysis
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
        d1Score += 12;
      } else {
        kpVerdict = lang === "hi"
          ? `केपी उप-स्वामी ${getLocalizedPlanet(kpSubLord, lang)} द्वारा सामान्य कार्यकत्व।`
          : `KP Sub-Lord ${kpSubLord} provides neutral signification.`;
      }
    } else {
      kpVerdict = lang === "hi" ? "केपी कार्यकत्व अनुकूल।" : "KP significations standard.";
    }

    // F. Navamsha (D9) Analysis
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
        d1Score += 18;
      } else if (isExaltedInD9) {
        navamshaVerdict = lang === "hi"
          ? `नवमांश में उच्च राशि (${d9RashiName}) में स्थित है। आंतरिक बल अत्यंत सुदृढ़ है।`
          : `Exalted in Navamsha (${d9.planets[planet].rashiName}). Exceptional inner strength.`;
        d1Score += 12;
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

    // G. Combustion & Retrogression Analysis
    let combustionOrRetrograde: string | undefined = undefined;
    if (isCombust) {
      if (SOLAR_ENEMIES.has(planet)) {
        combustionOrRetrograde = lang === "hi"
          ? `❌ सूर्य के शत्रु ग्रह का अस्त दोष: ${planet} सूर्य का नैसर्गिक शत्रु है। अस्त होने पर इसका रत्न पहनने से सूर्य और ${planet} का आंतरिक युद्ध भड़कता है, जिससे शारीरिक ताप, पित्त, तनाव व कलह बढ़ सकती है।`
          : `❌ Combust Solar Enemy: ${planet} is an inimical planet to Sun. Wearing its gemstone during combustion fuels inner warfare with solar heat, risking burnout, ocular/bone distress, and friction.`;
        d1Score -= 30;
      } else if (SOLAR_FRIENDS.has(planet)) {
        if ((isLifeStone || isLuckyStone || isKnowledgeStone || isYogaKarakaPlanet) && !rulesDusthana) {
          combustionOrRetrograde = lang === "hi"
            ? `🌟 अस्त संजीवनी प्रभाव: ${planet} सूर्य का मित्र व शुभेश होकर अस्त है। इसका रत्न संजीवनी बूटी की भांति इसकी लुप्त किरणों को पुनर्जीवित कर सकता है।`
            : `🌟 Sanjeevani Combustion Revitalizer: ${planet} is a solar friend and functional benefic. Its gemstone acts as Sanjeevani to rekindle its obscured benefic light.`;
          d1Score += 5;
        } else {
          combustionOrRetrograde = lang === "hi"
            ? `अस्त एवं अकारक स्थिति: ग्रह अस्त है और शुद्ध शुभ भावों का स्वामी नहीं है। रत्न से परहेज करें।`
            : `Combust & Non-Benefic: Planet is combust and lacks pure benefic lordship. Avoid gemstone.`;
          d1Score -= 20;
        }
      } else if (planet === "Mercury") {
        const budhaDegree = pPos?.degree ?? 10;
        if (budhaDegree < 3) {
          combustionOrRetrograde = lang === "hi"
            ? `⚠️ बुध अति-अस्त (Deep Combustion < 3°): सूर्य के अत्यंत निकट होने से बुध की किरणें दग्ध हैं। कड़े परीक्षण के बाद ही पन्ना पहनें।`
            : `⚠️ Deep Mercury Combustion (< 3°): Extreme solar proximity scorches Mercury's rays. Strict trial required before wearing Emerald.`;
          d1Score -= 15;
        } else {
          combustionOrRetrograde = lang === "hi"
            ? `बुधादित्य प्रभाव: बुध सूर्य के साथ बुधादित्य योग में अनुकूल है। पन्ना धारण करना सुरक्षित है।`
            : `Budhaditya Alignment: Mercury is safely aligned with Sun in Budhaditya yoga. Emerald is auspicious.`;
          d1Score += 5;
        }
      }
    } else if (isRetrograde) {
      if (rulesDusthana || rulesTrishadaya) {
        combustionOrRetrograde = lang === "hi"
          ? `❌ वक्री पापी/अकारक ग्रह: ग्रह में अत्यधिक चेष्टा बल है परंतु यह अशुभ भावों का स्वामी है। वक्री अवस्था में इसका रत्न पहनना अचानक विपत्ति और अप्रत्याशित कर्म-दोष दे सकता है।`
          : `❌ Retrograde Malefic: Planet possesses peak Cheshta Bala but rules inauspicious houses. Wearing its gem can unleash sudden karmic shocks and unpredictable setbacks.`;
        d1Score -= 30;
      } else {
        combustionOrRetrograde = lang === "hi"
          ? `⚠️ वक्री शुभ ग्रह (अत्यधिक चेष्टा बल): ग्रह पृथ्वी के निकट होने से अत्यधिक बलवान है। इसमें शक्ति की नहीं सही दिशा की आवश्यकता होती है। रत्न केवल 21 दिन के कड़े परीक्षण (Trial) के बाद ही सीमित वजन में पहनें।`
          : `⚠️ Retrograde Benefic (Peak Cheshta Bala): Planet is already intensely potent due to Earth proximity. Gemstone should only be worn after a mandatory 21-day trial, or balanced through mantra/meditation.`;
        d1Score -= 10;
      }
    }

    // H. Bhrigu Nandi Nadi (BNN) Planetary Conjunctions & 1-5-9 Trines
    let bnnVerdict: string | undefined = undefined;
    let bnnSevereClash = false;
    const pRashi = d1Rashi;
    const trineSigns = [pRashi, (pRashi + 4) % 12, (pRashi + 8) % 12];
    const oppSign = (pRashi + 6) % 12;

    // Jupiter + Rahu (Guru-Chandal Yoga)
    if (planet === "Jupiter" && planetRashiMap["Rahu"] !== undefined) {
      const rahuRashi = planetRashiMap["Rahu"];
      if (trineSigns.includes(rahuRashi)) {
        bnnVerdict = lang === "hi"
          ? `⚠️ BNN नाड़ी चांडाल दोष: गुरु और राहु एक ही राशि अथवा 1-5-9 त्रिकोण में स्थित हैं। पुखराज पहनने से राहु का भ्रम, लालच व पाचन/लिवर कष्ट बढ़ सकता है; बिना राहु शांति के पुखराज न पहनें।`
          : `⚠️ BNN Nadi Guru-Chandal Dosha: Jupiter and Rahu share the same sign or 1-5-9 trinal axis. Wearing Yellow Sapphire without pacifying Rahu risks amplifying illusion, greed, or liver distress.`;
        d1Score -= 22;
        bnnSevereClash = true;
      }
    }

    // Rahu + Jupiter (Gomed afflicting Jeeva)
    if (planet === "Rahu" && planetRashiMap["Jupiter"] !== undefined) {
      const guruRashi = planetRashiMap["Jupiter"];
      if (trineSigns.includes(guruRashi)) {
        bnnVerdict = lang === "hi"
          ? `❌ BNN जीव-राहु टकराव: राहु जीव कारक गुरु के त्रिकोण में है। गोमेद पहनने से गुरु (जीवन शक्ति व ज्ञान) पीड़ित होगा। पूर्णतः वर्जित!`
          : `❌ BNN Jeeva-Rahu Affliction: Rahu is trined with Jeeva Karaka Jupiter. Wearing Hessonite will afflict wisdom and vital health. Strictly prohibited!`;
        d1Score -= 30;
        bnnSevereClash = true;
      }
    }

    // Saturn + Mars (Shani-Mangal Dwandwa Conflict)
    if ((planet === "Saturn" || planet === "Mars") && planetRashiMap["Saturn"] !== undefined && planetRashiMap["Mars"] !== undefined) {
      const satRashi = planetRashiMap["Saturn"];
      const marsRashi = planetRashiMap["Mars"];
      const isClashing = (satRashi === marsRashi || trineSigns.includes(planet === "Saturn" ? marsRashi : satRashi) || oppSign === (planet === "Saturn" ? marsRashi : satRashi));
      if (isClashing) {
        bnnVerdict = lang === "hi"
          ? `⚠️ BNN शनि-मंगल द्वंद्व योग: शनि और मंगल में युति/त्रिकोण/दृष्टि संबंध है (अग्नि व वायु/शीत का टकराव)। ${planet === "Mars" ? "मूँगा" : "नीलम"} पहनने से दुर्घटना, रक्त विकार या आकस्मिक कलह का जोखिम बढ़ सकता है।`
          : `⚠️ BNN Shani-Mangal Conflict: Saturn and Mars are locked in mutual conjunction, trine, or opposition (Fire vs Cold clash). Wearing ${planet === "Mars" ? "Red Coral" : "Blue Sapphire"} without prior balancing risks sudden anger, blood afflictions, or accident hazards.`;
        d1Score -= 20;
        bnnSevereClash = true;
      }
    }

    // Sun + Saturn (Surya-Shani Conflict)
    if ((planet === "Sun" || planet === "Saturn") && planetRashiMap["Sun"] !== undefined && planetRashiMap["Saturn"] !== undefined) {
      const sunRashi = planetRashiMap["Sun"];
      const satRashi = planetRashiMap["Saturn"];
      const isClashing = (sunRashi === satRashi || trineSigns.includes(planet === "Sun" ? satRashi : sunRashi) || oppSign === (planet === "Sun" ? satRashi : sunRashi));
      if (isClashing) {
        bnnVerdict = lang === "hi"
          ? `⚠️ BNN सूर्य-शनि संघर्ष: सूर्य और शनि में युति/दृष्टि संबंध है। ${planet === "Sun" ? "माणिक्य" : "नीलम"} पहनने से पिता-पुत्र में तनाव, हड्डी/नेत्र विकार अथवा उच्चाधिकारियों से विरोध भड़क सकता है।`
          : `⚠️ BNN Surya-Shani Enmity: Sun and Saturn share an antagonistic conjunction, trine, or opposition. Wearing ${planet === "Sun" ? "Ruby" : "Blue Sapphire"} fuels deep generational friction, ego clashes, or bone/eye ailments.`;
        d1Score -= 20;
        bnnSevereClash = true;
      }
    }

    // Moon + Rahu / Ketu (Chandra Grahan Yoga)
    if (planet === "Moon") {
      const rahuRashi = planetRashiMap["Rahu"];
      const ketuRashi = planetRashiMap["Ketu"];
      if ((rahuRashi !== undefined && trineSigns.includes(rahuRashi)) || (ketuRashi !== undefined && trineSigns.includes(ketuRashi))) {
        bnnVerdict = lang === "hi"
          ? `⚠️ BNN चंद्र ग्रहण दोष: चंद्रमा राहु/केतु के साथ युति अथवा 1-5-9 त्रिकोण में है। मोती धारण करने से मानसिक अशांति, भय, अवसाद या जल-तत्व विकार बढ़ सकते हैं।`
          : `⚠️ BNN Chandra Grahan Dosha: Moon is afflicted by Rahu/Ketu via conjunction or 1-5-9 trine. Wearing Pearl risks amplifying mood swings, phobias, depression, or water-retention issues.`;
        d1Score -= 25;
        bnnSevereClash = true;
      }
    }

    // Venus + Ketu (Vairagya / Relationship Disconnection)
    if (planet === "Venus" && planetRashiMap["Ketu"] !== undefined) {
      const ketuRashi = planetRashiMap["Ketu"];
      if (trineSigns.includes(ketuRashi)) {
        bnnVerdict = lang === "hi"
          ? `⚠️ BNN शुक्र-केतु संबंध: शुक्र और केतु की युति/त्रिकोण वैराग्य कारक है। हीरा पहनने से वैवाहिक संबंधों में अचानक अलगाव अथवा भोग से विरक्ति आ सकती है।`
          : `⚠️ BNN Shukra-Ketu Detachment: Venus is conjoined or trined with Ketu. Wearing Diamond can trigger unexpected emotional detachment or relationship turbulence.`;
        d1Score -= 20;
      }
    }

    // I. Ashtakavarga (BAV) Bindus Analysis
    let ashtakavargaVerdict: string | undefined = undefined;
    if (kundli.ashtakavarga?.bav) {
      const bavMap = kundli.ashtakavarga.bav as Record<string, any>;
      const pBav = bavMap[planet];
      if (pBav && Array.isArray(pBav.byRashi)) {
        const bindus = pBav.byRashi[d1Rashi];
        if (typeof bindus === "number") {
          if (bindus < 4) {
            ashtakavargaVerdict = lang === "hi"
              ? `⚠️ भिन्नाष्टकवर्ग (BAV) अल्प बल (${bindus}/8 बिंदु): ग्रह राशि में बंजर भूमि में स्थित है। रत्न पहनने पर भी इसके शुभ फल प्राप्त होने में विलंब या न्यूनता रहेगी।`
              : `⚠️ Low Ashtakavarga Bindus (${bindus}/8 in BAV): Planet sits in an infertile sign. Even with a gemstone, manifestation of fruits may remain sluggish.`;
            d1Score -= 10;
          } else if (bindus >= 5) {
            ashtakavargaVerdict = lang === "hi"
              ? `भिन्नाष्टकवर्ग (BAV) सुदृढ़ (${bindus}/8 बिंदु): ग्रह राशि में पूर्ण उर्वर व फलदायी स्थिति में है।`
              : `Strong Ashtakavarga Bindus (${bindus}/8 in BAV): Planet occupies a fertile, highly receptive sign.`;
            d1Score += 8;
          }
        }
      }
    }

    // J. Final Categorization Determination
    let category: GemstoneCategory = "conditional_dasha";
    let suitability: GemstoneSuitability = "conditional";
    let finalReason = "";

    const isLagneshEnemy = (
      (lagnaLord === "Sun" && ["Saturn", "Venus", "Rahu"].includes(planet)) ||
      (lagnaLord === "Moon" && ["Saturn", "Rahu", "Ketu"].includes(planet)) ||
      (lagnaLord === "Mars" && ["Mercury", "Saturn", "Rahu"].includes(planet)) ||
      (lagnaLord === "Mercury" && ["Mars"].includes(planet)) ||
      (lagnaLord === "Jupiter" && ["Venus", "Mercury"].includes(planet)) ||
      (lagnaLord === "Venus" && ["Sun", "Moon", "Jupiter"].includes(planet)) ||
      (lagnaLord === "Saturn" && ["Sun", "Moon", "Mars"].includes(planet))
    );

    const isStrictlyProhibited = (
      (!isLifeStone && rulesDusthana && !isYogaKarakaPlanet) ||
      (!isLifeStone && kpSignifiesDusthana && d1Score < 40) ||
      (isDebilitatedInD1 && !neechBhang) ||
      (isExaltedInD1 && (rulesDusthana || rulesTrishadaya || (rulesMaraka && !isLifeStone && !isYogaKarakaPlanet))) ||
      (isCombust && SOLAR_ENEMIES.has(planet)) ||
      (!isLifeStone && !isLuckyStone && !isKnowledgeStone && !isCareerStone && isLagneshEnemy) ||
      (!isLifeStone && rulesTrishadaya && rulesDusthana)
    );

    if (isStrictlyProhibited) {
      category = "prohibited";
      suitability = "prohibited";
      d1Score = Math.min(d1Score, 25);
      finalReason = lang === "hi"
        ? `पूर्णतः वर्जित (भूलकर भी न पहनें): यह ग्रह जन्मकुंडली में त्रिक भाव, मारक/शत्रु प्रभाव, नीच राशि अथवा गंभीर ग्रह-युद्ध/दोष से पीड़ित है। इसका रत्न पहनने से रोग, कलह, आर्थिक नुकसान अथवा दुर्घटना की आशंका प्रबल हो सकती है।`
        : `Strictly Prohibited: This planet governs Dusthana/Maraka houses, is debilitated without cancellation, or is locked in severe planetary warfare. Wearing its stone risks magnifying illness, disputes, financial loss, or sudden setbacks.`;
    } else if (
      (isLifeStone || isLuckyStone || isKnowledgeStone || isYogaKarakaPlanet) &&
      d1Score >= 60 &&
      !kpSignifiesDusthana &&
      !bnnSevereClash &&
      !isDebilitatedInD1
    ) {
      // Highly Recommended
      suitability = "recommended";
      if (isLifeStone) category = "life_stone";
      else if (isYogaKarakaPlanet || isCareerStone) category = "career_stone";
      else if (isLuckyStone) category = "lucky_stone";
      else category = "knowledge_stone";

      finalReason = lang === "hi"
        ? `शुभ एवं अत्यंत फलदायी: लग्न, भाव चलित, केपी, नवमांश और नाड़ी (BNN) नियमों द्वारा सत्यापित। यह रत्न आपके जीवन में स्वास्थ्य, भाग्य, बुद्धि और समृद्धि को तीव्र गति प्रदान करेगा।`
        : `Highly Auspicious & Recommended: Fully cross-verified across D1, Bhava Chalit, KP sub-lords, Navamsha, and Nadi (BNN) alignments. Wearing this gem unlocks longevity, fortune, intellect, and career growth.`;
    } else {
      // Conditional
      category = "conditional_dasha";
      suitability = "conditional";
      const isCurrentDashaLord = (currentMahadasha === planet);
      finalReason = lang === "hi"
        ? (isCurrentDashaLord
            ? `सशर्त अनुशंसा: वर्तमान में ${getLocalizedPlanet(planet, lang)} की महादशा सक्रिय है। 21 दिन के कड़े ट्रायल के बाद ही किसी विशिष्ट कार्य हेतु सीमित समय के लिए धारण करें।`
            : `सशर्त अनुशंसा: यह रत्न केवल विशेष ग्रह दशा अथवा ज्योतिषी परीक्षण के बाद ही सीमित समय के लिए धारण करें।`)
        : (isCurrentDashaLord
            ? `Conditional Recommendation: Currently active Mahadasha lord is ${planet}. Safe to wear during this Dasha period following a strict trial.`
            : `Conditional Recommendation: Wear only during specific planetary transits/dashas or under strict trial.`);
    }

    // Build Specifications
    const dosage = calculateDosage(meta, userWeightKg);
    const trialDays = isRetrograde ? 21 : (meta.trialDays || 3);
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
      trialPeriodDays: trialDays,
      uparatna: lang === "hi" ? meta.uparatnaHi : meta.uparatnaEn,
    };

    const timing = (suitability === "conditional" || suitability === "recommended")
      ? calculateGemstoneDashaTiming(planet, kundli, lang)
      : undefined;

    const { lifeAreaImpacts, adverseAlert, beneficHighlights } = calculateLifeAreaImpactsAndAlerts(
      planet,
      suitability,
      ownedHouses,
      d1House,
      isLifeStone,
      isLuckyStone,
      isKnowledgeStone,
      isCareerStone,
      isYogaKarakaPlanet,
      rulesDusthana,
      rulesTrishadaya,
      rulesMaraka,
      isCombust,
      isRetrograde,
      isExaltedInD1,
      isDebilitatedInD1,
      neechBhang,
      kpSignifiesDusthana,
      !kpSignifiesDusthana,
      bnnSevereClash
    );

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
        combustionOrRetrograde,
        dignityVerdict,
        bnnVerdict,
        moolatrikonaVerdict,
        ashtakavargaVerdict,
      },
      timing,
      lifeAreaImpacts,
      adverseAlert,
      beneficHighlights,
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
        if (s.detailedAnalysis.dignityVerdict) {
          md += `- **उच्च/नीच गरिमा (Dignity):** ${s.detailedAnalysis.dignityVerdict}\n`;
        }
        md += `- **भाव चलित चक्र:** ${s.detailedAnalysis.chalitVerdict}\n`;
        md += `- **केपी ज्योतिष:** ${s.detailedAnalysis.kpVerdict}\n`;
        md += `- **नवमांश (D9):** ${s.detailedAnalysis.navamshaVerdict}\n`;
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **अस्त/वक्री स्थिति:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        if (s.detailedAnalysis.bnnVerdict) {
          md += `- **भृगु नंदी नाड़ी (BNN) संबंध:** ${s.detailedAnalysis.bnnVerdict}\n`;
        }
        if (s.detailedAnalysis.moolatrikonaVerdict) {
          md += `- **मूलत्रिकोण प्रभाव:** ${s.detailedAnalysis.moolatrikonaVerdict}\n`;
        }
        if (s.detailedAnalysis.ashtakavargaVerdict) {
          md += `- **अष्टकवर्ग (BAV):** ${s.detailedAnalysis.ashtakavargaVerdict}\n`;
        }
        if (s.timing) {
          md += `- **दशा प्रभाव:** ${s.category === "life_stone" ? "लग्नेश होने से आजीवन (Lifetime) धारण कर सकते हैं।" : `${s.timing.applicableDashaHi} (${s.timing.startDate} से ${s.timing.endDate}) में विशेष फलदायी।`}\n`;
        }
        if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
          md += `\n**✨ जीवन के 5 मुख्य क्षेत्रों पर प्रभाव:**\n`;
          md += `- 💰 **धन व संपत्ति:** ${s.lifeAreaImpacts[0].effectHi}\n  ↳ *ज्योतिषीय आधार:* ${s.lifeAreaImpacts[0].astrologicalReasonHi}\n`;
          md += `- 💼 **करियर व व्यवसाय:** ${s.lifeAreaImpacts[1].effectHi}\n  ↳ *ज्योतिषीय आधार:* ${s.lifeAreaImpacts[1].astrologicalReasonHi}\n`;
          md += `- 💍 **विवाह व दांपत्य:** ${s.lifeAreaImpacts[2].effectHi}\n  ↳ *ज्योतिषीय आधार:* ${s.lifeAreaImpacts[2].astrologicalReasonHi}\n`;
          md += `- 🩺 **स्वास्थ्य व आयु:** ${s.lifeAreaImpacts[3].effectHi}\n  ↳ *ज्योतिषीय आधार:* ${s.lifeAreaImpacts[3].astrologicalReasonHi}\n`;
          md += `- 📚 **शिक्षा व बुद्धि:** ${s.lifeAreaImpacts[4].effectHi}\n  ↳ *ज्योतिषीय आधार:* ${s.lifeAreaImpacts[4].astrologicalReasonHi}\n`;
        }
        if (s.beneficHighlights) {
          md += `- **🌟 मुख्य शुभ फल (Flourishing Dimensions):** ${s.beneficHighlights.whatWillFlourishHi}\n`;
          md += `- **🔍 फल प्राप्ति का कारण:** ${s.beneficHighlights.whyItFlourishesHi}\n`;
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
        if (s.detailedAnalysis.dignityVerdict) {
          md += `- **गरिमा/दोष:** ${s.detailedAnalysis.dignityVerdict}\n`;
        }
        if (s.detailedAnalysis.bnnVerdict) {
          md += `- **नाड़ी (BNN):** ${s.detailedAnalysis.bnnVerdict}\n`;
        }
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **अस्त/वक्री:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        md += `- **चलित व केपी प्रभाव:** ${s.detailedAnalysis.chalitVerdict} | ${s.detailedAnalysis.kpVerdict}\n`;

        if (s.timing) {
          md += `- **📅 धारण समयावधि (कब से कब तक):**\n`;
          md += `  - **संबंधित दशा:** **${s.timing.applicableDashaHi}** (${s.timing.isActiveNow ? "🟢 वर्तमान में सक्रिय - Active Now" : "⏳ आगामी - Upcoming"})\n`;
          md += `  - **अवधि:** **${s.timing.startDate} से ${s.timing.endDate} तक**\n`;
          md += `  - **पहनने की सीमा:** ${s.timing.wearingWindowHi}\n`;
          md += `  - **⚠️ उतारने का नियम (Removal Protocol):** ${s.timing.removalInstructionsHi}\n`;
        }

        if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
          md += `\n**⚖️ जीवन क्षेत्रों पर प्रभाव (Life Dimension Effects):**\n`;
          md += `- 💰 **धन प्रभाव:** ${s.lifeAreaImpacts[0].effectHi}\n`;
          md += `- 💼 **करियर प्रभाव:** ${s.lifeAreaImpacts[1].effectHi}\n`;
          md += `- 💍 **विवाह प्रभाव:** ${s.lifeAreaImpacts[2].effectHi}\n`;
          md += `- 🩺 **स्वास्थ्य प्रभाव:** ${s.lifeAreaImpacts[3].effectHi}\n`;
          md += `- 📚 **शिक्षा प्रभाव:** ${s.lifeAreaImpacts[4].effectHi}\n`;
        }
        if (s.adverseAlert) {
          md += `- **⚠️ असावधानी पर संभावित नुकसान (Risk if Misused):** ${s.adverseAlert.whatWillHarmHi}\n`;
          md += `- **🔍 क्यों (Astrological Cause):** ${s.adverseAlert.whyItHarmsHi}\n`;
        }

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
      if (s.adverseAlert) {
        md += `- **🚫 क्या खराब होगा (What will be damaged / destroyed):** **${s.adverseAlert.whatWillHarmHi}**\n`;
        md += `- **🔍 क्यों खराब होगा और किसलिए (Why & Astrological Cause):** ${s.adverseAlert.whyItHarmsHi}\n`;
      }
      if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
        md += `\n**⚠️ जीवन के मुख्य क्षेत्रों पर दुष्प्रभाव (Detailed Negative Impacts):**\n`;
        md += `- 💰 **धन प्रभाव:** ${s.lifeAreaImpacts[0].effectHi}\n`;
        md += `- 💼 **करियर प्रभाव:** ${s.lifeAreaImpacts[1].effectHi}\n`;
        md += `- 💍 **विवाह प्रभाव:** ${s.lifeAreaImpacts[2].effectHi}\n`;
        md += `- 🩺 **स्वास्थ्य प्रभाव:** ${s.lifeAreaImpacts[3].effectHi}\n`;
        md += `- 📚 **शिक्षा प्रभाव:** ${s.lifeAreaImpacts[4].effectHi}\n`;
      }
      md += `\n- **शास्त्रीय दोष:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
      if (s.detailedAnalysis.dignityVerdict) {
        md += `- **उच्च/नीच दोष:** ${s.detailedAnalysis.dignityVerdict}\n`;
      }
      if (s.detailedAnalysis.bnnVerdict) {
        md += `- **नाड़ी टकराव (BNN):** ${s.detailedAnalysis.bnnVerdict}\n`;
      }
      if (s.detailedAnalysis.moolatrikonaVerdict) {
        md += `- **मूलत्रिकोण प्रभाव:** ${s.detailedAnalysis.moolatrikonaVerdict}\n`;
      }
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
    md += `**Verified Frameworks:** Rashi (D1) • Bhava Chalit • KP Sub-Lords • Navamsha (D9) • Bhrigu Nandi Nadi (BNN)\n\n`;
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
        if (s.detailedAnalysis.dignityVerdict) {
          md += `- **Dignity & Cancellation:** ${s.detailedAnalysis.dignityVerdict}\n`;
        }
        md += `- **Bhava Chalit Status:** ${s.detailedAnalysis.chalitVerdict}\n`;
        md += `- **KP System:** ${s.detailedAnalysis.kpVerdict}\n`;
        md += `- **Navamsha (D9):** ${s.detailedAnalysis.navamshaVerdict}\n`;
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **Combust / Retrograde Note:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        if (s.detailedAnalysis.bnnVerdict) {
          md += `- **Bhrigu Nandi Nadi (BNN):** ${s.detailedAnalysis.bnnVerdict}\n`;
        }
        if (s.detailedAnalysis.moolatrikonaVerdict) {
          md += `- **Moolatrikona Lordship:** ${s.detailedAnalysis.moolatrikonaVerdict}\n`;
        }
        if (s.detailedAnalysis.ashtakavargaVerdict) {
          md += `- **Ashtakavarga (BAV):** ${s.detailedAnalysis.ashtakavargaVerdict}\n`;
        }
        if (s.timing) {
          md += `- **Dasha Period:** ${s.category === "life_stone" ? "Safe for lifetime wear as Lagnesh (Life Stone)." : `Highly potent during ${s.timing.applicableDasha} (${s.timing.startDate} to ${s.timing.endDate}).`}\n`;
        }
        if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
          md += `\n**✨ Life Dimension Impacts:**\n`;
          md += `- 💰 **Wealth & Finance:** ${s.lifeAreaImpacts[0].effectEn}\n  ↳ *Astrological Cause:* ${s.lifeAreaImpacts[0].astrologicalReasonEn}\n`;
          md += `- 💼 **Career & Business:** ${s.lifeAreaImpacts[1].effectEn}\n  ↳ *Astrological Cause:* ${s.lifeAreaImpacts[1].astrologicalReasonEn}\n`;
          md += `- 💍 **Marriage & Relationships:** ${s.lifeAreaImpacts[2].effectEn}\n  ↳ *Astrological Cause:* ${s.lifeAreaImpacts[2].astrologicalReasonEn}\n`;
          md += `- 🩺 **Health & Longevity:** ${s.lifeAreaImpacts[3].effectEn}\n  ↳ *Astrological Cause:* ${s.lifeAreaImpacts[3].astrologicalReasonEn}\n`;
          md += `- 📚 **Education & Intellect:** ${s.lifeAreaImpacts[4].effectEn}\n  ↳ *Astrological Cause:* ${s.lifeAreaImpacts[4].astrologicalReasonEn}\n`;
        }
        if (s.beneficHighlights) {
          md += `- **🌟 Key Benefic Highlights (What Will Flourish):** ${s.beneficHighlights.whatWillFlourishEn}\n`;
          md += `- **🔍 Astrological Foundation:** ${s.beneficHighlights.whyItFlourishesEn}\n`;
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
        if (s.detailedAnalysis.dignityVerdict) {
          md += `- **Dignity Note:** ${s.detailedAnalysis.dignityVerdict}\n`;
        }
        if (s.detailedAnalysis.bnnVerdict) {
          md += `- **BNN Aspect:** ${s.detailedAnalysis.bnnVerdict}\n`;
        }
        if (s.detailedAnalysis.combustionOrRetrograde) {
          md += `- **Combust/Retrograde:** ${s.detailedAnalysis.combustionOrRetrograde}\n`;
        }
        md += `- **Chalit & KP Note:** ${s.detailedAnalysis.chalitVerdict} | ${s.detailedAnalysis.kpVerdict}\n`;

        if (s.timing) {
          md += `- **📅 Prescribed Wearing Window (Dasha Timeline):**\n`;
          md += `  - **Applicable Period:** **${s.timing.applicableDasha}** (${s.timing.isActiveNow ? "🟢 Currently Active" : "⏳ Upcoming"})\n`;
          md += `  - **Duration (Start to End):** **${s.timing.startDate} to ${s.timing.endDate}**\n`;
          md += `  - **Window:** ${s.timing.wearingWindow}\n`;
          md += `  - **⚠️ Removal Protocol:** ${s.timing.removalInstructions}\n`;
        }

        if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
          md += `\n**⚖️ Life Dimension Impacts:**\n`;
          md += `- 💰 **Wealth:** ${s.lifeAreaImpacts[0].effectEn}\n`;
          md += `- 💼 **Career:** ${s.lifeAreaImpacts[1].effectEn}\n`;
          md += `- 💍 **Marriage:** ${s.lifeAreaImpacts[2].effectEn}\n`;
          md += `- 🩺 **Health:** ${s.lifeAreaImpacts[3].effectEn}\n`;
          md += `- 📚 **Education:** ${s.lifeAreaImpacts[4].effectEn}\n`;
        }
        if (s.adverseAlert) {
          md += `- **⚠️ Potential Hazards if Misused:** ${s.adverseAlert.whatWillHarmEn}\n`;
          md += `- **🔍 Astrological Cause:** ${s.adverseAlert.whyItHarmsEn}\n`;
        }

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
      if (s.adverseAlert) {
        md += `- **🚫 What Will Be Damaged / Destroyed:** **${s.adverseAlert.whatWillHarmEn}**\n`;
        md += `- **🔍 Why and Astrological Rationale:** ${s.adverseAlert.whyItHarmsEn}\n`;
      }
      if (s.lifeAreaImpacts && s.lifeAreaImpacts.length >= 5) {
        md += `\n**⚠️ Adverse Impacts across Life Domains:**\n`;
        md += `- 💰 **Wealth:** ${s.lifeAreaImpacts[0].effectEn}\n`;
        md += `- 💼 **Career:** ${s.lifeAreaImpacts[1].effectEn}\n`;
        md += `- 💍 **Marriage:** ${s.lifeAreaImpacts[2].effectEn}\n`;
        md += `- 🩺 **Health:** ${s.lifeAreaImpacts[3].effectEn}\n`;
        md += `- 📚 **Education:** ${s.lifeAreaImpacts[4].effectEn}\n`;
      }
      md += `\n- **Classical Affliction:** ${s.detailedAnalysis.d1LagnaVerdict}\n`;
      if (s.detailedAnalysis.dignityVerdict) {
        md += `- **Dignity Conflict:** ${s.detailedAnalysis.dignityVerdict}\n`;
      }
      if (s.detailedAnalysis.bnnVerdict) {
        md += `- **Nadi Conflict (BNN):** ${s.detailedAnalysis.bnnVerdict}\n`;
      }
      if (s.detailedAnalysis.moolatrikonaVerdict) {
        md += `- **Moolatrikona Impact:** ${s.detailedAnalysis.moolatrikonaVerdict}\n`;
      }
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
