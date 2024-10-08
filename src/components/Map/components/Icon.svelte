<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { key } from '../Map.context';
	import TimePoint from '../assets/time-icon.svg';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';
	export let coordinates: Position;

	const { getMap } = getContext<MapContext>(key);
	const map = getMap();
	const id = `icon:${coordinates.toString()}}`;
	const sourceId = `${id}:icon-source`;
	const imageId = `${id}:icon-image`;

	function cleanUp() {
		if (map.getLayer(id)) map.removeLayer(id);
		if (map.getSource(sourceId)) map.removeSource(sourceId);
		if (map.getImage(imageId)) map.removeImage(imageId);
	}

	function addLayers() {
		cleanUp();
		const image = new Image(28, 28);
		image.onload = () => map.addImage(imageId, image);
		image.src = TimePoint;

		map.addSource(sourceId, {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates
						},
						properties: null
					}
				]
			}
		});

		map.addLayer(
			{
				id,
				type: 'symbol',
				source: sourceId,
				minzoom: 15,
				layout: {
					'icon-image': imageId,
					'icon-size': 1
				}
			},
			undefined
		);
	}

	onMount(() => {
		map.isStyleLoaded() ? setTimeout(addLayers, 100) : map.on('load', addLayers);
	});

	onDestroy(cleanUp);
</script>
