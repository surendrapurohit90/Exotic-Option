// ---------- Custom erf ----------
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1 / (1 + p * x);
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-x * x));

  return sign * y;
}

// ---------- Helpers ----------
function normCDF(x) {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function normPDF(x) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

// ---------- Black-Scholes ----------
export function blackScholes({ S, K, r, v, T, type }) {
  const d1 = (Math.log(S / K) + (r + 0.5 * v * v) * T) / (v * Math.sqrt(T));
  const d2 = d1 - v * Math.sqrt(T);

  const price =
    type === "call"
      ? S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2)
      : K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

  const delta = type === "call" ? normCDF(d1) : normCDF(d1) - 1;
  const gamma = normPDF(d1) / (S * v * Math.sqrt(T));
  const vega = S * normPDF(d1) * Math.sqrt(T) / 100;
  const theta = (-S * normPDF(d1) * v) / (2 * Math.sqrt(T)) / 365;
  const rho =
    type === "call"
      ? K * T * Math.exp(-r * T) * normCDF(d2) / 100
      : -K * T * Math.exp(-r * T) * normCDF(-d2) / 100;

  return { price, delta, gamma, vega, theta, rho };
}

// ---------- Monte Carlo ----------
export function monteCarlo({ S, K, r, v, T, type, paths = 50000, steps = 252 }) {
  const dt = T / steps;
  const drift = (r - 0.5 * v * v) * dt;
  const volSqrtDt = v * Math.sqrt(dt);

  let payoffSum = 0;
  let deltaSum = 0;

  for (let i = 0; i < paths; i++) {
    let St = S;

    for (let j = 0; j < steps; j++) {
      const u1 = Math.random();
      const u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      St = St * Math.exp(drift + volSqrtDt * z);
    }

    const payoff = type === "call" ? Math.max(St - K, 0) : Math.max(K - St, 0);
    payoffSum += payoff;

    const dS = 0.01 * S;
    const StUp = St * (1 + 0.01);
    const payoffUp =
      type === "call" ? Math.max(StUp - K, 0) : Math.max(K - StUp, 0);
    deltaSum += (payoffUp - payoff) / dS;
  }

  const price = (Math.exp(-r * T) * payoffSum) / paths;
  const delta = deltaSum / paths;

  return { price, delta, gamma: 0, vega: 0, theta: 0, rho: 0 };
}
