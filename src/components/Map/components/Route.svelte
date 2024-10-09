<script lang="ts">
	import * as turf from '@turf/turf';

	import { getContext, onDestroy } from 'svelte';
	import { fitBoundsWithPadding, fitPositionWithOffset } from '$lib/utils';
	import { viewport } from '$lib/stores/viewport.store';
	import { route, routeBBox, routeFocus } from '$lib/stores/route.store';
	import Marker from './Marker.svelte';
	import ValidityBoundary from './ValidityBoundary.svelte';

	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);
	let isFirstRender = true;

	const unsubscribeRouteBBox = routeBBox.subscribe((bBox) => {
		const map = getMap();
		const isValidBBox = !bBox.includes(Infinity);
		if (isValidBBox) {
			fitBoundsWithPadding({ map, bBox, animate: !isFirstRender, isMobile: $viewport.isMobile });
			isFirstRender = false;
		}
	});

	const unsubscribeRouteFocus = routeFocus.subscribe((position) => {
		const map = getMap();
		const isValidPosition = !!position;
		if (isValidPosition) {
			fitPositionWithOffset({ map, position, animate: true, isMobile: $viewport.isMobile });
		}
	});

	onDestroy(() => {
		unsubscribeRouteBBox();
		unsubscribeRouteFocus();
	});
</script>

{#each $route.features as point (point.properties)}
	<Marker coordinates={turf.getCoord(point)} properties={point.properties} />
	<ValidityBoundary coordinates={turf.getCoord(point)} properties={point.properties} />
{/each}
