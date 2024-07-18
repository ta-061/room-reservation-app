# room-reservation-app
# 教室予約システム

このリポジトリは、教室予約システムのフロントエンド（Next.js）とバックエンド（Ruby on Rails）を含んでいます。

### フロントエンド (Next.js)
### バックエンド (Ruby on Rails)


## デプロイ

### Renderでのデプロイ

1. Renderにログインし、ダッシュボードから新しいWebサービスを作成します。
2. リポジトリのURLを指定し、以下の設定を行います:

    - **Root Directory**: `classroom_reservation_api`（Railsバックエンド）または`classroom-reservation-client`（Next.jsフロントエンド）
    - **Build Command**: `bundle install`（Railsバックエンド）または`npm run build`（Next.jsフロントエンド）
    - **Start Command**: `bundle exec rails server -p $PORT`（Railsバックエンド）
    - **Publish Directory**: `.next`（Next.jsフロントエンド）

3. 環境変数を設定します。

### CORS設定の更新

RailsバックエンドでフロントエンドのURLをCORS設定に追加します。

#### `config/initializers/cors.rb`

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['FRONTEND_URL']

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['access-token', 'expiry', 'token-type', 'uid', 'client'],
      max_age: 600
  end
end
