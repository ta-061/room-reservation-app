class Api::V1::ReservationsController < ApplicationController
  before_action :set_reservation, only: [:destroy]
  ADMIN_PASSWORD = ENV['ADMIN_PASSWORD']  # 環境変数から管理者パスワードを読み込む

  # GET /api/v1/reservations
  def index
    @reservations = Reservation.all
    render json: @reservations
  end

  # POST /reservations
  def create
    @reservation = Reservation.new(reservation_params)

    if overlapping_reservation_exists?
      render json: { error: '指定された時間にはすでに予約があります。' }, status: :unprocessable_entity
    else
      if @reservation.save
        render json: @reservation, status: :created, location: api_v1_reservation_url(@reservation)
      else
        render json: @reservation.errors, status: :unprocessable_entity
      end
    end
  end

  # DELETE /api/v1/reservations/:id
  def destroy
    if params[:password] == ADMIN_PASSWORD || @reservation.authenticate(params[:password])
      @reservation.destroy
      render json: { message: 'Reservation deleted successfully' }, status: :ok
    else
      render json: { error: 'Invalid password' }, status: :unauthorized
    end
  end

  private

  def set_reservation
    @reservation = Reservation.find(params[:id])
  end

  def reservation_params
    params.require(:reservation).permit(:user_name, :classroom_name, :classroom_id, :start_time, :end_time, :password)
  end

  def overlapping_reservation_exists?
    Reservation.where(classroom_id: @reservation.classroom_id)
               .where('start_time < ? AND end_time > ?', @reservation.end_time, @reservation.start_time)
               .exists?
  end

end


