class Simulation < ApplicationRecord
  validates :initial_investment, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :annual_contribution, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :expected_return, presence: true, numericality: true
  validates :volatility, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :investment_period, presence: true, numericality: { only_integer: true, greater_than: 0 }

  after_initialize :set_defaults, if: :new_record?

  def set_defaults
    self.initial_investment = 1000 if self.initial_investment.nil?
    self.annual_contribution = 1000 if self.annual_contribution.nil?
    self.expected_return = 7.5 if self.expected_return.nil?
    self.volatility = 15 if self.volatility.nil?
    self.investment_period = 30 if self.investment_period.nil?
  end

  def random_annual_return
    u1 = rand
    u2 = rand
    z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math::PI * u2)
    (expected_return * 0.01) + (volatility * 0.01) * z0
  end

  def simulate_year(balance)
    annual_return = random_annual_return
    computed_balance = balance * (1 + annual_return)
    computed_balance + annual_contribution
  end

  def simulate_growth
    balance = initial_investment
    balances = [balance]
    investment_period.times do
      balance = simulate_year(balance)
      balances << balance
    end
    balances
  end

  def final_balance
    simulate_growth.last
  end

  def run_simulations(num_runs = 1000)
    Array.new(num_runs) { final_balance }
  end

  def simulation_statistics(num_runs = 1000)
    outcomes = run_simulations(num_runs)
    sorted = outcomes.sort
    {
      average: outcomes.sum / outcomes.size.to_f,
      median: sorted[sorted.size / 2],
      min: outcomes.min,
      max: outcomes.max
    }
  end

  def average_final_balance(num_runs = 1000)
    ActionController::Base.helpers.number_to_currency(simulation_statistics(num_runs)[:average])
  end

  def median_final_balance(num_runs = 1000)
    ActionController::Base.helpers.number_to_currency(simulation_statistics(num_runs)[:median])
  end

  def min_final_balance(num_runs = 1000)
    ActionController::Base.helpers.number_to_currency(simulation_statistics(num_runs)[:min])
  end

  def max_final_balance(num_runs = 1000)
    ActionController::Base.helpers.number_to_currency(simulation_statistics(num_runs)[:max])
  end
end
