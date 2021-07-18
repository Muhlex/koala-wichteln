<script context="module">
	import { jwt } from '$lib/stores';

	function signOut() {
		jwt.update(() => null);
	};
</script>

<style>
	button {
		padding: 12px 12px;
		border: none;
		border-radius: 4px;
		color: white;
		background-color: darkred;
		margin-right: 12px;
	}
</style>

<button on:click={signOut}>Sign out</button>
