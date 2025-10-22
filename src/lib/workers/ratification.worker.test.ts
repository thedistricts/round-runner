import { describe, it, expect } from 'vitest';
import { getValidityStatus, ratify, getNearestTimePointOnLine } from './ratification.worker';
import { VALIDITY } from '$lib/enum';
import { featureCollection, lineString, point } from '@turf/helpers';
import type { ValidityDistance, CoordWithDistance, ValidityPointProperties } from './ratification.worker.d';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { Feature, Point } from 'geojson';

describe('ratification worker', () => {
	it('should validate points within validity distance', () => {
		const validityDistance: ValidityDistance = { 
			[VALIDITY.VALID]: 0.1,
			[VALIDITY.WARN]: 0.2,
			[VALIDITY.FAIL]: 0.3
		};
		const point: CoordWithDistance = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [1.001, 1.001]
			},
			properties: {
				dist: 0.05,
				index: 0,
				isStart: false,
				isEnd: false,
				valid: VALIDITY.VALID,
				time: '2021-01-01T00:00:30Z'
			}
		};

		const result = getValidityStatus(point.properties.dist, validityDistance);
		expect(result).toBe(VALIDITY.VALID);
	});

	it('should handle points outside the line segment', () => {
		const validityDistance: ValidityDistance = { 
			[VALIDITY.VALID]: 0.1,
			[VALIDITY.WARN]: 0.2,
			[VALIDITY.FAIL]: 0.3
		};
		const point: CoordWithDistance = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [5, 5]
			},
			properties: {
				dist: 0.25,
				index: 0,
				isStart: false,
				isEnd: false,
				valid: VALIDITY.FAIL,
				time: '2021-01-01T00:00:30Z'
			}
		};

		const result = getValidityStatus(point.properties.dist, validityDistance);
		expect(result).toBe(VALIDITY.FAIL);
	});

	it('should handle missing coordinate properties', () => {
		const validityDistance: ValidityDistance = { 
			[VALIDITY.VALID]: 0.1,
			[VALIDITY.WARN]: 0.2,
			[VALIDITY.FAIL]: 0.3
		};
		const point: CoordWithDistance = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [0.5, 0.5]
			},
			properties: {
				dist: 0.15,
				index: 0,
				isStart: false,
				isEnd: false,
				valid: VALIDITY.WARN,
				time: '2021-01-01T00:00:30Z'
			}
		};

		const result = getValidityStatus(point.properties.dist, validityDistance);
		expect(result).toBe(VALIDITY.WARN);
	});

	it('should ratify track against route', () => {
		const validityDistance = 0.1;
		const track = featureCollection([
			lineString([[0, 0], [1, 1]], { 
				times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z'],
				coordinateProperties: {
					times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z']
				},
				gpxx_TrackExtension: {},
				name: 'Track 1',
				time: '2021-01-01T00:00:00Z',
				_gpxType: 'trk'
			})
		]) as GPXGeoJson;
		const checkpoints: Feature<Point, ValidityPointProperties>[] = [
			point([0.5, 0.5], { 
				order: 0, 
				name: 'Test Point', 
				featureType: 'checkpoint',
				dist: 0,
				index: 0,
				isStart: false,
				isEnd: false,
				valid: VALIDITY.VALID,
				leg: 0,
				notes: "",
				ratify: true
			}) as Feature<Point, ValidityPointProperties>
		];

		const result = ratify(track, checkpoints, validityDistance);
		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
	});

	it('should ratify ordered route with defined start/end points', () => {
		const track = featureCollection([
			lineString([[0, 0], [0.5, 0.5], [1, 1]], { 
				coordinateProperties: {
					times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', '2021-01-01T00:02:00Z']
				},
				gpxx_TrackExtension: {},
				name: 'Track 1',
				time: '2021-01-01T00:00:00Z',
				_gpxType: 'trk'
			})
		]) as GPXGeoJson;
		
		const checkpoints = [
			point([0, 0], { 
				name: 'Start Point', 
				featureType: 'start checkpoint',
				leg: 1,
				notes: "",
				ratify: true
			}),
			point([1, 1], { 
				name: 'End Point', 
				featureType: 'finish checkpoint',
				leg: 2,
				notes: "",
				ratify: true
			})
		] as Feature<Point, ValidityPointProperties>[];

		const result = ratify(track, checkpoints, true); // hasDefinedStartEnd = true
		expect(result).toBeDefined();
		expect(result).toHaveLength(2);
		expect(result[0].properties.isStart).toBe(true);
		expect(result[1].properties.isEnd).toBe(true);
		expect(result[0].properties.order).toBe(1);
		expect(result[1].properties.order).toBe(2);
	});

	it('should ratify unordered route and sort by time', () => {
		const track = featureCollection([
			lineString([[0, 0], [0.5, 0.5], [1, 1]], { 
				coordinateProperties: {
					times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', '2021-01-01T00:02:00Z']
				},
				gpxx_TrackExtension: {},
				name: 'Track 1',
				time: '2021-01-01T00:00:00Z',
				_gpxType: 'trk'
			})
		]) as GPXGeoJson;
		
		const checkpoints = [
			point([1, 1], { 
				name: 'Point B', 
				featureType: 'summit',
				leg: 1,
				notes: "",
				ratify: true
			}),
			point([0, 0], { 
				name: 'Point A', 
				featureType: 'summit',
				leg: 2,
				notes: "",
				ratify: true
			})
		] as Feature<Point, ValidityPointProperties>[];

		const result = ratify(track, checkpoints, false); // hasDefinedStartEnd = false
		expect(result).toBeDefined();
		expect(result).toHaveLength(2);
		
		// For unordered routes, points should be sorted by time
		// Point A (at start) should come before Point B (at end) in the sorted result
		expect(result[0].properties.name).toBe('Point A');
		expect(result[1].properties.name).toBe('Point B');
		expect(result[0].properties.order).toBe(1);
		expect(result[1].properties.order).toBe(2);
	});

	it('should handle unordered route with mixed time order', () => {
		const track = featureCollection([
			lineString([[0, 0], [0.3, 0.3], [0.7, 0.7], [1, 1]], { 
				coordinateProperties: {
					times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', '2021-01-01T00:02:00Z', '2021-01-01T00:03:00Z']
				},
				gpxx_TrackExtension: {},
				name: 'Track 1',
				time: '2021-01-01T00:00:00Z',
				_gpxType: 'trk'
			})
		]) as GPXGeoJson;
		
		const checkpoints = [
			point([0.7, 0.7], { 
				name: 'Point C', 
				featureType: 'summit',
				leg: 1,
				notes: "",
				ratify: true
			}),
			point([0, 0], { 
				name: 'Point A', 
				featureType: 'summit',
				leg: 2,
				notes: "",
				ratify: true
			}),
			point([0.3, 0.3], { 
				name: 'Point B', 
				featureType: 'summit',
				leg: 3,
				notes: "",
				ratify: true
			})
		] as Feature<Point, ValidityPointProperties>[];

		const result = ratify(track, checkpoints, false); // hasDefinedStartEnd = false
		expect(result).toBeDefined();
		expect(result).toHaveLength(3);
		
		// Should be sorted by time: A (start), B (0.3), C (0.7)
		expect(result[0].properties.name).toBe('Point A');
		expect(result[1].properties.name).toBe('Point B');
		expect(result[2].properties.name).toBe('Point C');
		expect(result[0].properties.order).toBe(1);
		expect(result[1].properties.order).toBe(2);
		expect(result[2].properties.order).toBe(3);
	});

	it('should handle getNearestTimePointOnLine with defined start/end', () => {
		const line = lineString([[0, 0], [0.5, 0.5], [1, 1]], { 
			coordinateProperties: {
				times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', '2021-01-01T00:02:00Z']
			}
		});
		const testPoint = point([0.1, 0.1], { 
			name: 'Test Point', 
			featureType: 'start checkpoint',
			leg: 1,
			notes: "",
			ratify: true
		});
		const validityDistance = { 
			[VALIDITY.VALID]: 0.1,
			[VALIDITY.WARN]: 0.2,
			[VALIDITY.FAIL]: 0.3
		};

		const result = getNearestTimePointOnLine(line, testPoint, validityDistance, 0, 3, true);
		expect(result).toBeDefined();
		expect(result.properties.isStart).toBe(true);
		expect(result.properties.isEnd).toBe(false);
		expect(result.properties.order).toBe(1);
	});

	it('should handle getNearestTimePointOnLine without defined start/end', () => {
		const line = lineString([[0, 0], [0.5, 0.5], [1, 1]], { 
			coordinateProperties: {
				times: ['2021-01-01T00:00:00Z', '2021-01-01T00:01:00Z', '2021-01-01T00:02:00Z']
			}
		});
		const testPoint = point([0.1, 0.1], { 
			name: 'Test Point', 
			featureType: 'summit',
			leg: 1,
			notes: "",
			ratify: true
		});
		const validityDistance = { 
			[VALIDITY.VALID]: 0.1,
			[VALIDITY.WARN]: 0.2,
			[VALIDITY.FAIL]: 0.3
		};

		const result = getNearestTimePointOnLine(line, testPoint, validityDistance, 0, 3, false);
		expect(result).toBeDefined();
		expect(result.properties.isStart).toBe(false);
		expect(result.properties.isEnd).toBe(false);
		expect(result.properties.order).toBe(1);
	});
}); 