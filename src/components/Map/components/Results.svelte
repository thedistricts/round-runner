<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import * as turf from '@turf/turf';
	import { fitPositionWithOffset } from '$lib/utils';
	import { ratification, resultsFocus } from '$lib/stores/ratification.store';

	import Circle from './Circle.svelte';
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
	{#if point?.geometry?.coordinates.length > 0}<Circle coordinates={turf.getCoord(point)} />{/if}
{/each}
