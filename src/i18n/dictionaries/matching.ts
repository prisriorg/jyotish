import { Language } from '../types';

export const kootaNamesI18n: Record<Language, Record<string, { name: string; area: string }>> = {
  en: {
    "Varna": { name: "Varna", area: "Work / Spiritual Alignment" },
    "Vashya": { name: "Vashya", area: "Mutual Attraction / Influence" },
    "Tara": { name: "Tara", area: "Destiny / Well-being" },
    "Yoni": { name: "Yoni", area: "Physical & Intimate Compatibility" },
    "Graha Maitri": { name: "Graha Maitri", area: "Mental & Intellectual Friendship" },
    "Gana": { name: "Gana", area: "Temperament & Behavioral Compatibility" },
    "Bhakoot": { name: "Bhakoot", area: "Emotional & Family Prosperity" },
    "Nadi": { name: "Nadi", area: "Health, Genetics & Offspring" }
  },
  hi: {
    "Varna": { name: "वर्ण", area: "कार्य, स्वभाव व अहंकार सामंजस्य" },
    "Vashya": { name: "वश्य", area: "आपसी आकर्षण, नियंत्रण व समर्पण" },
    "Tara": { name: "तारा", area: "भाग्य, दीर्घायु व स्वास्थ्य" },
    "Yoni": { name: "योनि", area: "शारीरिक व दांपत्य आकर्षण" },
    "Graha Maitri": { name: "ग्रह मैत्री", area: "मानसिक व वैचारिक मित्रता" },
    "Gana": { name: "Gana / गण", area: "स्वभाव, व्यवहार व चरित्र अनुकूलता" },
    "Bhakoot": { name: "भकूट", area: "पारिवारिक सुख, प्रेम व वंश वृद्धि" },
    "Nadi": { name: "नाड़ी", area: "स्वास्थ्य, आनुवांशिक व संतान सुख" }
  }
};

export const varnaI18n: Record<Language, Record<string, string>> = {
  en: { "Brahmin": "Brahmin", "Kshatriya": "Kshatriya", "Vaishya": "Vaishya", "Shudra": "Shudra" },
  hi: { "Brahmin": "ब्राह्मण", "Kshatriya": "क्षत्रिय", "Vaishya": "वैश्य", "Shudra": "शूद्र" }
};

export const vashyaI18n: Record<Language, Record<string, string>> = {
  en: { "Chatushpad": "Chatushpad (Quadruped)", "Manav": "Manav (Human)", "Jalchar": "Jalchar (Water)", "Vanchar": "Vanchar (Wild)", "Keet": "Keet (Insect)" },
  hi: { "Chatushpad": "चतुष्पद", "Manav": "मानव (द्विपद)", "Jalchar": "जलचर", "Vanchar": "वनचर", "Keet": "कीट" }
};

export const ganaI18n: Record<Language, Record<string, string>> = {
  en: { "Deva": "Deva (Divine)", "Manushya": "Manushya (Human)", "Rakshasa": "Rakshasa (Fiery/Fierce)" },
  hi: { "Deva": "देव गण", "Manushya": "मनुष्य गण", "Rakshasa": "राक्षस गण" }
};

export const nadiI18n: Record<Language, Record<string, string>> = {
  en: { "Aadi": "Aadi (Vata)", "Madhya": "Madhya (Pitta)", "Antya": "Antya (Kapha)" },
  hi: { "Aadi": "आदि (वात)", "Madhya": "मध्य (पित्त)", "Antya": "अंत्य (कफ)" }
};

export const yoniI18n: Record<Language, Record<string, string>> = {
  en: {
    "Horse": "Horse (Ashwa)", "Elephant": "Elephant (Gaja)", "Sheep": "Sheep (Mesha)",
    "Serpent": "Serpent (Sarpa)", "Dog": "Dog (Shwan)", "Cat": "Cat (Marjara)",
    "Rat": "Rat (Mushaka)", "Cow": "Cow (Gau)", "Buffalo": "Buffalo (Mahisha)",
    "Tiger": "Tiger (Vyaghra)", "Deer": "Deer (Mriga)", "Monkey": "Monkey (Vanara)",
    "Mongoose": "Mongoose (Nakula)", "Lion": "Lion (Simha)"
  },
  hi: {
    "Horse": "अश्व (घोड़ा)", "Elephant": "गज (हाथी)", "Sheep": "मेष (भेड़)",
    "Serpent": "सर्प (सांप)", "Dog": "श्वान (कुत्ता)", "Cat": "मार्जार (बिल्ली)",
    "Rat": "मूषक (चूहा)", "Cow": "गौ (गाय)", "Buffalo": "महिष (भैंसा)",
    "Tiger": "व्याघ्र (बाघ)", "Deer": "मृग (हिरण)", "Monkey": "वानर (बंदर)",
    "Mongoose": "नकुल (नेवला)", "Lion": "सिंह (शेर)"
  }
};

export const matchingVerdictsI18n: Record<Language, Record<string, string>> = {
  en: {
    "Good to Proceed": "Good to Proceed (Auspicious Match)",
    "Good (Both Manglik)": "Good Match (Both Manglik - Dosha Cancelled)",
    "Mismatch (Manglik Mismatch)": "Caution: Manglik Mismatch (One partner is Manglik)",
    "Mismatch (Manglik Mismatch) - Consult Astrologer (High Score)": "Manglik Mismatch with High Guna Score - Consult Astrologer for Remedies",
    "Low Score (<18)": "Low Guna Score (Below 18) - Not Recommended classically",
    "Not Recommended": "Not Recommended"
  },
  hi: {
    "Good to Proceed": "विवाह हेतु उत्तम व अनुकूल मिलान (दोष रहित)",
    "Good (Both Manglik)": "उत्तम मिलान (दोनों मांगलिक होने से दोष परिहार)",
    "Mismatch (Manglik Mismatch)": "सतर्कता: मांगलिक दोष विषमता (एक मांगलिक, दूसरा गैर-मांगलिक)",
    "Mismatch (Manglik Mismatch) - Consult Astrologer (High Score)": "गुण मिलान अच्छा है परंतु मांगलिक विषमता है - ज्योतिषी से उपाय परामर्श लें",
    "Low Score (<18)": "गुण अंक 18 से कम (विवाह हेतु अनुशंसित नहीं)",
    "Not Recommended": "विवाह हेतु अनुशंसित नहीं"
  }
};
