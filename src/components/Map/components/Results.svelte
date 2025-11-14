<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import first from 'lodash/first';
	import last from 'lodash/last';
	import * as turf from '@turf/turf';
	import TIME_ICON_TYPE from '$lib/enum/timeIconType';
	import { fitPositionWithOffset } from '$lib/utils';
	import { ratification, resultsFocus } from '$lib/stores/ratification.store';
	import { viewport } from '$lib/stores/viewport.store';
	import { page } from '$app/stores';
	import type { PageData } from '../../../routes/[round=name]/$types';
	import { gpx } from '$lib/stores/gpx.store';

	import type { MapContext } from '../Map.context';
	import { key } from '../Map.context';
	import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

	import TimeIcon from './TimeIcon.svelte';

	const { getMap } = getContext<MapContext>(key);

	const ICON_COMMON_PROPS = {
		minzoom: 8,
		size: 0.95,
		overlap: true
	};

	function getStartEndTimeIcons(gpx: GPXGeoJson): TimeIcon['$props'][] {
		const firstFeature = first(gpx.features);
		if (!firstFeature) return [];

		const firstCoordinate = first(firstFeature.geometry.coordinates);
		const firstTime = first(firstFeature.properties.coordinateProperties.times);
		const lastCoordinate = last(firstFeature.geometry.coordinates);
		const lastTime = last(firstFeature.properties.coordinateProperties.times);

		return [
			{
				coordinates: turf.getCoord(firstCoordinate),
				time: firstTime,
				...ICON_COMMON_PROPS,
				type: TIME_ICON_TYPE.START
			},
			{
				coordinates: turf.getCoord(lastCoordinate),
				time: lastTime,
				...ICON_COMMON_PROPS,
				type: TIME_ICON_TYPE.END
			}
		];
	}

	$: isLoaded = $gpx.features.length > 0;
	$: pageUrlSlug = $page.data.slug as PageData['slug'];
	$: rounds = $page.data.rounds as PageData['rounds'];
	$: activeRound = rounds.find((round) => pageUrlSlug === round.slug);
	$: isActiveRoundOrdered = activeRound?.ordered ?? true;
	$: startEndTimeIcons = isActiveRoundOrdered ? [] : getStartEndTimeIcons($gpx);

	const unsubscribeRouteFocus = resultsFocus.subscribe((position) => {
		const map = getMap();
		fitPositionWithOffset({
			map,
			position,
			animate: true,
			maxZoom: 17,
			isMobile: $viewport.isMobile
		});
	});

	onMount(() => {
		isActiveRoundOrdered = activeRound?.ordered ?? true;
	});

	onDestroy(() => {
		unsubscribeRouteFocus();
	});
</script>

{#each $ratification as point}
	{#if point.properties.time && point?.geometry?.coordinates.length > 0}
		<TimeIcon coordinates={turf.getCoord(point)} time={point.properties.time} />
	{/if}
{/each}

{#if isLoaded}
	{#each startEndTimeIcons as iconProps}
		<TimeIcon {...iconProps} />
	{/each}
{/if}
