<script lang="ts">
	import { onMount, onDestroy, setContext } from 'svelte';
	import { Map, key } from './Map.context';
	import { NavigationControl } from 'maplibre-gl';
	import { Route, Track, Results, Debug } from './components';
	import style from './Map.style';

	let map: Map;
	let mapContainer: HTMLElement;

	const initialState = { lng: -3.28, lat: 54.5, zoom: 12 };

	function load() {
		map = new Map({
			container: mapContainer,
			style,
			center: [initialState.lng, initialState.lat],
			zoom: initialState.zoom
		});

		map.addControl(new NavigationControl({}), 'bottom-right');
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
