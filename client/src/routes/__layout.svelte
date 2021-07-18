<script>
	import '../app.css';
	import Header from '$lib/Header/index.svelte';
	import { jwt } from '$lib/stores';

	function handleAuth({ origin, data: { token } }) {
		if (origin !== import.meta.env.VITE_API_URL)
			return;

		if (token) {
			jwt.update(() => token);
		}
	};

	export const ssr = false;
</script>

<svelte:window on:message={handleAuth}/>

<Header />

<main>
	<slot />
</main>

<footer>
	{#if $jwt}
		Logged in!
	{:else}
		NOT logged in.
	{/if}
	<p></p>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}
</style>
