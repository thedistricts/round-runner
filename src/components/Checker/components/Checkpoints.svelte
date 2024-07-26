<script lang="ts">
	import type { LngLatLike } from 'maplibre-gl';
	import type { Position } from 'geojson';

	import { route, routeFocus } from '$lib/stores/route.store';
	$: isLoaded = $route.features.length > 0;
	export let isOpen = false;

	function handleOnMapFocus(coordinates?: LngLatLike | Position) {
		if (!coordinates) throw new Error('No coordinates provided');
		routeFocus.set(coordinates as LngLatLike);
	}
</script>

{#if isLoaded}
	<h3 class="z-30 block sticky top-3 text-base font-normal text-stone-800 pointer-events-none">
		{$route.features.length}&nbsp;Checkpoints
	</h3>
	{#if isOpen}
		<ol class="text-sm text-stone-500 mt-4">
			{#each $route.features as feature, i}
				<li class="-ml-2">
					<button
						on:click={() => handleOnMapFocus(feature.geometry.coordinates)}
						class="px-2 py-1 hover:text-blue-500">{i + 1}:&nbsp;{feature.properties.name}</button
					>
				</li>
			{/each}
		</ol>
	{/if}
{/if}
