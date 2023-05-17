## serverless-express-vue-app

## config

- dynamodb.session.cookie.maxAge: 7 days(24h × 60m × 60s × 1000ms)

## development

- ローカル環境でサーバーレスアプリケーションとして立ち上げる場合
  - `.env`の`REDIRECT_URI=https://example.com/localdev/auth/callback`にする

## 課題

- redirect_uris に登録する uri が API Gateway を Deploy してからでないと判明しない
  - 暫定対応：PoC 環境なので雑に 2 回 Deploy する（1 回目の Deploy 時には適当な redirect_uri を指定して、2 回目の Deploy でそれを上書きする）
