<script lang="ts">
  export let label: string
  export let placeholder: string
  export let value: number;
  export let required: boolean;
  export let min: number;
  export let max: number;
</script>

<label class="block">
  <span class="text-gray-700">{label}</span>
  <input
    type="number"
    class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
    {placeholder}
    bind:value
    {required}
    {min}
    {max}
  />
</label>
