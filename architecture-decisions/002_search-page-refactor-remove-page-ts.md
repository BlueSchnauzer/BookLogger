# ADR-002: 検索ページのアーキテクチャ刷新 — +page.ts 廃止と URL リアクティブ化

## ステータス

承認済み（Accepted）

## コンテキスト

### 現状の問題点

検索ページ（`/search`）は以下の構成になっていた。

```
+page.ts (load) → SearchPromise (関数クロージャ) → +page.svelte → SearchFeature
```

`+page.ts` の load 関数は URL クエリパラメータを解析し、「API を呼ぶ関数（`SearchPromise`）」をそのまま返していた。
コメントにも「実行自体は+page.svelteで行う」と書かれているように、データではなく関数を返すという SvelteKit の設計意図に反する使い方になっていた。

### 引き起こされた副作用

- `SearchPromise` 型（関数型）を複数コンポーネントに受け渡すという不自然な設計になった
- テンプレート式の中で関数を呼び出す構造（`{#await reactiveSearchPromise()}`）が Svelte 5 の
  `state_unsafe_mutation` エラーを引き起こした
- `$derived.by()` で関数を生成し、その関数がテンプレート評価中に `$state` を変更するという
  Svelte 5 のリアクティビティモデルと相性の悪いパターンが生まれた

### 根本原因

`+page.ts` の load 関数を使う必要がそもそもなかった。
検索は Google Books API へのクライアントサイドの fetch であり、`+page.server.ts` も不要。
URL クエリパラメータは `$app/state` の `page` オブジェクトからリアクティブに取得できる。

## 決定

`+page.ts` を廃止し、URL クエリパラメータの解析・`searchProps` 構築を `+page.svelte` に移行する。
`SearchFeature.svelte` は fetcher を直接呼び出す。

### 新しいデータフロー

```
URL 変化（フォーム送信・ページング）
  → page.url.searchParams（$app/state でリアクティブ）
  → $derived で searchProps を構築（+page.svelte）
  → SearchFeature に searchProps だけ渡す
  → $effect で searchType に応じて fetcher を直接呼ぶ
  → searchResultPromise ($state) を更新
  → ResultList が {#await searchResultPromise} で描画
```

## 実装方針

### 削除するファイル

- `src/routes/(app)/search/+page.ts`

### 削除する型

- `src/lib/client/Feature/Search/interface.ts` の `SearchPromise` 型

### 変更するファイル

#### `src/routes/(app)/search/+page.svelte`

`$app/state` の `page` からクエリパラメータを取得し、`$derived` で `searchProps` を構築する。
`+page.ts` が担っていた URL 解析・searchType 判定ロジックをここに移行する。

```svelte
<script lang="ts">
    import { page } from '$app/state';
    import SearchFeature from '...';

    const maxResults = 10;
    const query      = $derived(page.url.searchParams.get('query'));
    const bookTitle  = $derived(page.url.searchParams.get('booktitle'));
    const author     = $derived(page.url.searchParams.get('author'));
    const isbn       = $derived(page.url.searchParams.get('isbn'));
    const pageCount  = $derived(Math.max(0, Number(page.url.searchParams.get('page') ?? 0)));
    const startIndex = $derived(pageCount > 0 ? pageCount * maxResults : 0);

    const searchType = $derived(
        query ? 'fuzzy' : (bookTitle || author || isbn) ? 'detail' : 'none'
    );
    const searchProps = $derived({
        searchType, searchConditions: { query, bookTitle, author, isbn },
        pageCount, startIndex
    });
</script>

<SearchFeature {searchProps} />
```

#### `src/lib/client/Feature/Search/Components/SearchFeature/SearchFeature.svelte`

- `searchPromise` prop を削除
- `searchByFuzzyQuery` / `searchByQueries` を直接 import
- `$effect` 内で `searchProps.searchType` に応じて fetcher を呼び出す

```javascript
$effect(() => {
    const { searchType, searchConditions, startIndex } = searchProps;
    if (searchType === 'none') return;

    isLoading = true;
    const p = searchType === 'fuzzy'
        ? searchByFuzzyQuery(searchConditions.query!, maxResults, startIndex)
        : searchByQueries(
            searchConditions.bookTitle ?? '',
            searchConditions.author ?? '',
            searchConditions.isbn ?? '',
            maxResults, startIndex
          );

    searchResultPromise = p.then(result => {
        isLoading = false;
        resultCount = result.totalCount;
        return result;
    }).catch(err => {
        isLoading = false;
        throw err;
    });
});
```

## 影響範囲

| ファイル | 変更種別 |
|---|---|
| `src/routes/(app)/search/+page.ts` | 削除 |
| `src/routes/(app)/search/+page.svelte` | 全面書き換え |
| `src/lib/client/Feature/Search/Components/SearchFeature/SearchFeature.svelte` | props 変更・$effect 更新 |
| `src/lib/client/Feature/Search/interface.ts` | `SearchPromise` 型を削除 |

`ResultList.svelte` は前回の修正（Promise を受け取る形）のまま変更なし。

## 代替案

### 案B: SvelteKit ストリーミング（+page.ts で Promise を返す）

`+page.ts` を残し、関数ではなく Promise を直接返す方法。
`{#await data.searchResultPromise}` で描画する。

**採用しない理由**: フォーム送信のたびにページナビゲーションが発生し、
`+page.ts` の load が再実行される。SvelteKit の仕組みとしては正しいが、
クライアントサイドのみで完結する処理に load 関数を使う必要性が低い。

## 備考

- `$app/state` の `page` オブジェクトはすでに他画面（`ContentsFeature`、`SideMenu` 等）で使用されており、プロジェクト内の標準的なパターンと一致する
- フォーム送信による URL 変化は SvelteKit がクライアントサイドナビゲーションとして処理するため、`page.url.searchParams` のリアクティビティが正しく動作する
