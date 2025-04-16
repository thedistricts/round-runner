import { describe, it, expect } from 'vitest';
import * as turf from '@turf/turf';
import { VALIDITY } from '$lib/enum';
import { VALIDITY_DISTANCE } from '$lib/const';
import { POINT_FEATURE } from '$lib/enum';
import type { Feature, Point, LineString } from 'geojson';
import type { LineStringProperties } from '$lib/stores/gpx.store.d';
import type { PointProperties } from '$lib/stores/route.store.d';
import type { CoordWithDistance } from './ratification.worker.d';
import { getValidCoordinate, getNearestTimePointOnLine, ratify, getValidityStatus } from './ratification.worker';

describe('ratification worker', () => {
  describe('getValidityStatus', () => {
    const validityDistance = { [VALIDITY.VALID]: 0.1, [VALIDITY.WARN]: 0.2 };

    it('should return VALID when distance is less than valid threshold', () => {
      const result = getValidityStatus(0.05, validityDistance);
      expect(result).toBe(VALIDITY.VALID);
    });

    it('should return WARN when distance is between valid and warn thresholds', () => {
      const result = getValidityStatus(0.15, validityDistance);
      expect(result).toBe(VALIDITY.WARN);
    });

    it('should return FAIL when distance is greater than warn threshold', () => {
      const result = getValidityStatus(0.25, validityDistance);
      expect(result).toBe(VALIDITY.FAIL);
    });

    it('should handle edge cases correctly', () => {
      const validityDistance = { [VALIDITY.VALID]: 0.1, [VALIDITY.WARN]: 0.2 };
      expect(getValidityStatus(0.1, validityDistance)).toBe(VALIDITY.VALID);
      expect(getValidityStatus(0.2, validityDistance)).toBe(VALIDITY.WARN);
    });
  });

  describe('getValidCoordinate', () => {
    it('should return the coordinate with the smallest distance when all distances are valid', () => {
      const coords: CoordWithDistance[] = [
        {
          geometry: { type: 'Point' as const, coordinates: [0, 0] },
          properties: { dist: 5, index: 0, isStart: false, isEnd: false, valid: VALIDITY.FAIL },
          type: 'Feature' as const
        },
        {
          geometry: { type: 'Point' as const, coordinates: [1, 1] },
          properties: { dist: 3, index: 1, isStart: false, isEnd: false, valid: VALIDITY.FAIL },
          type: 'Feature' as const
        },
        {
          geometry: { type: 'Point' as const, coordinates: [2, 2] },
          properties: { dist: 1, index: 2, isStart: false, isEnd: false, valid: VALIDITY.FAIL },
          type: 'Feature' as const
        }
      ];

      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;
      const result = getValidCoordinate(coords, validityDistance);

      expect(result).toEqual(coords[2]);
    });

    it('should return null when no coordinates are provided', () => {
      const coords: CoordWithDistance[] = [];
      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;
      const result = getValidCoordinate(coords, validityDistance);

      expect(result).toBeNull();
    });

    it('should handle undefined distances', () => {
      const coords: CoordWithDistance[] = [
        {
          geometry: { type: 'Point' as const, coordinates: [0, 0] },
          properties: { dist: 5, index: 0, isStart: false, isEnd: false, valid: VALIDITY.FAIL },
          type: 'Feature' as const
        },
        {
          geometry: { type: 'Point' as const, coordinates: [1, 1] },
          properties: { dist: 3, index: 1, isStart: false, isEnd: false, valid: VALIDITY.FAIL },
          type: 'Feature' as const
        }
      ];

      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;
      const result = getValidCoordinate(coords, validityDistance);

      expect(result).toBeDefined();
    });
  });

  describe('getNearestTimePointOnLine', () => {
    it('should find the nearest point on line for a given point', () => {
      const line = turf.lineString([
        [0, 0],
        [1, 1],
        [2, 2]
      ], { coordinateProperties: { times: ['00:00', '00:01', '00:02'] } }) as Feature<LineString, LineStringProperties>;

      const point = turf.point([1, 1], { featureType: POINT_FEATURE.CHECKPOINT }) as Feature<Point, PointProperties>;
      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;
      const pointIndex = 1;
      const routeLength = 3;

      const result = getNearestTimePointOnLine(line, point, validityDistance, pointIndex, routeLength);

      expect(result).toBeDefined();
      expect(result?.properties.dist).toBeDefined();
      expect(result?.properties.dist).toBeLessThan(validityDistance[VALIDITY.VALID]);
      expect(result?.properties.valid).toBe(VALIDITY.VALID);
      expect(result?.properties.index).toBe(1);
      expect(result?.properties.isStart).toBe(false);
      expect(result?.properties.isEnd).toBe(false);
      expect(result?.properties.order).toBe(2);
    });

    it('should handle start and end points correctly', () => {
      const line = turf.lineString([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
      ], { coordinateProperties: { times: ['00:00', '00:01', '00:02', '00:03'] } }) as Feature<LineString, LineStringProperties>;

      const startPoint = turf.point([0.1, 0.1], { featureType: POINT_FEATURE.CHECKPOINT_START }) as Feature<Point, PointProperties>;
      const endPoint = turf.point([2.9, 2.9], { featureType: POINT_FEATURE.CHECKPOINT_FINISH }) as Feature<Point, PointProperties>;
      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;

      const startResult = getNearestTimePointOnLine(line, startPoint, validityDistance, 0, 2);
      const endResult = getNearestTimePointOnLine(line, endPoint, validityDistance, 1, 2);

      expect(startResult?.properties.isStart).toBe(true);
      expect(startResult?.properties.index).toBeLessThan(2);
      expect(endResult?.properties.isEnd).toBe(true);
      expect(endResult?.properties.index).toBeGreaterThanOrEqual(2);
    });

    it('should handle points outside the line segment', () => {
      const line = turf.lineString([
        [0, 0],
        [1, 1]
      ], { coordinateProperties: { times: ['00:00', '00:01'] } }) as Feature<LineString, LineStringProperties>;

      const point = turf.point([10, 10], { featureType: POINT_FEATURE.CHECKPOINT }) as Feature<Point, PointProperties>;
      const validityDistance = VALIDITY_DISTANCE.get(POINT_FEATURE.CHECKPOINT)!;
      const pointIndex = 0;
      const routeLength = 1;

      const result = getNearestTimePointOnLine(line, point, validityDistance, pointIndex, routeLength);

      expect(result).toBeDefined();
      expect(result?.properties.dist).toBeDefined();
      expect(result?.properties.valid).toBe(VALIDITY.FAIL);
    });
  });

  describe('ratify', () => {
    it('should process a track and route correctly', () => {
      const track = turf.featureCollection([
        turf.lineString([
          [0, 0],
          [1, 1],
          [2, 2]
        ], { coordinateProperties: { times: ['00:00', '00:01', '00:02'] } })
      ]);

      const route = turf.featureCollection([
        turf.point([0.1, 0.1], { featureType: POINT_FEATURE.CHECKPOINT }),
        turf.point([1.1, 1.1], { featureType: POINT_FEATURE.CHECKPOINT })
      ]);

      const result = ratify({ track, route });

      expect(result).toHaveLength(2);
      expect(result[0].properties.valid).toBeDefined();
      expect(result[1].properties.valid).toBeDefined();
    });

    it('should throw an error when track has no LineString', () => {
      const track = turf.featureCollection([
        turf.point([0, 0])
      ]);

      const route = turf.featureCollection([
        turf.point([0.1, 0.1], { featureType: POINT_FEATURE.CHECKPOINT })
      ]);

      expect(() => ratify({ track, route })).toThrow('Feature Collection does not contain a LineString');
    });

    it('should handle points outside validity distance', () => {
      const track = turf.featureCollection([
        turf.lineString([
          [0, 0],
          [1, 1]
        ], { coordinateProperties: { times: ['00:00', '00:01'] } })
      ]);

      const route = turf.featureCollection([
        turf.point([10, 10], { featureType: POINT_FEATURE.CHECKPOINT })
      ]);

      const result = ratify({ track, route });

      expect(result[0].properties.valid).toBe(VALIDITY.FAIL);
    });

    it('should handle missing coordinate properties', () => {
      const track = turf.featureCollection([
        turf.lineString([
          [0, 0],
          [1, 1]
        ])
      ]);

      const route = turf.featureCollection([
        turf.point([0.1, 0.1], { featureType: POINT_FEATURE.CHECKPOINT })
      ]);

      const result = ratify({ track, route });

      expect(result).toHaveLength(1);
      expect(result[0].properties.time).toBeUndefined();
    });
  });
}); 