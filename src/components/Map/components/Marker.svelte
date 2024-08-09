<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { Marker } from 'maplibre-gl';
	import { key } from '../Map.context';
	import { FEATURE_COLOUR } from '$lib/const';
	import type { Position } from 'geojson';

	import type { Map, MapContext } from '../Map.context';
	import type { PointProperties } from '$lib/stores/route.store.d';

	export let coordinates: Position;
	export let properties: PointProperties;
	let marker: Marker;
	let map: Map;

	const { getMap } = getContext<MapContext>(key);

	function addMarker() {
		const color = FEATURE_COLOUR.get(properties.featureType);
		marker = new Marker({ color }).setLngLat(coordinates as [number, number]).addTo(map);
	}

	onMount(() => {
		map = getMap();
		map.isStyleLoaded() 
			? addMarker() 
			: map.on('load', () => addMarker());
	});

	onDestroy(() => {
		if (marker) marker.remove();
	});
</script>
