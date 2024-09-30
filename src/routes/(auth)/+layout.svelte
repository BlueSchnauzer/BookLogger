<script lang="ts">
	import { mainToastTarget } from '$lib/client/Shared/Helpers/Toast';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<div
	class="bg-slate-500 flex justify-center items-center w-screen h-screen bg-gradient-to-bl from-vellum to-lime-300"
>
	<slot />
	<div class="wrap-bottom">
		<SvelteToast target={mainToastTarget} />
	</div>
</div>

<style>
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
