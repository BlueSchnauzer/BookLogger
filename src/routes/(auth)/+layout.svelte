<script lang="ts">
	import MainToast from '$lib/client/Shared/Components/Toast/MainToast.svelte';
</script>

<div
	class="bg-slate-500 flex justify-center items-center w-screen h-screen bg-gradient-to-bl from-vellum to-lime-300"
>
	<slot />
	<MainToast />
</div>
