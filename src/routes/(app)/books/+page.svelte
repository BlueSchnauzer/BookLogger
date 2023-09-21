<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;

    console.log('page');
    console.log(data);

</script>

<ul class="grid gap-2 grid-cols-BookContentAutoFill max-sm:grid-cols-smBookContentAutoFit max-sm:place-items-center">
    {#each data.BookInfos as bookInfo}
        <li class="grid h-80 max-sm:w-[128px] max-sm:h-[182px] bg-gray-100 rounded shadow-xl"
            title="{bookInfo.title}"
        >
            <div class="justify-self-center self-center w-[128px] h-[182px] bg-slate-300">No Image</div>
            <p class="text-sm px-2 break-all max-sm:hidden">{bookInfo.title}</p>
            <div class="text-sm self-center flex justify-between max-sm:hidden">
                <span class="pl-2">登録日</span>
                <span class="pr-2">2023年9月20日</span>
            </div>
        </li>        
    {/each}
</ul>