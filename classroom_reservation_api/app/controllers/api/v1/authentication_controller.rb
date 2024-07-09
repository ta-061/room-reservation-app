class Api::V1::AuthenticationController < ApplicationController
  SECRET_PASSWORD = ENV['SECRET_PASSWORD'] # 環境変数から合言葉を読み込む

  def authenticate
    if params[:password] == SECRET_PASSWORD
      render json: { message: 'Authenticated' }, status: :ok
    else
      render json: { error: 'Invalid password' }, status: :unauthorized
    end
  end
end
