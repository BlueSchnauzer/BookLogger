<script src="ts">
	import { SvelteToast } from '@zerodevx/svelte-toast';
	import { notificationToastTarget } from '$lib/client/Shared/Helpers/Toast';
</script>

<div class="wrap-default">
	<SvelteToast target={notificationToastTarget} />
</div>
