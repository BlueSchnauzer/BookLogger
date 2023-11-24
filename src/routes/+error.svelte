<script lang="ts">
  // import { page } from '$app/stores';
	import Icon from '@iconify/svelte';

  const colorStone700 = '#44403C';
</script>

<section class="w-screen h-screen flex flex-col flex-grow items-center justify-center">
  <Icon icon="mdi:face-cry-outline" width="160" height="160" color={colorStone700}/>
  <div>
    <p>申し訳ありません。エラーが発生しました。</p>
    <p>ログインページから再ログインしてください。</p>
  </div>
  <a href="/login" class="px-8 py-2 rounded duration-100 text-white bg-lime-600 hover:bg-lime-700">
    ログインページに戻る
  </a>
</section>
