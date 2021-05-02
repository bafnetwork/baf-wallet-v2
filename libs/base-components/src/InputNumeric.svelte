<script lang="ts">
  export let label: string
  export let placeholder: string
  export let value: number;
  export let required: boolean;
</script>

<label class="">
  <span class="">{label}</span>
  <input
    type="number"
    class=""
    {placeholder}
    bind:value
    {required}
  />
</label>

<style>
  label {
    display: block;
    padding: 1rem;
  }
</style>