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

export const getNearestTimePointOnLine = vi.fn((line: any, point: any, validityDistance: Record<VALIDITY, number>, pointIndex: number, routeLength: number, hasDefinedStartEnd: boolean = true) => {
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
      isStart: hasDefinedStartEnd && pointIndex === 0,
      isEnd: hasDefinedStartEnd && pointIndex === routeLength - 1,
      order: pointIndex + 1,
      index: pointIndex
    }
  };
});

export const ratify = vi.fn((
  gpx: GPXGeoJson,
  checkpoints: Feature<Point, PointProperties>[],
  hasDefinedStartEnd: boolean = true
) => {
  if (!gpx.features.some((f) => f.geometry.type === 'LineString')) {
    throw new Error('Feature Collection does not contain a LineString');
  }

  let results = checkpoints.map((point, index) => {
    // Create time based on coordinate position for proper sorting
    const coords = point.geometry.coordinates;
    // Use x-coordinate for time ordering (0, 0.3, 0.7 -> 00:01, 00:02, 00:03)
    const timeOffset = Math.floor(coords[0] * 10) + 1;
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: coords
      },
      properties: {
        ...point.properties,
        dist: 0.01,
        index,
        isStart: hasDefinedStartEnd && index === 0,
        isEnd: hasDefinedStartEnd && index === checkpoints.length - 1,
        valid: VALIDITY.VALID,
        order: index + 1,
        time: `2021-01-01T00:0${timeOffset}:00Z` // Time based on x-coordinate
      }
    };
  });

  // If unordered route, sort by time
  if (!hasDefinedStartEnd) {
    results.sort((a, b) => a.properties.time.localeCompare(b.properties.time));
    results.forEach((point, index) => {
      point.properties.order = index + 1;
    });
  }

  return results;
});

export const debug = vi.fn((
  gpx: Feature<LineString, any>,
  checkpoints: Feature<Point, PointProperties>[],
  validityDistance: number
) => {
  return ratify({ type: 'FeatureCollection', features: [gpx] }, checkpoints, validityDistance);
}); 