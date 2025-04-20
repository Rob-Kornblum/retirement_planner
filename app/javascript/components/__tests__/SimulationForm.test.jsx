import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SimulationForm from '../SimulationForm';

describe('SimulationForm Component', () => {
  beforeEach(() => {
    // Set up a mock for the global fetch function
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders the form with title, labels, inputs, and button', () => {
    render(<SimulationForm />);
    
    // Check for the form title
    expect(screen.getByText(/New Simulation/i)).toBeInTheDocument();
    
    // Check for all input fields
    expect(screen.getByLabelText(/Initial Investment/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Annual Contribution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expected Return/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Volatility/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Investment Period/i)).toBeInTheDocument();
    
    // Check for the submit button
    expect(screen.getByRole('button', { name: /Simulate/i })).toBeInTheDocument();
  });

  test('updates input values on user typing', () => {
    render(<SimulationForm />);
    
    const initialInvestmentInput = screen.getByLabelText(/Initial Investment/i);
    fireEvent.change(initialInvestmentInput, { target: { value: '1000' } });
    expect(initialInvestmentInput.value).toBe('1000');
  });

  test('submits form with correct payload and displays results', async () => {
    // Prepare a mock response for a successful fetch call
    const mockResults = { simulation: 'result data' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });

    render(<SimulationForm />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Initial Investment/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Annual Contribution/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Expected Return/i), { target: { value: '5.5' } });
    fireEvent.change(screen.getByLabelText(/Volatility/i), { target: { value: '2.3' } });
    fireEvent.change(screen.getByLabelText(/Investment Period/i), { target: { value: '30' } });
    
    // Submit the form
    const form = screen.getByTestId('simulation-form');
    fireEvent.submit(form);

    // Ensure that fetch was called with the correct parameters
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    expect(global.fetch).toHaveBeenCalledWith('/simulations', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        simulation: {
          initial_investment: 1000,
          annual_contribution: 2000,
          expected_return: 5.5,
          volatility: 2.3,
          investment_period: 30
        }
      }),
    }));
    
    // Wait for the simulation results to be displayed; assumed to be rendered inside a <pre> tag
    await waitFor(() => {
      expect(screen.getByText(/result data/i)).toBeInTheDocument();
    });
  });

  test('handles fetch error gracefully', async () => {
    const errorMessage = 'Fetch failed';
    global.fetch.mockRejectedValueOnce(new Error(errorMessage));
    
    // Spy on console.error to verify error logging
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<SimulationForm />);

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Initial Investment/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Annual Contribution/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Expected Return/i), { target: { value: '5.5' } });
    fireEvent.change(screen.getByLabelText(/Volatility/i), { target: { value: '2.3' } });
    fireEvent.change(screen.getByLabelText(/Investment Period/i), { target: { value: '30' } });
    
    const form = screen.getByTestId('simulation-form');
    fireEvent.submit(form);

    // Verify that an error is logged
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  test('submits PUT request with correct payload when editing an existing simulation', async () => {
    const mockResults = { simulation: 'updated result' };
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResults,
    });
  
    const initialSimulation = {
      id: 42,
      initial_investment: 500,
      annual_contribution: 1500,
      expected_return: 4.0,
      volatility: 1.5,
      investment_period: 20,
    };
  
    render(<SimulationForm initialSimulation={initialSimulation} />);
  

    fireEvent.change(screen.getByLabelText(/Initial Investment/i), { target: { value: '1000' } });
  
    const form = screen.getByTestId('simulation-form');
    fireEvent.submit(form);
  
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/simulations/42', expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          simulation: {
            initial_investment: 1000,
            annual_contribution: 1500,
            expected_return: 4.0,
            volatility: 1.5,
            investment_period: 20,
          }
        }),
      }));
    });
  
    expect(screen.getByText(/updated result/i)).toBeInTheDocument();
  });

  test('disables submit button during form submission', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ simulation: 'result' }),
    });
  
    render(<SimulationForm />);
  
    fireEvent.change(screen.getByLabelText(/Initial Investment/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Annual Contribution/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Expected Return/i), { target: { value: '5.5' } });
    fireEvent.change(screen.getByLabelText(/Volatility/i), { target: { value: '2.3' } });
    fireEvent.change(screen.getByLabelText(/Investment Period/i), { target: { value: '30' } });
  
    const button = screen.getByRole('button', { name: /Simulate/i });
  
    // Check button is not disabled before submit
    expect(button).not.toBeDisabled();
  
    fireEvent.submit(screen.getByTestId('simulation-form'));
  
    // Button should be disabled while submitting
    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  
    await screen.findByTestId('simulation-output');
  
    // Button should be enabled again after submission
    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  test('handles non-ok fetch response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Internal Server Error' }),
    });
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    render(<SimulationForm />);
  
    fireEvent.change(screen.getByLabelText(/Initial Investment/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Annual Contribution/i), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText(/Expected Return/i), { target: { value: '5.5' } });
    fireEvent.change(screen.getByLabelText(/Volatility/i), { target: { value: '2.3' } });
    fireEvent.change(screen.getByLabelText(/Investment Period/i), { target: { value: '30' } });
  
    fireEvent.submit(screen.getByTestId('simulation-form'));
  
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  
    consoleErrorSpy.mockRestore();
  });
});
