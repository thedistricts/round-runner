<script lang="ts">
	import { onDestroy, beforeUpdate } from 'svelte';
	import { isOpen } from '$lib/stores/checker.store';
	import { gpx } from '$lib/stores/gpx.store';
	import { Checkpoints } from '../../components/Checker/components';
	let hasGpx = false;

	const unsubscribeGpx = gpx.subscribe((geojson) => {
		hasGpx = geojson.features.length > 0;
	});

	onDestroy(() => {
		unsubscribeGpx();
	});

	beforeUpdate(() => {
		isOpen.set(false);
	});
</script>

{#if !hasGpx}
	<Checkpoints />
{/if}
