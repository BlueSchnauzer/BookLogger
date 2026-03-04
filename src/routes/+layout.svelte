<script lang="ts">
	import '../app.css';
	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';
	import { navigating } from '$app/state';
	import MainToast from '$lib/client/Shared/Components/Toast/MainToast.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	NProgress.configure({
		showSpinner: false
	});

	$effect(() => {
		//ページ移動中にプログレスを表示する
		if (navigating.to) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	});
</script>

{@render children()}
<MainToast />

<style>
	:global(#nprogress .bar) {
		background-color: #65a30d;
		height: 4px;
	}
</style>
