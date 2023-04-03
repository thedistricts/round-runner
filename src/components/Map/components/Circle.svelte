<script lang="ts">
	import * as turf from '@turf/turf';
	import type { Units } from '@turf/turf';

	import { getContext, onMount, onDestroy } from 'svelte';
	import { key } from '../Map.context';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';

	export let coordinates: Position;
	export let radius: number  = 0.001; // kilometer
	export let colour: string = '#FF9B0D';
	export let lineWidth: number = 3;
	export let opacity: number = 0.75;

	const { getMap } = getContext<MapContext>(key);

	const DRAW_OPTIONS = {
		steps: 128,
		units: 'kilometers' as Units
	};

	const map = getMap();
	const id = `${coordinates.toString()}:${radius}:${colour}`;

	onMount(() => {
		const hasCircleSource = map.getSource(`location-source:${id}`);

		if (!hasCircleSource) {
		const circle = turf.circle(coordinates, radius, DRAW_OPTIONS);

			map.addSource(`location-source:${id}`, {
				type: 'geojson',
				data: circle
			});

			map.addLayer({
				id: `location-radius:${id}`,
				type: 'fill',
				source: `location-source:${id}`,
				paint: {
					'fill-color': colour,
					'fill-opacity': opacity
				}
			});

			map.addLayer({
				id: `location-radius-outline:${id}`,
				type: 'line',
				source: `location-source:${id}`,
				paint: {
					'line-color': colour,
					'line-width': lineWidth,
					'line-opacity': opacity
				}
			});
		}
	});

	onDestroy(() => {
		map.removeSource(`location-source:${id}`);
		map.removeLayer(`location-radius:${id}`);
		map.removeLayer(`location-radius-outline:${id}`);
	});
</script>
