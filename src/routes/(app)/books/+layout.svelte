<script lang="ts">
    import type { LayoutData } from './$types';    

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
    <!-- 各ページでレンダリング -->
    <slot />
</main>
<div class="max-lg:hidden mx-1 mt-5 mb-3 bg-stone-400 w-[1px]" />

<style>
    .flexWidth{
        width: calc(100% - (224px + 208px));
    }
</style>