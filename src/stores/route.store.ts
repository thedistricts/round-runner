import { writable, derived } from 'svelte/store';
import type { RouteGeoJson } from './route.store.d';
import bbox from '@turf/bbox';

export const route = writable<RouteGeoJson>({
	type: 'FeatureCollection',
	features: []
});

export const routeBBox = derived(route, ($route) => bbox($route));
