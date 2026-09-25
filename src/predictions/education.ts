import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { EducationPrediction, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet } from "../i18n/index";

export function getEducationPrediction(kundli: Kundli, options?: PredictionOptions): EducationPrediction {
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;

  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) {
        return h.number;
      }
    }
    return 1;
  };

  const lagnaRashi = kundli.ascendant ? kundli.ascendant.rashi : 1;

  // 4th House (Foundational education & degrees)
  const house4 = houses.find((h) => h.number === 4) || { number: 4, rashi: ((lagnaRashi + 2) % 12) + 1, planets: [] as string[] };
  const fourthLord = RASHI_LORDS[(house4.rashi - 1 + 12) % 12];
  const fourthLordHouse = getPlanetHouse(fourthLord);
  const fourthSAV = sav ? sav.byHouse[3] : 28;

  // 5th House (Intellect, logic & competitive skills)
  const house5 = houses.find((h) => h.number === 5) || { number: 5, rashi: ((lagnaRashi + 3) % 12) + 1, planets: [] as string[] };
  const fifthLord = RASHI_LORDS[(house5.rashi - 1 + 12) % 12];
  const fifthLordHouse = getPlanetHouse(fifthLord);
  const fifthSAV = sav ? sav.byHouse[4] : 28;

  // 9th House (Higher education, university & research)
  const house9 = houses.find((h) => h.number === 9) || { number: 9, rashi: ((lagnaRashi + 7) % 12) + 1, planets: [] as string[] };
  const ninthLord = RASHI_LORDS[(house9.rashi - 1 + 12) % 12];
  const ninthLordHouse = getPlanetHouse(ninthLord);
  const ninthSAV = sav ? sav.byHouse[8] : 28;

  // 6th House (Competitive examination prowess)
  const house6 = houses.find((h) => h.number === 6) || { number: 6, rashi: ((lagnaRashi + 4) % 12) + 1, planets: [] as string[] };
  const sixthLord = RASHI_LORDS[(house6.rashi - 1 + 12) % 12];

  // 2nd and 10th houses for commerce/governance
  const house2 = houses.find((h) => h.number === 2) || { number: 2, rashi: ((lagnaRashi) % 12) + 1, planets: [] as string[] };
  const house10 = houses.find((h) => h.number === 10) || { number: 10, rashi: ((lagnaRashi + 8) % 12) + 1, planets: [] as string[] };

  // 12th House (Foreign education)
  const house12 = houses.find((h) => h.number === 12) || { number: 12, rashi: ((lagnaRashi + 10) % 12) + 1, planets: [] as string[] };
  const twelfthLord = RASHI_LORDS[(house12.rashi - 1 + 12) % 12];

  const mercuryHouse = getPlanetHouse("Mercury");
  const jupiterHouse = getPlanetHouse("Jupiter");
  const marsHouse = getPlanetHouse("Mars");
  const sunHouse = getPlanetHouse("Sun");
  const venusHouse = getPlanetHouse("Venus");
  const rahuHouse = getPlanetHouse("Rahu");

  // 1. Academic Success Score & Intellect Rating
  let academicSuccessScore = 70;
  if ([1, 4, 5, 9, 10, 11].includes(fourthLordHouse)) academicSuccessScore += 10;
  if ([1, 4, 5, 9, 10, 11].includes(fifthLordHouse)) academicSuccessScore += 12;
  if ([1, 4, 5, 9, 10, 11].includes(ninthLordHouse)) academicSuccessScore += 8;

  if ([1, 4, 5, 9, 10, 11].includes(mercuryHouse)) academicSuccessScore += 6;
  if ([1, 4, 5, 9, 10, 11].includes(jupiterHouse)) academicSuccessScore += 6;

  if (fourthSAV >= 30) academicSuccessScore += 5;
  if (fifthSAV >= 30) academicSuccessScore += 5;

  if ([6, 8, 12].includes(fourthLordHouse)) academicSuccessScore -= 8;
  if ([6, 8, 12].includes(fifthLordHouse)) academicSuccessScore -= 10;

  academicSuccessScore = Math.max(45, Math.min(98, academicSuccessScore));

  let intellectRating: 'Genius / Highly Analytical' | 'Strong Academic Acumen' | 'Practical / Applied Intellect' | 'Creative / Non-Traditional' = 'Strong Academic Acumen';
  if (academicSuccessScore >= 88) intellectRating = 'Genius / Highly Analytical';
  else if (academicSuccessScore >= 75) intellectRating = 'Strong Academic Acumen';
  else if (academicSuccessScore >= 60) intellectRating = 'Practical / Applied Intellect';
  else intellectRating = 'Creative / Non-Traditional';

  // Learning Style
  let learningStyle = "";
  if ([1, 5, 9].includes(mercuryHouse) || house5.planets.includes("Mercury") || house5.planets.includes("Mars")) {
    learningStyle = lang === 'hi'
      ? "तार्किक, विश्लेषणात्मक एवं समस्या-समाधान आधारित (Problem-solving & Coding/STEM oriented)। आप अवधारणाओं को तेजी से समझते हैं और व्यावहारिक प्रयोग में विश्वास रखते हैं।"
      : "Analytical, logical, and first-principles driven. You grasp mathematical concepts and computational logic swiftly, thriving in interactive problem-solving environments.";
  } else if ([1, 4, 5, 9].includes(jupiterHouse) || house4.planets.includes("Jupiter") || house5.planets.includes("Jupiter")) {
    learningStyle = lang === 'hi'
      ? "गंभीर, शोधपरक एवं समग्र ज्ञान आधारित (Deep Research & Conceptual mastery)। आप विस्तृत अध्ययन, दर्शनशास्त्र एवं सैद्धांतिक गहराई को पसंद करते हैं।"
      : "Holistic, conceptual, and philosophical. You prefer deep subject immersion, comprehensive reading, and understanding the broader purpose and architecture behind subjects.";
  } else {
    learningStyle = lang === 'hi'
      ? "दृश्य एवं व्यावहारिक प्रयोग आधारित (Visual, Applied & Experiential)। आप वास्तविक उदाहरणों, केस-स्टडीज और रचनात्मक प्रोजेक्ट्स के माध्यम से सर्वोत्तम सीखते हैं।"
      : "Applied, visual, and case-study focused. You learn best through real-world applications, structural examples, and creative experimentation rather than rote memorization.";
  }

  // 2. Stream Recommendation Engine
  let techScore = 40;
  let bioMedScore = 40;
  let commerceScore = 40;
  let lawGovScore = 40;
  let creativeScore = 40;

  // Tech / Engineering: Mars, Saturn, Rahu, Mercury on 4th, 5th, 10th
  if (house5.planets.includes("Mars") || house5.planets.includes("Mercury") || house5.planets.includes("Rahu")) techScore += 25;
  if ([1, 4, 5, 10].includes(marsHouse) && [1, 5, 10].includes(mercuryHouse)) techScore += 20;
  if ([3, 6, 10, 11].includes(rahuHouse)) techScore += 15; // Tech, AI, software innovation

  // Medical / Life Sciences: Sun, Mars, Ketu, Moon
  if (house5.planets.includes("Sun") || house5.planets.includes("Mars") || house6.planets.includes("Sun")) bioMedScore += 25;
  if ([6, 8, 10].includes(sunHouse) || [6, 8].includes(marsHouse)) bioMedScore += 20;

  // Commerce, Finance, CA: Mercury, Jupiter, Venus, 2nd & 11th connections
  if (house5.planets.includes("Mercury") || house5.planets.includes("Jupiter") || house2.planets?.includes("Mercury")) commerceScore += 25;
  if ([2, 5, 9, 11].includes(jupiterHouse) && [2, 5, 11].includes(mercuryHouse)) commerceScore += 20;

  // Law, Governance, Civil Services: Sun, Jupiter, Mars, Saturn
  if (house5.planets.includes("Sun") || house5.planets.includes("Jupiter") || house10.planets?.includes("Sun")) lawGovScore += 25;
  if ([9, 10].includes(sunHouse) && [1, 5, 9, 10].includes(jupiterHouse)) lawGovScore += 20;

  // Creative Arts, Design, Humanities: Venus, Moon, Mercury
  if (house5.planets.includes("Venus") || house5.planets.includes("Moon") || house4.planets.includes("Venus")) creativeScore += 25;
  if ([1, 5, 10].includes(venusHouse)) creativeScore += 20;

  const streamList = [
    {
      stream: lang === 'hi' ? "कंप्यूटर साइंस, सॉफ्टवेयर इंजीनियरिंग एवं डेटा टेक्नोलॉजी" : "Computer Science, Software Engineering & Data/AI Technologies",
      score: techScore,
      astrologicalReason: lang === 'hi'
        ? `पंचम भाव एवं बुध/राहु/मंगल का प्रभाव तार्किक प्रोग्रामिंग, मशीन लर्निंग एवं आधुनिक इंजीनियरिंग हेतु सर्वोत्तम है।`
        : `Strong 5th house linkage with Mercury/Rahu/Mars empowers complex algorithmic reasoning and tech enterprise.`
    },
    {
      stream: lang === 'hi' ? "वित्तीय विश्लेषण, सीए, अर्थशास्त्र एवं बैंकिंग प्रबंधन" : "Finance, Chartered Accountancy, Economics & Corporate Strategy",
      score: commerceScore,
      astrologicalReason: lang === 'hi'
        ? `गुरु और बुध की युति/दृष्टि धन व वाणिज्यिक विश्लेषण (Financial modeling & Strategy) में असाधारण दक्षता देती है।`
        : `Mercury and Jupiter synergy activates the 2nd and 5th house axis, bestowing financial acumen and risk governance.`
    },
    {
      stream: lang === 'hi' ? "प्रशासनिक सेवाएं, विधि (Law), लोकनीति एवं सिविल सेवा" : "Public Administration, Law, Civil Services & Governance (UPSC)",
      score: lawGovScore,
      astrologicalReason: lang === 'hi'
        ? `सूर्य और गुरु का प्रभाव नीति निर्माण, प्रशासनिक प्राधिकार और न्याय शास्त्र में सफलता का मार्ग प्रशस्त करता है।`
        : `Sun and Jupiter's authority signatures signify leadership in constitutional law, executive governance, and public service.`
    },
    {
      stream: lang === 'hi' ? "चिकित्सा विज्ञान, जैव प्रौद्योगिकी एवं स्वास्थ्य अनुसंधान" : "Medicine, Biotechnology, Pharmaceuticals & Clinical Research",
      score: bioMedScore,
      astrologicalReason: lang === 'hi'
        ? `षष्ठ भाव और सूर्य/मंगल की सक्रियता रोगों के निदान, शल्य क्रिया (Surgery) एवं नैदानिक अनुसंधान में फलित होती है।`
        : `6th house connection with Sun and Mars supports diagnostic precision, anatomical insight, and medical practice.`
    },
    {
      stream: lang === 'hi' ? "डिजिटल मीडिया, वास्तुकला (Architecture) एवं रचनात्मक कलाएं" : "Digital Media, Architecture, UI/UX & Creative Arts",
      score: creativeScore,
      astrologicalReason: lang === 'hi'
        ? `शुक्र और चंद्र की स्थिति सौंदर्यबोध, ग्राफिक/उत्पाद डिजाइन एवं ललित कलाओं में प्रखर रचनात्मकता प्रदान करती है।`
        : `Venusian harmonics stimulate spatial visualization, aesthetic design, architectural vision, and media mastery.`
    }
  ];

  streamList.sort((a, b) => b.score - a.score);

  const recommendedStreams = streamList.slice(0, 3).map((item, idx) => ({
    stream: item.stream,
    suitability: (idx === 0 ? 'Highly Auspicious' : idx === 1 ? 'Favorable' : 'Secondary') as 'Highly Auspicious' | 'Favorable' | 'Secondary',
    astrologicalReason: item.astrologicalReason
  }));

  // 3. Higher Education & Foreign Study Potential
  let foreignEduScore = 40;
  // Check 9th & 12th houses, movable signs, Rahu in 9th/12th
  if (house9.planets.includes("Rahu") || house12.planets.includes("Rahu")) foreignEduScore += 25;
  if ([9, 12].includes(ninthLordHouse) || [9, 12].includes(getPlanetHouse(twelfthLord))) foreignEduScore += 20;
  if ([1, 4, 7, 10].includes(house9.rashi) || [1, 4, 7, 10].includes(house12.rashi)) foreignEduScore += 10; // Movable signs encourage long-distance travel

  const foreignEducationPotential = foreignEduScore >= 65;
  const foreignEduDesc = foreignEducationPotential
    ? (lang === 'hi'
        ? `विदेश में उच्च शिक्षा (MS/PhD/MBA) की अत्यधिक प्रबल संभावना है (संभावना: ${foreignEduScore}%)। नवम और द्वादश भाव का संबंध वैश्विक विश्वविद्यालयों में अध्ययन एवं शोध का वरदान देता है।`
        : `High potential for international higher education (MS, PhD, or Global MBA: ${foreignEduScore}% probability). 9th and 12th house alignment supports academic migration and international research fellowships.`)
    : (lang === 'hi'
        ? `उच्च शिक्षा देश के शीर्षस्थ संस्थानों में अधिक फलदायी रहेगी, यद्यपि अल्पकालिक अंतर्राष्ट्रीय प्रोजेक्ट्स व कार्यशालाएं संभव हैं (संभावना: ${foreignEduScore}%)।`
        : `Premier domestic institutions provide optimal academic momentum, though specialized foreign collaborative projects and certifications remain accessible (${foreignEduScore}% probability).`);

  // 4. Competitive Exams (UPSC, JEE, GATE, GMAT, Banking, State PCS)
  let examScore = 50;
  if (house6.planets.includes("Mars") || house6.planets.includes("Sun") || house6.planets.includes("Saturn")) examScore += 20; // Conquering competitors
  if ([1, 6, 10, 11].includes(marsHouse)) examScore += 15;
  if ([1, 10].includes(sunHouse)) examScore += 12;
  if (fifthSAV >= 30) examScore += 10;

  let examLikelihood: 'Very High' | 'High' | 'Moderate' | 'Requires Extra Effort' = 'High';
  if (examScore >= 80) examLikelihood = 'Very High';
  else if (examScore >= 68) examLikelihood = 'High';
  else if (examScore >= 52) examLikelihood = 'Moderate';
  else examLikelihood = 'Requires Extra Effort';

  const competitiveStrengths = lang === 'hi' ? [
    "कठिन परीक्षा प्रारूप में संयम और तीव्र मानसिक एकाग्रता बनाए रखने की क्षमता।",
    "षष्ठ व दशम भाव का समर्थन आपको प्रतिस्पर्धियों से आगे निकलने का जुझारू संकल्प देता है।",
    "अंतिम चरण (साक्षात्कार व मुख्य परीक्षा) में आत्मविश्वासपूर्ण अभिव्यक्ति।"
  ] : [
    "Tenacity and mental composure under high-stakes competitive pressure.",
    "Strong 6th-10th house axis delivers the stamina to conquer rivals in multi-stage exams.",
    "Lucid conceptual articulation in interview boards and subjective evaluations."
  ];

  const competitiveAdvice = lang === 'hi'
    ? `प्रतियोगी परीक्षाओं में सफलता दर: ${examLikelihood} (${examScore}/100)। एकाग्र अध्ययन के साथ पिछले वर्षों के प्रश्नपत्रों के मॉक टेस्ट पर विशेष बल दें।`
    : `Competitive examination clearance aptitude: ${examLikelihood} (${examScore}/100). Pair systematic syllabus revisions with time-boxed full-length mock simulations.`;

  // 5. Mercury & Jupiter Significance
  const mercuryImpact = lang === 'hi'
    ? `बुध (तर्क व गणित के कारक) भाव ${mercuryHouse} में स्थित हैं। यह तीव्र स्मरण शक्ति, त्वरित गणना एवं डेटा-चालित विषयों में निपुणता सुनिश्चित करता है।`
    : `Mercury (Karaka of analytics and intellectual synthesis) in House ${mercuryHouse} sharpens quantitative memory and logical precision.`;

  const jupiterImpact = lang === 'hi'
    ? `बृहस्पति (ज्ञान व विवेक के कारक) भाव ${jupiterHouse} में स्थित हैं। यह उच्च शैक्षणिक उपलब्धियों, गुरुजनों के आशीर्वाद एवं दूरदर्शी बौद्धिक दृष्टिकोण का निर्माण करता है।`
    : `Jupiter (Karaka of wisdom and higher philosophy) in House ${jupiterHouse} bestows scholarly mentors, comprehensive comprehension, and strategic foresight.`;

  // 6. Strategic Advice
  const strategicEducationalAdvice = lang === 'hi' ? [
    "अपनी मुख्य शैक्षणिक योग्यता के साथ आधुनिक तकनीकी कौशल (AI, डेटा, कोडिंग या वित्तीय मॉडलिंग) का अनिवार्य संयोजन करें।",
    "परीक्षा अथवा साक्षात्कार से पूर्व 'ॐ ऐं सरस्वत्यै नमः' का 11 बार स्मरण आपकी एकाग्रता को शिखर पर रखेगा।",
    "अध्ययन कक्ष में उत्तर या पूर्व दिशा की ओर मुख करके बैठना विद्या लाभ को तीव्र करता है।"
  ] : [
    "Complement your core academic curriculum with high-leverage modern skill sets (AI tools, data science, financial modeling, or systemic coding).",
    "Invoke the Saraswati Beej mantra ('Om Aim Saraswatyai Namah') before intensive study sessions to harmonize mental clarity.",
    "Orient your study workspace towards North or East to channel cognitive concentration and academic retention."
  ];

  return {
    intellectRating,
    academicSuccessScore,
    learningStyle,
    recommendedStreams,
    higherEducationAndResearch: {
      foreignEducationPotential,
      score: foreignEduScore,
      description: foreignEduDesc,
    },
    competitiveExams: {
      successLikelihood: examLikelihood,
      keyStrengths: competitiveStrengths,
      advice: competitiveAdvice,
    },
    mercuryJupiterSignificance: {
      mercuryImpact,
      jupiterImpact,
    },
    strategicEducationalAdvice,
  };
}
