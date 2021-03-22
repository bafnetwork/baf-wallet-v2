<script lang="ts">
    export let classExtra: string | undefined;
    export let classOverride: string | undefined
    const classes = classOverride !== undefined ? classOverride : `p-4 bg-gray-50 rounded-md shadow-md ${classExtra ?? ""}`
</script>

<div  class={classes}>
    <slot></slot>
</div>
