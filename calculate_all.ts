import {
  Observer,
  getKundli,
  getComprehensiveReport,
  getChalitAnalysis,
  getKpAnalysis,
  getLalKitabAnalysis,
  getJaiminiKarakas,
  getCareerPrediction,
  getWealthPrediction,
  getMarriagePrediction,
  getRemedies,
  getSpecialLagnas,
  getArudhaPadas,
  getChandraKundli,
  getSuryaKundli,
  getGrahaDrishti,
  getAshtakavarga,
  checkSadeSati,
  checkDhaiya,
  checkMangalDosha
} from './src/index';

const observer = new Observer(25.872, 82.685, 0);
const date = new Date('2004-02-20T07:15:00+05:30');

const kundli = getKundli(date, observer, {
  houseSystem: 'whole_sign',
  includeSpecialLagnas: true,
  includeArudhas: true,
  includeReferenceCharts: true,
  includeChalit: true,
  includeKp: true
});

const report = getComprehensiveReport(kundli);
const chalit = getChalitAnalysis(kundli);
const kp = getKpAnalysis(kundli);
const lalKitab = getLalKitabAnalysis(kundli);
const jaimini = getJaiminiKarakas(kundli);
const career = getCareerPrediction(kundli);
const wealth = getWealthPrediction(kundli);
const marriage = getMarriagePrediction(kundli);
const remedies = getRemedies(kundli);

const transit = getKundli(new Date(), observer, { houseSystem: 'whole_sign' });
const sadesati = checkSadeSati(kundli.planets['Moon'].longitude, transit.planets['Saturn'].longitude);
const dhaiya = checkDhaiya(kundli.planets['Moon'].longitude, transit.planets['Saturn'].longitude);
const mangalDosha = checkMangalDosha(kundli);

console.log(JSON.stringify({
  lagna: kundli.ascendant,
  planets: kundli.planets,
  houses: kundli.houses,
  dasha: kundli.dasha,
  vargas: kundli.vargas,
  specialLagnas: kundli.specialLagnas,
  arudhas: kundli.arudhaPadas,
  chandraKundli: kundli.chandraKundli?.ascendant,
  suryaKundli: kundli.suryaKundli?.ascendant,
  chalitShifts: chalit.shiftedPlanets,
  chalitHouses: chalit.houses,
  kpSummary: kp,
  lalKitab: {
    tevaType: lalKitab.tevaType,
    kismatKaGrah: lalKitab.kismatKaGrah,
    sleepingHouses: lalKitab.sleepingHouses,
    totke: lalKitab.totke,
    analysis: lalKitab.analysis
  },
  jaimini,
  career,
  wealth,
  marriage,
  remedies,
  ashtakavargaSAV: kundli.ashtakavarga?.sav,
  drishti: kundli.drishti,
  sadesati,
  dhaiya,
  mangalDosha,
  reportText: report.formattedMarkdown
}, null, 2));
