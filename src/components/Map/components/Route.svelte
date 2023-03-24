<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { fitBoundsWithPadding } from '../../../utils/map';
	import { route, routeBBox } from '../../../stores/route.store';
	import Marker from './Marker.svelte';

	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	onMount(() => {
		routeBBox.subscribe((bBox) => {
			const map = getMap();
			if (map && bBox) {
				fitBoundsWithPadding({ map, bBox });
			}
		});
	});
</script>

{#each $route.features as point}
	<Marker
		coordinates={point.geometry.coordinates}
		properties={point.properties}
	/>
{/each}
