<script lang="ts">
	import type { FeatureCollection } from 'geojson';

	import { getContext, onMount } from 'svelte';
	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';

	const { getMap } = getContext<MapContext>(key);
	export let features: FeatureCollection;

	onMount(() => {
		const map = getMap();
		map.addSource('route', {
			type: 'geojson',
			data: features
		});
		map.addLayer({
			id: 'route',
			type: 'line',
			source: 'route',
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
</script>
