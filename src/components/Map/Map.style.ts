import type { StyleSpecification } from 'maplibre-gl';
import { ACCESS_TOKEN } from './Map.context';

const tileset = 'Outdoor_3857';
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

export default style;
