"use strict";

const SPIN_COST = 100;
const PAYOUTS = [200, 500, 750, 1000, 1500, 2000, 5000, 10000];
const TARGET_RTP = {1:0.90, 2:0.97, 3:0.985, 4:1.013, 5:1.03, 6:1.05};
const PROGRESS_FACTORS = [
  [1.00,0.60], [1.00,0.65], [1.00,0.75], [1.00,0.90],
  [1.00,0.98], [1.00,1.08], [1.00,1.55], [1.00,1.90]
];
const PROFILES = {
  1:{cap:10000, weights:[.18,.17,.14,.17,.14,.13,.055,.015], bias:1.007},
  2:{cap:15000, weights:[.26,.22,.15,.16,.10,.07,.03,.01], bias:1.028, positiveFade:.12},
  3:{cap:15000, weights:[.16,.18,.15,.22,.14,.10,.04,.01], bias:1.007, anchor:-1500, feedback:.30, span:12000},
  4:{cap:20000, weights:[.15,.16,.14,.20,.15,.13,.055,.015], bias:.9977, anchor:2500, feedback:.08, span:16000},
  5:{cap:30000, weights:[.07,.08,.07,.18,.18,.20,.16,.06], bias:1.0098},
  6:{cap:100000,weights:[.28,.23,.16,.16,.09,.055,.02,.005], bias:1.000}
};

function clamp(value, min, max){ return Math.max(min, Math.min(max, value)); }
function rngFactory(seed){
  let state = seed >>> 0;
  return ()=>{
    state += 0x6D2B79F5;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function controlTargetRtp(setting, profit){
  const profile = PROFILES[setting];
  let factor = profile.bias || 1;
  if(profile.positiveFade){
    factor *= 1 - profile.positiveFade * clamp(profit / profile.cap, 0, 1);
  }
  if(profile.feedback){
    factor *= 1 + profile.feedback * clamp((profile.anchor - profit) / profile.span, -1, 1);
  }
  return TARGET_RTP[setting] * factor;
}

function payoutWeights(setting, spinsSinceHit, profit, values){
  const profile = PROFILES[setting];
  const progress = clamp(spinsSinceHit / 400, 0, 1);
  const positiveRatio = clamp(profit / profile.cap, 0, 1);
  const headroom = profile.cap - profit;
  let total = 0;
  let weightedPayout = 0;
  for(let index=0; index<profile.weights.length; index++){
    const weight = profile.weights[index];
    const [start,end] = PROGRESS_FACTORS[index];
    let adjusted = weight * (start + (end - start) * progress);
    if(setting === 2){
      const drift = [0.85,0.65,0.40,-0.10,-0.30,-0.48,-0.72,-0.86][index];
      adjusted *= Math.max(0.02, 1 + drift * positiveRatio);
    }
    if(PAYOUTS[index] > headroom) adjusted = 0;
    adjusted = Math.max(0, adjusted);
    values[index] = adjusted;
    total += adjusted;
    weightedPayout += adjusted * PAYOUTS[index];
  }
  return {total, average:total > 0 ? weightedPayout / total : 0};
}

function choosePayout(weights, total, rng){
  let roll = rng() * total;
  for(let index=0; index<weights.length; index++){
    roll -= weights[index];
    if(roll <= 0) return PAYOUTS[index];
  }
  return 0;
}

function quantile(sorted, q){
  const index = Math.min(sorted.length - 1, Math.max(0, Math.round((sorted.length - 1) * q)));
  return sorted[index];
}

function simulateSetting(setting, trials, spins, rng){
  const profile = PROFILES[setting];
  const finals = new Int32Array(trials);
  let paid = 0;
  let hits = 0;
  let highHits = 0;
  let stage1Ups = 0;
  let capViolations = 0;
  let highestPeak = -Infinity;
  let deepestTrough = Infinity;
  for(let trial=0; trial<trials; trial++){
    let profit = 0;
    let spinsSinceHit = 0;
    let peak = 0;
    let trough = 0;
    const weights = new Float64Array(PAYOUTS.length);
    for(let spin=0; spin<spins; spin++){
      profit -= SPIN_COST;
      const distribution = payoutWeights(setting, spinsSinceHit, profit, weights);
      const probability = distribution.average > 0 ? clamp(controlTargetRtp(setting, profit) * SPIN_COST / distribution.average, 0, .98) : 0;
      if(rng() < probability){
        const payout = choosePayout(weights, distribution.total, rng);
        profit += payout;
        paid += payout;
        hits++;
        if(payout >= 1000) stage1Ups++;
        if(payout >= 5000) highHits++;
        spinsSinceHit = 0;
      }else{
        spinsSinceHit++;
      }
      if(profit > profile.cap) capViolations++;
      if(profit > peak) peak = profit;
      if(profit < trough) trough = profit;
    }
    finals[trial] = profit;
    if(peak > highestPeak) highestPeak = peak;
    if(trough < deepestTrough) deepestTrough = trough;
  }
  const sorted = Array.from(finals).sort((a,b)=>a-b);
  const totalSpins = trials * spins;
  return {
    setting,
    targetRtp:TARGET_RTP[setting] * 100,
    actualRtp:paid / (totalSpins * SPIN_COST) * 100,
    winRate:sorted.filter(value=>value > 0).length / trials * 100,
    median:quantile(sorted,.5),
    p05:quantile(sorted,.05),
    p95:quantile(sorted,.95),
    maxFinal:sorted[sorted.length - 1],
    minFinal:sorted[0],
    highestPeak,
    deepestTrough,
    hitDenom:hits ? totalSpins / hits : Infinity,
    stage1UpRate:hits ? stage1Ups / hits * 100 : 0,
    highRate:hits ? highHits / hits * 100 : 0,
    cap:profile.cap,
    capViolations
  };
}

const trials = Math.max(1, Number(process.argv[2]) || 100000);
const spins = Math.max(1, Number(process.argv[3]) || 1000);
const seed = Number(process.argv[4]) || 20260904;
const rng = rngFactory(seed);
const results = [];
for(let setting=1; setting<=6; setting++) results.push(simulateSetting(setting, trials, spins, rng));
console.log(JSON.stringify({trials,spins,seed,results}, null, 2));
