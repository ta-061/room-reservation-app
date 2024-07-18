class Api::V1::AuthenticationController < ApplicationController
  SECRET_PASSWORD = ENV['SECRET_PASSWORD'] # 環境変数から合言葉を読み込む

  def authenticate
    if params[:password] == SECRET_PASSWORD
      Rails.logger.debug "SECRET_PASSWORD: #{SECRET_PASSWORD.inspect}"
      Rails.logger.debug "Params password: #{params[:password].inspect}"
      
      render json: { message: 'Authenticated' }, status: :ok
    else
      render json: { error: 'Invalid password' }, status: :unauthorized
    end
  end
end
