<script lang="ts">
	import { goto } from '$app/navigation';
  import { firebaseAuth } from '$lib/firebase.client';
  import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
	import AuthMenu from '../AuthMenu.svelte';
	import FullCoverLoader from '$lib/components/common/parts/FullCoverLoader.svelte';

  let email: string;
  let password: string;

  //ローダーを表示する
  let isDisplay = false;
	let success: boolean | undefined = undefined;

  /**
   * 認証を行い、firebaseから受け取ったuidをクッキーに保存する
   * @param type 使用する認証タイプ
   */
  const login = async (type: 'google' | 'email') => {
    isDisplay = true;
    let idToken: string;

    try {
      if (type === 'google'){
        const provider = new GoogleAuthProvider();
        provider.setDefaultLanguage('en');
		    const userCredentials = await signInWithPopup(firebaseAuth, provider);
        idToken = await userCredentials.user.getIdToken();
      }
      else {
        const userCredentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
        idToken = await userCredentials.user.getIdToken();
      }

      const response = await fetch('/api/auth', {
        method: 'POST',
        body: JSON.stringify(idToken),
        headers: {'Content-type': 'application/json'}
      });
      
      isDisplay = false;
      goto('/home');
    }
    catch (error) {
      console.log(error);
      isDisplay = false;
      success = false;
    }
  }

</script>

<div class="flex flex-col p-8 space-y-4 rounded-3xl bg-white sm:w-10/12 max-w-2xl">
  <AuthMenu/>
	{#if !success && success !== undefined}
		<div class="p-8 text-red-500 bg-red-100">エラーが発生しました。時間をおいて再度お試しください。</div>
	{/if}
  <button class="w-60 self-center px-8 py-2 rounded duration-100 text-white bg-sky-600 hover:bg-sky-700"
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
    <button type="submit" class="w-28 self-center px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700">
      ログイン
    </button>
  </form>
</div>
<FullCoverLoader {isDisplay} />