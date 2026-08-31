import { Kundli } from "../kundli/types";
import { KarakaInfo, JaiminiKarakas } from "./types";

/**
 * Calculates 7 Jaimini Chara Karakas based on descending degrees (0° - 30°)
 * of the 7 main physical bodies: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn.
 *
 * @param kundli Complete Janam Kundli
 * @returns JaiminiKarakas object with detailed real-world significations
 */
export function getJaiminiKarakas(kundli: Kundli): JaiminiKarakas {
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
      planetDegrees.push({
        planet: pName,
        degInSign,
        rashiName: p.rashiName || "Aries",
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
    { key: "atmakaraka", title: "Atmakaraka (AK - Soul Planet)", defaultSig: "Represents the soul's deepest longing, spiritual lessons, and primary life mission." },
    { key: "amatyakaraka", title: "Amatyakaraka (AmK - Career & High Office)", defaultSig: "Dictates the native's career trajectory, natural vocational talent, and leadership authority." },
    { key: "bhratrikaraka", title: "Bhratrikaraka (BK - Guru & Guides)", defaultSig: "Signifies mentors, spiritual guides, brothers, and sources of profound wisdom." },
    { key: "matrikaraka", title: "Matrikaraka (MK - Mother & Foundation)", defaultSig: "Signifies motherly bonds, ancestral properties, conveyances, and inner emotional grounding." },
    { key: "putrakaraka", title: "Putrakaraka (PK - Creative Intellect)", defaultSig: "Governs intelligence, strategic vision, creative endeavors, and legacy/children." },
    { key: "gnatikaraka", title: "Gnatikaraka (GK - Competitors & Hurdles)", defaultSig: "Represents rivals, competitive exams, legal challenges, and areas demanding perseverance." },
    { key: "darakaraka", title: "Darakaraka (DK - Spouse & Partnerships)", defaultSig: "Directly reveals the spouse's appearance, core personality, social background, and marital chemistry." },
  ];

  // Specific significations when planet acts as Amatyakaraka (Career)
  const getAmKSignification = (planet: string): string => {
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
    let customSig = roles[i].defaultSig;

    if (roles[i].key === "amatyakaraka") {
      customSig = `${roles[i].defaultSig} Driven by ${item.planet}: ${getAmKSignification(item.planet)}`;
    } else if (roles[i].key === "darakaraka") {
      customSig = `${roles[i].defaultSig} Governed by ${item.planet}: ${getDKSignification(item.planet)}`;
    }

    results[roles[i].key] = {
      planet: item.planet,
      degreeInSign: Math.round(item.degInSign * 1000) / 1000,
      formattedDegree: formatDeg(item.degInSign),
      rashiName: item.rashiName,
      house: item.house,
      role: roles[i].title,
      signification: customSig,
    };
  }

  return results as JaiminiKarakas;
}
