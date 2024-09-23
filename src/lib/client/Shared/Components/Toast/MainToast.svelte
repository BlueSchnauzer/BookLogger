<script src="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { mainToastTarget } from '$lib/client/Shared/Helpers/Toast';
</script>

<div class="wrap-bottom">
	<SvelteToast target={mainToastTarget} />
</div>

<style>
	.wrap-bottom {
		--toastContainerTop: auto;
		--toastContainerRight: auto;
		--toastContainerBottom: 4rem;
		--toastContainerLeft: calc(50vw - 8rem);
	}
</style>
