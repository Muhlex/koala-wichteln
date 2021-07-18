<script context="module">
	export const load = async ({ fetch }) => {
		const res = await fetch(`${import.meta.env.VITE_API_URL}/events/current`);

		if (res.ok) return { props: { event: await res.json() } };

		const { message } = await res.json();
		return {
			status: res.status,
			error: new Error(message)
		};
	};
</script>

<script>
	import { jwt } from '$lib/stores';

	import SignIn from '$lib/auth/Steam/index.svelte';
	import SignOut from '$lib/auth/SignOut.svelte';

	export let event;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>koalaWichteln</h1>

	<h2>Current Event: {event.title}</h2>
	<pre>
Geht los: {new Date(event.dates.start).toLocaleDateString()}
Geschenkabgabe: {new Date(event.dates.deadline).toLocaleDateString()}
Vergabe vom Kram: {new Date(event.dates.end).toLocaleString()}
	</pre>

	<div style="display: flex; align-items: center">
		{#each event.participants as { user }}
			<div style="margin-left: 1em;">
				<a href={`https://steamcommunity.com/profiles/${user.steamId}`} target="_blank" rel="noopener noreferrer">
					<img src={user.avatar} alt="" />
					{user.name}
				</a>
			</div>
		{/each}
	</div>

	<h3>Make with?! Here you go:</h3>
	{#if !$jwt}
		<SignIn />
	{:else}
		<SignOut />
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
