<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { mainMenuItems } from '$lib/client/Static/MenuItems';
	import { colorStone200 } from '$lib/client/Static/DisplayValues';
	import { firebaseAuth } from '$lib/client/Feature/Auth/firebase';
	import Icon from '@iconify/svelte';
	import { signOut } from 'firebase/auth';

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
		} catch (error) {
			console.log(error);
		}
		goto('/login');
	};
</script>

<nav class="flex flex-col max-md:hidden m-2 w-20 rounded-xl shadow-2xl bg-stone-700">
	<div class="flex flex-col flex-grow justify-between pb-2">
		<ul class="flex flex-col flex-1 justify-center items-center">
			{#each mainMenuItems as data (data.icon)}
				<li class="group flex relative h-14 duration-300 border-transparent">
					<a
						href={data.ref}
						class="flex flex-1 group items-center rounded-md
						after:content-[''] after:hover:block
						after:absolute after:top-2 after:left-0
						after:h-2.5 after:w-2.5 after:rounded-full after:bg-lime-600
						{data.ref === pathName ? 'after:block' : 'after:hidden'}"
					>
						<div class=" h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
							<svelte:component this={data.icon} color={colorStone200} />
						</div>
					</a>
					<div
						class="bg-stone-300 border border-stone-700 absolute left-full top-1/4 z-20
						ml-3 -translate-y-1/2 whitespace-nowrap rounded-md py-1 px-3
						hidden group-hover:block"
					>
						<span
							class="bg-stone-300 border-l border-b border-stone-700 absolute left-[-5px] top-1/2 -z-10 h-2 w-2 -translate-y-1/2 rotate-45"
						></span>
						<span class="text-stone-700">{data.name}</span>
					</div>
				</li>
			{/each}
		</ul>
		<div class="flex justify-center h-14 duration-300 border-transparent">
			<button
				data-testid="btnLogoutInSide"
				title="ログアウト"
				class="flex group items-center rounded-md"
				on:click={logout}
			>
				<div class="w-9 h-9 m-0.5 p-1.5 rounded-lg bg-stone-600">
					<Icon icon="ph:sign-out-bold" width="24" height="24" color={colorStone200} />
				</div>
			</button>
		</div>
	</div>
</nav>
