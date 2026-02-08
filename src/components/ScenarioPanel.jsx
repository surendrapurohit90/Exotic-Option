import { blackScholes, monteCarlo } from "../utils/blackScholes";

export default function ScenarioPanel({ deal }) {
  if (!deal) return null;

  const sign = deal.direction === "buy" ? 1 : -1;
  const shocks = [-0.1, -0.05, 0, 0.05, 0.1];

  const scenarios = shocks.map(s => {
    const spot = deal.spot * (1 + s);
    const res = deal.pricingModel === "BSM"
      ? blackScholes({ S: spot, K: deal.strike, r: deal.rate, v: deal.vol, T: deal.maturity, type: deal.payoffType })
      : monteCarlo({ S: spot, K: deal.strike, r: deal.rate, v: deal.vol, T: deal.maturity, type: deal.payoffType, paths: deal.mcPaths, steps: deal.mcSteps });

    return { spot, price: (sign * res.price * deal.notional) / deal.spot };
  });

  return (
    <div className="card">
      <h3>Scenario Analysis (Spot Shocks)</h3>
      <table>
        <thead>
          <tr><th>Spot</th><th>Expected Price</th></tr>
        </thead>
        <tbody>
          {scenarios.map((s, i) => (
            <tr key={i}><td>{s.spot.toFixed(0)}</td><td>{s.price.toFixed(2)}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
