import { Language } from '../types';

export const careerI18n: {
  recommendation: Record<Language, Record<string, string>>;
  leadership: Record<Language, Record<string, string>>;
  tenthLordDictionary: Record<Language, Record<number, (lord: string) => string>>;
  panchaMahapurusha: Record<Language, Record<string, string>>;
  suitableFields: Record<Language, Record<string, string>>;
  traits: Record<Language, Record<string, string>>;
  strategicAdvice: Record<Language, string[]>;
} = {
  recommendation: {
    en: {
      "Business & Independent Enterprise": "Business & Independent Enterprise",
      "Employment / Job": "Employment / Job",
      "Hybrid / Consulting & Freelance": "Hybrid / Consulting & Freelance"
    },
    hi: {
      "Business & Independent Enterprise": "व्यवसाय एवं स्वतंत्र उद्यम (व्यापार / बिज़नेस)",
      "Employment / Job": "नौकरी एवं कॉरपोरेट सेवा (जॉब / सर्विस)",
      "Hybrid / Consulting & Freelance": "हाइब्रिड मॉडल / कंसल्टिंग व फ्रीलांसिंग"
    }
  },
  leadership: {
    en: {
      "Executive / High Authority": "Executive / High Authority",
      "Mid-to-Senior Leadership": "Mid-to-Senior Leadership",
      "Individual Contributor / Specialist": "Individual Contributor / Specialist"
    },
    hi: {
      "Executive / High Authority": "शीर्ष कार्यकारी नेतृत्व / उच्च प्रशासनिक अधिकार",
      "Mid-to-Senior Leadership": "मध्यम से वरिष्ठ प्रबंधकीय नेतृत्व",
      "Individual Contributor / Specialist": "स्वतंत्र विशेषज्ञ / तकनीकी व विषय मर्मज्ञ"
    }
  },
  tenthLordDictionary: {
    en: {
      1: (lord) => `10th Lord (${lord}) in 1st House: Creates a self-made leader and pioneer. Native builds high authority through personal enterprise, individual identity, and public recognition.`,
      2: (lord) => `10th Lord (${lord}) in 2nd House: Career is intrinsically tied to capital, banking, family business, asset accumulation, and verbal advisory.`,
      3: (lord) => `10th Lord (${lord}) in 3rd House: Excellence in high-tech, software engineering, digital media, independent enterprise, communications, and bold strategic ventures.`,
      4: (lord) => `10th Lord (${lord}) in 4th House: Native attains high status in real estate, education, institutional administration, manufacturing, or vehicle/infrastructure engineering.`,
      5: (lord) => `10th Lord (${lord}) in 5th House: Exceptional intellect, high-level investment acumen, advisory council, strategic consulting, creative leadership, and algorithmic thinking.`,
      6: (lord) => `10th Lord (${lord}) in 6th House: Outstanding competence in competitive environments, technical service, healthcare, legal systems, or operational problem-solving.`,
      7: (lord) => `10th Lord (${lord}) in 7th House: Global commercial success, high-value contracts, client-facing enterprise, foreign trade, and prominent joint ventures.`,
      8: (lord) => `10th Lord (${lord}) in 8th House: Master of deep research, confidential data, cybersecurity, metaphysics, forensic investigations, and transformative technology.`,
      9: (lord) => `10th Lord (${lord}) in 9th House: High ethical leadership, global consulting, international expansion, judiciary, publishing, and mentor-level authority.`,
      10: (lord) => `10th Lord (${lord}) in 10th House: Swa-Kshetra pinnacle of karma. Unassailable corporate executive status, government recognition, and enduring industry legacy.`,
      11: (lord) => `10th Lord (${lord}) in 11th House: Multiplier of gains. Native builds scalable enterprise, extensive professional networks, SaaS platforms, and high-margin ventures.`,
      12: (lord) => `10th Lord (${lord}) in 12th House: Career flourishes with multinational corporations (MNCs), overseas institutions, remote engineering, research labs, or foreign clients.`
    },
    hi: {
      1: (lord) => `दशमेश (${lord}) प्रथम भाव (लग्न) में: स्व-निर्मित व्यक्तित्व और प्रणेता बनाते हैं। जातक व्यक्तिगत प्रयास, स्वावलंबन और सार्वजनिक प्रतिष्ठा से सर्वोच्च पद प्राप्त करता है।`,
      2: (lord) => `दशमेश (${lord}) द्वितीय भाव में: आजीविका का प्रत्यक्ष संबंध वित्त, बैंकिंग, पारिवारिक व्यवसाय, संपत्ति संचय और प्रभावी वाणी व परामर्श से रहता है।`,
      3: (lord) => `दशमेश (${lord}) तृतीय भाव में: सूचना प्रौद्योगिकी, सॉफ्टवेयर, डिजिटल मीडिया, जनसंचार, पराक्रम और साहसिक व्यावसायिक उपक्रमों में उत्कृष्ट सफलता।`,
      4: (lord) => `दशमेश (${lord}) चतुर्थ भाव में: रियल एस्टेट, शिक्षण, संस्थागत प्रशासन, विनिर्माण, वाहन और बुनियादी ढांचा परियोजनाओं में उच्च पद व प्रतिष्ठा।`,
      5: (lord) => `दशमेश (${lord}) पंचम भाव में: प्रखर बौद्धिक क्षमता, शेयर/निवेश सूझबूझ, रणनीतिक परामर्श, शोध व रचनात्मक नेतृत्व में असाधारण उन्नति।`,
      6: (lord) => `दशमेश (${lord}) षष्ठ भाव में: प्रतिस्पर्धी परीक्षाओं में विजय, तकनीकी सेवा, चिकित्सा/स्वास्थ्य, कानून व जटिल समस्याओं के समाधान में दक्ष।`,
      7: (lord) => `दशमेश (${lord}) सप्तम भाव में: बड़े व्यापारिक अनुबंध, विदेशी व्यापार, साझेदारी और जन-व्यवहार में राष्ट्रीय व अंतरराष्ट्रीय सफलता।`,
      8: (lord) => `दशमेश (${lord}) अष्टम भाव में: गहन शोध, साइबर सुरक्षा, गोपनीय विश्लेषण, डेटा साइंस, बीमा व गूढ़ तकनीकों में विशेषज्ञता।`,
      9: (lord) => `दशमेश (${lord}) नवम भाव में: नैतिक नेतृत्व, उच्च परामर्श, वैश्विक विस्तार, न्यायपालिका, प्रकाशन व गुरुतुल्य सम्मान प्राप्त होता है।`,
      10: (lord) => `दशमेश (${lord}) दशम भाव (स्वक्षेत्र) में: कर्म का सर्वोच्च शिखर। अटूट कॉरपोरेट प्रतिष्ठा, प्रशासनिक सम्मान और उद्योग जगत में दीर्घकालिक प्रभाव।`,
      11: (lord) => `दशमेश (${lord}) एकादश भाव में: प्रचुर लाभ योग। जातक व्यापक व्यावसायिक नेटवर्क, बड़े समूह और उच्च लाभ मार्जिन वाले उद्यम स्थापित करता है।`,
      12: (lord) => `दशमेश (${lord}) द्वादश भाव में: बहुराष्ट्रीय कंपनियों (MNC), विदेशी संस्थाओं, रिमोट वर्क, आयात-निर्यात या शोध प्रयोगशालाओं में विशिष्ट उन्नति।`
    }
  },
  panchaMahapurusha: {
    en: {
      "Ruchaka": "Ruchaka Mahapurusha Yoga (Mars in Kendra in Own/Exalted sign): Bestows fearless commander intellect, executive authority, and unmatched technical drive.",
      "Bhadra": "Bhadra Mahapurusha Yoga (Mercury in Kendra in Own/Exalted sign): Exceptional algorithmic intelligence, master communicator, and visionary tech architect.",
      "Hamsa": "Hamsa Mahapurusha Yoga (Jupiter in Kendra in Own/Exalted sign): Sovereign wisdom, universal respect, ethical leadership, and supreme advisory status.",
      "Malavya": "Malavya Mahapurusha Yoga (Venus in Kendra in Own/Exalted sign): Opulent success, creative mastery, high luxury, and magnetic public charisma.",
      "Sasa": "Sasa Mahapurusha Yoga (Saturn in Kendra in Own/Exalted sign): Immense stamina, institutional leadership, mass enterprise authority, and enduring empire-building."
    },
    hi: {
      "Ruchaka": "रुचक महापुरुष योग (मंगल केंद्र में स्वराशि/उच्च राशि में): अदम्य साहस, उच्च प्रशासनिक अधिकार, तकनीकी पराक्रम और नेतृत्व क्षमता प्रदान करता है।",
      "Bhadra": "भद्र महापुरुष योग (बुध केंद्र में स्वराशि/उच्च राशि में): असाधारण बौद्धिक प्रखरता, गणितीय/एल्गोरिथमिक दक्षता और कुशल संचार कौशल।",
      "Hamsa": "हंस महापुरुष योग (गुरु केंद्र में स्वराशि/उच्च राशि में): सर्वोच्च विवेक, सार्वभौमिक सम्मान, नीतिपरायण नेतृत्व और उच्चतम परामर्शदाता पद।",
      "Malavya": "मालव्य महापुरुष योग (शुक्र केंद्र में स्वराशि/उच्च राशि में): ऐश्वर्यशाली जीवन, रचनात्मक प्रवीणता, विलासिता, और प्रभावशाली जन-आकर्षण।",
      "Sasa": "शश महापुरुष योग (शनि केंद्र में स्वराशि/उच्च राशि में): असीम धैर्य, दीर्घकालिक संगठनात्मक सत्ता, विशाल जनसमर्थन और स्थायी प्रतिष्ठा।"
    }
  },
  suitableFields: {
    en: {
      "Technology & Engineering Leadership": "Technology & Engineering Leadership",
      "Executive Management": "Executive Management",
      "Strategic Planning & Operations": "Strategic Planning & Operations",
      "Software Architecture & Systems": "Software Architecture & Systems",
      "Financial Engineering & Analytics": "Financial Engineering & Analytics",
      "Product Development & Infrastructure": "Product Development & Infrastructure",
      "Artificial Intelligence & Digital Platforms": "Artificial Intelligence & Digital Platforms",
      "Consulting & High-Tech Research": "Consulting & High-Tech Research",
      "Media, Communications & Networking": "Media, Communications & Networking",
      "Data Science & Deep Research": "Data Science & Deep Research",
      "Healthcare / Biomedical Tech": "Healthcare / Biomedical Tech",
      "Advisory & Human Resources": "Advisory & Human Resources",
      "Fintech, E-Commerce & SaaS": "Fintech, E-Commerce & SaaS",
      "High-Performance Engineering & Defense Systems": "High-Performance Engineering & Defense Systems",
      "Enterprise Architecture & Scaled Systems": "Enterprise Architecture & Scaled Systems"
    },
    hi: {
      "Technology & Engineering Leadership": "प्रौद्योगिकी एवं इंजीनियरिंग नेतृत्व",
      "Executive Management": "उच्च प्रबंधकीय प्रशासन",
      "Strategic Planning & Operations": "रणनीतिक योजना एवं संचालन",
      "Software Architecture & Systems": "सॉफ्टवेयर आर्किटेक्चर एवं कोर सिस्टम्स",
      "Financial Engineering & Analytics": "वित्तीय इंजीनियरिंग एवं डेटा एनालिटिक्स",
      "Product Development & Infrastructure": "उत्पाद विकास एवं बुनियादी ढांचा",
      "Artificial Intelligence & Digital Platforms": "आर्टिफिशियल इंटेलिजेंस (AI) एवं डिजिटल प्लेटफॉर्म",
      "Consulting & High-Tech Research": "रणनीतिक परामर्श एवं उच्च-तकनीकी अनुसंधान",
      "Media, Communications & Networking": "मीडिया, संचार एवं नेटवर्किंग",
      "Data Science & Deep Research": "डेटा साइंस एवं गहन अनुसंधान",
      "Healthcare / Biomedical Tech": "स्वास्थ्य सेवा एवं बायोमेडिकल टेक्नोलॉजी",
      "Advisory & Human Resources": "वरिष्ठ सलाहकार एवं मानव संसाधन",
      "Fintech, E-Commerce & SaaS": "फिनटेक, ई-कॉमर्स एवं सास (SaaS) प्लेटफॉर्म",
      "High-Performance Engineering & Defense Systems": "उन्नत इंजीनियरिंग एवं रक्षा प्रौद्योगिकियां",
      "Enterprise Architecture & Scaled Systems": "एंटरप्राइज आर्किटेक्चर एवं बड़े पैमाने के सिस्टम"
    }
  },
  traits: {
    en: {
      "digbala": "Possesses 100% Digbala (Directional Strength) in 10th House: Radiates natural command and executive presence."
    },
    hi: {
      "digbala": "दशम भाव में शत-प्रतिशत दिग्बल (दिशा बल): स्वाभाविक प्रशासनिक प्रभाव और नेतृत्वकारी उपस्थिति।"
    }
  },
  strategicAdvice: {
    en: [
      "Maintain written, enforceable agreements in all professional ventures.",
      "Cultivate niche mastery in your field before scaling horizontally.",
      "Leverage systematic delegation to protect high-leverage strategic time."
    ],
    hi: [
      "सभी व्यावसायिक मामलों व समझौतों में हमेशा लिखित व स्पष्ट अनुबंध रखें।",
      "कार्यक्षेत्र का क्षैतिज विस्तार करने से पहले अपने मूल क्षेत्र में विशेषज्ञता सुदृढ़ करें।",
      "अपने समय का सदुपयोग करने हेतु कार्यों का व्यवस्थित विभाजन और प्रतिनिधि मंडल अपनाएं।"
    ]
  }
};

