# BookLogger
[![Integration](https://github.com/BlueSchnauzer/BookLogger/actions/workflows/Integration.yml/badge.svg)](https://github.com/BlueSchnauzer/BookLogger/actions/workflows/Integration.yml) ![Vercel](https://therealsujitk-vercel-badge.vercel.app/?app=book-logger)

## 説明
書籍の検索/登録を行い、
読んだページ数や感想などを記録することで自分好みの本棚を作れる書籍管理アプリです。
https://book-logger-nine.vercel.app/login

TailWind CSSを利用しているため、
PCだけでなくスマホやタブレットでの表示にも対応しています。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/1ca2372b-9d8d-46e2-8855-446c1a348cbd)


## 使い方
アプリの利用にはGoogleアカウントが必要ですが、
Googleアカウントを使用しない場合は、
Emailとパスワードを登録することでアプリの利用が可能です。
(ユーザ認証にはFirebase Authenticationを利用しています)

- 検索
画面右上のプラスアイコンから検索画面を表示できます。
任意の条件を入力し、書誌データを検索できます。
(検索結果はGoogleBooksAPIから取得しています)
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/275db69b-7508-4954-a676-8ba9c73fb103)
<br>
検索結果が表示されたら、
書誌データを選択し、登録を行ってください。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/c15f0232-b655-4242-947d-50869def76e8)
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/6a468894-1757-42d6-bcbb-bf0b42f320b2)

- 編集 
登録した本はステータスに応じて、各画面に表示されます。
登録したばかりの本は「読みたい本」(いわゆる積読)ページに表示されます。
(「登録した本」は登録済みの全ての本が表示されます)
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/0e6a2ccd-d45f-4286-adfd-e618e87189cf)
<bt>
読み進めた本や、過去に読んだ本があれば、一覧から選択し内容を編集できます。
ステータスは自分でも変更可能ですが、
基本的に操作に応じて、自動で書き換わるようになっています。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/39d9c5db-6a93-457e-9a43-23fe7b318962)
<br>
現在読んでいる本は「読んでいる本」ページに表示され、
どこまで読み終わっているかを確認することができます。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/44dac0fe-43b0-4c84-a89e-b489cf9a31a9)
<br>
また、ホーム画面では直近で読んでいる本を見れ、
1週間でどのくらいのページ数を読んだかをグラフで確認することができます。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/65ad400d-3eb3-4b74-8950-4ea87576c7d3)

## 開発
アプリケーションの構成図は以下の通りです。
SvelteKitでフロントエンドとバックエンドの両方を実装し、
認証、書誌データ取得とデータ保存は、
それぞれFirebase Authentication、GoogleBooksAPIとMongoDBを利用しています。

デプロイ環境はVercelで、
Github Actionsでビルドと、ユニット/UIの自動テスト(CI)、
VercelのGithub連携で自動デプロイを行っています(CD)。
![image](https://github.com/BlueSchnauzer/BookLogger/assets/116731862/05ac7acd-b55a-435f-afed-d6c89ee12e7d)

### 言語、環境等
- Node.js
- SvelteKit(Svelte, Vite)
  - Reactに対するNext.jsみたいなものです。
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
- [svelte-toast](https://github.com/zerodevx/svelte-toast)
- [Tailanimista](https://tail-animista.vercel.app/)
- [Iconify](https://iconify.design/)
- [Atlas Icons](https://atlasicons.vectopus.com/)
- [icooon-mono](icooon-mono)
- [Phosphor Icons](https://phosphoricons.com/)
- [material-design-icons](https://github.com/google/material-design-icons)
- [fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons)