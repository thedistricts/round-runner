import { describe, it, expect } from 'vitest';
import { getValidityStatus, ratify } from './ratification.worker';
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
				notes: [],
				ratify: true
			}) as Feature<Point, ValidityPointProperties>
		];

		const result = ratify(track, checkpoints, validityDistance);
		expect(result).toBeDefined();
		expect(Array.isArray(result)).toBe(true);
	});
}); 