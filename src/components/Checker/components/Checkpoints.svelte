<script lang="ts">
	import type { PageData } from '../../../routes/[round=name]/$types';
	import type { LngLatLike } from 'maplibre-gl';
	import type { Position } from 'geojson';
	import { page } from '$app/stores';
	import { isOpen } from '$lib/stores/checker.store';
	import { viewport } from '$lib/stores/viewport.store';
	import { route, routeFocus } from '$lib/stores/route.store';
	import { URL_PARAM } from '$lib/enum';
	import { convertToGPX } from '$lib/utils/gpx.utils';
	import { cleanUrlForDisplay } from '$lib/utils/string.utils';

	$: pageUrlSlug = $page.data.slug as PageData['slug'];
	$: rounds = $page.data.rounds as PageData['rounds'];

	$: isLoaded = $route.features.length > 0;
	$: activeRound = rounds.find((round) => pageUrlSlug === round.slug);
	$: checkpointFeatures = $route.features;
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

	function downloadGPX() {
		if (!activeRound || !isLoaded) return;

		const gpxContent = convertToGPX($route, activeRound.title, activeRound.info);
		const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${activeRound.slug}.gpx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
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
							inline-flex gap-2 items-center
							text-xs mt-1 px-5 py-2 rounded-full outline-none
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
						<i>{cleanUrlForDisplay(activeRound.link)}</i>
					</a>
				{/if}
				<button
					on:click={downloadGPX}
					class="
							inline-flex items-center gap-2
							text-xs my-2 px-5 py-[0.35rem] rounded-full outline-none
							bg-white text-blue-700 border-2 border-grey-100
							hover:bg-white-700 hover:text-blue
							focus:ring-2 focus:outline-none focus:ring-blue-300 focus:border-white-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20px"
						height="20px"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Download GPX waypoints
				</button>
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
