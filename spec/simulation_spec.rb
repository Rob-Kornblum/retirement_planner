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

  subject(:simulation) { Simulation.new(attributes) }

  context 'with valid attributes' do
    let(:attributes) { valid_attributes }

    it 'is valid' do
      expect(simulation).to be_valid
    end
  end

  context 'when initial_investment is negative' do
    let(:attributes) { valid_attributes.merge(initial_investment: -100) }

    it 'is not valid and adds an error for initial_investment' do
      simulation.validate
      expect(simulation.errors[:initial_investment]).to include("must be greater than or equal to 0")
    end
  end

  context 'when annual_contribution is negative' do
    let(:attributes) { valid_attributes.merge(annual_contribution: -100) }

    it 'is not valid and adds an error for initial_investment' do
      simulation.validate
      expect(simulation.errors[:annual_contribution]).to include("must be greater than or equal to 0")
    end
  end

  context 'when investment_period is not an integer' do
    let(:attributes) { valid_attributes.merge(investment_period: 30.5) }

    it 'is not valid and adds an error for investment_period' do
      simulation.validate
      expect(simulation.errors[:investment_period]).to include("must be an integer")
    end
  end

  context 'when volatility is below zero' do
    let(:attributes) { valid_attributes.merge(volatility: -0.05) }

    it 'is not valid and adds an error for volatility' do
      simulation.validate
      expect(simulation.errors[:volatility]).to include("must be greater than or equal to 0")
    end
  end

  context 'when expected_return is a string' do
    let(:attributes) { valid_attributes.merge(expected_return: "Seven") }

    it 'is not valid and adds an error for expected_return' do
      simulation.validate
      expect(simulation.errors[:expected_return]).to include("is not a number")
    end
  end

  context 'when initial_investment is nil' do
    let(:attributes) { valid_attributes.merge(initial_investment: nil) }

    it 'is not valid and adds an error for initial_investment' do
      simulation.validate
      expect(simulation.errors[:initial_investment]).to include("can't be blank")
    end
  end

  context 'when annual_contribution is nil' do
    let(:attributes) { valid_attributes.merge(annual_contribution: nil) }

    it 'is not valid and adds an error for annual_contribution' do
      simulation.validate
      expect(simulation.errors[:annual_contribution]).to include("can't be blank")
    end
  end

  context 'when expected_return is nil' do
    let(:attributes) { valid_attributes.merge(expected_return: nil) }

    it 'is not valid and adds an error for expected_return' do
      simulation.validate
      expect(simulation.errors[:expected_return]).to include("can't be blank")
    end
  end

  context 'when volatility is nil' do
    let(:attributes) { valid_attributes.merge(volatility: nil) }

    it 'is not valid and adds an error for volatility' do
      simulation.validate
      expect(simulation.errors[:volatility]).to include("can't be blank")
    end
  end

  context 'when investment_period is nil' do
    let(:attributes) { valid_attributes.merge(investment_period: nil) }

    it 'is not valid and adds an error for investment_period' do
      simulation.validate
      expect(simulation.errors[:investment_period]).to include("can't be blank")
    end
  end

  context 'when initial_investment is zero' do
    let(:attributes) { valid_attributes.merge(initial_investment: 0) }

    it 'is valid' do
      expect(simulation).to be_valid
    end
  end

  context 'when annual_contribution is zero' do
    let(:attributes) { valid_attributes.merge(annual_contribution: 0) }

    it 'is valid' do
      expect(simulation).to be_valid
    end
  end

  context 'when investment_period is zero' do
    let(:attributes) { valid_attributes.merge(investment_period: 0) }

    it 'is not valid and adds an error for investment_period' do
      simulation.validate
      expect(simulation.errors[:investment_period]).to include("must be greater than 0")
    end
  end

  context 'when multiple attributes are invalid' do
    let(:attributes) do
      valid_attributes.merge(
        initial_investment: -500,
        investment_period: 0,
        expected_return: "not a number"
      )
    end

    it 'has errors for initial_investment, investment_period, and expected_return' do
      simulation.validate
      expect(simulation.errors[:initial_investment]).to include("must be greater than or equal to 0")
      expect(simulation.errors[:investment_period]).to include("must be greater than 0")
      expect(simulation.errors[:expected_return]).to include("is not a number")
    end
  end
end
