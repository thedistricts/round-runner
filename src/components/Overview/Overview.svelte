<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from '../../routes/[round=name]/$types';
	import type { Map as MapLibreMap } from 'maplibre-gl';
	import { MARKER, MARKER_SIZE } from '$lib/const';
	import { viewport } from '$lib/stores/viewport.store';
	import { mapStore } from '$lib/stores/map.store';
	import { get } from 'svelte/store';
	import { fitBoundsWithPadding } from '$lib/utils/map';
	import bbox from '@turf/bbox';

	// import { POINT_FEATURE } from '$lib/enum/pointFeature';
	$: rounds = $page.data.rounds as PageData['rounds'];
	$: extendedRouteInformationUrl = $viewport.isDesktop ? '/route-information' : '';

	async function handleRoundHover(round: PageData['rounds'][number]) {
		if (!round.json) return;
		try {
			const res = await fetch(round.json);
			const geojson = await res.json();
			const bBox = bbox(geojson);
			const map = get(mapStore) as MapLibreMap;
			if (map) {
				fitBoundsWithPadding({
					map,
					bBox,
					animate: false,
					delay: 0,
					isMobile: $viewport.isMobile
				});
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Failed to fit bounds for round', round, e);
		}
	}
</script>

<div
	class="
		fixed top-0 right-0 left-0 bottom-0 m-3
		rounded-3xl drop-shadow bg-white pointer-events-auto
		overflow-scroll
	"
>
	<div
		class="
      sticky top-0
        flex flex-col gap-2
        justify-center items-center
        h-1/2 p-8
        font-normal
        text-center
      "
	>
		<h1 class="text-4xl font-bold mb-4">
			<span class="inline-block w-11 h-11 mr-4 -mt-1 bg-black rounded-sm translate-y-1/4">
				<img src="/assets/runner.gif" alt="Animated Runner" />
			</span>
			Round Runner
		</h1>
		<h2 class="text-xl font-light">Plan, explore &amp; verify your long-distance challenges</h2>
		<p class=" text-neutral-400 font-light">
			{rounds.length} route breakdowns, split times by stage, gpx waypoints
		</p>
	</div>
	<a
		href="https://github.com/thedistricts/round-runner"
		target="_blank"
		rel="noopener noreferrer"
		class="absolute top-6 right-6 z-50"
		title="View on GitHub"
	>
		<img src="/assets/github-logo.min.svg" alt="GitHub" />
	</a>
	<nav
		class="relative mx-auto max-w-screen-xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-8 bg-white
		before:absolute before:inset-x-0 before:-top-5 before:h-5 before:bg-gradient-to-b before:from-transparent before:to-white
		"
	>
		{#each rounds as round}
			<div class="px-10 mb-5">
				<h3 class="text-lg text-blue-700 font-medium mb-5">
					<a
						href={`/${round.slug}${extendedRouteInformationUrl}`}
						on:mouseenter={() => handleRoundHover(round)}
					>
						{round.title}
					</a>
				</h3>
				<div class="relative">
					<a
						href={`/${round.slug}${extendedRouteInformationUrl}`}
						class="
              relative block
              after:content-['Load_Challenge'] after:text-sm after:font-semibold after:text-white
              after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-black after:bg-opacity-85 after:px-6 after:py-2 after:rounded-full after:opacity-0
              after:pointer-events-none after:transition-opacity after:duration-200 after:whitespace-nowrap after:z-20
              hover:after:opacity-100 hover:after:pointer-events-auto focus:after:opacity-100
              focus:after:pointer-events-auto focus:outline-none"
						on:mouseenter={() => handleRoundHover(round)}
					>
						<img
							src={round.image}
							alt={round.title}
							class="w-full h-48 object-cover rounded-sm mb-4"
						/>
						<div class="absolute bottom-3 right-3 flex gap-3 z-30">
							<div
								class="flex gap-2 items-center bg-white rounded-lg px-2 py-1.5 origin-bottom-right scale-75"
							>
								{#if round.checkpointSummary?.summit && round.checkpointSummary?.summit > 0}
									<span
										class=" inline-block"
										style="
										width: {MARKER_SIZE}px;
										height: {MARKER_SIZE}px;
										background-image: url('/assets/marker-sprites.svg');
										background-size: auto;
										background-position-x: {MARKER.SUMMIT.xOffset}px;
										background-position-y: -{MARKER.SUMMIT.yOffset}px;
										background-repeat: no-repeat;
									"
									/>
									<!-- <span class="text-sm font-bold text-red-500"
										>{String(round.checkpointSummary?.summit ?? 0).padStart(2, '0')}</span
									> -->
								{/if}
								{#if round.checkpointSummary?.['water entry'] && round.checkpointSummary?.['water entry'] > 0}
									<span
										class="inline-block"
										style="
										width: {MARKER_SIZE}px;
										height: {MARKER_SIZE}px;
										background-image: url('/assets/marker-sprites.svg');
										background-size: auto;
										background-position-x: {MARKER.WATER.xOffset}px;
										background-position-y: -{MARKER.WATER.yOffset}px;
										background-repeat: no-repeat;
									"
									/>
									<!-- <span class="text-sm font-bold text-sky-400"
										>{String(round.checkpointSummary?.['water entry'] ?? 0).padStart(2, '0')}</span
									> -->
								{/if}
							</div>
						</div>
					</a>
				</div>
				<p
					class=" display-block font-normal text-sm/loose text-gray-900 pt-6 pb-2 pr-4 text-pretty"
				>
					{round.summary}
				</p>
			</div>
		{/each}
	</nav>
</div>
