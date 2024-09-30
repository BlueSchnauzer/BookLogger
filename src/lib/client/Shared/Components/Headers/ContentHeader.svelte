<script lang="ts">
	import { logout } from '$lib/client/Feature/Auth/userManager';
	import { colorStone700 } from '$lib/client/Shared/Constants/DisplayValues';
	import Icon from '@iconify/svelte';
	import type { ComponentType } from 'svelte';

	export let headerIcon: ComponentType;
	export let headerText: string;

	const handleLogout = async () => {
		//画面サイズが小さい時に表示するので誤操作か確認する。
		if (!confirm('ログアウトしますか？')) {
			return;
		}
		await logout();
	};
</script>

<div class="flex items-center justify-start">
	<div>
		<div class="max-md:hidden flex">
			<svelte:component this={headerIcon} width={30} height={30} />
			<h1 data-testid="headerText" class="text-xl pl-2">{headerText}</h1>
		</div>
		<button
			data-testid="btnLogoutInHeader"
			class="max-md:flex hidden w-10 h-10 items-center justify-center"
			on:click={handleLogout}
		>
			<Icon icon="ph:sign-out" width="36" height="36" color={colorStone700} />
		</button>
	</div>
</div>
