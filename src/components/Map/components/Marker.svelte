<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { Marker } from 'maplibre-gl';
	import { key } from '../Map.context';
	import { FEATURE_COLOUR } from '$lib/const';
	import type { Position } from 'geojson';

	import type { MapContext } from '../Map.context';
	import type { PointProperties } from '$lib/stores/route.store.d';

	export let coordinates: Position;
	export let properties: PointProperties;
	let marker: Marker;

	const { getMap } = getContext<MapContext>(key);

	onMount(() => {
		const map = getMap();
		const color = FEATURE_COLOUR.get(properties.featureType);
		marker = new Marker({ color }).setLngLat(coordinates as [number, number]).addTo(map);
	});

	onDestroy(() => {
		marker.remove();
	});
</script>
