import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { CareerPrediction, PredictionOptions } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";
import { Language } from "../i18n/types";
import { careerI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getCareerPrediction(kundli: Kundli, options?: PredictionOptions): CareerPrediction {
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;

  // Helper to find which house a planet is located in (1 to 12)
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) {
        return h.number;
      }
    }
    return 1;
  };

  // 10th House analysis
  const house10 = houses.find((h) => h.number === 10) || houses[9] || {
    number: 10,
    rashi: 10,
    planets: [] as string[],
  };

  const tenthRashiIdx = (house10.rashi - 1 + 12) % 12;
  const tenthRashiName = rashiNames[tenthRashiIdx] || "Capricorn";
  const tenthRashiLord = RASHI_LORDS[tenthRashiIdx] || "Saturn";
  const tenthLordPlacement = getPlanetHouse(tenthRashiLord);
  const tenthSAVBindus = sav ? sav.byHouse[9] : 28;

  // 6th house (Employment/Job) vs 7th house (Business/Trade/Clients)
  const sixthSAV = sav ? sav.byHouse[5] : 28;
  const seventhSAV = sav ? sav.byHouse[6] : 28;
  const thirdSAV = sav ? sav.byHouse[2] : 28; // Enterprise & courage

  let jobScore = 50;
  let businessScore = 50;

  // Evaluate 6th vs 7th vs 3rd SAV points
  if (seventhSAV > sixthSAV + 3) {
    businessScore += 15;
    jobScore -= 10;
  } else if (sixthSAV > seventhSAV + 3) {
    jobScore += 15;
    businessScore -= 10;
  }

  if (thirdSAV >= 30) {
    businessScore += 10; // High entrepreneurial courage
  }

  // 10th lord placement influences
  if ([1, 3, 7, 10, 11].includes(tenthLordPlacement)) {
    businessScore += 12;
  }
  if ([6, 8, 12].includes(tenthLordPlacement)) {
    jobScore += 10;
  }

  // Planets influencing 10th, 7th, 3rd
  const tenthPlanets = house10.planets || [];
  if (tenthPlanets.includes("Sun") || tenthPlanets.includes("Mars")) {
    jobScore += 10; // Authority, governance, executive roles
    businessScore += 5;
  }
  if (tenthPlanets.includes("Mercury") || tenthPlanets.includes("Rahu")) {
    businessScore += 15; // Trade, software, analytics, innovation
  }
  if (tenthPlanets.includes("Jupiter")) {
    businessScore += 10;
    jobScore += 10; // Advisory, leadership
  }

  // 3rd house planets
  const house3 = houses.find((h) => h.number === 3);
  if (house3?.planets.includes("Mars") || house3?.planets.includes("Rahu")) {
    businessScore += 8; // Bold risk-taking & technical prowess
  }

  // 10th Lord in Houses 1-12 Dictionary
  const localizedLordName = getLocalizedPlanet(tenthRashiLord, lang);
  const lordDict = careerI18n.tenthLordDictionary[lang] || careerI18n.tenthLordDictionary.en;
  const tenthLordPlacementResult = (lordDict[tenthLordPlacement] || lordDict[10])(localizedLordName);

  // Pancha Mahapurusha Yoga Check
  let panchaMahapurushaYoga: string | undefined;
  const kendras = [1, 4, 7, 10];
  for (const k of kendras) {
    const h = houses.find((house) => house.number === k);
    if (!h) continue;
    const rashi = h.rashi;
    if (h.planets.includes("Mars") && ([1, 8, 10].includes(rashi))) {
      panchaMahapurushaYoga = careerI18n.panchaMahapurusha[lang]?.Ruchaka || careerI18n.panchaMahapurusha.en.Ruchaka;
    } else if (h.planets.includes("Mercury") && ([3, 6].includes(rashi))) {
      panchaMahapurushaYoga = careerI18n.panchaMahapurusha[lang]?.Bhadra || careerI18n.panchaMahapurusha.en.Bhadra;
    } else if (h.planets.includes("Jupiter") && ([4, 9, 12].includes(rashi))) {
      panchaMahapurushaYoga = careerI18n.panchaMahapurusha[lang]?.Hamsa || careerI18n.panchaMahapurusha.en.Hamsa;
    } else if (h.planets.includes("Venus") && ([2, 7, 12].includes(rashi))) {
      panchaMahapurushaYoga = careerI18n.panchaMahapurusha[lang]?.Malavya || careerI18n.panchaMahapurusha.en.Malavya;
    } else if (h.planets.includes("Saturn") && ([7, 10, 11].includes(rashi))) {
      panchaMahapurushaYoga = careerI18n.panchaMahapurusha[lang]?.Sasa || careerI18n.panchaMahapurusha.en.Sasa;
    }
  }

  // Jaimini Amatyakaraka (Career Indicator)
  const jaimini = getJaiminiKarakas(kundli, { lang });
  const amatyakarakaInsight = lang === 'hi'
    ? `जैमिनी अमात्यकारक (AmK): ${getLocalizedPlanet(jaimini.amatyakaraka.planet, lang)} (अंश ${jaimini.amatyakaraka.formattedDegree}, ${getLocalizedRashi(rashiNames.indexOf(jaimini.amatyakaraka.rashiName), lang)}, भाव ${jaimini.amatyakaraka.house}) - ${jaimini.amatyakaraka.signification}`
    : `Jaimini Amatyakaraka (AmK) is ${jaimini.amatyakaraka.planet} (at ${jaimini.amatyakaraka.formattedDegree} in ${jaimini.amatyakaraka.rashiName}, House ${jaimini.amatyakaraka.house}): ${jaimini.amatyakaraka.signification}`;

  // Dominant traits list
  const dominantTraitsList: string[] = [];

  // Digbala (Directional Strength)
  if (tenthPlanets.includes("Sun") || tenthPlanets.includes("Mars")) {
    dominantTraitsList.push(careerI18n.traits[lang]?.digbala || careerI18n.traits.en.digbala);
  }

  // Normalize scores (15 to 95)
  jobScore = Math.max(15, Math.min(95, jobScore));
  businessScore = Math.max(15, Math.min(95, businessScore));

  let rawRecommendation: 'Business & Independent Enterprise' | 'Employment / Job' | 'Hybrid / Consulting & Freelance';
  if (businessScore >= 60 && businessScore > jobScore + 5) {
    rawRecommendation = "Business & Independent Enterprise";
  } else if (jobScore >= 60 && jobScore > businessScore + 5) {
    rawRecommendation = "Employment / Job";
  } else {
    rawRecommendation = "Hybrid / Consulting & Freelance";
  }

  const recommendation = careerI18n.recommendation[lang]?.[rawRecommendation] || rawRecommendation;

  // Suitable career fields
  const fields = new Set<string>();
  const rashiName = tenthRashiName;

  if (["Aries", "Leo", "Sagittarius"].includes(rashiName)) {
    fields.add("Technology & Engineering Leadership");
    fields.add("Executive Management");
    fields.add("Strategic Planning & Operations");
  } else if (["Taurus", "Virgo", "Capricorn"].includes(rashiName)) {
    fields.add("Software Architecture & Systems");
    fields.add("Financial Engineering & Analytics");
    fields.add("Product Development & Infrastructure");
  } else if (["Gemini", "Libra", "Aquarius"].includes(rashiName)) {
    fields.add("Artificial Intelligence & Digital Platforms");
    fields.add("Consulting & High-Tech Research");
    fields.add("Media, Communications & Networking");
  } else {
    fields.add("Data Science & Deep Research");
    fields.add("Healthcare / Biomedical Tech");
    fields.add("Advisory & Human Resources");
  }

  if (tenthRashiLord === "Mercury" || tenthPlanets.includes("Mercury") || jaimini.amatyakaraka.planet === "Mercury") {
    fields.add("Fintech, E-Commerce & SaaS");
  }
  if (tenthRashiLord === "Mars" || tenthPlanets.includes("Mars") || jaimini.amatyakaraka.planet === "Mars") {
    fields.add("High-Performance Engineering & Defense Systems");
  }
  if (tenthRashiLord === "Saturn" || tenthPlanets.includes("Saturn") || jaimini.amatyakaraka.planet === "Saturn") {
    fields.add("Enterprise Architecture & Scaled Systems");
  }

  const localizedFields = Array.from(fields).map((f) => careerI18n.suitableFields[lang]?.[f] || f);

  // Leadership capacity
  let rawLeadership: 'Executive / High Authority' | 'Mid-to-Senior Leadership' | 'Individual Contributor / Specialist' =
    tenthSAVBindus >= 32
      ? "Executive / High Authority"
      : tenthSAVBindus >= 28
      ? "Mid-to-Senior Leadership"
      : "Individual Contributor / Specialist";

  const leadershipCapacity = careerI18n.leadership[lang]?.[rawLeadership] || rawLeadership;

  if (thirdSAV >= 28) {
    dominantTraitsList.push(lang === 'hi' ? "उच्च पहल क्षमता और आत्म-प्रेरित कार्यशैली" : "High initiative and self-starter drive");
  }
  if (tenthSAVBindus >= 30) {
    dominantTraitsList.push(lang === 'hi' ? "स्वाभाविक प्रशासनिक अधिकार और क्रियान्वयन दक्षता" : "Natural authority and execution prowess");
  }
  if (seventhSAV < 25) {
    dominantTraitsList.push(lang === 'hi' ? "समान साझेदारी की बजाय व्यक्तिगत उत्तरदायित्व में सर्वश्रेष्ठ प्रदर्शन" : "Works best with solo accountability rather than equal partnerships");
  }
  if (sixthSAV >= 28) {
    dominantTraitsList.push(lang === 'hi' ? "प्रतिस्पर्धात्मक चुनौतियों और विरोधियों पर विजय पाने की उच्च क्षमता" : "High resilience in overcoming competitive hurdles");
  }

  const strategicAdvice: string[] = [];
  if (rawRecommendation === "Business & Independent Enterprise") {
    strategicAdvice.push(lang === 'hi' ? "आपकी कुंडली स्वतंत्र उद्यम और विशिष्ट ज्ञान के मुद्रीकरण के अनुकूल है।" : "Your chart favors direct ownership and monetizing specialized knowledge.");
    if (seventhSAV < 25) {
      strategicAdvice.push(lang === 'hi' ? "50-50 की अनौपचारिक साझेदारी से बचें। मुख्य स्वामित्व व स्पष्ट कानूनी अनुबंध रखें।" : "Avoid 50-50 partnerships. Maintain primary ownership and clear legal contracts.");
    }
  } else if (rawRecommendation === "Employment / Job") {
    strategicAdvice.push(lang === 'hi' ? "व्यवस्थित कॉरपोरेट संरचना पर ध्यान दें जहाँ प्रदर्शन पर त्वरित पदोन्नति मिले।" : "Focus on structured corporate hierarchy where performance is rewarded with fast promotions.");
  } else {
    strategicAdvice.push(lang === 'hi' ? "हाइब्रिड मॉडल अपनाएं: उच्च-आय विशेषज्ञ भूमिकाओं से शुरू कर स्वतंत्र परामर्श या उत्पाद स्वामित्व की ओर बढ़ें।" : "Build a hybrid model: Start with high-income specialist roles, then transition to independent consulting or product ownership.");
  }

  const chalit = getChalitAnalysis(kundli, { lang });
  const kp = getKpAnalysis(kundli, { lang });
  const lalKitab = getLalKitabAnalysis(kundli, { lang });

  const chalitInsight = chalit.keyBhavaInsights.find((i: string) => i.includes("10th") || i.includes("दशम")) ||
    (lang === 'hi' ? "चलित चक्र में दशम भाव मूल कार्यक्षेत्र दिशा को सुदृढ़ करता है।" : "Chalit 10th Bhava reinforces core career direction.");
  const kpInsight = kp.careerCusp10.significationVerdict;
  const lalKitabInsight = lang === 'hi'
    ? `लाल किताब: टेवा ${lalKitab.tevaType} है। किस्मत का ग्रह (${getLocalizedPlanet(lalKitab.kismatKaGrah.planet, lang)}) भाव ${lalKitab.kismatKaGrah.house} में करियर विस्तार को गति देता है।`
    : `Lal Kitab: Teva is ${lalKitab.tevaType}. Destiny Awakener (${lalKitab.kismatKaGrah.planet}) in House ${lalKitab.kismatKaGrah.house} powers professional expansion.`;

  return {
    recommendation,
    jobScore,
    businessScore,
    dominantTraits: dominantTraitsList,
    suitableFields: localizedFields,
    tenthHouseDetails: {
      rashi: getLocalizedRashi(tenthRashiIdx, lang),
      rashiLord: localizedLordName,
      lordPlacementHouse: tenthLordPlacement,
      planetsIn10th: tenthPlanets.map(p => getLocalizedPlanet(p, lang)),
      savBindus: tenthSAVBindus,
    },
    leadershipCapacity,
    strategicAdvice,
    tenthLordPlacementResult,
    amatyakarakaInsight,
    panchaMahapurushaYoga,
    chalitInsight,
    kpInsight,
    lalKitabInsight,
  };
}
