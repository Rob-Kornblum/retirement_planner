class Simulation < ApplicationRecord
  validates :initial_investment, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :annual_contribution, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :expected_return, presence: true, numericality: true
  validates :volatility, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :investment_period, presence: true, numericality: { only_integer: true, greater_than: 0 }
end
