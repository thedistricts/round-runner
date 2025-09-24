import { vi } from 'vitest';
import type { Feature, Point, LineString } from 'geojson';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { PointProperties } from '$lib/stores/route.store.d';
import { VALIDITY } from '$lib/enum';

export const getValidityStatus = vi.fn((distance: number, validityDistance: Record<VALIDITY, number>) => {
  if (distance <= validityDistance[VALIDITY.VALID]) {
    return VALIDITY.VALID;
  } else if (distance <= validityDistance[VALIDITY.WARN]) {
    return VALIDITY.WARN;
  } else {
    return VALIDITY.FAIL;
  }
});

export const getValidCoordinate = vi.fn((coords: any[], validityDistance: Record<VALIDITY, number>) => {
  if (!coords.length) return null;
  return coords.reduce((min, coord) => {
    if (!min || (coord.distance && coord.distance < min.distance)) {
      return coord;
    }
    return min;
  }, coords[coords.length - 1]);
});

export const getNearestTimePointOnLine = vi.fn((line: any, point: any, validityDistance: Record<VALIDITY, number>, pointIndex: number, routeLength: number) => {
  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [0, 0]
    },
    properties: {
      time: '2022-01-01T00:00:00Z',
      distance: 0.05,
      dist: 0.05,
      valid: VALIDITY.VALID,
      isStart: pointIndex === 0,
      isEnd: pointIndex === routeLength - 1,
      index: pointIndex
    }
  };
});

export const ratify = vi.fn((
  gpx: GPXGeoJson,
  checkpoints: Feature<Point, PointProperties>[],
  validityDistance: number
) => {
  if (!gpx.features.some((f) => f.geometry.type === 'LineString')) {
    throw new Error('Feature Collection does not contain a LineString');
  }

  return checkpoints.map((point, index) => ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: point.geometry.coordinates
    },
    properties: {
      ...point.properties,
      dist: 0.01,
      index,
      isStart: index === 0,
      isEnd: index === checkpoints.length - 1,
      valid: VALIDITY.VALID,
      order: index + 1,
      time: '2021-01-01T00:01:00Z'
    }
  }));
});

export const debug = vi.fn((
  gpx: Feature<LineString, any>,
  checkpoints: Feature<Point, PointProperties>[],
  validityDistance: number
) => {
  return ratify({ type: 'FeatureCollection', features: [gpx] }, checkpoints, validityDistance);
}); 