<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import randomColor from 'randomcolor';
	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);
	export let features: any;
	export let color: any = '#000FFF';
	export let index: number = 0;

	const ID_ROUTE = `debug:${color}:${index}`;

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
				'line-color': `${randomColor({ seed: ID_ROUTE, luminosity: 'bright', alpha: 0.2 })}`,
				'line-width': 3
			}
		});
	});

	onDestroy(() => {
		const map = getMap();
		map.removeLayer(ID_ROUTE);
		map.removeSource(ID_ROUTE);
	});
</script>
