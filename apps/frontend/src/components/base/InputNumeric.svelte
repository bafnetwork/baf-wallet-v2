<script lang="ts">
  export let label: string
  export let placeholder: any
  export let value: any;
  export let required 
</script>

<label class="block">
  <span class="text-gray-700">{label}</span>
  <input
    type="number"
    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    {placeholder}
    bind:value
    {required}
  />
</label>
