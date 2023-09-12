<script lang="ts">
    import type { LayoutData } from '../$types';
    
    export let data: LayoutData;

    interface listItem {
        ref: string,
        name: string
    }

    const listItems: listItem[] = [
        { ref: "/dashboard", name: "ダッシュボード" },
        { ref: "/books", name: "登録した本" },
        { ref: "/books/wish", name: "読みたい本"},
        { ref: "/books/reading", name: "読んでいる本"},
        { ref: "/books/complete", name: "読み終わった本"},
        { ref: "/shelfs", name: "本棚"}
    ];

</script>

<nav>
    <div>
        <p>アプリ名</p>
    </div>
    <ul>
        {#each listItems as item}
            <li>
                <a href="{item.ref}">{item.name}</a>
            </li>
        {/each}
    </ul>
</nav>

<slot></slot>