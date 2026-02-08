import { useState } from "react";
import "./App.css";
import { blackScholes, monteCarlo } from "./utils/blackScholes";

/* ---------- App ---------- */
export default function App() {
  const [deal, setDeal] = useState({
    direction: "buy",
    payoffType: "call",
    exerciseStyle: "EUROPEAN",
    pricingModel: "BSM",
    mcPaths: 50000,
    mcSteps: 252,
    notional: 1000000,
    spot: 100,
    strike: 100,
    vol: 0.2,
    rate: 0.05,
    maturity: 0.5,
    barrierType: "NONE",
    barrierLower: "",
    barrierUpper: "",
    generateMC: 0 // trigger for MC recalculation
  });

  const sign = deal.direction === "buy" ? 1 : -1;

  // ---------- Pricing ----------
  const raw =
    deal.pricingModel === "BSM"
      ? blackScholes({
          S: deal.spot,
          K: deal.strike,
          r: deal.rate,
          v: deal.vol,
          T: deal.maturity,
          type: deal.payoffType
        })
      : monteCarlo({
          S: deal.spot,
          K: deal.strike,
          r: deal.rate,
          v: deal.vol,
          T: deal.maturity,
          type: deal.payoffType,
          paths: deal.mcPaths,
          steps: deal.mcSteps
        });

  const result = {
    price: sign * raw.price,
    delta: sign * raw.delta,
    gamma: raw.gamma,
    vega: raw.vega,
    theta: sign * raw.theta,
    rho: sign * raw.rho
  };

  // ---------- Scenario Analysis ----------
  const scenarios = [-0.1, -0.05, 0, 0.05, 0.1].map(pct => {
    const s = deal.spot * (1 + pct);
    const res =
      deal.pricingModel === "BSM"
        ? blackScholes({
            S: s,
            K: deal.strike,
            r: deal.rate,
            v: deal.vol,
            T: deal.maturity,
            type: deal.payoffType
          })
        : monteCarlo({
            S: s,
            K: deal.strike,
            r: deal.rate,
            v: deal.vol,
            T: deal.maturity,
            type: deal.payoffType,
            paths: deal.mcPaths,
            steps: deal.mcSteps
          });
    return {
      spot: s,
      price: (sign * res.price * deal.notional) / deal.spot
    };
  });

  return (
    <div className="container">
      <h1>Exotic Deal Capture</h1>

      {/* ---------- Deal Capture ---------- */}
      <div className="card">
        <h2>Deal Capture</h2>

        {/* ---------- Deal Type ---------- */}
        <div className="field" style={{ marginBottom: "16px", maxWidth: "300px" }}>
          <label>Deal Type</label>
          <select
            value={deal.barrierType}
            onChange={e =>
              setDeal({
                ...deal,
                barrierType: e.target.value,
                barrierLower: "",
                barrierUpper: ""
              })
            }
          >
            <option value="NONE">Vanilla Option</option>
            <option value="UP_OUT">Barrier – Up & Out</option>
            <option value="DOWN_OUT">Barrier – Down & Out</option>
            <option value="UP_IN">Barrier – Up & In</option>
            <option value="DOWN_IN">Barrier – Down & In</option>
            <option value="DOUBLE_KO">Barrier – Double Knock-Out</option>
            <option value="DOUBLE_KI">Barrier – Double Knock-In</option>
          </select>
        </div>

        {deal.barrierType !== "NONE" && (
          <div className="form-grid" style={{ marginBottom: "16px" }}>
            {(deal.barrierType.includes("DOWN") || deal.barrierType.includes("DOUBLE")) && (
              <div className="field">
                <label>Lower Barrier</label>
                <input
                  type="number"
                  value={deal.barrierLower}
                  onChange={e => setDeal({ ...deal, barrierLower: +e.target.value })}
                />
              </div>
            )}

            {(deal.barrierType.includes("UP") || deal.barrierType.includes("DOUBLE")) && (
              <div className="field">
                <label>Upper Barrier</label>
                <input
                  type="number"
                  value={deal.barrierUpper}
                  onChange={e => setDeal({ ...deal, barrierUpper: +e.target.value })}
                />
              </div>
            )}
          </div>
        )}

        <div className="form-grid">
          <div className="field">
            <label>Direction</label>
            <select
              value={deal.direction}
              onChange={e => setDeal({ ...deal, direction: e.target.value })}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="field">
            <label>Option Payoff</label>
            <select
              value={deal.payoffType}
              onChange={e => setDeal({ ...deal, payoffType: e.target.value })}
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>
          </div>

          <div className="field">
            <label>Exercise Style</label>
            <select
              value={deal.exerciseStyle}
              onChange={e => setDeal({ ...deal, exerciseStyle: e.target.value })}
            >
              <option value="EUROPEAN">European</option>
              <option value="AMERICAN">American</option>
            </select>
          </div>

          <div className="field">
            <label>Amount (Notional)</label>
            <input
              type="number"
              value={deal.notional}
              onChange={e => setDeal({ ...deal, notional: +e.target.value })}
            />
          </div>

          <div className="field">
            <label>Spot Price</label>
            <input
              type="number"
              value={deal.spot}
              onChange={e => setDeal({ ...deal, spot: +e.target.value })}
            />
          </div>

          <div className="field">
            <label>Strike</label>
            <input
              type="number"
              value={deal.strike}
              onChange={e => setDeal({ ...deal, strike: +e.target.value })}
            />
          </div>

          <div className="field">
            <label>Volatility</label>
            <input
              type="number"
              step="0.01"
              value={deal.vol}
              onChange={e => setDeal({ ...deal, vol: +e.target.value })}
            />
          </div>

          <div className="field">
            <label>Maturity (Years)</label>
            <input
              type="number"
              step="0.01"
              value={deal.maturity}
              onChange={e => setDeal({ ...deal, maturity: +e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* ---------- Pricing ---------- */}
      <div className="card">
        <h2>Pricing & Greeks</h2>
        <table>
          <tbody>
            <tr>
              <td>Price (per unit)</td>
              <td>{result.price.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Delta</td>
              <td>{result.delta.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Gamma</td>
              <td>{result.gamma.toFixed(6)}</td>
            </tr>
            <tr>
              <td>Vega</td>
              <td>{result.vega.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Theta (per year)</td>
              <td>{result.theta.toFixed(4)}</td>
            </tr>
            <tr>
              <td>Rho</td>
              <td>{result.rho.toFixed(4)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------- Pricing Model ---------- */}
      <div className="card">
        <h2>Pricing Model</h2>
        <div className="field">
          <select
            value={deal.pricingModel}
            onChange={e => setDeal({ ...deal, pricingModel: e.target.value })}
          >
            <option value="BSM">Black–Scholes (Closed-form)</option>
            <option value="MC">Monte Carlo</option>
          </select>
        </div>

        {deal.pricingModel === "MC" && (
          <div className="form-grid">
            <div className="field">
              <label>Monte Carlo Paths</label>
              <input
                type="number"
                value={deal.mcPaths}
                onChange={e => setDeal({ ...deal, mcPaths: +e.target.value })}
              />
            </div>

            <div className="field">
              <label>Time Steps per Path</label>
              <input
                type="number"
                value={deal.mcSteps}
                onChange={e => setDeal({ ...deal, mcSteps: +e.target.value })}
              />
            </div>

            <div className="field" style={{ marginTop: "16px" }}>
              <button
                onClick={() =>
                  setDeal({ ...deal, generateMC: Math.random() })
                }
              >
                Generate Pricing
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------- Scenario Analysis ---------- */}
      <div className="card">
        <h2>Scenario Analysis (Spot Shocks)</h2>
        <table>
          <thead>
            <tr>
              <th>Spot</th>
              <th>Expected Price</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s, i) => (
              <tr key={i}>
                <td>{s.spot.toFixed(0)}</td>
                <td>{s.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