export const wealthI18n = {
  rating: {
    en: {
      "Exceptional": "Exceptional",
      "High": "High",
      "Moderate": "Moderate",
      "Fluctuating": "Fluctuating"
    },
    hi: {
      "Exceptional": "असाधारण / विपुल धन संपदा",
      "High": "उच्च / सुदृढ़ आर्थिक समृद्धि",
      "Moderate": "मध्यम / स्थिर आय",
      "Fluctuating": "परिवर्तनशील / आय-व्यय संतुलन आवश्यक"
    }
  },
  savingCapacity: {
    en: {
      "Strong": "Strong",
      "Average": "Average",
      "Challenging": "Challenging"
    },
    hi: {
      "Strong": "उत्कृष्ट / सशक्त बचत व संचय क्षमता",
      "Average": "सामान्य / संतुलित बचत",
      "Challenging": "चुनौतीपूर्ण / अनपेक्षित खर्चों पर नियंत्रण रखें"
    }
  },
  dhanaYogaStrength: {
    en: { "Powerful": "Powerful", "Moderate": "Moderate" },
    hi: { "Powerful": "अत्यंत प्रबल", "Moderate": "मध्यम" }
  },
  secondLordDictionary: {
    en: {
      1: (lord: string) => `2nd Lord (${lord}) in 1st House: Wealth through personal initiative, leadership, and public influence.`,
      2: (lord: string) => `2nd Lord (${lord}) in 2nd House: Swa-kshetra strength. Outstanding liquid wealth, family business prosperity, and financial stability.`,
      11: (lord: string) => `2nd Lord (${lord}) in 11th House: Direct Dhana Yoga connection. Uninterrupted income streams, compounding wealth, and profitable professional network.`,
      default: (lord: string, h: number) => `2nd Lord (${lord}) in House ${h}: Influences asset creation and wealth retention through house ${h} endeavors.`
    },
    hi: {
      1: (lord: string) => `द्वितीयेश (${lord}) प्रथम भाव में: व्यक्तिगत उद्यम, बुद्धिबल और प्रतिष्ठा द्वारा प्रचुर धनार्जन।`,
      2: (lord: string) => `द्वितीयेश (${lord}) द्वितीय भाव में: स्वक्षेत्रीय प्रबलता। संचित धन, कुटुंब की संपन्नता और सुदृढ़ आर्थिक सुरक्षा।`,
      11: (lord: string) => `द्वितीयेश (${lord}) एकादश भाव में: प्रत्यक्ष महाधन योग। आय के निरंतर स्रोत, धन संचय में निरंतर वृद्धि और व्यापक लाभ।`,
      default: (lord: string, h: number) => `द्वितीयेश (${lord}) भाव ${h} में: भाव ${h} से जुड़े प्रयासों से धनार्जन और संचय का निर्माण होता है।`
    }
  },
  eleventhLordDictionary: {
    en: {
      1: (lord: string) => `11th Lord (${lord}) in 1st House: Native easily monetizes personal skills and commands high earning power.`,
      2: (lord: string) => `11th Lord (${lord}) in 2nd House: Direct wealth accumulation yoga. High savings conversion rate.`,
      11: (lord: string) => `11th Lord (${lord}) in 11th House: Extraordinary abundance. Multi-channel passive and active income streams.`,
      default: (lord: string, h: number) => `11th Lord (${lord}) in House ${h}: High income generated via house ${h} activities.`
    },
    hi: {
      1: (lord: string) => `एकादशेश (${lord}) प्रथम भाव में: जातक अपनी व्यक्तिगत क्षमताओं और कौशल से सहजता से उच्च आय अर्जित करता है।`,
      2: (lord: string) => `एकादशेश (${lord}) द्वितीय भाव में: प्रत्यक्ष धन संचय योग। आय को स्थायी संपत्ति में बदलने की उत्तम क्षमता।`,
      11: (lord: string) => `एकादशेश (${lord}) एकादश भाव में: विपुल लाभ योग। सक्रिय व निष्क्रिय दोनों माध्यमों से निरंतर धन लाभ।`,
      default: (lord: string, h: number) => `एकादशेश (${lord}) भाव ${h} में: भाव ${h} के क्षेत्र में परिश्रम से निरंतर लाभ प्राप्त होता है।`
    }
  },
  financialCautions: {
    en: [
      "Avoid emotional or uncollateralized lending to acquaintances.",
      "Diversify liquid holdings across debt, equity, and physical assets.",
      "Keep structured accounting discipline for speculative ventures."
    ],
    hi: [
      "भावुकतावश बिना गारंटी किसी को बड़ा ऋण देने से बचें।",
      "अपनी तरल पूंजी को केवल एक जगह न लगाकर ऋण, इक्विटी और स्थिर संपत्तियों में संतुलित रखें।",
      "जोखिम भरे निवेशों में पूर्व-निर्धारित सीमा व अनुशासित रणनीति अपनाएं।"
    ]
  }
};

