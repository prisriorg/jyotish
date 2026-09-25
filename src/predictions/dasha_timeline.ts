import { Kundli } from "../kundli/types";
import { RASHI_LORDS } from "../matching/constants";
import { rashiNames } from "../core/constants";
import { DashaTimelinePrediction, PredictionOptions } from "./types";
import { Language } from "../i18n/types";
import { getLocalizedPlanet } from "../i18n/index";

export function getDashaTimelinePrediction(kundli: Kundli, options?: PredictionOptions): DashaTimelinePrediction {
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

  // Determine which houses each planet rules in D1
  const planetRuledHouses: Record<string, number[]> = {
    Sun: [], Moon: [], Mars: [], Mercury: [], Jupiter: [], Venus: [], Saturn: [], Rahu: [], Ketu: []
  };

  for (let i = 1; i <= 12; i++) {
    const h = houses.find((house) => house.number === i) || { rashi: ((lagnaRashi + i - 2) % 12) + 1 };
    const lord = RASHI_LORDS[(h.rashi - 1 + 12) % 12];
    if (planetRuledHouses[lord]) {
      planetRuledHouses[lord].push(i);
    }
  }

  // 1. Current Active Dasha details
  const dashaObj = kundli.dasha as any;
  const now = new Date();

  let mdPlanet = "Jupiter";
  let mdStart = "2020-01-01";
  let mdEnd = "2036-01-01";
  let adPlanet = "Saturn";
  let adStart = "2024-01-01";
  let adEnd = "2026-06-01";
  let pdPlanet: string | undefined = "Mercury";

  if (dashaObj?.currentMahadasha) {
    const curMd = dashaObj.currentMahadasha;
    mdPlanet = curMd.planet || "Jupiter";
    mdStart = curMd.startTime ? new Date(curMd.startTime).toISOString().split('T')[0] : (curMd.startDate ? new Date(curMd.startDate).toISOString().split('T')[0] : "Active");
    mdEnd = curMd.endTime ? new Date(curMd.endTime).toISOString().split('T')[0] : (curMd.endDate ? new Date(curMd.endDate).toISOString().split('T')[0] : "Active");

    if (dashaObj.currentAntar) {
      const curAd = dashaObj.currentAntar;
      adPlanet = curAd.planet || "Saturn";
      adStart = curAd.startTime ? new Date(curAd.startTime).toISOString().split('T')[0] : (curAd.startDate ? new Date(curAd.startDate).toISOString().split('T')[0] : "Active");
      adEnd = curAd.endTime ? new Date(curAd.endTime).toISOString().split('T')[0] : (curAd.endDate ? new Date(curAd.endDate).toISOString().split('T')[0] : "Active");
    }

    if (dashaObj.currentPratyantar) {
      pdPlanet = dashaObj.currentPratyantar.planet;
    }
  } else if (kundli.dasha?.mahadashas && kundli.dasha.mahadashas.length > 0) {
    // Find active mahadasha from timeline
    for (const md of kundli.dasha.mahadashas) {
      const s = md.startTime ? new Date(md.startTime).getTime() : 0;
      const e = md.endTime ? new Date(md.endTime).getTime() : 0;
      const cur = now.getTime();
      if (cur >= s && cur <= e) {
        mdPlanet = md.planet;
        mdStart = md.startTime ? new Date(md.startTime).toISOString().split('T')[0] : "Active";
        mdEnd = md.endTime ? new Date(md.endTime).toISOString().split('T')[0] : "Active";
        const antars = md.antars || (md as any).antardashas;
        if (antars) {
          for (const ad of antars) {
            const as = ad.startTime ? new Date(ad.startTime).getTime() : 0;
            const ae = ad.endTime ? new Date(ad.endTime).getTime() : 0;
            if (cur >= as && cur <= ae) {
              adPlanet = ad.planet;
              adStart = ad.startTime ? new Date(ad.startTime).toISOString().split('T')[0] : "Active";
              adEnd = ad.endTime ? new Date(ad.endTime).toISOString().split('T')[0] : "Active";
              break;
            }
          }
        }
        break;
      }
    }
  }

  const mdHouse = getPlanetHouse(mdPlanet);
  const adHouse = getPlanetHouse(adPlanet);
  const mdRuled = planetRuledHouses[mdPlanet] || [1];
  const adRuled = planetRuledHouses[adPlanet] || [1];

  // 2. Nature & Functional Status of MD Lord
  let mdNature = "";
  if (mdRuled.includes(1)) {
    mdNature = lang === 'hi' ? "लग्नेश (सर्वाधिक शुभ व जीवनोन्नति कारक)" : "Lagna Lord (Supreme Life Benefic)";
  } else if (mdRuled.includes(9) || mdRuled.includes(5)) {
    mdNature = lang === 'hi' ? "त्रिकोणेश (भाग्य एवं पुण्य कारक)" : "Trikona Lord (Fortune & Merit Dispenser)";
  } else if (mdRuled.includes(10)) {
    mdNature = lang === 'hi' ? "दशमेश (कर्म व अधिकार कारक)" : "Karmesh (Professional Authority Lord)";
  } else if (mdRuled.includes(11) || mdRuled.includes(2)) {
    mdNature = lang === 'hi' ? "धनेश / लाभेश (आर्थिक समृद्धि कारक)" : "Dhana / Labha Lord (Financial Wealth Driver)";
  } else if (mdRuled.includes(6) || mdRuled.includes(8) || mdRuled.includes(12)) {
    mdNature = lang === 'hi' ? "त्रिकेश (परिवर्तन एवं साधना कारक)" : "Dusthana Lord (Karmic Transformation & Healing)";
  } else {
    mdNature = lang === 'hi' ? "केंद्रेश (स्थिरता कारक)" : "Kendra Lord (Stability & Action Anchor)";
  }

  const mdPrediction = lang === 'hi'
    ? `${getLocalizedPlanet(mdPlanet, lang)} की महादशा (भाव ${mdHouse} में स्थित, स्वामी भाव ${mdRuled.join(", ")})। यह समय आपके जीवन में ${mdNature} का सक्रिय काल है। यह अवधि व्यक्तिगत परिपक्वता, सामाजिक प्रतिष्ठा के विस्तार और जीवन के आधारभूत ढांचे को सुदृढ़ करने के अवसर लेकर आती है।`
    : `Mahadasha of ${mdPlanet} (placed in House ${mdHouse}, ruling Houses ${mdRuled.join(", ")}). Operating as ${mdNature}, this macro-cycle focuses energies on structural realignments, authority expansion, and long-term self-realization.`;

  const adPrediction = lang === 'hi'
    ? `${getLocalizedPlanet(adPlanet, lang)} की अंतर्दशा (भाव ${adHouse} में स्थित, स्वामी भाव ${adRuled.join(", ")})। यह उप-अवधि दैनिक कार्यक्षेत्र में विशिष्ट बदलाव, नए अनुबंध, वित्तीय प्रवाह तथा व्यक्तिगत उत्तरदायित्वों के निर्वहन की ओर प्रेरित करती है।`
    : `Antardasha of ${adPlanet} (placed in House ${adHouse}, ruling Houses ${adRuled.join(", ")}). This sub-period translates macro-themes into immediate daily execution, career shifts, and financial transactions.`;

  // 3. Domain Specific Current Themes
  const currentPeriodThemes = {
    career: lang === 'hi'
      ? `${getLocalizedPlanet(mdPlanet, lang)}-${getLocalizedPlanet(adPlanet, lang)} काल में कार्यक्षेत्र में नई जिम्मेदारियां और पदोन्नति के अवसर निर्मित होंगे। स्वतंत्र निर्णय लेने की क्षमता में वृद्धि होगी।`
      : `The ${mdPlanet}-${adPlanet} combination fosters career elevations, executive authority, and promising professional breakthroughs through disciplined execution.`,
    wealth: lang === 'hi'
      ? `वित्तीय स्थिति में संतुलन बना रहेगा। आय के नए स्रोत बनेंगे, किंतु दीर्घकालिक निवेश (Mutual funds/Real estate) में समझदारी से कदम बढ़ाएं।`
      : `Financial stability remains protected. Multiple income conduits open up, with optimal rewards favoring calculated long-term asset accumulation over speculation.`,
    relationships: lang === 'hi'
      ? `पारिवारिक संबंधों में आपसी संवाद और सामंजस्य बनाए रखना आवश्यक होगा। जीवनसाथी के साथ नए साझा लक्ष्यों पर कार्य करेंगे।`
      : `Domestic and marital concord thrives on transparent communication. Collaborative family goals and mutual respect deepen emotional intimacy.`,
    health: lang === 'hi'
      ? `ऊर्जा का स्तर अच्छा रहेगा। कार्य की व्यस्तता के कारण दिनचर्या व खानपान में अनियमितता से बचें; पर्याप्त विश्राम लें।`
      : `Vitality remains steady. Guard against workaholic sleep deficits and stress burnout; prioritize clean nutrition and structured physical mobility.`
  };

  // 4. Upcoming Major Periods
  const upcomingMajorPeriods = lang === 'hi' ? [
    {
      planet: getLocalizedPlanet(adPlanet, lang),
      periodSpan: `${adStart} से ${adEnd}`,
      keyForecast: "वर्तमान उप-दशा: व्यावसायिक प्रगति, वित्तीय योजना एवं नए संपर्कों के विस्तार हेतु महत्वपूर्ण चरण।"
    },
    {
      planet: "आगामी प्रमुख चक्र",
      periodSpan: `वर्ष ${new Date().getFullYear() + 1} - ${new Date().getFullYear() + 3}`,
      keyForecast: "आगामी अंतर्दशाएं संपत्ति विस्तार, पारिवारिक मांगलिक कार्य एवं कार्यक्षेत्र में नई ऊंचाइयों की ओर अग्रसर करेंगी।"
    }
  ] : [
    {
      planet: adPlanet,
      periodSpan: `${adStart} to ${adEnd}`,
      keyForecast: "Active sub-period: Critical window for strategic networking, financial consolidation, and career elevation."
    },
    {
      planet: "Next Major Sub-Cycle",
      periodSpan: `Years ${new Date().getFullYear() + 1} - ${new Date().getFullYear() + 3}`,
      keyForecast: "Transition into subsequent antardasha triggers asset acquisition, celebratory family milestones, and executive empowerment."
    }
  ];

  // 5. Critical Milestone Ages
  const birthYear = kundli.birthDetails?.date ? new Date(kundli.birthDetails.date).getFullYear() : 2000;
  const criticalMilestoneAges = lang === 'hi' ? [
    { age: 28, astrologicalCycle: "शनि प्रथम चक्र पूर्णता (First Saturn Return)", significance: "करियर में परिपक्वता, वास्तविक जीवन पथ का चयन एवं आर्थिक स्वावलंबन का प्रस्थान बिंदु।" },
    { age: 36, astrologicalCycle: "बृहस्पति तृतीय चक्र (Jupiter Expansion Cycle)", significance: "सामाजिक प्रतिष्ठा में उल्लेखनीय उछाल, पारिवारिक समृद्धि एवं संपत्ति अर्जन का स्वर्णिम समय।" },
    { age: 42, astrologicalCycle: "राहु परिपक्वता चक्र (Rahu Maturation Age)", significance: "कैरियर का शिखर, नए व्यवसाय/पहल में साहसिक विस्तार एवं वैश्विक अवसरों का आगमन।" },
    { age: 54, astrologicalCycle: "सूर्य-गुरु चक्र (Wisdom & Legacy Phase)", significance: "वरिष्ठ नेतृत्व, मार्गदर्शक भूमिका एवं जीवनभर की उपलब्धियों का सम्मान।" }
  ] : [
    { age: 28, astrologicalCycle: "First Saturn Return (Karmic Realignment)", significance: "Foundational maturity, shedding illusions, and cementing authentic long-term career trajectory." },
    { age: 36, astrologicalCycle: "Jupiter Third Cycle (Scholarly & Material Expansion)", significance: "Golden apex for social prominence, real estate wealth, and familial celebrations." },
    { age: 42, astrologicalCycle: "Rahu Maturation Phase", significance: "Audacious breakthroughs in enterprise, global networking, and legacy milestones." },
    { age: 54, astrologicalCycle: "Solar-Jupiterian Legacy Era", significance: "Senior advisory governance, mentoring upcoming generations, and financial sovereignty." }
  ];

  return {
    currentMahadasha: {
      planet: mdPlanet,
      startDate: mdStart,
      endDate: mdEnd,
      nature: mdNature,
      lordOfHouses: mdRuled,
      placementHouse: mdHouse,
      prediction: mdPrediction,
    },
    currentAntardasha: {
      planet: adPlanet,
      startDate: adStart,
      endDate: adEnd,
      prediction: adPrediction,
    },
    currentPratyantardasha: pdPlanet ? {
      planet: pdPlanet,
      startDate: adStart,
      endDate: adEnd,
    } : undefined,
    currentPeriodThemes,
    upcomingMajorPeriods,
    criticalMilestoneAges,
  };
}
