<script lang="ts">
	import type { PageData } from '../../../routes/[round=name]/$types';
	import type { LngLatLike } from 'maplibre-gl';
	import type { Position } from 'geojson';
	import { page } from '$app/stores';
	import { isOpen } from '$lib/stores/checker.store';
	import { viewport } from '$lib/stores/viewport.store';
	import { route, routeFocus } from '$lib/stores/route.store';
	import { getUrlWithParams } from '$lib/utils';
	import { URL_PARAM } from '$lib/enum';
	$: pageUrlSlug = $page.data.slug as PageData['slug'];
	$: rounds = $page.data.rounds as PageData['rounds'];

	$: isLoaded = $route.features.length > 0;

	function handleOnMapFocus(coordinates?: LngLatLike | Position) {
		if (!coordinates) throw new Error('No coordinates provided');
		if ($viewport.isMobile) {
			$isOpen = false;
		}
		routeFocus.set(coordinates as LngLatLike);
	}

	function handleOnClick() {
		$isOpen = !$isOpen;
	}

	$: routeInformationUrl = getUrlWithParams({
		when: $isOpen,
		with: URL_PARAM.ROUTE_INFORMATION
	});

	$: activeRound = rounds.find((round) => pageUrlSlug === round.slug);
</script>

{#if isLoaded}
	<a
		data-sveltekit-replacestate
		href={routeInformationUrl}
		on:click={handleOnClick}
		tabindex="-1"
		class="
				pt-1 z-30 block md:sticky top-3 mr-8
				text-sm font-normal text-stone-600 hover:text-stone-900 group
			"
	>
		<h3>
			<span class="font-medium text-stone-900 group-hover:text-black">Route&nbsp;Information</span>
			{#if !$isOpen}
				({$route.features.length}&nbsp;Checkpoints)
			{/if}
		</h3>
	</a>
	{#if $isOpen}
		{#if activeRound}
			<div class="py-6">
				{#if activeRound.info}
					<p class="mb-6 pr-10 text-sm font-normal text-stone-600 text-wrap-pretty leading-relaxed">
						{activeRound.info}
					</p>
				{/if}
				{#if activeRound.link}
					<a
						href={activeRound.link}
						target="_blank"
						class="
						text-xs my-2 first-letter:py-1 px-4 py-2 rounded-full outline-none
						bg-blue-700 text-white border-2 border-white
						hover:bg-white-700 hover:text-blue
						focus:ring-2 focus:outline-none focus:ring-blue-300"
					>
						<i>{activeRound.link}</i>
					</a>
				{/if}
			</div>
			<hr class="my-3" />
		{/if}

		<div class="py-6">
			<h4 class="text-sm font-medium text-stone-900">
				{$route.features.length}&nbsp;Checkpoints
			</h4>
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
		</div>
	{/if}
{/if}
