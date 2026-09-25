import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { ProgenyPrediction, PredictionOptions } from "./types";
import { getJaiminiKarakas } from "./jaimini";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getProgenyPrediction(kundli: Kundli, options?: PredictionOptions): ProgenyPrediction {
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

  // 5th House (Santana Bhava)
  const house5 = houses.find((h) => h.number === 5) || {
    number: 5,
    rashi: ((lagnaRashi + 3) % 12) + 1,
    planets: [] as string[],
  };
  const fifthRashiIdx = (house5.rashi - 1 + 12) % 12;
  const fifthRashiName = rashiNames[fifthRashiIdx] || "Leo";
  const fifthLord = RASHI_LORDS[fifthRashiIdx] || "Sun";
  const fifthLordHouse = getPlanetHouse(fifthLord);
  const fifthSAVBindus = sav ? sav.byHouse[4] : 28;
  const planetsIn5th = house5.planets || [];

  // Jupiter (Putrakaraka)
  const jupiterHouse = getPlanetHouse("Jupiter");
  const jupiterPlanet = planets.Jupiter;

  // Jaimini Putrakaraka (PK)
  const jaimini = getJaiminiKarakas(kundli, { lang });
  const pkPlanet = jaimini.putrakaraka.planet;

  // 1. Progeny Blessing Score
  let score = 70; // baseline

  // 5th lord placement
  if ([1, 4, 5, 7, 9, 10, 11].includes(fifthLordHouse)) score += 15;
  if ([2, 3].includes(fifthLordHouse)) score += 8;
  if ([6, 8, 12].includes(fifthLordHouse)) score -= 15;

  // 5th house occupants
  if (planetsIn5th.includes("Jupiter")) score += 12; // Natural karaka in 5th
  if (planetsIn5th.includes("Venus")) score += 10;
  if (planetsIn5th.includes("Moon")) score += 8;
  if (planetsIn5th.includes("Mercury")) score += 6;

  // Putra Dosha / Afflictions
  let hasDosha = false;
  let doshaType = "";
  let doshaDesc = "";
  const doshaRemedies: string[] = [];

  if (planetsIn5th.includes("Rahu") || planetsIn5th.includes("Ketu")) {
    hasDosha = true;
    doshaType = planetsIn5th.includes("Rahu") ? "Naga / Sarpa Dosha (Rahu in 5th House)" : "Ketu in 5th House (Karmic Detachment)";
    doshaDesc = lang === 'hi'
      ? `पंचम भाव में ${planetsIn5th.includes("Rahu") ? "राहु" : "केतु"} की स्थिति नाग दोष या पूर्वजन्म के कर्म ऋण की ओर संकेत करती है, जिससे संतान सुख में विलंब या गर्भधारण में रुकावटें आ सकती हैं।`
      : `Placement of ${planetsIn5th.includes("Rahu") ? "Rahu" : "Ketu"} in the 5th House signifies Naga/Sarpa karmic obstruction, which can cause delays or medical hurdles in conception.`;
    doshaRemedies.push(
      lang === 'hi'
        ? "संतान गोपाल स्तोत्र एवं मंत्र का नित्य पाठ अथवा योग्य ब्राह्मण द्वारा अनुष्ठान कराएं।"
        : "Recite or sponsor the Santana Gopala Mantra / Anushthan for divine progeny blessings.",
      lang === 'hi'
        ? "त्र्यंबकेश्वर अथवा नागबली पूजा संपन्न कराएं एवं चांदी के नाग-नागिन का दान करें।"
        : "Perform Sarpa Shanti / Nagbali puja or offer symbolic silver serpent pairs to Shiva temple."
    );
    score -= 12;
  } else if (planetsIn5th.includes("Saturn")) {
    hasDosha = true;
    doshaType = "Shani Prabhav (Saturnian Delay)";
    doshaDesc = lang === 'hi'
      ? "पंचम भाव में शनि की स्थिति संतान सुख में विलंब का संकेत देती है, किंतु यह अभाव नहीं है। आयु 28-32 के पश्चात सुसंस्कृत, कर्तव्यनिष्ठ एवं आज्ञाकारी संतान का योग बनता है।"
      : "Saturn in the 5th House induces patience and delays conception, but promises mature, dutiful, and morally upright children post age 28-32.";
    doshaRemedies.push(
      lang === 'hi'
        ? "शनिवार को पीपल के वृक्ष की परिक्रमा कर सरसों के तेल का दीपक प्रज्वलित करें।"
        : "Light a mustard oil lamp under a Peepal tree on Saturdays and practice selfless charity."
    );
    score -= 6;
  } else if (planetsIn5th.includes("Mars")) {
    hasDosha = true;
    doshaType = "Kuja / Pitta Dosha in 5th";
    doshaDesc = lang === 'hi'
      ? "पंचम भाव में मंगल उष्णता (पित्त) का संचार करता है। गर्भधारण के समय विशेष चिकित्सकीय परामर्श एवं शांत वातावरण अनिवार्य है।"
      : "Mars in the 5th House increases Pitta heat in the reproductive realm, advising medical supervision during pregnancy.";
    doshaRemedies.push(
      lang === 'hi'
        ? "मंगलवार को सुंदरकांड का पाठ करें एवं लाल मसूर की दाल का दान करें।"
        : "Chant Sundarkand on Tuesdays and donate red lentils/sweet jaggery."
    );
    score -= 6;
  }

  // Jupiter in Kendras/Trikonas boosts score
  if ([1, 4, 5, 7, 9, 10, 11].includes(jupiterHouse)) score += 10;
  if (fifthSAVBindus >= 30) score += 8;
  if (fifthSAVBindus < 24) score -= 8;

  score = Math.max(35, Math.min(95, score));

  let progenyRating: 'Highly Favorable' | 'Favorable with Minor Delay' | 'Challenging / Remedial Support Advised' | 'Needs Deep Astrological Consultation' = 'Favorable with Minor Delay';
  if (score >= 82) progenyRating = 'Highly Favorable';
  else if (score >= 68) progenyRating = 'Favorable with Minor Delay';
  else if (score >= 50) progenyRating = 'Challenging / Remedial Support Advised';
  else progenyRating = 'Needs Deep Astrological Consultation';

  // Jupiter Strength Verdict
  const jupiterStrengthVerdict = lang === 'hi'
    ? `संतान कारक देवगुरु बृहस्पति भाव ${jupiterHouse} में स्थित हैं। गुरु का प्रभाव संतान की बौद्धिक प्रतिभा, उच्च शिक्षा एवं वंश वृद्धि हेतु शुभ आशीर्वाद प्रदान करता है।`
    : `Jupiter (natural Putrakaraka) is located in House ${jupiterHouse}. Jupiter's auspicious disposition anchors lineage continuity, scholastic acumen, and spiritual merit in progeny.`;

  // Saptamsha D7 insight
  let saptamshaD7Insight: string | undefined;
  if (kundli.vargas?.D7) {
    const d7Asc = kundli.vargas.D7.ascendant;
    const d7House5 = kundli.vargas.D7.houses?.find((h: any) => h.number === 5);
    saptamshaD7Insight = lang === 'hi'
      ? `सप्तमांश (D7) चक्र पुष्टि: सप्तमांश लग्न ${d7Asc ? rashiNames[(d7Asc.rashi - 1 + 12) % 12] : ""} एवं पंचम भाव में ${d7House5?.planets?.join(", ") || "शुभ ग्रहों की दृष्टि"} संतान सुख की पुष्टि करता है।`
      : `Saptamsha (D7) Cross-Verification: D7 Ascendant in ${d7Asc ? rashiNames[(d7Asc.rashi - 1 + 12) % 12] : ""} and 5th house alignment with ${d7House5?.planets?.join(", ") || "benefic planetary aspects"} confirms vitality in progeny lineage.`;
  }

  // Favorable Conception Windows
  const favorableConceptionWindows = lang === 'hi'
    ? [
        `पंचमेश ${getLocalizedPlanet(fifthLord, lang)} अथवा देवगुरु बृहस्पति की दशा-अंतर्दशा अवधि।`,
        `गोचर में गुरु का लग्न, पंचम भाव (${fifthRashiName}) अथवा नवम भाव पर से संचरण।`,
        "शुक्ल पक्ष की शुभ तिथियों (विशेषतः पंचमी, सप्तमी, एकादश) पर गर्भाधान संस्कार अत्यंत मंगलकारी माना गया है।"
      ]
    : [
        `During the major or minor dasha periods of 5th Lord (${fifthLord}) or Jupiter.`,
        `When transiting Jupiter (Guru Gochar) aspects or transits the natal 5th house (${fifthRashiName}) or 9th house.`,
        "Auspicious Shukla Paksha lunar tithis (especially Panchami, Saptami, and Ekadashi) during favorable transit windows."
      ];

  // Children Traits
  const childrenTraits = lang === 'hi' ? [
    `संतान कुशाग्र बुद्धि, तार्किक एवं रचनात्मक दृष्टिकोण वाली होगी (पंचमेश: ${getLocalizedPlanet(fifthLord, lang)})।`,
    `जैमिनी पुत्रकारक ${getLocalizedPlanet(pkPlanet, lang)} के प्रभाव से संतान में आत्मनिर्भरता एवं उच्च सम्मान की भावना प्रबल रहेगी।`,
    "संतान माता-पिता के प्रति आदरभाव रखेगी एवं परिवार की प्रतिष्ठा में वृद्धि करेगी।"
  ] : [
    `Progeny will exhibit keen intellect, creative resourcefulness, and scholastic promise (guided by 5th Lord ${fifthLord}).`,
    `Influenced by Jaimini Putrakaraka ${pkPlanet}, children will demonstrate high self-reliance, moral dignity, and ambition.`,
    "Children will bring pride and familial honor through scholastic, professional, or ethical accomplishments."
  ];

  // Vedic remedies
  const remedies = lang === 'hi' ? [
    "संतान सुख एवं रक्षा हेतु 'ॐ क्लीं कृष्णाय नमः' अथवा संतान गोपाल मंत्र का नित्य 108 बार जाप करें।",
    "गुरुवार को गाय को भीगी हुई चने की दाल व गुड़ खिलाएं और केले के वृक्ष की सेवा करें।",
    "माता-पिता दोनों षष्ठी देवी स्तोत्र का पाठ करें एवं घर में पवित्रता व सकारात्मक वातावरण बनाए रखें।"
  ] : [
    "Chant the sacred Santana Gopala Mantra ('Om Kleem Krishnaya Namah') 108 times daily for progeny protection and blessings.",
    "Offer soaked chana dal, jaggery, and turmeric to a holy cow on Thursdays, and water the sacred banana tree.",
    "Recite the Shasthi Devi Stotram and sponsor educational assistance for underprivileged children to invoke benevolent Jupiterian karma."
  ];

  return {
    progenyBlessingScore: score,
    progenyRating,
    fifthHouseDetails: {
      rashi: fifthRashiName,
      lord: fifthLord,
      lordPlacementHouse: fifthLordHouse,
      planetsIn5th,
      savBindus: fifthSAVBindus,
    },
    jupiterStrengthVerdict,
    putraDosha: {
      hasDosha,
      type: doshaType,
      description: doshaDesc,
      remedies: doshaRemedies,
    },
    saptamshaD7Insight,
    favorableConceptionWindows,
    childrenTraits,
    remedies,
  };
}
