class AddUserIdToSimulations < ActiveRecord::Migration[7.1]
  def change
    change_table :simulations do |t|
      t.references :user, foreign_key: true
    end
  end
end
