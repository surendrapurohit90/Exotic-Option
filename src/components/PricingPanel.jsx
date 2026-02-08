export default function PricingPanel({ pricing }) {
  if (!pricing) return null;

  return (
    <div className="card">
      <h2>Pricing & Greeks</h2>
      <table>
        <tbody>
          <tr><td>Price</td><td>{pricing.price.toFixed(2)}</td></tr>
          <tr><td>Delta</td><td>{pricing.delta.toFixed(4)}</td></tr>
          <tr><td>Gamma</td><td>{pricing.gamma.toFixed(6)}</td></tr>
          <tr><td>Vega</td><td>{pricing.vega.toFixed(4)}</td></tr>
          <tr><td>Theta</td><td>{pricing.theta.toFixed(4)}</td></tr>
          <tr><td>Rho</td><td>{pricing.rho.toFixed(4)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
