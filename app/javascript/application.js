// app/javascript/application.js
import "@hotwired/turbo-rails"
import "./controllers"

import React from 'react'
import { createRoot } from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

import SimulationsIndex from './components/SimulationsIndex'
import SimulationForm     from './components/SimulationForm'

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('react-root')
  if (!container) return

  const root = createRoot(container)
  root.render(
    <BrowserRouter>
      <Routes>
        {/* redirect root to /simulations */}
        <Route path="/" element={<Navigate to="/simulations" replace />} />

        {/* index */}
        <Route path="/simulations" element={<SimulationsIndex />} />

        {/* new */}
        <Route
          path="/simulations/new"
          element={<SimulationForm />}
        />

        {/* edit */}
        <Route
          path="/simulations/:id/edit"
          element={<SimulationForm />}
        />

        {/* catch‑all */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  )
})