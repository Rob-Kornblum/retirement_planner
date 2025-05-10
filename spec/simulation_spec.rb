require 'rails_helper'

RSpec.describe Simulation, type: :model do
  let(:valid_attributes) do
    {
      initial_investment: 10000,
      annual_contribution: 5000,
      expected_return: 0.07,
      volatility: 0.15,
      investment_period: 30
    }
  end

  # Helper method to build a simulation with any attribute overrides
  def build_simulation(overrides = {})
    Simulation.new(valid_attributes.merge(overrides))
  end

  context 'with valid attributes' do
    it 'is valid' do
      simulation = build_simulation
      expect(simulation).to be_valid
    end
  end

  context 'when initial_investment is negative' do
    it 'is not valid and adds an error for initial_investment' do
      simulation = build_simulation(initial_investment: -100)
      simulation.validate
      expect(simulation.errors[:initial_investment]).to include("must be greater than or equal to 0")
    end
  end

  context 'when annual_contribution is negative' do
    it 'is not valid and adds an error for annual_contribution' do
      simulation = build_simulation(annual_contribution: -100)
      simulation.validate
      expect(simulation.errors[:annual_contribution]).to include("must be greater than or equal to 0")
    end
  end

  context 'when investment_period is not an integer' do
    it 'is not valid and adds an error for investment_period' do
      simulation = build_simulation(investment_period: 30.5)
      simulation.validate
      expect(simulation.errors[:investment_period]).to include("must be an integer")
    end
  end

  context 'when volatility is below zero' do
    it 'is not valid and adds an error for volatility' do
      simulation = build_simulation(volatility: -0.05)
      simulation.validate
      expect(simulation.errors[:volatility]).to include("must be greater than or equal to 0")
    end
  end

  context 'when expected_return is a string' do
    it 'is not valid and adds an error for expected_return' do
      simulation = build_simulation(expected_return: "Seven")
      simulation.validate
      expect(simulation.errors[:expected_return]).to include("is not a number")
    end
  end

  # Replace the context for initial_investment nil:
