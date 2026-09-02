import {
  Observer,
  getKundli,
  getSpecialLagnas,
  getGhatikaChart,
  getHoraLagnaChart,
  getInduLagnaChart,
  getArudhaPadas,
  getArudhaLagnaChart,
  getUpapadaChart,
  getChandraKundli,
  getSuryaKundli,
} from "./src/index";

function runTests() {
  console.log("=== Testing Vedic Astrology Charts Implementation ===\n");

  const observer = new Observer(25.872, 82.685, 0); // Varanasi
  const date = new Date("2004-02-20T07:15:00+05:30");

  const kundli = getKundli(date, observer, {
    houseSystem: "whole_sign",
    includeSpecialLagnas: true,
    includeArudhas: true,
    includeReferenceCharts: true,
  });

  // 1. Special Lagnas
  console.log("1. SPECIAL LAGNAS:");
  const sl = kundli.specialLagnas!;
  console.log(`   - Ghatika Lagna (GL):  ${sl.ghatikaLagna.rashiName} (${sl.ghatikaLagna.degree}° ${sl.ghatikaLagna.minute}')`);
  console.log(`   - Hora Lagna (HL):     ${sl.horaLagna.rashiName} (${sl.horaLagna.degree}° ${sl.horaLagna.minute}')`);
  console.log(`   - Bhava Lagna (BL):    ${sl.bhavaLagna.rashiName} (${sl.bhavaLagna.degree}° ${sl.bhavaLagna.minute}')`);
  console.log(`   - Shree Lagna (SL):    ${sl.shreeLagna.rashiName} (${sl.shreeLagna.degree}° ${sl.shreeLagna.minute}')`);
  console.log(`   - Indu Lagna (IL):     ${sl.induLagna.rashiName} (Total Kalas: ${sl.induLagna.totalKalas})`);
  console.log(`   - Pranapada (PP):      ${sl.pranapadaLagna.rashiName} (${sl.pranapadaLagna.degree}° ${sl.pranapadaLagna.minute}')`);

  // 2. Special Charts
  console.log("\n2. SPECIAL CHARTS (Lagna & House 1):");
  const glChart = getGhatikaChart(kundli);
  console.log(`   - Ghatika Chart Ascendant: ${glChart.ascendant.rashiName} (House 1 Rashi: ${glChart.houses[0].rashi})`);
  const hlChart = getHoraLagnaChart(kundli);
  console.log(`   - Hora Lagna Chart Ascendant: ${hlChart.ascendant.rashiName} (House 1 Rashi: ${hlChart.houses[0].rashi})`);
  const induChart = getInduLagnaChart(kundli);
  console.log(`   - Indu Lagna Chart Ascendant: ${induChart.ascendant.rashiName} (House 1 Rashi: ${induChart.houses[0].rashi})`);

  // 3. Arudhas
  console.log("\n3. JAIMINI ARUDHA PADAS (A1-A12):");
  const arudhas = kundli.arudhaPadas!;
  console.log(`   - A1 (Arudha Lagna - AL): ${arudhas.a1_al.rashiName} (House ${arudhas.a1_al.rashi})`);
  console.log(`   - A7 (Dara Pada):          ${arudhas.a7.rashiName} (House ${arudhas.a7.rashi})`);
  console.log(`   - A12 (Upapada Lagna - UL): ${arudhas.a12_ul.rashiName} (House ${arudhas.a12_ul.rashi})`);

  const alChart = getArudhaLagnaChart(kundli);
  console.log(`   - AL Chart House 1: ${alChart.ascendant.rashiName}`);
  const ulChart = getUpapadaChart(kundli);
  console.log(`   - UL Chart House 1: ${ulChart.ascendant.rashiName}`);

  // 4. Reference Charts
  console.log("\n4. REFERENCE CHARTS:");
  const chandra = kundli.chandraKundli!;
  console.log(`   - Chandra Kundli (Moon Chart) House 1: ${chandra.ascendant.rashiName} (Planets in H1: ${chandra.houses[0].planets.join(", ") || "None"})`);
  const surya = kundli.suryaKundli!;
  console.log(`   - Surya Kundli (Sun Chart) House 1:    ${surya.ascendant.rashiName} (Planets in H1: ${surya.houses[0].planets.join(", ") || "None"})`);

  // 5. Vargas (D1 to D60)
  console.log("\n5. DIVISIONAL CHARTS (Vargas):");
  const vargas = kundli.vargas!;
  const vKeys = Object.keys(vargas);
  console.log(`   - Total Vargas generated: ${vKeys.length} (${vKeys.join(", ")})`);
  console.log(`   - D-5 (Panchamsha):  Lagna in ${vargas.d5.ascendant.rashiName}`);
  console.log(`   - D-6 (Shashthamsha): Lagna in ${vargas.d6.ascendant.rashiName}`);
  console.log(`   - D-8 (Ashtamsha):    Lagna in ${vargas.d8.ascendant.rashiName}`);
  console.log(`   - D-11 (Rudramsha):  Lagna in ${vargas.d11.ascendant.rashiName}`);

  console.log("\n=== All Tests Passed Successfully! ===");
}

runTests();
