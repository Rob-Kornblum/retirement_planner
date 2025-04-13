class SimulationsController < ApplicationController
  before_action :set_simulation, only: [:show, :edit, :update, :destroy]

  def new
    @simulation = Simulation.new
  end

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

  def show
  end

  def index
    @simulations = Simulation.all
  end

  def destroy
    @simulation.destroy
    redirect_to simulations_path, notice: 'Simulation was successfully deleted.'
  end

  def edit
  end

  def update
    if @simulation.update(simulation_params)
      redirect_to simulation_path(@simulation), notice: 'Simulation updated successfully!'
    else
      render :edit
    end
  end

  private

  def set_simulation
    @simulation = Simulation.find(params[:id])
    unless @simulation
      redirect_to simulations_path, alert: 'Simulation not found.'
    end
  end

  def simulation_params
    params.require(:simulation).permit(:initial_investment, :annual_contribution, :expected_return, :volatility, :investment_period)
  end
end
