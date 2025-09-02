# CLAUDE.md

このファイルは、このリポジトリでコードを操作する際のClaude Code (claude.ai/code) への指針を提供します。

## プロジェクト概要

BookLoggerは、ユーザーが書籍を検索・登録し、読書の進捗を追跡できるSvelteKitベースの書籍管理アプリケーションです。Firebase Authentication、Google Books API、MongoDBと連携してデータを保存します。

## 開発コマンド

### 基本的な開発
- `npm run dev` - ホットリロード付きの開発サーバーを起動
- `npm run build` - 本番用にアプリケーションをビルド
- `npm run preview` - 本番ビルドをローカルでプレビュー

### コード品質
- `npm run check` - Svelteの型チェックを実行
- `npm run check:watch` - 型チェックをウォッチモードで実行
- `npm run lint` - ESLintとPrettierのチェックを実行
- `npm run format` - Prettierでコードを自動フォーマット

### テスト
- `npm run test` または `npm run test:unit` - Vitestでユニットテストを実行
- `npm run test:unit:watch` - ユニットテストをウォッチモードで実行
- `npm run test:ui` - PlaywrightでUIテストを実行
- `npm run test:ui:debug` - デバッグUIでPlaywrightテストを実行

### Docker
- ビルド: `docker build -t booklogger .`
- 実行: `docker run -p 3000:3000 booklogger`

## アーキテクチャ

### 技術スタック
- **フロントエンド**: SvelteKit with TypeScript
- **スタイリング**: Tailwind CSS
- **認証**: Firebase Authentication
- **データベース**: MongoDB
- **外部API**: Google Books API
- **テスト**: Vitest (ユニット), Testing Library, Playwright (E2E)
- **デプロイ**: Vercel

### ディレクトリ構成

```
src/
├── lib/
│   ├── client/Feature/           # 機能ベースのクライアントモジュール
│   │   ├── Auth/                 # Firebase認証統合
│   │   ├── Collections/          # 書籍コレクション管理
│   │   │   └── Domain/Entities/  # ドメインエンティティ (BookShelf等)
│   │   └── Contents/             # 書籍コンテンツ管理
│   │       ├── Components/       # Svelteコンポーネント
│   │       └── DataManage/       # データレイヤーロジック
│   └── server/                   # サーバーサイドユーティリティとAPIロジック
└── routes/
    ├── (app)/                    # メインアプリケーションルート（保護済み）
    │   ├── books/                # 書籍一覧ページ
    │   ├── home/                 # ダッシュボード/ホームページ
    │   ├── search/               # 書籍検索機能
    │   └── shelf/                # ユーザーの本棚
    └── (auth)/                   # 認証ルート
```

### 主要コンセプト

1. **機能ベースアーキテクチャ**: コードは技術レイヤーではなく機能（Auth、Collections、Contents）で整理
2. **ルートグループ**: レイアウト整理のためにSvelteKitルートグループ`(app)`と`(auth)`を使用
3. **ドメインエンティティ**: ビジネスロジックをCollections/Domain/Entities配下のドメインエンティティに分離
4. **コンポーネントテスト**: コンポーネントテストにVitestとTesting Library、E2EテストにPlaywrightを使用

### 認証フロー
- Firebase Authenticationがユーザーセッションを処理
- SvelteKitレイアウトによるルート保護を実装
- Google OAuthとメール/パスワード認証をサポート

### データ管理
- MongoDBによる永続ストレージ
- Google Books APIによる書籍メタデータ
- Svelteストアによるクライアントサイド状態管理
- テスト用メモリサーバー（mongodb-memory-server）を使用

## 開発ノート

### テスト設定
- ユニットテストはjsdom環境でVitestを使用
- UIテストはDB接続のため3回リトライと10秒タイムアウトを設定
- コンポーネントテストは`.test.ts`サフィックスでコンポーネントと並置
- E2Eテストは`/tests`ディレクトリに`.spec.ts`サフィックスで配置

### ビルドプロセス
- TypeScriptストリクトモードを有効
- コード品質のためのESLint with Svelteプラグイン
- コードフォーマットのためのPrettier
- バンドリングと開発サーバーのためのVite

### 環境設定
- 環境変数用の`.env`ファイルを使用（Firebase設定、MongoDB接続、APIキー）
- Firebase、MongoDB、Google Books API統合に必要な環境変数

## デプロイ
- GitHubからの自動デプロイでVercelにデプロイ
- ビルドとテスト自動化のためのGitHub Actions CI/CD
- `svelte.config.js`でVercelアダプターを設定