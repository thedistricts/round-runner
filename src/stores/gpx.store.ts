import { writable, derived } from 'svelte/store';
import type { RouteGeoJson } from './route.store.d';
import bbox from '@turf/bbox';

export const gpx = writable<RouteGeoJson>({
	type: 'FeatureCollection',
	features: []
});

export const gpxBBox = derived(gpx, ($gpx) => bbox($gpx));
