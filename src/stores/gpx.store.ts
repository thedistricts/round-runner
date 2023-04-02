import bbox from '@turf/bbox';
import { featureCollection } from '@turf/helpers';
import { writable, derived } from 'svelte/store';
import type { GPXGeoJson } from './gpx.store.d';

const EMPTY_COLLECTION: GPXGeoJson = featureCollection([]);

function createGpx() {
	const { subscribe, set, update } = writable<GPXGeoJson>(EMPTY_COLLECTION);

	return {
		subscribe,
		set,
		update,
		reset: () => set(EMPTY_COLLECTION)
	};
}

export const gpx = createGpx();

export const gpxBBox = derived(gpx, ($gpx) => bbox($gpx));
