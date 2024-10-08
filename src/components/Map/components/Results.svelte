<script lang="ts">
	import { getContext, onDestroy } from 'svelte';
	import * as turf from '@turf/turf';
	import { fitPositionWithOffset } from '$lib/utils';
	import { ratification, resultsFocus } from '$lib/stores/ratification.store';

	import TimeIcon from './TimeIcon.svelte';
	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	const unsubscribeRouteFocus = resultsFocus.subscribe((position) => {
		const map = getMap();
		fitPositionWithOffset({ map, position, animate: true, maxZoom: 17 });
	});

	onDestroy(() => {
		unsubscribeRouteFocus();
	});
</script>

{#each $ratification as point}
	{#if point.properties.time && point?.geometry?.coordinates.length > 0}
		<TimeIcon coordinates={turf.getCoord(point)} time={point.properties.time} />
	{/if}
{/each}
