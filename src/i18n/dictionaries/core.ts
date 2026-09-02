import { Language } from '../types';

export const rashiNamesI18n: Record<Language, string[]> = {
  en: [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ],
  hi: [
    "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
  ]
};

export const planetNamesI18n: Record<Language, Record<string, string>> = {
  en: {
    "Sun": "Sun",
    "Moon": "Moon",
    "Mars": "Mars",
    "Mercury": "Mercury",
    "Jupiter": "Jupiter",
    "Venus": "Venus",
    "Saturn": "Saturn",
    "Rahu": "Rahu",
    "Ketu": "Ketu",
    "Ascendant": "Ascendant",
    "Lagna": "Lagna",
    "Uranus": "Uranus",
    "Neptune": "Neptune",
    "Pluto": "Pluto"
  },
  hi: {
    "Sun": "सूर्य",
    "Moon": "चन्द्र",
    "Mars": "मंगल",
    "Mercury": "बुध",
    "Jupiter": "गुरु (बृहस्पति)",
    "Venus": "शुक्र",
    "Saturn": "शनि",
    "Rahu": "राहु",
    "Ketu": "केतु",
    "Ascendant": "लग्न",
    "Lagna": "लग्न",
    "Uranus": "अरुण",
    "Neptune": "वरुण",
    "Pluto": "यम"
  }
};

export const nakshatraNamesI18n: Record<Language, string[]> = {
  en: [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta",
    "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
  ],
  hi: [
    "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा",
    "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा", "पूर्वाफाल्गुनी", "उत्तराफाल्गुनी",
    "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा",
    "मूल", "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा",
    "शतभिषा", "पूर्वाभाद्रपद", "उत्तराभाद्रपद", "रेवती"
  ]
};

export const tithiNamesI18n: Record<Language, string[]> = {
  en: [
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Prathama", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
  ],
  hi: [
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
    "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी",
    "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
    "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "अमावस्या"
  ]
};

export const pakshaNamesI18n: Record<Language, Record<string, string>> = {
  en: {
    "Shukla": "Shukla Paksha",
    "Krishna": "Krishna Paksha"
  },
  hi: {
    "Shukla": "शुक्ल पक्ष",
    "Krishna": "कृष्ण पक्ष"
  }
};

export const karanaNamesI18n: Record<Language, string[]> = {
  en: [
    "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti",
    "Shakuni", "Chatushpada", "Naga", "Kimstughna"
  ],
  hi: [
    "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि (भद्रा)",
    "शकुनि", "चतुष्पद", "नाग", "किंस्तुघ्न"
  ]
};

export const yogaNamesI18n: Record<Language, string[]> = {
  en: [
    "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
    "Sukarman", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
    "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana", "Parigha",
    "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
  ],
  hi: [
    "विष्कुम्भ", "प्रीति", "आयुष्मान्", "सौभाग्य", "शोभन", "अतिगण्ड",
    "सुकर्मा", "धृति", "शूल", "गण्ड", "वृद्धि", "ध्रुव", "व्याघात",
    "हर्षण", "वज्र", "सिद्धि", "व्यतीपात", "वरीयान्", "परिघ",
    "शिव", "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"
  ]
};

export const vaaraNamesI18n: Record<Language, string[]> = {
  en: [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ],
  hi: [
    "रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"
  ]
};

export const houseNamesI18n: Record<Language, Record<number, string>> = {
  en: {
    1: "1st House (Lagna / Self)",
    2: "2nd House (Dhana / Wealth)",
    3: "3rd House (Sahaja / Siblings & Enterprise)",
    4: "4th House (Sukha / Home & Mother)",
    5: "5th House (Putra / Intellect & Children)",
    6: "6th House (Ripu / Service, Health & Debts)",
    7: "7th House (Kalatra / Spouse & Partnerships)",
    8: "8th House (Ayur / Longevity & Transformation)",
    9: "9th House (Bhagya / Fortune & Dharma)",
    10: "10th House (Karma / Career & Status)",
    11: "11th House (Labha / Gains & Network)",
    12: "12th House (Vyaya / Expenditure & Liberation)"
  },
  hi: {
    1: "प्रथम भाव (लग्न / आत्म व व्यक्तित्व)",
    2: "द्वितीय भाव (धन भाव / वाणी व कुटुंब)",
    3: "तृतीय भाव (सहज भाव / पराक्रम, भ्राता व उद्यम)",
    4: "चतुर्थ भाव (सुख भाव / माता, गृह व वाहन)",
    5: "पंचम भाव (सुत/पुत्र भाव / बुद्धि, विद्या व संतान)",
    6: "षष्ठ भाव (रिपु भाव / रोग, ऋण, शत्रु व सेवा)",
    7: "सप्तम भाव (कलत्र भाव / जीवनसाथी व साझेदारी)",
    8: "अष्टम भाव (आयु भाव / गूढ़ रहस्य व परिवर्तन)",
    9: "नवम भाव (भाग्य भाव / धर्म, गुरु व तीर्थ)",
    10: "दशम भाव (कर्म भाव / आजीविका, पद व प्रतिष्ठा)",
    11: "एकादश भाव (लाभ भाव / आय, सिद्धि व मित्र)",
    12: "द्वादश भाव (व्यय भाव / मोक्ष, विदेश व व्यय)"
  }
};
