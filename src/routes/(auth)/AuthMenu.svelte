<script lang="ts">
	import { page } from "$app/stores";

  //ログイン、登録画面の切り替えを行うヘッダー

  //ページ移動の度に対応したページにスタイルを当てる
	let pathName: string;
	$: pathName = $page.url.pathname;	

</script>

<div class="flex">
  <a href="/login" class="px-4 py-2 duration-200 hover:bg-slate-50 
    {pathName === '/login' ? 'font-bold text-lime-600 border-b border-b-lime-600' : ''}"
  >
    ログイン
  </a>
  <a href="/register" class="px-4 py-2 duration-200 hover:bg-slate-50 
    {pathName === '/register' ? 'font-bold text-lime-600 border-b border-b-lime-600' : ''}"
  >
    登録
  </a>
</div>
