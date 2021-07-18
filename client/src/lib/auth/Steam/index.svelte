<script context="module">
	function openSteamAuth() {
		window.open(
			`${import.meta.env.VITE_API_URL}/auth/steam`,
			'auth-popup',
			'width=1024,height=760'
		);
	};
</script>

<style>
	button {
		padding: 12px 12px;
		border: none;
		border-radius: 4px;
		color: white;
		background-color: #222;
		margin-right: 12px;
	}
</style>

<button on:click={openSteamAuth}>Sign-in with Steam</button>
