// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react';
import { createRoot } from 'react-dom/client';
import SimulationForm from './components/SimulationForm';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('simulation-form-container');
  if (container) {
    const simulationData = container.getAttribute('data-simulation');
    const initialSimulation = simulationData ? JSON.parse(simulationData) : null;
    createRoot(container).render(<SimulationForm initialSimulation={initialSimulation} />);
  }
});