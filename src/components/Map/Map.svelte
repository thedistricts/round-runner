<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { Map, key, ACCESS_TOKEN } from './Map.context';

	import { NavigationControl } from 'maplibre-gl';
	import type { StyleSpecification } from 'maplibre-gl';
	import { Route, Track } from './components';

	let map: Map;
	let mapContainer: HTMLElement;
	const tileset = 'Outdoor_3857';
	const initialState = { lng: -3.28, lat: 54.5, zoom: 10 };

	const style = {
		version: 8,
		sources: {
			'raster-tiles': {
				type: 'raster',
				tiles: [
					`https://api.os.uk/maps/raster/v1/zxy/${tileset}/{z}/{x}/{y}.png?key=${ACCESS_TOKEN}`
				],
				tileSize: 256
			}
		},
		layers: [
			{
				id: 'os-maps-zxy',
				type: 'raster',
				source: 'raster-tiles'
			}
		]
	} as StyleSpecification;

	function load() {
		map = new Map({
			container: mapContainer,
			style,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		map.addControl(new NavigationControl({}), 'top-right');

		// map.on('load', function() {
		// 	const { width, height } = map.getCanvas();
		// });
		// map.on('resize', function() {
		// 	const { width, height } = map.getCanvas();
		// });
	}

	setContext(key, {
		getMap: () => map
	});

	onMount(async () => {
		load();
	});

	onDestroy(() => {
		map?.remove();
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="https://unpkg.com/maplibre-gl/dist/maplibre-gl.css" on:load={load} />
</svelte:head>

<div id="map" class="fixed w-screen h-screen z-0" bind:this={mapContainer}>
	<Route />
	<Track />
</div>
