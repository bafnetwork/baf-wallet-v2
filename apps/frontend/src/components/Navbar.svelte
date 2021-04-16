<script lang="ts">
    import { link } from "svelte-spa-router"
    import { getContext } from "svelte";
    import Button from "./base/Button.svelte"
    import SendModal from "./SendModal.svelte"

    const { open } = getContext('modal');
    
    function openSendModal() {
        open(SendModal);
    };
</script>

<div class="sticky top-0 z-30 grid grid-cols-12 gap-2 p-4 shadow-md bg-cyan-600 h-min">
    <a class="col-span-1 col-start-10 text-lg text-center text-white" href="/" use:link>Account</a>
    <a class="col-span-1 col-start-11 text-lg text-center text-white" href="/apps" use:link>Apps</a>
    <Button onClick={openSendModal} color="white" classExtra="col-start-12 col-span-1">Send</Button>
</div>
