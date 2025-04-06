import React, { useState } from 'react';

const SimulationForm = () => {
  const [initialInvestment, setInitialInvestment] = useState('');
  const [annualContribution, setAnnualContribution] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [volatility, setVolatility] = useState('');
  const [investmentPeriod, setInvestmentPeriod] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      initial_investment: parseFloat(initialInvestment),
      annual_contribution: parseFloat(annualContribution),
      expected_return: parseFloat(expectedReturn),
      volatility: parseFloat(volatility),
      investment_period: parseInt(investmentPeriod, 10)
    };

    fetch('/simulations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((response) => response.json())
      .then((data) => setResults(data))
      .catch((error) => console.error('Error:', error));
  };

  return (
    <div>
      <h2>Retirement Simulation</h2>
      <form onSubmit={handleSubmit} data-testid="simulation-form">
        <div>
          <label htmlFor="initial-investment">Initial Investment:</label>
          <input
            id="initial-investment"
            type="number"
            value={initialInvestment}
            onChange={(e) => setInitialInvestment(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="annual-contribution">Annual Contribution:</label>
          <input
            id="annual-contribution"
            type="number"
            value={annualContribution}
            onChange={(e) => setAnnualContribution(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="expected-return">Expected Return (%):</label>
          <input
            id="expected-return"
            type="number"
            step="0.1"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="volatility">Volatility (%):</label>
          <input
            id="volatility"
            type="number"
            step="0.1"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="investment-period">Investment Period (years):</label>
          <input
            id="investment-period"
            type="number"
            value={investmentPeriod}
            onChange={(e) => setInvestmentPeriod(e.target.value)}
          />
        </div>
        <button type="submit">Simulate</button>
      </form>
      {results && (
        <div>
          <h3>Simulation Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimulationForm;