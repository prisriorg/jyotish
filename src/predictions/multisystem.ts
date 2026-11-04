import { Kundli } from "../kundli/types";
import { natalDetails, validatePredictionChart } from "./validation";
import { getChalitChart } from "../kundli/chalit";
import { getKpChart } from "../kundli/kp";
import { Observer } from "astronomy-engine";
import { ChalitAnalysis, KpAnalysis, LalKitabAnalysis, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet } from "../i18n/index";

/**
 * Computes Bhava Chalit chart and provides deep insights on planetary shifts
 * and actual bhava cuspal occupants.
 */
export function getChalitAnalysis(kundli: Kundli, options?: PredictionOptions): ChalitAnalysis {
  validatePredictionChart(kundli);
  if (!kundli.chalit) natalDetails(kundli);
  const lang: Language = options?.lang || 'en';
  const chalit = kundli.chalit || getChalitChart(kundli);
  const actualHouseOccupants: Record<number, string[]> = {
    1: [], 2: [], 3: [], 4: [], 5: [], 6: [],
    7: [], 8: [], 9: [], 10: [], 11: [], 12: [],
  };

  for (const p of chalit.planets) {
    if (actualHouseOccupants[p.house]) {
      actualHouseOccupants[p.house].push(p.name);
    }
  }

  const shiftedPlanets: ChalitAnalysis["shiftedPlanets"] = [];
  const keyBhavaInsights: string[] = [];

  for (const p of chalit.planets) {
    const shiftVal = p.shifted ?? 0;
    if (shiftVal !== 0) {
      const shiftDirection = shiftVal > 0
        ? (lang === 'hi' ? "आगे (+1 भाव)" : "Forward (+1)")
        : (lang === 'hi' ? "पीछे (-1 भाव)" : "Backward (-1)");
      let impact = "";
      const locP = getLocalizedPlanet(p.name, lang);

      if (lang === 'hi') {
        if (p.name === "Moon") {
          impact = `चंद्रमा D1 लग्न के भाव ${p.rashiHouse ?? p.house} से चलित भाव ${p.house} में स्थानांतरित हुआ: भावनात्मक बुद्धि और मानसिक ऊर्जा को गहन अंतर्ज्ञान, शोध, विदेश/दूरस्थ संबंध और आत्म-चिंतन की ओर निर्देशित करता है।`;
        } else if (p.name === "Sun") {
          impact = `सूर्य चलित भाव ${p.house} में स्थानांतरित हुआ: आंतरिक ओज, नेतृत्व और अधिकार को पारंपरिक राशि की बजाय भाव ${p.house} के कार्यों पर केंद्रित करता है।`;
        } else if (p.name === "Saturn") {
          impact = `शनि चलित भाव ${p.house} में स्थानांतरित हुआ: भाव ${p.house} को धैर्य, अनुशासन, कर्म-कठोरता और व्यवस्था निर्माण की शक्ति देता है।`;
        } else if (p.name === "Jupiter") {
          impact = `गुरु चलित भाव ${p.house} में स्थानांतरित हुआ: भाव ${p.house} में भाग्य, विवेक और उच्च संस्कारों का विस्तार करता है।`;
        } else if (p.name === "Venus") {
          impact = `शुक्र चलित भाव ${p.house} में स्थानांतरित हुआ: भाव ${p.house} में सुरुचि, सौहार्द, सुख-सुविधा और संबंधों में मधुरता लाता है।`;
        } else if (p.name === "Mercury") {
          impact = `बुध चलित भाव ${p.house} में स्थानांतरित हुआ: भाव ${p.house} में तीक्ष्ण विश्लेषणात्मक बुद्धि, संचार और व्यापारिक कौशल बढ़ाता है।`;
        } else if (p.name === "Mars") {
          impact = `मंगल चलित भाव ${p.house} में स्थानांतरित हुआ: भाव ${p.house} में महत्वाकांक्षा, अदम्य ऊर्जा और कार्यकारी पराक्रम का संचार करता है।`;
        } else {
          impact = `${locP} चलित भाव ${p.house} में स्थानांतरित होकर अपने वास्तविक फल भाव ${p.house} के माध्यम से प्रदान करता है।`;
        }
      } else {
        if (p.name === "Moon") {
          impact = `Moon shifted from D1 House ${p.rashiHouse ?? p.house} to Chalit Bhava ${p.house}: Directs emotional intelligence and mental focus towards deep intuition, research, remote/foreign linkages, and solitary reflection.`;
        } else if (p.name === "Sun") {
          impact = `Sun shifted to Chalit Bhava ${p.house}: Focuses core vitality and authority on House ${p.house} affairs rather than conventional sign position.`;
        } else if (p.name === "Saturn") {
          impact = `Saturn shifted to Chalit Bhava ${p.house}: Disciplines House ${p.house} with patience, karmic endurance, and structural mastery.`;
        } else if (p.name === "Jupiter") {
          impact = `Jupiter shifted to Chalit Bhava ${p.house}: Expands fortune, wisdom, and ethics in House ${p.house}.`;
        } else if (p.name === "Venus") {
          impact = `Venus shifted to Chalit Bhava ${p.house}: Enhances diplomacy, luxury, and relationship grace in House ${p.house}.`;
        } else if (p.name === "Mercury") {
          impact = `Mercury shifted to Chalit Bhava ${p.house}: Sharpens analytical acumen and commerce in House ${p.house}.`;
        } else if (p.name === "Mars") {
          impact = `Mars shifted to Chalit Bhava ${p.house}: Channels ambition, drive, and executive action into House ${p.house}.`;
        } else {
          impact = `${p.name} shifted to Chalit Bhava ${p.house}: Delivers practical life results through House ${p.house} rather than D1 rashi house.`;
        }
      }

      shiftedPlanets.push({
        planet: p.name,
        d1House: p.rashiHouse ?? p.house,
        chalitBhava: p.house,
        shiftDirection,
        impact,
      });
    }
  }

  // Generate overarching Chalit Bhava insights
  if (shiftedPlanets.length === 0) {
    keyBhavaInsights.push(lang === 'hi'
      ? "लग्न कुंडली (D1) और भाव चलित चक्र में सभी ग्रहों की स्थिति एक समान है।"
      : "All planets maintain consistent house alignment between Rashi (D1) and Bhava Chalit.");
  } else {
    keyBhavaInsights.push(lang === 'hi'
      ? `लग्न और भाव चलित के बीच ${shiftedPlanets.length} ग्रह स्थानांतरण पाए गए, जो फलकथन की सटीकता को परिष्कृत करते हैं।`
      : `${shiftedPlanets.length} planetary shift(s) detected between D1 Rashi and Bhava Chalit, refining exact timing and results.`);
    shiftedPlanets.forEach((sp) => {
      const locP = getLocalizedPlanet(sp.planet, lang);
      keyBhavaInsights.push(lang === 'hi'
        ? `${locP}: भाव चलित में भाव ${sp.chalitBhava} (${sp.shiftDirection}) में विश्लेषित।`
        : `${sp.planet}: Evaluated in Bhava ${sp.chalitBhava} (${sp.shiftDirection}).`);
    });
  }

  // 10th House (Career) in Chalit
  const planetsIn10Chalit = actualHouseOccupants[10] || [];
  if (planetsIn10Chalit.length > 0) {
    const pNames = planetsIn10Chalit.map(p => getLocalizedPlanet(p, lang)).join(", ");
    keyBhavaInsights.push(lang === 'hi'
      ? `चलित दशम भाव में ${pNames} की स्थिति सीधे कार्यक्षेत्र में प्रतिष्ठा और नेतृत्व प्रदान करती है।`
      : `Chalit 10th Bhava is actively occupied by ${planetsIn10Chalit.join(", ")}, providing direct professional prominence.`);
  } else {
    keyBhavaInsights.push(lang === 'hi'
      ? "चलित दशम भाव किसी प्रत्यक्ष पापी ग्रह के प्रभाव से मुक्त है, जिससे दशमेश का पूर्ण शुभ प्रभाव रहता है।"
      : "Chalit 10th Bhava is clear of direct malefic interference, allowing 10th lord and aspecting planets full command.");
  }

  // 7th House (Marriage) in Chalit
  const planetsIn7Chalit = actualHouseOccupants[7] || [];
  if (planetsIn7Chalit.length > 0) {
    const pNames = planetsIn7Chalit.map(p => getLocalizedPlanet(p, lang)).join(", ");
    keyBhavaInsights.push(lang === 'hi'
      ? `चलित सप्तम भाव में ${pNames} की स्थिति वैवाहिक और व्यावसायिक साझेदारी को सक्रिय करती है।`
      : `Chalit 7th Bhava is blessed by ${planetsIn7Chalit.join(", ")}, confirming direct partnership dynamics.`);
  }

  return {
    shiftedPlanets,
    actualHouseOccupants,
    keyBhavaInsights,
  };
}

