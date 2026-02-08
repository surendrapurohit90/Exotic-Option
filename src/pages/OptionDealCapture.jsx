import { useState } from "react";
import DealForm from "./components/DealForm";
import PricingPanel from "./components/PricingPanel";
import ScenarioPanel from "./components/ScenarioPanel";
import { blackScholes, monteCarlo } from "./utils/blackScholes";

export default function OptionDealCapture() {
  const [deal, setDeal] = useState({
    direction: "buy",
    payoffType: "call",
    pricingModel: "BSM",
    mcPaths: 50000,
    mcSteps: 252,
    notional: 1000000,
    spot: 100,
    strike: 100,
    vol: 0.2,
    rate: 0.05,
    maturity: 0.5,
    generateMC: 0
  });

  const sign = deal.direction === "buy" ? 1 : -1;

  const pricing = deal.pricingModel === "BSM"
    ? blackScholes({ S: deal.spot, K: deal.strike, r: deal.rate, v: deal.vol, T: deal.maturity, type: deal.payoffType })
    : monteCarlo({ S: deal.spot, K: deal.strike, r: deal.rate, v: deal.vol, T: deal.maturity, type: deal.payoffType, paths: deal.mcPaths, steps: deal.mcSteps });

  const pricingWithSign = {
    price: sign * pricing.price,
    delta: sign * pricing.delta,
    gamma: pricing.gamma,
    vega: pricing.vega,
    theta: sign * pricing.theta,
    rho: sign * pricing.rho
  };

  return (
    <>
      <DealForm deal={deal} setDeal={setDeal} />
      <PricingPanel pricing={pricingWithSign} />
      <ScenarioPanel deal={deal} />
    </>
  );
}
