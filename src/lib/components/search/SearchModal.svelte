<script lang="ts">
	import PrimalyButton from '$lib/components/common/parts/PrimalyButton.svelte';
	import SecondaryButton from '$lib/components/common/parts/SecondaryButton.svelte';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	export let isDisplay = false;
	export let action = '/books/search';
	let dialog: HTMLDialogElement;
	let query = '';
	let bookTitle = '';
	let author = '';
	let isbn = '';
	const colorStone700 = '#44403C';
	let isShowDetailQueries = false;
	let formError = false;

	/**モーダル表示を表示する*/
	$: if (dialog && isDisplay) { dialog.showModal(); }

	/**モーダルを閉じて初期化*/
	const closeModal = () => {
		formError = false;
		query = '';
		bookTitle = '';
		author = '';
		isbn = '';
		isDisplay = false;
		dialog.close();
	};

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	}

	/**インプットタグでのEnterを無効化*/
	const preventSubmit = (e: KeyboardEvent) => {
		formError = false;
		if (e.key === 'Enter') { e.preventDefault(); }
	};

	/**バリデーションとsubmit処理*/
	const validateSubmit = (e: SubmitEvent) => {
		if (!(query || bookTitle || author || isbn)) {
			e.preventDefault();
			formError = true;
			return;
		}
		isDisplay = false;
		dialog.close();
	};

	/**モーダルの範囲外をクリックした際に、モーダルを閉じる*/
	const closeModalFromContainer = (e: MouseEvent) => {
		const target = e.target! as HTMLElement; //closestを使うために型指定
		if (!target.closest('#searchForm')) { closeModal(); }
	}

	onMount(() => {
		dialog.addEventListener('click', e => closeModalFromContainer(e));

		//アンマウント時にリスナーを削除
		return dialog.removeEventListener('click', e => closeModalFromContainer(e));
	});
</script>

<dialog bind:this={dialog} on:cancel={cancelModal}>
	<form {action} on:submit={(e) => validateSubmit(e)} id='searchForm'>
		<div class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[700px] max-h-[500px] m-auto inset-0 px-3 bg-vellum rounded-lg">
			<div class="h-14 flex flex-row justify-between items-center">
				<span class="text-xl">検索して登録する</span>
				<button type="button"	on:click={closeModal}
					class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-300"
				>
					<Icon icon="ph:x" width="36" height="36" color={colorStone700} />
				</button>
			</div>
			<span class="bg-stone-400 h-[1px]" />
			<div class="flex-1">
				<div class="p-2">
					{#if formError}
						<div class="flex items-center my-2">
							<span class="text-red-500 font-medium">1つ以上の検索条件を入力してください。</span>
						</div>
					{/if}
					<div class="my-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
						<span class="max-sm:mb-2">検索条件</span>
						<input class="px-2 py-1 rounded-lg border border-stone-300"	bind:value={query}
							name="query" aria-label="query"	type="text"	size="30"
							on:keypress={(e) => preventSubmit(e)}
							disabled={isShowDetailQueries ? true : false}
						/>
					</div>
					<button class="mt-3 flex items-center w-full" type="button" data-testid="btnDisplayDetailQueries"
						on:click={() => isShowDetailQueries = !isShowDetailQueries}
					>
						<div class="flex items-center flex-grow">
							<span class="ml-1 text-sm text-gray-600">詳細条件</span>
							<span class="h-[1px] flex-grow mx-2 bg-gray-400"/>
						</div>
						<Icon icon="ph:caret-up-light" width="20" height="20" color={colorStone700} rotate={isShowDetailQueries ? 0 : 90}/>
					</button>
				</div>
				<ul class="p-2 {isShowDetailQueries ? 'block' : 'hidden'}">
					<li class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
						<span class="max-sm:mb-2">タイトル</span>
						<input class="px-2 py-1 rounded-lg border border-stone-300"	bind:value={bookTitle}
							name="booktitle" aria-label="booktitle"	type="text"	size="30"
							on:keypress={(e) => preventSubmit(e)}
							disabled={isShowDetailQueries ? false : true}
						/>
					</li>
					<li class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
						<span class="max-sm:mb-2">著者名</span>
						<input class="px-2 py-1 rounded-lg border border-stone-300"
							bind:value={author} name="author"	aria-label="author"
							type="text"	size="30"	on:keypress={(e) => preventSubmit(e)}
							disabled={isShowDetailQueries ? false : true}
						/>
					</li>
					<li class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch">
						<span class="max-sm:mb-2">ISBN(ハイフン無し13桁)</span>
						<input class="px-2 py-1 rounded-lg border border-stone-300" 
              bind:value={isbn} name="isbn" aria-label="isbn" type="text"	size="30"
							on:keypress={(e) => preventSubmit(e)}
							disabled={isShowDetailQueries ? false : true}
						/>
					</li>
				</ul>
				<input type="hidden" value="0" name="page" aria-label="name">
			</div>
			<span class="bg-stone-400 h-[1px]" />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimalyButton type="submit" text="検索" />
				<SecondaryButton type="button" text="キャンセル" on:click={closeModal} />
			</div>
		</div>
	</form>
</dialog>