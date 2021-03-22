<script lang="ts">
    import Card from "./Card.svelte"

    export let visible = false;
    let overlay: HTMLElement;

    function closeModal() {
        console.log("bruh")
        visible = false;
    }

    $: visibilityClasses = visible ? "z-40" : "hidden";

    const handleClick = (e: any) => {
        console.log(e);
        if (e.target.classList.contains("modalOverlay")) {
            closeModal()
        }
    }
    
</script>

<div bind:this={overlay} on:click={handleClick} class={`modalOverlay absolute top-0 left-0 w-screen h-screen bg-gray-900 bg-opacity-50 ${visibilityClasses}`}>
    <div class="container z-50 flex flex-col items-center justify-center h-full m-auto modalOverlay">
        <slot></slot>
    </div>
</div>