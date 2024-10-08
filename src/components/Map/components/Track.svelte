<script lang="ts">
	import { gpx } from '$lib/stores/gpx.store';
	import Line from './Line.svelte';

	import { getContext, onDestroy } from 'svelte';
	import { viewport } from '$lib/stores/viewport.store';
	import { fitBoundsWithPadding } from '$lib/utils';
	import { gpxBBox } from '$lib/stores/gpx.store';

	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	$: isLoaded = $gpx.features.length > 0;

	const unsubscribe = gpxBBox.subscribe((bBox) => {
		const map = getMap();

		fitBoundsWithPadding({ map, bBox, animate: true, delay: 250, isMobile: $viewport.isMobile });
	});

	onDestroy(unsubscribe);
</script>

{#if isLoaded}
	<Line features={$gpx} />
{/if}
