import { describe, it, expect } from 'vitest';
import { getMetricsDefaults, getMetricsFrom } from './metrics';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

describe('metrics', () => {
	describe('getMetricsDefaults', () => {
		it('should return default metrics object', () => {
			const defaults = getMetricsDefaults();
			expect(defaults).toHaveProperty('start');
			expect(defaults).toHaveProperty('end');
			expect(defaults).toHaveProperty('elapsed');
			expect(defaults).toHaveProperty('isValid');
			expect(defaults.isValid).toBe(false);
		});
	});

	describe('getMetricsFrom', () => {
		it('should return default metrics for empty track', () => {
			const emptyTrack: GPXGeoJson = {
				type: 'FeatureCollection',
				features: []
			};
			const metrics = getMetricsFrom(emptyTrack);
			expect(metrics.isValid).toBe(false);
		});

		it('should return valid metrics for track with coordinates and times', () => {
			const track: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1]]
					},
					properties: {
						name: 'Test Track',
						time: '2023-01-01T00:00:00Z',
						_gpxType: 'trk',
						gpxx_TrackExtension: '{}',
						coordinateProperties: {
							times: ['2023-01-01T00:00:00Z', '2023-01-01T00:01:00Z']
						}
					}
				}]
			};
			const metrics = getMetricsFrom(track);
			expect(metrics.isValid).toBe(true);
			expect(metrics.start.format()).toBe('2023-01-01T00:00:00+00:00');
			expect(metrics.end.format()).toBe('2023-01-01T00:01:00+00:00');
			expect(metrics.elapsed.getTime()).toBe(60000); // 1 minute in milliseconds
		});

		it('should return invalid metrics when times and coordinates length mismatch', () => {
			const track: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1]]
					},
					properties: {
						name: 'Test Track',
						time: '2023-01-01T00:00:00Z',
						_gpxType: 'trk',
						gpxx_TrackExtension: '{}',
						coordinateProperties: {
							times: ['2023-01-01T00:00:00Z']
						}
					}
				}]
			};
			const metrics = getMetricsFrom(track);
			expect(metrics.isValid).toBe(false);
		});
	});
}); 