<script lang="ts">
  export let label: string
  export let placeholder: string
  export let value: string;
  export let required: boolean;
</script>

<label>
  <span class="">{label}</span>
  <input
    type="text"
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