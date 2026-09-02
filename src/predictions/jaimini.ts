import { Kundli } from "../kundli/types";
import { KarakaInfo, JaiminiKarakas, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { jaiminiI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";
import { rashiNames } from "../core/constants";

/**
 * Calculates 7 Jaimini Chara Karakas based on descending degrees (0° - 30°)
 * of the 7 main physical bodies: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.
 *
 * @param kundli Complete Janam Kundli
 * @param options Optional prediction options (e.g. { lang: 'hi' })
 * @returns JaiminiKarakas object with detailed real-world significations
 */
export function getJaiminiKarakas(kundli: Kundli, options?: PredictionOptions): JaiminiKarakas {
  const lang: Language = options?.lang || 'en';
  const planets = kundli.planets || {};
  const houses = kundli.houses || [];

  const eligiblePlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };

  const planetDegrees: {
    planet: string;
    degInSign: number;
    rashiName: string;
    house: number;
  }[] = [];

  for (const pName of eligiblePlanets) {
    const p = planets[pName];
    if (p) {
      const degInSign = (p.degree ?? 0) + (p.minute ?? 0) / 60 + (p.second ?? 0) / 3600;
      const rIdx = p.rashi ? p.rashi - 1 : (rashiNames.indexOf(p.rashiName || "") >= 0 ? rashiNames.indexOf(p.rashiName || "") : 0);
      planetDegrees.push({
        planet: pName,
        degInSign,
        rashiName: getLocalizedRashi(rIdx, lang),
        house: getPlanetHouse(pName),
      });
    }
  }

  // Sort descending by degree in sign (highest degree = AK)
  planetDegrees.sort((a, b) => b.degInSign - a.degInSign);

  const formatDeg = (deg: number): string => {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.round(((deg - d) * 60 - m) * 60);
    return `${d}° ${m}' ${s}"`;
  };

  const roles = [
    { key: "atmakaraka", i18nKey: "Atmakaraka", titleEn: "Atmakaraka (AK - Soul Planet)", defaultSigEn: "Represents the soul's deepest longing, spiritual lessons, and primary life mission." },
    { key: "amatyakaraka", i18nKey: "Amatyakaraka", titleEn: "Amatyakaraka (AmK - Career & High Office)", defaultSigEn: "Dictates the native's career trajectory, natural vocational talent, and leadership authority." },
    { key: "bhratrikaraka", i18nKey: "Bhratrikaraka", titleEn: "Bhratrikaraka (BK - Guru & Guides)", defaultSigEn: "Signifies mentors, spiritual guides, brothers, and sources of profound wisdom." },
    { key: "matrikaraka", i18nKey: "Matrikaraka", titleEn: "Matrikaraka (MK - Mother & Foundation)", defaultSigEn: "Signifies motherly bonds, ancestral properties, conveyances, and inner emotional grounding." },
    { key: "putrakaraka", i18nKey: "Putrakaraka", titleEn: "Putrakaraka (PK - Creative Intellect)", defaultSigEn: "Governs intelligence, strategic vision, creative endeavors, and legacy/children." },
    { key: "gnatikaraka", i18nKey: "Gnatikaraka", titleEn: "Gnatikaraka (GK - Competitors & Hurdles)", defaultSigEn: "Represents rivals, competitive exams, legal challenges, and areas demanding perseverance." },
    { key: "darakaraka", i18nKey: "Darakaraka", titleEn: "Darakaraka (DK - Spouse & Partnerships)", defaultSigEn: "Directly reveals the spouse's appearance, core personality, social background, and marital chemistry." },
  ];

  // Specific significations when planet acts as Amatyakaraka (Career)
  const getAmKSignification = (planet: string): string => {
    if (lang === 'hi') {
      switch (planet) {
        case "Sun": return "उच्च प्रशासनिक अधिकार, शासन सत्ता, नीति-निर्माण और नेतृत्व क्षमता।";
        case "Moon": return "सार्वजनिक संबंध, रचनात्मक क्षेत्र, स्वास्थ्य सेवा, जनसंपर्क और अंतरराष्ट्रीय व्यापार।";
        case "Mars": return "इंजीनियरिंग, तकनीकी आर्किटेक्चर, रियल एस्टेट, सुरक्षा और त्वरित निर्णय कौशल।";
        case "Mercury": return "सूचना प्रौद्योगिकी, डेटा एनालिटिक्स, मीडिया, ई-कॉमर्स और बौद्धिक वाणिज्य।";
        case "Jupiter": return "रणनीतिक परामर्श, न्याय/विधि, वित्तीय संस्थाएं, शिक्षा और संस्थागत नेतृत्व।";
        case "Venus": return "डिजिटल डिजाइन, प्रीमियम ब्रांडिंग, कला, मीडिया और सुरुचिपूर्ण व्यवसाय।";
        case "Saturn": return "बड़े पैमाने के बुनियादी ढांचे, संचालन प्रबंधन, उद्योग और दीर्घकालिक व्यवस्था निर्माण।";
        default: return "विशिष्ट व्यावसायिक विशेषज्ञता एवं नेतृत्व दायित्व।";
      }
    }
    switch (planet) {
      case "Sun": return "Executive authority, administrative power, governance, politics, or visionary leadership.";
      case "Moon": return "Public dealings, creative industries, healthcare, hospitality, psychological consulting, and international commerce.";
      case "Mars": return "Engineering, high-tech systems, software architecture, military/police, real estate, and surgical precision.";
      case "Mercury": return "Information technology, software development, data analytics, media, e-commerce, and high-frequency trading.";
      case "Jupiter": return "Strategic advisory, judicial/legal systems, banking, education, venture capital, and institutional leadership.";
      case "Venus": return "Digital design, luxury branding, media/entertainment, architecture, diplomacy, and high-end consumer products.";
      case "Saturn": return "Mass-scale infrastructure, enterprise operations, mining, legal administration, and long-horizon engineering.";
      default: return "Distinctive vocational expertise with leadership responsibility.";
    }
  };

  // Specific significations when planet acts as Darakaraka (Spouse)
  const getDKSignification = (planet: string): string => {
    if (lang === 'hi') {
      switch (planet) {
        case "Sun": return "जीवनसाथी स्वाभिमानी, नेतृत्वकारी, आत्मविश्वासी और सम्मानित परिवार से संबंधित।";
        case "Moon": return "जीवनसाथी भावनात्मक, संवेदनशील, सुंदर, सौम्य और अत्यंत स्नेही।";
        case "Mars": return "जीवनसाथी ऊर्जावान, दृढ़निश्चयी, महत्वाकांक्षी और स्वतंत्र विचारों वाला।";
        case "Mercury": return "जीवनसाथी युवा सोच, तीव्र बुद्धि, विनोदप्रिय और संवाद में अत्यंत कुशल।";
        case "Jupiter": return "जीवनसाथी धार्मिक, गुणवान, विवेकशील, गरिमामयी और श्रेष्ठ संस्कारों वाला।";
        case "Venus": return "जीवनसाथी आकर्षक, कलाप्रिय, सुरुचिपूर्ण, सौम्य और स्नेहपूर्ण।";
        case "Saturn": return "जीवनसाथी गंभीर, कर्तव्यनिष्ठ, व्यावहारिक, अनुशासित और समर्पित।";
        default: return "जीवनसाथी जातक को संतुलित जीवन व आध्यात्मिक सहयोग प्रदान करता है।";
      }
    }
    switch (planet) {
      case "Sun": return "Spouse possesses dignified presence, leadership qualities, self-respect, and hails from a respectable/authoritative family.";
      case "Moon": return "Spouse is emotionally nurturing, attractive, fair or glowing complexion, intuitive, and loving.";
      case "Mars": return "Spouse is athletic, energetic, highly ambitious, frank in speech, and possesses strong independent will.";
      case "Mercury": return "Spouse is youthful, witty, highly intelligent, skilled in communication/tech, and loves lively conversation.";
      case "Jupiter": return "Spouse is virtuous, dignified, wise, spiritually inclined, supportive, and holds noble family values.";
      case "Venus": return "Spouse is aesthetically appealing, artistic, charming, graceful, loving luxury, and affectionate.";
      case "Saturn": return "Spouse is mature, hardworking, highly responsible, pragmatic, grounded, and takes duties seriously.";
      default: return "Partner brings balanced karmic support to the native.";
    }
  };

  const results: any = {};

  for (let i = 0; i < roles.length; i++) {
    const item = planetDegrees[i] || planetDegrees[planetDegrees.length - 1];
    const roleMeta = jaiminiI18n[lang]?.[roles[i].i18nKey];
    const title = roleMeta?.title || roles[i].titleEn;
    const defaultSig = roleMeta?.signification || roles[i].defaultSigEn;
    let customSig = defaultSig;

    const localizedP = getLocalizedPlanet(item.planet, lang);

    if (roles[i].key === "amatyakaraka") {
      customSig = lang === 'hi'
        ? `${defaultSig} ${localizedP} द्वारा संचालित: ${getAmKSignification(item.planet)}`
        : `${defaultSig} Driven by ${item.planet}: ${getAmKSignification(item.planet)}`;
    } else if (roles[i].key === "darakaraka") {
      customSig = lang === 'hi'
        ? `${defaultSig} ${localizedP} के प्रभाव से: ${getDKSignification(item.planet)}`
        : `${defaultSig} Governed by ${item.planet}: ${getDKSignification(item.planet)}`;
    }

    results[roles[i].key] = {
      planet: item.planet,
      degreeInSign: Math.round(item.degInSign * 1000) / 1000,
      formattedDegree: formatDeg(item.degInSign),
      rashiName: item.rashiName,
      house: item.house,
      role: title,
      signification: customSig,
    };
  }

  return results as JaiminiKarakas;
}
