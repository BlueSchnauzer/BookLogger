<script lang="ts">
	import { SvelteToast } from "@zerodevx/svelte-toast";

	const target = 'mainToast';

</script>

<div
	class="bg-slate-500 flex justify-center items-center w-screen h-screen bg-gradient-to-bl from-vellum to-lime-300"
>
	<slot />
	<div class="wrap-bottom">
		<SvelteToast {target}/>
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