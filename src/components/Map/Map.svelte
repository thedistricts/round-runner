<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { Map, key, ACCESS_TOKEN } from './Map.context';
	import { NavigationControl } from 'maplibre-gl';
	import { Route, Track, Results, Debug } from './components';

	import type { ControlPosition } from 'maplibre-gl';

	let map: Map;
	let mapContainer: HTMLElement;
	const CTRL = {
		BOTTOM_RIGHT: 'bottom-right',
	} 
	const TILESET = { WINTER: 'winter-v2', OUTDOOR: 'outdoor-v2', ROAD: 'uk-openzoomstack-road' };
	const initialState = { lng: -3.3073, lat: 54.5865, zoom: 11.29 };

	function load() {
		map = new Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/${TILESET.WINTER}/style.json?key=${ACCESS_TOKEN}`,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom,
			hash: false,
		});

		map.addControl(
			new NavigationControl({
				visualizePitch: true,
				showZoom: true,
				showCompass: true
			}), 
			CTRL.BOTTOM_RIGHT as ControlPosition
		);
	}

	setContext(key, {
		getMap: () => map
	});

	onMount(load);
	onDestroy(() => map?.remove());
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" on:load={load} />
</svelte:head>

<div id="map" class="!fixed w-screen h-screen z-0 print:hidden" bind:this={mapContainer}>
	<Route />
	<Track />
	<Debug />
	<Results />
</div>
