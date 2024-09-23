<script src="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { modalToastTarget } from '$lib/client/Shared/Helpers/Toast';
</script>

<div class="wrap-default">
	<SvelteToast target={modalToastTarget} />
</div>
