import React, { useState, useEffect } from 'react';
import SimulationForm from './SimulationForm';
import './SimulationsIndex.scss';

const SimulationsIndex = () => {
  const [simulations, setSimulations] = useState([]);
  const [editingSimulation, setEditingSimulation] = useState(null);

  useEffect(() => {
    fetch('/simulations.json')
      .then((res) => res.json())
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
        if (res.ok) {
          setSimulations((prev) => prev.filter((s) => s.id !== id));
        }
      })
      .catch(console.error);
  };

  const handleEdit = (simulation) => setEditingSimulation(simulation);

  return (
    <div>
      <h1>Simulations</h1>
      {editingSimulation && (
        <SimulationForm
          initialSimulation={editingSimulation}
          onSuccess={(updated) => {
            setSimulations((prev) =>
              prev.map((s) => (s.id === updated.id ? updated : s))
            );
            setEditingSimulation(null);
          }}
          onCancel={() => setEditingSimulation(null)}
        />
      )}
      <ul>
        {simulations.map((sim) => (
          <li key={sim.id}>
            <div className="list-item">
              <span>
                Simulation #{sim.id} — Initial: {sim.initial_investment}, Contribution: {sim.annual_contribution}, Return: {sim.expected_return}%
              </span>
              <div className="actions">
                <button onClick={() => handleEdit(sim)}>Edit</button>
                <button onClick={() => handleDelete(sim.id)}>Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SimulationsIndex;
