<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { Map, key, ACCESS_TOKEN } from './Map.context';
	import pkg from 'maplibre-gl';
	const { NavigationControl } = pkg;
	import { Route, Track, Results, Debug } from './components';
	import type { ControlPosition } from 'maplibre-gl';

	let map: Map;
	let mapContainer: HTMLElement;
	const CTRL = { BOTTOM_RIGHT: 'bottom-right' };
	const TILESET = { WINTER: 'winter-v2', OUTDOOR: 'outdoor-v2', ROAD: 'uk-openzoomstack-road' };
	const INITIAL_STATE = { LNG: -3.3073, LAT: 54.5865, ZOOM: 11.29 };

	function load() {
		map = new Map({
			container: mapContainer,
			style: `https://api.maptiler.com/maps/${TILESET.WINTER}/style.json?key=${ACCESS_TOKEN}`,
			center: [INITIAL_STATE.LNG, INITIAL_STATE.LAT],
			zoom: INITIAL_STATE.ZOOM,
			hash: false
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
	<style>
		.maplibregl-popup {
			max-width: 200px;
		}

		.maplibregl-popup-content {
			color: #565656;
			font-size: 14px;
			text-align: center;
			text-wrap: balance;
			text-wrap: pretty;
			letter-spacing: 0.39px;
			margin: -1px;
			padding: 6px 12px;
			border-radius: 2rem;
			box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.25);
		}

		.maplibregl-popup-tip {
			border-width: 7px;
		}

		.maplibregl-popup__active {
			background: #fd0602;
			outline: 2px solid #ffffff;
			box-shadow: 0 0 0 5px #1d4ed9 !important;
		}
	</style>
</svelte:head>

<div id="map" class="!fixed w-screen h-screen z-0 print:hidden" bind:this={mapContainer}>
	<Route />
	<Track />
	<Debug />
	<Results />
</div>
