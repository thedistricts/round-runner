import { expose } from 'comlink';
import * as turf from '@turf/turf';

import { VALIDITY } from '$lib/enum';
import { VALIDITY_DISTANCE } from '$lib/const';

// TODO: display length along jorney turf.length
import type {
	RatifyProps,
	RatifyReturn,
	NearestPointOnLineWithValidity,
	GetNearestPointOnLineWithValidityProps
} from './ratification.worker.d';

function getNearestPointOnLineWithValidity({ trackLineString, point: routePoint, order, times, index }: GetNearestPointOnLineWithValidityProps): NearestPointOnLineWithValidity {
	const point = turf.nearestPointOnLine(trackLineString, routePoint);
	point.properties.index = index;

	const distanceAway = point.properties?.dist ?? Infinity;
	const validityDistance = VALIDITY_DISTANCE.get(routePoint.properties?.featureType);
	const time = times?.[index];

	point.properties = {
		...routePoint.properties,
		...point.properties,
		order: order + 1,
		valid: VALIDITY.FAIL,
		time,
	};
	
	if (!validityDistance) throw new Error('Route feature type is not valid');

	if (distanceAway < validityDistance?.[VALIDITY.WARN]) {
		point.properties.valid = VALIDITY.WARN;
	}
	if (distanceAway < validityDistance?.[VALIDITY.VALID]) {
		point.properties.valid = VALIDITY.VALID;
	}
	return point as NearestPointOnLineWithValidity;
}

export function ratify({ track, route }: RatifyProps): RatifyReturn {
	const trackLineString = track.features.find((feature) => feature.geometry.type === 'LineString');
	if (!trackLineString) {
		throw new Error('Feature Collection does not contain a LineString');
	}

	const slicedChunks = route.features.map((_, index) => {
		// NOTE: to ensure we don't mismatch the start with the end 
		// i.e. when the end point of a round is closer to the start than the start point
		// we slice the track in parts and enforce the beginning and finish of the route
		const start = index === 0
			? turf.point(trackLineString.geometry.coordinates[0])
			: route.features[index];
		
		const end = index === route.features.length - 1
			? turf.point(trackLineString.geometry.coordinates[trackLineString.geometry.coordinates.length - 1])
			: route.features[index + 1];
		return turf.lineSlice(start, end, trackLineString);
	});
	
	let totalIndex = 0;
	const nearestRoutePointsTotal = slicedChunks.map((currentChunk, currentChunkIndex) => {
		const nearest = getNearestPointOnLineWithValidity({
			trackLineString: currentChunk,
			times: trackLineString.properties?.coordinateProperties?.times,
			index: totalIndex,
			point: route.features[currentChunkIndex],
			order: currentChunkIndex
		});
		totalIndex += currentChunk.geometry.coordinates.length - 2;
		return nearest;
	});
	
	return nearestRoutePointsTotal;
}

expose({ ratify });
