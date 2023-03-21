<script lang="ts">
	import { onMount } from 'svelte';
	import type { FeatureCollection, Point } from 'geojson';
	import Marker from './Marker.svelte';

	import type { PointProperties } from '../../../transports/PointProperties.d';

	let route: FeatureCollection<Point, PointProperties> = {
		type: 'FeatureCollection',
		features: []
	};

	onMount(async () => {
		const res = await fetch('data/frog-graham.json');
		const data = await res.json();
		route = data;
	});
</script>

{#each route.features as point}
	<Marker coordinates={point.geometry.coordinates} />
{/each}
