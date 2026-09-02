import { Language } from '../types';

export const festivalNamesI18n: Record<string, string> = {
  // Major festivals
  "Diwali": "दीपावली (दिवाली)",
  "Deepavali": "दीपावली",
  "Chhoti Diwali": "छोटी दिवाली (नरक चतुर्दशी)",
  "Naraka Chaturdashi": "नरक चतुर्दशी",
  "Dhanteras": "धनतेरस (धनत्रयोदशी)",
  "Govardhan Puja": "गोवर्धन पूजा",
  "Bhai Dooj": "भाई दूज (यम द्वितीया)",
  "Holi": "होली (धुलंडी)",
  "Holika Dahan": "होलिका दहन",
  "Maha Shivaratri": "महाशिवरात्रि",
  "Krishna Janmashtami": "श्री कृष्ण जन्माष्टमी",
  "Ganesh Chaturthi": "गणेश चतुर्थी",
  "Ganesh Visarjan": "गणेश विसर्जन (अनंत चतुर्दशी)",
  "Raksha Bandhan": "रक्षाबंधन",
  "Rama Navami": "श्री राम नवमी",
  "Hanuman Jayanti": "श्री हनुमान जयंती",
  "Karwa Chauth": "करवा चौथ",
  "Makar Sankranti": "मकर संक्रांति",
  "Pongal": "पोंगल",
  "Lohri": "लोहड़ी",
  "Vasant Panchami": "वसंत पंचमी (सरस्वती पूजा)",
  "Gita Jayanti": "गीता जयंती",
  "Guru Purnima": "गुरु पूर्णिमा (व्यास पूर्णिमा)",
  "Sharad Purnima": "शरद पूर्णिमा (कोजागरी)",
  "Buddha Purnima": "बुद्ध पूर्णिमा",
  "Mahavir Jayanti": "महावीर जयंती",
  "Akshaya Tritiya": "अक्षय तृतीया",
  "Nag Panchami": "नाग पंचमी",
  "Skanda Sashti": "स्कंद षष्ठी",
  "Chhath Puja": "छठ पूजा",
  "Surya Shashti": "सूर्य षष्ठी (छठ)",
  "Karthigai Deepam": "कार्तिकेय दीपम",
  "Ganga Dussehra": "गंगा दशहरा",
  "Ratha Yatra": "जगन्नाथ रथ यात्रा",

  // Navaratri & Durga Puja
  "Chaitra Navratri": "चैत्र नवरात्रि",
  "Sharad Navratri": "शारदीय नवरात्रि",
  "Navaratri": "नवरात्रि",
  "Durga Ashtami": "दुर्गा अष्टमी",
  "Maha Navami": "महानवमी",
  "Vijayadashami": "विजयादशमी (दशहरा)",
  "Dussehra": "दशहरा (विजयादशमी)",

  // Vrats & Observances
  "Pradosh Vrat": "प्रदोष व्रत",
  "Masik Shivaratri": "मासिक शिवरात्रि",
  "Sankashti Chaturthi": "संकष्टी चतुर्थी",
  "Vinayaka Chaturthi": "विनायक चतुर्थी",
  "Satyanarayan Puja": "सत्यनारायण व्रत एवं पूजा",
  "Vat Purnima": "वट सावित्री पूर्णिमा",
  "Vat Savitri Vrat": "वट सावित्री व्रत",
  "Hartalika Teej": "हरतालिका तीज",
  "Hariyali Teej": "हरियाली तीज",
  "Ahoi Ashtami": "अहोई अष्टमी",
  "Tulsi Vivah": "तुलसी विवाह",

  // Ekadashis
  "Kamada Ekadashi": "कामदा एकादशी",
  "Varuthini Ekadashi": "वरूथिनी एकादशी",
  "Mohini Ekadashi": "मोहिनी एकादशी",
  "Apara Ekadashi": "अपरा एकादशी",
  "Nirjala Ekadashi": "निर्जला एकादशी",
  "Yogini Ekadashi": "योगिनी एकादशी",
  "Devshayani Ekadashi": "देवशयनी (हरिशयनी) एकादशी",
  "Kamika Ekadashi": "कामिका एकादशी",
  "Shravana Putrada Ekadashi": "श्रावण पुत्रदा एकादशी",
  "Aja Ekadashi": "अजा एकादशी",
  "Parsva Ekadashi (Parivartini)": "परिवर्तिनी (पार्श्व) एकादशी",
  "Indira Ekadashi": "इन्दिरा एकादशी",
  "Papankusha Ekadashi": "पापांकुशा एकादशी",
  "Rama Ekadashi": "रमा एकादशी",
  "Devutthana Ekadashi": "देवउठनी (प्रबोधिनी) एकादशी",
  "Utpanna Ekadashi": "उत्पन्ना एकादशी",
  "Mokshada Ekadashi": "मोक्षदा एकादशी",
  "Saphala Ekadashi": "सफला एकादशी",
  "Pausha Putrada Ekadashi": "पौष पुत्रदा एकादशी",
  "Shattila Ekadashi": "षट्तिला एकादशी",
  "Jaya Ekadashi": "जया एकादशी",
  "Vijaya Ekadashi": "विजया एकादशी",
  "Amalaki Ekadashi": "आमलकी एकादशी",
  "Papmochani Ekadashi": "पापमोचिनी एकादशी",
  "Padmini Ekadashi": "पद्मिनी एकादशी",
  "Parama Ekadashi": "परमा एकादशी"
};

export function getLocalizedFestivalName(name: string, lang: Language = 'en'): string {
  if (lang === 'hi') {
    return festivalNamesI18n[name] || name;
  }
  return name;
}
