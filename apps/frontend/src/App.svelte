<script lang="ts">
	import Card from "./Card.svelte";
	export let name: string;
</script>

<main>
	<Card>
		<h1 class="bg-clip-text text-transparent font-bold text-3xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Welcome to {name}!</h1>
		<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
	</Card>
</main>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>
