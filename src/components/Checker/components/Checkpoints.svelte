<script lang="ts">
	import type { PageData } from '../../../routes/[round=name]/$types';
	import type { LngLatLike } from 'maplibre-gl';
	import type { Position } from 'geojson';
	import { page } from '$app/stores';
	import { isOpen } from '$lib/stores/checker.store';
	import { viewport } from '$lib/stores/viewport.store';
	import { route, routeFocus } from '$lib/stores/route.store';
	import { URL_PARAM, POINT_FEATURE } from '$lib/enum';

	$: pageUrlSlug = $page.data.slug as PageData['slug'];
	$: rounds = $page.data.rounds as PageData['rounds'];

	$: isLoaded = $route.features.length > 0;
	$: activeRound = rounds.find((round) => pageUrlSlug === round.slug);
	$: checkpointFeatures = $route.features.filter((feature) => {
		const featureType = feature.properties.featureType;
		return (
			featureType === POINT_FEATURE.CHECKPOINT ||
			featureType === POINT_FEATURE.CHECKPOINT_START ||
			featureType === POINT_FEATURE.CHECKPOINT_FINISH ||
			featureType === POINT_FEATURE.WATER_CHECKPOINT
		);
	});
	$: routeInformationUrl = $isOpen
		? `/${activeRound?.slug}/${URL_PARAM.ROUTE_INFORMATION}`
		: `/${activeRound?.slug}`;

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
</script>

{#if isLoaded}
	<a
		data-sveltekit-noscroll
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
				({checkpointFeatures.length}&nbsp;Checkpoints)
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
						inline-flex items-baseline gap-2
						text-xs my-2 first-letter:py-1 px-5 py-2 rounded-full outline-none
						bg-blue-700 text-white border-2 border-white
						hover:bg-white-700 hover:text-blue
						focus:ring-2 focus:outline-none focus:ring-blue-300"
					>
						<svg
							width="20px"
							height="10px"
							viewBox="0 0 20 10"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							xmlns:xlink="http://www.w3.org/1999/xlink"
						>
							<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
								<g
									transform="translate(-72.000000, -694.000000)"
									fill="#FFFFFF"
									fill-rule="nonzero"
								>
									<g transform="translate(57.000000, 683.000000)">
										<g transform="translate(15.000000, 11.000000)">
											<path
												d="M9,10 L5,10 C3.61666667,10 2.4375,9.5125 1.4625,8.5375 C0.4875,7.5625 0,6.38333333 0,5 C0,3.61666667 0.4875,2.4375 1.4625,1.4625 C2.4375,0.4875 3.61666667,0 5,0 L9,0 L9,2 L5,2 C4.16666667,2 3.45833333,2.29166667 2.875,2.875 C2.29166667,3.45833333 2,4.16666667 2,5 C2,5.83333333 2.29166667,6.54166667 2.875,7.125 C3.45833333,7.70833333 4.16666667,8 5,8 L9,8 L9,10 Z M6,6 L6,4 L14,4 L14,6 L6,6 Z M11,10 L11,8 L15,8 C15.8333333,8 16.5416667,7.70833333 17.125,7.125 C17.7083333,6.54166667 18,5.83333333 18,5 C18,4.16666667 17.7083333,3.45833333 17.125,2.875 C16.5416667,2.29166667 15.8333333,2 15,2 L11,2 L11,0 L15,0 C16.3833333,0 17.5625,0.4875 18.5375,1.4625 C19.5125,2.4375 20,3.61666667 20,5 C20,6.38333333 19.5125,7.5625 18.5375,8.5375 C17.5625,9.5125 16.3833333,10 15,10 L11,10 Z"
											/>
										</g>
									</g>
								</g>
							</g>
						</svg>
						<i>{activeRound.link}</i>
					</a>
				{/if}
			</div>
			<hr class="my-3" />
		{/if}

		<div class="py-6">
			<h4 class="text-sm font-medium text-stone-900">
				{checkpointFeatures.length}&nbsp;Checkpoints
			</h4>
			<ol class="text-sm text-stone-500 mt-4">
				{#each checkpointFeatures as feature, i}
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
