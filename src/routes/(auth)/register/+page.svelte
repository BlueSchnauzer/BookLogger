<script lang="ts">
	import { registerWithEmailAndPassword } from '$lib/client/Feature/Auth/userManager';
	import FullCoverLoader from '$lib/client/UI/Shared/Components/FullCoverLoader.svelte';
	import AuthMenu from '../AuthMenu.svelte';

	let email: string;
	let password: string;

	//ローダーを表示する
	let isDisplayLoader = false;
	let success: boolean | undefined = undefined;

	const handleRegister = async (email: string, password: string) => {
		isDisplayLoader = true;
		success = await registerWithEmailAndPassword('/login', email, password);
		isDisplayLoader = false;
	};
</script>

<svelte:head>
	<title>登録</title>
</svelte:head>

<div class="flex flex-col p-8 space-y-4 rounded-3xl bg-white sm:w-10/12 max-w-2xl">
	<AuthMenu />
	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">
			エラーが発生しました。時間をおいて再度お試しください。
		</div>
	{/if}
	<span class="text-gray-500">※Googleアカウントがある場合は登録なしで利用できます。</span>
	<form
		class="flex flex-col gap-4"
		on:submit|preventDefault={() => handleRegister(email, password)}
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
			type="submit"
			class="w-32 self-center px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700"
		>
			登録
		</button>
	</form>
</div>
<FullCoverLoader isDisplay={isDisplayLoader} />
