<script lang="ts">
	import AdminMainLayout from '$components/layout/admin-main-layout.svelte';
	const { data } = $props();
</script>

<AdminMainLayout layout={data.layout} title={data.title}>
	<span slot="main">main</span>
</AdminMainLayout>
