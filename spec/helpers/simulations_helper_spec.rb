require 'rails_helper'

RSpec.describe SimulationsHelper, type: :helper do
  describe "#format_currency" do
    it "formats a number as a currency with two decimal places" do
      expect(helper.format_currency(10000)).to eq("$10,000.00")
    end
  end
end
