<script lang="ts">
    export let classOverride: string | undefined;
    export let classExtra: string | string[] = ""

    const extraClasses = Array.isArray(classExtra) ? classExtra.join(" ") : classExtra;
    const classes = classOverride !== undefined ? classOverride : `p-4 bg-blueGray-100 rounded-md shadow-md ${extraClasses}`
</script>

<div class={classes}>
    <slot></slot>
</div>
