<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Position } from 'geojson';
	import { key } from '../Map.context';
	import { Marker } from 'maplibre-gl';
	import type { MapContext } from '../Map.context';

	export let coordinates: Position;

	const { getMap } = getContext<MapContext>(key);

	onMount(() => {
		const map = getMap();
		new Marker({ color: '#FF0000' }).setLngLat(coordinates as [number, number]).addTo(map);
	});
</script>
