<script lang="ts">
	import { goto } from '$app/navigation';
	import { firebaseAuth } from '$lib/firebase.client';
	import {
		GoogleAuthProvider,
		getRedirectResult,
		signInWithEmailAndPassword,
		signInWithRedirect
	} from 'firebase/auth';
	import AuthMenu from '../AuthMenu.svelte';
	import FullCoverLoader from '$lib/components/common/parts/FullCoverLoader.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { toast } from '@zerodevx/svelte-toast';

	let email: string;
	let password: string;

	//ローダー表示
	let isDisplay = false;
	let success: boolean | undefined = undefined;
	let btnGoogleLogin: HTMLButtonElement;
	let btnEmailLogin: HTMLButtonElement;

	/**
	 * 認証を行い、firebaseから受け取ったuidをクッキーに保存する
	 * @param type 使用する認証タイプ
	 */
	const login = async (type: 'google' | 'email') => {
		isDisplay = true;
		let idToken: string;

		try {
			if (type === 'google') {
				await signInWithRedirect(firebaseAuth, new GoogleAuthProvider());
				//後続処理はリダイレクトから戻った後にonMountで行う。
			} else {
				const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
				idToken = await userCredentials.user.getIdToken();

				await setCookie(idToken);
				goto('/home');
			}
		} catch (error) {
			console.log(error);
			success = false;
		}

		isDisplay = false;
	};

	/**認証したユーザの認証情報をクッキーに保存する。*/
	const setCookie = async (idToken: string) => {
		const response = await fetch('/api/auth', {
			method: 'POST',
			body: JSON.stringify(idToken),
			headers: { 'Content-type': 'application/json' }
		});
	};

	/**リダイレクトから戻った際にGoogle認証が成功したかを確認する。*/
	const handleRedirectResult = async () => {
		isDisplay = true;

		try {
			const userCredentials = await getRedirectResult(firebaseAuth);
			if (userCredentials) {
				const idToken = await userCredentials!.user.getIdToken();
				await setCookie(idToken);

				goto('/home');
			}
		} catch (error) {
			console.log(error);
			success = false;
		}

		isDisplay = false;
	};

	onMount(async () => {
		//リダイレクトの場合、ページが再読み込みされるので
		//マウント後に認証結果を確認する。
		await handleRedirectResult();
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
		on:click={() => login('google')}
	>
		Googleアカウントでログイン
	</button>
	<div class="flex justify-center items-center">
		<div class="w-7 bg-stone-400 min-h-[1px]" />
		<span class="px-2">OR</span>
		<div class="w-7 bg-stone-400 min-h-[1px]" />
	</div>
	<form class="flex flex-col gap-4" on:submit|preventDefault={() => login('email')}>
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
<FullCoverLoader {isDisplay} />
