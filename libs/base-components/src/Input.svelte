<script lang="ts">
  export let label: string
  export let placeholder: string
  export let value: string;
  export let required: boolean;
</script>

<label class="block">
  <span class="text-gray-700">{label}</span>
  <input
    type="text"
    class="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-cyan-300 focus:ring focus:ring-cyan-200 focus:ring-opacity-50"
    {placeholder}
    bind:value
    {required}
  />
</label>
