<script lang="ts">
	export let isDisplay = false;
	export let isDisplayLoader = false;

	let dialog: HTMLDialogElement;

	$: if (dialog && isDisplay) {
		dialog.showModal();
	} else if (dialog) {
		dialog.close();
	}

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	};
</script>

<dialog bind:this={dialog} on:cancel={cancelModal}>
	{#if isDisplayLoader}
		<div class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"
			></span>
		</div>
	{:else}
		<slot />
	{/if}
</dialog>
