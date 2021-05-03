<script lang="ts">
    interface DropdownItem {
        value: any;
        label: string;
        meta?: any;
    }
    interface DropdownOption {
        [key: string]: any
    }
    export let selected: string;
    export let items: DropdownItem[];
    const options: DropdownOption[] = items.map(item => ({ key: item.label, item}));
</script>


<select bind:value={selected} class="">
    {#each options as option (option.key)}
        <option value={option.item.value}>{option.item.label}</option>
    {/each}
</select>
