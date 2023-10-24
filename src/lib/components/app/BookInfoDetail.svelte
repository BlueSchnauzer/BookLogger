<script lang="ts">
	import Icon from "@iconify/svelte";
    import FullCoverZindex30 from "../parts/FullCoverZindex30.svelte";
	import PrimalyButton from "../parts/PrimalyButton.svelte";
	import SecondaryButton from "../parts/SecondaryButton.svelte";
	import type { books_v1 } from "googleapis";
	import InfoLabel from "../parts/InfoLabel.svelte";

    export let isDisplay = false;
    export let isRegister = true;
    export let action = '';
    export let item: books_v1.Schema$Volume = {};
	const colorStone700 = '#44403C';

    /**モーダルを閉じて初期化*/
    const closeModal = () => {
        isDisplay = !isDisplay;
    };

    const getLabel = (data?: string | number): string => {
        return data?.toString() ?? 'データ無し';
    }


</script>

<FullCoverZindex30 bind:isDisplay={isDisplay} isUseBackGroundColor={true}>
    <form action={action} >
        <div class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[1000px] max-h-[700px] m-auto inset-0 px-3 bg-vellum rounded-lg">
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
                <div class="p-2 flex flex-col bg-slate-200">
                    <div>
                        {#if item.volumeInfo?.imageLinks?.thumbnail}
                            <img class="self-center w-[128px] h-[182px] shadow-md" title={getLabel(item.volumeInfo?.title)} src={item.volumeInfo?.imageLinks?.thumbnail} alt="書影"/>						
                        {:else}
                            <div class="self-center flex justify-center items-center w-[128px] h-[182px] shadow-md bg-slate-300" title={getLabel(item.volumeInfo?.title)}>
                                <span>No Image</span>
                            </div>
                        {/if}
                    </div>
                    <div>
                        {#if item.volumeInfo?.title}
                            <span class="text-lg font-bold text-lime-700">{item.volumeInfo?.title}</span>
                        {:else}
                            <span class="text-lg font-bold text-gray-400">データ無し</span>
                        {/if}
                        <div>
                            <InfoLabel categoryText='著者' condition={item.volumeInfo?.authors} labelFunction={() => item.volumeInfo?.authors?.join(', ')}/>
                        </div>
                        <div>
                            <InfoLabel categoryText='出版社' condition={item.volumeInfo?.publisher} labelFunction={() => item.volumeInfo?.publisher}/>
                        </div>
                        <div>
                            <InfoLabel categoryText='発売日' condition={item.volumeInfo?.publishedDate} labelFunction={() => item.volumeInfo?.publishedDate}/>
                        </div>
                        <div>
                            <InfoLabel categoryText='ページ数' condition={item.volumeInfo?.pageCount} labelFunction={() => item.volumeInfo?.pageCount?.toString()}/>
                        </div>
                    </div>
                </div>
            </div>
            <span class="bg-stone-400 h-[1px]"></span>
            <div class="h-14 flex flex-row justify-end items-center">
                <PrimalyButton type='submit' text='登録'/>
                <SecondaryButton type='button' text='キャンセル' on:click={closeModal}/>
            </div>
        </div>    
    </form>
</FullCoverZindex30>