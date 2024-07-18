# room-reservation-app
# 教室予約システム

このリポジトリは、教室予約システムのフロントエンド（Next.js）とバックエンド（Ruby on Rails）を含んでいます。

## プロジェクト構成
room-reservation-app/
├── classroom-reservation-client # Next.jsプロジェクト
│ ├── package.json
│ ├── next.config.js
│ ├── src/
│ └── ... (その他のNext.jsプロジェクトファイル)
└── classroom_reservation_api # Railsプロジェクト
├── Gemfile
├── config/
├── app/
└── ... (その他のRailsプロジェクトファイル)

## 環境設定

### フロントエンド (Next.js)

1. リポジトリをクローンします:

    ```sh
    git clone https://github.com/ta-061/room-reservation-app.git
    cd room-reservation-app/classroom-reservation-client
    ```

2. 依存関係をインストールします:

    ```sh
    npm install
    ```

3. 環境変数を設定します:

    プロジェクトのルートディレクトリに`.env.local`ファイルを作成し、以下の内容を追加します:

    ```plaintext
    NEXT_PUBLIC_API_URL=https://your-production-api-url.com
    ```

4. 開発サーバーを起動します:

    ```sh
    npm run dev
    ```

### バックエンド (Ruby on Rails)

1. リポジトリをクローンします:

    ```sh
    git clone https://github.com/ta-061/room-reservation-app.git
    cd room-reservation-app/classroom_reservation_api
    ```

2. 依存関係をインストールします:

    ```sh
    bundle install
    ```

3. データベースを設定します:

    ```sh
    rails db:create
    rails db:migrate
    ```

4. 環境変数を設定します:

    プロジェクトのルートディレクトリに`.env`ファイルを作成し、以下の内容を追加します:

    ```plaintext
    ADMIN_PASSWORD=your_admin_password
    SECRET_PASSWORD=your_secret_password
    FRONTEND_URL=https://your-production-frontend-url.com
    ```

5. 開発サーバーを起動します:

    ```sh
    rails server
    ```

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