context 'when initial_investment is nil' do
    it 'overrides nil value with default of 1000' do
      simulation = build_simulation(initial_investment: nil)
      simulation.set_defaults
      expect(simulation.initial_investment).to eq(1000)
    end
  end

  # Replace the context for annual_contribution nil:
  context 'when annual_contribution is nil' do
    it 'overrides nil value with default of 1000' do
      simulation = build_simulation(annual_contribution: nil)
      simulation.set_defaults
      expect(simulation.annual_contribution).to eq(1000)
    end
  end

  # Replace the context for expected_return nil:
  context 'when expected_return is nil' do
    it 'overrides nil value with default of 7.5' do
      simulation = build_simulation(expected_return: nil)
      simulation.set_defaults
      expect(simulation.expected_return).to eq(7.5)
    end
  end

  # Replace the context for volatility nil:
  context 'when volatility is nil' do
    it 'overrides nil value with default of 15' do
      simulation = build_simulation(volatility: nil)
      simulation.set_defaults
      expect(simulation.volatility).to eq(15)
    end
  end

  # Replace the context for investment_period nil:
  context 'when investment_period is nil' do
    it 'overrides nil value with default of 30' do
      simulation = build_simulation(investment_period: nil)
      simulation.set_defaults
      expect(simulation.investment_period).to eq(30)
    end
  end

  context 'when initial_investment is zero' do
    it 'is valid' do
      simulation = build_simulation(initial_investment: 0)
      expect(simulation).to be_valid
    end
  end

  context 'when annual_contribution is zero' do
    it 'is valid' do
      simulation = build_simulation(annual_contribution: 0)
      expect(simulation).to be_valid
    end
  end

  context 'when investment_period is zero' do
    it 'is not valid and adds an error for investment_period' do
      simulation = build_simulation(investment_period: 0)
      simulation.validate
      expect(simulation.errors[:investment_period]).to include("must be greater than 0")
    end
  end

  context 'when multiple attributes are invalid' do
    it 'has errors for initial_investment, investment_period, and expected_return' do
      simulation = build_simulation(
        initial_investment: -500,
        investment_period: 0,
        expected_return: "not a number"
      )
      simulation.validate
      expect(simulation.errors[:initial_investment]).to include("must be greater than or equal to 0")
      expect(simulation.errors[:investment_period]).to include("must be greater than 0")
      expect(simulation.errors[:expected_return]).to include("is not a number")
    end
  end

  describe '#set_defaults' do
    context 'when no attributes are provided' do
      it 'sets default values' do
        simulation = Simulation.new
        simulation.set_defaults
        expect(simulation.initial_investment).to eq(1000)
        expect(simulation.annual_contribution).to eq(1000)
        expect(simulation.expected_return).to eq(7.5)
        expect(simulation.volatility).to eq(15)
        expect(simulation.investment_period).to eq(30)
      end
    end

    context 'when attributes are explicitly provided as nil' do
      it 'overrides nil values with default values' do
        simulation = Simulation.new(
          initial_investment: nil,
          annual_contribution: nil,
          expected_return: nil,
          volatility: nil,
          investment_period: nil
        )
        simulation.set_defaults
        expect(simulation.initial_investment).to eq(1000)
        expect(simulation.annual_contribution).to eq(1000)
        expect(simulation.expected_return).to eq(7.5)
        expect(simulation.volatility).to eq(15)
        expect(simulation.investment_period).to eq(30)
      end
    end
  end

  describe '#random_annual_return' do
    it 'returns a float' do
      simulation = build_simulation(expected_return: 7.5, volatility: 15)
      expect(simulation.random_annual_return).to be_a(Float)
    end

    it 'returns a deterministic value when volatility is 0' do
      simulation = build_simulation(expected_return: 7.5, volatility: 0)
      expected_return = simulation.expected_return * 0.01
      expect(simulation.random_annual_return).to be_within(0.0001).of(expected_return)
    end
  end

  describe '#simulate_year' do
    it 'computes the next year balance correctly using random_annual_return' do
      simulation = build_simulation(annual_contribution: 1000)
      # Stub random_annual_return to return a fixed value (e.g. 5% or 0.05)
      allow(simulation).to receive(:random_annual_return).and_return(0.05)
      initial_balance = 1000
      expected_balance = initial_balance * (1 + 0.05) + simulation.annual_contribution
      expect(simulation.simulate_year(initial_balance)).to eq(expected_balance)
    end
  end

  describe '#simulate_growth' do
    it 'returns an array of balances with length investment_period + 1' do
      simulation = build_simulation(initial_investment: 1000, annual_contribution: 1000, investment_period: 5)
      # Stub simulate_year to add annual_contribution for predictability
      allow(simulation).to receive(:simulate_year) { |balance| balance + simulation.annual_contribution }
      growth = simulation.simulate_growth
      expect(growth.length).to eq(simulation.investment_period + 1)
      expect(growth.first).to eq(simulation.initial_investment)
    end
  end

  describe '#final_balance' do
    it 'returns the last balance from simulate_growth' do
      simulation = build_simulation
      growth = [1000, 2000, 3000]
      allow(simulation).to receive(:simulate_growth).and_return(growth)
      expect(simulation.final_balance).to eq(growth.last)
    end
  end

  describe '#run_simulations' do
    it 'returns an array with the specified number of simulation runs' do
      simulation = build_simulation
      # Stub final_balance to always return a fixed value (e.g., 5000) for predictability
      allow(simulation).to receive(:final_balance).and_return(5000)
      num_runs = 50
      outcomes = simulation.run_simulations(num_runs)
      expect(outcomes.length).to eq(num_runs)
      expect(outcomes.all? { |balance| balance == 5000 }).to be_truthy
    end
  end

  describe '#simulation_statistics' do
    it 'returns a hash with average, median, min, and max values' do
      simulation = build_simulation
      outcomes = [1000, 2000, 3000, 4000, 5000]
      allow(simulation).to receive(:run_simulations).and_return(outcomes)
      stats = simulation.simulation_statistics(5)
      average = outcomes.sum / outcomes.size.to_f
      sorted = outcomes.sort
      median = sorted[sorted.size / 2]
      expect(stats[:average]).to eq(average)
      expect(stats[:median]).to eq(median)
      expect(stats[:min]).to eq(outcomes.min)
      expect(stats[:max]).to eq(outcomes.max)
    end
  end

  describe 'currency-formatted statistics methods' do
    let(:simulation) { build_simulation }

    before do
      outcomes = [100_000, 200_000, 300_000, 400_000, 500_000]
      allow(simulation).to receive(:run_simulations).and_return(outcomes)
    end

    it 'returns average_final_balance as currency' do
      expect(simulation.average_final_balance(5)).to eq('$300,000.00')
    end

    it 'returns median_final_balance as currency' do
      expect(simulation.median_final_balance(5)).to eq('$300,000.00')
    end

    it 'returns min_final_balance as currency' do
      expect(simulation.min_final_balance(5)).to eq('$100,000.00')
    end

    it 'returns max_final_balance as currency' do
      expect(simulation.max_final_balance(5)).to eq('$500,000.00')
    end
  end
end
