<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import { Popup } from 'maplibre-gl';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { key } from '../Map.context';
	import { HOURS } from '$lib/const';
	import TimePoint from '../assets/time-icon.svg';

	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';
	export let coordinates: Position;
	export let time: string = '00:00:00';

	dayjs.extend(utc);

	const { getMap } = getContext<MapContext>(key);
	const map = getMap();
	const id = `icon:${coordinates.toString()}}`;
	const sourceId = `${id}:icon-source`;
	const imageId = `${id}:icon-image`;
	let popup: Popup;

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
				minzoom: 16,
				layout: {
					'icon-image': imageId,
					'icon-size': 1
				}
			},
			undefined
		);

		map.on('mouseenter', id, (e) => {
			map.getCanvas().style.cursor = 'pointer';
			while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
				coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
			}

			popup = new Popup({
				closeButton: false,
				closeOnMove: true,
				offset: 16
			})
				.setLngLat(coordinates as [number, number])
				.setHTML(dayjs(time).utc().format(HOURS))
				.addTo(map);
		});

		map.on('mouseleave', id, () => {
			map.getCanvas().style.cursor = '';
			if (popup) popup.remove();
		});
	}

	onMount(() => {
		map.isStyleLoaded() ? setTimeout(addLayers, 100) : map.on('load', addLayers);
	});

	onDestroy(cleanUp);
</script>
