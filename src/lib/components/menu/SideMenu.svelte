<script lang="ts">
	import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
	import type { menuItemData } from '$lib/customTypes';
	import Home from '$lib/icons/Home.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import MagnifingGlass from '$lib/icons/MagnifingGlass.svelte';
	import BookShelf from '$lib/icons/BookShelf.svelte';
	import { signOut } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase.client';
	import { goto } from '$app/navigation';

	//PC用メニュー
	const MenuItemDatas: menuItemData[] = [
		{ icon: Home, ref: '/home', name: 'ホーム' },
		{ icon: BookCase, ref: '/books', name: 'ライブラリ' },
		{ icon: MagnifingGlass, ref: '/books/search', name: '書籍検索'},
		{ icon: BookShelf, ref: '/shelf', name: '本棚' }
	];
	const colorStone200 = '#E7E5E4';

	//ページ移動の度に対応したページにスタイルを当てる
	let pathName: string;
	$: pathName = $page.url.pathname;	

	/**ログアウトしてクッキーを削除する(モバイルメニュー時はヘッダーからログアウト)。 */
	const logout = async () => {
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

<nav class="flex flex-col max-md:hidden m-2 w-20 rounded-xl shadow-2xl bg-stone-700">
	<!-- <div class="flex p-3">
		<Icon icon="ph:books-light" width="36" height="36" color={colorStone200}/>
		<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
	</div> -->
	<!-- <div class="mx-3 my-2 bg-stone-200 h-[1px]" /> -->
	<div class="flex flex-col flex-grow justify-between pb-2">
		<ul class="flex flex-col flex-1 justify-center items-center">
			{#each MenuItemDatas as data (data.icon)}
				<li class="flex relative h-14 duration-300 border-transparent">
					<a href={data.ref} title={data.name} class="flex flex-1 group items-center rounded-md
						after:content-[''] after:hover:block
						after:absolute after:top-2 after:left-0 
						after:h-2.5 after:w-2.5 after:rounded-full after:bg-lime-600
						{data.ref === pathName ? 'after:block' : 'after:hidden'}"
					>
						<div class=" h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
							<svelte:component this={data.icon} color={colorStone200} />
						</div>
						<!-- <span class="ml-2.5 text-stone-200">{data.name}</span> -->
					</a>
				</li>
			{/each}
		</ul>
		<div class="flex justify-center h-14 duration-300 border-transparent">
			<button data-testid="btnLogoutInSide" title="ログアウト" class="flex group items-center rounded-md" on:click={logout}>
				<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
					<Icon icon="ph:sign-out-bold" width="24" height="24" color={colorStone200}/>
				</div>
				<!-- <span class="ml-2.5 text-stone-200">ログアウト</span> -->
			</button>
		</div>
	</div>
</nav>
