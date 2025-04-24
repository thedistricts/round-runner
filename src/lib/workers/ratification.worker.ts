import { expose } from 'comlink';
import sortBy from 'lodash/sortBy';
import * as turf from '@turf/turf';
import { VALIDITY } from '$lib/enum';
import type { Feature, LineString, Point } from 'geojson';
import type { GPXGeoJson } from '$lib/stores/gpx.store.d';
import type { LineStringProperties } from '$lib/stores/gpx.store.d';
import type { ValidityPointProperties, ValidityDistance, CoordWithDistance } from './ratification.worker.d';
import type { Distances } from './ratification.worker.d';

export function getValidCoordinate(coords: Distances, validityDistance: ValidityDistance): CoordWithDistance | null {

  const validCoord = coords.reduce((prevCoord: CoordWithDistance | null, currCoord: CoordWithDistance) => {
    if (prevCoord === null || !currCoord.properties.dist || !prevCoord.properties.dist) {
      return currCoord;
    }
		if (currCoord.properties.dist <= prevCoord.properties.dist) {
			return currCoord;
		}
		if (currCoord.properties.dist <= validityDistance[VALIDITY.VALID]) {
      return currCoord;
		}
    return prevCoord;
  }, null);

  if (validCoord) {
    validCoord.properties = {
      ...validCoord.properties,
      valid: getValidityStatus(validCoord.properties.dist, validityDistance)
    };
  }

  return validCoord;
}

export function getValidityStatus(distance: number, validityDistance: ValidityDistance): VALIDITY {
	if (distance <= validityDistance[VALIDITY.VALID]) {
		return VALIDITY.VALID;
	}
	if (distance <= validityDistance[VALIDITY.WARN]) {
		return VALIDITY.WARN;
	}
	return VALIDITY.FAIL;
}

export function getNearestTimePointOnLine(
	line: Feature<LineString, LineStringProperties>,
	point: Feature<Point, ValidityPointProperties>,
	validityDistance: ValidityDistance,
	pointIndex: number,
	routeLength: number
) {
	const isStart = pointIndex === 0;
	const isEnd = pointIndex === routeLength - 1;
	const lineMidIndex = Math.floor(line.geometry.coordinates.length / 2);

	const nearestPoint = turf.nearestPointOnLine(line, point);
	let index = nearestPoint.properties.index || 0;
	let distance = nearestPoint.properties.dist || 0;

	// For start/end points, we need to ensure they're in the correct half of the line
	if ((isStart && index >= lineMidIndex) || (isEnd && index < lineMidIndex)) {
		// If in wrong half, find the nearest point in the correct half
		const validCoords = line.geometry.coordinates.filter((_, i) => 
			isStart ? i < lineMidIndex : i >= lineMidIndex
		);
		const distances = validCoords.map((coord, i) => ({
			dist: turf.distance(point.geometry.coordinates, coord, { units: 'kilometers' }),
			index: isStart ? i : i + lineMidIndex
		}));
		const nearest = sortBy(distances, 'dist')[0];
		if (nearest) {
			distance = nearest.dist;
			index = nearest.index;
			nearestPoint.geometry.coordinates = line.geometry.coordinates[nearest.index];
		}
	}

	const result = {
		type: 'Feature' as const,
		geometry: {
			type: 'Point' as const,
			coordinates: nearestPoint.geometry.coordinates
		},
		properties: {
			...point.properties,
			dist: distance,
			index,
			isStart,
			isEnd,
			valid: VALIDITY.FAIL,
			order: pointIndex + 1,
			notes: point.properties.notes,
			ratify: point.properties.ratify
		}
	};

	result.properties.valid = getValidityStatus(distance, validityDistance);

	return result;
}

export function ratify(
	gpx: GPXGeoJson,
	checkpoints: Feature<Point, ValidityPointProperties>[],
	validityDistance: number
): Feature<Point, ValidityPointProperties>[] {
	const trackLineString = gpx.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const nearestRoutePoints = checkpoints.map((routePoint, index) => {
		const target = getNearestTimePointOnLine(trackLineString, routePoint, {
			[VALIDITY.VALID]: validityDistance,
			[VALIDITY.WARN]: validityDistance,
			[VALIDITY.FAIL]: validityDistance
		}, index, checkpoints.length);
		const time = trackLineString?.properties?.coordinateProperties?.times[target.properties.index];
				
		target.properties = {
			...target.properties,           
			...routePoint.properties,      
			order: index + 1,
			time,
			valid: getValidityStatus(target.properties.dist, {
				[VALIDITY.VALID]: validityDistance,
				[VALIDITY.WARN]: validityDistance,
				[VALIDITY.FAIL]: validityDistance
			})
		};

		return target;
	});

	return nearestRoutePoints as Feature<Point, ValidityPointProperties>[];
}

export function debug(
	gpx: Feature<LineString, LineStringProperties>,
	checkpoints: Feature<Point, ValidityPointProperties>[],
	validityDistance: number
): Feature<Point, ValidityPointProperties>[] {
	const trackLineString = gpx;
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const nearestRoutePoints = checkpoints.map((routePoint, index) => {
		const target = getNearestTimePointOnLine(trackLineString, routePoint, {
			[VALIDITY.VALID]: validityDistance,
			[VALIDITY.WARN]: validityDistance,
			[VALIDITY.FAIL]: validityDistance
		}, index, checkpoints.length);
		const time = trackLineString?.properties?.coordinateProperties?.times[target.properties.index];
				
		target.properties = {
			...target.properties,           
			...routePoint.properties,      
			order: index + 1,
			time,
			valid: getValidityStatus(target.properties.dist, {
				[VALIDITY.VALID]: validityDistance,
				[VALIDITY.WARN]: validityDistance,
				[VALIDITY.FAIL]: validityDistance
			})
		};

		return target;
	});

	return nearestRoutePoints as Feature<Point, ValidityPointProperties>[];
}

expose({ ratify });
