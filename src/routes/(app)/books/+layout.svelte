<script lang="ts">
	import { onMount } from 'svelte';
    import type { LayoutData } from './$types';    

    onMount(async () => {
		//JavaScript用のGoogleAPIライブラリをロードする
		await gapi.load('client', () => {});
		//GoogleBooksAPI v1を使用する
		await gapi.client.init({'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest']});
	});

</script>

<svelte:head>
	<script src="https://apis.google.com/js/api.js"></script>
</svelte:head>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
    <!-- 各ページでレンダリング -->
    <slot />
</main>
<div class="max-lg:hidden mx-1 mt-5 mb-3 bg-stone-400 w-[1px]" />

<style>
    .flexWidth{
        width: calc(100% - (224px + 208px));
    }
</style>