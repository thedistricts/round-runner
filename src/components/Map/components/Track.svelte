<script lang="ts">
	import { gpx } from '$lib/stores/gpx.store';
	import Line from './Line.svelte';

	import { getContext, onMount } from 'svelte';
	import { fitBoundsWithPadding } from '$lib/utils/map';
	import { gpxBBox } from '$lib/stores/gpx.store';

	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	$: isLoaded = $gpx.features.length > 0;
	const map = getMap();

	onMount(() => {
		gpxBBox.subscribe((bBox) => {
			if (map && bBox) {
				fitBoundsWithPadding({ map, bBox });
			}
		});
	});
</script>

{#if isLoaded}
	<Line features={$gpx} />
{/if}
