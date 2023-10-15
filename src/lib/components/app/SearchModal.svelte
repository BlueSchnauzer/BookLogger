<script lang="ts">
	import Icon from "@iconify/svelte";
    import FullCoverZindex10 from "../parts/FullCoverZindex10.svelte";

    export let isDisplay = false;
	const colorStone700 = '#44403C';

    const closeModal = () => isDisplay = !isDisplay;
</script>

<FullCoverZindex10 bind:isDisplay={isDisplay} isUseBackGroundColor={true}>
    <div class="z-20 flex flex-col fixed w-4/5 h-4/5 max-w-[700px] max-h-[500px] m-auto inset-0 px-3 bg-vellum rounded-lg">
        <div class="h-14 flex flex-row justify-between items-center">
            <span class="text-xl">書籍追加</span>
            <button on:click={closeModal}
                class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
            >
                <Icon icon="ph:x" width="36" height="36" color={colorStone700} />
            </button>
        </div>
        <span class="bg-stone-400 h-[1px]"></span>
        <div class="flex-1">
            <ul class="p-2">
                <li class="flex justify-between items-center mb-2">
                    <span>タイトル</span>
                    <input class="px-2 py-1 rounded-lg" name="bookTitle" type="text" size="20">
                </li>
                <li class="flex justify-between items-center mb-2">
                    <span>著者名</span>
                    <input class="px-2 py-1 rounded-lg" name="author" type="text" size="20">
                </li>
                <li class="flex justify-between items-center mb-2">
                    <span>ISBN(13桁)</span>
                    <input class="px-2 py-1 rounded-lg" name="isbn" type="text" size="20">
                </li>
            </ul>
        </div>
        <span class="bg-stone-400 h-[1px]"></span>
        <div class="h-14 flex flex-row justify-end items-center">
            <button class="w-24 h-8 mr-1 bg-lime-700 text-gray-50 rounded hover:bg-lime-600">検索</button>
            <button class="w-24 h-8 bg-gray-50 text-lime-700 border border-lime-700 rounded hover:bg-gray-100" on:click={closeModal}>キャンセル</button>
        </div>
    </div>    
</FullCoverZindex10>