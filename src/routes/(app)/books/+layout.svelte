<script lang="ts">
    import type { LayoutData } from '../$types';
    
    export let data: LayoutData;

    //ISBNで書誌情報を取得し、書影とページ数を取る。

    console.log('layout');
    console.log(data);
</script>

<div class="flex-1 my-2 overflow-auto max-md:pb-16">
    <slot />
</div>