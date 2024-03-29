<script lang="ts">
	import { Toaster } from '$components/ui/sonner';
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	// import toast, { Toaster } from 'svelte-french-toast';
	import { getFlash } from 'sveltekit-flash-message';
	import { page } from '$app/stores';
	import { toast } from 'svelte-sonner';

	const flash = getFlash(page);

	$effect(() => {
		if ($flash) {
			const { type, message } = $flash;

			toast[type](message);
			// console.log({ type, message });

			// toast.loading('waiting...');
			// Clear the flash message to avoid double-toasting.
			$flash = undefined;
		}
	});
</script>

<ModeWatcher defaultMode="system" />

<slot />

<Toaster />
