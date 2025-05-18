class SimulationsController < ApplicationController
  before_action :set_simulation, only: [:show, :edit, :update, :destroy]

  # GET /simulations or /simulations.json
  def index
    @simulations = Simulation.all
    respond_to do |format|
      format.html
      format.json { render json: @simulations }
    end
  end

  # GET /simulations/:id or /simulations/:id.json
  def show
    respond_to do |format|
      format.html
      format.json do
        presenter = SimulationPresenter.new(@simulation, view_context)
        render json: {
          simulation: @simulation,
          statistics: @simulation.simulation_statistics,
          formatted_statistics: presenter.formatted_statistics
        }
      end
    end
  end

  # GET /simulations/new
  def new
    @simulation = Simulation.new
  end

  # POST /simulations or /simulations.json
  def create
    @simulation = Simulation.new(simulation_params)
    respond_to do |format|
      if @simulation.save
        format.html { redirect_to simulation_path(@simulation), notice: 'Simulation created successfully!' }
        format.json { render json: @simulation, status: :created }
      else
        format.html { render :new }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /simulations/:id/edit
  def edit
  end

  # PATCH/PUT /simulations/:id or /simulations/:id.json
  def update
    respond_to do |format|
      if @simulation.update(simulation_params)
        format.html { redirect_to simulation_path(@simulation), notice: 'Simulation updated successfully!' }
        format.json { render json: @simulation, status: :ok }
      else
        format.html { render :edit }
        format.json { render json: @simulation.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /simulations/:id
  def destroy
    @simulation.destroy
    redirect_to simulations_path, notice: 'Simulation was successfully deleted.'
  end

  private

  def set_simulation
    @simulation = Simulation.find(params[:id])
  end

  def simulation_params
    params.require(:simulation).permit(:initial_investment, :annual_contribution, :expected_return, :volatility, :investment_period)
  end
end
