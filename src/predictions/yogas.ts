import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { YogasAndDoshasReport, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getYogasAndDoshas(kundli: Kundli, options?: PredictionOptions): YogasAndDoshasReport {
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};

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

  // House Lords (1 to 12)
  const houseLords: Record<number, string> = {};
  const houseRashis: Record<number, number> = {};
  for (let i = 1; i <= 12; i++) {
    const h = houses.find((house) => house.number === i) || { rashi: ((lagnaRashi + i - 2) % 12) + 1 };
    houseRashis[i] = h.rashi;
    houseLords[i] = RASHI_LORDS[(h.rashi - 1 + 12) % 12];
  }

  const rajaYogas: YogasAndDoshasReport['rajaYogas'] = [];
  const dhanaYogas: YogasAndDoshasReport['dhanaYogas'] = [];
  const mahapurushaYogas: YogasAndDoshasReport['mahapurushaYogas'] = [];
  const specialAuspiciousYogas: YogasAndDoshasReport['specialAuspiciousYogas'] = [];
  const vipreetRajYogas: YogasAndDoshasReport['vipreetRajYogas'] = [];
  const inauspiciousDoshas: YogasAndDoshasReport['inauspiciousDoshas'] = [];

  // ==========================================
  // 1. Classical Kendra-Trikona Raja Yogas
  // ==========================================
  const kendraHouses = [1, 4, 7, 10];
  const trikonaHouses = [1, 5, 9];

  // Check conjunctions between Kendra and Trikona lords
  const checkedPairs = new Set<string>();
  for (const k of kendraHouses) {
    for (const t of trikonaHouses) {
      if (k === t && k === 1) continue; // Same Lagna lord
      const kLord = houseLords[k];
      const tLord = houseLords[t];
      if (kLord === tLord) continue;

      const pairKey = [kLord, tLord].sort().join("-");
      if (checkedPairs.has(pairKey)) continue;

      const kLordHouse = getPlanetHouse(kLord);
      const tLordHouse = getPlanetHouse(tLord);

      // Conjunction in Kendra or Trikona or Upachaya
      if (kLordHouse === tLordHouse) {
        checkedPairs.add(pairKey);
        const houseJoined = kLordHouse;
        const isKendraTrikona = [1, 4, 5, 7, 9, 10].includes(houseJoined);
        const strength = isKendraTrikona ? 'Very Strong' : 'Strong';

        if (lang === 'hi') {
          rajaYogas.push({
            name: `${k}वें भाव (केंद्र) व ${t}वें भाव (त्रिकोण) स्वामी राजयोग`,
            planets: [getLocalizedPlanet(kLord, lang), getLocalizedPlanet(tLord, lang)],
            description: `${getLocalizedPlanet(kLord, lang)} (${k}वें भाव के स्वामी) और ${getLocalizedPlanet(tLord, lang)} (${t}वें भाव के स्वामी) भाव ${houseJoined} में एक साथ स्थित होकर अत्यंत प्रभावशाली विष्णु-लक्ष्मी राजयोग बनाते हैं। यह उच्च सामाजिक प्रतिष्ठा, अधिकार एवं सफलता प्रदान करता है।`,
            strength,
          });
        } else {
          rajaYogas.push({
            name: `Kendra-Trikona Raja Yoga (${k}th & ${t}th Lords)`,
            planets: [kLord, tLord],
            description: `${kLord} (Lord of ${k}th) and ${tLord} (Lord of ${t}th) conjoin in House ${houseJoined}, forming an auspicious Vishnu-Lakshmi Raja Yoga that bestows high executive authority, peer respect, and triumphant success.`,
            strength,
          });
        }
      }
    }
  }

  // Dharma Karmadhipati Yoga (9th & 10th Lords)
  const lord9 = houseLords[9];
  const lord10 = houseLords[10];
  const lord9House = getPlanetHouse(lord9);
  const lord10House = getPlanetHouse(lord10);

  if (lord9House === lord10House && lord9 !== lord10) {
    if (lang === 'hi') {
      rajaYogas.unshift({
        name: "धर्म-कर्माधिपति राजयोग (महानतम राजयोग)",
        planets: [getLocalizedPlanet(lord9, lang), getLocalizedPlanet(lord10, lang)],
        description: `नवमेश (${getLocalizedPlanet(lord9, lang)}) और दशमेश (${getLocalizedPlanet(lord10, lang)}) भाव ${lord9House} में युतिबद्ध हैं। महर्षि पाराशर के अनुसार यह जातक को उच्च नीति निर्माता, राजा समान अधिकार एवं विश्व स्तरीय प्रतिष्ठा से विभूषित करता है।`,
        strength: 'Very Strong',
      });
    } else {
      rajaYogas.unshift({
        name: "Dharma Karmadhipati Raja Yoga (Supreme Auspicious Yoga)",
        planets: [lord9, lord10],
        description: `9th Lord (${lord9}) and 10th Lord (${lord10}) unite in House ${lord9House}. According to Maharishi Parashara, this creates the pinnacle of professional destiny, ethical governance, and profound public stature.`,
        strength: 'Very Strong',
      });
    }
  }

  // ==========================================
  // 2. Gaja Kesari Yoga
  // ==========================================
  const moonHouse = getPlanetHouse("Moon");
  const jupiterHouse = getPlanetHouse("Jupiter");
  const distMoonToJup = ((jupiterHouse - moonHouse + 12) % 12) + 1;

  if ([1, 4, 7, 10].includes(distMoonToJup)) {
    if (lang === 'hi') {
      specialAuspiciousYogas.push({
        name: "गजकेसरी योग (Gaja Kesari Yoga)",
        description: `देवगुरु बृहस्पति चंद्रमा से केंद्र (भाव ${distMoonToJup}) में स्थित हैं। यह योग जातक को अदम्य साहस, उच्च विद्या, राजसम्मान, दीर्घायु एवं शत्रुओं पर अभेद्य विजय प्रदान करता है।`,
      });
    } else {
      specialAuspiciousYogas.push({
        name: "Gaja Kesari Yoga (Lion-Elephant Sovereign Yoga)",
        description: `Jupiter is placed in a Kendra (House ${distMoonToJup}) from the natal Moon. Maharishi Parashara states this bestows unassailable reputation, scholarly erudition, enduring prosperity, and victory over adversaries.`,
      });
    }
  }

  // ==========================================
  // 3. Budhaditya Yoga
  // ==========================================
  const sunHouse = getPlanetHouse("Sun");
  const mercHouse = getPlanetHouse("Mercury");
  if (sunHouse === mercHouse) {
    if (lang === 'hi') {
      specialAuspiciousYogas.push({
        name: "बुधादित्य योग (Budhaditya Yoga)",
        description: `सूर्य और बुध भाव ${sunHouse} में एक साथ स्थित होकर प्रखर बुद्धिमत्ता, प्रशासनिक कौशल, तार्किक विश्लेषण क्षमता एवं राजकार्य में विशेष सम्मान का सृजन करते हैं।`,
      });
    } else {
      specialAuspiciousYogas.push({
        name: "Budhaditya Yoga (Solar-Mercurial Intellectual Yoga)",
        description: `Sun and Mercury unite in House ${sunHouse}. This aligns sharp analytical intellect, eloquent communication, administrative prowess, and academic brilliance.`,
      });
    }
  }

  // ==========================================
  // 4. Pancha Mahapurusha Yogas
  // ==========================================
  for (const k of kendraHouses) {
    const h = houses.find((house) => house.number === k);
    if (!h) continue;
    const rashi = h.rashi;

    // Ruchaka (Mars in Aries 1, Scorpio 8, Capricorn 10)
    if (h.planets.includes("Mars") && [1, 8, 10].includes(rashi)) {
      mahapurushaYogas.push({
        name: lang === 'hi' ? "रुचक महापुरुष योग (Ruchaka Yoga)" : "Ruchaka Mahapurusha Yoga",
        planet: "Mars",
        description: lang === 'hi'
          ? `मंगल केंद्र भाव ${k} में अपनी स्वराशि/उच्च राशि में स्थित होकर रुचक योग बनाते हैं। यह निर्भीक नेतृत्व, पराक्रम, तकनीकी व प्रशासनिक विजय प्रदान करता है।`
          : `Mars occupies Kendra House ${k} in own/exalted dignity, forging Ruchaka Yoga. Bestows immense physical vitality, tactical bravery, and commanding leadership.`,
      });
    }

    // Bhadra (Mercury in Gemini 3, Virgo 6)
    if (h.planets.includes("Mercury") && [3, 6].includes(rashi)) {
      mahapurushaYogas.push({
        name: lang === 'hi' ? "भद्र महापुरुष योग (Bhadra Yoga)" : "Bhadra Mahapurusha Yoga",
        planet: "Mercury",
        description: lang === 'hi'
          ? `बुध केंद्र भाव ${k} में अपनी स्वराशि/उच्च राशि में स्थित होकर भद्र योग बनाते हैं। यह असाधारण स्मरण शक्ति, व्यापारिक चातुर्य एवं विद्वता प्रदान करता है।`
          : `Mercury occupies Kendra House ${k} in Gemini or Virgo, forging Bhadra Yoga. Bestows peerless communicative brilliance, commercial genius, and scholarly fame.`,
      });
    }

    // Hamsa (Jupiter in Sagittarius 9, Pisces 12, Cancer 4)
    if (h.planets.includes("Jupiter") && [4, 9, 12].includes(rashi)) {
      mahapurushaYogas.push({
        name: lang === 'hi' ? "हंस महापुरुष योग (Hamsa Yoga)" : "Hamsa Mahapurusha Yoga",
        planet: "Jupiter",
        description: lang === 'hi'
          ? `गुरु केंद्र भाव ${k} में अपनी स्वराशि/उच्च राशि में स्थित होकर हंस योग बनाते हैं। यह पवित्र चरित्र, उच्च आध्यात्मिक विवेक एवं समाज में पूजनीय स्थिति प्रदान करता है।`
          : `Jupiter occupies Kendra House ${k} in Cancer, Sagittarius, or Pisces, forging Hamsa Yoga. Bestows righteous conduct, spiritual grace, universal wisdom, and high societal honor.`,
      });
    }

    // Malavya (Venus in Taurus 2, Libra 7, Pisces 12)
    if (h.planets.includes("Venus") && [2, 7, 12].includes(rashi)) {
      mahapurushaYogas.push({
        name: lang === 'hi' ? "मालव्य महापुरुष योग (Malavya Yoga)" : "Malavya Mahapurusha Yoga",
        planet: "Venus",
        description: lang === 'hi'
          ? `शुक्र केंद्र भाव ${k} में अपनी स्वराशि/उच्च राशि में स्थित होकर मालव्य योग बनाते हैं। यह ऐश्वर्य, कलात्मक सौंदर्य, वाहन-भवन सुख एवं सुखी दांपत्य जीवन प्रदान करता है।`
          : `Venus occupies Kendra House ${k} in Taurus, Libra, or Pisces, forging Malavya Yoga. Bestows regal luxuries, aesthetic mastery, charismatic magnetism, and domestic ecstasy.`,
      });
    }

    // Sasa (Saturn in Capricorn 10, Aquarius 11, Libra 7)
    if (h.planets.includes("Saturn") && [7, 10, 11].includes(rashi)) {
      mahapurushaYogas.push({
        name: lang === 'hi' ? "शश महापुरुष योग (Sasa Yoga)" : "Sasa Mahapurusha Yoga",
        planet: "Saturn",
        description: lang === 'hi'
          ? `शनि केंद्र भाव ${k} में अपनी स्वराशि/उच्च राशि में स्थित होकर शश योग बनाते हैं। यह जनसाधारण पर अधिकार, अचल संपत्ति, गंभीर कूटनीति एवं स्थाई सत्ता प्रदान करता है।`
          : `Saturn occupies Kendra House ${k} in Libra, Capricorn, or Aquarius, forging Sasa Yoga. Bestows grassroots political power, unshakeable stamina, enduring real estate, and executive longevity.`,
      });
    }
  }

  // ==========================================
  // 5. Chandra-Mangala Yoga & Saraswati Yoga
  // ==========================================
  const marsHouse = getPlanetHouse("Mars");
  if (moonHouse === marsHouse) {
    specialAuspiciousYogas.push({
      name: lang === 'hi' ? "चंद्र-मंगल योग (Chandra-Mangala Dhana Yoga)" : "Chandra-Mangala Yoga (Prosperity Yoga)",
      description: lang === 'hi'
        ? `चंद्रमा और मंगल भाव ${moonHouse} में एक साथ स्थित होकर प्रचुर धन, भूमि-भवन लाभ एवं सफल उद्यमशीलता का निर्माण करते हैं।`
        : `Moon and Mars conjoin in House ${moonHouse}. Classical texts laud this as an engine for wealth generation through enterprise, real estate, and vigorous ambition.`,
    });
  }

  // Saraswati Yoga (Jupiter, Venus, Mercury in Kendras, Trikonas, or 2nd)
  const saraswatiHouses = [1, 2, 4, 5, 7, 9, 10];
  const venusHouse = getPlanetHouse("Venus");
  if (saraswatiHouses.includes(mercHouse) && saraswatiHouses.includes(jupiterHouse) && saraswatiHouses.includes(venusHouse)) {
    specialAuspiciousYogas.push({
      name: lang === 'hi' ? "सरस्वती योग (Saraswati Yoga)" : "Saraswati Yoga (Goddess of Knowledge Yoga)",
      description: lang === 'hi'
        ? `बुध, गुरु एवं शुक्र तीनों शुभ भावों (केंद्र/त्रिकोण/द्वितीय) में स्थित हैं। यह असाधारण विद्या, काव्य-साहित्य, संगीत, शास्त्र ज्ञान एवं विश्वव्यापी यश का वरदान देता है।`
        : `Mercury, Jupiter, and Venus all grace auspicious Kendras, Trikonas, or the 2nd House. Classical shastras state the native becomes a revered scholar, poet, orator, or scientist endowed with peerless intellect.`,
    });
  }

  // Amala Yoga (Benefic in 10th from Lagna or Moon)
  const house10 = houses.find((h) => h.number === 10);
  const distMoonTo10 = ((10 - moonHouse + 12) % 12) + 1;
  const house10FromMoon = houses.find((h) => h.number === ((moonHouse + 9 - 1) % 12) + 1);

  if (house10?.planets.some(p => ["Jupiter", "Venus", "Mercury"].includes(p)) || house10FromMoon?.planets.some(p => ["Jupiter", "Venus", "Mercury"].includes(p))) {
    specialAuspiciousYogas.push({
      name: lang === 'hi' ? "अमला योग (Amala Yoga - निष्कलंक कीर्ति)" : "Amala Yoga (Spotless Reputation Yoga)",
      description: lang === 'hi'
        ? `दशम भाव (लग्न अथवा चंद्र से) में नैसर्गिक शुभ ग्रह स्थित हैं। यह निष्कलंक चरित्र, उच्च नैतिक प्रतिष्ठा एवं समाजोपकारी कार्यों से कीर्ति प्रदान करता है।`
        : `A natural benefic (Jupiter, Venus, or Mercury) presides in the 10th House from Lagna or Moon. Bestows immaculate social standing, philanthropic virtue, and spotless authority.`,
    });
  }

  // ==========================================
  // 6. Vipreet Raja Yogas (Harsha, Sarala, Vimala)
  // ==========================================
  const lord6 = houseLords[6];
  const lord8 = houseLords[8];
  const lord12 = houseLords[12];
  const lord6House = getPlanetHouse(lord6);
  const lord8House = getPlanetHouse(lord8);
  const lord12House = getPlanetHouse(lord12);

  // Harsha Yoga: 6th lord in 6, 8, 12
  if ([6, 8, 12].includes(lord6House)) {
    vipreetRajYogas.push({
      name: lang === 'hi' ? "हर्ष विपरीत राजयोग (Harsha Yoga)" : "Harsha Vipreet Raja Yoga",
      type: "Harsha",
      description: lang === 'hi'
        ? `षष्ठेश (${getLocalizedPlanet(lord6, lang)}) त्रिक भाव ${lord6House} में स्थित होकर हर्ष योग बनाते हैं। यह शत्रुओं पर विजय, रोगों से रक्षा एवं संकटों में अप्रत्याशित विजय प्रदान करता है।`
        : `6th Lord (${lord6}) is placed in Dusthana House ${lord6House}, forming Harsha Yoga. Bestows invincibility against rivals, extraordinary crisis resilience, and immunity from legal setbacks.`,
    });
  }

  // Sarala Yoga: 8th lord in 6, 8, 12
  if ([6, 8, 12].includes(lord8House)) {
    vipreetRajYogas.push({
      name: lang === 'hi' ? "सरल विपरीत राजयोग (Sarala Yoga)" : "Sarala Vipreet Raja Yoga",
      type: "Sarala",
      description: lang === 'hi'
        ? `अष्टमेश (${getLocalizedPlanet(lord8, lang)}) त्रिक भाव ${lord8House} में स्थित होकर सरल योग बनाते हैं। यह निडरता, दीर्घायु, गुप्त ज्ञान एवं दूसरों की गलतियों से लाभ दिलाता है।`
        : `8th Lord (${lord8}) is placed in Dusthana House ${lord8House}, forming Sarala Yoga. Bestows fearlessness, long life, sudden financial inheritances, and mastery over hidden sciences.`,
    });
  }

  // Vimala Yoga: 12th lord in 6, 8, 12
  if ([6, 8, 12].includes(lord12House)) {
    vipreetRajYogas.push({
      name: lang === 'hi' ? "विमल विपरीत राजयोग (Vimala Yoga)" : "Vimala Vipreet Raja Yoga",
      type: "Vimala",
      description: lang === 'hi'
        ? `द्वादशेश (${getLocalizedPlanet(lord12, lang)}) त्रिक भाव ${lord12House} में स्थित होकर विमल योग बनाते हैं। यह व्ययों पर नियंत्रण, स्वतंत्र विचार एवं धार्मिक जीवन प्रदान करता है।`
        : `12th Lord (${lord12}) is placed in Dusthana House ${lord12House}, forming Vimala Yoga. Minimizes wasteful expenditures and bestows independent wealth and spiritual equanimity.`,
    });
  }

  // ==========================================
  // 7. Inauspicious Doshas Detection
  // ==========================================

  // A. Kaal Sarp Dosha Detection (All 12 types)
  const rahuHouse = getPlanetHouse("Rahu");
  const ketuHouse = getPlanetHouse("Ketu");

  // Names of 12 Kaal Sarp types based on Rahu House (1 to 12)
  const kaalSarpTypes: Record<number, string> = {
    1: "Anant Kaal Sarp Dosha (1st / 7th Axis)",
    2: "Kulik Kaal Sarp Dosha (2nd / 8th Axis)",
    3: "Vasuki Kaal Sarp Dosha (3rd / 9th Axis)",
    4: "Shankhpal Kaal Sarp Dosha (4th / 10th Axis)",
    5: "Padma Kaal Sarp Dosha (5th / 11th Axis)",
    6: "Mahapadma Kaal Sarp Dosha (6th / 12th Axis)",
    7: "Takshak Kaal Sarp Dosha (7th / 1st Axis)",
    8: "Karkotak Kaal Sarp Dosha (8th / 2nd Axis)",
    9: "Shankhachood Kaal Sarp Dosha (9th / 3rd Axis)",
    10: "Ghatak Kaal Sarp Dosha (10th / 4th Axis)",
    11: "Vishdhar Kaal Sarp Dosha (11th / 5th Axis)",
    12: "Sheshnag Kaal Sarp Dosha (12th / 6th Axis)",
  };

  const corePlanets = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  let side1Count = 0;
  let side2Count = 0;

  for (const cp of corePlanets) {
    const pHouse = getPlanetHouse(cp);
    // Relative position from Rahu forward to Ketu
    const distFromRahu = ((pHouse - rahuHouse + 12) % 12);
    if (distFromRahu > 0 && distFromRahu < 6) {
      side1Count++;
    } else if (distFromRahu > 6) {
      side2Count++;
    }
  }

  const isFullKaalSarp = side1Count === 7 || side2Count === 7;
  const isPartialKaalSarp = (side1Count === 6 && side2Count === 0) || (side2Count === 6 && side1Count === 0);
  const hasKaalSarp = isFullKaalSarp || isPartialKaalSarp;

  // Cancellation rule: Jupiter in Kendra significantly cancels Kaal Sarp
  const isKaalSarpCancelled = [1, 4, 7, 10].includes(jupiterHouse);
  const kaalSarpTypeName = kaalSarpTypes[rahuHouse] || "Kaal Sarp Dosha";

  const kaalSarpRemedy = lang === 'hi'
    ? "भगवान शिव का रुद्राभिषेक कराएं, महामृत्युंजय मंत्र का नित्य जाप करें एवं नाग पंचमी पर चांदी के नाग-नागिन का दान करें।"
    : "Perform Shiva Rudrabhishek, recite Maha Mrityunjaya Mantra regularly, and offer symbolic Naga prayers on Nag Panchami.";

  const kaalSarpDesc = hasKaalSarp
    ? (lang === 'hi'
        ? `आपकी कुंडली में ${kaalSarpTypeName} (${isFullKaalSarp ? 'पूर्ण' : 'आंशिक / खंड'}) विद्यमान है। ${isKaalSarpCancelled ? 'किंतु देवगुरु बृहस्पति के केंद्र में होने से इस दोष का दुष्प्रभाव बहुत अधिक निष्प्रभावी (शांत) हो जाता है।' : 'यह जीवन के पूर्वार्ध में संघर्ष किंतु उत्तरार्ध में असाधारण सफलता की ओर संकेत करता है।'}`
        : `${kaalSarpTypeName} (${isFullKaalSarp ? 'Full' : 'Partial / Khanda'}) is active. ${isKaalSarpCancelled ? 'However, Jupiter placed in a Kendra creates significant cancellation (Bhanga), minimizing harsh effects.' : 'Indicates testing uphill battles in the first half of life, culminating in extraordinary self-made ascension.'}`)
    : (lang === 'hi'
        ? "आपकी कुंडली में कालसर्प दोष नहीं है। सभी ग्रह राहु-केतु अक्ष के दोनों ओर संतुलित रूप से संचरित हैं।"
        : "No Kaal Sarp Dosha detected. Planetary distribution freely transcends the nodal Rahu-Ketu axis.");

  // B. Kemadruma Yoga
  // No planet (except Sun, Rahu, Ketu) in 2nd or 12th from Moon
  const house2FromMoon = ((moonHouse) % 12) + 1;
  const house12FromMoon = ((moonHouse + 10) % 12) + 1;
  const pIn2FromMoon = (houses.find(h => h.number === house2FromMoon)?.planets || []).filter(p => !["Sun", "Rahu", "Ketu"].includes(p));
  const pIn12FromMoon = (houses.find(h => h.number === house12FromMoon)?.planets || []).filter(p => !["Sun", "Rahu", "Ketu"].includes(p));

  const rawKemadruma = pIn2FromMoon.length === 0 && pIn12FromMoon.length === 0;
  // Cancellation: Planets in Kendra from Moon OR Kendra from Lagna
  let kemadrumaCancelled = false;
  let kemadrumaCancelReason = "";
  if (rawKemadruma) {
    const planetsInKendraFromLagna: string[] = [];
    for (const k of [1, 4, 7, 10]) {
      const hp = houses.find(h => h.number === k)?.planets || [];
      for (const p of hp) {
        if (!["Rahu", "Ketu"].includes(p)) planetsInKendraFromLagna.push(p);
      }
    }
    if (planetsInKendraFromLagna.length > 0 || [1, 4, 7, 10].includes(distMoonToJup)) {
      kemadrumaCancelled = true;
      kemadrumaCancelReason = lang === 'hi'
        ? "लग्न अथवा चंद्रमा से केंद्र भावों में शुभ ग्रहों की उपस्थिति से केमद्रुम भंग राजयोग बन चुका है।"
        : "Presence of planets in Kendras from Lagna/Moon triggers Kemadruma Bhanga, transmuting isolation into self-reliance.";
    }
  }

  // C. Guru Chandal Yoga (Jupiter + Rahu)
  if (jupiterHouse === rahuHouse) {
    inauspiciousDoshas.push({
      name: lang === 'hi' ? "गुरु चांडाल योग (Guru Chandal Yoga)" : "Guru Chandal Yoga",
      hasDosha: true,
      severity: "Moderate",
      description: lang === 'hi'
        ? `देवगुरु बृहस्पति और राहु भाव ${jupiterHouse} में एक साथ स्थित हैं। यह पारंपरिक मान्यताओं पर प्रश्न उठाने, निर्णय में भ्रम एवं गुरुजनों से मतभेद की स्थिति उत्पन्न कर सकता है।`
        : `Jupiter and Rahu conjoin in House ${jupiterHouse}. This fosters unorthodox non-conformist beliefs, occasional philosophical dilemmas, and friction with orthodox authorities.`,
      remedy: lang === 'hi'
        ? "गुरुवार को भगवान विष्णु की आराधना करें, केसर का तिलक लगाएं एवं बुजुर्गों व गुरुजनों का सम्मान करें।"
        : "Chant the Brihaspati Beej Mantra, apply a saffron tilak, and honor mentors and elders.",
    });
  }

  // D. Grahan Yoga (Sun/Moon with Rahu/Ketu)
  if (sunHouse === rahuHouse || sunHouse === ketuHouse) {
    inauspiciousDoshas.push({
      name: lang === 'hi' ? "सूर्य ग्रहण दोष (Surya Grahan Dosha)" : "Surya Grahan Dosha (Solar Eclipse Affliction)",
      hasDosha: true,
      severity: "Moderate",
      description: lang === 'hi'
        ? `सूर्य देव राहु/केतु के साथ भाव ${sunHouse} में स्थित हैं। यह आत्म-विश्वास में उतार-चढ़ाव, पिता के स्वास्थ्य की चिंता अथवा सरकारी कार्यों में विलंब दे सकता है।`
        : `Sun is afflicted by Rahu/Ketu in House ${sunHouse}. Advised to maintain steady confidence, support father's well-being, and navigate bureaucratic paperwork patiently.`,
      remedy: lang === 'hi'
        ? "आदित्य हृदय स्तोत्र का नित्य पाठ करें और तांबे के बर्तन में जल भरकर सूर्य को अर्घ्य दें।"
        : "Chant the Aditya Hridaya Stotram and offer daily morning Arghya to the rising Sun.",
    });
  }

  if (moonHouse === rahuHouse || moonHouse === ketuHouse) {
    inauspiciousDoshas.push({
      name: lang === 'hi' ? "चंद्र ग्रहण दोष (Chandra Grahan Dosha)" : "Chandra Grahan Dosha (Lunar Eclipse Affliction)",
      hasDosha: true,
      severity: "Moderate",
      description: lang === 'hi'
        ? `चंद्रमा राहु/केतु के साथ भाव ${moonHouse} में स्थित हैं। यह अत्यधिक भावुकता, मानसिक बेचैनी और अनिद्रा का कारण बन सकता है।`
        : `Moon is afflicted by Rahu/Ketu in House ${moonHouse}. Induces heightened emotional turbulence, vivid dreams, and psychosomatic sensitivity.`,
      remedy: lang === 'hi'
        ? "शिवलिंग पर कच्चा दूध व जल अर्पित करें और 'ॐ नमः शिवाय' का मानसिक जप करें।"
        : "Perform daily milk and water libations (Abhishek) on Shiva Lingam and practice calming meditation.",
    });
  }

  // E. Angarak Yoga (Mars + Rahu/Ketu)
  if (marsHouse === rahuHouse || marsHouse === ketuHouse) {
    inauspiciousDoshas.push({
      name: lang === 'hi' ? "अंगारक दोष (Angarak Dosha)" : "Angarak Dosha (Fiery Volatility Affliction)",
      hasDosha: true,
      severity: "Moderate",
      description: lang === 'hi'
        ? `मंगल और राहु/केतु भाव ${marsHouse} में एक साथ हैं। यह अत्यधिक आवेश, जल्दबाजी में निर्णय एवं रक्त/अग्नि संवेदनशीलता को बढ़ावा देता है।`
        : `Mars conjoins Rahu/Ketu in House ${marsHouse}. Inspires intense energetic bursts, impatience, and prone to hasty physical or temperamental hazards.`,
      remedy: lang === 'hi'
        ? "हनुमान चालीसा का नित्य पाठ करें और मंगलवार को बंदरों या गाय को गुड़-चना खिलाएं।"
        : "Chant the Hanuman Chalisa daily and donate sweet jaggery or feed cows on Tuesdays.",
    });
  }

  // F. Shani-Rahu Shrapit Dosha
  const saturnHouse = getPlanetHouse("Saturn");
  if (saturnHouse === rahuHouse) {
    inauspiciousDoshas.push({
      name: lang === 'hi' ? "शनि-राहु शापित दोष (Shrapit Dosha)" : "Shani-Rahu Shrapit Dosha (Ancestral Karmic Debt)",
      hasDosha: true,
      severity: "High",
      description: lang === 'hi'
        ? `शनि और राहु भाव ${saturnHouse} में युतिबद्ध हैं। यह पूर्वजन्म के कर्म ऋण एवं कार्यों में अप्रत्याशित विलंब का संकेत देता है, जिसके लिए निरंतर धैर्य आवश्यक है।`
        : `Saturn and Rahu unite in House ${saturnHouse}. Represents complex past-life ancestral debts that manifest as chronic roadblocks until karmic patience is mastered.`,
      remedy: lang === 'hi'
        ? "शनिवार को पीपल के नीचे सरसों के तेल का दीपक जलाएं और असहाय लोगों की निःस्वार्थ सेवा करें।"
        : "Light a sesame or mustard oil lamp under a Peepal tree on Saturdays and engage in selfless community service.",
    });
  }

  const totalYogas = rajaYogas.length + dhanaYogas.length + mahapurushaYogas.length + specialAuspiciousYogas.length + vipreetRajYogas.length;
  const totalDoshas = inauspiciousDoshas.length + (hasKaalSarp && !isKaalSarpCancelled ? 1 : 0);

  const summaryVerdict = lang === 'hi'
    ? `कुल ${totalYogas} शुभ योग एवं ${totalDoshas} सक्रिय दोष संसूचित हुए। ${totalYogas > 2 ? 'कुंडली में राजयोगों एवं शुभ योगों का पलड़ा अत्यंत भारी है, जो जीवन में उच्च उत्थान सुनिश्चित करता है।' : 'कुंडली में कर्मठता और उपायों के माध्यम से भाग्योदय का विधान है।'}`
    : `Synthesized ${totalYogas} Auspicious Classical Yogas against ${totalDoshas} Active Karmic Doshas. ${totalYogas > 2 ? 'The overwhelming preponderance of Raja Yogas establishes formidable potential for leadership and enduring success.' : 'Balanced astrological matrix calling for disciplined perseverance and classical remedies.'}`;

  return {
    summaryVerdict,
    totalYogasDetected: totalYogas,
    totalDoshasDetected: totalDoshas,
    rajaYogas,
    dhanaYogas,
    mahapurushaYogas,
    specialAuspiciousYogas,
    vipreetRajYogas,
    inauspiciousDoshas,
    kaalSarpDosha: {
      hasDosha: hasKaalSarp,
      type: kaalSarpTypeName,
      isFull: isFullKaalSarp,
      isCancelled: isKaalSarpCancelled,
      cancellationReason: isKaalSarpCancelled ? (lang === 'hi' ? "गुरु के केंद्र में होने से कालसर्प दोष का दुष्प्रभाव निष्प्रभावी हो गया है।" : "Jupiter in Kendra neutralizes the malefic sting of Kaal Sarp.") : undefined,
      description: kaalSarpDesc,
      remedy: kaalSarpRemedy,
    },
    kemadrumaYoga: {
      hasYoga: rawKemadruma,
      isCancelled: kemadrumaCancelled,
      cancellationReason: kemadrumaCancelReason,
      description: rawKemadruma
        ? (kemadrumaCancelled
            ? (lang === 'hi' ? `केमद्रुम भंग राजयोग: ${kemadrumaCancelReason}` : `Kemadruma Bhanga Raja Yoga: ${kemadrumaCancelReason}`)
            : (lang === 'hi' ? "केमद्रुम योग उपस्थित है: मानसिक एकाकीपन का अनुभव हो सकता है, भगवान शिव की पूजा कल्याणकारी है।" : "Kemadruma Yoga active: Occasional feelings of mental isolation; regular meditation brings inner peace."))
        : (lang === 'hi' ? "चंद्रमा के दोनों ओर शुभ ग्रह स्थित हैं; केमद्रुम योग नहीं है।" : "No Kemadruma Yoga detected; Moon is happily flanked by planetary support."),
      remedy: rawKemadruma && !kemadrumaCancelled ? (lang === 'hi' ? "सोमवार को शिवलिंग पर कच्चा दूध व गंगाजल चढ़ाएं।" : "Offer raw milk and water to Shiva Lingam on Mondays.") : undefined,
    },
  };
}
