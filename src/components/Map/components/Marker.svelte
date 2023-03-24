<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { key } from '../Map.context';
	import { Marker } from 'maplibre-gl';
	import { POINT_FEATURE } from '../../../enum';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';
	import type { PointProperties } from '../../../stores/route.store.d';

	export let coordinates: Position;
	export let properties: PointProperties;

	const { getMap } = getContext<MapContext>(key);

	const COLOUR = new Map([
		[POINT_FEATURE.CHECKPOINT, '#000000'],
		[POINT_FEATURE.SUMMIT, '#FF0000'],
		[POINT_FEATURE.WATER_ENTRY, '#6FDBFF'],
		[POINT_FEATURE.WATER_EXIT, '#6FDBFF']
	])

	onMount(() => {
		const map = getMap();
		const color = COLOUR.get(properties.feature);
		new Marker({ color }).setLngLat(coordinates as [number, number]).addTo(map);
	});
</script>
