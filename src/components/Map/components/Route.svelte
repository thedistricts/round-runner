<script lang="ts">
	import * as turf from '@turf/turf';

	import { getContext, onDestroy } from 'svelte';
	import { fitBoundsWithPadding } from '$lib/utils';
	import { route, routeBBox } from '$lib/stores/route.store';
	import Marker from './Marker.svelte';
	import ValidityBoundary from './ValidityBoundary.svelte';

	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	const unsubscribe = routeBBox.subscribe((bBox) => {
		const map = getMap();
		if (map && bBox) {
			fitBoundsWithPadding({ map, bBox, animate: false });
		}
	});

	onDestroy(unsubscribe);
</script>

{#each $route.features as point}
	<Marker coordinates={turf.getCoord(point)} properties={point.properties} />
	<ValidityBoundary coordinates={turf.getCoord(point)} properties={point.properties} />
{/each}
