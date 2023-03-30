import { writable, derived } from 'svelte/store';
import type { GPXGeoJson } from './gpx.store.d';
import bbox from '@turf/bbox';

const EMPTY_COLLECTION: GPXGeoJson = {
	type: 'FeatureCollection',
	features: []
};

function createCount() {
	const { subscribe, set, update } = writable<GPXGeoJson>(EMPTY_COLLECTION);

	return {
		subscribe,
		set,
		update,
		reset: () => set(EMPTY_COLLECTION)
	};
}

export const gpx = createCount();

export const gpxBBox = derived(gpx, ($gpx) => bbox($gpx));
