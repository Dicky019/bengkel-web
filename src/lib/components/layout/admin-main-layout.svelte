<script lang="ts">
	import Separator from '$components/ui/separator/separator.svelte';
	import SearchForm from '$components/search-form.svelte';
	import * as Resizable from '$components/ui/resizable';
	import { ScrollArea } from '../ui/scroll-area';
	// import { ScrollArea } from '../ui/scroll-area';
	const {
		layout,
		title,
		form = false
	} = $props<{
		layout: number[];
		title: string;
		form?: boolean;
	}>();
</script>

<Resizable.Handle withHandle />
<Resizable.Pane defaultSize={layout[1]} minSize={30}>
	<!-- Main -->
	<div class="flex items-center justify-between px-4 py-3">
		<h1 class="text-xl font-bold">{title}</h1>
		<SearchForm />
	</div>
	<Separator />
	<ScrollArea class="h-screen pb-20">
		<slot name="main" />
	</ScrollArea>
	<!-- End Main -->
</Resizable.Pane>

{#if form}
	<Resizable.Handle class="max-lg:hidden" withHandle />
	<Resizable.Pane class="max-lg:hidden" defaultSize={layout[2]}>
		<!-- New -->
		<div class="flex items-center px-4 py-4 pt-5">
			<h1 class="text-xl font-bold">New {title}</h1>
		</div>
		<Separator />
		<slot name="form" />
		<!-- End New -->
	</Resizable.Pane>
{/if}
