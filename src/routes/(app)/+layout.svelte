<script lang="ts">
    import type { LayoutData } from '../$types';
    
    export let data: LayoutData;
</script>

<nav>
    <a href="/dashboard">ダッシュボード</a>
    <a href="/books">登録した本</a>
    <a href="/books/wish">読みたい本</a>
    <a href="/books/reading">読んでいる本</a>
    <a href="/books/complete">読み終わった本</a>
</nav>

<slot></slot>