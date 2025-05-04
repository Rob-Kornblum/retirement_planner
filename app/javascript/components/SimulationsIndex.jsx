import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SimulationsIndex.scss';   // keep this if you want your .scss styles

const SimulationsIndex = () => {
  const [simulations, setSimulations] = useState([]);

  useEffect(() => {
    fetch('/simulations.json')
      .then(res => res.json())
      .then(setSimulations)
      .catch(console.error);
  }, []);

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
              #{sim.id}: Initial ${sim.initial_investment}, Contrib ${sim.annual_contribution}, Return {sim.expected_return}%
            </span>
            <div className="actions">
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