<script lang="ts">
	import { Button } from './ui/button/index';
	import { cn } from '$lib/utils';
	import * as Tooltip from './ui/tooltip/index';
	import type { Route } from '$lib/config/index';
	import { page } from '$app/stores';

	// export let isCollapsed: boolean;
	// export let routes: Route[];
	const { isCollapsed, routes } = $props<{
		isCollapsed: boolean;
		routes: Route[];
	}>();
	const { title } = $derived($page.data.adminData);

	const isActive = (path: string) => {
		return title.toLocaleLowerCase() === path.toLocaleLowerCase();
	};
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Root openDelay={0}>
					<Tooltip.Trigger asChild let:builder>
						<Button
							href={route.href}
							builders={[builder]}
							variant={isActive(route.title) ? 'default' : 'ghost'}
							size="icon"
							class={cn(
								'size-10',
								isActive(route.title) &&
									'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
							)}
						>
							<svelte:component this={route.icon} class="size-5" aria-hidden="true" />
							<span class="sr-only">{route.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex items-center gap-4">
						{route.title}
					</Tooltip.Content>
				</Tooltip.Root>
			{:else}
				<Button
					href={route.href}
					variant={isActive(route.title) ? 'default' : 'ghost'}
					size="default"
					class={cn('justify-start', {
						'dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white':
							isActive(route.title) && 'default'
					})}
				>
					<svelte:component this={route.icon} class="mr-4 size-6" aria-hidden="true" />
					<span>{route.title}</span>
				</Button>
			{/if}
		{/each}
	</nav>
</div>
