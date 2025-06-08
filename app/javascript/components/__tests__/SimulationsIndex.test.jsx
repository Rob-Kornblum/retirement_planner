import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { within } from '@testing-library/react';

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    })
  );
});

afterAll(() => {
  global.fetch.mockRestore && global.fetch.mockRestore();
  delete global.fetch;
});

// Set up the global variable before importing the component
const simulations = [
  {
    id: 1,
    initial_investment: 10000,
    annual_contribution: 2000,
    expected_return: 5,
  },
  {
    id: 2,
    initial_investment: 5000,
    annual_contribution: 1000,
    expected_return: 7.5,
  },
];
window.simulations = simulations;

import SimulationsIndex from '../SimulationsIndex';

describe('SimulationsIndex', () => {
  afterEach(() => {
    delete window.simulations;
  });

  it('renders a list of simulations with correct details', () => {
    render(
      <MemoryRouter>
        <SimulationsIndex simulations={simulations} />
      </MemoryRouter>
    );

    const items = screen.getAllByRole('listitem');
    
    // First simulation
    expect(
      within(items[0]).getAllByText((content, element) =>
        element.textContent.includes("$10,000.00")
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(items[0]).getAllByText((content, element) =>
        element.textContent.includes("$2,000.00")
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(items[0]).getAllByText((content, element) =>
        element.textContent.includes("5.00%")
      ).length
    ).toBeGreaterThan(0);
    
    // Second simulation
    expect(
      within(items[1]).getAllByText((content, element) =>
        element.textContent.includes("$5,000.00")
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(items[1]).getAllByText((content, element) =>
        element.textContent.includes("$1,000.00")
      ).length
    ).toBeGreaterThan(0);
    expect(
      within(items[1]).getAllByText((content, element) =>
        element.textContent.includes("7.50%")
      ).length
    ).toBeGreaterThan(0);
});

  it('renders Show, Edit, and Delete buttons for each simulation', () => {
    render(
      <MemoryRouter>
        <SimulationsIndex simulations={simulations} />
      </MemoryRouter>
    );

    expect(screen.getAllByRole('button', { name: 'Show' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Edit' })).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2);
});

  it('renders a link to create a new simulation', () => {
    render(
      <MemoryRouter>
        <SimulationsIndex />
      </MemoryRouter>
    );

    expect(screen.getByText('New Simulation')).toBeInTheDocument();
  });
});