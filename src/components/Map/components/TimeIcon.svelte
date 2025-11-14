<script lang="ts">
	import { getContext, onMount, onDestroy } from 'svelte';
	import pkg from 'maplibre-gl';
	import dayjs from 'dayjs';
	import utc from 'dayjs/plugin/utc';
	import { key } from '../Map.context';
	import { HOURS } from '$lib/const';
	import TimePoint from '../assets/time-icon.svg';
	import TimePointStart from '../assets/time-icon-start.svg';
	import TimePointEnd from '../assets/time-icon-end.svg';
	import TIME_ICON_TYPE from '$lib/enum/timeIconType';
	import type { Popup } from 'maplibre-gl';
	import type { Position } from 'geojson';
	import type { MapContext } from '../Map.context';
	export let coordinates: Position;
	export let time: string = '00:00:00';
	export let minzoom: number = 16;
	export let maxzoom: number = 22;
	export let size: number = 1;
	export let overlap: boolean = false;
	export let type: TIME_ICON_TYPE = TIME_ICON_TYPE.TIME;

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
		image.onload = () => {
			if (map.getImage(imageId)) {
				map.removeImage(imageId);
			}
			map.addImage(imageId, image);

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
					minzoom,
					maxzoom,
					layout: {
						'icon-image': imageId,
						'icon-size': size,
						'icon-allow-overlap': true,
						'icon-keep-upright': true
					}
				},
				undefined
			);

			map.on('mouseenter', id, (e: { lngLat: { lng: number } }) => {
				map.getCanvas().style.cursor = 'pointer';
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				popup = new pkg.Popup({
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
		};
		switch (type) {
			case TIME_ICON_TYPE.TIME:
				image.src = TimePoint;
				break;
			case TIME_ICON_TYPE.START:
				image.src = TimePointStart;
				break;
			case TIME_ICON_TYPE.END:
				image.src = TimePointEnd;
				break;
			default:
				image.src = TimePoint;
				break;
		}
	}

	onMount(() => {
		map.once('idle', () => {
			addLayers();
		});
	});

	onDestroy(cleanUp);
</script>
