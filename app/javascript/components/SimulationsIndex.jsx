import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SimulationsIndex.scss';

const SimulationsIndex = ({ simulations: simulationsProp }) => {
  const [simulations, setSimulations] = useState(simulationsProp || []);

  useEffect(() => {
    if (!simulationsProp) {
      fetch('/simulations.json')
        .then(res => res.json())
        .then(setSimulations)
        .catch(console.error);
    }
  }, [simulationsProp]);

  const handleDelete = (id) => {
    if (!window.confirm('Delete this simulation?')) return;
    fetch(`/simulations/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector("meta[name='csrf-token']").content,
        'Accept': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) setSimulations((prev) => prev.filter((s) => s.id !== id));
      })
      .catch(console.error);
  };

  return (
    <div className="simulations-index">
      <div className="index-header">
        <h1>Simulations</h1>
        <Link to="/simulations/new">
          <button>New Simulation</button>
        </Link>
      </div>

      <ul className="sim-list">
        {simulations.map((sim) => (
          <li key={sim.id} className="list-item">
            <span>
              #{sim.id}: Initial {Number(sim.initial_investment).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}, Contrib {Number(sim.annual_contribution).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}, Return {Number(sim.expected_return).toFixed(2)}%
            </span>
            <div className="actions">
              <Link to={`/simulations/${sim.id}`}>
                <button>Show</button>
              </Link>
              <Link to={`/simulations/${sim.id}/edit`}>
                <button>Edit</button>
              </Link>
              <button onClick={() => handleDelete(sim.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimulationsIndex;