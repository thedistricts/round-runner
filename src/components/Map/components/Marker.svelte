<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { key } from '../Map.context';
	import { Marker } from 'maplibre-gl';
	import { FEATURE_COLOUR } from '$lib/const';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';
	import type { PointProperties } from '$lib/stores/route.store.d';

	export let coordinates: Position;
	export let properties: PointProperties;

	const { getMap } = getContext<MapContext>(key);

	onMount(() => {
		const map = getMap();
		const color = FEATURE_COLOUR.get(properties.featureType);
		new Marker({ color }).setLngLat(coordinates as [number, number]).addTo(map);
	});
</script>
