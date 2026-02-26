# ADR-001: Svelte 5 Runes 段階的移行計画

## ステータス

提案済み（Proposed）

## コンテキスト

Svelte 5へのアップグレード後、runesモードへの段階的移行を行う。
画面単位で1つずつ移行し、移行済みと未移行が共存できる状態を維持する。

## 決定

10フェーズに分けて段階的にSvelte 5 runesへ移行する。

## 現状分析

### プロジェクト構成

| 領域              | ファイル数 | 移行対象構文                                       |
| ----------------- | ---------- | -------------------------------------------------- |
| Feature/Contents  | 12個       | export let: 26, $:: 3, let: 9, lifecycle: 10       |
| Feature/Search    | 9個        | export let: 28, $:: 1, let: 11, lifecycle: 1       |
| Shared Components | 20個       | export let: 46, $:: 3, dispatcher: 2, lifecycle: 2 |
| Routes (Pages)    | 16個       | export let: 9, $:: 3, lifecycle: 5                 |
| **合計**          | **57個**   |                                                    |

### Feature別の複雑度

```
Feature/Contents (12ファイル) - 複雑度: 高
├── ContentsFeature.svelte      [高] onMount, Context API
├── ContentsGrid.svelte         [高] SimpleBar, afterNavigate
├── ContentsFilter.svelte       [高] onMount, イベントリスナー
├── DetailEdit.svelte           [高] 複数子要素, ストア連携
├── ContentDetail.svelte        [中] ストア連携
├── DetailInfo.svelte           [低] propsのみ
├── GridItem.svelte             [低] propsのみ
├── PagingLabel.svelte          [低] propsのみ
├── StatusLabel.svelte          [低] propsのみ
├── PageCountEdit.svelte        [中] 状態管理
├── PageHistoryEdit.svelte      [中] 状態管理
└── ContentsMenu.svelte         [低] propsのみ

Feature/Search (9ファイル) - 複雑度: 中
├── SearchFeature.svelte        [中] $:リアクティブ, 状態管理
├── ConditionModal.svelte       [中] フォーム状態
├── ItemModal.svelte            [中] 非同期処理
├── ResultList.svelte           [低] await構文
├── ListItem.svelte             [低] propsのみ
├── ItemDetail.svelte           [低] propsのみ
├── ConditionInput.svelte       [低] propsのみ
├── PagingLabel.svelte          [低] propsのみ
└── FormLabel.svelte            [低] propsのみ

Shared Components (20ファイル) - 複雑度: 低〜中
├── ModalBase.svelte            [中] $:, onMount, dialog API
├── PrimaryButton.svelte        [低] createEventDispatcher
├── SecondaryButton.svelte      [低] createEventDispatcher
├── SideMenu.svelte             [低] $:
├── BottomMenu.svelte           [低] $:
├── その他UI (15個)             [低] propsのみ
```

## 移行戦略

### 前提条件

1. **runesモードの有効化方法**

   - `svelte.config.js` に設定追加は**不要**
   - 各ファイルの先頭に `<script lang="ts">` の代わりに以下を記述:

   ```svelte
   <script lang="ts" runes>
   ```

   - または、ファイル単位で移行する場合は従来通りでOK（Svelte 5はlegacyモードをサポート）

2. **共存可能性**
   - Svelte 5はlegacyモード（Svelte 4構文）とrunesモードを**混在可能**
   - 親コンポーネントがlegacy、子がrunesでも動作する
   - 逆も同様

### 構文変換ルール

| Svelte 4                | Svelte 5 (runes)                 | 備考             |
| ----------------------- | -------------------------------- | ---------------- |
| `export let prop`       | `let { prop } = $props()`        | 型定義も移行     |
| `let state = value`     | `let state = $state(value)`      | リアクティブ状態 |
| `$: derived = expr`     | `const derived = $derived(expr)` | 派生値           |
| `$: { sideEffect }`     | `$effect(() => { sideEffect })`  | 副作用           |
| `onMount(() => {})`     | `$effect(() => {})`              | 初期化処理       |
| `onDestroy(() => {})`   | `$effect`の戻り値                | クリーンアップ   |
| `createEventDispatcher` | callback props                   | イベント発行     |

---

## 移行フェーズ

