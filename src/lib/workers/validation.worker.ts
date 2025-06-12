import { expose } from 'comlink';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

const IS_VALID_INTERVAL = 15;

function calculatePercentile(numbers: number[], percentile: number): number {
	const sorted = [...numbers].sort((a, b) => a - b);
	const index = Math.ceil((percentile / 100) * sorted.length) - 1;
	return sorted[index];
}

export function validateTimeIntervals(gpx: GPXGeoJson): { isValid: boolean; percentileInterval: number } {
	const trackLineString = gpx.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const times = trackLineString.properties?.coordinateProperties?.times;
	if (!times || times.length < 2) {
		throw new Error('No valid time data found in GPX track');
	}

	const intervals: number[] = [];
	for (let i = 1; i < times.length; i++) {
		const currentTime = new Date(times[i]).getTime();
		const previousTime = new Date(times[i - 1]).getTime();
		const interval = currentTime - previousTime;
		intervals.push(interval);
	}

	const percentileInterval = calculatePercentile(intervals, 90) / 1000; // Convert to seconds
	const isValid = percentileInterval < IS_VALID_INTERVAL;

	return {
		isValid,
		percentileInterval
	};
}

export function validateTrack(track: GPXGeoJson) {
	const coordinates = track.features?.[0]?.geometry?.coordinates ?? [];
	const times = track.features?.[0]?.properties?.coordinateProperties?.times ?? [];
	const hasValidTimes = coordinates.length === times.length;
	const hasCoordinateTimes = times.length > 0;
	const isValid = hasCoordinateTimes && hasValidTimes;

	return {isValid};
}

expose({ validateTimeIntervals, validateTrack }); 