/**
 * Computes Krishnamurti Paddhati (KP) 4-fold cuspal rulers and sub-lord significations.
 */
export function getKpAnalysis(kundli: Kundli, options?: PredictionOptions): KpAnalysis {
  validatePredictionChart(kundli);
  const lang: Language = options?.lang || 'en';
  const hi = lang === 'hi';
  let kp = kundli.kp;
  if (!kp) {
    const { date, lat, lon } = natalDetails(kundli);
    kp = getKpChart(date, new Observer(lat, lon, 0), { ayanamsa: 'kp' });
  }
  const chart = kp;
  const cusps = chart.cusps;
  if (!Array.isArray(cusps) || cusps.length !== 12 ||
      new Set(cusps.map(c => c.houseNumber)).size !== 12 ||
      cusps.some(c => !Number.isInteger(c.houseNumber) || c.houseNumber < 1 || c.houseNumber > 12 ||
        !kundli.planets[c.subLord] || !kundli.planets[c.nakshatraLord])) {
    throw new Error('KP analysis requires 12 valid, distinct cusps with valid star and sub lords.');
  }
  const cusp = (n: number) => cusps.find(c => c.houseNumber === n)!;
  const housesOf = (planet: string) => chart.significators?.planets[planet]?.allHouses;
  const assessment = (planet: string, supportive: number[], challenging: number[]) => {
    const houses = housesOf(planet);
    if (!houses) return hi ? 'भाव संकेतक उपलब्ध नहीं; निष्कर्ष स्थापित नहीं' : 'House significators unavailable; conclusion not established';
    const support = houses.filter(h => supportive.includes(h));
    const caution = houses.filter(h => challenging.includes(h));
    const label = support.length
      ? (caution.length ? (hi ? 'मिश्रित संकेत' : 'Mixed indications') : (hi ? 'सहायक संकेत' : 'Supportive indications'))
      : (hi ? 'प्रत्यक्ष समर्थन स्थापित नहीं' : 'Direct support not established');
    return hi
      ? `${label}; संबंधित भाव ${houses.join(', ') || 'कोई नहीं'}, सहायक ${support.join(', ') || 'कोई नहीं'}, चुनौती ${caution.join(', ') || 'कोई नहीं'}`
      : `${label}; signified houses ${houses.join(', ') || 'none'}, supporting ${support.join(', ') || 'none'}, challenging ${caution.join(', ') || 'none'}`;
  };
  const explain = (n: number, supportive: number[], challenging: number[]) => {
    const c = cusp(n);
    return hi
      ? `केपी भाव ${n}: उप-स्वामी ${getLocalizedPlanet(c.subLord, lang)}, नक्षत्र स्वामी ${getLocalizedPlanet(c.nakshatraLord, lang)}। ${assessment(c.subLord, supportive, challenging)}।`
      : `KP cusp ${n}: sub-lord ${c.subLord}, star lord ${c.nakshatraLord}. ${assessment(c.subLord, supportive, challenging)}.`;
  };
  const seventhHouses = housesOf(cusp(7).subLord);
  const romance = seventhHouses?.includes(5) && seventhHouses.includes(7);
  const typeIndication = romance
    ? (hi ? 'पंचम-सप्तम भाव का संबंध प्रेम-संबंध का संकेत दे सकता है; विवाह का प्रकार निश्चित नहीं।'
      : 'A 5th-7th house connection may indicate a romantic relationship; marriage type is not established.')
    : (hi ? 'इन संकेतकों से प्रेम अथवा पारंपरिक विवाह का निश्चित निर्णय स्थापित नहीं।'
      : 'These significators do not establish love versus arranged marriage.');
  return {
    cuspSubLords: [...cusps].sort((a, b) => a.houseNumber - b.houseNumber).map(c => ({
      cuspNumber: c.houseNumber, subLord: c.subLord, starLord: c.nakshatraLord,
    })),
    careerCusp10: {
      subLord: cusp(10).subLord, starLord: cusp(10).nakshatraLord,
      significationVerdict: explain(10, [2, 6, 10, 11], [5, 8, 12]),
    },
    marriageCusp7: {
      subLord: cusp(7).subLord, starLord: cusp(7).nakshatraLord,
      marriagePromise: explain(7, [2, 7, 11], [1, 6, 10]), typeIndication,
    },
    wealthCusps: {
      cusp2SubLord: cusp(2).subLord, cusp11SubLord: cusp(11).subLord,
      financialSignification: `${explain(2, [2, 6, 10, 11], [8, 12])} ${explain(11, [2, 6, 10, 11], [8, 12])}`,
    },
  };
}

