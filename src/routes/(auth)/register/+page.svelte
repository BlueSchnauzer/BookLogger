<script lang="ts">
	import { goto } from '$app/navigation';
	import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
  import { firebaseAuth } from '$lib/firebase.client';
	import AuthMenu from '../AuthMenu.svelte';

	let email: string;
	let password: string;

	let success: boolean | undefined = undefined;

	// const registerWithGoogle = () => {
	// 	const provider = new GoogleAuthProvider();
	// 	signInWithPopup(firebaseAuth, provider)
	// };

	const registerWithEmail = async () => {
		try {
			await createUserWithEmailAndPassword(firebaseAuth, email, password);
			goto('/login');
		}
		catch (error) {
			console.log(error);
			success = false;
		}
	};

</script>

<div class="flex flex-col p-8 space-y-4 rounded-3xl bg-white sm:w-10/12 max-w-2xl">
  <AuthMenu/>
	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">エラーが発生しました。時間をおいて再度お試しください。</div>
	{/if}
  <button class="w-60 self-center px-8 py-2 rounded duration-100 text-white bg-sky-600 hover:bg-sky-700">
    Googleアカウントで登録
  </button>
  <div class="flex justify-center items-center">
    <div class="w-7 bg-stone-400 min-h-[1px]" />
    <span class="px-2">OR</span>
    <div class="w-7 bg-stone-400 min-h-[1px]" />
  </div>
  <form class="flex flex-col gap-4" on:submit|preventDefault={registerWithEmail}>
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
    <button type="submit" class="w-28 self-center px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700">
      登録
    </button>
  </form>
</div>
