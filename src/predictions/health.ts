import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { HealthPrediction, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getHealthPrediction(kundli: Kundli, options?: PredictionOptions): HealthPrediction {
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

  const lagnaRashi = kundli.ascendant ? kundli.ascendant.rashi : 1;
  const lagnaRashiIdx = (lagnaRashi - 1 + 12) % 12;
  const lagnaLord = RASHI_LORDS[lagnaRashiIdx] || "Mars";
  const lagnaLordHouse = getPlanetHouse(lagnaLord);

  // 6th House (Roga / Acute illnesses)
  const house6 = houses.find((h) => h.number === 6) || { number: 6, rashi: ((lagnaRashi + 4) % 12) + 1, planets: [] as string[] };
  const sixthLord = RASHI_LORDS[(house6.rashi - 1 + 12) % 12];
  const sixthLordHouse = getPlanetHouse(sixthLord);
  const sixthSAV = sav ? sav.byHouse[5] : 28;

  // 8th House (Randhra / Chronic / Longevity / Surgery)
  const house8 = houses.find((h) => h.number === 8) || { number: 8, rashi: ((lagnaRashi + 6) % 12) + 1, planets: [] as string[] };
  const eighthLord = RASHI_LORDS[(house8.rashi - 1 + 12) % 12];
  const eighthLordHouse = getPlanetHouse(eighthLord);
  const eighthSAV = sav ? sav.byHouse[7] : 28;

  // 12th House (Hospitalization / Sleep)
  const house12 = houses.find((h) => h.number === 12) || { number: 12, rashi: ((lagnaRashi + 10) % 12) + 1, planets: [] as string[] };
  const twelfthLord = RASHI_LORDS[(house12.rashi - 1 + 12) % 12];

  // 1. Badhaka Sthana & Badhakesh determination
  // Movable (1, 4, 7, 10): 11th house
  // Fixed (2, 5, 8, 11): 9th house
  // Dual (3, 6, 9, 12): 7th house
  let badhakaHouseNum = 11;
  let lagnaType: 'Movable (Chara)' | 'Fixed (Sthira)' | 'Dual (Dwisvabhava)' = 'Movable (Chara)';
  if ([1, 4, 7, 10].includes(lagnaRashi)) {
    badhakaHouseNum = 11;
    lagnaType = 'Movable (Chara)';
  } else if ([2, 5, 8, 11].includes(lagnaRashi)) {
    badhakaHouseNum = 9;
    lagnaType = 'Fixed (Sthira)';
  } else {
    badhakaHouseNum = 7;
    lagnaType = 'Dual (Dwisvabhava)';
  }

  const badhakaHouse = houses.find((h) => h.number === badhakaHouseNum) || { rashi: 11, planets: [] as string[] };
  const badhakesh = RASHI_LORDS[(badhakaHouse.rashi - 1 + 12) % 12];
  const badhakeshHouse = getPlanetHouse(badhakesh);

  // 2. Maraka Planets (2nd and 7th lords)
  const house2 = houses.find((h) => h.number === 2) || { rashi: ((lagnaRashi) % 12) + 1, planets: [] as string[] };
  const house7 = houses.find((h) => h.number === 7) || { rashi: ((lagnaRashi + 5) % 12) + 1, planets: [] as string[] };
  const secondLord = RASHI_LORDS[(house2.rashi - 1 + 12) % 12];
  const seventhLord = RASHI_LORDS[(house7.rashi - 1 + 12) % 12];
  const primaryMarakas = Array.from(new Set([secondLord, seventhLord]));
  const secondaryMarakas: string[] = [];
  if (house2.planets && house2.planets.length > 0) secondaryMarakas.push(...house2.planets);
  if (house7.planets && house7.planets.length > 0) secondaryMarakas.push(...house7.planets);

  // 3. Health Score Calculation
  let healthScore = 75; // Baseline
  if ([1, 4, 5, 9, 10, 11].includes(lagnaLordHouse)) healthScore += 12; // Well placed Lagna lord
  if ([6, 8, 12].includes(lagnaLordHouse)) healthScore -= 15; // Lagna lord in Dusthana
  if (sixthSAV <= 26) healthScore += 8; // Low bindus in 6th means fewer illnesses
  if (sixthSAV >= 34) healthScore -= 8; // High 6th bindus = more prone to diseases
  if (eighthSAV >= 30) healthScore += 6; // High 8th bindus favors endurance & longevity
  if (eighthSAV < 24) healthScore -= 6;

  // Benefics in Kendra/Trikona boost health
  const kendrasTrikonas = [1, 4, 5, 7, 9, 10];
  for (const hNum of kendrasTrikonas) {
    const h = houses.find(house => house.number === hNum);
    if (!h) continue;
    if (h.planets.includes("Jupiter")) healthScore += 6;
    if (h.planets.includes("Venus")) healthScore += 4;
  }

  // Malefics in 6th house (Upachaya) are actually great for conquering illness (BPHS rule)
  if (house6.planets.includes("Mars") || house6.planets.includes("Saturn") || house6.planets.includes("Sun")) {
    healthScore += 6;
  }
  // Malefics in 8th or 12th require vigilance
  if (house8.planets.includes("Rahu") || house8.planets.includes("Mars")) healthScore -= 8;
  if (house12.planets.includes("Rahu") || house12.planets.includes("Saturn")) healthScore -= 6;

  healthScore = Math.max(35, Math.min(95, healthScore));

  let healthRating: 'Robust & Vibrant' | 'Good with Minor Sensitivities' | 'Moderate / Routine Care Needed' | 'Vulnerable / Medical Vigilance Advised' = 'Good with Minor Sensitivities';
  if (healthScore >= 80) healthRating = 'Robust & Vibrant';
  else if (healthScore >= 68) healthRating = 'Good with Minor Sensitivities';
  else if (healthScore >= 52) healthRating = 'Moderate / Routine Care Needed';
  else healthRating = 'Vulnerable / Medical Vigilance Advised';

  // 4. Longevity Assessment (Ayurdaya category)
  let longevityCategory: 'Deerghayu (Long Life: 75+ yrs)' | 'Madhyayu (Medium Life: 50-75 yrs)' | 'Alpayu (Caution: <50 yrs)' = 'Deerghayu (Long Life: 75+ yrs)';
  let longevityDesc = "";
  let longevityBasis = "";

  const saturnHouse = getPlanetHouse("Saturn");
  const isLagneshStrong = [1, 4, 5, 9, 10, 11].includes(lagnaLordHouse);
  const isEighthLordStrong = [1, 4, 5, 8, 9, 10, 11].includes(eighthLordHouse);

  if (isLagneshStrong && isEighthLordStrong && eighthSAV >= 26) {
    longevityCategory = 'Deerghayu (Long Life: 75+ yrs)';
    longevityBasis = lang === 'hi'
      ? `लग्नेश (${getLocalizedPlanet(lagnaLord, lang)}) और अष्टमेश (${getLocalizedPlanet(eighthLord, lang)}) दोनों शुभ भावों में स्थित हैं एवं अष्टम भाव में ${eighthSAV} अष्टकवर्ग बिंदु हैं।`
      : `Both Lagna Lord (${lagnaLord}) and 8th Lord (${eighthLord}) occupy supportive positions with ${eighthSAV} SAV bindus in the 8th house.`;
    longevityDesc = lang === 'hi'
      ? `दीर्घायु योग: प्राकृतिक जीवन शक्ति और रोग प्रतिरोधक क्षमता उत्कृष्ट है, जो सुदीर्घ एवं सक्रिय जीवन का संकेत देती है।`
      : `Purna Ayurdaya (Deerghayu): Outstanding natural endurance and cellular recovery capacity indicating a long, active life.`;
  } else if (isLagneshStrong || eighthSAV >= 28) {
    longevityCategory = 'Madhyayu (Medium Life: 50-75 yrs)';
    longevityBasis = lang === 'hi'
      ? `लग्नेश अथवा अष्टमेश में से एक सशक्त है एवं शनि भाव ${saturnHouse} में स्थित होकर मध्यम से दीर्घायु की पुष्टि करता है।`
      : `Balanced planetary endurance supported by Saturn in House ${saturnHouse} and stable Ashtakavarga metrics.`;
    longevityDesc = lang === 'hi'
      ? `मध्यायु से दीर्घायु योग: नियमित दिनचर्या, योग और समय पर स्वास्थ्य जांच से सुदीर्घ और निरोगी जीवन प्राप्त होता है।`
      : `Madhyayu into Deerghayu: Stable longevity potential which flourishes with disciplined lifestyle, balanced nutrition, and preventive medical care.`;
  } else {
    longevityCategory = 'Madhyayu (Medium Life: 50-75 yrs)';
    longevityBasis = lang === 'hi'
      ? `रोग व अष्टम भाव का प्रभाव अधिक है। महामृत्युंजय जप एवं सात्विक जीवनशैली स्वास्थ्य संवर्धन में सहायक हैं।`
      : `Lagna and 8th lord need remedial reinforcement through Ayurvedic habits and protective mantras.`;
    longevityDesc = lang === 'hi'
      ? `सतर्कता एवं सावधानी अपेक्षित: स्वास्थ्य के प्रति संवेदनशील समय में चिकित्सीय परामर्श व वैदिक शांति का सहारा लें।`
      : `Vigilance Advised: Proactive health screening and stress management recommended during testing dasha transits.`;
  }

  // 5. Ayurvedic Tridosha Assessment
  // Signs: Fire(1,5,9) -> Pitta, Earth(2,6,10) -> Vata/Kapha, Air(3,7,11) -> Vata, Water(4,8,12) -> Kapha
  const moonRashi = kundli.planets.Moon?.rashi || 1;
  const fireSigns = [1, 5, 9];
  const earthSigns = [2, 6, 10];
  const airSigns = [3, 7, 11];
  const waterSigns = [4, 8, 12];

  let pittaScore = 0;
  let vataScore = 0;
  let kaphaScore = 0;

  if (fireSigns.includes(lagnaRashi)) pittaScore += 3;
  if (airSigns.includes(lagnaRashi)) vataScore += 3;
  if (earthSigns.includes(lagnaRashi)) vataScore += 2, kaphaScore += 1;
  if (waterSigns.includes(lagnaRashi)) kaphaScore += 3;

  if (fireSigns.includes(moonRashi)) pittaScore += 2;
  if (airSigns.includes(moonRashi)) vataScore += 2;
  if (earthSigns.includes(moonRashi)) vataScore += 1, kaphaScore += 1;
  if (waterSigns.includes(moonRashi)) kaphaScore += 2;

  let primaryDosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Tridoshic' = 'Vata-Pitta';
  if (pittaScore > vataScore + 1 && pittaScore > kaphaScore + 1) primaryDosha = 'Pitta';
  else if (vataScore > pittaScore + 1 && vataScore > kaphaScore + 1) primaryDosha = 'Vata';
  else if (kaphaScore > pittaScore + 1 && kaphaScore > vataScore + 1) primaryDosha = 'Kapha';
  else if (pittaScore >= 3 && vataScore >= 3) primaryDosha = 'Vata-Pitta';
  else if (pittaScore >= 3 && kaphaScore >= 3) primaryDosha = 'Pitta-Kapha';
  else if (vataScore >= 3 && kaphaScore >= 3) primaryDosha = 'Vata-Kapha';
  else primaryDosha = 'Tridoshic';

  const doshaDietRecs = lang === 'hi' ? [
    primaryDosha.includes('Pitta') ? "शीतल, सुपाच्य एवं मधुर रस युक्त आहार लें; अत्यधिक मिर्च, खट्टा व तला-भुना सीमित करें।" : "ताजा एवं गुनगुना भोजन लें, बासी व ठंडी चीजों से परहेज करें।",
    primaryDosha.includes('Vata') ? "नियमित तेल मालिश (अभ्यंग), भरपूर नींद एवं नियमित भोजन का समय निर्धारित रखें।" : "प्रातःकाल प्राणायाम और नियमित व्यायाम से चयापचय (metabolism) संतुलित रखें।",
    primaryDosha.includes('Kapha') ? "हल्का व उष्ण आहार लें, दिन में सोने से बचें और त्रिफला या गुनगुने जल का सेवन करें।" : "भरपूर जल पिएं और मानसिक तनाव को शांत रखने हेतु ध्यान करें।"
  ] : [
    primaryDosha.includes('Pitta') ? "Favor cooling, sweet, and moderately spiced meals; avoid excessive chilies, sour condiments, and oily foods." : "Consume freshly prepared warm meals; minimize chilled and stale food items.",
    primaryDosha.includes('Vata') ? "Practice warm sesame oil massage (Abhyanga), maintain fixed sleep cycles, and stay grounded." : "Incorporate daily morning Pranayama and moderate cardio to keep metabolic fire active.",
    primaryDosha.includes('Kapha') ? "Opt for light, warm, and bitter/astringent foods; avoid daytime sleeping and hydrate with lukewarm water." : "Stay well hydrated and practice regular meditation to dispel cognitive fatigue."
  ];

  // 6. Organ Vulnerabilities & Medical Astrology Mapping
  const organVulnerabilities: HealthPrediction['organVulnerabilities'] = [];

  // Check Sun (Heart, Bones, Eyes)
  const sunHouse = getPlanetHouse("Sun");
  if ([6, 8, 12].includes(sunHouse) || house6.planets.includes("Sun") || house8.planets.includes("Sun")) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "हृदय, नेत्र एवं अस्थि तंत्र (हड्डियां)" : "Cardiovascular, Bones & Eyesight",
      rulingPlanetOrHouse: "Sun (Surya)",
      severity: "Moderate",
      guidance: lang === 'hi'
        ? "सूर्य 6/8/12 भाव से संबद्ध है। रक्तचाप (BP) और नेत्र दृष्टि का नियमित परीक्षण कराएं। प्रातः सूर्य नमस्कार व तांबे के पात्र का जल लाभप्रद है।"
        : "Sun is linked with trik houses. Monitor blood pressure, bone mineral density, and eye health regularly. Morning Sun salutations are highly beneficial."
    });
  }

  // Check Moon (Mind, Fluids, Lungs, Sleep)
  const moonHouse = getPlanetHouse("Moon");
  if ([6, 8, 12].includes(moonHouse) || house6.planets.includes("Moon") || house8.planets.includes("Moon") || [house6, house8].some(h => h.planets.includes("Moon"))) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "मानसिक शांति, नींद एवं श्वसन तंत्र" : "Nervous Sensitivity, Sleep & Respiratory System",
      rulingPlanetOrHouse: "Moon (Chandra)",
      severity: "Moderate",
      guidance: lang === 'hi'
        ? "चंद्रमा भाव " + moonHouse + " में है। मानसिक तनाव, अनिद्रा और कफ की संवेदनशीलता रह सकती है। ध्यान, शंख प्रक्षालन व चांदी का उपयोग शुभ है।"
        : `Moon in House ${moonHouse} suggests emotional sensitivity, sleep irregularities, or lymphatic flux. Regular meditation and deep breathing provide stability.`
    });
  }

  // Check Mars (Blood, Muscles, Surgery/Accidents)
  const marsHouse = getPlanetHouse("Mars");
  const house1Planets = houses.find(h => h.number === 1)?.planets || [];
  if ([1, 6, 8, 12].includes(marsHouse) && (house6.planets.includes("Mars") || house8.planets.includes("Mars") || house1Planets.includes("Mars"))) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "रक्त संचार, पित्त एवं मांसपेशियों में तनाव" : "Blood Circulation, Muscular System & Inflammatory Prone",
      rulingPlanetOrHouse: "Mars (Mangal)",
      severity: [6, 8].includes(marsHouse) ? "High" : "Moderate",
      guidance: lang === 'hi'
        ? "मंगल की स्थिति चोट, रक्त अशुद्धि या जलन/पित्त की ओर संकेत करती है। वाहन सावधानी से चलाएं एवं क्रोध व जल्दबाजी से बचें।"
        : "Mars indicates prone to sudden inflammation, muscular strains, or heat spikes. Avoid rushed driving and stay calm during fiery debates."
    });
  }

  // Check Mercury (Nerves, Skin, Speech)
  const mercHouse = getPlanetHouse("Mercury");
  if ([6, 8, 12].includes(mercHouse) || house6.planets.includes("Mercury")) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "स्नायु तंत्र (Nerves), त्वचा एवं एलर्जी" : "Nervous System, Skin & Digestive Allergies",
      rulingPlanetOrHouse: "Mercury (Budha)",
      severity: "Mild",
      guidance: lang === 'hi'
        ? "बुध का प्रभाव त्वचा की एलर्जी और तंत्रिका तंत्र पर हो सकता है। हरी सब्जियां, पर्याप्त जल और तनाव प्रबंधन लाभकारी हैं।"
        : "Mercury influence requires shielding the nervous system from screen burnout and skin allergies. Hydration and gut health are key."
    });
  }

  // Check Saturn (Joints, Knees, Chronic pains)
  if ([6, 8, 12].includes(saturnHouse) || house6.planets.includes("Saturn") || house8.planets.includes("Saturn")) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "जोड़ों, घुटनों एवं वात रोग (गठिया)" : "Joints, Knees, Teeth & Chronic Rheumatic Tendency",
      rulingPlanetOrHouse: "Saturn (Shani)",
      severity: "Moderate",
      guidance: lang === 'hi'
        ? "शनि हड्डियों के जोड़ों और वात का कारक है। नियमित व्यायाम, कैल्शियम युक्त आहार और तिल के तेल की मालिश से जोड़ों को स्वस्थ रखें।"
        : "Saturn governs skeletal joints and Vata. Ensure adequate Vitamin D3, calcium, and regular mobility exercises to prevent stiffness."
    });
  }

  // Check Rahu / Ketu in 6th or 8th
  const rahuHouse = getPlanetHouse("Rahu");
  const ketuHouse = getPlanetHouse("Ketu");
  if ([6, 8].includes(rahuHouse) || [6, 8].includes(ketuHouse)) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "रोग प्रतिरोधक तंत्र एवं अज्ञात संक्रमण" : "Immune Vulnerability & Difficult-to-Diagnose Allergies",
      rulingPlanetOrHouse: [6, 8].includes(rahuHouse) ? "Rahu" : "Ketu",
      severity: "Moderate",
      guidance: lang === 'hi'
        ? "राहु/केतु का प्रभाव खान-पान में संवेदनशीलता और अनपेक्षित संक्रमण दे सकता है। स्वच्छ एवं सात्विक भोजन ग्रहण करें।"
        : "Nodes in dusthanas advise against junk food and sudden medication self-dosing. Maintain high gut immunity."
    });
  }

  // Default fallback if no harsh placements
  if (organVulnerabilities.length === 0) {
    organVulnerabilities.push({
      organOrSystem: lang === 'hi' ? "सामान्य चयापचय एवं पाचन तंत्र" : "General Metabolic & Digestive System",
      rulingPlanetOrHouse: "Lagna Lord",
      severity: "Mild",
      guidance: lang === 'hi'
        ? "कुंडली में प्रमुख स्वास्थ्य भाव सुरक्षित हैं। सामान्य मौसमी सावधानियां और नियमित दिनचर्या पर्याप्त हैं।"
        : "Health houses are predominantly well protected. Standard seasonal mindfulness and balanced diet are sufficient."
    });
  }

  // Badhaka impact text
  const badhakaImpact = lang === 'hi'
    ? `${lagnaType} लग्न हेतु ${badhakaHouseNum}वां भाव बाधक स्थान है, जिसके स्वामी ${getLocalizedPlanet(badhakesh, lang)} (भाव ${badhakeshHouse} में) हैं। बाधकेश की दशा अथवा गोचर में स्वास्थ्य संबंधी अवरोधों के प्रति जागरूक रहें।`
    : `For ${lagnaType} Ascendant, House ${badhakaHouseNum} is the Badhaka Sthana ruled by ${badhakesh} (placed in House ${badhakeshHouse}). Keep extra vigilance against stubborn, slow-resolving ailments during ${badhakesh}'s major dasha periods.`;

  // Maraka explanation
  const marakaExplanation = lang === 'hi'
    ? `द्वितीयेश (${getLocalizedPlanet(secondLord, lang)}) और सप्तमेश (${getLocalizedPlanet(seventhLord, lang)}) मारक स्वामी हैं। इनकी दशा-अंतर्दशा में शरीर की ऊर्जा संरक्षण एवं सात्विक दिनचर्या आवश्यक है।`
    : `Primary Maraka lords are 2nd lord (${secondLord}) and 7th lord (${seventhLord}). Conserve vitality and manage stress proactively when their antardashas run.`;

  // Critical Age Windows
  const criticalAgeWindows = lang === 'hi'
    ? ["आयु 28-30 वर्ष (शनि प्रथम चक्र पूर्णता - शारीरिक व मानसिक अनुशासन की परीक्षा)", "आयु 42-45 वर्ष (राहु परिपक्वता चक्र - जीवनशैली व हृदय/पाचन जांच अनिवार्य)", "आयु 56-60 वर्ष (शनि द्वितीय चक्र - जोड़ों व हड्डियों का विशेष ध्यान रखें)"]
    : ["Ages 28-30 (Saturn Return: Physical endurance restructuring & postural discipline)", "Ages 42-45 (Rahu Maturation: Metabolic, cardiovascular and lifestyle screening essential)", "Ages 56-60 (Second Saturn Return: Bone density, joint flexibility & cardiac care)"];

  // Remedies and precautions
  const remediesAndPrecautions = lang === 'hi'
    ? [
        "प्रातःकाल भगवान सूर्य को तांबे के लोटे से जल (अर्घ्य) अर्पित करें और 'ॐ घृणि सूर्याय नमः' का जाप करें।",
        "रोग निवारण एवं दीर्घायु हेतु महामृत्युंजय मंत्र: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात्॥' का नित्य 1 माला जप करें।",
        "शनिवार को असहाय व्यक्तियों को भोजन या काले तिल/तेल का दान करें, इससे असाध्य रोगों से रक्षा होती है।",
        "आयुर्वेदिक दिनचर्या का पालन करें, नियमित प्राणायाम (कपालभाति, अनुलोम-विलोम) से फेफड़ों व तंत्रिका तंत्र को मजबूत बनाएं।"
      ]
    : [
        "Offer water (Arghya) to the rising Sun daily from a copper vessel and chant 'Om Ghrinih Suryaya Namah' to fortify cellular vitality.",
        "Chant the Maha Mrityunjaya Mantra daily (1 mala / 108 times) for longevity, vitality, and cellular healing.",
        "Practice philanthropic acts on Saturdays (donating warm clothes, feeding animals) to pacify chronic Saturnine ailments.",
        "Adopt an Ayurvedic lifestyle with morning Pranayama (Anulom-Vilom and Kapalbhati) to oxygenate tissues and calm the autonomic nervous system."
      ];

  const vitalityAndImmunity = lang === 'hi'
    ? `स्वास्थ्य सूचकांक ${healthScore}/100 (${healthRating})। लग्न भाव ${kundli.ascendant ? kundli.ascendant.rashiName : ""} एवं लग्नेश ${getLocalizedPlanet(lagnaLord, lang)} भाव ${lagnaLordHouse} में स्थित होकर जीवटता का आधार बनाते हैं।`
    : `Vitality index stands at ${healthScore}/100 (${healthRating}). Grounded by Lagna in ${kundli.ascendant?.rashiName || ""} with Lagna Lord ${lagnaLord} placed in House ${lagnaLordHouse}.`;

  return {
    healthScore,
    healthRating,
    vitalityAndImmunity,
    longevityAssessment: {
      category: longevityCategory,
      description: longevityDesc,
      astrologicalBasis: longevityBasis,
    },
    badhakaSthana: {
      house: badhakaHouseNum,
      lord: badhakesh,
      lagnaType,
      impact: badhakaImpact,
    },
    marakaPlanets: {
      primaryMarakas,
      secondaryMarakas,
      explanation: marakaExplanation,
    },
    ayurvedicConstitution: {
      primaryDosha,
      explanation: lang === 'hi'
        ? `लग्न एवं चंद्र राशि तत्वों के आधार पर आपकी प्राथमिक प्रकृति ${primaryDosha} है।`
        : `Based on your Ascendant and Moon sign elemental distribution, your dominant Ayurvedic constitution is ${primaryDosha}.`,
      dietLifestyleRecommendations: doshaDietRecs,
    },
    organVulnerabilities,
    criticalAgeWindows,
    remediesAndPrecautions,
  };
}
