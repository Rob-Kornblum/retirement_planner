class CreateSimulations < ActiveRecord::Migration[7.1]
  def change
    create_table :simulations do |t|
      t.decimal :initial_investment
      t.decimal :annual_contribution
      t.float :expected_return
      t.float :volatility
      t.integer :investment_period

      t.timestamps
    end
  end
end
