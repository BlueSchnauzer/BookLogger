<script lang="ts">
    import type { LayoutData } from './$types';    
    //export let data: LayoutData;

</script>

<main class="flex-1 my-2 max-md:pb-16 flexWidth">
    <!-- 各ページでレンダリング -->
    <slot />
</main>

<style>
    .flexWidth{
        width: calc(100% - (224px));
    }
</style>