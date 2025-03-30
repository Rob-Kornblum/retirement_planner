// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import React from 'react';
import { createRoot } from 'react-dom/client';
import SimulationForm from './components/SimulationForm';

console.log("application.js loaded");

document.addEventListener('DOMContentLoaded', () => {
  const simulationRoot = document.getElementById('simulation-root');
  if (simulationRoot) {
    createRoot(simulationRoot).render(<SimulationForm />);
  }
});