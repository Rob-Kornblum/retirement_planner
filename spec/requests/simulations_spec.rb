require 'rails_helper'

RSpec.describe "Simulations", type: :request do
  describe "GET /new" do
    it "returns http success" do
      get "/simulations/new"
      expect(response).to have_http_status(:success)
    end
  end
end
