
import { expose } from 'comlink';
import sortBy from 'lodash/sortBy';
import * as turf from '@turf/turf';
import type { Feature, LineString } from "@turf/helpers";
import type { LineStringProperties } from '$lib/stores/gpx.store.d';
import type { PointProperties } from '$lib/stores/route.store.d';

import { VALIDITY } from '$lib/enum';
import { VALIDITY_DISTANCE } from '$lib/const';
import type {
	RatifyProps,
	RatifyReturn,
	NearestPointOnLineWithValidity,
	Distances,
	CoordWithDistance,
	ValidityPointProperties,
	ValidityDistance
} from './ratification.worker.d';

function getValidCoordinate(coords: Distances, validityDistance: ValidityDistance): CoordWithDistance | null {
	// TODO: TEST with 12 hour route, validityDistance is being assigned to the point properties

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
  return validCoord;
}

function getNearestTimePointOnLine(line: Feature<LineString, LineStringProperties>, point: Feature<turf.Point, PointProperties >, validityDistance:ValidityDistance, pointIndex: number, routeLength: number) {

	const isStart = pointIndex === 0;
	const isEnd = pointIndex === routeLength - 1;
	const lineMidIndex = Math.floor(line.geometry.coordinates.length / 2);

	const distances = line.geometry.coordinates.map((coordinates, index) => ({
			...point,
			geometry: {
				...point.geometry,
				coordinates
			},
			properties: {
				dist: turf.distance(turf.getGeom(point), coordinates),
				index,
				isStart,
				isEnd,
				valid: VALIDITY.FAIL
		}})
	);
	
	const filteredCoords = distances
		.filter((coord) => {
			return coord.properties.dist <= validityDistance[VALIDITY.WARN] * 2;
		}).filter((coord) => {
			if (isStart) return coord.properties.index < lineMidIndex;
			if (isEnd) return coord.properties.index >= lineMidIndex;
			return true;
		});
	
	// TODO: Do we need this additional sort?
	const sortedCoords = sortBy(filteredCoords, "properties.dist");
	const validPoint = getValidCoordinate(sortedCoords, validityDistance);

	return validPoint;
}

export function ratify({ track, route }: RatifyProps): RatifyReturn {
	const trackLineString = track.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const nearestRoutePoints = route.features.map((routePoint, index) => {
		const validityDistance = VALIDITY_DISTANCE.get(routePoint.properties.featureType) as ValidityDistance;
		const target = getNearestTimePointOnLine(trackLineString, routePoint, validityDistance, index, route.features.length);
		const interpolatedTarget = turf.nearestPointOnLine(trackLineString, routePoint);
	
		const point = target ? target : { ...routePoint, properties: { dist: Infinity } as ValidityPointProperties} ;
		const distanceAway = interpolatedTarget.properties.dist ?? Infinity;
		const time = trackLineString?.properties?.coordinateProperties?.times[point.properties.index];
				
		point.properties = {
			...routePoint.properties,
			...point.properties,
			dist: interpolatedTarget.properties.dist,
			order: index + 1,
			valid: VALIDITY.FAIL,
			time
		};

		console.log(JSON.stringify(point))

		
		if (!validityDistance) {
			throw new Error('Route feature type is not valid');
		}

		if (distanceAway < validityDistance?.[VALIDITY.WARN]) {
			point.properties.valid = VALIDITY.WARN;
		}
		if (distanceAway < validityDistance?.[VALIDITY.VALID]) {
			point.properties.valid = VALIDITY.VALID;
		}
		return point;
	});

	return nearestRoutePoints as NearestPointOnLineWithValidity[];
}

expose({ ratify });
