export default function DealForm({ deal, setDeal }) {
  if (!deal) return null;

  const handleChange = (field, value) => setDeal({ ...deal, [field]: value });

  return (
    <div className="card">
      <h2>Deal Capture</h2>

      <div className="field">
        <label>Direction</label>
        <select value={deal.direction} onChange={e => handleChange("direction", e.target.value)}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      <div className="field">
        <label>Option Payoff</label>
        <select value={deal.payoffType} onChange={e => handleChange("payoffType", e.target.value)}>
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </div>

      <div className="field">
        <label>Spot Price</label>
        <input type="number" value={deal.spot} onChange={e => handleChange("spot", +e.target.value)} />
      </div>

      <div className="field">
        <label>Strike</label>
        <input type="number" value={deal.strike} onChange={e => handleChange("strike", +e.target.value)} />
      </div>

      <div className="field">
        <label>Volatility</label>
        <input type="number" step="0.01" value={deal.vol} onChange={e => handleChange("vol", +e.target.value)} />
      </div>

      <div className="field">
        <label>Rate</label>
        <input type="number" step="0.01" value={deal.rate} onChange={e => handleChange("rate", +e.target.value)} />
      </div>

      <div className="field">
        <label>Maturity (Years)</label>
        <input type="number" step="0.01" value={deal.maturity} onChange={e => handleChange("maturity", +e.target.value)} />
      </div>

      <div className="field">
        <label>Pricing Model</label>
        <select value={deal.pricingModel} onChange={e => handleChange("pricingModel", e.target.value)}>
          <option value="BSM">Black–Scholes</option>
          <option value="MC">Monte Carlo</option>
        </select>
      </div>

      {deal.pricingModel === "MC" && (
        <>
          <div className="field">
            <label>Monte Carlo Paths</label>
            <input type="number" value={deal.mcPaths} onChange={e => handleChange("mcPaths", +e.target.value)} />
          </div>

          <div className="field">
            <label>Time Steps per Path</label>
            <input type="number" value={deal.mcSteps} onChange={e => handleChange("mcSteps", +e.target.value)} />
          </div>

          <div className="field">
            <button onClick={() => handleChange("generateMC", Math.random())}>
              Generate Pricing
            </button>
          </div>
        </>
      )}
    </div>
  );
}
