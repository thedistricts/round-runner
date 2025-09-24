import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

export type ExposeValidationWorker = {
	validateTrack: (gpx: GPXGeoJson) => { isValid: boolean };
	validateTimeIntervals: (gpx: GPXGeoJson) => { isValid: boolean; percentileInterval: number };
};