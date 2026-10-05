import { predictionDate, validatePredictionChart } from "./validation";
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
  validatePredictionChart(kundli);
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

  // D10 Dashamsha Analysis
  let d10Insight: string | undefined;
  if (kundli.vargas?.D10) {
    const d10Asc = kundli.vargas.D10.ascendant;
    const d10H10 = kundli.vargas.D10.houses?.find((h: any) => h.number === 10);
    const d10AscRashi = d10Asc ? rashiNames[(d10Asc.rashi - 1 + 12) % 12] : "";
    const d10PlanetsIn10 = d10H10?.planets || [];
    d10Insight = lang === 'hi'
      ? `दशांश (D10) चक्र विश्लेषण: दशमांश लग्न ${d10AscRashi} है एवं कर्म भाव में ${d10PlanetsIn10.length > 0 ? d10PlanetsIn10.join(", ") : "शुभ दृष्टि"} स्थित है। यह सार्वजनिक क्षेत्र व उद्यम में दीर्घकालिक स्थायित्व की पुष्टि करता है।`
      : `Dashamsha (D10) Career Confirmation: D10 Ascendant in ${d10AscRashi} with 10th house activated by ${d10PlanetsIn10.length > 0 ? d10PlanetsIn10.join(", ") : "auspicious planetary aspects"}, cementing long-term professional stature.`;
  }

  // Karakamsha (Navamsha of Atmakaraka)
  let karakamshaInsight: string | undefined;
  const akPlanet = jaimini.atmakaraka.planet;
  const akNavamshaRashi = kundli.vargas?.D9?.planets?.[akPlanet]?.rashi;
  if (akNavamshaRashi) {
    const karakamshaName = rashiNames[(akNavamshaRashi - 1 + 12) % 12];
    karakamshaInsight = lang === 'hi'
      ? `कारकांश लग्न: आत्मकारक ${getLocalizedPlanet(akPlanet, lang)} नवमांश में ${karakamshaName} राशि में स्थित होकर आत्मा के वास्तविक कार्यक्षेत्र, रचनात्मक स्वाभाविकता एवं उच्च उद्देश्य को उजागर करते हैं।`
      : `Karakamsha Lagna: Atmakaraka ${akPlanet} sits in ${karakamshaName} in Navamsha (D9), defining your soul's authentic vocation, intuitive craft, and highest karmic contribution.`;
  }

  // Arudha Pada Analysis (AL & A10)
  let arudhaInsight: string | undefined;
  const alPada = kundli.arudhaPadas?.a1_al || kundli.arudhaPadas?.all?.find((p: any) => p.houseNumber === 1);
  const a10Pada = kundli.arudhaPadas?.a10 || kundli.arudhaPadas?.all?.find((p: any) => p.houseNumber === 10);
  if (alPada || a10Pada) {
    arudhaInsight = lang === 'hi'
      ? `आरूढ़ विश्लेषण: आरूढ़ लग्न (AL - जनधारणा) ${alPada?.rashiName || ""} में एवं राज्य पद (A10 - कार्यक्षेत्र प्रतिष्ठा) ${a10Pada?.rashiName || ""} में स्थित है। यह समाज में आपकी व्यावसायिक छवि को प्रभावशाली बनाता है।`
      : `Arudha Analysis: Arudha Lagna (AL - Public Persona) in ${alPada?.rashiName || ""} and Rajya Pada (A10 - Executive Status) in ${a10Pada?.rashiName || ""} bestow high peer prestige and career visibility.`;
  }

  // Government Job / Executive Authority Likelihood
  let govScore = 35;
  const sunHouse = getPlanetHouse("Sun");
  const marsHouse = getPlanetHouse("Mars");
  const jupHouse = getPlanetHouse("Jupiter");

  if ([1, 10].includes(sunHouse)) govScore += 25;
  if ([1, 10].includes(marsHouse)) govScore += 18;
  if ([9, 10].includes(jupHouse)) govScore += 15;
  if (tenthPlanets.includes("Sun") || tenthPlanets.includes("Mars")) govScore += 15;
  if ([1, 5, 9].includes(house10.rashi)) govScore += 10; // Fire sign in 10th

  govScore = Math.max(15, Math.min(95, govScore));
  let govLikelihood: 'High' | 'Moderate' | 'Low' = 'Moderate';
  if (govScore >= 75) govLikelihood = 'High';
  else if (govScore >= 50) govLikelihood = 'Moderate';
  else govLikelihood = 'Low';

  const govDescription = lang === 'hi'
    ? `सरकारी सेवा / उच्च प्रशासनिक प्राधिकार की संभावना: ${govLikelihood} (${govScore}/100)। ${govScore >= 75 ? 'सूर्य और मंगल का दशम भाव से सशक्त संबंध राजकार्य, सिविल सेवा या पीएसयू में उच्च पद का सशक्त योग बनाता है।' : 'कॉरपोरेट नेतृत्व, बहुराष्ट्रीय उद्यम अथवा स्वतंत्र परामर्श में अधिक त्वरित सफलता मिलेगी।'}`
    : `Public Sector / Civil Services / Executive Authority Aptitude: ${govLikelihood} (${govScore}/100). ${govScore >= 75 ? 'Sun and Mars synergy with the 10th house creates an illustrious signature for government, civil service, or sovereign public institutions.' : 'Private corporate hierarchies, global tech firms, or independent enterprise offer faster upward mobility.'}`;

  const growthVelocity = tenthSAVBindus >= 32
    ? (lang === 'hi' ? "द्रुतगति एवं तीव्र घातीय वृद्धि (Fast-Paced & Exponential)" : "Fast-Paced & Exponential")
    : tenthSAVBindus >= 28
    ? (lang === 'hi' ? "उच्च प्रक्षेपवक्र एवं निरंतर चक्रवृद्धि विकास (High-Trajectory & Compounding)" : "High-Trajectory & Compounding")
    : (lang === 'hi' ? "क्रमिक एवं परिपक्वता उपरांत स्थायी विकास (Progressive with Mature Zenith)" : "Progressive with Mature Zenith");

  const peakCareerAgeWindows = tenthSAVBindus >= 30
    ? (lang === 'hi' ? ["26 - 32 वर्ष (त्वरित पदोन्नति)", "35 - 46 वर्ष (कार्यकारी सत्ता)"] : ["Ages 26 - 32 (Rapid Ascension)", "Ages 35 - 46 (Executive Zenith)"])
    : (lang === 'hi' ? ["28 - 34 वर्ष (व्यावसायिक स्थायित्व)", "38 - 50 वर्ष (वरिष्ठ नेतृत्व)"] : ["Ages 28 - 34 (Domain Establishment)", "Ages 38 - 50 (Senior Leadership)"]);

  const growthFactors: string[] = [];
  if (tenthSAVBindus >= 30) growthFactors.push(lang === 'hi' ? `दशम भाव अष्टकवर्ग (${tenthSAVBindus} बिंदु) उच्च प्रशासनिक सहनशीलता देता है।` : `10th House Ashtakavarga (${tenthSAVBindus} bindus) empowers executive resilience.`);
  if (tenthPlanets.length > 0) growthFactors.push(lang === 'hi' ? `दशम भाव में ${tenthPlanets.join(", ")} की उपस्थिति कर्म को गति प्रदान करती है।` : `10th house occupants (${tenthPlanets.join(", ")}) power career momentum.`);
  if ([1, 4, 7, 10, 5, 9, 11].includes(tenthLordPlacement)) growthFactors.push(lang === 'hi' ? `दशमेश का भाव ${tenthLordPlacement} में संस्थित होना निरंतर उन्नति कराता है।` : `10th Lord placed in House ${tenthLordPlacement} triggers continuous advancement.`);
  if (growthFactors.length === 0) growthFactors.push(lang === 'hi' ? "अनुशासित कार्यशैली और निरंतर कौशल उन्नयन।" : "Disciplined execution and continuous skill advancement.");

  const careerGrowthTrajectory = {
    growthVelocity,
    peakCareerAgeWindows,
    growthFactors,
  };

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
    d10Insight,
    karakamshaInsight,
    arudhaInsight,
    governmentJobLikelihood: {
      likelihood: govLikelihood,
      score: govScore,
      description: govDescription,
    },
    careerGrowthTrajectory,
  };
}
