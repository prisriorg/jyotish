import { Language } from '../types';

export const choghadiyaI18n: Record<Language, Record<string, { name: string; quality: string }>> = {
  en: {
    "Amrit": { name: "Amrit", quality: "Best / Highly Auspicious" },
    "Shubh": { name: "Shubh", quality: "Good / Auspicious" },
    "Labh": { name: "Labh", quality: "Prosperous / Gainful" },
    "Char": { name: "Char", quality: "Neutral / Variable (Good for travel/movement)" },
    "Rog": { name: "Rog", quality: "Inauspicious / Disease / Conflict" },
    "Kaal": { name: "Kaal", quality: "Inauspicious / Loss / Delays" },
    "Udveg": { name: "Udveg", quality: "Inauspicious / Anxiety / Stress" }
  },
  hi: {
    "Amrit": { name: "अमृत", quality: "सर्वश्रेष्ठ / अति शुभ" },
    "Shubh": { name: "शुभ", quality: "शुभ / मांगलिक कार्यों के लिए उत्तम" },
    "Labh": { name: "लाभ", quality: "लाभप्रद / उन्नति व समृद्धिदायक" },
    "Char": { name: "चर", quality: "सामान्य / यात्रा व गतिशीलता हेतु उपयुक्त" },
    "Rog": { name: "रोग", quality: "अशुभ / रोग व विवाद से बचें" },
    "Kaal": { name: "काल", quality: "अशुभ / हानि व बाधा उत्पन्न करने वाला" },
    "Udveg": { name: "उद्वेग", quality: "अशुभ / मानसिक चिंता व तनावकारक" }
  }
};

export const gowriI18n: Record<Language, Record<string, { name: string; quality: string }>> = {
  en: {
    "Amirtham": { name: "Amirtham", quality: "Best / Highly Auspicious" },
    "Labam": { name: "Labam", quality: "Profitable / Beneficial" },
    "Sugam": { name: "Sugam", quality: "Comfortable / Favorable" },
    "Danam": { name: "Danam", quality: "Auspicious for charity & contracts" },
    "Uthi": { name: "Uthi", quality: "Moderate / Progress with care" },
    "Rogam": { name: "Rogam", quality: "Inauspicious (Health concerns)" },
    "Sore": { name: "Sore", quality: "Inauspicious (Theft/Loss risk)" },
    "Visham": { name: "Visham", quality: "Inauspicious (Poison/Trouble)" }
  },
  hi: {
    "Amirtham": { name: "अमृतम", quality: "सर्वश्रेष्ठ / अत्यंत शुभ फलदायी" },
    "Labam": { name: "लाभम", quality: "लाभकारी / धन व सफलता दायक" },
    "Sugam": { name: "सुखम", quality: "सुखद / अनुकूल व शांतिपूर्ण" },
    "Danam": { name: "दानम", quality: "शुभ / दान व अनुबंधों के लिए उत्तम" },
    "Uthi": { name: "उथि", quality: "मध्यम / सावधानीपूर्वक कार्य करें" },
    "Rogam": { name: "रोगम", quality: "अशुभ / स्वास्थ्य संबंधी कष्ट" },
    "Sore": { name: "सोर", quality: "अशुभ / हानि या विवाद की संभावना" },
    "Visham": { name: "विषम", quality: "अशुभ / कष्ट व विषमता" }
  }
};

export const shoolaI18n: Record<Language, Record<string, { direction: string; remedy: string; description: string }>> = {
  en: {
    "East": {
      direction: "East",
      remedy: "Eat ghee or curd before travel",
      description: "Disha Shoola is in East. Avoid traveling East if possible."
    },
    "West": {
      direction: "West",
      remedy: "Eat jaggery before travel",
      description: "Disha Shoola is in West. Avoid traveling West if possible."
    },
    "North": {
      direction: "North",
      remedy: "Consume milk or milk sweets before travel",
      description: "Disha Shoola is in North. Avoid traveling North if possible."
    },
    "South": {
      direction: "South",
      remedy: "Consume mustard seeds or sesame seeds before travel",
      description: "Disha Shoola is in South. Avoid traveling South if possible."
    }
  },
  hi: {
    "East": {
      direction: "पूर्व",
      remedy: "यात्रा से पहले घी या दही खाकर निकलें",
      description: "आज दिशा शूल पूर्व दिशा में है। संभव हो तो पूर्व दिशा में यात्रा टालें।"
    },
    "West": {
      direction: "पश्चिम",
      remedy: "यात्रा से पहले गुड़ खाकर निकलें",
      description: "आज दिशा शूल पश्चिम दिशा में है। संभव हो तो पश्चिम दिशा में यात्रा टालें।"
    },
    "North": {
      direction: "उत्तर",
      remedy: "यात्रा से पहले दूध या दुग्ध निर्मित मिष्ठान ग्रहण करें",
      description: "आज दिशा शूल उत्तर दिशा में है। संभव हो तो उत्तर दिशा में यात्रा टालें।"
    },
    "South": {
      direction: "दक्षिण",
      remedy: "यात्रा से पहले राई या तिल का सेवन करें",
      description: "आज दिशा शूल दक्षिण दिशा में है। संभव हो तो दक्षिण दिशा में यात्रा टालें।"
    }
  }
};

