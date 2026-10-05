import { predictionDate, validatePredictionChart } from "./validation";
import { Kundli } from "../kundli/types";
import { rashiNames } from "../core/constants";
import { TransitPredictions, PredictionOptions } from "./types";
import { getTransitPositions } from "../transit/transit";
import { Language } from "../i18n/types";
import { getLocalizedPlanet, getLocalizedRashi } from "../i18n/index";

export function getTransitPredictions(kundli: Kundli, options?: PredictionOptions): TransitPredictions {
  validatePredictionChart(kundli);
  const lang: Language = options?.lang || 'en';
  const now = predictionDate(options);

  // Natal Moon Rashi (1-12)
  const moonRashi = kundli.planets?.Moon ? (kundli.planets.Moon.rashi || 1) : 1;
  const moonRashiIdx = (moonRashi - 1 + 12) % 12;
  const moonRashiName = rashiNames[moonRashiIdx];

  // Calculate current transit positions using astronomy engine
  const transits = getTransitPositions(now);
  const saturnTransitRashi = transits["Saturn"] ? (transits["Saturn"].rashi || 11) : 11;
  const jupiterTransitRashi = transits["Jupiter"] ? (transits["Jupiter"].rashi || 2) : 2;
  const rahuTransitRashi = transits["Rahu"] ? (transits["Rahu"].rashi || 12) : 12;
  const ketuTransitRashi = transits["Ketu"] ? (transits["Ketu"].rashi || 6) : 6;

  // 1. Saturn Transit Analysis (from natal Moon)
  // Distance from Moon to Saturn transit (1 to 12)
  const saturnHouseFromMoon = ((saturnTransitRashi - moonRashi + 12) % 12) + 1;
  const isSadeSati = [12, 1, 2].includes(saturnHouseFromMoon);

  let sadeSatiPhase: '1st Phase (Rising - 12th from Moon)' | '2nd Phase (Peak / Janma - 1st from Moon)' | '3rd Phase (Setting - 2nd from Moon)' | undefined;
  if (saturnHouseFromMoon === 12) sadeSatiPhase = '1st Phase (Rising - 12th from Moon)';
  else if (saturnHouseFromMoon === 1) sadeSatiPhase = '2nd Phase (Peak / Janma - 1st from Moon)';
  else if (saturnHouseFromMoon === 2) sadeSatiPhase = '3rd Phase (Setting - 2nd from Moon)';

  const isKantakaShani = [4, 8, 10].includes(saturnHouseFromMoon);
  const isAshtamaShani = saturnHouseFromMoon === 8;

  let saturnPrediction = "";
  let saturnRemedy = "";

  if (isSadeSati) {
    if (saturnHouseFromMoon === 12) {
      saturnPrediction = lang === 'hi'
        ? `वर्तमान में शनि की साढ़ेसाती का प्रथम चरण (उदय चरण - चंद्र से 12वां भाव) चल रहा है। यह काल जीवन में अनावश्यक व्यय पर नियंत्रण, विदेशों से जुड़े नए अवसर एवं आत्म-मूल्यांकन की मांग करता है।`
        : `Active in Sade Sati Phase 1 (Rising: Saturn in 12th from natal Moon). Demands fiscal budgeting, strategic resource preservation, and opens foreign opportunities.`;
    } else if (saturnHouseFromMoon === 1) {
      saturnPrediction = lang === 'hi'
        ? `वर्तमान में शनि की साढ़ेसाती का द्वितीय चरण (शिखर / जन्म शनि - चंद्र पर गोचर) चल रहा है। यह जीवन का महान परिवर्तनकारी काल है, जो मानसिक धैर्य, कर्मठता और अनुशासन की परीक्षा लेकर आपको सशक्त बनाता है।`
        : `Active in Sade Sati Phase 2 (Peak / Janma Shani: Saturn transiting natal Moon). A deeply transformative life era demanding profound endurance, humility, and disciplined focus.`;
    } else {
      saturnPrediction = lang === 'hi'
        ? `वर्तमान में शनि की साढ़ेसाती का तृतीय चरण (अस्त चरण - चंद्र से द्वितीय भाव) चल रहा है। यह पारिवारिक जिम्मेदारियों के समाधान, वित्तीय स्थिरता एवं साढ़ेसाती के कठिन दौर के सुखद समापन की ओर अग्रसर करता है।`
        : `Active in Sade Sati Phase 3 (Setting: Saturn in 2nd from natal Moon). Directs energies into family settlements, long-term asset stabilization, and joyful completion of the 7.5-year cycle.`;
    }
    saturnRemedy = lang === 'hi'
      ? "शनिवार को सुंदरकांड का पाठ करें, पीपल के वृक्ष के नीचे सरसों के तेल का दीपक जलाएं और जरूरतमंदों को काले जूते या कंबल दान करें।"
      : "Light a mustard oil lamp under a Peepal tree on Saturdays, chant Hanuman Chalisa, and donate black sesame or blankets to the needy.";
  } else if (isAshtamaShani) {
    saturnPrediction = lang === 'hi'
      ? `वर्तमान में चंद्र राशि से अष्टम भाव में शनि का गोचर (अष्टम ढैय्या) चल रहा है। स्वास्थ्य, वाहन संचालन और अचानक निवेश में अत्यधिक सावधानी बरतने की सलाह दी जाती है।`
      : `Saturn transits the 8th house from natal Moon (Ashtama Shani). Extreme vigilance advised in joint financial ventures, health maintenance, and defensive road travel.`;
    saturnRemedy = lang === 'hi'
      ? "शनि स्तोत्र का नित्य पाठ करें और महामृत्युंजय मंत्र का जप करें।"
      : "Chant Dasaratha Shani Stotram and sponsor Maha Mrityunjaya japa for protection.";
  } else if (isKantakaShani) {
    saturnPrediction = lang === 'hi'
      ? `वर्तमान में शनि चंद्र राशि से ${saturnHouseFromMoon}वें भाव (कंटक शनि) में गोचर कर रहे हैं। कार्यक्षेत्र एवं पारिवारिक मामलों में धैर्यपूर्ण व सुनियोजित निर्णय लें।`
      : `Saturn transits House ${saturnHouseFromMoon} from natal Moon (Kantaka Shani). Career and domestic projects require methodical pacing and thorough contingency planning.`;
  } else {
    saturnPrediction = lang === 'hi'
      ? `वर्तमान में शनि चंद्र राशि से ${saturnHouseFromMoon}वें भाव में गोचर कर रहे हैं (साढ़ेसाती अथवा ढैय्या का प्रभाव नहीं है)। शनि का यह गोचर कर्मों में स्थिरता और अनुकूल परिणाम देने वाला है।`
      : `Saturn transits House ${saturnHouseFromMoon} from natal Moon. You are free from Sade Sati and Dhaiya, allowing steady professional progress without restrictive karmic turbulence.`;
  }

  // 2. Jupiter Transit Analysis (from natal Moon)
  const jupiterHouseFromMoon = ((jupiterTransitRashi - moonRashi + 12) % 12) + 1;
  // Auspicious Guru houses from Moon: 2, 5, 7, 9, 11
  const hasGuruBalam = [2, 5, 7, 9, 11].includes(jupiterHouseFromMoon);

  const jupiterBlessings = hasGuruBalam
    ? (lang === 'hi'
        ? `शुभ गुरु बल सक्रिय: चंद्र से ${jupiterHouseFromMoon}वें भाव में बृहस्पति का गोचर अत्यंत मंगलकारी है। यह विवाह, संतान, धन वृद्धि, धार्मिक मांगलिक कार्य एवं समाज में उच्च सम्मान का वरदान देता है।`
        : `Auspicious Guru Balam Active: Jupiter's transit in House ${jupiterHouseFromMoon} from Moon brings celestial grace, fostering wealth expansion, marital bliss, and scholarly honors.`)
    : (lang === 'hi'
        ? `सामान्य गुरु गोचर: बृहस्पति चंद्र से ${jupiterHouseFromMoon}वें भाव में संचरित हैं। यह काल आत्म-अध्ययन, ज्ञानार्जन एवं योजनाओं की आंतरिक तैयारी हेतु श्रेष्ठ है।`
        : `Reflective Guru Transit: Jupiter transits House ${jupiterHouseFromMoon} from Moon, prioritizing internal spiritual consolidation, intellectual upskilling, and measured growth.`);

  const jupiterPrediction = lang === 'hi'
    ? `देवगुरु बृहस्पति वर्तमान में ${rashiNames[(jupiterTransitRashi - 1 + 12) % 12]} राशि में चंद्र से ${jupiterHouseFromMoon}वें भाव में संचरण कर रहे हैं। ${hasGuruBalam ? 'यह नया व्यवसाय शुरू करने, विवाह चर्चा को आगे बढ़ाने एवं निवेश हेतु स्वर्णिम समय है।' : 'यह आध्यात्मिक चिंतन, तीर्थ यात्रा एवं वरिष्ठों के मार्गदर्शन से लाभ का समय है।'}`
    : `Jupiter transits ${rashiNames[(jupiterTransitRashi - 1 + 12) % 12]} in House ${jupiterHouseFromMoon} from Moon. ${hasGuruBalam ? 'This provides an optimal launchpad for ventures, relationship commitments, and asset multiplication.' : 'Favors academic research, contemplative mentorship, and methodical foundations.'}`;

  // 3. Rahu-Ketu Transit Analysis
  const rahuHouseFromMoon = ((rahuTransitRashi - moonRashi + 12) % 12) + 1;
  const ketuHouseFromMoon = ((ketuTransitRashi - moonRashi + 12) % 12) + 1;

  const rahuKetuPrediction = lang === 'hi'
    ? `राहु चंद्र से ${rahuHouseFromMoon}वें भाव में एवं केतु ${ketuHouseFromMoon}वें भाव में स्थित हैं। ${[3, 6, 11].includes(rahuHouseFromMoon) ? 'राहु का यह गोचर शत्रुओं पर विजय, अप्रत्याशित वित्तीय लाभ एवं वैश्विक संपर्कों का विस्तार देता है।' : 'राहु-केतु का यह अक्ष जीवन में संतुलन, भावनात्मक विवेक और नए दृष्टिकोण अपनाने की प्रेरणा देता है।'}`
    : `Rahu transits House ${rahuHouseFromMoon} and Ketu transits House ${ketuHouseFromMoon} from natal Moon. ${[3, 6, 11].includes(rahuHouseFromMoon) ? 'Rahu in an Upachaya house bestows sudden windfall gains, courage, and triumph over market competitors.' : 'The nodal axis triggers psychological insights, detachment from vanity, and progressive adaptations.'}`;

  // Overall Transit Score (0-100)
  let transitScore = 65;
  if (hasGuruBalam) transitScore += 20;
  if ([3, 6, 11].includes(rahuHouseFromMoon)) transitScore += 12;
  if (isSadeSati) transitScore -= 15;
  if (isAshtamaShani) transitScore -= 20;

  transitScore = Math.max(30, Math.min(95, transitScore));

  const summary = lang === 'hi'
    ? `वर्तमान गोचर सूचकांक: ${transitScore}/100। ${hasGuruBalam ? 'बृहस्पति का शुभ गुरु बल आपको संरक्षण एवं उन्नति प्रदान कर रहा है।' : ''} ${isSadeSati ? 'शनि साढ़ेसाती के तहत धैर्य और सुनियोजित कर्म से कार्य करें।' : 'शनि का गोचर सामान्य व स्थिर है।'}`
    : `Current Transit Index: ${transitScore}/100. ${hasGuruBalam ? 'Protected by auspicious Jupiterian Guru Balam.' : ''} ${isSadeSati ? 'Navigate Sade Sati with disciplined patience.' : 'Saturn transit provides unhindered operational stability.'}`;

  return {
    saturnTransit: {
      currentSign: rashiNames[(saturnTransitRashi - 1 + 12) % 12],
      houseFromMoon: saturnHouseFromMoon,
      isSadeSati,
      sadeSatiPhase,
      isKantakaShani,
      isAshtamaShani,
      prediction: saturnPrediction,
      remedy: saturnRemedy || undefined,
    },
    jupiterTransit: {
      currentSign: rashiNames[(jupiterTransitRashi - 1 + 12) % 12],
      houseFromMoon: jupiterHouseFromMoon,
      hasGuruBalam,
      blessings: jupiterBlessings,
      prediction: jupiterPrediction,
    },
    rahuKetuTransit: {
      rahuSign: rashiNames[(rahuTransitRashi - 1 + 12) % 12],
      ketuSign: rashiNames[(ketuTransitRashi - 1 + 12) % 12],
      rahuHouseFromMoon: rahuHouseFromMoon,
      ketuHouseFromMoon: ketuHouseFromMoon,
      prediction: rahuKetuPrediction,
    },
    overallTransitScore: transitScore,
    summary,
  };
}
