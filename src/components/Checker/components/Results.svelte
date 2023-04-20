<script lang="ts">
	import { onDestroy } from 'svelte';
	import dayjs from 'dayjs';
	import type { LngLatLike } from 'maplibre-gl';
	import type { Position } from 'geojson';
	import { HOURS } from '$lib/const';
	import { kilometersToMeters } from '$lib/utils';

	import { ratification, results, resultsFocus } from '$lib/stores/ratification.store';
	import { Loader } from './';

	let hasRatificationResults = false;
	$: warnings = $results?.warnings ?? [];
	$: failed = $results?.invalids ?? [];
	$: valids = $results?.valids ?? [];

	const unsubscribe = ratification.subscribe((results) => {
		hasRatificationResults = results.length > 0;
	});

	onDestroy(unsubscribe);

	function handleOnMapFocus(coordinates?: LngLatLike | Position) {
		if (!coordinates) throw new Error('No coordinates provided');
		resultsFocus.set(coordinates as LngLatLike);
	}
</script>

{#if hasRatificationResults}
	<h3 class="z-30 block sticky top-3 text-base font-normal text-stone-800 pointer-events-none">
		Checkpoints
	</h3>
	<div class="pt-3">
		{#if failed.length > 0}
			<div class="py-3 flex flex-col gap-3 text-red-500">
				<h4 class="text-sm font-semibold">Failed</h4>
				{#each failed as failedFeature}
					<button
						class="
							relative z-10 py-4 flex flex-col 
							bg-white border-2 border-red-500 rounded hover:bg-gray-100
							shadow"
						on:click={() => handleOnMapFocus(failedFeature.geometry.coordinates)}
					>
						<div class="px-7 text-left">
							<div class="font-semibold">
								{failedFeature.properties.name}
							</div>
							<div class="text-xs text-neutral-500">
								nearest point: {kilometersToMeters(failedFeature.properties.dist)}m
							</div>
						</div>
						{#if failedFeature.properties.time}
							<div class="absolute top-4 right-3 text-sm text-neutral-400">
								{dayjs(failedFeature.properties.time).format(HOURS)}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if warnings.length > 0}
			<div class="py-3 flex flex-col gap-3 text-orange-500">
				<h4 class="text-sm font-semibold">Warnings</h4>
				{#each warnings as warningFeature}
					<button
						class="relative z-10 py-4 flex flex-col 
							bg-white border-2 border-gray-200 rounded hover:bg-gray-100
							shadow"
						on:click={() => handleOnMapFocus(warningFeature.geometry.coordinates)}
					>
						<div class="px-7 text-left">
							<div>
								{warningFeature.properties.name}
							</div>
							<div class="text-xs text-neutral-500">
								nearest point: {kilometersToMeters(warningFeature.properties.dist)}m
							</div>
						</div>
						{#if warningFeature.properties.time}
							<div class="absolute top-4 right-3 text-sm text-neutral-400">
								{dayjs(warningFeature.properties.time).format(HOURS)}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}

		{#if valids.length > 0}
			<div class="py-3 flex flex-col gap-3">
				<h4 class="text-green-500 text-sm font-semibold">Valid</h4>
				{#each valids as validFeature}
					<button
						class="relative z-10 py-4 flex items-center
							bg-white border-2 border-gray-200 rounded hover:bg-gray-100
							shadow"
						on:click={() => handleOnMapFocus(validFeature.geometry.coordinates)}
					>
						<div class="px-7">
							<div>
								{validFeature.properties.name}
							</div>
						</div>
						{#if validFeature.properties.time}
							<div class="ml-auto px-3 text-sm text-neutral-400">
								{dayjs(validFeature.properties.time).format(HOURS)}
							</div>
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}
{#if !hasRatificationResults}
	<div class="text-center py-8">
		<Loader />
	</div>
{/if}
