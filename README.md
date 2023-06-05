## serverless-express-vue-app

## config

- dynamodb.session.cookie.maxAge: 7 days(24h × 60m × 60s × 1000ms)

## development

- ローカル環境でサーバーレスアプリケーションとして立ち上げる場合
  - `.env`の`REDIRECT_URI=https://example.com/localdev/auth/callback`にする

## test

### on local

- Google のクライアント情報の`承認済みの JavaScript 生成元`と`承認済みのリダイレクト URI`にそれぞれ以下を設定
  - 承認済みの JavaScript 生成元：https://localhost
  - 承認済みのリダイレクト URI：https://localhost/auth/callback
- `.env`の以下の値を以下のようにする
  - REDIRECT_URI=https://localhost/auth/callback

## 課題

- redirect_uris に登録する uri が API Gateway を Deploy してからでないと判明しない
  - 暫定対応：PoC 環境なので雑に 2 回 Deploy する（1 回目の Deploy 時には適当な redirect_uri を指定して、2 回目の Deploy でそれを上書きする）