### Phase 1: 基盤準備（Shared Components - ボタン類）

**目標**: 最もシンプルで依存される共有コンポーネントから開始
**期間目安**: 1日

#### 対象ファイル (3個)

1. `src/lib/client/Shared/Components/PrimaryButton.svelte`
2. `src/lib/client/Shared/Components/SecondaryButton.svelte`
3. `src/lib/client/Shared/Components/ToggleSwitch.svelte`

#### 変更内容

- `export let` → `$props()`
- `createEventDispatcher` → callback props

#### 検証

```bash
npm run check
npm run test:unit
```

---

### Phase 2: Shared Components - UI部品

**目標**: 依存関係の少ないUI部品を移行
**期間目安**: 1-2日

#### 対象ファイル (7個)

1. `src/lib/client/Shared/Components/CategoryLabel.svelte`
2. `src/lib/client/Shared/Components/FullCoverLoader.svelte`
3. `src/lib/client/Shared/Components/Headers/ContentHeader.svelte`
4. `src/lib/client/Shared/Components/Toast/NotificationToast.svelte`
5. `src/lib/client/Shared/Components/Toast/MainToast.svelte`
6. `src/lib/client/Shared/Components/Menus/SideMenu.svelte`
7. `src/lib/client/Shared/Components/Menus/BottomMenu.svelte`

#### 変更内容

- `export let` → `$props()`
- `$:` → `$derived()`

---

### Phase 3: Shared Components - ModalBase

**目標**: モーダルの基盤コンポーネントを移行
**期間目安**: 1日

#### 対象ファイル (1個)

1. `src/lib/client/Shared/Components/ModalBase.svelte`

#### 変更内容

- `export let` → `$props()` + `$bindable()`
- `$:` → `$derived()` / `$effect()`
- `onMount` → `$effect()`

#### 注意点

- `bind:isDisplay` を使用している親コンポーネントがあるため、`$bindable()` が必要

---

### Phase 4: Feature/Search - シンプルなコンポーネント

**目標**: Search機能の末端コンポーネントから移行
**期間目安**: 1日

#### 対象ファイル (5個)

1. `src/lib/client/Feature/Search/Components/ResultList/ListItem.svelte`
2. `src/lib/client/Feature/Search/Components/ItemModal/ItemDetail.svelte`
3. `src/lib/client/Feature/Search/Components/ConditionModal/ConditionInput.svelte`
4. `src/lib/client/Feature/Search/Components/SearchFeature/PagingLabel.svelte`
5. `src/lib/client/Feature/Search/Components/SearchFeature/FormLabel.svelte`

---

### Phase 5: Feature/Search - メインコンポーネント

**目標**: Search機能の主要コンポーネントを移行
**期間目安**: 2-3日

#### 対象ファイル (4個)

1. `src/lib/client/Feature/Search/Components/ResultList/ResultList.svelte`
2. `src/lib/client/Feature/Search/Components/ConditionModal/ConditionModal.svelte`
3. `src/lib/client/Feature/Search/Components/ItemModal/ItemModal.svelte`
4. `src/lib/client/Feature/Search/Components/SearchFeature/SearchFeature.svelte`

#### 変更内容

- `let` (状態) → `$state()`
- `$:` → `$derived()` / `$effect()`

---

### Phase 6: Feature/Contents - シンプルなコンポーネント

**目標**: Contents機能の末端コンポーネントから移行
**期間目安**: 1日

#### 対象ファイル (5個)

1. `src/lib/client/Feature/Contents/Components/ContentsGrid/GridItem.svelte`
2. `src/lib/client/Feature/Contents/Components/ContentsGrid/StatusLabel.svelte`
3. `src/lib/client/Feature/Contents/Components/ContentsGrid/PagingLabel.svelte`
4. `src/lib/client/Feature/Contents/Components/ContentDetail/DetailInfo.svelte`
5. `src/lib/client/Feature/Contents/Components/ContentsMenu/ContentsMenu.svelte`

---

### Phase 7: Feature/Contents - 詳細編集コンポーネント

**目標**: 書籍詳細編集関連のコンポーネントを移行
**期間目安**: 2-3日

#### 対象ファイル (4個)

