<script lang="ts">
    import Navbar from "./Navbar.svelte"
</script>

<div class="container min-w-full mx-auto">
    <Navbar/>
    <div class="flex flex-col py-6 auto-rows-min">
        <slot></slot>
    </div>
    <div class="absolute bottom-0 text-lg text-center">TODO: Footer</div>
</div>