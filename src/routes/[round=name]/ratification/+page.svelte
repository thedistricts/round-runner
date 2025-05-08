<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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
		if (hasGpx) isOpen.set(true);
	});
</script>

<Results />