export const marriageI18n = {
  harmonyRating: {
    en: {
      "Very Good": "Very Good",
      "Good": "Good",
      "Average": "Average",
      "Needs Caution": "Needs Caution"
    },
    hi: {
      "Very Good": "अति उत्तम / अत्यंत सुखद दांपत्य",
      "Good": "उत्तम / अनुकूल व सामंजस्यपूर्ण",
      "Average": "सामान्य / आपसी समझ से बेहतर होने वाला",
      "Needs Caution": "सतर्कता आवश्यक / धैर्य व परिपक्वता अपेक्षित"
    }
  },
  marriageType: {
    en: {
      "Love Marriage": "Love Marriage",
      "Arranged Marriage": "Arranged Marriage",
      "Love-cum-Arranged (Self-Choice with Family Approval)": "Love-cum-Arranged (Self-Choice with Family Approval)"
    },
    hi: {
      "Love Marriage": "प्रेम विवाह (स्वयं द्वारा चयन)",
      "Arranged Marriage": "पारंपरिक विवाह (पारिवारिक सहमति से)",
      "Love-cum-Arranged (Self-Choice with Family Approval)": "प्रेम व पारंपरिक विवाह (स्वयं की पसंद + परिवार का पूर्ण समर्थन)"
    }
  },
  spouseAgeDifference: {
    relativeAge: {
      en: {
        "Younger": "Younger",
        "Older": "Older",
        "Similar Age (Peer)": "Similar Age (Peer)"
      },
      hi: {
        "Younger": "आयु में छोटा / कनिष्ठ",
        "Older": "आयु में बड़ा / वरिष्ठ",
        "Similar Age (Peer)": "समकक्ष आयु (लगभग समान उम्र)"
      }
    },
    maturity: {
      en: {
        "High / Senior Demeanor": "High / Senior Demeanor",
        "Balanced / Peer-Level": "Balanced / Peer-Level",
        "Youthful / Energetic": "Youthful / Energetic"
      },
      hi: {
        "High / Senior Demeanor": "उच्च परिपक्वता / शांत व गंभीर स्वभाव",
        "Balanced / Peer-Level": "संतुलित व समकक्ष समझ",
        "Youthful / Energetic": "उत्साही / ऊर्जावान व युवा दृष्टिकोण"
      }
    }
  },
  seventhLordDictionary: {
    en: {
      1: (lord: string) => `7th Lord (${lord}) in 1st House: Spouse is deeply devoted and becomes a core catalyst for native's public rise.`,
      4: (lord: string) => `7th Lord (${lord}) in 4th House: Spouse brings domestic harmony, property comfort, and emotional stability.`,
      7: (lord: string) => `7th Lord (${lord}) in 7th House: Swa-kshetra bliss. High social standing, attractive and compatible partner.`,
      10: (lord: string) => `7th Lord (${lord}) in 10th House: Spouse is ambitious, career-driven, and assists in professional advancement.`,
      default: (lord: string, h: number) => `7th Lord (${lord}) in House ${h}: Partnership dynamics shaped by house ${h} attributes.`
    },
    hi: {
      1: (lord: string) => `सप्तमेश (${lord}) प्रथम भाव में: जीवनसाथी अत्यंत समर्पित और जातक के भाग्योदय व प्रतिष्ठा का मुख्य आधार बनता है।`,
      4: (lord: string) => `सप्तमेश (${lord}) चतुर्थ भाव में: जीवनसाथी के आगमन से पारिवारिक सुख, गृह-वाहन और मानसिक शांति में वृद्धि होती है।`,
      7: (lord: string) => `सप्तमेश (${lord}) सप्तम भाव में: स्वक्षेत्रीय दांपत्य सुख। सुंदर, योग्य और सामाजिक रूप से प्रतिष्ठित जीवनसाथी।`,
      10: (lord: string) => `सप्तमेश (${lord}) दशम भाव में: जीवनसाथी महत्वाकांक्षी, कर्मठ और कार्यक्षेत्र में उन्नति में सहायक सिद्ध होता है।`,
      default: (lord: string, h: number) => `सप्तमेश (${lord}) भाव ${h} में: वैवाहिक साझेदारी भाव ${h} के गुणों से प्रभावित रहती है।`
    }
  },
  relationshipAdvice: {
    en: [
      "Prioritize honest and transparent communication during stressful periods.",
      "Give individual personal space to your partner alongside shared goals.",
      "Make major financial decisions mutually to maintain harmony."
    ],
    hi: [
      "तनावपूर्ण स्थितियों में आपसी संवाद को सदैव स्पष्ट और संवेदनशील बनाए रखें।",
      "साझा लक्ष्यों के साथ-साथ जीवनसाथी को व्यक्तिगत स्वतंत्रता व सम्मान दें।",
      "बड़े आर्थिक निर्णय हमेशा आपसी सहमति से लें ताकि दांपत्य में मधुरता बनी रहे।"
    ]
  }
};

