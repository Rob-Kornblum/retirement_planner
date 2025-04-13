import React, { useState } from 'react';

const SimulationForm = ({ initialSimulation = null }) => {
  const [initialInvestment, setInitialInvestment] = useState(
    initialSimulation ? initialSimulation.initial_investment : ''
  );
  const [annualContribution, setAnnualContribution] = useState(
    initialSimulation ? initialSimulation.annual_contribution : ''
  );
  const [expectedReturn, setExpectedReturn] = useState(
    initialSimulation ? initialSimulation.expected_return : ''
  );
  const [volatility, setVolatility] = useState(
    initialSimulation ? initialSimulation.volatility : ''
  );
  const [investmentPeriod, setInvestmentPeriod] = useState(
    initialSimulation ? initialSimulation.investment_period : ''
  );
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      simulation: {
        initial_investment: parseFloat(initialInvestment),
        annual_contribution: parseFloat(annualContribution),
        expected_return: parseFloat(expectedReturn),
        volatility: parseFloat(volatility),
        investment_period: parseInt(investmentPeriod, 10)
      }
    };

    // Use a different endpoint/method if editing
    const url = initialSimulation ? `/simulations/${initialSimulation.id}` : '/simulations';
    const method = initialSimulation ? 'PUT' : 'POST';
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';

    let headers = { 'Content-Type': 'application/json' };
    if (process.env.NODE_ENV !== 'test') {
      headers['X-CSRF-Token'] = csrfToken;
      headers['Accept'] = 'application/json';
    }

    fetch(url, {
      method,
      headers,
      body: JSON.stringify(payload)
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error('Something went wrong!');
        }
        return response.json();
      })
      .then((data) => setResults(data))
      .catch((error) => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h2>{initialSimulation ? 'Edit Simulation' : 'New Simulation'}</h2>
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
        <button type="submit">{initialSimulation ? 'Update Simulation' : 'Simulate'}</button>
      </form>
      {loading && <p>Loading...</p>}
      {results && (
        <div>
          <h3>{initialSimulation ? 'Updated Simulation Results:' : 'Simulation Results:'}</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimulationForm;