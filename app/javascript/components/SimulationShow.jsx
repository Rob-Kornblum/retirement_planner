import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function SimulationShow() {
  const { id } = useParams()
  const [sim, setSim] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`/simulations/${id}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Simulation not found')
        return res.json()
      })
      .then(data => {
        const payload = data.simulation ? data.simulation : data;
        if (data.formatted_statistics) {
          payload.formatted_statistics = data.formatted_statistics;
        }
        if (data.statistics) {
          payload.statistics = data.statistics;
        }
        setSim(payload);
      })
      .catch(err => setError(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Loading…</p>
  if (error)  return <p>{error.message}</p>

  return (
    <div>
      <h1>Simulation #{id}</h1>
      <p>
        <strong>Initial Investment:</strong>{" "}
        {Number(sim.initial_investment).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p>
        <strong>Annual Contribution:</strong>{" "}
        {Number(sim.annual_contribution).toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </p>
      <p><strong>Expected Return:</strong> {(sim.expected_return).toFixed(2)}%</p>
      <p><strong>Volatility:</strong> {(sim.volatility).toFixed(2)}%</p>
      <p><strong>Investment Period:</strong> {sim.investment_period} {sim.investment_period === 1 ? 'year' : 'years'}</p>

      <h2>Statistics</h2>
      <table>
        <tbody>
          {Object.entries(sim.formatted_statistics || sim.statistics).map(([key, val]) => (
            <tr key={key}>
              <th>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</th>
              <td dangerouslySetInnerHTML={{ __html: val }} />
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/simulations">← Back to all simulations</Link>
    </div>
  )
}