export const remediesI18n = {
  weakHouseImpacts: {
    en: {
      1: "Energy fluctuations, self-doubt, or physical stamina needs consistent focus.",
      2: "Liquid wealth management requires structured discipline.",
      7: "Sensitivity in partnerships, legal agreements, and public collaborations.",
      8: "Positive protection against major sudden accidents or chronic vulnerabilities (low bindus in 8th is classically protective).",
      12: "Controlled expenditure and reduced financial wastage (classical asset).",
      default: (h: number) => `Requires conscious effort and structured planning in house ${h} matters.`
    },
    hi: {
      1: "आत्मविश्वास व शारीरिक ऊर्जा में उतार-चढ़ाव संभव; नियमित दिनचर्या पर ध्यान दें।",
      2: "धन संचय व वाणी पर नियंत्रण हेतु वित्तीय अनुशासन आवश्यक है।",
      7: "साझेदारी, अनुबंध व दांपत्य संबंधों में स्पष्टता व समझदारी आवश्यक है।",
      8: "अकस्मात संकटों व दुर्घटनाओं से सुरक्षा (अष्टम में कम बिंदु शास्त्रीय दृष्टि से सुरक्षात्मक माने जाते हैं)।",
      12: "व्यय पर स्वाभाविक नियंत्रण व अनावश्यक धन की बचत (यह एक सकारात्मक लक्षण है)।",
      default: (h: number) => `भाव ${h} से संबंधित मामलों में योजनाबद्ध प्रयास व सतर्कता अपेक्षित है।`
    }
  },
  dos: {
    en: [
      "Draft written, legally sound agreements for business, freelancing, or property deals.",
      "Maintain transparent boundaries and clear division of responsibilities with partners.",
      "Dedicate a fixed percentage of income toward systematic savings each month.",
      "Engage in morning sunlight exposure and regular grounding exercises."
    ],
    hi: [
      "व्यापार, अनुबंध अथवा संपत्ति के सौदों में हमेशा लिखित व कानूनी रूप से सुरक्षित दस्तावेज तैयार करें।",
      "साझेदारों व सहयोगियों के साथ जिम्मेदारियों का स्पष्ट विभाजन व पारदर्शिता रखें।",
      "प्रत्येक माह अपनी आय का एक निश्चित हिस्सा नियमपूर्वक बचत व संचय में लगाएं।",
      "प्रतिदिन प्रातःकाल सूर्य प्रकाश में कुछ समय बिताएं तथा योग व प्राणायाम का अभ्यास करें।"
    ]
  },
  donts: {
    en: [
      "Never enter into 50-50 informal or verbal business partnerships.",
      "Do not lend significant money to friends or acquaintances based on emotional goodwill.",
      "Avoid hasty speculative financial risks during unfavorable dasha periods.",
      "Refrain from unnecessary arguments on sensitive family matters."
    ],
    hi: [
      "मौखिक या अनौपचारिक रूप से 50-50 की व्यावसायिक साझेदारी में कभी न पड़ें।",
      "भावुकतावश मित्रों या रिश्तेदारों को बिना लिखित प्रमाण के बड़ा उधार न दें।",
      "प्रतिकूल दशा या गोचर के समय बिना सोचे-समझे सट्टा या जोखिम भरे निवेश से बचें।",
      "घरेलू या पारिवारिक मामलों में व्यर्थ के वाद-विवाद व कटु वचनों से बचें।"
    ]
  },
  mantras: {
    en: [
      { deity: "Surya (Sun)", mantra: "Om Hram Hrim Hraum Sah Suryaya Namah", purpose: "Enhances vitality, leadership authority, and social recognition." },
      { deity: "Brihaspati (Jupiter)", mantra: "Om Gram Grim Graum Sah Gurave Namah", purpose: "Expands wisdom, financial judgment, and spiritual clarity." },
      { deity: "Shani (Saturn)", mantra: "Om Pram Prim Praum Sah Shanaischaraya Namah", purpose: "Instills perseverance, karmic balance, and steady long-term success." },
      { deity: "Maha Mrityunjaya", mantra: "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat", purpose: "Supreme protection, health preservation, and inner courage." }
    ],
    hi: [
      { deity: "सूर्य देव", mantra: "ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः", purpose: "आत्मबल, नेतृत्व क्षमता, ओज और सामाजिक मान-प्रतिष्ठा में वृद्धि।" },
      { deity: "बृहस्पति (गुरु)", mantra: "ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः", purpose: "ज्ञान, उत्तम निर्णय क्षमता, धन संपदा और आध्यात्मिक उन्नति।" },
      { deity: "शनि देव", mantra: "ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः", purpose: "धैर्य, कर्म-शुद्धि, अनुशासन और स्थायी सफलता।" },
      { deity: "महामृत्युंजय मंत्र", mantra: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्॥", purpose: "सर्व संकट निवारण, आरोग्य, दीर्घायु और आत्मिक शांति।" }
    ]
  },
  lifestyleHabits: {
    en: [
      "Begin mornings with quiet reflection or meditation before checking digital devices.",
      "Feed birds or street animals on Saturdays as a grounding humanitarian practice.",
      "Keep workspace clean, clutter-free, and well-illuminated.",
      "Express gratitude daily to foster positive mental abundance."
    ],
    hi: [
      "सुबह उठकर मोबाइल/स्क्रीन देखने से पूर्व 5-10 मिनट शांत मन से ध्यान या आत्म-चिंतन करें।",
      "शनिवार या नियमित रूप से पक्षियों को दाना और निराश्रित जीवों को भोजन कराएं।",
      "अपने कार्यस्थल व अध्ययन कक्ष को सदैव स्वच्छ, सुव्यवस्थित और प्रकाशयुक्त रखें।",
      "प्रतिदिन कृतज्ञता भाव (Gratitude) रखें, जिससे मानसिक सकारात्मकता व समृद्धि बढ़ती है।"
    ]
  }
};

export const jaiminiI18n: Record<Language, Record<string, { title: string; signification: string }>> = {
  en: {
    "Atmakaraka": { title: "Atmakaraka (Soul Indicator)", signification: "Represents the innermost soul desire, personal karma, and life mission." },
    "Amatyakaraka": { title: "Amatyakaraka (Career Indicator)", signification: "Primary driver of career, professional intellect, and financial status." },
    "Bhratrikaraka": { title: "Bhratrikaraka (Sibling / Guru Indicator)", signification: "Represents mentors, teachers, courage, and close allies." },
    "Matrikaraka": { title: "Matrikaraka (Mother & Mind Indicator)", signification: "Governs emotional grounding, domestic happiness, and education." },
    "Putrakaraka": { title: "Putrakaraka (Children & Intelligence)", signification: "Signifies progeny, creativity, counsel, and future planning." },
    "Gnatikaraka": { title: "Gnatikaraka (Obstacles & Competition)", signification: "Highlights rivalries, health vulnerabilities, and overcoming adversity." },
    "Darakaraka": { title: "Darakaraka (Spouse & Partnership)", signification: "Reveals spouse nature, partnership chemistry, and interpersonal depth." }
  },
  hi: {
    "Atmakaraka": { title: "आत्मकारक (आत्मा व जीवन उद्देश्य का कारक)", signification: "आत्मा की आंतरिक प्रेरणा, प्रारब्ध कर्म और जीवन के मुख्य उद्देश्य को दर्शाता है।" },
    "Amatyakaraka": { title: "अमात्यकारक (आजीविका व कर्म का कारक)", signification: "करियर, आजीविका, व्यावसायिक बुद्धि और सामाजिक प्रतिष्ठा का प्रमुख सूचक।" },
    "Bhratrikaraka": { title: "भ्रातृकारक (गुरु व भ्राता का कारक)", signification: "मार्गदर्शक, गुरु, पराक्रम, भाई-बंधु और सहायक मित्रों का प्रतिनिधित्व करता है।" },
    "Matrikaraka": { title: "मातृकारक (माता, सुख व मन का कारक)", signification: "मानसिक स्थिरता, घरेलू सुख, माता और बुनियादी शिक्षा का कारक।" },
    "Putrakaraka": { title: "पुत्रकारक (संतान, बुद्धि व विद्या का कारक)", signification: "संतान सुख, रचनात्मक प्रतिभा, गहन अध्ययन और भविष्य की योजनाओं का सूचक।" },
    "Gnatikaraka": { title: "ज्ञाति कारक (बाधा, संघर्ष व शत्रु का कारक)", signification: "जीवन की चुनौतियां, प्रतिस्पर्धा, स्वास्थ्य सतर्कता और उन पर विजय का संकेत।" },
    "Darakaraka": { title: "दाराकारक (जीवनसाथी व साझेदारी का कारक)", signification: "जीवनसाथी का स्वभाव, दांपत्य आकर्षण और साझेदारी की प्रगाढ़ता को दर्शाता है।" }
  }
};
