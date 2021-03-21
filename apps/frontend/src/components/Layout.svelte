<script lang="ts">
    import Navbar from "./Navbar.svelte"
    import Footer from "./Footer.svelte"
</script>

<div class="container min-w-full mx-auto">
    <Navbar/>
    <div class="flex flex-col py-6 auto-rows-min">
        <slot></slot>
    </div>
    <div class="absolute bottom-0 min-w-full"><Footer/></div>
</div>