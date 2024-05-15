<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { writable, type Writable } from 'svelte/store';

	const {
		checked = writable(false)
	}: {
		checked: Writable<boolean>;
	} = $props();
</script>

<Checkbox bind:checked={$checked} />