/**
 * Computes Lal Kitab Kundli metrics:
 * Teva classification (Dharmi vs Paapi), Kismat Ka Grah, Sleeping Houses,
 * Karmic Debts (Rin), and practical time-tested Lal Kitab totke.
 */
export function getLalKitabAnalysis(kundli: Kundli, options?: PredictionOptions): LalKitabAnalysis {
  validatePredictionChart(kundli);
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};

  const getHouseOfPlanet = (name: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(name)) return h.number;
    }
    return 1;
  };

  const jupiterHouse = getHouseOfPlanet("Jupiter");
  const saturnHouse = getHouseOfPlanet("Saturn");
  const venusHouse = getHouseOfPlanet("Venus");
  const sunHouse = getHouseOfPlanet("Sun");
  const moonHouse = getHouseOfPlanet("Moon");
  const marsHouse = getHouseOfPlanet("Mars");
  const mercuryHouse = getHouseOfPlanet("Mercury");
  const rahuHouse = getHouseOfPlanet("Rahu");
  const ketuHouse = getHouseOfPlanet("Ketu");

  // 1. Dharmi Teva Check
  let rawTeva: "Aam Teva (Standard)" | "Dharmi Teva (Blessed / Auspicious)" | "Paapi Teva (Challenging)" = "Aam Teva (Standard)";
  if ([1, 4, 7, 10, 5, 9].includes(jupiterHouse)) {
    rawTeva = "Dharmi Teva (Blessed / Auspicious)";
  } else if ([1, 4, 7].includes(rahuHouse) && [1, 4, 7].includes(ketuHouse) && jupiterHouse === 6) {
    rawTeva = "Paapi Teva (Challenging)";
  }

  const tevaType = lang === 'hi'
    ? (rawTeva === "Dharmi Teva (Blessed / Auspicious)" ? "धर्मी टेवा (ईश्वरीय कृपा व सुरक्षा युक्त)" : rawTeva === "Paapi Teva (Challenging)" ? "पापी टेवा (कठिन व सतर्कता अपेक्षित)" : "आम टेवा (सामान्य)")
    : rawTeva;

  // 2. Kismat Ka Grah
  let kismatPlanet = "Jupiter";
  let kismatHouse = jupiterHouse;
  let kismatRole = lang === 'hi'
    ? "दैवीय विवेक, गुरुजनों के आशीर्वाद और सामाजिक मान-सम्मान को जगाता है।"
    : "Awakens divine wisdom, elder support, and social respect.";

  if (venusHouse === 2) {
    kismatPlanet = "Venus";
    kismatHouse = 2;
    kismatRole = lang === 'hi'
      ? "शुक्र द्वितीय भाव (लाल किताब में अपना पक्का घर) में स्थित है: महालक्ष्मी कृपा, ओजस्वी वाणी और अकूत धन संपदा देता है।"
      : "Venus occupies House 2 (Own Pakka Ghar in Lal Kitab): Bestows Lakshmi Grace, charismatic speech, and financial abundance.";
  } else if (jupiterHouse === 7) {
    kismatPlanet = "Jupiter";
    kismatHouse = 7;
    kismatRole = lang === 'hi'
      ? "सप्तम भाव में गुरु 'धर्मात्मा की तकदीर' का कार्य करता है, जो गुणवान जीवनसाथी और उच्च सामाजिक प्रतिष्ठा सुनिश्चित करता है।"
      : "Jupiter in House 7 acts as 'Dharmatma ki Takdeer', ensuring noble partner and respected societal standing.";
  } else if (sunHouse === 1) {
    kismatPlanet = "Sun";
    kismatHouse = 1;
    kismatRole = lang === 'hi'
      ? "प्रथम भाव में सूर्य स्वाभाविक प्रशासनिक शक्ति, राज-सम्मान और दीर्घायु आरोग्य प्रदान करता है।"
      : "Sun in House 1 brings natural command, royal executive authority, and strong vitality.";
  }

  // 3. Sleeping Houses
  const sleepingHouses: number[] = [];
  const awakenedHouses: number[] = [];

  for (let i = 1; i <= 12; i++) {
    const h = houses.find((house) => house.number === i);
    if (!h || h.planets.length === 0) {
      sleepingHouses.push(i);
    } else {
      awakenedHouses.push(i);
    }
  }

  // 4. Special Lal Kitab Yogas
  const specialYogas: LalKitabAnalysis["specialYogas"] = [];

  if (marsHouse === rahuHouse) {
    specialYogas.push({
      name: lang === 'hi' ? "अंगारक / लाल किताब तूफान योग" : "Angarak / Lal Kitab Toofan Yoga",
      planets: ["Mars", "Rahu"],
      house: marsHouse,
      effect: lang === 'hi'
        ? `भाव ${marsHouse} में अदम्य साहस, उच्च तकनीकी पराक्रम और आक्रामक व्यापारिक सूझबूझ प्रदान करता है।`
        : "Unstoppable daring courage, technological prowess, and aggressive entrepreneurial instincts in House " + marsHouse + ".",
    });
  }

  if (jupiterHouse === 7) {
    specialYogas.push({
      name: lang === 'hi' ? "लाल किताब धर्मात्मा योग" : "Lal Kitab Dharmatma Yoga",
      planets: ["Jupiter"],
      house: 7,
      effect: lang === 'hi'
        ? "जीवनसाथी नैतिक व आध्यात्मिक संबल बनता है, जिससे विवाह के उपरांत निरंतर भाग्य वृद्धि व मान-प्रतिष्ठा मिलती है।"
        : "Partner acts as a spiritual and ethical pillar, bringing prosperity and social dignity after marriage.",
    });
  }

  if (venusHouse === 2) {
    specialYogas.push({
      name: lang === 'hi' ? "लाल किताब लक्ष्मी भंडार योग" : "Lal Kitab Lakshmi Bhandar Yoga",
      planets: ["Venus"],
      house: 2,
      effect: lang === 'hi'
        ? "द्वितीय भाव लाल किताब में शुक्र का पक्का घर है। समय के साथ धन संपदा और मधुर वाणी में निरंतर वृद्धि होती है।"
        : "House 2 is the Pakka Ghar of Venus in Lal Kitab. Wealth and sweet communication multiply with time.",
    });
  }

  if (saturnHouse === 5) {
    specialYogas.push({
      name: lang === 'hi' ? "लाल किताब ज्ञानी शनि योग" : "Lal Kitab Gyani Shani Yoga",
      planets: ["Saturn"],
      house: 5,
      effect: lang === 'hi'
        ? "गहन विश्लेषणात्मक चिंतन, रणनीतिक धैर्य और गूढ़ तकनीकी अनुसंधान की तीव्र क्षमता।"
        : "Deep analytical mind, strategic patience, and technical research intellect.",
    });
  }

  // 5. Lal Kitab Karmic Debts (Rin)
  const karmicDebts: LalKitabAnalysis["karmicDebts"] = [];

  const hasPitraRin = [2, 5, 9, 12].includes(jupiterHouse) && (jupiterHouse === rahuHouse || jupiterHouse === saturnHouse);
  karmicDebts.push({
    debtType: lang === 'hi' ? "पितृ ऋण" : "Pitra Rin (Ancestral Debt)",
    isAfflicted: hasPitraRin,
    description: lang === 'hi'
      ? (hasPitraRin ? "पितरों के प्रति दायित्व हेतु नियमित दान-पुण्य व वरिष्ठों का सम्मान आवश्यक है।" : "कोई पितृ ऋण नहीं है। गुरु ग्रह पर कोई गंभीर पैतृक दोष नहीं है।")
      : (hasPitraRin ? "Ancestral obligations require ethical charity and respect for elders." : "No Pitra Rin detected. Jupiter is free from heavy ancestral affliction."),
    remedy: lang === 'hi'
      ? "धार्मिक अथवा शिक्षण संस्थानों में पीली वस्तुओं (चना दाल, हल्दी, पीतल के बर्तन) का दान करें।"
      : "Donate yellow items (chana dal, turmeric, brass utensils) at religious or educational shrines.",
  });

  const hasStriRin = venusHouse === sunHouse || venusHouse === rahuHouse;
  karmicDebts.push({
    debtType: lang === 'hi' ? "स्त्री ऋण" : "Stri Rin (Partner / Feminine Debt)",
    isAfflicted: hasStriRin,
    description: lang === 'hi'
      ? (hasStriRin ? "माता, पत्नी व महिलाओं का सदैव आदर व सम्मान करने का संकल्प आवश्यक है।" : "कोई स्त्री ऋण नहीं है। शुक्र सौम्यता और गरिमा के साथ फल दे रहे हैं।")
      : (hasStriRin ? "Requires honoring women, mother, and partner with high respect." : "No Stri Rin detected. Venus functions with elegance and dignity."),
    remedy: lang === 'hi'
      ? "गौमाता को हरा चारा व गुड़-रोटी खिलाएं; महिलाओं और जीवनसाथी का कभी अनादर न करें।"
      : "Feed grass and sweet bread to cows; never disrespect women or domestic partners.",
  });

  // 6. Actionable Lal Kitab Remedies
  const lalKitabRemedies: LalKitabAnalysis["lalKitabRemedies"] = lang === 'hi'
    ? [
        {
          area: "धन एवं समृद्धि",
          remedy: "प्रतिदिन प्रातःकाल माथे, नाभि और जीभ पर शुद्ध केसर का तिलक लगाएं। अपने बटुए में ठोस चांदी का चौकोर टुकड़ा रखें।",
          caution: "किसी परिचित से कोई इलेक्ट्रॉनिक सामान, गहरे नीले या काले रंग के वस्त्र कभी मुफ्त में न लें।",
        },
        {
          area: "करियर व उन्नति",
          remedy: "सफाई कर्मचारियों, सहायकों व श्रमिकों के साथ उदारता बरतें। उनका पारिश्रमिक समय पर दें जिससे शनिदेव प्रसन्न रहें।",
          caution: "अधिकार के पद पर रहते हुए कभी अहंकारी भाषा न बोलें; गुरुजनों का अनादर न करें।",
        },
        {
          area: "विवाह एवं शांति",
          remedy: "गुरुवार को देशी गाय को आटे की लोई में थोड़ी हल्दी व गुड़ मिलाकर खिलाएं।",
          caution: "शयनकक्ष या घर में बंद पड़ी घड़ियां, चटके हुए दर्पण या जंग लगे लोहे के औजार न रखें।",
        },
        {
          area: "स्वास्थ्य एवं स्थिरता",
          remedy: "चांदी के गिलास अथवा बर्तन से जल पिएं। यह चंद्रमा को बलवान करता है, राहु को शांत करता है और मानसिक शांति देता है।",
          caution: "देर रात तक व्यर्थ चिंतन से बचें और दिन के समय पर्याप्त जल पिएं।",
        },
      ]
    : [
        {
          area: "Wealth",
          remedy: "Apply a small Tilak of genuine Saffron (Kesar) on your forehead, navel, and tongue every morning. Keep a square piece of pure solid silver in your wallet.",
          caution: "Never accept electronic gadgets, dark blue, or black apparel free of charge from acquaintances.",
        },
        {
          area: "Career",
          remedy: "Treat blue-collar staff, drivers, security personnel, and laborers with utmost generosity. Pay fair wages promptly to keep Shani pleased.",
          caution: "Avoid arrogant speech when in positions of command; never insult mentors or teachers.",
        },
        {
          area: "Marriage & Peace",
          remedy: "Feed a desi cow with fresh dough (loi) mixed with a pinch of turmeric and jaggery on Thursdays.",
          caution: "Never keep non-functional clocks, cracked mirrors, or rusted iron tools in the bedroom or living area.",
        },
        {
          area: "General Health",
          remedy: "Drink water from a silver cup or silver vessel. It harmonizes the Moon, pacifies Rahu, and brings sharp mental clarity.",
          caution: "Avoid late-night overthinking and stay hydrated during sunlit hours.",
        },
      ];

  return {
    tevaType,
    kismatKaGrah: {
      planet: kismatPlanet,
      house: kismatHouse,
      role: kismatRole,
    },
    sleepingHouses,
    awakenedHouses,
    specialYogas,
    karmicDebts,
    lalKitabRemedies,
  };
}
