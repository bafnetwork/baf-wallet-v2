<script lang="ts">
    export let onClick: () => void;
    export let color: "white" | "blue" = "blue";
    export let type = "button"

    const colorClasses = color === "white" ? "bg-white hover:bg-gray-200" : "text-white bg-blue-600 hover:bg-blue-800";
</script>

<button {type} on:click={onClick} class={`px-2 py-1 transition duration-150 ease-in-out border-0 rounded-lg ${colorClasses}`}>
    <slot></slot>
</button>
