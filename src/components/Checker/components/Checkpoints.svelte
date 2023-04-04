<script lang="ts">
	import { getContext } from 'svelte';
	import type { Position } from 'geojson';
	import type { MapContext } from '../../Map/Map.context';
	import { fitBoundsWithPadding } from '$lib/utils';

	import { key } from '../../Map/Map.context';

	import { route } from '$lib/stores/route.store';
	$: isLoaded = $route.features.length > 0;
	export let isOpen = false;

	// const { getMap } = getContext<MapContext>(key);

	function handleOnMapFocus(coordinates?: Position) {
		if (!coordinates) throw new Error('No coordinates provided');
		console.log(coordinates);
		// const map = getMap();
		// if (map && bBox) {
		// 	fitBoundsWithPadding({ map, bBox });
		// }
	}
</script>

{#if !isOpen && isLoaded}
	<h3 class="sticky text-base font-normal text-stone-800">
		{$route.features.length} Checkpoints
	</h3>
{/if}

{#if isOpen && isLoaded}
	<h3 class="sticky text-base font-normal text-stone-800">
		{$route.features.length} Checkpoints
	</h3>

	<ol class="text-sm text-stone-500 mt-4">
		{#each $route.features as feature, i}
			<li class="py-1">
				<button on:click={() => handleOnMapFocus(feature.geometry.coordinates)}
					>{i + 1}: {feature.properties.name}</button
				>
			</li>
		{/each}
	</ol>
{/if}
