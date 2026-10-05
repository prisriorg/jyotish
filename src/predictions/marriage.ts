import { predictionDate, validatePredictionChart } from "./validation";
import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { checkMangalDosha } from "../matching/index";
import { MarriagePrediction, PredictionOptions } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";
import { getArudhaPadas } from "../kundli/arudhas";

import { Language } from "../i18n/types";
import { marriageI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getMarriagePrediction(
  kundli: Kundli,
  options?: PredictionOptions & { gender?: "male" | "female" | "other" }
): MarriagePrediction {
  validatePredictionChart(kundli);
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const house7 = houses.find((h) => h.number === 7) || houses[6];
  // 7th lord & planets
  const rashi7Idx = ((house7?.rashi || 7) - 1 + 12) % 12;
  const lord7 = RASHI_LORDS[rashi7Idx];
  const planetsIn7 = house7?.planets || [];

  // 2nd and 11th lords (family & union)
  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const lord2 = RASHI_LORDS[((house2?.rashi || 2) - 1 + 12) % 12];
  const lord11 = RASHI_LORDS[((house11?.rashi || 11) - 1 + 12) % 12];

  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };

  // Navamsha (D9) 7th House & Occupants
  const d9 = kundli.vargas?.D9;
  const d9AscendantRashi = d9?.ascendant?.rashi || 1;
  const d9House7Rashi = ((d9AscendantRashi + 6 - 1) % 12) + 1;
  const d9House7RashiName = rashiNames[d9House7Rashi - 1] || "";
  const d9House7Lord = RASHI_LORDS[d9House7Rashi - 1];

  // Jaimini Karakas
  const jaimini = getJaiminiKarakas(kundli, { lang });
  const dkPlanet = jaimini.darakaraka.planet;

  // Jaimini Arudha Padas (Upapada Lagna & Dara Pada)
  let padas = kundli.arudhaPadas;
  if (!padas) {
    try {
      padas = getArudhaPadas(kundli);
    } catch {
      // fallback if arudhas cannot be calculated
    }
  }
  const ulPada = padas?.a12_ul || padas?.all?.find((p: any) => p.houseNumber === 12);
  const a7Pada = padas?.a7 || padas?.all?.find((p: any) => p.houseNumber === 7);
  const ulLord = ulPada ? RASHI_LORDS[(ulPada.rashi - 1 + 12) % 12] : "";

  // Marriage significators (Lords of 7th, 2nd, 11th, natural karakas Venus & Jupiter, or planets in 7th)
  const significators = new Set<string>([lord7, lord2, lord11, "Venus", "Jupiter", ...planetsIn7]);
  if (d9House7Lord) significators.add(d9House7Lord);
  if (dkPlanet) significators.add(dkPlanet);
  if (ulLord) significators.add(ulLord);

  // Analyze Dasha tree for potential timing years
  const potentialYears = new Set<number>();
  let currentDashaFavorable = false;
  let dashaSupportExplanation = "";

  const dashaTree = kundli.dasha?.mahadashas || [];
  const now = predictionDate(options);

  const horizonEnd = new Date(now.getTime());
  horizonEnd.setUTCFullYear(horizonEnd.getUTCFullYear() + 10);
  for (const maha of dashaTree) {
    for (const antar of maha.antars || []) {
      const start = Math.max(new Date(maha.startTime).getTime(), new Date(antar.startTime).getTime());
      const end = Math.min(new Date(maha.endTime).getTime(), new Date(antar.endTime).getTime());
      if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) continue;
      if (!significators.has(antar.planet) && !significators.has(maha.planet)) continue;
      if (now.getTime() >= start && now.getTime() < end) {
        currentDashaFavorable = true;
        const localizedMaha = getLocalizedPlanet(maha.planet, lang);
        const localizedAntar = getLocalizedPlanet(antar.planet, lang);
        let connectionReason = "";
        if (maha.planet === lord7 || antar.planet === lord7) connectionReason = lang === 'hi' ? "सप्तमेश (विवाह भाव स्वामी)" : "7th house lord";
        else if (maha.planet === "Venus" || antar.planet === "Venus") connectionReason = lang === 'hi' ? "नैसर्गिक विवाह कारक शुक्र" : "natural marriage karaka Venus";
        else if (maha.planet === "Jupiter" || antar.planet === "Jupiter") connectionReason = lang === 'hi' ? "देवगुरु बृहस्पति" : "auspicious Jupiter";
        else if (maha.planet === dkPlanet || antar.planet === dkPlanet) connectionReason = lang === 'hi' ? "जैमिनी दाराकारक" : "Jaimini Darakaraka";
        else connectionReason = lang === 'hi' ? "विवाह संबंध कारक" : "marriage significator";

        dashaSupportExplanation = lang === 'hi'
          ? `${localizedMaha}/${localizedAntar} की सक्रिय अवधि ${connectionReason} से प्रत्यक्ष संबंध रखती है, जो संबंध व विवाह हेतु शास्त्रीय रूप से अनुकूल समय है।`
          : `Current ${maha.planet}/${antar.planet} period actively activates ${connectionReason}, creating a classically promising window for marriage.`;
      }
      const windowStart = Math.max(start, now.getTime());
      const windowEnd = Math.min(end, horizonEnd.getTime());
      if (windowStart >= windowEnd) continue;
      for (let year = new Date(windowStart).getUTCFullYear(); year <= new Date(windowEnd - 1).getUTCFullYear(); year++) {
        potentialYears.add(year);
      }
    }
  }
  const sortedYears = Array.from(potentialYears).sort((a, b) => a - b).slice(0, 4);
  if (!dashaSupportExplanation) {
    dashaSupportExplanation = lang === 'hi'
      ? 'वर्तमान अवधि में विवाह कारक ग्रहों का प्रत्यक्ष संयोग नहीं है। आगामी दशा-अंतर्दशा अवधि में विवाह के प्रबल योग निर्मित होंगे।'
      : 'Current dasha period lacks direct marriage significator alignment; primary matrimonial window activates in upcoming sub-periods.';
  }

  let favorableAgeRange = lang === 'hi' ? 'निर्धारित नहीं' : 'Not established';
  if (sortedYears.length > 0) {
    const rawBirthDate = kundli.birthDetails?.rawDate || kundli.birthDetails?.date;
    if (rawBirthDate) {
      const birthYear = new Date(rawBirthDate).getUTCFullYear();
      if (Number.isFinite(birthYear)) {
        const minYear = sortedYears[0];
        const maxYear = sortedYears[sortedYears.length - 1];
        const minAge = Math.max(18, minYear - birthYear);
        const maxAge = Math.max(minAge + 2, maxYear - birthYear + 1);
        favorableAgeRange = lang === 'hi' ? `${minAge} - ${maxAge} वर्ष` : `${minAge} - ${maxAge} years`;
      }
    } else {
      favorableAgeRange = lang === 'hi' ? '25 - 30 वर्ष' : '25 - 30 years';
    }
  }

  // Partner characteristics based on 7th sign and occupants
  const signDescriptions: Record<string, { nature: string; traits: string[]; direction: string }> = {
    Aries: {
      nature: "Dynamic, energetic, courageous, and direct in communication.",
      traits: ["High initiative", "Independent mindset", "Passionate"],
      direction: "East or active urban environment",
    },
    Taurus: {
      nature: "Grounded, graceful, values financial security and aesthetic comfort.",
      traits: ["Loyal", "Artistic appreciation", "Practical"],
      direction: "South or flourishing family background",
    },
    Gemini: {
      nature: "Intellectual, curious, witty, and highly communicative.",
      traits: ["Adaptable", "Loves learning & discussions", "Youthful energy"],
      direction: "West or tech/commercial background",
    },
    Cancer: {
      nature: "Empathetic, deeply caring, family-oriented, and emotionally supportive.",
      traits: ["Intuitive", "Protective", "Nurturing"],
      direction: "North or ancestral roots near water",
    },
    Leo: {
      nature: "Dignified, proud, confident, with natural leadership and magnetic presence.",
      traits: ["High self-respect", "Generous", "Strong professional ambition"],
      direction: "East or reputed / well-regarded family",
    },
    Virgo: {
      nature: "Analytical, organized, service-oriented, with sharp eye for detail.",
      traits: ["Methodical", "Reliable", "Health-conscious"],
      direction: "South or academic / administrative background",
    },
    Libra: {
      nature: "Charming, socially poised, balanced, with high diplomacy and aesthetic sense.",
      traits: ["Diplomatic", "Fair-minded", "Cultured & artistic"],
      direction: "West or creative / commercial circles",
    },
    Scorpio: {
      nature: "Intense, deeply loyal, perceptive, with an investigative and private nature.",
      traits: ["Emotionally profound", "Resilient", "Determined"],
      direction: "North or transformative / research background",
    },
    Sagittarius: {
      nature: "Optimistic, philosophical, principled, loves freedom and higher learning.",
      traits: ["Truthful", "Inspirational", "Travel-loving"],
      direction: "East or educational / spiritual background",
    },
    Capricorn: {
      nature: "Pragmatic, disciplined, hardworking, and deeply responsible.",
      traits: ["Patient", "Career-focused", "Steadfast"],
      direction: "South or established industry background",
    },
    Aquarius: {
      nature: "Progressive, unconventional, humanitarian, and intellectually independent.",
      traits: ["Forward-thinking", "Egalitarian", "Tech-savvy"],
      direction: "West or innovative / modern background",
    },
    Pisces: {
      nature: "Compassionate, gentle, spiritual, with creative and intuitive imagination.",
      traits: ["Kind-hearted", "Imaginative", "Devotional"],
      direction: "North or peaceful retreat background",
    },
  };

  const signDescriptionsHi: Record<string, { nature: string; traits: string[]; direction: string }> = {
    Aries: {
      nature: "ऊर्जावान, साहसी, आत्मविश्वासी और स्पष्टवादी जीवनसाथी।",
      traits: ["उच्च पहल क्षमता", "स्वतंत्र विचार", "उत्साही"],
      direction: "पूर्व दिशा या गतिशील शहरी परिवेश",
    },
    Taurus: {
      nature: "स्थिर, सौम्य, कलाप्रिय, वित्तीय सुरक्षा और घरेलू सुख को महत्व देने वाला।",
      traits: ["निष्ठावान", "कलात्मक रुचि", "व्यावहारिक"],
      direction: "दक्षिण दिशा या संपन्न पारिवारिक पृष्ठभूमि",
    },
    Gemini: {
      nature: "बुद्धिमान, जिज्ञासु, विनोदप्रिय और संवाद में अत्यंत कुशल।",
      traits: ["अनुकूलनशील", "अध्ययन व चर्चा प्रिय", "युवा ऊर्जा"],
      direction: "पश्चिम दिशा या तकनीकी/व्यापारिक पृष्ठभूमि",
    },
    Cancer: {
      nature: "संवेदनशील, अत्यंत स्नेही, पारिवारिक मूल्यों का आदर करने वाला और सहयोगी।",
      traits: ["सहज ज्ञानी", "सुरक्षात्मक", "पोषण करने वाला"],
      direction: "उत्तर दिशा या जल स्रोत के निकट पैतृक संबंध",
    },
    Leo: {
      nature: "स्वाभिमानी, प्रभावशाली, आत्मविश्वास से परिपूर्ण और स्वाभाविक नेतृत्व क्षमता युक्त।",
      traits: ["आत्म-सम्मान", "उदार", "सुदृढ़ व्यावसायिक महत्वाकांक्षा"],
      direction: "पूर्व दिशा या प्रतिष्ठित/सम्मानित परिवार",
    },
    Virgo: {
      nature: "व्यावहारिक, व्यवस्थित, विश्लेषणात्मक और कर्तव्यनिष्ठ।",
      traits: ["व्यवस्थित कार्यशैली", "विश्वसनीय", "स्वास्थ्य के प्रति सजग"],
      direction: "दक्षिण दिशा या शैक्षणिक/प्रशासनिक पृष्ठभूमि",
    },
    Libra: {
      nature: "आकर्षक, संतुलित, सामाजिक रूप से प्रतिष्ठित और सामंजस्य स्थापित करने वाला।",
      traits: ["कूटनीतिक", "न्यायप्रिय", "सुसंस्कृत व सुरुचिपूर्ण"],
      direction: "पश्चिम दिशा या रचनात्मक/व्यापारिक क्षेत्र",
    },
    Scorpio: {
      nature: "गहन, निष्ठावान, भावनात्मक रूप से दृढ़ और गंभीर स्वभाव वाला।",
      traits: ["भावनात्मक रूप से गंभीर", "दृढ़निश्चयी", "सहनशील"],
      direction: "उत्तर दिशा या शोध/रूपांतरणकारी पृष्ठभूमि",
    },
    Sagittarius: {
      nature: "आशावादी, सिद्धांतवादी, दार्शनिक और खुले विचारों वाला।",
      traits: ["सत्यनिष्ठ", "प्रेरणादायक", "भ्रमणप्रिय"],
      direction: "पूर्व दिशा या शैक्षणिक/आध्यात्मिक पृष्ठभूमि",
    },
    Capricorn: {
      nature: "अनुशासित, परिश्रमी, व्यावहारिक और करियर के प्रति अत्यंत गंभीर।",
      traits: ["धैर्यवान", "करियर-केंद्रित", "अडिग"],
      direction: "दक्षिण दिशा या स्थापित उद्योग पृष्ठभूमि",
    },
    Aquarius: {
      nature: "प्रगतिशील, आधुनिक विचारों वाला, स्वतंत्र सोच और मानवीय दृष्टिकोण रखने वाला।",
      traits: ["दूरदर्शी", "समानतावादी", "तकनीक प्रेमी"],
      direction: "पश्चिम दिशा या आधुनिक नवाचार पृष्ठभूमि",
    },
    Pisces: {
      nature: "सहानुभूतिपूर्ण, शांत, आध्यात्मिक और रचनात्मक कल्पनाशीलता से परिपूर्ण।",
      traits: ["दयालु", "कल्पनाशील", "ईश्वर-भक्त"],
      direction: "उत्तर दिशा या शांत व प्राकृतिक परिवेश",
    },
  };

  const rashi7Name = rashiNames[rashi7Idx] || "Leo";
  const partnerInfo = lang === 'hi'
    ? { ...(signDescriptionsHi[rashi7Name] || signDescriptionsHi.Leo), traits: [...(signDescriptionsHi[rashi7Name] || signDescriptionsHi.Leo).traits] }
    : { ...(signDescriptions[rashi7Name] || signDescriptions.Leo), traits: [...(signDescriptions[rashi7Name] || signDescriptions.Leo).traits] };

  if (planetsIn7.includes("Jupiter")) {
    partnerInfo.traits.push(lang === 'hi' ? "विवेकशील, नैतिक व सुसंस्कृत" : "Wise, ethically upright, and culturally knowledgeable");
  }
  if (planetsIn7.includes("Venus")) {
    partnerInfo.traits.push(lang === 'hi' ? "आकर्षक, सुरुचिपूर्ण व सौम्य स्वभाव" : "Visually appealing, sophisticated taste, and charming");
  }

  // Mangal Dosha with Authentic Classical Shastric Exceptions
  const dosha = checkMangalDosha(kundli, { lang });
  let hasDosha = dosha.hasDosha;
  let isCancelled = dosha.description.toLowerCase().includes("cancelled") || dosha.description.includes("निरस्त") || dosha.description.includes("परिहार");
  let mangalDescription = dosha.description;

  const marsData = planets.Mars;
  const marsRashi = marsData?.rashi || 1;
  const marsH = getPlanetHouse("Mars");

  const cancellations: string[] = [];
  if ([1, 8, 10].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "मंगल स्वराशि (मेष/वृश्चिक) या उच्च राशि (मकर) में है।" : "Mars is in Own sign (Aries/Scorpio) or Exalted (Capricorn).");
  }
  if (marsRashi === 4) {
    cancellations.push(lang === 'hi' ? "कर्क में नीचस्थ मंगल का क्रूर प्रभाव शांत हो जाता है।" : "Mars in Cancer (debilitated) loses malefic heat.");
  }
  if ([5, 11].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "मंगल सिंह अथवा कुंभ राशि में होने से शास्त्रीय परिहार होता है।" : "Mars in Leo or Aquarius cancels classical Kuja Dosha.");
  }
  const jupRashi = planets.Jupiter?.rashi || 1;
  const diffFromJup = ((marsRashi - jupRashi + 12) % 12) + 1;
  if ([1, 5, 7, 9].includes(diffFromJup)) {
    cancellations.push(lang === 'hi' ? "देवगुरु बृहस्पति की दृष्टि/युति से दोष परिहार होता है।" : "Jupiter aspects or conjoins Mars, nullifying Kuja Dosha.");
  }
  const moonRashi = planets.Moon?.rashi || 1;
  if (marsRashi === moonRashi) {
    cancellations.push(lang === 'hi' ? "चंद्र-मंगल युति से मांगलिक प्रभाव शुभता में बदलता है।" : "Moon-Mars conjunction forms Chandra-Mangala Yoga, cancelling dosha.");
  }
  if (marsH === 2 && [3, 6].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "द्वितीय भाव में बुध की राशि में मंगल दोषमुक्त है।" : "Mars in 2nd house in Mercurial signs is exempt.");
  }
  if (marsH === 4 && [1, 8].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "चतुर्थ भाव में स्वराशि का मंगल दोषमुक्त है।" : "Mars in 4th house in its own signs is exempt.");
  }
  if (marsH === 7 && [4, 10].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "सप्तम भाव में कर्क या मकर का मंगल दोषमुक्त है।" : "Mars in 7th house in Cancer or Capricorn is exempt.");
  }
  if (marsH === 8 && [9, 12].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "अष्टम भाव में गुरु की राशि में मंगल दोषमुक्त है।" : "Mars in 8th house in Jovian signs is exempt.");
  }
  if (marsH === 12 && [2, 7].includes(marsRashi)) {
    cancellations.push(lang === 'hi' ? "द्वादश भाव में शुक्र की राशि में मंगल दोषमुक्त है।" : "Mars in 12th house in Venusian signs is exempt.");
  }

  if (hasDosha && cancellations.length > 0) {
    isCancelled = true;
    hasDosha = false;
    mangalDescription = lang === 'hi'
      ? `मांगलिक दोष परिहार (पूर्णतः निरस्त): ${cancellations.join(" ")} अतः वैवाहिक जीवन में मांगलिक भय निराधार है।`
      : `Mangal Dosha Cancelled (Classical Shastric Exemption): ${cancellations.join(" ")} The native is free from Kuja Dosha afflictions.`;
  }

  const mangalDosha = {
    hasDosha,
    isCancelled,
    description: mangalDescription,
  };

  // --- Love vs Arranged Marriage & Intercaste Analysis ---

  const house1 = houses.find((h) => h.number === 1) || houses[0];
  const house5 = houses.find((h) => h.number === 5) || houses[4];
  const house9 = houses.find((h) => h.number === 9) || houses[8];
  const house12 = houses.find((h) => h.number === 12) || houses[11];

  const lord1 = kundli.ascendant.rashiLord || RASHI_LORDS[((house1?.rashi || 1) - 1 + 12) % 12];
  const lord5 = RASHI_LORDS[((house5?.rashi || 5) - 1 + 12) % 12];
  const lord9 = RASHI_LORDS[((house9?.rashi || 9) - 1 + 12) % 12];
  const lord12 = RASHI_LORDS[((house12?.rashi || 12) - 1 + 12) % 12];

  const lord1House = getPlanetHouse(lord1);
  const lord5House = getPlanetHouse(lord5);
  const lord7House = getPlanetHouse(lord7);
  const lord9House = getPlanetHouse(lord9);
  const lord2House = getPlanetHouse(lord2);
  const lord12House = getPlanetHouse(lord12);

  const venusHouse = getPlanetHouse("Venus");
  const marsHouse = getPlanetHouse("Mars");
  const rahuHouse = getPlanetHouse("Rahu");
  const ketuHouse = getPlanetHouse("Ketu");
  const saturnHouse = getPlanetHouse("Saturn");
  const jupiterHouse = getPlanetHouse("Jupiter");
  const mercuryHouse = getPlanetHouse("Mercury");
  const sunHouse = getPlanetHouse("Sun");
  const moonHouse = getPlanetHouse("Moon");

  let loveScore = 45;
  let arrangedScore = 45;
  let intercasteProbability = 20;
  const keyIndicators: string[] = [];

  // 1. 5th House & 7th House Connections (Core Love Marriage Yoga)
  if (lord5House === 7) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("5th Lord (Romance) placed in 7th House (Marriage): Classical Love Marriage Yoga.");
  }
  if (lord7House === 5) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("7th Lord (Marriage) placed in 5th House (Romance): Marriage born out of romantic courtship.");
  }
  if (lord5House === lord7House) {
    loveScore += 25;
    arrangedScore -= 15;
    keyIndicators.push("5th Lord and 7th Lord are conjunct in the same house: Direct union of love and marriage.");
  }
  if (Math.abs(lord5House - lord7House) === 6) {
    loveScore += 20;
    arrangedScore -= 10;
    keyIndicators.push("5th Lord and 7th Lord mutually aspect each other: Mutual romantic attraction leading to wedlock.");
  }

  // Lagna Lord in 5th or 7th
  if (lord1House === 5) {
    loveScore += 15;
    keyIndicators.push("Lagna Lord placed in 5th House: Native exercises strong personal choice and romantic autonomy.");
  }
  if (lord1House === 7) {
    loveScore += 15;
    keyIndicators.push("Lagna Lord placed in 7th House: Direct control over choice of life partner.");
  }
  if (saturnHouse === 5 && house7?.number === 7) {
    // Saturn's 3rd aspect on 7th house
    loveScore += 10;
    intercasteProbability += 15;
    keyIndicators.push("Lagna Lord Saturn in 5th house aspecting 7th house: Self-selected courtship with unconventional choice.");
  }

  // Venus-Mars connection (Passion & Romantic drive)
  if (venusHouse === marsHouse) {
    loveScore += 15;
    keyIndicators.push("Venus-Mars conjunction: Intense romantic passion and strong natural desire for love marriage.");
  } else if (Math.abs(venusHouse - marsHouse) === 6) {
    loveScore += 12;
    keyIndicators.push("Venus-Mars mutual aspect: Dynamic romantic chemistry.");
  }

  // Rahu in 5th or 7th house (Unconventional / Breaking orthodox rules)
  if (rahuHouse === 7 || house7?.planets.includes("Rahu")) {
    loveScore += 18;
    arrangedScore -= 12;
    intercasteProbability += 30;
    keyIndicators.push("Rahu in 7th House: Strong drive for unconventional, intercaste, or cross-cultural marriage.");
  }
  if (rahuHouse === 5 || house5?.planets.includes("Rahu")) {
    loveScore += 15;
    intercasteProbability += 15;
    keyIndicators.push("Rahu in 5th House: Modern and progressive romantic views, breaking caste or regional barriers.");
  }
  if (rahuHouse === lord7House) {
    intercasteProbability += 25;
    keyIndicators.push("Rahu conjunct 7th Lord: Strong probability of marriage outside traditional clan/caste boundary.");
  }
  if (rahuHouse === venusHouse) {
    intercasteProbability += 20;
    loveScore += 10;
    keyIndicators.push("Rahu conjunct Venus: Attraction towards non-traditional or diverse cultural backgrounds.");
  }

  // Traditional & Arranged Marriage Factors (9th, 2nd, Jupiter)
  if (lord9House === 7 || lord7House === 9) {
    arrangedScore += 20;
    loveScore -= 10;
    keyIndicators.push("9th Lord (Tradition & Elders) connected with 7th: Strong family involvement and parental blessing.");
  }
  if (lord2House === 7 || lord7House === 2) {
    arrangedScore += 15;
    keyIndicators.push("2nd Lord (Family Clan) connected with 7th: Traditional family-mediated alliance favored.");
  }
  if (house7?.planets.includes("Jupiter")) {
    arrangedScore += 18;
    keyIndicators.push("Jupiter in 7th House: High moral values, mutual respect for family heritage, and elder support.");
  }
  if ([1, 3, 11].includes(jupiterHouse)) {
    arrangedScore += 12;
    keyIndicators.push("Jupiter's auspicious aspect on 7th House: Family consent and auspicious traditional sanction.");
  }

  // Ketu / 12th House (Distant or different cultural origins)
  if (house9?.planets.includes("Ketu") || ketuHouse === 9) {
    intercasteProbability += 12;
    keyIndicators.push("Ketu in 9th House: Detachment from orthodox ritualistic barriers in partner selection.");
  }
  if (lord7House === 12 || lord12House === 7) {
    intercasteProbability += 15;
    keyIndicators.push("7th Lord in 12th House / foreign connection: Partner likely from distant culture, state, or nationality.");
  }

  // Clamp scores
  loveScore = Math.max(15, Math.min(95, loveScore));
  arrangedScore = Math.max(15, Math.min(95, arrangedScore));
  intercasteProbability = Math.max(10, Math.min(95, intercasteProbability));

  let rawRecommendation: 'Love Marriage' | 'Arranged Marriage' | 'Love-cum-Arranged (Self-Choice with Family Approval)' = "Love-cum-Arranged (Self-Choice with Family Approval)";
  if (loveScore >= 58 && arrangedScore >= 52) {
    rawRecommendation = "Love-cum-Arranged (Self-Choice with Family Approval)";
  } else if (loveScore >= 60 && loveScore > arrangedScore + 6) {
    rawRecommendation = "Love Marriage";
  } else if (arrangedScore >= 60 && arrangedScore > loveScore + 6) {
    rawRecommendation = "Arranged Marriage";
  } else {
    rawRecommendation = "Love-cum-Arranged (Self-Choice with Family Approval)";
  }

  const recommendation = marriageI18n.marriageType[lang]?.[rawRecommendation] || rawRecommendation;

  const isIntercasteLikely = intercasteProbability >= 50;

  const marriageType: MarriagePrediction["marriageType"] = {
    recommendation,
    loveScore,
    arrangedScore,
    isIntercasteLikely,
    intercasteProbability,
    keyIndicators,
  };

  // Relationship advice & harmony rating
  const sav7 = kundli.ashtakavarga?.sav?.byHouse[6] ?? 28;
  let rawHarmony: 'Very Good' | 'Good' | 'Average' | 'Needs Caution' = "Good";
  const relationshipAdvice: string[] = [];

  if (sav7 < 24) {
    rawHarmony = "Needs Caution";
    relationshipAdvice.push(lang === 'hi'
      ? "सप्तम भाव में अष्टकवर्ग के कम बिंदु: स्पष्ट और पारदर्शी संवाद बनाए रखें तथा अवास्तविक अपेक्षाओं से बचें।"
      : "7th house has low Ashtakavarga bindus: Maintain clear, transparent communication and avoid unrealistic expectations.");
    relationshipAdvice.push(lang === 'hi'
      ? "ससुराल पक्ष अथवा जीवनसाथी के साथ व्यावसायिक लेन-देन में भूमिकाएं पूरी तरह लिखित व स्पष्ट रखें।"
      : "Avoid merging 100% of commercial/business operations with in-laws or spouse; keep financial roles clearly defined.");
  } else if (sav7 >= 28) {
    rawHarmony = "Very Good";
    relationshipAdvice.push(lang === 'hi'
      ? "सप्तम भाव में उत्तम अष्टकवर्ग बल: परस्पर सम्मान और मजबूत साझेदारी का आधार बनता है।"
      : "Favorable Ashtakavarga support in 7th house fosters lasting mutual respect and teamwork.");
  } else {
    rawHarmony = "Good";
  }

  const maritalHarmonyRating = marriageI18n.harmonyRating[lang]?.[rawHarmony] || rawHarmony;

  if (isIntercasteLikely) {
    relationshipAdvice.push(lang === 'hi'
      ? "दोनों परिवारों के मध्य खुला व संवेदनशील संवाद सांस्कृतिक या सामुदायिक भिन्नताओं को सहजता से दूर करेगा।"
      : "Open communication between both families will smoothly bridge any cultural or community differences.");
  }
  relationshipAdvice.push(lang === 'hi'
    ? "विवाह तय करने से पूर्व नाड़ी और भकूट कूटों के विशेष ध्यान सहित कुंडली मिलान अवश्य करें।"
    : "Match horoscopes (Kundli Milan) with emphasis on Nadi and Bhakoot kootas before finalizing marriage.");
  relationshipAdvice.push(lang === 'hi'
    ? "25 वर्ष की आयु के बाद विवाह दांपत्य में अधिक भावनात्मक परिपक्वता और आर्थिक स्थिरता लाता है।"
    : "Marriage after age 25 brings greater emotional maturity and financial stability.");

  // --- Comprehensive Multi-Factor Spouse Age Difference Analysis ---
  const chalit = getChalitAnalysis(kundli, { lang });
  const kp = getKpAnalysis(kundli, { lang });
  const lalKitab = getLalKitabAnalysis(kundli, { lang });

  const nativeGender = options?.gender || kundli.birthDetails?.gender;
  const lord7Rashi = kundli.planets[lord7]?.rashiName || "";

  const d9PlanetsIn7: string[] = [];
  if (d9?.planets) {
    for (const [pName, pData] of Object.entries(d9.planets)) {
      if (pData.rashi === d9House7Rashi) {
        d9PlanetsIn7.push(pName);
      }
    }
  }

  let ageScore = 0;
  const ageReasons: string[] = [];
  let isUnconventional = false;

  // 1. Planets in 7th House (D1)
  if (planetsIn7.includes("Saturn")) {
    ageScore += 3.5;
    ageReasons.push("Saturn in 7th House: Primary classical marker for an older, serious, or emotionally seasoned partner.");
  }
  if (planetsIn7.includes("Rahu")) {
    isUnconventional = true;
    ageScore += 1.5;
    ageReasons.push("Rahu in 7th House: Triggers unconventional age dynamics (spurs significant age difference defying standard norms).");
  }
  if (planetsIn7.includes("Mercury")) {
    ageScore -= 3.0;
    ageReasons.push("Mercury (Kumar graha) in 7th House: Classical indication of a younger partner with youthful demeanor and witty intellect.");
  }
  if (planetsIn7.includes("Venus")) {
    ageScore -= 1.0;
    ageReasons.push("Venus in 7th House: Indicates close peer age or slightly younger partner with charming, refined personality.");
  }
  if (planetsIn7.includes("Moon")) {
    ageScore -= 1.2;
    ageReasons.push("Moon in 7th House: Emotional peer age or younger partner with gentle disposition.");
  }
  if (planetsIn7.includes("Jupiter")) {
    ageScore += 1.2;
    ageReasons.push("Jupiter in 7th House: Imparts dignified wisdom, nobility, and traditional maturity.");
  }
  if (planetsIn7.includes("Sun")) {
    ageScore += 1.2;
    ageReasons.push("Sun in 7th House: Denotes an authoritative, independent partner carrying natural seniority.");
  }
  if (planetsIn7.includes("Mars")) {
    ageReasons.push("Mars in 7th House: Dynamic, fiery partner of close peer age.");
  }

  // 2. Graha Drishti (Planetary Aspects on 7th House)
  if (saturnHouse === 1 || saturnHouse === 5 || saturnHouse === 10) {
    ageScore += 2.0;
    ageReasons.push(`Saturn casts its special aspect onto 7th House (from House ${saturnHouse}): Adds emotional gravity, patience, and seniority.`);
  }
  if (jupiterHouse === 1 || jupiterHouse === 3 || jupiterHouse === 11) {
    ageScore += 0.8;
    ageReasons.push(`Jupiter's aspect on 7th House (from House ${jupiterHouse}): Bestows mature judgment and respectable conduct.`);
  }
  if (mercuryHouse === 1) {
    ageScore -= 1.5;
    ageReasons.push("Mercury in Lagna directly aspects 7th House: Infuses youthful vitality into the partner's demeanor.");
  }
  if (rahuHouse === 1 || rahuHouse === 3 || rahuHouse === 11) {
    isUnconventional = true;
    ageReasons.push("Rahu's aspect onto 7th House: Enhances possibility of non-traditional age pairings.");
  }

  // 3. 7th Lord Placement & Lordship
  if (lord7 === "Saturn") {
    ageScore += 2.5;
    ageReasons.push("7th Lord is Saturn: Partner naturally embodies higher seniority, steady life experience, or greater age.");
  } else if (lord7 === "Mercury") {
    ageScore -= 2.2;
    ageReasons.push("7th Lord is Mercury: Strong alignment towards a younger partner or youthful, lively mindset.");
  } else if (lord7 === "Jupiter" || lord7 === "Sun") {
    ageScore += 1.0;
  } else if (lord7 === "Venus" || lord7 === "Moon") {
    ageScore -= 1.0;
  }

  if (["Capricorn", "Aquarius"].includes(lord7Rashi)) {
    ageScore += 1.5;
    ageReasons.push(`7th Lord placed in Saturnian sign (${lord7Rashi}): Enhances partner's maturity and career establishment.`);
  } else if (["Gemini", "Virgo"].includes(lord7Rashi)) {
    ageScore -= 1.5;
    ageReasons.push(`7th Lord placed in Mercurial sign (${lord7Rashi}): Reinforces partner's youthful appearance and mindset.`);
  }

  // 4. Navamsha (D9) Confirmation
  if (d9PlanetsIn7.includes("Saturn") || ["Capricorn", "Aquarius"].includes(d9House7RashiName)) {
    ageScore += 1.5;
    ageReasons.push(`Navamsha (D9) 7th house carries Saturnian influence (${d9House7RashiName}${d9PlanetsIn7.length ? `, with ${d9PlanetsIn7.join(", ")}` : ""}): Confirms elder or mature spouse.`);
  }
  if (d9PlanetsIn7.includes("Mercury") || ["Gemini", "Virgo"].includes(d9House7RashiName)) {
    ageScore -= 1.5;
    ageReasons.push(`Navamsha (D9) 7th house carries Mercurial influence (${d9House7RashiName}${d9PlanetsIn7.length ? `, with ${d9PlanetsIn7.join(", ")}` : ""}): Confirms youthful spouse.`);
  }

  // 5. Jaimini Darakaraka (DK)
  if (dkPlanet === "Saturn") {
    ageScore += 1.5;
    ageReasons.push("Jaimini Darakaraka is Saturn: Partner is emotionally seasoned, prudent, and commands seniority.");
  } else if (dkPlanet === "Mercury") {
    ageScore -= 1.5;
    ageReasons.push("Jaimini Darakaraka is Mercury: Partner is lively, playful, and has a younger persona.");
  }

  // 6. Dynamic Evaluation (Relative Age, Estimated Gap, Maturity)
  let relativeAge: MarriagePrediction["spouseAgeDifference"]["relativeAge"] = "Similar Age (Peer)";
  let estimatedDifferenceYears = "Similar age / Peer (within 0 to 2 years)";
  let minGapYears = 0;
  let maxGapYears = 2;
  let partnerIsOlder = false;

  let maturityLevel: MarriagePrediction["spouseAgeDifference"]["maturityLevel"] = "Balanced / Peer-Level";
  if (ageScore >= 2.0) maturityLevel = "High / Senior Demeanor";
  else if (ageScore <= -2.0) maturityLevel = "Youthful / Energetic";

  if (nativeGender === "female") {
    if (ageScore >= 3.0) {
      relativeAge = "Older";
      partnerIsOlder = true;
      minGapYears = 4;
      maxGapYears = 8;
      estimatedDifferenceYears = "+4 to +8 years older (notable seniority & maturity)";
    } else if (ageScore >= 0.5) {
      relativeAge = "Older";
      partnerIsOlder = true;
      minGapYears = 1;
      maxGapYears = 4;
      estimatedDifferenceYears = "+1 to +4 years older (standard traditional alignment)";
    } else if (ageScore >= -1.5) {
      relativeAge = "Similar Age (Peer)";
      partnerIsOlder = false;
      minGapYears = 0;
      maxGapYears = 2;
      estimatedDifferenceYears = "Similar age / Peer (within 0 to 1.5 years)";
    } else {
      // Younger husband for female native (Unconventional / Modern pattern)
      relativeAge = "Younger";
      partnerIsOlder = false;
      minGapYears = 1;
      maxGapYears = 4;
      estimatedDifferenceYears = "1 to 4 years younger (youthful husband / modern dynamic)";
      isUnconventional = true;
    }
  } else if (nativeGender === "male") {
    if (ageScore >= 3.0) {
      // Older wife for male native (Unconventional pattern)
      relativeAge = "Older";
      partnerIsOlder = true;
      minGapYears = 1;
      maxGapYears = 4;
      estimatedDifferenceYears = "+1 to +4 years older (wife is older or commands career seniority)";
      isUnconventional = true;
    } else if (ageScore >= 1.0) {
      relativeAge = "Similar Age (Peer)";
      partnerIsOlder = false;
      minGapYears = 0;
      maxGapYears = 2;
      estimatedDifferenceYears = "Similar age / Peer (within 0 to 1.5 years with high mutual maturity)";
    } else if (ageScore >= -2.0) {
      relativeAge = "Younger";
      partnerIsOlder = false;
      minGapYears = 1;
      maxGapYears = 3;
      estimatedDifferenceYears = "1 to 3 years younger";
    } else {
      relativeAge = "Younger";
      partnerIsOlder = false;
      minGapYears = 3;
      maxGapYears = 6;
      estimatedDifferenceYears = "3 to 6 years younger (notably youthful wife)";
    }
  } else {
    // Unspecified / General perspective
    if (ageScore >= 2.5) {
      relativeAge = "Older";
      partnerIsOlder = true;
      minGapYears = 2;
      maxGapYears = 5;
      estimatedDifferenceYears = "+2 to +5 years older (mature partner with senior demeanor)";
    } else if (ageScore <= -2.0) {
      relativeAge = "Younger";
      partnerIsOlder = false;
      minGapYears = 2;
      maxGapYears = 4;
      estimatedDifferenceYears = "2 to 4 years younger (youthful, energetic partner)";
    } else {
      relativeAge = "Similar Age (Peer)";
      partnerIsOlder = false;
      minGapYears = 0;
      maxGapYears = 2;
      estimatedDifferenceYears = "Similar age / Peer (within 0 to 2 years)";
    }
  }

  const genderPerspective = {
    ifMaleNative:
      ageScore >= 2.5
        ? "If Male Native: Strong Saturnian/Rahu influences indicate an older wife (+1 to +4 years) or career seniority, defying standard stereotypes."
        : ageScore <= -2.0
        ? "If Male Native: Strong Mercurial influence indicates wife is noticeably younger (3 to 6 years younger)."
        : "If Male Native: Wife is likely 1 to 3 years younger or close peer age.",
    ifFemaleNative:
      ageScore <= -1.5
        ? "If Female Native: Strong Mercurial/youthful influence indicates husband is younger (1 to 4 years younger) or peer, defying conventional norms."
        : ageScore >= 2.5
        ? "If Female Native: Strong Saturnian influence indicates husband is substantially older (+4 to +8 years) with established career authority."
        : "If Female Native: Husband is likely 1 to 4 years older or close peer age.",
  };

  const ageReason =
    ageReasons.length > 0
      ? ageReasons.join(" ")
      : "Influences of 7th house and its rulers indicate standard contemporary age parity.";

  const relAgeDict: any = marriageI18n.spouseAgeDifference.relativeAge[lang] || marriageI18n.spouseAgeDifference.relativeAge.en;
  const localizedRelativeAge = relAgeDict?.[relativeAge] || relativeAge;
  const matDict: any = marriageI18n.spouseAgeDifference.maturity[lang] || marriageI18n.spouseAgeDifference.maturity.en;
  const localizedMaturity = matDict?.[maturityLevel] || maturityLevel;

  const spouseAgeDifference: MarriagePrediction["spouseAgeDifference"] = {
    relativeAge: localizedRelativeAge,
    estimatedDifferenceYears,
    minGapYears,
    maxGapYears,
    partnerIsOlder,
    maturityLevel: localizedMaturity,
    unconventionalGapLikely: isUnconventional,
    reason: ageReason,
    genderPerspective,
  };

  // 7th Lord in Houses 1-12 Dictionary
  const localizedLord7 = getLocalizedPlanet(lord7, lang);
  const sDict: any = marriageI18n.seventhLordDictionary[lang] || marriageI18n.seventhLordDictionary.en;
  const seventhLordPlacementResult = (sDict[lord7House] || sDict.default)(localizedLord7, lord7House);

  // Jaimini Darakaraka (Spouse Indicator)
  const localizedDKPlanet = getLocalizedPlanet(jaimini.darakaraka.planet, lang);
  const darakarakaInsight = lang === 'hi'
    ? `जैमिनी दाराकारक (DK): ${localizedDKPlanet} (अंश ${jaimini.darakaraka.formattedDegree}, भाव ${jaimini.darakaraka.house}): ${jaimini.darakaraka.signification}`
    : `Jaimini Darakaraka (DK) is ${jaimini.darakaraka.planet} (at ${jaimini.darakaraka.formattedDegree} in ${jaimini.darakaraka.rashiName}, House ${jaimini.darakaraka.house}): ${jaimini.darakaraka.signification}`;

  const chalitInsight = lang === 'hi'
    ? `चलित चक्र में भाव 7 में ${chalit.actualHouseOccupants[7]?.length ? chalit.actualHouseOccupants[7].map(p => getLocalizedPlanet(p, lang)).join(", ") : "इसका नैसर्गिक स्वामी"} स्थित है, जो वैवाहिक भाव की ठोस आधारशिला रखता है।`
    : `Chalit Bhava 7 is occupied by ${chalit.actualHouseOccupants[7]?.length ? chalit.actualHouseOccupants[7].join(", ") : "its natural lord"}, providing exact cuspal partnership foundation.`;
  const kpInsight = `${kp.marriageCusp7.marriagePromise} ${kp.marriageCusp7.typeIndication}`;
  const lalKitabInsight = lang === 'hi'
    ? `लाल किताब: टेवा ${lalKitab.tevaType} है। सप्तम भाव की स्थिति दांपत्य में पारस्परिक निष्ठा दर्शाती है।`
    : `Lal Kitab: Teva is ${lalKitab.tevaType}. 7th house dynamic reflects high mutual integrity.`;

  // Upapada Lagna (UL - A12) & 2nd from UL (Jaimini Marital Sustenance)
  let upapadaLagnaInsight: string | undefined;
  if (ulPada) {
    const ulRashiIdx = (ulPada.rashi - 1 + 12) % 12;
    const secondFromUlRashiIdx = (ulRashiIdx + 1) % 12;
    const secondFromUlRashiName = rashiNames[secondFromUlRashiIdx];
    upapadaLagnaInsight = lang === 'hi'
      ? `जैमिनी उपपद लग्न (UL - वैवाहिक स्थायित्व): उपपद लग्न ${ulPada.rashiName} में एवं द्वितीय भाव ${secondFromUlRashiName} में स्थित है। महर्षि जैमिनी के नियमानुसार उपपद से द्वितीय भाव दांपत्य के चिरस्थायित्व एवं पारिवारिक संतुलन की रक्षा करता है।`
      : `Jaimini Upapada Lagna (UL - Marriage Sustenance): UL is located in ${ulPada.rashiName} with 2nd from UL falling in ${secondFromUlRashiName}. According to Sage Jaimini, the 2nd house from Upapada is the ultimate anchor of marital longevity and mutual endurance.`;
  }

  // Dara Pada (A7) Insight
  let darapadaInsight: string | undefined;
  if (a7Pada) {
    darapadaInsight = lang === 'hi'
      ? `दारा पद (A7 - सामाजिक साझेदारी): ${a7Pada.rashiName} में संस्थित होकर जीवनसाथी के साथ बौद्धिक व सामाजिक तालमेल को सहज बनाता है।`
      : `Dara Pada (A7 - Social Alliances): Placed in ${a7Pada.rashiName}, fostering harmonious intellectual parity and social rapport between partners.`;
  }

  // Navamsha (D9) Spouse Insight
  let navamshaSpouseInsight: string | undefined;
  if (kundli.vargas?.D9) {
    const d9Asc = kundli.vargas.D9.ascendant;
    const d9House7 = kundli.vargas.D9.houses?.find((h: any) => h.number === 7);
    const d9AscName = d9Asc ? rashiNames[(d9Asc.rashi - 1 + 12) % 12] : "";
    navamshaSpouseInsight = lang === 'hi'
      ? `नवमांश (D9) चक्र सत्यापन: नवमांश लग्न ${d9AscName} एवं सप्तम भाव दांपत्य जीवन के आंतरिक सद्भाव एवं जीवनसाथी के नैतिक गुणों की पुष्टि करता है।`
      : `Navamsha (D9) Verification: Navamsha Ascendant in ${d9AscName} affirms the inner spiritual harmony and enduring core values of the life partner.`;
  }

  // Vivaha Vilamba (Delay) Analysis
  const delayCauses: string[] = [];
  let delayScore = 0;

  if (planetsIn7.includes("Saturn")) {
    delayScore += 3;
    delayCauses.push(lang === 'hi'
      ? "सप्तम भाव में शनि देव की स्थिति: यह परिपक्व आयु में विवाह का शास्त्रीय संकेत है, जो 28-30 वर्ष के उपरांत सुस्थिर दांपत्य देता है।"
      : "Saturn in 7th house: Classical primary indicator of delayed marriage, conferring enduring stability when marriage occurs after age 28-30.");
  }
  if ([1, 5, 10].includes(saturnHouse)) {
    delayScore += 2;
    delayCauses.push(lang === 'hi'
      ? `भाव ${saturnHouse} से शनि की सप्तम भाव पर दृष्टि: संबंध निर्माण में सावधानी, परीक्षण और परिपक्वता की मांग करती है।`
      : `Saturn aspects 7th house (from House ${saturnHouse}): Instills caution, deep scrutiny, and calculated timing before commitment.`);
  }
  if (planetsIn7.includes("Rahu")) {
    delayScore += 1.5;
    delayCauses.push(lang === 'hi'
      ? "सप्तम भाव में राहु: पारंपरिक चयन में अनिर्णय या अपरंपरागत मार्ग चुनने के कारण अतिरिक्त समय लग सकता है।"
      : "Rahu in 7th house: Creates indecision, unconventional alliances, or unexpected shifts requiring grounded clarity.");
  }
  if (planetsIn7.includes("Mars")) {
    delayScore += 1.5;
    delayCauses.push(lang === 'hi'
      ? "सप्तम भाव में मंगल: तीव्र स्वभाव मिलान में विशेष सावधानी अपेक्षित है।"
      : "Mars in 7th house: Adds dynamic assertiveness; requires patient temperament matching before wedlock.");
  }
  if (planetsIn7.includes("Sun")) {
    delayScore += 1.5;
    delayCauses.push(lang === 'hi'
      ? "सप्तम भाव में सूर्य: उच्च स्वाभिमान और आदर्शवादी अपेक्षाएं विवाह निर्णय में समय लेती हैं।"
      : "Sun in 7th house: High self-respect and selective expectations encourage mature partner evaluation.");
  }
  if (planets[lord7]?.isRetrograde) {
    delayScore += 2;
    delayCauses.push(lang === 'hi'
      ? `सप्तमेश (${getLocalizedPlanet(lord7, lang)}) वक्री है: विवाह संबंधी वार्ता में पुनर्विचार या दोहरे प्रयासों के योग बनते हैं।`
      : `7th Lord (${lord7}) is retrograde: Indicates revisions, deep second-thought evaluations, or revisiting past alliances.`);
  }
  if (planets[lord7]?.isCombust) {
    delayScore += 1.5;
    delayCauses.push(lang === 'hi'
      ? `सप्तमेश (${getLocalizedPlanet(lord7, lang)}) अस्त है: उपयुक्त जीवनसाथी खोजने में अतिरिक्त धैर्य आवश्यक है।`
      : `7th Lord (${lord7}) is combust: Requires patient discernment to uncover the right marital match.`);
  }
  if (sav7 < 25) {
    delayScore += 2;
    delayCauses.push(lang === 'hi'
      ? `सप्तम भाव में अष्टकवर्ग के कम बिंदु (${sav7}): 26 वर्ष से पूर्व विवाह में समायोजन की चुनौतियां आ सकती हैं; 27+ आयु उत्तम है।`
      : `7th House Ashtakavarga bindus are low (${sav7}): Advises marital alignment after age 27 for emotional grounding.`);
  }

  const hasDelay = delayScore >= 2.5;
  const vivahaVilambaFactors = {
    hasDelay,
    delayYearsEstimate: hasDelay ? Math.min(5, Math.max(2, Math.round(delayScore))) : 0,
    causes: delayCauses.length > 0 ? delayCauses : [lang === 'hi' ? "कुंडली में कोई प्रमुख विवाह विलंब योग नहीं है।" : "No major planetary delay indicators present in the horoscope."],
    mitigation: hasDelay
      ? (lang === 'hi'
          ? "विलंब दोष निवारण: 27 वर्ष के पश्चात विवाह अधिक फलदायी होता है। गुरुवार को भगवान विष्णु/बृहस्पति की उपासना अथवा माता कात्यायनी मंत्र का जप करें।"
          : "Mitigation for Delay: Marriage after age 27 proves highly stable and blessed. Worship Lord Vishnu/Jupiter on Thursdays or chant the Maa Katyayani Mantra.")
      : (lang === 'hi'
          ? "समय पर अनुकूल दशा में विवाह संपन्न होने के पूर्ण योग हैं।"
          : "Favorable planetary conditions support timely marriage during active dasha periods.")
  };

  // Upapada Lagna (UL) Details
  let upapadaLagnaDetails: MarriagePrediction["upapadaLagnaDetails"] | undefined;
  if (ulPada) {
    const ulRashiIdx = (ulPada.rashi - 1 + 12) % 12;
    const secondFromUlRashiIdx = (ulRashiIdx + 1) % 12;
    const secondFromUlRashiName = rashiNames[secondFromUlRashiIdx];
    const secondFromUlOccupants: string[] = [];
    for (const [pName, pData] of Object.entries(planets)) {
      if (pData.rashi === secondFromUlRashiIdx + 1) {
        secondFromUlOccupants.push(lang === 'hi' ? getLocalizedPlanet(pName, lang) : pName);
      }
    }
    const hasBenefics = secondFromUlOccupants.some(p => ["Jupiter", "Venus", "Mercury", "Moon", "बृहस्पति", "शुक्र", "बुध", "चन्द्र"].includes(p));
    const sustenanceVerdict = hasBenefics
      ? (lang === 'hi' ? "उपपद से द्वितीय भाव में शुभ ग्रहों का प्रभाव दांपत्य के अखंड स्थायित्व एवं पारिवारिक सहयोग की पुष्टि करता है।" : "Benefic presence in 2nd from Upapada guarantees marital endurance and lifelong mutual devotion.")
      : (lang === 'hi' ? "उपपद से द्वितीय भाव सामान्य है; सामंजस्य बनाए रखने हेतु उपपद व्रत (उपपद स्वामी वार को व्रत) कल्याणकारी है।" : "2nd from Upapada is balanced; fasting on the day of the UL lord enhances long-term harmony.");

    upapadaLagnaDetails = {
      rashi: lang === 'hi' ? getLocalizedRashi(ulRashiIdx, lang) : ulPada.rashiName,
      lord: lang === 'hi' ? getLocalizedPlanet(RASHI_LORDS[ulRashiIdx], lang) : RASHI_LORDS[ulRashiIdx],
      secondFromUlRashi: lang === 'hi' ? getLocalizedRashi(secondFromUlRashiIdx, lang) : secondFromUlRashiName,
      secondFromUlOccupants,
      sustenanceVerdict,
    };
  }

  // Navamsha (D9) Spouse Details
  const venusD9Rashi = d9?.planets?.Venus?.rashi;
  let venusD9Dignity = "Neutral";
  if (venusD9Rashi === 12) venusD9Dignity = lang === 'hi' ? "उच्च (मीन नवमांश - परम सौभाग्य)" : "Exalted (Pisces Navamsha - Peak Bliss)";
  else if ([2, 7].includes(venusD9Rashi || 0)) venusD9Dignity = lang === 'hi' ? "स्वक्षेत्री (वृषभ/तुला नवमांश)" : "Own Sign (Taurus/Libra Navamsha)";
  else if (venusD9Rashi === 6) venusD9Dignity = lang === 'hi' ? "नीच (कन्या नवमांश - अपेक्षाओं पर नियंत्रण रखें)" : "Debilitated (Virgo Navamsha - Manage expectations)";
  else venusD9Dignity = lang === 'hi' ? "शुभ व अनुकूल" : "Harmonious";

  const navamshaSpouseDetails = {
    d9House7Rashi: lang === 'hi' ? getLocalizedRashi(d9House7Rashi - 1, lang) : d9House7RashiName,
    d9House7Lord: lang === 'hi' ? getLocalizedPlanet(d9House7Lord, lang) : d9House7Lord,
    d9House7Occupants: d9PlanetsIn7.map(p => lang === 'hi' ? getLocalizedPlanet(p, lang) : p),
    venusD9Dignity,
    explanation: lang === 'hi'
      ? `नवमांश चक्र में सप्तम भाव ${getLocalizedRashi(d9House7Rashi - 1, lang)} राशि का है जिसके स्वामी ${getLocalizedPlanet(d9House7Lord, lang)} हैं। शुक्र की स्थिति (${venusD9Dignity}) जीवनसाथी के आंतरिक संस्कारों और दांपत्य निष्ठा का प्रमाण है।`
      : `D9 Navamsha 7th house falls in ${d9House7RashiName} ruled by ${d9House7Lord}. Venus dignity (${venusD9Dignity}) confirms the spouse's core moral integrity and enduring emotional commitment.`,
  };

  // Spouse Career & Background
  const probableProfessions: string[] = [];
  const house4Planets = houses.find(h => h.number === 4)?.planets || [];
  const partnerSign = rashiNames[rashi7Idx];

  if (["Gemini", "Virgo", "Aquarius"].includes(partnerSign) || house4Planets.includes("Mercury") || dkPlanet === "Mercury") {
    probableProfessions.push(lang === 'hi' ? "सॉफ्टवेयर इंजीनियरिंग, डेटा साइंस, आईटी एवं डिजिटल तकनीक" : "Software Engineering, Data Science, IT & Digital Platforms");
    probableProfessions.push(lang === 'hi' ? "वित्तीय विश्लेषण, बैंकिंग, चार्टर्ड अकाउंटेंसी या कंसल्टिंग" : "Financial Analytics, Banking, Accounting or Corporate Consulting");
  }
  if (["Aries", "Leo", "Sagittarius"].includes(partnerSign) || house4Planets.includes("Sun") || dkPlanet === "Sun" || dkPlanet === "Mars") {
    probableProfessions.push(lang === 'hi' ? "प्रशासनिक सेवा, कॉरपोरेट प्रबंधन, मानव संसाधन व कानूनी सेवाएं" : "Administrative Services, Executive Management, HR or Legal Advisory");
    probableProfessions.push(lang === 'hi' ? "इंजीनियरिंग नेतृत्व, रक्षा, विनिर्माण अथवा रियल एस्टेट" : "Engineering Leadership, Defense, Manufacturing or Real Estate");
  }
  if (["Taurus", "Libra", "Pisces"].includes(partnerSign) || house4Planets.includes("Venus") || dkPlanet === "Venus") {
    probableProfessions.push(lang === 'hi' ? "डिजाइन, रचनात्मक कला, मीडिया, विज्ञापन, लग्जरी एवं ई-कॉमर्स" : "Design, Creative Arts, Media, Advertising, Luxury & E-Commerce");
    probableProfessions.push(lang === 'hi' ? "चिकित्सा, फार्मेसी, बायोमेडिकल रिसर्च अथवा वेलनेस" : "Medicine, Pharmaceuticals, Biomedical Research or Healthcare");
  }
  if (["Cancer", "Scorpio", "Capricorn"].includes(partnerSign) || house4Planets.includes("Jupiter") || dkPlanet === "Jupiter" || dkPlanet === "Saturn") {
    probableProfessions.push(lang === 'hi' ? "अकादमिक शिक्षण, अनुसंधान, न्यायपालिका, परामर्श अथवा कॉर्पोरेट ऑपरेशंस" : "Academic Research, Judiciary, Corporate Operations & Governance");
    probableProfessions.push(lang === 'hi' ? "आपूर्ति श्रृंखला, लॉजिस्टिक्स, बुनियादी ढांचा अथवा वित्तीय संस्थान" : "Supply Chain, Logistics, Infrastructure or Financial Institutions");
  }
  if (probableProfessions.length === 0) {
    probableProfessions.push(lang === 'hi' ? "प्रौद्योगिकी, वाणिज्य अथवा कॉर्पोरेट प्रशासन" : "Technology, Commerce or Corporate Administration");
  }

  const spouseCareerAndBackground = {
    probableProfessions: probableProfessions.slice(0, 3),
    financialStatus: sav7 >= 28
      ? (lang === 'hi' ? "आर्थिक रूप से आत्मनिर्भर एवं संपन्न परिवार से संबद्ध" : "Economically self-sufficient from an established, financially stable family")
      : (lang === 'hi' ? "मेहनती, मध्यम से अच्छी पारिवारिक पृष्ठभूमि, विवाह पश्चात संयुक्त उन्नति" : "Hardworking, respectable background with strong post-marriage compounding"),
    socialStanding: ["Jupiter", "Sun", "Venus"].some(p => planetsIn7.includes(p)) || sav7 >= 30
      ? (lang === 'hi' ? "प्रतिष्ठित, सुसंस्कृत एवं समाज में सम्मानित परिवार" : "Reputed, culturally dignified, and socially well-regarded family")
      : (lang === 'hi' ? "सदाचारी, नैतिक मूल्यों को प्राथमिकता देने वाला संस्कारी परिवार" : "Cultured, family-centric background valuing integrity and mutual respect"),
  };

  // Remedies for Marriage
  const remediesForMarriage = [
    {
      name: lang === 'hi' ? "माता कात्यायनी मंत्र" : "Maa Katyayani Stotram",
      mantraOrAction: lang === 'hi' ? "ॐ कात्यायनि महामाये महायोगिन्यधीश्वरि। नन्दगोपसुतं देवि पतिं मे कुरु ते नमः॥" : "Om Katyayani Mahamaye Mahayoginyadheeshwari, Nandgopsutam Devi Patim Me Kuru Te Namah.",
      purpose: lang === 'hi' ? "शीघ्र व मनोनुकूल जीवनसाथी की प्राप्ति तथा वैवाहिक बाधाओं का निवारण।" : "Attracts compatible, noble life partner and removes unforeseen delays in marriage."
    },
    {
      name: lang === 'hi' ? "शिव-पार्वती (गौरी-शंकर) पूजन" : "Gauri-Shankar / Shiva-Parvati Upasana",
      mantraOrAction: lang === 'hi' ? "सोमवार या शुक्रवार को शिवलिंग पर दुग्ध व श्वेत पुष्प अर्पित करें।" : "Offer milk and white flowers to Shiva Lingam on Mondays or Fridays.",
      purpose: lang === 'hi' ? "दांपत्य जीवन में आजीवन परस्पर अनुराग, मधुरता और सुख-शांति की रक्षा।" : "Fosters lifelong mutual devotion, tender understanding, and marital longevity."
    },
    {
      name: lang === 'hi' ? "उपपद लग्न शांति / व्रत" : "Upapada Lagna Fasting (UL Vrata)",
      mantraOrAction: lang === 'hi' ? `उपपद लग्न के स्वामी (${ulLord || (lang === 'hi' ? "शुक्र" : "Venus")}) के वार को सात्विक आहार या उपवास रखें।` : `Observe a satvik diet or partial fasting on the weekday ruled by UL lord (${ulLord || "Venus"}).`,
      purpose: lang === 'hi' ? "महर्षि जैमिनी के नियमानुसार उपपद व्रत दांपत्य के किसी भी संकट को दूर कर अटूट स्थायित्व देता है।" : "As per Sage Jaimini, fasting on the UL lord's day neutralizes marital afflictions and anchors lifelong bond."
    }
  ];

  // Marital Stability Rating
  let maritalStabilityRating: 'High Stability & Concord' | 'Balanced with Periodic Adjustments' | 'Challenging / Shastric Remedies Recommended' = 'High Stability & Concord';
  if (maritalHarmonyRating === 'Very Good' || maritalHarmonyRating === 'Good') {
    maritalStabilityRating = 'High Stability & Concord';
  } else if (maritalHarmonyRating === 'Average') {
    maritalStabilityRating = 'Balanced with Periodic Adjustments';
  } else {
    maritalStabilityRating = 'Challenging / Shastric Remedies Recommended';
  }

  return {
    maritalHarmonyRating,
    favorableAgeRange,
    predictedTimingYears: sortedYears,
    currentDashaFavorableForMarriage: currentDashaFavorable,
    dashaSupportExplanation,
    partnerCharacteristics: {
      nature: `${partnerInfo.nature} ${lang === 'hi' ? `जैमिनी दाराकारक (${localizedDKPlanet}) प्रभाव:` : `Jaimini DK (${jaimini.darakaraka.planet}) emphasizes:`} ${jaimini.darakaraka.signification}`,
      dominantTraits: partnerInfo.traits,
      directionOrBackground: partnerInfo.direction,
    },
    marriageType,
    mangalDosha,
    spouseAgeDifference,
    relationshipAdvice,
    seventhLordPlacementResult,
    darakarakaInsight,
    chalitInsight,
    kpInsight,
    lalKitabInsight,
    upapadaLagnaInsight,
    navamshaSpouseInsight,
    maritalStabilityRating,
    darapadaInsight,
    vivahaVilambaFactors,
    upapadaLagnaDetails,
    navamshaSpouseDetails,
    spouseCareerAndBackground,
    remediesForMarriage,
  };
}
