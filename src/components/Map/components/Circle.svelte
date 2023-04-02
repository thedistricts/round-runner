<script lang="ts">
	import * as turf from '@turf/turf';
	import type { Units } from '@turf/turf';

	import { getContext, onMount } from 'svelte';
	import { key } from '../Map.context';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';

	export let coordinates: Position;

	const { getMap } = getContext<MapContext>(key);

	// alternativly, add a geojson source
	// https://maplibre.org/maplibre-gl-js-docs/example/cluster/

	onMount(() => {
		const map = getMap();

		const radius = 0.001; // kilometer
		var options = {
			steps: 64,
			units: 'kilometers' as Units
		};

		var circle = turf.circle(coordinates, radius, options);

		map.addLayer({
			id: `location-radius:${coordinates.toString()}`,
			type: 'fill',
			source: {
				type: 'geojson',
				data: circle
			} as any,
			paint: {
				'fill-color': '#FF9B0D',
				'fill-opacity': 0.75
			}
		});

		map.addLayer({
			id: `location-radius-outline:${coordinates.toString()}`,
			type: 'line',
			source: {
				type: 'geojson',
				data: circle
			} as any,
			paint: {
				'line-color': '#FF9B0D',
				'line-width': 3
			}
		});
	});
</script>
