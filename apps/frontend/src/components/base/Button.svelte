<script lang="ts">
    export let onClick: () => void;
    export let color: "white" | "blue" = "blue";
    export let type = "button"

    const colorClasses = color === "white" ? "bg-white hover:bg-gray-200" : "text-white bg-lightBlue-900 hover:bg-lightBlue-700";

    export let classOverride: string | undefined;
    export let classExtra: string | string[] = ""

    const extraClasses = Array.isArray(classExtra) ? classExtra.join(" ") : classExtra;
    const classes = classOverride !== undefined ? classOverride : `${colorClasses} ${extraClasses}`
</script>

<button {type} on:click={onClick} class={`px-1 py-1 transition duration-150 ease-in-out border-0 rounded-lg ${classes}`}>
    <slot></slot>
</button>
