<script lang="ts">
    interface DropdownItem {
        value: any;
        label: string;
        meta?: any;
    }
    interface DropdownOption {
        [key: string]: any
    }
    export let items: DropdownItem[];
    export let multiple: any | undefined = undefined;
    const options: DropdownOption[] = items.map(item => ({ key: item.label, item}));
</script>


<select {multiple} class="block w-full mt-1 rounded-md">
    {#each options as option (option.key)}
        <option value={option.item.value}>{option.item.label}</option>
    {/each}
</select>
