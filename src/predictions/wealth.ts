import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { PredictionOptions, WealthPrediction } from "./types";
import { getChalitAnalysis, getKpAnalysis, getLalKitabAnalysis } from "./multisystem";
import { Language } from "../i18n/types";
import { wealthI18n } from "../i18n/dictionaries/predictions";
import { getLocalizedPlanet } from "../i18n/index";

export function getWealthPrediction(kundli: Kundli, options?: PredictionOptions): WealthPrediction {
  const lang: Language = options?.lang || 'en';
  const houses = kundli.houses || [];
  const planets = kundli.planets || {};
  const sav = kundli.ashtakavarga?.sav;

  const house2 = houses.find((h) => h.number === 2) || houses[1];
  const house11 = houses.find((h) => h.number === 11) || houses[10];
  const house12 = houses.find((h) => h.number === 12) || houses[11];

  const bindus11 = sav ? sav.byHouse[10] : 28;
  const bindus12 = sav ? sav.byHouse[11] : 28;
  const bindus2 = sav ? sav.byHouse[1] : 28;
  const surplusRatio = bindus11 - bindus12;

  // Dhana Yogas Detection
  const dhanaYogas: WealthPrediction["dhanaYogas"] = [];

  // 1. Ashtakavarga Mahadhan Yoga
  if (surplusRatio >= 5 && bindus11 >= 32) {
    dhanaYogas.push({
      name: lang === 'hi' ? "अष्टकवर्ग महाधन योग" : "Ashtakavarga Mahadhan Yoga",
      description: lang === 'hi'
        ? `एकादश (लाभ) भाव (${bindus11} बिंदु) द्वादश (व्यय) भाव (${bindus12} बिंदु) से कहीं अधिक है। शुद्ध धन संचय की अपार क्षमता।`
        : `11th House of Gains (${bindus11} bindus) significantly exceeds 12th House of Expenses (${bindus12} bindus). Unstoppable net wealth accumulation.`,
      strength: wealthI18n.dhanaYogaStrength[lang]?.Powerful || "Powerful",
    });
  } else if (surplusRatio > 0) {
    dhanaYogas.push({
      name: lang === 'hi' ? "अष्टकवर्ग धन योग" : "Ashtakavarga Dhana Yoga",
      description: lang === 'hi'
        ? `आय (${bindus11}) व्यय (${bindus12}) से अधिक है, जो समय के साथ निरंतर सकारात्मक आर्थिक वृद्धि सुनिश्चित करता है।`
        : `Gains (${bindus11}) exceed Expenditures (${bindus12}), ensuring positive financial growth over time.`,
      strength: wealthI18n.dhanaYogaStrength[lang]?.Moderate || "Moderate",
    });
  }

  // 2. Exalted planet in wealth house
  if (house2?.planets) {
    for (const pName of house2.planets) {
      if (planets[pName]?.dignity === "exalted") {
        const localizedPName = getLocalizedPlanet(pName, lang);
        dhanaYogas.push({
          name: lang === 'hi' ? `उच्च ${localizedPName} धन योग` : `Uccha ${pName} Dhana Yoga`,
          description: lang === 'hi'
            ? `द्वितीय भाव (धन भाव) में उच्च का ${localizedPName} विलासिता, संपत्ति और तरल पूंजी के संचय की असाधारण क्षमता देता है।`
            : `Exalted ${pName} in 2nd House (Dhana Bhava) brings tremendous capacity for accumulating luxury, wealth, and liquid assets.`,
          strength: wealthI18n.dhanaYogaStrength[lang]?.Powerful || "Powerful",
        });
      }
    }
  }

  // 3. Gaja Kesari Yoga
  if (planets.Jupiter && planets.Moon) {
    const jupRashi = planets.Jupiter.rashi;
    const moonRashi = planets.Moon.rashi;
    const distFromMoon = ((jupRashi - moonRashi + 12) % 12) + 1;
    if ([1, 4, 7, 10].includes(distFromMoon)) {
      dhanaYogas.push({
        name: lang === 'hi' ? "गजकेसरी योग" : "Gaja Kesari Yoga",
        description: lang === 'hi'
          ? "चंद्रमा से केंद्र में देवगुरु बृहस्पति की उपस्थिति निरंतर समृद्धि, सम्मानित सामाजिक पद और स्थायी वैभव प्रदान करती है।"
          : "Jupiter in Kendra from Moon grants continuous prosperity, respected social status, and enduring wealth.",
        strength: wealthI18n.dhanaYogaStrength[lang]?.Powerful || "Powerful",
      });
    }
  }

  // 4. Chandra-Mangala Yoga
  if (planets.Moon && planets.Mars) {
    const moonRashi = planets.Moon.rashi;
    const marsRashi = planets.Mars.rashi;
    const diff = Math.abs(moonRashi - marsRashi);
    if (diff === 0 || diff === 6) {
      dhanaYogas.push({
        name: lang === 'hi' ? "चंद्र-मंगल योग" : "Chandra-Mangala Yoga",
        description: lang === 'hi'
          ? "चंद्र और मंगल का पारस्परिक संबंध तीव्र वित्तीय सूझबूझ, अचल संपत्ति, व्यापार और उद्यम से प्रचुर धनार्जन कराता है।"
          : "Mutual association of Moon and Mars creates sharp financial acumen, wealth through real estate, trade, and enterprise.",
        strength: wealthI18n.dhanaYogaStrength[lang]?.Powerful || "Powerful",
      });
    }
  }

  // 5. Lord of 11th in Kendra or Trikona
  const rashi11Idx = (house11.rashi - 1 + 12) % 12;
  const lord11 = RASHI_LORDS[rashi11Idx];
  const getPlanetHouse = (pName: string): number => {
    for (const h of houses) {
      if (h.planets && h.planets.includes(pName)) return h.number;
    }
    return 1;
  };
  const lord11House = getPlanetHouse(lord11);
  if ([1, 4, 7, 10, 5, 9, 11].includes(lord11House)) {
    const localizedLord11 = getLocalizedPlanet(lord11, lang);
    dhanaYogas.push({
      name: lang === 'hi' ? "केंद्र-त्रिकोण लाभ योग" : "Kendra-Trikona Labha Yoga",
      description: lang === 'hi'
        ? `एकादशेश (${localizedLord11}) शुभ भाव ${lord11House} में स्थित होकर निरंतर आय और व्यावसायिक सफलता सुनिश्चित करते हैं।`
        : `11th Lord (${lord11}) placed favorably in House ${lord11House}, ensuring sustained revenues and commercial rewards.`,
      strength: wealthI18n.dhanaYogaStrength[lang]?.Moderate || "Moderate",
    });
  }

  // 6. Budhaditya Yoga
  if (planets.Sun && planets.Mercury && planets.Sun.rashi === planets.Mercury.rashi) {
    dhanaYogas.push({
      name: lang === 'hi' ? "बुधादित्य योग" : "Budhaditya Yoga",
      description: lang === 'hi'
        ? "सूर्य और बुध की युति उच्च व्यापारिक बुद्धि, प्रशासनिक स्पष्टता और रणनीतिक वित्तीय दूरदर्शिता प्रदान करती है।"
        : "Conjunction of Sun and Mercury confers high commercial intellect, administrative clarity, and strategic financial foresight.",
      strength: wealthI18n.dhanaYogaStrength[lang]?.Moderate || "Moderate",
    });
  }

  // 7. Vipreet Raj Yogas (Harsha, Sarala, Vimala)
  const vipreetRajYogas: string[] = [];
  const house6 = houses.find((h) => h.number === 6) || houses[5];
  const house8 = houses.find((h) => h.number === 8) || houses[7];
  const lord6 = RASHI_LORDS[(house6.rashi - 1 + 12) % 12];
  const lord8 = RASHI_LORDS[(house8.rashi - 1 + 12) % 12];
  const lord12 = RASHI_LORDS[(house12.rashi - 1 + 12) % 12];

  const lord6House = getPlanetHouse(lord6);
  const lord8House = getPlanetHouse(lord8);
  const lord12House = getPlanetHouse(lord12);

  const dusthanas = [6, 8, 12];
  if (dusthanas.includes(lord6House)) {
    const p = getLocalizedPlanet(lord6, lang);
    vipreetRajYogas.push(lang === 'hi'
      ? `हर्ष विपरीत राजयोग (षष्ठेश ${p} भाव ${lord6House} में): आर्थिक संकटों से सुरक्षा, विरोधियों पर विजय और कठिन परिस्थितियों में भी समृद्धि।`
      : `Harsha Vipreet Raj Yoga (6th Lord ${lord6} in House ${lord6House}): Bestows unshakeable immunity to financial crises, victory over rivals, and ability to thrive under pressure.`);
  }
  if (dusthanas.includes(lord8House)) {
    const p = getLocalizedPlanet(lord8, lang);
    vipreetRajYogas.push(lang === 'hi'
      ? `सरल विपरीत राजयोग (अष्टमेश ${p} भाव ${lord8House} में): अप्रत्याशित वित्तीय सफलता, निर्भीकता और संकट को अवसर में बदलने की क्षमता।`
      : `Sarala Vipreet Raj Yoga (8th Lord ${lord8} in House ${lord8House}): Grants sudden financial breakthroughs, fearlessness in adversity, and immense transformative wealth.`);
  }
  if (dusthanas.includes(lord12House)) {
    const p = getLocalizedPlanet(lord12, lang);
    vipreetRajYogas.push(lang === 'hi'
      ? `विमल विपरीत राजयोग (द्वादशेश ${p} भाव ${lord12House} में): स्वतंत्र आर्थिक संपन्नता, श्रेष्ठ चरित्र और भारी वित्तीय क्षति से सुरक्षा।`
      : `Vimala Vipreet Raj Yoga (12th Lord ${lord12} in House ${lord12House}): Ensures independent financial prosperity, noble character, and immunity against heavy losses.`);
  }

  // 2nd Lord Placement
  const rashi2Idx = (house2.rashi - 1 + 12) % 12;
  const lord2 = RASHI_LORDS[rashi2Idx];
  const lord2House = getPlanetHouse(lord2);
  const localizedLord2 = getLocalizedPlanet(lord2, lang);

  const sLordDict: any = wealthI18n.secondLordDictionary[lang] || wealthI18n.secondLordDictionary.en;
  const secondLordPlacementResult = (sLordDict[lord2House] || sLordDict.default)(localizedLord2, lord2House);

  // 11th Lord Placement
  const localizedLord11 = getLocalizedPlanet(lord11, lang);
  const eLordDict: any = wealthI18n.eleventhLordDictionary[lang] || wealthI18n.eleventhLordDictionary.en;
  const eleventhLordPlacementResult = (eLordDict[lord11House] || eLordDict.default)(localizedLord11, lord11House);

  // Calculate Income Potential (0 - 100)
  let incomePotential = 50;
  if (bindus11 >= 35) incomePotential += 30;
  else if (bindus11 >= 30) incomePotential += 20;
  else if (bindus11 >= 28) incomePotential += 10;
  else incomePotential -= 10;

  if (surplusRatio >= 5) incomePotential += 15;
  if (dhanaYogas.some((y) => y.strength === "Powerful" || y.strength === wealthI18n.dhanaYogaStrength.hi?.Powerful)) {
    incomePotential += 10;
  }
  incomePotential = Math.max(20, Math.min(99, incomePotential));

  // Determine Wealth Rating
  let rawRating: 'Exceptional' | 'High' | 'Moderate' | 'Fluctuating' = "Moderate";
  if (incomePotential >= 85) rawRating = "Exceptional";
  else if (incomePotential >= 70) rawRating = "High";
  else if (surplusRatio < 0) rawRating = "Fluctuating";

  const wealthRating = wealthI18n.rating[lang]?.[rawRating] || rawRating;

  // Saving Capacity
  let rawSaving: 'Strong' | 'Average' | 'Challenging' = "Average";
  if (surplusRatio >= 4 && bindus2 >= 25) {
    rawSaving = "Strong";
  } else if (surplusRatio < 0) {
    rawSaving = "Challenging";
  }

  const savingCapacity = wealthI18n.savingCapacity[lang]?.[rawSaving] || rawSaving;

  // Best Wealth Sources
  const bestWealthSources: string[] = lang === 'hi'
    ? [
        "डिजिटल संपत्ति, सॉफ्टवेयर प्लेटफॉर्म और तकनीकी उत्पाद",
        "व्यावसायिक परामर्श और विशिष्ट तकनीकी सेवाएं",
        "दीर्घकालिक इक्विटी निवेश, पूंजी संचय और रणनीतिक व्यावसायिक नेटवर्क",
      ]
    : [
        "Digital assets, software platforms, and proprietary technology products",
        "Professional consulting and specialized technical services",
        "Equity investments, long-term capital compounding, and strategic networking",
      ];

  if (house2?.planets.includes("Venus")) {
    bestWealthSources.push(lang === 'hi'
      ? "उच्च-मूल्य रचनात्मक संपत्ति, डिज़ाइन, मीडिया या प्रीमियम विलासिता उत्पाद"
      : "High-value creative assets, design, premium media, or luxury goods");
  }

  // Financial Cautions
  const financialCautions: string[] = [];
  if (surplusRatio >= 5) {
    financialCautions.push(lang === 'hi'
      ? "उच्च आय क्षमता से जीवनशैली के अनावश्यक खर्च बढ़ सकते हैं; धन को स्वतः स्थिर संपत्तियों में निवेश करें।"
      : "High earning potential can cause lifestyle inflation; automate investments into compounding assets early.");
  }
  if (bindus2 < 26) {
    financialCautions.push(lang === 'hi'
      ? "तरल संचय में उतार-चढ़ाव आ सकता है; बिना ठोस प्रमाण किसी को बड़ी धनराशि उधार न दें।"
      : "Liquid savings can fluctuate; avoid lending substantial funds without formal collateral.");
  }
  financialCautions.push(lang === 'hi'
    ? "प्रतिकूल दशा या गोचर के समय बिना सोचे-समझे सट्टा या जोखिम भरे वित्तीय निर्णयों से बचें।"
    : "Avoid impulsive speculative bets during unfavorable dasha sub-periods.");

  const chalit = getChalitAnalysis(kundli, { lang });
  const kp = getKpAnalysis(kundli, { lang });
  const lalKitab = getLalKitabAnalysis(kundli, { lang });

  const chalitInsight = lang === 'hi'
    ? `चलित चक्र में द्वितीय भाव में ${chalit.actualHouseOccupants[2]?.length ? chalit.actualHouseOccupants[2].map(p => getLocalizedPlanet(p, lang)).join(", ") : "स्पष्ट स्थिति"} है, जो संपत्ति संचय को सुदृढ़ करता है। एकादश भाव सतत लाभ का समर्थन करता है।`
    : `Chalit Bhava 2 has ${chalit.actualHouseOccupants[2]?.length ? chalit.actualHouseOccupants[2].join(", ") : "clear status"}, stabilizing asset compounding. Chalit Bhava 11 supports scalable gains.`;

  const kpInsight = kp.wealthCusps.financialSignification;
  const lalKitabInsight = lang === 'hi'
    ? `लाल किताब: टेवा ${lalKitab.tevaType} है। किस्मत का ग्रह ${getLocalizedPlanet(lalKitab.kismatKaGrah.planet, lang)} भाव ${lalKitab.kismatKaGrah.house} में समृद्धि और कोष स्थिरता को सक्रिय करता है।`
    : `Lal Kitab: Teva is ${lalKitab.tevaType}. Kismat Ka Grah ${lalKitab.kismatKaGrah.planet} in House ${lalKitab.kismatKaGrah.house} activates prosperity and treasury stability.`;

  return {
    wealthRating,
    incomePotential,
    savingCapacity,
    savMetrics: {
      incomeHouse11Bindus: bindus11,
      expenditureHouse12Bindus: bindus12,
      wealthHouse2Bindus: bindus2,
      surplusRatio,
    },
    dhanaYogas,
    vipreetRajYogas,
    secondLordPlacementResult,
    eleventhLordPlacementResult,
    bestWealthSources,
    financialCautions,
    chalitInsight,
    kpInsight,
    lalKitabInsight,
  };
}
