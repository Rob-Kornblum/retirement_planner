import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SimulationShow from '../SimulationShow';

describe('SimulationShow Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const renderWithRouter = (initialEntry = '/simulations/42') => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/simulations/:id" element={<SimulationShow />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders simulation details successfully', async () => {
    const simulationData = {
      simulation: {
        initial_investment: 10000,
        annual_contribution: 5000,
        expected_return: 7.01,
        volatility: 12.34,
        investment_period: 30,
        formatted_statistics: {
          mean_return: '<span>7.01%</span>',
          median_return: '<span>6.50%</span>',
        },
      },
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => simulationData,
    });

    renderWithRouter('/simulations/42');

    // Wait for the simulation header to appear
    expect(await screen.findByText('Simulation #42')).toBeInTheDocument();

    // Check for simulation details
    expect(screen.getByText(/Initial Investment:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$10,000\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Annual Contribution:/i)).toBeInTheDocument();
    expect(screen.getByText(/\$5,000\.00/)).toBeInTheDocument();

    expect(screen.getByText(/Expected Return:/i)).toBeInTheDocument();
    const percentElements = screen.getAllByText(/7\.01%/);
    expect(percentElements.length).toBeGreaterThan(0);

    expect(screen.getByText(/Volatility:/i)).toBeInTheDocument();
    expect(screen.getByText(/12\.34%/)).toBeInTheDocument();

    expect(screen.getByText(/Investment Period:/i)).toBeInTheDocument();
    expect(screen.getByText(/30 years/)).toBeInTheDocument();

    // Check that statistics are rendered:
    // Get the row containing "Mean Return"
    const meanReturnRow = screen.getByText(/Mean Return/i).closest('tr');
    expect(within(meanReturnRow).getByText(/7\.01%/)).toBeInTheDocument();

    // Check Median Return similarly
    const medianReturnRow = screen.getByText(/Median Return/i).closest('tr');
    expect(within(medianReturnRow).getByText(/6\.50%/)).toBeInTheDocument();

    // Check for the back link
    expect(screen.getByText(/← Back to all simulations/i)).toBeInTheDocument();
  });

  test('displays error message when fetch returns non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Simulation not found' }),
    });

    renderWithRouter('/simulations/99');

    // Wait for the error message to be displayed
    expect(await screen.findByText('Simulation not found')).toBeInTheDocument();
  });

  test('displays error message when fetch throws an exception', async () => {
    const errorMessage = 'Network Error';
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));

    renderWithRouter('/simulations/77');

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});