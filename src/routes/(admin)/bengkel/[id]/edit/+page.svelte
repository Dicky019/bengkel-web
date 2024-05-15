<script lang="ts">
	import BengkelForm from '$components/features/bengkel/bengkel-form.svelte';

	const { data } = $props();
</script>

<BengkelForm
	users={data.users}
	form={data.form}
	data={{
		name: data.bengkel.name,
		userId: data.bengkel.userId,
		noTelephone: data.bengkel.noTelephone,
		alamat: data.bengkel.alamat,
		lat: data.bengkel.geo?.lat ?? '',
		long: data.bengkel.geo?.long ?? ''
	}}
	user={data.bengkel.user}
/>
