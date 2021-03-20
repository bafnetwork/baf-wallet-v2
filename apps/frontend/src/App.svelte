<script lang="ts">
	import Router from 'svelte-spa-router'
	import Login from './pages/Login.svelte'
	import Account from './pages/Account.svelte'
	import ApproveRedirect from './pages/ApproveRedirect.svelte'
	import NotFound404 from './pages/NotFound404.svelte';
	
	const routesLoggedIn = {
		'/': Account,
		'/approve-redirect/:toAccount/:amount': ApproveRedirect,
		'/*': NotFound404
	}
	const routesLoggedOut = {
		'/login': Login,
		'/:attemptedRoute': Login
	}

	// TODO: implement with state 
	async function init() : Promise<boolean> {
		return true
	}
	const initProm = init()
</script>

<style global lang="postcss">
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
</style>

<main>
	{#await initProm}
		<p>Loading...</p>
	{:then loggedIn}
		<Router routes={loggedIn ? routesLoggedIn : routesLoggedOut} />
	{:catch error}
		<p>An error occured loading the page</p>
	{/await}
</main>
