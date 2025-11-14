<script lang="ts">
	import { onMount } from 'svelte';
	// import { get } from 'svelte/store';
	// import { goto } from '$app/navigation';
	// import { page } from '$app/stores';
	import { isOpen } from '$lib/stores/checker.store';
	// import { gpx } from '$lib/stores/gpx.store';
	import { Results } from '../../../components/Checker/components';

	onMount(() => {
		// const currentGpx = get(gpx);
		// if (currentGpx.features.length === 0) {
		// 	goto(`/${$page.params.round}/`);
		// 	return;
		// }
		isOpen.set(true);
	});
</script>

<Results />
