const fs = require('fs');
const path = require('path');

const brokenDetails = JSON.parse(fs.readFileSync(path.join(__dirname, 'broken-details.json'), 'utf8'));

console.log(`Total BROKEN tools to fix: ${brokenDetails.length}`);

// Map of slugs to custom calculation generator functions
const fixes = {
  'acoustic-noise-attenuation-distance-calculator': (inputs) => {
    // Inputs: l1-db (dB), r1-m (m), r2-m (m)
    // Formula: L2 = L1 - 20 * log10(r2 / r1)
    return `
  const l1 = parseFloat(document.getElementById('l1-db')?.value) || 90;
  const r1 = parseFloat(document.getElementById('r1-m')?.value) || 1;
  const r2 = parseFloat(document.getElementById('r2-m')?.value) || 10;
  const l2 = l1 - 20 * Math.log10(r2 / r1);
  const diff = l1 - l2;
  let report = "=== ACOUSTIC NOISE ATTENUATION REPORT ===\\n";
  report += \`Initial Sound Level (L1): \${l1} dB at \${r1} m\\n\`;
  report += \`Target Distance (r2):     \${r2} m\\n\`;
  report += \`Attenuated Level (L2):   \${l2.toFixed(2)} dB\\n\`;
  report += \`Noise Reduction (ΔL):     \${diff.toFixed(2)} dB\\n\\n\`;
  report += "Status: ✅ Computed via Inverse Square Law (Free-field Point Source).";
  if (out) out.value = report;
`;
  },

  'air-psychrometric-properties-calculator': (inputs) => {
    // Inputs: tdb-c (°C), rh-pct (%), patm-kpa (kPa)
    return `
  const tdb = parseFloat(document.getElementById('tdb-c')?.value) || 25;
  const rh = parseFloat(document.getElementById('rh-pct')?.value) || 50;
  const pAtm = parseFloat(document.getElementById('patm-kpa')?.value) || 101.325;
  const pSat = 0.61078 * Math.exp((17.27 * tdb) / (tdb + 237.3)); // kPa
  const pv = (rh / 100) * pSat;
  const w = 0.62198 * (pv / (pAtm - pv)); // kg w.v. / kg dry air
  const h = 1.006 * tdb + w * (2501 + 1.86 * tdb); // kJ/kg
  const alpha = ((17.27 * tdb) / (237.3 + tdb)) + Math.log(rh / 100);
  const tdp = (237.3 * alpha) / (17.27 - alpha);
  let report = "=== AIR PSYCHROMETRIC PROPERTIES REPORT ===\\n";
  report += \`Dry Bulb Temp (Tdb):    \${tdb} °C\\n\`;
  report += \`Relative Humidity (RH): \${rh} %\\n\`;
  report += \`Barometric Press (Patm): \${pAtm} kPa\\n\`;
  report += \`Vapor Pressure (Pv):     \${pv.toFixed(3)} kPa\\n\`;
  report += \`Humidity Ratio (w):      \${(w * 1000).toFixed(2)} g/kg dry air\\n\`;
  report += \`Enthalpy (h):            \${h.toFixed(2)} kJ/kg\\n\`;
  report += \`Dew Point Temp (Tdp):    \${tdp.toFixed(2)} °C\\n\\n\`;
  report += "Status: ✅ Computed via standard psychrometric equations.";
  if (out) out.value = report;
`;
  },

  'battery-capacity-life-calculator': (inputs) => {
    // Inputs: cap-ah (Ah), load-a (A), chem-preset
    return `
  const cap = parseFloat(document.getElementById('cap-ah')?.value) || 10;
  const load = parseFloat(document.getElementById('load-a')?.value) || 2;
  const chem = document.getElementById('chem-preset')?.value || 'li-ion';
  let peukert = 1.1;
  if (chem === 'lead-acid') peukert = 1.25;
  if (chem === 'lifepo4') peukert = 1.05;
  if (chem === 'nimh') peukert = 1.15;
  const runtimeHours = Math.pow(cap / load, peukert) * 0.85; // 85% DoD
  const hours = Math.floor(runtimeHours);
  const mins = Math.round((runtimeHours - hours) * 60);
  let report = "=== BATTERY CAPACITY & LIFE REPORT ===\\n";
  report += \`Battery Capacity: \${cap} Ah\\n\`;
  report += \`Discharge Load:   \${load} A\\n\`;
  report += \`Chemistry:        \${chem.toUpperCase()} (Peukert k=\${peukert})\\n\`;
  report += \`Est. Runtime:     \${hours}h \${mins}m (\${runtimeHours.toFixed(2)} hours at 85% DoD)\\n\\n\`;
  report += "Status: ✅ Calculated locally with Peukert effect & DoD safety margin.";
  if (out) out.value = report;
`;
  },

  'beam-load-calculator': (inputs) => {
    // Inputs: load-type, l-meters, load-val, e-gpa, i-cm4
    return `
  const loadType = document.getElementById('load-type')?.value || 'point-center';
  const L = parseFloat(document.getElementById('l-meters')?.value) || 5;
  const P = parseFloat(document.getElementById('load-val')?.value) || 10; // kN or kN/m
  const E = parseFloat(document.getElementById('e-gpa')?.value) || 200; // GPa
  const I = parseFloat(document.getElementById('i-cm4')?.value) || 5000; // cm4
  let maxM = 0; // kN*m
  let maxDef = 0; // mm
  const EI = E * 1e9 * (I * 1e-8); // N*m2
  if (loadType === 'point-center') {
    maxM = (P * L) / 4;
    maxDef = ((P * 1000) * Math.pow(L, 3)) / (48 * EI) * 1000;
  } else {
    maxM = (P * L * L) / 8;
    maxDef = (5 * (P * 1000) * Math.pow(L, 4)) / (384 * EI) * 1000;
  }
  let report = "=== SIMPLY SUPPORTED BEAM ANALYSIS REPORT ===\\n";
  report += \`Beam Length (L):       \${L} m\\n\`;
  report += \`Applied Load:          \${P} \${loadType === 'point-center' ? 'kN (Point)' : 'kN/m (UDL)'}\\n\`;
  report += \`Flexural Rigidity EI:  \${(EI / 1e3).toFixed(2)} kN·m²\\n\`;
  report += \`Max Bending Moment:    \${maxM.toFixed(2)} kN·m\\n\`;
  report += \`Max Deflection (δmax): \${maxDef.toFixed(3)} mm\\n\\n\`;
  report += "Status: ✅ Calculated via Euler-Bernoulli Beam Theory.";
  if (out) out.value = report;
`;
  },

  'bernoulli-equation-calculator': (inputs) => {
    // Inputs: rho-val, p1-kpa, v1-ms, h1-m, v2-ms, h2-m
    return `
  const rho = parseFloat(document.getElementById('rho-val')?.value) || 1000;
  const p1 = parseFloat(document.getElementById('p1-kpa')?.value) || 200;
  const v1 = parseFloat(document.getElementById('v1-ms')?.value) || 2;
  const h1 = parseFloat(document.getElementById('h1-m')?.value) || 0;
  const v2 = parseFloat(document.getElementById('v2-ms')?.value) || 5;
  const h2 = parseFloat(document.getElementById('h2-m')?.value) || 1;
  const g = 9.81;
  // P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
  const p1Pa = p1 * 1000;
  const p2Pa = p1Pa + 0.5 * rho * (v1 * v1 - v2 * v2) + rho * g * (h1 - h2);
  const p2Kpa = p2Pa / 1000;
  const head1 = (p1Pa / (rho * g)) + (v1 * v1 / (2 * g)) + h1;
  let report = "=== BERNOULLI FLUID ENERGY CONSERVATION REPORT ===\\n";
  report += \`Fluid Density (ρ):     \${rho} kg/m³\\n\`;
  report += \`Station 1: P1=\${p1} kPa, v1=\${v1} m/s, h1=\${h1} m\\n\`;
  report += \`Station 2: v2=\${v2} m/s, h2=\${h2} m\\n\`;
  report += \`Station 2 Pressure P2: \${p2Kpa.toFixed(2)} kPa (\${(p2Kpa / 100).toFixed(2)} bar)\\n\`;
  report += \`Total Energy Head (H):\${head1.toFixed(2)} meters\\n\\n\`;
  report += "Status: ✅ Calculated via Bernoulli Conservation of Energy Equation.";
  if (out) out.value = report;
`;
  },

  'bjt-transistor-bias-calculator': (inputs) => {
    // Inputs: vcc-volt, r1-kohm, r2-kohm, rc-kohm, re-kohm, beta-val
    return `
  const vcc = parseFloat(document.getElementById('vcc-volt')?.value) || 12;
  const r1 = parseFloat(document.getElementById('r1-kohm')?.value) || 10;
  const r2 = parseFloat(document.getElementById('r2-kohm')?.value) || 2.2;
  const rc = parseFloat(document.getElementById('rc-kohm')?.value) || 1;
  const re = parseFloat(document.getElementById('re-kohm')?.value) || 0.47;
  const beta = parseFloat(document.getElementById('beta-val')?.value) || 100;
  const vth = vcc * (r2 / (r1 + r2));
  const rth = (r1 * r2) / (r1 + r2);
  const ib = (vth - 0.7) / (rth + (beta + 1) * re); // mA
  const ic = beta * ib; // mA
  const ie = (beta + 1) * ib; // mA
  const vce = vcc - ic * rc - ie * re; // V
  let report = "=== BJT VOLTAGE-DIVIDER BIAS REPORT ===\\n";
  report += \`Vcc: \${vcc}V, R1: \${r1}kΩ, R2: \${r2}kΩ, Rc: \${rc}kΩ, Re: \${re}kΩ, β: \${beta}\\n\`;
  report += \`Thevenin Base Volt (Vth): \${vth.toFixed(2)} V\\n\`;
  report += \`Base Current (Ib):         \${(ib * 1000).toFixed(2)} µA\\n\`;
  report += \`Collector Current (Ic):    \${ic.toFixed(2)} mA\\n\`;
  report += \`Collector-Emitter Vce:     \${vce.toFixed(2)} V\\n\`;
  report += \`Q-Point State:             \${vce > 0.3 ? '✅ Active Region (Amplification)' : '⚠️ Saturation Region'}\\n\\n\`;
  report += "Status: ✅ Calculated via Exact BJT Transistor Circuit Analysis.";
  if (out) out.value = report;
`;
  },

  'heat-exchanger-lmtd-calculator': (inputs) => {
    // Inputs: thi-c, tho-c, tci-c, tco-c, flow-type
    return `
  const thi = parseFloat(document.getElementById('thi-c')?.value) || 90;
  const tho = parseFloat(document.getElementById('tho-c')?.value) || 40;
  const tci = parseFloat(document.getElementById('tci-c')?.value) || 20;
  const tco = parseFloat(document.getElementById('tco-c')?.value) || 50;
  const flow = document.getElementById('flow-type')?.value || 'counter';
  let dt1 = 0, dt2 = 0;
  if (flow === 'counter') {
    dt1 = thi - tco;
    dt2 = tho - tci;
  } else {
    dt1 = thi - tci;
    dt2 = tho - tco;
  }
  const lmtd = (dt1 === dt2) ? dt1 : (dt1 - dt2) / Math.log(dt1 / dt2);
  let report = "=== HEAT EXCHANGER LMTD REPORT ===\\n";
  report += \`Flow Configuration: \${flow.toUpperCase()}FLOW\\n\`;
  report += \`Hot Fluid:  In \${thi}°C → Out \${tho}°C\\n\`;
  report += \`Cold Fluid: In \${tci}°C → Out \${tco}°C\\n\`;
  report += \`Temperature Diff ΔT1: \${dt1.toFixed(2)} °C\\n\`;
  report += \`Temperature Diff ΔT2: \${dt2.toFixed(2)} °C\\n\`;
  report += \`Log Mean Temp Diff (LMTD): \${lmtd.toFixed(2)} °C\\n\\n\`;
  report += "Status: ✅ Computed via standard LMTD heat transfer formulation.";
  if (out) out.value = report;
`;
  },

  'ideal-gas-law-calculator': (inputs) => {
    // Inputs: solve-for, p-atm, v-liters, n-moles, t-kelvin
    return `
  const solveFor = document.getElementById('solve-for')?.value || 'p';
  let p = parseFloat(document.getElementById('p-atm')?.value) || 1.0;
  let v = parseFloat(document.getElementById('v-liters')?.value) || 22.414;
  let n = parseFloat(document.getElementById('n-moles')?.value) || 1.0;
  let t = parseFloat(document.getElementById('t-kelvin')?.value) || 273.15;
  const R = 0.082057; // L*atm/(mol*K)
  if (solveFor === 'p') p = (n * R * t) / v;
  else if (solveFor === 'v') v = (n * R * t) / p;
  else if (solveFor === 'n') n = (p * v) / (R * t);
  else if (solveFor === 't') t = (p * v) / (n * R);
  let report = "=== IDEAL GAS LAW PV=nRT REPORT ===\\n";
  report += \`Pressure (P):    \${p.toFixed(3)} atm\\n\`;
  report += \`Volume (V):      \${v.toFixed(3)} Liters\\n\`;
  report += \`Amount (n):      \${n.toFixed(3)} Moles\\n\`;
  report += \`Temperature (T): \${t.toFixed(2)} K (\${(t - 273.15).toFixed(2)} °C)\\n\`;
  report += \`Gas Constant R:  0.082057 L·atm/(mol·K)\\n\\n\`;
  report += "Status: ✅ Calculated via Ideal Gas Equation of State.";
  if (out) out.value = report;
`;
  }
};

console.log("Fix generator template ready.");
