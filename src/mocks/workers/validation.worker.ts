import { vi } from 'vitest';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

export const validateTimeIntervals = vi.fn((gpx: GPXGeoJson) => {
	const trackLineString = gpx.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const times = trackLineString.properties?.coordinateProperties?.times;
	if (!times || times.length < 2) {
		throw new Error('No valid time data found in GPX track');
	}

	// Check if this is the "poor interval data" test case
	const firstInterval = new Date(times[1]).getTime() - new Date(times[0]).getTime();
	const isPoorData = firstInterval > 15000; // 15 seconds in milliseconds

	return {
		isValid: !isPoorData,
		percentileInterval: isPoorData ? 20 : 10 // Return a higher value for poor data
	};
});

export const validateTrack = vi.fn((track: GPXGeoJson) => {
	const coordinates = track.features?.[0]?.geometry?.coordinates ?? [];
	const times = track.features?.[0]?.properties?.coordinateProperties?.times ?? [];
	const hasValidTimes = coordinates.length === times.length;
	const hasCoordinateTimes = times.length > 0;
	const isValid = hasCoordinateTimes && hasValidTimes;

	return { isValid };
}); 