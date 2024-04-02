<script lang="ts">
	import ScrollArea from '$components/ui/scroll-area/scroll-area.svelte';
	import Separator from '$components/ui/separator/separator.svelte';
	import SearchForm from '$components/search-form.svelte';
	import * as Resizable from '$components/ui/resizable';
	import * as Tooltip from '$components/ui/tooltip';
	import * as Avatar from '$components/ui/avatar';
	import Nav from '$components/nav.svelte';
	import { cn } from '$lib/utils';
	import { Button } from '$components/ui/button';
	import Icons from '$components/icons';
	import { primaryRoutes } from '$lib/config';
	import type { User } from 'lucia';
	import { page } from '$app/stores';

	const { layout, onLayoutChange, onCollapse, onExpand, navCollapsedSize, isCollapsed, user } =
		$props<{
			layout: number[];
			onLayoutChange: (sizes: number[]) => void;
			onCollapse: () => void;
			onExpand: () => void;
			navCollapsedSize: number;
			isCollapsed: boolean;
			user: User;
		}>();

	const { title, isSearch } = $derived($page.data.adminData);

	// layoutStore.subscribe((v) => {
	// 	console.log(v);
	// });
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
										<Avatar.Image src={user.imageUrl} alt={'User Image'} />
										<Avatar.Fallback>{user.initials}</Avatar.Fallback>
									</Avatar.Root>
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content side="right" class="flex items-center gap-4">
								{`${user.name}`}
							</Tooltip.Content>
						</Tooltip.Root>
					{:else}
						<Avatar.Root>
							<Avatar.Image src={user.imageUrl} alt={'User Image'} />
							<Avatar.Fallback>{user.initials}</Avatar.Fallback>
						</Avatar.Root>
					{/if}
					<div
						class={cn(
							'flex w-full flex-row items-center justify-between gap-2 text-ellipsis',
							isCollapsed && 'hidden'
						)}
					>
						<span class="font-bold">{user.name}</span>
					</div>

					<Tooltip.Root openDelay={0}>
						<Tooltip.Trigger asChild let:builder>
							<Button href="/auth/logout" builders={[builder]} variant="ghost" size="sm">
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
	<Resizable.Handle withHandle />
	<Resizable.Pane defaultSize={layout[1]} minSize={30}>
		<!-- Main -->
		<div class={cn('flex items-center justify-between px-4 py-3', !isSearch && 'py-4 pt-5')}>
			<h1 class="text-xl font-bold">{title}</h1>
			{#if isSearch}
				<!-- content here -->
				<SearchForm />
			{/if}
		</div>
		<Separator />
		<ScrollArea class="h-screen p-4 pb-20">
			<slot />
		</ScrollArea>
		<!-- End Main -->
	</Resizable.Pane>
</Resizable.PaneGroup>
