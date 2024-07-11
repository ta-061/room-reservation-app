Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :reservations, only: [:index, :create, :destroy]
      post 'authenticate', to: 'authentication#authenticate'
    end
  end
  # すべての他のリクエストに対して404を返す
  match '*path', to: 'application#route_not_found', via: :all
end
