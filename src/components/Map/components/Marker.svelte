<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { Marker, Popup } from 'maplibre-gl';
	import { key } from '../Map.context';
	import { MARKER } from '$lib/const';
	import { POINT_FEATURE } from '$lib/enum/pointFeature';
	import type { Position } from 'geojson';
	import type { Map as MapType, MapContext } from '../Map.context';
	import type { PointProperties } from '$lib/stores/route.store.d';
	import type { MarkerType } from '$lib/const';

	export let coordinates: Position;
	export let properties: PointProperties;
	let marker: Marker;
	let map: MapType;

	const { getMap } = getContext<MapContext>(key);

	const POINT_FEATURE_TO_MARKER = new Map([
		[POINT_FEATURE.SUMMIT, MARKER.SUMMIT],
		[POINT_FEATURE.WATER_ENTRY, MARKER.WATER],
		[POINT_FEATURE.WATER_EXIT, MARKER.WATER],
		[POINT_FEATURE.WATER_CHECKPOINT, MARKER.WATER],
		[POINT_FEATURE.CHECKPOINT, MARKER.CHECKPOINT],
		[POINT_FEATURE.CHECKPOINT_START, MARKER.START_END_POINT],
		[POINT_FEATURE.CHECKPOINT_FINISH, MARKER.START_END_POINT]
	]);

	function createDOM(elementFeatureType: MarkerType) {
		const el = document.createElement('div');
		el.className = 'marker';
		el.style.backgroundImage = 'url(/assets/marker-sprites.svg)';
		el.style.width = `${elementFeatureType.width}px`;
		el.style.height = `${elementFeatureType.height}px`;
		el.style.transform = `translate(-50%)`;
		el.style.backgroundPositionY = `-${elementFeatureType.yOffset}px`;
		el.style.backgroundPositionX = `${elementFeatureType.xOffset}px`;
		el.style.backgroundRepeat = 'no-repeat';
		el.style.borderRadius = '50%';
		el.style.boxShadow = '1px 3px 4px 0 rgba(0,0,0,0.23)';
		el.style.cursor = 'pointer';
		return el;
	}

	function addMarker() {
		const elementFeatureType = POINT_FEATURE_TO_MARKER.get(properties.featureType);
		if (!elementFeatureType) return;
		const element = createDOM(elementFeatureType);

		marker = new Marker({ element }).setLngLat(coordinates as [number, number]).addTo(map);
		marker.setPopup(
			new Popup({
				closeButton: false,
				offset: elementFeatureType.height / 2.5
			}).setText(`${properties.name}`)
		);
	}

	onMount(() => {
		map = getMap();
		map.isStyleLoaded() ? addMarker() : map.on('load', () => addMarker());
	});

	onDestroy(() => {
		if (marker) marker.remove();
	});
</script>
