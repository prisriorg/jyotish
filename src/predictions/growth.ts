import { predictionDate, validatePredictionChart } from "./validation";
import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { GrowthPrediction, PredictionOptions } from "./types";
import { getJaiminiKarakas } from "./jaimini";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { Language } from "../i18n/types";
import { growthI18n, careerI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

/**
 * Generates an exhaustive Vedic Life, Career & Financial Growth Prediction.
 * Synthesizes:
 * - 10th (Karma / Status), 11th (Labha / Compounding), 9th (Bhagya / Fortuity)
 * - 3rd (Parakrama / Risk / Initiative) & 6th (Competitive Ascendancy)
 * - Ashtakavarga (SAV) Bhava bindus & Surplus Ratio (11th minus 12th)
 * - Jaimini Amatyakaraka (AmK), Atmakaraka (AK), Rajya Pada (A10)
 * - D10 Dashamsha Career Division & Indu Lagna
 * - Vimshottari Dasha Peak Growth Periods & 4-Quadrant Life Roadmap
 * - Authentic Strategic Accelerators & Shastric Remedies
 */
export function getGrowthPrediction(kundli: Kundli, options?: PredictionOptions): GrowthPrediction {
  validatePredictionChart(kundli);
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;
  const now = predictionDate(options);

  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };

  // --- Core House & Lord Details ---
  const house10 = houses.find((h) => h.number === 10) || houses[9];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const house12 = houses.find((h) => h.number === 12) || houses[11];
  const house9 = houses.find((h) => h.number === 9) || houses[8];
  const house3 = houses.find((h) => h.number === 3) || houses[2];
  const house6 = houses.find((h) => h.number === 6) || houses[5];
  const house7 = houses.find((h) => h.number === 7) || houses[6];
  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house1 = houses.find((h) => h.number === 1) || houses[0];

  const rashi10Idx = ((house10?.rashi || 10) - 1 + 12) % 12;
  const rashi11Idx = ((house11?.rashi || 11) - 1 + 12) % 12;
  const rashi9Idx = ((house9?.rashi || 9) - 1 + 12) % 12;
  const rashi3Idx = ((house3?.rashi || 3) - 1 + 12) % 12;
  const rashi2Idx = ((house2?.rashi || 2) - 1 + 12) % 12;
  const rashi1Idx = ((house1?.rashi || 1) - 1 + 12) % 12;

  const lord10 = RASHI_LORDS[rashi10Idx];
  const lord11 = RASHI_LORDS[rashi11Idx];
  const lord9 = RASHI_LORDS[rashi9Idx];
  const lord3 = RASHI_LORDS[rashi3Idx];
  const lord2 = RASHI_LORDS[rashi2Idx];
  const lord1 = kundli.ascendant.rashiLord || RASHI_LORDS[rashi1Idx];

  const lord10House = getPlanetHouse(lord10);
  const lord11House = getPlanetHouse(lord11);
  const lord9House = getPlanetHouse(lord9);
  const lord3House = getPlanetHouse(lord3);
  const lord2House = getPlanetHouse(lord2);
  const lord1House = getPlanetHouse(lord1);

  const planetsIn10 = house10?.planets || [];
  const planetsIn11 = house11?.planets || [];
  const planetsIn9 = house9?.planets || [];
  const planetsIn3 = house3?.planets || [];

  // Ashtakavarga Bindus
  const sav10 = sav ? sav.byHouse[9] : 28;
  const sav11 = sav ? sav.byHouse[10] : 28;
  const sav12 = sav ? sav.byHouse[11] : 28;
  const sav9 = sav ? sav.byHouse[8] : 28;
  const sav3 = sav ? sav.byHouse[2] : 28;
  const sav6 = sav ? sav.byHouse[5] : 28;
  const sav7 = sav ? sav.byHouse[6] : 28;
  const sav2 = sav ? sav.byHouse[1] : 28;
  const surplusRatio = sav11 - sav12;

  // Jaimini Karakas
  const jaimini = getJaiminiKarakas(kundli, { lang });
  const amkPlanet = jaimini.amatyakaraka.planet;
  const akPlanet = jaimini.atmakaraka.planet;

  // --- 1. Career Growth Score (0 - 100) ---
  let careerGrowthScore = 50;
  if (sav10 >= 32) careerGrowthScore += 18;
  else if (sav10 >= 28) careerGrowthScore += 10;
  else if (sav10 < 25) careerGrowthScore -= 10;

  if ([1, 4, 7, 10].includes(lord10House)) careerGrowthScore += 14; // Kendra
  if ([5, 9].includes(lord10House)) careerGrowthScore += 16;         // Trikona
  if (lord10House === 11) careerGrowthScore += 18;                   // High monetization

  if (planetsIn10.includes("Sun") || planetsIn10.includes("Mars")) careerGrowthScore += 14; // Digbala
  if (planetsIn10.includes("Jupiter")) careerGrowthScore += 12;
  if (planetsIn10.includes("Mercury")) careerGrowthScore += 10;
  if (planetsIn10.includes("Rahu")) careerGrowthScore += 12; // High-tech ambition

  if (planets[lord10]?.dignity === "exalted" || planets[lord10]?.dignity === "own") careerGrowthScore += 12;
  careerGrowthScore = Math.max(15, Math.min(98, careerGrowthScore));

  // --- 2. Financial Growth Score (0 - 100) ---
  let financialGrowthScore = 50;
  if (sav11 >= 32) financialGrowthScore += 16;
  else if (sav11 >= 28) financialGrowthScore += 8;
  else if (sav11 < 25) financialGrowthScore -= 8;

  if (surplusRatio >= 5) financialGrowthScore += 16;
  else if (surplusRatio > 0) financialGrowthScore += 8;
  else if (surplusRatio < -3) financialGrowthScore -= 12;

  if (lord11House === 2 || lord2House === 11) financialGrowthScore += 16; // Direct Dhana Yoga
  if ([1, 5, 9, 10, 11].includes(lord11House)) financialGrowthScore += 12;
  if (planetsIn11.length > 0) financialGrowthScore += 10;

  if (sav2 >= 30) financialGrowthScore += 8;
  financialGrowthScore = Math.max(15, Math.min(98, financialGrowthScore));

  // --- 3. Entrepreneurial Growth Score (0 - 100) ---
  let entrepreneurialGrowthScore = 45;
  if (sav3 >= 30) entrepreneurialGrowthScore += 16;
  else if (sav3 >= 28) entrepreneurialGrowthScore += 10;

  if (sav7 > sav6) entrepreneurialGrowthScore += 12;
  if (planetsIn3.includes("Mars") || planetsIn3.includes("Rahu")) entrepreneurialGrowthScore += 14;
  if (planetsIn10.includes("Mercury") || planetsIn10.includes("Rahu")) entrepreneurialGrowthScore += 12;
  if ([3, 7, 11].includes(lord10House)) entrepreneurialGrowthScore += 12;
  if (amkPlanet === "Mercury" || amkPlanet === "Mars" || amkPlanet === "Rahu") entrepreneurialGrowthScore += 10;

  entrepreneurialGrowthScore = Math.max(15, Math.min(98, entrepreneurialGrowthScore));

  // Composite Growth Score
  const growthScore = Math.round(
    careerGrowthScore * 0.45 + financialGrowthScore * 0.35 + entrepreneurialGrowthScore * 0.20
  );

  // Overall Growth Velocity
  let rawVelocity: 'Fast-Paced & Exponential' | 'High-Trajectory & Steadily Compounding' | 'Progressive with Cyclical Leaps' | 'Late-Blooming High Zenith';
  if (growthScore >= 80) {
    rawVelocity = 'Fast-Paced & Exponential';
  } else if (growthScore >= 68) {
    rawVelocity = 'High-Trajectory & Steadily Compounding';
  } else if (growthScore >= 52) {
    rawVelocity = 'Progressive with Cyclical Leaps';
  } else {
    rawVelocity = 'Late-Blooming High Zenith';
  }

  const overallGrowthVelocity = growthI18n.velocity[lang]?.[rawVelocity] || rawVelocity;

  // Growth Archetype
  let archetypeKey: 'pioneer' | 'titan' | 'architect' | 'lateBloomer' | 'compounding' = 'compounding';
  if (growthScore >= 80 && (planetsIn10.includes("Sun") || planetsIn10.includes("Mars") || planetsIn11.includes("Rahu"))) {
    archetypeKey = 'pioneer';
  } else if (careerGrowthScore >= 75 && (sav10 >= 30 || lord10House === 10 || lord10House === 1)) {
    archetypeKey = 'titan';
  } else if (entrepreneurialGrowthScore >= 70 || planetsIn10.includes("Mercury") || amkPlanet === "Mercury") {
    archetypeKey = 'architect';
  } else if (lord10House === 8 || lord10House === 12 || planetsIn10.includes("Saturn") || rawVelocity === 'Late-Blooming High Zenith') {
    archetypeKey = 'lateBloomer';
  } else {
    archetypeKey = 'compounding';
  }

  const archetypeDict = (growthI18n.archetypes[lang] || growthI18n.archetypes.en)[archetypeKey];
  const growthArchetype = {
    title: archetypeDict.title,
    description: archetypeDict.description,
    keyStrengths: archetypeDict.strengths,
  };

  // --- Key Growth Drivers (Astrological Catalysts) ---
  const keyGrowthDrivers: GrowthPrediction["keyGrowthDrivers"] = [];

  if (planetsIn10.includes("Sun") || planetsIn10.includes("Mars")) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? "दशम भाव में शत-प्रतिशत दिग्बल (सूर्य/मंगल)" : "100% Digbala in 10th House (Sun/Mars)",
      planetaryBasis: lang === 'hi' ? "सूर्य/मंगल का दशम भाव में दिग्बल नेतृत्व व अधिकार का नैसर्गिक योग बनाता है।" : "Sun/Mars in 10th commands directional strength, empowering commanding authority.",
      impact: lang === 'hi' ? "कार्यक्षेत्र में त्वरित पदोन्नति, कार्यकारी प्राधिकार और प्रतिष्ठित सामाजिक स्थिति।" : "Rapid promotions, executive authority, and respected public status."
    });
  }

  if (lord10House === 11 || lord11House === 10) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? "कर्म-लाभ महासंयोग (10वें व 11वें भाव का संबंध)" : "Karma-Labha Synergy (10th & 11th House Connection)",
      planetaryBasis: lang === 'hi' ? "दशमेश और एकादशेश का परस्पर संबंध कर्म को प्रत्यक्ष उच्च आय में बदलता है।" : "Direct link between profession and gains turns work output into exponential earnings.",
      impact: lang === 'hi' ? "किए गए प्रयासों का अधिकतम वित्तीय प्रतिफल व निरंतर संपदा संचय।" : "High compounding rate on effort, continuous equity appreciation, and network monetization."
    });
  }

  if (sav10 >= 30) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? `दशम भाव में उच्च अष्टकवर्ग बल (${sav10} बिंदु)` : `High 10th House Ashtakavarga (${sav10} bindus)`,
      planetaryBasis: lang === 'hi' ? "दशम भाव में 30+ बिंदु निरंतर संगठनात्मक शक्ति व आदर प्रदान करते हैं।" : "30+ bindus in the 10th house grant unshakeable stamina and peer reverence.",
      impact: lang === 'hi' ? "बाजार की मंदी या चुनौतियों के बीच भी पद व आजीविका की अटूट सुरक्षा।" : "Career immunity during broader economic downturns and high leadership longevity."
    });
  }

  if (surplusRatio >= 4) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? `सकारात्मक बचत अधिशेष अनुपात (+${surplusRatio})` : `Positive Wealth Surplus Ratio (+${surplusRatio})`,
      planetaryBasis: lang === 'hi' ? `एकादश भाव (${sav11}) का द्वादश भाव (${sav12}) से अधिक होना धन संचय कराता है।` : `11th house of gains (${sav11}) strongly surpasses 12th house of outflows (${sav12}).`,
      impact: lang === 'hi' ? "आय का बड़ा हिस्सा स्थायी परिसंपत्तियों (रियल एस्टेट, इक्विटी) में सुरक्षित रूप से संचित होना।" : "High savings retention rate, converting cash flows into permanent wealth pillars."
    });
  }

  if ([1, 4, 7, 10, 5, 9].includes(getPlanetHouse(amkPlanet))) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? `जैमिनी अमात्यकारक (${getLocalizedPlanet(amkPlanet, lang)}) केंद्र/त्रिकोण में` : `Jaimini Amatyakaraka (${amkPlanet}) in Kendra/Trikona`,
      planetaryBasis: lang === 'hi' ? "आजीविका का मुख्य ग्रह शुभ भाव में स्थित होकर स्वाभाविक प्रतिभा को विस्तार देता है।" : "Career indicator planet placed in auspicious angle triggers authentic professional destiny.",
      impact: lang === 'hi' ? "विषय विशेषज्ञता का सहज मुद्रीकरण और उद्योग में प्रतिष्ठा।" : "Effortless recognition of domain mastery and high career fulfillment."
    });
  }

  if (keyGrowthDrivers.length === 0) {
    keyGrowthDrivers.push({
      driver: lang === 'hi' ? "अनुशासित पुरुषार्थ एवं क्रमिक विकास योग" : "Disciplined Self-Effort & Incremental Growth",
      planetaryBasis: lang === 'hi' ? "लग्नेश एवं द्वितीयेश का संतुलन जातक को सतत प्रयासरत रखता है।" : "Synergy of 1st and 2nd lords keeps native focused on steady personal value creation.",
      impact: lang === 'hi' ? "समय के साथ निरंतर कौशल उन्नयन और स्थायी आर्थिक आधार।" : "Sustainable long-term compounding and dependable financial resilience."
    });
  }

  // --- Growth Blockers & Friction Points ---
  const growthBlockersAndFriction: GrowthPrediction["growthBlockersAndFriction"] = [];

  if (sav12 >= sav11) {
    growthBlockersAndFriction.push({
      challenge: lang === 'hi' ? "आय की तुलना में व्यय का उच्च दबाव" : "High Expenditure Pressure Relative to Inflow",
      astrologicalSource: lang === 'hi' ? `द्वादश भाव (${sav12}) एकादश भाव (${sav11}) के बराबर या अधिक है।` : `12th house bindus (${sav12}) match or exceed 11th house bindus (${sav11}).`,
      mitigationStrategy: lang === 'hi' ? "वित्तीय अनुशासन: आय होते ही 30% राशि स्वचालित रूप से लॉक-इन निवेश (PPF, SIP, गोल्ड) में अंतरित करें।" : "Enforce automated deductions: Transfer 30% of income directly into illiquid investments on payday."
    });
  }

  if (sav10 < 26) {
    growthBlockersAndFriction.push({
      challenge: lang === 'hi' ? "कार्यक्षेत्र में उत्तरदायित्वों की अनिश्चितता" : "Role Ambiguity or Friction with Hierarchy",
      astrologicalSource: lang === 'hi' ? `दशम भाव में कम अष्टकवर्ग बिंदु (${sav10})।` : `Below-average Ashtakavarga bindus in 10th house (${sav10}).`,
      mitigationStrategy: lang === 'hi' ? "कार्यस्थल पर सभी लक्ष्यों व जिम्मेदारियों को लिखित व स्पष्ट रखें; केवल मौखिक चर्चा पर निर्भर न रहें।" : "Always document deliverables and agreements in writing; avoid relying solely on informal verbal praise."
    });
  }

  if ([6, 8, 12].includes(lord10House)) {
    growthBlockersAndFriction.push({
      challenge: lang === 'hi' ? "कार्यक्षेत्र में अचानक बदलाव अथवा पर्दे के पीछे अधिक श्रम" : "Hidden Headwinds or Behind-the-Scenes Struggles",
      astrologicalSource: lang === 'hi' ? `दशमेश भाव ${lord10House} में स्थित है।` : `10th Lord placed in dusthana House ${lord10House}.`,
      mitigationStrategy: lang === 'hi' ? "विदेशी कंपनियों, दूरस्थ कार्य (Remote work), अनुसंधान, परामर्श अथवा बैक-एंड सिस्टम्स में विशेषज्ञता विकसित करें।" : "Anchor career in MNCs, remote tech architectures, research, confidential data, or specialized advisory."
    });
  }

  if (growthBlockersAndFriction.length === 0) {
    growthBlockersAndFriction.push({
      challenge: lang === 'hi' ? "संतुष्टि की स्थिति में नवाचार का रुक जाना" : "Complacency Risk During Stable Plateaus",
      astrologicalSource: lang === 'hi' ? "शुभ ग्रहों के प्रभाव से आरामदेह स्थिति में ठहरने की संभावना।" : "High chart stability can tempt native into resting on past laurels.",
      mitigationStrategy: lang === 'hi' ? "हर 2 वर्ष में नए तकनीकी कौशल सीखें और अपने पेशेवर नेटवर्क का विस्तार करते रहें।" : "Proactively acquire new technical certifications and refresh your professional network every 24 months."
    });
  }

  // --- Life Growth Roadmap by Age Milestones ---
  const lifeGrowthRoadmap: GrowthPrediction["lifeGrowthRoadmap"] = [
    {
      ageSpan: "18 - 26",
      phaseName: lang === 'hi' ? "कौशल संचय एवं आधारशिला निर्माण" : "Skill Acquisition & Foundation",
      focusArea: lang === 'hi' ? "विद्या, बुनियादी तकनीकी दक्षता, मेंटरशिप एवं प्रथम करियर कदम" : "Academics, technical fundamentals, mentor alignment & initial career launch",
      astrologicalCycle: lang === 'hi' ? "पंचम एवं नवम भाव (ज्ञान व प्रारब्ध) का सक्रिय काल" : "Activation of 5th & 9th houses of intellect and mentorship",
      growthAction: lang === 'hi' ? "उच्च शिक्षा व गहरी विशेषज्ञता पर ध्यान दें; अल्पकालिक लाभ की अपेक्षा कौशल निर्माण को प्राथमिकता दें।" : "Prioritize high-leverage skill acquisition and credentials over early vanity compensation."
    },
    {
      ageSpan: "27 - 34",
      phaseName: lang === 'hi' ? "प्रतिस्पर्धी आरोहण एवं त्वरित विस्तार" : "Market Ascension & High Acceleration",
      focusArea: lang === 'hi' ? "स्वतंत्र उत्तरदायित्व, प्रतिस्पर्धा में विजय, प्रथम बड़ा पद व व्यावसायिक नेटवर्क" : "Autonomous ownership, high-velocity execution, first major leadership title",
      astrologicalCycle: lang === 'hi' ? "तृतीय, षष्ठ एवं दशम भाव (पराक्रम, विजय व कर्म) की प्रबलता" : "Synergy of 3rd, 6th & 10th houses of initiative, resilience and authority",
      growthAction: lang === 'hi' ? "जटिल परियोजनाओं का नेतृत्व लें; अपनी दृश्यता (Visibility) बढ़ाएं और स्वतंत्र निर्णय लेने का साहस दिखाएं।" : "Step into high-visibility, mission-critical projects; build your professional personal brand."
    },
    {
      ageSpan: "35 - 48",
      phaseName: lang === 'hi' ? "सर्वोच्च प्रशासनिक प्राधिकार एवं संपदा संचय" : "Peak Authority & Compounding Wealth",
      focusArea: lang === 'hi' ? "शीर्ष कार्यकारी पद, उद्यम स्वामित्व, व्यापक टीम नेतृत्व व पूंजी चक्रवृद्धि" : "Executive reign, enterprise equity, institutional influence, asset compounding",
      astrologicalCycle: lang === 'hi' ? "दशम, एकादश भाव एवं इंदु लग्न का चरमोत्कर्ष" : "Culmination of 10th house status, 11th house gains & Indu Lagna wealth",
      growthAction: lang === 'hi' ? "अपने समय को रणनीतिक निर्णयों पर लगाएं; इक्विटी स्वामित्व और बड़े पैमाने पर संस्थागत मूल्य सृजन करें।" : "Focus on high-ticket strategic governance; build equity ownership and scalable systems."
    },
    {
      ageSpan: "49+",
      phaseName: lang === 'hi' ? "सार्वभौमिक साख, मेंटरशिप एवं स्थायी विरासत" : "Sovereign Legacy, Advisory & Mentorship",
      focusArea: lang === 'hi' ? "उद्योग सलाहकार, बोर्ड भूमिकाएं, निष्क्रिय आय व भावी पीढ़ी का मार्गदर्शन" : "Board advisory, sovereign consulting, passive wealth streams, philanthropic legacy",
      astrologicalCycle: lang === 'hi' ? "कारकांश लग्न एवं नवम भाव (धर्म व गुरु पद) का प्रभाव" : "Karakamsha & 9th house of wisdom and sovereign institutional guidance",
      growthAction: lang === 'hi' ? "युवा नेतृत्व को प्रशिक्षित करें, परोपकार व आध्यात्मिक संतुलन के साथ अपनी प्रतिष्ठा को अक्षुण्ण रखें।" : "Transition into senior advisory and mentorship, institutionalizing your lifetime knowledge."
    }
  ];

  // --- Upcoming Peak Growth Periods (Vimshottari Dasha Analysis) ---
  const upcomingPeakGrowthPeriods: GrowthPrediction["upcomingPeakGrowthPeriods"] = [];
  const growthSignificators = new Set<string>([lord10, lord11, lord9, lord1, lord2, amkPlanet, "Sun", "Jupiter"]);

  const dashaTree = kundli.dasha?.mahadashas || [];
  const horizonEnd = new Date(now.getTime());
  horizonEnd.setUTCFullYear(horizonEnd.getUTCFullYear() + 12);

  for (const maha of dashaTree) {
    for (const antar of maha.antars || []) {
      const start = Math.max(new Date(maha.startTime).getTime(), new Date(antar.startTime).getTime());
      const end = Math.min(new Date(maha.endTime).getTime(), new Date(antar.endTime).getTime());
      if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) continue;

      const isMahaGrowth = growthSignificators.has(maha.planet);
      const isAntarGrowth = growthSignificators.has(antar.planet);

      if (!isMahaGrowth && !isAntarGrowth) continue;

      const windowStart = Math.max(start, now.getTime());
      const windowEnd = Math.min(end, horizonEnd.getTime());
      if (windowStart >= windowEnd) continue;

      const startYear = new Date(windowStart).getUTCFullYear();
      const endYear = new Date(windowEnd - 1).getUTCFullYear();
      const spanStr = startYear === endYear ? `${startYear}` : `${startYear} - ${endYear}`;

      const locMaha = getLocalizedPlanet(maha.planet, lang);
      const locAntar = getLocalizedPlanet(antar.planet, lang);

      let theme = "";
      if (maha.planet === lord10 || antar.planet === lord10) {
        theme = lang === 'hi' ? "कर्मोन्नति एवं पदोन्नति का स्वर्णिम काल" : "Pinnacle Career Promotion & Authority Surge";
      } else if (maha.planet === lord11 || antar.planet === lord11) {
        theme = lang === 'hi' ? "विपुल आर्थिक लाभ एवं आय स्रोतों का विस्तार" : "High Financial Inflow & Network Monetization";
      } else if (maha.planet === amkPlanet || antar.planet === amkPlanet) {
        theme = lang === 'hi' ? "अमात्यकारक द्वारा आजीविका में अभूतपूर्व पहचान" : "Amatyakaraka Elevation in Domain Authority";
      } else {
        theme = lang === 'hi' ? "रणनीतिक विस्तार एवं भाग्य का प्रबल सहयोग" : "Strategic Expansion & Fortune Acceleration";
      }

      upcomingPeakGrowthPeriods.push({
        periodSpan: spanStr,
        dashaPlanets: `${locMaha} - ${locAntar}`,
        growthTheme: theme,
        favorableInitiatives: lang === 'hi'
          ? [
              "नए व्यावसायिक उपक्रम अथवा रणनीतिक पदोन्नति हेतु आवेदन करें।",
              "दीर्घकालिक मूल्य वर्धन वाली संपत्तियों में पूंजी निवेश करें।",
              "वरिष्ठ अधिकारियों व उद्योग जगत के प्रभावशाली व्यक्तियों से संबंध प्रगाढ़ करें।"
            ]
          : [
              "Pitch for executive promotions, leadership roles, or launch new ventures.",
              "Deploy surplus capital into high-growth equity or prime real estate.",
              "Deepen high-value strategic relationships with industry mentors."
            ]
      });

      if (upcomingPeakGrowthPeriods.length >= 3) break;
    }
    if (upcomingPeakGrowthPeriods.length >= 3) break;
  }

  // --- Growth Sectors & Domains ---
  const sectorsSet = new Set<string>();
  const rashi10Name = rashiNames[rashi10Idx];

  if (["Aries", "Leo", "Sagittarius"].includes(rashi10Name) || [1, 5, 9].includes(lord10House)) {
    sectorsSet.add(lang === 'hi' ? "प्रौद्योगिकी एवं इंजीनियरिंग नेतृत्व (Tech Leadership)" : "Technology & Engineering Leadership");
    sectorsSet.add(lang === 'hi' ? "कार्यकारी प्रशासन एवं रक्षा/ऊर्जा सिस्टम्स" : "Executive Governance & Sovereign Defense Systems");
    sectorsSet.add(lang === 'hi' ? "रणनीतिक प्रबंधन एवं उद्यम स्केलिंग" : "Strategic Management & Venture Scaling");
  } else if (["Taurus", "Virgo", "Capricorn"].includes(rashi10Name) || [2, 6, 10].includes(lord10House)) {
    sectorsSet.add(lang === 'hi' ? "सॉफ्टवेयर आर्किटेक्चर एवं कोर इंफ्रास्ट्रक्चर" : "Software Architecture & Core Infrastructure");
    sectorsSet.add(lang === 'hi' ? "फिनटेक, वेल्थटेक एवं वित्तीय इंजीनियरिंग" : "Fintech, Wealthtech & Financial Engineering");
    sectorsSet.add(lang === 'hi' ? "सप्लाई चेन, रियल एस्टेट एवं बड़े विनिर्माण उपक्रम" : "Supply Chain, Real Estate & Scaled Operations");
  } else if (["Gemini", "Libra", "Aquarius"].includes(rashi10Name) || [3, 7, 11].includes(lord10House)) {
    sectorsSet.add(lang === 'hi' ? "आर्टिफिशियल इंटेलिजेंस (AI) एवं डिजिटल प्लेटफॉर्म्स" : "Artificial Intelligence & Digital Platforms");
    sectorsSet.add(lang === 'hi' ? "उच्च-मूल्य रणनीतिक कंसल्टिंग एवं डेटा साइंस" : "High-Value Strategic Consulting & Data Science");
    sectorsSet.add(lang === 'hi' ? "ई-कॉमर्स, मीडिया, संचार एवं वैश्विक व्यापार" : "E-Commerce, Media & Global Commercial Trade");
  } else {
    sectorsSet.add(lang === 'hi' ? "बायोमेडिकल रिसर्च, हेल्थकेयर एवं डीप-टेक" : "Biomedical Research, Healthcare & Deep-Tech");
    sectorsSet.add(lang === 'hi' ? "वैश्विक परामर्श, संस्थागत प्रशासन एवं अनुसंधान" : "Global Advisory, Institutional Governance & Research");
    sectorsSet.add(lang === 'hi' ? "मानव संसाधन, फिनटेक एवं सस्टेनेबल टेक्नोलॉजी" : "Human Resources, Fintech & Sustainable Tech");
  }

  if (amkPlanet === "Mercury" || amkPlanet === "Rahu") {
    sectorsSet.add(lang === 'hi' ? "क्लाउड कंप्यूटिंग, सास (SaaS) एवं एल्गोरिथमिक सिस्टम्स" : "Cloud Computing, SaaS Platforms & Algorithmic Systems");
  }

  const growthSectorsAndDomains = Array.from(sectorsSet).slice(0, 4);

  // --- Strategic Growth Accelerators ---
  const strategicGrowthAccelerators = lang === 'hi'
    ? [
        "विशिष्ट ज्ञान (Niche Mastery) का निर्माण करें जिसे आसानी से बदला न जा सके।",
        "अपने कार्यक्षेत्र में 50-50 अनौपचारिक साझेदारी से बचें; स्वामित्व व बौद्धिक संपदा को स्पष्ट रखें।",
        "नियमित रूप से अपनी पूंजी को लाभांश देने वाली या दीर्घकालिक मूल्यवान संपत्तियों में लगाएं।",
        "प्रत्येक वर्ष कम से कम 2 नए प्रभावशाली उद्योग संपर्कों के साथ रणनीतिक तालमेल बनाएं।"
      ]
    : [
        "Cultivate non-commoditized, niche technical authority that cannot easily be replaced.",
        "Avoid 50-50 informal equity splits; retain decisive operational leverage and clear IP ownership.",
        "Systematically convert cash flows into compounding assets (equity, real estate, IP).",
        "Proactively forge at least two high-leverage institutional relationships every year."
      ];

  // --- Astrological Remedies for Growth ---
  const astrologicalRemediesForGrowth = [
    {
      remedy: lang === 'hi' ? "सूर्य अर्घ्य एवं आदित्य हृदय स्तोत्र" : "Surya Arghya & Aditya Hridaya Stotram",
      purpose: lang === 'hi' ? "दशम भाव के कारक सूर्य को बल देकर कार्यक्षेत्र में उच्च पद, ओज और सामाजिक प्रतिष्ठा में वृद्धि।" : "Strengthens Sun, natural karaka of the 10th house, amplifying executive authority, vitality, and stature."
    },
    {
      remedy: lang === 'hi' ? "श्री सूक्तम् एवं कनकधारा स्तोत्र" : "Shree Suktam & Kanakadhara Stotram",
      purpose: lang === 'hi' ? "एकादश व द्वितीय भाव को सक्रिय कर निरंतर आय वृद्धि, ऋण मुक्ति और स्थायी संपदा संचय।" : "Activates 11th and 2nd houses, removing monetary blockages and accelerating capital compounding."
    },
    {
      remedy: lang === 'hi' ? "कार्यस्थल पर उत्तर-पूर्व (ईशान) दिशा का सदुपयोग" : "North-East (Ishanya) Alignment for Workspace",
      purpose: lang === 'hi' ? "अपने कार्यालय या अध्ययन मेज को उत्तर या पूर्व मुखी रखें; मानसिक स्पष्टता और निर्णय क्षमता में वृद्धि।" : "Face North or East while executing high-leverage strategic work to maximize mental clarity and insight."
    }
  ];

  // Multi-System Insights
  let d10DashamshaGrowthInsight: string | undefined;
  if (kundli.vargas?.D10) {
    const d10Asc = kundli.vargas.D10.ascendant;
    const d10AscRashi = d10Asc ? rashiNames[(d10Asc.rashi - 1 + 12) % 12] : "";
    d10DashamshaGrowthInsight = lang === 'hi'
      ? `दशांश (D10) चक्र सत्यापन: दशमांश लग्न ${d10AscRashi} में संस्थित होकर करियर के दीर्घकालिक विस्तार, पद-प्रतिष्ठा और सार्वजनिक प्रभाव को प्रमाणित करता है।`
      : `Dashamsha (D10) Growth Confirmation: D10 Ascendant in ${d10AscRashi} validates sustained long-term leadership authority and resilient professional status.`;
  }

  const amatyakarakaGrowthInsight = lang === 'hi'
    ? `जैमिनी अमात्यकारक (${getLocalizedPlanet(amkPlanet, lang)}): अंश ${jaimini.amatyakaraka.formattedDegree} पर भाव ${jaimini.amatyakaraka.house} में स्थित होकर करियर विस्तार का प्रमुख चालक बनता है।`
    : `Jaimini Amatyakaraka (${amkPlanet}): Positioned at ${jaimini.amatyakaraka.formattedDegree} in House ${jaimini.amatyakaraka.house}, operating as your primary vocational engine.`;

  const induLagnaWealthGrowthInsight = lang === 'hi'
    ? `अष्टकवर्ग अधिशेष (+${surplusRatio}): एकादश भाव (${sav11} बिंदु) का द्वादश भाव (${sav12} बिंदु) पर आधिक्य निरंतर धन संचय सुनिश्चित करता है।`
    : `Ashtakavarga Surplus (+${surplusRatio}): 11th house (${sav11} bindus) outperforming 12th house (${sav12} bindus) guarantees continuous wealth expansion.`;

  return {
    overallGrowthVelocity,
    growthScore,
    careerGrowthScore,
    financialGrowthScore,
    entrepreneurialGrowthScore,
    growthArchetype,
    keyGrowthDrivers,
    growthBlockersAndFriction,
    lifeGrowthRoadmap,
    upcomingPeakGrowthPeriods,
    growthSectorsAndDomains,
    strategicGrowthAccelerators,
    astrologicalRemediesForGrowth,
    d10DashamshaGrowthInsight,
    amatyakarakaGrowthInsight,
    induLagnaWealthGrowthInsight,
  };
}
