<script lang="ts">
    import FullCoverZindex10 from "../parts/FullCoverZindex10.svelte";

    export let isDisplay = false;

</script>

<FullCoverZindex10 bind:isDisplay={isDisplay} isHiddenByOnclick={true} isUseBackGroundColor={true}>
    <div class="z-20 opacity-100 flex flex-row fixed w-4/5 h-4/5 m-auto inset-0 bg-stone-300 rounded-lg">
        <div>
            <span>書籍追加</span>
        </div>
        <div>
            <ul>
                <li>
                    <span>タイトル</span>
                    <input type="text">
                </li>
                <li>
                    <span>著者名</span>
                    <input type="text">
                </li>
                <li>
                    <span>ISBN(13桁)</span>
                    <input type="text">
                </li>
            </ul>
        </div>
        <div>
            <button>検索</button>
            <button>キャンセル</button>
        </div>
    </div>    
</FullCoverZindex10>