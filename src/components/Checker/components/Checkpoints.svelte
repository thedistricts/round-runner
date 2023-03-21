<script lang="ts">
	import { onMount } from 'svelte';
	import type { FeatureCollection, Point } from 'geojson';

	import type { PointProperties } from '../../../transports/PointProperties.d';

	let routeFeatures: FeatureCollection<Point, PointProperties> = {
		type: 'FeatureCollection',
		features: []
	};

	let isLoaded = false;

	onMount(async () => {
		const res = await fetch('data/frog-graham.json');
		const data = await res.json();
		routeFeatures = data;
		isLoaded = true;
	});
</script>

<div class="px-6 py-3 text-sm h-11">
	{#if isLoaded}
		{routeFeatures.features.length} Checkpoints
	{/if}
</div>
