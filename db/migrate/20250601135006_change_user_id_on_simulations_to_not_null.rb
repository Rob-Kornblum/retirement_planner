class ChangeUserIdOnSimulationsToNotNull < ActiveRecord::Migration[7.1]
  def up
    change_column_null :simulations, :user_id, false
  end

  def down
    change_column_null :simulations, :user_id, true
  end
end
