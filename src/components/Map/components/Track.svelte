<script lang="ts">
	import { gpx } from '../../../stores/gpx.store';
	import Line from './Line.svelte';

	import { getContext, onMount } from 'svelte';
	import { fitBoundsWithPadding } from '../../../utils/map';
	import { gpxBBox } from '../../../stores/gpx.store';

	import { key } from '../Map.context';
	import type { MapContext } from '../Map.context';
	const { getMap } = getContext<MapContext>(key);

	$: isLoaded = $gpx.features.length > 0;

	onMount(() => {
		gpxBBox.subscribe((bBox) => {
			const map = getMap();
			if (map && bBox) {
				fitBoundsWithPadding({ map, bBox });
			}
		});
	});
</script>

{#if isLoaded}
	<Line features={$gpx} />
{/if}
