import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { checkMangalDosha } from "../matching/index";
import { MarriagePrediction } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { getJaiminiKarakas } from "./jaimini";

import { Language } from "../i18n/types";
import { marriageI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getMarriagePrediction(
  kundli: Kundli,
  options?: { gender?: "male" | "female" | "other"; lang?: Language }
): MarriagePrediction {
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const house7 = houses.find((h) => h.number === 7) || houses[6];
  const birthYear = kundli.birthDetails?.rawDate
    ? kundli.birthDetails.rawDate.getFullYear()
    : new Date().getFullYear() - 22;

  const currentYear = new Date().getFullYear();

  // 7th lord & planets
  const rashi7Idx = ((house7?.rashi || 7) - 1 + 12) % 12;
  const lord7 = RASHI_LORDS[rashi7Idx];
  const planetsIn7 = house7?.planets || [];

  // 2nd and 11th lords (family & union)
  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const lord2 = RASHI_LORDS[((house2?.rashi || 2) - 1 + 12) % 12];
  const lord11 = RASHI_LORDS[((house11?.rashi || 11) - 1 + 12) % 12];

  // Marriage significators (Lords of 7th, 2nd, 11th, natural karakas Venus & Jupiter, or planets in 7th)
  const significators = new Set<string>([lord7, lord2, lord11, "Venus", "Jupiter", ...planetsIn7]);

  // Analyze Dasha tree for potential timing years
  const potentialYears = new Set<number>();
  let currentDashaFavorable = false;
  let dashaSupportExplanation = "";

  const dashaTree = kundli.dasha?.mahadashas || [];
  const now = new Date();

  for (const maha of dashaTree) {
    if (maha.antars) {
      for (const antar of maha.antars) {
        const startYear = antar.startTime.getFullYear();
        const endYear = antar.endTime.getFullYear();
        const ageAtStart = startYear - birthYear;

        // Realistic marriage window: age 23 to 35
        if (ageAtStart >= 23 && ageAtStart <= 35) {
          if (significators.has(antar.planet) || significators.has(maha.planet)) {
            for (let y = startYear; y <= endYear; y++) {
              if (y >= currentYear) {
                potentialYears.add(y);
              }
            }
          }
        }

        // Check if currently running antar is favorable
        if (now >= antar.startTime && now <= antar.endTime) {
          if (significators.has(antar.planet) || significators.has(maha.planet)) {
            currentDashaFavorable = true;
            dashaSupportExplanation = `Currently running ${maha.planet} Mahadasha with ${antar.planet} Antardasha carries strong relationship activation.`;
          }
        }
      }
    }
  }

  if (!dashaSupportExplanation) {
    dashaSupportExplanation = `Upcoming dasha sub-periods involving 7th lord (${lord7}) or benefic influences will trigger marriage readiness.`;
  }

  // Sort predicted timing years and limit to top 3-4 distinct years
  const sortedYears = Array.from(potentialYears).sort((a, b) => a - b).slice(0, 4);

  // Favorable age range
  const favorableAgeRange = lang === 'hi' ? "26 से 29 वर्ष" : "26 to 29 years";

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

  // Mangal Dosha
  const dosha = checkMangalDosha(kundli);
  const mangalDosha = {
    hasDosha: dosha.hasDosha,
    isCancelled: dosha.description.toLowerCase().includes("cancelled"),
    description: dosha.description,
  };

  // --- Love vs Arranged Marriage & Intercaste Analysis ---
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };

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
  const jaimini = getJaiminiKarakas(kundli, { lang });

  const nativeGender = options?.gender || kundli.birthDetails?.gender;
  const lord7Rashi = kundli.planets[lord7]?.rashiName || "";

  // Navamsha (D9) 7th House & Occupants
  const d9 = kundli.vargas?.D9;
  const d9AscendantRashi = d9?.ascendant?.rashi || 1;
  const d9House7Rashi = ((d9AscendantRashi + 6 - 1) % 12) + 1;
  const d9House7RashiName = rashiNames[d9House7Rashi - 1] || "";
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
  const dkPlanet = jaimini.darakaraka.planet;
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

  return {
    maritalHarmonyRating,
    favorableAgeRange,
    predictedTimingYears: sortedYears.length > 0 ? sortedYears : [currentYear + 2, currentYear + 3],
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
  };
}
