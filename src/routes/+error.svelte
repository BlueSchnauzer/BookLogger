<script lang="ts">
	import Icon from '@iconify/svelte';
	import { colorStone700 } from '$lib/client/Static/DisplayValues';
	import { logout } from '$lib/client/Feature/Auth/userManager';
</script>

<section class="w-screen h-screen flex flex-col flex-grow items-center justify-center">
	<Icon icon="mdi:face-cry-outline" width="160" height="160" color={colorStone700} />
	<div>
		<p>申し訳ありません。エラーが発生しました。</p>
		<p>ログインページから再ログインしてください。</p>
	</div>
	<button
		class="px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700"
		on:click={logout}
	>
		ログインページに戻る
	</button>
</section>
