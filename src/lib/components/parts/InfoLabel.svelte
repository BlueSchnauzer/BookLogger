<script lang="ts">
    export let categoryText: string;
    export let condition: any;
    export let labelFunction: () => string | undefined;
</script>

<span class="font-medium">{categoryText} : </span>
{#if condition}
    <span>{labelFunction()}</span>
{:else}
    <span class="text-gray-400">データ無し</span>
{/if}
