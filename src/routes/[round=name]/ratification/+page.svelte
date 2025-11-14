<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { isOpen } from '$lib/stores/checker.store';
	import { gpx } from '$lib/stores/gpx.store';
	import { Results } from '../../../components/Checker/components';

	$: hasGpx = false;

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
	});

	onDestroy(() => {
		unsubscribeGpx();
	});

	onMount(() => {
		const currentGpx = get(gpx);
		if (currentGpx.features.length === 0) {
			goto(`/${$page.params.round}/`);
			return;
		}
		if (hasGpx) {
			isOpen.set(true);
		}
	});
</script>

<Results />
