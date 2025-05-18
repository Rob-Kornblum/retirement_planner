class SimulationPresenter
  def initialize(simulation, view_context)
    @simulation = simulation
    @view = view_context
  end

  def raw_statistics
    @simulation.simulation_statistics
  end

  def formatted_statistics
    raw_statistics.each_with_object({}) do |(key, value), hash|
      hash[key] = format_value(value)
    end
  end

  def statistics_rows
    formatted_statistics.map do |key, formatted_value|
      [labelize(key), formatted_value]
    end
  end

  def to_json(*_args)
    formatted_statistics.to_json
  end

  private

  attr_reader :simulation, :view

  def format_value(value)
    if value.is_a?(Numeric)
      view.number_to_currency(value)
    else
      value.to_s
    end
  end

  def labelize(key)
    key.to_s.humanize
  end
end
