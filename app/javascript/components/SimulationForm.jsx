import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './SimulationForm.module.scss';

const SimulationForm = ({ 
  initialSimulation = null, 
  onSuccess = () => {},
  onCancel = () => {}  
}) => {
  // React Router ID param
  const { id } = useParams();
  // state for simulation loaded from server when editing via route
  const [routeSimulation, setRouteSimulation] = useState(null);

  // decide which simulation to edit: prop or route
  const editingSimulation = initialSimulation || routeSimulation;

  const [initialInvestment, setInitialInvestment] = useState(
    editingSimulation ? editingSimulation.initial_investment : ''
  );
  const [annualContribution, setAnnualContribution] = useState(
    editingSimulation ? editingSimulation.annual_contribution : ''
  );
  const [expectedReturn, setExpectedReturn] = useState(
    editingSimulation ? editingSimulation.expected_return : ''
  );
  const [volatility, setVolatility] = useState(
    editingSimulation ? editingSimulation.volatility : ''
  );
  const [investmentPeriod, setInvestmentPeriod] = useState(
    editingSimulation ? editingSimulation.investment_period : ''
  );
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // fetch simulation when route id present
  useEffect(() => {
    if (id) {
      fetch(`/simulations/${id}.json`)
        .then(res => res.json())
        .then(setRouteSimulation)
        .catch(console.error);
    }
  }, [id]);

  useEffect(() => {
    if (editingSimulation) {
      setInitialInvestment(editingSimulation.initial_investment);
      setAnnualContribution(editingSimulation.annual_contribution);
      setExpectedReturn(editingSimulation.expected_return);
      setVolatility(editingSimulation.volatility);
      setInvestmentPeriod(editingSimulation.investment_period);
    } else {
      setInitialInvestment('');
      setAnnualContribution('');
      setExpectedReturn('');
      setVolatility('');
      setInvestmentPeriod('');
    }
  }, [editingSimulation]);

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

    // Use prop or route-based edit indicator
    const url = editingSimulation
      ? `/simulations/${editingSimulation.id}`
      : '/simulations';
    const method = editingSimulation ? 'PUT' : 'POST';
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
      .then((data) => { 
        setResults(data);
        onSuccess(data);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <div className={styles.container}>
      <h2>{editingSimulation ? 'Edit Simulation' : 'New Simulation'}</h2>
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
        <button type="submit" disabled={loading} data-testid="submit-button">
          {loading ? 'Submitting...' : (editingSimulation ? 'Update Simulation' : 'Simulate')}
        </button>
        {editingSimulation && (
          <button type="button" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
        )}
      </form>
      {loading && <p>Loading...</p>}
      {results && (
        <div className={styles.results}>
          <h3>{editingSimulation ? 'Updated Simulation Results:' : 'Simulation Results:'}</h3>
          <pre data-testid="simulation-output">{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimulationForm;