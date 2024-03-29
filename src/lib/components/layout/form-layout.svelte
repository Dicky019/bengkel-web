<script lang="ts">
	import Separator from '../ui/separator/separator.svelte';

	const { title } = $props<{
		title: string;
	}>();
</script>

<div class="flex flex-col">
	<div class="flex items-center px-4 py-4 pt-5">
		<h1 class="text-xl font-bold">New {title}</h1>
	</div>
	<Separator />
	<slot />
</div>
