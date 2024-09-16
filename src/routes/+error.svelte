<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/client/Feature/Auth/firebase';
	import { signOut } from 'firebase/auth';
	import Icon from '@iconify/svelte';
	import { colorStone700 } from '$lib/client/Static/DisplayValues';

	/**ログアウトしてクッキーを削除する(モバイルメニュー時はヘッダーからログアウト)。 */
	const logout = async () => {
		try {
			await signOut(firebaseAuth);
			const response = await fetch('/api/auth', {
				method: 'DELETE'
			});
		} catch (error) {
			console.log(error);
		}
		goto('/login');
	};
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
