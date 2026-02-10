<script lang="ts">
	import { page } from '$app/state';
	import { mainMenuItems } from '$lib/client/Shared/Constants/MenuItems';
	import { colorStone200 } from '$lib/client/Shared/Constants/DisplayValues';

	//ページ移動の度に対応したページにスタイルを当てる
	const pathName = $derived(page.url.pathname);
</script>

<nav class="hidden max-md:flex w-full fixed bottom-0 h-16 bg-stone-700">
	<ul class="flex flex-1">
		{#each mainMenuItems as { icon: IconComponent, ref, name } (IconComponent)}
			<li
				class="flex flex-1 border-b-4 border-transparent
				{ref === pathName ? 'border-y-lime-600 bg-stone-600' : ''}"
			>
				<a href={ref} class="flex flex-1 flex-col items-center justify-evenly">
					<IconComponent color={colorStone200} />
					<span class="text-xs text-stone-200">{name}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
