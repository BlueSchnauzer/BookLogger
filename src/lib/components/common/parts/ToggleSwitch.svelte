<script lang="ts">
    export let id:number;
    export let text:string;
    export let isVisible = true;
    export let isChecked = false;
</script>

<div class="flex { isVisible ? '' : 'hidden' }">
    <input type="checkbox" id="toggle-{id}" class="peer opacity-0 absolute left-0" bind:checked={isChecked}>
    <label for="toggle-{id}" class="h-8 px-2.5 py-1 mx-0.5 whitespace-nowrap flex items-center text-stone-700 bg-stone-300 border border-stone-700 rounded-full 
        duration-150 hover:bg-stone-200 peer-focus:bg-stone-200 peer-checked:text-stone-200 peer-focus:peer-checked:bg-stone-700 peer-checked:bg-stone-700"
    >
        {text}
    </label>
</div>
