<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { ComponentType } from 'svelte';
	import { signOut } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase.client';
	import { goto } from '$app/navigation';

	export let headerIcon: ComponentType;
	export let headerText: string;
	const colorStone700 = '#44403C';

	/**ログアウトしてクッキーを削除する(モバイルメニュー時はヘッダーからログアウト)。 */
	const logout = async () => {
		//画面サイズが小さい時に表示するので誤操作か確認する。
		if (!confirm('ログアウトしますか？')) { return; }

		try {
			await signOut(firebaseAuth);
			const response = await fetch('/api/auth', {
				method: 'DELETE'
			});
		}
		catch (error) {
			console.log(error);
		}
    goto('/login');
	}
	
</script>

<div class="flex items-center justify-start">
	<div>
		<div class="max-md:hidden flex">
			<svelte:component this={headerIcon} width={30} height={30} />
			<h1 data-testid="headerText" class="text-xl pl-2">{headerText}</h1>
		</div>
		<button data-testid="btnLogoutInHeader" class="max-md:flex hidden w-10 h-10 items-center justify-center" on:click={logout}>
			<Icon icon="ph:sign-out" width="36" height="36" color={colorStone700} />
		</button>	
	</div>
</div>