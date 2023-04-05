<script lang="ts">
	import * as turf from '@turf/turf';

	import { getContext, onDestroy } from 'svelte';
	import { fitBoundsWithPadding, fitPositionWithOffset } from '$lib/utils';
	import { route, routeBBox, routeFocus } from '$lib/stores/route.store';
	import Marker from './Marker.svelte';
	import ValidityBoundary from './ValidityBoundary.svelte';

	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	const unsubscribeRouteBBox = routeBBox.subscribe((bBox) => {
		const map = getMap();
		fitBoundsWithPadding({ map, bBox, animate: true });
	});

	const unsubscribeRouteFocus = routeFocus.subscribe((position) => {
		const map = getMap();
		fitPositionWithOffset({ map, position, animate: true });
	});

	onDestroy(() => {
		unsubscribeRouteBBox();
		unsubscribeRouteFocus();
	});
</script>

{#each $route.features as point}
	<Marker coordinates={turf.getCoord(point)} properties={point.properties} />
	<ValidityBoundary coordinates={turf.getCoord(point)} properties={point.properties} />
{/each}
