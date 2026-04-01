# CLAUDE.md — ソロバコ（sorobako.app）

## プロジェクト概要
個人事業主向けの「キャッシュ防衛システム」。freeeより安く軽い取引先管理+請求書+アラートツール。
ユーザー自身のGoogleスプレッドシート（1ファイル8シート）をDBとして使い、サーバーDBは持たない。

- **運営**: FIX-Marketing（じゅん個人事業主）
- **ドメイン**: sorobako.app
- **キャッチコピー**: 「請求漏れ、入金忘れの損失を防ぐ。」
- **料金**: Pro月額¥1,480（税込¥1,628）/ 年払い¥14,800
- **GitHub**: fujimobilelife-dot/sorobako

## 技術スタック
- Next.js 14 (App Router) + TypeScript
- NextAuth.js (Google OAuth)
- googleapis (Google Sheets API)
- Vercel (ホスティング + ドメイン)
- Stripe (未実装)
- メール: info@sorobako.app → Gmail転送（ImprovMX）

## ディレクトリ構成
```
sorobako/
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
├── src/
│   ├── lib/
│   │   └── sheets.ts          # Google Sheets APIヘルパー
│   └── app/
│       ├── layout.tsx          # SessionProvider込み
│       ├── globals.css         # 全CSS（LP+ガイド+法務+ダッシュボード）
│       ├── providers.tsx       # NextAuth SessionProvider
│       ├── page.tsx            # LP（トップページ）
│       ├── guide/page.tsx      # 使い方ガイド
│       ├── terms/page.tsx      # 利用規約
│       ├── privacy/page.tsx    # プライバシーポリシー
│       ├── legal/page.tsx      # 特商法表記
│       ├── dashboard/page.tsx  # ダッシュボード
│       └── api/
│           ├── auth/[...nextauth]/route.ts  # NextAuth設定
│           └── sheets/route.ts              # Sheets APIエンドポイント
```

## 環境変数（.env.local）
```
GOOGLE_CLIENT_ID=（Google Cloud Consoleから取得）
GOOGLE_CLIENT_SECRET=（Google Cloud Consoleから取得）
NEXTAUTH_URL=http://localhost:3000  # 本番: https://sorobako.app
NEXTAUTH_SECRET=（ランダム文字列）
```
※本番はVercelの環境変数に設定する。.env.localはgitにpushしない。

## スプシテンプレート（8シート）
使い方ガイド / 取引先 / 請求書 / 支払い / 経費 / スタッフ / シフト / 給与
- Googleスプシ形式に変換済み（xlsx形式だとSheets APIが使えないため）

## 完了済み
- [x] LP（損失回避訴求、freee比較、料金セクション）
- [x] /terms（利用規約）
- [x] /privacy（プライバシーポリシー）
- [x] /legal（特商法表記）
- [x] /guide（使い方ガイド — スプシの3ステップ説明）
- [x] スプシテンプレート（8シート版）
- [x] メール設定（ImprovMX + MX/SPFレコード）
- [x] ダッシュボード ローカル動作確認済み
  - Google OAuth認証
  - スプシ接続（URL/ID入力→Sheets API読み込み）
  - 売上・経費・粗利表示
  - アラート（14日超過未入金、支払期限超過の自動検知）
  - 請求書一覧・取引先一覧テーブル
- [x] Google Cloud Console: sorobakoプロジェクト、OAuth設定（テストモード）

## TODO（優先順）
1. /guide にダッシュボードの使い方マニュアルを追加
2. ダッシュボード本番デプロイ（Vercel環境変数 + OAuth本番公開）
3. 請求書PDF発行機能
4. Stripe決済連携
5. note記事投稿（下書き: sorobako-note-article.md）
6. SNS拡散戦略

## MVP機能方針
- **やること**: ①アラート ②放置検知 ③催促テンプレート
- **やらないこと**: キャッシュフロー予測、案件別利益管理

## 開発者メモ
- ローカル環境: Windows PC（C:\Users\la555\Downloads\sorobako-v4\sorobako）
- Linux経験は浅い（Ubuntu初）が技術習得は速い
- .env.localはメモ帳だとスペース/アンダースコア誤入力しやすい → PowerShellのSet-Content推奨
- **セキュリティ最優先**: APIキー漏洩対策、.env.local保護、npm installの安全確認を必ず行う

## コーディング規約
- TypeScript strict mode
- App Router（pages routerは使わない）
- CSS Modules は使わず globals.css に集約（現状の方針）
- コミットメッセージは日本語OK