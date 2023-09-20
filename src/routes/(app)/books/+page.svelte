<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    console.log('page');
    console.log(data);

</script>

<ul class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center">
    {#each data.BookInfos as bookInfo}
        <li class="grid max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-xl">
            <div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">No Image</div>
            <span class="max-sm:hidden ">{bookInfo.title}</span>
            <span class="justify-self-start max-sm:hidden">登録日</span>
            <span class="justify-self-end max-sm:hidden">2023年9月20日</span>
        </li>        
    {/each}
</ul>