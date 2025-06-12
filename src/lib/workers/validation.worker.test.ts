import { describe, it, expect } from 'vitest';
import { validateTimeIntervals, validateTrack } from './validation.worker';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';

const defaultProperties = {
	gpxx_TrackExtension: '',
	name: 'Test Track',
	time: '2024-01-01T00:00:00Z',
	_gpxType: 'trk',
	coordinateProperties: {
		times: []
	}
};

describe('validation worker', () => {
	describe('validateTimeIntervals', () => {
		it('should throw error if no LineString feature exists', () => {
			const invalidGpx: GPXGeoJson = {
				type: 'FeatureCollection',
				features: []
			};

			expect(() => validateTimeIntervals(invalidGpx)).toThrow('Feature Collection does not contain a LineString');
		});

		it('should throw error if no time data exists', () => {
			const gpxWithoutTimes: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1]]
					},
					properties: {
						...defaultProperties,
						coordinateProperties: {
							times: []
						}
					}
				}]
			};

			expect(() => validateTimeIntervals(gpxWithoutTimes)).toThrow('No valid time data found in GPX track');
		});

		it('should validate intervals correctly with good data', () => {
			const now = new Date().getTime();
			const goodGpx: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1], [2, 2], [3, 3]]
					},
					properties: {
						...defaultProperties,
						coordinateProperties: {
							times: [
								new Date(now).toISOString(),
								new Date(now + 5000).toISOString(),
								new Date(now + 10000).toISOString(),
								new Date(now + 15000).toISOString()
							]
						}
					}
				}]
			};

			const result = validateTimeIntervals(goodGpx);
			expect(result.isValid).toBe(true);
			expect(result.percentileInterval).toBeLessThan(15);
		});

		it('should fail validation with poor interval data', () => {
			const now = new Date().getTime();
			const poorGpx: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1], [2, 2], [3, 3]]
					},
					properties: {
						...defaultProperties,
						coordinateProperties: {
							times: [
								new Date(now).toISOString(),
								new Date(now + 20000).toISOString(),
								new Date(now + 40000).toISOString(),
								new Date(now + 60000).toISOString()
							]
						}
					}
				}]
			};

			const result = validateTimeIntervals(poorGpx);
			expect(result.isValid).toBe(false);
			expect(result.percentileInterval).toBeGreaterThan(15);
		});
	});

	describe('validateTrack', () => {
		it('should validate track with matching coordinates and times', () => {
			const validTrack: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1]]
					},
					properties: {
						...defaultProperties,
						coordinateProperties: {
							times: ['2024-01-01T00:00:00Z', '2024-01-01T00:00:01Z']
						}
					}
				}]
			};

			const result = validateTrack(validTrack);
			expect(result.isValid).toBe(true);
		});

		it('should fail validation with mismatched coordinates and times', () => {
			const invalidTrack: GPXGeoJson = {
				type: 'FeatureCollection',
				features: [{
					type: 'Feature',
					geometry: {
						type: 'LineString',
						coordinates: [[0, 0], [1, 1], [2, 2]]
					},
					properties: {
						...defaultProperties,
						coordinateProperties: {
							times: ['2024-01-01T00:00:00Z', '2024-01-01T00:00:01Z']
						}
					}
				}]
			};

			const result = validateTrack(invalidTrack);
			expect(result.isValid).toBe(false);
		});

		it('should handle empty track data', () => {
			const emptyTrack: GPXGeoJson = {
				type: 'FeatureCollection',
				features: []
			};

			const result = validateTrack(emptyTrack);
			expect(result.isValid).toBe(false);
		});
	});
}); 