import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react';
import { createRoot } from 'react-dom/client';
import SimulationForm from './components/SimulationForm';
import SimulationsIndex from './components/SimulationsIndex';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('simulation-form-container');
  if (container) {
    const simulationData = container.getAttribute('data-simulation');
    const initialSimulation = simulationData ? JSON.parse(simulationData) : null;
    createRoot(container).render(<SimulationForm initialSimulation={initialSimulation} />);
  }
  const indexContainer = document.getElementById('simulations-root');
  if (indexContainer) {
    createRoot(indexContainer).render(<SimulationsIndex />);
  }
});