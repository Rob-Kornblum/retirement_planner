module SimulationsHelper
  def format_currency(value)
    number_to_currency(value, precision: 2)
  end
end
