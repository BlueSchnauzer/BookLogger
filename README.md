# BookLogger
[![Integration](https://github.com/BlueSchnauzer/BookLogger/actions/workflows/Integration.yml/badge.svg)](https://github.com/BlueSchnauzer/BookLogger/actions/workflows/Integration.yml) ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=book-logger)

## 説明
書籍の検索/登録を行い、  
読んだページ数や感想などを記録することで自分好みの本棚を作れる書籍管理アプリです。  
https://book-logger-nine.vercel.app/login

TailWind CSSでレスポンシブに実装しているため、  
PCだけでなくスマホやタブレットでの表示にも対応しています。  
- PC表示  
![スクリーンショット 2023-12-13 220038](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/d1de970c-23d7-45ce-af0f-f01192df2eac)
- スマホ、タブレット表示  
(メニューの切り替え、コンテンツ一覧のレスポンシブ対応など)
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/0d572132-ab6a-4679-a48b-f224d34ad841)

## 📗 使い方
アプリの利用にはGoogleアカウントが必要ですが、  
Googleアカウントを使用しない場合は、Emailとパスワードを登録することでアプリの利用が可能です。  
(ユーザ認証にはFirebase Authenticationを利用しています)  

### 🔍 検索  
画面右上のプラスアイコンから検索画面を表示できます。  
任意の条件を入力し、書誌データを検索できます。  
(検索結果はGoogleBooksAPIから取得しています)  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/275db69b-7508-4954-a676-8ba9c73fb103)  

検索結果が表示されたら、書誌データを選択し登録を行ってください。  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/c15f0232-b655-4242-947d-50869def76e8)  
<br>
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/6a468894-1757-42d6-bcbb-bf0b42f320b2)  

### 🖊️ 編集  
登録した本はステータスに応じて、各画面に表示されます。  
登録したばかりの本は「読みたい本」(いわゆる積読です)ページに表示されます。  
(「登録した本」は登録済みの全ての本が表示されます)
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/0e6a2ccd-d45f-4286-adfd-e618e87189cf)  
<br>
読み進めた本や、過去に読んだ本があれば、一覧から選択し内容を編集できます。  
ステータスは自分でも変更可能ですが、  
基本的に操作に応じて、自動で書き換わるようになっています。  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/9b87a78b-beda-4866-803d-553cce36d210)

### 📖 管理  
現在読んでいる本は「読んでいる本」ページに表示され、  
どこまで読み終わっているかを、一目で確認することができます。  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/44dac0fe-43b0-4c84-a89e-b489cf9a31a9)  
<br>
また、ホーム画面では直近で読んでいる本を見れ、  
1週間でどのくらいのページ数を読んだかをグラフで確認することができます。  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/65ad400d-3eb3-4b74-8950-4ea87576c7d3)  

## 🔧 開発
アプリケーションの構成図は以下の通りです。  
SvelteKitでアプリを実装し、  
ユーザ認証、書誌データ取得とデータ保存は、  
それぞれFirebase Authentication、GoogleBooksAPIとMongoDBを利用しています。  
<br>
デプロイ環境はVercelで、  
Github Actionsでビルドと、ユニット/UIの自動テスト(CI)、  
VercelのGithub連携で自動デプロイを行っています(CD)。  
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/05ac7acd-b55a-435f-afed-d6c89ee12e7d)  
<br>
SvelteKit(Reactに対するNext.jsみたいなものです)を利用しているため、  
フロントエンドはSvelteのUIコンポーネントと、SvelteKitのルーティング機能を使うことで実装し、  
サーバーサイドも同様に、SvelteKitのサーバーロジックとAPIルートを使うことで実装しています。  
(Vitest、Testing-LibraryとPlaywrightを利用して、コンポーネント、ユニットとUIのテストコードを作成しています)  

### 使用技術
- Node.js
- SvelteKit(Svelte, Vite)
- Typescript
- Tailwind CSS
- Firebase Authentication
- MongoDB
- Vitest
- Testing-Library
- PlayWright

### 利用ライブラリ、API等
- [GoogleBooksAPI](https://developers.google.com/books?hl=ja)
- [SimpleBar](https://github.com/Grsmto/simplebar)
- [nprogress](https://github.com/rstacruz/nprogress)
- [svelte-toast](https://github.com/zerodevx/svelte-toast)
- [Tailanimista](https://tail-animista.vercel.app/)
- [Chart.js](https://www.chartjs.org/)
- [jsdom](https://github.com/jsdom/jsdom)
- [mongodb-memory-server](https://nodkz.github.io/mongodb-memory-server/)
- [Iconify](https://iconify.design/)
- [Atlas Icons](https://atlasicons.vectopus.com/)
- [icooon-mono](https://icooon-mono.com/)
- [Phosphor Icons](https://phosphoricons.com/)
- [material-design-icons](https://github.com/google/material-design-icons)
- [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons)
- [DEVICON](https://devicon.dev/)
