<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		isDisplay: boolean;
		isDisplayLoader?: boolean;
		/**モダール外をクリックした際にモーダルを閉じる場合に使用*/
		isCloseByOutsideClick?: boolean;
		children: Snippet;
	}

	let {
		isDisplay = $bindable(),
		isDisplayLoader = $bindable(false),
		isCloseByOutsideClick = false,
		children
	}: Props = $props();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (dialog && isDisplay) {
			dialog.showModal();
		} else if (dialog) {
			dialog.close();
		}
	});

	/**Escキーでモーダルを閉じた際に、変数を併せて変更する*/
	const cancelModal = () => {
		isDisplay = false;
	};

	$effect(() => {
		if (!isCloseByOutsideClick || !dialog) {
			return;
		}

		const closeModalFromContainer = (e: MouseEvent) => {
			const target = e.target! as HTMLElement; //closestを使うために型指定
			if (target === dialog) {
				isDisplay = false;
				isDisplayLoader = false;
			}
		};

		dialog.addEventListener('click', closeModalFromContainer);
		return () => dialog.removeEventListener('click', closeModalFromContainer);
	});
</script>

<dialog bind:this={dialog} oncancel={cancelModal}>
	{#if isDisplayLoader}
		<div class="fixed m-auto inset-0 flex flex-1 justify-center items-center">
			<span
				class="animate-spin w-20 h-20 border-6 border-lime-600 rounded-full border-t-transparent"
			></span>
		</div>
	{:else}
		{@render children()}
	{/if}
</dialog>
