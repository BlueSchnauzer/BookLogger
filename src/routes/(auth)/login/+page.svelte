<script lang="ts">
	import { login } from '$lib/client/Feature/Auth/userManager';
	import FullCoverLoader from '$lib/client/UI/Shared/Components/FullCoverLoader.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onDestroy, onMount } from 'svelte';
	import AuthMenu from '../AuthMenu.svelte';

	let email: string;
	let password: string;

	let isDisplayLoader = false;
	let success: boolean | undefined = undefined;
	let btnGoogleLogin: HTMLButtonElement;
	let btnEmailLogin: HTMLButtonElement;

	const handleLogin = async (type: 'google' | 'email', email = '', password = '') => {
		isDisplayLoader = true;
		success = await login('/home', type, email, password);
		isDisplayLoader = false;
	};

	onMount(async () => {
		btnGoogleLogin.disabled = false;
		btnEmailLogin.disabled = false;
	});

	onDestroy(() => {
		//アンマウント時にトーストが表示されていれば削除する。
		toast.pop(0);
	});
</script>

<svelte:head>
	<title>ログイン</title>
</svelte:head>

<div class="flex flex-col p-8 space-y-4 rounded-3xl bg-white sm:w-10/12 max-w-2xl">
	<AuthMenu />
	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">
			エラーが発生しました。時間をおいて再度お試しください。
		</div>
	{/if}
	<button
		disabled
		bind:this={btnGoogleLogin}
		aria-label="btnGoogleLogin"
		type="submit"
		class="w-60 self-center px-8 py-2 rounded duration-100 text-white bg-sky-600 hover:bg-sky-700"
		on:click={() => handleLogin('google')}
	>
		Googleアカウントでログイン
	</button>
	<div class="flex justify-center items-center">
		<div class="w-7 bg-stone-400 min-h-[1px]" />
		<span class="px-2">OR</span>
		<div class="w-7 bg-stone-400 min-h-[1px]" />
	</div>
	<form
		class="flex flex-col gap-4"
		on:submit|preventDefault={() => handleLogin('email', email, password)}
	>
		<span class="text-sm">メールアドレス</span>
		<input
			type="email"
			placeholder="メールアドレス"
			class="px-4 py-2 border border-gray-300 rounded-md"
			required
			bind:value={email}
		/>
		<span class="text-sm">パスワード</span>
		<input
			type="password"
			placeholder="パスワード"
			class="px-4 py-2 border border-gray-300 rounded-md"
			required
			bind:value={password}
		/>
		<button
			disabled
			bind:this={btnEmailLogin}
			data-testid="btnLogin"
			aria-label="btnEmailLogin"
			type="submit"
			class="w-32 self-center px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700"
		>
			ログイン
		</button>
		<span class="text-gray-500 text-xs"
			>※Googleアカウントでのログインができない場合、メールアドレスとパスワードを登録してください。</span
		>
	</form>
</div>
<FullCoverLoader isDisplay={isDisplayLoader} />
