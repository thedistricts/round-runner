import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import dayjs from 'dayjs';

export const getMetricsDefaults = () => ({
	start: dayjs(),
	end: dayjs(),
	elapsed: new Date(0),
	isValid: false
});

export function getMetricsFrom(track: GPXGeoJson) {
    const metrics = {
      start: dayjs(),
      end: dayjs(),
			elapsed: new Date(0),
			isValid: false
    }
		const coordinates = track.features?.[0]?.geometry?.coordinates ?? [];
		const times = track.features?.[0]?.properties?.coordinateProperties?.times ?? [];
		const hasValidTimes = coordinates.length === times.length;
		const hasCoordinateTimes = times.length > 0;
		const isValid = hasCoordinateTimes && hasValidTimes;
		if (isValid) {
			metrics.start = dayjs(times?.[0]);
			metrics.end = dayjs(times?.[times.length - 1]);
			metrics.elapsed = new Date(metrics.end.diff(metrics.start));
			metrics.isValid = isValid;
		}
	return metrics;
}