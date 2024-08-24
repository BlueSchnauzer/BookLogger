<script lang="ts">
	import { colorStone700 } from '$lib/client/Static/DisplayValues';
	import ConditionInput from '$lib/client/UI/Search/ConditionModal/ConditionInput.svelte';
	import ModalBase from '$lib/client/UI/Shared/Components/ModalBase.svelte';
	import PrimalyButton from '$lib/client/UI/Shared/Components/PrimalyButton.svelte';
	import SecondaryButton from '$lib/client/UI/Shared/Components/SecondaryButton.svelte';
	import Icon from '@iconify/svelte';

	export let isDisplay = false;
	export let action = '/books/search';
	let isShowDetailQueries = false;
	let formError = false;

	let query = '';
	let bookTitle = '';
	let author = '';
	let isbn = '';

	const closeModal = () => (isDisplay = false);
	$: if (!isDisplay) {
		formError = false;
		query = '';
		bookTitle = '';
		author = '';
		isbn = '';
	}

	/**バリデーションとsubmit処理*/
	const handleSubmit = (e: SubmitEvent) => {
		if (!(query || bookTitle || author || isbn)) {
			e.preventDefault();
			formError = true;
			return;
		}
		isDisplay = false;
	};
</script>

<ModalBase bind:isDisplay isCloseByOutsideClick={true}>
	<form {action} on:submit={(e) => handleSubmit(e)}>
		<div
			class="z-40 flex flex-col fixed w-4/5 h-4/5 max-w-[700px] max-h-[500px] m-auto inset-0 px-3 bg-vellum rounded-lg"
		>
			<div class="h-14 flex flex-row justify-between items-center">
				<span class="text-xl">検索して登録する</span>
				<button
					type="button"
					on:click={closeModal}
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
					<div
						class="my-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch"
					>
						<span class="max-sm:mb-2">検索条件</span>
						<ConditionInput
							bind:value={query}
							name={'query'}
							disabled={isShowDetailQueries}
							bind:formError
						/>
					</div>
					<button
						class="mt-3 flex items-center w-full"
						type="button"
						data-testid="btnDisplayDetailQueries"
						on:click={() => (isShowDetailQueries = !isShowDetailQueries)}
					>
						<div class="flex items-center flex-grow">
							<span class="ml-1 text-sm text-gray-600">詳細条件</span>
							<span class="h-[1px] flex-grow mx-2 bg-gray-400" />
						</div>
						<Icon
							icon="ph:caret-up-light"
							width="20"
							height="20"
							color={colorStone700}
							rotate={isShowDetailQueries ? 0 : 90}
						/>
					</button>
				</div>
				<ul class="p-2 {isShowDetailQueries ? 'block' : 'hidden'}">
					<li
						class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch"
					>
						<span class="max-sm:mb-2">タイトル</span>
						<ConditionInput
							bind:value={bookTitle}
							name="booktitle"
							disabled={!isShowDetailQueries}
							bind:formError
						/>
					</li>
					<li
						class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch"
					>
						<span class="max-sm:mb-2">著者名</span>
						<ConditionInput
							bind:value={author}
							name="author"
							disabled={!isShowDetailQueries}
							bind:formError
						/>
					</li>
					<li
						class="mx-2 mb-2 flex justify-between items-center max-sm:flex-col max-sm:justify-start max-sm:items-stretch"
					>
						<span class="max-sm:mb-2">ISBN</span>
						<ConditionInput
							bind:value={isbn}
							name="isbn"
							disabled={!isShowDetailQueries}
							bind:formError
						/>
					</li>
				</ul>
				<input type="hidden" value="0" name="page" aria-label="name" />
			</div>
			<span class="bg-stone-400 h-[1px]" />
			<div class="h-14 flex flex-row justify-end items-center">
				<PrimalyButton type="submit" text="検索" />
				<SecondaryButton type="button" text="キャンセル" on:click={closeModal} />
			</div>
		</div>
	</form>
</ModalBase>
