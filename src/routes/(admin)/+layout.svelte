<script lang="ts">
	import Icons from '$lib/components/icons';
	import * as Avatar from '$components/ui/avatar/';
	import { cn } from '$lib/utils';
	import * as Resizable from '$components/ui/resizable/index';
	import { Separator } from '$components/ui/separator/index';
	import Button from '$components/ui/button/button.svelte';
	import * as Tooltip from '$components/ui/tooltip';
	import { primaryRoutes } from '$lib/config';
	import Nav from '$lib/components/nav.svelte';

	const { data } = $props();
	const { layout, collapsed, navCollapsedSize } = data;
	let isCollapsed = $state(collapsed);

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)}`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true}`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false}`;
	}
</script>

<Resizable.PaneGroup
	direction="horizontal"
	{onLayoutChange}
	class="h-full max-h-screen items-stretch"
>
	<Resizable.Pane
		defaultSize={layout[0]}
		collapsedSize={navCollapsedSize}
		collapsible
		minSize={15}
		maxSize={20}
		spellcheck
		{onCollapse}
		{onExpand}
	>
		<!-- Nav -->
		<div class="flex h-screen flex-col justify-between">
			<div>
				<div
					class={cn(
						'my-4 flex items-center justify-center pt-1',
						isCollapsed ? 'my-1 h-[52px]' : 'justify-start px-4'
					)}
				>
					<h1 class={cn('text-xl font-bold', isCollapsed && 'text-center text-3xl')}>
						{isCollapsed ? 'B' : 'Bengkel'}
					</h1>
				</div>
				<Separator class={cn(isCollapsed && 'mt-2')} />
				<Nav {isCollapsed} routes={primaryRoutes} />
			</div>
			<div class="flex flex-col">
				<Separator />
				<div
					class={cn(
						'my-2 flex gap-4 p-2',
						isCollapsed
							? 'mx-1 flex-col items-center justify-center '
							: 'items-center justify-start '
					)}
				>
					{#if isCollapsed}
						<Tooltip.Root openDelay={0}>
							<Tooltip.Trigger asChild let:builder>
								<Button variant="ghost" builders={[builder]} size="icon" class="rounded-full">
									<Avatar.Root>
										<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
										<Avatar.Fallback>CN</Avatar.Fallback>
									</Avatar.Root>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content side="right" class="flex items-center gap-4">
								Dicky Darmawan
							</Tooltip.Content>
						</Tooltip.Root>
					{:else}
						<Avatar.Root>
							<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
							<Avatar.Fallback>CN</Avatar.Fallback>
						</Avatar.Root>
					{/if}
					<div
						class={cn(
							'flex w-full flex-row items-center justify-between gap-2 text-ellipsis',
							isCollapsed && 'hidden'
						)}
					>
						<span class="font-bold">Dicky Darmawan</span>
					</div>

					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger asChild let:builder>
							<Button href="#" builders={[builder]} variant="ghost" size="sm">
								<Icons.logout class="size-4" aria-hidden="true" />
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" class="flex items-center gap-4">Logout</Tooltip.Content>
					</Tooltip.Root>
				</div>
			</div>
		</div>
		<!-- End Nav -->
	</Resizable.Pane>
	<slot />
</Resizable.PaneGroup>
