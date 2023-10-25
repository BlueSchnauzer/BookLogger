<script lang="ts">
    import PrimalyButton from '../parts/PrimalyButton.svelte';
    import SecondaryButton from '../parts/SecondaryButton.svelte';
	import Icon from "@iconify/svelte";
    import FullCoverZindex30 from "../parts/FullCoverZindex30.svelte";

    export let isDisplay = false;
    export let action = 'books/search';
    let bookTitle = '';
    let author = '';
    let isbn = '';
	const colorStone700 = '#44403C';
    let formError = false;

    /**モーダルを閉じて初期化*/
    const closeModal = () => {
        isDisplay = !isDisplay;
        formError = false;
        bookTitle = '';
        author = '';
        isbn = '';
    };

    /**インプットタグでのEnterを無効化*/
    const preventSubmit = (e: KeyboardEvent) => {
        formError = false;
        if (e.key === 'Enter') { e.preventDefault(); }
    }

    /**バリデーションとsubmit処理*/
    const validateSubmit = (e: SubmitEvent) => {
        if (!(bookTitle || author || isbn)){
            e.preventDefault();
            formError = true;
            return;
        }
        isDisplay = !isDisplay;
    }

</script>

<FullCoverZindex30 bind:isDisplay={isDisplay} isUseBackGroundColor={true}>
    <form action={action} on:submit={e => validateSubmit(e)}>
        <div class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[700px] max-h-[500px] m-auto inset-0 px-3 bg-vellum rounded-lg">
            <div class="h-14 flex flex-row justify-between items-center">
                <span class="text-xl">検索して登録する</span>
                <button type="button" on:click={closeModal}
                    class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
                >
                    <Icon icon="ph:x" width="36" height="36" color={colorStone700} />
                </button>
            </div>
            <span class="bg-stone-400 h-[1px]"></span>
            <div class="flex-1">
                <ul class="p-2">
                    {#if formError}
                        <li class="flex items-center my-2">
                            <span class="text-red-500 font-medium">1つ以上の検索条件を入力してください。</span>
                        </li>
                    {/if}
                    <li class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                        <span class="max-sm:mb-2">タイトル</span>
                        <input class="px-2 py-1 rounded-lg" bind:value={bookTitle} name="booktitle" aria-label="booktitle" type="text" size="30" on:keypress={e => preventSubmit(e)}>
                    </li>
                    <li class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                        <span class="max-sm:mb-2">著者名</span>
                        <input class="px-2 py-1 rounded-lg" bind:value={author} name="author" aria-label="author" type="text" size="30" on:keypress={e => preventSubmit(e)}>
                    </li>
                    <li class="mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
                        <span class="max-sm:mb-2">ISBN(ハイフン無し13桁)</span>
                        <input class="px-2 py-1 rounded-lg" bind:value={isbn} name="isbn" aria-label="isbn" type="text" size="30" on:keypress={e => preventSubmit(e)}>
                    </li>
                </ul>
            </div>
            <span class="bg-stone-400 h-[1px]"></span>
            <div class="h-14 flex flex-row justify-end items-center">
                <PrimalyButton type='submit' text='検索'/>
                <SecondaryButton type='button' text='キャンセル' on:click={closeModal}/>
            </div>
        </div>    
    </form>
</FullCoverZindex30>