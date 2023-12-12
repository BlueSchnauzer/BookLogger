<script lang="ts">
	import { page } from '$app/stores';
  import Icon from '@iconify/svelte';
	import type { menuItemData } from '$lib/customTypes';
	import Home from '$lib/icons/Home.svelte';
	import BookCase from '$lib/icons/BookCase.svelte';
	import PileOfBooks from '$lib/icons/PileOfBooks.svelte';
	import Openingbook from '$lib/icons/OpeningBook.svelte';
	import CompleteBook from '$lib/icons/CompleteBook.svelte';
	import { signOut } from 'firebase/auth';
	import { firebaseAuth } from '$lib/firebase.client';
	import { goto } from '$app/navigation';

	//PC用メニュー

	const MenuItemDatas: menuItemData[] = [
		{ icon: Home, ref: '/home', name: 'ホーム' },
		{ icon: BookCase, ref: '/books', name: '登録した本' },
		{ icon: PileOfBooks, ref: '/books/wish', name: '読みたい本'},
		{ icon: Openingbook, ref: '/books/reading', name: '読んでいる本' },
		{ icon: CompleteBook, ref: '/books/complete', name: '読み終わった本' }
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

<nav class="flex flex-col max-md:hidden m-2 w-56 rounded-xl shadow-2xl bg-stone-700">
	<div class="flex p-3">
		<Icon icon="ph:books-light" width="36" height="36" color={colorStone200}/>
		<p class="ml-2.5 text-xl text-stone-200">BookLogger</p>
	</div>
	<div class="mx-3 my-2 bg-stone-200 h-[1px]" />
	<div class="flex flex-col flex-grow justify-between pb-2">
		<ul>
			{#each MenuItemDatas as data (data.icon)}
				<li
					class="flex h-14 duration-300 border-l-4 border-transparent hover:border-x-lime-600 hover:bg-stone-600 
					{data.ref === pathName ? 'border-x-lime-600 bg-stone-600 ' : ''}"
				>
					<a href={data.ref} class="flex flex-1 group items-center rounded-md">
						<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
							<svelte:component this={data.icon} color={colorStone200} />
						</div>
						<span class="ml-2.5 text-stone-200">{data.name}</span>
					</a>
				</li>
			{/each}
		</ul>
		<div class="flex h-14 duration-300 border-l-4 border-transparent hover:border-x-lime-600 hover:bg-stone-600">
			<button data-testid="btnLogoutInSide" class="flex flex-1 group items-center rounded-md" on:click={logout}>
				<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
					<Icon icon="ph:sign-out-bold" width="24" height="24" color={colorStone200}/>
				</div>
				<span class="ml-2.5 text-stone-200">ログアウト</span>
			</button>
		</div>
	</div>
</nav>
