<script lang="ts">
	import * as turf from '@turf/turf';
	import type { Units } from '@turf/turf';

	import { getContext, onMount, onDestroy } from 'svelte';
	import { key } from '../Map.context';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';

	export let coordinates: Position;
	export let radius: number = 0.001; // kilometer
	export let colour: string = '#FF9B0D';
	export let lineWidth: number = 3;
	export let opacity: number = 0.75;

	const { getMap } = getContext<MapContext>(key);

	const DRAW_OPTIONS = {
		steps: 128,
		units: 'kilometers' as Units
	};

	const id = `${coordinates.toString()}:${radius}:${colour}`;
	const innerCircleId = `location-radius:${id}`;
	const outerCircleId = `location-radius-outline:${id}`;
	const sourceId = `location-source:${id}`;
	const map = getMap();

	function cleanUp() {
		if (map.getLayer(innerCircleId)) map.removeLayer(innerCircleId);
		if (map.getLayer(outerCircleId)) map.removeLayer(outerCircleId);
		if (map.getSource(sourceId)) map.removeSource(sourceId);
	}

	function addLayers() {
		cleanUp();
		const circle = turf.circle(coordinates, radius, DRAW_OPTIONS);
		const minzoom = 14;
		map.addSource(sourceId, {
			type: 'geojson',
			data: circle
		});

		map.addLayer({
			id: innerCircleId,
			type: 'fill',
			source: sourceId,
			minzoom,
			paint: {
				'fill-color': colour,
				'fill-opacity': opacity
			}
		});

		map.addLayer({
			id: outerCircleId,
			type: 'line',
			source: sourceId,
			minzoom,
			paint: {
				'line-color': colour,
				'line-width': lineWidth,
				'line-opacity': opacity
			}
		});
	}

	onMount(() => {
		map.once('idle', () => {
			addLayers();
		});
	});

	onDestroy(cleanUp);
</script>