export const tarabalamI18n: Record<Language, Record<number, { name: string; auspicious: boolean; description: string }>> = {
  en: {
    1: { name: "Janma Tara", auspicious: false, description: "Indicates body/health focus. Needs care for strenuous efforts." },
    2: { name: "Sampat Tara", auspicious: true, description: "Indicates wealth, prosperity, and financial gain." },
    3: { name: "Vipat Tara", auspicious: false, description: "Indicates danger, obstacles, and difficulties." },
    4: { name: "Kshema Tara", auspicious: true, description: "Indicates well-being, protection, and security." },
    5: { name: "Pratyak Tara", auspicious: false, description: "Indicates hurdles, opposition, and setbacks." },
    6: { name: "Sadhana Tara", auspicious: true, description: "Indicates success, achievement of goals, and fulfillment." },
    7: { name: "Naidhana Tara", auspicious: false, description: "Indicates critical hurdles, danger; avoid new ventures." },
    8: { name: "Mitra Tara", auspicious: true, description: "Indicates friendship, cooperation, and support." },
    9: { name: "Parama Mitra Tara", auspicious: true, description: "Indicates supreme friendship, great ally support, and high success." }
  },
  hi: {
    1: { name: "जन्म तारा", auspicious: false, description: "शारीरिक स्वास्थ्य पर ध्यान दें। महत्वपूर्ण नए कार्यों में सतर्कता रखें।" },
    2: { name: "सम्पत तारा", auspicious: true, description: "धन, समृद्धि व आर्थिक लाभ के लिए अत्यंत शुभ।" },
    3: { name: "विपत् तारा", auspicious: false, description: "विपत्ति, बाधा व अप्रत्याशित अड़चनों का सूचक। सतर्क रहें।" },
    4: { name: "क्षेम तारा", auspicious: true, description: "कल्याण, सुख, सुरक्षा व कार्य सिद्धि के लिए शुभ।" },
    5: { name: "प्रत्यरि तारा", auspicious: false, description: "विरोध, शत्रु बाधा व अड़चनों की संभावना। विवाद से बचें।" },
    6: { name: "साधना तारा", auspicious: true, description: "लक्ष्य प्राप्ति, कार्य सिद्धि व सफलता हेतु अत्यंत अनुकूल।" },
    7: { name: "निधन / वध तारा", auspicious: false, description: "अत्यधिक अशुभ तारा। जोखिम भरे व मांगलिक नए कार्यों से बचें।" },
    8: { name: "मित्र तारा", auspicious: true, description: "मित्रता, सहयोग, सुख व अनुकूलता प्रदाता।" },
    9: { name: "परम मित्र तारा", auspicious: true, description: "परम हितैषी, उच्च सफलता व सर्वकल्याणकारी।" }
  }
};

export const sadesatiI18n: Record<Language, {
  notActive: string;
  risingPhase: string;
  peakPhase: string;
  settingPhase: string;
  dhaiya4th: string;
  dhaiya8th: string;
  noDhaiya: string;
}> = {
  en: {
    notActive: "Sade Sati is currently not active for your natal Moon sign.",
    risingPhase: "First Phase (Rising / 12th from Moon): Rising phase of Sade Sati. Affects mental peace, travel, and expenses.",
    peakPhase: "Second Phase (Peak / Over natal Moon): Peak phase of Sade Sati. Direct transit over Moon. Requires discipline and emotional equilibrium.",
    settingPhase: "Third Phase (Setting / 2nd from Moon): Concluding phase of Sade Sati. Focuses on finances, domestic life, and stability.",
    dhaiya4th: "Kantaka Shani (4th from Moon): 2.5 year Dhaiya cycle influencing domestic harmony and career focus.",
    dhaiya8th: "Ashtama Shani (8th from Moon): 2.5 year Dhaiya cycle requiring health diligence and patience.",
    noDhaiya: "No Saturn Dhaiya is active currently."
  },
  hi: {
    notActive: "वर्तमान में आपकी चंद्र राशि पर शनि की साढ़े साती का प्रभाव नहीं है।",
    risingPhase: "प्रथम चरण (उदय चरण / चंद्र से 12वां भाव): साढ़े साती का प्रारंभिक चरण। मानसिक चिंतन, यात्रा और व्यय पर प्रभाव।",
    peakPhase: "द्वितीय चरण (शिखर चरण / चंद्र के ऊपर गोचर): साढ़े साती का मुख्य शिखर चरण। मानसिक धैर्य, परिश्रम और संतुलन की आवश्यकता।",
    settingPhase: "तृतीय चरण (अस्त चरण / चंद्र से दूसरा भाव): साढ़े साती का अंतिम चरण। धन, वाणी, कुटुंब और स्थिरता पर केंद्रित।",
    dhaiya4th: "कंटक शनि (चंद्र से चतुर्थ भाव): ढ़ाई वर्ष की ढैय्या। घरेलू सुख व कार्यक्षेत्र में धैर्य आवश्यक।",
    dhaiya8th: "अष्टम शनि (चंद्र से अष्टम भाव): ढ़ाई वर्ष की अष्टम ढैय्या। स्वास्थ्य व गुप्त चिंताओं के प्रति सजग रहें।",
    noDhaiya: "वर्तमान में कोई शनि ढैय्या सक्रिय नहीं है।"
  }
};