1. `src/lib/client/Feature/Contents/Components/ContentDetail/PageCountEdit.svelte`
2. `src/lib/client/Feature/Contents/Components/ContentDetail/PageHistoryEdit.svelte`
3. `src/lib/client/Feature/Contents/Components/ContentDetail/DetailEdit.svelte`
4. `src/lib/client/Feature/Contents/Components/ContentDetail/ContentDetail.svelte`

#### 注意点

- `bookInfoStore` との連携を維持
- ストアの`$store`構文は継続サポート

---

### Phase 8: Feature/Contents - メインコンポーネント

**目標**: Contents機能の主要コンポーネントを移行（最も複雑）
**期間目安**: 3-4日

#### 対象ファイル (3個)

1. `src/lib/client/Feature/Contents/Components/ContentsFilter/ContentsFilter.svelte`
2. `src/lib/client/Feature/Contents/Components/ContentsGrid/ContentsGrid.svelte`
3. `src/lib/client/Feature/Contents/Components/ContentsFeature/ContentsFeature.svelte`

#### 注意点

- `onMount` でのイベントリスナー管理 → `$effect` + cleanup
- `afterNavigate` は変更不要（SvelteKit API）
- `SimpleBar`, `ResizeObserver` は外部ライブラリのため変更不要

---

### Phase 9: Routes - 認証ページ

**目標**: 認証関連ページを移行
**期間目安**: 1日

#### 対象ファイル (4個)

1. `src/routes/(auth)/+layout.svelte`
2. `src/routes/(auth)/AuthMenu.svelte`
3. `src/routes/(auth)/login/+page.svelte`
4. `src/routes/(auth)/register/+page.svelte`

---

### Phase 10: Routes - アプリページ

**目標**: メインアプリケーションページを移行
**期間目安**: 2-3日

#### 対象ファイル (10個)

1. `src/routes/(app)/+layout.svelte`
2. `src/routes/(app)/books/+page.svelte`
3. `src/routes/(app)/books/[id]/+page.svelte`
4. `src/routes/(app)/books/reading/+page.svelte`
5. `src/routes/(app)/books/complete/+page.svelte`
6. `src/routes/(app)/books/wish/+page.svelte`
7. `src/routes/(app)/search/+page.svelte`
8. `src/routes/(app)/shelf/+page.svelte`
9. `src/routes/(app)/home/+page.svelte` ← 最も複雑（Chart.js統合）
10. `src/routes/+layout.svelte`

---

## 実装時の確認事項

### 各Phase完了時の検証

```bash
# 型チェック
npm run check

# ユニットテスト
npm run test:unit

# ビルド確認
npm run build
```

### 移行パターン例

#### Before (Svelte 4)

```svelte
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let text: string;
	export let isActive = false;

	let count = 0;
	$: doubled = count * 2;

	const dispatch = createEventDispatcher();

	onMount(() => {
		console.log('mounted');
		return () => console.log('destroyed');
	});
</script>
```

#### After (Svelte 5 runes)

```svelte
<script lang="ts">
	interface Props {
		text: string;
		isActive?: boolean;
		onclick?: () => void;
	}

	let { text, isActive = false, onclick }: Props = $props();

	let count = $state(0);
	const doubled = $derived(count * 2);

	$effect(() => {
		console.log('mounted');
		return () => console.log('destroyed');
	});
</script>
```

---

## タイムライン概要

| Phase    | 内容                | ファイル数 | 期間目安      |
| -------- | ------------------- | ---------- | ------------- |
| 1        | Shared - ボタン類   | 3          | 1日           |
| 2        | Shared - UI部品     | 7          | 1-2日         |
| 3        | Shared - ModalBase  | 1          | 1日           |
| 4        | Search - シンプル   | 5          | 1日           |
| 5        | Search - メイン     | 4          | 2-3日         |
| 6        | Contents - シンプル | 5          | 1日           |
| 7        | Contents - 詳細編集 | 4          | 2-3日         |
| 8        | Contents - メイン   | 3          | 3-4日         |
| 9        | Routes - 認証       | 4          | 1日           |
| 10       | Routes - アプリ     | 10         | 2-3日         |
| **合計** |                     | **57**     | **約15-20日** |

---

## 結果

この計画に基づいて段階的に移行を実施する。

## 参考

- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/runes)
