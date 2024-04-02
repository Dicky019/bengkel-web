<script lang="ts">
	import AdminMainLayout from '$components/layout/admin-main-layout.svelte';
	const { data } = $props();
	const { layout, collapsed, navCollapsedSize, user } = data;

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

<AdminMainLayout
	{user}
	{isCollapsed}
	{layout}
	{navCollapsedSize}
	{onLayoutChange}
	{onCollapse}
	{onExpand}
>
	<slot />
</AdminMainLayout>
