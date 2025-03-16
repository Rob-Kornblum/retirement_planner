# spec/models/simulation_spec.rb
require 'rails_helper'

RSpec.describe Simulation, type: :model do
  subject { Simulation.new(initial_investment: 10000, annual_contribution: 5000, expected_return: 0.07, volatility: 0.15, investment_period: 30) }

  describe 'validations' do
    it { should validate_presence_of(:initial_investment) }
    it { should validate_numericality_of(:initial_investment).is_greater_than_or_equal_to(0) }

    it { should validate_presence_of(:annual_contribution) }
    it { should validate_numericality_of(:annual_contribution).is_greater_than_or_equal_to(0) }

    it { should validate_presence_of(:expected_return) }
    it { should validate_numericality_of(:expected_return) }

    it { should validate_presence_of(:volatility) }
    it { should validate_numericality_of(:volatility).is_greater_than_or_equal_to(0) }

    it { should validate_presence_of(:investment_period) }
    it { should validate_numericality_of(:investment_period).only_integer.is_greater_than(0) }
  end
end
