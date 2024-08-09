<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';
	import type { FeatureCollection } from 'geojson';
	const { getMap } = getContext<MapContext>(key);
	export let features: FeatureCollection;

	const ID_ROUTE = 'route';

	onMount(() => {
		const map = getMap();
			map.addSource(ID_ROUTE, {
				type: 'geojson',
				data: features
			});
			map.addLayer({
				id: ID_ROUTE,
				type: 'line',
				source: ID_ROUTE,
				layout: {
					'line-join': 'round',
					'line-cap': 'round'
				},
				paint: {
					'line-color': '#4F46E5',
					'line-width': 3
				}
			});
	});

	onDestroy(() => {
		const map = getMap();
		if (map.getLayer(ID_ROUTE)) map.removeLayer(ID_ROUTE);
		if (map.getSource(ID_ROUTE)) map.removeSource(ID_ROUTE);
	});
</script>
