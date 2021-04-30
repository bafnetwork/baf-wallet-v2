<script lang="ts">
    export let onClick: () => void;
    // export let color: "white" | "blue" = "blue";
    export let type = "button"

    // const colorClasses = color === "white" ? "bg-white hover:bg-gray-200" : "text-white bg-lightBlue-900 hover:bg-lightBlue-700";

    // export let classOverride: string | undefined;
    // export let classExtra: string | string[] = ""

    // const extraClasses = Array.isArray(classExtra) ? classExtra.join(" ") : classExtra;
    // const classes = classOverride !== undefined ? classOverride : `${colorClasses} ${extraClasses}`
    export let style
</script>

<button {type} on:click={onClick} {style}>
  <slot />
</button>

<style>
  button {
    border-radius: 0.5rem;
    border: 0px;
    padding: 0.5rem;
    cursor: pointer;
    width: fit-content;
  }
</style>