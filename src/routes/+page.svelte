<script lang="ts">
	const { data } = $props();

	$effect(() => {
		console.log({ data });
	});
</script>

<div class="container flex items-center justify-center">
	{data.accessToken}
	<div class="w-full md:w-[600px]">
		<header>
			<h2 class="text-xl font-bold">Basic Todo App</h2>
		</header>
		<div class="flex flex-col gap-4">
			<p>Please login to use this new an exciting feature</p>
			<a
				href="/auth/login/google"
				class="rounded-lg bg-white p-4 font-mono font-bold text-black shadow-md"
				>Sign in with Github</a
			>
		</div>
	</div>
</div>
