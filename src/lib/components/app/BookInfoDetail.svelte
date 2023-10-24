<script lang="ts">
	import Icon from "@iconify/svelte";
    import FullCoverZindex30 from "../parts/FullCoverZindex30.svelte";
	import PrimalyButton from "../parts/PrimalyButton.svelte";
	import SecondaryButton from "../parts/SecondaryButton.svelte";
	import type { books_v1 } from "googleapis";

    export let isDisplay = false;
    export let isRegister = true;
    export let action = '';
    export let item: books_v1.Schema$Volume = {};
	const colorStone700 = '#44403C';

    /**モーダルを閉じて初期化*/
    const closeModal = () => {
        isDisplay = !isDisplay;
    };

</script>

<FullCoverZindex30 bind:isDisplay={isDisplay} isUseBackGroundColor={true}>
    <form action={action} >
        <div class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[700px] max-h-[500px] m-auto inset-0 px-3 bg-vellum rounded-lg">
            <div class="h-14 flex flex-row justify-between items-center">
                <span class="text-xl">書籍登録</span>
                <button type="button" on:click={closeModal}
                    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
                >
                    <Icon icon="ph:x" width="36" height="36" color={colorStone700} />
                </button>
            </div>
            <span class="bg-stone-400 h-[1px]"></span>
            <div class="flex-1">
                {#if item.volumeInfo?.imageLinks?.thumbnail}
                    <img
                        class="self-center w-[128px] h-[182px]"
                        src={item.volumeInfo?.imageLinks?.thumbnail}
                        alt="test"
                    />						
                {:else}
                    <div class="self-center flex justify-center items-center w-[128px] h-[182px] bg-slate-300">
                        <span>No Image</span>
                    </div>
                {/if}

            </div>
            <span class="bg-stone-400 h-[1px]"></span>
            <div class="h-14 flex flex-row justify-end items-center">
                <PrimalyButton type='submit' text='登録'/>
                <SecondaryButton type='button' text='キャンセル' on:click={closeModal}/>
            </div>
        </div>    
    </form>
</FullCoverZindex30>